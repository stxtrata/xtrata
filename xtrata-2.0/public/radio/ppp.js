var a1 = Object.defineProperty;
var c1 = (e, t, n) => t in e ? a1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ta = (e, t, n) => c1(e, typeof t != "symbol" ? t + "" : t, n);
var qn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function yy(e) {
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
      typeof qn < "u" && qn || {}, r = {
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
        var L = new FileReader(), _ = w(L), M = /charset=([A-Za-z0-9_-]+)/.exec(m.type), W = M ? M[1] : "utf-8";
        return L.readAsText(m, W), _;
      }
      function S(m) {
        for (var L = new Uint8Array(m), _ = new Array(L.length), M = 0; M < L.length; M++)
          _[M] = String.fromCharCode(L[M]);
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
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
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
            var M = _.split("="), W = M.shift().replace(/\+/g, " "), F = M.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(W), decodeURIComponent(F));
          }
        }), L;
      }
      function X(m) {
        var L = new h(), _ = m.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var W = M.split(":"), F = W.shift().trim();
          if (F) {
            var we = W.join(":").trim();
            try {
              L.append(F, we);
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
          var M = Error(L);
          this.stack = M.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function q(m, L) {
        return new Promise(function(_, M) {
          var W = new T(m, L);
          if (W.signal && W.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function we() {
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
              M(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              M(new t.DOMException("Aborted", "AbortError"));
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
            var Ke = [];
            Object.getOwnPropertyNames(L.headers).forEach(function($) {
              Ke.push(a($)), F.setRequestHeader($, c(L.headers[$]));
            }), W.headers.forEach(function($, R) {
              Ke.indexOf(R) === -1 && F.setRequestHeader(R, $);
            });
          } else
            W.headers.forEach(function($, R) {
              F.setRequestHeader(R, $);
            });
          W.signal && (W.signal.addEventListener("abort", we), F.onreadystatechange = function() {
            F.readyState === 4 && W.signal.removeEventListener("abort", we);
          }), F.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = T, n.Response = Q), t.Headers = h, t.Request = T, t.Response = Q, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : qn);
})();
const l1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function u1(e, t) {
  const n = {};
  return Object.assign(n, l1, t), await fetch(e, n);
}
function d1(e) {
  let t = u1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function f1(...e) {
  const { fetchLib: t, middlewares: n } = d1(e);
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
var Qi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Qi || (Qi = {}));
var Qs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qs || (Qs = {}));
var bp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(bp || (bp = {}));
const h1 = "https://api.mainnet.hiro.so", p1 = "https://api.testnet.hiro.so", g1 = "http://localhost:3999", y1 = ["mainnet", "testnet", "devnet", "mocknet"];
let ea = class {
  constructor(t) {
    this.version = Qs.Mainnet, this.chainId = Qi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Qs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? f1();
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
ea.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new wd();
    case "testnet":
      return new w1();
    case "devnet":
      return new m1();
    case "mocknet":
      return new wy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${y1.join(", ")}`);
  }
};
ea.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ea.fromName(e);
let wd = class extends ea {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? h1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Qs.Mainnet, this.chainId = Qi.Mainnet;
  }
}, w1 = class extends ea {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? p1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Qs.Testnet, this.chainId = Qi.Testnet;
  }
}, wy = class extends ea {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? g1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Qs.Testnet, this.chainId = Qi.Testnet;
  }
};
const m1 = wy, my = "xtrata.wallet.bridge.v1", b1 = (e) => typeof e == "object" && e !== null && e.protocol === my, x1 = (e) => b1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", S1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class Ba extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const xp = 12e4;
class v1 {
  constructor(t) {
    Ta(this, "pending", /* @__PURE__ */ new Map());
    Ta(this, "listenTarget");
    Ta(this, "closed", !1);
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
    Ta(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !x1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new Ba("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new Ba("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ba("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = S1(), o = { protocol: my, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ba(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? xp}ms.`
          )
        );
      }, this.options.timeoutMs ?? xp);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new Ba("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const A1 = ["SP", "SM"], E1 = ["ST", "SN"], k1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return A1.includes(n) ? "mainnet" : E1.includes(n) ? "testnet" : null;
}, $1 = () => {
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
}, I1 = () => typeof window > "u" || !window.localStorage ? $1() : window.localStorage, Mu = "xtrata.v15.1.wallet.session", Sp = "mainnet", hl = { isConnected: !1 }, L1 = (e) => e.address ? k1(e.address) ?? e.network : e.network, by = (e) => !e.isConnected || !e.address ? { ...hl } : L1(e) !== Sp ? { ...hl } : {
  isConnected: !0,
  address: e.address,
  network: Sp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, C1 = (e) => {
  if (!e)
    return { ...hl };
  try {
    const t = JSON.parse(e);
    return by(t);
  } catch {
    return { ...hl };
  }
}, T1 = (e) => {
  const t = by(e);
  return JSON.stringify(t);
}, B1 = (e) => {
  const t = I1();
  return {
    load: () => C1(t.getItem(Mu)),
    save: (n) => {
      t.setItem(Mu, T1(n));
    },
    clear: () => {
      t.removeItem(Mu);
    }
  };
}, M1 = "https://browser.blockstack.org/auth", N1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, xy = ["store_write"], _1 = "blockstack-session", P1 = {
  logLevel: "debug"
}, gi = {
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
Object.freeze(gi);
class wa extends Error {
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
class U1 extends wa {
  constructor(t, n = "") {
    super({ code: gi.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class vp extends wa {
  constructor(t = "") {
    super({ code: gi.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Sc extends wa {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: gi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ap extends wa {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: gi.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class md extends wa {
  constructor(t) {
    super({ code: gi.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Sy extends wa {
  constructor(t) {
    super({ code: gi.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Ep = ["debug", "info", "warn", "error", "none"], bd = {};
for (let e = 0; e < Ep.length; e++) {
  const t = Ep[e];
  bd[t] = e;
}
class Gi {
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
    return bd[P1.logLevel] <= bd[t];
  }
}
function O1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function H1() {
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
function D1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function F1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function j1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function If(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = F1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    Gi.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = j1(s, e.toString(), n);
    throw Gi.error(o), new Error(o);
  }
  if (r)
    return {};
}
function $s(e, t) {
  return Lf(Rn(e), t);
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
  if (rr(e, Uint8Array))
    return BigInt(`0x${He(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function R1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function kp(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function lc(e, t = 8) {
  return (typeof e == "bigint" ? e : Rn(e)).toString(16).padStart(t * 2, "0");
}
function Yl(e) {
  return parseInt(e, 16);
}
function Lf(e, t = 16) {
  const n = lc(e, t);
  return At(n);
}
function z1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function G1(e, t) {
  return e & BigInt(1) << t;
}
function xd(e) {
  return K1(BigInt(`0x${He(e)}`), BigInt(e.byteLength * 8));
}
function K1(e, t) {
  return G1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const V1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function He(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += V1[n];
  return t;
}
function At(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = R1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function yi(e) {
  return new TextEncoder().encode(e);
}
function uc(e) {
  return new TextDecoder().decode(e);
}
function X1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Y1(e) {
  return String.fromCharCode.apply(null, e);
}
function q1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function $p(e) {
  if (e.some(q1))
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
function cn(e) {
  return uo(...e.map((t) => typeof t == "number" ? $p([t]) : t instanceof Array ? $p(t) : t));
}
function rr(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const vy = "https://api.mainnet.hiro.so", Ay = "https://api.testnet.hiro.so", Ey = "http://localhost:3999", W1 = "https://hub.blockstack.org", Z1 = 33, _u = 32;
function J1(e) {
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
  const t = typeof e == "string" ? At(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Q1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function e2(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function t2(e, t) {
  return e[t];
}
function n2(e, t, n = 0) {
  return e[n] = t, e;
}
function r2(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function ei(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const o2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function s2(e, t) {
  const n = {};
  return Object.assign(n, o2, t), await fetch(e, n);
}
function i2(e) {
  let t = s2, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function a2(...e) {
  const { fetchLib: t, middlewares: n } = i2(e);
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
class ky {
  constructor(t = xy.slice(), n = ((a) => (a = If("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = M1) {
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
function c2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function $y(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function l2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sd(e.outputLen), Sd(e.blockLen);
}
function u2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function d2(e, t) {
  $y(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: Sd,
  bool: c2,
  bytes: $y,
  hash: l2,
  exists: u2,
  output: d2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Qr = (e, t) => e << 32 - t | e >>> t, f2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!f2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function h2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Tf(e) {
  if (typeof e == "string" && (e = h2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Iy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wi(e) {
  const t = (r) => e().update(Tf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ly = class extends Iy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, zs.hash(t);
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
const ql = (e, t, n) => new Ly(e, t).update(n).digest();
ql.create = (e, t) => new Ly(e, t);
function p2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Bf = class extends Iy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Pu(this.buffer);
  }
  update(t) {
    zs.exists(this);
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
    zs.exists(this), zs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    p2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const g2 = (e, t, n) => e & t ^ ~e & n, y2 = (e, t, n) => e & t ^ e & n ^ t & n, w2 = new Uint32Array([
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
]), qo = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wo = new Uint32Array(64);
let Cy = class extends Bf {
  constructor() {
    super(64, 32, 8, !1), this.A = qo[0] | 0, this.B = qo[1] | 0, this.C = qo[2] | 0, this.D = qo[3] | 0, this.E = qo[4] | 0, this.F = qo[5] | 0, this.G = qo[6] | 0, this.H = qo[7] | 0;
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
      Wo[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Wo[d - 15], y = Wo[d - 2], v = Qr(w, 7) ^ Qr(w, 18) ^ w >>> 3, S = Qr(y, 17) ^ Qr(y, 19) ^ y >>> 10;
      Wo[d] = S + Wo[d - 7] + v + Wo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Qr(a, 6) ^ Qr(a, 11) ^ Qr(a, 25), y = h + w + g2(a, c, u) + w2[d] + Wo[d] | 0, S = (Qr(r, 2) ^ Qr(r, 13) ^ Qr(r, 22)) + y2(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Wo.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, m2 = class extends Cy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ta = wi(() => new Cy());
wi(() => new m2());
const b2 = {}, Ty = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: b2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const mt = BigInt(0), Vt = BigInt(1), Ss = BigInt(2), za = BigInt(3), Ip = BigInt(8), Ut = Object.freeze({
  a: mt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Vt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Lp = (e, t) => (e + t / Ss) / t, vc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Ut, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Vt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Lp(o * e, t), c = Lp(-r * e, t);
    let u = he(e - a * n - c * s, t), h = he(-a * r - c * o, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, Gr = 32, ti = 32, By = 32, pl = Gr + 1, gl = 2 * Gr + 1;
function Cp(e) {
  const { a: t, b: n } = Ut, r = he(e * e), s = he(r * e);
  return he(s + t * e + n);
}
const Ac = Ut.a === mt;
class Mf extends Error {
  constructor(t) {
    super(t);
  }
}
function Tp(e) {
  if (!(e instanceof Lt))
    throw new TypeError("JacobianPoint expected");
}
class Lt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? Lt.ZERO : new Lt(t.x, t.y, Vt);
  }
  static toAffineBatch(t) {
    const n = E2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return Lt.toAffineBatch(t).map(Lt.fromAffine);
  }
  equals(t) {
    Tp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c);
    return h === d && w === y;
  }
  negate() {
    return new Lt(this.x, he(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = he(t * t), o = he(n * n), i = he(o * o), a = t + o, c = he(Ss * (he(a * a) - s - i)), u = he(za * s), h = he(u * u), d = he(h - Ss * c), w = he(u * (c - d) - Ip * i), y = he(Ss * n * r);
    return new Lt(d, w, y);
  }
  add(t) {
    Tp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === mt || i === mt)
      return this;
    if (n === mt || r === mt)
      return t;
    const c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c), v = he(d - h), S = he(y - w);
    if (v === mt)
      return S === mt ? this.double() : Lt.ZERO;
    const I = he(v * v), U = he(v * I), P = he(h * I), A = he(S * S - U - Ss * P), T = he(S * (P - A) - w * U), B = he(s * a * v);
    return new Lt(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = Lt.ZERO;
    if (typeof t == "bigint" && t === mt)
      return n;
    let r = Np(t);
    if (r === Vt)
      return this;
    if (!Ac) {
      let d = n, w = this;
      for (; r > mt; )
        r & Vt && (d = d.add(w)), w = w.double(), r >>= Vt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = vc.splitScalar(r), c = n, u = n, h = this;
    for (; o > mt || a > mt; )
      o & Vt && (c = c.add(h)), a & Vt && (u = u.add(h)), h = h.double(), o >>= Vt, a >>= Vt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new Lt(he(u.x * vc.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(Lt.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && vd.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Lt.normalizeZ(s), vd.set(n, s)));
    let o = Lt.ZERO, i = Lt.BASE;
    const a = 1 + (Ac ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Vt);
      const S = y, I = y + Math.abs(v) - 1, U = w % 2 !== 0, P = v < 0;
      v === 0 ? i = i.add(Ec(U, s[S])) : o = o.add(Ec(P, s[I]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = Np(t), s, o;
    if (Ac) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = vc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(u, n);
      h = Ec(i, h), w = Ec(c, w), w = new Lt(he(w.x * vc.beta), w.y, w.z), s = h.add(w), o = d.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Lt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(Lt.ZERO);
    t == null && (t = o ? Ip : ma(s));
    const i = t, a = he(i * i), c = he(a * i), u = he(n * a), h = he(r * c), d = he(s * i);
    if (o)
      return at.ZERO;
    if (d !== Vt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
Lt.BASE = new Lt(Ut.Gx, Ut.Gy, Vt);
Lt.ZERO = new Lt(mt, Vt, mt);
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
    return this.y % Ss === mt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = wr(n ? t : t.subarray(1));
    if (!nl(r))
      throw new Error("Point is not on curve");
    const s = Cp(r);
    let o = A2(s);
    const i = (o & Vt) === Vt;
    n ? i && (o = he(-o)) : (t[0] & 1) === 1 !== i && (o = he(-o));
    const a = new at(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = wr(t.subarray(1, Gr + 1)), r = wr(t.subarray(Gr + 1, Gr * 2 + 1)), s = new at(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = fo(t), r = n.length, s = n[0];
    if (r === Gr)
      return this.fromCompressedHex(n);
    if (r === pl && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === gl && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pl} compressed bytes or ${gl} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(ni(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = _y(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Nf(fo(t)), { n: a } = Ut, c = r === 2 || r === 3 ? s + a : s, u = ma(c, a), h = he(-i * u, a), d = he(o * u, a), w = r & 1 ? "03" : "02", y = at.fromHex(w + vs(c)), v = at.BASE.multiplyAndAddUnsafe(y, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return As(this.toHex(t));
  }
  toHex(t = !1) {
    const n = vs(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${vs(this.y)}`;
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
    const s = he(r * r), o = Cp(n);
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
    return Lt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return Lt.fromAffine(this).add(Lt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return Lt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = Lt.fromAffine(this), o = n === mt || n === Vt || this !== at.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Lt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Lt.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(Ut.Gx, Ut.Gy);
at.ZERO = new at(mt, mt);
function Bp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Mp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${na(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: wr(n), left: e.subarray(t + 2) };
}
function x2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${na(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Mp(e.subarray(2)), { data: r, left: s } = Mp(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${na(s)}`);
  return { r: t, s: r };
}
class yr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? na(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new yr(yl(s.slice(0, 64)), yl(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = x2(n ? t : As(t));
    return new yr(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!oa(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!oa(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Ut.n >> Vt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new yr(this.r, he(-this.s, Ut.n)) : this;
  }
  toDERRawBytes() {
    return As(this.toDERHex());
  }
  toDERHex() {
    const t = Bp(Ma(this.s)), n = Bp(Ma(this.r)), r = t.length / 2, s = n.length / 2, o = Ma(r), i = Ma(s);
    return `30${Ma(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return As(this.toCompactHex());
  }
  toCompactHex() {
    return vs(this.r) + vs(this.s);
  }
}
function bs(...e) {
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
const S2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function na(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += S2[e[n]];
  return t;
}
const v2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function vs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(mt <= e && e < v2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function ra(e) {
  const t = As(vs(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Ma(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function yl(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function As(e) {
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
function wr(e) {
  return yl(na(e));
}
function fo(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : As(e);
}
function Np(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && oa(e))
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
function A2(e) {
  const { P: t } = Ut, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = Ar(u, za) * u % t, d = Ar(h, za) * u % t, w = Ar(d, Ss) * c % t, y = Ar(w, r) * w % t, v = Ar(y, s) * y % t, S = Ar(v, i) * v % t, I = Ar(S, a) * S % t, U = Ar(I, i) * v % t, P = Ar(U, za) * u % t, A = Ar(P, o) * y % t, T = Ar(A, n) * c % t, B = Ar(T, Ss);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function ma(e, t = Ut.P) {
  if (e === mt || t <= mt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = he(e, t), r = t, s = mt, o = Vt;
  for (; n !== mt; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Vt)
    throw new Error("invert: does not exist");
  return he(s, t);
}
function E2(e, t = Ut.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === mt ? o : (n[a] = o, he(o * i, t)), Vt), s = ma(r, t);
  return e.reduceRight((o, i, a) => i === mt ? o : (n[a] = he(o * n[a], t), he(o * i, t)), s), n;
}
function k2(e) {
  const t = e.length * 8 - ti * 8, n = wr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Nf(e, t = !1) {
  const n = k2(e);
  if (t)
    return n;
  const { n: r } = Ut;
  return n >= r ? n - r : n;
}
let Zi, Ga;
class My {
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
    return Ga(this.k, ...t);
  }
  checkSync() {
    if (typeof Ga != "function")
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
    return bs(...n);
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
    return bs(...n);
  }
}
function oa(e) {
  return mt < e && e < Ut.n;
}
function nl(e) {
  return mt < e && e < Ut.P;
}
function Ny(e, t, n, r = !0) {
  const { n: s } = Ut, o = Nf(e, !0);
  if (!oa(o))
    return;
  const i = ma(o, s), a = at.BASE.multiply(o), c = he(a.x, s);
  if (c === mt)
    return;
  const u = he(i * he(t + n * c, s), s);
  if (u === mt)
    return;
  let h = new yr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Vt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function ni(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * ti)
      throw new Error("Expected 32 bytes of private key");
    t = yl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== ti)
      throw new Error("Expected 32 bytes of private key");
    t = wr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!oa(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function _f(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function _y(e) {
  if (e instanceof yr)
    return e.assertValidity(), e;
  try {
    return yr.fromDER(e);
  } catch {
    return yr.fromCompact(e);
  }
}
function dc(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function $2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function _p(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === pl || r === gl : n ? r === pl * 2 || r === gl * 2 : e instanceof at;
}
function Pf(e, t, n = !1) {
  if (_p(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!_p(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = _f(t);
  return r.assertValidity(), r.multiply(ni(e)).toRawBytes(n);
}
function Py(e) {
  const t = e.length > Gr ? e.slice(0, Gr) : e;
  return wr(t);
}
function I2(e) {
  const t = Py(e), n = he(t, Ut.n);
  return Uy(n < mt ? t : n);
}
function Uy(e) {
  return ra(e);
}
function Oy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = fo(e), s = ni(t), o = [Uy(s), I2(r)];
  if (n != null) {
    n === !0 && (n = rn.randomBytes(Gr));
    const c = fo(n);
    if (c.length !== Gr)
      throw new Error(`sign: Expected ${Gr} bytes of extra data`);
    o.push(c);
  }
  const i = bs(...o), a = Py(r);
  return { seed: i, m: a, d: s };
}
function Hy(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function L2(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Oy(e, t, n.extraEntropy), i = new My(By, ti);
  await i.reseed(r);
  let a;
  for (; !(a = Ny(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Hy(a, n);
}
function Wl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Oy(e, t, n.extraEntropy), i = new My(By, ti);
  i.reseedSync(r);
  let a;
  for (; !(a = Ny(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Hy(a, n);
}
const C2 = { strict: !0 };
function T2(e, t, n, r = C2) {
  let s;
  try {
    s = _y(e), t = fo(t);
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
  const { n: u } = Ut, h = ma(i, u), d = he(a * h, u), w = he(o * h, u), y = at.BASE.multiplyAndAddUnsafe(c, d, w);
  return y ? he(y.x, u) === o : !1;
}
function wl(e) {
  return he(wr(e), Ut.n);
}
class sa {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = fo(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = wr(n.subarray(0, 32)), s = wr(n.subarray(32, 64));
    return new sa(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!nl(t) || !oa(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return vs(this.r) + vs(this.s);
  }
  toRawBytes() {
    return As(this.toHex());
  }
}
function B2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class Dy {
  constructor(t, n, r = rn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = fo(t);
    const { x: s, scalar: o } = this.getScalar(ni(n));
    if (this.px = s, this.d = o, this.rand = fo(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : Ut.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return ra(t ^ wr(n));
  }
  finalizeNonce(t) {
    const n = he(wr(t), Ut.n);
    if (n === mt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new sa(t.x, he(n + r * s, Ut.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHash, i = this.initNonce(n, await o(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(ms.nonce, i, r, t)), h = wl(await o(ms.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Ry(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHashSync, i = this.initNonce(n, o(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(ms.nonce, i, r, t)), h = wl(o(ms.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return zy(d, t, r) || this.error(), d;
  }
}
async function M2(e, t, n) {
  return new Dy(e, t, n).calc();
}
function N2(e, t, n) {
  return new Dy(e, t, n).calcSync();
}
function Fy(e, t, n) {
  const r = e instanceof sa, s = r ? e : sa.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: fo(t),
    P: _f(n)
  };
}
function jy(e, t, n, r) {
  const s = at.BASE.multiplyAndAddUnsafe(t, ni(n), he(-r, Ut.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Ry(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Fy(e, t, n), a = wl(await rn.taggedHash(ms.challenge, ra(r), i.toRawX(), o));
    return jy(r, i, s, a);
  } catch {
    return !1;
  }
}
function zy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Fy(e, t, n), a = wl(rn.taggedHashSync(ms.challenge, ra(r), i.toRawX(), o));
    return jy(r, i, s, a);
  } catch (r) {
    if (r instanceof Mf)
      throw r;
    return !1;
  }
}
const _2 = {
  Signature: sa,
  getPublicKey: B2,
  sign: M2,
  verify: Ry,
  signSync: N2,
  verifySync: zy
};
at.BASE._setWindowSize(8);
const cr = {
  node: Ty,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ms = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, kc = {}, rn = {
  bytesToHex: na,
  hexToBytes: As,
  concatBytes: bs,
  mod: he,
  invert: ma,
  isValidPrivateKey(e) {
    try {
      return ni(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ra,
  _normalizePrivateKey: ni,
  hashToPrivateKey: (e) => {
    e = fo(e);
    const t = ti + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = he(wr(e), Ut.n - Vt) + Vt;
    return ra(n);
  },
  randomBytes: (e = 32) => {
    if (cr.web)
      return cr.web.getRandomValues(new Uint8Array(e));
    if (cr.node) {
      const { randomBytes: t } = cr.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => rn.hashToPrivateKey(rn.randomBytes(ti + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(za), n;
  },
  sha256: async (...e) => {
    if (cr.web) {
      const t = await cr.web.subtle.digest("SHA-256", bs(...e));
      return new Uint8Array(t);
    } else if (cr.node) {
      const { createHash: t } = cr.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (cr.web) {
      const n = await cr.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = bs(...t), s = await cr.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (cr.node) {
      const { createHmac: n } = cr.node, r = n("sha256", e);
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
      n = bs(r, r), kc[e] = n;
    }
    return rn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Zi != "function")
      throw new Mf("sha256Sync is undefined, you need to set it");
    let n = kc[e];
    if (n === void 0) {
      const r = Zi(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = bs(r, r), kc[e] = n;
    }
    return Zi(n, ...t);
  },
  _JacobianPoint: Lt
};
Object.defineProperties(rn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Zi;
    },
    set(e) {
      Zi || (Zi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ga;
    },
    set(e) {
      Ga || (Ga = e);
    }
  }
});
const P2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ut,
  Point: at,
  Signature: yr,
  getPublicKey: dc,
  getSharedSecret: Pf,
  recoverPublicKey: $2,
  schnorr: _2,
  sign: L2,
  signSync: Wl,
  utils: rn,
  verify: T2
}, Symbol.toStringTag, { value: "Module" }));
var fc = {};
fc.byteLength = F2;
var U2 = fc.toByteArray = R2, O2 = fc.fromByteArray = K2, oo = [], kr = [], H2 = typeof Uint8Array < "u" ? Uint8Array : Array, Uu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ui = 0, D2 = Uu.length; Ui < D2; ++Ui)
  oo[Ui] = Uu[Ui], kr[Uu.charCodeAt(Ui)] = Ui;
kr[45] = 62;
kr[95] = 63;
function Gy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function F2(e) {
  var t = Gy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function j2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function R2(e) {
  var t, n = Gy(e), r = n[0], s = n[1], o = new H2(j2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = kr[e.charCodeAt(c)] << 18 | kr[e.charCodeAt(c + 1)] << 12 | kr[e.charCodeAt(c + 2)] << 6 | kr[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = kr[e.charCodeAt(c)] << 2 | kr[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = kr[e.charCodeAt(c)] << 10 | kr[e.charCodeAt(c + 1)] << 4 | kr[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function z2(e) {
  return oo[e >> 18 & 63] + oo[e >> 12 & 63] + oo[e >> 6 & 63] + oo[e & 63];
}
function G2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(z2(r));
  return s.join("");
}
function K2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(G2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    oo[t >> 2] + oo[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    oo[t >> 10] + oo[t >> 4 & 63] + oo[t << 2 & 63] + "="
  )), s.join("");
}
function V2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const X2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Y2() {
  if (V2())
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
    throw new Error(X2);
  }
}
class q2 {
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
class W2 {
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
async function Ky() {
  const e = await Y2();
  return e.name === "subtleCrypto" ? new W2(e.lib) : new q2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function Z2(e) {
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
    for (var oe = new Uint8Array(S + (U - Q)), q = S; Q !== U; )
      oe[q++] = P[Q++];
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
var Vy = Z2;
const J2 = Vy, Q2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var ex = J2(Q2);
const tx = /* @__PURE__ */ yy(ex), nx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xy = Uint8Array.from({ length: 16 }, (e, t) => t), rx = Xy.map((e) => (9 * e + 5) % 16);
let Uf = [Xy], Of = [rx];
for (let e = 0; e < 4; e++)
  for (let t of [Uf, Of])
    t.push(t[e].map((n) => nx[n]));
const Yy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), ox = Uf.map((e, t) => e.map((n) => Yy[t][n])), sx = Of.map((e, t) => e.map((n) => Yy[t][n])), ix = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ax = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $c = (e, t) => e << t | e >>> 32 - t;
function Pp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ic = new Uint32Array(16);
let cx = class extends Bf {
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
      const v = 4 - y, S = ix[y], I = ax[y], U = Uf[y], P = Of[y], A = ox[y], T = sx[y];
      for (let B = 0; B < 16; B++) {
        const X = $c(r + Pp(y, o, a, u) + Ic[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = $c(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = $c(s + Pp(v, i, c, h) + Ic[P[B]] + I, T[B]) + w | 0;
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
const lx = wi(() => new cx());
function ux(e) {
  return lx(e);
}
const Lc = BigInt(2 ** 32 - 1), Ad = BigInt(32);
function qy(e, t = !1) {
  return t ? { h: Number(e & Lc), l: Number(e >> Ad & Lc) } : { h: Number(e >> Ad & Lc) | 0, l: Number(e & Lc) | 0 };
}
function dx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = qy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const fx = (e, t) => BigInt(e >>> 0) << Ad | BigInt(t >>> 0), hx = (e, t, n) => e >>> n, px = (e, t, n) => e << 32 - n | t >>> n, gx = (e, t, n) => e >>> n | t << 32 - n, yx = (e, t, n) => e << 32 - n | t >>> n, wx = (e, t, n) => e << 64 - n | t >>> n - 32, mx = (e, t, n) => e >>> n - 32 | t << 64 - n, bx = (e, t) => t, xx = (e, t) => e, Sx = (e, t, n) => e << n | t >>> 32 - n, vx = (e, t, n) => t << n | e >>> 32 - n, Ax = (e, t, n) => t << n - 32 | e >>> 64 - n, Ex = (e, t, n) => e << n - 32 | t >>> 64 - n;
function kx(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $x = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Ix = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Lx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Cx = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Tx = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Bx = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: qy,
  split: dx,
  toBig: fx,
  shrSH: hx,
  shrSL: px,
  rotrSH: gx,
  rotrSL: yx,
  rotrBH: wx,
  rotrBL: mx,
  rotr32H: bx,
  rotr32L: xx,
  rotlSH: Sx,
  rotlSL: vx,
  rotlBH: Ax,
  rotlBL: Ex,
  add: kx,
  add3L: $x,
  add3H: Ix,
  add4L: Lx,
  add4H: Cx,
  add5H: Bx,
  add5L: Tx
}, [Mx, Nx] = et.split([
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
].map((e) => BigInt(e))), Zo = new Uint32Array(80), Jo = new Uint32Array(80);
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
      Zo[A] = t.getUint32(n), Jo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Zo[A - 15] | 0, B = Jo[A - 15] | 0, X = et.rotrSH(T, B, 1) ^ et.rotrSH(T, B, 8) ^ et.shrSH(T, B, 7), Q = et.rotrSL(T, B, 1) ^ et.rotrSL(T, B, 8) ^ et.shrSL(T, B, 7), oe = Zo[A - 2] | 0, q = Jo[A - 2] | 0, m = et.rotrSH(oe, q, 19) ^ et.rotrBH(oe, q, 61) ^ et.shrSH(oe, q, 6), L = et.rotrSL(oe, q, 19) ^ et.rotrBL(oe, q, 61) ^ et.shrSL(oe, q, 6), _ = et.add4L(Q, L, Jo[A - 7], Jo[A - 16]), M = et.add4H(_, X, m, Zo[A - 7], Zo[A - 16]);
      Zo[A] = M | 0, Jo[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), B = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = et.add5L(P, B, Q, Nx[A], Jo[A]), q = et.add5H(oe, U, T, X, Mx[A], Zo[A]), m = oe | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), _ = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = et.add3L(m, _, W);
      r = et.add3H(F, q, L, M), s = F | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = et.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = et.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = et.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = et.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    Zo.fill(0), Jo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _x = class extends Zl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Px = class extends Zl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ux = class extends Zl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Ox = wi(() => new Zl());
wi(() => new _x());
wi(() => new Px());
wi(() => new Ux());
function Wy(e) {
  return ta(e);
}
function Hx(e) {
  return Ox(e);
}
const Dx = 0;
rn.hmacSha256Sync = (e, ...t) => {
  const n = ql.create(ta, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Fx() {
  return He(rn.randomPrivateKey());
}
function jx(e) {
  const t = ta(ta(e));
  return tx.encode(uo(e, t).slice(0, e.length + 4));
}
function Rx(e, t) {
  return jx(uo(new Uint8Array([e]), t.slice(0, 20)));
}
function Zy(e, t = Dx) {
  const n = typeof e == "string" ? At(e) : e, r = ux(Wy(n));
  return Rx(t, r);
}
function Jy(e) {
  const t = Cf(e);
  return He(dc(t.slice(0, 32), !0));
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = ql.create(ta, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var ml;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(ml || (ml = {}));
async function zx(e, t, n) {
  return await (await Ky()).encrypt("aes-256-cbc", t, e, n);
}
async function Gx(e, t, n) {
  return await (await Ky()).decrypt("aes-256-cbc", t, e, n);
}
function Qy(e, t) {
  return ql(ta, e, t);
}
function Kx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function ew(e) {
  const t = Hx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Vx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Xx(e) {
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
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Vx(e))
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
async function Yx(e, t, n, r) {
  const s = Xx(e);
  if (!s.result)
    throw s;
  const o = rn.randomPrivateKey(), i = dc(o, !0);
  let a = Pf(o, e, !0);
  a = a.slice(1);
  const c = ew(a), u = rn.randomBytes(16), h = await zx(u, c.encryptionKey, t), d = uo(u, i, h), w = Qy(c.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = He(h);
  else if (r === "base64")
    y = O2(h);
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
async function tw(e, t) {
  if (!t.ephemeralPK)
    throw new Ap("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Pf(e, n, !0);
  r = r.slice(1);
  const s = ew(r), o = At(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = At(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = U2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = uo(o, At(n), i), c = Qy(s.hmacKey, a), u = At(t.mac);
  if (!Kx(u, c))
    throw new Ap("Decryption failed: failure in MAC check");
  const h = await Gx(o, s.encryptionKey, i);
  return t.wasString ? uc(h) : h;
}
function qx(e, t) {
  const n = typeof t == "string" ? yi(t) : t, r = Jy(e), s = Wy(n), o = Wl(s, e);
  return {
    signature: He(o),
    publicKey: r
  };
}
async function Wx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Jy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? yi(e) : e, i = await Yx(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = qx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Zx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return tw(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Tn = {}, ia = {}, Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.decode = Xn.encode = Xn.unescape = Xn.escape = Xn.pad = void 0;
const nw = fc;
function Hf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Xn.pad = Hf;
function rw(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Xn.escape = rw;
function ow(e) {
  return Hf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Xn.unescape = ow;
function Jx(e) {
  return rw((0, nw.fromByteArray)(new TextEncoder().encode(e)));
}
Xn.encode = Jx;
function Qx(e) {
  return new TextDecoder().decode((0, nw.toByteArray)(Hf(ow(e))));
}
Xn.decode = Qx;
var Jl = {}, Ql = {}, sw = {}, iw = {}, eu = {};
Object.defineProperty(eu, "__esModule", { value: !0 });
eu.crypto = void 0;
eu.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = S, e.bytesToHex = P, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = oe, e.bytesToUtf8 = q, e.toBytes = m, e.kdfInputToBytes = L, e.concatBytes = _, e.checkOpts = M, e.createHasher = F, e.createOptHasher = we, e.createXOFer = ce, e.randomBytes = Ke;
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
    const be = new Uint8Array(ue);
    for (let _e = 0, Ae = 0; _e < ue; _e++, Ae += 2) {
      const yt = T($.charCodeAt(Ae)), je = T($.charCodeAt(Ae + 1));
      if (yt === void 0 || je === void 0) {
        const Ne = $[Ae] + $[Ae + 1];
        throw new Error('hex string expected, got non-hex character "' + Ne + '" at index ' + Ae);
      }
      be[_e] = yt * 16 + je;
    }
    return be;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function Q($, R, ue) {
    let be = Date.now();
    for (let _e = 0; _e < $; _e++) {
      ue(_e);
      const Ae = Date.now() - be;
      Ae >= 0 && Ae < R || (await (0, e.nextTick)(), be += Ae);
    }
  }
  function oe($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function q($) {
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
    for (let be = 0; be < $.length; be++) {
      const _e = $[be];
      s(_e), R += _e.length;
    }
    const ue = new Uint8Array(R);
    for (let be = 0, _e = 0; be < $.length; be++) {
      const Ae = $[be];
      ue.set(Ae, _e), _e += Ae.length;
    }
    return ue;
  }
  function M($, R) {
    if (R !== void 0 && {}.toString.call(R) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, R);
  }
  class W {
  }
  e.Hash = W;
  function F($) {
    const R = (be) => $().update(m(be)).digest(), ue = $();
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = () => $(), R;
  }
  function we($) {
    const R = (be, _e) => $(_e).update(m(be)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (be) => $(be), R;
  }
  function ce($) {
    const R = (be, _e) => $(_e).update(m(be)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (be) => $(be), R;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = we, e.wrapXOFConstructorWithOpts = ce;
  function Ke($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(iw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = iw;
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
})(sw);
const Oi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function aw(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function mi(e, ...t) {
  if (!aw(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function eS(e) {
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
function cw(e, t) {
  mi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function tS(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function nS(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function bl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function rl(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Ur(e, t) {
  return e << 32 - t | e >>> t;
}
function rS(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Df = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ff(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const lw = Df ? (e) => e : (e) => Ff(e), oS = lw;
function uw(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Ff(e[t]);
  return e;
}
const sS = Df ? (e) => e : uw, dw = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", iS = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function jf(e) {
  if (mi(e), dw)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += iS[e[n]];
  return t;
}
const ko = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Up(e) {
  if (e >= ko._0 && e <= ko._9)
    return e - ko._0;
  if (e >= ko.A && e <= ko.F)
    return e - (ko.A - 10);
  if (e >= ko.a && e <= ko.f)
    return e - (ko.a - 10);
}
function aS(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (dw)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Up(e.charCodeAt(o)), a = Up(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const fw = async () => {
};
async function cS(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await fw(), r += o);
  }
}
function Rf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function lS(e) {
  return new TextDecoder().decode(e);
}
function hc(e) {
  return typeof e == "string" && (e = Rf(e)), mi(e), e;
}
function uS(e) {
  return typeof e == "string" && (e = Rf(e)), mi(e), e;
}
function dS(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    mi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function fS(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let hw = class {
};
function tu(e) {
  const t = (r) => e().update(hc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function pw(e) {
  const t = (r, s) => e(s).update(hc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function gw(e) {
  const t = (r, s) => e(s).update(hc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const hS = tu, pS = pw, gS = gw;
function yS(e = 32) {
  if (Oi && typeof Oi.getRandomValues == "function")
    return Oi.getRandomValues(new Uint8Array(e));
  if (Oi && typeof Oi.randomBytes == "function")
    return Uint8Array.from(Oi.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const wS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: hw,
  abytes: mi,
  aexists: kd,
  ahash: eS,
  anumber: Ed,
  aoutput: cw,
  asyncLoop: cS,
  byteSwap: Ff,
  byteSwap32: uw,
  byteSwapIfBE: oS,
  bytesToHex: jf,
  bytesToUtf8: lS,
  checkOpts: fS,
  clean: bl,
  concatBytes: dS,
  createHasher: tu,
  createOptHasher: pw,
  createView: rl,
  createXOFer: gw,
  hexToBytes: aS,
  isBytes: aw,
  isLE: Df,
  kdfInputToBytes: uS,
  nextTick: fw,
  randomBytes: yS,
  rotl: rS,
  rotr: Ur,
  swap32IfBE: sS,
  swap8IfBE: lw,
  toBytes: hc,
  u32: nS,
  u8: tS,
  utf8ToBytes: Rf,
  wrapConstructor: hS,
  wrapConstructorWithOpts: pS,
  wrapXOFConstructorWithOpts: gS
}, Symbol.toStringTag, { value: "Module" }));
function mS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function bS(e, t, n) {
  return e & t ^ ~e & n;
}
function xS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class SS extends hw {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = rl(this.buffer);
  }
  update(t) {
    kd(this), t = hc(t), mi(t);
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
    kd(this), cw(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, bl(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    mS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const Qo = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), es = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), vS = /* @__PURE__ */ Uint32Array.from([
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
let zf = class extends SS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Qo[0] | 0, this.B = Qo[1] | 0, this.C = Qo[2] | 0, this.D = Qo[3] | 0, this.E = Qo[4] | 0, this.F = Qo[5] | 0, this.G = Qo[6] | 0, this.H = Qo[7] | 0;
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
      ts[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ts[d - 15], y = ts[d - 2], v = Ur(w, 7) ^ Ur(w, 18) ^ w >>> 3, S = Ur(y, 17) ^ Ur(y, 19) ^ y >>> 10;
      ts[d] = S + ts[d - 7] + v + ts[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Ur(a, 6) ^ Ur(a, 11) ^ Ur(a, 25), y = h + w + bS(a, c, u) + vS[d] + ts[d] | 0, S = (Ur(r, 2) ^ Ur(r, 13) ^ Ur(r, 22)) + xS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    bl(ts);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bl(this.buffer);
  }
}, yw = class extends zf {
  constructor() {
    super(28), this.A = es[0] | 0, this.B = es[1] | 0, this.C = es[2] | 0, this.D = es[3] | 0, this.E = es[4] | 0, this.F = es[5] | 0, this.G = es[6] | 0, this.H = es[7] | 0;
  }
};
const AS = /* @__PURE__ */ tu(() => new zf()), ES = /* @__PURE__ */ tu(() => new yw()), kS = zf, Gf = AS, $S = yw, IS = ES, LS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: $S,
  SHA256: kS,
  sha224: IS,
  sha256: Gf
}, Symbol.toStringTag, { value: "Module" })), nu = /* @__PURE__ */ Xl(LS), CS = /* @__PURE__ */ Xl(P2);
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.joseToDer = aa.derToJose = void 0;
const ww = fc, mw = Xn;
function Ou(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const TS = {
  ES256: Ou(256),
  ES384: Ou(384),
  ES512: Ou(521)
};
function bw(e) {
  const t = TS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const xl = 128, xw = 0, BS = 32, MS = 16, NS = 2, Sw = MS | BS | xw << 6, Sl = NS | xw << 6;
function vw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, ww.toByteArray)((0, mw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function _S(e, t) {
  const n = vw(e), r = bw(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Sw)
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
  return v.set(n.subarray(d + Math.max(-y, 0), d + h), i), (0, mw.escape)((0, ww.fromByteArray)(v));
}
aa.derToJose = _S;
function Op(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= xl && --r, r;
}
function PS(e, t) {
  e = vw(e);
  const n = bw(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Op(e, 0, n), o = Op(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < xl, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = Sw, u ? h[d++] = c : (h[d++] = xl | 1, h[d++] = c & 255), h[d++] = Sl, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = Sl, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
aa.joseToDer = PS;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
_o.InvalidTokenError = _o.MissingParametersError = void 0;
class US extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
_o.MissingParametersError = US;
class OS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
_o.InvalidTokenError = OS;
const pc = /* @__PURE__ */ Xl(wS);
Object.defineProperty(Ql, "__esModule", { value: !0 });
Ql.SECP256K1Client = void 0;
const HS = sw, DS = nu, ol = CS, Hp = aa, Dp = _o, Fp = pc;
ol.utils.hmacSha256Sync = (e, ...t) => {
  const n = HS.hmac.create(DS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Aw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Fp.bytesToHex)(ol.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Dp.MissingParametersError("a signing input hash and private key are all required");
    const s = ol.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Fp.bytesToHex)(s);
    if (r === "jose")
      return (0, Hp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Hp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Dp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ol.verify(n, t, r, { strict: !1 });
  }
}
Ql.SECP256K1Client = Aw;
Aw.algorithmName = "ES256K";
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
var ri = {};
const FS = /* @__PURE__ */ Xl(Ty);
var jS = qn && qn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.hashSha256Async = ri.hashSha256 = void 0;
const RS = nu;
function Ew(e) {
  return (0, RS.sha256)(e);
}
ri.hashSha256 = Ew;
function zS(e) {
  return jS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = FS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ew(e));
    }
  });
}
ri.hashSha256Async = zS;
var GS = qn && qn.__awaiter || function(e, t, n, r) {
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
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.TokenSigner = ia.createUnsecuredToken = void 0;
const $d = Xn, jp = Jl, KS = _o, Rp = ri;
function Id(e, t) {
  const n = [], r = $d.encode(JSON.stringify(t));
  n.push(r);
  const s = $d.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function VS(e) {
  return Id(e, { typ: "JWT", alg: "none" }) + ".";
}
ia.createUnsecuredToken = VS;
class XS {
  constructor(t, n) {
    if (!(t && n))
      throw new KS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !jp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = jp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Id(t, s), i = (0, Rp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return GS(this, void 0, void 0, function* () {
      const s = this.header(r), o = Id(t, s), i = yield (0, Rp.hashSha256Async)(o);
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
ia.TokenSigner = XS;
var ru = {};
Object.defineProperty(ru, "__esModule", { value: !0 });
ru.TokenVerifier = void 0;
const YS = Xn, zp = Jl, qS = _o, Cc = ri;
class WS {
  constructor(t, n) {
    if (!(t && n))
      throw new qS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !zp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = zp.cryptoClients[t], this.rawPublicKey = n;
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
    const r = [t.header.join("."), YS.encode(t.payload)].join(".");
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
ru.TokenVerifier = WS;
var ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
ou.decodeToken = void 0;
const Tc = Xn;
function ZS(e) {
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
ou.decodeToken = ZS;
(function(e) {
  var t = qn && qn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = qn && qn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(ia, e), n(ru, e), n(ou, e), n(_o, e), n(Jl, e);
})(Tn);
function JS(e) {
  return `did:btc-addr:${e}`;
}
function QS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new vp("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new vp('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function kw(e) {
  if (e)
    return QS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const ev = "1.4.0";
function tv() {
  return Fx();
}
function nv(e, t, n, r = xy.slice(), s, o = O1().getTime(), i = {}) {
  const a = (y) => {
    const v = If("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: D1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: ev,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Tn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = Zy(u);
  return c.iss = JS(h), new Tn.TokenSigner("ES256k", e).sign(c);
}
async function Gp(e, t) {
  const n = uc(At(t)), r = JSON.parse(n), s = await tw(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function rv(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Tn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function ov(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = kw(t.iss);
  if (n.length === 1) {
    if (Zy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function sv(e) {
  const t = Tn.decodeToken(e).payload;
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
function iv(e) {
  const t = Tn.decodeToken(e).payload;
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
function av(e) {
  const t = [
    iv(e),
    sv(e),
    rv(e),
    ov(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Kp = "1.0.0";
class Es {
  constructor(t) {
    this.version = Kp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Kp)
      throw new md(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Es(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class $w {
  constructor(t) {
    if (t) {
      const n = new Es(t);
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
class Vp extends $w {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Es({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Sy("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Es({})), !0;
  }
}
class Xp extends $w {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = _1, !localStorage.getItem(this.key)) {
      const r = new Es({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Sy("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Es.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Es({})), !0;
  }
}
var Za;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Za || (Za = {}));
var vl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(vl || (vl = {}));
Za.Mainnet;
var Mo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Mo || (Mo = {}));
var ao;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ao || (ao = {}));
Mo.Mainnet;
const Iw = {
  chainId: Za.Mainnet,
  transactionVersion: Mo.Mainnet,
  peerNetworkId: vl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ao.MainnetSingleSig,
    multiSig: ao.MainnetMultiSig
  },
  client: { baseUrl: vy }
}, Ld = {
  chainId: Za.Testnet,
  transactionVersion: Mo.Testnet,
  peerNetworkId: vl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ao.TestnetSingleSig,
    multiSig: ao.TestnetMultiSig
  },
  client: { baseUrl: Ay }
}, sl = {
  ...Ld,
  addressVersion: { ...Ld.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Ey }
}, cv = {
  ...sl,
  addressVersion: { ...sl.addressVersion },
  client: { ...sl.client }
};
function lv(e) {
  switch (e) {
    case "mainnet":
      return Iw;
    case "testnet":
      return Ld;
    case "devnet":
      return sl;
    case "mocknet":
      return cv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Lw(e) {
  return typeof e == "string" ? lv(e) : e;
}
var Yp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Yp || (Yp = {}));
var qp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(qp || (qp = {}));
var Or;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Or || (Or = {}));
const Hu = ["onChainOnly", "offChainOnly", "any"];
Hu[0] + "", Or.OnChainOnly, Hu[1] + "", Or.OffChainOnly, Hu[2] + "", Or.Any, Or.OnChainOnly + "", Or.OnChainOnly, Or.OffChainOnly + "", Or.OffChainOnly, Or.Any + "", Or.Any;
var Wp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Wp || (Wp = {}));
var Zp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Jp || (Jp = {}));
var To;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(To || (To = {}));
var Qp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Qp || (Qp = {}));
var e0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(e0 || (e0 = {}));
var t0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(r0 || (r0 = {}));
var o0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(o0 || (o0 = {}));
var s0;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(s0 || (s0 = {}));
var i0;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(i0 || (i0 = {}));
var a0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(a0 || (a0 = {}));
function Cd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function uv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Cw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function dv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cd(e.outputLen), Cd(e.blockLen);
}
function fv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function hv(e, t) {
  Cw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: Cd,
  bool: uv,
  bytes: Cw,
  hash: dv,
  exists: fv,
  output: hv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Du = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), eo = (e, t) => e << 32 - t | e >>> t, pv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!pv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function gv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Kf(e) {
  if (typeof e == "string" && (e = gv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Tw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bi(e) {
  const t = (r) => e().update(Kf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Bw = class extends Tw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Gs.hash(t);
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
const Mw = (e, t, n) => new Bw(e, t).update(n).digest();
Mw.create = (e, t) => new Bw(e, t);
function yv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Vf = class extends Tw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Du(this.buffer);
  }
  update(t) {
    Gs.exists(this);
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
    Gs.exists(this), Gs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    yv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const wv = (e, t, n) => e & t ^ ~e & n, mv = (e, t, n) => e & t ^ e & n ^ t & n, bv = new Uint32Array([
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
]), ns = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rs = new Uint32Array(64);
let Nw = class extends Vf {
  constructor() {
    super(64, 32, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
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
      rs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = rs[d - 15], y = rs[d - 2], v = eo(w, 7) ^ eo(w, 18) ^ w >>> 3, S = eo(y, 17) ^ eo(y, 19) ^ y >>> 10;
      rs[d] = S + rs[d - 7] + v + rs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = eo(a, 6) ^ eo(a, 11) ^ eo(a, 25), y = h + w + wv(a, c, u) + bv[d] + rs[d] | 0, S = (eo(r, 2) ^ eo(r, 13) ^ eo(r, 22)) + mv(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, xv = class extends Nw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const _w = bi(() => new Nw());
bi(() => new xv());
var xi = {}, Xf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = pc;
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
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.c32checkDecode = oi.c32checkEncode = void 0;
const c0 = nu, l0 = pc, Ka = Xf;
function Pw(e) {
  const t = (0, c0.sha256)((0, c0.sha256)((0, l0.hexToBytes)(e)));
  return (0, l0.bytesToHex)(t.slice(0, 4));
}
function Sv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Pw(`${n}${t}`), s = (0, Ka.c32encode)(`${t}${r}`);
  return `${Ka.c32[e]}${s}`;
}
oi.c32checkEncode = Sv;
function vv(e) {
  e = (0, Ka.c32normalize)(e);
  const t = (0, Ka.c32decode)(e.slice(1)), n = e[0], r = Ka.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Pw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
oi.c32checkDecode = vv;
var Uw = {}, ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.decode = ca.encode = void 0;
const Al = nu, u0 = pc, Ow = Vy, Hw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Av(e, t = "00") {
  const n = typeof e == "string" ? (0, u0.hexToBytes)(e) : e, r = typeof t == "string" ? (0, u0.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Al.sha256)((0, Al.sha256)(new Uint8Array([...r, ...n])));
  return Ow(Hw).encode([...r, ...n, ...s.slice(0, 4)]);
}
ca.encode = Av;
function Ev(e) {
  const t = Ow(Hw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Al.sha256)((0, Al.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ca.decode = Ev;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = oi, n = ca, r = pc;
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
})(Uw);
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
  const n = oi;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Uw;
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
})(xi);
function kv(e, t) {
  switch (t = Lw(t ?? Iw), e) {
    case To.P2PKH:
      switch (t.transactionVersion) {
        case Mo.Mainnet:
          return ao.MainnetSingleSig;
        case Mo.Testnet:
          return ao.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case To.P2SH:
    case To.P2SHNonSequential:
    case To.P2WPKH:
    case To.P2WSH:
    case To.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Mo.Mainnet:
          return ao.MainnetMultiSig;
        case Mo.Testnet:
          return ao.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const $v = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dw = Uint8Array.from({ length: 16 }, (e, t) => t), Iv = Dw.map((e) => (9 * e + 5) % 16);
let Yf = [Dw], qf = [Iv];
for (let e = 0; e < 4; e++)
  for (let t of [Yf, qf])
    t.push(t[e].map((n) => $v[n]));
const Fw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), Lv = Yf.map((e, t) => e.map((n) => Fw[t][n])), Cv = qf.map((e, t) => e.map((n) => Fw[t][n])), Tv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Bv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Bc = (e, t) => e << t | e >>> 32 - t;
function d0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Mc = new Uint32Array(16);
let Mv = class extends Vf {
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
      const v = 4 - y, S = Tv[y], I = Bv[y], U = Yf[y], P = qf[y], A = Lv[y], T = Cv[y];
      for (let B = 0; B < 16; B++) {
        const X = Bc(r + d0(y, o, a, u) + Mc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Bc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Bc(s + d0(v, i, c, h) + Mc[P[B]] + I, T[B]) + w | 0;
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
const Nv = bi(() => new Mv()), Nc = BigInt(2 ** 32 - 1), Td = BigInt(32);
function jw(e, t = !1) {
  return t ? { h: Number(e & Nc), l: Number(e >> Td & Nc) } : { h: Number(e >> Td & Nc) | 0, l: Number(e & Nc) | 0 };
}
function _v(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = jw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Pv = (e, t) => BigInt(e >>> 0) << Td | BigInt(t >>> 0), Uv = (e, t, n) => e >>> n, Ov = (e, t, n) => e << 32 - n | t >>> n, Hv = (e, t, n) => e >>> n | t << 32 - n, Dv = (e, t, n) => e << 32 - n | t >>> n, Fv = (e, t, n) => e << 64 - n | t >>> n - 32, jv = (e, t, n) => e >>> n - 32 | t << 64 - n, Rv = (e, t) => t, zv = (e, t) => e, Gv = (e, t, n) => e << n | t >>> 32 - n, Kv = (e, t, n) => t << n | e >>> 32 - n, Vv = (e, t, n) => t << n - 32 | e >>> 64 - n, Xv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Yv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const qv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Wv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Zv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Jv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Qv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), eA = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: jw,
  split: _v,
  toBig: Pv,
  shrSH: Uv,
  shrSL: Ov,
  rotrSH: Hv,
  rotrSL: Dv,
  rotrBH: Fv,
  rotrBL: jv,
  rotr32H: Rv,
  rotr32L: zv,
  rotlSH: Gv,
  rotlSL: Kv,
  rotlBH: Vv,
  rotlBL: Xv,
  add: Yv,
  add3L: qv,
  add3H: Wv,
  add4L: Zv,
  add4H: Jv,
  add5H: eA,
  add5L: Qv
}, [tA, nA] = tt.split([
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
].map((e) => BigInt(e))), os = new Uint32Array(80), ss = new Uint32Array(80);
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
      os[A] = t.getUint32(n), ss[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = os[A - 15] | 0, B = ss[A - 15] | 0, X = tt.rotrSH(T, B, 1) ^ tt.rotrSH(T, B, 8) ^ tt.shrSH(T, B, 7), Q = tt.rotrSL(T, B, 1) ^ tt.rotrSL(T, B, 8) ^ tt.shrSL(T, B, 7), oe = os[A - 2] | 0, q = ss[A - 2] | 0, m = tt.rotrSH(oe, q, 19) ^ tt.rotrBH(oe, q, 61) ^ tt.shrSH(oe, q, 6), L = tt.rotrSL(oe, q, 19) ^ tt.rotrBL(oe, q, 61) ^ tt.shrSL(oe, q, 6), _ = tt.add4L(Q, L, ss[A - 7], ss[A - 16]), M = tt.add4H(_, X, m, os[A - 7], os[A - 16]);
      os[A] = M | 0, ss[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), B = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = tt.add5L(P, B, Q, nA[A], ss[A]), q = tt.add5H(oe, U, T, X, tA[A], os[A]), m = oe | 0, L = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), _ = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = tt.add3L(m, _, W);
      r = tt.add3H(F, q, L, M), s = F | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = tt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = tt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = tt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = tt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    os.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, rA = class extends su {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, oA = class extends su {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sA = class extends su {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new su());
bi(() => new rA());
bi(() => new oA());
bi(() => new sA());
var El = { exports: {} };
El.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", S = "[object Promise]", I = "[object RegExp]", U = "[object Set]", P = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", X = "[object DataView]", Q = "[object Float32Array]", oe = "[object Float64Array]", q = "[object Int8Array]", m = "[object Int16Array]", L = "[object Int32Array]", _ = "[object Uint8Array]", M = "[object Uint8ClampedArray]", W = "[object Uint16Array]", F = "[object Uint32Array]", we = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Ke = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[B] = R[X] = R[a] = R[c] = R[Q] = R[oe] = R[q] = R[m] = R[L] = R[w] = R[y] = R[v] = R[I] = R[U] = R[P] = R[A] = R[_] = R[M] = R[W] = R[F] = !0, R[u] = R[h] = R[T] = !1;
  var ue = typeof qn == "object" && qn && qn.Object === Object && qn, be = typeof self == "object" && self && self.Object === Object && self, _e = ue || be || Function("return this")(), Ae = t && !t.nodeType && t, yt = Ae && !0 && e && !e.nodeType && e, je = yt && yt.exports === Ae;
  function Ne(x, N) {
    return x.set(N[0], N[1]), x;
  }
  function Pe(x, N) {
    return x.add(N), x;
  }
  function Bn(x, N) {
    for (var K = -1, Se = x ? x.length : 0; ++K < Se && N(x[K], K, x) !== !1; )
      ;
    return x;
  }
  function En(x, N) {
    for (var K = -1, Se = N.length, Jt = x.length; ++K < Se; )
      x[Jt + K] = N[K];
    return x;
  }
  function pt(x, N, K, Se) {
    for (var Jt = -1, Pn = x ? x.length : 0; ++Jt < Pn; )
      K = N(K, x[Jt], Jt, x);
    return K;
  }
  function Bt(x, N) {
    for (var K = -1, Se = Array(x); ++K < x; )
      Se[K] = N(K);
    return Se;
  }
  function Ot(x, N) {
    return x == null ? void 0 : x[N];
  }
  function z(x) {
    var N = !1;
    if (x != null && typeof x.toString != "function")
      try {
        N = !!(x + "");
      } catch {
      }
    return N;
  }
  function O(x) {
    var N = -1, K = Array(x.size);
    return x.forEach(function(Se, Jt) {
      K[++N] = [Jt, Se];
    }), K;
  }
  function ee(x, N) {
    return function(K) {
      return x(N(K));
    };
  }
  function re(x) {
    var N = -1, K = Array(x.size);
    return x.forEach(function(Se) {
      K[++N] = Se;
    }), K;
  }
  var le = Array.prototype, bt = Function.prototype, De = Object.prototype, Ge = _e["__core-js_shared__"], Et = function() {
    var x = /[^.]+$/.exec(Ge && Ge.keys && Ge.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), Fe = bt.toString, Le = De.hasOwnProperty, qe = De.toString, Xe = RegExp(
    "^" + Fe.call(Le).replace(we, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), We = je ? _e.Buffer : void 0, zt = _e.Symbol, gn = _e.Uint8Array, dn = ee(Object.getPrototypeOf, Object), Zn = Object.create, Ht = De.propertyIsEnumerable, yn = le.splice, xr = Object.getOwnPropertySymbols, qr = We ? We.isBuffer : void 0, zn = ee(Object.keys, Object), Sr = Mr(_e, "DataView"), wn = Mr(_e, "Map"), jt = Mr(_e, "Promise"), ut = Mr(_e, "Set"), Mt = Mr(_e, "WeakMap"), un = Mr(Object, "create"), Cr = Gn(Sr), yo = Gn(wn), E = Gn(jt), H = Gn(ut), V = Gn(Mt), D = zt ? zt.prototype : void 0, J = D ? D.valueOf : void 0;
  function te(x) {
    var N = -1, K = x ? x.length : 0;
    for (this.clear(); ++N < K; ) {
      var Se = x[N];
      this.set(Se[0], Se[1]);
    }
  }
  function Te() {
    this.__data__ = un ? un(null) : {};
  }
  function ke(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function Re(x) {
    var N = this.__data__;
    if (un) {
      var K = N[x];
      return K === r ? void 0 : K;
    }
    return Le.call(N, x) ? N[x] : void 0;
  }
  function xt(x) {
    var N = this.__data__;
    return un ? N[x] !== void 0 : Le.call(N, x);
  }
  function Qe(x, N) {
    var K = this.__data__;
    return K[x] = un && N === void 0 ? r : N, this;
  }
  te.prototype.clear = Te, te.prototype.delete = ke, te.prototype.get = Re, te.prototype.has = xt, te.prototype.set = Qe;
  function dt(x) {
    var N = -1, K = x ? x.length : 0;
    for (this.clear(); ++N < K; ) {
      var Se = x[N];
      this.set(Se[0], Se[1]);
    }
  }
  function kt() {
    this.__data__ = [];
  }
  function Ye(x) {
    var N = this.__data__, K = mo(N, x);
    if (K < 0)
      return !1;
    var Se = N.length - 1;
    return K == Se ? N.pop() : yn.call(N, K, 1), !0;
  }
  function C(x) {
    var N = this.__data__, K = mo(N, x);
    return K < 0 ? void 0 : N[K][1];
  }
  function Ee(x) {
    return mo(this.__data__, x) > -1;
  }
  function wt(x, N) {
    var K = this.__data__, Se = mo(K, x);
    return Se < 0 ? K.push([x, N]) : K[Se][1] = N, this;
  }
  dt.prototype.clear = kt, dt.prototype.delete = Ye, dt.prototype.get = C, dt.prototype.has = Ee, dt.prototype.set = wt;
  function St(x) {
    var N = -1, K = x ? x.length : 0;
    for (this.clear(); ++N < K; ) {
      var Se = x[N];
      this.set(Se[0], Se[1]);
    }
  }
  function Wr() {
    this.__data__ = {
      hash: new te(),
      map: new (wn || dt)(),
      string: new te()
    };
  }
  function or(x) {
    return vr(this, x).delete(x);
  }
  function ft(x) {
    return vr(this, x).get(x);
  }
  function on(x) {
    return vr(this, x).has(x);
  }
  function Cs(x, N) {
    return vr(this, x).set(x, N), this;
  }
  St.prototype.clear = Wr, St.prototype.delete = or, St.prototype.get = ft, St.prototype.has = on, St.prototype.set = Cs;
  function sr(x) {
    this.__data__ = new dt(x);
  }
  function wo() {
    this.__data__ = new dt();
  }
  function Tr(x) {
    return this.__data__.delete(x);
  }
  function Mn(x) {
    return this.__data__.get(x);
  }
  function fn(x) {
    return this.__data__.has(x);
  }
  function Ts(x, N) {
    var K = this.__data__;
    if (K instanceof dt) {
      var Se = K.__data__;
      if (!wn || Se.length < n - 1)
        return Se.push([x, N]), this;
      K = this.__data__ = new St(Se);
    }
    return K.set(x, N), this;
  }
  sr.prototype.clear = wo, sr.prototype.delete = Tr, sr.prototype.get = Mn, sr.prototype.has = fn, sr.prototype.set = Ts;
  function lt(x, N) {
    var K = Ro(x) || Hs(x) ? Bt(x.length, String) : [], Se = K.length, Jt = !!Se;
    for (var Pn in x)
      Le.call(x, Pn) && !(Jt && (Pn == "length" || ki(Pn, Se))) && K.push(Pn);
    return K;
  }
  function Bs(x, N, K) {
    var Se = x[N];
    (!(Le.call(x, N) && Ii(Se, K)) || K === void 0 && !(N in x)) && (x[N] = K);
  }
  function mo(x, N) {
    for (var K = x.length; K--; )
      if (Ii(x[K][0], N))
        return K;
    return -1;
  }
  function Ms(x, N) {
    return x && So(N, xe(N), x);
  }
  function Oo(x, N, K, Se, Jt, Pn, _r) {
    var Un;
    if (Se && (Un = Pn ? Se(x, Jt, Pn, _r) : Se(x)), Un !== void 0)
      return Un;
    if (!Y(x))
      return x;
    var Li = Ro(x);
    if (Li) {
      if (Un = Ps(x), !N)
        return Zr(x, Un);
    } else {
      var Kn = ir(x), $a = Kn == h || Kn == d;
      if (G(x))
        return _s(x, N);
      if (Kn == v || Kn == o || $a && !Pn) {
        if (z(x))
          return Pn ? x : {};
        if (Un = Nr($a ? {} : x), !N)
          return ka(x, Ms(Un, x));
      } else {
        if (!R[Kn])
          return Pn ? x : {};
        Un = Us(x, Kn, Oo, N);
      }
    }
    _r || (_r = new sr());
    var zo = _r.get(x);
    if (zo)
      return zo;
    if (_r.set(x, Un), !Li)
      var Ia = K ? _n(x) : xe(x);
    return Bn(Ia || x, function(Ci, Ds) {
      Ia && (Ds = Ci, Ci = x[Ds]), Bs(Un, Ds, Oo(Ci, N, K, Se, Ds, x, _r));
    }), Un;
  }
  function bo(x) {
    return Y(x) ? Zn(x) : {};
  }
  function Nn(x, N, K) {
    var Se = N(x);
    return Ro(x) ? Se : En(Se, K(x));
  }
  function Ho(x) {
    return qe.call(x);
  }
  function Ns(x) {
    if (!Y(x) || vo(x))
      return !1;
    var N = ne(x) || z(x) ? Xe : Ke;
    return N.test(Gn(x));
  }
  function Ea(x) {
    if (!$i(x))
      return zn(x);
    var N = [];
    for (var K in Object(x))
      Le.call(x, K) && K != "constructor" && N.push(K);
    return N;
  }
  function _s(x, N) {
    if (N)
      return x.slice();
    var K = new x.constructor(x.length);
    return x.copy(K), K;
  }
  function kn(x) {
    var N = new x.constructor(x.byteLength);
    return new gn(N).set(new gn(x)), N;
  }
  function $n(x, N) {
    var K = N ? kn(x.buffer) : x.buffer;
    return new x.constructor(K, x.byteOffset, x.byteLength);
  }
  function xo(x, N, K) {
    var Se = N ? K(O(x), !0) : O(x);
    return pt(Se, Ne, new x.constructor());
  }
  function Br(x) {
    var N = new x.constructor(x.source, ce.exec(x));
    return N.lastIndex = x.lastIndex, N;
  }
  function Do(x, N, K) {
    var Se = N ? K(re(x), !0) : re(x);
    return pt(Se, Pe, new x.constructor());
  }
  function Fo(x) {
    return J ? Object(J.call(x)) : {};
  }
  function jo(x, N) {
    var K = N ? kn(x.buffer) : x.buffer;
    return new x.constructor(K, x.byteOffset, x.length);
  }
  function Zr(x, N) {
    var K = -1, Se = x.length;
    for (N || (N = Array(Se)); ++K < Se; )
      N[K] = x[K];
    return N;
  }
  function So(x, N, K, Se) {
    K || (K = {});
    for (var Jt = -1, Pn = N.length; ++Jt < Pn; ) {
      var _r = N[Jt], Un = void 0;
      Bs(K, _r, Un === void 0 ? x[_r] : Un);
    }
    return K;
  }
  function ka(x, N) {
    return So(x, Zt(x), N);
  }
  function _n(x) {
    return Nn(x, xe, Zt);
  }
  function vr(x, N) {
    var K = x.__data__;
    return Jr(N) ? K[typeof N == "string" ? "string" : "hash"] : K.map;
  }
  function Mr(x, N) {
    var K = Ot(x, N);
    return Ns(K) ? K : void 0;
  }
  var Zt = xr ? ee(xr, Object) : Me, ir = Ho;
  (Sr && ir(new Sr(new ArrayBuffer(1))) != X || wn && ir(new wn()) != w || jt && ir(jt.resolve()) != S || ut && ir(new ut()) != U || Mt && ir(new Mt()) != T) && (ir = function(x) {
    var N = qe.call(x), K = N == v ? x.constructor : void 0, Se = K ? Gn(K) : void 0;
    if (Se)
      switch (Se) {
        case Cr:
          return X;
        case yo:
          return w;
        case E:
          return S;
        case H:
          return U;
        case V:
          return T;
      }
    return N;
  });
  function Ps(x) {
    var N = x.length, K = x.constructor(N);
    return N && typeof x[0] == "string" && Le.call(x, "index") && (K.index = x.index, K.input = x.input), K;
  }
  function Nr(x) {
    return typeof x.constructor == "function" && !$i(x) ? bo(dn(x)) : {};
  }
  function Us(x, N, K, Se) {
    var Jt = x.constructor;
    switch (N) {
      case B:
        return kn(x);
      case a:
      case c:
        return new Jt(+x);
      case X:
        return $n(x, Se);
      case Q:
      case oe:
      case q:
      case m:
      case L:
      case _:
      case M:
      case W:
      case F:
        return jo(x, Se);
      case w:
        return xo(x, Se, K);
      case y:
      case P:
        return new Jt(x);
      case I:
        return Br(x);
      case U:
        return Do(x, Se, K);
      case A:
        return Fo(x);
    }
  }
  function ki(x, N) {
    return N = N ?? s, !!N && (typeof x == "number" || $.test(x)) && x > -1 && x % 1 == 0 && x < N;
  }
  function Jr(x) {
    var N = typeof x;
    return N == "string" || N == "number" || N == "symbol" || N == "boolean" ? x !== "__proto__" : x === null;
  }
  function vo(x) {
    return !!Et && Et in x;
  }
  function $i(x) {
    var N = x && x.constructor, K = typeof N == "function" && N.prototype || De;
    return x === K;
  }
  function Gn(x) {
    if (x != null) {
      try {
        return Fe.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function Os(x) {
    return Oo(x, !0, !0);
  }
  function Ii(x, N) {
    return x === N || x !== x && N !== N;
  }
  function Hs(x) {
    return k(x) && Le.call(x, "callee") && (!Ht.call(x, "callee") || qe.call(x) == o);
  }
  var Ro = Array.isArray;
  function b(x) {
    return x != null && Be(x.length) && !ne(x);
  }
  function k(x) {
    return $e(x) && b(x);
  }
  var G = qr || pe;
  function ne(x) {
    var N = Y(x) ? qe.call(x) : "";
    return N == h || N == d;
  }
  function Be(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function Y(x) {
    var N = typeof x;
    return !!x && (N == "object" || N == "function");
  }
  function $e(x) {
    return !!x && typeof x == "object";
  }
  function xe(x) {
    return b(x) ? lt(x) : Ea(x);
  }
  function Me() {
    return [];
  }
  function pe() {
    return !1;
  }
  e.exports = Os;
})(El, El.exports);
var iA = El.exports;
const Rw = /* @__PURE__ */ yy(iA);
var Bd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Bd || (Bd = {}));
function aA(e, t) {
  return { type: Bd.Address, version: e, hash160: t };
}
function cA(e) {
  return xi.c32address(e.version, e.hash160);
}
const lA = (e) => Nv(_w(e)), uA = (e) => He(lA(e));
rn.hmacSha256Sync = (e, ...t) => {
  const n = Mw.create(_w, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function dA(e, t = "mainnet") {
  t = Lw(t), e = typeof e == "string" ? At(e) : e;
  const n = kv(To.P2PKH, t), r = aA(n, uA(e));
  return cA(r);
}
function fA(e, t) {
  const n = Tn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = dA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Tn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function hA(e, t = null) {
  let n;
  t ? n = fA(e, t) : n = Tn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const f0 = "_blockstackDidCheckEchoReply", pA = "echoReply", gA = "authContinuation";
function yA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function wA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[f0];
  if (typeof t == "boolean")
    return t;
  const n = yA(e.location.search), r = n[pA];
  if (r) {
    e[f0] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[gA];
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
      this.appConfig = new ky();
    else
      throw new U1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Xp(t.sessionOptions) : this.store = new Xp() : t ? this.store = new Vp(t.sessionOptions) : this.store = new Vp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = H1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new md("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, nv(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = tv();
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
      if (wA())
        return Gi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Gi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = a2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Sc("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Tn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await av(t))
      throw new Sc("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (Nu(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Gp(s, o.private_key);
          } catch {
            if (Gi.warn("Failed decryption of appPrivateKey, will try to use as given"), !rn.isValidPrivateKey(o.private_key))
              throw new Sc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Gp(s, c);
          } catch {
            Gi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Sc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = W1, h;
    Nu(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Nu(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: kw(o.iss),
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
        d.profile = Object.assign({}, N1);
      else {
        const v = await y.text(), S = JSON.parse(v);
        d.profile = hA(S[0].token);
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Wx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Zx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Md.prototype.makeAuthRequest = Md.prototype.makeAuthRequestToken;
const mA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], bA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = mA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!iu(r.id));
  return t.concat(n);
}, iu = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), zw = "STX_PROVIDER", si = () => typeof window > "u" ? null : window.localStorage.getItem(zw), xA = (e) => {
  typeof window < "u" && window.localStorage.setItem(zw, e);
}, SA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vA(e, t) {
  const n = {};
  return Object.assign(n, SA, t), await fetch(e, n);
}
function AA(e) {
  let t = vA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function EA(...e) {
  const { fetchLib: t, middlewares: n } = AA(e);
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
var la;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(la || (la = {}));
var ii;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ii || (ii = {}));
var h0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(h0 || (h0 = {}));
const kA = "https://api.mainnet.hiro.so", $A = "https://api.testnet.hiro.so", IA = "http://localhost:3999", LA = ["mainnet", "testnet", "devnet", "mocknet"];
class ai {
  constructor(t) {
    this.version = ii.Mainnet, this.chainId = la.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ii.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? EA();
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
ai.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Nd();
    case "testnet":
      return new _d();
    case "devnet":
      return new CA();
    case "mocknet":
      return new Gw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${LA.join(", ")}`);
  }
};
ai.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : ai.fromName(e);
class Nd extends ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? kA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ii.Mainnet, this.chainId = la.Mainnet;
  }
}
class _d extends ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? $A,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ii.Testnet, this.chainId = la.Testnet;
  }
}
class Gw extends ai {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? IA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ii.Testnet, this.chainId = la.Testnet;
  }
}
const CA = Gw;
var ci;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ci || (ci = {}));
var kl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(kl || (kl = {}));
ci.Mainnet;
var li;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(li || (li = {}));
var ui;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ui || (ui = {}));
li.Mainnet;
const TA = {
  chainId: ci.Mainnet,
  transactionVersion: li.Mainnet,
  peerNetworkId: kl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ui.MainnetSingleSig,
    multiSig: ui.MainnetMultiSig
  },
  client: { baseUrl: vy }
}, Pd = {
  chainId: ci.Testnet,
  transactionVersion: li.Testnet,
  peerNetworkId: kl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ui.TestnetSingleSig,
    multiSig: ui.TestnetMultiSig
  },
  client: { baseUrl: Ay }
}, il = {
  ...Pd,
  addressVersion: { ...Pd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Ey }
}, BA = {
  ...il,
  addressVersion: { ...il.addressVersion },
  client: { ...il.client }
};
function MA(e) {
  switch (e) {
    case "mainnet":
      return TA;
    case "testnet":
      return Pd;
    case "devnet":
      return il;
    case "mocknet":
      return BA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function NA(e) {
  return typeof e == "string" ? MA(e) : e;
}
function _A(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const p0 = /* @__PURE__ */ new Map();
function Kw(e, t) {
  const n = p0.get(e);
  if (n !== void 0)
    return n(t);
  const r = _A(e);
  return p0.set(e, r), Kw(e, t);
}
let Rt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? At(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return r2(this.readBytes(4), 0);
  }
  readUInt8() {
    return t2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Q1(this.readBytes(2), 0);
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
    if (Kw(t, r))
      return r;
    throw n(r);
  }
};
const PA = 128, UA = 128, Vw = 16, Ws = 32, Ud = 80, au = 65, OA = 32, HA = 64, $l = 34, DA = 1 + 16 * 1024 * 1024, FA = 165, jA = 16, RA = 16, zA = 20, GA = RA + 2 + zA, KA = GA + 4, VA = DA + (FA + jA * KA);
var Tt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Tt || (Tt = {}));
var Od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Od || (Od = {}));
var dr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(dr || (dr = {}));
const Fu = ["onChainOnly", "offChainOnly", "any"];
Fu[0] + "", dr.OnChainOnly, Fu[1] + "", dr.OffChainOnly, Fu[2] + "", dr.Any, dr.OnChainOnly + "", dr.OnChainOnly, dr.OffChainOnly + "", dr.OffChainOnly, dr.Any + "", dr.Any;
var Il;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Il || (Il = {}));
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
var qt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qt || (qt = {}));
var Va;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Va || (Va = {}));
var Hd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Hd || (Hd = {}));
var Dd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Dd || (Dd = {}));
var Yn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Yn || (Yn = {}));
var g0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(g0 || (g0 = {}));
var Fd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Fd || (Fd = {}));
var jr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(jr || (jr = {}));
var y0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(y0 || (y0 = {}));
let cu = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ki = class extends cu {
  constructor(t) {
    super(t);
  }
}, Vn = class extends cu {
  constructor(t) {
    super(t);
  }
}, Ll = class extends cu {
  constructor(t) {
    super(t);
  }
}, Ks = class extends cu {
  constructor(t) {
    super(t);
  }
};
function jd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function XA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Xw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function YA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jd(e.outputLen), jd(e.blockLen);
}
function qA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function WA(e, t) {
  Xw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vs = {
  number: jd,
  bool: XA,
  bytes: Xw,
  hash: YA,
  exists: qA,
  output: WA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ju = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), to = (e, t) => e << 32 - t | e >>> t, ZA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ZA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function JA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Wf(e) {
  if (typeof e == "string" && (e = JA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Yw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Si(e) {
  const t = (r) => e().update(Wf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let qw = class extends Yw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Vs.hash(t);
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
    return Vs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Vs.exists(this), Vs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Ww = (e, t, n) => new qw(e, t).update(n).digest();
Ww.create = (e, t) => new qw(e, t);
function QA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Zf = class extends Yw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = ju(this.buffer);
  }
  update(t) {
    Vs.exists(this);
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
    Vs.exists(this), Vs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    QA(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const eE = (e, t, n) => e & t ^ ~e & n, tE = (e, t, n) => e & t ^ e & n ^ t & n, nE = new Uint32Array([
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
]), as = new Uint32Array(64);
let Zw = class extends Zf {
  constructor() {
    super(64, 32, 8, !1), this.A = is[0] | 0, this.B = is[1] | 0, this.C = is[2] | 0, this.D = is[3] | 0, this.E = is[4] | 0, this.F = is[5] | 0, this.G = is[6] | 0, this.H = is[7] | 0;
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
      as[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = as[d - 15], y = as[d - 2], v = to(w, 7) ^ to(w, 18) ^ w >>> 3, S = to(y, 17) ^ to(y, 19) ^ y >>> 10;
      as[d] = S + as[d - 7] + v + as[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = to(a, 6) ^ to(a, 11) ^ to(a, 25), y = h + w + eE(a, c, u) + nE[d] + as[d] | 0, S = (to(r, 2) ^ to(r, 13) ^ to(r, 22)) + tE(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    as.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, rE = class extends Zw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Jf = Si(() => new Zw());
Si(() => new rE());
const oE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jw = Uint8Array.from({ length: 16 }, (e, t) => t), sE = Jw.map((e) => (9 * e + 5) % 16);
let Qf = [Jw], eh = [sE];
for (let e = 0; e < 4; e++)
  for (let t of [Qf, eh])
    t.push(t[e].map((n) => oE[n]));
const Qw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), iE = Qf.map((e, t) => e.map((n) => Qw[t][n])), aE = eh.map((e, t) => e.map((n) => Qw[t][n])), cE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), lE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _c = (e, t) => e << t | e >>> 32 - t;
function w0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Pc = new Uint32Array(16);
let uE = class extends Zf {
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
      const v = 4 - y, S = cE[y], I = lE[y], U = Qf[y], P = eh[y], A = iE[y], T = aE[y];
      for (let B = 0; B < 16; B++) {
        const X = _c(r + w0(y, o, a, u) + Pc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = _c(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = _c(s + w0(v, i, c, h) + Pc[P[B]] + I, T[B]) + w | 0;
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
const dE = Si(() => new uE()), Uc = BigInt(2 ** 32 - 1), Rd = BigInt(32);
function em(e, t = !1) {
  return t ? { h: Number(e & Uc), l: Number(e >> Rd & Uc) } : { h: Number(e >> Rd & Uc) | 0, l: Number(e & Uc) | 0 };
}
function fE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = em(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const hE = (e, t) => BigInt(e >>> 0) << Rd | BigInt(t >>> 0), pE = (e, t, n) => e >>> n, gE = (e, t, n) => e << 32 - n | t >>> n, yE = (e, t, n) => e >>> n | t << 32 - n, wE = (e, t, n) => e << 32 - n | t >>> n, mE = (e, t, n) => e << 64 - n | t >>> n - 32, bE = (e, t, n) => e >>> n - 32 | t << 64 - n, xE = (e, t) => t, SE = (e, t) => e, vE = (e, t, n) => e << n | t >>> 32 - n, AE = (e, t, n) => t << n | e >>> 32 - n, EE = (e, t, n) => t << n - 32 | e >>> 64 - n, kE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function $E(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const IE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), LE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, CE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), TE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, BE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ME = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: em,
  split: fE,
  toBig: hE,
  shrSH: pE,
  shrSL: gE,
  rotrSH: yE,
  rotrSL: wE,
  rotrBH: mE,
  rotrBL: bE,
  rotr32H: xE,
  rotr32L: SE,
  rotlSH: vE,
  rotlSL: AE,
  rotlBH: EE,
  rotlBL: kE,
  add: $E,
  add3L: IE,
  add3H: LE,
  add4L: CE,
  add4H: TE,
  add5H: ME,
  add5L: BE
}, [NE, _E] = nt.split([
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
].map((e) => BigInt(e))), cs = new Uint32Array(80), ls = new Uint32Array(80);
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
      cs[A] = t.getUint32(n), ls[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = cs[A - 15] | 0, B = ls[A - 15] | 0, X = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), Q = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), oe = cs[A - 2] | 0, q = ls[A - 2] | 0, m = nt.rotrSH(oe, q, 19) ^ nt.rotrBH(oe, q, 61) ^ nt.shrSH(oe, q, 6), L = nt.rotrSL(oe, q, 19) ^ nt.rotrBL(oe, q, 61) ^ nt.shrSL(oe, q, 6), _ = nt.add4L(Q, L, ls[A - 7], ls[A - 16]), M = nt.add4H(_, X, m, cs[A - 7], cs[A - 16]);
      cs[A] = M | 0, ls[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), B = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = nt.add5L(P, B, Q, _E[A], ls[A]), q = nt.add5H(oe, U, T, X, NE[A], cs[A]), m = oe | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), _ = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = nt.add3L(m, _, W);
      r = nt.add3H(F, q, L, M), s = F | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = nt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = nt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = nt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    cs.fill(0), ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, PE = class extends lu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, UE = class extends lu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, OE = class extends lu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Si(() => new lu());
Si(() => new PE());
const HE = Si(() => new UE());
Si(() => new OE());
var gt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(gt || (gt = {}));
var pn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(pn || (pn = {}));
function th(e) {
  return pn[e];
}
const DE = () => ({ type: gt.BoolTrue }), FE = () => ({ type: gt.BoolFalse }), jE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: gt.Buffer, value: He(e) };
}, m0 = BigInt("0xffffffffffffffffffffffffffffffff"), RE = BigInt(0), b0 = BigInt("0x7fffffffffffffffffffffffffffffff"), x0 = BigInt("-170141183460469231731687303715884105728"), zE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = xd(At(e))), rr(e, Uint8Array) && (e = xd(e));
  const t = Rn(e);
  if (t > b0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${b0}`);
  if (t < x0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${x0}`);
  return { type: gt.Int, value: t };
}, GE = (e) => {
  const t = Rn(e);
  if (t < RE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > m0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${m0}`);
  return { type: gt.UInt, value: t };
};
function KE(e) {
  return { type: gt.List, value: e };
}
function tm() {
  return { type: gt.OptionalNone };
}
function nm(e) {
  return { type: gt.OptionalSome, value: e };
}
var ye;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ye || (ye = {}));
function VE() {
  return {
    type: ye.Address,
    version: ui.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function S0(e) {
  if (e && dm(e, $l))
    throw new Error(`Memo exceeds maximum length of ${$l} bytes`);
  return { type: ye.MemoString, content: e };
}
function nh(e, t) {
  return {
    type: ye.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function zd(e) {
  if (At(e).byteLength != au)
    throw Error("Invalid signature");
  return {
    type: ye.MessageSignature,
    data: e
  };
}
function XE(e, t, n) {
  return typeof e == "string" && (e = lk(e)), typeof n == "string" && (n = S0(n)), {
    type: ye.Payload,
    payloadType: Tt.TokenTransfer,
    recipient: e,
    amount: Rn(t),
    memo: n ?? S0("")
  };
}
function YE(e, t, n, r) {
  return typeof t == "string" && (t = Vr(t)), typeof n == "string" && (n = Vr(n)), {
    type: ye.Payload,
    payloadType: Tt.ContractCall,
    contractAddress: typeof e == "string" ? Ls(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function qE(e) {
  return Vr(e, 4, 1e5);
}
function v0(e, t, n) {
  return typeof e == "string" && (e = Vr(e)), typeof t == "string" && (t = qE(t)), typeof n == "number" ? {
    type: ye.Payload,
    payloadType: Tt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ye.Payload,
    payloadType: Tt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function WE() {
  return { type: ye.Payload, payloadType: Tt.PoisonMicroblock };
}
function A0(e, t) {
  if (e.byteLength != Ws)
    throw Error(`Coinbase buffer size must be ${Ws} bytes`);
  return t != null ? {
    type: ye.Payload,
    payloadType: Tt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ye.Payload,
    payloadType: Tt.Coinbase,
    coinbaseBytes: e
  };
}
function ZE(e, t, n) {
  if (e.byteLength != Ws)
    throw Error(`Coinbase buffer size must be ${Ws} bytes`);
  if (n.byteLength != Ud)
    throw Error(`VRF proof buffer size must be ${Ud} bytes`);
  return {
    type: ye.Payload,
    payloadType: Tt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === gt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function JE(e, t, n, r, s, o, i) {
  return {
    type: ye.Payload,
    payloadType: Tt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Vr(e, t, n) {
  const r = t || 1, s = n || PA;
  if (dm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ye.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function QE(e, t, n) {
  return {
    type: ye.Asset,
    address: Ls(e),
    contractName: Vr(t),
    assetName: Vr(n)
  };
}
function Ls(e) {
  const t = xi.c32addressDecode(e);
  return {
    type: ye.Address,
    version: t[0],
    hash160: t[1]
  };
}
function ek(e, t) {
  const n = Ls(e), r = Vr(t);
  return {
    type: ye.Principal,
    prefix: Yn.Contract,
    address: n,
    contractName: r
  };
}
function tk(e) {
  const t = Ls(e);
  return {
    type: ye.Principal,
    prefix: Yn.Standard,
    address: t
  };
}
function Vi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ye.TransactionAuthField,
    contents: t
  };
}
function Lo(e) {
  switch (e.type) {
    case ye.Address:
      return gc(e);
    case ye.Principal:
      return rm(e);
    case ye.LengthPrefixedString:
      return da(e);
    case ye.MemoString:
      return rk(e);
    case ye.Asset:
      return sm(e);
    case ye.PostCondition:
      return am(e);
    case ye.PublicKey:
      return Vd(e);
    case ye.LengthPrefixedList:
      return rh(e);
    case ye.Payload:
      return cm(e);
    case ye.TransactionAuthField:
      return ck(e);
    case ye.MessageSignature:
      return oh(e);
  }
}
function gc(e) {
  const t = [];
  return t.push(At(lc(e.version, 1))), t.push(At(e.hash160)), cn(t);
}
function ua(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = Yl(He(t.readBytes(1))), r = He(t.readBytes(20));
  return { type: ye.Address, version: n, hash160: r };
}
function rm(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Yn.Standard || e.prefix === Yn.Contract) && t.push(gc(e.address)), e.prefix === Yn.Contract && t.push(da(e.contractName)), cn(t);
}
function nk(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(Yn, (o) => {
    throw new Vn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Yn.Origin)
    return { type: ye.Principal, prefix: n };
  const r = ua(t);
  if (n === Yn.Standard)
    return { type: ye.Principal, prefix: n, address: r };
  const s = $r(t);
  return {
    type: ye.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function da(e) {
  const t = [], n = yi(e.content), r = n.byteLength;
  return t.push(At(lc(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function $r(e, t, n) {
  t = t || 1;
  const r = rr(e, Rt) ? e : new Rt(e), s = Yl(He(r.readBytes(t))), o = uc(r.readBytes(s));
  return Vr(o, t, n ?? 128);
}
function rk(e) {
  const t = [], n = yi(e.content), r = Bk(He(n), $l * 2);
  return t.push(At(r)), cn(t);
}
function om(e) {
  const t = rr(e, Rt) ? e : new Rt(e);
  let n = uc(t.readBytes($l));
  return n = n.replace(/\u0000*$/, ""), { type: ye.MemoString, content: n };
}
function sm(e) {
  const t = [];
  return t.push(gc(e.address)), t.push(da(e.contractName)), t.push(da(e.assetName)), cn(t);
}
function Gd(e) {
  const t = rr(e, Rt) ? e : new Rt(e);
  return {
    type: ye.Asset,
    address: ua(t),
    contractName: $r(t),
    assetName: $r(t)
  };
}
function rh(e) {
  const t = e.values, n = [];
  n.push(At(lc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Lo(r));
  return cn(n);
}
function im(e, t, n) {
  const r = rr(e, Rt) ? e : new Rt(e), s = Yl(He(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ye.Address:
        o.push(ua(r));
        break;
      case ye.LengthPrefixedString:
        o.push($r(r));
        break;
      case ye.MemoString:
        o.push(om(r));
        break;
      case ye.Asset:
        o.push(Gd(r));
        break;
      case ye.PostCondition:
        o.push(sk(r));
        break;
      case ye.PublicKey:
        o.push(Xd(r));
        break;
      case ye.TransactionAuthField:
        o.push(ak(r));
        break;
    }
  return nh(o, n);
}
function ok(e) {
  return He(am(e));
}
function am(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(rm(e.principal)), (e.conditionType === Kt.Fungible || e.conditionType === Kt.NonFungible) && t.push(sm(e.asset)), e.conditionType === Kt.NonFungible && t.push(co(e.assetName)), t.push(e.conditionCode), e.conditionType === Kt.STX || e.conditionType === Kt.Fungible || e.conditionType === Kt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ki("The post-condition amount may not be larger than 8 bytes");
    t.push($s(e.amount, 8));
  }
  return cn(t);
}
function sk(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(Kt, (a) => {
    throw new Vn(`Could not read ${a} as PostConditionType`);
  }), r = nk(t);
  let s, o, i;
  switch (n) {
    case Kt.STX:
      return s = t.readUInt8Enum(Va, (c) => {
        throw new Vn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Kt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Kt.Fungible:
      return o = Gd(t), s = t.readUInt8Enum(Va, (c) => {
        throw new Vn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Kt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Kt.NonFungible:
      o = Gd(t);
      const a = so(t);
      return s = t.readUInt8Enum(Hd, (c) => {
        throw new Vn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ye.PostCondition,
        conditionType: Kt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Kt.Staking:
      return s = t.readUInt8Enum(Va, (c) => {
        throw new Vn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Kt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Kt.PoX: {
      const c = t.readUInt8Enum(Dd, (u) => {
        throw new Vn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ye.PostCondition,
        conditionType: Kt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function cm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Tt.TokenTransfer:
      t.push(co(e.recipient)), t.push($s(e.amount, 8)), t.push(Lo(e.memo));
      break;
    case Tt.ContractCall:
      t.push(Lo(e.contractAddress)), t.push(Lo(e.contractName)), t.push(Lo(e.functionName));
      const n = new Uint8Array(4);
      ei(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(co(r));
      });
      break;
    case Tt.SmartContract:
      t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
      break;
    case Tt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
      break;
    case Tt.PoisonMicroblock:
      break;
    case Tt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Tt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(co(e.recipient));
      break;
    case Tt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(co(e.recipient ? nm(e.recipient) : tm())), t.push(e.vrfProof);
      break;
    case Tt.TenureChange:
      t.push(At(e.tenureHash)), t.push(At(e.previousTenureHash)), t.push(At(e.burnViewHash)), t.push(At(e.previousTenureEnd)), t.push(ei(new Uint8Array(4), e.previousTenureBlocks)), t.push(n2(new Uint8Array(1), e.cause)), t.push(At(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function ik(e) {
  const t = rr(e, Rt) ? e : new Rt(e);
  switch (t.readUInt8Enum(Tt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Tt.TokenTransfer:
      const r = so(t), s = Rn(t.readBytes(8)), o = om(t);
      return XE(r, s, o);
    case Tt.ContractCall:
      const i = ua(t), a = $r(t), c = $r(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = so(t);
        u.push(B);
      }
      return YE(i, a, c, u);
    case Tt.SmartContract:
      const d = $r(t), w = $r(t, 4, 1e5);
      return v0(d, w);
    case Tt.VersionedSmartContract: {
      const T = t.readUInt8Enum(Od, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = $r(t), X = $r(t, 4, VA);
      return v0(B, X, T);
    }
    case Tt.PoisonMicroblock:
      return WE();
    case Tt.Coinbase: {
      const T = t.readBytes(Ws);
      return A0(T);
    }
    case Tt.CoinbaseToAltRecipient: {
      const T = t.readBytes(Ws), B = so(t);
      return A0(T, B);
    }
    case Tt.NakamotoCoinbase: {
      const T = t.readBytes(Ws), B = so(t), X = t.readBytes(Ud);
      return ZE(T, B, X);
    }
    case Tt.TenureChange:
      const y = He(t.readBytes(20)), v = He(t.readBytes(20)), S = He(t.readBytes(20)), I = He(t.readBytes(32)), U = t.readUInt32BE(), P = t.readUInt8Enum(Fd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = He(t.readBytes(20));
      return JE(y, v, S, I, U, P, A);
  }
}
function Kd(e) {
  const t = rr(e, Rt) ? e : new Rt(e);
  return zd(He(t.readBytes(au)));
}
function ak(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(jr, (r) => {
    throw new Vn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case jr.PublicKeyCompressed:
      return Vi(qt.Compressed, Xd(t));
    case jr.PublicKeyUncompressed:
      return Vi(qt.Uncompressed, ba(Rk(Xd(t).data)));
    case jr.SignatureCompressed:
      return Vi(qt.Compressed, Kd(t));
    case jr.SignatureUncompressed:
      return Vi(qt.Uncompressed, Kd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function oh(e) {
  return At(e.data);
}
function ck(e) {
  const t = [];
  switch (e.contents.type) {
    case ye.PublicKey:
      t.push(e.pubKeyEncoding === qt.Compressed ? jr.PublicKeyCompressed : jr.PublicKeyUncompressed), t.push(At(jk(e.contents.data)));
      break;
    case ye.MessageSignature:
      t.push(e.pubKeyEncoding === qt.Compressed ? jr.SignatureCompressed : jr.SignatureUncompressed), t.push(oh(e.contents));
      break;
  }
  return cn(t);
}
function Vd(e) {
  return e.data.slice();
}
function Xd(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = t.readUInt8(), r = n === 4 ? HA : OA;
  return ba(cn([n, t.readBytes(r)]));
}
function sh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Dt.P2PKH || t === Dt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Dt.P2WPKH || t === Dt.P2WSH || t === Dt.P2WSHNonSequential) && !r.map((s) => s.data).every(xa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Dt.P2PKH:
      return Oc(e, Mk(r[0].data));
    case Dt.P2WPKH:
      return Oc(e, Nk(r[0].data));
    case Dt.P2SH:
    case Dt.P2SHNonSequential:
      return Oc(e, _k(n, r.map(Vd)));
    case Dt.P2WSH:
    case Dt.P2WSHNonSequential:
      return Oc(e, Pk(n, r.map(Vd)));
  }
}
function Oc(e, t) {
  return { type: ye.Address, version: e, hash160: t };
}
function ih(e) {
  return xi.c32address(e.version, e.hash160);
}
function E0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return QE(t, n, r);
}
function Na(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ek(t, n);
  } else
    return tk(e);
}
function lk(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return fk(t, n);
  } else
    return uk(e);
}
function uk(e) {
  const t = Ls(e);
  return { type: gt.PrincipalStandard, value: ih(t) };
}
function dk(e) {
  return { type: gt.PrincipalStandard, value: ih(e) };
}
function fk(e, t) {
  const n = Ls(e), r = Vr(t);
  return lm(n, r);
}
function lm(e, t) {
  if (yi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: gt.PrincipalContract,
    value: `${ih(e)}.${t.content}`
  };
}
function hk(e) {
  return { type: gt.ResponseErr, value: e };
}
function pk(e) {
  return { type: gt.ResponseOk, value: e };
}
const gk = (e) => ({ type: gt.StringASCII, value: e }), yk = (e) => ({ type: gt.StringUTF8, value: e });
function wk(e) {
  for (const t in e)
    if (!Uk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: gt.Tuple, value: e };
}
function so(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Rt(At(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Rt(e) : t = e;
  switch (t.readUInt8Enum(pn, (r) => {
    throw new Vn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case pn.int:
      return zE(xd(t.readBytes(16)));
    case pn.uint:
      return GE(t.readBytes(16));
    case pn.buffer:
      const r = t.readUInt32BE();
      return jE(t.readBytes(r));
    case pn.true:
      return DE();
    case pn.false:
      return FE();
    case pn.address:
      const s = ua(t);
      return dk(s);
    case pn.contract:
      const o = ua(t), i = $r(t);
      return lm(o, i);
    case pn.ok:
      return pk(so(t));
    case pn.err:
      return hk(so(t));
    case pn.none:
      return tm();
    case pn.some:
      return nm(so(t));
    case pn.list:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(so(t));
      return KE(c);
    case pn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = $r(t).content;
        if (I === void 0)
          throw new Vn('"content" is undefined');
        h[I] = so(t);
      }
      return wk(h);
    case pn.ascii:
      const d = t.readUInt32BE(), w = Y1(t.readBytes(d));
      return gk(w);
    case pn.utf8:
      const y = t.readUInt32BE(), v = uc(t.readBytes(y));
      return yk(v);
    default:
      throw new Vn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ho(e, t) {
  return cn([th(e), t]);
}
function mk(e) {
  return new Uint8Array([th(e.type)]);
}
function bk(e) {
  return e.type === gt.OptionalNone ? new Uint8Array([th(e.type)]) : ho(e.type, co(e.value));
}
function xk(e) {
  const t = new Uint8Array(4);
  return ei(t, Math.ceil(e.value.length / 2), 0), ho(e.type, uo(t, At(e.value)));
}
function Sk(e) {
  const t = Lf(z1(BigInt(e.value), BigInt(UA)), Vw);
  return ho(e.type, t);
}
function vk(e) {
  const t = Lf(BigInt(e.value), Vw);
  return ho(e.type, t);
}
function Ak(e) {
  return ho(e.type, gc(Ls(e.value)));
}
function Ek(e) {
  const [t, n] = Ok(e.value);
  return ho(e.type, uo(gc(Ls(t)), da(Vr(n))));
}
function kk(e) {
  return ho(e.type, co(e.value));
}
function $k(e) {
  const t = [], n = new Uint8Array(4);
  ei(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = co(r);
    t.push(s);
  }
  return ho(e.type, cn(t));
}
function Ik(e) {
  const t = [], n = new Uint8Array(4);
  ei(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Vr(s);
    t.push(da(o));
    const i = co(e.value[s]);
    t.push(i);
  }
  return ho(e.type, cn(t));
}
function um(e, t) {
  const n = [], r = t == "ascii" ? X1(e.value) : yi(e.value), s = new Uint8Array(4);
  return ei(s, r.length, 0), n.push(s), n.push(r), ho(e.type, cn(n));
}
function Lk(e) {
  return um(e, "ascii");
}
function Ck(e) {
  return um(e, "utf8");
}
function k0(e) {
  return He(co(e));
}
function co(e) {
  switch (e.type) {
    case gt.BoolTrue:
    case gt.BoolFalse:
      return mk(e);
    case gt.OptionalNone:
    case gt.OptionalSome:
      return bk(e);
    case gt.Buffer:
      return xk(e);
    case gt.UInt:
      return vk(e);
    case gt.Int:
      return Sk(e);
    case gt.PrincipalStandard:
      return Ak(e);
    case gt.PrincipalContract:
      return Ek(e);
    case gt.ResponseOk:
    case gt.ResponseErr:
      return kk(e);
    case gt.List:
      return $k(e);
    case gt.Tuple:
      return Ik(e);
    case gt.StringASCII:
      return Lk(e);
    case gt.StringUTF8:
      return Ck(e);
    default:
      throw new Ki("Unable to serialize. Invalid Clarity Value.");
  }
}
const Tk = (e) => e.length % 2 ? `0${e}` : e, Bk = (e, t) => e.padEnd(t, "0"), dm = (e, t) => e ? yi(e).length > t : !1;
function Yd(e) {
  return Rw(e);
}
const Ja = (e) => dE(Jf(e)), ah = (e) => He(HE(e)), Mk = (e) => He(Ja(e)), Nk = (e) => {
  const t = Ja(e), n = uo(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ja(n);
  return He(r);
}, _k = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Ja(r);
  return He(s);
}, Pk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Jf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = cn(o), a = Ja(i);
  return He(a);
};
function Uk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Ok(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = Ww.create(Jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ba(e) {
  return e = typeof e == "string" ? At(e) : e, {
    type: ye.PublicKey,
    data: e
  };
}
function Hk(e, t, n = qt.Compressed) {
  const r = J1(t), s = new yr(kp(r.r), kp(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === qt.Compressed;
  return o.toHex(i);
}
function Dk(e) {
  return typeof e == "string" ? e : He(e);
}
const ch = Dk;
function fm(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === Z1;
}
function xa(e) {
  return !ch(e).startsWith("04");
}
function Fk(e) {
  e = Cf(e);
  const t = fm(e);
  return He(dc(e.slice(0, 32), t));
}
function jk(e) {
  return at.fromHex(ch(e)).toHex(!0);
}
function Rk(e) {
  return at.fromHex(ch(e)).toHex(!1);
}
function zk(e, t) {
  e = Cf(e);
  const [n, r] = Wl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return lc(r, 1) + yr.fromHex(n).toCompactHex();
}
function lh() {
  return {
    type: ye.MessageSignature,
    data: He(new Uint8Array(au))
  };
}
function hm(e, t, n, r) {
  const s = sh(0, e, 1, [ba(t)]).hash160, o = xa(t) ? qt.Compressed : qt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Rn(n),
    fee: Rn(r),
    keyEncoding: o,
    signature: lh()
  };
}
function Qa(e) {
  return "signature" in e;
}
function $0(e) {
  return e === Dt.P2SH || e === Dt.P2WSH;
}
function Gk(e) {
  return e === Dt.P2SHNonSequential || e === Dt.P2WSHNonSequential;
}
function I0(e) {
  const t = Yd(e);
  return t.nonce = 0, t.fee = 0, Qa(t) ? t.signature = lh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Kk(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    $s(e.nonce, 8),
    $s(e.fee, 8),
    e.keyEncoding,
    oh(e.signature)
  ];
  return cn(t);
}
function Vk(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    $s(e.nonce, 8),
    $s(e.fee, 8)
  ], n = nh(e.fields);
  t.push(rh(n));
  const r = new Uint8Array(2);
  return e2(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function Xk(e, t) {
  const n = He(t.readBytes(20)), r = BigInt(`0x${He(t.readBytes(8))}`), s = BigInt(`0x${He(t.readBytes(8))}`), o = t.readUInt8Enum(qt, (a) => {
    throw new Vn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Dt.P2WPKH && o != qt.Compressed)
    throw new Vn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function Yk(e, t) {
  const n = He(t.readBytes(20)), r = BigInt("0x" + He(t.readBytes(8))), s = BigInt("0x" + He(t.readBytes(8))), o = im(t, ye.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ye.PublicKey:
        xa(u.contents.data) || (i = !0);
        break;
      case ye.MessageSignature:
        if (u.pubKeyEncoding === qt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Dt.P2WSH || e === Dt.P2WSHNonSequential))
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
function Ru(e) {
  return Qa(e) ? Kk(e) : Vk(e);
}
function zu(e) {
  const t = e.readUInt8Enum(Dt, (n) => {
    throw new Vn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Dt.P2PKH || t === Dt.P2WPKH ? Xk(t, e) : Yk(t, e);
}
function pm(e, t, n, r) {
  const o = e + He(new Uint8Array([t])) + He($s(n, 8)) + He($s(r, 8));
  if (At(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ah(At(o));
}
function gm(e, t, n) {
  const r = 33 + au, s = xa(t.data) ? qt.Compressed : qt.Uncompressed, o = e + Tk(s.toString(16)) + n, i = At(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return ah(i);
}
function qk(e, t, n, r, s) {
  const o = pm(e, t, n, r), i = zk(s, o), a = ba(Fk(s)), c = gm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function ym(e, t, n, r, s, o) {
  const i = pm(e, t, n, r), a = ba(Hk(i, o, s)), c = gm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Wk() {
  const e = hm(Dt.P2PKH, "", 0, 0);
  return e.signer = VE().hash160, e.keyEncoding = qt.Compressed, e.signature = lh(), e;
}
function L0(e, t, n) {
  return Qa(e) ? Zk(e, t, n) : Jk(e, t, n);
}
function Zk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = ym(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = sh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Jk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ye.PublicKey:
        xa(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ye.MessageSignature:
        c.pubKeyEncoding === qt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = ym(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if ($0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Ks("Too many signatures");
        break;
    }
  if ($0(e.hashMode) && i !== e.signaturesRequired || Gk(e.hashMode) && i < e.signaturesRequired)
    throw new Ks("Incorrect number of signatures");
  if (o && (e.hashMode === Dt.P2WSH || e.hashMode === Dt.P2WSHNonSequential))
    throw new Ks("Uncompressed keys are not allowed in this hash mode");
  const a = sh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function wm(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function mm(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || hm(Dt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function C0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return wm(I0(e.spendingCondition));
      case tn.Sponsored:
        return mm(I0(e.spendingCondition), Wk());
      default:
        throw new Ll("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Qk(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return L0(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return L0(e.spendingCondition, t, tn.Standard);
    default:
      throw new Ll("Invalid origin auth type");
  }
}
function e3(e, t) {
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
function t3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Rn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function n3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Rn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function r3(e, t) {
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
function o3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Ru(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Ru(e.spendingCondition)), t.push(Ru(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function s3(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new Vn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = zu(e), wm(n);
    case tn.Sponsored:
      n = zu(e);
      const r = zu(e);
      return mm(n, r);
  }
}
class i3 {
  constructor({ auth: t, payload: n, postConditions: r = nh([]), postConditionMode: s = Il.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = NA(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Rn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = dr.Any;
  }
  signBegin() {
    const t = Yd(this);
    return t.auth = C0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Yd(this);
    return t.auth = C0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Qk(this.auth, this.verifyBegin());
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
    const n = typeof t == "object" && "type" in t ? t : ba(t), r = this.auth.spendingCondition;
    if (r && !Qa(r)) {
      const s = xa(n.data);
      r.fields.push(Vi(s ? qt.Compressed : qt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = qk(n, r, t.fee, t.nonce, s);
    if (Qa(t))
      t.signature = zd(o);
    else {
      const a = fm(s);
      t.fields.push(Vi(a ? qt.Compressed : qt.Uncompressed, zd(o)));
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
    this.auth = r3(this.auth, t);
  }
  setFee(t) {
    this.auth = e3(this.auth, t);
  }
  setNonce(t) {
    this.auth = t3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Ll("Cannot sponsor sign a non-sponsored transaction");
    this.auth = n3(this.auth, t);
  }
  serialize() {
    return He(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ki('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ki('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ki('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ki('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return ei(n, this.chainId, 0), t.push(n), t.push(o3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(rh(this.postConditions)), t.push(cm(this.payload)), cn(t);
  }
}
function a3(e) {
  const t = rr(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(li, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = s3(t), o = t.readUInt8Enum(dr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(Il, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = im(t, ye.PostCondition), c = ik(t), u = new i3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const T0 = BigInt("18446744073709551615");
function Gu(e) {
  const t = Rn(e);
  if (t < 0n || t > T0)
    throw new RangeError(`Post-condition amount must be between 0 and ${T0} (u64 max), received: ${t}`);
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
function c3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Kt.STX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Yn.Origin } : Na(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Kt.Fungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Yn.Origin } : Na(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount),
        asset: E0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Kt.NonFungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Yn.Origin } : Na(e.address),
        conditionCode: Hc(e.condition),
        asset: E0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Kt.Staking,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Yn.Origin } : Na(e.address),
        conditionCode: Hc(e.condition),
        amount: Gu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Kt.PoX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Yn.Origin } : Na(e.address),
        conditionCode: l3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Hc(e) {
  return qd[e];
}
function l3(e) {
  return Wd[e];
}
function bm(e) {
  const t = c3(e);
  return ok(t);
}
function u3(e, t, n) {
  return dh(xm(e), n);
}
function xm(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ec(r);
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
    return BigInt(`0x${h3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function uh(e, t = 8) {
  return (typeof e == "bigint" ? e : xm(e)).toString(16).padStart(t * 2, "0");
}
function dh(e, t = 16) {
  const n = uh(e, t);
  return ec(n);
}
function d3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const f3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function h3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += f3[n];
  return t;
}
function ec(e) {
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
function p3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function g3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function B0(e) {
  if (e.some(g3))
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
function Uo(e) {
  return hh(...e.map((t) => typeof t == "number" ? B0([t]) : t instanceof Array ? B0(t) : t));
}
function uu(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Zd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Zd || (Zd = {}));
Zd.Mainnet;
const y3 = 128, w3 = 128, Sm = 16;
var Jd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Jd || (Jd = {}));
var M0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(M0 || (M0 = {}));
var N0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(N0 || (N0 = {}));
var Hr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Hr || (Hr = {}));
const Ku = ["onChainOnly", "offChainOnly", "any"];
Ku[0] + "", Hr.OnChainOnly, Ku[1] + "", Hr.OffChainOnly, Ku[2] + "", Hr.Any, Hr.OnChainOnly + "", Hr.OnChainOnly, Hr.OffChainOnly + "", Hr.OffChainOnly, Hr.Any + "", Hr.Any;
var Qd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qd || (Qd = {}));
Qd.Mainnet;
var _0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(_0 || (_0 = {}));
var js;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(js || (js = {}));
var P0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(P0 || (P0 = {}));
var U0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(U0 || (U0 = {}));
var O0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(O0 || (O0 = {}));
var H0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(H0 || (H0 = {}));
var D0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(D0 || (D0 = {}));
var F0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(F0 || (F0 = {}));
var ef;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(ef || (ef = {}));
var j0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(j0 || (j0 = {}));
var R0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(R0 || (R0 = {}));
function tf(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function m3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function vm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function b3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tf(e.outputLen), tf(e.blockLen);
}
function x3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function S3(e, t) {
  vm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vu = {
  number: tf,
  bool: m3,
  bytes: vm,
  hash: b3,
  exists: x3,
  output: S3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), no = (e, t) => e << 32 - t | e >>> t, v3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function A3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Am(e) {
  if (typeof e == "string" && (e = A3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let E3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function vi(e) {
  const t = (r) => e().update(Am(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function k3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let ph = class extends E3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Xu(this.buffer);
  }
  update(t) {
    Vu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Am(t);
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
    k3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const $3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Em = Uint8Array.from({ length: 16 }, (e, t) => t), I3 = Em.map((e) => (9 * e + 5) % 16);
let gh = [Em], yh = [I3];
for (let e = 0; e < 4; e++)
  for (let t of [gh, yh])
    t.push(t[e].map((n) => $3[n]));
const km = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), L3 = gh.map((e, t) => e.map((n) => km[t][n])), C3 = yh.map((e, t) => e.map((n) => km[t][n])), T3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), B3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Dc = (e, t) => e << t | e >>> 32 - t;
function z0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Fc = new Uint32Array(16);
let M3 = class extends ph {
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
      const v = 4 - y, S = T3[y], I = B3[y], U = gh[y], P = yh[y], A = L3[y], T = C3[y];
      for (let B = 0; B < 16; B++) {
        const X = Dc(r + z0(y, o, a, u) + Fc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Dc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Dc(s + z0(v, i, c, h) + Fc[P[B]] + I, T[B]) + w | 0;
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
vi(() => new M3());
const N3 = (e, t, n) => e & t ^ ~e & n, _3 = (e, t, n) => e & t ^ e & n ^ t & n, P3 = new Uint32Array([
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
]), us = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ds = new Uint32Array(64);
let $m = class extends ph {
  constructor() {
    super(64, 32, 8, !1), this.A = us[0] | 0, this.B = us[1] | 0, this.C = us[2] | 0, this.D = us[3] | 0, this.E = us[4] | 0, this.F = us[5] | 0, this.G = us[6] | 0, this.H = us[7] | 0;
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
      ds[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ds[d - 15], y = ds[d - 2], v = no(w, 7) ^ no(w, 18) ^ w >>> 3, S = no(y, 17) ^ no(y, 19) ^ y >>> 10;
      ds[d] = S + ds[d - 7] + v + ds[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = no(a, 6) ^ no(a, 11) ^ no(a, 25), y = h + w + N3(a, c, u) + P3[d] + ds[d] | 0, S = (no(r, 2) ^ no(r, 13) ^ no(r, 22)) + _3(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ds.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, U3 = class extends $m {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
vi(() => new $m());
vi(() => new U3());
const jc = BigInt(2 ** 32 - 1), nf = BigInt(32);
function Im(e, t = !1) {
  return t ? { h: Number(e & jc), l: Number(e >> nf & jc) } : { h: Number(e >> nf & jc) | 0, l: Number(e & jc) | 0 };
}
function O3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Im(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const H3 = (e, t) => BigInt(e >>> 0) << nf | BigInt(t >>> 0), D3 = (e, t, n) => e >>> n, F3 = (e, t, n) => e << 32 - n | t >>> n, j3 = (e, t, n) => e >>> n | t << 32 - n, R3 = (e, t, n) => e << 32 - n | t >>> n, z3 = (e, t, n) => e << 64 - n | t >>> n - 32, G3 = (e, t, n) => e >>> n - 32 | t << 64 - n, K3 = (e, t) => t, V3 = (e, t) => e, X3 = (e, t, n) => e << n | t >>> 32 - n, Y3 = (e, t, n) => t << n | e >>> 32 - n, q3 = (e, t, n) => t << n - 32 | e >>> 64 - n, W3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Z3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const J3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Q3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, e4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), t4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, n4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), r4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, rt = {
  fromBig: Im,
  split: O3,
  toBig: H3,
  shrSH: D3,
  shrSL: F3,
  rotrSH: j3,
  rotrSL: R3,
  rotrBH: z3,
  rotrBL: G3,
  rotr32H: K3,
  rotr32L: V3,
  rotlSH: X3,
  rotlSL: Y3,
  rotlBH: q3,
  rotlBL: W3,
  add: Z3,
  add3L: J3,
  add3H: Q3,
  add4L: e4,
  add4H: t4,
  add5H: r4,
  add5L: n4
}, [o4, s4] = rt.split([
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
].map((e) => BigInt(e))), fs = new Uint32Array(80), hs = new Uint32Array(80);
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
      fs[A] = t.getUint32(n), hs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = fs[A - 15] | 0, B = hs[A - 15] | 0, X = rt.rotrSH(T, B, 1) ^ rt.rotrSH(T, B, 8) ^ rt.shrSH(T, B, 7), Q = rt.rotrSL(T, B, 1) ^ rt.rotrSL(T, B, 8) ^ rt.shrSL(T, B, 7), oe = fs[A - 2] | 0, q = hs[A - 2] | 0, m = rt.rotrSH(oe, q, 19) ^ rt.rotrBH(oe, q, 61) ^ rt.shrSH(oe, q, 6), L = rt.rotrSL(oe, q, 19) ^ rt.rotrBL(oe, q, 61) ^ rt.shrSL(oe, q, 6), _ = rt.add4L(Q, L, hs[A - 7], hs[A - 16]), M = rt.add4H(_, X, m, fs[A - 7], fs[A - 16]);
      fs[A] = M | 0, hs[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = rt.rotrSH(d, w, 14) ^ rt.rotrSH(d, w, 18) ^ rt.rotrBH(d, w, 41), B = rt.rotrSL(d, w, 14) ^ rt.rotrSL(d, w, 18) ^ rt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = rt.add5L(P, B, Q, s4[A], hs[A]), q = rt.add5H(oe, U, T, X, o4[A], fs[A]), m = oe | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), _ = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = rt.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = rt.add3L(m, _, W);
      r = rt.add3H(F, q, L, M), s = F | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = rt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = rt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = rt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = rt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = rt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    fs.fill(0), hs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, i4 = class extends du {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, a4 = class extends du {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, c4 = class extends du {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
vi(() => new du());
vi(() => new i4());
vi(() => new a4());
vi(() => new c4());
function l4(e, t, n) {
  const s = y3;
  if (k4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Jd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Sn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Sn || (Sn = {}));
let u4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Lm = class extends u4 {
  constructor(t) {
    super(t);
  }
};
function fu(e) {
  const t = [];
  return t.push(ec(uh(e.version, 1))), t.push(ec(e.hash160)), Uo(t);
}
function d4(e) {
  const t = [];
  return t.push(e.prefix), t.push(fu(e.address)), e.prefix === ef.Contract && t.push(tc(e.contractName)), Uo(t);
}
function tc(e) {
  const t = [], n = fh(e.content), r = n.byteLength;
  return t.push(ec(uh(r, e.lengthPrefixBytes))), t.push(n), Uo(t);
}
function f4(e) {
  const t = [];
  return t.push(fu(e.address)), t.push(tc(e.contractName)), t.push(tc(e.assetName)), Uo(t);
}
function Cm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(d4(e.principal)), (e.conditionType === js.Fungible || e.conditionType === js.NonFungible) && t.push(f4(e.assetInfo)), e.conditionType === js.NonFungible && t.push(di(e.assetName)), t.push(e.conditionCode), e.conditionType === js.STX || e.conditionType === js.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Lm("The post-condition amount may not be larger than 8 bytes");
    t.push(u3(e.amount, !1, 8));
  }
  return Uo(t);
}
function po(e, t) {
  return Uo([e, t]);
}
function h4(e) {
  return new Uint8Array([e.type]);
}
function p4(e) {
  return e.type === Sn.OptionalNone ? new Uint8Array([e.type]) : po(e.type, di(e.value));
}
function g4(e) {
  const t = new Uint8Array(4);
  return uu(t, e.buffer.length, 0), po(e.type, hh(t, e.buffer));
}
function y4(e) {
  const t = dh(d3(e.value, BigInt(w3)), Sm);
  return po(e.type, t);
}
function w4(e) {
  const t = dh(e.value, Sm);
  return po(e.type, t);
}
function m4(e) {
  return po(e.type, fu(e.address));
}
function b4(e) {
  return po(e.type, hh(fu(e.address), tc(e.contractName)));
}
function x4(e) {
  return po(e.type, di(e.value));
}
function S4(e) {
  const t = [], n = new Uint8Array(4);
  uu(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = di(r);
    t.push(s);
  }
  return po(e.type, Uo(t));
}
function v4(e) {
  const t = [], n = new Uint8Array(4);
  uu(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = l4(s);
    t.push(tc(o));
    const i = di(e.data[s]);
    t.push(i);
  }
  return po(e.type, Uo(t));
}
function Tm(e, t) {
  const n = [], r = t == "ascii" ? p3(e.data) : fh(e.data), s = new Uint8Array(4);
  return uu(s, r.length, 0), n.push(s), n.push(r), po(e.type, Uo(n));
}
function A4(e) {
  return Tm(e, "ascii");
}
function E4(e) {
  return Tm(e, "utf8");
}
function di(e) {
  switch (e.type) {
    case Sn.BoolTrue:
    case Sn.BoolFalse:
      return h4(e);
    case Sn.OptionalNone:
    case Sn.OptionalSome:
      return p4(e);
    case Sn.Buffer:
      return g4(e);
    case Sn.UInt:
      return w4(e);
    case Sn.Int:
      return y4(e);
    case Sn.PrincipalStandard:
      return m4(e);
    case Sn.PrincipalContract:
      return b4(e);
    case Sn.ResponseOk:
    case Sn.ResponseErr:
      return x4(e);
    case Sn.List:
      return S4(e);
    case Sn.Tuple:
      return v4(e);
    case Sn.StringASCII:
      return A4(e);
    case Sn.StringUTF8:
      return E4(e);
    default:
      throw new Lm("Unable to serialize. Invalid Clarity Value.");
  }
}
const k4 = (e, t) => e ? fh(e).length > t : !1, $4 = "connect-ui";
let al, Bm, fr = !1, rf = !1;
const Po = (e, t = "") => () => {
}, I4 = (e, t) => () => {
}, L4 = "{visibility:hidden}.hydrated{visibility:inherit}", G0 = {}, C4 = "http://www.w3.org/2000/svg", T4 = "http://www.w3.org/1999/xhtml", B4 = (e) => e != null, wh = (e) => (e = typeof e, e === "object" || e === "function");
function Mm(e) {
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
}, M4 = {}, N4 = (e) => e && e.$tag$ === M4, _4 = (e, t) => e != null && !wh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, P4 = (e) => Sa(e).$hostElement$, U4 = (e, t, n) => {
  const r = Fn.ce(t, n);
  return e.dispatchEvent(r), r;
}, K0 = /* @__PURE__ */ new WeakMap(), O4 = (e, t, n) => {
  let r = Cl.get(e);
  r$ && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Cl.set(e, r);
}, H4 = (e, t, n, r) => {
  var s;
  let o = Nm(t);
  const i = Cl.get(o);
  if (e = e.nodeType === 11 ? e : lo, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = K0.get(e), c;
      if (a || K0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = lo.createElement("style"), c.innerHTML = i;
          const u = (s = Fn.$nonce$) !== null && s !== void 0 ? s : Mm(lo);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, D4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Po("attachStyles", t.$tagName$), o = H4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Nm = (e, t) => "sc-" + e.$tagName$, V0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = Y0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = X0(n), h = X0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : Y0(hu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Fn.rel(e, t, n, !1), r && Fn.ael(e, t, r, !1);
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
}, F4 = /\s/, X0 = (e) => e ? e.split(F4) : [], _m = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || G0, i = t.$attrs$ || G0;
  for (r in o)
    r in i || V0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    V0(s, r, o[r], i[r], n, t.$flags$);
}, mh = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = lo.createTextNode(s.$text$);
  else {
    if (fr || (fr = s.$tag$ === "svg"), i = s.$elm$ = lo.createElementNS(fr ? C4 : T4, s.$tag$), fr && s.$tag$ === "foreignObject" && (fr = !1), _m(null, s, fr), B4(al) && i["s-si"] !== al && i.classList.add(i["s-si"] = al), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = mh(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? fr = !1 : i.tagName === "foreignObject" && (fr = !0);
  }
  return i;
}, Pm = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Bm && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = mh(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, Um = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, j4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : Rc(a, h) ? (Fa(a, h), a = t[++s], h = r[++o]) : Rc(c, d) ? (Fa(c, d), c = t[--i], d = r[--u]) : Rc(a, d) ? (Fa(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : Rc(c, h) ? (Fa(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (w = mh(t && t[o], n, o), h = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Pm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && Um(t, s, i);
}, Rc = (e, t) => e.$tag$ === t.$tag$, Fa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (fr = o === "svg" ? !0 : o === "foreignObject" ? !1 : fr, _m(e, t, fr), r !== null && s !== null ? j4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Pm(n, null, t, s, 0, s.length - 1)) : r !== null && Um(r, 0, r.length - 1), fr && o === "svg" && (fr = !1)) : e.$text$ !== i && (n.data = i);
}, R4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || of(null, null), s = N4(t) ? t : Je(null, null, t);
  Bm = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, al = n["s-sc"], Fa(r, s);
}, Om = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, bh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Om(e, e.$ancestorComponent$), s$(() => z4(e, t));
}, z4 = (e, t) => {
  const n = Po("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), X4(s, () => G4(e, r, t));
}, G4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Po("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && D4(e);
  const i = Po("render", e.$cmpMeta$.$tagName$);
  K4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => V4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, K4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, R4(e, t);
  } catch (r) {
    nc(r, e.$hostElement$);
  }
  return null;
}, V4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Po("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Dm(n), r(), e.$onReadyResolve$(n), s || Hm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Sh(() => bh(e, !1)), e.$flags$ &= -517;
}, Hm = (e) => {
  Dm(lo.documentElement), Sh(() => U4(hu, "appload", { detail: { namespace: $4 } }));
}, X4 = (e, t) => e && e.then ? e.then(t) : t(), Dm = (e) => e.classList.add("hydrated"), Y4 = (e, t) => Sa(e).$instanceValues$.get(t), q4 = (e, t, n, r) => {
  const s = Sa(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = _4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && bh(s, !1));
}, Fm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return Y4(this, o);
        },
        set(a) {
          q4(this, o, a, t);
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
}, W4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = n$(n), s.then) {
        const c = I4();
        s = await s, c();
      }
      s.isProxied || (Fm(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Po("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        nc(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Nm(n);
      if (!Cl.has(c)) {
        const u = Po("registerStyles", n.$tagName$);
        O4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => bh(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, Z4 = (e) => {
  if (!(Fn.$flags$ & 1)) {
    const t = Sa(e), n = t.$cmpMeta$, r = Po("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Om(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), W4(e, t, n);
    }
    r();
  }
}, J4 = (e) => {
  Fn.$flags$ & 1 || Sa(e);
}, Q4 = (e, t = {}) => {
  var n;
  const r = Po(), s = [], o = t.exclude || [], i = hu.customElements, a = lo.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ lo.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(Fn, t), Fn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", lo.baseURI).href, e.map((y) => {
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
          super(P), P = this, t$(P, S), S.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : Fn.jmp(() => Z4(this));
        }
        disconnectedCallback() {
          Fn.jmp(() => J4(this));
        }
        componentOnReady() {
          return Sa(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = y[0], !o.includes(I) && !i.get(I) && (s.push(I), i.define(I, Fm(
        U,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + L4, u.setAttribute("data-styles", "");
    const y = (n = Fn.$nonce$) !== null && n !== void 0 ? n : Mm(lo);
    y != null && u.setAttribute("nonce", y), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : Fn.jmp(() => d = setTimeout(Hm, 30)), r();
}, xh = /* @__PURE__ */ new WeakMap(), Sa = (e) => xh.get(e), e$ = (e, t) => xh.set(t.$lazyInstance$ = e, t), t$ = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], xh.set(e, n);
}, Y0 = (e, t) => t in e, nc = (e, t) => (0, console.error)(e, t), Yu = /* @__PURE__ */ new Map(), n$ = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = Yu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (Yu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => ZC).then(i, nc);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Yu.set(s, i), i[r]), nc);
}, Cl = /* @__PURE__ */ new Map(), hu = typeof window < "u" ? window : {}, lo = hu.document || { head: {} }, Fn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, jm = (e) => Promise.resolve(e), r$ = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), q0 = [], Rm = [], o$ = (e, t) => (n) => {
  e.push(n), rf || (rf = !0, Fn.$flags$ & 4 ? Sh(sf) : Fn.raf(sf));
}, W0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      nc(n);
    }
  e.length = 0;
}, sf = () => {
  W0(q0), W0(Rm), (rf = q0.length > 0) && Fn.raf(sf);
}, Sh = (e) => jm().then(e), s$ = /* @__PURE__ */ o$(Rm), i$ = () => jm(), a$ = (e, t) => typeof window > "u" ? Promise.resolve() : i$().then(() => Q4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var c$ = Object.defineProperty, l$ = Object.defineProperties, u$ = Object.getOwnPropertyDescriptors, Tl = Object.getOwnPropertySymbols, zm = Object.prototype.hasOwnProperty, Gm = Object.prototype.propertyIsEnumerable, Z0 = (e, t, n) => t in e ? c$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, mr = (e, t) => {
  for (var n in t || (t = {})) zm.call(t, n) && Z0(e, n, t[n]);
  if (Tl) for (var n of Tl(t)) Gm.call(t, n) && Z0(e, n, t[n]);
  return e;
}, Xr = (e, t) => l$(e, u$(t)), Km = (e, t) => {
  var n = {};
  for (var r in e) zm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Tl) for (var r of Tl(e)) t.indexOf(r) < 0 && Gm.call(e, r) && (n[r] = e[r]);
  return n;
};
function Vm() {
  return iu(si()) || window.StacksProvider || window.BlockstackProvider;
}
function pu(e) {
  return e ? typeof e == "string" ? ai.fromName(e) : "version" in e ? e : "url" in e ? new Nd({ url: e.url }) : e.transactionVersion === li.Mainnet ? new Nd({ url: e.client.baseUrl }) : new _d({ url: e.client.baseUrl }) : new _d();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var d$ = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(d$ || {}), f$ = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(f$ || {}), vh = (e) => {
  let t = e;
  if (!t) {
    let n = new ky(["store_write"], document.location.href);
    t = new Md({ appConfig: n });
  }
  return t;
};
function Xm(e) {
  try {
    return vh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ym = (e) => {
  let t = vh(e).loadUserData().appPrivateKey, n = Tn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function h$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [ci.Mainnet]: "mainnet", [ci.Testnet]: "testnet" }, a = pu(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function p$(e) {
  let t = pu(e.network), n = vh(e.userSession), r = Xr(mr({}, e), { network: t, userSession: n });
  return mr({ stxAddress: h$(r) }, r);
}
async function g$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(bm) : n = n.map((r) => He(Cm(r)))), new Tn.TokenSigner("ES256k", t).signAsync(Xr(mr({}, e), { postConditions: n }));
}
function y$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(bm) : t = t.map((n) => He(Cm(n)))), Tn.createUnsecuredToken(Xr(mr({}, e), { postConditions: t }));
}
var w$ = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = At(a.replace(/^0x/, "")), u = a3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Xr(mr({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Xr(mr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, m$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = Km(t, ["amount", "appDetails", "userSession"]);
  if (Xm(s)) {
    let { privateKey: a, publicKey: c } = Ym(s), u = Xr(mr({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), g$(u, a);
  }
  let i = Xr(mr({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), y$(i);
};
async function b$(e, t, n) {
  let r = await t(Xr(mr(mr({}, p$(e)), e), { network: pu(e.network) }));
  return w$({ token: r, options: e }, n);
}
function x$(e, t = Vm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return b$(e, m$, t);
}
function qm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Xr(mr({}, e), { message: k0(t), domain: k0(n) }) : Xr(mr({}, e), { message: He(di(t)), domain: He(di(n)) });
}
async function S$(e, t) {
  return new Tn.TokenSigner("ES256k", t).signAsync(qm(e));
}
async function v$(e) {
  let t = e, { userSession: n } = t, r = Km(t, ["userSession"]);
  if (Xm(n)) {
    let { privateKey: s, publicKey: o } = Ym(n), i = Xr(mr({}, r), { publicKey: o });
    return S$(i, s);
  }
  return Tn.createUnsecuredToken(qm(e));
}
var A$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(A$ || {}), Wm = "asigna-stx", J0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Wm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(k$(e, t), "*");
}), E$ = { authenticationRequest: async (e) => J0(e, "authenticationRequest"), transactionRequest: async (e) => J0(e, "transactionRequest") }, k$ = (e, t) => ({ source: Wm, [t]: e }), $$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = E$);
};
$$();
var I$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function L$(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = si(), i = Vm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    a$();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : I$, c = bA(a), u = document.createElement("connect-modal");
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
var zc = L$(x$);
function Is(e, t, n) {
  return Ah(Wn(e, t), n);
}
function Wn(e, t) {
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
      const r = B$(BigInt(`0x${ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Q0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function yc(e, t = 8) {
  return (typeof e == "bigint" ? e : Wn(e, !1)).toString(16).padStart(t * 2, "0");
}
function gu(e) {
  return parseInt(e, 16);
}
function Ah(e, t = 16) {
  const n = yc(e, t);
  return Xt(n);
}
function C$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function T$(e, t) {
  return e & BigInt(1) << t;
}
function B$(e, t) {
  return T$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const M$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ct(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += M$[n];
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
function va(e) {
  return new TextEncoder().encode(e);
}
function Eh(e) {
  return new TextDecoder().decode(e);
}
function Zm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function N$(e) {
  return String.fromCharCode.apply(null, e);
}
function _$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function eg(e) {
  if (e.some(_$))
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
function ln(e) {
  return yu(...e.map((t) => typeof t == "number" ? eg([t]) : t instanceof Array ? eg(t) : t));
}
var tg;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(tg || (tg = {}));
var ng;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ng || (ng = {}));
var rg;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(rg || (rg = {}));
const Jm = 33, qu = 32;
function P$(e) {
  if (e.length < qu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + qu * 2), r = e.slice(2 + qu * 2);
  return {
    recoveryId: gu(t),
    r: n,
    s: r
  };
}
function U$(e) {
  const t = typeof e == "string" ? Xt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function O$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function H$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function D$(e, t) {
  return e[t];
}
function F$(e, t, n = 0) {
  return e[n] = t, e;
}
function j$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function fi(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var af;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(af || (af = {}));
const R$ = af.Mainnet, z$ = 128, G$ = 128, Qm = 16, Zs = 32, cf = 80, wu = 65, K$ = 32, V$ = 64, Bl = 34;
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
const cl = ["onChainOnly", "offChainOnly", "any"], og = {
  [cl[0]]: tr.OnChainOnly,
  [cl[1]]: tr.OffChainOnly,
  [cl[2]]: tr.Any,
  [tr.OnChainOnly]: tr.OnChainOnly,
  [tr.OffChainOnly]: tr.OffChainOnly,
  [tr.Any]: tr.Any
};
function X$(e) {
  if (e in og)
    return og[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${cl.join(", ")}`);
}
var Ml;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ml || (Ml = {}));
Ml.Mainnet;
var fa;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(fa || (fa = {}));
var nr;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(nr || (nr = {}));
var nn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(nn || (nn = {}));
var Ft;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ft || (Ft = {}));
var Nl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Nl || (Nl = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var rc;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(rc || (rc = {}));
var uf;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(uf || (uf = {}));
var oc;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(oc || (oc = {}));
var sg;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(sg || (sg = {}));
var ig;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(ig || (ig = {}));
function df(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Y$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function eb(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function q$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  df(e.outputLen), df(e.blockLen);
}
function W$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Z$(e, t) {
  eb(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xs = {
  number: df,
  bool: Y$,
  bytes: eb,
  hash: q$,
  exists: W$,
  output: Z$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Wu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ro = (e, t) => e << 32 - t | e >>> t, J$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!J$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Q$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function kh(e) {
  if (typeof e == "string" && (e = Q$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class tb {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ai(e) {
  const t = (r) => e().update(kh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function e8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class $h extends tb {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Wu(this.buffer);
  }
  update(t) {
    Xs.exists(this);
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
    Xs.exists(this), Xs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    e8(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
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
const t8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), nb = Uint8Array.from({ length: 16 }, (e, t) => t), n8 = nb.map((e) => (9 * e + 5) % 16);
let Ih = [nb], Lh = [n8];
for (let e = 0; e < 4; e++)
  for (let t of [Ih, Lh])
    t.push(t[e].map((n) => t8[n]));
const rb = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), r8 = Ih.map((e, t) => e.map((n) => rb[t][n])), o8 = Lh.map((e, t) => e.map((n) => rb[t][n])), s8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), i8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gc = (e, t) => e << t | e >>> 32 - t;
function ag(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Kc = new Uint32Array(16);
class a8 extends $h {
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
      const v = 4 - y, S = s8[y], I = i8[y], U = Ih[y], P = Lh[y], A = r8[y], T = o8[y];
      for (let B = 0; B < 16; B++) {
        const X = Gc(r + ag(y, o, a, u) + Kc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Gc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Gc(s + ag(v, i, c, h) + Kc[P[B]] + I, T[B]) + w | 0;
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
const c8 = Ai(() => new a8()), l8 = (e, t, n) => e & t ^ ~e & n, u8 = (e, t, n) => e & t ^ e & n ^ t & n, d8 = new Uint32Array([
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
]), ps = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gs = new Uint32Array(64);
class ob extends $h {
  constructor() {
    super(64, 32, 8, !1), this.A = ps[0] | 0, this.B = ps[1] | 0, this.C = ps[2] | 0, this.D = ps[3] | 0, this.E = ps[4] | 0, this.F = ps[5] | 0, this.G = ps[6] | 0, this.H = ps[7] | 0;
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
      gs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = gs[d - 15], y = gs[d - 2], v = ro(w, 7) ^ ro(w, 18) ^ w >>> 3, S = ro(y, 17) ^ ro(y, 19) ^ y >>> 10;
      gs[d] = S + gs[d - 7] + v + gs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = ro(a, 6) ^ ro(a, 11) ^ ro(a, 25), y = h + w + l8(a, c, u) + d8[d] + gs[d] | 0, S = (ro(r, 2) ^ ro(r, 13) ^ ro(r, 22)) + u8(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    gs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class f8 extends ob {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Ch = Ai(() => new ob());
Ai(() => new f8());
const Vc = BigInt(2 ** 32 - 1), ff = BigInt(32);
function sb(e, t = !1) {
  return t ? { h: Number(e & Vc), l: Number(e >> ff & Vc) } : { h: Number(e >> ff & Vc) | 0, l: Number(e & Vc) | 0 };
}
function h8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = sb(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const p8 = (e, t) => BigInt(e >>> 0) << ff | BigInt(t >>> 0), g8 = (e, t, n) => e >>> n, y8 = (e, t, n) => e << 32 - n | t >>> n, w8 = (e, t, n) => e >>> n | t << 32 - n, m8 = (e, t, n) => e << 32 - n | t >>> n, b8 = (e, t, n) => e << 64 - n | t >>> n - 32, x8 = (e, t, n) => e >>> n - 32 | t << 64 - n, S8 = (e, t) => t, v8 = (e, t) => e, A8 = (e, t, n) => e << n | t >>> 32 - n, E8 = (e, t, n) => t << n | e >>> 32 - n, k8 = (e, t, n) => t << n - 32 | e >>> 64 - n, $8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function I8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const L8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), C8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, T8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), B8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, M8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), N8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, ot = {
  fromBig: sb,
  split: h8,
  toBig: p8,
  shrSH: g8,
  shrSL: y8,
  rotrSH: w8,
  rotrSL: m8,
  rotrBH: b8,
  rotrBL: x8,
  rotr32H: S8,
  rotr32L: v8,
  rotlSH: A8,
  rotlSL: E8,
  rotlBH: k8,
  rotlBL: $8,
  add: I8,
  add3L: L8,
  add3H: C8,
  add4L: T8,
  add4H: B8,
  add5H: N8,
  add5L: M8
}, [_8, P8] = ot.split([
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
].map((e) => BigInt(e))), ys = new Uint32Array(80), ws = new Uint32Array(80);
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
      ys[A] = t.getUint32(n), ws[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ys[A - 15] | 0, B = ws[A - 15] | 0, X = ot.rotrSH(T, B, 1) ^ ot.rotrSH(T, B, 8) ^ ot.shrSH(T, B, 7), Q = ot.rotrSL(T, B, 1) ^ ot.rotrSL(T, B, 8) ^ ot.shrSL(T, B, 7), oe = ys[A - 2] | 0, q = ws[A - 2] | 0, m = ot.rotrSH(oe, q, 19) ^ ot.rotrBH(oe, q, 61) ^ ot.shrSH(oe, q, 6), L = ot.rotrSL(oe, q, 19) ^ ot.rotrBL(oe, q, 61) ^ ot.shrSL(oe, q, 6), _ = ot.add4L(Q, L, ws[A - 7], ws[A - 16]), M = ot.add4H(_, X, m, ys[A - 7], ys[A - 16]);
      ys[A] = M | 0, ws[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = ot.rotrSH(d, w, 14) ^ ot.rotrSH(d, w, 18) ^ ot.rotrBH(d, w, 41), B = ot.rotrSL(d, w, 14) ^ ot.rotrSL(d, w, 18) ^ ot.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = ot.add5L(P, B, Q, P8[A], ws[A]), q = ot.add5H(oe, U, T, X, _8[A], ys[A]), m = oe | 0, L = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), _ = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = ot.add(u | 0, h | 0, q | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = ot.add3L(m, _, W);
      r = ot.add3H(F, q, L, M), s = F | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = ot.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = ot.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = ot.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = ot.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = ot.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ys.fill(0), ws.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class U8 extends mu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class O8 extends mu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class H8 extends mu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ai(() => new mu());
Ai(() => new U8());
const D8 = Ai(() => new O8());
Ai(() => new H8());
function ib(e) {
  if (Xt(e).byteLength != wu)
    throw Error("Invalid signature");
  return {
    type: Ce.MessageSignature,
    data: e
  };
}
function ja(e, t) {
  return { type: Ce.Address, version: e, hash160: t };
}
function Xi(e) {
  return xi.c32address(e.version, e.hash160);
}
function hi(e, t, n) {
  const r = t || 1, s = n || z$;
  if (Ab(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ce.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Th(e) {
  const t = xi.c32addressDecode(e);
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
function F8(e) {
  if (e.type === ae.PrincipalStandard)
    return Xi(e.address);
  if (e.type === ae.PrincipalContract)
    return `${Xi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function ab(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return z8(t, n);
  } else
    return j8(e);
}
function j8(e) {
  const t = Th(e);
  return { type: ae.PrincipalStandard, address: t };
}
function R8(e) {
  return { type: ae.PrincipalStandard, address: e };
}
function z8(e, t) {
  const n = Th(e), r = hi(t);
  return cb(n, r);
}
function cb(e, t) {
  if (va(t.content).byteLength >= 128)
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
      return `0x${ct(e.buffer)}`;
    case ae.OptionalNone:
      return null;
    case ae.OptionalSome:
      return Rr(e.value);
    case ae.ResponseErr:
      return Rr(e.value);
    case ae.ResponseOk:
      return Rr(e.value);
    case ae.PrincipalStandard:
    case ae.PrincipalContract:
      return F8(e);
    case ae.List:
      return e.list.map((r) => Rr(r));
    case ae.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Rr(e.data[r]);
      }), n;
    case ae.StringASCII:
      return e.data;
    case ae.StringUTF8:
      return e.data;
  }
}
function Rr(e) {
  switch (e.type) {
    case ae.ResponseErr:
      return { type: xs(e), value: Zu(e, !0), success: !1 };
    case ae.ResponseOk:
      return { type: xs(e), value: Zu(e, !0), success: !0 };
    default:
      return { type: xs(e), value: Zu(e, !0) };
  }
}
function xs(e) {
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
      return `(optional ${xs(e.value)})`;
    case ae.ResponseErr:
      return `(response UnknownType ${xs(e.value)})`;
    case ae.ResponseOk:
      return `(response ${xs(e.value)} UnknownType)`;
    case ae.PrincipalStandard:
    case ae.PrincipalContract:
      return "principal";
    case ae.List:
      return `(list ${e.list.length} ${e.list.length ? xs(e.list[0]) : "UnknownType"})`;
    case ae.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${xs(e.data[t])})`).join(" ")})`;
    case ae.StringASCII:
      return `(string-ascii ${Zm(e.data).length})`;
    case ae.StringUTF8:
      return `(string-utf8 ${va(e.data).length})`;
  }
}
const lb = () => ({ type: ae.BoolTrue }), ub = () => ({ type: ae.BoolFalse }), G8 = (e) => e ? lb() : ub(), cg = BigInt("0xffffffffffffffffffffffffffffffff"), K8 = BigInt(0), lg = BigInt("0x7fffffffffffffffffffffffffffffff"), ug = BigInt("-170141183460469231731687303715884105728"), V8 = (e) => {
  const t = Wn(e, !0);
  if (t > lg)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${lg}`);
  if (t < ug)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ug}`);
  return { type: ae.Int, value: t };
}, An = (e) => {
  const t = Wn(e, !1);
  if (t < K8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > cg)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${cg}`);
  return { type: ae.UInt, value: t };
}, db = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ae.Buffer, buffer: e };
};
function fb() {
  return { type: ae.OptionalNone };
}
function hb(e) {
  return { type: ae.OptionalSome, value: e };
}
function X8(e) {
  return { type: ae.ResponseErr, value: e };
}
function Y8(e) {
  return { type: ae.ResponseOk, value: e };
}
function q8(e) {
  return { type: ae.List, list: e };
}
function br(e) {
  for (const t in e)
    if (!H6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ae.Tuple, data: e };
}
const $t = (e) => ({ type: ae.StringASCII, data: e }), W8 = (e) => ({ type: ae.StringUTF8, data: e });
class pb extends tb {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Xs.hash(t);
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
    return Xs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Xs.exists(this), Xs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const gb = (e, t, n) => new pb(e, t).update(n).digest();
gb.create = (e, t) => new pb(e, t);
rn.hmacSha256Sync = (e, ...t) => {
  const n = gb.create(Ch, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ha(e) {
  return {
    type: Ce.PublicKey,
    data: Xt(e)
  };
}
function Z8(e, t, n = Wt.Compressed) {
  const r = P$(t.data), s = new yr(Q0(r.r), Q0(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === Wt.Compressed;
  return o.toHex(i);
}
function J8(e) {
  return { type: Ce.PublicKey, data: e };
}
function Aa(e) {
  return !ct(e.data).startsWith("04");
}
function _l(e) {
  return e.data.slice();
}
function Q8(e) {
  const t = n6(e), n = dc(t.data.slice(0, 32), t.compressed);
  return ha(ct(n));
}
function e6(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!0);
  return ha(n);
}
function t6(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!1);
  return ha(n);
}
function hf(e) {
  const t = e.readUInt8(), n = t === 4 ? V$ : K$;
  return J8(ln([t, e.readBytes(n)]));
}
function n6(e) {
  const t = U$(e), n = t.length == Jm;
  return { data: t, compressed: n };
}
function r6(e, t) {
  const [n, r] = Wl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = yc(r, 1) + yr.fromHex(n).toCompactHex();
  return ib(o);
}
function o6(e) {
  return Q8(e.data);
}
function s6(e, t, n) {
  return typeof e == "string" && (e = ab(e)), typeof n == "string" && (n = hg(n)), {
    type: Ce.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Wn(t, !1),
    memo: n ?? hg("")
  };
}
function i6(e, t, n, r) {
  return typeof e == "string" && (e = Th(e)), typeof t == "string" && (t = hi(t)), typeof n == "string" && (n = hi(n)), {
    type: Ce.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function dg(e, t, n) {
  return typeof e == "string" && (e = hi(e)), typeof t == "string" && (t = g6(t)), typeof n == "number" ? {
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
function a6() {
  return { type: Ce.Payload, payloadType: it.PoisonMicroblock };
}
function fg(e, t) {
  if (e.byteLength != Zs)
    throw Error(`Coinbase buffer size must be ${Zs} bytes`);
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
function c6(e, t, n) {
  if (e.byteLength != Zs)
    throw Error(`Coinbase buffer size must be ${Zs} bytes`);
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
function l6(e, t, n, r, s, o, i) {
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
function yb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(sn(e.recipient)), t.push(Is(e.amount, !1, 8)), t.push(Co(e.memo));
      break;
    case it.ContractCall:
      t.push(Co(e.contractAddress)), t.push(Co(e.contractName)), t.push(Co(e.functionName));
      const n = new Uint8Array(4);
      fi(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(sn(r));
      });
      break;
    case it.SmartContract:
      t.push(Co(e.contractName)), t.push(Co(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Co(e.contractName)), t.push(Co(e.codeBody));
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
      t.push(e.coinbaseBytes), t.push(sn(e.recipient ? hb(e.recipient) : fb())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Xt(e.tenureHash)), t.push(Xt(e.previousTenureHash)), t.push(Xt(e.burnViewHash)), t.push(Xt(e.previousTenureEnd)), t.push(fi(new Uint8Array(4), e.previousTenureBlocks)), t.push(F$(new Uint8Array(1), e.cause)), t.push(Xt(e.publicKeyHash));
      break;
  }
  return ln(t);
}
function u6(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = Lr(e), r = Wn(e.readBytes(8), !1), s = mb(e);
      return s6(n, r, s);
    case it.ContractCall:
      const o = pa(e), i = Ir(e), a = Ir(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = Lr(e);
        c.push(T);
      }
      return i6(o, i, a, c);
    case it.SmartContract:
      const h = Ir(e), d = Ir(e, 4, 1e5);
      return dg(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(lf, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = Ir(e), B = Ir(e, 4, 1e5);
      return dg(T, B, A);
    }
    case it.PoisonMicroblock:
      return a6();
    case it.Coinbase: {
      const A = e.readBytes(Zs);
      return fg(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(Zs), T = Lr(e);
      return fg(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(Zs), T = Lr(e), B = e.readBytes(cf);
      return c6(A, T, B);
    }
    case it.TenureChange:
      const w = ct(e.readBytes(20)), y = ct(e.readBytes(20)), v = ct(e.readBytes(20)), S = ct(e.readBytes(32)), I = e.readUInt32BE(), U = e.readUInt8Enum(pf, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), P = ct(e.readBytes(20));
      return l6(w, y, v, S, I, U, P);
  }
}
class bu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Rs extends bu {
  constructor(t) {
    super(t);
  }
}
class gr extends bu {
  constructor(t) {
    super(t);
  }
}
class Pl extends bu {
  constructor(t) {
    super(t);
  }
}
class Ys extends bu {
  constructor(t) {
    super(t);
  }
}
var zr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zr || (zr = {}));
function gf(e) {
  return ib(ct(e.readBytes(wu)));
}
function Yi(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ce.TransactionAuthField,
    contents: t
  };
}
function d6(e) {
  const t = e.readUInt8Enum(zr, (n) => {
    throw new gr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case zr.PublicKeyCompressed:
      return Yi(Wt.Compressed, hf(e));
    case zr.PublicKeyUncompressed:
      return Yi(Wt.Uncompressed, t6(hf(e).data));
    case zr.SignatureCompressed:
      return Yi(Wt.Compressed, gf(e));
    case zr.SignatureUncompressed:
      return Yi(Wt.Uncompressed, gf(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Bh(e) {
  return Xt(e.data);
}
function f6(e) {
  const t = [];
  switch (e.contents.type) {
    case Ce.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? zr.PublicKeyCompressed : zr.PublicKeyUncompressed), t.push(_l(e6(e.contents.data)));
      break;
    case Ce.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? zr.SignatureCompressed : zr.SignatureUncompressed), t.push(Bh(e.contents));
      break;
  }
  return ln(t);
}
function Co(e) {
  switch (e.type) {
    case Ce.Address:
      return wc(e);
    case Ce.Principal:
      return wb(e);
    case Ce.LengthPrefixedString:
      return ga(e);
    case Ce.MemoString:
      return y6(e);
    case Ce.AssetInfo:
      return bb(e);
    case Ce.PostCondition:
      return w6(e);
    case Ce.PublicKey:
      return _l(e);
    case Ce.LengthPrefixedList:
      return _h(e);
    case Ce.Payload:
      return yb(e);
    case Ce.TransactionAuthField:
      return f6(e);
    case Ce.MessageSignature:
      return Bh(e);
  }
}
function h6() {
  return {
    type: Ce.Address,
    version: Nl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Mh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ft.SerializeP2PKH || t === Ft.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ft.SerializeP2WPKH || t === Ft.SerializeP2WSH || t === Ft.SerializeP2WSHNonSequential) && !r.every(Aa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ft.SerializeP2PKH:
      return ja(e, _6(r[0].data));
    case Ft.SerializeP2WPKH:
      return ja(e, P6(r[0].data));
    case Ft.SerializeP2SH:
    case Ft.SerializeP2SHNonSequential:
      return ja(e, U6(n, r.map(_l)));
    case Ft.SerializeP2WSH:
    case Ft.SerializeP2WSHNonSequential:
      return ja(e, O6(n, r.map(_l)));
  }
}
function wc(e) {
  const t = [];
  return t.push(Xt(yc(e.version, 1))), t.push(Xt(e.hash160)), ln(t);
}
function pa(e) {
  const t = gu(ct(e.readBytes(1))), n = ct(e.readBytes(20));
  return { type: Ce.Address, version: t, hash160: n };
}
function wb(e) {
  const t = [];
  return t.push(e.prefix), t.push(wc(e.address)), e.prefix === oc.Contract && t.push(ga(e.contractName)), ln(t);
}
function p6(e) {
  const t = e.readUInt8Enum(oc, (s) => {
    throw new gr(`Unexpected Principal payload type: ${s}`);
  }), n = pa(e);
  if (t === oc.Standard)
    return { type: Ce.Principal, prefix: t, address: n };
  const r = Ir(e);
  return {
    type: Ce.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ga(e) {
  const t = [], n = va(e.content), r = n.byteLength;
  return t.push(Xt(yc(r, e.lengthPrefixBytes))), t.push(n), ln(t);
}
function Ir(e, t, n) {
  t = t || 1;
  const r = gu(ct(e.readBytes(t))), s = Eh(e.readBytes(r));
  return hi(s, t, n ?? 128);
}
function g6(e) {
  return hi(e, 4, 1e5);
}
function hg(e) {
  if (e && Ab(e, Bl))
    throw new Error(`Memo exceeds maximum length of ${Bl} bytes`);
  return { type: Ce.MemoString, content: e };
}
function y6(e) {
  const t = [], n = va(e.content), r = N6(ct(n), Bl * 2);
  return t.push(Xt(r)), ln(t);
}
function mb(e) {
  let t = Eh(e.readBytes(Bl));
  return t = t.replace(/\u0000*$/, ""), { type: Ce.MemoString, content: t };
}
function bb(e) {
  const t = [];
  return t.push(wc(e.address)), t.push(ga(e.contractName)), t.push(ga(e.assetName)), ln(t);
}
function yf(e) {
  return {
    type: Ce.AssetInfo,
    address: pa(e),
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
  n.push(Xt(yc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Co(r));
  return ln(n);
}
function xb(e, t, n) {
  const r = gu(ct(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Ce.Address:
        s.push(pa(e));
        break;
      case Ce.LengthPrefixedString:
        s.push(Ir(e));
        break;
      case Ce.MemoString:
        s.push(mb(e));
        break;
      case Ce.AssetInfo:
        s.push(yf(e));
        break;
      case Ce.PostCondition:
        s.push(m6(e));
        break;
      case Ce.PublicKey:
        s.push(hf(e));
        break;
      case Ce.TransactionAuthField:
        s.push(d6(e));
        break;
    }
  return Nh(s, n);
}
function w6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(wb(e.principal)), (e.conditionType === nr.Fungible || e.conditionType === nr.NonFungible) && t.push(bb(e.assetInfo)), e.conditionType === nr.NonFungible && t.push(sn(e.assetName)), t.push(e.conditionCode), e.conditionType === nr.STX || e.conditionType === nr.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Rs("The post-condition amount may not be larger than 8 bytes");
    t.push(Is(e.amount, !1, 8));
  }
  return ln(t);
}
function m6(e) {
  const t = e.readUInt8Enum(nr, (i) => {
    throw new gr(`Could not read ${i} as PostConditionType`);
  }), n = p6(e);
  let r, s, o;
  switch (t) {
    case nr.STX:
      return r = e.readUInt8Enum(rc, (a) => {
        throw new gr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Ce.PostCondition,
        conditionType: nr.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case nr.Fungible:
      return s = yf(e), r = e.readUInt8Enum(rc, (a) => {
        throw new gr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${ct(e.readBytes(8))}`), {
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
        throw new gr(`Could not read ${a} as FungibleConditionCode`);
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
  return ln([e, t]);
}
function b6(e) {
  return new Uint8Array([e.type]);
}
function x6(e) {
  return e.type === ae.OptionalNone ? new Uint8Array([e.type]) : go(e.type, sn(e.value));
}
function S6(e) {
  const t = new Uint8Array(4);
  return fi(t, e.buffer.length, 0), go(e.type, yu(t, e.buffer));
}
function v6(e) {
  const t = Ah(C$(e.value, BigInt(G$)), Qm);
  return go(e.type, t);
}
function A6(e) {
  const t = Ah(e.value, Qm);
  return go(e.type, t);
}
function E6(e) {
  return go(e.type, wc(e.address));
}
function k6(e) {
  return go(e.type, yu(wc(e.address), ga(e.contractName)));
}
function $6(e) {
  return go(e.type, sn(e.value));
}
function I6(e) {
  const t = [], n = new Uint8Array(4);
  fi(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = sn(r);
    t.push(s);
  }
  return go(e.type, ln(t));
}
function L6(e) {
  const t = [], n = new Uint8Array(4);
  fi(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = hi(s);
    t.push(ga(o));
    const i = sn(e.data[s]);
    t.push(i);
  }
  return go(e.type, ln(t));
}
function Sb(e, t) {
  const n = [], r = t == "ascii" ? Zm(e.data) : va(e.data), s = new Uint8Array(4);
  return fi(s, r.length, 0), n.push(s), n.push(r), go(e.type, ln(n));
}
function C6(e) {
  return Sb(e, "ascii");
}
function T6(e) {
  return Sb(e, "utf8");
}
function sn(e) {
  switch (e.type) {
    case ae.BoolTrue:
    case ae.BoolFalse:
      return b6(e);
    case ae.OptionalNone:
    case ae.OptionalSome:
      return x6(e);
    case ae.Buffer:
      return S6(e);
    case ae.UInt:
      return A6(e);
    case ae.Int:
      return v6(e);
    case ae.PrincipalStandard:
      return E6(e);
    case ae.PrincipalContract:
      return k6(e);
    case ae.ResponseOk:
    case ae.ResponseErr:
      return $6(e);
    case ae.List:
      return I6(e);
    case ae.Tuple:
      return L6(e);
    case ae.StringASCII:
      return C6(e);
    case ae.StringUTF8:
      return T6(e);
    default:
      throw new Rs("Unable to serialize. Invalid Clarity Value.");
  }
}
function B6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const pg = /* @__PURE__ */ new Map();
function vb(e, t) {
  const n = pg.get(e);
  if (n !== void 0)
    return n(t);
  const r = B6(e);
  return pg.set(e, r), vb(e, t);
}
class Xa {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return j$(this.readBytes(4), 0);
  }
  readUInt8() {
    return D$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return O$(this.readBytes(2), 0);
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
    if (vb(t, r))
      return r;
    throw n(r);
  }
}
function Lr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Xa(Xt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Xa(e) : t = e;
  switch (t.readUInt8Enum(ae, (r) => {
    throw new gr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ae.Int:
      return V8(t.readBytes(16));
    case ae.UInt:
      return An(t.readBytes(16));
    case ae.Buffer:
      const r = t.readUInt32BE();
      return db(t.readBytes(r));
    case ae.BoolTrue:
      return lb();
    case ae.BoolFalse:
      return ub();
    case ae.PrincipalStandard:
      const s = pa(t);
      return R8(s);
    case ae.PrincipalContract:
      const o = pa(t), i = Ir(t);
      return cb(o, i);
    case ae.ResponseOk:
      return Y8(Lr(t));
    case ae.ResponseErr:
      return X8(Lr(t));
    case ae.OptionalNone:
      return fb();
    case ae.OptionalSome:
      return hb(Lr(t));
    case ae.List:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Lr(t));
      return q8(c);
    case ae.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = Ir(t).content;
        if (I === void 0)
          throw new gr('"content" is undefined');
        h[I] = Lr(t);
      }
      return br(h);
    case ae.StringASCII:
      const d = t.readUInt32BE(), w = N$(t.readBytes(d));
      return $t(w);
    case ae.StringUTF8:
      const y = t.readUInt32BE(), v = Eh(t.readBytes(y));
      return W8(v);
    default:
      throw new gr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const M6 = (e) => e.length % 2 == 0 ? e : `0${e}`, N6 = (e, t) => e.padEnd(t, "0"), Ab = (e, t) => e ? va(e).length > t : !1;
function wf(e) {
  return Rw(e);
}
const sc = (e) => c8(Ch(e)), Ph = (e) => ct(D8(e)), _6 = (e) => ct(sc(e)), P6 = (e) => {
  const t = sc(e), n = yu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = sc(n);
  return ct(r);
}, U6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = sc(r);
  return ct(s);
}, O6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = Ch(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = ln(o), a = sc(i);
  return ct(a);
};
function H6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Eb(e) {
  const t = sn(e);
  return `0x${ct(t)}`;
}
function D6(e) {
  return Lr(e);
}
const Ji = (e) => {
  try {
    return xi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Uh() {
  return {
    type: Ce.MessageSignature,
    data: ct(new Uint8Array(wu))
  };
}
function kb(e, t, n, r) {
  const s = Mh(0, e, 1, [ha(t)]).hash160, o = Aa(ha(t)) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Wn(n, !1),
    fee: Wn(r, !1),
    keyEncoding: o,
    signature: Uh()
  };
}
function ic(e) {
  return "signature" in e;
}
function gg(e) {
  return e === Ft.SerializeP2SH || e === Ft.SerializeP2WSH;
}
function F6(e) {
  return e === Ft.SerializeP2SHNonSequential || e === Ft.SerializeP2WSHNonSequential;
}
function yg(e) {
  const t = wf(e);
  return t.nonce = 0, t.fee = 0, ic(t) ? t.signature = Uh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function j6(e) {
  const t = [
    e.hashMode,
    Xt(e.signer),
    Is(e.nonce, !1, 8),
    Is(e.fee, !1, 8),
    e.keyEncoding,
    Bh(e.signature)
  ];
  return ln(t);
}
function R6(e) {
  const t = [
    e.hashMode,
    Xt(e.signer),
    Is(e.nonce, !1, 8),
    Is(e.fee, !1, 8)
  ], n = Nh(e.fields);
  t.push(_h(n));
  const r = new Uint8Array(2);
  return H$(r, e.signaturesRequired, 0), t.push(r), ln(t);
}
function z6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt(`0x${ct(t.readBytes(8))}`), s = BigInt(`0x${ct(t.readBytes(8))}`), o = t.readUInt8Enum(Wt, (a) => {
    throw new gr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ft.SerializeP2WPKH && o != Wt.Compressed)
    throw new gr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function G6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt("0x" + ct(t.readBytes(8))), s = BigInt("0x" + ct(t.readBytes(8))), o = xb(t, Ce.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Ce.PublicKey:
        Aa(u.contents) || (i = !0);
        break;
      case Ce.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Ys("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ft.SerializeP2WSH || e === Ft.SerializeP2WSHNonSequential))
    throw new Ys("Uncompressed keys are not allowed in this hash mode");
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
  return ic(e) ? j6(e) : R6(e);
}
function Qu(e) {
  const t = e.readUInt8Enum(Ft, (n) => {
    throw new gr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ft.SerializeP2PKH || t === Ft.SerializeP2WPKH ? z6(t, e) : G6(t, e);
}
function $b(e, t, n, r) {
  const o = e + ct(new Uint8Array([t])) + ct(Is(n, !1, 8)) + ct(Is(r, !1, 8));
  if (Xt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ph(Xt(o));
}
function Ib(e, t, n) {
  const r = 33 + wu, s = Aa(t) ? Wt.Compressed : Wt.Uncompressed, o = e + M6(s.toString(16)) + n.data, i = Xt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ph(i);
}
function K6(e, t, n, r, s) {
  const o = $b(e, t, n, r), i = r6(s, o), a = o6(s), c = Ib(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Lb(e, t, n, r, s, o) {
  const i = $b(e, t, n, r), a = ha(Z8(i, o, s)), c = Ib(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function V6() {
  const e = kb(Ft.SerializeP2PKH, "", 0, 0);
  return e.signer = h6().hash160, e.keyEncoding = Wt.Compressed, e.signature = Uh(), e;
}
function wg(e, t, n) {
  return ic(e) ? X6(e, t, n) : Y6(e, t, n);
}
function X6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Lb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Mh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Ys(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Y6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ce.PublicKey:
        Aa(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Ce.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Lb(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (gg(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Ys("Too many signatures");
        break;
    }
  if (gg(e.hashMode) && i !== e.signaturesRequired || F6(e.hashMode) && i < e.signaturesRequired)
    throw new Ys("Incorrect number of signatures");
  if (o && (e.hashMode === Ft.SerializeP2WSH || e.hashMode === Ft.SerializeP2WSHNonSequential))
    throw new Ys("Uncompressed keys are not allowed in this hash mode");
  const a = Mh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Ys(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Cb(e) {
  return {
    authType: nn.Standard,
    spendingCondition: e
  };
}
function Tb(e, t) {
  return {
    authType: nn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || kb(Ft.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function mg(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case nn.Standard:
        return Cb(yg(e.spendingCondition));
      case nn.Sponsored:
        return Tb(yg(e.spendingCondition), V6());
      default:
        throw new Pl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function q6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      return wg(e.spendingCondition, t, nn.Standard);
    case nn.Sponsored:
      return wg(e.spendingCondition, t, nn.Standard);
    default:
      throw new Pl("Invalid origin auth type");
  }
}
function W6(e, t) {
  switch (e.authType) {
    case nn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Wn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case nn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Wn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Z6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Wn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function J6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Wn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Q6(e, t) {
  const n = {
    ...t,
    nonce: Wn(t.nonce, !1),
    fee: Wn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function e5(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case nn.Standard:
      t.push(Ju(e.spendingCondition));
      break;
    case nn.Sponsored:
      t.push(Ju(e.spendingCondition)), t.push(Ju(e.sponsorSpendingCondition));
      break;
  }
  return ln(t);
}
function t5(e) {
  const t = e.readUInt8Enum(nn, (r) => {
    throw new gr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case nn.Standard:
      return n = Qu(e), Cb(n);
    case nn.Sponsored:
      n = Qu(e);
      const r = Qu(e);
      return Tb(n, r);
  }
}
class n5 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Wn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? R$, this.postConditionMode = o ?? fa.Deny, this.postConditions = s ?? Nh([]), i)
      this.anchorMode = X$(i);
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
    return t.auth = mg(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wf(this);
    return t.auth = mg(t.auth), t.txid();
  }
  verifyOrigin() {
    return q6(this.auth, this.verifyBegin());
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
    if (n && !ic(n)) {
      const r = Aa(t);
      n.fields.push(Yi(r ? Wt.Compressed : Wt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = K6(n, r, t.fee, t.nonce, s);
    return ic(t) ? t.signature = o : t.fields.push(Yi(s.data.byteLength === Jm ? Wt.Compressed : Wt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Ph(t);
  }
  setSponsor(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q6(this.auth, t);
  }
  setFee(t) {
    this.auth = W6(this.auth, t);
  }
  setNonce(t) {
    this.auth = Z6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = J6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Rs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Rs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Rs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Rs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Rs('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return fi(n, this.chainId, 0), t.push(n), t.push(e5(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(_h(this.postConditions)), t.push(yb(this.payload)), ln(t);
  }
}
function qi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Xa(Xt(e.slice(2))) : t = new Xa(Xt(e)) : e instanceof Uint8Array ? t = new Xa(e) : t = e;
  const n = t.readUInt8Enum(Ml, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = t5(t), o = t.readUInt8Enum(tr, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(fa, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = xb(t, Ce.PostCondition), c = u6(t);
  return new n5(n, s, c, a, i, o, r);
}
const r5 = G8, Ya = An, o5 = db;
const s5 = /* @__PURE__ */ new Set([4001, -31001]), i5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], a5 = ["result", "data", "payload", "response", "params"], bg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], xu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Ei = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, No = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, c5 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Bb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => c5(o, r)) === s
  );
}, Mb = (e) => e ? Bb(Ei()).some(
  (t) => {
    var n;
    return t.id === e && (xu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Nb = () => {
  if (typeof window > "u")
    return;
  const e = Ei(), t = Bb(e).filter(
    (n) => {
      var r;
      return xu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = No(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of i5) {
    const r = No(e, n) ?? (e === window ? void 0 : No(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, l5 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Ei(), n = No(t, e) ?? (t === window ? void 0 : No(window, e)) ?? iu(e);
  if (n)
    return n;
  if (xu(e) || Mb(e))
    return Nb();
}, Xc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, u5 = ["blockstack-session", "blockstack"], d5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of u5) {
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
d5();
const _b = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, hr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, f5 = (e) => {
  const t = hr(e);
  if (!t)
    return null;
  const n = _b(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, h5 = (e) => {
  const t = hr(e);
  if (!t)
    return null;
  const n = _b(t);
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
}, Js = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, ac = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Ji(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = ac(s, t + 1);
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
    const o = ac(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Ji(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ji(n.testnet) ? n.testnet.trim() : null;
}, xg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Pb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && s5.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, pi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = hr(n == null ? void 0 : n.message) ?? hr(t.message) ?? hr(t.error) ?? hr(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, ya = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw pi(t);
    if (t.status === "error")
      throw pi(t.result ?? t);
  }
  return e;
}, Sg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return ya(r);
  } catch (r) {
    throw pi(r);
  }
}, Ub = () => Nb(), Oh = () => {
  if (typeof window > "u")
    return;
  const e = Ei();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = No(e, t) ?? (e === window ? void 0 : No(window, t));
    if (n)
      return n;
  }
}, vg = () => {
  if (typeof window > "u")
    return;
  const e = Oh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Ei();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = No(t, n) ?? (t === window ? void 0 : No(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ll = (e) => {
  var r, s;
  const t = si();
  if (xu(t) || Mb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ei() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Ub();
}, ed = (e) => {
  const t = h5(e);
  if (!t)
    return null;
  try {
    const n = qi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ul = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = ed(e), r = f5(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? hr(e) ?? void 0 : void 0
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
  for (const a of bg)
    if (ed(s[a])) {
      o = hr(s[a]);
      break;
    }
  const i = hr(s.txId) || hr(s.txid) || hr(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? hr(s.txRaw) ?? void 0
    };
  for (const a of bg) {
    const c = ed(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: hr(s[a]) ?? void 0
      };
  }
  for (const a of a5) {
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
}, p5 = (e) => {
  const t = Ul(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, g5 = (e) => ({
  ...e,
  fee: Js(e.fee),
  nonce: Js(e.nonce),
  sponsored: e.sponsored === !0
}), Ag = (e) => ({
  recipient: e.recipient,
  amount: Js(e.amount) ?? "0",
  memo: e.memo,
  network: mf(e.network),
  address: e.stxAddress,
  fee: Js(e.fee),
  nonce: Js(e.nonce),
  sponsored: e.sponsored ?? !1
}), Ob = "WALLET_ADDRESS_MISMATCH", y5 = 45e3;
let qa = null;
const bf = (e) => {
  e && (qa = { address: e, at: Date.now() });
}, w5 = () => {
  qa = null;
}, m5 = () => qa && Date.now() - qa.at <= y5 ? qa.address : null, b5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, x5 = async (e) => {
  w5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = ya(await e.request("wallet_connect")), n = ac(t);
  return bf(n), n;
}, S5 = async (e, t, n, r) => {
  try {
    return ya(await e.request(t, n));
  } catch (s) {
    const o = pi(s);
    if (!b5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await x5(e);
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
        { code: i ? Ob : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return ya(await e.request(t, n));
    } catch (a) {
      throw pi(a);
    }
  }
};
let Eg = 3e4;
const v5 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${Eg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Eg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, A5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ob }
      );
    return c;
  }, s = m5();
  if (s)
    return Xc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  Xc(n, "account-read");
  try {
    const c = ya(
      await v5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = ac(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Pb(c))
      throw pi(c);
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
    i = ya(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), pi(c);
  }
  const a = ac(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return bf(a), r(a, "wallet_connect");
}, E5 = async (e, t) => {
  if (!ll(e)) {
    const o = await Sg(
      e,
      "stx_transferStx",
      Ag(t)
    );
    return td(o);
  }
  const n = Oh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await Sg(
      n,
      "stx_transferStx",
      Ag(t)
    );
    return td(o);
  }
  const r = Ub();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await A5(r, t.stxAddress);
  const s = await S5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Js(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Js(t.fee) } : {}
    },
    t.stxAddress
  );
  return td(s);
}, k5 = () => si(), Hb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = si(), t = e ? l5(e) : void 0;
  if (t)
    return t;
  const n = Ei() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, kg = (e, t) => {
  const n = Hb(), r = g5({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, p5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return zc(r, t);
  if (ll(n) && !Oh()) {
    const s = vg();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: si(),
        route: "legacy-transaction-request"
      }), zc(r, s);
  }
  return void E5(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (xg(s) && ll(n)) {
      const a = vg();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: si(),
          route: "legacy-transaction-request"
        }), zc(r, a);
        return;
      }
    }
    if (xg(s) && !ll(n)) {
      zc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Pb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, $5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), $g = (e) => Eb(e).replace(/^0x/, ""), Ig = "This wallet cannot sign messages. Try Xverse or Leather.", Lg = (e) => typeof (e == null ? void 0 : e.request) == "function", Cg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", I5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, L5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function C5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: $g(t.message),
    domain: $g(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function T5(e, t) {
  const n = await v$({
    domain: t.domain,
    message: t.message,
    network: pu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? $5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function nd(e) {
  var s, o;
  const t = k5() || "", n = /xverse/i.test(t);
  let r = Hb();
  if (n && !Cg(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Cg(r))
    try {
      return await T5(r, e);
    } catch (i) {
      if (n || !Lg(r) || !L5(i)) throw i;
    }
  if (!n && Lg(r))
    try {
      return await C5(r, e);
    } catch (i) {
      throw I5(i) ? new Error(Ig) : i;
    }
  throw new Error(Ig);
}
const Tg = 1000000n, Bo = 1000000n, Ol = 50n, an = 3000n, Yr = 300n, _a = 3000n, B5 = 50000n, M5 = 300n, N5 = 200n, Su = 15000n, jn = (e) => e + Ol;
function Dr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / Tg}.${(n % Tg).toString().padStart(6, "0")}`;
}
function Bg(e, t = Yr) {
  return e <= an ? 0 : Number((e - an) / jn(t));
}
function rd(e, t = 0n) {
  const n = Bo - e - t;
  return n > 0n ? n : 0n;
}
function _5(e, t = Yr) {
  return e > Bo ? "over" : e < an + jn(t) ? "empty" : e < B5 ? "low" : "ok";
}
const P5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", U5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", O5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function H5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || O5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== P5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Db = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", od = 3, D5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", F5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Mg = 1, [xf, Fb] = Db.split("."), Er = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Sf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function j5(e) {
  return Er(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function ks(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function jb(e, t = []) {
  const n = await ks(`/v2/contracts/call-read/${xf}/${Fb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: xf, arguments: t.map((r) => "0x" + Er(sn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Rr(Lr(n.result));
}
async function R5() {
  const e = await ks(`/v2/contracts/source/${xf}/${Fb}?proof=0`);
  if (typeof e.source != "string" || await j5(e.source) !== U5) throw Error("Deployed source does not match the tested helper.");
  if (H5(await jb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Rb(e) {
  return e.startsWith("SP") && Ji(e) && !e.includes(".");
}
async function z5(e) {
  var r;
  if (!Rb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await ks(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await ks(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function G5(e) {
  const t = await ks(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function K5(e, t) {
  var s, o;
  const n = await jb("get-owner", [Ya(e), Ya(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Rb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function V5(e, t) {
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
async function X5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function Y5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = qi(Sf(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Xi(ja(Nl.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || Xi(r.contractAddress) + "." + r.contractName.content !== Db || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Er(sn(r.functionArgs[0])) !== Er(sn(Ya(e.core))) || Er(sn(r.functionArgs[1])) !== Er(sn(Ya(e.song))) || Er(sn(r.functionArgs[2])) !== Er(sn(o5(Sf(e.id)))) || e.amount !== "50" || t.postConditionMode !== fa.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== rc.Equal || o.principal.prefix !== 2 || Xi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Xi(r.contractAddress) + "." + r.contractName.content !== D5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Er(sn(r.functionArgs[0])) !== Er(sn(Ya(e.song))) || typeof e.liked != "boolean" || Er(sn(r.functionArgs[1])) !== Er(sn(r5(e.liked))) || e.amount !== "0" || t.postConditionMode !== fa.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Rr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const q5 = "xtrata.xyz/radio/listening-wallet", W5 = "Link a temporary listening wallet for pay-per-play; no spending permission", io = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Ji(e), Z5 = (e) => ({
  domain: br({ name: $t(q5), version: $t("1"), "chain-id": An(1) }),
  message: br({
    purpose: $t(W5),
    main: $t(e.main),
    listening: $t(e.listening),
    issued: An(e.issued)
  })
}), zb = 100000n, J5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Q5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !io(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= zb).sort(J5);
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
async function eI(e, t, n = 4) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Yc}&offset=${i}`, s = Hl(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - Yc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= Yc ? s : Hl(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = Q5(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - Yc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const $o = 50, tI = 6, nI = 20, Ng = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function _g(e, t) {
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
async function rI(e, t, n) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Hl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=0`));
    if (!s || s.total > tI * $o) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = $o; i < s.total; i += $o) {
      const a = Hl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${$o}&offset=${u}`, a = _g(await t(i(0)), e);
      if (!a || a.total > nI * $o) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = $o; u < a.total; u += $o) {
        const h = _g(await t(i(u)), e);
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
function oI(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(Ng).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : io(d.sender) && y >= zb ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && io(d.recipient) && d.amount > 0n).sort(Ng), a = i.reduce((d, w) => d + w.amount, 0n), c = o - n - a;
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
function sI(e, t) {
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
function Pg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const qc = 1500n, ul = [100, 250, 500], iI = (e, t) => BigInt(e) * jn(t), Pa = ["prepared", "signed", "unknown", "pending"], aI = 30 * 6e4, Dl = 6e4, Hi = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, cI = 3e3, Fl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", sd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function lI(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, y = null, v = !1, S = "", I = "", U = 0, P, A = null, T, B = [], X, Q = -1 / 0;
  const oe = /* @__PURE__ */ new Set();
  let q = null, m = !1, L = 0, _ = null, M = null, W = !1, F = null, we = !1, ce = null, Ke = !1, $ = !1, R = !1, ue = !1, be = !1, _e = 0, Ae = null, yt = Promise.resolve();
  const je = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Yr.toString()), Ne = (b) => !!o && !(o.features ?? []).includes(b), Pe = (b, k) => `xtrata.ppp.v1.${b}:${k}`, Bn = "xtrata.ppp.v1.as-main", En = () => {
    if (e.main()) return;
    const b = e.store.get(Bn);
    return b && io(b) ? b : void 0;
  }, pt = () => e.main() ?? En(), Bt = (b = o == null ? void 0 : o.address) => {
    if (!b) return [];
    try {
      const k = JSON.parse(e.store.get(Pe("entries", b)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Ot = (b) => {
    const k = [b, ...Bt(b.address).filter((G) => !(G.txid === b.txid && G.kind === b.kind))].slice(0, 200);
    e.store.set(Pe("entries", b.address), JSON.stringify(k));
  }, z = (b = o == null ? void 0 : o.address) => !!b && e.store.get(Pe("on", b)) !== "0", O = (b) => {
    o != null && o.address && e.store.set(Pe("on", o.address), b ? "1" : "0");
  }, ee = () => Bt().filter((b) => Pa.includes(b.status)), re = () => Xe() ? [...ee(), ...Bt(qe()).filter((b) => Pa.includes(b.status))] : ee(), le = () => bt(o == null ? void 0 : o.address), bt = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Pe("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, De = (b, k = o == null ? void 0 : o.address) => {
    k && e.store.set(Pe("deposit", k), JSON.stringify(b));
  };
  let Ge = null;
  const Et = (b = Dl) => {
    const k = e.now();
    Ge = { since: Ge && k < Ge.until ? Ge.since : k, until: Math.max((Ge == null ? void 0 : Ge.until) ?? 0, k + b) };
  }, Fe = () => !!Ge && e.now() < Ge.until && (i === void 0 || i < an + jn(je())), Le = () => !!le() || Fe(), qe = () => Ne("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Xe = () => !!(o != null && o.address) && qe() !== o.address, We = () => Xe() ? c && c.for === qe() ? c.value : void 0 : i, zt = () => Ne("likeFee") ? N5 : M5, gn = (b) => b !== void 0 && b < an + zt(), dn = () => ee().filter((b) => e.now() - b.created > aI && oe.has(b.txid)), Zn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!pt() || r === pt() && !t.allowed), Ht = () => Zn() && !(o != null && o.linked), yn = () => {
    const b = pt();
    return !Ht() && !!b && !!(o != null && o.linked) && o.linked !== b;
  }, xr = (b) => Pe("return-to", b), qr = (b = o == null ? void 0 : o.address) => {
    if (!b) return;
    const k = e.store.get(xr(b));
    return k && io(k) && k !== b ? k : void 0;
  }, zn = (b = o == null ? void 0 : o.address) => q && q.for === b ? q.res : null;
  function Sr() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const b = qr();
    if (b) return { to: b, kind: "chosen" };
    const k = zn();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const wn = (b) => Pe("gift", b);
  function jt() {
    const b = o == null ? void 0 : o.address;
    if (!b) return null;
    if ((F == null ? void 0 : F.for) === b) return F.info;
    try {
      const k = JSON.parse(e.store.get(wn(b)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const ut = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let Mt = null, un = null, Cr = !1;
  const yo = (b) => Pe("award-claim", b), E = (b) => Pe("award-send", b), H = (b) => {
    try {
      const k = JSON.parse(e.store.get(E(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, V = (b) => {
    try {
      const k = JSON.parse(e.store.get(yo(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var $e;
    const k = ut();
    if (!k || !e.awardStatus || Cr) return;
    const G = (Mt == null ? void 0 : Mt.for) === k ? Mt : null, ne = G == null ? void 0 : G.view.state, Be = ne === "not-a-player" && (($e = jt()) == null ? void 0 : $e.drop) === "players", Y = G ? Be ? 2e4 : ne === "off" || ne === "not-a-player" ? 30 * 6e4 : V(k) || H(k) ? 2e4 : ne === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(G && !b && e.now() - G.at < Y)) {
      Cr = !0;
      try {
        const xe = await e.awardStatus(k);
        if (Mt = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(yo(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (un == null ? void 0 : un.for) !== k)
          try {
            un = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            un = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Mt = { for: k, view: G && G.view.state !== "off" && G.view.state !== "not-a-player" ? { ...G.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Cr = !1;
      }
    }
  }
  function J() {
    const b = ut();
    if (!b || (Mt == null ? void 0 : Mt.for) !== b) return null;
    const k = Mt.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const G = k.state === "claimed" ? null : V(b), ne = k.state === "claimed" && k.holds !== !1 ? H(b) : null;
    return { ...k, ...(un == null ? void 0 : un.for) === b ? { name: un.name } : {}, ...G ? { claimTx: G.txid } : {}, ...ne ? { sendTx: ne.txid } : {} };
  }
  async function te() {
    var Be;
    const b = o == null ? void 0 : o.address;
    if (!b || !e.giftInfo || !((Be = t == null ? void 0 : t.gifts) != null && Be.enabled) || we) return;
    const k = (F == null ? void 0 : F.for) === b ? F : null, G = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < G) return;
    we = !0;
    const ne = jt();
    try {
      const Y = await e.giftInfo(b);
      F = { for: b, info: Y, ok: !0, at: e.now() }, e.store.set(wn(b), JSON.stringify(Y));
    } catch {
      F = { for: b, info: ne, ok: !1, at: e.now() };
    } finally {
      we = !1;
    }
  }
  const Te = () => Bt().reduce((b, k) => Pa.includes(k.status) ? b + BigInt(k.amount || "0") + BigInt(k.fee || "0") : b, 0n);
  function ke() {
    if (i === void 0) return 0;
    const b = i - Te() - BigInt(Zt.length) * jn(je());
    return b > 0n ? Bg(b, je()) : 0;
  }
  const Re = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", xt = "EMPTY — ADD STX TO PLAY";
  function Qe() {
    if (!(t != null && t.here)) return null;
    const b = (k, G) => ({ reason: k, text: G });
    switch (St()) {
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
        return Le() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Xe() ? Re : xt);
      case "ready":
        return !z() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : R ? ke() < 1 ? b("out", Xe() ? Re : xt) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const dt = () => {
    var b;
    return !!(o != null && o.address) && Xe() && !!((b = jt()) != null && b.player);
  };
  function kt() {
    return dt() ? { locked: !0, known: !0 } : null;
  }
  const Ye = 3 * 6e4, C = () => !!jt() && !!e.history && !(o != null && o.linked);
  async function Ee() {
    const b = o.address, k = jt(), { balance: G, nonce: ne } = await e.chain.account(b), Be = await e.history(b, !0);
    if (!Be.ok) return null;
    const Y = oI({ self: b, balance: G, inbound: Be.inbound, outgoing: Be.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!Y.ok) return null;
    const $e = sI(Y.parts, _a);
    return { balance: G, nonce: ne, parts: Y.parts, steps: $e.steps, tooSmall: $e.tooSmall.length };
  }
  const wt = () => Ke ? { state: "unavailable" } : !ce || e.now() - ce.at > Ye || i !== void 0 && i !== ce.balance ? { state: "none" } : ce.plan;
  function St() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = pt();
    if (!Ht()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : yn() ? "wrong-wallet" : o.state === "known" ? "locked" : !Ht() && o.linked !== b ? "link" : i === void 0 ? "loading" : i > Bo && !o.backedUp ? "over" : i < an + jn(je()) ? "fund" : "ready" : "loading";
  }
  const Wr = () => {
    var b, k, G, ne, Be;
    return {
      step: St(),
      busy: u,
      message: S,
      error: I,
      notice: or(),
      gate: t,
      main: pt(),
      mainConnected: !!e.main(),
      standIn: En(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: J(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.hasBackup),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((Y) => Y === "over" && (o != null && o.backedUp) ? "ok" : Y)(_5(i, je())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > Bo && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Bg(i, je()),
      allowance: i === void 0 ? Bo : rd(i, BigInt(((b = le()) == null ? void 0 : b.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: z(),
      entries: Bt(),
      depositTxid: ((k = le()) == null ? void 0 : k.txid) ?? P,
      depositPending: Le(),
      arrival: Le() ? { since: ((G = le()) == null ? void 0 : G.at) ?? (Ge == null ? void 0 : Ge.since) ?? e.now(), graceMs: Dl } : null,
      walletOutdated: Ne("like"),
      canAnother: !!o && !Ne("another"),
      canForget: !!o && !Ne("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (F == null ? void 0 : F.for) === o.address && F.ok ? !!F.info : null,
      linkedListening: X && X === pt() ? B.map((Y) => Y.listening) : [],
      serverLinked: !!A && T === `${pt()}:${o == null ? void 0 : o.address}`,
      stuck: dn().length,
      armed: ue,
      queued: Zt.length,
      solo: Ht(),
      returnTo: (ne = Sr()) == null ? void 0 : ne.to,
      returnToKind: (Be = Sr()) == null ? void 0 : Be.kind,
      funderState: (() => {
        const Y = zn();
        return Y ? Y.ok ? Y.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Y = zn();
        return !!Y && Y.ok && Y.distinct > 1;
      })(),
      walletCannotSolo: Ht() && Ne("standalone"),
      walletCannotMulti: Ne("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((Y) => Y !== pt() && Y !== (o == null ? void 0 : o.linked)),
      creditedTo: Ht() && (o != null && o.address) && (_ == null ? void 0 : _.for) === o.address && _.main ? _.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(Pe("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (M == null ? void 0 : M.for) === o.address && M.unused,
      gift: (() => {
        const Y = jt();
        return Y ? { player: Y.player, from: Y.from, source: Y.source, amount: Y.amount, ...Y.drop !== void 0 ? { drop: Y.drop } : {} } : null;
      })(),
      giftPlays: jt() ? ke() : 0,
      playCost: jn(je()),
      giftStop: Qe(),
      albumLock: kt(),
      returnPlan: wt(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Ne("slots"),
      likeFunds: (() => {
        var xe;
        const Y = qe();
        if (!Y || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const $e = We();
        return { address: Y, balance: $e, low: gn($e), album: Xe(), pending: !!bt(Y), txid: (xe = bt(Y)) == null ? void 0 : xe.txid, main: pt() };
      })()
    };
  }, or = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ft = (b, k = "") => {
    S = b, I = k, e.changed();
  };
  async function on(b, k) {
    if (!u) {
      u = b, I = "", e.changed();
      try {
        await k();
      } catch (G) {
        const ne = G instanceof Error ? G.message : String(G);
        I = /Cancelled in the listening wallet/.test(ne) ? "" : ne, I || (S = "Not now. Nothing was signed.", be = !0);
      } finally {
        u = null, await Nn(!0);
      }
    }
  }
  const Cs = () => !!(t != null && t.enabled) && t.here && (Ht() || !!pt() && t.allowed), sr = () => Cs() && !yn(), wo = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Tr = () => {
    if (yn()) throw new Error(wo());
  };
  async function Mn() {
    if (!Cs()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const fn = (b) => {
    const k = pt();
    return b.request("listening.status", k ? { main: k } : void 0);
  };
  async function Ts(b = !1) {
    o != null && o.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await lt(b)));
  }
  async function lt(b = !1) {
    const k = qe();
    if (!(!Xe() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function Bs(b) {
    if ((X !== b || e.now() - Q >= 6e4) && (B = await e.links(b), X = b, Q = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === b) return;
    const k = `${b}:${o.address}`;
    T === k && A || (A = B.find((G) => G.listening === o.address) ?? null, T = k);
  }
  async function mo() {
    const b = o == null ? void 0 : o.address;
    if (!Ht() || !b || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const k = zn(b);
    if (k != null && k.ok && k.funder) return;
    const G = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, L - 1), 30 * 6e4);
    if (!(q && q.for === b && e.now() - q.at < G)) {
      m = !0;
      try {
        q = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        q = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      L = q.res.ok ? 0 : L + 1;
    }
  }
  async function Ms() {
    const b = o == null ? void 0 : o.address;
    if (!(!Ht() || !b || o != null && o.linked || !e.mainOf || W) && !(_ && _.for === b && (_.ok || e.now() - _.at < 6e4))) {
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
  async function Oo() {
    const b = o == null ? void 0 : o.address;
    if (!(!b || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === b) && e.store.get(Pe("created", b)) !== "1")
      try {
        M = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function bo() {
    var Be;
    const b = o == null ? void 0 : o.address;
    if (!b) return !1;
    let k, G = !1;
    const ne = /* @__PURE__ */ new Map();
    for (const Y of re())
      try {
        const $e = await e.chain.transaction(Y.txid);
        if (!$e) {
          if (oe.add(Y.txid), e.now() - Y.created > 15 * 6e4 && !ne.has(Y.address) && ne.set(Y.address, await e.chain.confirmedNonce(Y.address)), k = ne.get(Y.address), k !== void 0 && k > BigInt(Y.nonce)) {
            Ot({ ...Y, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((Y.status === "unknown" || Y.status === "signed") && Y.raw)
            try {
              await e.chain.broadcast(Y.raw, Y.txid), Ot({ ...Y, status: "pending" });
            } catch (Me) {
              Hi(Me) && Ot({ ...Y, status: "failed", note: Me.message, raw: void 0 });
            }
          continue;
        }
        oe.delete(Y.txid);
        const xe = String($e.tx_status);
        if (xe === "success" && $e.canonical !== !1 && $e.is_unanchored === !1) {
          if (Ot({ ...Y, status: "confirmed", confirmedAt: e.now(), actualFee: String($e.fee_rate ?? Y.fee), raw: void 0 }), G = !0, Y.kind === "like" && (v = !0, Y.status !== "confirmed" && typeof Y.liked == "boolean"))
            try {
              (Be = e.likeConfirmed) == null || Be.call(e, Y.song, Y.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? Ot({ ...Y, status: "failed", note: xe, raw: void 0 }) : Y.status !== "pending" && Ot({ ...Y, status: "pending" });
      } catch {
      }
    for (const Y of Xe() ? [b, qe()] : [b]) {
      const $e = bt(Y);
      if ($e)
        try {
          const xe = await e.chain.transaction($e.txid), Me = String((xe == null ? void 0 : xe.tx_status) ?? "");
          (Me === "success" && xe.is_unanchored === !1 || Me.startsWith("abort_") || Me.startsWith("dropped_") || !xe && e.now() - $e.at > 2 * 36e5) && (De(null, Y), Me === "success" && Et(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return G;
  }
  async function Nn(b = !1) {
    var k;
    try {
      const G = pt();
      if ((b || !t || r !== G || e.now() - n > 3e5) && (t = await e.config(G), n = e.now(), r = G), !t.enabled || !t.here || !Ht() && (!G || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ue && _s(), e.changed();
        return;
      }
      await Mn(), o = await fn(s), yn() && o.state === "unlocked" && (vo(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await fn(s)), G && t.allowed && await Bs(G), await Ts(b), await mo(), await Ms(), await Oo(), await te(), await D(), await bo() && await Ts(!0), await lt(), await ka(), U = 0;
    } catch {
      U++;
    }
    if (St() === "locked" ? Ea() : ue && _s(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), Zt.length && !Nr && Gn();
  }
  async function Ho(b) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Ne("slots")) return;
    const G = Number(e.store.get(Pe("slot", k)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: ne } = await e.chain.account(o.address);
        if (ne >= an + jn(je())) return;
        await b.request("listening.openSlot", { slot: G }), o = await fn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ns(b, k) {
    var Y;
    Tr();
    const G = !(o != null && o.address) || z(o.address), ne = o != null && o.linked ? (Y = e.nameOf) == null ? void 0 : Y.call(e, o.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: G ? kn() : void 0, anyPasskey: k, ...pt() ? { main: pt() } : {}, ...ne ? { label: ne } : {} }), o = await fn(b), G && (z(o.address) ? await $n() : await b.request("listening.stop")), await Ho(b), ft(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Be = y;
    y = null, Be && e.now() - Be.at < 12e4 && setTimeout(() => void Nn(!0).then(() => Hs(Be)), 0);
  }
  function Ea() {
    ue || u || be || _e >= 3 || !s || !(o != null && o.address) || (ue = !0, yt = (async () => {
      try {
        await Ns(s, !1), _e = 0;
      } catch (b) {
        const k = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(k) ? Ae || (be = !0, ft("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (_e++, I = k);
      } finally {
        ue = !1;
        const b = Ae;
        Ae = null, b ? await b() : await Nn(!0);
      }
    })());
  }
  async function _s(b) {
    ue && (Ae = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await yt), b && await b(), e.changed();
  }
  const kn = () => ({
    fee: je().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: Bo.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function $n() {
    if (!(o != null && o.address)) return !1;
    if (R || (R = await e.tabLock(o.address)), !R)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function xo(b, k) {
    const G = o.address, { balance: ne, nonce: Be } = k ?? await e.chain.account(G);
    i = ne;
    const Y = await s.request("listening.prepareReturn", {
      mode: b.mode,
      balance: ne.toString(),
      nonce: Be.toString(),
      fee: _a.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (Y.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const $e = b.mode === "amount" ? b.amount : b.mode === "all" ? ne - _a : ne - Bo - _a, xe = qi(Y.raw);
    if (Rr(xe.payload.recipient).value !== b.to || String(xe.payload.amount) !== Y.amount || $e !== void 0 && Y.amount !== $e.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Me = {
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
    e.validate(Me), Ot(Me);
    try {
      await e.chain.broadcast(Y.raw, Y.txid), Ot({ ...Me, status: "pending" });
    } catch (pe) {
      throw Ot({ ...Me, status: "unknown", note: pe.message }), pe;
    }
    return Y;
  }
  const Br = Su, Do = _a;
  async function Fo(b, k, G) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Ne("slots") || Ne("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const ne = o.slot ?? 0;
    if (b === k || ![b, k].includes(ne) || ![b, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Be = o.root ?? o.address, Y = b === 0 ? Be : o.address, $e = k === 0 ? Be : o.address, { balance: xe, nonce: Me } = await e.chain.account(Y);
    if (xe < G + Do + an) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const pe = await s.request("listening.signMove", { from: b, to: k, amount: G.toString(), fee: Do.toString(), nonce: Me.toString(), balance: xe.toString() }), x = qi(pe.raw);
    if (pe.from !== Y || pe.to !== $e || pe.amount !== G.toString() || Rr(x.payload.recipient).value !== $e || String(x.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const N = {
      id: sd(),
      address: Y,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: $e,
      amount: pe.amount,
      fee: pe.fee,
      nonce: Me.toString(),
      created: e.now(),
      status: "signed",
      raw: pe.raw,
      txid: pe.txid
    };
    e.validate(N), Ot(N);
    try {
      await e.chain.broadcast(pe.raw, pe.txid), Ot({ ...N, status: "pending" });
    } catch (K) {
      throw Ot({ ...N, status: "unknown", note: K.message }), K;
    }
    return De({ txid: pe.txid, amount: pe.amount, at: e.now() }, $e), $e === Be && Be !== o.address ? c = null : a = -1 / 0, pe;
  }
  let jo = !1;
  const Zr = /* @__PURE__ */ new Map(), So = (b) => Pe("float", b);
  async function ka() {
    if (jo || (o == null ? void 0 : o.state) !== "unlocked" || !Xe() || Ne("move") || Ne("rootLike") || !o.address) return;
    const b = o.address;
    if (e.store.get(So(b)) === "1") return;
    const k = jt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const G = We();
    if (G === void 0 || i === void 0) return;
    if (!gn(G)) {
      e.store.set(So(b), "1");
      return;
    }
    if (bt(qe()) || Jr() || re().length || i < Br * 4n + an + Do) return;
    const ne = Zr.get(b);
    if (!(ne && (ne.n >= 3 || e.now() - ne.at < 5 * 6e4))) {
      jo = !0, Zr.set(b, { n: ((ne == null ? void 0 : ne.n) ?? 0) + 1, at: e.now() });
      try {
        await Fo(o.slot ?? 0, 0, Br), e.store.set(So(b), "1");
      } catch (Be) {
        console.warn("[radio] likes float not sent yet", Be);
      } finally {
        jo = !1;
      }
    }
  }
  async function _n(b) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ne("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Ee().catch(() => null);
    if (!k)
      throw ce = null, Ke = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ke = !1, i = k.balance;
    const G = { balance: k.balance, nonce: k.nonce };
    if (b === "excess") {
      const xe = Pg(k.parts) ?? qr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await xo({ mode: "excess", to: xe, linked: !1 }, G), ce = null, ft("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const ne = k.steps;
    if (!ne.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ce && ce.balance === k.balance && e.now() - ce.at <= Ye && ce.steps.length === ne.length && ce.steps.every((xe, Me) => xe.to === ne[Me].to && xe.mode === ne[Me].mode && xe.send === ne[Me].send))) {
      ce = {
        at: e.now(),
        balance: k.balance,
        steps: ne,
        parts: k.parts,
        plan: { state: "ready", steps: ne.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: Pg(k.parts) }
      }, ft(ne.length > 1 ? `This goes back in ${ne.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const Y = ne[0], $e = Y.to ?? qr();
    if (!$e) throw new Error("Choose where to send the rest first.");
    if (Y.mode === "amount" && Ne("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await xo({ mode: Y.mode, to: $e, linked: !1, ...Y.mode === "amount" ? { amount: Y.send } : {} }, G), ce = null, ne.length === 1 ? (O(!1), ft("Returned ✓ Paying is off.")) : ft(`Returned ✓ ${ne.length - 1} more ${ne.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function vr() {
    if (!(o != null && o.unproven)) return;
    const b = await Mn();
    await b.request("listening.prove"), o = await fn(b);
  }
  const Mr = {
    forceRefresh: () => Nn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !io(b))) {
        if (b === En()) return Nn(!0);
        e.store.set(Bn, b ?? ""), I = "", S = "", i = void 0, a = -1 / 0, c = null, await Nn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => on("Check the listening wallet…", async () => {
      const b = await Mn();
      if (Ne("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      vo(), await b.request("listening.forget"), i = void 0, o = await fn(b), O(!1), ft("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => on("Waiting for your passkey…", async () => {
      const k = await Mn(), G = !!(b != null && b.another) && !e.main() && !Ne("another");
      G && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: kn(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...G ? { another: !0 } : {} }), o = await fn(k), o.address && e.store.set(Pe("created", o.address), "1"), O(!0), ft(Ht() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await $n();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Us = e.now() + Ps;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? Et() : Ge = null, e.changed();
    },
    giftSent: (b, k) => {
      !(o != null && o.address) || le() || (De({ txid: b, amount: k.toString(), at: e.now() }), a = -1 / 0, F = null, Mt && (Mt = { ...Mt, at: -1 / 0 }), ft("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (Tr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ne("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Mn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, k, G, ne) => {
      De({ txid: G, amount: ne.toString(), at: e.now() }, k), F = null, await Mr.openAlbum(b), ft("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => on("Opening…", async () => {
      if (Tr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ne("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === b) return;
      vo(), await s.request("listening.openSlot", { slot: b }), o = await fn(s), i = void 0, a = -1 / 0, ce = null, Ke = !1;
      const k = o.root;
      k && b > 0 && e.store.set(Pe("slot", k), String(b)), ft(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const k = () => on("Waiting for your passkey…", async () => Ns(await Mn(), b));
      return ue ? b ? Ne("cancel") ? (ft("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : _s(async () => {
        (St() === "locked" || St() === "intro") && await k();
      }) : yt : k();
    },
    link: () => on("Sign in your wallet…", async () => {
      Tr();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(b)).find((G) => G.listening === o.address);
      if (k)
        await s.request("listening.link", { main: b, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const G = { main: b, listening: o.address, issued: e.now() }, ne = await e.signWithMain(b, Z5(G)), Be = await s.request("listening.link", { main: b, issued: G.issued, mainSignature: ne });
        await e.saveLink({ ...G, mainSignature: ne, listeningSignature: Be.listeningSignature }), Q = -1 / 0;
      }
      ft("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await on("One more passkey check…", vr), !(o != null && o.unproven)) : !0,
    deposit: () => on("Approve the deposit in your wallet…", async () => {
      Tr(), await vr();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (le()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Fe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ts(!0);
      const k = rd(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await e.deposit(b, o.address, k), P && De({ txid: P, amount: k.toString(), at: e.now() }), ft("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => on("Approve the top-up in your wallet…", async () => {
      Tr(), await vr();
      const b = e.main(), k = qe();
      if (!b || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (bt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await e.chain.balance(k);
      Xe() ? c = { for: k, value: G, at: e.now() } : (i = G, a = e.now());
      const ne = rd(G);
      if (ne <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Be = await e.deposit(b, k, ne);
      Be && De({ txid: Be, amount: ne.toString(), at: e.now() }, k), ft("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => on("Adding plays…", async () => {
      if (Tr(), !Xe()) throw new Error("Open the album you want to add plays to first.");
      if (!ul.includes(b)) throw new Error("Choose one of the amounts offered.");
      const k = iI(b, je());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (re().length || le()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Fo(0, o.slot ?? 0, k), ft("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => on("Confirm in the listening wallet…", async () => {
      if (!sr()) throw new Error("Connect your wallet first.");
      await $n(), await s.request("listening.approveSession", kn()), O(!0), ft("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => on("Clearing…", async () => {
      for (const b of dn())
        await e.chain.transaction(b.txid) || Ot({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ft("Cleared ✓");
    }),
    switchOff: () => on("Switching off…", async () => {
      vo(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), ft("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => on("Showing your backup words in the box…", async () => {
      if (!(o != null && o.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await Mn();
      await b.request("listening.backup"), o = await fn(b), ft("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Ne("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Mn()).request("listening.signShelf", { action: b, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      un = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => on("Confirm in the listening wallet…", async () => {
      var Me, pe, x, N;
      const k = ut();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Ne("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (V(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await $n();
      const G = await e.awardNote(k, b), { balance: ne, nonce: Be } = await e.chain.account(k);
      if (ne < qc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const $e = await (await Mn()).request("listening.signAward", {
        cls: G.cls,
        number: G.number,
        plays: G.plays,
        record: G.record,
        signature: G.signature,
        fee: qc.toString(),
        nonce: Be.toString(),
        balance: ne.toString()
      }), xe = qi($e.raw);
      if ($e.hero !== k || $e.number !== G.number || ((pe = (Me = xe.payload) == null ? void 0 : Me.functionName) == null ? void 0 : pe.content) !== "claim" || ((N = (x = xe.payload) == null ? void 0 : x.contractName) == null ? void 0 : N.content) !== F5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast($e.raw, $e.txid), e.store.set(yo(k), JSON.stringify({ txid: $e.txid, at: e.now() })), a = -1 / 0, Mt && (Mt = { ...Mt, at: -1 / 0 }), ft("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => on("Confirm in the listening wallet…", async () => {
      var pe, x, N;
      const k = ut(), G = J();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((G == null ? void 0 : G.state) !== "claimed" || G.inscription === void 0) throw new Error("There is no record to send yet.");
      if (G.holds === !1) throw new Error("This record has already been sent.");
      if (G.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(k)) throw new Error("Your record is already on its way.");
      const ne = b.trim();
      if (!io(ne)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (ne === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Ne("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await $n();
      const { balance: Be, nonce: Y } = await e.chain.account(k);
      if (Be < qc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Mn()).request("listening.signSendRecord", { inscription: G.inscription, recipient: ne, fee: qc.toString(), nonce: Y.toString(), balance: Be.toString() }), Me = qi(xe.raw);
      if (xe.from !== k || xe.recipient !== ne || xe.inscription !== G.inscription || ((x = (pe = Me.payload) == null ? void 0 : pe.functionName) == null ? void 0 : x.content) !== "transfer" || Rr((N = Me.payload.functionArgs) == null ? void 0 : N[2]).value !== ne)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, Mt && (Mt = { ...Mt, at: -1 / 0 }), ft("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => on("Locking…", async () => {
      vo(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, ft("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const k = String(b ?? "").trim();
      if (!(o != null && o.address)) return ft("", "Unlock the listening wallet first.");
      if (!io(k)) return ft("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return ft("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(xr(o.address), k), ft("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(xr(o.address), ""), e.changed();
    },
    returnFunds: (b) => on("Check the return in the listening wallet…", async () => {
      if (!sr()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (C()) return _n(b);
      const k = Sr();
      if (!k) throw new Error(Ht() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Ne("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await xo({ mode: b, to: k.to, linked: k.kind === "linked" }), b === "all" && O(!1), ft(b === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Zt = [], ir = 10, Ps = 30 * 6e4;
  let Nr = !1, Us = 0;
  const ki = (b) => e.now() < Us && (b === "intro" || b === "locked" || b === "link" || b === "fund" && Le()), Jr = () => h || !!u || d || w, vo = () => {
    Zt.length && (Zt.length = 0, e.changed());
  };
  async function $i(b) {
    if (!Zt.some((k) => k.id === b.id) && !Bt().some((k) => k.id === b.id) && (Zt.push({ ...b, at: e.now() }), Zt.length > ir && Zt.shift()), Jr() || ee().length) {
      const k = Zt.length;
      S = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Gn();
  }
  async function Gn() {
    if (!Nr) {
      Nr = !0;
      try {
        for (; Zt.length; ) {
          for (; Zt.length && e.now() - Zt[0].at > Ps; ) Zt.shift();
          if (!Zt.length || Jr() || await Os(Zt[0]) === "wait") return;
          Zt.shift();
        }
      } finally {
        Nr = !1, e.changed();
      }
    }
  }
  async function Os(b) {
    var k;
    h = !0;
    try {
      await Nn();
      const G = St();
      if (G === "loading" || ki(G)) return "wait";
      if (G !== "ready" || !z() || !(o != null && o.session) || o.session.playsLeft < 1 || !R) return "done";
      if (ee().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const ne = o.address, { balance: Be, nonce: Y } = await e.chain.account(ne);
      i = Be, a = e.now();
      const $e = await e.chain.owner(od, b.song);
      if ($e === ne || $e === pt()) return "done";
      const xe = await s.request("listening.signPlay", {
        core: od,
        song: b.song,
        receipt: b.id,
        fee: je().toString(),
        nonce: Y.toString(),
        balance: Be.toString()
      }), Me = {
        id: b.id,
        address: ne,
        kind: "play",
        core: od,
        song: b.song,
        recipient: $e,
        amount: "50",
        fee: je().toString(),
        nonce: Y.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(Me), Ot(Me);
      const pe = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), Ot({ ...Me, status: "pending" }), S = `♪ Paid ${pe}`, I = "";
      } catch (x) {
        Ot({ ...Me, status: Hi(x) ? "failed" : "unknown", note: x.message, ...Hi(x) ? { raw: void 0 } : {} }), I = x.message;
      }
      return o = await fn(s), "done";
    } catch (G) {
      const ne = G instanceof Error ? G.message : "payment unavailable";
      return (k = jt()) != null && k.player ? (S = "Payment is taking a moment: " + ne, "wait") : (S = "This song played free: " + ne, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function Ii(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(St()) || Ne("like") ? !1 : (Hs(b), !0);
  }
  async function Hs(b) {
    const k = b.title ? `“${b.title}”` : `song #${b.song}`, G = (Se) => {
      var Jt;
      I = Se, S = "";
      try {
        (Jt = e.likeFailed) == null || Jt.call(e, b.song);
      } catch {
      }
      e.changed();
    }, ne = Xe(), Be = St(), Y = pt(), $e = ne && (Be === "fund" || Be === "over") ? "ready" : Be, xe = Ht() ? qe() : Y;
    if ($e === "locked") {
      y = { ...b, at: e.now() }, ft(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if ($e === "wrong-wallet") return G(wo());
    if ($e === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ht() && Ne("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if ($e === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if ($e === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (ne) {
      await lt(!0);
      const Se = We();
      if (gn(Se))
        return e.changed(), G(Fl);
    }
    if ($e !== "ready" || !xe) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!R) return G("Pay-per-play is running in another tab. Like from that tab.");
    const Me = Bt(qe()).find((Se) => Se.kind === "like" && Se.song === b.song);
    if (Me && Pa.includes(Me.status))
      return G(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((Me == null ? void 0 : Me.status) === "confirmed" && e.now() - (Me.confirmedAt ?? 0) < cI)
      return G(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let pe;
    w = !0;
    try {
      pe = e.likeState ? (await e.likeState(xe, b.song)).by : b.likedBy ?? [];
    } catch {
      pe = b.likedBy;
    } finally {
      w = !1;
    }
    if (!pe) return G(`Could not check ${k} right now. Try the heart again.`);
    const x = qe(), K = ((Me == null ? void 0 : Me.status) === "confirmed" && typeof Me.liked == "boolean" && e.now() - (Me.confirmedAt ?? Me.created) < 5 * 6e4 ? Me.liked : void 0) ?? pe.includes(x);
    if (!K && pe.some((Se) => Se !== x)) return G(Ht() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${pe.includes(Y) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ro({ song: b.song, liked: !K, title: b.title, artist: b.artist });
  }
  async function Ro(b) {
    var ne, Be, Y;
    if (d) {
      ft("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, G = e.wait ?? (($e) => new Promise((xe) => setTimeout(xe, $e)));
    try {
      ft(`${b.liked ? "Liking" : "Unliking"} ${k}…`);
      const $e = e.now() + 12e4;
      for (; h || (Xe() ? Bt(qe()).some((K) => Pa.includes(K.status)) : ee().length); ) {
        if (e.now() > $e) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Nn(!0);
      }
      if (!Xe() && St() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const xe = qe(), { balance: Me, nonce: pe } = await e.chain.account(xe);
      if (Xe() ? c = { for: xe, value: Me, at: e.now() } : (i = Me, a = e.now()), gn(Me)) throw new Error(Fl);
      const x = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: zt().toString(),
        nonce: pe.toString(),
        balance: Me.toString()
      }), N = {
        id: sd(),
        address: xe,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: zt().toString(),
        nonce: pe.toString(),
        created: e.now(),
        status: "signed",
        raw: x.raw,
        txid: x.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(N), Ot(N);
      try {
        await e.chain.broadcast(x.raw, x.txid), Ot({ ...N, status: "pending" }), S = `${b.liked ? "♥ Liked" : "Unliked"} ${k}`, I = "";
        try {
          (ne = e.likeSent) == null || ne.call(e, b.song, b.liked);
        } catch {
        }
      } catch (K) {
        if (Ot({ ...N, status: Hi(K) ? "failed" : "unknown", note: K.message, ...Hi(K) ? { raw: void 0 } : {} }), I = K.message, Hi(K)) try {
          (Be = e.likeFailed) == null || Be.call(e, b.song);
        } catch {
        }
      }
      o = await fn(s);
    } catch ($e) {
      I = "Like not sent: " + ($e instanceof Error ? $e.message : "the listening wallet is unavailable");
      try {
        (Y = e.likeFailed) == null || Y.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Gn();
    }
  }
  return { snapshot: Wr, refresh: Nn, onListened: $i, heart: Ii, toggleLike: Hs, ...Mr };
}
const Gb = ["Connect", "Passkey", "Link & fund", "Listen"], Kb = ["Passkey", "Add 1 STX", "Listen"], vf = (e) => e ? Kb : Gb;
function uI(e) {
  if (e.solo) return dI(e);
  const t = Gb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function dI(e) {
  const t = Kb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function fI(e, t) {
  return !t || t.at >= vf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const hI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function pI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !hI(r.id)));
}
const gI = {}, yI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, wI = (e) => {
  const t = gI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, mI = (e) => `/hiro/${e}`, bI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, xI = (e) => {
  const t = wI(e);
  if (t)
    return [bI(t)];
  const n = yI[e];
  return typeof window < "u" ? [`${window.location.origin}${mI(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, SI = {}, Ug = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, vI = "xtrata.log.enabled", AI = "xtrata.log.level", EI = "xtrata.log.tags", kI = "xtrata.log.dedupe", Wc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, $I = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, II = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, LI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, CI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, TI = () => {
  const e = SI ?? {}, t = Wc(vI) ?? e.VITE_LOG_ENABLED, n = Wc(AI) ?? e.VITE_LOG_LEVEL, r = Wc(EI) ?? e.VITE_LOG_TAGS, s = Wc(kI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: $I(t),
    level: II(n) ?? "warn",
    tags: CI(r),
    dedupe: LI(s)
  };
}, BI = (e, t, n) => !e.enabled || Ug[n] < Ug[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), MI = (e, t, n, r) => {
  const s = TI();
  if (!BI(s, t, e) || _I(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, NI = /* @__PURE__ */ new Set();
let Og = null;
const _I = (e, t, n, r, s) => (Og !== e && (NI.clear(), Og = e), !1), PI = (e, t, n) => MI("debug", e, t, n), UI = {}, OI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, HI = (e) => {
  const t = UI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : OI[e];
}, DI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, FI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return DI.test(n) ? n : null;
}, jI = (e) => e.replace(/\/+$/, ""), RI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), Hg = (e) => {
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
}, Di = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, zI = (e) => {
  var c, u;
  let t;
  try {
    t = Rr(D6(e));
  } catch {
    return null;
  }
  const n = Di(t);
  if (!n || n.success === !1)
    return null;
  const r = Di(n.value), s = Di(r == null ? void 0 : r.value), o = Di(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Hg((c = Di(o.name)) == null ? void 0 : c.value), a = Hg((u = Di(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : FI(`${i}.${a}`);
}, GI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${jI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Eb(ab(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : zI(o.result);
}, KI = async (e) => {
  const t = e.address.trim();
  if (!Ji(t))
    return null;
  const n = HI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of xI(e.network))
    try {
      return await GI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return PI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: RI(r)
  }), null;
};
function VI(e, t, n = {}) {
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
const Dg = Object.freeze({
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
}), Fg = Object.freeze({ 139: "melophonic" });
function jg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Dg, n) ? Dg[n] : Object.hasOwn(Fg, n) ? Fg[n] : t;
}
const Rg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function zg(e, t = "") {
  return Object.hasOwn(Rg, String(e)) ? Rg[String(e)] : t;
}
const Vb = 10000n, Hh = 1000000n, jl = 3000n, XI = (e, t) => `${e}#gift=${t}`, YI = 100, Ua = (e, t = Yr) => e <= an ? 0 : Number((e - an) / jn(t)), Gg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Dh = "xtrata.xyz/radio/gifts", Ra = YI, qI = "Create a prefunded Xtrata radio gift batch", WI = (e) => ({
  domain: br({ name: $t(Dh), version: $t("1"), "chain-id": An(1) }),
  message: br({
    purpose: $t(qI),
    creator: $t(e.creator),
    count: An(e.count),
    amount: An(BigInt(e.amount)),
    label: $t(e.label),
    issued: An(e.issued),
    ...e.player ? { player: $t(e.player) } : {}
  })
}), Xb = (e, t, n = Yr) => an + BigInt(e) * jn(n) + (t ? Su : 0n), ZI = (e, t = Yr) => Number((Hh - an - (e ? Su : 0n)) / jn(t)), Yb = (e, t) => BigInt(e) * (t + jl);
function JI(e, t, n, r = Yr) {
  const s = n ? Su : 0n, o = t > an + s ? t - an - s : 0n, i = Number(o / jn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Ol,
    fees: BigInt(i) * r,
    reserve: an,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jl,
    perCopy: t + jl,
    total: Yb(e, t)
  };
}
const QI = (e) => e >= Vb && e <= Hh, eL = 90, Kg = [30, 90], tL = "Extend my prefunded Xtrata radio gift batches; no spending permission", nL = (e) => ({
  domain: br({ name: $t(Dh), version: $t("1"), "chain-id": An(1) }),
  message: br({ purpose: $t(tL), creator: $t(e.creator), batch: $t(e.batch), days: An(e.days), issued: An(e.issued) })
}), Vg = 40, rL = "Create an Xtrata radio gift player", Af = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), oL = /^[^\u0000-\u001f\u007f<>]+$/u;
function Xg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && oL.test(e) : !n;
}
function qb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Xg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Xg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Vg) throw new Error(`A player holds 1 to ${Vg} songs.`);
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
const Wb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return jf(Gf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, sL = (e) => ({
  domain: br({ name: $t(Dh), version: $t("1"), "chain-id": An(1) }),
  message: br({
    purpose: $t(rL),
    admin: $t(e.admin),
    player: $t(e.hash),
    issued: An(e.issued)
  })
}), Kr = (e) => e.tracks.filter((t) => !t.hidden), iL = (e) => e.tracks.find((t) => t.hidden) ?? null, id = [300, 500, 1e3], Wa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Zc = (e) => typeof e == "string" && Wa.some((t) => t.id === e), qs = (e) => Wa.find((t) => t.id === e), aL = (e) => Wa.find((t) => e >= t.min) ?? Wa[Wa.length - 1];
function cL(e, t = Yr) {
  return aL(e <= an ? 0 : Number((e - an) / jn(t)));
}
const Zb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], lL = "1000 Players";
function Fh(e = Ra) {
  const t = [];
  for (const n of Zb) {
    const r = Xb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${lL} ${String(i).padStart(2, "0")}`, amount: r, deposit: Yb(o, r) });
    }
  }
  return t;
}
const jh = (e = Fh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Zb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), uL = 23 * 36e5, Yg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function dL(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < uL ? "unpaid" : "todo";
}
function fL(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: dL(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Yg(u.state) - Yg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function qg(e, t, n = Fh()) {
  var u;
  const r = n.map((h) => fL(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = jh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function hL(e, t = Fh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = jh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${qs(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const Wg = 1800, ad = /* @__PURE__ */ new Map();
async function pL(e) {
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
function gL(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = ad.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      ad.set(e, { ...a, until: Date.now() + Wg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ad.delete(e), s();
      }, Wg + 50);
    }
  }, o;
}
const pr = (e, t, n, r, s) => gL(e, t, async () => await pL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s);
function Rh() {
  var t;
  const e = window.XtrataRadioConnectStacks;
  e ? e() : (t = document.getElementById("radio-wallet-connect")) == null || t.click();
}
const Fs = "xtrata.radio.gift.incoming.v1", Zg = (e) => "xtrata.radio.gift.mine.v1:" + e, Jg = (e) => "xtrata.radio.gift.batches.v1:" + e, fe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Qt = (e, t, n = "") => {
  const r = fe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Oa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, er = (e) => Dr(e).replace(/\.?0+$/, "");
function yL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Gg(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(Fs) || "null");
      return Gg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(Fs, JSON.stringify({ code: o, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const D = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(Fs, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(Fs, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Ua(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Ua(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [pr("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Fs, null), e.changed();
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
    var D, J, te, Te, ke, Re, xt, Qe, dt;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((D = t.view) != null && D.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const V = async (kt) => {
      const Ye = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...kt })
      });
      return { res: Ye, r: await Ye.json().catch(() => ({})) };
    };
    try {
      let kt = 0, Ye = E.listening, C;
      if (H) {
        const St = Number((te = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : te.next);
        if (!Number.isSafeInteger(St) || St < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        kt = St;
        for (let Wr = 0; ; Wr++) {
          const or = await e.album.bind(kt);
          if (Ye = or.address, C = await V({ wallet: Ye, binding: or }), C.res.status === 409 && /just taken/.test(((Te = C.r) == null ? void 0 : Te.error) || "") && Wr < 5) {
            kt += 1;
            continue;
          }
          break;
        }
      } else C = await V({ wallet: Ye });
      const { res: Ee, r: wt } = C;
      if (Ee.status === 503 && /sending another gift/.test((wt == null ? void 0 : wt.error) || "")) {
        t.waiting = !0, (ke = e.claiming) == null || ke.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ee.ok) {
        const St = String((wt == null ? void 0 : wt.error) || "");
        if (Ee.status === 404 || Ee.status === 410 || Ee.status === 409 && /already had a gift|brand-new|already have this album/.test(St))
          throw e.store.set(Fs, null), new Error(St || "This gift cannot be opened.");
        if (Ee.status === 429 || Ee.status === 403 || Ee.status === 400 && !/wallet number/i.test(St)) throw new Error(St || `Could not open the gift (${Ee.status}).`);
        const or = /topping up/.test(St) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(St) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(St) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(or), { retry: !0, slow: /topping up|not paid for yet/.test(St) });
      }
      t.done = !0, e.store.set(Fs, null), H ? await e.album.arrived(kt, Ye, wt.txid, BigInt(wt.amount)) : e.giftSent(wt.txid, BigInt(wt.amount));
    } catch (kt) {
      const Ye = kt, C = Ye.name === "TypeError" || Ye.name === "AbortError" || Ye.name === "TimeoutError" || /wallet number/i.test(Ye.message);
      if (Ye.retry || C) {
        const Ee = t.tries ?? 0;
        t.tries = Ee + 1, t.retry = { text: Ye.retry ? Ye.message : "Still sending your gift… the network is slow, trying again." }, (Re = e.claiming) == null || Re.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, Ye.slow ? 6e4 : n(Ee));
      } else
        t.error = Ye.message, (xt = e.claiming) == null || xt.call(e, !1);
      w.token = void 0;
      try {
        (dt = (Qe = window.turnstile) == null ? void 0 : Qe.reset) == null || dt.call(Qe, w.box);
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
        var J, te;
        (U == null ? void 0 : U.wallet) === V && (U.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, U.problem = ((te = D == null ? void 0 : D.gift) == null ? void 0 : te.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const H = fe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${U.problem}`, [H];
  }
  function A(E, H, V = !1) {
    var Re, xt;
    const D = H.player, J = BigInt(H.amount), te = V ? [] : [fe("p", `🎁 ${d(H)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Kr(D).length} ${Kr(D).length === 1 ? "song" : "songs"} and ${Ua(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (V) return te;
      if (te.push(fe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const Qe = document.createElement("details");
        Qe.className = "ppp-how";
        const dt = document.createElement("summary");
        dt.textContent = "How does this work?", Qe.append(dt, fe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), te.push(Qe);
      }
      return te;
    }
    if (E.walletCannotAlbums)
      return te.push(fe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), te;
    const ke = (xt = (Re = E.gate) == null ? void 0 : Re.gifts) == null ? void 0 : xt.turnstileSiteKey;
    return ke && !w.token ? te.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(ke)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), te.push(...T(E, "Sending your album…")), te;
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
    var Ye, C, Ee, wt;
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
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), te = J ? ((Ye = e.claimNew) == null ? void 0 : Ye.call(e, E)) ?? null : null, Te = te ? ((C = e.replaceOld) == null ? void 0 : C.call(e, E)) ?? null : null;
    if (te && Te)
      return [
        fe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Qt("Replace my old player", Te, "primary"),
        Qt("Keep both players", te, "quiet"),
        Qt("Not now", h, "quiet")
      ];
    if (te)
      return [
        fe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Qt("Claim it as a new player", te, "primary"),
        Qt("Not now", h, "quiet")
      ];
    if (J)
      return [fe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")];
    const ke = BigInt(D.amount), Re = Ua(ke).toLocaleString(), xt = fe(
      "p",
      `🎁 ${d(D)} sent you ${er(ke)} STX of on-chain music: about ${Re} paid plays.`,
      "ppp-gift"
    ), Qe = H.bare ? [] : [xt], dt = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, kt = (wt = (Ee = E.gate) == null ? void 0 : Ee.gifts) == null ? void 0 : wt.turnstileSiteKey;
    return dt ? (kt && !w.token ? Qe.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(kt)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), Qe.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || Qe.push(fe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? Qe.push(fe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && Qe.push(fe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")), Qe;
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
  let q = 250000n, m = "", L = "";
  const _ = (E) => {
    try {
      const H = JSON.parse(e.store.get(Zg(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, M = (E, H) => e.store.set(Zg(E), JSON.stringify(H.slice(0, 50)));
  async function W(E) {
    const H = _(E);
    for (const V of H)
      if (!(V.view && ["claimed", "refunded", "expired"].includes(V.view.status)))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: V.id, ...V.txid ? { txid: V.txid } : {} }) }) : await e.json("/radio/gift?id=" + V.id), V.error = void 0;
        } catch (D) {
          V.error = D.message;
        }
    M(E, H), e.changed();
  }
  async function F(E) {
    if (m) return;
    m = "Starting your gift…", L = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: q.toString() }) });
      const V = _(E);
      V.unshift({ id: H.id, code: H.code, amount: q.toString(), at: e.now() }), M(E, V), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), J = _(E), te = J.find((Te) => Te.id === H.id);
      te && (te.txid = D, te.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: E, label: "", expires: 0 }), M(E, J), L = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (V) {
      L = V.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const we = (E) => "xtrata.radio.gift.players.v1:" + E, ce = (E) => {
    try {
      const H = JSON.parse(e.store.get(we(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ke(E, H) {
    var V;
    if (!m) {
      m = "Checking the player…", L = "", e.changed();
      try {
        const D = H.tracks.split(/[\s,]+/).filter(Boolean).map((Qe) => Number(Qe.replace(/^#/, ""))), J = (H.explicit ?? "").split(/[\s,]+/).map((Qe) => Qe.replace(/^#/, "")).filter(Boolean).map(Number), te = qb({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: D, cover: (V = H.cover) != null && V.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        m = "Sign in your wallet…", e.changed();
        const Te = { admin: E, hash: Wb(te), issued: e.now() }, ke = await e.sign(E, sL(Te));
        m = "Making the player…", e.changed();
        const Re = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: te, request: Te, signature: ke }) }), xt = ce(E).filter((Qe) => Qe.id !== Re.id);
        xt.unshift({ id: Re.id, title: Re.title, tracks: Re.tracks }), e.store.set(we(E), JSON.stringify(xt.slice(0, 30))), L = `${Re.existing ? "That player already exists" : "Player made"} ✓ “${Re.title}” · ${Re.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        L = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (E, H) => XI(E || location.origin + "/radio.html", H), R = (E) => {
    try {
      const H = JSON.parse(e.store.get(Jg(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, ue = (E, H) => e.store.set(Jg(E), JSON.stringify([...H.filter((V) => V.codes.length), ...H.filter((V) => !V.codes.length)].slice(0, 80))), be = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, _e = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let Ae = 0;
  async function yt(E) {
    const H = R(E);
    for (const D of H)
      if (!be(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await _e("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const te = H.find((Te) => Te.id === J.id);
        if (te) {
          te.error || (te.view = J);
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
  async function je(E, H) {
    const V = R(E).find((D) => D.id === H);
    if (!(!V || !V.depositTo || m)) {
      m = "Approve the payment in your wallet…", L = "", e.changed();
      try {
        const D = await e.pay(E, V.depositTo, BigInt(V.deposit), V.memo), J = R(E), te = J.find((Te) => Te.id === H);
        te && (te.txid = D), ue(E, J), L = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", yt(E);
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
      const te = { creator: E, count: H.count, amount: H.amount.toString(), label: V, issued: e.now(), ...D ? { player: D } : {} }, Te = await e.sign(E, WI(te));
      m = "Making your links…", e.changed(), J = await _e("/radio/gift/batch", { request: te, signature: Te });
      const ke = R(E);
      ke.unshift({ id: J.id, codes: J.codes, count: H.count, amount: J.amount, label: V, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), ue(E, ke);
    } catch (te) {
      L = te.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await je(E, J.id);
  }
  async function Pe(E, H, V) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", L = "", e.changed();
      try {
        const D = { creator: E, batch: H, days: V, issued: e.now() }, J = await e.sign(E, nL(D));
        m = "Extending…", e.changed();
        const te = await _e("/radio/gift/batch/extend", { request: D, signature: J }), Te = R(E);
        for (const ke of (te == null ? void 0 : te.batches) ?? []) {
          const Re = Te.find((xt) => xt.id === ke.id);
          Re && (Re.view = ke, Re.error = void 0);
        }
        ue(E, Te), L = te != null && te.extended ? `Extended ✓ ${te.extended === 1 ? "That batch has" : `${te.extended} batches have`} ${V} more days.` : "There was nothing live to extend.";
      } catch (D) {
        L = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const Bn = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function En(E, H) {
    const V = H.filter((te) => {
      var Te;
      return ((Te = te.view) == null ? void 0 : Te.status) === "live" && te.view.copies.waiting > 0;
    });
    if (!V.length) return null;
    const D = Math.min(...V.map((te) => te.view.expires)), J = fe("p", "", "ppp-batch-extend");
    J.append(fe("span", `${V.length} live ${V.length === 1 ? "batch" : "batches"} · the first runs out in ${Bn(D)} days. Extend ${V.length === 1 ? "it" : "them all"}: `));
    for (const te of Kg) {
      const Te = Qt(`+${te} days`, () => void Pe(E, "all", te), "tiny");
      Te.disabled = !!m, J.append(Te);
    }
    return J;
  }
  const pt = () => Bt(!!Xe.value, We.value, zt.value);
  function Bt(E, H, V) {
    const D = H === "max" ? ZI(E) : Number(H), J = Xb(D, E), te = Number(V);
    return !Number.isInteger(te) || te < 1 || te > Ra ? { ok: !1, reason: `Make 1 to ${Ra} copies at a time.`, album: E, plays: D, amount: J, count: te } : QI(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: te, bill: JI(te, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: te };
  }
  const Ot = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? eL;
  }, z = (E = pt()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${er(H.holders)} to song holders, ${er(H.fees)} network fees)${E.album ? `, ${er(H.float)} for the album’s likes` : ""}, ${er(H.reserve)} kept so a listener can return what is left, + ${er(H.sendFee)} to send it = ${er(H.perCopy)} STX. ${E.count} copies = ${er(H.total)} STX, paid now in one payment. Copies nobody claims within ${Ot()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((V) => $(E, V)), ee = fe("input");
  ee.type = "range", ee.min = String(Vb), ee.max = String(Hh), ee.step = "10000", ee.value = String(q), ee.setAttribute("aria-label", "Gift amount");
  const re = fe("p", "", "ppp-gift-amount"), le = Qt("", () => {
    const E = e.main();
    E && F(E);
  }, "primary"), bt = () => {
    re.textContent = De(), le.textContent = `Gift ${er(q)} STX`;
  };
  ee.oninput = () => {
    q = BigInt(ee.value), bt();
  };
  const De = () => `${er(q)} STX · about ${Ua(q).toLocaleString()} paid plays · you pay ${er(q + jl)} STX with the network fee`;
  bt();
  const Ge = fe("input");
  Ge.maxLength = 60, Ge.placeholder = "Title, e.g. Proof of Sound", Ge.setAttribute("aria-label", "Player title");
  const Et = fe("input");
  Et.maxLength = 80, Et.placeholder = "Artist (optional)", Et.setAttribute("aria-label", "Player subtitle");
  const Fe = fe("textarea");
  Fe.rows = 3, Fe.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Fe.setAttribute("aria-label", "Songs");
  const Le = fe("input");
  Le.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Le.setAttribute("aria-label", "Explicit songs");
  const qe = fe("input");
  qe.inputMode = "numeric", qe.placeholder = "Cover inscription number (optional), shown when the album loads", qe.setAttribute("aria-label", "Cover inscription");
  const Xe = fe("select");
  Xe.setAttribute("aria-label", "Batch album");
  const We = fe("select");
  We.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...id])].sort((H, V) => H - V)) We.append(Oa(`${E.toLocaleString()} plays`, String(E)));
  We.append(Oa("Max (1 STX)", "max")), We.value = String(id[0]);
  const zt = fe("input");
  zt.type = "number", zt.min = "1", zt.max = String(Ra), zt.value = "10", zt.setAttribute("aria-label", "Copies");
  const gn = fe("input");
  gn.maxLength = 40, gn.placeholder = "Label, e.g. Opera launch", gn.setAttribute("aria-label", "Batch label");
  const dn = fe("p", "", "ppp-mute"), Zn = () => {
    dn.textContent = z();
  };
  for (const E of [Xe, We, zt])
    E.oninput = Zn, E.onchange = Zn;
  Zn();
  let Ht = null, yn = 0;
  async function xr() {
    yn = e.now();
    try {
      Ht = hL(await e.json("/radio/giveaway/players"));
    } catch {
      Ht = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const qr = (E, H) => {
    var D;
    if (((D = qg(R(E), e.now()).next) == null ? void 0 : D.n) !== H.n) {
      L = "That batch is already made. Check again.", e.changed();
      return;
    }
    Ne(E, Bt(!1, String(H.plays), String(H.count)), H.label);
  };
  function zn(E) {
    var Te;
    const H = qg(R(E), e.now()), V = jh(), D = fe("div", "", "ppp-drop");
    D.append(
      fe("p", `The ${V.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${V.batches} batches live`, "ppp-cyan"),
      fe("p", `${V.tiers.map((ke) => `${ke.count} ${qs(ke.id).name}`).join(", ")}. ${V.batches} batches, ${er(V.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = fe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const ke of H.steps) {
      const Re = fe("li"), xt = ke.state === "live" ? "✓" : ke.state === "touched" ? "!" : ke.state === "todo" ? "○" : "…";
      if (Re.append(fe("span", `${xt} ${ke.step.n}. ${qs(ke.step.tier).name} · ${ke.step.count} × ${ke.step.plays.toLocaleString("en-GB")} plays · ${er(ke.step.deposit)} STX`, "t"), fe("span", ke.detail, ke.state === "live" ? "ppp-ok" : ke.state === "touched" ? "ppp-warn" : "ppp-mute")), ke.state === "todo" && ((Te = H.next) == null ? void 0 : Te.n) === ke.step.n) {
        const Qe = Qt("Sign and pay", () => qr(E, ke.step), "tiny");
        Qe.disabled = !!m, Re.append(Qe);
      }
      if (ke.state === "unpaid" && ke.batch) {
        const Qe = Qt("Pay now", () => void je(E, ke.batch.id), "tiny");
        Qe.disabled = !!m, Re.append(Qe);
      }
      J.append(Re);
    }
    D.append(J);
    for (const ke of H.problems) D.append(fe("p", ke, "ppp-warn"));
    H.ready ? D.append(
      fe("p", `All ${V.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      pr("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : D.append(fe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - yn > 6e4 && xr(), Ht && D.append(fe("p", Ht.text, Ht.ok ? "ppp-ok" : "ppp-mute"));
    const te = Qt("Check again", () => {
      Ae = e.now(), yt(E), xr();
    }, "tiny");
    return te.disabled = !!m, D.append(te), D;
  }
  function Sr(E, H, V) {
    const D = H.view, J = D == null ? void 0 : D.copies, te = H.error ? H.error : !D || D.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Te = fe("li");
    if (Te.append(fe("span", `${H.label || "Batch"} · ${H.count} × ${er(BigInt(H.amount))} STX`, "t"), fe("span", te, "ppp-mute")), !H.txid && H.depositTo && (!D || D.status === "pending-deposit") && Te.append(Qt("Pay now", () => void je(E, H.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Te.append(fe("span", `${Bn(D.expires)} days left`, "ppp-mute"));
      for (const ke of Kg) {
        const Re = Qt(`+${ke}`, () => void Pe(E, H.id, ke), "tiny");
        Re.title = `Extend this batch by ${ke} days (a signature, no payment)`, Re.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${ke} days`), Re.disabled = !!m, Te.append(Re);
      }
    }
    if (H.codes.length && (D == null ? void 0 : D.status) === "live") {
      const ke = O(V, H);
      Te.append(
        pr("batch-copy:" + H.id, "Copy all links", () => ke.join(`
`), "tiny", e.changed),
        pr("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...ke.map((Re, xt) => `${xt + 1},${Re}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Te.append(fe("span", "links were made on another device", "ppp-mute"));
    return Te;
  }
  const wn = fe("select");
  wn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...id])].sort((H, V) => H - V)) wn.append(Oa(`${E.toLocaleString()} plays`, String(E)));
  wn.value = "50";
  const jt = fe("input");
  jt.type = "number", jt.min = "1", jt.max = String(Ra), jt.value = "10", jt.setAttribute("aria-label", "How many copies");
  const ut = fe("input");
  ut.maxLength = 40, ut.placeholder = "A note recipients see, e.g. Launch week (optional)", ut.setAttribute("aria-label", "Note for recipients");
  const Mt = fe("p", "", "ppp-mute");
  function un(E, H, V) {
    const D = () => Bt(!0, wn.value, jt.value), J = () => {
      Mt.textContent = z(D());
    };
    for (const dt of [wn, jt])
      dt.oninput = J, dt.onchange = J;
    J();
    const te = () => (ut.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Te = Qt("Sign, pay and make links", () => {
      Ne(E, D(), te(), H.id);
    }, "primary");
    Te.disabled = !!m;
    const ke = (dt, kt) => {
      const Ye = fe("label", dt);
      return Ye.append(kt), Ye;
    }, Re = [
      fe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      ke("Plays in each ", wn),
      ke("Copies ", jt),
      ut,
      Mt,
      Te
    ];
    e.now() - Ae > 3e4 && (Ae = e.now(), yt(E));
    const xt = R(E).filter((dt) => dt.player === H.id);
    if (xt.length) {
      const dt = fe("ul", "", "ppp-gift-list");
      for (const kt of xt.slice(0, 10)) dt.append(Sr(E, kt, V));
      Re.push(dt);
    }
    const Qe = En(E, R(E));
    return Qe && Re.push(Qe), m && Re.push(fe("p", m, "ppp-cyan")), L && Re.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), Re;
  }
  function Cr(E) {
    var J, te;
    const H = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const V = e.main(), D = [fe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      D.push(fe("p", "Connect a Stacks wallet (Xverse or Leather) to make albums."), Qt("Connect Stacks wallet", Rh, "primary"));
    else if (H.admin) {
      const Te = fe("div", "", "ppp-gift-admin"), ke = (kt, Ye) => {
        const C = fe("label", kt);
        return C.append(Ye), C;
      }, Re = ce(V);
      Te.append(
        fe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ge,
        Et,
        Fe,
        qe,
        Le,
        Qt("Sign and make player", () => void Ke(V, { title: Ge.value, subtitle: Et.value, tracks: Fe.value, cover: qe.value, explicit: Le.value }))
      );
      const xt = Qt("Sign, pay and make links", () => {
        Ne(V, pt(), gn.value.trim(), Xe.value || void 0);
      });
      xt.disabled = !!m;
      const Qe = Xe.value;
      Xe.replaceChildren(Oa("No album (starter copies)", ""), ...Re.map((kt) => Oa(`${kt.title} · ${kt.tracks} songs`, kt.id))), Re.some((kt) => kt.id === Qe) && (Xe.value = Qe), Zn(), Te.append(
        fe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Ot()} days unless you extend`, "ppp-cyan"),
        ke("Album ", Xe),
        ke("Plays each ", We),
        ke("Copies ", zt),
        gn,
        dn,
        xt
      ), e.now() - Ae > 3e4 && (Ae = e.now(), yt(V));
      const dt = R(V);
      if (dt.length) {
        const kt = fe("ul", "", "ppp-gift-list");
        for (const C of dt.slice(0, 20)) kt.append(Sr(V, C, ((te = E.gate) == null ? void 0 : te.radioUrl) ?? null));
        Te.append(kt);
        const Ye = En(V, dt);
        Ye && Te.append(Ye);
      }
      Te.append(zn(V)), D.push(Te);
    }
    return m && D.push(fe("p", m, "ppp-cyan")), L && D.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), oe.replaceChildren(...D), oe;
  }
  return { banner: X, funder: Q, renderFold: Cr, copies: un, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const wL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function mL(e) {
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
const bL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function xL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = bL(o);
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
function SL(e, t = 100) {
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
}, Qg = "xtrata:al-thumb:v1:", zh = "-", Ha = 96, vL = 24 * 1024 * 1024, vn = /* @__PURE__ */ new Map(), ey = /* @__PURE__ */ new Set(), kf = [];
let cd = !1, ld;
const cc = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Qg + e);
    window.localStorage.setItem(Qg + e, t);
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
          r.width = r.height = Ha, s.fillStyle = "#143a40", s.fillRect(0, 0, Ha, Ha), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Ha, Ha), t(r.toDataURL("image/jpeg", 0.82));
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
async function AL(e) {
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
    if (s > vL)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function EL() {
  if (!cd) {
    cd = !0;
    try {
      for (; kf.length; ) {
        const e = kf.shift();
        if (!vn.has(e))
          try {
            const t = await AL(e);
            if (t === null) continue;
            if (!t) {
              vn.set(e, ""), cc(e, zh), zl();
              continue;
            }
            const n = await Gh(t);
            vn.set(e, n), n.startsWith("data:image/jpeg") && cc(e, n), zl();
          } catch {
          }
      }
    } finally {
      cd = !1;
    }
  }
}
function Gl(e, t) {
  if (t && !vn.get(e) ? (vn.set(e, t), Gh(t).then((r) => {
    r !== t && (vn.set(e, r), r.startsWith("data:image/jpeg") && cc(e, r), zl());
  })) : t === "" && !vn.has(e) && vn.set(e, ""), vn.has(e)) return vn.get(e);
  const n = cc(e);
  if (n != null) {
    const r = n === zh ? "" : n;
    return vn.set(e, r), r;
  }
  return ey.has(e) || (ey.add(e), kf.push(e), ld || (ld = setTimeout(() => {
    ld = void 0, EL();
  }, 1200))), "";
}
function ty(e) {
  if (vn.has(e)) return vn.get(e);
  const t = cc(e);
  if (t == null) return null;
  const n = t === zh ? "" : t;
  return vn.set(e, n), n;
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
const Fi = 12, kL = 5e3, Dn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ji = (e, t, n = "") => {
  const r = Dn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function $L(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Fi;
  const d = Dn("div", "", "ppp-shelf-box");
  Rl(() => e.changed());
  const w = (_) => "xtrata.radio.shelf.pins.v1:" + _, y = (_) => "xtrata.radio.shelf.recent.v1:" + _, v = (_, M) => {
    try {
      return JSON.parse(e.store.get(_) || "null") ?? M;
    } catch {
      return M;
    }
  }, S = (_) => new Set(v(w(_), []).filter((M) => Number.isSafeInteger(M))), I = (_) => {
    const M = v(y(_), {}), W = {};
    for (const [F, we] of Object.entries(M)) Number.isSafeInteger(Number(F)) && typeof we == "number" && (W[Number(F)] = we);
    return W;
  };
  async function U(_) {
    if (!s) {
      s = !0, o = !1;
      try {
        const M = [];
        let W = 0, F = 0;
        for (let we = 0; we < kL / 100 + 1; we++) {
          const ce = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${W}&limit=100`);
          if (M.push(...mL(ce == null ? void 0 : ce.shelf)), F = Number(ce == null ? void 0 : ce.total) || M.length, !(ce != null && ce.next) || !Number.isSafeInteger(ce.next)) break;
          W = ce.next;
        }
        _ === t && (n = M, r = F, i = e.now());
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
    a = A.value, h = Fi, e.changed();
  };
  const T = Dn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const _ of wL) {
    const M = document.createElement("option");
    M.value = _.value, M.textContent = _.label, T.append(M);
  }
  T.onchange = () => {
    c = T.value, h = Fi, e.changed();
  };
  const B = ji("", () => {
    u = !u, h = Fi, e.changed();
  }, "tiny"), X = Dn("div", "", "ppp-shelf-tools");
  X.append(A, T, B);
  const Q = Dn("div"), oe = Dn("div");
  function q(_) {
    const M = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (M !== t && (t = M, n = [], r = 0, i = -1 / 0, h = Fi), !M || _.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && U(M), !n.length)
      return o ? (oe.replaceChildren(Dn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ji("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(oe), d) : null;
    const W = S(M), F = I(M), we = xL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: F });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const ce = [];
    if (_.slot > 0 && ce.push(ji("← My player", () => e.open(0), "quiet")), !we.length) ce.push(Dn("p", "No album matches that.", "ppp-mute"));
    else {
      const Ke = Dn("ul", "", "ppp-shelf-list");
      for (const $ of we.slice(0, h)) {
        const R = Dn("li", "", $.slot === _.slot ? "now" : ""), ue = W.has($.slot), be = ji(ue ? "★" : "☆", () => {
          const pt = new Set(W);
          ue ? pt.delete($.slot) : pt.add($.slot), e.store.set(w(M), JSON.stringify([...pt])), e.changed();
        }, "tiny");
        be.setAttribute("aria-label", ue ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const _e = [$.player.subtitle, `${Kr($.player).length} ${Kr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ae = $.slot === _.slot, yt = ji(Ae ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(SL({ ...F, [$.slot]: e.now() }))), e.open($.slot);
        }, Ae ? "tiny ppp-pick" : "tiny primary ppp-pick");
        yt.disabled = Ae, yt.setAttribute("aria-label", Ae ? `${$.player.title}, playing now` : `Open ${$.player.title}`);
        const je = Kr($.player)[0], Ne = $.player.cover ?? (je == null ? void 0 : je.id), Pe = Ne ? Gl(String(Ne)) : "", Bn = Dn("span", "", "ppp-shelf-art");
        if (Pe) {
          const pt = document.createElement("img");
          pt.src = Pe, pt.alt = "", pt.decoding = "async", Bn.append(pt);
        } else Bn.textContent = "💿";
        const En = Dn("span", "", "ppp-shelf-txt");
        En.append(Dn("span", $.player.title, "t"), Dn("span", _e, "ppp-mute")), R.append(be, Bn, En, yt), Ke.append(R);
      }
      ce.push(Ke), we.length > h && ce.push(ji(`Show more (${we.length - h} left)`, () => {
        h += Fi, e.changed();
      }, "quiet"));
    }
    return o && ce.push(Dn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ce), d.firstChild !== X && d.replaceChildren(X, Q), d;
  }
  return { render: q, invalidate: P, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const _ = I(t), M = [...n].filter((W) => W.player).sort((W, F) => (_[F.slot] ?? 0) - (_[W.slot] ?? 0) || F.slot - W.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const ny = "http://www.w3.org/2000/svg", IL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Kl(e = "", t = !1) {
  const n = document.createElementNS(ny, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of IL) {
    const o = document.createElementNS(ny, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const st = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, hn = (e, t, n, r = !1) => {
  const s = st("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Jb = (e) => e.toLocaleString(), ry = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, LL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Vl(e, t) {
  const n = st("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = st("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(st("i", "", s < t ? "✓" : String(s + 1)), st("span", "", r)), n.append(o);
  }), n;
}
function CL() {
  const e = st("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(st("span", "tier-disc__mark", "?")), e;
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
}, TL = (e) => e ? `Disc ${e} is yours` : xn.gift.title, BL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Jb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", ML = (e) => e ? `${Jb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function oy(e, t = !1) {
  const n = st("div", "al-now" + (t ? " al-now--big" : "")), r = st("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const s = st("div", "al-now__t");
  s.append(st("b", "", e.title || "Playing now"), st("span", "", e.artist));
  const o = st("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return o.setAttribute("aria-hidden", "true"), o.append(st("s"), st("s"), st("s")), n.append(r, s, o), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const NL = (e) => e ? `You got a ${e.name} player` : xn.landed.title;
function _L(e, t = !0) {
  const n = st("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(st("span", "tier-disc__mark", e.mark)), n;
}
function PL(e) {
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
        c.append(st("p", "al-welcome-wait", xn.checking));
      else {
        const w = LL(u);
        w >= 0 && c.append(Vl(u === "new" ? ry.fresh : ry.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(_L(r.tier)) : u === "gift" || u === "arriving" ? c.append(CL()) : u === "new" && c.append(Kl("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(st("h1", "", u === "landed" ? NL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? TL(r.spot) : v ? xn.installedNew.title : xn[u].title)), y && u === "arriving" ? c.append(oy(y, !0)) : c.append(st("p", "", u === "gift" ? BL(r.plays, r.from, r.mystery) : u === "landed" ? ML(r.plays) : v ? xn.installedNew.body : xn[u].body)), y && u !== "arriving" && c.append(oy(y)), r.status.length) {
          const S = st("div", "al-status");
          S.setAttribute("role", "status"), S.append(...r.status), c.append(S);
        }
        if (r.asking) c.append(st("p", "al-hint al-hint--ask", xn.asking));
        else if (u === "back" && r.claimNew) {
          const S = xn.backClaim;
          c.append(st("p", "al-hint", S.body)), r.canStart && r.replaceOld ? c.append(hn("al-primary", S.replace, r.replaceOld, r.busy), st("p", "al-hint", S.replaceHint), hn("al-link", S.both, r.claimNew, r.busy), hn("al-link", S.unlock, r.unlock, r.busy)) : r.canStart && c.append(hn("al-primary", S.primary, r.claimNew, r.busy), st("p", "al-hint", S.hint), hn("al-link", S.unlock, r.unlock, r.busy)), c.append(hn("al-link", xn.back.full, r.full));
        } else if (u === "gift") {
          const S = xn.gift;
          if (r.canStart) {
            const I = hn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? S.play : S.primary, r.start, r.busy);
            c.append(I, st("p", "al-hint", S.hint));
          }
          r.canStart ? c.append(hn("al-link", S.returning, r.returning, r.busy)) : c.append(hn("al-link", S.full, r.full));
        } else if (u === "new" && r.installed) {
          const S = xn.installedNew;
          r.canStart && c.append(hn("al-primary", S.primary, r.returning, r.busy), st("p", "al-hint", S.hint), hn("al-link", S.fresh, r.start, r.busy)), c.append(hn("al-link", xn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const S = xn[u];
          r.canStart && c.append(hn("al-primary", S.primary, u === "back" ? r.unlock : r.start, r.busy), st("p", "al-hint", S.hint)), r.canStart && c.append(hn("al-link", S.returning, r.returning, r.busy)), c.append(hn("al-link", S.full, r.full));
        } else if (u === "landed") {
          if (c.append(hn("al-primary", (h = r.now) != null && h.playing ? xn.landed.playing : xn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(st("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const S of r.albums) {
              const I = hn("al-album", "", S.run);
              if (S.cover) {
                const P = st("img", "al-album__art");
                P.src = S.cover, P.alt = "", I.classList.add("al-album--art"), I.append(P);
              }
              const U = st("span", "al-album__t");
              U.append(st("b", "", S.title), st("span", "", S.by)), I.append(U), c.append(I);
            }
          }
        } else u === "empty" && c.append(hn("al-primary", xn.empty.primary, r.restock), hn("al-link", xn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(o, a);
    }
  };
}
const UL = 20, OL = ["Album", "Passkey", "Listen"], Ln = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, en = {
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
function ie(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Hn = (e, ...t) => ie("button", { type: "button", ...e }, ...t), Jc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Da = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, HL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, DL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function sy(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var _, M, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const L = (W = (M = (_ = t.radio()) == null ? void 0 : _.getState) == null ? void 0 : M.call(_)) == null ? void 0 : W.albumCover;
    return L != null && L.url && Number(L.tokenId) === m ? L.url : dl(m);
  }
  Rl(() => q());
  function u(m) {
    var _;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const L = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of DL[m]) {
        const we = L == null ? void 0 : L.querySelector(F);
        we && (we.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = HL[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [d()] : []), (_ = L == null ? void 0 : L.scrollTo) == null || _.call(L, { top: 0 });
    }
    q();
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
      w = _, (s == null ? void 0 : s.mode) === "open" && q();
    }), w = ((L = m.getState) == null ? void 0 : L.call(m)) ?? null);
  };
  r || setInterval(() => {
    var M, W;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : W.call(M), L = e.querySelector(".al-bar > i"), _ = e.querySelectorAll(".al-times span");
    !m || !L || (L.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", _.length === 2 && (_[0].textContent = Jc(m.current || 0), _[1].textContent = m.duration ? Jc(m.duration) : "–:––"));
  }, 500);
  let S = "", I = null;
  function U(m, L, _ = {}) {
    const M = _.song || c(m.cover), F = [M ? ie("img", { src: M, alt: _.song ? "Song artwork" : `${m.title} cover` }) : ie("div", { class: "al-cover-fallback" }, ie("b", {}, m.title), m.subtitle ? ie("span", {}, m.subtitle) : null), _.paused ? ie("span", { class: "al-paused" }, ie("i", { html: en.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], we = "al-cover" + (L ? "" : " al-cover--small") + (_.paused ? " is-paused" : "");
    return _.flip ? (F.push(ie("span", { class: "al-flip", "aria-hidden": "true", html: en.flip })), Hn({ class: we + " is-flippable", "aria-label": _.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: _.flip }, ...F)) : ie("div", { class: we }, ...F);
  }
  function P(m) {
    return m.plays === null || m.plays === void 0 ? ie("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ie("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ie("span", { class: "al-chip" + (m.plays <= UL ? " al-chip--low" : "") }, `${Da(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const L = m.player, _ = L.tracks.filter((W) => !W.hidden), M = [];
    return m.step !== void 0 && M.push(Vl(OL, m.step)), m.mode === "arrive" && m.from && M.push(ie("p", { class: "al-from" }, ie("span", { html: en.gift }), ie("span", {}, ie("b", {}, m.from), " sent you an album"))), M.push(U(L, !0)), M.push(ie(
      "div",
      { class: "al-intro" },
      ie("h1", {}, L.title),
      L.subtitle ? ie("p", { class: "al-artist" }, L.subtitle) : null,
      _.length ? ie("p", { class: "al-songline" }, _.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ie("span", { class: "al-chip" }, [Da(_.length, "song", "songs"), m.offered ? Da(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && M.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), M.push(ie("div", { class: "al-grow" })), m.asking ? M.push(ie("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && M.push(Hn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ie("span", { html: en.playSmall }), m.primary.label)), m.hint && !m.asking && M.push(ie("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && M.push(Hn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), M;
  }
  function T(m, L) {
    const { songs: _, current: M, started: W, own: F, out: we, waiting: ce } = L, Ke = m.player, $ = t.radio(), R = [];
    R.push(ie("div", { class: "al-listhead" }, ie("span", {}, ie("b", {}, Ke.title), ` · ${Da(_.length, "song", "songs")}`), P(m)));
    const ue = c(Ke.cover), be = "album:" + Ke.cover;
    ue && !vn.has(be) && (vn.set(be, ue), Gh(ue).then((Ae) => {
      Ae !== ue && (vn.set(be, Ae), q());
    }));
    const _e = ue ? vn.get(be) || ue : "";
    return R.push(ie("ol", { class: "al-tracks" }, ..._.map((Ae, yt) => {
      const je = String(Ae.id) === M, Ne = Gl(String(Ae.id), je && W ? F : void 0);
      return ie("li", {}, Hn(
        { class: "al-track" + (je ? " is-on" : ""), "aria-label": `Play ${Ae.title || "#" + Ae.id}`, "aria-current": je ? "true" : void 0, disabled: we || ce, onClick: () => {
          var Pe;
          return (Pe = $ == null ? void 0 : $.playToken) == null ? void 0 : Pe.call($, Ae.id);
        } },
        ie(
          "span",
          { class: "al-th" + (Ne ? "" : " is-blank") },
          Ne ? ie("img", { src: Ne, alt: "", decoding: "async" }) : _e ? ie("img", { src: _e, alt: "", decoding: "async" }) : null,
          Ne ? null : ie("span", { class: "al-n" }, String(yt + 1)),
          je ? ie("span", { class: "al-eq", html: en.eq }) : null
        ),
        ie("span", { class: "al-tt" }, Ae.title || `#${Ae.id}`, Ae.explicit ? ie("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), R;
  }
  function B(m) {
    var Ne;
    const L = m.player, _ = L.tracks.filter((Pe) => !Pe.hidden), M = t.radio(), W = w == null ? void 0 : w.nowPlaying, F = W && L.tracks.some((Pe) => String(Pe.id) === String(W.tokenId)) ? String(W.tokenId) : null, we = F ? L.tracks.find((Pe) => String(Pe.id) === F) : null, ce = m.plays === 0 && !m.playsComing, Ke = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!F, R = w == null ? void 0 : w.heart, ue = F ? (Ne = M == null ? void 0 : M.getPosition) == null ? void 0 : Ne.call(M) : null;
    F && ($ || ((ue == null ? void 0 : ue.current) ?? 0) > 0.5) && (S = L.id);
    const be = !!F && S === L.id;
    I && I !== F && (I = null);
    const _e = be ? String((W == null ? void 0 : W.cover) || "") : "", Ae = !!_e && I === F, je = [U(L, !ce, { song: Ae ? "" : _e, paused: be && !$, flip: _e ? () => {
      I = I === F ? null : F, q();
    } : void 0, flipped: Ae })];
    if (je.push(ie(
      "div",
      { class: "al-now" },
      ie(
        "div",
        { class: "al-now-t" },
        ie("div", { class: "al-song" }, we ? we.title || (W == null ? void 0 : W.title) || `#${we.id}` : L.title),
        ie("div", { class: "al-artist" }, we ? we.artist || (W == null ? void 0 : W.artist) || L.subtitle : L.subtitle || "Press play")
      ),
      F ? Hn({ class: "al-icon" + (R != null && R.liked ? " is-on" : ""), "aria-label": R != null && R.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(R != null && R.liked)), disabled: !!(R != null && R.pending) || !!(R != null && R.locked) || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.toggleLike) == null ? void 0 : Pe.call(M);
      }, html: R != null && R.liked ? en.heartOn : en.heart }) : null
    )), ce)
      je.push(ie(
        "div",
        { class: "al-out" },
        ie("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ie("p", { class: "al-out-t" }, "You've played this album out"),
        ie("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const Pe = ue != null && ue.duration ? Math.min(100, ue.current / ue.duration * 100) : 0;
      je.push(ie(
        "div",
        { class: "al-prog" },
        ie("div", { class: "al-bar" }, ie("i", { style: `width: ${Pe}%` })),
        ie("div", { class: "al-times" }, ie("span", {}, Jc((ue == null ? void 0 : ue.current) || 0)), ie("span", {}, ue != null && ue.duration ? Jc(ue.duration) : "–:––"))
      ));
    }
    return je.push(ie(
      "div",
      { class: "al-ctl" + (ce || Ke ? " is-off" : "") },
      Hn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.prev) == null ? void 0 : Pe.call(M);
      }, html: en.prev }),
      Hn({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.playPause) == null ? void 0 : Pe.call(M);
      }, html: $ ? en.pause : en.play }),
      Hn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.next) == null ? void 0 : Pe.call(M);
      }, html: en.next })
    )), m.status.length && je.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), je.push(...T(m, { songs: _, current: F, started: be, own: _e, out: ce, waiting: Ke })), je.push(ie("div", { class: "al-grow" })), je.push(Hn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      ie("span", {}, "More ", ie("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ie("span", { html: en.down })
    )), je;
  }
  function X(m, L) {
    const _ = ie("div", { class: "al-topups" + (L ? " al-topups--primary" : "") }), M = L ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of M) {
      const F = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      _.append(Hn({ class: "al-topup", disabled: !F, onClick: () => t.topUp(W) }, L ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return L && _.append(Hn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), _;
  }
  function Q(m) {
    const L = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), _ = ie(
      "div",
      { class: "al-card" },
      ie("div", { class: "al-card-h" }, ie("b", {}, `Add plays to ${m.player.title}`), ie("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      ie("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : L ? `Moved from My player · ${Da(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !L && !m.playsComing && m.myPlays !== void 0 ? Hn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (F, we, ce, Ke) => Hn(
      { class: "al-row", onClick: Ke },
      ie("span", { class: "al-row-i", html: F }),
      ie("span", { class: "al-row-t" }, ie("b", {}, we), ie("small", {}, ce)),
      ie("span", { class: "al-row-go", html: en.right })
    ), W = ie(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(en.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, q();
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
        M(en.grid, "My music", "Your albums and the radio", () => u("music")),
        M(en.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? M(en.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        M(en.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function oe(m) {
    var ce, Ke;
    const L = m.player, _ = w == null ? void 0 : w.nowPlaying, M = _ && L.tracks.some(($) => String($.id) === String(_.tokenId)) ? String(_.tokenId) : null, W = !!(w != null && w.playing) && !!M, F = M ? (Ke = (ce = t.radio()) == null ? void 0 : ce.getPosition) == null ? void 0 : Ke.call(ce) : null;
    M && (W || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (S = L.id);
    const we = !!M && S === L.id;
    return T(m, {
      songs: L.tracks.filter(($) => !$.hidden),
      current: M,
      started: we,
      own: we ? String((_ == null ? void 0 : _.cover) || "") : "",
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
      ie("a", { class: "al-brand", href: "/radio" }, Kl("al-logo"), "Xtrata ", ie("b", {}, "Music")),
      m.mode === "open" ? Hn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: en.grid }) : null
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
const FL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", jL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${FL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, RL = (e) => jL("source|audio", e), zL = 48 * 1024 * 1024;
function GL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function KL(e) {
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
    if (I.length > zL) throw new Error("too large");
    const U = I.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return GL(U[1].replace(/&amp;/g, "&"));
    const P = w === 0 ? RL(I) : null;
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
const VL = ["Earned", "Claim", "Yours"], XL = ["Connect", "Link", "Name"], Pt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bn = (e, t, n, r = !1) => {
  const s = Pt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, iy = (e, t, n, r = !1) => {
  const s = bn("al-album", "", n, r), o = Pt("span", "al-album__t");
  return o.append(Pt("b", "", e), Pt("span", "", t)), s.append(o), s;
}, YL = (e) => `No. ${String(e).padStart(4, "0")}`, qL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function WL(e) {
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
      if (h.append(d === "have" ? Vl(XL, qL(i)) : Vl(VL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
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
        S(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), I.push(bn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Pt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), bn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (S(`Your record will carry ${y} beside your player’s address.`), I.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), bn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (S("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), I.push(
          iy("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          iy("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          bn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (S("Could not check for a .btc name just now.", "ppp-warn"), I.push(bn("al-primary", "Check again", i.refresh, i.busy), bn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), I.push(Pt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), I.push(bn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (S(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), I.push(bn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (S(`Found it: ${y}. It goes on your plaque beside your player’s address.`), I.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (S(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), I.push(bn("al-primary", "Check again", i.refresh, i.busy))) : (S(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), I.push(bn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (S("Connect the Leather or Xverse wallet that holds your .btc name."), I.push(bn("al-primary", "Connect my wallet", i.connect, i.busy))), I.push(bn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const P = Pt("ol", "aw-steps"), A = Pt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Pt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Pt("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Pt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Pt("li", "", "Check again, and your name shows on the preview before you claim.");
        P.append(A, B, X), h.append(P), I.push(bn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), bn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (S("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const P = Pt("p", "al-hint"), A = Pt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", P.append(A), h.append(P);
        }
      } else if (S(`${w} record ${YL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), I.push(bn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
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
const Qb = "xtrata.xyz/music/release", ZL = "Release music on Xtrata Music; no spending permission", JL = (e) => ({
  domain: br({ name: $t(Qb), version: $t("1"), "chain-id": An(1) }),
  message: br({ purpose: $t(ZL), artist: $t(e.artist), release: $t(e.hash), issued: An(e.issued) })
}), QL = "Set the price of my release on Xtrata Music; no spending permission", eC = 100000n, tC = 1000000000n, nC = (e) => e === 0n || e >= eC && e <= tC, rC = (e) => ({
  domain: br({ name: $t(Qb), version: $t("1"), "chain-id": An(1) }),
  message: br({ purpose: $t(QL), artist: $t(e.artist), release: $t(e.release), price: An(BigInt(e.price)), issued: An(e.issued) })
}), Ri = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, oC = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, me = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, mn = (e, t, n = "") => {
  const r = me("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Qc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), ay = (e) => {
  const t = Kr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function el(e, t, n = "", r = "") {
  const s = me("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(me("span", t)), s;
}
const fd = (e) => !!e && Af(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function sC(e) {
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
    const re = Array.isArray(O) ? O.filter(fd).map((le) => ({ ...le, hidden: !!le.hidden })) : [];
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
      const re = await e.signShelf(z, O), le = await e.json("/radio/release/shelf", Qc(re));
      return w(ee.address, le == null ? void 0 : le.albums, !0), U(le == null ? void 0 : le.pay) ? A(ee.address, le.pay) : z === "add" && A(ee.address, null, O), !0;
    } catch (re) {
      return z !== "list" && (o = re.message || "That did not work. Try again."), !1;
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
    const re = P(z);
    O ? re[O.release] = { ...((le = re[O.release]) == null ? void 0 : le.order) === O.order ? re[O.release] : {}, ...O } : delete re[ee], e.store.set(I(z), Object.keys(re).length ? JSON.stringify(re) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function X(z, O, ee = !1) {
    var re;
    if (!T.has(O.order)) {
      T.add(O.order), B.set(O.order, e.now()), ee && (o = "", e.changed());
      try {
        const le = await e.json("/radio/release/paid", Qc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
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
    const ee = me("ol", "", "ppp-rel-songs");
    return z.forEach((re, le) => {
      const bt = me("li");
      bt.append(el(e.art.song(re.id, !0) || "", String(le + 1), O), me("span", re.title)), ee.append(bt);
    }), ee;
  }
  function _() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [me("p", `♫ ${a.error}`, "ppp-warn")] : [me("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = me("div", "", "ppp-release-in"), ee = me("p", "", "ppp-release-in__h"), re = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ee.append(me("b", z.title), me("span", `${z.subtitle || e.who(z.artist)} · ${ay(z)}${re > 0n ? ` · ${Ri(re)} STX` : ""}`));
    const le = Kr(z), bt = e.art.cover(z.cover) || (z.cover ? "" : le[0] && e.art.song(le[0].id, !0) || ""), De = me("div", "", "ppp-rel-top");
    De.append(el(bt, "💿", "", "is-cover"), ee), O.append(De, L(le.map((Le) => ({ id: Le.id, title: Le.title || `#${Le.id}` })), e.art.cover(z.cover))), O.append(me("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Ge = e.player(), Et = v().find((Le) => Le.id === z.id), Fe = me("div", "", "ppp-award__row");
    if (Et)
      O.append(me("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Fe.append(mn("Play it", () => e.open(z), "primary"));
    else if (!Ge.address) O.append(me("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Ge.unlocked) O.append(me("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (re > 0n) {
      const Le = P(Ge.address)[z.id], qe = e.main(), Xe = `${Ri((Le == null ? void 0 : Le.amount) ?? re)} STX`;
      if (Le != null && Le.txid || (Le == null ? void 0 : Le.status) === "confirming") {
        O.append(me("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const We = mn("Check now", () => void X(Ge.address, Le, !0));
        We.disabled = T.has(Le.order), Fe.append(We);
      } else if (O.append(me("p", `This album costs ${Xe}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Le) O.append(me("p", "Buying is paused right now.", "ppp-warn"));
      else if (Le) {
        if (qe) {
          const dn = mn(`Pay ${Xe} from my wallet`, () => void Q(qe, Ge.address, Le), "primary");
          dn.disabled = !!s, Fe.append(dn);
        } else
          O.append(me("p", "Connect a Stacks wallet to pay here. Or pay from any wallet, exactly like this:", "ppp-mute")), Fe.append(mn("Connect Stacks wallet", Rh, "primary"));
        const We = me("div", "", "ppp-rel-pay"), zt = (dn, Zn, Ht) => {
          const yn = me("p");
          return yn.append(me("span", dn), me("code", Zn), pr(`order-${Ht}:${Le.order}`, "Copy", () => Zn, "tiny", e.changed)), yn;
        };
        We.append(zt("Send", Ri(Le.amount) + " STX", "amount"), zt("To", Le.to, "to"), zt("Memo", Le.memo, "memo")), O.append(We, me("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const gn = mn("I have paid: check", () => void X(Ge.address, Le, !0));
        gn.disabled = T.has(Le.order), Fe.append(gn);
      } else {
        const We = mn(`Buy · ${Xe}`, () => void oe(z), "primary");
        We.disabled = h || !!s, Fe.append(We);
      }
    } else {
      O.append(me("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Le = mn("Add to my player", () => {
        S("add", z.id).then((qe) => {
          qe && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Le.disabled = h, Fe.append(Le);
    }
    return Fe.append(mn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(Fe), s && O.append(me("p", s, "ppp-cyan")), o && O.append(me("p", o, "ppp-warn")), [O];
  }
  let M = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const O = me("details", "", "ppp-release-manage");
    O.open = M, O.ontoggle = () => {
      M = O.open;
    };
    const ee = z.filter((le) => le.hidden).length;
    O.append(me("summary", `Albums I added (${z.length}${ee ? `, ${ee} hidden` : ""})`));
    const re = e.player().unlocked;
    re || O.append(me("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const le of z) {
      const bt = me("div", "", "ppp-release-row" + (le.hidden ? " is-hidden" : "")), De = me("span", "", "ppp-release-row__t");
      De.append(me("b", le.title), me("span", `${le.subtitle || e.who(le.artist)}${le.hidden ? " · hidden" : ""}`));
      const Ge = mn(le.hidden ? "Show" : "Hide", () => void S(le.hidden ? "show" : "hide", le.id), "tiny"), Et = mn("Remove", () => void S("remove", le.id), "tiny");
      Ge.disabled = Et.disabled = !re || h, bt.append(De, Ge, Et), O.append(bt);
    }
    return O.append(me("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && O.append(me("p", o, "ppp-warn")), O;
  }
  let F = null, we = [], ce = null;
  const Ke = me("input");
  Ke.maxLength = 60, Ke.placeholder = "Title of the single, EP or album", Ke.setAttribute("aria-label", "Release title");
  const $ = me("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const R = me("input");
  R.inputMode = "numeric", R.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", R.setAttribute("aria-label", "Cover inscription number");
  const ue = me("input");
  ue.inputMode = "decimal", ue.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ue.setAttribute("aria-label", "Price in STX");
  let be = null;
  const _e = (z, O, ee = "") => {
    be = (be == null ? void 0 : be.id) === z && be.what === O ? null : { id: z, what: O }, (be == null ? void 0 : be.what) === "price" && (ue.value = ee), o = "", e.changed();
  };
  async function Ae(z, O) {
    if (s) return;
    const ee = oC(ue.value);
    if (ee === null || !nC(ee)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const re = { artist: z, release: O.id, price: ee.toString(), issued: e.now() }, le = await e.sign(z, rC(re));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Qc({ request: re, signature: le })), o = ee > 0n ? `Price set ✓ “${O.title}” now costs ${Ri(ee)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, be = null, Ne(z, !0);
    } catch (re) {
      o = re.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const yt = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function je(z) {
    F = { for: z, loading: !0 }, we = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const ee = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((re) => Number.isSafeInteger(re == null ? void 0 : re.id) && typeof re.title == "string") : null;
        F = ee ? { for: z, songs: ee, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Ne(z, O = !1) {
    !O && (ce == null ? void 0 : ce.for) === z && e.now() - ce.at < 6e4 || (ce = { for: z, list: (ce == null ? void 0 : ce.for) === z ? ce.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (ce = { for: z, list: ee.releases.filter(fd), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Pe(z) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const O = R.value.trim().replace(/^#/, ""), ee = qb({ title: Ke.value.trim(), subtitle: $.value.trim(), tracks: [...we], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const re = { artist: z, hash: Wb(ee), issued: e.now() }, le = await e.sign(z, JL(re));
        s = "Releasing…", e.changed();
        const bt = await e.json("/radio/release/create", Qc({ definition: ee, request: re, signature: le }));
        o = `${bt.existing ? "Already released" : "Released"} ✓ “${bt.title}”. Its link is below.`, we = [], Ke.value = "", R.value = "", e.audition.stop(), Ne(z, !0);
      } catch (O) {
        o = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Bn = () => {
    queueMicrotask(() => e.audition.stop());
  }, En = /* @__PURE__ */ new Set();
  function pt(z) {
    const O = we.map((We) => z.find((zt) => zt.id === We)).filter((We) => !!We), ee = R.value.trim().replace(/^#/, ""), re = /^\d{1,9}$/.test(ee) ? Number(ee) : null, le = e.art.cover(re), bt = O[0] ? e.art.song(O[0].id, !0) : null, De = me("div", "", "ppp-release-preview");
    De.append(me("p", "How it will look", "ppp-featured__h"));
    const Ge = me("p", "", "ppp-release-in__h"), Et = me("b", Ke.value.trim() || "Untitled"), Fe = me("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    Ge.append(Et, Fe);
    const Le = me("div", "", "ppp-rel-top");
    Le.append(el(re ? le : bt || "", "💿", "", "is-cover"), Ge), De.append(Le, L(O.map((We) => ({ id: We.id, title: We.title })), le));
    const qe = O.filter((We) => e.art.song(We.id, !0) === null).length, Xe = [];
    re && !le && Xe.push(`Looking for an image in #${re}… If none appears, that inscription is not a picture.`), qe && Xe.push(`Finding artwork for ${qe} ${qe === 1 ? "song" : "songs"}…`), !qe && O.some((We) => e.art.song(We.id, !1) === "") && Xe.push(`A numbered square is a song with no artwork of its own${le ? ": it shows the cover, dimmed" : ""}.`);
    for (const We of Xe) De.append(me("p", We, "ppp-mute"));
    return Ke.oninput = () => {
      Et.textContent = Ke.value.trim() || "Untitled";
    }, $.oninput = () => {
      Fe.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, R.onchange = () => e.changed(), De;
  }
  function Bt() {
    var ee;
    const z = e.main();
    if (!t || !z)
      return F && (F = null, we = [], Bn()), null;
    const O = [me("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== z && (F = null, we = [], En.clear(), Bn()), !F) O.push(mn("Show the songs in my wallet", () => je(z), "primary"));
    else if (F.loading) O.push(me("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(me("p", F.error, "ppp-warn"), mn("Try again", () => je(z)));
    else if (!F.songs.length) O.push(me("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(me("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const re = me("div", "", "ppp-release-songs");
      for (const De of F.songs) {
        const Ge = we.indexOf(De.id), Et = me("div", "", "ppp-release-song" + (Ge >= 0 ? " is-on" : "")), Fe = e.audition.state(De.id);
        Fe !== "idle" && En.add(De.id);
        const Le = mn(Fe === "playing" ? "❚❚" : Fe === "loading" ? "…" : "▶", () => e.audition.toggle(De.id), "ppp-release-hear" + (Fe === "playing" ? " is-on" : ""));
        Le.setAttribute("aria-label", Fe === "playing" ? `Stop ${De.title}` : `Listen to ${De.title}`), Le.title = Fe === "error" ? "This song could not be played just now" : Fe === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const qe = e.art.song(De.id, Ge >= 0 || En.has(De.id)), Xe = mn("", () => {
          we = Ge >= 0 ? we.filter((We) => We !== De.id) : [...we, De.id], e.changed();
        }, "ppp-release-pick");
        Xe.setAttribute("aria-pressed", String(Ge >= 0)), Xe.append(me("i", Ge >= 0 ? String(Ge + 1) : "+"), me("b", De.title), me("span", Fe === "error" ? "could not play" : `${De.artist ? De.artist + " · " : ""}#${De.id}`, Fe === "error" ? "ppp-warn" : "")), Et.append(Le, el(qe || "", qe === "" ? "♪" : "", ""), Xe), re.append(Et);
      }
      O.push(re), F.more && O.push(me("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && we.length && ($.value = ((ee = F.songs.find((De) => De.id === we[0])) == null ? void 0 : ee.artist) || "");
      const le = we.length === 0 ? "release" : we.length === 1 ? "single" : we.length <= 6 ? "EP" : "album", bt = mn(we.length ? `Sign and release this ${le} · ${we.length} ${we.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Pe(z), "primary");
      bt.disabled = !we.length || !!s, O.push(Ke, $, R), we.length && O.push(pt(F.songs)), O.push(bt);
    }
    if (s && O.push(me("p", s, "ppp-cyan")), o && !a && O.push(me("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Ne(z), (ce == null ? void 0 : ce.for) === z && ce.list.length) {
      O.push(me("p", "Your releases", "ppp-featured__h"));
      for (const re of ce.list) {
        const le = me("div", "", "ppp-release-row"), bt = me("span", "", "ppp-release-row__t"), De = BigInt(/^\d{1,12}$/.test(re.price ?? "") ? re.price : "0"), Ge = De > 0n ? ` · ${Ri(De)} STX · ${(re.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (bt.append(me("b", re.title), me("span", `${ay(re)} · added by ${re.added.toLocaleString()} ${re.added === 1 ? "player" : "players"}${Ge}`)), le.append(bt, pr("release-link:" + re.id, "Copy link", () => yt(re.id), "tiny", e.changed)), n.sales) {
          const Fe = mn("Price", () => _e(re.id, "price", De > 0n ? Ri(De) : ""), "tiny");
          Fe.setAttribute("aria-expanded", String((be == null ? void 0 : be.id) === re.id && be.what === "price")), le.append(Fe);
        }
        if (n.copies && e.copies) {
          const Fe = mn("Send copies", () => _e(re.id, "copies"), "tiny");
          Fe.setAttribute("aria-expanded", String((be == null ? void 0 : be.id) === re.id && be.what === "copies")), le.append(Fe);
        }
        if (O.push(le), (be == null ? void 0 : be.id) !== re.id) continue;
        const Et = me("div", "", "ppp-release-way");
        if (be.what === "price" && n.sales) {
          const Fe = mn("Sign this price", () => void Ae(z, re), "primary");
          Fe.disabled = !!s, Et.append(
            me("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ue,
            Fe
          );
        } else be.what === "copies" && n.copies && e.copies && Et.append(...e.copies(z, { id: re.id, title: re.title }));
        Et.childNodes.length && O.push(Et);
      }
    }
    return O;
  }
  return { sync: q, albums: m, banner: _, manage: W, fold: Bt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const hd = "xtrata.radio.replace.v1", Cn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Io = (e, t, n = "") => {
  const r = Cn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, cy = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function iC(e) {
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
    const S = [], I = (X, Q) => S.push(Cn("p", `Replacing your old player · step ${X} of 3 · ${Q}`, "ppp-cyan")), U = () => Io("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      S.push(Cn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? S.push(Cn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Io("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && S.push(Cn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return S.push(Cn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), S.push(Io("Done", w, "quiet")), S;
    }
    if (!v.listening || n.removed)
      return n.removed ? (I(3, "claim your new player"), S.push(Cn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), S.push(Io("Hide this", w, "quiet")), S) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return I(1, "empty it"), S.push(Cn("p", "Unlock your old player so it can be emptied."), Io("Unlock my old player", e.unlock, "primary"), U()), S;
    const P = e.keepBoth(v), A = (X) => (I(1, "empty it"), S.push(Cn("p", X, "ppp-warn")), P && S.push(Io("Keep both players instead", () => {
      w(), P();
    }, "primary")), S.push(U()), S);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return I(1, "empty it"), S.push(Cn("p", "Checking what this player has…", "ppp-mute"), U()), S;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return I(1, "empty it"), S.push(Cn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), U()), S;
    if (v.balance === void 0)
      return I(1, "empty it"), S.push(Cn("p", "Checking what it holds…", "ppp-mute"), U()), S;
    if (v.balance > e.dust(v))
      return I(1, "empty it"), S.push(Cn("p", `It holds ${cy(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? S.push(Io("Send everything back", e.returnAll, "primary")) : S.push(Cn("p", "There is nowhere set to send it. Connect a Stacks wallet and link it to this player, then come back here.", "ppp-warn"), Io("Connect Stacks wallet", Rh, "primary")), S.push(U()), S;
    I(2, "remove it from this device"), S.push(Cn("p", v.balance > 0n ? `Empty ✓ (the ${cy(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), S.push(Cn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = Io(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, S.push(T, U()), i && S.push(Cn("p", i, "ppp-warn")), S;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: y };
}
const aC = [
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
function cC(e) {
  for (const [t, n] of aC) if (n.test(e)) return t;
  return null;
}
const e1 = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), t1 = (e) => /Android/.test(e);
function lC(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : e1(t) ? "x-safari-" + n.href : t1(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const uC = (e) => e1(e) ? "Safari" : t1(e) ? "Chrome" : "your browser", zi = "Xtrata Music player", dC = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function ly(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: zi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && dC.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${zi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: zi, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: zi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: zi, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: zi, detail: "Open on this device." });
    }
  return r;
}
const pd = "xtrata.radio.novice", n1 = "xtrata.radio.novice.previewed.v1", uy = 6 * 6e4;
function fC(e, t) {
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
const hC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, dy = (e) => hC.test(e ?? ""), pC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, gC = {
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
}, yC = (e, t) => gC[e] ?? t;
function wC(e, t) {
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
const mC = "Make your player once, with Face ID or your fingerprint, and the music starts.", bC = "Checking your player…", $f = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function r1(e) {
  try {
    const t = JSON.parse(e.get(n1) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function xC(e, t) {
  const n = r1(e).filter((r) => r !== t);
  n.push(t), e.set(n1, JSON.stringify(n.slice(-50)));
}
function gd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...$f(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : $f();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > uy ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > uy ? { ...e, phase: "done" } : e;
  }
}
const tl = (e) => e.phase === "open" || e.phase === "playing";
function SC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const vC = [100, 250, 500, 1e3], AC = (e, t = Yr) => BigInt(e) * jn(t);
function EC(e, t = Yr, n = 0n) {
  const r = Bo - e - n;
  return r > 0n ? Number(r / jn(t)) : 0;
}
function kC(e, t = Yr, n = 0n) {
  const r = e === void 0 ? 0 : EC(e, t, n);
  return vC.map((s) => ({ plays: s, stx: AC(s, t), fits: e !== void 0 && s <= r }));
}
const $C = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, IC = (e) => $C[e.unit](e.amount), Yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fl = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function LC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${fl(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${fl(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${fl(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function CC(e) {
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
    const a = kC(i.balance, i.fee, i.incoming);
    s(a);
    const c = SC(i.switches);
    (y = c.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], h = Yt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Yt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fl(i.playsLeft, "play", "plays")} left.`));
    const d = LC(i.done);
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
        const U = Yt("div", "ppp-restock__pay"), P = IC({ unit: "microSTX", amount: I.stx }), A = Yt("p", "ppp-restock__amount");
        A.append("Send ", Yt("b", "", P), " to your player:"), U.append(A, Yt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Yt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Dr(I.stx), "")), U.append(T), U.append(Yt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(U);
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
const Fr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), TC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function BC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: TC(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function MC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Fr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function NC(e, t, n = "", r = 60) {
  const s = Fr(t).split(/\s+/).filter(Boolean), o = Fr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Fr(a.artist), u = Fr(a.title), h = String(a.id);
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
const lr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fy = 12, _C = 14, hy = (e) => [...e.trim()].length <= _C;
function PC(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = lr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = lr("div", "hint"), u = lr("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = lr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = lr("div", "likesTools");
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
        const T = lr("button", "find-back", "Back to My player");
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
      const T = lr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const S = MC(n), I = (T, B, X, Q = "", oe = "") => {
      const q = lr("button", "find-chip" + (oe ? " " + oe : "") + (B ? " is-on" : ""), T);
      return q.type = "button", q.setAttribute("aria-pressed", String(B)), Q && (q.title = Q), q.onclick = X, q;
    }, U = (T, B, X = "") => I(B, Fr(T.name) === Fr(o), () => {
      var Q;
      o = Fr(T.name) === Fr(o) ? "" : T.name, y(), o && t.artistsMount && ((Q = e.scrollIntoView) == null || Q.call(e, { block: "start", behavior: "smooth" }));
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, X);
    if (t.grid) {
      const T = S.filter((Q) => hy(Q.name)), B = S.filter((Q) => !hy(Q.name)), X = i ? B : B.filter((Q) => Fr(Q.name) === Fr(o));
      u.replaceChildren(
        ...T.map((Q) => U(Q, Q.name)),
        ...B.length ? [I(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, y();
        }, "", "find-more")] : [],
        ...X.map((Q) => U(Q, `${Q.name} · ${Q.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? S : S.slice(0, fy);
      u.replaceChildren(
        ...T.map((B) => U(B, `${B.name} · ${B.songs}`)),
        ...S.length > fy ? [I(i ? "Fewer artists" : `All ${S.length} artists`, !1, () => {
          i = !i, y();
        })] : []
      );
    }
    const P = NC(n, s, o), A = t.current();
    h.replaceChildren(...P.songs.map((T) => {
      var Q, oe;
      const B = lr("li", "lrow" + (T.id === A ? " now" : "")), X = lr("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const q = lr("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", X.append(" ", q);
      }
      if ((oe = t.liked) != null && oe.call(t, T.id)) {
        const q = lr("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), B.append(X, q);
      } else B.append(X);
      return B.append(lr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${S.length.toLocaleString()} artists. Search, or pick an artist.` : P.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : P.total > P.songs.length ? `Showing ${P.songs.length} of ${P.total.toLocaleString()}. Type more to narrow it down.` : `${P.total} ${P.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const py = (e, t, n) => jf(Gf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), UC = 317, OC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, HC = 15 * 6e4, DC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function yd(e, t) {
  return e.standalone ? null : t ? "prompt" : DC(e) ? "ios" : null;
}
const Wi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function FC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function jC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const ur = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, RC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function zC(e, t, n = "safari") {
  const r = jC(n), s = ur("div", "a2hs-sheet a2hs-sheet--" + r.where);
  s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", Wi.title);
  const o = ur("div", "a2hs-card"), i = ur("div", "a2hs-head"), a = ur("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = ur("div");
  c.append(ur("h2", "", Wi.title), ur("p", "", Wi.body)), i.append(a, c);
  const u = ur("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = ur("li");
    v.append(ur("i", "", String(y + 1)), ur("span", "", w)), u.append(v);
  });
  const h = ur("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(RC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = ur("button", "a2hs-close", Wi.close);
  return d.type = "button", d.onclick = t, o.append(i, u, d), s.append(o, h), s.onclick = (w) => {
    w.target === s && t();
  }, s;
}
function GC(e) {
  let t = null, n = null, r = !1;
  const s = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, o = () => {
    const i = r ? null : yd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Wi.label), e.button.title = Wi.label, e.button.onclick = () => {
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
    i === "ios" && !n && (n = zC(e.icon, s, FC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, o();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, s(), o();
  }), o(), { sync: o, kind: () => r ? null : yd(e.env(), !!t) };
}
const gy = document.getElementById("ppp");
gy && KC(gy);
function KC(e) {
  var Xh;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = B1(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = lI({
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
      const p = new Promise((se, ve) => {
        i.addEventListener("load", () => se(), { once: !0 }), setTimeout(() => ve(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new v1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (se, ve) => f.has(se) ? g.request(se, ve) : Promise.race([
        g.request(se, ve),
        new Promise((ge, Ze) => setTimeout(() => Ze(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: R5,
      balance: G5,
      account: z5,
      owner: K5,
      broadcast: V5,
      transaction: X5,
      confirmedNonce: async (l) => {
        const p = await ks(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => nd({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, j) => kg({
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
    validate: Y5,
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
    changed: () => pe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => eI(l, ks), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
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
    history: (l, p) => rI(l, (g) => ks(g), p),
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
    nameOf: (l) => Mn(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, j, se) => new Promise((ve, ge) => kg({
    recipient: f,
    amount: j.toString(),
    memo: se,
    stxAddress: g,
    network: new wd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ze) => ve(Ze.txId || ""),
    onCancel: () => ge(new Error(p)),
    onError: ge
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), pe(c.snapshot());
  } : null, w = iC({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => lt(l),
    changed: () => pe(c.snapshot()),
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
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = yL({
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
    who: (l) => lt(l),
    changed: () => pe(c.snapshot()),
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
      if (!x()) return;
      const p = c.snapshot();
      window.dispatchEvent(new CustomEvent(p.slot === l && !p.error ? "xtrata:radio-listen" : "xtrata:radio-panel"));
    });
  };
  let I;
  const U = (l) => {
    l !== I && (I = l, window.dispatchEvent(new CustomEvent("xtrata:radio-albums", { detail: { has: l } })));
  }, P = $L({
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
    changed: () => pe(c.snapshot())
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
  }, T = fC(location.search, A);
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
  }, q = Q ? sy(Q, oe) : null, m = sC({
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
    open: (l) => jt(l, !0),
    who: (l) => lt(l),
    art: { song: (l, p) => p && Gl(String(l)) || ty(String(l)), cover: (l) => dl(l) },
    audition: KL({
      changed: () => pe(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => pe(c.snapshot()),
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
    const l = new Set(yn.map((p) => p.id));
    return [...yn, ...m.albums().filter((p) => !l.has(p.id))];
  }, _ = Q ? WL(Q) : null, M = "xtrata.radio.award.later.v1";
  let W = "ready", F = !1, we = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(M) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), ce = !1;
  const Ke = "xtrata.radio.tier.v1";
  let $ = (() => {
    const l = A.get(Ke);
    return Zc(l) ? qs(l) : null;
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
        se = l.gift && !l.gift.player && l.gift.drop === "players" ? cL(BigInt(l.gift.amount)) : null;
      } catch {
        se = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (se = null), ((se == null ? void 0 : se.id) ?? null) !== (($ == null ? void 0 : $.id) ?? null) && ($ = se, A.set(Ke, se ? se.id : null));
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
  const be = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), _e = document.getElementById("a2hs");
  _e && GC({
    button: _e,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: be })
  });
  let Ae = T.on ? UC : null, yt = !1, je = 0, Ne = "";
  T.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : OC(l == null ? void 0 : l.song) ? l.song : Ae;
    p !== Ae && !yt && (Ae = p, pe(c.snapshot()));
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
  })(), Bn = (l) => {
    var f, j, se;
    if (!yt || Ae === null) return !1;
    if (Date.now() - je > HC || l.step === "ready")
      return l.step !== "ready" && (yt = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), g = Number((se = p == null ? void 0 : p.nowPlaying) == null ? void 0 : se.tokenId);
    return Date.now() - je < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== Ae ? (yt = !1, !1) : !0;
  };
  function En() {
    const l = window.XtrataRadio;
    if (!(Ae === null || !(l != null && l.playToken))) {
      yt = !0, je = Date.now(), c.holdFirstPlay(), pe(c.snapshot());
      try {
        l.playToken(Ae);
      } catch {
        yt = !1;
      }
    }
  }
  const pt = () => {
    var f, j;
    if (!yt || Ae === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === Ae ? l.nowPlaying : null, g = vu.get(Ae);
    return { title: (p == null ? void 0 : p.title) || (g == null ? void 0 : g.title) || "", artist: (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${Ae}`, playing: !!(l != null && l.playing) };
  }, Bt = T.on && Q ? PL(Q) : null, Ot = Date.now();
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
    pe(c.snapshot());
  }, le = (l, p) => {
    var se;
    if (!Bt || p || ee) return null;
    if (!l.gate || l.step === "loading" || (z = !0), !z) return Date.now() - Ot < 1e4 ? "checking" : null;
    if (!B(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((se = l.gift) != null && se.player), j = f && !l.entries.some((ve) => ve.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (O === "landed" || O === "arriving" && (j || yt)) ? "landed" : l.step === "loading" && O !== "checking" ? O : null;
  };
  let bt = !1;
  function De(l, p, g = [], f) {
    if (!Bt) return;
    const j = f !== void 0 ? f : le(l, p);
    if (O = j, delete document.documentElement.dataset.noviceBoot, !j) {
      Bt.render(null, p);
      return;
    }
    const se = [...g];
    j === "arriving" && l.arrival && se.push(Be(l.arrival)), l.step === "unsupported" ? se.push(C("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && se.push(C("p", l.error, "ppp-warn"));
    const ve = j === "gift" ? v.incomingStarter() : null;
    ve && Ae === null && !bt && l.step === "intro" && !l.busy && !l.armed && !l.error && !fn && (bt = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Bt.render({
      mode: j,
      status: se,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !fn,
      plays: ve ? ve.plays : j === "landed" ? l.playsLeft : null,
      from: (ve == null ? void 0 : ve.from) ?? null,
      tier: $,
      mystery: R,
      spot: Pe,
      installed: be,
      intro: ve && Ae !== null && l.step === "intro" ? { ready: !0 } : null,
      now: pt(),
      albums: j === "landed" ? yn.map((ge) => ({ title: ge.title, by: ge.subtitle, cover: dl(ge.cover), run: () => {
        re(), jt(ge, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        ve && Ae !== null && En(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Fe(),
      full: () => {
        var _t, ht, Ve;
        const ge = window.XtrataRadio, Ze = j === "landed" && !((ht = (_t = ge == null ? void 0 : ge.getState) == null ? void 0 : _t.call(ge)) != null && ht.playing);
        yt = !1, re(), Ze && ((Ve = ge == null ? void 0 : ge.playPause) == null || Ve.call(ge));
      }
    });
  }
  Bt && setTimeout(() => {
    z || pe(c.snapshot());
  }, 10100), Rl(() => {
    (Bt != null && Bt.showing() || document.documentElement.dataset.asking || m.wantsArt()) && pe(c.snapshot());
  });
  const Et = CC({
    input: () => {
      var j, se, ve, ge;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ze) => Ze.kind === "play" && Ze.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : Qe(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((se = l.gate) == null ? void 0 : se.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((ve = l.gate) == null ? void 0 : ve.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ze) => Ze.recipient)).size, likes: g.filter((Ze) => Ze.kind === "like" && Ze.status === "confirmed" && Ze.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((ge = l.likeFunds) != null && ge.pending)
      };
    },
    copyButton: (l, p, g, f) => pr(l, p, g, f, () => {
      pe(c.snapshot());
    })
  }), Fe = () => {
    if (!c.snapshot().unproven) {
      Et.open();
      return;
    }
    c.prove().then((l) => {
      l && Et.open();
    });
  }, Le = document.getElementById("albumList"), qe = Le ? sy(Le, oe, { list: !0 }) : null, Xe = "xtrata.radio.album.last.v1", We = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Xe) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let zt = "";
  const gn = (l) => {
    const p = JSON.stringify(l);
    if (p !== zt) {
      zt = p;
      try {
        localStorage.setItem(Xe, p);
      } catch {
      }
    }
  };
  let dn = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (te = !0), bo();
    const p = Nn(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Zn;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const Ht = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Zn && (Zn = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let yn = [], xr = 0, qr = !1, zn = null;
  const Sr = (l) => {
    var p, g;
    qr || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - xr < 6e4 || (xr = Date.now(), a("/radio/gift/featured").then((f) => {
      yn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), qr = !0, yn.length && pe(c.snapshot());
    }).catch(() => {
    }));
  }, wn = (l) => {
    var p;
    return zn && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? zn : null;
  }, jt = (l, p = !1) => {
    var f, j;
    zn = l, pe(c.snapshot());
    const g = l && p ? Kr(l)[0] : null;
    g && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, g.id));
  };
  let ut = $f(), Mt = null;
  const un = (l) => {
    const p = T.preview && !fn && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (ut = gd(ut, { kind: "offer", album: p.player.id, already: r1(A).includes(p.player.id) }), tl(ut) ? p.player : null) : (ut = gd(ut, { kind: "withdraw" }), null);
  }, Cr = (l) => {
    const p = ut.phase;
    ut = gd(ut, l), ut.phase !== p && (ut.album && (ut.phase === "playing" || ut.phase === "done") && xC(A, ut.album), pe(c.snapshot()));
  };
  setInterval(() => {
    ut.phase === "playing" && Cr({ kind: "tick", at: Date.now() });
  }, 5e3);
  let yo = "", E, H = !1, V = !1, D;
  const J = (l, p) => {
    var Go, Ao, Ti, Qn, La, Ko, Oe, It, Nt, On;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((Go = l.giftStop) == null ? void 0 : Go.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = Mt, se = Bn(l), ve = f ? B(l) ? yC(f.reason, f.text) : f.text : null, ge = j || se ? null : ve ?? (t && (!((Ao = l.gate) != null && Ao.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null), Ze = l.slot === 0 && !((Ti = l.gift) != null && Ti.player) && !l.entries.some((Vo) => Vo.kind === "play"), _t = !!Bt && !ee && B(l) && (l.step === "intro" || l.step === "unsupported" || l.step === "locked" || l.step === "fund" && Ze), ht = (f == null ? void 0 : f.reason) === "arriving" || (f == null ? void 0 : f.reason) === "tab" || _t, Ve = !!ge && !ht, Ue = Ve ? null : ge;
    Ve !== D && ((Qn = g.setSample) == null || Qn.call(g, Ve), D = Ve), Ue && Ue !== E && (g.setGiftStop(Ue), E = Ue);
    const Ie = l.step === "off" || l.step === "elsewhere" ? null : ((La = l.gift) == null ? void 0 : La.player) ?? j ?? wn(l) ?? null, Ct = Ie ? Ie.id + ":" + Ie.cover + ":" + Ie.tracks.map((Vo) => Vo.id).join(",") : "";
    Ct !== yo && (g.setGiftPlayer(Ie ? { id: Ie.id, title: Ie.title, subtitle: Ie.subtitle, tracks: Kr(Ie).map((Vo) => Vo.id), hidden: ((Ko = iL(Ie)) == null ? void 0 : Ko.id) ?? null, cover: Ie.cover } : null), yo = Ct), Ue !== E && (g.setGiftStop(Ue), E = Ue);
    const Gt = !se && (f == null ? void 0 : f.reason) === "arriving";
    Gt !== V && ((Oe = g.setGiftWait) == null || Oe.call(g, Gt), V = Gt);
    const Jn = !!Ie && (!!j || !!((It = l.albumLock) != null && It.locked));
    Jn !== H && ((Nt = g.setGiftLock) == null || Nt.call(g, Jn), H = Jn), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((On = g.forgetWallets) == null || On.call(g));
  };
  let te = !1;
  const Te = /* @__PURE__ */ new Map(), ke = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = Te.get(l.listening);
    return g === void 0 && (g = Date.now(), Te.set(l.listening, g)), Date.now() - g < Dl ? g : null;
  }, Re = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && Te.has(l.listening), xt = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", Qe = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > an ? Number((l - an) / p) : 0;
  }, dt = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), kt = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, Ye = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, C = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, Ee = (l, p, g = "") => {
    const f = C("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, wt = (l, p) => {
    const g = C("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  }, St = 6, Wr = 20;
  let or = !1, ft = !1;
  const on = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "just now" : p < 60 ? `${p} min ago` : p < 1440 ? `${Math.round(p / 60)} h ago` : `${Math.round(p / 1440)} ${Math.round(p / 1440) === 1 ? "day" : "days"} ago`;
  };
  Rl(() => {
    ft && pe(c.snapshot());
  });
  let Cs = null, sr = location.hash === "#give";
  sr && history.replaceState(null, "", location.pathname + location.search);
  let wo = !1;
  const Tr = VI((l) => KI({ address: l, network: "mainnet" }), () => pe(c.snapshot())), Mn = (l) => Tr.get(l), fn = cC(navigator.userAgent), Ts = (l, p) => {
    const g = navigator.userAgent, f = uC(g), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, se = [C("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${T.on ? "player" : "listening wallet"}${p ? T.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], ve = C("div", "", "ppp-open-row"), ge = lC(j, g);
    if (ge) {
      const Ze = C("a", `Open in ${f}`, "primary ppp-open-in");
      Ze.href = ge, Ze.dataset.homeAction = "radio:open-in-browser", ve.append(Ze);
    }
    return ve.append(pr("copy-page-link", "Copy link", () => j, ge ? "" : "primary", () => pe(c.snapshot()))), se.push(ve, C("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), se;
  }, lt = (l) => Mn(l) ?? xt(l), Bs = (l) => l.slice(0, 2).map(lt).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), mo = /* @__PURE__ */ new Map();
  let Ms = !1;
  const Oo = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), bo = () => {
    Ms || (Ms = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && mo.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      pe(c.snapshot());
    }).catch(() => {
      Ms = !1;
    }));
  }, Nn = (l, p) => {
    const g = mo.get(l), f = zg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((se) => !Oo(se)) || ""), j = jg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, Ho = (l) => {
    const { title: p, artist: g } = Nn(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, Ns = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Ea = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function _s(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function kn(l, p, g = "", f) {
    const j = C("dt", l), se = C("dd", p, g);
    return f && se.append(" ", f), [j, se];
  }
  const $n = document.getElementById("ppp-top"), xo = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Br = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Do = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Br();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Fe();
      return;
    }
    xo();
  };
  $n && ($n.onclick = Do);
  const Fo = (l, p, g, f = "") => l.standIn && !l.mainConnected ? Ee(`Connect ${lt(l.standIn)} to add STX`, Br, f) : Ee(p, g, f), jo = (l) => {
    c.useLinked(l).then(() => xo());
  };
  let Zr = null;
  const So = () => {
    const l = ly(c.snapshot(), lt);
    return l.length ? Zr || (Zr = new Promise((p) => {
      var ht;
      const g = C("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (Ve) => {
        f = Ve, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), Zr = null, p(f);
      }), g.addEventListener("click", (Ve) => {
        Ve.target === g && j(null);
      });
      const se = (Ve, Ue, Ie, Ct, Gt = !1) => {
        const Jn = C("button", "", "ppp-connect__opt " + Ie);
        return Jn.type = "button", Jn.disabled = Gt, Jn.onclick = Ct, Jn.append(C("b", Ve), C("span", Ue)), Jn;
      }, ve = C("h2", "Connect to Xtrata Music", "ppp-connect__title");
      ve.id = "ppp-connect-title";
      const ge = l.map((Ve) => se(Ve.label, Ve.detail, "is-music", () => {
        if (j("music"), Ve.action === "linked" && Ve.main) {
          jo(Ve.main);
          return;
        }
        const Ue = ly(c.snapshot(), lt).find((Ie) => Ie.action !== "linked");
        (Ue == null ? void 0 : Ue.action) === "create" ? c.create() : (Ue == null ? void 0 : Ue.action) === "unlock" && c.unlock(), xo();
      }, !!Ve.disabled)), Ze = se("Xverse or Leather", "If you already use one.", "is-stacks", () => j("stacks")), _t = Ee("Cancel", () => j(null), "quiet ppp-connect__cancel");
      g.append(ve, ...ge, Ze, _t), document.body.appendChild(g), g.showModal(), (ht = ge.find((Ve) => !Ve.disabled)) == null || ht.focus();
    }), Zr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = So;
  function ka(l) {
    if (!$n) return;
    const p = (f, j, se) => {
      $n.hidden = !1, $n.className = "ppp-top" + (j ? " is-" + j : ""), $n.replaceChildren(C("span", "", "dot"), document.createTextNode(f)), $n.title = se;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        $n.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        $n.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${lt(l.linked)}`, "warn", `This device's listening wallet belongs to ${lt(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const _n = document.getElementById("pppNudge"), vr = document.getElementById("onair");
  (Xh = _n == null ? void 0 : _n.querySelector("button")) == null || Xh.addEventListener("click", () => Do());
  const Mr = {
    connect: "Connect your player to hear whole songs",
    intro: "Set up your player to hear whole songs",
    locked: "Unlock your player to hear whole songs",
    "wrong-wallet": "Switch wallets to hear whole songs",
    link: "Finish setup to hear whole songs",
    fund: "Previews only: no plays left",
    over: "Return the excess to hear whole songs",
    ready: "Music support is paused"
  }, Zt = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, ir = document.getElementById("claimCard");
  let Ps = !1, Nr = 0, Us = 0;
  function ki(l) {
    if (!ir) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !Ps && (Ps = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (Nr = f.free, Us = f.total, ki(c.snapshot()));
    }).catch(() => {
    })), ir.hidden = !(p && Nr > 0);
    const g = ir.querySelector(".claim-n");
    g && Nr > 0 && (g.textContent = `${Nr.toLocaleString()} of ${Us.toLocaleString()} left`);
  }
  const Jr = document.getElementById("youStatus");
  function vo(l) {
    if (!Jr || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    Jr.dataset.on = g ? "1" : "0";
    const j = Jr.querySelector("b"), se = Jr.querySelector(".you-status__t > span");
    !j || !se || (j.textContent = g ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", se.textContent = g ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function $i(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, se = g || f || j ? "" : Mr[l.step] ?? "", ve = g ? "on" : j ? "free" : se ? "off" : "";
    ve ? document.documentElement.dataset.ppp = ve : delete document.documentElement.dataset.ppp, vr && (vr.hidden = !ve || ve === "free", vr.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), _n && (_n.hidden = ve !== "off" && ve !== "free", _n.classList.toggle("is-free", ve === "free"), ve === "free" ? (_n.querySelector(".nudge-t").textContent = "You’re on the free player", _n.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", _n.querySelector("button").textContent = "Get a player") : ve === "off" && (_n.querySelector(".nudge-t").textContent = se, _n.querySelector(".nudge-s").textContent = B(l) && l.step === "intro" ? mC : "Until then you hear the first 30 seconds of each song.", _n.querySelector("button").textContent = Zt[l.step] ?? "Start"));
  }
  let Gn = "";
  function Os(l) {
    const p = C("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(C("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(C("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = C("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = Gn, g.oninput = () => {
      Gn = g.value;
    };
    const f = Ee(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), Gn = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", Ee("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const Ii = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Hs() {
    const l = C("p", Ii + " ", "ppp-mute");
    return l.append(wt("Xverse", "https://www.xverse.app/download"), " · ", wt("Leather", "https://leather.io/install-extension")), l;
  }
  let Ro = "";
  const b = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? xt(l.listening) : "new" : "", f = pI() ? "1" : "", j = l.standIn && !l.mainConnected ? lt(l.standIn) : "";
    `${g}|${f}|${j}` !== Ro && (Ro = `${g}|${f}|${j}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => pe(c.snapshot()), l);
  function k(l, p = "") {
    const g = C("div", "", "ppp-topup"), f = G(l);
    g.append(C("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of ul) {
      const se = Ee(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      se.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, g.append(se);
    }
    return f !== void 0 && f < ul[0] && g.append(C("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const G = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - an - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function ne(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (te = !1), p.low && !te) return [];
    const g = C("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = C("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(wt("View", Ye(p.txid))), g.append(j), [g];
    }
    g.append(C("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(C("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(C("p", p.address, "ppp-addr-full"));
    const f = C("div", "", "ppp-open-row");
    if (f.append(pr("copy-likes-address", "Copy address", () => p.address, "primary", () => pe(c.snapshot()))), p.main && !l.solo) {
      const j = Bo - (p.balance ?? 0n);
      j > 0n && f.append(Fo(l, `Pay ${Dr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(C("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Be = (l) => {
    const p = C("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = C("p", "", "ppp-wait-t"), f = C("div", "", "ppp-wait-track");
    return f.append(C("div", "", "ppp-wait-fill")), p.append(g, f), Y(p), p;
  };
  function Y(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), se = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const ve = Math.ceil((g - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", se.textContent = `Loading your plays · ${ve}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      j.style.width = "", se.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let $e = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      $e = 0;
      return;
    }
    l.forEach(Y), ++$e % 10 === 0 && pe(c.snapshot());
  }, 1e3);
  let xe = null;
  function Me(l) {
    if (l.step === "loading" && xe !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== xe && (xe = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function pe(l) {
    var ep, tp, np, rp, op, sp, ip, ap, cp, lp, up, dp, fp, hp, pp, gp, yp, wp;
    if (m.sync(), dn && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = dn;
      dn = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), g = ke(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: Dl } } : l, j = f.error === Fl;
    if (Ht(), Sr(l), ue(l), Mt = un(l), J(l, f), Me(f), b(f), !p && v.inProgress(l)) return;
    if (ka(f), $i(f), ki(f), vo(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? T.on ? bC : "Checking your listening wallet…" : T.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      De(f, !1);
      return;
    }
    const [se, ve] = _s(f), ge = s(".ppp-state");
    ge.textContent = se, ge.className = "ppp-state" + (ve ? " ppp-state--" + ve : ""), ge.hidden = !se;
    const Ze = !!f.busy || f.armed, _t = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ze || !["intro", "loading"].includes(f.step));
    o.hidden = !_t, o.classList.toggle("ppp-frame--rest", !Ze && !wo);
    const ht = s(".ppp-frame-label");
    ht.hidden = !0;
    const Ve = uI(f) ?? Cs;
    Cs = Ve;
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
    const Ct = Ie || f.slot > 0 && ((((ep = f.likeFunds) == null ? void 0 : ep.balance) ?? 0n) > 0n || P.count() > 1), Gt = B(f), Jn = !Gt && fI({ ...f, heard: Ct }, Ve);
    s(".ppp-badge").hidden = !Jn;
    const Go = s(".ppp-steps"), Ao = s(".ppp-stage");
    Go.hidden = Ao.hidden = !Jn, Ve && Jn && (Go.replaceChildren(...vf(f.solo).map((Z, de) => {
      const ze = C("li", "", de < Ve.at ? "done" : de === Ve.at ? Ve.blocked ? "now blocked" : "now" : "");
      return ze.append(C("span", de < Ve.at ? "✓" : String(de + 1), "n"), Z), de === Ve.at && ze.setAttribute("aria-current", "step"), ze;
    })), Ao.textContent = Ve.caption, Ao.className = "ppp-stage " + (Ve.at >= vf(f.solo).length ? "ppp-ok" : Ve.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ti = s(".ppp-facts"), Qn = [];
    f.main && ((tp = f.gate) != null && tp.here) && !f.solo && Qn.push(...kn("Your wallet", lt(f.main), "ppp-addr-short"));
    const La = () => {
      if (!f.listening) return;
      const Z = pr("copy-listening", "Copy", () => f.listening || "", "tiny", () => pe(c.snapshot()));
      Qn.push(...kn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", xt(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || La(), f.listening && f.step !== "intro")
      if (f.linked)
        Qn.push(...kn("Credited to", `${lt(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), La();
      else if (f.solo) {
        f.creditedTo && Qn.push(...kn("Credited to", `${lt(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${lt(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Qn.push(...kn("Returns go to", f.gift ? Z : f.returnTo && !Mn(f.returnTo) ? Z.replace(xt(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Qn.push(...kn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((np = f.gate) != null && np.here)) {
      const Z = f.linkedListening.map((de) => xt(de) + (de === f.listening ? " (this one)" : "")).join(", ");
      Qn.push(...kn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Qn.push(...kn("Balance", `${Dr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const Ko = f.entries.find((Z) => Z.kind === "play");
    Ko && bo(), Ko && Qn.push(...kn("Last paid song", `${Ho(Ko)} → ${lt(Ko.recipient)}`, Ns[Ko.status] || "")), Ti.replaceChildren(...Qn), Ti.hidden = !Qn.length;
    const Oe = [], It = [], Nt = [], On = [], Vo = jn(BigInt(((rp = f.gate) == null ? void 0 : rp.limits.playFee) ?? "300")), Yh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Dr(Ol)} STX to the song holder, plus a ${Dr(Vo - Ol)} STX network fee.`, qh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Oe.push(C("p", "Pay artists as you listen.")), (op = f.gate) != null && op.radioUrl) {
          const de = C("p");
          de.append(wt("Open the pay-per-play radio →", f.gate.radioUrl)), Oe.push(de);
        }
        It.push(C("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const de = [f.linked, ...f.others];
          Oe.push(C("p", de.length > 1 ? `This device has listening wallets for ${Bs(de)}.` : `This device has a listening wallet for ${lt(f.linked)}.`)), It.push(C("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), de.slice(0, 3).forEach((ze, vt) => Nt.push(Ee(`Open ${lt(ze)}`, () => jo(ze), vt === 0 ? "primary" : "")));
        } else
          Oe.push(C("p", "Connect your wallet to pay artists as you listen.")), It.push(C("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Oe.push(C("p", `This device's listening wallet belongs to ${lt(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), It.push(C("p", `You are connected as ${lt(f.main)}. Switch to the linked wallet to continue listening.`)), It.push(C("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Nt.push(Ee("Switch wallet", Br, "primary"));
        break;
      case "not-invited":
        Oe.push(C("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Oe.push(C("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Oe.push(C("p", "Every play counts for the song’s owner, on-chain.")), It.push(C("p", Yh)), It.push(C("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), It.push(C("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Oe.push(C("p", `This device already has a listening wallet for ${Bs(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), It.push(C("p", `Otherwise, set up a new listening wallet for ${lt(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && It.push(C("p", `This is the listening wallet for ${lt(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && It.push(C("p", "Already have a Stacks wallet? Connect it first (the Connect button at the bottom of this page) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Nt.push(Ee(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${lt(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Nt.push(Ee("Switch wallet", Br)), !Z && f.solo && Nt.push(Ee("I have a Stacks wallet", Br)), Nt.push(Ee("I already have a listening wallet", () => void c.unlock(!0))), Z && Nt.push(Ee("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Oe.push(C("p", "Locked.", "ppp-mute")), Nt.push(Ee("Unlock", () => void c.unlock(), "primary"))), f.standIn ? On.push(Ee("Use a different listening wallet", () => void So().then((de) => {
          de === "stacks" && Br();
        }), "quiet")) : On.push(Ee("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Oe.push(C("p", `Link to ${lt(f.main)} · free`)), It.push(C("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), It.push(C("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Nt.push(Ee(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Oe.push(C("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Oe.push(Be(f.arrival)) : Re(f) ? Oe.push(C("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (sp = f.gift) != null && sp.player ? Oe.push(C("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Oe.push(C("p", "No plays left · add plays to keep counting", "ppp-bad")) : Oe.push(C("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Vo)).toLocaleString()} plays`)), f.entries.length && It.push(C("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && It.push(C("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? It.push(C("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? It.push(C("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (It.push(C("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), It.push(C("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Nt.push(pr("copy-address", "Copy my address", () => f.listening || "", "primary", () => pe(c.snapshot())))) : It.push(C("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const de = C("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          de.append(wt("View", Ye(f.depositTxid))), Oe.push(de);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Nt.push(Fo(f, `Deposit ${Dr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Oe.push(C("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Oe.push(C("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Nt.push(Ee("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (Oe.push(C("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Oe.push(Os(f))), (!f.solo || f.returnTo) && Nt.push(Ee("Return excess", () => void c.returnFunds("excess"), "primary"), Ee("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((ip = f.giftStop) == null ? void 0 : ip.reason) !== "off") {
          const de = Math.min(f.session.playsLeft, f.playsLeft);
          Oe.push(C("p", `${de.toLocaleString()} plays left`, "ppp-ok")), It.push(C("p", Yh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Nt.push(Ee("Switch off", () => void c.switchOff()));
        } else
          Oe.push(C("p", "Switch on music support to listen.", "ppp-mute")), Nt.push(Ee("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && Oe.push(C("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Oe.push(C("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Oe.push(C("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Oe.push(C("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Nt.push(Fo(f, `Top up ${Dr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", de = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Nt.unshift(Ee("Add plays", () => Fe(), "primary")) : de ? Nt.push(Ee("Add plays", () => Fe(), "primary")) : f.step === "ready" && On.push(Ee("Add plays", () => Fe(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && It.push(C("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && It.push(Os(f)), It.push(Hs()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = C("p", "New to Stacks? ", "ppp-mute");
      Z.append(wt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Oe.push(Z);
    }
    if (f.walletOutdated && It.push(C("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Oe.push(C("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Nt.push(Ee("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && On.push(Ee(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${lt(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((ap = f.gift) != null && ap.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && On.push(k(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && On.push(Ee(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && On.push(Ee("Lock", () => void c.lock(), "quiet")), _t && !Ze && On.push(Ee(wo ? "Hide listening wallet box" : "Show listening wallet box", () => {
      wo = !wo, pe(c.snapshot());
    }, "quiet")), [...Nt, ...On].forEach((Z) => Z.disabled = qh), qh && (Nt.length = 0), !Gt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((cp = f.gift) != null && cp.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", de = Oe.at(0);
      f.step === "ready" && de ? de.append(C("span", ` · ${dt(f.balance)} STX`, Z)) : Oe.push(C("p", `Balance ${dt(f.balance)} STX`, Z));
    }
    if (Gt) {
      for (const ze of [...Nt, ...On]) {
        const vt = pC[ze.textContent ?? ""];
        vt && (ze.textContent = vt);
      }
      for (let ze = Oe.length - 1; ze >= 0; ze--) dy(Oe[ze].textContent) && It.unshift(...Oe.splice(ze, 1));
      for (let ze = Nt.length - 1; ze >= 0; ze--) dy(Nt[ze].textContent) && On.unshift(...Nt.splice(ze, 1));
      const Z = f.entries.some((ze) => ze.kind === "play"), de = wC(f.step, { played: Z, arriving: f.depositPending });
      de.length && Oe.length && de.shift(), Oe.push(...de.map((ze) => C("p", ze, "ppp-mute")));
    }
    if ((lp = f.gift) != null && lp.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = C("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const de = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? C("span", " · plays on their way", "ppp-warn") : C("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      de && Z.append(de);
      const ze = (up = Oe.at(0)) == null ? void 0 : up.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && ze && /STX/.test(ze.textContent ?? "") && ze.remove(), Oe.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Oe.splice(1, 0, C("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), k(f, "primary"));
        else {
          const vt = C("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          vt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), vt.append(wt("Xverse", "https://www.xverse.app/download"), " and ", wt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Oe.splice(1, 0, vt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, de = C("div", "", "ppp-pick");
      de.append(C("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ze = C("ul", "", "ppp-gift-list");
      Z.steps.forEach((vt, Pr) => {
        const ar = vt.kind === "gift" ? "the unused gift" : vt.kind === "deposit" ? "what was added to it" : "the rest", In = C("li");
        In.append(C("span", `${Pr + 1}. ${Dr(BigInt(vt.send))} STX · ${ar}`, "t"), C("span", vt.to ? ` → ${lt(vt.to)}` : " → choose an address below", vt.to ? "ppp-mute" : "ppp-warn")), ze.append(In);
      }), de.append(ze), Z.kept && de.append(C("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((vt) => !vt.to) && de.append(Os(f)), de.append(Ee(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Oe.push(de);
    }
    const Xo = N(f), Eo = X ? Xo : null, Bi = le(f, !!Eo), s1 = Bi === "gift" || Bi === "arriving" || Bi === "new", Au = Eo ? null : w.lines(l), Eu = Au && !w.claiming() ? Au : [...Au ?? [], ...v.banner(l, { bare: !!Eo || Bi === "gift" || Bi === "arriving" })], mc = fn && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Ts(fn, v.pendingCode()) : [];
    Eo || (Oe.unshift(...Eu), Oe.push(...ne(f)), Oe.unshift(...mc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Oe.unshift(C("p", `This is ${lt(f.creditedTo)}'s listening wallet. Plays and likes count for ${lt(f.creditedTo)}. Connect its Stacks wallet (the button at the bottom of this page) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Oe);
    const ku = document.querySelector(".ppp-switch");
    if (ku) {
      const Z = P.latest(), de = f.slot > 0, ze = ["fund", "ready", "over"].includes(f.step) && (de || !!Z);
      if (ku.hidden = !ze, ze) {
        const vt = (In, bc, xc, Bu) => {
          const Pi = Ee("", Bu, "ppp-tab");
          return Pi.setAttribute("aria-pressed", String(xc)), Pi.append(C("span", In, "tt"), C("span", bc === void 0 ? "…" : `${Qe(bc).toLocaleString()} plays`, "ts")), Pi.disabled = !!f.busy, Pi;
        }, Pr = de ? ((fp = (dp = f.gift) == null ? void 0 : dp.player) == null ? void 0 : fp.title) ?? "Album" : Z.title, ar = Ee("View all albums" + (P.count() > 1 ? ` (${P.count()})` : ""), () => {
          if (x()) {
            window.dispatchEvent(new CustomEvent("xtrata:radio-browse", { detail: { tab: "albums" } }));
            return;
          }
          const In = document.querySelector(".ppp-shelf");
          In && (In.hidden = !1, In.open = !In.open, ar.setAttribute("aria-expanded", String(In.open)), In.open && requestAnimationFrame(() => In.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ar.setAttribute("aria-expanded", String(!!((hp = document.querySelector(".ppp-shelf")) != null && hp.open))), ku.replaceChildren(
          vt("🎧 My player", de ? (pp = f.likeFunds) == null ? void 0 : pp.balance : f.balance, !de, () => {
            de && c.openAlbum(0);
          }),
          vt("💿 " + Pr, de ? f.balance : void 0, de, () => {
            !de && Z && c.openAlbum(Z.slot);
          }),
          ar
        );
      }
    }
    const Yo = P.render(f), Mi = document.querySelector(".ppp-shelf"), Ni = x() ? document.getElementById("shelfBox") : null;
    if (Ni)
      P.count() > 6 ? Ni.dataset.many = "1" : delete Ni.dataset.many, Yo ? Ni.firstChild !== Yo && Ni.replaceChildren(Yo) : Ni.replaceChildren(), Mi && (Mi.hidden = !0), U(!!Yo);
    else if (Mi) {
      Mi.hidden = !Yo;
      const Z = Mi.querySelector("summary");
      Z && (Z.textContent = P.count() > 0 ? `♪ My albums (${P.count()})` : "♪ My albums");
      const de = Mi.querySelector(".ppp-shelf-body");
      Yo && de && !de.contains(Yo) && de.replaceChildren(Yo);
    }
    const Ca = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !Ca, Ca && !s(".ppp-gift-body").contains(Ca) && s(".ppp-gift-body").replaceChildren(Ca), Ca && sr) {
      sr = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const $u = document.querySelector("#ppp .ppp-featured");
    if ($u) {
      const Z = L(), de = m.manage(), ze = (Z.length > 0 || !!de) && f.slot === 0 && !((gp = f.gift) != null && gp.player) && f.step === "ready";
      $u.hidden = !ze, ze && $u.replaceChildren(...Z.length ? [C("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((vt) => {
        const Pr = (zn == null ? void 0 : zn.id) === vt.id, ar = Ee("", () => jt(Pr ? null : vt, !Pr), "ppp-featured__a" + (Pr ? " is-on" : "")), In = Kr(vt).length;
        return ar.append(C("b", vt.title), C("span", Pr ? "Playing now · tap to go back to the radio" : `${vt.subtitle ? vt.subtitle + " · " : ""}${In} ${In === 1 ? "song" : "songs"}`)), ar.setAttribute("aria-pressed", String(Pr)), ar.disabled = !!f.busy, ar;
      }), ...de ? [de] : []);
    }
    const Iu = document.querySelector("#ppp .ppp-release-in-slot");
    if (Iu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : m.banner();
      Iu.hidden = !Z.length, Iu.replaceChildren(...Z);
    }
    const _i = document.querySelector("#ppp .ppp-release");
    if (_i) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : m.fold();
      if (_i.hidden = !Z, Z) {
        const de = document.activeElement instanceof HTMLElement && _i.contains(document.activeElement) ? document.activeElement : null, ze = ((yp = _i.querySelector(".ppp-release-songs")) == null ? void 0 : yp.scrollTop) ?? 0;
        (wp = _i.querySelector(".ppp-release-body")) == null || wp.replaceChildren(...Z);
        const vt = _i.querySelector(".ppp-release-songs");
        vt && ze && (vt.scrollTop = ze), de && de.isConnected && document.activeElement !== de && de.focus({ preventScroll: !0 });
      }
    }
    _r(f);
    const Lu = document.querySelector("#ppp .ppp-yours");
    if (Lu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Lu.hidden = !Z;
      const de = Lu.querySelector(".ppp-yours-body");
      if (Z && de && de.getAttribute("data-for") !== f.listening) {
        de.setAttribute("data-for", f.listening);
        const ze = (Bu, ...Pi) => {
          const mp = C("details", "", "ppp-yours-item");
          return mp.append(C("summary", Bu), ...Pi), mp;
        }, vt = C("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        vt.append(C("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Pr = C("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ar = C("p");
        ar.append(wt("Find a name at BNS One →", "https://bns.one"));
        const In = C("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (the button at the bottom of this page) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), bc = C("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), xc = C("p");
        xc.append(wt("See the giveaway →", "https://xtrata.xyz/giveaway")), de.replaceChildren(
          ze("Give your player a name", vt, Pr, C("p", f.listening, "ppp-addr-full"), pr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => pe(c.snapshot())), ar),
          ze("Link it to a wallet you already have", In),
          ze("Bring a friend in", bc, xc)
        );
      }
    }
    s(".ppp-body").replaceChildren(...It), s(".ppp-actions").replaceChildren(...Nt), s(".ppp-actions2").replaceChildren(...On);
    const Cu = f.busy || f.message || "", Wh = s(".ppp-msg"), Tu = Cu && Oe.some((Z) => (Z.textContent ?? "").startsWith(Cu.replace(/[.✓\s]+$/, ""))) ? "" : Cu, Zh = !Tu && !f.error ? f.notice : j && !Tu ? f.error : "";
    Wh.textContent = Tu || Zh, Wh.classList.toggle("is-warn", !!Zh), s(".ppp-err").textContent = j ? "" : f.error;
    const i1 = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...i1.slice(0, 5).map((Z) => {
      const de = C("li"), ze = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return de.append(C("span", "", "d " + ze), C("span", Ho(Z), "t"), C("span", kt(Z.created), "ppp-mute")), Z.txid && de.append(wt("tx", Ye(Z.txid))), de;
    })), Pn(f), s(".ppp-wallets").hidden = !(Ti.childElementCount || On.length), s(".ppp-more").hidden = !It.length;
    const Jh = s(".ppp-history");
    Jh.hidden = !f.entries.length, f.entries.length && bo(), Jh.replaceChildren(C("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const de = C("div", "", "ppp-row"), ze = Z.kind === "play" ? [C("span", Ho(Z), "ppp-song"), C("span", ` · ${Dr(BigInt(Z.amount))} STX to ${lt(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [C("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${Ho(Z)}`, "ppp-song"), C("span", ` · for ${f.linked ? lt(f.linked) : "this listening wallet"}`, "ppp-mute")] : [C("span", `Returned ${Dr(BigInt(Z.amount))} STX`, "ppp-song"), C("span", ` to ${lt(Z.recipient)}`, "ppp-mute")];
      return de.append(
        C("span", Ea[Z.status] || Z.status, "ppp-status " + (Ns[Z.status] || "")),
        ...ze,
        C("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && de.append(wt("tx ↗", Ye(Z.txid))), de;
    })), q == null || q.render(Eo ? Li(f, Eo, [...mc, ...Eu]) : null), De(f, !!Eo, s1 ? [...mc, ...Eu] : mc, Bi), Jt(f, !!Eo || !!(Bt != null && Bt.showing())), Un(f, Eo), Et.isOpen() && Et.refresh(), Ds();
    const Qh = (Xo == null ? void 0 : Xo.mode) === "open" ? null : wn(f);
    qe == null || qe.render((Xo == null ? void 0 : Xo.mode) === "open" ? Li(f, Xo, []) : Qh ? { ...Li(f, { mode: "open", player: Qh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function x() {
    const l = document.documentElement;
    return l.hasAttribute("data-skin") && !l.hasAttribute("data-view") && !!document.getElementById("shelfBox");
  }
  function N(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && gn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = We();
    return g && (l.step === "locked" || dn && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const K = (l, p, g, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...j ? { b: j } : {}, p: String(f), s: py(Mg, p, g) })}`;
  function Se(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? F ? "making" : null : p.state === "claimed" ? F && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || we || l.step === "link" && W !== "have" ? null : W === "making" || W === "yours" ? "ready" : W;
  }
  function Jt(l, p) {
    if (!_) return;
    const g = l.award, f = g != null && g.cls && Zc(g.cls) ? qs(g.cls) : null, j = l.slot === 0 ? l.listening : l.root, se = p || !g || !f || !j || g.number === void 0 ? null : Se(l);
    if (!se || !g || !f || !j) {
      _.render(null, p);
      return;
    }
    se === "have" && l.linked && !ce && (ce = !0, c.awardRefresh());
    const ve = typeof g.name == "string" && g.name ? g.name : null, ge = [];
    l.error && ge.push(C("p", l.error, "ppp-warn"));
    const Ze = (_t) => {
      W = _t, _t === "name" && (F = !0), pe(c.snapshot());
    };
    _.render({
      screen: se,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: j,
      name: g.name,
      inscription: g.inscription,
      art: se === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : K(f, g.number, j, g.need ?? 0, ve),
      claimLink: g.claimTx ? Ye(g.claimTx) : void 0,
      status: ge,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? lt(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => pr("award-player-address", "Copy my player’s address", () => j, "tiny", () => pe(c.snapshot())),
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
        we = !0;
        try {
          localStorage.setItem(M, String(Date.now()));
        } catch {
        }
        pe(c.snapshot());
      },
      done: () => {
        F = !1, W = "ready", pe(c.snapshot());
      }
    }, p);
  }
  function Pn(l) {
    const p = document.querySelector("#ppp .ppp-paid");
    if (!p) return;
    const g = document.documentElement, f = l.entries.filter((ge) => ge.kind === "play" && !["failed", "cancelled"].includes(ge.status)), j = g.hasAttribute("data-skin") && !g.hasAttribute("data-view") && f.length > 0;
    if (ft = j, p.hidden = !j, !j) {
      p.replaceChildren();
      return;
    }
    bo();
    const se = C("ol");
    for (const ge of f.slice(0, or ? Wr : St)) {
      const { title: Ze, artist: _t } = Nn(ge.song, ge), ht = Ze || `Song #${ge.song}`, Ve = C("li", "", "ppp-paid__row"), Ue = C("span", "", "ppp-paid__art"), Ie = Gl(String(ge.song));
      if (Ie) {
        const Gt = document.createElement("img");
        Gt.src = Ie, Gt.alt = "", Gt.decoding = "async", Ue.append(Gt);
      } else
        Ue.textContent = "♪", Ue.setAttribute("aria-hidden", "true");
      const Ct = C("span", "", "ppp-paid__t");
      if (Ct.append(C("b", ht), C("span", [_t, on(ge.created)].filter(Boolean).join(" · "))), Ve.append(Ue, Ct), ge.status === "confirmed" && ge.txid) {
        const Gt = wt("Receipt", Ye(ge.txid));
        Gt.className = "ppp-paid__r", Gt.setAttribute("aria-label", `Receipt for ${ht}`), Ve.append(Gt);
      } else Ve.append(C("span", ge.status === "unknown" ? "Checking…" : "Paying…", "ppp-paid__r ppp-mute"));
      se.append(Ve);
    }
    const ve = [C("h4", "Who you have paid"), se];
    if (f.length > St) {
      const ge = Ee(or ? "Show fewer" : `Show more (${Math.min(f.length, Wr) - St})`, () => {
        or = !or, pe(c.snapshot());
      }, "ppp-paid__more");
      ve.push(ge);
    }
    ve.push(C("p", "Every play pays the artist, and anyone can check it.", "ppp-paid__note")), p.replaceChildren(...ve);
  }
  function _r(l) {
    var Ve;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, j = g != null && g.cls && Zc(g.cls) ? qs(g.cls) : null, se = !!g && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !se, !se || !g || !j || !f) {
      p.replaceChildren();
      return;
    }
    const ve = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === ve) return;
    p.setAttribute("data-sig", ve);
    const ge = (Ue) => {
      const Ie = C("p", "", "ppp-award__h");
      return Ie.append(C("b", `${j.mark} Music Hero award`), C("span", Ue)), Ie;
    }, Ze = `No. ${String(g.number ?? 0).padStart(4, "0")}`, _t = (Ue) => {
      const Ie = C("div", "", "ppp-award__art"), Ct = document.createElement("iframe");
      return Ct.src = Ue, Ct.title = `${j.name} record`, Ct.setAttribute("sandbox", "allow-scripts"), Ct.setAttribute("loading", "lazy"), Ie.append(Ct), Ie;
    }, ht = [];
    if (g.state === "claimed") {
      if (ht.push(ge(`${j.name} record · ${Ze}`)), g.inscription !== void 0 && ht.push(_t(`/i/${g.inscription}`)), ht.push(C("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${j.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Ue = C("p");
        Ue.append(wt("Open it full screen ↗", `/i/${g.inscription}`)), ht.push(Ue);
      }
      if (g.sendTx) {
        const Ue = C("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Ue.append(wt("View", Ye(g.sendTx))), ht.push(Ue);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Ue = C("details", "", "ppp-award__send"), Ie = document.createElement("input");
        Ie.type = "text", Ie.placeholder = "SP… address to send it to", Ie.autocomplete = "off", Ie.spellcheck = !1, Ie.setAttribute("aria-label", "Address to send your record to");
        const Ct = Ee("Send my record…", () => void c.sendAward(Ie.value), "");
        Ct.disabled = !!l.busy, Ue.append(
          C("summary", "Send this record to someone"),
          C("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          Ie,
          Ct
        ), ht.push(Ue);
      }
    } else if (g.claimTx) {
      ht.push(ge(`${j.name} record · ${Ze}`));
      const Ue = C("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Ue.append(wt("View", Ye(g.claimTx))), ht.push(Ue);
    } else if (g.state === "ready") {
      ht.push(ge(`${j.name} record · ${Ze}`));
      const Ue = typeof g.name == "string" && g.name ? g.name : null, Ie = new URLSearchParams({ n: String(g.number), a: f, ...Ue ? { b: Ue } : {}, p: String(g.need), s: py(Mg, g.number, f) });
      ht.push(_t(`/awards/${j.id}#${Ie}`)), ht.push(C("p", `Your ${j.name} record is ready. You have paid artists for ${(Ve = g.need) == null ? void 0 : Ve.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Ct = C("div", "", "ppp-award__row");
      Ue ? (ht.push(C("p", `Its plaque will carry ${Ue} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Ct.append(Ee("Claim my record", () => {
        F = !0, c.claimAward("auto");
      }, "primary"), Ee("Use my address only", () => {
        F = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (ht.push(C("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Ct.append(Ee("Claim my record", () => {
        F = !0, c.claimAward("none");
      }, "primary"), Ee("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ht.push(C("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Ct.append(Ee("Check for a name again", () => void c.awardRefresh(), "primary"), Ee("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Ct.querySelectorAll("button").forEach((Gt) => {
        Gt.disabled = !!l.busy;
      }), ht.push(Ct, C("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      ht.push(ge(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Ue = C("div", "", "ppp-award__bar"), Ie = document.createElement("i");
      Ie.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Ue.append(Ie);
      const Ct = g.need - g.have;
      ht.push(Ue, C("p", `${Ct.toLocaleString()} more ${Ct === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      ht.push(ge(`${j.name} record · ${Ze}`)), ht.push(C("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...ht);
  }
  function Un(l, p) {
    var ge;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (_ != null && _.showing()) && ((ge = l.award) != null && ge.cls) && Zc(l.award.cls) && (l.busy || l.armed)) {
      const Ze = qs(l.award.cls), _t = C("span", "", "ppp-skin__t");
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
    const ve = C("span", "", "ppp-skin__t");
    ve.append(C("b", p.player.title), C("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(se, ve);
  }
  function Li(l, p, g) {
    var Ze, _t, ht, Ve, Ue;
    const f = !!l.busy || l.armed, j = [...g];
    l.depositPending && l.arrival && j.push(Be(l.arrival)), l.error ? j.push(C("p", l.error, l.error === Fl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push(C("p", l.message, "ppp-cyan")) : l.notice && j.push(C("p", l.notice, "ppp-warn")), p.mode === "open" && te && ((Ze = l.likeFunds) != null && Ze.album) && l.likeFunds.low && !l.likeFunds.pending && j.push(C("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let se = "Kept on this device with Face ID or your passkey. No app or account needed.", ve = null, ge = null;
    if (p.mode === "locked")
      ve = { label: "Continue listening", run: () => {
        dn = We(), c.unlock();
      } }, ge = { label: "Use a different passkey", run: () => {
        dn = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && tl(ut) && ut.album === p.player.id) {
        const Ie = window.XtrataRadio, Ct = Kr(p.player)[0], Gt = ut.phase === "playing";
        ve = { label: Gt && !!((ht = (_t = Ie == null ? void 0 : Ie.getState) == null ? void 0 : _t.call(Ie)) != null && ht.playing) ? "Pause" : Gt ? "Carry on" : "Play the first song", run: () => {
          var Go, Ao;
          Gt ? (Go = Ie == null ? void 0 : Ie.playPause) == null || Go.call(Ie) : Ct && ((Ao = Ie == null ? void 0 : Ie.playToken) == null || Ao.call(Ie, Ct.id));
        } }, ge = { label: "Make my player and hear it all", run: () => void c.create() }, se = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const Ie = ut.phase === "done" && ut.album === p.player.id;
        Ie && !j.length && j.push(C("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), ve = { label: Ie ? "Keep listening" : "Open album", run: () => void c.create() }, ge = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (ve = { label: "Open album", run: () => void c.unlock() }, ge = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push(C("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push(C("p", "Opening your album…", "ppp-cyan"));
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
      primary: ve,
      secondary: ge,
      hint: ve ? se : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: G(l),
      topUps: ul,
      canMake: !!((Ue = (Ve = l.gate) == null ? void 0 : Ve.gifts) != null && Ue.admin)
    };
  }
  const Kn = document.getElementById("findBox"), $a = document.getElementById("findBody"), zo = Kn && $a ? PC($a, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => BC(l == null ? void 0 : l.tracks, (p, g) => ({ title: zg(p, Oo(g.title) ? "" : g.title), artist: jg(p, g.artist || "") }))),
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
    liked: (l) => Ci().has(l),
    grid: document.documentElement.hasAttribute("data-skin"),
    // the new look lists artist names three across
    // ...and draws them in their own section of Browse, under the listener's albums
    artistsMount: document.documentElement.hasAttribute("data-skin") && document.getElementById("artistBox") || void 0,
    leaveAlbum: () => S(0)
  }) : null;
  Kn == null || Kn.addEventListener("toggle", () => {
    Kn.open && (zo == null || zo.load());
  });
  let Ia = "";
  const Ci = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, Ds = () => {
    var p, g, f, j, se;
    if (!zo || !(Kn != null && Kn.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((se = (j = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : j.nowPlaying) == null ? void 0 : se.tokenId) ?? ""}|${[...Ci()].sort((ve, ge) => ve - ge).join(",")}`;
    l !== Ia && (Ia = l, zo.refresh());
  }, vu = /* @__PURE__ */ new Map();
  let Kh = !1;
  const Vh = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && vu.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), Ds(), yt) {
        const f = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Ne && (Ne = f, pe(c.snapshot()));
      }
      if (tl(ut)) {
        const f = !!(p != null && p.playing);
        Cr({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== Kh && (Kh = f, pe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Vh()) {
    const l = setInterval(() => {
      Vh() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (tl(ut) && Cr({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      bo();
      const g = Nn(p.song, vu.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const VC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", XC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, YC = () => XC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, qC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, WC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', o1 = class {
  constructor(e) {
    e$(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && xA(e), this.callback(iu(e));
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
    const e = YC(), t = qC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Je("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Je("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Je("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Je("div", { class: "flex flex-col space-y-[10px]" }, Je("div", { class: "flex items-center" }, Je("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Je("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Je("span", { class: "sr-only" }, "Close popup"), Je("img", { src: VC }))), r ? Je("p", null, "Select the wallet you want to connect to.") : Je("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Je("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Je("div", { class: "mt-6" }, Je("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Je("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Je("div", { class: "aspect-square basis-9 overflow-hidden" }, Je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Je("div", { class: "flex-1" }, Je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Je("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Je("div", { class: "mt-6" }, r ? Je("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Je("div", { class: "mb-5 flex justify-between" }, Je("p", { class: "text-sm font-medium" }, "Recommended wallets"), Je("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Je("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Je("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Je("p", null, "What is a wallet? ", Je("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Je("ul", { class: "space-y-3" }, n.map((o) => Je("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Je("div", { class: "aspect-square basis-9 overflow-hidden" }, Je("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Je("div", { class: "flex-1" }, Je("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Je("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Je("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return P4(this);
  }
};
o1.style = WC;
const ZC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: o1
}, Symbol.toStringTag, { value: "Module" }));
