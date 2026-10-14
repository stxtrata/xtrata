var Py = Object.defineProperty;
var Hy = (t, e, n) => e in t ? Py(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var wi = (t, e, n) => Hy(t, typeof e != "symbol" ? e + "" : e, n);
var ve = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function kh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function fa(t) {
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
      typeof ve < "u" && ve || {}, r = {
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
      function f(x) {
        var B = {
          next: function() {
            var P = x.shift();
            return { done: P === void 0, value: P };
          }
        };
        return r.iterable && (B[Symbol.iterator] = function() {
          return B;
        }), B;
      }
      function d(x) {
        this.map = {}, x instanceof d ? x.forEach(function(B, P) {
          this.append(P, B);
        }, this) : Array.isArray(x) ? x.forEach(function(B) {
          if (B.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + B.length);
          this.append(B[0], B[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(B) {
          this.append(B, x[B]);
        }, this);
      }
      d.prototype.append = function(x, B) {
        x = a(x), B = c(B);
        var P = this.map[x];
        this.map[x] = P ? P + ", " + B : B;
      }, d.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, d.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, d.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, d.prototype.set = function(x, B) {
        this.map[a(x)] = c(B);
      }, d.prototype.forEach = function(x, B) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && x.call(B, this.map[P], P, this);
      }, d.prototype.keys = function() {
        var x = [];
        return this.forEach(function(B, P) {
          x.push(P);
        }), f(x);
      }, d.prototype.values = function() {
        var x = [];
        return this.forEach(function(B) {
          x.push(B);
        }), f(x);
      }, d.prototype.entries = function() {
        var x = [];
        return this.forEach(function(B, P) {
          x.push([P, B]);
        }), f(x);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function(B, P) {
          x.onload = function() {
            B(x.result);
          }, x.onerror = function() {
            P(x.error);
          };
        });
      }
      function h(x) {
        var B = new FileReader(), P = g(B);
        return B.readAsArrayBuffer(x), P;
      }
      function b(x) {
        var B = new FileReader(), P = g(B), Z = /charset=([A-Za-z0-9_-]+)/.exec(x.type), Q = Z ? Z[1] : "utf-8";
        return B.readAsText(x, Q), P;
      }
      function m(x) {
        for (var B = new Uint8Array(x), P = new Array(B.length), Z = 0; Z < B.length; Z++)
          P[Z] = String.fromCharCode(B[Z]);
        return P.join("");
      }
      function k(x) {
        if (x.slice)
          return x.slice(0);
        var B = new Uint8Array(x.byteLength);
        return B.set(new Uint8Array(x)), B.buffer;
      }
      function S() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && s(x) ? (this._bodyArrayBuffer = k(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = k(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var T = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function w(x) {
        var B = x.toUpperCase();
        return T.indexOf(B) > -1 ? B : x;
      }
      function C(x, B) {
        if (!(this instanceof C))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        B = B || {};
        var P = B.body;
        if (x instanceof C) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, B.headers || (this.headers = new d(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !P && x._bodyInit != null && (P = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = B.credentials || this.credentials || "same-origin", (B.headers || !this.headers) && (this.headers = new d(B.headers)), this.method = w(B.method || this.method || "GET"), this.mode = B.mode || this.mode || null, this.signal = B.signal || this.signal || function() {
          if ("AbortController" in n) {
            var Y = new AbortController();
            return Y.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (B.cache === "no-store" || B.cache === "no-cache")) {
          var Z = /([?&])_=[^&]*/;
          if (Z.test(this.url))
            this.url = this.url.replace(Z, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Q = /\?/;
            this.url += (Q.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      C.prototype.clone = function() {
        return new C(this, { body: this._bodyInit });
      };
      function I(x) {
        var B = new FormData();
        return x.trim().split("&").forEach(function(P) {
          if (P) {
            var Z = P.split("="), Q = Z.shift().replace(/\+/g, " "), Y = Z.join("=").replace(/\+/g, " ");
            B.append(decodeURIComponent(Q), decodeURIComponent(Y));
          }
        }), B;
      }
      function O(x) {
        var B = new d(), P = x.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(Z) {
          return Z.indexOf(`
`) === 0 ? Z.substr(1, Z.length) : Z;
        }).forEach(function(Z) {
          var Q = Z.split(":"), Y = Q.shift().trim();
          if (Y) {
            var Ht = Q.join(":").trim();
            try {
              B.append(Y, Ht);
            } catch (oe) {
              console.warn("Response " + oe.message);
            }
          }
        }), B;
      }
      S.call(C.prototype);
      function X(x, B) {
        if (!(this instanceof X))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (B || (B = {}), this.type = "default", this.status = B.status === void 0 ? 200 : B.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = B.statusText === void 0 ? "" : "" + B.statusText, this.headers = new d(B.headers), this.url = B.url || "", this._initBody(x);
      }
      S.call(X.prototype), X.prototype.clone = function() {
        return new X(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, X.error = function() {
        var x = new X(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var F = [301, 302, 303, 307, 308];
      X.redirect = function(x, B) {
        if (F.indexOf(B) === -1)
          throw new RangeError("Invalid status code");
        return new X(null, { status: B, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(B, P) {
          this.message = B, this.name = P;
          var Z = Error(B);
          this.stack = Z.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function U(x, B) {
        return new Promise(function(P, Z) {
          var Q = new C(x, B);
          if (Q.signal && Q.signal.aborted)
            return Z(new e.DOMException("Aborted", "AbortError"));
          var Y = new XMLHttpRequest();
          function Ht() {
            Y.abort();
          }
          Y.onload = function() {
            var A = {
              statusText: Y.statusText,
              headers: O(Y.getAllResponseHeaders() || "")
            };
            Q.url.indexOf("file://") === 0 && (Y.status < 200 || Y.status > 599) ? A.status = 200 : A.status = Y.status, A.url = "responseURL" in Y ? Y.responseURL : A.headers.get("X-Request-URL");
            var N = "response" in Y ? Y.response : Y.responseText;
            setTimeout(function() {
              P(new X(N, A));
            }, 0);
          }, Y.onerror = function() {
            setTimeout(function() {
              Z(new TypeError("Network request failed"));
            }, 0);
          }, Y.ontimeout = function() {
            setTimeout(function() {
              Z(new TypeError("Network request timed out"));
            }, 0);
          }, Y.onabort = function() {
            setTimeout(function() {
              Z(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function oe(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (Y.open(Q.method, oe(Q.url), !0), Q.credentials === "include" ? Y.withCredentials = !0 : Q.credentials === "omit" && (Y.withCredentials = !1), "responseType" in Y && (r.blob ? Y.responseType = "blob" : r.arrayBuffer && (Y.responseType = "arraybuffer")), B && typeof B.headers == "object" && !(B.headers instanceof d || n.Headers && B.headers instanceof n.Headers)) {
            var ne = [];
            Object.getOwnPropertyNames(B.headers).forEach(function(A) {
              ne.push(a(A)), Y.setRequestHeader(A, c(B.headers[A]));
            }), Q.headers.forEach(function(A, N) {
              ne.indexOf(N) === -1 && Y.setRequestHeader(N, A);
            });
          } else
            Q.headers.forEach(function(A, N) {
              Y.setRequestHeader(N, A);
            });
          Q.signal && (Q.signal.addEventListener("abort", Ht), Y.onreadystatechange = function() {
            Y.readyState === 4 && Q.signal.removeEventListener("abort", Ht);
          }), Y.send(typeof Q._bodyInit > "u" ? null : Q._bodyInit);
        });
      }
      return U.polyfill = !0, n.fetch || (n.fetch = U, n.Headers = d, n.Request = C, n.Response = X), e.Headers = d, e.Request = C, e.Response = X, e.fetch = U, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ve);
})();
const Oy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Dy(t, e) {
  const n = {};
  return Object.assign(n, Oy, e), await fetch(t, n);
}
function Fy(t) {
  let e = Dy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function jy(...t) {
  const { fetchLib: e, middlewares: n } = Fy(t);
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
var Rs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Rs || (Rs = {}));
var Wr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wr || (Wr = {}));
var Ku;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ku || (Ku = {}));
const zy = "https://api.mainnet.hiro.so", Ry = "https://api.testnet.hiro.so", Gy = "http://localhost:3999", Ky = ["mainnet", "testnet", "devnet", "mocknet"];
let Gs = class {
  constructor(e) {
    this.version = Wr.Mainnet, this.chainId = Rs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Wr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? jy();
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
Gs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new mc();
    case "testnet":
      return new Vy();
    case "devnet":
      return new qy();
    case "mocknet":
      return new Lh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ky.join(", ")}`);
  }
};
Gs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Gs.fromName(t);
let mc = class extends Gs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wr.Mainnet, this.chainId = Rs.Mainnet;
  }
}, Vy = class extends Gs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ry,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wr.Testnet, this.chainId = Rs.Testnet;
  }
}, Lh = class extends Gs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Gy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Wr.Testnet, this.chainId = Rs.Testnet;
  }
};
const qy = Lh, Ch = "xtrata.wallet.bridge.v1", Wy = (t) => typeof t == "object" && t !== null && t.protocol === Ch, Xy = (t) => Wy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Yy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class bi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Vu = 12e4;
class Zy {
  constructor(e) {
    wi(this, "pending", /* @__PURE__ */ new Map());
    wi(this, "listenTarget");
    wi(this, "closed", !1);
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
    wi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Xy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new bi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new bi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new bi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Yy(), i = { protocol: Ch, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new bi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Vu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Vu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new bi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Qy = ["SP", "SM"], Jy = ["ST", "SN"], tw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Qy.includes(n) ? "mainnet" : Jy.includes(n) ? "testnet" : null;
}, ew = () => {
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
}, nw = () => typeof window > "u" || !window.localStorage ? ew() : window.localStorage, Va = "xtrata.v15.1.wallet.session", qu = "mainnet", Do = { isConnected: !1 }, rw = (t) => t.address ? tw(t.address) ?? t.network : t.network, Bh = (t) => !t.isConnected || !t.address ? { ...Do } : rw(t) !== qu ? { ...Do } : {
  isConnected: !0,
  address: t.address,
  network: qu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, sw = (t) => {
  if (!t)
    return { ...Do };
  try {
    const e = JSON.parse(t);
    return Bh(e);
  } catch {
    return { ...Do };
  }
}, iw = (t) => {
  const e = Bh(t);
  return JSON.stringify(e);
}, ow = (t) => {
  const e = nw();
  return {
    load: () => sw(e.getItem(Va)),
    save: (n) => {
      e.setItem(Va, iw(n));
    },
    clear: () => {
      e.removeItem(Va);
    }
  };
}, aw = "https://browser.blockstack.org/auth", cw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Th = ["store_write"], lw = "blockstack-session", uw = {
  logLevel: "debug"
}, hs = {
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
Object.freeze(hs);
class ai extends Error {
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
class fw extends ai {
  constructor(e, n = "") {
    super({ code: hs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Wu extends ai {
  constructor(e = "") {
    super({ code: hs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class to extends ai {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: hs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Xu extends ai {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: hs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class xc extends ai {
  constructor(e) {
    super({ code: hs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mh extends ai {
  constructor(e) {
    super({ code: hs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Yu = ["debug", "info", "warn", "error", "none"], Sc = {};
for (let t = 0; t < Yu.length; t++) {
  const e = Yu[t];
  Sc[e] = t;
}
class Us {
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
    return Sc[uw.logLevel] <= Sc[e];
  }
}
function dw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function hw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function qa(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function pw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function gw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function yw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function vl(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = gw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Us.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = yw(s, t.toString(), n);
    throw Us.error(i), new Error(i);
  }
  if (r)
    return {};
}
function $r(t, e) {
  return Il(be(t), e);
}
function be(t) {
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
  if (_e(t, Uint8Array))
    return BigInt(`0x${rt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function ww(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Zu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ji(t, e = 8) {
  return (typeof t == "bigint" ? t : be(t)).toString(16).padStart(e * 2, "0");
}
function da(t) {
  return parseInt(t, 16);
}
function Il(t, e = 16) {
  const n = ji(t, e);
  return Ct(n);
}
function bw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function mw(t, e) {
  return t & BigInt(1) << e;
}
function Ec(t) {
  return xw(BigInt(`0x${rt(t)}`), BigInt(t.byteLength * 8));
}
function xw(t, e) {
  return mw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Sw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function rt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Sw[n];
  return e;
}
function Ct(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = ww(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function ps(t) {
  return new TextEncoder().encode(t);
}
function zi(t) {
  return new TextDecoder().decode(t);
}
function Ew(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Aw(t) {
  return String.fromCharCode.apply(null, t);
}
function $w(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Qu(t) {
  if (t.some($w))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function En(...t) {
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
function se(t) {
  return En(...t.map((e) => typeof e == "number" ? Qu([e]) : e instanceof Array ? Qu(e) : e));
}
function _e(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const _h = "https://api.mainnet.hiro.so", Nh = "https://api.testnet.hiro.so", Uh = "http://localhost:3999", vw = "https://hub.blockstack.org", Iw = 33, Wa = 32;
function kw(t) {
  if (t.length < Wa * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wa * 2), r = t.slice(2 + Wa * 2);
  return {
    recoveryId: da(e),
    r: n,
    s: r
  };
}
function kl(t) {
  const e = typeof t == "string" ? Ct(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Lw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Cw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Bw(t, e) {
  return t[e];
}
function Tw(t, e, n = 0) {
  return t[n] = e, t;
}
function Mw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const _w = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Nw(t, e) {
  const n = {};
  return Object.assign(n, _w, e), await fetch(t, n);
}
function Uw(t) {
  let e = Nw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Pw(...t) {
  const { fetchLib: e, middlewares: n } = Uw(t);
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
class Ph {
  constructor(e = Th.slice(), n = ((a) => (a = vl("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = aw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ac(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Hw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ow(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ac(t.outputLen), Ac(t.blockLen);
}
function Dw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fw(t, e) {
  Hh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Dr = {
  number: Ac,
  bool: Hw,
  bytes: Hh,
  hash: Ow,
  exists: Dw,
  output: Fw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), un = (t, e) => t << 32 - e | t >>> e, jw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!jw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ll(t) {
  if (typeof t == "string" && (t = zw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Oh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gs(t) {
  const e = (r) => t().update(Ll(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Dh = class extends Oh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Dr.hash(e);
    const r = Ll(n);
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
    return Dr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Dr.exists(this), Dr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ha = (t, e, n) => new Dh(t, e).update(n).digest();
ha.create = (t, e) => new Dh(t, e);
function Rw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Cl = class extends Oh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xa(this.buffer);
  }
  update(e) {
    Dr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ll(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Xa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Dr.exists(this), Dr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Rw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Xa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const Gw = (t, e, n) => t & e ^ ~t & n, Kw = (t, e, n) => t & e ^ t & n ^ e & n, Vw = new Uint32Array([
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
]), qn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wn = new Uint32Array(64);
let Fh = class extends Cl {
  constructor() {
    super(64, 32, 8, !1), this.A = qn[0] | 0, this.B = qn[1] | 0, this.C = qn[2] | 0, this.D = qn[3] | 0, this.E = qn[4] | 0, this.F = qn[5] | 0, this.G = qn[6] | 0, this.H = qn[7] | 0;
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
      Wn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Wn[l - 15], h = Wn[l - 2], b = un(g, 7) ^ un(g, 18) ^ g >>> 3, m = un(h, 17) ^ un(h, 19) ^ h >>> 10;
      Wn[l] = m + Wn[l - 7] + b + Wn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = un(a, 6) ^ un(a, 11) ^ un(a, 25), h = d + g + Gw(a, c, f) + Vw[l] + Wn[l] | 0, m = (un(r, 2) ^ un(r, 13) ^ un(r, 22)) + Kw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Wn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, qw = class extends Fh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ks = gs(() => new Fh());
gs(() => new qw());
const Ww = {}, jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ww
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const kt = BigInt(0), qt = BigInt(1), mr = BigInt(2), Ai = BigInt(3), Ju = BigInt(8), Pt = Object.freeze({
  a: kt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: qt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), tf = (t, e) => (t + e / mr) / e, eo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Pt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -qt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = tf(i * t, e), c = tf(-r * t, e);
    let f = K(t - a * n - c * s, e), d = K(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, sn = 32, Yr = 32, zh = 32, Fo = sn + 1, jo = 2 * sn + 1;
function ef(t) {
  const { a: e, b: n } = Pt, r = K(t * t), s = K(r * t);
  return K(s + e * t + n);
}
const no = Pt.a === kt;
class Bl extends Error {
  constructor(e) {
    super(e);
  }
}
function nf(t) {
  if (!(t instanceof _t))
    throw new TypeError("JacobianPoint expected");
}
class _t {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof St))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(St.ZERO) ? _t.ZERO : new _t(e.x, e.y, qt);
  }
  static toAffineBatch(e) {
    const n = Jw(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return _t.toAffineBatch(e).map(_t.fromAffine);
  }
  equals(e) {
    nf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new _t(this.x, K(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = K(e * e), i = K(n * n), o = K(i * i), a = e + i, c = K(mr * (K(a * a) - s - o)), f = K(Ai * s), d = K(f * f), l = K(d - mr * c), g = K(f * (c - l) - Ju * o), h = K(mr * n * r);
    return new _t(l, g, h);
  }
  add(e) {
    nf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === kt || o === kt)
      return this;
    if (n === kt || r === kt)
      return e;
    const c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c), b = K(l - d), m = K(h - g);
    if (b === kt)
      return m === kt ? this.double() : _t.ZERO;
    const k = K(b * b), S = K(b * k), T = K(d * k), w = K(m * m - S - mr * T), C = K(m * (T - w) - g * S), I = K(s * a * b);
    return new _t(w, C, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = _t.ZERO;
    if (typeof e == "bigint" && e === kt)
      return n;
    let r = of(e);
    if (r === qt)
      return this;
    if (!no) {
      let l = n, g = this;
      for (; r > kt; )
        r & qt && (l = l.add(g)), g = g.double(), r >>= qt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = eo.splitScalar(r), c = n, f = n, d = this;
    for (; i > kt || a > kt; )
      i & qt && (c = c.add(d)), a & qt && (f = f.add(d)), d = d.double(), i >>= qt, a >>= qt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new _t(K(f.x * eo.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = no ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(_t.BASE) && (n = St.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && $c.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = _t.normalizeZ(s), $c.set(n, s)));
    let i = _t.ZERO, o = _t.BASE;
    const a = 1 + (no ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & f);
      e >>= l, b > c && (b -= d, e += qt);
      const m = h, k = h + Math.abs(b) - 1, S = g % 2 !== 0, T = b < 0;
      b === 0 ? o = o.add(ro(S, s[m])) : i = i.add(ro(T, s[k]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = of(e), s, i;
    if (no) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = eo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = ro(o, d), g = ro(c, g), g = new _t(K(g.x * eo.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return _t.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(_t.ZERO);
    e == null && (e = i ? Ju : ci(s));
    const o = e, a = K(o * o), c = K(a * o), f = K(n * a), d = K(r * c), l = K(s * o);
    if (i)
      return St.ZERO;
    if (l !== qt)
      throw new Error("invZ was invalid");
    return new St(f, d);
  }
}
_t.BASE = new _t(Pt.Gx, Pt.Gy, qt);
_t.ZERO = new _t(kt, qt, kt);
function ro(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const $c = /* @__PURE__ */ new WeakMap();
class St {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, $c.delete(this);
  }
  hasEvenY() {
    return this.y % mr === kt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ze(n ? e : e.subarray(1));
    if (!To(r))
      throw new Error("Point is not on curve");
    const s = ef(r);
    let i = Qw(s);
    const o = (i & qt) === qt;
    n ? o && (i = K(-i)) : (e[0] & 1) === 1 !== o && (i = K(-i));
    const a = new St(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = ze(e.subarray(1, sn + 1)), r = ze(e.subarray(sn + 1, sn * 2 + 1)), s = new St(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = An(e), r = n.length, s = n[0];
    if (r === sn)
      return this.fromCompressedHex(n);
    if (r === Fo && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === jo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fo} compressed bytes or ${jo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return St.BASE.multiply(Zr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Kh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Tl(An(e)), { n: a } = Pt, c = r === 2 || r === 3 ? s + a : s, f = ci(c, a), d = K(-o * f, a), l = K(i * f, a), g = r & 1 ? "03" : "02", h = St.fromHex(g + xr(c)), b = St.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return Sr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = xr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${xr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!To(n) || !To(r))
      throw new Error(e);
    const s = K(r * r), i = ef(n);
    if (K(s - i) !== kt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new St(this.x, K(-this.y));
  }
  double() {
    return _t.fromAffine(this).double().toAffine();
  }
  add(e) {
    return _t.fromAffine(this).add(_t.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return _t.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = _t.fromAffine(this), i = n === kt || n === qt || this !== St.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = _t.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(_t.ZERO) ? void 0 : a.toAffine();
  }
}
St.BASE = new St(Pt.Gx, Pt.Gy);
St.ZERO = new St(kt, kt);
function rf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function sf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Vs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ze(n), left: t.subarray(e + 2) };
}
function Xw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Vs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = sf(t.subarray(2)), { data: r, left: s } = sf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Vs(s)}`);
  return { r: e, s: r };
}
class je {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Vs(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new je(zo(s.slice(0, 64)), zo(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Xw(n ? e : Sr(e));
    return new je(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ws(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ws(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Pt.n >> qt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new je(this.r, K(-this.s, Pt.n)) : this;
  }
  toDERRawBytes() {
    return Sr(this.toDERHex());
  }
  toDERHex() {
    const e = rf(mi(this.s)), n = rf(mi(this.r)), r = e.length / 2, s = n.length / 2, i = mi(r), o = mi(s);
    return `30${mi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Sr(this.toCompactHex());
  }
  toCompactHex() {
    return xr(this.r) + xr(this.s);
  }
}
function wr(...t) {
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
const Yw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Vs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Yw[t[n]];
  return e;
}
const Zw = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function xr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(kt <= t && t < Zw))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function qs(t) {
  const e = Sr(xr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function mi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function zo(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Sr(t) {
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
function ze(t) {
  return zo(Vs(t));
}
function An(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Sr(t);
}
function of(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ws(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function K(t, e = Pt.P) {
  const n = t % e;
  return n >= kt ? n : e + n;
}
function Ke(t, e) {
  const { P: n } = Pt;
  let r = t;
  for (; e-- > kt; )
    r *= r, r %= n;
  return r;
}
function Qw(t) {
  const { P: e } = Pt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = Ke(f, Ai) * f % e, l = Ke(d, Ai) * f % e, g = Ke(l, mr) * c % e, h = Ke(g, r) * g % e, b = Ke(h, s) * h % e, m = Ke(b, o) * b % e, k = Ke(m, a) * m % e, S = Ke(k, o) * b % e, T = Ke(S, Ai) * f % e, w = Ke(T, i) * h % e, C = Ke(w, n) * c % e, I = Ke(C, mr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function ci(t, e = Pt.P) {
  if (t === kt || e <= kt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = K(t, e), r = e, s = kt, i = qt;
  for (; n !== kt; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== qt)
    throw new Error("invert: does not exist");
  return K(s, e);
}
function Jw(t, e = Pt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === kt ? i : (n[a] = i, K(i * o, e)), qt), s = ci(r, e);
  return t.reduceRight((i, o, a) => o === kt ? i : (n[a] = K(i * n[a], e), K(i * o, e)), s), n;
}
function tb(t) {
  const e = t.length * 8 - Yr * 8, n = ze(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Tl(t, e = !1) {
  const n = tb(t);
  if (e)
    return n;
  const { n: r } = Pt;
  return n >= r ? n - r : n;
}
let js, $i;
class Rh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ee.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return $i(this.k, ...e);
  }
  checkSync() {
    if (typeof $i != "function")
      throw new Bl("hmacSha256Sync needs to be set");
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
    return wr(...n);
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
    return wr(...n);
  }
}
function Ws(t) {
  return kt < t && t < Pt.n;
}
function To(t) {
  return kt < t && t < Pt.P;
}
function Gh(t, e, n, r = !0) {
  const { n: s } = Pt, i = Tl(t, !0);
  if (!Ws(i))
    return;
  const o = ci(i, s), a = St.BASE.multiply(i), c = K(a.x, s);
  if (c === kt)
    return;
  const f = K(o * K(e + n * c, s), s);
  if (f === kt)
    return;
  let d = new je(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & qt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Zr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Yr)
      throw new Error("Expected 32 bytes of private key");
    e = zo(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Yr)
      throw new Error("Expected 32 bytes of private key");
    e = ze(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ws(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ml(t) {
  return t instanceof St ? (t.assertValidity(), t) : St.fromHex(t);
}
function Kh(t) {
  if (t instanceof je)
    return t.assertValidity(), t;
  try {
    return je.fromDER(t);
  } catch {
    return je.fromCompact(t);
  }
}
function Ri(t, e = !1) {
  return St.fromPrivateKey(t).toRawBytes(e);
}
function eb(t, e, n, r = !1) {
  return St.fromSignature(t, e, n).toRawBytes(r);
}
function af(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Fo || r === jo : n ? r === Fo * 2 || r === jo * 2 : t instanceof St;
}
function _l(t, e, n = !1) {
  if (af(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!af(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ml(e);
  return r.assertValidity(), r.multiply(Zr(t)).toRawBytes(n);
}
function Vh(t) {
  const e = t.length > sn ? t.slice(0, sn) : t;
  return ze(e);
}
function nb(t) {
  const e = Vh(t), n = K(e, Pt.n);
  return qh(n < kt ? e : n);
}
function qh(t) {
  return qs(t);
}
function Wh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = An(t), s = Zr(e), i = [qh(s), nb(r)];
  if (n != null) {
    n === !0 && (n = ee.randomBytes(sn));
    const c = An(n);
    if (c.length !== sn)
      throw new Error(`sign: Expected ${sn} bytes of extra data`);
    i.push(c);
  }
  const o = wr(...i), a = Vh(r);
  return { seed: o, m: a, d: s };
}
function Xh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function rb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Wh(t, e, n.extraEntropy), o = new Rh(zh, Yr);
  await o.reseed(r);
  let a;
  for (; !(a = Gh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Xh(a, n);
}
function pa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Wh(t, e, n.extraEntropy), o = new Rh(zh, Yr);
  o.reseedSync(r);
  let a;
  for (; !(a = Gh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Xh(a, n);
}
const sb = { strict: !0 };
function ib(t, e, n, r = sb) {
  let s;
  try {
    s = Kh(t), e = An(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Tl(e);
  let c;
  try {
    c = Ml(n);
  } catch {
    return !1;
  }
  const { n: f } = Pt, d = ci(o, f), l = K(a * d, f), g = K(i * d, f), h = St.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? K(h.x, f) === i : !1;
}
function Ro(t) {
  return K(ze(t), Pt.n);
}
class Xs {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = An(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ze(n.subarray(0, 32)), s = ze(n.subarray(32, 64));
    return new Xs(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!To(e) || !Ws(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return xr(this.r) + xr(this.s);
  }
  toRawBytes() {
    return Sr(this.toHex());
  }
}
function ob(t) {
  return St.fromPrivateKey(t).toRawX();
}
class Yh {
  constructor(e, n, r = ee.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = An(e);
    const { x: s, scalar: i } = this.getScalar(Zr(n));
    if (this.px = s, this.d = i, this.rand = An(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = St.fromPrivateKey(e), r = n.hasEvenY() ? e : Pt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return qs(e ^ ze(n));
  }
  finalizeNonce(e) {
    const n = K(ze(e), Pt.n);
    if (n === kt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Xs(e.x, K(n + r * s, Pt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = ee.taggedHash, o = this.initNonce(n, await i(yr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(yr.nonce, o, r, e)), d = Ro(await i(yr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await Jh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = ee.taggedHashSync, o = this.initNonce(n, i(yr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(yr.nonce, o, r, e)), d = Ro(i(yr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return t0(l, e, r) || this.error(), l;
  }
}
async function ab(t, e, n) {
  return new Yh(t, e, n).calc();
}
function cb(t, e, n) {
  return new Yh(t, e, n).calcSync();
}
function Zh(t, e, n) {
  const r = t instanceof Xs, s = r ? t : Xs.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: An(e),
    P: Ml(n)
  };
}
function Qh(t, e, n, r) {
  const s = St.BASE.multiplyAndAddUnsafe(e, Zr(n), K(-r, Pt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Jh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Zh(t, e, n), a = Ro(await ee.taggedHash(yr.challenge, qs(r), o.toRawX(), i));
    return Qh(r, o, s, a);
  } catch {
    return !1;
  }
}
function t0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Zh(t, e, n), a = Ro(ee.taggedHashSync(yr.challenge, qs(r), o.toRawX(), i));
    return Qh(r, o, s, a);
  } catch (r) {
    if (r instanceof Bl)
      throw r;
    return !1;
  }
}
const lb = {
  Signature: Xs,
  getPublicKey: ob,
  sign: ab,
  verify: Jh,
  signSync: cb,
  verifySync: t0
};
St.BASE._setWindowSize(8);
const Pe = {
  node: jh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, yr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, so = {}, ee = {
  bytesToHex: Vs,
  hexToBytes: Sr,
  concatBytes: wr,
  mod: K,
  invert: ci,
  isValidPrivateKey(t) {
    try {
      return Zr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: qs,
  _normalizePrivateKey: Zr,
  hashToPrivateKey: (t) => {
    t = An(t);
    const e = Yr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = K(ze(t), Pt.n - qt) + qt;
    return qs(n);
  },
  randomBytes: (t = 32) => {
    if (Pe.web)
      return Pe.web.getRandomValues(new Uint8Array(t));
    if (Pe.node) {
      const { randomBytes: e } = Pe.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ee.hashToPrivateKey(ee.randomBytes(Yr + 8)),
  precompute(t = 8, e = St.BASE) {
    const n = e === St.BASE ? e : new St(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ai), n;
  },
  sha256: async (...t) => {
    if (Pe.web) {
      const e = await Pe.web.subtle.digest("SHA-256", wr(...t));
      return new Uint8Array(e);
    } else if (Pe.node) {
      const { createHash: e } = Pe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Pe.web) {
      const n = await Pe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = wr(...e), s = await Pe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Pe.node) {
      const { createHmac: n } = Pe.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = so[t];
    if (n === void 0) {
      const r = await ee.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = wr(r, r), so[t] = n;
    }
    return ee.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof js != "function")
      throw new Bl("sha256Sync is undefined, you need to set it");
    let n = so[t];
    if (n === void 0) {
      const r = js(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = wr(r, r), so[t] = n;
    }
    return js(n, ...e);
  },
  _JacobianPoint: _t
};
Object.defineProperties(ee, {
  sha256Sync: {
    configurable: !1,
    get() {
      return js;
    },
    set(t) {
      js || (js = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return $i;
    },
    set(t) {
      $i || ($i = t);
    }
  }
});
const ub = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Pt,
  Point: St,
  Signature: je,
  getPublicKey: Ri,
  getSharedSecret: _l,
  recoverPublicKey: eb,
  schnorr: lb,
  sign: rb,
  signSync: pa,
  utils: ee,
  verify: ib
}, Symbol.toStringTag, { value: "Module" }));
var Gi = {};
Gi.byteLength = gb;
var fb = Gi.toByteArray = wb, db = Gi.fromByteArray = xb, yn = [], qe = [], hb = typeof Uint8Array < "u" ? Uint8Array : Array, Ya = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Bs = 0, pb = Ya.length; Bs < pb; ++Bs)
  yn[Bs] = Ya[Bs], qe[Ya.charCodeAt(Bs)] = Bs;
qe[45] = 62;
qe[95] = 63;
function e0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function gb(t) {
  var e = e0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function yb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function wb(t) {
  var e, n = e0(t), r = n[0], s = n[1], i = new hb(yb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = qe[t.charCodeAt(c)] << 18 | qe[t.charCodeAt(c + 1)] << 12 | qe[t.charCodeAt(c + 2)] << 6 | qe[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = qe[t.charCodeAt(c)] << 2 | qe[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = qe[t.charCodeAt(c)] << 10 | qe[t.charCodeAt(c + 1)] << 4 | qe[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function bb(t) {
  return yn[t >> 18 & 63] + yn[t >> 12 & 63] + yn[t >> 6 & 63] + yn[t & 63];
}
function mb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(bb(r));
  return s.join("");
}
function xb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(mb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    yn[e >> 2] + yn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    yn[e >> 10] + yn[e >> 4 & 63] + yn[e << 2 & 63] + "="
  )), s.join("");
}
function Sb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Eb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Ab() {
  if (Sb())
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
    throw new Error(Eb);
  }
}
class $b {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(En(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(En(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class vb {
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
async function n0() {
  const t = await Ab();
  return t.name === "subtleCrypto" ? new vb(t.lib) : new $b(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Ib(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var b = 0, m = 0, k = 0, S = h.length; k !== S && h[k] === 0; )
      k++, b++;
    for (var T = (S - k) * f + 1 >>> 0, w = new Uint8Array(T); k !== S; ) {
      for (var C = h[k], I = 0, O = T - 1; (C !== 0 || I < m) && O !== -1; O--, I++)
        C += 256 * w[O] >>> 0, w[O] = C % o >>> 0, C = C / o >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      m = I, k++;
    }
    for (var X = T - m; X !== T && w[X] === 0; )
      X++;
    for (var F = a.repeat(b); X < T; ++X)
      F += t.charAt(w[X]);
    return F;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, m = 0, k = 0; h[b] === a; )
      m++, b++;
    for (var S = (h.length - b) * c + 1 >>> 0, T = new Uint8Array(S); h[b]; ) {
      var w = h.charCodeAt(b);
      if (w > 255)
        return;
      var C = e[w];
      if (C === 255)
        return;
      for (var I = 0, O = S - 1; (C !== 0 || I < k) && O !== -1; O--, I++)
        C += o * T[O] >>> 0, T[O] = C % 256 >>> 0, C = C / 256 >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      k = I, b++;
    }
    for (var X = S - k; X !== S && T[X] === 0; )
      X++;
    for (var F = new Uint8Array(m + (S - X)), U = m; X !== S; )
      F[U++] = T[X++];
    return F;
  }
  function g(h) {
    var b = l(h);
    if (b)
      return b;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var r0 = Ib;
const kb = r0, Lb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Cb = kb(Lb);
const Bb = /* @__PURE__ */ kh(Cb), Tb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), s0 = Uint8Array.from({ length: 16 }, (t, e) => e), Mb = s0.map((t) => (9 * t + 5) % 16);
let Nl = [s0], Ul = [Mb];
for (let t = 0; t < 4; t++)
  for (let e of [Nl, Ul])
    e.push(e[t].map((n) => Tb[n]));
const i0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), _b = Nl.map((t, e) => t.map((n) => i0[e][n])), Nb = Ul.map((t, e) => t.map((n) => i0[e][n])), Ub = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Pb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), io = (t, e) => t << e | t >>> 32 - e;
function cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oo = new Uint32Array(16);
let Hb = class extends Cl {
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
      oo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = Ub[h], k = Pb[h], S = Nl[h], T = Ul[h], w = _b[h], C = Nb[h];
      for (let I = 0; I < 16; I++) {
        const O = io(r + cf(h, i, a, f) + oo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = io(a, 10) | 0, a = i, i = O;
      }
      for (let I = 0; I < 16; I++) {
        const O = io(s + cf(b, o, c, d) + oo[T[I]] + k, C[I]) + g | 0;
        s = g, g = d, d = io(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Ob = gs(() => new Hb());
function Db(t) {
  return Ob(t);
}
const ao = BigInt(2 ** 32 - 1), vc = BigInt(32);
function o0(t, e = !1) {
  return e ? { h: Number(t & ao), l: Number(t >> vc & ao) } : { h: Number(t >> vc & ao) | 0, l: Number(t & ao) | 0 };
}
function Fb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = o0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const jb = (t, e) => BigInt(t >>> 0) << vc | BigInt(e >>> 0), zb = (t, e, n) => t >>> n, Rb = (t, e, n) => t << 32 - n | e >>> n, Gb = (t, e, n) => t >>> n | e << 32 - n, Kb = (t, e, n) => t << 32 - n | e >>> n, Vb = (t, e, n) => t << 64 - n | e >>> n - 32, qb = (t, e, n) => t >>> n - 32 | e << 64 - n, Wb = (t, e) => e, Xb = (t, e) => t, Yb = (t, e, n) => t << n | e >>> 32 - n, Zb = (t, e, n) => e << n | t >>> 32 - n, Qb = (t, e, n) => e << n - 32 | t >>> 64 - n, Jb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function t1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const e1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), n1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, r1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), s1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, i1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), o1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, gt = {
  fromBig: o0,
  split: Fb,
  toBig: jb,
  shrSH: zb,
  shrSL: Rb,
  rotrSH: Gb,
  rotrSL: Kb,
  rotrBH: Vb,
  rotrBL: qb,
  rotr32H: Wb,
  rotr32L: Xb,
  rotlSH: Yb,
  rotlSL: Zb,
  rotlBH: Qb,
  rotlBL: Jb,
  add: t1,
  add3L: e1,
  add3H: n1,
  add4L: r1,
  add4H: s1,
  add5H: o1,
  add5L: i1
}, [a1, c1] = gt.split([
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
].map((t) => BigInt(t))), Xn = new Uint32Array(80), Yn = new Uint32Array(80);
let ga = class extends Cl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: k } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = k | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Xn[w] = e.getUint32(n), Yn[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const C = Xn[w - 15] | 0, I = Yn[w - 15] | 0, O = gt.rotrSH(C, I, 1) ^ gt.rotrSH(C, I, 8) ^ gt.shrSH(C, I, 7), X = gt.rotrSL(C, I, 1) ^ gt.rotrSL(C, I, 8) ^ gt.shrSL(C, I, 7), F = Xn[w - 2] | 0, U = Yn[w - 2] | 0, x = gt.rotrSH(F, U, 19) ^ gt.rotrBH(F, U, 61) ^ gt.shrSH(F, U, 6), B = gt.rotrSL(F, U, 19) ^ gt.rotrBL(F, U, 61) ^ gt.shrSL(F, U, 6), P = gt.add4L(X, B, Yn[w - 7], Yn[w - 16]), Z = gt.add4H(P, O, x, Xn[w - 7], Xn[w - 16]);
      Xn[w] = Z | 0, Yn[w] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: k, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const C = gt.rotrSH(l, g, 14) ^ gt.rotrSH(l, g, 18) ^ gt.rotrBH(l, g, 41), I = gt.rotrSL(l, g, 14) ^ gt.rotrSL(l, g, 18) ^ gt.rotrBL(l, g, 41), O = l & h ^ ~l & m, X = g & b ^ ~g & k, F = gt.add5L(T, I, X, c1[w], Yn[w]), U = gt.add5H(F, S, C, O, a1[w], Xn[w]), x = F | 0, B = gt.rotrSH(r, s, 28) ^ gt.rotrBH(r, s, 34) ^ gt.rotrBH(r, s, 39), P = gt.rotrSL(r, s, 28) ^ gt.rotrBL(r, s, 34) ^ gt.rotrBL(r, s, 39), Z = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      S = m | 0, T = k | 0, m = h | 0, k = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = gt.add(f | 0, d | 0, U | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = gt.add3L(x, P, Q);
      r = gt.add3H(Y, U, B, Z), s = Y | 0;
    }
    ({ h: r, l: s } = gt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = gt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = gt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = gt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = gt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = gt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: k } = gt.add(this.Gh | 0, this.Gl | 0, m | 0, k | 0), { h: S, l: T } = gt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, k, S, T);
  }
  roundClean() {
    Xn.fill(0), Yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, l1 = class extends ga {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, u1 = class extends ga {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, f1 = class extends ga {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const d1 = gs(() => new ga());
gs(() => new l1());
gs(() => new u1());
gs(() => new f1());
function a0(t) {
  return Ks(t);
}
function h1(t) {
  return d1(t);
}
const p1 = 0;
ee.hmacSha256Sync = (t, ...e) => {
  const n = ha.create(Ks, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function g1() {
  return rt(ee.randomPrivateKey());
}
function y1(t) {
  const e = Ks(Ks(t));
  return Bb.encode(En(t, e).slice(0, t.length + 4));
}
function w1(t, e) {
  return y1(En(new Uint8Array([t]), e.slice(0, 20)));
}
function c0(t, e = p1) {
  const n = typeof t == "string" ? Ct(t) : t, r = Db(a0(n));
  return w1(e, r);
}
function l0(t) {
  const e = kl(t);
  return rt(Ri(e.slice(0, 32), !0));
}
ee.hmacSha256Sync = (t, ...e) => {
  const n = ha.create(Ks, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Go;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Go || (Go = {}));
async function b1(t, e, n) {
  return await (await n0()).encrypt("aes-256-cbc", e, t, n);
}
async function m1(t, e, n) {
  return await (await n0()).decrypt("aes-256-cbc", e, t, n);
}
function u0(t, e) {
  return ha(Ks, t, e);
}
function x1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function f0(t) {
  const e = h1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function S1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function E1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Go.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Go.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !S1(t))
    return e;
  try {
    return St.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function A1(t, e, n, r) {
  const s = E1(t);
  if (!s.result)
    throw s;
  const i = ee.randomPrivateKey(), o = Ri(i, !0);
  let a = _l(i, t, !0);
  a = a.slice(1);
  const c = f0(a), f = ee.randomBytes(16), d = await b1(f, c.encryptionKey, e), l = En(f, o, d), g = u0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = rt(d);
  else if (r === "base64")
    h = db(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: rt(f),
    ephemeralPK: rt(o),
    cipherText: h,
    mac: rt(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function d0(t, e) {
  if (!e.ephemeralPK)
    throw new Xu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = _l(t, n, !0);
  r = r.slice(1);
  const s = f0(r), i = Ct(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Ct(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = fb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = En(i, Ct(n), o), c = u0(s.hmacKey, a), f = Ct(e.mac);
  if (!x1(f, c))
    throw new Xu("Decryption failed: failure in MAC check");
  const d = await m1(i, s.encryptionKey, o);
  return e.wasString ? zi(d) : d;
}
function $1(t, e) {
  const n = typeof e == "string" ? ps(e) : e, r = l0(t), s = a0(n), i = pa(s, t);
  return {
    signature: rt(i),
    publicKey: r
  };
}
async function v1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = l0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? ps(t) : t, o = await A1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = $1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function I1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return d0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var he = {}, Ys = {}, Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.decode = Ae.encode = Ae.unescape = Ae.escape = Ae.pad = void 0;
const h0 = Gi;
function Pl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Ae.pad = Pl;
function p0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Ae.escape = p0;
function g0(t) {
  return Pl(t).replace(/-/g, "+").replace(/_/g, "/");
}
Ae.unescape = g0;
function k1(t) {
  return p0((0, h0.fromByteArray)(new TextEncoder().encode(t)));
}
Ae.encode = k1;
function L1(t) {
  return new TextDecoder().decode((0, h0.toByteArray)(Pl(g0(t))));
}
Ae.decode = L1;
var ya = {}, wa = {}, y0 = {}, w0 = {}, ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
ba.crypto = void 0;
ba.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = m, t.bytesToHex = T, t.hexToBytes = I, t.asyncLoop = X, t.utf8ToBytes = F, t.bytesToUtf8 = U, t.toBytes = x, t.kdfInputToBytes = B, t.concatBytes = P, t.checkOpts = Z, t.createHasher = Y, t.createOptHasher = Ht, t.createXOFer = oe, t.randomBytes = ne;
  const e = ba;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function s(A, ...N) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (N.length > 0 && !N.includes(A.length))
      throw new Error("Uint8Array expected of length " + N + ", got length=" + A.length);
  }
  function i(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, N = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (N && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, N) {
    s(A);
    const it = N.outputLen;
    if (A.length < it)
      throw new Error("digestInto() expects output buffer of length at least " + it);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function f(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function d(...A) {
    for (let N = 0; N < A.length; N++)
      A[N].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function g(A, N) {
    return A << 32 - N | A >>> N;
  }
  function h(A, N) {
    return A << N | A >>> 32 - N >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => b(A), t.byteSwapIfBE = t.swap8IfBE;
  function m(A) {
    for (let N = 0; N < A.length; N++)
      A[N] = b(A[N]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : m;
  const k = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", S = /* @__PURE__ */ Array.from({ length: 256 }, (A, N) => N.toString(16).padStart(2, "0"));
  function T(A) {
    if (s(A), k)
      return A.toHex();
    let N = "";
    for (let it = 0; it < A.length; it++)
      N += S[A[it]];
    return N;
  }
  const w = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function C(A) {
    if (A >= w._0 && A <= w._9)
      return A - w._0;
    if (A >= w.A && A <= w.F)
      return A - (w.A - 10);
    if (A >= w.a && A <= w.f)
      return A - (w.a - 10);
  }
  function I(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (k)
      return Uint8Array.fromHex(A);
    const N = A.length, it = N / 2;
    if (N % 2)
      throw new Error("hex string expected, got unpadded hex of length " + N);
    const dt = new Uint8Array(it);
    for (let ut = 0, It = 0; ut < it; ut++, It += 2) {
      const Tt = C(A.charCodeAt(It)), Qt = C(A.charCodeAt(It + 1));
      if (Tt === void 0 || Qt === void 0) {
        const Nt = A[It] + A[It + 1];
        throw new Error('hex string expected, got non-hex character "' + Nt + '" at index ' + It);
      }
      dt[ut] = Tt * 16 + Qt;
    }
    return dt;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function X(A, N, it) {
    let dt = Date.now();
    for (let ut = 0; ut < A; ut++) {
      it(ut);
      const It = Date.now() - dt;
      It >= 0 && It < N || (await (0, t.nextTick)(), dt += It);
    }
  }
  function F(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function U(A) {
    return new TextDecoder().decode(A);
  }
  function x(A) {
    return typeof A == "string" && (A = F(A)), s(A), A;
  }
  function B(A) {
    return typeof A == "string" && (A = F(A)), s(A), A;
  }
  function P(...A) {
    let N = 0;
    for (let dt = 0; dt < A.length; dt++) {
      const ut = A[dt];
      s(ut), N += ut.length;
    }
    const it = new Uint8Array(N);
    for (let dt = 0, ut = 0; dt < A.length; dt++) {
      const It = A[dt];
      it.set(It, ut), ut += It.length;
    }
    return it;
  }
  function Z(A, N) {
    if (N !== void 0 && {}.toString.call(N) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, N);
  }
  class Q {
  }
  t.Hash = Q;
  function Y(A) {
    const N = (dt) => A().update(x(dt)).digest(), it = A();
    return N.outputLen = it.outputLen, N.blockLen = it.blockLen, N.create = () => A(), N;
  }
  function Ht(A) {
    const N = (dt, ut) => A(ut).update(x(dt)).digest(), it = A({});
    return N.outputLen = it.outputLen, N.blockLen = it.blockLen, N.create = (dt) => A(dt), N;
  }
  function oe(A) {
    const N = (dt, ut) => A(ut).update(x(dt)).digest(), it = A({});
    return N.outputLen = it.outputLen, N.blockLen = it.blockLen, N.create = (dt) => A(dt), N;
  }
  t.wrapConstructor = Y, t.wrapConstructorWithOpts = Ht, t.wrapXOFConstructorWithOpts = oe;
  function ne(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(w0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = w0;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? i.create().update(a).digest() : a);
      for (let d = 0; d < f.length; d++)
        f[d] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let d = 0; d < f.length; d++)
        f[d] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
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
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = f, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(y0);
const Ts = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function b0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ys(t, ...e) {
  if (!b0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function C1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ic(t.outputLen), Ic(t.blockLen);
}
function kc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function m0(t, e) {
  ys(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function B1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function T1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ko(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Mo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Je(t, e) {
  return t << 32 - e | t >>> e;
}
function M1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Hl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ol(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const x0 = Hl ? (t) => t : (t) => Ol(t), _1 = x0;
function S0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ol(t[e]);
  return t;
}
const N1 = Hl ? (t) => t : S0, E0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A0(t) {
  if (ys(t), E0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += U1[t[n]];
  return e;
}
const Cn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function lf(t) {
  if (t >= Cn._0 && t <= Cn._9)
    return t - Cn._0;
  if (t >= Cn.A && t <= Cn.F)
    return t - (Cn.A - 10);
  if (t >= Cn.a && t <= Cn.f)
    return t - (Cn.a - 10);
}
function P1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (E0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = lf(t.charCodeAt(i)), a = lf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const $0 = async () => {
};
async function H1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await $0(), r += i);
  }
}
function Dl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function O1(t) {
  return new TextDecoder().decode(t);
}
function Ki(t) {
  return typeof t == "string" && (t = Dl(t)), ys(t), t;
}
function D1(t) {
  return typeof t == "string" && (t = Dl(t)), ys(t), t;
}
function F1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    ys(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function j1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let v0 = class {
};
function ma(t) {
  const e = (r) => t().update(Ki(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function I0(t) {
  const e = (r, s) => t(s).update(Ki(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function k0(t) {
  const e = (r, s) => t(s).update(Ki(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const z1 = ma, R1 = I0, G1 = k0;
function K1(t = 32) {
  if (Ts && typeof Ts.getRandomValues == "function")
    return Ts.getRandomValues(new Uint8Array(t));
  if (Ts && typeof Ts.randomBytes == "function")
    return Uint8Array.from(Ts.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const V1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: v0,
  abytes: ys,
  aexists: kc,
  ahash: C1,
  anumber: Ic,
  aoutput: m0,
  asyncLoop: H1,
  byteSwap: Ol,
  byteSwap32: S0,
  byteSwapIfBE: _1,
  bytesToHex: A0,
  bytesToUtf8: O1,
  checkOpts: j1,
  clean: Ko,
  concatBytes: F1,
  createHasher: ma,
  createOptHasher: I0,
  createView: Mo,
  createXOFer: k0,
  hexToBytes: P1,
  isBytes: b0,
  isLE: Hl,
  kdfInputToBytes: D1,
  nextTick: $0,
  randomBytes: K1,
  rotl: M1,
  rotr: Je,
  swap32IfBE: N1,
  swap8IfBE: x0,
  toBytes: Ki,
  u32: T1,
  u8: B1,
  utf8ToBytes: Dl,
  wrapConstructor: z1,
  wrapConstructorWithOpts: R1,
  wrapXOFConstructorWithOpts: G1
}, Symbol.toStringTag, { value: "Module" }));
function q1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function W1(t, e, n) {
  return t & e ^ ~t & n;
}
function X1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Y1 extends v0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Mo(this.buffer);
  }
  update(e) {
    kc(this), e = Ki(e), ys(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Mo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    kc(this), m0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ko(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    q1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Mo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const Zn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Z1 = /* @__PURE__ */ Uint32Array.from([
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
]), Jn = /* @__PURE__ */ new Uint32Array(64);
let Fl = class extends Y1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Zn[0] | 0, this.B = Zn[1] | 0, this.C = Zn[2] | 0, this.D = Zn[3] | 0, this.E = Zn[4] | 0, this.F = Zn[5] | 0, this.G = Zn[6] | 0, this.H = Zn[7] | 0;
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
      Jn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Jn[l - 15], h = Jn[l - 2], b = Je(g, 7) ^ Je(g, 18) ^ g >>> 3, m = Je(h, 17) ^ Je(h, 19) ^ h >>> 10;
      Jn[l] = m + Jn[l - 7] + b + Jn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Je(a, 6) ^ Je(a, 11) ^ Je(a, 25), h = d + g + W1(a, c, f) + Z1[l] + Jn[l] | 0, m = (Je(r, 2) ^ Je(r, 13) ^ Je(r, 22)) + X1(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Ko(Jn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ko(this.buffer);
  }
}, L0 = class extends Fl {
  constructor() {
    super(28), this.A = Qn[0] | 0, this.B = Qn[1] | 0, this.C = Qn[2] | 0, this.D = Qn[3] | 0, this.E = Qn[4] | 0, this.F = Qn[5] | 0, this.G = Qn[6] | 0, this.H = Qn[7] | 0;
  }
};
const Q1 = /* @__PURE__ */ ma(() => new Fl()), J1 = /* @__PURE__ */ ma(() => new L0()), tm = Fl, C0 = Q1, em = L0, nm = J1, rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: em,
  SHA256: tm,
  sha224: nm,
  sha256: C0
}, Symbol.toStringTag, { value: "Module" })), xa = /* @__PURE__ */ fa(rm), sm = /* @__PURE__ */ fa(ub);
var Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
Zs.joseToDer = Zs.derToJose = void 0;
const B0 = Gi, T0 = Ae;
function Za(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const im = {
  ES256: Za(256),
  ES384: Za(384),
  ES512: Za(521)
};
function M0(t) {
  const e = im[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Vo = 128, _0 = 0, om = 32, am = 16, cm = 2, N0 = am | om | _0 << 6, qo = cm | _0 << 6;
function U0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, B0.toByteArray)((0, T0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function lm(t, e) {
  const n = U0(t), r = M0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== N0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Vo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== qo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== qo)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, b = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    b[o] = 0;
  b.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const m = o; o < m + h; ++o)
    b[o] = 0;
  return b.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, T0.escape)((0, B0.fromByteArray)(b));
}
Zs.derToJose = lm;
function uf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Vo && --r, r;
}
function um(t, e) {
  t = U0(t);
  const n = M0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = uf(t, 0, n), i = uf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < Vo, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = N0, f ? d[l++] = c : (d[l++] = Vo | 1, d[l++] = c & 255), d[l++] = qo, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = qo, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Zs.joseToDer = um;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.InvalidTokenError = Hn.MissingParametersError = void 0;
class fm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Hn.MissingParametersError = fm;
class dm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Hn.InvalidTokenError = dm;
const Vi = /* @__PURE__ */ fa(V1);
Object.defineProperty(wa, "__esModule", { value: !0 });
wa.SECP256K1Client = void 0;
const hm = y0, pm = xa, _o = sm, ff = Zs, df = Hn, hf = Vi;
_o.utils.hmacSha256Sync = (t, ...e) => {
  const n = hm.hmac.create(pm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class P0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, hf.bytesToHex)(_o.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new df.MissingParametersError("a signing input hash and private key are all required");
    const s = _o.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, hf.bytesToHex)(s);
    if (r === "jose")
      return (0, ff.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ff.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new df.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return _o.verify(n, e, r, { strict: !1 });
  }
}
wa.SECP256K1Client = P0;
P0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = wa;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ya);
var Qr = {};
const gm = /* @__PURE__ */ fa(jh);
var ym = ve && ve.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.hashSha256Async = Qr.hashSha256 = void 0;
const wm = xa;
function H0(t) {
  return (0, wm.sha256)(t);
}
Qr.hashSha256 = H0;
function bm(t) {
  return ym(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = gm;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(H0(t));
    }
  });
}
Qr.hashSha256Async = bm;
var mm = ve && ve.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.TokenSigner = Ys.createUnsecuredToken = void 0;
const Lc = Ae, pf = ya, xm = Hn, gf = Qr;
function Cc(t, e) {
  const n = [], r = Lc.encode(JSON.stringify(e));
  n.push(r);
  const s = Lc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Sm(t) {
  return Cc(t, { typ: "JWT", alg: "none" }) + ".";
}
Ys.createUnsecuredToken = Sm;
class Em {
  constructor(e, n) {
    if (!(e && n))
      throw new xm.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !pf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = pf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Cc(e, s), o = (0, gf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return mm(this, void 0, void 0, function* () {
      const s = this.header(r), i = Cc(e, s), o = yield (0, gf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Lc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ys.TokenSigner = Em;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
Sa.TokenVerifier = void 0;
const Am = Ae, yf = ya, $m = Hn, co = Qr;
class vm {
  constructor(e, n) {
    if (!(e && n))
      throw new $m.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !yf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = yf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, co.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, co.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Am.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, co.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, co.hashSha256)(r);
      return i(o);
    }
  }
}
Sa.TokenVerifier = vm;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
Ea.decodeToken = void 0;
const lo = Ae;
function Im(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(lo.decode(e[0])), r = JSON.parse(lo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = lo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(lo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ea.decodeToken = Im;
(function(t) {
  var e = ve && ve.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ve && ve.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ys, t), n(Sa, t), n(Ea, t), n(Hn, t), n(ya, t);
})(he);
function km(t) {
  return `did:btc-addr:${t}`;
}
function Lm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Wu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Wu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function O0(t) {
  if (t)
    return Lm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Cm = "1.4.0";
function Bm() {
  return g1();
}
function Tm(t, e, n, r = Th.slice(), s, i = dw().getTime(), o = {}) {
  const a = (h) => {
    const b = vl("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: pw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Cm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = he.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = c0(f);
  return c.iss = km(d), new he.TokenSigner("ES256k", t).sign(c);
}
async function wf(t, e) {
  const n = zi(Ct(e)), r = JSON.parse(n), s = await d0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Mm(t) {
  const e = he.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new he.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function _m(t) {
  const e = he.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = O0(e.iss);
  if (n.length === 1) {
    if (c0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Nm(t) {
  const e = he.decodeToken(t).payload;
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
function Um(t) {
  const e = he.decodeToken(t).payload;
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
function Pm(t) {
  const e = [
    Um(t),
    Nm(t),
    Mm(t),
    _m(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const bf = "1.0.0";
class Er {
  constructor(e) {
    this.version = bf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== bf)
      throw new xc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Er(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class D0 {
  constructor(e) {
    if (e) {
      const n = new Er(e);
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
class mf extends D0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Er({}));
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
    return this.setSessionData(new Er({})), !0;
  }
}
class xf extends D0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = lw, !localStorage.getItem(this.key)) {
      const r = new Er({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Er.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Er({})), !0;
  }
}
var Bi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Bi || (Bi = {}));
var Wo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wo || (Wo = {}));
Bi.Mainnet;
var Un;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Un || (Un = {}));
var bn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(bn || (bn = {}));
Un.Mainnet;
const F0 = {
  chainId: Bi.Mainnet,
  transactionVersion: Un.Mainnet,
  peerNetworkId: Wo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: bn.MainnetSingleSig,
    multiSig: bn.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Bc = {
  chainId: Bi.Testnet,
  transactionVersion: Un.Testnet,
  peerNetworkId: Wo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: bn.TestnetSingleSig,
    multiSig: bn.TestnetMultiSig
  },
  client: { baseUrl: Nh }
}, No = {
  ...Bc,
  addressVersion: { ...Bc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, Hm = {
  ...No,
  addressVersion: { ...No.addressVersion },
  client: { ...No.client }
};
function Om(t) {
  switch (t) {
    case "mainnet":
      return F0;
    case "testnet":
      return Bc;
    case "devnet":
      return No;
    case "mocknet":
      return Hm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function j0(t) {
  return typeof t == "string" ? Om(t) : t;
}
var Sf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Sf || (Sf = {}));
var Ef;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ef || (Ef = {}));
var tn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(tn || (tn = {}));
const Qa = ["onChainOnly", "offChainOnly", "any"];
Qa[0] + "", tn.OnChainOnly, Qa[1] + "", tn.OffChainOnly, Qa[2] + "", tn.Any, tn.OnChainOnly + "", tn.OnChainOnly, tn.OffChainOnly + "", tn.OffChainOnly, tn.Any + "", tn.Any;
var Af;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Af || (Af = {}));
var $f;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($f || ($f = {}));
var vf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(vf || (vf = {}));
var _n;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(_n || (_n = {}));
var If;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(If || (If = {}));
var kf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(kf || (kf = {}));
var Lf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Lf || (Lf = {}));
var Cf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Cf || (Cf = {}));
var Bf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Bf || (Bf = {}));
var Tf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Tf || (Tf = {}));
var Mf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Mf || (Mf = {}));
var _f;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_f || (_f = {}));
var Nf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Nf || (Nf = {}));
function Tc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Dm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function z0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Fm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Tc(t.outputLen), Tc(t.blockLen);
}
function jm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function zm(t, e) {
  z0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fr = {
  number: Tc,
  bool: Dm,
  bytes: z0,
  hash: Fm,
  exists: jm,
  output: zm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ja = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fn = (t, e) => t << 32 - e | t >>> e, Rm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Rm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function jl(t) {
  if (typeof t == "string" && (t = Gm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let R0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ws(t) {
  const e = (r) => t().update(jl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let G0 = class extends R0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Fr.hash(e);
    const r = jl(n);
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
    return Fr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Fr.exists(this), Fr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const K0 = (t, e, n) => new G0(t, e).update(n).digest();
K0.create = (t, e) => new G0(t, e);
function Km(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let zl = class extends R0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ja(this.buffer);
  }
  update(e) {
    Fr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = jl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ja(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fr.exists(this), Fr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Km(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ja(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const Vm = (t, e, n) => t & e ^ ~t & n, qm = (t, e, n) => t & e ^ t & n ^ e & n, Wm = new Uint32Array([
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
]), tr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), er = new Uint32Array(64);
let V0 = class extends zl {
  constructor() {
    super(64, 32, 8, !1), this.A = tr[0] | 0, this.B = tr[1] | 0, this.C = tr[2] | 0, this.D = tr[3] | 0, this.E = tr[4] | 0, this.F = tr[5] | 0, this.G = tr[6] | 0, this.H = tr[7] | 0;
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
      er[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = er[l - 15], h = er[l - 2], b = fn(g, 7) ^ fn(g, 18) ^ g >>> 3, m = fn(h, 17) ^ fn(h, 19) ^ h >>> 10;
      er[l] = m + er[l - 7] + b + er[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = fn(a, 6) ^ fn(a, 11) ^ fn(a, 25), h = d + g + Vm(a, c, f) + Wm[l] + er[l] | 0, m = (fn(r, 2) ^ fn(r, 13) ^ fn(r, 22)) + qm(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    er.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Xm = class extends V0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const q0 = ws(() => new V0());
ws(() => new Xm());
var bs = {}, Rl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Vi;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const b = n.indexOf(o[h]) >> f;
        let m = 0;
        h !== 0 && (m = n.indexOf(o[h - 1]));
        const k = 1 + f, S = m % (1 << k) << 5 - k, T = t.c32[b + S];
        f = k, c.unshift(T);
      } else
        f = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let b = 0; b < h; b++)
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
    const c = o.match(`^${t.c32[0]}*`), f = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const S = (t.c32.indexOf(o[m]) << g) + l, T = n[S % 16];
      if (g += 1, l = S >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(T);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let m = 0; m < d.length && d[m] === "0"; m++)
      h++;
    d = d.slice(h - h % 2);
    let b = d.join("");
    for (let m = 0; m < f; m++)
      b = `00${b}`;
    if (a) {
      const m = a * 2 - b.length;
      for (let k = 0; k < m; k += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = i;
})(Rl);
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.c32checkDecode = Jr.c32checkEncode = void 0;
const Uf = xa, Pf = Vi, vi = Rl;
function W0(t) {
  const e = (0, Uf.sha256)((0, Uf.sha256)((0, Pf.hexToBytes)(t)));
  return (0, Pf.bytesToHex)(e.slice(0, 4));
}
function Ym(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = W0(`${n}${e}`), s = (0, vi.c32encode)(`${e}${r}`);
  return `${vi.c32[t]}${s}`;
}
Jr.c32checkEncode = Ym;
function Zm(t) {
  t = (0, vi.c32normalize)(t);
  const e = (0, vi.c32decode)(t.slice(1)), n = t[0], r = vi.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), W0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Jr.c32checkDecode = Zm;
var X0 = {}, Qs = {};
Object.defineProperty(Qs, "__esModule", { value: !0 });
Qs.decode = Qs.encode = void 0;
const Xo = xa, Hf = Vi, Y0 = r0, Z0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Qm(t, e = "00") {
  const n = typeof t == "string" ? (0, Hf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Hf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Xo.sha256)((0, Xo.sha256)(new Uint8Array([...r, ...n])));
  return Y0(Z0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Qs.encode = Qm;
function Jm(t) {
  const e = Y0(Z0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Xo.sha256)((0, Xo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Qs.decode = Jm;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Jr, n = Qs, r = Vi;
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
  function o(d, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(d, l)}`;
  }
  t.c32address = o;
  function a(d) {
    if (d.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (d[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(d.slice(1));
  }
  t.c32addressDecode = a;
  function c(d, l = -1) {
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let m;
    return l < 0 ? (m = b, s[b] !== void 0 && (m = s[b])) : m = l, o(m, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], b = g[1];
    let m;
    l < 0 ? (m = h, i[h] !== void 0 && (m = i[h])) : m = l;
    let k = m.toString(16);
    return k.length === 1 && (k = `0${k}`), n.encode(b, k);
  }
  t.c32ToB58 = f;
})(X0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Rl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Jr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = X0;
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
})(bs);
function t2(t, e) {
  switch (e = j0(e ?? F0), t) {
    case _n.P2PKH:
      switch (e.transactionVersion) {
        case Un.Mainnet:
          return bn.MainnetSingleSig;
        case Un.Testnet:
          return bn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case _n.P2SH:
    case _n.P2SHNonSequential:
    case _n.P2WPKH:
    case _n.P2WSH:
    case _n.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Un.Mainnet:
          return bn.MainnetMultiSig;
        case Un.Testnet:
          return bn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const e2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Q0 = Uint8Array.from({ length: 16 }, (t, e) => e), n2 = Q0.map((t) => (9 * t + 5) % 16);
let Gl = [Q0], Kl = [n2];
for (let t = 0; t < 4; t++)
  for (let e of [Gl, Kl])
    e.push(e[t].map((n) => e2[n]));
const J0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), r2 = Gl.map((t, e) => t.map((n) => J0[e][n])), s2 = Kl.map((t, e) => t.map((n) => J0[e][n])), i2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), o2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), uo = (t, e) => t << e | t >>> 32 - e;
function Of(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fo = new Uint32Array(16);
let a2 = class extends zl {
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
      fo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = i2[h], k = o2[h], S = Gl[h], T = Kl[h], w = r2[h], C = s2[h];
      for (let I = 0; I < 16; I++) {
        const O = uo(r + Of(h, i, a, f) + fo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = uo(a, 10) | 0, a = i, i = O;
      }
      for (let I = 0; I < 16; I++) {
        const O = uo(s + Of(b, o, c, d) + fo[T[I]] + k, C[I]) + g | 0;
        s = g, g = d, d = uo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const c2 = ws(() => new a2()), ho = BigInt(2 ** 32 - 1), Mc = BigInt(32);
function tp(t, e = !1) {
  return e ? { h: Number(t & ho), l: Number(t >> Mc & ho) } : { h: Number(t >> Mc & ho) | 0, l: Number(t & ho) | 0 };
}
function l2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = tp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const u2 = (t, e) => BigInt(t >>> 0) << Mc | BigInt(e >>> 0), f2 = (t, e, n) => t >>> n, d2 = (t, e, n) => t << 32 - n | e >>> n, h2 = (t, e, n) => t >>> n | e << 32 - n, p2 = (t, e, n) => t << 32 - n | e >>> n, g2 = (t, e, n) => t << 64 - n | e >>> n - 32, y2 = (t, e, n) => t >>> n - 32 | e << 64 - n, w2 = (t, e) => e, b2 = (t, e) => t, m2 = (t, e, n) => t << n | e >>> 32 - n, x2 = (t, e, n) => e << n | t >>> 32 - n, S2 = (t, e, n) => e << n - 32 | t >>> 64 - n, E2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function A2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), v2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, I2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), k2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, L2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), C2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, yt = {
  fromBig: tp,
  split: l2,
  toBig: u2,
  shrSH: f2,
  shrSL: d2,
  rotrSH: h2,
  rotrSL: p2,
  rotrBH: g2,
  rotrBL: y2,
  rotr32H: w2,
  rotr32L: b2,
  rotlSH: m2,
  rotlSL: x2,
  rotlBH: S2,
  rotlBL: E2,
  add: A2,
  add3L: $2,
  add3H: v2,
  add4L: I2,
  add4H: k2,
  add5H: C2,
  add5L: L2
}, [B2, T2] = yt.split([
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
].map((t) => BigInt(t))), nr = new Uint32Array(80), rr = new Uint32Array(80);
let Aa = class extends zl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: k } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = k | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      nr[w] = e.getUint32(n), rr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const C = nr[w - 15] | 0, I = rr[w - 15] | 0, O = yt.rotrSH(C, I, 1) ^ yt.rotrSH(C, I, 8) ^ yt.shrSH(C, I, 7), X = yt.rotrSL(C, I, 1) ^ yt.rotrSL(C, I, 8) ^ yt.shrSL(C, I, 7), F = nr[w - 2] | 0, U = rr[w - 2] | 0, x = yt.rotrSH(F, U, 19) ^ yt.rotrBH(F, U, 61) ^ yt.shrSH(F, U, 6), B = yt.rotrSL(F, U, 19) ^ yt.rotrBL(F, U, 61) ^ yt.shrSL(F, U, 6), P = yt.add4L(X, B, rr[w - 7], rr[w - 16]), Z = yt.add4H(P, O, x, nr[w - 7], nr[w - 16]);
      nr[w] = Z | 0, rr[w] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: k, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const C = yt.rotrSH(l, g, 14) ^ yt.rotrSH(l, g, 18) ^ yt.rotrBH(l, g, 41), I = yt.rotrSL(l, g, 14) ^ yt.rotrSL(l, g, 18) ^ yt.rotrBL(l, g, 41), O = l & h ^ ~l & m, X = g & b ^ ~g & k, F = yt.add5L(T, I, X, T2[w], rr[w]), U = yt.add5H(F, S, C, O, B2[w], nr[w]), x = F | 0, B = yt.rotrSH(r, s, 28) ^ yt.rotrBH(r, s, 34) ^ yt.rotrBH(r, s, 39), P = yt.rotrSL(r, s, 28) ^ yt.rotrBL(r, s, 34) ^ yt.rotrBL(r, s, 39), Z = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      S = m | 0, T = k | 0, m = h | 0, k = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = yt.add(f | 0, d | 0, U | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = yt.add3L(x, P, Q);
      r = yt.add3H(Y, U, B, Z), s = Y | 0;
    }
    ({ h: r, l: s } = yt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = yt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = yt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = yt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = yt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = yt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: k } = yt.add(this.Gh | 0, this.Gl | 0, m | 0, k | 0), { h: S, l: T } = yt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, k, S, T);
  }
  roundClean() {
    nr.fill(0), rr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, M2 = class extends Aa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _2 = class extends Aa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N2 = class extends Aa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ws(() => new Aa());
ws(() => new M2());
ws(() => new _2());
ws(() => new N2());
var Yo = { exports: {} };
Yo.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", m = "[object Promise]", k = "[object RegExp]", S = "[object Set]", T = "[object String]", w = "[object Symbol]", C = "[object WeakMap]", I = "[object ArrayBuffer]", O = "[object DataView]", X = "[object Float32Array]", F = "[object Float64Array]", U = "[object Int8Array]", x = "[object Int16Array]", B = "[object Int32Array]", P = "[object Uint8Array]", Z = "[object Uint8ClampedArray]", Q = "[object Uint16Array]", Y = "[object Uint32Array]", Ht = /[\\^$.*+?()[\]{}|]/g, oe = /\w*$/, ne = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, N = {};
  N[i] = N[o] = N[I] = N[O] = N[a] = N[c] = N[X] = N[F] = N[U] = N[x] = N[B] = N[g] = N[h] = N[b] = N[k] = N[S] = N[T] = N[w] = N[P] = N[Z] = N[Q] = N[Y] = !0, N[f] = N[d] = N[C] = !1;
  var it = typeof ve == "object" && ve && ve.Object === Object && ve, dt = typeof self == "object" && self && self.Object === Object && self, ut = it || dt || Function("return this")(), It = e && !e.nodeType && e, Tt = It && !0 && t && !t.nodeType && t, Qt = Tt && Tt.exports === It;
  function Nt(p, $) {
    return p.set($[0], $[1]), p;
  }
  function me(p, $) {
    return p.add($), p;
  }
  function Ze(p, $) {
    for (var _ = -1, tt = p ? p.length : 0; ++_ < tt && $(p[_], _, p) !== !1; )
      ;
    return p;
  }
  function M(p, $) {
    for (var _ = -1, tt = $.length, fe = p.length; ++_ < tt; )
      p[fe + _] = $[_];
    return p;
  }
  function R(p, $, _, tt) {
    for (var fe = -1, Ce = p ? p.length : 0; ++fe < Ce; )
      _ = $(_, p[fe], fe, p);
    return _;
  }
  function j(p, $) {
    for (var _ = -1, tt = Array(p); ++_ < p; )
      tt[_] = $(_);
    return tt;
  }
  function at(p, $) {
    return p == null ? void 0 : p[$];
  }
  function lt(p) {
    var $ = !1;
    if (p != null && typeof p.toString != "function")
      try {
        $ = !!(p + "");
      } catch {
      }
    return $;
  }
  function Et(p) {
    var $ = -1, _ = Array(p.size);
    return p.forEach(function(tt, fe) {
      _[++$] = [fe, tt];
    }), _;
  }
  function Lt(p, $) {
    return function(_) {
      return p($(_));
    };
  }
  function jt(p) {
    var $ = -1, _ = Array(p.size);
    return p.forEach(function(tt) {
      _[++$] = tt;
    }), _;
  }
  var ue = Array.prototype, xe = Function.prototype, u = Object.prototype, E = ut["__core-js_shared__"], v = function() {
    var p = /[^.]+$/.exec(E && E.keys && E.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), q = xe.toString, nt = u.hasOwnProperty, st = u.toString, Gt = RegExp(
    "^" + q.call(nt).replace(Ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), zt = Qt ? ut.Buffer : void 0, ke = ut.Symbol, Lr = ut.Uint8Array, Cr = Lt(Object.getPrototypeOf, Object), Br = Object.create, Xt = u.propertyIsEnumerable, As = ue.splice, Bt = Object.getOwnPropertySymbols, ct = zt ? zt.isBuffer : void 0, Mt = Lt(Object.keys, Object), Kt = Ls(ut, "DataView"), pe = Ls(ut, "Map"), Qe = Ls(ut, "Promise"), kn = Ls(ut, "Set"), Ne = Ls(ut, "WeakMap"), Se = Ls(Object, "create"), Tr = Nr(Kt), pi = Nr(pe), $s = Nr(Qe), vs = Nr(kn), Ge = Nr(Ne), Fn = ke ? ke.prototype : void 0, Mr = Fn ? Fn.valueOf : void 0;
  function Le(p) {
    var $ = -1, _ = p ? p.length : 0;
    for (this.clear(); ++$ < _; ) {
      var tt = p[$];
      this.set(tt[0], tt[1]);
    }
  }
  function jn() {
    this.__data__ = Se ? Se(null) : {};
  }
  function zn(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Rn(p) {
    var $ = this.__data__;
    if (Se) {
      var _ = $[p];
      return _ === r ? void 0 : _;
    }
    return nt.call($, p) ? $[p] : void 0;
  }
  function Is(p) {
    var $ = this.__data__;
    return Se ? $[p] !== void 0 : nt.call($, p);
  }
  function z(p, $) {
    var _ = this.__data__;
    return _[p] = Se && $ === void 0 ? r : $, this;
  }
  Le.prototype.clear = jn, Le.prototype.delete = zn, Le.prototype.get = Rn, Le.prototype.has = Is, Le.prototype.set = z;
  function D(p) {
    var $ = -1, _ = p ? p.length : 0;
    for (this.clear(); ++$ < _; ) {
      var tt = p[$];
      this.set(tt[0], tt[1]);
    }
  }
  function ce() {
    this.__data__ = [];
  }
  function ge(p) {
    var $ = this.__data__, _ = Ot($, p);
    if (_ < 0)
      return !1;
    var tt = $.length - 1;
    return _ == tt ? $.pop() : As.call($, _, 1), !0;
  }
  function Gn(p) {
    var $ = this.__data__, _ = Ot($, p);
    return _ < 0 ? void 0 : $[_][1];
  }
  function ks(p) {
    return Ot(this.__data__, p) > -1;
  }
  function Kn(p, $) {
    var _ = this.__data__, tt = Ot(_, p);
    return tt < 0 ? _.push([p, $]) : _[tt][1] = $, this;
  }
  D.prototype.clear = ce, D.prototype.delete = ge, D.prototype.get = Gn, D.prototype.has = ks, D.prototype.set = Kn;
  function Vn(p) {
    var $ = -1, _ = p ? p.length : 0;
    for (this.clear(); ++$ < _; ) {
      var tt = p[$];
      this.set(tt[0], tt[1]);
    }
  }
  function gi() {
    this.__data__ = {
      hash: new Le(),
      map: new (pe || D)(),
      string: new Le()
    };
  }
  function Da(p) {
    return Zi(this, p).delete(p);
  }
  function Fa(p) {
    return Zi(this, p).get(p);
  }
  function yi(p) {
    return Zi(this, p).has(p);
  }
  function ja(p, $) {
    return Zi(this, p).set(p, $), this;
  }
  Vn.prototype.clear = gi, Vn.prototype.delete = Da, Vn.prototype.get = Fa, Vn.prototype.has = yi, Vn.prototype.set = ja;
  function y(p) {
    this.__data__ = new D(p);
  }
  function L() {
    this.__data__ = new D();
  }
  function G(p) {
    return this.__data__.delete(p);
  }
  function J(p) {
    return this.__data__.get(p);
  }
  function ot(p) {
    return this.__data__.has(p);
  }
  function W(p, $) {
    var _ = this.__data__;
    if (_ instanceof D) {
      var tt = _.__data__;
      if (!pe || tt.length < n - 1)
        return tt.push([p, $]), this;
      _ = this.__data__ = new Vn(tt);
    }
    return _.set(p, $), this;
  }
  y.prototype.clear = L, y.prototype.delete = G, y.prototype.get = J, y.prototype.has = ot, y.prototype.set = W;
  function ft(p, $) {
    var _ = Ra(p) || Cy(p) ? j(p.length, String) : [], tt = _.length, fe = !!tt;
    for (var Ce in p)
      nt.call(p, Ce) && !(fe && (Ce == "length" || vy(Ce, tt))) && _.push(Ce);
    return _;
  }
  function At(p, $, _) {
    var tt = p[$];
    (!(nt.call(p, $) && Ou(tt, _)) || _ === void 0 && !($ in p)) && (p[$] = _);
  }
  function Ot(p, $) {
    for (var _ = p.length; _--; )
      if (Ou(p[_][0], $))
        return _;
    return -1;
  }
  function cn(p, $) {
    return p && Uu($, Ga($), p);
  }
  function ye(p, $, _, tt, fe, Ce, Ln) {
    var Be;
    if (tt && (Be = Ce ? tt(p, fe, Ce, Ln) : tt(p)), Be !== void 0)
      return Be;
    if (!Qi(p))
      return p;
    var ju = Ra(p);
    if (ju) {
      if (Be = Ey(p), !$)
        return my(p, Be);
    } else {
      var Cs = _r(p), zu = Cs == d || Cs == l;
      if (Ty(p))
        return dy(p, $);
      if (Cs == b || Cs == i || zu && !Ce) {
        if (lt(p))
          return Ce ? p : {};
        if (Be = Ay(zu ? {} : p), !$)
          return xy(p, cn(Be, p));
      } else {
        if (!N[Cs])
          return Ce ? p : {};
        Be = $y(p, Cs, ye, $);
      }
    }
    Ln || (Ln = new y());
    var Ru = Ln.get(p);
    if (Ru)
      return Ru;
    if (Ln.set(p, Be), !ju)
      var Gu = _ ? Sy(p) : Ga(p);
    return Ze(Gu || p, function(Ka, Ji) {
      Gu && (Ji = Ka, Ka = p[Ji]), At(Be, Ji, ye(Ka, $, _, tt, Ji, p, Ln));
    }), Be;
  }
  function Ue(p) {
    return Qi(p) ? Br(p) : {};
  }
  function ln(p, $, _) {
    var tt = $(p);
    return Ra(p) ? tt : M(tt, _(p));
  }
  function ly(p) {
    return st.call(p);
  }
  function uy(p) {
    if (!Qi(p) || ky(p))
      return !1;
    var $ = Fu(p) || lt(p) ? Gt : ne;
    return $.test(Nr(p));
  }
  function fy(p) {
    if (!Hu(p))
      return Mt(p);
    var $ = [];
    for (var _ in Object(p))
      nt.call(p, _) && _ != "constructor" && $.push(_);
    return $;
  }
  function dy(p, $) {
    if ($)
      return p.slice();
    var _ = new p.constructor(p.length);
    return p.copy(_), _;
  }
  function za(p) {
    var $ = new p.constructor(p.byteLength);
    return new Lr($).set(new Lr(p)), $;
  }
  function hy(p, $) {
    var _ = $ ? za(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.byteLength);
  }
  function py(p, $, _) {
    var tt = $ ? _(Et(p), !0) : Et(p);
    return R(tt, Nt, new p.constructor());
  }
  function gy(p) {
    var $ = new p.constructor(p.source, oe.exec(p));
    return $.lastIndex = p.lastIndex, $;
  }
  function yy(p, $, _) {
    var tt = $ ? _(jt(p), !0) : jt(p);
    return R(tt, me, new p.constructor());
  }
  function wy(p) {
    return Mr ? Object(Mr.call(p)) : {};
  }
  function by(p, $) {
    var _ = $ ? za(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.length);
  }
  function my(p, $) {
    var _ = -1, tt = p.length;
    for ($ || ($ = Array(tt)); ++_ < tt; )
      $[_] = p[_];
    return $;
  }
  function Uu(p, $, _, tt) {
    _ || (_ = {});
    for (var fe = -1, Ce = $.length; ++fe < Ce; ) {
      var Ln = $[fe], Be = void 0;
      At(_, Ln, Be === void 0 ? p[Ln] : Be);
    }
    return _;
  }
  function xy(p, $) {
    return Uu(p, Pu(p), $);
  }
  function Sy(p) {
    return ln(p, Ga, Pu);
  }
  function Zi(p, $) {
    var _ = p.__data__;
    return Iy($) ? _[typeof $ == "string" ? "string" : "hash"] : _.map;
  }
  function Ls(p, $) {
    var _ = at(p, $);
    return uy(_) ? _ : void 0;
  }
  var Pu = Bt ? Lt(Bt, Object) : Ny, _r = ly;
  (Kt && _r(new Kt(new ArrayBuffer(1))) != O || pe && _r(new pe()) != g || Qe && _r(Qe.resolve()) != m || kn && _r(new kn()) != S || Ne && _r(new Ne()) != C) && (_r = function(p) {
    var $ = st.call(p), _ = $ == b ? p.constructor : void 0, tt = _ ? Nr(_) : void 0;
    if (tt)
      switch (tt) {
        case Tr:
          return O;
        case pi:
          return g;
        case $s:
          return m;
        case vs:
          return S;
        case Ge:
          return C;
      }
    return $;
  });
  function Ey(p) {
    var $ = p.length, _ = p.constructor($);
    return $ && typeof p[0] == "string" && nt.call(p, "index") && (_.index = p.index, _.input = p.input), _;
  }
  function Ay(p) {
    return typeof p.constructor == "function" && !Hu(p) ? Ue(Cr(p)) : {};
  }
  function $y(p, $, _, tt) {
    var fe = p.constructor;
    switch ($) {
      case I:
        return za(p);
      case a:
      case c:
        return new fe(+p);
      case O:
        return hy(p, tt);
      case X:
      case F:
      case U:
      case x:
      case B:
      case P:
      case Z:
      case Q:
      case Y:
        return by(p, tt);
      case g:
        return py(p, tt, _);
      case h:
      case T:
        return new fe(p);
      case k:
        return gy(p);
      case S:
        return yy(p, tt, _);
      case w:
        return wy(p);
    }
  }
  function vy(p, $) {
    return $ = $ ?? s, !!$ && (typeof p == "number" || A.test(p)) && p > -1 && p % 1 == 0 && p < $;
  }
  function Iy(p) {
    var $ = typeof p;
    return $ == "string" || $ == "number" || $ == "symbol" || $ == "boolean" ? p !== "__proto__" : p === null;
  }
  function ky(p) {
    return !!v && v in p;
  }
  function Hu(p) {
    var $ = p && p.constructor, _ = typeof $ == "function" && $.prototype || u;
    return p === _;
  }
  function Nr(p) {
    if (p != null) {
      try {
        return q.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Ly(p) {
    return ye(p, !0, !0);
  }
  function Ou(p, $) {
    return p === $ || p !== p && $ !== $;
  }
  function Cy(p) {
    return By(p) && nt.call(p, "callee") && (!Xt.call(p, "callee") || st.call(p) == i);
  }
  var Ra = Array.isArray;
  function Du(p) {
    return p != null && My(p.length) && !Fu(p);
  }
  function By(p) {
    return _y(p) && Du(p);
  }
  var Ty = ct || Uy;
  function Fu(p) {
    var $ = Qi(p) ? st.call(p) : "";
    return $ == d || $ == l;
  }
  function My(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Qi(p) {
    var $ = typeof p;
    return !!p && ($ == "object" || $ == "function");
  }
  function _y(p) {
    return !!p && typeof p == "object";
  }
  function Ga(p) {
    return Du(p) ? ft(p) : fy(p);
  }
  function Ny() {
    return [];
  }
  function Uy() {
    return !1;
  }
  t.exports = Ly;
})(Yo, Yo.exports);
var U2 = Yo.exports;
const ep = /* @__PURE__ */ kh(U2);
var _c;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_c || (_c = {}));
function P2(t, e) {
  return { type: _c.Address, version: t, hash160: e };
}
function H2(t) {
  return bs.c32address(t.version, t.hash160);
}
const O2 = (t) => c2(q0(t)), D2 = (t) => rt(O2(t));
ee.hmacSha256Sync = (t, ...e) => {
  const n = K0.create(q0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F2(t, e = "mainnet") {
  e = j0(e), t = typeof t == "string" ? Ct(t) : t;
  const n = t2(_n.P2PKH, e), r = P2(n, D2(t));
  return H2(r);
}
function j2(t, e) {
  const n = he.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = F2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new he.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function z2(t, e = null) {
  let n;
  e ? n = j2(t, e) : n = he.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Df = "_blockstackDidCheckEchoReply", R2 = "echoReply", G2 = "authContinuation";
function K2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function V2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Df];
  if (typeof e == "boolean")
    return e;
  const n = K2(t.location.search), r = n[R2];
  if (r) {
    t[Df] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[G2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Nc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Ph();
    else
      throw new fw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new xf(e.sessionOptions) : this.store = new xf() : e ? this.store = new mf(e.sessionOptions) : this.store = new mf();
  }
  makeAuthRequestToken(e, n, r, s, i, o = hw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new xc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Tm(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Bm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = vl("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (V2())
        return Us.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Us.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Pw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new to("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = he.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Pm(e))
      throw new to("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (qa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await wf(s, i.private_key);
          } catch {
            if (Us.warn("Failed decryption of appPrivateKey, will try to use as given"), !ee.isValidPrivateKey(i.private_key))
              throw new to("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await wf(s, c);
          } catch {
            Us.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new to("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = vw, d;
    qa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), qa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: O0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, cw);
      else {
        const b = await h.text(), m = JSON.parse(b);
        l.profile = z2(m[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new xc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), v1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), I1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Nc.prototype.makeAuthRequest = Nc.prototype.makeAuthRequestToken;
const q2 = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], W2 = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = q2(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!$a(r.id));
  return e.concat(n);
}, $a = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), np = "STX_PROVIDER", ts = () => typeof window > "u" ? null : window.localStorage.getItem(np), X2 = (t) => {
  typeof window < "u" && window.localStorage.setItem(np, t);
}, Y2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Z2(t, e) {
  const n = {};
  return Object.assign(n, Y2, e), await fetch(t, n);
}
function Q2(t) {
  let e = Z2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function J2(...t) {
  const { fetchLib: e, middlewares: n } = Q2(t);
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
var Js;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Js || (Js = {}));
var es;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(es || (es = {}));
var Ff;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ff || (Ff = {}));
const tx = "https://api.mainnet.hiro.so", ex = "https://api.testnet.hiro.so", nx = "http://localhost:3999", rx = ["mainnet", "testnet", "devnet", "mocknet"];
class ns {
  constructor(e) {
    this.version = es.Mainnet, this.chainId = Js.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === es.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? J2();
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
ns.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Uc();
    case "testnet":
      return new Pc();
    case "devnet":
      return new sx();
    case "mocknet":
      return new rp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${rx.join(", ")}`);
  }
};
ns.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ns.fromName(t);
class Uc extends ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? tx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = es.Mainnet, this.chainId = Js.Mainnet;
  }
}
class Pc extends ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = es.Testnet, this.chainId = Js.Testnet;
  }
}
class rp extends ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? nx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = es.Testnet, this.chainId = Js.Testnet;
  }
}
const sx = rp;
var rs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(rs || (rs = {}));
var Zo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zo || (Zo = {}));
rs.Mainnet;
var ss;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ss || (ss = {}));
var is;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(is || (is = {}));
ss.Mainnet;
const ix = {
  chainId: rs.Mainnet,
  transactionVersion: ss.Mainnet,
  peerNetworkId: Zo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: is.MainnetSingleSig,
    multiSig: is.MainnetMultiSig
  },
  client: { baseUrl: _h }
}, Hc = {
  chainId: rs.Testnet,
  transactionVersion: ss.Testnet,
  peerNetworkId: Zo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: is.TestnetSingleSig,
    multiSig: is.TestnetMultiSig
  },
  client: { baseUrl: Nh }
}, Uo = {
  ...Hc,
  addressVersion: { ...Hc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Uh }
}, ox = {
  ...Uo,
  addressVersion: { ...Uo.addressVersion },
  client: { ...Uo.client }
};
function ax(t) {
  switch (t) {
    case "mainnet":
      return ix;
    case "testnet":
      return Hc;
    case "devnet":
      return Uo;
    case "mocknet":
      return ox;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function cx(t) {
  return typeof t == "string" ? ax(t) : t;
}
function lx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const jf = /* @__PURE__ */ new Map();
function sp(t, e) {
  const n = jf.get(t);
  if (n !== void 0)
    return n(e);
  const r = lx(t);
  return jf.set(t, r), sp(t, e);
}
let Rt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Ct(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Mw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Bw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Lw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = rt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = rt(n);
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
    if (sp(e, r))
      return r;
    throw n(r);
  }
};
const ux = 128, fx = 128, ip = 16, Kr = 32, Oc = 80, va = 65, dx = 32, hx = 64, Qo = 34, px = 1 + 16 * 1024 * 1024, gx = 165, yx = 16, wx = 16, bx = 20, mx = wx + 2 + bx, xx = mx + 4, Sx = px + (gx + yx * xx);
var Ut;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ut || (Ut = {}));
var Dc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Dc || (Dc = {}));
var He;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(He || (He = {}));
const tc = ["onChainOnly", "offChainOnly", "any"];
tc[0] + "", He.OnChainOnly, tc[1] + "", He.OffChainOnly, tc[2] + "", He.Any, He.OnChainOnly + "", He.OnChainOnly, He.OffChainOnly + "", He.OffChainOnly, He.Any + "", He.Any;
var Jo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Jo || (Jo = {}));
var Vt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Vt || (Vt = {}));
var Jt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Jt || (Jt = {}));
var Dt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Dt || (Dt = {}));
var Yt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Yt || (Yt = {}));
var Ii;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ii || (Ii = {}));
var Fc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Fc || (Fc = {}));
var jc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(jc || (jc = {}));
var $e;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($e || ($e = {}));
var zf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zf || (zf = {}));
var zc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(zc || (zc = {}));
var nn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nn || (nn = {}));
var Rf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Rf || (Rf = {}));
let Ia = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ps = class extends Ia {
  constructor(e) {
    super(e);
  }
}, Ee = class extends Ia {
  constructor(e) {
    super(e);
  }
}, ta = class extends Ia {
  constructor(e) {
    super(e);
  }
}, jr = class extends Ia {
  constructor(e) {
    super(e);
  }
};
function Rc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ex(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ax(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rc(t.outputLen), Rc(t.blockLen);
}
function $x(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vx(t, e) {
  op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zr = {
  number: Rc,
  bool: Ex,
  bytes: op,
  hash: Ax,
  exists: $x,
  output: vx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ec = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dn = (t, e) => t << 32 - e | t >>> e, Ix = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ix)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Vl(t) {
  if (typeof t == "string" && (t = kx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ap = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ms(t) {
  const e = (r) => t().update(Vl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let cp = class extends ap {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zr.hash(e);
    const r = Vl(n);
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
    return zr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    zr.exists(this), zr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const lp = (t, e, n) => new cp(t, e).update(n).digest();
lp.create = (t, e) => new cp(t, e);
function Lx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let ql = class extends ap {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ec(this.buffer);
  }
  update(e) {
    zr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Vl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ec(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zr.exists(this), zr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Lx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ec(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const Cx = (t, e, n) => t & e ^ ~t & n, Bx = (t, e, n) => t & e ^ t & n ^ e & n, Tx = new Uint32Array([
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
]), sr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ir = new Uint32Array(64);
let up = class extends ql {
  constructor() {
    super(64, 32, 8, !1), this.A = sr[0] | 0, this.B = sr[1] | 0, this.C = sr[2] | 0, this.D = sr[3] | 0, this.E = sr[4] | 0, this.F = sr[5] | 0, this.G = sr[6] | 0, this.H = sr[7] | 0;
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
      ir[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ir[l - 15], h = ir[l - 2], b = dn(g, 7) ^ dn(g, 18) ^ g >>> 3, m = dn(h, 17) ^ dn(h, 19) ^ h >>> 10;
      ir[l] = m + ir[l - 7] + b + ir[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = dn(a, 6) ^ dn(a, 11) ^ dn(a, 25), h = d + g + Cx(a, c, f) + Tx[l] + ir[l] | 0, m = (dn(r, 2) ^ dn(r, 13) ^ dn(r, 22)) + Bx(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    ir.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Mx = class extends up {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Wl = ms(() => new up());
ms(() => new Mx());
const _x = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fp = Uint8Array.from({ length: 16 }, (t, e) => e), Nx = fp.map((t) => (9 * t + 5) % 16);
let Xl = [fp], Yl = [Nx];
for (let t = 0; t < 4; t++)
  for (let e of [Xl, Yl])
    e.push(e[t].map((n) => _x[n]));
const dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ux = Xl.map((t, e) => t.map((n) => dp[e][n])), Px = Yl.map((t, e) => t.map((n) => dp[e][n])), Hx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ox = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), po = (t, e) => t << e | t >>> 32 - e;
function Gf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const go = new Uint32Array(16);
let Dx = class extends ql {
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
      go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = Hx[h], k = Ox[h], S = Xl[h], T = Yl[h], w = Ux[h], C = Px[h];
      for (let I = 0; I < 16; I++) {
        const O = po(r + Gf(h, i, a, f) + go[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = po(a, 10) | 0, a = i, i = O;
      }
      for (let I = 0; I < 16; I++) {
        const O = po(s + Gf(b, o, c, d) + go[T[I]] + k, C[I]) + g | 0;
        s = g, g = d, d = po(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Fx = ms(() => new Dx()), yo = BigInt(2 ** 32 - 1), Gc = BigInt(32);
function hp(t, e = !1) {
  return e ? { h: Number(t & yo), l: Number(t >> Gc & yo) } : { h: Number(t >> Gc & yo) | 0, l: Number(t & yo) | 0 };
}
function jx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const zx = (t, e) => BigInt(t >>> 0) << Gc | BigInt(e >>> 0), Rx = (t, e, n) => t >>> n, Gx = (t, e, n) => t << 32 - n | e >>> n, Kx = (t, e, n) => t >>> n | e << 32 - n, Vx = (t, e, n) => t << 32 - n | e >>> n, qx = (t, e, n) => t << 64 - n | e >>> n - 32, Wx = (t, e, n) => t >>> n - 32 | e << 64 - n, Xx = (t, e) => e, Yx = (t, e) => t, Zx = (t, e, n) => t << n | e >>> 32 - n, Qx = (t, e, n) => e << n | t >>> 32 - n, Jx = (t, e, n) => e << n - 32 | t >>> 64 - n, tS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function eS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const nS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), rS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, sS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), iS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, oS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), aS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, wt = {
  fromBig: hp,
  split: jx,
  toBig: zx,
  shrSH: Rx,
  shrSL: Gx,
  rotrSH: Kx,
  rotrSL: Vx,
  rotrBH: qx,
  rotrBL: Wx,
  rotr32H: Xx,
  rotr32L: Yx,
  rotlSH: Zx,
  rotlSL: Qx,
  rotlBH: Jx,
  rotlBL: tS,
  add: eS,
  add3L: nS,
  add3H: rS,
  add4L: sS,
  add4H: iS,
  add5H: aS,
  add5L: oS
}, [cS, lS] = wt.split([
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
].map((t) => BigInt(t))), or = new Uint32Array(80), ar = new Uint32Array(80);
let ka = class extends ql {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: k } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = k | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      or[w] = e.getUint32(n), ar[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const C = or[w - 15] | 0, I = ar[w - 15] | 0, O = wt.rotrSH(C, I, 1) ^ wt.rotrSH(C, I, 8) ^ wt.shrSH(C, I, 7), X = wt.rotrSL(C, I, 1) ^ wt.rotrSL(C, I, 8) ^ wt.shrSL(C, I, 7), F = or[w - 2] | 0, U = ar[w - 2] | 0, x = wt.rotrSH(F, U, 19) ^ wt.rotrBH(F, U, 61) ^ wt.shrSH(F, U, 6), B = wt.rotrSL(F, U, 19) ^ wt.rotrBL(F, U, 61) ^ wt.shrSL(F, U, 6), P = wt.add4L(X, B, ar[w - 7], ar[w - 16]), Z = wt.add4H(P, O, x, or[w - 7], or[w - 16]);
      or[w] = Z | 0, ar[w] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: k, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const C = wt.rotrSH(l, g, 14) ^ wt.rotrSH(l, g, 18) ^ wt.rotrBH(l, g, 41), I = wt.rotrSL(l, g, 14) ^ wt.rotrSL(l, g, 18) ^ wt.rotrBL(l, g, 41), O = l & h ^ ~l & m, X = g & b ^ ~g & k, F = wt.add5L(T, I, X, lS[w], ar[w]), U = wt.add5H(F, S, C, O, cS[w], or[w]), x = F | 0, B = wt.rotrSH(r, s, 28) ^ wt.rotrBH(r, s, 34) ^ wt.rotrBH(r, s, 39), P = wt.rotrSL(r, s, 28) ^ wt.rotrBL(r, s, 34) ^ wt.rotrBL(r, s, 39), Z = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      S = m | 0, T = k | 0, m = h | 0, k = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = wt.add(f | 0, d | 0, U | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = wt.add3L(x, P, Q);
      r = wt.add3H(Y, U, B, Z), s = Y | 0;
    }
    ({ h: r, l: s } = wt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = wt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = wt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = wt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = wt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = wt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: k } = wt.add(this.Gh | 0, this.Gl | 0, m | 0, k | 0), { h: S, l: T } = wt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, k, S, T);
  }
  roundClean() {
    or.fill(0), ar.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, uS = class extends ka {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, fS = class extends ka {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, dS = class extends ka {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ms(() => new ka());
ms(() => new uS());
const hS = ms(() => new fS());
ms(() => new dS());
var vt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(vt || (vt = {}));
var ae;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ae || (ae = {}));
function Zl(t) {
  return ae[t];
}
const pS = () => ({ type: vt.BoolTrue }), gS = () => ({ type: vt.BoolFalse }), yS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: vt.Buffer, value: rt(t) };
}, Kf = BigInt("0xffffffffffffffffffffffffffffffff"), wS = BigInt(0), Vf = BigInt("0x7fffffffffffffffffffffffffffffff"), qf = BigInt("-170141183460469231731687303715884105728"), bS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ec(Ct(t))), _e(t, Uint8Array) && (t = Ec(t));
  const e = be(t);
  if (e > Vf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Vf}`);
  if (e < qf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${qf}`);
  return { type: vt.Int, value: e };
}, mS = (t) => {
  const e = be(t);
  if (e < wS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Kf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Kf}`);
  return { type: vt.UInt, value: e };
};
function xS(t) {
  return { type: vt.List, value: t };
}
function pp() {
  return { type: vt.OptionalNone };
}
function gp(t) {
  return { type: vt.OptionalSome, value: t };
}
var V;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(V || (V = {}));
function SS() {
  return {
    type: V.Address,
    version: is.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Wf(t) {
  if (t && $p(t, Qo))
    throw new Error(`Memo exceeds maximum length of ${Qo} bytes`);
  return { type: V.MemoString, content: t };
}
function Ql(t, e) {
  return {
    type: V.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Kc(t) {
  if (Ct(t).byteLength != va)
    throw Error("Invalid signature");
  return {
    type: V.MessageSignature,
    data: t
  };
}
function ES(t, e, n) {
  return typeof t == "string" && (t = OS(t)), typeof n == "string" && (n = Wf(n)), {
    type: V.Payload,
    payloadType: Ut.TokenTransfer,
    recipient: t,
    amount: be(e),
    memo: n ?? Wf("")
  };
}
function AS(t, e, n, r) {
  return typeof e == "string" && (e = on(e)), typeof n == "string" && (n = on(n)), {
    type: V.Payload,
    payloadType: Ut.ContractCall,
    contractAddress: typeof t == "string" ? kr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function $S(t) {
  return on(t, 4, 1e5);
}
function Xf(t, e, n) {
  return typeof t == "string" && (t = on(t)), typeof e == "string" && (e = $S(e)), typeof n == "number" ? {
    type: V.Payload,
    payloadType: Ut.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: V.Payload,
    payloadType: Ut.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function vS() {
  return { type: V.Payload, payloadType: Ut.PoisonMicroblock };
}
function Yf(t, e) {
  if (t.byteLength != Kr)
    throw Error(`Coinbase buffer size must be ${Kr} bytes`);
  return e != null ? {
    type: V.Payload,
    payloadType: Ut.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: V.Payload,
    payloadType: Ut.Coinbase,
    coinbaseBytes: t
  };
}
function IS(t, e, n) {
  if (t.byteLength != Kr)
    throw Error(`Coinbase buffer size must be ${Kr} bytes`);
  if (n.byteLength != Oc)
    throw Error(`VRF proof buffer size must be ${Oc} bytes`);
  return {
    type: V.Payload,
    payloadType: Ut.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === vt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function kS(t, e, n, r, s, i, o) {
  return {
    type: V.Payload,
    payloadType: Ut.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function on(t, e, n) {
  const r = e || 1, s = n || ux;
  if ($p(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: V.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function LS(t, e, n) {
  return {
    type: V.Asset,
    address: kr(t),
    contractName: on(e),
    assetName: on(n)
  };
}
function kr(t) {
  const e = bs.c32addressDecode(t);
  return {
    type: V.Address,
    version: e[0],
    hash160: e[1]
  };
}
function CS(t, e) {
  const n = kr(t), r = on(e);
  return {
    type: V.Principal,
    prefix: $e.Contract,
    address: n,
    contractName: r
  };
}
function BS(t) {
  const e = kr(t);
  return {
    type: V.Principal,
    prefix: $e.Standard,
    address: e
  };
}
function Hs(t, e) {
  return {
    pubKeyEncoding: t,
    type: V.TransactionAuthField,
    contents: e
  };
}
function Tn(t) {
  switch (t.type) {
    case V.Address:
      return qi(t);
    case V.Principal:
      return yp(t);
    case V.LengthPrefixedString:
      return ei(t);
    case V.MemoString:
      return MS(t);
    case V.Asset:
      return bp(t);
    case V.PostCondition:
      return xp(t);
    case V.PublicKey:
      return Wc(t);
    case V.LengthPrefixedList:
      return Jl(t);
    case V.Payload:
      return Sp(t);
    case V.TransactionAuthField:
      return HS(t);
    case V.MessageSignature:
      return tu(t);
  }
}
function qi(t) {
  const e = [];
  return e.push(Ct(ji(t.version, 1))), e.push(Ct(t.hash160)), se(e);
}
function ti(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = da(rt(e.readBytes(1))), r = rt(e.readBytes(20));
  return { type: V.Address, version: n, hash160: r };
}
function yp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === $e.Standard || t.prefix === $e.Contract) && e.push(qi(t.address)), t.prefix === $e.Contract && e.push(ei(t.contractName)), se(e);
}
function TS(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum($e, (i) => {
    throw new Ee(`Unexpected Principal payload type: ${i}`);
  });
  if (n === $e.Origin)
    return { type: V.Principal, prefix: n };
  const r = ti(e);
  if (n === $e.Standard)
    return { type: V.Principal, prefix: n, address: r };
  const s = We(e);
  return {
    type: V.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ei(t) {
  const e = [], n = ps(t.content), r = n.byteLength;
  return e.push(Ct(ji(r, t.lengthPrefixBytes))), e.push(n), se(e);
}
function We(t, e, n) {
  e = e || 1;
  const r = _e(t, Rt) ? t : new Rt(t), s = da(rt(r.readBytes(e))), i = zi(r.readBytes(s));
  return on(i, e, n ?? 128);
}
function MS(t) {
  const e = [], n = ps(t.content), r = o3(rt(n), Qo * 2);
  return e.push(Ct(r)), se(e);
}
function wp(t) {
  const e = _e(t, Rt) ? t : new Rt(t);
  let n = zi(e.readBytes(Qo));
  return n = n.replace(/\u0000*$/, ""), { type: V.MemoString, content: n };
}
function bp(t) {
  const e = [];
  return e.push(qi(t.address)), e.push(ei(t.contractName)), e.push(ei(t.assetName)), se(e);
}
function Vc(t) {
  const e = _e(t, Rt) ? t : new Rt(t);
  return {
    type: V.Asset,
    address: ti(e),
    contractName: We(e),
    assetName: We(e)
  };
}
function Jl(t) {
  const e = t.values, n = [];
  n.push(Ct(ji(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Tn(r));
  return se(n);
}
function mp(t, e, n) {
  const r = _e(t, Rt) ? t : new Rt(t), s = da(rt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case V.Address:
        i.push(ti(r));
        break;
      case V.LengthPrefixedString:
        i.push(We(r));
        break;
      case V.MemoString:
        i.push(wp(r));
        break;
      case V.Asset:
        i.push(Vc(r));
        break;
      case V.PostCondition:
        i.push(NS(r));
        break;
      case V.PublicKey:
        i.push(Xc(r));
        break;
      case V.TransactionAuthField:
        i.push(PS(r));
        break;
    }
  return Ql(i, n);
}
function _S(t) {
  return rt(xp(t));
}
function xp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(yp(t.principal)), (t.conditionType === Vt.Fungible || t.conditionType === Vt.NonFungible) && e.push(bp(t.asset)), t.conditionType === Vt.NonFungible && e.push(mn(t.assetName)), e.push(t.conditionCode), t.conditionType === Vt.STX || t.conditionType === Vt.Fungible || t.conditionType === Vt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ps("The post-condition amount may not be larger than 8 bytes");
    e.push($r(t.amount, 8));
  }
  return se(e);
}
function NS(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(Vt, (a) => {
    throw new Ee(`Could not read ${a} as PostConditionType`);
  }), r = TS(e);
  let s, i, o;
  switch (n) {
    case Vt.STX:
      return s = e.readUInt8Enum(Ii, (c) => {
        throw new Ee(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${rt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Vt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Vt.Fungible:
      return i = Vc(e), s = e.readUInt8Enum(Ii, (c) => {
        throw new Ee(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${rt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Vt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Vt.NonFungible:
      i = Vc(e);
      const a = wn(e);
      return s = e.readUInt8Enum(Fc, (c) => {
        throw new Ee(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: V.PostCondition,
        conditionType: Vt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Vt.Staking:
      return s = e.readUInt8Enum(Ii, (c) => {
        throw new Ee(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${rt(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Vt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Vt.PoX: {
      const c = e.readUInt8Enum(jc, (f) => {
        throw new Ee(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: V.PostCondition,
        conditionType: Vt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Sp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ut.TokenTransfer:
      e.push(mn(t.recipient)), e.push($r(t.amount, 8)), e.push(Tn(t.memo));
      break;
    case Ut.ContractCall:
      e.push(Tn(t.contractAddress)), e.push(Tn(t.contractName)), e.push(Tn(t.functionName));
      const n = new Uint8Array(4);
      Xr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(mn(r));
      });
      break;
    case Ut.SmartContract:
      e.push(Tn(t.contractName)), e.push(Tn(t.codeBody));
      break;
    case Ut.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Tn(t.contractName)), e.push(Tn(t.codeBody));
      break;
    case Ut.PoisonMicroblock:
      break;
    case Ut.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ut.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(mn(t.recipient));
      break;
    case Ut.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(mn(t.recipient ? gp(t.recipient) : pp())), e.push(t.vrfProof);
      break;
    case Ut.TenureChange:
      e.push(Ct(t.tenureHash)), e.push(Ct(t.previousTenureHash)), e.push(Ct(t.burnViewHash)), e.push(Ct(t.previousTenureEnd)), e.push(Xr(new Uint8Array(4), t.previousTenureBlocks)), e.push(Tw(new Uint8Array(1), t.cause)), e.push(Ct(t.publicKeyHash));
      break;
  }
  return se(e);
}
function US(t) {
  const e = _e(t, Rt) ? t : new Rt(t);
  switch (e.readUInt8Enum(Ut, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Ut.TokenTransfer:
      const r = wn(e), s = be(e.readBytes(8)), i = wp(e);
      return ES(r, s, i);
    case Ut.ContractCall:
      const o = ti(e), a = We(e), c = We(e), f = [], d = e.readUInt32BE();
      for (let C = 0; C < d; C++) {
        const I = wn(e);
        f.push(I);
      }
      return AS(o, a, c, f);
    case Ut.SmartContract:
      const l = We(e), g = We(e, 4, 1e5);
      return Xf(l, g);
    case Ut.VersionedSmartContract: {
      const C = e.readUInt8Enum(Dc, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), I = We(e), O = We(e, 4, Sx);
      return Xf(I, O, C);
    }
    case Ut.PoisonMicroblock:
      return vS();
    case Ut.Coinbase: {
      const C = e.readBytes(Kr);
      return Yf(C);
    }
    case Ut.CoinbaseToAltRecipient: {
      const C = e.readBytes(Kr), I = wn(e);
      return Yf(C, I);
    }
    case Ut.NakamotoCoinbase: {
      const C = e.readBytes(Kr), I = wn(e), O = e.readBytes(Oc);
      return IS(C, I, O);
    }
    case Ut.TenureChange:
      const h = rt(e.readBytes(20)), b = rt(e.readBytes(20)), m = rt(e.readBytes(20)), k = rt(e.readBytes(32)), S = e.readUInt32BE(), T = e.readUInt8Enum(zc, (C) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${C}`);
      }), w = rt(e.readBytes(20));
      return kS(h, b, m, k, S, T, w);
  }
}
function qc(t) {
  const e = _e(t, Rt) ? t : new Rt(t);
  return Kc(rt(e.readBytes(va)));
}
function PS(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(nn, (r) => {
    throw new Ee(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case nn.PublicKeyCompressed:
      return Hs(Yt.Compressed, Xc(e));
    case nn.PublicKeyUncompressed:
      return Hs(Yt.Uncompressed, li(w3(Xc(e).data)));
    case nn.SignatureCompressed:
      return Hs(Yt.Compressed, qc(e));
    case nn.SignatureUncompressed:
      return Hs(Yt.Uncompressed, qc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function tu(t) {
  return Ct(t.data);
}
function HS(t) {
  const e = [];
  switch (t.contents.type) {
    case V.PublicKey:
      e.push(t.pubKeyEncoding === Yt.Compressed ? nn.PublicKeyCompressed : nn.PublicKeyUncompressed), e.push(Ct(y3(t.contents.data)));
      break;
    case V.MessageSignature:
      e.push(t.pubKeyEncoding === Yt.Compressed ? nn.SignatureCompressed : nn.SignatureUncompressed), e.push(tu(t.contents));
      break;
  }
  return se(e);
}
function Wc(t) {
  return t.data.slice();
}
function Xc(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = e.readUInt8(), r = n === 4 ? hx : dx;
  return li(se([n, e.readBytes(r)]));
}
function eu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Dt.P2PKH || e === Dt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Dt.P2WPKH || e === Dt.P2WSH || e === Dt.P2WSHNonSequential) && !r.map((s) => s.data).every(ui))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Dt.P2PKH:
      return wo(t, a3(r[0].data));
    case Dt.P2WPKH:
      return wo(t, c3(r[0].data));
    case Dt.P2SH:
    case Dt.P2SHNonSequential:
      return wo(t, l3(n, r.map(Wc)));
    case Dt.P2WSH:
    case Dt.P2WSHNonSequential:
      return wo(t, u3(n, r.map(Wc)));
  }
}
function wo(t, e) {
  return { type: V.Address, version: t, hash160: e };
}
function nu(t) {
  return bs.c32address(t.version, t.hash160);
}
function Zf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return LS(e, n, r);
}
function xi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return CS(e, n);
  } else
    return BS(t);
}
function OS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return jS(e, n);
  } else
    return DS(t);
}
function DS(t) {
  const e = kr(t);
  return { type: vt.PrincipalStandard, value: nu(e) };
}
function FS(t) {
  return { type: vt.PrincipalStandard, value: nu(t) };
}
function jS(t, e) {
  const n = kr(t), r = on(e);
  return Ep(n, r);
}
function Ep(t, e) {
  if (ps(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: vt.PrincipalContract,
    value: `${nu(t)}.${e.content}`
  };
}
function zS(t) {
  return { type: vt.ResponseErr, value: t };
}
function RS(t) {
  return { type: vt.ResponseOk, value: t };
}
const GS = (t) => ({ type: vt.StringASCII, value: t }), KS = (t) => ({ type: vt.StringUTF8, value: t });
function VS(t) {
  for (const e in t)
    if (!f3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: vt.Tuple, value: t };
}
function wn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Rt(Ct(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Rt(t) : e = t;
  switch (e.readUInt8Enum(ae, (r) => {
    throw new Ee(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ae.int:
      return bS(Ec(e.readBytes(16)));
    case ae.uint:
      return mS(e.readBytes(16));
    case ae.buffer:
      const r = e.readUInt32BE();
      return yS(e.readBytes(r));
    case ae.true:
      return pS();
    case ae.false:
      return gS();
    case ae.address:
      const s = ti(e);
      return FS(s);
    case ae.contract:
      const i = ti(e), o = We(e);
      return Ep(i, o);
    case ae.ok:
      return RS(wn(e));
    case ae.err:
      return zS(wn(e));
    case ae.none:
      return pp();
    case ae.some:
      return gp(wn(e));
    case ae.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(wn(e));
      return xS(c);
    case ae.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const k = We(e).content;
        if (k === void 0)
          throw new Ee('"content" is undefined');
        d[k] = wn(e);
      }
      return VS(d);
    case ae.ascii:
      const l = e.readUInt32BE(), g = Aw(e.readBytes(l));
      return GS(g);
    case ae.utf8:
      const h = e.readUInt32BE(), b = zi(e.readBytes(h));
      return KS(b);
    default:
      throw new Ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function $n(t, e) {
  return se([Zl(t), e]);
}
function qS(t) {
  return new Uint8Array([Zl(t.type)]);
}
function WS(t) {
  return t.type === vt.OptionalNone ? new Uint8Array([Zl(t.type)]) : $n(t.type, mn(t.value));
}
function XS(t) {
  const e = new Uint8Array(4);
  return Xr(e, Math.ceil(t.value.length / 2), 0), $n(t.type, En(e, Ct(t.value)));
}
function YS(t) {
  const e = Il(bw(BigInt(t.value), BigInt(fx)), ip);
  return $n(t.type, e);
}
function ZS(t) {
  const e = Il(BigInt(t.value), ip);
  return $n(t.type, e);
}
function QS(t) {
  return $n(t.type, qi(kr(t.value)));
}
function JS(t) {
  const [e, n] = d3(t.value);
  return $n(t.type, En(qi(kr(e)), ei(on(n))));
}
function t3(t) {
  return $n(t.type, mn(t.value));
}
function e3(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = mn(r);
    e.push(s);
  }
  return $n(t.type, se(e));
}
function n3(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = on(s);
    e.push(ei(i));
    const o = mn(t.value[s]);
    e.push(o);
  }
  return $n(t.type, se(e));
}
function Ap(t, e) {
  const n = [], r = e == "ascii" ? Ew(t.value) : ps(t.value), s = new Uint8Array(4);
  return Xr(s, r.length, 0), n.push(s), n.push(r), $n(t.type, se(n));
}
function r3(t) {
  return Ap(t, "ascii");
}
function s3(t) {
  return Ap(t, "utf8");
}
function Qf(t) {
  return rt(mn(t));
}
function mn(t) {
  switch (t.type) {
    case vt.BoolTrue:
    case vt.BoolFalse:
      return qS(t);
    case vt.OptionalNone:
    case vt.OptionalSome:
      return WS(t);
    case vt.Buffer:
      return XS(t);
    case vt.UInt:
      return ZS(t);
    case vt.Int:
      return YS(t);
    case vt.PrincipalStandard:
      return QS(t);
    case vt.PrincipalContract:
      return JS(t);
    case vt.ResponseOk:
    case vt.ResponseErr:
      return t3(t);
    case vt.List:
      return e3(t);
    case vt.Tuple:
      return n3(t);
    case vt.StringASCII:
      return r3(t);
    case vt.StringUTF8:
      return s3(t);
    default:
      throw new Ps("Unable to serialize. Invalid Clarity Value.");
  }
}
const i3 = (t) => t.length % 2 ? `0${t}` : t, o3 = (t, e) => t.padEnd(e, "0"), $p = (t, e) => t ? ps(t).length > e : !1;
function Yc(t) {
  return ep(t);
}
const Ti = (t) => Fx(Wl(t)), ru = (t) => rt(hS(t)), a3 = (t) => rt(Ti(t)), c3 = (t) => {
  const e = Ti(t), n = En(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ti(n);
  return rt(r);
}, l3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = se(n), s = Ti(r);
  return rt(s);
}, u3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = se(n), s = Wl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = se(i), a = Ti(o);
  return rt(a);
};
function f3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function d3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
ee.hmacSha256Sync = (t, ...e) => {
  const n = lp.create(Wl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function li(t) {
  return t = typeof t == "string" ? Ct(t) : t, {
    type: V.PublicKey,
    data: t
  };
}
function h3(t, e, n = Yt.Compressed) {
  const r = kw(e), s = new je(Zu(r.r), Zu(r.s)), i = St.fromSignature(t, s, r.recoveryId), o = n === Yt.Compressed;
  return i.toHex(o);
}
function p3(t) {
  return typeof t == "string" ? t : rt(t);
}
const su = p3;
function vp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Iw;
}
function ui(t) {
  return !su(t).startsWith("04");
}
function g3(t) {
  t = kl(t);
  const e = vp(t);
  return rt(Ri(t.slice(0, 32), e));
}
function y3(t) {
  return St.fromHex(su(t)).toHex(!0);
}
function w3(t) {
  return St.fromHex(su(t)).toHex(!1);
}
function b3(t, e) {
  t = kl(t);
  const [n, r] = pa(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ji(r, 1) + je.fromHex(n).toCompactHex();
}
function iu() {
  return {
    type: V.MessageSignature,
    data: rt(new Uint8Array(va))
  };
}
function Ip(t, e, n, r) {
  const s = eu(0, t, 1, [li(e)]).hash160, i = ui(e) ? Yt.Compressed : Yt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: be(n),
    fee: be(r),
    keyEncoding: i,
    signature: iu()
  };
}
function Mi(t) {
  return "signature" in t;
}
function Jf(t) {
  return t === Dt.P2SH || t === Dt.P2WSH;
}
function m3(t) {
  return t === Dt.P2SHNonSequential || t === Dt.P2WSHNonSequential;
}
function td(t) {
  const e = Yc(t);
  return e.nonce = 0, e.fee = 0, Mi(e) ? e.signature = iu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function x3(t) {
  const e = [
    t.hashMode,
    Ct(t.signer),
    $r(t.nonce, 8),
    $r(t.fee, 8),
    t.keyEncoding,
    tu(t.signature)
  ];
  return se(e);
}
function S3(t) {
  const e = [
    t.hashMode,
    Ct(t.signer),
    $r(t.nonce, 8),
    $r(t.fee, 8)
  ], n = Ql(t.fields);
  e.push(Jl(n));
  const r = new Uint8Array(2);
  return Cw(r, t.signaturesRequired, 0), e.push(r), se(e);
}
function E3(t, e) {
  const n = rt(e.readBytes(20)), r = BigInt(`0x${rt(e.readBytes(8))}`), s = BigInt(`0x${rt(e.readBytes(8))}`), i = e.readUInt8Enum(Yt, (a) => {
    throw new Ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Dt.P2WPKH && i != Yt.Compressed)
    throw new Ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = qc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function A3(t, e) {
  const n = rt(e.readBytes(20)), r = BigInt("0x" + rt(e.readBytes(8))), s = BigInt("0x" + rt(e.readBytes(8))), i = mp(e, V.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case V.PublicKey:
        ui(f.contents.data) || (o = !0);
        break;
      case V.MessageSignature:
        if (f.pubKeyEncoding === Yt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new jr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Dt.P2WSH || t === Dt.P2WSHNonSequential))
    throw new jr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function nc(t) {
  return Mi(t) ? x3(t) : S3(t);
}
function rc(t) {
  const e = t.readUInt8Enum(Dt, (n) => {
    throw new Ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Dt.P2PKH || e === Dt.P2WPKH ? E3(e, t) : A3(e, t);
}
function kp(t, e, n, r) {
  const i = t + rt(new Uint8Array([e])) + rt($r(n, 8)) + rt($r(r, 8));
  if (Ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ru(Ct(i));
}
function Lp(t, e, n) {
  const r = 33 + va, s = ui(e.data) ? Yt.Compressed : Yt.Uncompressed, i = t + i3(s.toString(16)) + n, o = Ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ru(o);
}
function $3(t, e, n, r, s) {
  const i = kp(t, e, n, r), o = b3(s, i), a = li(g3(s)), c = Lp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Cp(t, e, n, r, s, i) {
  const o = kp(t, e, n, r), a = li(h3(o, i, s)), c = Lp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function v3() {
  const t = Ip(Dt.P2PKH, "", 0, 0);
  return t.signer = SS().hash160, t.keyEncoding = Yt.Compressed, t.signature = iu(), t;
}
function ed(t, e, n) {
  return Mi(t) ? I3(t, e, n) : k3(t, e, n);
}
function I3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Cp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = eu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new jr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function k3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case V.PublicKey:
        ui(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case V.MessageSignature:
        c.pubKeyEncoding === Yt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = Cp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Jf(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new jr("Too many signatures");
        break;
    }
  if (Jf(t.hashMode) && o !== t.signaturesRequired || m3(t.hashMode) && o < t.signaturesRequired)
    throw new jr("Incorrect number of signatures");
  if (i && (t.hashMode === Dt.P2WSH || t.hashMode === Dt.P2WSHNonSequential))
    throw new jr("Uncompressed keys are not allowed in this hash mode");
  const a = eu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new jr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Bp(t) {
  return {
    authType: Jt.Standard,
    spendingCondition: t
  };
}
function Tp(t, e) {
  return {
    authType: Jt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ip(Dt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function nd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Jt.Standard:
        return Bp(td(t.spendingCondition));
      case Jt.Sponsored:
        return Tp(td(t.spendingCondition), v3());
      default:
        throw new ta("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function L3(t, e) {
  switch (t.authType) {
    case Jt.Standard:
      return ed(t.spendingCondition, e, Jt.Standard);
    case Jt.Sponsored:
      return ed(t.spendingCondition, e, Jt.Standard);
    default:
      throw new ta("Invalid origin auth type");
  }
}
function C3(t, e) {
  switch (t.authType) {
    case Jt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: be(e)
      };
      return { ...t, spendingCondition: n };
    case Jt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: be(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function B3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: be(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function T3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: be(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function M3(t, e) {
  const n = {
    ...e,
    nonce: be(e.nonce),
    fee: be(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function _3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Jt.Standard:
      e.push(nc(t.spendingCondition));
      break;
    case Jt.Sponsored:
      e.push(nc(t.spendingCondition)), e.push(nc(t.sponsorSpendingCondition));
      break;
  }
  return se(e);
}
function N3(t) {
  const e = t.readUInt8Enum(Jt, (r) => {
    throw new Ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Jt.Standard:
      return n = rc(t), Bp(n);
    case Jt.Sponsored:
      n = rc(t);
      const r = rc(t);
      return Tp(n, r);
  }
}
class U3 {
  constructor({ auth: e, payload: n, postConditions: r = Ql([]), postConditionMode: s = Jo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = cx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: be(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = He.Any;
  }
  signBegin() {
    const e = Yc(this);
    return e.auth = nd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Yc(this);
    return e.auth = nd(e.auth), e.txid();
  }
  verifyOrigin() {
    return L3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Jt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Jt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Jt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : li(e), r = this.auth.spendingCondition;
    if (r && !Mi(r)) {
      const s = ui(n.data);
      r.fields.push(Hs(s ? Yt.Compressed : Yt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = $3(n, r, e.fee, e.nonce, s);
    if (Mi(e))
      e.signature = Kc(i);
    else {
      const a = vp(s);
      e.fields.push(Hs(a ? Yt.Compressed : Yt.Uncompressed, Kc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ru(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ta("Cannot sponsor sign a non-sponsored transaction");
    this.auth = M3(this.auth, e);
  }
  setFee(e) {
    this.auth = C3(this.auth, e);
  }
  setNonce(e) {
    this.auth = B3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ta("Cannot sponsor sign a non-sponsored transaction");
    this.auth = T3(this.auth, e);
  }
  serialize() {
    return rt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ps('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ps('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ps('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ps('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Xr(n, this.chainId, 0), e.push(n), e.push(_3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Jl(this.postConditions)), e.push(Sp(this.payload)), se(e);
  }
}
function P3(t) {
  const e = _e(t, Rt) ? t : new Rt(t), n = e.readUInt8Enum(ss, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = N3(e), i = e.readUInt8Enum(He, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Jo, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = mp(e, V.PostCondition), c = US(e), f = new U3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const rd = BigInt("18446744073709551615");
function sc(t) {
  const e = be(t);
  if (e < 0n || e > rd)
    throw new RangeError(`Post-condition amount must be between 0 and ${rd} (u64 max), received: ${e}`);
  return e;
}
var Zc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Zc || (Zc = {}));
var Qc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Qc || (Qc = {}));
function H3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Vt.STX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: $e.Origin } : xi(t.address),
        conditionCode: bo(t.condition),
        amount: sc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Vt.Fungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: $e.Origin } : xi(t.address),
        conditionCode: bo(t.condition),
        amount: sc(t.amount),
        asset: Zf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Vt.NonFungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: $e.Origin } : xi(t.address),
        conditionCode: bo(t.condition),
        asset: Zf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Vt.Staking,
        principal: t.address === "origin" ? { type: V.Principal, prefix: $e.Origin } : xi(t.address),
        conditionCode: bo(t.condition),
        amount: sc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Vt.PoX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: $e.Origin } : xi(t.address),
        conditionCode: O3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function bo(t) {
  return Zc[t];
}
function O3(t) {
  return Qc[t];
}
function Mp(t) {
  const e = H3(t);
  return _S(e);
}
function D3(t, e, n) {
  return au(_p(t), n);
}
function _p(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = _i(r);
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
    return BigInt(`0x${z3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ou(t, e = 8) {
  return (typeof t == "bigint" ? t : _p(t)).toString(16).padStart(e * 2, "0");
}
function au(t, e = 16) {
  const n = ou(t, e);
  return _i(n);
}
function F3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const j3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += j3[n];
  return e;
}
function _i(t) {
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
function cu(t) {
  return new TextEncoder().encode(t);
}
function R3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function G3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sd(t) {
  if (t.some(G3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function lu(...t) {
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
function Dn(t) {
  return lu(...t.map((e) => typeof e == "number" ? sd([e]) : e instanceof Array ? sd(e) : e));
}
function La(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Jc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Jc || (Jc = {}));
Jc.Mainnet;
const K3 = 128, V3 = 128, Np = 16;
var tl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(tl || (tl = {}));
var id;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(id || (id = {}));
var od;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(od || (od = {}));
var en;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(en || (en = {}));
const ic = ["onChainOnly", "offChainOnly", "any"];
ic[0] + "", en.OnChainOnly, ic[1] + "", en.OffChainOnly, ic[2] + "", en.Any, en.OnChainOnly + "", en.OnChainOnly, en.OffChainOnly + "", en.OffChainOnly, en.Any + "", en.Any;
var el;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(el || (el = {}));
el.Mainnet;
var ad;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ad || (ad = {}));
var Hr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hr || (Hr = {}));
var cd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(hd || (hd = {}));
var nl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(nl || (nl = {}));
var pd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pd || (pd = {}));
var gd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(gd || (gd = {}));
function rl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function q3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Up(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function W3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rl(t.outputLen), rl(t.blockLen);
}
function X3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Y3(t, e) {
  Up(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oc = {
  number: rl,
  bool: q3,
  bytes: Up,
  hash: W3,
  exists: X3,
  output: Y3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ac = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hn = (t, e) => t << 32 - e | t >>> e, Z3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Z3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Q3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Pp(t) {
  if (typeof t == "string" && (t = Q3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let J3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function xs(t) {
  const e = (r) => t().update(Pp(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function tE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let uu = class extends J3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ac(this.buffer);
  }
  update(e) {
    oc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Pp(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ac(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    oc.exists(this), oc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    tE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ac(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const eE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hp = Uint8Array.from({ length: 16 }, (t, e) => e), nE = Hp.map((t) => (9 * t + 5) % 16);
let fu = [Hp], du = [nE];
for (let t = 0; t < 4; t++)
  for (let e of [fu, du])
    e.push(e[t].map((n) => eE[n]));
const Op = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), rE = fu.map((t, e) => t.map((n) => Op[e][n])), sE = du.map((t, e) => t.map((n) => Op[e][n])), iE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), oE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), mo = (t, e) => t << e | t >>> 32 - e;
function yd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xo = new Uint32Array(16);
let aE = class extends uu {
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
      xo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = iE[h], k = oE[h], S = fu[h], T = du[h], w = rE[h], C = sE[h];
      for (let I = 0; I < 16; I++) {
        const O = mo(r + yd(h, i, a, f) + xo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = mo(a, 10) | 0, a = i, i = O;
      }
      for (let I = 0; I < 16; I++) {
        const O = mo(s + yd(b, o, c, d) + xo[T[I]] + k, C[I]) + g | 0;
        s = g, g = d, d = mo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
xs(() => new aE());
const cE = (t, e, n) => t & e ^ ~t & n, lE = (t, e, n) => t & e ^ t & n ^ e & n, uE = new Uint32Array([
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
]), cr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), lr = new Uint32Array(64);
let Dp = class extends uu {
  constructor() {
    super(64, 32, 8, !1), this.A = cr[0] | 0, this.B = cr[1] | 0, this.C = cr[2] | 0, this.D = cr[3] | 0, this.E = cr[4] | 0, this.F = cr[5] | 0, this.G = cr[6] | 0, this.H = cr[7] | 0;
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
      lr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = lr[l - 15], h = lr[l - 2], b = hn(g, 7) ^ hn(g, 18) ^ g >>> 3, m = hn(h, 17) ^ hn(h, 19) ^ h >>> 10;
      lr[l] = m + lr[l - 7] + b + lr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = hn(a, 6) ^ hn(a, 11) ^ hn(a, 25), h = d + g + cE(a, c, f) + uE[l] + lr[l] | 0, m = (hn(r, 2) ^ hn(r, 13) ^ hn(r, 22)) + lE(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    lr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fE = class extends Dp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
xs(() => new Dp());
xs(() => new fE());
const So = BigInt(2 ** 32 - 1), sl = BigInt(32);
function Fp(t, e = !1) {
  return e ? { h: Number(t & So), l: Number(t >> sl & So) } : { h: Number(t >> sl & So) | 0, l: Number(t & So) | 0 };
}
function dE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Fp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const hE = (t, e) => BigInt(t >>> 0) << sl | BigInt(e >>> 0), pE = (t, e, n) => t >>> n, gE = (t, e, n) => t << 32 - n | e >>> n, yE = (t, e, n) => t >>> n | e << 32 - n, wE = (t, e, n) => t << 32 - n | e >>> n, bE = (t, e, n) => t << 64 - n | e >>> n - 32, mE = (t, e, n) => t >>> n - 32 | e << 64 - n, xE = (t, e) => e, SE = (t, e) => t, EE = (t, e, n) => t << n | e >>> 32 - n, AE = (t, e, n) => e << n | t >>> 32 - n, $E = (t, e, n) => e << n - 32 | t >>> 64 - n, vE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function IE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const kE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), LE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, CE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), BE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, TE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ME = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: Fp,
  split: dE,
  toBig: hE,
  shrSH: pE,
  shrSL: gE,
  rotrSH: yE,
  rotrSL: wE,
  rotrBH: bE,
  rotrBL: mE,
  rotr32H: xE,
  rotr32L: SE,
  rotlSH: EE,
  rotlSL: AE,
  rotlBH: $E,
  rotlBL: vE,
  add: IE,
  add3L: kE,
  add3H: LE,
  add4L: CE,
  add4H: BE,
  add5H: ME,
  add5L: TE
}, [_E, NE] = bt.split([
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
].map((t) => BigInt(t))), ur = new Uint32Array(80), fr = new Uint32Array(80);
let Ca = class extends uu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: k } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = k | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      ur[w] = e.getUint32(n), fr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const C = ur[w - 15] | 0, I = fr[w - 15] | 0, O = bt.rotrSH(C, I, 1) ^ bt.rotrSH(C, I, 8) ^ bt.shrSH(C, I, 7), X = bt.rotrSL(C, I, 1) ^ bt.rotrSL(C, I, 8) ^ bt.shrSL(C, I, 7), F = ur[w - 2] | 0, U = fr[w - 2] | 0, x = bt.rotrSH(F, U, 19) ^ bt.rotrBH(F, U, 61) ^ bt.shrSH(F, U, 6), B = bt.rotrSL(F, U, 19) ^ bt.rotrBL(F, U, 61) ^ bt.shrSL(F, U, 6), P = bt.add4L(X, B, fr[w - 7], fr[w - 16]), Z = bt.add4H(P, O, x, ur[w - 7], ur[w - 16]);
      ur[w] = Z | 0, fr[w] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: k, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const C = bt.rotrSH(l, g, 14) ^ bt.rotrSH(l, g, 18) ^ bt.rotrBH(l, g, 41), I = bt.rotrSL(l, g, 14) ^ bt.rotrSL(l, g, 18) ^ bt.rotrBL(l, g, 41), O = l & h ^ ~l & m, X = g & b ^ ~g & k, F = bt.add5L(T, I, X, NE[w], fr[w]), U = bt.add5H(F, S, C, O, _E[w], ur[w]), x = F | 0, B = bt.rotrSH(r, s, 28) ^ bt.rotrBH(r, s, 34) ^ bt.rotrBH(r, s, 39), P = bt.rotrSL(r, s, 28) ^ bt.rotrBL(r, s, 34) ^ bt.rotrBL(r, s, 39), Z = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      S = m | 0, T = k | 0, m = h | 0, k = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = bt.add(f | 0, d | 0, U | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = bt.add3L(x, P, Q);
      r = bt.add3H(Y, U, B, Z), s = Y | 0;
    }
    ({ h: r, l: s } = bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = bt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = bt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = bt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: k } = bt.add(this.Gh | 0, this.Gl | 0, m | 0, k | 0), { h: S, l: T } = bt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, k, S, T);
  }
  roundClean() {
    ur.fill(0), fr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, UE = class extends Ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, PE = class extends Ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, HE = class extends Ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
xs(() => new Ca());
xs(() => new UE());
xs(() => new PE());
xs(() => new HE());
function OE(t, e, n) {
  const s = K3;
  if (t4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: tl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var le;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(le || (le = {}));
let DE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, jp = class extends DE {
  constructor(e) {
    super(e);
  }
};
function Ba(t) {
  const e = [];
  return e.push(_i(ou(t.version, 1))), e.push(_i(t.hash160)), Dn(e);
}
function FE(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ba(t.address)), t.prefix === nl.Contract && e.push(Ni(t.contractName)), Dn(e);
}
function Ni(t) {
  const e = [], n = cu(t.content), r = n.byteLength;
  return e.push(_i(ou(r, t.lengthPrefixBytes))), e.push(n), Dn(e);
}
function jE(t) {
  const e = [];
  return e.push(Ba(t.address)), e.push(Ni(t.contractName)), e.push(Ni(t.assetName)), Dn(e);
}
function zp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(FE(t.principal)), (t.conditionType === Hr.Fungible || t.conditionType === Hr.NonFungible) && e.push(jE(t.assetInfo)), t.conditionType === Hr.NonFungible && e.push(os(t.assetName)), e.push(t.conditionCode), t.conditionType === Hr.STX || t.conditionType === Hr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new jp("The post-condition amount may not be larger than 8 bytes");
    e.push(D3(t.amount, !1, 8));
  }
  return Dn(e);
}
function vn(t, e) {
  return Dn([t, e]);
}
function zE(t) {
  return new Uint8Array([t.type]);
}
function RE(t) {
  return t.type === le.OptionalNone ? new Uint8Array([t.type]) : vn(t.type, os(t.value));
}
function GE(t) {
  const e = new Uint8Array(4);
  return La(e, t.buffer.length, 0), vn(t.type, lu(e, t.buffer));
}
function KE(t) {
  const e = au(F3(t.value, BigInt(V3)), Np);
  return vn(t.type, e);
}
function VE(t) {
  const e = au(t.value, Np);
  return vn(t.type, e);
}
function qE(t) {
  return vn(t.type, Ba(t.address));
}
function WE(t) {
  return vn(t.type, lu(Ba(t.address), Ni(t.contractName)));
}
function XE(t) {
  return vn(t.type, os(t.value));
}
function YE(t) {
  const e = [], n = new Uint8Array(4);
  La(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = os(r);
    e.push(s);
  }
  return vn(t.type, Dn(e));
}
function ZE(t) {
  const e = [], n = new Uint8Array(4);
  La(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = OE(s);
    e.push(Ni(i));
    const o = os(t.data[s]);
    e.push(o);
  }
  return vn(t.type, Dn(e));
}
function Rp(t, e) {
  const n = [], r = e == "ascii" ? R3(t.data) : cu(t.data), s = new Uint8Array(4);
  return La(s, r.length, 0), n.push(s), n.push(r), vn(t.type, Dn(n));
}
function QE(t) {
  return Rp(t, "ascii");
}
function JE(t) {
  return Rp(t, "utf8");
}
function os(t) {
  switch (t.type) {
    case le.BoolTrue:
    case le.BoolFalse:
      return zE(t);
    case le.OptionalNone:
    case le.OptionalSome:
      return RE(t);
    case le.Buffer:
      return GE(t);
    case le.UInt:
      return VE(t);
    case le.Int:
      return KE(t);
    case le.PrincipalStandard:
      return qE(t);
    case le.PrincipalContract:
      return WE(t);
    case le.ResponseOk:
    case le.ResponseErr:
      return XE(t);
    case le.List:
      return YE(t);
    case le.Tuple:
      return ZE(t);
    case le.StringASCII:
      return QE(t);
    case le.StringUTF8:
      return JE(t);
    default:
      throw new jp("Unable to serialize. Invalid Clarity Value.");
  }
}
const t4 = (t, e) => t ? cu(t).length > e : !1, e4 = "connect-ui";
let Po, Gp, Oe = !1, il = !1;
const On = (t, e = "") => () => {
}, n4 = (t, e) => () => {
}, r4 = "{visibility:hidden}.hydrated{visibility:inherit}", wd = {}, s4 = "http://www.w3.org/2000/svg", i4 = "http://www.w3.org/1999/xhtml", o4 = (t) => t != null, hu = (t) => (t = typeof t, t === "object" || t === "function");
function Kp(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const ht = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !hu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ol(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = ol(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ol = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, a4 = {}, c4 = (t) => t && t.$tag$ === a4, l4 = (t, e) => t != null && !hu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, u4 = (t) => fi(t).$hostElement$, f4 = (t, e, n) => {
  const r = we.ce(e, n);
  return t.dispatchEvent(r), r;
}, bd = /* @__PURE__ */ new WeakMap(), d4 = (t, e, n) => {
  let r = ea.get(t);
  M4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ea.set(t, r);
}, h4 = (t, e, n, r) => {
  var s;
  let i = Vp(e);
  const o = ea.get(i);
  if (t = t.nodeType === 11 ? t : xn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = bd.get(t), c;
      if (a || bd.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = xn.createElement("style"), c.innerHTML = o;
          const f = (s = we.$nonce$) !== null && s !== void 0 ? s : Kp(xn);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, p4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = On("attachStyles", e.$tagName$), i = h4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Vp = (t, e) => "sc-" + t.$tagName$, md = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Sd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = xd(n), d = xd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Sd(Ta, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && we.rel(t, e, n, !1), r && we.ael(t, e, r, !1);
    else {
      const c = hu(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, g4 = /\s/, xd = (t) => t ? t.split(g4) : [], qp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || wd, o = e.$attrs$ || wd;
  for (r in i)
    r in o || md(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    md(s, r, i[r], o[r], n, e.$flags$);
}, pu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = xn.createTextNode(s.$text$);
  else {
    if (Oe || (Oe = s.$tag$ === "svg"), o = s.$elm$ = xn.createElementNS(Oe ? s4 : i4, s.$tag$), Oe && s.$tag$ === "foreignObject" && (Oe = !1), qp(null, s, Oe), o4(Po) && o["s-si"] !== Po && o.classList.add(o["s-si"] = Po), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = pu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Oe = !1 : o.tagName === "foreignObject" && (Oe = !0);
  }
  return o;
}, Wp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Gp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = pu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Xp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, y4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : Eo(a, d) ? (Si(a, d), a = e[++s], d = r[++i]) : Eo(c, l) ? (Si(c, l), c = e[--o], l = r[--f]) : Eo(a, l) ? (Si(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : Eo(c, d) ? (Si(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = pu(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Wp(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && Xp(e, s, o);
}, Eo = (t, e) => t.$tag$ === e.$tag$, Si = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Oe = i === "svg" ? !0 : i === "foreignObject" ? !1 : Oe, qp(t, e, Oe), r !== null && s !== null ? y4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Wp(n, null, e, s, 0, s.length - 1)) : r !== null && Xp(r, 0, r.length - 1), Oe && i === "svg" && (Oe = !1)) : t.$text$ !== o && (n.data = o);
}, w4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ol(null, null), s = c4(e) ? e : ht(null, null, e);
  Gp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Po = n["s-sc"], Si(r, s);
}, Yp = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, gu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Yp(t, t.$ancestorComponent$), N4(() => b4(t, e));
}, b4 = (t, e) => {
  const n = On("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), E4(s, () => m4(t, r, e));
}, m4 = async (t, e, n) => {
  const r = t.$hostElement$, s = On("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && p4(t);
  const o = On("render", t.$cmpMeta$.$tagName$);
  x4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => S4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, x4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, w4(t, e);
  } catch (r) {
    Ui(r, t.$hostElement$);
  }
  return null;
}, S4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = On("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Qp(n), r(), t.$onReadyResolve$(n), s || Zp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && wu(() => gu(t, !1)), t.$flags$ &= -517;
}, Zp = (t) => {
  Qp(xn.documentElement), wu(() => f4(Ta, "appload", { detail: { namespace: e4 } }));
}, E4 = (t, e) => t && t.then ? t.then(e) : e(), Qp = (t) => t.classList.add("hydrated"), A4 = (t, e) => fi(t).$instanceValues$.get(e), $4 = (t, e, n, r) => {
  const s = fi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = l4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && gu(s, !1));
}, Jp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return A4(this, i);
        },
        set(a) {
          $4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        we.jmp(() => {
          const f = i.get(o);
          if (this.hasOwnProperty(f))
            c = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == c)
            return;
          this[f] = c === null && typeof this[f] == "boolean" ? !1 : c;
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
}, v4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = T4(n), s.then) {
        const c = n4();
        s = await s, c();
      }
      s.isProxied || (Jp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = On("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ui(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Vp(n);
      if (!ea.has(c)) {
        const f = On("registerStyles", n.$tagName$);
        d4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => gu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, I4 = (t) => {
  if (!(we.$flags$ & 1)) {
    const e = fi(t), n = e.$cmpMeta$, r = On("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Yp(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), v4(t, e, n);
    }
    r();
  }
}, k4 = (t) => {
  we.$flags$ & 1 || fi(t);
}, L4 = (t, e = {}) => {
  var n;
  const r = On(), s = [], i = e.exclude || [], o = Ta.customElements, a = xn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ xn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(we, e), we.$resourcesUrl$ = new URL(e.resourcesUrl || "./", xn.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const m = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      m.$members$ = b[2];
      const k = m.$tagName$, S = class extends HTMLElement {
        // StencilLazyHost
        constructor(T) {
          super(T), T = this, B4(T, m), m.$flags$ & 1 && T.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : we.jmp(() => I4(this));
        }
        disconnectedCallback() {
          we.jmp(() => k4(this));
        }
        componentOnReady() {
          return fi(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = h[0], !i.includes(k) && !o.get(k) && (s.push(k), o.define(k, Jp(
        S,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + r4, f.setAttribute("data-styles", "");
    const h = (n = we.$nonce$) !== null && n !== void 0 ? n : Kp(xn);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : we.jmp(() => l = setTimeout(Zp, 30)), r();
}, yu = /* @__PURE__ */ new WeakMap(), fi = (t) => yu.get(t), C4 = (t, e) => yu.set(e.$lazyInstance$ = t, e), B4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], yu.set(t, n);
}, Sd = (t, e) => e in t, Ui = (t, e) => (0, console.error)(t, e), cc = /* @__PURE__ */ new Map(), T4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = cc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (cc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => O$).then(o, Ui);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (cc.set(s, o), o[r]), Ui);
}, ea = /* @__PURE__ */ new Map(), Ta = typeof window < "u" ? window : {}, xn = Ta.document || { head: {} }, we = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, tg = (t) => Promise.resolve(t), M4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ed = [], eg = [], _4 = (t, e) => (n) => {
  t.push(n), il || (il = !0, we.$flags$ & 4 ? wu(al) : we.raf(al));
}, Ad = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ui(n);
    }
  t.length = 0;
}, al = () => {
  Ad(Ed), Ad(eg), (il = Ed.length > 0) && we.raf(al);
}, wu = (t) => tg().then(t), N4 = /* @__PURE__ */ _4(eg), U4 = () => tg(), P4 = (t, e) => typeof window > "u" ? Promise.resolve() : U4().then(() => L4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var H4 = Object.defineProperty, O4 = Object.defineProperties, D4 = Object.getOwnPropertyDescriptors, na = Object.getOwnPropertySymbols, ng = Object.prototype.hasOwnProperty, rg = Object.prototype.propertyIsEnumerable, $d = (t, e, n) => e in t ? H4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Re = (t, e) => {
  for (var n in e || (e = {})) ng.call(e, n) && $d(t, n, e[n]);
  if (na) for (var n of na(e)) rg.call(e, n) && $d(t, n, e[n]);
  return t;
}, an = (t, e) => O4(t, D4(e)), sg = (t, e) => {
  var n = {};
  for (var r in t) ng.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && na) for (var r of na(t)) e.indexOf(r) < 0 && rg.call(t, r) && (n[r] = t[r]);
  return n;
};
function ig() {
  return $a(ts()) || window.StacksProvider || window.BlockstackProvider;
}
function Ma(t) {
  return t ? typeof t == "string" ? ns.fromName(t) : "version" in t ? t : "url" in t ? new Uc({ url: t.url }) : t.transactionVersion === ss.Mainnet ? new Uc({ url: t.client.baseUrl }) : new Pc({ url: t.client.baseUrl }) : new Pc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var F4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(F4 || {}), j4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(j4 || {}), bu = (t) => {
  let e = t;
  if (!e) {
    let n = new Ph(["store_write"], document.location.href);
    e = new Nc({ appConfig: n });
  }
  return e;
};
function og(t) {
  try {
    return bu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ag = (t) => {
  let e = bu(t).loadUserData().appPrivateKey, n = he.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function z4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [rs.Mainnet]: "mainnet", [rs.Testnet]: "testnet" }, a = Ma(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function R4(t) {
  let e = Ma(t.network), n = bu(t.userSession), r = an(Re({}, t), { network: e, userSession: n });
  return Re({ stxAddress: z4(r) }, r);
}
async function G4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Mp) : n = n.map((r) => rt(zp(r)))), new he.TokenSigner("ES256k", e).signAsync(an(Re({}, t), { postConditions: n }));
}
function K4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Mp) : e = e.map((n) => rt(zp(n)))), he.createUnsecuredToken(an(Re({}, t), { postConditions: e }));
}
var V4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Ct(a.replace(/^0x/, "")), f = P3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, an(Re({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, an(Re({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, q4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = sg(e, ["amount", "appDetails", "userSession"]);
  if (og(s)) {
    let { privateKey: a, publicKey: c } = ag(s), f = an(Re({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), G4(f, a);
  }
  let o = an(Re({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), K4(o);
};
async function W4(t, e, n) {
  let r = await e(an(Re(Re({}, R4(t)), t), { network: Ma(t.network) }));
  return V4({ token: r, options: t }, n);
}
function X4(t, e = ig()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return W4(t, q4, e);
}
function cg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? an(Re({}, t), { message: Qf(e), domain: Qf(n) }) : an(Re({}, t), { message: rt(os(e)), domain: rt(os(n)) });
}
async function Y4(t, e) {
  return new he.TokenSigner("ES256k", e).signAsync(cg(t));
}
async function Z4(t) {
  let e = t, { userSession: n } = e, r = sg(e, ["userSession"]);
  if (og(n)) {
    let { privateKey: s, publicKey: i } = ag(n), o = an(Re({}, r), { publicKey: i });
    return Y4(o, s);
  }
  return he.createUnsecuredToken(cg(t));
}
var Q4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Q4 || {}), lg = "asigna-stx", vd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === lg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(tA(t, e), "*");
}), J4 = { authenticationRequest: async (t) => vd(t, "authenticationRequest"), transactionRequest: async (t) => vd(t, "transactionRequest") }, tA = (t, e) => ({ source: lg, [e]: t }), eA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = J4);
};
eA();
var nA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function rA(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ts(), o = ig();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    P4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : nA, c = W2(a), f = document.createElement("connect-modal");
    f.defaultProviders = a, f.installedProviders = c, f.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = d;
    };
    f.callback = (h) => {
      l(), t(n, h);
    }, f.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(f);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), f.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Ao = rA(X4);
function vr(t, e, n) {
  return mu(Ie(t, e), n);
}
function Ie(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Wt(r);
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
      const r = oA(BigInt(`0x${$t(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${$t(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Id(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Wi(t, e = 8) {
  return (typeof t == "bigint" ? t : Ie(t, !1)).toString(16).padStart(e * 2, "0");
}
function _a(t) {
  return parseInt(t, 16);
}
function mu(t, e = 16) {
  const n = Wi(t, e);
  return Wt(n);
}
function sA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function iA(t, e) {
  return t & BigInt(1) << e;
}
function oA(t, e) {
  return iA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const aA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $t(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += aA[n];
  return e;
}
function Wt(t) {
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
function di(t) {
  return new TextEncoder().encode(t);
}
function xu(t) {
  return new TextDecoder().decode(t);
}
function ug(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function cA(t) {
  return String.fromCharCode.apply(null, t);
}
function lA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function kd(t) {
  if (t.some(lA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Na(...t) {
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
function ie(t) {
  return Na(...t.map((e) => typeof e == "number" ? kd([e]) : e instanceof Array ? kd(e) : e));
}
var Ld;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Cd || (Cd = {}));
var Bd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bd || (Bd = {}));
const fg = 33, lc = 32;
function uA(t) {
  if (t.length < lc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + lc * 2), r = t.slice(2 + lc * 2);
  return {
    recoveryId: _a(e),
    r: n,
    s: r
  };
}
function fA(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function dA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function hA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function pA(t, e) {
  return t[e];
}
function gA(t, e, n = 0) {
  return t[n] = e, t;
}
function yA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function as(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var cl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(cl || (cl = {}));
const wA = cl.Mainnet, bA = 128, mA = 128, dg = 16, Vr = 32, ll = 80, Ua = 65, xA = 32, SA = 64, ra = 34;
var et;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(et || (et = {}));
var xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(xt || (xt = {}));
var ul;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ul || (ul = {}));
var Te;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Te || (Te = {}));
const Ho = ["onChainOnly", "offChainOnly", "any"], Td = {
  [Ho[0]]: Te.OnChainOnly,
  [Ho[1]]: Te.OffChainOnly,
  [Ho[2]]: Te.Any,
  [Te.OnChainOnly]: Te.OnChainOnly,
  [Te.OffChainOnly]: Te.OffChainOnly,
  [Te.Any]: Te.Any
};
function EA(t) {
  if (t in Td)
    return Td[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ho.join(", ")}`);
}
var sa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sa || (sa = {}));
sa.Mainnet;
var ni;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ni || (ni = {}));
var Me;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Me || (Me = {}));
var te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(te || (te = {}));
var Ft;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ft || (Ft = {}));
var ia;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ia || (ia = {}));
var Zt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zt || (Zt = {}));
var Pi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Pi || (Pi = {}));
var fl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(fl || (fl = {}));
var Hi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hi || (Hi = {}));
var Md;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Md || (Md = {}));
var _d;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(_d || (_d = {}));
function dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function AA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function $A(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  dl(t.outputLen), dl(t.blockLen);
}
function vA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function IA(t, e) {
  hg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rr = {
  number: dl,
  bool: AA,
  bytes: hg,
  hash: $A,
  exists: vA,
  output: IA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pn = (t, e) => t << 32 - e | t >>> e, kA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!kA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function LA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Su(t) {
  if (typeof t == "string" && (t = LA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class pg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ss(t) {
  const e = (r) => t().update(Su(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function CA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class Eu extends pg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = uc(this.buffer);
  }
  update(e) {
    Rr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Su(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = uc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rr.exists(this), Rr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    CA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = uc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], i);
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
const BA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gg = Uint8Array.from({ length: 16 }, (t, e) => e), TA = gg.map((t) => (9 * t + 5) % 16);
let Au = [gg], $u = [TA];
for (let t = 0; t < 4; t++)
  for (let e of [Au, $u])
    e.push(e[t].map((n) => BA[n]));
const yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), MA = Au.map((t, e) => t.map((n) => yg[e][n])), _A = $u.map((t, e) => t.map((n) => yg[e][n])), NA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), UA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $o = (t, e) => t << e | t >>> 32 - e;
function Nd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const vo = new Uint32Array(16);
class PA extends Eu {
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
      vo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, m = NA[h], k = UA[h], S = Au[h], T = $u[h], w = MA[h], C = _A[h];
      for (let I = 0; I < 16; I++) {
        const O = $o(r + Nd(h, i, a, f) + vo[S[I]] + m, w[I]) + l | 0;
        r = l, l = f, f = $o(a, 10) | 0, a = i, i = O;
      }
      for (let I = 0; I < 16; I++) {
        const O = $o(s + Nd(b, o, c, d) + vo[T[I]] + k, C[I]) + g | 0;
        s = g, g = d, d = $o(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    vo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const HA = Ss(() => new PA()), OA = (t, e, n) => t & e ^ ~t & n, DA = (t, e, n) => t & e ^ t & n ^ e & n, FA = new Uint32Array([
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
]), dr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hr = new Uint32Array(64);
class wg extends Eu {
  constructor() {
    super(64, 32, 8, !1), this.A = dr[0] | 0, this.B = dr[1] | 0, this.C = dr[2] | 0, this.D = dr[3] | 0, this.E = dr[4] | 0, this.F = dr[5] | 0, this.G = dr[6] | 0, this.H = dr[7] | 0;
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
      hr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = hr[l - 15], h = hr[l - 2], b = pn(g, 7) ^ pn(g, 18) ^ g >>> 3, m = pn(h, 17) ^ pn(h, 19) ^ h >>> 10;
      hr[l] = m + hr[l - 7] + b + hr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = pn(a, 6) ^ pn(a, 11) ^ pn(a, 25), h = d + g + OA(a, c, f) + FA[l] + hr[l] | 0, m = (pn(r, 2) ^ pn(r, 13) ^ pn(r, 22)) + DA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    hr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class jA extends wg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const vu = Ss(() => new wg());
Ss(() => new jA());
const Io = BigInt(2 ** 32 - 1), hl = BigInt(32);
function bg(t, e = !1) {
  return e ? { h: Number(t & Io), l: Number(t >> hl & Io) } : { h: Number(t >> hl & Io) | 0, l: Number(t & Io) | 0 };
}
function zA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const RA = (t, e) => BigInt(t >>> 0) << hl | BigInt(e >>> 0), GA = (t, e, n) => t >>> n, KA = (t, e, n) => t << 32 - n | e >>> n, VA = (t, e, n) => t >>> n | e << 32 - n, qA = (t, e, n) => t << 32 - n | e >>> n, WA = (t, e, n) => t << 64 - n | e >>> n - 32, XA = (t, e, n) => t >>> n - 32 | e << 64 - n, YA = (t, e) => e, ZA = (t, e) => t, QA = (t, e, n) => t << n | e >>> 32 - n, JA = (t, e, n) => e << n | t >>> 32 - n, t8 = (t, e, n) => e << n - 32 | t >>> 64 - n, e8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function n8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const r8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), s8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, i8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), o8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, a8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), c8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: bg,
  split: zA,
  toBig: RA,
  shrSH: GA,
  shrSL: KA,
  rotrSH: VA,
  rotrSL: qA,
  rotrBH: WA,
  rotrBL: XA,
  rotr32H: YA,
  rotr32L: ZA,
  rotlSH: QA,
  rotlSL: JA,
  rotlBH: t8,
  rotlBL: e8,
  add: n8,
  add3L: r8,
  add3H: s8,
  add4L: i8,
  add4H: o8,
  add5H: c8,
  add5L: a8
}, [l8, u8] = mt.split([
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
].map((t) => BigInt(t))), pr = new Uint32Array(80), gr = new Uint32Array(80);
class Pa extends Eu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: m, Hl: k } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, b, m, k) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = m | 0, this.Hl = k | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      pr[w] = e.getUint32(n), gr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const C = pr[w - 15] | 0, I = gr[w - 15] | 0, O = mt.rotrSH(C, I, 1) ^ mt.rotrSH(C, I, 8) ^ mt.shrSH(C, I, 7), X = mt.rotrSL(C, I, 1) ^ mt.rotrSL(C, I, 8) ^ mt.shrSL(C, I, 7), F = pr[w - 2] | 0, U = gr[w - 2] | 0, x = mt.rotrSH(F, U, 19) ^ mt.rotrBH(F, U, 61) ^ mt.shrSH(F, U, 6), B = mt.rotrSL(F, U, 19) ^ mt.rotrBL(F, U, 61) ^ mt.shrSL(F, U, 6), P = mt.add4L(X, B, gr[w - 7], gr[w - 16]), Z = mt.add4H(P, O, x, pr[w - 7], pr[w - 16]);
      pr[w] = Z | 0, gr[w] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: m, Gl: k, Hh: S, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const C = mt.rotrSH(l, g, 14) ^ mt.rotrSH(l, g, 18) ^ mt.rotrBH(l, g, 41), I = mt.rotrSL(l, g, 14) ^ mt.rotrSL(l, g, 18) ^ mt.rotrBL(l, g, 41), O = l & h ^ ~l & m, X = g & b ^ ~g & k, F = mt.add5L(T, I, X, u8[w], gr[w]), U = mt.add5H(F, S, C, O, l8[w], pr[w]), x = F | 0, B = mt.rotrSH(r, s, 28) ^ mt.rotrBH(r, s, 34) ^ mt.rotrBH(r, s, 39), P = mt.rotrSL(r, s, 28) ^ mt.rotrBL(r, s, 34) ^ mt.rotrBL(r, s, 39), Z = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      S = m | 0, T = k | 0, m = h | 0, k = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = mt.add(f | 0, d | 0, U | 0, x | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = mt.add3L(x, P, Q);
      r = mt.add3H(Y, U, B, Z), s = Y | 0;
    }
    ({ h: r, l: s } = mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = mt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = mt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = mt.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: m, l: k } = mt.add(this.Gh | 0, this.Gl | 0, m | 0, k | 0), { h: S, l: T } = mt.add(this.Hh | 0, this.Hl | 0, S | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, b, m, k, S, T);
  }
  roundClean() {
    pr.fill(0), gr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class f8 extends Pa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class d8 extends Pa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class h8 extends Pa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ss(() => new Pa());
Ss(() => new f8());
const p8 = Ss(() => new d8());
Ss(() => new h8());
function mg(t) {
  if (Wt(t).byteLength != Ua)
    throw Error("Invalid signature");
  return {
    type: et.MessageSignature,
    data: t
  };
}
function Ei(t, e) {
  return { type: et.Address, version: t, hash160: e };
}
function Os(t) {
  return bs.c32address(t.version, t.hash160);
}
function cs(t, e, n) {
  const r = e || 1, s = n || bA;
  if (Pg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: et.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Iu(t) {
  const e = bs.c32addressDecode(t);
  return {
    type: et.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function g8(t) {
  if (t.type === H.PrincipalStandard)
    return Os(t.address);
  if (t.type === H.PrincipalContract)
    return `${Os(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function xg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return b8(e, n);
  } else
    return y8(t);
}
function y8(t) {
  const e = Iu(t);
  return { type: H.PrincipalStandard, address: e };
}
function w8(t) {
  return { type: H.PrincipalStandard, address: t };
}
function b8(t, e) {
  const n = Iu(t), r = cs(e);
  return Sg(n, r);
}
function Sg(t, e) {
  if (di(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function fc(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${$t(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return Nn(t.value);
    case H.ResponseErr:
      return Nn(t.value);
    case H.ResponseOk:
      return Nn(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return g8(t);
    case H.List:
      return t.list.map((r) => Nn(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Nn(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function Nn(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: br(t), value: fc(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: br(t), value: fc(t, !0), success: !0 };
    default:
      return { type: br(t), value: fc(t, !0) };
  }
}
function br(t) {
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
      return `(optional ${br(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${br(t.value)})`;
    case H.ResponseOk:
      return `(response ${br(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? br(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${br(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${ug(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${di(t.data).length})`;
  }
}
const Eg = () => ({ type: H.BoolTrue }), Ag = () => ({ type: H.BoolFalse }), m8 = (t) => t ? Eg() : Ag(), Ud = BigInt("0xffffffffffffffffffffffffffffffff"), x8 = BigInt(0), Pd = BigInt("0x7fffffffffffffffffffffffffffffff"), Hd = BigInt("-170141183460469231731687303715884105728"), S8 = (t) => {
  const e = Ie(t, !0);
  if (e > Pd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Pd}`);
  if (e < Hd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Hd}`);
  return { type: H.Int, value: e };
}, Sn = (t) => {
  const e = Ie(t, !1);
  if (e < x8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ud)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ud}`);
  return { type: H.UInt, value: e };
}, $g = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function vg() {
  return { type: H.OptionalNone };
}
function Ig(t) {
  return { type: H.OptionalSome, value: t };
}
function E8(t) {
  return { type: H.ResponseErr, value: t };
}
function A8(t) {
  return { type: H.ResponseOk, value: t };
}
function $8(t) {
  return { type: H.List, list: t };
}
function ls(t) {
  for (const e in t)
    if (!h6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const de = (t) => ({ type: H.StringASCII, data: t }), v8 = (t) => ({ type: H.StringUTF8, data: t });
class kg extends pg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rr.hash(e);
    const r = Su(n);
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
    return Rr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rr.exists(this), Rr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Lg = (t, e, n) => new kg(t, e).update(n).digest();
Lg.create = (t, e) => new kg(t, e);
ee.hmacSha256Sync = (t, ...e) => {
  const n = Lg.create(vu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ri(t) {
  return {
    type: et.PublicKey,
    data: Wt(t)
  };
}
function I8(t, e, n = Zt.Compressed) {
  const r = uA(e.data), s = new je(Id(r.r), Id(r.s)), i = St.fromSignature(t, s, r.recoveryId), o = n === Zt.Compressed;
  return i.toHex(o);
}
function k8(t) {
  return { type: et.PublicKey, data: t };
}
function hi(t) {
  return !$t(t.data).startsWith("04");
}
function oa(t) {
  return t.data.slice();
}
function L8(t) {
  const e = T8(t), n = Ri(e.data.slice(0, 32), e.compressed);
  return ri($t(n));
}
function C8(t) {
  const e = typeof t == "string" ? t : $t(t), n = St.fromHex(e).toHex(!0);
  return ri(n);
}
function B8(t) {
  const e = typeof t == "string" ? t : $t(t), n = St.fromHex(e).toHex(!1);
  return ri(n);
}
function pl(t) {
  const e = t.readUInt8(), n = e === 4 ? SA : xA;
  return k8(ie([e, t.readBytes(n)]));
}
function T8(t) {
  const e = fA(t), n = e.length == fg;
  return { data: e, compressed: n };
}
function M8(t, e) {
  const [n, r] = pa(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Wi(r, 1) + je.fromHex(n).toCompactHex();
  return mg(i);
}
function _8(t) {
  return L8(t.data);
}
function N8(t, e, n) {
  return typeof t == "string" && (t = xg(t)), typeof n == "string" && (n = Fd(n)), {
    type: et.Payload,
    payloadType: xt.TokenTransfer,
    recipient: t,
    amount: Ie(e, !1),
    memo: n ?? Fd("")
  };
}
function U8(t, e, n, r) {
  return typeof t == "string" && (t = Iu(t)), typeof e == "string" && (e = cs(e)), typeof n == "string" && (n = cs(n)), {
    type: et.Payload,
    payloadType: xt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Od(t, e, n) {
  return typeof t == "string" && (t = cs(t)), typeof e == "string" && (e = G8(e)), typeof n == "number" ? {
    type: et.Payload,
    payloadType: xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: et.Payload,
    payloadType: xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function P8() {
  return { type: et.Payload, payloadType: xt.PoisonMicroblock };
}
function Dd(t, e) {
  if (t.byteLength != Vr)
    throw Error(`Coinbase buffer size must be ${Vr} bytes`);
  return e != null ? {
    type: et.Payload,
    payloadType: xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: et.Payload,
    payloadType: xt.Coinbase,
    coinbaseBytes: t
  };
}
function H8(t, e, n) {
  if (t.byteLength != Vr)
    throw Error(`Coinbase buffer size must be ${Vr} bytes`);
  if (n.byteLength != ll)
    throw Error(`VRF proof buffer size must be ${ll} bytes`);
  return {
    type: et.Payload,
    payloadType: xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var gl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(gl || (gl = {}));
function O8(t, e, n, r, s, i, o) {
  return {
    type: et.Payload,
    payloadType: xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Cg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case xt.TokenTransfer:
      e.push(re(t.recipient)), e.push(vr(t.amount, !1, 8)), e.push(Mn(t.memo));
      break;
    case xt.ContractCall:
      e.push(Mn(t.contractAddress)), e.push(Mn(t.contractName)), e.push(Mn(t.functionName));
      const n = new Uint8Array(4);
      as(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(re(r));
      });
      break;
    case xt.SmartContract:
      e.push(Mn(t.contractName)), e.push(Mn(t.codeBody));
      break;
    case xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Mn(t.contractName)), e.push(Mn(t.codeBody));
      break;
    case xt.PoisonMicroblock:
      break;
    case xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(re(t.recipient));
      break;
    case xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(re(t.recipient ? Ig(t.recipient) : vg())), e.push(t.vrfProof);
      break;
    case xt.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(as(new Uint8Array(4), t.previousTenureBlocks)), e.push(gA(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return ie(e);
}
function D8(t) {
  switch (t.readUInt8Enum(xt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case xt.TokenTransfer:
      const n = Ye(t), r = Ie(t.readBytes(8), !1), s = Tg(t);
      return N8(n, r, s);
    case xt.ContractCall:
      const i = si(t), o = Xe(t), a = Xe(t), c = [], f = t.readUInt32BE();
      for (let w = 0; w < f; w++) {
        const C = Ye(t);
        c.push(C);
      }
      return U8(i, o, a, c);
    case xt.SmartContract:
      const d = Xe(t), l = Xe(t, 4, 1e5);
      return Od(d, l);
    case xt.VersionedSmartContract: {
      const w = t.readUInt8Enum(ul, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), C = Xe(t), I = Xe(t, 4, 1e5);
      return Od(C, I, w);
    }
    case xt.PoisonMicroblock:
      return P8();
    case xt.Coinbase: {
      const w = t.readBytes(Vr);
      return Dd(w);
    }
    case xt.CoinbaseToAltRecipient: {
      const w = t.readBytes(Vr), C = Ye(t);
      return Dd(w, C);
    }
    case xt.NakamotoCoinbase: {
      const w = t.readBytes(Vr), C = Ye(t), I = t.readBytes(ll);
      return H8(w, C, I);
    }
    case xt.TenureChange:
      const g = $t(t.readBytes(20)), h = $t(t.readBytes(20)), b = $t(t.readBytes(20)), m = $t(t.readBytes(32)), k = t.readUInt32BE(), S = t.readUInt8Enum(gl, (w) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${w}`);
      }), T = $t(t.readBytes(20));
      return O8(g, h, b, m, k, S, T);
  }
}
class Ha extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Or extends Ha {
  constructor(e) {
    super(e);
  }
}
class Fe extends Ha {
  constructor(e) {
    super(e);
  }
}
class aa extends Ha {
  constructor(e) {
    super(e);
  }
}
class Gr extends Ha {
  constructor(e) {
    super(e);
  }
}
var rn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(rn || (rn = {}));
function yl(t) {
  return mg($t(t.readBytes(Ua)));
}
function Ds(t, e) {
  return {
    pubKeyEncoding: t,
    type: et.TransactionAuthField,
    contents: e
  };
}
function F8(t) {
  const e = t.readUInt8Enum(rn, (n) => {
    throw new Fe(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case rn.PublicKeyCompressed:
      return Ds(Zt.Compressed, pl(t));
    case rn.PublicKeyUncompressed:
      return Ds(Zt.Uncompressed, B8(pl(t).data));
    case rn.SignatureCompressed:
      return Ds(Zt.Compressed, yl(t));
    case rn.SignatureUncompressed:
      return Ds(Zt.Uncompressed, yl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function ku(t) {
  return Wt(t.data);
}
function j8(t) {
  const e = [];
  switch (t.contents.type) {
    case et.PublicKey:
      e.push(t.pubKeyEncoding === Zt.Compressed ? rn.PublicKeyCompressed : rn.PublicKeyUncompressed), e.push(oa(C8(t.contents.data)));
      break;
    case et.MessageSignature:
      e.push(t.pubKeyEncoding === Zt.Compressed ? rn.SignatureCompressed : rn.SignatureUncompressed), e.push(ku(t.contents));
      break;
  }
  return ie(e);
}
function Mn(t) {
  switch (t.type) {
    case et.Address:
      return Xi(t);
    case et.Principal:
      return Bg(t);
    case et.LengthPrefixedString:
      return ii(t);
    case et.MemoString:
      return K8(t);
    case et.AssetInfo:
      return Mg(t);
    case et.PostCondition:
      return V8(t);
    case et.PublicKey:
      return oa(t);
    case et.LengthPrefixedList:
      return Bu(t);
    case et.Payload:
      return Cg(t);
    case et.TransactionAuthField:
      return j8(t);
    case et.MessageSignature:
      return ku(t);
  }
}
function z8() {
  return {
    type: et.Address,
    version: ia.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Lu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Ft.SerializeP2PKH || e === Ft.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Ft.SerializeP2WPKH || e === Ft.SerializeP2WSH || e === Ft.SerializeP2WSHNonSequential) && !r.every(hi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Ft.SerializeP2PKH:
      return Ei(t, l6(r[0].data));
    case Ft.SerializeP2WPKH:
      return Ei(t, u6(r[0].data));
    case Ft.SerializeP2SH:
    case Ft.SerializeP2SHNonSequential:
      return Ei(t, f6(n, r.map(oa)));
    case Ft.SerializeP2WSH:
    case Ft.SerializeP2WSHNonSequential:
      return Ei(t, d6(n, r.map(oa)));
  }
}
function Xi(t) {
  const e = [];
  return e.push(Wt(Wi(t.version, 1))), e.push(Wt(t.hash160)), ie(e);
}
function si(t) {
  const e = _a($t(t.readBytes(1))), n = $t(t.readBytes(20));
  return { type: et.Address, version: e, hash160: n };
}
function Bg(t) {
  const e = [];
  return e.push(t.prefix), e.push(Xi(t.address)), t.prefix === Hi.Contract && e.push(ii(t.contractName)), ie(e);
}
function R8(t) {
  const e = t.readUInt8Enum(Hi, (s) => {
    throw new Fe(`Unexpected Principal payload type: ${s}`);
  }), n = si(t);
  if (e === Hi.Standard)
    return { type: et.Principal, prefix: e, address: n };
  const r = Xe(t);
  return {
    type: et.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ii(t) {
  const e = [], n = di(t.content), r = n.byteLength;
  return e.push(Wt(Wi(r, t.lengthPrefixBytes))), e.push(n), ie(e);
}
function Xe(t, e, n) {
  e = e || 1;
  const r = _a($t(t.readBytes(e))), s = xu(t.readBytes(r));
  return cs(s, e, n ?? 128);
}
function G8(t) {
  return cs(t, 4, 1e5);
}
function Fd(t) {
  if (t && Pg(t, ra))
    throw new Error(`Memo exceeds maximum length of ${ra} bytes`);
  return { type: et.MemoString, content: t };
}
function K8(t) {
  const e = [], n = di(t.content), r = c6($t(n), ra * 2);
  return e.push(Wt(r)), ie(e);
}
function Tg(t) {
  let e = xu(t.readBytes(ra));
  return e = e.replace(/\u0000*$/, ""), { type: et.MemoString, content: e };
}
function Mg(t) {
  const e = [];
  return e.push(Xi(t.address)), e.push(ii(t.contractName)), e.push(ii(t.assetName)), ie(e);
}
function wl(t) {
  return {
    type: et.AssetInfo,
    address: si(t),
    contractName: Xe(t),
    assetName: Xe(t)
  };
}
function Cu(t, e) {
  return {
    type: et.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Bu(t) {
  const e = t.values, n = [];
  n.push(Wt(Wi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Mn(r));
  return ie(n);
}
function _g(t, e, n) {
  const r = _a($t(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case et.Address:
        s.push(si(t));
        break;
      case et.LengthPrefixedString:
        s.push(Xe(t));
        break;
      case et.MemoString:
        s.push(Tg(t));
        break;
      case et.AssetInfo:
        s.push(wl(t));
        break;
      case et.PostCondition:
        s.push(q8(t));
        break;
      case et.PublicKey:
        s.push(pl(t));
        break;
      case et.TransactionAuthField:
        s.push(F8(t));
        break;
    }
  return Cu(s, n);
}
function V8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Bg(t.principal)), (t.conditionType === Me.Fungible || t.conditionType === Me.NonFungible) && e.push(Mg(t.assetInfo)), t.conditionType === Me.NonFungible && e.push(re(t.assetName)), e.push(t.conditionCode), t.conditionType === Me.STX || t.conditionType === Me.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Or("The post-condition amount may not be larger than 8 bytes");
    e.push(vr(t.amount, !1, 8));
  }
  return ie(e);
}
function q8(t) {
  const e = t.readUInt8Enum(Me, (o) => {
    throw new Fe(`Could not read ${o} as PostConditionType`);
  }), n = R8(t);
  let r, s, i;
  switch (e) {
    case Me.STX:
      return r = t.readUInt8Enum(Pi, (a) => {
        throw new Fe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${$t(t.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: Me.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Me.Fungible:
      return s = wl(t), r = t.readUInt8Enum(Pi, (a) => {
        throw new Fe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${$t(t.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: Me.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Me.NonFungible:
      s = wl(t);
      const o = Ye(t);
      return r = t.readUInt8Enum(fl, (a) => {
        throw new Fe(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: et.PostCondition,
        conditionType: Me.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function In(t, e) {
  return ie([t, e]);
}
function W8(t) {
  return new Uint8Array([t.type]);
}
function X8(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : In(t.type, re(t.value));
}
function Y8(t) {
  const e = new Uint8Array(4);
  return as(e, t.buffer.length, 0), In(t.type, Na(e, t.buffer));
}
function Z8(t) {
  const e = mu(sA(t.value, BigInt(mA)), dg);
  return In(t.type, e);
}
function Q8(t) {
  const e = mu(t.value, dg);
  return In(t.type, e);
}
function J8(t) {
  return In(t.type, Xi(t.address));
}
function t6(t) {
  return In(t.type, Na(Xi(t.address), ii(t.contractName)));
}
function e6(t) {
  return In(t.type, re(t.value));
}
function n6(t) {
  const e = [], n = new Uint8Array(4);
  as(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = re(r);
    e.push(s);
  }
  return In(t.type, ie(e));
}
function r6(t) {
  const e = [], n = new Uint8Array(4);
  as(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = cs(s);
    e.push(ii(i));
    const o = re(t.data[s]);
    e.push(o);
  }
  return In(t.type, ie(e));
}
function Ng(t, e) {
  const n = [], r = e == "ascii" ? ug(t.data) : di(t.data), s = new Uint8Array(4);
  return as(s, r.length, 0), n.push(s), n.push(r), In(t.type, ie(n));
}
function s6(t) {
  return Ng(t, "ascii");
}
function i6(t) {
  return Ng(t, "utf8");
}
function re(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return W8(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return X8(t);
    case H.Buffer:
      return Y8(t);
    case H.UInt:
      return Q8(t);
    case H.Int:
      return Z8(t);
    case H.PrincipalStandard:
      return J8(t);
    case H.PrincipalContract:
      return t6(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return e6(t);
    case H.List:
      return n6(t);
    case H.Tuple:
      return r6(t);
    case H.StringASCII:
      return s6(t);
    case H.StringUTF8:
      return i6(t);
    default:
      throw new Or("Unable to serialize. Invalid Clarity Value.");
  }
}
function o6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const jd = /* @__PURE__ */ new Map();
function Ug(t, e) {
  const n = jd.get(t);
  if (n !== void 0)
    return n(e);
  const r = o6(t);
  return jd.set(t, r), Ug(t, e);
}
class ki {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return yA(this.readBytes(4), 0);
  }
  readUInt8() {
    return pA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return dA(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = $t(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = $t(n);
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
    if (Ug(e, r))
      return r;
    throw n(r);
  }
}
function Ye(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ki(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ki(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new Fe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return S8(e.readBytes(16));
    case H.UInt:
      return Sn(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return $g(e.readBytes(r));
    case H.BoolTrue:
      return Eg();
    case H.BoolFalse:
      return Ag();
    case H.PrincipalStandard:
      const s = si(e);
      return w8(s);
    case H.PrincipalContract:
      const i = si(e), o = Xe(e);
      return Sg(i, o);
    case H.ResponseOk:
      return A8(Ye(e));
    case H.ResponseErr:
      return E8(Ye(e));
    case H.OptionalNone:
      return vg();
    case H.OptionalSome:
      return Ig(Ye(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(Ye(e));
      return $8(c);
    case H.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const k = Xe(e).content;
        if (k === void 0)
          throw new Fe('"content" is undefined');
        d[k] = Ye(e);
      }
      return ls(d);
    case H.StringASCII:
      const l = e.readUInt32BE(), g = cA(e.readBytes(l));
      return de(g);
    case H.StringUTF8:
      const h = e.readUInt32BE(), b = xu(e.readBytes(h));
      return v8(b);
    default:
      throw new Fe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const a6 = (t) => t.length % 2 == 0 ? t : `0${t}`, c6 = (t, e) => t.padEnd(e, "0"), Pg = (t, e) => t ? di(t).length > e : !1;
function bl(t) {
  return ep(t);
}
const Oi = (t) => HA(vu(t)), Tu = (t) => $t(p8(t)), l6 = (t) => $t(Oi(t)), u6 = (t) => {
  const e = Oi(t), n = Na(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Oi(n);
  return $t(r);
}, f6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = Oi(r);
  return $t(s);
}, d6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = vu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = ie(i), a = Oi(o);
  return $t(a);
};
function h6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Hg(t) {
  const e = re(t);
  return `0x${$t(e)}`;
}
function p6(t) {
  return Ye(t);
}
const zs = (t) => {
  try {
    return bs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Mu() {
  return {
    type: et.MessageSignature,
    data: $t(new Uint8Array(Ua))
  };
}
function Og(t, e, n, r) {
  const s = Lu(0, t, 1, [ri(e)]).hash160, i = hi(ri(e)) ? Zt.Compressed : Zt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ie(n, !1),
    fee: Ie(r, !1),
    keyEncoding: i,
    signature: Mu()
  };
}
function Di(t) {
  return "signature" in t;
}
function zd(t) {
  return t === Ft.SerializeP2SH || t === Ft.SerializeP2WSH;
}
function g6(t) {
  return t === Ft.SerializeP2SHNonSequential || t === Ft.SerializeP2WSHNonSequential;
}
function Rd(t) {
  const e = bl(t);
  return e.nonce = 0, e.fee = 0, Di(e) ? e.signature = Mu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function y6(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    vr(t.nonce, !1, 8),
    vr(t.fee, !1, 8),
    t.keyEncoding,
    ku(t.signature)
  ];
  return ie(e);
}
function w6(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    vr(t.nonce, !1, 8),
    vr(t.fee, !1, 8)
  ], n = Cu(t.fields);
  e.push(Bu(n));
  const r = new Uint8Array(2);
  return hA(r, t.signaturesRequired, 0), e.push(r), ie(e);
}
function b6(t, e) {
  const n = $t(e.readBytes(20)), r = BigInt(`0x${$t(e.readBytes(8))}`), s = BigInt(`0x${$t(e.readBytes(8))}`), i = e.readUInt8Enum(Zt, (a) => {
    throw new Fe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Ft.SerializeP2WPKH && i != Zt.Compressed)
    throw new Fe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = yl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function m6(t, e) {
  const n = $t(e.readBytes(20)), r = BigInt("0x" + $t(e.readBytes(8))), s = BigInt("0x" + $t(e.readBytes(8))), i = _g(e, et.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case et.PublicKey:
        hi(f.contents) || (o = !0);
        break;
      case et.MessageSignature:
        if (f.pubKeyEncoding === Zt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Gr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Ft.SerializeP2WSH || t === Ft.SerializeP2WSHNonSequential))
    throw new Gr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function dc(t) {
  return Di(t) ? y6(t) : w6(t);
}
function hc(t) {
  const e = t.readUInt8Enum(Ft, (n) => {
    throw new Fe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Ft.SerializeP2PKH || e === Ft.SerializeP2WPKH ? b6(e, t) : m6(e, t);
}
function Dg(t, e, n, r) {
  const i = t + $t(new Uint8Array([e])) + $t(vr(n, !1, 8)) + $t(vr(r, !1, 8));
  if (Wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Tu(Wt(i));
}
function Fg(t, e, n) {
  const r = 33 + Ua, s = hi(e) ? Zt.Compressed : Zt.Uncompressed, i = t + a6(s.toString(16)) + n.data, o = Wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Tu(o);
}
function x6(t, e, n, r, s) {
  const i = Dg(t, e, n, r), o = M8(s, i), a = _8(s), c = Fg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function jg(t, e, n, r, s, i) {
  const o = Dg(t, e, n, r), a = ri(I8(o, i, s)), c = Fg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function S6() {
  const t = Og(Ft.SerializeP2PKH, "", 0, 0);
  return t.signer = z8().hash160, t.keyEncoding = Zt.Compressed, t.signature = Mu(), t;
}
function Gd(t, e, n) {
  return Di(t) ? E6(t, e, n) : A6(t, e, n);
}
function E6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = jg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Lu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Gr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function A6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case et.PublicKey:
        hi(c.contents) || (i = !0), r.push(c.contents);
        break;
      case et.MessageSignature:
        c.pubKeyEncoding === Zt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = jg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (zd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Gr("Too many signatures");
        break;
    }
  if (zd(t.hashMode) && o !== t.signaturesRequired || g6(t.hashMode) && o < t.signaturesRequired)
    throw new Gr("Incorrect number of signatures");
  if (i && (t.hashMode === Ft.SerializeP2WSH || t.hashMode === Ft.SerializeP2WSHNonSequential))
    throw new Gr("Uncompressed keys are not allowed in this hash mode");
  const a = Lu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Gr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function zg(t) {
  return {
    authType: te.Standard,
    spendingCondition: t
  };
}
function Rg(t, e) {
  return {
    authType: te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Og(Ft.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Kd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case te.Standard:
        return zg(Rd(t.spendingCondition));
      case te.Sponsored:
        return Rg(Rd(t.spendingCondition), S6());
      default:
        throw new aa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function $6(t, e) {
  switch (t.authType) {
    case te.Standard:
      return Gd(t.spendingCondition, e, te.Standard);
    case te.Sponsored:
      return Gd(t.spendingCondition, e, te.Standard);
    default:
      throw new aa("Invalid origin auth type");
  }
}
function v6(t, e) {
  switch (t.authType) {
    case te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ie(e, !1)
      };
      return { ...t, spendingCondition: n };
    case te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ie(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function I6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ie(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function k6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ie(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function L6(t, e) {
  const n = {
    ...e,
    nonce: Ie(e.nonce, !1),
    fee: Ie(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function C6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case te.Standard:
      e.push(dc(t.spendingCondition));
      break;
    case te.Sponsored:
      e.push(dc(t.spendingCondition)), e.push(dc(t.sponsorSpendingCondition));
      break;
  }
  return ie(e);
}
function B6(t) {
  const e = t.readUInt8Enum(te, (r) => {
    throw new Fe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case te.Standard:
      return n = hc(t), zg(n);
    case te.Sponsored:
      n = hc(t);
      const r = hc(t);
      return Rg(n, r);
  }
}
class T6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ie(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? wA, this.postConditionMode = i ?? ni.Deny, this.postConditions = s ?? Cu([]), o)
      this.anchorMode = EA(o);
    else
      switch (r.payloadType) {
        case xt.Coinbase:
        case xt.CoinbaseToAltRecipient:
        case xt.NakamotoCoinbase:
        case xt.PoisonMicroblock:
        case xt.TenureChange:
          this.anchorMode = Te.OnChainOnly;
          break;
        case xt.ContractCall:
        case xt.SmartContract:
        case xt.VersionedSmartContract:
        case xt.TokenTransfer:
          this.anchorMode = Te.Any;
          break;
      }
  }
  signBegin() {
    const e = bl(this);
    return e.auth = Kd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = bl(this);
    return e.auth = Kd(e.auth), e.txid();
  }
  verifyOrigin() {
    return $6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Di(n)) {
      const r = hi(e);
      n.fields.push(Ds(r ? Zt.Compressed : Zt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = x6(n, r, e.fee, e.nonce, s);
    return Di(e) ? e.signature = i : e.fields.push(Ds(s.data.byteLength === fg ? Zt.Compressed : Zt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Tu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != te.Sponsored)
      throw new aa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = L6(this.auth, e);
  }
  setFee(e) {
    this.auth = v6(this.auth, e);
  }
  setNonce(e) {
    this.auth = I6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != te.Sponsored)
      throw new aa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = k6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Or('"version" is undefined');
    if (this.chainId === void 0)
      throw new Or('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Or('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Or('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Or('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return as(n, this.chainId, 0), e.push(n), e.push(C6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Bu(this.postConditions)), e.push(Cg(this.payload)), ie(e);
  }
}
function _u(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ki(Wt(t.slice(2))) : e = new ki(Wt(t)) : t instanceof Uint8Array ? e = new ki(t) : e = t;
  const n = e.readUInt8Enum(sa, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = B6(e), i = e.readUInt8Enum(Te, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(ni, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = _g(e, et.PostCondition), c = D8(e);
  return new T6(n, s, c, a, o, i, r);
}
const M6 = m8, Li = Sn, _6 = $g;
const N6 = /* @__PURE__ */ new Set([4001, -31001]), U6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], P6 = ["result", "data", "payload", "response", "params"], Vd = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Oa = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Es = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Pn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, H6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Gg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => H6(i, r)) === s
  );
}, Kg = (t) => t ? Gg(Es()).some(
  (e) => {
    var n;
    return e.id === t && (Oa(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Vg = () => {
  if (typeof window > "u")
    return;
  const t = Es(), e = Gg(t).filter(
    (n) => {
      var r;
      return Oa(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Pn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of U6) {
    const r = Pn(t, n) ?? (t === window ? void 0 : Pn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, O6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Es(), n = Pn(e, t) ?? (e === window ? void 0 : Pn(window, t)) ?? $a(t);
  if (n)
    return n;
  if (Oa(t) || Kg(t))
    return Vg();
}, ko = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, D6 = ["blockstack-session", "blockstack"], F6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of D6) {
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
F6();
const qg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, De = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, j6 = (t) => {
  const e = De(t);
  if (!e)
    return null;
  const n = qg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, z6 = (t) => {
  const e = De(t);
  if (!e)
    return null;
  const n = qg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, ml = (t, e = "mainnet") => {
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
      return ml(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return ml(r, e);
  }
  return e;
}, qr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Fi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return zs(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Fi(s, e + 1);
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
    const i = Fi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && zs(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && zs(n.testnet) ? n.testnet.trim() : null;
}, qd = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Wg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && N6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, us = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = De(n == null ? void 0 : n.message) ?? De(e.message) ?? De(e.error) ?? De(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, oi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw us(e);
    if (e.status === "error")
      throw us(e.result ?? e);
  }
  return t;
}, Wd = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return oi(r);
  } catch (r) {
    throw us(r);
  }
}, Xg = () => Vg(), Nu = () => {
  if (typeof window > "u")
    return;
  const t = Es();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Pn(t, e) ?? (t === window ? void 0 : Pn(window, e));
    if (n)
      return n;
  }
}, Xd = () => {
  if (typeof window > "u")
    return;
  const t = Nu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Es();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Pn(e, n) ?? (e === window ? void 0 : Pn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Oo = (t) => {
  var r, s;
  const e = ts();
  if (Oa(e) || Kg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Es() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Xg();
}, pc = (t) => {
  const e = z6(t);
  if (!e)
    return null;
  try {
    const n = _u(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, ca = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = pc(t), r = j6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? De(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = ca(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Vd)
    if (pc(s[a])) {
      i = De(s[a]);
      break;
    }
  const o = De(s.txId) || De(s.txid) || De(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? De(s.txRaw) ?? void 0
    };
  for (const a of Vd) {
    const c = pc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: De(s[a]) ?? void 0
      };
  }
  for (const a of P6) {
    const c = s[a], f = ca(c, e + 1);
    if (f)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, gc = (t) => {
  const e = ca(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, R6 = (t) => {
  const e = ca(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, G6 = (t) => ({
  ...t,
  fee: qr(t.fee),
  nonce: qr(t.nonce),
  sponsored: t.sponsored === !0
}), Yd = (t) => ({
  recipient: t.recipient,
  amount: qr(t.amount) ?? "0",
  memo: t.memo,
  network: ml(t.network),
  address: t.stxAddress,
  fee: qr(t.fee),
  nonce: qr(t.nonce),
  sponsored: t.sponsored ?? !1
}), Yg = "WALLET_ADDRESS_MISMATCH", K6 = 45e3;
let Ci = null;
const xl = (t) => {
  t && (Ci = { address: t, at: Date.now() });
}, V6 = () => {
  Ci = null;
}, q6 = () => Ci && Date.now() - Ci.at <= K6 ? Ci.address : null, W6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, X6 = async (t) => {
  V6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = oi(await t.request("wallet_connect")), n = Fi(e);
  return xl(n), n;
}, Y6 = async (t, e, n, r) => {
  try {
    return oi(await t.request(e, n));
  } catch (s) {
    const i = us(s);
    if (!W6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await X6(t);
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
        { code: o ? Yg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return oi(await t.request(e, n));
    } catch (a) {
      throw us(a);
    }
  }
};
let Zd = 3e4;
const Z6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Zd / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Zd);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, Q6 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Yg }
      );
    return c;
  }, s = q6();
  if (s)
    return ko(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  ko(n, "account-read");
  try {
    const c = oi(
      await Z6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Fi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Wg(c))
      throw us(c);
    ko(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return xl(i), r(i, "wallet_getAccount");
  let o;
  ko(n, "account-reconnect");
  try {
    o = oi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), us(c);
  }
  const a = Fi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return xl(a), r(a, "wallet_connect");
}, J6 = async (t, e) => {
  if (!Oo(t)) {
    const i = await Wd(
      t,
      "stx_transferStx",
      Yd(e)
    );
    return gc(i);
  }
  const n = Nu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Wd(
      n,
      "stx_transferStx",
      Yd(e)
    );
    return gc(i);
  }
  const r = Xg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await Q6(r, e.stxAddress);
  const s = await Y6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: qr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: qr(e.fee) } : {}
    },
    e.stxAddress
  );
  return gc(s);
}, t5 = () => ts(), Zg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ts(), e = t ? O6(t) : void 0;
  if (e)
    return e;
  const n = Es() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Qd = (t, e) => {
  const n = Zg(), r = G6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, R6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Ao(r, e);
  if (Oo(n) && !Nu()) {
    const s = Xd();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ts(),
        route: "legacy-transaction-request"
      }), Ao(r, s);
  }
  return void J6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (qd(s) && Oo(n)) {
      const a = Xd();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ts(),
          route: "legacy-transaction-request"
        }), Ao(r, a);
        return;
      }
    }
    if (qd(s) && !Oo(n)) {
      Ao(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Wg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Jd = (t) => Hg(t).replace(/^0x/, ""), th = "This wallet cannot sign messages. Try Xverse or Leather.", eh = (t) => typeof (t == null ? void 0 : t.request) == "function", nh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", e5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, n5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function r5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Jd(e.message),
    domain: Jd(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function s5(t, e) {
  const n = await Z4({
    domain: e.domain,
    message: e.message,
    network: Ma(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function rh(t) {
  var s, i;
  const e = t5() || "", n = /xverse/i.test(e);
  let r = Zg();
  if (n && !nh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (nh(r))
    try {
      return await s5(r, t);
    } catch (o) {
      if (n || !eh(r) || !n5(o)) throw o;
    }
  if (!n && eh(r))
    try {
      return await r5(r, t);
    } catch (o) {
      throw e5(o) ? new Error(th) : o;
    }
  throw new Error(th);
}
const sh = 1000000n, Fs = 1000000n, Sl = 50n, fs = 3000n, Yi = 300n, Lo = 3000n, i5 = 50000n, ih = 200n, Ir = (t) => t + Sl;
function gn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / sh}.${(n % sh).toString().padStart(6, "0")}`;
}
function oh(t, e = Yi) {
  return t <= fs ? 0 : Number((t - fs) / Ir(e));
}
function ah(t, e = 0n) {
  const n = Fs - t - e;
  return n > 0n ? n : 0n;
}
function o5(t, e = Yi) {
  return t > Fs ? "over" : t < fs + Ir(e) ? "empty" : t < i5 ? "low" : "ok";
}
const a5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", c5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", l5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function u5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || l5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== a5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Qg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", yc = 3, f5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [El, Jg] = Qg.split("."), Ve = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Al(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function d5(t) {
  return Ve(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ar(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ty(t, e = []) {
  const n = await Ar(`/v2/contracts/call-read/${El}/${Jg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: El, arguments: e.map((r) => "0x" + Ve(re(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Nn(Ye(n.result));
}
async function h5() {
  const t = await Ar(`/v2/contracts/source/${El}/${Jg}?proof=0`);
  if (typeof t.source != "string" || await d5(t.source) !== c5) throw Error("Deployed source does not match the tested helper.");
  if (u5(await ty("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ey(t) {
  return t.startsWith("SP") && zs(t) && !t.includes(".");
}
async function p5(t) {
  var r;
  if (!ey(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ar(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ar(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function g5(t) {
  const e = await Ar(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function y5(t, e) {
  var s, i;
  const n = await ty("get-owner", [Li(t), Li(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !ey(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function w5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Al(t), signal: AbortSignal.timeout(15e3) });
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
async function b5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function m5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = _u(Al(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Os(Ei(ia.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Os(r.contractAddress) + "." + r.contractName.content !== Qg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ve(re(r.functionArgs[0])) !== Ve(re(Li(t.core))) || Ve(re(r.functionArgs[1])) !== Ve(re(Li(t.song))) || Ve(re(r.functionArgs[2])) !== Ve(re(_6(Al(t.id)))) || t.amount !== "50" || e.postConditionMode !== ni.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Pi.Equal || i.principal.prefix !== 2 || Os(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Os(r.contractAddress) + "." + r.contractName.content !== f5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ve(re(r.functionArgs[0])) !== Ve(re(Li(t.song))) || typeof t.liked != "boolean" || Ve(re(r.functionArgs[1])) !== Ve(re(M6(t.liked))) || t.amount !== "0" || e.postConditionMode !== ni.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Nn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const x5 = "xtrata.xyz/radio/listening-wallet", S5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ds = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && zs(t), E5 = (t) => ({
  domain: ls({ name: de(x5), version: de("1"), "chain-id": Sn(1) }),
  message: ls({
    purpose: de(S5),
    main: de(t.main),
    listening: de(t.listening),
    issued: Sn(t.issued)
  })
}), ny = 100000n, A5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function $5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !ds(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= ny).sort(A5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Co = 50;
function la(t) {
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
async function v5(t, e, n = 4) {
  if (!ds(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Co}&offset=${o}`, s = la(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Co);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Co ? s : la(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = $5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Co);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Bn = 50, I5 = 6, k5 = 20, ch = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function lh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), f = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: f });
  }
  return { total: n.total, sent: r, rows: s };
}
async function L5(t, e, n) {
  if (!ds(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = la(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Bn}&offset=0`));
    if (!s || s.total > I5 * Bn) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Bn; o < s.total; o += Bn) {
      const a = la(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Bn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${Bn}&offset=${f}`, a = lh(await e(o(0)), t);
      if (!a || a.total > k5 * Bn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = Bn; f < a.total; f += Bn) {
        const d = lh(await e(o(f)), t);
        if (!d || !d.rows.length) return { ok: !1 };
        for (const l of d.rows) c.add(l);
        for (const l of d.sent) i.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function C5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(ch).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : ds(l.sender) && h >= ny ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && ds(l.recipient) && l.amount > 0n).sort(ch), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, g) => {
    let h = g;
    for (const b of l) {
      if (h <= 0n) break;
      const m = b.left < h ? b.left : h;
      b.left -= m, h -= m;
    }
    return h;
  };
  for (const l of o) {
    const g = f(s.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && f(s, g);
  }
  if (f(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, h = d.get(g);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function B5(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, d) => f.newest - d.newest), r = t.find((f) => f.kind === "gift"), s = t.filter((f) => f.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((f, d) => f + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((f, d) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function uh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const wc = ["prepared", "signed", "unknown", "pending"], T5 = 30 * 6e4, Ms = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, M5 = 3e3, fh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function _5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = !1, d = !1, l = !1, g = null, h = !1, b = "", m = "", k, S = null, T, w = [], C, I = -1 / 0;
  const O = /* @__PURE__ */ new Set();
  let X = null, F = !1, U = 0, x = null, B = !1, P = null, Z = !1, Q = null, Y = !1, Ht = !1, oe = !1, ne = !1, A = !1, N = 0, it = null, dt = Promise.resolve();
  const ut = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Yi.toString()), It = (y) => !!i && !(i.features ?? []).includes(y), Tt = (y, L) => `xtrata.ppp.v1.${y}:${L}`, Qt = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const L = JSON.parse(t.store.get(Tt("entries", y)) || "[]");
      return Array.isArray(L) ? L : [];
    } catch {
      return [];
    }
  }, Nt = (y) => {
    const L = [y, ...Qt(y.address).filter((G) => !(G.txid === y.txid && G.kind === y.kind))].slice(0, 200);
    t.store.set(Tt("entries", y.address), JSON.stringify(L));
  }, me = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Tt("on", y)) !== "0", Ze = (y) => {
    i != null && i.address && t.store.set(Tt("on", i.address), y ? "1" : "0");
  }, M = () => Qt().filter((y) => wc.includes(y.status)), R = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(Tt("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, j = (y) => {
    i != null && i.address && t.store.set(Tt("deposit", i.address), JSON.stringify(y));
  }, at = () => M().filter((y) => t.now() - y.created > T5 && O.has(y.txid)), lt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Et = () => lt() && !(i != null && i.linked), Lt = () => {
    const y = t.main();
    return !Et() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, jt = (y) => Tt("return-to", y), ue = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const L = t.store.get(jt(y));
    return L && ds(L) && L !== y ? L : void 0;
  }, xe = (y = i == null ? void 0 : i.address) => X && X.for === y ? X.res : null;
  function u() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = ue();
    if (y) return { to: y, kind: "chosen" };
    const L = xe();
    if (L != null && L.ok && L.funder) return { to: L.funder, kind: "funder" };
  }
  const E = (y) => Tt("gift", y);
  function v() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((P == null ? void 0 : P.for) === y) return P.info;
    try {
      const L = JSON.parse(t.store.get(E(y)) || "null");
      return L && typeof L.returnTo == "string" && typeof L.treasury == "string" ? L : null;
    } catch {
      return null;
    }
  }
  async function q() {
    var ot;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((ot = e == null ? void 0 : e.gifts) != null && ot.enabled) || Z) return;
    const L = (P == null ? void 0 : P.for) === y ? P : null, G = L ? L.ok ? L.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (L && t.now() - L.at < G) return;
    Z = !0;
    const J = v();
    try {
      const W = await t.giftInfo(y);
      P = { for: y, info: W, ok: !0, at: t.now() }, t.store.set(E(y), JSON.stringify(W));
    } catch {
      P = { for: y, info: J, ok: !1, at: t.now() };
    } finally {
      Z = !1;
    }
  }
  const nt = () => Qt().reduce((y, L) => wc.includes(L.status) ? y + BigInt(L.amount || "0") + BigInt(L.fee || "0") : y, 0n);
  function st() {
    if (o === void 0) return 0;
    const y = o - nt() - BigInt(D.length) * Ir(ut());
    return y > 0n ? oh(y, ut()) : 0;
  }
  const Gt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING";
  function zt() {
    var L;
    if (!((L = v()) != null && L.player)) return null;
    const y = (G, J) => ({ reason: G, text: J });
    switch (Xt()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return R() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", Gt);
      case "ready":
        return !me() || !(i != null && i.session) || i.session.playsLeft < 1 ? y("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : oe ? st() < 1 ? y("out", Gt) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const ke = 3 * 6e4, Lr = () => !!v() && !!t.history && !(i != null && i.linked);
  async function Cr() {
    const y = i.address, L = v(), { balance: G, nonce: J } = await t.chain.account(y), ot = await t.history(y, !0);
    if (!ot.ok) return null;
    const W = C5({ self: y, balance: G, inbound: ot.inbound, outgoing: ot.outgoing, gift: { sender: L.treasury, payer: L.returnTo } });
    if (!W.ok) return null;
    const ft = B5(W.parts, Lo);
    return { balance: G, nonce: J, parts: W.parts, steps: ft.steps, tooSmall: ft.tooSmall.length };
  }
  const Br = () => Y ? { state: "unavailable" } : !Q || t.now() - Q.at > ke || o !== void 0 && o !== Q.balance ? { state: "none" } : Q.plan;
  function Xt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = t.main();
    if (!Et()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Lt() ? "wrong-wallet" : i.state === "known" ? "locked" : !Et() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > Fs ? "over" : o < fs + Ir(ut()) ? "fund" : "ready" : "loading";
  }
  const As = () => {
    var y, L, G, J;
    return {
      step: Xt(),
      busy: c,
      message: b,
      error: m,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : o5(o, ut()),
      playsLeft: o === void 0 ? 0 : oh(o, ut()),
      allowance: o === void 0 ? Fs : ah(o, BigInt(((y = R()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: me(),
      entries: Qt(),
      depositTxid: ((L = R()) == null ? void 0 : L.txid) ?? k,
      depositPending: !!R(),
      walletOutdated: It("like"),
      linkedListening: C && C === t.main() ? w.map((ot) => ot.listening) : [],
      serverLinked: !!S && T === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: at().length,
      armed: ne,
      queued: D.length,
      solo: Et(),
      returnTo: (G = u()) == null ? void 0 : G.to,
      returnToKind: (J = u()) == null ? void 0 : J.kind,
      funderState: (() => {
        const ot = xe();
        return ot ? ot.ok ? ot.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const ot = xe();
        return !!ot && ot.ok && ot.distinct > 1;
      })(),
      walletCannotSolo: Et() && It("standalone"),
      walletCannotMulti: It("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((ot) => ot !== t.main() && ot !== (i == null ? void 0 : i.linked)),
      creditedTo: Et() && (i != null && i.address) && (x == null ? void 0 : x.for) === i.address && x.main ? x.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Tt("created", i.address)) === "1",
      gift: (() => {
        const ot = v();
        return ot ? { player: ot.player, from: ot.from, source: ot.source, amount: ot.amount } : null;
      })(),
      giftPlays: v() ? st() : 0,
      giftStop: zt(),
      returnPlan: Br()
    };
  }, Bt = (y, L = "") => {
    b = y, m = L, t.changed();
  };
  async function ct(y, L) {
    if (!c) {
      c = y, m = "", t.changed();
      try {
        await L();
      } catch (G) {
        const J = G instanceof Error ? G.message : String(G);
        m = /Cancelled in the listening wallet/.test(J) ? "" : J, m || (b = "Not now. Nothing was signed.", A = !0);
      } finally {
        c = null, await Ge(!0);
      }
    }
  }
  const Mt = () => !!(e != null && e.enabled) && e.here && (Et() || !!t.main() && e.allowed), Kt = () => Mt() && !Lt(), pe = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Qe = () => {
    if (Lt()) throw new Error(pe());
  };
  async function kn() {
    if (!Mt()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Ne = (y) => {
    const L = t.main();
    return y.request("listening.status", L ? { main: L } : void 0);
  };
  async function Se(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function Tr(y) {
    if ((C !== y || t.now() - I >= 6e4) && (w = await t.links(y), C = y, I = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const L = `${y}:${i.address}`;
    T === L && S || (S = w.find((G) => G.listening === i.address) ?? null, T = L);
  }
  async function pi() {
    const y = i == null ? void 0 : i.address;
    if (!Et() || !y || i != null && i.linked || !t.funder || F || !o || o <= 0n) return;
    const L = xe(y);
    if (L != null && L.ok && L.funder) return;
    const G = L != null && L.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, U - 1), 30 * 6e4);
    if (!(X && X.for === y && t.now() - X.at < G)) {
      F = !0;
      try {
        X = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        X = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        F = !1;
      }
      U = X.res.ok ? 0 : U + 1;
    }
  }
  async function $s() {
    const y = i == null ? void 0 : i.address;
    if (!(!Et() || !y || i != null && i.linked || !t.mainOf || B) && !(x && x.for === y && (x.ok || t.now() - x.at < 6e4))) {
      B = !0;
      try {
        x = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        x = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        B = !1;
      }
    }
  }
  async function vs() {
    var ot;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let L, G = !1;
    for (const W of M())
      try {
        const ft = await t.chain.transaction(W.txid);
        if (!ft) {
          if (O.add(W.txid), t.now() - W.created > 15 * 6e4 && (L ?? (L = await t.chain.confirmedNonce(y))), L !== void 0 && L > BigInt(W.nonce)) {
            Nt({ ...W, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((W.status === "unknown" || W.status === "signed") && W.raw)
            try {
              await t.chain.broadcast(W.raw, W.txid), Nt({ ...W, status: "pending" });
            } catch (Ot) {
              Ms(Ot) && Nt({ ...W, status: "failed", note: Ot.message, raw: void 0 });
            }
          continue;
        }
        O.delete(W.txid);
        const At = String(ft.tx_status);
        if (At === "success" && ft.canonical !== !1 && ft.is_unanchored === !1) {
          if (Nt({ ...W, status: "confirmed", confirmedAt: t.now(), actualFee: String(ft.fee_rate ?? W.fee), raw: void 0 }), G = !0, W.kind === "like" && (h = !0, W.status !== "confirmed" && typeof W.liked == "boolean"))
            try {
              (ot = t.likeConfirmed) == null || ot.call(t, W.song, W.liked);
            } catch {
            }
        } else At.startsWith("abort_") || At.startsWith("dropped_") ? Nt({ ...W, status: "failed", note: At, raw: void 0 }) : W.status !== "pending" && Nt({ ...W, status: "pending" });
      } catch {
      }
    const J = R();
    if (J)
      try {
        const W = await t.chain.transaction(J.txid), ft = String((W == null ? void 0 : W.tx_status) ?? "");
        (ft === "success" && W.is_unanchored === !1 || ft.startsWith("abort_") || ft.startsWith("dropped_") || !W && t.now() - J.at > 2 * 36e5) && (j(null), a = -1 / 0);
      } catch {
      }
    return G;
  }
  async function Ge(y = !1) {
    var L;
    try {
      const G = t.main();
      if ((y || !e || r !== G || t.now() - n > 3e5) && (e = await t.config(G), n = t.now(), r = G), !e.enabled || !e.here || !Et() && (!G || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ne && Le(), t.changed();
        return;
      }
      await kn(), i = await Ne(s), Lt() && i.state === "unlocked" && (Kn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Ne(s)), G && e.allowed && await Tr(G), await Se(y), await pi(), await $s(), await q(), await vs() && await Se(!0);
    } catch (G) {
      m = G instanceof Error ? G.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Xt() === "locked" ? Mr() : ne && Le(), h) {
      h = !1;
      try {
        (L = t.likesChanged) == null || L.call(t);
      } catch {
      }
    }
    t.changed(), D.length && !Gn && gi();
  }
  async function Fn(y, L) {
    var W;
    Qe();
    const G = !(i != null && i.address) || me(i.address), J = i != null && i.linked ? (W = t.nameOf) == null ? void 0 : W.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: G ? jn() : void 0, anyPasskey: L, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), i = await Ne(y), G && (me(i.address) ? await zn() : await y.request("listening.stop")), Bt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ot = g;
    g = null, ot && t.now() - ot.at < 12e4 && setTimeout(() => void Ge(!0).then(() => yi(ot)), 0);
  }
  function Mr() {
    ne || c || A || N >= 3 || !s || !(i != null && i.address) || (ne = !0, dt = (async () => {
      try {
        await Fn(s, !1), N = 0;
      } catch (y) {
        const L = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(L) ? it || (A = !0, Bt("Not now. Nothing was signed.")) : /did not answer/.test(L) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (N++, m = L);
      } finally {
        ne = !1;
        const y = it;
        it = null, y ? await y() : await Ge(!0);
      }
    })());
  }
  async function Le(y) {
    ne && (it = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await dt), y && await y(), t.changed();
  }
  const jn = () => ({
    fee: ut().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Fs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function zn() {
    if (!(i != null && i.address)) return !1;
    if (oe || (oe = await t.tabLock(i.address)), !oe)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Rn(y, L) {
    const G = i.address, { balance: J, nonce: ot } = L ?? await t.chain.account(G);
    o = J;
    const W = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: J.toString(),
      nonce: ot.toString(),
      fee: Lo.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (W.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ft = y.mode === "amount" ? y.amount : y.mode === "all" ? J - Lo : J - Fs - Lo, At = _u(W.raw);
    if (Nn(At.payload.recipient).value !== y.to || String(At.payload.amount) !== W.amount || ft !== void 0 && W.amount !== ft.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Ot = {
      id: fh(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: W.recipient,
      amount: W.amount,
      fee: W.fee,
      nonce: ot.toString(),
      created: t.now(),
      status: "signed",
      raw: W.raw,
      txid: W.txid
    };
    t.validate(Ot), Nt(Ot);
    try {
      await t.chain.broadcast(W.raw, W.txid), Nt({ ...Ot, status: "pending" });
    } catch (cn) {
      throw Nt({ ...Ot, status: "unknown", note: cn.message }), cn;
    }
    return W;
  }
  async function Is(y) {
    if (M().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (It("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const L = await Cr().catch(() => null);
    if (!L)
      throw Q = null, Y = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Y = !1, o = L.balance;
    const G = { balance: L.balance, nonce: L.nonce };
    if (y === "excess") {
      const At = uh(L.parts) ?? ue();
      if (!At) throw new Error("Choose where to send the excess first.");
      await Rn({ mode: "excess", to: At, linked: !1 }, G), Q = null, Bt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = L.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!Q && Q.balance === L.balance && t.now() - Q.at <= ke && Q.steps.length === J.length && Q.steps.every((At, Ot) => At.to === J[Ot].to && At.mode === J[Ot].mode && At.send === J[Ot].send))) {
      Q = {
        at: t.now(),
        balance: L.balance,
        steps: J,
        parts: L.parts,
        plan: { state: "ready", steps: J.map((At) => ({ to: At.to, kind: At.kind, send: At.send.toString() })), kept: L.tooSmall, excess: uh(L.parts) }
      }, Bt(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const W = J[0], ft = W.to ?? ue();
    if (!ft) throw new Error("Choose where to send the rest first.");
    if (W.mode === "amount" && It("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Rn({ mode: W.mode, to: ft, linked: !1, ...W.mode === "amount" ? { amount: W.send } : {} }, G), Q = null, J.length === 1 ? (Ze(!1), Bt("Returned ✓ Paying is off.")) : Bt(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const z = {
    forceRefresh: () => Ge(!0),
    create: () => ct("Waiting for your passkey…", async () => {
      const y = await kn();
      await y.request("listening.unlock", { mode: "create", terms: jn(), ...t.main() ? { main: t.main() } : {} }), i = await Ne(y), i.address && t.store.set(Tt("created", i.address), "1"), Ze(!0), Bt(Et() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await zn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (y, L) => {
      !(i != null && i.address) || R() || (j({ txid: y, amount: L.toString(), at: t.now() }), a = -1 / 0, P = null, Bt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (y = !1) => {
      const L = () => ct("Waiting for your passkey…", async () => Fn(await kn(), y));
      return ne ? y ? It("cancel") ? (Bt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Le(async () => {
        (Xt() === "locked" || Xt() === "intro") && await L();
      }) : dt : L();
    },
    link: () => ct("Sign in your wallet…", async () => {
      Qe();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const L = (await t.links(y)).find((G) => G.listening === i.address);
      if (L)
        await s.request("listening.link", { main: y, issued: L.issued, mainSignature: L.mainSignature });
      else {
        const G = { main: y, listening: i.address, issued: t.now() }, J = await t.signWithMain(y, E5(G)), ot = await s.request("listening.link", { main: y, issued: G.issued, mainSignature: J });
        await t.saveLink({ ...G, mainSignature: J, listeningSignature: ot.listeningSignature }), I = -1 / 0;
      }
      Bt("Linked ✓");
    }),
    deposit: () => ct("Approve the deposit in your wallet…", async () => {
      Qe();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (R()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Se(!0);
      const L = ah(o ?? 0n);
      if (L <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      k = await t.deposit(y, i.address, L), k && j({ txid: k, amount: L.toString(), at: t.now() }), Bt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => ct("Confirm in the listening wallet…", async () => {
      if (!Kt()) throw new Error("Connect your wallet first.");
      await zn(), await s.request("listening.approveSession", jn()), Ze(!0), Bt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ct("Clearing…", async () => {
      for (const y of at())
        await t.chain.transaction(y.txid) || Nt({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Bt("Cleared ✓");
    }),
    switchOff: () => ct("Switching off…", async () => {
      Kn(), await (s == null ? void 0 : s.request("listening.stop")), Ze(!1), Bt("Paying is off. Music stays free.");
    }),
    lock: () => ct("Locking…", async () => {
      Kn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Bt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const L = String(y ?? "").trim();
      if (!(i != null && i.address)) return Bt("", "Unlock the listening wallet first.");
      if (!ds(L)) return Bt("", "Enter a standard mainnet address (it starts with SP).");
      if (L === i.address) return Bt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(jt(i.address), L), Bt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(jt(i.address), ""), t.changed();
    },
    returnFunds: (y) => ct("Check the return in the listening wallet…", async () => {
      if (!Kt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Lr()) return Is(y);
      const L = u();
      if (!L) throw new Error(Et() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (L.kind !== "linked" && It("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (M().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Rn({ mode: y, to: L.to, linked: L.kind === "linked" }), y === "all" && Ze(!1), Bt(y === "all" ? L.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, D = [], ce = 10, ge = 30 * 6e4;
  let Gn = !1;
  const ks = () => f || !!c || d || l, Kn = () => {
    D.length && (D.length = 0, t.changed());
  };
  async function Vn(y) {
    if (!D.some((L) => L.id === y.id) && !Qt().some((L) => L.id === y.id) && (D.push({ ...y, at: t.now() }), D.length > ce && D.shift()), ks() || M().length) {
      const L = D.length;
      b = `Queued ${L === 1 ? "this song" : L + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await gi();
  }
  async function gi() {
    if (!Gn) {
      Gn = !0;
      try {
        for (; D.length; ) {
          for (; D.length && t.now() - D[0].at > ge; ) D.shift();
          if (!D.length || ks() || await Da(D[0]) === "wait") return;
          D.shift();
        }
      } finally {
        Gn = !1, t.changed();
      }
    }
  }
  async function Da(y) {
    var L;
    f = !0;
    try {
      await Ge();
      const G = Xt();
      if (G === "loading") return "wait";
      if (G !== "ready" || !me() || !(i != null && i.session) || i.session.playsLeft < 1 || !oe) return "done";
      if (M().length) return "wait";
      Ht || (await t.chain.verify(), Ht = !0);
      const J = i.address, { balance: ot, nonce: W } = await t.chain.account(J);
      o = ot, a = t.now();
      const ft = await t.chain.owner(yc, y.song);
      if (ft === J || ft === t.main()) return "done";
      const At = await s.request("listening.signPlay", {
        core: yc,
        song: y.song,
        receipt: y.id,
        fee: ut().toString(),
        nonce: W.toString(),
        balance: ot.toString()
      }), Ot = {
        id: y.id,
        address: J,
        kind: "play",
        core: yc,
        song: y.song,
        recipient: ft,
        amount: "50",
        fee: ut().toString(),
        nonce: W.toString(),
        created: t.now(),
        status: "signed",
        raw: At.raw,
        txid: At.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(Ot), Nt(Ot);
      const cn = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(At.raw, At.txid), Nt({ ...Ot, status: "pending" }), b = `♪ Paid ${cn}`, m = "";
      } catch (ye) {
        Nt({ ...Ot, status: Ms(ye) ? "failed" : "unknown", note: ye.message, ...Ms(ye) ? { raw: void 0 } : {} }), m = ye.message;
      }
      return i = await Ne(s), "done";
    } catch (G) {
      const J = G instanceof Error ? G.message : "payment unavailable";
      return (L = v()) != null && L.player ? (b = "Payment is taking a moment: " + J, "wait") : (b = "This song played free: " + J, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Fa(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Xt()) || It("like") ? !1 : (yi(y), !0);
  }
  async function yi(y) {
    const L = y.title ? `“${y.title}”` : `song #${y.song}`, G = (Ue) => {
      var ln;
      m = Ue, b = "";
      try {
        (ln = t.likeFailed) == null || ln.call(t, y.song);
      } catch {
      }
      t.changed();
    }, J = Xt(), ot = t.main(), W = Et() ? i == null ? void 0 : i.address : ot;
    if (J === "locked") {
      g = { ...y, at: t.now() }, Bt(`Unlock to like ${L}. It sends straight after.`);
      return;
    }
    if (J === "wrong-wallet") return G(pe());
    if (J === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Et() && It("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (J === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (J === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J !== "ready" || !W) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!oe) return G("Pay-per-play is running in another tab. Like from that tab.");
    const ft = Qt().find((Ue) => Ue.kind === "like" && Ue.song === y.song);
    if (ft && wc.includes(ft.status))
      return G(`Your last like for ${L} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((ft == null ? void 0 : ft.status) === "confirmed" && t.now() - (ft.confirmedAt ?? 0) < M5)
      return G(`Your like for ${L} has only just confirmed. Try again in a moment.`);
    let At;
    l = !0;
    try {
      At = t.likeState ? (await t.likeState(W, y.song)).by : y.likedBy ?? [];
    } catch {
      At = y.likedBy;
    } finally {
      l = !1;
    }
    if (!At) return G(`Could not check ${L} right now. Try the heart again.`);
    const Ot = i.address, ye = ((ft == null ? void 0 : ft.status) === "confirmed" && typeof ft.liked == "boolean" && t.now() - (ft.confirmedAt ?? ft.created) < 5 * 6e4 ? ft.liked : void 0) ?? At.includes(Ot);
    if (!ye && At.some((Ue) => Ue !== Ot)) return G(Et() ? `${L} was liked from another wallet of yours. Unlike it there.` : `${L} was liked from your main wallet${At.includes(ot) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ja({ song: y.song, liked: !ye, title: y.title, artist: y.artist });
  }
  async function ja(y) {
    var J, ot, W;
    if (d) {
      Bt("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const L = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, G = t.wait ?? ((ft) => new Promise((At) => setTimeout(At, ft)));
    try {
      Bt(`${y.liked ? "Liking" : "Unliking"} ${L}…`);
      const ft = t.now() + 12e4;
      for (; f || M().length; ) {
        if (t.now() > ft) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Ge(!0);
      }
      if (Xt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const At = i.address, { balance: Ot, nonce: cn } = await t.chain.account(At);
      o = Ot, a = t.now();
      const ye = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: ih.toString(),
        nonce: cn.toString(),
        balance: Ot.toString()
      }), Ue = {
        id: fh(),
        address: At,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: ih.toString(),
        nonce: cn.toString(),
        created: t.now(),
        status: "signed",
        raw: ye.raw,
        txid: ye.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(Ue), Nt(Ue);
      try {
        await t.chain.broadcast(ye.raw, ye.txid), Nt({ ...Ue, status: "pending" }), b = `${y.liked ? "♥ Liked" : "Unliked"} ${L}`, m = "";
        try {
          (J = t.likeSent) == null || J.call(t, y.song, y.liked);
        } catch {
        }
      } catch (ln) {
        if (Nt({ ...Ue, status: Ms(ln) ? "failed" : "unknown", note: ln.message, ...Ms(ln) ? { raw: void 0 } : {} }), m = ln.message, Ms(ln)) try {
          (ot = t.likeFailed) == null || ot.call(t, y.song);
        } catch {
        }
      }
      i = await Ne(s);
    } catch (ft) {
      m = "Like not sent: " + (ft instanceof Error ? ft.message : "the listening wallet is unavailable");
      try {
        (W = t.likeFailed) == null || W.call(t, y.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), gi();
    }
  }
  return { snapshot: As, refresh: Ge, onListened: Vn, heart: Fa, toggleLike: yi, ...z };
}
const ry = ["Connect", "Passkey", "Link & fund", "Listen"], sy = ["Passkey", "Add 1 STX", "Listen"], $l = (t) => t ? sy : ry;
function N5(t) {
  if (t.solo) return U5(t);
  const e = ry.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function U5(t) {
  const e = sy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function P5(t, e) {
  return !e || e.at >= $l(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const H5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function O5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !H5(r.id)));
}
const D5 = {}, F5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, j5 = (t) => {
  const e = D5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, z5 = (t) => `/hiro/${t}`, R5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, G5 = (t) => {
  const e = j5(t);
  if (e)
    return [R5(e)];
  const n = F5[t];
  return typeof window < "u" ? [`${window.location.origin}${z5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, K5 = {}, dh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, V5 = "xtrata.log.enabled", q5 = "xtrata.log.level", W5 = "xtrata.log.tags", X5 = "xtrata.log.dedupe", Bo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Y5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Z5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Q5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, J5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, t$ = () => {
  const t = K5 ?? {}, e = Bo(V5) ?? t.VITE_LOG_ENABLED, n = Bo(q5) ?? t.VITE_LOG_LEVEL, r = Bo(W5) ?? t.VITE_LOG_TAGS, s = Bo(X5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Y5(e),
    level: Z5(n) ?? "warn",
    tags: J5(r),
    dedupe: Q5(s)
  };
}, e$ = (t, e, n) => !t.enabled || dh[n] < dh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), n$ = (t, e, n, r) => {
  const s = t$();
  if (!e$(s, e, t) || s$(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, r$ = /* @__PURE__ */ new Set();
let hh = null;
const s$ = (t, e, n, r, s) => (hh !== t && (r$.clear(), hh = t), !1), i$ = (t, e, n) => n$("debug", t, e, n), o$ = {}, a$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, c$ = (t) => {
  const e = o$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : a$[t];
}, l$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, u$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return l$.test(n) ? n : null;
}, f$ = (t) => t.replace(/\/+$/, ""), d$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), ph = (t) => {
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
}, _s = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, h$ = (t) => {
  var c, f;
  let e;
  try {
    e = Nn(p6(t));
  } catch {
    return null;
  }
  const n = _s(e);
  if (!n || n.success === !1)
    return null;
  const r = _s(n.value), s = _s(r == null ? void 0 : r.value), i = _s(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = ph((c = _s(i.name)) == null ? void 0 : c.value), a = ph((f = _s(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : u$(`${o}.${a}`);
}, p$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${f$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Hg(xg(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : h$(i.result);
}, g$ = async (t) => {
  const e = t.address.trim();
  if (!zs(e))
    return null;
  const n = c$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of G5(t.network))
    try {
      return await p$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return i$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: d$(r)
  }), null;
};
function y$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((f) => {
      c.pending = !1, f && (c.name = f, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = i.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && o(a, c) : (c = { name: null, pending: !1 }, i.set(a, c), o(a, c)), c.name;
    }
  };
}
const gh = Object.freeze({
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
function w$(t, e = "") {
  return Object.hasOwn(gh, String(t)) ? gh[String(t)] : e;
}
const yh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function b$(t, e = "") {
  return Object.hasOwn(yh, String(t)) ? yh[String(t)] : e;
}
const m$ = 100000n, wh = 1000000n, x$ = 3000n, S$ = (t, e) => `${t}#gift=${e}`, E$ = 100, bh = (t, e = Yi) => t <= fs ? 0 : Number((t - fs) / Ir(e)), mh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), iy = "xtrata.xyz/radio/gifts", A$ = "Create Xtrata radio gift links paid from the gift treasury", $$ = (t) => ({
  domain: ls({ name: de(iy), version: de("1"), "chain-id": Sn(1) }),
  message: ls({
    purpose: de(A$),
    admin: de(t.admin),
    count: Sn(t.count),
    amount: Sn(BigInt(t.amount)),
    label: de(t.label),
    issued: Sn(t.issued),
    ...t.player ? { player: de(t.player) } : {}
  })
}), xh = 40, v$ = "Create an Xtrata radio gift player", I$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function Sh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && I$.test(t) : !n;
}
function k$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Sh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Sh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > xh) throw new Error(`A player holds 1 to ${xh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: null };
}
const L$ = (t) => A0(C0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), C$ = (t) => ({
  domain: ls({ name: de(iy), version: de("1"), "chain-id": Sn(1) }),
  message: ls({
    purpose: de(v$),
    admin: de(t.admin),
    player: de(t.hash),
    issued: Sn(t.issued)
  })
}), Eh = (t, e = Yi) => fs + BigInt(t) * Ir(e), Ah = [300, 500, 1e3], $h = 1800, bc = /* @__PURE__ */ new Map();
async function oy(t) {
  try {
    return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const e = document.createElement("textarea");
    e.value = t, e.setAttribute("readonly", ""), e.style.position = "fixed", e.style.opacity = "0", document.body.append(e), e.select();
    const n = document.execCommand("copy");
    return e.remove(), n;
  } catch {
    return !1;
  }
}
async function B$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await oy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function ay(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = bc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      bc.set(t, { ...a, until: Date.now() + $h });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        bc.delete(t), s();
      }, $h + 50);
    }
  }, i;
}
const ua = (t, e, n, r, s) => ay(t, e, async () => await oy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Ur = "xtrata.radio.gift.incoming.v1", vh = (t) => "xtrata.radio.gift.mine.v1:" + t, pt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Pr = (t, e, n = "") => {
  const r = pt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ns = (t) => gn(t).replace(/\.?0+$/, "");
function T$(t) {
  let e = null;
  const n = (() => {
    try {
      const M = new URL(location.href), R = new URLSearchParams(M.hash.slice(1)).get("gift") ?? M.searchParams.get("gift");
      return R !== null && (M.searchParams.delete("gift"), history.replaceState(null, "", M.pathname + (M.search || ""))), mh(R) ? R : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const M = JSON.parse(t.store.get(Ur) || "null");
      return mh(M == null ? void 0 : M.code) ? M.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(Ur, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (M) => {
    const R = await M.json().catch(() => ({}));
    if (!M.ok)
      throw M.status === 404 && t.store.set(Ur, null), new Error((R == null ? void 0 : R.error) || "Could not check your gift right now. Reload to try again.");
    const j = R;
    e = { ...e, view: j }, ["claimed", "expired", "refunding", "refunded"].includes(j.status) && t.store.set(Ur, null), t.changed();
  }).catch((M) => {
    e = { ...e, error: M.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(Ur, null), t.changed();
  }, a = (M) => M.from ? t.who(M.from) : M.label ? `Xtrata Radio · ${M.label}` : "Xtrata Radio";
  let c = {};
  const f = (M) => {
    if (c.box) return c.box;
    const R = pt("div", "", "ppp-gift-check");
    c.box = R;
    const j = () => {
      const at = window.turnstile;
      !at || c.rendered || (c.rendered = !0, at.render(R, { sitekey: M, callback: (lt) => {
        c.token = lt, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const at = document.createElement("script");
      at.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", at.async = !0, at.onload = j, document.head.append(at);
    }
    return R;
  };
  let d;
  async function l(M) {
    var R, j;
    if (!(!e || e.claiming || !M.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const at = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: M.listening, turnstile: c.token })
        }), lt = await at.json().catch(() => ({}));
        if (at.status === 503 && /sending another gift/.test((lt == null ? void 0 : lt.error) || "")) {
          e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!at.ok)
          throw (at.status === 404 || at.status === 410 || at.status === 409 && /already had a gift|brand-new/.test((lt == null ? void 0 : lt.error) || "")) && t.store.set(Ur, null), new Error((lt == null ? void 0 : lt.error) || `Could not claim the gift (${at.status}).`);
        e.done = !0, t.store.set(Ur, null), t.giftSent(lt.txid, BigInt(lt.amount));
      } catch (at) {
        e.error = at.message, c.token = void 0;
        try {
          (j = (R = window.turnstile) == null ? void 0 : R.reset) == null || j.call(R, c.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let g = null;
  function h(M) {
    if (!M.listening || !M.depositPending || M.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== M.listening || t.now() - g.at > 3e4) {
      const R = M.listening;
      g = { ...(g == null ? void 0 : g.wallet) === R ? g : {}, wallet: R, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(R)).then((j) => {
        var at, lt;
        (g == null ? void 0 : g.wallet) === R && (g.state = (at = j == null ? void 0 : j.gift) == null ? void 0 : at.state, g.problem = ((lt = j == null ? void 0 : j.gift) == null ? void 0 : lt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [pt("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function b(M) {
    var u, E;
    const R = h(M);
    if (!e || ["off", "elsewhere"].includes(M.step)) return R;
    const j = e.view;
    if (e.error && !j) return [pt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!j) return [pt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return R;
    if (j.status === "claimed" || j.status === "claiming") return [pt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(j.status)) return [pt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (j.status === "pending-deposit") return [pt("p", `🎁 ${a(j)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (!!M.listening && (!M.createdHere || !!M.linked || !!M.creditedTo || (M.balance ?? 0n) > 0n || M.entries.length > 0))
      return [pt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Pr("Forget this gift link here", o, "quiet")];
    const lt = BigInt(j.amount), Et = bh(lt).toLocaleString(), jt = [pt("p", j.player ? `🎁 ${a(j)} sent you “${j.player.title}”${j.player.subtitle ? ` by ${j.player.subtitle}` : ""}: ${j.player.tracks.length} ${j.player.tracks.length === 1 ? "song" : "songs"} and ${Et} plays of on-chain music.` : `🎁 ${a(j)} sent you ${Ns(lt)} STX of on-chain music: about ${Et} paid plays.`, "ppp-gift")], ue = !!M.listening && M.createdHere && !M.linked && !M.creditedTo && M.step === "fund" && (M.balance ?? 1n) === 0n && !M.depositPending && !M.entries.length, xe = (E = (u = M.gate) == null ? void 0 : u.gifts) == null ? void 0 : E.turnstileSiteKey;
    return ue ? (xe && !c.token ? jt.push(pt("p", "One quick check and it is yours:", "ppp-mute"), f(xe)) : !e.claiming && !e.error && !e.waiting && l(M), (e.claiming || e.waiting) && jt.push(pt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && jt.push(pt("p", e.error, "ppp-bad"), Pr("Try again", () => {
      e.error = void 0, l(M);
    }))) : M.step === "intro" ? jt.push(pt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : M.listening && M.linked ? jt.push(pt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Pr("Forget this gift link here", o, "quiet")) : M.listening && (M.balance ?? 0n) > 0n && jt.push(pt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Pr("Forget this gift link here", o, "quiet")), jt;
  }
  async function m(M, R, j) {
    var at;
    try {
      const lt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(M));
      if ((at = lt == null ? void 0 : lt.gift) != null && at.returnTo) return { ok: !0, funder: lt.gift.returnTo, txId: lt.gift.txid ?? void 0, amount: lt.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return R();
  }
  const k = pt("div", "", "ppp-gift-fold");
  let S = 250000n, T = "", w = "", C = null;
  const I = (M) => {
    try {
      const R = JSON.parse(t.store.get(vh(M)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, O = (M, R) => t.store.set(vh(M), JSON.stringify(R.slice(0, 50)));
  let X = 0;
  async function F(M) {
    const R = I(M);
    for (const j of R)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await t.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (at) {
          j.error = at.message;
        }
    O(M, R), t.changed();
  }
  async function U(M) {
    if (T) return;
    T = "Starting your gift…", w = "", t.changed();
    let R = null;
    try {
      R = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: M, amount: S.toString() }) });
      const j = I(M);
      j.unshift({ id: R.id, code: R.code, amount: S.toString(), at: t.now() }), O(M, j), T = "Approve the gift in your wallet…", t.changed();
      const at = await t.pay(M, R.depositTo, BigInt(R.deposit), R.memo), lt = I(M), Et = lt.find((Lt) => Lt.id === R.id);
      Et && (Et.txid = at, Et.view = { status: "pending-deposit", amount: S.toString(), source: "friend", from: M, label: "", expires: 0 }), O(M, lt), w = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", F(M);
    } catch (j) {
      w = j.message || "Not sent.";
    } finally {
      T = "", t.changed();
    }
  }
  const x = (M) => "xtrata.radio.gift.players.v1:" + M, B = (M) => {
    try {
      const R = JSON.parse(t.store.get(x(M)) || "[]");
      return Array.isArray(R) ? R.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function P(M, R) {
    if (!T) {
      T = "Checking the player…", w = "", t.changed();
      try {
        const j = R.tracks.split(/[\s,]+/).filter(Boolean).map((ue) => Number(ue.replace(/^#/, ""))), at = k$({ title: R.title.trim(), subtitle: R.subtitle.trim(), tracks: j, cover: null });
        T = "Sign in your wallet…", t.changed();
        const lt = { admin: M, hash: L$(at), issued: t.now() }, Et = await t.sign(M, C$(lt));
        T = "Making the player…", t.changed();
        const Lt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: at, request: lt, signature: Et }) }), jt = B(M).filter((ue) => ue.id !== Lt.id);
        jt.unshift({ id: Lt.id, title: Lt.title, tracks: Lt.tracks }), t.store.set(x(M), JSON.stringify(jt.slice(0, 30))), w = `${Lt.existing ? "That player already exists" : "Player made"} ✓ “${Lt.title}” · ${Lt.tracks} songs. Pick it below for a campaign.`;
      } catch (j) {
        w = j.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  async function Z(M, R, j, at, lt) {
    if (!T) {
      T = "Sign in your wallet…", w = "", C = null, t.changed();
      try {
        const Et = { admin: M, count: R, amount: j.toString(), label: at, issued: t.now(), ...lt ? { player: lt } : {} }, Lt = await t.sign(M, $$(Et));
        T = "Making links…", t.changed();
        const jt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: Et, signature: Lt }) });
        C = { codes: jt.codes, amount: jt.amount };
      } catch (Et) {
        w = Et.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  const Q = (M, R) => S$(M || location.origin + "/radio.html", R), Y = (M) => B$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: M }), Ht = pt("input");
  Ht.type = "range", Ht.min = String(m$), Ht.max = String(wh), Ht.step = "50000", Ht.value = String(S), Ht.setAttribute("aria-label", "Gift amount");
  const oe = pt("p", "", "ppp-gift-amount"), ne = Pr("", () => {
    const M = t.main();
    M && U(M);
  }, "primary"), A = () => {
    oe.textContent = N(), ne.textContent = `Gift ${Ns(S)} STX`;
  };
  Ht.oninput = () => {
    S = BigInt(Ht.value), A();
  };
  const N = () => `${Ns(S)} STX · about ${bh(S).toLocaleString()} paid plays · you pay ${Ns(S + x$)} STX with the network fee`;
  A();
  const it = pt("input");
  it.type = "number", it.min = "1", it.max = String(E$), it.value = "10", it.setAttribute("aria-label", "How many links");
  const dt = pt("input");
  dt.type = "number", dt.min = "0.1", dt.max = "1", dt.step = "0.05", dt.value = String(Number(Eh(Ah[0])) / 1e6), dt.setAttribute("aria-label", "STX per link");
  const ut = pt("input");
  ut.maxLength = 60, ut.placeholder = "Title, e.g. Proof of Sound", ut.setAttribute("aria-label", "Player title");
  const It = pt("input");
  It.maxLength = 80, It.placeholder = "Artist (optional)", It.setAttribute("aria-label", "Player subtitle");
  const Tt = pt("textarea");
  Tt.rows = 3, Tt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Tt.setAttribute("aria-label", "Songs");
  const Qt = pt("select");
  Qt.setAttribute("aria-label", "Gift player");
  const Nt = pt("select");
  Nt.setAttribute("aria-label", "Plays per link");
  for (const M of Ah) Nt.append(new Option(`${M.toLocaleString()} plays`, String(Eh(M))));
  Nt.append(new Option("Max (1 STX)", String(wh)), new Option("Custom STX", "")), Nt.onchange = () => {
    Nt.value && (dt.value = String(Number(Nt.value) / 1e6));
  };
  const me = pt("input");
  me.maxLength = 40, me.placeholder = "Label, e.g. Launch week", me.setAttribute("aria-label", "Campaign label");
  function Ze(M) {
    var lt, Et, Lt, jt, ue;
    const R = (lt = M.gate) == null ? void 0 : lt.gifts;
    if (!(R != null && R.enabled) || ["off", "elsewhere", "unsupported"].includes(M.step)) return null;
    const j = t.main(), at = [pt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!j)
      at.push(pt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      ne.disabled = !!T, at.push(Ht, oe, ne), t.now() - X > 3e4 && (X = t.now(), F(j));
      const xe = I(j);
      if (xe.length) {
        const u = pt("ul", "", "ppp-gift-list");
        for (const E of xe.slice(0, 10)) {
          const v = (Et = E.view) == null ? void 0 : Et.status, q = E.error ? E.error : !v || v === "pending-deposit" ? E.txid ? "payment confirming…" : "waiting for your payment" : v === "live" ? "ready to share" : v === "claiming" || v === "claimed" ? "claimed ✓" : v === "refunding" ? "expired · refund on its way" : v === "refunded" ? "expired · refunded to you" : v, nt = pt("li");
          if (nt.append(pt("span", `${Ns(BigInt(E.amount))} STX`, "t"), pt("span", q, ((Lt = E.view) == null ? void 0 : Lt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((jt = E.view) == null ? void 0 : jt.status) === "live") {
            const st = Q(((ue = M.gate) == null ? void 0 : ue.radioUrl) ?? null, E.code);
            nt.append(ua("gift-copy:" + E.id, "Copy link", () => st, "tiny", t.changed), ay("gift-share:" + E.id, "Share", () => Y(st), "tiny", t.changed));
          }
          u.append(nt);
        }
        at.push(u);
      }
      if (R.admin) {
        const u = Pr("Sign and make links", () => {
          const st = BigInt(Math.round(Number(dt.value) * 1e6));
          Z(j, Number(it.value), st, me.value.trim(), Qt.value || void 0);
        }), E = pt("div", "", "ppp-gift-admin"), v = (st, Gt) => {
          const zt = pt("label", st);
          return zt.append(Gt), zt;
        }, q = B(j), nt = Qt.value;
        if (Qt.replaceChildren(new Option("No player (plain gift)", ""), ...q.map((st) => new Option(`${st.title} · ${st.tracks} songs`, st.id))), q.some((st) => st.id === nt) && (Qt.value = nt), E.append(
          pt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ut,
          It,
          Tt,
          Pr("Sign and make player", () => void P(j, { title: ut.value, subtitle: It.value, tracks: Tt.value })),
          pt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          v("Player ", Qt),
          v("Plays each ", Nt),
          v("Links ", it),
          v("STX each ", dt),
          me,
          u
        ), C) {
          const st = C.codes.map((zt) => {
            var ke;
            return Q(((ke = M.gate) == null ? void 0 : ke.radioUrl) ?? null, zt);
          }).join(`
`), Gt = pt("textarea");
          Gt.readOnly = !0, Gt.value = st, Gt.rows = Math.min(8, C.codes.length), E.append(pt("p", `${C.codes.length} links, ${Ns(BigInt(C.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Gt, ua("campaign-copy", "Copy all", () => st, "tiny", t.changed));
        }
        at.push(E);
      }
    }
    return T && at.push(pt("p", T, "ppp-cyan")), w && at.push(pt("p", w, /✓/.test(w) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...at), k;
  }
  return { banner: b, funder: m, renderFold: Ze, liveGift: i, setAside: o };
}
const Ih = document.getElementById("ppp");
Ih && M$(Ih);
function M$(t) {
  var xe;
  const e = ow(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, E) => {
    const v = await fetch(u, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), q = await v.json().catch(() => ({}));
    if (!v.ok) throw new Error((q == null ? void 0 : q.error) || `Request failed (${v.status}).`);
    return q;
  }, o = _5({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var v;
      const E = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((v = E == null ? void 0 : E.find((q) => q.listening === u)) == null ? void 0 : v.main) ?? null;
    },
    saveLink: async (u) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((st, Gt) => {
        s.addEventListener("load", () => st(), { once: !0 }), setTimeout(() => Gt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await E;
      const v = new Zy({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), q = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), nt = (st, Gt) => q.has(st) ? v.request(st, Gt) : Promise.race([
        v.request(st, Gt),
        new Promise((zt, ke) => setTimeout(() => ke(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await nt("listening.status"), { request: nt };
    },
    chain: {
      verify: h5,
      balance: g5,
      account: p5,
      owner: y5,
      broadcast: w5,
      transaction: b5,
      confirmedNonce: async (u) => {
        const E = await Ar(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (u, E) => rh({ ...E, network: "mainnet", stxAddress: u }),
    deposit: (u, E, v) => new Promise((q, nt) => Qd({
      recipient: E,
      amount: v.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new mc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (st) => q(st.txId || ""),
      onCancel: () => nt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: nt
    })),
    validate: m5,
    tabLock: (u) => new Promise((E) => {
      const v = navigator.locks;
      if (!(v != null && v.request)) {
        E(!0);
        return;
      }
      v.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (q) => {
        E(!!q), q && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, E) => {
        try {
          localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    changed: () => Lt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var E, v;
      return a.funder(u, () => v5(u, Ar), !!((v = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && v.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const E = await i("/radio/gift/for?wallet=" + encodeURIComponent(u)), v = E == null ? void 0 : E.gift;
      if (!v) return null;
      if (typeof v.returnTo != "string" || typeof v.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: v.returnTo, from: typeof v.from == "string" ? v.from : null, source: String(v.source ?? ""), amount: String(v.amount ?? "0"), treasury: v.treasury, state: v.state === "sending" ? "sending" : "arrived", player: v.player ?? null };
    },
    history: (u, E) => L5(u, (v) => Ar(v), E),
    likesChanged: () => {
      var u, E;
      (E = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || E.call(u);
    },
    likeState: async (u, E) => {
      const v = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(E) })), q = Array.isArray(v == null ? void 0 : v.rows) ? v.rows.find((nt) => (nt == null ? void 0 : nt.id) === E) : null;
      if (!q || typeof q.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: q.liked, by: Array.isArray(q.by) ? q.by.filter((nt) => typeof nt == "string") : q.liked ? [u] : [] };
    },
    likeSent: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: E } })),
    nameOf: (u) => F(u) ?? void 0,
    likeConfirmed: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: E } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = T$({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, E, v, q) => new Promise((nt, st) => Qd({
      recipient: E,
      amount: v.toString(),
      memo: q,
      stxAddress: u,
      network: new mc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Gt) => nt(Gt.txId || ""),
      onCancel: () => st(new Error("Gift cancelled. Nothing was sent.")),
      onError: st
    })),
    sign: (u, E) => rh({ ...E, network: "mainnet", stxAddress: u }),
    giftSent: (u, E) => o.giftSent(u, E),
    who: (u) => U(u),
    changed: () => Lt(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, E) => {
        try {
          E === null ? localStorage.removeItem(u) : localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    Q();
    const E = Y(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const f = (u) => {
    var v, q;
    const E = window.XtrataRadioListeningIdentity();
    E !== c && (c = E, (q = (v = window.XtrataRadio) == null ? void 0 : v.refreshLikes) == null || q.call(v));
  };
  let d = "", l = null;
  const g = (u) => {
    var st, Gt;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const v = u.step === "off" || u.step === "elsewhere" ? null : ((st = u.gift) == null ? void 0 : st.player) ?? null, q = v ? v.id + ":" + v.tracks.map((zt) => zt.id).join(",") : "";
    q !== d && (E.setGiftPlayer(v ? { id: v.id, title: v.title, subtitle: v.subtitle, tracks: v.tracks.map((zt) => zt.id) } : null), d = q);
    const nt = v ? ((Gt = u.giftStop) == null ? void 0 : Gt.text) ?? null : null;
    nt !== l && (E.setGiftStop(nt), l = nt);
  }, h = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", b = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), m = (u) => {
    const E = Math.round((Date.now() - u) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, k = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, S = (u, E = "", v = "") => {
    const q = document.createElement(u);
    return E && (q.textContent = E), v && (q.className = v), q;
  }, T = (u, E, v = "") => {
    const q = S("button", u, v);
    return q.type = "button", q.onclick = E, q;
  }, w = (u, E) => {
    const v = S("a", u);
    return v.href = E, v.target = "_blank", v.rel = "noopener", v;
  };
  let C = null, I = location.hash === "#give";
  I && history.replaceState(null, "", location.pathname + location.search);
  let O = !1;
  const X = y$((u) => g$({ address: u, network: "mainnet" }), () => Lt(o.snapshot())), F = (u) => X.get(u), U = (u) => F(u) ?? h(u), x = (u) => u.slice(0, 2).map(U).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), B = /* @__PURE__ */ new Map();
  let P = !1;
  const Z = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Q = () => {
    P || (P = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const E of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const v = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(v) && B.set(v, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      Lt(o.snapshot());
    }).catch(() => {
      P = !1;
    }));
  }, Y = (u, E) => {
    const v = B.get(u), q = b$(u, [v == null ? void 0 : v.title, E == null ? void 0 : E.title].find((st) => !Z(st)) || ""), nt = w$(u, (v == null ? void 0 : v.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: q, artist: nt };
  }, Ht = (u) => {
    const { title: E, artist: v } = Y(u.song, u);
    return E ? `“${E}”${v ? ` — ${v}` : ""}` : `Song #${u.song}${v ? ` — ${v}` : ""}`;
  }, oe = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ne = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function A(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function N(u, E, v = "", q) {
    const nt = S("dt", u), st = S("dd", E, v);
    return q && st.append(" ", q), [nt, st];
  }
  const it = document.getElementById("ppp-top"), dt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, ut = () => {
    var E, v;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (u.step === "elsewhere" && ((v = u.gate) != null && v.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), dt();
  };
  it && (it.onclick = ut);
  function It(u) {
    if (!it) return;
    const E = (q, nt, st) => {
      it.hidden = !1, it.className = "ppp-top" + (nt ? " is-" + nt : ""), it.replaceChildren(S("span", "", "dot"), document.createTextNode(q)), it.title = st;
    }, v = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        it.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        it.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${U(u.linked)}`, "warn", `This device's listening wallet belongs to ${U(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(u.entries.some((q) => q.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && v > 0 ? E(`On · ${v.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Tt = document.getElementById("pppNudge"), Qt = document.getElementById("onair");
  (xe = Tt == null ? void 0 : Tt.querySelector("button")) == null || xe.addEventListener("click", () => ut());
  const Nt = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, me = {
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
  function Ze(u) {
    var st;
    if (u.step === "loading") return;
    const E = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, v = u.step === "ready" && u.payingOn && E > 0, q = v ? "" : Nt[u.step] ?? "", nt = v ? "on" : q ? "off" : "";
    if (nt ? document.documentElement.dataset.ppp = nt : delete document.documentElement.dataset.ppp, Qt && (Qt.hidden = !nt, Qt.querySelector(".onair-sub").textContent = v ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), Tt && (Tt.hidden = nt !== "off" || u.step === "fund" && u.depositPending, nt === "off")) {
      const Gt = Math.floor(Number(1000000n / Ir(BigInt(((st = u.gate) == null ? void 0 : st.limits.playFee) ?? "300"))));
      Tt.querySelector(".nudge-t").textContent = "⚠ " + q, Tt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Gt.toLocaleString()} plays, on-chain, straight to the artists.`, Tt.querySelector("button").textContent = me[u.step] ?? "Start paying";
    }
  }
  let M = "";
  function R(u) {
    const E = S("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && E.append(S("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && E.append(S("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const v = S("input");
    v.type = "text", v.placeholder = "SP… address to send returns to", v.autocomplete = "off", v.spellcheck = !1, v.setAttribute("aria-label", "Address to return funds to"), v.value = M, v.oninput = () => {
      M = v.value;
    };
    const q = T(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(v.value), M = "";
    }, "tiny");
    return E.append(v, " ", q), u.returnToKind === "chosen" && E.append(" ", T("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const j = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function at() {
    const u = S("p", j + " ", "ppp-mute");
    return u.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), u;
  }
  let lt = "";
  const Et = (u) => {
    const E = document.documentElement, v = u.solo && !u.main ? u.listening ? h(u.listening) : "new" : "", q = O5() ? "1" : "";
    `${v}|${q}` !== lt && (lt = `${v}|${q}`, v ? E.dataset.pppSolo = v : delete E.dataset.pppSolo, q ? E.dataset.pppWalletInstalled = q : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Lt(o.snapshot()), u);
  function Lt(u) {
    var vs, Ge, Fn, Mr, Le, jn, zn, Rn, Is;
    if (f(), g(u), Et(u), It(u), Ze(u), t.hidden = u.step === "off", t.hidden) return;
    const [E, v] = A(u), q = n(".ppp-state");
    q.textContent = E, q.className = "ppp-state" + (v ? " ppp-state--" + v : ""), q.hidden = !E;
    const nt = !!u.busy || u.armed, st = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (nt || !["intro", "loading"].includes(u.step));
    r.hidden = !st, r.classList.toggle("ppp-frame--rest", !nt && !O);
    const Gt = n(".ppp-frame-label");
    Gt.hidden = !0;
    const zt = N5(u) ?? C;
    C = zt;
    const ke = P5(u, zt);
    n(".ppp-badge").hidden = !ke;
    const Lr = n(".ppp-steps"), Cr = n(".ppp-stage");
    Lr.hidden = Cr.hidden = !ke, zt && ke && (Lr.replaceChildren(...$l(u.solo).map((z, D) => {
      const ce = S("li", "", D < zt.at ? "done" : D === zt.at ? zt.blocked ? "now blocked" : "now" : "");
      return ce.append(S("span", D < zt.at ? "✓" : String(D + 1), "n"), z), D === zt.at && ce.setAttribute("aria-current", "step"), ce;
    })), Cr.textContent = zt.caption, Cr.className = "ppp-stage " + (zt.at >= $l(u.solo).length ? "ppp-ok" : zt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Br = n(".ppp-facts"), Xt = [];
    u.main && ((vs = u.gate) != null && vs.here) && !u.solo && Xt.push(...N("Your wallet", U(u.main), "ppp-addr-short"));
    const As = () => {
      if (!u.listening) return;
      const z = ua("copy-listening", "Copy", () => u.listening || "", "tiny", () => Lt(o.snapshot()));
      Xt.push(...N(u.linked ? "Listening wallet (technical)" : "Listening wallet", h(u.listening), "ppp-addr-short", z));
    };
    if (u.linked || As(), u.listening && u.step !== "intro")
      if (u.linked)
        Xt.push(...N("Credited to", `${U(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), As();
      else if (u.solo) {
        u.creditedTo && Xt.push(...N("Credited to", `${U(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const z = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${U(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Xt.push(...N("Returns go to", u.gift ? z : u.returnTo && !F(u.returnTo) ? z.replace(h(u.returnTo), u.returnTo) : z, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Xt.push(...N("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((Ge = u.gate) != null && Ge.here)) {
      const z = u.linkedListening.map((D) => h(D) + (D === u.listening ? " (this one)" : "")).join(", ");
      Xt.push(...N(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", z, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const z = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Xt.push(...N("Balance", `${gn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, z));
    }
    const Bt = u.entries.find((z) => z.kind === "play");
    Bt && Q(), Bt && Xt.push(...N("Last paid song", `${Ht(Bt)} → ${U(Bt.recipient)}`, oe[Bt.status] || "")), Br.replaceChildren(...Xt), Br.hidden = !Xt.length;
    const ct = [], Mt = [], Kt = [], pe = [], Qe = Ir(BigInt(((Fn = u.gate) == null ? void 0 : Fn.limits.playFee) ?? "300")), kn = `Each song you listen to for 30 seconds sends ${gn(Sl)} STX to whoever holds it, plus a ${gn(Qe - Sl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Ne = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (ct.push(S("p", "Pay artists as you listen.")), (Mr = u.gate) != null && Mr.radioUrl) {
          const D = S("p");
          D.append(w("Open the pay-per-play radio →", u.gate.radioUrl)), ct.push(D);
        }
        Mt.push(S("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const D = [u.linked, ...u.others];
          ct.push(S("p", D.length > 1 ? `This device has listening wallets for ${x(D)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${U(u.linked)}. Connect that wallet to keep paying artists.`)), Mt.push(S("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ct.push(S("p", "Connect your wallet to pay artists as you listen.")), Mt.push(S("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ct.push(S("p", `This device's listening wallet belongs to ${U(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Mt.push(S("p", `You are connected as ${U(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Mt.push(S("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Kt.push(T("Switch wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        }, "primary"));
        break;
      case "not-invited":
        ct.push(S("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ct.push(S("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ct.push(S("p", `Pay artists ${gn(Qe)} STX a song as you listen.`)), Mt.push(S("p", kn)), Mt.push(S("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Mt.push(S("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (ct.push(S("p", `This device already has a listening wallet for ${x(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Mt.push(S("p", `Otherwise, set up a new listening wallet for ${U(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && Mt.push(S("p", `This is the listening wallet for ${U(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && Mt.push(S("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const z = a.liveGift();
        Kt.push(T(z ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${U(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !z && !u.solo && u.main && u.others.length && Kt.push(T("Switch wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), !z && u.solo && Kt.push(T("I have a Stacks wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), Kt.push(T("I already have a listening wallet", () => void o.unlock(!0))), z && Kt.push(T("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (ct.push(S("p", "Locked.", "ppp-mute")), Kt.push(T(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), pe.push(T("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ct.push(S("p", `Link to ${U(u.main)} · free`)), Mt.push(S("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Mt.push(S("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Kt.push(T(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ct.push(S("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((Le = u.gift) != null && Le.player ? ct.push(S("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? ct.push(S("p", "Out of funds · top up to keep paying", "ppp-bad")) : ct.push(S("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Qe)).toLocaleString()} songs`))), (jn = u.gift) != null && jn.player ? Mt.push(S("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && Mt.push(S("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && Mt.push(S("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (Mt.push(S("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Mt.push(S("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Kt.push(ua("copy-address", "Copy my address", () => u.listening || "", "primary", () => Lt(o.snapshot())))) : Mt.push(S("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const D = S("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          D.append(w("View", k(u.depositTxid))), ct.push(D);
        } else u.allowance > 0n && !u.solo && Kt.push(T(`Deposit ${gn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ct.push(S("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (ct.push(S("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ct.push(R(u))), (!u.solo || u.returnTo) && Kt.push(T("Return excess", () => void o.returnFunds("excess"), "primary"), T("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const D = Math.min(u.session.playsLeft, u.playsLeft);
          ct.push(S("p", `Paying as you listen · up to ${D.toLocaleString()} plays left`, "ppp-ok")), Mt.push(S("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Kt.push(T("Switch off", () => void o.switchOff()));
        } else
          ct.push(S("p", "Paying is off. Music stays free.", "ppp-mute")), Kt.push(T("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && ct.push(S("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && ct.push(S("p", "Running low · top up", "ppp-warn")), u.depositPending ? ct.push(S("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Kt.push(T(`Top up ${gn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && Mt.push(S("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && Mt.push(R(u)), Mt.push(at()), u.step === "ready" && u.entries.some((z) => z.kind === "play" && z.status === "confirmed"))) {
      const z = S("p", "New to Stacks? ", "ppp-mute");
      z.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ct.push(z);
    }
    if (u.walletOutdated && Mt.push(S("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (ct.push(S("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Kt.push(T("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && pe.push(T(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${U(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && pe.push(T("Lock", () => void o.lock(), "quiet")), st && !nt && pe.push(T(O ? "Hide listening wallet box" : "Show listening wallet box", () => {
      O = !O, Lt(o.snapshot());
    }, "quiet")), [...Kt, ...pe].forEach((z) => z.disabled = Ne), Ne && (Kt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((zn = u.gift) != null && zn.player)) {
      const z = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", D = ct.at(0);
      u.step === "ready" && D ? D.append(S("span", ` · ${b(u.balance)} STX`, z)) : ct.push(S("p", `Balance ${b(u.balance)} STX`, z));
    }
    if ((Rn = u.gift) != null && Rn.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const z = S("p", "", "ppp-gift");
      z.append(`🎁 Gift Edition · ${u.gift.player.title}`), u.gift.player.subtitle && z.append(" · ", u.gift.player.subtitle);
      const D = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? S("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      D && z.append(D);
      const ce = (Is = ct.at(0)) == null ? void 0 : Is.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && ce && /STX/.test(ce.textContent ?? "") && ce.remove(), ct.unshift(z), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending) {
        const ge = S("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
        ge.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ge.append(w("Xverse", "https://www.xverse.app/download"), " and ", w("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ct.splice(1, 0, ge);
      }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const z = u.returnPlan, D = S("div", "", "ppp-pick");
      D.append(S("p", z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ce = S("ul", "", "ppp-gift-list");
      z.steps.forEach((ge, Gn) => {
        const ks = ge.kind === "gift" ? "the unused gift" : ge.kind === "deposit" ? "what was added to it" : "the rest", Kn = S("li");
        Kn.append(S("span", `${Gn + 1}. ${gn(BigInt(ge.send))} STX · ${ks}`, "t"), S("span", ge.to ? ` → ${U(ge.to)}` : " → choose an address below", ge.to ? "ppp-mute" : "ppp-warn")), ce.append(Kn);
      }), D.append(ce), z.kept && D.append(S("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), z.steps.some((ge) => !ge.to) && D.append(R(u)), D.append(T(z.steps.length > 1 ? `Confirm part 1 of ${z.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ct.push(D);
    }
    ct.unshift(...a.banner(u)), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && ct.unshift(S("p", `This is ${U(u.creditedTo)}'s listening wallet. Plays and likes count for ${U(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ct);
    const Se = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !Se, Se && !n(".ppp-gift-body").contains(Se) && n(".ppp-gift-body").replaceChildren(Se), Se && I) {
      I = !1;
      const z = n(".ppp-gifts");
      z.open = !0, requestAnimationFrame(() => z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Mt), n(".ppp-actions").replaceChildren(...Kt), n(".ppp-actions2").replaceChildren(...pe);
    const Tr = u.busy || u.message || "";
    n(".ppp-msg").textContent = Tr && ct.some((z) => (z.textContent ?? "").startsWith(Tr.replace(/[.✓\s]+$/, ""))) ? "" : Tr, n(".ppp-err").textContent = u.error;
    const pi = u.entries.filter((z) => z.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...pi.slice(0, 5).map((z) => {
      const D = S("li"), ce = z.status === "confirmed" ? "ok" : z.status === "failed" ? "bad" : "warn";
      return D.append(S("span", "", "d " + ce), S("span", Ht(z), "t"), S("span", m(z.created), "ppp-mute")), z.txid && D.append(w("tx", k(z.txid))), D;
    })), n(".ppp-wallets").hidden = !(Br.childElementCount || pe.length), n(".ppp-more").hidden = !Mt.length;
    const $s = n(".ppp-history");
    $s.hidden = !u.entries.length, u.entries.length && Q(), $s.replaceChildren(S("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((z) => {
      const D = S("div", "", "ppp-row"), ce = z.kind === "play" ? [S("span", Ht(z), "ppp-song"), S("span", ` · ${gn(BigInt(z.amount))} STX to ${U(z.recipient)}`, "ppp-mute")] : z.kind === "like" ? [S("span", `${z.liked ? "♥ Liked" : "Unliked"} ${Ht(z)}`, "ppp-song"), S("span", ` · for ${u.linked ? U(u.linked) : "this listening wallet"}`, "ppp-mute")] : [S("span", `Returned ${gn(BigInt(z.amount))} STX`, "ppp-song"), S("span", ` to ${U(z.recipient)}`, "ppp-mute")];
      return D.append(
        S("span", ne[z.status] || z.status, "ppp-status " + (oe[z.status] || "")),
        ...ce,
        S("span", ` · ${new Date(z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), z.txid && D.append(w("tx ↗", k(z.txid))), D;
    }));
  }
  const jt = /* @__PURE__ */ new Map(), ue = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((E) => {
      const v = E == null ? void 0 : E.nowPlaying;
      v && Number.isSafeInteger(Number(v.tokenId)) && jt.set(Number(v.tokenId), { title: v.title || void 0, artist: v.artist || void 0 });
    }), !0) : !1;
  };
  if (!ue()) {
    const u = setInterval(() => {
      ue() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const E = u.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      Q();
      const v = Y(E.song, jt.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: v.title || void 0, artist: v.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const _$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", N$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, U$ = () => N$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, P$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, H$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', cy = class {
  constructor(t) {
    C4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && X2(t), this.callback($a(t));
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
    var r, s, i, o, a, c, f, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = U$(), e = P$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return ht("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, ht("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), ht("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, ht("div", { class: "flex flex-col space-y-[10px]" }, ht("div", { class: "flex items-center" }, ht("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), ht("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, ht("span", { class: "sr-only" }, "Close popup"), ht("img", { src: _$ }))), r ? ht("p", null, "Select the wallet you want to connect to.") : ht("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && ht("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && ht("div", { class: "mt-6" }, ht("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), ht("ul", { class: "space-y-3" }, this.installedProviders.map((i) => ht("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, ht("div", { class: "aspect-square basis-9 overflow-hidden" }, ht("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), ht("div", { class: "flex-1" }, ht("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && ht("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), ht("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && ht("div", { class: "mt-6" }, r ? ht("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : ht("div", { class: "mb-5 flex justify-between" }, ht("p", { class: "text-sm font-medium" }, "Recommended wallets"), ht("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, ht("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, ht("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), ht("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), ht("p", null, "What is a wallet? ", ht("span", { class: "align-text-bottom text-[9px]" }, "↗")))), ht("ul", { class: "space-y-3" }, n.map((i) => ht("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, ht("div", { class: "aspect-square basis-9 overflow-hidden" }, ht("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), ht("div", { class: "flex-1" }, ht("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && ht("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && ht("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return u4(this);
  }
};
cy.style = H$;
const O$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: cy
}, Symbol.toStringTag, { value: "Module" }));
