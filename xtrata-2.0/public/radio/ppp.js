var ay = Object.defineProperty;
var cy = (t, e, n) => e in t ? ay(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Gs = (t, e, n) => cy(t, typeof e != "symbol" ? e + "" : e, n);
var ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function zh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Fo(t) {
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
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof ie < "u" && ie || {}, r = {
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
      function s(x) {
        return x && DataView.prototype.isPrototypeOf(x);
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
        ], o = ArrayBuffer.isView || function(x) {
          return x && i.indexOf(Object.prototype.toString.call(x)) > -1;
        };
      function a(x) {
        if (typeof x != "string" && (x = String(x)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(x) || x === "")
          throw new TypeError('Invalid character in header field name: "' + x + '"');
        return x.toLowerCase();
      }
      function c(x) {
        return typeof x != "string" && (x = String(x)), x;
      }
      function u(x) {
        var L = {
          next: function() {
            var H = x.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function h(x) {
        this.map = {}, x instanceof h ? x.forEach(function(L, H) {
          this.append(H, L);
        }, this) : Array.isArray(x) ? x.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(L) {
          this.append(L, x[L]);
        }, this);
      }
      h.prototype.append = function(x, L) {
        x = a(x), L = c(L);
        var H = this.map[x];
        this.map[x] = H ? H + ", " + L : L;
      }, h.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, h.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, h.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, h.prototype.set = function(x, L) {
        this.map[a(x)] = c(L);
      }, h.prototype.forEach = function(x, L) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && x.call(L, this.map[H], H, this);
      }, h.prototype.keys = function() {
        var x = [];
        return this.forEach(function(L, H) {
          x.push(H);
        }), u(x);
      }, h.prototype.values = function() {
        var x = [];
        return this.forEach(function(L) {
          x.push(L);
        }), u(x);
      }, h.prototype.entries = function() {
        var x = [];
        return this.forEach(function(L, H) {
          x.push([H, L]);
        }), u(x);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function(L, H) {
          x.onload = function() {
            L(x.result);
          }, x.onerror = function() {
            H(x.error);
          };
        });
      }
      function f(x) {
        var L = new FileReader(), H = g(L);
        return L.readAsArrayBuffer(x), H;
      }
      function y(x) {
        var L = new FileReader(), H = g(L), q = /charset=([A-Za-z0-9_-]+)/.exec(x.type), Y = q ? q[1] : "utf-8";
        return L.readAsText(x, Y), H;
      }
      function w(x) {
        for (var L = new Uint8Array(x), H = new Array(L.length), q = 0; q < L.length; q++)
          H[q] = String.fromCharCode(L[q]);
        return H.join("");
      }
      function v(x) {
        if (x.slice)
          return x.slice(0);
        var L = new Uint8Array(x.byteLength);
        return L.set(new Uint8Array(x)), L.buffer;
      }
      function T() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = v(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = v(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var x = l(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(f);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return y(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(A);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(x) {
        var L = x.toUpperCase();
        return _.indexOf(L) > -1 ? L : x;
      }
      function I(x, L) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var H = L.body;
        if (x instanceof I) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, L.headers || (this.headers = new h(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !H && x._bodyInit != null && (H = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new h(L.headers)), this.method = b(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var q = /([?&])_=[^&]*/;
          if (q.test(this.url))
            this.url = this.url.replace(q, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function A(x) {
        var L = new FormData();
        return x.trim().split("&").forEach(function(H) {
          if (H) {
            var q = H.split("="), Y = q.shift().replace(/\+/g, " "), z = q.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(Y), decodeURIComponent(z));
          }
        }), L;
      }
      function P(x) {
        var L = new h(), H = x.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(q) {
          return q.indexOf(`
`) === 0 ? q.substr(1, q.length) : q;
        }).forEach(function(q) {
          var Y = q.split(":"), z = Y.shift().trim();
          if (z) {
            var ee = Y.join(":").trim();
            try {
              L.append(z, ee);
            } catch (Vt) {
              console.warn("Response " + Vt.message);
            }
          }
        }), L;
      }
      T.call(I.prototype);
      function K(x, L) {
        if (!(this instanceof K))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new h(L.headers), this.url = L.url || "", this._initBody(x);
      }
      T.call(K.prototype), K.prototype.clone = function() {
        return new K(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, K.error = function() {
        var x = new K(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var O = [301, 302, 303, 307, 308];
      K.redirect = function(x, L) {
        if (O.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new K(null, { status: L, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(L, H) {
          this.message = L, this.name = H;
          var q = Error(L);
          this.stack = q.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function R(x, L) {
        return new Promise(function(H, q) {
          var Y = new I(x, L);
          if (Y.signal && Y.signal.aborted)
            return q(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function ee() {
            z.abort();
          }
          z.onload = function() {
            var S = {
              statusText: z.statusText,
              headers: P(z.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? S.status = 200 : S.status = z.status, S.url = "responseURL" in z ? z.responseURL : S.headers.get("X-Request-URL");
            var k = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              H(new K(k, S));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              q(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              q(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              q(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Vt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (z.open(Y.method, Vt(Y.url), !0), Y.credentials === "include" ? z.withCredentials = !0 : Y.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof h || n.Headers && L.headers instanceof n.Headers)) {
            var Zt = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(S) {
              Zt.push(a(S)), z.setRequestHeader(S, c(L.headers[S]));
            }), Y.headers.forEach(function(S, k) {
              Zt.indexOf(k) === -1 && z.setRequestHeader(k, S);
            });
          } else
            Y.headers.forEach(function(S, k) {
              z.setRequestHeader(k, S);
            });
          Y.signal && (Y.signal.addEventListener("abort", ee), z.onreadystatechange = function() {
            z.readyState === 4 && Y.signal.removeEventListener("abort", ee);
          }), z.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return R.polyfill = !0, n.fetch || (n.fetch = R, n.Headers = h, n.Request = I, n.Response = K), e.Headers = h, e.Request = I, e.Response = K, e.fetch = R, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ie);
})();
const ly = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function uy(t, e) {
  const n = {};
  return Object.assign(n, ly, e), await fetch(t, n);
}
function fy(t) {
  let e = uy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function hy(...t) {
  const { fetchLib: e, middlewares: n } = fy(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
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
var bs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(bs || (bs = {}));
var Ir;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ir || (Ir = {}));
var xu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xu || (xu = {}));
const dy = "https://api.mainnet.hiro.so", py = "https://api.testnet.hiro.so", gy = "http://localhost:3999", yy = ["mainnet", "testnet", "devnet", "mocknet"];
let xs = class {
  constructor(e) {
    this.version = Ir.Mainnet, this.chainId = bs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ir.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? hy();
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
xs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Rh();
    case "testnet":
      return new wy();
    case "devnet":
      return new by();
    case "mocknet":
      return new Gh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yy.join(", ")}`);
  }
};
xs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : xs.fromName(t);
let Rh = class extends xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? dy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ir.Mainnet, this.chainId = bs.Mainnet;
  }
}, wy = class extends xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? py,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ir.Testnet, this.chainId = bs.Testnet;
  }
}, Gh = class extends xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ir.Testnet, this.chainId = bs.Testnet;
  }
};
const by = Gh, Vh = "xtrata.wallet.bridge.v1", xy = (t) => typeof t == "object" && t !== null && t.protocol === Vh, my = (t) => xy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Sy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Vs extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const mu = 12e4;
class Ey {
  constructor(e) {
    Gs(this, "pending", /* @__PURE__ */ new Map());
    Gs(this, "listenTarget");
    Gs(this, "closed", !1);
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
    Gs(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !my(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Vs("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Vs("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Vs("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Sy(), i = { protocol: Vh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Vs(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? mu}ms.`
          )
        );
      }, this.options.timeoutMs ?? mu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Vs("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Ay = ["SP", "SM"], $y = ["ST", "SN"], vy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Ay.includes(n) ? "mainnet" : $y.includes(n) ? "testnet" : null;
}, Iy = () => {
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
}, Ly = () => typeof window > "u" || !window.localStorage ? Iy() : window.localStorage, ma = "xtrata.v15.1.wallet.session", Su = "mainnet", ho = { isConnected: !1 }, Cy = (t) => t.address ? vy(t.address) ?? t.network : t.network, Kh = (t) => !t.isConnected || !t.address ? { ...ho } : Cy(t) !== Su ? { ...ho } : {
  isConnected: !0,
  address: t.address,
  network: Su,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, ky = (t) => {
  if (!t)
    return { ...ho };
  try {
    const e = JSON.parse(t);
    return Kh(e);
  } catch {
    return { ...ho };
  }
}, By = (t) => {
  const e = Kh(t);
  return JSON.stringify(e);
}, My = (t) => {
  const e = Ly();
  return {
    load: () => ky(e.getItem(ma)),
    save: (n) => {
      e.setItem(ma, By(n));
    },
    clear: () => {
      e.removeItem(ma);
    }
  };
}, Ty = "https://browser.blockstack.org/auth", _y = {
  "@type": "Person",
  "@context": "http://schema.org"
}, qh = ["store_write"], Uy = "blockstack-session", Hy = {
  logLevel: "debug"
}, Rr = {
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
Object.freeze(Rr);
class Ns extends Error {
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
class Ny extends Ns {
  constructor(e, n = "") {
    super({ code: Rr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Eu extends Ns {
  constructor(e = "") {
    super({ code: Rr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ki extends Ns {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Rr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Au extends Ns {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Rr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Va extends Ns {
  constructor(e) {
    super({ code: Rr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Wh extends Ns {
  constructor(e) {
    super({ code: Rr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const $u = ["debug", "info", "warn", "error", "none"], Ka = {};
for (let t = 0; t < $u.length; t++) {
  const e = $u[t];
  Ka[e] = t;
}
class fs {
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
    return Ka[Hy.logLevel] <= Ka[e];
  }
}
function Py() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Oy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Sa(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Dy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Fy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function jy(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Zc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Fy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    fs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = jy(s, t.toString(), n);
    throw fs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function cr(t, e) {
  return Qc(te(t), e);
}
function te(t) {
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
  if (de(t, Uint8Array))
    return BigInt(`0x${Z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function zy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function vu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function yi(t, e = 8) {
  return (typeof t == "bigint" ? t : te(t)).toString(16).padStart(e * 2, "0");
}
function jo(t) {
  return parseInt(t, 16);
}
function Qc(t, e = 16) {
  const n = yi(t, e);
  return pt(n);
}
function Ry(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Gy(t, e) {
  return t & BigInt(1) << e;
}
function qa(t) {
  return Vy(BigInt(`0x${Z(t)}`), BigInt(t.byteLength * 8));
}
function Vy(t, e) {
  return Gy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Ky = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ky[n];
  return e;
}
function pt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = zy(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Gr(t) {
  return new TextEncoder().encode(t);
}
function wi(t) {
  return new TextDecoder().decode(t);
}
function qy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Wy(t) {
  return String.fromCharCode.apply(null, t);
}
function Xy(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Iu(t) {
  if (t.some(Xy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function on(...t) {
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
function Dt(t) {
  return on(...t.map((e) => typeof e == "number" ? Iu([e]) : e instanceof Array ? Iu(e) : e));
}
function de(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Xh = "https://api.mainnet.hiro.so", Yh = "https://api.testnet.hiro.so", Zh = "http://localhost:3999", Yy = "https://hub.blockstack.org", Zy = 33, Ea = 32;
function Qy(t) {
  if (t.length < Ea * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ea * 2), r = t.slice(2 + Ea * 2);
  return {
    recoveryId: jo(e),
    r: n,
    s: r
  };
}
function Jc(t) {
  const e = typeof t == "string" ? pt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Jy(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function tw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function ew(t, e) {
  return t[e];
}
function nw(t, e, n = 0) {
  return t[n] = e, t;
}
function rw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Lr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const sw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function iw(t, e) {
  const n = {};
  return Object.assign(n, sw, e), await fetch(t, n);
}
function ow(t) {
  let e = iw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function aw(...t) {
  const { fetchLib: e, middlewares: n } = ow(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
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
class Qh {
  constructor(e = qh.slice(), n = ((a) => (a = Zc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Ty) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Wa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function cw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Jh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function lw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wa(t.outputLen), Wa(t.blockLen);
}
function uw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fw(t, e) {
  Jh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const wr = {
  number: Wa,
  bool: cw,
  bytes: Jh,
  hash: lw,
  exists: uw,
  output: fw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Aa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xe = (t, e) => t << 32 - e | t >>> e, hw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function tl(t) {
  if (typeof t == "string" && (t = dw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let td = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vr(t) {
  const e = (r) => t().update(tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ed = class extends td {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, wr.hash(e);
    const r = tl(n);
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
    return wr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    wr.exists(this), wr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const zo = (t, e, n) => new ed(t, e).update(n).digest();
zo.create = (t, e) => new ed(t, e);
function pw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let el = class extends td {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Aa(this.buffer);
  }
  update(e) {
    wr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = tl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Aa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    wr.exists(this), wr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Aa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const gw = (t, e, n) => t & e ^ ~t & n, yw = (t, e, n) => t & e ^ t & n ^ e & n, ww = new Uint32Array([
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
]), Mn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Tn = new Uint32Array(64);
let nd = class extends el {
  constructor() {
    super(64, 32, 8, !1), this.A = Mn[0] | 0, this.B = Mn[1] | 0, this.C = Mn[2] | 0, this.D = Mn[3] | 0, this.E = Mn[4] | 0, this.F = Mn[5] | 0, this.G = Mn[6] | 0, this.H = Mn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Tn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Tn[l - 15], f = Tn[l - 2], y = Xe(g, 7) ^ Xe(g, 18) ^ g >>> 3, w = Xe(f, 17) ^ Xe(f, 19) ^ f >>> 10;
      Tn[l] = w + Tn[l - 7] + y + Tn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Xe(a, 6) ^ Xe(a, 11) ^ Xe(a, 25), f = h + g + gw(a, c, u) + ww[l] + Tn[l] | 0, w = (Xe(r, 2) ^ Xe(r, 13) ^ Xe(r, 22)) + yw(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Tn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bw = class extends nd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ms = Vr(() => new nd());
Vr(() => new bw());
const xw = {}, rd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const dt = BigInt(0), Bt = BigInt(1), sr = BigInt(2), Ys = BigInt(3), Lu = BigInt(8), mt = Object.freeze({
  a: dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Bt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Cu = (t, e) => (t + e / sr) / e, Bi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = mt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Bt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Cu(i * t, e), c = Cu(-r * t, e);
    let u = F(t - a * n - c * s, e), h = F(-a * r - c * i, e);
    const l = u > o, g = h > o;
    if (l && (u = e - u), g && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: h };
  }
}, Fe = 32, Cr = 32, sd = 32, po = Fe + 1, go = 2 * Fe + 1;
function ku(t) {
  const { a: e, b: n } = mt, r = F(t * t), s = F(r * t);
  return F(s + e * t + n);
}
const Mi = mt.a === dt;
class nl extends Error {
  constructor(e) {
    super(e);
  }
}
function Bu(t) {
  if (!(t instanceof wt))
    throw new TypeError("JacobianPoint expected");
}
class wt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof ct))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(ct.ZERO) ? wt.ZERO : new wt(e.x, e.y, Bt);
  }
  static toAffineBatch(e) {
    const n = $w(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return wt.toAffineBatch(e).map(wt.fromAffine);
  }
  equals(e) {
    Bu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = F(s * s), u = F(a * a), h = F(n * u), l = F(i * c), g = F(F(r * a) * u), f = F(F(o * s) * c);
    return h === l && g === f;
  }
  negate() {
    return new wt(this.x, F(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = F(e * e), i = F(n * n), o = F(i * i), a = e + i, c = F(sr * (F(a * a) - s - o)), u = F(Ys * s), h = F(u * u), l = F(h - sr * c), g = F(u * (c - l) - Lu * o), f = F(sr * n * r);
    return new wt(l, g, f);
  }
  add(e) {
    Bu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === dt || o === dt)
      return this;
    if (n === dt || r === dt)
      return e;
    const c = F(s * s), u = F(a * a), h = F(n * u), l = F(i * c), g = F(F(r * a) * u), f = F(F(o * s) * c), y = F(l - h), w = F(f - g);
    if (y === dt)
      return w === dt ? this.double() : wt.ZERO;
    const v = F(y * y), T = F(y * v), _ = F(h * v), b = F(w * w - T - sr * _), I = F(w * (_ - b) - g * T), A = F(s * a * y);
    return new wt(b, I, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = wt.ZERO;
    if (typeof e == "bigint" && e === dt)
      return n;
    let r = _u(e);
    if (r === Bt)
      return this;
    if (!Mi) {
      let l = n, g = this;
      for (; r > dt; )
        r & Bt && (l = l.add(g)), g = g.double(), r >>= Bt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Bi.splitScalar(r), c = n, u = n, h = this;
    for (; i > dt || a > dt; )
      i & Bt && (c = c.add(h)), a & Bt && (u = u.add(h)), h = h.double(), i >>= Bt, a >>= Bt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new wt(F(u.x * Bi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Mi ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let a = 1; a < 2 ** (e - 1); a++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(wt.BASE) && (n = ct.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Xa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = wt.normalizeZ(s), Xa.set(n, s)));
    let i = wt.ZERO, o = wt.BASE;
    const a = 1 + (Mi ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const f = g * c;
      let y = Number(e & u);
      e >>= l, y > c && (y -= h, e += Bt);
      const w = f, v = f + Math.abs(y) - 1, T = g % 2 !== 0, _ = y < 0;
      y === 0 ? o = o.add(Ti(T, s[w])) : i = i.add(Ti(_, s[v]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = _u(e), s, i;
    if (Mi) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Bi.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: g, f } = this.wNAF(u, n);
      h = Ti(o, h), g = Ti(c, g), g = new wt(F(g.x * Bi.beta), g.y, g.z), s = h.add(g), i = l.add(f);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return wt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(wt.ZERO);
    e == null && (e = i ? Lu : Ps(s));
    const o = e, a = F(o * o), c = F(a * o), u = F(n * a), h = F(r * c), l = F(s * o);
    if (i)
      return ct.ZERO;
    if (l !== Bt)
      throw new Error("invZ was invalid");
    return new ct(u, h);
  }
}
wt.BASE = new wt(mt.Gx, mt.Gy, Bt);
wt.ZERO = new wt(dt, Bt, dt);
function Ti(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Xa = /* @__PURE__ */ new WeakMap();
class ct {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Xa.delete(this);
  }
  hasEvenY() {
    return this.y % sr === dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Ee(n ? e : e.subarray(1));
    if (!so(r))
      throw new Error("Point is not on curve");
    const s = ku(r);
    let i = Aw(s);
    const o = (i & Bt) === Bt;
    n ? o && (i = F(-i)) : (e[0] & 1) === 1 !== o && (i = F(-i));
    const a = new ct(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Ee(e.subarray(1, Fe + 1)), r = Ee(e.subarray(Fe + 1, Fe * 2 + 1)), s = new ct(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = an(e), r = n.length, s = n[0];
    if (r === Fe)
      return this.fromCompressedHex(n);
    if (r === po && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === go && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${po} compressed bytes or ${go} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return ct.BASE.multiply(kr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = ad(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = rl(an(e)), { n: a } = mt, c = r === 2 || r === 3 ? s + a : s, u = Ps(c, a), h = F(-o * u, a), l = F(i * u, a), g = r & 1 ? "03" : "02", f = ct.fromHex(g + ir(c)), y = ct.BASE.multiplyAndAddUnsafe(f, h, l);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return or(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ir(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ir(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!so(n) || !so(r))
      throw new Error(e);
    const s = F(r * r), i = ku(n);
    if (F(s - i) !== dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ct(this.x, F(-this.y));
  }
  double() {
    return wt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return wt.fromAffine(this).add(wt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return wt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = wt.fromAffine(this), i = n === dt || n === Bt || this !== ct.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = wt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(wt.ZERO) ? void 0 : a.toAffine();
  }
}
ct.BASE = new ct(mt.Gx, mt.Gy);
ct.ZERO = new ct(dt, dt);
function Mu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Tu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ss(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ee(n), left: t.subarray(e + 2) };
}
function mw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ss(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Tu(t.subarray(2)), { data: r, left: s } = Tu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ss(s)}`);
  return { r: e, s: r };
}
class Se {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ss(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Se(yo(s.slice(0, 64)), yo(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = mw(n ? e : or(e));
    return new Se(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!As(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!As(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = mt.n >> Bt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Se(this.r, F(-this.s, mt.n)) : this;
  }
  toDERRawBytes() {
    return or(this.toDERHex());
  }
  toDERHex() {
    const e = Mu(Ks(this.s)), n = Mu(Ks(this.r)), r = e.length / 2, s = n.length / 2, i = Ks(r), o = Ks(s);
    return `30${Ks(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return or(this.toCompactHex());
  }
  toCompactHex() {
    return ir(this.r) + ir(this.s);
  }
}
function nr(...t) {
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
const Sw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ss(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Sw[t[n]];
  return e;
}
const Ew = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ir(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(dt <= t && t < Ew))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Es(t) {
  const e = or(ir(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ks(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function yo(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function or(t) {
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
function Ee(t) {
  return yo(Ss(t));
}
function an(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : or(t);
}
function _u(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && As(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function F(t, e = mt.P) {
  const n = t % e;
  return n >= dt ? n : e + n;
}
function Ie(t, e) {
  const { P: n } = mt;
  let r = t;
  for (; e-- > dt; )
    r *= r, r %= n;
  return r;
}
function Aw(t) {
  const { P: e } = mt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Ie(u, Ys) * u % e, l = Ie(h, Ys) * u % e, g = Ie(l, sr) * c % e, f = Ie(g, r) * g % e, y = Ie(f, s) * f % e, w = Ie(y, o) * y % e, v = Ie(w, a) * w % e, T = Ie(v, o) * y % e, _ = Ie(T, Ys) * u % e, b = Ie(_, i) * f % e, I = Ie(b, n) * c % e, A = Ie(I, sr);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Ps(t, e = mt.P) {
  if (t === dt || e <= dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = F(t, e), r = e, s = dt, i = Bt;
  for (; n !== dt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Bt)
    throw new Error("invert: does not exist");
  return F(s, e);
}
function $w(t, e = mt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === dt ? i : (n[a] = i, F(i * o, e)), Bt), s = Ps(r, e);
  return t.reduceRight((i, o, a) => o === dt ? i : (n[a] = F(i * n[a], e), F(i * o, e)), s), n;
}
function vw(t) {
  const e = t.length * 8 - Cr * 8, n = Ee(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function rl(t, e = !1) {
  const n = vw(t);
  if (e)
    return n;
  const { n: r } = mt;
  return n >= r ? n - r : n;
}
let ys, Zs;
class id {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Pt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Zs(this.k, ...e);
  }
  checkSync() {
    if (typeof Zs != "function")
      throw new nl("hmacSha256Sync needs to be set");
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
    return nr(...n);
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
    return nr(...n);
  }
}
function As(t) {
  return dt < t && t < mt.n;
}
function so(t) {
  return dt < t && t < mt.P;
}
function od(t, e, n, r = !0) {
  const { n: s } = mt, i = rl(t, !0);
  if (!As(i))
    return;
  const o = Ps(i, s), a = ct.BASE.multiply(i), c = F(a.x, s);
  if (c === dt)
    return;
  const u = F(o * F(e + n * c, s), s);
  if (u === dt)
    return;
  let h = new Se(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & Bt);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function kr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Cr)
      throw new Error("Expected 32 bytes of private key");
    e = yo(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Cr)
      throw new Error("Expected 32 bytes of private key");
    e = Ee(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!As(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function sl(t) {
  return t instanceof ct ? (t.assertValidity(), t) : ct.fromHex(t);
}
function ad(t) {
  if (t instanceof Se)
    return t.assertValidity(), t;
  try {
    return Se.fromDER(t);
  } catch {
    return Se.fromCompact(t);
  }
}
function bi(t, e = !1) {
  return ct.fromPrivateKey(t).toRawBytes(e);
}
function Iw(t, e, n, r = !1) {
  return ct.fromSignature(t, e, n).toRawBytes(r);
}
function Uu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === po || r === go : n ? r === po * 2 || r === go * 2 : t instanceof ct;
}
function il(t, e, n = !1) {
  if (Uu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Uu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = sl(e);
  return r.assertValidity(), r.multiply(kr(t)).toRawBytes(n);
}
function cd(t) {
  const e = t.length > Fe ? t.slice(0, Fe) : t;
  return Ee(e);
}
function Lw(t) {
  const e = cd(t), n = F(e, mt.n);
  return ld(n < dt ? e : n);
}
function ld(t) {
  return Es(t);
}
function ud(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = an(t), s = kr(e), i = [ld(s), Lw(r)];
  if (n != null) {
    n === !0 && (n = Pt.randomBytes(Fe));
    const c = an(n);
    if (c.length !== Fe)
      throw new Error(`sign: Expected ${Fe} bytes of extra data`);
    i.push(c);
  }
  const o = nr(...i), a = cd(r);
  return { seed: o, m: a, d: s };
}
function fd(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Cw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ud(t, e, n.extraEntropy), o = new id(sd, Cr);
  await o.reseed(r);
  let a;
  for (; !(a = od(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return fd(a, n);
}
function Ro(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ud(t, e, n.extraEntropy), o = new id(sd, Cr);
  o.reseedSync(r);
  let a;
  for (; !(a = od(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return fd(a, n);
}
const kw = { strict: !0 };
function Bw(t, e, n, r = kw) {
  let s;
  try {
    s = ad(t), e = an(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = rl(e);
  let c;
  try {
    c = sl(n);
  } catch {
    return !1;
  }
  const { n: u } = mt, h = Ps(o, u), l = F(a * h, u), g = F(i * h, u), f = ct.BASE.multiplyAndAddUnsafe(c, l, g);
  return f ? F(f.x, u) === i : !1;
}
function wo(t) {
  return F(Ee(t), mt.n);
}
class $s {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = an(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Ee(n.subarray(0, 32)), s = Ee(n.subarray(32, 64));
    return new $s(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!so(e) || !As(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ir(this.r) + ir(this.s);
  }
  toRawBytes() {
    return or(this.toHex());
  }
}
function Mw(t) {
  return ct.fromPrivateKey(t).toRawX();
}
class hd {
  constructor(e, n, r = Pt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = an(e);
    const { x: s, scalar: i } = this.getScalar(kr(n));
    if (this.px = s, this.d = i, this.rand = an(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = ct.fromPrivateKey(e), r = n.hasEvenY() ? e : mt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Es(e ^ Ee(n));
  }
  finalizeNonce(e) {
    const n = F(Ee(e), mt.n);
    if (n === dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new $s(e.x, F(n + r * s, mt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Pt.taggedHash, o = this.initNonce(n, await i(er.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(er.nonce, o, r, e)), h = wo(await i(er.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await gd(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Pt.taggedHashSync, o = this.initNonce(n, i(er.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(er.nonce, o, r, e)), h = wo(i(er.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return yd(l, e, r) || this.error(), l;
  }
}
async function Tw(t, e, n) {
  return new hd(t, e, n).calc();
}
function _w(t, e, n) {
  return new hd(t, e, n).calcSync();
}
function dd(t, e, n) {
  const r = t instanceof $s, s = r ? t : $s.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: an(e),
    P: sl(n)
  };
}
function pd(t, e, n, r) {
  const s = ct.BASE.multiplyAndAddUnsafe(e, kr(n), F(-r, mt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function gd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = dd(t, e, n), a = wo(await Pt.taggedHash(er.challenge, Es(r), o.toRawX(), i));
    return pd(r, o, s, a);
  } catch {
    return !1;
  }
}
function yd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = dd(t, e, n), a = wo(Pt.taggedHashSync(er.challenge, Es(r), o.toRawX(), i));
    return pd(r, o, s, a);
  } catch (r) {
    if (r instanceof nl)
      throw r;
    return !1;
  }
}
const Uw = {
  Signature: $s,
  getPublicKey: Mw,
  sign: Tw,
  verify: gd,
  signSync: _w,
  verifySync: yd
};
ct.BASE._setWindowSize(8);
const ye = {
  node: rd,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, er = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, _i = {}, Pt = {
  bytesToHex: Ss,
  hexToBytes: or,
  concatBytes: nr,
  mod: F,
  invert: Ps,
  isValidPrivateKey(t) {
    try {
      return kr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Es,
  _normalizePrivateKey: kr,
  hashToPrivateKey: (t) => {
    t = an(t);
    const e = Cr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = F(Ee(t), mt.n - Bt) + Bt;
    return Es(n);
  },
  randomBytes: (t = 32) => {
    if (ye.web)
      return ye.web.getRandomValues(new Uint8Array(t));
    if (ye.node) {
      const { randomBytes: e } = ye.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Pt.hashToPrivateKey(Pt.randomBytes(Cr + 8)),
  precompute(t = 8, e = ct.BASE) {
    const n = e === ct.BASE ? e : new ct(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ys), n;
  },
  sha256: async (...t) => {
    if (ye.web) {
      const e = await ye.web.subtle.digest("SHA-256", nr(...t));
      return new Uint8Array(e);
    } else if (ye.node) {
      const { createHash: e } = ye.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ye.web) {
      const n = await ye.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = nr(...e), s = await ye.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ye.node) {
      const { createHmac: n } = ye.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = _i[t];
    if (n === void 0) {
      const r = await Pt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = nr(r, r), _i[t] = n;
    }
    return Pt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ys != "function")
      throw new nl("sha256Sync is undefined, you need to set it");
    let n = _i[t];
    if (n === void 0) {
      const r = ys(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = nr(r, r), _i[t] = n;
    }
    return ys(n, ...e);
  },
  _JacobianPoint: wt
};
Object.defineProperties(Pt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ys;
    },
    set(t) {
      ys || (ys = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Zs;
    },
    set(t) {
      Zs || (Zs = t);
    }
  }
});
const Hw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: mt,
  Point: ct,
  Signature: Se,
  getPublicKey: bi,
  getSharedSecret: il,
  recoverPublicKey: Iw,
  schnorr: Uw,
  sign: Cw,
  signSync: Ro,
  utils: Pt,
  verify: Bw
}, Symbol.toStringTag, { value: "Module" }));
var xi = {};
xi.byteLength = Fw;
var Nw = xi.toByteArray = zw, Pw = xi.fromByteArray = Vw, tn = [], Ce = [], Ow = typeof Uint8Array < "u" ? Uint8Array : Array, $a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var os = 0, Dw = $a.length; os < Dw; ++os)
  tn[os] = $a[os], Ce[$a.charCodeAt(os)] = os;
Ce[45] = 62;
Ce[95] = 63;
function wd(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Fw(t) {
  var e = wd(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function jw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function zw(t) {
  var e, n = wd(t), r = n[0], s = n[1], i = new Ow(jw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ce[t.charCodeAt(c)] << 18 | Ce[t.charCodeAt(c + 1)] << 12 | Ce[t.charCodeAt(c + 2)] << 6 | Ce[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Ce[t.charCodeAt(c)] << 2 | Ce[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Ce[t.charCodeAt(c)] << 10 | Ce[t.charCodeAt(c + 1)] << 4 | Ce[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Rw(t) {
  return tn[t >> 18 & 63] + tn[t >> 12 & 63] + tn[t >> 6 & 63] + tn[t & 63];
}
function Gw(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Rw(r));
  return s.join("");
}
function Vw(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Gw(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    tn[e >> 2] + tn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    tn[e >> 10] + tn[e >> 4 & 63] + tn[e << 2 & 63] + "="
  )), s.join("");
}
function Kw() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const qw = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Ww() {
  if (Kw())
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
    throw new Error(qw);
  }
}
class Xw {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(on(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(on(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Yw {
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: i, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function bd() {
  const t = await Ww();
  return t.name === "subtleCrypto" ? new Yw(t.lib) : new Xw(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Zw(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function h(f) {
    if (f instanceof Uint8Array || (ArrayBuffer.isView(f) ? f = new Uint8Array(f.buffer, f.byteOffset, f.byteLength) : Array.isArray(f) && (f = Uint8Array.from(f))), !(f instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (f.length === 0)
      return "";
    for (var y = 0, w = 0, v = 0, T = f.length; v !== T && f[v] === 0; )
      v++, y++;
    for (var _ = (T - v) * u + 1 >>> 0, b = new Uint8Array(_); v !== T; ) {
      for (var I = f[v], A = 0, P = _ - 1; (I !== 0 || A < w) && P !== -1; P--, A++)
        I += 256 * b[P] >>> 0, b[P] = I % o >>> 0, I = I / o >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      w = A, v++;
    }
    for (var K = _ - w; K !== _ && b[K] === 0; )
      K++;
    for (var O = a.repeat(y); K < _; ++K)
      O += t.charAt(b[K]);
    return O;
  }
  function l(f) {
    if (typeof f != "string")
      throw new TypeError("Expected String");
    if (f.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, v = 0; f[y] === a; )
      w++, y++;
    for (var T = (f.length - y) * c + 1 >>> 0, _ = new Uint8Array(T); f[y]; ) {
      var b = f.charCodeAt(y);
      if (b > 255)
        return;
      var I = e[b];
      if (I === 255)
        return;
      for (var A = 0, P = T - 1; (I !== 0 || A < v) && P !== -1; P--, A++)
        I += o * _[P] >>> 0, _[P] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      v = A, y++;
    }
    for (var K = T - v; K !== T && _[K] === 0; )
      K++;
    for (var O = new Uint8Array(w + (T - K)), R = w; K !== T; )
      O[R++] = _[K++];
    return O;
  }
  function g(f) {
    var y = l(f);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: g
  };
}
var xd = Zw;
const Qw = xd, Jw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var t1 = Qw(Jw);
const e1 = /* @__PURE__ */ zh(t1), n1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), md = Uint8Array.from({ length: 16 }, (t, e) => e), r1 = md.map((t) => (9 * t + 5) % 16);
let ol = [md], al = [r1];
for (let t = 0; t < 4; t++)
  for (let e of [ol, al])
    e.push(e[t].map((n) => n1[n]));
const Sd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s1 = ol.map((t, e) => t.map((n) => Sd[e][n])), i1 = al.map((t, e) => t.map((n) => Sd[e][n])), o1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ui = (t, e) => t << e | t >>> 32 - e;
function Hu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Hi = new Uint32Array(16);
let c1 = class extends el {
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
    for (let f = 0; f < 16; f++, n += 4)
      Hi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = o1[f], v = a1[f], T = ol[f], _ = al[f], b = s1[f], I = i1[f];
      for (let A = 0; A < 16; A++) {
        const P = Ui(r + Hu(f, i, a, u) + Hi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Ui(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Ui(s + Hu(y, o, c, h) + Hi[_[A]] + v, I[A]) + g | 0;
        s = g, g = h, h = Ui(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Hi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const l1 = Vr(() => new c1());
function u1(t) {
  return l1(t);
}
const Ni = BigInt(2 ** 32 - 1), Ya = BigInt(32);
function Ed(t, e = !1) {
  return e ? { h: Number(t & Ni), l: Number(t >> Ya & Ni) } : { h: Number(t >> Ya & Ni) | 0, l: Number(t & Ni) | 0 };
}
function f1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ed(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const h1 = (t, e) => BigInt(t >>> 0) << Ya | BigInt(e >>> 0), d1 = (t, e, n) => t >>> n, p1 = (t, e, n) => t << 32 - n | e >>> n, g1 = (t, e, n) => t >>> n | e << 32 - n, y1 = (t, e, n) => t << 32 - n | e >>> n, w1 = (t, e, n) => t << 64 - n | e >>> n - 32, b1 = (t, e, n) => t >>> n - 32 | e << 64 - n, x1 = (t, e) => e, m1 = (t, e) => t, S1 = (t, e, n) => t << n | e >>> 32 - n, E1 = (t, e, n) => e << n | t >>> 32 - n, A1 = (t, e, n) => e << n - 32 | t >>> 64 - n, $1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function v1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const I1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), k1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, B1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), M1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
  fromBig: Ed,
  split: f1,
  toBig: h1,
  shrSH: d1,
  shrSL: p1,
  rotrSH: g1,
  rotrSL: y1,
  rotrBH: w1,
  rotrBL: b1,
  rotr32H: x1,
  rotr32L: m1,
  rotlSH: S1,
  rotlSL: E1,
  rotlBH: A1,
  rotlBL: $1,
  add: v1,
  add3L: I1,
  add3H: L1,
  add4L: C1,
  add4H: k1,
  add5H: M1,
  add5L: B1
}, [T1, _1] = et.split([
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
].map((t) => BigInt(t))), _n = new Uint32Array(80), Un = new Uint32Array(80);
let Go = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      _n[b] = e.getUint32(n), Un[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = _n[b - 15] | 0, A = Un[b - 15] | 0, P = et.rotrSH(I, A, 1) ^ et.rotrSH(I, A, 8) ^ et.shrSH(I, A, 7), K = et.rotrSL(I, A, 1) ^ et.rotrSL(I, A, 8) ^ et.shrSL(I, A, 7), O = _n[b - 2] | 0, R = Un[b - 2] | 0, x = et.rotrSH(O, R, 19) ^ et.rotrBH(O, R, 61) ^ et.shrSH(O, R, 6), L = et.rotrSL(O, R, 19) ^ et.rotrBL(O, R, 61) ^ et.shrSL(O, R, 6), H = et.add4L(K, L, Un[b - 7], Un[b - 16]), q = et.add4H(H, P, x, _n[b - 7], _n[b - 16]);
      _n[b] = q | 0, Un[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: v, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = et.rotrSH(l, g, 14) ^ et.rotrSH(l, g, 18) ^ et.rotrBH(l, g, 41), A = et.rotrSL(l, g, 14) ^ et.rotrSL(l, g, 18) ^ et.rotrBL(l, g, 41), P = l & f ^ ~l & w, K = g & y ^ ~g & v, O = et.add5L(_, A, K, _1[b], Un[b]), R = et.add5H(O, T, I, P, T1[b], _n[b]), x = O | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), H = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = v | 0, w = f | 0, v = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = et.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = et.add3L(x, H, Y);
      r = et.add3H(z, R, L, q), s = z | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = et.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: v } = et.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: T, l: _ } = et.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, v, T, _);
  }
  roundClean() {
    _n.fill(0), Un.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, U1 = class extends Go {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, H1 = class extends Go {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N1 = class extends Go {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const P1 = Vr(() => new Go());
Vr(() => new U1());
Vr(() => new H1());
Vr(() => new N1());
function Ad(t) {
  return ms(t);
}
function O1(t) {
  return P1(t);
}
const D1 = 0;
Pt.hmacSha256Sync = (t, ...e) => {
  const n = zo.create(ms, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F1() {
  return Z(Pt.randomPrivateKey());
}
function j1(t) {
  const e = ms(ms(t));
  return e1.encode(on(t, e).slice(0, t.length + 4));
}
function z1(t, e) {
  return j1(on(new Uint8Array([t]), e.slice(0, 20)));
}
function $d(t, e = D1) {
  const n = typeof t == "string" ? pt(t) : t, r = u1(Ad(n));
  return z1(e, r);
}
function vd(t) {
  const e = Jc(t);
  return Z(bi(e.slice(0, 32), !0));
}
Pt.hmacSha256Sync = (t, ...e) => {
  const n = zo.create(ms, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var bo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(bo || (bo = {}));
async function R1(t, e, n) {
  return await (await bd()).encrypt("aes-256-cbc", e, t, n);
}
async function G1(t, e, n) {
  return await (await bd()).decrypt("aes-256-cbc", e, t, n);
}
function Id(t, e) {
  return zo(ms, t, e);
}
function V1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Ld(t) {
  const e = O1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function K1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function q1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: bo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: bo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !K1(t))
    return e;
  try {
    return ct.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function W1(t, e, n, r) {
  const s = q1(t);
  if (!s.result)
    throw s;
  const i = Pt.randomPrivateKey(), o = bi(i, !0);
  let a = il(i, t, !0);
  a = a.slice(1);
  const c = Ld(a), u = Pt.randomBytes(16), h = await R1(u, c.encryptionKey, e), l = on(u, o, h), g = Id(c.hmacKey, l);
  let f;
  if (!r || r === "hex")
    f = Z(h);
  else if (r === "base64")
    f = Pw(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: Z(u),
    ephemeralPK: Z(o),
    cipherText: f,
    mac: Z(g),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function Cd(t, e) {
  if (!e.ephemeralPK)
    throw new Au("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = il(t, n, !0);
  r = r.slice(1);
  const s = Ld(r), i = pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Nw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = on(i, pt(n), o), c = Id(s.hmacKey, a), u = pt(e.mac);
  if (!V1(u, c))
    throw new Au("Decryption failed: failure in MAC check");
  const h = await G1(i, s.encryptionKey, o);
  return e.wasString ? wi(h) : h;
}
function X1(t, e) {
  const n = typeof e == "string" ? Gr(e) : e, r = vd(t), s = Ad(n), i = Ro(s, t);
  return {
    signature: Z(i),
    publicKey: r
  };
}
async function Y1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = vd(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Gr(t) : t, o = await W1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = X1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Z1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Cd(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Yt = {}, vs = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.decode = re.encode = re.unescape = re.escape = re.pad = void 0;
const kd = xi;
function cl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
re.pad = cl;
function Bd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
re.escape = Bd;
function Md(t) {
  return cl(t).replace(/-/g, "+").replace(/_/g, "/");
}
re.unescape = Md;
function Q1(t) {
  return Bd((0, kd.fromByteArray)(new TextEncoder().encode(t)));
}
re.encode = Q1;
function J1(t) {
  return new TextDecoder().decode((0, kd.toByteArray)(cl(Md(t))));
}
re.decode = J1;
var Vo = {}, Ko = {}, Td = {}, _d = {}, qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.crypto = void 0;
qo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = g, t.rotl = f, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = _, t.hexToBytes = A, t.asyncLoop = K, t.utf8ToBytes = O, t.bytesToUtf8 = R, t.toBytes = x, t.kdfInputToBytes = L, t.concatBytes = H, t.checkOpts = q, t.createHasher = z, t.createOptHasher = ee, t.createXOFer = Vt, t.randomBytes = Zt;
  const e = qo;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...k) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (k.length > 0 && !k.includes(S.length))
      throw new Error("Uint8Array expected of length " + k + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, k = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (k && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, k) {
    s(S);
    const Q = k.outputLen;
    if (S.length < Q)
      throw new Error("digestInto() expects output buffer of length at least " + Q);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function h(...S) {
    for (let k = 0; k < S.length; k++)
      S[k].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, k) {
    return S << 32 - k | S >>> k;
  }
  function f(S, k) {
    return S << k | S >>> 32 - k >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => y(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let k = 0; k < S.length; k++)
      S[k] = y(S[k]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const v = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", T = /* @__PURE__ */ Array.from({ length: 256 }, (S, k) => k.toString(16).padStart(2, "0"));
  function _(S) {
    if (s(S), v)
      return S.toHex();
    let k = "";
    for (let Q = 0; Q < S.length; Q++)
      k += T[S[Q]];
    return k;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(S) {
    if (S >= b._0 && S <= b._9)
      return S - b._0;
    if (S >= b.A && S <= b.F)
      return S - (b.A - 10);
    if (S >= b.a && S <= b.f)
      return S - (b.a - 10);
  }
  function A(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if (v)
      return Uint8Array.fromHex(S);
    const k = S.length, Q = k / 2;
    if (k % 2)
      throw new Error("hex string expected, got unpadded hex of length " + k);
    const gt = new Uint8Array(Q);
    for (let ht = 0, St = 0; ht < Q; ht++, St += 2) {
      const ae = I(S.charCodeAt(St)), fn = I(S.charCodeAt(St + 1));
      if (ae === void 0 || fn === void 0) {
        const kn = S[St] + S[St + 1];
        throw new Error('hex string expected, got non-hex character "' + kn + '" at index ' + St);
      }
      gt[ht] = ae * 16 + fn;
    }
    return gt;
  }
  const P = async () => {
  };
  t.nextTick = P;
  async function K(S, k, Q) {
    let gt = Date.now();
    for (let ht = 0; ht < S; ht++) {
      Q(ht);
      const St = Date.now() - gt;
      St >= 0 && St < k || (await (0, t.nextTick)(), gt += St);
    }
  }
  function O(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function R(S) {
    return new TextDecoder().decode(S);
  }
  function x(S) {
    return typeof S == "string" && (S = O(S)), s(S), S;
  }
  function L(S) {
    return typeof S == "string" && (S = O(S)), s(S), S;
  }
  function H(...S) {
    let k = 0;
    for (let gt = 0; gt < S.length; gt++) {
      const ht = S[gt];
      s(ht), k += ht.length;
    }
    const Q = new Uint8Array(k);
    for (let gt = 0, ht = 0; gt < S.length; gt++) {
      const St = S[gt];
      Q.set(St, ht), ht += St.length;
    }
    return Q;
  }
  function q(S, k) {
    if (k !== void 0 && {}.toString.call(k) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, k);
  }
  class Y {
  }
  t.Hash = Y;
  function z(S) {
    const k = (gt) => S().update(x(gt)).digest(), Q = S();
    return k.outputLen = Q.outputLen, k.blockLen = Q.blockLen, k.create = () => S(), k;
  }
  function ee(S) {
    const k = (gt, ht) => S(ht).update(x(gt)).digest(), Q = S({});
    return k.outputLen = Q.outputLen, k.blockLen = Q.blockLen, k.create = (gt) => S(gt), k;
  }
  function Vt(S) {
    const k = (gt, ht) => S(ht).update(x(gt)).digest(), Q = S({});
    return k.outputLen = Q.outputLen, k.blockLen = Q.blockLen, k.create = (gt) => S(gt), k;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = ee, t.wrapXOFConstructorWithOpts = Vt;
  function Zt(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(_d);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = _d;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
    }
    update(i) {
      return (0, e.aexists)(this), this.iHash.update(i), this;
    }
    digestInto(i) {
      (0, e.aexists)(this), (0, e.abytes)(i, this.outputLen), this.finished = !0, this.iHash.digestInto(i), this.oHash.update(i), this.oHash.digestInto(i), this.destroy();
    }
    digest() {
      const i = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(i), i;
    }
    _cloneInto(i) {
      i || (i = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = h, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (s, i, o) => new n(s, i).update(o).digest();
  t.hmac = r, t.hmac.create = (s, i) => new n(s, i);
})(Td);
const as = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ud(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Za(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Kr(t, ...e) {
  if (!Ud(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function tb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Za(t.outputLen), Za(t.blockLen);
}
function Qa(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Hd(t, e) {
  Kr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function eb(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function nb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function xo(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function io(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function He(t, e) {
  return t << 32 - e | t >>> e;
}
function rb(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ll = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ul(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Nd = ll ? (t) => t : (t) => ul(t), sb = Nd;
function Pd(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = ul(t[e]);
  return t;
}
const ib = ll ? (t) => t : Pd, Od = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ob = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ab(t) {
  if (Kr(t), Od)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ob[t[n]];
  return e;
}
const xn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Nu(t) {
  if (t >= xn._0 && t <= xn._9)
    return t - xn._0;
  if (t >= xn.A && t <= xn.F)
    return t - (xn.A - 10);
  if (t >= xn.a && t <= xn.f)
    return t - (xn.a - 10);
}
function cb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Od)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Nu(t.charCodeAt(i)), a = Nu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Dd = async () => {
};
async function lb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Dd(), r += i);
  }
}
function fl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ub(t) {
  return new TextDecoder().decode(t);
}
function mi(t) {
  return typeof t == "string" && (t = fl(t)), Kr(t), t;
}
function fb(t) {
  return typeof t == "string" && (t = fl(t)), Kr(t), t;
}
function hb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Kr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function db(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Fd = class {
};
function Wo(t) {
  const e = (r) => t().update(mi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function jd(t) {
  const e = (r, s) => t(s).update(mi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function zd(t) {
  const e = (r, s) => t(s).update(mi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const pb = Wo, gb = jd, yb = zd;
function wb(t = 32) {
  if (as && typeof as.getRandomValues == "function")
    return as.getRandomValues(new Uint8Array(t));
  if (as && typeof as.randomBytes == "function")
    return Uint8Array.from(as.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Fd,
  abytes: Kr,
  aexists: Qa,
  ahash: tb,
  anumber: Za,
  aoutput: Hd,
  asyncLoop: lb,
  byteSwap: ul,
  byteSwap32: Pd,
  byteSwapIfBE: sb,
  bytesToHex: ab,
  bytesToUtf8: ub,
  checkOpts: db,
  clean: xo,
  concatBytes: hb,
  createHasher: Wo,
  createOptHasher: jd,
  createView: io,
  createXOFer: zd,
  hexToBytes: cb,
  isBytes: Ud,
  isLE: ll,
  kdfInputToBytes: fb,
  nextTick: Dd,
  randomBytes: wb,
  rotl: rb,
  rotr: He,
  swap32IfBE: ib,
  swap8IfBE: Nd,
  toBytes: mi,
  u32: nb,
  u8: eb,
  utf8ToBytes: fl,
  wrapConstructor: pb,
  wrapConstructorWithOpts: gb,
  wrapXOFConstructorWithOpts: yb
}, Symbol.toStringTag, { value: "Module" }));
function xb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function mb(t, e, n) {
  return t & e ^ ~t & n;
}
function Sb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Eb extends Fd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = io(this.buffer);
  }
  update(e) {
    Qa(this), e = mi(e), Kr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = io(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Qa(this), Hd(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, xo(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    xb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = io(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = i, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const Hn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Ab = /* @__PURE__ */ Uint32Array.from([
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
]), Pn = /* @__PURE__ */ new Uint32Array(64);
let hl = class extends Eb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Hn[0] | 0, this.B = Hn[1] | 0, this.C = Hn[2] | 0, this.D = Hn[3] | 0, this.E = Hn[4] | 0, this.F = Hn[5] | 0, this.G = Hn[6] | 0, this.H = Hn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Pn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Pn[l - 15], f = Pn[l - 2], y = He(g, 7) ^ He(g, 18) ^ g >>> 3, w = He(f, 17) ^ He(f, 19) ^ f >>> 10;
      Pn[l] = w + Pn[l - 7] + y + Pn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = He(a, 6) ^ He(a, 11) ^ He(a, 25), f = h + g + mb(a, c, u) + Ab[l] + Pn[l] | 0, w = (He(r, 2) ^ He(r, 13) ^ He(r, 22)) + Sb(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    xo(Pn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), xo(this.buffer);
  }
}, Rd = class extends hl {
  constructor() {
    super(28), this.A = Nn[0] | 0, this.B = Nn[1] | 0, this.C = Nn[2] | 0, this.D = Nn[3] | 0, this.E = Nn[4] | 0, this.F = Nn[5] | 0, this.G = Nn[6] | 0, this.H = Nn[7] | 0;
  }
};
const $b = /* @__PURE__ */ Wo(() => new hl()), vb = /* @__PURE__ */ Wo(() => new Rd()), Ib = hl, Lb = $b, Cb = Rd, kb = vb, Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Cb,
  SHA256: Ib,
  sha224: kb,
  sha256: Lb
}, Symbol.toStringTag, { value: "Module" })), Xo = /* @__PURE__ */ Fo(Bb), Mb = /* @__PURE__ */ Fo(Hw);
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.joseToDer = Is.derToJose = void 0;
const Gd = xi, Vd = re;
function va(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Tb = {
  ES256: va(256),
  ES384: va(384),
  ES512: va(521)
};
function Kd(t) {
  const e = Tb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mo = 128, qd = 0, _b = 32, Ub = 16, Hb = 2, Wd = Ub | _b | qd << 6, So = Hb | qd << 6;
function Xd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Gd.toByteArray)((0, Vd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Nb(t, e) {
  const n = Xd(t), r = Kd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Wd)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (mo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== So)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== So)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, f = r - h, y = new Uint8Array(g + c + f + h);
  for (o = 0; o < g; ++o)
    y[o] = 0;
  y.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const w = o; o < w + f; ++o)
    y[o] = 0;
  return y.set(n.subarray(l + Math.max(-f, 0), l + h), o), (0, Vd.escape)((0, Gd.fromByteArray)(y));
}
Is.derToJose = Nb;
function Pu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mo && --r, r;
}
function Pb(t, e) {
  t = Xd(t);
  const n = Kd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Pu(t, 0, n), i = Pu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mo, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Wd, u ? h[l++] = c : (h[l++] = mo | 1, h[l++] = c & 255), h[l++] = So, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = So, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
Is.joseToDer = Pb;
var In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.InvalidTokenError = In.MissingParametersError = void 0;
class Ob extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
In.MissingParametersError = Ob;
class Db extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
In.InvalidTokenError = Db;
const Si = /* @__PURE__ */ Fo(bb);
Object.defineProperty(Ko, "__esModule", { value: !0 });
Ko.SECP256K1Client = void 0;
const Fb = Td, jb = Xo, oo = Mb, Ou = Is, Du = In, Fu = Si;
oo.utils.hmacSha256Sync = (t, ...e) => {
  const n = Fb.hmac.create(jb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Yd {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Fu.bytesToHex)(oo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Du.MissingParametersError("a signing input hash and private key are all required");
    const s = oo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Fu.bytesToHex)(s);
    if (r === "jose")
      return (0, Ou.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ou.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Du.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return oo.verify(n, e, r, { strict: !1 });
  }
}
Ko.SECP256K1Client = Yd;
Yd.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ko;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Vo);
var Br = {};
const zb = /* @__PURE__ */ Fo(rd);
var Rb = ie && ie.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.hashSha256Async = Br.hashSha256 = void 0;
const Gb = Xo;
function Zd(t) {
  return (0, Gb.sha256)(t);
}
Br.hashSha256 = Zd;
function Vb(t) {
  return Rb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = zb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Zd(t));
    }
  });
}
Br.hashSha256Async = Vb;
var Kb = ie && ie.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.TokenSigner = vs.createUnsecuredToken = void 0;
const Ja = re, ju = Vo, qb = In, zu = Br;
function tc(t, e) {
  const n = [], r = Ja.encode(JSON.stringify(e));
  n.push(r);
  const s = Ja.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Wb(t) {
  return tc(t, { typ: "JWT", alg: "none" }) + ".";
}
vs.createUnsecuredToken = Wb;
class Xb {
  constructor(e, n) {
    if (!(e && n))
      throw new qb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ju.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ju.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = tc(e, s), o = (0, zu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Kb(this, void 0, void 0, function* () {
      const s = this.header(r), i = tc(e, s), o = yield (0, zu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ja.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
vs.TokenSigner = Xb;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
Yo.TokenVerifier = void 0;
const Yb = re, Ru = Vo, Zb = In, Pi = Br;
class Qb {
  constructor(e, n) {
    if (!(e && n))
      throw new Zb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ru.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ru.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], i = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Pi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Pi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Yb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Pi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Pi.hashSha256)(r);
      return i(o);
    }
  }
}
Yo.TokenVerifier = Qb;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.decodeToken = void 0;
const Oi = re;
function Jb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Oi.decode(e[0])), r = JSON.parse(Oi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Oi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Oi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Zo.decodeToken = Jb;
(function(t) {
  var e = ie && ie.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ie && ie.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(vs, t), n(Yo, t), n(Zo, t), n(In, t), n(Vo, t);
})(Yt);
function t2(t) {
  return `did:btc-addr:${t}`;
}
function e2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Eu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Eu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Qd(t) {
  if (t)
    return e2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const n2 = "1.4.0";
function r2() {
  return F1();
}
function s2(t, e, n, r = qh.slice(), s, i = Py().getTime(), o = {}) {
  const a = (f) => {
    const y = Zc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${f}=undefined])`
    });
    return y == null ? void 0 : y.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Dy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: n2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Yt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = $d(u);
  return c.iss = t2(h), new Yt.TokenSigner("ES256k", t).sign(c);
}
async function Gu(t, e) {
  const n = wi(pt(e)), r = JSON.parse(n), s = await Cd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function i2(t) {
  const e = Yt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Yt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function o2(t) {
  const e = Yt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Qd(e.iss);
  if (n.length === 1) {
    if ($d(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function a2(t) {
  const e = Yt.decodeToken(t).payload;
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
function c2(t) {
  const e = Yt.decodeToken(t).payload;
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
function l2(t) {
  const e = [
    c2(t),
    a2(t),
    i2(t),
    o2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Vu = "1.0.0";
class ar {
  constructor(e) {
    this.version = Vu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Vu)
      throw new Va(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ar(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Jd {
  constructor(e) {
    if (e) {
      const n = new ar(e);
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
class Ku extends Jd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ar({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Wh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ar({})), !0;
  }
}
class qu extends Jd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Uy, !localStorage.getItem(this.key)) {
      const r = new ar({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Wh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ar.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ar({})), !0;
  }
}
var si;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(si || (si = {}));
var Eo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Eo || (Eo = {}));
si.Mainnet;
var $n;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($n || ($n = {}));
var nn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(nn || (nn = {}));
$n.Mainnet;
const t0 = {
  chainId: si.Mainnet,
  transactionVersion: $n.Mainnet,
  peerNetworkId: Eo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: nn.MainnetSingleSig,
    multiSig: nn.MainnetMultiSig
  },
  client: { baseUrl: Xh }
}, ec = {
  chainId: si.Testnet,
  transactionVersion: $n.Testnet,
  peerNetworkId: Eo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: nn.TestnetSingleSig,
    multiSig: nn.TestnetMultiSig
  },
  client: { baseUrl: Yh }
}, ao = {
  ...ec,
  addressVersion: { ...ec.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Zh }
}, u2 = {
  ...ao,
  addressVersion: { ...ao.addressVersion },
  client: { ...ao.client }
};
function f2(t) {
  switch (t) {
    case "mainnet":
      return t0;
    case "testnet":
      return ec;
    case "devnet":
      return ao;
    case "mocknet":
      return u2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function e0(t) {
  return typeof t == "string" ? f2(t) : t;
}
var Wu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Wu || (Wu = {}));
var Xu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Xu || (Xu = {}));
var Ne;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ne || (Ne = {}));
const Ia = ["onChainOnly", "offChainOnly", "any"];
Ia[0] + "", Ne.OnChainOnly, Ia[1] + "", Ne.OffChainOnly, Ia[2] + "", Ne.Any, Ne.OnChainOnly + "", Ne.OnChainOnly, Ne.OffChainOnly + "", Ne.OffChainOnly, Ne.Any + "", Ne.Any;
var Yu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Yu || (Yu = {}));
var Zu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Zu || (Zu = {}));
var Qu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Qu || (Qu = {}));
var En;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(En || (En = {}));
var Ju;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ju || (Ju = {}));
var tf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(tf || (tf = {}));
var ef;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ef || (ef = {}));
var nf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(nf || (nf = {}));
var rf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(rf || (rf = {}));
var sf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(sf || (sf = {}));
var of;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(of || (of = {}));
var af;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(af || (af = {}));
var cf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(cf || (cf = {}));
function nc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function n0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function d2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nc(t.outputLen), nc(t.blockLen);
}
function p2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function g2(t, e) {
  n0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const br = {
  number: nc,
  bool: h2,
  bytes: n0,
  hash: d2,
  exists: p2,
  output: g2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const La = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ye = (t, e) => t << 32 - e | t >>> e, y2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!y2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function w2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function dl(t) {
  if (typeof t == "string" && (t = w2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let r0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qr(t) {
  const e = (r) => t().update(dl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let s0 = class extends r0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, br.hash(e);
    const r = dl(n);
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
    return br.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    br.exists(this), br.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const i0 = (t, e, n) => new s0(t, e).update(n).digest();
i0.create = (t, e) => new s0(t, e);
function b2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let pl = class extends r0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = La(this.buffer);
  }
  update(e) {
    br.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = dl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = La(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    br.exists(this), br.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    b2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = La(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const x2 = (t, e, n) => t & e ^ ~t & n, m2 = (t, e, n) => t & e ^ t & n ^ e & n, S2 = new Uint32Array([
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
]), On = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Dn = new Uint32Array(64);
let o0 = class extends pl {
  constructor() {
    super(64, 32, 8, !1), this.A = On[0] | 0, this.B = On[1] | 0, this.C = On[2] | 0, this.D = On[3] | 0, this.E = On[4] | 0, this.F = On[5] | 0, this.G = On[6] | 0, this.H = On[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Dn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Dn[l - 15], f = Dn[l - 2], y = Ye(g, 7) ^ Ye(g, 18) ^ g >>> 3, w = Ye(f, 17) ^ Ye(f, 19) ^ f >>> 10;
      Dn[l] = w + Dn[l - 7] + y + Dn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ye(a, 6) ^ Ye(a, 11) ^ Ye(a, 25), f = h + g + x2(a, c, u) + S2[l] + Dn[l] | 0, w = (Ye(r, 2) ^ Ye(r, 13) ^ Ye(r, 22)) + m2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Dn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E2 = class extends o0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const a0 = qr(() => new o0());
qr(() => new E2());
var Wr = {}, gl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Si;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let f = o.length - 1; f >= 0; f--)
      if (u < 4) {
        const y = n.indexOf(o[f]) >> u;
        let w = 0;
        f !== 0 && (w = n.indexOf(o[f - 1]));
        const v = 1 + u, T = w % (1 << v) << 5 - v, _ = t.c32[y + T];
        u = v, c.unshift(_);
      } else
        u = 0;
    let h = 0;
    for (let f = 0; f < c.length && c[f] === "0"; f++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let f = 0; f < g; f++)
      c.unshift(t.c32[0]);
    if (a) {
      const f = a - c.length;
      for (let y = 0; y < f; y++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, a) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (h.unshift(n[l]), g = 0, l = 0);
      const T = (t.c32.indexOf(o[w]) << g) + l, _ = n[T % 16];
      if (g += 1, l = T >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      h.unshift(_);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let f = 0;
    for (let w = 0; w < h.length && h[w] === "0"; w++)
      f++;
    h = h.slice(f - f % 2);
    let y = h.join("");
    for (let w = 0; w < u; w++)
      y = `00${y}`;
    if (a) {
      const w = a * 2 - y.length;
      for (let v = 0; v < w; v += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(gl);
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.c32checkDecode = Mr.c32checkEncode = void 0;
const lf = Xo, uf = Si, Qs = gl;
function c0(t) {
  const e = (0, lf.sha256)((0, lf.sha256)((0, uf.hexToBytes)(t)));
  return (0, uf.bytesToHex)(e.slice(0, 4));
}
function A2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = c0(`${n}${e}`), s = (0, Qs.c32encode)(`${e}${r}`);
  return `${Qs.c32[t]}${s}`;
}
Mr.c32checkEncode = A2;
function $2(t) {
  t = (0, Qs.c32normalize)(t);
  const e = (0, Qs.c32decode)(t.slice(1)), n = t[0], r = Qs.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), c0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Mr.c32checkDecode = $2;
var l0 = {}, Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.decode = Ls.encode = void 0;
const Ao = Xo, ff = Si, u0 = xd, f0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function v2(t, e = "00") {
  const n = typeof t == "string" ? (0, ff.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ff.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ao.sha256)((0, Ao.sha256)(new Uint8Array([...r, ...n])));
  return u0(f0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Ls.encode = v2;
function I2(t) {
  const e = u0(f0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ao.sha256)((0, Ao.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Ls.decode = I2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Mr, n = Ls, r = Si;
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
  function o(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
  }
  t.c32address = o;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = a;
  function c(h, l = -1) {
    const g = n.decode(h), f = (0, r.bytesToHex)(g.data), y = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = l, o(w, f);
  }
  t.b58ToC32 = c;
  function u(h, l = -1) {
    const g = a(h), f = g[0], y = g[1];
    let w;
    l < 0 ? (w = f, i[f] !== void 0 && (w = i[f])) : w = l;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(y, v);
  }
  t.c32ToB58 = u;
})(l0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = gl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Mr;
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
})(Wr);
function L2(t, e) {
  switch (e = e0(e ?? t0), t) {
    case En.P2PKH:
      switch (e.transactionVersion) {
        case $n.Mainnet:
          return nn.MainnetSingleSig;
        case $n.Testnet:
          return nn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case En.P2SH:
    case En.P2SHNonSequential:
    case En.P2WPKH:
    case En.P2WSH:
    case En.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case $n.Mainnet:
          return nn.MainnetMultiSig;
        case $n.Testnet:
          return nn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const C2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), h0 = Uint8Array.from({ length: 16 }, (t, e) => e), k2 = h0.map((t) => (9 * t + 5) % 16);
let yl = [h0], wl = [k2];
for (let t = 0; t < 4; t++)
  for (let e of [yl, wl])
    e.push(e[t].map((n) => C2[n]));
const d0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), B2 = yl.map((t, e) => t.map((n) => d0[e][n])), M2 = wl.map((t, e) => t.map((n) => d0[e][n])), T2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Di = (t, e) => t << e | t >>> 32 - e;
function hf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Fi = new Uint32Array(16);
let U2 = class extends pl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Fi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T2[f], v = _2[f], T = yl[f], _ = wl[f], b = B2[f], I = M2[f];
      for (let A = 0; A < 16; A++) {
        const P = Di(r + hf(f, i, a, u) + Fi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Di(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Di(s + hf(y, o, c, h) + Fi[_[A]] + v, I[A]) + g | 0;
        s = g, g = h, h = Di(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const H2 = qr(() => new U2()), ji = BigInt(2 ** 32 - 1), rc = BigInt(32);
function p0(t, e = !1) {
  return e ? { h: Number(t & ji), l: Number(t >> rc & ji) } : { h: Number(t >> rc & ji) | 0, l: Number(t & ji) | 0 };
}
function N2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = p0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const P2 = (t, e) => BigInt(t >>> 0) << rc | BigInt(e >>> 0), O2 = (t, e, n) => t >>> n, D2 = (t, e, n) => t << 32 - n | e >>> n, F2 = (t, e, n) => t >>> n | e << 32 - n, j2 = (t, e, n) => t << 32 - n | e >>> n, z2 = (t, e, n) => t << 64 - n | e >>> n - 32, R2 = (t, e, n) => t >>> n - 32 | e << 64 - n, G2 = (t, e) => e, V2 = (t, e) => t, K2 = (t, e, n) => t << n | e >>> 32 - n, q2 = (t, e, n) => e << n | t >>> 32 - n, W2 = (t, e, n) => e << n - 32 | t >>> 64 - n, X2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Y2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Z2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Q2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, J2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), tx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ex = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), nx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
  fromBig: p0,
  split: N2,
  toBig: P2,
  shrSH: O2,
  shrSL: D2,
  rotrSH: F2,
  rotrSL: j2,
  rotrBH: z2,
  rotrBL: R2,
  rotr32H: G2,
  rotr32L: V2,
  rotlSH: K2,
  rotlSL: q2,
  rotlBH: W2,
  rotlBL: X2,
  add: Y2,
  add3L: Z2,
  add3H: Q2,
  add4L: J2,
  add4H: tx,
  add5H: nx,
  add5L: ex
}, [rx, sx] = nt.split([
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
].map((t) => BigInt(t))), Fn = new Uint32Array(80), jn = new Uint32Array(80);
let Qo = class extends pl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Fn[b] = e.getUint32(n), jn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Fn[b - 15] | 0, A = jn[b - 15] | 0, P = nt.rotrSH(I, A, 1) ^ nt.rotrSH(I, A, 8) ^ nt.shrSH(I, A, 7), K = nt.rotrSL(I, A, 1) ^ nt.rotrSL(I, A, 8) ^ nt.shrSL(I, A, 7), O = Fn[b - 2] | 0, R = jn[b - 2] | 0, x = nt.rotrSH(O, R, 19) ^ nt.rotrBH(O, R, 61) ^ nt.shrSH(O, R, 6), L = nt.rotrSL(O, R, 19) ^ nt.rotrBL(O, R, 61) ^ nt.shrSL(O, R, 6), H = nt.add4L(K, L, jn[b - 7], jn[b - 16]), q = nt.add4H(H, P, x, Fn[b - 7], Fn[b - 16]);
      Fn[b] = q | 0, jn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: v, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = nt.rotrSH(l, g, 14) ^ nt.rotrSH(l, g, 18) ^ nt.rotrBH(l, g, 41), A = nt.rotrSL(l, g, 14) ^ nt.rotrSL(l, g, 18) ^ nt.rotrBL(l, g, 41), P = l & f ^ ~l & w, K = g & y ^ ~g & v, O = nt.add5L(_, A, K, sx[b], jn[b]), R = nt.add5H(O, T, I, P, rx[b], Fn[b]), x = O | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), H = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = v | 0, w = f | 0, v = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = nt.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = nt.add3L(x, H, Y);
      r = nt.add3H(z, R, L, q), s = z | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = nt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = nt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: v } = nt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: T, l: _ } = nt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, v, T, _);
  }
  roundClean() {
    Fn.fill(0), jn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ix = class extends Qo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ox = class extends Qo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ax = class extends Qo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
qr(() => new Qo());
qr(() => new ix());
qr(() => new ox());
qr(() => new ax());
var $o = { exports: {} };
$o.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", f = "[object Number]", y = "[object Object]", w = "[object Promise]", v = "[object RegExp]", T = "[object Set]", _ = "[object String]", b = "[object Symbol]", I = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", K = "[object Float32Array]", O = "[object Float64Array]", R = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", H = "[object Uint8Array]", q = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", z = "[object Uint32Array]", ee = /[\\^$.*+?()[\]{}|]/g, Vt = /\w*$/, Zt = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, k = {};
  k[i] = k[o] = k[A] = k[P] = k[a] = k[c] = k[K] = k[O] = k[R] = k[x] = k[L] = k[g] = k[f] = k[y] = k[v] = k[T] = k[_] = k[b] = k[H] = k[q] = k[Y] = k[z] = !0, k[u] = k[h] = k[I] = !1;
  var Q = typeof ie == "object" && ie && ie.Object === Object && ie, gt = typeof self == "object" && self && self.Object === Object && self, ht = Q || gt || Function("return this")(), St = e && !e.nodeType && e, ae = St && !0 && t && !t.nodeType && t, fn = ae && ae.exports === St;
  function kn(p, E) {
    return p.set(E[0], E[1]), p;
  }
  function Jr(p, E) {
    return p.add(E), p;
  }
  function qt(p, E) {
    for (var C = -1, W = p ? p.length : 0; ++C < W && E(p[C], C, p) !== !1; )
      ;
    return p;
  }
  function $e(p, E) {
    for (var C = -1, W = E.length, Xt = p.length; ++C < W; )
      p[Xt + C] = E[C];
    return p;
  }
  function hn(p, E, C, W) {
    for (var Xt = -1, le = p ? p.length : 0; ++Xt < le; )
      C = E(C, p[Xt], Xt, p);
    return C;
  }
  function ts(p, E) {
    for (var C = -1, W = Array(p); ++C < p; )
      W[C] = E(C);
    return W;
  }
  function dn(p, E) {
    return p == null ? void 0 : p[E];
  }
  function d(p) {
    var E = !1;
    if (p != null && typeof p.toString != "function")
      try {
        E = !!(p + "");
      } catch {
      }
    return E;
  }
  function $(p) {
    var E = -1, C = Array(p.size);
    return p.forEach(function(W, Xt) {
      C[++E] = [Xt, W];
    }), C;
  }
  function M(p, E) {
    return function(C) {
      return p(E(C));
    };
  }
  function N(p) {
    var E = -1, C = Array(p.size);
    return p.forEach(function(W) {
      C[++E] = W;
    }), C;
  }
  var tt = Array.prototype, Lt = Function.prototype, Qt = Object.prototype, zt = ht["__core-js_shared__"], ve = function() {
    var p = /[^.]+$/.exec(zt && zt.keys && zt.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), pn = Lt.toString, Rt = Qt.hasOwnProperty, Te = Qt.toString, ce = RegExp(
    "^" + pn.call(Rt).replace(ee, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), fr = fn ? ht.Buffer : void 0, Re = ht.Symbol, ot = ht.Uint8Array, xt = M(Object.getPrototypeOf, Object), jt = Object.create, pe = Qt.propertyIsEnumerable, gn = tt.splice, Bn = Object.getOwnPropertySymbols, es = fr ? fr.isBuffer : void 0, Ut = M(Object.keys, Object), hr = ss(ht, "DataView"), Ge = ss(ht, "Map"), _e = ss(ht, "Promise"), yn = ss(ht, "Set"), Ve = ss(ht, "WeakMap"), Ke = ss(Object, "create"), D = pr(hr), vt = pr(Ge), Ue = pr(_e), Rs = pr(yn), pa = pr(Ve), m = Re ? Re.prototype : void 0, B = m ? m.valueOf : void 0;
  function G(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function yt() {
    this.__data__ = Ke ? Ke(null) : {};
  }
  function V(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Et(p) {
    var E = this.__data__;
    if (Ke) {
      var C = E[p];
      return C === r ? void 0 : C;
    }
    return Rt.call(E, p) ? E[p] : void 0;
  }
  function ut(p) {
    var E = this.__data__;
    return Ke ? E[p] !== void 0 : Rt.call(E, p);
  }
  function Ct(p, E) {
    var C = this.__data__;
    return C[p] = Ke && E === void 0 ? r : E, this;
  }
  G.prototype.clear = yt, G.prototype.delete = V, G.prototype.get = Et, G.prototype.has = ut, G.prototype.set = Ct;
  function Wt(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function qe() {
    this.__data__ = [];
  }
  function wn(p) {
    var E = this.__data__, C = vi(E, p);
    if (C < 0)
      return !1;
    var W = E.length - 1;
    return C == W ? E.pop() : gn.call(E, C, 1), !0;
  }
  function ge(p) {
    var E = this.__data__, C = vi(E, p);
    return C < 0 ? void 0 : E[C][1];
  }
  function We(p) {
    return vi(this.__data__, p) > -1;
  }
  function xg(p, E) {
    var C = this.__data__, W = vi(C, p);
    return W < 0 ? C.push([p, E]) : C[W][1] = E, this;
  }
  Wt.prototype.clear = qe, Wt.prototype.delete = wn, Wt.prototype.get = ge, Wt.prototype.has = We, Wt.prototype.set = xg;
  function ns(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function mg() {
    this.__data__ = {
      hash: new G(),
      map: new (Ge || Wt)(),
      string: new G()
    };
  }
  function Sg(p) {
    return Ii(this, p).delete(p);
  }
  function Eg(p) {
    return Ii(this, p).get(p);
  }
  function Ag(p) {
    return Ii(this, p).has(p);
  }
  function $g(p, E) {
    return Ii(this, p).set(p, E), this;
  }
  ns.prototype.clear = mg, ns.prototype.delete = Sg, ns.prototype.get = Eg, ns.prototype.has = Ag, ns.prototype.set = $g;
  function rs(p) {
    this.__data__ = new Wt(p);
  }
  function vg() {
    this.__data__ = new Wt();
  }
  function Ig(p) {
    return this.__data__.delete(p);
  }
  function Lg(p) {
    return this.__data__.get(p);
  }
  function Cg(p) {
    return this.__data__.has(p);
  }
  function kg(p, E) {
    var C = this.__data__;
    if (C instanceof Wt) {
      var W = C.__data__;
      if (!Ge || W.length < n - 1)
        return W.push([p, E]), this;
      C = this.__data__ = new ns(W);
    }
    return C.set(p, E), this;
  }
  rs.prototype.clear = vg, rs.prototype.delete = Ig, rs.prototype.get = Lg, rs.prototype.has = Cg, rs.prototype.set = kg;
  function Bg(p, E) {
    var C = wa(p) || ty(p) ? ts(p.length, String) : [], W = C.length, Xt = !!W;
    for (var le in p)
      Rt.call(p, le) && !(Xt && (le == "length" || Yg(le, W))) && C.push(le);
    return C;
  }
  function cu(p, E, C) {
    var W = p[E];
    (!(Rt.call(p, E) && hu(W, C)) || C === void 0 && !(E in p)) && (p[E] = C);
  }
  function vi(p, E) {
    for (var C = p.length; C--; )
      if (hu(p[C][0], E))
        return C;
    return -1;
  }
  function Mg(p, E) {
    return p && lu(E, ba(E), p);
  }
  function ga(p, E, C, W, Xt, le, bn) {
    var ue;
    if (W && (ue = le ? W(p, Xt, le, bn) : W(p)), ue !== void 0)
      return ue;
    if (!Li(p))
      return p;
    var gu = wa(p);
    if (gu) {
      if (ue = qg(p), !E)
        return Gg(p, ue);
    } else {
      var is = dr(p), yu = is == h || is == l;
      if (ny(p))
        return Pg(p, E);
      if (is == y || is == i || yu && !le) {
        if (d(p))
          return le ? p : {};
        if (ue = Wg(yu ? {} : p), !E)
          return Vg(p, Mg(ue, p));
      } else {
        if (!k[is])
          return le ? p : {};
        ue = Xg(p, is, ga, E);
      }
    }
    bn || (bn = new rs());
    var wu = bn.get(p);
    if (wu)
      return wu;
    if (bn.set(p, ue), !gu)
      var bu = C ? Kg(p) : ba(p);
    return qt(bu || p, function(xa, Ci) {
      bu && (Ci = xa, xa = p[Ci]), cu(ue, Ci, ga(xa, E, C, W, Ci, p, bn));
    }), ue;
  }
  function Tg(p) {
    return Li(p) ? jt(p) : {};
  }
  function _g(p, E, C) {
    var W = E(p);
    return wa(p) ? W : $e(W, C(p));
  }
  function Ug(p) {
    return Te.call(p);
  }
  function Hg(p) {
    if (!Li(p) || Qg(p))
      return !1;
    var E = pu(p) || d(p) ? ce : Zt;
    return E.test(pr(p));
  }
  function Ng(p) {
    if (!fu(p))
      return Ut(p);
    var E = [];
    for (var C in Object(p))
      Rt.call(p, C) && C != "constructor" && E.push(C);
    return E;
  }
  function Pg(p, E) {
    if (E)
      return p.slice();
    var C = new p.constructor(p.length);
    return p.copy(C), C;
  }
  function ya(p) {
    var E = new p.constructor(p.byteLength);
    return new ot(E).set(new ot(p)), E;
  }
  function Og(p, E) {
    var C = E ? ya(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.byteLength);
  }
  function Dg(p, E, C) {
    var W = E ? C($(p), !0) : $(p);
    return hn(W, kn, new p.constructor());
  }
  function Fg(p) {
    var E = new p.constructor(p.source, Vt.exec(p));
    return E.lastIndex = p.lastIndex, E;
  }
  function jg(p, E, C) {
    var W = E ? C(N(p), !0) : N(p);
    return hn(W, Jr, new p.constructor());
  }
  function zg(p) {
    return B ? Object(B.call(p)) : {};
  }
  function Rg(p, E) {
    var C = E ? ya(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.length);
  }
  function Gg(p, E) {
    var C = -1, W = p.length;
    for (E || (E = Array(W)); ++C < W; )
      E[C] = p[C];
    return E;
  }
  function lu(p, E, C, W) {
    C || (C = {});
    for (var Xt = -1, le = E.length; ++Xt < le; ) {
      var bn = E[Xt], ue = void 0;
      cu(C, bn, ue === void 0 ? p[bn] : ue);
    }
    return C;
  }
  function Vg(p, E) {
    return lu(p, uu(p), E);
  }
  function Kg(p) {
    return _g(p, ba, uu);
  }
  function Ii(p, E) {
    var C = p.__data__;
    return Zg(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function ss(p, E) {
    var C = dn(p, E);
    return Hg(C) ? C : void 0;
  }
  var uu = Bn ? M(Bn, Object) : iy, dr = Ug;
  (hr && dr(new hr(new ArrayBuffer(1))) != P || Ge && dr(new Ge()) != g || _e && dr(_e.resolve()) != w || yn && dr(new yn()) != T || Ve && dr(new Ve()) != I) && (dr = function(p) {
    var E = Te.call(p), C = E == y ? p.constructor : void 0, W = C ? pr(C) : void 0;
    if (W)
      switch (W) {
        case D:
          return P;
        case vt:
          return g;
        case Ue:
          return w;
        case Rs:
          return T;
        case pa:
          return I;
      }
    return E;
  });
  function qg(p) {
    var E = p.length, C = p.constructor(E);
    return E && typeof p[0] == "string" && Rt.call(p, "index") && (C.index = p.index, C.input = p.input), C;
  }
  function Wg(p) {
    return typeof p.constructor == "function" && !fu(p) ? Tg(xt(p)) : {};
  }
  function Xg(p, E, C, W) {
    var Xt = p.constructor;
    switch (E) {
      case A:
        return ya(p);
      case a:
      case c:
        return new Xt(+p);
      case P:
        return Og(p, W);
      case K:
      case O:
      case R:
      case x:
      case L:
      case H:
      case q:
      case Y:
      case z:
        return Rg(p, W);
      case g:
        return Dg(p, W, C);
      case f:
      case _:
        return new Xt(p);
      case v:
        return Fg(p);
      case T:
        return jg(p, W, C);
      case b:
        return zg(p);
    }
  }
  function Yg(p, E) {
    return E = E ?? s, !!E && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < E;
  }
  function Zg(p) {
    var E = typeof p;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? p !== "__proto__" : p === null;
  }
  function Qg(p) {
    return !!ve && ve in p;
  }
  function fu(p) {
    var E = p && p.constructor, C = typeof E == "function" && E.prototype || Qt;
    return p === C;
  }
  function pr(p) {
    if (p != null) {
      try {
        return pn.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Jg(p) {
    return ga(p, !0, !0);
  }
  function hu(p, E) {
    return p === E || p !== p && E !== E;
  }
  function ty(p) {
    return ey(p) && Rt.call(p, "callee") && (!pe.call(p, "callee") || Te.call(p) == i);
  }
  var wa = Array.isArray;
  function du(p) {
    return p != null && ry(p.length) && !pu(p);
  }
  function ey(p) {
    return sy(p) && du(p);
  }
  var ny = es || oy;
  function pu(p) {
    var E = Li(p) ? Te.call(p) : "";
    return E == h || E == l;
  }
  function ry(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Li(p) {
    var E = typeof p;
    return !!p && (E == "object" || E == "function");
  }
  function sy(p) {
    return !!p && typeof p == "object";
  }
  function ba(p) {
    return du(p) ? Bg(p) : Ng(p);
  }
  function iy() {
    return [];
  }
  function oy() {
    return !1;
  }
  t.exports = Jg;
})($o, $o.exports);
var cx = $o.exports;
const g0 = /* @__PURE__ */ zh(cx);
var sc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(sc || (sc = {}));
function lx(t, e) {
  return { type: sc.Address, version: t, hash160: e };
}
function ux(t) {
  return Wr.c32address(t.version, t.hash160);
}
const fx = (t) => H2(a0(t)), hx = (t) => Z(fx(t));
Pt.hmacSha256Sync = (t, ...e) => {
  const n = i0.create(a0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function dx(t, e = "mainnet") {
  e = e0(e), t = typeof t == "string" ? pt(t) : t;
  const n = L2(En.P2PKH, e), r = lx(n, hx(t));
  return ux(r);
}
function px(t, e) {
  const n = Yt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = dx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Yt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function gx(t, e = null) {
  let n;
  e ? n = px(t, e) : n = Yt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const df = "_blockstackDidCheckEchoReply", yx = "echoReply", wx = "authContinuation";
function bx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function xx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[df];
  if (typeof e == "boolean")
    return e;
  const n = bx(t.location.search), r = n[yx];
  if (r) {
    t[df] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[wx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class ic {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Qh();
    else
      throw new Ny("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new qu(e.sessionOptions) : this.store = new qu() : e ? this.store = new Ku(e.sessionOptions) : this.store = new Ku();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Oy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Va("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, s2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = r2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Zc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (xx())
        return fs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      fs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = aw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ki("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Yt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await l2(e))
      throw new ki("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Sa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Gu(s, i.private_key);
          } catch {
            if (fs.warn("Failed decryption of appPrivateKey, will try to use as given"), !Pt.isValidPrivateKey(i.private_key))
              throw new ki("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Gu(s, c);
          } catch {
            fs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ki("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Yy, h;
    Sa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Sa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Qd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, g = i.profile_url;
    if (!l.profile && g) {
      const f = await n(g);
      if (!f.ok)
        l.profile = Object.assign({}, _y);
      else {
        const y = await f.text(), w = JSON.parse(y);
        l.profile = gx(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Va("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Z1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
ic.prototype.makeAuthRequest = ic.prototype.makeAuthRequestToken;
const mx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Sx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = mx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Jo(r.id));
  return e.concat(n);
}, Jo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), y0 = "STX_PROVIDER", Tr = () => typeof window > "u" ? null : window.localStorage.getItem(y0), Ex = (t) => {
  typeof window < "u" && window.localStorage.setItem(y0, t);
}, Ax = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function $x(t, e) {
  const n = {};
  return Object.assign(n, Ax, e), await fetch(t, n);
}
function vx(t) {
  let e = $x, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ix(...t) {
  const { fetchLib: e, middlewares: n } = vx(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
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
var Cs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Cs || (Cs = {}));
var _r;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_r || (_r = {}));
var pf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(pf || (pf = {}));
const Lx = "https://api.mainnet.hiro.so", Cx = "https://api.testnet.hiro.so", kx = "http://localhost:3999", Bx = ["mainnet", "testnet", "devnet", "mocknet"];
class Ur {
  constructor(e) {
    this.version = _r.Mainnet, this.chainId = Cs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === _r.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ix();
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
Ur.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new oc();
    case "testnet":
      return new ac();
    case "devnet":
      return new Mx();
    case "mocknet":
      return new w0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Bx.join(", ")}`);
  }
};
Ur.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ur.fromName(t);
class oc extends Ur {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = _r.Mainnet, this.chainId = Cs.Mainnet;
  }
}
class ac extends Ur {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = _r.Testnet, this.chainId = Cs.Testnet;
  }
}
class w0 extends Ur {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = _r.Testnet, this.chainId = Cs.Testnet;
  }
}
const Mx = w0;
var Hr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Hr || (Hr = {}));
var vo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vo || (vo = {}));
Hr.Mainnet;
var Nr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Nr || (Nr = {}));
var Pr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pr || (Pr = {}));
Nr.Mainnet;
const Tx = {
  chainId: Hr.Mainnet,
  transactionVersion: Nr.Mainnet,
  peerNetworkId: vo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Pr.MainnetSingleSig,
    multiSig: Pr.MainnetMultiSig
  },
  client: { baseUrl: Xh }
}, cc = {
  chainId: Hr.Testnet,
  transactionVersion: Nr.Testnet,
  peerNetworkId: vo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Pr.TestnetSingleSig,
    multiSig: Pr.TestnetMultiSig
  },
  client: { baseUrl: Yh }
}, co = {
  ...cc,
  addressVersion: { ...cc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Zh }
}, _x = {
  ...co,
  addressVersion: { ...co.addressVersion },
  client: { ...co.client }
};
function Ux(t) {
  switch (t) {
    case "mainnet":
      return Tx;
    case "testnet":
      return cc;
    case "devnet":
      return co;
    case "mocknet":
      return _x;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Hx(t) {
  return typeof t == "string" ? Ux(t) : t;
}
function Nx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const gf = /* @__PURE__ */ new Map();
function b0(t, e) {
  const n = gf.get(t);
  if (n !== void 0)
    return n(e);
  const r = Nx(t);
  return gf.set(t, r), b0(t, e);
}
let It = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? pt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return rw(this.readBytes(4), 0);
  }
  readUInt8() {
    return ew(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Jy(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Z(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Z(n);
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
    if (b0(e, r))
      return r;
    throw n(r);
  }
};
const Px = 128, Ox = 128, x0 = 16, Ar = 32, lc = 80, ta = 65, Dx = 32, Fx = 64, Io = 34, jx = 1 + 16 * 1024 * 1024, zx = 165, Rx = 16, Gx = 16, Vx = 20, Kx = Gx + 2 + Vx, qx = Kx + 4, Wx = jx + (zx + Rx * qx);
var bt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(bt || (bt = {}));
var uc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(uc || (uc = {}));
var we;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(we || (we = {}));
const Ca = ["onChainOnly", "offChainOnly", "any"];
Ca[0] + "", we.OnChainOnly, Ca[1] + "", we.OffChainOnly, Ca[2] + "", we.Any, we.OnChainOnly + "", we.OnChainOnly, we.OffChainOnly + "", we.OffChainOnly, we.Any + "", we.Any;
var Lo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Lo || (Lo = {}));
var kt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kt || (kt = {}));
var Ht;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ht || (Ht = {}));
var At;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(At || (At = {}));
var Tt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Tt || (Tt = {}));
var Js;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Js || (Js = {}));
var fc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(fc || (fc = {}));
var hc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(hc || (hc = {}));
var se;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(se || (se = {}));
var yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yf || (yf = {}));
var dc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(dc || (dc = {}));
var Oe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Oe || (Oe = {}));
var wf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(wf || (wf = {}));
let ea = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, hs = class extends ea {
  constructor(e) {
    super(e);
  }
}, ne = class extends ea {
  constructor(e) {
    super(e);
  }
}, Co = class extends ea {
  constructor(e) {
    super(e);
  }
}, xr = class extends ea {
  constructor(e) {
    super(e);
  }
};
function pc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function m0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Yx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pc(t.outputLen), pc(t.blockLen);
}
function Zx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qx(t, e) {
  m0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const mr = {
  number: pc,
  bool: Xx,
  bytes: m0,
  hash: Yx,
  exists: Zx,
  output: Qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ka = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ze = (t, e) => t << 32 - e | t >>> e, Jx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Jx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bl(t) {
  if (typeof t == "string" && (t = tm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let S0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xr(t) {
  const e = (r) => t().update(bl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let E0 = class extends S0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, mr.hash(e);
    const r = bl(n);
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
    return mr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    mr.exists(this), mr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const A0 = (t, e, n) => new E0(t, e).update(n).digest();
A0.create = (t, e) => new E0(t, e);
function em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xl = class extends S0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ka(this.buffer);
  }
  update(e) {
    mr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ka(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    mr.exists(this), mr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    em(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ka(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const nm = (t, e, n) => t & e ^ ~t & n, rm = (t, e, n) => t & e ^ t & n ^ e & n, sm = new Uint32Array([
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
]), zn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rn = new Uint32Array(64);
let $0 = class extends xl {
  constructor() {
    super(64, 32, 8, !1), this.A = zn[0] | 0, this.B = zn[1] | 0, this.C = zn[2] | 0, this.D = zn[3] | 0, this.E = zn[4] | 0, this.F = zn[5] | 0, this.G = zn[6] | 0, this.H = zn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Rn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Rn[l - 15], f = Rn[l - 2], y = Ze(g, 7) ^ Ze(g, 18) ^ g >>> 3, w = Ze(f, 17) ^ Ze(f, 19) ^ f >>> 10;
      Rn[l] = w + Rn[l - 7] + y + Rn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ze(a, 6) ^ Ze(a, 11) ^ Ze(a, 25), f = h + g + nm(a, c, u) + sm[l] + Rn[l] | 0, w = (Ze(r, 2) ^ Ze(r, 13) ^ Ze(r, 22)) + rm(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Rn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, im = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ml = Xr(() => new $0());
Xr(() => new im());
const om = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), v0 = Uint8Array.from({ length: 16 }, (t, e) => e), am = v0.map((t) => (9 * t + 5) % 16);
let Sl = [v0], El = [am];
for (let t = 0; t < 4; t++)
  for (let e of [Sl, El])
    e.push(e[t].map((n) => om[n]));
const I0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cm = Sl.map((t, e) => t.map((n) => I0[e][n])), lm = El.map((t, e) => t.map((n) => I0[e][n])), um = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zi = (t, e) => t << e | t >>> 32 - e;
function bf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ri = new Uint32Array(16);
let hm = class extends xl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Ri[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = um[f], v = fm[f], T = Sl[f], _ = El[f], b = cm[f], I = lm[f];
      for (let A = 0; A < 16; A++) {
        const P = zi(r + bf(f, i, a, u) + Ri[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = zi(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = zi(s + bf(y, o, c, h) + Ri[_[A]] + v, I[A]) + g | 0;
        s = g, g = h, h = zi(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ri.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const dm = Xr(() => new hm()), Gi = BigInt(2 ** 32 - 1), gc = BigInt(32);
function L0(t, e = !1) {
  return e ? { h: Number(t & Gi), l: Number(t >> gc & Gi) } : { h: Number(t >> gc & Gi) | 0, l: Number(t & Gi) | 0 };
}
function pm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = L0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const gm = (t, e) => BigInt(t >>> 0) << gc | BigInt(e >>> 0), ym = (t, e, n) => t >>> n, wm = (t, e, n) => t << 32 - n | e >>> n, bm = (t, e, n) => t >>> n | e << 32 - n, xm = (t, e, n) => t << 32 - n | e >>> n, mm = (t, e, n) => t << 64 - n | e >>> n - 32, Sm = (t, e, n) => t >>> n - 32 | e << 64 - n, Em = (t, e) => e, Am = (t, e) => t, $m = (t, e, n) => t << n | e >>> 32 - n, vm = (t, e, n) => e << n | t >>> 32 - n, Im = (t, e, n) => e << n - 32 | t >>> 64 - n, Lm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Cm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const km = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Tm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _m = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Um = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
  fromBig: L0,
  split: pm,
  toBig: gm,
  shrSH: ym,
  shrSL: wm,
  rotrSH: bm,
  rotrSL: xm,
  rotrBH: mm,
  rotrBL: Sm,
  rotr32H: Em,
  rotr32L: Am,
  rotlSH: $m,
  rotlSL: vm,
  rotlBH: Im,
  rotlBL: Lm,
  add: Cm,
  add3L: km,
  add3H: Bm,
  add4L: Mm,
  add4H: Tm,
  add5H: Um,
  add5L: _m
}, [Hm, Nm] = rt.split([
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
].map((t) => BigInt(t))), Gn = new Uint32Array(80), Vn = new Uint32Array(80);
let na = class extends xl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Gn[b] = e.getUint32(n), Vn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Gn[b - 15] | 0, A = Vn[b - 15] | 0, P = rt.rotrSH(I, A, 1) ^ rt.rotrSH(I, A, 8) ^ rt.shrSH(I, A, 7), K = rt.rotrSL(I, A, 1) ^ rt.rotrSL(I, A, 8) ^ rt.shrSL(I, A, 7), O = Gn[b - 2] | 0, R = Vn[b - 2] | 0, x = rt.rotrSH(O, R, 19) ^ rt.rotrBH(O, R, 61) ^ rt.shrSH(O, R, 6), L = rt.rotrSL(O, R, 19) ^ rt.rotrBL(O, R, 61) ^ rt.shrSL(O, R, 6), H = rt.add4L(K, L, Vn[b - 7], Vn[b - 16]), q = rt.add4H(H, P, x, Gn[b - 7], Gn[b - 16]);
      Gn[b] = q | 0, Vn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: v, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = rt.rotrSH(l, g, 14) ^ rt.rotrSH(l, g, 18) ^ rt.rotrBH(l, g, 41), A = rt.rotrSL(l, g, 14) ^ rt.rotrSL(l, g, 18) ^ rt.rotrBL(l, g, 41), P = l & f ^ ~l & w, K = g & y ^ ~g & v, O = rt.add5L(_, A, K, Nm[b], Vn[b]), R = rt.add5H(O, T, I, P, Hm[b], Gn[b]), x = O | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), H = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = v | 0, w = f | 0, v = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = rt.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = rt.add3L(x, H, Y);
      r = rt.add3H(z, R, L, q), s = z | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = rt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = rt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: v } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: T, l: _ } = rt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, v, T, _);
  }
  roundClean() {
    Gn.fill(0), Vn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Pm = class extends na {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Om = class extends na {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Dm = class extends na {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Xr(() => new na());
Xr(() => new Pm());
const Fm = Xr(() => new Om());
Xr(() => new Dm());
var ft;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ft || (ft = {}));
var Gt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Gt || (Gt = {}));
function Al(t) {
  return Gt[t];
}
const jm = () => ({ type: ft.BoolTrue }), zm = () => ({ type: ft.BoolFalse }), Rm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ft.Buffer, value: Z(t) };
}, xf = BigInt("0xffffffffffffffffffffffffffffffff"), Gm = BigInt(0), mf = BigInt("0x7fffffffffffffffffffffffffffffff"), Sf = BigInt("-170141183460469231731687303715884105728"), Vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = qa(pt(t))), de(t, Uint8Array) && (t = qa(t));
  const e = te(t);
  if (e > mf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${mf}`);
  if (e < Sf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Sf}`);
  return { type: ft.Int, value: e };
}, Km = (t) => {
  const e = te(t);
  if (e < Gm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > xf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${xf}`);
  return { type: ft.UInt, value: e };
};
function qm(t) {
  return { type: ft.List, value: t };
}
function C0() {
  return { type: ft.OptionalNone };
}
function k0(t) {
  return { type: ft.OptionalSome, value: t };
}
var j;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(j || (j = {}));
function Wm() {
  return {
    type: j.Address,
    version: Pr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ef(t) {
  if (t && O0(t, Io))
    throw new Error(`Memo exceeds maximum length of ${Io} bytes`);
  return { type: j.MemoString, content: t };
}
function $l(t, e) {
  return {
    type: j.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function yc(t) {
  if (pt(t).byteLength != ta)
    throw Error("Invalid signature");
  return {
    type: j.MessageSignature,
    data: t
  };
}
function Xm(t, e, n) {
  return typeof t == "string" && (t = fS(t)), typeof n == "string" && (n = Ef(n)), {
    type: j.Payload,
    payloadType: bt.TokenTransfer,
    recipient: t,
    amount: te(e),
    memo: n ?? Ef("")
  };
}
function Ym(t, e, n, r) {
  return typeof e == "string" && (e = je(e)), typeof n == "string" && (n = je(n)), {
    type: j.Payload,
    payloadType: bt.ContractCall,
    contractAddress: typeof t == "string" ? ur(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Zm(t) {
  return je(t, 4, 1e5);
}
function Af(t, e, n) {
  return typeof t == "string" && (t = je(t)), typeof e == "string" && (e = Zm(e)), typeof n == "number" ? {
    type: j.Payload,
    payloadType: bt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: j.Payload,
    payloadType: bt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Qm() {
  return { type: j.Payload, payloadType: bt.PoisonMicroblock };
}
function $f(t, e) {
  if (t.byteLength != Ar)
    throw Error(`Coinbase buffer size must be ${Ar} bytes`);
  return e != null ? {
    type: j.Payload,
    payloadType: bt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: j.Payload,
    payloadType: bt.Coinbase,
    coinbaseBytes: t
  };
}
function Jm(t, e, n) {
  if (t.byteLength != Ar)
    throw Error(`Coinbase buffer size must be ${Ar} bytes`);
  if (n.byteLength != lc)
    throw Error(`VRF proof buffer size must be ${lc} bytes`);
  return {
    type: j.Payload,
    payloadType: bt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ft.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function tS(t, e, n, r, s, i, o) {
  return {
    type: j.Payload,
    payloadType: bt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function je(t, e, n) {
  const r = e || 1, s = n || Px;
  if (O0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: j.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function eS(t, e, n) {
  return {
    type: j.Asset,
    address: ur(t),
    contractName: je(e),
    assetName: je(n)
  };
}
function ur(t) {
  const e = Wr.c32addressDecode(t);
  return {
    type: j.Address,
    version: e[0],
    hash160: e[1]
  };
}
function nS(t, e) {
  const n = ur(t), r = je(e);
  return {
    type: j.Principal,
    prefix: se.Contract,
    address: n,
    contractName: r
  };
}
function rS(t) {
  const e = ur(t);
  return {
    type: j.Principal,
    prefix: se.Standard,
    address: e
  };
}
function ds(t, e) {
  return {
    pubKeyEncoding: t,
    type: j.TransactionAuthField,
    contents: e
  };
}
function mn(t) {
  switch (t.type) {
    case j.Address:
      return Ei(t);
    case j.Principal:
      return B0(t);
    case j.LengthPrefixedString:
      return Bs(t);
    case j.MemoString:
      return iS(t);
    case j.Asset:
      return T0(t);
    case j.PostCondition:
      return U0(t);
    case j.PublicKey:
      return xc(t);
    case j.LengthPrefixedList:
      return vl(t);
    case j.Payload:
      return H0(t);
    case j.TransactionAuthField:
      return uS(t);
    case j.MessageSignature:
      return Il(t);
  }
}
function Ei(t) {
  const e = [];
  return e.push(pt(yi(t.version, 1))), e.push(pt(t.hash160)), Dt(e);
}
function ks(t) {
  const e = de(t, It) ? t : new It(t), n = jo(Z(e.readBytes(1))), r = Z(e.readBytes(20));
  return { type: j.Address, version: n, hash160: r };
}
function B0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === se.Standard || t.prefix === se.Contract) && e.push(Ei(t.address)), t.prefix === se.Contract && e.push(Bs(t.contractName)), Dt(e);
}
function sS(t) {
  const e = de(t, It) ? t : new It(t), n = e.readUInt8Enum(se, (i) => {
    throw new ne(`Unexpected Principal payload type: ${i}`);
  });
  if (n === se.Origin)
    return { type: j.Principal, prefix: n };
  const r = ks(e);
  if (n === se.Standard)
    return { type: j.Principal, prefix: n, address: r };
  const s = ke(e);
  return {
    type: j.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Bs(t) {
  const e = [], n = Gr(t.content), r = n.byteLength;
  return e.push(pt(yi(r, t.lengthPrefixBytes))), e.push(n), Dt(e);
}
function ke(t, e, n) {
  e = e || 1;
  const r = de(t, It) ? t : new It(t), s = jo(Z(r.readBytes(e))), i = wi(r.readBytes(s));
  return je(i, e, n ?? 128);
}
function iS(t) {
  const e = [], n = Gr(t.content), r = _S(Z(n), Io * 2);
  return e.push(pt(r)), Dt(e);
}
function M0(t) {
  const e = de(t, It) ? t : new It(t);
  let n = wi(e.readBytes(Io));
  return n = n.replace(/\u0000*$/, ""), { type: j.MemoString, content: n };
}
function T0(t) {
  const e = [];
  return e.push(Ei(t.address)), e.push(Bs(t.contractName)), e.push(Bs(t.assetName)), Dt(e);
}
function wc(t) {
  const e = de(t, It) ? t : new It(t);
  return {
    type: j.Asset,
    address: ks(e),
    contractName: ke(e),
    assetName: ke(e)
  };
}
function vl(t) {
  const e = t.values, n = [];
  n.push(pt(yi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(mn(r));
  return Dt(n);
}
function _0(t, e, n) {
  const r = de(t, It) ? t : new It(t), s = jo(Z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case j.Address:
        i.push(ks(r));
        break;
      case j.LengthPrefixedString:
        i.push(ke(r));
        break;
      case j.MemoString:
        i.push(M0(r));
        break;
      case j.Asset:
        i.push(wc(r));
        break;
      case j.PostCondition:
        i.push(aS(r));
        break;
      case j.PublicKey:
        i.push(mc(r));
        break;
      case j.TransactionAuthField:
        i.push(lS(r));
        break;
    }
  return $l(i, n);
}
function oS(t) {
  return Z(U0(t));
}
function U0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(B0(t.principal)), (t.conditionType === kt.Fungible || t.conditionType === kt.NonFungible) && e.push(T0(t.asset)), t.conditionType === kt.NonFungible && e.push(rn(t.assetName)), e.push(t.conditionCode), t.conditionType === kt.STX || t.conditionType === kt.Fungible || t.conditionType === kt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new hs("The post-condition amount may not be larger than 8 bytes");
    e.push(cr(t.amount, 8));
  }
  return Dt(e);
}
function aS(t) {
  const e = de(t, It) ? t : new It(t), n = e.readUInt8Enum(kt, (a) => {
    throw new ne(`Could not read ${a} as PostConditionType`);
  }), r = sS(e);
  let s, i, o;
  switch (n) {
    case kt.STX:
      return s = e.readUInt8Enum(Js, (c) => {
        throw new ne(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: j.PostCondition,
        conditionType: kt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.Fungible:
      return i = wc(e), s = e.readUInt8Enum(Js, (c) => {
        throw new ne(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: j.PostCondition,
        conditionType: kt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case kt.NonFungible:
      i = wc(e);
      const a = en(e);
      return s = e.readUInt8Enum(fc, (c) => {
        throw new ne(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: j.PostCondition,
        conditionType: kt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case kt.Staking:
      return s = e.readUInt8Enum(Js, (c) => {
        throw new ne(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: j.PostCondition,
        conditionType: kt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.PoX: {
      const c = e.readUInt8Enum(hc, (u) => {
        throw new ne(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: j.PostCondition,
        conditionType: kt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function H0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case bt.TokenTransfer:
      e.push(rn(t.recipient)), e.push(cr(t.amount, 8)), e.push(mn(t.memo));
      break;
    case bt.ContractCall:
      e.push(mn(t.contractAddress)), e.push(mn(t.contractName)), e.push(mn(t.functionName));
      const n = new Uint8Array(4);
      Lr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(rn(r));
      });
      break;
    case bt.SmartContract:
      e.push(mn(t.contractName)), e.push(mn(t.codeBody));
      break;
    case bt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(mn(t.contractName)), e.push(mn(t.codeBody));
      break;
    case bt.PoisonMicroblock:
      break;
    case bt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case bt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(rn(t.recipient));
      break;
    case bt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(rn(t.recipient ? k0(t.recipient) : C0())), e.push(t.vrfProof);
      break;
    case bt.TenureChange:
      e.push(pt(t.tenureHash)), e.push(pt(t.previousTenureHash)), e.push(pt(t.burnViewHash)), e.push(pt(t.previousTenureEnd)), e.push(Lr(new Uint8Array(4), t.previousTenureBlocks)), e.push(nw(new Uint8Array(1), t.cause)), e.push(pt(t.publicKeyHash));
      break;
  }
  return Dt(e);
}
function cS(t) {
  const e = de(t, It) ? t : new It(t);
  switch (e.readUInt8Enum(bt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case bt.TokenTransfer:
      const r = en(e), s = te(e.readBytes(8)), i = M0(e);
      return Xm(r, s, i);
    case bt.ContractCall:
      const o = ks(e), a = ke(e), c = ke(e), u = [], h = e.readUInt32BE();
      for (let I = 0; I < h; I++) {
        const A = en(e);
        u.push(A);
      }
      return Ym(o, a, c, u);
    case bt.SmartContract:
      const l = ke(e), g = ke(e, 4, 1e5);
      return Af(l, g);
    case bt.VersionedSmartContract: {
      const I = e.readUInt8Enum(uc, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), A = ke(e), P = ke(e, 4, Wx);
      return Af(A, P, I);
    }
    case bt.PoisonMicroblock:
      return Qm();
    case bt.Coinbase: {
      const I = e.readBytes(Ar);
      return $f(I);
    }
    case bt.CoinbaseToAltRecipient: {
      const I = e.readBytes(Ar), A = en(e);
      return $f(I, A);
    }
    case bt.NakamotoCoinbase: {
      const I = e.readBytes(Ar), A = en(e), P = e.readBytes(lc);
      return Jm(I, A, P);
    }
    case bt.TenureChange:
      const f = Z(e.readBytes(20)), y = Z(e.readBytes(20)), w = Z(e.readBytes(20)), v = Z(e.readBytes(32)), T = e.readUInt32BE(), _ = e.readUInt8Enum(dc, (I) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${I}`);
      }), b = Z(e.readBytes(20));
      return tS(f, y, w, v, T, _, b);
  }
}
function bc(t) {
  const e = de(t, It) ? t : new It(t);
  return yc(Z(e.readBytes(ta)));
}
function lS(t) {
  const e = de(t, It) ? t : new It(t), n = e.readUInt8Enum(Oe, (r) => {
    throw new ne(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Oe.PublicKeyCompressed:
      return ds(Tt.Compressed, mc(e));
    case Oe.PublicKeyUncompressed:
      return ds(Tt.Uncompressed, Os(GS(mc(e).data)));
    case Oe.SignatureCompressed:
      return ds(Tt.Compressed, bc(e));
    case Oe.SignatureUncompressed:
      return ds(Tt.Uncompressed, bc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Il(t) {
  return pt(t.data);
}
function uS(t) {
  const e = [];
  switch (t.contents.type) {
    case j.PublicKey:
      e.push(t.pubKeyEncoding === Tt.Compressed ? Oe.PublicKeyCompressed : Oe.PublicKeyUncompressed), e.push(pt(RS(t.contents.data)));
      break;
    case j.MessageSignature:
      e.push(t.pubKeyEncoding === Tt.Compressed ? Oe.SignatureCompressed : Oe.SignatureUncompressed), e.push(Il(t.contents));
      break;
  }
  return Dt(e);
}
function xc(t) {
  return t.data.slice();
}
function mc(t) {
  const e = de(t, It) ? t : new It(t), n = e.readUInt8(), r = n === 4 ? Fx : Dx;
  return Os(Dt([n, e.readBytes(r)]));
}
function Ll(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === At.P2PKH || e === At.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === At.P2WPKH || e === At.P2WSH || e === At.P2WSHNonSequential) && !r.map((s) => s.data).every(Ds))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case At.P2PKH:
      return Vi(t, US(r[0].data));
    case At.P2WPKH:
      return Vi(t, HS(r[0].data));
    case At.P2SH:
    case At.P2SHNonSequential:
      return Vi(t, NS(n, r.map(xc)));
    case At.P2WSH:
    case At.P2WSHNonSequential:
      return Vi(t, PS(n, r.map(xc)));
  }
}
function Vi(t, e) {
  return { type: j.Address, version: t, hash160: e };
}
function Cl(t) {
  return Wr.c32address(t.version, t.hash160);
}
function vf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return eS(e, n, r);
}
function qs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return nS(e, n);
  } else
    return rS(t);
}
function fS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return pS(e, n);
  } else
    return hS(t);
}
function hS(t) {
  const e = ur(t);
  return { type: ft.PrincipalStandard, value: Cl(e) };
}
function dS(t) {
  return { type: ft.PrincipalStandard, value: Cl(t) };
}
function pS(t, e) {
  const n = ur(t), r = je(e);
  return N0(n, r);
}
function N0(t, e) {
  if (Gr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ft.PrincipalContract,
    value: `${Cl(t)}.${e.content}`
  };
}
function gS(t) {
  return { type: ft.ResponseErr, value: t };
}
function yS(t) {
  return { type: ft.ResponseOk, value: t };
}
const wS = (t) => ({ type: ft.StringASCII, value: t }), bS = (t) => ({ type: ft.StringUTF8, value: t });
function xS(t) {
  for (const e in t)
    if (!OS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: ft.Tuple, value: t };
}
function en(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new It(pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new It(t) : e = t;
  switch (e.readUInt8Enum(Gt, (r) => {
    throw new ne(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Gt.int:
      return Vm(qa(e.readBytes(16)));
    case Gt.uint:
      return Km(e.readBytes(16));
    case Gt.buffer:
      const r = e.readUInt32BE();
      return Rm(e.readBytes(r));
    case Gt.true:
      return jm();
    case Gt.false:
      return zm();
    case Gt.address:
      const s = ks(e);
      return dS(s);
    case Gt.contract:
      const i = ks(e), o = ke(e);
      return N0(i, o);
    case Gt.ok:
      return yS(en(e));
    case Gt.err:
      return gS(en(e));
    case Gt.none:
      return C0();
    case Gt.some:
      return k0(en(e));
    case Gt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(en(e));
      return qm(c);
    case Gt.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const v = ke(e).content;
        if (v === void 0)
          throw new ne('"content" is undefined');
        h[v] = en(e);
      }
      return xS(h);
    case Gt.ascii:
      const l = e.readUInt32BE(), g = Wy(e.readBytes(l));
      return wS(g);
    case Gt.utf8:
      const f = e.readUInt32BE(), y = wi(e.readBytes(f));
      return bS(y);
    default:
      throw new ne("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function cn(t, e) {
  return Dt([Al(t), e]);
}
function mS(t) {
  return new Uint8Array([Al(t.type)]);
}
function SS(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([Al(t.type)]) : cn(t.type, rn(t.value));
}
function ES(t) {
  const e = new Uint8Array(4);
  return Lr(e, Math.ceil(t.value.length / 2), 0), cn(t.type, on(e, pt(t.value)));
}
function AS(t) {
  const e = Qc(Ry(BigInt(t.value), BigInt(Ox)), x0);
  return cn(t.type, e);
}
function $S(t) {
  const e = Qc(BigInt(t.value), x0);
  return cn(t.type, e);
}
function vS(t) {
  return cn(t.type, Ei(ur(t.value)));
}
function IS(t) {
  const [e, n] = DS(t.value);
  return cn(t.type, on(Ei(ur(e)), Bs(je(n))));
}
function LS(t) {
  return cn(t.type, rn(t.value));
}
function CS(t) {
  const e = [], n = new Uint8Array(4);
  Lr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = rn(r);
    e.push(s);
  }
  return cn(t.type, Dt(e));
}
function kS(t) {
  const e = [], n = new Uint8Array(4);
  Lr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = je(s);
    e.push(Bs(i));
    const o = rn(t.value[s]);
    e.push(o);
  }
  return cn(t.type, Dt(e));
}
function P0(t, e) {
  const n = [], r = e == "ascii" ? qy(t.value) : Gr(t.value), s = new Uint8Array(4);
  return Lr(s, r.length, 0), n.push(s), n.push(r), cn(t.type, Dt(n));
}
function BS(t) {
  return P0(t, "ascii");
}
function MS(t) {
  return P0(t, "utf8");
}
function If(t) {
  return Z(rn(t));
}
function rn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return mS(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return SS(t);
    case ft.Buffer:
      return ES(t);
    case ft.UInt:
      return $S(t);
    case ft.Int:
      return AS(t);
    case ft.PrincipalStandard:
      return vS(t);
    case ft.PrincipalContract:
      return IS(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return LS(t);
    case ft.List:
      return CS(t);
    case ft.Tuple:
      return kS(t);
    case ft.StringASCII:
      return BS(t);
    case ft.StringUTF8:
      return MS(t);
    default:
      throw new hs("Unable to serialize. Invalid Clarity Value.");
  }
}
const TS = (t) => t.length % 2 ? `0${t}` : t, _S = (t, e) => t.padEnd(e, "0"), O0 = (t, e) => t ? Gr(t).length > e : !1;
function Sc(t) {
  return g0(t);
}
const ii = (t) => dm(ml(t)), kl = (t) => Z(Fm(t)), US = (t) => Z(ii(t)), HS = (t) => {
  const e = ii(t), n = on(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ii(n);
  return Z(r);
}, NS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = ii(r);
  return Z(s);
}, PS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = ml(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Dt(i), a = ii(o);
  return Z(a);
};
function OS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function DS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Pt.hmacSha256Sync = (t, ...e) => {
  const n = A0.create(ml, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Os(t) {
  return t = typeof t == "string" ? pt(t) : t, {
    type: j.PublicKey,
    data: t
  };
}
function FS(t, e, n = Tt.Compressed) {
  const r = Qy(e), s = new Se(vu(r.r), vu(r.s)), i = ct.fromSignature(t, s, r.recoveryId), o = n === Tt.Compressed;
  return i.toHex(o);
}
function jS(t) {
  return typeof t == "string" ? t : Z(t);
}
const Bl = jS;
function D0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Zy;
}
function Ds(t) {
  return !Bl(t).startsWith("04");
}
function zS(t) {
  t = Jc(t);
  const e = D0(t);
  return Z(bi(t.slice(0, 32), e));
}
function RS(t) {
  return ct.fromHex(Bl(t)).toHex(!0);
}
function GS(t) {
  return ct.fromHex(Bl(t)).toHex(!1);
}
function VS(t, e) {
  t = Jc(t);
  const [n, r] = Ro(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return yi(r, 1) + Se.fromHex(n).toCompactHex();
}
function Ml() {
  return {
    type: j.MessageSignature,
    data: Z(new Uint8Array(ta))
  };
}
function F0(t, e, n, r) {
  const s = Ll(0, t, 1, [Os(e)]).hash160, i = Ds(e) ? Tt.Compressed : Tt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: te(n),
    fee: te(r),
    keyEncoding: i,
    signature: Ml()
  };
}
function oi(t) {
  return "signature" in t;
}
function Lf(t) {
  return t === At.P2SH || t === At.P2WSH;
}
function KS(t) {
  return t === At.P2SHNonSequential || t === At.P2WSHNonSequential;
}
function Cf(t) {
  const e = Sc(t);
  return e.nonce = 0, e.fee = 0, oi(e) ? e.signature = Ml() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function qS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    cr(t.nonce, 8),
    cr(t.fee, 8),
    t.keyEncoding,
    Il(t.signature)
  ];
  return Dt(e);
}
function WS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    cr(t.nonce, 8),
    cr(t.fee, 8)
  ], n = $l(t.fields);
  e.push(vl(n));
  const r = new Uint8Array(2);
  return tw(r, t.signaturesRequired, 0), e.push(r), Dt(e);
}
function XS(t, e) {
  const n = Z(e.readBytes(20)), r = BigInt(`0x${Z(e.readBytes(8))}`), s = BigInt(`0x${Z(e.readBytes(8))}`), i = e.readUInt8Enum(Tt, (a) => {
    throw new ne(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === At.P2WPKH && i != Tt.Compressed)
    throw new ne("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = bc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function YS(t, e) {
  const n = Z(e.readBytes(20)), r = BigInt("0x" + Z(e.readBytes(8))), s = BigInt("0x" + Z(e.readBytes(8))), i = _0(e, j.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case j.PublicKey:
        Ds(u.contents.data) || (o = !0);
        break;
      case j.MessageSignature:
        if (u.pubKeyEncoding === Tt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new xr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === At.P2WSH || t === At.P2WSHNonSequential))
    throw new xr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ba(t) {
  return oi(t) ? qS(t) : WS(t);
}
function Ma(t) {
  const e = t.readUInt8Enum(At, (n) => {
    throw new ne(`Could not parse ${n} as AddressHashMode`);
  });
  return e === At.P2PKH || e === At.P2WPKH ? XS(e, t) : YS(e, t);
}
function j0(t, e, n, r) {
  const i = t + Z(new Uint8Array([e])) + Z(cr(n, 8)) + Z(cr(r, 8));
  if (pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return kl(pt(i));
}
function z0(t, e, n) {
  const r = 33 + ta, s = Ds(e.data) ? Tt.Compressed : Tt.Uncompressed, i = t + TS(s.toString(16)) + n, o = pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return kl(o);
}
function ZS(t, e, n, r, s) {
  const i = j0(t, e, n, r), o = VS(s, i), a = Os(zS(s)), c = z0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function R0(t, e, n, r, s, i) {
  const o = j0(t, e, n, r), a = Os(FS(o, i, s)), c = z0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function QS() {
  const t = F0(At.P2PKH, "", 0, 0);
  return t.signer = Wm().hash160, t.keyEncoding = Tt.Compressed, t.signature = Ml(), t;
}
function kf(t, e, n) {
  return oi(t) ? JS(t, e, n) : t3(t, e, n);
}
function JS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = R0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Ll(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new xr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function t3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case j.PublicKey:
        Ds(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case j.MessageSignature:
        c.pubKeyEncoding === Tt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = R0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Lf(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new xr("Too many signatures");
        break;
    }
  if (Lf(t.hashMode) && o !== t.signaturesRequired || KS(t.hashMode) && o < t.signaturesRequired)
    throw new xr("Incorrect number of signatures");
  if (i && (t.hashMode === At.P2WSH || t.hashMode === At.P2WSHNonSequential))
    throw new xr("Uncompressed keys are not allowed in this hash mode");
  const a = Ll(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new xr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function G0(t) {
  return {
    authType: Ht.Standard,
    spendingCondition: t
  };
}
function V0(t, e) {
  return {
    authType: Ht.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || F0(At.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Bf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ht.Standard:
        return G0(Cf(t.spendingCondition));
      case Ht.Sponsored:
        return V0(Cf(t.spendingCondition), QS());
      default:
        throw new Co("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function e3(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      return kf(t.spendingCondition, e, Ht.Standard);
    case Ht.Sponsored:
      return kf(t.spendingCondition, e, Ht.Standard);
    default:
      throw new Co("Invalid origin auth type");
  }
}
function n3(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      const n = {
        ...t.spendingCondition,
        fee: te(e)
      };
      return { ...t, spendingCondition: n };
    case Ht.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: te(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function r3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: te(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function s3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: te(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function i3(t, e) {
  const n = {
    ...e,
    nonce: te(e.nonce),
    fee: te(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function o3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ht.Standard:
      e.push(Ba(t.spendingCondition));
      break;
    case Ht.Sponsored:
      e.push(Ba(t.spendingCondition)), e.push(Ba(t.sponsorSpendingCondition));
      break;
  }
  return Dt(e);
}
function a3(t) {
  const e = t.readUInt8Enum(Ht, (r) => {
    throw new ne(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ht.Standard:
      return n = Ma(t), G0(n);
    case Ht.Sponsored:
      n = Ma(t);
      const r = Ma(t);
      return V0(n, r);
  }
}
class c3 {
  constructor({ auth: e, payload: n, postConditions: r = $l([]), postConditionMode: s = Lo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Hx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: te(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = we.Any;
  }
  signBegin() {
    const e = Sc(this);
    return e.auth = Bf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Sc(this);
    return e.auth = Bf(e.auth), e.txid();
  }
  verifyOrigin() {
    return e3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ht.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ht.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ht.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Os(e), r = this.auth.spendingCondition;
    if (r && !oi(r)) {
      const s = Ds(n.data);
      r.fields.push(ds(s ? Tt.Compressed : Tt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ZS(n, r, e.fee, e.nonce, s);
    if (oi(e))
      e.signature = yc(i);
    else {
      const a = D0(s);
      e.fields.push(ds(a ? Tt.Compressed : Tt.Uncompressed, yc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return kl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new Co("Cannot sponsor sign a non-sponsored transaction");
    this.auth = i3(this.auth, e);
  }
  setFee(e) {
    this.auth = n3(this.auth, e);
  }
  setNonce(e) {
    this.auth = r3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new Co("Cannot sponsor sign a non-sponsored transaction");
    this.auth = s3(this.auth, e);
  }
  serialize() {
    return Z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new hs('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new hs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new hs('"auth" is undefined');
    if (this.payload === void 0)
      throw new hs('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Lr(n, this.chainId, 0), e.push(n), e.push(o3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(vl(this.postConditions)), e.push(H0(this.payload)), Dt(e);
  }
}
function l3(t) {
  const e = de(t, It) ? t : new It(t), n = e.readUInt8Enum(Nr, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = a3(e), i = e.readUInt8Enum(we, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum(Lo, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = _0(e, j.PostCondition), c = cS(e), u = new c3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Mf = BigInt("18446744073709551615");
function Ta(t) {
  const e = te(t);
  if (e < 0n || e > Mf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Mf} (u64 max), received: ${e}`);
  return e;
}
var Ec;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ac || (Ac = {}));
function u3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: j.PostCondition,
        conditionType: kt.STX,
        principal: t.address === "origin" ? { type: j.Principal, prefix: se.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount)
      };
    case "ft-postcondition":
      return {
        type: j.PostCondition,
        conditionType: kt.Fungible,
        principal: t.address === "origin" ? { type: j.Principal, prefix: se.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount),
        asset: vf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: j.PostCondition,
        conditionType: kt.NonFungible,
        principal: t.address === "origin" ? { type: j.Principal, prefix: se.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        asset: vf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: j.PostCondition,
        conditionType: kt.Staking,
        principal: t.address === "origin" ? { type: j.Principal, prefix: se.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount)
      };
    case "pox-postcondition":
      return {
        type: j.PostCondition,
        conditionType: kt.PoX,
        principal: t.address === "origin" ? { type: j.Principal, prefix: se.Origin } : qs(t.address),
        conditionCode: f3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ki(t) {
  return Ec[t];
}
function f3(t) {
  return Ac[t];
}
function K0(t) {
  const e = u3(t);
  return oS(e);
}
function h3(t, e, n) {
  return _l(q0(t), n);
}
function q0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ai(r);
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
    return BigInt(`0x${g3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Tl(t, e = 8) {
  return (typeof t == "bigint" ? t : q0(t)).toString(16).padStart(e * 2, "0");
}
function _l(t, e = 16) {
  const n = Tl(t, e);
  return ai(n);
}
function d3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const p3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function g3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += p3[n];
  return e;
}
function ai(t) {
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
function Ul(t) {
  return new TextEncoder().encode(t);
}
function y3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function w3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Tf(t) {
  if (t.some(w3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Hl(...t) {
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
function Cn(t) {
  return Hl(...t.map((e) => typeof e == "number" ? Tf([e]) : e instanceof Array ? Tf(e) : e));
}
function ra(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var $c;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})($c || ($c = {}));
$c.Mainnet;
const b3 = 128, x3 = 128, W0 = 16;
var vc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(vc || (vc = {}));
var _f;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_f || (_f = {}));
var Uf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Uf || (Uf = {}));
var Pe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pe || (Pe = {}));
const _a = ["onChainOnly", "offChainOnly", "any"];
_a[0] + "", Pe.OnChainOnly, _a[1] + "", Pe.OffChainOnly, _a[2] + "", Pe.Any, Pe.OnChainOnly + "", Pe.OnChainOnly, Pe.OffChainOnly + "", Pe.OffChainOnly, Pe.Any + "", Pe.Any;
var Ic;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ic || (Ic = {}));
Ic.Mainnet;
var Hf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Hf || (Hf = {}));
var gr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gr || (gr = {}));
var Nf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Nf || (Nf = {}));
var Pf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Pf || (Pf = {}));
var Of;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Of || (Of = {}));
var Df;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Df || (Df = {}));
var Ff;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ff || (Ff = {}));
var jf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(jf || (jf = {}));
var Lc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Lc || (Lc = {}));
var zf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zf || (zf = {}));
var Rf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Rf || (Rf = {}));
function Cc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function m3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function X0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cc(t.outputLen), Cc(t.blockLen);
}
function E3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A3(t, e) {
  X0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ua = {
  number: Cc,
  bool: m3,
  bytes: X0,
  hash: S3,
  exists: E3,
  output: A3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qe = (t, e) => t << 32 - e | t >>> e, $3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function v3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Y0(t) {
  if (typeof t == "string" && (t = v3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let I3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Yr(t) {
  const e = (r) => t().update(Y0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function L3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Nl = class extends I3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ha(this.buffer);
  }
  update(e) {
    Ua.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Y0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ha(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ua.exists(this), Ua.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ha(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const C3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Z0 = Uint8Array.from({ length: 16 }, (t, e) => e), k3 = Z0.map((t) => (9 * t + 5) % 16);
let Pl = [Z0], Ol = [k3];
for (let t = 0; t < 4; t++)
  for (let e of [Pl, Ol])
    e.push(e[t].map((n) => C3[n]));
const Q0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), B3 = Pl.map((t, e) => t.map((n) => Q0[e][n])), M3 = Ol.map((t, e) => t.map((n) => Q0[e][n])), T3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qi = (t, e) => t << e | t >>> 32 - e;
function Gf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wi = new Uint32Array(16);
let U3 = class extends Nl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Wi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T3[f], v = _3[f], T = Pl[f], _ = Ol[f], b = B3[f], I = M3[f];
      for (let A = 0; A < 16; A++) {
        const P = qi(r + Gf(f, i, a, u) + Wi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = qi(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = qi(s + Gf(y, o, c, h) + Wi[_[A]] + v, I[A]) + g | 0;
        s = g, g = h, h = qi(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Wi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Yr(() => new U3());
const H3 = (t, e, n) => t & e ^ ~t & n, N3 = (t, e, n) => t & e ^ t & n ^ e & n, P3 = new Uint32Array([
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
]), Kn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qn = new Uint32Array(64);
let J0 = class extends Nl {
  constructor() {
    super(64, 32, 8, !1), this.A = Kn[0] | 0, this.B = Kn[1] | 0, this.C = Kn[2] | 0, this.D = Kn[3] | 0, this.E = Kn[4] | 0, this.F = Kn[5] | 0, this.G = Kn[6] | 0, this.H = Kn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      qn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = qn[l - 15], f = qn[l - 2], y = Qe(g, 7) ^ Qe(g, 18) ^ g >>> 3, w = Qe(f, 17) ^ Qe(f, 19) ^ f >>> 10;
      qn[l] = w + qn[l - 7] + y + qn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Qe(a, 6) ^ Qe(a, 11) ^ Qe(a, 25), f = h + g + H3(a, c, u) + P3[l] + qn[l] | 0, w = (Qe(r, 2) ^ Qe(r, 13) ^ Qe(r, 22)) + N3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    qn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O3 = class extends J0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Yr(() => new J0());
Yr(() => new O3());
const Xi = BigInt(2 ** 32 - 1), kc = BigInt(32);
function tp(t, e = !1) {
  return e ? { h: Number(t & Xi), l: Number(t >> kc & Xi) } : { h: Number(t >> kc & Xi) | 0, l: Number(t & Xi) | 0 };
}
function D3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = tp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const F3 = (t, e) => BigInt(t >>> 0) << kc | BigInt(e >>> 0), j3 = (t, e, n) => t >>> n, z3 = (t, e, n) => t << 32 - n | e >>> n, R3 = (t, e, n) => t >>> n | e << 32 - n, G3 = (t, e, n) => t << 32 - n | e >>> n, V3 = (t, e, n) => t << 64 - n | e >>> n - 32, K3 = (t, e, n) => t >>> n - 32 | e << 64 - n, q3 = (t, e) => e, W3 = (t, e) => t, X3 = (t, e, n) => t << n | e >>> 32 - n, Y3 = (t, e, n) => e << n | t >>> 32 - n, Z3 = (t, e, n) => e << n - 32 | t >>> 64 - n, Q3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function J3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, st = {
  fromBig: tp,
  split: D3,
  toBig: F3,
  shrSH: j3,
  shrSL: z3,
  rotrSH: R3,
  rotrSL: G3,
  rotrBH: V3,
  rotrBL: K3,
  rotr32H: q3,
  rotr32L: W3,
  rotlSH: X3,
  rotlSL: Y3,
  rotlBH: Z3,
  rotlBL: Q3,
  add: J3,
  add3L: t4,
  add3H: e4,
  add4L: n4,
  add4H: r4,
  add5H: i4,
  add5L: s4
}, [o4, a4] = st.split([
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
].map((t) => BigInt(t))), Wn = new Uint32Array(80), Xn = new Uint32Array(80);
let sa = class extends Nl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Wn[b] = e.getUint32(n), Xn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Wn[b - 15] | 0, A = Xn[b - 15] | 0, P = st.rotrSH(I, A, 1) ^ st.rotrSH(I, A, 8) ^ st.shrSH(I, A, 7), K = st.rotrSL(I, A, 1) ^ st.rotrSL(I, A, 8) ^ st.shrSL(I, A, 7), O = Wn[b - 2] | 0, R = Xn[b - 2] | 0, x = st.rotrSH(O, R, 19) ^ st.rotrBH(O, R, 61) ^ st.shrSH(O, R, 6), L = st.rotrSL(O, R, 19) ^ st.rotrBL(O, R, 61) ^ st.shrSL(O, R, 6), H = st.add4L(K, L, Xn[b - 7], Xn[b - 16]), q = st.add4H(H, P, x, Wn[b - 7], Wn[b - 16]);
      Wn[b] = q | 0, Xn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: v, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = st.rotrSH(l, g, 14) ^ st.rotrSH(l, g, 18) ^ st.rotrBH(l, g, 41), A = st.rotrSL(l, g, 14) ^ st.rotrSL(l, g, 18) ^ st.rotrBL(l, g, 41), P = l & f ^ ~l & w, K = g & y ^ ~g & v, O = st.add5L(_, A, K, a4[b], Xn[b]), R = st.add5H(O, T, I, P, o4[b], Wn[b]), x = O | 0, L = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), H = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = v | 0, w = f | 0, v = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = st.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = st.add3L(x, H, Y);
      r = st.add3H(z, R, L, q), s = z | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = st.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = st.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = st.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = st.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: v } = st.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: T, l: _ } = st.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, v, T, _);
  }
  roundClean() {
    Wn.fill(0), Xn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, c4 = class extends sa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, l4 = class extends sa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, u4 = class extends sa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Yr(() => new sa());
Yr(() => new c4());
Yr(() => new l4());
Yr(() => new u4());
function f4(t, e, n) {
  const s = b3;
  if (L4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: vc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Kt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Kt || (Kt = {}));
let h4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ep = class extends h4 {
  constructor(e) {
    super(e);
  }
};
function ia(t) {
  const e = [];
  return e.push(ai(Tl(t.version, 1))), e.push(ai(t.hash160)), Cn(e);
}
function d4(t) {
  const e = [];
  return e.push(t.prefix), e.push(ia(t.address)), t.prefix === Lc.Contract && e.push(ci(t.contractName)), Cn(e);
}
function ci(t) {
  const e = [], n = Ul(t.content), r = n.byteLength;
  return e.push(ai(Tl(r, t.lengthPrefixBytes))), e.push(n), Cn(e);
}
function p4(t) {
  const e = [];
  return e.push(ia(t.address)), e.push(ci(t.contractName)), e.push(ci(t.assetName)), Cn(e);
}
function np(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d4(t.principal)), (t.conditionType === gr.Fungible || t.conditionType === gr.NonFungible) && e.push(p4(t.assetInfo)), t.conditionType === gr.NonFungible && e.push(Or(t.assetName)), e.push(t.conditionCode), t.conditionType === gr.STX || t.conditionType === gr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ep("The post-condition amount may not be larger than 8 bytes");
    e.push(h3(t.amount, !1, 8));
  }
  return Cn(e);
}
function ln(t, e) {
  return Cn([t, e]);
}
function g4(t) {
  return new Uint8Array([t.type]);
}
function y4(t) {
  return t.type === Kt.OptionalNone ? new Uint8Array([t.type]) : ln(t.type, Or(t.value));
}
function w4(t) {
  const e = new Uint8Array(4);
  return ra(e, t.buffer.length, 0), ln(t.type, Hl(e, t.buffer));
}
function b4(t) {
  const e = _l(d3(t.value, BigInt(x3)), W0);
  return ln(t.type, e);
}
function x4(t) {
  const e = _l(t.value, W0);
  return ln(t.type, e);
}
function m4(t) {
  return ln(t.type, ia(t.address));
}
function S4(t) {
  return ln(t.type, Hl(ia(t.address), ci(t.contractName)));
}
function E4(t) {
  return ln(t.type, Or(t.value));
}
function A4(t) {
  const e = [], n = new Uint8Array(4);
  ra(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Or(r);
    e.push(s);
  }
  return ln(t.type, Cn(e));
}
function $4(t) {
  const e = [], n = new Uint8Array(4);
  ra(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = f4(s);
    e.push(ci(i));
    const o = Or(t.data[s]);
    e.push(o);
  }
  return ln(t.type, Cn(e));
}
function rp(t, e) {
  const n = [], r = e == "ascii" ? y3(t.data) : Ul(t.data), s = new Uint8Array(4);
  return ra(s, r.length, 0), n.push(s), n.push(r), ln(t.type, Cn(n));
}
function v4(t) {
  return rp(t, "ascii");
}
function I4(t) {
  return rp(t, "utf8");
}
function Or(t) {
  switch (t.type) {
    case Kt.BoolTrue:
    case Kt.BoolFalse:
      return g4(t);
    case Kt.OptionalNone:
    case Kt.OptionalSome:
      return y4(t);
    case Kt.Buffer:
      return w4(t);
    case Kt.UInt:
      return x4(t);
    case Kt.Int:
      return b4(t);
    case Kt.PrincipalStandard:
      return m4(t);
    case Kt.PrincipalContract:
      return S4(t);
    case Kt.ResponseOk:
    case Kt.ResponseErr:
      return E4(t);
    case Kt.List:
      return A4(t);
    case Kt.Tuple:
      return $4(t);
    case Kt.StringASCII:
      return v4(t);
    case Kt.StringUTF8:
      return I4(t);
    default:
      throw new ep("Unable to serialize. Invalid Clarity Value.");
  }
}
const L4 = (t, e) => t ? Ul(t).length > e : !1, C4 = "connect-ui";
let lo, sp, be = !1, Bc = !1;
const Ln = (t, e = "") => () => {
}, k4 = (t, e) => () => {
}, B4 = "{visibility:hidden}.hydrated{visibility:inherit}", Vf = {}, M4 = "http://www.w3.org/2000/svg", T4 = "http://www.w3.org/1999/xhtml", _4 = (t) => t != null, Dl = (t) => (t = typeof t, t === "object" || t === "function");
function ip(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const J = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Dl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Mc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Mc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Mc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, U4 = {}, H4 = (t) => t && t.$tag$ === U4, N4 = (t, e) => t != null && !Dl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, P4 = (t) => Fs(t).$hostElement$, O4 = (t, e, n) => {
  const r = Jt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Kf = /* @__PURE__ */ new WeakMap(), D4 = (t, e, n) => {
  let r = ko.get(t);
  iE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ko.set(t, r);
}, F4 = (t, e, n, r) => {
  var s;
  let i = op(e);
  const o = ko.get(i);
  if (t = t.nodeType === 11 ? t : sn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Kf.get(t), c;
      if (a || Kf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = sn.createElement("style"), c.innerHTML = o;
          const u = (s = Jt.$nonce$) !== null && s !== void 0 ? s : ip(sn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, j4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ln("attachStyles", e.$tagName$), i = F4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, op = (t, e) => "sc-" + t.$tagName$, qf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Xf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Wf(n), h = Wf(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Xf(oa, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Jt.rel(t, e, n, !1), r && Jt.ael(t, e, r, !1);
    else {
      const c = Dl(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, z4 = /\s/, Wf = (t) => t ? t.split(z4) : [], ap = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Vf, o = e.$attrs$ || Vf;
  for (r in i)
    r in o || qf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    qf(s, r, i[r], o[r], n, e.$flags$);
}, Fl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = sn.createTextNode(s.$text$);
  else {
    if (be || (be = s.$tag$ === "svg"), o = s.$elm$ = sn.createElementNS(be ? M4 : T4, s.$tag$), be && s.$tag$ === "foreignObject" && (be = !1), ap(null, s, be), _4(lo) && o["s-si"] !== lo && o.classList.add(o["s-si"] = lo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Fl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? be = !1 : o.tagName === "foreignObject" && (be = !0);
  }
  return o;
}, cp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === sp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Fl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, lp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, R4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Yi(a, h) ? (Ws(a, h), a = e[++s], h = r[++i]) : Yi(c, l) ? (Ws(c, l), c = e[--o], l = r[--u]) : Yi(a, l) ? (Ws(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Yi(c, h) ? (Ws(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (g = Fl(e && e[i], n, i), h = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? cp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && lp(e, s, o);
}, Yi = (t, e) => t.$tag$ === e.$tag$, Ws = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (be = i === "svg" ? !0 : i === "foreignObject" ? !1 : be, ap(t, e, be), r !== null && s !== null ? R4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), cp(n, null, e, s, 0, s.length - 1)) : r !== null && lp(r, 0, r.length - 1), be && i === "svg" && (be = !1)) : t.$text$ !== o && (n.data = o);
}, G4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Mc(null, null), s = H4(e) ? e : J(null, null, e);
  sp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, lo = n["s-sc"], Ws(r, s);
}, up = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, jl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return up(t, t.$ancestorComponent$), aE(() => V4(t, e));
}, V4 = (t, e) => {
  const n = Ln("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), X4(s, () => K4(t, r, e));
}, K4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Ln("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && j4(t);
  const o = Ln("render", t.$cmpMeta$.$tagName$);
  q4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => W4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, q4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, G4(t, e);
  } catch (r) {
    li(r, t.$hostElement$);
  }
  return null;
}, W4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ln("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, hp(n), r(), t.$onReadyResolve$(n), s || fp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Rl(() => jl(t, !1)), t.$flags$ &= -517;
}, fp = (t) => {
  hp(sn.documentElement), Rl(() => O4(oa, "appload", { detail: { namespace: C4 } }));
}, X4 = (t, e) => t && t.then ? t.then(e) : e(), hp = (t) => t.classList.add("hydrated"), Y4 = (t, e) => Fs(t).$instanceValues$.get(e), Z4 = (t, e, n, r) => {
  const s = Fs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = N4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && jl(s, !1));
}, dp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Y4(this, i);
        },
        set(a) {
          Z4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Jt.jmp(() => {
          const u = i.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return i.set(c, o), c;
      });
    }
  }
  return t;
}, Q4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = sE(n), s.then) {
        const c = k4();
        s = await s, c();
      }
      s.isProxied || (dp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ln("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        li(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = op(n);
      if (!ko.has(c)) {
        const u = Ln("registerStyles", n.$tagName$);
        D4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => jl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, J4 = (t) => {
  if (!(Jt.$flags$ & 1)) {
    const e = Fs(t), n = e.$cmpMeta$, r = Ln("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            up(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Q4(t, e, n);
    }
    r();
  }
}, tE = (t) => {
  Jt.$flags$ & 1 || Fs(t);
}, eE = (t, e = {}) => {
  var n;
  const r = Ln(), s = [], i = e.exclude || [], o = oa.customElements, a = sn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ sn.createElement("style"), h = [];
  let l, g = !0;
  Object.assign(Jt, e), Jt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", sn.baseURI).href, t.map((f) => {
    f[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const v = w.$tagName$, T = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, rE(_, w), w.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? h.push(this) : Jt.jmp(() => J4(this));
        }
        disconnectedCallback() {
          Jt.jmp(() => tE(this));
        }
        componentOnReady() {
          return Fs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = f[0], !i.includes(v) && !o.get(v) && (s.push(v), o.define(v, dp(
        T,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + B4, u.setAttribute("data-styles", "");
    const f = (n = Jt.$nonce$) !== null && n !== void 0 ? n : ip(sn);
    f != null && u.setAttribute("nonce", f), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, h.length ? h.map((f) => f.connectedCallback()) : Jt.jmp(() => l = setTimeout(fp, 30)), r();
}, zl = /* @__PURE__ */ new WeakMap(), Fs = (t) => zl.get(t), nE = (t, e) => zl.set(e.$lazyInstance$ = t, e), rE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], zl.set(t, n);
}, Xf = (t, e) => e in t, li = (t, e) => (0, console.error)(t, e), Na = /* @__PURE__ */ new Map(), sE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Na.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Na.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => Z5).then(o, li);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Na.set(s, o), o[r]), li);
}, ko = /* @__PURE__ */ new Map(), oa = typeof window < "u" ? window : {}, sn = oa.document || { head: {} }, Jt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, pp = (t) => Promise.resolve(t), iE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Yf = [], gp = [], oE = (t, e) => (n) => {
  t.push(n), Bc || (Bc = !0, Jt.$flags$ & 4 ? Rl(Tc) : Jt.raf(Tc));
}, Zf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      li(n);
    }
  t.length = 0;
}, Tc = () => {
  Zf(Yf), Zf(gp), (Bc = Yf.length > 0) && Jt.raf(Tc);
}, Rl = (t) => pp().then(t), aE = /* @__PURE__ */ oE(gp), cE = () => pp(), lE = (t, e) => typeof window > "u" ? Promise.resolve() : cE().then(() => eE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var uE = Object.defineProperty, fE = Object.defineProperties, hE = Object.getOwnPropertyDescriptors, Bo = Object.getOwnPropertySymbols, yp = Object.prototype.hasOwnProperty, wp = Object.prototype.propertyIsEnumerable, Qf = (t, e, n) => e in t ? uE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ae = (t, e) => {
  for (var n in e || (e = {})) yp.call(e, n) && Qf(t, n, e[n]);
  if (Bo) for (var n of Bo(e)) wp.call(e, n) && Qf(t, n, e[n]);
  return t;
}, ze = (t, e) => fE(t, hE(e)), bp = (t, e) => {
  var n = {};
  for (var r in t) yp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Bo) for (var r of Bo(t)) e.indexOf(r) < 0 && wp.call(t, r) && (n[r] = t[r]);
  return n;
};
function xp() {
  return Jo(Tr()) || window.StacksProvider || window.BlockstackProvider;
}
function aa(t) {
  return t ? typeof t == "string" ? Ur.fromName(t) : "version" in t ? t : "url" in t ? new oc({ url: t.url }) : t.transactionVersion === Nr.Mainnet ? new oc({ url: t.client.baseUrl }) : new ac({ url: t.client.baseUrl }) : new ac();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var dE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(dE || {}), pE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(pE || {}), Gl = (t) => {
  let e = t;
  if (!e) {
    let n = new Qh(["store_write"], document.location.href);
    e = new ic({ appConfig: n });
  }
  return e;
};
function mp(t) {
  try {
    return Gl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Sp = (t) => {
  let e = Gl(t).loadUserData().appPrivateKey, n = Yt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function gE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Hr.Mainnet]: "mainnet", [Hr.Testnet]: "testnet" }, a = aa(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function yE(t) {
  let e = aa(t.network), n = Gl(t.userSession), r = ze(Ae({}, t), { network: e, userSession: n });
  return Ae({ stxAddress: gE(r) }, r);
}
async function wE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(K0) : n = n.map((r) => Z(np(r)))), new Yt.TokenSigner("ES256k", e).signAsync(ze(Ae({}, t), { postConditions: n }));
}
function bE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(K0) : e = e.map((n) => Z(np(n)))), Yt.createUnsecuredToken(ze(Ae({}, t), { postConditions: e }));
}
var xE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = pt(a.replace(/^0x/, "")), u = l3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ze(Ae({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ze(Ae({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, mE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = bp(e, ["amount", "appDetails", "userSession"]);
  if (mp(s)) {
    let { privateKey: a, publicKey: c } = Sp(s), u = ze(Ae({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), wE(u, a);
  }
  let o = ze(Ae({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), bE(o);
};
async function SE(t, e, n) {
  let r = await e(ze(Ae(Ae({}, yE(t)), t), { network: aa(t.network) }));
  return xE({ token: r, options: t }, n);
}
function EE(t, e = xp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return SE(t, mE, e);
}
function Ep(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ze(Ae({}, t), { message: If(e), domain: If(n) }) : ze(Ae({}, t), { message: Z(Or(e)), domain: Z(Or(n)) });
}
async function AE(t, e) {
  return new Yt.TokenSigner("ES256k", e).signAsync(Ep(t));
}
async function $E(t) {
  let e = t, { userSession: n } = e, r = bp(e, ["userSession"]);
  if (mp(n)) {
    let { privateKey: s, publicKey: i } = Sp(n), o = ze(Ae({}, r), { publicKey: i });
    return AE(o, s);
  }
  return Yt.createUnsecuredToken(Ep(t));
}
var vE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(vE || {}), Ap = "asigna-stx", Jf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Ap && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(LE(t, e), "*");
}), IE = { authenticationRequest: async (t) => Jf(t, "authenticationRequest"), transactionRequest: async (t) => Jf(t, "transactionRequest") }, LE = (t, e) => ({ source: Ap, [e]: t }), CE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = IE);
};
CE();
var kE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function BE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Tr(), o = xp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    lE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : kE, c = Sx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (f) => {
      l(), t(n, f);
    }, u.cancelCallback = () => {
      var f;
      l(), (f = n.onCancel) == null || f.call(n);
    }, document.body.appendChild(u);
    let g = (f) => {
      f.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Zi = BE(EE);
function lr(t, e, n) {
  return Vl(oe(t, e), n);
}
function oe(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Mt(r);
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
      const r = _E(BigInt(`0x${lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function th(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ai(t, e = 8) {
  return (typeof t == "bigint" ? t : oe(t, !1)).toString(16).padStart(e * 2, "0");
}
function ca(t) {
  return parseInt(t, 16);
}
function Vl(t, e = 16) {
  const n = Ai(t, e);
  return Mt(n);
}
function ME(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function TE(t, e) {
  return t & BigInt(1) << e;
}
function _E(t, e) {
  return TE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const UE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += UE[n];
  return e;
}
function Mt(t) {
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
function js(t) {
  return new TextEncoder().encode(t);
}
function Kl(t) {
  return new TextDecoder().decode(t);
}
function $p(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function HE(t) {
  return String.fromCharCode.apply(null, t);
}
function NE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function eh(t) {
  if (t.some(NE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function la(...t) {
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
function Ft(t) {
  return la(...t.map((e) => typeof e == "number" ? eh([e]) : e instanceof Array ? eh(e) : e));
}
var nh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(nh || (nh = {}));
var rh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rh || (rh = {}));
var sh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(sh || (sh = {}));
const vp = 33, Pa = 32;
function PE(t) {
  if (t.length < Pa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Pa * 2), r = t.slice(2 + Pa * 2);
  return {
    recoveryId: ca(e),
    r: n,
    s: r
  };
}
function OE(t) {
  const e = typeof t == "string" ? Mt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function DE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function FE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function jE(t, e) {
  return t[e];
}
function zE(t, e, n = 0) {
  return t[n] = e, t;
}
function RE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Dr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var _c;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(_c || (_c = {}));
const GE = _c.Mainnet, VE = 128, KE = 128, Ip = 16, $r = 32, Uc = 80, ua = 65, qE = 32, WE = 64, Mo = 34;
var X;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
var at;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(at || (at = {}));
var Hc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Hc || (Hc = {}));
var fe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(fe || (fe = {}));
const uo = ["onChainOnly", "offChainOnly", "any"], ih = {
  [uo[0]]: fe.OnChainOnly,
  [uo[1]]: fe.OffChainOnly,
  [uo[2]]: fe.Any,
  [fe.OnChainOnly]: fe.OnChainOnly,
  [fe.OffChainOnly]: fe.OffChainOnly,
  [fe.Any]: fe.Any
};
function XE(t) {
  if (t in ih)
    return ih[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${uo.join(", ")}`);
}
var To;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(To || (To = {}));
To.Mainnet;
var Ms;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ms || (Ms = {}));
var he;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(he || (he = {}));
var Nt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Nt || (Nt = {}));
var $t;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($t || ($t = {}));
var _o;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_o || (_o = {}));
var _t;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_t || (_t = {}));
var ui;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ui || (ui = {}));
var Nc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Nc || (Nc = {}));
var fi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(fi || (fi = {}));
var oh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(oh || (oh = {}));
var ah;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ah || (ah = {}));
function Pc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function YE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Lp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ZE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pc(t.outputLen), Pc(t.blockLen);
}
function QE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function JE(t, e) {
  Lp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Sr = {
  number: Pc,
  bool: YE,
  bytes: Lp,
  hash: ZE,
  exists: QE,
  output: JE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Je = (t, e) => t << 32 - e | t >>> e, tA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ql(t) {
  if (typeof t == "string" && (t = eA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Cp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Zr(t) {
  const e = (r) => t().update(ql(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function nA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Wl extends Cp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oa(this.buffer);
  }
  update(e) {
    Sr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ql(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Sr.exists(this), Sr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    nA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
}
const rA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), kp = Uint8Array.from({ length: 16 }, (t, e) => e), sA = kp.map((t) => (9 * t + 5) % 16);
let Xl = [kp], Yl = [sA];
for (let t = 0; t < 4; t++)
  for (let e of [Xl, Yl])
    e.push(e[t].map((n) => rA[n]));
const Bp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), iA = Xl.map((t, e) => t.map((n) => Bp[e][n])), oA = Yl.map((t, e) => t.map((n) => Bp[e][n])), aA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), cA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qi = (t, e) => t << e | t >>> 32 - e;
function ch(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ji = new Uint32Array(16);
class lA extends Wl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Ji[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = aA[f], v = cA[f], T = Xl[f], _ = Yl[f], b = iA[f], I = oA[f];
      for (let A = 0; A < 16; A++) {
        const P = Qi(r + ch(f, i, a, u) + Ji[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Qi(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Qi(s + ch(y, o, c, h) + Ji[_[A]] + v, I[A]) + g | 0;
        s = g, g = h, h = Qi(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ji.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const uA = Zr(() => new lA()), fA = (t, e, n) => t & e ^ ~t & n, hA = (t, e, n) => t & e ^ t & n ^ e & n, dA = new Uint32Array([
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
]), Yn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Zn = new Uint32Array(64);
class Mp extends Wl {
  constructor() {
    super(64, 32, 8, !1), this.A = Yn[0] | 0, this.B = Yn[1] | 0, this.C = Yn[2] | 0, this.D = Yn[3] | 0, this.E = Yn[4] | 0, this.F = Yn[5] | 0, this.G = Yn[6] | 0, this.H = Yn[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: a, H: c } = this;
    return [e, n, r, s, i, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Zn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Zn[l - 15], f = Zn[l - 2], y = Je(g, 7) ^ Je(g, 18) ^ g >>> 3, w = Je(f, 17) ^ Je(f, 19) ^ f >>> 10;
      Zn[l] = w + Zn[l - 7] + y + Zn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Je(a, 6) ^ Je(a, 11) ^ Je(a, 25), f = h + g + fA(a, c, u) + dA[l] + Zn[l] | 0, w = (Je(r, 2) ^ Je(r, 13) ^ Je(r, 22)) + hA(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Zn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class pA extends Mp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Zl = Zr(() => new Mp());
Zr(() => new pA());
const to = BigInt(2 ** 32 - 1), Oc = BigInt(32);
function Tp(t, e = !1) {
  return e ? { h: Number(t & to), l: Number(t >> Oc & to) } : { h: Number(t >> Oc & to) | 0, l: Number(t & to) | 0 };
}
function gA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Tp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yA = (t, e) => BigInt(t >>> 0) << Oc | BigInt(e >>> 0), wA = (t, e, n) => t >>> n, bA = (t, e, n) => t << 32 - n | e >>> n, xA = (t, e, n) => t >>> n | e << 32 - n, mA = (t, e, n) => t << 32 - n | e >>> n, SA = (t, e, n) => t << 64 - n | e >>> n - 32, EA = (t, e, n) => t >>> n - 32 | e << 64 - n, AA = (t, e) => e, $A = (t, e) => t, vA = (t, e, n) => t << n | e >>> 32 - n, IA = (t, e, n) => e << n | t >>> 32 - n, LA = (t, e, n) => e << n - 32 | t >>> 64 - n, CA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function kA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const BA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), MA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, TA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _A = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, UA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, it = {
  fromBig: Tp,
  split: gA,
  toBig: yA,
  shrSH: wA,
  shrSL: bA,
  rotrSH: xA,
  rotrSL: mA,
  rotrBH: SA,
  rotrBL: EA,
  rotr32H: AA,
  rotr32L: $A,
  rotlSH: vA,
  rotlSL: IA,
  rotlBH: LA,
  rotlBL: CA,
  add: kA,
  add3L: BA,
  add3H: MA,
  add4L: TA,
  add4H: _A,
  add5H: HA,
  add5L: UA
}, [NA, PA] = it.split([
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
].map((t) => BigInt(t))), Qn = new Uint32Array(80), Jn = new Uint32Array(80);
class fa extends Wl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: v } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Qn[b] = e.getUint32(n), Jn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const I = Qn[b - 15] | 0, A = Jn[b - 15] | 0, P = it.rotrSH(I, A, 1) ^ it.rotrSH(I, A, 8) ^ it.shrSH(I, A, 7), K = it.rotrSL(I, A, 1) ^ it.rotrSL(I, A, 8) ^ it.shrSL(I, A, 7), O = Qn[b - 2] | 0, R = Jn[b - 2] | 0, x = it.rotrSH(O, R, 19) ^ it.rotrBH(O, R, 61) ^ it.shrSH(O, R, 6), L = it.rotrSL(O, R, 19) ^ it.rotrBL(O, R, 61) ^ it.shrSL(O, R, 6), H = it.add4L(K, L, Jn[b - 7], Jn[b - 16]), q = it.add4H(H, P, x, Qn[b - 7], Qn[b - 16]);
      Qn[b] = q | 0, Jn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: v, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const I = it.rotrSH(l, g, 14) ^ it.rotrSH(l, g, 18) ^ it.rotrBH(l, g, 41), A = it.rotrSL(l, g, 14) ^ it.rotrSL(l, g, 18) ^ it.rotrBL(l, g, 41), P = l & f ^ ~l & w, K = g & y ^ ~g & v, O = it.add5L(_, A, K, PA[b], Jn[b]), R = it.add5H(O, T, I, P, NA[b], Qn[b]), x = O | 0, L = it.rotrSH(r, s, 28) ^ it.rotrBH(r, s, 34) ^ it.rotrBH(r, s, 39), H = it.rotrSL(r, s, 28) ^ it.rotrBL(r, s, 34) ^ it.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = v | 0, w = f | 0, v = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = it.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = it.add3L(x, H, Y);
      r = it.add3H(z, R, L, q), s = z | 0;
    }
    ({ h: r, l: s } = it.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = it.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = it.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = it.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = it.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = it.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: v } = it.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: T, l: _ } = it.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, v, T, _);
  }
  roundClean() {
    Qn.fill(0), Jn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class OA extends fa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class DA extends fa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class FA extends fa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Zr(() => new fa());
Zr(() => new OA());
const jA = Zr(() => new DA());
Zr(() => new FA());
function _p(t) {
  if (Mt(t).byteLength != ua)
    throw Error("Invalid signature");
  return {
    type: X.MessageSignature,
    data: t
  };
}
function Xs(t, e) {
  return { type: X.Address, version: t, hash160: e };
}
function ps(t) {
  return Wr.c32address(t.version, t.hash160);
}
function Fr(t, e, n) {
  const r = e || 1, s = n || VE;
  if (Yp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: X.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ql(t) {
  const e = Wr.c32addressDecode(t);
  return {
    type: X.Address,
    version: e[0],
    hash160: e[1]
  };
}
var U;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(U || (U = {}));
function zA(t) {
  if (t.type === U.PrincipalStandard)
    return ps(t.address);
  if (t.type === U.PrincipalContract)
    return `${ps(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Up(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return VA(e, n);
  } else
    return RA(t);
}
function RA(t) {
  const e = Ql(t);
  return { type: U.PrincipalStandard, address: e };
}
function GA(t) {
  return { type: U.PrincipalStandard, address: t };
}
function VA(t, e) {
  const n = Ql(t), r = Fr(e);
  return Hp(n, r);
}
function Hp(t, e) {
  if (js(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: U.PrincipalContract, address: t, contractName: e };
}
function Da(t, e = !1) {
  switch (t.type) {
    case U.BoolTrue:
      return !0;
    case U.BoolFalse:
      return !1;
    case U.Int:
    case U.UInt:
      return e ? t.value.toString() : t.value;
    case U.Buffer:
      return `0x${lt(t.buffer)}`;
    case U.OptionalNone:
      return null;
    case U.OptionalSome:
      return An(t.value);
    case U.ResponseErr:
      return An(t.value);
    case U.ResponseOk:
      return An(t.value);
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return zA(t);
    case U.List:
      return t.list.map((r) => An(r));
    case U.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = An(t.data[r]);
      }), n;
    case U.StringASCII:
      return t.data;
    case U.StringUTF8:
      return t.data;
  }
}
function An(t) {
  switch (t.type) {
    case U.ResponseErr:
      return { type: rr(t), value: Da(t, !0), success: !1 };
    case U.ResponseOk:
      return { type: rr(t), value: Da(t, !0), success: !0 };
    default:
      return { type: rr(t), value: Da(t, !0) };
  }
}
function rr(t) {
  switch (t.type) {
    case U.BoolTrue:
    case U.BoolFalse:
      return "bool";
    case U.Int:
      return "int";
    case U.UInt:
      return "uint";
    case U.Buffer:
      return `(buff ${t.buffer.length})`;
    case U.OptionalNone:
      return "(optional none)";
    case U.OptionalSome:
      return `(optional ${rr(t.value)})`;
    case U.ResponseErr:
      return `(response UnknownType ${rr(t.value)})`;
    case U.ResponseOk:
      return `(response ${rr(t.value)} UnknownType)`;
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return "principal";
    case U.List:
      return `(list ${t.list.length} ${t.list.length ? rr(t.list[0]) : "UnknownType"})`;
    case U.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${rr(t.data[e])})`).join(" ")})`;
    case U.StringASCII:
      return `(string-ascii ${$p(t.data).length})`;
    case U.StringUTF8:
      return `(string-utf8 ${js(t.data).length})`;
  }
}
const Np = () => ({ type: U.BoolTrue }), Pp = () => ({ type: U.BoolFalse }), KA = (t) => t ? Np() : Pp(), lh = BigInt("0xffffffffffffffffffffffffffffffff"), qA = BigInt(0), uh = BigInt("0x7fffffffffffffffffffffffffffffff"), fh = BigInt("-170141183460469231731687303715884105728"), WA = (t) => {
  const e = oe(t, !0);
  if (e > uh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${uh}`);
  if (e < fh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${fh}`);
  return { type: U.Int, value: e };
}, Uo = (t) => {
  const e = oe(t, !1);
  if (e < qA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > lh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${lh}`);
  return { type: U.UInt, value: e };
}, Op = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: U.Buffer, buffer: t };
};
function Dp() {
  return { type: U.OptionalNone };
}
function Fp(t) {
  return { type: U.OptionalSome, value: t };
}
function XA(t) {
  return { type: U.ResponseErr, value: t };
}
function YA(t) {
  return { type: U.ResponseOk, value: t };
}
function ZA(t) {
  return { type: U.List, list: t };
}
function Dc(t) {
  for (const e in t)
    if (!F8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: U.Tuple, data: t };
}
const us = (t) => ({ type: U.StringASCII, data: t }), QA = (t) => ({ type: U.StringUTF8, data: t });
class jp extends Cp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Sr.hash(e);
    const r = ql(n);
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
    return Sr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Sr.exists(this), Sr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const zp = (t, e, n) => new jp(t, e).update(n).digest();
zp.create = (t, e) => new jp(t, e);
Pt.hmacSha256Sync = (t, ...e) => {
  const n = zp.create(Zl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ts(t) {
  return {
    type: X.PublicKey,
    data: Mt(t)
  };
}
function JA(t, e, n = _t.Compressed) {
  const r = PE(e.data), s = new Se(th(r.r), th(r.s)), i = ct.fromSignature(t, s, r.recoveryId), o = n === _t.Compressed;
  return i.toHex(o);
}
function t8(t) {
  return { type: X.PublicKey, data: t };
}
function zs(t) {
  return !lt(t.data).startsWith("04");
}
function Ho(t) {
  return t.data.slice();
}
function e8(t) {
  const e = s8(t), n = bi(e.data.slice(0, 32), e.compressed);
  return Ts(lt(n));
}
function n8(t) {
  const e = typeof t == "string" ? t : lt(t), n = ct.fromHex(e).toHex(!0);
  return Ts(n);
}
function r8(t) {
  const e = typeof t == "string" ? t : lt(t), n = ct.fromHex(e).toHex(!1);
  return Ts(n);
}
function Fc(t) {
  const e = t.readUInt8(), n = e === 4 ? WE : qE;
  return t8(Ft([e, t.readBytes(n)]));
}
function s8(t) {
  const e = OE(t), n = e.length == vp;
  return { data: e, compressed: n };
}
function i8(t, e) {
  const [n, r] = Ro(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ai(r, 1) + Se.fromHex(n).toCompactHex();
  return _p(i);
}
function o8(t) {
  return e8(t.data);
}
function a8(t, e, n) {
  return typeof t == "string" && (t = Up(t)), typeof n == "string" && (n = ph(n)), {
    type: X.Payload,
    payloadType: at.TokenTransfer,
    recipient: t,
    amount: oe(e, !1),
    memo: n ?? ph("")
  };
}
function c8(t, e, n, r) {
  return typeof t == "string" && (t = Ql(t)), typeof e == "string" && (e = Fr(e)), typeof n == "string" && (n = Fr(n)), {
    type: X.Payload,
    payloadType: at.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function hh(t, e, n) {
  return typeof t == "string" && (t = Fr(t)), typeof e == "string" && (e = w8(e)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: at.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: X.Payload,
    payloadType: at.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function l8() {
  return { type: X.Payload, payloadType: at.PoisonMicroblock };
}
function dh(t, e) {
  if (t.byteLength != $r)
    throw Error(`Coinbase buffer size must be ${$r} bytes`);
  return e != null ? {
    type: X.Payload,
    payloadType: at.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: X.Payload,
    payloadType: at.Coinbase,
    coinbaseBytes: t
  };
}
function u8(t, e, n) {
  if (t.byteLength != $r)
    throw Error(`Coinbase buffer size must be ${$r} bytes`);
  if (n.byteLength != Uc)
    throw Error(`VRF proof buffer size must be ${Uc} bytes`);
  return {
    type: X.Payload,
    payloadType: at.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === U.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var jc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(jc || (jc = {}));
function f8(t, e, n, r, s, i, o) {
  return {
    type: X.Payload,
    payloadType: at.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Rp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case at.TokenTransfer:
      e.push(Ot(t.recipient)), e.push(lr(t.amount, !1, 8)), e.push(Sn(t.memo));
      break;
    case at.ContractCall:
      e.push(Sn(t.contractAddress)), e.push(Sn(t.contractName)), e.push(Sn(t.functionName));
      const n = new Uint8Array(4);
      Dr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ot(r));
      });
      break;
    case at.SmartContract:
      e.push(Sn(t.contractName)), e.push(Sn(t.codeBody));
      break;
    case at.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Sn(t.contractName)), e.push(Sn(t.codeBody));
      break;
    case at.PoisonMicroblock:
      break;
    case at.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case at.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ot(t.recipient));
      break;
    case at.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ot(t.recipient ? Fp(t.recipient) : Dp())), e.push(t.vrfProof);
      break;
    case at.TenureChange:
      e.push(Mt(t.tenureHash)), e.push(Mt(t.previousTenureHash)), e.push(Mt(t.burnViewHash)), e.push(Mt(t.previousTenureEnd)), e.push(Dr(new Uint8Array(4), t.previousTenureBlocks)), e.push(zE(new Uint8Array(1), t.cause)), e.push(Mt(t.publicKeyHash));
      break;
  }
  return Ft(e);
}
function h8(t) {
  switch (t.readUInt8Enum(at, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case at.TokenTransfer:
      const n = Me(t), r = oe(t.readBytes(8), !1), s = Vp(t);
      return a8(n, r, s);
    case at.ContractCall:
      const i = _s(t), o = Be(t), a = Be(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const I = Me(t);
        c.push(I);
      }
      return c8(i, o, a, c);
    case at.SmartContract:
      const h = Be(t), l = Be(t, 4, 1e5);
      return hh(h, l);
    case at.VersionedSmartContract: {
      const b = t.readUInt8Enum(Hc, (P) => {
        throw new Error(`Cannot recognize ClarityVersion: ${P}`);
      }), I = Be(t), A = Be(t, 4, 1e5);
      return hh(I, A, b);
    }
    case at.PoisonMicroblock:
      return l8();
    case at.Coinbase: {
      const b = t.readBytes($r);
      return dh(b);
    }
    case at.CoinbaseToAltRecipient: {
      const b = t.readBytes($r), I = Me(t);
      return dh(b, I);
    }
    case at.NakamotoCoinbase: {
      const b = t.readBytes($r), I = Me(t), A = t.readBytes(Uc);
      return u8(b, I, A);
    }
    case at.TenureChange:
      const g = lt(t.readBytes(20)), f = lt(t.readBytes(20)), y = lt(t.readBytes(20)), w = lt(t.readBytes(32)), v = t.readUInt32BE(), T = t.readUInt8Enum(jc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), _ = lt(t.readBytes(20));
      return f8(g, f, y, w, v, T, _);
  }
}
class ha extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class yr extends ha {
  constructor(e) {
    super(e);
  }
}
class me extends ha {
  constructor(e) {
    super(e);
  }
}
class No extends ha {
  constructor(e) {
    super(e);
  }
}
class Er extends ha {
  constructor(e) {
    super(e);
  }
}
var De;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(De || (De = {}));
function zc(t) {
  return _p(lt(t.readBytes(ua)));
}
function gs(t, e) {
  return {
    pubKeyEncoding: t,
    type: X.TransactionAuthField,
    contents: e
  };
}
function d8(t) {
  const e = t.readUInt8Enum(De, (n) => {
    throw new me(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case De.PublicKeyCompressed:
      return gs(_t.Compressed, Fc(t));
    case De.PublicKeyUncompressed:
      return gs(_t.Uncompressed, r8(Fc(t).data));
    case De.SignatureCompressed:
      return gs(_t.Compressed, zc(t));
    case De.SignatureUncompressed:
      return gs(_t.Uncompressed, zc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Jl(t) {
  return Mt(t.data);
}
function p8(t) {
  const e = [];
  switch (t.contents.type) {
    case X.PublicKey:
      e.push(t.pubKeyEncoding === _t.Compressed ? De.PublicKeyCompressed : De.PublicKeyUncompressed), e.push(Ho(n8(t.contents.data)));
      break;
    case X.MessageSignature:
      e.push(t.pubKeyEncoding === _t.Compressed ? De.SignatureCompressed : De.SignatureUncompressed), e.push(Jl(t.contents));
      break;
  }
  return Ft(e);
}
function Sn(t) {
  switch (t.type) {
    case X.Address:
      return $i(t);
    case X.Principal:
      return Gp(t);
    case X.LengthPrefixedString:
      return Us(t);
    case X.MemoString:
      return b8(t);
    case X.AssetInfo:
      return Kp(t);
    case X.PostCondition:
      return x8(t);
    case X.PublicKey:
      return Ho(t);
    case X.LengthPrefixedList:
      return nu(t);
    case X.Payload:
      return Rp(t);
    case X.TransactionAuthField:
      return p8(t);
    case X.MessageSignature:
      return Jl(t);
  }
}
function g8() {
  return {
    type: X.Address,
    version: _o.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function tu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === $t.SerializeP2WPKH || e === $t.SerializeP2WSH || e === $t.SerializeP2WSHNonSequential) && !r.every(zs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case $t.SerializeP2PKH:
      return Xs(t, N8(r[0].data));
    case $t.SerializeP2WPKH:
      return Xs(t, P8(r[0].data));
    case $t.SerializeP2SH:
    case $t.SerializeP2SHNonSequential:
      return Xs(t, O8(n, r.map(Ho)));
    case $t.SerializeP2WSH:
    case $t.SerializeP2WSHNonSequential:
      return Xs(t, D8(n, r.map(Ho)));
  }
}
function $i(t) {
  const e = [];
  return e.push(Mt(Ai(t.version, 1))), e.push(Mt(t.hash160)), Ft(e);
}
function _s(t) {
  const e = ca(lt(t.readBytes(1))), n = lt(t.readBytes(20));
  return { type: X.Address, version: e, hash160: n };
}
function Gp(t) {
  const e = [];
  return e.push(t.prefix), e.push($i(t.address)), t.prefix === fi.Contract && e.push(Us(t.contractName)), Ft(e);
}
function y8(t) {
  const e = t.readUInt8Enum(fi, (s) => {
    throw new me(`Unexpected Principal payload type: ${s}`);
  }), n = _s(t);
  if (e === fi.Standard)
    return { type: X.Principal, prefix: e, address: n };
  const r = Be(t);
  return {
    type: X.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Us(t) {
  const e = [], n = js(t.content), r = n.byteLength;
  return e.push(Mt(Ai(r, t.lengthPrefixBytes))), e.push(n), Ft(e);
}
function Be(t, e, n) {
  e = e || 1;
  const r = ca(lt(t.readBytes(e))), s = Kl(t.readBytes(r));
  return Fr(s, e, n ?? 128);
}
function w8(t) {
  return Fr(t, 4, 1e5);
}
function ph(t) {
  if (t && Yp(t, Mo))
    throw new Error(`Memo exceeds maximum length of ${Mo} bytes`);
  return { type: X.MemoString, content: t };
}
function b8(t) {
  const e = [], n = js(t.content), r = H8(lt(n), Mo * 2);
  return e.push(Mt(r)), Ft(e);
}
function Vp(t) {
  let e = Kl(t.readBytes(Mo));
  return e = e.replace(/\u0000*$/, ""), { type: X.MemoString, content: e };
}
function Kp(t) {
  const e = [];
  return e.push($i(t.address)), e.push(Us(t.contractName)), e.push(Us(t.assetName)), Ft(e);
}
function Rc(t) {
  return {
    type: X.AssetInfo,
    address: _s(t),
    contractName: Be(t),
    assetName: Be(t)
  };
}
function eu(t, e) {
  return {
    type: X.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function nu(t) {
  const e = t.values, n = [];
  n.push(Mt(Ai(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Sn(r));
  return Ft(n);
}
function qp(t, e, n) {
  const r = ca(lt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case X.Address:
        s.push(_s(t));
        break;
      case X.LengthPrefixedString:
        s.push(Be(t));
        break;
      case X.MemoString:
        s.push(Vp(t));
        break;
      case X.AssetInfo:
        s.push(Rc(t));
        break;
      case X.PostCondition:
        s.push(m8(t));
        break;
      case X.PublicKey:
        s.push(Fc(t));
        break;
      case X.TransactionAuthField:
        s.push(d8(t));
        break;
    }
  return eu(s, n);
}
function x8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Gp(t.principal)), (t.conditionType === he.Fungible || t.conditionType === he.NonFungible) && e.push(Kp(t.assetInfo)), t.conditionType === he.NonFungible && e.push(Ot(t.assetName)), e.push(t.conditionCode), t.conditionType === he.STX || t.conditionType === he.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new yr("The post-condition amount may not be larger than 8 bytes");
    e.push(lr(t.amount, !1, 8));
  }
  return Ft(e);
}
function m8(t) {
  const e = t.readUInt8Enum(he, (o) => {
    throw new me(`Could not read ${o} as PostConditionType`);
  }), n = y8(t);
  let r, s, i;
  switch (e) {
    case he.STX:
      return r = t.readUInt8Enum(ui, (a) => {
        throw new me(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${lt(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: he.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case he.Fungible:
      return s = Rc(t), r = t.readUInt8Enum(ui, (a) => {
        throw new me(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${lt(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: he.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case he.NonFungible:
      s = Rc(t);
      const o = Me(t);
      return r = t.readUInt8Enum(Nc, (a) => {
        throw new me(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: he.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function un(t, e) {
  return Ft([t, e]);
}
function S8(t) {
  return new Uint8Array([t.type]);
}
function E8(t) {
  return t.type === U.OptionalNone ? new Uint8Array([t.type]) : un(t.type, Ot(t.value));
}
function A8(t) {
  const e = new Uint8Array(4);
  return Dr(e, t.buffer.length, 0), un(t.type, la(e, t.buffer));
}
function $8(t) {
  const e = Vl(ME(t.value, BigInt(KE)), Ip);
  return un(t.type, e);
}
function v8(t) {
  const e = Vl(t.value, Ip);
  return un(t.type, e);
}
function I8(t) {
  return un(t.type, $i(t.address));
}
function L8(t) {
  return un(t.type, la($i(t.address), Us(t.contractName)));
}
function C8(t) {
  return un(t.type, Ot(t.value));
}
function k8(t) {
  const e = [], n = new Uint8Array(4);
  Dr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ot(r);
    e.push(s);
  }
  return un(t.type, Ft(e));
}
function B8(t) {
  const e = [], n = new Uint8Array(4);
  Dr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Fr(s);
    e.push(Us(i));
    const o = Ot(t.data[s]);
    e.push(o);
  }
  return un(t.type, Ft(e));
}
function Wp(t, e) {
  const n = [], r = e == "ascii" ? $p(t.data) : js(t.data), s = new Uint8Array(4);
  return Dr(s, r.length, 0), n.push(s), n.push(r), un(t.type, Ft(n));
}
function M8(t) {
  return Wp(t, "ascii");
}
function T8(t) {
  return Wp(t, "utf8");
}
function Ot(t) {
  switch (t.type) {
    case U.BoolTrue:
    case U.BoolFalse:
      return S8(t);
    case U.OptionalNone:
    case U.OptionalSome:
      return E8(t);
    case U.Buffer:
      return A8(t);
    case U.UInt:
      return v8(t);
    case U.Int:
      return $8(t);
    case U.PrincipalStandard:
      return I8(t);
    case U.PrincipalContract:
      return L8(t);
    case U.ResponseOk:
    case U.ResponseErr:
      return C8(t);
    case U.List:
      return k8(t);
    case U.Tuple:
      return B8(t);
    case U.StringASCII:
      return M8(t);
    case U.StringUTF8:
      return T8(t);
    default:
      throw new yr("Unable to serialize. Invalid Clarity Value.");
  }
}
function _8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const gh = /* @__PURE__ */ new Map();
function Xp(t, e) {
  const n = gh.get(t);
  if (n !== void 0)
    return n(e);
  const r = _8(t);
  return gh.set(t, r), Xp(t, e);
}
class ti {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return RE(this.readBytes(4), 0);
  }
  readUInt8() {
    return jE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return DE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = lt(n);
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
    if (Xp(e, r))
      return r;
    throw n(r);
  }
}
function Me(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ti(Mt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ti(t) : e = t;
  switch (e.readUInt8Enum(U, (r) => {
    throw new me(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case U.Int:
      return WA(e.readBytes(16));
    case U.UInt:
      return Uo(e.readBytes(16));
    case U.Buffer:
      const r = e.readUInt32BE();
      return Op(e.readBytes(r));
    case U.BoolTrue:
      return Np();
    case U.BoolFalse:
      return Pp();
    case U.PrincipalStandard:
      const s = _s(e);
      return GA(s);
    case U.PrincipalContract:
      const i = _s(e), o = Be(e);
      return Hp(i, o);
    case U.ResponseOk:
      return YA(Me(e));
    case U.ResponseErr:
      return XA(Me(e));
    case U.OptionalNone:
      return Dp();
    case U.OptionalSome:
      return Fp(Me(e));
    case U.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Me(e));
      return ZA(c);
    case U.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const v = Be(e).content;
        if (v === void 0)
          throw new me('"content" is undefined');
        h[v] = Me(e);
      }
      return Dc(h);
    case U.StringASCII:
      const l = e.readUInt32BE(), g = HE(e.readBytes(l));
      return us(g);
    case U.StringUTF8:
      const f = e.readUInt32BE(), y = Kl(e.readBytes(f));
      return QA(y);
    default:
      throw new me("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const U8 = (t) => t.length % 2 == 0 ? t : `0${t}`, H8 = (t, e) => t.padEnd(e, "0"), Yp = (t, e) => t ? js(t).length > e : !1;
function Gc(t) {
  return g0(t);
}
const hi = (t) => uA(Zl(t)), ru = (t) => lt(jA(t)), N8 = (t) => lt(hi(t)), P8 = (t) => {
  const e = hi(t), n = la(new Uint8Array([0]), new Uint8Array([e.length]), e), r = hi(n);
  return lt(r);
}, O8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ft(n), s = hi(r);
  return lt(s);
}, D8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ft(n), s = Zl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ft(i), a = hi(o);
  return lt(a);
};
function F8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Zp(t) {
  const e = Ot(t);
  return `0x${lt(e)}`;
}
function j8(t) {
  return Me(t);
}
const ws = (t) => {
  try {
    return Wr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function su() {
  return {
    type: X.MessageSignature,
    data: lt(new Uint8Array(ua))
  };
}
function Qp(t, e, n, r) {
  const s = tu(0, t, 1, [Ts(e)]).hash160, i = zs(Ts(e)) ? _t.Compressed : _t.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: oe(n, !1),
    fee: oe(r, !1),
    keyEncoding: i,
    signature: su()
  };
}
function di(t) {
  return "signature" in t;
}
function yh(t) {
  return t === $t.SerializeP2SH || t === $t.SerializeP2WSH;
}
function z8(t) {
  return t === $t.SerializeP2SHNonSequential || t === $t.SerializeP2WSHNonSequential;
}
function wh(t) {
  const e = Gc(t);
  return e.nonce = 0, e.fee = 0, di(e) ? e.signature = su() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function R8(t) {
  const e = [
    t.hashMode,
    Mt(t.signer),
    lr(t.nonce, !1, 8),
    lr(t.fee, !1, 8),
    t.keyEncoding,
    Jl(t.signature)
  ];
  return Ft(e);
}
function G8(t) {
  const e = [
    t.hashMode,
    Mt(t.signer),
    lr(t.nonce, !1, 8),
    lr(t.fee, !1, 8)
  ], n = eu(t.fields);
  e.push(nu(n));
  const r = new Uint8Array(2);
  return FE(r, t.signaturesRequired, 0), e.push(r), Ft(e);
}
function V8(t, e) {
  const n = lt(e.readBytes(20)), r = BigInt(`0x${lt(e.readBytes(8))}`), s = BigInt(`0x${lt(e.readBytes(8))}`), i = e.readUInt8Enum(_t, (a) => {
    throw new me(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === $t.SerializeP2WPKH && i != _t.Compressed)
    throw new me("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = zc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function K8(t, e) {
  const n = lt(e.readBytes(20)), r = BigInt("0x" + lt(e.readBytes(8))), s = BigInt("0x" + lt(e.readBytes(8))), i = qp(e, X.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case X.PublicKey:
        zs(u.contents) || (o = !0);
        break;
      case X.MessageSignature:
        if (u.pubKeyEncoding === _t.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Er("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === $t.SerializeP2WSH || t === $t.SerializeP2WSHNonSequential))
    throw new Er("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Fa(t) {
  return di(t) ? R8(t) : G8(t);
}
function ja(t) {
  const e = t.readUInt8Enum($t, (n) => {
    throw new me(`Could not parse ${n} as AddressHashMode`);
  });
  return e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH ? V8(e, t) : K8(e, t);
}
function Jp(t, e, n, r) {
  const i = t + lt(new Uint8Array([e])) + lt(lr(n, !1, 8)) + lt(lr(r, !1, 8));
  if (Mt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ru(Mt(i));
}
function tg(t, e, n) {
  const r = 33 + ua, s = zs(e) ? _t.Compressed : _t.Uncompressed, i = t + U8(s.toString(16)) + n.data, o = Mt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ru(o);
}
function q8(t, e, n, r, s) {
  const i = Jp(t, e, n, r), o = i8(s, i), a = o8(s), c = tg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function eg(t, e, n, r, s, i) {
  const o = Jp(t, e, n, r), a = Ts(JA(o, i, s)), c = tg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function W8() {
  const t = Qp($t.SerializeP2PKH, "", 0, 0);
  return t.signer = g8().hash160, t.keyEncoding = _t.Compressed, t.signature = su(), t;
}
function bh(t, e, n) {
  return di(t) ? X8(t, e, n) : Y8(t, e, n);
}
function X8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = eg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = tu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Er(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Y8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case X.PublicKey:
        zs(c.contents) || (i = !0), r.push(c.contents);
        break;
      case X.MessageSignature:
        c.pubKeyEncoding === _t.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = eg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (yh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new Er("Too many signatures");
        break;
    }
  if (yh(t.hashMode) && o !== t.signaturesRequired || z8(t.hashMode) && o < t.signaturesRequired)
    throw new Er("Incorrect number of signatures");
  if (i && (t.hashMode === $t.SerializeP2WSH || t.hashMode === $t.SerializeP2WSHNonSequential))
    throw new Er("Uncompressed keys are not allowed in this hash mode");
  const a = tu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Er(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ng(t) {
  return {
    authType: Nt.Standard,
    spendingCondition: t
  };
}
function rg(t, e) {
  return {
    authType: Nt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Qp($t.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function xh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Nt.Standard:
        return ng(wh(t.spendingCondition));
      case Nt.Sponsored:
        return rg(wh(t.spendingCondition), W8());
      default:
        throw new No("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Z8(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      return bh(t.spendingCondition, e, Nt.Standard);
    case Nt.Sponsored:
      return bh(t.spendingCondition, e, Nt.Standard);
    default:
      throw new No("Invalid origin auth type");
  }
}
function Q8(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: oe(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Nt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: oe(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function J8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: oe(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function t6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: oe(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e6(t, e) {
  const n = {
    ...e,
    nonce: oe(e.nonce, !1),
    fee: oe(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function n6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Nt.Standard:
      e.push(Fa(t.spendingCondition));
      break;
    case Nt.Sponsored:
      e.push(Fa(t.spendingCondition)), e.push(Fa(t.sponsorSpendingCondition));
      break;
  }
  return Ft(e);
}
function r6(t) {
  const e = t.readUInt8Enum(Nt, (r) => {
    throw new me(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Nt.Standard:
      return n = ja(t), ng(n);
    case Nt.Sponsored:
      n = ja(t);
      const r = ja(t);
      return rg(n, r);
  }
}
class s6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: oe(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? GE, this.postConditionMode = i ?? Ms.Deny, this.postConditions = s ?? eu([]), o)
      this.anchorMode = XE(o);
    else
      switch (r.payloadType) {
        case at.Coinbase:
        case at.CoinbaseToAltRecipient:
        case at.NakamotoCoinbase:
        case at.PoisonMicroblock:
        case at.TenureChange:
          this.anchorMode = fe.OnChainOnly;
          break;
        case at.ContractCall:
        case at.SmartContract:
        case at.VersionedSmartContract:
        case at.TokenTransfer:
          this.anchorMode = fe.Any;
          break;
      }
  }
  signBegin() {
    const e = Gc(this);
    return e.auth = xh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Gc(this);
    return e.auth = xh(e.auth), e.txid();
  }
  verifyOrigin() {
    return Z8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Nt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Nt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Nt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !di(n)) {
      const r = zs(e);
      n.fields.push(gs(r ? _t.Compressed : _t.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = q8(n, r, e.fee, e.nonce, s);
    return di(e) ? e.signature = i : e.fields.push(gs(s.data.byteLength === vp ? _t.Compressed : _t.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return ru(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Nt.Sponsored)
      throw new No("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e6(this.auth, e);
  }
  setFee(e) {
    this.auth = Q8(this.auth, e);
  }
  setNonce(e) {
    this.auth = J8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Nt.Sponsored)
      throw new No("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new yr('"version" is undefined');
    if (this.chainId === void 0)
      throw new yr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new yr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new yr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new yr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Dr(n, this.chainId, 0), e.push(n), e.push(n6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(nu(this.postConditions)), e.push(Rp(this.payload)), Ft(e);
  }
}
function iu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ti(Mt(t.slice(2))) : e = new ti(Mt(t)) : t instanceof Uint8Array ? e = new ti(t) : e = t;
  const n = e.readUInt8Enum(To, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = r6(e), i = e.readUInt8Enum(fe, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ms, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = qp(e, X.PostCondition), c = h8(e);
  return new s6(n, s, c, a, o, i, r);
}
const i6 = KA, ei = Uo, o6 = Op;
const a6 = /* @__PURE__ */ new Set([4001, -31001]), c6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], l6 = ["result", "data", "payload", "response", "params"], mh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], da = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Qr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, vn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, u6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), sg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => u6(i, r)) === s
  );
}, ig = (t) => t ? sg(Qr()).some(
  (e) => {
    var n;
    return e.id === t && (da(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, og = () => {
  if (typeof window > "u")
    return;
  const t = Qr(), e = sg(t).filter(
    (n) => {
      var r;
      return da(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = vn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of c6) {
    const r = vn(t, n) ?? (t === window ? void 0 : vn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, f6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Qr(), n = vn(e, t) ?? (e === window ? void 0 : vn(window, t)) ?? Jo(t);
  if (n)
    return n;
  if (da(t) || ig(t))
    return og();
}, eo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, h6 = ["blockstack-session", "blockstack"], d6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of h6) {
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
d6();
const ag = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, xe = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, p6 = (t) => {
  const e = xe(t);
  if (!e)
    return null;
  const n = ag(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, g6 = (t) => {
  const e = xe(t);
  if (!e)
    return null;
  const n = ag(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Vc = (t, e = "mainnet") => {
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
      return Vc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Vc(r, e);
  }
  return e;
}, vr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, pi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ws(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = pi(s, e + 1);
      if (i)
        return i;
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
  for (const s of r) {
    if (!(s in n))
      continue;
    const i = pi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && ws(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ws(n.testnet) ? n.testnet.trim() : null;
}, Sh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, cg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && a6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, jr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = xe(n == null ? void 0 : n.message) ?? xe(e.message) ?? xe(e.error) ?? xe(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Hs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw jr(e);
    if (e.status === "error")
      throw jr(e.result ?? e);
  }
  return t;
}, Eh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Hs(r);
  } catch (r) {
    throw jr(r);
  }
}, lg = () => og(), ou = () => {
  if (typeof window > "u")
    return;
  const t = Qr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = vn(t, e) ?? (t === window ? void 0 : vn(window, e));
    if (n)
      return n;
  }
}, Ah = () => {
  if (typeof window > "u")
    return;
  const t = ou();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Qr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = vn(e, n) ?? (e === window ? void 0 : vn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, fo = (t) => {
  var r, s;
  const e = Tr();
  if (da(e) || ig(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Qr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === lg();
}, za = (t) => {
  const e = g6(t);
  if (!e)
    return null;
  try {
    const n = iu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Po = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = za(t), r = p6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? xe(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Po(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of mh)
    if (za(s[a])) {
      i = xe(s[a]);
      break;
    }
  const o = xe(s.txId) || xe(s.txid) || xe(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? xe(s.txRaw) ?? void 0
    };
  for (const a of mh) {
    const c = za(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: xe(s[a]) ?? void 0
      };
  }
  for (const a of l6) {
    const c = s[a], u = Po(c, e + 1);
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
}, Ra = (t) => {
  const e = Po(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, y6 = (t) => {
  const e = Po(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, w6 = (t) => ({
  ...t,
  fee: vr(t.fee),
  nonce: vr(t.nonce),
  sponsored: t.sponsored === !0
}), $h = (t) => ({
  recipient: t.recipient,
  amount: vr(t.amount) ?? "0",
  memo: t.memo,
  network: Vc(t.network),
  address: t.stxAddress,
  fee: vr(t.fee),
  nonce: vr(t.nonce),
  sponsored: t.sponsored ?? !1
}), ug = "WALLET_ADDRESS_MISMATCH", b6 = 45e3;
let ni = null;
const Kc = (t) => {
  t && (ni = { address: t, at: Date.now() });
}, x6 = () => {
  ni = null;
}, m6 = () => ni && Date.now() - ni.at <= b6 ? ni.address : null, S6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, E6 = async (t) => {
  x6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Hs(await t.request("wallet_connect")), n = pi(e);
  return Kc(n), n;
}, A6 = async (t, e, n, r) => {
  try {
    return Hs(await t.request(e, n));
  } catch (s) {
    const i = jr(s);
    if (!S6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await E6(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), i;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : i.message
        ),
        { code: o ? ug : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Hs(await t.request(e, n));
    } catch (a) {
      throw jr(a);
    }
  }
};
let vh = 3e4;
const $6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${vh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, vh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, v6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: ug }
      );
    return c;
  }, s = m6();
  if (s)
    return eo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  eo(n, "account-read");
  try {
    const c = Hs(
      await $6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = pi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (cg(c))
      throw jr(c);
    eo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Kc(i), r(i, "wallet_getAccount");
  let o;
  eo(n, "account-reconnect");
  try {
    o = Hs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), jr(c);
  }
  const a = pi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Kc(a), r(a, "wallet_connect");
}, I6 = async (t, e) => {
  if (!fo(t)) {
    const i = await Eh(
      t,
      "stx_transferStx",
      $h(e)
    );
    return Ra(i);
  }
  const n = ou();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Eh(
      n,
      "stx_transferStx",
      $h(e)
    );
    return Ra(i);
  }
  const r = lg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await v6(r, e.stxAddress);
  const s = await A6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: vr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: vr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ra(s);
}, L6 = () => Tr(), fg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Tr(), e = t ? f6(t) : void 0;
  if (e)
    return e;
  const n = Qr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, C6 = (t, e) => {
  const n = fg(), r = w6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, y6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Zi(r, e);
  if (fo(n) && !ou()) {
    const s = Ah();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Tr(),
        route: "legacy-transaction-request"
      }), Zi(r, s);
  }
  return void I6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Sh(s) && fo(n)) {
      const a = Ah();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Tr(),
          route: "legacy-transaction-request"
        }), Zi(r, a);
        return;
      }
    }
    if (Sh(s) && !fo(n)) {
      Zi(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), cg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Ih = (t) => Zp(t).replace(/^0x/, ""), Lh = "This wallet cannot sign messages. Try Xverse or Leather.", Ch = (t) => typeof (t == null ? void 0 : t.request) == "function", kh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", k6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, B6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function M6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ih(e.message),
    domain: Ih(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function T6(t, e) {
  const n = await $E({
    domain: e.domain,
    message: e.message,
    network: aa(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _6(t) {
  var s, i;
  const e = L6() || "", n = /xverse/i.test(e);
  let r = fg();
  if (n && !kh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (kh(r))
    try {
      return await T6(r, t);
    } catch (o) {
      if (n || !Ch(r) || !B6(o)) throw o;
    }
  if (!n && Ch(r))
    try {
      return await M6(r, t);
    } catch (o) {
      throw k6(o) ? new Error(Lh) : o;
    }
  throw new Error(Lh);
}
const Bh = 1000000n, ri = 1000000n, qc = 50n, Oo = 3000n, au = 300n, U6 = 3000n, H6 = 50000n, Mh = 200n, gi = (t) => t + qc;
function tr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Bh}.${(n % Bh).toString().padStart(6, "0")}`;
}
function N6(t, e = au) {
  return t <= Oo ? 0 : Number((t - Oo) / gi(e));
}
function Th(t, e = 0n) {
  const n = ri - t - e;
  return n > 0n ? n : 0n;
}
function P6(t, e = au) {
  return t > ri ? "over" : t < Oo + gi(e) ? "empty" : t < H6 ? "low" : "ok";
}
const O6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", D6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", F6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function j6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || F6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== O6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const hg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ga = 3, z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Wc, dg] = hg.split("."), Le = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Xc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function R6(t) {
  return Le(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function zr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function pg(t, e = []) {
  const n = await zr(`/v2/contracts/call-read/${Wc}/${dg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Wc, arguments: e.map((r) => "0x" + Le(Ot(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return An(Me(n.result));
}
async function G6() {
  const t = await zr(`/v2/contracts/source/${Wc}/${dg}?proof=0`);
  if (typeof t.source != "string" || await R6(t.source) !== D6) throw Error("Deployed source does not match the tested helper.");
  if (j6(await pg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function gg(t) {
  return t.startsWith("SP") && ws(t) && !t.includes(".");
}
async function V6(t) {
  var r;
  if (!gg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await zr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await zr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function K6(t) {
  const e = await zr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function q6(t, e) {
  var s, i;
  const n = await pg("get-owner", [ei(t), ei(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !gg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function W6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Xc(t), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== e.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function X6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function Y6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = iu(Xc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ps(Xs(_o.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || ps(r.contractAddress) + "." + r.contractName.content !== hg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Le(Ot(r.functionArgs[0])) !== Le(Ot(ei(t.core))) || Le(Ot(r.functionArgs[1])) !== Le(Ot(ei(t.song))) || Le(Ot(r.functionArgs[2])) !== Le(Ot(o6(Xc(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ms.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ui.Equal || i.principal.prefix !== 2 || ps(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ps(r.contractAddress) + "." + r.contractName.content !== z6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Le(Ot(r.functionArgs[0])) !== Le(Ot(ei(t.song))) || typeof t.liked != "boolean" || Le(Ot(r.functionArgs[1])) !== Le(Ot(i6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ms.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || An(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const Z6 = "xtrata.xyz/radio/listening-wallet", Q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Do = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ws(t), J6 = (t) => ({
  domain: Dc({ name: us(Z6), version: us("1"), "chain-id": Uo(1) }),
  message: Dc({
    purpose: us(Q6),
    main: us(t.main),
    listening: us(t.listening),
    issued: Uo(t.issued)
  })
}), _h = ["prepared", "signed", "unknown", "pending"], t5 = 30 * 6e4, cs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, e5 = 3e3, Uh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function n5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, h = !1, l = !1, g = null, f = !1, y = "", w = "", v, T = null, _, b = [], I, A = -1 / 0;
  const P = /* @__PURE__ */ new Set();
  let K = null, O = !1, R = 0, x = !1, L = !1, H = !1, q = !1, Y = 0, z = null, ee = Promise.resolve();
  const Vt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? au.toString()), Zt = (m) => !!i && !(i.features ?? []).includes(m), S = (m, B) => `xtrata.ppp.v1.${m}:${B}`, k = (m = i == null ? void 0 : i.address) => {
    if (!m) return [];
    try {
      const B = JSON.parse(t.store.get(S("entries", m)) || "[]");
      return Array.isArray(B) ? B : [];
    } catch {
      return [];
    }
  }, Q = (m) => {
    const B = [m, ...k(m.address).filter((G) => !(G.txid === m.txid && G.kind === m.kind))].slice(0, 200);
    t.store.set(S("entries", m.address), JSON.stringify(B));
  }, gt = (m = i == null ? void 0 : i.address) => !!m && t.store.get(S("on", m)) !== "0", ht = (m) => {
    i != null && i.address && t.store.set(S("on", i.address), m ? "1" : "0");
  }, St = () => k().filter((m) => _h.includes(m.status)), ae = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(S("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, fn = (m) => {
    i != null && i.address && t.store.set(S("deposit", i.address), JSON.stringify(m));
  }, kn = () => St().filter((m) => t.now() - m.created > t5 && P.has(m.txid)), Jr = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), qt = () => Jr() && !(i != null && i.linked), $e = () => {
    const m = t.main();
    return !qt() && !!m && !!(i != null && i.linked) && i.linked !== m;
  }, hn = (m) => S("return-to", m), ts = (m = i == null ? void 0 : i.address) => {
    if (!m) return;
    const B = t.store.get(hn(m));
    return B && Do(B) && B !== m ? B : void 0;
  }, dn = (m = i == null ? void 0 : i.address) => K && K.for === m ? K.res : null;
  function d() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const m = ts();
    if (m) return { to: m, kind: "chosen" };
    const B = dn();
    if (B != null && B.ok && B.funder) return { to: B.funder, kind: "funder" };
  }
  function $() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const m = t.main();
    if (!qt()) {
      if (!m) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : $e() ? "wrong-wallet" : i.state === "known" ? "locked" : !qt() && i.linked !== m ? "link" : o === void 0 ? "loading" : o > ri ? "over" : o < Oo + gi(Vt()) ? "fund" : "ready" : "loading";
  }
  const M = () => {
    var m, B, G, yt;
    return {
      step: $(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : P6(o, Vt()),
      playsLeft: o === void 0 ? 0 : N6(o, Vt()),
      allowance: o === void 0 ? ri : Th(o, BigInt(((m = ae()) == null ? void 0 : m.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: gt(),
      entries: k(),
      depositTxid: ((B = ae()) == null ? void 0 : B.txid) ?? v,
      depositPending: !!ae(),
      walletOutdated: Zt("like"),
      linkedListening: I && I === t.main() ? b.map((V) => V.listening) : [],
      serverLinked: !!T && _ === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: kn().length,
      armed: H,
      queued: Ut.length,
      solo: qt(),
      returnTo: (G = d()) == null ? void 0 : G.to,
      returnToKind: (yt = d()) == null ? void 0 : yt.kind,
      funderState: (() => {
        const V = dn();
        return V ? V.ok ? V.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const V = dn();
        return !!V && V.ok && V.distinct > 1;
      })(),
      walletCannotSolo: qt() && Zt("standalone"),
      walletCannotMulti: Zt("multi")
    };
  }, N = (m, B = "") => {
    y = m, w = B, t.changed();
  };
  async function tt(m, B) {
    if (!c) {
      c = m, w = "", t.changed();
      try {
        await B();
      } catch (G) {
        const yt = G instanceof Error ? G.message : String(G);
        w = /Cancelled in the listening wallet/.test(yt) ? "" : yt, w || (y = "Not now. Nothing was signed.", q = !0);
      } finally {
        c = null, await ot(!0);
      }
    }
  }
  const Lt = () => !!(e != null && e.enabled) && e.here && (qt() || !!t.main() && e.allowed), Qt = () => Lt() && !$e(), zt = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", ve = () => {
    if ($e()) throw new Error(zt());
  };
  async function pn() {
    if (!Lt()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Rt = (m) => {
    const B = t.main();
    return m.request("listening.status", B ? { main: B } : void 0);
  };
  async function Te(m = !1) {
    i != null && i.address && (!m && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function ce(m) {
    if ((I !== m || t.now() - A >= 6e4) && (b = await t.links(m), I = m, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === m) return;
    const B = `${m}:${i.address}`;
    _ === B && T || (T = b.find((G) => G.listening === i.address) ?? null, _ = B);
  }
  async function fr() {
    const m = i == null ? void 0 : i.address;
    if (!qt() || !m || i != null && i.linked || !t.funder || O || !o || o <= 0n) return;
    const B = dn(m);
    if (B != null && B.ok && B.funder) return;
    const G = B != null && B.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, R - 1), 30 * 6e4);
    if (!(K && K.for === m && t.now() - K.at < G)) {
      O = !0;
      try {
        K = { for: m, res: await t.funder(m), at: t.now() };
      } catch {
        K = { for: m, res: { ok: !1 }, at: t.now() };
      } finally {
        O = !1;
      }
      R = K.res.ok ? 0 : R + 1;
    }
  }
  async function Re() {
    var yt;
    const m = i == null ? void 0 : i.address;
    if (!m) return;
    let B;
    for (const V of St())
      try {
        const Et = await t.chain.transaction(V.txid);
        if (!Et) {
          if (P.add(V.txid), t.now() - V.created > 15 * 6e4 && (B ?? (B = await t.chain.confirmedNonce(m))), B !== void 0 && B > BigInt(V.nonce)) {
            Q({ ...V, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((V.status === "unknown" || V.status === "signed") && V.raw)
            try {
              await t.chain.broadcast(V.raw, V.txid), Q({ ...V, status: "pending" });
            } catch (Ct) {
              cs(Ct) && Q({ ...V, status: "failed", note: Ct.message, raw: void 0 });
            }
          continue;
        }
        P.delete(V.txid);
        const ut = String(Et.tx_status);
        if (ut === "success" && Et.canonical !== !1 && Et.is_unanchored === !1) {
          if (Q({ ...V, status: "confirmed", confirmedAt: t.now(), actualFee: String(Et.fee_rate ?? V.fee), raw: void 0 }), V.kind === "like" && (f = !0, V.status !== "confirmed" && typeof V.liked == "boolean"))
            try {
              (yt = t.likeConfirmed) == null || yt.call(t, V.song, V.liked);
            } catch {
            }
        } else ut.startsWith("abort_") || ut.startsWith("dropped_") ? Q({ ...V, status: "failed", note: ut, raw: void 0 }) : V.status !== "pending" && Q({ ...V, status: "pending" });
      } catch {
      }
    const G = ae();
    if (G)
      try {
        const V = await t.chain.transaction(G.txid), Et = String((V == null ? void 0 : V.tx_status) ?? "");
        (Et === "success" && V.is_unanchored === !1 || Et.startsWith("abort_") || Et.startsWith("dropped_") || !V && t.now() - G.at > 2 * 36e5) && (fn(null), a = -1 / 0);
      } catch {
      }
  }
  async function ot(m = !1) {
    var B;
    try {
      const G = t.main();
      if ((m || !e || r !== G || t.now() - n > 3e5) && (e = await t.config(G), n = t.now(), r = G), !e.enabled || !e.here || !qt() && (!G || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), H && pe(), t.changed();
        return;
      }
      await pn(), i = await Rt(s), $e() && i.state === "unlocked" && (Ve(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Rt(s)), G && e.allowed && await ce(G), await Te(m), await fr(), await Re();
    } catch (G) {
      w = G instanceof Error ? G.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if ($() === "locked" ? jt() : H && pe(), f) {
      f = !1;
      try {
        (B = t.likesChanged) == null || B.call(t);
      } catch {
      }
    }
    t.changed(), Ut.length && !_e && D();
  }
  async function xt(m, B) {
    var Et;
    ve();
    const G = !(i != null && i.address) || gt(i.address), yt = i != null && i.linked ? (Et = t.nameOf) == null ? void 0 : Et.call(t, i.linked) : void 0;
    await m.request("listening.unlock", { mode: "unlock", terms: G ? gn() : void 0, anyPasskey: B, ...t.main() ? { main: t.main() } : {}, ...yt ? { label: yt } : {} }), i = await Rt(m), G && (gt(i.address) ? await Bn() : await m.request("listening.stop")), N(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const V = g;
    g = null, V && t.now() - V.at < 12e4 && setTimeout(() => void ot(!0).then(() => Rs(V)), 0);
  }
  function jt() {
    H || c || q || Y >= 3 || !s || !(i != null && i.address) || (H = !0, ee = (async () => {
      try {
        await xt(s, !1), Y = 0;
      } catch (m) {
        const B = m instanceof Error ? m.message : String(m);
        /Cancelled in the listening wallet/.test(B) ? z || (q = !0, N("Not now. Nothing was signed.")) : /did not answer/.test(B) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Y++, w = B);
      } finally {
        H = !1;
        const m = z;
        z = null, m ? await m() : await ot(!0);
      }
    })());
  }
  async function pe(m) {
    H && (z = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ee), m && await m(), t.changed();
  }
  const gn = () => ({
    fee: Vt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ri.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Bn() {
    if (!(i != null && i.address)) return !1;
    if (L || (L = await t.tabLock(i.address)), !L)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const es = {
    forceRefresh: () => ot(!0),
    create: () => tt("Waiting for your passkey…", async () => {
      const m = await pn();
      await m.request("listening.unlock", { mode: "create", terms: gn(), ...t.main() ? { main: t.main() } : {} }), i = await Rt(m), ht(!0), N(qt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Bn();
    }),
    unlock: (m = !1) => {
      const B = () => tt("Waiting for your passkey…", async () => xt(await pn(), m));
      return H ? m ? Zt("cancel") ? (N("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : pe(async () => {
        ($() === "locked" || $() === "intro") && await B();
      }) : ee : B();
    },
    link: () => tt("Sign in your wallet…", async () => {
      ve();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const B = (await t.links(m)).find((G) => G.listening === i.address);
      if (B)
        await s.request("listening.link", { main: m, issued: B.issued, mainSignature: B.mainSignature });
      else {
        const G = { main: m, listening: i.address, issued: t.now() }, yt = await t.signWithMain(m, J6(G)), V = await s.request("listening.link", { main: m, issued: G.issued, mainSignature: yt });
        await t.saveLink({ ...G, mainSignature: yt, listeningSignature: V.listeningSignature }), A = -1 / 0;
      }
      N("Linked ✓");
    }),
    deposit: () => tt("Approve the deposit in your wallet…", async () => {
      ve();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (ae()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Te(!0);
      const B = Th(o ?? 0n);
      if (B <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      v = await t.deposit(m, i.address, B), v && fn({ txid: v, amount: B.toString(), at: t.now() }), N("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => tt("Confirm in the listening wallet…", async () => {
      if (!Qt()) throw new Error("Connect your wallet first.");
      await Bn(), await s.request("listening.approveSession", gn()), ht(!0), N("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => tt("Clearing…", async () => {
      for (const m of kn())
        await t.chain.transaction(m.txid) || Q({ ...m, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      N("Cleared ✓");
    }),
    switchOff: () => tt("Switching off…", async () => {
      Ve(), await (s == null ? void 0 : s.request("listening.stop")), ht(!1), N("Paying is off. Music stays free.");
    }),
    lock: () => tt("Locking…", async () => {
      Ve(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, N("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (m) => {
      const B = String(m ?? "").trim();
      if (!(i != null && i.address)) return N("", "Unlock the listening wallet first.");
      if (!Do(B)) return N("", "Enter a standard mainnet address (it starts with SP).");
      if (B === i.address) return N("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(hn(i.address), B), N("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(hn(i.address), ""), t.changed();
    },
    returnFunds: (m) => tt("Check the return in the listening wallet…", async () => {
      if (!Qt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const B = d();
      if (!B) throw new Error(qt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (B.kind !== "linked" && Zt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (St().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: G, nonce: yt } = await t.chain.account(i.address);
      o = G;
      const V = await s.request("listening.prepareReturn", {
        mode: m,
        balance: G.toString(),
        nonce: yt.toString(),
        fee: U6.toString(),
        ...B.kind === "linked" ? {} : { destination: B.to }
      });
      if (V.recipient !== B.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const Et = iu(V.raw);
      if (An(Et.payload.recipient).value !== B.to || String(Et.payload.amount) !== V.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const ut = {
        id: Uh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: V.recipient,
        amount: V.amount,
        fee: V.fee,
        nonce: yt.toString(),
        created: t.now(),
        status: "signed",
        raw: V.raw,
        txid: V.txid
      };
      t.validate(ut), Q(ut);
      try {
        await t.chain.broadcast(V.raw, V.txid), Q({ ...ut, status: "pending" });
      } catch (Ct) {
        throw Q({ ...ut, status: "unknown", note: Ct.message }), Ct;
      }
      m === "all" && ht(!1), N(m === "all" ? B.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Ut = [], hr = 10, Ge = 30 * 6e4;
  let _e = !1;
  const yn = () => u || !!c || h || l, Ve = () => {
    Ut.length && (Ut.length = 0, t.changed());
  };
  async function Ke(m) {
    if (!Ut.some((B) => B.id === m.id) && !k().some((B) => B.id === m.id) && (Ut.push({ ...m, at: t.now() }), Ut.length > hr && Ut.shift()), yn() || St().length) {
      const B = Ut.length;
      y = `Queued ${B === 1 ? "this song" : B + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await D();
  }
  async function D() {
    if (!_e) {
      _e = !0;
      try {
        for (; Ut.length; ) {
          for (; Ut.length && t.now() - Ut[0].at > Ge; ) Ut.shift();
          if (!Ut.length || yn() || await vt(Ut[0]) === "wait") return;
          Ut.shift();
        }
      } finally {
        _e = !1, t.changed();
      }
    }
  }
  async function vt(m) {
    u = !0;
    try {
      await ot();
      const B = $();
      if (B === "loading") return "wait";
      if (B !== "ready" || !gt() || !(i != null && i.session) || i.session.playsLeft < 1 || !L) return "done";
      if (St().length) return "wait";
      x || (await t.chain.verify(), x = !0);
      const G = i.address, { balance: yt, nonce: V } = await t.chain.account(G);
      o = yt, a = t.now();
      const Et = await t.chain.owner(Ga, m.song);
      if (Et === G || Et === t.main()) return "done";
      const ut = await s.request("listening.signPlay", {
        core: Ga,
        song: m.song,
        receipt: m.id,
        fee: Vt().toString(),
        nonce: V.toString(),
        balance: yt.toString()
      }), Ct = {
        id: m.id,
        address: G,
        kind: "play",
        core: Ga,
        song: m.song,
        recipient: Et,
        amount: "50",
        fee: Vt().toString(),
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: ut.raw,
        txid: ut.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(Ct), Q(Ct);
      const Wt = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`;
      try {
        await t.chain.broadcast(ut.raw, ut.txid), Q({ ...Ct, status: "pending" }), y = `♪ Paid ${Wt}`, w = "";
      } catch (qe) {
        Q({ ...Ct, status: cs(qe) ? "failed" : "unknown", note: qe.message, ...cs(qe) ? { raw: void 0 } : {} }), w = qe.message;
      }
      return i = await Rt(s), "done";
    } catch (B) {
      return y = "This song played free: " + (B instanceof Error ? B.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function Ue(m) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes($()) || Zt("like") ? !1 : (Rs(m), !0);
  }
  async function Rs(m) {
    const B = m.title ? `“${m.title}”` : `song #${m.song}`, G = (ge) => {
      var We;
      w = ge, y = "";
      try {
        (We = t.likeFailed) == null || We.call(t, m.song);
      } catch {
      }
      t.changed();
    }, yt = $(), V = t.main(), Et = qt() ? i == null ? void 0 : i.address : V;
    if (yt === "locked") {
      g = { ...m, at: t.now() }, N(`Unlock to like ${B}. It sends straight after.`);
      return;
    }
    if (yt === "wrong-wallet") return G(zt());
    if (yt === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (qt() && Zt("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (yt === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (yt === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (yt !== "ready" || !Et) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!L) return G("Pay-per-play is running in another tab. Like from that tab.");
    const ut = k().find((ge) => ge.kind === "like" && ge.song === m.song);
    if (ut && _h.includes(ut.status))
      return G(`Your last like for ${B} is still on its way. It can change again once it confirms.`);
    if (h) return G("One like at a time: your last one is still being sent.");
    if ((ut == null ? void 0 : ut.status) === "confirmed" && t.now() - (ut.confirmedAt ?? 0) < e5)
      return G(`Your like for ${B} has only just confirmed. Try again in a moment.`);
    let Ct;
    l = !0;
    try {
      Ct = t.likeState ? (await t.likeState(Et, m.song)).by : m.likedBy ?? [];
    } catch {
      Ct = m.likedBy;
    } finally {
      l = !1;
    }
    if (!Ct) return G(`Could not check ${B} right now. Try the heart again.`);
    const Wt = i.address, wn = ((ut == null ? void 0 : ut.status) === "confirmed" && typeof ut.liked == "boolean" && t.now() - (ut.confirmedAt ?? ut.created) < 5 * 6e4 ? ut.liked : void 0) ?? Ct.includes(Wt);
    if (!wn && Ct.some((ge) => ge !== Wt)) return G(qt() ? `${B} was liked from another wallet of yours. Unlike it there.` : `${B} was liked from your main wallet${Ct.includes(V) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await pa({ song: m.song, liked: !wn, title: m.title, artist: m.artist });
  }
  async function pa(m) {
    var yt, V, Et;
    if (h) {
      N("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const B = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`, G = t.wait ?? ((ut) => new Promise((Ct) => setTimeout(Ct, ut)));
    try {
      N(`${m.liked ? "Liking" : "Unliking"} ${B}…`);
      const ut = t.now() + 12e4;
      for (; u || St().length; ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await ot(!0);
      }
      if ($() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Ct = i.address, { balance: Wt, nonce: qe } = await t.chain.account(Ct);
      o = Wt, a = t.now();
      const wn = await s.request("listening.signLike", {
        song: m.song,
        liked: m.liked,
        fee: Mh.toString(),
        nonce: qe.toString(),
        balance: Wt.toString()
      }), ge = {
        id: Uh(),
        address: Ct,
        kind: "like",
        core: 0,
        song: m.song,
        liked: m.liked,
        recipient: "",
        amount: "0",
        fee: Mh.toString(),
        nonce: qe.toString(),
        created: t.now(),
        status: "signed",
        raw: wn.raw,
        txid: wn.txid,
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(ge), Q(ge);
      try {
        await t.chain.broadcast(wn.raw, wn.txid), Q({ ...ge, status: "pending" }), y = `${m.liked ? "♥ Liked" : "Unliked"} ${B}`, w = "";
        try {
          (yt = t.likeSent) == null || yt.call(t, m.song, m.liked);
        } catch {
        }
      } catch (We) {
        if (Q({ ...ge, status: cs(We) ? "failed" : "unknown", note: We.message, ...cs(We) ? { raw: void 0 } : {} }), w = We.message, cs(We)) try {
          (V = t.likeFailed) == null || V.call(t, m.song);
        } catch {
        }
      }
      i = await Rt(s);
    } catch (ut) {
      w = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (Et = t.likeFailed) == null || Et.call(t, m.song);
      } catch {
      }
    } finally {
      h = !1, t.changed(), D();
    }
  }
  return { snapshot: M, refresh: ot, onListened: Ke, heart: Ue, toggleLike: Rs, ...es };
}
const yg = ["Connect", "Passkey", "Link & fund", "Listen"], wg = ["Passkey", "Add 1 STX", "Listen"], Yc = (t) => t ? wg : yg;
function r5(t) {
  if (t.solo) return s5(t);
  const e = yg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(2, "add up to 1 STX");
    case "over":
      return n(2, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(3, "switch paying on");
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function s5(t) {
  const e = wg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(1, "add 1 STX: anyone can send it to your address");
    case "over":
      return n(1, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(2, "switch paying on");
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function i5(t, e) {
  return !e || e.at >= Yc(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const o5 = 100000n, a5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function c5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Do(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= o5).sort(a5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const no = 50;
function Hh(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), i = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(i)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: i });
  }
  return { total: e.total, transfers: n };
}
async function l5(t, e, n = 4) {
  if (!Do(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${no}&offset=${o}`, s = Hh(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - no);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= no ? s : Hh(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = c5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - no);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const u5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function f5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !u5(r.id)));
}
const h5 = {}, d5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, p5 = (t) => {
  const e = h5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, g5 = (t) => `/hiro/${t}`, y5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, w5 = (t) => {
  const e = p5(t);
  if (e)
    return [y5(e)];
  const n = d5[t];
  return typeof window < "u" ? [`${window.location.origin}${g5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, b5 = {}, Nh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, x5 = "xtrata.log.enabled", m5 = "xtrata.log.level", S5 = "xtrata.log.tags", E5 = "xtrata.log.dedupe", ro = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, A5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, $5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, v5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, I5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, L5 = () => {
  const t = b5 ?? {}, e = ro(x5) ?? t.VITE_LOG_ENABLED, n = ro(m5) ?? t.VITE_LOG_LEVEL, r = ro(S5) ?? t.VITE_LOG_TAGS, s = ro(E5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: A5(e),
    level: $5(n) ?? "warn",
    tags: I5(r),
    dedupe: v5(s)
  };
}, C5 = (t, e, n) => !t.enabled || Nh[n] < Nh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), k5 = (t, e, n, r) => {
  const s = L5();
  if (!C5(s, e, t) || M5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, B5 = /* @__PURE__ */ new Set();
let Ph = null;
const M5 = (t, e, n, r, s) => (Ph !== t && (B5.clear(), Ph = t), !1), T5 = (t, e, n) => k5("debug", t, e, n), _5 = {}, U5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, H5 = (t) => {
  const e = _5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : U5[t];
}, N5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, P5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return N5.test(n) ? n : null;
}, O5 = (t) => t.replace(/\/+$/, ""), D5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Oh = (t) => {
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
}, ls = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, F5 = (t) => {
  var c, u;
  let e;
  try {
    e = An(j8(t));
  } catch {
    return null;
  }
  const n = ls(e);
  if (!n || n.success === !1)
    return null;
  const r = ls(n.value), s = ls(r == null ? void 0 : r.value), i = ls(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Oh((c = ls(i.name)) == null ? void 0 : c.value), a = Oh((u = ls(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : P5(`${o}.${a}`);
}, j5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${O5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Zp(Up(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : F5(i.result);
}, z5 = async (t) => {
  const e = t.address.trim();
  if (!ws(e))
    return null;
  const n = H5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of w5(t.network))
    try {
      return await j5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return T5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: D5(r)
  }), null;
}, Dh = Object.freeze({
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
});
function R5(t, e = "") {
  return Object.hasOwn(Dh, String(t)) ? Dh[String(t)] : e;
}
const Fh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function G5(t, e = "") {
  return Object.hasOwn(Fh, String(t)) ? Fh[String(t)] : e;
}
const jh = document.getElementById("ppp");
jh && V5(jh);
function V5(t) {
  var dn;
  const e = My(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let s = null;
  const i = async (d, $) => {
    const M = await fetch(d, { cache: "no-store", ...$, signal: AbortSignal.timeout(15e3) }), N = await M.json().catch(() => ({}));
    if (!M.ok) throw new Error((N == null ? void 0 : N.error) || `Request failed (${M.status}).`);
    return N;
  }, o = n5({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    saveLink: async (d) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), s.referrerPolicy = "no-referrer";
      const $ = new Promise((Lt, Qt) => {
        s.addEventListener("load", () => Lt(), { once: !0 }), setTimeout(() => Qt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = d + "/", r.replaceChildren(s), await $;
      const M = new Ey({ walletOrigin: d, frame: s, timeoutMs: 30 * 6e4 }), N = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), tt = (Lt, Qt) => N.has(Lt) ? M.request(Lt, Qt) : Promise.race([
        M.request(Lt, Qt),
        new Promise((zt, ve) => setTimeout(() => ve(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await tt("listening.status"), { request: tt };
    },
    chain: {
      verify: G6,
      balance: K6,
      account: V6,
      owner: q6,
      broadcast: W6,
      transaction: X6,
      confirmedNonce: async (d) => {
        const $ = await zr(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger($ == null ? void 0 : $.nonce) || $.nonce < 0) throw new Error("Malformed account data.");
        return BigInt($.nonce);
      }
    },
    signWithMain: (d, $) => _6({ ...$, network: "mainnet", stxAddress: d }),
    deposit: (d, $, M) => new Promise((N, tt) => C6({
      recipient: $,
      amount: M.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Rh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (Lt) => N(Lt.txId || ""),
      onCancel: () => tt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: tt
    })),
    validate: Y6,
    tabLock: (d) => new Promise(($) => {
      const M = navigator.locks;
      if (!(M != null && M.request)) {
        $(!0);
        return;
      }
      M.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (N) => {
        $(!!N), N && await new Promise(() => {
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
      set: (d, $) => {
        try {
          localStorage.setItem(d, $);
        } catch {
        }
      }
    },
    changed: () => $e(o.snapshot()),
    funder: (d) => l5(d, zr),
    likesChanged: () => {
      var d, $;
      ($ = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || $.call(d);
    },
    likeState: async (d, $) => {
      const M = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String($) })), N = Array.isArray(M == null ? void 0 : M.rows) ? M.rows.find((tt) => (tt == null ? void 0 : tt.id) === $) : null;
      if (!N || typeof N.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: N.liked, by: Array.isArray(N.by) ? N.by.filter((tt) => typeof tt == "string") : N.liked ? [d] : [] };
    },
    likeSent: (d, $) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: $ } })),
    nameOf: (d) => b(d) ?? void 0,
    likeConfirmed: (d, $) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: $ } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    O();
    const $ = R(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: $.title || void 0, artist: $.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let a;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const c = (d) => {
    var M, N;
    const $ = window.XtrataRadioListeningIdentity();
    $ !== a && (a = $, (N = (M = window.XtrataRadio) == null ? void 0 : M.refreshLikes) == null || N.call(M));
  }, u = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", h = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), l = (d) => {
    const $ = Math.round((Date.now() - d) / 6e4);
    return $ < 1 ? "now" : $ < 60 ? `${$}m` : $ < 1440 ? `${Math.round($ / 60)}h` : `${Math.round($ / 1440)}d`;
  }, g = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, f = (d, $ = "", M = "") => {
    const N = document.createElement(d);
    return $ && (N.textContent = $), M && (N.className = M), N;
  }, y = (d, $, M = "") => {
    const N = f("button", d, M);
    return N.type = "button", N.onclick = $, N;
  }, w = (d, $) => {
    const M = f("a", d);
    return M.href = $, M.target = "_blank", M.rel = "noopener", M;
  };
  let v = null, T = !1;
  const _ = /* @__PURE__ */ new Map(), b = (d) => d ? (_.has(d) || (_.set(d, null), z5({ address: d, network: "mainnet" }).then(($) => {
    $ && (_.set(d, $), $e(o.snapshot()));
  }).catch(() => {
  })), _.get(d) ?? null) : null, I = (d) => {
    const $ = b(d);
    return $ ? `${$} · ${u(d)}` : u(d);
  }, A = /* @__PURE__ */ new Map();
  let P = !1;
  const K = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), O = () => {
    P || (P = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const $ of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const M = Number($ == null ? void 0 : $.id);
        Number.isSafeInteger(M) && A.set(M, { title: typeof $.title == "string" ? $.title : void 0, artist: typeof $.artist == "string" ? $.artist : void 0 });
      }
      $e(o.snapshot());
    }).catch(() => {
      P = !1;
    }));
  }, R = (d, $) => {
    const M = A.get(d), N = G5(d, [M == null ? void 0 : M.title, $ == null ? void 0 : $.title].find((Lt) => !K(Lt)) || ""), tt = R5(d, (M == null ? void 0 : M.artist) || ($ == null ? void 0 : $.artist) || "");
    return { title: N, artist: tt };
  }, x = (d) => {
    const { title: $, artist: M } = R(d.song, d);
    return $ ? `“${$}”${M ? ` — ${M}` : ""}` : `Song #${d.song}${M ? ` — ${M}` : ""}`;
  }, L = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, H = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function q(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Y(d, $, M = "", N) {
    const tt = f("dt", d), Lt = f("dd", $, M);
    return N && Lt.append(" ", N), [tt, Lt];
  }
  const z = document.getElementById("ppp-top"), ee = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Vt = () => {
    var $, M;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      ($ = document.getElementById("radio-wallet-connect")) == null || $.click();
      return;
    }
    if (d.step === "elsewhere" && ((M = d.gate) != null && M.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), ee();
  };
  z && (z.onclick = Vt);
  function Zt(d) {
    if (!z) return;
    const $ = (N, tt, Lt) => {
      z.hidden = !1, z.className = "ppp-top" + (tt ? " is-" + tt : ""), z.replaceChildren(f("span", "", "dot"), document.createTextNode(N)), z.title = Lt;
    }, M = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        z.hidden = !0;
        return;
      case "elsewhere":
        return $("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        z.hidden = !0;
        return;
      case "intro":
        return $("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return $(`Connect ${b(d.linked) ?? u(d.linked)}`, "warn", `This device's listening wallet belongs to ${I(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return $(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return $("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return $(d.entries.some((N) => N.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return $("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return $("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && M > 0 ? $(`On · ${M.toLocaleString()} plays left`, "on", "Paying artists as you listen") : $("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const S = document.getElementById("pppNudge"), k = document.getElementById("onair");
  (dn = S == null ? void 0 : S.querySelector("button")) == null || dn.addEventListener("click", () => Vt());
  const Q = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "Out of funds · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, gt = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function ht(d) {
    var Lt;
    if (d.step === "loading") return;
    const $ = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, M = d.step === "ready" && d.payingOn && $ > 0, N = M ? "" : Q[d.step] ?? "", tt = M ? "on" : N ? "off" : "";
    if (tt ? document.documentElement.dataset.ppp = tt : delete document.documentElement.dataset.ppp, k && (k.hidden = !tt, k.querySelector(".onair-sub").textContent = M ? `Paying artists · ${$.toLocaleString()} plays left` : "Not paying"), S && (S.hidden = tt !== "off", tt === "off")) {
      const Qt = Math.floor(Number(1000000n / gi(BigInt(((Lt = d.gate) == null ? void 0 : Lt.limits.playFee) ?? "300"))));
      S.querySelector(".nudge-t").textContent = "⚠ " + N, S.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Qt.toLocaleString()} plays, on-chain, straight to the artists.`, S.querySelector("button").textContent = gt[d.step] ?? "Start paying";
    }
  }
  let St = "";
  function ae(d) {
    const $ = f("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && $.append(f("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && $.append(f("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const M = f("input");
    M.type = "text", M.placeholder = "SP… address to send returns to", M.autocomplete = "off", M.spellcheck = !1, M.setAttribute("aria-label", "Address to return funds to"), M.value = St, M.oninput = () => {
      St = M.value;
    };
    const N = y(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(M.value), St = "";
    }, "tiny");
    return $.append(M, " ", N), d.returnToKind === "chosen" && $.append(" ", y("Back to the funder", () => o.clearReturnAddress(), "tiny")), $;
  }
  const fn = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function kn() {
    const d = f("p", fn + " ", "ppp-mute");
    return d.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), d;
  }
  let Jr = "";
  const qt = (d) => {
    const $ = document.documentElement, M = d.solo && !d.main ? d.listening ? u(d.listening) : "new" : "", N = f5() ? "1" : "";
    `${M}|${N}` !== Jr && (Jr = `${M}|${N}`, M ? $.dataset.pppSolo = M : delete $.dataset.pppSolo, N ? $.dataset.pppWalletInstalled = N : delete $.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => $e(o.snapshot()), d);
  function $e(d) {
    var _e, yn, Ve, Ke;
    if (c(), qt(d), Zt(d), ht(d), t.hidden = d.step === "off", t.hidden) return;
    const [$, M] = q(d), N = n(".ppp-state");
    N.textContent = $, N.className = "ppp-state" + (M ? " ppp-state--" + M : ""), N.hidden = !$;
    const tt = !!d.busy || d.armed, Lt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (tt || !["intro", "loading"].includes(d.step));
    r.hidden = !Lt, r.classList.toggle("ppp-frame--rest", !tt && !T);
    const Qt = n(".ppp-frame-label");
    Qt.hidden = !0;
    const zt = r5(d) ?? v;
    v = zt;
    const ve = i5(d, zt);
    n(".ppp-badge").hidden = !ve;
    const pn = n(".ppp-steps"), Rt = n(".ppp-stage");
    pn.hidden = Rt.hidden = !ve, zt && ve && (pn.replaceChildren(...Yc(d.solo).map((D, vt) => {
      const Ue = f("li", "", vt < zt.at ? "done" : vt === zt.at ? zt.blocked ? "now blocked" : "now" : "");
      return Ue.append(f("span", vt < zt.at ? "✓" : String(vt + 1), "n"), D), vt === zt.at && Ue.setAttribute("aria-current", "step"), Ue;
    })), Rt.textContent = zt.caption, Rt.className = "ppp-stage " + (zt.at >= Yc(d.solo).length ? "ppp-ok" : zt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Te = n(".ppp-facts"), ce = [];
    d.main && ((_e = d.gate) != null && _e.here) && !d.solo && ce.push(...Y("Your wallet", I(d.main), "ppp-addr-short"));
    const fr = () => {
      if (!d.listening) return;
      const D = y("Copy", () => {
        var vt;
        return void ((vt = navigator.clipboard) == null ? void 0 : vt.writeText(d.listening || ""));
      }, "tiny");
      ce.push(...Y(d.linked ? "Listening wallet (technical)" : "Listening wallet", u(d.listening), "ppp-addr-short", D));
    };
    if (d.linked || fr(), d.listening && d.step !== "intro")
      if (d.linked)
        ce.push(...Y("Credited to", `${I(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), fr();
      else if (d.solo) {
        const D = d.returnTo ? `${u(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        ce.push(...Y("Returns go to", d.returnTo ? D.replace(u(d.returnTo), d.returnTo) : D, d.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else ce.push(...Y("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((yn = d.gate) != null && yn.here)) {
      const D = d.linkedListening.map((vt) => u(vt) + (vt === d.listening ? " (this one)" : "")).join(", ");
      ce.push(...Y(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", D, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const D = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ce.push(...Y("Balance", `${tr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, D));
    }
    const Re = d.entries.find((D) => D.kind === "play");
    Re && O(), Re && ce.push(...Y("Last paid song", `${x(Re)} → ${u(Re.recipient)}`, L[Re.status] || "")), Te.replaceChildren(...ce), Te.hidden = !ce.length;
    const ot = [], xt = [], jt = [], pe = [], gn = gi(BigInt(((Ve = d.gate) == null ? void 0 : Ve.limits.playFee) ?? "300")), Bn = `Each song you listen to for 30 seconds sends ${tr(qc)} STX to whoever holds it, plus a ${tr(gn - qc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, es = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (ot.push(f("p", "Pay artists as you listen.")), (Ke = d.gate) != null && Ke.radioUrl) {
          const D = f("p");
          D.append(w("Open the pay-per-play radio →", d.gate.radioUrl)), ot.push(D);
        }
        xt.push(f("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        d.linked ? (ot.push(f("p", `This device's listening wallet is linked to ${I(d.linked)}. Connect that wallet to keep paying artists.`)), xt.push(f("p", "Your plays, likes and any funds returned stay with that wallet. Listening is always free."))) : (ot.push(f("p", "Connect your wallet to pay artists as you listen.")), xt.push(f("p", "Every payment is recorded on-chain. Listening is always free.")));
        break;
      case "wrong-wallet":
        ot.push(f("p", `This device's listening wallet belongs to ${I(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), xt.push(f("p", `You are connected as ${I(d.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), xt.push(f("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), jt.push(y("Switch wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        }, "primary"));
        break;
      case "not-invited":
        ot.push(f("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ot.push(f("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ot.push(f("p", `Pay artists ${tr(gn)} STX a song as you listen.`)), xt.push(f("p", Bn)), xt.push(f("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), xt.push(f("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && xt.push(f("p", `This is the listening wallet for ${I(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && xt.push(f("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute")), jt.push(y(d.solo ? "Turn on pay-per-play · no wallet needed" : "Turn on pay-per-play", () => void o.create(), "primary")), d.solo && jt.push(y("I have a Stacks wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), jt.push(y("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        d.armed || (ot.push(f("p", "Locked.", "ppp-mute")), jt.push(y(d.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), pe.push(y("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ot.push(f("p", `Link to ${I(d.main)} · free`)), xt.push(f("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), xt.push(f("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), jt.push(y(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ot.push(f("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.entries.length ? ot.push(f("p", "Out of funds · top up to keep paying", "ppp-bad")) : ot.push(f("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / gn)).toLocaleString()} songs`)), d.entries.length && xt.push(f("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), d.payingOn && !d.entries.length && xt.push(f("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), d.solo ? (xt.push(f("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), xt.push(f("p", d.listening || "", "ppp-addr-full")), d.listening && jt.push(y("Copy my address", () => {
          var D;
          return void ((D = navigator.clipboard) == null ? void 0 : D.writeText(d.listening || ""));
        }, "primary"))) : xt.push(f("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const D = f("p", "Deposit on its way… ", "ppp-warn");
          D.append(w("View", g(d.depositTxid))), ot.push(D);
        } else d.allowance > 0n && !d.solo && jt.push(y(`Deposit ${tr(d.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ot.push(f("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (ot.push(f("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ot.push(ae(d))), (!d.solo || d.returnTo) && jt.push(y("Return excess", () => void o.returnFunds("excess"), "primary"), y("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0) {
          const D = Math.min(d.session.playsLeft, d.playsLeft);
          ot.push(f("p", `Paying as you listen · up to ${D.toLocaleString()} plays left`, "ppp-ok")), xt.push(f("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), jt.push(y("Switch off", () => void o.switchOff()));
        } else
          ot.push(f("p", "Paying is off. Music stays free.", "ppp-mute")), jt.push(y("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        d.queued && ot.push(f("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && ot.push(f("p", "Running low · top up", "ppp-warn")), d.depositPending ? ot.push(f("p", "Top-up on its way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && jt.push(y(`Top up ${tr(d.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (d.solo && d.walletCannotSolo && xt.push(f("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && xt.push(ae(d)), xt.push(kn()), d.step === "ready" && d.entries.some((D) => D.kind === "play" && D.status === "confirmed"))) {
      const D = f("p", "New to Stacks? ", "ppp-mute");
      D.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ot.push(D);
    }
    if (d.walletOutdated && xt.push(f("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (ot.push(f("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), jt.push(y("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(d.step) && d.returnTo && (d.balance ?? 0n) > 0n && pe.push(y(d.linked ? "Return all to my wallet" : `Return all to ${u(d.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && pe.push(y("Lock", () => void o.lock(), "quiet")), Lt && !tt && pe.push(y(T ? "Hide listening wallet box" : "Show listening wallet box", () => {
      T = !T, $e(o.snapshot());
    }, "quiet")), [...jt, ...pe].forEach((D) => D.disabled = es), es && (jt.length = 0), d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const D = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", vt = ot.at(0);
      d.step === "ready" && vt ? vt.append(f("span", ` · ${h(d.balance)} STX`, D)) : ot.push(f("p", `Balance ${h(d.balance)} STX`, D));
    }
    n(".ppp-key").replaceChildren(...ot), n(".ppp-body").replaceChildren(...xt), n(".ppp-actions").replaceChildren(...jt), n(".ppp-actions2").replaceChildren(...pe);
    const Ut = d.busy || d.message || "";
    n(".ppp-msg").textContent = Ut && ot.some((D) => (D.textContent ?? "").startsWith(Ut.replace(/[.✓\s]+$/, ""))) ? "" : Ut, n(".ppp-err").textContent = d.error;
    const hr = d.entries.filter((D) => D.kind === "play");
    n(".ppp-recent").hidden = !d.entries.length, n(".ppp-recent-list").replaceChildren(...hr.slice(0, 5).map((D) => {
      const vt = f("li"), Ue = D.status === "confirmed" ? "ok" : D.status === "failed" ? "bad" : "warn";
      return vt.append(f("span", "", "d " + Ue), f("span", x(D), "t"), f("span", l(D.created), "ppp-mute")), D.txid && vt.append(w("tx", g(D.txid))), vt;
    })), n(".ppp-wallets").hidden = !(Te.childElementCount || pe.length), n(".ppp-more").hidden = !xt.length;
    const Ge = n(".ppp-history");
    Ge.hidden = !d.entries.length, d.entries.length && O(), Ge.replaceChildren(f("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((D) => {
      const vt = f("div", "", "ppp-row"), Ue = D.kind === "play" ? [f("span", x(D), "ppp-song"), f("span", ` · ${tr(BigInt(D.amount))} STX to ${u(D.recipient)}`, "ppp-mute")] : D.kind === "like" ? [f("span", `${D.liked ? "♥ Liked" : "Unliked"} ${x(D)}`, "ppp-song"), f("span", ` · for ${d.linked ? I(d.linked) : "this listening wallet"}`, "ppp-mute")] : [f("span", `Returned ${tr(BigInt(D.amount))} STX`, "ppp-song"), f("span", ` to ${u(D.recipient)}`, "ppp-mute")];
      return vt.append(
        f("span", H[D.status] || D.status, "ppp-status " + (L[D.status] || "")),
        ...Ue,
        f("span", ` · ${new Date(D.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), D.txid && vt.append(w("tx ↗", g(D.txid))), vt;
    }));
  }
  const hn = /* @__PURE__ */ new Map(), ts = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe(($) => {
      const M = $ == null ? void 0 : $.nowPlaying;
      M && Number.isSafeInteger(Number(M.tokenId)) && hn.set(Number(M.tokenId), { title: M.title || void 0, artist: M.artist || void 0 });
    }), !0) : !1;
  };
  if (!ts()) {
    const d = setInterval(() => {
      ts() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const $ = d.detail;
    if ($ && Number.isSafeInteger($.song) && typeof $.id == "string" && /^[0-9a-f]{32}$/.test($.id)) {
      O();
      const M = R($.song, hn.get($.song));
      o.onListened({ song: $.song, id: $.id, title: M.title || void 0, artist: M.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const K5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", q5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, W5 = () => q5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, X5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Y5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', bg = class {
  constructor(t) {
    nE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Ex(t), this.callback(Jo(t));
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
    var r, s, i, o, a, c, u, h, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = W5(), e = X5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return J("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, J("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), J("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, J("div", { class: "flex flex-col space-y-[10px]" }, J("div", { class: "flex items-center" }, J("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), J("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, J("span", { class: "sr-only" }, "Close popup"), J("img", { src: K5 }))), r ? J("p", null, "Select the wallet you want to connect to.") : J("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && J("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && J("div", { class: "mt-6" }, J("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), J("ul", { class: "space-y-3" }, this.installedProviders.map((i) => J("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, J("div", { class: "aspect-square basis-9 overflow-hidden" }, J("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), J("div", { class: "flex-1" }, J("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && J("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), J("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && J("div", { class: "mt-6" }, r ? J("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : J("div", { class: "mb-5 flex justify-between" }, J("p", { class: "text-sm font-medium" }, "Recommended wallets"), J("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, J("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, J("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), J("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), J("p", null, "What is a wallet? ", J("span", { class: "align-text-bottom text-[9px]" }, "↗")))), J("ul", { class: "space-y-3" }, n.map((i) => J("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, J("div", { class: "aspect-square basis-9 overflow-hidden" }, J("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), J("div", { class: "flex-1" }, J("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && J("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && J("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return P4(this);
  }
};
bg.style = Y5;
const Z5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: bg
}, Symbol.toStringTag, { value: "Module" }));
