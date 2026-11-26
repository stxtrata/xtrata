var c1 = Object.defineProperty;
var l1 = (e, t, n) => t in e ? c1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ca = (e, t, n) => l1(e, typeof t != "symbol" ? t + "" : t, n);
var Vn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Xl(e) {
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
      typeof Vn < "u" && Vn || {}, r = {
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
            var F = new AbortController();
            return F.signal;
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
            var N = _.split("="), W = N.shift().replace(/\+/g, " "), F = N.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(W), decodeURIComponent(F));
          }
        }), L;
      }
      function X(m) {
        var L = new h(), _ = m.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var W = N.split(":"), F = W.shift().trim();
          if (F) {
            var ye = W.join(":").trim();
            try {
              L.append(F, ye);
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
      var re = [301, 302, 303, 307, 308];
      Q.redirect = function(m, L) {
        if (re.indexOf(L) === -1)
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
      function q(m, L) {
        return new Promise(function(_, N) {
          var W = new T(m, L);
          if (W.signal && W.signal.aborted)
            return N(new t.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function ye() {
            F.abort();
          }
          F.onload = function() {
            var $ = {
              statusText: F.statusText,
              headers: X(F.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? $.status = 200 : $.status = F.status, $.url = "responseURL" in F ? F.responseURL : $.headers.get("X-Request-URL");
            var R = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              _(new Q(R, $));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
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
          if (F.open(W.method, ce(W.url), !0), W.credentials === "include" ? F.withCredentials = !0 : W.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof h || n.Headers && L.headers instanceof n.Headers)) {
            var Ve = [];
            Object.getOwnPropertyNames(L.headers).forEach(function($) {
              Ve.push(a($)), F.setRequestHeader($, c(L.headers[$]));
            }), W.headers.forEach(function($, R) {
              Ve.indexOf(R) === -1 && F.setRequestHeader(R, $);
            });
          } else
            W.headers.forEach(function($, R) {
              F.setRequestHeader(R, $);
            });
          W.signal && (W.signal.addEventListener("abort", ye), F.onreadystatechange = function() {
            F.readyState === 4 && W.signal.removeEventListener("abort", ye);
          }), F.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = T, n.Response = Q), t.Headers = h, t.Request = T, t.Response = Q, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Vn);
})();
const u1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function d1(e, t) {
  const n = {};
  return Object.assign(n, u1, t), await fetch(e, n);
}
function f1(e) {
  let t = d1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function h1(...e) {
  const { fetchLib: t, middlewares: n } = f1(e);
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
var ea;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ea || (ea = {}));
var Zs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Zs || (Zs = {}));
var xp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xp || (xp = {}));
const p1 = "https://api.mainnet.hiro.so", g1 = "https://api.testnet.hiro.so", y1 = "http://localhost:3999", w1 = ["mainnet", "testnet", "devnet", "mocknet"];
let ta = class {
  constructor(t) {
    this.version = Zs.Mainnet, this.chainId = ea.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Zs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? h1();
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
ta.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new wd();
    case "testnet":
      return new m1();
    case "devnet":
      return new b1();
    case "mocknet":
      return new my();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${w1.join(", ")}`);
  }
};
ta.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ta.fromName(e);
let wd = class extends ta {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? p1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zs.Mainnet, this.chainId = ea.Mainnet;
  }
}, m1 = class extends ta {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? g1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zs.Testnet, this.chainId = ea.Testnet;
  }
}, my = class extends ta {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? y1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Zs.Testnet, this.chainId = ea.Testnet;
  }
};
const b1 = my, by = "xtrata.wallet.bridge.v1", x1 = (e) => typeof e == "object" && e !== null && e.protocol === by, S1 = (e) => x1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", v1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class Ta extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Sp = 12e4;
class A1 {
  constructor(t) {
    Ca(this, "pending", /* @__PURE__ */ new Map());
    Ca(this, "listenTarget");
    Ca(this, "closed", !1);
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
    Ca(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !S1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new Ta("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new Ta("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ta("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = v1(), o = { protocol: by, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ta(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Sp}ms.`
          )
        );
      }, this.options.timeoutMs ?? Sp);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new Ta("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const E1 = ["SP", "SM"], k1 = ["ST", "SN"], $1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return E1.includes(n) ? "mainnet" : k1.includes(n) ? "testnet" : null;
}, I1 = () => {
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
}, L1 = () => typeof window > "u" || !window.localStorage ? I1() : window.localStorage, Mu = "xtrata.v15.1.wallet.session", vp = "mainnet", hl = { isConnected: !1 }, C1 = (e) => e.address ? $1(e.address) ?? e.network : e.network, xy = (e) => !e.isConnected || !e.address ? { ...hl } : C1(e) !== vp ? { ...hl } : {
  isConnected: !0,
  address: e.address,
  network: vp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, T1 = (e) => {
  if (!e)
    return { ...hl };
  try {
    const t = JSON.parse(e);
    return xy(t);
  } catch {
    return { ...hl };
  }
}, B1 = (e) => {
  const t = xy(e);
  return JSON.stringify(t);
}, M1 = (e) => {
  const t = L1();
  return {
    load: () => T1(t.getItem(Mu)),
    save: (n) => {
      t.setItem(Mu, B1(n));
    },
    clear: () => {
      t.removeItem(Mu);
    }
  };
}, N1 = "https://browser.blockstack.org/auth", _1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Sy = ["store_write"], P1 = "blockstack-session", U1 = {
  logLevel: "debug"
}, hi = {
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
Object.freeze(hi);
class ma extends Error {
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
class O1 extends ma {
  constructor(t, n = "") {
    super({ code: hi.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Ap extends ma {
  constructor(t = "") {
    super({ code: hi.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Sc extends ma {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: hi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ep extends ma {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: hi.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class md extends ma {
  constructor(t) {
    super({ code: hi.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class vy extends ma {
  constructor(t) {
    super({ code: hi.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const kp = ["debug", "info", "warn", "error", "none"], bd = {};
for (let e = 0; e < kp.length; e++) {
  const t = kp[e];
  bd[t] = e;
}
class Ki {
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
    return bd[U1.logLevel] <= bd[t];
  }
}
function H1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function D1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Nu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function F1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function j1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function R1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function If(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = j1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    Ki.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = R1(s, e.toString(), n);
    throw Ki.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Is(e, t) {
  return Lf(Fn(e), t);
}
function Fn(e) {
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
  if (rr(e, Uint8Array))
    return BigInt(`0x${Oe(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function z1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function $p(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function cc(e, t = 8) {
  return (typeof e == "bigint" ? e : Fn(e)).toString(16).padStart(t * 2, "0");
}
function Yl(e) {
  return parseInt(e, 16);
}
function Lf(e, t = 16) {
  const n = cc(e, t);
  return vt(n);
}
function G1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function K1(e, t) {
  return e & BigInt(1) << t;
}
function xd(e) {
  return V1(BigInt(`0x${Oe(e)}`), BigInt(e.byteLength * 8));
}
function V1(e, t) {
  return K1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const X1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Oe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += X1[n];
  return t;
}
function vt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = z1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function pi(e) {
  return new TextEncoder().encode(e);
}
function lc(e) {
  return new TextDecoder().decode(e);
}
function Y1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function q1(e) {
  return String.fromCharCode.apply(null, e);
}
function W1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Ip(e) {
  if (e.some(W1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function uo(...e) {
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
  return uo(...e.map((t) => typeof t == "number" ? Ip([t]) : t instanceof Array ? Ip(t) : t));
}
function rr(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Ay = "https://api.mainnet.hiro.so", Ey = "https://api.testnet.hiro.so", ky = "http://localhost:3999", Z1 = "https://hub.blockstack.org", J1 = 33, _u = 32;
function Q1(e) {
  if (e.length < _u * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + _u * 2), r = e.slice(2 + _u * 2);
  return {
    recoveryId: Yl(t),
    r: n,
    s: r
  };
}
function Cf(e) {
  const t = typeof e == "string" ? vt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function e2(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function t2(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function n2(e, t) {
  return e[t];
}
function r2(e, t, n = 0) {
  return e[n] = t, e;
}
function o2(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Js(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const s2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function i2(e, t) {
  const n = {};
  return Object.assign(n, s2, t), await fetch(e, n);
}
function a2(e) {
  let t = i2, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function c2(...e) {
  const { fetchLib: t, middlewares: n } = a2(e);
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
class $y {
  constructor(t = Sy.slice(), n = ((a) => (a = If("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = N1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function l2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Iy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function u2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sd(e.outputLen), Sd(e.blockLen);
}
function d2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function f2(e, t) {
  Iy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: Sd,
  bool: l2,
  bytes: Iy,
  hash: u2,
  exists: d2,
  output: f2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Qr = (e, t) => e << 32 - t | e >>> t, h2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!h2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function p2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Tf(e) {
  if (typeof e == "string" && (e = p2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Ly = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gi(e) {
  const t = (r) => e().update(Tf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Cy = class extends Ly {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, js.hash(t);
    const r = Tf(n);
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
const ql = (e, t, n) => new Cy(e, t).update(n).digest();
ql.create = (e, t) => new Cy(e, t);
function g2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Bf = class extends Ly {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Pu(this.buffer);
  }
  update(t) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Tf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Pu(t);
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
    g2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Pu(t), c = this.outputLen;
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
const y2 = (e, t, n) => e & t ^ ~e & n, w2 = (e, t, n) => e & t ^ e & n ^ t & n, m2 = new Uint32Array([
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
let Ty = class extends Bf {
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
      const w = Zo[d - 15], y = Zo[d - 2], v = Qr(w, 7) ^ Qr(w, 18) ^ w >>> 3, S = Qr(y, 17) ^ Qr(y, 19) ^ y >>> 10;
      Zo[d] = S + Zo[d - 7] + v + Zo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Qr(a, 6) ^ Qr(a, 11) ^ Qr(a, 25), y = h + w + y2(a, c, u) + m2[d] + Zo[d] | 0, S = (Qr(r, 2) ^ Qr(r, 13) ^ Qr(r, 22)) + w2(r, s, o) | 0;
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
}, b2 = class extends Ty {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const na = gi(() => new Ty());
gi(() => new b2());
const x2 = {}, By = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: x2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const mt = BigInt(0), Kt = BigInt(1), vs = BigInt(2), Ra = BigInt(3), Lp = BigInt(8), Ut = Object.freeze({
  a: mt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Kt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Cp = (e, t) => (e + t / vs) / t, vc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Ut, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Kt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Cp(o * e, t), c = Cp(-r * e, t);
    let u = he(e - a * n - c * s, t), h = he(-a * r - c * o, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, Kr = 32, Qs = 32, My = 32, pl = Kr + 1, gl = 2 * Kr + 1;
function Tp(e) {
  const { a: t, b: n } = Ut, r = he(e * e), s = he(r * e);
  return he(s + t * e + n);
}
const Ac = Ut.a === mt;
class Mf extends Error {
  constructor(t) {
    super(t);
  }
}
function Bp(e) {
  if (!(e instanceof kt))
    throw new TypeError("JacobianPoint expected");
}
class kt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? kt.ZERO : new kt(t.x, t.y, Kt);
  }
  static toAffineBatch(t) {
    const n = k2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return kt.toAffineBatch(t).map(kt.fromAffine);
  }
  equals(t) {
    Bp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c);
    return h === d && w === y;
  }
  negate() {
    return new kt(this.x, he(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = he(t * t), o = he(n * n), i = he(o * o), a = t + o, c = he(vs * (he(a * a) - s - i)), u = he(Ra * s), h = he(u * u), d = he(h - vs * c), w = he(u * (c - d) - Lp * i), y = he(vs * n * r);
    return new kt(d, w, y);
  }
  add(t) {
    Bp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === mt || i === mt)
      return this;
    if (n === mt || r === mt)
      return t;
    const c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c), v = he(d - h), S = he(y - w);
    if (v === mt)
      return S === mt ? this.double() : kt.ZERO;
    const I = he(v * v), U = he(v * I), P = he(h * I), A = he(S * S - U - vs * P), T = he(S * (P - A) - w * U), B = he(s * a * v);
    return new kt(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = kt.ZERO;
    if (typeof t == "bigint" && t === mt)
      return n;
    let r = _p(t);
    if (r === Kt)
      return this;
    if (!Ac) {
      let d = n, w = this;
      for (; r > mt; )
        r & Kt && (d = d.add(w)), w = w.double(), r >>= Kt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = vc.splitScalar(r), c = n, u = n, h = this;
    for (; o > mt || a > mt; )
      o & Kt && (c = c.add(h)), a & Kt && (u = u.add(h)), h = h.double(), o >>= Kt, a >>= Kt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new kt(he(u.x * vc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = Ac ? 128 / t + 1 : 256 / t + 1, r = [];
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
    !n && this.equals(kt.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && vd.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = kt.normalizeZ(s), vd.set(n, s)));
    let o = kt.ZERO, i = kt.BASE;
    const a = 1 + (Ac ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Kt);
      const S = y, I = y + Math.abs(v) - 1, U = w % 2 !== 0, P = v < 0;
      v === 0 ? i = i.add(Ec(U, s[S])) : o = o.add(Ec(P, s[I]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = _p(t), s, o;
    if (Ac) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = vc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(u, n);
      h = Ec(i, h), w = Ec(c, w), w = new kt(he(w.x * vc.beta), w.y, w.z), s = h.add(w), o = d.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return kt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(kt.ZERO);
    t == null && (t = o ? Lp : ba(s));
    const i = t, a = he(i * i), c = he(a * i), u = he(n * a), h = he(r * c), d = he(s * i);
    if (o)
      return at.ZERO;
    if (d !== Kt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
kt.BASE = new kt(Ut.Gx, Ut.Gy, Kt);
kt.ZERO = new kt(mt, Kt, mt);
function Ec(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const vd = /* @__PURE__ */ new WeakMap();
class at {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, vd.delete(this);
  }
  hasEvenY() {
    return this.y % vs === mt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = yr(n ? t : t.subarray(1));
    if (!nl(r))
      throw new Error("Point is not on curve");
    const s = Tp(r);
    let o = E2(s);
    const i = (o & Kt) === Kt;
    n ? i && (o = he(-o)) : (t[0] & 1) === 1 !== i && (o = he(-o));
    const a = new at(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = yr(t.subarray(1, Kr + 1)), r = yr(t.subarray(Kr + 1, Kr * 2 + 1)), s = new at(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = fo(t), r = n.length, s = n[0];
    if (r === Kr)
      return this.fromCompressedHex(n);
    if (r === pl && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === gl && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pl} compressed bytes or ${gl} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(ei(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = Py(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Nf(fo(t)), { n: a } = Ut, c = r === 2 || r === 3 ? s + a : s, u = ba(c, a), h = he(-i * u, a), d = he(o * u, a), w = r & 1 ? "03" : "02", y = at.fromHex(w + As(c)), v = at.BASE.multiplyAndAddUnsafe(y, h, d);
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
    if (!nl(n) || !nl(r))
      throw new Error(t);
    const s = he(r * r), o = Tp(n);
    if (he(s - o) !== mt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new at(this.x, he(-this.y));
  }
  double() {
    return kt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return kt.fromAffine(this).add(kt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return kt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = kt.fromAffine(this), o = n === mt || n === Kt || this !== at.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = kt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(kt.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(Ut.Gx, Ut.Gy);
at.ZERO = new at(mt, mt);
function Mp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Np(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ra(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: yr(n), left: e.subarray(t + 2) };
}
function S2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${ra(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Np(e.subarray(2)), { data: r, left: s } = Np(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ra(s)}`);
  return { r: t, s: r };
}
class gr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ra(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new gr(yl(s.slice(0, 64)), yl(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = S2(n ? t : Es(t));
    return new gr(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!sa(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!sa(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Ut.n >> Kt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new gr(this.r, he(-this.s, Ut.n)) : this;
  }
  toDERRawBytes() {
    return Es(this.toDERHex());
  }
  toDERHex() {
    const t = Mp(Ba(this.s)), n = Mp(Ba(this.r)), r = t.length / 2, s = n.length / 2, o = Ba(r), i = Ba(s);
    return `30${Ba(s + r + 4)}02${i}${n}02${o}${t}`;
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
const v2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ra(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += v2[e[n]];
  return t;
}
const A2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function As(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(mt <= e && e < A2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function oa(e) {
  const t = Es(As(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Ba(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function yl(e) {
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
function yr(e) {
  return yl(ra(e));
}
function fo(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Es(e);
}
function _p(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && sa(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function he(e, t = Ut.P) {
  const n = e % t;
  return n >= mt ? n : t + n;
}
function Ar(e, t) {
  const { P: n } = Ut;
  let r = e;
  for (; t-- > mt; )
    r *= r, r %= n;
  return r;
}
function E2(e) {
  const { P: t } = Ut, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = Ar(u, Ra) * u % t, d = Ar(h, Ra) * u % t, w = Ar(d, vs) * c % t, y = Ar(w, r) * w % t, v = Ar(y, s) * y % t, S = Ar(v, i) * v % t, I = Ar(S, a) * S % t, U = Ar(I, i) * v % t, P = Ar(U, Ra) * u % t, A = Ar(P, o) * y % t, T = Ar(A, n) * c % t, B = Ar(T, vs);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function ba(e, t = Ut.P) {
  if (e === mt || t <= mt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = he(e, t), r = t, s = mt, o = Kt;
  for (; n !== mt; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Kt)
    throw new Error("invert: does not exist");
  return he(s, t);
}
function k2(e, t = Ut.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === mt ? o : (n[a] = o, he(o * i, t)), Kt), s = ba(r, t);
  return e.reduceRight((o, i, a) => i === mt ? o : (n[a] = he(o * n[a], t), he(o * i, t)), s), n;
}
function $2(e) {
  const t = e.length * 8 - Qs * 8, n = yr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Nf(e, t = !1) {
  const n = $2(e);
  if (t)
    return n;
  const { n: r } = Ut;
  return n >= r ? n - r : n;
}
let Ji, za;
class Ny {
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
    return za(this.k, ...t);
  }
  checkSync() {
    if (typeof za != "function")
      throw new Mf("hmacSha256Sync needs to be set");
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
function sa(e) {
  return mt < e && e < Ut.n;
}
function nl(e) {
  return mt < e && e < Ut.P;
}
function _y(e, t, n, r = !0) {
  const { n: s } = Ut, o = Nf(e, !0);
  if (!sa(o))
    return;
  const i = ba(o, s), a = at.BASE.multiply(o), c = he(a.x, s);
  if (c === mt)
    return;
  const u = he(i * he(t + n * c, s), s);
  if (u === mt)
    return;
  let h = new gr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Kt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function ei(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Qs)
      throw new Error("Expected 32 bytes of private key");
    t = yl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Qs)
      throw new Error("Expected 32 bytes of private key");
    t = yr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!sa(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function _f(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function Py(e) {
  if (e instanceof gr)
    return e.assertValidity(), e;
  try {
    return gr.fromDER(e);
  } catch {
    return gr.fromCompact(e);
  }
}
function uc(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function I2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function Pp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === pl || r === gl : n ? r === pl * 2 || r === gl * 2 : e instanceof at;
}
function Pf(e, t, n = !1) {
  if (Pp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Pp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = _f(t);
  return r.assertValidity(), r.multiply(ei(e)).toRawBytes(n);
}
function Uy(e) {
  const t = e.length > Kr ? e.slice(0, Kr) : e;
  return yr(t);
}
function L2(e) {
  const t = Uy(e), n = he(t, Ut.n);
  return Oy(n < mt ? t : n);
}
function Oy(e) {
  return oa(e);
}
function Hy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = fo(e), s = ei(t), o = [Oy(s), L2(r)];
  if (n != null) {
    n === !0 && (n = rn.randomBytes(Kr));
    const c = fo(n);
    if (c.length !== Kr)
      throw new Error(`sign: Expected ${Kr} bytes of extra data`);
    o.push(c);
  }
  const i = xs(...o), a = Uy(r);
  return { seed: i, m: a, d: s };
}
function Dy(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function C2(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Hy(e, t, n.extraEntropy), i = new Ny(My, Qs);
  await i.reseed(r);
  let a;
  for (; !(a = _y(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Dy(a, n);
}
function Wl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Hy(e, t, n.extraEntropy), i = new Ny(My, Qs);
  i.reseedSync(r);
  let a;
  for (; !(a = _y(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Dy(a, n);
}
const T2 = { strict: !0 };
function B2(e, t, n, r = T2) {
  let s;
  try {
    s = Py(e), t = fo(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Nf(t);
  let c;
  try {
    c = _f(n);
  } catch {
    return !1;
  }
  const { n: u } = Ut, h = ba(i, u), d = he(a * h, u), w = he(o * h, u), y = at.BASE.multiplyAndAddUnsafe(c, d, w);
  return y ? he(y.x, u) === o : !1;
}
function wl(e) {
  return he(yr(e), Ut.n);
}
class ia {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = fo(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = yr(n.subarray(0, 32)), s = yr(n.subarray(32, 64));
    return new ia(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!nl(t) || !sa(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return As(this.r) + As(this.s);
  }
  toRawBytes() {
    return Es(this.toHex());
  }
}
function M2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class Fy {
  constructor(t, n, r = rn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = fo(t);
    const { x: s, scalar: o } = this.getScalar(ei(n));
    if (this.px = s, this.d = o, this.rand = fo(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : Ut.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return oa(t ^ yr(n));
  }
  finalizeNonce(t) {
    const n = he(yr(t), Ut.n);
    if (n === mt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new ia(t.x, he(n + r * s, Ut.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHash, i = this.initNonce(n, await o(bs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(bs.nonce, i, r, t)), h = wl(await o(bs.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await zy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHashSync, i = this.initNonce(n, o(bs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(bs.nonce, i, r, t)), h = wl(o(bs.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return Gy(d, t, r) || this.error(), d;
  }
}
async function N2(e, t, n) {
  return new Fy(e, t, n).calc();
}
function _2(e, t, n) {
  return new Fy(e, t, n).calcSync();
}
function jy(e, t, n) {
  const r = e instanceof ia, s = r ? e : ia.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: fo(t),
    P: _f(n)
  };
}
function Ry(e, t, n, r) {
  const s = at.BASE.multiplyAndAddUnsafe(t, ei(n), he(-r, Ut.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function zy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = jy(e, t, n), a = wl(await rn.taggedHash(bs.challenge, oa(r), i.toRawX(), o));
    return Ry(r, i, s, a);
  } catch {
    return !1;
  }
}
function Gy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = jy(e, t, n), a = wl(rn.taggedHashSync(bs.challenge, oa(r), i.toRawX(), o));
    return Ry(r, i, s, a);
  } catch (r) {
    if (r instanceof Mf)
      throw r;
    return !1;
  }
}
const P2 = {
  Signature: ia,
  getPublicKey: M2,
  sign: N2,
  verify: zy,
  signSync: _2,
  verifySync: Gy
};
at.BASE._setWindowSize(8);
const ar = {
  node: By,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, kc = {}, rn = {
  bytesToHex: ra,
  hexToBytes: Es,
  concatBytes: xs,
  mod: he,
  invert: ba,
  isValidPrivateKey(e) {
    try {
      return ei(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: oa,
  _normalizePrivateKey: ei,
  hashToPrivateKey: (e) => {
    e = fo(e);
    const t = Qs + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = he(yr(e), Ut.n - Kt) + Kt;
    return oa(n);
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
  randomPrivateKey: () => rn.hashToPrivateKey(rn.randomBytes(Qs + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Ra), n;
  },
  sha256: async (...e) => {
    if (ar.web) {
      const t = await ar.web.subtle.digest("SHA-256", xs(...e));
      return new Uint8Array(t);
    } else if (ar.node) {
      const { createHash: t } = ar.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ar.web) {
      const n = await ar.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = xs(...t), s = await ar.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ar.node) {
      const { createHmac: n } = ar.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = kc[e];
    if (n === void 0) {
      const r = await rn.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = xs(r, r), kc[e] = n;
    }
    return rn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ji != "function")
      throw new Mf("sha256Sync is undefined, you need to set it");
    let n = kc[e];
    if (n === void 0) {
      const r = Ji(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = xs(r, r), kc[e] = n;
    }
    return Ji(n, ...t);
  },
  _JacobianPoint: kt
};
Object.defineProperties(rn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ji;
    },
    set(e) {
      Ji || (Ji = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return za;
    },
    set(e) {
      za || (za = e);
    }
  }
});
const U2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ut,
  Point: at,
  Signature: gr,
  getPublicKey: uc,
  getSharedSecret: Pf,
  recoverPublicKey: I2,
  schnorr: P2,
  sign: C2,
  signSync: Wl,
  utils: rn,
  verify: B2
}, Symbol.toStringTag, { value: "Module" }));
var dc = {};
dc.byteLength = j2;
var O2 = dc.toByteArray = z2, H2 = dc.fromByteArray = V2, oo = [], kr = [], D2 = typeof Uint8Array < "u" ? Uint8Array : Array, Uu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Oi = 0, F2 = Uu.length; Oi < F2; ++Oi)
  oo[Oi] = Uu[Oi], kr[Uu.charCodeAt(Oi)] = Oi;
kr[45] = 62;
kr[95] = 63;
function Ky(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function j2(e) {
  var t = Ky(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function R2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function z2(e) {
  var t, n = Ky(e), r = n[0], s = n[1], o = new D2(R2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = kr[e.charCodeAt(c)] << 18 | kr[e.charCodeAt(c + 1)] << 12 | kr[e.charCodeAt(c + 2)] << 6 | kr[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = kr[e.charCodeAt(c)] << 2 | kr[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = kr[e.charCodeAt(c)] << 10 | kr[e.charCodeAt(c + 1)] << 4 | kr[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function G2(e) {
  return oo[e >> 18 & 63] + oo[e >> 12 & 63] + oo[e >> 6 & 63] + oo[e & 63];
}
function K2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(G2(r));
  return s.join("");
}
function V2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(K2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    oo[t >> 2] + oo[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    oo[t >> 10] + oo[t >> 4 & 63] + oo[t << 2 & 63] + "="
  )), s.join("");
}
function X2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Y2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function q2() {
  if (X2())
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
    throw new Error(Y2);
  }
}
class W2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(uo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(uo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Z2 {
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
async function Vy() {
  const e = await q2();
  return e.name === "subtleCrypto" ? new Z2(e.lib) : new W2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function J2(e) {
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
    for (var re = a.repeat(v); Q < P; ++Q)
      re += e.charAt(A[Q]);
    return re;
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
    for (var re = new Uint8Array(S + (U - Q)), q = S; Q !== U; )
      re[q++] = P[Q++];
    return re;
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
var Xy = J2;
const Q2 = Xy, ex = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var tx = Q2(ex);
const nx = /* @__PURE__ */ wy(tx), rx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yy = Uint8Array.from({ length: 16 }, (e, t) => t), ox = Yy.map((e) => (9 * e + 5) % 16);
let Uf = [Yy], Of = [ox];
for (let e = 0; e < 4; e++)
  for (let t of [Uf, Of])
    t.push(t[e].map((n) => rx[n]));
const qy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), sx = Uf.map((e, t) => e.map((n) => qy[t][n])), ix = Of.map((e, t) => e.map((n) => qy[t][n])), ax = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), cx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $c = (e, t) => e << t | e >>> 32 - t;
function Up(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ic = new Uint32Array(16);
let lx = class extends Bf {
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
      Ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = ax[y], I = cx[y], U = Uf[y], P = Of[y], A = sx[y], T = ix[y];
      for (let B = 0; B < 16; B++) {
        const X = $c(r + Up(y, o, a, u) + Ic[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = $c(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = $c(s + Up(v, i, c, h) + Ic[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = $c(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ux = gi(() => new lx());
function dx(e) {
  return ux(e);
}
const Lc = BigInt(2 ** 32 - 1), Ad = BigInt(32);
function Wy(e, t = !1) {
  return t ? { h: Number(e & Lc), l: Number(e >> Ad & Lc) } : { h: Number(e >> Ad & Lc) | 0, l: Number(e & Lc) | 0 };
}
function fx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Wy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const hx = (e, t) => BigInt(e >>> 0) << Ad | BigInt(t >>> 0), px = (e, t, n) => e >>> n, gx = (e, t, n) => e << 32 - n | t >>> n, yx = (e, t, n) => e >>> n | t << 32 - n, wx = (e, t, n) => e << 32 - n | t >>> n, mx = (e, t, n) => e << 64 - n | t >>> n - 32, bx = (e, t, n) => e >>> n - 32 | t << 64 - n, xx = (e, t) => t, Sx = (e, t) => e, vx = (e, t, n) => e << n | t >>> 32 - n, Ax = (e, t, n) => t << n | e >>> 32 - n, Ex = (e, t, n) => t << n - 32 | e >>> 64 - n, kx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function $x(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ix = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Lx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Cx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Tx = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Bx = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Mx = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: Wy,
  split: fx,
  toBig: hx,
  shrSH: px,
  shrSL: gx,
  rotrSH: yx,
  rotrSL: wx,
  rotrBH: mx,
  rotrBL: bx,
  rotr32H: xx,
  rotr32L: Sx,
  rotlSH: vx,
  rotlSL: Ax,
  rotlBH: Ex,
  rotlBL: kx,
  add: $x,
  add3L: Ix,
  add3H: Lx,
  add4L: Cx,
  add4H: Tx,
  add5H: Mx,
  add5L: Bx
}, [Nx, _x] = et.split([
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
let Zl = class extends Bf {
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
      const T = Jo[A - 15] | 0, B = Qo[A - 15] | 0, X = et.rotrSH(T, B, 1) ^ et.rotrSH(T, B, 8) ^ et.shrSH(T, B, 7), Q = et.rotrSL(T, B, 1) ^ et.rotrSL(T, B, 8) ^ et.shrSL(T, B, 7), re = Jo[A - 2] | 0, q = Qo[A - 2] | 0, m = et.rotrSH(re, q, 19) ^ et.rotrBH(re, q, 61) ^ et.shrSH(re, q, 6), L = et.rotrSL(re, q, 19) ^ et.rotrBL(re, q, 61) ^ et.shrSL(re, q, 6), _ = et.add4L(Q, L, Qo[A - 7], Qo[A - 16]), N = et.add4H(_, X, m, Jo[A - 7], Jo[A - 16]);
      Jo[A] = N | 0, Qo[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), B = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, re = et.add5L(P, B, Q, _x[A], Qo[A]), q = et.add5H(re, U, T, X, Nx[A], Jo[A]), m = re | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), _ = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = et.add3L(m, _, W);
      r = et.add3H(F, q, L, N), s = F | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = et.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = et.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = et.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = et.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    Jo.fill(0), Qo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Px = class extends Zl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ux = class extends Zl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ox = class extends Zl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Hx = gi(() => new Zl());
gi(() => new Px());
gi(() => new Ux());
gi(() => new Ox());
function Zy(e) {
  return na(e);
}
function Dx(e) {
  return Hx(e);
}
const Fx = 0;
rn.hmacSha256Sync = (e, ...t) => {
  const n = ql.create(na, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function jx() {
  return Oe(rn.randomPrivateKey());
}
function Rx(e) {
  const t = na(na(e));
  return nx.encode(uo(e, t).slice(0, e.length + 4));
}
function zx(e, t) {
  return Rx(uo(new Uint8Array([e]), t.slice(0, 20)));
}
function Jy(e, t = Fx) {
  const n = typeof e == "string" ? vt(e) : e, r = dx(Zy(n));
  return zx(t, r);
}
function Qy(e) {
  const t = Cf(e);
  return Oe(uc(t.slice(0, 32), !0));
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = ql.create(na, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var ml;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(ml || (ml = {}));
async function Gx(e, t, n) {
  return await (await Vy()).encrypt("aes-256-cbc", t, e, n);
}
async function Kx(e, t, n) {
  return await (await Vy()).decrypt("aes-256-cbc", t, e, n);
}
function ew(e, t) {
  return ql(na, e, t);
}
function Vx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function tw(e) {
  const t = Dx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Xx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Yx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ml.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ml.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Xx(e))
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
async function qx(e, t, n, r) {
  const s = Yx(e);
  if (!s.result)
    throw s;
  const o = rn.randomPrivateKey(), i = uc(o, !0);
  let a = Pf(o, e, !0);
  a = a.slice(1);
  const c = tw(a), u = rn.randomBytes(16), h = await Gx(u, c.encryptionKey, t), d = uo(u, i, h), w = ew(c.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = Oe(h);
  else if (r === "base64")
    y = H2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Oe(u),
    ephemeralPK: Oe(i),
    cipherText: y,
    mac: Oe(w),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function nw(e, t) {
  if (!t.ephemeralPK)
    throw new Ep("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Pf(e, n, !0);
  r = r.slice(1);
  const s = tw(r), o = vt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = vt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = O2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = uo(o, vt(n), i), c = ew(s.hmacKey, a), u = vt(t.mac);
  if (!Vx(u, c))
    throw new Ep("Decryption failed: failure in MAC check");
  const h = await Kx(o, s.encryptionKey, i);
  return t.wasString ? lc(h) : h;
}
function Wx(e, t) {
  const n = typeof t == "string" ? pi(t) : t, r = Qy(e), s = Zy(n), o = Wl(s, e);
  return {
    signature: Oe(o),
    publicKey: r
  };
}
async function Zx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Qy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? pi(e) : e, i = await qx(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Wx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Jx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return nw(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Bn = {}, aa = {}, Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.decode = Gn.encode = Gn.unescape = Gn.escape = Gn.pad = void 0;
const rw = dc;
function Hf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Gn.pad = Hf;
function ow(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Gn.escape = ow;
function sw(e) {
  return Hf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Gn.unescape = sw;
function Qx(e) {
  return ow((0, rw.fromByteArray)(new TextEncoder().encode(e)));
}
Gn.encode = Qx;
function eS(e) {
  return new TextDecoder().decode((0, rw.toByteArray)(Hf(sw(e))));
}
Gn.decode = eS;
var Jl = {}, Ql = {}, iw = {}, aw = {}, eu = {};
Object.defineProperty(eu, "__esModule", { value: !0 });
eu.crypto = void 0;
eu.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = S, e.bytesToHex = P, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = re, e.bytesToUtf8 = q, e.toBytes = m, e.kdfInputToBytes = L, e.concatBytes = _, e.checkOpts = N, e.createHasher = F, e.createOptHasher = ye, e.createXOFer = ce, e.randomBytes = Ve;
  const t = eu;
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
    for (let Ne = 0, ve = 0; Ne < ue; Ne++, ve += 2) {
      const wt = T($.charCodeAt(ve)), Re = T($.charCodeAt(ve + 1));
      if (wt === void 0 || Re === void 0) {
        const Me = $[ve] + $[ve + 1];
        throw new Error('hex string expected, got non-hex character "' + Me + '" at index ' + ve);
      }
      me[Ne] = wt * 16 + Re;
    }
    return me;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function Q($, R, ue) {
    let me = Date.now();
    for (let Ne = 0; Ne < $; Ne++) {
      ue(Ne);
      const ve = Date.now() - me;
      ve >= 0 && ve < R || (await (0, e.nextTick)(), me += ve);
    }
  }
  function re($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function q($) {
    return new TextDecoder().decode($);
  }
  function m($) {
    return typeof $ == "string" && ($ = re($)), s($), $;
  }
  function L($) {
    return typeof $ == "string" && ($ = re($)), s($), $;
  }
  function _(...$) {
    let R = 0;
    for (let me = 0; me < $.length; me++) {
      const Ne = $[me];
      s(Ne), R += Ne.length;
    }
    const ue = new Uint8Array(R);
    for (let me = 0, Ne = 0; me < $.length; me++) {
      const ve = $[me];
      ue.set(ve, Ne), Ne += ve.length;
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
  function F($) {
    const R = (me) => $().update(m(me)).digest(), ue = $();
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = () => $(), R;
  }
  function ye($) {
    const R = (me, Ne) => $(Ne).update(m(me)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (me) => $(me), R;
  }
  function ce($) {
    const R = (me, Ne) => $(Ne).update(m(me)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (me) => $(me), R;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = ye, e.wrapXOFConstructorWithOpts = ce;
  function Ve($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(aw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = aw;
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
})(iw);
const Hi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function cw(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function yi(e, ...t) {
  if (!cw(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function tS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ed(e.outputLen), Ed(e.blockLen);
}
function kd(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function lw(e, t) {
  yi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function nS(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function rS(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function bl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function rl(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Or(e, t) {
  return e << 32 - t | e >>> t;
}
function oS(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Df = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ff(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const uw = Df ? (e) => e : (e) => Ff(e), sS = uw;
function dw(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Ff(e[t]);
  return e;
}
const iS = Df ? (e) => e : dw, fw = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", aS = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function jf(e) {
  if (yi(e), fw)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += aS[e[n]];
  return t;
}
const $o = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Op(e) {
  if (e >= $o._0 && e <= $o._9)
    return e - $o._0;
  if (e >= $o.A && e <= $o.F)
    return e - ($o.A - 10);
  if (e >= $o.a && e <= $o.f)
    return e - ($o.a - 10);
}
function cS(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (fw)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Op(e.charCodeAt(o)), a = Op(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const hw = async () => {
};
async function lS(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await hw(), r += o);
  }
}
function Rf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function uS(e) {
  return new TextDecoder().decode(e);
}
function fc(e) {
  return typeof e == "string" && (e = Rf(e)), yi(e), e;
}
function dS(e) {
  return typeof e == "string" && (e = Rf(e)), yi(e), e;
}
function fS(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    yi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function hS(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let pw = class {
};
function tu(e) {
  const t = (r) => e().update(fc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function gw(e) {
  const t = (r, s) => e(s).update(fc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function yw(e) {
  const t = (r, s) => e(s).update(fc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const pS = tu, gS = gw, yS = yw;
function wS(e = 32) {
  if (Hi && typeof Hi.getRandomValues == "function")
    return Hi.getRandomValues(new Uint8Array(e));
  if (Hi && typeof Hi.randomBytes == "function")
    return Uint8Array.from(Hi.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const mS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: pw,
  abytes: yi,
  aexists: kd,
  ahash: tS,
  anumber: Ed,
  aoutput: lw,
  asyncLoop: lS,
  byteSwap: Ff,
  byteSwap32: dw,
  byteSwapIfBE: sS,
  bytesToHex: jf,
  bytesToUtf8: uS,
  checkOpts: hS,
  clean: bl,
  concatBytes: fS,
  createHasher: tu,
  createOptHasher: gw,
  createView: rl,
  createXOFer: yw,
  hexToBytes: cS,
  isBytes: cw,
  isLE: Df,
  kdfInputToBytes: dS,
  nextTick: hw,
  randomBytes: wS,
  rotl: oS,
  rotr: Or,
  swap32IfBE: iS,
  swap8IfBE: uw,
  toBytes: fc,
  u32: rS,
  u8: nS,
  utf8ToBytes: Rf,
  wrapConstructor: pS,
  wrapConstructorWithOpts: gS,
  wrapXOFConstructorWithOpts: yS
}, Symbol.toStringTag, { value: "Module" }));
function bS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function xS(e, t, n) {
  return e & t ^ ~e & n;
}
function SS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class vS extends pw {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = rl(this.buffer);
  }
  update(t) {
    kd(this), t = fc(t), yi(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = rl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    kd(this), lw(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, bl(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    bS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = rl(t), c = this.outputLen;
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
]), AS = /* @__PURE__ */ Uint32Array.from([
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
let zf = class extends vS {
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
      const w = ns[d - 15], y = ns[d - 2], v = Or(w, 7) ^ Or(w, 18) ^ w >>> 3, S = Or(y, 17) ^ Or(y, 19) ^ y >>> 10;
      ns[d] = S + ns[d - 7] + v + ns[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Or(a, 6) ^ Or(a, 11) ^ Or(a, 25), y = h + w + xS(a, c, u) + AS[d] + ns[d] | 0, S = (Or(r, 2) ^ Or(r, 13) ^ Or(r, 22)) + SS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    bl(ns);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bl(this.buffer);
  }
}, ww = class extends zf {
  constructor() {
    super(28), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
  }
};
const ES = /* @__PURE__ */ tu(() => new zf()), kS = /* @__PURE__ */ tu(() => new ww()), $S = zf, Gf = ES, IS = ww, LS = kS, CS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: IS,
  SHA256: $S,
  sha224: LS,
  sha256: Gf
}, Symbol.toStringTag, { value: "Module" })), nu = /* @__PURE__ */ Xl(CS), TS = /* @__PURE__ */ Xl(U2);
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.joseToDer = ca.derToJose = void 0;
const mw = dc, bw = Gn;
function Ou(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const BS = {
  ES256: Ou(256),
  ES384: Ou(384),
  ES512: Ou(521)
};
function xw(e) {
  const t = BS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const xl = 128, Sw = 0, MS = 32, NS = 16, _S = 2, vw = NS | MS | Sw << 6, Sl = _S | Sw << 6;
function Aw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, mw.toByteArray)((0, bw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function PS(e, t) {
  const n = Aw(e), r = xw(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== vw)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (xl | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Sl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== Sl)
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
  return v.set(n.subarray(d + Math.max(-y, 0), d + h), i), (0, bw.escape)((0, mw.fromByteArray)(v));
}
ca.derToJose = PS;
function Hp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= xl && --r, r;
}
function US(e, t) {
  e = Aw(e);
  const n = xw(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Hp(e, 0, n), o = Hp(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < xl, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = vw, u ? h[d++] = c : (h[d++] = xl | 1, h[d++] = c & 255), h[d++] = Sl, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = Sl, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
ca.joseToDer = US;
var Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
Po.InvalidTokenError = Po.MissingParametersError = void 0;
class OS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Po.MissingParametersError = OS;
class HS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Po.InvalidTokenError = HS;
const hc = /* @__PURE__ */ Xl(mS);
Object.defineProperty(Ql, "__esModule", { value: !0 });
Ql.SECP256K1Client = void 0;
const DS = iw, FS = nu, ol = TS, Dp = ca, Fp = Po, jp = hc;
ol.utils.hmacSha256Sync = (e, ...t) => {
  const n = DS.hmac.create(FS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Ew {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, jp.bytesToHex)(ol.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Fp.MissingParametersError("a signing input hash and private key are all required");
    const s = ol.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, jp.bytesToHex)(s);
    if (r === "jose")
      return (0, Dp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Dp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Fp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ol.verify(n, t, r, { strict: !1 });
  }
}
Ql.SECP256K1Client = Ew;
Ew.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Ql;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Jl);
var ti = {};
const jS = /* @__PURE__ */ Xl(By);
var RS = Vn && Vn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.hashSha256Async = ti.hashSha256 = void 0;
const zS = nu;
function kw(e) {
  return (0, zS.sha256)(e);
}
ti.hashSha256 = kw;
function GS(e) {
  return RS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = jS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(kw(e));
    }
  });
}
ti.hashSha256Async = GS;
var KS = Vn && Vn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.TokenSigner = aa.createUnsecuredToken = void 0;
const $d = Gn, Rp = Jl, VS = Po, zp = ti;
function Id(e, t) {
  const n = [], r = $d.encode(JSON.stringify(t));
  n.push(r);
  const s = $d.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function XS(e) {
  return Id(e, { typ: "JWT", alg: "none" }) + ".";
}
aa.createUnsecuredToken = XS;
class YS {
  constructor(t, n) {
    if (!(t && n))
      throw new VS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Rp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Rp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Id(t, s), i = (0, zp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return KS(this, void 0, void 0, function* () {
      const s = this.header(r), o = Id(t, s), i = yield (0, zp.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [$d.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
aa.TokenSigner = YS;
var ru = {};
Object.defineProperty(ru, "__esModule", { value: !0 });
ru.TokenVerifier = void 0;
const qS = Gn, Gp = Jl, WS = Po, Cc = ti;
class ZS {
  constructor(t, n) {
    if (!(t && n))
      throw new WS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Gp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Gp.cryptoClients[t], this.rawPublicKey = n;
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
      return (0, Cc.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Cc.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), qS.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Cc.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Cc.hashSha256)(r);
      return o(i);
    }
  }
}
ru.TokenVerifier = ZS;
var ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
ou.decodeToken = void 0;
const Tc = Gn;
function JS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(Tc.decode(t[0])), r = JSON.parse(Tc.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = Tc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(Tc.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
ou.decodeToken = JS;
(function(e) {
  var t = Vn && Vn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = Vn && Vn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(aa, e), n(ru, e), n(ou, e), n(Po, e), n(Jl, e);
})(Bn);
function QS(e) {
  return `did:btc-addr:${e}`;
}
function ev(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Ap("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Ap('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function $w(e) {
  if (e)
    return ev(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const tv = "1.4.0";
function nv() {
  return jx();
}
function rv(e, t, n, r = Sy.slice(), s, o = H1().getTime(), i = {}) {
  const a = (y) => {
    const v = If("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: F1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: tv,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Bn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = Jy(u);
  return c.iss = QS(h), new Bn.TokenSigner("ES256k", e).sign(c);
}
async function Kp(e, t) {
  const n = lc(vt(t)), r = JSON.parse(n), s = await nw(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function ov(e) {
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
function sv(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = $w(t.iss);
  if (n.length === 1) {
    if (Jy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function iv(e) {
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
function av(e) {
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
function cv(e) {
  const t = [
    av(e),
    iv(e),
    ov(e),
    sv(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Vp = "1.0.0";
class ks {
  constructor(t) {
    this.version = Vp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Vp)
      throw new md(`JSON data version ${t.version} not supported by SessionData`);
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
class Iw {
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
class Xp extends Iw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new ks({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new vy("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ks({})), !0;
  }
}
class Yp extends Iw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = P1, !localStorage.getItem(this.key)) {
      const r = new ks({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new vy("No session data was found in localStorage");
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
var Wa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Wa || (Wa = {}));
var vl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(vl || (vl = {}));
Wa.Mainnet;
var No;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(No || (No = {}));
var ao;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ao || (ao = {}));
No.Mainnet;
const Lw = {
  chainId: Wa.Mainnet,
  transactionVersion: No.Mainnet,
  peerNetworkId: vl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ao.MainnetSingleSig,
    multiSig: ao.MainnetMultiSig
  },
  client: { baseUrl: Ay }
}, Ld = {
  chainId: Wa.Testnet,
  transactionVersion: No.Testnet,
  peerNetworkId: vl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ao.TestnetSingleSig,
    multiSig: ao.TestnetMultiSig
  },
  client: { baseUrl: Ey }
}, sl = {
  ...Ld,
  addressVersion: { ...Ld.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ky }
}, lv = {
  ...sl,
  addressVersion: { ...sl.addressVersion },
  client: { ...sl.client }
};
function uv(e) {
  switch (e) {
    case "mainnet":
      return Lw;
    case "testnet":
      return Ld;
    case "devnet":
      return sl;
    case "mocknet":
      return lv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Cw(e) {
  return typeof e == "string" ? uv(e) : e;
}
var qp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qp || (qp = {}));
var Wp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Wp || (Wp = {}));
var Hr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Hr || (Hr = {}));
const Hu = ["onChainOnly", "offChainOnly", "any"];
Hu[0] + "", Hr.OnChainOnly, Hu[1] + "", Hr.OffChainOnly, Hu[2] + "", Hr.Any, Hr.OnChainOnly + "", Hr.OnChainOnly, Hr.OffChainOnly + "", Hr.OffChainOnly, Hr.Any + "", Hr.Any;
var Zp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Jp || (Jp = {}));
var Qp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Qp || (Qp = {}));
var Bo;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Bo || (Bo = {}));
var e0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(e0 || (e0 = {}));
var t0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(r0 || (r0 = {}));
var o0;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(o0 || (o0 = {}));
var s0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(s0 || (s0 = {}));
var i0;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(i0 || (i0 = {}));
var a0;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(c0 || (c0 = {}));
function Cd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function dv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Tw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function fv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cd(e.outputLen), Cd(e.blockLen);
}
function hv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function pv(e, t) {
  Tw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rs = {
  number: Cd,
  bool: dv,
  bytes: Tw,
  hash: fv,
  exists: hv,
  output: pv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Du = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), eo = (e, t) => e << 32 - t | e >>> t, gv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!gv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function yv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Kf(e) {
  if (typeof e == "string" && (e = yv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Bw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wi(e) {
  const t = (r) => e().update(Kf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Mw = class extends Bw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Rs.hash(t);
    const r = Kf(n);
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
    return Rs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Rs.exists(this), Rs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Nw = (e, t, n) => new Mw(e, t).update(n).digest();
Nw.create = (e, t) => new Mw(e, t);
function wv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Vf = class extends Bw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Du(this.buffer);
  }
  update(t) {
    Rs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Kf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Du(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Rs.exists(this), Rs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    wv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Du(t), c = this.outputLen;
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
const mv = (e, t, n) => e & t ^ ~e & n, bv = (e, t, n) => e & t ^ e & n ^ t & n, xv = new Uint32Array([
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
let _w = class extends Vf {
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
      const w = os[d - 15], y = os[d - 2], v = eo(w, 7) ^ eo(w, 18) ^ w >>> 3, S = eo(y, 17) ^ eo(y, 19) ^ y >>> 10;
      os[d] = S + os[d - 7] + v + os[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = eo(a, 6) ^ eo(a, 11) ^ eo(a, 25), y = h + w + mv(a, c, u) + xv[d] + os[d] | 0, S = (eo(r, 2) ^ eo(r, 13) ^ eo(r, 22)) + bv(r, s, o) | 0;
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
}, Sv = class extends _w {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Pw = wi(() => new _w());
wi(() => new Sv());
var mi = {}, Xf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = hc;
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
})(Xf);
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.c32checkDecode = ni.c32checkEncode = void 0;
const l0 = nu, u0 = hc, Ga = Xf;
function Uw(e) {
  const t = (0, l0.sha256)((0, l0.sha256)((0, u0.hexToBytes)(e)));
  return (0, u0.bytesToHex)(t.slice(0, 4));
}
function vv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Uw(`${n}${t}`), s = (0, Ga.c32encode)(`${t}${r}`);
  return `${Ga.c32[e]}${s}`;
}
ni.c32checkEncode = vv;
function Av(e) {
  e = (0, Ga.c32normalize)(e);
  const t = (0, Ga.c32decode)(e.slice(1)), n = e[0], r = Ga.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Uw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
ni.c32checkDecode = Av;
var Ow = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
la.decode = la.encode = void 0;
const Al = nu, d0 = hc, Hw = Xy, Dw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Ev(e, t = "00") {
  const n = typeof e == "string" ? (0, d0.hexToBytes)(e) : e, r = typeof t == "string" ? (0, d0.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Al.sha256)((0, Al.sha256)(new Uint8Array([...r, ...n])));
  return Hw(Dw).encode([...r, ...n, ...s.slice(0, 4)]);
}
la.encode = Ev;
function kv(e) {
  const t = Hw(Dw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Al.sha256)((0, Al.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
la.decode = kv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = ni, n = la, r = hc;
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
})(Ow);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Xf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = ni;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ow;
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
})(mi);
function $v(e, t) {
  switch (t = Cw(t ?? Lw), e) {
    case Bo.P2PKH:
      switch (t.transactionVersion) {
        case No.Mainnet:
          return ao.MainnetSingleSig;
        case No.Testnet:
          return ao.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Bo.P2SH:
    case Bo.P2SHNonSequential:
    case Bo.P2WPKH:
    case Bo.P2WSH:
    case Bo.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case No.Mainnet:
          return ao.MainnetMultiSig;
        case No.Testnet:
          return ao.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const Iv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fw = Uint8Array.from({ length: 16 }, (e, t) => t), Lv = Fw.map((e) => (9 * e + 5) % 16);
let Yf = [Fw], qf = [Lv];
for (let e = 0; e < 4; e++)
  for (let t of [Yf, qf])
    t.push(t[e].map((n) => Iv[n]));
const jw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Cv = Yf.map((e, t) => e.map((n) => jw[t][n])), Tv = qf.map((e, t) => e.map((n) => jw[t][n])), Bv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Mv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Bc = (e, t) => e << t | e >>> 32 - t;
function f0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Mc = new Uint32Array(16);
let Nv = class extends Vf {
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
      Mc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = Bv[y], I = Mv[y], U = Yf[y], P = qf[y], A = Cv[y], T = Tv[y];
      for (let B = 0; B < 16; B++) {
        const X = Bc(r + f0(y, o, a, u) + Mc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Bc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Bc(s + f0(v, i, c, h) + Mc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Bc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Mc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const _v = wi(() => new Nv()), Nc = BigInt(2 ** 32 - 1), Td = BigInt(32);
function Rw(e, t = !1) {
  return t ? { h: Number(e & Nc), l: Number(e >> Td & Nc) } : { h: Number(e >> Td & Nc) | 0, l: Number(e & Nc) | 0 };
}
function Pv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Rw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Uv = (e, t) => BigInt(e >>> 0) << Td | BigInt(t >>> 0), Ov = (e, t, n) => e >>> n, Hv = (e, t, n) => e << 32 - n | t >>> n, Dv = (e, t, n) => e >>> n | t << 32 - n, Fv = (e, t, n) => e << 32 - n | t >>> n, jv = (e, t, n) => e << 64 - n | t >>> n - 32, Rv = (e, t, n) => e >>> n - 32 | t << 64 - n, zv = (e, t) => t, Gv = (e, t) => e, Kv = (e, t, n) => e << n | t >>> 32 - n, Vv = (e, t, n) => t << n | e >>> 32 - n, Xv = (e, t, n) => t << n - 32 | e >>> 64 - n, Yv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function qv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Wv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Zv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Jv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Qv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, eA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), tA = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: Rw,
  split: Pv,
  toBig: Uv,
  shrSH: Ov,
  shrSL: Hv,
  rotrSH: Dv,
  rotrSL: Fv,
  rotrBH: jv,
  rotrBL: Rv,
  rotr32H: zv,
  rotr32L: Gv,
  rotlSH: Kv,
  rotlSL: Vv,
  rotlBH: Xv,
  rotlBL: Yv,
  add: qv,
  add3L: Wv,
  add3H: Zv,
  add4L: Jv,
  add4H: Qv,
  add5H: tA,
  add5L: eA
}, [nA, rA] = tt.split([
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
let su = class extends Vf {
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
      const T = ss[A - 15] | 0, B = is[A - 15] | 0, X = tt.rotrSH(T, B, 1) ^ tt.rotrSH(T, B, 8) ^ tt.shrSH(T, B, 7), Q = tt.rotrSL(T, B, 1) ^ tt.rotrSL(T, B, 8) ^ tt.shrSL(T, B, 7), re = ss[A - 2] | 0, q = is[A - 2] | 0, m = tt.rotrSH(re, q, 19) ^ tt.rotrBH(re, q, 61) ^ tt.shrSH(re, q, 6), L = tt.rotrSL(re, q, 19) ^ tt.rotrBL(re, q, 61) ^ tt.shrSL(re, q, 6), _ = tt.add4L(Q, L, is[A - 7], is[A - 16]), N = tt.add4H(_, X, m, ss[A - 7], ss[A - 16]);
      ss[A] = N | 0, is[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), B = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, re = tt.add5L(P, B, Q, rA[A], is[A]), q = tt.add5H(re, U, T, X, nA[A], ss[A]), m = re | 0, L = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), _ = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = tt.add3L(m, _, W);
      r = tt.add3H(F, q, L, N), s = F | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = tt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = tt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = tt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = tt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, oA = class extends su {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, sA = class extends su {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, iA = class extends su {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
wi(() => new su());
wi(() => new oA());
wi(() => new sA());
wi(() => new iA());
var El = { exports: {} };
El.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", S = "[object Promise]", I = "[object RegExp]", U = "[object Set]", P = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", X = "[object DataView]", Q = "[object Float32Array]", re = "[object Float64Array]", q = "[object Int8Array]", m = "[object Int16Array]", L = "[object Int32Array]", _ = "[object Uint8Array]", N = "[object Uint8ClampedArray]", W = "[object Uint16Array]", F = "[object Uint32Array]", ye = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Ve = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[B] = R[X] = R[a] = R[c] = R[Q] = R[re] = R[q] = R[m] = R[L] = R[w] = R[y] = R[v] = R[I] = R[U] = R[P] = R[A] = R[_] = R[N] = R[W] = R[F] = !0, R[u] = R[h] = R[T] = !1;
  var ue = typeof Vn == "object" && Vn && Vn.Object === Object && Vn, me = typeof self == "object" && self && self.Object === Object && self, Ne = ue || me || Function("return this")(), ve = t && !t.nodeType && t, wt = ve && !0 && e && !e.nodeType && e, Re = wt && wt.exports === ve;
  function Me(b, M) {
    return b.set(M[0], M[1]), b;
  }
  function _e(b, M) {
    return b.add(M), b;
  }
  function Mn(b, M) {
    for (var K = -1, be = b ? b.length : 0; ++K < be && M(b[K], K, b) !== !1; )
      ;
    return b;
  }
  function vn(b, M) {
    for (var K = -1, be = M.length, Jt = b.length; ++K < be; )
      b[Jt + K] = M[K];
    return b;
  }
  function pt(b, M, K, be) {
    for (var Jt = -1, Nn = b ? b.length : 0; ++Jt < Nn; )
      K = M(K, b[Jt], Jt, b);
    return K;
  }
  function Lt(b, M) {
    for (var K = -1, be = Array(b); ++K < b; )
      be[K] = M(K);
    return be;
  }
  function Ot(b, M) {
    return b == null ? void 0 : b[M];
  }
  function z(b) {
    var M = !1;
    if (b != null && typeof b.toString != "function")
      try {
        M = !!(b + "");
      } catch {
      }
    return M;
  }
  function O(b) {
    var M = -1, K = Array(b.size);
    return b.forEach(function(be, Jt) {
      K[++M] = [Jt, be];
    }), K;
  }
  function ee(b, M) {
    return function(K) {
      return b(M(K));
    };
  }
  function ne(b) {
    var M = -1, K = Array(b.size);
    return b.forEach(function(be) {
      K[++M] = be;
    }), K;
  }
  var le = Array.prototype, bt = Function.prototype, He = Object.prototype, De = Ne["__core-js_shared__"], Bt = function() {
    var b = /[^.]+$/.exec(De && De.keys && De.keys.IE_PROTO || "");
    return b ? "Symbol(src)_1." + b : "";
  }(), Fe = bt.toString, Ee = He.hasOwnProperty, Qe = He.toString, Ye = RegExp(
    "^" + Fe.call(Ee).replace(ye, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), We = Re ? Ne.Buffer : void 0, Rt = Ne.Symbol, dn = Ne.Uint8Array, Yn = ee(Object.getPrototypeOf, Object), pn = Object.create, Mt = He.propertyIsEnumerable, qn = le.splice, jn = Object.getOwnPropertySymbols, Wr = We ? We.isBuffer : void 0, Cr = ee(Object.keys, Object), An = or(Ne, "DataView"), En = or(Ne, "Map"), jt = or(Ne, "Promise"), gn = or(Ne, "Set"), je = or(Ne, "WeakMap"), on = or(Object, "create"), yo = sr(An), Zr = sr(En), E = sr(jt), H = sr(gn), V = sr(je), D = Rt ? Rt.prototype : void 0, J = D ? D.valueOf : void 0;
  function oe(b) {
    var M = -1, K = b ? b.length : 0;
    for (this.clear(); ++M < K; ) {
      var be = b[M];
      this.set(be[0], be[1]);
    }
  }
  function Le() {
    this.__data__ = on ? on(null) : {};
  }
  function Ae(b) {
    return this.has(b) && delete this.__data__[b];
  }
  function ze(b) {
    var M = this.__data__;
    if (on) {
      var K = M[b];
      return K === r ? void 0 : K;
    }
    return Ee.call(M, b) ? M[b] : void 0;
  }
  function Ct(b) {
    var M = this.__data__;
    return on ? M[b] !== void 0 : Ee.call(M, b);
  }
  function qe(b, M) {
    var K = this.__data__;
    return K[b] = on && M === void 0 ? r : M, this;
  }
  oe.prototype.clear = Le, oe.prototype.delete = Ae, oe.prototype.get = ze, oe.prototype.has = Ct, oe.prototype.set = qe;
  function dt(b) {
    var M = -1, K = b ? b.length : 0;
    for (this.clear(); ++M < K; ) {
      var be = b[M];
      this.set(be[0], be[1]);
    }
  }
  function xt() {
    this.__data__ = [];
  }
  function gt(b) {
    var M = this.__data__, K = wo(M, b);
    if (K < 0)
      return !1;
    var be = M.length - 1;
    return K == be ? M.pop() : qn.call(M, K, 1), !0;
  }
  function Nt(b) {
    var M = this.__data__, K = wo(M, b);
    return K < 0 ? void 0 : M[K][1];
  }
  function C(b) {
    return wo(this.__data__, b) > -1;
  }
  function $e(b, M) {
    var K = this.__data__, be = wo(K, b);
    return be < 0 ? K.push([b, M]) : K[be][1] = M, this;
  }
  dt.prototype.clear = xt, dt.prototype.delete = gt, dt.prototype.get = Nt, dt.prototype.has = C, dt.prototype.set = $e;
  function Ke(b) {
    var M = -1, K = b ? b.length : 0;
    for (this.clear(); ++M < K; ) {
      var be = b[M];
      this.set(be[0], be[1]);
    }
  }
  function Tr() {
    this.__data__ = {
      hash: new oe(),
      map: new (En || dt)(),
      string: new oe()
    };
  }
  function Br(b) {
    return sn(this, b).delete(b);
  }
  function ct(b) {
    return sn(this, b).get(b);
  }
  function Wt(b) {
    return sn(this, b).has(b);
  }
  function Ai(b, M) {
    return sn(this, b).set(b, M), this;
  }
  Ke.prototype.clear = Tr, Ke.prototype.delete = Br, Ke.prototype.get = ct, Ke.prototype.has = Wt, Ke.prototype.set = Ai;
  function br(b) {
    this.__data__ = new dt(b);
  }
  function Ho() {
    this.__data__ = new dt();
  }
  function Wn(b) {
    return this.__data__.delete(b);
  }
  function Zn(b) {
    return this.__data__.get(b);
  }
  function kn(b) {
    return this.__data__.has(b);
  }
  function Mr(b, M) {
    var K = this.__data__;
    if (K instanceof dt) {
      var be = K.__data__;
      if (!En || be.length < n - 1)
        return be.push([b, M]), this;
      K = this.__data__ = new Ke(be);
    }
    return K.set(b, M), this;
  }
  br.prototype.clear = Ho, br.prototype.delete = Wn, br.prototype.get = Zn, br.prototype.has = kn, br.prototype.set = Mr;
  function Ts(b, M) {
    var K = Us(b) || Ps(b) ? Lt(b.length, String) : [], be = K.length, Jt = !!be;
    for (var Nn in b)
      Ee.call(b, Nn) && !(Jt && (Nn == "length" || Li(Nn, be))) && K.push(Nn);
    return K;
  }
  function ft(b, M, K) {
    var be = b[M];
    (!(Ee.call(b, M) && zo(be, K)) || K === void 0 && !(M in b)) && (b[M] = K);
  }
  function wo(b, M) {
    for (var K = b.length; K--; )
      if (zo(b[K][0], M))
        return K;
    return -1;
  }
  function Ei(b, M) {
    return b && Sr(M, xe(M), b);
  }
  function mo(b, M, K, be, Jt, Nn, _r) {
    var _n;
    if (be && (_n = Nn ? be(b, Jt, Nn, _r) : be(b)), _n !== void 0)
      return _n;
    if (!Y(b))
      return b;
    var wc = Us(b);
    if (wc) {
      if (_n = jo(b), !M)
        return Ns(b, _n);
    } else {
      var Jr = Nr(b), Pr = Jr == h || Jr == d;
      if (G(b))
        return Bs(b, M);
      if (Jr == v || Jr == o || Pr && !Nn) {
        if (z(b))
          return Nn ? b : {};
        if (_n = vo(Pr ? {} : b), !M)
          return Ii(b, Ei(_n, b));
      } else {
        if (!R[Jr])
          return Nn ? b : {};
        _n = Ao(b, Jr, mo, M);
      }
    }
    _r || (_r = new br());
    var $a = _r.get(b);
    if ($a)
      return $a;
    if (_r.set(b, _n), !wc)
      var Go = K ? ka(b) : xe(b);
    return Mn(Go || b, function(Ti, Os) {
      Go && (Os = Ti, Ti = b[Os]), ft(_n, Os, mo(Ti, M, K, be, Os, b, _r));
    }), _n;
  }
  function ki(b) {
    return Y(b) ? pn(b) : {};
  }
  function $n(b, M, K) {
    var be = M(b);
    return Us(b) ? be : vn(be, K(b));
  }
  function Do(b) {
    return Qe.call(b);
  }
  function bo(b) {
    if (!Y(b) || vr(b))
      return !1;
    var M = te(b) || z(b) ? Ye : Ve;
    return M.test(sr(b));
  }
  function $i(b) {
    if (!Ci(b))
      return Cr(b);
    var M = [];
    for (var K in Object(b))
      Ee.call(b, K) && K != "constructor" && M.push(K);
    return M;
  }
  function Bs(b, M) {
    if (M)
      return b.slice();
    var K = new b.constructor(b.length);
    return b.copy(K), K;
  }
  function xo(b) {
    var M = new b.constructor(b.byteLength);
    return new dn(M).set(new dn(b)), M;
  }
  function In(b, M) {
    var K = M ? xo(b.buffer) : b.buffer;
    return new b.constructor(K, b.byteOffset, b.byteLength);
  }
  function Rn(b, M, K) {
    var be = M ? K(O(b), !0) : O(b);
    return pt(be, Me, new b.constructor());
  }
  function Fo(b) {
    var M = new b.constructor(b.source, ce.exec(b));
    return M.lastIndex = b.lastIndex, M;
  }
  function xr(b, M, K) {
    var be = M ? K(ne(b), !0) : ne(b);
    return pt(be, _e, new b.constructor());
  }
  function Ms(b) {
    return J ? Object(J.call(b)) : {};
  }
  function So(b, M) {
    var K = M ? xo(b.buffer) : b.buffer;
    return new b.constructor(K, b.byteOffset, b.length);
  }
  function Ns(b, M) {
    var K = -1, be = b.length;
    for (M || (M = Array(be)); ++K < be; )
      M[K] = b[K];
    return M;
  }
  function Sr(b, M, K, be) {
    K || (K = {});
    for (var Jt = -1, Nn = M.length; ++Jt < Nn; ) {
      var _r = M[Jt], _n = void 0;
      ft(K, _r, _n === void 0 ? b[_r] : _n);
    }
    return K;
  }
  function Ii(b, M) {
    return Sr(b, Zt(b), M);
  }
  function ka(b) {
    return $n(b, xe, Zt);
  }
  function sn(b, M) {
    var K = b.__data__;
    return Ro(M) ? K[typeof M == "string" ? "string" : "hash"] : K.map;
  }
  function or(b, M) {
    var K = Ot(b, M);
    return bo(K) ? K : void 0;
  }
  var Zt = jn ? ee(jn, Object) : Te, Nr = Do;
  (An && Nr(new An(new ArrayBuffer(1))) != X || En && Nr(new En()) != w || jt && Nr(jt.resolve()) != S || gn && Nr(new gn()) != U || je && Nr(new je()) != T) && (Nr = function(b) {
    var M = Qe.call(b), K = M == v ? b.constructor : void 0, be = K ? sr(K) : void 0;
    if (be)
      switch (be) {
        case yo:
          return X;
        case Zr:
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
  function jo(b) {
    var M = b.length, K = b.constructor(M);
    return M && typeof b[0] == "string" && Ee.call(b, "index") && (K.index = b.index, K.input = b.input), K;
  }
  function vo(b) {
    return typeof b.constructor == "function" && !Ci(b) ? ki(Yn(b)) : {};
  }
  function Ao(b, M, K, be) {
    var Jt = b.constructor;
    switch (M) {
      case B:
        return xo(b);
      case a:
      case c:
        return new Jt(+b);
      case X:
        return In(b, be);
      case Q:
      case re:
      case q:
      case m:
      case L:
      case _:
      case N:
      case W:
      case F:
        return So(b, be);
      case w:
        return Rn(b, be, K);
      case y:
      case P:
        return new Jt(b);
      case I:
        return Fo(b);
      case U:
        return xr(b, be, K);
      case A:
        return Ms(b);
    }
  }
  function Li(b, M) {
    return M = M ?? s, !!M && (typeof b == "number" || $.test(b)) && b > -1 && b % 1 == 0 && b < M;
  }
  function Ro(b) {
    var M = typeof b;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? b !== "__proto__" : b === null;
  }
  function vr(b) {
    return !!Bt && Bt in b;
  }
  function Ci(b) {
    var M = b && b.constructor, K = typeof M == "function" && M.prototype || He;
    return b === K;
  }
  function sr(b) {
    if (b != null) {
      try {
        return Fe.call(b);
      } catch {
      }
      try {
        return b + "";
      } catch {
      }
    }
    return "";
  }
  function _s(b) {
    return mo(b, !0, !0);
  }
  function zo(b, M) {
    return b === M || b !== b && M !== M;
  }
  function Ps(b) {
    return k(b) && Ee.call(b, "callee") && (!Mt.call(b, "callee") || Qe.call(b) == o);
  }
  var Us = Array.isArray;
  function x(b) {
    return b != null && Be(b.length) && !te(b);
  }
  function k(b) {
    return ke(b) && x(b);
  }
  var G = Wr || lt;
  function te(b) {
    var M = Y(b) ? Qe.call(b) : "";
    return M == h || M == d;
  }
  function Be(b) {
    return typeof b == "number" && b > -1 && b % 1 == 0 && b <= s;
  }
  function Y(b) {
    var M = typeof b;
    return !!b && (M == "object" || M == "function");
  }
  function ke(b) {
    return !!b && typeof b == "object";
  }
  function xe(b) {
    return x(b) ? Ts(b) : $i(b);
  }
  function Te() {
    return [];
  }
  function lt() {
    return !1;
  }
  e.exports = _s;
})(El, El.exports);
var aA = El.exports;
const zw = /* @__PURE__ */ wy(aA);
var Bd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Bd || (Bd = {}));
function cA(e, t) {
  return { type: Bd.Address, version: e, hash160: t };
}
function lA(e) {
  return mi.c32address(e.version, e.hash160);
}
const uA = (e) => _v(Pw(e)), dA = (e) => Oe(uA(e));
rn.hmacSha256Sync = (e, ...t) => {
  const n = Nw.create(Pw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function fA(e, t = "mainnet") {
  t = Cw(t), e = typeof e == "string" ? vt(e) : e;
  const n = $v(Bo.P2PKH, t), r = cA(n, dA(e));
  return lA(r);
}
function hA(e, t) {
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
  const s = r.issuer.publicKey, o = fA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Bn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function pA(e, t = null) {
  let n;
  t ? n = hA(e, t) : n = Bn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const h0 = "_blockstackDidCheckEchoReply", gA = "echoReply", yA = "authContinuation";
function wA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function mA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[h0];
  if (typeof t == "boolean")
    return t;
  const n = wA(e.location.search), r = n[gA];
  if (r) {
    e[h0] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[yA];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Md {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new $y();
    else
      throw new O1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Yp(t.sessionOptions) : this.store = new Yp() : t ? this.store = new Xp(t.sessionOptions) : this.store = new Xp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = D1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new md("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, rv(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = nv();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = If("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (mA())
        return Ki.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Ki.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = c2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Sc("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Bn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await cv(t))
      throw new Sc("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (Nu(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Kp(s, o.private_key);
          } catch {
            if (Ki.warn("Failed decryption of appPrivateKey, will try to use as given"), !rn.isValidPrivateKey(o.private_key))
              throw new Sc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Kp(s, c);
          } catch {
            Ki.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Sc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Z1, h;
    Nu(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Nu(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: $w(o.iss),
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
        d.profile = Object.assign({}, _1);
      else {
        const v = await y.text(), S = JSON.parse(v);
        d.profile = pA(S[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new md("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Zx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Jx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Md.prototype.makeAuthRequest = Md.prototype.makeAuthRequestToken;
const bA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], xA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = bA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!iu(r.id));
  return t.concat(n);
}, iu = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Gw = "STX_PROVIDER", ri = () => typeof window > "u" ? null : window.localStorage.getItem(Gw), SA = (e) => {
  typeof window < "u" && window.localStorage.setItem(Gw, e);
}, vA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function AA(e, t) {
  const n = {};
  return Object.assign(n, vA, t), await fetch(e, n);
}
function EA(e) {
  let t = AA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function kA(...e) {
  const { fetchLib: t, middlewares: n } = EA(e);
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
var ua;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ua || (ua = {}));
var oi;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(oi || (oi = {}));
var p0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(p0 || (p0 = {}));
const $A = "https://api.mainnet.hiro.so", IA = "https://api.testnet.hiro.so", LA = "http://localhost:3999", CA = ["mainnet", "testnet", "devnet", "mocknet"];
class si {
  constructor(t) {
    this.version = oi.Mainnet, this.chainId = ua.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === oi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? kA();
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
si.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Nd();
    case "testnet":
      return new _d();
    case "devnet":
      return new TA();
    case "mocknet":
      return new Kw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${CA.join(", ")}`);
  }
};
si.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : si.fromName(e);
class Nd extends si {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? $A,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = oi.Mainnet, this.chainId = ua.Mainnet;
  }
}
class _d extends si {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? IA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = oi.Testnet, this.chainId = ua.Testnet;
  }
}
class Kw extends si {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? LA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = oi.Testnet, this.chainId = ua.Testnet;
  }
}
const TA = Kw;
var ii;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ii || (ii = {}));
var kl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(kl || (kl = {}));
ii.Mainnet;
var ai;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ai || (ai = {}));
var ci;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ci || (ci = {}));
ai.Mainnet;
const BA = {
  chainId: ii.Mainnet,
  transactionVersion: ai.Mainnet,
  peerNetworkId: kl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ci.MainnetSingleSig,
    multiSig: ci.MainnetMultiSig
  },
  client: { baseUrl: Ay }
}, Pd = {
  chainId: ii.Testnet,
  transactionVersion: ai.Testnet,
  peerNetworkId: kl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ci.TestnetSingleSig,
    multiSig: ci.TestnetMultiSig
  },
  client: { baseUrl: Ey }
}, il = {
  ...Pd,
  addressVersion: { ...Pd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ky }
}, MA = {
  ...il,
  addressVersion: { ...il.addressVersion },
  client: { ...il.client }
};
function NA(e) {
  switch (e) {
    case "mainnet":
      return BA;
    case "testnet":
      return Pd;
    case "devnet":
      return il;
    case "mocknet":
      return MA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function _A(e) {
  return typeof e == "string" ? NA(e) : e;
}
function PA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const g0 = /* @__PURE__ */ new Map();
function Vw(e, t) {
  const n = g0.get(e);
  if (n !== void 0)
    return n(t);
  const r = PA(e);
  return g0.set(e, r), Vw(e, t);
}
let Ft = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? vt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return o2(this.readBytes(4), 0);
  }
  readUInt8() {
    return n2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return e2(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Oe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Oe(n);
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
    if (Vw(t, r))
      return r;
    throw n(r);
  }
};
const UA = 128, OA = 128, Xw = 16, Ys = 32, Ud = 80, au = 65, HA = 32, DA = 64, $l = 34, FA = 1 + 16 * 1024 * 1024, jA = 165, RA = 16, zA = 16, GA = 20, KA = zA + 2 + GA, VA = KA + 4, XA = FA + (jA + RA * VA);
var It;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(It || (It = {}));
var Od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Od || (Od = {}));
var ur;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(ur || (ur = {}));
const Fu = ["onChainOnly", "offChainOnly", "any"];
Fu[0] + "", ur.OnChainOnly, Fu[1] + "", ur.OffChainOnly, Fu[2] + "", ur.Any, ur.OnChainOnly + "", ur.OnChainOnly, ur.OffChainOnly + "", ur.OffChainOnly, ur.Any + "", ur.Any;
var Il;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Il || (Il = {}));
var Gt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Gt || (Gt = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Ht;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ht || (Ht = {}));
var Yt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Yt || (Yt = {}));
var Ka;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ka || (Ka = {}));
var Hd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Hd || (Hd = {}));
var Dd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Dd || (Dd = {}));
var Kn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Kn || (Kn = {}));
var y0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(y0 || (y0 = {}));
var Fd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Fd || (Fd = {}));
var Rr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Rr || (Rr = {}));
var w0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(w0 || (w0 = {}));
let cu = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Vi = class extends cu {
  constructor(t) {
    super(t);
  }
}, zn = class extends cu {
  constructor(t) {
    super(t);
  }
}, Ll = class extends cu {
  constructor(t) {
    super(t);
  }
}, zs = class extends cu {
  constructor(t) {
    super(t);
  }
};
function jd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function YA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Yw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function qA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jd(e.outputLen), jd(e.blockLen);
}
function WA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function ZA(e, t) {
  Yw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: jd,
  bool: YA,
  bytes: Yw,
  hash: qA,
  exists: WA,
  output: ZA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ju = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), to = (e, t) => e << 32 - t | e >>> t, JA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!JA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function QA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Wf(e) {
  if (typeof e == "string" && (e = QA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let qw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bi(e) {
  const t = (r) => e().update(Wf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ww = class extends qw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Gs.hash(t);
    const r = Wf(n);
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
};
const Zw = (e, t, n) => new Ww(e, t).update(n).digest();
Zw.create = (e, t) => new Ww(e, t);
function eE(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Zf = class extends qw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = ju(this.buffer);
  }
  update(t) {
    Gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Wf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ju(t);
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
    eE(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ju(t), c = this.outputLen;
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
const tE = (e, t, n) => e & t ^ ~e & n, nE = (e, t, n) => e & t ^ e & n ^ t & n, rE = new Uint32Array([
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
let Jw = class extends Zf {
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
      const w = cs[d - 15], y = cs[d - 2], v = to(w, 7) ^ to(w, 18) ^ w >>> 3, S = to(y, 17) ^ to(y, 19) ^ y >>> 10;
      cs[d] = S + cs[d - 7] + v + cs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = to(a, 6) ^ to(a, 11) ^ to(a, 25), y = h + w + tE(a, c, u) + rE[d] + cs[d] | 0, S = (to(r, 2) ^ to(r, 13) ^ to(r, 22)) + nE(r, s, o) | 0;
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
}, oE = class extends Jw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Jf = bi(() => new Jw());
bi(() => new oE());
const sE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qw = Uint8Array.from({ length: 16 }, (e, t) => t), iE = Qw.map((e) => (9 * e + 5) % 16);
let Qf = [Qw], eh = [iE];
for (let e = 0; e < 4; e++)
  for (let t of [Qf, eh])
    t.push(t[e].map((n) => sE[n]));
const em = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), aE = Qf.map((e, t) => e.map((n) => em[t][n])), cE = eh.map((e, t) => e.map((n) => em[t][n])), lE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), uE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _c = (e, t) => e << t | e >>> 32 - t;
function m0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Pc = new Uint32Array(16);
let dE = class extends Zf {
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
      Pc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = lE[y], I = uE[y], U = Qf[y], P = eh[y], A = aE[y], T = cE[y];
      for (let B = 0; B < 16; B++) {
        const X = _c(r + m0(y, o, a, u) + Pc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = _c(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = _c(s + m0(v, i, c, h) + Pc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = _c(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Pc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const fE = bi(() => new dE()), Uc = BigInt(2 ** 32 - 1), Rd = BigInt(32);
function tm(e, t = !1) {
  return t ? { h: Number(e & Uc), l: Number(e >> Rd & Uc) } : { h: Number(e >> Rd & Uc) | 0, l: Number(e & Uc) | 0 };
}
function hE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = tm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const pE = (e, t) => BigInt(e >>> 0) << Rd | BigInt(t >>> 0), gE = (e, t, n) => e >>> n, yE = (e, t, n) => e << 32 - n | t >>> n, wE = (e, t, n) => e >>> n | t << 32 - n, mE = (e, t, n) => e << 32 - n | t >>> n, bE = (e, t, n) => e << 64 - n | t >>> n - 32, xE = (e, t, n) => e >>> n - 32 | t << 64 - n, SE = (e, t) => t, vE = (e, t) => e, AE = (e, t, n) => e << n | t >>> 32 - n, EE = (e, t, n) => t << n | e >>> 32 - n, kE = (e, t, n) => t << n - 32 | e >>> 64 - n, $E = (e, t, n) => e << n - 32 | t >>> 64 - n;
function IE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const LE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), CE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, TE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), BE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, ME = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), NE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: tm,
  split: hE,
  toBig: pE,
  shrSH: gE,
  shrSL: yE,
  rotrSH: wE,
  rotrSL: mE,
  rotrBH: bE,
  rotrBL: xE,
  rotr32H: SE,
  rotr32L: vE,
  rotlSH: AE,
  rotlSL: EE,
  rotlBH: kE,
  rotlBL: $E,
  add: IE,
  add3L: LE,
  add3H: CE,
  add4L: TE,
  add4H: BE,
  add5H: NE,
  add5L: ME
}, [_E, PE] = nt.split([
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
let lu = class extends Zf {
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
      const T = ls[A - 15] | 0, B = us[A - 15] | 0, X = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), Q = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), re = ls[A - 2] | 0, q = us[A - 2] | 0, m = nt.rotrSH(re, q, 19) ^ nt.rotrBH(re, q, 61) ^ nt.shrSH(re, q, 6), L = nt.rotrSL(re, q, 19) ^ nt.rotrBL(re, q, 61) ^ nt.shrSL(re, q, 6), _ = nt.add4L(Q, L, us[A - 7], us[A - 16]), N = nt.add4H(_, X, m, ls[A - 7], ls[A - 16]);
      ls[A] = N | 0, us[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), B = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, re = nt.add5L(P, B, Q, PE[A], us[A]), q = nt.add5H(re, U, T, X, _E[A], ls[A]), m = re | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), _ = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = nt.add3L(m, _, W);
      r = nt.add3H(F, q, L, N), s = F | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = nt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = nt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = nt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ls.fill(0), us.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, UE = class extends lu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, OE = class extends lu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, HE = class extends lu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new lu());
bi(() => new UE());
const DE = bi(() => new OE());
bi(() => new HE());
var yt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(yt || (yt = {}));
var hn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(hn || (hn = {}));
function th(e) {
  return hn[e];
}
const FE = () => ({ type: yt.BoolTrue }), jE = () => ({ type: yt.BoolFalse }), RE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: yt.Buffer, value: Oe(e) };
}, b0 = BigInt("0xffffffffffffffffffffffffffffffff"), zE = BigInt(0), x0 = BigInt("0x7fffffffffffffffffffffffffffffff"), S0 = BigInt("-170141183460469231731687303715884105728"), GE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = xd(vt(e))), rr(e, Uint8Array) && (e = xd(e));
  const t = Fn(e);
  if (t > x0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${x0}`);
  if (t < S0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${S0}`);
  return { type: yt.Int, value: t };
}, KE = (e) => {
  const t = Fn(e);
  if (t < zE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > b0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${b0}`);
  return { type: yt.UInt, value: t };
};
function VE(e) {
  return { type: yt.List, value: e };
}
function nm() {
  return { type: yt.OptionalNone };
}
function rm(e) {
  return { type: yt.OptionalSome, value: e };
}
var ge;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ge || (ge = {}));
function XE() {
  return {
    type: ge.Address,
    version: ci.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function v0(e) {
  if (e && fm(e, $l))
    throw new Error(`Memo exceeds maximum length of ${$l} bytes`);
  return { type: ge.MemoString, content: e };
}
function nh(e, t) {
  return {
    type: ge.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function zd(e) {
  if (vt(e).byteLength != au)
    throw Error("Invalid signature");
  return {
    type: ge.MessageSignature,
    data: e
  };
}
function YE(e, t, n) {
  return typeof e == "string" && (e = uk(e)), typeof n == "string" && (n = v0(n)), {
    type: ge.Payload,
    payloadType: It.TokenTransfer,
    recipient: e,
    amount: Fn(t),
    memo: n ?? v0("")
  };
}
function qE(e, t, n, r) {
  return typeof t == "string" && (t = Xr(t)), typeof n == "string" && (n = Xr(n)), {
    type: ge.Payload,
    payloadType: It.ContractCall,
    contractAddress: typeof e == "string" ? Cs(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function WE(e) {
  return Xr(e, 4, 1e5);
}
function A0(e, t, n) {
  return typeof e == "string" && (e = Xr(e)), typeof t == "string" && (t = WE(t)), typeof n == "number" ? {
    type: ge.Payload,
    payloadType: It.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ge.Payload,
    payloadType: It.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function ZE() {
  return { type: ge.Payload, payloadType: It.PoisonMicroblock };
}
function E0(e, t) {
  if (e.byteLength != Ys)
    throw Error(`Coinbase buffer size must be ${Ys} bytes`);
  return t != null ? {
    type: ge.Payload,
    payloadType: It.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ge.Payload,
    payloadType: It.Coinbase,
    coinbaseBytes: e
  };
}
function JE(e, t, n) {
  if (e.byteLength != Ys)
    throw Error(`Coinbase buffer size must be ${Ys} bytes`);
  if (n.byteLength != Ud)
    throw Error(`VRF proof buffer size must be ${Ud} bytes`);
  return {
    type: ge.Payload,
    payloadType: It.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === yt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function QE(e, t, n, r, s, o, i) {
  return {
    type: ge.Payload,
    payloadType: It.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Xr(e, t, n) {
  const r = t || 1, s = n || UA;
  if (fm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ge.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ek(e, t, n) {
  return {
    type: ge.Asset,
    address: Cs(e),
    contractName: Xr(t),
    assetName: Xr(n)
  };
}
function Cs(e) {
  const t = mi.c32addressDecode(e);
  return {
    type: ge.Address,
    version: t[0],
    hash160: t[1]
  };
}
function tk(e, t) {
  const n = Cs(e), r = Xr(t);
  return {
    type: ge.Principal,
    prefix: Kn.Contract,
    address: n,
    contractName: r
  };
}
function nk(e) {
  const t = Cs(e);
  return {
    type: ge.Principal,
    prefix: Kn.Standard,
    address: t
  };
}
function Xi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ge.TransactionAuthField,
    contents: t
  };
}
function Co(e) {
  switch (e.type) {
    case ge.Address:
      return pc(e);
    case ge.Principal:
      return om(e);
    case ge.LengthPrefixedString:
      return fa(e);
    case ge.MemoString:
      return ok(e);
    case ge.Asset:
      return im(e);
    case ge.PostCondition:
      return cm(e);
    case ge.PublicKey:
      return Vd(e);
    case ge.LengthPrefixedList:
      return rh(e);
    case ge.Payload:
      return lm(e);
    case ge.TransactionAuthField:
      return lk(e);
    case ge.MessageSignature:
      return oh(e);
  }
}
function pc(e) {
  const t = [];
  return t.push(vt(cc(e.version, 1))), t.push(vt(e.hash160)), ln(t);
}
function da(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = Yl(Oe(t.readBytes(1))), r = Oe(t.readBytes(20));
  return { type: ge.Address, version: n, hash160: r };
}
function om(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Kn.Standard || e.prefix === Kn.Contract) && t.push(pc(e.address)), e.prefix === Kn.Contract && t.push(fa(e.contractName)), ln(t);
}
function rk(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = t.readUInt8Enum(Kn, (o) => {
    throw new zn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Kn.Origin)
    return { type: ge.Principal, prefix: n };
  const r = da(t);
  if (n === Kn.Standard)
    return { type: ge.Principal, prefix: n, address: r };
  const s = $r(t);
  return {
    type: ge.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function fa(e) {
  const t = [], n = pi(e.content), r = n.byteLength;
  return t.push(vt(cc(r, e.lengthPrefixBytes))), t.push(n), ln(t);
}
function $r(e, t, n) {
  t = t || 1;
  const r = rr(e, Ft) ? e : new Ft(e), s = Yl(Oe(r.readBytes(t))), o = lc(r.readBytes(s));
  return Xr(o, t, n ?? 128);
}
function ok(e) {
  const t = [], n = pi(e.content), r = Mk(Oe(n), $l * 2);
  return t.push(vt(r)), ln(t);
}
function sm(e) {
  const t = rr(e, Ft) ? e : new Ft(e);
  let n = lc(t.readBytes($l));
  return n = n.replace(/\u0000*$/, ""), { type: ge.MemoString, content: n };
}
function im(e) {
  const t = [];
  return t.push(pc(e.address)), t.push(fa(e.contractName)), t.push(fa(e.assetName)), ln(t);
}
function Gd(e) {
  const t = rr(e, Ft) ? e : new Ft(e);
  return {
    type: ge.Asset,
    address: da(t),
    contractName: $r(t),
    assetName: $r(t)
  };
}
function rh(e) {
  const t = e.values, n = [];
  n.push(vt(cc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Co(r));
  return ln(n);
}
function am(e, t, n) {
  const r = rr(e, Ft) ? e : new Ft(e), s = Yl(Oe(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ge.Address:
        o.push(da(r));
        break;
      case ge.LengthPrefixedString:
        o.push($r(r));
        break;
      case ge.MemoString:
        o.push(sm(r));
        break;
      case ge.Asset:
        o.push(Gd(r));
        break;
      case ge.PostCondition:
        o.push(ik(r));
        break;
      case ge.PublicKey:
        o.push(Xd(r));
        break;
      case ge.TransactionAuthField:
        o.push(ck(r));
        break;
    }
  return nh(o, n);
}
function sk(e) {
  return Oe(cm(e));
}
function cm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(om(e.principal)), (e.conditionType === Gt.Fungible || e.conditionType === Gt.NonFungible) && t.push(im(e.asset)), e.conditionType === Gt.NonFungible && t.push(co(e.assetName)), t.push(e.conditionCode), e.conditionType === Gt.STX || e.conditionType === Gt.Fungible || e.conditionType === Gt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Vi("The post-condition amount may not be larger than 8 bytes");
    t.push(Is(e.amount, 8));
  }
  return ln(t);
}
function ik(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = t.readUInt8Enum(Gt, (a) => {
    throw new zn(`Could not read ${a} as PostConditionType`);
  }), r = rk(t);
  let s, o, i;
  switch (n) {
    case Gt.STX:
      return s = t.readUInt8Enum(Ka, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Gt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Gt.Fungible:
      return o = Gd(t), s = t.readUInt8Enum(Ka, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Gt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Gt.NonFungible:
      o = Gd(t);
      const a = so(t);
      return s = t.readUInt8Enum(Hd, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ge.PostCondition,
        conditionType: Gt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Gt.Staking:
      return s = t.readUInt8Enum(Ka, (c) => {
        throw new zn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Oe(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Gt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Gt.PoX: {
      const c = t.readUInt8Enum(Dd, (u) => {
        throw new zn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ge.PostCondition,
        conditionType: Gt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function lm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case It.TokenTransfer:
      t.push(co(e.recipient)), t.push(Is(e.amount, 8)), t.push(Co(e.memo));
      break;
    case It.ContractCall:
      t.push(Co(e.contractAddress)), t.push(Co(e.contractName)), t.push(Co(e.functionName));
      const n = new Uint8Array(4);
      Js(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(co(r));
      });
      break;
    case It.SmartContract:
      t.push(Co(e.contractName)), t.push(Co(e.codeBody));
      break;
    case It.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Co(e.contractName)), t.push(Co(e.codeBody));
      break;
    case It.PoisonMicroblock:
      break;
    case It.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case It.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(co(e.recipient));
      break;
    case It.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(co(e.recipient ? rm(e.recipient) : nm())), t.push(e.vrfProof);
      break;
    case It.TenureChange:
      t.push(vt(e.tenureHash)), t.push(vt(e.previousTenureHash)), t.push(vt(e.burnViewHash)), t.push(vt(e.previousTenureEnd)), t.push(Js(new Uint8Array(4), e.previousTenureBlocks)), t.push(r2(new Uint8Array(1), e.cause)), t.push(vt(e.publicKeyHash));
      break;
  }
  return ln(t);
}
function ak(e) {
  const t = rr(e, Ft) ? e : new Ft(e);
  switch (t.readUInt8Enum(It, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case It.TokenTransfer:
      const r = so(t), s = Fn(t.readBytes(8)), o = sm(t);
      return YE(r, s, o);
    case It.ContractCall:
      const i = da(t), a = $r(t), c = $r(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = so(t);
        u.push(B);
      }
      return qE(i, a, c, u);
    case It.SmartContract:
      const d = $r(t), w = $r(t, 4, 1e5);
      return A0(d, w);
    case It.VersionedSmartContract: {
      const T = t.readUInt8Enum(Od, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = $r(t), X = $r(t, 4, XA);
      return A0(B, X, T);
    }
    case It.PoisonMicroblock:
      return ZE();
    case It.Coinbase: {
      const T = t.readBytes(Ys);
      return E0(T);
    }
    case It.CoinbaseToAltRecipient: {
      const T = t.readBytes(Ys), B = so(t);
      return E0(T, B);
    }
    case It.NakamotoCoinbase: {
      const T = t.readBytes(Ys), B = so(t), X = t.readBytes(Ud);
      return JE(T, B, X);
    }
    case It.TenureChange:
      const y = Oe(t.readBytes(20)), v = Oe(t.readBytes(20)), S = Oe(t.readBytes(20)), I = Oe(t.readBytes(32)), U = t.readUInt32BE(), P = t.readUInt8Enum(Fd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = Oe(t.readBytes(20));
      return QE(y, v, S, I, U, P, A);
  }
}
function Kd(e) {
  const t = rr(e, Ft) ? e : new Ft(e);
  return zd(Oe(t.readBytes(au)));
}
function ck(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = t.readUInt8Enum(Rr, (r) => {
    throw new zn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Rr.PublicKeyCompressed:
      return Xi(Yt.Compressed, Xd(t));
    case Rr.PublicKeyUncompressed:
      return Xi(Yt.Uncompressed, xa(zk(Xd(t).data)));
    case Rr.SignatureCompressed:
      return Xi(Yt.Compressed, Kd(t));
    case Rr.SignatureUncompressed:
      return Xi(Yt.Uncompressed, Kd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function oh(e) {
  return vt(e.data);
}
function lk(e) {
  const t = [];
  switch (e.contents.type) {
    case ge.PublicKey:
      t.push(e.pubKeyEncoding === Yt.Compressed ? Rr.PublicKeyCompressed : Rr.PublicKeyUncompressed), t.push(vt(Rk(e.contents.data)));
      break;
    case ge.MessageSignature:
      t.push(e.pubKeyEncoding === Yt.Compressed ? Rr.SignatureCompressed : Rr.SignatureUncompressed), t.push(oh(e.contents));
      break;
  }
  return ln(t);
}
function Vd(e) {
  return e.data.slice();
}
function Xd(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = t.readUInt8(), r = n === 4 ? DA : HA;
  return xa(ln([n, t.readBytes(r)]));
}
function sh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ht.P2PKH || t === Ht.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ht.P2WPKH || t === Ht.P2WSH || t === Ht.P2WSHNonSequential) && !r.map((s) => s.data).every(Sa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ht.P2PKH:
      return Oc(e, Nk(r[0].data));
    case Ht.P2WPKH:
      return Oc(e, _k(r[0].data));
    case Ht.P2SH:
    case Ht.P2SHNonSequential:
      return Oc(e, Pk(n, r.map(Vd)));
    case Ht.P2WSH:
    case Ht.P2WSHNonSequential:
      return Oc(e, Uk(n, r.map(Vd)));
  }
}
function Oc(e, t) {
  return { type: ge.Address, version: e, hash160: t };
}
function ih(e) {
  return mi.c32address(e.version, e.hash160);
}
function k0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return ek(t, n, r);
}
function Ma(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return tk(t, n);
  } else
    return nk(e);
}
function uk(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return hk(t, n);
  } else
    return dk(e);
}
function dk(e) {
  const t = Cs(e);
  return { type: yt.PrincipalStandard, value: ih(t) };
}
function fk(e) {
  return { type: yt.PrincipalStandard, value: ih(e) };
}
function hk(e, t) {
  const n = Cs(e), r = Xr(t);
  return um(n, r);
}
function um(e, t) {
  if (pi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: yt.PrincipalContract,
    value: `${ih(e)}.${t.content}`
  };
}
function pk(e) {
  return { type: yt.ResponseErr, value: e };
}
function gk(e) {
  return { type: yt.ResponseOk, value: e };
}
const yk = (e) => ({ type: yt.StringASCII, value: e }), wk = (e) => ({ type: yt.StringUTF8, value: e });
function mk(e) {
  for (const t in e)
    if (!Ok(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: yt.Tuple, value: e };
}
function so(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ft(vt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ft(e) : t = e;
  switch (t.readUInt8Enum(hn, (r) => {
    throw new zn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case hn.int:
      return GE(xd(t.readBytes(16)));
    case hn.uint:
      return KE(t.readBytes(16));
    case hn.buffer:
      const r = t.readUInt32BE();
      return RE(t.readBytes(r));
    case hn.true:
      return FE();
    case hn.false:
      return jE();
    case hn.address:
      const s = da(t);
      return fk(s);
    case hn.contract:
      const o = da(t), i = $r(t);
      return um(o, i);
    case hn.ok:
      return gk(so(t));
    case hn.err:
      return pk(so(t));
    case hn.none:
      return nm();
    case hn.some:
      return rm(so(t));
    case hn.list:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(so(t));
      return VE(c);
    case hn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = $r(t).content;
        if (I === void 0)
          throw new zn('"content" is undefined');
        h[I] = so(t);
      }
      return mk(h);
    case hn.ascii:
      const d = t.readUInt32BE(), w = q1(t.readBytes(d));
      return yk(w);
    case hn.utf8:
      const y = t.readUInt32BE(), v = lc(t.readBytes(y));
      return wk(v);
    default:
      throw new zn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ho(e, t) {
  return ln([th(e), t]);
}
function bk(e) {
  return new Uint8Array([th(e.type)]);
}
function xk(e) {
  return e.type === yt.OptionalNone ? new Uint8Array([th(e.type)]) : ho(e.type, co(e.value));
}
function Sk(e) {
  const t = new Uint8Array(4);
  return Js(t, Math.ceil(e.value.length / 2), 0), ho(e.type, uo(t, vt(e.value)));
}
function vk(e) {
  const t = Lf(G1(BigInt(e.value), BigInt(OA)), Xw);
  return ho(e.type, t);
}
function Ak(e) {
  const t = Lf(BigInt(e.value), Xw);
  return ho(e.type, t);
}
function Ek(e) {
  return ho(e.type, pc(Cs(e.value)));
}
function kk(e) {
  const [t, n] = Hk(e.value);
  return ho(e.type, uo(pc(Cs(t)), fa(Xr(n))));
}
function $k(e) {
  return ho(e.type, co(e.value));
}
function Ik(e) {
  const t = [], n = new Uint8Array(4);
  Js(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = co(r);
    t.push(s);
  }
  return ho(e.type, ln(t));
}
function Lk(e) {
  const t = [], n = new Uint8Array(4);
  Js(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Xr(s);
    t.push(fa(o));
    const i = co(e.value[s]);
    t.push(i);
  }
  return ho(e.type, ln(t));
}
function dm(e, t) {
  const n = [], r = t == "ascii" ? Y1(e.value) : pi(e.value), s = new Uint8Array(4);
  return Js(s, r.length, 0), n.push(s), n.push(r), ho(e.type, ln(n));
}
function Ck(e) {
  return dm(e, "ascii");
}
function Tk(e) {
  return dm(e, "utf8");
}
function $0(e) {
  return Oe(co(e));
}
function co(e) {
  switch (e.type) {
    case yt.BoolTrue:
    case yt.BoolFalse:
      return bk(e);
    case yt.OptionalNone:
    case yt.OptionalSome:
      return xk(e);
    case yt.Buffer:
      return Sk(e);
    case yt.UInt:
      return Ak(e);
    case yt.Int:
      return vk(e);
    case yt.PrincipalStandard:
      return Ek(e);
    case yt.PrincipalContract:
      return kk(e);
    case yt.ResponseOk:
    case yt.ResponseErr:
      return $k(e);
    case yt.List:
      return Ik(e);
    case yt.Tuple:
      return Lk(e);
    case yt.StringASCII:
      return Ck(e);
    case yt.StringUTF8:
      return Tk(e);
    default:
      throw new Vi("Unable to serialize. Invalid Clarity Value.");
  }
}
const Bk = (e) => e.length % 2 ? `0${e}` : e, Mk = (e, t) => e.padEnd(t, "0"), fm = (e, t) => e ? pi(e).length > t : !1;
function Yd(e) {
  return zw(e);
}
const Za = (e) => fE(Jf(e)), ah = (e) => Oe(DE(e)), Nk = (e) => Oe(Za(e)), _k = (e) => {
  const t = Za(e), n = uo(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Za(n);
  return Oe(r);
}, Pk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = Za(r);
  return Oe(s);
}, Uk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = Jf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = ln(o), a = Za(i);
  return Oe(a);
};
function Ok(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Hk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = Zw.create(Jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function xa(e) {
  return e = typeof e == "string" ? vt(e) : e, {
    type: ge.PublicKey,
    data: e
  };
}
function Dk(e, t, n = Yt.Compressed) {
  const r = Q1(t), s = new gr($p(r.r), $p(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === Yt.Compressed;
  return o.toHex(i);
}
function Fk(e) {
  return typeof e == "string" ? e : Oe(e);
}
const ch = Fk;
function hm(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === J1;
}
function Sa(e) {
  return !ch(e).startsWith("04");
}
function jk(e) {
  e = Cf(e);
  const t = hm(e);
  return Oe(uc(e.slice(0, 32), t));
}
function Rk(e) {
  return at.fromHex(ch(e)).toHex(!0);
}
function zk(e) {
  return at.fromHex(ch(e)).toHex(!1);
}
function Gk(e, t) {
  e = Cf(e);
  const [n, r] = Wl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return cc(r, 1) + gr.fromHex(n).toCompactHex();
}
function lh() {
  return {
    type: ge.MessageSignature,
    data: Oe(new Uint8Array(au))
  };
}
function pm(e, t, n, r) {
  const s = sh(0, e, 1, [xa(t)]).hash160, o = Sa(t) ? Yt.Compressed : Yt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Fn(n),
    fee: Fn(r),
    keyEncoding: o,
    signature: lh()
  };
}
function Ja(e) {
  return "signature" in e;
}
function I0(e) {
  return e === Ht.P2SH || e === Ht.P2WSH;
}
function Kk(e) {
  return e === Ht.P2SHNonSequential || e === Ht.P2WSHNonSequential;
}
function L0(e) {
  const t = Yd(e);
  return t.nonce = 0, t.fee = 0, Ja(t) ? t.signature = lh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Vk(e) {
  const t = [
    e.hashMode,
    vt(e.signer),
    Is(e.nonce, 8),
    Is(e.fee, 8),
    e.keyEncoding,
    oh(e.signature)
  ];
  return ln(t);
}
function Xk(e) {
  const t = [
    e.hashMode,
    vt(e.signer),
    Is(e.nonce, 8),
    Is(e.fee, 8)
  ], n = nh(e.fields);
  t.push(rh(n));
  const r = new Uint8Array(2);
  return t2(r, e.signaturesRequired, 0), t.push(r), ln(t);
}
function Yk(e, t) {
  const n = Oe(t.readBytes(20)), r = BigInt(`0x${Oe(t.readBytes(8))}`), s = BigInt(`0x${Oe(t.readBytes(8))}`), o = t.readUInt8Enum(Yt, (a) => {
    throw new zn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ht.P2WPKH && o != Yt.Compressed)
    throw new zn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Kd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function qk(e, t) {
  const n = Oe(t.readBytes(20)), r = BigInt("0x" + Oe(t.readBytes(8))), s = BigInt("0x" + Oe(t.readBytes(8))), o = am(t, ge.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ge.PublicKey:
        Sa(u.contents.data) || (i = !0);
        break;
      case ge.MessageSignature:
        if (u.pubKeyEncoding === Yt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new zs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ht.P2WSH || e === Ht.P2WSHNonSequential))
    throw new zs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Ru(e) {
  return Ja(e) ? Vk(e) : Xk(e);
}
function zu(e) {
  const t = e.readUInt8Enum(Ht, (n) => {
    throw new zn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ht.P2PKH || t === Ht.P2WPKH ? Yk(t, e) : qk(t, e);
}
function gm(e, t, n, r) {
  const o = e + Oe(new Uint8Array([t])) + Oe(Is(n, 8)) + Oe(Is(r, 8));
  if (vt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ah(vt(o));
}
function ym(e, t, n) {
  const r = 33 + au, s = Sa(t.data) ? Yt.Compressed : Yt.Uncompressed, o = e + Bk(s.toString(16)) + n, i = vt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return ah(i);
}
function Wk(e, t, n, r, s) {
  const o = gm(e, t, n, r), i = Gk(s, o), a = xa(jk(s)), c = ym(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function wm(e, t, n, r, s, o) {
  const i = gm(e, t, n, r), a = xa(Dk(i, o, s)), c = ym(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Zk() {
  const e = pm(Ht.P2PKH, "", 0, 0);
  return e.signer = XE().hash160, e.keyEncoding = Yt.Compressed, e.signature = lh(), e;
}
function C0(e, t, n) {
  return Ja(e) ? Jk(e, t, n) : Qk(e, t, n);
}
function Jk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = wm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = sh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new zs(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Qk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ge.PublicKey:
        Sa(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ge.MessageSignature:
        c.pubKeyEncoding === Yt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = wm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (I0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new zs("Too many signatures");
        break;
    }
  if (I0(e.hashMode) && i !== e.signaturesRequired || Kk(e.hashMode) && i < e.signaturesRequired)
    throw new zs("Incorrect number of signatures");
  if (o && (e.hashMode === Ht.P2WSH || e.hashMode === Ht.P2WSHNonSequential))
    throw new zs("Uncompressed keys are not allowed in this hash mode");
  const a = sh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new zs(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function mm(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function bm(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || pm(Ht.P2PKH, "0".repeat(66), 0, 0)
  };
}
function T0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return mm(L0(e.spendingCondition));
      case tn.Sponsored:
        return bm(L0(e.spendingCondition), Zk());
      default:
        throw new Ll("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function e3(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return C0(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return C0(e.spendingCondition, t, tn.Standard);
    default:
      throw new Ll("Invalid origin auth type");
  }
}
function t3(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Fn(t)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Fn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function n3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Fn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function r3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Fn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function o3(e, t) {
  const n = {
    ...t,
    nonce: Fn(t.nonce),
    fee: Fn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function s3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Ru(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Ru(e.spendingCondition)), t.push(Ru(e.sponsorSpendingCondition));
      break;
  }
  return ln(t);
}
function i3(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new zn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = zu(e), mm(n);
    case tn.Sponsored:
      n = zu(e);
      const r = zu(e);
      return bm(n, r);
  }
}
class a3 {
  constructor({ auth: t, payload: n, postConditions: r = nh([]), postConditionMode: s = Il.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = _A(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Fn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = ur.Any;
  }
  signBegin() {
    const t = Yd(this);
    return t.auth = T0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Yd(this);
    return t.auth = T0(t.auth), t.txid();
  }
  verifyOrigin() {
    return e3(this.auth, this.verifyBegin());
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
    const n = typeof t == "object" && "type" in t ? t : xa(t), r = this.auth.spendingCondition;
    if (r && !Ja(r)) {
      const s = Sa(n.data);
      r.fields.push(Xi(s ? Yt.Compressed : Yt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = Wk(n, r, t.fee, t.nonce, s);
    if (Ja(t))
      t.signature = zd(o);
    else {
      const a = hm(s);
      t.fields.push(Xi(a ? Yt.Compressed : Yt.Uncompressed, zd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return ah(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Ll("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o3(this.auth, t);
  }
  setFee(t) {
    this.auth = t3(this.auth, t);
  }
  setNonce(t) {
    this.auth = n3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Ll("Cannot sponsor sign a non-sponsored transaction");
    this.auth = r3(this.auth, t);
  }
  serialize() {
    return Oe(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Vi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Vi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Vi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Vi('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Js(n, this.chainId, 0), t.push(n), t.push(s3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(rh(this.postConditions)), t.push(lm(this.payload)), ln(t);
  }
}
function c3(e) {
  const t = rr(e, Ft) ? e : new Ft(e), n = t.readUInt8Enum(ai, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = i3(t), o = t.readUInt8Enum(ur, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(Il, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = am(t, ge.PostCondition), c = ak(t), u = new a3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const B0 = BigInt("18446744073709551615");
function Gu(e) {
  const t = Fn(e);
  if (t < 0n || t > B0)
    throw new RangeError(`Post-condition amount must be between 0 and ${B0} (u64 max), received: ${t}`);
  return t;
}
var qd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(qd || (qd = {}));
var Wd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Wd || (Wd = {}));
function l3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Gt.STX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Kn.Origin } : Ma(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Gt.Fungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Kn.Origin } : Ma(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount),
        asset: k0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Gt.NonFungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Kn.Origin } : Ma(e.address),
        conditionCode: Hc(e.condition),
        asset: k0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Gt.Staking,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Kn.Origin } : Ma(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Gt.PoX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Kn.Origin } : Ma(e.address),
        conditionCode: u3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Hc(e) {
  return qd[e];
}
function u3(e) {
  return Wd[e];
}
function xm(e) {
  const t = l3(e);
  return sk(t);
}
function d3(e, t, n) {
  return dh(Sm(e), n);
}
function Sm(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Qa(r);
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
    return BigInt(`0x${p3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function uh(e, t = 8) {
  return (typeof e == "bigint" ? e : Sm(e)).toString(16).padStart(t * 2, "0");
}
function dh(e, t = 16) {
  const n = uh(e, t);
  return Qa(n);
}
function f3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const h3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function p3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += h3[n];
  return t;
}
function Qa(e) {
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
function fh(e) {
  return new TextEncoder().encode(e);
}
function g3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function y3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function M0(e) {
  if (e.some(y3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function hh(...e) {
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
function Oo(e) {
  return hh(...e.map((t) => typeof t == "number" ? M0([t]) : t instanceof Array ? M0(t) : t));
}
function uu(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Zd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Zd || (Zd = {}));
Zd.Mainnet;
const w3 = 128, m3 = 128, vm = 16;
var Jd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Jd || (Jd = {}));
var N0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(N0 || (N0 = {}));
var _0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(_0 || (_0 = {}));
var Dr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Dr || (Dr = {}));
const Ku = ["onChainOnly", "offChainOnly", "any"];
Ku[0] + "", Dr.OnChainOnly, Ku[1] + "", Dr.OffChainOnly, Ku[2] + "", Dr.Any, Dr.OnChainOnly + "", Dr.OnChainOnly, Dr.OffChainOnly + "", Dr.OffChainOnly, Dr.Any + "", Dr.Any;
var Qd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qd || (Qd = {}));
Qd.Mainnet;
var P0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(P0 || (P0 = {}));
var Ds;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Ds || (Ds = {}));
var U0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(U0 || (U0 = {}));
var O0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(O0 || (O0 = {}));
var H0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(H0 || (H0 = {}));
var D0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(D0 || (D0 = {}));
var F0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(F0 || (F0 = {}));
var j0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(j0 || (j0 = {}));
var ef;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(ef || (ef = {}));
var R0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(R0 || (R0 = {}));
var z0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(z0 || (z0 = {}));
function tf(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function b3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Am(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function x3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tf(e.outputLen), tf(e.blockLen);
}
function S3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function v3(e, t) {
  Am(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vu = {
  number: tf,
  bool: b3,
  bytes: Am,
  hash: x3,
  exists: S3,
  output: v3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), no = (e, t) => e << 32 - t | e >>> t, A3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!A3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function E3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Em(e) {
  if (typeof e == "string" && (e = E3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let k3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function xi(e) {
  const t = (r) => e().update(Em(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function $3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let ph = class extends k3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Xu(this.buffer);
  }
  update(t) {
    Vu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Em(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Xu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Vu.exists(this), Vu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    $3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Xu(t), c = this.outputLen;
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
const I3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), km = Uint8Array.from({ length: 16 }, (e, t) => t), L3 = km.map((e) => (9 * e + 5) % 16);
let gh = [km], yh = [L3];
for (let e = 0; e < 4; e++)
  for (let t of [gh, yh])
    t.push(t[e].map((n) => I3[n]));
const $m = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), C3 = gh.map((e, t) => e.map((n) => $m[t][n])), T3 = yh.map((e, t) => e.map((n) => $m[t][n])), B3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), M3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Dc = (e, t) => e << t | e >>> 32 - t;
function G0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Fc = new Uint32Array(16);
let N3 = class extends ph {
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
      Fc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = B3[y], I = M3[y], U = gh[y], P = yh[y], A = C3[y], T = T3[y];
      for (let B = 0; B < 16; B++) {
        const X = Dc(r + G0(y, o, a, u) + Fc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Dc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Dc(s + G0(v, i, c, h) + Fc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Dc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Fc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
xi(() => new N3());
const _3 = (e, t, n) => e & t ^ ~e & n, P3 = (e, t, n) => e & t ^ e & n ^ t & n, U3 = new Uint32Array([
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
let Im = class extends ph {
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
      const w = fs[d - 15], y = fs[d - 2], v = no(w, 7) ^ no(w, 18) ^ w >>> 3, S = no(y, 17) ^ no(y, 19) ^ y >>> 10;
      fs[d] = S + fs[d - 7] + v + fs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = no(a, 6) ^ no(a, 11) ^ no(a, 25), y = h + w + _3(a, c, u) + U3[d] + fs[d] | 0, S = (no(r, 2) ^ no(r, 13) ^ no(r, 22)) + P3(r, s, o) | 0;
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
}, O3 = class extends Im {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
xi(() => new Im());
xi(() => new O3());
const jc = BigInt(2 ** 32 - 1), nf = BigInt(32);
function Lm(e, t = !1) {
  return t ? { h: Number(e & jc), l: Number(e >> nf & jc) } : { h: Number(e >> nf & jc) | 0, l: Number(e & jc) | 0 };
}
function H3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Lm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const D3 = (e, t) => BigInt(e >>> 0) << nf | BigInt(t >>> 0), F3 = (e, t, n) => e >>> n, j3 = (e, t, n) => e << 32 - n | t >>> n, R3 = (e, t, n) => e >>> n | t << 32 - n, z3 = (e, t, n) => e << 32 - n | t >>> n, G3 = (e, t, n) => e << 64 - n | t >>> n - 32, K3 = (e, t, n) => e >>> n - 32 | t << 64 - n, V3 = (e, t) => t, X3 = (e, t) => e, Y3 = (e, t, n) => e << n | t >>> 32 - n, q3 = (e, t, n) => t << n | e >>> 32 - n, W3 = (e, t, n) => t << n - 32 | e >>> 64 - n, Z3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function J3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Q3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), e4 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, t4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), n4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, r4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), o4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, rt = {
  fromBig: Lm,
  split: H3,
  toBig: D3,
  shrSH: F3,
  shrSL: j3,
  rotrSH: R3,
  rotrSL: z3,
  rotrBH: G3,
  rotrBL: K3,
  rotr32H: V3,
  rotr32L: X3,
  rotlSH: Y3,
  rotlSL: q3,
  rotlBH: W3,
  rotlBL: Z3,
  add: J3,
  add3L: Q3,
  add3H: e4,
  add4L: t4,
  add4H: n4,
  add5H: o4,
  add5L: r4
}, [s4, i4] = rt.split([
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
let du = class extends ph {
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
      const T = hs[A - 15] | 0, B = ps[A - 15] | 0, X = rt.rotrSH(T, B, 1) ^ rt.rotrSH(T, B, 8) ^ rt.shrSH(T, B, 7), Q = rt.rotrSL(T, B, 1) ^ rt.rotrSL(T, B, 8) ^ rt.shrSL(T, B, 7), re = hs[A - 2] | 0, q = ps[A - 2] | 0, m = rt.rotrSH(re, q, 19) ^ rt.rotrBH(re, q, 61) ^ rt.shrSH(re, q, 6), L = rt.rotrSL(re, q, 19) ^ rt.rotrBL(re, q, 61) ^ rt.shrSL(re, q, 6), _ = rt.add4L(Q, L, ps[A - 7], ps[A - 16]), N = rt.add4H(_, X, m, hs[A - 7], hs[A - 16]);
      hs[A] = N | 0, ps[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = rt.rotrSH(d, w, 14) ^ rt.rotrSH(d, w, 18) ^ rt.rotrBH(d, w, 41), B = rt.rotrSL(d, w, 14) ^ rt.rotrSL(d, w, 18) ^ rt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, re = rt.add5L(P, B, Q, i4[A], ps[A]), q = rt.add5H(re, U, T, X, s4[A], hs[A]), m = re | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), _ = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = rt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = rt.add3L(m, _, W);
      r = rt.add3H(F, q, L, N), s = F | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = rt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = rt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = rt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = rt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = rt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    hs.fill(0), ps.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, a4 = class extends du {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, c4 = class extends du {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, l4 = class extends du {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
xi(() => new du());
xi(() => new a4());
xi(() => new c4());
xi(() => new l4());
function u4(e, t, n) {
  const s = w3;
  if ($4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Jd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var bn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(bn || (bn = {}));
let d4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Cm = class extends d4 {
  constructor(t) {
    super(t);
  }
};
function fu(e) {
  const t = [];
  return t.push(Qa(uh(e.version, 1))), t.push(Qa(e.hash160)), Oo(t);
}
function f4(e) {
  const t = [];
  return t.push(e.prefix), t.push(fu(e.address)), e.prefix === ef.Contract && t.push(ec(e.contractName)), Oo(t);
}
function ec(e) {
  const t = [], n = fh(e.content), r = n.byteLength;
  return t.push(Qa(uh(r, e.lengthPrefixBytes))), t.push(n), Oo(t);
}
function h4(e) {
  const t = [];
  return t.push(fu(e.address)), t.push(ec(e.contractName)), t.push(ec(e.assetName)), Oo(t);
}
function Tm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(f4(e.principal)), (e.conditionType === Ds.Fungible || e.conditionType === Ds.NonFungible) && t.push(h4(e.assetInfo)), e.conditionType === Ds.NonFungible && t.push(li(e.assetName)), t.push(e.conditionCode), e.conditionType === Ds.STX || e.conditionType === Ds.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Cm("The post-condition amount may not be larger than 8 bytes");
    t.push(d3(e.amount, !1, 8));
  }
  return Oo(t);
}
function po(e, t) {
  return Oo([e, t]);
}
function p4(e) {
  return new Uint8Array([e.type]);
}
function g4(e) {
  return e.type === bn.OptionalNone ? new Uint8Array([e.type]) : po(e.type, li(e.value));
}
function y4(e) {
  const t = new Uint8Array(4);
  return uu(t, e.buffer.length, 0), po(e.type, hh(t, e.buffer));
}
function w4(e) {
  const t = dh(f3(e.value, BigInt(m3)), vm);
  return po(e.type, t);
}
function m4(e) {
  const t = dh(e.value, vm);
  return po(e.type, t);
}
function b4(e) {
  return po(e.type, fu(e.address));
}
function x4(e) {
  return po(e.type, hh(fu(e.address), ec(e.contractName)));
}
function S4(e) {
  return po(e.type, li(e.value));
}
function v4(e) {
  const t = [], n = new Uint8Array(4);
  uu(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = li(r);
    t.push(s);
  }
  return po(e.type, Oo(t));
}
function A4(e) {
  const t = [], n = new Uint8Array(4);
  uu(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = u4(s);
    t.push(ec(o));
    const i = li(e.data[s]);
    t.push(i);
  }
  return po(e.type, Oo(t));
}
function Bm(e, t) {
  const n = [], r = t == "ascii" ? g3(e.data) : fh(e.data), s = new Uint8Array(4);
  return uu(s, r.length, 0), n.push(s), n.push(r), po(e.type, Oo(n));
}
function E4(e) {
  return Bm(e, "ascii");
}
function k4(e) {
  return Bm(e, "utf8");
}
function li(e) {
  switch (e.type) {
    case bn.BoolTrue:
    case bn.BoolFalse:
      return p4(e);
    case bn.OptionalNone:
    case bn.OptionalSome:
      return g4(e);
    case bn.Buffer:
      return y4(e);
    case bn.UInt:
      return m4(e);
    case bn.Int:
      return w4(e);
    case bn.PrincipalStandard:
      return b4(e);
    case bn.PrincipalContract:
      return x4(e);
    case bn.ResponseOk:
    case bn.ResponseErr:
      return S4(e);
    case bn.List:
      return v4(e);
    case bn.Tuple:
      return A4(e);
    case bn.StringASCII:
      return E4(e);
    case bn.StringUTF8:
      return k4(e);
    default:
      throw new Cm("Unable to serialize. Invalid Clarity Value.");
  }
}
const $4 = (e, t) => e ? fh(e).length > t : !1, I4 = "connect-ui";
let al, Mm, dr = !1, rf = !1;
const Uo = (e, t = "") => () => {
}, L4 = (e, t) => () => {
}, C4 = "{visibility:hidden}.hydrated{visibility:inherit}", K0 = {}, T4 = "http://www.w3.org/2000/svg", B4 = "http://www.w3.org/1999/xhtml", M4 = (e) => e != null, wh = (e) => (e = typeof e, e === "object" || e === "function");
function Nm(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Je = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !wh(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? of(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = of(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, of = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, N4 = {}, _4 = (e) => e && e.$tag$ === N4, P4 = (e, t) => e != null && !wh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, U4 = (e) => va(e).$hostElement$, O4 = (e, t, n) => {
  const r = Hn.ce(t, n);
  return e.dispatchEvent(r), r;
}, V0 = /* @__PURE__ */ new WeakMap(), H4 = (e, t, n) => {
  let r = Cl.get(e);
  o$ && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Cl.set(e, r);
}, D4 = (e, t, n, r) => {
  var s;
  let o = _m(t);
  const i = Cl.get(o);
  if (e = e.nodeType === 11 ? e : lo, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = V0.get(e), c;
      if (a || V0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = lo.createElement("style"), c.innerHTML = i;
          const u = (s = Hn.$nonce$) !== null && s !== void 0 ? s : Nm(lo);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, F4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Uo("attachStyles", t.$tagName$), o = D4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, _m = (e, t) => "sc-" + e.$tagName$, X0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = q0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = Y0(n), h = Y0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : q0(hu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Hn.rel(e, t, n, !1), r && Hn.ael(e, t, r, !1);
    else {
      const c = wh(r);
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
}, j4 = /\s/, Y0 = (e) => e ? e.split(j4) : [], Pm = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || K0, i = t.$attrs$ || K0;
  for (r in o)
    r in i || X0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    X0(s, r, o[r], i[r], n, t.$flags$);
}, mh = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = lo.createTextNode(s.$text$);
  else {
    if (dr || (dr = s.$tag$ === "svg"), i = s.$elm$ = lo.createElementNS(dr ? T4 : B4, s.$tag$), dr && s.$tag$ === "foreignObject" && (dr = !1), Pm(null, s, dr), M4(al) && i["s-si"] !== al && i.classList.add(i["s-si"] = al), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = mh(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? dr = !1 : i.tagName === "foreignObject" && (dr = !0);
  }
  return i;
}, Um = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Mm && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = mh(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, Om = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, R4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : Rc(a, h) ? (Da(a, h), a = t[++s], h = r[++o]) : Rc(c, d) ? (Da(c, d), c = t[--i], d = r[--u]) : Rc(a, d) ? (Da(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : Rc(c, h) ? (Da(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (w = mh(t && t[o], n, o), h = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Um(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && Om(t, s, i);
}, Rc = (e, t) => e.$tag$ === t.$tag$, Da = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (dr = o === "svg" ? !0 : o === "foreignObject" ? !1 : dr, Pm(e, t, dr), r !== null && s !== null ? R4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Um(n, null, t, s, 0, s.length - 1)) : r !== null && Om(r, 0, r.length - 1), dr && o === "svg" && (dr = !1)) : e.$text$ !== i && (n.data = i);
}, z4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || of(null, null), s = _4(t) ? t : Je(null, null, t);
  Mm = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, al = n["s-sc"], Da(r, s);
}, Hm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, bh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Hm(e, e.$ancestorComponent$), i$(() => G4(e, t));
}, G4 = (e, t) => {
  const n = Uo("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), Y4(s, () => K4(e, r, t));
}, K4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Uo("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && F4(e);
  const i = Uo("render", e.$cmpMeta$.$tagName$);
  V4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => X4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, V4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, z4(e, t);
  } catch (r) {
    tc(r, e.$hostElement$);
  }
  return null;
}, X4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Uo("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Fm(n), r(), e.$onReadyResolve$(n), s || Dm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Sh(() => bh(e, !1)), e.$flags$ &= -517;
}, Dm = (e) => {
  Fm(lo.documentElement), Sh(() => O4(hu, "appload", { detail: { namespace: I4 } }));
}, Y4 = (e, t) => e && e.then ? e.then(t) : t(), Fm = (e) => e.classList.add("hydrated"), q4 = (e, t) => va(e).$instanceValues$.get(t), W4 = (e, t, n, r) => {
  const s = va(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = P4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && bh(s, !1));
}, jm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return q4(this, o);
        },
        set(a) {
          W4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        Hn.jmp(() => {
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
}, Z4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = r$(n), s.then) {
        const c = L4();
        s = await s, c();
      }
      s.isProxied || (jm(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Uo("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        tc(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = _m(n);
      if (!Cl.has(c)) {
        const u = Uo("registerStyles", n.$tagName$);
        H4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => bh(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, J4 = (e) => {
  if (!(Hn.$flags$ & 1)) {
    const t = va(e), n = t.$cmpMeta$, r = Uo("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Hm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), Z4(e, t, n);
    }
    r();
  }
}, Q4 = (e) => {
  Hn.$flags$ & 1 || va(e);
}, e$ = (e, t = {}) => {
  var n;
  const r = Uo(), s = [], o = t.exclude || [], i = hu.customElements, a = lo.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ lo.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(Hn, t), Hn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", lo.baseURI).href, e.map((y) => {
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
          super(P), P = this, n$(P, S), S.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : Hn.jmp(() => J4(this));
        }
        disconnectedCallback() {
          Hn.jmp(() => Q4(this));
        }
        componentOnReady() {
          return va(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = y[0], !o.includes(I) && !i.get(I) && (s.push(I), i.define(I, jm(
        U,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + C4, u.setAttribute("data-styles", "");
    const y = (n = Hn.$nonce$) !== null && n !== void 0 ? n : Nm(lo);
    y != null && u.setAttribute("nonce", y), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : Hn.jmp(() => d = setTimeout(Dm, 30)), r();
}, xh = /* @__PURE__ */ new WeakMap(), va = (e) => xh.get(e), t$ = (e, t) => xh.set(t.$lazyInstance$ = e, t), n$ = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], xh.set(e, n);
}, q0 = (e, t) => t in e, tc = (e, t) => (0, console.error)(e, t), Yu = /* @__PURE__ */ new Map(), r$ = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = Yu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (Yu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => QC).then(i, tc);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Yu.set(s, i), i[r]), tc);
}, Cl = /* @__PURE__ */ new Map(), hu = typeof window < "u" ? window : {}, lo = hu.document || { head: {} }, Hn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Rm = (e) => Promise.resolve(e), o$ = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), W0 = [], zm = [], s$ = (e, t) => (n) => {
  e.push(n), rf || (rf = !0, Hn.$flags$ & 4 ? Sh(sf) : Hn.raf(sf));
}, Z0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      tc(n);
    }
  e.length = 0;
}, sf = () => {
  Z0(W0), Z0(zm), (rf = W0.length > 0) && Hn.raf(sf);
}, Sh = (e) => Rm().then(e), i$ = /* @__PURE__ */ s$(zm), a$ = () => Rm(), c$ = (e, t) => typeof window > "u" ? Promise.resolve() : a$().then(() => e$([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var l$ = Object.defineProperty, u$ = Object.defineProperties, d$ = Object.getOwnPropertyDescriptors, Tl = Object.getOwnPropertySymbols, Gm = Object.prototype.hasOwnProperty, Km = Object.prototype.propertyIsEnumerable, J0 = (e, t, n) => t in e ? l$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, wr = (e, t) => {
  for (var n in t || (t = {})) Gm.call(t, n) && J0(e, n, t[n]);
  if (Tl) for (var n of Tl(t)) Km.call(t, n) && J0(e, n, t[n]);
  return e;
}, Yr = (e, t) => u$(e, d$(t)), Vm = (e, t) => {
  var n = {};
  for (var r in e) Gm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Tl) for (var r of Tl(e)) t.indexOf(r) < 0 && Km.call(e, r) && (n[r] = e[r]);
  return n;
};
function Xm() {
  return iu(ri()) || window.StacksProvider || window.BlockstackProvider;
}
function pu(e) {
  return e ? typeof e == "string" ? si.fromName(e) : "version" in e ? e : "url" in e ? new Nd({ url: e.url }) : e.transactionVersion === ai.Mainnet ? new Nd({ url: e.client.baseUrl }) : new _d({ url: e.client.baseUrl }) : new _d();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var f$ = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(f$ || {}), h$ = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(h$ || {}), vh = (e) => {
  let t = e;
  if (!t) {
    let n = new $y(["store_write"], document.location.href);
    t = new Md({ appConfig: n });
  }
  return t;
};
function Ym(e) {
  try {
    return vh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var qm = (e) => {
  let t = vh(e).loadUserData().appPrivateKey, n = Bn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function p$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [ii.Mainnet]: "mainnet", [ii.Testnet]: "testnet" }, a = pu(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function g$(e) {
  let t = pu(e.network), n = vh(e.userSession), r = Yr(wr({}, e), { network: t, userSession: n });
  return wr({ stxAddress: p$(r) }, r);
}
async function y$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(xm) : n = n.map((r) => Oe(Tm(r)))), new Bn.TokenSigner("ES256k", t).signAsync(Yr(wr({}, e), { postConditions: n }));
}
function w$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(xm) : t = t.map((n) => Oe(Tm(n)))), Bn.createUnsecuredToken(Yr(wr({}, e), { postConditions: t }));
}
var m$ = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = vt(a.replace(/^0x/, "")), u = c3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Yr(wr({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Yr(wr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, b$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = Vm(t, ["amount", "appDetails", "userSession"]);
  if (Ym(s)) {
    let { privateKey: a, publicKey: c } = qm(s), u = Yr(wr({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), y$(u, a);
  }
  let i = Yr(wr({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), w$(i);
};
async function x$(e, t, n) {
  let r = await t(Yr(wr(wr({}, g$(e)), e), { network: pu(e.network) }));
  return m$({ token: r, options: e }, n);
}
function S$(e, t = Xm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return x$(e, b$, t);
}
function Wm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Yr(wr({}, e), { message: $0(t), domain: $0(n) }) : Yr(wr({}, e), { message: Oe(li(t)), domain: Oe(li(n)) });
}
async function v$(e, t) {
  return new Bn.TokenSigner("ES256k", t).signAsync(Wm(e));
}
async function A$(e) {
  let t = e, { userSession: n } = t, r = Vm(t, ["userSession"]);
  if (Ym(n)) {
    let { privateKey: s, publicKey: o } = qm(n), i = Yr(wr({}, r), { publicKey: o });
    return v$(i, s);
  }
  return Bn.createUnsecuredToken(Wm(e));
}
var E$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(E$ || {}), Zm = "asigna-stx", Q0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Zm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage($$(e, t), "*");
}), k$ = { authenticationRequest: async (e) => Q0(e, "authenticationRequest"), transactionRequest: async (e) => Q0(e, "transactionRequest") }, $$ = (e, t) => ({ source: Zm, [t]: e }), I$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = k$);
};
I$();
var L$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function C$(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = ri(), i = Xm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    c$();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : L$, c = xA(a), u = document.createElement("connect-modal");
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
var zc = C$(S$);
function Ls(e, t, n) {
  return Ah(Xn(e, t), n);
}
function Xn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Vt(r);
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
      const r = M$(BigInt(`0x${ut(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ut(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function eg(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function gc(e, t = 8) {
  return (typeof e == "bigint" ? e : Xn(e, !1)).toString(16).padStart(t * 2, "0");
}
function gu(e) {
  return parseInt(e, 16);
}
function Ah(e, t = 16) {
  const n = gc(e, t);
  return Vt(n);
}
function T$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function B$(e, t) {
  return e & BigInt(1) << t;
}
function M$(e, t) {
  return B$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const N$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ut(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += N$[n];
  return t;
}
function Vt(e) {
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
function Aa(e) {
  return new TextEncoder().encode(e);
}
function Eh(e) {
  return new TextDecoder().decode(e);
}
function Jm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function _$(e) {
  return String.fromCharCode.apply(null, e);
}
function P$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function tg(e) {
  if (e.some(P$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function yu(...e) {
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
function un(e) {
  return yu(...e.map((t) => typeof t == "number" ? tg([t]) : t instanceof Array ? tg(t) : t));
}
var ng;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ng || (ng = {}));
var rg;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(rg || (rg = {}));
var og;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(og || (og = {}));
const Qm = 33, qu = 32;
function U$(e) {
  if (e.length < qu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + qu * 2), r = e.slice(2 + qu * 2);
  return {
    recoveryId: gu(t),
    r: n,
    s: r
  };
}
function O$(e) {
  const t = typeof e == "string" ? Vt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function H$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function D$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function F$(e, t) {
  return e[t];
}
function j$(e, t, n = 0) {
  return e[n] = t, e;
}
function R$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function ui(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var af;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(af || (af = {}));
const z$ = af.Mainnet, G$ = 128, K$ = 128, eb = 16, qs = 32, cf = 80, wu = 65, V$ = 32, X$ = 64, Bl = 34;
var Ce;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ce || (Ce = {}));
var it;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var lf;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(lf || (lf = {}));
var tr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(tr || (tr = {}));
const cl = ["onChainOnly", "offChainOnly", "any"], sg = {
  [cl[0]]: tr.OnChainOnly,
  [cl[1]]: tr.OffChainOnly,
  [cl[2]]: tr.Any,
  [tr.OnChainOnly]: tr.OnChainOnly,
  [tr.OffChainOnly]: tr.OffChainOnly,
  [tr.Any]: tr.Any
};
function Y$(e) {
  if (e in sg)
    return sg[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${cl.join(", ")}`);
}
var Ml;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ml || (Ml = {}));
Ml.Mainnet;
var ha;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ha || (ha = {}));
var nr;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(nr || (nr = {}));
var nn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(nn || (nn = {}));
var Dt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Dt || (Dt = {}));
var Nl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Nl || (Nl = {}));
var qt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qt || (qt = {}));
var nc;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(nc || (nc = {}));
var uf;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(uf || (uf = {}));
var rc;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(rc || (rc = {}));
var ig;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ig || (ig = {}));
var ag;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(ag || (ag = {}));
function df(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function q$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function tb(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function W$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  df(e.outputLen), df(e.blockLen);
}
function Z$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function J$(e, t) {
  tb(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ks = {
  number: df,
  bool: q$,
  bytes: tb,
  hash: W$,
  exists: Z$,
  output: J$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Wu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ro = (e, t) => e << 32 - t | e >>> t, Q$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Q$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function e8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function kh(e) {
  if (typeof e == "string" && (e = e8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class nb {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Si(e) {
  const t = (r) => e().update(kh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function t8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class $h extends nb {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Wu(this.buffer);
  }
  update(t) {
    Ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = kh(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Wu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ks.exists(this), Ks.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    t8(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Wu(t), c = this.outputLen;
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
const n8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rb = Uint8Array.from({ length: 16 }, (e, t) => t), r8 = rb.map((e) => (9 * e + 5) % 16);
let Ih = [rb], Lh = [r8];
for (let e = 0; e < 4; e++)
  for (let t of [Ih, Lh])
    t.push(t[e].map((n) => n8[n]));
const ob = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), o8 = Ih.map((e, t) => e.map((n) => ob[t][n])), s8 = Lh.map((e, t) => e.map((n) => ob[t][n])), i8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gc = (e, t) => e << t | e >>> 32 - t;
function cg(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Kc = new Uint32Array(16);
class c8 extends $h {
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
      Kc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = i8[y], I = a8[y], U = Ih[y], P = Lh[y], A = o8[y], T = s8[y];
      for (let B = 0; B < 16; B++) {
        const X = Gc(r + cg(y, o, a, u) + Kc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Gc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Gc(s + cg(v, i, c, h) + Kc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Gc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Kc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const l8 = Si(() => new c8()), u8 = (e, t, n) => e & t ^ ~e & n, d8 = (e, t, n) => e & t ^ e & n ^ t & n, f8 = new Uint32Array([
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
class sb extends $h {
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
      const w = ys[d - 15], y = ys[d - 2], v = ro(w, 7) ^ ro(w, 18) ^ w >>> 3, S = ro(y, 17) ^ ro(y, 19) ^ y >>> 10;
      ys[d] = S + ys[d - 7] + v + ys[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = ro(a, 6) ^ ro(a, 11) ^ ro(a, 25), y = h + w + u8(a, c, u) + f8[d] + ys[d] | 0, S = (ro(r, 2) ^ ro(r, 13) ^ ro(r, 22)) + d8(r, s, o) | 0;
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
class h8 extends sb {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Ch = Si(() => new sb());
Si(() => new h8());
const Vc = BigInt(2 ** 32 - 1), ff = BigInt(32);
function ib(e, t = !1) {
  return t ? { h: Number(e & Vc), l: Number(e >> ff & Vc) } : { h: Number(e >> ff & Vc) | 0, l: Number(e & Vc) | 0 };
}
function p8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = ib(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const g8 = (e, t) => BigInt(e >>> 0) << ff | BigInt(t >>> 0), y8 = (e, t, n) => e >>> n, w8 = (e, t, n) => e << 32 - n | t >>> n, m8 = (e, t, n) => e >>> n | t << 32 - n, b8 = (e, t, n) => e << 32 - n | t >>> n, x8 = (e, t, n) => e << 64 - n | t >>> n - 32, S8 = (e, t, n) => e >>> n - 32 | t << 64 - n, v8 = (e, t) => t, A8 = (e, t) => e, E8 = (e, t, n) => e << n | t >>> 32 - n, k8 = (e, t, n) => t << n | e >>> 32 - n, $8 = (e, t, n) => t << n - 32 | e >>> 64 - n, I8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function L8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const C8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), T8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, B8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), M8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, N8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, ot = {
  fromBig: ib,
  split: p8,
  toBig: g8,
  shrSH: y8,
  shrSL: w8,
  rotrSH: m8,
  rotrSL: b8,
  rotrBH: x8,
  rotrBL: S8,
  rotr32H: v8,
  rotr32L: A8,
  rotlSH: E8,
  rotlSL: k8,
  rotlBH: $8,
  rotlBL: I8,
  add: L8,
  add3L: C8,
  add3H: T8,
  add4L: B8,
  add4H: M8,
  add5H: _8,
  add5L: N8
}, [P8, U8] = ot.split([
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
class mu extends $h {
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
      const T = ws[A - 15] | 0, B = ms[A - 15] | 0, X = ot.rotrSH(T, B, 1) ^ ot.rotrSH(T, B, 8) ^ ot.shrSH(T, B, 7), Q = ot.rotrSL(T, B, 1) ^ ot.rotrSL(T, B, 8) ^ ot.shrSL(T, B, 7), re = ws[A - 2] | 0, q = ms[A - 2] | 0, m = ot.rotrSH(re, q, 19) ^ ot.rotrBH(re, q, 61) ^ ot.shrSH(re, q, 6), L = ot.rotrSL(re, q, 19) ^ ot.rotrBL(re, q, 61) ^ ot.shrSL(re, q, 6), _ = ot.add4L(Q, L, ms[A - 7], ms[A - 16]), N = ot.add4H(_, X, m, ws[A - 7], ws[A - 16]);
      ws[A] = N | 0, ms[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = ot.rotrSH(d, w, 14) ^ ot.rotrSH(d, w, 18) ^ ot.rotrBH(d, w, 41), B = ot.rotrSL(d, w, 14) ^ ot.rotrSL(d, w, 18) ^ ot.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, re = ot.add5L(P, B, Q, U8[A], ms[A]), q = ot.add5H(re, U, T, X, P8[A], ws[A]), m = re | 0, L = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), _ = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = ot.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = ot.add3L(m, _, W);
      r = ot.add3H(F, q, L, N), s = F | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = ot.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = ot.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = ot.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = ot.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = ot.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ws.fill(0), ms.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class O8 extends mu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class H8 extends mu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class D8 extends mu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Si(() => new mu());
Si(() => new O8());
const F8 = Si(() => new H8());
Si(() => new D8());
function ab(e) {
  if (Vt(e).byteLength != wu)
    throw Error("Invalid signature");
  return {
    type: Ce.MessageSignature,
    data: e
  };
}
function Fa(e, t) {
  return { type: Ce.Address, version: e, hash160: t };
}
function Yi(e) {
  return mi.c32address(e.version, e.hash160);
}
function di(e, t, n) {
  const r = t || 1, s = n || G$;
  if (Eb(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ce.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Th(e) {
  const t = mi.c32addressDecode(e);
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
function j8(e) {
  if (e.type === ae.PrincipalStandard)
    return Yi(e.address);
  if (e.type === ae.PrincipalContract)
    return `${Yi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function cb(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return G8(t, n);
  } else
    return R8(e);
}
function R8(e) {
  const t = Th(e);
  return { type: ae.PrincipalStandard, address: t };
}
function z8(e) {
  return { type: ae.PrincipalStandard, address: e };
}
function G8(e, t) {
  const n = Th(e), r = di(t);
  return lb(n, r);
}
function lb(e, t) {
  if (Aa(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ae.PrincipalContract, address: e, contractName: t };
}
function Zu(e, t = !1) {
  switch (e.type) {
    case ae.BoolTrue:
      return !0;
    case ae.BoolFalse:
      return !1;
    case ae.Int:
    case ae.UInt:
      return t ? e.value.toString() : e.value;
    case ae.Buffer:
      return `0x${ut(e.buffer)}`;
    case ae.OptionalNone:
      return null;
    case ae.OptionalSome:
      return zr(e.value);
    case ae.ResponseErr:
      return zr(e.value);
    case ae.ResponseOk:
      return zr(e.value);
    case ae.PrincipalStandard:
    case ae.PrincipalContract:
      return j8(e);
    case ae.List:
      return e.list.map((r) => zr(r));
    case ae.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = zr(e.data[r]);
      }), n;
    case ae.StringASCII:
      return e.data;
    case ae.StringUTF8:
      return e.data;
  }
}
function zr(e) {
  switch (e.type) {
    case ae.ResponseErr:
      return { type: Ss(e), value: Zu(e, !0), success: !1 };
    case ae.ResponseOk:
      return { type: Ss(e), value: Zu(e, !0), success: !0 };
    default:
      return { type: Ss(e), value: Zu(e, !0) };
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
      return `(string-ascii ${Jm(e.data).length})`;
    case ae.StringUTF8:
      return `(string-utf8 ${Aa(e.data).length})`;
  }
}
const ub = () => ({ type: ae.BoolTrue }), db = () => ({ type: ae.BoolFalse }), K8 = (e) => e ? ub() : db(), lg = BigInt("0xffffffffffffffffffffffffffffffff"), V8 = BigInt(0), ug = BigInt("0x7fffffffffffffffffffffffffffffff"), dg = BigInt("-170141183460469231731687303715884105728"), X8 = (e) => {
  const t = Xn(e, !0);
  if (t > ug)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ug}`);
  if (t < dg)
    throw new RangeError(`Cannot construct clarity integer form value less than ${dg}`);
  return { type: ae.Int, value: t };
}, Sn = (e) => {
  const t = Xn(e, !1);
  if (t < V8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > lg)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${lg}`);
  return { type: ae.UInt, value: t };
}, fb = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ae.Buffer, buffer: e };
};
function hb() {
  return { type: ae.OptionalNone };
}
function pb(e) {
  return { type: ae.OptionalSome, value: e };
}
function Y8(e) {
  return { type: ae.ResponseErr, value: e };
}
function q8(e) {
  return { type: ae.ResponseOk, value: e };
}
function W8(e) {
  return { type: ae.List, list: e };
}
function mr(e) {
  for (const t in e)
    if (!D6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ae.Tuple, data: e };
}
const At = (e) => ({ type: ae.StringASCII, data: e }), Z8 = (e) => ({ type: ae.StringUTF8, data: e });
class gb extends nb {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ks.hash(t);
    const r = kh(n);
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
    return Ks.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ks.exists(this), Ks.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const yb = (e, t, n) => new gb(e, t).update(n).digest();
yb.create = (e, t) => new gb(e, t);
rn.hmacSha256Sync = (e, ...t) => {
  const n = yb.create(Ch, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function pa(e) {
  return {
    type: Ce.PublicKey,
    data: Vt(e)
  };
}
function J8(e, t, n = qt.Compressed) {
  const r = U$(t.data), s = new gr(eg(r.r), eg(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === qt.Compressed;
  return o.toHex(i);
}
function Q8(e) {
  return { type: Ce.PublicKey, data: e };
}
function Ea(e) {
  return !ut(e.data).startsWith("04");
}
function _l(e) {
  return e.data.slice();
}
function e6(e) {
  const t = r6(e), n = uc(t.data.slice(0, 32), t.compressed);
  return pa(ut(n));
}
function t6(e) {
  const t = typeof e == "string" ? e : ut(e), n = at.fromHex(t).toHex(!0);
  return pa(n);
}
function n6(e) {
  const t = typeof e == "string" ? e : ut(e), n = at.fromHex(t).toHex(!1);
  return pa(n);
}
function hf(e) {
  const t = e.readUInt8(), n = t === 4 ? X$ : V$;
  return Q8(un([t, e.readBytes(n)]));
}
function r6(e) {
  const t = O$(e), n = t.length == Qm;
  return { data: t, compressed: n };
}
function o6(e, t) {
  const [n, r] = Wl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = gc(r, 1) + gr.fromHex(n).toCompactHex();
  return ab(o);
}
function s6(e) {
  return e6(e.data);
}
function i6(e, t, n) {
  return typeof e == "string" && (e = cb(e)), typeof n == "string" && (n = pg(n)), {
    type: Ce.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Xn(t, !1),
    memo: n ?? pg("")
  };
}
function a6(e, t, n, r) {
  return typeof e == "string" && (e = Th(e)), typeof t == "string" && (t = di(t)), typeof n == "string" && (n = di(n)), {
    type: Ce.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function fg(e, t, n) {
  return typeof e == "string" && (e = di(e)), typeof t == "string" && (t = y6(t)), typeof n == "number" ? {
    type: Ce.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ce.Payload,
    payloadType: it.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function c6() {
  return { type: Ce.Payload, payloadType: it.PoisonMicroblock };
}
function hg(e, t) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  return t != null ? {
    type: Ce.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ce.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: e
  };
}
function l6(e, t, n) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  if (n.byteLength != cf)
    throw Error(`VRF proof buffer size must be ${cf} bytes`);
  return {
    type: Ce.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ae.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var pf;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(pf || (pf = {}));
function u6(e, t, n, r, s, o, i) {
  return {
    type: Ce.Payload,
    payloadType: it.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function wb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(an(e.recipient)), t.push(Ls(e.amount, !1, 8)), t.push(To(e.memo));
      break;
    case it.ContractCall:
      t.push(To(e.contractAddress)), t.push(To(e.contractName)), t.push(To(e.functionName));
      const n = new Uint8Array(4);
      ui(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(an(r));
      });
      break;
    case it.SmartContract:
      t.push(To(e.contractName)), t.push(To(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(To(e.contractName)), t.push(To(e.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(an(e.recipient));
      break;
    case it.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(an(e.recipient ? pb(e.recipient) : hb())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Vt(e.tenureHash)), t.push(Vt(e.previousTenureHash)), t.push(Vt(e.burnViewHash)), t.push(Vt(e.previousTenureEnd)), t.push(ui(new Uint8Array(4), e.previousTenureBlocks)), t.push(j$(new Uint8Array(1), e.cause)), t.push(Vt(e.publicKeyHash));
      break;
  }
  return un(t);
}
function d6(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = Lr(e), r = Xn(e.readBytes(8), !1), s = bb(e);
      return i6(n, r, s);
    case it.ContractCall:
      const o = ga(e), i = Ir(e), a = Ir(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = Lr(e);
        c.push(T);
      }
      return a6(o, i, a, c);
    case it.SmartContract:
      const h = Ir(e), d = Ir(e, 4, 1e5);
      return fg(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(lf, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = Ir(e), B = Ir(e, 4, 1e5);
      return fg(T, B, A);
    }
    case it.PoisonMicroblock:
      return c6();
    case it.Coinbase: {
      const A = e.readBytes(qs);
      return hg(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(qs), T = Lr(e);
      return hg(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(qs), T = Lr(e), B = e.readBytes(cf);
      return l6(A, T, B);
    }
    case it.TenureChange:
      const w = ut(e.readBytes(20)), y = ut(e.readBytes(20)), v = ut(e.readBytes(20)), S = ut(e.readBytes(32)), I = e.readUInt32BE(), U = e.readUInt8Enum(pf, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), P = ut(e.readBytes(20));
      return u6(w, y, v, S, I, U, P);
  }
}
class bu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Fs extends bu {
  constructor(t) {
    super(t);
  }
}
class pr extends bu {
  constructor(t) {
    super(t);
  }
}
class Pl extends bu {
  constructor(t) {
    super(t);
  }
}
class Vs extends bu {
  constructor(t) {
    super(t);
  }
}
var Gr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Gr || (Gr = {}));
function gf(e) {
  return ab(ut(e.readBytes(wu)));
}
function qi(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ce.TransactionAuthField,
    contents: t
  };
}
function f6(e) {
  const t = e.readUInt8Enum(Gr, (n) => {
    throw new pr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Gr.PublicKeyCompressed:
      return qi(qt.Compressed, hf(e));
    case Gr.PublicKeyUncompressed:
      return qi(qt.Uncompressed, n6(hf(e).data));
    case Gr.SignatureCompressed:
      return qi(qt.Compressed, gf(e));
    case Gr.SignatureUncompressed:
      return qi(qt.Uncompressed, gf(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Bh(e) {
  return Vt(e.data);
}
function h6(e) {
  const t = [];
  switch (e.contents.type) {
    case Ce.PublicKey:
      t.push(e.pubKeyEncoding === qt.Compressed ? Gr.PublicKeyCompressed : Gr.PublicKeyUncompressed), t.push(_l(t6(e.contents.data)));
      break;
    case Ce.MessageSignature:
      t.push(e.pubKeyEncoding === qt.Compressed ? Gr.SignatureCompressed : Gr.SignatureUncompressed), t.push(Bh(e.contents));
      break;
  }
  return un(t);
}
function To(e) {
  switch (e.type) {
    case Ce.Address:
      return yc(e);
    case Ce.Principal:
      return mb(e);
    case Ce.LengthPrefixedString:
      return ya(e);
    case Ce.MemoString:
      return w6(e);
    case Ce.AssetInfo:
      return xb(e);
    case Ce.PostCondition:
      return m6(e);
    case Ce.PublicKey:
      return _l(e);
    case Ce.LengthPrefixedList:
      return _h(e);
    case Ce.Payload:
      return wb(e);
    case Ce.TransactionAuthField:
      return h6(e);
    case Ce.MessageSignature:
      return Bh(e);
  }
}
function p6() {
  return {
    type: Ce.Address,
    version: Nl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Mh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Dt.SerializeP2PKH || t === Dt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Dt.SerializeP2WPKH || t === Dt.SerializeP2WSH || t === Dt.SerializeP2WSHNonSequential) && !r.every(Ea))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Dt.SerializeP2PKH:
      return Fa(e, P6(r[0].data));
    case Dt.SerializeP2WPKH:
      return Fa(e, U6(r[0].data));
    case Dt.SerializeP2SH:
    case Dt.SerializeP2SHNonSequential:
      return Fa(e, O6(n, r.map(_l)));
    case Dt.SerializeP2WSH:
    case Dt.SerializeP2WSHNonSequential:
      return Fa(e, H6(n, r.map(_l)));
  }
}
function yc(e) {
  const t = [];
  return t.push(Vt(gc(e.version, 1))), t.push(Vt(e.hash160)), un(t);
}
function ga(e) {
  const t = gu(ut(e.readBytes(1))), n = ut(e.readBytes(20));
  return { type: Ce.Address, version: t, hash160: n };
}
function mb(e) {
  const t = [];
  return t.push(e.prefix), t.push(yc(e.address)), e.prefix === rc.Contract && t.push(ya(e.contractName)), un(t);
}
function g6(e) {
  const t = e.readUInt8Enum(rc, (s) => {
    throw new pr(`Unexpected Principal payload type: ${s}`);
  }), n = ga(e);
  if (t === rc.Standard)
    return { type: Ce.Principal, prefix: t, address: n };
  const r = Ir(e);
  return {
    type: Ce.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ya(e) {
  const t = [], n = Aa(e.content), r = n.byteLength;
  return t.push(Vt(gc(r, e.lengthPrefixBytes))), t.push(n), un(t);
}
function Ir(e, t, n) {
  t = t || 1;
  const r = gu(ut(e.readBytes(t))), s = Eh(e.readBytes(r));
  return di(s, t, n ?? 128);
}
function y6(e) {
  return di(e, 4, 1e5);
}
function pg(e) {
  if (e && Eb(e, Bl))
    throw new Error(`Memo exceeds maximum length of ${Bl} bytes`);
  return { type: Ce.MemoString, content: e };
}
function w6(e) {
  const t = [], n = Aa(e.content), r = _6(ut(n), Bl * 2);
  return t.push(Vt(r)), un(t);
}
function bb(e) {
  let t = Eh(e.readBytes(Bl));
  return t = t.replace(/\u0000*$/, ""), { type: Ce.MemoString, content: t };
}
function xb(e) {
  const t = [];
  return t.push(yc(e.address)), t.push(ya(e.contractName)), t.push(ya(e.assetName)), un(t);
}
function yf(e) {
  return {
    type: Ce.AssetInfo,
    address: ga(e),
    contractName: Ir(e),
    assetName: Ir(e)
  };
}
function Nh(e, t) {
  return {
    type: Ce.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function _h(e) {
  const t = e.values, n = [];
  n.push(Vt(gc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(To(r));
  return un(n);
}
function Sb(e, t, n) {
  const r = gu(ut(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Ce.Address:
        s.push(ga(e));
        break;
      case Ce.LengthPrefixedString:
        s.push(Ir(e));
        break;
      case Ce.MemoString:
        s.push(bb(e));
        break;
      case Ce.AssetInfo:
        s.push(yf(e));
        break;
      case Ce.PostCondition:
        s.push(b6(e));
        break;
      case Ce.PublicKey:
        s.push(hf(e));
        break;
      case Ce.TransactionAuthField:
        s.push(f6(e));
        break;
    }
  return Nh(s, n);
}
function m6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(mb(e.principal)), (e.conditionType === nr.Fungible || e.conditionType === nr.NonFungible) && t.push(xb(e.assetInfo)), e.conditionType === nr.NonFungible && t.push(an(e.assetName)), t.push(e.conditionCode), e.conditionType === nr.STX || e.conditionType === nr.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Fs("The post-condition amount may not be larger than 8 bytes");
    t.push(Ls(e.amount, !1, 8));
  }
  return un(t);
}
function b6(e) {
  const t = e.readUInt8Enum(nr, (i) => {
    throw new pr(`Could not read ${i} as PostConditionType`);
  }), n = g6(e);
  let r, s, o;
  switch (t) {
    case nr.STX:
      return r = e.readUInt8Enum(nc, (a) => {
        throw new pr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${ut(e.readBytes(8))}`), {
        type: Ce.PostCondition,
        conditionType: nr.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case nr.Fungible:
      return s = yf(e), r = e.readUInt8Enum(nc, (a) => {
        throw new pr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${ut(e.readBytes(8))}`), {
        type: Ce.PostCondition,
        conditionType: nr.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case nr.NonFungible:
      s = yf(e);
      const i = Lr(e);
      return r = e.readUInt8Enum(uf, (a) => {
        throw new pr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ce.PostCondition,
        conditionType: nr.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function go(e, t) {
  return un([e, t]);
}
function x6(e) {
  return new Uint8Array([e.type]);
}
function S6(e) {
  return e.type === ae.OptionalNone ? new Uint8Array([e.type]) : go(e.type, an(e.value));
}
function v6(e) {
  const t = new Uint8Array(4);
  return ui(t, e.buffer.length, 0), go(e.type, yu(t, e.buffer));
}
function A6(e) {
  const t = Ah(T$(e.value, BigInt(K$)), eb);
  return go(e.type, t);
}
function E6(e) {
  const t = Ah(e.value, eb);
  return go(e.type, t);
}
function k6(e) {
  return go(e.type, yc(e.address));
}
function $6(e) {
  return go(e.type, yu(yc(e.address), ya(e.contractName)));
}
function I6(e) {
  return go(e.type, an(e.value));
}
function L6(e) {
  const t = [], n = new Uint8Array(4);
  ui(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = an(r);
    t.push(s);
  }
  return go(e.type, un(t));
}
function C6(e) {
  const t = [], n = new Uint8Array(4);
  ui(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = di(s);
    t.push(ya(o));
    const i = an(e.data[s]);
    t.push(i);
  }
  return go(e.type, un(t));
}
function vb(e, t) {
  const n = [], r = t == "ascii" ? Jm(e.data) : Aa(e.data), s = new Uint8Array(4);
  return ui(s, r.length, 0), n.push(s), n.push(r), go(e.type, un(n));
}
function T6(e) {
  return vb(e, "ascii");
}
function B6(e) {
  return vb(e, "utf8");
}
function an(e) {
  switch (e.type) {
    case ae.BoolTrue:
    case ae.BoolFalse:
      return x6(e);
    case ae.OptionalNone:
    case ae.OptionalSome:
      return S6(e);
    case ae.Buffer:
      return v6(e);
    case ae.UInt:
      return E6(e);
    case ae.Int:
      return A6(e);
    case ae.PrincipalStandard:
      return k6(e);
    case ae.PrincipalContract:
      return $6(e);
    case ae.ResponseOk:
    case ae.ResponseErr:
      return I6(e);
    case ae.List:
      return L6(e);
    case ae.Tuple:
      return C6(e);
    case ae.StringASCII:
      return T6(e);
    case ae.StringUTF8:
      return B6(e);
    default:
      throw new Fs("Unable to serialize. Invalid Clarity Value.");
  }
}
function M6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const gg = /* @__PURE__ */ new Map();
function Ab(e, t) {
  const n = gg.get(e);
  if (n !== void 0)
    return n(t);
  const r = M6(e);
  return gg.set(e, r), Ab(e, t);
}
class Va {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return R$(this.readBytes(4), 0);
  }
  readUInt8() {
    return F$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return H$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = ut(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = ut(n);
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
    if (Ab(t, r))
      return r;
    throw n(r);
  }
}
function Lr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Va(Vt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Va(e) : t = e;
  switch (t.readUInt8Enum(ae, (r) => {
    throw new pr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ae.Int:
      return X8(t.readBytes(16));
    case ae.UInt:
      return Sn(t.readBytes(16));
    case ae.Buffer:
      const r = t.readUInt32BE();
      return fb(t.readBytes(r));
    case ae.BoolTrue:
      return ub();
    case ae.BoolFalse:
      return db();
    case ae.PrincipalStandard:
      const s = ga(t);
      return z8(s);
    case ae.PrincipalContract:
      const o = ga(t), i = Ir(t);
      return lb(o, i);
    case ae.ResponseOk:
      return q8(Lr(t));
    case ae.ResponseErr:
      return Y8(Lr(t));
    case ae.OptionalNone:
      return hb();
    case ae.OptionalSome:
      return pb(Lr(t));
    case ae.List:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Lr(t));
      return W8(c);
    case ae.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = Ir(t).content;
        if (I === void 0)
          throw new pr('"content" is undefined');
        h[I] = Lr(t);
      }
      return mr(h);
    case ae.StringASCII:
      const d = t.readUInt32BE(), w = _$(t.readBytes(d));
      return At(w);
    case ae.StringUTF8:
      const y = t.readUInt32BE(), v = Eh(t.readBytes(y));
      return Z8(v);
    default:
      throw new pr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const N6 = (e) => e.length % 2 == 0 ? e : `0${e}`, _6 = (e, t) => e.padEnd(t, "0"), Eb = (e, t) => e ? Aa(e).length > t : !1;
function wf(e) {
  return zw(e);
}
const oc = (e) => l8(Ch(e)), Ph = (e) => ut(F8(e)), P6 = (e) => ut(oc(e)), U6 = (e) => {
  const t = oc(e), n = yu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = oc(n);
  return ut(r);
}, O6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = un(n), s = oc(r);
  return ut(s);
}, H6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = un(n), s = Ch(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = un(o), a = oc(i);
  return ut(a);
};
function D6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function kb(e) {
  const t = an(e);
  return `0x${ut(t)}`;
}
function F6(e) {
  return Lr(e);
}
const Qi = (e) => {
  try {
    return mi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Uh() {
  return {
    type: Ce.MessageSignature,
    data: ut(new Uint8Array(wu))
  };
}
function $b(e, t, n, r) {
  const s = Mh(0, e, 1, [pa(t)]).hash160, o = Ea(pa(t)) ? qt.Compressed : qt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Xn(n, !1),
    fee: Xn(r, !1),
    keyEncoding: o,
    signature: Uh()
  };
}
function sc(e) {
  return "signature" in e;
}
function yg(e) {
  return e === Dt.SerializeP2SH || e === Dt.SerializeP2WSH;
}
function j6(e) {
  return e === Dt.SerializeP2SHNonSequential || e === Dt.SerializeP2WSHNonSequential;
}
function wg(e) {
  const t = wf(e);
  return t.nonce = 0, t.fee = 0, sc(t) ? t.signature = Uh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function R6(e) {
  const t = [
    e.hashMode,
    Vt(e.signer),
    Ls(e.nonce, !1, 8),
    Ls(e.fee, !1, 8),
    e.keyEncoding,
    Bh(e.signature)
  ];
  return un(t);
}
function z6(e) {
  const t = [
    e.hashMode,
    Vt(e.signer),
    Ls(e.nonce, !1, 8),
    Ls(e.fee, !1, 8)
  ], n = Nh(e.fields);
  t.push(_h(n));
  const r = new Uint8Array(2);
  return D$(r, e.signaturesRequired, 0), t.push(r), un(t);
}
function G6(e, t) {
  const n = ut(t.readBytes(20)), r = BigInt(`0x${ut(t.readBytes(8))}`), s = BigInt(`0x${ut(t.readBytes(8))}`), o = t.readUInt8Enum(qt, (a) => {
    throw new pr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Dt.SerializeP2WPKH && o != qt.Compressed)
    throw new pr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = gf(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function K6(e, t) {
  const n = ut(t.readBytes(20)), r = BigInt("0x" + ut(t.readBytes(8))), s = BigInt("0x" + ut(t.readBytes(8))), o = Sb(t, Ce.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Ce.PublicKey:
        Ea(u.contents) || (i = !0);
        break;
      case Ce.MessageSignature:
        if (u.pubKeyEncoding === qt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Dt.SerializeP2WSH || e === Dt.SerializeP2WSHNonSequential))
    throw new Vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Ju(e) {
  return sc(e) ? R6(e) : z6(e);
}
function Qu(e) {
  const t = e.readUInt8Enum(Dt, (n) => {
    throw new pr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Dt.SerializeP2PKH || t === Dt.SerializeP2WPKH ? G6(t, e) : K6(t, e);
}
function Ib(e, t, n, r) {
  const o = e + ut(new Uint8Array([t])) + ut(Ls(n, !1, 8)) + ut(Ls(r, !1, 8));
  if (Vt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ph(Vt(o));
}
function Lb(e, t, n) {
  const r = 33 + wu, s = Ea(t) ? qt.Compressed : qt.Uncompressed, o = e + N6(s.toString(16)) + n.data, i = Vt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ph(i);
}
function V6(e, t, n, r, s) {
  const o = Ib(e, t, n, r), i = o6(s, o), a = s6(s), c = Lb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Cb(e, t, n, r, s, o) {
  const i = Ib(e, t, n, r), a = pa(J8(i, o, s)), c = Lb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function X6() {
  const e = $b(Dt.SerializeP2PKH, "", 0, 0);
  return e.signer = p6().hash160, e.keyEncoding = qt.Compressed, e.signature = Uh(), e;
}
function mg(e, t, n) {
  return sc(e) ? Y6(e, t, n) : q6(e, t, n);
}
function Y6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Cb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Mh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Vs(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function q6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ce.PublicKey:
        Ea(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Ce.MessageSignature:
        c.pubKeyEncoding === qt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Cb(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (yg(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Vs("Too many signatures");
        break;
    }
  if (yg(e.hashMode) && i !== e.signaturesRequired || j6(e.hashMode) && i < e.signaturesRequired)
    throw new Vs("Incorrect number of signatures");
  if (o && (e.hashMode === Dt.SerializeP2WSH || e.hashMode === Dt.SerializeP2WSHNonSequential))
    throw new Vs("Uncompressed keys are not allowed in this hash mode");
  const a = Mh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Vs(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Tb(e) {
  return {
    authType: nn.Standard,
    spendingCondition: e
  };
}
function Bb(e, t) {
  return {
    authType: nn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || $b(Dt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function bg(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case nn.Standard:
        return Tb(wg(e.spendingCondition));
      case nn.Sponsored:
        return Bb(wg(e.spendingCondition), X6());
      default:
        throw new Pl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function W6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      return mg(e.spendingCondition, t, nn.Standard);
    case nn.Sponsored:
      return mg(e.spendingCondition, t, nn.Standard);
    default:
      throw new Pl("Invalid origin auth type");
  }
}
function Z6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Xn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case nn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Xn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function J6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Xn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Q6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Xn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function e5(e, t) {
  const n = {
    ...t,
    nonce: Xn(t.nonce, !1),
    fee: Xn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function t5(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case nn.Standard:
      t.push(Ju(e.spendingCondition));
      break;
    case nn.Sponsored:
      t.push(Ju(e.spendingCondition)), t.push(Ju(e.sponsorSpendingCondition));
      break;
  }
  return un(t);
}
function n5(e) {
  const t = e.readUInt8Enum(nn, (r) => {
    throw new pr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case nn.Standard:
      return n = Qu(e), Tb(n);
    case nn.Sponsored:
      n = Qu(e);
      const r = Qu(e);
      return Bb(n, r);
  }
}
class r5 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Xn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? z$, this.postConditionMode = o ?? ha.Deny, this.postConditions = s ?? Nh([]), i)
      this.anchorMode = Y$(i);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = tr.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = tr.Any;
          break;
      }
  }
  signBegin() {
    const t = wf(this);
    return t.auth = bg(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wf(this);
    return t.auth = bg(t.auth), t.txid();
  }
  verifyOrigin() {
    return W6(this.auth, this.verifyBegin());
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
    if (n && !sc(n)) {
      const r = Ea(t);
      n.fields.push(qi(r ? qt.Compressed : qt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = V6(n, r, t.fee, t.nonce, s);
    return sc(t) ? t.signature = o : t.fields.push(qi(s.data.byteLength === Qm ? qt.Compressed : qt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Ph(t);
  }
  setSponsor(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e5(this.auth, t);
  }
  setFee(t) {
    this.auth = Z6(this.auth, t);
  }
  setNonce(t) {
    this.auth = J6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Fs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Fs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Fs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Fs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Fs('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return ui(n, this.chainId, 0), t.push(n), t.push(t5(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(_h(this.postConditions)), t.push(wb(this.payload)), un(t);
  }
}
function Wi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Va(Vt(e.slice(2))) : t = new Va(Vt(e)) : e instanceof Uint8Array ? t = new Va(e) : t = e;
  const n = t.readUInt8Enum(Ml, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = n5(t), o = t.readUInt8Enum(tr, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(ha, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Sb(t, Ce.PostCondition), c = d6(t);
  return new r5(n, s, c, a, i, o, r);
}
const o5 = K8, Xa = Sn, s5 = fb;
const i5 = /* @__PURE__ */ new Set([4001, -31001]), a5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], c5 = ["result", "data", "payload", "response", "params"], xg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], xu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), vi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, _o = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, l5 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Mb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => l5(o, r)) === s
  );
}, Nb = (e) => e ? Mb(vi()).some(
  (t) => {
    var n;
    return t.id === e && (xu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, _b = () => {
  if (typeof window > "u")
    return;
  const e = vi(), t = Mb(e).filter(
    (n) => {
      var r;
      return xu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = _o(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of a5) {
    const r = _o(e, n) ?? (e === window ? void 0 : _o(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, u5 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = vi(), n = _o(t, e) ?? (t === window ? void 0 : _o(window, e)) ?? iu(e);
  if (n)
    return n;
  if (xu(e) || Nb(e))
    return _b();
}, Xc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, d5 = ["blockstack-session", "blockstack"], f5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of d5) {
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
f5();
const Pb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, fr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, h5 = (e) => {
  const t = fr(e);
  if (!t)
    return null;
  const n = Pb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, p5 = (e) => {
  const t = fr(e);
  if (!t)
    return null;
  const n = Pb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, mf = (e, t = "mainnet") => {
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
      return mf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return mf(r, t);
  }
  return t;
}, Ws = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, ic = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Qi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = ic(s, t + 1);
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
    const o = ic(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Qi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Qi(n.testnet) ? n.testnet.trim() : null;
}, Sg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ub = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && i5.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, fi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = fr(n == null ? void 0 : n.message) ?? fr(t.message) ?? fr(t.error) ?? fr(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, wa = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw fi(t);
    if (t.status === "error")
      throw fi(t.result ?? t);
  }
  return e;
}, vg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return wa(r);
  } catch (r) {
    throw fi(r);
  }
}, Ob = () => _b(), Oh = () => {
  if (typeof window > "u")
    return;
  const e = vi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = _o(e, t) ?? (e === window ? void 0 : _o(window, t));
    if (n)
      return n;
  }
}, Ag = () => {
  if (typeof window > "u")
    return;
  const e = Oh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = vi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = _o(t, n) ?? (t === window ? void 0 : _o(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ll = (e) => {
  var r, s;
  const t = ri();
  if (xu(t) || Nb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = vi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Ob();
}, ed = (e) => {
  const t = p5(e);
  if (!t)
    return null;
  try {
    const n = Wi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ul = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = ed(e), r = h5(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? fr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = Ul(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of xg)
    if (ed(s[a])) {
      o = fr(s[a]);
      break;
    }
  const i = fr(s.txId) || fr(s.txid) || fr(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? fr(s.txRaw) ?? void 0
    };
  for (const a of xg) {
    const c = ed(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: fr(s[a]) ?? void 0
      };
  }
  for (const a of c5) {
    const c = s[a], u = Ul(c, t + 1);
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
}, td = (e) => {
  const t = Ul(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, g5 = (e) => {
  const t = Ul(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, y5 = (e) => ({
  ...e,
  fee: Ws(e.fee),
  nonce: Ws(e.nonce),
  sponsored: e.sponsored === !0
}), Eg = (e) => ({
  recipient: e.recipient,
  amount: Ws(e.amount) ?? "0",
  memo: e.memo,
  network: mf(e.network),
  address: e.stxAddress,
  fee: Ws(e.fee),
  nonce: Ws(e.nonce),
  sponsored: e.sponsored ?? !1
}), Hb = "WALLET_ADDRESS_MISMATCH", w5 = 45e3;
let Ya = null;
const bf = (e) => {
  e && (Ya = { address: e, at: Date.now() });
}, m5 = () => {
  Ya = null;
}, b5 = () => Ya && Date.now() - Ya.at <= w5 ? Ya.address : null, x5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, S5 = async (e) => {
  m5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = wa(await e.request("wallet_connect")), n = ic(t);
  return bf(n), n;
}, v5 = async (e, t, n, r) => {
  try {
    return wa(await e.request(t, n));
  } catch (s) {
    const o = fi(s);
    if (!x5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await S5(e);
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
        { code: i ? Hb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return wa(await e.request(t, n));
    } catch (a) {
      throw fi(a);
    }
  }
};
let kg = 3e4;
const A5 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${kg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, kg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, E5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Hb }
      );
    return c;
  }, s = b5();
  if (s)
    return Xc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  Xc(n, "account-read");
  try {
    const c = wa(
      await A5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = ic(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Ub(c))
      throw fi(c);
    Xc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return bf(o), r(o, "wallet_getAccount");
  let i;
  Xc(n, "account-reconnect");
  try {
    i = wa(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), fi(c);
  }
  const a = ic(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return bf(a), r(a, "wallet_connect");
}, k5 = async (e, t) => {
  if (!ll(e)) {
    const o = await vg(
      e,
      "stx_transferStx",
      Eg(t)
    );
    return td(o);
  }
  const n = Oh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await vg(
      n,
      "stx_transferStx",
      Eg(t)
    );
    return td(o);
  }
  const r = Ob();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await E5(r, t.stxAddress);
  const s = await v5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Ws(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Ws(t.fee) } : {}
    },
    t.stxAddress
  );
  return td(s);
}, $5 = () => ri(), Db = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = ri(), t = e ? u5(e) : void 0;
  if (t)
    return t;
  const n = vi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, $g = (e, t) => {
  const n = Db(), r = y5({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, g5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return zc(r, t);
  if (ll(n) && !Oh()) {
    const s = Ag();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ri(),
        route: "legacy-transaction-request"
      }), zc(r, s);
  }
  return void k5(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (Sg(s) && ll(n)) {
      const a = Ag();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ri(),
          route: "legacy-transaction-request"
        }), zc(r, a);
        return;
      }
    }
    if (Sg(s) && !ll(n)) {
      zc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ub(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, I5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Ig = (e) => kb(e).replace(/^0x/, ""), Lg = "This wallet cannot sign messages. Try Xverse or Leather.", Cg = (e) => typeof (e == null ? void 0 : e.request) == "function", Tg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", L5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, C5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function T5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: Ig(t.message),
    domain: Ig(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function B5(e, t) {
  const n = await A$({
    domain: t.domain,
    message: t.message,
    network: pu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? I5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function nd(e) {
  var s, o;
  const t = $5() || "", n = /xverse/i.test(t);
  let r = Db();
  if (n && !Tg(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Tg(r))
    try {
      return await B5(r, e);
    } catch (i) {
      if (n || !Cg(r) || !C5(i)) throw i;
    }
  if (!n && Cg(r))
    try {
      return await T5(r, e);
    } catch (i) {
      throw L5(i) ? new Error(Lg) : i;
    }
  throw new Error(Lg);
}
const Bg = 1000000n, Mo = 1000000n, Ol = 50n, cn = 3000n, qr = 300n, Na = 3000n, M5 = 50000n, N5 = 300n, _5 = 200n, Su = 15000n, Dn = (e) => e + Ol;
function Fr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / Bg}.${(n % Bg).toString().padStart(6, "0")}`;
}
function Mg(e, t = qr) {
  return e <= cn ? 0 : Number((e - cn) / Dn(t));
}
function rd(e, t = 0n) {
  const n = Mo - e - t;
  return n > 0n ? n : 0n;
}
function P5(e, t = qr) {
  return e > Mo ? "over" : e < cn + Dn(t) ? "empty" : e < M5 ? "low" : "ok";
}
const U5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", O5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", H5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function D5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || H5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== U5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Fb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", od = 3, F5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", j5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Ng = 1, [xf, jb] = Fb.split("."), Er = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Sf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function R5(e) {
  return Er(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function $s(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Rb(e, t = []) {
  const n = await $s(`/v2/contracts/call-read/${xf}/${jb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: xf, arguments: t.map((r) => "0x" + Er(an(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return zr(Lr(n.result));
}
async function z5() {
  const e = await $s(`/v2/contracts/source/${xf}/${jb}?proof=0`);
  if (typeof e.source != "string" || await R5(e.source) !== O5) throw Error("Deployed source does not match the tested helper.");
  if (D5(await Rb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function zb(e) {
  return e.startsWith("SP") && Qi(e) && !e.includes(".");
}
async function G5(e) {
  var r;
  if (!zb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await $s(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await $s(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function K5(e) {
  const t = await $s(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function V5(e, t) {
  var s, o;
  const n = await Rb("get-owner", [Xa(e), Xa(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !zb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function X5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Sf(e), signal: AbortSignal.timeout(15e3) });
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
async function Y5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function q5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Wi(Sf(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Yi(Fa(Nl.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || Yi(r.contractAddress) + "." + r.contractName.content !== Fb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Er(an(r.functionArgs[0])) !== Er(an(Xa(e.core))) || Er(an(r.functionArgs[1])) !== Er(an(Xa(e.song))) || Er(an(r.functionArgs[2])) !== Er(an(s5(Sf(e.id)))) || e.amount !== "50" || t.postConditionMode !== ha.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== nc.Equal || o.principal.prefix !== 2 || Yi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Yi(r.contractAddress) + "." + r.contractName.content !== F5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Er(an(r.functionArgs[0])) !== Er(an(Xa(e.song))) || typeof e.liked != "boolean" || Er(an(r.functionArgs[1])) !== Er(an(o5(e.liked))) || e.amount !== "0" || t.postConditionMode !== ha.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || zr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const W5 = "xtrata.xyz/radio/listening-wallet", Z5 = "Link a temporary listening wallet for pay-per-play; no spending permission", io = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Qi(e), J5 = (e) => ({
  domain: mr({ name: At(W5), version: At("1"), "chain-id": Sn(1) }),
  message: mr({
    purpose: At(Z5),
    main: At(e.main),
    listening: At(e.listening),
    issued: Sn(e.issued)
  })
}), Gb = 100000n, Q5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function eI(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !io(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Gb).sort(Q5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Yc = 50;
function Hl(e) {
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
async function tI(e, t, n = 4) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Yc}&offset=${i}`, s = Hl(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - Yc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= Yc ? s : Hl(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = eI(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - Yc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Io = 50, nI = 6, rI = 20, _g = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Pg(e, t) {
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
async function oI(e, t, n) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Hl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Io}&offset=0`));
    if (!s || s.total > nI * Io) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Io; i < s.total; i += Io) {
      const a = Hl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Io}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${Io}&offset=${u}`, a = Pg(await t(i(0)), e);
      if (!a || a.total > rI * Io) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = Io; u < a.total; u += Io) {
        const h = Pg(await t(i(u)), e);
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
function sI(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(_g).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : io(d.sender) && y >= Gb ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && io(d.recipient) && d.amount > 0n).sort(_g), a = i.reduce((d, w) => d + w.amount, 0n), c = o - n - a;
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
function iI(e, t) {
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
function Ug(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const qc = 1500n, ul = [100, 250, 500], aI = (e, t) => BigInt(e) * Dn(t), _a = ["prepared", "signed", "unknown", "pending"], cI = 30 * 6e4, Dl = 6e4, Di = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, lI = 3e3, Fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", sd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function uI(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, y = null, v = !1, S = "", I = "", U = 0, P, A = null, T, B = [], X, Q = -1 / 0;
  const re = /* @__PURE__ */ new Set();
  let q = null, m = !1, L = 0, _ = null, N = null, W = !1, F = null, ye = !1, ce = null, Ve = !1, $ = !1, R = !1, ue = !1, me = !1, Ne = 0, ve = null, wt = Promise.resolve();
  const Re = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? qr.toString()), Me = (x) => !!o && !(o.features ?? []).includes(x), _e = (x, k) => `xtrata.ppp.v1.${x}:${k}`, Mn = "xtrata.ppp.v1.as-main", vn = () => {
    if (e.main()) return;
    const x = e.store.get(Mn);
    return x && io(x) ? x : void 0;
  }, pt = () => e.main() ?? vn(), Lt = (x = o == null ? void 0 : o.address) => {
    if (!x) return [];
    try {
      const k = JSON.parse(e.store.get(_e("entries", x)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Ot = (x) => {
    const k = [x, ...Lt(x.address).filter((G) => !(G.txid === x.txid && G.kind === x.kind))].slice(0, 200);
    e.store.set(_e("entries", x.address), JSON.stringify(k));
  }, z = (x = o == null ? void 0 : o.address) => !!x && e.store.get(_e("on", x)) !== "0", O = (x) => {
    o != null && o.address && e.store.set(_e("on", o.address), x ? "1" : "0");
  }, ee = () => Lt().filter((x) => _a.includes(x.status)), ne = () => Ye() ? [...ee(), ...Lt(Qe()).filter((x) => _a.includes(x.status))] : ee(), le = () => bt(o == null ? void 0 : o.address), bt = (x) => {
    if (!x) return null;
    try {
      return JSON.parse(e.store.get(_e("deposit", x)) || "null");
    } catch {
      return null;
    }
  }, He = (x, k = o == null ? void 0 : o.address) => {
    k && e.store.set(_e("deposit", k), JSON.stringify(x));
  };
  let De = null;
  const Bt = (x = Dl) => {
    const k = e.now();
    De = { since: De && k < De.until ? De.since : k, until: Math.max((De == null ? void 0 : De.until) ?? 0, k + x) };
  }, Fe = () => !!De && e.now() < De.until && (i === void 0 || i < cn + Dn(Re())), Ee = () => !!le() || Fe(), Qe = () => Me("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Ye = () => !!(o != null && o.address) && Qe() !== o.address, We = () => Ye() ? c && c.for === Qe() ? c.value : void 0 : i, Rt = () => Me("likeFee") ? _5 : N5, dn = (x) => x !== void 0 && x < cn + Rt(), Yn = () => ee().filter((x) => e.now() - x.created > cI && re.has(x.txid)), pn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!pt() || r === pt() && !t.allowed), Mt = () => pn() && !(o != null && o.linked), qn = () => {
    const x = pt();
    return !Mt() && !!x && !!(o != null && o.linked) && o.linked !== x;
  }, jn = (x) => _e("return-to", x), Wr = (x = o == null ? void 0 : o.address) => {
    if (!x) return;
    const k = e.store.get(jn(x));
    return k && io(k) && k !== x ? k : void 0;
  }, Cr = (x = o == null ? void 0 : o.address) => q && q.for === x ? q.res : null;
  function An() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const x = Wr();
    if (x) return { to: x, kind: "chosen" };
    const k = Cr();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const En = (x) => _e("gift", x);
  function jt() {
    const x = o == null ? void 0 : o.address;
    if (!x) return null;
    if ((F == null ? void 0 : F.for) === x) return F.info;
    try {
      const k = JSON.parse(e.store.get(En(x)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const gn = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let je = null, on = null, yo = !1;
  const Zr = (x) => _e("award-claim", x), E = (x) => _e("award-send", x), H = (x) => {
    try {
      const k = JSON.parse(e.store.get(E(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, V = (x) => {
    try {
      const k = JSON.parse(e.store.get(Zr(x)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(x = !1) {
    var ke;
    const k = gn();
    if (!k || !e.awardStatus || yo) return;
    const G = (je == null ? void 0 : je.for) === k ? je : null, te = G == null ? void 0 : G.view.state, Be = te === "not-a-player" && ((ke = jt()) == null ? void 0 : ke.drop) === "players", Y = G ? Be ? 2e4 : te === "off" || te === "not-a-player" ? 30 * 6e4 : V(k) || H(k) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(G && !x && e.now() - G.at < Y)) {
      yo = !0;
      try {
        const xe = await e.awardStatus(k);
        if (je = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(Zr(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (on == null ? void 0 : on.for) !== k)
          try {
            on = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            on = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        je = { for: k, view: G && G.view.state !== "off" && G.view.state !== "not-a-player" ? { ...G.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        yo = !1;
      }
    }
  }
  function J() {
    const x = gn();
    if (!x || (je == null ? void 0 : je.for) !== x) return null;
    const k = je.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const G = k.state === "claimed" ? null : V(x), te = k.state === "claimed" && k.holds !== !1 ? H(x) : null;
    return { ...k, ...(on == null ? void 0 : on.for) === x ? { name: on.name } : {}, ...G ? { claimTx: G.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function oe() {
    var Be;
    const x = o == null ? void 0 : o.address;
    if (!x || !e.giftInfo || !((Be = t == null ? void 0 : t.gifts) != null && Be.enabled) || ye) return;
    const k = (F == null ? void 0 : F.for) === x ? F : null, G = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < G) return;
    ye = !0;
    const te = jt();
    try {
      const Y = await e.giftInfo(x);
      F = { for: x, info: Y, ok: !0, at: e.now() }, e.store.set(En(x), JSON.stringify(Y));
    } catch {
      F = { for: x, info: te, ok: !1, at: e.now() };
    } finally {
      ye = !1;
    }
  }
  const Le = () => Lt().reduce((x, k) => _a.includes(k.status) ? x + BigInt(k.amount || "0") + BigInt(k.fee || "0") : x, 0n);
  function Ae() {
    if (i === void 0) return 0;
    const x = i - Le() - BigInt(Zt.length) * Dn(Re());
    return x > 0n ? Mg(x, Re()) : 0;
  }
  const ze = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Ct = "EMPTY — ADD STX TO PLAY";
  function qe() {
    if (!(t != null && t.here)) return null;
    const x = (k, G) => ({ reason: k, text: G });
    switch (Ke()) {
      case "connect":
      case "wrong-wallet":
        return x("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return x("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return x("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return x("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return x("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return x("locked", "UNLOCK TO LISTEN");
      case "link":
        return x("link", "FINISH SETUP TO LISTEN");
      case "over":
        return x("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ee() ? x("arriving", "YOUR PLAYS ARE ARRIVING") : x("out", Ye() ? ze : Ct);
      case "ready":
        return !z() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? x("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : R ? Ae() < 1 ? x("out", Ye() ? ze : Ct) : null : x("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const dt = () => {
    var x;
    return !!(o != null && o.address) && Ye() && !!((x = jt()) != null && x.player);
  };
  function xt() {
    return dt() ? { locked: !0, known: !0 } : null;
  }
  const gt = 3 * 6e4, Nt = () => !!jt() && !!e.history && !(o != null && o.linked);
  async function C() {
    const x = o.address, k = jt(), { balance: G, nonce: te } = await e.chain.account(x), Be = await e.history(x, !0);
    if (!Be.ok) return null;
    const Y = sI({ self: x, balance: G, inbound: Be.inbound, outgoing: Be.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!Y.ok) return null;
    const ke = iI(Y.parts, Na);
    return { balance: G, nonce: te, parts: Y.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const $e = () => Ve ? { state: "unavailable" } : !ce || e.now() - ce.at > gt || i !== void 0 && i !== ce.balance ? { state: "none" } : ce.plan;
  function Ke() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const x = pt();
    if (!Mt()) {
      if (!x) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : qn() ? "wrong-wallet" : o.state === "known" ? "locked" : !Mt() && o.linked !== x ? "link" : i === void 0 ? "loading" : i > Mo && !o.backedUp ? "over" : i < cn + Dn(Re()) ? "fund" : "ready" : "loading";
  }
  const Tr = () => {
    var x, k, G, te, Be;
    return {
      step: Ke(),
      busy: u,
      message: S,
      error: I,
      notice: Br(),
      gate: t,
      main: pt(),
      mainConnected: !!e.main(),
      standIn: vn(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: J(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.hasBackup),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((Y) => Y === "over" && (o != null && o.backedUp) ? "ok" : Y)(P5(i, Re())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > Mo && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Mg(i, Re()),
      allowance: i === void 0 ? Mo : rd(i, BigInt(((x = le()) == null ? void 0 : x.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: z(),
      entries: Lt(),
      depositTxid: ((k = le()) == null ? void 0 : k.txid) ?? P,
      depositPending: Ee(),
      arrival: Ee() ? { since: ((G = le()) == null ? void 0 : G.at) ?? (De == null ? void 0 : De.since) ?? e.now(), graceMs: Dl } : null,
      walletOutdated: Me("like"),
      canAnother: !!o && !Me("another"),
      canForget: !!o && !Me("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (F == null ? void 0 : F.for) === o.address && F.ok ? !!F.info : null,
      linkedListening: X && X === pt() ? B.map((Y) => Y.listening) : [],
      serverLinked: !!A && T === `${pt()}:${o == null ? void 0 : o.address}`,
      stuck: Yn().length,
      armed: ue,
      queued: Zt.length,
      solo: Mt(),
      returnTo: (te = An()) == null ? void 0 : te.to,
      returnToKind: (Be = An()) == null ? void 0 : Be.kind,
      funderState: (() => {
        const Y = Cr();
        return Y ? Y.ok ? Y.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Y = Cr();
        return !!Y && Y.ok && Y.distinct > 1;
      })(),
      walletCannotSolo: Mt() && Me("standalone"),
      walletCannotMulti: Me("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((Y) => Y !== pt() && Y !== (o == null ? void 0 : o.linked)),
      creditedTo: Mt() && (o != null && o.address) && (_ == null ? void 0 : _.for) === o.address && _.main ? _.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(_e("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (N == null ? void 0 : N.for) === o.address && N.unused,
      gift: (() => {
        const Y = jt();
        return Y ? { player: Y.player, from: Y.from, source: Y.source, amount: Y.amount, ...Y.drop !== void 0 ? { drop: Y.drop } : {} } : null;
      })(),
      giftPlays: jt() ? Ae() : 0,
      playCost: Dn(Re()),
      giftStop: qe(),
      albumLock: xt(),
      returnPlan: $e(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Me("slots"),
      likeFunds: (() => {
        var xe;
        const Y = Qe();
        if (!Y || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const ke = We();
        return { address: Y, balance: ke, low: dn(ke), album: Ye(), pending: !!bt(Y), txid: (xe = bt(Y)) == null ? void 0 : xe.txid, main: pt() };
      })()
    };
  }, Br = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ct = (x, k = "") => {
    S = x, I = k, e.changed();
  };
  async function Wt(x, k) {
    if (!u) {
      u = x, I = "", e.changed();
      try {
        await k();
      } catch (G) {
        const te = G instanceof Error ? G.message : String(G);
        I = /Cancelled in the listening wallet/.test(te) ? "" : te, I || (S = "Not now. Nothing was signed.", me = !0);
      } finally {
        u = null, await $n(!0);
      }
    }
  }
  const Ai = () => !!(t != null && t.enabled) && t.here && (Mt() || !!pt() && t.allowed), br = () => Ai() && !qn(), Ho = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Wn = () => {
    if (qn()) throw new Error(Ho());
  };
  async function Zn() {
    if (!Ai()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const kn = (x) => {
    const k = pt();
    return x.request("listening.status", k ? { main: k } : void 0);
  };
  async function Mr(x = !1) {
    o != null && o.address && (!x && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await Ts(x)));
  }
  async function Ts(x = !1) {
    const k = Qe();
    if (!(!Ye() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!x && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function ft(x) {
    if ((X !== x || e.now() - Q >= 6e4) && (B = await e.links(x), X = x, Q = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === x) return;
    const k = `${x}:${o.address}`;
    T === k && A || (A = B.find((G) => G.listening === o.address) ?? null, T = k);
  }
  async function wo() {
    const x = o == null ? void 0 : o.address;
    if (!Mt() || !x || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const k = Cr(x);
    if (k != null && k.ok && k.funder) return;
    const G = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, L - 1), 30 * 6e4);
    if (!(q && q.for === x && e.now() - q.at < G)) {
      m = !0;
      try {
        q = { for: x, res: await e.funder(x), at: e.now() };
      } catch {
        q = { for: x, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      L = q.res.ok ? 0 : L + 1;
    }
  }
  async function Ei() {
    const x = o == null ? void 0 : o.address;
    if (!(!Mt() || !x || o != null && o.linked || !e.mainOf || W) && !(_ && _.for === x && (_.ok || e.now() - _.at < 6e4))) {
      W = !0;
      try {
        _ = { for: x, main: await e.mainOf(x), ok: !0, at: e.now() };
      } catch {
        _ = { for: x, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function mo() {
    const x = o == null ? void 0 : o.address;
    if (!(!x || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (N == null ? void 0 : N.for) === x) && e.store.get(_e("created", x)) !== "1")
      try {
        N = { for: x, unused: await e.chain.confirmedNonce(x) === 0n };
      } catch {
      }
  }
  async function ki() {
    var Be;
    const x = o == null ? void 0 : o.address;
    if (!x) return !1;
    let k, G = !1;
    const te = /* @__PURE__ */ new Map();
    for (const Y of ne())
      try {
        const ke = await e.chain.transaction(Y.txid);
        if (!ke) {
          if (re.add(Y.txid), e.now() - Y.created > 15 * 6e4 && !te.has(Y.address) && te.set(Y.address, await e.chain.confirmedNonce(Y.address)), k = te.get(Y.address), k !== void 0 && k > BigInt(Y.nonce)) {
            Ot({ ...Y, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((Y.status === "unknown" || Y.status === "signed") && Y.raw)
            try {
              await e.chain.broadcast(Y.raw, Y.txid), Ot({ ...Y, status: "pending" });
            } catch (Te) {
              Di(Te) && Ot({ ...Y, status: "failed", note: Te.message, raw: void 0 });
            }
          continue;
        }
        re.delete(Y.txid);
        const xe = String(ke.tx_status);
        if (xe === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (Ot({ ...Y, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? Y.fee), raw: void 0 }), G = !0, Y.kind === "like" && (v = !0, Y.status !== "confirmed" && typeof Y.liked == "boolean"))
            try {
              (Be = e.likeConfirmed) == null || Be.call(e, Y.song, Y.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? Ot({ ...Y, status: "failed", note: xe, raw: void 0 }) : Y.status !== "pending" && Ot({ ...Y, status: "pending" });
      } catch {
      }
    for (const Y of Ye() ? [x, Qe()] : [x]) {
      const ke = bt(Y);
      if (ke)
        try {
          const xe = await e.chain.transaction(ke.txid), Te = String((xe == null ? void 0 : xe.tx_status) ?? "");
          (Te === "success" && xe.is_unanchored === !1 || Te.startsWith("abort_") || Te.startsWith("dropped_") || !xe && e.now() - ke.at > 2 * 36e5) && (He(null, Y), Te === "success" && Bt(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return G;
  }
  async function $n(x = !1) {
    var k;
    try {
      const G = pt();
      if ((x || !t || r !== G || e.now() - n > 3e5) && (t = await e.config(G), n = e.now(), r = G), !t.enabled || !t.here || !Mt() && (!G || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ue && Bs(), e.changed();
        return;
      }
      await Zn(), o = await kn(s), qn() && o.state === "unlocked" && (vr(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await kn(s)), G && t.allowed && await ft(G), await Mr(x), await wo(), await Ei(), await mo(), await oe(), await D(), await ki() && await Mr(!0), await Ts(), await Ii(), U = 0;
    } catch {
      U++;
    }
    if (Ke() === "locked" ? $i() : ue && Bs(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), Zt.length && !vo && sr();
  }
  async function Do(x) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Me("slots")) return;
    const G = Number(e.store.get(_e("slot", k)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: te } = await e.chain.account(o.address);
        if (te >= cn + Dn(Re())) return;
        await x.request("listening.openSlot", { slot: G }), o = await kn(x), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function bo(x, k) {
    var Y;
    Wn();
    const G = !(o != null && o.address) || z(o.address), te = o != null && o.linked ? (Y = e.nameOf) == null ? void 0 : Y.call(e, o.linked) : void 0;
    await x.request("listening.unlock", { mode: "unlock", terms: G ? xo() : void 0, anyPasskey: k, ...pt() ? { main: pt() } : {}, ...te ? { label: te } : {} }), o = await kn(x), G && (z(o.address) ? await In() : await x.request("listening.stop")), await Do(x), ct(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Be = y;
    y = null, Be && e.now() - Be.at < 12e4 && setTimeout(() => void $n(!0).then(() => Ps(Be)), 0);
  }
  function $i() {
    ue || u || me || Ne >= 3 || !s || !(o != null && o.address) || (ue = !0, wt = (async () => {
      try {
        await bo(s, !1), Ne = 0;
      } catch (x) {
        const k = x instanceof Error ? x.message : String(x);
        /Cancelled in the listening wallet/.test(k) ? ve || (me = !0, ct("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ne++, I = k);
      } finally {
        ue = !1;
        const x = ve;
        ve = null, x ? await x() : await $n(!0);
      }
    })());
  }
  async function Bs(x) {
    ue && (ve = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await wt), x && await x(), e.changed();
  }
  const xo = () => ({
    fee: Re().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: Mo.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function In() {
    if (!(o != null && o.address)) return !1;
    if (R || (R = await e.tabLock(o.address)), !R)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Rn(x, k) {
    const G = o.address, { balance: te, nonce: Be } = k ?? await e.chain.account(G);
    i = te;
    const Y = await s.request("listening.prepareReturn", {
      mode: x.mode,
      balance: te.toString(),
      nonce: Be.toString(),
      fee: Na.toString(),
      ...x.amount !== void 0 ? { amount: x.amount.toString() } : {},
      ...x.linked ? {} : { destination: x.to }
    });
    if (Y.recipient !== x.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = x.mode === "amount" ? x.amount : x.mode === "all" ? te - Na : te - Mo - Na, xe = Wi(Y.raw);
    if (zr(xe.payload.recipient).value !== x.to || String(xe.payload.amount) !== Y.amount || ke !== void 0 && Y.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Te = {
      id: sd(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: Y.recipient,
      amount: Y.amount,
      fee: Y.fee,
      nonce: Be.toString(),
      created: e.now(),
      status: "signed",
      raw: Y.raw,
      txid: Y.txid
    };
    e.validate(Te), Ot(Te);
    try {
      await e.chain.broadcast(Y.raw, Y.txid), Ot({ ...Te, status: "pending" });
    } catch (lt) {
      throw Ot({ ...Te, status: "unknown", note: lt.message }), lt;
    }
    return Y;
  }
  const Fo = Su, xr = Na;
  async function Ms(x, k, G) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Me("slots") || Me("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = o.slot ?? 0;
    if (x === k || ![x, k].includes(te) || ![x, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Be = o.root ?? o.address, Y = x === 0 ? Be : o.address, ke = k === 0 ? Be : o.address, { balance: xe, nonce: Te } = await e.chain.account(Y);
    if (xe < G + xr + cn) throw new Error(x === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const lt = await s.request("listening.signMove", { from: x, to: k, amount: G.toString(), fee: xr.toString(), nonce: Te.toString(), balance: xe.toString() }), b = Wi(lt.raw);
    if (lt.from !== Y || lt.to !== ke || lt.amount !== G.toString() || zr(b.payload.recipient).value !== ke || String(b.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const M = {
      id: sd(),
      address: Y,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: lt.amount,
      fee: lt.fee,
      nonce: Te.toString(),
      created: e.now(),
      status: "signed",
      raw: lt.raw,
      txid: lt.txid
    };
    e.validate(M), Ot(M);
    try {
      await e.chain.broadcast(lt.raw, lt.txid), Ot({ ...M, status: "pending" });
    } catch (K) {
      throw Ot({ ...M, status: "unknown", note: K.message }), K;
    }
    return He({ txid: lt.txid, amount: lt.amount, at: e.now() }, ke), ke === Be && Be !== o.address ? c = null : a = -1 / 0, lt;
  }
  let So = !1;
  const Ns = /* @__PURE__ */ new Map(), Sr = (x) => _e("float", x);
  async function Ii() {
    if (So || (o == null ? void 0 : o.state) !== "unlocked" || !Ye() || Me("move") || Me("rootLike") || !o.address) return;
    const x = o.address;
    if (e.store.get(Sr(x)) === "1") return;
    const k = jt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const G = We();
    if (G === void 0 || i === void 0) return;
    if (!dn(G)) {
      e.store.set(Sr(x), "1");
      return;
    }
    if (bt(Qe()) || Ro() || ne().length || i < Fo * 4n + cn + xr) return;
    const te = Ns.get(x);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      So = !0, Ns.set(x, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await Ms(o.slot ?? 0, 0, Fo), e.store.set(Sr(x), "1");
      } catch (Be) {
        console.warn("[radio] likes float not sent yet", Be);
      } finally {
        So = !1;
      }
    }
  }
  async function ka(x) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await C().catch(() => null);
    if (!k)
      throw ce = null, Ve = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ve = !1, i = k.balance;
    const G = { balance: k.balance, nonce: k.nonce };
    if (x === "excess") {
      const xe = Ug(k.parts) ?? Wr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await Rn({ mode: "excess", to: xe, linked: !1 }, G), ce = null, ct("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = k.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ce && ce.balance === k.balance && e.now() - ce.at <= gt && ce.steps.length === te.length && ce.steps.every((xe, Te) => xe.to === te[Te].to && xe.mode === te[Te].mode && xe.send === te[Te].send))) {
      ce = {
        at: e.now(),
        balance: k.balance,
        steps: te,
        parts: k.parts,
        plan: { state: "ready", steps: te.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: Ug(k.parts) }
      }, ct(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const Y = te[0], ke = Y.to ?? Wr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (Y.mode === "amount" && Me("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Rn({ mode: Y.mode, to: ke, linked: !1, ...Y.mode === "amount" ? { amount: Y.send } : {} }, G), ce = null, te.length === 1 ? (O(!1), ct("Returned ✓ Paying is off.")) : ct(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function sn() {
    if (!(o != null && o.unproven)) return;
    const x = await Zn();
    await x.request("listening.prove"), o = await kn(x);
  }
  const or = {
    forceRefresh: () => $n(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (x) => {
      if (!e.main() && !(x !== null && !io(x))) {
        if (x === vn()) return $n(!0);
        e.store.set(Mn, x ?? ""), I = "", S = "", i = void 0, a = -1 / 0, c = null, await $n(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Wt("Check the listening wallet…", async () => {
      const x = await Zn();
      if (Me("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      vr(), await x.request("listening.forget"), i = void 0, o = await kn(x), O(!1), ct("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (x) => Wt("Waiting for your passkey…", async () => {
      const k = await Zn(), G = !!(x != null && x.another) && !e.main() && !Me("another");
      G && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: xo(), ...e.main() ? { main: e.main() } : {}, ...x != null && x.quick && !e.main() ? { quick: !0 } : {}, ...G ? { another: !0 } : {} }), o = await kn(k), o.address && e.store.set(_e("created", o.address), "1"), O(!0), ct(Mt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await In();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Ao = e.now() + jo;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (x) => {
      x ? Bt() : De = null, e.changed();
    },
    giftSent: (x, k) => {
      !(o != null && o.address) || le() || (He({ txid: x, amount: k.toString(), at: e.now() }), a = -1 / 0, F = null, je && (je = { ...je, at: -1 / 0 }), ct("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (x) => {
      if (Wn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Zn()).request("listening.bindSlot", { slot: x, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (x, k, G, te) => {
      He({ txid: G, amount: te.toString(), at: e.now() }, k), F = null, await or.openAlbum(x), ct("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (x) => Wt("Opening…", async () => {
      if (Wn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === x) return;
      vr(), await s.request("listening.openSlot", { slot: x }), o = await kn(s), i = void 0, a = -1 / 0, ce = null, Ve = !1;
      const k = o.root;
      k && x > 0 && e.store.set(_e("slot", k), String(x)), ct(x === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (x = !1) => {
      const k = () => Wt("Waiting for your passkey…", async () => bo(await Zn(), x));
      return ue ? x ? Me("cancel") ? (ct("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Bs(async () => {
        (Ke() === "locked" || Ke() === "intro") && await k();
      }) : wt : k();
    },
    link: () => Wt("Sign in your wallet…", async () => {
      Wn();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(x)).find((G) => G.listening === o.address);
      if (k)
        await s.request("listening.link", { main: x, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const G = { main: x, listening: o.address, issued: e.now() }, te = await e.signWithMain(x, J5(G)), Be = await s.request("listening.link", { main: x, issued: G.issued, mainSignature: te });
        await e.saveLink({ ...G, mainSignature: te, listeningSignature: Be.listeningSignature }), Q = -1 / 0;
      }
      ct("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Wt("One more passkey check…", sn), !(o != null && o.unproven)) : !0,
    deposit: () => Wt("Approve the deposit in your wallet…", async () => {
      Wn(), await sn();
      const x = e.main();
      if (!x || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (le()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Fe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Mr(!0);
      const k = rd(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await e.deposit(x, o.address, k), P && He({ txid: P, amount: k.toString(), at: e.now() }), ct("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Wt("Approve the top-up in your wallet…", async () => {
      Wn(), await sn();
      const x = e.main(), k = Qe();
      if (!x || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (bt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await e.chain.balance(k);
      Ye() ? c = { for: k, value: G, at: e.now() } : (i = G, a = e.now());
      const te = rd(G);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Be = await e.deposit(x, k, te);
      Be && He({ txid: Be, amount: te.toString(), at: e.now() }, k), ct("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (x) => Wt("Adding plays…", async () => {
      if (Wn(), !Ye()) throw new Error("Open the album you want to add plays to first.");
      if (!ul.includes(x)) throw new Error("Choose one of the amounts offered.");
      const k = aI(x, Re());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (ne().length || le()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ms(0, o.slot ?? 0, k), ct("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Wt("Confirm in the listening wallet…", async () => {
      if (!br()) throw new Error("Connect your wallet first.");
      await In(), await s.request("listening.approveSession", xo()), O(!0), ct("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Wt("Clearing…", async () => {
      for (const x of Yn())
        await e.chain.transaction(x.txid) || Ot({ ...x, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ct("Cleared ✓");
    }),
    switchOff: () => Wt("Switching off…", async () => {
      vr(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), ct("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Wt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const x = await Zn();
      await x.request("listening.backup"), o = await kn(x), ct("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (x, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Me("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Zn()).request("listening.signShelf", { action: x, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      on = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (x) => Wt("Confirm in the listening wallet…", async () => {
      var Te, lt, b, M;
      const k = gn();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Me("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (V(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || ne().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await In();
      const G = await e.awardNote(k, x), { balance: te, nonce: Be } = await e.chain.account(k);
      if (te < qc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await Zn()).request("listening.signAward", {
        cls: G.cls,
        number: G.number,
        plays: G.plays,
        record: G.record,
        signature: G.signature,
        fee: qc.toString(),
        nonce: Be.toString(),
        balance: te.toString()
      }), xe = Wi(ke.raw);
      if (ke.hero !== k || ke.number !== G.number || ((lt = (Te = xe.payload) == null ? void 0 : Te.functionName) == null ? void 0 : lt.content) !== "claim" || ((M = (b = xe.payload) == null ? void 0 : b.contractName) == null ? void 0 : M.content) !== j5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(Zr(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, je && (je = { ...je, at: -1 / 0 }), ct("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (x) => Wt("Confirm in the listening wallet…", async () => {
      var lt, b, M;
      const k = gn(), G = J();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((G == null ? void 0 : G.state) !== "claimed" || G.inscription === void 0) throw new Error("There is no record to send yet.");
      if (G.holds === !1) throw new Error("This record has already been sent.");
      if (G.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(k)) throw new Error("Your record is already on its way.");
      const te = x.trim();
      if (!io(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Me("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || ne().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await In();
      const { balance: Be, nonce: Y } = await e.chain.account(k);
      if (Be < qc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Zn()).request("listening.signSendRecord", { inscription: G.inscription, recipient: te, fee: qc.toString(), nonce: Y.toString(), balance: Be.toString() }), Te = Wi(xe.raw);
      if (xe.from !== k || xe.recipient !== te || xe.inscription !== G.inscription || ((b = (lt = Te.payload) == null ? void 0 : lt.functionName) == null ? void 0 : b.content) !== "transfer" || zr((M = Te.payload.functionArgs) == null ? void 0 : M[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, je && (je = { ...je, at: -1 / 0 }), ct("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Wt("Locking…", async () => {
      vr(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, ct("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (x) => {
      const k = String(x ?? "").trim();
      if (!(o != null && o.address)) return ct("", "Unlock the listening wallet first.");
      if (!io(k)) return ct("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return ct("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(jn(o.address), k), ct("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(jn(o.address), ""), e.changed();
    },
    returnFunds: (x) => Wt("Check the return in the listening wallet…", async () => {
      if (!br()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Nt()) return ka(x);
      const k = An();
      if (!k) throw new Error(Mt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Rn({ mode: x, to: k.to, linked: k.kind === "linked" }), x === "all" && O(!1), ct(x === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Zt = [], Nr = 10, jo = 30 * 6e4;
  let vo = !1, Ao = 0;
  const Li = (x) => e.now() < Ao && (x === "intro" || x === "locked" || x === "link" || x === "fund" && Ee()), Ro = () => h || !!u || d || w, vr = () => {
    Zt.length && (Zt.length = 0, e.changed());
  };
  async function Ci(x) {
    if (!Zt.some((k) => k.id === x.id) && !Lt().some((k) => k.id === x.id) && (Zt.push({ ...x, at: e.now() }), Zt.length > Nr && Zt.shift()), Ro() || ee().length) {
      const k = Zt.length;
      S = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await sr();
  }
  async function sr() {
    if (!vo) {
      vo = !0;
      try {
        for (; Zt.length; ) {
          for (; Zt.length && e.now() - Zt[0].at > jo; ) Zt.shift();
          if (!Zt.length || Ro() || await _s(Zt[0]) === "wait") return;
          Zt.shift();
        }
      } finally {
        vo = !1, e.changed();
      }
    }
  }
  async function _s(x) {
    var k;
    h = !0;
    try {
      await $n();
      const G = Ke();
      if (G === "loading" || Li(G)) return "wait";
      if (G !== "ready" || !z() || !(o != null && o.session) || o.session.playsLeft < 1 || !R) return "done";
      if (ee().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const te = o.address, { balance: Be, nonce: Y } = await e.chain.account(te);
      i = Be, a = e.now();
      const ke = await e.chain.owner(od, x.song);
      if (ke === te || ke === pt()) return "done";
      const xe = await s.request("listening.signPlay", {
        core: od,
        song: x.song,
        receipt: x.id,
        fee: Re().toString(),
        nonce: Y.toString(),
        balance: Be.toString()
      }), Te = {
        id: x.id,
        address: te,
        kind: "play",
        core: od,
        song: x.song,
        recipient: ke,
        amount: "50",
        fee: Re().toString(),
        nonce: Y.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(Te), Ot(Te);
      const lt = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), Ot({ ...Te, status: "pending" }), S = `♪ Paid ${lt}`, I = "";
      } catch (b) {
        Ot({ ...Te, status: Di(b) ? "failed" : "unknown", note: b.message, ...Di(b) ? { raw: void 0 } : {} }), I = b.message;
      }
      return o = await kn(s), "done";
    } catch (G) {
      const te = G instanceof Error ? G.message : "payment unavailable";
      return (k = jt()) != null && k.player ? (S = "Payment is taking a moment: " + te, "wait") : (S = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function zo(x) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ke()) || Me("like") ? !1 : (Ps(x), !0);
  }
  async function Ps(x) {
    const k = x.title ? `“${x.title}”` : `song #${x.song}`, G = (be) => {
      var Jt;
      I = be, S = "";
      try {
        (Jt = e.likeFailed) == null || Jt.call(e, x.song);
      } catch {
      }
      e.changed();
    }, te = Ye(), Be = Ke(), Y = pt(), ke = te && (Be === "fund" || Be === "over") ? "ready" : Be, xe = Mt() ? Qe() : Y;
    if (ke === "locked") {
      y = { ...x, at: e.now() }, ct(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return G(Ho());
    if (ke === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Mt() && Me("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await Ts(!0);
      const be = We();
      if (dn(be))
        return e.changed(), G(Fl);
    }
    if (ke !== "ready" || !xe) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!R) return G("Pay-per-play is running in another tab. Like from that tab.");
    const Te = Lt(Qe()).find((be) => be.kind === "like" && be.song === x.song);
    if (Te && _a.includes(Te.status))
      return G(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((Te == null ? void 0 : Te.status) === "confirmed" && e.now() - (Te.confirmedAt ?? 0) < lI)
      return G(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let lt;
    w = !0;
    try {
      lt = e.likeState ? (await e.likeState(xe, x.song)).by : x.likedBy ?? [];
    } catch {
      lt = x.likedBy;
    } finally {
      w = !1;
    }
    if (!lt) return G(`Could not check ${k} right now. Try the heart again.`);
    const b = Qe(), K = ((Te == null ? void 0 : Te.status) === "confirmed" && typeof Te.liked == "boolean" && e.now() - (Te.confirmedAt ?? Te.created) < 5 * 6e4 ? Te.liked : void 0) ?? lt.includes(b);
    if (!K && lt.some((be) => be !== b)) return G(Mt() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${lt.includes(Y) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Us({ song: x.song, liked: !K, title: x.title, artist: x.artist });
  }
  async function Us(x) {
    var te, Be, Y;
    if (d) {
      ct("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = x.title ? `“${x.title}”${x.artist ? ` by ${x.artist}` : ""}` : `song #${x.song}`, G = e.wait ?? ((ke) => new Promise((xe) => setTimeout(xe, ke)));
    try {
      ct(`${x.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Ye() ? Lt(Qe()).some((K) => _a.includes(K.status)) : ee().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await $n(!0);
      }
      if (!Ye() && Ke() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const xe = Qe(), { balance: Te, nonce: lt } = await e.chain.account(xe);
      if (Ye() ? c = { for: xe, value: Te, at: e.now() } : (i = Te, a = e.now()), dn(Te)) throw new Error(Fl);
      const b = await s.request("listening.signLike", {
        song: x.song,
        liked: x.liked,
        fee: Rt().toString(),
        nonce: lt.toString(),
        balance: Te.toString()
      }), M = {
        id: sd(),
        address: xe,
        kind: "like",
        core: 0,
        song: x.song,
        liked: x.liked,
        recipient: "",
        amount: "0",
        fee: Rt().toString(),
        nonce: lt.toString(),
        created: e.now(),
        status: "signed",
        raw: b.raw,
        txid: b.txid,
        ...x.title ? { title: String(x.title).slice(0, 120) } : {},
        ...x.artist ? { artist: String(x.artist).slice(0, 120) } : {}
      };
      e.validate(M), Ot(M);
      try {
        await e.chain.broadcast(b.raw, b.txid), Ot({ ...M, status: "pending" }), S = `${x.liked ? "♥ Liked" : "Unliked"} ${k}`, I = "";
        try {
          (te = e.likeSent) == null || te.call(e, x.song, x.liked);
        } catch {
        }
      } catch (K) {
        if (Ot({ ...M, status: Di(K) ? "failed" : "unknown", note: K.message, ...Di(K) ? { raw: void 0 } : {} }), I = K.message, Di(K)) try {
          (Be = e.likeFailed) == null || Be.call(e, x.song);
        } catch {
        }
      }
      o = await kn(s);
    } catch (ke) {
      I = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (Y = e.likeFailed) == null || Y.call(e, x.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), sr();
    }
  }
  return { snapshot: Tr, refresh: $n, onListened: Ci, heart: zo, toggleLike: Ps, ...or };
}
const Kb = ["Connect", "Passkey", "Link & fund", "Listen"], Vb = ["Passkey", "Add 1 STX", "Listen"], vf = (e) => e ? Vb : Kb;
function dI(e) {
  if (e.solo) return fI(e);
  const t = Kb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function fI(e) {
  const t = Vb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function hI(e, t) {
  return !t || t.at >= vf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const pI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function gI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !pI(r.id)));
}
const yI = {}, wI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, mI = (e) => {
  const t = yI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, bI = (e) => `/hiro/${e}`, xI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, SI = (e) => {
  const t = mI(e);
  if (t)
    return [xI(t)];
  const n = wI[e];
  return typeof window < "u" ? [`${window.location.origin}${bI(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, vI = {}, Og = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, AI = "xtrata.log.enabled", EI = "xtrata.log.level", kI = "xtrata.log.tags", $I = "xtrata.log.dedupe", Wc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, II = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, LI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, CI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, TI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, BI = () => {
  const e = vI ?? {}, t = Wc(AI) ?? e.VITE_LOG_ENABLED, n = Wc(EI) ?? e.VITE_LOG_LEVEL, r = Wc(kI) ?? e.VITE_LOG_TAGS, s = Wc($I) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: II(t),
    level: LI(n) ?? "warn",
    tags: TI(r),
    dedupe: CI(s)
  };
}, MI = (e, t, n) => !e.enabled || Og[n] < Og[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), NI = (e, t, n, r) => {
  const s = BI();
  if (!MI(s, t, e) || PI(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, _I = /* @__PURE__ */ new Set();
let Hg = null;
const PI = (e, t, n, r, s) => (Hg !== e && (_I.clear(), Hg = e), !1), UI = (e, t, n) => NI("debug", e, t, n), OI = {}, HI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, DI = (e) => {
  const t = OI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : HI[e];
}, FI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, jI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return FI.test(n) ? n : null;
}, RI = (e) => e.replace(/\/+$/, ""), zI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), Dg = (e) => {
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
}, Fi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, GI = (e) => {
  var c, u;
  let t;
  try {
    t = zr(F6(e));
  } catch {
    return null;
  }
  const n = Fi(t);
  if (!n || n.success === !1)
    return null;
  const r = Fi(n.value), s = Fi(r == null ? void 0 : r.value), o = Fi(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Dg((c = Fi(o.name)) == null ? void 0 : c.value), a = Dg((u = Fi(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : jI(`${i}.${a}`);
}, KI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${RI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [kb(cb(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : GI(o.result);
}, VI = async (e) => {
  const t = e.address.trim();
  if (!Qi(t))
    return null;
  const n = DI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of SI(e.network))
    try {
      return await KI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return UI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: zI(r)
  }), null;
};
function XI(e, t, n = {}) {
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
const Fg = Object.freeze({
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
}), jg = Object.freeze({ 139: "melophonic" });
function Rg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Fg, n) ? Fg[n] : Object.hasOwn(jg, n) ? jg[n] : t;
}
const zg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Gg(e, t = "") {
  return Object.hasOwn(zg, String(e)) ? zg[String(e)] : t;
}
const Xb = 10000n, Hh = 1000000n, jl = 3000n, YI = (e, t) => `${e}#gift=${t}`, qI = 100, Pa = (e, t = qr) => e <= cn ? 0 : Number((e - cn) / Dn(t)), Kg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Dh = "xtrata.xyz/radio/gifts", ja = qI, WI = "Create a prefunded Xtrata radio gift batch", ZI = (e) => ({
  domain: mr({ name: At(Dh), version: At("1"), "chain-id": Sn(1) }),
  message: mr({
    purpose: At(WI),
    creator: At(e.creator),
    count: Sn(e.count),
    amount: Sn(BigInt(e.amount)),
    label: At(e.label),
    issued: Sn(e.issued),
    ...e.player ? { player: At(e.player) } : {}
  })
}), Yb = (e, t, n = qr) => cn + BigInt(e) * Dn(n) + (t ? Su : 0n), JI = (e, t = qr) => Number((Hh - cn - (e ? Su : 0n)) / Dn(t)), qb = (e, t) => BigInt(e) * (t + jl);
function QI(e, t, n, r = qr) {
  const s = n ? Su : 0n, o = t > cn + s ? t - cn - s : 0n, i = Number(o / Dn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Ol,
    fees: BigInt(i) * r,
    reserve: cn,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jl,
    perCopy: t + jl,
    total: qb(e, t)
  };
}
const eL = (e) => e >= Xb && e <= Hh, tL = 90, Vg = [30, 90], nL = "Extend my prefunded Xtrata radio gift batches; no spending permission", rL = (e) => ({
  domain: mr({ name: At(Dh), version: At("1"), "chain-id": Sn(1) }),
  message: mr({ purpose: At(nL), creator: At(e.creator), batch: At(e.batch), days: Sn(e.days), issued: Sn(e.issued) })
}), Xg = 40, oL = "Create an Xtrata radio gift player", Af = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), sL = /^[^\u0000-\u001f\u007f<>]+$/u;
function Yg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && sL.test(e) : !n;
}
function Wb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Yg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Yg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Xg) throw new Error(`A player holds 1 to ${Xg} songs.`);
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
const Zb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return jf(Gf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, iL = (e) => ({
  domain: mr({ name: At(Dh), version: At("1"), "chain-id": Sn(1) }),
  message: mr({
    purpose: At(oL),
    admin: At(e.admin),
    player: At(e.hash),
    issued: Sn(e.issued)
  })
}), Vr = (e) => e.tracks.filter((t) => !t.hidden), aL = (e) => e.tracks.find((t) => t.hidden) ?? null, id = [300, 500, 1e3], qa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Zc = (e) => typeof e == "string" && qa.some((t) => t.id === e), Xs = (e) => qa.find((t) => t.id === e), cL = (e) => qa.find((t) => e >= t.min) ?? qa[qa.length - 1];
function lL(e, t = qr) {
  return cL(e <= cn ? 0 : Number((e - cn) / Dn(t)));
}
const Jb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], uL = "1000 Players";
function Fh(e = ja) {
  const t = [];
  for (const n of Jb) {
    const r = Yb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${uL} ${String(i).padStart(2, "0")}`, amount: r, deposit: qb(o, r) });
    }
  }
  return t;
}
const jh = (e = Fh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Jb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), dL = 23 * 36e5, qg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function fL(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < dL ? "unpaid" : "todo";
}
function hL(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: fL(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => qg(u.state) - qg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function Wg(e, t, n = Fh()) {
  var u;
  const r = n.map((h) => hL(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = jh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function pL(e, t = Fh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = jh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${Xs(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const Zg = 1800, ad = /* @__PURE__ */ new Map();
async function gL(e) {
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
function yL(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = ad.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      ad.set(e, { ...a, until: Date.now() + Zg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ad.delete(e), s();
      }, Zg + 50);
    }
  }, o;
}
const hr = (e, t, n, r, s) => yL(e, t, async () => await gL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s);
function Rh() {
  var t;
  const e = window.XtrataRadioConnectStacks;
  e ? e() : (t = document.getElementById("radio-wallet-connect")) == null || t.click();
}
const Hs = "xtrata.radio.gift.incoming.v1", Jg = (e) => "xtrata.radio.gift.mine.v1:" + e, Qg = (e) => "xtrata.radio.gift.batches.v1:" + e, fe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Qt = (e, t, n = "") => {
  const r = fe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Ua = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, er = (e) => Fr(e).replace(/\.?0+$/, "");
function wL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Kg(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(Hs) || "null");
      return Kg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(Hs, JSON.stringify({ code: o, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const D = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(Hs, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(Hs, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Pa(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Pa(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [hr("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Hs, null), e.changed();
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
    var D, J, oe, Le, Ae, ze, Ct, qe, dt;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((D = t.view) != null && D.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const V = async (xt) => {
      const gt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...xt })
      });
      return { res: gt, r: await gt.json().catch(() => ({})) };
    };
    try {
      let xt = 0, gt = E.listening, Nt;
      if (H) {
        const Ke = Number((oe = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : oe.next);
        if (!Number.isSafeInteger(Ke) || Ke < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        xt = Ke;
        for (let Tr = 0; ; Tr++) {
          const Br = await e.album.bind(xt);
          if (gt = Br.address, Nt = await V({ wallet: gt, binding: Br }), Nt.res.status === 409 && /just taken/.test(((Le = Nt.r) == null ? void 0 : Le.error) || "") && Tr < 5) {
            xt += 1;
            continue;
          }
          break;
        }
      } else Nt = await V({ wallet: gt });
      const { res: C, r: $e } = Nt;
      if (C.status === 503 && /sending another gift/.test(($e == null ? void 0 : $e.error) || "")) {
        t.waiting = !0, (Ae = e.claiming) == null || Ae.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!C.ok) {
        const Ke = String(($e == null ? void 0 : $e.error) || "");
        if (C.status === 404 || C.status === 410 || C.status === 409 && /already had a gift|brand-new|already have this album/.test(Ke))
          throw e.store.set(Hs, null), new Error(Ke || "This gift cannot be opened.");
        if (C.status === 429 || C.status === 403 || C.status === 400 && !/wallet number/i.test(Ke)) throw new Error(Ke || `Could not open the gift (${C.status}).`);
        const Br = /topping up/.test(Ke) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Ke) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Ke) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Br), { retry: !0, slow: /topping up|not paid for yet/.test(Ke) });
      }
      t.done = !0, e.store.set(Hs, null), H ? await e.album.arrived(xt, gt, $e.txid, BigInt($e.amount)) : e.giftSent($e.txid, BigInt($e.amount));
    } catch (xt) {
      const gt = xt, Nt = gt.name === "TypeError" || gt.name === "AbortError" || gt.name === "TimeoutError" || /wallet number/i.test(gt.message);
      if (gt.retry || Nt) {
        const C = t.tries ?? 0;
        t.tries = C + 1, t.retry = { text: gt.retry ? gt.message : "Still sending your gift… the network is slow, trying again." }, (ze = e.claiming) == null || ze.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, gt.slow ? 6e4 : n(C));
      } else
        t.error = gt.message, (Ct = e.claiming) == null || Ct.call(e, !1);
      w.token = void 0;
      try {
        (dt = (qe = window.turnstile) == null ? void 0 : qe.reset) == null || dt.call(qe, w.box);
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
        var J, oe;
        (U == null ? void 0 : U.wallet) === V && (U.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, U.problem = ((oe = D == null ? void 0 : D.gift) == null ? void 0 : oe.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const H = fe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${U.problem}`, [H];
  }
  function A(E, H, V = !1) {
    var ze, Ct;
    const D = H.player, J = BigInt(H.amount), oe = V ? [] : [fe("p", `🎁 ${d(H)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Vr(D).length} ${Vr(D).length === 1 ? "song" : "songs"} and ${Pa(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (V) return oe;
      if (oe.push(fe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const qe = document.createElement("details");
        qe.className = "ppp-how";
        const dt = document.createElement("summary");
        dt.textContent = "How does this work?", qe.append(dt, fe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), oe.push(qe);
      }
      return oe;
    }
    if (E.walletCannotAlbums)
      return oe.push(fe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), oe;
    const Ae = (Ct = (ze = E.gate) == null ? void 0 : ze.gifts) == null ? void 0 : Ct.turnstileSiteKey;
    return Ae && !w.token ? oe.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(Ae)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), oe.push(...T(E, "Sending your album…")), oe;
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
    var gt, Nt, C, $e;
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
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), oe = J ? ((gt = e.claimNew) == null ? void 0 : gt.call(e, E)) ?? null : null, Le = oe ? ((Nt = e.replaceOld) == null ? void 0 : Nt.call(e, E)) ?? null : null;
    if (oe && Le)
      return [
        fe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Qt("Replace my old player", Le, "primary"),
        Qt("Keep both players", oe, "quiet"),
        Qt("Not now", h, "quiet")
      ];
    if (oe)
      return [
        fe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Qt("Claim it as a new player", oe, "primary"),
        Qt("Not now", h, "quiet")
      ];
    if (J)
      return [fe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")];
    const Ae = BigInt(D.amount), ze = Pa(Ae).toLocaleString(), Ct = fe(
      "p",
      `🎁 ${d(D)} sent you ${er(Ae)} STX of on-chain music: about ${ze} paid plays.`,
      "ppp-gift"
    ), qe = H.bare ? [] : [Ct], dt = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, xt = ($e = (C = E.gate) == null ? void 0 : C.gifts) == null ? void 0 : $e.turnstileSiteKey;
    return dt ? (xt && !w.token ? qe.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(xt)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), qe.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || qe.push(fe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? qe.push(fe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && qe.push(fe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")), qe;
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
  const re = fe("div", "", "ppp-gift-fold");
  let q = 250000n, m = "", L = "";
  const _ = (E) => {
    try {
      const H = JSON.parse(e.store.get(Jg(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, N = (E, H) => e.store.set(Jg(E), JSON.stringify(H.slice(0, 50)));
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
  async function F(E) {
    if (m) return;
    m = "Starting your gift…", L = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: q.toString() }) });
      const V = _(E);
      V.unshift({ id: H.id, code: H.code, amount: q.toString(), at: e.now() }), N(E, V), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), J = _(E), oe = J.find((Le) => Le.id === H.id);
      oe && (oe.txid = D, oe.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: E, label: "", expires: 0 }), N(E, J), L = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
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
  async function Ve(E, H) {
    var V;
    if (!m) {
      m = "Checking the player…", L = "", e.changed();
      try {
        const D = H.tracks.split(/[\s,]+/).filter(Boolean).map((qe) => Number(qe.replace(/^#/, ""))), J = (H.explicit ?? "").split(/[\s,]+/).map((qe) => qe.replace(/^#/, "")).filter(Boolean).map(Number), oe = Wb({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: D, cover: (V = H.cover) != null && V.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        m = "Sign in your wallet…", e.changed();
        const Le = { admin: E, hash: Zb(oe), issued: e.now() }, Ae = await e.sign(E, iL(Le));
        m = "Making the player…", e.changed();
        const ze = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: oe, request: Le, signature: Ae }) }), Ct = ce(E).filter((qe) => qe.id !== ze.id);
        Ct.unshift({ id: ze.id, title: ze.title, tracks: ze.tracks }), e.store.set(ye(E), JSON.stringify(Ct.slice(0, 30))), L = `${ze.existing ? "That player already exists" : "Player made"} ✓ “${ze.title}” · ${ze.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        L = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (E, H) => YI(E || location.origin + "/radio.html", H), R = (E) => {
    try {
      const H = JSON.parse(e.store.get(Qg(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, ue = (E, H) => e.store.set(Qg(E), JSON.stringify([...H.filter((V) => V.codes.length), ...H.filter((V) => !V.codes.length)].slice(0, 80))), me = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Ne = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let ve = 0;
  async function wt(E) {
    const H = R(E);
    for (const D of H)
      if (!me(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ne("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const oe = H.find((Le) => Le.id === J.id);
        if (oe) {
          oe.error || (oe.view = J);
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
  async function Re(E, H) {
    const V = R(E).find((D) => D.id === H);
    if (!(!V || !V.depositTo || m)) {
      m = "Approve the payment in your wallet…", L = "", e.changed();
      try {
        const D = await e.pay(E, V.depositTo, BigInt(V.deposit), V.memo), J = R(E), oe = J.find((Le) => Le.id === H);
        oe && (oe.txid = D), ue(E, J), L = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", wt(E);
      } catch (D) {
        L = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Me(E, H, V, D) {
    if (m) return;
    if (!H.ok) {
      L = H.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", L = "", e.changed();
    let J = null;
    try {
      const oe = { creator: E, count: H.count, amount: H.amount.toString(), label: V, issued: e.now(), ...D ? { player: D } : {} }, Le = await e.sign(E, ZI(oe));
      m = "Making your links…", e.changed(), J = await Ne("/radio/gift/batch", { request: oe, signature: Le });
      const Ae = R(E);
      Ae.unshift({ id: J.id, codes: J.codes, count: H.count, amount: J.amount, label: V, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), ue(E, Ae);
    } catch (oe) {
      L = oe.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await Re(E, J.id);
  }
  async function _e(E, H, V) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", L = "", e.changed();
      try {
        const D = { creator: E, batch: H, days: V, issued: e.now() }, J = await e.sign(E, rL(D));
        m = "Extending…", e.changed();
        const oe = await Ne("/radio/gift/batch/extend", { request: D, signature: J }), Le = R(E);
        for (const Ae of (oe == null ? void 0 : oe.batches) ?? []) {
          const ze = Le.find((Ct) => Ct.id === Ae.id);
          ze && (ze.view = Ae, ze.error = void 0);
        }
        ue(E, Le), L = oe != null && oe.extended ? `Extended ✓ ${oe.extended === 1 ? "That batch has" : `${oe.extended} batches have`} ${V} more days.` : "There was nothing live to extend.";
      } catch (D) {
        L = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const Mn = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function vn(E, H) {
    const V = H.filter((oe) => {
      var Le;
      return ((Le = oe.view) == null ? void 0 : Le.status) === "live" && oe.view.copies.waiting > 0;
    });
    if (!V.length) return null;
    const D = Math.min(...V.map((oe) => oe.view.expires)), J = fe("p", "", "ppp-batch-extend");
    J.append(fe("span", `${V.length} live ${V.length === 1 ? "batch" : "batches"} · the first runs out in ${Mn(D)} days. Extend ${V.length === 1 ? "it" : "them all"}: `));
    for (const oe of Vg) {
      const Le = Qt(`+${oe} days`, () => void _e(E, "all", oe), "tiny");
      Le.disabled = !!m, J.append(Le);
    }
    return J;
  }
  const pt = () => Lt(!!Ye.value, We.value, Rt.value);
  function Lt(E, H, V) {
    const D = H === "max" ? JI(E) : Number(H), J = Yb(D, E), oe = Number(V);
    return !Number.isInteger(oe) || oe < 1 || oe > ja ? { ok: !1, reason: `Make 1 to ${ja} copies at a time.`, album: E, plays: D, amount: J, count: oe } : eL(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: oe, bill: QI(oe, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: oe };
  }
  const Ot = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? tL;
  }, z = (E = pt()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${er(H.holders)} to song holders, ${er(H.fees)} network fees)${E.album ? `, ${er(H.float)} for the album’s likes` : ""}, ${er(H.reserve)} kept so a listener can return what is left, + ${er(H.sendFee)} to send it = ${er(H.perCopy)} STX. ${E.count} copies = ${er(H.total)} STX, paid now in one payment. Copies nobody claims within ${Ot()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((V) => $(E, V)), ee = fe("input");
  ee.type = "range", ee.min = String(Xb), ee.max = String(Hh), ee.step = "10000", ee.value = String(q), ee.setAttribute("aria-label", "Gift amount");
  const ne = fe("p", "", "ppp-gift-amount"), le = Qt("", () => {
    const E = e.main();
    E && F(E);
  }, "primary"), bt = () => {
    ne.textContent = He(), le.textContent = `Gift ${er(q)} STX`;
  };
  ee.oninput = () => {
    q = BigInt(ee.value), bt();
  };
  const He = () => `${er(q)} STX · about ${Pa(q).toLocaleString()} paid plays · you pay ${er(q + jl)} STX with the network fee`;
  bt();
  const De = fe("input");
  De.maxLength = 60, De.placeholder = "Title, e.g. Proof of Sound", De.setAttribute("aria-label", "Player title");
  const Bt = fe("input");
  Bt.maxLength = 80, Bt.placeholder = "Artist (optional)", Bt.setAttribute("aria-label", "Player subtitle");
  const Fe = fe("textarea");
  Fe.rows = 3, Fe.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Fe.setAttribute("aria-label", "Songs");
  const Ee = fe("input");
  Ee.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ee.setAttribute("aria-label", "Explicit songs");
  const Qe = fe("input");
  Qe.inputMode = "numeric", Qe.placeholder = "Cover inscription number (optional), shown when the album loads", Qe.setAttribute("aria-label", "Cover inscription");
  const Ye = fe("select");
  Ye.setAttribute("aria-label", "Batch album");
  const We = fe("select");
  We.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...id])].sort((H, V) => H - V)) We.append(Ua(`${E.toLocaleString()} plays`, String(E)));
  We.append(Ua("Max (1 STX)", "max")), We.value = String(id[0]);
  const Rt = fe("input");
  Rt.type = "number", Rt.min = "1", Rt.max = String(ja), Rt.value = "10", Rt.setAttribute("aria-label", "Copies");
  const dn = fe("input");
  dn.maxLength = 40, dn.placeholder = "Label, e.g. Opera launch", dn.setAttribute("aria-label", "Batch label");
  const Yn = fe("p", "", "ppp-mute"), pn = () => {
    Yn.textContent = z();
  };
  for (const E of [Ye, We, Rt])
    E.oninput = pn, E.onchange = pn;
  pn();
  let Mt = null, qn = 0;
  async function jn() {
    qn = e.now();
    try {
      Mt = pL(await e.json("/radio/giveaway/players"));
    } catch {
      Mt = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Wr = (E, H) => {
    var D;
    if (((D = Wg(R(E), e.now()).next) == null ? void 0 : D.n) !== H.n) {
      L = "That batch is already made. Check again.", e.changed();
      return;
    }
    Me(E, Lt(!1, String(H.plays), String(H.count)), H.label);
  };
  function Cr(E) {
    var Le;
    const H = Wg(R(E), e.now()), V = jh(), D = fe("div", "", "ppp-drop");
    D.append(
      fe("p", `The ${V.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${V.batches} batches live`, "ppp-cyan"),
      fe("p", `${V.tiers.map((Ae) => `${Ae.count} ${Xs(Ae.id).name}`).join(", ")}. ${V.batches} batches, ${er(V.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = fe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Ae of H.steps) {
      const ze = fe("li"), Ct = Ae.state === "live" ? "✓" : Ae.state === "touched" ? "!" : Ae.state === "todo" ? "○" : "…";
      if (ze.append(fe("span", `${Ct} ${Ae.step.n}. ${Xs(Ae.step.tier).name} · ${Ae.step.count} × ${Ae.step.plays.toLocaleString("en-GB")} plays · ${er(Ae.step.deposit)} STX`, "t"), fe("span", Ae.detail, Ae.state === "live" ? "ppp-ok" : Ae.state === "touched" ? "ppp-warn" : "ppp-mute")), Ae.state === "todo" && ((Le = H.next) == null ? void 0 : Le.n) === Ae.step.n) {
        const qe = Qt("Sign and pay", () => Wr(E, Ae.step), "tiny");
        qe.disabled = !!m, ze.append(qe);
      }
      if (Ae.state === "unpaid" && Ae.batch) {
        const qe = Qt("Pay now", () => void Re(E, Ae.batch.id), "tiny");
        qe.disabled = !!m, ze.append(qe);
      }
      J.append(ze);
    }
    D.append(J);
    for (const Ae of H.problems) D.append(fe("p", Ae, "ppp-warn"));
    H.ready ? D.append(
      fe("p", `All ${V.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      hr("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : D.append(fe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - qn > 6e4 && jn(), Mt && D.append(fe("p", Mt.text, Mt.ok ? "ppp-ok" : "ppp-mute"));
    const oe = Qt("Check again", () => {
      ve = e.now(), wt(E), jn();
    }, "tiny");
    return oe.disabled = !!m, D.append(oe), D;
  }
  function An(E, H, V) {
    const D = H.view, J = D == null ? void 0 : D.copies, oe = H.error ? H.error : !D || D.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Le = fe("li");
    if (Le.append(fe("span", `${H.label || "Batch"} · ${H.count} × ${er(BigInt(H.amount))} STX`, "t"), fe("span", oe, "ppp-mute")), !H.txid && H.depositTo && (!D || D.status === "pending-deposit") && Le.append(Qt("Pay now", () => void Re(E, H.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Le.append(fe("span", `${Mn(D.expires)} days left`, "ppp-mute"));
      for (const Ae of Vg) {
        const ze = Qt(`+${Ae}`, () => void _e(E, H.id, Ae), "tiny");
        ze.title = `Extend this batch by ${Ae} days (a signature, no payment)`, ze.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${Ae} days`), ze.disabled = !!m, Le.append(ze);
      }
    }
    if (H.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Ae = O(V, H);
      Le.append(
        hr("batch-copy:" + H.id, "Copy all links", () => Ae.join(`
`), "tiny", e.changed),
        hr("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...Ae.map((ze, Ct) => `${Ct + 1},${ze}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Le.append(fe("span", "links were made on another device", "ppp-mute"));
    return Le;
  }
  const En = fe("select");
  En.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...id])].sort((H, V) => H - V)) En.append(Ua(`${E.toLocaleString()} plays`, String(E)));
  En.value = "50";
  const jt = fe("input");
  jt.type = "number", jt.min = "1", jt.max = String(ja), jt.value = "10", jt.setAttribute("aria-label", "How many copies");
  const gn = fe("input");
  gn.maxLength = 40, gn.placeholder = "A note recipients see, e.g. Launch week (optional)", gn.setAttribute("aria-label", "Note for recipients");
  const je = fe("p", "", "ppp-mute");
  function on(E, H, V) {
    const D = () => Lt(!0, En.value, jt.value), J = () => {
      je.textContent = z(D());
    };
    for (const dt of [En, jt])
      dt.oninput = J, dt.onchange = J;
    J();
    const oe = () => (gn.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Le = Qt("Sign, pay and make links", () => {
      Me(E, D(), oe(), H.id);
    }, "primary");
    Le.disabled = !!m;
    const Ae = (dt, xt) => {
      const gt = fe("label", dt);
      return gt.append(xt), gt;
    }, ze = [
      fe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Ae("Plays in each ", En),
      Ae("Copies ", jt),
      gn,
      je,
      Le
    ];
    e.now() - ve > 3e4 && (ve = e.now(), wt(E));
    const Ct = R(E).filter((dt) => dt.player === H.id);
    if (Ct.length) {
      const dt = fe("ul", "", "ppp-gift-list");
      for (const xt of Ct.slice(0, 10)) dt.append(An(E, xt, V));
      ze.push(dt);
    }
    const qe = vn(E, R(E));
    return qe && ze.push(qe), m && ze.push(fe("p", m, "ppp-cyan")), L && ze.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), ze;
  }
  function yo(E) {
    var J, oe;
    const H = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const V = e.main(), D = [fe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      D.push(fe("p", "Connect a Stacks wallet (Xverse or Leather) to make albums."), Qt("Connect Stacks wallet", Rh, "primary"));
    else if (H.admin) {
      const Le = fe("div", "", "ppp-gift-admin"), Ae = (xt, gt) => {
        const Nt = fe("label", xt);
        return Nt.append(gt), Nt;
      }, ze = ce(V);
      Le.append(
        fe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        De,
        Bt,
        Fe,
        Qe,
        Ee,
        Qt("Sign and make player", () => void Ve(V, { title: De.value, subtitle: Bt.value, tracks: Fe.value, cover: Qe.value, explicit: Ee.value }))
      );
      const Ct = Qt("Sign, pay and make links", () => {
        Me(V, pt(), dn.value.trim(), Ye.value || void 0);
      });
      Ct.disabled = !!m;
      const qe = Ye.value;
      Ye.replaceChildren(Ua("No album (starter copies)", ""), ...ze.map((xt) => Ua(`${xt.title} · ${xt.tracks} songs`, xt.id))), ze.some((xt) => xt.id === qe) && (Ye.value = qe), pn(), Le.append(
        fe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Ot()} days unless you extend`, "ppp-cyan"),
        Ae("Album ", Ye),
        Ae("Plays each ", We),
        Ae("Copies ", Rt),
        dn,
        Yn,
        Ct
      ), e.now() - ve > 3e4 && (ve = e.now(), wt(V));
      const dt = R(V);
      if (dt.length) {
        const xt = fe("ul", "", "ppp-gift-list");
        for (const Nt of dt.slice(0, 20)) xt.append(An(V, Nt, ((oe = E.gate) == null ? void 0 : oe.radioUrl) ?? null));
        Le.append(xt);
        const gt = vn(V, dt);
        gt && Le.append(gt);
      }
      Le.append(Cr(V)), D.push(Le);
    }
    return m && D.push(fe("p", m, "ppp-cyan")), L && D.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), re.replaceChildren(...D), re;
  }
  return { banner: X, funder: Q, renderFold: yo, copies: on, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const mL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function bL(e) {
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
const xL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function SL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = xL(o);
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
function vL(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Ef = /* @__PURE__ */ new Set(), Rl = (e) => (Ef.add(e), () => {
  Ef.delete(e);
}), zl = () => {
  for (const e of [...Ef])
    try {
      e();
    } catch {
    }
}, ey = "xtrata:al-thumb:v1:", zh = "-", Oa = 96, AL = 24 * 1024 * 1024, xn = /* @__PURE__ */ new Map(), ty = /* @__PURE__ */ new Set(), kf = [];
let cd = !1, ld;
const ac = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(ey + e);
    window.localStorage.setItem(ey + e, t);
  } catch {
  }
  return null;
};
function Gh(e) {
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
          r.width = r.height = Oa, s.fillStyle = "#143a40", s.fillRect(0, 0, Oa, Oa), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Oa, Oa), t(r.toDataURL("image/jpeg", 0.82));
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
async function EL(e) {
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
    if (s > AL)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function kL() {
  if (!cd) {
    cd = !0;
    try {
      for (; kf.length; ) {
        const e = kf.shift();
        if (!xn.has(e))
          try {
            const t = await EL(e);
            if (t === null) continue;
            if (!t) {
              xn.set(e, ""), ac(e, zh), zl();
              continue;
            }
            const n = await Gh(t);
            xn.set(e, n), n.startsWith("data:image/jpeg") && ac(e, n), zl();
          } catch {
          }
      }
    } finally {
      cd = !1;
    }
  }
}
function Gl(e, t) {
  if (t && !xn.get(e) ? (xn.set(e, t), Gh(t).then((r) => {
    r !== t && (xn.set(e, r), r.startsWith("data:image/jpeg") && ac(e, r), zl());
  })) : t === "" && !xn.has(e) && xn.set(e, ""), xn.has(e)) return xn.get(e);
  const n = ac(e);
  if (n != null) {
    const r = n === zh ? "" : n;
    return xn.set(e, r), r;
  }
  return ty.has(e) || (ty.add(e), kf.push(e), ld || (ld = setTimeout(() => {
    ld = void 0, kL();
  }, 1200))), "";
}
function ny(e) {
  if (xn.has(e)) return xn.get(e);
  const t = ac(e);
  if (t == null) return null;
  const n = t === zh ? "" : t;
  return xn.set(e, n), n;
}
const ud = /* @__PURE__ */ new Map(), dd = /* @__PURE__ */ new Set();
function dl(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : ud.has(e) ? ud.get(e) : (dd.has(e) || (dd.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    ud.set(e, t), zl();
  }).catch(() => {
    dd.delete(e);
  })), "");
}
const ji = 12, $L = 5e3, On = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ri = (e, t, n = "") => {
  const r = On("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function IL(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = ji;
  const d = On("div", "", "ppp-shelf-box");
  Rl(() => e.changed());
  const w = (_) => "xtrata.radio.shelf.pins.v1:" + _, y = (_) => "xtrata.radio.shelf.recent.v1:" + _, v = (_, N) => {
    try {
      return JSON.parse(e.store.get(_) || "null") ?? N;
    } catch {
      return N;
    }
  }, S = (_) => new Set(v(w(_), []).filter((N) => Number.isSafeInteger(N))), I = (_) => {
    const N = v(y(_), {}), W = {};
    for (const [F, ye] of Object.entries(N)) Number.isSafeInteger(Number(F)) && typeof ye == "number" && (W[Number(F)] = ye);
    return W;
  };
  async function U(_) {
    if (!s) {
      s = !0, o = !1;
      try {
        const N = [];
        let W = 0, F = 0;
        for (let ye = 0; ye < $L / 100 + 1; ye++) {
          const ce = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${W}&limit=100`);
          if (N.push(...bL(ce == null ? void 0 : ce.shelf)), F = Number(ce == null ? void 0 : ce.total) || N.length, !(ce != null && ce.next) || !Number.isSafeInteger(ce.next)) break;
          W = ce.next;
        }
        _ === t && (n = N, r = F, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const P = () => {
    i = -1 / 0;
  }, A = On("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = ji, e.changed();
  };
  const T = On("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const _ of mL) {
    const N = document.createElement("option");
    N.value = _.value, N.textContent = _.label, T.append(N);
  }
  T.onchange = () => {
    c = T.value, h = ji, e.changed();
  };
  const B = Ri("", () => {
    u = !u, h = ji, e.changed();
  }, "tiny"), X = On("div", "", "ppp-shelf-tools");
  X.append(A, T, B);
  const Q = On("div"), re = On("div");
  function q(_) {
    const N = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (N !== t && (t = N, n = [], r = 0, i = -1 / 0, h = ji), !N || _.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && U(N), !n.length)
      return o ? (re.replaceChildren(On("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ri("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(re), d) : null;
    const W = S(N), F = I(N), ye = SL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: F });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const ce = [];
    if (_.slot > 0 && ce.push(Ri("← My player", () => e.open(0), "quiet")), !ye.length) ce.push(On("p", "No album matches that.", "ppp-mute"));
    else {
      const Ve = On("ul", "", "ppp-shelf-list");
      for (const $ of ye.slice(0, h)) {
        const R = On("li", "", $.slot === _.slot ? "now" : ""), ue = W.has($.slot), me = Ri(ue ? "★" : "☆", () => {
          const pt = new Set(W);
          ue ? pt.delete($.slot) : pt.add($.slot), e.store.set(w(N), JSON.stringify([...pt])), e.changed();
        }, "tiny");
        me.setAttribute("aria-label", ue ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Ne = [$.player.subtitle, `${Vr($.player).length} ${Vr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), ve = $.slot === _.slot, wt = Ri(ve ? "Playing" : "Select", () => {
          e.store.set(y(N), JSON.stringify(vL({ ...F, [$.slot]: e.now() }))), e.open($.slot);
        }, ve ? "tiny ppp-pick" : "tiny primary ppp-pick");
        wt.disabled = ve, wt.setAttribute("aria-label", ve ? `${$.player.title}, playing now` : `Open ${$.player.title}`);
        const Re = Vr($.player)[0], Me = $.player.cover ?? (Re == null ? void 0 : Re.id), _e = Me ? Gl(String(Me)) : "", Mn = On("span", "", "ppp-shelf-art");
        if (_e) {
          const pt = document.createElement("img");
          pt.src = _e, pt.alt = "", pt.decoding = "async", Mn.append(pt);
        } else Mn.textContent = "💿";
        const vn = On("span", "", "ppp-shelf-txt");
        vn.append(On("span", $.player.title, "t"), On("span", Ne, "ppp-mute")), R.append(me, Mn, vn, wt), Ve.append(R);
      }
      ce.push(Ve), ye.length > h && ce.push(Ri(`Show more (${ye.length - h} left)`, () => {
        h += ji, e.changed();
      }, "quiet"));
    }
    return o && ce.push(On("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ce), d.firstChild !== X && d.replaceChildren(X, Q), d;
  }
  return { render: q, invalidate: P, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const _ = I(t), N = [...n].filter((W) => W.player).sort((W, F) => (_[F.slot] ?? 0) - (_[W.slot] ?? 0) || F.slot - W.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const ry = "http://www.w3.org/2000/svg", LL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Kl(e = "", t = !1) {
  const n = document.createElementNS(ry, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of LL) {
    const o = document.createElementNS(ry, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const st = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fn = (e, t, n, r = !1) => {
  const s = st("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Qb = (e) => e.toLocaleString(), oy = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, CL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Vl(e, t) {
  const n = st("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = st("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(st("i", "", s < t ? "✓" : String(s + 1)), st("span", "", r)), n.append(o);
  }), n;
}
function TL() {
  const e = st("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(st("span", "tier-disc__mark", "?")), e;
}
const mn = {
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
}, BL = (e) => e ? `Disc ${e} is yours` : mn.gift.title, ML = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Qb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", NL = (e) => e ? `${Qb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function sy(e, t = !1) {
  const n = st("div", "al-now" + (t ? " al-now--big" : "")), r = st("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const s = st("div", "al-now__t");
  s.append(st("b", "", e.title || "Playing now"), st("span", "", e.artist));
  const o = st("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return o.setAttribute("aria-hidden", "true"), o.append(st("s"), st("s"), st("s")), n.append(r, s, o), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const _L = (e) => e ? `You got a ${e.name} player` : mn.landed.title;
function PL(e, t = !0) {
  const n = st("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(st("span", "tier-disc__mark", e.mark)), n;
}
function UL(e) {
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
      const o = st("header", "al-top"), i = st("a", "al-brand");
      i.href = "/radio", i.append(Kl("al-logo"), st("span", "", "Xtrata "), st("b", "", "Music")), o.append(i);
      const a = st("div", "al-body al-body--welcome"), c = st("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(st("p", "al-welcome-wait", mn.checking));
      else {
        const w = CL(u);
        w >= 0 && c.append(Vl(u === "new" ? oy.fresh : oy.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(PL(r.tier)) : u === "gift" || u === "arriving" ? c.append(TL()) : u === "new" && c.append(Kl("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(st("h1", "", u === "landed" ? _L(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? BL(r.spot) : v ? mn.installedNew.title : mn[u].title)), y && u === "arriving" ? c.append(sy(y, !0)) : c.append(st("p", "", u === "gift" ? ML(r.plays, r.from, r.mystery) : u === "landed" ? NL(r.plays) : v ? mn.installedNew.body : mn[u].body)), y && u !== "arriving" && c.append(sy(y)), r.status.length) {
          const S = st("div", "al-status");
          S.setAttribute("role", "status"), S.append(...r.status), c.append(S);
        }
        if (r.asking) c.append(st("p", "al-hint al-hint--ask", mn.asking));
        else if (u === "back" && r.claimNew) {
          const S = mn.backClaim;
          c.append(st("p", "al-hint", S.body)), r.canStart && r.replaceOld ? c.append(fn("al-primary", S.replace, r.replaceOld, r.busy), st("p", "al-hint", S.replaceHint), fn("al-link", S.both, r.claimNew, r.busy), fn("al-link", S.unlock, r.unlock, r.busy)) : r.canStart && c.append(fn("al-primary", S.primary, r.claimNew, r.busy), st("p", "al-hint", S.hint), fn("al-link", S.unlock, r.unlock, r.busy)), c.append(fn("al-link", mn.back.full, r.full));
        } else if (u === "gift") {
          const S = mn.gift;
          if (r.canStart) {
            const I = fn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? S.play : S.primary, r.start, r.busy);
            c.append(I, st("p", "al-hint", S.hint));
          }
          r.canStart ? c.append(fn("al-link", S.returning, r.returning, r.busy)) : c.append(fn("al-link", S.full, r.full));
        } else if (u === "new" && r.installed) {
          const S = mn.installedNew;
          r.canStart && c.append(fn("al-primary", S.primary, r.returning, r.busy), st("p", "al-hint", S.hint), fn("al-link", S.fresh, r.start, r.busy)), c.append(fn("al-link", mn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const S = mn[u];
          r.canStart && c.append(fn("al-primary", S.primary, u === "back" ? r.unlock : r.start, r.busy), st("p", "al-hint", S.hint)), r.canStart && c.append(fn("al-link", S.returning, r.returning, r.busy)), c.append(fn("al-link", S.full, r.full));
        } else if (u === "landed") {
          if (c.append(fn("al-primary", (h = r.now) != null && h.playing ? mn.landed.playing : mn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(st("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const S of r.albums) {
              const I = fn("al-album", "", S.run);
              if (S.cover) {
                const P = st("img", "al-album__art");
                P.src = S.cover, P.alt = "", I.classList.add("al-album--art"), I.append(P);
              }
              const U = st("span", "al-album__t");
              U.append(st("b", "", S.title), st("span", "", S.by)), I.append(U), c.append(I);
            }
          }
        } else u === "empty" && c.append(fn("al-primary", mn.empty.primary, r.restock), fn("al-link", mn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(o, a);
    }
  };
}
const OL = 20, HL = ["Album", "Passkey", "Listen"], Cn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, en = {
  grid: Cn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Cn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Cn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Cn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Cn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Cn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Cn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Cn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Cn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Cn('<path d="M6 9l6 6 6-6"/>', 18),
  right: Cn('<path d="M9 6l6 6-6 6"/>', 16),
  close: Cn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Cn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Cn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Cn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Cn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Cn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ie(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Un = (e, ...t) => ie("button", { type: "button", ...e }, ...t), Jc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ha = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, DL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, FL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function iy(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var _, N, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const L = (W = (N = (_ = t.radio()) == null ? void 0 : _.getState) == null ? void 0 : N.call(_)) == null ? void 0 : W.albumCover;
    return L != null && L.url && Number(L.tokenId) === m ? L.url : dl(m);
  }
  Rl(() => q());
  function u(m) {
    var _;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const L = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of FL[m]) {
        const ye = L == null ? void 0 : L.querySelector(F);
        ye && (ye.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = DL[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [d()] : []), (_ = L == null ? void 0 : L.scrollTo) == null || _.call(L, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => Un(
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
      w = _, (s == null ? void 0 : s.mode) === "open" && q();
    }), w = ((L = m.getState) == null ? void 0 : L.call(m)) ?? null);
  };
  r || setInterval(() => {
    var N, W;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (N = t.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : W.call(N), L = e.querySelector(".al-bar > i"), _ = e.querySelectorAll(".al-times span");
    !m || !L || (L.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", _.length === 2 && (_[0].textContent = Jc(m.current || 0), _[1].textContent = m.duration ? Jc(m.duration) : "–:––"));
  }, 500);
  let S = "", I = null;
  function U(m, L, _ = {}) {
    const N = _.song || c(m.cover), F = [N ? ie("img", { src: N, alt: _.song ? "Song artwork" : `${m.title} cover` }) : ie("div", { class: "al-cover-fallback" }, ie("b", {}, m.title), m.subtitle ? ie("span", {}, m.subtitle) : null), _.paused ? ie("span", { class: "al-paused" }, ie("i", { html: en.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ye = "al-cover" + (L ? "" : " al-cover--small") + (_.paused ? " is-paused" : "");
    return _.flip ? (F.push(ie("span", { class: "al-flip", "aria-hidden": "true", html: en.flip })), Un({ class: ye + " is-flippable", "aria-label": _.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: _.flip }, ...F)) : ie("div", { class: ye }, ...F);
  }
  function P(m) {
    return m.plays === null || m.plays === void 0 ? ie("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ie("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ie("span", { class: "al-chip" + (m.plays <= OL ? " al-chip--low" : "") }, `${Ha(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const L = m.player, _ = L.tracks.filter((W) => !W.hidden), N = [];
    return m.step !== void 0 && N.push(Vl(HL, m.step)), m.mode === "arrive" && m.from && N.push(ie("p", { class: "al-from" }, ie("span", { html: en.gift }), ie("span", {}, ie("b", {}, m.from), " sent you an album"))), N.push(U(L, !0)), N.push(ie(
      "div",
      { class: "al-intro" },
      ie("h1", {}, L.title),
      L.subtitle ? ie("p", { class: "al-artist" }, L.subtitle) : null,
      _.length ? ie("p", { class: "al-songline" }, _.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ie("span", { class: "al-chip" }, [Ha(_.length, "song", "songs"), m.offered ? Ha(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && N.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), N.push(ie("div", { class: "al-grow" })), m.asking ? N.push(ie("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && N.push(Un({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ie("span", { html: en.playSmall }), m.primary.label)), m.hint && !m.asking && N.push(ie("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && N.push(Un({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), N;
  }
  function T(m, L) {
    const { songs: _, current: N, started: W, own: F, out: ye, waiting: ce } = L, Ve = m.player, $ = t.radio(), R = [];
    R.push(ie("div", { class: "al-listhead" }, ie("span", {}, ie("b", {}, Ve.title), ` · ${Ha(_.length, "song", "songs")}`), P(m)));
    const ue = c(Ve.cover), me = "album:" + Ve.cover;
    ue && !xn.has(me) && (xn.set(me, ue), Gh(ue).then((ve) => {
      ve !== ue && (xn.set(me, ve), q());
    }));
    const Ne = ue ? xn.get(me) || ue : "";
    return R.push(ie("ol", { class: "al-tracks" }, ..._.map((ve, wt) => {
      const Re = String(ve.id) === N, Me = Gl(String(ve.id), Re && W ? F : void 0);
      return ie("li", {}, Un(
        { class: "al-track" + (Re ? " is-on" : ""), "aria-label": `Play ${ve.title || "#" + ve.id}`, "aria-current": Re ? "true" : void 0, disabled: ye || ce, onClick: () => {
          var _e;
          return (_e = $ == null ? void 0 : $.playToken) == null ? void 0 : _e.call($, ve.id);
        } },
        ie(
          "span",
          { class: "al-th" + (Me ? "" : " is-blank") },
          Me ? ie("img", { src: Me, alt: "", decoding: "async" }) : Ne ? ie("img", { src: Ne, alt: "", decoding: "async" }) : null,
          Me ? null : ie("span", { class: "al-n" }, String(wt + 1)),
          Re ? ie("span", { class: "al-eq", html: en.eq }) : null
        ),
        ie("span", { class: "al-tt" }, ve.title || `#${ve.id}`, ve.explicit ? ie("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), R;
  }
  function B(m) {
    var Me;
    const L = m.player, _ = L.tracks.filter((_e) => !_e.hidden), N = t.radio(), W = w == null ? void 0 : w.nowPlaying, F = W && L.tracks.some((_e) => String(_e.id) === String(W.tokenId)) ? String(W.tokenId) : null, ye = F ? L.tracks.find((_e) => String(_e.id) === F) : null, ce = m.plays === 0 && !m.playsComing, Ve = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!F, R = w == null ? void 0 : w.heart, ue = F ? (Me = N == null ? void 0 : N.getPosition) == null ? void 0 : Me.call(N) : null;
    F && ($ || ((ue == null ? void 0 : ue.current) ?? 0) > 0.5) && (S = L.id);
    const me = !!F && S === L.id;
    I && I !== F && (I = null);
    const Ne = me ? String((W == null ? void 0 : W.cover) || "") : "", ve = !!Ne && I === F, Re = [U(L, !ce, { song: ve ? "" : Ne, paused: me && !$, flip: Ne ? () => {
      I = I === F ? null : F, q();
    } : void 0, flipped: ve })];
    if (Re.push(ie(
      "div",
      { class: "al-now" },
      ie(
        "div",
        { class: "al-now-t" },
        ie("div", { class: "al-song" }, ye ? ye.title || (W == null ? void 0 : W.title) || `#${ye.id}` : L.title),
        ie("div", { class: "al-artist" }, ye ? ye.artist || (W == null ? void 0 : W.artist) || L.subtitle : L.subtitle || "Press play")
      ),
      F ? Un({ class: "al-icon" + (R != null && R.liked ? " is-on" : ""), "aria-label": R != null && R.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(R != null && R.liked)), disabled: !!(R != null && R.pending) || !!(R != null && R.locked) || Ve, onClick: () => {
        var _e;
        return (_e = N == null ? void 0 : N.toggleLike) == null ? void 0 : _e.call(N);
      }, html: R != null && R.liked ? en.heartOn : en.heart }) : null
    )), ce)
      Re.push(ie(
        "div",
        { class: "al-out" },
        ie("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ie("p", { class: "al-out-t" }, "You've played this album out"),
        ie("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const _e = ue != null && ue.duration ? Math.min(100, ue.current / ue.duration * 100) : 0;
      Re.push(ie(
        "div",
        { class: "al-prog" },
        ie("div", { class: "al-bar" }, ie("i", { style: `width: ${_e}%` })),
        ie("div", { class: "al-times" }, ie("span", {}, Jc((ue == null ? void 0 : ue.current) || 0)), ie("span", {}, ue != null && ue.duration ? Jc(ue.duration) : "–:––"))
      ));
    }
    return Re.push(ie(
      "div",
      { class: "al-ctl" + (ce || Ve ? " is-off" : "") },
      Un({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ce || Ve, onClick: () => {
        var _e;
        return (_e = N == null ? void 0 : N.prev) == null ? void 0 : _e.call(N);
      }, html: en.prev }),
      Un({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: ce || Ve, onClick: () => {
        var _e;
        return (_e = N == null ? void 0 : N.playPause) == null ? void 0 : _e.call(N);
      }, html: $ ? en.pause : en.play }),
      Un({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ce || Ve, onClick: () => {
        var _e;
        return (_e = N == null ? void 0 : N.next) == null ? void 0 : _e.call(N);
      }, html: en.next })
    )), m.status.length && Re.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), Re.push(...T(m, { songs: _, current: F, started: me, own: Ne, out: ce, waiting: Ve })), Re.push(ie("div", { class: "al-grow" })), Re.push(Un(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      ie("span", {}, "More ", ie("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ie("span", { html: en.down })
    )), Re;
  }
  function X(m, L) {
    const _ = ie("div", { class: "al-topups" + (L ? " al-topups--primary" : "") }), N = L ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of N) {
      const F = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      _.append(Un({ class: "al-topup", disabled: !F, onClick: () => t.topUp(W) }, L ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return L && _.append(Un({ class: "al-link", onClick: () => u("more") }, "Other amounts")), _;
  }
  function Q(m) {
    const L = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), _ = ie(
      "div",
      { class: "al-card" },
      ie("div", { class: "al-card-h" }, ie("b", {}, `Add plays to ${m.player.title}`), ie("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      ie("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : L ? `Moved from My player · ${Ha(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !L && !m.playsComing && m.myPlays !== void 0 ? Un({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), N = (F, ye, ce, Ve) => Un(
      { class: "al-row", onClick: Ve },
      ie("span", { class: "al-row-i", html: F }),
      ie("span", { class: "al-row-t" }, ie("b", {}, ye), ie("small", {}, ce)),
      ie("span", { class: "al-row-go", html: en.right })
    ), W = ie(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      N(en.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, q();
      }),
      i ? ie("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ie(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ie("div", { class: "al-sheet-h" }, ie("b", {}, "More"), Un({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: en.close })),
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
  function re(m) {
    var ce, Ve;
    const L = m.player, _ = w == null ? void 0 : w.nowPlaying, N = _ && L.tracks.some(($) => String($.id) === String(_.tokenId)) ? String(_.tokenId) : null, W = !!(w != null && w.playing) && !!N, F = N ? (Ve = (ce = t.radio()) == null ? void 0 : ce.getPosition) == null ? void 0 : Ve.call(ce) : null;
    N && (W || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (S = L.id);
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
  function q() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...re(m));
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
      ie("a", { class: "al-brand", href: "/radio" }, Kl("al-logo"), "Xtrata ", ie("b", {}, "Music")),
      m.mode === "open" ? Un({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: en.grid }) : null
    ), _ = ie("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? B(m) : A(m));
    e.replaceChildren(L, _, ...o === "more" ? [ie("div", { class: "al-scrim", onClick: () => u("") }), Q(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, q();
        return;
      }
      const L = !!s;
      s = m, !m && (L || o) && (o = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, q();
    },
    sheet: () => o,
    setSheet: u
  };
}
const jL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", RL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${jL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, zL = (e) => RL("source|audio", e), GL = 48 * 1024 * 1024;
function KL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function VL(e) {
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
    if (I.length > GL) throw new Error("too large");
    const U = I.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return KL(U[1].replace(/&amp;/g, "&"));
    const P = w === 0 ? zL(I) : null;
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
const XL = ["Earned", "Claim", "Yours"], YL = ["Connect", "Link", "Name"], Pt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, wn = (e, t, n, r = !1) => {
  const s = Pt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, ay = (e, t, n, r = !1) => {
  const s = wn("al-album", "", n, r), o = Pt("span", "al-album__t");
  return o.append(Pt("b", "", e), Pt("span", "", t)), s.append(o), s;
}, qL = (e) => `No. ${String(e).padStart(4, "0")}`, WL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function ZL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = Pt("div", "aw-art");
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
      const c = Pt("header", "al-top"), u = Pt("a", "al-brand");
      u.href = "/radio", u.append(Kl("al-logo"), Pt("span", "", "Xtrata "), Pt("b", "", "Music")), c.append(u);
      const h = Pt("div", "al-welcome"), d = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Vl(YL, WL(i)) : Vl(XL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const P = Pt("div", "tier-disc tier-disc--mid");
        P.dataset.tier = i.tier.id, P.append(Pt("span", "tier-disc__mark", i.tier.mark)), h.append(P);
      } else if (d !== "have" && d !== "get") {
        const P = o(i);
        P.classList.toggle("aw-art--small", d === "name"), h.append(P);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Pt("h1", "", v));
      const S = (P, A = "") => h.append(Pt("p", A, P)), I = [];
      if (d === "ready")
        S(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), I.push(wn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Pt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), wn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (S(`Your record will carry ${y} beside your player’s address.`), I.push(wn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), wn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (S("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), I.push(
          ay("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          ay("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          wn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (S("Could not check for a .btc name just now.", "ppp-warn"), I.push(wn("al-primary", "Check again", i.refresh, i.busy), wn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), I.push(Pt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), I.push(wn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (S(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), I.push(wn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (S(`Found it: ${y}. It goes on your plaque beside your player’s address.`), I.push(wn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (S(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), I.push(wn("al-primary", "Check again", i.refresh, i.busy))) : (S(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), I.push(wn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (S("Connect the Leather or Xverse wallet that holds your .btc name."), I.push(wn("al-primary", "Connect my wallet", i.connect, i.busy))), I.push(wn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const P = Pt("ol", "aw-steps"), A = Pt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Pt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Pt("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Pt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Pt("li", "", "Check again, and your name shows on the preview before you claim.");
        P.append(A, B, X), h.append(P), I.push(wn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), wn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (S("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const P = Pt("p", "al-hint"), A = Pt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", P.append(A), h.append(P);
        }
      } else if (S(`${w} record ${qL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), I.push(wn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const P = Pt("a", "al-link", "Open it full screen ↗");
        P.href = `/i/${i.inscription}`, P.target = "_blank", P.rel = "noopener", I.push(P);
      }
      if (i.status.length) {
        const P = Pt("div", "al-status");
        P.setAttribute("role", "status"), P.append(...i.status), h.append(P);
      }
      i.asking ? h.append(Pt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...I);
      const U = Pt("div", "al-body al-body--welcome");
      U.append(h), e.hidden = !1, e.replaceChildren(c, U);
    }
  };
}
const e1 = "xtrata.xyz/music/release", JL = "Release music on Xtrata Music; no spending permission", QL = (e) => ({
  domain: mr({ name: At(e1), version: At("1"), "chain-id": Sn(1) }),
  message: mr({ purpose: At(JL), artist: At(e.artist), release: At(e.hash), issued: Sn(e.issued) })
}), eC = "Set the price of my release on Xtrata Music; no spending permission", tC = 100000n, nC = 1000000000n, rC = (e) => e === 0n || e >= tC && e <= nC, oC = (e) => ({
  domain: mr({ name: At(e1), version: At("1"), "chain-id": Sn(1) }),
  message: mr({ purpose: At(eC), artist: At(e.artist), release: At(e.release), price: Sn(BigInt(e.price)), issued: Sn(e.issued) })
}), zi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, sC = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, yn = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Qc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), cy = (e) => {
  const t = Vr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function el(e, t, n = "", r = "") {
  const s = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(we("span", t)), s;
}
const fd = (e) => !!e && Af(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function iC(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return Af(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const w = (z, O, ee) => {
    const ne = Array.isArray(O) ? O.filter(fd).map((le) => ({ ...le, hidden: !!le.hidden })) : [];
    u = { for: z, albums: ne, fresh: ee }, ee && e.store.set(c(z), JSON.stringify(ne));
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
      const ne = await e.signShelf(z, O), le = await e.json("/radio/release/shelf", Qc(ne));
      return w(ee.address, le == null ? void 0 : le.albums, !0), U(le == null ? void 0 : le.pay) ? A(ee.address, le.pay) : z === "add" && A(ee.address, null, O), !0;
    } catch (ne) {
      return z !== "list" && (o = ne.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const I = (z) => "xtrata.radio.releases.orders.v1:" + z, U = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && Af(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", P = (z) => {
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
    const ne = P(z);
    O ? ne[O.release] = { ...((le = ne[O.release]) == null ? void 0 : le.order) === O.order ? ne[O.release] : {}, ...O } : delete ne[ee], e.store.set(I(z), Object.keys(ne).length ? JSON.stringify(ne) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function X(z, O, ee = !1) {
    var ne;
    if (!T.has(O.order)) {
      T.add(O.order), B.set(O.order, e.now()), ee && (o = "", e.changed());
      try {
        const le = await e.json("/radio/release/paid", Qc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (le == null ? void 0 : le.status) === "paid" ? (A(z, null, O.release), ((ne = a == null ? void 0 : a.view) == null ? void 0 : ne.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", T.delete(O.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await S("list")) : (U(le) && A(z, { ...O, ...le }), ee && (le == null ? void 0 : le.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
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
        const ne = await e.pay(z, ee.to, BigInt(ee.amount), ee.memo), le = { ...ee, txid: ne || void 0, status: "confirming" };
        A(O, le), s = "", X(O, le);
      } catch (ne) {
        o = /cancel/i.test(ne.message || "") ? "Payment cancelled. Nothing was sent." : ne.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function re(z) {
    const O = e.player();
    if (!await S("add", z.id) || !O.address) return;
    const ee = P(O.address)[z.id], ne = e.main();
    ee && ne && await Q(ne, O.address, ee);
  }
  function q() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (ee) => {
          fd(ee) ? (O.view = ee, delete O.error) : O.error = "This release could not be read.";
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
    return z.forEach((ne, le) => {
      const bt = we("li");
      bt.append(el(e.art.song(ne.id, !0) || "", String(le + 1), O), we("span", ne.title)), ee.append(bt);
    }), ee;
  }
  function _() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [we("p", `♫ ${a.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = we("div", "", "ppp-release-in"), ee = we("p", "", "ppp-release-in__h"), ne = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ee.append(we("b", z.title), we("span", `${z.subtitle || e.who(z.artist)} · ${cy(z)}${ne > 0n ? ` · ${zi(ne)} STX` : ""}`));
    const le = Vr(z), bt = e.art.cover(z.cover) || (z.cover ? "" : le[0] && e.art.song(le[0].id, !0) || ""), He = we("div", "", "ppp-rel-top");
    He.append(el(bt, "💿", "", "is-cover"), ee), O.append(He, L(le.map((Ee) => ({ id: Ee.id, title: Ee.title || `#${Ee.id}` })), e.art.cover(z.cover))), O.append(we("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const De = e.player(), Bt = v().find((Ee) => Ee.id === z.id), Fe = we("div", "", "ppp-award__row");
    if (Bt)
      O.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Fe.append(yn("Play it", () => e.open(z), "primary"));
    else if (!De.address) O.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!De.unlocked) O.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (ne > 0n) {
      const Ee = P(De.address)[z.id], Qe = e.main(), Ye = `${zi((Ee == null ? void 0 : Ee.amount) ?? ne)} STX`;
      if (Ee != null && Ee.txid || (Ee == null ? void 0 : Ee.status) === "confirming") {
        O.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const We = yn("Check now", () => void X(De.address, Ee, !0));
        We.disabled = T.has(Ee.order), Fe.append(We);
      } else if (O.append(we("p", `This album costs ${Ye}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ee) O.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ee) {
        if (Qe) {
          const Yn = yn(`Pay ${Ye} from my wallet`, () => void Q(Qe, De.address, Ee), "primary");
          Yn.disabled = !!s, Fe.append(Yn);
        } else
          O.append(we("p", "Connect a Stacks wallet to pay here. Or pay from any wallet, exactly like this:", "ppp-mute")), Fe.append(yn("Connect Stacks wallet", Rh, "primary"));
        const We = we("div", "", "ppp-rel-pay"), Rt = (Yn, pn, Mt) => {
          const qn = we("p");
          return qn.append(we("span", Yn), we("code", pn), hr(`order-${Mt}:${Ee.order}`, "Copy", () => pn, "tiny", e.changed)), qn;
        };
        We.append(Rt("Send", zi(Ee.amount) + " STX", "amount"), Rt("To", Ee.to, "to"), Rt("Memo", Ee.memo, "memo")), O.append(We, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const dn = yn("I have paid: check", () => void X(De.address, Ee, !0));
        dn.disabled = T.has(Ee.order), Fe.append(dn);
      } else {
        const We = yn(`Buy · ${Ye}`, () => void re(z), "primary");
        We.disabled = h || !!s, Fe.append(We);
      }
    } else {
      O.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ee = yn("Add to my player", () => {
        S("add", z.id).then((Qe) => {
          Qe && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ee.disabled = h, Fe.append(Ee);
    }
    return Fe.append(yn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(Fe), s && O.append(we("p", s, "ppp-cyan")), o && O.append(we("p", o, "ppp-warn")), [O];
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
    const ne = e.player().unlocked;
    ne || O.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const le of z) {
      const bt = we("div", "", "ppp-release-row" + (le.hidden ? " is-hidden" : "")), He = we("span", "", "ppp-release-row__t");
      He.append(we("b", le.title), we("span", `${le.subtitle || e.who(le.artist)}${le.hidden ? " · hidden" : ""}`));
      const De = yn(le.hidden ? "Show" : "Hide", () => void S(le.hidden ? "show" : "hide", le.id), "tiny"), Bt = yn("Remove", () => void S("remove", le.id), "tiny");
      De.disabled = Bt.disabled = !ne || h, bt.append(He, De, Bt), O.append(bt);
    }
    return O.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && O.append(we("p", o, "ppp-warn")), O;
  }
  let F = null, ye = [], ce = null;
  const Ve = we("input");
  Ve.maxLength = 60, Ve.placeholder = "Title of the single, EP or album", Ve.setAttribute("aria-label", "Release title");
  const $ = we("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const R = we("input");
  R.inputMode = "numeric", R.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", R.setAttribute("aria-label", "Cover inscription number");
  const ue = we("input");
  ue.inputMode = "decimal", ue.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ue.setAttribute("aria-label", "Price in STX");
  let me = null;
  const Ne = (z, O, ee = "") => {
    me = (me == null ? void 0 : me.id) === z && me.what === O ? null : { id: z, what: O }, (me == null ? void 0 : me.what) === "price" && (ue.value = ee), o = "", e.changed();
  };
  async function ve(z, O) {
    if (s) return;
    const ee = sC(ue.value);
    if (ee === null || !rC(ee)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const ne = { artist: z, release: O.id, price: ee.toString(), issued: e.now() }, le = await e.sign(z, oC(ne));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Qc({ request: ne, signature: le })), o = ee > 0n ? `Price set ✓ “${O.title}” now costs ${zi(ee)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, me = null, Me(z, !0);
    } catch (ne) {
      o = ne.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const wt = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function Re(z) {
    F = { for: z, loading: !0 }, ye = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const ee = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((ne) => Number.isSafeInteger(ne == null ? void 0 : ne.id) && typeof ne.title == "string") : null;
        F = ee ? { for: z, songs: ee, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Me(z, O = !1) {
    !O && (ce == null ? void 0 : ce.for) === z && e.now() - ce.at < 6e4 || (ce = { for: z, list: (ce == null ? void 0 : ce.for) === z ? ce.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (ce = { for: z, list: ee.releases.filter(fd), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function _e(z) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const O = R.value.trim().replace(/^#/, ""), ee = Wb({ title: Ve.value.trim(), subtitle: $.value.trim(), tracks: [...ye], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const ne = { artist: z, hash: Zb(ee), issued: e.now() }, le = await e.sign(z, QL(ne));
        s = "Releasing…", e.changed();
        const bt = await e.json("/radio/release/create", Qc({ definition: ee, request: ne, signature: le }));
        o = `${bt.existing ? "Already released" : "Released"} ✓ “${bt.title}”. Its link is below.`, ye = [], Ve.value = "", R.value = "", e.audition.stop(), Me(z, !0);
      } catch (O) {
        o = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Mn = () => {
    queueMicrotask(() => e.audition.stop());
  }, vn = /* @__PURE__ */ new Set();
  function pt(z) {
    const O = ye.map((We) => z.find((Rt) => Rt.id === We)).filter((We) => !!We), ee = R.value.trim().replace(/^#/, ""), ne = /^\d{1,9}$/.test(ee) ? Number(ee) : null, le = e.art.cover(ne), bt = O[0] ? e.art.song(O[0].id, !0) : null, He = we("div", "", "ppp-release-preview");
    He.append(we("p", "How it will look", "ppp-featured__h"));
    const De = we("p", "", "ppp-release-in__h"), Bt = we("b", Ve.value.trim() || "Untitled"), Fe = we("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    De.append(Bt, Fe);
    const Ee = we("div", "", "ppp-rel-top");
    Ee.append(el(ne ? le : bt || "", "💿", "", "is-cover"), De), He.append(Ee, L(O.map((We) => ({ id: We.id, title: We.title })), le));
    const Qe = O.filter((We) => e.art.song(We.id, !0) === null).length, Ye = [];
    ne && !le && Ye.push(`Looking for an image in #${ne}… If none appears, that inscription is not a picture.`), Qe && Ye.push(`Finding artwork for ${Qe} ${Qe === 1 ? "song" : "songs"}…`), !Qe && O.some((We) => e.art.song(We.id, !1) === "") && Ye.push(`A numbered square is a song with no artwork of its own${le ? ": it shows the cover, dimmed" : ""}.`);
    for (const We of Ye) He.append(we("p", We, "ppp-mute"));
    return Ve.oninput = () => {
      Bt.textContent = Ve.value.trim() || "Untitled";
    }, $.oninput = () => {
      Fe.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, R.onchange = () => e.changed(), He;
  }
  function Lt() {
    var ee;
    const z = e.main();
    if (!t || !z)
      return F && (F = null, ye = [], Mn()), null;
    const O = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== z && (F = null, ye = [], vn.clear(), Mn()), !F) O.push(yn("Show the songs in my wallet", () => Re(z), "primary"));
    else if (F.loading) O.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(we("p", F.error, "ppp-warn"), yn("Try again", () => Re(z)));
    else if (!F.songs.length) O.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const ne = we("div", "", "ppp-release-songs");
      for (const He of F.songs) {
        const De = ye.indexOf(He.id), Bt = we("div", "", "ppp-release-song" + (De >= 0 ? " is-on" : "")), Fe = e.audition.state(He.id);
        Fe !== "idle" && vn.add(He.id);
        const Ee = yn(Fe === "playing" ? "❚❚" : Fe === "loading" ? "…" : "▶", () => e.audition.toggle(He.id), "ppp-release-hear" + (Fe === "playing" ? " is-on" : ""));
        Ee.setAttribute("aria-label", Fe === "playing" ? `Stop ${He.title}` : `Listen to ${He.title}`), Ee.title = Fe === "error" ? "This song could not be played just now" : Fe === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Qe = e.art.song(He.id, De >= 0 || vn.has(He.id)), Ye = yn("", () => {
          ye = De >= 0 ? ye.filter((We) => We !== He.id) : [...ye, He.id], e.changed();
        }, "ppp-release-pick");
        Ye.setAttribute("aria-pressed", String(De >= 0)), Ye.append(we("i", De >= 0 ? String(De + 1) : "+"), we("b", He.title), we("span", Fe === "error" ? "could not play" : `${He.artist ? He.artist + " · " : ""}#${He.id}`, Fe === "error" ? "ppp-warn" : "")), Bt.append(Ee, el(Qe || "", Qe === "" ? "♪" : "", ""), Ye), ne.append(Bt);
      }
      O.push(ne), F.more && O.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && ye.length && ($.value = ((ee = F.songs.find((He) => He.id === ye[0])) == null ? void 0 : ee.artist) || "");
      const le = ye.length === 0 ? "release" : ye.length === 1 ? "single" : ye.length <= 6 ? "EP" : "album", bt = yn(ye.length ? `Sign and release this ${le} · ${ye.length} ${ye.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void _e(z), "primary");
      bt.disabled = !ye.length || !!s, O.push(Ve, $, R), ye.length && O.push(pt(F.songs)), O.push(bt);
    }
    if (s && O.push(we("p", s, "ppp-cyan")), o && !a && O.push(we("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Me(z), (ce == null ? void 0 : ce.for) === z && ce.list.length) {
      O.push(we("p", "Your releases", "ppp-featured__h"));
      for (const ne of ce.list) {
        const le = we("div", "", "ppp-release-row"), bt = we("span", "", "ppp-release-row__t"), He = BigInt(/^\d{1,12}$/.test(ne.price ?? "") ? ne.price : "0"), De = He > 0n ? ` · ${zi(He)} STX · ${(ne.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (bt.append(we("b", ne.title), we("span", `${cy(ne)} · added by ${ne.added.toLocaleString()} ${ne.added === 1 ? "player" : "players"}${De}`)), le.append(bt, hr("release-link:" + ne.id, "Copy link", () => wt(ne.id), "tiny", e.changed)), n.sales) {
          const Fe = yn("Price", () => Ne(ne.id, "price", He > 0n ? zi(He) : ""), "tiny");
          Fe.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === ne.id && me.what === "price")), le.append(Fe);
        }
        if (n.copies && e.copies) {
          const Fe = yn("Send copies", () => Ne(ne.id, "copies"), "tiny");
          Fe.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === ne.id && me.what === "copies")), le.append(Fe);
        }
        if (O.push(le), (me == null ? void 0 : me.id) !== ne.id) continue;
        const Bt = we("div", "", "ppp-release-way");
        if (me.what === "price" && n.sales) {
          const Fe = yn("Sign this price", () => void ve(z, ne), "primary");
          Fe.disabled = !!s, Bt.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ue,
            Fe
          );
        } else me.what === "copies" && n.copies && e.copies && Bt.append(...e.copies(z, { id: ne.id, title: ne.title }));
        Bt.childNodes.length && O.push(Bt);
      }
    }
    return O;
  }
  return { sync: q, albums: m, banner: _, manage: W, fold: Lt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const hd = "xtrata.radio.replace.v1", Tn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Lo = (e, t, n = "") => {
  const r = Tn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ly = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function aC(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(hd) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(hd, v ? JSON.stringify(v) : null), e.changed();
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
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(hd, JSON.stringify(n)));
    const S = [], I = (X, Q) => S.push(Tn("p", `Replacing your old player · step ${X} of 3 · ${Q}`, "ppp-cyan")), U = () => Lo("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      S.push(Tn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? S.push(Tn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Lo("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && S.push(Tn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return S.push(Tn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), S.push(Lo("Done", w, "quiet")), S;
    }
    if (!v.listening || n.removed)
      return n.removed ? (I(3, "claim your new player"), S.push(Tn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), S.push(Lo("Hide this", w, "quiet")), S) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return I(1, "empty it"), S.push(Tn("p", "Unlock your old player so it can be emptied."), Lo("Unlock my old player", e.unlock, "primary"), U()), S;
    const P = e.keepBoth(v), A = (X) => (I(1, "empty it"), S.push(Tn("p", X, "ppp-warn")), P && S.push(Lo("Keep both players instead", () => {
      w(), P();
    }, "primary")), S.push(U()), S);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return I(1, "empty it"), S.push(Tn("p", "Checking what this player has…", "ppp-mute"), U()), S;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return I(1, "empty it"), S.push(Tn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), U()), S;
    if (v.balance === void 0)
      return I(1, "empty it"), S.push(Tn("p", "Checking what it holds…", "ppp-mute"), U()), S;
    if (v.balance > e.dust(v))
      return I(1, "empty it"), S.push(Tn("p", `It holds ${ly(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? S.push(Lo("Send everything back", e.returnAll, "primary")) : S.push(Tn("p", "There is nowhere set to send it. Connect a Stacks wallet and link it to this player, then come back here.", "ppp-warn"), Lo("Connect Stacks wallet", Rh, "primary")), S.push(U()), S;
    I(2, "remove it from this device"), S.push(Tn("p", v.balance > 0n ? `Empty ✓ (the ${ly(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), S.push(Tn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = Lo(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, S.push(T, U()), i && S.push(Tn("p", i, "ppp-warn")), S;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: y };
}
const cC = [
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
function lC(e) {
  for (const [t, n] of cC) if (n.test(e)) return t;
  return null;
}
const t1 = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), n1 = (e) => /Android/.test(e);
function uC(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : t1(t) ? "x-safari-" + n.href : n1(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const dC = (e) => t1(e) ? "Safari" : n1(e) ? "Chrome" : "your browser", Gi = "Xtrata Music player", fC = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function uy(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Gi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && fC.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Gi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Gi, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Gi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Gi, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Gi, detail: "Open on this device." });
    }
  return r;
}
const pd = "xtrata.radio.novice", r1 = "xtrata.radio.novice.previewed.v1", dy = 6 * 6e4;
function hC(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(pd, r), n = r;
    else {
      if (r === "0")
        return t.set(pd, null), { on: !1, preview: !1 };
      n = t.get(pd);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const pC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, fy = (e) => pC.test(e ?? ""), gC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, yC = {
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
}, wC = (e, t) => yC[e] ?? t;
function mC(e, t) {
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
const bC = "Make your player once, with Face ID or your fingerprint, and the music starts.", xC = "Checking your player…", $f = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function o1(e) {
  try {
    const t = JSON.parse(e.get(r1) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function SC(e, t) {
  const n = o1(e).filter((r) => r !== t);
  n.push(t), e.set(r1, JSON.stringify(n.slice(-50)));
}
function gd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...$f(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : $f();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > dy ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > dy ? { ...e, phase: "done" } : e;
  }
}
const tl = (e) => e.phase === "open" || e.phase === "playing";
function vC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const AC = [100, 250, 500, 1e3], EC = (e, t = qr) => BigInt(e) * Dn(t);
function kC(e, t = qr, n = 0n) {
  const r = Mo - e - n;
  return r > 0n ? Number(r / Dn(t)) : 0;
}
function $C(e, t = qr, n = 0n) {
  const r = e === void 0 ? 0 : kC(e, t, n);
  return AC.map((s) => ({ plays: s, stx: EC(s, t), fits: e !== void 0 && s <= r }));
}
const IC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, LC = (e) => IC[e.unit](e.amount), Xt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fl = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function CC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${fl(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${fl(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${fl(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function TC(e) {
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
    const a = $C(i.balance, i.fee, i.incoming);
    s(a);
    const c = vC(i.switches);
    (y = c.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], h = Xt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Xt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fl(i.playsLeft, "play", "plays")} left.`));
    const d = CC(i.done);
    if (d && u.push(Xt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Xt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Xt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Xt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Xt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const P = Xt("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        P.type = "button", P.disabled = !U.fits, P.setAttribute("aria-pressed", String(U.plays === n)), P.append(Xt("b", "", U.plays.toLocaleString()), Xt("span", "", "plays")), P.onclick = () => {
          n = U.plays, o();
        }, v.append(P);
      }
      u.push(v);
      const S = Xt("div", "ppp-restock__ways");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const P = Xt("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        P.type = "button", P.disabled = !U.on, P.setAttribute("aria-pressed", String(U.id === r)), P.append(Xt("b", "", U.label), Xt("span", "", U.on ? U.blurb : "Soon")), P.onclick = () => {
          r = U.id, o();
        }, S.append(P);
      }
      u.push(S);
      const I = a.find((U) => U.plays === n);
      if (I && r === "stx") {
        const U = Xt("div", "ppp-restock__pay"), P = LC({ unit: "microSTX", amount: I.stx }), A = Xt("p", "ppp-restock__amount");
        A.append("Send ", Xt("b", "", P), " to your player:"), U.append(A, Xt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Xt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Fr(I.stx), "")), U.append(T), U.append(Xt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(U);
      }
    }
    u.push(Xt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Xt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Xt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const jr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), BC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function MC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: BC(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function NC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = jr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function _C(e, t, n = "", r = 60) {
  const s = jr(t).split(/\s+/).filter(Boolean), o = jr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = jr(a.artist), u = jr(a.title), h = String(a.id);
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
const cr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, hy = 12, PC = 14, py = (e) => [...e.trim()].length <= PC;
function UC(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = cr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = cr("div", "hint"), u = cr("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = cr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = cr("div", "likesTools");
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
        const T = cr("button", "find-back", "Back to My player");
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
      const T = cr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const S = NC(n), I = (T, B, X, Q = "", re = "") => {
      const q = cr("button", "find-chip" + (re ? " " + re : "") + (B ? " is-on" : ""), T);
      return q.type = "button", q.setAttribute("aria-pressed", String(B)), Q && (q.title = Q), q.onclick = X, q;
    }, U = (T, B, X = "") => I(B, jr(T.name) === jr(o), () => {
      var Q;
      o = jr(T.name) === jr(o) ? "" : T.name, y(), o && t.artistsMount && ((Q = e.scrollIntoView) == null || Q.call(e, { block: "start", behavior: "smooth" }));
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, X);
    if (t.grid) {
      const T = S.filter((Q) => py(Q.name)), B = S.filter((Q) => !py(Q.name)), X = i ? B : B.filter((Q) => jr(Q.name) === jr(o));
      u.replaceChildren(
        ...T.map((Q) => U(Q, Q.name)),
        ...B.length ? [I(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, y();
        }, "", "find-more")] : [],
        ...X.map((Q) => U(Q, `${Q.name} · ${Q.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? S : S.slice(0, hy);
      u.replaceChildren(
        ...T.map((B) => U(B, `${B.name} · ${B.songs}`)),
        ...S.length > hy ? [I(i ? "Fewer artists" : `All ${S.length} artists`, !1, () => {
          i = !i, y();
        })] : []
      );
    }
    const P = _C(n, s, o), A = t.current();
    h.replaceChildren(...P.songs.map((T) => {
      var Q, re;
      const B = cr("li", "lrow" + (T.id === A ? " now" : "")), X = cr("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const q = cr("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", X.append(" ", q);
      }
      if ((re = t.liked) != null && re.call(t, T.id)) {
        const q = cr("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), B.append(X, q);
      } else B.append(X);
      return B.append(cr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${S.length.toLocaleString()} artists. Search, or pick an artist.` : P.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : P.total > P.songs.length ? `Showing ${P.songs.length} of ${P.total.toLocaleString()}. Type more to narrow it down.` : `${P.total} ${P.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
function OC(e) {
  return /(CriOS|FxiOS|EdgiOS|OPiOS)\//.test(e) || /iP(hone|ad|od)/.test(e) ? !0 : /AppleWebKit\//.test(e) && /Safari\//.test(e) && !/(Chrome|Chromium|Edg|OPR|Firefox)\//.test(e);
}
const gy = (e, t, n) => jf(Gf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), HC = 317, DC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, FC = 15 * 6e4, jC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function yd(e, t) {
  return e.standalone ? null : t ? "prompt" : jC(e) ? "ios" : null;
}
const Zi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function RC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function zC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const lr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, GC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function KC(e, t, n = "safari") {
  const r = zC(n), s = lr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", Zi.title);
  const o = lr("div", "a2hs-card"), i = lr("div", "a2hs-head"), a = lr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = lr("div");
  c.append(lr("h2", "", Zi.title), lr("p", "", Zi.body)), i.append(a, c);
  const u = lr("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = lr("li");
    v.append(lr("i", "", String(y + 1)), lr("span", "", w)), u.append(v);
  });
  const h = lr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(GC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = lr("button", "a2hs-close", Zi.close);
  return d.type = "button", d.onclick = t, o.append(i, u, d), s.append(o, h), s.onclick = (w) => {
    w.target === s && t();
  }, s;
}
function VC(e) {
  let t = null, n = null, r = !1;
  const s = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, o = () => {
    const i = r ? null : yd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Zi.label), e.button.title = Zi.label, e.button.onclick = () => {
    var a;
    const i = yd(e.env(), !!t);
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
    i === "ios" && !n && (n = KC(e.icon, s, RC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, o();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, s(), o();
  }), o(), { sync: o, kind: () => r ? null : yd(e.env(), !!t) };
}
const yy = document.getElementById("ppp");
yy && XC(yy);
function XC(e) {
  var Yh;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = M1(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = uI({
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
      const p = new Promise((se, Se) => {
        i.addEventListener("load", () => se(), { once: !0 }), setTimeout(() => Se(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new A1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (se, Se) => f.has(se) ? g.request(se, Se) : Promise.race([
        g.request(se, Se),
        new Promise((pe, Ze) => setTimeout(() => Ze(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: z5,
      balance: K5,
      account: G5,
      owner: V5,
      broadcast: X5,
      transaction: Y5,
      confirmedNonce: async (l) => {
        const p = await $s(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => nd({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, j) => $g({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new wd(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (se) => f(se.txId || ""),
      onCancel: () => j(new Error("Deposit cancelled. Nothing was sent.")),
      onError: j
    })),
    validate: q5,
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
    changed: () => b(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => tI(l, $s), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
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
    history: (l, p) => oI(l, (g) => $s(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((j) => (j == null ? void 0 : j.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((j) => typeof j == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => kn(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, j, se) => new Promise((Se, pe) => $g({
    recipient: f,
    amount: j.toString(),
    memo: se,
    stxAddress: g,
    network: new wd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ze) => Se(Ze.txId || ""),
    onCancel: () => pe(new Error(p)),
    onError: pe
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), b(c.snapshot());
  } : null, w = aC({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ft(l),
    changed: () => b(c.snapshot()),
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
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = wL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => nd({ ...p, network: "mainnet", stxAddress: l }),
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
    who: (l) => ft(l),
    changed: () => b(c.snapshot()),
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
      if (!M()) return;
      const p = c.snapshot();
      window.dispatchEvent(new CustomEvent(p.slot === l && !p.error ? "xtrata:radio-listen" : "xtrata:radio-panel"));
    });
  };
  let I;
  const U = (l) => {
    l !== I && (I = l, window.dispatchEvent(new CustomEvent("xtrata:radio-albums", { detail: { has: l } })));
  }, P = IL({
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
    changed: () => b(c.snapshot())
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
  }, T = hC(location.search, A);
  T.on && (document.documentElement.dataset.novice = T.preview ? "preview" : "1");
  const B = (l) => T.on && l.solo, X = T.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), Q = X ? document.getElementById("album") : null, re = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, q = Q ? iy(Q, re) : null, m = iC({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => nd({ ...p, network: "mainnet", stxAddress: l }),
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
    open: (l) => gn(l, !0),
    who: (l) => ft(l),
    art: { song: (l, p) => p && Gl(String(l)) || ny(String(l)), cover: (l) => dl(l) },
    audition: VL({
      changed: () => b(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => b(c.snapshot()),
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
    const l = new Set(jn.map((p) => p.id));
    return [...jn, ...m.albums().filter((p) => !l.has(p.id))];
  }, _ = Q ? ZL(Q) : null, N = "xtrata.radio.award.later.v1";
  let W = "ready", F = !1, ye = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(N) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), ce = !1;
  const Ve = "xtrata.radio.tier.v1";
  let $ = (() => {
    const l = A.get(Ve);
    return Zc(l) ? Xs(l) : null;
  })();
  const R = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function ue(l) {
    var j;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let se = null;
      try {
        se = l.gift && !l.gift.player && l.gift.drop === "players" ? lL(BigInt(l.gift.amount)) : null;
      } catch {
        se = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (se = null), ((se == null ? void 0 : se.id) ?? null) !== (($ == null ? void 0 : $.id) ?? null) && ($ = se, A.set(Ve, se ? se.id : null));
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
  })(), Ne = document.getElementById("a2hs");
  Ne && VC({
    button: Ne,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: me })
  });
  let ve = T.on ? HC : null, wt = !1, Re = 0, Me = "";
  T.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : DC(l == null ? void 0 : l.song) ? l.song : ve;
    p !== ve && !wt && (ve = p, b(c.snapshot()));
  }).catch(() => {
  });
  const _e = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Mn = (l) => {
    var f, j, se;
    if (!wt || ve === null) return !1;
    if (Date.now() - Re > FC || l.step === "ready")
      return l.step !== "ready" && (wt = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), g = Number((se = p == null ? void 0 : p.nowPlaying) == null ? void 0 : se.tokenId);
    return Date.now() - Re < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== ve ? (wt = !1, !1) : !0;
  };
  function vn() {
    const l = window.XtrataRadio;
    if (!(ve === null || !(l != null && l.playToken))) {
      wt = !0, Re = Date.now(), c.holdFirstPlay(), b(c.snapshot());
      try {
        l.playToken(ve);
      } catch {
        wt = !1;
      }
    }
  }
  const pt = () => {
    var f, j;
    if (!wt || ve === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === ve ? l.nowPlaying : null, g = vu.get(ve);
    return { title: (p == null ? void 0 : p.title) || (g == null ? void 0 : g.title) || "", artist: (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${ve}`, playing: !!(l != null && l.playing) };
  }, Lt = T.on && Q ? UL(Q) : null, Ot = Date.now();
  let z = !1, O = null, ee = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const ne = () => {
    ee = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    b(c.snapshot());
  }, le = (l, p) => {
    var se;
    if (!Lt || p || ee) return null;
    if (!l.gate || l.step === "loading" || (z = !0), !z) return Date.now() - Ot < 1e4 ? "checking" : null;
    if (!B(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((se = l.gift) != null && se.player), j = f && !l.entries.some((Se) => Se.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (O === "landed" || O === "arriving" && (j || wt)) ? "landed" : l.step === "loading" && O !== "checking" ? O : null;
  };
  let bt = !1;
  const He = (() => {
    try {
      return OC(navigator.userAgent);
    } catch {
      return !1;
    }
  })();
  function De(l, p, g = [], f) {
    if (!Lt) return;
    const j = f !== void 0 ? f : le(l, p);
    if (O = j, delete document.documentElement.dataset.noviceBoot, !j) {
      Lt.render(null, p);
      return;
    }
    const se = [...g];
    j === "arriving" && l.arrival && se.push(Y(l.arrival)), l.step === "unsupported" ? se.push(C("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && se.push(C("p", l.error, "ppp-warn"));
    const Se = j === "gift" ? v.incomingStarter() : null;
    Se && (ve === null || He) && !bt && l.step === "intro" && !l.busy && !l.armed && !l.error && !Mr && (bt = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Lt.render({
      mode: j,
      status: se,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !Mr,
      plays: Se ? Se.plays : j === "landed" ? l.playsLeft : null,
      from: (Se == null ? void 0 : Se.from) ?? null,
      tier: $,
      mystery: R,
      spot: _e,
      installed: me,
      intro: Se && ve !== null && !He && l.step === "intro" ? { ready: !0 } : null,
      now: pt(),
      albums: j === "landed" ? jn.map((pe) => ({ title: pe.title, by: pe.subtitle, cover: dl(pe.cover), run: () => {
        ne(), gn(pe, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        Se && ve !== null && !He && vn(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Ee(),
      full: () => {
        var _t, ht, Xe;
        const pe = window.XtrataRadio, Ze = j === "landed" && !((ht = (_t = pe == null ? void 0 : pe.getState) == null ? void 0 : _t.call(pe)) != null && ht.playing);
        wt = !1, ne(), Ze && ((Xe = pe == null ? void 0 : pe.playPause) == null || Xe.call(pe));
      }
    });
  }
  Lt && setTimeout(() => {
    z || b(c.snapshot());
  }, 10100), Rl(() => {
    (Lt != null && Lt.showing() || document.documentElement.dataset.asking || m.wantsArt()) && b(c.snapshot());
  });
  const Fe = TC({
    input: () => {
      var j, se, Se, pe;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ze) => Ze.kind === "play" && Ze.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : dt(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((se = l.gate) == null ? void 0 : se.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Se = l.gate) == null ? void 0 : Se.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ze) => Ze.recipient)).size, likes: g.filter((Ze) => Ze.kind === "like" && Ze.status === "confirmed" && Ze.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((pe = l.likeFunds) != null && pe.pending)
      };
    },
    copyButton: (l, p, g, f) => hr(l, p, g, f, () => {
      b(c.snapshot());
    })
  }), Ee = () => {
    if (!c.snapshot().unproven) {
      Fe.open();
      return;
    }
    c.prove().then((l) => {
      l && Fe.open();
    });
  }, Qe = document.getElementById("albumList"), Ye = Qe ? iy(Qe, re, { list: !0 }) : null, We = "xtrata.radio.album.last.v1", Rt = () => {
    try {
      const l = JSON.parse(localStorage.getItem(We) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let dn = "";
  const Yn = (l) => {
    const p = JSON.stringify(l);
    if (p !== dn) {
      dn = p;
      try {
        localStorage.setItem(We, p);
      } catch {
      }
    }
  };
  let pn = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (Le = !0), $n();
    const p = Do(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Mt;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const qn = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Mt && (Mt = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let jn = [], Wr = 0, Cr = !1, An = null;
  const En = (l) => {
    var p, g;
    Cr || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - Wr < 6e4 || (Wr = Date.now(), a("/radio/gift/featured").then((f) => {
      jn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), Cr = !0, jn.length && b(c.snapshot());
    }).catch(() => {
    }));
  }, jt = (l) => {
    var p;
    return An && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? An : null;
  }, gn = (l, p = !1) => {
    var f, j;
    An = l, b(c.snapshot());
    const g = l && p ? Vr(l)[0] : null;
    g && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, g.id));
  };
  let je = $f(), on = null;
  const yo = (l) => {
    const p = T.preview && !Mr && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (je = gd(je, { kind: "offer", album: p.player.id, already: o1(A).includes(p.player.id) }), tl(je) ? p.player : null) : (je = gd(je, { kind: "withdraw" }), null);
  }, Zr = (l) => {
    const p = je.phase;
    je = gd(je, l), je.phase !== p && (je.album && (je.phase === "playing" || je.phase === "done") && SC(A, je.album), b(c.snapshot()));
  };
  setInterval(() => {
    je.phase === "playing" && Zr({ kind: "tick", at: Date.now() });
  }, 5e3);
  let E = "", H, V = !1, D = !1, J;
  const oe = (l, p) => {
    var Ko, Eo, Bi, Qn, Ia, Vo, Ue, Et, Tt, Pn;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((Ko = l.giftStop) == null ? void 0 : Ko.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = on, se = Mn(l), Se = f ? B(l) ? wC(f.reason, f.text) : f.text : null, pe = j || se ? null : Se ?? (t && (!((Eo = l.gate) != null && Eo.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null), Ze = l.slot === 0 && !((Bi = l.gift) != null && Bi.player) && !l.entries.some((Xo) => Xo.kind === "play"), _t = !!Lt && !ee && B(l) && (l.step === "intro" || l.step === "unsupported" || l.step === "locked" || l.step === "fund" && Ze), ht = (f == null ? void 0 : f.reason) === "arriving" || (f == null ? void 0 : f.reason) === "tab" || _t, Xe = !!pe && !ht, Pe = Xe ? null : pe;
    Xe !== J && ((Qn = g.setSample) == null || Qn.call(g, Xe), J = Xe), Pe && Pe !== H && (g.setGiftStop(Pe), H = Pe);
    const Ie = l.step === "off" || l.step === "elsewhere" ? null : ((Ia = l.gift) == null ? void 0 : Ia.player) ?? j ?? jt(l) ?? null, $t = Ie ? Ie.id + ":" + Ie.cover + ":" + Ie.tracks.map((Xo) => Xo.id).join(",") : "";
    $t !== E && (g.setGiftPlayer(Ie ? { id: Ie.id, title: Ie.title, subtitle: Ie.subtitle, tracks: Vr(Ie).map((Xo) => Xo.id), hidden: ((Vo = aL(Ie)) == null ? void 0 : Vo.id) ?? null, cover: Ie.cover } : null), E = $t), Pe !== H && (g.setGiftStop(Pe), H = Pe);
    const zt = !se && (f == null ? void 0 : f.reason) === "arriving";
    zt !== D && ((Ue = g.setGiftWait) == null || Ue.call(g, zt), D = zt);
    const Jn = !!Ie && (!!j || !!((Et = l.albumLock) != null && Et.locked));
    Jn !== V && ((Tt = g.setGiftLock) == null || Tt.call(g, Jn), V = Jn), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((Pn = g.forgetWallets) == null || Pn.call(g));
  };
  let Le = !1;
  const Ae = /* @__PURE__ */ new Map(), ze = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = Ae.get(l.listening);
    return g === void 0 && (g = Date.now(), Ae.set(l.listening, g)), Date.now() - g < Dl ? g : null;
  }, Ct = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && Ae.has(l.listening), qe = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", dt = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > cn ? Number((l - cn) / p) : 0;
  }, xt = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), gt = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, Nt = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, C = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, $e = (l, p, g = "") => {
    const f = C("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, Ke = (l, p) => {
    const g = C("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  }, Tr = 6, Br = 20;
  let ct = !1, Wt = !1;
  const Ai = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "just now" : p < 60 ? `${p} min ago` : p < 1440 ? `${Math.round(p / 60)} h ago` : `${Math.round(p / 1440)} ${Math.round(p / 1440) === 1 ? "day" : "days"} ago`;
  };
  Rl(() => {
    Wt && b(c.snapshot());
  });
  let br = null, Ho = location.hash === "#give";
  Ho && history.replaceState(null, "", location.pathname + location.search);
  let Wn = !1;
  const Zn = XI((l) => VI({ address: l, network: "mainnet" }), () => b(c.snapshot())), kn = (l) => Zn.get(l), Mr = lC(navigator.userAgent), Ts = (l, p) => {
    const g = navigator.userAgent, f = dC(g), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, se = [C("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${T.on ? "player" : "listening wallet"}${p ? T.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Se = C("div", "", "ppp-open-row"), pe = uC(j, g);
    if (pe) {
      const Ze = C("a", `Open in ${f}`, "primary ppp-open-in");
      Ze.href = pe, Ze.dataset.homeAction = "radio:open-in-browser", Se.append(Ze);
    }
    return Se.append(hr("copy-page-link", "Copy link", () => j, pe ? "" : "primary", () => b(c.snapshot()))), se.push(Se, C("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), se;
  }, ft = (l) => kn(l) ?? qe(l), wo = (l) => l.slice(0, 2).map(ft).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Ei = /* @__PURE__ */ new Map();
  let mo = !1;
  const ki = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), $n = () => {
    mo || (mo = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && Ei.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      b(c.snapshot());
    }).catch(() => {
      mo = !1;
    }));
  }, Do = (l, p) => {
    const g = Ei.get(l), f = Gg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((se) => !ki(se)) || ""), j = Rg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, bo = (l) => {
    const { title: p, artist: g } = Do(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, $i = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Bs = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function xo(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function In(l, p, g = "", f) {
    const j = C("dt", l), se = C("dd", p, g);
    return f && se.append(" ", f), [j, se];
  }
  const Rn = document.getElementById("ppp-top"), Fo = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, xr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Ms = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      xr();
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
    Fo();
  };
  Rn && (Rn.onclick = Ms);
  const So = (l, p, g, f = "") => l.standIn && !l.mainConnected ? $e(`Connect ${ft(l.standIn)} to add STX`, xr, f) : $e(p, g, f), Ns = (l) => {
    c.useLinked(l).then(() => Fo());
  };
  let Sr = null;
  const Ii = () => {
    const l = uy(c.snapshot(), ft);
    return l.length ? Sr || (Sr = new Promise((p) => {
      var ht;
      const g = C("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (Xe) => {
        f = Xe, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), Sr = null, p(f);
      }), g.addEventListener("click", (Xe) => {
        Xe.target === g && j(null);
      });
      const se = (Xe, Pe, Ie, $t, zt = !1) => {
        const Jn = C("button", "", "ppp-connect__opt " + Ie);
        return Jn.type = "button", Jn.disabled = zt, Jn.onclick = $t, Jn.append(C("b", Xe), C("span", Pe)), Jn;
      }, Se = C("h2", "Connect to Xtrata Music", "ppp-connect__title");
      Se.id = "ppp-connect-title";
      const pe = l.map((Xe) => se(Xe.label, Xe.detail, "is-music", () => {
        if (j("music"), Xe.action === "linked" && Xe.main) {
          Ns(Xe.main);
          return;
        }
        const Pe = uy(c.snapshot(), ft).find((Ie) => Ie.action !== "linked");
        (Pe == null ? void 0 : Pe.action) === "create" ? c.create() : (Pe == null ? void 0 : Pe.action) === "unlock" && c.unlock(), Fo();
      }, !!Xe.disabled)), Ze = se("Xverse or Leather", "If you already use one.", "is-stacks", () => j("stacks")), _t = $e("Cancel", () => j(null), "quiet ppp-connect__cancel");
      g.append(Se, ...pe, Ze, _t), document.body.appendChild(g), g.showModal(), (ht = pe.find((Xe) => !Xe.disabled)) == null || ht.focus();
    }), Sr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Ii;
  function ka(l) {
    if (!Rn) return;
    const p = (f, j, se) => {
      Rn.hidden = !1, Rn.className = "ppp-top" + (j ? " is-" + j : ""), Rn.replaceChildren(C("span", "", "dot"), document.createTextNode(f)), Rn.title = se;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Rn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Rn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ft(l.linked)}`, "warn", `This device's listening wallet belongs to ${ft(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
        return l.payingOn && g > 0 && !l.giftStop ? p(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const sn = document.getElementById("pppNudge"), or = document.getElementById("onair");
  (Yh = sn == null ? void 0 : sn.querySelector("button")) == null || Yh.addEventListener("click", () => Ms());
  const Zt = {
    connect: "Connect your player to hear whole songs",
    intro: "Set up your player to hear whole songs",
    locked: "Unlock your player to hear whole songs",
    "wrong-wallet": "Switch wallets to hear whole songs",
    link: "Finish setup to hear whole songs",
    fund: "Previews only: no plays left",
    over: "Return the excess to hear whole songs",
    ready: "Music support is paused"
  }, Nr = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, jo = document.getElementById("claimCard");
  let vo = !1, Ao = 0, Li = 0;
  function Ro(l) {
    if (!jo) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !vo && (vo = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (Ao = f.free, Li = f.total, Ro(c.snapshot()));
    }).catch(() => {
    })), jo.hidden = !(p && Ao > 0);
    const g = jo.querySelector(".claim-n");
    g && Ao > 0 && (g.textContent = `${Ao.toLocaleString()} of ${Li.toLocaleString()} left`);
  }
  const vr = document.getElementById("youStatus");
  function Ci(l) {
    if (!vr || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    vr.dataset.on = g ? "1" : "0";
    const j = vr.querySelector("b"), se = vr.querySelector(".you-status__t > span");
    !j || !se || (j.textContent = g ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", se.textContent = g ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function sr(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, se = g || f || j ? "" : Zt[l.step] ?? "", Se = g ? "on" : j ? "free" : se ? "off" : "";
    Se ? document.documentElement.dataset.ppp = Se : delete document.documentElement.dataset.ppp, or && (or.hidden = !Se || Se === "free", or.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), sn && (sn.hidden = Se !== "off" && Se !== "free", sn.classList.toggle("is-free", Se === "free"), Se === "free" ? (sn.querySelector(".nudge-t").textContent = "You’re on the free player", sn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", sn.querySelector("button").textContent = "Get a player") : Se === "off" && (sn.querySelector(".nudge-t").textContent = se, sn.querySelector(".nudge-s").textContent = B(l) && l.step === "intro" ? bC : "Until then you hear the first 30 seconds of each song.", sn.querySelector("button").textContent = Nr[l.step] ?? "Start"));
  }
  let _s = "";
  function zo(l) {
    const p = C("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(C("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(C("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = C("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = _s, g.oninput = () => {
      _s = g.value;
    };
    const f = $e(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), _s = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", $e("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const Ps = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Us() {
    const l = C("p", Ps + " ", "ppp-mute");
    return l.append(Ke("Xverse", "https://www.xverse.app/download"), " · ", Ke("Leather", "https://leather.io/install-extension")), l;
  }
  let x = "";
  const k = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? qe(l.listening) : "new" : "", f = gI() ? "1" : "", j = l.standIn && !l.mainConnected ? ft(l.standIn) : "";
    `${g}|${f}|${j}` !== x && (x = `${g}|${f}|${j}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => b(c.snapshot()), l);
  function G(l, p = "") {
    const g = C("div", "", "ppp-topup"), f = te(l);
    g.append(C("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of ul) {
      const se = $e(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      se.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, g.append(se);
    }
    return f !== void 0 && f < ul[0] && g.append(C("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const te = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - cn - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function Be(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (Le = !1), p.low && !Le) return [];
    const g = C("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = C("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(Ke("View", Nt(p.txid))), g.append(j), [g];
    }
    g.append(C("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(C("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(C("p", p.address, "ppp-addr-full"));
    const f = C("div", "", "ppp-open-row");
    if (f.append(hr("copy-likes-address", "Copy address", () => p.address, "primary", () => b(c.snapshot()))), p.main && !l.solo) {
      const j = Mo - (p.balance ?? 0n);
      j > 0n && f.append(So(l, `Pay ${Fr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(C("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Y = (l) => {
    const p = C("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = C("p", "", "ppp-wait-t"), f = C("div", "", "ppp-wait-track");
    return f.append(C("div", "", "ppp-wait-fill")), p.append(g, f), ke(p), p;
  };
  function ke(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), se = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const Se = Math.ceil((g - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", se.textContent = `Loading your plays · ${Se}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      j.style.width = "", se.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let xe = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      xe = 0;
      return;
    }
    l.forEach(ke), ++xe % 10 === 0 && b(c.snapshot());
  }, 1e3);
  let Te = null;
  function lt(l) {
    if (l.step === "loading" && Te !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== Te && (Te = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function b(l) {
    var tp, np, rp, op, sp, ip, ap, cp, lp, up, dp, fp, hp, pp, gp, yp, wp, mp;
    if (m.sync(), pn && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = pn;
      pn = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), g = ze(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: Dl } } : l, j = f.error === Fl;
    if (qn(), En(l), ue(l), on = yo(l), oe(l, f), lt(f), k(f), !p && v.inProgress(l)) return;
    if (ka(f), sr(f), Ro(f), Ci(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? T.on ? xC : "Checking your listening wallet…" : T.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      De(f, !1);
      return;
    }
    const [se, Se] = xo(f), pe = s(".ppp-state");
    pe.textContent = se, pe.className = "ppp-state" + (Se ? " ppp-state--" + Se : ""), pe.hidden = !se;
    const Ze = !!f.busy || f.armed, _t = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ze || !["intro", "loading"].includes(f.step));
    o.hidden = !_t, o.classList.toggle("ppp-frame--rest", !Ze && !Wn);
    const ht = s(".ppp-frame-label");
    ht.hidden = !0;
    const Xe = dI(f) ?? br;
    br = Xe;
    const Pe = "xtrata.radio.ppp.heard.v1", Ie = (() => {
      try {
        return localStorage.getItem(Pe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Ie && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(Pe, "1");
      } catch {
      }
    const $t = Ie || f.slot > 0 && ((((tp = f.likeFunds) == null ? void 0 : tp.balance) ?? 0n) > 0n || P.count() > 1), zt = B(f), Jn = !zt && hI({ ...f, heard: $t }, Xe);
    s(".ppp-badge").hidden = !Jn;
    const Ko = s(".ppp-steps"), Eo = s(".ppp-stage");
    Ko.hidden = Eo.hidden = !Jn, Xe && Jn && (Ko.replaceChildren(...vf(f.solo).map((Z, de) => {
      const Ge = C("li", "", de < Xe.at ? "done" : de === Xe.at ? Xe.blocked ? "now blocked" : "now" : "");
      return Ge.append(C("span", de < Xe.at ? "✓" : String(de + 1), "n"), Z), de === Xe.at && Ge.setAttribute("aria-current", "step"), Ge;
    })), Eo.textContent = Xe.caption, Eo.className = "ppp-stage " + (Xe.at >= vf(f.solo).length ? "ppp-ok" : Xe.blocked ? "ppp-bad" : "ppp-cyan"));
    const Bi = s(".ppp-facts"), Qn = [];
    f.main && ((np = f.gate) != null && np.here) && !f.solo && Qn.push(...In("Your wallet", ft(f.main), "ppp-addr-short"));
    const Ia = () => {
      if (!f.listening) return;
      const Z = hr("copy-listening", "Copy", () => f.listening || "", "tiny", () => b(c.snapshot()));
      Qn.push(...In(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", qe(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Ia(), f.listening && f.step !== "intro")
      if (f.linked)
        Qn.push(...In("Credited to", `${ft(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Ia();
      else if (f.solo) {
        f.creditedTo && Qn.push(...In("Credited to", `${ft(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ft(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Qn.push(...In("Returns go to", f.gift ? Z : f.returnTo && !kn(f.returnTo) ? Z.replace(qe(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Qn.push(...In("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((rp = f.gate) != null && rp.here)) {
      const Z = f.linkedListening.map((de) => qe(de) + (de === f.listening ? " (this one)" : "")).join(", ");
      Qn.push(...In(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Qn.push(...In("Balance", `${Fr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const Vo = f.entries.find((Z) => Z.kind === "play");
    Vo && $n(), Vo && Qn.push(...In("Last paid song", `${bo(Vo)} → ${ft(Vo.recipient)}`, $i[Vo.status] || "")), Bi.replaceChildren(...Qn), Bi.hidden = !Qn.length;
    const Ue = [], Et = [], Tt = [], Pn = [], Xo = Dn(BigInt(((op = f.gate) == null ? void 0 : op.limits.playFee) ?? "300")), qh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Fr(Ol)} STX to the song holder, plus a ${Fr(Xo - Ol)} STX network fee.`, Wh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Ue.push(C("p", "Pay artists as you listen.")), (sp = f.gate) != null && sp.radioUrl) {
          const de = C("p");
          de.append(Ke("Open the pay-per-play radio →", f.gate.radioUrl)), Ue.push(de);
        }
        Et.push(C("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const de = [f.linked, ...f.others];
          Ue.push(C("p", de.length > 1 ? `This device has listening wallets for ${wo(de)}.` : `This device has a listening wallet for ${ft(f.linked)}.`)), Et.push(C("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), de.slice(0, 3).forEach((Ge, St) => Tt.push($e(`Open ${ft(Ge)}`, () => Ns(Ge), St === 0 ? "primary" : "")));
        } else
          Ue.push(C("p", "Connect your wallet to pay artists as you listen.")), Et.push(C("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Ue.push(C("p", `This device's listening wallet belongs to ${ft(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Et.push(C("p", `You are connected as ${ft(f.main)}. Switch to the linked wallet to continue listening.`)), Et.push(C("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Tt.push($e("Switch wallet", xr, "primary"));
        break;
      case "not-invited":
        Ue.push(C("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Ue.push(C("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Ue.push(C("p", "Every play counts for the song’s owner, on-chain.")), Et.push(C("p", qh)), Et.push(C("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Et.push(C("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Ue.push(C("p", `This device already has a listening wallet for ${wo(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Et.push(C("p", `Otherwise, set up a new listening wallet for ${ft(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Et.push(C("p", `This is the listening wallet for ${ft(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Et.push(C("p", "Already have a Stacks wallet? Connect it first (the Connect button at the bottom of this page) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Tt.push($e(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ft(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Tt.push($e("Switch wallet", xr)), !Z && f.solo && Tt.push($e("I have a Stacks wallet", xr)), Tt.push($e("I already have a listening wallet", () => void c.unlock(!0))), Z && Tt.push($e("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Ue.push(C("p", "Locked.", "ppp-mute")), Tt.push($e("Unlock", () => void c.unlock(), "primary"))), f.standIn ? Pn.push($e("Use a different listening wallet", () => void Ii().then((de) => {
          de === "stacks" && xr();
        }), "quiet")) : Pn.push($e("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Ue.push(C("p", `Link to ${ft(f.main)} · free`)), Et.push(C("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Et.push(C("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Tt.push($e(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Ue.push(C("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Ue.push(Y(f.arrival)) : Ct(f) ? Ue.push(C("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (ip = f.gift) != null && ip.player ? Ue.push(C("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Ue.push(C("p", "No plays left · add plays to keep counting", "ppp-bad")) : Ue.push(C("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Xo)).toLocaleString()} plays`)), f.entries.length && Et.push(C("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && Et.push(C("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? Et.push(C("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Et.push(C("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Et.push(C("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Et.push(C("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Tt.push(hr("copy-address", "Copy my address", () => f.listening || "", "primary", () => b(c.snapshot())))) : Et.push(C("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const de = C("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          de.append(Ke("View", Nt(f.depositTxid))), Ue.push(de);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Tt.push(So(f, `Deposit ${Fr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Ue.push(C("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Ue.push(C("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Tt.push($e("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (Ue.push(C("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Ue.push(zo(f))), (!f.solo || f.returnTo) && Tt.push($e("Return excess", () => void c.returnFunds("excess"), "primary"), $e("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((ap = f.giftStop) == null ? void 0 : ap.reason) !== "off") {
          const de = Math.min(f.session.playsLeft, f.playsLeft);
          Ue.push(C("p", `${de.toLocaleString()} plays left`, "ppp-ok")), Et.push(C("p", qh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Tt.push($e("Switch off", () => void c.switchOff()));
        } else
          Ue.push(C("p", "Switch on music support to listen.", "ppp-mute")), Tt.push($e("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && Ue.push(C("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Ue.push(C("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Ue.push(C("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Ue.push(C("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Tt.push(So(f, `Top up ${Fr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", de = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Tt.unshift($e("Add plays", () => Ee(), "primary")) : de ? Tt.push($e("Add plays", () => Ee(), "primary")) : f.step === "ready" && Pn.push($e("Add plays", () => Ee(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && Et.push(C("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Et.push(zo(f)), Et.push(Us()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = C("p", "New to Stacks? ", "ppp-mute");
      Z.append(Ke("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Ue.push(Z);
    }
    if (f.walletOutdated && Et.push(C("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Ue.push(C("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Tt.push($e("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && Pn.push($e(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ft(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((cp = f.gift) != null && cp.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && Pn.push(G(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && Pn.push($e(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && Pn.push($e("Lock", () => void c.lock(), "quiet")), _t && !Ze && Pn.push($e(Wn ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Wn = !Wn, b(c.snapshot());
    }, "quiet")), [...Tt, ...Pn].forEach((Z) => Z.disabled = Wh), Wh && (Tt.length = 0), !zt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((lp = f.gift) != null && lp.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", de = Ue.at(0);
      f.step === "ready" && de ? de.append(C("span", ` · ${xt(f.balance)} STX`, Z)) : Ue.push(C("p", `Balance ${xt(f.balance)} STX`, Z));
    }
    if (zt) {
      for (const Ge of [...Tt, ...Pn]) {
        const St = gC[Ge.textContent ?? ""];
        St && (Ge.textContent = St);
      }
      for (let Ge = Ue.length - 1; Ge >= 0; Ge--) fy(Ue[Ge].textContent) && Et.unshift(...Ue.splice(Ge, 1));
      for (let Ge = Tt.length - 1; Ge >= 0; Ge--) fy(Tt[Ge].textContent) && Pn.unshift(...Tt.splice(Ge, 1));
      const Z = f.entries.some((Ge) => Ge.kind === "play"), de = mC(f.step, { played: Z, arriving: f.depositPending });
      de.length && Ue.length && de.shift(), Ue.push(...de.map((Ge) => C("p", Ge, "ppp-mute")));
    }
    if ((up = f.gift) != null && up.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = C("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const de = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? C("span", " · plays on their way", "ppp-warn") : C("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      de && Z.append(de);
      const Ge = (dp = Ue.at(0)) == null ? void 0 : dp.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Ge && /STX/.test(Ge.textContent ?? "") && Ge.remove(), Ue.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Ue.splice(1, 0, C("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), G(f, "primary"));
        else {
          const St = C("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          St.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), St.append(Ke("Xverse", "https://www.xverse.app/download"), " and ", Ke("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Ue.splice(1, 0, St);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, de = C("div", "", "ppp-pick");
      de.append(C("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ge = C("ul", "", "ppp-gift-list");
      Z.steps.forEach((St, Ur) => {
        const ir = St.kind === "gift" ? "the unused gift" : St.kind === "deposit" ? "what was added to it" : "the rest", Ln = C("li");
        Ln.append(C("span", `${Ur + 1}. ${Fr(BigInt(St.send))} STX · ${ir}`, "t"), C("span", St.to ? ` → ${ft(St.to)}` : " → choose an address below", St.to ? "ppp-mute" : "ppp-warn")), Ge.append(Ln);
      }), de.append(Ge), Z.kept && de.append(C("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((St) => !St.to) && de.append(zo(f)), de.append($e(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Ue.push(de);
    }
    const Yo = K(f), ko = X ? Yo : null, Mi = le(f, !!ko), i1 = Mi === "gift" || Mi === "arriving" || Mi === "new", Au = ko ? null : w.lines(l), Eu = Au && !w.claiming() ? Au : [...Au ?? [], ...v.banner(l, { bare: !!ko || Mi === "gift" || Mi === "arriving" })], mc = Mr && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Ts(Mr, v.pendingCode()) : [];
    ko || (Ue.unshift(...Eu), Ue.push(...Be(f)), Ue.unshift(...mc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Ue.unshift(C("p", `This is ${ft(f.creditedTo)}'s listening wallet. Plays and likes count for ${ft(f.creditedTo)}. Connect its Stacks wallet (the button at the bottom of this page) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Ue);
    const ku = document.querySelector(".ppp-switch");
    if (ku) {
      const Z = P.latest(), de = f.slot > 0, Ge = ["fund", "ready", "over"].includes(f.step) && (de || !!Z);
      if (ku.hidden = !Ge, Ge) {
        const St = (Ln, bc, xc, Bu) => {
          const Ui = $e("", Bu, "ppp-tab");
          return Ui.setAttribute("aria-pressed", String(xc)), Ui.append(C("span", Ln, "tt"), C("span", bc === void 0 ? "…" : `${dt(bc).toLocaleString()} plays`, "ts")), Ui.disabled = !!f.busy, Ui;
        }, Ur = de ? ((hp = (fp = f.gift) == null ? void 0 : fp.player) == null ? void 0 : hp.title) ?? "Album" : Z.title, ir = $e("View all albums" + (P.count() > 1 ? ` (${P.count()})` : ""), () => {
          if (M()) {
            window.dispatchEvent(new CustomEvent("xtrata:radio-browse", { detail: { tab: "albums" } }));
            return;
          }
          const Ln = document.querySelector(".ppp-shelf");
          Ln && (Ln.hidden = !1, Ln.open = !Ln.open, ir.setAttribute("aria-expanded", String(Ln.open)), Ln.open && requestAnimationFrame(() => Ln.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ir.setAttribute("aria-expanded", String(!!((pp = document.querySelector(".ppp-shelf")) != null && pp.open))), ku.replaceChildren(
          St("🎧 My player", de ? (gp = f.likeFunds) == null ? void 0 : gp.balance : f.balance, !de, () => {
            de && c.openAlbum(0);
          }),
          St("💿 " + Ur, de ? f.balance : void 0, de, () => {
            !de && Z && c.openAlbum(Z.slot);
          }),
          ir
        );
      }
    }
    const qo = P.render(f), Ni = document.querySelector(".ppp-shelf"), _i = M() ? document.getElementById("shelfBox") : null;
    if (_i)
      P.count() > 6 ? _i.dataset.many = "1" : delete _i.dataset.many, qo ? _i.firstChild !== qo && _i.replaceChildren(qo) : _i.replaceChildren(), Ni && (Ni.hidden = !0), U(!!qo);
    else if (Ni) {
      Ni.hidden = !qo;
      const Z = Ni.querySelector("summary");
      Z && (Z.textContent = P.count() > 0 ? `♪ My albums (${P.count()})` : "♪ My albums");
      const de = Ni.querySelector(".ppp-shelf-body");
      qo && de && !de.contains(qo) && de.replaceChildren(qo);
    }
    const La = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !La, La && !s(".ppp-gift-body").contains(La) && s(".ppp-gift-body").replaceChildren(La), La && Ho) {
      Ho = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const $u = document.querySelector("#ppp .ppp-featured");
    if ($u) {
      const Z = L(), de = m.manage(), Ge = (Z.length > 0 || !!de) && f.slot === 0 && !((yp = f.gift) != null && yp.player) && f.step === "ready";
      $u.hidden = !Ge, Ge && $u.replaceChildren(...Z.length ? [C("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((St) => {
        const Ur = (An == null ? void 0 : An.id) === St.id, ir = $e("", () => gn(Ur ? null : St, !Ur), "ppp-featured__a" + (Ur ? " is-on" : "")), Ln = Vr(St).length;
        return ir.append(C("b", St.title), C("span", Ur ? "Playing now · tap to go back to the radio" : `${St.subtitle ? St.subtitle + " · " : ""}${Ln} ${Ln === 1 ? "song" : "songs"}`)), ir.setAttribute("aria-pressed", String(Ur)), ir.disabled = !!f.busy, ir;
      }), ...de ? [de] : []);
    }
    const Iu = document.querySelector("#ppp .ppp-release-in-slot");
    if (Iu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : m.banner();
      Iu.hidden = !Z.length, Iu.replaceChildren(...Z);
    }
    const Pi = document.querySelector("#ppp .ppp-release");
    if (Pi) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : m.fold();
      if (Pi.hidden = !Z, Z) {
        const de = document.activeElement instanceof HTMLElement && Pi.contains(document.activeElement) ? document.activeElement : null, Ge = ((wp = Pi.querySelector(".ppp-release-songs")) == null ? void 0 : wp.scrollTop) ?? 0;
        (mp = Pi.querySelector(".ppp-release-body")) == null || mp.replaceChildren(...Z);
        const St = Pi.querySelector(".ppp-release-songs");
        St && Ge && (St.scrollTop = Ge), de && de.isConnected && document.activeElement !== de && de.focus({ preventScroll: !0 });
      }
    }
    _n(f);
    const Lu = document.querySelector("#ppp .ppp-yours");
    if (Lu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Lu.hidden = !Z;
      const de = Lu.querySelector(".ppp-yours-body");
      if (Z && de && de.getAttribute("data-for") !== f.listening) {
        de.setAttribute("data-for", f.listening);
        const Ge = (Bu, ...Ui) => {
          const bp = C("details", "", "ppp-yours-item");
          return bp.append(C("summary", Bu), ...Ui), bp;
        }, St = C("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        St.append(C("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Ur = C("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ir = C("p");
        ir.append(Ke("Find a name at BNS One →", "https://bns.one"));
        const Ln = C("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (the button at the bottom of this page) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), bc = C("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), xc = C("p");
        xc.append(Ke("See the giveaway →", "https://xtrata.xyz/giveaway")), de.replaceChildren(
          Ge("Give your player a name", St, Ur, C("p", f.listening, "ppp-addr-full"), hr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => b(c.snapshot())), ir),
          Ge("Link it to a wallet you already have", Ln),
          Ge("Bring a friend in", bc, xc)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Et), s(".ppp-actions").replaceChildren(...Tt), s(".ppp-actions2").replaceChildren(...Pn);
    const Cu = f.busy || f.message || "", Zh = s(".ppp-msg"), Tu = Cu && Ue.some((Z) => (Z.textContent ?? "").startsWith(Cu.replace(/[.✓\s]+$/, ""))) ? "" : Cu, Jh = !Tu && !f.error ? f.notice : j && !Tu ? f.error : "";
    Zh.textContent = Tu || Jh, Zh.classList.toggle("is-warn", !!Jh), s(".ppp-err").textContent = j ? "" : f.error;
    const a1 = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...a1.slice(0, 5).map((Z) => {
      const de = C("li"), Ge = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return de.append(C("span", "", "d " + Ge), C("span", bo(Z), "t"), C("span", gt(Z.created), "ppp-mute")), Z.txid && de.append(Ke("tx", Nt(Z.txid))), de;
    })), _r(f), s(".ppp-wallets").hidden = !(Bi.childElementCount || Pn.length), s(".ppp-more").hidden = !Et.length;
    const Qh = s(".ppp-history");
    Qh.hidden = !f.entries.length, f.entries.length && $n(), Qh.replaceChildren(C("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const de = C("div", "", "ppp-row"), Ge = Z.kind === "play" ? [C("span", bo(Z), "ppp-song"), C("span", ` · ${Fr(BigInt(Z.amount))} STX to ${ft(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [C("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${bo(Z)}`, "ppp-song"), C("span", ` · for ${f.linked ? ft(f.linked) : "this listening wallet"}`, "ppp-mute")] : [C("span", `Returned ${Fr(BigInt(Z.amount))} STX`, "ppp-song"), C("span", ` to ${ft(Z.recipient)}`, "ppp-mute")];
      return de.append(
        C("span", Bs[Z.status] || Z.status, "ppp-status " + ($i[Z.status] || "")),
        ...Ge,
        C("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && de.append(Ke("tx ↗", Nt(Z.txid))), de;
    })), q == null || q.render(ko ? Jr(f, ko, [...mc, ...Eu]) : null), De(f, !!ko, i1 ? [...mc, ...Eu] : mc, Mi), Nn(f, !!ko || !!(Lt != null && Lt.showing())), wc(f, ko), Fe.isOpen() && Fe.refresh(), Kh();
    const ep = (Yo == null ? void 0 : Yo.mode) === "open" ? null : jt(f);
    Ye == null || Ye.render((Yo == null ? void 0 : Yo.mode) === "open" ? Jr(f, Yo, []) : ep ? { ...Jr(f, { mode: "open", player: ep }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function M() {
    const l = document.documentElement;
    return l.hasAttribute("data-skin") && !l.hasAttribute("data-view") && !!document.getElementById("shelfBox");
  }
  function K(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Yn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = Rt();
    return g && (l.step === "locked" || pn && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const be = (l, p, g, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...j ? { b: j } : {}, p: String(f), s: gy(Ng, p, g) })}`;
  function Jt(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? F ? "making" : null : p.state === "claimed" ? F && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || ye || l.step === "link" && W !== "have" ? null : W === "making" || W === "yours" ? "ready" : W;
  }
  function Nn(l, p) {
    if (!_) return;
    const g = l.award, f = g != null && g.cls && Zc(g.cls) ? Xs(g.cls) : null, j = l.slot === 0 ? l.listening : l.root, se = p || !g || !f || !j || g.number === void 0 ? null : Jt(l);
    if (!se || !g || !f || !j) {
      _.render(null, p);
      return;
    }
    se === "have" && l.linked && !ce && (ce = !0, c.awardRefresh());
    const Se = typeof g.name == "string" && g.name ? g.name : null, pe = [];
    l.error && pe.push(C("p", l.error, "ppp-warn"));
    const Ze = (_t) => {
      W = _t, _t === "name" && (F = !0), b(c.snapshot());
    };
    _.render({
      screen: se,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: j,
      name: g.name,
      inscription: g.inscription,
      art: se === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : be(f, g.number, j, g.need ?? 0, Se),
      claimLink: g.claimTx ? Nt(g.claimTx) : void 0,
      status: pe,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ft(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => hr("award-player-address", "Copy my player’s address", () => j, "tiny", () => b(c.snapshot())),
      go: Ze,
      claim: (_t) => {
        F = !0, c.claimAward(_t);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var _t;
        return (_t = document.getElementById("radio-wallet-connect")) == null ? void 0 : _t.click();
      },
      link: () => void c.link(),
      later: () => {
        ye = !0;
        try {
          localStorage.setItem(N, String(Date.now()));
        } catch {
        }
        b(c.snapshot());
      },
      done: () => {
        F = !1, W = "ready", b(c.snapshot());
      }
    }, p);
  }
  function _r(l) {
    const p = document.querySelector("#ppp .ppp-paid");
    if (!p) return;
    const g = document.documentElement, f = l.entries.filter((pe) => pe.kind === "play" && !["failed", "cancelled"].includes(pe.status)), j = g.hasAttribute("data-skin") && !g.hasAttribute("data-view") && f.length > 0;
    if (Wt = j, p.hidden = !j, !j) {
      p.replaceChildren();
      return;
    }
    $n();
    const se = C("ol");
    for (const pe of f.slice(0, ct ? Br : Tr)) {
      const { title: Ze, artist: _t } = Do(pe.song, pe), ht = Ze || `Song #${pe.song}`, Xe = C("li", "", "ppp-paid__row"), Pe = C("span", "", "ppp-paid__art"), Ie = Gl(String(pe.song));
      if (Ie) {
        const zt = document.createElement("img");
        zt.src = Ie, zt.alt = "", zt.decoding = "async", Pe.append(zt);
      } else
        Pe.textContent = "♪", Pe.setAttribute("aria-hidden", "true");
      const $t = C("span", "", "ppp-paid__t");
      if ($t.append(C("b", ht), C("span", [_t, Ai(pe.created)].filter(Boolean).join(" · "))), Xe.append(Pe, $t), pe.status === "confirmed" && pe.txid) {
        const zt = Ke("Receipt", Nt(pe.txid));
        zt.className = "ppp-paid__r", zt.setAttribute("aria-label", `Receipt for ${ht}`), Xe.append(zt);
      } else Xe.append(C("span", pe.status === "unknown" ? "Checking…" : "Paying…", "ppp-paid__r ppp-mute"));
      se.append(Xe);
    }
    const Se = [C("h4", "Who you have paid"), se];
    if (f.length > Tr) {
      const pe = $e(ct ? "Show fewer" : `Show more (${Math.min(f.length, Br) - Tr})`, () => {
        ct = !ct, b(c.snapshot());
      }, "ppp-paid__more");
      Se.push(pe);
    }
    Se.push(C("p", "Every play pays the artist, and anyone can check it.", "ppp-paid__note")), p.replaceChildren(...Se);
  }
  function _n(l) {
    var Xe;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, j = g != null && g.cls && Zc(g.cls) ? Xs(g.cls) : null, se = !!g && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !se, !se || !g || !j || !f) {
      p.replaceChildren();
      return;
    }
    const Se = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Se) return;
    p.setAttribute("data-sig", Se);
    const pe = (Pe) => {
      const Ie = C("p", "", "ppp-award__h");
      return Ie.append(C("b", `${j.mark} Music Hero award`), C("span", Pe)), Ie;
    }, Ze = `No. ${String(g.number ?? 0).padStart(4, "0")}`, _t = (Pe) => {
      const Ie = C("div", "", "ppp-award__art"), $t = document.createElement("iframe");
      return $t.src = Pe, $t.title = `${j.name} record`, $t.setAttribute("sandbox", "allow-scripts"), $t.setAttribute("loading", "lazy"), Ie.append($t), Ie;
    }, ht = [];
    if (g.state === "claimed") {
      if (ht.push(pe(`${j.name} record · ${Ze}`)), g.inscription !== void 0 && ht.push(_t(`/i/${g.inscription}`)), ht.push(C("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${j.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Pe = C("p");
        Pe.append(Ke("Open it full screen ↗", `/i/${g.inscription}`)), ht.push(Pe);
      }
      if (g.sendTx) {
        const Pe = C("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Pe.append(Ke("View", Nt(g.sendTx))), ht.push(Pe);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Pe = C("details", "", "ppp-award__send"), Ie = document.createElement("input");
        Ie.type = "text", Ie.placeholder = "SP… address to send it to", Ie.autocomplete = "off", Ie.spellcheck = !1, Ie.setAttribute("aria-label", "Address to send your record to");
        const $t = $e("Send my record…", () => void c.sendAward(Ie.value), "");
        $t.disabled = !!l.busy, Pe.append(
          C("summary", "Send this record to someone"),
          C("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          Ie,
          $t
        ), ht.push(Pe);
      }
    } else if (g.claimTx) {
      ht.push(pe(`${j.name} record · ${Ze}`));
      const Pe = C("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Pe.append(Ke("View", Nt(g.claimTx))), ht.push(Pe);
    } else if (g.state === "ready") {
      ht.push(pe(`${j.name} record · ${Ze}`));
      const Pe = typeof g.name == "string" && g.name ? g.name : null, Ie = new URLSearchParams({ n: String(g.number), a: f, ...Pe ? { b: Pe } : {}, p: String(g.need), s: gy(Ng, g.number, f) });
      ht.push(_t(`/awards/${j.id}#${Ie}`)), ht.push(C("p", `Your ${j.name} record is ready. You have paid artists for ${(Xe = g.need) == null ? void 0 : Xe.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const $t = C("div", "", "ppp-award__row");
      Pe ? (ht.push(C("p", `Its plaque will carry ${Pe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), $t.append($e("Claim my record", () => {
        F = !0, c.claimAward("auto");
      }, "primary"), $e("Use my address only", () => {
        F = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (ht.push(C("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), $t.append($e("Claim my record", () => {
        F = !0, c.claimAward("none");
      }, "primary"), $e("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ht.push(C("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), $t.append($e("Check for a name again", () => void c.awardRefresh(), "primary"), $e("Claim with my address only", () => void c.claimAward("none"), "quiet"))), $t.querySelectorAll("button").forEach((zt) => {
        zt.disabled = !!l.busy;
      }), ht.push($t, C("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      ht.push(pe(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Pe = C("div", "", "ppp-award__bar"), Ie = document.createElement("i");
      Ie.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Pe.append(Ie);
      const $t = g.need - g.have;
      ht.push(Pe, C("p", `${$t.toLocaleString()} more ${$t === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      ht.push(pe(`${j.name} record · ${Ze}`)), ht.push(C("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...ht);
  }
  function wc(l, p) {
    var pe;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (_ != null && _.showing()) && ((pe = l.award) != null && pe.cls) && Zc(l.award.cls) && (l.busy || l.armed)) {
      const Ze = Xs(l.award.cls), _t = C("span", "", "ppp-skin__t");
      _t.append(C("b", `${Ze.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), C("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(C("span", Ze.mark, "ppp-skin__art ppp-skin__art--none"), _t);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const j = dl(p.player.cover), se = j ? C("img", "", "ppp-skin__art") : C("span", "♪", "ppp-skin__art ppp-skin__art--none");
    j && (se.src = j, se.alt = "");
    const Se = C("span", "", "ppp-skin__t");
    Se.append(C("b", p.player.title), C("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(se, Se);
  }
  function Jr(l, p, g) {
    var Ze, _t, ht, Xe, Pe;
    const f = !!l.busy || l.armed, j = [...g];
    l.depositPending && l.arrival && j.push(Y(l.arrival)), l.error ? j.push(C("p", l.error, l.error === Fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push(C("p", l.message, "ppp-cyan")) : l.notice && j.push(C("p", l.notice, "ppp-warn")), p.mode === "open" && Le && ((Ze = l.likeFunds) != null && Ze.album) && l.likeFunds.low && !l.likeFunds.pending && j.push(C("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let se = "Kept on this device with Face ID or your passkey. No app or account needed.", Se = null, pe = null;
    if (p.mode === "locked")
      Se = { label: "Continue listening", run: () => {
        pn = Rt(), c.unlock();
      } }, pe = { label: "Use a different passkey", run: () => {
        pn = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && tl(je) && je.album === p.player.id) {
        const Ie = window.XtrataRadio, $t = Vr(p.player)[0], zt = je.phase === "playing";
        Se = { label: zt && !!((ht = (_t = Ie == null ? void 0 : Ie.getState) == null ? void 0 : _t.call(Ie)) != null && ht.playing) ? "Pause" : zt ? "Carry on" : "Play the first song", run: () => {
          var Ko, Eo;
          zt ? (Ko = Ie == null ? void 0 : Ie.playPause) == null || Ko.call(Ie) : $t && ((Eo = Ie == null ? void 0 : Ie.playToken) == null || Eo.call(Ie, $t.id));
        } }, pe = { label: "Make my player and hear it all", run: () => void c.create() }, se = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const Ie = je.phase === "done" && je.album === p.player.id;
        Ie && !j.length && j.push(C("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Se = { label: Ie ? "Keep listening" : "Open album", run: () => void c.create() }, pe = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Se = { label: "Open album", run: () => void c.unlock() }, pe = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push(C("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push(C("p", "Opening your album…", "ppp-cyan"));
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
      secondary: pe,
      hint: Se ? se : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: te(l),
      topUps: ul,
      canMake: !!((Pe = (Xe = l.gate) == null ? void 0 : Xe.gifts) != null && Pe.admin)
    };
  }
  const Pr = document.getElementById("findBox"), $a = document.getElementById("findBody"), Go = Pr && $a ? UC($a, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => MC(l == null ? void 0 : l.tracks, (p, g) => ({ title: Gg(p, ki(g.title) ? "" : g.title), artist: Rg(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, j;
      const l = Number((j = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : j.tokenId);
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
    liked: (l) => Os().has(l),
    grid: document.documentElement.hasAttribute("data-skin"),
    // the new look lists artist names three across
    // ...and draws them in their own section of Browse, under the listener's albums
    artistsMount: document.documentElement.hasAttribute("data-skin") && document.getElementById("artistBox") || void 0,
    leaveAlbum: () => S(0)
  }) : null;
  Pr == null || Pr.addEventListener("toggle", () => {
    Pr.open && (Go == null || Go.load());
  });
  let Ti = "";
  const Os = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, Kh = () => {
    var p, g, f, j, se;
    if (!Go || !(Pr != null && Pr.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((se = (j = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : j.nowPlaying) == null ? void 0 : se.tokenId) ?? ""}|${[...Os()].sort((Se, pe) => Se - pe).join(",")}`;
    l !== Ti && (Ti = l, Go.refresh());
  }, vu = /* @__PURE__ */ new Map();
  let Vh = !1;
  const Xh = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && vu.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), Kh(), wt) {
        const f = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Me && (Me = f, b(c.snapshot()));
      }
      if (tl(je)) {
        const f = !!(p != null && p.playing);
        Zr({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== Vh && (Vh = f, b(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Xh()) {
    const l = setInterval(() => {
      Xh() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (tl(je) && Zr({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      $n();
      const g = Do(p.song, vu.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const YC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", qC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, WC = () => qC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, ZC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, JC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', s1 = class {
  constructor(e) {
    t$(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && SA(e), this.callback(iu(e));
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
    const e = WC(), t = ZC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Je("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Je("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Je("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Je("div", { class: "flex flex-col space-y-[10px]" }, Je("div", { class: "flex items-center" }, Je("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Je("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Je("span", { class: "sr-only" }, "Close popup"), Je("img", { src: YC }))), r ? Je("p", null, "Select the wallet you want to connect to.") : Je("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Je("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Je("div", { class: "mt-6" }, Je("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Je("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Je("div", { class: "aspect-square basis-9 overflow-hidden" }, Je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Je("div", { class: "flex-1" }, Je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Je("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Je("div", { class: "mt-6" }, r ? Je("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Je("div", { class: "mb-5 flex justify-between" }, Je("p", { class: "text-sm font-medium" }, "Recommended wallets"), Je("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Je("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Je("p", null, "What is a wallet? ", Je("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Je("ul", { class: "space-y-3" }, n.map((o) => Je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Je("div", { class: "aspect-square basis-9 overflow-hidden" }, Je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Je("div", { class: "flex-1" }, Je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Je("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return U4(this);
  }
};
s1.style = JC;
const QC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: s1
}, Symbol.toStringTag, { value: "Module" }));
