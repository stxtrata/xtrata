var ny = Object.defineProperty;
var ry = (t, e, n) => e in t ? ny(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var As = (t, e, n) => ry(t, typeof e != "symbol" ? e + "" : e, n);
var Yt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ih(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function xo(t) {
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
      typeof Yt < "u" && Yt || {}, r = {
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
            var T = x.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && (v[Symbol.iterator] = function() {
          return v;
        }), v;
      }
      function f(x) {
        this.map = {}, x instanceof f ? x.forEach(function(v, T) {
          this.append(T, v);
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
        var T = this.map[x];
        this.map[x] = T ? T + ", " + v : v;
      }, f.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, f.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, f.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, f.prototype.set = function(x, v) {
        this.map[a(x)] = c(v);
      }, f.prototype.forEach = function(x, v) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && x.call(v, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var x = [];
        return this.forEach(function(v, T) {
          x.push(T);
        }), l(x);
      }, f.prototype.values = function() {
        var x = [];
        return this.forEach(function(v) {
          x.push(v);
        }), l(x);
      }, f.prototype.entries = function() {
        var x = [];
        return this.forEach(function(v, T) {
          x.push([T, v]);
        }), l(x);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function(v, T) {
          x.onload = function() {
            v(x.result);
          }, x.onerror = function() {
            T(x.error);
          };
        });
      }
      function h(x) {
        var v = new FileReader(), T = g(v);
        return v.readAsArrayBuffer(x), T;
      }
      function y(x) {
        var v = new FileReader(), T = g(v), z = /charset=([A-Za-z0-9_-]+)/.exec(x.type), p = z ? z[1] : "utf-8";
        return v.readAsText(x, p), T;
      }
      function w(x) {
        for (var v = new Uint8Array(x), T = new Array(v.length), z = 0; z < v.length; z++)
          T[z] = String.fromCharCode(v[z]);
        return T.join("");
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
          return this.text().then($);
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
        var T = v.body;
        if (x instanceof L) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, v.headers || (this.headers = new f(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !T && x._bodyInit != null && (T = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = v.credentials || this.credentials || "same-origin", (v.headers || !this.headers) && (this.headers = new f(v.headers)), this.method = b(v.method || this.method || "GET"), this.mode = v.mode || this.mode || null, this.signal = v.signal || this.signal || function() {
          if ("AbortController" in n) {
            var A = new AbortController();
            return A.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && (v.cache === "no-store" || v.cache === "no-cache")) {
          var z = /([?&])_=[^&]*/;
          if (z.test(this.url))
            this.url = this.url.replace(z, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var p = /\?/;
            this.url += (p.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function $(x) {
        var v = new FormData();
        return x.trim().split("&").forEach(function(T) {
          if (T) {
            var z = T.split("="), p = z.shift().replace(/\+/g, " "), A = z.join("=").replace(/\+/g, " ");
            v.append(decodeURIComponent(p), decodeURIComponent(A));
          }
        }), v;
      }
      function H(x) {
        var v = new f(), T = x.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(z) {
          return z.indexOf(`
`) === 0 ? z.substr(1, z.length) : z;
        }).forEach(function(z) {
          var p = z.split(":"), A = p.shift().trim();
          if (A) {
            var U = p.join(":").trim();
            try {
              v.append(A, U);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), v;
      }
      k.call(L.prototype);
      function R(x, v) {
        if (!(this instanceof R))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (v || (v = {}), this.type = "default", this.status = v.status === void 0 ? 200 : v.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = v.statusText === void 0 ? "" : "" + v.statusText, this.headers = new f(v.headers), this.url = v.url || "", this._initBody(x);
      }
      k.call(R.prototype), R.prototype.clone = function() {
        return new R(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, R.error = function() {
        var x = new R(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var P = [301, 302, 303, 307, 308];
      R.redirect = function(x, v) {
        if (P.indexOf(v) === -1)
          throw new RangeError("Invalid status code");
        return new R(null, { status: v, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(v, T) {
          this.message = v, this.name = T;
          var z = Error(v);
          this.stack = z.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function O(x, v) {
        return new Promise(function(T, z) {
          var p = new L(x, v);
          if (p.signal && p.signal.aborted)
            return z(new e.DOMException("Aborted", "AbortError"));
          var A = new XMLHttpRequest();
          function U() {
            A.abort();
          }
          A.onload = function() {
            var m = {
              statusText: A.statusText,
              headers: H(A.getAllResponseHeaders() || "")
            };
            p.url.indexOf("file://") === 0 && (A.status < 200 || A.status > 599) ? m.status = 200 : m.status = A.status, m.url = "responseURL" in A ? A.responseURL : m.headers.get("X-Request-URL");
            var B = "response" in A ? A.response : A.responseText;
            setTimeout(function() {
              T(new R(B, m));
            }, 0);
          }, A.onerror = function() {
            setTimeout(function() {
              z(new TypeError("Network request failed"));
            }, 0);
          }, A.ontimeout = function() {
            setTimeout(function() {
              z(new TypeError("Network request timed out"));
            }, 0);
          }, A.onabort = function() {
            setTimeout(function() {
              z(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (A.open(p.method, W(p.url), !0), p.credentials === "include" ? A.withCredentials = !0 : p.credentials === "omit" && (A.withCredentials = !1), "responseType" in A && (r.blob ? A.responseType = "blob" : r.arrayBuffer && (A.responseType = "arraybuffer")), v && typeof v.headers == "object" && !(v.headers instanceof f || n.Headers && v.headers instanceof n.Headers)) {
            var Y = [];
            Object.getOwnPropertyNames(v.headers).forEach(function(m) {
              Y.push(a(m)), A.setRequestHeader(m, c(v.headers[m]));
            }), p.headers.forEach(function(m, B) {
              Y.indexOf(B) === -1 && A.setRequestHeader(B, m);
            });
          } else
            p.headers.forEach(function(m, B) {
              A.setRequestHeader(B, m);
            });
          p.signal && (p.signal.addEventListener("abort", U), A.onreadystatechange = function() {
            A.readyState === 4 && p.signal.removeEventListener("abort", U);
          }), A.send(typeof p._bodyInit > "u" ? null : p._bodyInit);
        });
      }
      return O.polyfill = !0, n.fetch || (n.fetch = O, n.Headers = f, n.Request = L, n.Response = R), e.Headers = f, e.Request = L, e.Response = R, e.fetch = O, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Yt);
})();
const sy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function iy(t, e) {
  const n = {};
  return Object.assign(n, sy, e), await fetch(t, n);
}
function oy(t) {
  let e = iy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ay(...t) {
  const { fetchLib: e, middlewares: n } = oy(t);
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
var Yr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yr || (Yr = {}));
var or;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(or || (or = {}));
var ru;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ru || (ru = {}));
const cy = "https://api.mainnet.hiro.so", ly = "https://api.testnet.hiro.so", uy = "http://localhost:3999", fy = ["mainnet", "testnet", "devnet", "mocknet"];
let Xr = class {
  constructor(e) {
    this.version = or.Mainnet, this.chainId = Yr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === or.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ay();
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
Xr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new vh();
    case "testnet":
      return new hy();
    case "devnet":
      return new dy();
    case "mocknet":
      return new Lh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fy.join(", ")}`);
  }
};
Xr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Xr.fromName(t);
let vh = class extends Xr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Mainnet, this.chainId = Yr.Mainnet;
  }
}, hy = class extends Xr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Testnet, this.chainId = Yr.Testnet;
  }
}, Lh = class extends Xr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = or.Testnet, this.chainId = Yr.Testnet;
  }
};
const dy = Lh, Ch = "xtrata.wallet.bridge.v1", py = (t) => typeof t == "object" && t !== null && t.protocol === Ch, gy = (t) => py(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", yy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class $s extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const su = 12e4;
class wy {
  constructor(e) {
    As(this, "pending", /* @__PURE__ */ new Map());
    As(this, "listenTarget");
    As(this, "closed", !1);
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
    As(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !gy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new $s("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new $s("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new $s("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = yy(), i = { protocol: Ch, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new $s(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? su}ms.`
          )
        );
      }, this.options.timeoutMs ?? su);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new $s("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const by = ["SP", "SM"], xy = ["ST", "SN"], my = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return by.includes(n) ? "mainnet" : xy.includes(n) ? "testnet" : null;
}, Sy = () => {
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
}, Ey = () => typeof window > "u" || !window.localStorage ? Sy() : window.localStorage, ra = "xtrata.v15.1.wallet.session", iu = "mainnet", Vi = { isConnected: !1 }, Ay = (t) => t.address ? my(t.address) ?? t.network : t.network, Bh = (t) => !t.isConnected || !t.address ? { ...Vi } : Ay(t) !== iu ? { ...Vi } : {
  isConnected: !0,
  address: t.address,
  network: iu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, $y = (t) => {
  if (!t)
    return { ...Vi };
  try {
    const e = JSON.parse(t);
    return Bh(e);
  } catch {
    return { ...Vi };
  }
}, Iy = (t) => {
  const e = Bh(t);
  return JSON.stringify(e);
}, vy = (t) => {
  const e = Ey();
  return {
    load: () => $y(e.getItem(ra)),
    save: (n) => {
      e.setItem(ra, Iy(n));
    },
    clear: () => {
      e.removeItem(ra);
    }
  };
}, Ly = "https://browser.blockstack.org/auth", Cy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, kh = ["store_write"], By = "blockstack-session", ky = {
  logLevel: "debug"
}, Er = {
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
Object.freeze(Er);
class ps extends Error {
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
class My extends ps {
  constructor(e, n = "") {
    super({ code: Er.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ou extends ps {
  constructor(e = "") {
    super({ code: Er.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class li extends ps {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Er.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class au extends ps {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Er.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ca extends ps {
  constructor(e) {
    super({ code: Er.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mh extends ps {
  constructor(e) {
    super({ code: Er.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const cu = ["debug", "info", "warn", "error", "none"], Ba = {};
for (let t = 0; t < cu.length; t++) {
  const e = cu[t];
  Ba[e] = t;
}
class Rr {
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
    return Ba[ky.logLevel] <= Ba[e];
  }
}
function _y() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Ty() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function sa(t, e) {
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
function Hy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Ny(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Tc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Hy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Rr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Ny(s, t.toString(), n);
    throw Rr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function jn(t, e) {
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
  if (ne(t, Uint8Array))
    return BigInt(`0x${q(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Py(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function lu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ys(t, e = 8) {
  return (typeof t == "bigint" ? t : Gt(t)).toString(16).padStart(e * 2, "0");
}
function mo(t) {
  return parseInt(t, 16);
}
function Uc(t, e = 16) {
  const n = Ys(t, e);
  return ht(n);
}
function Oy(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Dy(t, e) {
  return t & BigInt(1) << e;
}
function ka(t) {
  return jy(BigInt(`0x${q(t)}`), BigInt(t.byteLength * 8));
}
function jy(t, e) {
  return Dy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Fy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function q(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fy[n];
  return e;
}
function ht(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Py(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Ar(t) {
  return new TextEncoder().encode(t);
}
function Xs(t) {
  return new TextDecoder().decode(t);
}
function zy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Ry(t) {
  return String.fromCharCode.apply(null, t);
}
function Gy(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function uu(t) {
  if (t.some(Gy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ze(...t) {
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
function Ut(t) {
  return ze(...t.map((e) => typeof e == "number" ? uu([e]) : e instanceof Array ? uu(e) : e));
}
function ne(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const _h = "https://api.mainnet.hiro.so", Th = "https://api.testnet.hiro.so", Uh = "http://localhost:3999", Vy = "https://hub.blockstack.org", Ky = 33, ia = 32;
function qy(t) {
  if (t.length < ia * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ia * 2), r = t.slice(2 + ia * 2);
  return {
    recoveryId: mo(e),
    r: n,
    s: r
  };
}
function Hc(t) {
  const e = typeof t == "string" ? ht(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Wy(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Yy(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Xy(t, e) {
  return t[e];
}
function Zy(t, e, n = 0) {
  return t[n] = e, t;
}
function Qy(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ar(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Jy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function t1(t, e) {
  const n = {};
  return Object.assign(n, Jy, e), await fetch(t, n);
}
function e1(t) {
  let e = t1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function n1(...t) {
  const { fetchLib: e, middlewares: n } = e1(t);
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
class Hh {
  constructor(e = kh.slice(), n = ((a) => (a = Tc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Ly) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ma(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function r1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Nh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function s1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ma(t.outputLen), Ma(t.blockLen);
}
function i1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function o1(t, e) {
  Nh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Zn = {
  number: Ma,
  bool: r1,
  bytes: Nh,
  hash: s1,
  exists: i1,
  output: o1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _e = (t, e) => t << 32 - e | t >>> e, a1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!a1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function c1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nc(t) {
  if (typeof t == "string" && (t = c1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ph = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function $r(t) {
  const e = (r) => t().update(Nc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Oh = class extends Ph {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Zn.hash(e);
    const r = Nc(n);
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
const So = (t, e, n) => new Oh(t, e).update(n).digest();
So.create = (t, e) => new Oh(t, e);
function l1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Pc = class extends Ph {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    Zn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = oa(e);
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
    l1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
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
const u1 = (t, e, n) => t & e ^ ~t & n, f1 = (t, e, n) => t & e ^ t & n ^ e & n, h1 = new Uint32Array([
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
]), un = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fn = new Uint32Array(64);
let Dh = class extends Pc {
  constructor() {
    super(64, 32, 8, !1), this.A = un[0] | 0, this.B = un[1] | 0, this.C = un[2] | 0, this.D = un[3] | 0, this.E = un[4] | 0, this.F = un[5] | 0, this.G = un[6] | 0, this.H = un[7] | 0;
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
      fn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = fn[u - 15], h = fn[u - 2], y = _e(g, 7) ^ _e(g, 18) ^ g >>> 3, w = _e(h, 17) ^ _e(h, 19) ^ h >>> 10;
      fn[u] = w + fn[u - 7] + y + fn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = _e(a, 6) ^ _e(a, 11) ^ _e(a, 25), h = f + g + u1(a, c, l) + h1[u] + fn[u] | 0, w = (_e(r, 2) ^ _e(r, 13) ^ _e(r, 22)) + f1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, d1 = class extends Dh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zr = $r(() => new Dh());
$r(() => new d1());
const p1 = {}, jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: p1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ut = BigInt(0), It = BigInt(1), Nn = BigInt(2), Bs = BigInt(3), fu = BigInt(8), gt = Object.freeze({
  a: ut,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: It,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), hu = (t, e) => (t + e / Nn) / e, ui = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = gt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -It * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = hu(i * t, e), c = hu(-r * t, e);
    let l = N(t - a * n - c * s, e), f = N(-a * r - c * i, e);
    const u = l > o, g = f > o;
    if (u && (l = e - l), g && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: g, k2: f };
  }
}, Le = 32, cr = 32, Fh = 32, Ki = Le + 1, qi = 2 * Le + 1;
function du(t) {
  const { a: e, b: n } = gt, r = N(t * t), s = N(r * t);
  return N(s + e * t + n);
}
const fi = gt.a === ut;
class Oc extends Error {
  constructor(e) {
    super(e);
  }
}
function pu(t) {
  if (!(t instanceof dt))
    throw new TypeError("JacobianPoint expected");
}
class dt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof it))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(it.ZERO) ? dt.ZERO : new dt(e.x, e.y, It);
  }
  static toAffineBatch(e) {
    const n = x1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return dt.toAffineBatch(e).map(dt.fromAffine);
  }
  equals(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), g = N(N(r * a) * l), h = N(N(o * s) * c);
    return f === u && g === h;
  }
  negate() {
    return new dt(this.x, N(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = N(e * e), i = N(n * n), o = N(i * i), a = e + i, c = N(Nn * (N(a * a) - s - o)), l = N(Bs * s), f = N(l * l), u = N(f - Nn * c), g = N(l * (c - u) - fu * o), h = N(Nn * n * r);
    return new dt(u, g, h);
  }
  add(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === ut || o === ut)
      return this;
    if (n === ut || r === ut)
      return e;
    const c = N(s * s), l = N(a * a), f = N(n * l), u = N(i * c), g = N(N(r * a) * l), h = N(N(o * s) * c), y = N(u - f), w = N(h - g);
    if (y === ut)
      return w === ut ? this.double() : dt.ZERO;
    const I = N(y * y), k = N(y * I), M = N(f * I), b = N(w * w - k - Nn * M), L = N(w * (M - b) - g * k), $ = N(s * a * y);
    return new dt(b, L, $);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = dt.ZERO;
    if (typeof e == "bigint" && e === ut)
      return n;
    let r = wu(e);
    if (r === It)
      return this;
    if (!fi) {
      let u = n, g = this;
      for (; r > ut; )
        r & It && (u = u.add(g)), g = g.double(), r >>= It;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ui.splitScalar(r), c = n, l = n, f = this;
    for (; i > ut || a > ut; )
      i & It && (c = c.add(f)), a & It && (l = l.add(f)), f = f.double(), i >>= It, a >>= It;
    return s && (c = c.negate()), o && (l = l.negate()), l = new dt(N(l.x * ui.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = fi ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(dt.BASE) && (n = it.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && _a.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = dt.normalizeZ(s), _a.set(n, s)));
    let i = dt.ZERO, o = dt.BASE;
    const a = 1 + (fi ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let y = Number(e & l);
      e >>= u, y > c && (y -= f, e += It);
      const w = h, I = h + Math.abs(y) - 1, k = g % 2 !== 0, M = y < 0;
      y === 0 ? o = o.add(hi(k, s[w])) : i = i.add(hi(M, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = wu(e), s, i;
    if (fi) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = ui.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(l, n);
      f = hi(o, f), g = hi(c, g), g = new dt(N(g.x * ui.beta), g.y, g.z), s = f.add(g), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return dt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(dt.ZERO);
    e == null && (e = i ? fu : gs(s));
    const o = e, a = N(o * o), c = N(a * o), l = N(n * a), f = N(r * c), u = N(s * o);
    if (i)
      return it.ZERO;
    if (u !== It)
      throw new Error("invZ was invalid");
    return new it(l, f);
  }
}
dt.BASE = new dt(gt.Gx, gt.Gy, It);
dt.ZERO = new dt(ut, It, ut);
function hi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const _a = /* @__PURE__ */ new WeakMap();
class it {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, _a.delete(this);
  }
  hasEvenY() {
    return this.y % Nn === ut;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ue(n ? e : e.subarray(1));
    if (!Pi(r))
      throw new Error("Point is not on curve");
    const s = du(r);
    let i = b1(s);
    const o = (i & It) === It;
    n ? o && (i = N(-i)) : (e[0] & 1) === 1 !== o && (i = N(-i));
    const a = new it(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = ue(e.subarray(1, Le + 1)), r = ue(e.subarray(Le + 1, Le * 2 + 1)), s = new it(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Re(e), r = n.length, s = n[0];
    if (r === Le)
      return this.fromCompressedHex(n);
    if (r === Ki && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === qi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ki} compressed bytes or ${qi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return it.BASE.multiply(lr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Gh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Dc(Re(e)), { n: a } = gt, c = r === 2 || r === 3 ? s + a : s, l = gs(c, a), f = N(-o * l, a), u = N(i * l, a), g = r & 1 ? "03" : "02", h = it.fromHex(g + Pn(c)), y = it.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return On(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Pn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Pn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Pi(n) || !Pi(r))
      throw new Error(e);
    const s = N(r * r), i = du(n);
    if (N(s - i) !== ut)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new it(this.x, N(-this.y));
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
    const s = dt.fromAffine(this), i = n === ut || n === It || this !== it.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = dt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(dt.ZERO) ? void 0 : a.toAffine();
  }
}
it.BASE = new it(gt.Gx, gt.Gy);
it.ZERO = new it(ut, ut);
function gu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function yu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Qr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ue(n), left: t.subarray(e + 2) };
}
function g1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Qr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = yu(t.subarray(2)), { data: r, left: s } = yu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Qr(s)}`);
  return { r: e, s: r };
}
class le {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Qr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new le(Wi(s.slice(0, 64)), Wi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = g1(n ? e : On(e));
    return new le(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ts(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ts(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = gt.n >> It;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new le(this.r, N(-this.s, gt.n)) : this;
  }
  toDERRawBytes() {
    return On(this.toDERHex());
  }
  toDERHex() {
    const e = gu(Is(this.s)), n = gu(Is(this.r)), r = e.length / 2, s = n.length / 2, i = Is(r), o = Is(s);
    return `30${Is(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return On(this.toCompactHex());
  }
  toCompactHex() {
    return Pn(this.r) + Pn(this.s);
  }
}
function Un(...t) {
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
const y1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y1[t[n]];
  return e;
}
const w1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Pn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(ut <= t && t < w1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Jr(t) {
  const e = On(Pn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Is(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Wi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function On(t) {
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
function ue(t) {
  return Wi(Qr(t));
}
function Re(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : On(t);
}
function wu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ts(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function N(t, e = gt.P) {
  const n = t % e;
  return n >= ut ? n : e + n;
}
function pe(t, e) {
  const { P: n } = gt;
  let r = t;
  for (; e-- > ut; )
    r *= r, r %= n;
  return r;
}
function b1(t) {
  const { P: e } = gt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = pe(l, Bs) * l % e, u = pe(f, Bs) * l % e, g = pe(u, Nn) * c % e, h = pe(g, r) * g % e, y = pe(h, s) * h % e, w = pe(y, o) * y % e, I = pe(w, a) * w % e, k = pe(I, o) * y % e, M = pe(k, Bs) * l % e, b = pe(M, i) * h % e, L = pe(b, n) * c % e, $ = pe(L, Nn);
  if ($ * $ % e !== t)
    throw new Error("Cannot find square root");
  return $;
}
function gs(t, e = gt.P) {
  if (t === ut || e <= ut)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = N(t, e), r = e, s = ut, i = It;
  for (; n !== ut; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== It)
    throw new Error("invert: does not exist");
  return N(s, e);
}
function x1(t, e = gt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === ut ? i : (n[a] = i, N(i * o, e)), It), s = gs(r, e);
  return t.reduceRight((i, o, a) => o === ut ? i : (n[a] = N(i * n[a], e), N(i * o, e)), s), n;
}
function m1(t) {
  const e = t.length * 8 - cr * 8, n = ue(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Dc(t, e = !1) {
  const n = m1(t);
  if (e)
    return n;
  const { n: r } = gt;
  return n >= r ? n - r : n;
}
let Wr, ks;
class zh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return _t.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ks(this.k, ...e);
  }
  checkSync() {
    if (typeof ks != "function")
      throw new Oc("hmacSha256Sync needs to be set");
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
    return Un(...n);
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
    return Un(...n);
  }
}
function ts(t) {
  return ut < t && t < gt.n;
}
function Pi(t) {
  return ut < t && t < gt.P;
}
function Rh(t, e, n, r = !0) {
  const { n: s } = gt, i = Dc(t, !0);
  if (!ts(i))
    return;
  const o = gs(i, s), a = it.BASE.multiply(i), c = N(a.x, s);
  if (c === ut)
    return;
  const l = N(o * N(e + n * c, s), s);
  if (l === ut)
    return;
  let f = new le(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & It);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function lr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * cr)
      throw new Error("Expected 32 bytes of private key");
    e = Wi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== cr)
      throw new Error("Expected 32 bytes of private key");
    e = ue(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ts(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function jc(t) {
  return t instanceof it ? (t.assertValidity(), t) : it.fromHex(t);
}
function Gh(t) {
  if (t instanceof le)
    return t.assertValidity(), t;
  try {
    return le.fromDER(t);
  } catch {
    return le.fromCompact(t);
  }
}
function Zs(t, e = !1) {
  return it.fromPrivateKey(t).toRawBytes(e);
}
function S1(t, e, n, r = !1) {
  return it.fromSignature(t, e, n).toRawBytes(r);
}
function bu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ki || r === qi : n ? r === Ki * 2 || r === qi * 2 : t instanceof it;
}
function Fc(t, e, n = !1) {
  if (bu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!bu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = jc(e);
  return r.assertValidity(), r.multiply(lr(t)).toRawBytes(n);
}
function Vh(t) {
  const e = t.length > Le ? t.slice(0, Le) : t;
  return ue(e);
}
function E1(t) {
  const e = Vh(t), n = N(e, gt.n);
  return Kh(n < ut ? e : n);
}
function Kh(t) {
  return Jr(t);
}
function qh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Re(t), s = lr(e), i = [Kh(s), E1(r)];
  if (n != null) {
    n === !0 && (n = _t.randomBytes(Le));
    const c = Re(n);
    if (c.length !== Le)
      throw new Error(`sign: Expected ${Le} bytes of extra data`);
    i.push(c);
  }
  const o = Un(...i), a = Vh(r);
  return { seed: o, m: a, d: s };
}
function Wh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function A1(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, cr);
  await o.reseed(r);
  let a;
  for (; !(a = Rh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Wh(a, n);
}
function Eo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, cr);
  o.reseedSync(r);
  let a;
  for (; !(a = Rh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Wh(a, n);
}
const $1 = { strict: !0 };
function I1(t, e, n, r = $1) {
  let s;
  try {
    s = Gh(t), e = Re(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Dc(e);
  let c;
  try {
    c = jc(n);
  } catch {
    return !1;
  }
  const { n: l } = gt, f = gs(o, l), u = N(a * f, l), g = N(i * f, l), h = it.BASE.multiplyAndAddUnsafe(c, u, g);
  return h ? N(h.x, l) === i : !1;
}
function Yi(t) {
  return N(ue(t), gt.n);
}
class es {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Re(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ue(n.subarray(0, 32)), s = ue(n.subarray(32, 64));
    return new es(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Pi(e) || !ts(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Pn(this.r) + Pn(this.s);
  }
  toRawBytes() {
    return On(this.toHex());
  }
}
function v1(t) {
  return it.fromPrivateKey(t).toRawX();
}
class Yh {
  constructor(e, n, r = _t.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Re(e);
    const { x: s, scalar: i } = this.getScalar(lr(n));
    if (this.px = s, this.d = i, this.rand = Re(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = it.fromPrivateKey(e), r = n.hasEvenY() ? e : gt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Jr(e ^ ue(n));
  }
  finalizeNonce(e) {
    const n = N(ue(e), gt.n);
    if (n === ut)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new es(e.x, N(n + r * s, gt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = _t.taggedHash, o = this.initNonce(n, await i(Tn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Tn.nonce, o, r, e)), f = Yi(await i(Tn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await Qh(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = _t.taggedHashSync, o = this.initNonce(n, i(Tn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Tn.nonce, o, r, e)), f = Yi(i(Tn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Jh(u, e, r) || this.error(), u;
  }
}
async function L1(t, e, n) {
  return new Yh(t, e, n).calc();
}
function C1(t, e, n) {
  return new Yh(t, e, n).calcSync();
}
function Xh(t, e, n) {
  const r = t instanceof es, s = r ? t : es.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Re(e),
    P: jc(n)
  };
}
function Zh(t, e, n, r) {
  const s = it.BASE.multiplyAndAddUnsafe(e, lr(n), N(-r, gt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Qh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Yi(await _t.taggedHash(Tn.challenge, Jr(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Jh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Yi(_t.taggedHashSync(Tn.challenge, Jr(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch (r) {
    if (r instanceof Oc)
      throw r;
    return !1;
  }
}
const B1 = {
  Signature: es,
  getPublicKey: v1,
  sign: L1,
  verify: Qh,
  signSync: C1,
  verifySync: Jh
};
it.BASE._setWindowSize(8);
const se = {
  node: jh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Tn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, di = {}, _t = {
  bytesToHex: Qr,
  hexToBytes: On,
  concatBytes: Un,
  mod: N,
  invert: gs,
  isValidPrivateKey(t) {
    try {
      return lr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Jr,
  _normalizePrivateKey: lr,
  hashToPrivateKey: (t) => {
    t = Re(t);
    const e = cr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = N(ue(t), gt.n - It) + It;
    return Jr(n);
  },
  randomBytes: (t = 32) => {
    if (se.web)
      return se.web.getRandomValues(new Uint8Array(t));
    if (se.node) {
      const { randomBytes: e } = se.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => _t.hashToPrivateKey(_t.randomBytes(cr + 8)),
  precompute(t = 8, e = it.BASE) {
    const n = e === it.BASE ? e : new it(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Bs), n;
  },
  sha256: async (...t) => {
    if (se.web) {
      const e = await se.web.subtle.digest("SHA-256", Un(...t));
      return new Uint8Array(e);
    } else if (se.node) {
      const { createHash: e } = se.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (se.web) {
      const n = await se.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Un(...e), s = await se.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (se.node) {
      const { createHmac: n } = se.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = di[t];
    if (n === void 0) {
      const r = await _t.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Un(r, r), di[t] = n;
    }
    return _t.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Wr != "function")
      throw new Oc("sha256Sync is undefined, you need to set it");
    let n = di[t];
    if (n === void 0) {
      const r = Wr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Un(r, r), di[t] = n;
    }
    return Wr(n, ...e);
  },
  _JacobianPoint: dt
};
Object.defineProperties(_t, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Wr;
    },
    set(t) {
      Wr || (Wr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ks;
    },
    set(t) {
      ks || (ks = t);
    }
  }
});
const k1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: gt,
  Point: it,
  Signature: le,
  getPublicKey: Zs,
  getSharedSecret: Fc,
  recoverPublicKey: S1,
  schnorr: B1,
  sign: A1,
  signSync: Eo,
  utils: _t,
  verify: I1
}, Symbol.toStringTag, { value: "Module" }));
var Qs = {};
Qs.byteLength = H1;
var M1 = Qs.toByteArray = P1, _1 = Qs.fromByteArray = j1, Pe = [], ye = [], T1 = typeof Uint8Array < "u" ? Uint8Array : Array, aa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Or = 0, U1 = aa.length; Or < U1; ++Or)
  Pe[Or] = aa[Or], ye[aa.charCodeAt(Or)] = Or;
ye[45] = 62;
ye[95] = 63;
function td(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function H1(t) {
  var e = td(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function N1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function P1(t) {
  var e, n = td(t), r = n[0], s = n[1], i = new T1(N1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ye[t.charCodeAt(c)] << 18 | ye[t.charCodeAt(c + 1)] << 12 | ye[t.charCodeAt(c + 2)] << 6 | ye[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ye[t.charCodeAt(c)] << 2 | ye[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ye[t.charCodeAt(c)] << 10 | ye[t.charCodeAt(c + 1)] << 4 | ye[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function O1(t) {
  return Pe[t >> 18 & 63] + Pe[t >> 12 & 63] + Pe[t >> 6 & 63] + Pe[t & 63];
}
function D1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(O1(r));
  return s.join("");
}
function j1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(D1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Pe[e >> 2] + Pe[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Pe[e >> 10] + Pe[e >> 4 & 63] + Pe[e << 2 & 63] + "="
  )), s.join("");
}
function F1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const z1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function R1() {
  if (F1())
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
    throw new Error(z1);
  }
}
class G1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(ze(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ze(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class V1 {
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
async function ed() {
  const t = await R1();
  return t.name === "subtleCrypto" ? new V1(t.lib) : new G1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function K1(t) {
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
      for (var L = h[I], $ = 0, H = M - 1; (L !== 0 || $ < w) && H !== -1; H--, $++)
        L += 256 * b[H] >>> 0, b[H] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = $, I++;
    }
    for (var R = M - w; R !== M && b[R] === 0; )
      R++;
    for (var P = a.repeat(y); R < M; ++R)
      P += t.charAt(b[R]);
    return P;
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
      for (var $ = 0, H = k - 1; (L !== 0 || $ < I) && H !== -1; H--, $++)
        L += o * M[H] >>> 0, M[H] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      I = $, y++;
    }
    for (var R = k - I; R !== k && M[R] === 0; )
      R++;
    for (var P = new Uint8Array(w + (k - R)), O = w; R !== k; )
      P[O++] = M[R++];
    return P;
  }
  function g(h) {
    var y = u(h);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: g
  };
}
var nd = K1;
const q1 = nd, W1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Y1 = q1(W1);
const X1 = /* @__PURE__ */ Ih(Y1), Z1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rd = Uint8Array.from({ length: 16 }, (t, e) => e), Q1 = rd.map((t) => (9 * t + 5) % 16);
let zc = [rd], Rc = [Q1];
for (let t = 0; t < 4; t++)
  for (let e of [zc, Rc])
    e.push(e[t].map((n) => Z1[n]));
const sd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), J1 = zc.map((t, e) => t.map((n) => sd[e][n])), tw = Rc.map((t, e) => t.map((n) => sd[e][n])), ew = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pi = (t, e) => t << e | t >>> 32 - e;
function xu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const gi = new Uint32Array(16);
let rw = class extends Pc {
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
      gi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = ew[h], I = nw[h], k = zc[h], M = Rc[h], b = J1[h], L = tw[h];
      for (let $ = 0; $ < 16; $++) {
        const H = pi(r + xu(h, i, a, l) + gi[k[$]] + w, b[$]) + u | 0;
        r = u, u = l, l = pi(a, 10) | 0, a = i, i = H;
      }
      for (let $ = 0; $ < 16; $++) {
        const H = pi(s + xu(y, o, c, f) + gi[M[$]] + I, L[$]) + g | 0;
        s = g, g = f, f = pi(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    gi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const sw = $r(() => new rw());
function iw(t) {
  return sw(t);
}
const yi = BigInt(2 ** 32 - 1), Ta = BigInt(32);
function id(t, e = !1) {
  return e ? { h: Number(t & yi), l: Number(t >> Ta & yi) } : { h: Number(t >> Ta & yi) | 0, l: Number(t & yi) | 0 };
}
function ow(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = id(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const aw = (t, e) => BigInt(t >>> 0) << Ta | BigInt(e >>> 0), cw = (t, e, n) => t >>> n, lw = (t, e, n) => t << 32 - n | e >>> n, uw = (t, e, n) => t >>> n | e << 32 - n, fw = (t, e, n) => t << 32 - n | e >>> n, hw = (t, e, n) => t << 64 - n | e >>> n - 32, dw = (t, e, n) => t >>> n - 32 | e << 64 - n, pw = (t, e) => e, gw = (t, e) => t, yw = (t, e, n) => t << n | e >>> 32 - n, ww = (t, e, n) => e << n | t >>> 32 - n, bw = (t, e, n) => e << n - 32 | t >>> 64 - n, xw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function mw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Sw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ew = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Aw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $w = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Iw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), vw = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, J = {
  fromBig: id,
  split: ow,
  toBig: aw,
  shrSH: cw,
  shrSL: lw,
  rotrSH: uw,
  rotrSL: fw,
  rotrBH: hw,
  rotrBL: dw,
  rotr32H: pw,
  rotr32L: gw,
  rotlSH: yw,
  rotlSL: ww,
  rotlBH: bw,
  rotlBL: xw,
  add: mw,
  add3L: Sw,
  add3H: Ew,
  add4L: Aw,
  add4H: $w,
  add5H: vw,
  add5L: Iw
}, [Lw, Cw] = J.split([
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
].map((t) => BigInt(t))), hn = new Uint32Array(80), dn = new Uint32Array(80);
let Ao = class extends Pc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      hn[b] = e.getUint32(n), dn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = hn[b - 15] | 0, $ = dn[b - 15] | 0, H = J.rotrSH(L, $, 1) ^ J.rotrSH(L, $, 8) ^ J.shrSH(L, $, 7), R = J.rotrSL(L, $, 1) ^ J.rotrSL(L, $, 8) ^ J.shrSL(L, $, 7), P = hn[b - 2] | 0, O = dn[b - 2] | 0, x = J.rotrSH(P, O, 19) ^ J.rotrBH(P, O, 61) ^ J.shrSH(P, O, 6), v = J.rotrSL(P, O, 19) ^ J.rotrBL(P, O, 61) ^ J.shrSL(P, O, 6), T = J.add4L(R, v, dn[b - 7], dn[b - 16]), z = J.add4H(T, H, x, hn[b - 7], hn[b - 16]);
      hn[b] = z | 0, dn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = J.rotrSH(u, g, 14) ^ J.rotrSH(u, g, 18) ^ J.rotrBH(u, g, 41), $ = J.rotrSL(u, g, 14) ^ J.rotrSL(u, g, 18) ^ J.rotrBL(u, g, 41), H = u & h ^ ~u & w, R = g & y ^ ~g & I, P = J.add5L(M, $, R, Cw[b], dn[b]), O = J.add5H(P, k, L, H, Lw[b], hn[b]), x = P | 0, v = J.rotrSH(r, s, 28) ^ J.rotrBH(r, s, 34) ^ J.rotrBH(r, s, 39), T = J.rotrSL(r, s, 28) ^ J.rotrBL(r, s, 34) ^ J.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, p = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = g | 0, { h: u, l: g } = J.add(l | 0, f | 0, O | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const A = J.add3L(x, T, p);
      r = J.add3H(A, O, v, z), s = A | 0;
    }
    ({ h: r, l: s } = J.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = J.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = J.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = J.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = J.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: y } = J.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = J.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = J.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, y, w, I, k, M);
  }
  roundClean() {
    hn.fill(0), dn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Bw = class extends Ao {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, kw = class extends Ao {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Mw = class extends Ao {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const _w = $r(() => new Ao());
$r(() => new Bw());
$r(() => new kw());
$r(() => new Mw());
function od(t) {
  return Zr(t);
}
function Tw(t) {
  return _w(t);
}
const Uw = 0;
_t.hmacSha256Sync = (t, ...e) => {
  const n = So.create(Zr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Hw() {
  return q(_t.randomPrivateKey());
}
function Nw(t) {
  const e = Zr(Zr(t));
  return X1.encode(ze(t, e).slice(0, t.length + 4));
}
function Pw(t, e) {
  return Nw(ze(new Uint8Array([t]), e.slice(0, 20)));
}
function ad(t, e = Uw) {
  const n = typeof t == "string" ? ht(t) : t, r = iw(od(n));
  return Pw(e, r);
}
function cd(t) {
  const e = Hc(t);
  return q(Zs(e.slice(0, 32), !0));
}
_t.hmacSha256Sync = (t, ...e) => {
  const n = So.create(Zr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Xi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Xi || (Xi = {}));
async function Ow(t, e, n) {
  return await (await ed()).encrypt("aes-256-cbc", e, t, n);
}
async function Dw(t, e, n) {
  return await (await ed()).decrypt("aes-256-cbc", e, t, n);
}
function ld(t, e) {
  return So(Zr, t, e);
}
function jw(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function ud(t) {
  const e = Tw(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Fw(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function zw(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Fw(t))
    return e;
  try {
    return it.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Rw(t, e, n, r) {
  const s = zw(t);
  if (!s.result)
    throw s;
  const i = _t.randomPrivateKey(), o = Zs(i, !0);
  let a = Fc(i, t, !0);
  a = a.slice(1);
  const c = ud(a), l = _t.randomBytes(16), f = await Ow(l, c.encryptionKey, e), u = ze(l, o, f), g = ld(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = q(f);
  else if (r === "base64")
    h = _1(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: q(l),
    ephemeralPK: q(o),
    cipherText: h,
    mac: q(g),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function fd(t, e) {
  if (!e.ephemeralPK)
    throw new au("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Fc(t, n, !0);
  r = r.slice(1);
  const s = ud(r), i = ht(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ht(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = M1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ze(i, ht(n), o), c = ld(s.hmacKey, a), l = ht(e.mac);
  if (!jw(l, c))
    throw new au("Decryption failed: failure in MAC check");
  const f = await Dw(i, s.encryptionKey, o);
  return e.wasString ? Xs(f) : f;
}
function Gw(t, e) {
  const n = typeof e == "string" ? Ar(e) : e, r = cd(t), s = od(n), i = Eo(s, t);
  return {
    signature: q(i),
    publicKey: r
  };
}
async function Vw(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = cd(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ar(t) : t, o = await Rw(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Gw(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Kw(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return fd(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var zt = {}, ns = {}, qt = {};
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.decode = qt.encode = qt.unescape = qt.escape = qt.pad = void 0;
const hd = Qs;
function Gc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
qt.pad = Gc;
function dd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
qt.escape = dd;
function pd(t) {
  return Gc(t).replace(/-/g, "+").replace(/_/g, "/");
}
qt.unescape = pd;
function qw(t) {
  return dd((0, hd.fromByteArray)(new TextEncoder().encode(t)));
}
qt.encode = qw;
function Ww(t) {
  return new TextDecoder().decode((0, hd.toByteArray)(Gc(pd(t))));
}
qt.decode = Ww;
var $o = {}, Io = {}, gd = {}, yd = {}, vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.crypto = void 0;
vo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = g, t.rotl = h, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = M, t.hexToBytes = $, t.asyncLoop = R, t.utf8ToBytes = P, t.bytesToUtf8 = O, t.toBytes = x, t.kdfInputToBytes = v, t.concatBytes = T, t.checkOpts = z, t.createHasher = A, t.createOptHasher = U, t.createXOFer = W, t.randomBytes = Y;
  const e = vo;
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
    const X = B.outputLen;
    if (m.length < X)
      throw new Error("digestInto() expects output buffer of length at least " + X);
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
  function g(m, B) {
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
    for (let X = 0; X < m.length; X++)
      B += k[m[X]];
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
  function $(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (I)
      return Uint8Array.fromHex(m);
    const B = m.length, X = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const at = new Uint8Array(X);
    for (let ft = 0, Lt = 0; ft < X; ft++, Lt += 2) {
      const Ot = L(m.charCodeAt(Lt)), Vt = L(m.charCodeAt(Lt + 1));
      if (Ot === void 0 || Vt === void 0) {
        const Et = m[Lt] + m[Lt + 1];
        throw new Error('hex string expected, got non-hex character "' + Et + '" at index ' + Lt);
      }
      at[ft] = Ot * 16 + Vt;
    }
    return at;
  }
  const H = async () => {
  };
  t.nextTick = H;
  async function R(m, B, X) {
    let at = Date.now();
    for (let ft = 0; ft < m; ft++) {
      X(ft);
      const Lt = Date.now() - at;
      Lt >= 0 && Lt < B || (await (0, t.nextTick)(), at += Lt);
    }
  }
  function P(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function O(m) {
    return new TextDecoder().decode(m);
  }
  function x(m) {
    return typeof m == "string" && (m = P(m)), s(m), m;
  }
  function v(m) {
    return typeof m == "string" && (m = P(m)), s(m), m;
  }
  function T(...m) {
    let B = 0;
    for (let at = 0; at < m.length; at++) {
      const ft = m[at];
      s(ft), B += ft.length;
    }
    const X = new Uint8Array(B);
    for (let at = 0, ft = 0; at < m.length; at++) {
      const Lt = m[at];
      X.set(Lt, ft), ft += Lt.length;
    }
    return X;
  }
  function z(m, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, B);
  }
  class p {
  }
  t.Hash = p;
  function A(m) {
    const B = (at) => m().update(x(at)).digest(), X = m();
    return B.outputLen = X.outputLen, B.blockLen = X.blockLen, B.create = () => m(), B;
  }
  function U(m) {
    const B = (at, ft) => m(ft).update(x(at)).digest(), X = m({});
    return B.outputLen = X.outputLen, B.blockLen = X.blockLen, B.create = (at) => m(at), B;
  }
  function W(m) {
    const B = (at, ft) => m(ft).update(x(at)).digest(), X = m({});
    return B.outputLen = X.outputLen, B.blockLen = X.blockLen, B.create = (at) => m(at), B;
  }
  t.wrapConstructor = A, t.wrapConstructorWithOpts = U, t.wrapXOFConstructorWithOpts = W;
  function Y(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(yd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = yd;
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
})(gd);
const Dr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function wd(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ua(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ir(t, ...e) {
  if (!wd(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Yw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ua(t.outputLen), Ua(t.blockLen);
}
function Ha(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function bd(t, e) {
  Ir(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Xw(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Zw(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Zi(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Oi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ee(t, e) {
  return t << 32 - e | t >>> e;
}
function Qw(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Vc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Kc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const xd = Vc ? (t) => t : (t) => Kc(t), Jw = xd;
function md(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Kc(t[e]);
  return t;
}
const tb = Vc ? (t) => t : md, Sd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", eb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nb(t) {
  if (Ir(t), Sd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += eb[t[n]];
  return e;
}
const Ze = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function mu(t) {
  if (t >= Ze._0 && t <= Ze._9)
    return t - Ze._0;
  if (t >= Ze.A && t <= Ze.F)
    return t - (Ze.A - 10);
  if (t >= Ze.a && t <= Ze.f)
    return t - (Ze.a - 10);
}
function rb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Sd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = mu(t.charCodeAt(i)), a = mu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Ed = async () => {
};
async function sb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Ed(), r += i);
  }
}
function qc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ib(t) {
  return new TextDecoder().decode(t);
}
function Js(t) {
  return typeof t == "string" && (t = qc(t)), Ir(t), t;
}
function ob(t) {
  return typeof t == "string" && (t = qc(t)), Ir(t), t;
}
function ab(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ir(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function cb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Ad = class {
};
function Lo(t) {
  const e = (r) => t().update(Js(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $d(t) {
  const e = (r, s) => t(s).update(Js(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Id(t) {
  const e = (r, s) => t(s).update(Js(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const lb = Lo, ub = $d, fb = Id;
function hb(t = 32) {
  if (Dr && typeof Dr.getRandomValues == "function")
    return Dr.getRandomValues(new Uint8Array(t));
  if (Dr && typeof Dr.randomBytes == "function")
    return Uint8Array.from(Dr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Ad,
  abytes: Ir,
  aexists: Ha,
  ahash: Yw,
  anumber: Ua,
  aoutput: bd,
  asyncLoop: sb,
  byteSwap: Kc,
  byteSwap32: md,
  byteSwapIfBE: Jw,
  bytesToHex: nb,
  bytesToUtf8: ib,
  checkOpts: cb,
  clean: Zi,
  concatBytes: ab,
  createHasher: Lo,
  createOptHasher: $d,
  createView: Oi,
  createXOFer: Id,
  hexToBytes: rb,
  isBytes: wd,
  isLE: Vc,
  kdfInputToBytes: ob,
  nextTick: Ed,
  randomBytes: hb,
  rotl: Qw,
  rotr: Ee,
  swap32IfBE: tb,
  swap8IfBE: xd,
  toBytes: Js,
  u32: Zw,
  u8: Xw,
  utf8ToBytes: qc,
  wrapConstructor: lb,
  wrapConstructorWithOpts: ub,
  wrapXOFConstructorWithOpts: fb
}, Symbol.toStringTag, { value: "Module" }));
function pb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function gb(t, e, n) {
  return t & e ^ ~t & n;
}
function yb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class wb extends Ad {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Oi(this.buffer);
  }
  update(e) {
    Ha(this), e = Js(e), Ir(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ha(this), bd(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Zi(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    pb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oi(e), c = this.outputLen;
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
const pn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), bb = /* @__PURE__ */ Uint32Array.from([
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
]), yn = /* @__PURE__ */ new Uint32Array(64);
let Wc = class extends wb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = pn[0] | 0, this.B = pn[1] | 0, this.C = pn[2] | 0, this.D = pn[3] | 0, this.E = pn[4] | 0, this.F = pn[5] | 0, this.G = pn[6] | 0, this.H = pn[7] | 0;
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
      yn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = yn[u - 15], h = yn[u - 2], y = Ee(g, 7) ^ Ee(g, 18) ^ g >>> 3, w = Ee(h, 17) ^ Ee(h, 19) ^ h >>> 10;
      yn[u] = w + yn[u - 7] + y + yn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Ee(a, 6) ^ Ee(a, 11) ^ Ee(a, 25), h = f + g + gb(a, c, l) + bb[u] + yn[u] | 0, w = (Ee(r, 2) ^ Ee(r, 13) ^ Ee(r, 22)) + yb(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Zi(yn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Zi(this.buffer);
  }
}, vd = class extends Wc {
  constructor() {
    super(28), this.A = gn[0] | 0, this.B = gn[1] | 0, this.C = gn[2] | 0, this.D = gn[3] | 0, this.E = gn[4] | 0, this.F = gn[5] | 0, this.G = gn[6] | 0, this.H = gn[7] | 0;
  }
};
const xb = /* @__PURE__ */ Lo(() => new Wc()), mb = /* @__PURE__ */ Lo(() => new vd()), Sb = Wc, Eb = xb, Ab = vd, $b = mb, Ib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Ab,
  SHA256: Sb,
  sha224: $b,
  sha256: Eb
}, Symbol.toStringTag, { value: "Module" })), Co = /* @__PURE__ */ xo(Ib), vb = /* @__PURE__ */ xo(k1);
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.joseToDer = rs.derToJose = void 0;
const Ld = Qs, Cd = qt;
function ca(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Lb = {
  ES256: ca(256),
  ES384: ca(384),
  ES512: ca(521)
};
function Bd(t) {
  const e = Lb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Qi = 128, kd = 0, Cb = 32, Bb = 16, kb = 2, Md = Bb | Cb | kd << 6, Ji = kb | kd << 6;
function _d(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ld.toByteArray)((0, Cd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Mb(t, e) {
  const n = _d(t), r = Bd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Md)
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
  const g = r - c, h = r - f, y = new Uint8Array(g + c + h + f);
  for (o = 0; o < g; ++o)
    y[o] = 0;
  y.set(n.subarray(l + Math.max(-g, 0), l + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    y[o] = 0;
  return y.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, Cd.escape)((0, Ld.fromByteArray)(y));
}
rs.derToJose = Mb;
function Su(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Qi && --r, r;
}
function _b(t, e) {
  t = _d(t);
  const n = Bd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Su(t, 0, n), i = Su(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Qi, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = Md, l ? f[u++] = c : (f[u++] = Qi | 1, f[u++] = c & 255), f[u++] = Ji, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = Ji, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
rs.joseToDer = _b;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.InvalidTokenError = sn.MissingParametersError = void 0;
class Tb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
sn.MissingParametersError = Tb;
class Ub extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
sn.InvalidTokenError = Ub;
const ti = /* @__PURE__ */ xo(db);
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.SECP256K1Client = void 0;
const Hb = gd, Nb = Co, Di = vb, Eu = rs, Au = sn, $u = ti;
Di.utils.hmacSha256Sync = (t, ...e) => {
  const n = Hb.hmac.create(Nb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Td {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, $u.bytesToHex)(Di.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Au.MissingParametersError("a signing input hash and private key are all required");
    const s = Di.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, $u.bytesToHex)(s);
    if (r === "jose")
      return (0, Eu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Eu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Au.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Di.verify(n, e, r, { strict: !1 });
  }
}
Io.SECP256K1Client = Td;
Td.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Io;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})($o);
var ur = {};
const Pb = /* @__PURE__ */ xo(jh);
var Ob = Yt && Yt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.hashSha256Async = ur.hashSha256 = void 0;
const Db = Co;
function Ud(t) {
  return (0, Db.sha256)(t);
}
ur.hashSha256 = Ud;
function jb(t) {
  return Ob(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Pb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ud(t));
    }
  });
}
ur.hashSha256Async = jb;
var Fb = Yt && Yt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.TokenSigner = ns.createUnsecuredToken = void 0;
const Na = qt, Iu = $o, zb = sn, vu = ur;
function Pa(t, e) {
  const n = [], r = Na.encode(JSON.stringify(e));
  n.push(r);
  const s = Na.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Rb(t) {
  return Pa(t, { typ: "JWT", alg: "none" }) + ".";
}
ns.createUnsecuredToken = Rb;
class Gb {
  constructor(e, n) {
    if (!(e && n))
      throw new zb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Iu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Iu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Pa(e, s), o = (0, vu.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Fb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Pa(e, s), o = yield (0, vu.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Na.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
ns.TokenSigner = Gb;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.TokenVerifier = void 0;
const Vb = qt, Lu = $o, Kb = sn, wi = ur;
class qb {
  constructor(e, n) {
    if (!(e && n))
      throw new Kb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Lu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Lu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, wi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, wi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Vb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, wi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, wi.hashSha256)(r);
      return i(o);
    }
  }
}
Bo.TokenVerifier = qb;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
ko.decodeToken = void 0;
const bi = qt;
function Wb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(bi.decode(e[0])), r = JSON.parse(bi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = bi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(bi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ko.decodeToken = Wb;
(function(t) {
  var e = Yt && Yt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Yt && Yt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ns, t), n(Bo, t), n(ko, t), n(sn, t), n($o, t);
})(zt);
function Yb(t) {
  return `did:btc-addr:${t}`;
}
function Xb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new ou("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new ou('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Hd(t) {
  if (t)
    return Xb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Zb = "1.4.0";
function Qb() {
  return Hw();
}
function Jb(t, e, n, r = kh.slice(), s, i = _y().getTime(), o = {}) {
  const a = (h) => {
    const y = Tc("location", {
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
    version: Zb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = zt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = ad(l);
  return c.iss = Yb(f), new zt.TokenSigner("ES256k", t).sign(c);
}
async function Cu(t, e) {
  const n = Xs(ht(e)), r = JSON.parse(n), s = await fd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function t2(t) {
  const e = zt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new zt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function e2(t) {
  const e = zt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Hd(e.iss);
  if (n.length === 1) {
    if (ad(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function n2(t) {
  const e = zt.decodeToken(t).payload;
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
function r2(t) {
  const e = zt.decodeToken(t).payload;
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
function s2(t) {
  const e = [
    r2(t),
    n2(t),
    t2(t),
    e2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Bu = "1.0.0";
class Dn {
  constructor(e) {
    this.version = Bu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Bu)
      throw new Ca(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Dn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Nd {
  constructor(e) {
    if (e) {
      const n = new Dn(e);
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
class ku extends Nd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Dn({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Mh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Dn({})), !0;
  }
}
class Mu extends Nd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = By, !localStorage.getItem(this.key)) {
      const r = new Dn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Dn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Dn({})), !0;
  }
}
var Os;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Os || (Os = {}));
var to;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(to || (to = {}));
Os.Mainnet;
var nn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nn || (nn = {}));
var De;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(De || (De = {}));
nn.Mainnet;
const Pd = {
  chainId: Os.Mainnet,
  transactionVersion: nn.Mainnet,
  peerNetworkId: to.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: De.MainnetSingleSig,
    multiSig: De.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Oa = {
  chainId: Os.Testnet,
  transactionVersion: nn.Testnet,
  peerNetworkId: to.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: De.TestnetSingleSig,
    multiSig: De.TestnetMultiSig
  },
  client: { baseUrl: Th }
}, ji = {
  ...Oa,
  addressVersion: { ...Oa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, i2 = {
  ...ji,
  addressVersion: { ...ji.addressVersion },
  client: { ...ji.client }
};
function o2(t) {
  switch (t) {
    case "mainnet":
      return Pd;
    case "testnet":
      return Oa;
    case "devnet":
      return ji;
    case "mocknet":
      return i2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Od(t) {
  return typeof t == "string" ? o2(t) : t;
}
var _u;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_u || (_u = {}));
var Tu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Tu || (Tu = {}));
var Ae;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ae || (Ae = {}));
const la = ["onChainOnly", "offChainOnly", "any"];
la[0] + "", Ae.OnChainOnly, la[1] + "", Ae.OffChainOnly, la[2] + "", Ae.Any, Ae.OnChainOnly + "", Ae.OnChainOnly, Ae.OffChainOnly + "", Ae.OffChainOnly, Ae.Any + "", Ae.Any;
var Uu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Uu || (Uu = {}));
var Hu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Hu || (Hu = {}));
var Nu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Nu || (Nu = {}));
var tn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(tn || (tn = {}));
var Pu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Pu || (Pu = {}));
var Ou;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ou || (Ou = {}));
var Du;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Du || (Du = {}));
var ju;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ju || (ju = {}));
var Fu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fu || (Fu = {}));
var zu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zu || (zu = {}));
var Ru;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ru || (Ru = {}));
var Gu;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Gu || (Gu = {}));
var Vu;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Vu || (Vu = {}));
function Da(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function a2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function c2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Da(t.outputLen), Da(t.blockLen);
}
function l2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function u2(t, e) {
  Dd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qn = {
  number: Da,
  bool: a2,
  bytes: Dd,
  hash: c2,
  exists: l2,
  output: u2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ua = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Te = (t, e) => t << 32 - e | t >>> e, f2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!f2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function h2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yc(t) {
  if (typeof t == "string" && (t = h2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let jd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function vr(t) {
  const e = (r) => t().update(Yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fd = class extends jd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qn.hash(e);
    const r = Yc(n);
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
    return Qn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Qn.exists(this), Qn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const zd = (t, e, n) => new Fd(t, e).update(n).digest();
zd.create = (t, e) => new Fd(t, e);
function d2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Xc = class extends jd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ua(this.buffer);
  }
  update(e) {
    Qn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ua(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Qn.exists(this), Qn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    d2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ua(e), c = this.outputLen;
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
const p2 = (t, e, n) => t & e ^ ~t & n, g2 = (t, e, n) => t & e ^ t & n ^ e & n, y2 = new Uint32Array([
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
let Rd = class extends Xc {
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
      const g = bn[u - 15], h = bn[u - 2], y = Te(g, 7) ^ Te(g, 18) ^ g >>> 3, w = Te(h, 17) ^ Te(h, 19) ^ h >>> 10;
      bn[u] = w + bn[u - 7] + y + bn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Te(a, 6) ^ Te(a, 11) ^ Te(a, 25), h = f + g + p2(a, c, l) + y2[u] + bn[u] | 0, w = (Te(r, 2) ^ Te(r, 13) ^ Te(r, 22)) + g2(r, s, i) | 0;
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
}, w2 = class extends Rd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Gd = vr(() => new Rd());
vr(() => new w2());
var Lr = {}, Zc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ti;
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
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = u ? u[0].length : 0;
    for (let h = 0; h < g; h++)
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
    let f = [], u = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (f.unshift(n[u]), g = 0, u = 0);
      const k = (t.c32.indexOf(o[w]) << g) + u, M = n[k % 16];
      if (g += 1, u = k >> 4, u > 1 << g)
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
})(Zc);
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.c32checkDecode = fr.c32checkEncode = void 0;
const Ku = Co, qu = ti, Ms = Zc;
function Vd(t) {
  const e = (0, Ku.sha256)((0, Ku.sha256)((0, qu.hexToBytes)(t)));
  return (0, qu.bytesToHex)(e.slice(0, 4));
}
function b2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Vd(`${n}${e}`), s = (0, Ms.c32encode)(`${e}${r}`);
  return `${Ms.c32[t]}${s}`;
}
fr.c32checkEncode = b2;
function x2(t) {
  t = (0, Ms.c32normalize)(t);
  const e = (0, Ms.c32decode)(t.slice(1)), n = t[0], r = Ms.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Vd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
fr.c32checkDecode = x2;
var Kd = {}, ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
ss.decode = ss.encode = void 0;
const eo = Co, Wu = ti, qd = nd, Wd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function m2(t, e = "00") {
  const n = typeof t == "string" ? (0, Wu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Wu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...r, ...n])));
  return qd(Wd).encode([...r, ...n, ...s.slice(0, 4)]);
}
ss.encode = m2;
function S2(t) {
  const e = qd(Wd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ss.decode = S2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = fr, n = ss, r = ti;
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
    const g = n.decode(f), h = (0, r.bytesToHex)(g.data), y = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return u < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = u, o(w, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const g = a(f), h = g[0], y = g[1];
    let w;
    u < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = u;
    let I = w.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(y, I);
  }
  t.c32ToB58 = l;
})(Kd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Zc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = fr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Kd;
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
})(Lr);
function E2(t, e) {
  switch (e = Od(e ?? Pd), t) {
    case tn.P2PKH:
      switch (e.transactionVersion) {
        case nn.Mainnet:
          return De.MainnetSingleSig;
        case nn.Testnet:
          return De.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case tn.P2SH:
    case tn.P2SHNonSequential:
    case tn.P2WPKH:
    case tn.P2WSH:
    case tn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case nn.Mainnet:
          return De.MainnetMultiSig;
        case nn.Testnet:
          return De.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const A2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yd = Uint8Array.from({ length: 16 }, (t, e) => e), $2 = Yd.map((t) => (9 * t + 5) % 16);
let Qc = [Yd], Jc = [$2];
for (let t = 0; t < 4; t++)
  for (let e of [Qc, Jc])
    e.push(e[t].map((n) => A2[n]));
const Xd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), I2 = Qc.map((t, e) => t.map((n) => Xd[e][n])), v2 = Jc.map((t, e) => t.map((n) => Xd[e][n])), L2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), C2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), xi = (t, e) => t << e | t >>> 32 - e;
function Yu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const mi = new Uint32Array(16);
let B2 = class extends Xc {
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
      mi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = L2[h], I = C2[h], k = Qc[h], M = Jc[h], b = I2[h], L = v2[h];
      for (let $ = 0; $ < 16; $++) {
        const H = xi(r + Yu(h, i, a, l) + mi[k[$]] + w, b[$]) + u | 0;
        r = u, u = l, l = xi(a, 10) | 0, a = i, i = H;
      }
      for (let $ = 0; $ < 16; $++) {
        const H = xi(s + Yu(y, o, c, f) + mi[M[$]] + I, L[$]) + g | 0;
        s = g, g = f, f = xi(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    mi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const k2 = vr(() => new B2()), Si = BigInt(2 ** 32 - 1), ja = BigInt(32);
function Zd(t, e = !1) {
  return e ? { h: Number(t & Si), l: Number(t >> ja & Si) } : { h: Number(t >> ja & Si) | 0, l: Number(t & Si) | 0 };
}
function M2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Zd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const _2 = (t, e) => BigInt(t >>> 0) << ja | BigInt(e >>> 0), T2 = (t, e, n) => t >>> n, U2 = (t, e, n) => t << 32 - n | e >>> n, H2 = (t, e, n) => t >>> n | e << 32 - n, N2 = (t, e, n) => t << 32 - n | e >>> n, P2 = (t, e, n) => t << 64 - n | e >>> n - 32, O2 = (t, e, n) => t >>> n - 32 | e << 64 - n, D2 = (t, e) => e, j2 = (t, e) => t, F2 = (t, e, n) => t << n | e >>> 32 - n, z2 = (t, e, n) => e << n | t >>> 32 - n, R2 = (t, e, n) => e << n - 32 | t >>> 64 - n, G2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function V2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), q2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, W2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Y2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Z2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, tt = {
  fromBig: Zd,
  split: M2,
  toBig: _2,
  shrSH: T2,
  shrSL: U2,
  rotrSH: H2,
  rotrSL: N2,
  rotrBH: P2,
  rotrBL: O2,
  rotr32H: D2,
  rotr32L: j2,
  rotlSH: F2,
  rotlSL: z2,
  rotlBH: R2,
  rotlBL: G2,
  add: V2,
  add3L: K2,
  add3H: q2,
  add4L: W2,
  add4H: Y2,
  add5H: Z2,
  add5L: X2
}, [Q2, J2] = tt.split([
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
let Mo = class extends Xc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      xn[b] = e.getUint32(n), mn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = xn[b - 15] | 0, $ = mn[b - 15] | 0, H = tt.rotrSH(L, $, 1) ^ tt.rotrSH(L, $, 8) ^ tt.shrSH(L, $, 7), R = tt.rotrSL(L, $, 1) ^ tt.rotrSL(L, $, 8) ^ tt.shrSL(L, $, 7), P = xn[b - 2] | 0, O = mn[b - 2] | 0, x = tt.rotrSH(P, O, 19) ^ tt.rotrBH(P, O, 61) ^ tt.shrSH(P, O, 6), v = tt.rotrSL(P, O, 19) ^ tt.rotrBL(P, O, 61) ^ tt.shrSL(P, O, 6), T = tt.add4L(R, v, mn[b - 7], mn[b - 16]), z = tt.add4H(T, H, x, xn[b - 7], xn[b - 16]);
      xn[b] = z | 0, mn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = tt.rotrSH(u, g, 14) ^ tt.rotrSH(u, g, 18) ^ tt.rotrBH(u, g, 41), $ = tt.rotrSL(u, g, 14) ^ tt.rotrSL(u, g, 18) ^ tt.rotrBL(u, g, 41), H = u & h ^ ~u & w, R = g & y ^ ~g & I, P = tt.add5L(M, $, R, J2[b], mn[b]), O = tt.add5H(P, k, L, H, Q2[b], xn[b]), x = P | 0, v = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), T = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, p = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = g | 0, { h: u, l: g } = tt.add(l | 0, f | 0, O | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const A = tt.add3L(x, T, p);
      r = tt.add3H(A, O, v, z), s = A | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = tt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = tt.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: y } = tt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = tt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = tt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, y, w, I, k, M);
  }
  roundClean() {
    xn.fill(0), mn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tx = class extends Mo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ex = class extends Mo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nx = class extends Mo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
vr(() => new Mo());
vr(() => new tx());
vr(() => new ex());
vr(() => new nx());
var no = { exports: {} };
no.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", y = "[object Object]", w = "[object Promise]", I = "[object RegExp]", k = "[object Set]", M = "[object String]", b = "[object Symbol]", L = "[object WeakMap]", $ = "[object ArrayBuffer]", H = "[object DataView]", R = "[object Float32Array]", P = "[object Float64Array]", O = "[object Int8Array]", x = "[object Int16Array]", v = "[object Int32Array]", T = "[object Uint8Array]", z = "[object Uint8ClampedArray]", p = "[object Uint16Array]", A = "[object Uint32Array]", U = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, Y = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[$] = B[H] = B[a] = B[c] = B[R] = B[P] = B[O] = B[x] = B[v] = B[g] = B[h] = B[y] = B[I] = B[k] = B[M] = B[b] = B[T] = B[z] = B[p] = B[A] = !0, B[l] = B[f] = B[L] = !1;
  var X = typeof Yt == "object" && Yt && Yt.Object === Object && Yt, at = typeof self == "object" && self && self.Object === Object && self, ft = X || at || Function("return this")(), Lt = e && !e.nodeType && e, Ot = Lt && !0 && t && !t.nodeType && t, Vt = Ot && Ot.exports === Lt;
  function Et(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function lt(d, S) {
    return d.add(S), d;
  }
  function Nt(d, S) {
    for (var C = -1, G = d ? d.length : 0; ++C < G && S(d[C], C, d) !== !1; )
      ;
    return d;
  }
  function Dt(d, S) {
    for (var C = -1, G = S.length, Ft = d.length; ++C < G; )
      d[Ft + C] = S[C];
    return d;
  }
  function he(d, S, C, G) {
    for (var Ft = -1, Qt = d ? d.length : 0; ++Ft < Qt; )
      C = S(C, d[Ft], Ft, d);
    return C;
  }
  function Rn(d, S) {
    for (var C = -1, G = Array(d); ++C < d; )
      G[C] = S(C);
    return G;
  }
  function me(d, S) {
    return d == null ? void 0 : d[S];
  }
  function cn(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function Gn(d) {
    var S = -1, C = Array(d.size);
    return d.forEach(function(G, Ft) {
      C[++S] = [Ft, G];
    }), C;
  }
  function ke(d, S) {
    return function(C) {
      return d(S(C));
    };
  }
  function qe(d) {
    var S = -1, C = Array(d.size);
    return d.forEach(function(G) {
      C[++S] = G;
    }), C;
  }
  var ln = Array.prototype, _r = Function.prototype, Z = Object.prototype, At = ft["__core-js_shared__"], de = function() {
    var d = /[^.]+$/.exec(At && At.keys && At.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), si = _r.toString, E = Z.hasOwnProperty, j = Z.toString, V = RegExp(
    "^" + si.call(E).replace(U, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), F = Vt ? ft.Buffer : void 0, yt = ft.Symbol, xt = ft.Uint8Array, mt = ke(Object.getPrototypeOf, Object), re = Object.create, We = Z.propertyIsEnumerable, Zt = ln.splice, Me = Object.getOwnPropertySymbols, Tr = F ? F.isBuffer : void 0, Vn = ke(Object.keys, Object), Wo = Nr(ft, "DataView"), Ss = Nr(ft, "Map"), Yo = Nr(ft, "Promise"), Xo = Nr(ft, "Set"), Zo = Nr(ft, "WeakMap"), Es = Nr(Object, "create"), tg = Wn(Wo), eg = Wn(Ss), ng = Wn(Yo), rg = Wn(Xo), sg = Wn(Zo), Gl = yt ? yt.prototype : void 0, Vl = Gl ? Gl.valueOf : void 0;
  function Kn(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var G = d[S];
      this.set(G[0], G[1]);
    }
  }
  function ig() {
    this.__data__ = Es ? Es(null) : {};
  }
  function og(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function ag(d) {
    var S = this.__data__;
    if (Es) {
      var C = S[d];
      return C === r ? void 0 : C;
    }
    return E.call(S, d) ? S[d] : void 0;
  }
  function cg(d) {
    var S = this.__data__;
    return Es ? S[d] !== void 0 : E.call(S, d);
  }
  function lg(d, S) {
    var C = this.__data__;
    return C[d] = Es && S === void 0 ? r : S, this;
  }
  Kn.prototype.clear = ig, Kn.prototype.delete = og, Kn.prototype.get = ag, Kn.prototype.has = cg, Kn.prototype.set = lg;
  function Ye(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var G = d[S];
      this.set(G[0], G[1]);
    }
  }
  function ug() {
    this.__data__ = [];
  }
  function fg(d) {
    var S = this.__data__, C = ii(S, d);
    if (C < 0)
      return !1;
    var G = S.length - 1;
    return C == G ? S.pop() : Zt.call(S, C, 1), !0;
  }
  function hg(d) {
    var S = this.__data__, C = ii(S, d);
    return C < 0 ? void 0 : S[C][1];
  }
  function dg(d) {
    return ii(this.__data__, d) > -1;
  }
  function pg(d, S) {
    var C = this.__data__, G = ii(C, d);
    return G < 0 ? C.push([d, S]) : C[G][1] = S, this;
  }
  Ye.prototype.clear = ug, Ye.prototype.delete = fg, Ye.prototype.get = hg, Ye.prototype.has = dg, Ye.prototype.set = pg;
  function Ur(d) {
    var S = -1, C = d ? d.length : 0;
    for (this.clear(); ++S < C; ) {
      var G = d[S];
      this.set(G[0], G[1]);
    }
  }
  function gg() {
    this.__data__ = {
      hash: new Kn(),
      map: new (Ss || Ye)(),
      string: new Kn()
    };
  }
  function yg(d) {
    return oi(this, d).delete(d);
  }
  function wg(d) {
    return oi(this, d).get(d);
  }
  function bg(d) {
    return oi(this, d).has(d);
  }
  function xg(d, S) {
    return oi(this, d).set(d, S), this;
  }
  Ur.prototype.clear = gg, Ur.prototype.delete = yg, Ur.prototype.get = wg, Ur.prototype.has = bg, Ur.prototype.set = xg;
  function Hr(d) {
    this.__data__ = new Ye(d);
  }
  function mg() {
    this.__data__ = new Ye();
  }
  function Sg(d) {
    return this.__data__.delete(d);
  }
  function Eg(d) {
    return this.__data__.get(d);
  }
  function Ag(d) {
    return this.__data__.has(d);
  }
  function $g(d, S) {
    var C = this.__data__;
    if (C instanceof Ye) {
      var G = C.__data__;
      if (!Ss || G.length < n - 1)
        return G.push([d, S]), this;
      C = this.__data__ = new Ur(G);
    }
    return C.set(d, S), this;
  }
  Hr.prototype.clear = mg, Hr.prototype.delete = Sg, Hr.prototype.get = Eg, Hr.prototype.has = Ag, Hr.prototype.set = $g;
  function Ig(d, S) {
    var C = ta(d) || Yg(d) ? Rn(d.length, String) : [], G = C.length, Ft = !!G;
    for (var Qt in d)
      E.call(d, Qt) && !(Ft && (Qt == "length" || Vg(Qt, G))) && C.push(Qt);
    return C;
  }
  function Kl(d, S, C) {
    var G = d[S];
    (!(E.call(d, S) && Xl(G, C)) || C === void 0 && !(S in d)) && (d[S] = C);
  }
  function ii(d, S) {
    for (var C = d.length; C--; )
      if (Xl(d[C][0], S))
        return C;
    return -1;
  }
  function vg(d, S) {
    return d && ql(S, ea(S), d);
  }
  function Qo(d, S, C, G, Ft, Qt, Xe) {
    var Jt;
    if (G && (Jt = Qt ? G(d, Ft, Qt, Xe) : G(d)), Jt !== void 0)
      return Jt;
    if (!ai(d))
      return d;
    var Jl = ta(d);
    if (Jl) {
      if (Jt = zg(d), !S)
        return Dg(d, Jt);
    } else {
      var Pr = qn(d), tu = Pr == f || Pr == u;
      if (Zg(d))
        return _g(d, S);
      if (Pr == y || Pr == i || tu && !Qt) {
        if (cn(d))
          return Qt ? d : {};
        if (Jt = Rg(tu ? {} : d), !S)
          return jg(d, vg(Jt, d));
      } else {
        if (!B[Pr])
          return Qt ? d : {};
        Jt = Gg(d, Pr, Qo, S);
      }
    }
    Xe || (Xe = new Hr());
    var eu = Xe.get(d);
    if (eu)
      return eu;
    if (Xe.set(d, Jt), !Jl)
      var nu = C ? Fg(d) : ea(d);
    return Nt(nu || d, function(na, ci) {
      nu && (ci = na, na = d[ci]), Kl(Jt, ci, Qo(na, S, C, G, ci, d, Xe));
    }), Jt;
  }
  function Lg(d) {
    return ai(d) ? re(d) : {};
  }
  function Cg(d, S, C) {
    var G = S(d);
    return ta(d) ? G : Dt(G, C(d));
  }
  function Bg(d) {
    return j.call(d);
  }
  function kg(d) {
    if (!ai(d) || qg(d))
      return !1;
    var S = Ql(d) || cn(d) ? V : Y;
    return S.test(Wn(d));
  }
  function Mg(d) {
    if (!Yl(d))
      return Vn(d);
    var S = [];
    for (var C in Object(d))
      E.call(d, C) && C != "constructor" && S.push(C);
    return S;
  }
  function _g(d, S) {
    if (S)
      return d.slice();
    var C = new d.constructor(d.length);
    return d.copy(C), C;
  }
  function Jo(d) {
    var S = new d.constructor(d.byteLength);
    return new xt(S).set(new xt(d)), S;
  }
  function Tg(d, S) {
    var C = S ? Jo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.byteLength);
  }
  function Ug(d, S, C) {
    var G = S ? C(Gn(d), !0) : Gn(d);
    return he(G, Et, new d.constructor());
  }
  function Hg(d) {
    var S = new d.constructor(d.source, W.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Ng(d, S, C) {
    var G = S ? C(qe(d), !0) : qe(d);
    return he(G, lt, new d.constructor());
  }
  function Pg(d) {
    return Vl ? Object(Vl.call(d)) : {};
  }
  function Og(d, S) {
    var C = S ? Jo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.length);
  }
  function Dg(d, S) {
    var C = -1, G = d.length;
    for (S || (S = Array(G)); ++C < G; )
      S[C] = d[C];
    return S;
  }
  function ql(d, S, C, G) {
    C || (C = {});
    for (var Ft = -1, Qt = S.length; ++Ft < Qt; ) {
      var Xe = S[Ft], Jt = void 0;
      Kl(C, Xe, Jt === void 0 ? d[Xe] : Jt);
    }
    return C;
  }
  function jg(d, S) {
    return ql(d, Wl(d), S);
  }
  function Fg(d) {
    return Cg(d, ea, Wl);
  }
  function oi(d, S) {
    var C = d.__data__;
    return Kg(S) ? C[typeof S == "string" ? "string" : "hash"] : C.map;
  }
  function Nr(d, S) {
    var C = me(d, S);
    return kg(C) ? C : void 0;
  }
  var Wl = Me ? ke(Me, Object) : ty, qn = Bg;
  (Wo && qn(new Wo(new ArrayBuffer(1))) != H || Ss && qn(new Ss()) != g || Yo && qn(Yo.resolve()) != w || Xo && qn(new Xo()) != k || Zo && qn(new Zo()) != L) && (qn = function(d) {
    var S = j.call(d), C = S == y ? d.constructor : void 0, G = C ? Wn(C) : void 0;
    if (G)
      switch (G) {
        case tg:
          return H;
        case eg:
          return g;
        case ng:
          return w;
        case rg:
          return k;
        case sg:
          return L;
      }
    return S;
  });
  function zg(d) {
    var S = d.length, C = d.constructor(S);
    return S && typeof d[0] == "string" && E.call(d, "index") && (C.index = d.index, C.input = d.input), C;
  }
  function Rg(d) {
    return typeof d.constructor == "function" && !Yl(d) ? Lg(mt(d)) : {};
  }
  function Gg(d, S, C, G) {
    var Ft = d.constructor;
    switch (S) {
      case $:
        return Jo(d);
      case a:
      case c:
        return new Ft(+d);
      case H:
        return Tg(d, G);
      case R:
      case P:
      case O:
      case x:
      case v:
      case T:
      case z:
      case p:
      case A:
        return Og(d, G);
      case g:
        return Ug(d, G, C);
      case h:
      case M:
        return new Ft(d);
      case I:
        return Hg(d);
      case k:
        return Ng(d, G, C);
      case b:
        return Pg(d);
    }
  }
  function Vg(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Kg(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function qg(d) {
    return !!de && de in d;
  }
  function Yl(d) {
    var S = d && d.constructor, C = typeof S == "function" && S.prototype || Z;
    return d === C;
  }
  function Wn(d) {
    if (d != null) {
      try {
        return si.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function Wg(d) {
    return Qo(d, !0, !0);
  }
  function Xl(d, S) {
    return d === S || d !== d && S !== S;
  }
  function Yg(d) {
    return Xg(d) && E.call(d, "callee") && (!We.call(d, "callee") || j.call(d) == i);
  }
  var ta = Array.isArray;
  function Zl(d) {
    return d != null && Qg(d.length) && !Ql(d);
  }
  function Xg(d) {
    return Jg(d) && Zl(d);
  }
  var Zg = Tr || ey;
  function Ql(d) {
    var S = ai(d) ? j.call(d) : "";
    return S == f || S == u;
  }
  function Qg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function ai(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Jg(d) {
    return !!d && typeof d == "object";
  }
  function ea(d) {
    return Zl(d) ? Ig(d) : Mg(d);
  }
  function ty() {
    return [];
  }
  function ey() {
    return !1;
  }
  t.exports = Wg;
})(no, no.exports);
var rx = no.exports;
const Qd = /* @__PURE__ */ Ih(rx);
var Fa;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fa || (Fa = {}));
function sx(t, e) {
  return { type: Fa.Address, version: t, hash160: e };
}
function ix(t) {
  return Lr.c32address(t.version, t.hash160);
}
const ox = (t) => k2(Gd(t)), ax = (t) => q(ox(t));
_t.hmacSha256Sync = (t, ...e) => {
  const n = zd.create(Gd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function cx(t, e = "mainnet") {
  e = Od(e), t = typeof t == "string" ? ht(t) : t;
  const n = E2(tn.P2PKH, e), r = sx(n, ax(t));
  return ix(r);
}
function lx(t, e) {
  const n = zt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = cx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new zt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ux(t, e = null) {
  let n;
  e ? n = lx(t, e) : n = zt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Xu = "_blockstackDidCheckEchoReply", fx = "echoReply", hx = "authContinuation";
function dx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function px() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Xu];
  if (typeof e == "boolean")
    return e;
  const n = dx(t.location.search), r = n[fx];
  if (r) {
    t[Xu] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[hx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class za {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Hh();
    else
      throw new My("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Mu(e.sessionOptions) : this.store = new Mu() : e ? this.store = new ku(e.sessionOptions) : this.store = new ku();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Ty().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ca("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Jb(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Qb();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Tc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (px())
        return Rr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Rr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = n1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new li("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = zt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await s2(e))
      throw new li("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (sa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Cu(s, i.private_key);
          } catch {
            if (Rr.warn("Failed decryption of appPrivateKey, will try to use as given"), !_t.isValidPrivateKey(i.private_key))
              throw new li("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Cu(s, c);
          } catch {
            Rr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new li("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = Vy, f;
    sa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), sa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Hd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, g = i.profile_url;
    if (!u.profile && g) {
      const h = await n(g);
      if (!h.ok)
        u.profile = Object.assign({}, Cy);
      else {
        const y = await h.text(), w = JSON.parse(y);
        u.profile = ux(w[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ca("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vw(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Kw(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
za.prototype.makeAuthRequest = za.prototype.makeAuthRequestToken;
const gx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], yx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = gx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!_o(r.id));
  return e.concat(n);
}, _o = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Jd = "STX_PROVIDER", hr = () => typeof window > "u" ? null : window.localStorage.getItem(Jd), wx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Jd, t);
}, bx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xx(t, e) {
  const n = {};
  return Object.assign(n, bx, e), await fetch(t, n);
}
function mx(t) {
  let e = xx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sx(...t) {
  const { fetchLib: e, middlewares: n } = mx(t);
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
var is;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(is || (is = {}));
var dr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(dr || (dr = {}));
var Zu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zu || (Zu = {}));
const Ex = "https://api.mainnet.hiro.so", Ax = "https://api.testnet.hiro.so", $x = "http://localhost:3999", Ix = ["mainnet", "testnet", "devnet", "mocknet"];
class pr {
  constructor(e) {
    this.version = dr.Mainnet, this.chainId = is.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === dr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Sx();
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
pr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ra();
    case "testnet":
      return new Ga();
    case "devnet":
      return new vx();
    case "mocknet":
      return new t0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ix.join(", ")}`);
  }
};
pr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : pr.fromName(t);
class Ra extends pr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = dr.Mainnet, this.chainId = is.Mainnet;
  }
}
class Ga extends pr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = dr.Testnet, this.chainId = is.Testnet;
  }
}
class t0 extends pr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = dr.Testnet, this.chainId = is.Testnet;
  }
}
const vx = t0;
var gr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(gr || (gr = {}));
var ro;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ro || (ro = {}));
gr.Mainnet;
var yr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yr || (yr = {}));
var wr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(wr || (wr = {}));
yr.Mainnet;
const Lx = {
  chainId: gr.Mainnet,
  transactionVersion: yr.Mainnet,
  peerNetworkId: ro.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: wr.MainnetSingleSig,
    multiSig: wr.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Va = {
  chainId: gr.Testnet,
  transactionVersion: yr.Testnet,
  peerNetworkId: ro.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: wr.TestnetSingleSig,
    multiSig: wr.TestnetMultiSig
  },
  client: { baseUrl: Th }
}, Fi = {
  ...Va,
  addressVersion: { ...Va.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, Cx = {
  ...Fi,
  addressVersion: { ...Fi.addressVersion },
  client: { ...Fi.client }
};
function Bx(t) {
  switch (t) {
    case "mainnet":
      return Lx;
    case "testnet":
      return Va;
    case "devnet":
      return Fi;
    case "mocknet":
      return Cx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function kx(t) {
  return typeof t == "string" ? Bx(t) : t;
}
function Mx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Qu = /* @__PURE__ */ new Map();
function e0(t, e) {
  const n = Qu.get(t);
  if (n !== void 0)
    return n(e);
  const r = Mx(t);
  return Qu.set(t, r), e0(t, e);
}
let St = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? ht(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Qy(this.readBytes(4), 0);
  }
  readUInt8() {
    return Xy(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Wy(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = q(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = q(n);
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
    if (e0(e, r))
      return r;
    throw n(r);
  }
};
const _x = 128, Tx = 128, n0 = 16, rr = 32, Ka = 80, To = 65, Ux = 32, Hx = 64, so = 34, Nx = 1 + 16 * 1024 * 1024, Px = 165, Ox = 16, Dx = 16, jx = 20, Fx = Dx + 2 + jx, zx = Fx + 4, Rx = Nx + (Px + Ox * zx);
var pt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(pt || (pt = {}));
var qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(qa || (qa = {}));
var ie;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ie || (ie = {}));
const fa = ["onChainOnly", "offChainOnly", "any"];
fa[0] + "", ie.OnChainOnly, fa[1] + "", ie.OffChainOnly, fa[2] + "", ie.Any, ie.OnChainOnly + "", ie.OnChainOnly, ie.OffChainOnly + "", ie.OffChainOnly, ie.Any + "", ie.Any;
var io;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(io || (io = {}));
var $t;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($t || ($t = {}));
var kt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(kt || (kt = {}));
var wt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(wt || (wt = {}));
var Ct;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ct || (Ct = {}));
var _s;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(_s || (_s = {}));
var Wa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wa || (Wa = {}));
var Ya;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ya || (Ya = {}));
var Wt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Wt || (Wt = {}));
var Ju;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ju || (Ju = {}));
var Xa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Xa || (Xa = {}));
var Ie;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ie || (Ie = {}));
var tf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(tf || (tf = {}));
let Uo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Gr = class extends Uo {
  constructor(e) {
    super(e);
  }
}, Kt = class extends Uo {
  constructor(e) {
    super(e);
  }
}, oo = class extends Uo {
  constructor(e) {
    super(e);
  }
}, Jn = class extends Uo {
  constructor(e) {
    super(e);
  }
};
function Za(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Gx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function r0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Vx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Za(t.outputLen), Za(t.blockLen);
}
function Kx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qx(t, e) {
  r0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const tr = {
  number: Za,
  bool: Gx,
  bytes: r0,
  hash: Vx,
  exists: Kx,
  output: qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ue = (t, e) => t << 32 - e | t >>> e, Wx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function tl(t) {
  if (typeof t == "string" && (t = Yx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let s0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Cr(t) {
  const e = (r) => t().update(tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let i0 = class extends s0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, tr.hash(e);
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
};
const o0 = (t, e, n) => new i0(t, e).update(n).digest();
o0.create = (t, e) => new i0(t, e);
function Xx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let el = class extends s0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ha(this.buffer);
  }
  update(e) {
    tr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = tl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ha(e);
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
    Xx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ha(e), c = this.outputLen;
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
const Zx = (t, e, n) => t & e ^ ~t & n, Qx = (t, e, n) => t & e ^ t & n ^ e & n, Jx = new Uint32Array([
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
let a0 = class extends el {
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
      const g = En[u - 15], h = En[u - 2], y = Ue(g, 7) ^ Ue(g, 18) ^ g >>> 3, w = Ue(h, 17) ^ Ue(h, 19) ^ h >>> 10;
      En[u] = w + En[u - 7] + y + En[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Ue(a, 6) ^ Ue(a, 11) ^ Ue(a, 25), h = f + g + Zx(a, c, l) + Jx[u] + En[u] | 0, w = (Ue(r, 2) ^ Ue(r, 13) ^ Ue(r, 22)) + Qx(r, s, i) | 0;
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
}, tm = class extends a0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const nl = Cr(() => new a0());
Cr(() => new tm());
const em = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), c0 = Uint8Array.from({ length: 16 }, (t, e) => e), nm = c0.map((t) => (9 * t + 5) % 16);
let rl = [c0], sl = [nm];
for (let t = 0; t < 4; t++)
  for (let e of [rl, sl])
    e.push(e[t].map((n) => em[n]));
const l0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), rm = rl.map((t, e) => t.map((n) => l0[e][n])), sm = sl.map((t, e) => t.map((n) => l0[e][n])), im = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), om = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ei = (t, e) => t << e | t >>> 32 - e;
function ef(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ai = new Uint32Array(16);
let am = class extends el {
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
      Ai[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = im[h], I = om[h], k = rl[h], M = sl[h], b = rm[h], L = sm[h];
      for (let $ = 0; $ < 16; $++) {
        const H = Ei(r + ef(h, i, a, l) + Ai[k[$]] + w, b[$]) + u | 0;
        r = u, u = l, l = Ei(a, 10) | 0, a = i, i = H;
      }
      for (let $ = 0; $ < 16; $++) {
        const H = Ei(s + ef(y, o, c, f) + Ai[M[$]] + I, L[$]) + g | 0;
        s = g, g = f, f = Ei(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ai.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const cm = Cr(() => new am()), $i = BigInt(2 ** 32 - 1), Qa = BigInt(32);
function u0(t, e = !1) {
  return e ? { h: Number(t & $i), l: Number(t >> Qa & $i) } : { h: Number(t >> Qa & $i) | 0, l: Number(t & $i) | 0 };
}
function lm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = u0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const um = (t, e) => BigInt(t >>> 0) << Qa | BigInt(e >>> 0), fm = (t, e, n) => t >>> n, hm = (t, e, n) => t << 32 - n | e >>> n, dm = (t, e, n) => t >>> n | e << 32 - n, pm = (t, e, n) => t << 32 - n | e >>> n, gm = (t, e, n) => t << 64 - n | e >>> n - 32, ym = (t, e, n) => t >>> n - 32 | e << 64 - n, wm = (t, e) => e, bm = (t, e) => t, xm = (t, e, n) => t << n | e >>> 32 - n, mm = (t, e, n) => e << n | t >>> 32 - n, Sm = (t, e, n) => e << n - 32 | t >>> 64 - n, Em = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Am(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $m = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Im = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Lm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Cm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Bm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
  fromBig: u0,
  split: lm,
  toBig: um,
  shrSH: fm,
  shrSL: hm,
  rotrSH: dm,
  rotrSL: pm,
  rotrBH: gm,
  rotrBL: ym,
  rotr32H: wm,
  rotr32L: bm,
  rotlSH: xm,
  rotlSL: mm,
  rotlBH: Sm,
  rotlBL: Em,
  add: Am,
  add3L: $m,
  add3H: Im,
  add4L: vm,
  add4H: Lm,
  add5H: Bm,
  add5L: Cm
}, [km, Mm] = et.split([
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
let Ho = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      An[b] = e.getUint32(n), $n[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = An[b - 15] | 0, $ = $n[b - 15] | 0, H = et.rotrSH(L, $, 1) ^ et.rotrSH(L, $, 8) ^ et.shrSH(L, $, 7), R = et.rotrSL(L, $, 1) ^ et.rotrSL(L, $, 8) ^ et.shrSL(L, $, 7), P = An[b - 2] | 0, O = $n[b - 2] | 0, x = et.rotrSH(P, O, 19) ^ et.rotrBH(P, O, 61) ^ et.shrSH(P, O, 6), v = et.rotrSL(P, O, 19) ^ et.rotrBL(P, O, 61) ^ et.shrSL(P, O, 6), T = et.add4L(R, v, $n[b - 7], $n[b - 16]), z = et.add4H(T, H, x, An[b - 7], An[b - 16]);
      An[b] = z | 0, $n[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = et.rotrSH(u, g, 14) ^ et.rotrSH(u, g, 18) ^ et.rotrBH(u, g, 41), $ = et.rotrSL(u, g, 14) ^ et.rotrSL(u, g, 18) ^ et.rotrBL(u, g, 41), H = u & h ^ ~u & w, R = g & y ^ ~g & I, P = et.add5L(M, $, R, Mm[b], $n[b]), O = et.add5H(P, k, L, H, km[b], An[b]), x = P | 0, v = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), T = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, p = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = g | 0, { h: u, l: g } = et.add(l | 0, f | 0, O | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const A = et.add3L(x, T, p);
      r = et.add3H(A, O, v, z), s = A | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = et.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = et.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: y } = et.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = et.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = et.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, y, w, I, k, M);
  }
  roundClean() {
    An.fill(0), $n.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _m = class extends Ho {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Tm = class extends Ho {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Um = class extends Ho {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Cr(() => new Ho());
Cr(() => new _m());
const Hm = Cr(() => new Tm());
Cr(() => new Um());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var Pt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Pt || (Pt = {}));
function il(t) {
  return Pt[t];
}
const Nm = () => ({ type: ct.BoolTrue }), Pm = () => ({ type: ct.BoolFalse }), Om = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ct.Buffer, value: q(t) };
}, nf = BigInt("0xffffffffffffffffffffffffffffffff"), Dm = BigInt(0), rf = BigInt("0x7fffffffffffffffffffffffffffffff"), sf = BigInt("-170141183460469231731687303715884105728"), jm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ka(ht(t))), ne(t, Uint8Array) && (t = ka(t));
  const e = Gt(t);
  if (e > rf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${rf}`);
  if (e < sf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${sf}`);
  return { type: ct.Int, value: e };
}, Fm = (t) => {
  const e = Gt(t);
  if (e < Dm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > nf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${nf}`);
  return { type: ct.UInt, value: e };
};
function zm(t) {
  return { type: ct.List, value: t };
}
function f0() {
  return { type: ct.OptionalNone };
}
function h0(t) {
  return { type: ct.OptionalSome, value: t };
}
var D;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(D || (D = {}));
function Rm() {
  return {
    type: D.Address,
    version: wr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function of(t) {
  if (t && S0(t, so))
    throw new Error(`Memo exceeds maximum length of ${so} bytes`);
  return { type: D.MemoString, content: t };
}
function ol(t, e) {
  return {
    type: D.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ja(t) {
  if (ht(t).byteLength != To)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function Gm(t, e, n) {
  return typeof t == "string" && (t = oS(t)), typeof n == "string" && (n = of(n)), {
    type: D.Payload,
    payloadType: pt.TokenTransfer,
    recipient: t,
    amount: Gt(e),
    memo: n ?? of("")
  };
}
function Vm(t, e, n, r) {
  return typeof e == "string" && (e = Ce(e)), typeof n == "string" && (n = Ce(n)), {
    type: D.Payload,
    payloadType: pt.ContractCall,
    contractAddress: typeof t == "string" ? zn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Km(t) {
  return Ce(t, 4, 1e5);
}
function af(t, e, n) {
  return typeof t == "string" && (t = Ce(t)), typeof e == "string" && (e = Km(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: pt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: pt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function qm() {
  return { type: D.Payload, payloadType: pt.PoisonMicroblock };
}
function cf(t, e) {
  if (t.byteLength != rr)
    throw Error(`Coinbase buffer size must be ${rr} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: pt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: pt.Coinbase,
    coinbaseBytes: t
  };
}
function Wm(t, e, n) {
  if (t.byteLength != rr)
    throw Error(`Coinbase buffer size must be ${rr} bytes`);
  if (n.byteLength != Ka)
    throw Error(`VRF proof buffer size must be ${Ka} bytes`);
  return {
    type: D.Payload,
    payloadType: pt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ct.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Ym(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
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
function Ce(t, e, n) {
  const r = e || 1, s = n || _x;
  if (S0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: D.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Xm(t, e, n) {
  return {
    type: D.Asset,
    address: zn(t),
    contractName: Ce(e),
    assetName: Ce(n)
  };
}
function zn(t) {
  const e = Lr.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Zm(t, e) {
  const n = zn(t), r = Ce(e);
  return {
    type: D.Principal,
    prefix: Wt.Contract,
    address: n,
    contractName: r
  };
}
function Qm(t) {
  const e = zn(t);
  return {
    type: D.Principal,
    prefix: Wt.Standard,
    address: e
  };
}
function Vr(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function Qe(t) {
  switch (t.type) {
    case D.Address:
      return ei(t);
    case D.Principal:
      return d0(t);
    case D.LengthPrefixedString:
      return as(t);
    case D.MemoString:
      return tS(t);
    case D.Asset:
      return g0(t);
    case D.PostCondition:
      return w0(t);
    case D.PublicKey:
      return nc(t);
    case D.LengthPrefixedList:
      return al(t);
    case D.Payload:
      return b0(t);
    case D.TransactionAuthField:
      return iS(t);
    case D.MessageSignature:
      return cl(t);
  }
}
function ei(t) {
  const e = [];
  return e.push(ht(Ys(t.version, 1))), e.push(ht(t.hash160)), Ut(e);
}
function os(t) {
  const e = ne(t, St) ? t : new St(t), n = mo(q(e.readBytes(1))), r = q(e.readBytes(20));
  return { type: D.Address, version: n, hash160: r };
}
function d0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Wt.Standard || t.prefix === Wt.Contract) && e.push(ei(t.address)), t.prefix === Wt.Contract && e.push(as(t.contractName)), Ut(e);
}
function Jm(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(Wt, (i) => {
    throw new Kt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Wt.Origin)
    return { type: D.Principal, prefix: n };
  const r = os(e);
  if (n === Wt.Standard)
    return { type: D.Principal, prefix: n, address: r };
  const s = we(e);
  return {
    type: D.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function as(t) {
  const e = [], n = Ar(t.content), r = n.byteLength;
  return e.push(ht(Ys(r, t.lengthPrefixBytes))), e.push(n), Ut(e);
}
function we(t, e, n) {
  e = e || 1;
  const r = ne(t, St) ? t : new St(t), s = mo(q(r.readBytes(e))), i = Xs(r.readBytes(s));
  return Ce(i, e, n ?? 128);
}
function tS(t) {
  const e = [], n = Ar(t.content), r = CS(q(n), so * 2);
  return e.push(ht(r)), Ut(e);
}
function p0(t) {
  const e = ne(t, St) ? t : new St(t);
  let n = Xs(e.readBytes(so));
  return n = n.replace(/\u0000*$/, ""), { type: D.MemoString, content: n };
}
function g0(t) {
  const e = [];
  return e.push(ei(t.address)), e.push(as(t.contractName)), e.push(as(t.assetName)), Ut(e);
}
function tc(t) {
  const e = ne(t, St) ? t : new St(t);
  return {
    type: D.Asset,
    address: os(e),
    contractName: we(e),
    assetName: we(e)
  };
}
function al(t) {
  const e = t.values, n = [];
  n.push(ht(Ys(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Qe(r));
  return Ut(n);
}
function y0(t, e, n) {
  const r = ne(t, St) ? t : new St(t), s = mo(q(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case D.Address:
        i.push(os(r));
        break;
      case D.LengthPrefixedString:
        i.push(we(r));
        break;
      case D.MemoString:
        i.push(p0(r));
        break;
      case D.Asset:
        i.push(tc(r));
        break;
      case D.PostCondition:
        i.push(nS(r));
        break;
      case D.PublicKey:
        i.push(rc(r));
        break;
      case D.TransactionAuthField:
        i.push(sS(r));
        break;
    }
  return ol(i, n);
}
function eS(t) {
  return q(w0(t));
}
function w0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d0(t.principal)), (t.conditionType === $t.Fungible || t.conditionType === $t.NonFungible) && e.push(g0(t.asset)), t.conditionType === $t.NonFungible && e.push(je(t.assetName)), e.push(t.conditionCode), t.conditionType === $t.STX || t.conditionType === $t.Fungible || t.conditionType === $t.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Gr("The post-condition amount may not be larger than 8 bytes");
    e.push(jn(t.amount, 8));
  }
  return Ut(e);
}
function nS(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum($t, (a) => {
    throw new Kt(`Could not read ${a} as PostConditionType`);
  }), r = Jm(e);
  let s, i, o;
  switch (n) {
    case $t.STX:
      return s = e.readUInt8Enum(_s, (c) => {
        throw new Kt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${q(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: $t.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case $t.Fungible:
      return i = tc(e), s = e.readUInt8Enum(_s, (c) => {
        throw new Kt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${q(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: $t.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case $t.NonFungible:
      i = tc(e);
      const a = Oe(e);
      return s = e.readUInt8Enum(Wa, (c) => {
        throw new Kt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: $t.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case $t.Staking:
      return s = e.readUInt8Enum(_s, (c) => {
        throw new Kt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${q(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: $t.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case $t.PoX: {
      const c = e.readUInt8Enum(Ya, (l) => {
        throw new Kt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: D.PostCondition,
        conditionType: $t.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function b0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case pt.TokenTransfer:
      e.push(je(t.recipient)), e.push(jn(t.amount, 8)), e.push(Qe(t.memo));
      break;
    case pt.ContractCall:
      e.push(Qe(t.contractAddress)), e.push(Qe(t.contractName)), e.push(Qe(t.functionName));
      const n = new Uint8Array(4);
      ar(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(je(r));
      });
      break;
    case pt.SmartContract:
      e.push(Qe(t.contractName)), e.push(Qe(t.codeBody));
      break;
    case pt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Qe(t.contractName)), e.push(Qe(t.codeBody));
      break;
    case pt.PoisonMicroblock:
      break;
    case pt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case pt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(je(t.recipient));
      break;
    case pt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(je(t.recipient ? h0(t.recipient) : f0())), e.push(t.vrfProof);
      break;
    case pt.TenureChange:
      e.push(ht(t.tenureHash)), e.push(ht(t.previousTenureHash)), e.push(ht(t.burnViewHash)), e.push(ht(t.previousTenureEnd)), e.push(ar(new Uint8Array(4), t.previousTenureBlocks)), e.push(Zy(new Uint8Array(1), t.cause)), e.push(ht(t.publicKeyHash));
      break;
  }
  return Ut(e);
}
function rS(t) {
  const e = ne(t, St) ? t : new St(t);
  switch (e.readUInt8Enum(pt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case pt.TokenTransfer:
      const r = Oe(e), s = Gt(e.readBytes(8)), i = p0(e);
      return Gm(r, s, i);
    case pt.ContractCall:
      const o = os(e), a = we(e), c = we(e), l = [], f = e.readUInt32BE();
      for (let L = 0; L < f; L++) {
        const $ = Oe(e);
        l.push($);
      }
      return Vm(o, a, c, l);
    case pt.SmartContract:
      const u = we(e), g = we(e, 4, 1e5);
      return af(u, g);
    case pt.VersionedSmartContract: {
      const L = e.readUInt8Enum(qa, (R) => {
        throw new Error(`Cannot recognize ClarityVersion: ${R}`);
      }), $ = we(e), H = we(e, 4, Rx);
      return af($, H, L);
    }
    case pt.PoisonMicroblock:
      return qm();
    case pt.Coinbase: {
      const L = e.readBytes(rr);
      return cf(L);
    }
    case pt.CoinbaseToAltRecipient: {
      const L = e.readBytes(rr), $ = Oe(e);
      return cf(L, $);
    }
    case pt.NakamotoCoinbase: {
      const L = e.readBytes(rr), $ = Oe(e), H = e.readBytes(Ka);
      return Wm(L, $, H);
    }
    case pt.TenureChange:
      const h = q(e.readBytes(20)), y = q(e.readBytes(20)), w = q(e.readBytes(20)), I = q(e.readBytes(32)), k = e.readUInt32BE(), M = e.readUInt8Enum(Xa, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), b = q(e.readBytes(20));
      return Ym(h, y, w, I, k, M, b);
  }
}
function ec(t) {
  const e = ne(t, St) ? t : new St(t);
  return Ja(q(e.readBytes(To)));
}
function sS(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(Ie, (r) => {
    throw new Kt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ie.PublicKeyCompressed:
      return Vr(Ct.Compressed, rc(e));
    case Ie.PublicKeyUncompressed:
      return Vr(Ct.Uncompressed, ys(DS(rc(e).data)));
    case Ie.SignatureCompressed:
      return Vr(Ct.Compressed, ec(e));
    case Ie.SignatureUncompressed:
      return Vr(Ct.Uncompressed, ec(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function cl(t) {
  return ht(t.data);
}
function iS(t) {
  const e = [];
  switch (t.contents.type) {
    case D.PublicKey:
      e.push(t.pubKeyEncoding === Ct.Compressed ? Ie.PublicKeyCompressed : Ie.PublicKeyUncompressed), e.push(ht(OS(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === Ct.Compressed ? Ie.SignatureCompressed : Ie.SignatureUncompressed), e.push(cl(t.contents));
      break;
  }
  return Ut(e);
}
function nc(t) {
  return t.data.slice();
}
function rc(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8(), r = n === 4 ? Hx : Ux;
  return ys(Ut([n, e.readBytes(r)]));
}
function ll(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === wt.P2PKH || e === wt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === wt.P2WPKH || e === wt.P2WSH || e === wt.P2WSHNonSequential) && !r.map((s) => s.data).every(ws))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case wt.P2PKH:
      return Ii(t, BS(r[0].data));
    case wt.P2WPKH:
      return Ii(t, kS(r[0].data));
    case wt.P2SH:
    case wt.P2SHNonSequential:
      return Ii(t, MS(n, r.map(nc)));
    case wt.P2WSH:
    case wt.P2WSHNonSequential:
      return Ii(t, _S(n, r.map(nc)));
  }
}
function Ii(t, e) {
  return { type: D.Address, version: t, hash160: e };
}
function ul(t) {
  return Lr.c32address(t.version, t.hash160);
}
function lf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return Xm(e, n, r);
}
function vs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Zm(e, n);
  } else
    return Qm(t);
}
function oS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return lS(e, n);
  } else
    return aS(t);
}
function aS(t) {
  const e = zn(t);
  return { type: ct.PrincipalStandard, value: ul(e) };
}
function cS(t) {
  return { type: ct.PrincipalStandard, value: ul(t) };
}
function lS(t, e) {
  const n = zn(t), r = Ce(e);
  return x0(n, r);
}
function x0(t, e) {
  if (Ar(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ct.PrincipalContract,
    value: `${ul(t)}.${e.content}`
  };
}
function uS(t) {
  return { type: ct.ResponseErr, value: t };
}
function fS(t) {
  return { type: ct.ResponseOk, value: t };
}
const hS = (t) => ({ type: ct.StringASCII, value: t }), dS = (t) => ({ type: ct.StringUTF8, value: t });
function pS(t) {
  for (const e in t)
    if (!TS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: ct.Tuple, value: t };
}
function Oe(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new St(ht(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new St(t) : e = t;
  switch (e.readUInt8Enum(Pt, (r) => {
    throw new Kt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Pt.int:
      return jm(ka(e.readBytes(16)));
    case Pt.uint:
      return Fm(e.readBytes(16));
    case Pt.buffer:
      const r = e.readUInt32BE();
      return Om(e.readBytes(r));
    case Pt.true:
      return Nm();
    case Pt.false:
      return Pm();
    case Pt.address:
      const s = os(e);
      return cS(s);
    case Pt.contract:
      const i = os(e), o = we(e);
      return x0(i, o);
    case Pt.ok:
      return fS(Oe(e));
    case Pt.err:
      return uS(Oe(e));
    case Pt.none:
      return f0();
    case Pt.some:
      return h0(Oe(e));
    case Pt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Oe(e));
      return zm(c);
    case Pt.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let w = 0; w < l; w++) {
        const I = we(e).content;
        if (I === void 0)
          throw new Kt('"content" is undefined');
        f[I] = Oe(e);
      }
      return pS(f);
    case Pt.ascii:
      const u = e.readUInt32BE(), g = Ry(e.readBytes(u));
      return hS(g);
    case Pt.utf8:
      const h = e.readUInt32BE(), y = Xs(e.readBytes(h));
      return dS(y);
    default:
      throw new Kt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ge(t, e) {
  return Ut([il(t), e]);
}
function gS(t) {
  return new Uint8Array([il(t.type)]);
}
function yS(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([il(t.type)]) : Ge(t.type, je(t.value));
}
function wS(t) {
  const e = new Uint8Array(4);
  return ar(e, Math.ceil(t.value.length / 2), 0), Ge(t.type, ze(e, ht(t.value)));
}
function bS(t) {
  const e = Uc(Oy(BigInt(t.value), BigInt(Tx)), n0);
  return Ge(t.type, e);
}
function xS(t) {
  const e = Uc(BigInt(t.value), n0);
  return Ge(t.type, e);
}
function mS(t) {
  return Ge(t.type, ei(zn(t.value)));
}
function SS(t) {
  const [e, n] = US(t.value);
  return Ge(t.type, ze(ei(zn(e)), as(Ce(n))));
}
function ES(t) {
  return Ge(t.type, je(t.value));
}
function AS(t) {
  const e = [], n = new Uint8Array(4);
  ar(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = je(r);
    e.push(s);
  }
  return Ge(t.type, Ut(e));
}
function $S(t) {
  const e = [], n = new Uint8Array(4);
  ar(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ce(s);
    e.push(as(i));
    const o = je(t.value[s]);
    e.push(o);
  }
  return Ge(t.type, Ut(e));
}
function m0(t, e) {
  const n = [], r = e == "ascii" ? zy(t.value) : Ar(t.value), s = new Uint8Array(4);
  return ar(s, r.length, 0), n.push(s), n.push(r), Ge(t.type, Ut(n));
}
function IS(t) {
  return m0(t, "ascii");
}
function vS(t) {
  return m0(t, "utf8");
}
function uf(t) {
  return q(je(t));
}
function je(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return gS(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return yS(t);
    case ct.Buffer:
      return wS(t);
    case ct.UInt:
      return xS(t);
    case ct.Int:
      return bS(t);
    case ct.PrincipalStandard:
      return mS(t);
    case ct.PrincipalContract:
      return SS(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return ES(t);
    case ct.List:
      return AS(t);
    case ct.Tuple:
      return $S(t);
    case ct.StringASCII:
      return IS(t);
    case ct.StringUTF8:
      return vS(t);
    default:
      throw new Gr("Unable to serialize. Invalid Clarity Value.");
  }
}
const LS = (t) => t.length % 2 ? `0${t}` : t, CS = (t, e) => t.padEnd(e, "0"), S0 = (t, e) => t ? Ar(t).length > e : !1;
function sc(t) {
  return Qd(t);
}
const Ds = (t) => cm(nl(t)), fl = (t) => q(Hm(t)), BS = (t) => q(Ds(t)), kS = (t) => {
  const e = Ds(t), n = ze(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ds(n);
  return q(r);
}, MS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = Ds(r);
  return q(s);
}, _S = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = nl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ut(i), a = Ds(o);
  return q(a);
};
function TS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function US(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
_t.hmacSha256Sync = (t, ...e) => {
  const n = o0.create(nl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ys(t) {
  return t = typeof t == "string" ? ht(t) : t, {
    type: D.PublicKey,
    data: t
  };
}
function HS(t, e, n = Ct.Compressed) {
  const r = qy(e), s = new le(lu(r.r), lu(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === Ct.Compressed;
  return i.toHex(o);
}
function NS(t) {
  return typeof t == "string" ? t : q(t);
}
const hl = NS;
function E0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Ky;
}
function ws(t) {
  return !hl(t).startsWith("04");
}
function PS(t) {
  t = Hc(t);
  const e = E0(t);
  return q(Zs(t.slice(0, 32), e));
}
function OS(t) {
  return it.fromHex(hl(t)).toHex(!0);
}
function DS(t) {
  return it.fromHex(hl(t)).toHex(!1);
}
function jS(t, e) {
  t = Hc(t);
  const [n, r] = Eo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ys(r, 1) + le.fromHex(n).toCompactHex();
}
function dl() {
  return {
    type: D.MessageSignature,
    data: q(new Uint8Array(To))
  };
}
function A0(t, e, n, r) {
  const s = ll(0, t, 1, [ys(e)]).hash160, i = ws(e) ? Ct.Compressed : Ct.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Gt(n),
    fee: Gt(r),
    keyEncoding: i,
    signature: dl()
  };
}
function js(t) {
  return "signature" in t;
}
function ff(t) {
  return t === wt.P2SH || t === wt.P2WSH;
}
function FS(t) {
  return t === wt.P2SHNonSequential || t === wt.P2WSHNonSequential;
}
function hf(t) {
  const e = sc(t);
  return e.nonce = 0, e.fee = 0, js(e) ? e.signature = dl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function zS(t) {
  const e = [
    t.hashMode,
    ht(t.signer),
    jn(t.nonce, 8),
    jn(t.fee, 8),
    t.keyEncoding,
    cl(t.signature)
  ];
  return Ut(e);
}
function RS(t) {
  const e = [
    t.hashMode,
    ht(t.signer),
    jn(t.nonce, 8),
    jn(t.fee, 8)
  ], n = ol(t.fields);
  e.push(al(n));
  const r = new Uint8Array(2);
  return Yy(r, t.signaturesRequired, 0), e.push(r), Ut(e);
}
function GS(t, e) {
  const n = q(e.readBytes(20)), r = BigInt(`0x${q(e.readBytes(8))}`), s = BigInt(`0x${q(e.readBytes(8))}`), i = e.readUInt8Enum(Ct, (a) => {
    throw new Kt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === wt.P2WPKH && i != Ct.Compressed)
    throw new Kt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ec(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function VS(t, e) {
  const n = q(e.readBytes(20)), r = BigInt("0x" + q(e.readBytes(8))), s = BigInt("0x" + q(e.readBytes(8))), i = y0(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case D.PublicKey:
        ws(l.contents.data) || (o = !0);
        break;
      case D.MessageSignature:
        if (l.pubKeyEncoding === Ct.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Jn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === wt.P2WSH || t === wt.P2WSHNonSequential))
    throw new Jn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function da(t) {
  return js(t) ? zS(t) : RS(t);
}
function pa(t) {
  const e = t.readUInt8Enum(wt, (n) => {
    throw new Kt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === wt.P2PKH || e === wt.P2WPKH ? GS(e, t) : VS(e, t);
}
function $0(t, e, n, r) {
  const i = t + q(new Uint8Array([e])) + q(jn(n, 8)) + q(jn(r, 8));
  if (ht(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return fl(ht(i));
}
function I0(t, e, n) {
  const r = 33 + To, s = ws(e.data) ? Ct.Compressed : Ct.Uncompressed, i = t + LS(s.toString(16)) + n, o = ht(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return fl(o);
}
function KS(t, e, n, r, s) {
  const i = $0(t, e, n, r), o = jS(s, i), a = ys(PS(s)), c = I0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function v0(t, e, n, r, s, i) {
  const o = $0(t, e, n, r), a = ys(HS(o, i, s)), c = I0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function qS() {
  const t = A0(wt.P2PKH, "", 0, 0);
  return t.signer = Rm().hash160, t.keyEncoding = Ct.Compressed, t.signature = dl(), t;
}
function df(t, e, n) {
  return js(t) ? WS(t, e, n) : YS(t, e, n);
}
function WS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = v0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = ll(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Jn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function YS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        ws(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === Ct.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = v0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ff(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new Jn("Too many signatures");
        break;
    }
  if (ff(t.hashMode) && o !== t.signaturesRequired || FS(t.hashMode) && o < t.signaturesRequired)
    throw new Jn("Incorrect number of signatures");
  if (i && (t.hashMode === wt.P2WSH || t.hashMode === wt.P2WSHNonSequential))
    throw new Jn("Uncompressed keys are not allowed in this hash mode");
  const a = ll(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Jn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function L0(t) {
  return {
    authType: kt.Standard,
    spendingCondition: t
  };
}
function C0(t, e) {
  return {
    authType: kt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || A0(wt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function pf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case kt.Standard:
        return L0(hf(t.spendingCondition));
      case kt.Sponsored:
        return C0(hf(t.spendingCondition), qS());
      default:
        throw new oo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function XS(t, e) {
  switch (t.authType) {
    case kt.Standard:
      return df(t.spendingCondition, e, kt.Standard);
    case kt.Sponsored:
      return df(t.spendingCondition, e, kt.Standard);
    default:
      throw new oo("Invalid origin auth type");
  }
}
function ZS(t, e) {
  switch (t.authType) {
    case kt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Gt(e)
      };
      return { ...t, spendingCondition: n };
    case kt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Gt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function QS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Gt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function JS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Gt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function t3(t, e) {
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
function e3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case kt.Standard:
      e.push(da(t.spendingCondition));
      break;
    case kt.Sponsored:
      e.push(da(t.spendingCondition)), e.push(da(t.sponsorSpendingCondition));
      break;
  }
  return Ut(e);
}
function n3(t) {
  const e = t.readUInt8Enum(kt, (r) => {
    throw new Kt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case kt.Standard:
      return n = pa(t), L0(n);
    case kt.Sponsored:
      n = pa(t);
      const r = pa(t);
      return C0(n, r);
  }
}
class r3 {
  constructor({ auth: e, payload: n, postConditions: r = ol([]), postConditionMode: s = io.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = kx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Gt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = ie.Any;
  }
  signBegin() {
    const e = sc(this);
    return e.auth = pf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = sc(this);
    return e.auth = pf(e.auth), e.txid();
  }
  verifyOrigin() {
    return XS(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : ys(e), r = this.auth.spendingCondition;
    if (r && !js(r)) {
      const s = ws(n.data);
      r.fields.push(Vr(s ? Ct.Compressed : Ct.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = KS(n, r, e.fee, e.nonce, s);
    if (js(e))
      e.signature = Ja(i);
    else {
      const a = E0(s);
      e.fields.push(Vr(a ? Ct.Compressed : Ct.Uncompressed, Ja(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return fl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != kt.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t3(this.auth, e);
  }
  setFee(e) {
    this.auth = ZS(this.auth, e);
  }
  setNonce(e) {
    this.auth = QS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != kt.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = JS(this.auth, e);
  }
  serialize() {
    return q(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Gr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Gr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Gr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Gr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return ar(n, this.chainId, 0), e.push(n), e.push(e3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(al(this.postConditions)), e.push(b0(this.payload)), Ut(e);
  }
}
function s3(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(yr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = n3(e), i = e.readUInt8Enum(ie, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(io, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = y0(e, D.PostCondition), c = rS(e), l = new r3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const gf = BigInt("18446744073709551615");
function ga(t) {
  const e = Gt(t);
  if (e < 0n || e > gf)
    throw new RangeError(`Post-condition amount must be between 0 and ${gf} (u64 max), received: ${e}`);
  return e;
}
var ic;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(ic || (ic = {}));
var oc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(oc || (oc = {}));
function i3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: D.PostCondition,
        conditionType: $t.STX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Wt.Origin } : vs(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount)
      };
    case "ft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: $t.Fungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Wt.Origin } : vs(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount),
        asset: lf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: $t.NonFungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Wt.Origin } : vs(t.address),
        conditionCode: vi(t.condition),
        asset: lf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: D.PostCondition,
        conditionType: $t.Staking,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Wt.Origin } : vs(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount)
      };
    case "pox-postcondition":
      return {
        type: D.PostCondition,
        conditionType: $t.PoX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: Wt.Origin } : vs(t.address),
        conditionCode: o3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function vi(t) {
  return ic[t];
}
function o3(t) {
  return oc[t];
}
function B0(t) {
  const e = i3(t);
  return eS(e);
}
function a3(t, e, n) {
  return gl(k0(t), n);
}
function k0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Fs(r);
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
    return BigInt(`0x${u3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function pl(t, e = 8) {
  return (typeof t == "bigint" ? t : k0(t)).toString(16).padStart(e * 2, "0");
}
function gl(t, e = 16) {
  const n = pl(t, e);
  return Fs(n);
}
function c3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const l3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function u3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += l3[n];
  return e;
}
function Fs(t) {
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
function yl(t) {
  return new TextEncoder().encode(t);
}
function f3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function h3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function yf(t) {
  if (t.some(h3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function wl(...t) {
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
function an(t) {
  return wl(...t.map((e) => typeof e == "number" ? yf([e]) : e instanceof Array ? yf(e) : e));
}
function No(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ac;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ac || (ac = {}));
ac.Mainnet;
const d3 = 128, p3 = 128, M0 = 16;
var cc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(cc || (cc = {}));
var wf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(wf || (wf = {}));
var bf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bf || (bf = {}));
var $e;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})($e || ($e = {}));
const ya = ["onChainOnly", "offChainOnly", "any"];
ya[0] + "", $e.OnChainOnly, ya[1] + "", $e.OffChainOnly, ya[2] + "", $e.Any, $e.OnChainOnly + "", $e.OnChainOnly, $e.OffChainOnly + "", $e.OffChainOnly, $e.Any + "", $e.Any;
var lc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lc || (lc = {}));
lc.Mainnet;
var xf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xf || (xf = {}));
var Yn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yn || (Yn = {}));
var mf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mf || (mf = {}));
var Sf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Sf || (Sf = {}));
var Ef;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ef || (Ef = {}));
var Af;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Af || (Af = {}));
var $f;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($f || ($f = {}));
var If;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(If || (If = {}));
var uc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(uc || (uc = {}));
var vf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vf || (vf = {}));
var Lf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Lf || (Lf = {}));
function fc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function g3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function y3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fc(t.outputLen), fc(t.blockLen);
}
function w3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function b3(t, e) {
  _0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const wa = {
  number: fc,
  bool: g3,
  bytes: _0,
  hash: y3,
  exists: w3,
  output: b3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ba = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), He = (t, e) => t << 32 - e | t >>> e, x3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!x3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function m3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function T0(t) {
  if (typeof t == "string" && (t = m3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let S3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Br(t) {
  const e = (r) => t().update(T0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function E3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let bl = class extends S3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ba(this.buffer);
  }
  update(e) {
    wa.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = T0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ba(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    wa.exists(this), wa.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    E3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ba(e), c = this.outputLen;
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
const A3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), U0 = Uint8Array.from({ length: 16 }, (t, e) => e), $3 = U0.map((t) => (9 * t + 5) % 16);
let xl = [U0], ml = [$3];
for (let t = 0; t < 4; t++)
  for (let e of [xl, ml])
    e.push(e[t].map((n) => A3[n]));
const H0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), I3 = xl.map((t, e) => t.map((n) => H0[e][n])), v3 = ml.map((t, e) => t.map((n) => H0[e][n])), L3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), C3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Li = (t, e) => t << e | t >>> 32 - e;
function Cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ci = new Uint32Array(16);
let B3 = class extends bl {
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
      Ci[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = L3[h], I = C3[h], k = xl[h], M = ml[h], b = I3[h], L = v3[h];
      for (let $ = 0; $ < 16; $++) {
        const H = Li(r + Cf(h, i, a, l) + Ci[k[$]] + w, b[$]) + u | 0;
        r = u, u = l, l = Li(a, 10) | 0, a = i, i = H;
      }
      for (let $ = 0; $ < 16; $++) {
        const H = Li(s + Cf(y, o, c, f) + Ci[M[$]] + I, L[$]) + g | 0;
        s = g, g = f, f = Li(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ci.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Br(() => new B3());
const k3 = (t, e, n) => t & e ^ ~t & n, M3 = (t, e, n) => t & e ^ t & n ^ e & n, _3 = new Uint32Array([
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
let N0 = class extends bl {
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
      const g = vn[u - 15], h = vn[u - 2], y = He(g, 7) ^ He(g, 18) ^ g >>> 3, w = He(h, 17) ^ He(h, 19) ^ h >>> 10;
      vn[u] = w + vn[u - 7] + y + vn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = He(a, 6) ^ He(a, 11) ^ He(a, 25), h = f + g + k3(a, c, l) + _3[u] + vn[u] | 0, w = (He(r, 2) ^ He(r, 13) ^ He(r, 22)) + M3(r, s, i) | 0;
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
}, T3 = class extends N0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Br(() => new N0());
Br(() => new T3());
const Bi = BigInt(2 ** 32 - 1), hc = BigInt(32);
function P0(t, e = !1) {
  return e ? { h: Number(t & Bi), l: Number(t >> hc & Bi) } : { h: Number(t >> hc & Bi) | 0, l: Number(t & Bi) | 0 };
}
function U3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = P0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const H3 = (t, e) => BigInt(t >>> 0) << hc | BigInt(e >>> 0), N3 = (t, e, n) => t >>> n, P3 = (t, e, n) => t << 32 - n | e >>> n, O3 = (t, e, n) => t >>> n | e << 32 - n, D3 = (t, e, n) => t << 32 - n | e >>> n, j3 = (t, e, n) => t << 64 - n | e >>> n - 32, F3 = (t, e, n) => t >>> n - 32 | e << 64 - n, z3 = (t, e) => e, R3 = (t, e) => t, G3 = (t, e, n) => t << n | e >>> 32 - n, V3 = (t, e, n) => e << n | t >>> 32 - n, K3 = (t, e, n) => e << n - 32 | t >>> 64 - n, q3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function W3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Y3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), X3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Z3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Q3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, J3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), t4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
  fromBig: P0,
  split: U3,
  toBig: H3,
  shrSH: N3,
  shrSL: P3,
  rotrSH: O3,
  rotrSL: D3,
  rotrBH: j3,
  rotrBL: F3,
  rotr32H: z3,
  rotr32L: R3,
  rotlSH: G3,
  rotlSL: V3,
  rotlBH: K3,
  rotlBL: q3,
  add: W3,
  add3L: Y3,
  add3H: X3,
  add4L: Z3,
  add4H: Q3,
  add5H: t4,
  add5L: J3
}, [e4, n4] = nt.split([
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
let Po = class extends bl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Ln[b] = e.getUint32(n), Cn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Ln[b - 15] | 0, $ = Cn[b - 15] | 0, H = nt.rotrSH(L, $, 1) ^ nt.rotrSH(L, $, 8) ^ nt.shrSH(L, $, 7), R = nt.rotrSL(L, $, 1) ^ nt.rotrSL(L, $, 8) ^ nt.shrSL(L, $, 7), P = Ln[b - 2] | 0, O = Cn[b - 2] | 0, x = nt.rotrSH(P, O, 19) ^ nt.rotrBH(P, O, 61) ^ nt.shrSH(P, O, 6), v = nt.rotrSL(P, O, 19) ^ nt.rotrBL(P, O, 61) ^ nt.shrSL(P, O, 6), T = nt.add4L(R, v, Cn[b - 7], Cn[b - 16]), z = nt.add4H(T, H, x, Ln[b - 7], Ln[b - 16]);
      Ln[b] = z | 0, Cn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = nt.rotrSH(u, g, 14) ^ nt.rotrSH(u, g, 18) ^ nt.rotrBH(u, g, 41), $ = nt.rotrSL(u, g, 14) ^ nt.rotrSL(u, g, 18) ^ nt.rotrBL(u, g, 41), H = u & h ^ ~u & w, R = g & y ^ ~g & I, P = nt.add5L(M, $, R, n4[b], Cn[b]), O = nt.add5H(P, k, L, H, e4[b], Ln[b]), x = P | 0, v = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), T = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, p = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = g | 0, { h: u, l: g } = nt.add(l | 0, f | 0, O | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const A = nt.add3L(x, T, p);
      r = nt.add3H(A, O, v, z), s = A | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = nt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = nt.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: y } = nt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = nt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = nt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, y, w, I, k, M);
  }
  roundClean() {
    Ln.fill(0), Cn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, r4 = class extends Po {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, s4 = class extends Po {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, i4 = class extends Po {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Br(() => new Po());
Br(() => new r4());
Br(() => new s4());
Br(() => new i4());
function o4(t, e, n) {
  const s = d3;
  if (E4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: cc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var jt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(jt || (jt = {}));
let a4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, O0 = class extends a4 {
  constructor(e) {
    super(e);
  }
};
function Oo(t) {
  const e = [];
  return e.push(Fs(pl(t.version, 1))), e.push(Fs(t.hash160)), an(e);
}
function c4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oo(t.address)), t.prefix === uc.Contract && e.push(zs(t.contractName)), an(e);
}
function zs(t) {
  const e = [], n = yl(t.content), r = n.byteLength;
  return e.push(Fs(pl(r, t.lengthPrefixBytes))), e.push(n), an(e);
}
function l4(t) {
  const e = [];
  return e.push(Oo(t.address)), e.push(zs(t.contractName)), e.push(zs(t.assetName)), an(e);
}
function D0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(c4(t.principal)), (t.conditionType === Yn.Fungible || t.conditionType === Yn.NonFungible) && e.push(l4(t.assetInfo)), t.conditionType === Yn.NonFungible && e.push(br(t.assetName)), e.push(t.conditionCode), t.conditionType === Yn.STX || t.conditionType === Yn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new O0("The post-condition amount may not be larger than 8 bytes");
    e.push(a3(t.amount, !1, 8));
  }
  return an(e);
}
function Ve(t, e) {
  return an([t, e]);
}
function u4(t) {
  return new Uint8Array([t.type]);
}
function f4(t) {
  return t.type === jt.OptionalNone ? new Uint8Array([t.type]) : Ve(t.type, br(t.value));
}
function h4(t) {
  const e = new Uint8Array(4);
  return No(e, t.buffer.length, 0), Ve(t.type, wl(e, t.buffer));
}
function d4(t) {
  const e = gl(c3(t.value, BigInt(p3)), M0);
  return Ve(t.type, e);
}
function p4(t) {
  const e = gl(t.value, M0);
  return Ve(t.type, e);
}
function g4(t) {
  return Ve(t.type, Oo(t.address));
}
function y4(t) {
  return Ve(t.type, wl(Oo(t.address), zs(t.contractName)));
}
function w4(t) {
  return Ve(t.type, br(t.value));
}
function b4(t) {
  const e = [], n = new Uint8Array(4);
  No(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = br(r);
    e.push(s);
  }
  return Ve(t.type, an(e));
}
function x4(t) {
  const e = [], n = new Uint8Array(4);
  No(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = o4(s);
    e.push(zs(i));
    const o = br(t.data[s]);
    e.push(o);
  }
  return Ve(t.type, an(e));
}
function j0(t, e) {
  const n = [], r = e == "ascii" ? f3(t.data) : yl(t.data), s = new Uint8Array(4);
  return No(s, r.length, 0), n.push(s), n.push(r), Ve(t.type, an(n));
}
function m4(t) {
  return j0(t, "ascii");
}
function S4(t) {
  return j0(t, "utf8");
}
function br(t) {
  switch (t.type) {
    case jt.BoolTrue:
    case jt.BoolFalse:
      return u4(t);
    case jt.OptionalNone:
    case jt.OptionalSome:
      return f4(t);
    case jt.Buffer:
      return h4(t);
    case jt.UInt:
      return p4(t);
    case jt.Int:
      return d4(t);
    case jt.PrincipalStandard:
      return g4(t);
    case jt.PrincipalContract:
      return y4(t);
    case jt.ResponseOk:
    case jt.ResponseErr:
      return w4(t);
    case jt.List:
      return b4(t);
    case jt.Tuple:
      return x4(t);
    case jt.StringASCII:
      return m4(t);
    case jt.StringUTF8:
      return S4(t);
    default:
      throw new O0("Unable to serialize. Invalid Clarity Value.");
  }
}
const E4 = (t, e) => t ? yl(t).length > e : !1, A4 = "connect-ui";
let zi, F0, oe = !1, dc = !1;
const on = (t, e = "") => () => {
}, $4 = (t, e) => () => {
}, I4 = "{visibility:hidden}.hydrated{visibility:inherit}", Bf = {}, v4 = "http://www.w3.org/2000/svg", L4 = "http://www.w3.org/1999/xhtml", C4 = (t) => t != null, Sl = (t) => (t = typeof t, t === "object" || t === "function");
function z0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Q = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Sl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? pc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = pc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, pc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, B4 = {}, k4 = (t) => t && t.$tag$ === B4, M4 = (t, e) => t != null && !Sl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, _4 = (t) => bs(t).$hostElement$, T4 = (t, e, n) => {
  const r = Rt.ce(e, n);
  return t.dispatchEvent(r), r;
}, kf = /* @__PURE__ */ new WeakMap(), U4 = (t, e, n) => {
  let r = ao.get(t);
  tE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ao.set(t, r);
}, H4 = (t, e, n, r) => {
  var s;
  let i = R0(e);
  const o = ao.get(i);
  if (t = t.nodeType === 11 ? t : Fe, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = kf.get(t), c;
      if (a || kf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Fe.createElement("style"), c.innerHTML = o;
          const l = (s = Rt.$nonce$) !== null && s !== void 0 ? s : z0(Fe);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, N4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = on("attachStyles", e.$tagName$), i = H4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, R0 = (t, e) => "sc-" + t.$tagName$, Mf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Tf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = _f(n), f = _f(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Tf(Do, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Rt.rel(t, e, n, !1), r && Rt.ael(t, e, r, !1);
    else {
      const c = Sl(r);
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
}, P4 = /\s/, _f = (t) => t ? t.split(P4) : [], G0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Bf, o = e.$attrs$ || Bf;
  for (r in i)
    r in o || Mf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Mf(s, r, i[r], o[r], n, e.$flags$);
}, El = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Fe.createTextNode(s.$text$);
  else {
    if (oe || (oe = s.$tag$ === "svg"), o = s.$elm$ = Fe.createElementNS(oe ? v4 : L4, s.$tag$), oe && s.$tag$ === "foreignObject" && (oe = !1), G0(null, s, oe), C4(zi) && o["s-si"] !== zi && o.classList.add(o["s-si"] = zi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = El(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? oe = !1 : o.tagName === "foreignObject" && (oe = !0);
  }
  return o;
}, V0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === F0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = El(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, K0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, O4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], g;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : ki(a, f) ? (Ls(a, f), a = e[++s], f = r[++i]) : ki(c, u) ? (Ls(c, u), c = e[--o], u = r[--l]) : ki(a, u) ? (Ls(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : ki(c, f) ? (Ls(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = El(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? V0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && K0(e, s, o);
}, ki = (t, e) => t.$tag$ === e.$tag$, Ls = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (oe = i === "svg" ? !0 : i === "foreignObject" ? !1 : oe, G0(t, e, oe), r !== null && s !== null ? O4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), V0(n, null, e, s, 0, s.length - 1)) : r !== null && K0(r, 0, r.length - 1), oe && i === "svg" && (oe = !1)) : t.$text$ !== o && (n.data = o);
}, D4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pc(null, null), s = k4(e) ? e : Q(null, null, e);
  F0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, zi = n["s-sc"], Ls(r, s);
}, q0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Al = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return q0(t, t.$ancestorComponent$), nE(() => j4(t, e));
}, j4 = (t, e) => {
  const n = on("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), G4(s, () => F4(t, r, e));
}, F4 = async (t, e, n) => {
  const r = t.$hostElement$, s = on("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && N4(t);
  const o = on("render", t.$cmpMeta$.$tagName$);
  z4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => R4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, z4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, D4(t, e);
  } catch (r) {
    Rs(r, t.$hostElement$);
  }
  return null;
}, R4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = on("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Y0(n), r(), t.$onReadyResolve$(n), s || W0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Il(() => Al(t, !1)), t.$flags$ &= -517;
}, W0 = (t) => {
  Y0(Fe.documentElement), Il(() => T4(Do, "appload", { detail: { namespace: A4 } }));
}, G4 = (t, e) => t && t.then ? t.then(e) : e(), Y0 = (t) => t.classList.add("hydrated"), V4 = (t, e) => bs(t).$instanceValues$.get(e), K4 = (t, e, n, r) => {
  const s = bs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = M4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Al(s, !1));
}, X0 = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return V4(this, i);
        },
        set(a) {
          K4(this, i, a, e);
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
}, q4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = J4(n), s.then) {
        const c = $4();
        s = await s, c();
      }
      s.isProxied || (X0(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = on("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Rs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = R0(n);
      if (!ao.has(c)) {
        const l = on("registerStyles", n.$tagName$);
        U4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Al(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, W4 = (t) => {
  if (!(Rt.$flags$ & 1)) {
    const e = bs(t), n = e.$cmpMeta$, r = on("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            q0(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), q4(t, e, n);
    }
    r();
  }
}, Y4 = (t) => {
  Rt.$flags$ & 1 || bs(t);
}, X4 = (t, e = {}) => {
  var n;
  const r = on(), s = [], i = e.exclude || [], o = Do.customElements, a = Fe.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Fe.createElement("style"), f = [];
  let u, g = !0;
  Object.assign(Rt, e), Rt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Fe.baseURI).href, t.map((h) => {
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
          super(M), M = this, Q4(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), g ? f.push(this) : Rt.jmp(() => W4(this));
        }
        disconnectedCallback() {
          Rt.jmp(() => Y4(this));
        }
        componentOnReady() {
          return bs(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, X0(
        k,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + I4, l.setAttribute("data-styles", "");
    const h = (n = Rt.$nonce$) !== null && n !== void 0 ? n : z0(Fe);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Rt.jmp(() => u = setTimeout(W0, 30)), r();
}, $l = /* @__PURE__ */ new WeakMap(), bs = (t) => $l.get(t), Z4 = (t, e) => $l.set(e.$lazyInstance$ = t, e), Q4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], $l.set(t, n);
}, Tf = (t, e) => e in t, Rs = (t, e) => (0, console.error)(t, e), xa = /* @__PURE__ */ new Map(), J4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = xa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (xa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => D5).then(o, Rs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (xa.set(s, o), o[r]), Rs);
}, ao = /* @__PURE__ */ new Map(), Do = typeof window < "u" ? window : {}, Fe = Do.document || { head: {} }, Rt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Z0 = (t) => Promise.resolve(t), tE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Uf = [], Q0 = [], eE = (t, e) => (n) => {
  t.push(n), dc || (dc = !0, Rt.$flags$ & 4 ? Il(gc) : Rt.raf(gc));
}, Hf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Rs(n);
    }
  t.length = 0;
}, gc = () => {
  Hf(Uf), Hf(Q0), (dc = Uf.length > 0) && Rt.raf(gc);
}, Il = (t) => Z0().then(t), nE = /* @__PURE__ */ eE(Q0), rE = () => Z0(), sE = (t, e) => typeof window > "u" ? Promise.resolve() : rE().then(() => X4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var iE = Object.defineProperty, oE = Object.defineProperties, aE = Object.getOwnPropertyDescriptors, co = Object.getOwnPropertySymbols, J0 = Object.prototype.hasOwnProperty, tp = Object.prototype.propertyIsEnumerable, Nf = (t, e, n) => e in t ? iE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, fe = (t, e) => {
  for (var n in e || (e = {})) J0.call(e, n) && Nf(t, n, e[n]);
  if (co) for (var n of co(e)) tp.call(e, n) && Nf(t, n, e[n]);
  return t;
}, Be = (t, e) => oE(t, aE(e)), ep = (t, e) => {
  var n = {};
  for (var r in t) J0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && co) for (var r of co(t)) e.indexOf(r) < 0 && tp.call(t, r) && (n[r] = t[r]);
  return n;
};
function np() {
  return _o(hr()) || window.StacksProvider || window.BlockstackProvider;
}
function jo(t) {
  return t ? typeof t == "string" ? pr.fromName(t) : "version" in t ? t : "url" in t ? new Ra({ url: t.url }) : t.transactionVersion === yr.Mainnet ? new Ra({ url: t.client.baseUrl }) : new Ga({ url: t.client.baseUrl }) : new Ga();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var cE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(cE || {}), lE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(lE || {}), vl = (t) => {
  let e = t;
  if (!e) {
    let n = new Hh(["store_write"], document.location.href);
    e = new za({ appConfig: n });
  }
  return e;
};
function rp(t) {
  try {
    return vl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var sp = (t) => {
  let e = vl(t).loadUserData().appPrivateKey, n = zt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function uE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [gr.Mainnet]: "mainnet", [gr.Testnet]: "testnet" }, a = jo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function fE(t) {
  let e = jo(t.network), n = vl(t.userSession), r = Be(fe({}, t), { network: e, userSession: n });
  return fe({ stxAddress: uE(r) }, r);
}
async function hE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(B0) : n = n.map((r) => q(D0(r)))), new zt.TokenSigner("ES256k", e).signAsync(Be(fe({}, t), { postConditions: n }));
}
function dE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(B0) : e = e.map((n) => q(D0(n)))), zt.createUnsecuredToken(Be(fe({}, t), { postConditions: e }));
}
var pE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = ht(a.replace(/^0x/, "")), l = s3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Be(fe({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Be(fe({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, gE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ep(e, ["amount", "appDetails", "userSession"]);
  if (rp(s)) {
    let { privateKey: a, publicKey: c } = sp(s), l = Be(fe({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), hE(l, a);
  }
  let o = Be(fe({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), dE(o);
};
async function yE(t, e, n) {
  let r = await e(Be(fe(fe({}, fE(t)), t), { network: jo(t.network) }));
  return pE({ token: r, options: t }, n);
}
function wE(t, e = np()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return yE(t, gE, e);
}
function ip(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Be(fe({}, t), { message: uf(e), domain: uf(n) }) : Be(fe({}, t), { message: q(br(e)), domain: q(br(n)) });
}
async function bE(t, e) {
  return new zt.TokenSigner("ES256k", e).signAsync(ip(t));
}
async function xE(t) {
  let e = t, { userSession: n } = e, r = ep(e, ["userSession"]);
  if (rp(n)) {
    let { privateKey: s, publicKey: i } = sp(n), o = Be(fe({}, r), { publicKey: i });
    return bE(o, s);
  }
  return zt.createUnsecuredToken(ip(t));
}
var mE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(mE || {}), op = "asigna-stx", Pf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === op && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(EE(t, e), "*");
}), SE = { authenticationRequest: async (t) => Pf(t, "authenticationRequest"), transactionRequest: async (t) => Pf(t, "transactionRequest") }, EE = (t, e) => ({ source: op, [e]: t }), AE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = SE);
};
AE();
var $E = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function IE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = hr(), o = np();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    sE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : $E, c = yx(a), l = document.createElement("connect-modal");
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
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), l.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Mi = IE(wE);
function Fn(t, e, n) {
  return Ll(Xt(t, e), n);
}
function Xt(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = vt(r);
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
      const r = CE(BigInt(`0x${ot(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ot(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Of(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ni(t, e = 8) {
  return (typeof t == "bigint" ? t : Xt(t, !1)).toString(16).padStart(e * 2, "0");
}
function Fo(t) {
  return parseInt(t, 16);
}
function Ll(t, e = 16) {
  const n = ni(t, e);
  return vt(n);
}
function vE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function LE(t, e) {
  return t & BigInt(1) << e;
}
function CE(t, e) {
  return LE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const BE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += BE[n];
  return e;
}
function vt(t) {
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
function xs(t) {
  return new TextEncoder().encode(t);
}
function Cl(t) {
  return new TextDecoder().decode(t);
}
function ap(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function kE(t) {
  return String.fromCharCode.apply(null, t);
}
function ME(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(ME))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function zo(...t) {
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
  return zo(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
var jf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(jf || (jf = {}));
var Ff;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ff || (Ff = {}));
var zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(zf || (zf = {}));
const cp = 33, ma = 32;
function _E(t) {
  if (t.length < ma * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ma * 2), r = t.slice(2 + ma * 2);
  return {
    recoveryId: Fo(e),
    r: n,
    s: r
  };
}
function TE(t) {
  const e = typeof t == "string" ? vt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function UE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function HE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function NE(t, e) {
  return t[e];
}
function PE(t, e, n = 0) {
  return t[n] = e, t;
}
function OE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yc || (yc = {}));
const DE = yc.Mainnet, jE = 128, FE = 128, lp = 16, sr = 32, wc = 80, Ro = 65, zE = 32, RE = 64, lo = 34;
var K;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(K || (K = {}));
var st;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(st || (st = {}));
var bc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bc || (bc = {}));
var te;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(te || (te = {}));
const Ri = ["onChainOnly", "offChainOnly", "any"], Rf = {
  [Ri[0]]: te.OnChainOnly,
  [Ri[1]]: te.OffChainOnly,
  [Ri[2]]: te.Any,
  [te.OnChainOnly]: te.OnChainOnly,
  [te.OffChainOnly]: te.OffChainOnly,
  [te.Any]: te.Any
};
function GE(t) {
  if (t in Rf)
    return Rf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ri.join(", ")}`);
}
var uo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(uo || (uo = {}));
uo.Mainnet;
var cs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(cs || (cs = {}));
var ee;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ee || (ee = {}));
var Mt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Mt || (Mt = {}));
var bt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(bt || (bt = {}));
var fo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(fo || (fo = {}));
var Bt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bt || (Bt = {}));
var Gs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gs || (Gs = {}));
var xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(xc || (xc = {}));
var Vs;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Vs || (Vs = {}));
var Gf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gf || (Gf = {}));
var Vf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Vf || (Vf = {}));
function mc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function VE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function up(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function KE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  mc(t.outputLen), mc(t.blockLen);
}
function qE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function WE(t, e) {
  up(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const er = {
  number: mc,
  bool: VE,
  bytes: up,
  hash: KE,
  exists: qE,
  output: WE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Sa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ne = (t, e) => t << 32 - e | t >>> e, YE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!YE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function XE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bl(t) {
  if (typeof t == "string" && (t = XE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class fp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function kr(t) {
  const e = (r) => t().update(Bl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ZE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class kl extends fp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Sa(this.buffer);
  }
  update(e) {
    er.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Sa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    er.exists(this), er.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    ZE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Sa(e), c = this.outputLen;
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
const QE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hp = Uint8Array.from({ length: 16 }, (t, e) => e), JE = hp.map((t) => (9 * t + 5) % 16);
let Ml = [hp], _l = [JE];
for (let t = 0; t < 4; t++)
  for (let e of [Ml, _l])
    e.push(e[t].map((n) => QE[n]));
const dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), t8 = Ml.map((t, e) => t.map((n) => dp[e][n])), e8 = _l.map((t, e) => t.map((n) => dp[e][n])), n8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), r8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _i = (t, e) => t << e | t >>> 32 - e;
function Kf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ti = new Uint32Array(16);
class s8 extends kl {
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
      Ti[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const y = 4 - h, w = n8[h], I = r8[h], k = Ml[h], M = _l[h], b = t8[h], L = e8[h];
      for (let $ = 0; $ < 16; $++) {
        const H = _i(r + Kf(h, i, a, l) + Ti[k[$]] + w, b[$]) + u | 0;
        r = u, u = l, l = _i(a, 10) | 0, a = i, i = H;
      }
      for (let $ = 0; $ < 16; $++) {
        const H = _i(s + Kf(y, o, c, f) + Ti[M[$]] + I, L[$]) + g | 0;
        s = g, g = f, f = _i(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ti.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const i8 = kr(() => new s8()), o8 = (t, e, n) => t & e ^ ~t & n, a8 = (t, e, n) => t & e ^ t & n ^ e & n, c8 = new Uint32Array([
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
]), Bn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), kn = new Uint32Array(64);
class pp extends kl {
  constructor() {
    super(64, 32, 8, !1), this.A = Bn[0] | 0, this.B = Bn[1] | 0, this.C = Bn[2] | 0, this.D = Bn[3] | 0, this.E = Bn[4] | 0, this.F = Bn[5] | 0, this.G = Bn[6] | 0, this.H = Bn[7] | 0;
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
      kn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = kn[u - 15], h = kn[u - 2], y = Ne(g, 7) ^ Ne(g, 18) ^ g >>> 3, w = Ne(h, 17) ^ Ne(h, 19) ^ h >>> 10;
      kn[u] = w + kn[u - 7] + y + kn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Ne(a, 6) ^ Ne(a, 11) ^ Ne(a, 25), h = f + g + o8(a, c, l) + c8[u] + kn[u] | 0, w = (Ne(r, 2) ^ Ne(r, 13) ^ Ne(r, 22)) + a8(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    kn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class l8 extends pp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Tl = kr(() => new pp());
kr(() => new l8());
const Ui = BigInt(2 ** 32 - 1), Sc = BigInt(32);
function gp(t, e = !1) {
  return e ? { h: Number(t & Ui), l: Number(t >> Sc & Ui) } : { h: Number(t >> Sc & Ui) | 0, l: Number(t & Ui) | 0 };
}
function u8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = gp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const f8 = (t, e) => BigInt(t >>> 0) << Sc | BigInt(e >>> 0), h8 = (t, e, n) => t >>> n, d8 = (t, e, n) => t << 32 - n | e >>> n, p8 = (t, e, n) => t >>> n | e << 32 - n, g8 = (t, e, n) => t << 32 - n | e >>> n, y8 = (t, e, n) => t << 64 - n | e >>> n - 32, w8 = (t, e, n) => t >>> n - 32 | e << 64 - n, b8 = (t, e) => e, x8 = (t, e) => t, m8 = (t, e, n) => t << n | e >>> 32 - n, S8 = (t, e, n) => e << n | t >>> 32 - n, E8 = (t, e, n) => e << n - 32 | t >>> 64 - n, A8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function $8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const I8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), v8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, L8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), C8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, B8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), k8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
  fromBig: gp,
  split: u8,
  toBig: f8,
  shrSH: h8,
  shrSL: d8,
  rotrSH: p8,
  rotrSL: g8,
  rotrBH: y8,
  rotrBL: w8,
  rotr32H: b8,
  rotr32L: x8,
  rotlSH: m8,
  rotlSL: S8,
  rotlBH: E8,
  rotlBL: A8,
  add: $8,
  add3L: I8,
  add3H: v8,
  add4L: L8,
  add4H: C8,
  add5H: k8,
  add5L: B8
}, [M8, _8] = rt.split([
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
].map((t) => BigInt(t))), Mn = new Uint32Array(80), _n = new Uint32Array(80);
class Go extends kl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: y, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, y, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Mn[b] = e.getUint32(n), _n[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const L = Mn[b - 15] | 0, $ = _n[b - 15] | 0, H = rt.rotrSH(L, $, 1) ^ rt.rotrSH(L, $, 8) ^ rt.shrSH(L, $, 7), R = rt.rotrSL(L, $, 1) ^ rt.rotrSL(L, $, 8) ^ rt.shrSL(L, $, 7), P = Mn[b - 2] | 0, O = _n[b - 2] | 0, x = rt.rotrSH(P, O, 19) ^ rt.rotrBH(P, O, 61) ^ rt.shrSH(P, O, 6), v = rt.rotrSL(P, O, 19) ^ rt.rotrBL(P, O, 61) ^ rt.shrSL(P, O, 6), T = rt.add4L(R, v, _n[b - 7], _n[b - 16]), z = rt.add4H(T, H, x, Mn[b - 7], Mn[b - 16]);
      Mn[b] = z | 0, _n[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: y, Gh: w, Gl: I, Hh: k, Hl: M } = this;
    for (let b = 0; b < 80; b++) {
      const L = rt.rotrSH(u, g, 14) ^ rt.rotrSH(u, g, 18) ^ rt.rotrBH(u, g, 41), $ = rt.rotrSL(u, g, 14) ^ rt.rotrSL(u, g, 18) ^ rt.rotrBL(u, g, 41), H = u & h ^ ~u & w, R = g & y ^ ~g & I, P = rt.add5L(M, $, R, _8[b], _n[b]), O = rt.add5H(P, k, L, H, M8[b], Mn[b]), x = P | 0, v = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), T = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), z = r & i ^ r & a ^ i & a, p = s & o ^ s & c ^ o & c;
      k = w | 0, M = I | 0, w = h | 0, I = y | 0, h = u | 0, y = g | 0, { h: u, l: g } = rt.add(l | 0, f | 0, O | 0, x | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const A = rt.add3L(x, T, p);
      r = rt.add3H(A, O, v, z), s = A | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = rt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = rt.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: y } = rt.add(this.Fh | 0, this.Fl | 0, h | 0, y | 0), { h: w, l: I } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: k, l: M } = rt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, y, w, I, k, M);
  }
  roundClean() {
    Mn.fill(0), _n.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class T8 extends Go {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class U8 extends Go {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class H8 extends Go {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
kr(() => new Go());
kr(() => new T8());
const N8 = kr(() => new U8());
kr(() => new H8());
function yp(t) {
  if (vt(t).byteLength != Ro)
    throw Error("Invalid signature");
  return {
    type: K.MessageSignature,
    data: t
  };
}
function Cs(t, e) {
  return { type: K.Address, version: t, hash160: e };
}
function Kr(t) {
  return Lr.c32address(t.version, t.hash160);
}
function mr(t, e, n) {
  const r = e || 1, s = n || jE;
  if (Tp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: K.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ul(t) {
  const e = Lr.c32addressDecode(t);
  return {
    type: K.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function P8(t) {
  if (t.type === _.PrincipalStandard)
    return Kr(t.address);
  if (t.type === _.PrincipalContract)
    return `${Kr(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function wp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return j8(e, n);
  } else
    return O8(t);
}
function O8(t) {
  const e = Ul(t);
  return { type: _.PrincipalStandard, address: e };
}
function D8(t) {
  return { type: _.PrincipalStandard, address: t };
}
function j8(t, e) {
  const n = Ul(t), r = mr(e);
  return bp(n, r);
}
function bp(t, e) {
  if (xs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Ea(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${ot(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return en(t.value);
    case _.ResponseErr:
      return en(t.value);
    case _.ResponseOk:
      return en(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return P8(t);
    case _.List:
      return t.list.map((r) => en(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = en(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function en(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: Hn(t), value: Ea(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Hn(t), value: Ea(t, !0), success: !0 };
    default:
      return { type: Hn(t), value: Ea(t, !0) };
  }
}
function Hn(t) {
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
      return `(optional ${Hn(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${Hn(t.value)})`;
    case _.ResponseOk:
      return `(response ${Hn(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? Hn(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Hn(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${ap(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${xs(t.data).length})`;
  }
}
const xp = () => ({ type: _.BoolTrue }), mp = () => ({ type: _.BoolFalse }), F8 = (t) => t ? xp() : mp(), qf = BigInt("0xffffffffffffffffffffffffffffffff"), z8 = BigInt(0), Wf = BigInt("0x7fffffffffffffffffffffffffffffff"), Yf = BigInt("-170141183460469231731687303715884105728"), R8 = (t) => {
  const e = Xt(t, !0);
  if (e > Wf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wf}`);
  if (e < Yf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yf}`);
  return { type: _.Int, value: e };
}, ho = (t) => {
  const e = Xt(t, !1);
  if (e < z8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qf}`);
  return { type: _.UInt, value: e };
}, Sp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Ep() {
  return { type: _.OptionalNone };
}
function Ap(t) {
  return { type: _.OptionalSome, value: t };
}
function G8(t) {
  return { type: _.ResponseErr, value: t };
}
function V8(t) {
  return { type: _.ResponseOk, value: t };
}
function K8(t) {
  return { type: _.List, list: t };
}
function Ec(t) {
  for (const e in t)
    if (!HA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const zr = (t) => ({ type: _.StringASCII, data: t }), q8 = (t) => ({ type: _.StringUTF8, data: t });
class $p extends fp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, er.hash(e);
    const r = Bl(n);
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
    return er.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    er.exists(this), er.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ip = (t, e, n) => new $p(t, e).update(n).digest();
Ip.create = (t, e) => new $p(t, e);
_t.hmacSha256Sync = (t, ...e) => {
  const n = Ip.create(Tl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ls(t) {
  return {
    type: K.PublicKey,
    data: vt(t)
  };
}
function W8(t, e, n = Bt.Compressed) {
  const r = _E(e.data), s = new le(Of(r.r), Of(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === Bt.Compressed;
  return i.toHex(o);
}
function Y8(t) {
  return { type: K.PublicKey, data: t };
}
function ms(t) {
  return !ot(t.data).startsWith("04");
}
function po(t) {
  return t.data.slice();
}
function X8(t) {
  const e = J8(t), n = Zs(e.data.slice(0, 32), e.compressed);
  return ls(ot(n));
}
function Z8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!0);
  return ls(n);
}
function Q8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!1);
  return ls(n);
}
function Ac(t) {
  const e = t.readUInt8(), n = e === 4 ? RE : zE;
  return Y8(Ht([e, t.readBytes(n)]));
}
function J8(t) {
  const e = TE(t), n = e.length == cp;
  return { data: e, compressed: n };
}
function tA(t, e) {
  const [n, r] = Eo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ni(r, 1) + le.fromHex(n).toCompactHex();
  return yp(i);
}
function eA(t) {
  return X8(t.data);
}
function nA(t, e, n) {
  return typeof t == "string" && (t = wp(t)), typeof n == "string" && (n = Qf(n)), {
    type: K.Payload,
    payloadType: st.TokenTransfer,
    recipient: t,
    amount: Xt(e, !1),
    memo: n ?? Qf("")
  };
}
function rA(t, e, n, r) {
  return typeof t == "string" && (t = Ul(t)), typeof e == "string" && (e = mr(e)), typeof n == "string" && (n = mr(n)), {
    type: K.Payload,
    payloadType: st.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Xf(t, e, n) {
  return typeof t == "string" && (t = mr(t)), typeof e == "string" && (e = hA(e)), typeof n == "number" ? {
    type: K.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: K.Payload,
    payloadType: st.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function sA() {
  return { type: K.Payload, payloadType: st.PoisonMicroblock };
}
function Zf(t, e) {
  if (t.byteLength != sr)
    throw Error(`Coinbase buffer size must be ${sr} bytes`);
  return e != null ? {
    type: K.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: K.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: t
  };
}
function iA(t, e, n) {
  if (t.byteLength != sr)
    throw Error(`Coinbase buffer size must be ${sr} bytes`);
  if (n.byteLength != wc)
    throw Error(`VRF proof buffer size must be ${wc} bytes`);
  return {
    type: K.Payload,
    payloadType: st.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === _.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var $c;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})($c || ($c = {}));
function oA(t, e, n, r, s, i, o) {
  return {
    type: K.Payload,
    payloadType: st.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function vp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case st.TokenTransfer:
      e.push(Tt(t.recipient)), e.push(Fn(t.amount, !1, 8)), e.push(Je(t.memo));
      break;
    case st.ContractCall:
      e.push(Je(t.contractAddress)), e.push(Je(t.contractName)), e.push(Je(t.functionName));
      const n = new Uint8Array(4);
      xr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Tt(r));
      });
      break;
    case st.SmartContract:
      e.push(Je(t.contractName)), e.push(Je(t.codeBody));
      break;
    case st.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Je(t.contractName)), e.push(Je(t.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Tt(t.recipient));
      break;
    case st.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Tt(t.recipient ? Ap(t.recipient) : Ep())), e.push(t.vrfProof);
      break;
    case st.TenureChange:
      e.push(vt(t.tenureHash)), e.push(vt(t.previousTenureHash)), e.push(vt(t.burnViewHash)), e.push(vt(t.previousTenureEnd)), e.push(xr(new Uint8Array(4), t.previousTenureBlocks)), e.push(PE(new Uint8Array(1), t.cause)), e.push(vt(t.publicKeyHash));
      break;
  }
  return Ht(e);
}
function aA(t) {
  switch (t.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = xe(t), r = Xt(t.readBytes(8), !1), s = Cp(t);
      return nA(n, r, s);
    case st.ContractCall:
      const i = us(t), o = be(t), a = be(t), c = [], l = t.readUInt32BE();
      for (let b = 0; b < l; b++) {
        const L = xe(t);
        c.push(L);
      }
      return rA(i, o, a, c);
    case st.SmartContract:
      const f = be(t), u = be(t, 4, 1e5);
      return Xf(f, u);
    case st.VersionedSmartContract: {
      const b = t.readUInt8Enum(bc, (H) => {
        throw new Error(`Cannot recognize ClarityVersion: ${H}`);
      }), L = be(t), $ = be(t, 4, 1e5);
      return Xf(L, $, b);
    }
    case st.PoisonMicroblock:
      return sA();
    case st.Coinbase: {
      const b = t.readBytes(sr);
      return Zf(b);
    }
    case st.CoinbaseToAltRecipient: {
      const b = t.readBytes(sr), L = xe(t);
      return Zf(b, L);
    }
    case st.NakamotoCoinbase: {
      const b = t.readBytes(sr), L = xe(t), $ = t.readBytes(wc);
      return iA(b, L, $);
    }
    case st.TenureChange:
      const g = ot(t.readBytes(20)), h = ot(t.readBytes(20)), y = ot(t.readBytes(20)), w = ot(t.readBytes(32)), I = t.readUInt32BE(), k = t.readUInt8Enum($c, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), M = ot(t.readBytes(20));
      return oA(g, h, y, w, I, k, M);
  }
}
class Vo extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Xn extends Vo {
  constructor(e) {
    super(e);
  }
}
class ce extends Vo {
  constructor(e) {
    super(e);
  }
}
class go extends Vo {
  constructor(e) {
    super(e);
  }
}
class nr extends Vo {
  constructor(e) {
    super(e);
  }
}
var ve;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ve || (ve = {}));
function Ic(t) {
  return yp(ot(t.readBytes(Ro)));
}
function qr(t, e) {
  return {
    pubKeyEncoding: t,
    type: K.TransactionAuthField,
    contents: e
  };
}
function cA(t) {
  const e = t.readUInt8Enum(ve, (n) => {
    throw new ce(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ve.PublicKeyCompressed:
      return qr(Bt.Compressed, Ac(t));
    case ve.PublicKeyUncompressed:
      return qr(Bt.Uncompressed, Q8(Ac(t).data));
    case ve.SignatureCompressed:
      return qr(Bt.Compressed, Ic(t));
    case ve.SignatureUncompressed:
      return qr(Bt.Uncompressed, Ic(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Hl(t) {
  return vt(t.data);
}
function lA(t) {
  const e = [];
  switch (t.contents.type) {
    case K.PublicKey:
      e.push(t.pubKeyEncoding === Bt.Compressed ? ve.PublicKeyCompressed : ve.PublicKeyUncompressed), e.push(po(Z8(t.contents.data)));
      break;
    case K.MessageSignature:
      e.push(t.pubKeyEncoding === Bt.Compressed ? ve.SignatureCompressed : ve.SignatureUncompressed), e.push(Hl(t.contents));
      break;
  }
  return Ht(e);
}
function Je(t) {
  switch (t.type) {
    case K.Address:
      return ri(t);
    case K.Principal:
      return Lp(t);
    case K.LengthPrefixedString:
      return fs(t);
    case K.MemoString:
      return dA(t);
    case K.AssetInfo:
      return Bp(t);
    case K.PostCondition:
      return pA(t);
    case K.PublicKey:
      return po(t);
    case K.LengthPrefixedList:
      return Ol(t);
    case K.Payload:
      return vp(t);
    case K.TransactionAuthField:
      return lA(t);
    case K.MessageSignature:
      return Hl(t);
  }
}
function uA() {
  return {
    type: K.Address,
    version: fo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Nl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === bt.SerializeP2WPKH || e === bt.SerializeP2WSH || e === bt.SerializeP2WSHNonSequential) && !r.every(ms))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case bt.SerializeP2PKH:
      return Cs(t, MA(r[0].data));
    case bt.SerializeP2WPKH:
      return Cs(t, _A(r[0].data));
    case bt.SerializeP2SH:
    case bt.SerializeP2SHNonSequential:
      return Cs(t, TA(n, r.map(po)));
    case bt.SerializeP2WSH:
    case bt.SerializeP2WSHNonSequential:
      return Cs(t, UA(n, r.map(po)));
  }
}
function ri(t) {
  const e = [];
  return e.push(vt(ni(t.version, 1))), e.push(vt(t.hash160)), Ht(e);
}
function us(t) {
  const e = Fo(ot(t.readBytes(1))), n = ot(t.readBytes(20));
  return { type: K.Address, version: e, hash160: n };
}
function Lp(t) {
  const e = [];
  return e.push(t.prefix), e.push(ri(t.address)), t.prefix === Vs.Contract && e.push(fs(t.contractName)), Ht(e);
}
function fA(t) {
  const e = t.readUInt8Enum(Vs, (s) => {
    throw new ce(`Unexpected Principal payload type: ${s}`);
  }), n = us(t);
  if (e === Vs.Standard)
    return { type: K.Principal, prefix: e, address: n };
  const r = be(t);
  return {
    type: K.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function fs(t) {
  const e = [], n = xs(t.content), r = n.byteLength;
  return e.push(vt(ni(r, t.lengthPrefixBytes))), e.push(n), Ht(e);
}
function be(t, e, n) {
  e = e || 1;
  const r = Fo(ot(t.readBytes(e))), s = Cl(t.readBytes(r));
  return mr(s, e, n ?? 128);
}
function hA(t) {
  return mr(t, 4, 1e5);
}
function Qf(t) {
  if (t && Tp(t, lo))
    throw new Error(`Memo exceeds maximum length of ${lo} bytes`);
  return { type: K.MemoString, content: t };
}
function dA(t) {
  const e = [], n = xs(t.content), r = kA(ot(n), lo * 2);
  return e.push(vt(r)), Ht(e);
}
function Cp(t) {
  let e = Cl(t.readBytes(lo));
  return e = e.replace(/\u0000*$/, ""), { type: K.MemoString, content: e };
}
function Bp(t) {
  const e = [];
  return e.push(ri(t.address)), e.push(fs(t.contractName)), e.push(fs(t.assetName)), Ht(e);
}
function vc(t) {
  return {
    type: K.AssetInfo,
    address: us(t),
    contractName: be(t),
    assetName: be(t)
  };
}
function Pl(t, e) {
  return {
    type: K.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ol(t) {
  const e = t.values, n = [];
  n.push(vt(ni(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Je(r));
  return Ht(n);
}
function kp(t, e, n) {
  const r = Fo(ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case K.Address:
        s.push(us(t));
        break;
      case K.LengthPrefixedString:
        s.push(be(t));
        break;
      case K.MemoString:
        s.push(Cp(t));
        break;
      case K.AssetInfo:
        s.push(vc(t));
        break;
      case K.PostCondition:
        s.push(gA(t));
        break;
      case K.PublicKey:
        s.push(Ac(t));
        break;
      case K.TransactionAuthField:
        s.push(cA(t));
        break;
    }
  return Pl(s, n);
}
function pA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Lp(t.principal)), (t.conditionType === ee.Fungible || t.conditionType === ee.NonFungible) && e.push(Bp(t.assetInfo)), t.conditionType === ee.NonFungible && e.push(Tt(t.assetName)), e.push(t.conditionCode), t.conditionType === ee.STX || t.conditionType === ee.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Xn("The post-condition amount may not be larger than 8 bytes");
    e.push(Fn(t.amount, !1, 8));
  }
  return Ht(e);
}
function gA(t) {
  const e = t.readUInt8Enum(ee, (o) => {
    throw new ce(`Could not read ${o} as PostConditionType`);
  }), n = fA(t);
  let r, s, i;
  switch (e) {
    case ee.STX:
      return r = t.readUInt8Enum(Gs, (a) => {
        throw new ce(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: K.PostCondition,
        conditionType: ee.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case ee.Fungible:
      return s = vc(t), r = t.readUInt8Enum(Gs, (a) => {
        throw new ce(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: K.PostCondition,
        conditionType: ee.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case ee.NonFungible:
      s = vc(t);
      const o = xe(t);
      return r = t.readUInt8Enum(xc, (a) => {
        throw new ce(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: K.PostCondition,
        conditionType: ee.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Ke(t, e) {
  return Ht([t, e]);
}
function yA(t) {
  return new Uint8Array([t.type]);
}
function wA(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Ke(t.type, Tt(t.value));
}
function bA(t) {
  const e = new Uint8Array(4);
  return xr(e, t.buffer.length, 0), Ke(t.type, zo(e, t.buffer));
}
function xA(t) {
  const e = Ll(vE(t.value, BigInt(FE)), lp);
  return Ke(t.type, e);
}
function mA(t) {
  const e = Ll(t.value, lp);
  return Ke(t.type, e);
}
function SA(t) {
  return Ke(t.type, ri(t.address));
}
function EA(t) {
  return Ke(t.type, zo(ri(t.address), fs(t.contractName)));
}
function AA(t) {
  return Ke(t.type, Tt(t.value));
}
function $A(t) {
  const e = [], n = new Uint8Array(4);
  xr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Tt(r);
    e.push(s);
  }
  return Ke(t.type, Ht(e));
}
function IA(t) {
  const e = [], n = new Uint8Array(4);
  xr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = mr(s);
    e.push(fs(i));
    const o = Tt(t.data[s]);
    e.push(o);
  }
  return Ke(t.type, Ht(e));
}
function Mp(t, e) {
  const n = [], r = e == "ascii" ? ap(t.data) : xs(t.data), s = new Uint8Array(4);
  return xr(s, r.length, 0), n.push(s), n.push(r), Ke(t.type, Ht(n));
}
function vA(t) {
  return Mp(t, "ascii");
}
function LA(t) {
  return Mp(t, "utf8");
}
function Tt(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return yA(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return wA(t);
    case _.Buffer:
      return bA(t);
    case _.UInt:
      return mA(t);
    case _.Int:
      return xA(t);
    case _.PrincipalStandard:
      return SA(t);
    case _.PrincipalContract:
      return EA(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return AA(t);
    case _.List:
      return $A(t);
    case _.Tuple:
      return IA(t);
    case _.StringASCII:
      return vA(t);
    case _.StringUTF8:
      return LA(t);
    default:
      throw new Xn("Unable to serialize. Invalid Clarity Value.");
  }
}
function CA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Jf = /* @__PURE__ */ new Map();
function _p(t, e) {
  const n = Jf.get(t);
  if (n !== void 0)
    return n(e);
  const r = CA(t);
  return Jf.set(t, r), _p(t, e);
}
class Ts {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return OE(this.readBytes(4), 0);
  }
  readUInt8() {
    return NE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return UE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ot(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ot(n);
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
    if (_p(e, r))
      return r;
    throw n(r);
  }
}
function xe(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ts(vt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ts(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new ce(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return R8(e.readBytes(16));
    case _.UInt:
      return ho(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return Sp(e.readBytes(r));
    case _.BoolTrue:
      return xp();
    case _.BoolFalse:
      return mp();
    case _.PrincipalStandard:
      const s = us(e);
      return D8(s);
    case _.PrincipalContract:
      const i = us(e), o = be(e);
      return bp(i, o);
    case _.ResponseOk:
      return V8(xe(e));
    case _.ResponseErr:
      return G8(xe(e));
    case _.OptionalNone:
      return Ep();
    case _.OptionalSome:
      return Ap(xe(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(xe(e));
      return K8(c);
    case _.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let w = 0; w < l; w++) {
        const I = be(e).content;
        if (I === void 0)
          throw new ce('"content" is undefined');
        f[I] = xe(e);
      }
      return Ec(f);
    case _.StringASCII:
      const u = e.readUInt32BE(), g = kE(e.readBytes(u));
      return zr(g);
    case _.StringUTF8:
      const h = e.readUInt32BE(), y = Cl(e.readBytes(h));
      return q8(y);
    default:
      throw new ce("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const BA = (t) => t.length % 2 == 0 ? t : `0${t}`, kA = (t, e) => t.padEnd(e, "0"), Tp = (t, e) => t ? xs(t).length > e : !1;
function Lc(t) {
  return Qd(t);
}
const Ks = (t) => i8(Tl(t)), Dl = (t) => ot(N8(t)), MA = (t) => ot(Ks(t)), _A = (t) => {
  const e = Ks(t), n = zo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ks(n);
  return ot(r);
}, TA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ht(n), s = Ks(r);
  return ot(s);
}, UA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ht(n), s = Tl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ht(i), a = Ks(o);
  return ot(a);
};
function HA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Up(t) {
  const e = Tt(t);
  return `0x${ot(e)}`;
}
function NA(t) {
  return xe(t);
}
const Us = (t) => {
  try {
    return Lr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function jl() {
  return {
    type: K.MessageSignature,
    data: ot(new Uint8Array(Ro))
  };
}
function Hp(t, e, n, r) {
  const s = Nl(0, t, 1, [ls(e)]).hash160, i = ms(ls(e)) ? Bt.Compressed : Bt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Xt(n, !1),
    fee: Xt(r, !1),
    keyEncoding: i,
    signature: jl()
  };
}
function qs(t) {
  return "signature" in t;
}
function th(t) {
  return t === bt.SerializeP2SH || t === bt.SerializeP2WSH;
}
function PA(t) {
  return t === bt.SerializeP2SHNonSequential || t === bt.SerializeP2WSHNonSequential;
}
function eh(t) {
  const e = Lc(t);
  return e.nonce = 0, e.fee = 0, qs(e) ? e.signature = jl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function OA(t) {
  const e = [
    t.hashMode,
    vt(t.signer),
    Fn(t.nonce, !1, 8),
    Fn(t.fee, !1, 8),
    t.keyEncoding,
    Hl(t.signature)
  ];
  return Ht(e);
}
function DA(t) {
  const e = [
    t.hashMode,
    vt(t.signer),
    Fn(t.nonce, !1, 8),
    Fn(t.fee, !1, 8)
  ], n = Pl(t.fields);
  e.push(Ol(n));
  const r = new Uint8Array(2);
  return HE(r, t.signaturesRequired, 0), e.push(r), Ht(e);
}
function jA(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt(`0x${ot(e.readBytes(8))}`), s = BigInt(`0x${ot(e.readBytes(8))}`), i = e.readUInt8Enum(Bt, (a) => {
    throw new ce(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === bt.SerializeP2WPKH && i != Bt.Compressed)
    throw new ce("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ic(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function FA(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt("0x" + ot(e.readBytes(8))), s = BigInt("0x" + ot(e.readBytes(8))), i = kp(e, K.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case K.PublicKey:
        ms(l.contents) || (o = !0);
        break;
      case K.MessageSignature:
        if (l.pubKeyEncoding === Bt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new nr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === bt.SerializeP2WSH || t === bt.SerializeP2WSHNonSequential))
    throw new nr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Aa(t) {
  return qs(t) ? OA(t) : DA(t);
}
function $a(t) {
  const e = t.readUInt8Enum(bt, (n) => {
    throw new ce(`Could not parse ${n} as AddressHashMode`);
  });
  return e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH ? jA(e, t) : FA(e, t);
}
function Np(t, e, n, r) {
  const i = t + ot(new Uint8Array([e])) + ot(Fn(n, !1, 8)) + ot(Fn(r, !1, 8));
  if (vt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Dl(vt(i));
}
function Pp(t, e, n) {
  const r = 33 + Ro, s = ms(e) ? Bt.Compressed : Bt.Uncompressed, i = t + BA(s.toString(16)) + n.data, o = vt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Dl(o);
}
function zA(t, e, n, r, s) {
  const i = Np(t, e, n, r), o = tA(s, i), a = eA(s), c = Pp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Op(t, e, n, r, s, i) {
  const o = Np(t, e, n, r), a = ls(W8(o, i, s)), c = Pp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function RA() {
  const t = Hp(bt.SerializeP2PKH, "", 0, 0);
  return t.signer = uA().hash160, t.keyEncoding = Bt.Compressed, t.signature = jl(), t;
}
function nh(t, e, n) {
  return qs(t) ? GA(t, e, n) : VA(t, e, n);
}
function GA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Op(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Nl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new nr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function VA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case K.PublicKey:
        ms(c.contents) || (i = !0), r.push(c.contents);
        break;
      case K.MessageSignature:
        c.pubKeyEncoding === Bt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = Op(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (th(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new nr("Too many signatures");
        break;
    }
  if (th(t.hashMode) && o !== t.signaturesRequired || PA(t.hashMode) && o < t.signaturesRequired)
    throw new nr("Incorrect number of signatures");
  if (i && (t.hashMode === bt.SerializeP2WSH || t.hashMode === bt.SerializeP2WSHNonSequential))
    throw new nr("Uncompressed keys are not allowed in this hash mode");
  const a = Nl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new nr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Dp(t) {
  return {
    authType: Mt.Standard,
    spendingCondition: t
  };
}
function jp(t, e) {
  return {
    authType: Mt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Hp(bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function rh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Mt.Standard:
        return Dp(eh(t.spendingCondition));
      case Mt.Sponsored:
        return jp(eh(t.spendingCondition), RA());
      default:
        throw new go("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function KA(t, e) {
  switch (t.authType) {
    case Mt.Standard:
      return nh(t.spendingCondition, e, Mt.Standard);
    case Mt.Sponsored:
      return nh(t.spendingCondition, e, Mt.Standard);
    default:
      throw new go("Invalid origin auth type");
  }
}
function qA(t, e) {
  switch (t.authType) {
    case Mt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Xt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Mt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Xt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function WA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Xt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function YA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Xt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function XA(t, e) {
  const n = {
    ...e,
    nonce: Xt(e.nonce, !1),
    fee: Xt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function ZA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Mt.Standard:
      e.push(Aa(t.spendingCondition));
      break;
    case Mt.Sponsored:
      e.push(Aa(t.spendingCondition)), e.push(Aa(t.sponsorSpendingCondition));
      break;
  }
  return Ht(e);
}
function QA(t) {
  const e = t.readUInt8Enum(Mt, (r) => {
    throw new ce(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Mt.Standard:
      return n = $a(t), Dp(n);
    case Mt.Sponsored:
      n = $a(t);
      const r = $a(t);
      return jp(n, r);
  }
}
class JA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Xt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? DE, this.postConditionMode = i ?? cs.Deny, this.postConditions = s ?? Pl([]), o)
      this.anchorMode = GE(o);
    else
      switch (r.payloadType) {
        case st.Coinbase:
        case st.CoinbaseToAltRecipient:
        case st.NakamotoCoinbase:
        case st.PoisonMicroblock:
        case st.TenureChange:
          this.anchorMode = te.OnChainOnly;
          break;
        case st.ContractCall:
        case st.SmartContract:
        case st.VersionedSmartContract:
        case st.TokenTransfer:
          this.anchorMode = te.Any;
          break;
      }
  }
  signBegin() {
    const e = Lc(this);
    return e.auth = rh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Lc(this);
    return e.auth = rh(e.auth), e.txid();
  }
  verifyOrigin() {
    return KA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Mt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Mt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Mt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !qs(n)) {
      const r = ms(e);
      n.fields.push(qr(r ? Bt.Compressed : Bt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = zA(n, r, e.fee, e.nonce, s);
    return qs(e) ? e.signature = i : e.fields.push(qr(s.data.byteLength === cp ? Bt.Compressed : Bt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Dl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Mt.Sponsored)
      throw new go("Cannot sponsor sign a non-sponsored transaction");
    this.auth = XA(this.auth, e);
  }
  setFee(e) {
    this.auth = qA(this.auth, e);
  }
  setNonce(e) {
    this.auth = WA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Mt.Sponsored)
      throw new go("Cannot sponsor sign a non-sponsored transaction");
    this.auth = YA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Xn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Xn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Xn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Xn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Xn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return xr(n, this.chainId, 0), e.push(n), e.push(ZA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ol(this.postConditions)), e.push(vp(this.payload)), Ht(e);
  }
}
function Fl(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Ts(vt(t.slice(2))) : e = new Ts(vt(t)) : t instanceof Uint8Array ? e = new Ts(t) : e = t;
  const n = e.readUInt8Enum(uo, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = QA(e), i = e.readUInt8Enum(te, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(cs, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = kp(e, K.PostCondition), c = aA(e);
  return new JA(n, s, c, a, o, i, r);
}
const t6 = F8, Hs = ho, e6 = Sp;
const n6 = /* @__PURE__ */ new Set([4001, -31001]), r6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], s6 = ["result", "data", "payload", "response", "params"], sh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ko = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Mr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, rn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, i6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Fp = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => i6(i, r)) === s
  );
}, zp = (t) => t ? Fp(Mr()).some(
  (e) => {
    var n;
    return e.id === t && (Ko(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Rp = () => {
  if (typeof window > "u")
    return;
  const t = Mr(), e = Fp(t).filter(
    (n) => {
      var r;
      return Ko(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = rn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of r6) {
    const r = rn(t, n) ?? (t === window ? void 0 : rn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, o6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Mr(), n = rn(e, t) ?? (e === window ? void 0 : rn(window, t)) ?? _o(t);
  if (n)
    return n;
  if (Ko(t) || zp(t))
    return Rp();
}, Hi = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, a6 = ["blockstack-session", "blockstack"], c6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of a6) {
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
c6();
const Gp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ae = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, l6 = (t) => {
  const e = ae(t);
  if (!e)
    return null;
  const n = Gp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, u6 = (t) => {
  const e = ae(t);
  if (!e)
    return null;
  const n = Gp(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Cc = (t, e = "mainnet") => {
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
      return Cc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Cc(r, e);
  }
  return e;
}, ir = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Ws = (t, e = 0) => {
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
      const i = Ws(s, e + 1);
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
    const i = Ws(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Us(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Us(n.testnet) ? n.testnet.trim() : null;
}, ih = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Vp = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && n6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Sr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ae(n == null ? void 0 : n.message) ?? ae(e.message) ?? ae(e.error) ?? ae(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, hs = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Sr(e);
    if (e.status === "error")
      throw Sr(e.result ?? e);
  }
  return t;
}, oh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return hs(r);
  } catch (r) {
    throw Sr(r);
  }
}, Kp = () => Rp(), zl = () => {
  if (typeof window > "u")
    return;
  const t = Mr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = rn(t, e) ?? (t === window ? void 0 : rn(window, e));
    if (n)
      return n;
  }
}, ah = () => {
  if (typeof window > "u")
    return;
  const t = zl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Mr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = rn(e, n) ?? (e === window ? void 0 : rn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Gi = (t) => {
  var r, s;
  const e = hr();
  if (Ko(e) || zp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Mr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Kp();
}, Ia = (t) => {
  const e = u6(t);
  if (!e)
    return null;
  try {
    const n = Fl(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, yo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Ia(t), r = l6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? ae(t) ?? void 0 : void 0
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
  for (const a of sh)
    if (Ia(s[a])) {
      i = ae(s[a]);
      break;
    }
  const o = ae(s.txId) || ae(s.txid) || ae(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ae(s.txRaw) ?? void 0
    };
  for (const a of sh) {
    const c = Ia(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ae(s[a]) ?? void 0
      };
  }
  for (const a of s6) {
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
}, va = (t) => {
  const e = yo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, f6 = (t) => {
  const e = yo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, h6 = (t) => ({
  ...t,
  fee: ir(t.fee),
  nonce: ir(t.nonce),
  sponsored: t.sponsored === !0
}), ch = (t) => ({
  recipient: t.recipient,
  amount: ir(t.amount) ?? "0",
  memo: t.memo,
  network: Cc(t.network),
  address: t.stxAddress,
  fee: ir(t.fee),
  nonce: ir(t.nonce),
  sponsored: t.sponsored ?? !1
}), qp = "WALLET_ADDRESS_MISMATCH", d6 = 45e3;
let Ns = null;
const Bc = (t) => {
  t && (Ns = { address: t, at: Date.now() });
}, p6 = () => {
  Ns = null;
}, g6 = () => Ns && Date.now() - Ns.at <= d6 ? Ns.address : null, y6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, w6 = async (t) => {
  p6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = hs(await t.request("wallet_connect")), n = Ws(e);
  return Bc(n), n;
}, b6 = async (t, e, n, r) => {
  try {
    return hs(await t.request(e, n));
  } catch (s) {
    const i = Sr(s);
    if (!y6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await w6(t);
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
        { code: o ? qp : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return hs(await t.request(e, n));
    } catch (a) {
      throw Sr(a);
    }
  }
};
let lh = 3e4;
const x6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${lh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, lh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, m6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: qp }
      );
    return c;
  }, s = g6();
  if (s)
    return Hi(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Hi(n, "account-read");
  try {
    const c = hs(
      await x6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ws(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Vp(c))
      throw Sr(c);
    Hi(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Bc(i), r(i, "wallet_getAccount");
  let o;
  Hi(n, "account-reconnect");
  try {
    o = hs(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Sr(c);
  }
  const a = Ws(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Bc(a), r(a, "wallet_connect");
}, S6 = async (t, e) => {
  if (!Gi(t)) {
    const i = await oh(
      t,
      "stx_transferStx",
      ch(e)
    );
    return va(i);
  }
  const n = zl();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await oh(
      n,
      "stx_transferStx",
      ch(e)
    );
    return va(i);
  }
  const r = Kp();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await m6(r, e.stxAddress);
  const s = await b6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ir(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ir(e.fee) } : {}
    },
    e.stxAddress
  );
  return va(s);
}, E6 = () => hr(), Wp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = hr(), e = t ? o6(t) : void 0;
  if (e)
    return e;
  const n = Mr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, A6 = (t, e) => {
  const n = Wp(), r = h6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, f6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Mi(r, e);
  if (Gi(n) && !zl()) {
    const s = ah();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: hr(),
        route: "legacy-transaction-request"
      }), Mi(r, s);
  }
  return void S6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (ih(s) && Gi(n)) {
      const a = ah();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: hr(),
          route: "legacy-transaction-request"
        }), Mi(r, a);
        return;
      }
    }
    if (ih(s) && !Gi(n)) {
      Mi(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Vp(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, uh = (t) => Up(t).replace(/^0x/, ""), fh = "This wallet cannot sign messages. Try Xverse or Leather.", hh = (t) => typeof (t == null ? void 0 : t.request) == "function", dh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", $6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, I6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function v6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: uh(e.message),
    domain: uh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function L6(t, e) {
  const n = await xE({
    domain: e.domain,
    message: e.message,
    network: jo(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function C6(t) {
  var s, i;
  const e = E6() || "", n = /xverse/i.test(e);
  let r = Wp();
  if (n && !dh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (dh(r))
    try {
      return await L6(r, t);
    } catch (o) {
      if (n || !hh(r) || !I6(o)) throw o;
    }
  if (!n && hh(r))
    try {
      return await v6(r, t);
    } catch (o) {
      throw $6(o) ? new Error(fh) : o;
    }
  throw new Error(fh);
}
const ph = 1000000n, Ps = 1000000n, kc = 50n, wo = 3000n, Rl = 300n, B6 = 3000n, k6 = 50000n, gh = 200n, qo = (t) => t + kc;
function Se(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ph}.${(n % ph).toString().padStart(6, "0")}`;
}
function M6(t, e = Rl) {
  return t <= wo ? 0 : Number((t - wo) / qo(e));
}
function yh(t, e = 0n) {
  const n = Ps - t - e;
  return n > 0n ? n : 0n;
}
function _6(t, e = Rl) {
  return t > Ps ? "over" : t < wo + qo(e) ? "empty" : t < k6 ? "low" : "ok";
}
const T6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", U6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", H6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function N6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || H6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== T6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Yp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", La = 3, P6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Mc, Xp] = Yp.split("."), ge = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function _c(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function O6(t) {
  return ge(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ds(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Zp(t, e = []) {
  const n = await ds(`/v2/contracts/call-read/${Mc}/${Xp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Mc, arguments: e.map((r) => "0x" + ge(Tt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return en(xe(n.result));
}
async function D6() {
  const t = await ds(`/v2/contracts/source/${Mc}/${Xp}?proof=0`);
  if (typeof t.source != "string" || await O6(t.source) !== U6) throw Error("Deployed source does not match the tested helper.");
  if (N6(await Zp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Qp(t) {
  return t.startsWith("SP") && Us(t) && !t.includes(".");
}
async function j6(t) {
  var r;
  if (!Qp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ds(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ds(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function F6(t) {
  const e = await ds(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function z6(t, e) {
  var s, i;
  const n = await Zp("get-owner", [Hs(t), Hs(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Qp(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function R6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: _c(t), signal: AbortSignal.timeout(15e3) });
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
async function G6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function V6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Fl(_c(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Kr(Cs(fo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Kr(r.contractAddress) + "." + r.contractName.content !== Yp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ge(Tt(r.functionArgs[0])) !== ge(Tt(Hs(t.core))) || ge(Tt(r.functionArgs[1])) !== ge(Tt(Hs(t.song))) || ge(Tt(r.functionArgs[2])) !== ge(Tt(e6(_c(t.id)))) || t.amount !== "50" || e.postConditionMode !== cs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Gs.Equal || i.principal.prefix !== 2 || Kr(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Kr(r.contractAddress) + "." + r.contractName.content !== P6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ge(Tt(r.functionArgs[0])) !== ge(Tt(Hs(t.song))) || typeof t.liked != "boolean" || ge(Tt(r.functionArgs[1])) !== ge(Tt(t6(t.liked))) || t.amount !== "0" || e.postConditionMode !== cs.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || en(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const K6 = "xtrata.xyz/radio/listening-wallet", q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", W6 = (t) => ({
  domain: Ec({ name: zr(K6), version: zr("1"), "chain-id": ho(1) }),
  message: Ec({
    purpose: zr(q6),
    main: zr(t.main),
    listening: zr(t.listening),
    issued: ho(t.issued)
  })
}), wh = ["prepared", "signed", "unknown", "pending"], Y6 = 30 * 6e4, jr = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, X6 = 3e3, bh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Z6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = !1, u = !1, g = null, h = !1, y = "", w = "", I, k = null, M, b = [], L, $ = -1 / 0;
  const H = /* @__PURE__ */ new Set();
  let R = !1, P = !1, O = !1, x = !1, v = 0, T = null, z = Promise.resolve();
  const p = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Rl.toString()), A = (E) => !!i && !(i.features ?? []).includes(E), U = (E, j) => `xtrata.ppp.v1.${E}:${j}`, W = (E = i == null ? void 0 : i.address) => {
    if (!E) return [];
    try {
      const j = JSON.parse(t.store.get(U("entries", E)) || "[]");
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  }, Y = (E) => {
    const j = [E, ...W(E.address).filter((V) => !(V.txid === E.txid && V.kind === E.kind))].slice(0, 200);
    t.store.set(U("entries", E.address), JSON.stringify(j));
  }, m = (E = i == null ? void 0 : i.address) => !!E && t.store.get(U("on", E)) !== "0", B = (E) => {
    i != null && i.address && t.store.set(U("on", i.address), E ? "1" : "0");
  }, X = () => W().filter((E) => wh.includes(E.status)), at = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(U("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, ft = (E) => {
    i != null && i.address && t.store.set(U("deposit", i.address), JSON.stringify(E));
  }, Lt = () => X().filter((E) => t.now() - E.created > Y6 && H.has(E.txid));
  function Ot() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const E = t.main();
    return E ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== E ? "link" : o === void 0 ? "loading" : o > Ps ? "over" : o < wo + qo(p()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const Vt = () => {
    var E, j;
    return {
      step: Ot(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : _6(o, p()),
      playsLeft: o === void 0 ? 0 : M6(o, p()),
      allowance: o === void 0 ? Ps : yh(o, BigInt(((E = at()) == null ? void 0 : E.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: m(),
      entries: W(),
      depositTxid: ((j = at()) == null ? void 0 : j.txid) ?? I,
      depositPending: !!at(),
      walletOutdated: A("like"),
      linkedListening: L && L === t.main() ? b.map((V) => V.listening) : [],
      serverLinked: !!k && M === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Lt().length,
      armed: O
    };
  }, Et = (E, j = "") => {
    y = E, w = j, t.changed();
  };
  async function lt(E, j) {
    if (!c) {
      c = E, w = "", t.changed();
      try {
        await j();
      } catch (V) {
        const F = V instanceof Error ? V.message : String(V);
        w = /Cancelled in the listening wallet/.test(F) ? "" : F, w || (y = "Cancelled. Nothing was signed.", x = !0);
      } finally {
        c = null, await me(!0);
      }
    }
  }
  async function Nt() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Dt(E = !1) {
    i != null && i.address && (!E && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function he(E) {
    if ((L !== E || t.now() - $ >= 6e4) && (b = await t.links(E), L = E, $ = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === E) return;
    const j = `${E}:${i.address}`;
    M === j && k || (k = b.find((V) => V.listening === i.address) ?? null, M = j);
  }
  async function Rn() {
    const E = i == null ? void 0 : i.address;
    if (!E) return;
    let j;
    for (const F of X())
      try {
        const yt = await t.chain.transaction(F.txid);
        if (!yt) {
          if (H.add(F.txid), t.now() - F.created > 15 * 6e4 && (j ?? (j = await t.chain.confirmedNonce(E))), j !== void 0 && j > BigInt(F.nonce)) {
            Y({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), Y({ ...F, status: "pending" });
            } catch (mt) {
              jr(mt) && Y({ ...F, status: "failed", note: mt.message, raw: void 0 });
            }
          continue;
        }
        H.delete(F.txid);
        const xt = String(yt.tx_status);
        xt === "success" && yt.canonical !== !1 && yt.is_unanchored === !1 ? (Y({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(yt.fee_rate ?? F.fee), raw: void 0 }), F.kind === "like" && (h = !0)) : xt.startsWith("abort_") || xt.startsWith("dropped_") ? Y({ ...F, status: "failed", note: xt, raw: void 0 }) : F.status !== "pending" && Y({ ...F, status: "pending" });
      } catch {
      }
    const V = at();
    if (V)
      try {
        const F = await t.chain.transaction(V.txid), yt = String((F == null ? void 0 : F.tx_status) ?? "");
        (yt === "success" && F.is_unanchored === !1 || yt.startsWith("abort_") || yt.startsWith("dropped_") || !F && t.now() - V.at > 2 * 36e5) && (ft(null), a = -1 / 0);
      } catch {
      }
  }
  async function me(E = !1) {
    var j;
    try {
      const V = t.main();
      if ((E || !e || r !== V || t.now() - n > 3e5) && (e = await t.config(V), n = t.now(), r = V), !e.enabled || !e.here || !V || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), O && ke(), t.changed();
        return;
      }
      await Nt(), i = await s.request("listening.status"), await he(V), await Dt(E), await Rn();
    } catch (V) {
      w = V instanceof Error ? V.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Ot() === "locked" ? Gn() : O && ke(), h) {
      h = !1;
      try {
        (j = t.likesChanged) == null || j.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function cn(E, j) {
    const V = !(i != null && i.address) || m(i.address);
    await E.request("listening.unlock", { mode: "unlock", terms: V ? qe() : void 0, anyPasskey: j }), i = await E.request("listening.status"), V && (m(i.address) ? await ln() : await E.request("listening.stop")), Et(V ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
    const F = g;
    g = null, F && t.now() - F.at < 12e4 && setTimeout(() => void me(!0).then(() => de(F)), 0);
  }
  function Gn() {
    O || c || x || v >= 3 || !s || !(i != null && i.address) || (O = !0, z = (async () => {
      try {
        await cn(s, !1), v = 0;
      } catch (E) {
        const j = E instanceof Error ? E.message : String(E);
        /Cancelled in the listening wallet/.test(j) ? T || (x = !0, Et("Cancelled. Nothing was signed.")) : /did not answer/.test(j) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (v++, w = j);
      } finally {
        O = !1;
        const E = T;
        T = null, E ? await E() : await me(!0);
      }
    })());
  }
  async function ke(E) {
    O && (T = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await z), E && await E(), t.changed();
  }
  const qe = () => ({
    fee: p().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ps.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function ln() {
    if (!(i != null && i.address)) return !1;
    if (P || (P = await t.tabLock(i.address)), !P)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const _r = {
    forceRefresh: () => me(!0),
    create: () => lt("Waiting for your passkey in the listening wallet…", async () => {
      const E = await Nt();
      await E.request("listening.unlock", { mode: "create", terms: qe() }), i = await E.request("listening.status"), B(!0), Et("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await ln();
    }),
    unlock: (E = !1) => {
      const j = () => lt("Waiting for your passkey in the listening wallet…", async () => cn(await Nt(), E));
      return O ? E ? A("cancel") ? (Et("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ke(async () => {
        (Ot() === "locked" || Ot() === "intro") && await j();
      }) : z : j();
    },
    link: () => lt("Waiting for your main wallet to sign…", async () => {
      const E = t.main();
      if (!E || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const j = (await t.links(E)).find((V) => V.listening === i.address);
      if (j)
        await s.request("listening.link", { main: E, issued: j.issued, mainSignature: j.mainSignature });
      else {
        const V = { main: E, listening: i.address, issued: t.now() }, F = await t.signWithMain(E, W6(V)), yt = await s.request("listening.link", { main: E, issued: V.issued, mainSignature: F });
        await t.saveLink({ ...V, mainSignature: F, listeningSignature: yt.listeningSignature }), $ = -1 / 0;
      }
      Et("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => lt("Waiting for your main wallet to approve the deposit…", async () => {
      const E = t.main();
      if (!E || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (at()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Dt(!0);
      const j = yh(o ?? 0n);
      if (j <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      I = await t.deposit(E, i.address, j), I && ft({ txid: I, amount: j.toString(), at: t.now() }), Et("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => lt("Confirm in the listening wallet…", async () => {
      await ln(), await s.request("listening.approveSession", qe()), B(!0), Et("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => lt("Clearing…", async () => {
      for (const E of Lt())
        await t.chain.transaction(E.txid) || Y({ ...E, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Et("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => lt("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), B(!1), Et("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => lt("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Et("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (E) => lt("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (X().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: j, nonce: V } = await t.chain.account(i.address);
      o = j;
      const F = await s.request("listening.prepareReturn", { mode: E, balance: j.toString(), nonce: V.toString(), fee: B6.toString() });
      if (F.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const yt = Fl(F.raw);
      if (en(yt.payload.recipient).value !== i.linked || String(yt.payload.amount) !== F.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const xt = {
        id: bh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: F.recipient,
        amount: F.amount,
        fee: F.fee,
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: F.raw,
        txid: F.txid
      };
      t.validate(xt), Y(xt);
      try {
        await t.chain.broadcast(F.raw, F.txid), Y({ ...xt, status: "pending" });
      } catch (mt) {
        throw Y({ ...xt, status: "unknown", note: mt.message }), mt;
      }
      E === "all" && B(!1), Et(E === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function Z(E) {
    if (!(l || c || f || u)) {
      l = !0;
      try {
        if (await me(), Ot() !== "ready" || !m() || !(i != null && i.session) || i.session.playsLeft < 1 || !P || X().length) return;
        R || (await t.chain.verify(), R = !0);
        const V = i.address, { balance: F, nonce: yt } = await t.chain.account(V);
        o = F, a = t.now();
        const xt = await t.chain.owner(La, E.song);
        if (xt === V || xt === t.main()) return;
        const mt = await s.request("listening.signPlay", {
          core: La,
          song: E.song,
          receipt: E.id,
          fee: p().toString(),
          nonce: yt.toString(),
          balance: F.toString()
        }), re = {
          id: E.id,
          address: V,
          kind: "play",
          core: La,
          song: E.song,
          recipient: xt,
          amount: "50",
          fee: p().toString(),
          nonce: yt.toString(),
          created: t.now(),
          status: "signed",
          raw: mt.raw,
          txid: mt.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...E.title ? { title: String(E.title).slice(0, 120) } : {},
          ...E.artist ? { artist: String(E.artist).slice(0, 120) } : {}
        };
        t.validate(re), Y(re);
        const We = E.title ? `“${E.title}”${E.artist ? ` by ${E.artist}` : ""}` : `song #${E.song}`;
        try {
          await t.chain.broadcast(mt.raw, mt.txid), Y({ ...re, status: "pending" }), y = `Paid play sent for ${We}.`, w = "";
        } catch (Zt) {
          Y({ ...re, status: jr(Zt) ? "failed" : "unknown", note: Zt.message, ...jr(Zt) ? { raw: void 0 } : {} }), w = Zt.message;
        }
        i = await s.request("listening.status");
      } catch (j) {
        y = "This song played free: " + (j instanceof Error ? j.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  function At(E) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ot()) || A("like") ? !1 : (de(E), !0);
  }
  async function de(E) {
    const j = E.title ? `“${E.title}”` : `song #${E.song}`, V = (Zt) => {
      var Me;
      w = Zt, y = "";
      try {
        (Me = t.likeFailed) == null || Me.call(t, E.song);
      } catch {
      }
      t.changed();
    }, F = Ot(), yt = t.main();
    if (F === "locked") {
      g = { ...E, at: t.now() }, Et(`Unlock to like ${j}: tap “Unlock and keep paying” in the listening wallet box. The like is sent straight after.`);
      return;
    }
    if (F === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (F === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (F === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (F !== "ready" || !yt) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!P) return V("Pay-per-play is running in another tab. Like from that tab.");
    const xt = W().find((Zt) => Zt.kind === "like" && Zt.song === E.song);
    if (xt && wh.includes(xt.status))
      return V(`Your last like for ${j} is still on its way. It can change again once it confirms.`);
    if (f) return V("One like at a time: your last one is still being sent.");
    if ((xt == null ? void 0 : xt.status) === "confirmed" && t.now() - (xt.confirmedAt ?? 0) < X6)
      return V(`Your like for ${j} has only just confirmed. Try again in a moment.`);
    let mt;
    u = !0;
    try {
      mt = t.likeState ? (await t.likeState(yt, E.song)).by : E.likedBy ?? [];
    } catch {
      mt = E.likedBy;
    } finally {
      u = !1;
    }
    if (!mt) return V(`Could not check ${j} right now. Try the heart again.`);
    const re = i.address, We = mt.includes(re);
    if (!We && mt.length) return V(`${j} was liked from your main wallet${mt.includes(yt) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await si({ song: E.song, liked: !We, title: E.title, artist: E.artist });
  }
  async function si(E) {
    var F, yt, xt;
    if (f) {
      Et("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const j = E.title ? `“${E.title}”${E.artist ? ` by ${E.artist}` : ""}` : `song #${E.song}`, V = t.wait ?? ((mt) => new Promise((re) => setTimeout(re, mt)));
    try {
      Et(`Sending your ${E.liked ? "like" : "unlike"} for ${j} from the listening wallet…`);
      const mt = t.now() + 12e4;
      for (; l || X().length; ) {
        if (t.now() > mt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await me(!0);
      }
      if (Ot() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const re = i.address, { balance: We, nonce: Zt } = await t.chain.account(re);
      o = We, a = t.now();
      const Me = await s.request("listening.signLike", {
        song: E.song,
        liked: E.liked,
        fee: gh.toString(),
        nonce: Zt.toString(),
        balance: We.toString()
      }), Tr = {
        id: bh(),
        address: re,
        kind: "like",
        core: 0,
        song: E.song,
        liked: E.liked,
        recipient: "",
        amount: "0",
        fee: gh.toString(),
        nonce: Zt.toString(),
        created: t.now(),
        status: "signed",
        raw: Me.raw,
        txid: Me.txid,
        ...E.title ? { title: String(E.title).slice(0, 120) } : {},
        ...E.artist ? { artist: String(E.artist).slice(0, 120) } : {}
      };
      t.validate(Tr), Y(Tr);
      try {
        await t.chain.broadcast(Me.raw, Me.txid), Y({ ...Tr, status: "pending" }), y = `${E.liked ? "Liked" : "Unliked"} ${j} from your listening wallet, for your main wallet (0.0002 STX).`, w = "";
        try {
          (F = t.likeSent) == null || F.call(t, E.song, E.liked);
        } catch {
        }
      } catch (Vn) {
        if (Y({ ...Tr, status: jr(Vn) ? "failed" : "unknown", note: Vn.message, ...jr(Vn) ? { raw: void 0 } : {} }), w = Vn.message, jr(Vn)) try {
          (yt = t.likeFailed) == null || yt.call(t, E.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (mt) {
      w = "Like not sent: " + (mt instanceof Error ? mt.message : "the listening wallet is unavailable");
      try {
        (xt = t.likeFailed) == null || xt.call(t, E.song);
      } catch {
      }
    } finally {
      f = !1, t.changed();
    }
  }
  return { snapshot: Vt, refresh: me, onListened: Z, heart: At, toggleLike: de, ..._r };
}
const bo = ["Connect", "Passkey", "Link & fund", "Listen"];
function Q6(t) {
  const e = bo.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function J6(t, e) {
  return !e || e.at >= bo.length || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const t5 = {}, e5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, n5 = (t) => {
  const e = t5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, r5 = (t) => `/hiro/${t}`, s5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, i5 = (t) => {
  const e = n5(t);
  if (e)
    return [s5(e)];
  const n = e5[t];
  return typeof window < "u" ? [`${window.location.origin}${r5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, o5 = {}, xh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, a5 = "xtrata.log.enabled", c5 = "xtrata.log.level", l5 = "xtrata.log.tags", u5 = "xtrata.log.dedupe", Ni = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, f5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, h5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, d5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, p5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, g5 = () => {
  const t = o5 ?? {}, e = Ni(a5) ?? t.VITE_LOG_ENABLED, n = Ni(c5) ?? t.VITE_LOG_LEVEL, r = Ni(l5) ?? t.VITE_LOG_TAGS, s = Ni(u5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: f5(e),
    level: h5(n) ?? "warn",
    tags: p5(r),
    dedupe: d5(s)
  };
}, y5 = (t, e, n) => !t.enabled || xh[n] < xh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), w5 = (t, e, n, r) => {
  const s = g5();
  if (!y5(s, e, t) || x5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, b5 = /* @__PURE__ */ new Set();
let mh = null;
const x5 = (t, e, n, r, s) => (mh !== t && (b5.clear(), mh = t), !1), m5 = (t, e, n) => w5("debug", t, e, n), S5 = {}, E5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, A5 = (t) => {
  const e = S5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : E5[t];
}, $5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, I5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return $5.test(n) ? n : null;
}, v5 = (t) => t.replace(/\/+$/, ""), L5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Sh = (t) => {
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
}, Fr = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, C5 = (t) => {
  var c, l;
  let e;
  try {
    e = en(NA(t));
  } catch {
    return null;
  }
  const n = Fr(e);
  if (!n || n.success === !1)
    return null;
  const r = Fr(n.value), s = Fr(r == null ? void 0 : r.value), i = Fr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Sh((c = Fr(i.name)) == null ? void 0 : c.value), a = Sh((l = Fr(i.namespace)) == null ? void 0 : l.value);
  return !o || !a ? null : I5(`${o}.${a}`);
}, B5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${v5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Up(wp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : C5(i.result);
}, k5 = async (t) => {
  const e = t.address.trim();
  if (!Us(e))
    return null;
  const n = A5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of i5(t.network))
    try {
      return await B5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return m5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: L5(r)
  }), null;
}, Eh = Object.freeze({
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
function M5(t, e = "") {
  return Object.hasOwn(Eh, String(t)) ? Eh[String(t)] : e;
}
const Ah = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function _5(t, e = "") {
  return Object.hasOwn(Ah, String(t)) ? Ah[String(t)] : e;
}
const $h = document.getElementById("ppp");
$h && T5($h);
function T5(t) {
  const e = vy(), n = (p) => t.querySelector(p), r = n(".ppp-frame");
  let s = null;
  const i = async (p, A) => {
    const U = await fetch(p, { cache: "no-store", ...A, signal: AbortSignal.timeout(15e3) }), W = await U.json().catch(() => ({}));
    if (!U.ok) throw new Error((W == null ? void 0 : W.error) || `Request failed (${U.status}).`);
    return W;
  }, o = Z6({
    now: Date.now,
    main: () => {
      const p = e.load();
      return p.isConnected && p.network === "mainnet" ? p.address : void 0;
    },
    config: (p) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(p || "")),
    links: async (p) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(p))).links ?? [],
    saveLink: async (p) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
    },
    bridge: async (p) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${p}; publickey-credentials-create ${p}`), s.referrerPolicy = "no-referrer";
      const A = new Promise((m, B) => {
        s.addEventListener("load", () => m(), { once: !0 }), setTimeout(() => B(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = p + "/", r.replaceChildren(s), await A;
      const U = new wy({ walletOrigin: p, frame: s, timeoutMs: 30 * 6e4 }), W = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), Y = (m, B) => W.has(m) ? U.request(m, B) : Promise.race([
        U.request(m, B),
        new Promise((X, at) => setTimeout(() => at(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await Y("listening.status"), { request: Y };
    },
    chain: {
      verify: D6,
      balance: F6,
      account: j6,
      owner: z6,
      broadcast: R6,
      transaction: G6,
      confirmedNonce: async (p) => {
        const A = await ds(`/v2/accounts/${p}?proof=0`);
        if (!Number.isSafeInteger(A == null ? void 0 : A.nonce) || A.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(A.nonce);
      }
    },
    signWithMain: (p, A) => C6({ ...A, network: "mainnet", stxAddress: p }),
    deposit: (p, A, U) => new Promise((W, Y) => A6({
      recipient: A,
      amount: U.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: p,
      network: new vh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (m) => W(m.txId || ""),
      onCancel: () => Y(new Error("Deposit cancelled. Nothing was sent.")),
      onError: Y
    })),
    validate: V6,
    tabLock: (p) => new Promise((A) => {
      const U = navigator.locks;
      if (!(U != null && U.request)) {
        A(!0);
        return;
      }
      U.request("xtrata-ppp:" + p, { ifAvailable: !0 }, async (W) => {
        A(!!W), W && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (p) => {
        try {
          return localStorage.getItem(p);
        } catch {
          return null;
        }
      },
      set: (p, A) => {
        try {
          localStorage.setItem(p, A);
        } catch {
        }
      }
    },
    changed: () => v(o.snapshot()),
    likesChanged: () => {
      var p, A;
      (A = (p = window.XtrataRadio) == null ? void 0 : p.refreshLikes) == null || A.call(p);
    },
    likeState: async (p, A) => {
      const U = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: p, ids: String(A) })), W = Array.isArray(U == null ? void 0 : U.rows) ? U.rows.find((Y) => (Y == null ? void 0 : Y.id) === A) : null;
      if (!W || typeof W.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: W.liked, by: Array.isArray(W.by) ? W.by.filter((Y) => typeof Y == "string") : W.liked ? [p] : [] };
    },
    likeSent: (p, A) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: p, liked: A } })),
    likeFailed: (p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: p } }))
  });
  window.XtrataRadioLikeHandler = (p) => {
    if (!p || !Number.isSafeInteger(p.song) || p.song < 0) return !1;
    L();
    const A = $(p.song, { title: p.title, artist: p.artist });
    return o.heart({ song: p.song, title: A.title || void 0, artist: A.artist || void 0, likedBy: Array.isArray(p.likedBy) ? p.likedBy : void 0 });
  };
  const a = (p) => p ? p.slice(0, 6) + "…" + p.slice(-4) : "", c = (p) => `https://explorer.hiro.so/txid/${p}?chain=mainnet`, l = (p, A = "", U = "") => {
    const W = document.createElement(p);
    return A && (W.textContent = A), U && (W.className = U), W;
  }, f = (p, A, U = "") => {
    const W = l("button", p, U);
    return W.type = "button", W.onclick = A, W;
  }, u = (p, A) => {
    const U = l("a", p);
    return U.href = A, U.target = "_blank", U.rel = "noopener", U;
  };
  let g = null, h = !1;
  const y = /* @__PURE__ */ new Map(), w = (p) => p ? (y.has(p) || (y.set(p, null), k5({ address: p, network: "mainnet" }).then((A) => {
    A && (y.set(p, A), v(o.snapshot()));
  }).catch(() => {
  })), y.get(p) ?? null) : null, I = (p) => {
    const A = w(p);
    return A ? `${A} · ${a(p)}` : a(p);
  }, k = /* @__PURE__ */ new Map();
  let M = !1;
  const b = (p) => !p || /^(?:Inscription )?#\d+$/.test(p.trim()), L = () => {
    M || (M = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((p) => p.ok ? p.json() : null).then((p) => {
      for (const A of Array.isArray(p == null ? void 0 : p.tracks) ? p.tracks : []) {
        const U = Number(A == null ? void 0 : A.id);
        Number.isSafeInteger(U) && k.set(U, { title: typeof A.title == "string" ? A.title : void 0, artist: typeof A.artist == "string" ? A.artist : void 0 });
      }
      v(o.snapshot());
    }).catch(() => {
      M = !1;
    }));
  }, $ = (p, A) => {
    const U = k.get(p), W = _5(p, [U == null ? void 0 : U.title, A == null ? void 0 : A.title].find((m) => !b(m)) || ""), Y = M5(p, (U == null ? void 0 : U.artist) || (A == null ? void 0 : A.artist) || "");
    return { title: W, artist: Y };
  }, H = (p) => {
    const { title: A, artist: U } = $(p.song, p);
    return A ? `“${A}”${U ? ` — ${U}` : ""}` : `Song #${p.song}${U ? ` — ${U}` : ""}`;
  }, R = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, P = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function O(p) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(p.step) ? ["", ""] : p.step === "over" ? ["OVER 1 STX", "bad"] : p.step === "locked" ? ["LOCKED", "mute"] : p.step === "intro" || p.step === "link" ? ["", ""] : p.step === "fund" ? p.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : p.payingOn && p.session && p.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function x(p, A, U = "", W) {
    const Y = l("dt", p), m = l("dd", A, U);
    return W && m.append(" ", W), [Y, m];
  }
  function v(p) {
    var ke, qe, ln, _r;
    if (t.hidden = p.step === "off", t.hidden) return;
    const [A, U] = O(p), W = n(".ppp-state");
    W.textContent = A, W.className = "ppp-state" + (U ? " ppp-state--" + U : ""), W.hidden = !A;
    const Y = !!p.busy || p.armed, m = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(p.step) && (Y || !["intro", "loading"].includes(p.step));
    r.hidden = !m, r.classList.toggle("ppp-frame--rest", !Y && !h);
    const B = n(".ppp-frame-label");
    B.hidden = !m || !Y && !h, B.replaceChildren(l("span", Y ? "Listening wallet · tap the button in this box" : "Listening wallet box"));
    const X = Q6(p) ?? g;
    g = X;
    const at = J6(p, X);
    n(".ppp-badge").hidden = !at;
    const ft = n(".ppp-steps"), Lt = n(".ppp-stage");
    ft.hidden = Lt.hidden = !at, X && at && (ft.replaceChildren(...bo.map((Z, At) => {
      const de = l("li", "", At < X.at ? "done" : At === X.at ? X.blocked ? "now blocked" : "now" : "");
      return de.append(l("span", At < X.at ? "✓" : String(At + 1), "n"), Z), At === X.at && de.setAttribute("aria-current", "step"), de;
    })), Lt.textContent = X.caption, Lt.className = "ppp-stage " + (X.at >= bo.length ? "ppp-ok" : X.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ot = n(".ppp-facts"), Vt = [];
    if (p.main && ((ke = p.gate) != null && ke.here) && Vt.push(...x("Your wallet", I(p.main), "ppp-addr-short")), p.listening) {
      const Z = f("Copy", () => {
        var At;
        return void ((At = navigator.clipboard) == null ? void 0 : At.writeText(p.listening || ""));
      }, "tiny");
      Vt.push(...x("Listening wallet", a(p.listening), "ppp-addr-short", Z));
    }
    if (p.listening && p.step !== "intro" && Vt.push(...p.linked ? x("Linked to", `${I(p.linked)} · returns go here`, p.linked === p.main ? "ppp-ok" : "ppp-warn") : x("Linked to", "not linked yet", "ppp-warn")), p.linkedListening.length && ((qe = p.gate) != null && qe.here)) {
      const Z = p.linkedListening.map((At) => a(At) + (At === p.listening ? " (this one)" : "")).join(", ");
      Vt.push(...x(p.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (p.balance !== void 0 && ["fund", "ready", "over"].includes(p.step)) {
      const Z = p.balanceState === "ok" ? "ppp-ok" : p.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Vt.push(...x("Balance", `${Se(p.balance)} STX · about ${p.playsLeft.toLocaleString()} plays`, Z));
    }
    const Et = p.entries.find((Z) => Z.kind === "play");
    Et && L(), Et && Vt.push(...x("Last paid song", `${H(Et)} → ${a(Et.recipient)}`, R[Et.status] || "")), Ot.replaceChildren(...Vt), Ot.hidden = !Vt.length;
    const lt = [], Nt = [], Dt = [], he = [], Rn = qo(BigInt(((ln = p.gate) == null ? void 0 : ln.limits.playFee) ?? "300")), me = `Each song you listen to for 30 seconds sends ${Se(kc)} STX to whoever holds it, plus a ${Se(Rn - kc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, cn = !!p.busy;
    switch (p.step) {
      case "elsewhere": {
        if (lt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain.")), (_r = p.gate) != null && _r.radioUrl) {
          const Z = l("p");
          Z.append(u("Open the pay-per-play radio →", p.gate.radioUrl)), lt.push(Z);
        }
        Nt.push(l("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        lt.push(l("p", "Connect your wallet above to pay artists a tiny amount for each song you listen to for 30 seconds.")), Nt.push(l("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "not-invited":
        lt.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        lt.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        lt.push(l("p", `Pay ${Se(Rn)} STX for each song you listen to for 30 seconds, automatically, from a small wallet on this device.`)), Nt.push(l("p", me)), Nt.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Nt.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), Dt.push(f("Turn on pay-per-play", () => void o.create(), "primary")), Dt.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        p.armed ? lt.push(l("p", `Tap “${p.payingOn ? "Unlock and keep paying" : "Unlock with passkey"}” below. It goes straight to your passkey.`, "ppp-cyan")) : (lt.push(l("p", p.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", p.payingOn ? "" : "ppp-mute")), Dt.push(f(p.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), he.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        lt.push(l("p", p.serverLinked ? `Confirm your main wallet ${I(p.main)} in the listening wallet box.` : `Link to your main wallet ${I(p.main)}: one signature, no fee.`)), Nt.push(l("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Nt.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Dt.push(f(p.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        lt.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (p.entries.length ? lt.push(l("p", "Out of funds: songs play free until you top up. Paying carries on by itself once the top-up confirms.", "ppp-bad")) : lt.push(l("p", `Add up to ${Se(p.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / Rn)).toLocaleString()} paid plays.`)), p.payingOn && !p.entries.length && Nt.push(l("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), Nt.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), p.depositPending && p.depositTxid) {
          const Z = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          Z.append(u("View", c(p.depositTxid))), lt.push(Z);
        } else p.allowance > 0n && Dt.push(f(`Deposit ${Se(p.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        lt.push(l("p", `Over 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${I(p.linked)}.`, "ppp-bad")), Dt.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (p.payingOn && p.session && p.session.playsLeft > 0) {
          const Z = Math.min(p.session.playsLeft, p.playsLeft);
          lt.push(l("p", `Paying as you listen · up to ${Z.toLocaleString()} plays left`, "ppp-ok")), Nt.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Dt.push(f("Switch off", () => void o.switchOff()));
        } else
          lt.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), Dt.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        p.balanceState === "low" && lt.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), p.depositPending ? lt.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : p.allowance > 0n && p.balanceState !== "ok" && Dt.push(f(`Top up ${Se(p.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (p.walletOutdated && Nt.push(l("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), p.stuck && (lt.push(l("p", p.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${p.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Dt.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(p.step) && p.linked && (p.balance ?? 0n) > 0n && he.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(p.step) && he.push(f("Lock", () => void o.lock(), "quiet")), m && !Y && he.push(f(h ? "Hide listening wallet box" : "Show listening wallet box", () => {
      h = !h, v(o.snapshot());
    }, "quiet")), [...Dt, ...he].forEach((Z) => Z.disabled = cn), cn && (Dt.length = 0), p.balance !== void 0 && ["fund", "ready", "over"].includes(p.step)) {
      const Z = p.balanceState === "ok" ? "ppp-ok" : p.balanceState === "low" ? "ppp-warn" : "ppp-bad", At = lt.at(0);
      p.step === "ready" && At ? At.append(l("span", ` · ${Se(p.balance)} STX`, Z)) : lt.push(l("p", `Balance ${Se(p.balance)} STX`, Z));
    }
    n(".ppp-key").replaceChildren(...lt), n(".ppp-body").replaceChildren(...Nt), n(".ppp-actions").replaceChildren(...Dt), n(".ppp-actions2").replaceChildren(...he), n(".ppp-msg").textContent = p.busy || p.message, n(".ppp-err").textContent = p.error;
    const Gn = n(".ppp-history");
    Gn.hidden = !p.entries.length, n(".ppp-wallets").hidden = !(Nt.length || Ot.childElementCount || he.length || p.entries.length), p.entries.length && L(), Gn.replaceChildren(l("summary", `Payments, likes and returns (${p.entries.length})`), ...p.entries.slice(0, 20).map((Z) => {
      const At = l("div", "", "ppp-row"), de = Z.kind === "play" ? [l("span", H(Z), "ppp-song"), l("span", ` · ${Se(BigInt(Z.amount))} STX to ${a(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [l("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${H(Z)}`, "ppp-song"), l("span", ` · for ${I(p.linked)}`, "ppp-mute")] : [l("span", `Returned ${Se(BigInt(Z.amount))} STX`, "ppp-song"), l("span", ` to ${a(Z.recipient)}`, "ppp-mute")];
      return At.append(
        l("span", P[Z.status] || Z.status, "ppp-status " + (R[Z.status] || "")),
        ...de,
        l("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && At.append(u("tx ↗", c(Z.txid))), At;
    }));
  }
  const T = /* @__PURE__ */ new Map(), z = () => {
    const p = window.XtrataRadio;
    return p != null && p.subscribe ? (p.subscribe((A) => {
      const U = A == null ? void 0 : A.nowPlaying;
      U && Number.isSafeInteger(Number(U.tokenId)) && T.set(Number(U.tokenId), { title: U.title || void 0, artist: U.artist || void 0 });
    }), !0) : !1;
  };
  if (!z()) {
    const p = setInterval(() => {
      z() && clearInterval(p);
    }, 500);
    setTimeout(() => clearInterval(p), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (p) => {
    const A = p.detail;
    if (A && Number.isSafeInteger(A.song) && typeof A.id == "string" && /^[0-9a-f]{32}$/.test(A.id)) {
      L();
      const U = $(A.song, T.get(A.song));
      o.onListened({ song: A.song, id: A.id, title: U.title || void 0, artist: U.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const U5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", H5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, N5 = () => H5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, P5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, O5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Jp = class {
  constructor(t) {
    Z4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && wx(t), this.callback(_o(t));
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
    var r, s, i, o, a, c, l, f, u, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (g = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = N5(), e = P5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Q("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Q("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Q("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Q("div", { class: "flex flex-col space-y-[10px]" }, Q("div", { class: "flex items-center" }, Q("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Q("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Q("span", { class: "sr-only" }, "Close popup"), Q("img", { src: U5 }))), r ? Q("p", null, "Select the wallet you want to connect to.") : Q("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Q("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Q("div", { class: "mt-6" }, Q("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Q("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Q("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Q("div", { class: "aspect-square basis-9 overflow-hidden" }, Q("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Q("div", { class: "flex-1" }, Q("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Q("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Q("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Q("div", { class: "mt-6" }, r ? Q("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Q("div", { class: "mb-5 flex justify-between" }, Q("p", { class: "text-sm font-medium" }, "Recommended wallets"), Q("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Q("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Q("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Q("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Q("p", null, "What is a wallet? ", Q("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Q("ul", { class: "space-y-3" }, n.map((i) => Q("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Q("div", { class: "aspect-square basis-9 overflow-hidden" }, Q("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Q("div", { class: "flex-1" }, Q("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Q("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Q("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return _4(this);
  }
};
Jp.style = O5;
const D5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Jp
}, Symbol.toStringTag, { value: "Module" }));
