var ay = Object.defineProperty;
var cy = (t, e, n) => e in t ? ay(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var _s = (t, e, n) => cy(t, typeof e != "symbol" ? e + "" : e, n);
var ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Th(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Bo(t) {
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
      typeof ee < "u" && ee || {}, r = {
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
            var N = x.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function h(x) {
        this.map = {}, x instanceof h ? x.forEach(function(L, N) {
          this.append(N, L);
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
        var N = this.map[x];
        this.map[x] = N ? N + ", " + L : L;
      }, h.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, h.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, h.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, h.prototype.set = function(x, L) {
        this.map[a(x)] = c(L);
      }, h.prototype.forEach = function(x, L) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && x.call(L, this.map[N], N, this);
      }, h.prototype.keys = function() {
        var x = [];
        return this.forEach(function(L, N) {
          x.push(N);
        }), u(x);
      }, h.prototype.values = function() {
        var x = [];
        return this.forEach(function(L) {
          x.push(L);
        }), u(x);
      }, h.prototype.entries = function() {
        var x = [];
        return this.forEach(function(L, N) {
          x.push([N, L]);
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
        return new Promise(function(L, N) {
          x.onload = function() {
            L(x.result);
          }, x.onerror = function() {
            N(x.error);
          };
        });
      }
      function f(x) {
        var L = new FileReader(), N = g(L);
        return L.readAsArrayBuffer(x), N;
      }
      function y(x) {
        var L = new FileReader(), N = g(L), q = /charset=([A-Za-z0-9_-]+)/.exec(x.type), Y = q ? q[1] : "utf-8";
        return L.readAsText(x, Y), N;
      }
      function w(x) {
        for (var L = new Uint8Array(x), N = new Array(L.length), q = 0; q < L.length; q++)
          N[q] = String.fromCharCode(L[q]);
        return N.join("");
      }
      function $(x) {
        if (x.slice)
          return x.slice(0);
        var L = new Uint8Array(x.byteLength);
        return L.set(new Uint8Array(x)), L.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = $(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = $(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(x) {
        var L = x.toUpperCase();
        return U.indexOf(L) > -1 ? L : x;
      }
      function v(x, L) {
        if (!(this instanceof v))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var N = L.body;
        if (x instanceof v) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, L.headers || (this.headers = new h(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !N && x._bodyInit != null && (N = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new h(L.headers)), this.method = b(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var q = /([?&])_=[^&]*/;
          if (q.test(this.url))
            this.url = this.url.replace(q, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      v.prototype.clone = function() {
        return new v(this, { body: this._bodyInit });
      };
      function A(x) {
        var L = new FormData();
        return x.trim().split("&").forEach(function(N) {
          if (N) {
            var q = N.split("="), Y = q.shift().replace(/\+/g, " "), j = q.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(Y), decodeURIComponent(j));
          }
        }), L;
      }
      function P(x) {
        var L = new h(), N = x.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(q) {
          return q.indexOf(`
`) === 0 ? q.substr(1, q.length) : q;
        }).forEach(function(q) {
          var Y = q.split(":"), j = Y.shift().trim();
          if (j) {
            var Yt = Y.join(":").trim();
            try {
              L.append(j, Yt);
            } catch (Rt) {
              console.warn("Response " + Rt.message);
            }
          }
        }), L;
      }
      _.call(v.prototype);
      function G(x, L) {
        if (!(this instanceof G))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new h(L.headers), this.url = L.url || "", this._initBody(x);
      }
      _.call(G.prototype), G.prototype.clone = function() {
        return new G(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, G.error = function() {
        var x = new G(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var O = [301, 302, 303, 307, 308];
      G.redirect = function(x, L) {
        if (O.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new G(null, { status: L, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(L, N) {
          this.message = L, this.name = N;
          var q = Error(L);
          this.stack = q.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function R(x, L) {
        return new Promise(function(N, q) {
          var Y = new v(x, L);
          if (Y.signal && Y.signal.aborted)
            return q(new e.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function Yt() {
            j.abort();
          }
          j.onload = function() {
            var m = {
              statusText: j.statusText,
              headers: P(j.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? m.status = 200 : m.status = j.status, m.url = "responseURL" in j ? j.responseURL : m.headers.get("X-Request-URL");
            var B = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              N(new G(B, m));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              q(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              q(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              q(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Rt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (j.open(Y.method, Rt(Y.url), !0), Y.credentials === "include" ? j.withCredentials = !0 : Y.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof h || n.Headers && L.headers instanceof n.Headers)) {
            var Zt = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(m) {
              Zt.push(a(m)), j.setRequestHeader(m, c(L.headers[m]));
            }), Y.headers.forEach(function(m, B) {
              Zt.indexOf(B) === -1 && j.setRequestHeader(B, m);
            });
          } else
            Y.headers.forEach(function(m, B) {
              j.setRequestHeader(B, m);
            });
          Y.signal && (Y.signal.addEventListener("abort", Yt), j.onreadystatechange = function() {
            j.readyState === 4 && Y.signal.removeEventListener("abort", Yt);
          }), j.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return R.polyfill = !0, n.fetch || (n.fetch = R, n.Headers = h, n.Request = v, n.Response = G), e.Headers = h, e.Request = v, e.Response = G, e.fetch = R, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ee);
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
var as;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(as || (as = {}));
var wr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wr || (wr = {}));
var lu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(lu || (lu = {}));
const dy = "https://api.mainnet.hiro.so", py = "https://api.testnet.hiro.so", gy = "http://localhost:3999", yy = ["mainnet", "testnet", "devnet", "mocknet"];
let cs = class {
  constructor(e) {
    this.version = wr.Mainnet, this.chainId = as.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === wr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
cs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new _h();
    case "testnet":
      return new wy();
    case "devnet":
      return new by();
    case "mocknet":
      return new Uh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yy.join(", ")}`);
  }
};
cs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : cs.fromName(t);
let _h = class extends cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? dy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wr.Mainnet, this.chainId = as.Mainnet;
  }
}, wy = class extends cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? py,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wr.Testnet, this.chainId = as.Testnet;
  }
}, Uh = class extends cs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wr.Testnet, this.chainId = as.Testnet;
  }
};
const by = Uh, Hh = "xtrata.wallet.bridge.v1", xy = (t) => typeof t == "object" && t !== null && t.protocol === Hh, my = (t) => xy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Sy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Us extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const uu = 12e4;
class Ey {
  constructor(e) {
    _s(this, "pending", /* @__PURE__ */ new Map());
    _s(this, "listenTarget");
    _s(this, "closed", !1);
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
    _s(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !my(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Us("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Us("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Us("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Sy(), i = { protocol: Hh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Us(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? uu}ms.`
          )
        );
      }, this.options.timeoutMs ?? uu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Us("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Ay = ["SP", "SM"], $y = ["ST", "SN"], Iy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Ay.includes(n) ? "mainnet" : $y.includes(n) ? "testnet" : null;
}, vy = () => {
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
}, Ly = () => typeof window > "u" || !window.localStorage ? vy() : window.localStorage, ca = "xtrata.v15.1.wallet.session", fu = "mainnet", eo = { isConnected: !1 }, Cy = (t) => t.address ? Iy(t.address) ?? t.network : t.network, Nh = (t) => !t.isConnected || !t.address ? { ...eo } : Cy(t) !== fu ? { ...eo } : {
  isConnected: !0,
  address: t.address,
  network: fu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, By = (t) => {
  if (!t)
    return { ...eo };
  try {
    const e = JSON.parse(t);
    return Nh(e);
  } catch {
    return { ...eo };
  }
}, ky = (t) => {
  const e = Nh(t);
  return JSON.stringify(e);
}, My = (t) => {
  const e = Ly();
  return {
    load: () => By(e.getItem(ca)),
    save: (n) => {
      e.setItem(ca, ky(n));
    },
    clear: () => {
      e.removeItem(ca);
    }
  };
}, Ty = "https://browser.blockstack.org/auth", _y = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ph = ["store_write"], Uy = "blockstack-session", Hy = {
  logLevel: "debug"
}, Ur = {
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
Object.freeze(Ur);
class Is extends Error {
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
class Ny extends Is {
  constructor(e, n = "") {
    super({ code: Ur.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class hu extends Is {
  constructor(e = "") {
    super({ code: Ur.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class bi extends Is {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ur.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class du extends Is {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ur.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class _a extends Is {
  constructor(e) {
    super({ code: Ur.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Oh extends Is {
  constructor(e) {
    super({ code: Ur.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const pu = ["debug", "info", "warn", "error", "none"], Ua = {};
for (let t = 0; t < pu.length; t++) {
  const e = pu[t];
  Ua[e] = t;
}
class ts {
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
    return Ua[Hy.logLevel] <= Ua[e];
  }
}
function Py() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Oy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function la(t, e) {
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
function Dc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Fy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    ts.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = jy(s, t.toString(), n);
    throw ts.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Zn(t, e) {
  return Fc(Xt(t), e);
}
function Xt(t) {
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
  if (ue(t, Uint8Array))
    return BigInt(`0x${Z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function zy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function gu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ii(t, e = 8) {
  return (typeof t == "bigint" ? t : Xt(t)).toString(16).padStart(e * 2, "0");
}
function ko(t) {
  return parseInt(t, 16);
}
function Fc(t, e = 16) {
  const n = ii(t, e);
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
function Ha(t) {
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
function Hr(t) {
  return new TextEncoder().encode(t);
}
function oi(t) {
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
function yu(t) {
  if (t.some(Xy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Xe(...t) {
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
function Ot(t) {
  return Xe(...t.map((e) => typeof e == "number" ? yu([e]) : e instanceof Array ? yu(e) : e));
}
function ue(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Dh = "https://api.mainnet.hiro.so", Fh = "https://api.testnet.hiro.so", jh = "http://localhost:3999", Yy = "https://hub.blockstack.org", Zy = 33, ua = 32;
function Qy(t) {
  if (t.length < ua * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ua * 2), r = t.slice(2 + ua * 2);
  return {
    recoveryId: ko(e),
    r: n,
    s: r
  };
}
function jc(t) {
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
function br(t, e, n = 0) {
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
class zh {
  constructor(e = Ph.slice(), n = ((a) => (a = Dc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Ty) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Na(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function cw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function lw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Na(t.outputLen), Na(t.blockLen);
}
function uw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fw(t, e) {
  Rh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const cr = {
  number: Na,
  bool: cw,
  bytes: Rh,
  hash: lw,
  exists: uw,
  output: fw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const fa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), De = (t, e) => t << 32 - e | t >>> e, hw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zc(t) {
  if (typeof t == "string" && (t = dw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Gh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Nr(t) {
  const e = (r) => t().update(zc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Vh = class extends Gh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, cr.hash(e);
    const r = zc(n);
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
    return cr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    cr.exists(this), cr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Mo = (t, e, n) => new Vh(t, e).update(n).digest();
Mo.create = (t, e) => new Vh(t, e);
function pw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Rc = class extends Gh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fa(this.buffer);
  }
  update(e) {
    cr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = zc(e);
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
    cr.exists(this), cr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = fa(e), c = this.outputLen;
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
]), mn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Sn = new Uint32Array(64);
let Kh = class extends Rc {
  constructor() {
    super(64, 32, 8, !1), this.A = mn[0] | 0, this.B = mn[1] | 0, this.C = mn[2] | 0, this.D = mn[3] | 0, this.E = mn[4] | 0, this.F = mn[5] | 0, this.G = mn[6] | 0, this.H = mn[7] | 0;
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
      Sn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Sn[l - 15], f = Sn[l - 2], y = De(g, 7) ^ De(g, 18) ^ g >>> 3, w = De(f, 17) ^ De(f, 19) ^ f >>> 10;
      Sn[l] = w + Sn[l - 7] + y + Sn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = De(a, 6) ^ De(a, 11) ^ De(a, 25), f = h + g + gw(a, c, u) + ww[l] + Sn[l] | 0, w = (De(r, 2) ^ De(r, 13) ^ De(r, 22)) + yw(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Sn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bw = class extends Kh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ls = Nr(() => new Kh());
Nr(() => new bw());
const xw = {}, qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const dt = BigInt(0), Ct = BigInt(1), qn = BigInt(2), Ds = BigInt(3), wu = BigInt(8), xt = Object.freeze({
  a: dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ct,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), bu = (t, e) => (t + e / qn) / e, xi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = xt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ct * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = bu(i * t, e), c = bu(-r * t, e);
    let u = D(t - a * n - c * s, e), h = D(-a * r - c * i, e);
    const l = u > o, g = h > o;
    if (l && (u = e - u), g && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: h };
  }
}, He = 32, xr = 32, Wh = 32, no = He + 1, ro = 2 * He + 1;
function xu(t) {
  const { a: e, b: n } = xt, r = D(t * t), s = D(r * t);
  return D(s + e * t + n);
}
const mi = xt.a === dt;
class Gc extends Error {
  constructor(e) {
    super(e);
  }
}
function mu(t) {
  if (!(t instanceof wt))
    throw new TypeError("JacobianPoint expected");
}
class wt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof lt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(lt.ZERO) ? wt.ZERO : new wt(e.x, e.y, Ct);
  }
  static toAffineBatch(e) {
    const n = $w(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return wt.toAffineBatch(e).map(wt.fromAffine);
  }
  equals(e) {
    mu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = D(s * s), u = D(a * a), h = D(n * u), l = D(i * c), g = D(D(r * a) * u), f = D(D(o * s) * c);
    return h === l && g === f;
  }
  negate() {
    return new wt(this.x, D(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = D(e * e), i = D(n * n), o = D(i * i), a = e + i, c = D(qn * (D(a * a) - s - o)), u = D(Ds * s), h = D(u * u), l = D(h - qn * c), g = D(u * (c - l) - wu * o), f = D(qn * n * r);
    return new wt(l, g, f);
  }
  add(e) {
    mu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === dt || o === dt)
      return this;
    if (n === dt || r === dt)
      return e;
    const c = D(s * s), u = D(a * a), h = D(n * u), l = D(i * c), g = D(D(r * a) * u), f = D(D(o * s) * c), y = D(l - h), w = D(f - g);
    if (y === dt)
      return w === dt ? this.double() : wt.ZERO;
    const $ = D(y * y), _ = D(y * $), U = D(h * $), b = D(w * w - _ - qn * U), v = D(w * (U - b) - g * _), A = D(s * a * y);
    return new wt(b, v, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = wt.ZERO;
    if (typeof e == "bigint" && e === dt)
      return n;
    let r = Au(e);
    if (r === Ct)
      return this;
    if (!mi) {
      let l = n, g = this;
      for (; r > dt; )
        r & Ct && (l = l.add(g)), g = g.double(), r >>= Ct;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = xi.splitScalar(r), c = n, u = n, h = this;
    for (; i > dt || a > dt; )
      i & Ct && (c = c.add(h)), a & Ct && (u = u.add(h)), h = h.double(), i >>= Ct, a >>= Ct;
    return s && (c = c.negate()), o && (u = u.negate()), u = new wt(D(u.x * xi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = mi ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(wt.BASE) && (n = lt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Pa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = wt.normalizeZ(s), Pa.set(n, s)));
    let i = wt.ZERO, o = wt.BASE;
    const a = 1 + (mi ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const f = g * c;
      let y = Number(e & u);
      e >>= l, y > c && (y -= h, e += Ct);
      const w = f, $ = f + Math.abs(y) - 1, _ = g % 2 !== 0, U = y < 0;
      y === 0 ? o = o.add(Si(_, s[w])) : i = i.add(Si(U, s[$]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Au(e), s, i;
    if (mi) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = xi.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: g, f } = this.wNAF(u, n);
      h = Si(o, h), g = Si(c, g), g = new wt(D(g.x * xi.beta), g.y, g.z), s = h.add(g), i = l.add(f);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return wt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(wt.ZERO);
    e == null && (e = i ? wu : vs(s));
    const o = e, a = D(o * o), c = D(a * o), u = D(n * a), h = D(r * c), l = D(s * o);
    if (i)
      return lt.ZERO;
    if (l !== Ct)
      throw new Error("invZ was invalid");
    return new lt(u, h);
  }
}
wt.BASE = new wt(xt.Gx, xt.Gy, Ct);
wt.ZERO = new wt(dt, Ct, dt);
function Si(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Pa = /* @__PURE__ */ new WeakMap();
class lt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Pa.delete(this);
  }
  hasEvenY() {
    return this.y % qn === dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = we(n ? e : e.subarray(1));
    if (!qi(r))
      throw new Error("Point is not on curve");
    const s = xu(r);
    let i = Aw(s);
    const o = (i & Ct) === Ct;
    n ? o && (i = D(-i)) : (e[0] & 1) === 1 !== o && (i = D(-i));
    const a = new lt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = we(e.subarray(1, He + 1)), r = we(e.subarray(He + 1, He * 2 + 1)), s = new lt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ye(e), r = n.length, s = n[0];
    if (r === He)
      return this.fromCompressedHex(n);
    if (r === no && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ro && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${no} compressed bytes or ${ro} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return lt.BASE.multiply(mr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Zh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Vc(Ye(e)), { n: a } = xt, c = r === 2 || r === 3 ? s + a : s, u = vs(c, a), h = D(-o * u, a), l = D(i * u, a), g = r & 1 ? "03" : "02", f = lt.fromHex(g + Wn(c)), y = lt.BASE.multiplyAndAddUnsafe(f, h, l);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return Xn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Wn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Wn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!qi(n) || !qi(r))
      throw new Error(e);
    const s = D(r * r), i = xu(n);
    if (D(s - i) !== dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new lt(this.x, D(-this.y));
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
    const s = wt.fromAffine(this), i = n === dt || n === Ct || this !== lt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = wt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(wt.ZERO) ? void 0 : a.toAffine();
  }
}
lt.BASE = new lt(xt.Gx, xt.Gy);
lt.ZERO = new lt(dt, dt);
function Su(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Eu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${us(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: we(n), left: t.subarray(e + 2) };
}
function mw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${us(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Eu(t.subarray(2)), { data: r, left: s } = Eu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${us(s)}`);
  return { r: e, s: r };
}
class ye {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? us(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ye(so(s.slice(0, 64)), so(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = mw(n ? e : Xn(e));
    return new ye(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!hs(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!hs(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = xt.n >> Ct;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ye(this.r, D(-this.s, xt.n)) : this;
  }
  toDERRawBytes() {
    return Xn(this.toDERHex());
  }
  toDERHex() {
    const e = Su(Hs(this.s)), n = Su(Hs(this.r)), r = e.length / 2, s = n.length / 2, i = Hs(r), o = Hs(s);
    return `30${Hs(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Xn(this.toCompactHex());
  }
  toCompactHex() {
    return Wn(this.r) + Wn(this.s);
  }
}
function Vn(...t) {
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
function us(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Sw[t[n]];
  return e;
}
const Ew = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Wn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(dt <= t && t < Ew))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function fs(t) {
  const e = Xn(Wn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Hs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function so(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Xn(t) {
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
function we(t) {
  return so(us(t));
}
function Ye(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Xn(t);
}
function Au(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && hs(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function D(t, e = xt.P) {
  const n = t % e;
  return n >= dt ? n : e + n;
}
function Ae(t, e) {
  const { P: n } = xt;
  let r = t;
  for (; e-- > dt; )
    r *= r, r %= n;
  return r;
}
function Aw(t) {
  const { P: e } = xt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Ae(u, Ds) * u % e, l = Ae(h, Ds) * u % e, g = Ae(l, qn) * c % e, f = Ae(g, r) * g % e, y = Ae(f, s) * f % e, w = Ae(y, o) * y % e, $ = Ae(w, a) * w % e, _ = Ae($, o) * y % e, U = Ae(_, Ds) * u % e, b = Ae(U, i) * f % e, v = Ae(b, n) * c % e, A = Ae(v, qn);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function vs(t, e = xt.P) {
  if (t === dt || e <= dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = D(t, e), r = e, s = dt, i = Ct;
  for (; n !== dt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Ct)
    throw new Error("invert: does not exist");
  return D(s, e);
}
function $w(t, e = xt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === dt ? i : (n[a] = i, D(i * o, e)), Ct), s = vs(r, e);
  return t.reduceRight((i, o, a) => o === dt ? i : (n[a] = D(i * n[a], e), D(i * o, e)), s), n;
}
function Iw(t) {
  const e = t.length * 8 - xr * 8, n = we(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Vc(t, e = !1) {
  const n = Iw(t);
  if (e)
    return n;
  const { n: r } = xt;
  return n >= r ? n - r : n;
}
let is, Fs;
class Xh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ht.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Fs(this.k, ...e);
  }
  checkSync() {
    if (typeof Fs != "function")
      throw new Gc("hmacSha256Sync needs to be set");
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
    return Vn(...n);
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
    return Vn(...n);
  }
}
function hs(t) {
  return dt < t && t < xt.n;
}
function qi(t) {
  return dt < t && t < xt.P;
}
function Yh(t, e, n, r = !0) {
  const { n: s } = xt, i = Vc(t, !0);
  if (!hs(i))
    return;
  const o = vs(i, s), a = lt.BASE.multiply(i), c = D(a.x, s);
  if (c === dt)
    return;
  const u = D(o * D(e + n * c, s), s);
  if (u === dt)
    return;
  let h = new ye(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & Ct);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function mr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * xr)
      throw new Error("Expected 32 bytes of private key");
    e = so(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== xr)
      throw new Error("Expected 32 bytes of private key");
    e = we(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!hs(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Kc(t) {
  return t instanceof lt ? (t.assertValidity(), t) : lt.fromHex(t);
}
function Zh(t) {
  if (t instanceof ye)
    return t.assertValidity(), t;
  try {
    return ye.fromDER(t);
  } catch {
    return ye.fromCompact(t);
  }
}
function ai(t, e = !1) {
  return lt.fromPrivateKey(t).toRawBytes(e);
}
function vw(t, e, n, r = !1) {
  return lt.fromSignature(t, e, n).toRawBytes(r);
}
function $u(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === no || r === ro : n ? r === no * 2 || r === ro * 2 : t instanceof lt;
}
function qc(t, e, n = !1) {
  if ($u(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!$u(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Kc(e);
  return r.assertValidity(), r.multiply(mr(t)).toRawBytes(n);
}
function Qh(t) {
  const e = t.length > He ? t.slice(0, He) : t;
  return we(e);
}
function Lw(t) {
  const e = Qh(t), n = D(e, xt.n);
  return Jh(n < dt ? e : n);
}
function Jh(t) {
  return fs(t);
}
function td(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ye(t), s = mr(e), i = [Jh(s), Lw(r)];
  if (n != null) {
    n === !0 && (n = Ht.randomBytes(He));
    const c = Ye(n);
    if (c.length !== He)
      throw new Error(`sign: Expected ${He} bytes of extra data`);
    i.push(c);
  }
  const o = Vn(...i), a = Qh(r);
  return { seed: o, m: a, d: s };
}
function ed(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Cw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = td(t, e, n.extraEntropy), o = new Xh(Wh, xr);
  await o.reseed(r);
  let a;
  for (; !(a = Yh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return ed(a, n);
}
function To(t, e, n = {}) {
  const { seed: r, m: s, d: i } = td(t, e, n.extraEntropy), o = new Xh(Wh, xr);
  o.reseedSync(r);
  let a;
  for (; !(a = Yh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return ed(a, n);
}
const Bw = { strict: !0 };
function kw(t, e, n, r = Bw) {
  let s;
  try {
    s = Zh(t), e = Ye(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Vc(e);
  let c;
  try {
    c = Kc(n);
  } catch {
    return !1;
  }
  const { n: u } = xt, h = vs(o, u), l = D(a * h, u), g = D(i * h, u), f = lt.BASE.multiplyAndAddUnsafe(c, l, g);
  return f ? D(f.x, u) === i : !1;
}
function io(t) {
  return D(we(t), xt.n);
}
class ds {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ye(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = we(n.subarray(0, 32)), s = we(n.subarray(32, 64));
    return new ds(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!qi(e) || !hs(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Wn(this.r) + Wn(this.s);
  }
  toRawBytes() {
    return Xn(this.toHex());
  }
}
function Mw(t) {
  return lt.fromPrivateKey(t).toRawX();
}
class nd {
  constructor(e, n, r = Ht.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ye(e);
    const { x: s, scalar: i } = this.getScalar(mr(n));
    if (this.px = s, this.d = i, this.rand = Ye(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = lt.fromPrivateKey(e), r = n.hasEvenY() ? e : xt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return fs(e ^ we(n));
  }
  finalizeNonce(e) {
    const n = D(we(e), xt.n);
    if (n === dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new ds(e.x, D(n + r * s, xt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ht.taggedHash, o = this.initNonce(n, await i(Gn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Gn.nonce, o, r, e)), h = io(await i(Gn.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await id(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ht.taggedHashSync, o = this.initNonce(n, i(Gn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Gn.nonce, o, r, e)), h = io(i(Gn.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return od(l, e, r) || this.error(), l;
  }
}
async function Tw(t, e, n) {
  return new nd(t, e, n).calc();
}
function _w(t, e, n) {
  return new nd(t, e, n).calcSync();
}
function rd(t, e, n) {
  const r = t instanceof ds, s = r ? t : ds.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ye(e),
    P: Kc(n)
  };
}
function sd(t, e, n, r) {
  const s = lt.BASE.multiplyAndAddUnsafe(e, mr(n), D(-r, xt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function id(t, e, n) {
  try {
    const { r, s, m: i, P: o } = rd(t, e, n), a = io(await Ht.taggedHash(Gn.challenge, fs(r), o.toRawX(), i));
    return sd(r, o, s, a);
  } catch {
    return !1;
  }
}
function od(t, e, n) {
  try {
    const { r, s, m: i, P: o } = rd(t, e, n), a = io(Ht.taggedHashSync(Gn.challenge, fs(r), o.toRawX(), i));
    return sd(r, o, s, a);
  } catch (r) {
    if (r instanceof Gc)
      throw r;
    return !1;
  }
}
const Uw = {
  Signature: ds,
  getPublicKey: Mw,
  sign: Tw,
  verify: id,
  signSync: _w,
  verifySync: od
};
lt.BASE._setWindowSize(8);
const fe = {
  node: qh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Gn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ei = {}, Ht = {
  bytesToHex: us,
  hexToBytes: Xn,
  concatBytes: Vn,
  mod: D,
  invert: vs,
  isValidPrivateKey(t) {
    try {
      return mr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: fs,
  _normalizePrivateKey: mr,
  hashToPrivateKey: (t) => {
    t = Ye(t);
    const e = xr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = D(we(t), xt.n - Ct) + Ct;
    return fs(n);
  },
  randomBytes: (t = 32) => {
    if (fe.web)
      return fe.web.getRandomValues(new Uint8Array(t));
    if (fe.node) {
      const { randomBytes: e } = fe.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ht.hashToPrivateKey(Ht.randomBytes(xr + 8)),
  precompute(t = 8, e = lt.BASE) {
    const n = e === lt.BASE ? e : new lt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ds), n;
  },
  sha256: async (...t) => {
    if (fe.web) {
      const e = await fe.web.subtle.digest("SHA-256", Vn(...t));
      return new Uint8Array(e);
    } else if (fe.node) {
      const { createHash: e } = fe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (fe.web) {
      const n = await fe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Vn(...e), s = await fe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (fe.node) {
      const { createHmac: n } = fe.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ei[t];
    if (n === void 0) {
      const r = await Ht.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Vn(r, r), Ei[t] = n;
    }
    return Ht.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof is != "function")
      throw new Gc("sha256Sync is undefined, you need to set it");
    let n = Ei[t];
    if (n === void 0) {
      const r = is(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Vn(r, r), Ei[t] = n;
    }
    return is(n, ...e);
  },
  _JacobianPoint: wt
};
Object.defineProperties(Ht, {
  sha256Sync: {
    configurable: !1,
    get() {
      return is;
    },
    set(t) {
      is || (is = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Fs;
    },
    set(t) {
      Fs || (Fs = t);
    }
  }
});
const Hw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: xt,
  Point: lt,
  Signature: ye,
  getPublicKey: ai,
  getSharedSecret: qc,
  recoverPublicKey: vw,
  schnorr: Uw,
  sign: Cw,
  signSync: To,
  utils: Ht,
  verify: kw
}, Symbol.toStringTag, { value: "Module" }));
var ci = {};
ci.byteLength = Fw;
var Nw = ci.toByteArray = zw, Pw = ci.fromByteArray = Vw, Ge = [], Ie = [], Ow = typeof Uint8Array < "u" ? Uint8Array : Array, ha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Xr = 0, Dw = ha.length; Xr < Dw; ++Xr)
  Ge[Xr] = ha[Xr], Ie[ha.charCodeAt(Xr)] = Xr;
Ie[45] = 62;
Ie[95] = 63;
function ad(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Fw(t) {
  var e = ad(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function jw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function zw(t) {
  var e, n = ad(t), r = n[0], s = n[1], i = new Ow(jw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ie[t.charCodeAt(c)] << 18 | Ie[t.charCodeAt(c + 1)] << 12 | Ie[t.charCodeAt(c + 2)] << 6 | Ie[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Ie[t.charCodeAt(c)] << 2 | Ie[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Ie[t.charCodeAt(c)] << 10 | Ie[t.charCodeAt(c + 1)] << 4 | Ie[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Rw(t) {
  return Ge[t >> 18 & 63] + Ge[t >> 12 & 63] + Ge[t >> 6 & 63] + Ge[t & 63];
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
    Ge[e >> 2] + Ge[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ge[e >> 10] + Ge[e >> 4 & 63] + Ge[e << 2 & 63] + "="
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
    const i = this.createCipher(e, n, r), o = new Uint8Array(Xe(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Xe(i.update(s), i.final()));
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
async function cd() {
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
    for (var y = 0, w = 0, $ = 0, _ = f.length; $ !== _ && f[$] === 0; )
      $++, y++;
    for (var U = (_ - $) * u + 1 >>> 0, b = new Uint8Array(U); $ !== _; ) {
      for (var v = f[$], A = 0, P = U - 1; (v !== 0 || A < w) && P !== -1; P--, A++)
        v += 256 * b[P] >>> 0, b[P] = v % o >>> 0, v = v / o >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      w = A, $++;
    }
    for (var G = U - w; G !== U && b[G] === 0; )
      G++;
    for (var O = a.repeat(y); G < U; ++G)
      O += t.charAt(b[G]);
    return O;
  }
  function l(f) {
    if (typeof f != "string")
      throw new TypeError("Expected String");
    if (f.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, $ = 0; f[y] === a; )
      w++, y++;
    for (var _ = (f.length - y) * c + 1 >>> 0, U = new Uint8Array(_); f[y]; ) {
      var b = f.charCodeAt(y);
      if (b > 255)
        return;
      var v = e[b];
      if (v === 255)
        return;
      for (var A = 0, P = _ - 1; (v !== 0 || A < $) && P !== -1; P--, A++)
        v += o * U[P] >>> 0, U[P] = v % 256 >>> 0, v = v / 256 >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      $ = A, y++;
    }
    for (var G = _ - $; G !== _ && U[G] === 0; )
      G++;
    for (var O = new Uint8Array(w + (_ - G)), R = w; G !== _; )
      O[R++] = U[G++];
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
var ld = Zw;
const Qw = ld, Jw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var t1 = Qw(Jw);
const e1 = /* @__PURE__ */ Th(t1), n1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ud = Uint8Array.from({ length: 16 }, (t, e) => e), r1 = ud.map((t) => (9 * t + 5) % 16);
let Wc = [ud], Xc = [r1];
for (let t = 0; t < 4; t++)
  for (let e of [Wc, Xc])
    e.push(e[t].map((n) => n1[n]));
const fd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s1 = Wc.map((t, e) => t.map((n) => fd[e][n])), i1 = Xc.map((t, e) => t.map((n) => fd[e][n])), o1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ai = (t, e) => t << e | t >>> 32 - e;
function Iu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const $i = new Uint32Array(16);
let c1 = class extends Rc {
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
      $i[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = o1[f], $ = a1[f], _ = Wc[f], U = Xc[f], b = s1[f], v = i1[f];
      for (let A = 0; A < 16; A++) {
        const P = Ai(r + Iu(f, i, a, u) + $i[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Ai(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Ai(s + Iu(y, o, c, h) + $i[U[A]] + $, v[A]) + g | 0;
        s = g, g = h, h = Ai(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    $i.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const l1 = Nr(() => new c1());
function u1(t) {
  return l1(t);
}
const Ii = BigInt(2 ** 32 - 1), Oa = BigInt(32);
function hd(t, e = !1) {
  return e ? { h: Number(t & Ii), l: Number(t >> Oa & Ii) } : { h: Number(t >> Oa & Ii) | 0, l: Number(t & Ii) | 0 };
}
function f1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const h1 = (t, e) => BigInt(t >>> 0) << Oa | BigInt(e >>> 0), d1 = (t, e, n) => t >>> n, p1 = (t, e, n) => t << 32 - n | e >>> n, g1 = (t, e, n) => t >>> n | e << 32 - n, y1 = (t, e, n) => t << 32 - n | e >>> n, w1 = (t, e, n) => t << 64 - n | e >>> n - 32, b1 = (t, e, n) => t >>> n - 32 | e << 64 - n, x1 = (t, e) => e, m1 = (t, e) => t, S1 = (t, e, n) => t << n | e >>> 32 - n, E1 = (t, e, n) => e << n | t >>> 32 - n, A1 = (t, e, n) => e << n - 32 | t >>> 64 - n, $1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function I1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const v1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), B1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, k1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), M1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
  fromBig: hd,
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
  add: I1,
  add3L: v1,
  add3H: L1,
  add4L: C1,
  add4H: B1,
  add5H: M1,
  add5L: k1
}, [T1, _1] = rt.split([
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
].map((t) => BigInt(t))), En = new Uint32Array(80), An = new Uint32Array(80);
let _o = class extends Rc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      En[b] = e.getUint32(n), An[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = En[b - 15] | 0, A = An[b - 15] | 0, P = rt.rotrSH(v, A, 1) ^ rt.rotrSH(v, A, 8) ^ rt.shrSH(v, A, 7), G = rt.rotrSL(v, A, 1) ^ rt.rotrSL(v, A, 8) ^ rt.shrSL(v, A, 7), O = En[b - 2] | 0, R = An[b - 2] | 0, x = rt.rotrSH(O, R, 19) ^ rt.rotrBH(O, R, 61) ^ rt.shrSH(O, R, 6), L = rt.rotrSL(O, R, 19) ^ rt.rotrBL(O, R, 61) ^ rt.shrSL(O, R, 6), N = rt.add4L(G, L, An[b - 7], An[b - 16]), q = rt.add4H(N, P, x, En[b - 7], En[b - 16]);
      En[b] = q | 0, An[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const v = rt.rotrSH(l, g, 14) ^ rt.rotrSH(l, g, 18) ^ rt.rotrBH(l, g, 41), A = rt.rotrSL(l, g, 14) ^ rt.rotrSL(l, g, 18) ^ rt.rotrBL(l, g, 41), P = l & f ^ ~l & w, G = g & y ^ ~g & $, O = rt.add5L(U, A, G, _1[b], An[b]), R = rt.add5H(O, _, v, P, T1[b], En[b]), x = O | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), N = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      _ = w | 0, U = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = rt.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = rt.add3L(x, N, Y);
      r = rt.add3H(j, R, L, q), s = j | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = rt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = rt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: _, l: U } = rt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, _, U);
  }
  roundClean() {
    En.fill(0), An.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, U1 = class extends _o {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, H1 = class extends _o {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N1 = class extends _o {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const P1 = Nr(() => new _o());
Nr(() => new U1());
Nr(() => new H1());
Nr(() => new N1());
function dd(t) {
  return ls(t);
}
function O1(t) {
  return P1(t);
}
const D1 = 0;
Ht.hmacSha256Sync = (t, ...e) => {
  const n = Mo.create(ls, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F1() {
  return Z(Ht.randomPrivateKey());
}
function j1(t) {
  const e = ls(ls(t));
  return e1.encode(Xe(t, e).slice(0, t.length + 4));
}
function z1(t, e) {
  return j1(Xe(new Uint8Array([t]), e.slice(0, 20)));
}
function pd(t, e = D1) {
  const n = typeof t == "string" ? pt(t) : t, r = u1(dd(n));
  return z1(e, r);
}
function gd(t) {
  const e = jc(t);
  return Z(ai(e.slice(0, 32), !0));
}
Ht.hmacSha256Sync = (t, ...e) => {
  const n = Mo.create(ls, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var oo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(oo || (oo = {}));
async function R1(t, e, n) {
  return await (await cd()).encrypt("aes-256-cbc", e, t, n);
}
async function G1(t, e, n) {
  return await (await cd()).decrypt("aes-256-cbc", e, t, n);
}
function yd(t, e) {
  return Mo(ls, t, e);
}
function V1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function wd(t) {
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
    reason: oo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: oo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !K1(t))
    return e;
  try {
    return lt.fromHex(t).assertValidity(), {
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
  const i = Ht.randomPrivateKey(), o = ai(i, !0);
  let a = qc(i, t, !0);
  a = a.slice(1);
  const c = wd(a), u = Ht.randomBytes(16), h = await R1(u, c.encryptionKey, e), l = Xe(u, o, h), g = yd(c.hmacKey, l);
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
async function bd(t, e) {
  if (!e.ephemeralPK)
    throw new du("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = qc(t, n, !0);
  r = r.slice(1);
  const s = wd(r), i = pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Nw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Xe(i, pt(n), o), c = yd(s.hmacKey, a), u = pt(e.mac);
  if (!V1(u, c))
    throw new du("Decryption failed: failure in MAC check");
  const h = await G1(i, s.encryptionKey, o);
  return e.wasString ? oi(h) : h;
}
function X1(t, e) {
  const n = typeof e == "string" ? Hr(e) : e, r = gd(t), s = dd(n), i = To(s, t);
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
    n.publicKey = gd(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Hr(t) : t, o = await W1(n.publicKey, i, s, n.cipherTextEncoding);
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
    return bd(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var qt = {}, ps = {}, Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.decode = Jt.encode = Jt.unescape = Jt.escape = Jt.pad = void 0;
const xd = ci;
function Yc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Jt.pad = Yc;
function md(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Jt.escape = md;
function Sd(t) {
  return Yc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Jt.unescape = Sd;
function Q1(t) {
  return md((0, xd.fromByteArray)(new TextEncoder().encode(t)));
}
Jt.encode = Q1;
function J1(t) {
  return new TextDecoder().decode((0, xd.toByteArray)(Yc(Sd(t))));
}
Jt.decode = J1;
var Uo = {}, Ho = {}, Ed = {}, Ad = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.crypto = void 0;
No.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = g, t.rotl = f, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = U, t.hexToBytes = A, t.asyncLoop = G, t.utf8ToBytes = O, t.bytesToUtf8 = R, t.toBytes = x, t.kdfInputToBytes = L, t.concatBytes = N, t.checkOpts = q, t.createHasher = j, t.createOptHasher = Yt, t.createXOFer = Rt, t.randomBytes = Zt;
  const e = No;
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
    const tt = B.outputLen;
    if (m.length < tt)
      throw new Error("digestInto() expects output buffer of length at least " + tt);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function u(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function h(...m) {
    for (let B = 0; B < m.length; B++)
      m[B].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, B) {
    return m << 32 - B | m >>> B;
  }
  function f(m, B) {
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
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (m, B) => B.toString(16).padStart(2, "0"));
  function U(m) {
    if (s(m), $)
      return m.toHex();
    let B = "";
    for (let tt = 0; tt < m.length; tt++)
      B += _[m[tt]];
    return B;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function v(m) {
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
    if ($)
      return Uint8Array.fromHex(m);
    const B = m.length, tt = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const gt = new Uint8Array(tt);
    for (let ht = 0, Et = 0; ht < tt; ht++, Et += 2) {
      const re = v(m.charCodeAt(Et)), tn = v(m.charCodeAt(Et + 1));
      if (re === void 0 || tn === void 0) {
        const gn = m[Et] + m[Et + 1];
        throw new Error('hex string expected, got non-hex character "' + gn + '" at index ' + Et);
      }
      gt[ht] = re * 16 + tn;
    }
    return gt;
  }
  const P = async () => {
  };
  t.nextTick = P;
  async function G(m, B, tt) {
    let gt = Date.now();
    for (let ht = 0; ht < m; ht++) {
      tt(ht);
      const Et = Date.now() - gt;
      Et >= 0 && Et < B || (await (0, t.nextTick)(), gt += Et);
    }
  }
  function O(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function R(m) {
    return new TextDecoder().decode(m);
  }
  function x(m) {
    return typeof m == "string" && (m = O(m)), s(m), m;
  }
  function L(m) {
    return typeof m == "string" && (m = O(m)), s(m), m;
  }
  function N(...m) {
    let B = 0;
    for (let gt = 0; gt < m.length; gt++) {
      const ht = m[gt];
      s(ht), B += ht.length;
    }
    const tt = new Uint8Array(B);
    for (let gt = 0, ht = 0; gt < m.length; gt++) {
      const Et = m[gt];
      tt.set(Et, ht), ht += Et.length;
    }
    return tt;
  }
  function q(m, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, B);
  }
  class Y {
  }
  t.Hash = Y;
  function j(m) {
    const B = (gt) => m().update(x(gt)).digest(), tt = m();
    return B.outputLen = tt.outputLen, B.blockLen = tt.blockLen, B.create = () => m(), B;
  }
  function Yt(m) {
    const B = (gt, ht) => m(ht).update(x(gt)).digest(), tt = m({});
    return B.outputLen = tt.outputLen, B.blockLen = tt.blockLen, B.create = (gt) => m(gt), B;
  }
  function Rt(m) {
    const B = (gt, ht) => m(ht).update(x(gt)).digest(), tt = m({});
    return B.outputLen = tt.outputLen, B.blockLen = tt.blockLen, B.create = (gt) => m(gt), B;
  }
  t.wrapConstructor = j, t.wrapConstructorWithOpts = Yt, t.wrapXOFConstructorWithOpts = Rt;
  function Zt(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Ad);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Ad;
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
})(Ed);
const Yr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function $d(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Da(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Pr(t, ...e) {
  if (!$d(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function tb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Da(t.outputLen), Da(t.blockLen);
}
function Fa(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Id(t, e) {
  Pr(t);
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
function ao(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Wi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function ke(t, e) {
  return t << 32 - e | t >>> e;
}
function rb(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Zc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Qc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const vd = Zc ? (t) => t : (t) => Qc(t), sb = vd;
function Ld(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Qc(t[e]);
  return t;
}
const ib = Zc ? (t) => t : Ld, Cd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ob = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ab(t) {
  if (Pr(t), Cd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ob[t[n]];
  return e;
}
const sn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function vu(t) {
  if (t >= sn._0 && t <= sn._9)
    return t - sn._0;
  if (t >= sn.A && t <= sn.F)
    return t - (sn.A - 10);
  if (t >= sn.a && t <= sn.f)
    return t - (sn.a - 10);
}
function cb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Cd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = vu(t.charCodeAt(i)), a = vu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Bd = async () => {
};
async function lb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Bd(), r += i);
  }
}
function Jc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ub(t) {
  return new TextDecoder().decode(t);
}
function li(t) {
  return typeof t == "string" && (t = Jc(t)), Pr(t), t;
}
function fb(t) {
  return typeof t == "string" && (t = Jc(t)), Pr(t), t;
}
function hb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Pr(s), e += s.length;
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
let kd = class {
};
function Po(t) {
  const e = (r) => t().update(li(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Md(t) {
  const e = (r, s) => t(s).update(li(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Td(t) {
  const e = (r, s) => t(s).update(li(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const pb = Po, gb = Md, yb = Td;
function wb(t = 32) {
  if (Yr && typeof Yr.getRandomValues == "function")
    return Yr.getRandomValues(new Uint8Array(t));
  if (Yr && typeof Yr.randomBytes == "function")
    return Uint8Array.from(Yr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: kd,
  abytes: Pr,
  aexists: Fa,
  ahash: tb,
  anumber: Da,
  aoutput: Id,
  asyncLoop: lb,
  byteSwap: Qc,
  byteSwap32: Ld,
  byteSwapIfBE: sb,
  bytesToHex: ab,
  bytesToUtf8: ub,
  checkOpts: db,
  clean: ao,
  concatBytes: hb,
  createHasher: Po,
  createOptHasher: Md,
  createView: Wi,
  createXOFer: Td,
  hexToBytes: cb,
  isBytes: $d,
  isLE: Zc,
  kdfInputToBytes: fb,
  nextTick: Bd,
  randomBytes: wb,
  rotl: rb,
  rotr: ke,
  swap32IfBE: ib,
  swap8IfBE: vd,
  toBytes: li,
  u32: nb,
  u8: eb,
  utf8ToBytes: Jc,
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
class Eb extends kd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Wi(this.buffer);
  }
  update(e) {
    Fa(this), e = li(e), Pr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Wi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fa(this), Id(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, ao(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    xb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Wi(e), c = this.outputLen;
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
const $n = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), In = /* @__PURE__ */ Uint32Array.from([
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
]), vn = /* @__PURE__ */ new Uint32Array(64);
let tl = class extends Eb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = $n[0] | 0, this.B = $n[1] | 0, this.C = $n[2] | 0, this.D = $n[3] | 0, this.E = $n[4] | 0, this.F = $n[5] | 0, this.G = $n[6] | 0, this.H = $n[7] | 0;
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
      vn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = vn[l - 15], f = vn[l - 2], y = ke(g, 7) ^ ke(g, 18) ^ g >>> 3, w = ke(f, 17) ^ ke(f, 19) ^ f >>> 10;
      vn[l] = w + vn[l - 7] + y + vn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = ke(a, 6) ^ ke(a, 11) ^ ke(a, 25), f = h + g + mb(a, c, u) + Ab[l] + vn[l] | 0, w = (ke(r, 2) ^ ke(r, 13) ^ ke(r, 22)) + Sb(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ao(vn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ao(this.buffer);
  }
}, _d = class extends tl {
  constructor() {
    super(28), this.A = In[0] | 0, this.B = In[1] | 0, this.C = In[2] | 0, this.D = In[3] | 0, this.E = In[4] | 0, this.F = In[5] | 0, this.G = In[6] | 0, this.H = In[7] | 0;
  }
};
const $b = /* @__PURE__ */ Po(() => new tl()), Ib = /* @__PURE__ */ Po(() => new _d()), vb = tl, Lb = $b, Cb = _d, Bb = Ib, kb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Cb,
  SHA256: vb,
  sha224: Bb,
  sha256: Lb
}, Symbol.toStringTag, { value: "Module" })), Oo = /* @__PURE__ */ Bo(kb), Mb = /* @__PURE__ */ Bo(Hw);
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
gs.joseToDer = gs.derToJose = void 0;
const Ud = ci, Hd = Jt;
function da(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Tb = {
  ES256: da(256),
  ES384: da(384),
  ES512: da(521)
};
function Nd(t) {
  const e = Tb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const co = 128, Pd = 0, _b = 32, Ub = 16, Hb = 2, Od = Ub | _b | Pd << 6, lo = Hb | Pd << 6;
function Dd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ud.toByteArray)((0, Hd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Nb(t, e) {
  const n = Dd(t), r = Nd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Od)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (co | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== lo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== lo)
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
  return y.set(n.subarray(l + Math.max(-f, 0), l + h), o), (0, Hd.escape)((0, Ud.fromByteArray)(y));
}
gs.derToJose = Nb;
function Lu(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= co && --r, r;
}
function Pb(t, e) {
  t = Dd(t);
  const n = Nd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Lu(t, 0, n), i = Lu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < co, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Od, u ? h[l++] = c : (h[l++] = co | 1, h[l++] = c & 255), h[l++] = lo, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = lo, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
gs.joseToDer = Pb;
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.InvalidTokenError = hn.MissingParametersError = void 0;
class Ob extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
hn.MissingParametersError = Ob;
class Db extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
hn.InvalidTokenError = Db;
const ui = /* @__PURE__ */ Bo(bb);
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.SECP256K1Client = void 0;
const Fb = Ed, jb = Oo, Xi = Mb, Cu = gs, Bu = hn, ku = ui;
Xi.utils.hmacSha256Sync = (t, ...e) => {
  const n = Fb.hmac.create(jb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fd {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ku.bytesToHex)(Xi.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Bu.MissingParametersError("a signing input hash and private key are all required");
    const s = Xi.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ku.bytesToHex)(s);
    if (r === "jose")
      return (0, Cu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Cu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Bu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Xi.verify(n, e, r, { strict: !1 });
  }
}
Ho.SECP256K1Client = Fd;
Fd.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ho;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Uo);
var Sr = {};
const zb = /* @__PURE__ */ Bo(qh);
var Rb = ee && ee.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.hashSha256Async = Sr.hashSha256 = void 0;
const Gb = Oo;
function jd(t) {
  return (0, Gb.sha256)(t);
}
Sr.hashSha256 = jd;
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
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jd(t));
    }
  });
}
Sr.hashSha256Async = Vb;
var Kb = ee && ee.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ps, "__esModule", { value: !0 });
ps.TokenSigner = ps.createUnsecuredToken = void 0;
const ja = Jt, Mu = Uo, qb = hn, Tu = Sr;
function za(t, e) {
  const n = [], r = ja.encode(JSON.stringify(e));
  n.push(r);
  const s = ja.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Wb(t) {
  return za(t, { typ: "JWT", alg: "none" }) + ".";
}
ps.createUnsecuredToken = Wb;
class Xb {
  constructor(e, n) {
    if (!(e && n))
      throw new qb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Mu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Mu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = za(e, s), o = (0, Tu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Kb(this, void 0, void 0, function* () {
      const s = this.header(r), i = za(e, s), o = yield (0, Tu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ja.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
ps.TokenSigner = Xb;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
Do.TokenVerifier = void 0;
const Yb = Jt, _u = Uo, Zb = hn, vi = Sr;
class Qb {
  constructor(e, n) {
    if (!(e && n))
      throw new Zb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !_u.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = _u.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, vi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, vi.hashSha256)(s);
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
      return (0, vi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, vi.hashSha256)(r);
      return i(o);
    }
  }
}
Do.TokenVerifier = Qb;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
Fo.decodeToken = void 0;
const Li = Jt;
function Jb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Li.decode(e[0])), r = JSON.parse(Li.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Li.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Li.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Fo.decodeToken = Jb;
(function(t) {
  var e = ee && ee.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ee && ee.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ps, t), n(Do, t), n(Fo, t), n(hn, t), n(Uo, t);
})(qt);
function t2(t) {
  return `did:btc-addr:${t}`;
}
function e2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new hu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new hu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function zd(t) {
  if (t)
    return e2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const n2 = "1.4.0";
function r2() {
  return F1();
}
function s2(t, e, n, r = Ph.slice(), s, i = Py().getTime(), o = {}) {
  const a = (f) => {
    const y = Dc("location", {
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
  }), u = qt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = pd(u);
  return c.iss = t2(h), new qt.TokenSigner("ES256k", t).sign(c);
}
async function Uu(t, e) {
  const n = oi(pt(e)), r = JSON.parse(n), s = await bd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function i2(t) {
  const e = qt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new qt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function o2(t) {
  const e = qt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = zd(e.iss);
  if (n.length === 1) {
    if (pd(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function a2(t) {
  const e = qt.decodeToken(t).payload;
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
  const e = qt.decodeToken(t).payload;
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
const Hu = "1.0.0";
class Yn {
  constructor(e) {
    this.version = Hu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Hu)
      throw new _a(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Yn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Rd {
  constructor(e) {
    if (e) {
      const n = new Yn(e);
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
class Nu extends Rd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Yn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Oh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Yn({})), !0;
  }
}
class Pu extends Rd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Uy, !localStorage.getItem(this.key)) {
      const r = new Yn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Oh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Yn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Yn({})), !0;
  }
}
var qs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(qs || (qs = {}));
var uo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(uo || (uo = {}));
qs.Mainnet;
var un;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(un || (un = {}));
var Ke;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ke || (Ke = {}));
un.Mainnet;
const Gd = {
  chainId: qs.Mainnet,
  transactionVersion: un.Mainnet,
  peerNetworkId: uo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ke.MainnetSingleSig,
    multiSig: Ke.MainnetMultiSig
  },
  client: { baseUrl: Dh }
}, Ra = {
  chainId: qs.Testnet,
  transactionVersion: un.Testnet,
  peerNetworkId: uo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ke.TestnetSingleSig,
    multiSig: Ke.TestnetMultiSig
  },
  client: { baseUrl: Fh }
}, Yi = {
  ...Ra,
  addressVersion: { ...Ra.addressVersion },
  magicBytes: "id",
  client: { baseUrl: jh }
}, u2 = {
  ...Yi,
  addressVersion: { ...Yi.addressVersion },
  client: { ...Yi.client }
};
function f2(t) {
  switch (t) {
    case "mainnet":
      return Gd;
    case "testnet":
      return Ra;
    case "devnet":
      return Yi;
    case "mocknet":
      return u2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Vd(t) {
  return typeof t == "string" ? f2(t) : t;
}
var Ou;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ou || (Ou = {}));
var Du;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Du || (Du = {}));
var Me;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Me || (Me = {}));
const pa = ["onChainOnly", "offChainOnly", "any"];
pa[0] + "", Me.OnChainOnly, pa[1] + "", Me.OffChainOnly, pa[2] + "", Me.Any, Me.OnChainOnly + "", Me.OnChainOnly, Me.OffChainOnly + "", Me.OffChainOnly, Me.Any + "", Me.Any;
var Fu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Fu || (Fu = {}));
var ju;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ju || (ju = {}));
var zu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(zu || (zu = {}));
var cn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(cn || (cn = {}));
var Ru;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ru || (Ru = {}));
var Gu;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gu || (Gu = {}));
var Vu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Vu || (Vu = {}));
var Ku;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ku || (Ku = {}));
var qu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qu || (qu = {}));
var Wu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wu || (Wu = {}));
var Xu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Xu || (Xu = {}));
var Yu;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Yu || (Yu = {}));
var Zu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Zu || (Zu = {}));
function Ga(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function d2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ga(t.outputLen), Ga(t.blockLen);
}
function p2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function g2(t, e) {
  Kd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lr = {
  number: Ga,
  bool: h2,
  bytes: Kd,
  hash: d2,
  exists: p2,
  output: g2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ga = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Fe = (t, e) => t << 32 - e | t >>> e, y2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!y2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function w2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function el(t) {
  if (typeof t == "string" && (t = w2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Or(t) {
  const e = (r) => t().update(el(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Wd = class extends qd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, lr.hash(e);
    const r = el(n);
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
    return lr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    lr.exists(this), lr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Xd = (t, e, n) => new Wd(t, e).update(n).digest();
Xd.create = (t, e) => new Wd(t, e);
function b2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let nl = class extends qd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ga(this.buffer);
  }
  update(e) {
    lr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = el(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ga(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    lr.exists(this), lr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    b2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ga(e), c = this.outputLen;
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
]), Ln = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Cn = new Uint32Array(64);
let Yd = class extends nl {
  constructor() {
    super(64, 32, 8, !1), this.A = Ln[0] | 0, this.B = Ln[1] | 0, this.C = Ln[2] | 0, this.D = Ln[3] | 0, this.E = Ln[4] | 0, this.F = Ln[5] | 0, this.G = Ln[6] | 0, this.H = Ln[7] | 0;
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
      Cn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Cn[l - 15], f = Cn[l - 2], y = Fe(g, 7) ^ Fe(g, 18) ^ g >>> 3, w = Fe(f, 17) ^ Fe(f, 19) ^ f >>> 10;
      Cn[l] = w + Cn[l - 7] + y + Cn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Fe(a, 6) ^ Fe(a, 11) ^ Fe(a, 25), f = h + g + x2(a, c, u) + S2[l] + Cn[l] | 0, w = (Fe(r, 2) ^ Fe(r, 13) ^ Fe(r, 22)) + m2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Cn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E2 = class extends Yd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zd = Or(() => new Yd());
Or(() => new E2());
var Dr = {}, rl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ui;
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
        const $ = 1 + u, _ = w % (1 << $) << 5 - $, U = t.c32[y + _];
        u = $, c.unshift(U);
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
      const _ = (t.c32.indexOf(o[w]) << g) + l, U = n[_ % 16];
      if (g += 1, l = _ >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      h.unshift(U);
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
      for (let $ = 0; $ < w; $ += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(rl);
var Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.c32checkDecode = Er.c32checkEncode = void 0;
const Qu = Oo, Ju = ui, js = rl;
function Qd(t) {
  const e = (0, Qu.sha256)((0, Qu.sha256)((0, Ju.hexToBytes)(t)));
  return (0, Ju.bytesToHex)(e.slice(0, 4));
}
function A2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Qd(`${n}${e}`), s = (0, js.c32encode)(`${e}${r}`);
  return `${js.c32[t]}${s}`;
}
Er.c32checkEncode = A2;
function $2(t) {
  t = (0, js.c32normalize)(t);
  const e = (0, js.c32decode)(t.slice(1)), n = t[0], r = js.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Qd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Er.c32checkDecode = $2;
var Jd = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.decode = ys.encode = void 0;
const fo = Oo, tf = ui, t0 = ld, e0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function I2(t, e = "00") {
  const n = typeof t == "string" ? (0, tf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, tf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, fo.sha256)((0, fo.sha256)(new Uint8Array([...r, ...n])));
  return t0(e0).encode([...r, ...n, ...s.slice(0, 4)]);
}
ys.encode = I2;
function v2(t) {
  const e = t0(e0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, fo.sha256)((0, fo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ys.decode = v2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Er, n = ys, r = ui;
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
    let $ = w.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(y, $);
  }
  t.c32ToB58 = u;
})(Jd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = rl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Er;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jd;
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
})(Dr);
function L2(t, e) {
  switch (e = Vd(e ?? Gd), t) {
    case cn.P2PKH:
      switch (e.transactionVersion) {
        case un.Mainnet:
          return Ke.MainnetSingleSig;
        case un.Testnet:
          return Ke.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case cn.P2SH:
    case cn.P2SHNonSequential:
    case cn.P2WPKH:
    case cn.P2WSH:
    case cn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case un.Mainnet:
          return Ke.MainnetMultiSig;
        case un.Testnet:
          return Ke.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const C2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), n0 = Uint8Array.from({ length: 16 }, (t, e) => e), B2 = n0.map((t) => (9 * t + 5) % 16);
let sl = [n0], il = [B2];
for (let t = 0; t < 4; t++)
  for (let e of [sl, il])
    e.push(e[t].map((n) => C2[n]));
const r0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), k2 = sl.map((t, e) => t.map((n) => r0[e][n])), M2 = il.map((t, e) => t.map((n) => r0[e][n])), T2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ci = (t, e) => t << e | t >>> 32 - e;
function ef(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Bi = new Uint32Array(16);
let U2 = class extends nl {
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
      Bi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T2[f], $ = _2[f], _ = sl[f], U = il[f], b = k2[f], v = M2[f];
      for (let A = 0; A < 16; A++) {
        const P = Ci(r + ef(f, i, a, u) + Bi[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Ci(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Ci(s + ef(y, o, c, h) + Bi[U[A]] + $, v[A]) + g | 0;
        s = g, g = h, h = Ci(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Bi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const H2 = Or(() => new U2()), ki = BigInt(2 ** 32 - 1), Va = BigInt(32);
function s0(t, e = !1) {
  return e ? { h: Number(t & ki), l: Number(t >> Va & ki) } : { h: Number(t >> Va & ki) | 0, l: Number(t & ki) | 0 };
}
function N2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = s0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const P2 = (t, e) => BigInt(t >>> 0) << Va | BigInt(e >>> 0), O2 = (t, e, n) => t >>> n, D2 = (t, e, n) => t << 32 - n | e >>> n, F2 = (t, e, n) => t >>> n | e << 32 - n, j2 = (t, e, n) => t << 32 - n | e >>> n, z2 = (t, e, n) => t << 64 - n | e >>> n - 32, R2 = (t, e, n) => t >>> n - 32 | e << 64 - n, G2 = (t, e) => e, V2 = (t, e) => t, K2 = (t, e, n) => t << n | e >>> 32 - n, q2 = (t, e, n) => e << n | t >>> 32 - n, W2 = (t, e, n) => e << n - 32 | t >>> 64 - n, X2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Y2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Z2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Q2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, J2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), tx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ex = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), nx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, st = {
  fromBig: s0,
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
}, [rx, sx] = st.split([
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
].map((t) => BigInt(t))), Bn = new Uint32Array(80), kn = new Uint32Array(80);
let jo = class extends nl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Bn[b] = e.getUint32(n), kn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Bn[b - 15] | 0, A = kn[b - 15] | 0, P = st.rotrSH(v, A, 1) ^ st.rotrSH(v, A, 8) ^ st.shrSH(v, A, 7), G = st.rotrSL(v, A, 1) ^ st.rotrSL(v, A, 8) ^ st.shrSL(v, A, 7), O = Bn[b - 2] | 0, R = kn[b - 2] | 0, x = st.rotrSH(O, R, 19) ^ st.rotrBH(O, R, 61) ^ st.shrSH(O, R, 6), L = st.rotrSL(O, R, 19) ^ st.rotrBL(O, R, 61) ^ st.shrSL(O, R, 6), N = st.add4L(G, L, kn[b - 7], kn[b - 16]), q = st.add4H(N, P, x, Bn[b - 7], Bn[b - 16]);
      Bn[b] = q | 0, kn[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const v = st.rotrSH(l, g, 14) ^ st.rotrSH(l, g, 18) ^ st.rotrBH(l, g, 41), A = st.rotrSL(l, g, 14) ^ st.rotrSL(l, g, 18) ^ st.rotrBL(l, g, 41), P = l & f ^ ~l & w, G = g & y ^ ~g & $, O = st.add5L(U, A, G, sx[b], kn[b]), R = st.add5H(O, _, v, P, rx[b], Bn[b]), x = O | 0, L = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), N = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      _ = w | 0, U = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = st.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = st.add3L(x, N, Y);
      r = st.add3H(j, R, L, q), s = j | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = st.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = st.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = st.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = st.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = st.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: _, l: U } = st.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, _, U);
  }
  roundClean() {
    Bn.fill(0), kn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ix = class extends jo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ox = class extends jo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ax = class extends jo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Or(() => new jo());
Or(() => new ix());
Or(() => new ox());
Or(() => new ax());
var ho = { exports: {} };
ho.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", f = "[object Number]", y = "[object Object]", w = "[object Promise]", $ = "[object RegExp]", _ = "[object Set]", U = "[object String]", b = "[object Symbol]", v = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", G = "[object Float32Array]", O = "[object Float64Array]", R = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", N = "[object Uint8Array]", q = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", j = "[object Uint32Array]", Yt = /[\\^$.*+?()[\]{}|]/g, Rt = /\w*$/, Zt = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[A] = B[P] = B[a] = B[c] = B[G] = B[O] = B[R] = B[x] = B[L] = B[g] = B[f] = B[y] = B[$] = B[_] = B[U] = B[b] = B[N] = B[q] = B[Y] = B[j] = !0, B[u] = B[h] = B[v] = !1;
  var tt = typeof ee == "object" && ee && ee.Object === Object && ee, gt = typeof self == "object" && self && self.Object === Object && self, ht = tt || gt || Function("return this")(), Et = e && !e.nodeType && e, re = Et && !0 && t && !t.nodeType && t, tn = re && re.exports === Et;
  function gn(p, E) {
    return p.set(E[0], E[1]), p;
  }
  function jt(p, E) {
    return p.add(E), p;
  }
  function yn(p, E) {
    for (var C = -1, W = p ? p.length : 0; ++C < W && E(p[C], C, p) !== !1; )
      ;
    return p;
  }
  function Gr(p, E) {
    for (var C = -1, W = E.length, Kt = p.length; ++C < W; )
      p[Kt + C] = E[C];
    return p;
  }
  function Oe(p, E, C, W) {
    for (var Kt = -1, oe = p ? p.length : 0; ++Kt < oe; )
      C = E(C, p[Kt], Kt, p);
    return C;
  }
  function d(p, E) {
    for (var C = -1, W = Array(p); ++C < p; )
      W[C] = E(C);
    return W;
  }
  function I(p, E) {
    return p == null ? void 0 : p[E];
  }
  function T(p) {
    var E = !1;
    if (p != null && typeof p.toString != "function")
      try {
        E = !!(p + "");
      } catch {
      }
    return E;
  }
  function z(p) {
    var E = -1, C = Array(p.size);
    return p.forEach(function(W, Kt) {
      C[++E] = [Kt, W];
    }), C;
  }
  function et(p, E) {
    return function(C) {
      return p(E(C));
    };
  }
  function It(p) {
    var E = -1, C = Array(p.size);
    return p.forEach(function(W) {
      C[++E] = W;
    }), C;
  }
  var se = Array.prototype, Vt = Function.prototype, xe = Object.prototype, wn = ht["__core-js_shared__"], bn = function() {
    var p = /[^.]+$/.exec(wn && wn.keys && wn.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), ie = Vt.toString, Tt = xe.hasOwnProperty, me = xe.toString, yt = RegExp(
    "^" + ie.call(Tt).replace(Yt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), At = tn ? ht.Buffer : void 0, Nt = ht.Symbol, Se = ht.Uint8Array, tr = et(Object.getPrototypeOf, Object), Ts = Object.create, xn = xe.propertyIsEnumerable, er = se.splice, S = Object.getOwnPropertySymbols, M = At ? At.isBuffer : void 0, V = et(Object.keys, Object), K = qr(ht, "DataView"), Q = qr(ht, "Map"), vt = qr(ht, "Promise"), k = qr(ht, "Set"), J = qr(ht, "WeakMap"), Ft = qr(Object, "create"), Ee = ir(K), Be = ir(Q), en = ir(vt), nr = ir(k), lg = ir(J), Yl = Nt ? Nt.prototype : void 0, Zl = Yl ? Yl.valueOf : void 0;
  function rr(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function ug() {
    this.__data__ = Ft ? Ft(null) : {};
  }
  function fg(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function hg(p) {
    var E = this.__data__;
    if (Ft) {
      var C = E[p];
      return C === r ? void 0 : C;
    }
    return Tt.call(E, p) ? E[p] : void 0;
  }
  function dg(p) {
    var E = this.__data__;
    return Ft ? E[p] !== void 0 : Tt.call(E, p);
  }
  function pg(p, E) {
    var C = this.__data__;
    return C[p] = Ft && E === void 0 ? r : E, this;
  }
  rr.prototype.clear = ug, rr.prototype.delete = fg, rr.prototype.get = hg, rr.prototype.has = dg, rr.prototype.set = pg;
  function nn(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function gg() {
    this.__data__ = [];
  }
  function yg(p) {
    var E = this.__data__, C = pi(E, p);
    if (C < 0)
      return !1;
    var W = E.length - 1;
    return C == W ? E.pop() : er.call(E, C, 1), !0;
  }
  function wg(p) {
    var E = this.__data__, C = pi(E, p);
    return C < 0 ? void 0 : E[C][1];
  }
  function bg(p) {
    return pi(this.__data__, p) > -1;
  }
  function xg(p, E) {
    var C = this.__data__, W = pi(C, p);
    return W < 0 ? C.push([p, E]) : C[W][1] = E, this;
  }
  nn.prototype.clear = gg, nn.prototype.delete = yg, nn.prototype.get = wg, nn.prototype.has = bg, nn.prototype.set = xg;
  function Vr(p) {
    var E = -1, C = p ? p.length : 0;
    for (this.clear(); ++E < C; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function mg() {
    this.__data__ = {
      hash: new rr(),
      map: new (Q || nn)(),
      string: new rr()
    };
  }
  function Sg(p) {
    return gi(this, p).delete(p);
  }
  function Eg(p) {
    return gi(this, p).get(p);
  }
  function Ag(p) {
    return gi(this, p).has(p);
  }
  function $g(p, E) {
    return gi(this, p).set(p, E), this;
  }
  Vr.prototype.clear = mg, Vr.prototype.delete = Sg, Vr.prototype.get = Eg, Vr.prototype.has = Ag, Vr.prototype.set = $g;
  function Kr(p) {
    this.__data__ = new nn(p);
  }
  function Ig() {
    this.__data__ = new nn();
  }
  function vg(p) {
    return this.__data__.delete(p);
  }
  function Lg(p) {
    return this.__data__.get(p);
  }
  function Cg(p) {
    return this.__data__.has(p);
  }
  function Bg(p, E) {
    var C = this.__data__;
    if (C instanceof nn) {
      var W = C.__data__;
      if (!Q || W.length < n - 1)
        return W.push([p, E]), this;
      C = this.__data__ = new Vr(W);
    }
    return C.set(p, E), this;
  }
  Kr.prototype.clear = Ig, Kr.prototype.delete = vg, Kr.prototype.get = Lg, Kr.prototype.has = Cg, Kr.prototype.set = Bg;
  function kg(p, E) {
    var C = ia(p) || ty(p) ? d(p.length, String) : [], W = C.length, Kt = !!W;
    for (var oe in p)
      Tt.call(p, oe) && !(Kt && (oe == "length" || Yg(oe, W))) && C.push(oe);
    return C;
  }
  function Ql(p, E, C) {
    var W = p[E];
    (!(Tt.call(p, E) && nu(W, C)) || C === void 0 && !(E in p)) && (p[E] = C);
  }
  function pi(p, E) {
    for (var C = p.length; C--; )
      if (nu(p[C][0], E))
        return C;
    return -1;
  }
  function Mg(p, E) {
    return p && Jl(E, oa(E), p);
  }
  function ra(p, E, C, W, Kt, oe, rn) {
    var ae;
    if (W && (ae = oe ? W(p, Kt, oe, rn) : W(p)), ae !== void 0)
      return ae;
    if (!yi(p))
      return p;
    var iu = ia(p);
    if (iu) {
      if (ae = qg(p), !E)
        return Gg(p, ae);
    } else {
      var Wr = sr(p), ou = Wr == h || Wr == l;
      if (ny(p))
        return Pg(p, E);
      if (Wr == y || Wr == i || ou && !oe) {
        if (T(p))
          return oe ? p : {};
        if (ae = Wg(ou ? {} : p), !E)
          return Vg(p, Mg(ae, p));
      } else {
        if (!B[Wr])
          return oe ? p : {};
        ae = Xg(p, Wr, ra, E);
      }
    }
    rn || (rn = new Kr());
    var au = rn.get(p);
    if (au)
      return au;
    if (rn.set(p, ae), !iu)
      var cu = C ? Kg(p) : oa(p);
    return yn(cu || p, function(aa, wi) {
      cu && (wi = aa, aa = p[wi]), Ql(ae, wi, ra(aa, E, C, W, wi, p, rn));
    }), ae;
  }
  function Tg(p) {
    return yi(p) ? Ts(p) : {};
  }
  function _g(p, E, C) {
    var W = E(p);
    return ia(p) ? W : Gr(W, C(p));
  }
  function Ug(p) {
    return me.call(p);
  }
  function Hg(p) {
    if (!yi(p) || Qg(p))
      return !1;
    var E = su(p) || T(p) ? yt : Zt;
    return E.test(ir(p));
  }
  function Ng(p) {
    if (!eu(p))
      return V(p);
    var E = [];
    for (var C in Object(p))
      Tt.call(p, C) && C != "constructor" && E.push(C);
    return E;
  }
  function Pg(p, E) {
    if (E)
      return p.slice();
    var C = new p.constructor(p.length);
    return p.copy(C), C;
  }
  function sa(p) {
    var E = new p.constructor(p.byteLength);
    return new Se(E).set(new Se(p)), E;
  }
  function Og(p, E) {
    var C = E ? sa(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.byteLength);
  }
  function Dg(p, E, C) {
    var W = E ? C(z(p), !0) : z(p);
    return Oe(W, gn, new p.constructor());
  }
  function Fg(p) {
    var E = new p.constructor(p.source, Rt.exec(p));
    return E.lastIndex = p.lastIndex, E;
  }
  function jg(p, E, C) {
    var W = E ? C(It(p), !0) : It(p);
    return Oe(W, jt, new p.constructor());
  }
  function zg(p) {
    return Zl ? Object(Zl.call(p)) : {};
  }
  function Rg(p, E) {
    var C = E ? sa(p.buffer) : p.buffer;
    return new p.constructor(C, p.byteOffset, p.length);
  }
  function Gg(p, E) {
    var C = -1, W = p.length;
    for (E || (E = Array(W)); ++C < W; )
      E[C] = p[C];
    return E;
  }
  function Jl(p, E, C, W) {
    C || (C = {});
    for (var Kt = -1, oe = E.length; ++Kt < oe; ) {
      var rn = E[Kt], ae = void 0;
      Ql(C, rn, ae === void 0 ? p[rn] : ae);
    }
    return C;
  }
  function Vg(p, E) {
    return Jl(p, tu(p), E);
  }
  function Kg(p) {
    return _g(p, oa, tu);
  }
  function gi(p, E) {
    var C = p.__data__;
    return Zg(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function qr(p, E) {
    var C = I(p, E);
    return Hg(C) ? C : void 0;
  }
  var tu = S ? et(S, Object) : iy, sr = Ug;
  (K && sr(new K(new ArrayBuffer(1))) != P || Q && sr(new Q()) != g || vt && sr(vt.resolve()) != w || k && sr(new k()) != _ || J && sr(new J()) != v) && (sr = function(p) {
    var E = me.call(p), C = E == y ? p.constructor : void 0, W = C ? ir(C) : void 0;
    if (W)
      switch (W) {
        case Ee:
          return P;
        case Be:
          return g;
        case en:
          return w;
        case nr:
          return _;
        case lg:
          return v;
      }
    return E;
  });
  function qg(p) {
    var E = p.length, C = p.constructor(E);
    return E && typeof p[0] == "string" && Tt.call(p, "index") && (C.index = p.index, C.input = p.input), C;
  }
  function Wg(p) {
    return typeof p.constructor == "function" && !eu(p) ? Tg(tr(p)) : {};
  }
  function Xg(p, E, C, W) {
    var Kt = p.constructor;
    switch (E) {
      case A:
        return sa(p);
      case a:
      case c:
        return new Kt(+p);
      case P:
        return Og(p, W);
      case G:
      case O:
      case R:
      case x:
      case L:
      case N:
      case q:
      case Y:
      case j:
        return Rg(p, W);
      case g:
        return Dg(p, W, C);
      case f:
      case U:
        return new Kt(p);
      case $:
        return Fg(p);
      case _:
        return jg(p, W, C);
      case b:
        return zg(p);
    }
  }
  function Yg(p, E) {
    return E = E ?? s, !!E && (typeof p == "number" || m.test(p)) && p > -1 && p % 1 == 0 && p < E;
  }
  function Zg(p) {
    var E = typeof p;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? p !== "__proto__" : p === null;
  }
  function Qg(p) {
    return !!bn && bn in p;
  }
  function eu(p) {
    var E = p && p.constructor, C = typeof E == "function" && E.prototype || xe;
    return p === C;
  }
  function ir(p) {
    if (p != null) {
      try {
        return ie.call(p);
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
    return ra(p, !0, !0);
  }
  function nu(p, E) {
    return p === E || p !== p && E !== E;
  }
  function ty(p) {
    return ey(p) && Tt.call(p, "callee") && (!xn.call(p, "callee") || me.call(p) == i);
  }
  var ia = Array.isArray;
  function ru(p) {
    return p != null && ry(p.length) && !su(p);
  }
  function ey(p) {
    return sy(p) && ru(p);
  }
  var ny = M || oy;
  function su(p) {
    var E = yi(p) ? me.call(p) : "";
    return E == h || E == l;
  }
  function ry(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function yi(p) {
    var E = typeof p;
    return !!p && (E == "object" || E == "function");
  }
  function sy(p) {
    return !!p && typeof p == "object";
  }
  function oa(p) {
    return ru(p) ? kg(p) : Ng(p);
  }
  function iy() {
    return [];
  }
  function oy() {
    return !1;
  }
  t.exports = Jg;
})(ho, ho.exports);
var cx = ho.exports;
const i0 = /* @__PURE__ */ Th(cx);
var Ka;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ka || (Ka = {}));
function lx(t, e) {
  return { type: Ka.Address, version: t, hash160: e };
}
function ux(t) {
  return Dr.c32address(t.version, t.hash160);
}
const fx = (t) => H2(Zd(t)), hx = (t) => Z(fx(t));
Ht.hmacSha256Sync = (t, ...e) => {
  const n = Xd.create(Zd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function dx(t, e = "mainnet") {
  e = Vd(e), t = typeof t == "string" ? pt(t) : t;
  const n = L2(cn.P2PKH, e), r = lx(n, hx(t));
  return ux(r);
}
function px(t, e) {
  const n = qt.decodeToken(t), r = n.payload;
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
  const o = new qt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function gx(t, e = null) {
  let n;
  e ? n = px(t, e) : n = qt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const nf = "_blockstackDidCheckEchoReply", yx = "echoReply", wx = "authContinuation";
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
  const e = t[nf];
  if (typeof e == "boolean")
    return e;
  const n = bx(t.location.search), r = n[yx];
  if (r) {
    t[nf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[wx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class qa {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new zh();
    else
      throw new Ny("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Pu(e.sessionOptions) : this.store = new Pu() : e ? this.store = new Nu(e.sessionOptions) : this.store = new Nu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Oy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new _a("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, s2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = r2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Dc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (xx())
        return ts.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ts.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = aw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new bi("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = qt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await l2(e))
      throw new bi("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (la(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Uu(s, i.private_key);
          } catch {
            if (ts.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ht.isValidPrivateKey(i.private_key))
              throw new bi("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Uu(s, c);
          } catch {
            ts.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new bi("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Yy, h;
    la(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), la(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: zd(i.iss),
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
      throw new _a("No user data found. Did the user sign in?");
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
qa.prototype.makeAuthRequest = qa.prototype.makeAuthRequestToken;
const mx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Sx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = mx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!zo(r.id));
  return e.concat(n);
}, zo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), o0 = "STX_PROVIDER", Ar = () => typeof window > "u" ? null : window.localStorage.getItem(o0), Ex = (t) => {
  typeof window < "u" && window.localStorage.setItem(o0, t);
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
function Ix(t) {
  let e = $x, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function vx(...t) {
  const { fetchLib: e, middlewares: n } = Ix(t);
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
var ws;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ws || (ws = {}));
var $r;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($r || ($r = {}));
var rf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(rf || (rf = {}));
const Lx = "https://api.mainnet.hiro.so", Cx = "https://api.testnet.hiro.so", Bx = "http://localhost:3999", kx = ["mainnet", "testnet", "devnet", "mocknet"];
class Ir {
  constructor(e) {
    this.version = $r.Mainnet, this.chainId = ws.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === $r.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? vx();
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
Ir.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Wa();
    case "testnet":
      return new Xa();
    case "devnet":
      return new Mx();
    case "mocknet":
      return new a0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${kx.join(", ")}`);
  }
};
Ir.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ir.fromName(t);
class Wa extends Ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Mainnet, this.chainId = ws.Mainnet;
  }
}
class Xa extends Ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Testnet, this.chainId = ws.Testnet;
  }
}
class a0 extends Ir {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Bx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Testnet, this.chainId = ws.Testnet;
  }
}
const Mx = a0;
var vr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(vr || (vr = {}));
var po;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(po || (po = {}));
vr.Mainnet;
var Lr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Lr || (Lr = {}));
var Cr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cr || (Cr = {}));
Lr.Mainnet;
const Tx = {
  chainId: vr.Mainnet,
  transactionVersion: Lr.Mainnet,
  peerNetworkId: po.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Cr.MainnetSingleSig,
    multiSig: Cr.MainnetMultiSig
  },
  client: { baseUrl: Dh }
}, Ya = {
  chainId: vr.Testnet,
  transactionVersion: Lr.Testnet,
  peerNetworkId: po.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Cr.TestnetSingleSig,
    multiSig: Cr.TestnetMultiSig
  },
  client: { baseUrl: Fh }
}, Zi = {
  ...Ya,
  addressVersion: { ...Ya.addressVersion },
  magicBytes: "id",
  client: { baseUrl: jh }
}, _x = {
  ...Zi,
  addressVersion: { ...Zi.addressVersion },
  client: { ...Zi.client }
};
function Ux(t) {
  switch (t) {
    case "mainnet":
      return Tx;
    case "testnet":
      return Ya;
    case "devnet":
      return Zi;
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
const sf = /* @__PURE__ */ new Map();
function c0(t, e) {
  const n = sf.get(t);
  if (n !== void 0)
    return n(e);
  const r = Nx(t);
  return sf.set(t, r), c0(t, e);
}
let $t = class {
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
    if (c0(e, r))
      return r;
    throw n(r);
  }
};
const Px = 128, Ox = 128, l0 = 16, pr = 32, Za = 80, Ro = 65, Dx = 32, Fx = 64, go = 34, jx = 1 + 16 * 1024 * 1024, zx = 165, Rx = 16, Gx = 16, Vx = 20, Kx = Gx + 2 + Vx, qx = Kx + 4, Wx = jx + (zx + Rx * qx);
var bt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(bt || (bt = {}));
var Qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Qa || (Qa = {}));
var he;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(he || (he = {}));
const ya = ["onChainOnly", "offChainOnly", "any"];
ya[0] + "", he.OnChainOnly, ya[1] + "", he.OffChainOnly, ya[2] + "", he.Any, he.OnChainOnly + "", he.OnChainOnly, he.OffChainOnly + "", he.OffChainOnly, he.Any + "", he.Any;
var yo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(yo || (yo = {}));
var Lt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Lt || (Lt = {}));
var _t;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(_t || (_t = {}));
var mt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(mt || (mt = {}));
var kt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(kt || (kt = {}));
var zs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(zs || (zs = {}));
var Ja;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ja || (Ja = {}));
var tc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(tc || (tc = {}));
var te;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(te || (te = {}));
var of;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(of || (of = {}));
var ec;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ec || (ec = {}));
var _e;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_e || (_e = {}));
var af;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(af || (af = {}));
let Go = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, es = class extends Go {
  constructor(e) {
    super(e);
  }
}, Qt = class extends Go {
  constructor(e) {
    super(e);
  }
}, wo = class extends Go {
  constructor(e) {
    super(e);
  }
}, ur = class extends Go {
  constructor(e) {
    super(e);
  }
};
function nc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function u0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Yx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nc(t.outputLen), nc(t.blockLen);
}
function Zx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qx(t, e) {
  u0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const fr = {
  number: nc,
  bool: Xx,
  bytes: u0,
  hash: Yx,
  exists: Zx,
  output: Qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const wa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), je = (t, e) => t << 32 - e | t >>> e, Jx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Jx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ol(t) {
  if (typeof t == "string" && (t = tm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let f0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fr(t) {
  const e = (r) => t().update(ol(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let h0 = class extends f0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, fr.hash(e);
    const r = ol(n);
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
    return fr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    fr.exists(this), fr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const d0 = (t, e, n) => new h0(t, e).update(n).digest();
d0.create = (t, e) => new h0(t, e);
function em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let al = class extends f0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = wa(this.buffer);
  }
  update(e) {
    fr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ol(e);
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
    fr.exists(this), fr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    em(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = wa(e), c = this.outputLen;
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
let p0 = class extends al {
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
      const g = Tn[l - 15], f = Tn[l - 2], y = je(g, 7) ^ je(g, 18) ^ g >>> 3, w = je(f, 17) ^ je(f, 19) ^ f >>> 10;
      Tn[l] = w + Tn[l - 7] + y + Tn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = je(a, 6) ^ je(a, 11) ^ je(a, 25), f = h + g + nm(a, c, u) + sm[l] + Tn[l] | 0, w = (je(r, 2) ^ je(r, 13) ^ je(r, 22)) + rm(r, s, i) | 0;
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
}, im = class extends p0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const cl = Fr(() => new p0());
Fr(() => new im());
const om = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), g0 = Uint8Array.from({ length: 16 }, (t, e) => e), am = g0.map((t) => (9 * t + 5) % 16);
let ll = [g0], ul = [am];
for (let t = 0; t < 4; t++)
  for (let e of [ll, ul])
    e.push(e[t].map((n) => om[n]));
const y0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cm = ll.map((t, e) => t.map((n) => y0[e][n])), lm = ul.map((t, e) => t.map((n) => y0[e][n])), um = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mi = (t, e) => t << e | t >>> 32 - e;
function cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ti = new Uint32Array(16);
let hm = class extends al {
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
      Ti[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = um[f], $ = fm[f], _ = ll[f], U = ul[f], b = cm[f], v = lm[f];
      for (let A = 0; A < 16; A++) {
        const P = Mi(r + cf(f, i, a, u) + Ti[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Mi(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Mi(s + cf(y, o, c, h) + Ti[U[A]] + $, v[A]) + g | 0;
        s = g, g = h, h = Mi(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ti.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const dm = Fr(() => new hm()), _i = BigInt(2 ** 32 - 1), rc = BigInt(32);
function w0(t, e = !1) {
  return e ? { h: Number(t & _i), l: Number(t >> rc & _i) } : { h: Number(t >> rc & _i) | 0, l: Number(t & _i) | 0 };
}
function pm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = w0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const gm = (t, e) => BigInt(t >>> 0) << rc | BigInt(e >>> 0), ym = (t, e, n) => t >>> n, wm = (t, e, n) => t << 32 - n | e >>> n, bm = (t, e, n) => t >>> n | e << 32 - n, xm = (t, e, n) => t << 32 - n | e >>> n, mm = (t, e, n) => t << 64 - n | e >>> n - 32, Sm = (t, e, n) => t >>> n - 32 | e << 64 - n, Em = (t, e) => e, Am = (t, e) => t, $m = (t, e, n) => t << n | e >>> 32 - n, Im = (t, e, n) => e << n | t >>> 32 - n, vm = (t, e, n) => e << n - 32 | t >>> 64 - n, Lm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Cm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Bm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), km = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Tm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _m = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Um = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, it = {
  fromBig: w0,
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
  rotlSL: Im,
  rotlBH: vm,
  rotlBL: Lm,
  add: Cm,
  add3L: Bm,
  add3H: km,
  add4L: Mm,
  add4H: Tm,
  add5H: Um,
  add5L: _m
}, [Hm, Nm] = it.split([
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
let Vo = class extends al {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      _n[b] = e.getUint32(n), Un[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = _n[b - 15] | 0, A = Un[b - 15] | 0, P = it.rotrSH(v, A, 1) ^ it.rotrSH(v, A, 8) ^ it.shrSH(v, A, 7), G = it.rotrSL(v, A, 1) ^ it.rotrSL(v, A, 8) ^ it.shrSL(v, A, 7), O = _n[b - 2] | 0, R = Un[b - 2] | 0, x = it.rotrSH(O, R, 19) ^ it.rotrBH(O, R, 61) ^ it.shrSH(O, R, 6), L = it.rotrSL(O, R, 19) ^ it.rotrBL(O, R, 61) ^ it.shrSL(O, R, 6), N = it.add4L(G, L, Un[b - 7], Un[b - 16]), q = it.add4H(N, P, x, _n[b - 7], _n[b - 16]);
      _n[b] = q | 0, Un[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const v = it.rotrSH(l, g, 14) ^ it.rotrSH(l, g, 18) ^ it.rotrBH(l, g, 41), A = it.rotrSL(l, g, 14) ^ it.rotrSL(l, g, 18) ^ it.rotrBL(l, g, 41), P = l & f ^ ~l & w, G = g & y ^ ~g & $, O = it.add5L(U, A, G, Nm[b], Un[b]), R = it.add5H(O, _, v, P, Hm[b], _n[b]), x = O | 0, L = it.rotrSH(r, s, 28) ^ it.rotrBH(r, s, 34) ^ it.rotrBH(r, s, 39), N = it.rotrSL(r, s, 28) ^ it.rotrBL(r, s, 34) ^ it.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      _ = w | 0, U = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = it.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = it.add3L(x, N, Y);
      r = it.add3H(j, R, L, q), s = j | 0;
    }
    ({ h: r, l: s } = it.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = it.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = it.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = it.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = it.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = it.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = it.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: _, l: U } = it.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, _, U);
  }
  roundClean() {
    _n.fill(0), Un.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Pm = class extends Vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Om = class extends Vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Dm = class extends Vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fr(() => new Vo());
Fr(() => new Pm());
const Fm = Fr(() => new Om());
Fr(() => new Dm());
var ft;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ft || (ft = {}));
var zt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(zt || (zt = {}));
function fl(t) {
  return zt[t];
}
const jm = () => ({ type: ft.BoolTrue }), zm = () => ({ type: ft.BoolFalse }), Rm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ft.Buffer, value: Z(t) };
}, lf = BigInt("0xffffffffffffffffffffffffffffffff"), Gm = BigInt(0), uf = BigInt("0x7fffffffffffffffffffffffffffffff"), ff = BigInt("-170141183460469231731687303715884105728"), Vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ha(pt(t))), ue(t, Uint8Array) && (t = Ha(t));
  const e = Xt(t);
  if (e > uf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${uf}`);
  if (e < ff)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ff}`);
  return { type: ft.Int, value: e };
}, Km = (t) => {
  const e = Xt(t);
  if (e < Gm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > lf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${lf}`);
  return { type: ft.UInt, value: e };
};
function qm(t) {
  return { type: ft.List, value: t };
}
function b0() {
  return { type: ft.OptionalNone };
}
function x0(t) {
  return { type: ft.OptionalSome, value: t };
}
var F;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(F || (F = {}));
function Wm() {
  return {
    type: F.Address,
    version: Cr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hf(t) {
  if (t && C0(t, go))
    throw new Error(`Memo exceeds maximum length of ${go} bytes`);
  return { type: F.MemoString, content: t };
}
function hl(t, e) {
  return {
    type: F.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function sc(t) {
  if (pt(t).byteLength != Ro)
    throw Error("Invalid signature");
  return {
    type: F.MessageSignature,
    data: t
  };
}
function Xm(t, e, n) {
  return typeof t == "string" && (t = fS(t)), typeof n == "string" && (n = hf(n)), {
    type: F.Payload,
    payloadType: bt.TokenTransfer,
    recipient: t,
    amount: Xt(e),
    memo: n ?? hf("")
  };
}
function Ym(t, e, n, r) {
  return typeof e == "string" && (e = Ne(e)), typeof n == "string" && (n = Ne(n)), {
    type: F.Payload,
    payloadType: bt.ContractCall,
    contractAddress: typeof t == "string" ? Jn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Zm(t) {
  return Ne(t, 4, 1e5);
}
function df(t, e, n) {
  return typeof t == "string" && (t = Ne(t)), typeof e == "string" && (e = Zm(e)), typeof n == "number" ? {
    type: F.Payload,
    payloadType: bt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: F.Payload,
    payloadType: bt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Qm() {
  return { type: F.Payload, payloadType: bt.PoisonMicroblock };
}
function pf(t, e) {
  if (t.byteLength != pr)
    throw Error(`Coinbase buffer size must be ${pr} bytes`);
  return e != null ? {
    type: F.Payload,
    payloadType: bt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: F.Payload,
    payloadType: bt.Coinbase,
    coinbaseBytes: t
  };
}
function Jm(t, e, n) {
  if (t.byteLength != pr)
    throw Error(`Coinbase buffer size must be ${pr} bytes`);
  if (n.byteLength != Za)
    throw Error(`VRF proof buffer size must be ${Za} bytes`);
  return {
    type: F.Payload,
    payloadType: bt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ft.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function tS(t, e, n, r, s, i, o) {
  return {
    type: F.Payload,
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
function Ne(t, e, n) {
  const r = e || 1, s = n || Px;
  if (C0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: F.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function eS(t, e, n) {
  return {
    type: F.Asset,
    address: Jn(t),
    contractName: Ne(e),
    assetName: Ne(n)
  };
}
function Jn(t) {
  const e = Dr.c32addressDecode(t);
  return {
    type: F.Address,
    version: e[0],
    hash160: e[1]
  };
}
function nS(t, e) {
  const n = Jn(t), r = Ne(e);
  return {
    type: F.Principal,
    prefix: te.Contract,
    address: n,
    contractName: r
  };
}
function rS(t) {
  const e = Jn(t);
  return {
    type: F.Principal,
    prefix: te.Standard,
    address: e
  };
}
function ns(t, e) {
  return {
    pubKeyEncoding: t,
    type: F.TransactionAuthField,
    contents: e
  };
}
function on(t) {
  switch (t.type) {
    case F.Address:
      return fi(t);
    case F.Principal:
      return m0(t);
    case F.LengthPrefixedString:
      return xs(t);
    case F.MemoString:
      return iS(t);
    case F.Asset:
      return E0(t);
    case F.PostCondition:
      return $0(t);
    case F.PublicKey:
      return ac(t);
    case F.LengthPrefixedList:
      return dl(t);
    case F.Payload:
      return I0(t);
    case F.TransactionAuthField:
      return uS(t);
    case F.MessageSignature:
      return pl(t);
  }
}
function fi(t) {
  const e = [];
  return e.push(pt(ii(t.version, 1))), e.push(pt(t.hash160)), Ot(e);
}
function bs(t) {
  const e = ue(t, $t) ? t : new $t(t), n = ko(Z(e.readBytes(1))), r = Z(e.readBytes(20));
  return { type: F.Address, version: n, hash160: r };
}
function m0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === te.Standard || t.prefix === te.Contract) && e.push(fi(t.address)), t.prefix === te.Contract && e.push(xs(t.contractName)), Ot(e);
}
function sS(t) {
  const e = ue(t, $t) ? t : new $t(t), n = e.readUInt8Enum(te, (i) => {
    throw new Qt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === te.Origin)
    return { type: F.Principal, prefix: n };
  const r = bs(e);
  if (n === te.Standard)
    return { type: F.Principal, prefix: n, address: r };
  const s = ve(e);
  return {
    type: F.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function xs(t) {
  const e = [], n = Hr(t.content), r = n.byteLength;
  return e.push(pt(ii(r, t.lengthPrefixBytes))), e.push(n), Ot(e);
}
function ve(t, e, n) {
  e = e || 1;
  const r = ue(t, $t) ? t : new $t(t), s = ko(Z(r.readBytes(e))), i = oi(r.readBytes(s));
  return Ne(i, e, n ?? 128);
}
function iS(t) {
  const e = [], n = Hr(t.content), r = _S(Z(n), go * 2);
  return e.push(pt(r)), Ot(e);
}
function S0(t) {
  const e = ue(t, $t) ? t : new $t(t);
  let n = oi(e.readBytes(go));
  return n = n.replace(/\u0000*$/, ""), { type: F.MemoString, content: n };
}
function E0(t) {
  const e = [];
  return e.push(fi(t.address)), e.push(xs(t.contractName)), e.push(xs(t.assetName)), Ot(e);
}
function ic(t) {
  const e = ue(t, $t) ? t : new $t(t);
  return {
    type: F.Asset,
    address: bs(e),
    contractName: ve(e),
    assetName: ve(e)
  };
}
function dl(t) {
  const e = t.values, n = [];
  n.push(pt(ii(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(on(r));
  return Ot(n);
}
function A0(t, e, n) {
  const r = ue(t, $t) ? t : new $t(t), s = ko(Z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case F.Address:
        i.push(bs(r));
        break;
      case F.LengthPrefixedString:
        i.push(ve(r));
        break;
      case F.MemoString:
        i.push(S0(r));
        break;
      case F.Asset:
        i.push(ic(r));
        break;
      case F.PostCondition:
        i.push(aS(r));
        break;
      case F.PublicKey:
        i.push(cc(r));
        break;
      case F.TransactionAuthField:
        i.push(lS(r));
        break;
    }
  return hl(i, n);
}
function oS(t) {
  return Z($0(t));
}
function $0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(m0(t.principal)), (t.conditionType === Lt.Fungible || t.conditionType === Lt.NonFungible) && e.push(E0(t.asset)), t.conditionType === Lt.NonFungible && e.push(qe(t.assetName)), e.push(t.conditionCode), t.conditionType === Lt.STX || t.conditionType === Lt.Fungible || t.conditionType === Lt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new es("The post-condition amount may not be larger than 8 bytes");
    e.push(Zn(t.amount, 8));
  }
  return Ot(e);
}
function aS(t) {
  const e = ue(t, $t) ? t : new $t(t), n = e.readUInt8Enum(Lt, (a) => {
    throw new Qt(`Could not read ${a} as PostConditionType`);
  }), r = sS(e);
  let s, i, o;
  switch (n) {
    case Lt.STX:
      return s = e.readUInt8Enum(zs, (c) => {
        throw new Qt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: Lt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.Fungible:
      return i = ic(e), s = e.readUInt8Enum(zs, (c) => {
        throw new Qt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: Lt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Lt.NonFungible:
      i = ic(e);
      const a = Ve(e);
      return s = e.readUInt8Enum(Ja, (c) => {
        throw new Qt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: F.PostCondition,
        conditionType: Lt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Lt.Staking:
      return s = e.readUInt8Enum(zs, (c) => {
        throw new Qt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: Lt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.PoX: {
      const c = e.readUInt8Enum(tc, (u) => {
        throw new Qt(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: F.PostCondition,
        conditionType: Lt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function I0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case bt.TokenTransfer:
      e.push(qe(t.recipient)), e.push(Zn(t.amount, 8)), e.push(on(t.memo));
      break;
    case bt.ContractCall:
      e.push(on(t.contractAddress)), e.push(on(t.contractName)), e.push(on(t.functionName));
      const n = new Uint8Array(4);
      br(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(qe(r));
      });
      break;
    case bt.SmartContract:
      e.push(on(t.contractName)), e.push(on(t.codeBody));
      break;
    case bt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(on(t.contractName)), e.push(on(t.codeBody));
      break;
    case bt.PoisonMicroblock:
      break;
    case bt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case bt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(qe(t.recipient));
      break;
    case bt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(qe(t.recipient ? x0(t.recipient) : b0())), e.push(t.vrfProof);
      break;
    case bt.TenureChange:
      e.push(pt(t.tenureHash)), e.push(pt(t.previousTenureHash)), e.push(pt(t.burnViewHash)), e.push(pt(t.previousTenureEnd)), e.push(br(new Uint8Array(4), t.previousTenureBlocks)), e.push(nw(new Uint8Array(1), t.cause)), e.push(pt(t.publicKeyHash));
      break;
  }
  return Ot(e);
}
function cS(t) {
  const e = ue(t, $t) ? t : new $t(t);
  switch (e.readUInt8Enum(bt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case bt.TokenTransfer:
      const r = Ve(e), s = Xt(e.readBytes(8)), i = S0(e);
      return Xm(r, s, i);
    case bt.ContractCall:
      const o = bs(e), a = ve(e), c = ve(e), u = [], h = e.readUInt32BE();
      for (let v = 0; v < h; v++) {
        const A = Ve(e);
        u.push(A);
      }
      return Ym(o, a, c, u);
    case bt.SmartContract:
      const l = ve(e), g = ve(e, 4, 1e5);
      return df(l, g);
    case bt.VersionedSmartContract: {
      const v = e.readUInt8Enum(Qa, (G) => {
        throw new Error(`Cannot recognize ClarityVersion: ${G}`);
      }), A = ve(e), P = ve(e, 4, Wx);
      return df(A, P, v);
    }
    case bt.PoisonMicroblock:
      return Qm();
    case bt.Coinbase: {
      const v = e.readBytes(pr);
      return pf(v);
    }
    case bt.CoinbaseToAltRecipient: {
      const v = e.readBytes(pr), A = Ve(e);
      return pf(v, A);
    }
    case bt.NakamotoCoinbase: {
      const v = e.readBytes(pr), A = Ve(e), P = e.readBytes(Za);
      return Jm(v, A, P);
    }
    case bt.TenureChange:
      const f = Z(e.readBytes(20)), y = Z(e.readBytes(20)), w = Z(e.readBytes(20)), $ = Z(e.readBytes(32)), _ = e.readUInt32BE(), U = e.readUInt8Enum(ec, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), b = Z(e.readBytes(20));
      return tS(f, y, w, $, _, U, b);
  }
}
function oc(t) {
  const e = ue(t, $t) ? t : new $t(t);
  return sc(Z(e.readBytes(Ro)));
}
function lS(t) {
  const e = ue(t, $t) ? t : new $t(t), n = e.readUInt8Enum(_e, (r) => {
    throw new Qt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case _e.PublicKeyCompressed:
      return ns(kt.Compressed, cc(e));
    case _e.PublicKeyUncompressed:
      return ns(kt.Uncompressed, Ls(GS(cc(e).data)));
    case _e.SignatureCompressed:
      return ns(kt.Compressed, oc(e));
    case _e.SignatureUncompressed:
      return ns(kt.Uncompressed, oc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function pl(t) {
  return pt(t.data);
}
function uS(t) {
  const e = [];
  switch (t.contents.type) {
    case F.PublicKey:
      e.push(t.pubKeyEncoding === kt.Compressed ? _e.PublicKeyCompressed : _e.PublicKeyUncompressed), e.push(pt(RS(t.contents.data)));
      break;
    case F.MessageSignature:
      e.push(t.pubKeyEncoding === kt.Compressed ? _e.SignatureCompressed : _e.SignatureUncompressed), e.push(pl(t.contents));
      break;
  }
  return Ot(e);
}
function ac(t) {
  return t.data.slice();
}
function cc(t) {
  const e = ue(t, $t) ? t : new $t(t), n = e.readUInt8(), r = n === 4 ? Fx : Dx;
  return Ls(Ot([n, e.readBytes(r)]));
}
function gl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === mt.P2PKH || e === mt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === mt.P2WPKH || e === mt.P2WSH || e === mt.P2WSHNonSequential) && !r.map((s) => s.data).every(Cs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case mt.P2PKH:
      return Ui(t, US(r[0].data));
    case mt.P2WPKH:
      return Ui(t, HS(r[0].data));
    case mt.P2SH:
    case mt.P2SHNonSequential:
      return Ui(t, NS(n, r.map(ac)));
    case mt.P2WSH:
    case mt.P2WSHNonSequential:
      return Ui(t, PS(n, r.map(ac)));
  }
}
function Ui(t, e) {
  return { type: F.Address, version: t, hash160: e };
}
function yl(t) {
  return Dr.c32address(t.version, t.hash160);
}
function gf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return eS(e, n, r);
}
function Ns(t) {
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
  const e = Jn(t);
  return { type: ft.PrincipalStandard, value: yl(e) };
}
function dS(t) {
  return { type: ft.PrincipalStandard, value: yl(t) };
}
function pS(t, e) {
  const n = Jn(t), r = Ne(e);
  return v0(n, r);
}
function v0(t, e) {
  if (Hr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ft.PrincipalContract,
    value: `${yl(t)}.${e.content}`
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
function Ve(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new $t(pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new $t(t) : e = t;
  switch (e.readUInt8Enum(zt, (r) => {
    throw new Qt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case zt.int:
      return Vm(Ha(e.readBytes(16)));
    case zt.uint:
      return Km(e.readBytes(16));
    case zt.buffer:
      const r = e.readUInt32BE();
      return Rm(e.readBytes(r));
    case zt.true:
      return jm();
    case zt.false:
      return zm();
    case zt.address:
      const s = bs(e);
      return dS(s);
    case zt.contract:
      const i = bs(e), o = ve(e);
      return v0(i, o);
    case zt.ok:
      return yS(Ve(e));
    case zt.err:
      return gS(Ve(e));
    case zt.none:
      return b0();
    case zt.some:
      return x0(Ve(e));
    case zt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ve(e));
      return qm(c);
    case zt.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const $ = ve(e).content;
        if ($ === void 0)
          throw new Qt('"content" is undefined');
        h[$] = Ve(e);
      }
      return xS(h);
    case zt.ascii:
      const l = e.readUInt32BE(), g = Wy(e.readBytes(l));
      return wS(g);
    case zt.utf8:
      const f = e.readUInt32BE(), y = oi(e.readBytes(f));
      return bS(y);
    default:
      throw new Qt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ze(t, e) {
  return Ot([fl(t), e]);
}
function mS(t) {
  return new Uint8Array([fl(t.type)]);
}
function SS(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([fl(t.type)]) : Ze(t.type, qe(t.value));
}
function ES(t) {
  const e = new Uint8Array(4);
  return br(e, Math.ceil(t.value.length / 2), 0), Ze(t.type, Xe(e, pt(t.value)));
}
function AS(t) {
  const e = Fc(Ry(BigInt(t.value), BigInt(Ox)), l0);
  return Ze(t.type, e);
}
function $S(t) {
  const e = Fc(BigInt(t.value), l0);
  return Ze(t.type, e);
}
function IS(t) {
  return Ze(t.type, fi(Jn(t.value)));
}
function vS(t) {
  const [e, n] = DS(t.value);
  return Ze(t.type, Xe(fi(Jn(e)), xs(Ne(n))));
}
function LS(t) {
  return Ze(t.type, qe(t.value));
}
function CS(t) {
  const e = [], n = new Uint8Array(4);
  br(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = qe(r);
    e.push(s);
  }
  return Ze(t.type, Ot(e));
}
function BS(t) {
  const e = [], n = new Uint8Array(4);
  br(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ne(s);
    e.push(xs(i));
    const o = qe(t.value[s]);
    e.push(o);
  }
  return Ze(t.type, Ot(e));
}
function L0(t, e) {
  const n = [], r = e == "ascii" ? qy(t.value) : Hr(t.value), s = new Uint8Array(4);
  return br(s, r.length, 0), n.push(s), n.push(r), Ze(t.type, Ot(n));
}
function kS(t) {
  return L0(t, "ascii");
}
function MS(t) {
  return L0(t, "utf8");
}
function yf(t) {
  return Z(qe(t));
}
function qe(t) {
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
      return IS(t);
    case ft.PrincipalContract:
      return vS(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return LS(t);
    case ft.List:
      return CS(t);
    case ft.Tuple:
      return BS(t);
    case ft.StringASCII:
      return kS(t);
    case ft.StringUTF8:
      return MS(t);
    default:
      throw new es("Unable to serialize. Invalid Clarity Value.");
  }
}
const TS = (t) => t.length % 2 ? `0${t}` : t, _S = (t, e) => t.padEnd(e, "0"), C0 = (t, e) => t ? Hr(t).length > e : !1;
function lc(t) {
  return i0(t);
}
const Ws = (t) => dm(cl(t)), wl = (t) => Z(Fm(t)), US = (t) => Z(Ws(t)), HS = (t) => {
  const e = Ws(t), n = Xe(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ws(n);
  return Z(r);
}, NS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ot(n), s = Ws(r);
  return Z(s);
}, PS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ot(n), s = cl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ot(i), a = Ws(o);
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
Ht.hmacSha256Sync = (t, ...e) => {
  const n = d0.create(cl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ls(t) {
  return t = typeof t == "string" ? pt(t) : t, {
    type: F.PublicKey,
    data: t
  };
}
function FS(t, e, n = kt.Compressed) {
  const r = Qy(e), s = new ye(gu(r.r), gu(r.s)), i = lt.fromSignature(t, s, r.recoveryId), o = n === kt.Compressed;
  return i.toHex(o);
}
function jS(t) {
  return typeof t == "string" ? t : Z(t);
}
const bl = jS;
function B0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Zy;
}
function Cs(t) {
  return !bl(t).startsWith("04");
}
function zS(t) {
  t = jc(t);
  const e = B0(t);
  return Z(ai(t.slice(0, 32), e));
}
function RS(t) {
  return lt.fromHex(bl(t)).toHex(!0);
}
function GS(t) {
  return lt.fromHex(bl(t)).toHex(!1);
}
function VS(t, e) {
  t = jc(t);
  const [n, r] = To(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ii(r, 1) + ye.fromHex(n).toCompactHex();
}
function xl() {
  return {
    type: F.MessageSignature,
    data: Z(new Uint8Array(Ro))
  };
}
function k0(t, e, n, r) {
  const s = gl(0, t, 1, [Ls(e)]).hash160, i = Cs(e) ? kt.Compressed : kt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Xt(n),
    fee: Xt(r),
    keyEncoding: i,
    signature: xl()
  };
}
function Xs(t) {
  return "signature" in t;
}
function wf(t) {
  return t === mt.P2SH || t === mt.P2WSH;
}
function KS(t) {
  return t === mt.P2SHNonSequential || t === mt.P2WSHNonSequential;
}
function bf(t) {
  const e = lc(t);
  return e.nonce = 0, e.fee = 0, Xs(e) ? e.signature = xl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function qS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    Zn(t.nonce, 8),
    Zn(t.fee, 8),
    t.keyEncoding,
    pl(t.signature)
  ];
  return Ot(e);
}
function WS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    Zn(t.nonce, 8),
    Zn(t.fee, 8)
  ], n = hl(t.fields);
  e.push(dl(n));
  const r = new Uint8Array(2);
  return tw(r, t.signaturesRequired, 0), e.push(r), Ot(e);
}
function XS(t, e) {
  const n = Z(e.readBytes(20)), r = BigInt(`0x${Z(e.readBytes(8))}`), s = BigInt(`0x${Z(e.readBytes(8))}`), i = e.readUInt8Enum(kt, (a) => {
    throw new Qt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === mt.P2WPKH && i != kt.Compressed)
    throw new Qt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = oc(e);
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
  const n = Z(e.readBytes(20)), r = BigInt("0x" + Z(e.readBytes(8))), s = BigInt("0x" + Z(e.readBytes(8))), i = A0(e, F.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case F.PublicKey:
        Cs(u.contents.data) || (o = !0);
        break;
      case F.MessageSignature:
        if (u.pubKeyEncoding === kt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ur("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === mt.P2WSH || t === mt.P2WSHNonSequential))
    throw new ur("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ba(t) {
  return Xs(t) ? qS(t) : WS(t);
}
function xa(t) {
  const e = t.readUInt8Enum(mt, (n) => {
    throw new Qt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === mt.P2PKH || e === mt.P2WPKH ? XS(e, t) : YS(e, t);
}
function M0(t, e, n, r) {
  const i = t + Z(new Uint8Array([e])) + Z(Zn(n, 8)) + Z(Zn(r, 8));
  if (pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return wl(pt(i));
}
function T0(t, e, n) {
  const r = 33 + Ro, s = Cs(e.data) ? kt.Compressed : kt.Uncompressed, i = t + TS(s.toString(16)) + n, o = pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return wl(o);
}
function ZS(t, e, n, r, s) {
  const i = M0(t, e, n, r), o = VS(s, i), a = Ls(zS(s)), c = T0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function _0(t, e, n, r, s, i) {
  const o = M0(t, e, n, r), a = Ls(FS(o, i, s)), c = T0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function QS() {
  const t = k0(mt.P2PKH, "", 0, 0);
  return t.signer = Wm().hash160, t.keyEncoding = kt.Compressed, t.signature = xl(), t;
}
function xf(t, e, n) {
  return Xs(t) ? JS(t, e, n) : t3(t, e, n);
}
function JS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = _0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = gl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ur(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function t3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case F.PublicKey:
        Cs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case F.MessageSignature:
        c.pubKeyEncoding === kt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = _0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (wf(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new ur("Too many signatures");
        break;
    }
  if (wf(t.hashMode) && o !== t.signaturesRequired || KS(t.hashMode) && o < t.signaturesRequired)
    throw new ur("Incorrect number of signatures");
  if (i && (t.hashMode === mt.P2WSH || t.hashMode === mt.P2WSHNonSequential))
    throw new ur("Uncompressed keys are not allowed in this hash mode");
  const a = gl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ur(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function U0(t) {
  return {
    authType: _t.Standard,
    spendingCondition: t
  };
}
function H0(t, e) {
  return {
    authType: _t.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || k0(mt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function mf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case _t.Standard:
        return U0(bf(t.spendingCondition));
      case _t.Sponsored:
        return H0(bf(t.spendingCondition), QS());
      default:
        throw new wo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function e3(t, e) {
  switch (t.authType) {
    case _t.Standard:
      return xf(t.spendingCondition, e, _t.Standard);
    case _t.Sponsored:
      return xf(t.spendingCondition, e, _t.Standard);
    default:
      throw new wo("Invalid origin auth type");
  }
}
function n3(t, e) {
  switch (t.authType) {
    case _t.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Xt(e)
      };
      return { ...t, spendingCondition: n };
    case _t.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Xt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function r3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Xt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function s3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Xt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function i3(t, e) {
  const n = {
    ...e,
    nonce: Xt(e.nonce),
    fee: Xt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function o3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case _t.Standard:
      e.push(ba(t.spendingCondition));
      break;
    case _t.Sponsored:
      e.push(ba(t.spendingCondition)), e.push(ba(t.sponsorSpendingCondition));
      break;
  }
  return Ot(e);
}
function a3(t) {
  const e = t.readUInt8Enum(_t, (r) => {
    throw new Qt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case _t.Standard:
      return n = xa(t), U0(n);
    case _t.Sponsored:
      n = xa(t);
      const r = xa(t);
      return H0(n, r);
  }
}
class c3 {
  constructor({ auth: e, payload: n, postConditions: r = hl([]), postConditionMode: s = yo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Hx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Xt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = he.Any;
  }
  signBegin() {
    const e = lc(this);
    return e.auth = mf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = lc(this);
    return e.auth = mf(e.auth), e.txid();
  }
  verifyOrigin() {
    return e3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, _t.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === _t.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, _t.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Ls(e), r = this.auth.spendingCondition;
    if (r && !Xs(r)) {
      const s = Cs(n.data);
      r.fields.push(ns(s ? kt.Compressed : kt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ZS(n, r, e.fee, e.nonce, s);
    if (Xs(e))
      e.signature = sc(i);
    else {
      const a = B0(s);
      e.fields.push(ns(a ? kt.Compressed : kt.Uncompressed, sc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return wl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != _t.Sponsored)
      throw new wo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = i3(this.auth, e);
  }
  setFee(e) {
    this.auth = n3(this.auth, e);
  }
  setNonce(e) {
    this.auth = r3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != _t.Sponsored)
      throw new wo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = s3(this.auth, e);
  }
  serialize() {
    return Z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new es('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new es('"chainId" is undefined');
    if (this.auth === void 0)
      throw new es('"auth" is undefined');
    if (this.payload === void 0)
      throw new es('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return br(n, this.chainId, 0), e.push(n), e.push(o3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(dl(this.postConditions)), e.push(I0(this.payload)), Ot(e);
  }
}
function l3(t) {
  const e = ue(t, $t) ? t : new $t(t), n = e.readUInt8Enum(Lr, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = a3(e), i = e.readUInt8Enum(he, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum(yo, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = A0(e, F.PostCondition), c = cS(e), u = new c3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Sf = BigInt("18446744073709551615");
function ma(t) {
  const e = Xt(t);
  if (e < 0n || e > Sf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Sf} (u64 max), received: ${e}`);
  return e;
}
var uc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(uc || (uc = {}));
var fc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(fc || (fc = {}));
function u3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: F.PostCondition,
        conditionType: Lt.STX,
        principal: t.address === "origin" ? { type: F.Principal, prefix: te.Origin } : Ns(t.address),
        conditionCode: Hi(t.condition),
        amount: ma(t.amount)
      };
    case "ft-postcondition":
      return {
        type: F.PostCondition,
        conditionType: Lt.Fungible,
        principal: t.address === "origin" ? { type: F.Principal, prefix: te.Origin } : Ns(t.address),
        conditionCode: Hi(t.condition),
        amount: ma(t.amount),
        asset: gf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: F.PostCondition,
        conditionType: Lt.NonFungible,
        principal: t.address === "origin" ? { type: F.Principal, prefix: te.Origin } : Ns(t.address),
        conditionCode: Hi(t.condition),
        asset: gf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: F.PostCondition,
        conditionType: Lt.Staking,
        principal: t.address === "origin" ? { type: F.Principal, prefix: te.Origin } : Ns(t.address),
        conditionCode: Hi(t.condition),
        amount: ma(t.amount)
      };
    case "pox-postcondition":
      return {
        type: F.PostCondition,
        conditionType: Lt.PoX,
        principal: t.address === "origin" ? { type: F.Principal, prefix: te.Origin } : Ns(t.address),
        conditionCode: f3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Hi(t) {
  return uc[t];
}
function f3(t) {
  return fc[t];
}
function N0(t) {
  const e = u3(t);
  return oS(e);
}
function h3(t, e, n) {
  return Sl(P0(t), n);
}
function P0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ys(r);
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
function ml(t, e = 8) {
  return (typeof t == "bigint" ? t : P0(t)).toString(16).padStart(e * 2, "0");
}
function Sl(t, e = 16) {
  const n = ml(t, e);
  return Ys(n);
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
function Ys(t) {
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
function El(t) {
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
function Ef(t) {
  if (t.some(w3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Al(...t) {
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
function pn(t) {
  return Al(...t.map((e) => typeof e == "number" ? Ef([e]) : e instanceof Array ? Ef(e) : e));
}
function Ko(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var hc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hc || (hc = {}));
hc.Mainnet;
const b3 = 128, x3 = 128, O0 = 16;
var dc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(dc || (dc = {}));
var Af;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Af || (Af = {}));
var $f;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})($f || ($f = {}));
var Te;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Te || (Te = {}));
const Sa = ["onChainOnly", "offChainOnly", "any"];
Sa[0] + "", Te.OnChainOnly, Sa[1] + "", Te.OffChainOnly, Sa[2] + "", Te.Any, Te.OnChainOnly + "", Te.OnChainOnly, Te.OffChainOnly + "", Te.OffChainOnly, Te.Any + "", Te.Any;
var pc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(pc || (pc = {}));
pc.Mainnet;
var If;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(If || (If = {}));
var or;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(or || (or = {}));
var vf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(vf || (vf = {}));
var Lf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Lf || (Lf = {}));
var Cf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cf || (Cf = {}));
var Bf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bf || (Bf = {}));
var kf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(kf || (kf = {}));
var Mf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Mf || (Mf = {}));
var gc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gc || (gc = {}));
var Tf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Tf || (Tf = {}));
var _f;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(_f || (_f = {}));
function yc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function m3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function D0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yc(t.outputLen), yc(t.blockLen);
}
function E3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A3(t, e) {
  D0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ea = {
  number: yc,
  bool: m3,
  bytes: D0,
  hash: S3,
  exists: E3,
  output: A3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Aa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ze = (t, e) => t << 32 - e | t >>> e, $3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function I3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function F0(t) {
  if (typeof t == "string" && (t = I3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let v3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function jr(t) {
  const e = (r) => t().update(F0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function L3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let $l = class extends v3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Aa(this.buffer);
  }
  update(e) {
    Ea.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = F0(e);
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
    Ea.exists(this), Ea.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const C3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), j0 = Uint8Array.from({ length: 16 }, (t, e) => e), B3 = j0.map((t) => (9 * t + 5) % 16);
let Il = [j0], vl = [B3];
for (let t = 0; t < 4; t++)
  for (let e of [Il, vl])
    e.push(e[t].map((n) => C3[n]));
const z0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), k3 = Il.map((t, e) => t.map((n) => z0[e][n])), M3 = vl.map((t, e) => t.map((n) => z0[e][n])), T3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ni = (t, e) => t << e | t >>> 32 - e;
function Uf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Pi = new Uint32Array(16);
let U3 = class extends $l {
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
      Pi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T3[f], $ = _3[f], _ = Il[f], U = vl[f], b = k3[f], v = M3[f];
      for (let A = 0; A < 16; A++) {
        const P = Ni(r + Uf(f, i, a, u) + Pi[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Ni(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Ni(s + Uf(y, o, c, h) + Pi[U[A]] + $, v[A]) + g | 0;
        s = g, g = h, h = Ni(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Pi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
jr(() => new U3());
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
]), Hn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nn = new Uint32Array(64);
let R0 = class extends $l {
  constructor() {
    super(64, 32, 8, !1), this.A = Hn[0] | 0, this.B = Hn[1] | 0, this.C = Hn[2] | 0, this.D = Hn[3] | 0, this.E = Hn[4] | 0, this.F = Hn[5] | 0, this.G = Hn[6] | 0, this.H = Hn[7] | 0;
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
      Nn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Nn[l - 15], f = Nn[l - 2], y = ze(g, 7) ^ ze(g, 18) ^ g >>> 3, w = ze(f, 17) ^ ze(f, 19) ^ f >>> 10;
      Nn[l] = w + Nn[l - 7] + y + Nn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = ze(a, 6) ^ ze(a, 11) ^ ze(a, 25), f = h + g + H3(a, c, u) + P3[l] + Nn[l] | 0, w = (ze(r, 2) ^ ze(r, 13) ^ ze(r, 22)) + N3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Nn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O3 = class extends R0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
jr(() => new R0());
jr(() => new O3());
const Oi = BigInt(2 ** 32 - 1), wc = BigInt(32);
function G0(t, e = !1) {
  return e ? { h: Number(t & Oi), l: Number(t >> wc & Oi) } : { h: Number(t >> wc & Oi) | 0, l: Number(t & Oi) | 0 };
}
function D3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = G0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const F3 = (t, e) => BigInt(t >>> 0) << wc | BigInt(e >>> 0), j3 = (t, e, n) => t >>> n, z3 = (t, e, n) => t << 32 - n | e >>> n, R3 = (t, e, n) => t >>> n | e << 32 - n, G3 = (t, e, n) => t << 32 - n | e >>> n, V3 = (t, e, n) => t << 64 - n | e >>> n - 32, K3 = (t, e, n) => t >>> n - 32 | e << 64 - n, q3 = (t, e) => e, W3 = (t, e) => t, X3 = (t, e, n) => t << n | e >>> 32 - n, Y3 = (t, e, n) => e << n | t >>> 32 - n, Z3 = (t, e, n) => e << n - 32 | t >>> 64 - n, Q3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function J3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ot = {
  fromBig: G0,
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
}, [o4, a4] = ot.split([
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
].map((t) => BigInt(t))), Pn = new Uint32Array(80), On = new Uint32Array(80);
let qo = class extends $l {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Pn[b] = e.getUint32(n), On[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Pn[b - 15] | 0, A = On[b - 15] | 0, P = ot.rotrSH(v, A, 1) ^ ot.rotrSH(v, A, 8) ^ ot.shrSH(v, A, 7), G = ot.rotrSL(v, A, 1) ^ ot.rotrSL(v, A, 8) ^ ot.shrSL(v, A, 7), O = Pn[b - 2] | 0, R = On[b - 2] | 0, x = ot.rotrSH(O, R, 19) ^ ot.rotrBH(O, R, 61) ^ ot.shrSH(O, R, 6), L = ot.rotrSL(O, R, 19) ^ ot.rotrBL(O, R, 61) ^ ot.shrSL(O, R, 6), N = ot.add4L(G, L, On[b - 7], On[b - 16]), q = ot.add4H(N, P, x, Pn[b - 7], Pn[b - 16]);
      Pn[b] = q | 0, On[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const v = ot.rotrSH(l, g, 14) ^ ot.rotrSH(l, g, 18) ^ ot.rotrBH(l, g, 41), A = ot.rotrSL(l, g, 14) ^ ot.rotrSL(l, g, 18) ^ ot.rotrBL(l, g, 41), P = l & f ^ ~l & w, G = g & y ^ ~g & $, O = ot.add5L(U, A, G, a4[b], On[b]), R = ot.add5H(O, _, v, P, o4[b], Pn[b]), x = O | 0, L = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), N = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      _ = w | 0, U = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = ot.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = ot.add3L(x, N, Y);
      r = ot.add3H(j, R, L, q), s = j | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = ot.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = ot.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = ot.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: _, l: U } = ot.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, _, U);
  }
  roundClean() {
    Pn.fill(0), On.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, c4 = class extends qo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, l4 = class extends qo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, u4 = class extends qo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
jr(() => new qo());
jr(() => new c4());
jr(() => new l4());
jr(() => new u4());
function f4(t, e, n) {
  const s = b3;
  if (L4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: dc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Gt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Gt || (Gt = {}));
let h4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, V0 = class extends h4 {
  constructor(e) {
    super(e);
  }
};
function Wo(t) {
  const e = [];
  return e.push(Ys(ml(t.version, 1))), e.push(Ys(t.hash160)), pn(e);
}
function d4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Wo(t.address)), t.prefix === gc.Contract && e.push(Zs(t.contractName)), pn(e);
}
function Zs(t) {
  const e = [], n = El(t.content), r = n.byteLength;
  return e.push(Ys(ml(r, t.lengthPrefixBytes))), e.push(n), pn(e);
}
function p4(t) {
  const e = [];
  return e.push(Wo(t.address)), e.push(Zs(t.contractName)), e.push(Zs(t.assetName)), pn(e);
}
function K0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d4(t.principal)), (t.conditionType === or.Fungible || t.conditionType === or.NonFungible) && e.push(p4(t.assetInfo)), t.conditionType === or.NonFungible && e.push(Br(t.assetName)), e.push(t.conditionCode), t.conditionType === or.STX || t.conditionType === or.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new V0("The post-condition amount may not be larger than 8 bytes");
    e.push(h3(t.amount, !1, 8));
  }
  return pn(e);
}
function Qe(t, e) {
  return pn([t, e]);
}
function g4(t) {
  return new Uint8Array([t.type]);
}
function y4(t) {
  return t.type === Gt.OptionalNone ? new Uint8Array([t.type]) : Qe(t.type, Br(t.value));
}
function w4(t) {
  const e = new Uint8Array(4);
  return Ko(e, t.buffer.length, 0), Qe(t.type, Al(e, t.buffer));
}
function b4(t) {
  const e = Sl(d3(t.value, BigInt(x3)), O0);
  return Qe(t.type, e);
}
function x4(t) {
  const e = Sl(t.value, O0);
  return Qe(t.type, e);
}
function m4(t) {
  return Qe(t.type, Wo(t.address));
}
function S4(t) {
  return Qe(t.type, Al(Wo(t.address), Zs(t.contractName)));
}
function E4(t) {
  return Qe(t.type, Br(t.value));
}
function A4(t) {
  const e = [], n = new Uint8Array(4);
  Ko(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Br(r);
    e.push(s);
  }
  return Qe(t.type, pn(e));
}
function $4(t) {
  const e = [], n = new Uint8Array(4);
  Ko(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = f4(s);
    e.push(Zs(i));
    const o = Br(t.data[s]);
    e.push(o);
  }
  return Qe(t.type, pn(e));
}
function q0(t, e) {
  const n = [], r = e == "ascii" ? y3(t.data) : El(t.data), s = new Uint8Array(4);
  return Ko(s, r.length, 0), n.push(s), n.push(r), Qe(t.type, pn(n));
}
function I4(t) {
  return q0(t, "ascii");
}
function v4(t) {
  return q0(t, "utf8");
}
function Br(t) {
  switch (t.type) {
    case Gt.BoolTrue:
    case Gt.BoolFalse:
      return g4(t);
    case Gt.OptionalNone:
    case Gt.OptionalSome:
      return y4(t);
    case Gt.Buffer:
      return w4(t);
    case Gt.UInt:
      return x4(t);
    case Gt.Int:
      return b4(t);
    case Gt.PrincipalStandard:
      return m4(t);
    case Gt.PrincipalContract:
      return S4(t);
    case Gt.ResponseOk:
    case Gt.ResponseErr:
      return E4(t);
    case Gt.List:
      return A4(t);
    case Gt.Tuple:
      return $4(t);
    case Gt.StringASCII:
      return I4(t);
    case Gt.StringUTF8:
      return v4(t);
    default:
      throw new V0("Unable to serialize. Invalid Clarity Value.");
  }
}
const L4 = (t, e) => t ? El(t).length > e : !1, C4 = "connect-ui";
let Qi, W0, de = !1, bc = !1;
const dn = (t, e = "") => () => {
}, B4 = (t, e) => () => {
}, k4 = "{visibility:hidden}.hydrated{visibility:inherit}", Hf = {}, M4 = "http://www.w3.org/2000/svg", T4 = "http://www.w3.org/1999/xhtml", _4 = (t) => t != null, Ll = (t) => (t = typeof t, t === "object" || t === "function");
function X0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const nt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Ll(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? xc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = xc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, xc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, U4 = {}, H4 = (t) => t && t.$tag$ === U4, N4 = (t, e) => t != null && !Ll(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, P4 = (t) => Bs(t).$hostElement$, O4 = (t, e, n) => {
  const r = Wt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Nf = /* @__PURE__ */ new WeakMap(), D4 = (t, e, n) => {
  let r = bo.get(t);
  iE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, bo.set(t, r);
}, F4 = (t, e, n, r) => {
  var s;
  let i = Y0(e);
  const o = bo.get(i);
  if (t = t.nodeType === 11 ? t : We, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Nf.get(t), c;
      if (a || Nf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = We.createElement("style"), c.innerHTML = o;
          const u = (s = Wt.$nonce$) !== null && s !== void 0 ? s : X0(We);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, j4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = dn("attachStyles", e.$tagName$), i = F4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Y0 = (t, e) => "sc-" + t.$tagName$, Pf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Df(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Of(n), h = Of(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Df(Xo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Wt.rel(t, e, n, !1), r && Wt.ael(t, e, r, !1);
    else {
      const c = Ll(r);
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
}, z4 = /\s/, Of = (t) => t ? t.split(z4) : [], Z0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Hf, o = e.$attrs$ || Hf;
  for (r in i)
    r in o || Pf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Pf(s, r, i[r], o[r], n, e.$flags$);
}, Cl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = We.createTextNode(s.$text$);
  else {
    if (de || (de = s.$tag$ === "svg"), o = s.$elm$ = We.createElementNS(de ? M4 : T4, s.$tag$), de && s.$tag$ === "foreignObject" && (de = !1), Z0(null, s, de), _4(Qi) && o["s-si"] !== Qi && o.classList.add(o["s-si"] = Qi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Cl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? de = !1 : o.tagName === "foreignObject" && (de = !0);
  }
  return o;
}, Q0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === W0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Cl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, J0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, R4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Di(a, h) ? (Ps(a, h), a = e[++s], h = r[++i]) : Di(c, l) ? (Ps(c, l), c = e[--o], l = r[--u]) : Di(a, l) ? (Ps(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Di(c, h) ? (Ps(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (g = Cl(e && e[i], n, i), h = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Q0(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && J0(e, s, o);
}, Di = (t, e) => t.$tag$ === e.$tag$, Ps = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (de = i === "svg" ? !0 : i === "foreignObject" ? !1 : de, Z0(t, e, de), r !== null && s !== null ? R4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Q0(n, null, e, s, 0, s.length - 1)) : r !== null && J0(r, 0, r.length - 1), de && i === "svg" && (de = !1)) : t.$text$ !== o && (n.data = o);
}, G4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || xc(null, null), s = H4(e) ? e : nt(null, null, e);
  W0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Qi = n["s-sc"], Ps(r, s);
}, tp = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Bl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return tp(t, t.$ancestorComponent$), aE(() => V4(t, e));
}, V4 = (t, e) => {
  const n = dn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), X4(s, () => K4(t, r, e));
}, K4 = async (t, e, n) => {
  const r = t.$hostElement$, s = dn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && j4(t);
  const o = dn("render", t.$cmpMeta$.$tagName$);
  q4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => W4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, q4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, G4(t, e);
  } catch (r) {
    Qs(r, t.$hostElement$);
  }
  return null;
}, W4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = dn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, np(n), r(), t.$onReadyResolve$(n), s || ep()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Ml(() => Bl(t, !1)), t.$flags$ &= -517;
}, ep = (t) => {
  np(We.documentElement), Ml(() => O4(Xo, "appload", { detail: { namespace: C4 } }));
}, X4 = (t, e) => t && t.then ? t.then(e) : e(), np = (t) => t.classList.add("hydrated"), Y4 = (t, e) => Bs(t).$instanceValues$.get(e), Z4 = (t, e, n, r) => {
  const s = Bs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = N4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Bl(s, !1));
}, rp = (t, e, n) => {
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
        Wt.jmp(() => {
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
        const c = B4();
        s = await s, c();
      }
      s.isProxied || (rp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = dn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Qs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Y0(n);
      if (!bo.has(c)) {
        const u = dn("registerStyles", n.$tagName$);
        D4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Bl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, J4 = (t) => {
  if (!(Wt.$flags$ & 1)) {
    const e = Bs(t), n = e.$cmpMeta$, r = dn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            tp(e, e.$ancestorComponent$ = s);
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
  Wt.$flags$ & 1 || Bs(t);
}, eE = (t, e = {}) => {
  var n;
  const r = dn(), s = [], i = e.exclude || [], o = Xo.customElements, a = We.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ We.createElement("style"), h = [];
  let l, g = !0;
  Object.assign(Wt, e), Wt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", We.baseURI).href, t.map((f) => {
    f[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const $ = w.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, rE(U, w), w.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? h.push(this) : Wt.jmp(() => J4(this));
        }
        disconnectedCallback() {
          Wt.jmp(() => tE(this));
        }
        componentOnReady() {
          return Bs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = f[0], !i.includes($) && !o.get($) && (s.push($), o.define($, rp(
        _,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + k4, u.setAttribute("data-styles", "");
    const f = (n = Wt.$nonce$) !== null && n !== void 0 ? n : X0(We);
    f != null && u.setAttribute("nonce", f), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, h.length ? h.map((f) => f.connectedCallback()) : Wt.jmp(() => l = setTimeout(ep, 30)), r();
}, kl = /* @__PURE__ */ new WeakMap(), Bs = (t) => kl.get(t), nE = (t, e) => kl.set(e.$lazyInstance$ = t, e), rE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], kl.set(t, n);
}, Df = (t, e) => e in t, Qs = (t, e) => (0, console.error)(t, e), $a = /* @__PURE__ */ new Map(), sE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = $a.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => ($a.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => X5).then(o, Qs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => ($a.set(s, o), o[r]), Qs);
}, bo = /* @__PURE__ */ new Map(), Xo = typeof window < "u" ? window : {}, We = Xo.document || { head: {} }, Wt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, sp = (t) => Promise.resolve(t), iE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ff = [], ip = [], oE = (t, e) => (n) => {
  t.push(n), bc || (bc = !0, Wt.$flags$ & 4 ? Ml(mc) : Wt.raf(mc));
}, jf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Qs(n);
    }
  t.length = 0;
}, mc = () => {
  jf(Ff), jf(ip), (bc = Ff.length > 0) && Wt.raf(mc);
}, Ml = (t) => sp().then(t), aE = /* @__PURE__ */ oE(ip), cE = () => sp(), lE = (t, e) => typeof window > "u" ? Promise.resolve() : cE().then(() => eE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var uE = Object.defineProperty, fE = Object.defineProperties, hE = Object.getOwnPropertyDescriptors, xo = Object.getOwnPropertySymbols, op = Object.prototype.hasOwnProperty, ap = Object.prototype.propertyIsEnumerable, zf = (t, e, n) => e in t ? uE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, be = (t, e) => {
  for (var n in e || (e = {})) op.call(e, n) && zf(t, n, e[n]);
  if (xo) for (var n of xo(e)) ap.call(e, n) && zf(t, n, e[n]);
  return t;
}, Pe = (t, e) => fE(t, hE(e)), cp = (t, e) => {
  var n = {};
  for (var r in t) op.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && xo) for (var r of xo(t)) e.indexOf(r) < 0 && ap.call(t, r) && (n[r] = t[r]);
  return n;
};
function lp() {
  return zo(Ar()) || window.StacksProvider || window.BlockstackProvider;
}
function Yo(t) {
  return t ? typeof t == "string" ? Ir.fromName(t) : "version" in t ? t : "url" in t ? new Wa({ url: t.url }) : t.transactionVersion === Lr.Mainnet ? new Wa({ url: t.client.baseUrl }) : new Xa({ url: t.client.baseUrl }) : new Xa();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var dE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(dE || {}), pE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(pE || {}), Tl = (t) => {
  let e = t;
  if (!e) {
    let n = new zh(["store_write"], document.location.href);
    e = new qa({ appConfig: n });
  }
  return e;
};
function up(t) {
  try {
    return Tl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var fp = (t) => {
  let e = Tl(t).loadUserData().appPrivateKey, n = qt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function gE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [vr.Mainnet]: "mainnet", [vr.Testnet]: "testnet" }, a = Yo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function yE(t) {
  let e = Yo(t.network), n = Tl(t.userSession), r = Pe(be({}, t), { network: e, userSession: n });
  return be({ stxAddress: gE(r) }, r);
}
async function wE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(N0) : n = n.map((r) => Z(K0(r)))), new qt.TokenSigner("ES256k", e).signAsync(Pe(be({}, t), { postConditions: n }));
}
function bE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(N0) : e = e.map((n) => Z(K0(n)))), qt.createUnsecuredToken(Pe(be({}, t), { postConditions: e }));
}
var xE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = pt(a.replace(/^0x/, "")), u = l3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Pe(be({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Pe(be({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, mE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = cp(e, ["amount", "appDetails", "userSession"]);
  if (up(s)) {
    let { privateKey: a, publicKey: c } = fp(s), u = Pe(be({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), wE(u, a);
  }
  let o = Pe(be({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), bE(o);
};
async function SE(t, e, n) {
  let r = await e(Pe(be(be({}, yE(t)), t), { network: Yo(t.network) }));
  return xE({ token: r, options: t }, n);
}
function EE(t, e = lp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return SE(t, mE, e);
}
function hp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Pe(be({}, t), { message: yf(e), domain: yf(n) }) : Pe(be({}, t), { message: Z(Br(e)), domain: Z(Br(n)) });
}
async function AE(t, e) {
  return new qt.TokenSigner("ES256k", e).signAsync(hp(t));
}
async function $E(t) {
  let e = t, { userSession: n } = e, r = cp(e, ["userSession"]);
  if (up(n)) {
    let { privateKey: s, publicKey: i } = fp(n), o = Pe(be({}, r), { publicKey: i });
    return AE(o, s);
  }
  return qt.createUnsecuredToken(hp(t));
}
var IE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(IE || {}), dp = "asigna-stx", Rf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === dp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(LE(t, e), "*");
}), vE = { authenticationRequest: async (t) => Rf(t, "authenticationRequest"), transactionRequest: async (t) => Rf(t, "transactionRequest") }, LE = (t, e) => ({ source: dp, [e]: t }), CE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = vE);
};
CE();
var BE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function kE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Ar(), o = lp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    lE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : BE, c = Sx(a), u = document.createElement("connect-modal");
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
var Fi = kE(EE);
function Qn(t, e, n) {
  return _l(ne(t, e), n);
}
function ne(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Bt(r);
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
      const r = _E(BigInt(`0x${ut(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ut(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function hi(t, e = 8) {
  return (typeof t == "bigint" ? t : ne(t, !1)).toString(16).padStart(e * 2, "0");
}
function Zo(t) {
  return parseInt(t, 16);
}
function _l(t, e = 16) {
  const n = hi(t, e);
  return Bt(n);
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
function ut(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += UE[n];
  return e;
}
function Bt(t) {
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
function ks(t) {
  return new TextEncoder().encode(t);
}
function Ul(t) {
  return new TextDecoder().decode(t);
}
function pp(t) {
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
function Vf(t) {
  if (t.some(NE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Qo(...t) {
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
  return Qo(...t.map((e) => typeof e == "number" ? Vf([e]) : e instanceof Array ? Vf(e) : e));
}
var Kf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Kf || (Kf = {}));
var qf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wf || (Wf = {}));
const gp = 33, Ia = 32;
function PE(t) {
  if (t.length < Ia * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ia * 2), r = t.slice(2 + Ia * 2);
  return {
    recoveryId: Zo(e),
    r: n,
    s: r
  };
}
function OE(t) {
  const e = typeof t == "string" ? Bt(t) : t;
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
function kr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Sc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Sc || (Sc = {}));
const GE = Sc.Mainnet, VE = 128, KE = 128, yp = 16, gr = 32, Ec = 80, Jo = 65, qE = 32, WE = 64, mo = 34;
var X;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
var ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ct || (ct = {}));
var Ac;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ac || (Ac = {}));
var ce;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ce || (ce = {}));
const Ji = ["onChainOnly", "offChainOnly", "any"], Xf = {
  [Ji[0]]: ce.OnChainOnly,
  [Ji[1]]: ce.OffChainOnly,
  [Ji[2]]: ce.Any,
  [ce.OnChainOnly]: ce.OnChainOnly,
  [ce.OffChainOnly]: ce.OffChainOnly,
  [ce.Any]: ce.Any
};
function XE(t) {
  if (t in Xf)
    return Xf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ji.join(", ")}`);
}
var So;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(So || (So = {}));
So.Mainnet;
var ms;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ms || (ms = {}));
var le;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(le || (le = {}));
var Ut;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ut || (Ut = {}));
var St;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(St || (St = {}));
var Eo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Eo || (Eo = {}));
var Mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Mt || (Mt = {}));
var Js;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Js || (Js = {}));
var $c;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})($c || ($c = {}));
var ti;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ti || (ti = {}));
var Yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yf || (Yf = {}));
var Zf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Zf || (Zf = {}));
function Ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function YE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function wp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ZE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ic(t.outputLen), Ic(t.blockLen);
}
function QE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function JE(t, e) {
  wp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hr = {
  number: Ic,
  bool: YE,
  bytes: wp,
  hash: ZE,
  exists: QE,
  output: JE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const va = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Re = (t, e) => t << 32 - e | t >>> e, tA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hl(t) {
  if (typeof t == "string" && (t = eA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class bp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function zr(t) {
  const e = (r) => t().update(Hl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function nA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Nl extends bp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = va(this.buffer);
  }
  update(e) {
    hr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = va(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hr.exists(this), hr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    nA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = va(e), c = this.outputLen;
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
const rA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), xp = Uint8Array.from({ length: 16 }, (t, e) => e), sA = xp.map((t) => (9 * t + 5) % 16);
let Pl = [xp], Ol = [sA];
for (let t = 0; t < 4; t++)
  for (let e of [Pl, Ol])
    e.push(e[t].map((n) => rA[n]));
const mp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), iA = Pl.map((t, e) => t.map((n) => mp[e][n])), oA = Ol.map((t, e) => t.map((n) => mp[e][n])), aA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), cA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ji = (t, e) => t << e | t >>> 32 - e;
function Qf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zi = new Uint32Array(16);
class lA extends Nl {
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
      zi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = aA[f], $ = cA[f], _ = Pl[f], U = Ol[f], b = iA[f], v = oA[f];
      for (let A = 0; A < 16; A++) {
        const P = ji(r + Qf(f, i, a, u) + zi[_[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = ji(a, 10) | 0, a = i, i = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = ji(s + Qf(y, o, c, h) + zi[U[A]] + $, v[A]) + g | 0;
        s = g, g = h, h = ji(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    zi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const uA = zr(() => new lA()), fA = (t, e, n) => t & e ^ ~t & n, hA = (t, e, n) => t & e ^ t & n ^ e & n, dA = new Uint32Array([
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
]), Dn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fn = new Uint32Array(64);
class Sp extends Nl {
  constructor() {
    super(64, 32, 8, !1), this.A = Dn[0] | 0, this.B = Dn[1] | 0, this.C = Dn[2] | 0, this.D = Dn[3] | 0, this.E = Dn[4] | 0, this.F = Dn[5] | 0, this.G = Dn[6] | 0, this.H = Dn[7] | 0;
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
      Fn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Fn[l - 15], f = Fn[l - 2], y = Re(g, 7) ^ Re(g, 18) ^ g >>> 3, w = Re(f, 17) ^ Re(f, 19) ^ f >>> 10;
      Fn[l] = w + Fn[l - 7] + y + Fn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Re(a, 6) ^ Re(a, 11) ^ Re(a, 25), f = h + g + fA(a, c, u) + dA[l] + Fn[l] | 0, w = (Re(r, 2) ^ Re(r, 13) ^ Re(r, 22)) + hA(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class pA extends Sp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Dl = zr(() => new Sp());
zr(() => new pA());
const Ri = BigInt(2 ** 32 - 1), vc = BigInt(32);
function Ep(t, e = !1) {
  return e ? { h: Number(t & Ri), l: Number(t >> vc & Ri) } : { h: Number(t >> vc & Ri) | 0, l: Number(t & Ri) | 0 };
}
function gA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ep(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yA = (t, e) => BigInt(t >>> 0) << vc | BigInt(e >>> 0), wA = (t, e, n) => t >>> n, bA = (t, e, n) => t << 32 - n | e >>> n, xA = (t, e, n) => t >>> n | e << 32 - n, mA = (t, e, n) => t << 32 - n | e >>> n, SA = (t, e, n) => t << 64 - n | e >>> n - 32, EA = (t, e, n) => t >>> n - 32 | e << 64 - n, AA = (t, e) => e, $A = (t, e) => t, IA = (t, e, n) => t << n | e >>> 32 - n, vA = (t, e, n) => e << n | t >>> 32 - n, LA = (t, e, n) => e << n - 32 | t >>> 64 - n, CA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function BA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const kA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), MA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, TA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _A = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, UA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, at = {
  fromBig: Ep,
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
  rotlSH: IA,
  rotlSL: vA,
  rotlBH: LA,
  rotlBL: CA,
  add: BA,
  add3L: kA,
  add3H: MA,
  add4L: TA,
  add4H: _A,
  add5H: HA,
  add5L: UA
}, [NA, PA] = at.split([
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
].map((t) => BigInt(t))), jn = new Uint32Array(80), zn = new Uint32Array(80);
class ta extends Nl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      jn[b] = e.getUint32(n), zn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = jn[b - 15] | 0, A = zn[b - 15] | 0, P = at.rotrSH(v, A, 1) ^ at.rotrSH(v, A, 8) ^ at.shrSH(v, A, 7), G = at.rotrSL(v, A, 1) ^ at.rotrSL(v, A, 8) ^ at.shrSL(v, A, 7), O = jn[b - 2] | 0, R = zn[b - 2] | 0, x = at.rotrSH(O, R, 19) ^ at.rotrBH(O, R, 61) ^ at.shrSH(O, R, 6), L = at.rotrSL(O, R, 19) ^ at.rotrBL(O, R, 61) ^ at.shrSL(O, R, 6), N = at.add4L(G, L, zn[b - 7], zn[b - 16]), q = at.add4H(N, P, x, jn[b - 7], jn[b - 16]);
      jn[b] = q | 0, zn[b] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const v = at.rotrSH(l, g, 14) ^ at.rotrSH(l, g, 18) ^ at.rotrBH(l, g, 41), A = at.rotrSL(l, g, 14) ^ at.rotrSL(l, g, 18) ^ at.rotrBL(l, g, 41), P = l & f ^ ~l & w, G = g & y ^ ~g & $, O = at.add5L(U, A, G, PA[b], zn[b]), R = at.add5H(O, _, v, P, NA[b], jn[b]), x = O | 0, L = at.rotrSH(r, s, 28) ^ at.rotrBH(r, s, 34) ^ at.rotrBH(r, s, 39), N = at.rotrSL(r, s, 28) ^ at.rotrBL(r, s, 34) ^ at.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      _ = w | 0, U = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = at.add(u | 0, h | 0, R | 0, x | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = at.add3L(x, N, Y);
      r = at.add3H(j, R, L, q), s = j | 0;
    }
    ({ h: r, l: s } = at.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = at.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = at.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = at.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = at.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = at.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = at.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: _, l: U } = at.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, _, U);
  }
  roundClean() {
    jn.fill(0), zn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class OA extends ta {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class DA extends ta {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class FA extends ta {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
zr(() => new ta());
zr(() => new OA());
const jA = zr(() => new DA());
zr(() => new FA());
function Ap(t) {
  if (Bt(t).byteLength != Jo)
    throw Error("Invalid signature");
  return {
    type: X.MessageSignature,
    data: t
  };
}
function Os(t, e) {
  return { type: X.Address, version: t, hash160: e };
}
function rs(t) {
  return Dr.c32address(t.version, t.hash160);
}
function Mr(t, e, n) {
  const r = e || 1, s = n || VE;
  if (Fp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: X.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Fl(t) {
  const e = Dr.c32addressDecode(t);
  return {
    type: X.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function zA(t) {
  if (t.type === H.PrincipalStandard)
    return rs(t.address);
  if (t.type === H.PrincipalContract)
    return `${rs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function $p(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return VA(e, n);
  } else
    return RA(t);
}
function RA(t) {
  const e = Fl(t);
  return { type: H.PrincipalStandard, address: e };
}
function GA(t) {
  return { type: H.PrincipalStandard, address: t };
}
function VA(t, e) {
  const n = Fl(t), r = Mr(e);
  return Ip(n, r);
}
function Ip(t, e) {
  if (ks(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function La(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${ut(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return ln(t.value);
    case H.ResponseErr:
      return ln(t.value);
    case H.ResponseOk:
      return ln(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return zA(t);
    case H.List:
      return t.list.map((r) => ln(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = ln(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function ln(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: Kn(t), value: La(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: Kn(t), value: La(t, !0), success: !0 };
    default:
      return { type: Kn(t), value: La(t, !0) };
  }
}
function Kn(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return "bool";
    case H.Int:
      return "int";
    case H.UInt:
      return "uint";
    case H.Buffer:
      return `(buff ${t.buffer.length})`;
    case H.OptionalNone:
      return "(optional none)";
    case H.OptionalSome:
      return `(optional ${Kn(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${Kn(t.value)})`;
    case H.ResponseOk:
      return `(response ${Kn(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? Kn(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Kn(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${pp(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${ks(t.data).length})`;
  }
}
const vp = () => ({ type: H.BoolTrue }), Lp = () => ({ type: H.BoolFalse }), KA = (t) => t ? vp() : Lp(), Jf = BigInt("0xffffffffffffffffffffffffffffffff"), qA = BigInt(0), th = BigInt("0x7fffffffffffffffffffffffffffffff"), eh = BigInt("-170141183460469231731687303715884105728"), WA = (t) => {
  const e = ne(t, !0);
  if (e > th)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${th}`);
  if (e < eh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${eh}`);
  return { type: H.Int, value: e };
}, Ao = (t) => {
  const e = ne(t, !1);
  if (e < qA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Jf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Jf}`);
  return { type: H.UInt, value: e };
}, Cp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function Bp() {
  return { type: H.OptionalNone };
}
function kp(t) {
  return { type: H.OptionalSome, value: t };
}
function XA(t) {
  return { type: H.ResponseErr, value: t };
}
function YA(t) {
  return { type: H.ResponseOk, value: t };
}
function ZA(t) {
  return { type: H.List, list: t };
}
function Lc(t) {
  for (const e in t)
    if (!F8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const Jr = (t) => ({ type: H.StringASCII, data: t }), QA = (t) => ({ type: H.StringUTF8, data: t });
class Mp extends bp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, hr.hash(e);
    const r = Hl(n);
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
    return hr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    hr.exists(this), hr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Tp = (t, e, n) => new Mp(t, e).update(n).digest();
Tp.create = (t, e) => new Mp(t, e);
Ht.hmacSha256Sync = (t, ...e) => {
  const n = Tp.create(Dl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ss(t) {
  return {
    type: X.PublicKey,
    data: Bt(t)
  };
}
function JA(t, e, n = Mt.Compressed) {
  const r = PE(e.data), s = new ye(Gf(r.r), Gf(r.s)), i = lt.fromSignature(t, s, r.recoveryId), o = n === Mt.Compressed;
  return i.toHex(o);
}
function t8(t) {
  return { type: X.PublicKey, data: t };
}
function Ms(t) {
  return !ut(t.data).startsWith("04");
}
function $o(t) {
  return t.data.slice();
}
function e8(t) {
  const e = s8(t), n = ai(e.data.slice(0, 32), e.compressed);
  return Ss(ut(n));
}
function n8(t) {
  const e = typeof t == "string" ? t : ut(t), n = lt.fromHex(e).toHex(!0);
  return Ss(n);
}
function r8(t) {
  const e = typeof t == "string" ? t : ut(t), n = lt.fromHex(e).toHex(!1);
  return Ss(n);
}
function Cc(t) {
  const e = t.readUInt8(), n = e === 4 ? WE : qE;
  return t8(Dt([e, t.readBytes(n)]));
}
function s8(t) {
  const e = OE(t), n = e.length == gp;
  return { data: e, compressed: n };
}
function i8(t, e) {
  const [n, r] = To(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = hi(r, 1) + ye.fromHex(n).toCompactHex();
  return Ap(i);
}
function o8(t) {
  return e8(t.data);
}
function a8(t, e, n) {
  return typeof t == "string" && (t = $p(t)), typeof n == "string" && (n = sh(n)), {
    type: X.Payload,
    payloadType: ct.TokenTransfer,
    recipient: t,
    amount: ne(e, !1),
    memo: n ?? sh("")
  };
}
function c8(t, e, n, r) {
  return typeof t == "string" && (t = Fl(t)), typeof e == "string" && (e = Mr(e)), typeof n == "string" && (n = Mr(n)), {
    type: X.Payload,
    payloadType: ct.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function nh(t, e, n) {
  return typeof t == "string" && (t = Mr(t)), typeof e == "string" && (e = w8(e)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: X.Payload,
    payloadType: ct.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function l8() {
  return { type: X.Payload, payloadType: ct.PoisonMicroblock };
}
function rh(t, e) {
  if (t.byteLength != gr)
    throw Error(`Coinbase buffer size must be ${gr} bytes`);
  return e != null ? {
    type: X.Payload,
    payloadType: ct.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: X.Payload,
    payloadType: ct.Coinbase,
    coinbaseBytes: t
  };
}
function u8(t, e, n) {
  if (t.byteLength != gr)
    throw Error(`Coinbase buffer size must be ${gr} bytes`);
  if (n.byteLength != Ec)
    throw Error(`VRF proof buffer size must be ${Ec} bytes`);
  return {
    type: X.Payload,
    payloadType: ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Bc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Bc || (Bc = {}));
function f8(t, e, n, r, s, i, o) {
  return {
    type: X.Payload,
    payloadType: ct.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function _p(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ct.TokenTransfer:
      e.push(Pt(t.recipient)), e.push(Qn(t.amount, !1, 8)), e.push(an(t.memo));
      break;
    case ct.ContractCall:
      e.push(an(t.contractAddress)), e.push(an(t.contractName)), e.push(an(t.functionName));
      const n = new Uint8Array(4);
      kr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pt(r));
      });
      break;
    case ct.SmartContract:
      e.push(an(t.contractName)), e.push(an(t.codeBody));
      break;
    case ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(an(t.contractName)), e.push(an(t.codeBody));
      break;
    case ct.PoisonMicroblock:
      break;
    case ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient));
      break;
    case ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient ? kp(t.recipient) : Bp())), e.push(t.vrfProof);
      break;
    case ct.TenureChange:
      e.push(Bt(t.tenureHash)), e.push(Bt(t.previousTenureHash)), e.push(Bt(t.burnViewHash)), e.push(Bt(t.previousTenureEnd)), e.push(kr(new Uint8Array(4), t.previousTenureBlocks)), e.push(zE(new Uint8Array(1), t.cause)), e.push(Bt(t.publicKeyHash));
      break;
  }
  return Dt(e);
}
function h8(t) {
  switch (t.readUInt8Enum(ct, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ct.TokenTransfer:
      const n = Ce(t), r = ne(t.readBytes(8), !1), s = Hp(t);
      return a8(n, r, s);
    case ct.ContractCall:
      const i = Es(t), o = Le(t), a = Le(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const v = Ce(t);
        c.push(v);
      }
      return c8(i, o, a, c);
    case ct.SmartContract:
      const h = Le(t), l = Le(t, 4, 1e5);
      return nh(h, l);
    case ct.VersionedSmartContract: {
      const b = t.readUInt8Enum(Ac, (P) => {
        throw new Error(`Cannot recognize ClarityVersion: ${P}`);
      }), v = Le(t), A = Le(t, 4, 1e5);
      return nh(v, A, b);
    }
    case ct.PoisonMicroblock:
      return l8();
    case ct.Coinbase: {
      const b = t.readBytes(gr);
      return rh(b);
    }
    case ct.CoinbaseToAltRecipient: {
      const b = t.readBytes(gr), v = Ce(t);
      return rh(b, v);
    }
    case ct.NakamotoCoinbase: {
      const b = t.readBytes(gr), v = Ce(t), A = t.readBytes(Ec);
      return u8(b, v, A);
    }
    case ct.TenureChange:
      const g = ut(t.readBytes(20)), f = ut(t.readBytes(20)), y = ut(t.readBytes(20)), w = ut(t.readBytes(32)), $ = t.readUInt32BE(), _ = t.readUInt8Enum(Bc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), U = ut(t.readBytes(20));
      return f8(g, f, y, w, $, _, U);
  }
}
class ea extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ar extends ea {
  constructor(e) {
    super(e);
  }
}
class ge extends ea {
  constructor(e) {
    super(e);
  }
}
class Io extends ea {
  constructor(e) {
    super(e);
  }
}
class dr extends ea {
  constructor(e) {
    super(e);
  }
}
var Ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ue || (Ue = {}));
function kc(t) {
  return Ap(ut(t.readBytes(Jo)));
}
function ss(t, e) {
  return {
    pubKeyEncoding: t,
    type: X.TransactionAuthField,
    contents: e
  };
}
function d8(t) {
  const e = t.readUInt8Enum(Ue, (n) => {
    throw new ge(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Ue.PublicKeyCompressed:
      return ss(Mt.Compressed, Cc(t));
    case Ue.PublicKeyUncompressed:
      return ss(Mt.Uncompressed, r8(Cc(t).data));
    case Ue.SignatureCompressed:
      return ss(Mt.Compressed, kc(t));
    case Ue.SignatureUncompressed:
      return ss(Mt.Uncompressed, kc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function jl(t) {
  return Bt(t.data);
}
function p8(t) {
  const e = [];
  switch (t.contents.type) {
    case X.PublicKey:
      e.push(t.pubKeyEncoding === Mt.Compressed ? Ue.PublicKeyCompressed : Ue.PublicKeyUncompressed), e.push($o(n8(t.contents.data)));
      break;
    case X.MessageSignature:
      e.push(t.pubKeyEncoding === Mt.Compressed ? Ue.SignatureCompressed : Ue.SignatureUncompressed), e.push(jl(t.contents));
      break;
  }
  return Dt(e);
}
function an(t) {
  switch (t.type) {
    case X.Address:
      return di(t);
    case X.Principal:
      return Up(t);
    case X.LengthPrefixedString:
      return As(t);
    case X.MemoString:
      return b8(t);
    case X.AssetInfo:
      return Np(t);
    case X.PostCondition:
      return x8(t);
    case X.PublicKey:
      return $o(t);
    case X.LengthPrefixedList:
      return Gl(t);
    case X.Payload:
      return _p(t);
    case X.TransactionAuthField:
      return p8(t);
    case X.MessageSignature:
      return jl(t);
  }
}
function g8() {
  return {
    type: X.Address,
    version: Eo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === St.SerializeP2PKH || e === St.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === St.SerializeP2WPKH || e === St.SerializeP2WSH || e === St.SerializeP2WSHNonSequential) && !r.every(Ms))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case St.SerializeP2PKH:
      return Os(t, N8(r[0].data));
    case St.SerializeP2WPKH:
      return Os(t, P8(r[0].data));
    case St.SerializeP2SH:
    case St.SerializeP2SHNonSequential:
      return Os(t, O8(n, r.map($o)));
    case St.SerializeP2WSH:
    case St.SerializeP2WSHNonSequential:
      return Os(t, D8(n, r.map($o)));
  }
}
function di(t) {
  const e = [];
  return e.push(Bt(hi(t.version, 1))), e.push(Bt(t.hash160)), Dt(e);
}
function Es(t) {
  const e = Zo(ut(t.readBytes(1))), n = ut(t.readBytes(20));
  return { type: X.Address, version: e, hash160: n };
}
function Up(t) {
  const e = [];
  return e.push(t.prefix), e.push(di(t.address)), t.prefix === ti.Contract && e.push(As(t.contractName)), Dt(e);
}
function y8(t) {
  const e = t.readUInt8Enum(ti, (s) => {
    throw new ge(`Unexpected Principal payload type: ${s}`);
  }), n = Es(t);
  if (e === ti.Standard)
    return { type: X.Principal, prefix: e, address: n };
  const r = Le(t);
  return {
    type: X.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function As(t) {
  const e = [], n = ks(t.content), r = n.byteLength;
  return e.push(Bt(hi(r, t.lengthPrefixBytes))), e.push(n), Dt(e);
}
function Le(t, e, n) {
  e = e || 1;
  const r = Zo(ut(t.readBytes(e))), s = Ul(t.readBytes(r));
  return Mr(s, e, n ?? 128);
}
function w8(t) {
  return Mr(t, 4, 1e5);
}
function sh(t) {
  if (t && Fp(t, mo))
    throw new Error(`Memo exceeds maximum length of ${mo} bytes`);
  return { type: X.MemoString, content: t };
}
function b8(t) {
  const e = [], n = ks(t.content), r = H8(ut(n), mo * 2);
  return e.push(Bt(r)), Dt(e);
}
function Hp(t) {
  let e = Ul(t.readBytes(mo));
  return e = e.replace(/\u0000*$/, ""), { type: X.MemoString, content: e };
}
function Np(t) {
  const e = [];
  return e.push(di(t.address)), e.push(As(t.contractName)), e.push(As(t.assetName)), Dt(e);
}
function Mc(t) {
  return {
    type: X.AssetInfo,
    address: Es(t),
    contractName: Le(t),
    assetName: Le(t)
  };
}
function Rl(t, e) {
  return {
    type: X.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Gl(t) {
  const e = t.values, n = [];
  n.push(Bt(hi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(an(r));
  return Dt(n);
}
function Pp(t, e, n) {
  const r = Zo(ut(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case X.Address:
        s.push(Es(t));
        break;
      case X.LengthPrefixedString:
        s.push(Le(t));
        break;
      case X.MemoString:
        s.push(Hp(t));
        break;
      case X.AssetInfo:
        s.push(Mc(t));
        break;
      case X.PostCondition:
        s.push(m8(t));
        break;
      case X.PublicKey:
        s.push(Cc(t));
        break;
      case X.TransactionAuthField:
        s.push(d8(t));
        break;
    }
  return Rl(s, n);
}
function x8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Up(t.principal)), (t.conditionType === le.Fungible || t.conditionType === le.NonFungible) && e.push(Np(t.assetInfo)), t.conditionType === le.NonFungible && e.push(Pt(t.assetName)), e.push(t.conditionCode), t.conditionType === le.STX || t.conditionType === le.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ar("The post-condition amount may not be larger than 8 bytes");
    e.push(Qn(t.amount, !1, 8));
  }
  return Dt(e);
}
function m8(t) {
  const e = t.readUInt8Enum(le, (o) => {
    throw new ge(`Could not read ${o} as PostConditionType`);
  }), n = y8(t);
  let r, s, i;
  switch (e) {
    case le.STX:
      return r = t.readUInt8Enum(Js, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ut(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: le.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case le.Fungible:
      return s = Mc(t), r = t.readUInt8Enum(Js, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ut(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: le.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case le.NonFungible:
      s = Mc(t);
      const o = Ce(t);
      return r = t.readUInt8Enum($c, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: le.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Je(t, e) {
  return Dt([t, e]);
}
function S8(t) {
  return new Uint8Array([t.type]);
}
function E8(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : Je(t.type, Pt(t.value));
}
function A8(t) {
  const e = new Uint8Array(4);
  return kr(e, t.buffer.length, 0), Je(t.type, Qo(e, t.buffer));
}
function $8(t) {
  const e = _l(ME(t.value, BigInt(KE)), yp);
  return Je(t.type, e);
}
function I8(t) {
  const e = _l(t.value, yp);
  return Je(t.type, e);
}
function v8(t) {
  return Je(t.type, di(t.address));
}
function L8(t) {
  return Je(t.type, Qo(di(t.address), As(t.contractName)));
}
function C8(t) {
  return Je(t.type, Pt(t.value));
}
function B8(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pt(r);
    e.push(s);
  }
  return Je(t.type, Dt(e));
}
function k8(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Mr(s);
    e.push(As(i));
    const o = Pt(t.data[s]);
    e.push(o);
  }
  return Je(t.type, Dt(e));
}
function Op(t, e) {
  const n = [], r = e == "ascii" ? pp(t.data) : ks(t.data), s = new Uint8Array(4);
  return kr(s, r.length, 0), n.push(s), n.push(r), Je(t.type, Dt(n));
}
function M8(t) {
  return Op(t, "ascii");
}
function T8(t) {
  return Op(t, "utf8");
}
function Pt(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return S8(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return E8(t);
    case H.Buffer:
      return A8(t);
    case H.UInt:
      return I8(t);
    case H.Int:
      return $8(t);
    case H.PrincipalStandard:
      return v8(t);
    case H.PrincipalContract:
      return L8(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return C8(t);
    case H.List:
      return B8(t);
    case H.Tuple:
      return k8(t);
    case H.StringASCII:
      return M8(t);
    case H.StringUTF8:
      return T8(t);
    default:
      throw new ar("Unable to serialize. Invalid Clarity Value.");
  }
}
function _8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ih = /* @__PURE__ */ new Map();
function Dp(t, e) {
  const n = ih.get(t);
  if (n !== void 0)
    return n(e);
  const r = _8(t);
  return ih.set(t, r), Dp(t, e);
}
class Rs {
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
    const n = this.readBytes(e).slice().reverse(), r = ut(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ut(n);
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
    if (Dp(e, r))
      return r;
    throw n(r);
  }
}
function Ce(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Rs(Bt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Rs(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new ge(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return WA(e.readBytes(16));
    case H.UInt:
      return Ao(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return Cp(e.readBytes(r));
    case H.BoolTrue:
      return vp();
    case H.BoolFalse:
      return Lp();
    case H.PrincipalStandard:
      const s = Es(e);
      return GA(s);
    case H.PrincipalContract:
      const i = Es(e), o = Le(e);
      return Ip(i, o);
    case H.ResponseOk:
      return YA(Ce(e));
    case H.ResponseErr:
      return XA(Ce(e));
    case H.OptionalNone:
      return Bp();
    case H.OptionalSome:
      return kp(Ce(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ce(e));
      return ZA(c);
    case H.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const $ = Le(e).content;
        if ($ === void 0)
          throw new ge('"content" is undefined');
        h[$] = Ce(e);
      }
      return Lc(h);
    case H.StringASCII:
      const l = e.readUInt32BE(), g = HE(e.readBytes(l));
      return Jr(g);
    case H.StringUTF8:
      const f = e.readUInt32BE(), y = Ul(e.readBytes(f));
      return QA(y);
    default:
      throw new ge("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const U8 = (t) => t.length % 2 == 0 ? t : `0${t}`, H8 = (t, e) => t.padEnd(e, "0"), Fp = (t, e) => t ? ks(t).length > e : !1;
function Tc(t) {
  return i0(t);
}
const ei = (t) => uA(Dl(t)), Vl = (t) => ut(jA(t)), N8 = (t) => ut(ei(t)), P8 = (t) => {
  const e = ei(t), n = Qo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ei(n);
  return ut(r);
}, O8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = ei(r);
  return ut(s);
}, D8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = Dl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Dt(i), a = ei(o);
  return ut(a);
};
function F8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function jp(t) {
  const e = Pt(t);
  return `0x${ut(e)}`;
}
function j8(t) {
  return Ce(t);
}
const os = (t) => {
  try {
    return Dr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Kl() {
  return {
    type: X.MessageSignature,
    data: ut(new Uint8Array(Jo))
  };
}
function zp(t, e, n, r) {
  const s = zl(0, t, 1, [Ss(e)]).hash160, i = Ms(Ss(e)) ? Mt.Compressed : Mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ne(n, !1),
    fee: ne(r, !1),
    keyEncoding: i,
    signature: Kl()
  };
}
function ni(t) {
  return "signature" in t;
}
function oh(t) {
  return t === St.SerializeP2SH || t === St.SerializeP2WSH;
}
function z8(t) {
  return t === St.SerializeP2SHNonSequential || t === St.SerializeP2WSHNonSequential;
}
function ah(t) {
  const e = Tc(t);
  return e.nonce = 0, e.fee = 0, ni(e) ? e.signature = Kl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function R8(t) {
  const e = [
    t.hashMode,
    Bt(t.signer),
    Qn(t.nonce, !1, 8),
    Qn(t.fee, !1, 8),
    t.keyEncoding,
    jl(t.signature)
  ];
  return Dt(e);
}
function G8(t) {
  const e = [
    t.hashMode,
    Bt(t.signer),
    Qn(t.nonce, !1, 8),
    Qn(t.fee, !1, 8)
  ], n = Rl(t.fields);
  e.push(Gl(n));
  const r = new Uint8Array(2);
  return FE(r, t.signaturesRequired, 0), e.push(r), Dt(e);
}
function V8(t, e) {
  const n = ut(e.readBytes(20)), r = BigInt(`0x${ut(e.readBytes(8))}`), s = BigInt(`0x${ut(e.readBytes(8))}`), i = e.readUInt8Enum(Mt, (a) => {
    throw new ge(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === St.SerializeP2WPKH && i != Mt.Compressed)
    throw new ge("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = kc(e);
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
  const n = ut(e.readBytes(20)), r = BigInt("0x" + ut(e.readBytes(8))), s = BigInt("0x" + ut(e.readBytes(8))), i = Pp(e, X.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case X.PublicKey:
        Ms(u.contents) || (o = !0);
        break;
      case X.MessageSignature:
        if (u.pubKeyEncoding === Mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new dr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === St.SerializeP2WSH || t === St.SerializeP2WSHNonSequential))
    throw new dr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ca(t) {
  return ni(t) ? R8(t) : G8(t);
}
function Ba(t) {
  const e = t.readUInt8Enum(St, (n) => {
    throw new ge(`Could not parse ${n} as AddressHashMode`);
  });
  return e === St.SerializeP2PKH || e === St.SerializeP2WPKH ? V8(e, t) : K8(e, t);
}
function Rp(t, e, n, r) {
  const i = t + ut(new Uint8Array([e])) + ut(Qn(n, !1, 8)) + ut(Qn(r, !1, 8));
  if (Bt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Vl(Bt(i));
}
function Gp(t, e, n) {
  const r = 33 + Jo, s = Ms(e) ? Mt.Compressed : Mt.Uncompressed, i = t + U8(s.toString(16)) + n.data, o = Bt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Vl(o);
}
function q8(t, e, n, r, s) {
  const i = Rp(t, e, n, r), o = i8(s, i), a = o8(s), c = Gp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Vp(t, e, n, r, s, i) {
  const o = Rp(t, e, n, r), a = Ss(JA(o, i, s)), c = Gp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function W8() {
  const t = zp(St.SerializeP2PKH, "", 0, 0);
  return t.signer = g8().hash160, t.keyEncoding = Mt.Compressed, t.signature = Kl(), t;
}
function ch(t, e, n) {
  return ni(t) ? X8(t, e, n) : Y8(t, e, n);
}
function X8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Vp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = zl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new dr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Y8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case X.PublicKey:
        Ms(c.contents) || (i = !0), r.push(c.contents);
        break;
      case X.MessageSignature:
        c.pubKeyEncoding === Mt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Vp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (oh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new dr("Too many signatures");
        break;
    }
  if (oh(t.hashMode) && o !== t.signaturesRequired || z8(t.hashMode) && o < t.signaturesRequired)
    throw new dr("Incorrect number of signatures");
  if (i && (t.hashMode === St.SerializeP2WSH || t.hashMode === St.SerializeP2WSHNonSequential))
    throw new dr("Uncompressed keys are not allowed in this hash mode");
  const a = zl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new dr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Kp(t) {
  return {
    authType: Ut.Standard,
    spendingCondition: t
  };
}
function qp(t, e) {
  return {
    authType: Ut.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || zp(St.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function lh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ut.Standard:
        return Kp(ah(t.spendingCondition));
      case Ut.Sponsored:
        return qp(ah(t.spendingCondition), W8());
      default:
        throw new Io("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Z8(t, e) {
  switch (t.authType) {
    case Ut.Standard:
      return ch(t.spendingCondition, e, Ut.Standard);
    case Ut.Sponsored:
      return ch(t.spendingCondition, e, Ut.Standard);
    default:
      throw new Io("Invalid origin auth type");
  }
}
function Q8(t, e) {
  switch (t.authType) {
    case Ut.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ne(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ut.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ne(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function J8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ne(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function t6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ne(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e6(t, e) {
  const n = {
    ...e,
    nonce: ne(e.nonce, !1),
    fee: ne(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function n6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ut.Standard:
      e.push(Ca(t.spendingCondition));
      break;
    case Ut.Sponsored:
      e.push(Ca(t.spendingCondition)), e.push(Ca(t.sponsorSpendingCondition));
      break;
  }
  return Dt(e);
}
function r6(t) {
  const e = t.readUInt8Enum(Ut, (r) => {
    throw new ge(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ut.Standard:
      return n = Ba(t), Kp(n);
    case Ut.Sponsored:
      n = Ba(t);
      const r = Ba(t);
      return qp(n, r);
  }
}
class s6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ne(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? GE, this.postConditionMode = i ?? ms.Deny, this.postConditions = s ?? Rl([]), o)
      this.anchorMode = XE(o);
    else
      switch (r.payloadType) {
        case ct.Coinbase:
        case ct.CoinbaseToAltRecipient:
        case ct.NakamotoCoinbase:
        case ct.PoisonMicroblock:
        case ct.TenureChange:
          this.anchorMode = ce.OnChainOnly;
          break;
        case ct.ContractCall:
        case ct.SmartContract:
        case ct.VersionedSmartContract:
        case ct.TokenTransfer:
          this.anchorMode = ce.Any;
          break;
      }
  }
  signBegin() {
    const e = Tc(this);
    return e.auth = lh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Tc(this);
    return e.auth = lh(e.auth), e.txid();
  }
  verifyOrigin() {
    return Z8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ut.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ut.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ut.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !ni(n)) {
      const r = Ms(e);
      n.fields.push(ss(r ? Mt.Compressed : Mt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = q8(n, r, e.fee, e.nonce, s);
    return ni(e) ? e.signature = i : e.fields.push(ss(s.data.byteLength === gp ? Mt.Compressed : Mt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Vl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ut.Sponsored)
      throw new Io("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e6(this.auth, e);
  }
  setFee(e) {
    this.auth = Q8(this.auth, e);
  }
  setNonce(e) {
    this.auth = J8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ut.Sponsored)
      throw new Io("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ar('"version" is undefined');
    if (this.chainId === void 0)
      throw new ar('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ar('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ar('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ar('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return kr(n, this.chainId, 0), e.push(n), e.push(n6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Gl(this.postConditions)), e.push(_p(this.payload)), Dt(e);
  }
}
function ql(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Rs(Bt(t.slice(2))) : e = new Rs(Bt(t)) : t instanceof Uint8Array ? e = new Rs(t) : e = t;
  const n = e.readUInt8Enum(So, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = r6(e), i = e.readUInt8Enum(ce, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ms, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Pp(e, X.PostCondition), c = h8(e);
  return new s6(n, s, c, a, o, i, r);
}
const i6 = KA, Gs = Ao, o6 = Cp;
const a6 = /* @__PURE__ */ new Set([4001, -31001]), c6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], l6 = ["result", "data", "payload", "response", "params"], uh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], na = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Rr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, fn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, u6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wp = (t) => {
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
}, Xp = (t) => t ? Wp(Rr()).some(
  (e) => {
    var n;
    return e.id === t && (na(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Yp = () => {
  if (typeof window > "u")
    return;
  const t = Rr(), e = Wp(t).filter(
    (n) => {
      var r;
      return na(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = fn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of c6) {
    const r = fn(t, n) ?? (t === window ? void 0 : fn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, f6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Rr(), n = fn(e, t) ?? (e === window ? void 0 : fn(window, t)) ?? zo(t);
  if (n)
    return n;
  if (na(t) || Xp(t))
    return Yp();
}, Gi = (t, e) => {
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
const Zp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, pe = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, p6 = (t) => {
  const e = pe(t);
  if (!e)
    return null;
  const n = Zp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, g6 = (t) => {
  const e = pe(t);
  if (!e)
    return null;
  const n = Zp(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, _c = (t, e = "mainnet") => {
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
      return _c(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return _c(r, e);
  }
  return e;
}, yr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ri = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return os(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ri(s, e + 1);
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
    const i = ri(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && os(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && os(n.testnet) ? n.testnet.trim() : null;
}, fh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Qp = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && a6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Tr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = pe(n == null ? void 0 : n.message) ?? pe(e.message) ?? pe(e.error) ?? pe(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, $s = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Tr(e);
    if (e.status === "error")
      throw Tr(e.result ?? e);
  }
  return t;
}, hh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return $s(r);
  } catch (r) {
    throw Tr(r);
  }
}, Jp = () => Yp(), Wl = () => {
  if (typeof window > "u")
    return;
  const t = Rr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = fn(t, e) ?? (t === window ? void 0 : fn(window, e));
    if (n)
      return n;
  }
}, dh = () => {
  if (typeof window > "u")
    return;
  const t = Wl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Rr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = fn(e, n) ?? (e === window ? void 0 : fn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, to = (t) => {
  var r, s;
  const e = Ar();
  if (na(e) || Xp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Rr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Jp();
}, ka = (t) => {
  const e = g6(t);
  if (!e)
    return null;
  try {
    const n = ql(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, vo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ka(t), r = p6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? pe(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = vo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of uh)
    if (ka(s[a])) {
      i = pe(s[a]);
      break;
    }
  const o = pe(s.txId) || pe(s.txid) || pe(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? pe(s.txRaw) ?? void 0
    };
  for (const a of uh) {
    const c = ka(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: pe(s[a]) ?? void 0
      };
  }
  for (const a of l6) {
    const c = s[a], u = vo(c, e + 1);
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
}, Ma = (t) => {
  const e = vo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, y6 = (t) => {
  const e = vo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, w6 = (t) => ({
  ...t,
  fee: yr(t.fee),
  nonce: yr(t.nonce),
  sponsored: t.sponsored === !0
}), ph = (t) => ({
  recipient: t.recipient,
  amount: yr(t.amount) ?? "0",
  memo: t.memo,
  network: _c(t.network),
  address: t.stxAddress,
  fee: yr(t.fee),
  nonce: yr(t.nonce),
  sponsored: t.sponsored ?? !1
}), tg = "WALLET_ADDRESS_MISMATCH", b6 = 45e3;
let Vs = null;
const Uc = (t) => {
  t && (Vs = { address: t, at: Date.now() });
}, x6 = () => {
  Vs = null;
}, m6 = () => Vs && Date.now() - Vs.at <= b6 ? Vs.address : null, S6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, E6 = async (t) => {
  x6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = $s(await t.request("wallet_connect")), n = ri(e);
  return Uc(n), n;
}, A6 = async (t, e, n, r) => {
  try {
    return $s(await t.request(e, n));
  } catch (s) {
    const i = Tr(s);
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
        { code: o ? tg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return $s(await t.request(e, n));
    } catch (a) {
      throw Tr(a);
    }
  }
};
let gh = 3e4;
const $6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${gh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, gh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, I6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: tg }
      );
    return c;
  }, s = m6();
  if (s)
    return Gi(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Gi(n, "account-read");
  try {
    const c = $s(
      await $6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ri(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Qp(c))
      throw Tr(c);
    Gi(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Uc(i), r(i, "wallet_getAccount");
  let o;
  Gi(n, "account-reconnect");
  try {
    o = $s(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Tr(c);
  }
  const a = ri(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Uc(a), r(a, "wallet_connect");
}, v6 = async (t, e) => {
  if (!to(t)) {
    const i = await hh(
      t,
      "stx_transferStx",
      ph(e)
    );
    return Ma(i);
  }
  const n = Wl();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await hh(
      n,
      "stx_transferStx",
      ph(e)
    );
    return Ma(i);
  }
  const r = Jp();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await I6(r, e.stxAddress);
  const s = await A6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: yr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: yr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ma(s);
}, L6 = () => Ar(), eg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Ar(), e = t ? f6(t) : void 0;
  if (e)
    return e;
  const n = Rr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, C6 = (t, e) => {
  const n = eg(), r = w6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, y6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Fi(r, e);
  if (to(n) && !Wl()) {
    const s = dh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ar(),
        route: "legacy-transaction-request"
      }), Fi(r, s);
  }
  return void v6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (fh(s) && to(n)) {
      const a = dh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ar(),
          route: "legacy-transaction-request"
        }), Fi(r, a);
        return;
      }
    }
    if (fh(s) && !to(n)) {
      Fi(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Qp(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, yh = (t) => jp(t).replace(/^0x/, ""), wh = "This wallet cannot sign messages. Try Xverse or Leather.", bh = (t) => typeof (t == null ? void 0 : t.request) == "function", xh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", B6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, k6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function M6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: yh(e.message),
    domain: yh(e.domain)
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
    network: Yo(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _6(t) {
  var s, i;
  const e = L6() || "", n = /xverse/i.test(e);
  let r = eg();
  if (n && !xh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (xh(r))
    try {
      return await T6(r, t);
    } catch (o) {
      if (n || !bh(r) || !k6(o)) throw o;
    }
  if (!n && bh(r))
    try {
      return await M6(r, t);
    } catch (o) {
      throw B6(o) ? new Error(wh) : o;
    }
  throw new Error(wh);
}
const mh = 1000000n, Ks = 1000000n, Hc = 50n, Lo = 3000n, Xl = 300n, U6 = 3000n, H6 = 50000n, Sh = 200n, si = (t) => t + Hc;
function Rn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / mh}.${(n % mh).toString().padStart(6, "0")}`;
}
function N6(t, e = Xl) {
  return t <= Lo ? 0 : Number((t - Lo) / si(e));
}
function Eh(t, e = 0n) {
  const n = Ks - t - e;
  return n > 0n ? n : 0n;
}
function P6(t, e = Xl) {
  return t > Ks ? "over" : t < Lo + si(e) ? "empty" : t < H6 ? "low" : "ok";
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
const ng = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ta = 3, z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Nc, rg] = ng.split("."), $e = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Pc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function R6(t) {
  return $e(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function _r(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function sg(t, e = []) {
  const n = await _r(`/v2/contracts/call-read/${Nc}/${rg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Nc, arguments: e.map((r) => "0x" + $e(Pt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return ln(Ce(n.result));
}
async function G6() {
  const t = await _r(`/v2/contracts/source/${Nc}/${rg}?proof=0`);
  if (typeof t.source != "string" || await R6(t.source) !== D6) throw Error("Deployed source does not match the tested helper.");
  if (j6(await sg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ig(t) {
  return t.startsWith("SP") && os(t) && !t.includes(".");
}
async function V6(t) {
  var r;
  if (!ig(t)) throw Error("Invalid mainnet wallet address.");
  const e = await _r(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await _r(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function K6(t) {
  const e = await _r(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function q6(t, e) {
  var s, i;
  const n = await sg("get-owner", [Gs(t), Gs(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !ig(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function W6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Pc(t), signal: AbortSignal.timeout(15e3) });
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
  const e = ql(Pc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || rs(Os(Eo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || rs(r.contractAddress) + "." + r.contractName.content !== ng || r.functionName.content !== "play" || r.functionArgs.length !== 3 || $e(Pt(r.functionArgs[0])) !== $e(Pt(Gs(t.core))) || $e(Pt(r.functionArgs[1])) !== $e(Pt(Gs(t.song))) || $e(Pt(r.functionArgs[2])) !== $e(Pt(o6(Pc(t.id)))) || t.amount !== "50" || e.postConditionMode !== ms.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Js.Equal || i.principal.prefix !== 2 || rs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || rs(r.contractAddress) + "." + r.contractName.content !== z6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || $e(Pt(r.functionArgs[0])) !== $e(Pt(Gs(t.song))) || typeof t.liked != "boolean" || $e(Pt(r.functionArgs[1])) !== $e(Pt(i6(t.liked))) || t.amount !== "0" || e.postConditionMode !== ms.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || ln(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const Z6 = "xtrata.xyz/radio/listening-wallet", Q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Co = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && os(t), J6 = (t) => ({
  domain: Lc({ name: Jr(Z6), version: Jr("1"), "chain-id": Ao(1) }),
  message: Lc({
    purpose: Jr(Q6),
    main: Jr(t.main),
    listening: Jr(t.listening),
    issued: Ao(t.issued)
  })
}), Ah = ["prepared", "signed", "unknown", "pending"], t5 = 30 * 6e4, Zr = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, e5 = 3e3, $h = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function n5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, h = !1, l = !1, g = null, f = !1, y = "", w = "", $, _ = null, U, b = [], v, A = -1 / 0;
  const P = /* @__PURE__ */ new Set();
  let G = null, O = !1, R = 0, x = !1, L = !1, N = !1, q = !1, Y = 0, j = null, Yt = Promise.resolve();
  const Rt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Xl.toString()), Zt = (S) => !!i && !(i.features ?? []).includes(S), m = (S, M) => `xtrata.ppp.v1.${S}:${M}`, B = (S = i == null ? void 0 : i.address) => {
    if (!S) return [];
    try {
      const M = JSON.parse(t.store.get(m("entries", S)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, tt = (S) => {
    const M = [S, ...B(S.address).filter((V) => !(V.txid === S.txid && V.kind === S.kind))].slice(0, 200);
    t.store.set(m("entries", S.address), JSON.stringify(M));
  }, gt = (S = i == null ? void 0 : i.address) => !!S && t.store.get(m("on", S)) !== "0", ht = (S) => {
    i != null && i.address && t.store.set(m("on", i.address), S ? "1" : "0");
  }, Et = () => B().filter((S) => Ah.includes(S.status)), re = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(m("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, tn = (S) => {
    i != null && i.address && t.store.set(m("deposit", i.address), JSON.stringify(S));
  }, gn = () => Et().filter((S) => t.now() - S.created > t5 && P.has(S.txid)), jt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), yn = (S) => m("return-to", S), Gr = (S = i == null ? void 0 : i.address) => {
    if (!S) return;
    const M = t.store.get(yn(S));
    return M && Co(M) && M !== S ? M : void 0;
  }, Oe = (S = i == null ? void 0 : i.address) => G && G.for === S ? G.res : null;
  function d() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const S = Gr();
    if (S) return { to: S, kind: "chosen" };
    const M = Oe();
    if (M != null && M.ok && M.funder) return { to: M.funder, kind: "funder" };
  }
  function I() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const S = t.main();
    if (!jt()) {
      if (!S) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : !jt() && i.linked !== S ? "link" : o === void 0 ? "loading" : o > Ks ? "over" : o < Lo + si(Rt()) ? "fund" : "ready" : "loading";
  }
  const T = () => {
    var S, M, V, K;
    return {
      step: I(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : P6(o, Rt()),
      playsLeft: o === void 0 ? 0 : N6(o, Rt()),
      allowance: o === void 0 ? Ks : Eh(o, BigInt(((S = re()) == null ? void 0 : S.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: gt(),
      entries: B(),
      depositTxid: ((M = re()) == null ? void 0 : M.txid) ?? $,
      depositPending: !!re(),
      walletOutdated: Zt("like"),
      linkedListening: v && v === t.main() ? b.map((Q) => Q.listening) : [],
      serverLinked: !!_ && U === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: gn().length,
      armed: N,
      solo: jt(),
      returnTo: (V = d()) == null ? void 0 : V.to,
      returnToKind: (K = d()) == null ? void 0 : K.kind,
      funderState: (() => {
        const Q = Oe();
        return Q ? Q.ok ? Q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Q = Oe();
        return !!Q && Q.ok && Q.distinct > 1;
      })(),
      walletCannotSolo: jt() && Zt("standalone")
    };
  }, z = (S, M = "") => {
    y = S, w = M, t.changed();
  };
  async function et(S, M) {
    if (!c) {
      c = S, w = "", t.changed();
      try {
        await M();
      } catch (V) {
        const K = V instanceof Error ? V.message : String(V);
        w = /Cancelled in the listening wallet/.test(K) ? "" : K, w || (y = "Not now. Nothing was signed.", q = !0);
      } finally {
        c = null, await ie(!0);
      }
    }
  }
  const It = () => !!(e != null && e.enabled) && e.here && (jt() || !!t.main() && e.allowed);
  async function se() {
    if (!It()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Vt(S = !1) {
    i != null && i.address && (!S && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function xe(S) {
    if ((v !== S || t.now() - A >= 6e4) && (b = await t.links(S), v = S, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === S) return;
    const M = `${S}:${i.address}`;
    U === M && _ || (_ = b.find((V) => V.listening === i.address) ?? null, U = M);
  }
  async function wn() {
    const S = i == null ? void 0 : i.address;
    if (!jt() || !S || i != null && i.linked || !t.funder || O || !o || o <= 0n) return;
    const M = Oe(S);
    if (M != null && M.ok && M.funder) return;
    const V = M != null && M.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, R - 1), 30 * 6e4);
    if (!(G && G.for === S && t.now() - G.at < V)) {
      O = !0;
      try {
        G = { for: S, res: await t.funder(S), at: t.now() };
      } catch {
        G = { for: S, res: { ok: !1 }, at: t.now() };
      } finally {
        O = !1;
      }
      R = G.res.ok ? 0 : R + 1;
    }
  }
  async function bn() {
    const S = i == null ? void 0 : i.address;
    if (!S) return;
    let M;
    for (const K of Et())
      try {
        const Q = await t.chain.transaction(K.txid);
        if (!Q) {
          if (P.add(K.txid), t.now() - K.created > 15 * 6e4 && (M ?? (M = await t.chain.confirmedNonce(S))), M !== void 0 && M > BigInt(K.nonce)) {
            tt({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), tt({ ...K, status: "pending" });
            } catch (k) {
              Zr(k) && tt({ ...K, status: "failed", note: k.message, raw: void 0 });
            }
          continue;
        }
        P.delete(K.txid);
        const vt = String(Q.tx_status);
        vt === "success" && Q.canonical !== !1 && Q.is_unanchored === !1 ? (tt({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(Q.fee_rate ?? K.fee), raw: void 0 }), K.kind === "like" && (f = !0)) : vt.startsWith("abort_") || vt.startsWith("dropped_") ? tt({ ...K, status: "failed", note: vt, raw: void 0 }) : K.status !== "pending" && tt({ ...K, status: "pending" });
      } catch {
      }
    const V = re();
    if (V)
      try {
        const K = await t.chain.transaction(V.txid), Q = String((K == null ? void 0 : K.tx_status) ?? "");
        (Q === "success" && K.is_unanchored === !1 || Q.startsWith("abort_") || Q.startsWith("dropped_") || !K && t.now() - V.at > 2 * 36e5) && (tn(null), a = -1 / 0);
      } catch {
      }
  }
  async function ie(S = !1) {
    var M;
    try {
      const V = t.main();
      if ((S || !e || r !== V || t.now() - n > 3e5) && (e = await t.config(V), n = t.now(), r = V), !e.enabled || !e.here || !jt() && (!V || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), N && yt(), t.changed();
        return;
      }
      await se(), i = await s.request("listening.status"), V && e.allowed && await xe(V), await Vt(S), await wn(), await bn();
    } catch (V) {
      w = V instanceof Error ? V.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (I() === "locked" ? me() : N && yt(), f) {
      f = !1;
      try {
        (M = t.likesChanged) == null || M.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function Tt(S, M) {
    const V = !(i != null && i.address) || gt(i.address);
    await S.request("listening.unlock", { mode: "unlock", terms: V ? At() : void 0, anyPasskey: M }), i = await S.request("listening.status"), V && (gt(i.address) ? await Nt() : await S.request("listening.stop")), z(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const K = g;
    g = null, K && t.now() - K.at < 12e4 && setTimeout(() => void ie(!0).then(() => xn(K)), 0);
  }
  function me() {
    N || c || q || Y >= 3 || !s || !(i != null && i.address) || (N = !0, Yt = (async () => {
      try {
        await Tt(s, !1), Y = 0;
      } catch (S) {
        const M = S instanceof Error ? S.message : String(S);
        /Cancelled in the listening wallet/.test(M) ? j || (q = !0, z("Not now. Nothing was signed.")) : /did not answer/.test(M) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Y++, w = M);
      } finally {
        N = !1;
        const S = j;
        j = null, S ? await S() : await ie(!0);
      }
    })());
  }
  async function yt(S) {
    N && (j = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Yt), S && await S(), t.changed();
  }
  const At = () => ({
    fee: Rt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ks.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Nt() {
    if (!(i != null && i.address)) return !1;
    if (L || (L = await t.tabLock(i.address)), !L)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Se = {
    forceRefresh: () => ie(!0),
    create: () => et("Waiting for your passkey…", async () => {
      const S = await se();
      await S.request("listening.unlock", { mode: "create", terms: At() }), i = await S.request("listening.status"), ht(!0), z(jt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Nt();
    }),
    unlock: (S = !1) => {
      const M = () => et("Waiting for your passkey…", async () => Tt(await se(), S));
      return N ? S ? Zt("cancel") ? (z("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : yt(async () => {
        (I() === "locked" || I() === "intro") && await M();
      }) : Yt : M();
    },
    link: () => et("Sign in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const M = (await t.links(S)).find((V) => V.listening === i.address);
      if (M)
        await s.request("listening.link", { main: S, issued: M.issued, mainSignature: M.mainSignature });
      else {
        const V = { main: S, listening: i.address, issued: t.now() }, K = await t.signWithMain(S, J6(V)), Q = await s.request("listening.link", { main: S, issued: V.issued, mainSignature: K });
        await t.saveLink({ ...V, mainSignature: K, listeningSignature: Q.listeningSignature }), A = -1 / 0;
      }
      z("Linked ✓");
    }),
    deposit: () => et("Approve the deposit in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (re()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Vt(!0);
      const M = Eh(o ?? 0n);
      if (M <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      $ = await t.deposit(S, i.address, M), $ && tn({ txid: $, amount: M.toString(), at: t.now() }), z("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => et("Confirm in the listening wallet…", async () => {
      await Nt(), await s.request("listening.approveSession", At()), ht(!0), z("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => et("Clearing…", async () => {
      for (const S of gn())
        await t.chain.transaction(S.txid) || tt({ ...S, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      z("Cleared ✓");
    }),
    switchOff: () => et("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), ht(!1), z("Paying is off. Music stays free.");
    }),
    lock: () => et("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, z("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (S) => {
      const M = String(S ?? "").trim();
      if (!(i != null && i.address)) return z("", "Unlock the listening wallet first.");
      if (!Co(M)) return z("", "Enter a standard mainnet address (it starts with SP).");
      if (M === i.address) return z("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(yn(i.address), M), z("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(yn(i.address), ""), t.changed();
    },
    returnFunds: (S) => et("Check the return in the listening wallet…", async () => {
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const M = d();
      if (!M) throw new Error(jt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (M.kind !== "linked" && Zt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Et().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: V, nonce: K } = await t.chain.account(i.address);
      o = V;
      const Q = await s.request("listening.prepareReturn", {
        mode: S,
        balance: V.toString(),
        nonce: K.toString(),
        fee: U6.toString(),
        ...M.kind === "linked" ? {} : { destination: M.to }
      });
      if (Q.recipient !== M.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const vt = ql(Q.raw);
      if (ln(vt.payload.recipient).value !== M.to || String(vt.payload.amount) !== Q.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const k = {
        id: $h(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: Q.recipient,
        amount: Q.amount,
        fee: Q.fee,
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: Q.raw,
        txid: Q.txid
      };
      t.validate(k), tt(k);
      try {
        await t.chain.broadcast(Q.raw, Q.txid), tt({ ...k, status: "pending" });
      } catch (J) {
        throw tt({ ...k, status: "unknown", note: J.message }), J;
      }
      S === "all" && ht(!1), z(S === "all" ? M.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  };
  async function tr(S) {
    if (!(u || c || h || l)) {
      u = !0;
      try {
        if (await ie(), I() !== "ready" || !gt() || !(i != null && i.session) || i.session.playsLeft < 1 || !L || Et().length) return;
        x || (await t.chain.verify(), x = !0);
        const V = i.address, { balance: K, nonce: Q } = await t.chain.account(V);
        o = K, a = t.now();
        const vt = await t.chain.owner(Ta, S.song);
        if (vt === V || vt === t.main()) return;
        const k = await s.request("listening.signPlay", {
          core: Ta,
          song: S.song,
          receipt: S.id,
          fee: Rt().toString(),
          nonce: Q.toString(),
          balance: K.toString()
        }), J = {
          id: S.id,
          address: V,
          kind: "play",
          core: Ta,
          song: S.song,
          recipient: vt,
          amount: "50",
          fee: Rt().toString(),
          nonce: Q.toString(),
          created: t.now(),
          status: "signed",
          raw: k.raw,
          txid: k.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...S.title ? { title: String(S.title).slice(0, 120) } : {},
          ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
        };
        t.validate(J), tt(J);
        const Ft = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`;
        try {
          await t.chain.broadcast(k.raw, k.txid), tt({ ...J, status: "pending" }), y = `♪ Paid ${Ft}`, w = "";
        } catch (Ee) {
          tt({ ...J, status: Zr(Ee) ? "failed" : "unknown", note: Ee.message, ...Zr(Ee) ? { raw: void 0 } : {} }), w = Ee.message;
        }
        i = await s.request("listening.status");
      } catch (M) {
        y = "This song played free: " + (M instanceof Error ? M.message : "payment unavailable");
      } finally {
        u = !1, t.changed();
      }
    }
  }
  function Ts(S) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(I()) || Zt("like") ? !1 : (xn(S), !0);
  }
  async function xn(S) {
    const M = S.title ? `“${S.title}”` : `song #${S.song}`, V = (Be) => {
      var en;
      w = Be, y = "";
      try {
        (en = t.likeFailed) == null || en.call(t, S.song);
      } catch {
      }
      t.changed();
    }, K = I(), Q = t.main(), vt = jt() ? i == null ? void 0 : i.address : Q;
    if (K === "locked") {
      g = { ...S, at: t.now() }, z(`Unlock to like ${M}. It sends straight after.`);
      return;
    }
    if (K === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (jt() && Zt("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (K === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (K === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (K !== "ready" || !vt) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!L) return V("Pay-per-play is running in another tab. Like from that tab.");
    const k = B().find((Be) => Be.kind === "like" && Be.song === S.song);
    if (k && Ah.includes(k.status))
      return V(`Your last like for ${M} is still on its way. It can change again once it confirms.`);
    if (h) return V("One like at a time: your last one is still being sent.");
    if ((k == null ? void 0 : k.status) === "confirmed" && t.now() - (k.confirmedAt ?? 0) < e5)
      return V(`Your like for ${M} has only just confirmed. Try again in a moment.`);
    let J;
    l = !0;
    try {
      J = t.likeState ? (await t.likeState(vt, S.song)).by : S.likedBy ?? [];
    } catch {
      J = S.likedBy;
    } finally {
      l = !1;
    }
    if (!J) return V(`Could not check ${M} right now. Try the heart again.`);
    const Ft = i.address, Ee = J.includes(Ft);
    if (!Ee && J.length) return V(jt() ? `${M} was liked from another wallet of yours. Unlike it there.` : `${M} was liked from your main wallet${J.includes(Q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await er({ song: S.song, liked: !Ee, title: S.title, artist: S.artist });
  }
  async function er(S) {
    var K, Q, vt;
    if (h) {
      z("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const M = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`, V = t.wait ?? ((k) => new Promise((J) => setTimeout(J, k)));
    try {
      z(`${S.liked ? "Liking" : "Unliking"} ${M}…`);
      const k = t.now() + 12e4;
      for (; u || Et().length; ) {
        if (t.now() > k) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await ie(!0);
      }
      if (I() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const J = i.address, { balance: Ft, nonce: Ee } = await t.chain.account(J);
      o = Ft, a = t.now();
      const Be = await s.request("listening.signLike", {
        song: S.song,
        liked: S.liked,
        fee: Sh.toString(),
        nonce: Ee.toString(),
        balance: Ft.toString()
      }), en = {
        id: $h(),
        address: J,
        kind: "like",
        core: 0,
        song: S.song,
        liked: S.liked,
        recipient: "",
        amount: "0",
        fee: Sh.toString(),
        nonce: Ee.toString(),
        created: t.now(),
        status: "signed",
        raw: Be.raw,
        txid: Be.txid,
        ...S.title ? { title: String(S.title).slice(0, 120) } : {},
        ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
      };
      t.validate(en), tt(en);
      try {
        await t.chain.broadcast(Be.raw, Be.txid), tt({ ...en, status: "pending" }), y = `${S.liked ? "♥ Liked" : "Unliked"} ${M}`, w = "";
        try {
          (K = t.likeSent) == null || K.call(t, S.song, S.liked);
        } catch {
        }
      } catch (nr) {
        if (tt({ ...en, status: Zr(nr) ? "failed" : "unknown", note: nr.message, ...Zr(nr) ? { raw: void 0 } : {} }), w = nr.message, Zr(nr)) try {
          (Q = t.likeFailed) == null || Q.call(t, S.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (k) {
      w = "Like not sent: " + (k instanceof Error ? k.message : "the listening wallet is unavailable");
      try {
        (vt = t.likeFailed) == null || vt.call(t, S.song);
      } catch {
      }
    } finally {
      h = !1, t.changed();
    }
  }
  return { snapshot: T, refresh: ie, onListened: tr, heart: Ts, toggleLike: xn, ...Se };
}
const og = ["Connect", "Passkey", "Link & fund", "Listen"], ag = ["Passkey", "Add 1 STX", "Listen"], Oc = (t) => t ? ag : og;
function r5(t) {
  if (t.solo) return s5(t);
  const e = og.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
  const e = ag.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
  return !e || e.at >= Oc(!!t.solo).length || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const o5 = 100000n, a5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function c5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Co(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= o5).sort(a5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Vi = 50;
function Ih(t) {
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
  if (!Co(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Vi}&offset=${o}`, s = Ih(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Vi);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Vi ? s : Ih(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = c5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Vi);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const u5 = {}, f5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, h5 = (t) => {
  const e = u5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, d5 = (t) => `/hiro/${t}`, p5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, g5 = (t) => {
  const e = h5(t);
  if (e)
    return [p5(e)];
  const n = f5[t];
  return typeof window < "u" ? [`${window.location.origin}${d5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, y5 = {}, vh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, w5 = "xtrata.log.enabled", b5 = "xtrata.log.level", x5 = "xtrata.log.tags", m5 = "xtrata.log.dedupe", Ki = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, S5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, E5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, A5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, $5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, I5 = () => {
  const t = y5 ?? {}, e = Ki(w5) ?? t.VITE_LOG_ENABLED, n = Ki(b5) ?? t.VITE_LOG_LEVEL, r = Ki(x5) ?? t.VITE_LOG_TAGS, s = Ki(m5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: S5(e),
    level: E5(n) ?? "warn",
    tags: $5(r),
    dedupe: A5(s)
  };
}, v5 = (t, e, n) => !t.enabled || vh[n] < vh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), L5 = (t, e, n, r) => {
  const s = I5();
  if (!v5(s, e, t) || B5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, C5 = /* @__PURE__ */ new Set();
let Lh = null;
const B5 = (t, e, n, r, s) => (Lh !== t && (C5.clear(), Lh = t), !1), k5 = (t, e, n) => L5("debug", t, e, n), M5 = {}, T5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, _5 = (t) => {
  const e = M5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : T5[t];
}, U5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, H5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return U5.test(n) ? n : null;
}, N5 = (t) => t.replace(/\/+$/, ""), P5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Ch = (t) => {
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
}, Qr = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, O5 = (t) => {
  var c, u;
  let e;
  try {
    e = ln(j8(t));
  } catch {
    return null;
  }
  const n = Qr(e);
  if (!n || n.success === !1)
    return null;
  const r = Qr(n.value), s = Qr(r == null ? void 0 : r.value), i = Qr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Ch((c = Qr(i.name)) == null ? void 0 : c.value), a = Ch((u = Qr(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : H5(`${o}.${a}`);
}, D5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${N5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [jp($p(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : O5(i.result);
}, F5 = async (t) => {
  const e = t.address.trim();
  if (!os(e))
    return null;
  const n = _5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of g5(t.network))
    try {
      return await D5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return k5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: P5(r)
  }), null;
}, Bh = Object.freeze({
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
function j5(t, e = "") {
  return Object.hasOwn(Bh, String(t)) ? Bh[String(t)] : e;
}
const kh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function z5(t, e = "") {
  return Object.hasOwn(kh, String(t)) ? kh[String(t)] : e;
}
const Mh = document.getElementById("ppp");
Mh && R5(Mh);
function R5(t) {
  var Oe;
  const e = My(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let s = null;
  const i = async (d, I) => {
    const T = await fetch(d, { cache: "no-store", ...I, signal: AbortSignal.timeout(15e3) }), z = await T.json().catch(() => ({}));
    if (!T.ok) throw new Error((z == null ? void 0 : z.error) || `Request failed (${T.status}).`);
    return z;
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
      const I = new Promise((It, se) => {
        s.addEventListener("load", () => It(), { once: !0 }), setTimeout(() => se(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = d + "/", r.replaceChildren(s), await I;
      const T = new Ey({ walletOrigin: d, frame: s, timeoutMs: 30 * 6e4 }), z = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), et = (It, se) => z.has(It) ? T.request(It, se) : Promise.race([
        T.request(It, se),
        new Promise((Vt, xe) => setTimeout(() => xe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await et("listening.status"), { request: et };
    },
    chain: {
      verify: G6,
      balance: K6,
      account: V6,
      owner: q6,
      broadcast: W6,
      transaction: X6,
      confirmedNonce: async (d) => {
        const I = await _r(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(I == null ? void 0 : I.nonce) || I.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(I.nonce);
      }
    },
    signWithMain: (d, I) => _6({ ...I, network: "mainnet", stxAddress: d }),
    deposit: (d, I, T) => new Promise((z, et) => C6({
      recipient: I,
      amount: T.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new _h(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (It) => z(It.txId || ""),
      onCancel: () => et(new Error("Deposit cancelled. Nothing was sent.")),
      onError: et
    })),
    validate: Y6,
    tabLock: (d) => new Promise((I) => {
      const T = navigator.locks;
      if (!(T != null && T.request)) {
        I(!0);
        return;
      }
      T.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (z) => {
        I(!!z), z && await new Promise(() => {
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
      set: (d, I) => {
        try {
          localStorage.setItem(d, I);
        } catch {
        }
      }
    },
    changed: () => jt(o.snapshot()),
    funder: (d) => l5(d, _r),
    likesChanged: () => {
      var d, I;
      (I = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || I.call(d);
    },
    likeState: async (d, I) => {
      const T = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(I) })), z = Array.isArray(T == null ? void 0 : T.rows) ? T.rows.find((et) => (et == null ? void 0 : et.id) === I) : null;
      if (!z || typeof z.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: z.liked, by: Array.isArray(z.by) ? z.by.filter((et) => typeof et == "string") : z.liked ? [d] : [] };
    },
    likeSent: (d, I) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: I } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    O();
    const I = R(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: I.title || void 0, artist: I.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let a;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const c = (d) => {
    var T, z;
    const I = window.XtrataRadioListeningIdentity();
    I !== a && (a = I, (z = (T = window.XtrataRadio) == null ? void 0 : T.refreshLikes) == null || z.call(T));
  }, u = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", h = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), l = (d) => {
    const I = Math.round((Date.now() - d) / 6e4);
    return I < 1 ? "now" : I < 60 ? `${I}m` : I < 1440 ? `${Math.round(I / 60)}h` : `${Math.round(I / 1440)}d`;
  }, g = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, f = (d, I = "", T = "") => {
    const z = document.createElement(d);
    return I && (z.textContent = I), T && (z.className = T), z;
  }, y = (d, I, T = "") => {
    const z = f("button", d, T);
    return z.type = "button", z.onclick = I, z;
  }, w = (d, I) => {
    const T = f("a", d);
    return T.href = I, T.target = "_blank", T.rel = "noopener", T;
  };
  let $ = null, _ = !1;
  const U = /* @__PURE__ */ new Map(), b = (d) => d ? (U.has(d) || (U.set(d, null), F5({ address: d, network: "mainnet" }).then((I) => {
    I && (U.set(d, I), jt(o.snapshot()));
  }).catch(() => {
  })), U.get(d) ?? null) : null, v = (d) => {
    const I = b(d);
    return I ? `${I} · ${u(d)}` : u(d);
  }, A = /* @__PURE__ */ new Map();
  let P = !1;
  const G = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), O = () => {
    P || (P = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const I of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const T = Number(I == null ? void 0 : I.id);
        Number.isSafeInteger(T) && A.set(T, { title: typeof I.title == "string" ? I.title : void 0, artist: typeof I.artist == "string" ? I.artist : void 0 });
      }
      jt(o.snapshot());
    }).catch(() => {
      P = !1;
    }));
  }, R = (d, I) => {
    const T = A.get(d), z = z5(d, [T == null ? void 0 : T.title, I == null ? void 0 : I.title].find((It) => !G(It)) || ""), et = j5(d, (T == null ? void 0 : T.artist) || (I == null ? void 0 : I.artist) || "");
    return { title: z, artist: et };
  }, x = (d) => {
    const { title: I, artist: T } = R(d.song, d);
    return I ? `“${I}”${T ? ` — ${T}` : ""}` : `Song #${d.song}${T ? ` — ${T}` : ""}`;
  }, L = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, N = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function q(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Y(d, I, T = "", z) {
    const et = f("dt", d), It = f("dd", I, T);
    return z && It.append(" ", z), [et, It];
  }
  const j = document.getElementById("ppp-top"), Yt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Rt = () => {
    var I, T;
    const d = o.snapshot();
    if (d.step === "connect") {
      (I = document.getElementById("radio-wallet-connect")) == null || I.click();
      return;
    }
    if (d.step === "elsewhere" && ((T = d.gate) != null && T.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), Yt();
  };
  j && (j.onclick = Rt);
  function Zt(d) {
    if (!j) return;
    const I = (z, et, It) => {
      j.hidden = !1, j.className = "ppp-top" + (et ? " is-" + et : ""), j.replaceChildren(f("span", "", "dot"), document.createTextNode(z)), j.title = It;
    }, T = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        j.hidden = !0;
        return;
      case "elsewhere":
        return I("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        j.hidden = !0;
        return;
      case "intro":
        return I("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "locked":
        return I(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return I("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return I(d.entries.some((z) => z.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return I("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return I("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && T > 0 ? I(`On · ${T.toLocaleString()} plays left`, "on", "Paying artists as you listen") : I("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const m = document.getElementById("pppNudge"), B = document.getElementById("onair");
  (Oe = m == null ? void 0 : m.querySelector("button")) == null || Oe.addEventListener("click", () => Rt());
  const tt = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    link: "Not paying artists yet",
    fund: "Out of funds · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, gt = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function ht(d) {
    var It;
    if (d.step === "loading") return;
    const I = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, T = d.step === "ready" && d.payingOn && I > 0, z = T ? "" : tt[d.step] ?? "", et = T ? "on" : z ? "off" : "";
    if (et ? document.documentElement.dataset.ppp = et : delete document.documentElement.dataset.ppp, B && (B.hidden = !et, B.querySelector(".onair-sub").textContent = T ? `Paying artists · ${I.toLocaleString()} plays left` : "Not paying"), m && (m.hidden = et !== "off", et === "off")) {
      const se = Math.floor(Number(1000000n / si(BigInt(((It = d.gate) == null ? void 0 : It.limits.playFee) ?? "300"))));
      m.querySelector(".nudge-t").textContent = "⚠ " + z, m.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${se.toLocaleString()} plays, on-chain, straight to the artists.`, m.querySelector("button").textContent = gt[d.step] ?? "Start paying";
    }
  }
  let Et = "";
  function re(d) {
    const I = f("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && I.append(f("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && I.append(f("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const T = f("input");
    T.type = "text", T.placeholder = "SP… address to send returns to", T.autocomplete = "off", T.spellcheck = !1, T.setAttribute("aria-label", "Address to return funds to"), T.value = Et, T.oninput = () => {
      Et = T.value;
    };
    const z = y(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(T.value), Et = "";
    }, "tiny");
    return I.append(T, " ", z), d.returnToKind === "chosen" && I.append(" ", y("Back to the funder", () => o.clearReturnAddress(), "tiny")), I;
  }
  const tn = "Want your plays and likes under a wallet of your own? Get Xverse or Leather, connect it here, and link this listening wallet to it.";
  function gn() {
    const d = f("p", tn + " ", "ppp-mute");
    return d.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), d;
  }
  function jt(d) {
    var V, K, Q, vt;
    if (c(), Zt(d), ht(d), t.hidden = d.step === "off", t.hidden) return;
    const [I, T] = q(d), z = n(".ppp-state");
    z.textContent = I, z.className = "ppp-state" + (T ? " ppp-state--" + T : ""), z.hidden = !I;
    const et = !!d.busy || d.armed, It = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(d.step) && (et || !["intro", "loading"].includes(d.step));
    r.hidden = !It, r.classList.toggle("ppp-frame--rest", !et && !_);
    const se = n(".ppp-frame-label");
    se.hidden = !0;
    const Vt = r5(d) ?? $;
    $ = Vt;
    const xe = i5(d, Vt);
    n(".ppp-badge").hidden = !xe;
    const wn = n(".ppp-steps"), bn = n(".ppp-stage");
    wn.hidden = bn.hidden = !xe, Vt && xe && (wn.replaceChildren(...Oc(d.solo).map((k, J) => {
      const Ft = f("li", "", J < Vt.at ? "done" : J === Vt.at ? Vt.blocked ? "now blocked" : "now" : "");
      return Ft.append(f("span", J < Vt.at ? "✓" : String(J + 1), "n"), k), J === Vt.at && Ft.setAttribute("aria-current", "step"), Ft;
    })), bn.textContent = Vt.caption, bn.className = "ppp-stage " + (Vt.at >= Oc(d.solo).length ? "ppp-ok" : Vt.blocked ? "ppp-bad" : "ppp-cyan"));
    const ie = n(".ppp-facts"), Tt = [];
    if (d.main && ((V = d.gate) != null && V.here) && !d.solo && Tt.push(...Y("Your wallet", v(d.main), "ppp-addr-short")), d.listening) {
      const k = y("Copy", () => {
        var J;
        return void ((J = navigator.clipboard) == null ? void 0 : J.writeText(d.listening || ""));
      }, "tiny");
      Tt.push(...Y("Listening wallet", u(d.listening), "ppp-addr-short", k));
    }
    if (d.listening && d.step !== "intro")
      if (d.linked) Tt.push(...Y("Linked to", `${v(d.linked)} · returns go here`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn"));
      else if (d.solo) {
        const k = d.returnTo ? `${u(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Tt.push(...Y("Returns go to", d.returnTo ? k.replace(u(d.returnTo), d.returnTo) : k, d.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else Tt.push(...Y("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((K = d.gate) != null && K.here)) {
      const k = d.linkedListening.map((J) => u(J) + (J === d.listening ? " (this one)" : "")).join(", ");
      Tt.push(...Y(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", k, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const k = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Tt.push(...Y("Balance", `${Rn(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, k));
    }
    const me = d.entries.find((k) => k.kind === "play");
    me && O(), me && Tt.push(...Y("Last paid song", `${x(me)} → ${u(me.recipient)}`, L[me.status] || "")), ie.replaceChildren(...Tt), ie.hidden = !Tt.length;
    const yt = [], At = [], Nt = [], Se = [], tr = si(BigInt(((Q = d.gate) == null ? void 0 : Q.limits.playFee) ?? "300")), Ts = `Each song you listen to for 30 seconds sends ${Rn(Hc)} STX to whoever holds it, plus a ${Rn(tr - Hc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, xn = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (yt.push(f("p", "Pay artists as you listen.")), (vt = d.gate) != null && vt.radioUrl) {
          const k = f("p");
          k.append(w("Open the pay-per-play radio →", d.gate.radioUrl)), yt.push(k);
        }
        At.push(f("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        yt.push(f("p", "Connect your wallet to pay artists as you listen.")), At.push(f("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "not-invited":
        yt.push(f("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        yt.push(f("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        yt.push(f("p", `Pay artists ${Rn(tr)} STX a song as you listen.`)), At.push(f("p", Ts)), At.push(f("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), At.push(f("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), Nt.push(y("Turn on pay-per-play", () => void o.create(), "primary")), Nt.push(y("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        d.armed || (yt.push(f("p", "Locked.", "ppp-mute")), Nt.push(y(d.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), Se.push(y("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        yt.push(f("p", `Link to ${v(d.main)} · free`)), At.push(f("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), At.push(f("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Nt.push(y(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        yt.push(f("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.entries.length ? yt.push(f("p", "Out of funds · top up to keep paying", "ppp-bad")) : yt.push(f("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / tr)).toLocaleString()} songs`)), d.entries.length && At.push(f("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), d.payingOn && !d.entries.length && At.push(f("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), d.solo ? (At.push(f("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), At.push(f("p", d.listening || "", "ppp-addr-full")), d.listening && Nt.push(y("Copy my address", () => {
          var k;
          return void ((k = navigator.clipboard) == null ? void 0 : k.writeText(d.listening || ""));
        }, "primary"))) : At.push(f("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const k = f("p", "Deposit on its way… ", "ppp-warn");
          k.append(w("View", g(d.depositTxid))), yt.push(k);
        } else d.allowance > 0n && !d.solo && Nt.push(y(`Deposit ${Rn(d.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        yt.push(f("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (yt.push(f("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), yt.push(re(d))), (!d.solo || d.returnTo) && Nt.push(y("Return excess", () => void o.returnFunds("excess"), "primary"), y("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0) {
          const k = Math.min(d.session.playsLeft, d.playsLeft);
          yt.push(f("p", `Paying as you listen · up to ${k.toLocaleString()} plays left`, "ppp-ok")), At.push(f("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Nt.push(y("Switch off", () => void o.switchOff()));
        } else
          yt.push(f("p", "Paying is off. Music stays free.", "ppp-mute")), Nt.push(y("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        d.balanceState === "low" && yt.push(f("p", "Running low · top up", "ppp-warn")), d.depositPending ? yt.push(f("p", "Top-up on its way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && Nt.push(y(`Top up ${Rn(d.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (d.solo && d.walletCannotSolo && At.push(f("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && At.push(re(d)), At.push(gn()), d.step === "ready" && d.entries.some((k) => k.kind === "play" && k.status === "confirmed"))) {
      const k = f("p", "Have a Stacks wallet? ", "ppp-mute");
      k.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " to keep your plays and likes under your own address."), yt.push(k);
    }
    if (d.walletOutdated && At.push(f("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (yt.push(f("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Nt.push(y("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(d.step) && d.returnTo && (d.balance ?? 0n) > 0n && Se.push(y(d.linked ? "Return all to my wallet" : `Return all to ${u(d.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && Se.push(y("Lock", () => void o.lock(), "quiet")), It && !et && Se.push(y(_ ? "Hide listening wallet box" : "Show listening wallet box", () => {
      _ = !_, jt(o.snapshot());
    }, "quiet")), [...Nt, ...Se].forEach((k) => k.disabled = xn), xn && (Nt.length = 0), d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const k = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", J = yt.at(0);
      d.step === "ready" && J ? J.append(f("span", ` · ${h(d.balance)} STX`, k)) : yt.push(f("p", `Balance ${h(d.balance)} STX`, k));
    }
    n(".ppp-key").replaceChildren(...yt), n(".ppp-body").replaceChildren(...At), n(".ppp-actions").replaceChildren(...Nt), n(".ppp-actions2").replaceChildren(...Se);
    const er = d.busy || d.message || "";
    n(".ppp-msg").textContent = er && yt.some((k) => (k.textContent ?? "").startsWith(er.replace(/[.✓\s]+$/, ""))) ? "" : er, n(".ppp-err").textContent = d.error;
    const S = d.entries.filter((k) => k.kind === "play");
    n(".ppp-recent").hidden = !d.entries.length, n(".ppp-recent-list").replaceChildren(...S.slice(0, 5).map((k) => {
      const J = f("li"), Ft = k.status === "confirmed" ? "ok" : k.status === "failed" ? "bad" : "warn";
      return J.append(f("span", "", "d " + Ft), f("span", x(k), "t"), f("span", l(k.created), "ppp-mute")), k.txid && J.append(w("tx", g(k.txid))), J;
    })), n(".ppp-wallets").hidden = !(ie.childElementCount || Se.length), n(".ppp-more").hidden = !At.length;
    const M = n(".ppp-history");
    M.hidden = !d.entries.length, d.entries.length && O(), M.replaceChildren(f("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((k) => {
      const J = f("div", "", "ppp-row"), Ft = k.kind === "play" ? [f("span", x(k), "ppp-song"), f("span", ` · ${Rn(BigInt(k.amount))} STX to ${u(k.recipient)}`, "ppp-mute")] : k.kind === "like" ? [f("span", `${k.liked ? "♥ Liked" : "Unliked"} ${x(k)}`, "ppp-song"), f("span", ` · for ${d.linked ? v(d.linked) : "this listening wallet"}`, "ppp-mute")] : [f("span", `Returned ${Rn(BigInt(k.amount))} STX`, "ppp-song"), f("span", ` to ${u(k.recipient)}`, "ppp-mute")];
      return J.append(
        f("span", N[k.status] || k.status, "ppp-status " + (L[k.status] || "")),
        ...Ft,
        f("span", ` · ${new Date(k.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), k.txid && J.append(w("tx ↗", g(k.txid))), J;
    }));
  }
  const yn = /* @__PURE__ */ new Map(), Gr = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((I) => {
      const T = I == null ? void 0 : I.nowPlaying;
      T && Number.isSafeInteger(Number(T.tokenId)) && yn.set(Number(T.tokenId), { title: T.title || void 0, artist: T.artist || void 0 });
    }), !0) : !1;
  };
  if (!Gr()) {
    const d = setInterval(() => {
      Gr() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const I = d.detail;
    if (I && Number.isSafeInteger(I.song) && typeof I.id == "string" && /^[0-9a-f]{32}$/.test(I.id)) {
      O();
      const T = R(I.song, yn.get(I.song));
      o.onListened({ song: I.song, id: I.id, title: T.title || void 0, artist: T.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const G5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", V5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, K5 = () => V5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, q5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, W5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', cg = class {
  constructor(t) {
    nE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Ex(t), this.callback(zo(t));
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
    const t = K5(), e = q5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return nt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, nt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), nt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, nt("div", { class: "flex flex-col space-y-[10px]" }, nt("div", { class: "flex items-center" }, nt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), nt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, nt("span", { class: "sr-only" }, "Close popup"), nt("img", { src: G5 }))), r ? nt("p", null, "Select the wallet you want to connect to.") : nt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && nt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && nt("div", { class: "mt-6" }, nt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), nt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => nt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, nt("div", { class: "aspect-square basis-9 overflow-hidden" }, nt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), nt("div", { class: "flex-1" }, nt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && nt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), nt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && nt("div", { class: "mt-6" }, r ? nt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : nt("div", { class: "mb-5 flex justify-between" }, nt("p", { class: "text-sm font-medium" }, "Recommended wallets"), nt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, nt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, nt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), nt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), nt("p", null, "What is a wallet? ", nt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), nt("ul", { class: "space-y-3" }, n.map((i) => nt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, nt("div", { class: "aspect-square basis-9 overflow-hidden" }, nt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), nt("div", { class: "flex-1" }, nt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && nt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && nt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return P4(this);
  }
};
cg.style = W5;
const X5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: cg
}, Symbol.toStringTag, { value: "Module" }));
