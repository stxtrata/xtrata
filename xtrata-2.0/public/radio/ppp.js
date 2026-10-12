var ny = Object.defineProperty;
var ry = (t, e, n) => e in t ? ny(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var $s = (t, e, n) => ry(t, typeof e != "symbol" ? e + "" : e, n);
var re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ih(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function mo(t) {
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
      typeof re < "u" && re || {}, r = {
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
            var T = x.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function f(x) {
        this.map = {}, x instanceof f ? x.forEach(function(L, T) {
          this.append(T, L);
        }, this) : Array.isArray(x) ? x.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(L) {
          this.append(L, x[L]);
        }, this);
      }
      f.prototype.append = function(x, L) {
        x = a(x), L = c(L);
        var T = this.map[x];
        this.map[x] = T ? T + ", " + L : L;
      }, f.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, f.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, f.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, f.prototype.set = function(x, L) {
        this.map[a(x)] = c(L);
      }, f.prototype.forEach = function(x, L) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && x.call(L, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var x = [];
        return this.forEach(function(L, T) {
          x.push(T);
        }), u(x);
      }, f.prototype.values = function() {
        var x = [];
        return this.forEach(function(L) {
          x.push(L);
        }), u(x);
      }, f.prototype.entries = function() {
        var x = [];
        return this.forEach(function(L, T) {
          x.push([T, L]);
        }), u(x);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function p(x) {
        return new Promise(function(L, T) {
          x.onload = function() {
            L(x.result);
          }, x.onerror = function() {
            T(x.error);
          };
        });
      }
      function h(x) {
        var L = new FileReader(), T = p(L);
        return L.readAsArrayBuffer(x), T;
      }
      function w(x) {
        var L = new FileReader(), T = p(L), j = /charset=([A-Za-z0-9_-]+)/.exec(x.type), Z = j ? j[1] : "utf-8";
        return L.readAsText(x, Z), T;
      }
      function y(x) {
        for (var L = new Uint8Array(x), T = new Array(L.length), j = 0; j < L.length; j++)
          T[j] = String.fromCharCode(L[j]);
        return T.join("");
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
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return w(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(y(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(A);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var k = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(x) {
        var L = x.toUpperCase();
        return k.indexOf(L) > -1 ? L : x;
      }
      function v(x, L) {
        if (!(this instanceof v))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var T = L.body;
        if (x instanceof v) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, L.headers || (this.headers = new f(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !T && x._bodyInit != null && (T = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new f(L.headers)), this.method = b(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var j = /([?&])_=[^&]*/;
          if (j.test(this.url))
            this.url = this.url.replace(j, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Z = /\?/;
            this.url += (Z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      v.prototype.clone = function() {
        return new v(this, { body: this._bodyInit });
      };
      function A(x) {
        var L = new FormData();
        return x.trim().split("&").forEach(function(T) {
          if (T) {
            var j = T.split("="), Z = j.shift().replace(/\+/g, " "), R = j.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(Z), decodeURIComponent(R));
          }
        }), L;
      }
      function H(x) {
        var L = new f(), T = x.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(j) {
          return j.indexOf(`
`) === 0 ? j.substr(1, j.length) : j;
        }).forEach(function(j) {
          var Z = j.split(":"), R = Z.shift().trim();
          if (R) {
            var Gt = Z.join(":").trim();
            try {
              L.append(R, Gt);
            } catch (_t) {
              console.warn("Response " + _t.message);
            }
          }
        }), L;
      }
      _.call(v.prototype);
      function V(x, L) {
        if (!(this instanceof V))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new f(L.headers), this.url = L.url || "", this._initBody(x);
      }
      _.call(V.prototype), V.prototype.clone = function() {
        return new V(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, V.error = function() {
        var x = new V(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var N = [301, 302, 303, 307, 308];
      V.redirect = function(x, L) {
        if (N.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new V(null, { status: L, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(L, T) {
          this.message = L, this.name = T;
          var j = Error(L);
          this.stack = j.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function O(x, L) {
        return new Promise(function(T, j) {
          var Z = new v(x, L);
          if (Z.signal && Z.signal.aborted)
            return j(new e.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function Gt() {
            R.abort();
          }
          R.onload = function() {
            var m = {
              statusText: R.statusText,
              headers: H(R.getAllResponseHeaders() || "")
            };
            Z.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? m.status = 200 : m.status = R.status, m.url = "responseURL" in R ? R.responseURL : m.headers.get("X-Request-URL");
            var B = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              T(new V(B, m));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              j(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              j(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              j(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function _t(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (R.open(Z.method, _t(Z.url), !0), Z.credentials === "include" ? R.withCredentials = !0 : Z.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof f || n.Headers && L.headers instanceof n.Headers)) {
            var Et = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(m) {
              Et.push(a(m)), R.setRequestHeader(m, c(L.headers[m]));
            }), Z.headers.forEach(function(m, B) {
              Et.indexOf(B) === -1 && R.setRequestHeader(B, m);
            });
          } else
            Z.headers.forEach(function(m, B) {
              R.setRequestHeader(B, m);
            });
          Z.signal && (Z.signal.addEventListener("abort", Gt), R.onreadystatechange = function() {
            R.readyState === 4 && Z.signal.removeEventListener("abort", Gt);
          }), R.send(typeof Z._bodyInit > "u" ? null : Z._bodyInit);
        });
      }
      return O.polyfill = !0, n.fetch || (n.fetch = O, n.Headers = f, n.Request = v, n.Response = V), e.Headers = f, e.Request = v, e.Response = V, e.fetch = O, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : re);
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
var lr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lr || (lr = {}));
var ru;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ru || (ru = {}));
const cy = "https://api.mainnet.hiro.so", ly = "https://api.testnet.hiro.so", uy = "http://localhost:3999", fy = ["mainnet", "testnet", "devnet", "mocknet"];
let Zr = class {
  constructor(e) {
    this.version = lr.Mainnet, this.chainId = Xr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === lr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
    }), this.version = lr.Mainnet, this.chainId = Xr.Mainnet;
  }
}, hy = class extends Zr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ly,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = lr.Testnet, this.chainId = Xr.Testnet;
  }
}, Lh = class extends Zr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = lr.Testnet, this.chainId = Xr.Testnet;
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
}, Ey = () => typeof window > "u" || !window.localStorage ? Sy() : window.localStorage, ra = "xtrata.v15.1.wallet.session", iu = "mainnet", Ki = { isConnected: !1 }, Ay = (t) => t.address ? my(t.address) ?? t.network : t.network, Bh = (t) => !t.isConnected || !t.address ? { ...Ki } : Ay(t) !== iu ? { ...Ki } : {
  isConnected: !0,
  address: t.address,
  network: iu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, $y = (t) => {
  if (!t)
    return { ...Ki };
  try {
    const e = JSON.parse(t);
    return Bh(e);
  } catch {
    return { ...Ki };
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
}, Ir = {
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
Object.freeze(Ir);
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
    super({ code: Ir.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ou extends gs {
  constructor(e = "") {
    super({ code: Ir.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ui extends gs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ir.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class au extends gs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ir.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ca extends gs {
  constructor(e) {
    super({ code: Ir.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mh extends gs {
  constructor(e) {
    super({ code: Ir.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
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
function Vn(t, e) {
  return Uc(Qt(t), e);
}
function Qt(t) {
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
    return BigInt(`0x${Y(t)}`);
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
function Zs(t, e = 8) {
  return (typeof t == "bigint" ? t : Qt(t)).toString(16).padStart(e * 2, "0");
}
function So(t) {
  return parseInt(t, 16);
}
function Uc(t, e = 16) {
  const n = Zs(t, e);
  return dt(n);
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
  return jy(BigInt(`0x${Y(t)}`), BigInt(t.byteLength * 8));
}
function jy(t, e) {
  return Dy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Fy = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fy[n];
  return e;
}
function dt(t) {
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
function vr(t) {
  return new TextEncoder().encode(t);
}
function Qs(t) {
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
function Ye(...t) {
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
  return Ye(...t.map((e) => typeof e == "number" ? uu([e]) : e instanceof Array ? uu(e) : e));
}
function ue(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const _h = "https://api.mainnet.hiro.so", Th = "https://api.testnet.hiro.so", Uh = "http://localhost:3999", Vy = "https://hub.blockstack.org", Ky = 33, ia = 32;
function qy(t) {
  if (t.length < ia * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ia * 2), r = t.slice(2 + ia * 2);
  return {
    recoveryId: So(e),
    r: n,
    s: r
  };
}
function Hc(t) {
  const e = typeof t == "string" ? dt(t) : t;
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
function ur(t, e, n = 0) {
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
const tr = {
  number: Ma,
  bool: r1,
  bytes: Nh,
  hash: s1,
  exists: i1,
  output: o1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), De = (t, e) => t << 32 - e | t >>> e, a1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Lr(t) {
  const e = (r) => t().update(Nc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Oh = class extends Ph {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, tr.hash(e);
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
const Eo = (t, e, n) => new Oh(t, e).update(n).digest();
Eo.create = (t, e) => new Oh(t, e);
function l1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Pc = class extends Ph {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    tr.exists(this);
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
    tr.exists(this), tr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    l1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
]), pn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gn = new Uint32Array(64);
let Dh = class extends Pc {
  constructor() {
    super(64, 32, 8, !1), this.A = pn[0] | 0, this.B = pn[1] | 0, this.C = pn[2] | 0, this.D = pn[3] | 0, this.E = pn[4] | 0, this.F = pn[5] | 0, this.G = pn[6] | 0, this.H = pn[7] | 0;
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
      gn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = gn[l - 15], h = gn[l - 2], w = De(p, 7) ^ De(p, 18) ^ p >>> 3, y = De(h, 17) ^ De(h, 19) ^ h >>> 10;
      gn[l] = y + gn[l - 7] + w + gn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = De(a, 6) ^ De(a, 11) ^ De(a, 25), h = f + p + u1(a, c, u) + h1[l] + gn[l] | 0, y = (De(r, 2) ^ De(r, 13) ^ De(r, 22)) + f1(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    gn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, d1 = class extends Dh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Qr = Lr(() => new Dh());
Lr(() => new d1());
const p1 = {}, jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: p1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ut = BigInt(0), Ct = BigInt(1), Fn = BigInt(2), ks = BigInt(3), fu = BigInt(8), St = Object.freeze({
  a: ut,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ct,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), hu = (t, e) => (t + e / Fn) / e, fi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = St, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ct * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = hu(i * t, e), c = hu(-r * t, e);
    let u = P(t - a * n - c * s, e), f = P(-a * r - c * i, e);
    const l = u > o, p = f > o;
    if (l && (u = e - u), p && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: p, k2: f };
  }
}, He = 32, fr = 32, Fh = 32, qi = He + 1, Wi = 2 * He + 1;
function du(t) {
  const { a: e, b: n } = St, r = P(t * t), s = P(r * t);
  return P(s + e * t + n);
}
const hi = St.a === ut;
class Oc extends Error {
  constructor(e) {
    super(e);
  }
}
function pu(t) {
  if (!(t instanceof pt))
    throw new TypeError("JacobianPoint expected");
}
class pt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof it))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(it.ZERO) ? pt.ZERO : new pt(e.x, e.y, Ct);
  }
  static toAffineBatch(e) {
    const n = x1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return pt.toAffineBatch(e).map(pt.fromAffine);
  }
  equals(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = P(s * s), u = P(a * a), f = P(n * u), l = P(i * c), p = P(P(r * a) * u), h = P(P(o * s) * c);
    return f === l && p === h;
  }
  negate() {
    return new pt(this.x, P(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = P(e * e), i = P(n * n), o = P(i * i), a = e + i, c = P(Fn * (P(a * a) - s - o)), u = P(ks * s), f = P(u * u), l = P(f - Fn * c), p = P(u * (c - l) - fu * o), h = P(Fn * n * r);
    return new pt(l, p, h);
  }
  add(e) {
    pu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === ut || o === ut)
      return this;
    if (n === ut || r === ut)
      return e;
    const c = P(s * s), u = P(a * a), f = P(n * u), l = P(i * c), p = P(P(r * a) * u), h = P(P(o * s) * c), w = P(l - f), y = P(h - p);
    if (w === ut)
      return y === ut ? this.double() : pt.ZERO;
    const $ = P(w * w), _ = P(w * $), k = P(f * $), b = P(y * y - _ - Fn * k), v = P(y * (k - b) - p * _), A = P(s * a * w);
    return new pt(b, v, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = pt.ZERO;
    if (typeof e == "bigint" && e === ut)
      return n;
    let r = wu(e);
    if (r === Ct)
      return this;
    if (!hi) {
      let l = n, p = this;
      for (; r > ut; )
        r & Ct && (l = l.add(p)), p = p.double(), r >>= Ct;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = fi.splitScalar(r), c = n, u = n, f = this;
    for (; i > ut || a > ut; )
      i & Ct && (c = c.add(f)), a & Ct && (u = u.add(f)), f = f.double(), i >>= Ct, a >>= Ct;
    return s && (c = c.negate()), o && (u = u.negate()), u = new pt(P(u.x * fi.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = hi ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(pt.BASE) && (n = it.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && _a.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = pt.normalizeZ(s), _a.set(n, s)));
    let i = pt.ZERO, o = pt.BASE;
    const a = 1 + (hi ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let p = 0; p < a; p++) {
      const h = p * c;
      let w = Number(e & u);
      e >>= l, w > c && (w -= f, e += Ct);
      const y = h, $ = h + Math.abs(w) - 1, _ = p % 2 !== 0, k = w < 0;
      w === 0 ? o = o.add(di(_, s[y])) : i = i.add(di(k, s[$]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = wu(e), s, i;
    if (hi) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = fi.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p, f: h } = this.wNAF(u, n);
      f = di(o, f), p = di(c, p), p = new pt(P(p.x * fi.beta), p.y, p.z), s = f.add(p), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return pt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(pt.ZERO);
    e == null && (e = i ? fu : ys(s));
    const o = e, a = P(o * o), c = P(a * o), u = P(n * a), f = P(r * c), l = P(s * o);
    if (i)
      return it.ZERO;
    if (l !== Ct)
      throw new Error("invZ was invalid");
    return new it(u, f);
  }
}
pt.BASE = new pt(St.Gx, St.Gy, Ct);
pt.ZERO = new pt(ut, Ct, ut);
function di(t, e) {
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
    return this.y % Fn === ut;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = we(n ? e : e.subarray(1));
    if (!Oi(r))
      throw new Error("Point is not on curve");
    const s = du(r);
    let i = b1(s);
    const o = (i & Ct) === Ct;
    n ? o && (i = P(-i)) : (e[0] & 1) === 1 !== o && (i = P(-i));
    const a = new it(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = we(e.subarray(1, He + 1)), r = we(e.subarray(He + 1, He * 2 + 1)), s = new it(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Xe(e), r = n.length, s = n[0];
    if (r === He)
      return this.fromCompressedHex(n);
    if (r === qi && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Wi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${qi} compressed bytes or ${Wi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return it.BASE.multiply(hr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Gh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Dc(Xe(e)), { n: a } = St, c = r === 2 || r === 3 ? s + a : s, u = ys(c, a), f = P(-o * u, a), l = P(i * u, a), p = r & 1 ? "03" : "02", h = it.fromHex(p + zn(c)), w = it.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return Rn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = zn(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${zn(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Oi(n) || !Oi(r))
      throw new Error(e);
    const s = P(r * r), i = du(n);
    if (P(s - i) !== ut)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new it(this.x, P(-this.y));
  }
  double() {
    return pt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return pt.fromAffine(this).add(pt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return pt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = pt.fromAffine(this), i = n === ut || n === Ct || this !== it.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = pt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(pt.ZERO) ? void 0 : a.toAffine();
  }
}
it.BASE = new it(St.Gx, St.Gy);
it.ZERO = new it(ut, ut);
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
  return { data: we(n), left: t.subarray(e + 2) };
}
function g1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Jr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = yu(t.subarray(2)), { data: r, left: s } = yu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Jr(s)}`);
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
    const s = n ? Jr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ye(Yi(s.slice(0, 64)), Yi(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = g1(n ? e : Rn(e));
    return new ye(r, s);
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
    const e = St.n >> Ct;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ye(this.r, P(-this.s, St.n)) : this;
  }
  toDERRawBytes() {
    return Rn(this.toDERHex());
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
    return Rn(this.toCompactHex());
  }
  toCompactHex() {
    return zn(this.r) + zn(this.s);
  }
}
function Dn(...t) {
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
function Jr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y1[t[n]];
  return e;
}
const w1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function zn(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(ut <= t && t < w1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ts(t) {
  const e = Rn(zn(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function vs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Yi(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Rn(t) {
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
  return Yi(Jr(t));
}
function Xe(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Rn(t);
}
function wu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && es(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function P(t, e = St.P) {
  const n = t % e;
  return n >= ut ? n : e + n;
}
function Ee(t, e) {
  const { P: n } = St;
  let r = t;
  for (; e-- > ut; )
    r *= r, r %= n;
  return r;
}
function b1(t) {
  const { P: e } = St, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Ee(u, ks) * u % e, l = Ee(f, ks) * u % e, p = Ee(l, Fn) * c % e, h = Ee(p, r) * p % e, w = Ee(h, s) * h % e, y = Ee(w, o) * w % e, $ = Ee(y, a) * y % e, _ = Ee($, o) * w % e, k = Ee(_, ks) * u % e, b = Ee(k, i) * h % e, v = Ee(b, n) * c % e, A = Ee(v, Fn);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function ys(t, e = St.P) {
  if (t === ut || e <= ut)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = P(t, e), r = e, s = ut, i = Ct;
  for (; n !== ut; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Ct)
    throw new Error("invert: does not exist");
  return P(s, e);
}
function x1(t, e = St.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === ut ? i : (n[a] = i, P(i * o, e)), Ct), s = ys(r, e);
  return t.reduceRight((i, o, a) => o === ut ? i : (n[a] = P(i * n[a], e), P(i * o, e)), s), n;
}
function m1(t) {
  const e = t.length * 8 - fr * 8, n = we(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Dc(t, e = !1) {
  const n = m1(t);
  if (e)
    return n;
  const { n: r } = St;
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
    return Pt.hmacSha256(this.k, ...e);
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
    return Dn(...n);
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
    return Dn(...n);
  }
}
function es(t) {
  return ut < t && t < St.n;
}
function Oi(t) {
  return ut < t && t < St.P;
}
function Rh(t, e, n, r = !0) {
  const { n: s } = St, i = Dc(t, !0);
  if (!es(i))
    return;
  const o = ys(i, s), a = it.BASE.multiply(i), c = P(a.x, s);
  if (c === ut)
    return;
  const u = P(o * P(e + n * c, s), s);
  if (u === ut)
    return;
  let f = new ye(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & Ct);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function hr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * fr)
      throw new Error("Expected 32 bytes of private key");
    e = Yi(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== fr)
      throw new Error("Expected 32 bytes of private key");
    e = we(t);
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
  if (t instanceof ye)
    return t.assertValidity(), t;
  try {
    return ye.fromDER(t);
  } catch {
    return ye.fromCompact(t);
  }
}
function Js(t, e = !1) {
  return it.fromPrivateKey(t).toRawBytes(e);
}
function S1(t, e, n, r = !1) {
  return it.fromSignature(t, e, n).toRawBytes(r);
}
function bu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === qi || r === Wi : n ? r === qi * 2 || r === Wi * 2 : t instanceof it;
}
function Fc(t, e, n = !1) {
  if (bu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!bu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = jc(e);
  return r.assertValidity(), r.multiply(hr(t)).toRawBytes(n);
}
function Vh(t) {
  const e = t.length > He ? t.slice(0, He) : t;
  return we(e);
}
function E1(t) {
  const e = Vh(t), n = P(e, St.n);
  return Kh(n < ut ? e : n);
}
function Kh(t) {
  return ts(t);
}
function qh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Xe(t), s = hr(e), i = [Kh(s), E1(r)];
  if (n != null) {
    n === !0 && (n = Pt.randomBytes(He));
    const c = Xe(n);
    if (c.length !== He)
      throw new Error(`sign: Expected ${He} bytes of extra data`);
    i.push(c);
  }
  const o = Dn(...i), a = Vh(r);
  return { seed: o, m: a, d: s };
}
function Wh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function A1(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, fr);
  await o.reseed(r);
  let a;
  for (; !(a = Rh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Wh(a, n);
}
function Ao(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qh(t, e, n.extraEntropy), o = new zh(Fh, fr);
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
    s = Gh(t), e = Xe(e);
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
  const { n: u } = St, f = ys(o, u), l = P(a * f, u), p = P(i * f, u), h = it.BASE.multiplyAndAddUnsafe(c, l, p);
  return h ? P(h.x, u) === i : !1;
}
function Xi(t) {
  return P(we(t), St.n);
}
class ns {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Xe(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = we(n.subarray(0, 32)), s = we(n.subarray(32, 64));
    return new ns(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Oi(e) || !es(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return zn(this.r) + zn(this.s);
  }
  toRawBytes() {
    return Rn(this.toHex());
  }
}
function v1(t) {
  return it.fromPrivateKey(t).toRawX();
}
class Yh {
  constructor(e, n, r = Pt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Xe(e);
    const { x: s, scalar: i } = this.getScalar(hr(n));
    if (this.px = s, this.d = i, this.rand = Xe(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = it.fromPrivateKey(e), r = n.hasEvenY() ? e : St.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ts(e ^ we(n));
  }
  finalizeNonce(e) {
    const n = P(we(e), St.n);
    if (n === ut)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new ns(e.x, P(n + r * s, St.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Pt.taggedHash, o = this.initNonce(n, await i(On.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(On.nonce, o, r, e)), f = Xi(await i(On.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await Qh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Pt.taggedHashSync, o = this.initNonce(n, i(On.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(On.nonce, o, r, e)), f = Xi(i(On.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return Jh(l, e, r) || this.error(), l;
  }
}
async function L1(t, e, n) {
  return new Yh(t, e, n).calc();
}
function C1(t, e, n) {
  return new Yh(t, e, n).calcSync();
}
function Xh(t, e, n) {
  const r = t instanceof ns, s = r ? t : ns.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Xe(e),
    P: jc(n)
  };
}
function Zh(t, e, n, r) {
  const s = it.BASE.multiplyAndAddUnsafe(e, hr(n), P(-r, St.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Qh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Xi(await Pt.taggedHash(On.challenge, ts(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Jh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Xh(t, e, n), a = Xi(Pt.taggedHashSync(On.challenge, ts(r), o.toRawX(), i));
    return Zh(r, o, s, a);
  } catch (r) {
    if (r instanceof Oc)
      throw r;
    return !1;
  }
}
const B1 = {
  Signature: ns,
  getPublicKey: v1,
  sign: L1,
  verify: Qh,
  signSync: C1,
  verifySync: Jh
};
it.BASE._setWindowSize(8);
const fe = {
  node: jh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, On = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, pi = {}, Pt = {
  bytesToHex: Jr,
  hexToBytes: Rn,
  concatBytes: Dn,
  mod: P,
  invert: ys,
  isValidPrivateKey(t) {
    try {
      return hr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ts,
  _normalizePrivateKey: hr,
  hashToPrivateKey: (t) => {
    t = Xe(t);
    const e = fr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = P(we(t), St.n - Ct) + Ct;
    return ts(n);
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
  randomPrivateKey: () => Pt.hashToPrivateKey(Pt.randomBytes(fr + 8)),
  precompute(t = 8, e = it.BASE) {
    const n = e === it.BASE ? e : new it(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ks), n;
  },
  sha256: async (...t) => {
    if (fe.web) {
      const e = await fe.web.subtle.digest("SHA-256", Dn(...t));
      return new Uint8Array(e);
    } else if (fe.node) {
      const { createHash: e } = fe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (fe.web) {
      const n = await fe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Dn(...e), s = await fe.web.subtle.sign("HMAC", n, r);
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
    let n = pi[t];
    if (n === void 0) {
      const r = await Pt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Dn(r, r), pi[t] = n;
    }
    return Pt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Yr != "function")
      throw new Oc("sha256Sync is undefined, you need to set it");
    let n = pi[t];
    if (n === void 0) {
      const r = Yr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Dn(r, r), pi[t] = n;
    }
    return Yr(n, ...e);
  },
  _JacobianPoint: pt
};
Object.defineProperties(Pt, {
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
const k1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: St,
  Point: it,
  Signature: ye,
  getPublicKey: Js,
  getSharedSecret: Fc,
  recoverPublicKey: S1,
  schnorr: B1,
  sign: A1,
  signSync: Ao,
  utils: Pt,
  verify: I1
}, Symbol.toStringTag, { value: "Module" }));
var ti = {};
ti.byteLength = H1;
var M1 = ti.toByteArray = P1, _1 = ti.fromByteArray = j1, Ge = [], $e = [], T1 = typeof Uint8Array < "u" ? Uint8Array : Array, aa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Dr = 0, U1 = aa.length; Dr < U1; ++Dr)
  Ge[Dr] = aa[Dr], $e[aa.charCodeAt(Dr)] = Dr;
$e[45] = 62;
$e[95] = 63;
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
    e = $e[t.charCodeAt(c)] << 18 | $e[t.charCodeAt(c + 1)] << 12 | $e[t.charCodeAt(c + 2)] << 6 | $e[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = $e[t.charCodeAt(c)] << 2 | $e[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = $e[t.charCodeAt(c)] << 10 | $e[t.charCodeAt(c + 1)] << 4 | $e[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function O1(t) {
  return Ge[t >> 18 & 63] + Ge[t >> 12 & 63] + Ge[t >> 6 & 63] + Ge[t & 63];
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
    Ge[e >> 2] + Ge[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ge[e >> 10] + Ge[e >> 4 & 63] + Ge[e << 2 & 63] + "="
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
    const i = this.createCipher(e, n, r), o = new Uint8Array(Ye(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Ye(i.update(s), i.final()));
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var w = 0, y = 0, $ = 0, _ = h.length; $ !== _ && h[$] === 0; )
      $++, w++;
    for (var k = (_ - $) * u + 1 >>> 0, b = new Uint8Array(k); $ !== _; ) {
      for (var v = h[$], A = 0, H = k - 1; (v !== 0 || A < y) && H !== -1; H--, A++)
        v += 256 * b[H] >>> 0, b[H] = v % o >>> 0, v = v / o >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      y = A, $++;
    }
    for (var V = k - y; V !== k && b[V] === 0; )
      V++;
    for (var N = a.repeat(w); V < k; ++V)
      N += t.charAt(b[V]);
    return N;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var w = 0, y = 0, $ = 0; h[w] === a; )
      y++, w++;
    for (var _ = (h.length - w) * c + 1 >>> 0, k = new Uint8Array(_); h[w]; ) {
      var b = h.charCodeAt(w);
      if (b > 255)
        return;
      var v = e[b];
      if (v === 255)
        return;
      for (var A = 0, H = _ - 1; (v !== 0 || A < $) && H !== -1; H--, A++)
        v += o * k[H] >>> 0, k[H] = v % 256 >>> 0, v = v / 256 >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      $ = A, w++;
    }
    for (var V = _ - $; V !== _ && k[V] === 0; )
      V++;
    for (var N = new Uint8Array(y + (_ - V)), O = y; V !== _; )
      N[O++] = k[V++];
    return N;
  }
  function p(h) {
    var w = l(h);
    if (w)
      return w;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: p
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
].map((t) => new Uint8Array(t)), J1 = zc.map((t, e) => t.map((n) => sd[e][n])), tw = Rc.map((t, e) => t.map((n) => sd[e][n])), ew = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), gi = (t, e) => t << e | t >>> 32 - e;
function xu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const yi = new Uint32Array(16);
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
      yi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, p = l;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, y = ew[h], $ = nw[h], _ = zc[h], k = Rc[h], b = J1[h], v = tw[h];
      for (let A = 0; A < 16; A++) {
        const H = gi(r + xu(h, i, a, u) + yi[_[A]] + y, b[A]) + l | 0;
        r = l, l = u, u = gi(a, 10) | 0, a = i, i = H;
      }
      for (let A = 0; A < 16; A++) {
        const H = gi(s + xu(w, o, c, f) + yi[k[A]] + $, v[A]) + p | 0;
        s = p, p = f, f = gi(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + p | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const sw = Lr(() => new rw());
function iw(t) {
  return sw(t);
}
const wi = BigInt(2 ** 32 - 1), Ta = BigInt(32);
function id(t, e = !1) {
  return e ? { h: Number(t & wi), l: Number(t >> Ta & wi) } : { h: Number(t >> Ta & wi) | 0, l: Number(t & wi) | 0 };
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
].map((t) => BigInt(t))), yn = new Uint32Array(80), wn = new Uint32Array(80);
let $o = class extends Pc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: p, Gh: h, Gl: w, Hh: y, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      yn[b] = e.getUint32(n), wn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = yn[b - 15] | 0, A = wn[b - 15] | 0, H = J.rotrSH(v, A, 1) ^ J.rotrSH(v, A, 8) ^ J.shrSH(v, A, 7), V = J.rotrSL(v, A, 1) ^ J.rotrSL(v, A, 8) ^ J.shrSL(v, A, 7), N = yn[b - 2] | 0, O = wn[b - 2] | 0, x = J.rotrSH(N, O, 19) ^ J.rotrBH(N, O, 61) ^ J.shrSH(N, O, 6), L = J.rotrSL(N, O, 19) ^ J.rotrBL(N, O, 61) ^ J.shrSL(N, O, 6), T = J.add4L(V, L, wn[b - 7], wn[b - 16]), j = J.add4H(T, H, x, yn[b - 7], yn[b - 16]);
      yn[b] = j | 0, wn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: p, Fh: h, Fl: w, Gh: y, Gl: $, Hh: _, Hl: k } = this;
    for (let b = 0; b < 80; b++) {
      const v = J.rotrSH(l, p, 14) ^ J.rotrSH(l, p, 18) ^ J.rotrBH(l, p, 41), A = J.rotrSL(l, p, 14) ^ J.rotrSL(l, p, 18) ^ J.rotrBL(l, p, 41), H = l & h ^ ~l & y, V = p & w ^ ~p & $, N = J.add5L(k, A, V, Cw[b], wn[b]), O = J.add5H(N, _, v, H, Lw[b], yn[b]), x = N | 0, L = J.rotrSH(r, s, 28) ^ J.rotrBH(r, s, 34) ^ J.rotrBH(r, s, 39), T = J.rotrSL(r, s, 28) ^ J.rotrBL(r, s, 34) ^ J.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      _ = y | 0, k = $ | 0, y = h | 0, $ = w | 0, h = l | 0, w = p | 0, { h: l, l: p } = J.add(u | 0, f | 0, O | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = J.add3L(x, T, Z);
      r = J.add3H(R, O, L, j), s = R | 0;
    }
    ({ h: r, l: s } = J.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = J.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = J.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = J.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: p } = J.add(this.Eh | 0, this.El | 0, l | 0, p | 0), { h, l: w } = J.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: y, l: $ } = J.add(this.Gh | 0, this.Gl | 0, y | 0, $ | 0), { h: _, l: k } = J.add(this.Hh | 0, this.Hl | 0, _ | 0, k | 0), this.set(r, s, i, o, a, c, u, f, l, p, h, w, y, $, _, k);
  }
  roundClean() {
    yn.fill(0), wn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Bw = class extends $o {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, kw = class extends $o {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Mw = class extends $o {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const _w = Lr(() => new $o());
Lr(() => new Bw());
Lr(() => new kw());
Lr(() => new Mw());
function od(t) {
  return Qr(t);
}
function Tw(t) {
  return _w(t);
}
const Uw = 0;
Pt.hmacSha256Sync = (t, ...e) => {
  const n = Eo.create(Qr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Hw() {
  return Y(Pt.randomPrivateKey());
}
function Nw(t) {
  const e = Qr(Qr(t));
  return X1.encode(Ye(t, e).slice(0, t.length + 4));
}
function Pw(t, e) {
  return Nw(Ye(new Uint8Array([t]), e.slice(0, 20)));
}
function ad(t, e = Uw) {
  const n = typeof t == "string" ? dt(t) : t, r = iw(od(n));
  return Pw(e, r);
}
function cd(t) {
  const e = Hc(t);
  return Y(Js(e.slice(0, 32), !0));
}
Pt.hmacSha256Sync = (t, ...e) => {
  const n = Eo.create(Qr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Zi;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Zi || (Zi = {}));
async function Ow(t, e, n) {
  return await (await ed()).encrypt("aes-256-cbc", e, t, n);
}
async function Dw(t, e, n) {
  return await (await ed()).decrypt("aes-256-cbc", e, t, n);
}
function ld(t, e) {
  return Eo(Qr, t, e);
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
    reason: Zi.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Zi.IsNotPoint
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
  const i = Pt.randomPrivateKey(), o = Js(i, !0);
  let a = Fc(i, t, !0);
  a = a.slice(1);
  const c = ud(a), u = Pt.randomBytes(16), f = await Ow(u, c.encryptionKey, e), l = Ye(u, o, f), p = ld(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = Y(f);
  else if (r === "base64")
    h = _1(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const w = {
    iv: Y(u),
    ephemeralPK: Y(o),
    cipherText: h,
    mac: Y(p),
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
  const s = ud(r), i = dt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = dt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = M1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Ye(i, dt(n), o), c = ld(s.hmacKey, a), u = dt(e.mac);
  if (!jw(u, c))
    throw new au("Decryption failed: failure in MAC check");
  const f = await Dw(i, s.encryptionKey, o);
  return e.wasString ? Qs(f) : f;
}
function Gw(t, e) {
  const n = typeof e == "string" ? vr(e) : e, r = cd(t), s = od(n), i = Ao(s, t);
  return {
    signature: Y(i),
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
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? vr(t) : t, o = await Rw(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Gw(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
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
var Yt = {}, rs = {}, ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.decode = ee.encode = ee.unescape = ee.escape = ee.pad = void 0;
const hd = ti;
function Gc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ee.pad = Gc;
function dd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ee.escape = dd;
function pd(t) {
  return Gc(t).replace(/-/g, "+").replace(/_/g, "/");
}
ee.unescape = pd;
function qw(t) {
  return dd((0, hd.fromByteArray)(new TextEncoder().encode(t)));
}
ee.encode = qw;
function Ww(t) {
  return new TextDecoder().decode((0, hd.toByteArray)(Gc(pd(t))));
}
ee.decode = Ww;
var Io = {}, vo = {}, gd = {}, yd = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
Lo.crypto = void 0;
Lo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = p, t.rotl = h, t.byteSwap = w, t.byteSwap32 = y, t.bytesToHex = k, t.hexToBytes = A, t.asyncLoop = V, t.utf8ToBytes = N, t.bytesToUtf8 = O, t.toBytes = x, t.kdfInputToBytes = L, t.concatBytes = T, t.checkOpts = j, t.createHasher = R, t.createOptHasher = Gt, t.createXOFer = _t, t.randomBytes = Et;
  const e = Lo;
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
    const lt = B.outputLen;
    if (m.length < lt)
      throw new Error("digestInto() expects output buffer of length at least " + lt);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function u(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let B = 0; B < m.length; B++)
      m[B].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function p(m, B) {
    return m << 32 - B | m >>> B;
  }
  function h(m, B) {
    return m << B | m >>> 32 - B >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function w(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => w(m), t.byteSwapIfBE = t.swap8IfBE;
  function y(m) {
    for (let B = 0; B < m.length; B++)
      m[B] = w(m[B]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : y;
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (m, B) => B.toString(16).padStart(2, "0"));
  function k(m) {
    if (s(m), $)
      return m.toHex();
    let B = "";
    for (let lt = 0; lt < m.length; lt++)
      B += _[m[lt]];
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
    const B = m.length, lt = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const at = new Uint8Array(lt);
    for (let ft = 0, Tt = 0; ft < lt; ft++, Tt += 2) {
      const Kt = v(m.charCodeAt(Tt)), g = v(m.charCodeAt(Tt + 1));
      if (Kt === void 0 || g === void 0) {
        const I = m[Tt] + m[Tt + 1];
        throw new Error('hex string expected, got non-hex character "' + I + '" at index ' + Tt);
      }
      at[ft] = Kt * 16 + g;
    }
    return at;
  }
  const H = async () => {
  };
  t.nextTick = H;
  async function V(m, B, lt) {
    let at = Date.now();
    for (let ft = 0; ft < m; ft++) {
      lt(ft);
      const Tt = Date.now() - at;
      Tt >= 0 && Tt < B || (await (0, t.nextTick)(), at += Tt);
    }
  }
  function N(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function O(m) {
    return new TextDecoder().decode(m);
  }
  function x(m) {
    return typeof m == "string" && (m = N(m)), s(m), m;
  }
  function L(m) {
    return typeof m == "string" && (m = N(m)), s(m), m;
  }
  function T(...m) {
    let B = 0;
    for (let at = 0; at < m.length; at++) {
      const ft = m[at];
      s(ft), B += ft.length;
    }
    const lt = new Uint8Array(B);
    for (let at = 0, ft = 0; at < m.length; at++) {
      const Tt = m[at];
      lt.set(Tt, ft), ft += Tt.length;
    }
    return lt;
  }
  function j(m, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, B);
  }
  class Z {
  }
  t.Hash = Z;
  function R(m) {
    const B = (at) => m().update(x(at)).digest(), lt = m();
    return B.outputLen = lt.outputLen, B.blockLen = lt.blockLen, B.create = () => m(), B;
  }
  function Gt(m) {
    const B = (at, ft) => m(ft).update(x(at)).digest(), lt = m({});
    return B.outputLen = lt.outputLen, B.blockLen = lt.blockLen, B.create = (at) => m(at), B;
  }
  function _t(m) {
    const B = (at, ft) => m(ft).update(x(at)).digest(), lt = m({});
    return B.outputLen = lt.outputLen, B.blockLen = lt.blockLen, B.create = (at) => m(at), B;
  }
  t.wrapConstructor = R, t.wrapConstructorWithOpts = Gt, t.wrapXOFConstructorWithOpts = _t;
  function Et(m = 32) {
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
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: f, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = f, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
function Cr(t, ...e) {
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
  Cr(t);
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
function Qi(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Di(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function ke(t, e) {
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
  if (Cr(t), Sd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += eb[t[n]];
  return e;
}
const rn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function mu(t) {
  if (t >= rn._0 && t <= rn._9)
    return t - rn._0;
  if (t >= rn.A && t <= rn.F)
    return t - (rn.A - 10);
  if (t >= rn.a && t <= rn.f)
    return t - (rn.a - 10);
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
function ei(t) {
  return typeof t == "string" && (t = qc(t)), Cr(t), t;
}
function ob(t) {
  return typeof t == "string" && (t = qc(t)), Cr(t), t;
}
function ab(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Cr(s), e += s.length;
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
function Co(t) {
  const e = (r) => t().update(ei(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $d(t) {
  const e = (r, s) => t(s).update(ei(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Id(t) {
  const e = (r, s) => t(s).update(ei(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const lb = Co, ub = $d, fb = Id;
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
  abytes: Cr,
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
  clean: Qi,
  concatBytes: ab,
  createHasher: Co,
  createOptHasher: $d,
  createView: Di,
  createXOFer: Id,
  hexToBytes: rb,
  isBytes: wd,
  isLE: Vc,
  kdfInputToBytes: ob,
  nextTick: Ed,
  randomBytes: hb,
  rotl: Qw,
  rotr: ke,
  swap32IfBE: tb,
  swap8IfBE: xd,
  toBytes: ei,
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
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function gb(t, e, n) {
  return t & e ^ ~t & n;
}
function yb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class wb extends Ad {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Di(this.buffer);
  }
  update(e) {
    Ha(this), e = ei(e), Cr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Di(e);
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
    n[o++] = 128, Qi(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Di(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const bn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xn = /* @__PURE__ */ Uint32Array.from([
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
]), mn = /* @__PURE__ */ new Uint32Array(64);
let Wc = class extends wb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = bn[0] | 0, this.B = bn[1] | 0, this.C = bn[2] | 0, this.D = bn[3] | 0, this.E = bn[4] | 0, this.F = bn[5] | 0, this.G = bn[6] | 0, this.H = bn[7] | 0;
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
      mn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = mn[l - 15], h = mn[l - 2], w = ke(p, 7) ^ ke(p, 18) ^ p >>> 3, y = ke(h, 17) ^ ke(h, 19) ^ h >>> 10;
      mn[l] = y + mn[l - 7] + w + mn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = ke(a, 6) ^ ke(a, 11) ^ ke(a, 25), h = f + p + gb(a, c, u) + bb[l] + mn[l] | 0, y = (ke(r, 2) ^ ke(r, 13) ^ ke(r, 22)) + yb(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Qi(mn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Qi(this.buffer);
  }
}, vd = class extends Wc {
  constructor() {
    super(28), this.A = xn[0] | 0, this.B = xn[1] | 0, this.C = xn[2] | 0, this.D = xn[3] | 0, this.E = xn[4] | 0, this.F = xn[5] | 0, this.G = xn[6] | 0, this.H = xn[7] | 0;
  }
};
const xb = /* @__PURE__ */ Co(() => new Wc()), mb = /* @__PURE__ */ Co(() => new vd()), Sb = Wc, Eb = xb, Ab = vd, $b = mb, Ib = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Ab,
  SHA256: Sb,
  sha224: $b,
  sha256: Eb
}, Symbol.toStringTag, { value: "Module" })), Bo = /* @__PURE__ */ mo(Ib), vb = /* @__PURE__ */ mo(k1);
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
ss.joseToDer = ss.derToJose = void 0;
const Ld = ti, Cd = ee;
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
const Ji = 128, kd = 0, Cb = 32, Bb = 16, kb = 2, Md = Bb | Cb | kd << 6, to = kb | kd << 6;
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
  if (a === (Ji | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== to)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== to)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const p = r - c, h = r - f, w = new Uint8Array(p + c + h + f);
  for (o = 0; o < p; ++o)
    w[o] = 0;
  w.set(n.subarray(u + Math.max(-p, 0), u + c), o), o = r;
  for (const y = o; o < y + h; ++o)
    w[o] = 0;
  return w.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, Cd.escape)((0, Ld.fromByteArray)(w));
}
ss.derToJose = Mb;
function Su(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ji && --r, r;
}
function _b(t, e) {
  t = _d(t);
  const n = Bd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Su(t, 0, n), i = Su(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Ji, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Md, u ? f[l++] = c : (f[l++] = Ji | 1, f[l++] = c & 255), f[l++] = to, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = to, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
ss.joseToDer = _b;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.InvalidTokenError = fn.MissingParametersError = void 0;
class Tb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
fn.MissingParametersError = Tb;
class Ub extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
fn.InvalidTokenError = Ub;
const ni = /* @__PURE__ */ mo(db);
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.SECP256K1Client = void 0;
const Hb = gd, Nb = Bo, ji = vb, Eu = ss, Au = fn, $u = ni;
ji.utils.hmacSha256Sync = (t, ...e) => {
  const n = Hb.hmac.create(Nb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Td {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, $u.bytesToHex)(ji.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Au.MissingParametersError("a signing input hash and private key are all required");
    const s = ji.signSync(e, n.slice(0, 64), {
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
    return ji.verify(n, e, r, { strict: !1 });
  }
}
vo.SECP256K1Client = Td;
Td.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = vo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Io);
var dr = {};
const Pb = /* @__PURE__ */ mo(jh);
var Ob = re && re.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.hashSha256Async = dr.hashSha256 = void 0;
const Db = Bo;
function Ud(t) {
  return (0, Db.sha256)(t);
}
dr.hashSha256 = Ud;
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
dr.hashSha256Async = jb;
var Fb = re && re.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.TokenSigner = rs.createUnsecuredToken = void 0;
const Na = ee, Iu = Io, zb = fn, vu = dr;
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
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
ko.TokenVerifier = void 0;
const Vb = ee, Lu = Io, Kb = fn, bi = dr;
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
      return (0, bi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, bi.hashSha256)(s);
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
      return (0, bi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, bi.hashSha256)(r);
      return i(o);
    }
  }
}
ko.TokenVerifier = qb;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.decodeToken = void 0;
const xi = ee;
function Wb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(xi.decode(e[0])), r = JSON.parse(xi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = xi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(xi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Mo.decodeToken = Wb;
(function(t) {
  var e = re && re.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = re && re.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(rs, t), n(ko, t), n(Mo, t), n(fn, t), n(Io, t);
})(Yt);
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
  }), u = Yt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = ad(u);
  return c.iss = Yb(f), new Yt.TokenSigner("ES256k", t).sign(c);
}
async function Cu(t, e) {
  const n = Qs(dt(e)), r = JSON.parse(n), s = await fd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function t2(t) {
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
function e2(t) {
  const e = Yt.decodeToken(t).payload;
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
function r2(t) {
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
class Gn {
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
    return new Gn(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Nd {
  constructor(e) {
    if (e) {
      const n = new Gn(e);
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
    super(e), this.sessionData || this.setSessionData(new Gn({}));
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
    return this.setSessionData(new Gn({})), !0;
  }
}
class Mu extends Nd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = By, !localStorage.getItem(this.key)) {
      const r = new Gn({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Gn.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Gn({})), !0;
  }
}
var Ds;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ds || (Ds = {}));
var eo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(eo || (eo = {}));
Ds.Mainnet;
var ln;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ln || (ln = {}));
var Ke;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ke || (Ke = {}));
ln.Mainnet;
const Pd = {
  chainId: Ds.Mainnet,
  transactionVersion: ln.Mainnet,
  peerNetworkId: eo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ke.MainnetSingleSig,
    multiSig: Ke.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Oa = {
  chainId: Ds.Testnet,
  transactionVersion: ln.Testnet,
  peerNetworkId: eo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ke.TestnetSingleSig,
    multiSig: Ke.TestnetMultiSig
  },
  client: { baseUrl: Th }
}, Fi = {
  ...Oa,
  addressVersion: { ...Oa.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, i2 = {
  ...Fi,
  addressVersion: { ...Fi.addressVersion },
  client: { ...Fi.client }
};
function o2(t) {
  switch (t) {
    case "mainnet":
      return Pd;
    case "testnet":
      return Oa;
    case "devnet":
      return Fi;
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
var Me;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Me || (Me = {}));
const la = ["onChainOnly", "offChainOnly", "any"];
la[0] + "", Me.OnChainOnly, la[1] + "", Me.OffChainOnly, la[2] + "", Me.Any, Me.OnChainOnly + "", Me.OnChainOnly, Me.OffChainOnly + "", Me.OffChainOnly, Me.Any + "", Me.Any;
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
var an;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(an || (an = {}));
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
const er = {
  number: Da,
  bool: a2,
  bytes: Dd,
  hash: c2,
  exists: l2,
  output: u2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ua = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), je = (t, e) => t << 32 - e | t >>> e, f2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Br(t) {
  const e = (r) => t().update(Yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fd = class extends jd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, er.hash(e);
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
const zd = (t, e, n) => new Fd(t, e).update(n).digest();
zd.create = (t, e) => new Fd(t, e);
function d2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xc = class extends jd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ua(this.buffer);
  }
  update(e) {
    er.exists(this);
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
    er.exists(this), er.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    d2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ua(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
let Rd = class extends Xc {
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
    for (let l = 0; l < 16; l++, n += 4)
      En[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = En[l - 15], h = En[l - 2], w = je(p, 7) ^ je(p, 18) ^ p >>> 3, y = je(h, 17) ^ je(h, 19) ^ h >>> 10;
      En[l] = y + En[l - 7] + w + En[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = je(a, 6) ^ je(a, 11) ^ je(a, 25), h = f + p + p2(a, c, u) + y2[l] + En[l] | 0, y = (je(r, 2) ^ je(r, 13) ^ je(r, 22)) + g2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    En.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, w2 = class extends Rd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Gd = Br(() => new Rd());
Br(() => new w2());
var kr = {}, Zc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ni;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const w = n.indexOf(o[h]) >> u;
        let y = 0;
        h !== 0 && (y = n.indexOf(o[h - 1]));
        const $ = 1 + u, _ = y % (1 << $) << 5 - $, k = t.c32[w + _];
        u = $, c.unshift(k);
      } else
        u = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), p = l ? l[0].length : 0;
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
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let f = [], l = 0, p = 0;
    for (let y = o.length - 1; y >= 0; y--) {
      p === 4 && (f.unshift(n[l]), p = 0, l = 0);
      const _ = (t.c32.indexOf(o[y]) << p) + l, k = n[_ % 16];
      if (p += 1, l = _ >> 4, l > 1 << p)
        throw new Error("Panic error in decoding.");
      f.unshift(k);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let y = 0; y < f.length && f[y] === "0"; y++)
      h++;
    f = f.slice(h - h % 2);
    let w = f.join("");
    for (let y = 0; y < u; y++)
      w = `00${w}`;
    if (a) {
      const y = a * 2 - w.length;
      for (let $ = 0; $ < y; $ += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = i;
})(Zc);
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.c32checkDecode = pr.c32checkEncode = void 0;
const Ku = Bo, qu = ni, _s = Zc;
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
pr.c32checkEncode = b2;
function x2(t) {
  t = (0, _s.c32normalize)(t);
  const e = (0, _s.c32decode)(t.slice(1)), n = t[0], r = _s.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Vd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
pr.c32checkDecode = x2;
var Kd = {}, is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
is.decode = is.encode = void 0;
const no = Bo, Wu = ni, qd = nd, Wd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function m2(t, e = "00") {
  const n = typeof t == "string" ? (0, Wu.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Wu.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, no.sha256)((0, no.sha256)(new Uint8Array([...r, ...n])));
  return qd(Wd).encode([...r, ...n, ...s.slice(0, 4)]);
}
is.encode = m2;
function S2(t) {
  const e = qd(Wd).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, no.sha256)((0, no.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
is.decode = S2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = pr, n = is, r = ni;
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
    const p = n.decode(f), h = (0, r.bytesToHex)(p.data), w = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let y;
    return l < 0 ? (y = w, s[w] !== void 0 && (y = s[w])) : y = l, o(y, h);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const p = a(f), h = p[0], w = p[1];
    let y;
    l < 0 ? (y = h, i[h] !== void 0 && (y = i[h])) : y = l;
    let $ = y.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(w, $);
  }
  t.c32ToB58 = u;
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
  const n = pr;
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
})(kr);
function E2(t, e) {
  switch (e = Od(e ?? Pd), t) {
    case an.P2PKH:
      switch (e.transactionVersion) {
        case ln.Mainnet:
          return Ke.MainnetSingleSig;
        case ln.Testnet:
          return Ke.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case an.P2SH:
    case an.P2SHNonSequential:
    case an.P2WPKH:
    case an.P2WSH:
    case an.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case ln.Mainnet:
          return Ke.MainnetMultiSig;
        case ln.Testnet:
          return Ke.TestnetMultiSig;
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
].map((t) => new Uint8Array(t)), I2 = Qc.map((t, e) => t.map((n) => Xd[e][n])), v2 = Jc.map((t, e) => t.map((n) => Xd[e][n])), L2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), C2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), mi = (t, e) => t << e | t >>> 32 - e;
function Yu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Si = new Uint32Array(16);
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
      Si[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, p = l;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, y = L2[h], $ = C2[h], _ = Qc[h], k = Jc[h], b = I2[h], v = v2[h];
      for (let A = 0; A < 16; A++) {
        const H = mi(r + Yu(h, i, a, u) + Si[_[A]] + y, b[A]) + l | 0;
        r = l, l = u, u = mi(a, 10) | 0, a = i, i = H;
      }
      for (let A = 0; A < 16; A++) {
        const H = mi(s + Yu(w, o, c, f) + Si[k[A]] + $, v[A]) + p | 0;
        s = p, p = f, f = mi(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + p | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Si.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const k2 = Br(() => new B2()), Ei = BigInt(2 ** 32 - 1), ja = BigInt(32);
function Zd(t, e = !1) {
  return e ? { h: Number(t & Ei), l: Number(t >> ja & Ei) } : { h: Number(t >> ja & Ei) | 0, l: Number(t & Ei) | 0 };
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
].map((t) => BigInt(t))), An = new Uint32Array(80), $n = new Uint32Array(80);
let _o = class extends Xc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: p, Gh: h, Gl: w, Hh: y, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      An[b] = e.getUint32(n), $n[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = An[b - 15] | 0, A = $n[b - 15] | 0, H = tt.rotrSH(v, A, 1) ^ tt.rotrSH(v, A, 8) ^ tt.shrSH(v, A, 7), V = tt.rotrSL(v, A, 1) ^ tt.rotrSL(v, A, 8) ^ tt.shrSL(v, A, 7), N = An[b - 2] | 0, O = $n[b - 2] | 0, x = tt.rotrSH(N, O, 19) ^ tt.rotrBH(N, O, 61) ^ tt.shrSH(N, O, 6), L = tt.rotrSL(N, O, 19) ^ tt.rotrBL(N, O, 61) ^ tt.shrSL(N, O, 6), T = tt.add4L(V, L, $n[b - 7], $n[b - 16]), j = tt.add4H(T, H, x, An[b - 7], An[b - 16]);
      An[b] = j | 0, $n[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: p, Fh: h, Fl: w, Gh: y, Gl: $, Hh: _, Hl: k } = this;
    for (let b = 0; b < 80; b++) {
      const v = tt.rotrSH(l, p, 14) ^ tt.rotrSH(l, p, 18) ^ tt.rotrBH(l, p, 41), A = tt.rotrSL(l, p, 14) ^ tt.rotrSL(l, p, 18) ^ tt.rotrBL(l, p, 41), H = l & h ^ ~l & y, V = p & w ^ ~p & $, N = tt.add5L(k, A, V, J2[b], $n[b]), O = tt.add5H(N, _, v, H, Q2[b], An[b]), x = N | 0, L = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), T = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      _ = y | 0, k = $ | 0, y = h | 0, $ = w | 0, h = l | 0, w = p | 0, { h: l, l: p } = tt.add(u | 0, f | 0, O | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = tt.add3L(x, T, Z);
      r = tt.add3H(R, O, L, j), s = R | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: p } = tt.add(this.Eh | 0, this.El | 0, l | 0, p | 0), { h, l: w } = tt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: y, l: $ } = tt.add(this.Gh | 0, this.Gl | 0, y | 0, $ | 0), { h: _, l: k } = tt.add(this.Hh | 0, this.Hl | 0, _ | 0, k | 0), this.set(r, s, i, o, a, c, u, f, l, p, h, w, y, $, _, k);
  }
  roundClean() {
    An.fill(0), $n.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tx = class extends _o {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ex = class extends _o {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nx = class extends _o {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Br(() => new _o());
Br(() => new tx());
Br(() => new ex());
Br(() => new nx());
var ro = { exports: {} };
ro.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", p = "[object Map]", h = "[object Number]", w = "[object Object]", y = "[object Promise]", $ = "[object RegExp]", _ = "[object Set]", k = "[object String]", b = "[object Symbol]", v = "[object WeakMap]", A = "[object ArrayBuffer]", H = "[object DataView]", V = "[object Float32Array]", N = "[object Float64Array]", O = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", T = "[object Uint8Array]", j = "[object Uint8ClampedArray]", Z = "[object Uint16Array]", R = "[object Uint32Array]", Gt = /[\\^$.*+?()[\]{}|]/g, _t = /\w*$/, Et = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[A] = B[H] = B[a] = B[c] = B[V] = B[N] = B[O] = B[x] = B[L] = B[p] = B[h] = B[w] = B[$] = B[_] = B[k] = B[b] = B[T] = B[j] = B[Z] = B[R] = !0, B[u] = B[f] = B[v] = !1;
  var lt = typeof re == "object" && re && re.Object === Object && re, at = typeof self == "object" && self && self.Object === Object && self, ft = lt || at || Function("return this")(), Tt = e && !e.nodeType && e, Kt = Tt && !0 && t && !t.nodeType && t, g = Kt && Kt.exports === Tt;
  function I(d, E) {
    return d.set(E[0], E[1]), d;
  }
  function U(d, E) {
    return d.add(E), d;
  }
  function X(d, E) {
    for (var C = -1, q = d ? d.length : 0; ++C < q && E(d[C], C, d) !== !1; )
      ;
    return d;
  }
  function ht(d, E) {
    for (var C = -1, q = E.length, Wt = d.length; ++C < q; )
      d[Wt + C] = E[C];
    return d;
  }
  function vt(d, E, C, q) {
    for (var Wt = -1, oe = d ? d.length : 0; ++Wt < oe; )
      C = E(C, d[Wt], Wt, d);
    return C;
  }
  function xe(d, E) {
    for (var C = -1, q = Array(d); ++C < d; )
      q[C] = E(C);
    return q;
  }
  function Ut(d, E) {
    return d == null ? void 0 : d[E];
  }
  function Ce(d) {
    var E = !1;
    if (d != null && typeof d.toString != "function")
      try {
        E = !!(d + "");
      } catch {
      }
    return E;
  }
  function Wn(d) {
    var E = -1, C = Array(d.size);
    return d.forEach(function(q, Wt) {
      C[++E] = [Wt, q];
    }), C;
  }
  function Be(d, E) {
    return function(C) {
      return d(E(C));
    };
  }
  function Oe(d) {
    var E = -1, C = Array(d.size);
    return d.forEach(function(q) {
      C[++E] = q;
    }), C;
  }
  var ie = Array.prototype, tn = Function.prototype, yt = Object.prototype, Ft = ft["__core-js_shared__"], zt = function() {
    var d = /[^.]+$/.exec(Ft && Ft.keys && Ft.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), me = tn.toString, S = yt.hasOwnProperty, z = yt.toString, K = RegExp(
    "^" + me.call(S).replace(Gt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), F = g ? ft.Buffer : void 0, wt = ft.Symbol, bt = ft.Uint8Array, xt = Be(Object.getPrototypeOf, Object), Xt = Object.create, Se = yt.propertyIsEnumerable, qt = ie.splice, G = Object.getOwnPropertySymbols, mt = F ? F.isBuffer : void 0, Jt = Be(Object.keys, Object), Wo = Pr(ft, "DataView"), Es = Pr(ft, "Map"), Yo = Pr(ft, "Promise"), Xo = Pr(ft, "Set"), Zo = Pr(ft, "WeakMap"), As = Pr(Object, "create"), tg = Zn(Wo), eg = Zn(Es), ng = Zn(Yo), rg = Zn(Xo), sg = Zn(Zo), Gl = wt ? wt.prototype : void 0, Vl = Gl ? Gl.valueOf : void 0;
  function Yn(d) {
    var E = -1, C = d ? d.length : 0;
    for (this.clear(); ++E < C; ) {
      var q = d[E];
      this.set(q[0], q[1]);
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
      var C = E[d];
      return C === r ? void 0 : C;
    }
    return S.call(E, d) ? E[d] : void 0;
  }
  function cg(d) {
    var E = this.__data__;
    return As ? E[d] !== void 0 : S.call(E, d);
  }
  function lg(d, E) {
    var C = this.__data__;
    return C[d] = As && E === void 0 ? r : E, this;
  }
  Yn.prototype.clear = ig, Yn.prototype.delete = og, Yn.prototype.get = ag, Yn.prototype.has = cg, Yn.prototype.set = lg;
  function en(d) {
    var E = -1, C = d ? d.length : 0;
    for (this.clear(); ++E < C; ) {
      var q = d[E];
      this.set(q[0], q[1]);
    }
  }
  function ug() {
    this.__data__ = [];
  }
  function fg(d) {
    var E = this.__data__, C = oi(E, d);
    if (C < 0)
      return !1;
    var q = E.length - 1;
    return C == q ? E.pop() : qt.call(E, C, 1), !0;
  }
  function hg(d) {
    var E = this.__data__, C = oi(E, d);
    return C < 0 ? void 0 : E[C][1];
  }
  function dg(d) {
    return oi(this.__data__, d) > -1;
  }
  function pg(d, E) {
    var C = this.__data__, q = oi(C, d);
    return q < 0 ? C.push([d, E]) : C[q][1] = E, this;
  }
  en.prototype.clear = ug, en.prototype.delete = fg, en.prototype.get = hg, en.prototype.has = dg, en.prototype.set = pg;
  function Hr(d) {
    var E = -1, C = d ? d.length : 0;
    for (this.clear(); ++E < C; ) {
      var q = d[E];
      this.set(q[0], q[1]);
    }
  }
  function gg() {
    this.__data__ = {
      hash: new Yn(),
      map: new (Es || en)(),
      string: new Yn()
    };
  }
  function yg(d) {
    return ai(this, d).delete(d);
  }
  function wg(d) {
    return ai(this, d).get(d);
  }
  function bg(d) {
    return ai(this, d).has(d);
  }
  function xg(d, E) {
    return ai(this, d).set(d, E), this;
  }
  Hr.prototype.clear = gg, Hr.prototype.delete = yg, Hr.prototype.get = wg, Hr.prototype.has = bg, Hr.prototype.set = xg;
  function Nr(d) {
    this.__data__ = new en(d);
  }
  function mg() {
    this.__data__ = new en();
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
    var C = this.__data__;
    if (C instanceof en) {
      var q = C.__data__;
      if (!Es || q.length < n - 1)
        return q.push([d, E]), this;
      C = this.__data__ = new Hr(q);
    }
    return C.set(d, E), this;
  }
  Nr.prototype.clear = mg, Nr.prototype.delete = Sg, Nr.prototype.get = Eg, Nr.prototype.has = Ag, Nr.prototype.set = $g;
  function Ig(d, E) {
    var C = ta(d) || Yg(d) ? xe(d.length, String) : [], q = C.length, Wt = !!q;
    for (var oe in d)
      S.call(d, oe) && !(Wt && (oe == "length" || Vg(oe, q))) && C.push(oe);
    return C;
  }
  function Kl(d, E, C) {
    var q = d[E];
    (!(S.call(d, E) && Xl(q, C)) || C === void 0 && !(E in d)) && (d[E] = C);
  }
  function oi(d, E) {
    for (var C = d.length; C--; )
      if (Xl(d[C][0], E))
        return C;
    return -1;
  }
  function vg(d, E) {
    return d && ql(E, ea(E), d);
  }
  function Qo(d, E, C, q, Wt, oe, nn) {
    var ae;
    if (q && (ae = oe ? q(d, Wt, oe, nn) : q(d)), ae !== void 0)
      return ae;
    if (!ci(d))
      return d;
    var Jl = ta(d);
    if (Jl) {
      if (ae = zg(d), !E)
        return Dg(d, ae);
    } else {
      var Or = Xn(d), tu = Or == f || Or == l;
      if (Zg(d))
        return _g(d, E);
      if (Or == w || Or == i || tu && !oe) {
        if (Ce(d))
          return oe ? d : {};
        if (ae = Rg(tu ? {} : d), !E)
          return jg(d, vg(ae, d));
      } else {
        if (!B[Or])
          return oe ? d : {};
        ae = Gg(d, Or, Qo, E);
      }
    }
    nn || (nn = new Nr());
    var eu = nn.get(d);
    if (eu)
      return eu;
    if (nn.set(d, ae), !Jl)
      var nu = C ? Fg(d) : ea(d);
    return X(nu || d, function(na, li) {
      nu && (li = na, na = d[li]), Kl(ae, li, Qo(na, E, C, q, li, d, nn));
    }), ae;
  }
  function Lg(d) {
    return ci(d) ? Xt(d) : {};
  }
  function Cg(d, E, C) {
    var q = E(d);
    return ta(d) ? q : ht(q, C(d));
  }
  function Bg(d) {
    return z.call(d);
  }
  function kg(d) {
    if (!ci(d) || qg(d))
      return !1;
    var E = Ql(d) || Ce(d) ? K : Et;
    return E.test(Zn(d));
  }
  function Mg(d) {
    if (!Yl(d))
      return Jt(d);
    var E = [];
    for (var C in Object(d))
      S.call(d, C) && C != "constructor" && E.push(C);
    return E;
  }
  function _g(d, E) {
    if (E)
      return d.slice();
    var C = new d.constructor(d.length);
    return d.copy(C), C;
  }
  function Jo(d) {
    var E = new d.constructor(d.byteLength);
    return new bt(E).set(new bt(d)), E;
  }
  function Tg(d, E) {
    var C = E ? Jo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.byteLength);
  }
  function Ug(d, E, C) {
    var q = E ? C(Wn(d), !0) : Wn(d);
    return vt(q, I, new d.constructor());
  }
  function Hg(d) {
    var E = new d.constructor(d.source, _t.exec(d));
    return E.lastIndex = d.lastIndex, E;
  }
  function Ng(d, E, C) {
    var q = E ? C(Oe(d), !0) : Oe(d);
    return vt(q, U, new d.constructor());
  }
  function Pg(d) {
    return Vl ? Object(Vl.call(d)) : {};
  }
  function Og(d, E) {
    var C = E ? Jo(d.buffer) : d.buffer;
    return new d.constructor(C, d.byteOffset, d.length);
  }
  function Dg(d, E) {
    var C = -1, q = d.length;
    for (E || (E = Array(q)); ++C < q; )
      E[C] = d[C];
    return E;
  }
  function ql(d, E, C, q) {
    C || (C = {});
    for (var Wt = -1, oe = E.length; ++Wt < oe; ) {
      var nn = E[Wt], ae = void 0;
      Kl(C, nn, ae === void 0 ? d[nn] : ae);
    }
    return C;
  }
  function jg(d, E) {
    return ql(d, Wl(d), E);
  }
  function Fg(d) {
    return Cg(d, ea, Wl);
  }
  function ai(d, E) {
    var C = d.__data__;
    return Kg(E) ? C[typeof E == "string" ? "string" : "hash"] : C.map;
  }
  function Pr(d, E) {
    var C = Ut(d, E);
    return kg(C) ? C : void 0;
  }
  var Wl = G ? Be(G, Object) : ty, Xn = Bg;
  (Wo && Xn(new Wo(new ArrayBuffer(1))) != H || Es && Xn(new Es()) != p || Yo && Xn(Yo.resolve()) != y || Xo && Xn(new Xo()) != _ || Zo && Xn(new Zo()) != v) && (Xn = function(d) {
    var E = z.call(d), C = E == w ? d.constructor : void 0, q = C ? Zn(C) : void 0;
    if (q)
      switch (q) {
        case tg:
          return H;
        case eg:
          return p;
        case ng:
          return y;
        case rg:
          return _;
        case sg:
          return v;
      }
    return E;
  });
  function zg(d) {
    var E = d.length, C = d.constructor(E);
    return E && typeof d[0] == "string" && S.call(d, "index") && (C.index = d.index, C.input = d.input), C;
  }
  function Rg(d) {
    return typeof d.constructor == "function" && !Yl(d) ? Lg(xt(d)) : {};
  }
  function Gg(d, E, C, q) {
    var Wt = d.constructor;
    switch (E) {
      case A:
        return Jo(d);
      case a:
      case c:
        return new Wt(+d);
      case H:
        return Tg(d, q);
      case V:
      case N:
      case O:
      case x:
      case L:
      case T:
      case j:
      case Z:
      case R:
        return Og(d, q);
      case p:
        return Ug(d, q, C);
      case h:
      case k:
        return new Wt(d);
      case $:
        return Hg(d);
      case _:
        return Ng(d, q, C);
      case b:
        return Pg(d);
    }
  }
  function Vg(d, E) {
    return E = E ?? s, !!E && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < E;
  }
  function Kg(d) {
    var E = typeof d;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? d !== "__proto__" : d === null;
  }
  function qg(d) {
    return !!zt && zt in d;
  }
  function Yl(d) {
    var E = d && d.constructor, C = typeof E == "function" && E.prototype || yt;
    return d === C;
  }
  function Zn(d) {
    if (d != null) {
      try {
        return me.call(d);
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
    return Xg(d) && S.call(d, "callee") && (!Se.call(d, "callee") || z.call(d) == i);
  }
  var ta = Array.isArray;
  function Zl(d) {
    return d != null && Qg(d.length) && !Ql(d);
  }
  function Xg(d) {
    return Jg(d) && Zl(d);
  }
  var Zg = mt || ey;
  function Ql(d) {
    var E = ci(d) ? z.call(d) : "";
    return E == f || E == l;
  }
  function Qg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function ci(d) {
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
})(ro, ro.exports);
var rx = ro.exports;
const Qd = /* @__PURE__ */ Ih(rx);
var Fa;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fa || (Fa = {}));
function sx(t, e) {
  return { type: Fa.Address, version: t, hash160: e };
}
function ix(t) {
  return kr.c32address(t.version, t.hash160);
}
const ox = (t) => k2(Gd(t)), ax = (t) => Y(ox(t));
Pt.hmacSha256Sync = (t, ...e) => {
  const n = zd.create(Gd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function cx(t, e = "mainnet") {
  e = Od(e), t = typeof t == "string" ? dt(t) : t;
  const n = E2(an.P2PKH, e), r = sx(n, ax(t));
  return ix(r);
}
function lx(t, e) {
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
  const s = r.issuer.publicKey, i = cx(s);
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
function ux(t, e = null) {
  let n;
  e ? n = lx(t, e) : n = Yt.decodeToken(t);
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
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = n1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ui("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Yt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await s2(e))
      throw new ui("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (sa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Cu(s, i.private_key);
          } catch {
            if (Gr.warn("Failed decryption of appPrivateKey, will try to use as given"), !Pt.isValidPrivateKey(i.private_key))
              throw new ui("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Cu(s, c);
          } catch {
            Gr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ui("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Vy, f;
    sa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), sa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Hd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, p = i.profile_url;
    if (!l.profile && p) {
      const h = await n(p);
      if (!h.ok)
        l.profile = Object.assign({}, Cy);
      else {
        const w = await h.text(), y = JSON.parse(w);
        l.profile = ux(y[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
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
  const e = gx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!To(r.id));
  return e.concat(n);
}, To = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Jd = "STX_PROVIDER", gr = () => typeof window > "u" ? null : window.localStorage.getItem(Jd), wx = (t) => {
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
var yr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yr || (yr = {}));
var Zu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zu || (Zu = {}));
const Ex = "https://api.mainnet.hiro.so", Ax = "https://api.testnet.hiro.so", $x = "http://localhost:3999", Ix = ["mainnet", "testnet", "devnet", "mocknet"];
class wr {
  constructor(e) {
    this.version = yr.Mainnet, this.chainId = os.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === yr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
wr.fromName = (t) => {
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
wr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : wr.fromName(t);
class Ra extends wr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = yr.Mainnet, this.chainId = os.Mainnet;
  }
}
class Ga extends wr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = yr.Testnet, this.chainId = os.Testnet;
  }
}
class t0 extends wr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = yr.Testnet, this.chainId = os.Testnet;
  }
}
const vx = t0;
var br;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(br || (br = {}));
var so;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(so || (so = {}));
br.Mainnet;
var xr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(xr || (xr = {}));
var mr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mr || (mr = {}));
xr.Mainnet;
const Lx = {
  chainId: br.Mainnet,
  transactionVersion: xr.Mainnet,
  peerNetworkId: so.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: mr.MainnetSingleSig,
    multiSig: mr.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Va = {
  chainId: br.Testnet,
  transactionVersion: xr.Testnet,
  peerNetworkId: so.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: mr.TestnetSingleSig,
    multiSig: mr.TestnetMultiSig
  },
  client: { baseUrl: Th }
}, zi = {
  ...Va,
  addressVersion: { ...Va.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, Cx = {
  ...zi,
  addressVersion: { ...zi.addressVersion },
  client: { ...zi.client }
};
function Bx(t) {
  switch (t) {
    case "mainnet":
      return Lx;
    case "testnet":
      return Va;
    case "devnet":
      return zi;
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
let It = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? dt(e) : e;
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
    const n = this.readBytes(e).slice().reverse(), r = Y(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Y(n);
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
const _x = 128, Tx = 128, n0 = 16, or = 32, Ka = 80, Uo = 65, Ux = 32, Hx = 64, io = 34, Nx = 1 + 16 * 1024 * 1024, Px = 165, Ox = 16, Dx = 16, jx = 20, Fx = Dx + 2 + jx, zx = Fx + 4, Rx = Nx + (Px + Ox * zx);
var gt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gt || (gt = {}));
var qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(qa || (qa = {}));
var he;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(he || (he = {}));
const fa = ["onChainOnly", "offChainOnly", "any"];
fa[0] + "", he.OnChainOnly, fa[1] + "", he.OffChainOnly, fa[2] + "", he.Any, he.OnChainOnly + "", he.OnChainOnly, he.OffChainOnly + "", he.OffChainOnly, he.Any + "", he.Any;
var oo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(oo || (oo = {}));
var Lt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Lt || (Lt = {}));
var Ht;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ht || (Ht = {}));
var At;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(At || (At = {}));
var kt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(kt || (kt = {}));
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
var ne;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ne || (ne = {}));
var Ju;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ju || (Ju = {}));
var Xa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Xa || (Xa = {}));
var Te;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Te || (Te = {}));
var tf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(tf || (tf = {}));
let Ho = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Vr = class extends Ho {
  constructor(e) {
    super(e);
  }
}, te = class extends Ho {
  constructor(e) {
    super(e);
  }
}, ao = class extends Ho {
  constructor(e) {
    super(e);
  }
}, nr = class extends Ho {
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
const rr = {
  number: Za,
  bool: Gx,
  bytes: r0,
  hash: Vx,
  exists: Kx,
  output: qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Fe = (t, e) => t << 32 - e | t >>> e, Wx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Mr(t) {
  const e = (r) => t().update(tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let i0 = class extends s0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, rr.hash(e);
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
    return rr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    rr.exists(this), rr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let el = class extends s0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ha(this.buffer);
  }
  update(e) {
    rr.exists(this);
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
    rr.exists(this), rr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Xx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ha(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
let a0 = class extends el {
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
    for (let l = 0; l < 16; l++, n += 4)
      vn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = vn[l - 15], h = vn[l - 2], w = Fe(p, 7) ^ Fe(p, 18) ^ p >>> 3, y = Fe(h, 17) ^ Fe(h, 19) ^ h >>> 10;
      vn[l] = y + vn[l - 7] + w + vn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = Fe(a, 6) ^ Fe(a, 11) ^ Fe(a, 25), h = f + p + Zx(a, c, u) + Jx[l] + vn[l] | 0, y = (Fe(r, 2) ^ Fe(r, 13) ^ Fe(r, 22)) + Qx(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    vn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tm = class extends a0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const nl = Mr(() => new a0());
Mr(() => new tm());
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
].map((t) => new Uint8Array(t)), rm = rl.map((t, e) => t.map((n) => l0[e][n])), sm = sl.map((t, e) => t.map((n) => l0[e][n])), im = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), om = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ai = (t, e) => t << e | t >>> 32 - e;
function ef(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const $i = new Uint32Array(16);
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
      $i[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, p = l;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, y = im[h], $ = om[h], _ = rl[h], k = sl[h], b = rm[h], v = sm[h];
      for (let A = 0; A < 16; A++) {
        const H = Ai(r + ef(h, i, a, u) + $i[_[A]] + y, b[A]) + l | 0;
        r = l, l = u, u = Ai(a, 10) | 0, a = i, i = H;
      }
      for (let A = 0; A < 16; A++) {
        const H = Ai(s + ef(w, o, c, f) + $i[k[A]] + $, v[A]) + p | 0;
        s = p, p = f, f = Ai(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + p | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    $i.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const cm = Mr(() => new am()), Ii = BigInt(2 ** 32 - 1), Qa = BigInt(32);
function u0(t, e = !1) {
  return e ? { h: Number(t & Ii), l: Number(t >> Qa & Ii) } : { h: Number(t >> Qa & Ii) | 0, l: Number(t & Ii) | 0 };
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
].map((t) => BigInt(t))), Ln = new Uint32Array(80), Cn = new Uint32Array(80);
let No = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: p, Gh: h, Gl: w, Hh: y, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Ln[b] = e.getUint32(n), Cn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Ln[b - 15] | 0, A = Cn[b - 15] | 0, H = et.rotrSH(v, A, 1) ^ et.rotrSH(v, A, 8) ^ et.shrSH(v, A, 7), V = et.rotrSL(v, A, 1) ^ et.rotrSL(v, A, 8) ^ et.shrSL(v, A, 7), N = Ln[b - 2] | 0, O = Cn[b - 2] | 0, x = et.rotrSH(N, O, 19) ^ et.rotrBH(N, O, 61) ^ et.shrSH(N, O, 6), L = et.rotrSL(N, O, 19) ^ et.rotrBL(N, O, 61) ^ et.shrSL(N, O, 6), T = et.add4L(V, L, Cn[b - 7], Cn[b - 16]), j = et.add4H(T, H, x, Ln[b - 7], Ln[b - 16]);
      Ln[b] = j | 0, Cn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: p, Fh: h, Fl: w, Gh: y, Gl: $, Hh: _, Hl: k } = this;
    for (let b = 0; b < 80; b++) {
      const v = et.rotrSH(l, p, 14) ^ et.rotrSH(l, p, 18) ^ et.rotrBH(l, p, 41), A = et.rotrSL(l, p, 14) ^ et.rotrSL(l, p, 18) ^ et.rotrBL(l, p, 41), H = l & h ^ ~l & y, V = p & w ^ ~p & $, N = et.add5L(k, A, V, Mm[b], Cn[b]), O = et.add5H(N, _, v, H, km[b], Ln[b]), x = N | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), T = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      _ = y | 0, k = $ | 0, y = h | 0, $ = w | 0, h = l | 0, w = p | 0, { h: l, l: p } = et.add(u | 0, f | 0, O | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = et.add3L(x, T, Z);
      r = et.add3H(R, O, L, j), s = R | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = et.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: p } = et.add(this.Eh | 0, this.El | 0, l | 0, p | 0), { h, l: w } = et.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: y, l: $ } = et.add(this.Gh | 0, this.Gl | 0, y | 0, $ | 0), { h: _, l: k } = et.add(this.Hh | 0, this.Hl | 0, _ | 0, k | 0), this.set(r, s, i, o, a, c, u, f, l, p, h, w, y, $, _, k);
  }
  roundClean() {
    Ln.fill(0), Cn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _m = class extends No {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Tm = class extends No {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Um = class extends No {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Mr(() => new No());
Mr(() => new _m());
const Hm = Mr(() => new Tm());
Mr(() => new Um());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var Rt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Rt || (Rt = {}));
function il(t) {
  return Rt[t];
}
const Nm = () => ({ type: ct.BoolTrue }), Pm = () => ({ type: ct.BoolFalse }), Om = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ct.Buffer, value: Y(t) };
}, nf = BigInt("0xffffffffffffffffffffffffffffffff"), Dm = BigInt(0), rf = BigInt("0x7fffffffffffffffffffffffffffffff"), sf = BigInt("-170141183460469231731687303715884105728"), jm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ka(dt(t))), ue(t, Uint8Array) && (t = ka(t));
  const e = Qt(t);
  if (e > rf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${rf}`);
  if (e < sf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${sf}`);
  return { type: ct.Int, value: e };
}, Fm = (t) => {
  const e = Qt(t);
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
    version: mr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function of(t) {
  if (t && S0(t, io))
    throw new Error(`Memo exceeds maximum length of ${io} bytes`);
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
  if (dt(t).byteLength != Uo)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function Gm(t, e, n) {
  return typeof t == "string" && (t = oS(t)), typeof n == "string" && (n = of(n)), {
    type: D.Payload,
    payloadType: gt.TokenTransfer,
    recipient: t,
    amount: Qt(e),
    memo: n ?? of("")
  };
}
function Vm(t, e, n, r) {
  return typeof e == "string" && (e = Ne(e)), typeof n == "string" && (n = Ne(n)), {
    type: D.Payload,
    payloadType: gt.ContractCall,
    contractAddress: typeof t == "string" ? qn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Km(t) {
  return Ne(t, 4, 1e5);
}
function af(t, e, n) {
  return typeof t == "string" && (t = Ne(t)), typeof e == "string" && (e = Km(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: gt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: gt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function qm() {
  return { type: D.Payload, payloadType: gt.PoisonMicroblock };
}
function cf(t, e) {
  if (t.byteLength != or)
    throw Error(`Coinbase buffer size must be ${or} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: gt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: gt.Coinbase,
    coinbaseBytes: t
  };
}
function Wm(t, e, n) {
  if (t.byteLength != or)
    throw Error(`Coinbase buffer size must be ${or} bytes`);
  if (n.byteLength != Ka)
    throw Error(`VRF proof buffer size must be ${Ka} bytes`);
  return {
    type: D.Payload,
    payloadType: gt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === ct.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Ym(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
    payloadType: gt.TenureChange,
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
    address: qn(t),
    contractName: Ne(e),
    assetName: Ne(n)
  };
}
function qn(t) {
  const e = kr.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Zm(t, e) {
  const n = qn(t), r = Ne(e);
  return {
    type: D.Principal,
    prefix: ne.Contract,
    address: n,
    contractName: r
  };
}
function Qm(t) {
  const e = qn(t);
  return {
    type: D.Principal,
    prefix: ne.Standard,
    address: e
  };
}
function Kr(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function sn(t) {
  switch (t.type) {
    case D.Address:
      return ri(t);
    case D.Principal:
      return d0(t);
    case D.LengthPrefixedString:
      return cs(t);
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
function ri(t) {
  const e = [];
  return e.push(dt(Zs(t.version, 1))), e.push(dt(t.hash160)), Dt(e);
}
function as(t) {
  const e = ue(t, It) ? t : new It(t), n = So(Y(e.readBytes(1))), r = Y(e.readBytes(20));
  return { type: D.Address, version: n, hash160: r };
}
function d0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ne.Standard || t.prefix === ne.Contract) && e.push(ri(t.address)), t.prefix === ne.Contract && e.push(cs(t.contractName)), Dt(e);
}
function Jm(t) {
  const e = ue(t, It) ? t : new It(t), n = e.readUInt8Enum(ne, (i) => {
    throw new te(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ne.Origin)
    return { type: D.Principal, prefix: n };
  const r = as(e);
  if (n === ne.Standard)
    return { type: D.Principal, prefix: n, address: r };
  const s = Ie(e);
  return {
    type: D.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function cs(t) {
  const e = [], n = vr(t.content), r = n.byteLength;
  return e.push(dt(Zs(r, t.lengthPrefixBytes))), e.push(n), Dt(e);
}
function Ie(t, e, n) {
  e = e || 1;
  const r = ue(t, It) ? t : new It(t), s = So(Y(r.readBytes(e))), i = Qs(r.readBytes(s));
  return Ne(i, e, n ?? 128);
}
function tS(t) {
  const e = [], n = vr(t.content), r = CS(Y(n), io * 2);
  return e.push(dt(r)), Dt(e);
}
function p0(t) {
  const e = ue(t, It) ? t : new It(t);
  let n = Qs(e.readBytes(io));
  return n = n.replace(/\u0000*$/, ""), { type: D.MemoString, content: n };
}
function g0(t) {
  const e = [];
  return e.push(ri(t.address)), e.push(cs(t.contractName)), e.push(cs(t.assetName)), Dt(e);
}
function tc(t) {
  const e = ue(t, It) ? t : new It(t);
  return {
    type: D.Asset,
    address: as(e),
    contractName: Ie(e),
    assetName: Ie(e)
  };
}
function al(t) {
  const e = t.values, n = [];
  n.push(dt(Zs(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(sn(r));
  return Dt(n);
}
function y0(t, e, n) {
  const r = ue(t, It) ? t : new It(t), s = So(Y(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case D.Address:
        i.push(as(r));
        break;
      case D.LengthPrefixedString:
        i.push(Ie(r));
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
  return Y(w0(t));
}
function w0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d0(t.principal)), (t.conditionType === Lt.Fungible || t.conditionType === Lt.NonFungible) && e.push(g0(t.asset)), t.conditionType === Lt.NonFungible && e.push(qe(t.assetName)), e.push(t.conditionCode), t.conditionType === Lt.STX || t.conditionType === Lt.Fungible || t.conditionType === Lt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Vr("The post-condition amount may not be larger than 8 bytes");
    e.push(Vn(t.amount, 8));
  }
  return Dt(e);
}
function nS(t) {
  const e = ue(t, It) ? t : new It(t), n = e.readUInt8Enum(Lt, (a) => {
    throw new te(`Could not read ${a} as PostConditionType`);
  }), r = Jm(e);
  let s, i, o;
  switch (n) {
    case Lt.STX:
      return s = e.readUInt8Enum(Ts, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Lt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.Fungible:
      return i = tc(e), s = e.readUInt8Enum(Ts, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Lt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Lt.NonFungible:
      i = tc(e);
      const a = Ve(e);
      return s = e.readUInt8Enum(Wa, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: Lt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Lt.Staking:
      return s = e.readUInt8Enum(Ts, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: Lt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Lt.PoX: {
      const c = e.readUInt8Enum(Ya, (u) => {
        throw new te(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: D.PostCondition,
        conditionType: Lt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function b0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case gt.TokenTransfer:
      e.push(qe(t.recipient)), e.push(Vn(t.amount, 8)), e.push(sn(t.memo));
      break;
    case gt.ContractCall:
      e.push(sn(t.contractAddress)), e.push(sn(t.contractName)), e.push(sn(t.functionName));
      const n = new Uint8Array(4);
      ur(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(qe(r));
      });
      break;
    case gt.SmartContract:
      e.push(sn(t.contractName)), e.push(sn(t.codeBody));
      break;
    case gt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(sn(t.contractName)), e.push(sn(t.codeBody));
      break;
    case gt.PoisonMicroblock:
      break;
    case gt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case gt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(qe(t.recipient));
      break;
    case gt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(qe(t.recipient ? h0(t.recipient) : f0())), e.push(t.vrfProof);
      break;
    case gt.TenureChange:
      e.push(dt(t.tenureHash)), e.push(dt(t.previousTenureHash)), e.push(dt(t.burnViewHash)), e.push(dt(t.previousTenureEnd)), e.push(ur(new Uint8Array(4), t.previousTenureBlocks)), e.push(Zy(new Uint8Array(1), t.cause)), e.push(dt(t.publicKeyHash));
      break;
  }
  return Dt(e);
}
function rS(t) {
  const e = ue(t, It) ? t : new It(t);
  switch (e.readUInt8Enum(gt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case gt.TokenTransfer:
      const r = Ve(e), s = Qt(e.readBytes(8)), i = p0(e);
      return Gm(r, s, i);
    case gt.ContractCall:
      const o = as(e), a = Ie(e), c = Ie(e), u = [], f = e.readUInt32BE();
      for (let v = 0; v < f; v++) {
        const A = Ve(e);
        u.push(A);
      }
      return Vm(o, a, c, u);
    case gt.SmartContract:
      const l = Ie(e), p = Ie(e, 4, 1e5);
      return af(l, p);
    case gt.VersionedSmartContract: {
      const v = e.readUInt8Enum(qa, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), A = Ie(e), H = Ie(e, 4, Rx);
      return af(A, H, v);
    }
    case gt.PoisonMicroblock:
      return qm();
    case gt.Coinbase: {
      const v = e.readBytes(or);
      return cf(v);
    }
    case gt.CoinbaseToAltRecipient: {
      const v = e.readBytes(or), A = Ve(e);
      return cf(v, A);
    }
    case gt.NakamotoCoinbase: {
      const v = e.readBytes(or), A = Ve(e), H = e.readBytes(Ka);
      return Wm(v, A, H);
    }
    case gt.TenureChange:
      const h = Y(e.readBytes(20)), w = Y(e.readBytes(20)), y = Y(e.readBytes(20)), $ = Y(e.readBytes(32)), _ = e.readUInt32BE(), k = e.readUInt8Enum(Xa, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), b = Y(e.readBytes(20));
      return Ym(h, w, y, $, _, k, b);
  }
}
function ec(t) {
  const e = ue(t, It) ? t : new It(t);
  return Ja(Y(e.readBytes(Uo)));
}
function sS(t) {
  const e = ue(t, It) ? t : new It(t), n = e.readUInt8Enum(Te, (r) => {
    throw new te(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Te.PublicKeyCompressed:
      return Kr(kt.Compressed, rc(e));
    case Te.PublicKeyUncompressed:
      return Kr(kt.Uncompressed, ws(DS(rc(e).data)));
    case Te.SignatureCompressed:
      return Kr(kt.Compressed, ec(e));
    case Te.SignatureUncompressed:
      return Kr(kt.Uncompressed, ec(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function cl(t) {
  return dt(t.data);
}
function iS(t) {
  const e = [];
  switch (t.contents.type) {
    case D.PublicKey:
      e.push(t.pubKeyEncoding === kt.Compressed ? Te.PublicKeyCompressed : Te.PublicKeyUncompressed), e.push(dt(OS(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === kt.Compressed ? Te.SignatureCompressed : Te.SignatureUncompressed), e.push(cl(t.contents));
      break;
  }
  return Dt(e);
}
function nc(t) {
  return t.data.slice();
}
function rc(t) {
  const e = ue(t, It) ? t : new It(t), n = e.readUInt8(), r = n === 4 ? Hx : Ux;
  return ws(Dt([n, e.readBytes(r)]));
}
function ll(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === At.P2PKH || e === At.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === At.P2WPKH || e === At.P2WSH || e === At.P2WSHNonSequential) && !r.map((s) => s.data).every(bs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case At.P2PKH:
      return vi(t, BS(r[0].data));
    case At.P2WPKH:
      return vi(t, kS(r[0].data));
    case At.P2SH:
    case At.P2SHNonSequential:
      return vi(t, MS(n, r.map(nc)));
    case At.P2WSH:
    case At.P2WSHNonSequential:
      return vi(t, _S(n, r.map(nc)));
  }
}
function vi(t, e) {
  return { type: D.Address, version: t, hash160: e };
}
function ul(t) {
  return kr.c32address(t.version, t.hash160);
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
  const e = qn(t);
  return { type: ct.PrincipalStandard, value: ul(e) };
}
function cS(t) {
  return { type: ct.PrincipalStandard, value: ul(t) };
}
function lS(t, e) {
  const n = qn(t), r = Ne(e);
  return x0(n, r);
}
function x0(t, e) {
  if (vr(e.content).byteLength >= 128)
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
function Ve(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new It(dt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new It(t) : e = t;
  switch (e.readUInt8Enum(Rt, (r) => {
    throw new te(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Rt.int:
      return jm(ka(e.readBytes(16)));
    case Rt.uint:
      return Fm(e.readBytes(16));
    case Rt.buffer:
      const r = e.readUInt32BE();
      return Om(e.readBytes(r));
    case Rt.true:
      return Nm();
    case Rt.false:
      return Pm();
    case Rt.address:
      const s = as(e);
      return cS(s);
    case Rt.contract:
      const i = as(e), o = Ie(e);
      return x0(i, o);
    case Rt.ok:
      return fS(Ve(e));
    case Rt.err:
      return uS(Ve(e));
    case Rt.none:
      return f0();
    case Rt.some:
      return h0(Ve(e));
    case Rt.list:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Ve(e));
      return zm(c);
    case Rt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const $ = Ie(e).content;
        if ($ === void 0)
          throw new te('"content" is undefined');
        f[$] = Ve(e);
      }
      return pS(f);
    case Rt.ascii:
      const l = e.readUInt32BE(), p = Ry(e.readBytes(l));
      return hS(p);
    case Rt.utf8:
      const h = e.readUInt32BE(), w = Qs(e.readBytes(h));
      return dS(w);
    default:
      throw new te("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ze(t, e) {
  return Dt([il(t), e]);
}
function gS(t) {
  return new Uint8Array([il(t.type)]);
}
function yS(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([il(t.type)]) : Ze(t.type, qe(t.value));
}
function wS(t) {
  const e = new Uint8Array(4);
  return ur(e, Math.ceil(t.value.length / 2), 0), Ze(t.type, Ye(e, dt(t.value)));
}
function bS(t) {
  const e = Uc(Oy(BigInt(t.value), BigInt(Tx)), n0);
  return Ze(t.type, e);
}
function xS(t) {
  const e = Uc(BigInt(t.value), n0);
  return Ze(t.type, e);
}
function mS(t) {
  return Ze(t.type, ri(qn(t.value)));
}
function SS(t) {
  const [e, n] = US(t.value);
  return Ze(t.type, Ye(ri(qn(e)), cs(Ne(n))));
}
function ES(t) {
  return Ze(t.type, qe(t.value));
}
function AS(t) {
  const e = [], n = new Uint8Array(4);
  ur(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = qe(r);
    e.push(s);
  }
  return Ze(t.type, Dt(e));
}
function $S(t) {
  const e = [], n = new Uint8Array(4);
  ur(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ne(s);
    e.push(cs(i));
    const o = qe(t.value[s]);
    e.push(o);
  }
  return Ze(t.type, Dt(e));
}
function m0(t, e) {
  const n = [], r = e == "ascii" ? zy(t.value) : vr(t.value), s = new Uint8Array(4);
  return ur(s, r.length, 0), n.push(s), n.push(r), Ze(t.type, Dt(n));
}
function IS(t) {
  return m0(t, "ascii");
}
function vS(t) {
  return m0(t, "utf8");
}
function uf(t) {
  return Y(qe(t));
}
function qe(t) {
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
const LS = (t) => t.length % 2 ? `0${t}` : t, CS = (t, e) => t.padEnd(e, "0"), S0 = (t, e) => t ? vr(t).length > e : !1;
function sc(t) {
  return Qd(t);
}
const js = (t) => cm(nl(t)), fl = (t) => Y(Hm(t)), BS = (t) => Y(js(t)), kS = (t) => {
  const e = js(t), n = Ye(new Uint8Array([0]), new Uint8Array([e.length]), e), r = js(n);
  return Y(r);
}, MS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = js(r);
  return Y(s);
}, _S = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = nl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Dt(i), a = js(o);
  return Y(a);
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
Pt.hmacSha256Sync = (t, ...e) => {
  const n = o0.create(nl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ws(t) {
  return t = typeof t == "string" ? dt(t) : t, {
    type: D.PublicKey,
    data: t
  };
}
function HS(t, e, n = kt.Compressed) {
  const r = qy(e), s = new ye(lu(r.r), lu(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === kt.Compressed;
  return i.toHex(o);
}
function NS(t) {
  return typeof t == "string" ? t : Y(t);
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
  return Y(Js(t.slice(0, 32), e));
}
function OS(t) {
  return it.fromHex(hl(t)).toHex(!0);
}
function DS(t) {
  return it.fromHex(hl(t)).toHex(!1);
}
function jS(t, e) {
  t = Hc(t);
  const [n, r] = Ao(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Zs(r, 1) + ye.fromHex(n).toCompactHex();
}
function dl() {
  return {
    type: D.MessageSignature,
    data: Y(new Uint8Array(Uo))
  };
}
function A0(t, e, n, r) {
  const s = ll(0, t, 1, [ws(e)]).hash160, i = bs(e) ? kt.Compressed : kt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Qt(n),
    fee: Qt(r),
    keyEncoding: i,
    signature: dl()
  };
}
function Fs(t) {
  return "signature" in t;
}
function ff(t) {
  return t === At.P2SH || t === At.P2WSH;
}
function FS(t) {
  return t === At.P2SHNonSequential || t === At.P2WSHNonSequential;
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
    dt(t.signer),
    Vn(t.nonce, 8),
    Vn(t.fee, 8),
    t.keyEncoding,
    cl(t.signature)
  ];
  return Dt(e);
}
function RS(t) {
  const e = [
    t.hashMode,
    dt(t.signer),
    Vn(t.nonce, 8),
    Vn(t.fee, 8)
  ], n = ol(t.fields);
  e.push(al(n));
  const r = new Uint8Array(2);
  return Yy(r, t.signaturesRequired, 0), e.push(r), Dt(e);
}
function GS(t, e) {
  const n = Y(e.readBytes(20)), r = BigInt(`0x${Y(e.readBytes(8))}`), s = BigInt(`0x${Y(e.readBytes(8))}`), i = e.readUInt8Enum(kt, (a) => {
    throw new te(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === At.P2WPKH && i != kt.Compressed)
    throw new te("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = Y(e.readBytes(20)), r = BigInt("0x" + Y(e.readBytes(8))), s = BigInt("0x" + Y(e.readBytes(8))), i = y0(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case D.PublicKey:
        bs(u.contents.data) || (o = !0);
        break;
      case D.MessageSignature:
        if (u.pubKeyEncoding === kt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new nr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === At.P2WSH || t === At.P2WSHNonSequential))
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
function da(t) {
  return Fs(t) ? zS(t) : RS(t);
}
function pa(t) {
  const e = t.readUInt8Enum(At, (n) => {
    throw new te(`Could not parse ${n} as AddressHashMode`);
  });
  return e === At.P2PKH || e === At.P2WPKH ? GS(e, t) : VS(e, t);
}
function $0(t, e, n, r) {
  const i = t + Y(new Uint8Array([e])) + Y(Vn(n, 8)) + Y(Vn(r, 8));
  if (dt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return fl(dt(i));
}
function I0(t, e, n) {
  const r = 33 + Uo, s = bs(e.data) ? kt.Compressed : kt.Uncompressed, i = t + LS(s.toString(16)) + n, o = dt(i);
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
  const t = A0(At.P2PKH, "", 0, 0);
  return t.signer = Rm().hash160, t.keyEncoding = kt.Compressed, t.signature = dl(), t;
}
function df(t, e, n) {
  return Fs(t) ? WS(t, e, n) : YS(t, e, n);
}
function WS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = v0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = ll(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new nr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function YS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        bs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === kt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = v0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ff(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new nr("Too many signatures");
        break;
    }
  if (ff(t.hashMode) && o !== t.signaturesRequired || FS(t.hashMode) && o < t.signaturesRequired)
    throw new nr("Incorrect number of signatures");
  if (i && (t.hashMode === At.P2WSH || t.hashMode === At.P2WSHNonSequential))
    throw new nr("Uncompressed keys are not allowed in this hash mode");
  const a = ll(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new nr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function L0(t) {
  return {
    authType: Ht.Standard,
    spendingCondition: t
  };
}
function C0(t, e) {
  return {
    authType: Ht.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || A0(At.P2PKH, "0".repeat(66), 0, 0)
  };
}
function pf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ht.Standard:
        return L0(hf(t.spendingCondition));
      case Ht.Sponsored:
        return C0(hf(t.spendingCondition), qS());
      default:
        throw new ao("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function XS(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      return df(t.spendingCondition, e, Ht.Standard);
    case Ht.Sponsored:
      return df(t.spendingCondition, e, Ht.Standard);
    default:
      throw new ao("Invalid origin auth type");
  }
}
function ZS(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Qt(e)
      };
      return { ...t, spendingCondition: n };
    case Ht.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Qt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function QS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Qt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function JS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Qt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function t3(t, e) {
  const n = {
    ...e,
    nonce: Qt(e.nonce),
    fee: Qt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ht.Standard:
      e.push(da(t.spendingCondition));
      break;
    case Ht.Sponsored:
      e.push(da(t.spendingCondition)), e.push(da(t.sponsorSpendingCondition));
      break;
  }
  return Dt(e);
}
function n3(t) {
  const e = t.readUInt8Enum(Ht, (r) => {
    throw new te(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ht.Standard:
      return n = pa(t), L0(n);
    case Ht.Sponsored:
      n = pa(t);
      const r = pa(t);
      return C0(n, r);
  }
}
class r3 {
  constructor({ auth: e, payload: n, postConditions: r = ol([]), postConditionMode: s = oo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = kx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Qt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = he.Any;
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
    return this.signAndAppend(this.auth.spendingCondition, e, Ht.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ht.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ht.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : ws(e), r = this.auth.spendingCondition;
    if (r && !Fs(r)) {
      const s = bs(n.data);
      r.fields.push(Kr(s ? kt.Compressed : kt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = KS(n, r, e.fee, e.nonce, s);
    if (Fs(e))
      e.signature = Ja(i);
    else {
      const a = E0(s);
      e.fields.push(Kr(a ? kt.Compressed : kt.Uncompressed, Ja(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return fl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new ao("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t3(this.auth, e);
  }
  setFee(e) {
    this.auth = ZS(this.auth, e);
  }
  setNonce(e) {
    this.auth = QS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new ao("Cannot sponsor sign a non-sponsored transaction");
    this.auth = JS(this.auth, e);
  }
  serialize() {
    return Y(this.serializeBytes());
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
    return ur(n, this.chainId, 0), e.push(n), e.push(e3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(al(this.postConditions)), e.push(b0(this.payload)), Dt(e);
  }
}
function s3(t) {
  const e = ue(t, It) ? t : new It(t), n = e.readUInt8Enum(xr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = n3(e), i = e.readUInt8Enum(he, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(oo, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = y0(e, D.PostCondition), c = rS(e), u = new r3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const gf = BigInt("18446744073709551615");
function ga(t) {
  const e = Qt(t);
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
        conditionType: Lt.STX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ne.Origin } : Ls(t.address),
        conditionCode: Li(t.condition),
        amount: ga(t.amount)
      };
    case "ft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Lt.Fungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ne.Origin } : Ls(t.address),
        conditionCode: Li(t.condition),
        amount: ga(t.amount),
        asset: lf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Lt.NonFungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ne.Origin } : Ls(t.address),
        conditionCode: Li(t.condition),
        asset: lf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Lt.Staking,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ne.Origin } : Ls(t.address),
        conditionCode: Li(t.condition),
        amount: ga(t.amount)
      };
    case "pox-postcondition":
      return {
        type: D.PostCondition,
        conditionType: Lt.PoX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ne.Origin } : Ls(t.address),
        conditionCode: o3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Li(t) {
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
function dn(t) {
  return wl(...t.map((e) => typeof e == "number" ? yf([e]) : e instanceof Array ? yf(e) : e));
}
function Po(t, e, n = 0) {
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
var _e;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_e || (_e = {}));
const ya = ["onChainOnly", "offChainOnly", "any"];
ya[0] + "", _e.OnChainOnly, ya[1] + "", _e.OffChainOnly, ya[2] + "", _e.Any, _e.OnChainOnly + "", _e.OnChainOnly, _e.OffChainOnly + "", _e.OffChainOnly, _e.Any + "", _e.Any;
var lc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lc || (lc = {}));
lc.Mainnet;
var xf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xf || (xf = {}));
var Qn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qn || (Qn = {}));
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
const ba = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ze = (t, e) => t << 32 - e | t >>> e, x3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function _r(t) {
  const e = (r) => t().update(T0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function E3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
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
    for (let l = o; l < s; l++)
      n[l] = 0;
    E3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ba(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
].map((t) => new Uint8Array(t)), I3 = xl.map((t, e) => t.map((n) => H0[e][n])), v3 = ml.map((t, e) => t.map((n) => H0[e][n])), L3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), C3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ci = (t, e) => t << e | t >>> 32 - e;
function Cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Bi = new Uint32Array(16);
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
      Bi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, p = l;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, y = L3[h], $ = C3[h], _ = xl[h], k = ml[h], b = I3[h], v = v3[h];
      for (let A = 0; A < 16; A++) {
        const H = Ci(r + Cf(h, i, a, u) + Bi[_[A]] + y, b[A]) + l | 0;
        r = l, l = u, u = Ci(a, 10) | 0, a = i, i = H;
      }
      for (let A = 0; A < 16; A++) {
        const H = Ci(s + Cf(w, o, c, f) + Bi[k[A]] + $, v[A]) + p | 0;
        s = p, p = f, f = Ci(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + p | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Bi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
_r(() => new B3());
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
let N0 = class extends bl {
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
    for (let l = 0; l < 16; l++, n += 4)
      kn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = kn[l - 15], h = kn[l - 2], w = ze(p, 7) ^ ze(p, 18) ^ p >>> 3, y = ze(h, 17) ^ ze(h, 19) ^ h >>> 10;
      kn[l] = y + kn[l - 7] + w + kn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = ze(a, 6) ^ ze(a, 11) ^ ze(a, 25), h = f + p + k3(a, c, u) + _3[l] + kn[l] | 0, y = (ze(r, 2) ^ ze(r, 13) ^ ze(r, 22)) + M3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    kn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T3 = class extends N0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
_r(() => new N0());
_r(() => new T3());
const ki = BigInt(2 ** 32 - 1), hc = BigInt(32);
function P0(t, e = !1) {
  return e ? { h: Number(t & ki), l: Number(t >> hc & ki) } : { h: Number(t >> hc & ki) | 0, l: Number(t & ki) | 0 };
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
].map((t) => BigInt(t))), Mn = new Uint32Array(80), _n = new Uint32Array(80);
let Oo = class extends bl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: p, Gh: h, Gl: w, Hh: y, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Mn[b] = e.getUint32(n), _n[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Mn[b - 15] | 0, A = _n[b - 15] | 0, H = nt.rotrSH(v, A, 1) ^ nt.rotrSH(v, A, 8) ^ nt.shrSH(v, A, 7), V = nt.rotrSL(v, A, 1) ^ nt.rotrSL(v, A, 8) ^ nt.shrSL(v, A, 7), N = Mn[b - 2] | 0, O = _n[b - 2] | 0, x = nt.rotrSH(N, O, 19) ^ nt.rotrBH(N, O, 61) ^ nt.shrSH(N, O, 6), L = nt.rotrSL(N, O, 19) ^ nt.rotrBL(N, O, 61) ^ nt.shrSL(N, O, 6), T = nt.add4L(V, L, _n[b - 7], _n[b - 16]), j = nt.add4H(T, H, x, Mn[b - 7], Mn[b - 16]);
      Mn[b] = j | 0, _n[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: p, Fh: h, Fl: w, Gh: y, Gl: $, Hh: _, Hl: k } = this;
    for (let b = 0; b < 80; b++) {
      const v = nt.rotrSH(l, p, 14) ^ nt.rotrSH(l, p, 18) ^ nt.rotrBH(l, p, 41), A = nt.rotrSL(l, p, 14) ^ nt.rotrSL(l, p, 18) ^ nt.rotrBL(l, p, 41), H = l & h ^ ~l & y, V = p & w ^ ~p & $, N = nt.add5L(k, A, V, n4[b], _n[b]), O = nt.add5H(N, _, v, H, e4[b], Mn[b]), x = N | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), T = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      _ = y | 0, k = $ | 0, y = h | 0, $ = w | 0, h = l | 0, w = p | 0, { h: l, l: p } = nt.add(u | 0, f | 0, O | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = nt.add3L(x, T, Z);
      r = nt.add3H(R, O, L, j), s = R | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: p } = nt.add(this.Eh | 0, this.El | 0, l | 0, p | 0), { h, l: w } = nt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: y, l: $ } = nt.add(this.Gh | 0, this.Gl | 0, y | 0, $ | 0), { h: _, l: k } = nt.add(this.Hh | 0, this.Hl | 0, _ | 0, k | 0), this.set(r, s, i, o, a, c, u, f, l, p, h, w, y, $, _, k);
  }
  roundClean() {
    Mn.fill(0), _n.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, r4 = class extends Oo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, s4 = class extends Oo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, i4 = class extends Oo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
_r(() => new Oo());
_r(() => new r4());
_r(() => new s4());
_r(() => new i4());
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
var Vt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Vt || (Vt = {}));
let a4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, O0 = class extends a4 {
  constructor(e) {
    super(e);
  }
};
function Do(t) {
  const e = [];
  return e.push(zs(pl(t.version, 1))), e.push(zs(t.hash160)), dn(e);
}
function c4(t) {
  const e = [];
  return e.push(t.prefix), e.push(Do(t.address)), t.prefix === uc.Contract && e.push(Rs(t.contractName)), dn(e);
}
function Rs(t) {
  const e = [], n = yl(t.content), r = n.byteLength;
  return e.push(zs(pl(r, t.lengthPrefixBytes))), e.push(n), dn(e);
}
function l4(t) {
  const e = [];
  return e.push(Do(t.address)), e.push(Rs(t.contractName)), e.push(Rs(t.assetName)), dn(e);
}
function D0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(c4(t.principal)), (t.conditionType === Qn.Fungible || t.conditionType === Qn.NonFungible) && e.push(l4(t.assetInfo)), t.conditionType === Qn.NonFungible && e.push(Sr(t.assetName)), e.push(t.conditionCode), t.conditionType === Qn.STX || t.conditionType === Qn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new O0("The post-condition amount may not be larger than 8 bytes");
    e.push(a3(t.amount, !1, 8));
  }
  return dn(e);
}
function Qe(t, e) {
  return dn([t, e]);
}
function u4(t) {
  return new Uint8Array([t.type]);
}
function f4(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([t.type]) : Qe(t.type, Sr(t.value));
}
function h4(t) {
  const e = new Uint8Array(4);
  return Po(e, t.buffer.length, 0), Qe(t.type, wl(e, t.buffer));
}
function d4(t) {
  const e = gl(c3(t.value, BigInt(p3)), M0);
  return Qe(t.type, e);
}
function p4(t) {
  const e = gl(t.value, M0);
  return Qe(t.type, e);
}
function g4(t) {
  return Qe(t.type, Do(t.address));
}
function y4(t) {
  return Qe(t.type, wl(Do(t.address), Rs(t.contractName)));
}
function w4(t) {
  return Qe(t.type, Sr(t.value));
}
function b4(t) {
  const e = [], n = new Uint8Array(4);
  Po(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Sr(r);
    e.push(s);
  }
  return Qe(t.type, dn(e));
}
function x4(t) {
  const e = [], n = new Uint8Array(4);
  Po(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = o4(s);
    e.push(Rs(i));
    const o = Sr(t.data[s]);
    e.push(o);
  }
  return Qe(t.type, dn(e));
}
function j0(t, e) {
  const n = [], r = e == "ascii" ? f3(t.data) : yl(t.data), s = new Uint8Array(4);
  return Po(s, r.length, 0), n.push(s), n.push(r), Qe(t.type, dn(n));
}
function m4(t) {
  return j0(t, "ascii");
}
function S4(t) {
  return j0(t, "utf8");
}
function Sr(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return u4(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return f4(t);
    case Vt.Buffer:
      return h4(t);
    case Vt.UInt:
      return p4(t);
    case Vt.Int:
      return d4(t);
    case Vt.PrincipalStandard:
      return g4(t);
    case Vt.PrincipalContract:
      return y4(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return w4(t);
    case Vt.List:
      return b4(t);
    case Vt.Tuple:
      return x4(t);
    case Vt.StringASCII:
      return m4(t);
    case Vt.StringUTF8:
      return S4(t);
    default:
      throw new O0("Unable to serialize. Invalid Clarity Value.");
  }
}
const E4 = (t, e) => t ? yl(t).length > e : !1, A4 = "connect-ui";
let Ri, F0, de = !1, dc = !1;
const hn = (t, e = "") => () => {
}, $4 = (t, e) => () => {
}, I4 = "{visibility:hidden}.hydrated{visibility:inherit}", Bf = {}, v4 = "http://www.w3.org/2000/svg", L4 = "http://www.w3.org/1999/xhtml", C4 = (t) => t != null, Sl = (t) => (t = typeof t, t === "object" || t === "function");
function z0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Q = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Sl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? pc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
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
  const r = Zt.ce(e, n);
  return t.dispatchEvent(r), r;
}, kf = /* @__PURE__ */ new WeakMap(), U4 = (t, e, n) => {
  let r = co.get(t);
  tE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, co.set(t, r);
}, H4 = (t, e, n, r) => {
  var s;
  let i = R0(e);
  const o = co.get(i);
  if (t = t.nodeType === 11 ? t : We, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = kf.get(t), c;
      if (a || kf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = We.createElement("style"), c.innerHTML = o;
          const u = (s = Zt.$nonce$) !== null && s !== void 0 ? s : z0(We);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, N4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = hn("attachStyles", e.$tagName$), i = H4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, R0 = (t, e) => "sc-" + t.$tagName$, Mf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Tf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = _f(n), f = _f(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Tf(jo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Zt.rel(t, e, n, !1), r && Zt.ael(t, e, r, !1);
    else {
      const c = Sl(r);
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
    o = s.$elm$ = We.createTextNode(s.$text$);
  else {
    if (de || (de = s.$tag$ === "svg"), o = s.$elm$ = We.createElementNS(de ? v4 : L4, s.$tag$), de && s.$tag$ === "foreignObject" && (de = !1), G0(null, s, de), C4(Ri) && o["s-si"] !== Ri && o.classList.add(o["s-si"] = Ri), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = El(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? de = !1 : o.tagName === "foreignObject" && (de = !0);
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
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], p;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : Mi(a, f) ? (Cs(a, f), a = e[++s], f = r[++i]) : Mi(c, l) ? (Cs(c, l), c = e[--o], l = r[--u]) : Mi(a, l) ? (Cs(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Mi(c, f) ? (Cs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (p = El(e && e[i], n, i), f = r[++i], p && a.$elm$.parentNode.insertBefore(p, a.$elm$));
  s > o ? V0(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && K0(e, s, o);
}, Mi = (t, e) => t.$tag$ === e.$tag$, Cs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (de = i === "svg" ? !0 : i === "foreignObject" ? !1 : de, G0(t, e, de), r !== null && s !== null ? O4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), V0(n, null, e, s, 0, s.length - 1)) : r !== null && K0(r, 0, r.length - 1), de && i === "svg" && (de = !1)) : t.$text$ !== o && (n.data = o);
}, D4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pc(null, null), s = k4(e) ? e : Q(null, null, e);
  F0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ri = n["s-sc"], Cs(r, s);
}, q0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Al = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return q0(t, t.$ancestorComponent$), nE(() => j4(t, e));
}, j4 = (t, e) => {
  const n = hn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), G4(s, () => F4(t, r, e));
}, F4 = async (t, e, n) => {
  const r = t.$hostElement$, s = hn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && N4(t);
  const o = hn("render", t.$cmpMeta$.$tagName$);
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
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = hn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Y0(n), r(), t.$onReadyResolve$(n), s || W0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Il(() => Al(t, !1)), t.$flags$ &= -517;
}, W0 = (t) => {
  Y0(We.documentElement), Il(() => T4(jo, "appload", { detail: { namespace: A4 } }));
}, G4 = (t, e) => t && t.then ? t.then(e) : e(), Y0 = (t) => t.classList.add("hydrated"), V4 = (t, e) => xs(t).$instanceValues$.get(e), K4 = (t, e, n, r) => {
  const s = xs(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = M4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Al(s, !1));
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
        Zt.jmp(() => {
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
      const a = hn("createInstance", n.$tagName$);
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
      if (!co.has(c)) {
        const u = hn("registerStyles", n.$tagName$);
        U4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Al(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, W4 = (t) => {
  if (!(Zt.$flags$ & 1)) {
    const e = xs(t), n = e.$cmpMeta$, r = hn("connectedCallback", n.$tagName$);
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
  Zt.$flags$ & 1 || xs(t);
}, X4 = (t, e = {}) => {
  var n;
  const r = hn(), s = [], i = e.exclude || [], o = jo.customElements, a = We.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ We.createElement("style"), f = [];
  let l, p = !0;
  Object.assign(Zt, e), Zt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", We.baseURI).href, t.map((h) => {
    h[1].map((w) => {
      const y = {
        $flags$: w[0],
        $tagName$: w[1],
        $members$: w[2],
        $listeners$: w[3]
      };
      y.$members$ = w[2];
      const $ = y.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(k) {
          super(k), k = this, Q4(k, y), y.$flags$ & 1 && k.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), p ? f.push(this) : Zt.jmp(() => W4(this));
        }
        disconnectedCallback() {
          Zt.jmp(() => Y4(this));
        }
        componentOnReady() {
          return xs(this).$onReadyPromise$;
        }
      };
      y.$lazyBundleId$ = h[0], !i.includes($) && !o.get($) && (s.push($), o.define($, X0(
        _,
        y,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + I4, u.setAttribute("data-styles", "");
    const h = (n = Zt.$nonce$) !== null && n !== void 0 ? n : z0(We);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  p = !1, f.length ? f.map((h) => h.connectedCallback()) : Zt.jmp(() => l = setTimeout(W0, 30)), r();
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
}, co = /* @__PURE__ */ new Map(), jo = typeof window < "u" ? window : {}, We = jo.document || { head: {} }, Zt = {
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
  t.push(n), dc || (dc = !0, Zt.$flags$ & 4 ? Il(gc) : Zt.raf(gc));
}, Hf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Gs(n);
    }
  t.length = 0;
}, gc = () => {
  Hf(Uf), Hf(Q0), (dc = Uf.length > 0) && Zt.raf(gc);
}, Il = (t) => Z0().then(t), nE = /* @__PURE__ */ eE(Q0), rE = () => Z0(), sE = (t, e) => typeof window > "u" ? Promise.resolve() : rE().then(() => X4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var iE = Object.defineProperty, oE = Object.defineProperties, aE = Object.getOwnPropertyDescriptors, lo = Object.getOwnPropertySymbols, J0 = Object.prototype.hasOwnProperty, tp = Object.prototype.propertyIsEnumerable, Nf = (t, e, n) => e in t ? iE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, be = (t, e) => {
  for (var n in e || (e = {})) J0.call(e, n) && Nf(t, n, e[n]);
  if (lo) for (var n of lo(e)) tp.call(e, n) && Nf(t, n, e[n]);
  return t;
}, Pe = (t, e) => oE(t, aE(e)), ep = (t, e) => {
  var n = {};
  for (var r in t) J0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && lo) for (var r of lo(t)) e.indexOf(r) < 0 && tp.call(t, r) && (n[r] = t[r]);
  return n;
};
function np() {
  return To(gr()) || window.StacksProvider || window.BlockstackProvider;
}
function Fo(t) {
  return t ? typeof t == "string" ? wr.fromName(t) : "version" in t ? t : "url" in t ? new Ra({ url: t.url }) : t.transactionVersion === xr.Mainnet ? new Ra({ url: t.client.baseUrl }) : new Ga({ url: t.client.baseUrl }) : new Ga();
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
  let e = vl(t).loadUserData().appPrivateKey, n = Yt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function uE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [br.Mainnet]: "mainnet", [br.Testnet]: "testnet" }, a = Fo(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function fE(t) {
  let e = Fo(t.network), n = vl(t.userSession), r = Pe(be({}, t), { network: e, userSession: n });
  return be({ stxAddress: uE(r) }, r);
}
async function hE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(B0) : n = n.map((r) => Y(D0(r)))), new Yt.TokenSigner("ES256k", e).signAsync(Pe(be({}, t), { postConditions: n }));
}
function dE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(B0) : e = e.map((n) => Y(D0(n)))), Yt.createUnsecuredToken(Pe(be({}, t), { postConditions: e }));
}
var pE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = dt(a.replace(/^0x/, "")), u = s3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Pe(be({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Pe(be({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, gE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ep(e, ["amount", "appDetails", "userSession"]);
  if (rp(s)) {
    let { privateKey: a, publicKey: c } = sp(s), u = Pe(be({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), hE(u, a);
  }
  let o = Pe(be({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), dE(o);
};
async function yE(t, e, n) {
  let r = await e(Pe(be(be({}, fE(t)), t), { network: Fo(t.network) }));
  return pE({ token: r, options: t }, n);
}
function wE(t, e = np()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return yE(t, gE, e);
}
function ip(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Pe(be({}, t), { message: uf(e), domain: uf(n) }) : Pe(be({}, t), { message: Y(Sr(e)), domain: Y(Sr(n)) });
}
async function bE(t, e) {
  return new Yt.TokenSigner("ES256k", e).signAsync(ip(t));
}
async function xE(t) {
  let e = t, { userSession: n } = e, r = ep(e, ["userSession"]);
  if (rp(n)) {
    let { privateKey: s, publicKey: i } = sp(n), o = Pe(be({}, r), { publicKey: i });
    return bE(o, s);
  }
  return Yt.createUnsecuredToken(ip(t));
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
    let i = gr(), o = np();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    sE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : $E, c = yx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
    };
    u.callback = (h) => {
      l(), t(n, h);
    }, u.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(u);
    let p = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", p), u.remove());
    };
    document.addEventListener("keydown", p);
  };
}
var _i = IE(wE);
function Kn(t, e, n) {
  return Ll(se(t, e), n);
}
function se(t, e) {
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
function si(t, e = 8) {
  return (typeof t == "bigint" ? t : se(t, !1)).toString(16).padStart(e * 2, "0");
}
function zo(t) {
  return parseInt(t, 16);
}
function Ll(t, e = 16) {
  const n = si(t, e);
  return Bt(n);
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
function Ro(...t) {
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
function jt(t) {
  return Ro(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
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
    recoveryId: zo(e),
    r: n,
    s: r
  };
}
function TE(t) {
  const e = typeof t == "string" ? Bt(t) : t;
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
function Er(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yc || (yc = {}));
const DE = yc.Mainnet, jE = 128, FE = 128, lp = 16, ar = 32, wc = 80, Go = 65, zE = 32, RE = 64, uo = 34;
var W;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(W || (W = {}));
var st;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(st || (st = {}));
var bc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bc || (bc = {}));
var ce;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ce || (ce = {}));
const Gi = ["onChainOnly", "offChainOnly", "any"], Rf = {
  [Gi[0]]: ce.OnChainOnly,
  [Gi[1]]: ce.OffChainOnly,
  [Gi[2]]: ce.Any,
  [ce.OnChainOnly]: ce.OnChainOnly,
  [ce.OffChainOnly]: ce.OffChainOnly,
  [ce.Any]: ce.Any
};
function GE(t) {
  if (t in Rf)
    return Rf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Gi.join(", ")}`);
}
var fo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fo || (fo = {}));
fo.Mainnet;
var ls;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ls || (ls = {}));
var le;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(le || (le = {}));
var Nt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Nt || (Nt = {}));
var $t;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($t || ($t = {}));
var ho;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ho || (ho = {}));
var Mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Mt || (Mt = {}));
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
const sr = {
  number: mc,
  bool: VE,
  bytes: up,
  hash: KE,
  exists: qE,
  output: WE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Sa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Re = (t, e) => t << 32 - e | t >>> e, YE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Tr(t) {
  const e = (r) => t().update(Bl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ZE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class kl extends fp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Sa(this.buffer);
  }
  update(e) {
    sr.exists(this);
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
    sr.exists(this), sr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ZE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Sa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
].map((t) => new Uint8Array(t)), t8 = Ml.map((t, e) => t.map((n) => dp[e][n])), e8 = _l.map((t, e) => t.map((n) => dp[e][n])), n8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), r8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ti = (t, e) => t << e | t >>> 32 - e;
function Kf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ui = new Uint32Array(16);
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
      Ui[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, p = l;
    for (let h = 0; h < 5; h++) {
      const w = 4 - h, y = n8[h], $ = r8[h], _ = Ml[h], k = _l[h], b = t8[h], v = e8[h];
      for (let A = 0; A < 16; A++) {
        const H = Ti(r + Kf(h, i, a, u) + Ui[_[A]] + y, b[A]) + l | 0;
        r = l, l = u, u = Ti(a, 10) | 0, a = i, i = H;
      }
      for (let A = 0; A < 16; A++) {
        const H = Ti(s + Kf(w, o, c, f) + Ui[k[A]] + $, v[A]) + p | 0;
        s = p, p = f, f = Ti(c, 10) | 0, c = o, o = H;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + p | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ui.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const i8 = Tr(() => new s8()), o8 = (t, e, n) => t & e ^ ~t & n, a8 = (t, e, n) => t & e ^ t & n ^ e & n, c8 = new Uint32Array([
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
]), Tn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Un = new Uint32Array(64);
class pp extends kl {
  constructor() {
    super(64, 32, 8, !1), this.A = Tn[0] | 0, this.B = Tn[1] | 0, this.C = Tn[2] | 0, this.D = Tn[3] | 0, this.E = Tn[4] | 0, this.F = Tn[5] | 0, this.G = Tn[6] | 0, this.H = Tn[7] | 0;
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
      Un[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = Un[l - 15], h = Un[l - 2], w = Re(p, 7) ^ Re(p, 18) ^ p >>> 3, y = Re(h, 17) ^ Re(h, 19) ^ h >>> 10;
      Un[l] = y + Un[l - 7] + w + Un[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = Re(a, 6) ^ Re(a, 11) ^ Re(a, 25), h = f + p + o8(a, c, u) + c8[l] + Un[l] | 0, y = (Re(r, 2) ^ Re(r, 13) ^ Re(r, 22)) + a8(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Un.fill(0);
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
const Tl = Tr(() => new pp());
Tr(() => new l8());
const Hi = BigInt(2 ** 32 - 1), Sc = BigInt(32);
function gp(t, e = !1) {
  return e ? { h: Number(t & Hi), l: Number(t >> Sc & Hi) } : { h: Number(t >> Sc & Hi) | 0, l: Number(t & Hi) | 0 };
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
].map((t) => BigInt(t))), Hn = new Uint32Array(80), Nn = new Uint32Array(80);
class Vo extends kl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: p, Gh: h, Gl: w, Hh: y, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, p, h, w, y, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = h | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Hn[b] = e.getUint32(n), Nn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Hn[b - 15] | 0, A = Nn[b - 15] | 0, H = rt.rotrSH(v, A, 1) ^ rt.rotrSH(v, A, 8) ^ rt.shrSH(v, A, 7), V = rt.rotrSL(v, A, 1) ^ rt.rotrSL(v, A, 8) ^ rt.shrSL(v, A, 7), N = Hn[b - 2] | 0, O = Nn[b - 2] | 0, x = rt.rotrSH(N, O, 19) ^ rt.rotrBH(N, O, 61) ^ rt.shrSH(N, O, 6), L = rt.rotrSL(N, O, 19) ^ rt.rotrBL(N, O, 61) ^ rt.shrSL(N, O, 6), T = rt.add4L(V, L, Nn[b - 7], Nn[b - 16]), j = rt.add4H(T, H, x, Hn[b - 7], Hn[b - 16]);
      Hn[b] = j | 0, Nn[b] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: p, Fh: h, Fl: w, Gh: y, Gl: $, Hh: _, Hl: k } = this;
    for (let b = 0; b < 80; b++) {
      const v = rt.rotrSH(l, p, 14) ^ rt.rotrSH(l, p, 18) ^ rt.rotrBH(l, p, 41), A = rt.rotrSL(l, p, 14) ^ rt.rotrSL(l, p, 18) ^ rt.rotrBL(l, p, 41), H = l & h ^ ~l & y, V = p & w ^ ~p & $, N = rt.add5L(k, A, V, _8[b], Nn[b]), O = rt.add5H(N, _, v, H, M8[b], Hn[b]), x = N | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), T = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), j = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      _ = y | 0, k = $ | 0, y = h | 0, $ = w | 0, h = l | 0, w = p | 0, { h: l, l: p } = rt.add(u | 0, f | 0, O | 0, x | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = rt.add3L(x, T, Z);
      r = rt.add3H(R, O, L, j), s = R | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: p } = rt.add(this.Eh | 0, this.El | 0, l | 0, p | 0), { h, l: w } = rt.add(this.Fh | 0, this.Fl | 0, h | 0, w | 0), { h: y, l: $ } = rt.add(this.Gh | 0, this.Gl | 0, y | 0, $ | 0), { h: _, l: k } = rt.add(this.Hh | 0, this.Hl | 0, _ | 0, k | 0), this.set(r, s, i, o, a, c, u, f, l, p, h, w, y, $, _, k);
  }
  roundClean() {
    Hn.fill(0), Nn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class T8 extends Vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class U8 extends Vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class H8 extends Vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Tr(() => new Vo());
Tr(() => new T8());
const N8 = Tr(() => new U8());
Tr(() => new H8());
function yp(t) {
  if (Bt(t).byteLength != Go)
    throw Error("Invalid signature");
  return {
    type: W.MessageSignature,
    data: t
  };
}
function Bs(t, e) {
  return { type: W.Address, version: t, hash160: e };
}
function qr(t) {
  return kr.c32address(t.version, t.hash160);
}
function Ar(t, e, n) {
  const r = e || 1, s = n || jE;
  if (Tp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: W.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ul(t) {
  const e = kr.c32addressDecode(t);
  return {
    type: W.Address,
    version: e[0],
    hash160: e[1]
  };
}
var M;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(M || (M = {}));
function P8(t) {
  if (t.type === M.PrincipalStandard)
    return qr(t.address);
  if (t.type === M.PrincipalContract)
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
  return { type: M.PrincipalStandard, address: e };
}
function D8(t) {
  return { type: M.PrincipalStandard, address: t };
}
function j8(t, e) {
  const n = Ul(t), r = Ar(e);
  return bp(n, r);
}
function bp(t, e) {
  if (ms(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: M.PrincipalContract, address: t, contractName: e };
}
function Ea(t, e = !1) {
  switch (t.type) {
    case M.BoolTrue:
      return !0;
    case M.BoolFalse:
      return !1;
    case M.Int:
    case M.UInt:
      return e ? t.value.toString() : t.value;
    case M.Buffer:
      return `0x${ot(t.buffer)}`;
    case M.OptionalNone:
      return null;
    case M.OptionalSome:
      return cn(t.value);
    case M.ResponseErr:
      return cn(t.value);
    case M.ResponseOk:
      return cn(t.value);
    case M.PrincipalStandard:
    case M.PrincipalContract:
      return P8(t);
    case M.List:
      return t.list.map((r) => cn(r));
    case M.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = cn(t.data[r]);
      }), n;
    case M.StringASCII:
      return t.data;
    case M.StringUTF8:
      return t.data;
  }
}
function cn(t) {
  switch (t.type) {
    case M.ResponseErr:
      return { type: jn(t), value: Ea(t, !0), success: !1 };
    case M.ResponseOk:
      return { type: jn(t), value: Ea(t, !0), success: !0 };
    default:
      return { type: jn(t), value: Ea(t, !0) };
  }
}
function jn(t) {
  switch (t.type) {
    case M.BoolTrue:
    case M.BoolFalse:
      return "bool";
    case M.Int:
      return "int";
    case M.UInt:
      return "uint";
    case M.Buffer:
      return `(buff ${t.buffer.length})`;
    case M.OptionalNone:
      return "(optional none)";
    case M.OptionalSome:
      return `(optional ${jn(t.value)})`;
    case M.ResponseErr:
      return `(response UnknownType ${jn(t.value)})`;
    case M.ResponseOk:
      return `(response ${jn(t.value)} UnknownType)`;
    case M.PrincipalStandard:
    case M.PrincipalContract:
      return "principal";
    case M.List:
      return `(list ${t.list.length} ${t.list.length ? jn(t.list[0]) : "UnknownType"})`;
    case M.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${jn(t.data[e])})`).join(" ")})`;
    case M.StringASCII:
      return `(string-ascii ${ap(t.data).length})`;
    case M.StringUTF8:
      return `(string-utf8 ${ms(t.data).length})`;
  }
}
const xp = () => ({ type: M.BoolTrue }), mp = () => ({ type: M.BoolFalse }), F8 = (t) => t ? xp() : mp(), qf = BigInt("0xffffffffffffffffffffffffffffffff"), z8 = BigInt(0), Wf = BigInt("0x7fffffffffffffffffffffffffffffff"), Yf = BigInt("-170141183460469231731687303715884105728"), R8 = (t) => {
  const e = se(t, !0);
  if (e > Wf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wf}`);
  if (e < Yf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yf}`);
  return { type: M.Int, value: e };
}, po = (t) => {
  const e = se(t, !1);
  if (e < z8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qf}`);
  return { type: M.UInt, value: e };
}, Sp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: M.Buffer, buffer: t };
};
function Ep() {
  return { type: M.OptionalNone };
}
function Ap(t) {
  return { type: M.OptionalSome, value: t };
}
function G8(t) {
  return { type: M.ResponseErr, value: t };
}
function V8(t) {
  return { type: M.ResponseOk, value: t };
}
function K8(t) {
  return { type: M.List, list: t };
}
function Ec(t) {
  for (const e in t)
    if (!HA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: M.Tuple, data: t };
}
const Rr = (t) => ({ type: M.StringASCII, data: t }), q8 = (t) => ({ type: M.StringUTF8, data: t });
class $p extends fp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, sr.hash(e);
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
    return sr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    sr.exists(this), sr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
Pt.hmacSha256Sync = (t, ...e) => {
  const n = Ip.create(Tl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function us(t) {
  return {
    type: W.PublicKey,
    data: Bt(t)
  };
}
function W8(t, e, n = Mt.Compressed) {
  const r = _E(e.data), s = new ye(Of(r.r), Of(r.s)), i = it.fromSignature(t, s, r.recoveryId), o = n === Mt.Compressed;
  return i.toHex(o);
}
function Y8(t) {
  return { type: W.PublicKey, data: t };
}
function Ss(t) {
  return !ot(t.data).startsWith("04");
}
function go(t) {
  return t.data.slice();
}
function X8(t) {
  const e = J8(t), n = Js(e.data.slice(0, 32), e.compressed);
  return us(ot(n));
}
function Z8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!0);
  return us(n);
}
function Q8(t) {
  const e = typeof t == "string" ? t : ot(t), n = it.fromHex(e).toHex(!1);
  return us(n);
}
function Ac(t) {
  const e = t.readUInt8(), n = e === 4 ? RE : zE;
  return Y8(jt([e, t.readBytes(n)]));
}
function J8(t) {
  const e = TE(t), n = e.length == cp;
  return { data: e, compressed: n };
}
function tA(t, e) {
  const [n, r] = Ao(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = si(r, 1) + ye.fromHex(n).toCompactHex();
  return yp(i);
}
function eA(t) {
  return X8(t.data);
}
function nA(t, e, n) {
  return typeof t == "string" && (t = wp(t)), typeof n == "string" && (n = Qf(n)), {
    type: W.Payload,
    payloadType: st.TokenTransfer,
    recipient: t,
    amount: se(e, !1),
    memo: n ?? Qf("")
  };
}
function rA(t, e, n, r) {
  return typeof t == "string" && (t = Ul(t)), typeof e == "string" && (e = Ar(e)), typeof n == "string" && (n = Ar(n)), {
    type: W.Payload,
    payloadType: st.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Xf(t, e, n) {
  return typeof t == "string" && (t = Ar(t)), typeof e == "string" && (e = hA(e)), typeof n == "number" ? {
    type: W.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: W.Payload,
    payloadType: st.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function sA() {
  return { type: W.Payload, payloadType: st.PoisonMicroblock };
}
function Zf(t, e) {
  if (t.byteLength != ar)
    throw Error(`Coinbase buffer size must be ${ar} bytes`);
  return e != null ? {
    type: W.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: W.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: t
  };
}
function iA(t, e, n) {
  if (t.byteLength != ar)
    throw Error(`Coinbase buffer size must be ${ar} bytes`);
  if (n.byteLength != wc)
    throw Error(`VRF proof buffer size must be ${wc} bytes`);
  return {
    type: W.Payload,
    payloadType: st.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === M.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var $c;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})($c || ($c = {}));
function oA(t, e, n, r, s, i, o) {
  return {
    type: W.Payload,
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
      e.push(Ot(t.recipient)), e.push(Kn(t.amount, !1, 8)), e.push(on(t.memo));
      break;
    case st.ContractCall:
      e.push(on(t.contractAddress)), e.push(on(t.contractName)), e.push(on(t.functionName));
      const n = new Uint8Array(4);
      Er(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ot(r));
      });
      break;
    case st.SmartContract:
      e.push(on(t.contractName)), e.push(on(t.codeBody));
      break;
    case st.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(on(t.contractName)), e.push(on(t.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ot(t.recipient));
      break;
    case st.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ot(t.recipient ? Ap(t.recipient) : Ep())), e.push(t.vrfProof);
      break;
    case st.TenureChange:
      e.push(Bt(t.tenureHash)), e.push(Bt(t.previousTenureHash)), e.push(Bt(t.burnViewHash)), e.push(Bt(t.previousTenureEnd)), e.push(Er(new Uint8Array(4), t.previousTenureBlocks)), e.push(PE(new Uint8Array(1), t.cause)), e.push(Bt(t.publicKeyHash));
      break;
  }
  return jt(e);
}
function aA(t) {
  switch (t.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = Le(t), r = se(t.readBytes(8), !1), s = Cp(t);
      return nA(n, r, s);
    case st.ContractCall:
      const i = fs(t), o = ve(t), a = ve(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const v = Le(t);
        c.push(v);
      }
      return rA(i, o, a, c);
    case st.SmartContract:
      const f = ve(t), l = ve(t, 4, 1e5);
      return Xf(f, l);
    case st.VersionedSmartContract: {
      const b = t.readUInt8Enum(bc, (H) => {
        throw new Error(`Cannot recognize ClarityVersion: ${H}`);
      }), v = ve(t), A = ve(t, 4, 1e5);
      return Xf(v, A, b);
    }
    case st.PoisonMicroblock:
      return sA();
    case st.Coinbase: {
      const b = t.readBytes(ar);
      return Zf(b);
    }
    case st.CoinbaseToAltRecipient: {
      const b = t.readBytes(ar), v = Le(t);
      return Zf(b, v);
    }
    case st.NakamotoCoinbase: {
      const b = t.readBytes(ar), v = Le(t), A = t.readBytes(wc);
      return iA(b, v, A);
    }
    case st.TenureChange:
      const p = ot(t.readBytes(20)), h = ot(t.readBytes(20)), w = ot(t.readBytes(20)), y = ot(t.readBytes(32)), $ = t.readUInt32BE(), _ = t.readUInt8Enum($c, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), k = ot(t.readBytes(20));
      return oA(p, h, w, y, $, _, k);
  }
}
class Ko extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Jn extends Ko {
  constructor(e) {
    super(e);
  }
}
class ge extends Ko {
  constructor(e) {
    super(e);
  }
}
class yo extends Ko {
  constructor(e) {
    super(e);
  }
}
class ir extends Ko {
  constructor(e) {
    super(e);
  }
}
var Ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ue || (Ue = {}));
function Ic(t) {
  return yp(ot(t.readBytes(Go)));
}
function Wr(t, e) {
  return {
    pubKeyEncoding: t,
    type: W.TransactionAuthField,
    contents: e
  };
}
function cA(t) {
  const e = t.readUInt8Enum(Ue, (n) => {
    throw new ge(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Ue.PublicKeyCompressed:
      return Wr(Mt.Compressed, Ac(t));
    case Ue.PublicKeyUncompressed:
      return Wr(Mt.Uncompressed, Q8(Ac(t).data));
    case Ue.SignatureCompressed:
      return Wr(Mt.Compressed, Ic(t));
    case Ue.SignatureUncompressed:
      return Wr(Mt.Uncompressed, Ic(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Hl(t) {
  return Bt(t.data);
}
function lA(t) {
  const e = [];
  switch (t.contents.type) {
    case W.PublicKey:
      e.push(t.pubKeyEncoding === Mt.Compressed ? Ue.PublicKeyCompressed : Ue.PublicKeyUncompressed), e.push(go(Z8(t.contents.data)));
      break;
    case W.MessageSignature:
      e.push(t.pubKeyEncoding === Mt.Compressed ? Ue.SignatureCompressed : Ue.SignatureUncompressed), e.push(Hl(t.contents));
      break;
  }
  return jt(e);
}
function on(t) {
  switch (t.type) {
    case W.Address:
      return ii(t);
    case W.Principal:
      return Lp(t);
    case W.LengthPrefixedString:
      return hs(t);
    case W.MemoString:
      return dA(t);
    case W.AssetInfo:
      return Bp(t);
    case W.PostCondition:
      return pA(t);
    case W.PublicKey:
      return go(t);
    case W.LengthPrefixedList:
      return Ol(t);
    case W.Payload:
      return vp(t);
    case W.TransactionAuthField:
      return lA(t);
    case W.MessageSignature:
      return Hl(t);
  }
}
function uA() {
  return {
    type: W.Address,
    version: ho.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Nl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === $t.SerializeP2WPKH || e === $t.SerializeP2WSH || e === $t.SerializeP2WSHNonSequential) && !r.every(Ss))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case $t.SerializeP2PKH:
      return Bs(t, MA(r[0].data));
    case $t.SerializeP2WPKH:
      return Bs(t, _A(r[0].data));
    case $t.SerializeP2SH:
    case $t.SerializeP2SHNonSequential:
      return Bs(t, TA(n, r.map(go)));
    case $t.SerializeP2WSH:
    case $t.SerializeP2WSHNonSequential:
      return Bs(t, UA(n, r.map(go)));
  }
}
function ii(t) {
  const e = [];
  return e.push(Bt(si(t.version, 1))), e.push(Bt(t.hash160)), jt(e);
}
function fs(t) {
  const e = zo(ot(t.readBytes(1))), n = ot(t.readBytes(20));
  return { type: W.Address, version: e, hash160: n };
}
function Lp(t) {
  const e = [];
  return e.push(t.prefix), e.push(ii(t.address)), t.prefix === Ks.Contract && e.push(hs(t.contractName)), jt(e);
}
function fA(t) {
  const e = t.readUInt8Enum(Ks, (s) => {
    throw new ge(`Unexpected Principal payload type: ${s}`);
  }), n = fs(t);
  if (e === Ks.Standard)
    return { type: W.Principal, prefix: e, address: n };
  const r = ve(t);
  return {
    type: W.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function hs(t) {
  const e = [], n = ms(t.content), r = n.byteLength;
  return e.push(Bt(si(r, t.lengthPrefixBytes))), e.push(n), jt(e);
}
function ve(t, e, n) {
  e = e || 1;
  const r = zo(ot(t.readBytes(e))), s = Cl(t.readBytes(r));
  return Ar(s, e, n ?? 128);
}
function hA(t) {
  return Ar(t, 4, 1e5);
}
function Qf(t) {
  if (t && Tp(t, uo))
    throw new Error(`Memo exceeds maximum length of ${uo} bytes`);
  return { type: W.MemoString, content: t };
}
function dA(t) {
  const e = [], n = ms(t.content), r = kA(ot(n), uo * 2);
  return e.push(Bt(r)), jt(e);
}
function Cp(t) {
  let e = Cl(t.readBytes(uo));
  return e = e.replace(/\u0000*$/, ""), { type: W.MemoString, content: e };
}
function Bp(t) {
  const e = [];
  return e.push(ii(t.address)), e.push(hs(t.contractName)), e.push(hs(t.assetName)), jt(e);
}
function vc(t) {
  return {
    type: W.AssetInfo,
    address: fs(t),
    contractName: ve(t),
    assetName: ve(t)
  };
}
function Pl(t, e) {
  return {
    type: W.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ol(t) {
  const e = t.values, n = [];
  n.push(Bt(si(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(on(r));
  return jt(n);
}
function kp(t, e, n) {
  const r = zo(ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case W.Address:
        s.push(fs(t));
        break;
      case W.LengthPrefixedString:
        s.push(ve(t));
        break;
      case W.MemoString:
        s.push(Cp(t));
        break;
      case W.AssetInfo:
        s.push(vc(t));
        break;
      case W.PostCondition:
        s.push(gA(t));
        break;
      case W.PublicKey:
        s.push(Ac(t));
        break;
      case W.TransactionAuthField:
        s.push(cA(t));
        break;
    }
  return Pl(s, n);
}
function pA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Lp(t.principal)), (t.conditionType === le.Fungible || t.conditionType === le.NonFungible) && e.push(Bp(t.assetInfo)), t.conditionType === le.NonFungible && e.push(Ot(t.assetName)), e.push(t.conditionCode), t.conditionType === le.STX || t.conditionType === le.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Jn("The post-condition amount may not be larger than 8 bytes");
    e.push(Kn(t.amount, !1, 8));
  }
  return jt(e);
}
function gA(t) {
  const e = t.readUInt8Enum(le, (o) => {
    throw new ge(`Could not read ${o} as PostConditionType`);
  }), n = fA(t);
  let r, s, i;
  switch (e) {
    case le.STX:
      return r = t.readUInt8Enum(Vs, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: W.PostCondition,
        conditionType: le.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case le.Fungible:
      return s = vc(t), r = t.readUInt8Enum(Vs, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ot(t.readBytes(8))}`), {
        type: W.PostCondition,
        conditionType: le.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case le.NonFungible:
      s = vc(t);
      const o = Le(t);
      return r = t.readUInt8Enum(xc, (a) => {
        throw new ge(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: W.PostCondition,
        conditionType: le.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Je(t, e) {
  return jt([t, e]);
}
function yA(t) {
  return new Uint8Array([t.type]);
}
function wA(t) {
  return t.type === M.OptionalNone ? new Uint8Array([t.type]) : Je(t.type, Ot(t.value));
}
function bA(t) {
  const e = new Uint8Array(4);
  return Er(e, t.buffer.length, 0), Je(t.type, Ro(e, t.buffer));
}
function xA(t) {
  const e = Ll(vE(t.value, BigInt(FE)), lp);
  return Je(t.type, e);
}
function mA(t) {
  const e = Ll(t.value, lp);
  return Je(t.type, e);
}
function SA(t) {
  return Je(t.type, ii(t.address));
}
function EA(t) {
  return Je(t.type, Ro(ii(t.address), hs(t.contractName)));
}
function AA(t) {
  return Je(t.type, Ot(t.value));
}
function $A(t) {
  const e = [], n = new Uint8Array(4);
  Er(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ot(r);
    e.push(s);
  }
  return Je(t.type, jt(e));
}
function IA(t) {
  const e = [], n = new Uint8Array(4);
  Er(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ar(s);
    e.push(hs(i));
    const o = Ot(t.data[s]);
    e.push(o);
  }
  return Je(t.type, jt(e));
}
function Mp(t, e) {
  const n = [], r = e == "ascii" ? ap(t.data) : ms(t.data), s = new Uint8Array(4);
  return Er(s, r.length, 0), n.push(s), n.push(r), Je(t.type, jt(n));
}
function vA(t) {
  return Mp(t, "ascii");
}
function LA(t) {
  return Mp(t, "utf8");
}
function Ot(t) {
  switch (t.type) {
    case M.BoolTrue:
    case M.BoolFalse:
      return yA(t);
    case M.OptionalNone:
    case M.OptionalSome:
      return wA(t);
    case M.Buffer:
      return bA(t);
    case M.UInt:
      return mA(t);
    case M.Int:
      return xA(t);
    case M.PrincipalStandard:
      return SA(t);
    case M.PrincipalContract:
      return EA(t);
    case M.ResponseOk:
    case M.ResponseErr:
      return AA(t);
    case M.List:
      return $A(t);
    case M.Tuple:
      return IA(t);
    case M.StringASCII:
      return vA(t);
    case M.StringUTF8:
      return LA(t);
    default:
      throw new Jn("Unable to serialize. Invalid Clarity Value.");
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
function Le(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Us(Bt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Us(t) : e = t;
  switch (e.readUInt8Enum(M, (r) => {
    throw new ge(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case M.Int:
      return R8(e.readBytes(16));
    case M.UInt:
      return po(e.readBytes(16));
    case M.Buffer:
      const r = e.readUInt32BE();
      return Sp(e.readBytes(r));
    case M.BoolTrue:
      return xp();
    case M.BoolFalse:
      return mp();
    case M.PrincipalStandard:
      const s = fs(e);
      return D8(s);
    case M.PrincipalContract:
      const i = fs(e), o = ve(e);
      return bp(i, o);
    case M.ResponseOk:
      return V8(Le(e));
    case M.ResponseErr:
      return G8(Le(e));
    case M.OptionalNone:
      return Ep();
    case M.OptionalSome:
      return Ap(Le(e));
    case M.List:
      const a = e.readUInt32BE(), c = [];
      for (let y = 0; y < a; y++)
        c.push(Le(e));
      return K8(c);
    case M.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let y = 0; y < u; y++) {
        const $ = ve(e).content;
        if ($ === void 0)
          throw new ge('"content" is undefined');
        f[$] = Le(e);
      }
      return Ec(f);
    case M.StringASCII:
      const l = e.readUInt32BE(), p = kE(e.readBytes(l));
      return Rr(p);
    case M.StringUTF8:
      const h = e.readUInt32BE(), w = Cl(e.readBytes(h));
      return q8(w);
    default:
      throw new ge("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const BA = (t) => t.length % 2 == 0 ? t : `0${t}`, kA = (t, e) => t.padEnd(e, "0"), Tp = (t, e) => t ? ms(t).length > e : !1;
function Lc(t) {
  return Qd(t);
}
const qs = (t) => i8(Tl(t)), Dl = (t) => ot(N8(t)), MA = (t) => ot(qs(t)), _A = (t) => {
  const e = qs(t), n = Ro(new Uint8Array([0]), new Uint8Array([e.length]), e), r = qs(n);
  return ot(r);
}, TA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = jt(n), s = qs(r);
  return ot(s);
}, UA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = jt(n), s = Tl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = jt(i), a = qs(o);
  return ot(a);
};
function HA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Up(t) {
  const e = Ot(t);
  return `0x${ot(e)}`;
}
function NA(t) {
  return Le(t);
}
const Hs = (t) => {
  try {
    return kr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function jl() {
  return {
    type: W.MessageSignature,
    data: ot(new Uint8Array(Go))
  };
}
function Hp(t, e, n, r) {
  const s = Nl(0, t, 1, [us(e)]).hash160, i = Ss(us(e)) ? Mt.Compressed : Mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: se(n, !1),
    fee: se(r, !1),
    keyEncoding: i,
    signature: jl()
  };
}
function Ws(t) {
  return "signature" in t;
}
function th(t) {
  return t === $t.SerializeP2SH || t === $t.SerializeP2WSH;
}
function PA(t) {
  return t === $t.SerializeP2SHNonSequential || t === $t.SerializeP2WSHNonSequential;
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
    Bt(t.signer),
    Kn(t.nonce, !1, 8),
    Kn(t.fee, !1, 8),
    t.keyEncoding,
    Hl(t.signature)
  ];
  return jt(e);
}
function DA(t) {
  const e = [
    t.hashMode,
    Bt(t.signer),
    Kn(t.nonce, !1, 8),
    Kn(t.fee, !1, 8)
  ], n = Pl(t.fields);
  e.push(Ol(n));
  const r = new Uint8Array(2);
  return HE(r, t.signaturesRequired, 0), e.push(r), jt(e);
}
function jA(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt(`0x${ot(e.readBytes(8))}`), s = BigInt(`0x${ot(e.readBytes(8))}`), i = e.readUInt8Enum(Mt, (a) => {
    throw new ge(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === $t.SerializeP2WPKH && i != Mt.Compressed)
    throw new ge("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = ot(e.readBytes(20)), r = BigInt("0x" + ot(e.readBytes(8))), s = BigInt("0x" + ot(e.readBytes(8))), i = kp(e, W.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case W.PublicKey:
        Ss(u.contents) || (o = !0);
        break;
      case W.MessageSignature:
        if (u.pubKeyEncoding === Mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ir("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === $t.SerializeP2WSH || t === $t.SerializeP2WSHNonSequential))
    throw new ir("Uncompressed keys are not allowed in this hash mode");
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
  const e = t.readUInt8Enum($t, (n) => {
    throw new ge(`Could not parse ${n} as AddressHashMode`);
  });
  return e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH ? jA(e, t) : FA(e, t);
}
function Np(t, e, n, r) {
  const i = t + ot(new Uint8Array([e])) + ot(Kn(n, !1, 8)) + ot(Kn(r, !1, 8));
  if (Bt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Dl(Bt(i));
}
function Pp(t, e, n) {
  const r = 33 + Go, s = Ss(e) ? Mt.Compressed : Mt.Uncompressed, i = t + BA(s.toString(16)) + n.data, o = Bt(i);
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
  const t = Hp($t.SerializeP2PKH, "", 0, 0);
  return t.signer = uA().hash160, t.keyEncoding = Mt.Compressed, t.signature = jl(), t;
}
function nh(t, e, n) {
  return Ws(t) ? GA(t, e, n) : VA(t, e, n);
}
function GA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Op(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Nl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ir(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function VA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case W.PublicKey:
        Ss(c.contents) || (i = !0), r.push(c.contents);
        break;
      case W.MessageSignature:
        c.pubKeyEncoding === Mt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Op(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (th(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new ir("Too many signatures");
        break;
    }
  if (th(t.hashMode) && o !== t.signaturesRequired || PA(t.hashMode) && o < t.signaturesRequired)
    throw new ir("Incorrect number of signatures");
  if (i && (t.hashMode === $t.SerializeP2WSH || t.hashMode === $t.SerializeP2WSHNonSequential))
    throw new ir("Uncompressed keys are not allowed in this hash mode");
  const a = Nl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ir(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Dp(t) {
  return {
    authType: Nt.Standard,
    spendingCondition: t
  };
}
function jp(t, e) {
  return {
    authType: Nt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Hp($t.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function rh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Nt.Standard:
        return Dp(eh(t.spendingCondition));
      case Nt.Sponsored:
        return jp(eh(t.spendingCondition), RA());
      default:
        throw new yo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function KA(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      return nh(t.spendingCondition, e, Nt.Standard);
    case Nt.Sponsored:
      return nh(t.spendingCondition, e, Nt.Standard);
    default:
      throw new yo("Invalid origin auth type");
  }
}
function qA(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: se(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Nt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: se(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function WA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: se(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function YA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: se(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function XA(t, e) {
  const n = {
    ...e,
    nonce: se(e.nonce, !1),
    fee: se(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function ZA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Nt.Standard:
      e.push(Aa(t.spendingCondition));
      break;
    case Nt.Sponsored:
      e.push(Aa(t.spendingCondition)), e.push(Aa(t.sponsorSpendingCondition));
      break;
  }
  return jt(e);
}
function QA(t) {
  const e = t.readUInt8Enum(Nt, (r) => {
    throw new ge(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Nt.Standard:
      return n = $a(t), Dp(n);
    case Nt.Sponsored:
      n = $a(t);
      const r = $a(t);
      return jp(n, r);
  }
}
class JA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: se(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? DE, this.postConditionMode = i ?? ls.Deny, this.postConditions = s ?? Pl([]), o)
      this.anchorMode = GE(o);
    else
      switch (r.payloadType) {
        case st.Coinbase:
        case st.CoinbaseToAltRecipient:
        case st.NakamotoCoinbase:
        case st.PoisonMicroblock:
        case st.TenureChange:
          this.anchorMode = ce.OnChainOnly;
          break;
        case st.ContractCall:
        case st.SmartContract:
        case st.VersionedSmartContract:
        case st.TokenTransfer:
          this.anchorMode = ce.Any;
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
    return this.signAndAppend(this.auth.spendingCondition, e, Nt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Nt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Nt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ws(n)) {
      const r = Ss(e);
      n.fields.push(Wr(r ? Mt.Compressed : Mt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = zA(n, r, e.fee, e.nonce, s);
    return Ws(e) ? e.signature = i : e.fields.push(Wr(s.data.byteLength === cp ? Mt.Compressed : Mt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Dl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Nt.Sponsored)
      throw new yo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = XA(this.auth, e);
  }
  setFee(e) {
    this.auth = qA(this.auth, e);
  }
  setNonce(e) {
    this.auth = WA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Nt.Sponsored)
      throw new yo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = YA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Jn('"version" is undefined');
    if (this.chainId === void 0)
      throw new Jn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Jn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Jn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Jn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Er(n, this.chainId, 0), e.push(n), e.push(ZA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ol(this.postConditions)), e.push(vp(this.payload)), jt(e);
  }
}
function Fl(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Us(Bt(t.slice(2))) : e = new Us(Bt(t)) : t instanceof Uint8Array ? e = new Us(t) : e = t;
  const n = e.readUInt8Enum(fo, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = QA(e), i = e.readUInt8Enum(ce, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ls, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = kp(e, W.PostCondition), c = aA(e);
  return new JA(n, s, c, a, o, i, r);
}
const t6 = F8, Ns = po, e6 = Sp;
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
], qo = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ur = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, un = (t, e) => {
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
}, zp = (t) => t ? Fp(Ur()).some(
  (e) => {
    var n;
    return e.id === t && (qo(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Rp = () => {
  if (typeof window > "u")
    return;
  const t = Ur(), e = Fp(t).filter(
    (n) => {
      var r;
      return qo(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = un(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of r6) {
    const r = un(t, n) ?? (t === window ? void 0 : un(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, o6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ur(), n = un(e, t) ?? (e === window ? void 0 : un(window, t)) ?? To(t);
  if (n)
    return n;
  if (qo(t) || zp(t))
    return Rp();
}, Ni = (t, e) => {
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
const Gp = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, pe = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, l6 = (t) => {
  const e = pe(t);
  if (!e)
    return null;
  const n = Gp(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, u6 = (t) => {
  const e = pe(t);
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
}, cr = (t) => {
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
}, $r = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = pe(n == null ? void 0 : n.message) ?? pe(e.message) ?? pe(e.error) ?? pe(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ds = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw $r(e);
    if (e.status === "error")
      throw $r(e.result ?? e);
  }
  return t;
}, oh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ds(r);
  } catch (r) {
    throw $r(r);
  }
}, Kp = () => Rp(), zl = () => {
  if (typeof window > "u")
    return;
  const t = Ur();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = un(t, e) ?? (t === window ? void 0 : un(window, e));
    if (n)
      return n;
  }
}, ah = () => {
  if (typeof window > "u")
    return;
  const t = zl();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ur();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = un(e, n) ?? (e === window ? void 0 : un(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Vi = (t) => {
  var r, s;
  const e = gr();
  if (qo(e) || zp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ur() ?? window;
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
}, wo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Ia(t), r = l6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? pe(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = wo(a, e + 1);
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
  for (const a of sh) {
    const c = Ia(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: pe(s[a]) ?? void 0
      };
  }
  for (const a of s6) {
    const c = s[a], u = wo(c, e + 1);
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
}, va = (t) => {
  const e = wo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, f6 = (t) => {
  const e = wo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, h6 = (t) => ({
  ...t,
  fee: cr(t.fee),
  nonce: cr(t.nonce),
  sponsored: t.sponsored === !0
}), ch = (t) => ({
  recipient: t.recipient,
  amount: cr(t.amount) ?? "0",
  memo: t.memo,
  network: Cc(t.network),
  address: t.stxAddress,
  fee: cr(t.fee),
  nonce: cr(t.nonce),
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
    const i = $r(s);
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
      throw $r(a);
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
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: qp }
      );
    return c;
  }, s = g6();
  if (s)
    return Ni(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ni(n, "account-read");
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
      throw $r(c);
    Ni(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Bc(i), r(i, "wallet_getAccount");
  let o;
  Ni(n, "account-reconnect");
  try {
    o = ds(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), $r(c);
  }
  const a = Ys(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Bc(a), r(a, "wallet_connect");
}, S6 = async (t, e) => {
  if (!Vi(t)) {
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
      amount: cr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: cr(e.fee) } : {}
    },
    e.stxAddress
  );
  return va(s);
}, E6 = () => gr(), Wp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = gr(), e = t ? o6(t) : void 0;
  if (e)
    return e;
  const n = Ur() ?? window;
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
    return _i(r, e);
  if (Vi(n) && !zl()) {
    const s = ah();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: gr(),
        route: "legacy-transaction-request"
      }), _i(r, s);
  }
  return void S6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (ih(s) && Vi(n)) {
      const a = ah();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: gr(),
          route: "legacy-transaction-request"
        }), _i(r, a);
        return;
      }
    }
    if (ih(s) && !Vi(n)) {
      _i(r, n);
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
    network: Fo(e.network),
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
const ph = 1000000n, Os = 1000000n, kc = 50n, bo = 3000n, Rl = 300n, B6 = 3000n, k6 = 50000n, gh = 200n, Xs = (t) => t + kc;
function Pn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ph}.${(n % ph).toString().padStart(6, "0")}`;
}
function M6(t, e = Rl) {
  return t <= bo ? 0 : Number((t - bo) / Xs(e));
}
function yh(t, e = 0n) {
  const n = Os - t - e;
  return n > 0n ? n : 0n;
}
function _6(t, e = Rl) {
  return t > Os ? "over" : t < bo + Xs(e) ? "empty" : t < k6 ? "low" : "ok";
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
const Yp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", La = 3, P6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Mc, Xp] = Yp.split("."), Ae = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function _c(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function O6(t) {
  return Ae(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ps(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Zp(t, e = []) {
  const n = await ps(`/v2/contracts/call-read/${Mc}/${Xp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Mc, arguments: e.map((r) => "0x" + Ae(Ot(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return cn(Le(n.result));
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
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || qr(Bs(ho.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || qr(r.contractAddress) + "." + r.contractName.content !== Yp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ae(Ot(r.functionArgs[0])) !== Ae(Ot(Ns(t.core))) || Ae(Ot(r.functionArgs[1])) !== Ae(Ot(Ns(t.song))) || Ae(Ot(r.functionArgs[2])) !== Ae(Ot(e6(_c(t.id)))) || t.amount !== "50" || e.postConditionMode !== ls.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Vs.Equal || i.principal.prefix !== 2 || qr(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || qr(r.contractAddress) + "." + r.contractName.content !== P6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ae(Ot(r.functionArgs[0])) !== Ae(Ot(Ns(t.song))) || typeof t.liked != "boolean" || Ae(Ot(r.functionArgs[1])) !== Ae(Ot(t6(t.liked))) || t.amount !== "0" || e.postConditionMode !== ls.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || cn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const K6 = "xtrata.xyz/radio/listening-wallet", q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", W6 = (t) => ({
  domain: Ec({ name: Rr(K6), version: Rr("1"), "chain-id": po(1) }),
  message: Ec({
    purpose: Rr(q6),
    main: Rr(t.main),
    listening: Rr(t.listening),
    issued: po(t.issued)
  })
}), wh = ["prepared", "signed", "unknown", "pending"], Y6 = 30 * 6e4, Fr = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, X6 = 3e3, bh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Z6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, f = !1, l = !1, p = null, h = !1, w = "", y = "", $, _ = null, k, b = [], v, A = -1 / 0;
  const H = /* @__PURE__ */ new Set();
  let V = !1, N = !1, O = !1, x = !1, L = 0, T = null, j = Promise.resolve();
  const Z = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Rl.toString()), R = (S) => !!i && !(i.features ?? []).includes(S), Gt = (S, z) => `xtrata.ppp.v1.${S}:${z}`, _t = (S = i == null ? void 0 : i.address) => {
    if (!S) return [];
    try {
      const z = JSON.parse(t.store.get(Gt("entries", S)) || "[]");
      return Array.isArray(z) ? z : [];
    } catch {
      return [];
    }
  }, Et = (S) => {
    const z = [S, ..._t(S.address).filter((K) => !(K.txid === S.txid && K.kind === S.kind))].slice(0, 200);
    t.store.set(Gt("entries", S.address), JSON.stringify(z));
  }, m = (S = i == null ? void 0 : i.address) => !!S && t.store.get(Gt("on", S)) !== "0", B = (S) => {
    i != null && i.address && t.store.set(Gt("on", i.address), S ? "1" : "0");
  }, lt = () => _t().filter((S) => wh.includes(S.status)), at = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(Gt("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, ft = (S) => {
    i != null && i.address && t.store.set(Gt("deposit", i.address), JSON.stringify(S));
  }, Tt = () => lt().filter((S) => t.now() - S.created > Y6 && H.has(S.txid));
  function Kt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const S = t.main();
    return S ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== S ? "link" : o === void 0 ? "loading" : o > Os ? "over" : o < bo + Xs(Z()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const g = () => {
    var S, z;
    return {
      step: Kt(),
      busy: c,
      message: w,
      error: y,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : _6(o, Z()),
      playsLeft: o === void 0 ? 0 : M6(o, Z()),
      allowance: o === void 0 ? Os : yh(o, BigInt(((S = at()) == null ? void 0 : S.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: m(),
      entries: _t(),
      depositTxid: ((z = at()) == null ? void 0 : z.txid) ?? $,
      depositPending: !!at(),
      walletOutdated: R("like"),
      linkedListening: v && v === t.main() ? b.map((K) => K.listening) : [],
      serverLinked: !!_ && k === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Tt().length,
      armed: O
    };
  }, I = (S, z = "") => {
    w = S, y = z, t.changed();
  };
  async function U(S, z) {
    if (!c) {
      c = S, y = "", t.changed();
      try {
        await z();
      } catch (K) {
        const F = K instanceof Error ? K.message : String(K);
        y = /Cancelled in the listening wallet/.test(F) ? "" : F, y || (w = "Not now. Nothing was signed.", x = !0);
      } finally {
        c = null, await Ut(!0);
      }
    }
  }
  async function X() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function ht(S = !1) {
    i != null && i.address && (!S && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function vt(S) {
    if ((v !== S || t.now() - A >= 6e4) && (b = await t.links(S), v = S, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === S) return;
    const z = `${S}:${i.address}`;
    k === z && _ || (_ = b.find((K) => K.listening === i.address) ?? null, k = z);
  }
  async function xe() {
    const S = i == null ? void 0 : i.address;
    if (!S) return;
    let z;
    for (const F of lt())
      try {
        const wt = await t.chain.transaction(F.txid);
        if (!wt) {
          if (H.add(F.txid), t.now() - F.created > 15 * 6e4 && (z ?? (z = await t.chain.confirmedNonce(S))), z !== void 0 && z > BigInt(F.nonce)) {
            Et({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), Et({ ...F, status: "pending" });
            } catch (xt) {
              Fr(xt) && Et({ ...F, status: "failed", note: xt.message, raw: void 0 });
            }
          continue;
        }
        H.delete(F.txid);
        const bt = String(wt.tx_status);
        bt === "success" && wt.canonical !== !1 && wt.is_unanchored === !1 ? (Et({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(wt.fee_rate ?? F.fee), raw: void 0 }), F.kind === "like" && (h = !0)) : bt.startsWith("abort_") || bt.startsWith("dropped_") ? Et({ ...F, status: "failed", note: bt, raw: void 0 }) : F.status !== "pending" && Et({ ...F, status: "pending" });
      } catch {
      }
    const K = at();
    if (K)
      try {
        const F = await t.chain.transaction(K.txid), wt = String((F == null ? void 0 : F.tx_status) ?? "");
        (wt === "success" && F.is_unanchored === !1 || wt.startsWith("abort_") || wt.startsWith("dropped_") || !F && t.now() - K.at > 2 * 36e5) && (ft(null), a = -1 / 0);
      } catch {
      }
  }
  async function Ut(S = !1) {
    var z;
    try {
      const K = t.main();
      if ((S || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !K || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), O && Be(), t.changed();
        return;
      }
      await X(), i = await s.request("listening.status"), await vt(K), await ht(S), await xe();
    } catch (K) {
      y = K instanceof Error ? K.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Kt() === "locked" ? Wn() : O && Be(), h) {
      h = !1;
      try {
        (z = t.likesChanged) == null || z.call(t);
      } catch {
      }
    }
    t.changed();
  }
  async function Ce(S, z) {
    const K = !(i != null && i.address) || m(i.address);
    await S.request("listening.unlock", { mode: "unlock", terms: K ? Oe() : void 0, anyPasskey: z }), i = await S.request("listening.status"), K && (m(i.address) ? await ie() : await S.request("listening.stop")), I(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const F = p;
    p = null, F && t.now() - F.at < 12e4 && setTimeout(() => void Ut(!0).then(() => zt(F)), 0);
  }
  function Wn() {
    O || c || x || L >= 3 || !s || !(i != null && i.address) || (O = !0, j = (async () => {
      try {
        await Ce(s, !1), L = 0;
      } catch (S) {
        const z = S instanceof Error ? S.message : String(S);
        /Cancelled in the listening wallet/.test(z) ? T || (x = !0, I("Not now. Nothing was signed.")) : /did not answer/.test(z) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (L++, y = z);
      } finally {
        O = !1;
        const S = T;
        T = null, S ? await S() : await Ut(!0);
      }
    })());
  }
  async function Be(S) {
    O && (T = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await j), S && await S(), t.changed();
  }
  const Oe = () => ({
    fee: Z().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Os.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function ie() {
    if (!(i != null && i.address)) return !1;
    if (N || (N = await t.tabLock(i.address)), !N)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const tn = {
    forceRefresh: () => Ut(!0),
    create: () => U("Waiting for your passkey…", async () => {
      const S = await X();
      await S.request("listening.unlock", { mode: "create", terms: Oe() }), i = await S.request("listening.status"), B(!0), I("Wallet created ✓ Next: link it."), await ie();
    }),
    unlock: (S = !1) => {
      const z = () => U("Waiting for your passkey…", async () => Ce(await X(), S));
      return O ? S ? R("cancel") ? (I("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Be(async () => {
        (Kt() === "locked" || Kt() === "intro") && await z();
      }) : j : z();
    },
    link: () => U("Sign in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const z = (await t.links(S)).find((K) => K.listening === i.address);
      if (z)
        await s.request("listening.link", { main: S, issued: z.issued, mainSignature: z.mainSignature });
      else {
        const K = { main: S, listening: i.address, issued: t.now() }, F = await t.signWithMain(S, W6(K)), wt = await s.request("listening.link", { main: S, issued: K.issued, mainSignature: F });
        await t.saveLink({ ...K, mainSignature: F, listeningSignature: wt.listeningSignature }), A = -1 / 0;
      }
      I("Linked ✓");
    }),
    deposit: () => U("Approve the deposit in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (at()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await ht(!0);
      const z = yh(o ?? 0n);
      if (z <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      $ = await t.deposit(S, i.address, z), $ && ft({ txid: $, amount: z.toString(), at: t.now() }), I("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => U("Confirm in the listening wallet…", async () => {
      await ie(), await s.request("listening.approveSession", Oe()), B(!0), I("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => U("Clearing…", async () => {
      for (const S of Tt())
        await t.chain.transaction(S.txid) || Et({ ...S, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      I("Cleared ✓");
    }),
    switchOff: () => U("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), B(!1), I("Paying is off. Music stays free.");
    }),
    lock: () => U("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, I("Locked ✓");
    }),
    returnFunds: (S) => U("Check the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (lt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: z, nonce: K } = await t.chain.account(i.address);
      o = z;
      const F = await s.request("listening.prepareReturn", { mode: S, balance: z.toString(), nonce: K.toString(), fee: B6.toString() });
      if (F.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const wt = Fl(F.raw);
      if (cn(wt.payload.recipient).value !== i.linked || String(wt.payload.amount) !== F.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const bt = {
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
      t.validate(bt), Et(bt);
      try {
        await t.chain.broadcast(F.raw, F.txid), Et({ ...bt, status: "pending" });
      } catch (xt) {
        throw Et({ ...bt, status: "unknown", note: xt.message }), xt;
      }
      S === "all" && B(!1), I(S === "all" ? "Returned to your wallet ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  };
  async function yt(S) {
    if (!(u || c || f || l)) {
      u = !0;
      try {
        if (await Ut(), Kt() !== "ready" || !m() || !(i != null && i.session) || i.session.playsLeft < 1 || !N || lt().length) return;
        V || (await t.chain.verify(), V = !0);
        const K = i.address, { balance: F, nonce: wt } = await t.chain.account(K);
        o = F, a = t.now();
        const bt = await t.chain.owner(La, S.song);
        if (bt === K || bt === t.main()) return;
        const xt = await s.request("listening.signPlay", {
          core: La,
          song: S.song,
          receipt: S.id,
          fee: Z().toString(),
          nonce: wt.toString(),
          balance: F.toString()
        }), Xt = {
          id: S.id,
          address: K,
          kind: "play",
          core: La,
          song: S.song,
          recipient: bt,
          amount: "50",
          fee: Z().toString(),
          nonce: wt.toString(),
          created: t.now(),
          status: "signed",
          raw: xt.raw,
          txid: xt.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...S.title ? { title: String(S.title).slice(0, 120) } : {},
          ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
        };
        t.validate(Xt), Et(Xt);
        const Se = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`;
        try {
          await t.chain.broadcast(xt.raw, xt.txid), Et({ ...Xt, status: "pending" }), w = `♪ Paid ${Se}`, y = "";
        } catch (qt) {
          Et({ ...Xt, status: Fr(qt) ? "failed" : "unknown", note: qt.message, ...Fr(qt) ? { raw: void 0 } : {} }), y = qt.message;
        }
        i = await s.request("listening.status");
      } catch (z) {
        w = "This song played free: " + (z instanceof Error ? z.message : "payment unavailable");
      } finally {
        u = !1, t.changed();
      }
    }
  }
  function Ft(S) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Kt()) || R("like") ? !1 : (zt(S), !0);
  }
  async function zt(S) {
    const z = S.title ? `“${S.title}”` : `song #${S.song}`, K = (qt) => {
      var G;
      y = qt, w = "";
      try {
        (G = t.likeFailed) == null || G.call(t, S.song);
      } catch {
      }
      t.changed();
    }, F = Kt(), wt = t.main();
    if (F === "locked") {
      p = { ...S, at: t.now() }, I(`Unlock to like ${z}. It sends straight after.`);
      return;
    }
    if (F === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (F === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (F === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (F !== "ready" || !wt) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!N) return K("Pay-per-play is running in another tab. Like from that tab.");
    const bt = _t().find((qt) => qt.kind === "like" && qt.song === S.song);
    if (bt && wh.includes(bt.status))
      return K(`Your last like for ${z} is still on its way. It can change again once it confirms.`);
    if (f) return K("One like at a time: your last one is still being sent.");
    if ((bt == null ? void 0 : bt.status) === "confirmed" && t.now() - (bt.confirmedAt ?? 0) < X6)
      return K(`Your like for ${z} has only just confirmed. Try again in a moment.`);
    let xt;
    l = !0;
    try {
      xt = t.likeState ? (await t.likeState(wt, S.song)).by : S.likedBy ?? [];
    } catch {
      xt = S.likedBy;
    } finally {
      l = !1;
    }
    if (!xt) return K(`Could not check ${z} right now. Try the heart again.`);
    const Xt = i.address, Se = xt.includes(Xt);
    if (!Se && xt.length) return K(`${z} was liked from your main wallet${xt.includes(wt) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await me({ song: S.song, liked: !Se, title: S.title, artist: S.artist });
  }
  async function me(S) {
    var F, wt, bt;
    if (f) {
      I("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const z = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`, K = t.wait ?? ((xt) => new Promise((Xt) => setTimeout(Xt, xt)));
    try {
      I(`${S.liked ? "Liking" : "Unliking"} ${z}…`);
      const xt = t.now() + 12e4;
      for (; u || lt().length; ) {
        if (t.now() > xt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await Ut(!0);
      }
      if (Kt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Xt = i.address, { balance: Se, nonce: qt } = await t.chain.account(Xt);
      o = Se, a = t.now();
      const G = await s.request("listening.signLike", {
        song: S.song,
        liked: S.liked,
        fee: gh.toString(),
        nonce: qt.toString(),
        balance: Se.toString()
      }), mt = {
        id: bh(),
        address: Xt,
        kind: "like",
        core: 0,
        song: S.song,
        liked: S.liked,
        recipient: "",
        amount: "0",
        fee: gh.toString(),
        nonce: qt.toString(),
        created: t.now(),
        status: "signed",
        raw: G.raw,
        txid: G.txid,
        ...S.title ? { title: String(S.title).slice(0, 120) } : {},
        ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
      };
      t.validate(mt), Et(mt);
      try {
        await t.chain.broadcast(G.raw, G.txid), Et({ ...mt, status: "pending" }), w = `${S.liked ? "♥ Liked" : "Unliked"} ${z}`, y = "";
        try {
          (F = t.likeSent) == null || F.call(t, S.song, S.liked);
        } catch {
        }
      } catch (Jt) {
        if (Et({ ...mt, status: Fr(Jt) ? "failed" : "unknown", note: Jt.message, ...Fr(Jt) ? { raw: void 0 } : {} }), y = Jt.message, Fr(Jt)) try {
          (wt = t.likeFailed) == null || wt.call(t, S.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (xt) {
      y = "Like not sent: " + (xt instanceof Error ? xt.message : "the listening wallet is unavailable");
      try {
        (bt = t.likeFailed) == null || bt.call(t, S.song);
      } catch {
      }
    } finally {
      f = !1, t.changed();
    }
  }
  return { snapshot: g, refresh: Ut, onListened: yt, heart: Ft, toggleLike: zt, ...tn };
}
const xo = ["Connect", "Passkey", "Link & fund", "Listen"];
function Q6(t) {
  const e = xo.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
  return !e || e.at >= xo.length || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
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
}, a5 = "xtrata.log.enabled", c5 = "xtrata.log.level", l5 = "xtrata.log.tags", u5 = "xtrata.log.dedupe", Pi = (t) => {
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
  const t = o5 ?? {}, e = Pi(a5) ?? t.VITE_LOG_ENABLED, n = Pi(c5) ?? t.VITE_LOG_LEVEL, r = Pi(l5) ?? t.VITE_LOG_TAGS, s = Pi(u5) ?? t.VITE_LOG_DEDUPE;
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
  var c, u;
  let e;
  try {
    e = cn(NA(t));
  } catch {
    return null;
  }
  const n = zr(e);
  if (!n || n.success === !1)
    return null;
  const r = zr(n.value), s = zr(r == null ? void 0 : r.value), i = zr(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Sh((c = zr(i.name)) == null ? void 0 : c.value), a = Sh((u = zr(i.namespace)) == null ? void 0 : u.value);
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
  var Kt;
  const e = vy(), n = (g) => t.querySelector(g), r = n(".ppp-frame");
  let s = null;
  const i = async (g, I) => {
    const U = await fetch(g, { cache: "no-store", ...I, signal: AbortSignal.timeout(15e3) }), X = await U.json().catch(() => ({}));
    if (!U.ok) throw new Error((X == null ? void 0 : X.error) || `Request failed (${U.status}).`);
    return X;
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
      const I = new Promise((vt, xe) => {
        s.addEventListener("load", () => vt(), { once: !0 }), setTimeout(() => xe(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = g + "/", r.replaceChildren(s), await I;
      const U = new wy({ walletOrigin: g, frame: s, timeoutMs: 30 * 6e4 }), X = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ht = (vt, xe) => X.has(vt) ? U.request(vt, xe) : Promise.race([
        U.request(vt, xe),
        new Promise((Ut, Ce) => setTimeout(() => Ce(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ht("listening.status"), { request: ht };
    },
    chain: {
      verify: D6,
      balance: F6,
      account: j6,
      owner: z6,
      broadcast: R6,
      transaction: G6,
      confirmedNonce: async (g) => {
        const I = await ps(`/v2/accounts/${g}?proof=0`);
        if (!Number.isSafeInteger(I == null ? void 0 : I.nonce) || I.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(I.nonce);
      }
    },
    signWithMain: (g, I) => C6({ ...I, network: "mainnet", stxAddress: g }),
    deposit: (g, I, U) => new Promise((X, ht) => A6({
      recipient: I,
      amount: U.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: g,
      network: new vh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (vt) => X(vt.txId || ""),
      onCancel: () => ht(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ht
    })),
    validate: V6,
    tabLock: (g) => new Promise((I) => {
      const U = navigator.locks;
      if (!(U != null && U.request)) {
        I(!0);
        return;
      }
      U.request("xtrata-ppp:" + g, { ifAvailable: !0 }, async (X) => {
        I(!!X), X && await new Promise(() => {
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
      set: (g, I) => {
        try {
          localStorage.setItem(g, I);
        } catch {
        }
      }
    },
    changed: () => at(o.snapshot()),
    likesChanged: () => {
      var g, I;
      (I = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || I.call(g);
    },
    likeState: async (g, I) => {
      const U = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: g, ids: String(I) })), X = Array.isArray(U == null ? void 0 : U.rows) ? U.rows.find((ht) => (ht == null ? void 0 : ht.id) === I) : null;
      if (!X || typeof X.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: X.liked, by: Array.isArray(X.by) ? X.by.filter((ht) => typeof ht == "string") : X.liked ? [g] : [] };
    },
    likeSent: (g, I) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: g, liked: I } })),
    likeFailed: (g) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: g } }))
  });
  window.XtrataRadioLikeHandler = (g) => {
    if (!g || !Number.isSafeInteger(g.song) || g.song < 0) return !1;
    H();
    const I = V(g.song, { title: g.title, artist: g.artist });
    return o.heart({ song: g.song, title: I.title || void 0, artist: I.artist || void 0, likedBy: Array.isArray(g.likedBy) ? g.likedBy : void 0 });
  };
  const a = (g) => g ? g.slice(0, 6) + "…" + g.slice(-4) : "", c = (g) => (Number(g) / 1e6).toFixed(g < 1000n ? 6 : 4), u = (g) => {
    const I = Math.round((Date.now() - g) / 6e4);
    return I < 1 ? "now" : I < 60 ? `${I}m` : I < 1440 ? `${Math.round(I / 60)}h` : `${Math.round(I / 1440)}d`;
  }, f = (g) => `https://explorer.hiro.so/txid/${g}?chain=mainnet`, l = (g, I = "", U = "") => {
    const X = document.createElement(g);
    return I && (X.textContent = I), U && (X.className = U), X;
  }, p = (g, I, U = "") => {
    const X = l("button", g, U);
    return X.type = "button", X.onclick = I, X;
  }, h = (g, I) => {
    const U = l("a", g);
    return U.href = I, U.target = "_blank", U.rel = "noopener", U;
  };
  let w = null, y = !1;
  const $ = /* @__PURE__ */ new Map(), _ = (g) => g ? ($.has(g) || ($.set(g, null), k5({ address: g, network: "mainnet" }).then((I) => {
    I && ($.set(g, I), at(o.snapshot()));
  }).catch(() => {
  })), $.get(g) ?? null) : null, k = (g) => {
    const I = _(g);
    return I ? `${I} · ${a(g)}` : a(g);
  }, b = /* @__PURE__ */ new Map();
  let v = !1;
  const A = (g) => !g || /^(?:Inscription )?#\d+$/.test(g.trim()), H = () => {
    v || (v = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((g) => g.ok ? g.json() : null).then((g) => {
      for (const I of Array.isArray(g == null ? void 0 : g.tracks) ? g.tracks : []) {
        const U = Number(I == null ? void 0 : I.id);
        Number.isSafeInteger(U) && b.set(U, { title: typeof I.title == "string" ? I.title : void 0, artist: typeof I.artist == "string" ? I.artist : void 0 });
      }
      at(o.snapshot());
    }).catch(() => {
      v = !1;
    }));
  }, V = (g, I) => {
    const U = b.get(g), X = _5(g, [U == null ? void 0 : U.title, I == null ? void 0 : I.title].find((vt) => !A(vt)) || ""), ht = M5(g, (U == null ? void 0 : U.artist) || (I == null ? void 0 : I.artist) || "");
    return { title: X, artist: ht };
  }, N = (g) => {
    const { title: I, artist: U } = V(g.song, g);
    return I ? `“${I}”${U ? ` — ${U}` : ""}` : `Song #${g.song}${U ? ` — ${U}` : ""}`;
  }, O = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, x = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function L(g) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(g.step) ? ["", ""] : g.step === "over" ? ["OVER 1 STX", "bad"] : g.step === "locked" ? ["LOCKED", "mute"] : g.step === "intro" || g.step === "link" ? ["", ""] : g.step === "fund" ? g.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : g.payingOn && g.session && g.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function T(g, I, U = "", X) {
    const ht = l("dt", g), vt = l("dd", I, U);
    return X && vt.append(" ", X), [ht, vt];
  }
  const j = document.getElementById("ppp-top"), Z = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, R = () => {
    var I, U;
    const g = o.snapshot();
    if (g.step === "connect") {
      (I = document.getElementById("radio-wallet-connect")) == null || I.click();
      return;
    }
    if (g.step === "elsewhere" && ((U = g.gate) != null && U.radioUrl)) {
      location.href = g.gate.radioUrl;
      return;
    }
    g.step === "locked" && !g.armed && !g.busy && o.unlock(), g.step === "ready" && !g.payingOn && !g.busy && o.switchOn(), Z();
  };
  j && (j.onclick = R);
  function Gt(g) {
    if (!j) return;
    const I = (X, ht, vt) => {
      j.hidden = !1, j.className = "ppp-top" + (ht ? " is-" + ht : ""), j.replaceChildren(l("span", "", "dot"), document.createTextNode(X)), j.title = vt;
    }, U = g.session ? Math.min(g.session.playsLeft, g.playsLeft) : 0;
    switch (g.step) {
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
        return I(g.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return I("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return I(g.entries.some((X) => X.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return I("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return I("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return g.payingOn && U > 0 ? I(`On · ${U.toLocaleString()} plays left`, "on", "Paying artists as you listen") : I("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const _t = document.getElementById("pppNudge"), Et = document.getElementById("onair");
  (Kt = _t == null ? void 0 : _t.querySelector("button")) == null || Kt.addEventListener("click", () => R());
  const m = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    link: "Not paying artists yet",
    fund: "Out of funds · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, B = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function lt(g) {
    var vt;
    if (g.step === "loading") return;
    const I = g.session ? Math.min(g.session.playsLeft, g.playsLeft) : 0, U = g.step === "ready" && g.payingOn && I > 0, X = U ? "" : m[g.step] ?? "", ht = U ? "on" : X ? "off" : "";
    if (ht ? document.documentElement.dataset.ppp = ht : delete document.documentElement.dataset.ppp, Et && (Et.hidden = !ht, Et.querySelector(".onair-sub").textContent = U ? `Paying artists · ${I.toLocaleString()} plays left` : "Not paying"), _t && (_t.hidden = ht !== "off", ht === "off")) {
      const xe = Math.floor(Number(1000000n / Xs(BigInt(((vt = g.gate) == null ? void 0 : vt.limits.playFee) ?? "300"))));
      _t.querySelector(".nudge-t").textContent = "⚠ " + X, _t.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${xe.toLocaleString()} plays, on-chain, straight to the artists.`, _t.querySelector("button").textContent = B[g.step] ?? "Start paying";
    }
  }
  function at(g) {
    var xt, Xt, Se, qt;
    if (Gt(g), lt(g), t.hidden = g.step === "off", t.hidden) return;
    const [I, U] = L(g), X = n(".ppp-state");
    X.textContent = I, X.className = "ppp-state" + (U ? " ppp-state--" + U : ""), X.hidden = !I;
    const ht = !!g.busy || g.armed, vt = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(g.step) && (ht || !["intro", "loading"].includes(g.step));
    r.hidden = !vt, r.classList.toggle("ppp-frame--rest", !ht && !y);
    const xe = n(".ppp-frame-label");
    xe.hidden = !0;
    const Ut = Q6(g) ?? w;
    w = Ut;
    const Ce = J6(g, Ut);
    n(".ppp-badge").hidden = !Ce;
    const Wn = n(".ppp-steps"), Be = n(".ppp-stage");
    Wn.hidden = Be.hidden = !Ce, Ut && Ce && (Wn.replaceChildren(...xo.map((G, mt) => {
      const Jt = l("li", "", mt < Ut.at ? "done" : mt === Ut.at ? Ut.blocked ? "now blocked" : "now" : "");
      return Jt.append(l("span", mt < Ut.at ? "✓" : String(mt + 1), "n"), G), mt === Ut.at && Jt.setAttribute("aria-current", "step"), Jt;
    })), Be.textContent = Ut.caption, Be.className = "ppp-stage " + (Ut.at >= xo.length ? "ppp-ok" : Ut.blocked ? "ppp-bad" : "ppp-cyan"));
    const Oe = n(".ppp-facts"), ie = [];
    if (g.main && ((xt = g.gate) != null && xt.here) && ie.push(...T("Your wallet", k(g.main), "ppp-addr-short")), g.listening) {
      const G = p("Copy", () => {
        var mt;
        return void ((mt = navigator.clipboard) == null ? void 0 : mt.writeText(g.listening || ""));
      }, "tiny");
      ie.push(...T("Listening wallet", a(g.listening), "ppp-addr-short", G));
    }
    if (g.listening && g.step !== "intro" && ie.push(...g.linked ? T("Linked to", `${k(g.linked)} · returns go here`, g.linked === g.main ? "ppp-ok" : "ppp-warn") : T("Linked to", "not linked yet", "ppp-warn")), g.linkedListening.length && ((Xt = g.gate) != null && Xt.here)) {
      const G = g.linkedListening.map((mt) => a(mt) + (mt === g.listening ? " (this one)" : "")).join(", ");
      ie.push(...T(g.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", G, "ppp-addr-short"));
    }
    if (g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const G = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ie.push(...T("Balance", `${Pn(g.balance)} STX · about ${g.playsLeft.toLocaleString()} plays`, G));
    }
    const tn = g.entries.find((G) => G.kind === "play");
    tn && H(), tn && ie.push(...T("Last paid song", `${N(tn)} → ${a(tn.recipient)}`, O[tn.status] || "")), Oe.replaceChildren(...ie), Oe.hidden = !ie.length;
    const yt = [], Ft = [], zt = [], me = [], S = Xs(BigInt(((Se = g.gate) == null ? void 0 : Se.limits.playFee) ?? "300")), z = `Each song you listen to for 30 seconds sends ${Pn(kc)} STX to whoever holds it, plus a ${Pn(S - kc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, K = !!g.busy;
    switch (g.step) {
      case "elsewhere": {
        if (yt.push(l("p", "Pay artists as you listen.")), (qt = g.gate) != null && qt.radioUrl) {
          const G = l("p");
          G.append(h("Open the pay-per-play radio →", g.gate.radioUrl)), yt.push(G);
        }
        Ft.push(l("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        yt.push(l("p", "Connect your wallet to pay artists as you listen.")), Ft.push(l("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "not-invited":
        yt.push(l("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        yt.push(l("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        yt.push(l("p", `Pay artists ${Pn(S)} STX a song as you listen.`)), Ft.push(l("p", z)), Ft.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Ft.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), zt.push(p("Turn on pay-per-play", () => void o.create(), "primary")), zt.push(p("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        g.armed || (yt.push(l("p", "Locked.", "ppp-mute")), zt.push(p(g.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), me.push(p("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        yt.push(l("p", `Link to ${k(g.main)} · free`)), Ft.push(l("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Ft.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), zt.push(p(g.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        yt.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (g.entries.length ? yt.push(l("p", "Out of funds · top up to keep paying", "ppp-bad")) : yt.push(l("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / S)).toLocaleString()} songs`)), g.entries.length && Ft.push(l("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), g.payingOn && !g.entries.length && Ft.push(l("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), Ft.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), g.depositPending && g.depositTxid) {
          const G = l("p", "Deposit on its way… ", "ppp-warn");
          G.append(h("View", f(g.depositTxid))), yt.push(G);
        } else g.allowance > 0n && zt.push(p(`Deposit ${Pn(g.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        yt.push(l("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), zt.push(p("Return excess", () => void o.returnFunds("excess"), "primary"), p("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (g.payingOn && g.session && g.session.playsLeft > 0) {
          const G = Math.min(g.session.playsLeft, g.playsLeft);
          yt.push(l("p", `Paying as you listen · up to ${G.toLocaleString()} plays left`, "ppp-ok")), Ft.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), zt.push(p("Switch off", () => void o.switchOff()));
        } else
          yt.push(l("p", "Paying is off. Music stays free.", "ppp-mute")), zt.push(p("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        g.balanceState === "low" && yt.push(l("p", "Running low · top up", "ppp-warn")), g.depositPending ? yt.push(l("p", "Top-up on its way…", "ppp-warn")) : g.allowance > 0n && g.balanceState !== "ok" && zt.push(p(`Top up ${Pn(g.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (g.walletOutdated && Ft.push(l("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), g.stuck && (yt.push(l("p", g.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${g.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), zt.push(p("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(g.step) && g.linked && (g.balance ?? 0n) > 0n && me.push(p("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(g.step) && me.push(p("Lock", () => void o.lock(), "quiet")), vt && !ht && me.push(p(y ? "Hide listening wallet box" : "Show listening wallet box", () => {
      y = !y, at(o.snapshot());
    }, "quiet")), [...zt, ...me].forEach((G) => G.disabled = K), K && (zt.length = 0), g.balance !== void 0 && ["fund", "ready", "over"].includes(g.step)) {
      const G = g.balanceState === "ok" ? "ppp-ok" : g.balanceState === "low" ? "ppp-warn" : "ppp-bad", mt = yt.at(0);
      g.step === "ready" && mt ? mt.append(l("span", ` · ${c(g.balance)} STX`, G)) : yt.push(l("p", `Balance ${c(g.balance)} STX`, G));
    }
    n(".ppp-key").replaceChildren(...yt), n(".ppp-body").replaceChildren(...Ft), n(".ppp-actions").replaceChildren(...zt), n(".ppp-actions2").replaceChildren(...me);
    const F = g.busy || g.message || "";
    n(".ppp-msg").textContent = F && yt.some((G) => (G.textContent ?? "").startsWith(F.replace(/[.✓\s]+$/, ""))) ? "" : F, n(".ppp-err").textContent = g.error;
    const wt = g.entries.filter((G) => G.kind === "play");
    n(".ppp-recent").hidden = !g.entries.length, n(".ppp-recent-list").replaceChildren(...wt.slice(0, 5).map((G) => {
      const mt = l("li"), Jt = G.status === "confirmed" ? "ok" : G.status === "failed" ? "bad" : "warn";
      return mt.append(l("span", "", "d " + Jt), l("span", N(G), "t"), l("span", u(G.created), "ppp-mute")), G.txid && mt.append(h("tx", f(G.txid))), mt;
    })), n(".ppp-wallets").hidden = !(Oe.childElementCount || me.length), n(".ppp-more").hidden = !Ft.length;
    const bt = n(".ppp-history");
    bt.hidden = !g.entries.length, g.entries.length && H(), bt.replaceChildren(l("summary", `All activity (${g.entries.length})`), ...g.entries.slice(0, 20).map((G) => {
      const mt = l("div", "", "ppp-row"), Jt = G.kind === "play" ? [l("span", N(G), "ppp-song"), l("span", ` · ${Pn(BigInt(G.amount))} STX to ${a(G.recipient)}`, "ppp-mute")] : G.kind === "like" ? [l("span", `${G.liked ? "♥ Liked" : "Unliked"} ${N(G)}`, "ppp-song"), l("span", ` · for ${k(g.linked)}`, "ppp-mute")] : [l("span", `Returned ${Pn(BigInt(G.amount))} STX`, "ppp-song"), l("span", ` to ${a(G.recipient)}`, "ppp-mute")];
      return mt.append(
        l("span", x[G.status] || G.status, "ppp-status " + (O[G.status] || "")),
        ...Jt,
        l("span", ` · ${new Date(G.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), G.txid && mt.append(h("tx ↗", f(G.txid))), mt;
    }));
  }
  const ft = /* @__PURE__ */ new Map(), Tt = () => {
    const g = window.XtrataRadio;
    return g != null && g.subscribe ? (g.subscribe((I) => {
      const U = I == null ? void 0 : I.nowPlaying;
      U && Number.isSafeInteger(Number(U.tokenId)) && ft.set(Number(U.tokenId), { title: U.title || void 0, artist: U.artist || void 0 });
    }), !0) : !1;
  };
  if (!Tt()) {
    const g = setInterval(() => {
      Tt() && clearInterval(g);
    }, 500);
    setTimeout(() => clearInterval(g), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (g) => {
    const I = g.detail;
    if (I && Number.isSafeInteger(I.song) && typeof I.id == "string" && /^[0-9a-f]{32}$/.test(I.id)) {
      H();
      const U = V(I.song, ft.get(I.song));
      o.onListened({ song: I.song, id: I.id, title: U.title || void 0, artist: U.artist || void 0 });
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
    this.persistSelection && wx(t), this.callback(To(t));
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
    var r, s, i, o, a, c, u, f, l, p;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (p = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && p !== void 0 ? p : this.getMobileUrl(t);
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
