var ny = Object.defineProperty;
var ry = (t, e, n) => e in t ? ny(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var $s = (t, e, n) => ry(t, typeof e != "symbol" ? e + "" : e, n);
var Wt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
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
      function s(m) {
        return m && DataView.prototype.isPrototypeOf(m);
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
        ], o = ArrayBuffer.isView || function(m) {
          return m && i.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function l(m) {
        var v = {
          next: function() {
            var T = m.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && (v[Symbol.iterator] = function() {
          return v;
        }), v;
      }
      function f(m) {
        this.map = {}, m instanceof f ? m.forEach(function(v, T) {
          this.append(T, v);
        }, this) : Array.isArray(m) ? m.forEach(function(v) {
          if (v.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + v.length);
          this.append(v[0], v[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(v) {
          this.append(v, m[v]);
        }, this);
      }
      f.prototype.append = function(m, v) {
        m = a(m), v = c(v);
        var T = this.map[m];
        this.map[m] = T ? T + ", " + v : v;
      }, f.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, f.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, f.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, f.prototype.set = function(m, v) {
        this.map[a(m)] = c(v);
      }, f.prototype.forEach = function(m, v) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && m.call(v, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var m = [];
        return this.forEach(function(v, T) {
          m.push(T);
        }), l(m);
      }, f.prototype.values = function() {
        var m = [];
        return this.forEach(function(v) {
          m.push(v);
        }), l(m);
      }, f.prototype.entries = function() {
        var m = [];
        return this.forEach(function(v, T) {
          m.push([T, v]);
        }), l(m);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function p(m) {
        return new Promise(function(v, T) {
          m.onload = function() {
            v(m.result);
          }, m.onerror = function() {
            T(m.error);
          };
        });
      }
      function h(m) {
        var v = new FileReader(), T = p(v);
        return v.readAsArrayBuffer(m), T;
      }
      function w(m) {
        var v = new FileReader(), T = p(v), R = /charset=([A-Za-z0-9_-]+)/.exec(m.type), Y = R ? R[1] : "utf-8";
        return v.readAsText(m, Y), T;
      }
      function b(m) {
        for (var v = new Uint8Array(m), T = new Array(v.length), R = 0; R < v.length; R++)
          T[R] = String.fromCharCode(v[R]);
        return T.join("");
      }
      function I(m) {
        if (m.slice)
          return m.slice(0);
        var v = new Uint8Array(m.byteLength);
        return v.set(new Uint8Array(m)), v.buffer;
      }
      function k() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = I(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = I(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = u(this);
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
            var m = u(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var m = u(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return w(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(b(this._bodyArrayBuffer));
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
      function x(m) {
        var v = m.toUpperCase();
        return M.indexOf(v) > -1 ? v : m;
      }
      function L(m, v) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        v = v || {};
        var T = v.body;
        if (m instanceof L) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, v.headers || (this.headers = new f(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !T && m._bodyInit != null && (T = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = v.credentials || this.credentials || "same-origin", (v.headers || !this.headers) && (this.headers = new f(v.headers)), this.method = x(v.method || this.method || "GET"), this.mode = v.mode || this.mode || null, this.signal = v.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && (v.cache === "no-store" || v.cache === "no-cache")) {
          var R = /([?&])_=[^&]*/;
          if (R.test(this.url))
            this.url = this.url.replace(R, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function A(m) {
        var v = new FormData();
        return m.trim().split("&").forEach(function(T) {
          if (T) {
            var R = T.split("="), Y = R.shift().replace(/\+/g, " "), j = R.join("=").replace(/\+/g, " ");
            v.append(decodeURIComponent(Y), decodeURIComponent(j));
          }
        }), v;
      }
      function U(m) {
        var v = new f(), T = m.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(R) {
          return R.indexOf(`
`) === 0 ? R.substr(1, R.length) : R;
        }).forEach(function(R) {
          var Y = R.split(":"), j = Y.shift().trim();
          if (j) {
            var Nt = Y.join(":").trim();
            try {
              v.append(j, Nt);
            } catch (g) {
              console.warn("Response " + g.message);
            }
          }
        }), v;
      }
      k.call(L.prototype);
      function z(m, v) {
        if (!(this instanceof z))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (v || (v = {}), this.type = "default", this.status = v.status === void 0 ? 200 : v.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = v.statusText === void 0 ? "" : "" + v.statusText, this.headers = new f(v.headers), this.url = v.url || "", this._initBody(m);
      }
      k.call(z.prototype), z.prototype.clone = function() {
        return new z(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, z.error = function() {
        var m = new z(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var N = [301, 302, 303, 307, 308];
      z.redirect = function(m, v) {
        if (N.indexOf(v) === -1)
          throw new RangeError("Invalid status code");
        return new z(null, { status: v, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(v, T) {
          this.message = v, this.name = T;
          var R = Error(v);
          this.stack = R.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function P(m, v) {
        return new Promise(function(T, R) {
          var Y = new L(m, v);
          if (Y.signal && Y.signal.aborted)
            return R(new e.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function Nt() {
            j.abort();
          }
          j.onload = function() {
            var y = {
              statusText: j.statusText,
              headers: U(j.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? y.status = 200 : y.status = j.status, y.url = "responseURL" in j ? j.responseURL : y.headers.get("X-Request-URL");
            var $ = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              T(new z($, y));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              R(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              R(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              R(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function g(y) {
            try {
              return y === "" && n.location.href ? n.location.href : y;
            } catch {
              return y;
            }
          }
          if (j.open(Y.method, g(Y.url), !0), Y.credentials === "include" ? j.withCredentials = !0 : Y.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), v && typeof v.headers == "object" && !(v.headers instanceof f || n.Headers && v.headers instanceof n.Headers)) {
            var C = [];
            Object.getOwnPropertyNames(v.headers).forEach(function(y) {
              C.push(a(y)), j.setRequestHeader(y, c(v.headers[y]));
            }), Y.headers.forEach(function(y, $) {
              C.indexOf($) === -1 && j.setRequestHeader($, y);
            });
          } else
            Y.headers.forEach(function(y, $) {
              j.setRequestHeader($, y);
            });
          Y.signal && (Y.signal.addEventListener("abort", Nt), j.onreadystatechange = function() {
            j.readyState === 4 && Y.signal.removeEventListener("abort", Nt);
          }), j.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return P.polyfill = !0, n.fetch || (n.fetch = P, n.Headers = f, n.Request = L, n.Response = z), e.Headers = f, e.Request = L, e.Response = z, e.fetch = P, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Wt);
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
var Xr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xr || (Xr = {}));
var ar;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ar || (ar = {}));
var ru;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ru || (ru = {}));
const cy = "https://api.mainnet.hiro.so", ly = "https://api.testnet.hiro.so", uy = "http://localhost:3999", fy = ["mainnet", "testnet", "devnet", "mocknet"];
let Zr = class {
  constructor(e) {
    this.version = ar.Mainnet, this.chainId = Xr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ar.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
Zr.fromName = (t) => {
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
Zr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Zr.fromName(t);
let vh = class extends Zr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Mainnet, this.chainId = Xr.Mainnet;
  }
}, hy = class extends Zr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Testnet, this.chainId = Xr.Testnet;
  }
}, Lh = class extends Zr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ar.Testnet, this.chainId = Xr.Testnet;
  }
};
const dy = Lh, Ch = "xtrata.wallet.bridge.v1", py = (t) => typeof t == "object" && t !== null && t.protocol === Ch, gy = (t) => py(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", yy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Is extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const su = 12e4;
class wy {
  constructor(e) {
    $s(this, "pending", /* @__PURE__ */ new Map());
    $s(this, "listenTarget");
    $s(this, "closed", !1);
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
    $s(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !gy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Is("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Is("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Is("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = yy(), i = { protocol: Ch, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Is(
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
      clearTimeout(e.timer), e.reject(new Is("CLOSED", "Bridge client closed before the reply arrived."));
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
}, Ar = {
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
Object.freeze(Ar);
class gs extends Error {
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
class My extends gs {
  constructor(e, n = "") {
    super({ code: Ar.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ou extends gs {
  constructor(e = "") {
    super({ code: Ar.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class li extends gs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ar.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class au extends gs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ar.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ca extends gs {
  constructor(e) {
    super({ code: Ar.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mh extends gs {
  constructor(e) {
    super({ code: Ar.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const cu = ["debug", "info", "warn", "error", "none"], Ba = {};
for (let t = 0; t < cu.length; t++) {
  const e = cu[t];
  Ba[e] = t;
}
class Gr {
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
    Gr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Ny(s, t.toString(), n);
    throw Gr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Rn(t, e) {
  return Uc(Rt(t), e);
}
function Rt(t) {
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
    return BigInt(`0x${W(t)}`);
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
function Xs(t, e = 8) {
  return (typeof t == "bigint" ? t : Rt(t)).toString(16).padStart(e * 2, "0");
}
function mo(t) {
  return parseInt(t, 16);
}
function Uc(t, e = 16) {
  const n = Xs(t, e);
  return ut(n);
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
  return jy(BigInt(`0x${W(t)}`), BigInt(t.byteLength * 8));
}
function jy(t, e) {
  return Dy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Fy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fy[n];
  return e;
}
function ut(t) {
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
function $r(t) {
  return new TextEncoder().encode(t);
}
function Zs(t) {
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
function je(...t) {
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
  return je(...t.map((e) => typeof e == "number" ? uu([e]) : e instanceof Array ? uu(e) : e));
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
  const e = typeof t == "string" ? ut(t) : t;
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
function cr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Jy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tw(t, e) {
  const n = {};
  return Object.assign(n, Jy, e), await fetch(t, n);
}
function ew(t) {
  let e = tw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nw(...t) {
  const { fetchLib: e, middlewares: n } = ew(t);
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
function rw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Nh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ma(t.outputLen), Ma(t.blockLen);
}
function iw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ow(t, e) {
  Nh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qn = {
  number: Ma,
  bool: rw,
  bytes: Nh,
  hash: sw,
  exists: iw,
  output: ow
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ke = (t, e) => t << 32 - e | t >>> e, aw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!aw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nc(t) {
  if (typeof t == "string" && (t = cw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ph = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ir(t) {
  const e = (r) => t().update(Nc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Oh = class extends Ph {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qn.hash(e);
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
const So = (t, e, n) => new Oh(t, e).update(n).digest();
So.create = (t, e) => new Oh(t, e);
function lw(t, e, n, r) {
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
    Qn.exists(this);
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
    Qn.exists(this), Qn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    lw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const uw = (t, e, n) => t & e ^ ~t & n, fw = (t, e, n) => t & e ^ t & n ^ e & n, hw = new Uint32Array([
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
let Dh = class extends Pc {
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
      const p = pn[u - 15], h = pn[u - 2], w = ke(p, 7) ^ ke(p, 18) ^ p >>> 3, b = ke(h, 17) ^ ke(h, 19) ^ h >>> 10;
      pn[u] = b + pn[u - 7] + w + pn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = ke(a, 6) ^ ke(a, 11) ^ ke(a, 25), h = f + p + uw(a, c, l) + hw[u] + pn[u] | 0, b = (ke(r, 2) ^ ke(r, 13) ^ ke(r, 22)) + fw(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    pn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, dw = class extends Dh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Qr = Ir(() => new Dh());
Ir(() => new dw());
const pw = {}, jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const lt = BigInt(0), At = BigInt(1), Dn = BigInt(2), ks = BigInt(3), fu = BigInt(8), pt = Object.freeze({
  a: lt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: At,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), hu = (t, e) => (t + e / Dn) / e, ui = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = pt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -At * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = hu(i * t, e), c = hu(-r * t, e);
    let l = H(t - a * n - c * s, e), f = H(-a * r - c * i, e);
    const u = l > o, p = f > o;
    if (u && (l = e - l), p && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: p, k2: f };
  }
}, Ie = 32, lr = 32, Fh = 32, Ki = Ie + 1, qi = 2 * Ie + 1;
function du(t) {
  const { a: e, b: n } = pt, r = H(t * t), s = H(r * t);
  return H(s + e * t + n);
}
const fi = pt.a === lt;
class Oc extends Error {
  constructor(e) {
    super(e);
  }
}
function pu(t) {
  if (!(t instanceof ht))
    throw new TypeError("JacobianPoint expected");
}
class ht {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof it))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(it.ZERO) ? ht.ZERO : new ht(e.x, e.y, At);
  }
  static toAffineBatch(e) {
    const n = xw(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ht.toAffineBatch(e).map(ht.fromAffine);
  }
  equals(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = H(s * s), l = H(a * a), f = H(n * l), u = H(i * c), p = H(H(r * a) * l), h = H(H(o * s) * c);
    return f === u && p === h;
  }
  negate() {
    return new ht(this.x, H(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = H(e * e), i = H(n * n), o = H(i * i), a = e + i, c = H(Dn * (H(a * a) - s - o)), l = H(ks * s), f = H(l * l), u = H(f - Dn * c), p = H(l * (c - u) - fu * o), h = H(Dn * n * r);
    return new ht(u, p, h);
  }
  add(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === lt || o === lt)
      return this;
    if (n === lt || r === lt)
      return e;
    const c = H(s * s), l = H(a * a), f = H(n * l), u = H(i * c), p = H(H(r * a) * l), h = H(H(o * s) * c), w = H(u - f), b = H(h - p);
    if (w === lt)
      return b === lt ? this.double() : ht.ZERO;
    const I = H(w * w), k = H(w * I), M = H(f * I), x = H(b * b - k - Dn * M), L = H(b * (M - x) - p * k), A = H(s * a * w);
    return new ht(x, L, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ht.ZERO;
    if (typeof e == "bigint" && e === lt)
      return n;
    let r = wu(e);
    if (r === At)
      return this;
    if (!fi) {
      let u = n, p = this;
      for (; r > lt; )
        r & At && (u = u.add(p)), p = p.double(), r >>= At;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ui.splitScalar(r), c = n, l = n, f = this;
    for (; i > lt || a > lt; )
      i & At && (c = c.add(f)), a & At && (l = l.add(f)), f = f.double(), i >>= At, a >>= At;
    return s && (c = c.negate()), o && (l = l.negate()), l = new ht(H(l.x * ui.beta), l.y, l.z), c.add(l);
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
    !n && this.equals(ht.BASE) && (n = it.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && _a.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ht.normalizeZ(s), _a.set(n, s)));
    let i = ht.ZERO, o = ht.BASE;
    const a = 1 + (fi ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let p = 0; p < a; p++) {
      const h = p * c;
      let w = Number(e & l);
      e >>= u, w > c && (w -= f, e += At);
      const b = h, I = h + Math.abs(w) - 1, k = p % 2 !== 0, M = w < 0;
      w === 0 ? o = o.add(hi(k, s[b])) : i = i.add(hi(M, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = wu(e), s, i;
    if (fi) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = ui.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p, f: h } = this.wNAF(l, n);
      f = hi(o, f), p = hi(c, p), p = new ht(H(p.x * ui.beta), p.y, p.z), s = f.add(p), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ht.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ht.ZERO);
    e == null && (e = i ? fu : ys(s));
    const o = e, a = H(o * o), c = H(a * o), l = H(n * a), f = H(r * c), u = H(s * o);
    if (i)
      return it.ZERO;
    if (u !== At)
      throw new Error("invZ was invalid");
    return new it(l, f);
  }
}
ht.BASE = new ht(pt.Gx, pt.Gy, At);
ht.ZERO = new ht(lt, At, lt);
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
    return this.y % Dn === lt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = fe(n ? e : e.subarray(1));
    if (!Pi(r))
      throw new Error("Point is not on curve");
    const s = du(r);
    let i = bw(s);
    const o = (i & At) === At;
    n ? o && (i = H(-i)) : (e[0] & 1) === 1 !== o && (i = H(-i));
    const a = new it(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = fe(e.subarray(1, Ie + 1)), r = fe(e.subarray(Ie + 1, Ie * 2 + 1)), s = new it(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Fe(e), r = n.length, s = n[0];
    if (r === Ie)
      return this.fromCompressedHex(n);
    if (r === Ki && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === qi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ki} compressed bytes or ${qi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return it.BASE.multiply(ur(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Gh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Dc(Fe(e)), { n: a } = pt, c = r === 2 || r === 3 ? s + a : s, l = ys(c, a), f = H(-o * l, a), u = H(i * l, a), p = r & 1 ? "03" : "02", h = it.fromHex(p + jn(c)), w = it.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return Fn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = jn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${jn(this.y)}`;
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
    const s = H(r * r), i = du(n);
    if (H(s - i) !== lt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new it(this.x, H(-this.y));
  }
  double() {
    return ht.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ht.fromAffine(this).add(ht.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ht.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ht.fromAffine(this), i = n === lt || n === At || this !== it.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ht.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ht.ZERO) ? void 0 : a.toAffine();
  }
}
it.BASE = new it(pt.Gx, pt.Gy);
it.ZERO = new it(lt, lt);
function gu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function yu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Jr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: fe(n), left: t.subarray(e + 2) };
}
function gw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Jr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = yu(t.subarray(2)), { data: r, left: s } = yu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Jr(s)}`);
  return { r: e, s: r };
}
class ue {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Jr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ue(Wi(s.slice(0, 64)), Wi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = gw(n ? e : Fn(e));
    return new ue(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!es(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!es(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = pt.n >> At;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ue(this.r, H(-this.s, pt.n)) : this;
  }
  toDERRawBytes() {
    return Fn(this.toDERHex());
  }
  toDERHex() {
    const e = gu(vs(this.s)), n = gu(vs(this.r)), r = e.length / 2, s = n.length / 2, i = vs(r), o = vs(s);
    return `30${vs(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Fn(this.toCompactHex());
  }
  toCompactHex() {
    return jn(this.r) + jn(this.s);
  }
}
function Pn(...t) {
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
const yw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Jr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += yw[t[n]];
  return e;
}
const ww = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function jn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(lt <= t && t < ww))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ts(t) {
  const e = Fn(jn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function vs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Wi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Fn(t) {
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
function fe(t) {
  return Wi(Jr(t));
}
function Fe(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Fn(t);
}
function wu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && es(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function H(t, e = pt.P) {
  const n = t % e;
  return n >= lt ? n : e + n;
}
function de(t, e) {
  const { P: n } = pt;
  let r = t;
  for (; e-- > lt; )
    r *= r, r %= n;
  return r;
}
function bw(t) {
  const { P: e } = pt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = de(l, ks) * l % e, u = de(f, ks) * l % e, p = de(u, Dn) * c % e, h = de(p, r) * p % e, w = de(h, s) * h % e, b = de(w, o) * w % e, I = de(b, a) * b % e, k = de(I, o) * w % e, M = de(k, ks) * l % e, x = de(M, i) * h % e, L = de(x, n) * c % e, A = de(L, Dn);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function ys(t, e = pt.P) {
  if (t === lt || e <= lt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = H(t, e), r = e, s = lt, i = At;
  for (; n !== lt; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== At)
    throw new Error("invert: does not exist");
  return H(s, e);
}
function xw(t, e = pt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === lt ? i : (n[a] = i, H(i * o, e)), At), s = ys(r, e);
  return t.reduceRight((i, o, a) => o === lt ? i : (n[a] = H(i * n[a], e), H(i * o, e)), s), n;
}
function mw(t) {
  const e = t.length * 8 - lr * 8, n = fe(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Dc(t, e = !1) {
  const n = mw(t);
  if (e)
    return n;
  const { n: r } = pt;
  return n >= r ? n - r : n;
}
let Yr, Ms;
class zh {
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
    return Ms(this.k, ...e);
  }
  checkSync() {
    if (typeof Ms != "function")
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
    return Pn(...n);
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
    return Pn(...n);
  }
}
function es(t) {
  return lt < t && t < pt.n;
}
function Pi(t) {
  return lt < t && t < pt.P;
}
function Rh(t, e, n, r = !0) {
  const { n: s } = pt, i = Dc(t, !0);
  if (!es(i))
    return;
  const o = ys(i, s), a = it.BASE.multiply(i), c = H(a.x, s);
  if (c === lt)
    return;
  const l = H(o * H(e + n * c, s), s);
  if (l === lt)
    return;
  let f = new ue(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & At);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function ur(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * lr)
      throw new Error("Expected 32 bytes of private key");
    e = Wi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== lr)
      throw new Error("Expected 32 bytes of private key");
    e = fe(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!es(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function jc(t) {
  return t instanceof it ? (t.assertValidity(), t) : it.fromHex(t);
}
function Gh(t) {
  if (t instanceof ue)
    return t.assertValidity(), t;
  try {
    return ue.fromDER(t);
  } catch {
    return ue.fromCompact(t);
  }
}
function Qs(t, e = !1) {
  return it.fromPrivateKey(t).toRawBytes(e);
}
function Sw(t, e, n, r = !1) {
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
  return r.assertValidity(), r.multiply(ur(t)).toRawBytes(n);
}
function Vh(t) {
  const e = t.length > Ie ? t.slice(0, Ie) : t;
  return fe(e);
}
function Ew(t) {
  const e = Vh(t), n = H(e, pt.n);
  return Kh(n < lt ? e : n);
}
function Kh(t) {
  return ts(t);
}
function qh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Fe(t), s = ur(e), i = [Kh(s), Ew(r)];
  if (n != null) {
    n === !0 && (n = Mt.randomBytes(Ie));
    const c = Fe(n);
    if (c.length !== Ie)
      throw new Error(`sign: Expected ${Ie} bytes of extra data`);
    i.push(c);
  }
  const o = Pn(...i), a = Vh(r);
  return { seed: o, m: a, d: s };
}
function Wh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Aw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, lr);
  await o.reseed(r);
  let a;
  for (; !(a = Rh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Wh(a, n);
}
function Eo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, lr);
  o.reseedSync(r);
  let a;
  for (; !(a = Rh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Wh(a, n);
}
const $w = { strict: !0 };
function Iw(t, e, n, r = $w) {
  let s;
  try {
    s = Gh(t), e = Fe(e);
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
  const { n: l } = pt, f = ys(o, l), u = H(a * f, l), p = H(i * f, l), h = it.BASE.multiplyAndAddUnsafe(c, u, p);
  return h ? H(h.x, l) === i : !1;
}
function Yi(t) {
  return H(fe(t), pt.n);
}
class ns {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Fe(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = fe(n.subarray(0, 32)), s = fe(n.subarray(32, 64));
    return new ns(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Pi(e) || !es(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return jn(this.r) + jn(this.s);
  }
  toRawBytes() {
    return Fn(this.toHex());
  }
}
function vw(t) {
  return it.fromPrivateKey(t).toRawX();
}
class Yh {
  constructor(e, n, r = Mt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Fe(e);
    const { x: s, scalar: i } = this.getScalar(ur(n));
    if (this.px = s, this.d = i, this.rand = Fe(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = it.fromPrivateKey(e), r = n.hasEvenY() ? e : pt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ts(e ^ fe(n));
  }
  finalizeNonce(e) {
    const n = H(fe(e), pt.n);
    if (n === lt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new ns(e.x, H(n + r * s, pt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Mt.taggedHash, o = this.initNonce(n, await i(Nn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Nn.nonce, o, r, e)), f = Yi(await i(Nn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await Qh(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Mt.taggedHashSync, o = this.initNonce(n, i(Nn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Nn.nonce, o, r, e)), f = Yi(i(Nn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return Jh(u, e, r) || this.error(), u;
  }
}
async function Lw(t, e, n) {
  return new Yh(t, e, n).calc();
}
function Cw(t, e, n) {
  return new Yh(t, e, n).calcSync();
}
function Xh(t, e, n) {
  const r = t instanceof ns, s = r ? t : ns.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Fe(e),
    P: jc(n)
  };
}
function Zh(t, e, n, r) {
  const s = it.BASE.multiplyAndAddUnsafe(e, ur(n), H(-r, pt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Qh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Yi(await Mt.taggedHash(Nn.challenge, ts(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Jh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Yi(Mt.taggedHashSync(Nn.challenge, ts(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch (r) {
    if (r instanceof Oc)
      throw r;
    return !1;
  }
}
const Bw = {
  Signature: ns,
  getPublicKey: vw,
  sign: Lw,
  verify: Qh,
  signSync: Cw,
  verifySync: Jh
};
it.BASE._setWindowSize(8);
const ie = {
  node: jh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Nn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, di = {}, Mt = {
  bytesToHex: Jr,
  hexToBytes: Fn,
  concatBytes: Pn,
  mod: H,
  invert: ys,
  isValidPrivateKey(t) {
    try {
      return ur(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ts,
  _normalizePrivateKey: ur,
  hashToPrivateKey: (t) => {
    t = Fe(t);
    const e = lr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = H(fe(t), pt.n - At) + At;
    return ts(n);
  },
  randomBytes: (t = 32) => {
    if (ie.web)
      return ie.web.getRandomValues(new Uint8Array(t));
    if (ie.node) {
      const { randomBytes: e } = ie.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Mt.hashToPrivateKey(Mt.randomBytes(lr + 8)),
  precompute(t = 8, e = it.BASE) {
    const n = e === it.BASE ? e : new it(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ks), n;
  },
  sha256: async (...t) => {
    if (ie.web) {
      const e = await ie.web.subtle.digest("SHA-256", Pn(...t));
      return new Uint8Array(e);
    } else if (ie.node) {
      const { createHash: e } = ie.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ie.web) {
      const n = await ie.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Pn(...e), s = await ie.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ie.node) {
      const { createHmac: n } = ie.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = di[t];
    if (n === void 0) {
      const r = await Mt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pn(r, r), di[t] = n;
    }
    return Mt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Yr != "function")
      throw new Oc("sha256Sync is undefined, you need to set it");
    let n = di[t];
    if (n === void 0) {
      const r = Yr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pn(r, r), di[t] = n;
    }
    return Yr(n, ...e);
  },
  _JacobianPoint: ht
};
Object.defineProperties(Mt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Yr;
    },
    set(t) {
      Yr || (Yr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ms;
    },
    set(t) {
      Ms || (Ms = t);
    }
  }
});
const kw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: pt,
  Point: it,
  Signature: ue,
  getPublicKey: Qs,
  getSharedSecret: Fc,
  recoverPublicKey: Sw,
  schnorr: Bw,
  sign: Aw,
  signSync: Eo,
  utils: Mt,
  verify: Iw
}, Symbol.toStringTag, { value: "Module" }));
var Js = {};
Js.byteLength = Hw;
var Mw = Js.toByteArray = Pw, _w = Js.fromByteArray = jw, He = [], ge = [], Tw = typeof Uint8Array < "u" ? Uint8Array : Array, aa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Dr = 0, Uw = aa.length; Dr < Uw; ++Dr)
  He[Dr] = aa[Dr], ge[aa.charCodeAt(Dr)] = Dr;
ge[45] = 62;
ge[95] = 63;
function td(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Hw(t) {
  var e = td(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Nw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Pw(t) {
  var e, n = td(t), r = n[0], s = n[1], i = new Tw(Nw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ge[t.charCodeAt(c)] << 18 | ge[t.charCodeAt(c + 1)] << 12 | ge[t.charCodeAt(c + 2)] << 6 | ge[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ge[t.charCodeAt(c)] << 2 | ge[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ge[t.charCodeAt(c)] << 10 | ge[t.charCodeAt(c + 1)] << 4 | ge[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Ow(t) {
  return He[t >> 18 & 63] + He[t >> 12 & 63] + He[t >> 6 & 63] + He[t & 63];
}
function Dw(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Ow(r));
  return s.join("");
}
function jw(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Dw(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    He[e >> 2] + He[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    He[e >> 10] + He[e >> 4 & 63] + He[e << 2 & 63] + "="
  )), s.join("");
}
function Fw() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const zw = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Rw() {
  if (Fw())
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
    throw new Error(zw);
  }
}
class Gw {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(je(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(je(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Vw {
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
  const t = await Rw();
  return t.name === "subtleCrypto" ? new Vw(t.lib) : new Gw(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Kw(t) {
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
    for (var w = 0, b = 0, I = 0, k = h.length; I !== k && h[I] === 0; )
      I++, w++;
    for (var M = (k - I) * l + 1 >>> 0, x = new Uint8Array(M); I !== k; ) {
      for (var L = h[I], A = 0, U = M - 1; (L !== 0 || A < b) && U !== -1; U--, A++)
        L += 256 * x[U] >>> 0, x[U] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      b = A, I++;
    }
    for (var z = M - b; z !== M && x[z] === 0; )
      z++;
    for (var N = a.repeat(w); z < M; ++z)
      N += t.charAt(x[z]);
    return N;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var w = 0, b = 0, I = 0; h[w] === a; )
      b++, w++;
    for (var k = (h.length - w) * c + 1 >>> 0, M = new Uint8Array(k); h[w]; ) {
      var x = h.charCodeAt(w);
      if (x > 255)
        return;
      var L = e[x];
      if (L === 255)
        return;
      for (var A = 0, U = k - 1; (L !== 0 || A < I) && U !== -1; U--, A++)
        L += o * M[U] >>> 0, M[U] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      I = A, w++;
    }
    for (var z = k - I; z !== k && M[z] === 0; )
      z++;
    for (var N = new Uint8Array(b + (k - z)), P = b; z !== k; )
      N[P++] = M[z++];
    return N;
  }
  function p(h) {
    var w = u(h);
    if (w)
      return w;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: p
  };
}
var nd = Kw;
const qw = nd, Ww = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Yw = qw(Ww);
const Xw = /* @__PURE__ */ Ih(Yw), Zw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rd = Uint8Array.from({ length: 16 }, (t, e) => e), Qw = rd.map((t) => (9 * t + 5) % 16);
let zc = [rd], Rc = [Qw];
for (let t = 0; t < 4; t++)
  for (let e of [zc, Rc])
    e.push(e[t].map((n) => Zw[n]));
const sd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Jw = zc.map((t, e) => t.map((n) => sd[e][n])), t1 = Rc.map((t, e) => t.map((n) => sd[e][n])), e1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), n1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pi = (t, e) => t << e | t >>> 32 - e;
function xu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const gi = new Uint32Array(16);
let r1 = class extends Pc {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, b = e1[h], I = n1[h], k = zc[h], M = Rc[h], x = Jw[h], L = t1[h];
      for (let A = 0; A < 16; A++) {
        const U = pi(r + xu(h, i, a, l) + gi[k[A]] + b, x[A]) + u | 0;
        r = u, u = l, l = pi(a, 10) | 0, a = i, i = U;
      }
      for (let A = 0; A < 16; A++) {
        const U = pi(s + xu(w, o, c, f) + gi[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = pi(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    gi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const s1 = Ir(() => new r1());
function i1(t) {
  return s1(t);
}
const yi = BigInt(2 ** 32 - 1), Ta = BigInt(32);
function id(t, e = !1) {
  return e ? { h: Number(t & yi), l: Number(t >> Ta & yi) } : { h: Number(t >> Ta & yi) | 0, l: Number(t & yi) | 0 };
}
function o1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = id(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const a1 = (t, e) => BigInt(t >>> 0) << Ta | BigInt(e >>> 0), c1 = (t, e, n) => t >>> n, l1 = (t, e, n) => t << 32 - n | e >>> n, u1 = (t, e, n) => t >>> n | e << 32 - n, f1 = (t, e, n) => t << 32 - n | e >>> n, h1 = (t, e, n) => t << 64 - n | e >>> n - 32, d1 = (t, e, n) => t >>> n - 32 | e << 64 - n, p1 = (t, e) => e, g1 = (t, e) => t, y1 = (t, e, n) => t << n | e >>> 32 - n, w1 = (t, e, n) => e << n | t >>> 32 - n, b1 = (t, e, n) => e << n - 32 | t >>> 64 - n, x1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function m1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const S1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), E1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, A1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, I1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), v1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, J = {
  fromBig: id,
  split: o1,
  toBig: a1,
  shrSH: c1,
  shrSL: l1,
  rotrSH: u1,
  rotrSL: f1,
  rotrBH: h1,
  rotrBL: d1,
  rotr32H: p1,
  rotr32L: g1,
  rotlSH: y1,
  rotlSL: w1,
  rotlBH: b1,
  rotlBL: x1,
  add: m1,
  add3L: S1,
  add3H: E1,
  add4L: A1,
  add4H: $1,
  add5H: v1,
  add5L: I1
}, [L1, C1] = J.split([
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
let Ao = class extends Pc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: b, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      gn[x] = e.getUint32(n), yn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = gn[x - 15] | 0, A = yn[x - 15] | 0, U = J.rotrSH(L, A, 1) ^ J.rotrSH(L, A, 8) ^ J.shrSH(L, A, 7), z = J.rotrSL(L, A, 1) ^ J.rotrSL(L, A, 8) ^ J.shrSL(L, A, 7), N = gn[x - 2] | 0, P = yn[x - 2] | 0, m = J.rotrSH(N, P, 19) ^ J.rotrBH(N, P, 61) ^ J.shrSH(N, P, 6), v = J.rotrSL(N, P, 19) ^ J.rotrBL(N, P, 61) ^ J.shrSL(N, P, 6), T = J.add4L(z, v, yn[x - 7], yn[x - 16]), R = J.add4H(T, U, m, gn[x - 7], gn[x - 16]);
      gn[x] = R | 0, yn[x] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: b, Gl: I, Hh: k, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = J.rotrSH(u, p, 14) ^ J.rotrSH(u, p, 18) ^ J.rotrBH(u, p, 41), A = J.rotrSL(u, p, 14) ^ J.rotrSL(u, p, 18) ^ J.rotrBL(u, p, 41), U = u & h ^ ~u & b, z = p & w ^ ~p & I, N = J.add5L(M, A, z, C1[x], yn[x]), P = J.add5H(N, k, L, U, L1[x], gn[x]), m = N | 0, v = J.rotrSH(r, s, 28) ^ J.rotrBH(r, s, 34) ^ J.rotrBH(r, s, 39), T = J.rotrSL(r, s, 28) ^ J.rotrBL(r, s, 34) ^ J.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      k = b | 0, M = I | 0, b = h | 0, I = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = J.add(l | 0, f | 0, P | 0, m | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = J.add3L(m, T, Y);
      r = J.add3H(j, P, v, R), s = j | 0;
    }
    ({ h: r, l: s } = J.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = J.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = J.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = J.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = J.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = J.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: b, l: I } = J.add(this.Gh | 0, this.Gl | 0, b | 0, I | 0), { h: k, l: M } = J.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, b, I, k, M);
  }
  roundClean() {
    gn.fill(0), yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, B1 = class extends Ao {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, k1 = class extends Ao {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, M1 = class extends Ao {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const _1 = Ir(() => new Ao());
Ir(() => new B1());
Ir(() => new k1());
Ir(() => new M1());
function od(t) {
  return Qr(t);
}
function T1(t) {
  return _1(t);
}
const U1 = 0;
Mt.hmacSha256Sync = (t, ...e) => {
  const n = So.create(Qr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function H1() {
  return W(Mt.randomPrivateKey());
}
function N1(t) {
  const e = Qr(Qr(t));
  return Xw.encode(je(t, e).slice(0, t.length + 4));
}
function P1(t, e) {
  return N1(je(new Uint8Array([t]), e.slice(0, 20)));
}
function ad(t, e = U1) {
  const n = typeof t == "string" ? ut(t) : t, r = i1(od(n));
  return P1(e, r);
}
function cd(t) {
  const e = Hc(t);
  return W(Qs(e.slice(0, 32), !0));
}
Mt.hmacSha256Sync = (t, ...e) => {
  const n = So.create(Qr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Xi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Xi || (Xi = {}));
async function O1(t, e, n) {
  return await (await ed()).encrypt("aes-256-cbc", e, t, n);
}
async function D1(t, e, n) {
  return await (await ed()).decrypt("aes-256-cbc", e, t, n);
}
function ld(t, e) {
  return So(Qr, t, e);
}
function j1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function ud(t) {
  const e = T1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function F1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function z1(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !F1(t))
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
async function R1(t, e, n, r) {
  const s = z1(t);
  if (!s.result)
    throw s;
  const i = Mt.randomPrivateKey(), o = Qs(i, !0);
  let a = Fc(i, t, !0);
  a = a.slice(1);
  const c = ud(a), l = Mt.randomBytes(16), f = await O1(l, c.encryptionKey, e), u = je(l, o, f), p = ld(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = W(f);
  else if (r === "base64")
    h = _w(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const w = {
    iv: W(l),
    ephemeralPK: W(o),
    cipherText: h,
    mac: W(p),
    wasString: n
  };
  return r && r !== "hex" && (w.cipherTextEncoding = r), w;
}
async function fd(t, e) {
  if (!e.ephemeralPK)
    throw new au("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Fc(t, n, !0);
  r = r.slice(1);
  const s = ud(r), i = ut(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ut(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Mw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = je(i, ut(n), o), c = ld(s.hmacKey, a), l = ut(e.mac);
  if (!j1(l, c))
    throw new au("Decryption failed: failure in MAC check");
  const f = await D1(i, s.encryptionKey, o);
  return e.wasString ? Zs(f) : f;
}
function G1(t, e) {
  const n = typeof e == "string" ? $r(e) : e, r = cd(t), s = od(n), i = Eo(s, t);
  return {
    signature: W(i),
    publicKey: r
  };
}
async function V1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = cd(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? $r(t) : t, o = await R1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = G1(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function K1(t, e) {
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
var Ft = {}, rs = {}, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.decode = Kt.encode = Kt.unescape = Kt.escape = Kt.pad = void 0;
const hd = Js;
function Gc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Kt.pad = Gc;
function dd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Kt.escape = dd;
function pd(t) {
  return Gc(t).replace(/-/g, "+").replace(/_/g, "/");
}
Kt.unescape = pd;
function q1(t) {
  return dd((0, hd.fromByteArray)(new TextEncoder().encode(t)));
}
Kt.encode = q1;
function W1(t) {
  return new TextDecoder().decode((0, hd.toByteArray)(Gc(pd(t))));
}
Kt.decode = W1;
var $o = {}, Io = {}, gd = {}, yd = {}, vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.crypto = void 0;
vo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = p, t.rotl = h, t.byteSwap = w, t.byteSwap32 = b, t.bytesToHex = M, t.hexToBytes = A, t.asyncLoop = z, t.utf8ToBytes = N, t.bytesToUtf8 = P, t.toBytes = m, t.kdfInputToBytes = v, t.concatBytes = T, t.checkOpts = R, t.createHasher = j, t.createOptHasher = Nt, t.createXOFer = g, t.randomBytes = C;
  const e = vo;
  function n(y) {
    return y instanceof Uint8Array || ArrayBuffer.isView(y) && y.constructor.name === "Uint8Array";
  }
  function r(y) {
    if (!Number.isSafeInteger(y) || y < 0)
      throw new Error("positive integer expected, got " + y);
  }
  function s(y, ...$) {
    if (!n(y))
      throw new Error("Uint8Array expected");
    if ($.length > 0 && !$.includes(y.length))
      throw new Error("Uint8Array expected of length " + $ + ", got length=" + y.length);
  }
  function i(y) {
    if (typeof y != "function" || typeof y.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(y.outputLen), r(y.blockLen);
  }
  function o(y, $ = !0) {
    if (y.destroyed)
      throw new Error("Hash instance has been destroyed");
    if ($ && y.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(y, $) {
    s(y);
    const V = $.outputLen;
    if (y.length < V)
      throw new Error("digestInto() expects output buffer of length at least " + V);
  }
  function c(y) {
    return new Uint8Array(y.buffer, y.byteOffset, y.byteLength);
  }
  function l(y) {
    return new Uint32Array(y.buffer, y.byteOffset, Math.floor(y.byteLength / 4));
  }
  function f(...y) {
    for (let $ = 0; $ < y.length; $++)
      y[$].fill(0);
  }
  function u(y) {
    return new DataView(y.buffer, y.byteOffset, y.byteLength);
  }
  function p(y, $) {
    return y << 32 - $ | y >>> $;
  }
  function h(y, $) {
    return y << $ | y >>> 32 - $ >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function w(y) {
    return y << 24 & 4278190080 | y << 8 & 16711680 | y >>> 8 & 65280 | y >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (y) => y : (y) => w(y), t.byteSwapIfBE = t.swap8IfBE;
  function b(y) {
    for (let $ = 0; $ < y.length; $++)
      y[$] = w(y[$]);
    return y;
  }
  t.swap32IfBE = t.isLE ? (y) => y : b;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", k = /* @__PURE__ */ Array.from({ length: 256 }, (y, $) => $.toString(16).padStart(2, "0"));
  function M(y) {
    if (s(y), I)
      return y.toHex();
    let $ = "";
    for (let V = 0; V < y.length; V++)
      $ += k[y[V]];
    return $;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(y) {
    if (y >= x._0 && y <= x._9)
      return y - x._0;
    if (y >= x.A && y <= x.F)
      return y - (x.A - 10);
    if (y >= x.a && y <= x.f)
      return y - (x.a - 10);
  }
  function A(y) {
    if (typeof y != "string")
      throw new Error("hex string expected, got " + typeof y);
    if (I)
      return Uint8Array.fromHex(y);
    const $ = y.length, V = $ / 2;
    if ($ % 2)
      throw new Error("hex string expected, got unpadded hex of length " + $);
    const X = new Uint8Array(V);
    for (let ot = 0, ft = 0; ot < V; ot++, ft += 2) {
      const Ht = L(y.charCodeAt(ft)), Ve = L(y.charCodeAt(ft + 1));
      if (Ht === void 0 || Ve === void 0) {
        const Ct = y[ft] + y[ft + 1];
        throw new Error('hex string expected, got non-hex character "' + Ct + '" at index ' + ft);
      }
      X[ot] = Ht * 16 + Ve;
    }
    return X;
  }
  const U = async () => {
  };
  t.nextTick = U;
  async function z(y, $, V) {
    let X = Date.now();
    for (let ot = 0; ot < y; ot++) {
      V(ot);
      const ft = Date.now() - X;
      ft >= 0 && ft < $ || (await (0, t.nextTick)(), X += ft);
    }
  }
  function N(y) {
    if (typeof y != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(y));
  }
  function P(y) {
    return new TextDecoder().decode(y);
  }
  function m(y) {
    return typeof y == "string" && (y = N(y)), s(y), y;
  }
  function v(y) {
    return typeof y == "string" && (y = N(y)), s(y), y;
  }
  function T(...y) {
    let $ = 0;
    for (let X = 0; X < y.length; X++) {
      const ot = y[X];
      s(ot), $ += ot.length;
    }
    const V = new Uint8Array($);
    for (let X = 0, ot = 0; X < y.length; X++) {
      const ft = y[X];
      V.set(ft, ot), ot += ft.length;
    }
    return V;
  }
  function R(y, $) {
    if ($ !== void 0 && {}.toString.call($) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(y, $);
  }
  class Y {
  }
  t.Hash = Y;
  function j(y) {
    const $ = (X) => y().update(m(X)).digest(), V = y();
    return $.outputLen = V.outputLen, $.blockLen = V.blockLen, $.create = () => y(), $;
  }
  function Nt(y) {
    const $ = (X, ot) => y(ot).update(m(X)).digest(), V = y({});
    return $.outputLen = V.outputLen, $.blockLen = V.blockLen, $.create = (X) => y(X), $;
  }
  function g(y) {
    const $ = (X, ot) => y(ot).update(m(X)).digest(), V = y({});
    return $.outputLen = V.outputLen, $.blockLen = V.blockLen, $.create = (X) => y(X), $;
  }
  t.wrapConstructor = j, t.wrapConstructorWithOpts = Nt, t.wrapXOFConstructorWithOpts = g;
  function C(y = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(y));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(y));
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
const jr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function wd(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ua(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function vr(t, ...e) {
  if (!wd(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Y1(t) {
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
  vr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function X1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Z1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Zi(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Oi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function me(t, e) {
  return t << 32 - e | t >>> e;
}
function Q1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Vc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Kc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const xd = Vc ? (t) => t : (t) => Kc(t), J1 = xd;
function md(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Kc(t[e]);
  return t;
}
const tb = Vc ? (t) => t : md, Sd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", eb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nb(t) {
  if (vr(t), Sd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += eb[t[n]];
  return e;
}
const Je = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function mu(t) {
  if (t >= Je._0 && t <= Je._9)
    return t - Je._0;
  if (t >= Je.A && t <= Je.F)
    return t - (Je.A - 10);
  if (t >= Je.a && t <= Je.f)
    return t - (Je.a - 10);
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
function ti(t) {
  return typeof t == "string" && (t = qc(t)), vr(t), t;
}
function ob(t) {
  return typeof t == "string" && (t = qc(t)), vr(t), t;
}
function ab(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    vr(s), e += s.length;
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
  const e = (r) => t().update(ti(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $d(t) {
  const e = (r, s) => t(s).update(ti(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Id(t) {
  const e = (r, s) => t(s).update(ti(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const lb = Lo, ub = $d, fb = Id;
function hb(t = 32) {
  if (jr && typeof jr.getRandomValues == "function")
    return jr.getRandomValues(new Uint8Array(t));
  if (jr && typeof jr.randomBytes == "function")
    return Uint8Array.from(jr.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Ad,
  abytes: vr,
  aexists: Ha,
  ahash: Y1,
  anumber: Ua,
  aoutput: bd,
  asyncLoop: sb,
  byteSwap: Kc,
  byteSwap32: md,
  byteSwapIfBE: J1,
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
  rotl: Q1,
  rotr: me,
  swap32IfBE: tb,
  swap8IfBE: xd,
  toBytes: ti,
  u32: Z1,
  u8: X1,
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
    Ha(this), e = ti(e), vr(e);
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
const wn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), bn = /* @__PURE__ */ Uint32Array.from([
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
]), xn = /* @__PURE__ */ new Uint32Array(64);
let Wc = class extends wb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = wn[0] | 0, this.B = wn[1] | 0, this.C = wn[2] | 0, this.D = wn[3] | 0, this.E = wn[4] | 0, this.F = wn[5] | 0, this.G = wn[6] | 0, this.H = wn[7] | 0;
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
      xn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = xn[u - 15], h = xn[u - 2], w = me(p, 7) ^ me(p, 18) ^ p >>> 3, b = me(h, 17) ^ me(h, 19) ^ h >>> 10;
      xn[u] = b + xn[u - 7] + w + xn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = me(a, 6) ^ me(a, 11) ^ me(a, 25), h = f + p + gb(a, c, l) + bb[u] + xn[u] | 0, b = (me(r, 2) ^ me(r, 13) ^ me(r, 22)) + yb(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Zi(xn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Zi(this.buffer);
  }
}, vd = class extends Wc {
  constructor() {
    super(28), this.A = bn[0] | 0, this.B = bn[1] | 0, this.C = bn[2] | 0, this.D = bn[3] | 0, this.E = bn[4] | 0, this.F = bn[5] | 0, this.G = bn[6] | 0, this.H = bn[7] | 0;
  }
};
const xb = /* @__PURE__ */ Lo(() => new Wc()), mb = /* @__PURE__ */ Lo(() => new vd()), Sb = Wc, Eb = xb, Ab = vd, $b = mb, Ib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Ab,
  SHA256: Sb,
  sha224: $b,
  sha256: Eb
}, Symbol.toStringTag, { value: "Module" })), Co = /* @__PURE__ */ xo(Ib), vb = /* @__PURE__ */ xo(kw);
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
ss.joseToDer = ss.derToJose = void 0;
const Ld = Js, Cd = Kt;
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
  const p = r - c, h = r - f, w = new Uint8Array(p + c + h + f);
  for (o = 0; o < p; ++o)
    w[o] = 0;
  w.set(n.subarray(l + Math.max(-p, 0), l + c), o), o = r;
  for (const b = o; o < b + h; ++o)
    w[o] = 0;
  return w.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, Cd.escape)((0, Ld.fromByteArray)(w));
}
ss.derToJose = Mb;
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
ss.joseToDer = _b;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.InvalidTokenError = an.MissingParametersError = void 0;
class Tb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
an.MissingParametersError = Tb;
class Ub extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
an.InvalidTokenError = Ub;
const ei = /* @__PURE__ */ xo(db);
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.SECP256K1Client = void 0;
const Hb = gd, Nb = Co, Di = vb, Eu = ss, Au = an, $u = ei;
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
var fr = {};
const Pb = /* @__PURE__ */ xo(jh);
var Ob = Wt && Wt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.hashSha256Async = fr.hashSha256 = void 0;
const Db = Co;
function Ud(t) {
  return (0, Db.sha256)(t);
}
fr.hashSha256 = Ud;
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
fr.hashSha256Async = jb;
var Fb = Wt && Wt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.TokenSigner = rs.createUnsecuredToken = void 0;
const Na = Kt, Iu = $o, zb = an, vu = fr;
function Pa(t, e) {
  const n = [], r = Na.encode(JSON.stringify(e));
  n.push(r);
  const s = Na.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Rb(t) {
  return Pa(t, { typ: "JWT", alg: "none" }) + ".";
}
rs.createUnsecuredToken = Rb;
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
rs.TokenSigner = Gb;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.TokenVerifier = void 0;
const Vb = Kt, Lu = $o, Kb = an, wi = fr;
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
const bi = Kt;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(rs, t), n(Bo, t), n(ko, t), n(an, t), n($o, t);
})(Ft);
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
  return H1();
}
function Jb(t, e, n, r = kh.slice(), s, i = _y().getTime(), o = {}) {
  const a = (h) => {
    const w = Tc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return w == null ? void 0 : w.origin;
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
  }), l = Ft.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = ad(l);
  return c.iss = Yb(f), new Ft.TokenSigner("ES256k", t).sign(c);
}
async function Cu(t, e) {
  const n = Zs(ut(e)), r = JSON.parse(n), s = await fd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function t2(t) {
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
function e2(t) {
  const e = Ft.decodeToken(t).payload;
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
function r2(t) {
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
class zn {
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
    return new zn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Nd {
  constructor(e) {
    if (e) {
      const n = new zn(e);
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
    super(e), this.sessionData || this.setSessionData(new zn({}));
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
    return this.setSessionData(new zn({})), !0;
  }
}
class Mu extends Nd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = By, !localStorage.getItem(this.key)) {
      const r = new zn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return zn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new zn({})), !0;
  }
}
var Ds;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ds || (Ds = {}));
var to;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(to || (to = {}));
Ds.Mainnet;
var sn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sn || (sn = {}));
var Pe;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pe || (Pe = {}));
sn.Mainnet;
const Pd = {
  chainId: Ds.Mainnet,
  transactionVersion: sn.Mainnet,
  peerNetworkId: to.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Pe.MainnetSingleSig,
    multiSig: Pe.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Oa = {
  chainId: Ds.Testnet,
  transactionVersion: sn.Testnet,
  peerNetworkId: to.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Pe.TestnetSingleSig,
    multiSig: Pe.TestnetMultiSig
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
var Se;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Se || (Se = {}));
const la = ["onChainOnly", "offChainOnly", "any"];
la[0] + "", Se.OnChainOnly, la[1] + "", Se.OffChainOnly, la[2] + "", Se.Any, Se.OnChainOnly + "", Se.OnChainOnly, Se.OffChainOnly + "", Se.OffChainOnly, Se.Any + "", Se.Any;
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
var nn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(nn || (nn = {}));
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
const Jn = {
  number: Da,
  bool: a2,
  bytes: Dd,
  hash: c2,
  exists: l2,
  output: u2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ua = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Me = (t, e) => t << 32 - e | t >>> e, f2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Lr(t) {
  const e = (r) => t().update(Yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fd = class extends jd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Jn.hash(e);
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
    Jn.exists(this);
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
    Jn.exists(this), Jn.output(e, this), this.finished = !0;
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
let Rd = class extends Xc {
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
    for (let u = 0; u < 16; u++, n += 4)
      Sn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Sn[u - 15], h = Sn[u - 2], w = Me(p, 7) ^ Me(p, 18) ^ p >>> 3, b = Me(h, 17) ^ Me(h, 19) ^ h >>> 10;
      Sn[u] = b + Sn[u - 7] + w + Sn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Me(a, 6) ^ Me(a, 11) ^ Me(a, 25), h = f + p + p2(a, c, l) + y2[u] + Sn[u] | 0, b = (Me(r, 2) ^ Me(r, 13) ^ Me(r, 22)) + g2(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Sn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, w2 = class extends Rd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Gd = Lr(() => new Rd());
Lr(() => new w2());
var Cr = {}, Zc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ei;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const w = n.indexOf(o[h]) >> l;
        let b = 0;
        h !== 0 && (b = n.indexOf(o[h - 1]));
        const I = 1 + l, k = b % (1 << I) << 5 - I, M = t.c32[w + k];
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
      for (let w = 0; w < h; w++)
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
    for (let b = o.length - 1; b >= 0; b--) {
      p === 4 && (f.unshift(n[u]), p = 0, u = 0);
      const k = (t.c32.indexOf(o[b]) << p) + u, M = n[k % 16];
      if (p += 1, u = k >> 4, u > 1 << p)
        throw new Error("Panic error in decoding.");
      f.unshift(M);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let b = 0; b < f.length && f[b] === "0"; b++)
      h++;
    f = f.slice(h - h % 2);
    let w = f.join("");
    for (let b = 0; b < l; b++)
      w = `00${w}`;
    if (a) {
      const b = a * 2 - w.length;
      for (let I = 0; I < b; I += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = i;
})(Zc);
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.c32checkDecode = hr.c32checkEncode = void 0;
const Ku = Co, qu = ei, _s = Zc;
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
  const r = Vd(`${n}${e}`), s = (0, _s.c32encode)(`${e}${r}`);
  return `${_s.c32[t]}${s}`;
}
hr.c32checkEncode = b2;
function x2(t) {
  t = (0, _s.c32normalize)(t);
  const e = (0, _s.c32decode)(t.slice(1)), n = t[0], r = _s.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Vd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
hr.c32checkDecode = x2;
var Kd = {}, is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
is.decode = is.encode = void 0;
const eo = Co, Wu = ei, qd = nd, Wd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function m2(t, e = "00") {
  const n = typeof t == "string" ? (0, Wu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Wu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...r, ...n])));
  return qd(Wd).encode([...r, ...n, ...s.slice(0, 4)]);
}
is.encode = m2;
function S2(t) {
  const e = qd(Wd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, eo.sha256)((0, eo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
is.decode = S2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = hr, n = is, r = ei;
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
    const p = n.decode(f), h = (0, r.bytesToHex)(p.data), w = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let b;
    return u < 0 ? (b = w, s[w] !== void 0 && (b = s[w])) : b = u, o(b, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const p = a(f), h = p[0], w = p[1];
    let b;
    u < 0 ? (b = h, i[h] !== void 0 && (b = i[h])) : b = u;
    let I = b.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(w, I);
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
  const n = hr;
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
})(Cr);
function E2(t, e) {
  switch (e = Od(e ?? Pd), t) {
    case nn.P2PKH:
      switch (e.transactionVersion) {
        case sn.Mainnet:
          return Pe.MainnetSingleSig;
        case sn.Testnet:
          return Pe.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case nn.P2SH:
    case nn.P2SHNonSequential:
    case nn.P2WPKH:
    case nn.P2WSH:
    case nn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case sn.Mainnet:
          return Pe.MainnetMultiSig;
        case sn.Testnet:
          return Pe.TestnetMultiSig;
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, b = L2[h], I = C2[h], k = Qc[h], M = Jc[h], x = I2[h], L = v2[h];
      for (let A = 0; A < 16; A++) {
        const U = xi(r + Yu(h, i, a, l) + mi[k[A]] + b, x[A]) + u | 0;
        r = u, u = l, l = xi(a, 10) | 0, a = i, i = U;
      }
      for (let A = 0; A < 16; A++) {
        const U = xi(s + Yu(w, o, c, f) + mi[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = xi(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    mi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const k2 = Lr(() => new B2()), Si = BigInt(2 ** 32 - 1), ja = BigInt(32);
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
].map((t) => BigInt(t))), En = new Uint32Array(80), An = new Uint32Array(80);
let Mo = class extends Xc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: b, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      En[x] = e.getUint32(n), An[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = En[x - 15] | 0, A = An[x - 15] | 0, U = tt.rotrSH(L, A, 1) ^ tt.rotrSH(L, A, 8) ^ tt.shrSH(L, A, 7), z = tt.rotrSL(L, A, 1) ^ tt.rotrSL(L, A, 8) ^ tt.shrSL(L, A, 7), N = En[x - 2] | 0, P = An[x - 2] | 0, m = tt.rotrSH(N, P, 19) ^ tt.rotrBH(N, P, 61) ^ tt.shrSH(N, P, 6), v = tt.rotrSL(N, P, 19) ^ tt.rotrBL(N, P, 61) ^ tt.shrSL(N, P, 6), T = tt.add4L(z, v, An[x - 7], An[x - 16]), R = tt.add4H(T, U, m, En[x - 7], En[x - 16]);
      En[x] = R | 0, An[x] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: b, Gl: I, Hh: k, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = tt.rotrSH(u, p, 14) ^ tt.rotrSH(u, p, 18) ^ tt.rotrBH(u, p, 41), A = tt.rotrSL(u, p, 14) ^ tt.rotrSL(u, p, 18) ^ tt.rotrBL(u, p, 41), U = u & h ^ ~u & b, z = p & w ^ ~p & I, N = tt.add5L(M, A, z, J2[x], An[x]), P = tt.add5H(N, k, L, U, Q2[x], En[x]), m = N | 0, v = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), T = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      k = b | 0, M = I | 0, b = h | 0, I = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = tt.add(l | 0, f | 0, P | 0, m | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = tt.add3L(m, T, Y);
      r = tt.add3H(j, P, v, R), s = j | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = tt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = tt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = tt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: b, l: I } = tt.add(this.Gh | 0, this.Gl | 0, b | 0, I | 0), { h: k, l: M } = tt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, b, I, k, M);
  }
  roundClean() {
    En.fill(0), An.fill(0);
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
Lr(() => new Mo());
Lr(() => new tx());
Lr(() => new ex());
Lr(() => new nx());
var no = { exports: {} };
no.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", p = "[object Map]", h = "[object Number]", w = "[object Object]", b = "[object Promise]", I = "[object RegExp]", k = "[object Set]", M = "[object String]", x = "[object Symbol]", L = "[object WeakMap]", A = "[object ArrayBuffer]", U = "[object DataView]", z = "[object Float32Array]", N = "[object Float64Array]", P = "[object Int8Array]", m = "[object Int16Array]", v = "[object Int32Array]", T = "[object Uint8Array]", R = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", j = "[object Uint32Array]", Nt = /[\\^$.*+?()[\]{}|]/g, g = /\w*$/, C = /^\[object .+?Constructor\]$/, y = /^(?:0|[1-9]\d*)$/, $ = {};
  $[i] = $[o] = $[A] = $[U] = $[a] = $[c] = $[z] = $[N] = $[P] = $[m] = $[v] = $[p] = $[h] = $[w] = $[I] = $[k] = $[M] = $[x] = $[T] = $[R] = $[Y] = $[j] = !0, $[l] = $[f] = $[L] = !1;
  var V = typeof Wt == "object" && Wt && Wt.Object === Object && Wt, X = typeof self == "object" && self && self.Object === Object && self, ot = V || X || Function("return this")(), ft = e && !e.nodeType && e, Ht = ft && !0 && t && !t.nodeType && t, Ve = Ht && Ht.exports === ft;
  function Ct(d, E) {
    return d.set(E[0], E[1]), d;
  }
  function Gt(d, E) {
    return d.add(E), d;
  }
  function Xt(d, E) {
    for (var B = -1, G = d ? d.length : 0; ++B < G && E(d[B], B, d) !== !1; )
      ;
    return d;
  }
  function Ce(d, E) {
    for (var B = -1, G = E.length, jt = d.length; ++B < G; )
      d[jt + B] = E[B];
    return d;
  }
  function gt(d, E, B, G) {
    for (var jt = -1, Qt = d ? d.length : 0; ++jt < Qt; )
      B = E(B, d[jt], jt, d);
    return B;
  }
  function Dt(d, E) {
    for (var B = -1, G = Array(d); ++B < d; )
      G[B] = E(B);
    return G;
  }
  function It(d, E) {
    return d == null ? void 0 : d[E];
  }
  function re(d) {
    var E = !1;
    if (d != null && typeof d.toString != "function")
      try {
        E = !!(d + "");
      } catch {
      }
    return E;
  }
  function un(d) {
    var E = -1, B = Array(d.size);
    return d.forEach(function(G, jt) {
      B[++E] = [jt, G];
    }), B;
  }
  function Ke(d, E) {
    return function(B) {
      return d(E(B));
    };
  }
  function qe(d) {
    var E = -1, B = Array(d.size);
    return d.forEach(function(G) {
      B[++E] = G;
    }), B;
  }
  var fn = Array.prototype, Tr = Function.prototype, We = Object.prototype, hn = ot["__core-js_shared__"], Ye = function() {
    var d = /[^.]+$/.exec(hn && hn.keys && hn.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Z = Tr.toString, S = We.hasOwnProperty, D = We.toString, K = RegExp(
    "^" + Z.call(S).replace(Nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), F = Ve ? ot.Buffer : void 0, yt = ot.Symbol, xt = ot.Uint8Array, mt = Ke(Object.getPrototypeOf, Object), se = Object.create, Xe = We.propertyIsEnumerable, Zt = fn.splice, Be = Object.getOwnPropertySymbols, Ur = F ? F.isBuffer : void 0, Kn = Ke(Object.keys, Object), Wo = Pr(ot, "DataView"), Es = Pr(ot, "Map"), Yo = Pr(ot, "Promise"), Xo = Pr(ot, "Set"), Zo = Pr(ot, "WeakMap"), As = Pr(Object, "create"), tg = Yn(Wo), eg = Yn(Es), ng = Yn(Yo), rg = Yn(Xo), sg = Yn(Zo), Gl = yt ? yt.prototype : void 0, Vl = Gl ? Gl.valueOf : void 0;
  function qn(d) {
    var E = -1, B = d ? d.length : 0;
    for (this.clear(); ++E < B; ) {
      var G = d[E];
      this.set(G[0], G[1]);
    }
  }
  function ig() {
    this.__data__ = As ? As(null) : {};
  }
  function og(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function ag(d) {
    var E = this.__data__;
    if (As) {
      var B = E[d];
      return B === r ? void 0 : B;
    }
    return S.call(E, d) ? E[d] : void 0;
  }
  function cg(d) {
    var E = this.__data__;
    return As ? E[d] !== void 0 : S.call(E, d);
  }
  function lg(d, E) {
    var B = this.__data__;
    return B[d] = As && E === void 0 ? r : E, this;
  }
  qn.prototype.clear = ig, qn.prototype.delete = og, qn.prototype.get = ag, qn.prototype.has = cg, qn.prototype.set = lg;
  function Ze(d) {
    var E = -1, B = d ? d.length : 0;
    for (this.clear(); ++E < B; ) {
      var G = d[E];
      this.set(G[0], G[1]);
    }
  }
  function ug() {
    this.__data__ = [];
  }
  function fg(d) {
    var E = this.__data__, B = ii(E, d);
    if (B < 0)
      return !1;
    var G = E.length - 1;
    return B == G ? E.pop() : Zt.call(E, B, 1), !0;
  }
  function hg(d) {
    var E = this.__data__, B = ii(E, d);
    return B < 0 ? void 0 : E[B][1];
  }
  function dg(d) {
    return ii(this.__data__, d) > -1;
  }
  function pg(d, E) {
    var B = this.__data__, G = ii(B, d);
    return G < 0 ? B.push([d, E]) : B[G][1] = E, this;
  }
  Ze.prototype.clear = ug, Ze.prototype.delete = fg, Ze.prototype.get = hg, Ze.prototype.has = dg, Ze.prototype.set = pg;
  function Hr(d) {
    var E = -1, B = d ? d.length : 0;
    for (this.clear(); ++E < B; ) {
      var G = d[E];
      this.set(G[0], G[1]);
    }
  }
  function gg() {
    this.__data__ = {
      hash: new qn(),
      map: new (Es || Ze)(),
      string: new qn()
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
  function xg(d, E) {
    return oi(this, d).set(d, E), this;
  }
  Hr.prototype.clear = gg, Hr.prototype.delete = yg, Hr.prototype.get = wg, Hr.prototype.has = bg, Hr.prototype.set = xg;
  function Nr(d) {
    this.__data__ = new Ze(d);
  }
  function mg() {
    this.__data__ = new Ze();
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
  function $g(d, E) {
    var B = this.__data__;
    if (B instanceof Ze) {
      var G = B.__data__;
      if (!Es || G.length < n - 1)
        return G.push([d, E]), this;
      B = this.__data__ = new Hr(G);
    }
    return B.set(d, E), this;
  }
  Nr.prototype.clear = mg, Nr.prototype.delete = Sg, Nr.prototype.get = Eg, Nr.prototype.has = Ag, Nr.prototype.set = $g;
  function Ig(d, E) {
    var B = ta(d) || Yg(d) ? Dt(d.length, String) : [], G = B.length, jt = !!G;
    for (var Qt in d)
      S.call(d, Qt) && !(jt && (Qt == "length" || Vg(Qt, G))) && B.push(Qt);
    return B;
  }
  function Kl(d, E, B) {
    var G = d[E];
    (!(S.call(d, E) && Xl(G, B)) || B === void 0 && !(E in d)) && (d[E] = B);
  }
  function ii(d, E) {
    for (var B = d.length; B--; )
      if (Xl(d[B][0], E))
        return B;
    return -1;
  }
  function vg(d, E) {
    return d && ql(E, ea(E), d);
  }
  function Qo(d, E, B, G, jt, Qt, Qe) {
    var Jt;
    if (G && (Jt = Qt ? G(d, jt, Qt, Qe) : G(d)), Jt !== void 0)
      return Jt;
    if (!ai(d))
      return d;
    var Jl = ta(d);
    if (Jl) {
      if (Jt = zg(d), !E)
        return Dg(d, Jt);
    } else {
      var Or = Wn(d), tu = Or == f || Or == u;
      if (Zg(d))
        return _g(d, E);
      if (Or == w || Or == i || tu && !Qt) {
        if (re(d))
          return Qt ? d : {};
        if (Jt = Rg(tu ? {} : d), !E)
          return jg(d, vg(Jt, d));
      } else {
        if (!$[Or])
          return Qt ? d : {};
        Jt = Gg(d, Or, Qo, E);
      }
    }
    Qe || (Qe = new Nr());
    var eu = Qe.get(d);
    if (eu)
      return eu;
    if (Qe.set(d, Jt), !Jl)
      var nu = B ? Fg(d) : ea(d);
    return Xt(nu || d, function(na, ci) {
      nu && (ci = na, na = d[ci]), Kl(Jt, ci, Qo(na, E, B, G, ci, d, Qe));
    }), Jt;
  }
  function Lg(d) {
    return ai(d) ? se(d) : {};
  }
  function Cg(d, E, B) {
    var G = E(d);
    return ta(d) ? G : Ce(G, B(d));
  }
  function Bg(d) {
    return D.call(d);
  }
  function kg(d) {
    if (!ai(d) || qg(d))
      return !1;
    var E = Ql(d) || re(d) ? K : C;
    return E.test(Yn(d));
  }
  function Mg(d) {
    if (!Yl(d))
      return Kn(d);
    var E = [];
    for (var B in Object(d))
      S.call(d, B) && B != "constructor" && E.push(B);
    return E;
  }
  function _g(d, E) {
    if (E)
      return d.slice();
    var B = new d.constructor(d.length);
    return d.copy(B), B;
  }
  function Jo(d) {
    var E = new d.constructor(d.byteLength);
    return new xt(E).set(new xt(d)), E;
  }
  function Tg(d, E) {
    var B = E ? Jo(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.byteLength);
  }
  function Ug(d, E, B) {
    var G = E ? B(un(d), !0) : un(d);
    return gt(G, Ct, new d.constructor());
  }
  function Hg(d) {
    var E = new d.constructor(d.source, g.exec(d));
    return E.lastIndex = d.lastIndex, E;
  }
  function Ng(d, E, B) {
    var G = E ? B(qe(d), !0) : qe(d);
    return gt(G, Gt, new d.constructor());
  }
  function Pg(d) {
    return Vl ? Object(Vl.call(d)) : {};
  }
  function Og(d, E) {
    var B = E ? Jo(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.length);
  }
  function Dg(d, E) {
    var B = -1, G = d.length;
    for (E || (E = Array(G)); ++B < G; )
      E[B] = d[B];
    return E;
  }
  function ql(d, E, B, G) {
    B || (B = {});
    for (var jt = -1, Qt = E.length; ++jt < Qt; ) {
      var Qe = E[jt], Jt = void 0;
      Kl(B, Qe, Jt === void 0 ? d[Qe] : Jt);
    }
    return B;
  }
  function jg(d, E) {
    return ql(d, Wl(d), E);
  }
  function Fg(d) {
    return Cg(d, ea, Wl);
  }
  function oi(d, E) {
    var B = d.__data__;
    return Kg(E) ? B[typeof E == "string" ? "string" : "hash"] : B.map;
  }
  function Pr(d, E) {
    var B = It(d, E);
    return kg(B) ? B : void 0;
  }
  var Wl = Be ? Ke(Be, Object) : ty, Wn = Bg;
  (Wo && Wn(new Wo(new ArrayBuffer(1))) != U || Es && Wn(new Es()) != p || Yo && Wn(Yo.resolve()) != b || Xo && Wn(new Xo()) != k || Zo && Wn(new Zo()) != L) && (Wn = function(d) {
    var E = D.call(d), B = E == w ? d.constructor : void 0, G = B ? Yn(B) : void 0;
    if (G)
      switch (G) {
        case tg:
          return U;
        case eg:
          return p;
        case ng:
          return b;
        case rg:
          return k;
        case sg:
          return L;
      }
    return E;
  });
  function zg(d) {
    var E = d.length, B = d.constructor(E);
    return E && typeof d[0] == "string" && S.call(d, "index") && (B.index = d.index, B.input = d.input), B;
  }
  function Rg(d) {
    return typeof d.constructor == "function" && !Yl(d) ? Lg(mt(d)) : {};
  }
  function Gg(d, E, B, G) {
    var jt = d.constructor;
    switch (E) {
      case A:
        return Jo(d);
      case a:
      case c:
        return new jt(+d);
      case U:
        return Tg(d, G);
      case z:
      case N:
      case P:
      case m:
      case v:
      case T:
      case R:
      case Y:
      case j:
        return Og(d, G);
      case p:
        return Ug(d, G, B);
      case h:
      case M:
        return new jt(d);
      case I:
        return Hg(d);
      case k:
        return Ng(d, G, B);
      case x:
        return Pg(d);
    }
  }
  function Vg(d, E) {
    return E = E ?? s, !!E && (typeof d == "number" || y.test(d)) && d > -1 && d % 1 == 0 && d < E;
  }
  function Kg(d) {
    var E = typeof d;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? d !== "__proto__" : d === null;
  }
  function qg(d) {
    return !!Ye && Ye in d;
  }
  function Yl(d) {
    var E = d && d.constructor, B = typeof E == "function" && E.prototype || We;
    return d === B;
  }
  function Yn(d) {
    if (d != null) {
      try {
        return Z.call(d);
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
  function Xl(d, E) {
    return d === E || d !== d && E !== E;
  }
  function Yg(d) {
    return Xg(d) && S.call(d, "callee") && (!Xe.call(d, "callee") || D.call(d) == i);
  }
  var ta = Array.isArray;
  function Zl(d) {
    return d != null && Qg(d.length) && !Ql(d);
  }
  function Xg(d) {
    return Jg(d) && Zl(d);
  }
  var Zg = Ur || ey;
  function Ql(d) {
    var E = ai(d) ? D.call(d) : "";
    return E == f || E == u;
  }
  function Qg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function ai(d) {
    var E = typeof d;
    return !!d && (E == "object" || E == "function");
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
  return Cr.c32address(t.version, t.hash160);
}
const ox = (t) => k2(Gd(t)), ax = (t) => W(ox(t));
Mt.hmacSha256Sync = (t, ...e) => {
  const n = zd.create(Gd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function cx(t, e = "mainnet") {
  e = Od(e), t = typeof t == "string" ? ut(t) : t;
  const n = E2(nn.P2PKH, e), r = sx(n, ax(t));
  return ix(r);
}
function lx(t, e) {
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
  const s = r.issuer.publicKey, i = cx(s);
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
function ux(t, e = null) {
  let n;
  e ? n = lx(t, e) : n = Ft.decodeToken(t);
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
        return Gr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Gr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = nw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new li("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Ft.decodeToken(e).payload;
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
            if (Gr.warn("Failed decryption of appPrivateKey, will try to use as given"), !Mt.isValidPrivateKey(i.private_key))
              throw new li("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Cu(s, c);
          } catch {
            Gr.info("Failed decryption of coreSessionToken, will try to use as given");
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
    }, p = i.profile_url;
    if (!u.profile && p) {
      const h = await n(p);
      if (!h.ok)
        u.profile = Object.assign({}, Cy);
      else {
        const w = await h.text(), b = JSON.parse(w);
        u.profile = ux(b[0].token);
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), V1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), K1(e, r);
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
}, _o = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Jd = "STX_PROVIDER", dr = () => typeof window > "u" ? null : window.localStorage.getItem(Jd), wx = (t) => {
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
var os;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(os || (os = {}));
var pr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(pr || (pr = {}));
var Zu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zu || (Zu = {}));
const Ex = "https://api.mainnet.hiro.so", Ax = "https://api.testnet.hiro.so", $x = "http://localhost:3999", Ix = ["mainnet", "testnet", "devnet", "mocknet"];
class gr {
  constructor(e) {
    this.version = pr.Mainnet, this.chainId = os.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === pr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
gr.fromName = (t) => {
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
gr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : gr.fromName(t);
class Ra extends gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = pr.Mainnet, this.chainId = os.Mainnet;
  }
}
class Ga extends gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = pr.Testnet, this.chainId = os.Testnet;
  }
}
class t0 extends gr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = pr.Testnet, this.chainId = os.Testnet;
  }
}
const vx = t0;
var yr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(yr || (yr = {}));
var ro;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ro || (ro = {}));
yr.Mainnet;
var wr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wr || (wr = {}));
var br;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(br || (br = {}));
wr.Mainnet;
const Lx = {
  chainId: yr.Mainnet,
  transactionVersion: wr.Mainnet,
  peerNetworkId: ro.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: br.MainnetSingleSig,
    multiSig: br.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Va = {
  chainId: yr.Testnet,
  transactionVersion: wr.Testnet,
  peerNetworkId: ro.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: br.TestnetSingleSig,
    multiSig: br.TestnetMultiSig
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
    this.consumed = 0, this.source = typeof e == "string" ? ut(e) : e;
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
    if (e0(e, r))
      return r;
    throw n(r);
  }
};
const _x = 128, Tx = 128, n0 = 16, sr = 32, Ka = 80, To = 65, Ux = 32, Hx = 64, so = 34, Nx = 1 + 16 * 1024 * 1024, Px = 165, Ox = 16, Dx = 16, jx = 20, Fx = Dx + 2 + jx, zx = Fx + 4, Rx = Nx + (Px + Ox * zx);
var dt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(dt || (dt = {}));
var qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(qa || (qa = {}));
var oe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(oe || (oe = {}));
const fa = ["onChainOnly", "offChainOnly", "any"];
fa[0] + "", oe.OnChainOnly, fa[1] + "", oe.OffChainOnly, fa[2] + "", oe.Any, oe.OnChainOnly + "", oe.OnChainOnly, oe.OffChainOnly + "", oe.OffChainOnly, oe.Any + "", oe.Any;
var io;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(io || (io = {}));
var Et;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Et || (Et = {}));
var Bt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Bt || (Bt = {}));
var wt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(wt || (wt = {}));
var vt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vt || (vt = {}));
var Ts;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ts || (Ts = {}));
var Wa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wa || (Wa = {}));
var Ya;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ya || (Ya = {}));
var qt;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qt || (qt = {}));
var Ju;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ju || (Ju = {}));
var Xa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Xa || (Xa = {}));
var Ae;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ae || (Ae = {}));
var tf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(tf || (tf = {}));
let Uo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Vr = class extends Uo {
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
}, tr = class extends Uo {
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
const er = {
  number: Za,
  bool: Gx,
  bytes: r0,
  hash: Vx,
  exists: Kx,
  output: qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _e = (t, e) => t << 32 - e | t >>> e, Wx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Br(t) {
  const e = (r) => t().update(tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let i0 = class extends s0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, er.hash(e);
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
    er.exists(this);
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
    er.exists(this), er.output(e, this), this.finished = !0;
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
]), $n = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), In = new Uint32Array(64);
let a0 = class extends el {
  constructor() {
    super(64, 32, 8, !1), this.A = $n[0] | 0, this.B = $n[1] | 0, this.C = $n[2] | 0, this.D = $n[3] | 0, this.E = $n[4] | 0, this.F = $n[5] | 0, this.G = $n[6] | 0, this.H = $n[7] | 0;
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
      In[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = In[u - 15], h = In[u - 2], w = _e(p, 7) ^ _e(p, 18) ^ p >>> 3, b = _e(h, 17) ^ _e(h, 19) ^ h >>> 10;
      In[u] = b + In[u - 7] + w + In[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = _e(a, 6) ^ _e(a, 11) ^ _e(a, 25), h = f + p + Zx(a, c, l) + Jx[u] + In[u] | 0, b = (_e(r, 2) ^ _e(r, 13) ^ _e(r, 22)) + Qx(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    In.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tm = class extends a0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const nl = Br(() => new a0());
Br(() => new tm());
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, b = im[h], I = om[h], k = rl[h], M = sl[h], x = rm[h], L = sm[h];
      for (let A = 0; A < 16; A++) {
        const U = Ei(r + ef(h, i, a, l) + Ai[k[A]] + b, x[A]) + u | 0;
        r = u, u = l, l = Ei(a, 10) | 0, a = i, i = U;
      }
      for (let A = 0; A < 16; A++) {
        const U = Ei(s + ef(w, o, c, f) + Ai[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = Ei(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ai.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const cm = Br(() => new am()), $i = BigInt(2 ** 32 - 1), Qa = BigInt(32);
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
].map((t) => BigInt(t))), vn = new Uint32Array(80), Ln = new Uint32Array(80);
let Ho = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: b, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      vn[x] = e.getUint32(n), Ln[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = vn[x - 15] | 0, A = Ln[x - 15] | 0, U = et.rotrSH(L, A, 1) ^ et.rotrSH(L, A, 8) ^ et.shrSH(L, A, 7), z = et.rotrSL(L, A, 1) ^ et.rotrSL(L, A, 8) ^ et.shrSL(L, A, 7), N = vn[x - 2] | 0, P = Ln[x - 2] | 0, m = et.rotrSH(N, P, 19) ^ et.rotrBH(N, P, 61) ^ et.shrSH(N, P, 6), v = et.rotrSL(N, P, 19) ^ et.rotrBL(N, P, 61) ^ et.shrSL(N, P, 6), T = et.add4L(z, v, Ln[x - 7], Ln[x - 16]), R = et.add4H(T, U, m, vn[x - 7], vn[x - 16]);
      vn[x] = R | 0, Ln[x] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: b, Gl: I, Hh: k, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = et.rotrSH(u, p, 14) ^ et.rotrSH(u, p, 18) ^ et.rotrBH(u, p, 41), A = et.rotrSL(u, p, 14) ^ et.rotrSL(u, p, 18) ^ et.rotrBL(u, p, 41), U = u & h ^ ~u & b, z = p & w ^ ~p & I, N = et.add5L(M, A, z, Mm[x], Ln[x]), P = et.add5H(N, k, L, U, km[x], vn[x]), m = N | 0, v = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), T = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      k = b | 0, M = I | 0, b = h | 0, I = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = et.add(l | 0, f | 0, P | 0, m | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = et.add3L(m, T, Y);
      r = et.add3H(j, P, v, R), s = j | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = et.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = et.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = et.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: b, l: I } = et.add(this.Gh | 0, this.Gl | 0, b | 0, I | 0), { h: k, l: M } = et.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, b, I, k, M);
  }
  roundClean() {
    vn.fill(0), Ln.fill(0);
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
Br(() => new Ho());
Br(() => new _m());
const Hm = Br(() => new Tm());
Br(() => new Um());
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
  return { type: ct.Buffer, value: W(t) };
}, nf = BigInt("0xffffffffffffffffffffffffffffffff"), Dm = BigInt(0), rf = BigInt("0x7fffffffffffffffffffffffffffffff"), sf = BigInt("-170141183460469231731687303715884105728"), jm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ka(ut(t))), ne(t, Uint8Array) && (t = ka(t));
  const e = Rt(t);
  if (e > rf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${rf}`);
  if (e < sf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${sf}`);
  return { type: ct.Int, value: e };
}, Fm = (t) => {
  const e = Rt(t);
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
var O;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(O || (O = {}));
function Rm() {
  return {
    type: O.Address,
    version: br.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function of(t) {
  if (t && S0(t, so))
    throw new Error(`Memo exceeds maximum length of ${so} bytes`);
  return { type: O.MemoString, content: t };
}
function ol(t, e) {
  return {
    type: O.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ja(t) {
  if (ut(t).byteLength != To)
    throw Error("Invalid signature");
  return {
    type: O.MessageSignature,
    data: t
  };
}
function Gm(t, e, n) {
  return typeof t == "string" && (t = oS(t)), typeof n == "string" && (n = of(n)), {
    type: O.Payload,
    payloadType: dt.TokenTransfer,
    recipient: t,
    amount: Rt(e),
    memo: n ?? of("")
  };
}
function Vm(t, e, n, r) {
  return typeof e == "string" && (e = ve(e)), typeof n == "string" && (n = ve(n)), {
    type: O.Payload,
    payloadType: dt.ContractCall,
    contractAddress: typeof t == "string" ? Vn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Km(t) {
  return ve(t, 4, 1e5);
}
function af(t, e, n) {
  return typeof t == "string" && (t = ve(t)), typeof e == "string" && (e = Km(e)), typeof n == "number" ? {
    type: O.Payload,
    payloadType: dt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: O.Payload,
    payloadType: dt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function qm() {
  return { type: O.Payload, payloadType: dt.PoisonMicroblock };
}
function cf(t, e) {
  if (t.byteLength != sr)
    throw Error(`Coinbase buffer size must be ${sr} bytes`);
  return e != null ? {
    type: O.Payload,
    payloadType: dt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: O.Payload,
    payloadType: dt.Coinbase,
    coinbaseBytes: t
  };
}
function Wm(t, e, n) {
  if (t.byteLength != sr)
    throw Error(`Coinbase buffer size must be ${sr} bytes`);
  if (n.byteLength != Ka)
    throw Error(`VRF proof buffer size must be ${Ka} bytes`);
  return {
    type: O.Payload,
    payloadType: dt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ct.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Ym(t, e, n, r, s, i, o) {
  return {
    type: O.Payload,
    payloadType: dt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ve(t, e, n) {
  const r = e || 1, s = n || _x;
  if (S0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: O.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Xm(t, e, n) {
  return {
    type: O.Asset,
    address: Vn(t),
    contractName: ve(e),
    assetName: ve(n)
  };
}
function Vn(t) {
  const e = Cr.c32addressDecode(t);
  return {
    type: O.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Zm(t, e) {
  const n = Vn(t), r = ve(e);
  return {
    type: O.Principal,
    prefix: qt.Contract,
    address: n,
    contractName: r
  };
}
function Qm(t) {
  const e = Vn(t);
  return {
    type: O.Principal,
    prefix: qt.Standard,
    address: e
  };
}
function Kr(t, e) {
  return {
    pubKeyEncoding: t,
    type: O.TransactionAuthField,
    contents: e
  };
}
function tn(t) {
  switch (t.type) {
    case O.Address:
      return ni(t);
    case O.Principal:
      return d0(t);
    case O.LengthPrefixedString:
      return cs(t);
    case O.MemoString:
      return tS(t);
    case O.Asset:
      return g0(t);
    case O.PostCondition:
      return w0(t);
    case O.PublicKey:
      return nc(t);
    case O.LengthPrefixedList:
      return al(t);
    case O.Payload:
      return b0(t);
    case O.TransactionAuthField:
      return iS(t);
    case O.MessageSignature:
      return cl(t);
  }
}
function ni(t) {
  const e = [];
  return e.push(ut(Xs(t.version, 1))), e.push(ut(t.hash160)), Tt(e);
}
function as(t) {
  const e = ne(t, St) ? t : new St(t), n = mo(W(e.readBytes(1))), r = W(e.readBytes(20));
  return { type: O.Address, version: n, hash160: r };
}
function d0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === qt.Standard || t.prefix === qt.Contract) && e.push(ni(t.address)), t.prefix === qt.Contract && e.push(cs(t.contractName)), Tt(e);
}
function Jm(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(qt, (i) => {
    throw new Vt(`Unexpected Principal payload type: ${i}`);
  });
  if (n === qt.Origin)
    return { type: O.Principal, prefix: n };
  const r = as(e);
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
function cs(t) {
  const e = [], n = $r(t.content), r = n.byteLength;
  return e.push(ut(Xs(r, t.lengthPrefixBytes))), e.push(n), Tt(e);
}
function ye(t, e, n) {
  e = e || 1;
  const r = ne(t, St) ? t : new St(t), s = mo(W(r.readBytes(e))), i = Zs(r.readBytes(s));
  return ve(i, e, n ?? 128);
}
function tS(t) {
  const e = [], n = $r(t.content), r = CS(W(n), so * 2);
  return e.push(ut(r)), Tt(e);
}
function p0(t) {
  const e = ne(t, St) ? t : new St(t);
  let n = Zs(e.readBytes(so));
  return n = n.replace(/\u0000*$/, ""), { type: O.MemoString, content: n };
}
function g0(t) {
  const e = [];
  return e.push(ni(t.address)), e.push(cs(t.contractName)), e.push(cs(t.assetName)), Tt(e);
}
function tc(t) {
  const e = ne(t, St) ? t : new St(t);
  return {
    type: O.Asset,
    address: as(e),
    contractName: ye(e),
    assetName: ye(e)
  };
}
function al(t) {
  const e = t.values, n = [];
  n.push(ut(Xs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(tn(r));
  return Tt(n);
}
function y0(t, e, n) {
  const r = ne(t, St) ? t : new St(t), s = mo(W(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case O.Address:
        i.push(as(r));
        break;
      case O.LengthPrefixedString:
        i.push(ye(r));
        break;
      case O.MemoString:
        i.push(p0(r));
        break;
      case O.Asset:
        i.push(tc(r));
        break;
      case O.PostCondition:
        i.push(nS(r));
        break;
      case O.PublicKey:
        i.push(rc(r));
        break;
      case O.TransactionAuthField:
        i.push(sS(r));
        break;
    }
  return ol(i, n);
}
function eS(t) {
  return W(w0(t));
}
function w0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d0(t.principal)), (t.conditionType === Et.Fungible || t.conditionType === Et.NonFungible) && e.push(g0(t.asset)), t.conditionType === Et.NonFungible && e.push(Oe(t.assetName)), e.push(t.conditionCode), t.conditionType === Et.STX || t.conditionType === Et.Fungible || t.conditionType === Et.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Vr("The post-condition amount may not be larger than 8 bytes");
    e.push(Rn(t.amount, 8));
  }
  return Tt(e);
}
function nS(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(Et, (a) => {
    throw new Vt(`Could not read ${a} as PostConditionType`);
  }), r = Jm(e);
  let s, i, o;
  switch (n) {
    case Et.STX:
      return s = e.readUInt8Enum(Ts, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Et.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Et.Fungible:
      return i = tc(e), s = e.readUInt8Enum(Ts, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Et.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Et.NonFungible:
      i = tc(e);
      const a = Ne(e);
      return s = e.readUInt8Enum(Wa, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: O.PostCondition,
        conditionType: Et.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Et.Staking:
      return s = e.readUInt8Enum(Ts, (c) => {
        throw new Vt(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${W(e.readBytes(8))}`), {
        type: O.PostCondition,
        conditionType: Et.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Et.PoX: {
      const c = e.readUInt8Enum(Ya, (l) => {
        throw new Vt(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: O.PostCondition,
        conditionType: Et.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function b0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case dt.TokenTransfer:
      e.push(Oe(t.recipient)), e.push(Rn(t.amount, 8)), e.push(tn(t.memo));
      break;
    case dt.ContractCall:
      e.push(tn(t.contractAddress)), e.push(tn(t.contractName)), e.push(tn(t.functionName));
      const n = new Uint8Array(4);
      cr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Oe(r));
      });
      break;
    case dt.SmartContract:
      e.push(tn(t.contractName)), e.push(tn(t.codeBody));
      break;
    case dt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(tn(t.contractName)), e.push(tn(t.codeBody));
      break;
    case dt.PoisonMicroblock:
      break;
    case dt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case dt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Oe(t.recipient));
      break;
    case dt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Oe(t.recipient ? h0(t.recipient) : f0())), e.push(t.vrfProof);
      break;
    case dt.TenureChange:
      e.push(ut(t.tenureHash)), e.push(ut(t.previousTenureHash)), e.push(ut(t.burnViewHash)), e.push(ut(t.previousTenureEnd)), e.push(cr(new Uint8Array(4), t.previousTenureBlocks)), e.push(Zy(new Uint8Array(1), t.cause)), e.push(ut(t.publicKeyHash));
      break;
  }
  return Tt(e);
}
function rS(t) {
  const e = ne(t, St) ? t : new St(t);
  switch (e.readUInt8Enum(dt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case dt.TokenTransfer:
      const r = Ne(e), s = Rt(e.readBytes(8)), i = p0(e);
      return Gm(r, s, i);
    case dt.ContractCall:
      const o = as(e), a = ye(e), c = ye(e), l = [], f = e.readUInt32BE();
      for (let L = 0; L < f; L++) {
        const A = Ne(e);
        l.push(A);
      }
      return Vm(o, a, c, l);
    case dt.SmartContract:
      const u = ye(e), p = ye(e, 4, 1e5);
      return af(u, p);
    case dt.VersionedSmartContract: {
      const L = e.readUInt8Enum(qa, (z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${z}`);
      }), A = ye(e), U = ye(e, 4, Rx);
      return af(A, U, L);
    }
    case dt.PoisonMicroblock:
      return qm();
    case dt.Coinbase: {
      const L = e.readBytes(sr);
      return cf(L);
    }
    case dt.CoinbaseToAltRecipient: {
      const L = e.readBytes(sr), A = Ne(e);
      return cf(L, A);
    }
    case dt.NakamotoCoinbase: {
      const L = e.readBytes(sr), A = Ne(e), U = e.readBytes(Ka);
      return Wm(L, A, U);
    }
    case dt.TenureChange:
      const h = W(e.readBytes(20)), w = W(e.readBytes(20)), b = W(e.readBytes(20)), I = W(e.readBytes(32)), k = e.readUInt32BE(), M = e.readUInt8Enum(Xa, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), x = W(e.readBytes(20));
      return Ym(h, w, b, I, k, M, x);
  }
}
function ec(t) {
  const e = ne(t, St) ? t : new St(t);
  return Ja(W(e.readBytes(To)));
}
function sS(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(Ae, (r) => {
    throw new Vt(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ae.PublicKeyCompressed:
      return Kr(vt.Compressed, rc(e));
    case Ae.PublicKeyUncompressed:
      return Kr(vt.Uncompressed, ws(DS(rc(e).data)));
    case Ae.SignatureCompressed:
      return Kr(vt.Compressed, ec(e));
    case Ae.SignatureUncompressed:
      return Kr(vt.Uncompressed, ec(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function cl(t) {
  return ut(t.data);
}
function iS(t) {
  const e = [];
  switch (t.contents.type) {
    case O.PublicKey:
      e.push(t.pubKeyEncoding === vt.Compressed ? Ae.PublicKeyCompressed : Ae.PublicKeyUncompressed), e.push(ut(OS(t.contents.data)));
      break;
    case O.MessageSignature:
      e.push(t.pubKeyEncoding === vt.Compressed ? Ae.SignatureCompressed : Ae.SignatureUncompressed), e.push(cl(t.contents));
      break;
  }
  return Tt(e);
}
function nc(t) {
  return t.data.slice();
}
function rc(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8(), r = n === 4 ? Hx : Ux;
  return ws(Tt([n, e.readBytes(r)]));
}
function ll(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === wt.P2PKH || e === wt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === wt.P2WPKH || e === wt.P2WSH || e === wt.P2WSHNonSequential) && !r.map((s) => s.data).every(bs))
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
  return { type: O.Address, version: t, hash160: e };
}
function ul(t) {
  return Cr.c32address(t.version, t.hash160);
}
function lf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return Xm(e, n, r);
}
function Ls(t) {
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
  const e = Vn(t);
  return { type: ct.PrincipalStandard, value: ul(e) };
}
function cS(t) {
  return { type: ct.PrincipalStandard, value: ul(t) };
}
function lS(t, e) {
  const n = Vn(t), r = ve(e);
  return x0(n, r);
}
function x0(t, e) {
  if ($r(e.content).byteLength >= 128)
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
function Ne(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new St(ut(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new St(t) : e = t;
  switch (e.readUInt8Enum(Pt, (r) => {
    throw new Vt(`Cannot recognize Clarity Type: ${r}`);
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
      const s = as(e);
      return cS(s);
    case Pt.contract:
      const i = as(e), o = ye(e);
      return x0(i, o);
    case Pt.ok:
      return fS(Ne(e));
    case Pt.err:
      return uS(Ne(e));
    case Pt.none:
      return f0();
    case Pt.some:
      return h0(Ne(e));
    case Pt.list:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(Ne(e));
      return zm(c);
    case Pt.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let b = 0; b < l; b++) {
        const I = ye(e).content;
        if (I === void 0)
          throw new Vt('"content" is undefined');
        f[I] = Ne(e);
      }
      return pS(f);
    case Pt.ascii:
      const u = e.readUInt32BE(), p = Ry(e.readBytes(u));
      return hS(p);
    case Pt.utf8:
      const h = e.readUInt32BE(), w = Zs(e.readBytes(h));
      return dS(w);
    default:
      throw new Vt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ze(t, e) {
  return Tt([il(t), e]);
}
function gS(t) {
  return new Uint8Array([il(t.type)]);
}
function yS(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([il(t.type)]) : ze(t.type, Oe(t.value));
}
function wS(t) {
  const e = new Uint8Array(4);
  return cr(e, Math.ceil(t.value.length / 2), 0), ze(t.type, je(e, ut(t.value)));
}
function bS(t) {
  const e = Uc(Oy(BigInt(t.value), BigInt(Tx)), n0);
  return ze(t.type, e);
}
function xS(t) {
  const e = Uc(BigInt(t.value), n0);
  return ze(t.type, e);
}
function mS(t) {
  return ze(t.type, ni(Vn(t.value)));
}
function SS(t) {
  const [e, n] = US(t.value);
  return ze(t.type, je(ni(Vn(e)), cs(ve(n))));
}
function ES(t) {
  return ze(t.type, Oe(t.value));
}
function AS(t) {
  const e = [], n = new Uint8Array(4);
  cr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Oe(r);
    e.push(s);
  }
  return ze(t.type, Tt(e));
}
function $S(t) {
  const e = [], n = new Uint8Array(4);
  cr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ve(s);
    e.push(cs(i));
    const o = Oe(t.value[s]);
    e.push(o);
  }
  return ze(t.type, Tt(e));
}
function m0(t, e) {
  const n = [], r = e == "ascii" ? zy(t.value) : $r(t.value), s = new Uint8Array(4);
  return cr(s, r.length, 0), n.push(s), n.push(r), ze(t.type, Tt(n));
}
function IS(t) {
  return m0(t, "ascii");
}
function vS(t) {
  return m0(t, "utf8");
}
function uf(t) {
  return W(Oe(t));
}
function Oe(t) {
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
      throw new Vr("Unable to serialize. Invalid Clarity Value.");
  }
}
const LS = (t) => t.length % 2 ? `0${t}` : t, CS = (t, e) => t.padEnd(e, "0"), S0 = (t, e) => t ? $r(t).length > e : !1;
function sc(t) {
  return Qd(t);
}
const js = (t) => cm(nl(t)), fl = (t) => W(Hm(t)), BS = (t) => W(js(t)), kS = (t) => {
  const e = js(t), n = je(new Uint8Array([0]), new Uint8Array([e.length]), e), r = js(n);
  return W(r);
}, MS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = js(r);
  return W(s);
}, _S = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Tt(n), s = nl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Tt(i), a = js(o);
  return W(a);
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
Mt.hmacSha256Sync = (t, ...e) => {
  const n = o0.create(nl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ws(t) {
  return t = typeof t == "string" ? ut(t) : t, {
    type: O.PublicKey,
    data: t
  };
}
function HS(t, e, n = vt.Compressed) {
  const r = qy(e), s = new ue(lu(r.r), lu(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === vt.Compressed;
  return i.toHex(o);
}
function NS(t) {
  return typeof t == "string" ? t : W(t);
}
const hl = NS;
function E0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Ky;
}
function bs(t) {
  return !hl(t).startsWith("04");
}
function PS(t) {
  t = Hc(t);
  const e = E0(t);
  return W(Qs(t.slice(0, 32), e));
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
  return Xs(r, 1) + ue.fromHex(n).toCompactHex();
}
function dl() {
  return {
    type: O.MessageSignature,
    data: W(new Uint8Array(To))
  };
}
function A0(t, e, n, r) {
  const s = ll(0, t, 1, [ws(e)]).hash160, i = bs(e) ? vt.Compressed : vt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Rt(n),
    fee: Rt(r),
    keyEncoding: i,
    signature: dl()
  };
}
function Fs(t) {
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
  return e.nonce = 0, e.fee = 0, Fs(e) ? e.signature = dl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function zS(t) {
  const e = [
    t.hashMode,
    ut(t.signer),
    Rn(t.nonce, 8),
    Rn(t.fee, 8),
    t.keyEncoding,
    cl(t.signature)
  ];
  return Tt(e);
}
function RS(t) {
  const e = [
    t.hashMode,
    ut(t.signer),
    Rn(t.nonce, 8),
    Rn(t.fee, 8)
  ], n = ol(t.fields);
  e.push(al(n));
  const r = new Uint8Array(2);
  return Yy(r, t.signaturesRequired, 0), e.push(r), Tt(e);
}
function GS(t, e) {
  const n = W(e.readBytes(20)), r = BigInt(`0x${W(e.readBytes(8))}`), s = BigInt(`0x${W(e.readBytes(8))}`), i = e.readUInt8Enum(vt, (a) => {
    throw new Vt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === wt.P2WPKH && i != vt.Compressed)
    throw new Vt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = W(e.readBytes(20)), r = BigInt("0x" + W(e.readBytes(8))), s = BigInt("0x" + W(e.readBytes(8))), i = y0(e, O.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case O.PublicKey:
        bs(l.contents.data) || (o = !0);
        break;
      case O.MessageSignature:
        if (l.pubKeyEncoding === vt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new tr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === wt.P2WSH || t === wt.P2WSHNonSequential))
    throw new tr("Uncompressed keys are not allowed in this hash mode");
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
  return Fs(t) ? zS(t) : RS(t);
}
function pa(t) {
  const e = t.readUInt8Enum(wt, (n) => {
    throw new Vt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === wt.P2PKH || e === wt.P2WPKH ? GS(e, t) : VS(e, t);
}
function $0(t, e, n, r) {
  const i = t + W(new Uint8Array([e])) + W(Rn(n, 8)) + W(Rn(r, 8));
  if (ut(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return fl(ut(i));
}
function I0(t, e, n) {
  const r = 33 + To, s = bs(e.data) ? vt.Compressed : vt.Uncompressed, i = t + LS(s.toString(16)) + n, o = ut(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return fl(o);
}
function KS(t, e, n, r, s) {
  const i = $0(t, e, n, r), o = jS(s, i), a = ws(PS(s)), c = I0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function v0(t, e, n, r, s, i) {
  const o = $0(t, e, n, r), a = ws(HS(o, i, s)), c = I0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function qS() {
  const t = A0(wt.P2PKH, "", 0, 0);
  return t.signer = Rm().hash160, t.keyEncoding = vt.Compressed, t.signature = dl(), t;
}
function df(t, e, n) {
  return Fs(t) ? WS(t, e, n) : YS(t, e, n);
}
function WS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = v0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = ll(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new tr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function YS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case O.PublicKey:
        bs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case O.MessageSignature:
        c.pubKeyEncoding === vt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = v0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ff(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new tr("Too many signatures");
        break;
    }
  if (ff(t.hashMode) && o !== t.signaturesRequired || FS(t.hashMode) && o < t.signaturesRequired)
    throw new tr("Incorrect number of signatures");
  if (i && (t.hashMode === wt.P2WSH || t.hashMode === wt.P2WSHNonSequential))
    throw new tr("Uncompressed keys are not allowed in this hash mode");
  const a = ll(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new tr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function L0(t) {
  return {
    authType: Bt.Standard,
    spendingCondition: t
  };
}
function C0(t, e) {
  return {
    authType: Bt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || A0(wt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function pf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Bt.Standard:
        return L0(hf(t.spendingCondition));
      case Bt.Sponsored:
        return C0(hf(t.spendingCondition), qS());
      default:
        throw new oo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function XS(t, e) {
  switch (t.authType) {
    case Bt.Standard:
      return df(t.spendingCondition, e, Bt.Standard);
    case Bt.Sponsored:
      return df(t.spendingCondition, e, Bt.Standard);
    default:
      throw new oo("Invalid origin auth type");
  }
}
function ZS(t, e) {
  switch (t.authType) {
    case Bt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Rt(e)
      };
      return { ...t, spendingCondition: n };
    case Bt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Rt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function QS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Rt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function JS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Rt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function t3(t, e) {
  const n = {
    ...e,
    nonce: Rt(e.nonce),
    fee: Rt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Bt.Standard:
      e.push(da(t.spendingCondition));
      break;
    case Bt.Sponsored:
      e.push(da(t.spendingCondition)), e.push(da(t.sponsorSpendingCondition));
      break;
  }
  return Tt(e);
}
function n3(t) {
  const e = t.readUInt8Enum(Bt, (r) => {
    throw new Vt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Bt.Standard:
      return n = pa(t), L0(n);
    case Bt.Sponsored:
      n = pa(t);
      const r = pa(t);
      return C0(n, r);
  }
}
class r3 {
  constructor({ auth: e, payload: n, postConditions: r = ol([]), postConditionMode: s = io.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = kx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Rt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = oe.Any;
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
    return this.signAndAppend(this.auth.spendingCondition, e, Bt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Bt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Bt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : ws(e), r = this.auth.spendingCondition;
    if (r && !Fs(r)) {
      const s = bs(n.data);
      r.fields.push(Kr(s ? vt.Compressed : vt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = KS(n, r, e.fee, e.nonce, s);
    if (Fs(e))
      e.signature = Ja(i);
    else {
      const a = E0(s);
      e.fields.push(Kr(a ? vt.Compressed : vt.Uncompressed, Ja(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return fl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Bt.Sponsored)
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
    if (this.auth.authType != Bt.Sponsored)
      throw new oo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = JS(this.auth, e);
  }
  serialize() {
    return W(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Vr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Vr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Vr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Vr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return cr(n, this.chainId, 0), e.push(n), e.push(e3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(al(this.postConditions)), e.push(b0(this.payload)), Tt(e);
  }
}
function s3(t) {
  const e = ne(t, St) ? t : new St(t), n = e.readUInt8Enum(wr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = n3(e), i = e.readUInt8Enum(oe, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(io, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = y0(e, O.PostCondition), c = rS(e), l = new r3({
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
  const e = Rt(t);
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
        type: O.PostCondition,
        conditionType: Et.STX,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Ls(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount)
      };
    case "ft-postcondition":
      return {
        type: O.PostCondition,
        conditionType: Et.Fungible,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Ls(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount),
        asset: lf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: O.PostCondition,
        conditionType: Et.NonFungible,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Ls(t.address),
        conditionCode: vi(t.condition),
        asset: lf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: O.PostCondition,
        conditionType: Et.Staking,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Ls(t.address),
        conditionCode: vi(t.condition),
        amount: ga(t.amount)
      };
    case "pox-postcondition":
      return {
        type: O.PostCondition,
        conditionType: Et.PoX,
        principal: t.address === "origin" ? { type: O.Principal, prefix: qt.Origin } : Ls(t.address),
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
      r = r.padStart(r.length + r.length % 2, "0"), n = zs(r);
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
  return zs(n);
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
function zs(t) {
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
function ln(t) {
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
var Ee;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ee || (Ee = {}));
const ya = ["onChainOnly", "offChainOnly", "any"];
ya[0] + "", Ee.OnChainOnly, ya[1] + "", Ee.OffChainOnly, ya[2] + "", Ee.Any, Ee.OnChainOnly + "", Ee.OnChainOnly, Ee.OffChainOnly + "", Ee.OffChainOnly, Ee.Any + "", Ee.Any;
var lc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lc || (lc = {}));
lc.Mainnet;
var xf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xf || (xf = {}));
var Xn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xn || (Xn = {}));
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
const ba = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Te = (t, e) => t << 32 - e | t >>> e, x3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function kr(t) {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, b = L3[h], I = C3[h], k = xl[h], M = ml[h], x = I3[h], L = v3[h];
      for (let A = 0; A < 16; A++) {
        const U = Li(r + Cf(h, i, a, l) + Ci[k[A]] + b, x[A]) + u | 0;
        r = u, u = l, l = Li(a, 10) | 0, a = i, i = U;
      }
      for (let A = 0; A < 16; A++) {
        const U = Li(s + Cf(w, o, c, f) + Ci[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = Li(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ci.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
kr(() => new B3());
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
]), Cn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Bn = new Uint32Array(64);
let N0 = class extends bl {
  constructor() {
    super(64, 32, 8, !1), this.A = Cn[0] | 0, this.B = Cn[1] | 0, this.C = Cn[2] | 0, this.D = Cn[3] | 0, this.E = Cn[4] | 0, this.F = Cn[5] | 0, this.G = Cn[6] | 0, this.H = Cn[7] | 0;
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
      Bn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Bn[u - 15], h = Bn[u - 2], w = Te(p, 7) ^ Te(p, 18) ^ p >>> 3, b = Te(h, 17) ^ Te(h, 19) ^ h >>> 10;
      Bn[u] = b + Bn[u - 7] + w + Bn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Te(a, 6) ^ Te(a, 11) ^ Te(a, 25), h = f + p + k3(a, c, l) + _3[u] + Bn[u] | 0, b = (Te(r, 2) ^ Te(r, 13) ^ Te(r, 22)) + M3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Bn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T3 = class extends N0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
kr(() => new N0());
kr(() => new T3());
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
].map((t) => BigInt(t))), kn = new Uint32Array(80), Mn = new Uint32Array(80);
let Po = class extends bl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: b, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      kn[x] = e.getUint32(n), Mn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = kn[x - 15] | 0, A = Mn[x - 15] | 0, U = nt.rotrSH(L, A, 1) ^ nt.rotrSH(L, A, 8) ^ nt.shrSH(L, A, 7), z = nt.rotrSL(L, A, 1) ^ nt.rotrSL(L, A, 8) ^ nt.shrSL(L, A, 7), N = kn[x - 2] | 0, P = Mn[x - 2] | 0, m = nt.rotrSH(N, P, 19) ^ nt.rotrBH(N, P, 61) ^ nt.shrSH(N, P, 6), v = nt.rotrSL(N, P, 19) ^ nt.rotrBL(N, P, 61) ^ nt.shrSL(N, P, 6), T = nt.add4L(z, v, Mn[x - 7], Mn[x - 16]), R = nt.add4H(T, U, m, kn[x - 7], kn[x - 16]);
      kn[x] = R | 0, Mn[x] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: b, Gl: I, Hh: k, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = nt.rotrSH(u, p, 14) ^ nt.rotrSH(u, p, 18) ^ nt.rotrBH(u, p, 41), A = nt.rotrSL(u, p, 14) ^ nt.rotrSL(u, p, 18) ^ nt.rotrBL(u, p, 41), U = u & h ^ ~u & b, z = p & w ^ ~p & I, N = nt.add5L(M, A, z, n4[x], Mn[x]), P = nt.add5H(N, k, L, U, e4[x], kn[x]), m = N | 0, v = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), T = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      k = b | 0, M = I | 0, b = h | 0, I = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = nt.add(l | 0, f | 0, P | 0, m | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = nt.add3L(m, T, Y);
      r = nt.add3H(j, P, v, R), s = j | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = nt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = nt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = nt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: b, l: I } = nt.add(this.Gh | 0, this.Gl | 0, b | 0, I | 0), { h: k, l: M } = nt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, b, I, k, M);
  }
  roundClean() {
    kn.fill(0), Mn.fill(0);
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
kr(() => new Po());
kr(() => new r4());
kr(() => new s4());
kr(() => new i4());
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
var Ot;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ot || (Ot = {}));
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
  return e.push(zs(pl(t.version, 1))), e.push(zs(t.hash160)), ln(e);
}
function c4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oo(t.address)), t.prefix === uc.Contract && e.push(Rs(t.contractName)), ln(e);
}
function Rs(t) {
  const e = [], n = yl(t.content), r = n.byteLength;
  return e.push(zs(pl(r, t.lengthPrefixBytes))), e.push(n), ln(e);
}
function l4(t) {
  const e = [];
  return e.push(Oo(t.address)), e.push(Rs(t.contractName)), e.push(Rs(t.assetName)), ln(e);
}
function D0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(c4(t.principal)), (t.conditionType === Xn.Fungible || t.conditionType === Xn.NonFungible) && e.push(l4(t.assetInfo)), t.conditionType === Xn.NonFungible && e.push(xr(t.assetName)), e.push(t.conditionCode), t.conditionType === Xn.STX || t.conditionType === Xn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new O0("The post-condition amount may not be larger than 8 bytes");
    e.push(a3(t.amount, !1, 8));
  }
  return ln(e);
}
function Re(t, e) {
  return ln([t, e]);
}
function u4(t) {
  return new Uint8Array([t.type]);
}
function f4(t) {
  return t.type === Ot.OptionalNone ? new Uint8Array([t.type]) : Re(t.type, xr(t.value));
}
function h4(t) {
  const e = new Uint8Array(4);
  return No(e, t.buffer.length, 0), Re(t.type, wl(e, t.buffer));
}
function d4(t) {
  const e = gl(c3(t.value, BigInt(p3)), M0);
  return Re(t.type, e);
}
function p4(t) {
  const e = gl(t.value, M0);
  return Re(t.type, e);
}
function g4(t) {
  return Re(t.type, Oo(t.address));
}
function y4(t) {
  return Re(t.type, wl(Oo(t.address), Rs(t.contractName)));
}
function w4(t) {
  return Re(t.type, xr(t.value));
}
function b4(t) {
  const e = [], n = new Uint8Array(4);
  No(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = xr(r);
    e.push(s);
  }
  return Re(t.type, ln(e));
}
function x4(t) {
  const e = [], n = new Uint8Array(4);
  No(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = o4(s);
    e.push(Rs(i));
    const o = xr(t.data[s]);
    e.push(o);
  }
  return Re(t.type, ln(e));
}
function j0(t, e) {
  const n = [], r = e == "ascii" ? f3(t.data) : yl(t.data), s = new Uint8Array(4);
  return No(s, r.length, 0), n.push(s), n.push(r), Re(t.type, ln(n));
}
function m4(t) {
  return j0(t, "ascii");
}
function S4(t) {
  return j0(t, "utf8");
}
function xr(t) {
  switch (t.type) {
    case Ot.BoolTrue:
    case Ot.BoolFalse:
      return u4(t);
    case Ot.OptionalNone:
    case Ot.OptionalSome:
      return f4(t);
    case Ot.Buffer:
      return h4(t);
    case Ot.UInt:
      return p4(t);
    case Ot.Int:
      return d4(t);
    case Ot.PrincipalStandard:
      return g4(t);
    case Ot.PrincipalContract:
      return y4(t);
    case Ot.ResponseOk:
    case Ot.ResponseErr:
      return w4(t);
    case Ot.List:
      return b4(t);
    case Ot.Tuple:
      return x4(t);
    case Ot.StringASCII:
      return m4(t);
    case Ot.StringUTF8:
      return S4(t);
    default:
      throw new O0("Unable to serialize. Invalid Clarity Value.");
  }
}
const E4 = (t, e) => t ? yl(t).length > e : !1, A4 = "connect-ui";
let zi, F0, ae = !1, dc = !1;
const cn = (t, e = "") => () => {
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
}, B4 = {}, k4 = (t) => t && t.$tag$ === B4, M4 = (t, e) => t != null && !Sl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, _4 = (t) => xs(t).$hostElement$, T4 = (t, e, n) => {
  const r = zt.ce(e, n);
  return t.dispatchEvent(r), r;
}, kf = /* @__PURE__ */ new WeakMap(), U4 = (t, e, n) => {
  let r = ao.get(t);
  tE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ao.set(t, r);
}, H4 = (t, e, n, r) => {
  var s;
  let i = R0(e);
  const o = ao.get(i);
  if (t = t.nodeType === 11 ? t : De, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = kf.get(t), c;
      if (a || kf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = De.createElement("style"), c.innerHTML = o;
          const l = (s = zt.$nonce$) !== null && s !== void 0 ? s : z0(De);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, N4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = cn("attachStyles", e.$tagName$), i = H4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, R0 = (t, e) => "sc-" + t.$tagName$, Mf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Tf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = _f(n), f = _f(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Tf(Do, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && zt.rel(t, e, n, !1), r && zt.ael(t, e, r, !1);
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
    o = s.$elm$ = De.createTextNode(s.$text$);
  else {
    if (ae || (ae = s.$tag$ === "svg"), o = s.$elm$ = De.createElementNS(ae ? v4 : L4, s.$tag$), ae && s.$tag$ === "foreignObject" && (ae = !1), G0(null, s, ae), C4(zi) && o["s-si"] !== zi && o.classList.add(o["s-si"] = zi), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = El(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ae = !1 : o.tagName === "foreignObject" && (ae = !0);
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
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], p;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : ki(a, f) ? (Cs(a, f), a = e[++s], f = r[++i]) : ki(c, u) ? (Cs(c, u), c = e[--o], u = r[--l]) : ki(a, u) ? (Cs(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : ki(c, f) ? (Cs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (p = El(e && e[i], n, i), f = r[++i], p && a.$elm$.parentNode.insertBefore(p, a.$elm$));
  s > o ? V0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && K0(e, s, o);
}, ki = (t, e) => t.$tag$ === e.$tag$, Cs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ae = i === "svg" ? !0 : i === "foreignObject" ? !1 : ae, G0(t, e, ae), r !== null && s !== null ? O4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), V0(n, null, e, s, 0, s.length - 1)) : r !== null && K0(r, 0, r.length - 1), ae && i === "svg" && (ae = !1)) : t.$text$ !== o && (n.data = o);
}, D4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pc(null, null), s = k4(e) ? e : Q(null, null, e);
  F0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, zi = n["s-sc"], Cs(r, s);
}, q0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Al = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return q0(t, t.$ancestorComponent$), nE(() => j4(t, e));
}, j4 = (t, e) => {
  const n = cn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), G4(s, () => F4(t, r, e));
}, F4 = async (t, e, n) => {
  const r = t.$hostElement$, s = cn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && N4(t);
  const o = cn("render", t.$cmpMeta$.$tagName$);
  z4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => R4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, z4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, D4(t, e);
  } catch (r) {
    Gs(r, t.$hostElement$);
  }
  return null;
}, R4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = cn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Y0(n), r(), t.$onReadyResolve$(n), s || W0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Il(() => Al(t, !1)), t.$flags$ &= -517;
}, W0 = (t) => {
  Y0(De.documentElement), Il(() => T4(Do, "appload", { detail: { namespace: A4 } }));
}, G4 = (t, e) => t && t.then ? t.then(e) : e(), Y0 = (t) => t.classList.add("hydrated"), V4 = (t, e) => xs(t).$instanceValues$.get(e), K4 = (t, e, n, r) => {
  const s = xs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
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
        zt.jmp(() => {
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
      const a = cn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Gs(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = R0(n);
      if (!ao.has(c)) {
        const l = cn("registerStyles", n.$tagName$);
        U4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Al(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, W4 = (t) => {
  if (!(zt.$flags$ & 1)) {
    const e = xs(t), n = e.$cmpMeta$, r = cn("connectedCallback", n.$tagName$);
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
  zt.$flags$ & 1 || xs(t);
}, X4 = (t, e = {}) => {
  var n;
  const r = cn(), s = [], i = e.exclude || [], o = Do.customElements, a = De.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ De.createElement("style"), f = [];
  let u, p = !0;
  Object.assign(zt, e), zt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", De.baseURI).href, t.map((h) => {
    h[1].map((w) => {
      const b = {
        $flags$: w[0],
        $tagName$: w[1],
        $members$: w[2],
        $listeners$: w[3]
      };
      b.$members$ = w[2];
      const I = b.$tagName$, k = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, Q4(M, b), b.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), p ? f.push(this) : zt.jmp(() => W4(this));
        }
        disconnectedCallback() {
          zt.jmp(() => Y4(this));
        }
        componentOnReady() {
          return xs(this).$onReadyPromise$;
        }
      };
      b.$lazyBundleId$ = h[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, X0(
        k,
        b,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + I4, l.setAttribute("data-styles", "");
    const h = (n = zt.$nonce$) !== null && n !== void 0 ? n : z0(De);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  p = !1, f.length ? f.map((h) => h.connectedCallback()) : zt.jmp(() => u = setTimeout(W0, 30)), r();
}, $l = /* @__PURE__ */ new WeakMap(), xs = (t) => $l.get(t), Z4 = (t, e) => $l.set(e.$lazyInstance$ = t, e), Q4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], $l.set(t, n);
}, Tf = (t, e) => e in t, Gs = (t, e) => (0, console.error)(t, e), xa = /* @__PURE__ */ new Map(), J4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = xa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (xa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => D5).then(o, Gs);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (xa.set(s, o), o[r]), Gs);
}, ao = /* @__PURE__ */ new Map(), Do = typeof window < "u" ? window : {}, De = Do.document || { head: {} }, zt = {
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
  t.push(n), dc || (dc = !0, zt.$flags$ & 4 ? Il(gc) : zt.raf(gc));
}, Hf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Gs(n);
    }
  t.length = 0;
}, gc = () => {
  Hf(Uf), Hf(Q0), (dc = Uf.length > 0) && zt.raf(gc);
}, Il = (t) => Z0().then(t), nE = /* @__PURE__ */ eE(Q0), rE = () => Z0(), sE = (t, e) => typeof window > "u" ? Promise.resolve() : rE().then(() => X4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var iE = Object.defineProperty, oE = Object.defineProperties, aE = Object.getOwnPropertyDescriptors, co = Object.getOwnPropertySymbols, J0 = Object.prototype.hasOwnProperty, tp = Object.prototype.propertyIsEnumerable, Nf = (t, e, n) => e in t ? iE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, he = (t, e) => {
  for (var n in e || (e = {})) J0.call(e, n) && Nf(t, n, e[n]);
  if (co) for (var n of co(e)) tp.call(e, n) && Nf(t, n, e[n]);
  return t;
}, Le = (t, e) => oE(t, aE(e)), ep = (t, e) => {
  var n = {};
  for (var r in t) J0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && co) for (var r of co(t)) e.indexOf(r) < 0 && tp.call(t, r) && (n[r] = t[r]);
  return n;
};
function np() {
  return _o(dr()) || window.StacksProvider || window.BlockstackProvider;
}
function jo(t) {
  return t ? typeof t == "string" ? gr.fromName(t) : "version" in t ? t : "url" in t ? new Ra({ url: t.url }) : t.transactionVersion === wr.Mainnet ? new Ra({ url: t.client.baseUrl }) : new Ga({ url: t.client.baseUrl }) : new Ga();
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
  let e = vl(t).loadUserData().appPrivateKey, n = Ft.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function uE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [yr.Mainnet]: "mainnet", [yr.Testnet]: "testnet" }, a = jo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function fE(t) {
  let e = jo(t.network), n = vl(t.userSession), r = Le(he({}, t), { network: e, userSession: n });
  return he({ stxAddress: uE(r) }, r);
}
async function hE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(B0) : n = n.map((r) => W(D0(r)))), new Ft.TokenSigner("ES256k", e).signAsync(Le(he({}, t), { postConditions: n }));
}
function dE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(B0) : e = e.map((n) => W(D0(n)))), Ft.createUnsecuredToken(Le(he({}, t), { postConditions: e }));
}
var pE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = ut(a.replace(/^0x/, "")), l = s3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Le(he({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Le(he({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, gE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ep(e, ["amount", "appDetails", "userSession"]);
  if (rp(s)) {
    let { privateKey: a, publicKey: c } = sp(s), l = Le(he({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), hE(l, a);
  }
  let o = Le(he({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), dE(o);
};
async function yE(t, e, n) {
  let r = await e(Le(he(he({}, fE(t)), t), { network: jo(t.network) }));
  return pE({ token: r, options: t }, n);
}
function wE(t, e = np()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return yE(t, gE, e);
}
function ip(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Le(he({}, t), { message: uf(e), domain: uf(n) }) : Le(he({}, t), { message: W(xr(e)), domain: W(xr(n)) });
}
async function bE(t, e) {
  return new Ft.TokenSigner("ES256k", e).signAsync(ip(t));
}
async function xE(t) {
  let e = t, { userSession: n } = e, r = ep(e, ["userSession"]);
  if (rp(n)) {
    let { privateKey: s, publicKey: i } = sp(n), o = Le(he({}, r), { publicKey: i });
    return bE(o, s);
  }
  return Ft.createUnsecuredToken(ip(t));
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
    let i = dr(), o = np();
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
    let p = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", p), l.remove());
    };
    document.addEventListener("keydown", p);
  };
}
var Mi = IE(wE);
function Gn(t, e, n) {
  return Ll(Yt(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = $t(r);
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
      const r = CE(BigInt(`0x${at(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${at(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Of(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ri(t, e = 8) {
  return (typeof t == "bigint" ? t : Yt(t, !1)).toString(16).padStart(e * 2, "0");
}
function Fo(t) {
  return parseInt(t, 16);
}
function Ll(t, e = 16) {
  const n = ri(t, e);
  return $t(n);
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
function at(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += BE[n];
  return e;
}
function $t(t) {
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
function ms(t) {
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
function Ut(t) {
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
  const e = typeof t == "string" ? $t(t) : t;
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
function mr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yc || (yc = {}));
const DE = yc.Mainnet, jE = 128, FE = 128, lp = 16, ir = 32, wc = 80, Ro = 65, zE = 32, RE = 64, lo = 34;
var q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(q || (q = {}));
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
var ls;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ls || (ls = {}));
var ee;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ee || (ee = {}));
var kt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(kt || (kt = {}));
var bt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(bt || (bt = {}));
var fo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(fo || (fo = {}));
var Lt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lt || (Lt = {}));
var Vs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vs || (Vs = {}));
var xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(xc || (xc = {}));
var Ks;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ks || (Ks = {}));
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
const nr = {
  number: mc,
  bool: VE,
  bytes: up,
  hash: KE,
  exists: qE,
  output: WE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Sa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ue = (t, e) => t << 32 - e | t >>> e, YE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Mr(t) {
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
    nr.exists(this);
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
    nr.exists(this), nr.output(e, this), this.finished = !0;
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, p = u;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, b = n8[h], I = r8[h], k = Ml[h], M = _l[h], x = t8[h], L = e8[h];
      for (let A = 0; A < 16; A++) {
        const U = _i(r + Kf(h, i, a, l) + Ti[k[A]] + b, x[A]) + u | 0;
        r = u, u = l, l = _i(a, 10) | 0, a = i, i = U;
      }
      for (let A = 0; A < 16; A++) {
        const U = _i(s + Kf(w, o, c, f) + Ti[M[A]] + I, L[A]) + p | 0;
        s = p, p = f, f = _i(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + p | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ti.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const i8 = Mr(() => new s8()), o8 = (t, e, n) => t & e ^ ~t & n, a8 = (t, e, n) => t & e ^ t & n ^ e & n, c8 = new Uint32Array([
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
]), _n = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Tn = new Uint32Array(64);
class pp extends kl {
  constructor() {
    super(64, 32, 8, !1), this.A = _n[0] | 0, this.B = _n[1] | 0, this.C = _n[2] | 0, this.D = _n[3] | 0, this.E = _n[4] | 0, this.F = _n[5] | 0, this.G = _n[6] | 0, this.H = _n[7] | 0;
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
      Tn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const p = Tn[u - 15], h = Tn[u - 2], w = Ue(p, 7) ^ Ue(p, 18) ^ p >>> 3, b = Ue(h, 17) ^ Ue(h, 19) ^ h >>> 10;
      Tn[u] = b + Tn[u - 7] + w + Tn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const p = Ue(a, 6) ^ Ue(a, 11) ^ Ue(a, 25), h = f + p + o8(a, c, l) + c8[u] + Tn[u] | 0, b = (Ue(r, 2) ^ Ue(r, 13) ^ Ue(r, 22)) + a8(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Tn.fill(0);
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
const Tl = Mr(() => new pp());
Mr(() => new l8());
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
].map((t) => BigInt(t))), Un = new Uint32Array(80), Hn = new Uint32Array(80);
class Go extends kl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: p, Gh: h, Gl: w, Hh: b, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, p, h, w, b, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Un[x] = e.getUint32(n), Hn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = Un[x - 15] | 0, A = Hn[x - 15] | 0, U = rt.rotrSH(L, A, 1) ^ rt.rotrSH(L, A, 8) ^ rt.shrSH(L, A, 7), z = rt.rotrSL(L, A, 1) ^ rt.rotrSL(L, A, 8) ^ rt.shrSL(L, A, 7), N = Un[x - 2] | 0, P = Hn[x - 2] | 0, m = rt.rotrSH(N, P, 19) ^ rt.rotrBH(N, P, 61) ^ rt.shrSH(N, P, 6), v = rt.rotrSL(N, P, 19) ^ rt.rotrBL(N, P, 61) ^ rt.shrSL(N, P, 6), T = rt.add4L(z, v, Hn[x - 7], Hn[x - 16]), R = rt.add4H(T, U, m, Un[x - 7], Un[x - 16]);
      Un[x] = R | 0, Hn[x] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: p, Fh: h, Fl: w, Gh: b, Gl: I, Hh: k, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = rt.rotrSH(u, p, 14) ^ rt.rotrSH(u, p, 18) ^ rt.rotrBH(u, p, 41), A = rt.rotrSL(u, p, 14) ^ rt.rotrSL(u, p, 18) ^ rt.rotrBL(u, p, 41), U = u & h ^ ~u & b, z = p & w ^ ~p & I, N = rt.add5L(M, A, z, _8[x], Hn[x]), P = rt.add5H(N, k, L, U, M8[x], Un[x]), m = N | 0, v = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), T = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), R = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      k = b | 0, M = I | 0, b = h | 0, I = w | 0, h = u | 0, w = p | 0, { h: u, l: p } = rt.add(l | 0, f | 0, P | 0, m | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = rt.add3L(m, T, Y);
      r = rt.add3H(j, P, v, R), s = j | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = rt.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: p } = rt.add(this.Eh | 0, this.El | 0, u | 0, p | 0), { h, l: w } = rt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: b, l: I } = rt.add(this.Gh | 0, this.Gl | 0, b | 0, I | 0), { h: k, l: M } = rt.add(this.Hh | 0, this.Hl | 0, k | 0, M | 0), this.set(r, s, i, o, a, c, l, f, u, p, h, w, b, I, k, M);
  }
  roundClean() {
    Un.fill(0), Hn.fill(0);
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
Mr(() => new Go());
Mr(() => new T8());
const N8 = Mr(() => new U8());
Mr(() => new H8());
function yp(t) {
  if ($t(t).byteLength != Ro)
    throw Error("Invalid signature");
  return {
    type: q.MessageSignature,
    data: t
  };
}
function Bs(t, e) {
  return { type: q.Address, version: t, hash160: e };
}
function qr(t) {
  return Cr.c32address(t.version, t.hash160);
}
function Sr(t, e, n) {
  const r = e || 1, s = n || jE;
  if (Tp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ul(t) {
  const e = Cr.c32addressDecode(t);
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
function P8(t) {
  if (t.type === _.PrincipalStandard)
    return qr(t.address);
  if (t.type === _.PrincipalContract)
    return `${qr(t.address)}.${t.contractName.content}`;
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
  const n = Ul(t), r = Sr(e);
  return bp(n, r);
}
function bp(t, e) {
  if (ms(e.content).byteLength >= 128)
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
      return `0x${at(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return rn(t.value);
    case _.ResponseErr:
      return rn(t.value);
    case _.ResponseOk:
      return rn(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return P8(t);
    case _.List:
      return t.list.map((r) => rn(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = rn(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function rn(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: On(t), value: Ea(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: On(t), value: Ea(t, !0), success: !0 };
    default:
      return { type: On(t), value: Ea(t, !0) };
  }
}
function On(t) {
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
      return `(optional ${On(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${On(t.value)})`;
    case _.ResponseOk:
      return `(response ${On(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? On(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${On(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${ap(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${ms(t.data).length})`;
  }
}
const xp = () => ({ type: _.BoolTrue }), mp = () => ({ type: _.BoolFalse }), F8 = (t) => t ? xp() : mp(), qf = BigInt("0xffffffffffffffffffffffffffffffff"), z8 = BigInt(0), Wf = BigInt("0x7fffffffffffffffffffffffffffffff"), Yf = BigInt("-170141183460469231731687303715884105728"), R8 = (t) => {
  const e = Yt(t, !0);
  if (e > Wf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wf}`);
  if (e < Yf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yf}`);
  return { type: _.Int, value: e };
}, ho = (t) => {
  const e = Yt(t, !1);
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
const Rr = (t) => ({ type: _.StringASCII, data: t }), q8 = (t) => ({ type: _.StringUTF8, data: t });
class $p extends fp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, nr.hash(e);
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
    return nr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    nr.exists(this), nr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
Mt.hmacSha256Sync = (t, ...e) => {
  const n = Ip.create(Tl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function us(t) {
  return {
    type: q.PublicKey,
    data: $t(t)
  };
}
function W8(t, e, n = Lt.Compressed) {
  const r = _E(e.data), s = new ue(Of(r.r), Of(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === Lt.Compressed;
  return i.toHex(o);
}
function Y8(t) {
  return { type: q.PublicKey, data: t };
}
function Ss(t) {
  return !at(t.data).startsWith("04");
}
function po(t) {
  return t.data.slice();
}
function X8(t) {
  const e = J8(t), n = Qs(e.data.slice(0, 32), e.compressed);
  return us(at(n));
}
function Z8(t) {
  const e = typeof t == "string" ? t : at(t), n = it.fromHex(e).toHex(!0);
  return us(n);
}
function Q8(t) {
  const e = typeof t == "string" ? t : at(t), n = it.fromHex(e).toHex(!1);
  return us(n);
}
function Ac(t) {
  const e = t.readUInt8(), n = e === 4 ? RE : zE;
  return Y8(Ut([e, t.readBytes(n)]));
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
  const i = ri(r, 1) + ue.fromHex(n).toCompactHex();
  return yp(i);
}
function eA(t) {
  return X8(t.data);
}
function nA(t, e, n) {
  return typeof t == "string" && (t = wp(t)), typeof n == "string" && (n = Qf(n)), {
    type: q.Payload,
    payloadType: st.TokenTransfer,
    recipient: t,
    amount: Yt(e, !1),
    memo: n ?? Qf("")
  };
}
function rA(t, e, n, r) {
  return typeof t == "string" && (t = Ul(t)), typeof e == "string" && (e = Sr(e)), typeof n == "string" && (n = Sr(n)), {
    type: q.Payload,
    payloadType: st.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Xf(t, e, n) {
  return typeof t == "string" && (t = Sr(t)), typeof e == "string" && (e = hA(e)), typeof n == "number" ? {
    type: q.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: q.Payload,
    payloadType: st.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function sA() {
  return { type: q.Payload, payloadType: st.PoisonMicroblock };
}
function Zf(t, e) {
  if (t.byteLength != ir)
    throw Error(`Coinbase buffer size must be ${ir} bytes`);
  return e != null ? {
    type: q.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: q.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: t
  };
}
function iA(t, e, n) {
  if (t.byteLength != ir)
    throw Error(`Coinbase buffer size must be ${ir} bytes`);
  if (n.byteLength != wc)
    throw Error(`VRF proof buffer size must be ${wc} bytes`);
  return {
    type: q.Payload,
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
    type: q.Payload,
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
      e.push(_t(t.recipient)), e.push(Gn(t.amount, !1, 8)), e.push(en(t.memo));
      break;
    case st.ContractCall:
      e.push(en(t.contractAddress)), e.push(en(t.contractName)), e.push(en(t.functionName));
      const n = new Uint8Array(4);
      mr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_t(r));
      });
      break;
    case st.SmartContract:
      e.push(en(t.contractName)), e.push(en(t.codeBody));
      break;
    case st.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(en(t.contractName)), e.push(en(t.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_t(t.recipient));
      break;
    case st.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_t(t.recipient ? Ap(t.recipient) : Ep())), e.push(t.vrfProof);
      break;
    case st.TenureChange:
      e.push($t(t.tenureHash)), e.push($t(t.previousTenureHash)), e.push($t(t.burnViewHash)), e.push($t(t.previousTenureEnd)), e.push(mr(new Uint8Array(4), t.previousTenureBlocks)), e.push(PE(new Uint8Array(1), t.cause)), e.push($t(t.publicKeyHash));
      break;
  }
  return Ut(e);
}
function aA(t) {
  switch (t.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = be(t), r = Yt(t.readBytes(8), !1), s = Cp(t);
      return nA(n, r, s);
    case st.ContractCall:
      const i = fs(t), o = we(t), a = we(t), c = [], l = t.readUInt32BE();
      for (let x = 0; x < l; x++) {
        const L = be(t);
        c.push(L);
      }
      return rA(i, o, a, c);
    case st.SmartContract:
      const f = we(t), u = we(t, 4, 1e5);
      return Xf(f, u);
    case st.VersionedSmartContract: {
      const x = t.readUInt8Enum(bc, (U) => {
        throw new Error(`Cannot recognize ClarityVersion: ${U}`);
      }), L = we(t), A = we(t, 4, 1e5);
      return Xf(L, A, x);
    }
    case st.PoisonMicroblock:
      return sA();
    case st.Coinbase: {
      const x = t.readBytes(ir);
      return Zf(x);
    }
    case st.CoinbaseToAltRecipient: {
      const x = t.readBytes(ir), L = be(t);
      return Zf(x, L);
    }
    case st.NakamotoCoinbase: {
      const x = t.readBytes(ir), L = be(t), A = t.readBytes(wc);
      return iA(x, L, A);
    }
    case st.TenureChange:
      const p = at(t.readBytes(20)), h = at(t.readBytes(20)), w = at(t.readBytes(20)), b = at(t.readBytes(32)), I = t.readUInt32BE(), k = t.readUInt8Enum($c, (x) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${x}`);
      }), M = at(t.readBytes(20));
      return oA(p, h, w, b, I, k, M);
  }
}
class Vo extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Zn extends Vo {
  constructor(e) {
    super(e);
  }
}
class le extends Vo {
  constructor(e) {
    super(e);
  }
}
class go extends Vo {
  constructor(e) {
    super(e);
  }
}
class rr extends Vo {
  constructor(e) {
    super(e);
  }
}
var $e;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})($e || ($e = {}));
function Ic(t) {
  return yp(at(t.readBytes(Ro)));
}
function Wr(t, e) {
  return {
    pubKeyEncoding: t,
    type: q.TransactionAuthField,
    contents: e
  };
}
function cA(t) {
  const e = t.readUInt8Enum($e, (n) => {
    throw new le(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case $e.PublicKeyCompressed:
      return Wr(Lt.Compressed, Ac(t));
    case $e.PublicKeyUncompressed:
      return Wr(Lt.Uncompressed, Q8(Ac(t).data));
    case $e.SignatureCompressed:
      return Wr(Lt.Compressed, Ic(t));
    case $e.SignatureUncompressed:
      return Wr(Lt.Uncompressed, Ic(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Hl(t) {
  return $t(t.data);
}
function lA(t) {
  const e = [];
  switch (t.contents.type) {
    case q.PublicKey:
      e.push(t.pubKeyEncoding === Lt.Compressed ? $e.PublicKeyCompressed : $e.PublicKeyUncompressed), e.push(po(Z8(t.contents.data)));
      break;
    case q.MessageSignature:
      e.push(t.pubKeyEncoding === Lt.Compressed ? $e.SignatureCompressed : $e.SignatureUncompressed), e.push(Hl(t.contents));
      break;
  }
  return Ut(e);
}
function en(t) {
  switch (t.type) {
    case q.Address:
      return si(t);
    case q.Principal:
      return Lp(t);
    case q.LengthPrefixedString:
      return hs(t);
    case q.MemoString:
      return dA(t);
    case q.AssetInfo:
      return Bp(t);
    case q.PostCondition:
      return pA(t);
    case q.PublicKey:
      return po(t);
    case q.LengthPrefixedList:
      return Ol(t);
    case q.Payload:
      return vp(t);
    case q.TransactionAuthField:
      return lA(t);
    case q.MessageSignature:
      return Hl(t);
  }
}
function uA() {
  return {
    type: q.Address,
    version: fo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Nl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === bt.SerializeP2WPKH || e === bt.SerializeP2WSH || e === bt.SerializeP2WSHNonSequential) && !r.every(Ss))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case bt.SerializeP2PKH:
      return Bs(t, MA(r[0].data));
    case bt.SerializeP2WPKH:
      return Bs(t, _A(r[0].data));
    case bt.SerializeP2SH:
    case bt.SerializeP2SHNonSequential:
      return Bs(t, TA(n, r.map(po)));
    case bt.SerializeP2WSH:
    case bt.SerializeP2WSHNonSequential:
      return Bs(t, UA(n, r.map(po)));
  }
}
function si(t) {
  const e = [];
  return e.push($t(ri(t.version, 1))), e.push($t(t.hash160)), Ut(e);
}
function fs(t) {
  const e = Fo(at(t.readBytes(1))), n = at(t.readBytes(20));
  return { type: q.Address, version: e, hash160: n };
}
function Lp(t) {
  const e = [];
  return e.push(t.prefix), e.push(si(t.address)), t.prefix === Ks.Contract && e.push(hs(t.contractName)), Ut(e);
}
function fA(t) {
  const e = t.readUInt8Enum(Ks, (s) => {
    throw new le(`Unexpected Principal payload type: ${s}`);
  }), n = fs(t);
  if (e === Ks.Standard)
    return { type: q.Principal, prefix: e, address: n };
  const r = we(t);
  return {
    type: q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function hs(t) {
  const e = [], n = ms(t.content), r = n.byteLength;
  return e.push($t(ri(r, t.lengthPrefixBytes))), e.push(n), Ut(e);
}
function we(t, e, n) {
  e = e || 1;
  const r = Fo(at(t.readBytes(e))), s = Cl(t.readBytes(r));
  return Sr(s, e, n ?? 128);
}
function hA(t) {
  return Sr(t, 4, 1e5);
}
function Qf(t) {
  if (t && Tp(t, lo))
    throw new Error(`Memo exceeds maximum length of ${lo} bytes`);
  return { type: q.MemoString, content: t };
}
function dA(t) {
  const e = [], n = ms(t.content), r = kA(at(n), lo * 2);
  return e.push($t(r)), Ut(e);
}
function Cp(t) {
  let e = Cl(t.readBytes(lo));
  return e = e.replace(/\u0000*$/, ""), { type: q.MemoString, content: e };
}
function Bp(t) {
  const e = [];
  return e.push(si(t.address)), e.push(hs(t.contractName)), e.push(hs(t.assetName)), Ut(e);
}
function vc(t) {
  return {
    type: q.AssetInfo,
    address: fs(t),
    contractName: we(t),
    assetName: we(t)
  };
}
function Pl(t, e) {
  return {
    type: q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ol(t) {
  const e = t.values, n = [];
  n.push($t(ri(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(en(r));
  return Ut(n);
}
function kp(t, e, n) {
  const r = Fo(at(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case q.Address:
        s.push(fs(t));
        break;
      case q.LengthPrefixedString:
        s.push(we(t));
        break;
      case q.MemoString:
        s.push(Cp(t));
        break;
      case q.AssetInfo:
        s.push(vc(t));
        break;
      case q.PostCondition:
        s.push(gA(t));
        break;
      case q.PublicKey:
        s.push(Ac(t));
        break;
      case q.TransactionAuthField:
        s.push(cA(t));
        break;
    }
  return Pl(s, n);
}
function pA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Lp(t.principal)), (t.conditionType === ee.Fungible || t.conditionType === ee.NonFungible) && e.push(Bp(t.assetInfo)), t.conditionType === ee.NonFungible && e.push(_t(t.assetName)), e.push(t.conditionCode), t.conditionType === ee.STX || t.conditionType === ee.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zn("The post-condition amount may not be larger than 8 bytes");
    e.push(Gn(t.amount, !1, 8));
  }
  return Ut(e);
}
function gA(t) {
  const e = t.readUInt8Enum(ee, (o) => {
    throw new le(`Could not read ${o} as PostConditionType`);
  }), n = fA(t);
  let r, s, i;
  switch (e) {
    case ee.STX:
      return r = t.readUInt8Enum(Vs, (a) => {
        throw new le(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${at(t.readBytes(8))}`), {
        type: q.PostCondition,
        conditionType: ee.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case ee.Fungible:
      return s = vc(t), r = t.readUInt8Enum(Vs, (a) => {
        throw new le(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${at(t.readBytes(8))}`), {
        type: q.PostCondition,
        conditionType: ee.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case ee.NonFungible:
      s = vc(t);
      const o = be(t);
      return r = t.readUInt8Enum(xc, (a) => {
        throw new le(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: q.PostCondition,
        conditionType: ee.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Ge(t, e) {
  return Ut([t, e]);
}
function yA(t) {
  return new Uint8Array([t.type]);
}
function wA(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Ge(t.type, _t(t.value));
}
function bA(t) {
  const e = new Uint8Array(4);
  return mr(e, t.buffer.length, 0), Ge(t.type, zo(e, t.buffer));
}
function xA(t) {
  const e = Ll(vE(t.value, BigInt(FE)), lp);
  return Ge(t.type, e);
}
function mA(t) {
  const e = Ll(t.value, lp);
  return Ge(t.type, e);
}
function SA(t) {
  return Ge(t.type, si(t.address));
}
function EA(t) {
  return Ge(t.type, zo(si(t.address), hs(t.contractName)));
}
function AA(t) {
  return Ge(t.type, _t(t.value));
}
function $A(t) {
  const e = [], n = new Uint8Array(4);
  mr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = _t(r);
    e.push(s);
  }
  return Ge(t.type, Ut(e));
}
function IA(t) {
  const e = [], n = new Uint8Array(4);
  mr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Sr(s);
    e.push(hs(i));
    const o = _t(t.data[s]);
    e.push(o);
  }
  return Ge(t.type, Ut(e));
}
function Mp(t, e) {
  const n = [], r = e == "ascii" ? ap(t.data) : ms(t.data), s = new Uint8Array(4);
  return mr(s, r.length, 0), n.push(s), n.push(r), Ge(t.type, Ut(n));
}
function vA(t) {
  return Mp(t, "ascii");
}
function LA(t) {
  return Mp(t, "utf8");
}
function _t(t) {
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
      throw new Zn("Unable to serialize. Invalid Clarity Value.");
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
class Us {
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
    const n = this.readBytes(e).slice().reverse(), r = at(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = at(n);
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
function be(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Us($t(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Us(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new le(`Cannot recognize Clarity Type: ${r}`);
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
      const s = fs(e);
      return D8(s);
    case _.PrincipalContract:
      const i = fs(e), o = we(e);
      return bp(i, o);
    case _.ResponseOk:
      return V8(be(e));
    case _.ResponseErr:
      return G8(be(e));
    case _.OptionalNone:
      return Ep();
    case _.OptionalSome:
      return Ap(be(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(be(e));
      return K8(c);
    case _.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let b = 0; b < l; b++) {
        const I = we(e).content;
        if (I === void 0)
          throw new le('"content" is undefined');
        f[I] = be(e);
      }
      return Ec(f);
    case _.StringASCII:
      const u = e.readUInt32BE(), p = kE(e.readBytes(u));
      return Rr(p);
    case _.StringUTF8:
      const h = e.readUInt32BE(), w = Cl(e.readBytes(h));
      return q8(w);
    default:
      throw new le("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const BA = (t) => t.length % 2 == 0 ? t : `0${t}`, kA = (t, e) => t.padEnd(e, "0"), Tp = (t, e) => t ? ms(t).length > e : !1;
function Lc(t) {
  return Qd(t);
}
const qs = (t) => i8(Tl(t)), Dl = (t) => at(N8(t)), MA = (t) => at(qs(t)), _A = (t) => {
  const e = qs(t), n = zo(new Uint8Array([0]), new Uint8Array([e.length]), e), r = qs(n);
  return at(r);
}, TA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = qs(r);
  return at(s);
}, UA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ut(n), s = Tl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ut(i), a = qs(o);
  return at(a);
};
function HA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Up(t) {
  const e = _t(t);
  return `0x${at(e)}`;
}
function NA(t) {
  return be(t);
}
const Hs = (t) => {
  try {
    return Cr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function jl() {
  return {
    type: q.MessageSignature,
    data: at(new Uint8Array(Ro))
  };
}
function Hp(t, e, n, r) {
  const s = Nl(0, t, 1, [us(e)]).hash160, i = Ss(us(e)) ? Lt.Compressed : Lt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Yt(n, !1),
    fee: Yt(r, !1),
    keyEncoding: i,
    signature: jl()
  };
}
function Ws(t) {
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
  return e.nonce = 0, e.fee = 0, Ws(e) ? e.signature = jl() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function OA(t) {
  const e = [
    t.hashMode,
    $t(t.signer),
    Gn(t.nonce, !1, 8),
    Gn(t.fee, !1, 8),
    t.keyEncoding,
    Hl(t.signature)
  ];
  return Ut(e);
}
function DA(t) {
  const e = [
    t.hashMode,
    $t(t.signer),
    Gn(t.nonce, !1, 8),
    Gn(t.fee, !1, 8)
  ], n = Pl(t.fields);
  e.push(Ol(n));
  const r = new Uint8Array(2);
  return HE(r, t.signaturesRequired, 0), e.push(r), Ut(e);
}
function jA(t, e) {
  const n = at(e.readBytes(20)), r = BigInt(`0x${at(e.readBytes(8))}`), s = BigInt(`0x${at(e.readBytes(8))}`), i = e.readUInt8Enum(Lt, (a) => {
    throw new le(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === bt.SerializeP2WPKH && i != Lt.Compressed)
    throw new le("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = at(e.readBytes(20)), r = BigInt("0x" + at(e.readBytes(8))), s = BigInt("0x" + at(e.readBytes(8))), i = kp(e, q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case q.PublicKey:
        Ss(l.contents) || (o = !0);
        break;
      case q.MessageSignature:
        if (l.pubKeyEncoding === Lt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new rr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === bt.SerializeP2WSH || t === bt.SerializeP2WSHNonSequential))
    throw new rr("Uncompressed keys are not allowed in this hash mode");
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
  return Ws(t) ? OA(t) : DA(t);
}
function $a(t) {
  const e = t.readUInt8Enum(bt, (n) => {
    throw new le(`Could not parse ${n} as AddressHashMode`);
  });
  return e === bt.SerializeP2PKH || e === bt.SerializeP2WPKH ? jA(e, t) : FA(e, t);
}
function Np(t, e, n, r) {
  const i = t + at(new Uint8Array([e])) + at(Gn(n, !1, 8)) + at(Gn(r, !1, 8));
  if ($t(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Dl($t(i));
}
function Pp(t, e, n) {
  const r = 33 + Ro, s = Ss(e) ? Lt.Compressed : Lt.Uncompressed, i = t + BA(s.toString(16)) + n.data, o = $t(i);
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
  const o = Np(t, e, n, r), a = us(W8(o, i, s)), c = Pp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function RA() {
  const t = Hp(bt.SerializeP2PKH, "", 0, 0);
  return t.signer = uA().hash160, t.keyEncoding = Lt.Compressed, t.signature = jl(), t;
}
function nh(t, e, n) {
  return Ws(t) ? GA(t, e, n) : VA(t, e, n);
}
function GA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Op(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Nl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new rr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function VA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case q.PublicKey:
        Ss(c.contents) || (i = !0), r.push(c.contents);
        break;
      case q.MessageSignature:
        c.pubKeyEncoding === Lt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = Op(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (th(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new rr("Too many signatures");
        break;
    }
  if (th(t.hashMode) && o !== t.signaturesRequired || PA(t.hashMode) && o < t.signaturesRequired)
    throw new rr("Incorrect number of signatures");
  if (i && (t.hashMode === bt.SerializeP2WSH || t.hashMode === bt.SerializeP2WSHNonSequential))
    throw new rr("Uncompressed keys are not allowed in this hash mode");
  const a = Nl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new rr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Dp(t) {
  return {
    authType: kt.Standard,
    spendingCondition: t
  };
}
function jp(t, e) {
  return {
    authType: kt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Hp(bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function rh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case kt.Standard:
        return Dp(eh(t.spendingCondition));
      case kt.Sponsored:
        return jp(eh(t.spendingCondition), RA());
      default:
        throw new go("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function KA(t, e) {
  switch (t.authType) {
    case kt.Standard:
      return nh(t.spendingCondition, e, kt.Standard);
    case kt.Sponsored:
      return nh(t.spendingCondition, e, kt.Standard);
    default:
      throw new go("Invalid origin auth type");
  }
}
function qA(t, e) {
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
function WA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Yt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function YA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Yt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function XA(t, e) {
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
function ZA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case kt.Standard:
      e.push(Aa(t.spendingCondition));
      break;
    case kt.Sponsored:
      e.push(Aa(t.spendingCondition)), e.push(Aa(t.sponsorSpendingCondition));
      break;
  }
  return Ut(e);
}
function QA(t) {
  const e = t.readUInt8Enum(kt, (r) => {
    throw new le(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case kt.Standard:
      return n = $a(t), Dp(n);
    case kt.Sponsored:
      n = $a(t);
      const r = $a(t);
      return jp(n, r);
  }
}
class JA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Yt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? DE, this.postConditionMode = i ?? ls.Deny, this.postConditions = s ?? Pl([]), o)
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
    return this.signAndAppend(this.auth.spendingCondition, e, kt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === kt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, kt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ws(n)) {
      const r = Ss(e);
      n.fields.push(Wr(r ? Lt.Compressed : Lt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = zA(n, r, e.fee, e.nonce, s);
    return Ws(e) ? e.signature = i : e.fields.push(Wr(s.data.byteLength === cp ? Lt.Compressed : Lt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Dl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != kt.Sponsored)
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
    if (this.auth.authType != kt.Sponsored)
      throw new go("Cannot sponsor sign a non-sponsored transaction");
    this.auth = YA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Zn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Zn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Zn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Zn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Zn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return mr(n, this.chainId, 0), e.push(n), e.push(ZA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ol(this.postConditions)), e.push(vp(this.payload)), Ut(e);
  }
}
function Fl(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Us($t(t.slice(2))) : e = new Us($t(t)) : t instanceof Uint8Array ? e = new Us(t) : e = t;
  const n = e.readUInt8Enum(uo, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = QA(e), i = e.readUInt8Enum(te, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(ls, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = kp(e, q.PostCondition), c = aA(e);
  return new JA(n, s, c, a, o, i, r);
}
const t6 = F8, Ns = ho, e6 = Sp;
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
], Ko = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), _r = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, on = (t, e) => {
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
}, zp = (t) => t ? Fp(_r()).some(
  (e) => {
    var n;
    return e.id === t && (Ko(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Rp = () => {
  if (typeof window > "u")
    return;
  const t = _r(), e = Fp(t).filter(
    (n) => {
      var r;
      return Ko(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = on(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of r6) {
    const r = on(t, n) ?? (t === window ? void 0 : on(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, o6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = _r(), n = on(e, t) ?? (e === window ? void 0 : on(window, t)) ?? _o(t);
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
const Gp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ce = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, l6 = (t) => {
  const e = ce(t);
  if (!e)
    return null;
  const n = Gp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, u6 = (t) => {
  const e = ce(t);
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
}, or = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Ys = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Hs(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ys(s, e + 1);
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
    const i = Ys(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Hs(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Hs(n.testnet) ? n.testnet.trim() : null;
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
}, Er = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ce(n == null ? void 0 : n.message) ?? ce(e.message) ?? ce(e.error) ?? ce(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ds = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Er(e);
    if (e.status === "error")
      throw Er(e.result ?? e);
  }
  return t;
}, oh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ds(r);
  } catch (r) {
    throw Er(r);
  }
}, Kp = () => Rp(), zl = () => {
  if (typeof window > "u")
    return;
  const t = _r();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = on(t, e) ?? (t === window ? void 0 : on(window, e));
    if (n)
      return n;
  }
}, ah = () => {
  if (typeof window > "u")
    return;
  const t = zl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = _r();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = on(e, n) ?? (e === window ? void 0 : on(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Gi = (t) => {
  var r, s;
  const e = dr();
  if (Ko(e) || zp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = _r() ?? window;
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
      txRaw: n ? ce(t) ?? void 0 : void 0
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
      i = ce(s[a]);
      break;
    }
  const o = ce(s.txId) || ce(s.txid) || ce(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ce(s.txRaw) ?? void 0
    };
  for (const a of sh) {
    const c = Ia(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ce(s[a]) ?? void 0
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
  fee: or(t.fee),
  nonce: or(t.nonce),
  sponsored: t.sponsored === !0
}), ch = (t) => ({
  recipient: t.recipient,
  amount: or(t.amount) ?? "0",
  memo: t.memo,
  network: Cc(t.network),
  address: t.stxAddress,
  fee: or(t.fee),
  nonce: or(t.nonce),
  sponsored: t.sponsored ?? !1
}), qp = "WALLET_ADDRESS_MISMATCH", d6 = 45e3;
let Ps = null;
const Bc = (t) => {
  t && (Ps = { address: t, at: Date.now() });
}, p6 = () => {
  Ps = null;
}, g6 = () => Ps && Date.now() - Ps.at <= d6 ? Ps.address : null, y6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, w6 = async (t) => {
  p6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ds(await t.request("wallet_connect")), n = Ys(e);
  return Bc(n), n;
}, b6 = async (t, e, n, r) => {
  try {
    return ds(await t.request(e, n));
  } catch (s) {
    const i = Er(s);
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
      return ds(await t.request(e, n));
    } catch (a) {
      throw Er(a);
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
    const c = ds(
      await x6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ys(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Vp(c))
      throw Er(c);
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
    o = ds(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Er(c);
  }
  const a = Ys(o);
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
      amount: or(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: or(e.fee) } : {}
    },
    e.stxAddress
  );
  return va(s);
}, E6 = () => dr(), Wp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = dr(), e = t ? o6(t) : void 0;
  if (e)
    return e;
  const n = _r() ?? window;
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
        providerId: dr(),
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
          providerId: dr(),
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
const ph = 1000000n, Os = 1000000n, kc = 50n, wo = 3000n, Rl = 300n, B6 = 3000n, k6 = 50000n, gh = 200n, qo = (t) => t + kc;
function xe(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ph}.${(n % ph).toString().padStart(6, "0")}`;
}
function M6(t, e = Rl) {
  return t <= wo ? 0 : Number((t - wo) / qo(e));
}
function yh(t, e = 0n) {
  const n = Os - t - e;
  return n > 0n ? n : 0n;
}
function _6(t, e = Rl) {
  return t > Os ? "over" : t < wo + qo(e) ? "empty" : t < k6 ? "low" : "ok";
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
const Yp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", La = 3, P6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Mc, Xp] = Yp.split("."), pe = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function _c(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function O6(t) {
  return pe(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ps(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Zp(t, e = []) {
  const n = await ps(`/v2/contracts/call-read/${Mc}/${Xp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Mc, arguments: e.map((r) => "0x" + pe(_t(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return rn(be(n.result));
}
async function D6() {
  const t = await ps(`/v2/contracts/source/${Mc}/${Xp}?proof=0`);
  if (typeof t.source != "string" || await O6(t.source) !== U6) throw Error("Deployed source does not match the tested helper.");
  if (N6(await Zp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Qp(t) {
  return t.startsWith("SP") && Hs(t) && !t.includes(".");
}
async function j6(t) {
  var r;
  if (!Qp(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ps(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ps(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function F6(t) {
  const e = await ps(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function z6(t, e) {
  var s, i;
  const n = await Zp("get-owner", [Ns(t), Ns(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
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
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || qr(Bs(fo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || qr(r.contractAddress) + "." + r.contractName.content !== Yp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || pe(_t(r.functionArgs[0])) !== pe(_t(Ns(t.core))) || pe(_t(r.functionArgs[1])) !== pe(_t(Ns(t.song))) || pe(_t(r.functionArgs[2])) !== pe(_t(e6(_c(t.id)))) || t.amount !== "50" || e.postConditionMode !== ls.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Vs.Equal || i.principal.prefix !== 2 || qr(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || qr(r.contractAddress) + "." + r.contractName.content !== P6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || pe(_t(r.functionArgs[0])) !== pe(_t(Ns(t.song))) || typeof t.liked != "boolean" || pe(_t(r.functionArgs[1])) !== pe(_t(t6(t.liked))) || t.amount !== "0" || e.postConditionMode !== ls.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || rn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const K6 = "xtrata.xyz/radio/listening-wallet", q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", W6 = (t) => ({
  domain: Ec({ name: Rr(K6), version: Rr("1"), "chain-id": ho(1) }),
  message: Ec({
    purpose: Rr(q6),
    main: Rr(t.main),
    listening: Rr(t.listening),
    issued: ho(t.issued)
  })
}), wh = ["prepared", "signed", "unknown", "pending"], Y6 = 30 * 6e4, Fr = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, X6 = 3e3, bh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Z6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = !1, u = !1, p = null, h = !1, w = "", b = "", I, k = null, M, x = [], L, A = -1 / 0;
  const U = /* @__PURE__ */ new Set();
  let z = !1, N = !1, P = !1, m = !1, v = 0, T = null, R = Promise.resolve();
  const Y = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Rl.toString()), j = (S) => !!i && !(i.features ?? []).includes(S), Nt = (S, D) => `xtrata.ppp.v1.${S}:${D}`, g = (S = i == null ? void 0 : i.address) => {
    if (!S) return [];
    try {
      const D = JSON.parse(t.store.get(Nt("entries", S)) || "[]");
      return Array.isArray(D) ? D : [];
    } catch {
      return [];
    }
  }, C = (S) => {
    const D = [S, ...g(S.address).filter((K) => !(K.txid === S.txid && K.kind === S.kind))].slice(0, 200);
    t.store.set(Nt("entries", S.address), JSON.stringify(D));
  }, y = (S = i == null ? void 0 : i.address) => !!S && t.store.get(Nt("on", S)) !== "0", $ = (S) => {
    i != null && i.address && t.store.set(Nt("on", i.address), S ? "1" : "0");
  }, V = () => g().filter((S) => wh.includes(S.status)), X = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(Nt("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, ot = (S) => {
    i != null && i.address && t.store.set(Nt("deposit", i.address), JSON.stringify(S));
  }, ft = () => V().filter((S) => t.now() - S.created > Y6 && U.has(S.txid));
  function Ht() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const S = t.main();
    return S ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== S ? "link" : o === void 0 ? "loading" : o > Os ? "over" : o < wo + qo(Y()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const Ve = () => {
    var S, D;
    return {
      step: Ht(),
      busy: c,
      message: w,
      error: b,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : _6(o, Y()),
      playsLeft: o === void 0 ? 0 : M6(o, Y()),
      allowance: o === void 0 ? Os : yh(o, BigInt(((S = X()) == null ? void 0 : S.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: y(),
      entries: g(),
      depositTxid: ((D = X()) == null ? void 0 : D.txid) ?? I,
      depositPending: !!X(),
      walletOutdated: j("like"),
      linkedListening: L && L === t.main() ? x.map((K) => K.listening) : [],
      serverLinked: !!k && M === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: ft().length,
      armed: P
    };
  }, Ct = (S, D = "") => {
    w = S, b = D, t.changed();
  };
  async function Gt(S, D) {
    if (!c) {
      c = S, b = "", t.changed();
      try {
        await D();
      } catch (K) {
        const F = K instanceof Error ? K.message : String(K);
        b = /Cancelled in the listening wallet/.test(F) ? "" : F, b || (w = "Cancelled. Nothing was signed.", m = !0);
      } finally {
        c = null, await It(!0);
      }
    }
  }
  async function Xt() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Ce(S = !1) {
    i != null && i.address && (!S && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function gt(S) {
    if ((L !== S || t.now() - A >= 6e4) && (x = await t.links(S), L = S, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === S) return;
    const D = `${S}:${i.address}`;
    M === D && k || (k = x.find((K) => K.listening === i.address) ?? null, M = D);
  }
  async function Dt() {
    const S = i == null ? void 0 : i.address;
    if (!S) return;
    let D;
    for (const F of V())
      try {
        const yt = await t.chain.transaction(F.txid);
        if (!yt) {
          if (U.add(F.txid), t.now() - F.created > 15 * 6e4 && (D ?? (D = await t.chain.confirmedNonce(S))), D !== void 0 && D > BigInt(F.nonce)) {
            C({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), C({ ...F, status: "pending" });
            } catch (mt) {
              Fr(mt) && C({ ...F, status: "failed", note: mt.message, raw: void 0 });
            }
          continue;
        }
        U.delete(F.txid);
        const xt = String(yt.tx_status);
        xt === "success" && yt.canonical !== !1 && yt.is_unanchored === !1 ? (C({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(yt.fee_rate ?? F.fee), raw: void 0 }), F.kind === "like" && (h = !0)) : xt.startsWith("abort_") || xt.startsWith("dropped_") ? C({ ...F, status: "failed", note: xt, raw: void 0 }) : F.status !== "pending" && C({ ...F, status: "pending" });
      } catch {
      }
    const K = X();
    if (K)
      try {
        const F = await t.chain.transaction(K.txid), yt = String((F == null ? void 0 : F.tx_status) ?? "");
        (yt === "success" && F.is_unanchored === !1 || yt.startsWith("abort_") || yt.startsWith("dropped_") || !F && t.now() - K.at > 2 * 36e5) && (ot(null), a = -1 / 0);
      } catch {
      }
  }
  async function It(S = !1) {
    var D;
    try {
      const K = t.main();
      if ((S || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !K || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), P && Ke(), t.changed();
        return;
      }
      await Xt(), i = await s.request("listening.status"), await gt(K), await Ce(S), await Dt();
    } catch (K) {
      b = K instanceof Error ? K.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Ht() === "locked" ? un() : P && Ke(), h) {
      h = !1;
      try {
        (D = t.likesChanged) == null || D.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function re(S, D) {
    const K = !(i != null && i.address) || y(i.address);
    await S.request("listening.unlock", { mode: "unlock", terms: K ? qe() : void 0, anyPasskey: D }), i = await S.request("listening.status"), K && (y(i.address) ? await fn() : await S.request("listening.stop")), Ct(K ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
    const F = p;
    p = null, F && t.now() - F.at < 12e4 && setTimeout(() => void It(!0).then(() => Ye(F)), 0);
  }
  function un() {
    P || c || m || v >= 3 || !s || !(i != null && i.address) || (P = !0, R = (async () => {
      try {
        await re(s, !1), v = 0;
      } catch (S) {
        const D = S instanceof Error ? S.message : String(S);
        /Cancelled in the listening wallet/.test(D) ? T || (m = !0, Ct("Cancelled. Nothing was signed.")) : /did not answer/.test(D) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (v++, b = D);
      } finally {
        P = !1;
        const S = T;
        T = null, S ? await S() : await It(!0);
      }
    })());
  }
  async function Ke(S) {
    P && (T = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await R), S && await S(), t.changed();
  }
  const qe = () => ({
    fee: Y().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Os.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function fn() {
    if (!(i != null && i.address)) return !1;
    if (N || (N = await t.tabLock(i.address)), !N)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Tr = {
    forceRefresh: () => It(!0),
    create: () => Gt("Waiting for your passkey in the listening wallet…", async () => {
      const S = await Xt();
      await S.request("listening.unlock", { mode: "create", terms: qe() }), i = await S.request("listening.status"), $(!0), Ct("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await fn();
    }),
    unlock: (S = !1) => {
      const D = () => Gt("Waiting for your passkey in the listening wallet…", async () => re(await Xt(), S));
      return P ? S ? j("cancel") ? (Ct("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Ke(async () => {
        (Ht() === "locked" || Ht() === "intro") && await D();
      }) : R : D();
    },
    link: () => Gt("Waiting for your main wallet to sign…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const D = (await t.links(S)).find((K) => K.listening === i.address);
      if (D)
        await s.request("listening.link", { main: S, issued: D.issued, mainSignature: D.mainSignature });
      else {
        const K = { main: S, listening: i.address, issued: t.now() }, F = await t.signWithMain(S, W6(K)), yt = await s.request("listening.link", { main: S, issued: K.issued, mainSignature: F });
        await t.saveLink({ ...K, mainSignature: F, listeningSignature: yt.listeningSignature }), A = -1 / 0;
      }
      Ct("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => Gt("Waiting for your main wallet to approve the deposit…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (X()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Ce(!0);
      const D = yh(o ?? 0n);
      if (D <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      I = await t.deposit(S, i.address, D), I && ot({ txid: I, amount: D.toString(), at: t.now() }), Ct("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => Gt("Confirm in the listening wallet…", async () => {
      await fn(), await s.request("listening.approveSession", qe()), $(!0), Ct("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Gt("Clearing…", async () => {
      for (const S of ft())
        await t.chain.transaction(S.txid) || C({ ...S, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ct("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => Gt("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), $(!1), Ct("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => Gt("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Ct("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (S) => Gt("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (V().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: D, nonce: K } = await t.chain.account(i.address);
      o = D;
      const F = await s.request("listening.prepareReturn", { mode: S, balance: D.toString(), nonce: K.toString(), fee: B6.toString() });
      if (F.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const yt = Fl(F.raw);
      if (rn(yt.payload.recipient).value !== i.linked || String(yt.payload.amount) !== F.amount)
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
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: F.raw,
        txid: F.txid
      };
      t.validate(xt), C(xt);
      try {
        await t.chain.broadcast(F.raw, F.txid), C({ ...xt, status: "pending" });
      } catch (mt) {
        throw C({ ...xt, status: "unknown", note: mt.message }), mt;
      }
      S === "all" && $(!1), Ct(S === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function We(S) {
    if (!(l || c || f || u)) {
      l = !0;
      try {
        if (await It(), Ht() !== "ready" || !y() || !(i != null && i.session) || i.session.playsLeft < 1 || !N || V().length) return;
        z || (await t.chain.verify(), z = !0);
        const K = i.address, { balance: F, nonce: yt } = await t.chain.account(K);
        o = F, a = t.now();
        const xt = await t.chain.owner(La, S.song);
        if (xt === K || xt === t.main()) return;
        const mt = await s.request("listening.signPlay", {
          core: La,
          song: S.song,
          receipt: S.id,
          fee: Y().toString(),
          nonce: yt.toString(),
          balance: F.toString()
        }), se = {
          id: S.id,
          address: K,
          kind: "play",
          core: La,
          song: S.song,
          recipient: xt,
          amount: "50",
          fee: Y().toString(),
          nonce: yt.toString(),
          created: t.now(),
          status: "signed",
          raw: mt.raw,
          txid: mt.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...S.title ? { title: String(S.title).slice(0, 120) } : {},
          ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
        };
        t.validate(se), C(se);
        const Xe = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`;
        try {
          await t.chain.broadcast(mt.raw, mt.txid), C({ ...se, status: "pending" }), w = `Paid play sent for ${Xe}.`, b = "";
        } catch (Zt) {
          C({ ...se, status: Fr(Zt) ? "failed" : "unknown", note: Zt.message, ...Fr(Zt) ? { raw: void 0 } : {} }), b = Zt.message;
        }
        i = await s.request("listening.status");
      } catch (D) {
        w = "This song played free: " + (D instanceof Error ? D.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  function hn(S) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ht()) || j("like") ? !1 : (Ye(S), !0);
  }
  async function Ye(S) {
    const D = S.title ? `“${S.title}”` : `song #${S.song}`, K = (Zt) => {
      var Be;
      b = Zt, w = "";
      try {
        (Be = t.likeFailed) == null || Be.call(t, S.song);
      } catch {
      }
      t.changed();
    }, F = Ht(), yt = t.main();
    if (F === "locked") {
      p = { ...S, at: t.now() }, Ct(`Unlock to like ${D}: tap “Unlock and keep paying” in the listening wallet box. The like is sent straight after.`);
      return;
    }
    if (F === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (F === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (F === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (F !== "ready" || !yt) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!N) return K("Pay-per-play is running in another tab. Like from that tab.");
    const xt = g().find((Zt) => Zt.kind === "like" && Zt.song === S.song);
    if (xt && wh.includes(xt.status))
      return K(`Your last like for ${D} is still on its way. It can change again once it confirms.`);
    if (f) return K("One like at a time: your last one is still being sent.");
    if ((xt == null ? void 0 : xt.status) === "confirmed" && t.now() - (xt.confirmedAt ?? 0) < X6)
      return K(`Your like for ${D} has only just confirmed. Try again in a moment.`);
    let mt;
    u = !0;
    try {
      mt = t.likeState ? (await t.likeState(yt, S.song)).by : S.likedBy ?? [];
    } catch {
      mt = S.likedBy;
    } finally {
      u = !1;
    }
    if (!mt) return K(`Could not check ${D} right now. Try the heart again.`);
    const se = i.address, Xe = mt.includes(se);
    if (!Xe && mt.length) return K(`${D} was liked from your main wallet${mt.includes(yt) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Z({ song: S.song, liked: !Xe, title: S.title, artist: S.artist });
  }
  async function Z(S) {
    var F, yt, xt;
    if (f) {
      Ct("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const D = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`, K = t.wait ?? ((mt) => new Promise((se) => setTimeout(se, mt)));
    try {
      Ct(`Sending your ${S.liked ? "like" : "unlike"} for ${D} from the listening wallet…`);
      const mt = t.now() + 12e4;
      for (; l || V().length; ) {
        if (t.now() > mt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await It(!0);
      }
      if (Ht() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const se = i.address, { balance: Xe, nonce: Zt } = await t.chain.account(se);
      o = Xe, a = t.now();
      const Be = await s.request("listening.signLike", {
        song: S.song,
        liked: S.liked,
        fee: gh.toString(),
        nonce: Zt.toString(),
        balance: Xe.toString()
      }), Ur = {
        id: bh(),
        address: se,
        kind: "like",
        core: 0,
        song: S.song,
        liked: S.liked,
        recipient: "",
        amount: "0",
        fee: gh.toString(),
        nonce: Zt.toString(),
        created: t.now(),
        status: "signed",
        raw: Be.raw,
        txid: Be.txid,
        ...S.title ? { title: String(S.title).slice(0, 120) } : {},
        ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
      };
      t.validate(Ur), C(Ur);
      try {
        await t.chain.broadcast(Be.raw, Be.txid), C({ ...Ur, status: "pending" }), w = `${S.liked ? "Liked" : "Unliked"} ${D} from your listening wallet, for your main wallet (0.0002 STX).`, b = "";
        try {
          (F = t.likeSent) == null || F.call(t, S.song, S.liked);
        } catch {
        }
      } catch (Kn) {
        if (C({ ...Ur, status: Fr(Kn) ? "failed" : "unknown", note: Kn.message, ...Fr(Kn) ? { raw: void 0 } : {} }), b = Kn.message, Fr(Kn)) try {
          (yt = t.likeFailed) == null || yt.call(t, S.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (mt) {
      b = "Like not sent: " + (mt instanceof Error ? mt.message : "the listening wallet is unavailable");
      try {
        (xt = t.likeFailed) == null || xt.call(t, S.song);
      } catch {
      }
    } finally {
      f = !1, t.changed();
    }
  }
  return { snapshot: Ve, refresh: It, onListened: We, heart: hn, toggleLike: Ye, ...Tr };
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
}, zr = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, C5 = (t) => {
  var c, l;
  let e;
  try {
    e = rn(NA(t));
  } catch {
    return null;
  }
  const n = zr(e);
  if (!n || n.success === !1)
    return null;
  const r = zr(n.value), s = zr(r == null ? void 0 : r.value), i = zr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Sh((c = zr(i.name)) == null ? void 0 : c.value), a = Sh((l = zr(i.namespace)) == null ? void 0 : l.value);
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
  if (!Hs(e))
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
  const e = vy(), n = (g) => t.querySelector(g), r = n(".ppp-frame");
  let s = null;
  const i = async (g, C) => {
    const y = await fetch(g, { cache: "no-store", ...C, signal: AbortSignal.timeout(15e3) }), $ = await y.json().catch(() => ({}));
    if (!y.ok) throw new Error(($ == null ? void 0 : $.error) || `Request failed (${y.status}).`);
    return $;
  }, o = Z6({
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
      const C = new Promise((X, ot) => {
        s.addEventListener("load", () => X(), { once: !0 }), setTimeout(() => ot(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = g + "/", r.replaceChildren(s), await C;
      const y = new wy({ walletOrigin: g, frame: s, timeoutMs: 30 * 6e4 }), $ = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), V = (X, ot) => $.has(X) ? y.request(X, ot) : Promise.race([
        y.request(X, ot),
        new Promise((ft, Ht) => setTimeout(() => Ht(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await V("listening.status"), { request: V };
    },
    chain: {
      verify: D6,
      balance: F6,
      account: j6,
      owner: z6,
      broadcast: R6,
      transaction: G6,
      confirmedNonce: async (g) => {
        const C = await ps(`/v2/accounts/${g}?proof=0`);
        if (!Number.isSafeInteger(C == null ? void 0 : C.nonce) || C.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(C.nonce);
      }
    },
    signWithMain: (g, C) => C6({ ...C, network: "mainnet", stxAddress: g }),
    deposit: (g, C, y) => new Promise(($, V) => A6({
      recipient: C,
      amount: y.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: g,
      network: new vh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (X) => $(X.txId || ""),
      onCancel: () => V(new Error("Deposit cancelled. Nothing was sent.")),
      onError: V
    })),
    validate: V6,
    tabLock: (g) => new Promise((C) => {
      const y = navigator.locks;
      if (!(y != null && y.request)) {
        C(!0);
        return;
      }
      y.request("xtrata-ppp:" + g, { ifAvailable: !0 }, async ($) => {
        C(!!$), $ && await new Promise(() => {
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
      set: (g, C) => {
        try {
          localStorage.setItem(g, C);
        } catch {
        }
      }
    },
    changed: () => Y(o.snapshot()),
    likesChanged: () => {
      var g, C;
      (C = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || C.call(g);
    },
    likeState: async (g, C) => {
      const y = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: g, ids: String(C) })), $ = Array.isArray(y == null ? void 0 : y.rows) ? y.rows.find((V) => (V == null ? void 0 : V.id) === C) : null;
      if (!$ || typeof $.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: $.liked, by: Array.isArray($.by) ? $.by.filter((V) => typeof V == "string") : $.liked ? [g] : [] };
    },
    likeSent: (g, C) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: g, liked: C } })),
    likeFailed: (g) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: g } }))
  });
  window.XtrataRadioLikeHandler = (g) => {
    if (!g || !Number.isSafeInteger(g.song) || g.song < 0) return !1;
    L();
    const C = A(g.song, { title: g.title, artist: g.artist });
    return o.heart({ song: g.song, title: C.title || void 0, artist: C.artist || void 0, likedBy: Array.isArray(g.likedBy) ? g.likedBy : void 0 });
  };
  const a = (g) => g ? g.slice(0, 6) + "…" + g.slice(-4) : "", c = (g) => `https://explorer.hiro.so/txid/${g}?chain=mainnet`, l = (g, C = "", y = "") => {
    const $ = document.createElement(g);
    return C && ($.textContent = C), y && ($.className = y), $;
  }, f = (g, C, y = "") => {
    const $ = l("button", g, y);
    return $.type = "button", $.onclick = C, $;
  }, u = (g, C) => {
    const y = l("a", g);
    return y.href = C, y.target = "_blank", y.rel = "noopener", y;
  };
  let p = null, h = !1;
  const w = /* @__PURE__ */ new Map(), b = (g) => g ? (w.has(g) || (w.set(g, null), k5({ address: g, network: "mainnet" }).then((C) => {
    C && (w.set(g, C), Y(o.snapshot()));
  }).catch(() => {
  })), w.get(g) ?? null) : null, I = (g) => {
    const C = b(g);
    return C ? `${C} · ${a(g)}` : a(g);
  }, k = /* @__PURE__ */ new Map();
  let M = !1;
  const x = (g) => !g || /^(?:Inscription )?#\d+$/.test(g.trim()), L = () => {
    M || (M = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((g) => g.ok ? g.json() : null).then((g) => {
      for (const C of Array.isArray(g == null ? void 0 : g.tracks) ? g.tracks : []) {
        const y = Number(C == null ? void 0 : C.id);
        Number.isSafeInteger(y) && k.set(y, { title: typeof C.title == "string" ? C.title : void 0, artist: typeof C.artist == "string" ? C.artist : void 0 });
      }
      Y(o.snapshot());
    }).catch(() => {
      M = !1;
    }));
  }, A = (g, C) => {
    const y = k.get(g), $ = _5(g, [y == null ? void 0 : y.title, C == null ? void 0 : C.title].find((X) => !x(X)) || ""), V = M5(g, (y == null ? void 0 : y.artist) || (C == null ? void 0 : C.artist) || "");
    return { title: $, artist: V };
  }, U = (g) => {
    const { title: C, artist: y } = A(g.song, g);
    return C ? `“${C}”${y ? ` — ${y}` : ""}` : `Song #${g.song}${y ? ` — ${y}` : ""}`;
  }, z = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, N = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function P(g) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(g.step) ? ["", ""] : g.step === "over" ? ["OVER 1 STX", "bad"] : g.step === "locked" ? ["LOCKED", "mute"] : g.step === "intro" || g.step === "link" ? ["", ""] : g.step === "fund" ? g.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : g.payingOn && g.session && g.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function m(g, C, y = "", $) {
    const V = l("dt", g), X = l("dd", C, y);
    return $ && X.append(" ", $), [V, X];
  }
  const v = document.getElementById("ppp-top"), T = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  };
  v && (v.onclick = () => {
    var C, y;
    const g = o.snapshot();
    if (g.step === "connect") {
      (C = document.getElementById("radio-wallet-connect")) == null || C.click();
      return;
    }
    if (g.step === "elsewhere" && ((y = g.gate) != null && y.radioUrl)) {
      location.href = g.gate.radioUrl;
      return;
    }
    g.step === "locked" && !g.armed && !g.busy && o.unlock(), T();
  });
  function R(g) {
    if (!v) return;
    const C = ($, V, X) => {
      v.hidden = !1, v.className = "ppp-top" + (V ? " is-" + V : ""), v.replaceChildren(l("span", "", "dot"), document.createTextNode($)), v.title = X;
    }, y = g.session ? Math.min(g.session.playsLeft, g.playsLeft) : 0;
    switch (g.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        v.hidden = !0;
        return;
      case "elsewhere":
        return C("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        v.hidden = !0;
        return;
      case "intro":
        return C("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "locked":
        return C(g.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return C("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return C(g.entries.some(($) => $.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return C("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return C("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return g.payingOn && y > 0 ? C(`On · ${y.toLocaleString()} plays left`, "on", "Paying artists as you listen") : C("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  function Y(g) {
    var Tr, We, hn, Ye;
    if (R(g), t.hidden = g.step === "off", t.hidden) return;
    const [C, y] = P(g), $ = n(".ppp-state");
    $.textContent = C, $.className = "ppp-state" + (y ? " ppp-state--" + y : ""), $.hidden = !C;
    const V = !!g.busy || g.armed, X = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(g.step) && (V || !["intro", "loading"].includes(g.step));
    r.hidden = !X, r.classList.toggle("ppp-frame--rest", !V && !h);
    const ot = n(".ppp-frame-label");
    ot.hidden = !X || !V && !h, ot.replaceChildren(l("span", V ? "Listening wallet · tap the button in this box" : "Listening wallet box"));
    const ft = Q6(g) ?? p;
    p = ft;
    const Ht = J6(g, ft);
    n(".ppp-badge").hidden = !Ht;
    const Ve = n(".ppp-steps"), Ct = n(".ppp-stage");
    Ve.hidden = Ct.hidden = !Ht, ft && Ht && (Ve.replaceChildren(...bo.map((Z, S) => {
      const D = l("li", "", S < ft.at ? "done" : S === ft.at ? ft.blocked ? "now blocked" : "now" : "");
      return D.append(l("span", S < ft.at ? "✓" : String(S + 1), "n"), Z), S === ft.at && D.setAttribute("aria-current", "step"), D;
    })), Ct.textContent = ft.caption, Ct.className = "ppp-stage " + (ft.at >= bo.length ? "ppp-ok" : ft.blocked ? "ppp-bad" : "ppp-cyan"));
    const Gt = n(".ppp-facts"), Xt = [];
    if (g.main && ((Tr = g.gate) != null && Tr.here) && Xt.push(...m("Your wallet", I(g.main), "ppp-addr-short")), g.listening) {
      const Z = f("Copy", () => {
        var S;
        return void ((S = navigator.clipboard) == null ? void 0 : S.writeText(g.listening || ""));
      }, "tiny");
      Xt.push(...m("Listening wallet", a(g.listening), "ppp-addr-short", Z));
    }
    if (g.listening && g.step !== "intro" && Xt.push(...g.linked ? m("Linked to", `${I(g.linked)} · returns go here`, g.linked === g.main ? "ppp-ok" : "ppp-warn") : m("Linked to", "not linked yet", "ppp-warn")), g.linkedListening.length && ((We = g.gate) != null && We.here)) {
      const Z = g.linkedListening.map((S) => a(S) + (S === g.listening ? " (this one)" : "")).join(", ");
      Xt.push(...m(g.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const Z = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Xt.push(...m("Balance", `${xe(g.balance)} STX · about ${g.playsLeft.toLocaleString()} plays`, Z));
    }
    const Ce = g.entries.find((Z) => Z.kind === "play");
    Ce && L(), Ce && Xt.push(...m("Last paid song", `${U(Ce)} → ${a(Ce.recipient)}`, z[Ce.status] || "")), Gt.replaceChildren(...Xt), Gt.hidden = !Xt.length;
    const gt = [], Dt = [], It = [], re = [], un = qo(BigInt(((hn = g.gate) == null ? void 0 : hn.limits.playFee) ?? "300")), Ke = `Each song you listen to for 30 seconds sends ${xe(kc)} STX to whoever holds it, plus a ${xe(un - kc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, qe = !!g.busy;
    switch (g.step) {
      case "elsewhere": {
        if (gt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain.")), (Ye = g.gate) != null && Ye.radioUrl) {
          const Z = l("p");
          Z.append(u("Open the pay-per-play radio →", g.gate.radioUrl)), gt.push(Z);
        }
        Dt.push(l("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        gt.push(l("p", "Connect your wallet above to pay artists a tiny amount for each song you listen to for 30 seconds.")), Dt.push(l("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "not-invited":
        gt.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        gt.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        gt.push(l("p", `Pay ${xe(un)} STX for each song you listen to for 30 seconds, automatically, from a small wallet on this device.`)), Dt.push(l("p", Ke)), Dt.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Dt.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), It.push(f("Turn on pay-per-play", () => void o.create(), "primary")), It.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        g.armed ? gt.push(l("p", `Tap “${g.payingOn ? "Unlock and keep paying" : "Unlock with passkey"}” below. It goes straight to your passkey.`, "ppp-cyan")) : (gt.push(l("p", g.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", g.payingOn ? "" : "ppp-mute")), It.push(f(g.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), re.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        gt.push(l("p", g.serverLinked ? `Confirm your main wallet ${I(g.main)} in the listening wallet box.` : `Link to your main wallet ${I(g.main)}: one signature, no fee.`)), Dt.push(l("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Dt.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), It.push(f(g.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        gt.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (g.entries.length ? gt.push(l("p", "Out of funds: songs play free until you top up. Paying carries on by itself once the top-up confirms.", "ppp-bad")) : gt.push(l("p", `Add up to ${xe(g.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / un)).toLocaleString()} paid plays.`)), g.payingOn && !g.entries.length && Dt.push(l("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), Dt.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), g.depositPending && g.depositTxid) {
          const Z = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          Z.append(u("View", c(g.depositTxid))), gt.push(Z);
        } else g.allowance > 0n && It.push(f(`Deposit ${xe(g.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        gt.push(l("p", `Over 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${I(g.linked)}.`, "ppp-bad")), It.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (g.payingOn && g.session && g.session.playsLeft > 0) {
          const Z = Math.min(g.session.playsLeft, g.playsLeft);
          gt.push(l("p", `Paying as you listen · up to ${Z.toLocaleString()} plays left`, "ppp-ok")), Dt.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), It.push(f("Switch off", () => void o.switchOff()));
        } else
          gt.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), It.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        g.balanceState === "low" && gt.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), g.depositPending ? gt.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : g.allowance > 0n && g.balanceState !== "ok" && It.push(f(`Top up ${xe(g.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (g.walletOutdated && Dt.push(l("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), g.stuck && (gt.push(l("p", g.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${g.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), It.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(g.step) && g.linked && (g.balance ?? 0n) > 0n && re.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(g.step) && re.push(f("Lock", () => void o.lock(), "quiet")), X && !V && re.push(f(h ? "Hide listening wallet box" : "Show listening wallet box", () => {
      h = !h, Y(o.snapshot());
    }, "quiet")), [...It, ...re].forEach((Z) => Z.disabled = qe), qe && (It.length = 0), g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const Z = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad", S = gt.at(0);
      g.step === "ready" && S ? S.append(l("span", ` · ${xe(g.balance)} STX`, Z)) : gt.push(l("p", `Balance ${xe(g.balance)} STX`, Z));
    }
    n(".ppp-key").replaceChildren(...gt), n(".ppp-body").replaceChildren(...Dt), n(".ppp-actions").replaceChildren(...It), n(".ppp-actions2").replaceChildren(...re), n(".ppp-msg").textContent = g.busy || g.message, n(".ppp-err").textContent = g.error;
    const fn = n(".ppp-history");
    fn.hidden = !g.entries.length, n(".ppp-wallets").hidden = !(Dt.length || Gt.childElementCount || re.length || g.entries.length), g.entries.length && L(), fn.replaceChildren(l("summary", `Payments, likes and returns (${g.entries.length})`), ...g.entries.slice(0, 20).map((Z) => {
      const S = l("div", "", "ppp-row"), D = Z.kind === "play" ? [l("span", U(Z), "ppp-song"), l("span", ` · ${xe(BigInt(Z.amount))} STX to ${a(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [l("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${U(Z)}`, "ppp-song"), l("span", ` · for ${I(g.linked)}`, "ppp-mute")] : [l("span", `Returned ${xe(BigInt(Z.amount))} STX`, "ppp-song"), l("span", ` to ${a(Z.recipient)}`, "ppp-mute")];
      return S.append(
        l("span", N[Z.status] || Z.status, "ppp-status " + (z[Z.status] || "")),
        ...D,
        l("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && S.append(u("tx ↗", c(Z.txid))), S;
    }));
  }
  const j = /* @__PURE__ */ new Map(), Nt = () => {
    const g = window.XtrataRadio;
    return g != null && g.subscribe ? (g.subscribe((C) => {
      const y = C == null ? void 0 : C.nowPlaying;
      y && Number.isSafeInteger(Number(y.tokenId)) && j.set(Number(y.tokenId), { title: y.title || void 0, artist: y.artist || void 0 });
    }), !0) : !1;
  };
  if (!Nt()) {
    const g = setInterval(() => {
      Nt() && clearInterval(g);
    }, 500);
    setTimeout(() => clearInterval(g), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (g) => {
    const C = g.detail;
    if (C && Number.isSafeInteger(C.song) && typeof C.id == "string" && /^[0-9a-f]{32}$/.test(C.id)) {
      L();
      const y = A(C.song, j.get(C.song));
      o.onListened({ song: C.song, id: C.id, title: y.title || void 0, artist: y.artist || void 0 });
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
    var r, s, i, o, a, c, l, f, u, p;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (p = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && p !== void 0 ? p : this.getMobileUrl(t);
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
