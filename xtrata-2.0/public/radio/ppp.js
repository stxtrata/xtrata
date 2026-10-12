var ey = Object.defineProperty;
var ny = (t, e, n) => e in t ? ey(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Es = (t, e, n) => ny(t, typeof e != "symbol" ? e + "" : e, n);
var Wt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ah(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function bo(t) {
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
      typeof Wt < "u" && Wt || {}, r = {
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
      function l(x) {
        var v = {
          next: function() {
            var U = x.shift();
            return { done: U === void 0, value: U };
          }
        };
        return r.iterable && (v[Symbol.iterator] = function() {
          return v;
        }), v;
      }
      function f(x) {
        this.map = {}, x instanceof f ? x.forEach(function(v, U) {
          this.append(U, v);
        }, this) : Array.isArray(x) ? x.forEach(function(v) {
          if (v.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + v.length);
          this.append(v[0], v[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(v) {
          this.append(v, x[v]);
        }, this);
      }
      f.prototype.append = function(x, v) {
        x = a(x), v = c(v);
        var U = this.map[x];
        this.map[x] = U ? U + ", " + v : v;
      }, f.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, f.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, f.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, f.prototype.set = function(x, v) {
        this.map[a(x)] = c(v);
      }, f.prototype.forEach = function(x, v) {
        for (var U in this.map)
          this.map.hasOwnProperty(U) && x.call(v, this.map[U], U, this);
      }, f.prototype.keys = function() {
        var x = [];
        return this.forEach(function(v, U) {
          x.push(U);
        }), l(x);
      }, f.prototype.values = function() {
        var x = [];
        return this.forEach(function(v) {
          x.push(v);
        }), l(x);
      }, f.prototype.entries = function() {
        var x = [];
        return this.forEach(function(v, U) {
          x.push([U, v]);
        }), l(x);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function p(x) {
        return new Promise(function(v, U) {
          x.onload = function() {
            v(x.result);
          }, x.onerror = function() {
            U(x.error);
          };
        });
      }
      function h(x) {
        var v = new FileReader(), U = p(v);
        return v.readAsArrayBuffer(x), U;
      }
      function y(x) {
        var v = new FileReader(), U = p(v), R = /charset=([A-Za-z0-9_-]+)/.exec(x.type), g = R ? R[1] : "utf-8";
        return v.readAsText(x, g), U;
      }
      function w(x) {
        for (var v = new Uint8Array(x), U = new Array(v.length), R = 0; R < v.length; R++)
          U[R] = String.fromCharCode(v[R]);
        return U.join("");
      }
      function I(x) {
        if (x.slice)
          return x.slice(0);
        var v = new Uint8Array(x.byteLength);
        return v.set(new Uint8Array(x)), v.buffer;
      }
      function k() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = I(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = I(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = u(this);
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
            var x = u(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var x = u(this);
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
      var M = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(x) {
        var v = x.toUpperCase();
        return M.indexOf(v) > -1 ? v : x;
      }
      function L(x, v) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        v = v || {};
        var U = v.body;
        if (x instanceof L) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, v.headers || (this.headers = new f(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !U && x._bodyInit != null && (U = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = v.credentials || this.credentials || "same-origin", (v.headers || !this.headers) && (this.headers = new f(v.headers)), this.method = b(v.method || this.method || "GET"), this.mode = v.mode || this.mode || null, this.signal = v.signal || this.signal || function() {
          if ("AbortController" in n) {
            var E = new AbortController();
            return E.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && U)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(U), (this.method === "GET" || this.method === "HEAD") && (v.cache === "no-store" || v.cache === "no-cache")) {
          var R = /([?&])_=[^&]*/;
          if (R.test(this.url))
            this.url = this.url.replace(R, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var g = /\?/;
            this.url += (g.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function A(x) {
        var v = new FormData();
        return x.trim().split("&").forEach(function(U) {
          if (U) {
            var R = U.split("="), g = R.shift().replace(/\+/g, " "), E = R.join("=").replace(/\+/g, " ");
            v.append(decodeURIComponent(g), decodeURIComponent(E));
          }
        }), v;
      }
      function T(x) {
        var v = new f(), U = x.replace(/\r?\n[\t ]+/g, " ");
        return U.split("\r").map(function(R) {
          return R.indexOf(`
`) === 0 ? R.substr(1, R.length) : R;
        }).forEach(function(R) {
          var g = R.split(":"), E = g.shift().trim();
          if (E) {
            var D = g.join(":").trim();
            try {
              v.append(E, D);
            } catch (F) {
              console.warn("Response " + F.message);
            }
          }
        }), v;
      }
      k.call(L.prototype);
      function G(x, v) {
        if (!(this instanceof G))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (v || (v = {}), this.type = "default", this.status = v.status === void 0 ? 200 : v.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = v.statusText === void 0 ? "" : "" + v.statusText, this.headers = new f(v.headers), this.url = v.url || "", this._initBody(x);
      }
      k.call(G.prototype), G.prototype.clone = function() {
        return new G(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, G.error = function() {
        var x = new G(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var N = [301, 302, 303, 307, 308];
      G.redirect = function(x, v) {
        if (N.indexOf(v) === -1)
          throw new RangeError("Invalid status code");
        return new G(null, { status: v, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(v, U) {
          this.message = v, this.name = U;
          var R = Error(v);
          this.stack = R.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function P(x, v) {
        return new Promise(function(U, R) {
          var g = new L(x, v);
          if (g.signal && g.signal.aborted)
            return R(new e.DOMException("Aborted", "AbortError"));
          var E = new XMLHttpRequest();
          function D() {
            E.abort();
          }
          E.onload = function() {
            var m = {
              statusText: E.statusText,
              headers: T(E.getAllResponseHeaders() || "")
            };
            g.url.indexOf("file://") === 0 && (E.status < 200 || E.status > 599) ? m.status = 200 : m.status = E.status, m.url = "responseURL" in E ? E.responseURL : m.headers.get("X-Request-URL");
            var B = "response" in E ? E.response : E.responseText;
            setTimeout(function() {
              U(new G(B, m));
            }, 0);
          }, E.onerror = function() {
            setTimeout(function() {
              R(new TypeError("Network request failed"));
            }, 0);
          }, E.ontimeout = function() {
            setTimeout(function() {
              R(new TypeError("Network request timed out"));
            }, 0);
          }, E.onabort = function() {
            setTimeout(function() {
              R(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function F(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (E.open(g.method, F(g.url), !0), g.credentials === "include" ? E.withCredentials = !0 : g.credentials === "omit" && (E.withCredentials = !1), "responseType" in E && (r.blob ? E.responseType = "blob" : r.arrayBuffer && (E.responseType = "arraybuffer")), v && typeof v.headers == "object" && !(v.headers instanceof f || n.Headers && v.headers instanceof n.Headers)) {
            var ht = [];
            Object.getOwnPropertyNames(v.headers).forEach(function(m) {
              ht.push(a(m)), E.setRequestHeader(m, c(v.headers[m]));
            }), g.headers.forEach(function(m, B) {
              ht.indexOf(B) === -1 && E.setRequestHeader(B, m);
            });
          } else
            g.headers.forEach(function(m, B) {
              E.setRequestHeader(B, m);
            });
          g.signal && (g.signal.addEventListener("abort", D), E.onreadystatechange = function() {
            E.readyState === 4 && g.signal.removeEventListener("abort", D);
          }), E.send(typeof g._bodyInit > "u" ? null : g._bodyInit);
        });
      }
      return P.polyfill = !0, n.fetch || (n.fetch = P, n.Headers = f, n.Request = L, n.Response = G), e.Headers = f, e.Request = L, e.Response = G, e.fetch = P, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Wt);
})();
const ry = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function sy(t, e) {
  const n = {};
  return Object.assign(n, ry, e), await fetch(t, n);
}
function iy(t) {
  let e = sy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function oy(...t) {
  const { fetchLib: e, middlewares: n } = iy(t);
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
var Wr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wr || (Wr = {}));
var ir;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ir || (ir = {}));
var nu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(nu || (nu = {}));
const ay = "https://api.mainnet.hiro.so", cy = "https://api.testnet.hiro.so", ly = "http://localhost:3999", uy = ["mainnet", "testnet", "devnet", "mocknet"];
let Yr = class {
  constructor(e) {
    this.version = ir.Mainnet, this.chainId = Wr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ir.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? oy();
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
Yr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new $h();
    case "testnet":
      return new fy();
    case "devnet":
      return new hy();
    case "mocknet":
      return new Ih();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${uy.join(", ")}`);
  }
};
Yr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Yr.fromName(t);
let $h = class extends Yr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ay,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ir.Mainnet, this.chainId = Wr.Mainnet;
  }
}, fy = class extends Yr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ir.Testnet, this.chainId = Wr.Testnet;
  }
}, Ih = class extends Yr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ir.Testnet, this.chainId = Wr.Testnet;
  }
};
const hy = Ih, vh = "xtrata.wallet.bridge.v1", dy = (t) => typeof t == "object" && t !== null && t.protocol === vh, py = (t) => dy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", gy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class As extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const ru = 12e4;
class yy {
  constructor(e) {
    Es(this, "pending", /* @__PURE__ */ new Map());
    Es(this, "listenTarget");
    Es(this, "closed", !1);
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
    Es(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !py(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new As("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new As("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new As("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = gy(), i = { protocol: vh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new As(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? ru}ms.`
          )
        );
      }, this.options.timeoutMs ?? ru);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new As("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const wy = ["SP", "SM"], by = ["ST", "SN"], xy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return wy.includes(n) ? "mainnet" : by.includes(n) ? "testnet" : null;
}, my = () => {
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
}, Sy = () => typeof window > "u" || !window.localStorage ? my() : window.localStorage, na = "xtrata.v15.1.wallet.session", su = "mainnet", Vi = { isConnected: !1 }, Ey = (t) => t.address ? xy(t.address) ?? t.network : t.network, Lh = (t) => !t.isConnected || !t.address ? { ...Vi } : Ey(t) !== su ? { ...Vi } : {
  isConnected: !0,
  address: t.address,
  network: su,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ay = (t) => {
  if (!t)
    return { ...Vi };
  try {
    const e = JSON.parse(t);
    return Lh(e);
  } catch {
    return { ...Vi };
  }
}, $y = (t) => {
  const e = Lh(t);
  return JSON.stringify(e);
}, Iy = (t) => {
  const e = Sy();
  return {
    load: () => Ay(e.getItem(na)),
    save: (n) => {
      e.setItem(na, $y(n));
    },
    clear: () => {
      e.removeItem(na);
    }
  };
}, vy = "https://browser.blockstack.org/auth", Ly = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ch = ["store_write"], Cy = "blockstack-session", By = {
  logLevel: "debug"
}, Sr = {
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
Object.freeze(Sr);
class ds extends Error {
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
class ky extends ds {
  constructor(e, n = "") {
    super({ code: Sr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class iu extends ds {
  constructor(e = "") {
    super({ code: Sr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ci extends ds {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Sr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ou extends ds {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Sr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class La extends ds {
  constructor(e) {
    super({ code: Sr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Bh extends ds {
  constructor(e) {
    super({ code: Sr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const au = ["debug", "info", "warn", "error", "none"], Ca = {};
for (let t = 0; t < au.length; t++) {
  const e = au[t];
  Ca[e] = t;
}
class zr {
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
    return Ca[By.logLevel] <= Ca[e];
  }
}
function My() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function _y() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function ra(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Uy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Ty() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Hy(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function _c(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Ty(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    zr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Hy(s, t.toString(), n);
    throw zr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Nn(t, e) {
  return Uc(Gt(t), e);
}
function Gt(t) {
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
  if (ee(t, Uint8Array))
    return BigInt(`0x${W(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Ny(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function cu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ws(t, e = 8) {
  return (typeof t == "bigint" ? t : Gt(t)).toString(16).padStart(e * 2, "0");
}
function xo(t) {
  return parseInt(t, 16);
}
function Uc(t, e = 16) {
  const n = Ws(t, e);
  return ft(n);
}
function Py(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Dy(t, e) {
  return t & BigInt(1) << e;
}
function Ba(t) {
  return Oy(BigInt(`0x${W(t)}`), BigInt(t.byteLength * 8));
}
function Oy(t, e) {
  return Dy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const jy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += jy[n];
  return e;
}
function ft(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Ny(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Er(t) {
  return new TextEncoder().encode(t);
}
function Ys(t) {
  return new TextDecoder().decode(t);
}
function Fy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function zy(t) {
  return String.fromCharCode.apply(null, t);
}
function Ry(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function lu(t) {
  if (t.some(Ry))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Oe(...t) {
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
function Tt(t) {
  return Oe(...t.map((e) => typeof e == "number" ? lu([e]) : e instanceof Array ? lu(e) : e));
}
function ee(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const kh = "https://api.mainnet.hiro.so", Mh = "https://api.testnet.hiro.so", _h = "http://localhost:3999", Gy = "https://hub.blockstack.org", Vy = 33, sa = 32;
function Ky(t) {
  if (t.length < sa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + sa * 2), r = t.slice(2 + sa * 2);
  return {
    recoveryId: xo(e),
    r: n,
    s: r
  };
}
function Tc(t) {
  const e = typeof t == "string" ? ft(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function qy(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Wy(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Yy(t, e) {
  return t[e];
}
function Xy(t, e, n = 0) {
  return t[n] = e, t;
}
function Zy(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function or(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Qy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Jy(t, e) {
  const n = {};
  return Object.assign(n, Qy, e), await fetch(t, n);
}
function t1(t) {
  let e = Jy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function e1(...t) {
  const { fetchLib: e, middlewares: n } = t1(t);
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
class Uh {
  constructor(e = Ch.slice(), n = ((a) => (a = _c("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = vy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ka(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function n1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Th(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function r1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ka(t.outputLen), ka(t.blockLen);
}
function s1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function i1(t, e) {
  Th(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xn = {
  number: ka,
  bool: n1,
  bytes: Th,
  hash: r1,
  exists: s1,
  output: i1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ia = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ce = (t, e) => t << 32 - e | t >>> e, o1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!o1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function a1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hc(t) {
  if (typeof t == "string" && (t = a1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Hh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ar(t) {
  const e = (r) => t().update(Hc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Nh = class extends Hh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Xn.hash(e);
    const r = Hc(n);
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
    return Xn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Xn.exists(this), Xn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const mo = (t, e, n) => new Nh(t, e).update(n).digest();
mo.create = (t, e) => new Nh(t, e);
function c1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Nc = class extends Hh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ia(this.buffer);
  }
  update(e) {
    Xn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ia(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xn.exists(this), Xn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    c1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ia(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const l1 = (t, e, n) => t & e ^ ~t & n, u1 = (t, e, n) => t & e ^ t & n ^ e & n, f1 = new Uint32Array([
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
]), on = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), an = new Uint32Array(64);
let Ph = class extends Nc {
  constructor() {
    super(64, 32, 8, !1), this.A = on[0] | 0, this.B = on[1] | 0, this.C = on[2] | 0, this.D = on[3] | 0, this.E = on[4] | 0, this.F = on[5] | 0, this.G = on[6] | 0, this.H = on[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      an[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = an[u - 15], h = an[u - 2], y = Ce(p, 7) ^ Ce(p, 18) ^ p >>> 3, w = Ce(h, 17) ^ Ce(h, 19) ^ h >>> 10;
      an[u] = w + an[u - 7] + y + an[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Ce(a, 6) ^ Ce(a, 11) ^ Ce(a, 25), h = f + p + l1(a, c, l) + f1[u] + an[u] | 0, w = (Ce(r, 2) ^ Ce(r, 13) ^ Ce(r, 22)) + u1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    an.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, h1 = class extends Ph {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Xr = Ar(() => new Ph());
Ar(() => new h1());
const d1 = {}, Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: d1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const lt = BigInt(0), $t = BigInt(1), _n = BigInt(2), Cs = BigInt(3), uu = BigInt(8), gt = Object.freeze({
  a: lt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: $t,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), fu = (t, e) => (t + e / _n) / e, li = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = gt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -$t * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = fu(i * t, e), c = fu(-r * t, e);
    let l = H(t - a * n - c * s, e), f = H(-a * r - c * i, e);
    const u = l > o, p = f > o;
    if (u && (l = e - l), p && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: p, k2: f };
  }
}, $e = 32, ar = 32, Oh = 32, Ki = $e + 1, qi = 2 * $e + 1;
function hu(t) {
  const { a: e, b: n } = gt, r = H(t * t), s = H(r * t);
  return H(s + e * t + n);
}
const ui = gt.a === lt;
class Pc extends Error {
  constructor(e) {
    super(e);
  }
}
function du(t) {
  if (!(t instanceof dt))
    throw new TypeError("JacobianPoint expected");
}
class dt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof st))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(st.ZERO) ? dt.ZERO : new dt(e.x, e.y, $t);
  }
  static toAffineBatch(e) {
    const n = b1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return dt.toAffineBatch(e).map(dt.fromAffine);
  }
  equals(e) {
    du(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = H(s * s), l = H(a * a), f = H(n * l), u = H(i * c), p = H(H(r * a) * l), h = H(H(o * s) * c);
    return f === u && p === h;
  }
  negate() {
    return new dt(this.x, H(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = H(e * e), i = H(n * n), o = H(i * i), a = e + i, c = H(_n * (H(a * a) - s - o)), l = H(Cs * s), f = H(l * l), u = H(f - _n * c), p = H(l * (c - u) - uu * o), h = H(_n * n * r);
    return new dt(u, p, h);
  }
  add(e) {
    du(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === lt || o === lt)
      return this;
    if (n === lt || r === lt)
      return e;
    const c = H(s * s), l = H(a * a), f = H(n * l), u = H(i * c), p = H(H(r * a) * l), h = H(H(o * s) * c), y = H(u - f), w = H(h - p);
    if (y === lt)
      return w === lt ? this.double() : dt.ZERO;
    const I = H(y * y), k = H(y * I), M = H(f * I), b = H(w * w - k - _n * M), L = H(w * (M - b) - p * k), A = H(s * a * y);
    return new dt(b, L, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = dt.ZERO;
    if (typeof e == "bigint" && e === lt)
      return n;
    let r = yu(e);
    if (r === $t)
      return this;
    if (!ui) {
      let u = n, p = this;
      for (; r > lt; )
        r & $t && (u = u.add(p)), p = p.double(), r >>= $t;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = li.splitScalar(r), c = n, l = n, f = this;
    for (; i > lt || a > lt; )
      i & $t && (c = c.add(f)), a & $t && (l = l.add(f)), f = f.double(), i >>= $t, a >>= $t;
    return s && (c = c.negate()), o && (l = l.negate()), l = new dt(H(l.x * li.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = ui ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(dt.BASE) && (n = st.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ma.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = dt.normalizeZ(s), Ma.set(n, s)));
    let i = dt.ZERO, o = dt.BASE;
    const a = 1 + (ui ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let p = 0; p < a; p++) {
      const h = p * c;
      let y = Number(e & l);
      e >>= u, y > c && (y -= f, e += $t);
      const w = h, I = h + Math.abs(y) - 1, k = p % 2 !== 0, M = y < 0;
      y === 0 ? o = o.add(fi(k, s[w])) : i = i.add(fi(M, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = yu(e), s, i;
    if (ui) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = li.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p, f: h } = this.wNAF(l, n);
      f = fi(o, f), p = fi(c, p), p = new dt(H(p.x * li.beta), p.y, p.z), s = f.add(p), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return dt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(dt.ZERO);
    e == null && (e = i ? uu : ps(s));
    const o = e, a = H(o * o), c = H(a * o), l = H(n * a), f = H(r * c), u = H(s * o);
    if (i)
      return st.ZERO;
    if (u !== $t)
      throw new Error("invZ was invalid");
    return new st(l, f);
  }
}
dt.BASE = new dt(gt.Gx, gt.Gy, $t);
dt.ZERO = new dt(lt, $t, lt);
function fi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ma = /* @__PURE__ */ new WeakMap();
class st {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ma.delete(this);
  }
  hasEvenY() {
    return this.y % _n === lt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ce(n ? e : e.subarray(1));
    if (!Ni(r))
      throw new Error("Point is not on curve");
    const s = hu(r);
    let i = w1(s);
    const o = (i & $t) === $t;
    n ? o && (i = H(-i)) : (e[0] & 1) === 1 !== o && (i = H(-i));
    const a = new st(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = ce(e.subarray(1, $e + 1)), r = ce(e.subarray($e + 1, $e * 2 + 1)), s = new st(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = je(e), r = n.length, s = n[0];
    if (r === $e)
      return this.fromCompressedHex(n);
    if (r === Ki && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === qi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ki} compressed bytes or ${qi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return st.BASE.multiply(cr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = zh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Dc(je(e)), { n: a } = gt, c = r === 2 || r === 3 ? s + a : s, l = ps(c, a), f = H(-o * l, a), u = H(i * l, a), p = r & 1 ? "03" : "02", h = st.fromHex(p + Un(c)), y = st.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return Tn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Un(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Un(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ni(n) || !Ni(r))
      throw new Error(e);
    const s = H(r * r), i = hu(n);
    if (H(s - i) !== lt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new st(this.x, H(-this.y));
  }
  double() {
    return dt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return dt.fromAffine(this).add(dt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return dt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = dt.fromAffine(this), i = n === lt || n === $t || this !== st.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = dt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(dt.ZERO) ? void 0 : a.toAffine();
  }
}
st.BASE = new st(gt.Gx, gt.Gy);
st.ZERO = new st(lt, lt);
function pu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function gu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Zr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ce(n), left: t.subarray(e + 2) };
}
function p1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Zr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = gu(t.subarray(2)), { data: r, left: s } = gu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Zr(s)}`);
  return { r: e, s: r };
}
class ae {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Zr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ae(Wi(s.slice(0, 64)), Wi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = p1(n ? e : Tn(e));
    return new ae(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Jr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Jr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = gt.n >> $t;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ae(this.r, H(-this.s, gt.n)) : this;
  }
  toDERRawBytes() {
    return Tn(this.toDERHex());
  }
  toDERHex() {
    const e = pu($s(this.s)), n = pu($s(this.r)), r = e.length / 2, s = n.length / 2, i = $s(r), o = $s(s);
    return `30${$s(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Tn(this.toCompactHex());
  }
  toCompactHex() {
    return Un(this.r) + Un(this.s);
  }
}
function kn(...t) {
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
const g1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += g1[t[n]];
  return e;
}
const y1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Un(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(lt <= t && t < y1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Qr(t) {
  const e = Tn(Un(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function $s(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Wi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Tn(t) {
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
function ce(t) {
  return Wi(Zr(t));
}
function je(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Tn(t);
}
function yu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Jr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function H(t, e = gt.P) {
  const n = t % e;
  return n >= lt ? n : e + n;
}
function de(t, e) {
  const { P: n } = gt;
  let r = t;
  for (; e-- > lt; )
    r *= r, r %= n;
  return r;
}
function w1(t) {
  const { P: e } = gt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = de(l, Cs) * l % e, u = de(f, Cs) * l % e, p = de(u, _n) * c % e, h = de(p, r) * p % e, y = de(h, s) * h % e, w = de(y, o) * y % e, I = de(w, a) * w % e, k = de(I, o) * y % e, M = de(k, Cs) * l % e, b = de(M, i) * h % e, L = de(b, n) * c % e, A = de(L, _n);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function ps(t, e = gt.P) {
  if (t === lt || e <= lt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = H(t, e), r = e, s = lt, i = $t;
  for (; n !== lt; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== $t)
    throw new Error("invert: does not exist");
  return H(s, e);
}
function b1(t, e = gt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === lt ? i : (n[a] = i, H(i * o, e)), $t), s = ps(r, e);
  return t.reduceRight((i, o, a) => o === lt ? i : (n[a] = H(i * n[a], e), H(i * o, e)), s), n;
}
function x1(t) {
  const e = t.length * 8 - ar * 8, n = ce(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Dc(t, e = !1) {
  const n = x1(t);
  if (e)
    return n;
  const { n: r } = gt;
  return n >= r ? n - r : n;
}
let qr, Bs;
class jh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Mt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Bs(this.k, ...e);
  }
  checkSync() {
    if (typeof Bs != "function")
      throw new Pc("hmacSha256Sync needs to be set");
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
    return kn(...n);
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
    return kn(...n);
  }
}
function Jr(t) {
  return lt < t && t < gt.n;
}
function Ni(t) {
  return lt < t && t < gt.P;
}
function Fh(t, e, n, r = !0) {
  const { n: s } = gt, i = Dc(t, !0);
  if (!Jr(i))
    return;
  const o = ps(i, s), a = st.BASE.multiply(i), c = H(a.x, s);
  if (c === lt)
    return;
  const l = H(o * H(e + n * c, s), s);
  if (l === lt)
    return;
  let f = new ae(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & $t);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function cr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ar)
      throw new Error("Expected 32 bytes of private key");
    e = Wi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ar)
      throw new Error("Expected 32 bytes of private key");
    e = ce(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Jr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Oc(t) {
  return t instanceof st ? (t.assertValidity(), t) : st.fromHex(t);
}
function zh(t) {
  if (t instanceof ae)
    return t.assertValidity(), t;
  try {
    return ae.fromDER(t);
  } catch {
    return ae.fromCompact(t);
  }
}
function Xs(t, e = !1) {
  return st.fromPrivateKey(t).toRawBytes(e);
}
function m1(t, e, n, r = !1) {
  return st.fromSignature(t, e, n).toRawBytes(r);
}
function wu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ki || r === qi : n ? r === Ki * 2 || r === qi * 2 : t instanceof st;
}
function jc(t, e, n = !1) {
  if (wu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!wu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Oc(e);
  return r.assertValidity(), r.multiply(cr(t)).toRawBytes(n);
}
function Rh(t) {
  const e = t.length > $e ? t.slice(0, $e) : t;
  return ce(e);
}
function S1(t) {
  const e = Rh(t), n = H(e, gt.n);
  return Gh(n < lt ? e : n);
}
function Gh(t) {
  return Qr(t);
}
function Vh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = je(t), s = cr(e), i = [Gh(s), S1(r)];
  if (n != null) {
    n === !0 && (n = Mt.randomBytes($e));
    const c = je(n);
    if (c.length !== $e)
      throw new Error(`sign: Expected ${$e} bytes of extra data`);
    i.push(c);
  }
  const o = kn(...i), a = Rh(r);
  return { seed: o, m: a, d: s };
}
function Kh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function E1(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Vh(t, e, n.extraEntropy), o = new jh(Oh, ar);
  await o.reseed(r);
  let a;
  for (; !(a = Fh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Kh(a, n);
}
function So(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Vh(t, e, n.extraEntropy), o = new jh(Oh, ar);
  o.reseedSync(r);
  let a;
  for (; !(a = Fh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Kh(a, n);
}
const A1 = { strict: !0 };
function $1(t, e, n, r = A1) {
  let s;
  try {
    s = zh(t), e = je(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Dc(e);
  let c;
  try {
    c = Oc(n);
  } catch {
    return !1;
  }
  const { n: l } = gt, f = ps(o, l), u = H(a * f, l), p = H(i * f, l), h = st.BASE.multiplyAndAddUnsafe(c, u, p);
  return h ? H(h.x, l) === i : !1;
}
function Yi(t) {
  return H(ce(t), gt.n);
}
class ts {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = je(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ce(n.subarray(0, 32)), s = ce(n.subarray(32, 64));
    return new ts(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ni(e) || !Jr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Un(this.r) + Un(this.s);
  }
  toRawBytes() {
    return Tn(this.toHex());
  }
}
function I1(t) {
  return st.fromPrivateKey(t).toRawX();
}
class qh {
  constructor(e, n, r = Mt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = je(e);
    const { x: s, scalar: i } = this.getScalar(cr(n));
    if (this.px = s, this.d = i, this.rand = je(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = st.fromPrivateKey(e), r = n.hasEvenY() ? e : gt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Qr(e ^ ce(n));
  }
  finalizeNonce(e) {
    const n = H(ce(e), gt.n);
    if (n === lt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new ts(e.x, H(n + r * s, gt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Mt.taggedHash, o = this.initNonce(n, await i(Bn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Bn.nonce, o, r, e)), f = Yi(await i(Bn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await Xh(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Mt.taggedHashSync, o = this.initNonce(n, i(Bn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Bn.nonce, o, r, e)), f = Yi(i(Bn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Zh(u, e, r) || this.error(), u;
  }
}
async function v1(t, e, n) {
  return new qh(t, e, n).calc();
}
function L1(t, e, n) {
  return new qh(t, e, n).calcSync();
}
function Wh(t, e, n) {
  const r = t instanceof ts, s = r ? t : ts.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: je(e),
    P: Oc(n)
  };
}
function Yh(t, e, n, r) {
  const s = st.BASE.multiplyAndAddUnsafe(e, cr(n), H(-r, gt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Xh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Wh(t, e, n), a = Yi(await Mt.taggedHash(Bn.challenge, Qr(r), o.toRawX(), i));
    return Yh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Zh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Wh(t, e, n), a = Yi(Mt.taggedHashSync(Bn.challenge, Qr(r), o.toRawX(), i));
    return Yh(r, o, s, a);
  } catch (r) {
    if (r instanceof Pc)
      throw r;
    return !1;
  }
}
const C1 = {
  Signature: ts,
  getPublicKey: I1,
  sign: v1,
  verify: Xh,
  signSync: L1,
  verifySync: Zh
};
st.BASE._setWindowSize(8);
const ne = {
  node: Dh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, hi = {}, Mt = {
  bytesToHex: Zr,
  hexToBytes: Tn,
  concatBytes: kn,
  mod: H,
  invert: ps,
  isValidPrivateKey(t) {
    try {
      return cr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Qr,
  _normalizePrivateKey: cr,
  hashToPrivateKey: (t) => {
    t = je(t);
    const e = ar + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = H(ce(t), gt.n - $t) + $t;
    return Qr(n);
  },
  randomBytes: (t = 32) => {
    if (ne.web)
      return ne.web.getRandomValues(new Uint8Array(t));
    if (ne.node) {
      const { randomBytes: e } = ne.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Mt.hashToPrivateKey(Mt.randomBytes(ar + 8)),
  precompute(t = 8, e = st.BASE) {
    const n = e === st.BASE ? e : new st(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Cs), n;
  },
  sha256: async (...t) => {
    if (ne.web) {
      const e = await ne.web.subtle.digest("SHA-256", kn(...t));
      return new Uint8Array(e);
    } else if (ne.node) {
      const { createHash: e } = ne.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ne.web) {
      const n = await ne.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = kn(...e), s = await ne.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ne.node) {
      const { createHmac: n } = ne.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = hi[t];
    if (n === void 0) {
      const r = await Mt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = kn(r, r), hi[t] = n;
    }
    return Mt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof qr != "function")
      throw new Pc("sha256Sync is undefined, you need to set it");
    let n = hi[t];
    if (n === void 0) {
      const r = qr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = kn(r, r), hi[t] = n;
    }
    return qr(n, ...e);
  },
  _JacobianPoint: dt
};
Object.defineProperties(Mt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return qr;
    },
    set(t) {
      qr || (qr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Bs;
    },
    set(t) {
      Bs || (Bs = t);
    }
  }
});
const B1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: gt,
  Point: st,
  Signature: ae,
  getPublicKey: Xs,
  getSharedSecret: jc,
  recoverPublicKey: m1,
  schnorr: C1,
  sign: E1,
  signSync: So,
  utils: Mt,
  verify: $1
}, Symbol.toStringTag, { value: "Module" }));
var Zs = {};
Zs.byteLength = T1;
var k1 = Zs.toByteArray = N1, M1 = Zs.fromByteArray = O1, Te = [], ge = [], _1 = typeof Uint8Array < "u" ? Uint8Array : Array, oa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Pr = 0, U1 = oa.length; Pr < U1; ++Pr)
  Te[Pr] = oa[Pr], ge[oa.charCodeAt(Pr)] = Pr;
ge[45] = 62;
ge[95] = 63;
function Qh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function T1(t) {
  var e = Qh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function H1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function N1(t) {
  var e, n = Qh(t), r = n[0], s = n[1], i = new _1(H1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ge[t.charCodeAt(c)] << 18 | ge[t.charCodeAt(c + 1)] << 12 | ge[t.charCodeAt(c + 2)] << 6 | ge[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ge[t.charCodeAt(c)] << 2 | ge[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ge[t.charCodeAt(c)] << 10 | ge[t.charCodeAt(c + 1)] << 4 | ge[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function P1(t) {
  return Te[t >> 18 & 63] + Te[t >> 12 & 63] + Te[t >> 6 & 63] + Te[t & 63];
}
function D1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(P1(r));
  return s.join("");
}
function O1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(D1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Te[e >> 2] + Te[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Te[e >> 10] + Te[e >> 4 & 63] + Te[e << 2 & 63] + "="
  )), s.join("");
}
function j1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const F1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function z1() {
  if (j1())
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
    throw new Error(F1);
  }
}
class R1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Oe(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Oe(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class G1 {
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
async function Jh() {
  const t = await z1();
  return t.name === "subtleCrypto" ? new G1(t.lib) : new R1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function V1(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), l = Math.log(256) / Math.log(o);
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var y = 0, w = 0, I = 0, k = h.length; I !== k && h[I] === 0; )
      I++, y++;
    for (var M = (k - I) * l + 1 >>> 0, b = new Uint8Array(M); I !== k; ) {
      for (var L = h[I], A = 0, T = M - 1; (L !== 0 || A < w) && T !== -1; T--, A++)
        L += 256 * b[T] >>> 0, b[T] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = A, I++;
    }
    for (var G = M - w; G !== M && b[G] === 0; )
      G++;
    for (var N = a.repeat(y); G < M; ++G)
      N += t.charAt(b[G]);
    return N;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, I = 0; h[y] === a; )
      w++, y++;
    for (var k = (h.length - y) * c + 1 >>> 0, M = new Uint8Array(k); h[y]; ) {
      var b = h.charCodeAt(y);
      if (b > 255)
        return;
      var L = e[b];
      if (L === 255)
        return;
      for (var A = 0, T = k - 1; (L !== 0 || A < I) && T !== -1; T--, A++)
        L += o * M[T] >>> 0, M[T] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      I = A, y++;
    }
    for (var G = k - I; G !== k && M[G] === 0; )
      G++;
    for (var N = new Uint8Array(w + (k - G)), P = w; G !== k; )
      N[P++] = M[G++];
    return N;
  }
  function p(h) {
    var y = u(h);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: p
  };
}
var td = V1;
const K1 = td, q1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var W1 = K1(q1);
const Y1 = /* @__PURE__ */ Ah(W1), X1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ed = Uint8Array.from({ length: 16 }, (t, e) => e), Z1 = ed.map((t) => (9 * t + 5) % 16);
let Fc = [ed], zc = [Z1];
for (let t = 0; t < 4; t++)
  for (let e of [Fc, zc])
    e.push(e[t].map((n) => X1[n]));
const nd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Q1 = Fc.map((t, e) => t.map((n) => nd[e][n])), J1 = zc.map((t, e) => t.map((n) => nd[e][n])), tw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ew = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), di = (t, e) => t << e | t >>> 32 - e;
function bu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const pi = new Uint32Array(16);
let nw = class extends Nc {
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
    for (let h = 0; h < 16; h++, n += 4)
      pi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = tw[h], I = ew[h], k = Fc[h], M = zc[h], b = Q1[h], L = J1[h];
      for (let A = 0; A < 16; A++) {
        const T = di(r + bu(h, i, a, l) + pi[k[A]] + w, b[A]) + u | 0;
        r = u, u = l, l = di(a, 10) | 0, a = i, i = T;
      }
      for (let A = 0; A < 16; A++) {
        const T = di(s + bu(y, o, c, f) + pi[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = di(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    pi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const rw = Ar(() => new nw());
function sw(t) {
  return rw(t);
}
const gi = BigInt(2 ** 32 - 1), _a = BigInt(32);
function rd(t, e = !1) {
  return e ? { h: Number(t & gi), l: Number(t >> _a & gi) } : { h: Number(t >> _a & gi) | 0, l: Number(t & gi) | 0 };
}
function iw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = rd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const ow = (t, e) => BigInt(t >>> 0) << _a | BigInt(e >>> 0), aw = (t, e, n) => t >>> n, cw = (t, e, n) => t << 32 - n | e >>> n, lw = (t, e, n) => t >>> n | e << 32 - n, uw = (t, e, n) => t << 32 - n | e >>> n, fw = (t, e, n) => t << 64 - n | e >>> n - 32, hw = (t, e, n) => t >>> n - 32 | e << 64 - n, dw = (t, e) => e, pw = (t, e) => t, gw = (t, e, n) => t << n | e >>> 32 - n, yw = (t, e, n) => e << n | t >>> 32 - n, ww = (t, e, n) => e << n - 32 | t >>> 64 - n, bw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const mw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Sw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ew = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Aw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, $w = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Iw = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Q = {
  fromBig: rd,
  split: iw,
  toBig: ow,
  shrSH: aw,
  shrSL: cw,
  rotrSH: lw,
  rotrSL: uw,
  rotrBH: fw,
  rotrBL: hw,
  rotr32H: dw,
  rotr32L: pw,
  rotlSH: gw,
  rotlSL: yw,
  rotlBH: ww,
  rotlBL: bw,
  add: xw,
  add3L: mw,
  add3H: Sw,
  add4L: Ew,
  add4H: Aw,
  add5H: Iw,
  add5L: $w
}, [vw, Lw] = Q.split([
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
].map((t) => BigInt(t))), cn = new Uint32Array(80), ln = new Uint32Array(80);
let Eo = class extends Nc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      cn[b] = e.getUint32(n), ln[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = cn[b - 15] | 0, A = ln[b - 15] | 0, T = Q.rotrSH(L, A, 1) ^ Q.rotrSH(L, A, 8) ^ Q.shrSH(L, A, 7), G = Q.rotrSL(L, A, 1) ^ Q.rotrSL(L, A, 8) ^ Q.shrSL(L, A, 7), N = cn[b - 2] | 0, P = ln[b - 2] | 0, x = Q.rotrSH(N, P, 19) ^ Q.rotrBH(N, P, 61) ^ Q.shrSH(N, P, 6), v = Q.rotrSL(N, P, 19) ^ Q.rotrBL(N, P, 61) ^ Q.shrSL(N, P, 6), U = Q.add4L(G, v, ln[b - 7], ln[b - 16]), R = Q.add4H(U, T, x, cn[b - 7], cn[b - 16]);
      cn[b] = R | 0, ln[b] = U | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = Q.rotrSH(u, p, 14) ^ Q.rotrSH(u, p, 18) ^ Q.rotrBH(u, p, 41), A = Q.rotrSL(u, p, 14) ^ Q.rotrSL(u, p, 18) ^ Q.rotrBL(u, p, 41), T = u & h ^ ~u & w, G = p & y ^ ~p & I, N = Q.add5L(M, A, G, Lw[b], ln[b]), P = Q.add5H(N, k, L, T, vw[b], cn[b]), x = N | 0, v = Q.rotrSH(r, s, 28) ^ Q.rotrBH(r, s, 34) ^ Q.rotrBH(r, s, 39), U = Q.rotrSL(r, s, 28) ^ Q.rotrBL(r, s, 34) ^ Q.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, g = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = p | 0, { h: u, l: p } = Q.add(l | 0, f | 0, P | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const E = Q.add3L(x, U, g);
      r = Q.add3H(E, P, v, R), s = E | 0;
    }
    ({ h: r, l: s } = Q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Q.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = Q.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: y } = Q.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = Q.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = Q.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, y, w, I, k, M);
  }
  roundClean() {
    cn.fill(0), ln.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Cw = class extends Eo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Bw = class extends Eo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, kw = class extends Eo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Mw = Ar(() => new Eo());
Ar(() => new Cw());
Ar(() => new Bw());
Ar(() => new kw());
function sd(t) {
  return Xr(t);
}
function _w(t) {
  return Mw(t);
}
const Uw = 0;
Mt.hmacSha256Sync = (t, ...e) => {
  const n = mo.create(Xr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Tw() {
  return W(Mt.randomPrivateKey());
}
function Hw(t) {
  const e = Xr(Xr(t));
  return Y1.encode(Oe(t, e).slice(0, t.length + 4));
}
function Nw(t, e) {
  return Hw(Oe(new Uint8Array([t]), e.slice(0, 20)));
}
function id(t, e = Uw) {
  const n = typeof t == "string" ? ft(t) : t, r = sw(sd(n));
  return Nw(e, r);
}
function od(t) {
  const e = Tc(t);
  return W(Xs(e.slice(0, 32), !0));
}
Mt.hmacSha256Sync = (t, ...e) => {
  const n = mo.create(Xr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Xi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Xi || (Xi = {}));
async function Pw(t, e, n) {
  return await (await Jh()).encrypt("aes-256-cbc", e, t, n);
}
async function Dw(t, e, n) {
  return await (await Jh()).decrypt("aes-256-cbc", e, t, n);
}
function ad(t, e) {
  return mo(Xr, t, e);
}
function Ow(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function cd(t) {
  const e = _w(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function jw(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Fw(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Xi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Xi.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !jw(t))
    return e;
  try {
    return st.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function zw(t, e, n, r) {
  const s = Fw(t);
  if (!s.result)
    throw s;
  const i = Mt.randomPrivateKey(), o = Xs(i, !0);
  let a = jc(i, t, !0);
  a = a.slice(1);
  const c = cd(a), l = Mt.randomBytes(16), f = await Pw(l, c.encryptionKey, e), u = Oe(l, o, f), p = ad(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = W(f);
  else if (r === "base64")
    h = M1(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: W(l),
    ephemeralPK: W(o),
    cipherText: h,
    mac: W(p),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function ld(t, e) {
  if (!e.ephemeralPK)
    throw new ou("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = jc(t, n, !0);
  r = r.slice(1);
  const s = cd(r), i = ft(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ft(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = k1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Oe(i, ft(n), o), c = ad(s.hmacKey, a), l = ft(e.mac);
  if (!Ow(l, c))
    throw new ou("Decryption failed: failure in MAC check");
  const f = await Dw(i, s.encryptionKey, o);
  return e.wasString ? Ys(f) : f;
}
function Rw(t, e) {
  const n = typeof e == "string" ? Er(e) : e, r = od(t), s = sd(n), i = So(s, t);
  return {
    signature: W(i),
    publicKey: r
  };
}
async function Gw(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = od(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Er(t) : t, o = await zw(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Rw(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Vw(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return ld(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ft = {}, es = {}, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.decode = Kt.encode = Kt.unescape = Kt.escape = Kt.pad = void 0;
const ud = Zs;
function Rc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Kt.pad = Rc;
function fd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Kt.escape = fd;
function hd(t) {
  return Rc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Kt.unescape = hd;
function Kw(t) {
  return fd((0, ud.fromByteArray)(new TextEncoder().encode(t)));
}
Kt.encode = Kw;
function qw(t) {
  return new TextDecoder().decode((0, ud.toByteArray)(Rc(hd(t))));
}
Kt.decode = qw;
var Ao = {}, $o = {}, dd = {}, pd = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.crypto = void 0;
Io.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = p, t.rotl = h, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = M, t.hexToBytes = A, t.asyncLoop = G, t.utf8ToBytes = N, t.bytesToUtf8 = P, t.toBytes = x, t.kdfInputToBytes = v, t.concatBytes = U, t.checkOpts = R, t.createHasher = E, t.createOptHasher = D, t.createXOFer = F, t.randomBytes = ht;
  const e = Io;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...B) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (B.length > 0 && !B.includes(m.length))
      throw new Error("Uint8Array expected of length " + B + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, B = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (B && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(m, B) {
    s(m);
    const Y = B.outputLen;
    if (m.length < Y)
      throw new Error("digestInto() expects output buffer of length at least " + Y);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function l(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let B = 0; B < m.length; B++)
      m[B].fill(0);
  }
  function u(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function p(m, B) {
    return m << 32 - B | m >>> B;
  }
  function h(m, B) {
    return m << B | m >>> 32 - B >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => y(m), t.byteSwapIfBE = t.swap8IfBE;
  function w(m) {
    for (let B = 0; B < m.length; B++)
      m[B] = y(m[B]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : w;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", k = /* @__PURE__ */ Array.from({ length: 256 }, (m, B) => B.toString(16).padStart(2, "0"));
  function M(m) {
    if (s(m), I)
      return m.toHex();
    let B = "";
    for (let Y = 0; Y < m.length; Y++)
      B += k[m[Y]];
    return B;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(m) {
    if (m >= b._0 && m <= b._9)
      return m - b._0;
    if (m >= b.A && m <= b.F)
      return m - (b.A - 10);
    if (m >= b.a && m <= b.f)
      return m - (b.a - 10);
  }
  function A(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (I)
      return Uint8Array.fromHex(m);
    const B = m.length, Y = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const ut = new Uint8Array(Y);
    for (let ct = 0, yt = 0; ct < Y; ct++, yt += 2) {
      const zt = L(m.charCodeAt(yt)), Et = L(m.charCodeAt(yt + 1));
      if (zt === void 0 || Et === void 0) {
        const ot = m[yt] + m[yt + 1];
        throw new Error('hex string expected, got non-hex character "' + ot + '" at index ' + yt);
      }
      ut[ct] = zt * 16 + Et;
    }
    return ut;
  }
  const T = async () => {
  };
  t.nextTick = T;
  async function G(m, B, Y) {
    let ut = Date.now();
    for (let ct = 0; ct < m; ct++) {
      Y(ct);
      const yt = Date.now() - ut;
      yt >= 0 && yt < B || (await (0, t.nextTick)(), ut += yt);
    }
  }
  function N(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function P(m) {
    return new TextDecoder().decode(m);
  }
  function x(m) {
    return typeof m == "string" && (m = N(m)), s(m), m;
  }
  function v(m) {
    return typeof m == "string" && (m = N(m)), s(m), m;
  }
  function U(...m) {
    let B = 0;
    for (let ut = 0; ut < m.length; ut++) {
      const ct = m[ut];
      s(ct), B += ct.length;
    }
    const Y = new Uint8Array(B);
    for (let ut = 0, ct = 0; ut < m.length; ut++) {
      const yt = m[ut];
      Y.set(yt, ct), ct += yt.length;
    }
    return Y;
  }
  function R(m, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, B);
  }
  class g {
  }
  t.Hash = g;
  function E(m) {
    const B = (ut) => m().update(x(ut)).digest(), Y = m();
    return B.outputLen = Y.outputLen, B.blockLen = Y.blockLen, B.create = () => m(), B;
  }
  function D(m) {
    const B = (ut, ct) => m(ct).update(x(ut)).digest(), Y = m({});
    return B.outputLen = Y.outputLen, B.blockLen = Y.blockLen, B.create = (ut) => m(ut), B;
  }
  function F(m) {
    const B = (ut, ct) => m(ct).update(x(ut)).digest(), Y = m({});
    return B.outputLen = Y.outputLen, B.blockLen = Y.blockLen, B.create = (ut) => m(ut), B;
  }
  t.wrapConstructor = E, t.wrapConstructorWithOpts = D, t.wrapXOFConstructorWithOpts = F;
  function ht(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(pd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = pd;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, l = new Uint8Array(c);
      l.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < l.length; f++)
        l[f] ^= 54;
      this.iHash.update(l), this.oHash = i.create();
      for (let f = 0; f < l.length; f++)
        l[f] ^= 106;
      this.oHash.update(l), (0, e.clean)(l);
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
      const { oHash: o, iHash: a, finished: c, destroyed: l, blockLen: f, outputLen: u } = this;
      return i = i, i.finished = c, i.destroyed = l, i.blockLen = f, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(dd);
const Dr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function gd(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ua(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function $r(t, ...e) {
  if (!gd(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Ww(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ua(t.outputLen), Ua(t.blockLen);
}
function Ta(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function yd(t, e) {
  $r(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Yw(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Xw(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Zi(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Pi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function xe(t, e) {
  return t << 32 - e | t >>> e;
}
function Zw(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Gc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Vc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const wd = Gc ? (t) => t : (t) => Vc(t), Qw = wd;
function bd(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Vc(t[e]);
  return t;
}
const Jw = Gc ? (t) => t : bd, xd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", tb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eb(t) {
  if ($r(t), xd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += tb[t[n]];
  return e;
}
const We = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function xu(t) {
  if (t >= We._0 && t <= We._9)
    return t - We._0;
  if (t >= We.A && t <= We.F)
    return t - (We.A - 10);
  if (t >= We.a && t <= We.f)
    return t - (We.a - 10);
}
function nb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (xd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = xu(t.charCodeAt(i)), a = xu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const md = async () => {
};
async function rb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await md(), r += i);
  }
}
function Kc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function sb(t) {
  return new TextDecoder().decode(t);
}
function Qs(t) {
  return typeof t == "string" && (t = Kc(t)), $r(t), t;
}
function ib(t) {
  return typeof t == "string" && (t = Kc(t)), $r(t), t;
}
function ob(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    $r(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function ab(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Sd = class {
};
function vo(t) {
  const e = (r) => t().update(Qs(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ed(t) {
  const e = (r, s) => t(s).update(Qs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ad(t) {
  const e = (r, s) => t(s).update(Qs(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const cb = vo, lb = Ed, ub = Ad;
function fb(t = 32) {
  if (Dr && typeof Dr.getRandomValues == "function")
    return Dr.getRandomValues(new Uint8Array(t));
  if (Dr && typeof Dr.randomBytes == "function")
    return Uint8Array.from(Dr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const hb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Sd,
  abytes: $r,
  aexists: Ta,
  ahash: Ww,
  anumber: Ua,
  aoutput: yd,
  asyncLoop: rb,
  byteSwap: Vc,
  byteSwap32: bd,
  byteSwapIfBE: Qw,
  bytesToHex: eb,
  bytesToUtf8: sb,
  checkOpts: ab,
  clean: Zi,
  concatBytes: ob,
  createHasher: vo,
  createOptHasher: Ed,
  createView: Pi,
  createXOFer: Ad,
  hexToBytes: nb,
  isBytes: gd,
  isLE: Gc,
  kdfInputToBytes: ib,
  nextTick: md,
  randomBytes: fb,
  rotl: Zw,
  rotr: xe,
  swap32IfBE: Jw,
  swap8IfBE: wd,
  toBytes: Qs,
  u32: Xw,
  u8: Yw,
  utf8ToBytes: Kc,
  wrapConstructor: cb,
  wrapConstructorWithOpts: lb,
  wrapXOFConstructorWithOpts: ub
}, Symbol.toStringTag, { value: "Module" }));
function db(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function pb(t, e, n) {
  return t & e ^ ~t & n;
}
function gb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class yb extends Sd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Pi(this.buffer);
  }
  update(e) {
    Ta(this), e = Qs(e), $r(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ta(this), yd(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Zi(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    db(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pi(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const un = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), wb = /* @__PURE__ */ Uint32Array.from([
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
]), hn = /* @__PURE__ */ new Uint32Array(64);
let qc = class extends yb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = un[0] | 0, this.B = un[1] | 0, this.C = un[2] | 0, this.D = un[3] | 0, this.E = un[4] | 0, this.F = un[5] | 0, this.G = un[6] | 0, this.H = un[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      hn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = hn[u - 15], h = hn[u - 2], y = xe(p, 7) ^ xe(p, 18) ^ p >>> 3, w = xe(h, 17) ^ xe(h, 19) ^ h >>> 10;
      hn[u] = w + hn[u - 7] + y + hn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = xe(a, 6) ^ xe(a, 11) ^ xe(a, 25), h = f + p + pb(a, c, l) + wb[u] + hn[u] | 0, w = (xe(r, 2) ^ xe(r, 13) ^ xe(r, 22)) + gb(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Zi(hn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Zi(this.buffer);
  }
}, $d = class extends qc {
  constructor() {
    super(28), this.A = fn[0] | 0, this.B = fn[1] | 0, this.C = fn[2] | 0, this.D = fn[3] | 0, this.E = fn[4] | 0, this.F = fn[5] | 0, this.G = fn[6] | 0, this.H = fn[7] | 0;
  }
};
const bb = /* @__PURE__ */ vo(() => new qc()), xb = /* @__PURE__ */ vo(() => new $d()), mb = qc, Sb = bb, Eb = $d, Ab = xb, $b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Eb,
  SHA256: mb,
  sha224: Ab,
  sha256: Sb
}, Symbol.toStringTag, { value: "Module" })), Lo = /* @__PURE__ */ bo($b), Ib = /* @__PURE__ */ bo(B1);
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.joseToDer = ns.derToJose = void 0;
const Id = Zs, vd = Kt;
function aa(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const vb = {
  ES256: aa(256),
  ES384: aa(384),
  ES512: aa(521)
};
function Ld(t) {
  const e = vb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Qi = 128, Cd = 0, Lb = 32, Cb = 16, Bb = 2, Bd = Cb | Lb | Cd << 6, Ji = Bb | Cd << 6;
function kd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Id.toByteArray)((0, vd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function kb(t, e) {
  const n = kd(t), r = Ld(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Bd)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Qi | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ji)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== Ji)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const p = r - c, h = r - f, y = new Uint8Array(p + c + h + f);
  for (o = 0; o < p; ++o)
    y[o] = 0;
  y.set(n.subarray(l + Math.max(-p, 0), l + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    y[o] = 0;
  return y.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, vd.escape)((0, Id.fromByteArray)(y));
}
ns.derToJose = kb;
function mu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Qi && --r, r;
}
function Mb(t, e) {
  t = kd(t);
  const n = Ld(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = mu(t, 0, n), i = mu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Qi, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = Bd, l ? f[u++] = c : (f[u++] = Qi | 1, f[u++] = c & 255), f[u++] = Ji, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = Ji, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
ns.joseToDer = Mb;
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.InvalidTokenError = en.MissingParametersError = void 0;
class _b extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
en.MissingParametersError = _b;
class Ub extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
en.InvalidTokenError = Ub;
const Js = /* @__PURE__ */ bo(hb);
Object.defineProperty($o, "__esModule", { value: !0 });
$o.SECP256K1Client = void 0;
const Tb = dd, Hb = Lo, Di = Ib, Su = ns, Eu = en, Au = Js;
Di.utils.hmacSha256Sync = (t, ...e) => {
  const n = Tb.hmac.create(Hb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Md {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Au.bytesToHex)(Di.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Eu.MissingParametersError("a signing input hash and private key are all required");
    const s = Di.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Au.bytesToHex)(s);
    if (r === "jose")
      return (0, Su.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Su.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Eu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Di.verify(n, e, r, { strict: !1 });
  }
}
$o.SECP256K1Client = Md;
Md.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = $o;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ao);
var lr = {};
const Nb = /* @__PURE__ */ bo(Dh);
var Pb = Wt && Wt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.hashSha256Async = lr.hashSha256 = void 0;
const Db = Lo;
function _d(t) {
  return (0, Db.sha256)(t);
}
lr.hashSha256 = _d;
function Ob(t) {
  return Pb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Nb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(_d(t));
    }
  });
}
lr.hashSha256Async = Ob;
var jb = Wt && Wt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(es, "__esModule", { value: !0 });
es.TokenSigner = es.createUnsecuredToken = void 0;
const Ha = Kt, $u = Ao, Fb = en, Iu = lr;
function Na(t, e) {
  const n = [], r = Ha.encode(JSON.stringify(e));
  n.push(r);
  const s = Ha.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function zb(t) {
  return Na(t, { typ: "JWT", alg: "none" }) + ".";
}
es.createUnsecuredToken = zb;
class Rb {
  constructor(e, n) {
    if (!(e && n))
      throw new Fb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !$u.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = $u.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Na(e, s), o = (0, Iu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return jb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Na(e, s), o = yield (0, Iu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ha.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
es.TokenSigner = Rb;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
Co.TokenVerifier = void 0;
const Gb = Kt, vu = Ao, Vb = en, yi = lr;
class Kb {
  constructor(e, n) {
    if (!(e && n))
      throw new Vb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !vu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = vu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, yi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, yi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Gb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, yi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, yi.hashSha256)(r);
      return i(o);
    }
  }
}
Co.TokenVerifier = Kb;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.decodeToken = void 0;
const wi = Kt;
function qb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(wi.decode(e[0])), r = JSON.parse(wi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = wi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(wi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Bo.decodeToken = qb;
(function(t) {
  var e = Wt && Wt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Wt && Wt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(es, t), n(Co, t), n(Bo, t), n(en, t), n(Ao, t);
})(Ft);
function Wb(t) {
  return `did:btc-addr:${t}`;
}
function Yb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new iu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new iu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ud(t) {
  if (t)
    return Yb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Xb = "1.4.0";
function Zb() {
  return Tw();
}
function Qb(t, e, n, r = Ch.slice(), s, i = My().getTime(), o = {}) {
  const a = (h) => {
    const y = _c("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return y == null ? void 0 : y.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Uy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Xb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = Ft.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = id(l);
  return c.iss = Wb(f), new Ft.TokenSigner("ES256k", t).sign(c);
}
async function Lu(t, e) {
  const n = Ys(ft(e)), r = JSON.parse(n), s = await ld(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Jb(t) {
  const e = Ft.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ft.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function t2(t) {
  const e = Ft.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ud(e.iss);
  if (n.length === 1) {
    if (id(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function e2(t) {
  const e = Ft.decodeToken(t).payload;
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
function n2(t) {
  const e = Ft.decodeToken(t).payload;
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
function r2(t) {
  const e = [
    n2(t),
    e2(t),
    Jb(t),
    t2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Cu = "1.0.0";
class Hn {
  constructor(e) {
    this.version = Cu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Cu)
      throw new La(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Hn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Td {
  constructor(e) {
    if (e) {
      const n = new Hn(e);
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
class Bu extends Td {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Hn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Bh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hn({})), !0;
  }
}
class ku extends Td {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Cy, !localStorage.getItem(this.key)) {
      const r = new Hn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Bh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Hn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Hn({})), !0;
  }
}
var Ps;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ps || (Ps = {}));
var to;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(to || (to = {}));
Ps.Mainnet;
var Je;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Je || (Je = {}));
var Ne;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ne || (Ne = {}));
Je.Mainnet;
const Hd = {
  chainId: Ps.Mainnet,
  transactionVersion: Je.Mainnet,
  peerNetworkId: to.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ne.MainnetSingleSig,
    multiSig: Ne.MainnetMultiSig
  },
  client: { baseUrl: kh }
}, Pa = {
  chainId: Ps.Testnet,
  transactionVersion: Je.Testnet,
  peerNetworkId: to.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ne.TestnetSingleSig,
    multiSig: Ne.TestnetMultiSig
  },
  client: { baseUrl: Mh }
}, Oi = {
  ...Pa,
  addressVersion: { ...Pa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _h }
}, s2 = {
  ...Oi,
  addressVersion: { ...Oi.addressVersion },
  client: { ...Oi.client }
};
function i2(t) {
  switch (t) {
    case "mainnet":
      return Hd;
    case "testnet":
      return Pa;
    case "devnet":
      return Oi;
    case "mocknet":
      return s2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Nd(t) {
  return typeof t == "string" ? i2(t) : t;
}
var Mu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mu || (Mu = {}));
var _u;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(_u || (_u = {}));
var me;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(me || (me = {}));
const ca = ["onChainOnly", "offChainOnly", "any"];
ca[0] + "", me.OnChainOnly, ca[1] + "", me.OffChainOnly, ca[2] + "", me.Any, me.OnChainOnly + "", me.OnChainOnly, me.OffChainOnly + "", me.OffChainOnly, me.Any + "", me.Any;
var Uu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Uu || (Uu = {}));
var Tu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Tu || (Tu = {}));
var Hu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Hu || (Hu = {}));
var Ze;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ze || (Ze = {}));
var Nu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Nu || (Nu = {}));
var Pu;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Pu || (Pu = {}));
var Du;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Du || (Du = {}));
var Ou;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ou || (Ou = {}));
var ju;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ju || (ju = {}));
var Fu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fu || (Fu = {}));
var zu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(zu || (zu = {}));
var Ru;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ru || (Ru = {}));
var Gu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Gu || (Gu = {}));
function Da(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function a2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Da(t.outputLen), Da(t.blockLen);
}
function c2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function l2(t, e) {
  Pd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Zn = {
  number: Da,
  bool: o2,
  bytes: Pd,
  hash: a2,
  exists: c2,
  output: l2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const la = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Be = (t, e) => t << 32 - e | t >>> e, u2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wc(t) {
  if (typeof t == "string" && (t = f2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Dd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ir(t) {
  const e = (r) => t().update(Wc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Od = class extends Dd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Zn.hash(e);
    const r = Wc(n);
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
    return Zn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Zn.exists(this), Zn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const jd = (t, e, n) => new Od(t, e).update(n).digest();
jd.create = (t, e) => new Od(t, e);
function h2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Yc = class extends Dd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = la(this.buffer);
  }
  update(e) {
    Zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Wc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = la(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Zn.exists(this), Zn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    h2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = la(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const d2 = (t, e, n) => t & e ^ ~t & n, p2 = (t, e, n) => t & e ^ t & n ^ e & n, g2 = new Uint32Array([
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
]), dn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pn = new Uint32Array(64);
let Fd = class extends Yc {
  constructor() {
    super(64, 32, 8, !1), this.A = dn[0] | 0, this.B = dn[1] | 0, this.C = dn[2] | 0, this.D = dn[3] | 0, this.E = dn[4] | 0, this.F = dn[5] | 0, this.G = dn[6] | 0, this.H = dn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      pn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = pn[u - 15], h = pn[u - 2], y = Be(p, 7) ^ Be(p, 18) ^ p >>> 3, w = Be(h, 17) ^ Be(h, 19) ^ h >>> 10;
      pn[u] = w + pn[u - 7] + y + pn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Be(a, 6) ^ Be(a, 11) ^ Be(a, 25), h = f + p + d2(a, c, l) + g2[u] + pn[u] | 0, w = (Be(r, 2) ^ Be(r, 13) ^ Be(r, 22)) + p2(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    pn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, y2 = class extends Fd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const zd = Ir(() => new Fd());
Ir(() => new y2());
var vr = {}, Xc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Js;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const y = n.indexOf(o[h]) >> l;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const I = 1 + l, k = w % (1 << I) << 5 - I, M = t.c32[y + k];
        l = I, c.unshift(M);
      } else
        l = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), p = u ? u[0].length : 0;
    for (let h = 0; h < p; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let y = 0; y < h; y++)
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
    const c = o.match(`^${t.c32[0]}*`), l = c ? c[0].length : 0;
    let f = [], u = 0, p = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      p === 4 && (f.unshift(n[u]), p = 0, u = 0);
      const k = (t.c32.indexOf(o[w]) << p) + u, M = n[k % 16];
      if (p += 1, u = k >> 4, u > 1 << p)
        throw new Error("Panic error in decoding.");
      f.unshift(M);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let w = 0; w < f.length && f[w] === "0"; w++)
      h++;
    f = f.slice(h - h % 2);
    let y = f.join("");
    for (let w = 0; w < l; w++)
      y = `00${y}`;
    if (a) {
      const w = a * 2 - y.length;
      for (let I = 0; I < w; I += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(Xc);
var ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.c32checkDecode = ur.c32checkEncode = void 0;
const Vu = Lo, Ku = Js, ks = Xc;
function Rd(t) {
  const e = (0, Vu.sha256)((0, Vu.sha256)((0, Ku.hexToBytes)(t)));
  return (0, Ku.bytesToHex)(e.slice(0, 4));
}
function w2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Rd(`${n}${e}`), s = (0, ks.c32encode)(`${e}${r}`);
  return `${ks.c32[t]}${s}`;
}
ur.c32checkEncode = w2;
function b2(t) {
  t = (0, ks.c32normalize)(t);
  const e = (0, ks.c32decode)(t.slice(1)), n = t[0], r = ks.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Rd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ur.c32checkDecode = b2;
var Gd = {}, rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.decode = rs.encode = void 0;
const eo = Lo, qu = Js, Vd = td, Kd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function x2(t, e = "00") {
  const n = typeof t == "string" ? (0, qu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, qu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...r, ...n])));
  return Vd(Kd).encode([...r, ...n, ...s.slice(0, 4)]);
}
rs.encode = x2;
function m2(t) {
  const e = Vd(Kd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
rs.decode = m2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ur, n = rs, r = Js;
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
  function o(f, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, u)}`;
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
  function c(f, u = -1) {
    const p = n.decode(f), h = (0, r.bytesToHex)(p.data), y = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let w;
    return u < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = u, o(w, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const p = a(f), h = p[0], y = p[1];
    let w;
    u < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = u;
    let I = w.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(y, I);
  }
  t.c32ToB58 = l;
})(Gd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Xc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ur;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Gd;
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
})(vr);
function S2(t, e) {
  switch (e = Nd(e ?? Hd), t) {
    case Ze.P2PKH:
      switch (e.transactionVersion) {
        case Je.Mainnet:
          return Ne.MainnetSingleSig;
        case Je.Testnet:
          return Ne.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ze.P2SH:
    case Ze.P2SHNonSequential:
    case Ze.P2WPKH:
    case Ze.P2WSH:
    case Ze.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Je.Mainnet:
          return Ne.MainnetMultiSig;
        case Je.Testnet:
          return Ne.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const E2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qd = Uint8Array.from({ length: 16 }, (t, e) => e), A2 = qd.map((t) => (9 * t + 5) % 16);
let Zc = [qd], Qc = [A2];
for (let t = 0; t < 4; t++)
  for (let e of [Zc, Qc])
    e.push(e[t].map((n) => E2[n]));
const Wd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), $2 = Zc.map((t, e) => t.map((n) => Wd[e][n])), I2 = Qc.map((t, e) => t.map((n) => Wd[e][n])), v2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), L2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), bi = (t, e) => t << e | t >>> 32 - e;
function Wu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xi = new Uint32Array(16);
let C2 = class extends Yc {
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
    for (let h = 0; h < 16; h++, n += 4)
      xi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = v2[h], I = L2[h], k = Zc[h], M = Qc[h], b = $2[h], L = I2[h];
      for (let A = 0; A < 16; A++) {
        const T = bi(r + Wu(h, i, a, l) + xi[k[A]] + w, b[A]) + u | 0;
        r = u, u = l, l = bi(a, 10) | 0, a = i, i = T;
      }
      for (let A = 0; A < 16; A++) {
        const T = bi(s + Wu(y, o, c, f) + xi[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = bi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const B2 = Ir(() => new C2()), mi = BigInt(2 ** 32 - 1), Oa = BigInt(32);
function Yd(t, e = !1) {
  return e ? { h: Number(t & mi), l: Number(t >> Oa & mi) } : { h: Number(t >> Oa & mi) | 0, l: Number(t & mi) | 0 };
}
function k2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Yd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const M2 = (t, e) => BigInt(t >>> 0) << Oa | BigInt(e >>> 0), _2 = (t, e, n) => t >>> n, U2 = (t, e, n) => t << 32 - n | e >>> n, T2 = (t, e, n) => t >>> n | e << 32 - n, H2 = (t, e, n) => t << 32 - n | e >>> n, N2 = (t, e, n) => t << 64 - n | e >>> n - 32, P2 = (t, e, n) => t >>> n - 32 | e << 64 - n, D2 = (t, e) => e, O2 = (t, e) => t, j2 = (t, e, n) => t << n | e >>> 32 - n, F2 = (t, e, n) => e << n | t >>> 32 - n, z2 = (t, e, n) => e << n - 32 | t >>> 64 - n, R2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function G2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const V2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), K2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), W2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Y2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), X2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, J = {
  fromBig: Yd,
  split: k2,
  toBig: M2,
  shrSH: _2,
  shrSL: U2,
  rotrSH: T2,
  rotrSL: H2,
  rotrBH: N2,
  rotrBL: P2,
  rotr32H: D2,
  rotr32L: O2,
  rotlSH: j2,
  rotlSL: F2,
  rotlBH: z2,
  rotlBL: R2,
  add: G2,
  add3L: V2,
  add3H: K2,
  add4L: q2,
  add4H: W2,
  add5H: X2,
  add5L: Y2
}, [Z2, Q2] = J.split([
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
].map((t) => BigInt(t))), gn = new Uint32Array(80), yn = new Uint32Array(80);
let ko = class extends Yc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      gn[b] = e.getUint32(n), yn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = gn[b - 15] | 0, A = yn[b - 15] | 0, T = J.rotrSH(L, A, 1) ^ J.rotrSH(L, A, 8) ^ J.shrSH(L, A, 7), G = J.rotrSL(L, A, 1) ^ J.rotrSL(L, A, 8) ^ J.shrSL(L, A, 7), N = gn[b - 2] | 0, P = yn[b - 2] | 0, x = J.rotrSH(N, P, 19) ^ J.rotrBH(N, P, 61) ^ J.shrSH(N, P, 6), v = J.rotrSL(N, P, 19) ^ J.rotrBL(N, P, 61) ^ J.shrSL(N, P, 6), U = J.add4L(G, v, yn[b - 7], yn[b - 16]), R = J.add4H(U, T, x, gn[b - 7], gn[b - 16]);
      gn[b] = R | 0, yn[b] = U | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = J.rotrSH(u, p, 14) ^ J.rotrSH(u, p, 18) ^ J.rotrBH(u, p, 41), A = J.rotrSL(u, p, 14) ^ J.rotrSL(u, p, 18) ^ J.rotrBL(u, p, 41), T = u & h ^ ~u & w, G = p & y ^ ~p & I, N = J.add5L(M, A, G, Q2[b], yn[b]), P = J.add5H(N, k, L, T, Z2[b], gn[b]), x = N | 0, v = J.rotrSH(r, s, 28) ^ J.rotrBH(r, s, 34) ^ J.rotrBH(r, s, 39), U = J.rotrSL(r, s, 28) ^ J.rotrBL(r, s, 34) ^ J.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, g = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = p | 0, { h: u, l: p } = J.add(l | 0, f | 0, P | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const E = J.add3L(x, U, g);
      r = J.add3H(E, P, v, R), s = E | 0;
    }
    ({ h: r, l: s } = J.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = J.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = J.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = J.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = J.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: y } = J.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = J.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = J.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, y, w, I, k, M);
  }
  roundClean() {
    gn.fill(0), yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, J2 = class extends ko {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tx = class extends ko {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ex = class extends ko {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ir(() => new ko());
Ir(() => new J2());
Ir(() => new tx());
Ir(() => new ex());
var no = { exports: {} };
no.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", p = "[object Map]", h = "[object Number]", y = "[object Object]", w = "[object Promise]", I = "[object RegExp]", k = "[object Set]", M = "[object String]", b = "[object Symbol]", L = "[object WeakMap]", A = "[object ArrayBuffer]", T = "[object DataView]", G = "[object Float32Array]", N = "[object Float64Array]", P = "[object Int8Array]", x = "[object Int16Array]", v = "[object Int32Array]", U = "[object Uint8Array]", R = "[object Uint8ClampedArray]", g = "[object Uint16Array]", E = "[object Uint32Array]", D = /[\\^$.*+?()[\]{}|]/g, F = /\w*$/, ht = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[A] = B[T] = B[a] = B[c] = B[G] = B[N] = B[P] = B[x] = B[v] = B[p] = B[h] = B[y] = B[I] = B[k] = B[M] = B[b] = B[U] = B[R] = B[g] = B[E] = !0, B[l] = B[f] = B[L] = !1;
  var Y = typeof Wt == "object" && Wt && Wt.Object === Object && Wt, ut = typeof self == "object" && self && self.Object === Object && self, ct = Y || ut || Function("return this")(), yt = e && !e.nodeType && e, zt = yt && !0 && t && !t.nodeType && t, Et = zt && zt.exports === yt;
  function ot(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function Dt(d, S) {
    return d.add(S), d;
  }
  function _t(d, S) {
    for (var C = -1, V = d ? d.length : 0; ++C < V && S(d[C], C, d) !== !1; )
      ;
    return d;
  }
  function On(d, S) {
    for (var C = -1, V = S.length, jt = d.length; ++C < V; )
      d[jt + C] = S[C];
    return d;
  }
  function Mr(d, S, C, V) {
    for (var jt = -1, Zt = d ? d.length : 0; ++jt < Zt; )
      C = S(C, d[jt], jt, d);
    return C;
  }
  function ue(d, S) {
    for (var C = -1, V = Array(d); ++C < d; )
      V[C] = S(C);
    return V;
  }
  function jn(d, S) {
    return d == null ? void 0 : d[S];
  }
  function Fn(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function Ge(d) {
    var S = -1, C = Array(d.size);
    return d.forEach(function(V, jt) {
      C[++S] = [jt, V];
    }), C;
  }
  function Le(d, S) {
    return function(C) {
      return d(S(C));
    };
  }
  function Ve(d) {
    var S = -1, C = Array(d.size);
    return d.forEach(function(V) {
      C[++S] = V;
    }), C;
  }
  var X = Array.prototype, Nt = Function.prototype, fe = Object.prototype, zn = ct["__core-js_shared__"], ri = function() {
    var d = /[^.]+$/.exec(zn && zn.keys && zn.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), $ = Nt.toString, j = fe.hasOwnProperty, K = fe.toString, z = RegExp(
    "^" + $.call(j).replace(D, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), wt = Et ? ct.Buffer : void 0, mt = ct.Symbol, Ct = ct.Uint8Array, Xt = Le(Object.getPrototypeOf, Object), sn = Object.create, he = fe.propertyIsEnumerable, _r = X.splice, Rn = Object.getOwnPropertySymbols, Gn = wt ? wt.isBuffer : void 0, Qp = Le(Object.keys, Object), qo = Hr(ct, "DataView"), ms = Hr(ct, "Map"), Wo = Hr(ct, "Promise"), Yo = Hr(ct, "Set"), Xo = Hr(ct, "WeakMap"), Ss = Hr(Object, "create"), Jp = qn(qo), tg = qn(ms), eg = qn(Wo), ng = qn(Yo), rg = qn(Xo), Rl = mt ? mt.prototype : void 0, Gl = Rl ? Rl.valueOf : void 0;
  function Vn(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var V = d[S];
      this.set(V[0], V[1]);
    }
  }
  function sg() {
    this.__data__ = Ss ? Ss(null) : {};
  }
  function ig(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function og(d) {
    var S = this.__data__;
    if (Ss) {
      var C = S[d];
      return C === r ? void 0 : C;
    }
    return j.call(S, d) ? S[d] : void 0;
  }
  function ag(d) {
    var S = this.__data__;
    return Ss ? S[d] !== void 0 : j.call(S, d);
  }
  function cg(d, S) {
    var C = this.__data__;
    return C[d] = Ss && S === void 0 ? r : S, this;
  }
  Vn.prototype.clear = sg, Vn.prototype.delete = ig, Vn.prototype.get = og, Vn.prototype.has = ag, Vn.prototype.set = cg;
  function Ke(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var V = d[S];
      this.set(V[0], V[1]);
    }
  }
  function lg() {
    this.__data__ = [];
  }
  function ug(d) {
    var S = this.__data__, C = si(S, d);
    if (C < 0)
      return !1;
    var V = S.length - 1;
    return C == V ? S.pop() : _r.call(S, C, 1), !0;
  }
  function fg(d) {
    var S = this.__data__, C = si(S, d);
    return C < 0 ? void 0 : S[C][1];
  }
  function hg(d) {
    return si(this.__data__, d) > -1;
  }
  function dg(d, S) {
    var C = this.__data__, V = si(C, d);
    return V < 0 ? C.push([d, S]) : C[V][1] = S, this;
  }
  Ke.prototype.clear = lg, Ke.prototype.delete = ug, Ke.prototype.get = fg, Ke.prototype.has = hg, Ke.prototype.set = dg;
  function Ur(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var V = d[S];
      this.set(V[0], V[1]);
    }
  }
  function pg() {
    this.__data__ = {
      hash: new Vn(),
      map: new (ms || Ke)(),
      string: new Vn()
    };
  }
  function gg(d) {
    return ii(this, d).delete(d);
  }
  function yg(d) {
    return ii(this, d).get(d);
  }
  function wg(d) {
    return ii(this, d).has(d);
  }
  function bg(d, S) {
    return ii(this, d).set(d, S), this;
  }
  Ur.prototype.clear = pg, Ur.prototype.delete = gg, Ur.prototype.get = yg, Ur.prototype.has = wg, Ur.prototype.set = bg;
  function Tr(d) {
    this.__data__ = new Ke(d);
  }
  function xg() {
    this.__data__ = new Ke();
  }
  function mg(d) {
    return this.__data__.delete(d);
  }
  function Sg(d) {
    return this.__data__.get(d);
  }
  function Eg(d) {
    return this.__data__.has(d);
  }
  function Ag(d, S) {
    var C = this.__data__;
    if (C instanceof Ke) {
      var V = C.__data__;
      if (!ms || V.length < n - 1)
        return V.push([d, S]), this;
      C = this.__data__ = new Ur(V);
    }
    return C.set(d, S), this;
  }
  Tr.prototype.clear = xg, Tr.prototype.delete = mg, Tr.prototype.get = Sg, Tr.prototype.has = Eg, Tr.prototype.set = Ag;
  function $g(d, S) {
    var C = Jo(d) || Wg(d) ? ue(d.length, String) : [], V = C.length, jt = !!V;
    for (var Zt in d)
      j.call(d, Zt) && !(jt && (Zt == "length" || Gg(Zt, V))) && C.push(Zt);
    return C;
  }
  function Vl(d, S, C) {
    var V = d[S];
    (!(j.call(d, S) && Yl(V, C)) || C === void 0 && !(S in d)) && (d[S] = C);
  }
  function si(d, S) {
    for (var C = d.length; C--; )
      if (Yl(d[C][0], S))
        return C;
    return -1;
  }
  function Ig(d, S) {
    return d && Kl(S, ta(S), d);
  }
  function Zo(d, S, C, V, jt, Zt, qe) {
    var Qt;
    if (V && (Qt = Zt ? V(d, jt, Zt, qe) : V(d)), Qt !== void 0)
      return Qt;
    if (!oi(d))
      return d;
    var Ql = Jo(d);
    if (Ql) {
      if (Qt = Fg(d), !S)
        return Dg(d, Qt);
    } else {
      var Nr = Kn(d), Jl = Nr == f || Nr == u;
      if (Xg(d))
        return Mg(d, S);
      if (Nr == y || Nr == i || Jl && !Zt) {
        if (Fn(d))
          return Zt ? d : {};
        if (Qt = zg(Jl ? {} : d), !S)
          return Og(d, Ig(Qt, d));
      } else {
        if (!B[Nr])
          return Zt ? d : {};
        Qt = Rg(d, Nr, Zo, S);
      }
    }
    qe || (qe = new Tr());
    var tu = qe.get(d);
    if (tu)
      return tu;
    if (qe.set(d, Qt), !Ql)
      var eu = C ? jg(d) : ta(d);
    return _t(eu || d, function(ea, ai) {
      eu && (ai = ea, ea = d[ai]), Vl(Qt, ai, Zo(ea, S, C, V, ai, d, qe));
    }), Qt;
  }
  function vg(d) {
    return oi(d) ? sn(d) : {};
  }
  function Lg(d, S, C) {
    var V = S(d);
    return Jo(d) ? V : On(V, C(d));
  }
  function Cg(d) {
    return K.call(d);
  }
  function Bg(d) {
    if (!oi(d) || Kg(d))
      return !1;
    var S = Zl(d) || Fn(d) ? z : ht;
    return S.test(qn(d));
  }
  function kg(d) {
    if (!Wl(d))
      return Qp(d);
    var S = [];
    for (var C in Object(d))
      j.call(d, C) && C != "constructor" && S.push(C);
    return S;
  }
  function Mg(d, S) {
    if (S)
      return d.slice();
    var C = new d.constructor(d.length);
    return d.copy(C), C;
  }
  function Qo(d) {
    var S = new d.constructor(d.byteLength);
    return new Ct(S).set(new Ct(d)), S;
  }
  function _g(d, S) {
    var C = S ? Qo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.byteLength);
  }
  function Ug(d, S, C) {
    var V = S ? C(Ge(d), !0) : Ge(d);
    return Mr(V, ot, new d.constructor());
  }
  function Tg(d) {
    var S = new d.constructor(d.source, F.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Hg(d, S, C) {
    var V = S ? C(Ve(d), !0) : Ve(d);
    return Mr(V, Dt, new d.constructor());
  }
  function Ng(d) {
    return Gl ? Object(Gl.call(d)) : {};
  }
  function Pg(d, S) {
    var C = S ? Qo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.length);
  }
  function Dg(d, S) {
    var C = -1, V = d.length;
    for (S || (S = Array(V)); ++C < V; )
      S[C] = d[C];
    return S;
  }
  function Kl(d, S, C, V) {
    C || (C = {});
    for (var jt = -1, Zt = S.length; ++jt < Zt; ) {
      var qe = S[jt], Qt = void 0;
      Vl(C, qe, Qt === void 0 ? d[qe] : Qt);
    }
    return C;
  }
  function Og(d, S) {
    return Kl(d, ql(d), S);
  }
  function jg(d) {
    return Lg(d, ta, ql);
  }
  function ii(d, S) {
    var C = d.__data__;
    return Vg(S) ? C[typeof S == "string" ? "string" : "hash"] : C.map;
  }
  function Hr(d, S) {
    var C = jn(d, S);
    return Bg(C) ? C : void 0;
  }
  var ql = Rn ? Le(Rn, Object) : Jg, Kn = Cg;
  (qo && Kn(new qo(new ArrayBuffer(1))) != T || ms && Kn(new ms()) != p || Wo && Kn(Wo.resolve()) != w || Yo && Kn(new Yo()) != k || Xo && Kn(new Xo()) != L) && (Kn = function(d) {
    var S = K.call(d), C = S == y ? d.constructor : void 0, V = C ? qn(C) : void 0;
    if (V)
      switch (V) {
        case Jp:
          return T;
        case tg:
          return p;
        case eg:
          return w;
        case ng:
          return k;
        case rg:
          return L;
      }
    return S;
  });
  function Fg(d) {
    var S = d.length, C = d.constructor(S);
    return S && typeof d[0] == "string" && j.call(d, "index") && (C.index = d.index, C.input = d.input), C;
  }
  function zg(d) {
    return typeof d.constructor == "function" && !Wl(d) ? vg(Xt(d)) : {};
  }
  function Rg(d, S, C, V) {
    var jt = d.constructor;
    switch (S) {
      case A:
        return Qo(d);
      case a:
      case c:
        return new jt(+d);
      case T:
        return _g(d, V);
      case G:
      case N:
      case P:
      case x:
      case v:
      case U:
      case R:
      case g:
      case E:
        return Pg(d, V);
      case p:
        return Ug(d, V, C);
      case h:
      case M:
        return new jt(d);
      case I:
        return Tg(d);
      case k:
        return Hg(d, V, C);
      case b:
        return Ng(d);
    }
  }
  function Gg(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Vg(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function Kg(d) {
    return !!ri && ri in d;
  }
  function Wl(d) {
    var S = d && d.constructor, C = typeof S == "function" && S.prototype || fe;
    return d === C;
  }
  function qn(d) {
    if (d != null) {
      try {
        return $.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function qg(d) {
    return Zo(d, !0, !0);
  }
  function Yl(d, S) {
    return d === S || d !== d && S !== S;
  }
  function Wg(d) {
    return Yg(d) && j.call(d, "callee") && (!he.call(d, "callee") || K.call(d) == i);
  }
  var Jo = Array.isArray;
  function Xl(d) {
    return d != null && Zg(d.length) && !Zl(d);
  }
  function Yg(d) {
    return Qg(d) && Xl(d);
  }
  var Xg = Gn || ty;
  function Zl(d) {
    var S = oi(d) ? K.call(d) : "";
    return S == f || S == u;
  }
  function Zg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function oi(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Qg(d) {
    return !!d && typeof d == "object";
  }
  function ta(d) {
    return Xl(d) ? $g(d) : kg(d);
  }
  function Jg() {
    return [];
  }
  function ty() {
    return !1;
  }
  t.exports = qg;
})(no, no.exports);
var nx = no.exports;
const Xd = /* @__PURE__ */ Ah(nx);
var ja;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ja || (ja = {}));
function rx(t, e) {
  return { type: ja.Address, version: t, hash160: e };
}
function sx(t) {
  return vr.c32address(t.version, t.hash160);
}
const ix = (t) => B2(zd(t)), ox = (t) => W(ix(t));
Mt.hmacSha256Sync = (t, ...e) => {
  const n = jd.create(zd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ax(t, e = "mainnet") {
  e = Nd(e), t = typeof t == "string" ? ft(t) : t;
  const n = S2(Ze.P2PKH, e), r = rx(n, ox(t));
  return sx(r);
}
function cx(t, e) {
  const n = Ft.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = ax(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ft.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function lx(t, e = null) {
  let n;
  e ? n = cx(t, e) : n = Ft.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Yu = "_blockstackDidCheckEchoReply", ux = "echoReply", fx = "authContinuation";
function hx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function dx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Yu];
  if (typeof e == "boolean")
    return e;
  const n = hx(t.location.search), r = n[ux];
  if (r) {
    t[Yu] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[fx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Fa {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Uh();
    else
      throw new ky("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ku(e.sessionOptions) : this.store = new ku() : e ? this.store = new Bu(e.sessionOptions) : this.store = new Bu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = _y().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new La("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Qb(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Zb();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = _c("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (dx())
        return zr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      zr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = e1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ci("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Ft.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await r2(e))
      throw new ci("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (ra(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Lu(s, i.private_key);
          } catch {
            if (zr.warn("Failed decryption of appPrivateKey, will try to use as given"), !Mt.isValidPrivateKey(i.private_key))
              throw new ci("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Lu(s, c);
          } catch {
            zr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ci("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = Gy, f;
    ra(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), ra(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ud(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, p = i.profile_url;
    if (!u.profile && p) {
      const h = await n(p);
      if (!h.ok)
        u.profile = Object.assign({}, Ly);
      else {
        const y = await h.text(), w = JSON.parse(y);
        u.profile = lx(w[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new La("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Gw(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vw(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Fa.prototype.makeAuthRequest = Fa.prototype.makeAuthRequestToken;
const px = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], gx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = px(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Mo(r.id));
  return e.concat(n);
}, Mo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Zd = "STX_PROVIDER", fr = () => typeof window > "u" ? null : window.localStorage.getItem(Zd), yx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Zd, t);
}, wx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function bx(t, e) {
  const n = {};
  return Object.assign(n, wx, e), await fetch(t, n);
}
function xx(t) {
  let e = bx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function mx(...t) {
  const { fetchLib: e, middlewares: n } = xx(t);
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
var ss;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ss || (ss = {}));
var hr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(hr || (hr = {}));
var Xu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Xu || (Xu = {}));
const Sx = "https://api.mainnet.hiro.so", Ex = "https://api.testnet.hiro.so", Ax = "http://localhost:3999", $x = ["mainnet", "testnet", "devnet", "mocknet"];
class dr {
  constructor(e) {
    this.version = hr.Mainnet, this.chainId = ss.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === hr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? mx();
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
dr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new za();
    case "testnet":
      return new Ra();
    case "devnet":
      return new Ix();
    case "mocknet":
      return new Qd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$x.join(", ")}`);
  }
};
dr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : dr.fromName(t);
class za extends dr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = hr.Mainnet, this.chainId = ss.Mainnet;
  }
}
class Ra extends dr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = hr.Testnet, this.chainId = ss.Testnet;
  }
}
class Qd extends dr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = hr.Testnet, this.chainId = ss.Testnet;
  }
}
const Ix = Qd;
var pr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(pr || (pr = {}));
var ro;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ro || (ro = {}));
pr.Mainnet;
var gr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gr || (gr = {}));
var yr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(yr || (yr = {}));
gr.Mainnet;
const vx = {
  chainId: pr.Mainnet,
  transactionVersion: gr.Mainnet,
  peerNetworkId: ro.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: yr.MainnetSingleSig,
    multiSig: yr.MainnetMultiSig
  },
  client: { baseUrl: kh }
}, Ga = {
  chainId: pr.Testnet,
  transactionVersion: gr.Testnet,
  peerNetworkId: ro.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: yr.TestnetSingleSig,
    multiSig: yr.TestnetMultiSig
  },
  client: { baseUrl: Mh }
}, ji = {
  ...Ga,
  addressVersion: { ...Ga.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _h }
}, Lx = {
  ...ji,
  addressVersion: { ...ji.addressVersion },
  client: { ...ji.client }
};
function Cx(t) {
  switch (t) {
    case "mainnet":
      return vx;
    case "testnet":
      return Ga;
    case "devnet":
      return ji;
    case "mocknet":
      return Lx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Bx(t) {
  return typeof t == "string" ? Cx(t) : t;
}
function kx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Zu = /* @__PURE__ */ new Map();
function Jd(t, e) {
  const n = Zu.get(t);
  if (n !== void 0)
    return n(e);
  const r = kx(t);
  return Zu.set(t, r), Jd(t, e);
}
let St = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? ft(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Zy(this.readBytes(4), 0);
  }
  readUInt8() {
    return Yy(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return qy(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = W(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = W(n);
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
    if (Jd(e, r))
      return r;
    throw n(r);
  }
};
const Mx = 128, _x = 128, t0 = 16, nr = 32, Va = 80, _o = 65, Ux = 32, Tx = 64, so = 34, Hx = 1 + 16 * 1024 * 1024, Nx = 165, Px = 16, Dx = 16, Ox = 20, jx = Dx + 2 + Ox, Fx = jx + 4, zx = Hx + (Nx + Px * Fx);
var pt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var Ka;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ka || (Ka = {}));
var re;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(re || (re = {}));
const ua = ["onChainOnly", "offChainOnly", "any"];
ua[0] + "", re.OnChainOnly, ua[1] + "", re.OffChainOnly, ua[2] + "", re.Any, re.OnChainOnly + "", re.OnChainOnly, re.OffChainOnly + "", re.OffChainOnly, re.Any + "", re.Any;
var io;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(io || (io = {}));
var At;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(At || (At = {}));
var Bt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Bt || (Bt = {}));
var bt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(bt || (bt = {}));
var vt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vt || (vt = {}));
var Ms;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ms || (Ms = {}));
var qa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(qa || (qa = {}));
var Wa;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Wa || (Wa = {}));
var qt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qt || (qt = {}));
var Qu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qu || (Qu = {}));
var Ya;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ya || (Ya = {}));
var Ee;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ee || (Ee = {}));
var Ju;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ju || (Ju = {}));
let Uo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Rr = class extends Uo {
  constructor(e) {
    super(e);
  }
}, Vt = class extends Uo {
  constructor(e) {
    super(e);
  }
}, oo = class extends Uo {
  constructor(e) {
    super(e);
  }
}, Qn = class extends Uo {
  constructor(e) {
    super(e);
  }
};
function Xa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Rx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function e0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xa(t.outputLen), Xa(t.blockLen);
}
function Vx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Kx(t, e) {
  e0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Jn = {
  number: Xa,
  bool: Rx,
  bytes: e0,
  hash: Gx,
  exists: Vx,
  output: Kx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ke = (t, e) => t << 32 - e | t >>> e, qx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Jc(t) {
  if (typeof t == "string" && (t = Wx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let n0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Lr(t) {
  const e = (r) => t().update(Jc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let r0 = class extends n0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Jn.hash(e);
    const r = Jc(n);
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
    return Jn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Jn.exists(this), Jn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const s0 = (t, e, n) => new r0(t, e).update(n).digest();
s0.create = (t, e) => new r0(t, e);
function Yx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let tl = class extends n0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fa(this.buffer);
  }
  update(e) {
    Jn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Jc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = fa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Jn.exists(this), Jn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Yx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = fa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const Xx = (t, e, n) => t & e ^ ~t & n, Zx = (t, e, n) => t & e ^ t & n ^ e & n, Qx = new Uint32Array([
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
]), wn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), bn = new Uint32Array(64);
let i0 = class extends tl {
  constructor() {
    super(64, 32, 8, !1), this.A = wn[0] | 0, this.B = wn[1] | 0, this.C = wn[2] | 0, this.D = wn[3] | 0, this.E = wn[4] | 0, this.F = wn[5] | 0, this.G = wn[6] | 0, this.H = wn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      bn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = bn[u - 15], h = bn[u - 2], y = ke(p, 7) ^ ke(p, 18) ^ p >>> 3, w = ke(h, 17) ^ ke(h, 19) ^ h >>> 10;
      bn[u] = w + bn[u - 7] + y + bn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ke(a, 6) ^ ke(a, 11) ^ ke(a, 25), h = f + p + Xx(a, c, l) + Qx[u] + bn[u] | 0, w = (ke(r, 2) ^ ke(r, 13) ^ ke(r, 22)) + Zx(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    bn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Jx = class extends i0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const el = Lr(() => new i0());
Lr(() => new Jx());
const tm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), o0 = Uint8Array.from({ length: 16 }, (t, e) => e), em = o0.map((t) => (9 * t + 5) % 16);
let nl = [o0], rl = [em];
for (let t = 0; t < 4; t++)
  for (let e of [nl, rl])
    e.push(e[t].map((n) => tm[n]));
const a0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), nm = nl.map((t, e) => t.map((n) => a0[e][n])), rm = rl.map((t, e) => t.map((n) => a0[e][n])), sm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), im = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Si = (t, e) => t << e | t >>> 32 - e;
function tf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ei = new Uint32Array(16);
let om = class extends tl {
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
    for (let h = 0; h < 16; h++, n += 4)
      Ei[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = sm[h], I = im[h], k = nl[h], M = rl[h], b = nm[h], L = rm[h];
      for (let A = 0; A < 16; A++) {
        const T = Si(r + tf(h, i, a, l) + Ei[k[A]] + w, b[A]) + u | 0;
        r = u, u = l, l = Si(a, 10) | 0, a = i, i = T;
      }
      for (let A = 0; A < 16; A++) {
        const T = Si(s + tf(y, o, c, f) + Ei[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = Si(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ei.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const am = Lr(() => new om()), Ai = BigInt(2 ** 32 - 1), Za = BigInt(32);
function c0(t, e = !1) {
  return e ? { h: Number(t & Ai), l: Number(t >> Za & Ai) } : { h: Number(t >> Za & Ai) | 0, l: Number(t & Ai) | 0 };
}
function cm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = c0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const lm = (t, e) => BigInt(t >>> 0) << Za | BigInt(e >>> 0), um = (t, e, n) => t >>> n, fm = (t, e, n) => t << 32 - n | e >>> n, hm = (t, e, n) => t >>> n | e << 32 - n, dm = (t, e, n) => t << 32 - n | e >>> n, pm = (t, e, n) => t << 64 - n | e >>> n - 32, gm = (t, e, n) => t >>> n - 32 | e << 64 - n, ym = (t, e) => e, wm = (t, e) => t, bm = (t, e, n) => t << n | e >>> 32 - n, xm = (t, e, n) => e << n | t >>> 32 - n, mm = (t, e, n) => e << n - 32 | t >>> 64 - n, Sm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Em(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Am = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), $m = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Im = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Lm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, tt = {
  fromBig: c0,
  split: cm,
  toBig: lm,
  shrSH: um,
  shrSL: fm,
  rotrSH: hm,
  rotrSL: dm,
  rotrBH: pm,
  rotrBL: gm,
  rotr32H: ym,
  rotr32L: wm,
  rotlSH: bm,
  rotlSL: xm,
  rotlBH: mm,
  rotlBL: Sm,
  add: Em,
  add3L: Am,
  add3H: $m,
  add4L: Im,
  add4H: vm,
  add5H: Cm,
  add5L: Lm
}, [Bm, km] = tt.split([
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
].map((t) => BigInt(t))), xn = new Uint32Array(80), mn = new Uint32Array(80);
let To = class extends tl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      xn[b] = e.getUint32(n), mn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = xn[b - 15] | 0, A = mn[b - 15] | 0, T = tt.rotrSH(L, A, 1) ^ tt.rotrSH(L, A, 8) ^ tt.shrSH(L, A, 7), G = tt.rotrSL(L, A, 1) ^ tt.rotrSL(L, A, 8) ^ tt.shrSL(L, A, 7), N = xn[b - 2] | 0, P = mn[b - 2] | 0, x = tt.rotrSH(N, P, 19) ^ tt.rotrBH(N, P, 61) ^ tt.shrSH(N, P, 6), v = tt.rotrSL(N, P, 19) ^ tt.rotrBL(N, P, 61) ^ tt.shrSL(N, P, 6), U = tt.add4L(G, v, mn[b - 7], mn[b - 16]), R = tt.add4H(U, T, x, xn[b - 7], xn[b - 16]);
      xn[b] = R | 0, mn[b] = U | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = tt.rotrSH(u, p, 14) ^ tt.rotrSH(u, p, 18) ^ tt.rotrBH(u, p, 41), A = tt.rotrSL(u, p, 14) ^ tt.rotrSL(u, p, 18) ^ tt.rotrBL(u, p, 41), T = u & h ^ ~u & w, G = p & y ^ ~p & I, N = tt.add5L(M, A, G, km[b], mn[b]), P = tt.add5H(N, k, L, T, Bm[b], xn[b]), x = N | 0, v = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), U = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, g = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = p | 0, { h: u, l: p } = tt.add(l | 0, f | 0, P | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const E = tt.add3L(x, U, g);
      r = tt.add3H(E, P, v, R), s = E | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = tt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = tt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: y } = tt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = tt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = tt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, y, w, I, k, M);
  }
  roundClean() {
    xn.fill(0), mn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Mm = class extends To {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _m = class extends To {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Um = class extends To {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Lr(() => new To());
Lr(() => new Mm());
const Tm = Lr(() => new _m());
Lr(() => new Um());
var at;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(at || (at = {}));
var Pt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Pt || (Pt = {}));
function sl(t) {
  return Pt[t];
}
const Hm = () => ({ type: at.BoolTrue }), Nm = () => ({ type: at.BoolFalse }), Pm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: at.Buffer, value: W(t) };
}, ef = BigInt("0xffffffffffffffffffffffffffffffff"), Dm = BigInt(0), nf = BigInt("0x7fffffffffffffffffffffffffffffff"), rf = BigInt("-170141183460469231731687303715884105728"), Om = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ba(ft(t))), ee(t, Uint8Array) && (t = Ba(t));
  const e = Gt(t);
  if (e > nf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${nf}`);
  if (e < rf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${rf}`);
  return { type: at.Int, value: e };
}, jm = (t) => {
  const e = Gt(t);
  if (e < Dm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ef)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ef}`);
  return { type: at.UInt, value: e };
};
function Fm(t) {
  return { type: at.List, value: t };
}
function l0() {
  return { type: at.OptionalNone };
}
function u0(t) {
  return { type: at.OptionalSome, value: t };
}
var O;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(O || (O = {}));
function zm() {
  return {
    type: O.Address,
    version: yr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function sf(t) {
  if (t && x0(t, so))
    throw new Error(`Memo exceeds maximum length of ${so} bytes`);
  return { type: O.MemoString, content: t };
}
function il(t, e) {
  return {
    type: O.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Qa(t) {
  if (ft(t).byteLength != _o)
    throw Error("Invalid signature");
  return {
    type: O.MessageSignature,
    data: t
  };
}
function Rm(t, e, n) {
  return typeof t == "string" && (t = iS(t)), typeof n == "string" && (n = sf(n)), {
    type: O.Payload,
    payloadType: pt.TokenTransfer,
    recipient: t,
    amount: Gt(e),
    memo: n ?? sf("")
  };
}
function Gm(t, e, n, r) {
  return typeof e == "string" && (e = Ie(e)), typeof n == "string" && (n = Ie(n)), {
    type: O.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof t == "string" ? Dn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Vm(t) {
  return Ie(t, 4, 1e5);
}
function of(t, e, n) {
  return typeof t == "string" && (t = Ie(t)), typeof e == "string" && (e = Vm(e)), typeof n == "number" ? {
    type: O.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: O.Payload,
    payloadType: pt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Km() {
  return { type: O.Payload, payloadType: pt.PoisonMicroblock };
}
function af(t, e) {
  if (t.byteLength != nr)
    throw Error(`Coinbase buffer size must be ${nr} bytes`);
  return e != null ? {
    type: O.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: O.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: t
  };
}
function qm(t, e, n) {
  if (t.byteLength != nr)
    throw Error(`Coinbase buffer size must be ${nr} bytes`);
  if (n.byteLength != Va)
    throw Error(`VRF proof buffer size must be ${Va} bytes`);
  return {
    type: O.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === at.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Wm(t, e, n, r, s, i, o) {
  return {
    type: O.Payload,
    payloadType: pt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ie(t, e, n) {
  const r = e || 1, s = n || Mx;
  if (x0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: O.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ym(t, e, n) {
  return {
    type: O.Asset,
    address: Dn(t),
    contractName: Ie(e),
    assetName: Ie(n)
  };
}
function Dn(t) {
  const e = vr.c32addressDecode(t);
  return {
    type: O.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Xm(t, e) {
  const n = Dn(t), r = Ie(e);
  return {
    type: O.Principal,
    prefix: qt.Contract,
    address: n,
    contractName: r
  };
}
function Zm(t) {
  const e = Dn(t);
  return {
    type: O.Principal,
    prefix: qt.Standard,
    address: e
  };
}
function Gr(t, e) {
  return {
    pubKeyEncoding: t,
    type: O.TransactionAuthField,
    contents: e
  };
}
function Ye(t) {
  switch (t.type) {
    case O.Address:
      return ti(t);
    case O.Principal:
      return f0(t);
    case O.LengthPrefixedString:
      return os(t);
    case O.MemoString:
      return Jm(t);
    case O.Asset:
      return d0(t);
    case O.PostCondition:
      return g0(t);
    case O.PublicKey:
      return ec(t);
    case O.LengthPrefixedList:
      return ol(t);
    case O.Payload:
      return y0(t);
    case O.TransactionAuthField:
      return sS(t);
    case O.MessageSignature:
      return al(t);
  }
}
function ti(t) {
  const e = [];
  return e.push(ft(Ws(t.version, 1))), e.push(ft(t.hash160)), Tt(e);
}
function is(t) {
  const e = ee(t, St) ? t : new St(t), n = xo(W(e.readBytes(1))), r = W(e.readBytes(20));
  return { type: O.Address, version: n, hash160: r };
}
function f0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === qt.Standard || t.prefix === qt.Contract) && e.push(ti(t.address)), t.prefix === qt.Contract && e.push(os(t.contractName)), Tt(e);
}
function Qm(t) {
  const e = ee(t, St) ? t : new St(t), n = e.readUInt8Enum(qt, (i) => {
    throw new Vt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === qt.Origin)
    return { type: O.Principal, prefix: n };
  const r = is(e);
  if (n === qt.Standard)
    return { type: O.Principal, prefix: n, address: r };
  const s = ye(e);
  return {
    type: O.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function os(t) {
  const e = [], n = Er(t.content), r = n.byteLength;
  return e.push(ft(Ws(r, t.lengthPrefixBytes))), e.push(n), Tt(e);
}
function ye(t, e, n) {
  e = e || 1;
  const r = ee(t, St) ? t : new St(t), s = xo(W(r.readBytes(e))), i = Ys(r.readBytes(s));
  return Ie(i, e, n ?? 128);
}
function Jm(t) {
  const e = [], n = Er(t.content), r = LS(W(n), so * 2);
  return e.push(ft(r)), Tt(e);
}
function h0(t) {
  const e = ee(t, St) ? t : new St(t);
  let n = Ys(e.readBytes(so));
  return n = n.replace(/\u0000*$/, ""), { type: O.MemoString, content: n };
}
function d0(t) {
  const e = [];
  return e.push(ti(t.address)), e.push(os(t.contractName)), e.push(os(t.assetName)), Tt(e);
}
function Ja(t) {
  const e = ee(t, St) ? t : new St(t);
  return {
    type: O.Asset,
    address: is(e),
    contractName: ye(e),
    assetName: ye(e)
  };
}
function ol(t) {
  const e = t.values, n = [];
  n.push(ft(Ws(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ye(r));
  return Tt(n);
}
function p0(t, e, n) {
  const r = ee(t, St) ? t : new St(t), s = xo(W(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case O.Address:
        i.push(is(r));
        break;
      case O.LengthPrefixedString:
        i.push(ye(r));
        break;
      case O.MemoString:
        i.push(h0(r));
        break;
      case O.Asset:
        i.push(Ja(r));
        break;
      case O.PostCondition:
        i.push(eS(r));
        break;
      case O.PublicKey:
        i.push(nc(r));
        break;
      case O.TransactionAuthField:
        i.push(rS(r));
        break;
    }
  return il(i, n);
}
function tS(t) {
  return W(g0(t));
}
function g0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(f0(t.principal)), (t.conditionType === At.Fungible || t.conditionType === At.NonFungible) && e.push(d0(t.asset)), t.conditionType === At.NonFungible && e.push(Pe(t.assetName)), e.push(t.conditionCode), t.conditionType === At.STX || t.conditionType === At.Fungible || t.conditionType === At.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Rr("The post-condition amount may not be larger than 8 bytes");
    e.push(Nn(t.amount, 8));
  }
  return Tt(e);
}
function eS(t) {
  const e = ee(t, St) ? t : new St(t), n = e.readUInt8Enum(At, (a) => {
    throw new Vt(`Could not read ${a} as PostConditionType`);
  }), r = Qm(e);
  let s, i, o;
  switch (n) {
    case At.STX:
      return s = e.readUInt8Enum(Ms, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: At.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case At.Fungible:
      return i = Ja(e), s = e.readUInt8Enum(Ms, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: At.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case At.NonFungible:
      i = Ja(e);
      const a = He(e);
      return s = e.readUInt8Enum(qa, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: O.PostCondition,
        conditionType: At.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case At.Staking:
      return s = e.readUInt8Enum(Ms, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: At.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case At.PoX: {
      const c = e.readUInt8Enum(Wa, (l) => {
        throw new Vt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: O.PostCondition,
        conditionType: At.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function y0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case pt.TokenTransfer:
      e.push(Pe(t.recipient)), e.push(Nn(t.amount, 8)), e.push(Ye(t.memo));
      break;
    case pt.ContractCall:
      e.push(Ye(t.contractAddress)), e.push(Ye(t.contractName)), e.push(Ye(t.functionName));
      const n = new Uint8Array(4);
      or(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pe(r));
      });
      break;
    case pt.SmartContract:
      e.push(Ye(t.contractName)), e.push(Ye(t.codeBody));
      break;
    case pt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ye(t.contractName)), e.push(Ye(t.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient));
      break;
    case pt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient ? u0(t.recipient) : l0())), e.push(t.vrfProof);
      break;
    case pt.TenureChange:
      e.push(ft(t.tenureHash)), e.push(ft(t.previousTenureHash)), e.push(ft(t.burnViewHash)), e.push(ft(t.previousTenureEnd)), e.push(or(new Uint8Array(4), t.previousTenureBlocks)), e.push(Xy(new Uint8Array(1), t.cause)), e.push(ft(t.publicKeyHash));
      break;
  }
  return Tt(e);
}
function nS(t) {
  const e = ee(t, St) ? t : new St(t);
  switch (e.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = He(e), s = Gt(e.readBytes(8)), i = h0(e);
      return Rm(r, s, i);
    case pt.ContractCall:
      const o = is(e), a = ye(e), c = ye(e), l = [], f = e.readUInt32BE();
      for (let L = 0; L < f; L++) {
        const A = He(e);
        l.push(A);
      }
      return Gm(o, a, c, l);
    case pt.SmartContract:
      const u = ye(e), p = ye(e, 4, 1e5);
      return of(u, p);
    case pt.VersionedSmartContract: {
      const L = e.readUInt8Enum(Ka, (G) => {
        throw new Error(`Cannot recognize ClarityVersion: ${G}`);
      }), A = ye(e), T = ye(e, 4, zx);
      return of(A, T, L);
    }
    case pt.PoisonMicroblock:
      return Km();
    case pt.Coinbase: {
      const L = e.readBytes(nr);
      return af(L);
    }
    case pt.CoinbaseToAltRecipient: {
      const L = e.readBytes(nr), A = He(e);
      return af(L, A);
    }
    case pt.NakamotoCoinbase: {
      const L = e.readBytes(nr), A = He(e), T = e.readBytes(Va);
      return qm(L, A, T);
    }
    case pt.TenureChange:
      const h = W(e.readBytes(20)), y = W(e.readBytes(20)), w = W(e.readBytes(20)), I = W(e.readBytes(32)), k = e.readUInt32BE(), M = e.readUInt8Enum(Ya, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), b = W(e.readBytes(20));
      return Wm(h, y, w, I, k, M, b);
  }
}
function tc(t) {
  const e = ee(t, St) ? t : new St(t);
  return Qa(W(e.readBytes(_o)));
}
function rS(t) {
  const e = ee(t, St) ? t : new St(t), n = e.readUInt8Enum(Ee, (r) => {
    throw new Vt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ee.PublicKeyCompressed:
      return Gr(vt.Compressed, nc(e));
    case Ee.PublicKeyUncompressed:
      return Gr(vt.Uncompressed, gs(DS(nc(e).data)));
    case Ee.SignatureCompressed:
      return Gr(vt.Compressed, tc(e));
    case Ee.SignatureUncompressed:
      return Gr(vt.Uncompressed, tc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function al(t) {
  return ft(t.data);
}
function sS(t) {
  const e = [];
  switch (t.contents.type) {
    case O.PublicKey:
      e.push(t.pubKeyEncoding === vt.Compressed ? Ee.PublicKeyCompressed : Ee.PublicKeyUncompressed), e.push(ft(PS(t.contents.data)));
      break;
    case O.MessageSignature:
      e.push(t.pubKeyEncoding === vt.Compressed ? Ee.SignatureCompressed : Ee.SignatureUncompressed), e.push(al(t.contents));
      break;
  }
  return Tt(e);
}
function ec(t) {
  return t.data.slice();
}
function nc(t) {
  const e = ee(t, St) ? t : new St(t), n = e.readUInt8(), r = n === 4 ? Tx : Ux;
  return gs(Tt([n, e.readBytes(r)]));
}
function cl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === bt.P2PKH || e === bt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === bt.P2WPKH || e === bt.P2WSH || e === bt.P2WSHNonSequential) && !r.map((s) => s.data).every(ys))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case bt.P2PKH:
      return $i(t, CS(r[0].data));
    case bt.P2WPKH:
      return $i(t, BS(r[0].data));
    case bt.P2SH:
    case bt.P2SHNonSequential:
      return $i(t, kS(n, r.map(ec)));
    case bt.P2WSH:
    case bt.P2WSHNonSequential:
      return $i(t, MS(n, r.map(ec)));
  }
}
function $i(t, e) {
  return { type: O.Address, version: t, hash160: e };
}
function ll(t) {
  return vr.c32address(t.version, t.hash160);
}
function cf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return Ym(e, n, r);
}
function Is(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Xm(e, n);
  } else
    return Zm(t);
}
function iS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return cS(e, n);
  } else
    return oS(t);
}
function oS(t) {
  const e = Dn(t);
  return { type: at.PrincipalStandard, value: ll(e) };
}
function aS(t) {
  return { type: at.PrincipalStandard, value: ll(t) };
}
function cS(t, e) {
  const n = Dn(t), r = Ie(e);
  return w0(n, r);
}
function w0(t, e) {
  if (Er(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: at.PrincipalContract,
    value: `${ll(t)}.${e.content}`
  };
}
function lS(t) {
  return { type: at.ResponseErr, value: t };
}
function uS(t) {
  return { type: at.ResponseOk, value: t };
}
const fS = (t) => ({ type: at.StringASCII, value: t }), hS = (t) => ({ type: at.StringUTF8, value: t });
function dS(t) {
  for (const e in t)
    if (!_S(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: at.Tuple, value: t };
}
function He(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new St(ft(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new St(t) : e = t;
  switch (e.readUInt8Enum(Pt, (r) => {
    throw new Vt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Pt.int:
      return Om(Ba(e.readBytes(16)));
    case Pt.uint:
      return jm(e.readBytes(16));
    case Pt.buffer:
      const r = e.readUInt32BE();
      return Pm(e.readBytes(r));
    case Pt.true:
      return Hm();
    case Pt.false:
      return Nm();
    case Pt.address:
      const s = is(e);
      return aS(s);
    case Pt.contract:
      const i = is(e), o = ye(e);
      return w0(i, o);
    case Pt.ok:
      return uS(He(e));
    case Pt.err:
      return lS(He(e));
    case Pt.none:
      return l0();
    case Pt.some:
      return u0(He(e));
    case Pt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(He(e));
      return Fm(c);
    case Pt.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let w = 0; w < l; w++) {
        const I = ye(e).content;
        if (I === void 0)
          throw new Vt('"content" is undefined');
        f[I] = He(e);
      }
      return dS(f);
    case Pt.ascii:
      const u = e.readUInt32BE(), p = zy(e.readBytes(u));
      return fS(p);
    case Pt.utf8:
      const h = e.readUInt32BE(), y = Ys(e.readBytes(h));
      return hS(y);
    default:
      throw new Vt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Fe(t, e) {
  return Tt([sl(t), e]);
}
function pS(t) {
  return new Uint8Array([sl(t.type)]);
}
function gS(t) {
  return t.type === at.OptionalNone ? new Uint8Array([sl(t.type)]) : Fe(t.type, Pe(t.value));
}
function yS(t) {
  const e = new Uint8Array(4);
  return or(e, Math.ceil(t.value.length / 2), 0), Fe(t.type, Oe(e, ft(t.value)));
}
function wS(t) {
  const e = Uc(Py(BigInt(t.value), BigInt(_x)), t0);
  return Fe(t.type, e);
}
function bS(t) {
  const e = Uc(BigInt(t.value), t0);
  return Fe(t.type, e);
}
function xS(t) {
  return Fe(t.type, ti(Dn(t.value)));
}
function mS(t) {
  const [e, n] = US(t.value);
  return Fe(t.type, Oe(ti(Dn(e)), os(Ie(n))));
}
function SS(t) {
  return Fe(t.type, Pe(t.value));
}
function ES(t) {
  const e = [], n = new Uint8Array(4);
  or(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Pe(r);
    e.push(s);
  }
  return Fe(t.type, Tt(e));
}
function AS(t) {
  const e = [], n = new Uint8Array(4);
  or(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ie(s);
    e.push(os(i));
    const o = Pe(t.value[s]);
    e.push(o);
  }
  return Fe(t.type, Tt(e));
}
function b0(t, e) {
  const n = [], r = e == "ascii" ? Fy(t.value) : Er(t.value), s = new Uint8Array(4);
  return or(s, r.length, 0), n.push(s), n.push(r), Fe(t.type, Tt(n));
}
function $S(t) {
  return b0(t, "ascii");
}
function IS(t) {
  return b0(t, "utf8");
}
function lf(t) {
  return W(Pe(t));
}
function Pe(t) {
  switch (t.type) {
    case at.BoolTrue:
    case at.BoolFalse:
      return pS(t);
    case at.OptionalNone:
    case at.OptionalSome:
      return gS(t);
    case at.Buffer:
      return yS(t);
    case at.UInt:
      return bS(t);
    case at.Int:
      return wS(t);
    case at.PrincipalStandard:
      return xS(t);
    case at.PrincipalContract:
      return mS(t);
    case at.ResponseOk:
    case at.ResponseErr:
      return SS(t);
    case at.List:
      return ES(t);
    case at.Tuple:
      return AS(t);
    case at.StringASCII:
      return $S(t);
    case at.StringUTF8:
      return IS(t);
    default:
      throw new Rr("Unable to serialize. Invalid Clarity Value.");
  }
}
const vS = (t) => t.length % 2 ? `0${t}` : t, LS = (t, e) => t.padEnd(e, "0"), x0 = (t, e) => t ? Er(t).length > e : !1;
function rc(t) {
  return Xd(t);
}
const Ds = (t) => am(el(t)), ul = (t) => W(Tm(t)), CS = (t) => W(Ds(t)), BS = (t) => {
  const e = Ds(t), n = Oe(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ds(n);
  return W(r);
}, kS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = Ds(r);
  return W(s);
}, MS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = el(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Tt(i), a = Ds(o);
  return W(a);
};
function _S(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function US(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Mt.hmacSha256Sync = (t, ...e) => {
  const n = s0.create(el, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function gs(t) {
  return t = typeof t == "string" ? ft(t) : t, {
    type: O.PublicKey,
    data: t
  };
}
function TS(t, e, n = vt.Compressed) {
  const r = Ky(e), s = new ae(cu(r.r), cu(r.s)), i = st.fromSignature(t, s, r.recoveryId), o = n === vt.Compressed;
  return i.toHex(o);
}
function HS(t) {
  return typeof t == "string" ? t : W(t);
}
const fl = HS;
function m0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Vy;
}
function ys(t) {
  return !fl(t).startsWith("04");
}
function NS(t) {
  t = Tc(t);
  const e = m0(t);
  return W(Xs(t.slice(0, 32), e));
}
function PS(t) {
  return st.fromHex(fl(t)).toHex(!0);
}
function DS(t) {
  return st.fromHex(fl(t)).toHex(!1);
}
function OS(t, e) {
  t = Tc(t);
  const [n, r] = So(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ws(r, 1) + ae.fromHex(n).toCompactHex();
}
function hl() {
  return {
    type: O.MessageSignature,
    data: W(new Uint8Array(_o))
  };
}
function S0(t, e, n, r) {
  const s = cl(0, t, 1, [gs(e)]).hash160, i = ys(e) ? vt.Compressed : vt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Gt(n),
    fee: Gt(r),
    keyEncoding: i,
    signature: hl()
  };
}
function Os(t) {
  return "signature" in t;
}
function uf(t) {
  return t === bt.P2SH || t === bt.P2WSH;
}
function jS(t) {
  return t === bt.P2SHNonSequential || t === bt.P2WSHNonSequential;
}
function ff(t) {
  const e = rc(t);
  return e.nonce = 0, e.fee = 0, Os(e) ? e.signature = hl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function FS(t) {
  const e = [
    t.hashMode,
    ft(t.signer),
    Nn(t.nonce, 8),
    Nn(t.fee, 8),
    t.keyEncoding,
    al(t.signature)
  ];
  return Tt(e);
}
function zS(t) {
  const e = [
    t.hashMode,
    ft(t.signer),
    Nn(t.nonce, 8),
    Nn(t.fee, 8)
  ], n = il(t.fields);
  e.push(ol(n));
  const r = new Uint8Array(2);
  return Wy(r, t.signaturesRequired, 0), e.push(r), Tt(e);
}
function RS(t, e) {
  const n = W(e.readBytes(20)), r = BigInt(`0x${W(e.readBytes(8))}`), s = BigInt(`0x${W(e.readBytes(8))}`), i = e.readUInt8Enum(vt, (a) => {
    throw new Vt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === bt.P2WPKH && i != vt.Compressed)
    throw new Vt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = tc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function GS(t, e) {
  const n = W(e.readBytes(20)), r = BigInt("0x" + W(e.readBytes(8))), s = BigInt("0x" + W(e.readBytes(8))), i = p0(e, O.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case O.PublicKey:
        ys(l.contents.data) || (o = !0);
        break;
      case O.MessageSignature:
        if (l.pubKeyEncoding === vt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Qn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === bt.P2WSH || t === bt.P2WSHNonSequential))
    throw new Qn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ha(t) {
  return Os(t) ? FS(t) : zS(t);
}
function da(t) {
  const e = t.readUInt8Enum(bt, (n) => {
    throw new Vt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === bt.P2PKH || e === bt.P2WPKH ? RS(e, t) : GS(e, t);
}
function E0(t, e, n, r) {
  const i = t + W(new Uint8Array([e])) + W(Nn(n, 8)) + W(Nn(r, 8));
  if (ft(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ul(ft(i));
}
function A0(t, e, n) {
  const r = 33 + _o, s = ys(e.data) ? vt.Compressed : vt.Uncompressed, i = t + vS(s.toString(16)) + n, o = ft(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ul(o);
}
function VS(t, e, n, r, s) {
  const i = E0(t, e, n, r), o = OS(s, i), a = gs(NS(s)), c = A0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function $0(t, e, n, r, s, i) {
  const o = E0(t, e, n, r), a = gs(TS(o, i, s)), c = A0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function KS() {
  const t = S0(bt.P2PKH, "", 0, 0);
  return t.signer = zm().hash160, t.keyEncoding = vt.Compressed, t.signature = hl(), t;
}
function hf(t, e, n) {
  return Os(t) ? qS(t, e, n) : WS(t, e, n);
}
function qS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = $0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = cl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Qn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function WS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case O.PublicKey:
        ys(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case O.MessageSignature:
        c.pubKeyEncoding === vt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = $0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (uf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Qn("Too many signatures");
        break;
    }
  if (uf(t.hashMode) && o !== t.signaturesRequired || jS(t.hashMode) && o < t.signaturesRequired)
    throw new Qn("Incorrect number of signatures");
  if (i && (t.hashMode === bt.P2WSH || t.hashMode === bt.P2WSHNonSequential))
    throw new Qn("Uncompressed keys are not allowed in this hash mode");
  const a = cl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Qn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function I0(t) {
  return {
    authType: Bt.Standard,
    spendingCondition: t
  };
}
function v0(t, e) {
  return {
    authType: Bt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || S0(bt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function df(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Bt.Standard:
        return I0(ff(t.spendingCondition));
      case Bt.Sponsored:
        return v0(ff(t.spendingCondition), KS());
      default:
        throw new oo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function YS(t, e) {
  switch (t.authType) {
    case Bt.Standard:
      return hf(t.spendingCondition, e, Bt.Standard);
    case Bt.Sponsored:
      return hf(t.spendingCondition, e, Bt.Standard);
    default:
      throw new oo("Invalid origin auth type");
  }
}
function XS(t, e) {
  switch (t.authType) {
    case Bt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Gt(e)
      };
      return { ...t, spendingCondition: n };
    case Bt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Gt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function ZS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Gt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function QS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Gt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function JS(t, e) {
  const n = {
    ...e,
    nonce: Gt(e.nonce),
    fee: Gt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function t3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Bt.Standard:
      e.push(ha(t.spendingCondition));
      break;
    case Bt.Sponsored:
      e.push(ha(t.spendingCondition)), e.push(ha(t.sponsorSpendingCondition));
      break;
  }
  return Tt(e);
}
function e3(t) {
  const e = t.readUInt8Enum(Bt, (r) => {
    throw new Vt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Bt.Standard:
      return n = da(t), I0(n);
    case Bt.Sponsored:
      n = da(t);
      const r = da(t);
      return v0(n, r);
  }
}
class n3 {
  constructor({ auth: e, payload: n, postConditions: r = il([]), postConditionMode: s = io.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Bx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Gt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = re.Any;
  }
  signBegin() {
    const e = rc(this);
    return e.auth = df(e.auth), e.txid();
  }
  verifyBegin() {
    const e = rc(this);
    return e.auth = df(e.auth), e.txid();
  }
  verifyOrigin() {
    return YS(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Bt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Bt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Bt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : gs(e), r = this.auth.spendingCondition;
    if (r && !Os(r)) {
      const s = ys(n.data);
      r.fields.push(Gr(s ? vt.Compressed : vt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = VS(n, r, e.fee, e.nonce, s);
    if (Os(e))
      e.signature = Qa(i);
    else {
      const a = m0(s);
      e.fields.push(Gr(a ? vt.Compressed : vt.Uncompressed, Qa(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ul(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Bt.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = JS(this.auth, e);
  }
  setFee(e) {
    this.auth = XS(this.auth, e);
  }
  setNonce(e) {
    this.auth = ZS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Bt.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = QS(this.auth, e);
  }
  serialize() {
    return W(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Rr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Rr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Rr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Rr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return or(n, this.chainId, 0), e.push(n), e.push(t3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(ol(this.postConditions)), e.push(y0(this.payload)), Tt(e);
  }
}
function r3(t) {
  const e = ee(t, St) ? t : new St(t), n = e.readUInt8Enum(gr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = e3(e), i = e.readUInt8Enum(re, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(io, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = p0(e, O.PostCondition), c = nS(e), l = new n3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const pf = BigInt("18446744073709551615");
function pa(t) {
  const e = Gt(t);
  if (e < 0n || e > pf)
    throw new RangeError(`Post-condition amount must be between 0 and ${pf} (u64 max), received: ${e}`);
  return e;
}
var sc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(sc || (sc = {}));
var ic;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ic || (ic = {}));
function s3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: O.PostCondition,
        conditionType: At.STX,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Is(t.address),
        conditionCode: Ii(t.condition),
        amount: pa(t.amount)
      };
    case "ft-postcondition":
      return {
        type: O.PostCondition,
        conditionType: At.Fungible,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Is(t.address),
        conditionCode: Ii(t.condition),
        amount: pa(t.amount),
        asset: cf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: O.PostCondition,
        conditionType: At.NonFungible,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Is(t.address),
        conditionCode: Ii(t.condition),
        asset: cf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: O.PostCondition,
        conditionType: At.Staking,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Is(t.address),
        conditionCode: Ii(t.condition),
        amount: pa(t.amount)
      };
    case "pox-postcondition":
      return {
        type: O.PostCondition,
        conditionType: At.PoX,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Is(t.address),
        conditionCode: i3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ii(t) {
  return sc[t];
}
function i3(t) {
  return ic[t];
}
function L0(t) {
  const e = s3(t);
  return tS(e);
}
function o3(t, e, n) {
  return pl(C0(t), n);
}
function C0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = js(r);
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
    return BigInt(`0x${l3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dl(t, e = 8) {
  return (typeof t == "bigint" ? t : C0(t)).toString(16).padStart(e * 2, "0");
}
function pl(t, e = 16) {
  const n = dl(t, e);
  return js(n);
}
function a3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const c3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function l3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += c3[n];
  return e;
}
function js(t) {
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
function gl(t) {
  return new TextEncoder().encode(t);
}
function u3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function f3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function gf(t) {
  if (t.some(f3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function yl(...t) {
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
function rn(t) {
  return yl(...t.map((e) => typeof e == "number" ? gf([e]) : e instanceof Array ? gf(e) : e));
}
function Ho(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var oc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(oc || (oc = {}));
oc.Mainnet;
const h3 = 128, d3 = 128, B0 = 16;
var ac;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ac || (ac = {}));
var yf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(yf || (yf = {}));
var wf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(wf || (wf = {}));
var Se;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Se || (Se = {}));
const ga = ["onChainOnly", "offChainOnly", "any"];
ga[0] + "", Se.OnChainOnly, ga[1] + "", Se.OffChainOnly, ga[2] + "", Se.Any, Se.OnChainOnly + "", Se.OnChainOnly, Se.OffChainOnly + "", Se.OffChainOnly, Se.Any + "", Se.Any;
var cc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(cc || (cc = {}));
cc.Mainnet;
var bf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(bf || (bf = {}));
var Wn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wn || (Wn = {}));
var xf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xf || (xf = {}));
var mf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(mf || (mf = {}));
var Sf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Sf || (Sf = {}));
var Ef;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ef || (Ef = {}));
var Af;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Af || (Af = {}));
var $f;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})($f || ($f = {}));
var lc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(lc || (lc = {}));
var If;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(If || (If = {}));
var vf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(vf || (vf = {}));
function uc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function p3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function k0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function g3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  uc(t.outputLen), uc(t.blockLen);
}
function y3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function w3(t, e) {
  k0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ya = {
  number: uc,
  bool: p3,
  bytes: k0,
  hash: g3,
  exists: y3,
  output: w3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const wa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Me = (t, e) => t << 32 - e | t >>> e, b3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!b3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function x3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function M0(t) {
  if (typeof t == "string" && (t = x3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let m3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Cr(t) {
  const e = (r) => t().update(M0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function S3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let wl = class extends m3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = wa(this.buffer);
  }
  update(e) {
    ya.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = M0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = wa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ya.exists(this), ya.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    S3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = wa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const E3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _0 = Uint8Array.from({ length: 16 }, (t, e) => e), A3 = _0.map((t) => (9 * t + 5) % 16);
let bl = [_0], xl = [A3];
for (let t = 0; t < 4; t++)
  for (let e of [bl, xl])
    e.push(e[t].map((n) => E3[n]));
const U0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), $3 = bl.map((t, e) => t.map((n) => U0[e][n])), I3 = xl.map((t, e) => t.map((n) => U0[e][n])), v3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), L3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), vi = (t, e) => t << e | t >>> 32 - e;
function Lf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Li = new Uint32Array(16);
let C3 = class extends wl {
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
    for (let h = 0; h < 16; h++, n += 4)
      Li[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = v3[h], I = L3[h], k = bl[h], M = xl[h], b = $3[h], L = I3[h];
      for (let A = 0; A < 16; A++) {
        const T = vi(r + Lf(h, i, a, l) + Li[k[A]] + w, b[A]) + u | 0;
        r = u, u = l, l = vi(a, 10) | 0, a = i, i = T;
      }
      for (let A = 0; A < 16; A++) {
        const T = vi(s + Lf(y, o, c, f) + Li[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = vi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Li.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Cr(() => new C3());
const B3 = (t, e, n) => t & e ^ ~t & n, k3 = (t, e, n) => t & e ^ t & n ^ e & n, M3 = new Uint32Array([
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
]), Sn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), En = new Uint32Array(64);
let T0 = class extends wl {
  constructor() {
    super(64, 32, 8, !1), this.A = Sn[0] | 0, this.B = Sn[1] | 0, this.C = Sn[2] | 0, this.D = Sn[3] | 0, this.E = Sn[4] | 0, this.F = Sn[5] | 0, this.G = Sn[6] | 0, this.H = Sn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      En[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = En[u - 15], h = En[u - 2], y = Me(p, 7) ^ Me(p, 18) ^ p >>> 3, w = Me(h, 17) ^ Me(h, 19) ^ h >>> 10;
      En[u] = w + En[u - 7] + y + En[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Me(a, 6) ^ Me(a, 11) ^ Me(a, 25), h = f + p + B3(a, c, l) + M3[u] + En[u] | 0, w = (Me(r, 2) ^ Me(r, 13) ^ Me(r, 22)) + k3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    En.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, _3 = class extends T0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Cr(() => new T0());
Cr(() => new _3());
const Ci = BigInt(2 ** 32 - 1), fc = BigInt(32);
function H0(t, e = !1) {
  return e ? { h: Number(t & Ci), l: Number(t >> fc & Ci) } : { h: Number(t >> fc & Ci) | 0, l: Number(t & Ci) | 0 };
}
function U3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = H0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const T3 = (t, e) => BigInt(t >>> 0) << fc | BigInt(e >>> 0), H3 = (t, e, n) => t >>> n, N3 = (t, e, n) => t << 32 - n | e >>> n, P3 = (t, e, n) => t >>> n | e << 32 - n, D3 = (t, e, n) => t << 32 - n | e >>> n, O3 = (t, e, n) => t << 64 - n | e >>> n - 32, j3 = (t, e, n) => t >>> n - 32 | e << 64 - n, F3 = (t, e) => e, z3 = (t, e) => t, R3 = (t, e, n) => t << n | e >>> 32 - n, G3 = (t, e, n) => e << n | t >>> 32 - n, V3 = (t, e, n) => e << n - 32 | t >>> 64 - n, K3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function q3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const W3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Y3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, X3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Z3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Q3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), J3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
  fromBig: H0,
  split: U3,
  toBig: T3,
  shrSH: H3,
  shrSL: N3,
  rotrSH: P3,
  rotrSL: D3,
  rotrBH: O3,
  rotrBL: j3,
  rotr32H: F3,
  rotr32L: z3,
  rotlSH: R3,
  rotlSL: G3,
  rotlBH: V3,
  rotlBL: K3,
  add: q3,
  add3L: W3,
  add3H: Y3,
  add4L: X3,
  add4H: Z3,
  add5H: J3,
  add5L: Q3
}, [t4, e4] = et.split([
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
].map((t) => BigInt(t))), An = new Uint32Array(80), $n = new Uint32Array(80);
let No = class extends wl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      An[b] = e.getUint32(n), $n[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = An[b - 15] | 0, A = $n[b - 15] | 0, T = et.rotrSH(L, A, 1) ^ et.rotrSH(L, A, 8) ^ et.shrSH(L, A, 7), G = et.rotrSL(L, A, 1) ^ et.rotrSL(L, A, 8) ^ et.shrSL(L, A, 7), N = An[b - 2] | 0, P = $n[b - 2] | 0, x = et.rotrSH(N, P, 19) ^ et.rotrBH(N, P, 61) ^ et.shrSH(N, P, 6), v = et.rotrSL(N, P, 19) ^ et.rotrBL(N, P, 61) ^ et.shrSL(N, P, 6), U = et.add4L(G, v, $n[b - 7], $n[b - 16]), R = et.add4H(U, T, x, An[b - 7], An[b - 16]);
      An[b] = R | 0, $n[b] = U | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = et.rotrSH(u, p, 14) ^ et.rotrSH(u, p, 18) ^ et.rotrBH(u, p, 41), A = et.rotrSL(u, p, 14) ^ et.rotrSL(u, p, 18) ^ et.rotrBL(u, p, 41), T = u & h ^ ~u & w, G = p & y ^ ~p & I, N = et.add5L(M, A, G, e4[b], $n[b]), P = et.add5H(N, k, L, T, t4[b], An[b]), x = N | 0, v = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), U = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, g = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = p | 0, { h: u, l: p } = et.add(l | 0, f | 0, P | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const E = et.add3L(x, U, g);
      r = et.add3H(E, P, v, R), s = E | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = et.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = et.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: y } = et.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = et.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = et.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, y, w, I, k, M);
  }
  roundClean() {
    An.fill(0), $n.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, n4 = class extends No {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, r4 = class extends No {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, s4 = class extends No {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Cr(() => new No());
Cr(() => new n4());
Cr(() => new r4());
Cr(() => new s4());
function i4(t, e, n) {
  const s = h3;
  if (S4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ac.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ot;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ot || (Ot = {}));
let o4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, N0 = class extends o4 {
  constructor(e) {
    super(e);
  }
};
function Po(t) {
  const e = [];
  return e.push(js(dl(t.version, 1))), e.push(js(t.hash160)), rn(e);
}
function a4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Po(t.address)), t.prefix === lc.Contract && e.push(Fs(t.contractName)), rn(e);
}
function Fs(t) {
  const e = [], n = gl(t.content), r = n.byteLength;
  return e.push(js(dl(r, t.lengthPrefixBytes))), e.push(n), rn(e);
}
function c4(t) {
  const e = [];
  return e.push(Po(t.address)), e.push(Fs(t.contractName)), e.push(Fs(t.assetName)), rn(e);
}
function P0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(a4(t.principal)), (t.conditionType === Wn.Fungible || t.conditionType === Wn.NonFungible) && e.push(c4(t.assetInfo)), t.conditionType === Wn.NonFungible && e.push(wr(t.assetName)), e.push(t.conditionCode), t.conditionType === Wn.STX || t.conditionType === Wn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new N0("The post-condition amount may not be larger than 8 bytes");
    e.push(o3(t.amount, !1, 8));
  }
  return rn(e);
}
function ze(t, e) {
  return rn([t, e]);
}
function l4(t) {
  return new Uint8Array([t.type]);
}
function u4(t) {
  return t.type === Ot.OptionalNone ? new Uint8Array([t.type]) : ze(t.type, wr(t.value));
}
function f4(t) {
  const e = new Uint8Array(4);
  return Ho(e, t.buffer.length, 0), ze(t.type, yl(e, t.buffer));
}
function h4(t) {
  const e = pl(a3(t.value, BigInt(d3)), B0);
  return ze(t.type, e);
}
function d4(t) {
  const e = pl(t.value, B0);
  return ze(t.type, e);
}
function p4(t) {
  return ze(t.type, Po(t.address));
}
function g4(t) {
  return ze(t.type, yl(Po(t.address), Fs(t.contractName)));
}
function y4(t) {
  return ze(t.type, wr(t.value));
}
function w4(t) {
  const e = [], n = new Uint8Array(4);
  Ho(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = wr(r);
    e.push(s);
  }
  return ze(t.type, rn(e));
}
function b4(t) {
  const e = [], n = new Uint8Array(4);
  Ho(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = i4(s);
    e.push(Fs(i));
    const o = wr(t.data[s]);
    e.push(o);
  }
  return ze(t.type, rn(e));
}
function D0(t, e) {
  const n = [], r = e == "ascii" ? u3(t.data) : gl(t.data), s = new Uint8Array(4);
  return Ho(s, r.length, 0), n.push(s), n.push(r), ze(t.type, rn(n));
}
function x4(t) {
  return D0(t, "ascii");
}
function m4(t) {
  return D0(t, "utf8");
}
function wr(t) {
  switch (t.type) {
    case Ot.BoolTrue:
    case Ot.BoolFalse:
      return l4(t);
    case Ot.OptionalNone:
    case Ot.OptionalSome:
      return u4(t);
    case Ot.Buffer:
      return f4(t);
    case Ot.UInt:
      return d4(t);
    case Ot.Int:
      return h4(t);
    case Ot.PrincipalStandard:
      return p4(t);
    case Ot.PrincipalContract:
      return g4(t);
    case Ot.ResponseOk:
    case Ot.ResponseErr:
      return y4(t);
    case Ot.List:
      return w4(t);
    case Ot.Tuple:
      return b4(t);
    case Ot.StringASCII:
      return x4(t);
    case Ot.StringUTF8:
      return m4(t);
    default:
      throw new N0("Unable to serialize. Invalid Clarity Value.");
  }
}
const S4 = (t, e) => t ? gl(t).length > e : !1, E4 = "connect-ui";
let Fi, O0, se = !1, hc = !1;
const nn = (t, e = "") => () => {
}, A4 = (t, e) => () => {
}, $4 = "{visibility:hidden}.hydrated{visibility:inherit}", Cf = {}, I4 = "http://www.w3.org/2000/svg", v4 = "http://www.w3.org/1999/xhtml", L4 = (t) => t != null, ml = (t) => (t = typeof t, t === "object" || t === "function");
function j0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Z = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !ml(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? dc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = dc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, dc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, C4 = {}, B4 = (t) => t && t.$tag$ === C4, k4 = (t, e) => t != null && !ml(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, M4 = (t) => ws(t).$hostElement$, _4 = (t, e, n) => {
  const r = Rt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Bf = /* @__PURE__ */ new WeakMap(), U4 = (t, e, n) => {
  let r = ao.get(t);
  J4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ao.set(t, r);
}, T4 = (t, e, n, r) => {
  var s;
  let i = F0(e);
  const o = ao.get(i);
  if (t = t.nodeType === 11 ? t : De, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Bf.get(t), c;
      if (a || Bf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = De.createElement("style"), c.innerHTML = o;
          const l = (s = Rt.$nonce$) !== null && s !== void 0 ? s : j0(De);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, H4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = nn("attachStyles", e.$tagName$), i = T4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, F0 = (t, e) => "sc-" + t.$tagName$, kf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = _f(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = Mf(n), f = Mf(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : _f(Do, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Rt.rel(t, e, n, !1), r && Rt.ael(t, e, r, !1);
    else {
      const c = ml(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const l = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != l) && (t[e] = l);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, N4 = /\s/, Mf = (t) => t ? t.split(N4) : [], z0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Cf, o = e.$attrs$ || Cf;
  for (r in i)
    r in o || kf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    kf(s, r, i[r], o[r], n, e.$flags$);
}, Sl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = De.createTextNode(s.$text$);
  else {
    if (se || (se = s.$tag$ === "svg"), o = s.$elm$ = De.createElementNS(se ? I4 : v4, s.$tag$), se && s.$tag$ === "foreignObject" && (se = !1), z0(null, s, se), L4(Fi) && o["s-si"] !== Fi && o.classList.add(o["s-si"] = Fi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Sl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? se = !1 : o.tagName === "foreignObject" && (se = !0);
  }
  return o;
}, R0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === O0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Sl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, G0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, P4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], p;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : Bi(a, f) ? (vs(a, f), a = e[++s], f = r[++i]) : Bi(c, u) ? (vs(c, u), c = e[--o], u = r[--l]) : Bi(a, u) ? (vs(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : Bi(c, f) ? (vs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (p = Sl(e && e[i], n, i), f = r[++i], p && a.$elm$.parentNode.insertBefore(p, a.$elm$));
  s > o ? R0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && G0(e, s, o);
}, Bi = (t, e) => t.$tag$ === e.$tag$, vs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (se = i === "svg" ? !0 : i === "foreignObject" ? !1 : se, z0(t, e, se), r !== null && s !== null ? P4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), R0(n, null, e, s, 0, s.length - 1)) : r !== null && G0(r, 0, r.length - 1), se && i === "svg" && (se = !1)) : t.$text$ !== o && (n.data = o);
}, D4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || dc(null, null), s = B4(e) ? e : Z(null, null, e);
  O0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Fi = n["s-sc"], vs(r, s);
}, V0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, El = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return V0(t, t.$ancestorComponent$), eE(() => O4(t, e));
}, O4 = (t, e) => {
  const n = nn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), R4(s, () => j4(t, r, e));
}, j4 = async (t, e, n) => {
  const r = t.$hostElement$, s = nn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && H4(t);
  const o = nn("render", t.$cmpMeta$.$tagName$);
  F4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => z4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, F4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, D4(t, e);
  } catch (r) {
    zs(r, t.$hostElement$);
  }
  return null;
}, z4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = nn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, q0(n), r(), t.$onReadyResolve$(n), s || K0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && $l(() => El(t, !1)), t.$flags$ &= -517;
}, K0 = (t) => {
  q0(De.documentElement), $l(() => _4(Do, "appload", { detail: { namespace: E4 } }));
}, R4 = (t, e) => t && t.then ? t.then(e) : e(), q0 = (t) => t.classList.add("hydrated"), G4 = (t, e) => ws(t).$instanceValues$.get(e), V4 = (t, e, n, r) => {
  const s = ws(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = k4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && El(s, !1));
}, W0 = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return G4(this, i);
        },
        set(a) {
          V4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Rt.jmp(() => {
          const l = i.get(o);
          if (this.hasOwnProperty(l))
            c = this[l], delete this[l];
          else if (s.hasOwnProperty(l) && typeof this[l] == "number" && this[l] == c)
            return;
          this[l] = c === null && typeof this[l] == "boolean" ? !1 : c;
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
}, K4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Q4(n), s.then) {
        const c = A4();
        s = await s, c();
      }
      s.isProxied || (W0(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = nn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        zs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = F0(n);
      if (!ao.has(c)) {
        const l = nn("registerStyles", n.$tagName$);
        U4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => El(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, q4 = (t) => {
  if (!(Rt.$flags$ & 1)) {
    const e = ws(t), n = e.$cmpMeta$, r = nn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            V0(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), K4(t, e, n);
    }
    r();
  }
}, W4 = (t) => {
  Rt.$flags$ & 1 || ws(t);
}, Y4 = (t, e = {}) => {
  var n;
  const r = nn(), s = [], i = e.exclude || [], o = Do.customElements, a = De.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ De.createElement("style"), f = [];
  let u, p = !0;
  Object.assign(Rt, e), Rt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", De.baseURI).href, t.map((h) => {
    h[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const I = w.$tagName$, k = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, Z4(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), p ? f.push(this) : Rt.jmp(() => q4(this));
        }
        disconnectedCallback() {
          Rt.jmp(() => W4(this));
        }
        componentOnReady() {
          return ws(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, W0(
        k,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + $4, l.setAttribute("data-styles", "");
    const h = (n = Rt.$nonce$) !== null && n !== void 0 ? n : j0(De);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  p = !1, f.length ? f.map((h) => h.connectedCallback()) : Rt.jmp(() => u = setTimeout(K0, 30)), r();
}, Al = /* @__PURE__ */ new WeakMap(), ws = (t) => Al.get(t), X4 = (t, e) => Al.set(e.$lazyInstance$ = t, e), Z4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Al.set(t, n);
}, _f = (t, e) => e in t, zs = (t, e) => (0, console.error)(t, e), ba = /* @__PURE__ */ new Map(), Q4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = ba.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (ba.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => P5).then(o, zs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (ba.set(s, o), o[r]), zs);
}, ao = /* @__PURE__ */ new Map(), Do = typeof window < "u" ? window : {}, De = Do.document || { head: {} }, Rt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Y0 = (t) => Promise.resolve(t), J4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Uf = [], X0 = [], tE = (t, e) => (n) => {
  t.push(n), hc || (hc = !0, Rt.$flags$ & 4 ? $l(pc) : Rt.raf(pc));
}, Tf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      zs(n);
    }
  t.length = 0;
}, pc = () => {
  Tf(Uf), Tf(X0), (hc = Uf.length > 0) && Rt.raf(pc);
}, $l = (t) => Y0().then(t), eE = /* @__PURE__ */ tE(X0), nE = () => Y0(), rE = (t, e) => typeof window > "u" ? Promise.resolve() : nE().then(() => Y4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var sE = Object.defineProperty, iE = Object.defineProperties, oE = Object.getOwnPropertyDescriptors, co = Object.getOwnPropertySymbols, Z0 = Object.prototype.hasOwnProperty, Q0 = Object.prototype.propertyIsEnumerable, Hf = (t, e, n) => e in t ? sE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, le = (t, e) => {
  for (var n in e || (e = {})) Z0.call(e, n) && Hf(t, n, e[n]);
  if (co) for (var n of co(e)) Q0.call(e, n) && Hf(t, n, e[n]);
  return t;
}, ve = (t, e) => iE(t, oE(e)), J0 = (t, e) => {
  var n = {};
  for (var r in t) Z0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && co) for (var r of co(t)) e.indexOf(r) < 0 && Q0.call(t, r) && (n[r] = t[r]);
  return n;
};
function tp() {
  return Mo(fr()) || window.StacksProvider || window.BlockstackProvider;
}
function Oo(t) {
  return t ? typeof t == "string" ? dr.fromName(t) : "version" in t ? t : "url" in t ? new za({ url: t.url }) : t.transactionVersion === gr.Mainnet ? new za({ url: t.client.baseUrl }) : new Ra({ url: t.client.baseUrl }) : new Ra();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var aE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(aE || {}), cE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(cE || {}), Il = (t) => {
  let e = t;
  if (!e) {
    let n = new Uh(["store_write"], document.location.href);
    e = new Fa({ appConfig: n });
  }
  return e;
};
function ep(t) {
  try {
    return Il(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var np = (t) => {
  let e = Il(t).loadUserData().appPrivateKey, n = Ft.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function lE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [pr.Mainnet]: "mainnet", [pr.Testnet]: "testnet" }, a = Oo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function uE(t) {
  let e = Oo(t.network), n = Il(t.userSession), r = ve(le({}, t), { network: e, userSession: n });
  return le({ stxAddress: lE(r) }, r);
}
async function fE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(L0) : n = n.map((r) => W(P0(r)))), new Ft.TokenSigner("ES256k", e).signAsync(ve(le({}, t), { postConditions: n }));
}
function hE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(L0) : e = e.map((n) => W(P0(n)))), Ft.createUnsecuredToken(ve(le({}, t), { postConditions: e }));
}
var dE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = ft(a.replace(/^0x/, "")), l = r3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ve(le({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ve(le({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, pE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = J0(e, ["amount", "appDetails", "userSession"]);
  if (ep(s)) {
    let { privateKey: a, publicKey: c } = np(s), l = ve(le({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), fE(l, a);
  }
  let o = ve(le({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), hE(o);
};
async function gE(t, e, n) {
  let r = await e(ve(le(le({}, uE(t)), t), { network: Oo(t.network) }));
  return dE({ token: r, options: t }, n);
}
function yE(t, e = tp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return gE(t, pE, e);
}
function rp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ve(le({}, t), { message: lf(e), domain: lf(n) }) : ve(le({}, t), { message: W(wr(e)), domain: W(wr(n)) });
}
async function wE(t, e) {
  return new Ft.TokenSigner("ES256k", e).signAsync(rp(t));
}
async function bE(t) {
  let e = t, { userSession: n } = e, r = J0(e, ["userSession"]);
  if (ep(n)) {
    let { privateKey: s, publicKey: i } = np(n), o = ve(le({}, r), { publicKey: i });
    return wE(o, s);
  }
  return Ft.createUnsecuredToken(rp(t));
}
var xE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(xE || {}), sp = "asigna-stx", Nf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === sp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(SE(t, e), "*");
}), mE = { authenticationRequest: async (t) => Nf(t, "authenticationRequest"), transactionRequest: async (t) => Nf(t, "transactionRequest") }, SE = (t, e) => ({ source: sp, [e]: t }), EE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = mE);
};
EE();
var AE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function $E(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = fr(), o = tp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    rE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : AE, c = gx(a), l = document.createElement("connect-modal");
    l.defaultProviders = a, l.installedProviders = c, l.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      l.remove(), document.body.style.overflow = f;
    };
    l.callback = (h) => {
      u(), t(n, h);
    }, l.cancelCallback = () => {
      var h;
      u(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(l);
    let p = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", p), l.remove());
    };
    document.addEventListener("keydown", p);
  };
}
var ki = $E(yE);
function Pn(t, e, n) {
  return vl(Yt(t, e), n);
}
function Yt(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = It(r);
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
      const r = LE(BigInt(`0x${it(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${it(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Pf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ei(t, e = 8) {
  return (typeof t == "bigint" ? t : Yt(t, !1)).toString(16).padStart(e * 2, "0");
}
function jo(t) {
  return parseInt(t, 16);
}
function vl(t, e = 16) {
  const n = ei(t, e);
  return It(n);
}
function IE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function vE(t, e) {
  return t & BigInt(1) << e;
}
function LE(t, e) {
  return vE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const CE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function it(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += CE[n];
  return e;
}
function It(t) {
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
function bs(t) {
  return new TextEncoder().encode(t);
}
function Ll(t) {
  return new TextDecoder().decode(t);
}
function ip(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function BE(t) {
  return String.fromCharCode.apply(null, t);
}
function kE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(kE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fo(...t) {
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
function Ht(t) {
  return Fo(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
var Of;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Of || (Of = {}));
var jf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jf || (jf = {}));
var Ff;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ff || (Ff = {}));
const op = 33, xa = 32;
function ME(t) {
  if (t.length < xa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + xa * 2), r = t.slice(2 + xa * 2);
  return {
    recoveryId: jo(e),
    r: n,
    s: r
  };
}
function _E(t) {
  const e = typeof t == "string" ? It(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function UE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function TE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function HE(t, e) {
  return t[e];
}
function NE(t, e, n = 0) {
  return t[n] = e, t;
}
function PE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function br(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var gc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gc || (gc = {}));
const DE = gc.Mainnet, OE = 128, jE = 128, ap = 16, rr = 32, yc = 80, zo = 65, FE = 32, zE = 64, lo = 34;
var q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(q || (q = {}));
var rt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(rt || (rt = {}));
var wc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(wc || (wc = {}));
var Jt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jt || (Jt = {}));
const zi = ["onChainOnly", "offChainOnly", "any"], zf = {
  [zi[0]]: Jt.OnChainOnly,
  [zi[1]]: Jt.OffChainOnly,
  [zi[2]]: Jt.Any,
  [Jt.OnChainOnly]: Jt.OnChainOnly,
  [Jt.OffChainOnly]: Jt.OffChainOnly,
  [Jt.Any]: Jt.Any
};
function RE(t) {
  if (t in zf)
    return zf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${zi.join(", ")}`);
}
var uo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(uo || (uo = {}));
uo.Mainnet;
var as;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(as || (as = {}));
var te;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(te || (te = {}));
var kt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(kt || (kt = {}));
var xt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(xt || (xt = {}));
var fo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(fo || (fo = {}));
var Lt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lt || (Lt = {}));
var Rs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Rs || (Rs = {}));
var bc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bc || (bc = {}));
var Gs;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gs || (Gs = {}));
var Rf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Gf || (Gf = {}));
function xc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function GE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function cp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function VE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xc(t.outputLen), xc(t.blockLen);
}
function KE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qE(t, e) {
  cp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const tr = {
  number: xc,
  bool: GE,
  bytes: cp,
  hash: VE,
  exists: KE,
  output: qE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ma = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _e = (t, e) => t << 32 - e | t >>> e, WE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!WE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function YE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cl(t) {
  if (typeof t == "string" && (t = YE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class lp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Br(t) {
  const e = (r) => t().update(Cl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function XE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class Bl extends lp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ma(this.buffer);
  }
  update(e) {
    tr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ma(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    tr.exists(this), tr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    XE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ma(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const ZE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), up = Uint8Array.from({ length: 16 }, (t, e) => e), QE = up.map((t) => (9 * t + 5) % 16);
let kl = [up], Ml = [QE];
for (let t = 0; t < 4; t++)
  for (let e of [kl, Ml])
    e.push(e[t].map((n) => ZE[n]));
const fp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), JE = kl.map((t, e) => t.map((n) => fp[e][n])), t8 = Ml.map((t, e) => t.map((n) => fp[e][n])), e8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), n8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mi = (t, e) => t << e | t >>> 32 - e;
function Vf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _i = new Uint32Array(16);
class r8 extends Bl {
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
    for (let h = 0; h < 16; h++, n += 4)
      _i[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = e8[h], I = n8[h], k = kl[h], M = Ml[h], b = JE[h], L = t8[h];
      for (let A = 0; A < 16; A++) {
        const T = Mi(r + Vf(h, i, a, l) + _i[k[A]] + w, b[A]) + u | 0;
        r = u, u = l, l = Mi(a, 10) | 0, a = i, i = T;
      }
      for (let A = 0; A < 16; A++) {
        const T = Mi(s + Vf(y, o, c, f) + _i[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = Mi(c, 10) | 0, c = o, o = T;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    _i.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const s8 = Br(() => new r8()), i8 = (t, e, n) => t & e ^ ~t & n, o8 = (t, e, n) => t & e ^ t & n ^ e & n, a8 = new Uint32Array([
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
]), In = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), vn = new Uint32Array(64);
class hp extends Bl {
  constructor() {
    super(64, 32, 8, !1), this.A = In[0] | 0, this.B = In[1] | 0, this.C = In[2] | 0, this.D = In[3] | 0, this.E = In[4] | 0, this.F = In[5] | 0, this.G = In[6] | 0, this.H = In[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      vn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = vn[u - 15], h = vn[u - 2], y = _e(p, 7) ^ _e(p, 18) ^ p >>> 3, w = _e(h, 17) ^ _e(h, 19) ^ h >>> 10;
      vn[u] = w + vn[u - 7] + y + vn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = _e(a, 6) ^ _e(a, 11) ^ _e(a, 25), h = f + p + i8(a, c, l) + a8[u] + vn[u] | 0, w = (_e(r, 2) ^ _e(r, 13) ^ _e(r, 22)) + o8(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    vn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class c8 extends hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const _l = Br(() => new hp());
Br(() => new c8());
const Ui = BigInt(2 ** 32 - 1), mc = BigInt(32);
function dp(t, e = !1) {
  return e ? { h: Number(t & Ui), l: Number(t >> mc & Ui) } : { h: Number(t >> mc & Ui) | 0, l: Number(t & Ui) | 0 };
}
function l8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = dp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const u8 = (t, e) => BigInt(t >>> 0) << mc | BigInt(e >>> 0), f8 = (t, e, n) => t >>> n, h8 = (t, e, n) => t << 32 - n | e >>> n, d8 = (t, e, n) => t >>> n | e << 32 - n, p8 = (t, e, n) => t << 32 - n | e >>> n, g8 = (t, e, n) => t << 64 - n | e >>> n - 32, y8 = (t, e, n) => t >>> n - 32 | e << 64 - n, w8 = (t, e) => e, b8 = (t, e) => t, x8 = (t, e, n) => t << n | e >>> 32 - n, m8 = (t, e, n) => e << n | t >>> 32 - n, S8 = (t, e, n) => e << n - 32 | t >>> 64 - n, E8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function A8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), I8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, v8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), L8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, C8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), B8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
  fromBig: dp,
  split: l8,
  toBig: u8,
  shrSH: f8,
  shrSL: h8,
  rotrSH: d8,
  rotrSL: p8,
  rotrBH: g8,
  rotrBL: y8,
  rotr32H: w8,
  rotr32L: b8,
  rotlSH: x8,
  rotlSL: m8,
  rotlBH: S8,
  rotlBL: E8,
  add: A8,
  add3L: $8,
  add3H: I8,
  add4L: v8,
  add4H: L8,
  add5H: B8,
  add5L: C8
}, [k8, M8] = nt.split([
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
].map((t) => BigInt(t))), Ln = new Uint32Array(80), Cn = new Uint32Array(80);
class Ro extends Bl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Ln[b] = e.getUint32(n), Cn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Ln[b - 15] | 0, A = Cn[b - 15] | 0, T = nt.rotrSH(L, A, 1) ^ nt.rotrSH(L, A, 8) ^ nt.shrSH(L, A, 7), G = nt.rotrSL(L, A, 1) ^ nt.rotrSL(L, A, 8) ^ nt.shrSL(L, A, 7), N = Ln[b - 2] | 0, P = Cn[b - 2] | 0, x = nt.rotrSH(N, P, 19) ^ nt.rotrBH(N, P, 61) ^ nt.shrSH(N, P, 6), v = nt.rotrSL(N, P, 19) ^ nt.rotrBL(N, P, 61) ^ nt.shrSL(N, P, 6), U = nt.add4L(G, v, Cn[b - 7], Cn[b - 16]), R = nt.add4H(U, T, x, Ln[b - 7], Ln[b - 16]);
      Ln[b] = R | 0, Cn[b] = U | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = nt.rotrSH(u, p, 14) ^ nt.rotrSH(u, p, 18) ^ nt.rotrBH(u, p, 41), A = nt.rotrSL(u, p, 14) ^ nt.rotrSL(u, p, 18) ^ nt.rotrBL(u, p, 41), T = u & h ^ ~u & w, G = p & y ^ ~p & I, N = nt.add5L(M, A, G, M8[b], Cn[b]), P = nt.add5H(N, k, L, T, k8[b], Ln[b]), x = N | 0, v = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), U = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, g = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = p | 0, { h: u, l: p } = nt.add(l | 0, f | 0, P | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const E = nt.add3L(x, U, g);
      r = nt.add3H(E, P, v, R), s = E | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = nt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = nt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: y } = nt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = nt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = nt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, y, w, I, k, M);
  }
  roundClean() {
    Ln.fill(0), Cn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class _8 extends Ro {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class U8 extends Ro {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class T8 extends Ro {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Br(() => new Ro());
Br(() => new _8());
const H8 = Br(() => new U8());
Br(() => new T8());
function pp(t) {
  if (It(t).byteLength != zo)
    throw Error("Invalid signature");
  return {
    type: q.MessageSignature,
    data: t
  };
}
function Ls(t, e) {
  return { type: q.Address, version: t, hash160: e };
}
function Vr(t) {
  return vr.c32address(t.version, t.hash160);
}
function xr(t, e, n) {
  const r = e || 1, s = n || OE;
  if (Mp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ul(t) {
  const e = vr.c32addressDecode(t);
  return {
    type: q.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function N8(t) {
  if (t.type === _.PrincipalStandard)
    return Vr(t.address);
  if (t.type === _.PrincipalContract)
    return `${Vr(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function gp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return O8(e, n);
  } else
    return P8(t);
}
function P8(t) {
  const e = Ul(t);
  return { type: _.PrincipalStandard, address: e };
}
function D8(t) {
  return { type: _.PrincipalStandard, address: t };
}
function O8(t, e) {
  const n = Ul(t), r = xr(e);
  return yp(n, r);
}
function yp(t, e) {
  if (bs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Sa(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${it(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return Qe(t.value);
    case _.ResponseErr:
      return Qe(t.value);
    case _.ResponseOk:
      return Qe(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return N8(t);
    case _.List:
      return t.list.map((r) => Qe(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Qe(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function Qe(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: Mn(t), value: Sa(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Mn(t), value: Sa(t, !0), success: !0 };
    default:
      return { type: Mn(t), value: Sa(t, !0) };
  }
}
function Mn(t) {
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
      return `(optional ${Mn(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${Mn(t.value)})`;
    case _.ResponseOk:
      return `(response ${Mn(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? Mn(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Mn(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${ip(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${bs(t.data).length})`;
  }
}
const wp = () => ({ type: _.BoolTrue }), bp = () => ({ type: _.BoolFalse }), j8 = (t) => t ? wp() : bp(), Kf = BigInt("0xffffffffffffffffffffffffffffffff"), F8 = BigInt(0), qf = BigInt("0x7fffffffffffffffffffffffffffffff"), Wf = BigInt("-170141183460469231731687303715884105728"), z8 = (t) => {
  const e = Yt(t, !0);
  if (e > qf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${qf}`);
  if (e < Wf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Wf}`);
  return { type: _.Int, value: e };
}, ho = (t) => {
  const e = Yt(t, !1);
  if (e < F8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Kf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Kf}`);
  return { type: _.UInt, value: e };
}, xp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function mp() {
  return { type: _.OptionalNone };
}
function Sp(t) {
  return { type: _.OptionalSome, value: t };
}
function R8(t) {
  return { type: _.ResponseErr, value: t };
}
function G8(t) {
  return { type: _.ResponseOk, value: t };
}
function V8(t) {
  return { type: _.List, list: t };
}
function Sc(t) {
  for (const e in t)
    if (!TA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const Fr = (t) => ({ type: _.StringASCII, data: t }), K8 = (t) => ({ type: _.StringUTF8, data: t });
class Ep extends lp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, tr.hash(e);
    const r = Cl(n);
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
    return tr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    tr.exists(this), tr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ap = (t, e, n) => new Ep(t, e).update(n).digest();
Ap.create = (t, e) => new Ep(t, e);
Mt.hmacSha256Sync = (t, ...e) => {
  const n = Ap.create(_l, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function cs(t) {
  return {
    type: q.PublicKey,
    data: It(t)
  };
}
function q8(t, e, n = Lt.Compressed) {
  const r = ME(e.data), s = new ae(Pf(r.r), Pf(r.s)), i = st.fromSignature(t, s, r.recoveryId), o = n === Lt.Compressed;
  return i.toHex(o);
}
function W8(t) {
  return { type: q.PublicKey, data: t };
}
function xs(t) {
  return !it(t.data).startsWith("04");
}
function po(t) {
  return t.data.slice();
}
function Y8(t) {
  const e = Q8(t), n = Xs(e.data.slice(0, 32), e.compressed);
  return cs(it(n));
}
function X8(t) {
  const e = typeof t == "string" ? t : it(t), n = st.fromHex(e).toHex(!0);
  return cs(n);
}
function Z8(t) {
  const e = typeof t == "string" ? t : it(t), n = st.fromHex(e).toHex(!1);
  return cs(n);
}
function Ec(t) {
  const e = t.readUInt8(), n = e === 4 ? zE : FE;
  return W8(Ht([e, t.readBytes(n)]));
}
function Q8(t) {
  const e = _E(t), n = e.length == op;
  return { data: e, compressed: n };
}
function J8(t, e) {
  const [n, r] = So(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ei(r, 1) + ae.fromHex(n).toCompactHex();
  return pp(i);
}
function tA(t) {
  return Y8(t.data);
}
function eA(t, e, n) {
  return typeof t == "string" && (t = gp(t)), typeof n == "string" && (n = Zf(n)), {
    type: q.Payload,
    payloadType: rt.TokenTransfer,
    recipient: t,
    amount: Yt(e, !1),
    memo: n ?? Zf("")
  };
}
function nA(t, e, n, r) {
  return typeof t == "string" && (t = Ul(t)), typeof e == "string" && (e = xr(e)), typeof n == "string" && (n = xr(n)), {
    type: q.Payload,
    payloadType: rt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Yf(t, e, n) {
  return typeof t == "string" && (t = xr(t)), typeof e == "string" && (e = fA(e)), typeof n == "number" ? {
    type: q.Payload,
    payloadType: rt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: q.Payload,
    payloadType: rt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function rA() {
  return { type: q.Payload, payloadType: rt.PoisonMicroblock };
}
function Xf(t, e) {
  if (t.byteLength != rr)
    throw Error(`Coinbase buffer size must be ${rr} bytes`);
  return e != null ? {
    type: q.Payload,
    payloadType: rt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: q.Payload,
    payloadType: rt.Coinbase,
    coinbaseBytes: t
  };
}
function sA(t, e, n) {
  if (t.byteLength != rr)
    throw Error(`Coinbase buffer size must be ${rr} bytes`);
  if (n.byteLength != yc)
    throw Error(`VRF proof buffer size must be ${yc} bytes`);
  return {
    type: q.Payload,
    payloadType: rt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === _.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Ac;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Ac || (Ac = {}));
function iA(t, e, n, r, s, i, o) {
  return {
    type: q.Payload,
    payloadType: rt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function $p(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case rt.TokenTransfer:
      e.push(Ut(t.recipient)), e.push(Pn(t.amount, !1, 8)), e.push(Xe(t.memo));
      break;
    case rt.ContractCall:
      e.push(Xe(t.contractAddress)), e.push(Xe(t.contractName)), e.push(Xe(t.functionName));
      const n = new Uint8Array(4);
      br(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ut(r));
      });
      break;
    case rt.SmartContract:
      e.push(Xe(t.contractName)), e.push(Xe(t.codeBody));
      break;
    case rt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Xe(t.contractName)), e.push(Xe(t.codeBody));
      break;
    case rt.PoisonMicroblock:
      break;
    case rt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case rt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ut(t.recipient));
      break;
    case rt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ut(t.recipient ? Sp(t.recipient) : mp())), e.push(t.vrfProof);
      break;
    case rt.TenureChange:
      e.push(It(t.tenureHash)), e.push(It(t.previousTenureHash)), e.push(It(t.burnViewHash)), e.push(It(t.previousTenureEnd)), e.push(br(new Uint8Array(4), t.previousTenureBlocks)), e.push(NE(new Uint8Array(1), t.cause)), e.push(It(t.publicKeyHash));
      break;
  }
  return Ht(e);
}
function oA(t) {
  switch (t.readUInt8Enum(rt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case rt.TokenTransfer:
      const n = be(t), r = Yt(t.readBytes(8), !1), s = vp(t);
      return eA(n, r, s);
    case rt.ContractCall:
      const i = ls(t), o = we(t), a = we(t), c = [], l = t.readUInt32BE();
      for (let b = 0; b < l; b++) {
        const L = be(t);
        c.push(L);
      }
      return nA(i, o, a, c);
    case rt.SmartContract:
      const f = we(t), u = we(t, 4, 1e5);
      return Yf(f, u);
    case rt.VersionedSmartContract: {
      const b = t.readUInt8Enum(wc, (T) => {
        throw new Error(`Cannot recognize ClarityVersion: ${T}`);
      }), L = we(t), A = we(t, 4, 1e5);
      return Yf(L, A, b);
    }
    case rt.PoisonMicroblock:
      return rA();
    case rt.Coinbase: {
      const b = t.readBytes(rr);
      return Xf(b);
    }
    case rt.CoinbaseToAltRecipient: {
      const b = t.readBytes(rr), L = be(t);
      return Xf(b, L);
    }
    case rt.NakamotoCoinbase: {
      const b = t.readBytes(rr), L = be(t), A = t.readBytes(yc);
      return sA(b, L, A);
    }
    case rt.TenureChange:
      const p = it(t.readBytes(20)), h = it(t.readBytes(20)), y = it(t.readBytes(20)), w = it(t.readBytes(32)), I = t.readUInt32BE(), k = t.readUInt8Enum(Ac, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), M = it(t.readBytes(20));
      return iA(p, h, y, w, I, k, M);
  }
}
class Go extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Yn extends Go {
  constructor(e) {
    super(e);
  }
}
class oe extends Go {
  constructor(e) {
    super(e);
  }
}
class go extends Go {
  constructor(e) {
    super(e);
  }
}
class er extends Go {
  constructor(e) {
    super(e);
  }
}
var Ae;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ae || (Ae = {}));
function $c(t) {
  return pp(it(t.readBytes(zo)));
}
function Kr(t, e) {
  return {
    pubKeyEncoding: t,
    type: q.TransactionAuthField,
    contents: e
  };
}
function aA(t) {
  const e = t.readUInt8Enum(Ae, (n) => {
    throw new oe(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Ae.PublicKeyCompressed:
      return Kr(Lt.Compressed, Ec(t));
    case Ae.PublicKeyUncompressed:
      return Kr(Lt.Uncompressed, Z8(Ec(t).data));
    case Ae.SignatureCompressed:
      return Kr(Lt.Compressed, $c(t));
    case Ae.SignatureUncompressed:
      return Kr(Lt.Uncompressed, $c(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Tl(t) {
  return It(t.data);
}
function cA(t) {
  const e = [];
  switch (t.contents.type) {
    case q.PublicKey:
      e.push(t.pubKeyEncoding === Lt.Compressed ? Ae.PublicKeyCompressed : Ae.PublicKeyUncompressed), e.push(po(X8(t.contents.data)));
      break;
    case q.MessageSignature:
      e.push(t.pubKeyEncoding === Lt.Compressed ? Ae.SignatureCompressed : Ae.SignatureUncompressed), e.push(Tl(t.contents));
      break;
  }
  return Ht(e);
}
function Xe(t) {
  switch (t.type) {
    case q.Address:
      return ni(t);
    case q.Principal:
      return Ip(t);
    case q.LengthPrefixedString:
      return us(t);
    case q.MemoString:
      return hA(t);
    case q.AssetInfo:
      return Lp(t);
    case q.PostCondition:
      return dA(t);
    case q.PublicKey:
      return po(t);
    case q.LengthPrefixedList:
      return Pl(t);
    case q.Payload:
      return $p(t);
    case q.TransactionAuthField:
      return cA(t);
    case q.MessageSignature:
      return Tl(t);
  }
}
function lA() {
  return {
    type: q.Address,
    version: fo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Hl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === xt.SerializeP2PKH || e === xt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === xt.SerializeP2WPKH || e === xt.SerializeP2WSH || e === xt.SerializeP2WSHNonSequential) && !r.every(xs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case xt.SerializeP2PKH:
      return Ls(t, kA(r[0].data));
    case xt.SerializeP2WPKH:
      return Ls(t, MA(r[0].data));
    case xt.SerializeP2SH:
    case xt.SerializeP2SHNonSequential:
      return Ls(t, _A(n, r.map(po)));
    case xt.SerializeP2WSH:
    case xt.SerializeP2WSHNonSequential:
      return Ls(t, UA(n, r.map(po)));
  }
}
function ni(t) {
  const e = [];
  return e.push(It(ei(t.version, 1))), e.push(It(t.hash160)), Ht(e);
}
function ls(t) {
  const e = jo(it(t.readBytes(1))), n = it(t.readBytes(20));
  return { type: q.Address, version: e, hash160: n };
}
function Ip(t) {
  const e = [];
  return e.push(t.prefix), e.push(ni(t.address)), t.prefix === Gs.Contract && e.push(us(t.contractName)), Ht(e);
}
function uA(t) {
  const e = t.readUInt8Enum(Gs, (s) => {
    throw new oe(`Unexpected Principal payload type: ${s}`);
  }), n = ls(t);
  if (e === Gs.Standard)
    return { type: q.Principal, prefix: e, address: n };
  const r = we(t);
  return {
    type: q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function us(t) {
  const e = [], n = bs(t.content), r = n.byteLength;
  return e.push(It(ei(r, t.lengthPrefixBytes))), e.push(n), Ht(e);
}
function we(t, e, n) {
  e = e || 1;
  const r = jo(it(t.readBytes(e))), s = Ll(t.readBytes(r));
  return xr(s, e, n ?? 128);
}
function fA(t) {
  return xr(t, 4, 1e5);
}
function Zf(t) {
  if (t && Mp(t, lo))
    throw new Error(`Memo exceeds maximum length of ${lo} bytes`);
  return { type: q.MemoString, content: t };
}
function hA(t) {
  const e = [], n = bs(t.content), r = BA(it(n), lo * 2);
  return e.push(It(r)), Ht(e);
}
function vp(t) {
  let e = Ll(t.readBytes(lo));
  return e = e.replace(/\u0000*$/, ""), { type: q.MemoString, content: e };
}
function Lp(t) {
  const e = [];
  return e.push(ni(t.address)), e.push(us(t.contractName)), e.push(us(t.assetName)), Ht(e);
}
function Ic(t) {
  return {
    type: q.AssetInfo,
    address: ls(t),
    contractName: we(t),
    assetName: we(t)
  };
}
function Nl(t, e) {
  return {
    type: q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Pl(t) {
  const e = t.values, n = [];
  n.push(It(ei(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Xe(r));
  return Ht(n);
}
function Cp(t, e, n) {
  const r = jo(it(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case q.Address:
        s.push(ls(t));
        break;
      case q.LengthPrefixedString:
        s.push(we(t));
        break;
      case q.MemoString:
        s.push(vp(t));
        break;
      case q.AssetInfo:
        s.push(Ic(t));
        break;
      case q.PostCondition:
        s.push(pA(t));
        break;
      case q.PublicKey:
        s.push(Ec(t));
        break;
      case q.TransactionAuthField:
        s.push(aA(t));
        break;
    }
  return Nl(s, n);
}
function dA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Ip(t.principal)), (t.conditionType === te.Fungible || t.conditionType === te.NonFungible) && e.push(Lp(t.assetInfo)), t.conditionType === te.NonFungible && e.push(Ut(t.assetName)), e.push(t.conditionCode), t.conditionType === te.STX || t.conditionType === te.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Yn("The post-condition amount may not be larger than 8 bytes");
    e.push(Pn(t.amount, !1, 8));
  }
  return Ht(e);
}
function pA(t) {
  const e = t.readUInt8Enum(te, (o) => {
    throw new oe(`Could not read ${o} as PostConditionType`);
  }), n = uA(t);
  let r, s, i;
  switch (e) {
    case te.STX:
      return r = t.readUInt8Enum(Rs, (a) => {
        throw new oe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${it(t.readBytes(8))}`), {
        type: q.PostCondition,
        conditionType: te.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case te.Fungible:
      return s = Ic(t), r = t.readUInt8Enum(Rs, (a) => {
        throw new oe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${it(t.readBytes(8))}`), {
        type: q.PostCondition,
        conditionType: te.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case te.NonFungible:
      s = Ic(t);
      const o = be(t);
      return r = t.readUInt8Enum(bc, (a) => {
        throw new oe(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: q.PostCondition,
        conditionType: te.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Re(t, e) {
  return Ht([t, e]);
}
function gA(t) {
  return new Uint8Array([t.type]);
}
function yA(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Re(t.type, Ut(t.value));
}
function wA(t) {
  const e = new Uint8Array(4);
  return br(e, t.buffer.length, 0), Re(t.type, Fo(e, t.buffer));
}
function bA(t) {
  const e = vl(IE(t.value, BigInt(jE)), ap);
  return Re(t.type, e);
}
function xA(t) {
  const e = vl(t.value, ap);
  return Re(t.type, e);
}
function mA(t) {
  return Re(t.type, ni(t.address));
}
function SA(t) {
  return Re(t.type, Fo(ni(t.address), us(t.contractName)));
}
function EA(t) {
  return Re(t.type, Ut(t.value));
}
function AA(t) {
  const e = [], n = new Uint8Array(4);
  br(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ut(r);
    e.push(s);
  }
  return Re(t.type, Ht(e));
}
function $A(t) {
  const e = [], n = new Uint8Array(4);
  br(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = xr(s);
    e.push(us(i));
    const o = Ut(t.data[s]);
    e.push(o);
  }
  return Re(t.type, Ht(e));
}
function Bp(t, e) {
  const n = [], r = e == "ascii" ? ip(t.data) : bs(t.data), s = new Uint8Array(4);
  return br(s, r.length, 0), n.push(s), n.push(r), Re(t.type, Ht(n));
}
function IA(t) {
  return Bp(t, "ascii");
}
function vA(t) {
  return Bp(t, "utf8");
}
function Ut(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return gA(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return yA(t);
    case _.Buffer:
      return wA(t);
    case _.UInt:
      return xA(t);
    case _.Int:
      return bA(t);
    case _.PrincipalStandard:
      return mA(t);
    case _.PrincipalContract:
      return SA(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return EA(t);
    case _.List:
      return AA(t);
    case _.Tuple:
      return $A(t);
    case _.StringASCII:
      return IA(t);
    case _.StringUTF8:
      return vA(t);
    default:
      throw new Yn("Unable to serialize. Invalid Clarity Value.");
  }
}
function LA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Qf = /* @__PURE__ */ new Map();
function kp(t, e) {
  const n = Qf.get(t);
  if (n !== void 0)
    return n(e);
  const r = LA(t);
  return Qf.set(t, r), kp(t, e);
}
class _s {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return PE(this.readBytes(4), 0);
  }
  readUInt8() {
    return HE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return UE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = it(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = it(n);
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
    if (kp(e, r))
      return r;
    throw n(r);
  }
}
function be(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new _s(It(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new _s(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new oe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return z8(e.readBytes(16));
    case _.UInt:
      return ho(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return xp(e.readBytes(r));
    case _.BoolTrue:
      return wp();
    case _.BoolFalse:
      return bp();
    case _.PrincipalStandard:
      const s = ls(e);
      return D8(s);
    case _.PrincipalContract:
      const i = ls(e), o = we(e);
      return yp(i, o);
    case _.ResponseOk:
      return G8(be(e));
    case _.ResponseErr:
      return R8(be(e));
    case _.OptionalNone:
      return mp();
    case _.OptionalSome:
      return Sp(be(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(be(e));
      return V8(c);
    case _.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let w = 0; w < l; w++) {
        const I = we(e).content;
        if (I === void 0)
          throw new oe('"content" is undefined');
        f[I] = be(e);
      }
      return Sc(f);
    case _.StringASCII:
      const u = e.readUInt32BE(), p = BE(e.readBytes(u));
      return Fr(p);
    case _.StringUTF8:
      const h = e.readUInt32BE(), y = Ll(e.readBytes(h));
      return K8(y);
    default:
      throw new oe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const CA = (t) => t.length % 2 == 0 ? t : `0${t}`, BA = (t, e) => t.padEnd(e, "0"), Mp = (t, e) => t ? bs(t).length > e : !1;
function vc(t) {
  return Xd(t);
}
const Vs = (t) => s8(_l(t)), Dl = (t) => it(H8(t)), kA = (t) => it(Vs(t)), MA = (t) => {
  const e = Vs(t), n = Fo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Vs(n);
  return it(r);
}, _A = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ht(n), s = Vs(r);
  return it(s);
}, UA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ht(n), s = _l(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ht(i), a = Vs(o);
  return it(a);
};
function TA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function _p(t) {
  const e = Ut(t);
  return `0x${it(e)}`;
}
function HA(t) {
  return be(t);
}
const Us = (t) => {
  try {
    return vr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ol() {
  return {
    type: q.MessageSignature,
    data: it(new Uint8Array(zo))
  };
}
function Up(t, e, n, r) {
  const s = Hl(0, t, 1, [cs(e)]).hash160, i = xs(cs(e)) ? Lt.Compressed : Lt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Yt(n, !1),
    fee: Yt(r, !1),
    keyEncoding: i,
    signature: Ol()
  };
}
function Ks(t) {
  return "signature" in t;
}
function Jf(t) {
  return t === xt.SerializeP2SH || t === xt.SerializeP2WSH;
}
function NA(t) {
  return t === xt.SerializeP2SHNonSequential || t === xt.SerializeP2WSHNonSequential;
}
function th(t) {
  const e = vc(t);
  return e.nonce = 0, e.fee = 0, Ks(e) ? e.signature = Ol() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function PA(t) {
  const e = [
    t.hashMode,
    It(t.signer),
    Pn(t.nonce, !1, 8),
    Pn(t.fee, !1, 8),
    t.keyEncoding,
    Tl(t.signature)
  ];
  return Ht(e);
}
function DA(t) {
  const e = [
    t.hashMode,
    It(t.signer),
    Pn(t.nonce, !1, 8),
    Pn(t.fee, !1, 8)
  ], n = Nl(t.fields);
  e.push(Pl(n));
  const r = new Uint8Array(2);
  return TE(r, t.signaturesRequired, 0), e.push(r), Ht(e);
}
function OA(t, e) {
  const n = it(e.readBytes(20)), r = BigInt(`0x${it(e.readBytes(8))}`), s = BigInt(`0x${it(e.readBytes(8))}`), i = e.readUInt8Enum(Lt, (a) => {
    throw new oe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === xt.SerializeP2WPKH && i != Lt.Compressed)
    throw new oe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = $c(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function jA(t, e) {
  const n = it(e.readBytes(20)), r = BigInt("0x" + it(e.readBytes(8))), s = BigInt("0x" + it(e.readBytes(8))), i = Cp(e, q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case q.PublicKey:
        xs(l.contents) || (o = !0);
        break;
      case q.MessageSignature:
        if (l.pubKeyEncoding === Lt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new er("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === xt.SerializeP2WSH || t === xt.SerializeP2WSHNonSequential))
    throw new er("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ea(t) {
  return Ks(t) ? PA(t) : DA(t);
}
function Aa(t) {
  const e = t.readUInt8Enum(xt, (n) => {
    throw new oe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === xt.SerializeP2PKH || e === xt.SerializeP2WPKH ? OA(e, t) : jA(e, t);
}
function Tp(t, e, n, r) {
  const i = t + it(new Uint8Array([e])) + it(Pn(n, !1, 8)) + it(Pn(r, !1, 8));
  if (It(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Dl(It(i));
}
function Hp(t, e, n) {
  const r = 33 + zo, s = xs(e) ? Lt.Compressed : Lt.Uncompressed, i = t + CA(s.toString(16)) + n.data, o = It(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Dl(o);
}
function FA(t, e, n, r, s) {
  const i = Tp(t, e, n, r), o = J8(s, i), a = tA(s), c = Hp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Np(t, e, n, r, s, i) {
  const o = Tp(t, e, n, r), a = cs(q8(o, i, s)), c = Hp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function zA() {
  const t = Up(xt.SerializeP2PKH, "", 0, 0);
  return t.signer = lA().hash160, t.keyEncoding = Lt.Compressed, t.signature = Ol(), t;
}
function eh(t, e, n) {
  return Ks(t) ? RA(t, e, n) : GA(t, e, n);
}
function RA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Np(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Hl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new er(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function GA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case q.PublicKey:
        xs(c.contents) || (i = !0), r.push(c.contents);
        break;
      case q.MessageSignature:
        c.pubKeyEncoding === Lt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = Np(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Jf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new er("Too many signatures");
        break;
    }
  if (Jf(t.hashMode) && o !== t.signaturesRequired || NA(t.hashMode) && o < t.signaturesRequired)
    throw new er("Incorrect number of signatures");
  if (i && (t.hashMode === xt.SerializeP2WSH || t.hashMode === xt.SerializeP2WSHNonSequential))
    throw new er("Uncompressed keys are not allowed in this hash mode");
  const a = Hl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new er(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Pp(t) {
  return {
    authType: kt.Standard,
    spendingCondition: t
  };
}
function Dp(t, e) {
  return {
    authType: kt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Up(xt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function nh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case kt.Standard:
        return Pp(th(t.spendingCondition));
      case kt.Sponsored:
        return Dp(th(t.spendingCondition), zA());
      default:
        throw new go("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function VA(t, e) {
  switch (t.authType) {
    case kt.Standard:
      return eh(t.spendingCondition, e, kt.Standard);
    case kt.Sponsored:
      return eh(t.spendingCondition, e, kt.Standard);
    default:
      throw new go("Invalid origin auth type");
  }
}
function KA(t, e) {
  switch (t.authType) {
    case kt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Yt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case kt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Yt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function qA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Yt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function WA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Yt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function YA(t, e) {
  const n = {
    ...e,
    nonce: Yt(e.nonce, !1),
    fee: Yt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function XA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case kt.Standard:
      e.push(Ea(t.spendingCondition));
      break;
    case kt.Sponsored:
      e.push(Ea(t.spendingCondition)), e.push(Ea(t.sponsorSpendingCondition));
      break;
  }
  return Ht(e);
}
function ZA(t) {
  const e = t.readUInt8Enum(kt, (r) => {
    throw new oe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case kt.Standard:
      return n = Aa(t), Pp(n);
    case kt.Sponsored:
      n = Aa(t);
      const r = Aa(t);
      return Dp(n, r);
  }
}
class QA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Yt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? DE, this.postConditionMode = i ?? as.Deny, this.postConditions = s ?? Nl([]), o)
      this.anchorMode = RE(o);
    else
      switch (r.payloadType) {
        case rt.Coinbase:
        case rt.CoinbaseToAltRecipient:
        case rt.NakamotoCoinbase:
        case rt.PoisonMicroblock:
        case rt.TenureChange:
          this.anchorMode = Jt.OnChainOnly;
          break;
        case rt.ContractCall:
        case rt.SmartContract:
        case rt.VersionedSmartContract:
        case rt.TokenTransfer:
          this.anchorMode = Jt.Any;
          break;
      }
  }
  signBegin() {
    const e = vc(this);
    return e.auth = nh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = vc(this);
    return e.auth = nh(e.auth), e.txid();
  }
  verifyOrigin() {
    return VA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, kt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === kt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, kt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ks(n)) {
      const r = xs(e);
      n.fields.push(Kr(r ? Lt.Compressed : Lt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = FA(n, r, e.fee, e.nonce, s);
    return Ks(e) ? e.signature = i : e.fields.push(Kr(s.data.byteLength === op ? Lt.Compressed : Lt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Dl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != kt.Sponsored)
      throw new go("Cannot sponsor sign a non-sponsored transaction");
    this.auth = YA(this.auth, e);
  }
  setFee(e) {
    this.auth = KA(this.auth, e);
  }
  setNonce(e) {
    this.auth = qA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != kt.Sponsored)
      throw new go("Cannot sponsor sign a non-sponsored transaction");
    this.auth = WA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Yn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Yn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Yn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Yn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Yn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return br(n, this.chainId, 0), e.push(n), e.push(XA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Pl(this.postConditions)), e.push($p(this.payload)), Ht(e);
  }
}
function jl(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new _s(It(t.slice(2))) : e = new _s(It(t)) : t instanceof Uint8Array ? e = new _s(t) : e = t;
  const n = e.readUInt8Enum(uo, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = ZA(e), i = e.readUInt8Enum(Jt, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(as, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = Cp(e, q.PostCondition), c = oA(e);
  return new QA(n, s, c, a, o, i, r);
}
const JA = j8, Ts = ho, t6 = xp;
const e6 = /* @__PURE__ */ new Set([4001, -31001]), n6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], r6 = ["result", "data", "payload", "response", "params"], rh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Vo = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), kr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, tn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, s6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Op = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => s6(i, r)) === s
  );
}, jp = (t) => t ? Op(kr()).some(
  (e) => {
    var n;
    return e.id === t && (Vo(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Fp = () => {
  if (typeof window > "u")
    return;
  const t = kr(), e = Op(t).filter(
    (n) => {
      var r;
      return Vo(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = tn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of n6) {
    const r = tn(t, n) ?? (t === window ? void 0 : tn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, i6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = kr(), n = tn(e, t) ?? (e === window ? void 0 : tn(window, t)) ?? Mo(t);
  if (n)
    return n;
  if (Vo(t) || jp(t))
    return Fp();
}, Ti = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, o6 = ["blockstack-session", "blockstack"], a6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of o6) {
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
a6();
const zp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ie = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, c6 = (t) => {
  const e = ie(t);
  if (!e)
    return null;
  const n = zp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, l6 = (t) => {
  const e = ie(t);
  if (!e)
    return null;
  const n = zp(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Lc = (t, e = "mainnet") => {
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
      return Lc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Lc(r, e);
  }
  return e;
}, sr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, qs = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Us(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = qs(s, e + 1);
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
    const i = qs(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Us(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Us(n.testnet) ? n.testnet.trim() : null;
}, sh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Rp = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && e6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, mr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ie(n == null ? void 0 : n.message) ?? ie(e.message) ?? ie(e.error) ?? ie(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, fs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw mr(e);
    if (e.status === "error")
      throw mr(e.result ?? e);
  }
  return t;
}, ih = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return fs(r);
  } catch (r) {
    throw mr(r);
  }
}, Gp = () => Fp(), Fl = () => {
  if (typeof window > "u")
    return;
  const t = kr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = tn(t, e) ?? (t === window ? void 0 : tn(window, e));
    if (n)
      return n;
  }
}, oh = () => {
  if (typeof window > "u")
    return;
  const t = Fl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = kr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = tn(e, n) ?? (e === window ? void 0 : tn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ri = (t) => {
  var r, s;
  const e = fr();
  if (Vo(e) || jp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = kr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Gp();
}, $a = (t) => {
  const e = l6(t);
  if (!e)
    return null;
  try {
    const n = jl(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, yo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = $a(t), r = c6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? ie(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = yo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of rh)
    if ($a(s[a])) {
      i = ie(s[a]);
      break;
    }
  const o = ie(s.txId) || ie(s.txid) || ie(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ie(s.txRaw) ?? void 0
    };
  for (const a of rh) {
    const c = $a(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ie(s[a]) ?? void 0
      };
  }
  for (const a of r6) {
    const c = s[a], l = yo(c, e + 1);
    if (l)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...l,
        txId: l.txId,
        txid: l.txid ?? l.txId
      };
  }
  return null;
}, Ia = (t) => {
  const e = yo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, u6 = (t) => {
  const e = yo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, f6 = (t) => ({
  ...t,
  fee: sr(t.fee),
  nonce: sr(t.nonce),
  sponsored: t.sponsored === !0
}), ah = (t) => ({
  recipient: t.recipient,
  amount: sr(t.amount) ?? "0",
  memo: t.memo,
  network: Lc(t.network),
  address: t.stxAddress,
  fee: sr(t.fee),
  nonce: sr(t.nonce),
  sponsored: t.sponsored ?? !1
}), Vp = "WALLET_ADDRESS_MISMATCH", h6 = 45e3;
let Hs = null;
const Cc = (t) => {
  t && (Hs = { address: t, at: Date.now() });
}, d6 = () => {
  Hs = null;
}, p6 = () => Hs && Date.now() - Hs.at <= h6 ? Hs.address : null, g6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, y6 = async (t) => {
  d6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = fs(await t.request("wallet_connect")), n = qs(e);
  return Cc(n), n;
}, w6 = async (t, e, n, r) => {
  try {
    return fs(await t.request(e, n));
  } catch (s) {
    const i = mr(s);
    if (!g6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await y6(t);
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
        { code: o ? Vp : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return fs(await t.request(e, n));
    } catch (a) {
      throw mr(a);
    }
  }
};
let ch = 3e4;
const b6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${ch / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, ch);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, x6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Vp }
      );
    return c;
  }, s = p6();
  if (s)
    return Ti(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ti(n, "account-read");
  try {
    const c = fs(
      await b6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = qs(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Rp(c))
      throw mr(c);
    Ti(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Cc(i), r(i, "wallet_getAccount");
  let o;
  Ti(n, "account-reconnect");
  try {
    o = fs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), mr(c);
  }
  const a = qs(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Cc(a), r(a, "wallet_connect");
}, m6 = async (t, e) => {
  if (!Ri(t)) {
    const i = await ih(
      t,
      "stx_transferStx",
      ah(e)
    );
    return Ia(i);
  }
  const n = Fl();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await ih(
      n,
      "stx_transferStx",
      ah(e)
    );
    return Ia(i);
  }
  const r = Gp();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await x6(r, e.stxAddress);
  const s = await w6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: sr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: sr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ia(s);
}, S6 = () => fr(), Kp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = fr(), e = t ? i6(t) : void 0;
  if (e)
    return e;
  const n = kr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, E6 = (t, e) => {
  const n = Kp(), r = f6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, u6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ki(r, e);
  if (Ri(n) && !Fl()) {
    const s = oh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: fr(),
        route: "legacy-transaction-request"
      }), ki(r, s);
  }
  return void m6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (sh(s) && Ri(n)) {
      const a = oh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: fr(),
          route: "legacy-transaction-request"
        }), ki(r, a);
        return;
      }
    }
    if (sh(s) && !Ri(n)) {
      ki(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Rp(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, lh = (t) => _p(t).replace(/^0x/, ""), uh = "This wallet cannot sign messages. Try Xverse or Leather.", fh = (t) => typeof (t == null ? void 0 : t.request) == "function", hh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", A6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, $6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function I6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: lh(e.message),
    domain: lh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function v6(t, e) {
  const n = await bE({
    domain: e.domain,
    message: e.message,
    network: Oo(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function L6(t) {
  var s, i;
  const e = S6() || "", n = /xverse/i.test(e);
  let r = Kp();
  if (n && !hh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (hh(r))
    try {
      return await v6(r, t);
    } catch (o) {
      if (n || !fh(r) || !$6(o)) throw o;
    }
  if (!n && fh(r))
    try {
      return await I6(r, t);
    } catch (o) {
      throw A6(o) ? new Error(uh) : o;
    }
  throw new Error(uh);
}
const dh = 1000000n, Ns = 1000000n, Bc = 50n, wo = 3000n, zl = 300n, C6 = 3000n, B6 = 50000n, ph = 200n, Ko = (t) => t + Bc;
function Ue(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / dh}.${(n % dh).toString().padStart(6, "0")}`;
}
function k6(t, e = zl) {
  return t <= wo ? 0 : Number((t - wo) / Ko(e));
}
function gh(t, e = 0n) {
  const n = Ns - t - e;
  return n > 0n ? n : 0n;
}
function M6(t, e = zl) {
  return t > Ns ? "over" : t < wo + Ko(e) ? "empty" : t < B6 ? "low" : "ok";
}
const _6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", U6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", T6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function H6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || T6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== _6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const qp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", va = 3, N6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [kc, Wp] = qp.split("."), pe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Mc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function P6(t) {
  return pe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function hs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Yp(t, e = []) {
  const n = await hs(`/v2/contracts/call-read/${kc}/${Wp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: kc, arguments: e.map((r) => "0x" + pe(Ut(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Qe(be(n.result));
}
async function D6() {
  const t = await hs(`/v2/contracts/source/${kc}/${Wp}?proof=0`);
  if (typeof t.source != "string" || await P6(t.source) !== U6) throw Error("Deployed source does not match the tested helper.");
  if (H6(await Yp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Xp(t) {
  return t.startsWith("SP") && Us(t) && !t.includes(".");
}
async function O6(t) {
  var r;
  if (!Xp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await hs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function j6(t) {
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function F6(t, e) {
  var s, i;
  const n = await Yp("get-owner", [Ts(t), Ts(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Xp(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function z6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Mc(t), signal: AbortSignal.timeout(15e3) });
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
async function R6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function G6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = jl(Mc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Vr(Ls(fo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Vr(r.contractAddress) + "." + r.contractName.content !== qp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || pe(Ut(r.functionArgs[0])) !== pe(Ut(Ts(t.core))) || pe(Ut(r.functionArgs[1])) !== pe(Ut(Ts(t.song))) || pe(Ut(r.functionArgs[2])) !== pe(Ut(t6(Mc(t.id)))) || t.amount !== "50" || e.postConditionMode !== as.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Rs.Equal || i.principal.prefix !== 2 || Vr(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Vr(r.contractAddress) + "." + r.contractName.content !== N6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || pe(Ut(r.functionArgs[0])) !== pe(Ut(Ts(t.song))) || typeof t.liked != "boolean" || pe(Ut(r.functionArgs[1])) !== pe(Ut(JA(t.liked))) || t.amount !== "0" || e.postConditionMode !== as.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Qe(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const V6 = "xtrata.xyz/radio/listening-wallet", K6 = "Link a temporary listening wallet for pay-per-play; no spending permission", q6 = (t) => ({
  domain: Sc({ name: Fr(V6), version: Fr("1"), "chain-id": ho(1) }),
  message: Sc({
    purpose: Fr(K6),
    main: Fr(t.main),
    listening: Fr(t.listening),
    issued: ho(t.issued)
  })
}), W6 = ["prepared", "signed", "unknown", "pending"], Y6 = 30 * 6e4, Or = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, yh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function X6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = !1, u = !1, p = null, h = !1, y = "", w = "", I, k = null, M, b = [], L, A = -1 / 0;
  const T = /* @__PURE__ */ new Set();
  let G = !1, N = !1, P = !1, x = !1, v = 0, U = null, R = Promise.resolve();
  const g = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? zl.toString()), E = ($, j) => `xtrata.ppp.v1.${$}:${j}`, D = ($ = i == null ? void 0 : i.address) => {
    if (!$) return [];
    try {
      const j = JSON.parse(t.store.get(E("entries", $)) || "[]");
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  }, F = ($) => {
    const j = [$, ...D($.address).filter((K) => !(K.txid === $.txid && K.kind === $.kind))].slice(0, 200);
    t.store.set(E("entries", $.address), JSON.stringify(j));
  }, ht = ($ = i == null ? void 0 : i.address) => !!$ && t.store.get(E("on", $)) !== "0", m = ($) => {
    i != null && i.address && t.store.set(E("on", i.address), $ ? "1" : "0");
  }, B = () => D().filter(($) => W6.includes($.status)), Y = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(E("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, ut = ($) => {
    i != null && i.address && t.store.set(E("deposit", i.address), JSON.stringify($));
  }, ct = () => B().filter(($) => t.now() - $.created > Y6 && T.has($.txid));
  function yt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const $ = t.main();
    return $ ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== $ ? "link" : o === void 0 ? "loading" : o > Ns ? "over" : o < wo + Ko(g()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const zt = () => {
    var $, j;
    return {
      step: yt(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : M6(o, g()),
      playsLeft: o === void 0 ? 0 : k6(o, g()),
      allowance: o === void 0 ? Ns : gh(o, BigInt((($ = Y()) == null ? void 0 : $.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: ht(),
      entries: D(),
      depositTxid: ((j = Y()) == null ? void 0 : j.txid) ?? I,
      depositPending: !!Y(),
      linkedListening: L && L === t.main() ? b.map((K) => K.listening) : [],
      serverLinked: !!k && M === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: ct().length,
      armed: P
    };
  }, Et = ($, j = "") => {
    y = $, w = j, t.changed();
  };
  async function ot($, j) {
    if (!c) {
      c = $, w = "", t.changed();
      try {
        await j();
      } catch (K) {
        const z = K instanceof Error ? K.message : String(K);
        w = /Cancelled in the listening wallet/.test(z) ? "" : z, w || (y = "Cancelled. Nothing was signed.", x = !0);
      } finally {
        c = null, await ue(!0);
      }
    }
  }
  async function Dt() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function _t($ = !1) {
    i != null && i.address && (!$ && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function On($) {
    if ((L !== $ || t.now() - A >= 6e4) && (b = await t.links($), L = $, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === $) return;
    const j = `${$}:${i.address}`;
    M === j && k || (k = b.find((K) => K.listening === i.address) ?? null, M = j);
  }
  async function Mr() {
    const $ = i == null ? void 0 : i.address;
    if (!$) return;
    let j;
    for (const z of B())
      try {
        const wt = await t.chain.transaction(z.txid);
        if (!wt) {
          if (T.add(z.txid), t.now() - z.created > 15 * 6e4 && (j ?? (j = await t.chain.confirmedNonce($))), j !== void 0 && j > BigInt(z.nonce)) {
            F({ ...z, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((z.status === "unknown" || z.status === "signed") && z.raw)
            try {
              await t.chain.broadcast(z.raw, z.txid), F({ ...z, status: "pending" });
            } catch (Ct) {
              Or(Ct) && F({ ...z, status: "failed", note: Ct.message, raw: void 0 });
            }
          continue;
        }
        T.delete(z.txid);
        const mt = String(wt.tx_status);
        mt === "success" && wt.canonical !== !1 && wt.is_unanchored === !1 ? (F({ ...z, status: "confirmed", confirmedAt: t.now(), actualFee: String(wt.fee_rate ?? z.fee), raw: void 0 }), z.kind === "like" && (h = !0)) : mt.startsWith("abort_") || mt.startsWith("dropped_") ? F({ ...z, status: "failed", note: mt, raw: void 0 }) : z.status !== "pending" && F({ ...z, status: "pending" });
      } catch {
      }
    const K = Y();
    if (K)
      try {
        const z = await t.chain.transaction(K.txid), wt = String((z == null ? void 0 : z.tx_status) ?? "");
        (wt === "success" && z.is_unanchored === !1 || wt.startsWith("abort_") || wt.startsWith("dropped_") || !z && t.now() - K.at > 2 * 36e5) && (ut(null), a = -1 / 0);
      } catch {
      }
  }
  async function ue($ = !1) {
    var j;
    try {
      const K = t.main();
      if (($ || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !K || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), P && Ge(), t.changed();
        return;
      }
      await Dt(), i = await s.request("listening.status"), await On(K), await _t($), await Mr();
    } catch (K) {
      w = K instanceof Error ? K.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (yt() === "locked" ? Fn() : P && Ge(), h) {
      h = !1;
      try {
        (j = t.likesChanged) == null || j.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function jn($, j) {
    const K = !(i != null && i.address) || ht(i.address);
    await $.request("listening.unlock", { mode: "unlock", terms: K ? Le() : void 0, anyPasskey: j }), i = await $.request("listening.status"), K && (ht(i.address) ? await Ve() : await $.request("listening.stop")), Et(K ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
    const z = p;
    p = null, z && t.now() - z.at < 12e4 && setTimeout(() => void ue(!0).then(() => zn(z)), 0);
  }
  function Fn() {
    P || c || x || v >= 3 || !s || !(i != null && i.address) || (P = !0, R = (async () => {
      try {
        await jn(s, !1), v = 0;
      } catch ($) {
        const j = $ instanceof Error ? $.message : String($);
        /Cancelled in the listening wallet/.test(j) ? U || (x = !0, Et("Cancelled. Nothing was signed.")) : /did not answer/.test(j) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (v++, w = j);
      } finally {
        P = !1;
        const $ = U;
        U = null, $ ? await $() : await ue(!0);
      }
    })());
  }
  async function Ge($) {
    P && (U = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await R), $ && await $(), t.changed();
  }
  const Le = () => ({
    fee: g().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ns.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ve() {
    if (!(i != null && i.address)) return !1;
    if (N || (N = await t.tabLock(i.address)), !N)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const X = {
    forceRefresh: () => ue(!0),
    create: () => ot("Waiting for your passkey in the listening wallet…", async () => {
      const $ = await Dt();
      await $.request("listening.unlock", { mode: "create", terms: Le() }), i = await $.request("listening.status"), m(!0), Et("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await Ve();
    }),
    unlock: ($ = !1) => {
      const j = () => ot("Waiting for your passkey in the listening wallet…", async () => jn(await Dt(), $));
      return P ? $ ? Ge(async () => {
        (yt() === "locked" || yt() === "intro") && await j();
      }) : R : j();
    },
    link: () => ot("Waiting for your main wallet to sign…", async () => {
      const $ = t.main();
      if (!$ || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const j = (await t.links($)).find((K) => K.listening === i.address);
      if (j)
        await s.request("listening.link", { main: $, issued: j.issued, mainSignature: j.mainSignature });
      else {
        const K = { main: $, listening: i.address, issued: t.now() }, z = await t.signWithMain($, q6(K)), wt = await s.request("listening.link", { main: $, issued: K.issued, mainSignature: z });
        await t.saveLink({ ...K, mainSignature: z, listeningSignature: wt.listeningSignature }), A = -1 / 0;
      }
      Et("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => ot("Waiting for your main wallet to approve the deposit…", async () => {
      const $ = t.main();
      if (!$ || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Y()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await _t(!0);
      const j = gh(o ?? 0n);
      if (j <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      I = await t.deposit($, i.address, j), I && ut({ txid: I, amount: j.toString(), at: t.now() }), Et("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => ot("Confirm in the listening wallet…", async () => {
      await Ve(), await s.request("listening.approveSession", Le()), m(!0), Et("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ot("Clearing…", async () => {
      for (const $ of ct())
        await t.chain.transaction($.txid) || F({ ...$, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Et("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => ot("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), m(!1), Et("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => ot("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Et("Locked. The listening key has been forgotten.");
    }),
    returnFunds: ($) => ot("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (B().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: j, nonce: K } = await t.chain.account(i.address);
      o = j;
      const z = await s.request("listening.prepareReturn", { mode: $, balance: j.toString(), nonce: K.toString(), fee: C6.toString() });
      if (z.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const wt = jl(z.raw);
      if (Qe(wt.payload.recipient).value !== i.linked || String(wt.payload.amount) !== z.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const mt = {
        id: yh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: z.recipient,
        amount: z.amount,
        fee: z.fee,
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: z.raw,
        txid: z.txid
      };
      t.validate(mt), F(mt);
      try {
        await t.chain.broadcast(z.raw, z.txid), F({ ...mt, status: "pending" });
      } catch (Ct) {
        throw F({ ...mt, status: "unknown", note: Ct.message }), Ct;
      }
      $ === "all" && m(!1), Et($ === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function Nt($) {
    if (!(l || c || f || u)) {
      l = !0;
      try {
        if (await ue(), yt() !== "ready" || !ht() || !(i != null && i.session) || i.session.playsLeft < 1 || !N || B().length) return;
        G || (await t.chain.verify(), G = !0);
        const K = i.address, { balance: z, nonce: wt } = await t.chain.account(K);
        o = z, a = t.now();
        const mt = await t.chain.owner(va, $.song);
        if (mt === K || mt === t.main()) return;
        const Ct = await s.request("listening.signPlay", {
          core: va,
          song: $.song,
          receipt: $.id,
          fee: g().toString(),
          nonce: wt.toString(),
          balance: z.toString()
        }), Xt = {
          id: $.id,
          address: K,
          kind: "play",
          core: va,
          song: $.song,
          recipient: mt,
          amount: "50",
          fee: g().toString(),
          nonce: wt.toString(),
          created: t.now(),
          status: "signed",
          raw: Ct.raw,
          txid: Ct.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...$.title ? { title: String($.title).slice(0, 120) } : {},
          ...$.artist ? { artist: String($.artist).slice(0, 120) } : {}
        };
        t.validate(Xt), F(Xt);
        const sn = $.title ? `“${$.title}”${$.artist ? ` by ${$.artist}` : ""}` : `song #${$.song}`;
        try {
          await t.chain.broadcast(Ct.raw, Ct.txid), F({ ...Xt, status: "pending" }), y = `Paid play sent for ${sn}.`, w = "";
        } catch (he) {
          F({ ...Xt, status: Or(he) ? "failed" : "unknown", note: he.message, ...Or(he) ? { raw: void 0 } : {} }), w = he.message;
        }
        i = await s.request("listening.status");
      } catch (j) {
        y = "This song played free: " + (j instanceof Error ? j.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  function fe($) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(yt()) ? !1 : (zn($), !0);
  }
  async function zn($) {
    const j = $.title ? `“${$.title}”` : `song #${$.song}`, K = (sn) => {
      var he;
      w = sn, y = "";
      try {
        (he = t.likeFailed) == null || he.call(t, $.song);
      } catch {
      }
      t.changed();
    }, z = yt(), wt = t.main();
    if (z === "locked") {
      p = { ...$, at: t.now() }, Et(`Unlock to like ${j}: tap “Unlock and keep paying” in the listening wallet box. The like is sent straight after.`);
      return;
    }
    if (z === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (z === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (z === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (z !== "ready" || !wt) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!N) return K("Pay-per-play is running in another tab. Like from that tab.");
    let mt;
    u = !0;
    try {
      mt = t.likeState ? (await t.likeState(wt, $.song)).by : $.likedBy ?? [];
    } catch {
      mt = $.likedBy;
    } finally {
      u = !1;
    }
    if (!mt) return K(`Could not check ${j} right now. Try the heart again.`);
    const Ct = i.address, Xt = mt.includes(Ct);
    if (!Xt && mt.length) return K(`${j} was liked from your main wallet${mt.includes(wt) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ri({ song: $.song, liked: !Xt, title: $.title, artist: $.artist });
  }
  async function ri($) {
    var z, wt, mt;
    if (f) {
      Et("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const j = $.title ? `“${$.title}”${$.artist ? ` by ${$.artist}` : ""}` : `song #${$.song}`, K = t.wait ?? ((Ct) => new Promise((Xt) => setTimeout(Xt, Ct)));
    try {
      Et(`Sending your ${$.liked ? "like" : "unlike"} for ${j} from the listening wallet…`);
      const Ct = t.now() + 12e4;
      for (; l || B().length; ) {
        if (t.now() > Ct) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await ue(!0);
      }
      if (yt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Xt = i.address, { balance: sn, nonce: he } = await t.chain.account(Xt);
      o = sn, a = t.now();
      const _r = await s.request("listening.signLike", {
        song: $.song,
        liked: $.liked,
        fee: ph.toString(),
        nonce: he.toString(),
        balance: sn.toString()
      }), Rn = {
        id: yh(),
        address: Xt,
        kind: "like",
        core: 0,
        song: $.song,
        liked: $.liked,
        recipient: "",
        amount: "0",
        fee: ph.toString(),
        nonce: he.toString(),
        created: t.now(),
        status: "signed",
        raw: _r.raw,
        txid: _r.txid,
        ...$.title ? { title: String($.title).slice(0, 120) } : {},
        ...$.artist ? { artist: String($.artist).slice(0, 120) } : {}
      };
      t.validate(Rn), F(Rn);
      try {
        await t.chain.broadcast(_r.raw, _r.txid), F({ ...Rn, status: "pending" }), y = `${$.liked ? "Liked" : "Unliked"} ${j} from your listening wallet, for your main wallet (0.0002 STX).`, w = "";
        try {
          (z = t.likeSent) == null || z.call(t, $.song, $.liked);
        } catch {
        }
      } catch (Gn) {
        if (F({ ...Rn, status: Or(Gn) ? "failed" : "unknown", note: Gn.message, ...Or(Gn) ? { raw: void 0 } : {} }), w = Gn.message, Or(Gn)) try {
          (wt = t.likeFailed) == null || wt.call(t, $.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (Ct) {
      w = "Like not sent: " + (Ct instanceof Error ? Ct.message : "the listening wallet is unavailable");
      try {
        (mt = t.likeFailed) == null || mt.call(t, $.song);
      } catch {
      }
    } finally {
      f = !1, t.changed();
    }
  }
  return { snapshot: zt, refresh: ue, onListened: Nt, heart: fe, toggleLike: zn, ...X };
}
const Gi = ["Radio address", "Connect wallet", "Access", "Passkey wallet", "Link", "Add funds", "Switch on", "First paid play"];
function Z6(t) {
  const e = Gi.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Stage ${r + 1} of ${e} · ${s}` });
  switch (t.step) {
    case "off":
    case "loading":
      return null;
    case "elsewhere":
      return n(0, "open the pay-per-play radio address");
    case "connect":
      return n(1, "connect your main Stacks wallet above");
    case "not-invited":
      return n(2, "this wallet is not in the canary yet", !0);
    case "unsupported":
      return n(3, "this browser cannot make a passkey wallet", !0);
    case "intro":
      return n(3, "create your passkey listening wallet");
    case "locked":
      return n(3, "unlock your passkey listening wallet");
    case "link":
      return n(4, "link the listening wallet to your main wallet");
    case "fund":
      return n(5, "add up to 1 STX to the listening wallet");
    case "over":
      return n(5, "over 1 STX: return the excess to keep paying", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(6, "switch paying on");
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "All stages done · paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(7, "first paid play sent, confirming on-chain") : n(7, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
const Q6 = {}, J6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, t5 = (t) => {
  const e = Q6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, e5 = (t) => `/hiro/${t}`, n5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, r5 = (t) => {
  const e = t5(t);
  if (e)
    return [n5(e)];
  const n = J6[t];
  return typeof window < "u" ? [`${window.location.origin}${e5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, s5 = {}, wh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, i5 = "xtrata.log.enabled", o5 = "xtrata.log.level", a5 = "xtrata.log.tags", c5 = "xtrata.log.dedupe", Hi = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, l5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, u5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, f5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, h5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, d5 = () => {
  const t = s5 ?? {}, e = Hi(i5) ?? t.VITE_LOG_ENABLED, n = Hi(o5) ?? t.VITE_LOG_LEVEL, r = Hi(a5) ?? t.VITE_LOG_TAGS, s = Hi(c5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: l5(e),
    level: u5(n) ?? "warn",
    tags: h5(r),
    dedupe: f5(s)
  };
}, p5 = (t, e, n) => !t.enabled || wh[n] < wh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), g5 = (t, e, n, r) => {
  const s = d5();
  if (!p5(s, e, t) || w5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, y5 = /* @__PURE__ */ new Set();
let bh = null;
const w5 = (t, e, n, r, s) => (bh !== t && (y5.clear(), bh = t), !1), b5 = (t, e, n) => g5("debug", t, e, n), x5 = {}, m5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, S5 = (t) => {
  const e = x5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : m5[t];
}, E5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, A5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return E5.test(n) ? n : null;
}, $5 = (t) => t.replace(/\/+$/, ""), I5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), xh = (t) => {
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
}, jr = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, v5 = (t) => {
  var c, l;
  let e;
  try {
    e = Qe(HA(t));
  } catch {
    return null;
  }
  const n = jr(e);
  if (!n || n.success === !1)
    return null;
  const r = jr(n.value), s = jr(r == null ? void 0 : r.value), i = jr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = xh((c = jr(i.name)) == null ? void 0 : c.value), a = xh((l = jr(i.namespace)) == null ? void 0 : l.value);
  return !o || !a ? null : A5(`${o}.${a}`);
}, L5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${$5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [_p(gp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : v5(i.result);
}, C5 = async (t) => {
  const e = t.address.trim();
  if (!Us(e))
    return null;
  const n = S5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of r5(t.network))
    try {
      return await L5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return b5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: I5(r)
  }), null;
}, mh = Object.freeze({
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
function B5(t, e = "") {
  return Object.hasOwn(mh, String(t)) ? mh[String(t)] : e;
}
const Sh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function k5(t, e = "") {
  return Object.hasOwn(Sh, String(t)) ? Sh[String(t)] : e;
}
const Eh = document.getElementById("ppp");
Eh && M5(Eh);
function M5(t) {
  const e = Iy(), n = (g) => t.querySelector(g), r = n(".ppp-frame");
  let s = null;
  const i = async (g, E) => {
    const D = await fetch(g, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), F = await D.json().catch(() => ({}));
    if (!D.ok) throw new Error((F == null ? void 0 : F.error) || `Request failed (${D.status}).`);
    return F;
  }, o = X6({
    now: Date.now,
    main: () => {
      const g = e.load();
      return g.isConnected && g.network === "mainnet" ? g.address : void 0;
    },
    config: (g) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(g || "")),
    links: async (g) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(g))).links ?? [],
    saveLink: async (g) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(g) });
    },
    bridge: async (g) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${g}; publickey-credentials-create ${g}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((m, B) => {
        s.addEventListener("load", () => m(), { once: !0 }), setTimeout(() => B(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = g + "/", r.replaceChildren(s), await E;
      const D = new yy({ walletOrigin: g, frame: s, timeoutMs: 30 * 6e4 }), F = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ht = (m, B) => F.has(m) ? D.request(m, B) : Promise.race([
        D.request(m, B),
        new Promise((Y, ut) => setTimeout(() => ut(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ht("listening.status"), { request: ht };
    },
    chain: {
      verify: D6,
      balance: j6,
      account: O6,
      owner: F6,
      broadcast: z6,
      transaction: R6,
      confirmedNonce: async (g) => {
        const E = await hs(`/v2/accounts/${g}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (g, E) => L6({ ...E, network: "mainnet", stxAddress: g }),
    deposit: (g, E, D) => new Promise((F, ht) => E6({
      recipient: E,
      amount: D.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: g,
      network: new $h(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (m) => F(m.txId || ""),
      onCancel: () => ht(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ht
    })),
    validate: G6,
    tabLock: (g) => new Promise((E) => {
      const D = navigator.locks;
      if (!(D != null && D.request)) {
        E(!0);
        return;
      }
      D.request("xtrata-ppp:" + g, { ifAvailable: !0 }, async (F) => {
        E(!!F), F && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (g) => {
        try {
          return localStorage.getItem(g);
        } catch {
          return null;
        }
      },
      set: (g, E) => {
        try {
          localStorage.setItem(g, E);
        } catch {
        }
      }
    },
    changed: () => v(o.snapshot()),
    likesChanged: () => {
      var g, E;
      (E = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || E.call(g);
    },
    likeState: async (g, E) => {
      const D = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: g, ids: String(E) })), F = Array.isArray(D == null ? void 0 : D.rows) ? D.rows.find((ht) => (ht == null ? void 0 : ht.id) === E) : null;
      if (!F || typeof F.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: F.liked, by: Array.isArray(F.by) ? F.by.filter((ht) => typeof ht == "string") : F.liked ? [g] : [] };
    },
    likeSent: (g, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: g, liked: E } })),
    likeFailed: (g) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: g } }))
  });
  window.XtrataRadioLikeHandler = (g) => {
    if (!g || !Number.isSafeInteger(g.song) || g.song < 0) return !1;
    L();
    const E = A(g.song, { title: g.title, artist: g.artist });
    return o.heart({ song: g.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(g.likedBy) ? g.likedBy : void 0 });
  };
  const a = (g) => g ? g.slice(0, 6) + "…" + g.slice(-4) : "", c = (g) => `https://explorer.hiro.so/txid/${g}?chain=mainnet`, l = (g, E = "", D = "") => {
    const F = document.createElement(g);
    return E && (F.textContent = E), D && (F.className = D), F;
  }, f = (g, E, D = "") => {
    const F = l("button", g, D);
    return F.type = "button", F.onclick = E, F;
  }, u = (g, E) => {
    const D = l("a", g);
    return D.href = E, D.target = "_blank", D.rel = "noopener", D;
  };
  let p = null, h = !1;
  const y = /* @__PURE__ */ new Map(), w = (g) => g ? (y.has(g) || (y.set(g, null), C5({ address: g, network: "mainnet" }).then((E) => {
    E && (y.set(g, E), v(o.snapshot()));
  }).catch(() => {
  })), y.get(g) ?? null) : null, I = (g) => {
    const E = w(g);
    return E ? `${E} · ${a(g)}` : a(g);
  }, k = /* @__PURE__ */ new Map();
  let M = !1;
  const b = (g) => !g || /^(?:Inscription )?#\d+$/.test(g.trim()), L = () => {
    M || (M = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((g) => g.ok ? g.json() : null).then((g) => {
      for (const E of Array.isArray(g == null ? void 0 : g.tracks) ? g.tracks : []) {
        const D = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(D) && k.set(D, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      v(o.snapshot());
    }).catch(() => {
      M = !1;
    }));
  }, A = (g, E) => {
    const D = k.get(g), F = k5(g, [D == null ? void 0 : D.title, E == null ? void 0 : E.title].find((m) => !b(m)) || ""), ht = B5(g, (D == null ? void 0 : D.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: F, artist: ht };
  }, T = (g) => {
    const { title: E, artist: D } = A(g.song, g);
    return E ? `“${E}”${D ? ` — ${D}` : ""}` : `Song #${g.song}${D ? ` — ${D}` : ""}`;
  }, G = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, N = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function P(g) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(g.step) ? ["", ""] : g.step === "over" ? ["OVER 1 STX", "bad"] : g.step === "locked" ? ["LOCKED", "mute"] : g.step === "intro" || g.step === "link" ? ["", ""] : g.step === "fund" ? g.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : g.payingOn && g.session && g.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function x(g, E, D = "", F) {
    const ht = l("dt", g), m = l("dd", E, D);
    return F && m.append(" ", F), [ht, m];
  }
  function v(g) {
    var Fn, Ge, Le, Ve;
    if (t.hidden = g.step === "off", t.hidden) return;
    const [E, D] = P(g), F = n(".ppp-state");
    F.textContent = E, F.className = "ppp-state" + (D ? " ppp-state--" + D : ""), F.hidden = !E;
    const ht = !!g.busy || g.armed, m = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(g.step) && (ht || !["intro", "loading"].includes(g.step));
    r.hidden = !m, r.classList.toggle("ppp-frame--rest", !ht && !h);
    const B = n(".ppp-frame-label");
    B.hidden = !m, B.replaceChildren(l("span", ht ? "Listening wallet · tap the button in this box" : "Listening wallet box")), ht || B.append(f(h ? "Hide" : "Show", () => {
      h = !h, v(o.snapshot());
    }, "tiny"));
    const Y = Z6(g) ?? p;
    p = Y, n(".ppp-badge").hidden = !Y || Y.at >= Gi.length;
    const ut = n(".ppp-steps"), ct = n(".ppp-stage");
    ut.hidden = ct.hidden = !Y, Y && (ut.replaceChildren(...Gi.map((X, Nt) => {
      const fe = l("li", "", Nt < Y.at ? "done" : Nt === Y.at ? Y.blocked ? "now blocked" : "now" : "");
      return fe.append(l("span", Nt < Y.at ? "✓" : String(Nt + 1), "n"), X), Nt === Y.at && fe.setAttribute("aria-current", "step"), fe;
    })), ct.textContent = Y.caption, ct.className = "ppp-stage " + (Y.at >= Gi.length ? "ppp-ok" : Y.blocked ? "ppp-bad" : "ppp-cyan"));
    const yt = n(".ppp-facts"), zt = [];
    if (g.main && ((Fn = g.gate) != null && Fn.here) && zt.push(...x("Your wallet", I(g.main), "ppp-addr-short")), g.listening) {
      const X = f("Copy", () => {
        var Nt;
        return void ((Nt = navigator.clipboard) == null ? void 0 : Nt.writeText(g.listening || ""));
      }, "tiny");
      zt.push(...x("Listening wallet", a(g.listening), "ppp-addr-short", X));
    }
    if (g.listening && g.step !== "intro" && zt.push(...g.linked ? x("Linked to", `${I(g.linked)} · returns go here`, g.linked === g.main ? "ppp-ok" : "ppp-warn") : x("Linked to", "not linked yet", "ppp-warn")), g.linkedListening.length && ((Ge = g.gate) != null && Ge.here)) {
      const X = g.linkedListening.map((Nt) => a(Nt) + (Nt === g.listening ? " (this one)" : "")).join(", ");
      zt.push(...x(g.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const X = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      zt.push(...x("Balance", `${Ue(g.balance)} STX · about ${g.playsLeft.toLocaleString()} plays`, X));
    }
    const Et = g.entries.find((X) => X.kind === "play");
    Et && L(), Et && zt.push(...x("Last paid song", `${T(Et)} → ${a(Et.recipient)}`, G[Et.status] || "")), yt.replaceChildren(...zt), n(".ppp-wallets").hidden = !zt.length;
    const ot = [], Dt = [], _t = [], On = Ko(BigInt(((Le = g.gate) == null ? void 0 : Le.limits.playFee) ?? "300")), Mr = `Each song you listen to for 30 seconds sends ${Ue(Bc)} STX to whoever holds it, plus a ${Ue(On - Bc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, ue = !!g.busy;
    switch (g.step) {
      case "elsewhere": {
        if (ot.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain.")), (Ve = g.gate) != null && Ve.radioUrl) {
          const X = l("p");
          X.append(u("Open the pay-per-play radio →", g.gate.radioUrl)), ot.push(X);
        }
        Dt.push(l("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        ot.push(l("p", "Connect your wallet above to pay artists a tiny amount for each song you listen to for 30 seconds.")), Dt.push(l("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "not-invited":
        ot.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        ot.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        ot.push(l("p", `Pay ${Ue(On)} STX for each song you listen to for 30 seconds, automatically, from a small wallet on this device.`)), Dt.push(l("p", Mr)), Dt.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Dt.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), _t.push(f("Turn on pay-per-play", () => void o.create(), "primary")), _t.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        g.armed ? ot.push(l("p", `Tap “${g.payingOn ? "Unlock and keep paying" : "Unlock with passkey"}” below. It goes straight to your passkey.`, "ppp-cyan")) : (ot.push(l("p", g.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", g.payingOn ? "" : "ppp-mute")), _t.push(f(g.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), _t.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ot.push(l("p", g.serverLinked ? `Confirm your main wallet ${I(g.main)} in the listening wallet box.` : `Link to your main wallet ${I(g.main)}: one signature, no fee.`)), Dt.push(l("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Dt.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), _t.push(f(g.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ot.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (g.entries.length ? ot.push(l("p", "Out of funds: songs play free until you top up. Paying carries on by itself once the top-up confirms.", "ppp-bad")) : ot.push(l("p", `Add up to ${Ue(g.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / On)).toLocaleString()} paid plays.`)), g.payingOn && !g.entries.length && Dt.push(l("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), Dt.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), g.depositPending && g.depositTxid) {
          const X = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          X.append(u("View", c(g.depositTxid))), ot.push(X);
        } else g.allowance > 0n && _t.push(f(`Deposit ${Ue(g.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ot.push(l("p", `Over 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${I(g.linked)}.`, "ppp-bad")), _t.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (g.payingOn && g.session && g.session.playsLeft > 0) {
          const X = Math.min(g.session.playsLeft, g.playsLeft);
          ot.push(l("p", `Paying as you listen · up to ${X.toLocaleString()} more plays remaining`, "ppp-ok")), Dt.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. Tap the heart to like or unlike a song from this wallet (0.0002 STX).")), _t.push(f("Switch off", () => void o.switchOff()));
        } else
          ot.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), _t.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        g.balanceState === "low" && ot.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), g.depositPending ? ot.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : g.allowance > 0n && g.balanceState !== "ok" && _t.push(f(`Top up ${Ue(g.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (g.stuck && (ot.push(l("p", g.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${g.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), _t.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(g.step) && g.linked && (g.balance ?? 0n) > 0n && _t.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(g.step) && _t.push(f("Lock", () => void o.lock(), "quiet")), _t.forEach((X) => X.disabled = ue), ue && (_t.length = 0), g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const X = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ot.push(l("p", `Balance ${Ue(g.balance)} STX`, X));
    }
    n(".ppp-key").replaceChildren(...ot), n(".ppp-body").replaceChildren(...Dt), n(".ppp-more").hidden = !Dt.length, n(".ppp-actions").replaceChildren(..._t), n(".ppp-msg").textContent = g.busy || g.message, n(".ppp-err").textContent = g.error;
    const jn = n(".ppp-history");
    jn.hidden = !g.entries.length, g.entries.length && L(), jn.replaceChildren(l("summary", `Payments, likes and returns (${g.entries.length})`), ...g.entries.slice(0, 20).map((X) => {
      const Nt = l("div", "", "ppp-row"), fe = X.kind === "play" ? [l("span", T(X), "ppp-song"), l("span", ` · ${Ue(BigInt(X.amount))} STX to ${a(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [l("span", `${X.liked ? "♥ Liked" : "Unliked"} ${T(X)}`, "ppp-song"), l("span", ` · for ${I(g.linked)}`, "ppp-mute")] : [l("span", `Returned ${Ue(BigInt(X.amount))} STX`, "ppp-song"), l("span", ` to ${a(X.recipient)}`, "ppp-mute")];
      return Nt.append(
        l("span", N[X.status] || X.status, "ppp-status " + (G[X.status] || "")),
        ...fe,
        l("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && Nt.append(u("tx ↗", c(X.txid))), Nt;
    }));
  }
  const U = /* @__PURE__ */ new Map(), R = () => {
    const g = window.XtrataRadio;
    return g != null && g.subscribe ? (g.subscribe((E) => {
      const D = E == null ? void 0 : E.nowPlaying;
      D && Number.isSafeInteger(Number(D.tokenId)) && U.set(Number(D.tokenId), { title: D.title || void 0, artist: D.artist || void 0 });
    }), !0) : !1;
  };
  if (!R()) {
    const g = setInterval(() => {
      R() && clearInterval(g);
    }, 500);
    setTimeout(() => clearInterval(g), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (g) => {
    const E = g.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      L();
      const D = A(E.song, U.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: D.title || void 0, artist: D.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const _5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", U5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, T5 = () => U5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, H5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, N5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Zp = class {
  constructor(t) {
    X4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && yx(t), this.callback(Mo(t));
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
    var r, s, i, o, a, c, l, f, u, p;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (p = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && p !== void 0 ? p : this.getMobileUrl(t);
  }
  render() {
    const t = T5(), e = H5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Z("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Z("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Z("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Z("div", { class: "flex flex-col space-y-[10px]" }, Z("div", { class: "flex items-center" }, Z("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Z("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Z("span", { class: "sr-only" }, "Close popup"), Z("img", { src: _5 }))), r ? Z("p", null, "Select the wallet you want to connect to.") : Z("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Z("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Z("div", { class: "mt-6" }, Z("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Z("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Z("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Z("div", { class: "aspect-square basis-9 overflow-hidden" }, Z("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Z("div", { class: "flex-1" }, Z("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Z("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Z("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Z("div", { class: "mt-6" }, r ? Z("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Z("div", { class: "mb-5 flex justify-between" }, Z("p", { class: "text-sm font-medium" }, "Recommended wallets"), Z("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Z("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Z("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Z("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Z("p", null, "What is a wallet? ", Z("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Z("ul", { class: "space-y-3" }, n.map((i) => Z("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Z("div", { class: "aspect-square basis-9 overflow-hidden" }, Z("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Z("div", { class: "flex-1" }, Z("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Z("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Z("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return M4(this);
  }
};
Zp.style = N5;
const P5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Zp
}, Symbol.toStringTag, { value: "Module" }));
