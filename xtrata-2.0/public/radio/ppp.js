var yy = Object.defineProperty;
var wy = (t, e, n) => e in t ? yy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ws = (t, e, n) => wy(t, typeof e != "symbol" ? e + "" : e, n);
var le = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function zo(t) {
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
      typeof le < "u" && le || {}, r = {
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
      function u(m) {
        var C = {
          next: function() {
            var P = m.shift();
            return { done: P === void 0, value: P };
          }
        };
        return r.iterable && (C[Symbol.iterator] = function() {
          return C;
        }), C;
      }
      function f(m) {
        this.map = {}, m instanceof f ? m.forEach(function(C, P) {
          this.append(P, C);
        }, this) : Array.isArray(m) ? m.forEach(function(C) {
          if (C.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + C.length);
          this.append(C[0], C[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(C) {
          this.append(C, m[C]);
        }, this);
      }
      f.prototype.append = function(m, C) {
        m = a(m), C = c(C);
        var P = this.map[m];
        this.map[m] = P ? P + ", " + C : C;
      }, f.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, f.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, f.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, f.prototype.set = function(m, C) {
        this.map[a(m)] = c(C);
      }, f.prototype.forEach = function(m, C) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && m.call(C, this.map[P], P, this);
      }, f.prototype.keys = function() {
        var m = [];
        return this.forEach(function(C, P) {
          m.push(P);
        }), u(m);
      }, f.prototype.values = function() {
        var m = [];
        return this.forEach(function(C) {
          m.push(C);
        }), u(m);
      }, f.prototype.entries = function() {
        var m = [];
        return this.forEach(function(C, P) {
          m.push([P, C]);
        }), u(m);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function y(m) {
        return new Promise(function(C, P) {
          m.onload = function() {
            C(m.result);
          }, m.onerror = function() {
            P(m.error);
          };
        });
      }
      function h(m) {
        var C = new FileReader(), P = y(C);
        return C.readAsArrayBuffer(m), P;
      }
      function g(m) {
        var C = new FileReader(), P = y(C), X = /charset=([A-Za-z0-9_-]+)/.exec(m.type), tt = X ? X[1] : "utf-8";
        return C.readAsText(m, tt), P;
      }
      function w(m) {
        for (var C = new Uint8Array(m), P = new Array(C.length), X = 0; X < C.length; X++)
          P[X] = String.fromCharCode(C[X]);
        return P.join("");
      }
      function I(m) {
        if (m.slice)
          return m.slice(0);
        var C = new Uint8Array(m.byteLength);
        return C.set(new Uint8Array(m)), C.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = I(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = I(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = l(this);
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
            var m = l(this);
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
          var m = l(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return g(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(L);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(m) {
        var C = m.toUpperCase();
        return U.indexOf(C) > -1 ? C : m;
      }
      function k(m, C) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        C = C || {};
        var P = C.body;
        if (m instanceof k) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, C.headers || (this.headers = new f(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !P && m._bodyInit != null && (P = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = C.credentials || this.credentials || "same-origin", (C.headers || !this.headers) && (this.headers = new f(C.headers)), this.method = b(C.method || this.method || "GET"), this.mode = C.mode || this.mode || null, this.signal = C.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var X = /([?&])_=[^&]*/;
          if (X.test(this.url))
            this.url = this.url.replace(X, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var tt = /\?/;
            this.url += (tt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      k.prototype.clone = function() {
        return new k(this, { body: this._bodyInit });
      };
      function L(m) {
        var C = new FormData();
        return m.trim().split("&").forEach(function(P) {
          if (P) {
            var X = P.split("="), tt = X.shift().replace(/\+/g, " "), z = X.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(tt), decodeURIComponent(z));
          }
        }), C;
      }
      function O(m) {
        var C = new f(), P = m.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(X) {
          return X.indexOf(`
`) === 0 ? X.substr(1, X.length) : X;
        }).forEach(function(X) {
          var tt = X.split(":"), z = tt.shift().trim();
          if (z) {
            var xt = tt.join(":").trim();
            try {
              C.append(z, xt);
            } catch (Ct) {
              console.warn("Response " + Ct.message);
            }
          }
        }), C;
      }
      _.call(k.prototype);
      function V(m, C) {
        if (!(this instanceof V))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new f(C.headers), this.url = C.url || "", this._initBody(m);
      }
      _.call(V.prototype), V.prototype.clone = function() {
        return new V(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, V.error = function() {
        var m = new V(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var D = [301, 302, 303, 307, 308];
      V.redirect = function(m, C) {
        if (D.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new V(null, { status: C, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(C, P) {
          this.message = C, this.name = P;
          var X = Error(C);
          this.stack = X.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function j(m, C) {
        return new Promise(function(P, X) {
          var tt = new k(m, C);
          if (tt.signal && tt.signal.aborted)
            return X(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function xt() {
            z.abort();
          }
          z.onload = function() {
            var A = {
              statusText: z.statusText,
              headers: O(z.getAllResponseHeaders() || "")
            };
            tt.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? A.status = 200 : A.status = z.status, A.url = "responseURL" in z ? z.responseURL : A.headers.get("X-Request-URL");
            var x = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              P(new V(x, A));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              X(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              X(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              X(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Ct(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (z.open(tt.method, Ct(tt.url), !0), tt.credentials === "include" ? z.withCredentials = !0 : tt.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof f || n.Headers && C.headers instanceof n.Headers)) {
            var Dt = [];
            Object.getOwnPropertyNames(C.headers).forEach(function(A) {
              Dt.push(a(A)), z.setRequestHeader(A, c(C.headers[A]));
            }), tt.headers.forEach(function(A, x) {
              Dt.indexOf(x) === -1 && z.setRequestHeader(x, A);
            });
          } else
            tt.headers.forEach(function(A, x) {
              z.setRequestHeader(x, A);
            });
          tt.signal && (tt.signal.addEventListener("abort", xt), z.onreadystatechange = function() {
            z.readyState === 4 && tt.signal.removeEventListener("abort", xt);
          }), z.send(typeof tt._bodyInit > "u" ? null : tt._bodyInit);
        });
      }
      return j.polyfill = !0, n.fetch || (n.fetch = j, n.Headers = f, n.Request = k, n.Response = V), e.Headers = f, e.Request = k, e.Response = V, e.fetch = j, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : le);
})();
const by = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xy(t, e) {
  const n = {};
  return Object.assign(n, by, e), await fetch(t, n);
}
function my(t) {
  let e = xy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sy(...t) {
  const { fetchLib: e, middlewares: n } = my(t);
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
var Ss;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ss || (Ss = {}));
var Br;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Br || (Br = {}));
var mu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(mu || (mu = {}));
const Ey = "https://api.mainnet.hiro.so", Ay = "https://api.testnet.hiro.so", $y = "http://localhost:3999", vy = ["mainnet", "testnet", "devnet", "mocknet"];
let Es = class {
  constructor(e) {
    this.version = Br.Mainnet, this.chainId = Ss.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Br.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Sy();
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
Es.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new qa();
    case "testnet":
      return new Iy();
    case "devnet":
      return new Ly();
    case "mocknet":
      return new Xd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vy.join(", ")}`);
  }
};
Es.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Es.fromName(t);
let qa = class extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ey,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Br.Mainnet, this.chainId = Ss.Mainnet;
  }
}, Iy = class extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ay,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Br.Testnet, this.chainId = Ss.Testnet;
  }
}, Xd = class extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $y,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Br.Testnet, this.chainId = Ss.Testnet;
  }
};
const Ly = Xd, Yd = "xtrata.wallet.bridge.v1", Cy = (t) => typeof t == "object" && t !== null && t.protocol === Yd, ky = (t) => Cy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", By = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Xs extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Su = 12e4;
class Ty {
  constructor(e) {
    Ws(this, "pending", /* @__PURE__ */ new Map());
    Ws(this, "listenTarget");
    Ws(this, "closed", !1);
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
    Ws(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !ky(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Xs("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Xs("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Xs("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = By(), i = { protocol: Yd, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Xs(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Su}ms.`
          )
        );
      }, this.options.timeoutMs ?? Su);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Xs("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const My = ["SP", "SM"], _y = ["ST", "SN"], Uy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return My.includes(n) ? "mainnet" : _y.includes(n) ? "testnet" : null;
}, Ny = () => {
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
}, Hy = () => typeof window > "u" || !window.localStorage ? Ny() : window.localStorage, Ea = "xtrata.v15.1.wallet.session", Eu = "mainnet", wo = { isConnected: !1 }, Py = (t) => t.address ? Uy(t.address) ?? t.network : t.network, Zd = (t) => !t.isConnected || !t.address ? { ...wo } : Py(t) !== Eu ? { ...wo } : {
  isConnected: !0,
  address: t.address,
  network: Eu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Oy = (t) => {
  if (!t)
    return { ...wo };
  try {
    const e = JSON.parse(t);
    return Zd(e);
  } catch {
    return { ...wo };
  }
}, Dy = (t) => {
  const e = Zd(t);
  return JSON.stringify(e);
}, jy = (t) => {
  const e = Hy();
  return {
    load: () => Oy(e.getItem(Ea)),
    save: (n) => {
      e.setItem(Ea, Dy(n));
    },
    clear: () => {
      e.removeItem(Ea);
    }
  };
}, Fy = "https://browser.blockstack.org/auth", zy = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Qd = ["store_write"], Ry = "blockstack-session", Gy = {
  logLevel: "debug"
}, qr = {
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
Object.freeze(qr);
class Fs extends Error {
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
class Ky extends Fs {
  constructor(e, n = "") {
    super({ code: qr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Au extends Fs {
  constructor(e = "") {
    super({ code: qr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class _i extends Fs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: qr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class $u extends Fs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: qr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Wa extends Fs {
  constructor(e) {
    super({ code: qr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Jd extends Fs {
  constructor(e) {
    super({ code: qr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const vu = ["debug", "info", "warn", "error", "none"], Xa = {};
for (let t = 0; t < vu.length; t++) {
  const e = vu[t];
  Xa[e] = t;
}
class ps {
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
    return Xa[Gy.logLevel] <= Xa[e];
  }
}
function Vy() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function qy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Aa(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Wy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Xy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Yy(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Jc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Xy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    ps.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Yy(s, t.toString(), n);
    throw ps.error(i), new Error(i);
  }
  if (r)
    return {};
}
function fr(t, e) {
  return tl(ie(t), e);
}
function ie(t) {
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
  if (ye(t, Uint8Array))
    return BigInt(`0x${J(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Zy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Iu(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function mi(t, e = 8) {
  return (typeof t == "bigint" ? t : ie(t)).toString(16).padStart(e * 2, "0");
}
function Ro(t) {
  return parseInt(t, 16);
}
function tl(t, e = 16) {
  const n = mi(t, e);
  return wt(n);
}
function Qy(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Jy(t, e) {
  return t & BigInt(1) << e;
}
function Ya(t) {
  return tw(BigInt(`0x${J(t)}`), BigInt(t.byteLength * 8));
}
function tw(t, e) {
  return Jy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ew = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function J(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ew[n];
  return e;
}
function wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Zy(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Wr(t) {
  return new TextEncoder().encode(t);
}
function Si(t) {
  return new TextDecoder().decode(t);
}
function nw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function rw(t) {
  return String.fromCharCode.apply(null, t);
}
function sw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Lu(t) {
  if (t.some(sw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ln(...t) {
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
function Vt(t) {
  return ln(...t.map((e) => typeof e == "number" ? Lu([e]) : e instanceof Array ? Lu(e) : e));
}
function ye(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const th = "https://api.mainnet.hiro.so", eh = "https://api.testnet.hiro.so", nh = "http://localhost:3999", iw = "https://hub.blockstack.org", ow = 33, $a = 32;
function aw(t) {
  if (t.length < $a * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + $a * 2), r = t.slice(2 + $a * 2);
  return {
    recoveryId: Ro(e),
    r: n,
    s: r
  };
}
function el(t) {
  const e = typeof t == "string" ? wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function cw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function lw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function uw(t, e) {
  return t[e];
}
function fw(t, e, n = 0) {
  return t[n] = e, t;
}
function dw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Tr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const hw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pw(t, e) {
  const n = {};
  return Object.assign(n, hw, e), await fetch(t, n);
}
function gw(t) {
  let e = pw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function yw(...t) {
  const { fetchLib: e, middlewares: n } = gw(t);
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
class rh {
  constructor(e = Qd.slice(), n = ((a) => (a = Jc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Fy) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Za(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ww(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function sh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Za(t.outputLen), Za(t.blockLen);
}
function xw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mw(t, e) {
  sh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Sr = {
  number: Za,
  bool: ww,
  bytes: sh,
  hash: bw,
  exists: xw,
  output: mw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const va = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qe = (t, e) => t << 32 - e | t >>> e, Sw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ew(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function nl(t) {
  if (typeof t == "string" && (t = Ew(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ih = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xr(t) {
  const e = (r) => t().update(nl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let oh = class extends ih {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Sr.hash(e);
    const r = nl(n);
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
};
const Go = (t, e, n) => new oh(t, e).update(n).digest();
Go.create = (t, e) => new oh(t, e);
function Aw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let rl = class extends ih {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = va(this.buffer);
  }
  update(e) {
    Sr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = nl(e);
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
    Sr.exists(this), Sr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Aw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = va(e), c = this.outputLen;
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
const $w = (t, e, n) => t & e ^ ~t & n, vw = (t, e, n) => t & e ^ t & n ^ e & n, Iw = new Uint32Array([
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
]), Un = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nn = new Uint32Array(64);
let ah = class extends rl {
  constructor() {
    super(64, 32, 8, !1), this.A = Un[0] | 0, this.B = Un[1] | 0, this.C = Un[2] | 0, this.D = Un[3] | 0, this.E = Un[4] | 0, this.F = Un[5] | 0, this.G = Un[6] | 0, this.H = Un[7] | 0;
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
      const y = Nn[l - 15], h = Nn[l - 2], g = Qe(y, 7) ^ Qe(y, 18) ^ y >>> 3, w = Qe(h, 17) ^ Qe(h, 19) ^ h >>> 10;
      Nn[l] = w + Nn[l - 7] + g + Nn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = Qe(a, 6) ^ Qe(a, 11) ^ Qe(a, 25), h = f + y + $w(a, c, u) + Iw[l] + Nn[l] | 0, w = (Qe(r, 2) ^ Qe(r, 13) ^ Qe(r, 22)) + vw(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Nn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lw = class extends ah {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const As = Xr(() => new ah());
Xr(() => new Lw());
const Cw = {}, ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const yt = BigInt(0), Nt = BigInt(1), or = BigInt(2), ti = BigInt(3), Cu = BigInt(8), vt = Object.freeze({
  a: yt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Nt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ku = (t, e) => (t + e / or) / e, Ui = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Nt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = ku(i * t, e), c = ku(-r * t, e);
    let u = F(t - a * n - c * s, e), f = F(-a * r - c * i, e);
    const l = u > o, y = f > o;
    if (l && (u = e - u), y && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: f };
  }
}, Ge = 32, Mr = 32, lh = 32, bo = Ge + 1, xo = 2 * Ge + 1;
function Bu(t) {
  const { a: e, b: n } = vt, r = F(t * t), s = F(r * t);
  return F(s + e * t + n);
}
const Ni = vt.a === yt;
class sl extends Error {
  constructor(e) {
    super(e);
  }
}
function Tu(t) {
  if (!(t instanceof St))
    throw new TypeError("JacobianPoint expected");
}
class St {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof lt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(lt.ZERO) ? St.ZERO : new St(e.x, e.y, Nt);
  }
  static toAffineBatch(e) {
    const n = _w(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return St.toAffineBatch(e).map(St.fromAffine);
  }
  equals(e) {
    Tu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = F(s * s), u = F(a * a), f = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c);
    return f === l && y === h;
  }
  negate() {
    return new St(this.x, F(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = F(e * e), i = F(n * n), o = F(i * i), a = e + i, c = F(or * (F(a * a) - s - o)), u = F(ti * s), f = F(u * u), l = F(f - or * c), y = F(u * (c - l) - Cu * o), h = F(or * n * r);
    return new St(l, y, h);
  }
  add(e) {
    Tu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === yt || o === yt)
      return this;
    if (n === yt || r === yt)
      return e;
    const c = F(s * s), u = F(a * a), f = F(n * u), l = F(i * c), y = F(F(r * a) * u), h = F(F(o * s) * c), g = F(l - f), w = F(h - y);
    if (g === yt)
      return w === yt ? this.double() : St.ZERO;
    const I = F(g * g), _ = F(g * I), U = F(f * I), b = F(w * w - _ - or * U), k = F(w * (U - b) - y * _), L = F(s * a * g);
    return new St(b, k, L);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = St.ZERO;
    if (typeof e == "bigint" && e === yt)
      return n;
    let r = Uu(e);
    if (r === Nt)
      return this;
    if (!Ni) {
      let l = n, y = this;
      for (; r > yt; )
        r & Nt && (l = l.add(y)), y = y.double(), r >>= Nt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Ui.splitScalar(r), c = n, u = n, f = this;
    for (; i > yt || a > yt; )
      i & Nt && (c = c.add(f)), a & Nt && (u = u.add(f)), f = f.double(), i >>= Nt, a >>= Nt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new St(F(u.x * Ui.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ni ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(St.BASE) && (n = lt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Qa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = St.normalizeZ(s), Qa.set(n, s)));
    let i = St.ZERO, o = St.BASE;
    const a = 1 + (Ni ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const h = y * c;
      let g = Number(e & u);
      e >>= l, g > c && (g -= f, e += Nt);
      const w = h, I = h + Math.abs(g) - 1, _ = y % 2 !== 0, U = g < 0;
      g === 0 ? o = o.add(Hi(_, s[w])) : i = i.add(Hi(U, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Uu(e), s, i;
    if (Ni) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Ui.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: y, f: h } = this.wNAF(u, n);
      f = Hi(o, f), y = Hi(c, y), y = new St(F(y.x * Ui.beta), y.y, y.z), s = f.add(y), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return St.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(St.ZERO);
    e == null && (e = i ? Cu : zs(s));
    const o = e, a = F(o * o), c = F(a * o), u = F(n * a), f = F(r * c), l = F(s * o);
    if (i)
      return lt.ZERO;
    if (l !== Nt)
      throw new Error("invZ was invalid");
    return new lt(u, f);
  }
}
St.BASE = new St(vt.Gx, vt.Gy, Nt);
St.ZERO = new St(yt, Nt, yt);
function Hi(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Qa = /* @__PURE__ */ new WeakMap();
class lt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Qa.delete(this);
  }
  hasEvenY() {
    return this.y % or === yt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = $e(n ? e : e.subarray(1));
    if (!co(r))
      throw new Error("Point is not on curve");
    const s = Bu(r);
    let i = Mw(s);
    const o = (i & Nt) === Nt;
    n ? o && (i = F(-i)) : (e[0] & 1) === 1 !== o && (i = F(-i));
    const a = new lt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = $e(e.subarray(1, Ge + 1)), r = $e(e.subarray(Ge + 1, Ge * 2 + 1)), s = new lt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = un(e), r = n.length, s = n[0];
    if (r === Ge)
      return this.fromCompressedHex(n);
    if (r === bo && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === xo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${bo} compressed bytes or ${xo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return lt.BASE.multiply(_r(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = dh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = il(un(e)), { n: a } = vt, c = r === 2 || r === 3 ? s + a : s, u = zs(c, a), f = F(-o * u, a), l = F(i * u, a), y = r & 1 ? "03" : "02", h = lt.fromHex(y + cr(c)), g = lt.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return lr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = cr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${cr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!co(n) || !co(r))
      throw new Error(e);
    const s = F(r * r), i = Bu(n);
    if (F(s - i) !== yt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new lt(this.x, F(-this.y));
  }
  double() {
    return St.fromAffine(this).double().toAffine();
  }
  add(e) {
    return St.fromAffine(this).add(St.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return St.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = St.fromAffine(this), i = n === yt || n === Nt || this !== lt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = St.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(St.ZERO) ? void 0 : a.toAffine();
  }
}
lt.BASE = new lt(vt.Gx, vt.Gy);
lt.ZERO = new lt(yt, yt);
function Mu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function _u(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${$s(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: $e(n), left: t.subarray(e + 2) };
}
function kw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${$s(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = _u(t.subarray(2)), { data: r, left: s } = _u(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${$s(s)}`);
  return { r: e, s: r };
}
class Ae {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? $s(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ae(mo(s.slice(0, 64)), mo(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = kw(n ? e : lr(e));
    return new Ae(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Is(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Is(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = vt.n >> Nt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ae(this.r, F(-this.s, vt.n)) : this;
  }
  toDERRawBytes() {
    return lr(this.toDERHex());
  }
  toDERHex() {
    const e = Mu(Ys(this.s)), n = Mu(Ys(this.r)), r = e.length / 2, s = n.length / 2, i = Ys(r), o = Ys(s);
    return `30${Ys(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return lr(this.toCompactHex());
  }
  toCompactHex() {
    return cr(this.r) + cr(this.s);
  }
}
function sr(...t) {
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
const Bw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $s(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bw[t[n]];
  return e;
}
const Tw = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function cr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(yt <= t && t < Tw))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function vs(t) {
  const e = lr(cr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ys(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function mo(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function lr(t) {
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
function $e(t) {
  return mo($s(t));
}
function un(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : lr(t);
}
function Uu(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Is(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function F(t, e = vt.P) {
  const n = t % e;
  return n >= yt ? n : e + n;
}
function Ce(t, e) {
  const { P: n } = vt;
  let r = t;
  for (; e-- > yt; )
    r *= r, r %= n;
  return r;
}
function Mw(t) {
  const { P: e } = vt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Ce(u, ti) * u % e, l = Ce(f, ti) * u % e, y = Ce(l, or) * c % e, h = Ce(y, r) * y % e, g = Ce(h, s) * h % e, w = Ce(g, o) * g % e, I = Ce(w, a) * w % e, _ = Ce(I, o) * g % e, U = Ce(_, ti) * u % e, b = Ce(U, i) * h % e, k = Ce(b, n) * c % e, L = Ce(k, or);
  if (L * L % e !== t)
    throw new Error("Cannot find square root");
  return L;
}
function zs(t, e = vt.P) {
  if (t === yt || e <= yt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = F(t, e), r = e, s = yt, i = Nt;
  for (; n !== yt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Nt)
    throw new Error("invert: does not exist");
  return F(s, e);
}
function _w(t, e = vt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === yt ? i : (n[a] = i, F(i * o, e)), Nt), s = zs(r, e);
  return t.reduceRight((i, o, a) => o === yt ? i : (n[a] = F(i * n[a], e), F(i * o, e)), s), n;
}
function Uw(t) {
  const e = t.length * 8 - Mr * 8, n = $e(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function il(t, e = !1) {
  const n = Uw(t);
  if (e)
    return n;
  const { n: r } = vt;
  return n >= r ? n - r : n;
}
let xs, ei;
class uh {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Rt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ei(this.k, ...e);
  }
  checkSync() {
    if (typeof ei != "function")
      throw new sl("hmacSha256Sync needs to be set");
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
    return sr(...n);
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
    return sr(...n);
  }
}
function Is(t) {
  return yt < t && t < vt.n;
}
function co(t) {
  return yt < t && t < vt.P;
}
function fh(t, e, n, r = !0) {
  const { n: s } = vt, i = il(t, !0);
  if (!Is(i))
    return;
  const o = zs(i, s), a = lt.BASE.multiply(i), c = F(a.x, s);
  if (c === yt)
    return;
  const u = F(o * F(e + n * c, s), s);
  if (u === yt)
    return;
  let f = new Ae(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & Nt);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function _r(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Mr)
      throw new Error("Expected 32 bytes of private key");
    e = mo(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Mr)
      throw new Error("Expected 32 bytes of private key");
    e = $e(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Is(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ol(t) {
  return t instanceof lt ? (t.assertValidity(), t) : lt.fromHex(t);
}
function dh(t) {
  if (t instanceof Ae)
    return t.assertValidity(), t;
  try {
    return Ae.fromDER(t);
  } catch {
    return Ae.fromCompact(t);
  }
}
function Ei(t, e = !1) {
  return lt.fromPrivateKey(t).toRawBytes(e);
}
function Nw(t, e, n, r = !1) {
  return lt.fromSignature(t, e, n).toRawBytes(r);
}
function Nu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === bo || r === xo : n ? r === bo * 2 || r === xo * 2 : t instanceof lt;
}
function al(t, e, n = !1) {
  if (Nu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Nu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ol(e);
  return r.assertValidity(), r.multiply(_r(t)).toRawBytes(n);
}
function hh(t) {
  const e = t.length > Ge ? t.slice(0, Ge) : t;
  return $e(e);
}
function Hw(t) {
  const e = hh(t), n = F(e, vt.n);
  return ph(n < yt ? e : n);
}
function ph(t) {
  return vs(t);
}
function gh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = un(t), s = _r(e), i = [ph(s), Hw(r)];
  if (n != null) {
    n === !0 && (n = Rt.randomBytes(Ge));
    const c = un(n);
    if (c.length !== Ge)
      throw new Error(`sign: Expected ${Ge} bytes of extra data`);
    i.push(c);
  }
  const o = sr(...i), a = hh(r);
  return { seed: o, m: a, d: s };
}
function yh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Pw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = gh(t, e, n.extraEntropy), o = new uh(lh, Mr);
  await o.reseed(r);
  let a;
  for (; !(a = fh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return yh(a, n);
}
function Ko(t, e, n = {}) {
  const { seed: r, m: s, d: i } = gh(t, e, n.extraEntropy), o = new uh(lh, Mr);
  o.reseedSync(r);
  let a;
  for (; !(a = fh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return yh(a, n);
}
const Ow = { strict: !0 };
function Dw(t, e, n, r = Ow) {
  let s;
  try {
    s = dh(t), e = un(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = il(e);
  let c;
  try {
    c = ol(n);
  } catch {
    return !1;
  }
  const { n: u } = vt, f = zs(o, u), l = F(a * f, u), y = F(i * f, u), h = lt.BASE.multiplyAndAddUnsafe(c, l, y);
  return h ? F(h.x, u) === i : !1;
}
function So(t) {
  return F($e(t), vt.n);
}
class Ls {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = un(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = $e(n.subarray(0, 32)), s = $e(n.subarray(32, 64));
    return new Ls(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!co(e) || !Is(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return cr(this.r) + cr(this.s);
  }
  toRawBytes() {
    return lr(this.toHex());
  }
}
function jw(t) {
  return lt.fromPrivateKey(t).toRawX();
}
class wh {
  constructor(e, n, r = Rt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = un(e);
    const { x: s, scalar: i } = this.getScalar(_r(n));
    if (this.px = s, this.d = i, this.rand = un(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = lt.fromPrivateKey(e), r = n.hasEvenY() ? e : vt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return vs(e ^ $e(n));
  }
  finalizeNonce(e) {
    const n = F($e(e), vt.n);
    if (n === yt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ls(e.x, F(n + r * s, vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Rt.taggedHash, o = this.initNonce(n, await i(rr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(rr.nonce, o, r, e)), f = So(await i(rr.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await mh(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Rt.taggedHashSync, o = this.initNonce(n, i(rr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(rr.nonce, o, r, e)), f = So(i(rr.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return Sh(l, e, r) || this.error(), l;
  }
}
async function Fw(t, e, n) {
  return new wh(t, e, n).calc();
}
function zw(t, e, n) {
  return new wh(t, e, n).calcSync();
}
function bh(t, e, n) {
  const r = t instanceof Ls, s = r ? t : Ls.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: un(e),
    P: ol(n)
  };
}
function xh(t, e, n, r) {
  const s = lt.BASE.multiplyAndAddUnsafe(e, _r(n), F(-r, vt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function mh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = bh(t, e, n), a = So(await Rt.taggedHash(rr.challenge, vs(r), o.toRawX(), i));
    return xh(r, o, s, a);
  } catch {
    return !1;
  }
}
function Sh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = bh(t, e, n), a = So(Rt.taggedHashSync(rr.challenge, vs(r), o.toRawX(), i));
    return xh(r, o, s, a);
  } catch (r) {
    if (r instanceof sl)
      throw r;
    return !1;
  }
}
const Rw = {
  Signature: Ls,
  getPublicKey: jw,
  sign: Fw,
  verify: mh,
  signSync: zw,
  verifySync: Sh
};
lt.BASE._setWindowSize(8);
const be = {
  node: ch,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, rr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Pi = {}, Rt = {
  bytesToHex: $s,
  hexToBytes: lr,
  concatBytes: sr,
  mod: F,
  invert: zs,
  isValidPrivateKey(t) {
    try {
      return _r(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: vs,
  _normalizePrivateKey: _r,
  hashToPrivateKey: (t) => {
    t = un(t);
    const e = Mr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = F($e(t), vt.n - Nt) + Nt;
    return vs(n);
  },
  randomBytes: (t = 32) => {
    if (be.web)
      return be.web.getRandomValues(new Uint8Array(t));
    if (be.node) {
      const { randomBytes: e } = be.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Rt.hashToPrivateKey(Rt.randomBytes(Mr + 8)),
  precompute(t = 8, e = lt.BASE) {
    const n = e === lt.BASE ? e : new lt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ti), n;
  },
  sha256: async (...t) => {
    if (be.web) {
      const e = await be.web.subtle.digest("SHA-256", sr(...t));
      return new Uint8Array(e);
    } else if (be.node) {
      const { createHash: e } = be.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (be.web) {
      const n = await be.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = sr(...e), s = await be.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (be.node) {
      const { createHmac: n } = be.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Pi[t];
    if (n === void 0) {
      const r = await Rt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = sr(r, r), Pi[t] = n;
    }
    return Rt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof xs != "function")
      throw new sl("sha256Sync is undefined, you need to set it");
    let n = Pi[t];
    if (n === void 0) {
      const r = xs(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = sr(r, r), Pi[t] = n;
    }
    return xs(n, ...e);
  },
  _JacobianPoint: St
};
Object.defineProperties(Rt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return xs;
    },
    set(t) {
      xs || (xs = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ei;
    },
    set(t) {
      ei || (ei = t);
    }
  }
});
const Gw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: vt,
  Point: lt,
  Signature: Ae,
  getPublicKey: Ei,
  getSharedSecret: al,
  recoverPublicKey: Nw,
  schnorr: Rw,
  sign: Pw,
  signSync: Ko,
  utils: Rt,
  verify: Dw
}, Symbol.toStringTag, { value: "Module" }));
var Ai = {};
Ai.byteLength = Xw;
var Kw = Ai.toByteArray = Zw, Vw = Ai.fromByteArray = t1, rn = [], Be = [], qw = typeof Uint8Array < "u" ? Uint8Array : Array, Ia = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var as = 0, Ww = Ia.length; as < Ww; ++as)
  rn[as] = Ia[as], Be[Ia.charCodeAt(as)] = as;
Be[45] = 62;
Be[95] = 63;
function Eh(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Xw(t) {
  var e = Eh(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Yw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Zw(t) {
  var e, n = Eh(t), r = n[0], s = n[1], i = new qw(Yw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Be[t.charCodeAt(c)] << 18 | Be[t.charCodeAt(c + 1)] << 12 | Be[t.charCodeAt(c + 2)] << 6 | Be[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Be[t.charCodeAt(c)] << 2 | Be[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Be[t.charCodeAt(c)] << 10 | Be[t.charCodeAt(c + 1)] << 4 | Be[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Qw(t) {
  return rn[t >> 18 & 63] + rn[t >> 12 & 63] + rn[t >> 6 & 63] + rn[t & 63];
}
function Jw(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Qw(r));
  return s.join("");
}
function t1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Jw(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    rn[e >> 2] + rn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    rn[e >> 10] + rn[e >> 4 & 63] + rn[e << 2 & 63] + "="
  )), s.join("");
}
function e1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const n1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function r1() {
  if (e1())
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
    throw new Error(n1);
  }
}
class s1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(ln(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ln(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class i1 {
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
async function Ah() {
  const t = await r1();
  return t.name === "subtleCrypto" ? new i1(t.lib) : new s1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function o1(t) {
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
    for (var g = 0, w = 0, I = 0, _ = h.length; I !== _ && h[I] === 0; )
      I++, g++;
    for (var U = (_ - I) * u + 1 >>> 0, b = new Uint8Array(U); I !== _; ) {
      for (var k = h[I], L = 0, O = U - 1; (k !== 0 || L < w) && O !== -1; O--, L++)
        k += 256 * b[O] >>> 0, b[O] = k % o >>> 0, k = k / o >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      w = L, I++;
    }
    for (var V = U - w; V !== U && b[V] === 0; )
      V++;
    for (var D = a.repeat(g); V < U; ++V)
      D += t.charAt(b[V]);
    return D;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var g = 0, w = 0, I = 0; h[g] === a; )
      w++, g++;
    for (var _ = (h.length - g) * c + 1 >>> 0, U = new Uint8Array(_); h[g]; ) {
      var b = h.charCodeAt(g);
      if (b > 255)
        return;
      var k = e[b];
      if (k === 255)
        return;
      for (var L = 0, O = _ - 1; (k !== 0 || L < I) && O !== -1; O--, L++)
        k += o * U[O] >>> 0, U[O] = k % 256 >>> 0, k = k / 256 >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      I = L, g++;
    }
    for (var V = _ - I; V !== _ && U[V] === 0; )
      V++;
    for (var D = new Uint8Array(w + (_ - V)), j = w; V !== _; )
      D[j++] = U[V++];
    return D;
  }
  function y(h) {
    var g = l(h);
    if (g)
      return g;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: y
  };
}
var $h = o1;
const a1 = $h, c1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var l1 = a1(c1);
const u1 = /* @__PURE__ */ Wd(l1), f1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vh = Uint8Array.from({ length: 16 }, (t, e) => e), d1 = vh.map((t) => (9 * t + 5) % 16);
let cl = [vh], ll = [d1];
for (let t = 0; t < 4; t++)
  for (let e of [cl, ll])
    e.push(e[t].map((n) => f1[n]));
const Ih = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), h1 = cl.map((t, e) => t.map((n) => Ih[e][n])), p1 = ll.map((t, e) => t.map((n) => Ih[e][n])), g1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), y1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oi = (t, e) => t << e | t >>> 32 - e;
function Hu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Di = new Uint32Array(16);
let w1 = class extends rl {
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
      Di[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = g1[h], I = y1[h], _ = cl[h], U = ll[h], b = h1[h], k = p1[h];
      for (let L = 0; L < 16; L++) {
        const O = Oi(r + Hu(h, i, a, u) + Di[_[L]] + w, b[L]) + l | 0;
        r = l, l = u, u = Oi(a, 10) | 0, a = i, i = O;
      }
      for (let L = 0; L < 16; L++) {
        const O = Oi(s + Hu(g, o, c, f) + Di[U[L]] + I, k[L]) + y | 0;
        s = y, y = f, f = Oi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Di.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const b1 = Xr(() => new w1());
function x1(t) {
  return b1(t);
}
const ji = BigInt(2 ** 32 - 1), Ja = BigInt(32);
function Lh(t, e = !1) {
  return e ? { h: Number(t & ji), l: Number(t >> Ja & ji) } : { h: Number(t >> Ja & ji) | 0, l: Number(t & ji) | 0 };
}
function m1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Lh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S1 = (t, e) => BigInt(t >>> 0) << Ja | BigInt(e >>> 0), E1 = (t, e, n) => t >>> n, A1 = (t, e, n) => t << 32 - n | e >>> n, $1 = (t, e, n) => t >>> n | e << 32 - n, v1 = (t, e, n) => t << 32 - n | e >>> n, I1 = (t, e, n) => t << 64 - n | e >>> n - 32, L1 = (t, e, n) => t >>> n - 32 | e << 64 - n, C1 = (t, e) => e, k1 = (t, e) => t, B1 = (t, e, n) => t << n | e >>> 32 - n, T1 = (t, e, n) => e << n | t >>> 32 - n, M1 = (t, e, n) => e << n - 32 | t >>> 64 - n, _1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function U1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), H1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, P1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), O1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, D1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
  fromBig: Lh,
  split: m1,
  toBig: S1,
  shrSH: E1,
  shrSL: A1,
  rotrSH: $1,
  rotrSL: v1,
  rotrBH: I1,
  rotrBL: L1,
  rotr32H: C1,
  rotr32L: k1,
  rotlSH: B1,
  rotlSL: T1,
  rotlBH: M1,
  rotlBL: _1,
  add: U1,
  add3L: N1,
  add3H: H1,
  add4L: P1,
  add4H: O1,
  add5H: j1,
  add5L: D1
}, [F1, z1] = rt.split([
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
].map((t) => BigInt(t))), Hn = new Uint32Array(80), Pn = new Uint32Array(80);
let Vo = class extends rl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Hn[b] = e.getUint32(n), Pn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = Hn[b - 15] | 0, L = Pn[b - 15] | 0, O = rt.rotrSH(k, L, 1) ^ rt.rotrSH(k, L, 8) ^ rt.shrSH(k, L, 7), V = rt.rotrSL(k, L, 1) ^ rt.rotrSL(k, L, 8) ^ rt.shrSL(k, L, 7), D = Hn[b - 2] | 0, j = Pn[b - 2] | 0, m = rt.rotrSH(D, j, 19) ^ rt.rotrBH(D, j, 61) ^ rt.shrSH(D, j, 6), C = rt.rotrSL(D, j, 19) ^ rt.rotrBL(D, j, 61) ^ rt.shrSL(D, j, 6), P = rt.add4L(V, C, Pn[b - 7], Pn[b - 16]), X = rt.add4H(P, O, m, Hn[b - 7], Hn[b - 16]);
      Hn[b] = X | 0, Pn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: I, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const k = rt.rotrSH(l, y, 14) ^ rt.rotrSH(l, y, 18) ^ rt.rotrBH(l, y, 41), L = rt.rotrSL(l, y, 14) ^ rt.rotrSL(l, y, 18) ^ rt.rotrBL(l, y, 41), O = l & h ^ ~l & w, V = y & g ^ ~y & I, D = rt.add5L(U, L, V, z1[b], Pn[b]), j = rt.add5H(D, _, k, O, F1[b], Hn[b]), m = D | 0, C = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), P = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = I | 0, w = h | 0, I = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = rt.add(u | 0, f | 0, j | 0, m | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = rt.add3L(m, P, tt);
      r = rt.add3H(z, j, C, X), s = z | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = rt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = rt.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: I } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: _, l: U } = rt.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, f, l, y, h, g, w, I, _, U);
  }
  roundClean() {
    Hn.fill(0), Pn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R1 = class extends Vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G1 = class extends Vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K1 = class extends Vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const V1 = Xr(() => new Vo());
Xr(() => new R1());
Xr(() => new G1());
Xr(() => new K1());
function Ch(t) {
  return As(t);
}
function q1(t) {
  return V1(t);
}
const W1 = 0;
Rt.hmacSha256Sync = (t, ...e) => {
  const n = Go.create(As, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function X1() {
  return J(Rt.randomPrivateKey());
}
function Y1(t) {
  const e = As(As(t));
  return u1.encode(ln(t, e).slice(0, t.length + 4));
}
function Z1(t, e) {
  return Y1(ln(new Uint8Array([t]), e.slice(0, 20)));
}
function kh(t, e = W1) {
  const n = typeof t == "string" ? wt(t) : t, r = x1(Ch(n));
  return Z1(e, r);
}
function Bh(t) {
  const e = el(t);
  return J(Ei(e.slice(0, 32), !0));
}
Rt.hmacSha256Sync = (t, ...e) => {
  const n = Go.create(As, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Eo;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Eo || (Eo = {}));
async function Q1(t, e, n) {
  return await (await Ah()).encrypt("aes-256-cbc", e, t, n);
}
async function J1(t, e, n) {
  return await (await Ah()).decrypt("aes-256-cbc", e, t, n);
}
function Th(t, e) {
  return Go(As, t, e);
}
function tb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Mh(t) {
  const e = q1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function eb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function nb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Eo.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Eo.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !eb(t))
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
async function rb(t, e, n, r) {
  const s = nb(t);
  if (!s.result)
    throw s;
  const i = Rt.randomPrivateKey(), o = Ei(i, !0);
  let a = al(i, t, !0);
  a = a.slice(1);
  const c = Mh(a), u = Rt.randomBytes(16), f = await Q1(u, c.encryptionKey, e), l = ln(u, o, f), y = Th(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = J(f);
  else if (r === "base64")
    h = Vw(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: J(u),
    ephemeralPK: J(o),
    cipherText: h,
    mac: J(y),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function _h(t, e) {
  if (!e.ephemeralPK)
    throw new $u("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = al(t, n, !0);
  r = r.slice(1);
  const s = Mh(r), i = wt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Kw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ln(i, wt(n), o), c = Th(s.hmacKey, a), u = wt(e.mac);
  if (!tb(u, c))
    throw new $u("Decryption failed: failure in MAC check");
  const f = await J1(i, s.encryptionKey, o);
  return e.wasString ? Si(f) : f;
}
function sb(t, e) {
  const n = typeof e == "string" ? Wr(e) : e, r = Bh(t), s = Ch(n), i = Ko(s, t);
  return {
    signature: J(i),
    publicKey: r
  };
}
async function ib(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Bh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Wr(t) : t, o = await rb(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = sb(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function ob(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return _h(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ne = {}, Cs = {}, ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.decode = ae.encode = ae.unescape = ae.escape = ae.pad = void 0;
const Uh = Ai;
function ul(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ae.pad = ul;
function Nh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ae.escape = Nh;
function Hh(t) {
  return ul(t).replace(/-/g, "+").replace(/_/g, "/");
}
ae.unescape = Hh;
function ab(t) {
  return Nh((0, Uh.fromByteArray)(new TextEncoder().encode(t)));
}
ae.encode = ab;
function cb(t) {
  return new TextDecoder().decode((0, Uh.toByteArray)(ul(Hh(t))));
}
ae.decode = cb;
var qo = {}, Wo = {}, Ph = {}, Oh = {}, Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
Xo.crypto = void 0;
Xo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = y, t.rotl = h, t.byteSwap = g, t.byteSwap32 = w, t.bytesToHex = U, t.hexToBytes = L, t.asyncLoop = V, t.utf8ToBytes = D, t.bytesToUtf8 = j, t.toBytes = m, t.kdfInputToBytes = C, t.concatBytes = P, t.checkOpts = X, t.createHasher = z, t.createOptHasher = xt, t.createXOFer = Ct, t.randomBytes = Dt;
  const e = Xo;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function s(A, ...x) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (x.length > 0 && !x.includes(A.length))
      throw new Error("Uint8Array expected of length " + x + ", got length=" + A.length);
  }
  function i(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, x = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (x && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, x) {
    s(A);
    const M = x.outputLen;
    if (A.length < M)
      throw new Error("digestInto() expects output buffer of length at least " + M);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function u(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function f(...A) {
    for (let x = 0; x < A.length; x++)
      A[x].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function y(A, x) {
    return A << 32 - x | A >>> x;
  }
  function h(A, x) {
    return A << x | A >>> 32 - x >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function g(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => g(A), t.byteSwapIfBE = t.swap8IfBE;
  function w(A) {
    for (let x = 0; x < A.length; x++)
      A[x] = g(A[x]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : w;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (A, x) => x.toString(16).padStart(2, "0"));
  function U(A) {
    if (s(A), I)
      return A.toHex();
    let x = "";
    for (let M = 0; M < A.length; M++)
      x += _[A[M]];
    return x;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function k(A) {
    if (A >= b._0 && A <= b._9)
      return A - b._0;
    if (A >= b.A && A <= b.F)
      return A - (b.A - 10);
    if (A >= b.a && A <= b.f)
      return A - (b.a - 10);
  }
  function L(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (I)
      return Uint8Array.fromHex(A);
    const x = A.length, M = x / 2;
    if (x % 2)
      throw new Error("hex string expected, got unpadded hex of length " + x);
    const G = new Uint8Array(M);
    for (let K = 0, q = 0; K < M; K++, q += 2) {
      const $t = k(A.charCodeAt(q)), jt = k(A.charCodeAt(q + 1));
      if ($t === void 0 || jt === void 0) {
        const fe = A[q] + A[q + 1];
        throw new Error('hex string expected, got non-hex character "' + fe + '" at index ' + q);
      }
      G[K] = $t * 16 + jt;
    }
    return G;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function V(A, x, M) {
    let G = Date.now();
    for (let K = 0; K < A; K++) {
      M(K);
      const q = Date.now() - G;
      q >= 0 && q < x || (await (0, t.nextTick)(), G += q);
    }
  }
  function D(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function j(A) {
    return new TextDecoder().decode(A);
  }
  function m(A) {
    return typeof A == "string" && (A = D(A)), s(A), A;
  }
  function C(A) {
    return typeof A == "string" && (A = D(A)), s(A), A;
  }
  function P(...A) {
    let x = 0;
    for (let G = 0; G < A.length; G++) {
      const K = A[G];
      s(K), x += K.length;
    }
    const M = new Uint8Array(x);
    for (let G = 0, K = 0; G < A.length; G++) {
      const q = A[G];
      M.set(q, K), K += q.length;
    }
    return M;
  }
  function X(A, x) {
    if (x !== void 0 && {}.toString.call(x) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, x);
  }
  class tt {
  }
  t.Hash = tt;
  function z(A) {
    const x = (G) => A().update(m(G)).digest(), M = A();
    return x.outputLen = M.outputLen, x.blockLen = M.blockLen, x.create = () => A(), x;
  }
  function xt(A) {
    const x = (G, K) => A(K).update(m(G)).digest(), M = A({});
    return x.outputLen = M.outputLen, x.blockLen = M.blockLen, x.create = (G) => A(G), x;
  }
  function Ct(A) {
    const x = (G, K) => A(K).update(m(G)).digest(), M = A({});
    return x.outputLen = M.outputLen, x.blockLen = M.blockLen, x.create = (G) => A(G), x;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = xt, t.wrapXOFConstructorWithOpts = Ct;
  function Dt(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Oh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Oh;
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
})(Ph);
const cs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Dh(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function tc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Yr(t, ...e) {
  if (!Dh(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function lb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  tc(t.outputLen), tc(t.blockLen);
}
function ec(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jh(t, e) {
  Yr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function ub(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function fb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ao(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function lo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Oe(t, e) {
  return t << 32 - e | t >>> e;
}
function db(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const fl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function dl(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Fh = fl ? (t) => t : (t) => dl(t), hb = Fh;
function zh(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = dl(t[e]);
  return t;
}
const pb = fl ? (t) => t : zh, Rh = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", gb = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yb(t) {
  if (Yr(t), Rh)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += gb[t[n]];
  return e;
}
const Sn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Pu(t) {
  if (t >= Sn._0 && t <= Sn._9)
    return t - Sn._0;
  if (t >= Sn.A && t <= Sn.F)
    return t - (Sn.A - 10);
  if (t >= Sn.a && t <= Sn.f)
    return t - (Sn.a - 10);
}
function wb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Rh)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Pu(t.charCodeAt(i)), a = Pu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Gh = async () => {
};
async function bb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Gh(), r += i);
  }
}
function hl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function xb(t) {
  return new TextDecoder().decode(t);
}
function $i(t) {
  return typeof t == "string" && (t = hl(t)), Yr(t), t;
}
function mb(t) {
  return typeof t == "string" && (t = hl(t)), Yr(t), t;
}
function Sb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Yr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Eb(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Kh = class {
};
function Yo(t) {
  const e = (r) => t().update($i(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Vh(t) {
  const e = (r, s) => t(s).update($i(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function qh(t) {
  const e = (r, s) => t(s).update($i(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Ab = Yo, $b = Vh, vb = qh;
function Ib(t = 32) {
  if (cs && typeof cs.getRandomValues == "function")
    return cs.getRandomValues(new Uint8Array(t));
  if (cs && typeof cs.randomBytes == "function")
    return Uint8Array.from(cs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Lb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Kh,
  abytes: Yr,
  aexists: ec,
  ahash: lb,
  anumber: tc,
  aoutput: jh,
  asyncLoop: bb,
  byteSwap: dl,
  byteSwap32: zh,
  byteSwapIfBE: hb,
  bytesToHex: yb,
  bytesToUtf8: xb,
  checkOpts: Eb,
  clean: Ao,
  concatBytes: Sb,
  createHasher: Yo,
  createOptHasher: Vh,
  createView: lo,
  createXOFer: qh,
  hexToBytes: wb,
  isBytes: Dh,
  isLE: fl,
  kdfInputToBytes: mb,
  nextTick: Gh,
  randomBytes: Ib,
  rotl: db,
  rotr: Oe,
  swap32IfBE: pb,
  swap8IfBE: Fh,
  toBytes: $i,
  u32: fb,
  u8: ub,
  utf8ToBytes: hl,
  wrapConstructor: Ab,
  wrapConstructorWithOpts: $b,
  wrapXOFConstructorWithOpts: vb
}, Symbol.toStringTag, { value: "Module" }));
function Cb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function kb(t, e, n) {
  return t & e ^ ~t & n;
}
function Bb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Tb extends Kh {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = lo(this.buffer);
  }
  update(e) {
    ec(this), e = $i(e), Yr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = lo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ec(this), jh(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ao(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Cb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = lo(e), c = this.outputLen;
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
const On = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Dn = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Mb = /* @__PURE__ */ Uint32Array.from([
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
]), jn = /* @__PURE__ */ new Uint32Array(64);
let pl = class extends Tb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = On[0] | 0, this.B = On[1] | 0, this.C = On[2] | 0, this.D = On[3] | 0, this.E = On[4] | 0, this.F = On[5] | 0, this.G = On[6] | 0, this.H = On[7] | 0;
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
      jn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = jn[l - 15], h = jn[l - 2], g = Oe(y, 7) ^ Oe(y, 18) ^ y >>> 3, w = Oe(h, 17) ^ Oe(h, 19) ^ h >>> 10;
      jn[l] = w + jn[l - 7] + g + jn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = Oe(a, 6) ^ Oe(a, 11) ^ Oe(a, 25), h = f + y + kb(a, c, u) + Mb[l] + jn[l] | 0, w = (Oe(r, 2) ^ Oe(r, 13) ^ Oe(r, 22)) + Bb(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Ao(jn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ao(this.buffer);
  }
}, Wh = class extends pl {
  constructor() {
    super(28), this.A = Dn[0] | 0, this.B = Dn[1] | 0, this.C = Dn[2] | 0, this.D = Dn[3] | 0, this.E = Dn[4] | 0, this.F = Dn[5] | 0, this.G = Dn[6] | 0, this.H = Dn[7] | 0;
  }
};
const _b = /* @__PURE__ */ Yo(() => new pl()), Ub = /* @__PURE__ */ Yo(() => new Wh()), Nb = pl, Hb = _b, Pb = Wh, Ob = Ub, Db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Pb,
  SHA256: Nb,
  sha224: Ob,
  sha256: Hb
}, Symbol.toStringTag, { value: "Module" })), Zo = /* @__PURE__ */ zo(Db), jb = /* @__PURE__ */ zo(Gw);
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.joseToDer = ks.derToJose = void 0;
const Xh = Ai, Yh = ae;
function La(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Fb = {
  ES256: La(256),
  ES384: La(384),
  ES512: La(521)
};
function Zh(t) {
  const e = Fb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const $o = 128, Qh = 0, zb = 32, Rb = 16, Gb = 2, Jh = Rb | zb | Qh << 6, vo = Gb | Qh << 6;
function t0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Xh.toByteArray)((0, Yh.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Kb(t, e) {
  const n = t0(t), r = Zh(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Jh)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === ($o | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== vo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== vo)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, h = r - f, g = new Uint8Array(y + c + h + f);
  for (o = 0; o < y; ++o)
    g[o] = 0;
  g.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const w = o; o < w + h; ++o)
    g[o] = 0;
  return g.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, Yh.escape)((0, Xh.fromByteArray)(g));
}
ks.derToJose = Kb;
function Ou(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= $o && --r, r;
}
function Vb(t, e) {
  t = t0(t);
  const n = Zh(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Ou(t, 0, n), i = Ou(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < $o, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Jh, u ? f[l++] = c : (f[l++] = $o | 1, f[l++] = c & 255), f[l++] = vo, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = vo, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
ks.joseToDer = Vb;
var kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.InvalidTokenError = kn.MissingParametersError = void 0;
class qb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
kn.MissingParametersError = qb;
class Wb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
kn.InvalidTokenError = Wb;
const vi = /* @__PURE__ */ zo(Lb);
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.SECP256K1Client = void 0;
const Xb = Ph, Yb = Zo, uo = jb, Du = ks, ju = kn, Fu = vi;
uo.utils.hmacSha256Sync = (t, ...e) => {
  const n = Xb.hmac.create(Yb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class e0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Fu.bytesToHex)(uo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ju.MissingParametersError("a signing input hash and private key are all required");
    const s = uo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Fu.bytesToHex)(s);
    if (r === "jose")
      return (0, Du.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Du.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ju.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return uo.verify(n, e, r, { strict: !1 });
  }
}
Wo.SECP256K1Client = e0;
e0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Wo;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(qo);
var Ur = {};
const Zb = /* @__PURE__ */ zo(ch);
var Qb = le && le.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.hashSha256Async = Ur.hashSha256 = void 0;
const Jb = Zo;
function n0(t) {
  return (0, Jb.sha256)(t);
}
Ur.hashSha256 = n0;
function t2(t) {
  return Qb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Zb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(n0(t));
    }
  });
}
Ur.hashSha256Async = t2;
var e2 = le && le.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.TokenSigner = Cs.createUnsecuredToken = void 0;
const nc = ae, zu = qo, n2 = kn, Ru = Ur;
function rc(t, e) {
  const n = [], r = nc.encode(JSON.stringify(e));
  n.push(r);
  const s = nc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function r2(t) {
  return rc(t, { typ: "JWT", alg: "none" }) + ".";
}
Cs.createUnsecuredToken = r2;
class s2 {
  constructor(e, n) {
    if (!(e && n))
      throw new n2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !zu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = zu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = rc(e, s), o = (0, Ru.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return e2(this, void 0, void 0, function* () {
      const s = this.header(r), i = rc(e, s), o = yield (0, Ru.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [nc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Cs.TokenSigner = s2;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.TokenVerifier = void 0;
const i2 = ae, Gu = qo, o2 = kn, Fi = Ur;
class a2 {
  constructor(e, n) {
    if (!(e && n))
      throw new o2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Gu.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Gu.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Fi.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Fi.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), i2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Fi.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Fi.hashSha256)(r);
      return i(o);
    }
  }
}
Qo.TokenVerifier = a2;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.decodeToken = void 0;
const zi = ae;
function c2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(zi.decode(e[0])), r = JSON.parse(zi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = zi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(zi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Jo.decodeToken = c2;
(function(t) {
  var e = le && le.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = le && le.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Cs, t), n(Qo, t), n(Jo, t), n(kn, t), n(qo, t);
})(ne);
function l2(t) {
  return `did:btc-addr:${t}`;
}
function u2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Au("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Au('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function r0(t) {
  if (t)
    return u2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const f2 = "1.4.0";
function d2() {
  return X1();
}
function h2(t, e, n, r = Qd.slice(), s, i = Vy().getTime(), o = {}) {
  const a = (h) => {
    const g = Jc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Wy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: f2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = ne.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = kh(u);
  return c.iss = l2(f), new ne.TokenSigner("ES256k", t).sign(c);
}
async function Ku(t, e) {
  const n = Si(wt(e)), r = JSON.parse(n), s = await _h(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function p2(t) {
  const e = ne.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ne.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function g2(t) {
  const e = ne.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = r0(e.iss);
  if (n.length === 1) {
    if (kh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function y2(t) {
  const e = ne.decodeToken(t).payload;
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
function w2(t) {
  const e = ne.decodeToken(t).payload;
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
function b2(t) {
  const e = [
    w2(t),
    y2(t),
    p2(t),
    g2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Vu = "1.0.0";
class ur {
  constructor(e) {
    this.version = Vu, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Vu)
      throw new Wa(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ur(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class s0 {
  constructor(e) {
    if (e) {
      const n = new ur(e);
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
class qu extends s0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ur({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Jd("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ur({})), !0;
  }
}
class Wu extends s0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Ry, !localStorage.getItem(this.key)) {
      const r = new ur({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Jd("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ur.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ur({})), !0;
  }
}
var ci;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ci || (ci = {}));
var Io;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Io || (Io = {}));
ci.Mainnet;
var Ln;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ln || (Ln = {}));
var on;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(on || (on = {}));
Ln.Mainnet;
const i0 = {
  chainId: ci.Mainnet,
  transactionVersion: Ln.Mainnet,
  peerNetworkId: Io.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: on.MainnetSingleSig,
    multiSig: on.MainnetMultiSig
  },
  client: { baseUrl: th }
}, sc = {
  chainId: ci.Testnet,
  transactionVersion: Ln.Testnet,
  peerNetworkId: Io.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: on.TestnetSingleSig,
    multiSig: on.TestnetMultiSig
  },
  client: { baseUrl: eh }
}, fo = {
  ...sc,
  addressVersion: { ...sc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: nh }
}, x2 = {
  ...fo,
  addressVersion: { ...fo.addressVersion },
  client: { ...fo.client }
};
function m2(t) {
  switch (t) {
    case "mainnet":
      return i0;
    case "testnet":
      return sc;
    case "devnet":
      return fo;
    case "mocknet":
      return x2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function o0(t) {
  return typeof t == "string" ? m2(t) : t;
}
var Xu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xu || (Xu = {}));
var Yu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Yu || (Yu = {}));
var De;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(De || (De = {}));
const Ca = ["onChainOnly", "offChainOnly", "any"];
Ca[0] + "", De.OnChainOnly, Ca[1] + "", De.OffChainOnly, Ca[2] + "", De.Any, De.OnChainOnly + "", De.OnChainOnly, De.OffChainOnly + "", De.OffChainOnly, De.Any + "", De.Any;
var Zu;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Zu || (Zu = {}));
var Qu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Qu || (Qu = {}));
var Ju;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ju || (Ju = {}));
var vn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(vn || (vn = {}));
var tf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(tf || (tf = {}));
var ef;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ef || (ef = {}));
var nf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(nf || (nf = {}));
var rf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(rf || (rf = {}));
var sf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(sf || (sf = {}));
var of;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(of || (of = {}));
var af;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(af || (af = {}));
var cf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(cf || (cf = {}));
var lf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(lf || (lf = {}));
function ic(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function S2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function a0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function E2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ic(t.outputLen), ic(t.blockLen);
}
function A2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function $2(t, e) {
  a0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Er = {
  number: ic,
  bool: S2,
  bytes: a0,
  hash: E2,
  exists: A2,
  output: $2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ka = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Je = (t, e) => t << 32 - e | t >>> e, v2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function I2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gl(t) {
  if (typeof t == "string" && (t = I2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let c0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zr(t) {
  const e = (r) => t().update(gl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let l0 = class extends c0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Er.hash(e);
    const r = gl(n);
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
    return Er.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Er.exists(this), Er.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const u0 = (t, e, n) => new l0(t, e).update(n).digest();
u0.create = (t, e) => new l0(t, e);
function L2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let yl = class extends c0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ka(this.buffer);
  }
  update(e) {
    Er.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gl(e);
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
    Er.exists(this), Er.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ka(e), c = this.outputLen;
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
const C2 = (t, e, n) => t & e ^ ~t & n, k2 = (t, e, n) => t & e ^ t & n ^ e & n, B2 = new Uint32Array([
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
]), Fn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zn = new Uint32Array(64);
let f0 = class extends yl {
  constructor() {
    super(64, 32, 8, !1), this.A = Fn[0] | 0, this.B = Fn[1] | 0, this.C = Fn[2] | 0, this.D = Fn[3] | 0, this.E = Fn[4] | 0, this.F = Fn[5] | 0, this.G = Fn[6] | 0, this.H = Fn[7] | 0;
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
      zn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = zn[l - 15], h = zn[l - 2], g = Je(y, 7) ^ Je(y, 18) ^ y >>> 3, w = Je(h, 17) ^ Je(h, 19) ^ h >>> 10;
      zn[l] = w + zn[l - 7] + g + zn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = Je(a, 6) ^ Je(a, 11) ^ Je(a, 25), h = f + y + C2(a, c, u) + B2[l] + zn[l] | 0, w = (Je(r, 2) ^ Je(r, 13) ^ Je(r, 22)) + k2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    zn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T2 = class extends f0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const d0 = Zr(() => new f0());
Zr(() => new T2());
var Qr = {}, wl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = vi;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const g = n.indexOf(o[h]) >> u;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const I = 1 + u, _ = w % (1 << I) << 5 - I, U = t.c32[g + _];
        u = I, c.unshift(U);
      } else
        u = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let h = 0; h < y; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let g = 0; g < h; g++)
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
    let f = [], l = 0, y = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      y === 4 && (f.unshift(n[l]), y = 0, l = 0);
      const _ = (t.c32.indexOf(o[w]) << y) + l, U = n[_ % 16];
      if (y += 1, l = _ >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      f.unshift(U);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let w = 0; w < f.length && f[w] === "0"; w++)
      h++;
    f = f.slice(h - h % 2);
    let g = f.join("");
    for (let w = 0; w < u; w++)
      g = `00${g}`;
    if (a) {
      const w = a * 2 - g.length;
      for (let I = 0; I < w; I += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = i;
})(wl);
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.c32checkDecode = Nr.c32checkEncode = void 0;
const uf = Zo, ff = vi, ni = wl;
function h0(t) {
  const e = (0, uf.sha256)((0, uf.sha256)((0, ff.hexToBytes)(t)));
  return (0, ff.bytesToHex)(e.slice(0, 4));
}
function M2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = h0(`${n}${e}`), s = (0, ni.c32encode)(`${e}${r}`);
  return `${ni.c32[t]}${s}`;
}
Nr.c32checkEncode = M2;
function _2(t) {
  t = (0, ni.c32normalize)(t);
  const e = (0, ni.c32decode)(t.slice(1)), n = t[0], r = ni.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), h0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Nr.c32checkDecode = _2;
var p0 = {}, Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
Bs.decode = Bs.encode = void 0;
const Lo = Zo, df = vi, g0 = $h, y0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function U2(t, e = "00") {
  const n = typeof t == "string" ? (0, df.hexToBytes)(t) : t, r = typeof e == "string" ? (0, df.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Lo.sha256)((0, Lo.sha256)(new Uint8Array([...r, ...n])));
  return g0(y0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Bs.encode = U2;
function N2(t) {
  const e = g0(y0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Lo.sha256)((0, Lo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Bs.decode = N2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Nr, n = Bs, r = vi;
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
    const y = n.decode(f), h = (0, r.bytesToHex)(y.data), g = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let w;
    return l < 0 ? (w = g, s[g] !== void 0 && (w = s[g])) : w = l, o(w, h);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const y = a(f), h = y[0], g = y[1];
    let w;
    l < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = l;
    let I = w.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(g, I);
  }
  t.c32ToB58 = u;
})(p0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = wl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Nr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = p0;
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
})(Qr);
function H2(t, e) {
  switch (e = o0(e ?? i0), t) {
    case vn.P2PKH:
      switch (e.transactionVersion) {
        case Ln.Mainnet:
          return on.MainnetSingleSig;
        case Ln.Testnet:
          return on.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case vn.P2SH:
    case vn.P2SHNonSequential:
    case vn.P2WPKH:
    case vn.P2WSH:
    case vn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Ln.Mainnet:
          return on.MainnetMultiSig;
        case Ln.Testnet:
          return on.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const P2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), w0 = Uint8Array.from({ length: 16 }, (t, e) => e), O2 = w0.map((t) => (9 * t + 5) % 16);
let bl = [w0], xl = [O2];
for (let t = 0; t < 4; t++)
  for (let e of [bl, xl])
    e.push(e[t].map((n) => P2[n]));
const b0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), D2 = bl.map((t, e) => t.map((n) => b0[e][n])), j2 = xl.map((t, e) => t.map((n) => b0[e][n])), F2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), z2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ri = (t, e) => t << e | t >>> 32 - e;
function hf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Gi = new Uint32Array(16);
let R2 = class extends yl {
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
      Gi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = F2[h], I = z2[h], _ = bl[h], U = xl[h], b = D2[h], k = j2[h];
      for (let L = 0; L < 16; L++) {
        const O = Ri(r + hf(h, i, a, u) + Gi[_[L]] + w, b[L]) + l | 0;
        r = l, l = u, u = Ri(a, 10) | 0, a = i, i = O;
      }
      for (let L = 0; L < 16; L++) {
        const O = Ri(s + hf(g, o, c, f) + Gi[U[L]] + I, k[L]) + y | 0;
        s = y, y = f, f = Ri(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Gi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const G2 = Zr(() => new R2()), Ki = BigInt(2 ** 32 - 1), oc = BigInt(32);
function x0(t, e = !1) {
  return e ? { h: Number(t & Ki), l: Number(t >> oc & Ki) } : { h: Number(t >> oc & Ki) | 0, l: Number(t & Ki) | 0 };
}
function K2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = x0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const V2 = (t, e) => BigInt(t >>> 0) << oc | BigInt(e >>> 0), q2 = (t, e, n) => t >>> n, W2 = (t, e, n) => t << 32 - n | e >>> n, X2 = (t, e, n) => t >>> n | e << 32 - n, Y2 = (t, e, n) => t << 32 - n | e >>> n, Z2 = (t, e, n) => t << 64 - n | e >>> n - 32, Q2 = (t, e, n) => t >>> n - 32 | e << 64 - n, J2 = (t, e) => e, tx = (t, e) => t, ex = (t, e, n) => t << n | e >>> 32 - n, nx = (t, e, n) => e << n | t >>> 32 - n, rx = (t, e, n) => e << n - 32 | t >>> 64 - n, sx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ix(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ox = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ax = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ux = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), fx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, st = {
  fromBig: x0,
  split: K2,
  toBig: V2,
  shrSH: q2,
  shrSL: W2,
  rotrSH: X2,
  rotrSL: Y2,
  rotrBH: Z2,
  rotrBL: Q2,
  rotr32H: J2,
  rotr32L: tx,
  rotlSH: ex,
  rotlSL: nx,
  rotlBH: rx,
  rotlBL: sx,
  add: ix,
  add3L: ox,
  add3H: ax,
  add4L: cx,
  add4H: lx,
  add5H: fx,
  add5L: ux
}, [dx, hx] = st.split([
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
].map((t) => BigInt(t))), Rn = new Uint32Array(80), Gn = new Uint32Array(80);
let ta = class extends yl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Rn[b] = e.getUint32(n), Gn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = Rn[b - 15] | 0, L = Gn[b - 15] | 0, O = st.rotrSH(k, L, 1) ^ st.rotrSH(k, L, 8) ^ st.shrSH(k, L, 7), V = st.rotrSL(k, L, 1) ^ st.rotrSL(k, L, 8) ^ st.shrSL(k, L, 7), D = Rn[b - 2] | 0, j = Gn[b - 2] | 0, m = st.rotrSH(D, j, 19) ^ st.rotrBH(D, j, 61) ^ st.shrSH(D, j, 6), C = st.rotrSL(D, j, 19) ^ st.rotrBL(D, j, 61) ^ st.shrSL(D, j, 6), P = st.add4L(V, C, Gn[b - 7], Gn[b - 16]), X = st.add4H(P, O, m, Rn[b - 7], Rn[b - 16]);
      Rn[b] = X | 0, Gn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: I, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const k = st.rotrSH(l, y, 14) ^ st.rotrSH(l, y, 18) ^ st.rotrBH(l, y, 41), L = st.rotrSL(l, y, 14) ^ st.rotrSL(l, y, 18) ^ st.rotrBL(l, y, 41), O = l & h ^ ~l & w, V = y & g ^ ~y & I, D = st.add5L(U, L, V, hx[b], Gn[b]), j = st.add5H(D, _, k, O, dx[b], Rn[b]), m = D | 0, C = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), P = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = I | 0, w = h | 0, I = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = st.add(u | 0, f | 0, j | 0, m | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = st.add3L(m, P, tt);
      r = st.add3H(z, j, C, X), s = z | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = st.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = st.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = st.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = st.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: I } = st.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: _, l: U } = st.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, f, l, y, h, g, w, I, _, U);
  }
  roundClean() {
    Rn.fill(0), Gn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, px = class extends ta {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gx = class extends ta {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yx = class extends ta {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Zr(() => new ta());
Zr(() => new px());
Zr(() => new gx());
Zr(() => new yx());
var Co = { exports: {} };
Co.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", h = "[object Number]", g = "[object Object]", w = "[object Promise]", I = "[object RegExp]", _ = "[object Set]", U = "[object String]", b = "[object Symbol]", k = "[object WeakMap]", L = "[object ArrayBuffer]", O = "[object DataView]", V = "[object Float32Array]", D = "[object Float64Array]", j = "[object Int8Array]", m = "[object Int16Array]", C = "[object Int32Array]", P = "[object Uint8Array]", X = "[object Uint8ClampedArray]", tt = "[object Uint16Array]", z = "[object Uint32Array]", xt = /[\\^$.*+?()[\]{}|]/g, Ct = /\w*$/, Dt = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, x = {};
  x[i] = x[o] = x[L] = x[O] = x[a] = x[c] = x[V] = x[D] = x[j] = x[m] = x[C] = x[y] = x[h] = x[g] = x[I] = x[_] = x[U] = x[b] = x[P] = x[X] = x[tt] = x[z] = !0, x[u] = x[f] = x[k] = !1;
  var M = typeof le == "object" && le && le.Object === Object && le, G = typeof self == "object" && self && self.Object === Object && self, K = M || G || Function("return this")(), q = e && !e.nodeType && e, $t = q && !0 && t && !t.nodeType && t, jt = $t && $t.exports === q;
  function fe(p, v) {
    return p.set(v[0], v[1]), p;
  }
  function Ue(p, v) {
    return p.add(v), p;
  }
  function Wt(p, v) {
    for (var B = -1, Z = p ? p.length : 0; ++B < Z && v(p[B], B, p) !== !1; )
      ;
    return p;
  }
  function Ie(p, v) {
    for (var B = -1, Z = v.length, ee = p.length; ++B < Z; )
      p[ee + B] = v[B];
    return p;
  }
  function _t(p, v, B, Z) {
    for (var ee = -1, de = p ? p.length : 0; ++ee < de; )
      B = v(B, p[ee], ee, p);
    return B;
  }
  function Gt(p, v) {
    for (var B = -1, Z = Array(p); ++B < p; )
      Z[B] = v(B);
    return Z;
  }
  function Qt(p, v) {
    return p == null ? void 0 : p[v];
  }
  function Bt(p) {
    var v = !1;
    if (p != null && typeof p.toString != "function")
      try {
        v = !!(p + "");
      } catch {
      }
    return v;
  }
  function d(p) {
    var v = -1, B = Array(p.size);
    return p.forEach(function(Z, ee) {
      B[++v] = [ee, Z];
    }), B;
  }
  function $(p, v) {
    return function(B) {
      return p(v(B));
    };
  }
  function T(p) {
    var v = -1, B = Array(p.size);
    return p.forEach(function(Z) {
      B[++v] = Z;
    }), B;
  }
  var Y = Array.prototype, dt = Function.prototype, mt = Object.prototype, re = K["__core-js_shared__"], Jt = function() {
    var p = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), qe = dt.toString, Xt = mt.hasOwnProperty, Ne = mt.toString, pr = RegExp(
    "^" + qe.call(Xt).replace(xt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), te = jt ? K.Buffer : void 0, Le = K.Symbol, ht = K.Uint8Array, Tt = $(Object.getPrototypeOf, Object), gt = Object.create, He = mt.propertyIsEnumerable, gr = Y.splice, pn = Object.getOwnPropertySymbols, yr = te ? te.isBuffer : void 0, gn = $(Object.keys, Object), yn = is(K, "DataView"), Pe = is(K, "Map"), Mn = is(K, "Promise"), _n = is(K, "Set"), We = is(K, "WeakMap"), Xe = is(Object, "create"), S = br(yn), E = br(Pe), H = br(Mn), nt = br(_n), W = br(We), Mt = Le ? Le.prototype : void 0, ut = Mt ? Mt.valueOf : void 0;
  function Et(p) {
    var v = -1, B = p ? p.length : 0;
    for (this.clear(); ++v < B; ) {
      var Z = p[v];
      this.set(Z[0], Z[1]);
    }
  }
  function wn() {
    this.__data__ = Xe ? Xe(null) : {};
  }
  function Ye(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function bn(p) {
    var v = this.__data__;
    if (Xe) {
      var B = v[p];
      return B === r ? void 0 : B;
    }
    return Xt.call(v, p) ? v[p] : void 0;
  }
  function we(p) {
    var v = this.__data__;
    return Xe ? v[p] !== void 0 : Xt.call(v, p);
  }
  function Ze(p, v) {
    var B = this.__data__;
    return B[p] = Xe && v === void 0 ? r : v, this;
  }
  Et.prototype.clear = wn, Et.prototype.delete = Ye, Et.prototype.get = bn, Et.prototype.has = we, Et.prototype.set = Ze;
  function xn(p) {
    var v = -1, B = p ? p.length : 0;
    for (this.clear(); ++v < B; ) {
      var Z = p[v];
      this.set(Z[0], Z[1]);
    }
  }
  function $g() {
    this.__data__ = [];
  }
  function vg(p) {
    var v = this.__data__, B = ki(v, p);
    if (B < 0)
      return !1;
    var Z = v.length - 1;
    return B == Z ? v.pop() : gr.call(v, B, 1), !0;
  }
  function Ig(p) {
    var v = this.__data__, B = ki(v, p);
    return B < 0 ? void 0 : v[B][1];
  }
  function Lg(p) {
    return ki(this.__data__, p) > -1;
  }
  function Cg(p, v) {
    var B = this.__data__, Z = ki(B, p);
    return Z < 0 ? B.push([p, v]) : B[Z][1] = v, this;
  }
  xn.prototype.clear = $g, xn.prototype.delete = vg, xn.prototype.get = Ig, xn.prototype.has = Lg, xn.prototype.set = Cg;
  function rs(p) {
    var v = -1, B = p ? p.length : 0;
    for (this.clear(); ++v < B; ) {
      var Z = p[v];
      this.set(Z[0], Z[1]);
    }
  }
  function kg() {
    this.__data__ = {
      hash: new Et(),
      map: new (Pe || xn)(),
      string: new Et()
    };
  }
  function Bg(p) {
    return Bi(this, p).delete(p);
  }
  function Tg(p) {
    return Bi(this, p).get(p);
  }
  function Mg(p) {
    return Bi(this, p).has(p);
  }
  function _g(p, v) {
    return Bi(this, p).set(p, v), this;
  }
  rs.prototype.clear = kg, rs.prototype.delete = Bg, rs.prototype.get = Tg, rs.prototype.has = Mg, rs.prototype.set = _g;
  function ss(p) {
    this.__data__ = new xn(p);
  }
  function Ug() {
    this.__data__ = new xn();
  }
  function Ng(p) {
    return this.__data__.delete(p);
  }
  function Hg(p) {
    return this.__data__.get(p);
  }
  function Pg(p) {
    return this.__data__.has(p);
  }
  function Og(p, v) {
    var B = this.__data__;
    if (B instanceof xn) {
      var Z = B.__data__;
      if (!Pe || Z.length < n - 1)
        return Z.push([p, v]), this;
      B = this.__data__ = new rs(Z);
    }
    return B.set(p, v), this;
  }
  ss.prototype.clear = Ug, ss.prototype.delete = Ng, ss.prototype.get = Hg, ss.prototype.has = Pg, ss.prototype.set = Og;
  function Dg(p, v) {
    var B = xa(p) || ly(p) ? Gt(p.length, String) : [], Z = B.length, ee = !!Z;
    for (var de in p)
      Xt.call(p, de) && !(ee && (de == "length" || iy(de, Z))) && B.push(de);
    return B;
  }
  function lu(p, v, B) {
    var Z = p[v];
    (!(Xt.call(p, v) && hu(Z, B)) || B === void 0 && !(v in p)) && (p[v] = B);
  }
  function ki(p, v) {
    for (var B = p.length; B--; )
      if (hu(p[B][0], v))
        return B;
    return -1;
  }
  function jg(p, v) {
    return p && uu(v, ma(v), p);
  }
  function wa(p, v, B, Z, ee, de, mn) {
    var he;
    if (Z && (he = de ? Z(p, ee, de, mn) : Z(p)), he !== void 0)
      return he;
    if (!Ti(p))
      return p;
    var yu = xa(p);
    if (yu) {
      if (he = ny(p), !v)
        return Jg(p, he);
    } else {
      var os = wr(p), wu = os == f || os == l;
      if (fy(p))
        return Vg(p, v);
      if (os == g || os == i || wu && !de) {
        if (Bt(p))
          return de ? p : {};
        if (he = ry(wu ? {} : p), !v)
          return ty(p, jg(he, p));
      } else {
        if (!x[os])
          return de ? p : {};
        he = sy(p, os, wa, v);
      }
    }
    mn || (mn = new ss());
    var bu = mn.get(p);
    if (bu)
      return bu;
    if (mn.set(p, he), !yu)
      var xu = B ? ey(p) : ma(p);
    return Wt(xu || p, function(Sa, Mi) {
      xu && (Mi = Sa, Sa = p[Mi]), lu(he, Mi, wa(Sa, v, B, Z, Mi, p, mn));
    }), he;
  }
  function Fg(p) {
    return Ti(p) ? gt(p) : {};
  }
  function zg(p, v, B) {
    var Z = v(p);
    return xa(p) ? Z : Ie(Z, B(p));
  }
  function Rg(p) {
    return Ne.call(p);
  }
  function Gg(p) {
    if (!Ti(p) || ay(p))
      return !1;
    var v = gu(p) || Bt(p) ? pr : Dt;
    return v.test(br(p));
  }
  function Kg(p) {
    if (!du(p))
      return gn(p);
    var v = [];
    for (var B in Object(p))
      Xt.call(p, B) && B != "constructor" && v.push(B);
    return v;
  }
  function Vg(p, v) {
    if (v)
      return p.slice();
    var B = new p.constructor(p.length);
    return p.copy(B), B;
  }
  function ba(p) {
    var v = new p.constructor(p.byteLength);
    return new ht(v).set(new ht(p)), v;
  }
  function qg(p, v) {
    var B = v ? ba(p.buffer) : p.buffer;
    return new p.constructor(B, p.byteOffset, p.byteLength);
  }
  function Wg(p, v, B) {
    var Z = v ? B(d(p), !0) : d(p);
    return _t(Z, fe, new p.constructor());
  }
  function Xg(p) {
    var v = new p.constructor(p.source, Ct.exec(p));
    return v.lastIndex = p.lastIndex, v;
  }
  function Yg(p, v, B) {
    var Z = v ? B(T(p), !0) : T(p);
    return _t(Z, Ue, new p.constructor());
  }
  function Zg(p) {
    return ut ? Object(ut.call(p)) : {};
  }
  function Qg(p, v) {
    var B = v ? ba(p.buffer) : p.buffer;
    return new p.constructor(B, p.byteOffset, p.length);
  }
  function Jg(p, v) {
    var B = -1, Z = p.length;
    for (v || (v = Array(Z)); ++B < Z; )
      v[B] = p[B];
    return v;
  }
  function uu(p, v, B, Z) {
    B || (B = {});
    for (var ee = -1, de = v.length; ++ee < de; ) {
      var mn = v[ee], he = void 0;
      lu(B, mn, he === void 0 ? p[mn] : he);
    }
    return B;
  }
  function ty(p, v) {
    return uu(p, fu(p), v);
  }
  function ey(p) {
    return zg(p, ma, fu);
  }
  function Bi(p, v) {
    var B = p.__data__;
    return oy(v) ? B[typeof v == "string" ? "string" : "hash"] : B.map;
  }
  function is(p, v) {
    var B = Qt(p, v);
    return Gg(B) ? B : void 0;
  }
  var fu = pn ? $(pn, Object) : py, wr = Rg;
  (yn && wr(new yn(new ArrayBuffer(1))) != O || Pe && wr(new Pe()) != y || Mn && wr(Mn.resolve()) != w || _n && wr(new _n()) != _ || We && wr(new We()) != k) && (wr = function(p) {
    var v = Ne.call(p), B = v == g ? p.constructor : void 0, Z = B ? br(B) : void 0;
    if (Z)
      switch (Z) {
        case S:
          return O;
        case E:
          return y;
        case H:
          return w;
        case nt:
          return _;
        case W:
          return k;
      }
    return v;
  });
  function ny(p) {
    var v = p.length, B = p.constructor(v);
    return v && typeof p[0] == "string" && Xt.call(p, "index") && (B.index = p.index, B.input = p.input), B;
  }
  function ry(p) {
    return typeof p.constructor == "function" && !du(p) ? Fg(Tt(p)) : {};
  }
  function sy(p, v, B, Z) {
    var ee = p.constructor;
    switch (v) {
      case L:
        return ba(p);
      case a:
      case c:
        return new ee(+p);
      case O:
        return qg(p, Z);
      case V:
      case D:
      case j:
      case m:
      case C:
      case P:
      case X:
      case tt:
      case z:
        return Qg(p, Z);
      case y:
        return Wg(p, Z, B);
      case h:
      case U:
        return new ee(p);
      case I:
        return Xg(p);
      case _:
        return Yg(p, Z, B);
      case b:
        return Zg(p);
    }
  }
  function iy(p, v) {
    return v = v ?? s, !!v && (typeof p == "number" || A.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function oy(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function ay(p) {
    return !!Jt && Jt in p;
  }
  function du(p) {
    var v = p && p.constructor, B = typeof v == "function" && v.prototype || mt;
    return p === B;
  }
  function br(p) {
    if (p != null) {
      try {
        return qe.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function cy(p) {
    return wa(p, !0, !0);
  }
  function hu(p, v) {
    return p === v || p !== p && v !== v;
  }
  function ly(p) {
    return uy(p) && Xt.call(p, "callee") && (!He.call(p, "callee") || Ne.call(p) == i);
  }
  var xa = Array.isArray;
  function pu(p) {
    return p != null && dy(p.length) && !gu(p);
  }
  function uy(p) {
    return hy(p) && pu(p);
  }
  var fy = yr || gy;
  function gu(p) {
    var v = Ti(p) ? Ne.call(p) : "";
    return v == f || v == l;
  }
  function dy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Ti(p) {
    var v = typeof p;
    return !!p && (v == "object" || v == "function");
  }
  function hy(p) {
    return !!p && typeof p == "object";
  }
  function ma(p) {
    return pu(p) ? Dg(p) : Kg(p);
  }
  function py() {
    return [];
  }
  function gy() {
    return !1;
  }
  t.exports = cy;
})(Co, Co.exports);
var wx = Co.exports;
const m0 = /* @__PURE__ */ Wd(wx);
var ac;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ac || (ac = {}));
function bx(t, e) {
  return { type: ac.Address, version: t, hash160: e };
}
function xx(t) {
  return Qr.c32address(t.version, t.hash160);
}
const mx = (t) => G2(d0(t)), Sx = (t) => J(mx(t));
Rt.hmacSha256Sync = (t, ...e) => {
  const n = u0.create(d0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ex(t, e = "mainnet") {
  e = o0(e), t = typeof t == "string" ? wt(t) : t;
  const n = H2(vn.P2PKH, e), r = bx(n, Sx(t));
  return xx(r);
}
function Ax(t, e) {
  const n = ne.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Ex(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ne.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function $x(t, e = null) {
  let n;
  e ? n = Ax(t, e) : n = ne.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const pf = "_blockstackDidCheckEchoReply", vx = "echoReply", Ix = "authContinuation";
function Lx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Cx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[pf];
  if (typeof e == "boolean")
    return e;
  const n = Lx(t.location.search), r = n[vx];
  if (r) {
    t[pf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Ix];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class cc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new rh();
    else
      throw new Ky("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Wu(e.sessionOptions) : this.store = new Wu() : e ? this.store = new qu(e.sessionOptions) : this.store = new qu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = qy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Wa("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, h2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = d2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Jc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Cx())
        return ps.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ps.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = yw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new _i("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ne.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await b2(e))
      throw new _i("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Aa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Ku(s, i.private_key);
          } catch {
            if (ps.warn("Failed decryption of appPrivateKey, will try to use as given"), !Rt.isValidPrivateKey(i.private_key))
              throw new _i("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Ku(s, c);
          } catch {
            ps.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new _i("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = iw, f;
    Aa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Aa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: r0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, y = i.profile_url;
    if (!l.profile && y) {
      const h = await n(y);
      if (!h.ok)
        l.profile = Object.assign({}, zy);
      else {
        const g = await h.text(), w = JSON.parse(g);
        l.profile = $x(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Wa("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ib(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ob(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
cc.prototype.makeAuthRequest = cc.prototype.makeAuthRequestToken;
const kx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Bx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = kx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ea(r.id));
  return e.concat(n);
}, ea = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), S0 = "STX_PROVIDER", Hr = () => typeof window > "u" ? null : window.localStorage.getItem(S0), Tx = (t) => {
  typeof window < "u" && window.localStorage.setItem(S0, t);
}, Mx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function _x(t, e) {
  const n = {};
  return Object.assign(n, Mx, e), await fetch(t, n);
}
function Ux(t) {
  let e = _x, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Nx(...t) {
  const { fetchLib: e, middlewares: n } = Ux(t);
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
var Ts;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ts || (Ts = {}));
var Pr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pr || (Pr = {}));
var gf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gf || (gf = {}));
const Hx = "https://api.mainnet.hiro.so", Px = "https://api.testnet.hiro.so", Ox = "http://localhost:3999", Dx = ["mainnet", "testnet", "devnet", "mocknet"];
class Or {
  constructor(e) {
    this.version = Pr.Mainnet, this.chainId = Ts.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Pr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Nx();
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
Or.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new lc();
    case "testnet":
      return new uc();
    case "devnet":
      return new jx();
    case "mocknet":
      return new E0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Dx.join(", ")}`);
  }
};
Or.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Or.fromName(t);
class lc extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pr.Mainnet, this.chainId = Ts.Mainnet;
  }
}
class uc extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pr.Testnet, this.chainId = Ts.Testnet;
  }
}
class E0 extends Or {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ox,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pr.Testnet, this.chainId = Ts.Testnet;
  }
}
const jx = E0;
var Dr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Dr || (Dr = {}));
var ko;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ko || (ko = {}));
Dr.Mainnet;
var jr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jr || (jr = {}));
var Fr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Fr || (Fr = {}));
jr.Mainnet;
const Fx = {
  chainId: Dr.Mainnet,
  transactionVersion: jr.Mainnet,
  peerNetworkId: ko.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Fr.MainnetSingleSig,
    multiSig: Fr.MainnetMultiSig
  },
  client: { baseUrl: th }
}, fc = {
  chainId: Dr.Testnet,
  transactionVersion: jr.Testnet,
  peerNetworkId: ko.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Fr.TestnetSingleSig,
    multiSig: Fr.TestnetMultiSig
  },
  client: { baseUrl: eh }
}, ho = {
  ...fc,
  addressVersion: { ...fc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: nh }
}, zx = {
  ...ho,
  addressVersion: { ...ho.addressVersion },
  client: { ...ho.client }
};
function Rx(t) {
  switch (t) {
    case "mainnet":
      return Fx;
    case "testnet":
      return fc;
    case "devnet":
      return ho;
    case "mocknet":
      return zx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Gx(t) {
  return typeof t == "string" ? Rx(t) : t;
}
function Kx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const yf = /* @__PURE__ */ new Map();
function A0(t, e) {
  const n = yf.get(t);
  if (n !== void 0)
    return n(e);
  const r = Kx(t);
  return yf.set(t, r), A0(t, e);
}
let kt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return dw(this.readBytes(4), 0);
  }
  readUInt8() {
    return uw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return cw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = J(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = J(n);
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
    if (A0(e, r))
      return r;
    throw n(r);
  }
};
const Vx = 128, qx = 128, $0 = 16, Lr = 32, dc = 80, na = 65, Wx = 32, Xx = 64, Bo = 34, Yx = 1 + 16 * 1024 * 1024, Zx = 165, Qx = 16, Jx = 16, tm = 20, em = Jx + 2 + tm, nm = em + 4, rm = Yx + (Zx + Qx * nm);
var At;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(At || (At = {}));
var hc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(hc || (hc = {}));
var xe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xe || (xe = {}));
const Ba = ["onChainOnly", "offChainOnly", "any"];
Ba[0] + "", xe.OnChainOnly, Ba[1] + "", xe.OffChainOnly, Ba[2] + "", xe.Any, xe.OnChainOnly + "", xe.OnChainOnly, xe.OffChainOnly + "", xe.OffChainOnly, xe.Any + "", xe.Any;
var To;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(To || (To = {}));
var Ut;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ut || (Ut = {}));
var Ft;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ft || (Ft = {}));
var It;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(It || (It = {}));
var Pt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Pt || (Pt = {}));
var ri;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ri || (ri = {}));
var pc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pc || (pc = {}));
var gc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gc || (gc = {}));
var ce;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ce || (ce = {}));
var wf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wf || (wf = {}));
var yc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(yc || (yc = {}));
var Fe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fe || (Fe = {}));
var bf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(bf || (bf = {}));
let ra = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, gs = class extends ra {
  constructor(e) {
    super(e);
  }
}, oe = class extends ra {
  constructor(e) {
    super(e);
  }
}, Mo = class extends ra {
  constructor(e) {
    super(e);
  }
}, Ar = class extends ra {
  constructor(e) {
    super(e);
  }
};
function wc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function v0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function im(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wc(t.outputLen), wc(t.blockLen);
}
function om(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function am(t, e) {
  v0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $r = {
  number: wc,
  bool: sm,
  bytes: v0,
  hash: im,
  exists: om,
  output: am
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ta = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), tn = (t, e) => t << 32 - e | t >>> e, cm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ml(t) {
  if (typeof t == "string" && (t = lm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let I0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Jr(t) {
  const e = (r) => t().update(ml(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let L0 = class extends I0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $r.hash(e);
    const r = ml(n);
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
    return $r.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $r.exists(this), $r.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const C0 = (t, e, n) => new L0(t, e).update(n).digest();
C0.create = (t, e) => new L0(t, e);
function um(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Sl = class extends I0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ta(this.buffer);
  }
  update(e) {
    $r.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ml(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ta(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $r.exists(this), $r.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    um(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ta(e), c = this.outputLen;
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
const fm = (t, e, n) => t & e ^ ~t & n, dm = (t, e, n) => t & e ^ t & n ^ e & n, hm = new Uint32Array([
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
]), Vn = new Uint32Array(64);
let k0 = class extends Sl {
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
      Vn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Vn[l - 15], h = Vn[l - 2], g = tn(y, 7) ^ tn(y, 18) ^ y >>> 3, w = tn(h, 17) ^ tn(h, 19) ^ h >>> 10;
      Vn[l] = w + Vn[l - 7] + g + Vn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = tn(a, 6) ^ tn(a, 11) ^ tn(a, 25), h = f + y + fm(a, c, u) + hm[l] + Vn[l] | 0, w = (tn(r, 2) ^ tn(r, 13) ^ tn(r, 22)) + dm(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Vn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, pm = class extends k0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const El = Jr(() => new k0());
Jr(() => new pm());
const gm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), B0 = Uint8Array.from({ length: 16 }, (t, e) => e), ym = B0.map((t) => (9 * t + 5) % 16);
let Al = [B0], $l = [ym];
for (let t = 0; t < 4; t++)
  for (let e of [Al, $l])
    e.push(e[t].map((n) => gm[n]));
const T0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), wm = Al.map((t, e) => t.map((n) => T0[e][n])), bm = $l.map((t, e) => t.map((n) => T0[e][n])), xm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vi = (t, e) => t << e | t >>> 32 - e;
function xf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qi = new Uint32Array(16);
let Sm = class extends Sl {
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
      qi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = xm[h], I = mm[h], _ = Al[h], U = $l[h], b = wm[h], k = bm[h];
      for (let L = 0; L < 16; L++) {
        const O = Vi(r + xf(h, i, a, u) + qi[_[L]] + w, b[L]) + l | 0;
        r = l, l = u, u = Vi(a, 10) | 0, a = i, i = O;
      }
      for (let L = 0; L < 16; L++) {
        const O = Vi(s + xf(g, o, c, f) + qi[U[L]] + I, k[L]) + y | 0;
        s = y, y = f, f = Vi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Em = Jr(() => new Sm()), Wi = BigInt(2 ** 32 - 1), bc = BigInt(32);
function M0(t, e = !1) {
  return e ? { h: Number(t & Wi), l: Number(t >> bc & Wi) } : { h: Number(t >> bc & Wi) | 0, l: Number(t & Wi) | 0 };
}
function Am(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = M0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $m = (t, e) => BigInt(t >>> 0) << bc | BigInt(e >>> 0), vm = (t, e, n) => t >>> n, Im = (t, e, n) => t << 32 - n | e >>> n, Lm = (t, e, n) => t >>> n | e << 32 - n, Cm = (t, e, n) => t << 32 - n | e >>> n, km = (t, e, n) => t << 64 - n | e >>> n - 32, Bm = (t, e, n) => t >>> n - 32 | e << 64 - n, Tm = (t, e) => e, Mm = (t, e) => t, _m = (t, e, n) => t << n | e >>> 32 - n, Um = (t, e, n) => e << n | t >>> 32 - n, Nm = (t, e, n) => e << n - 32 | t >>> 64 - n, Hm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Pm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Om = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, jm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, zm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, it = {
  fromBig: M0,
  split: Am,
  toBig: $m,
  shrSH: vm,
  shrSL: Im,
  rotrSH: Lm,
  rotrSL: Cm,
  rotrBH: km,
  rotrBL: Bm,
  rotr32H: Tm,
  rotr32L: Mm,
  rotlSH: _m,
  rotlSL: Um,
  rotlBH: Nm,
  rotlBL: Hm,
  add: Pm,
  add3L: Om,
  add3H: Dm,
  add4L: jm,
  add4H: Fm,
  add5H: Rm,
  add5L: zm
}, [Gm, Km] = it.split([
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
].map((t) => BigInt(t))), qn = new Uint32Array(80), Wn = new Uint32Array(80);
let sa = class extends Sl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      qn[b] = e.getUint32(n), Wn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = qn[b - 15] | 0, L = Wn[b - 15] | 0, O = it.rotrSH(k, L, 1) ^ it.rotrSH(k, L, 8) ^ it.shrSH(k, L, 7), V = it.rotrSL(k, L, 1) ^ it.rotrSL(k, L, 8) ^ it.shrSL(k, L, 7), D = qn[b - 2] | 0, j = Wn[b - 2] | 0, m = it.rotrSH(D, j, 19) ^ it.rotrBH(D, j, 61) ^ it.shrSH(D, j, 6), C = it.rotrSL(D, j, 19) ^ it.rotrBL(D, j, 61) ^ it.shrSL(D, j, 6), P = it.add4L(V, C, Wn[b - 7], Wn[b - 16]), X = it.add4H(P, O, m, qn[b - 7], qn[b - 16]);
      qn[b] = X | 0, Wn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: I, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const k = it.rotrSH(l, y, 14) ^ it.rotrSH(l, y, 18) ^ it.rotrBH(l, y, 41), L = it.rotrSL(l, y, 14) ^ it.rotrSL(l, y, 18) ^ it.rotrBL(l, y, 41), O = l & h ^ ~l & w, V = y & g ^ ~y & I, D = it.add5L(U, L, V, Km[b], Wn[b]), j = it.add5H(D, _, k, O, Gm[b], qn[b]), m = D | 0, C = it.rotrSH(r, s, 28) ^ it.rotrBH(r, s, 34) ^ it.rotrBH(r, s, 39), P = it.rotrSL(r, s, 28) ^ it.rotrBL(r, s, 34) ^ it.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = I | 0, w = h | 0, I = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = it.add(u | 0, f | 0, j | 0, m | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = it.add3L(m, P, tt);
      r = it.add3H(z, j, C, X), s = z | 0;
    }
    ({ h: r, l: s } = it.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = it.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = it.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = it.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = it.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = it.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: I } = it.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: _, l: U } = it.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, f, l, y, h, g, w, I, _, U);
  }
  roundClean() {
    qn.fill(0), Wn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vm = class extends sa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, qm = class extends sa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Wm = class extends sa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Jr(() => new sa());
Jr(() => new Vm());
const Xm = Jr(() => new qm());
Jr(() => new Wm());
var pt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(pt || (pt = {}));
var Yt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Yt || (Yt = {}));
function vl(t) {
  return Yt[t];
}
const Ym = () => ({ type: pt.BoolTrue }), Zm = () => ({ type: pt.BoolFalse }), Qm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: pt.Buffer, value: J(t) };
}, mf = BigInt("0xffffffffffffffffffffffffffffffff"), Jm = BigInt(0), Sf = BigInt("0x7fffffffffffffffffffffffffffffff"), Ef = BigInt("-170141183460469231731687303715884105728"), tS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ya(wt(t))), ye(t, Uint8Array) && (t = Ya(t));
  const e = ie(t);
  if (e > Sf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Sf}`);
  if (e < Ef)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ef}`);
  return { type: pt.Int, value: e };
}, eS = (t) => {
  const e = ie(t);
  if (e < Jm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > mf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${mf}`);
  return { type: pt.UInt, value: e };
};
function nS(t) {
  return { type: pt.List, value: t };
}
function _0() {
  return { type: pt.OptionalNone };
}
function U0(t) {
  return { type: pt.OptionalSome, value: t };
}
var R;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(R || (R = {}));
function rS() {
  return {
    type: R.Address,
    version: Fr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Af(t) {
  if (t && R0(t, Bo))
    throw new Error(`Memo exceeds maximum length of ${Bo} bytes`);
  return { type: R.MemoString, content: t };
}
function Il(t, e) {
  return {
    type: R.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function xc(t) {
  if (wt(t).byteLength != na)
    throw Error("Invalid signature");
  return {
    type: R.MessageSignature,
    data: t
  };
}
function sS(t, e, n) {
  return typeof t == "string" && (t = mS(t)), typeof n == "string" && (n = Af(n)), {
    type: R.Payload,
    payloadType: At.TokenTransfer,
    recipient: t,
    amount: ie(e),
    memo: n ?? Af("")
  };
}
function iS(t, e, n, r) {
  return typeof e == "string" && (e = Ke(e)), typeof n == "string" && (n = Ke(n)), {
    type: R.Payload,
    payloadType: At.ContractCall,
    contractAddress: typeof t == "string" ? hr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function oS(t) {
  return Ke(t, 4, 1e5);
}
function $f(t, e, n) {
  return typeof t == "string" && (t = Ke(t)), typeof e == "string" && (e = oS(e)), typeof n == "number" ? {
    type: R.Payload,
    payloadType: At.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: R.Payload,
    payloadType: At.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function aS() {
  return { type: R.Payload, payloadType: At.PoisonMicroblock };
}
function vf(t, e) {
  if (t.byteLength != Lr)
    throw Error(`Coinbase buffer size must be ${Lr} bytes`);
  return e != null ? {
    type: R.Payload,
    payloadType: At.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: R.Payload,
    payloadType: At.Coinbase,
    coinbaseBytes: t
  };
}
function cS(t, e, n) {
  if (t.byteLength != Lr)
    throw Error(`Coinbase buffer size must be ${Lr} bytes`);
  if (n.byteLength != dc)
    throw Error(`VRF proof buffer size must be ${dc} bytes`);
  return {
    type: R.Payload,
    payloadType: At.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === pt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function lS(t, e, n, r, s, i, o) {
  return {
    type: R.Payload,
    payloadType: At.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ke(t, e, n) {
  const r = e || 1, s = n || Vx;
  if (R0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: R.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function uS(t, e, n) {
  return {
    type: R.Asset,
    address: hr(t),
    contractName: Ke(e),
    assetName: Ke(n)
  };
}
function hr(t) {
  const e = Qr.c32addressDecode(t);
  return {
    type: R.Address,
    version: e[0],
    hash160: e[1]
  };
}
function fS(t, e) {
  const n = hr(t), r = Ke(e);
  return {
    type: R.Principal,
    prefix: ce.Contract,
    address: n,
    contractName: r
  };
}
function dS(t) {
  const e = hr(t);
  return {
    type: R.Principal,
    prefix: ce.Standard,
    address: e
  };
}
function ys(t, e) {
  return {
    pubKeyEncoding: t,
    type: R.TransactionAuthField,
    contents: e
  };
}
function En(t) {
  switch (t.type) {
    case R.Address:
      return Ii(t);
    case R.Principal:
      return N0(t);
    case R.LengthPrefixedString:
      return _s(t);
    case R.MemoString:
      return pS(t);
    case R.Asset:
      return P0(t);
    case R.PostCondition:
      return D0(t);
    case R.PublicKey:
      return Ec(t);
    case R.LengthPrefixedList:
      return Ll(t);
    case R.Payload:
      return j0(t);
    case R.TransactionAuthField:
      return xS(t);
    case R.MessageSignature:
      return Cl(t);
  }
}
function Ii(t) {
  const e = [];
  return e.push(wt(mi(t.version, 1))), e.push(wt(t.hash160)), Vt(e);
}
function Ms(t) {
  const e = ye(t, kt) ? t : new kt(t), n = Ro(J(e.readBytes(1))), r = J(e.readBytes(20));
  return { type: R.Address, version: n, hash160: r };
}
function N0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ce.Standard || t.prefix === ce.Contract) && e.push(Ii(t.address)), t.prefix === ce.Contract && e.push(_s(t.contractName)), Vt(e);
}
function hS(t) {
  const e = ye(t, kt) ? t : new kt(t), n = e.readUInt8Enum(ce, (i) => {
    throw new oe(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ce.Origin)
    return { type: R.Principal, prefix: n };
  const r = Ms(e);
  if (n === ce.Standard)
    return { type: R.Principal, prefix: n, address: r };
  const s = Te(e);
  return {
    type: R.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function _s(t) {
  const e = [], n = Wr(t.content), r = n.byteLength;
  return e.push(wt(mi(r, t.lengthPrefixBytes))), e.push(n), Vt(e);
}
function Te(t, e, n) {
  e = e || 1;
  const r = ye(t, kt) ? t : new kt(t), s = Ro(J(r.readBytes(e))), i = Si(r.readBytes(s));
  return Ke(i, e, n ?? 128);
}
function pS(t) {
  const e = [], n = Wr(t.content), r = zS(J(n), Bo * 2);
  return e.push(wt(r)), Vt(e);
}
function H0(t) {
  const e = ye(t, kt) ? t : new kt(t);
  let n = Si(e.readBytes(Bo));
  return n = n.replace(/\u0000*$/, ""), { type: R.MemoString, content: n };
}
function P0(t) {
  const e = [];
  return e.push(Ii(t.address)), e.push(_s(t.contractName)), e.push(_s(t.assetName)), Vt(e);
}
function mc(t) {
  const e = ye(t, kt) ? t : new kt(t);
  return {
    type: R.Asset,
    address: Ms(e),
    contractName: Te(e),
    assetName: Te(e)
  };
}
function Ll(t) {
  const e = t.values, n = [];
  n.push(wt(mi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(En(r));
  return Vt(n);
}
function O0(t, e, n) {
  const r = ye(t, kt) ? t : new kt(t), s = Ro(J(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case R.Address:
        i.push(Ms(r));
        break;
      case R.LengthPrefixedString:
        i.push(Te(r));
        break;
      case R.MemoString:
        i.push(H0(r));
        break;
      case R.Asset:
        i.push(mc(r));
        break;
      case R.PostCondition:
        i.push(yS(r));
        break;
      case R.PublicKey:
        i.push(Ac(r));
        break;
      case R.TransactionAuthField:
        i.push(bS(r));
        break;
    }
  return Il(i, n);
}
function gS(t) {
  return J(D0(t));
}
function D0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(N0(t.principal)), (t.conditionType === Ut.Fungible || t.conditionType === Ut.NonFungible) && e.push(P0(t.asset)), t.conditionType === Ut.NonFungible && e.push(an(t.assetName)), e.push(t.conditionCode), t.conditionType === Ut.STX || t.conditionType === Ut.Fungible || t.conditionType === Ut.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new gs("The post-condition amount may not be larger than 8 bytes");
    e.push(fr(t.amount, 8));
  }
  return Vt(e);
}
function yS(t) {
  const e = ye(t, kt) ? t : new kt(t), n = e.readUInt8Enum(Ut, (a) => {
    throw new oe(`Could not read ${a} as PostConditionType`);
  }), r = hS(e);
  let s, i, o;
  switch (n) {
    case Ut.STX:
      return s = e.readUInt8Enum(ri, (c) => {
        throw new oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: R.PostCondition,
        conditionType: Ut.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ut.Fungible:
      return i = mc(e), s = e.readUInt8Enum(ri, (c) => {
        throw new oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: R.PostCondition,
        conditionType: Ut.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Ut.NonFungible:
      i = mc(e);
      const a = sn(e);
      return s = e.readUInt8Enum(pc, (c) => {
        throw new oe(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: R.PostCondition,
        conditionType: Ut.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Ut.Staking:
      return s = e.readUInt8Enum(ri, (c) => {
        throw new oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${J(e.readBytes(8))}`), {
        type: R.PostCondition,
        conditionType: Ut.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Ut.PoX: {
      const c = e.readUInt8Enum(gc, (u) => {
        throw new oe(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: R.PostCondition,
        conditionType: Ut.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function j0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case At.TokenTransfer:
      e.push(an(t.recipient)), e.push(fr(t.amount, 8)), e.push(En(t.memo));
      break;
    case At.ContractCall:
      e.push(En(t.contractAddress)), e.push(En(t.contractName)), e.push(En(t.functionName));
      const n = new Uint8Array(4);
      Tr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(an(r));
      });
      break;
    case At.SmartContract:
      e.push(En(t.contractName)), e.push(En(t.codeBody));
      break;
    case At.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(En(t.contractName)), e.push(En(t.codeBody));
      break;
    case At.PoisonMicroblock:
      break;
    case At.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case At.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(an(t.recipient));
      break;
    case At.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(an(t.recipient ? U0(t.recipient) : _0())), e.push(t.vrfProof);
      break;
    case At.TenureChange:
      e.push(wt(t.tenureHash)), e.push(wt(t.previousTenureHash)), e.push(wt(t.burnViewHash)), e.push(wt(t.previousTenureEnd)), e.push(Tr(new Uint8Array(4), t.previousTenureBlocks)), e.push(fw(new Uint8Array(1), t.cause)), e.push(wt(t.publicKeyHash));
      break;
  }
  return Vt(e);
}
function wS(t) {
  const e = ye(t, kt) ? t : new kt(t);
  switch (e.readUInt8Enum(At, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case At.TokenTransfer:
      const r = sn(e), s = ie(e.readBytes(8)), i = H0(e);
      return sS(r, s, i);
    case At.ContractCall:
      const o = Ms(e), a = Te(e), c = Te(e), u = [], f = e.readUInt32BE();
      for (let k = 0; k < f; k++) {
        const L = sn(e);
        u.push(L);
      }
      return iS(o, a, c, u);
    case At.SmartContract:
      const l = Te(e), y = Te(e, 4, 1e5);
      return $f(l, y);
    case At.VersionedSmartContract: {
      const k = e.readUInt8Enum(hc, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), L = Te(e), O = Te(e, 4, rm);
      return $f(L, O, k);
    }
    case At.PoisonMicroblock:
      return aS();
    case At.Coinbase: {
      const k = e.readBytes(Lr);
      return vf(k);
    }
    case At.CoinbaseToAltRecipient: {
      const k = e.readBytes(Lr), L = sn(e);
      return vf(k, L);
    }
    case At.NakamotoCoinbase: {
      const k = e.readBytes(Lr), L = sn(e), O = e.readBytes(dc);
      return cS(k, L, O);
    }
    case At.TenureChange:
      const h = J(e.readBytes(20)), g = J(e.readBytes(20)), w = J(e.readBytes(20)), I = J(e.readBytes(32)), _ = e.readUInt32BE(), U = e.readUInt8Enum(yc, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), b = J(e.readBytes(20));
      return lS(h, g, w, I, _, U, b);
  }
}
function Sc(t) {
  const e = ye(t, kt) ? t : new kt(t);
  return xc(J(e.readBytes(na)));
}
function bS(t) {
  const e = ye(t, kt) ? t : new kt(t), n = e.readUInt8Enum(Fe, (r) => {
    throw new oe(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Fe.PublicKeyCompressed:
      return ys(Pt.Compressed, Ac(e));
    case Fe.PublicKeyUncompressed:
      return ys(Pt.Uncompressed, Rs(JS(Ac(e).data)));
    case Fe.SignatureCompressed:
      return ys(Pt.Compressed, Sc(e));
    case Fe.SignatureUncompressed:
      return ys(Pt.Uncompressed, Sc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Cl(t) {
  return wt(t.data);
}
function xS(t) {
  const e = [];
  switch (t.contents.type) {
    case R.PublicKey:
      e.push(t.pubKeyEncoding === Pt.Compressed ? Fe.PublicKeyCompressed : Fe.PublicKeyUncompressed), e.push(wt(QS(t.contents.data)));
      break;
    case R.MessageSignature:
      e.push(t.pubKeyEncoding === Pt.Compressed ? Fe.SignatureCompressed : Fe.SignatureUncompressed), e.push(Cl(t.contents));
      break;
  }
  return Vt(e);
}
function Ec(t) {
  return t.data.slice();
}
function Ac(t) {
  const e = ye(t, kt) ? t : new kt(t), n = e.readUInt8(), r = n === 4 ? Xx : Wx;
  return Rs(Vt([n, e.readBytes(r)]));
}
function kl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === It.P2PKH || e === It.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === It.P2WPKH || e === It.P2WSH || e === It.P2WSHNonSequential) && !r.map((s) => s.data).every(Gs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case It.P2PKH:
      return Xi(t, RS(r[0].data));
    case It.P2WPKH:
      return Xi(t, GS(r[0].data));
    case It.P2SH:
    case It.P2SHNonSequential:
      return Xi(t, KS(n, r.map(Ec)));
    case It.P2WSH:
    case It.P2WSHNonSequential:
      return Xi(t, VS(n, r.map(Ec)));
  }
}
function Xi(t, e) {
  return { type: R.Address, version: t, hash160: e };
}
function Bl(t) {
  return Qr.c32address(t.version, t.hash160);
}
function If(t) {
  const [e, n, r] = t.split(/\.|::/);
  return uS(e, n, r);
}
function Zs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return fS(e, n);
  } else
    return dS(t);
}
function mS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return AS(e, n);
  } else
    return SS(t);
}
function SS(t) {
  const e = hr(t);
  return { type: pt.PrincipalStandard, value: Bl(e) };
}
function ES(t) {
  return { type: pt.PrincipalStandard, value: Bl(t) };
}
function AS(t, e) {
  const n = hr(t), r = Ke(e);
  return F0(n, r);
}
function F0(t, e) {
  if (Wr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: pt.PrincipalContract,
    value: `${Bl(t)}.${e.content}`
  };
}
function $S(t) {
  return { type: pt.ResponseErr, value: t };
}
function vS(t) {
  return { type: pt.ResponseOk, value: t };
}
const IS = (t) => ({ type: pt.StringASCII, value: t }), LS = (t) => ({ type: pt.StringUTF8, value: t });
function CS(t) {
  for (const e in t)
    if (!qS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: pt.Tuple, value: t };
}
function sn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new kt(wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new kt(t) : e = t;
  switch (e.readUInt8Enum(Yt, (r) => {
    throw new oe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Yt.int:
      return tS(Ya(e.readBytes(16)));
    case Yt.uint:
      return eS(e.readBytes(16));
    case Yt.buffer:
      const r = e.readUInt32BE();
      return Qm(e.readBytes(r));
    case Yt.true:
      return Ym();
    case Yt.false:
      return Zm();
    case Yt.address:
      const s = Ms(e);
      return ES(s);
    case Yt.contract:
      const i = Ms(e), o = Te(e);
      return F0(i, o);
    case Yt.ok:
      return vS(sn(e));
    case Yt.err:
      return $S(sn(e));
    case Yt.none:
      return _0();
    case Yt.some:
      return U0(sn(e));
    case Yt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(sn(e));
      return nS(c);
    case Yt.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let w = 0; w < u; w++) {
        const I = Te(e).content;
        if (I === void 0)
          throw new oe('"content" is undefined');
        f[I] = sn(e);
      }
      return CS(f);
    case Yt.ascii:
      const l = e.readUInt32BE(), y = rw(e.readBytes(l));
      return IS(y);
    case Yt.utf8:
      const h = e.readUInt32BE(), g = Si(e.readBytes(h));
      return LS(g);
    default:
      throw new oe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function fn(t, e) {
  return Vt([vl(t), e]);
}
function kS(t) {
  return new Uint8Array([vl(t.type)]);
}
function BS(t) {
  return t.type === pt.OptionalNone ? new Uint8Array([vl(t.type)]) : fn(t.type, an(t.value));
}
function TS(t) {
  const e = new Uint8Array(4);
  return Tr(e, Math.ceil(t.value.length / 2), 0), fn(t.type, ln(e, wt(t.value)));
}
function MS(t) {
  const e = tl(Qy(BigInt(t.value), BigInt(qx)), $0);
  return fn(t.type, e);
}
function _S(t) {
  const e = tl(BigInt(t.value), $0);
  return fn(t.type, e);
}
function US(t) {
  return fn(t.type, Ii(hr(t.value)));
}
function NS(t) {
  const [e, n] = WS(t.value);
  return fn(t.type, ln(Ii(hr(e)), _s(Ke(n))));
}
function HS(t) {
  return fn(t.type, an(t.value));
}
function PS(t) {
  const e = [], n = new Uint8Array(4);
  Tr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = an(r);
    e.push(s);
  }
  return fn(t.type, Vt(e));
}
function OS(t) {
  const e = [], n = new Uint8Array(4);
  Tr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ke(s);
    e.push(_s(i));
    const o = an(t.value[s]);
    e.push(o);
  }
  return fn(t.type, Vt(e));
}
function z0(t, e) {
  const n = [], r = e == "ascii" ? nw(t.value) : Wr(t.value), s = new Uint8Array(4);
  return Tr(s, r.length, 0), n.push(s), n.push(r), fn(t.type, Vt(n));
}
function DS(t) {
  return z0(t, "ascii");
}
function jS(t) {
  return z0(t, "utf8");
}
function Lf(t) {
  return J(an(t));
}
function an(t) {
  switch (t.type) {
    case pt.BoolTrue:
    case pt.BoolFalse:
      return kS(t);
    case pt.OptionalNone:
    case pt.OptionalSome:
      return BS(t);
    case pt.Buffer:
      return TS(t);
    case pt.UInt:
      return _S(t);
    case pt.Int:
      return MS(t);
    case pt.PrincipalStandard:
      return US(t);
    case pt.PrincipalContract:
      return NS(t);
    case pt.ResponseOk:
    case pt.ResponseErr:
      return HS(t);
    case pt.List:
      return PS(t);
    case pt.Tuple:
      return OS(t);
    case pt.StringASCII:
      return DS(t);
    case pt.StringUTF8:
      return jS(t);
    default:
      throw new gs("Unable to serialize. Invalid Clarity Value.");
  }
}
const FS = (t) => t.length % 2 ? `0${t}` : t, zS = (t, e) => t.padEnd(e, "0"), R0 = (t, e) => t ? Wr(t).length > e : !1;
function $c(t) {
  return m0(t);
}
const li = (t) => Em(El(t)), Tl = (t) => J(Xm(t)), RS = (t) => J(li(t)), GS = (t) => {
  const e = li(t), n = ln(new Uint8Array([0]), new Uint8Array([e.length]), e), r = li(n);
  return J(r);
}, KS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Vt(n), s = li(r);
  return J(s);
}, VS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Vt(n), s = El(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Vt(i), a = li(o);
  return J(a);
};
function qS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function WS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Rt.hmacSha256Sync = (t, ...e) => {
  const n = C0.create(El, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Rs(t) {
  return t = typeof t == "string" ? wt(t) : t, {
    type: R.PublicKey,
    data: t
  };
}
function XS(t, e, n = Pt.Compressed) {
  const r = aw(e), s = new Ae(Iu(r.r), Iu(r.s)), i = lt.fromSignature(t, s, r.recoveryId), o = n === Pt.Compressed;
  return i.toHex(o);
}
function YS(t) {
  return typeof t == "string" ? t : J(t);
}
const Ml = YS;
function G0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ow;
}
function Gs(t) {
  return !Ml(t).startsWith("04");
}
function ZS(t) {
  t = el(t);
  const e = G0(t);
  return J(Ei(t.slice(0, 32), e));
}
function QS(t) {
  return lt.fromHex(Ml(t)).toHex(!0);
}
function JS(t) {
  return lt.fromHex(Ml(t)).toHex(!1);
}
function t3(t, e) {
  t = el(t);
  const [n, r] = Ko(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return mi(r, 1) + Ae.fromHex(n).toCompactHex();
}
function _l() {
  return {
    type: R.MessageSignature,
    data: J(new Uint8Array(na))
  };
}
function K0(t, e, n, r) {
  const s = kl(0, t, 1, [Rs(e)]).hash160, i = Gs(e) ? Pt.Compressed : Pt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ie(n),
    fee: ie(r),
    keyEncoding: i,
    signature: _l()
  };
}
function ui(t) {
  return "signature" in t;
}
function Cf(t) {
  return t === It.P2SH || t === It.P2WSH;
}
function e3(t) {
  return t === It.P2SHNonSequential || t === It.P2WSHNonSequential;
}
function kf(t) {
  const e = $c(t);
  return e.nonce = 0, e.fee = 0, ui(e) ? e.signature = _l() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function n3(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    fr(t.nonce, 8),
    fr(t.fee, 8),
    t.keyEncoding,
    Cl(t.signature)
  ];
  return Vt(e);
}
function r3(t) {
  const e = [
    t.hashMode,
    wt(t.signer),
    fr(t.nonce, 8),
    fr(t.fee, 8)
  ], n = Il(t.fields);
  e.push(Ll(n));
  const r = new Uint8Array(2);
  return lw(r, t.signaturesRequired, 0), e.push(r), Vt(e);
}
function s3(t, e) {
  const n = J(e.readBytes(20)), r = BigInt(`0x${J(e.readBytes(8))}`), s = BigInt(`0x${J(e.readBytes(8))}`), i = e.readUInt8Enum(Pt, (a) => {
    throw new oe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === It.P2WPKH && i != Pt.Compressed)
    throw new oe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Sc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function i3(t, e) {
  const n = J(e.readBytes(20)), r = BigInt("0x" + J(e.readBytes(8))), s = BigInt("0x" + J(e.readBytes(8))), i = O0(e, R.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case R.PublicKey:
        Gs(u.contents.data) || (o = !0);
        break;
      case R.MessageSignature:
        if (u.pubKeyEncoding === Pt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ar("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === It.P2WSH || t === It.P2WSHNonSequential))
    throw new Ar("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ma(t) {
  return ui(t) ? n3(t) : r3(t);
}
function _a(t) {
  const e = t.readUInt8Enum(It, (n) => {
    throw new oe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === It.P2PKH || e === It.P2WPKH ? s3(e, t) : i3(e, t);
}
function V0(t, e, n, r) {
  const i = t + J(new Uint8Array([e])) + J(fr(n, 8)) + J(fr(r, 8));
  if (wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Tl(wt(i));
}
function q0(t, e, n) {
  const r = 33 + na, s = Gs(e.data) ? Pt.Compressed : Pt.Uncompressed, i = t + FS(s.toString(16)) + n, o = wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Tl(o);
}
function o3(t, e, n, r, s) {
  const i = V0(t, e, n, r), o = t3(s, i), a = Rs(ZS(s)), c = q0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function W0(t, e, n, r, s, i) {
  const o = V0(t, e, n, r), a = Rs(XS(o, i, s)), c = q0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function a3() {
  const t = K0(It.P2PKH, "", 0, 0);
  return t.signer = rS().hash160, t.keyEncoding = Pt.Compressed, t.signature = _l(), t;
}
function Bf(t, e, n) {
  return ui(t) ? c3(t, e, n) : l3(t, e, n);
}
function c3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = W0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = kl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ar(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function l3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case R.PublicKey:
        Gs(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case R.MessageSignature:
        c.pubKeyEncoding === Pt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = W0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Cf(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Ar("Too many signatures");
        break;
    }
  if (Cf(t.hashMode) && o !== t.signaturesRequired || e3(t.hashMode) && o < t.signaturesRequired)
    throw new Ar("Incorrect number of signatures");
  if (i && (t.hashMode === It.P2WSH || t.hashMode === It.P2WSHNonSequential))
    throw new Ar("Uncompressed keys are not allowed in this hash mode");
  const a = kl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ar(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function X0(t) {
  return {
    authType: Ft.Standard,
    spendingCondition: t
  };
}
function Y0(t, e) {
  return {
    authType: Ft.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || K0(It.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Tf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ft.Standard:
        return X0(kf(t.spendingCondition));
      case Ft.Sponsored:
        return Y0(kf(t.spendingCondition), a3());
      default:
        throw new Mo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function u3(t, e) {
  switch (t.authType) {
    case Ft.Standard:
      return Bf(t.spendingCondition, e, Ft.Standard);
    case Ft.Sponsored:
      return Bf(t.spendingCondition, e, Ft.Standard);
    default:
      throw new Mo("Invalid origin auth type");
  }
}
function f3(t, e) {
  switch (t.authType) {
    case Ft.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ie(e)
      };
      return { ...t, spendingCondition: n };
    case Ft.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ie(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function d3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ie(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function h3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ie(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function p3(t, e) {
  const n = {
    ...e,
    nonce: ie(e.nonce),
    fee: ie(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function g3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ft.Standard:
      e.push(Ma(t.spendingCondition));
      break;
    case Ft.Sponsored:
      e.push(Ma(t.spendingCondition)), e.push(Ma(t.sponsorSpendingCondition));
      break;
  }
  return Vt(e);
}
function y3(t) {
  const e = t.readUInt8Enum(Ft, (r) => {
    throw new oe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ft.Standard:
      return n = _a(t), X0(n);
    case Ft.Sponsored:
      n = _a(t);
      const r = _a(t);
      return Y0(n, r);
  }
}
class w3 {
  constructor({ auth: e, payload: n, postConditions: r = Il([]), postConditionMode: s = To.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Gx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ie(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = xe.Any;
  }
  signBegin() {
    const e = $c(this);
    return e.auth = Tf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = $c(this);
    return e.auth = Tf(e.auth), e.txid();
  }
  verifyOrigin() {
    return u3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ft.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ft.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ft.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Rs(e), r = this.auth.spendingCondition;
    if (r && !ui(r)) {
      const s = Gs(n.data);
      r.fields.push(ys(s ? Pt.Compressed : Pt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = o3(n, r, e.fee, e.nonce, s);
    if (ui(e))
      e.signature = xc(i);
    else {
      const a = G0(s);
      e.fields.push(ys(a ? Pt.Compressed : Pt.Uncompressed, xc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Tl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ft.Sponsored)
      throw new Mo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = p3(this.auth, e);
  }
  setFee(e) {
    this.auth = f3(this.auth, e);
  }
  setNonce(e) {
    this.auth = d3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ft.Sponsored)
      throw new Mo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h3(this.auth, e);
  }
  serialize() {
    return J(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new gs('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new gs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new gs('"auth" is undefined');
    if (this.payload === void 0)
      throw new gs('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Tr(n, this.chainId, 0), e.push(n), e.push(g3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ll(this.postConditions)), e.push(j0(this.payload)), Vt(e);
  }
}
function b3(t) {
  const e = ye(t, kt) ? t : new kt(t), n = e.readUInt8Enum(jr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = y3(e), i = e.readUInt8Enum(xe, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(To, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = O0(e, R.PostCondition), c = wS(e), u = new w3({
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
function Ua(t) {
  const e = ie(t);
  if (e < 0n || e > Mf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Mf} (u64 max), received: ${e}`);
  return e;
}
var vc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(vc || (vc = {}));
var Ic;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ic || (Ic = {}));
function x3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: R.PostCondition,
        conditionType: Ut.STX,
        principal: t.address === "origin" ? { type: R.Principal, prefix: ce.Origin } : Zs(t.address),
        conditionCode: Yi(t.condition),
        amount: Ua(t.amount)
      };
    case "ft-postcondition":
      return {
        type: R.PostCondition,
        conditionType: Ut.Fungible,
        principal: t.address === "origin" ? { type: R.Principal, prefix: ce.Origin } : Zs(t.address),
        conditionCode: Yi(t.condition),
        amount: Ua(t.amount),
        asset: If(t.asset)
      };
    case "nft-postcondition":
      return {
        type: R.PostCondition,
        conditionType: Ut.NonFungible,
        principal: t.address === "origin" ? { type: R.Principal, prefix: ce.Origin } : Zs(t.address),
        conditionCode: Yi(t.condition),
        asset: If(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: R.PostCondition,
        conditionType: Ut.Staking,
        principal: t.address === "origin" ? { type: R.Principal, prefix: ce.Origin } : Zs(t.address),
        conditionCode: Yi(t.condition),
        amount: Ua(t.amount)
      };
    case "pox-postcondition":
      return {
        type: R.PostCondition,
        conditionType: Ut.PoX,
        principal: t.address === "origin" ? { type: R.Principal, prefix: ce.Origin } : Zs(t.address),
        conditionCode: m3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Yi(t) {
  return vc[t];
}
function m3(t) {
  return Ic[t];
}
function Z0(t) {
  const e = x3(t);
  return gS(e);
}
function S3(t, e, n) {
  return Nl(Q0(t), n);
}
function Q0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = fi(r);
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
    return BigInt(`0x${$3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Ul(t, e = 8) {
  return (typeof t == "bigint" ? t : Q0(t)).toString(16).padStart(e * 2, "0");
}
function Nl(t, e = 16) {
  const n = Ul(t, e);
  return fi(n);
}
function E3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const A3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += A3[n];
  return e;
}
function fi(t) {
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
function Hl(t) {
  return new TextEncoder().encode(t);
}
function v3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function I3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function _f(t) {
  if (t.some(I3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Pl(...t) {
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
function Tn(t) {
  return Pl(...t.map((e) => typeof e == "number" ? _f([e]) : e instanceof Array ? _f(e) : e));
}
function ia(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Lc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Lc || (Lc = {}));
Lc.Mainnet;
const L3 = 128, C3 = 128, J0 = 16;
var Cc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Cc || (Cc = {}));
var Uf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Uf || (Uf = {}));
var Nf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Nf || (Nf = {}));
var je;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(je || (je = {}));
const Na = ["onChainOnly", "offChainOnly", "any"];
Na[0] + "", je.OnChainOnly, Na[1] + "", je.OffChainOnly, Na[2] + "", je.Any, je.OnChainOnly + "", je.OnChainOnly, je.OffChainOnly + "", je.OffChainOnly, je.Any + "", je.Any;
var kc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kc || (kc = {}));
kc.Mainnet;
var Hf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Hf || (Hf = {}));
var xr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xr || (xr = {}));
var Pf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pf || (Pf = {}));
var Of;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Of || (Of = {}));
var Df;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Df || (Df = {}));
var jf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(jf || (jf = {}));
var Ff;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ff || (Ff = {}));
var zf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(zf || (zf = {}));
var Bc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Bc || (Bc = {}));
var Rf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Gf || (Gf = {}));
function Tc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function k3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function tp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function B3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Tc(t.outputLen), Tc(t.blockLen);
}
function T3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function M3(t, e) {
  tp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ha = {
  number: Tc,
  bool: k3,
  bytes: tp,
  hash: B3,
  exists: T3,
  output: M3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), en = (t, e) => t << 32 - e | t >>> e, _3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function U3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ep(t) {
  if (typeof t == "string" && (t = U3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let N3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ts(t) {
  const e = (r) => t().update(ep(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function H3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Ol = class extends N3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pa(this.buffer);
  }
  update(e) {
    Ha.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ep(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ha.exists(this), Ha.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    H3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pa(e), c = this.outputLen;
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
const P3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), np = Uint8Array.from({ length: 16 }, (t, e) => e), O3 = np.map((t) => (9 * t + 5) % 16);
let Dl = [np], jl = [O3];
for (let t = 0; t < 4; t++)
  for (let e of [Dl, jl])
    e.push(e[t].map((n) => P3[n]));
const rp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), D3 = Dl.map((t, e) => t.map((n) => rp[e][n])), j3 = jl.map((t, e) => t.map((n) => rp[e][n])), F3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), z3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zi = (t, e) => t << e | t >>> 32 - e;
function Kf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qi = new Uint32Array(16);
let R3 = class extends Ol {
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
      Qi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = F3[h], I = z3[h], _ = Dl[h], U = jl[h], b = D3[h], k = j3[h];
      for (let L = 0; L < 16; L++) {
        const O = Zi(r + Kf(h, i, a, u) + Qi[_[L]] + w, b[L]) + l | 0;
        r = l, l = u, u = Zi(a, 10) | 0, a = i, i = O;
      }
      for (let L = 0; L < 16; L++) {
        const O = Zi(s + Kf(g, o, c, f) + Qi[U[L]] + I, k[L]) + y | 0;
        s = y, y = f, f = Zi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ts(() => new R3());
const G3 = (t, e, n) => t & e ^ ~t & n, K3 = (t, e, n) => t & e ^ t & n ^ e & n, V3 = new Uint32Array([
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
]), Xn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Yn = new Uint32Array(64);
let sp = class extends Ol {
  constructor() {
    super(64, 32, 8, !1), this.A = Xn[0] | 0, this.B = Xn[1] | 0, this.C = Xn[2] | 0, this.D = Xn[3] | 0, this.E = Xn[4] | 0, this.F = Xn[5] | 0, this.G = Xn[6] | 0, this.H = Xn[7] | 0;
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
      Yn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Yn[l - 15], h = Yn[l - 2], g = en(y, 7) ^ en(y, 18) ^ y >>> 3, w = en(h, 17) ^ en(h, 19) ^ h >>> 10;
      Yn[l] = w + Yn[l - 7] + g + Yn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = en(a, 6) ^ en(a, 11) ^ en(a, 25), h = f + y + G3(a, c, u) + V3[l] + Yn[l] | 0, w = (en(r, 2) ^ en(r, 13) ^ en(r, 22)) + K3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Yn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, q3 = class extends sp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ts(() => new sp());
ts(() => new q3());
const Ji = BigInt(2 ** 32 - 1), Mc = BigInt(32);
function ip(t, e = !1) {
  return e ? { h: Number(t & Ji), l: Number(t >> Mc & Ji) } : { h: Number(t >> Mc & Ji) | 0, l: Number(t & Ji) | 0 };
}
function W3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ip(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const X3 = (t, e) => BigInt(t >>> 0) << Mc | BigInt(e >>> 0), Y3 = (t, e, n) => t >>> n, Z3 = (t, e, n) => t << 32 - n | e >>> n, Q3 = (t, e, n) => t >>> n | e << 32 - n, J3 = (t, e, n) => t << 32 - n | e >>> n, t4 = (t, e, n) => t << 64 - n | e >>> n - 32, e4 = (t, e, n) => t >>> n - 32 | e << 64 - n, n4 = (t, e) => e, r4 = (t, e) => t, s4 = (t, e, n) => t << n | e >>> 32 - n, i4 = (t, e, n) => e << n | t >>> 32 - n, o4 = (t, e, n) => e << n - 32 | t >>> 64 - n, a4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function c4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const l4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), u4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, f4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), d4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, h4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), p4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, ot = {
  fromBig: ip,
  split: W3,
  toBig: X3,
  shrSH: Y3,
  shrSL: Z3,
  rotrSH: Q3,
  rotrSL: J3,
  rotrBH: t4,
  rotrBL: e4,
  rotr32H: n4,
  rotr32L: r4,
  rotlSH: s4,
  rotlSL: i4,
  rotlBH: o4,
  rotlBL: a4,
  add: c4,
  add3L: l4,
  add3H: u4,
  add4L: f4,
  add4H: d4,
  add5H: p4,
  add5L: h4
}, [g4, y4] = ot.split([
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
].map((t) => BigInt(t))), Zn = new Uint32Array(80), Qn = new Uint32Array(80);
let oa = class extends Ol {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Zn[b] = e.getUint32(n), Qn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = Zn[b - 15] | 0, L = Qn[b - 15] | 0, O = ot.rotrSH(k, L, 1) ^ ot.rotrSH(k, L, 8) ^ ot.shrSH(k, L, 7), V = ot.rotrSL(k, L, 1) ^ ot.rotrSL(k, L, 8) ^ ot.shrSL(k, L, 7), D = Zn[b - 2] | 0, j = Qn[b - 2] | 0, m = ot.rotrSH(D, j, 19) ^ ot.rotrBH(D, j, 61) ^ ot.shrSH(D, j, 6), C = ot.rotrSL(D, j, 19) ^ ot.rotrBL(D, j, 61) ^ ot.shrSL(D, j, 6), P = ot.add4L(V, C, Qn[b - 7], Qn[b - 16]), X = ot.add4H(P, O, m, Zn[b - 7], Zn[b - 16]);
      Zn[b] = X | 0, Qn[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: I, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const k = ot.rotrSH(l, y, 14) ^ ot.rotrSH(l, y, 18) ^ ot.rotrBH(l, y, 41), L = ot.rotrSL(l, y, 14) ^ ot.rotrSL(l, y, 18) ^ ot.rotrBL(l, y, 41), O = l & h ^ ~l & w, V = y & g ^ ~y & I, D = ot.add5L(U, L, V, y4[b], Qn[b]), j = ot.add5H(D, _, k, O, g4[b], Zn[b]), m = D | 0, C = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), P = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = I | 0, w = h | 0, I = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = ot.add(u | 0, f | 0, j | 0, m | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = ot.add3L(m, P, tt);
      r = ot.add3H(z, j, C, X), s = z | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = ot.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = ot.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: I } = ot.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: _, l: U } = ot.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, f, l, y, h, g, w, I, _, U);
  }
  roundClean() {
    Zn.fill(0), Qn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, w4 = class extends oa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b4 = class extends oa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, x4 = class extends oa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ts(() => new oa());
ts(() => new w4());
ts(() => new b4());
ts(() => new x4());
function m4(t, e, n) {
  const s = L3;
  if (H4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Cc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Zt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Zt || (Zt = {}));
let S4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, op = class extends S4 {
  constructor(e) {
    super(e);
  }
};
function aa(t) {
  const e = [];
  return e.push(fi(Ul(t.version, 1))), e.push(fi(t.hash160)), Tn(e);
}
function E4(t) {
  const e = [];
  return e.push(t.prefix), e.push(aa(t.address)), t.prefix === Bc.Contract && e.push(di(t.contractName)), Tn(e);
}
function di(t) {
  const e = [], n = Hl(t.content), r = n.byteLength;
  return e.push(fi(Ul(r, t.lengthPrefixBytes))), e.push(n), Tn(e);
}
function A4(t) {
  const e = [];
  return e.push(aa(t.address)), e.push(di(t.contractName)), e.push(di(t.assetName)), Tn(e);
}
function ap(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(E4(t.principal)), (t.conditionType === xr.Fungible || t.conditionType === xr.NonFungible) && e.push(A4(t.assetInfo)), t.conditionType === xr.NonFungible && e.push(zr(t.assetName)), e.push(t.conditionCode), t.conditionType === xr.STX || t.conditionType === xr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new op("The post-condition amount may not be larger than 8 bytes");
    e.push(S3(t.amount, !1, 8));
  }
  return Tn(e);
}
function dn(t, e) {
  return Tn([t, e]);
}
function $4(t) {
  return new Uint8Array([t.type]);
}
function v4(t) {
  return t.type === Zt.OptionalNone ? new Uint8Array([t.type]) : dn(t.type, zr(t.value));
}
function I4(t) {
  const e = new Uint8Array(4);
  return ia(e, t.buffer.length, 0), dn(t.type, Pl(e, t.buffer));
}
function L4(t) {
  const e = Nl(E3(t.value, BigInt(C3)), J0);
  return dn(t.type, e);
}
function C4(t) {
  const e = Nl(t.value, J0);
  return dn(t.type, e);
}
function k4(t) {
  return dn(t.type, aa(t.address));
}
function B4(t) {
  return dn(t.type, Pl(aa(t.address), di(t.contractName)));
}
function T4(t) {
  return dn(t.type, zr(t.value));
}
function M4(t) {
  const e = [], n = new Uint8Array(4);
  ia(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = zr(r);
    e.push(s);
  }
  return dn(t.type, Tn(e));
}
function _4(t) {
  const e = [], n = new Uint8Array(4);
  ia(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = m4(s);
    e.push(di(i));
    const o = zr(t.data[s]);
    e.push(o);
  }
  return dn(t.type, Tn(e));
}
function cp(t, e) {
  const n = [], r = e == "ascii" ? v3(t.data) : Hl(t.data), s = new Uint8Array(4);
  return ia(s, r.length, 0), n.push(s), n.push(r), dn(t.type, Tn(n));
}
function U4(t) {
  return cp(t, "ascii");
}
function N4(t) {
  return cp(t, "utf8");
}
function zr(t) {
  switch (t.type) {
    case Zt.BoolTrue:
    case Zt.BoolFalse:
      return $4(t);
    case Zt.OptionalNone:
    case Zt.OptionalSome:
      return v4(t);
    case Zt.Buffer:
      return I4(t);
    case Zt.UInt:
      return C4(t);
    case Zt.Int:
      return L4(t);
    case Zt.PrincipalStandard:
      return k4(t);
    case Zt.PrincipalContract:
      return B4(t);
    case Zt.ResponseOk:
    case Zt.ResponseErr:
      return T4(t);
    case Zt.List:
      return M4(t);
    case Zt.Tuple:
      return _4(t);
    case Zt.StringASCII:
      return U4(t);
    case Zt.StringUTF8:
      return N4(t);
    default:
      throw new op("Unable to serialize. Invalid Clarity Value.");
  }
}
const H4 = (t, e) => t ? Hl(t).length > e : !1, P4 = "connect-ui";
let po, lp, me = !1, _c = !1;
const Bn = (t, e = "") => () => {
}, O4 = (t, e) => () => {
}, D4 = "{visibility:hidden}.hydrated{visibility:inherit}", Vf = {}, j4 = "http://www.w3.org/2000/svg", F4 = "http://www.w3.org/1999/xhtml", z4 = (t) => t != null, Fl = (t) => (t = typeof t, t === "object" || t === "function");
function up(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const et = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Fl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Uc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = Uc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Uc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, R4 = {}, G4 = (t) => t && t.$tag$ === R4, K4 = (t, e) => t != null && !Fl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, V4 = (t) => Ks(t).$hostElement$, q4 = (t, e, n) => {
  const r = se.ce(e, n);
  return t.dispatchEvent(r), r;
}, qf = /* @__PURE__ */ new WeakMap(), W4 = (t, e, n) => {
  let r = _o.get(t);
  pE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, _o.set(t, r);
}, X4 = (t, e, n, r) => {
  var s;
  let i = fp(e);
  const o = _o.get(i);
  if (t = t.nodeType === 11 ? t : cn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = qf.get(t), c;
      if (a || qf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = cn.createElement("style"), c.innerHTML = o;
          const u = (s = se.$nonce$) !== null && s !== void 0 ? s : up(cn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Y4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Bn("attachStyles", e.$tagName$), i = X4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, fp = (t, e) => "sc-" + t.$tagName$, Wf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Yf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Xf(n), f = Xf(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Yf(ca, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && se.rel(t, e, n, !1), r && se.ael(t, e, r, !1);
    else {
      const c = Fl(r);
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
}, Z4 = /\s/, Xf = (t) => t ? t.split(Z4) : [], dp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Vf, o = e.$attrs$ || Vf;
  for (r in i)
    r in o || Wf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Wf(s, r, i[r], o[r], n, e.$flags$);
}, zl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = cn.createTextNode(s.$text$);
  else {
    if (me || (me = s.$tag$ === "svg"), o = s.$elm$ = cn.createElementNS(me ? j4 : F4, s.$tag$), me && s.$tag$ === "foreignObject" && (me = !1), dp(null, s, me), z4(po) && o["s-si"] !== po && o.classList.add(o["s-si"] = po), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = zl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? me = !1 : o.tagName === "foreignObject" && (me = !0);
  }
  return o;
}, hp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === lp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = zl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, pp = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Q4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : to(a, f) ? (Qs(a, f), a = e[++s], f = r[++i]) : to(c, l) ? (Qs(c, l), c = e[--o], l = r[--u]) : to(a, l) ? (Qs(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : to(c, f) ? (Qs(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (y = zl(e && e[i], n, i), f = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? hp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && pp(e, s, o);
}, to = (t, e) => t.$tag$ === e.$tag$, Qs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (me = i === "svg" ? !0 : i === "foreignObject" ? !1 : me, dp(t, e, me), r !== null && s !== null ? Q4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), hp(n, null, e, s, 0, s.length - 1)) : r !== null && pp(r, 0, r.length - 1), me && i === "svg" && (me = !1)) : t.$text$ !== o && (n.data = o);
}, J4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Uc(null, null), s = G4(e) ? e : et(null, null, e);
  lp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, po = n["s-sc"], Qs(r, s);
}, gp = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Rl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return gp(t, t.$ancestorComponent$), yE(() => tE(t, e));
}, tE = (t, e) => {
  const n = Bn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), sE(s, () => eE(t, r, e));
}, eE = async (t, e, n) => {
  const r = t.$hostElement$, s = Bn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Y4(t);
  const o = Bn("render", t.$cmpMeta$.$tagName$);
  nE(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => rE(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, nE = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, J4(t, e);
  } catch (r) {
    hi(r, t.$hostElement$);
  }
  return null;
}, rE = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Bn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, wp(n), r(), t.$onReadyResolve$(n), s || yp()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Kl(() => Rl(t, !1)), t.$flags$ &= -517;
}, yp = (t) => {
  wp(cn.documentElement), Kl(() => q4(ca, "appload", { detail: { namespace: P4 } }));
}, sE = (t, e) => t && t.then ? t.then(e) : e(), wp = (t) => t.classList.add("hydrated"), iE = (t, e) => Ks(t).$instanceValues$.get(e), oE = (t, e, n, r) => {
  const s = Ks(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = K4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Rl(s, !1));
}, bp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return iE(this, i);
        },
        set(a) {
          oE(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        se.jmp(() => {
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
}, aE = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = hE(n), s.then) {
        const c = O4();
        s = await s, c();
      }
      s.isProxied || (bp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Bn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        hi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = fp(n);
      if (!_o.has(c)) {
        const u = Bn("registerStyles", n.$tagName$);
        W4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Rl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, cE = (t) => {
  if (!(se.$flags$ & 1)) {
    const e = Ks(t), n = e.$cmpMeta$, r = Bn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            gp(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), aE(t, e, n);
    }
    r();
  }
}, lE = (t) => {
  se.$flags$ & 1 || Ks(t);
}, uE = (t, e = {}) => {
  var n;
  const r = Bn(), s = [], i = e.exclude || [], o = ca.customElements, a = cn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ cn.createElement("style"), f = [];
  let l, y = !0;
  Object.assign(se, e), se.$resourcesUrl$ = new URL(e.resourcesUrl || "./", cn.baseURI).href, t.map((h) => {
    h[1].map((g) => {
      const w = {
        $flags$: g[0],
        $tagName$: g[1],
        $members$: g[2],
        $listeners$: g[3]
      };
      w.$members$ = g[2];
      const I = w.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, dE(U, w), w.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? f.push(this) : se.jmp(() => cE(this));
        }
        disconnectedCallback() {
          se.jmp(() => lE(this));
        }
        componentOnReady() {
          return Ks(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, bp(
        _,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + D4, u.setAttribute("data-styles", "");
    const h = (n = se.$nonce$) !== null && n !== void 0 ? n : up(cn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, f.length ? f.map((h) => h.connectedCallback()) : se.jmp(() => l = setTimeout(yp, 30)), r();
}, Gl = /* @__PURE__ */ new WeakMap(), Ks = (t) => Gl.get(t), fE = (t, e) => Gl.set(e.$lazyInstance$ = t, e), dE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Gl.set(t, n);
}, Yf = (t, e) => e in t, hi = (t, e) => (0, console.error)(t, e), Oa = /* @__PURE__ */ new Map(), hE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Oa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Oa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => h$).then(o, hi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Oa.set(s, o), o[r]), hi);
}, _o = /* @__PURE__ */ new Map(), ca = typeof window < "u" ? window : {}, cn = ca.document || { head: {} }, se = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, xp = (t) => Promise.resolve(t), pE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Zf = [], mp = [], gE = (t, e) => (n) => {
  t.push(n), _c || (_c = !0, se.$flags$ & 4 ? Kl(Nc) : se.raf(Nc));
}, Qf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      hi(n);
    }
  t.length = 0;
}, Nc = () => {
  Qf(Zf), Qf(mp), (_c = Zf.length > 0) && se.raf(Nc);
}, Kl = (t) => xp().then(t), yE = /* @__PURE__ */ gE(mp), wE = () => xp(), bE = (t, e) => typeof window > "u" ? Promise.resolve() : wE().then(() => uE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var xE = Object.defineProperty, mE = Object.defineProperties, SE = Object.getOwnPropertyDescriptors, Uo = Object.getOwnPropertySymbols, Sp = Object.prototype.hasOwnProperty, Ep = Object.prototype.propertyIsEnumerable, Jf = (t, e, n) => e in t ? xE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ve = (t, e) => {
  for (var n in e || (e = {})) Sp.call(e, n) && Jf(t, n, e[n]);
  if (Uo) for (var n of Uo(e)) Ep.call(e, n) && Jf(t, n, e[n]);
  return t;
}, Ve = (t, e) => mE(t, SE(e)), Ap = (t, e) => {
  var n = {};
  for (var r in t) Sp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Uo) for (var r of Uo(t)) e.indexOf(r) < 0 && Ep.call(t, r) && (n[r] = t[r]);
  return n;
};
function $p() {
  return ea(Hr()) || window.StacksProvider || window.BlockstackProvider;
}
function la(t) {
  return t ? typeof t == "string" ? Or.fromName(t) : "version" in t ? t : "url" in t ? new lc({ url: t.url }) : t.transactionVersion === jr.Mainnet ? new lc({ url: t.client.baseUrl }) : new uc({ url: t.client.baseUrl }) : new uc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var EE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(EE || {}), AE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(AE || {}), Vl = (t) => {
  let e = t;
  if (!e) {
    let n = new rh(["store_write"], document.location.href);
    e = new cc({ appConfig: n });
  }
  return e;
};
function vp(t) {
  try {
    return Vl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ip = (t) => {
  let e = Vl(t).loadUserData().appPrivateKey, n = ne.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function $E(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Dr.Mainnet]: "mainnet", [Dr.Testnet]: "testnet" }, a = la(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function vE(t) {
  let e = la(t.network), n = Vl(t.userSession), r = Ve(ve({}, t), { network: e, userSession: n });
  return ve({ stxAddress: $E(r) }, r);
}
async function IE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Z0) : n = n.map((r) => J(ap(r)))), new ne.TokenSigner("ES256k", e).signAsync(Ve(ve({}, t), { postConditions: n }));
}
function LE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Z0) : e = e.map((n) => J(ap(n)))), ne.createUnsecuredToken(Ve(ve({}, t), { postConditions: e }));
}
var CE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = wt(a.replace(/^0x/, "")), u = b3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ve(ve({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Ve(ve({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, kE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Ap(e, ["amount", "appDetails", "userSession"]);
  if (vp(s)) {
    let { privateKey: a, publicKey: c } = Ip(s), u = Ve(ve({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), IE(u, a);
  }
  let o = Ve(ve({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), LE(o);
};
async function BE(t, e, n) {
  let r = await e(Ve(ve(ve({}, vE(t)), t), { network: la(t.network) }));
  return CE({ token: r, options: t }, n);
}
function TE(t, e = $p()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return BE(t, kE, e);
}
function Lp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ve(ve({}, t), { message: Lf(e), domain: Lf(n) }) : Ve(ve({}, t), { message: J(zr(e)), domain: J(zr(n)) });
}
async function ME(t, e) {
  return new ne.TokenSigner("ES256k", e).signAsync(Lp(t));
}
async function _E(t) {
  let e = t, { userSession: n } = e, r = Ap(e, ["userSession"]);
  if (vp(n)) {
    let { privateKey: s, publicKey: i } = Ip(n), o = Ve(ve({}, r), { publicKey: i });
    return ME(o, s);
  }
  return ne.createUnsecuredToken(Lp(t));
}
var UE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(UE || {}), Cp = "asigna-stx", td = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Cp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(HE(t, e), "*");
}), NE = { authenticationRequest: async (t) => td(t, "authenticationRequest"), transactionRequest: async (t) => td(t, "transactionRequest") }, HE = (t, e) => ({ source: Cp, [e]: t }), PE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = NE);
};
PE();
var OE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function DE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Hr(), o = $p();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    bE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : OE, c = Bx(a), u = document.createElement("connect-modal");
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
    let y = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var eo = DE(TE);
function dr(t, e, n) {
  return ql(ue(t, e), n);
}
function ue(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ht(r);
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
      const r = zE(BigInt(`0x${ft(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ft(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ed(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Li(t, e = 8) {
  return (typeof t == "bigint" ? t : ue(t, !1)).toString(16).padStart(e * 2, "0");
}
function ua(t) {
  return parseInt(t, 16);
}
function ql(t, e = 16) {
  const n = Li(t, e);
  return Ht(n);
}
function jE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function FE(t, e) {
  return t & BigInt(1) << e;
}
function zE(t, e) {
  return FE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const RE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ft(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += RE[n];
  return e;
}
function Ht(t) {
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
function Vs(t) {
  return new TextEncoder().encode(t);
}
function Wl(t) {
  return new TextDecoder().decode(t);
}
function kp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function GE(t) {
  return String.fromCharCode.apply(null, t);
}
function KE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function nd(t) {
  if (t.some(KE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function fa(...t) {
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
function qt(t) {
  return fa(...t.map((e) => typeof e == "number" ? nd([e]) : e instanceof Array ? nd(e) : e));
}
var rd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(rd || (rd = {}));
var sd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(sd || (sd = {}));
var id;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(id || (id = {}));
const Bp = 33, Da = 32;
function VE(t) {
  if (t.length < Da * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Da * 2), r = t.slice(2 + Da * 2);
  return {
    recoveryId: ua(e),
    r: n,
    s: r
  };
}
function qE(t) {
  const e = typeof t == "string" ? Ht(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function WE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function XE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function YE(t, e) {
  return t[e];
}
function ZE(t, e, n = 0) {
  return t[n] = e, t;
}
function QE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Rr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Hc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Hc || (Hc = {}));
const JE = Hc.Mainnet, tA = 128, eA = 128, Tp = 16, Cr = 32, Pc = 80, da = 65, nA = 32, rA = 64, No = 34;
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
var ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ct || (ct = {}));
var Oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Oc || (Oc = {}));
var pe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(pe || (pe = {}));
const go = ["onChainOnly", "offChainOnly", "any"], od = {
  [go[0]]: pe.OnChainOnly,
  [go[1]]: pe.OffChainOnly,
  [go[2]]: pe.Any,
  [pe.OnChainOnly]: pe.OnChainOnly,
  [pe.OffChainOnly]: pe.OffChainOnly,
  [pe.Any]: pe.Any
};
function sA(t) {
  if (t in od)
    return od[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${go.join(", ")}`);
}
var Ho;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ho || (Ho = {}));
Ho.Mainnet;
var Us;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Us || (Us = {}));
var ge;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ge || (ge = {}));
var zt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(zt || (zt = {}));
var Lt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Lt || (Lt = {}));
var Po;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Po || (Po = {}));
var Ot;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ot || (Ot = {}));
var pi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pi || (pi = {}));
var Dc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Dc || (Dc = {}));
var gi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gi || (gi = {}));
var ad;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ad || (ad = {}));
var cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(cd || (cd = {}));
function jc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function iA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Mp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function oA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jc(t.outputLen), jc(t.blockLen);
}
function aA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function cA(t, e) {
  Mp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vr = {
  number: jc,
  bool: iA,
  bytes: Mp,
  hash: oA,
  exists: aA,
  output: cA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ja = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), nn = (t, e) => t << 32 - e | t >>> e, lA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!lA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function uA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xl(t) {
  if (typeof t == "string" && (t = uA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class _p {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function es(t) {
  const e = (r) => t().update(Xl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Yl extends _p {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ja(this.buffer);
  }
  update(e) {
    vr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ja(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    vr.exists(this), vr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    fA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ja(e), c = this.outputLen;
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
const dA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Up = Uint8Array.from({ length: 16 }, (t, e) => e), hA = Up.map((t) => (9 * t + 5) % 16);
let Zl = [Up], Ql = [hA];
for (let t = 0; t < 4; t++)
  for (let e of [Zl, Ql])
    e.push(e[t].map((n) => dA[n]));
const Np = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pA = Zl.map((t, e) => t.map((n) => Np[e][n])), gA = Ql.map((t, e) => t.map((n) => Np[e][n])), yA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), no = (t, e) => t << e | t >>> 32 - e;
function ld(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ro = new Uint32Array(16);
class bA extends Yl {
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
      ro[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const g = 4 - h, w = yA[h], I = wA[h], _ = Zl[h], U = Ql[h], b = pA[h], k = gA[h];
      for (let L = 0; L < 16; L++) {
        const O = no(r + ld(h, i, a, u) + ro[_[L]] + w, b[L]) + l | 0;
        r = l, l = u, u = no(a, 10) | 0, a = i, i = O;
      }
      for (let L = 0; L < 16; L++) {
        const O = no(s + ld(g, o, c, f) + ro[U[L]] + I, k[L]) + y | 0;
        s = y, y = f, f = no(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ro.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const xA = es(() => new bA()), mA = (t, e, n) => t & e ^ ~t & n, SA = (t, e, n) => t & e ^ t & n ^ e & n, EA = new Uint32Array([
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
]), Jn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), tr = new Uint32Array(64);
class Hp extends Yl {
  constructor() {
    super(64, 32, 8, !1), this.A = Jn[0] | 0, this.B = Jn[1] | 0, this.C = Jn[2] | 0, this.D = Jn[3] | 0, this.E = Jn[4] | 0, this.F = Jn[5] | 0, this.G = Jn[6] | 0, this.H = Jn[7] | 0;
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
      tr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = tr[l - 15], h = tr[l - 2], g = nn(y, 7) ^ nn(y, 18) ^ y >>> 3, w = nn(h, 17) ^ nn(h, 19) ^ h >>> 10;
      tr[l] = w + tr[l - 7] + g + tr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = nn(a, 6) ^ nn(a, 11) ^ nn(a, 25), h = f + y + mA(a, c, u) + EA[l] + tr[l] | 0, w = (nn(r, 2) ^ nn(r, 13) ^ nn(r, 22)) + SA(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    tr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class AA extends Hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Jl = es(() => new Hp());
es(() => new AA());
const so = BigInt(2 ** 32 - 1), Fc = BigInt(32);
function Pp(t, e = !1) {
  return e ? { h: Number(t & so), l: Number(t >> Fc & so) } : { h: Number(t >> Fc & so) | 0, l: Number(t & so) | 0 };
}
function $A(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Pp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const vA = (t, e) => BigInt(t >>> 0) << Fc | BigInt(e >>> 0), IA = (t, e, n) => t >>> n, LA = (t, e, n) => t << 32 - n | e >>> n, CA = (t, e, n) => t >>> n | e << 32 - n, kA = (t, e, n) => t << 32 - n | e >>> n, BA = (t, e, n) => t << 64 - n | e >>> n - 32, TA = (t, e, n) => t >>> n - 32 | e << 64 - n, MA = (t, e) => e, _A = (t, e) => t, UA = (t, e, n) => t << n | e >>> 32 - n, NA = (t, e, n) => e << n | t >>> 32 - n, HA = (t, e, n) => e << n - 32 | t >>> 64 - n, PA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function OA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const DA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), jA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, FA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), zA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, RA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), GA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, at = {
  fromBig: Pp,
  split: $A,
  toBig: vA,
  shrSH: IA,
  shrSL: LA,
  rotrSH: CA,
  rotrSL: kA,
  rotrBH: BA,
  rotrBL: TA,
  rotr32H: MA,
  rotr32L: _A,
  rotlSH: UA,
  rotlSL: NA,
  rotlBH: HA,
  rotlBL: PA,
  add: OA,
  add3L: DA,
  add3H: jA,
  add4L: FA,
  add4H: zA,
  add5H: GA,
  add5L: RA
}, [KA, VA] = at.split([
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
].map((t) => BigInt(t))), er = new Uint32Array(80), nr = new Uint32Array(80);
class ha extends Yl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: h, Gl: g, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, y, h, g, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      er[b] = e.getUint32(n), nr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const k = er[b - 15] | 0, L = nr[b - 15] | 0, O = at.rotrSH(k, L, 1) ^ at.rotrSH(k, L, 8) ^ at.shrSH(k, L, 7), V = at.rotrSL(k, L, 1) ^ at.rotrSL(k, L, 8) ^ at.shrSL(k, L, 7), D = er[b - 2] | 0, j = nr[b - 2] | 0, m = at.rotrSH(D, j, 19) ^ at.rotrBH(D, j, 61) ^ at.shrSH(D, j, 6), C = at.rotrSL(D, j, 19) ^ at.rotrBL(D, j, 61) ^ at.shrSL(D, j, 6), P = at.add4L(V, C, nr[b - 7], nr[b - 16]), X = at.add4H(P, O, m, er[b - 7], er[b - 16]);
      er[b] = X | 0, nr[b] = P | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: h, Fl: g, Gh: w, Gl: I, Hh: _, Hl: U } = this;
    for (let b = 0; b < 80; b++) {
      const k = at.rotrSH(l, y, 14) ^ at.rotrSH(l, y, 18) ^ at.rotrBH(l, y, 41), L = at.rotrSL(l, y, 14) ^ at.rotrSL(l, y, 18) ^ at.rotrBL(l, y, 41), O = l & h ^ ~l & w, V = y & g ^ ~y & I, D = at.add5L(U, L, V, VA[b], nr[b]), j = at.add5H(D, _, k, O, KA[b], er[b]), m = D | 0, C = at.rotrSH(r, s, 28) ^ at.rotrBH(r, s, 34) ^ at.rotrBH(r, s, 39), P = at.rotrSL(r, s, 28) ^ at.rotrBL(r, s, 34) ^ at.rotrBL(r, s, 39), X = r & i ^ r & a ^ i & a, tt = s & o ^ s & c ^ o & c;
      _ = w | 0, U = I | 0, w = h | 0, I = g | 0, h = l | 0, g = y | 0, { h: l, l: y } = at.add(u | 0, f | 0, j | 0, m | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = at.add3L(m, P, tt);
      r = at.add3H(z, j, C, X), s = z | 0;
    }
    ({ h: r, l: s } = at.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = at.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = at.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = at.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = at.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: g } = at.add(this.Fh | 0, this.Fl | 0, h | 0, g | 0), { h: w, l: I } = at.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: _, l: U } = at.add(this.Hh | 0, this.Hl | 0, _ | 0, U | 0), this.set(r, s, i, o, a, c, u, f, l, y, h, g, w, I, _, U);
  }
  roundClean() {
    er.fill(0), nr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class qA extends ha {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class WA extends ha {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class XA extends ha {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
es(() => new ha());
es(() => new qA());
const YA = es(() => new WA());
es(() => new XA());
function Op(t) {
  if (Ht(t).byteLength != da)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function Js(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function ws(t) {
  return Qr.c32address(t.version, t.hash160);
}
function Gr(t, e, n) {
  const r = e || 1, s = n || tA;
  if (eg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function tu(t) {
  const e = Qr.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
var N;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(N || (N = {}));
function ZA(t) {
  if (t.type === N.PrincipalStandard)
    return ws(t.address);
  if (t.type === N.PrincipalContract)
    return `${ws(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Dp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return t8(e, n);
  } else
    return QA(t);
}
function QA(t) {
  const e = tu(t);
  return { type: N.PrincipalStandard, address: e };
}
function JA(t) {
  return { type: N.PrincipalStandard, address: t };
}
function t8(t, e) {
  const n = tu(t), r = Gr(e);
  return jp(n, r);
}
function jp(t, e) {
  if (Vs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: N.PrincipalContract, address: t, contractName: e };
}
function Fa(t, e = !1) {
  switch (t.type) {
    case N.BoolTrue:
      return !0;
    case N.BoolFalse:
      return !1;
    case N.Int:
    case N.UInt:
      return e ? t.value.toString() : t.value;
    case N.Buffer:
      return `0x${ft(t.buffer)}`;
    case N.OptionalNone:
      return null;
    case N.OptionalSome:
      return In(t.value);
    case N.ResponseErr:
      return In(t.value);
    case N.ResponseOk:
      return In(t.value);
    case N.PrincipalStandard:
    case N.PrincipalContract:
      return ZA(t);
    case N.List:
      return t.list.map((r) => In(r));
    case N.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = In(t.data[r]);
      }), n;
    case N.StringASCII:
      return t.data;
    case N.StringUTF8:
      return t.data;
  }
}
function In(t) {
  switch (t.type) {
    case N.ResponseErr:
      return { type: ir(t), value: Fa(t, !0), success: !1 };
    case N.ResponseOk:
      return { type: ir(t), value: Fa(t, !0), success: !0 };
    default:
      return { type: ir(t), value: Fa(t, !0) };
  }
}
function ir(t) {
  switch (t.type) {
    case N.BoolTrue:
    case N.BoolFalse:
      return "bool";
    case N.Int:
      return "int";
    case N.UInt:
      return "uint";
    case N.Buffer:
      return `(buff ${t.buffer.length})`;
    case N.OptionalNone:
      return "(optional none)";
    case N.OptionalSome:
      return `(optional ${ir(t.value)})`;
    case N.ResponseErr:
      return `(response UnknownType ${ir(t.value)})`;
    case N.ResponseOk:
      return `(response ${ir(t.value)} UnknownType)`;
    case N.PrincipalStandard:
    case N.PrincipalContract:
      return "principal";
    case N.List:
      return `(list ${t.list.length} ${t.list.length ? ir(t.list[0]) : "UnknownType"})`;
    case N.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ir(t.data[e])})`).join(" ")})`;
    case N.StringASCII:
      return `(string-ascii ${kp(t.data).length})`;
    case N.StringUTF8:
      return `(string-utf8 ${Vs(t.data).length})`;
  }
}
const Fp = () => ({ type: N.BoolTrue }), zp = () => ({ type: N.BoolFalse }), e8 = (t) => t ? Fp() : zp(), ud = BigInt("0xffffffffffffffffffffffffffffffff"), n8 = BigInt(0), fd = BigInt("0x7fffffffffffffffffffffffffffffff"), dd = BigInt("-170141183460469231731687303715884105728"), r8 = (t) => {
  const e = ue(t, !0);
  if (e > fd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${fd}`);
  if (e < dd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${dd}`);
  return { type: N.Int, value: e };
}, ar = (t) => {
  const e = ue(t, !1);
  if (e < n8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ud)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ud}`);
  return { type: N.UInt, value: e };
}, Rp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: N.Buffer, buffer: t };
};
function Gp() {
  return { type: N.OptionalNone };
}
function Kp(t) {
  return { type: N.OptionalSome, value: t };
}
function s8(t) {
  return { type: N.ResponseErr, value: t };
}
function i8(t) {
  return { type: N.ResponseOk, value: t };
}
function o8(t) {
  return { type: N.List, list: t };
}
function yi(t) {
  for (const e in t)
    if (!X8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: N.Tuple, data: t };
}
const ze = (t) => ({ type: N.StringASCII, data: t }), a8 = (t) => ({ type: N.StringUTF8, data: t });
class Vp extends _p {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, vr.hash(e);
    const r = Xl(n);
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
    return vr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    vr.exists(this), vr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const qp = (t, e, n) => new Vp(t, e).update(n).digest();
qp.create = (t, e) => new Vp(t, e);
Rt.hmacSha256Sync = (t, ...e) => {
  const n = qp.create(Jl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ns(t) {
  return {
    type: Q.PublicKey,
    data: Ht(t)
  };
}
function c8(t, e, n = Ot.Compressed) {
  const r = VE(e.data), s = new Ae(ed(r.r), ed(r.s)), i = lt.fromSignature(t, s, r.recoveryId), o = n === Ot.Compressed;
  return i.toHex(o);
}
function l8(t) {
  return { type: Q.PublicKey, data: t };
}
function qs(t) {
  return !ft(t.data).startsWith("04");
}
function Oo(t) {
  return t.data.slice();
}
function u8(t) {
  const e = h8(t), n = Ei(e.data.slice(0, 32), e.compressed);
  return Ns(ft(n));
}
function f8(t) {
  const e = typeof t == "string" ? t : ft(t), n = lt.fromHex(e).toHex(!0);
  return Ns(n);
}
function d8(t) {
  const e = typeof t == "string" ? t : ft(t), n = lt.fromHex(e).toHex(!1);
  return Ns(n);
}
function zc(t) {
  const e = t.readUInt8(), n = e === 4 ? rA : nA;
  return l8(qt([e, t.readBytes(n)]));
}
function h8(t) {
  const e = qE(t), n = e.length == Bp;
  return { data: e, compressed: n };
}
function p8(t, e) {
  const [n, r] = Ko(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Li(r, 1) + Ae.fromHex(n).toCompactHex();
  return Op(i);
}
function g8(t) {
  return u8(t.data);
}
function y8(t, e, n) {
  return typeof t == "string" && (t = Dp(t)), typeof n == "string" && (n = gd(n)), {
    type: Q.Payload,
    payloadType: ct.TokenTransfer,
    recipient: t,
    amount: ue(e, !1),
    memo: n ?? gd("")
  };
}
function w8(t, e, n, r) {
  return typeof t == "string" && (t = tu(t)), typeof e == "string" && (e = Gr(e)), typeof n == "string" && (n = Gr(n)), {
    type: Q.Payload,
    payloadType: ct.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function hd(t, e, n) {
  return typeof t == "string" && (t = Gr(t)), typeof e == "string" && (e = I8(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: ct.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function b8() {
  return { type: Q.Payload, payloadType: ct.PoisonMicroblock };
}
function pd(t, e) {
  if (t.byteLength != Cr)
    throw Error(`Coinbase buffer size must be ${Cr} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: ct.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: ct.Coinbase,
    coinbaseBytes: t
  };
}
function x8(t, e, n) {
  if (t.byteLength != Cr)
    throw Error(`Coinbase buffer size must be ${Cr} bytes`);
  if (n.byteLength != Pc)
    throw Error(`VRF proof buffer size must be ${Pc} bytes`);
  return {
    type: Q.Payload,
    payloadType: ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === N.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Rc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Rc || (Rc = {}));
function m8(t, e, n, r, s, i, o) {
  return {
    type: Q.Payload,
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
function Wp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ct.TokenTransfer:
      e.push(Kt(t.recipient)), e.push(dr(t.amount, !1, 8)), e.push(An(t.memo));
      break;
    case ct.ContractCall:
      e.push(An(t.contractAddress)), e.push(An(t.contractName)), e.push(An(t.functionName));
      const n = new Uint8Array(4);
      Rr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Kt(r));
      });
      break;
    case ct.SmartContract:
      e.push(An(t.contractName)), e.push(An(t.codeBody));
      break;
    case ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(An(t.contractName)), e.push(An(t.codeBody));
      break;
    case ct.PoisonMicroblock:
      break;
    case ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Kt(t.recipient));
      break;
    case ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Kt(t.recipient ? Kp(t.recipient) : Gp())), e.push(t.vrfProof);
      break;
    case ct.TenureChange:
      e.push(Ht(t.tenureHash)), e.push(Ht(t.previousTenureHash)), e.push(Ht(t.burnViewHash)), e.push(Ht(t.previousTenureEnd)), e.push(Rr(new Uint8Array(4), t.previousTenureBlocks)), e.push(ZE(new Uint8Array(1), t.cause)), e.push(Ht(t.publicKeyHash));
      break;
  }
  return qt(e);
}
function S8(t) {
  switch (t.readUInt8Enum(ct, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ct.TokenTransfer:
      const n = _e(t), r = ue(t.readBytes(8), !1), s = Yp(t);
      return y8(n, r, s);
    case ct.ContractCall:
      const i = Hs(t), o = Me(t), a = Me(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const k = _e(t);
        c.push(k);
      }
      return w8(i, o, a, c);
    case ct.SmartContract:
      const f = Me(t), l = Me(t, 4, 1e5);
      return hd(f, l);
    case ct.VersionedSmartContract: {
      const b = t.readUInt8Enum(Oc, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), k = Me(t), L = Me(t, 4, 1e5);
      return hd(k, L, b);
    }
    case ct.PoisonMicroblock:
      return b8();
    case ct.Coinbase: {
      const b = t.readBytes(Cr);
      return pd(b);
    }
    case ct.CoinbaseToAltRecipient: {
      const b = t.readBytes(Cr), k = _e(t);
      return pd(b, k);
    }
    case ct.NakamotoCoinbase: {
      const b = t.readBytes(Cr), k = _e(t), L = t.readBytes(Pc);
      return x8(b, k, L);
    }
    case ct.TenureChange:
      const y = ft(t.readBytes(20)), h = ft(t.readBytes(20)), g = ft(t.readBytes(20)), w = ft(t.readBytes(32)), I = t.readUInt32BE(), _ = t.readUInt8Enum(Rc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), U = ft(t.readBytes(20));
      return m8(y, h, g, w, I, _, U);
  }
}
class pa extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class mr extends pa {
  constructor(e) {
    super(e);
  }
}
class Ee extends pa {
  constructor(e) {
    super(e);
  }
}
class Do extends pa {
  constructor(e) {
    super(e);
  }
}
class Ir extends pa {
  constructor(e) {
    super(e);
  }
}
var Re;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Re || (Re = {}));
function Gc(t) {
  return Op(ft(t.readBytes(da)));
}
function bs(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function E8(t) {
  const e = t.readUInt8Enum(Re, (n) => {
    throw new Ee(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Re.PublicKeyCompressed:
      return bs(Ot.Compressed, zc(t));
    case Re.PublicKeyUncompressed:
      return bs(Ot.Uncompressed, d8(zc(t).data));
    case Re.SignatureCompressed:
      return bs(Ot.Compressed, Gc(t));
    case Re.SignatureUncompressed:
      return bs(Ot.Uncompressed, Gc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function eu(t) {
  return Ht(t.data);
}
function A8(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === Ot.Compressed ? Re.PublicKeyCompressed : Re.PublicKeyUncompressed), e.push(Oo(f8(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === Ot.Compressed ? Re.SignatureCompressed : Re.SignatureUncompressed), e.push(eu(t.contents));
      break;
  }
  return qt(e);
}
function An(t) {
  switch (t.type) {
    case Q.Address:
      return Ci(t);
    case Q.Principal:
      return Xp(t);
    case Q.LengthPrefixedString:
      return Ps(t);
    case Q.MemoString:
      return L8(t);
    case Q.AssetInfo:
      return Zp(t);
    case Q.PostCondition:
      return C8(t);
    case Q.PublicKey:
      return Oo(t);
    case Q.LengthPrefixedList:
      return su(t);
    case Q.Payload:
      return Wp(t);
    case Q.TransactionAuthField:
      return A8(t);
    case Q.MessageSignature:
      return eu(t);
  }
}
function $8() {
  return {
    type: Q.Address,
    version: Po.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function nu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Lt.SerializeP2PKH || e === Lt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Lt.SerializeP2WPKH || e === Lt.SerializeP2WSH || e === Lt.SerializeP2WSHNonSequential) && !r.every(qs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Lt.SerializeP2PKH:
      return Js(t, K8(r[0].data));
    case Lt.SerializeP2WPKH:
      return Js(t, V8(r[0].data));
    case Lt.SerializeP2SH:
    case Lt.SerializeP2SHNonSequential:
      return Js(t, q8(n, r.map(Oo)));
    case Lt.SerializeP2WSH:
    case Lt.SerializeP2WSHNonSequential:
      return Js(t, W8(n, r.map(Oo)));
  }
}
function Ci(t) {
  const e = [];
  return e.push(Ht(Li(t.version, 1))), e.push(Ht(t.hash160)), qt(e);
}
function Hs(t) {
  const e = ua(ft(t.readBytes(1))), n = ft(t.readBytes(20));
  return { type: Q.Address, version: e, hash160: n };
}
function Xp(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ci(t.address)), t.prefix === gi.Contract && e.push(Ps(t.contractName)), qt(e);
}
function v8(t) {
  const e = t.readUInt8Enum(gi, (s) => {
    throw new Ee(`Unexpected Principal payload type: ${s}`);
  }), n = Hs(t);
  if (e === gi.Standard)
    return { type: Q.Principal, prefix: e, address: n };
  const r = Me(t);
  return {
    type: Q.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ps(t) {
  const e = [], n = Vs(t.content), r = n.byteLength;
  return e.push(Ht(Li(r, t.lengthPrefixBytes))), e.push(n), qt(e);
}
function Me(t, e, n) {
  e = e || 1;
  const r = ua(ft(t.readBytes(e))), s = Wl(t.readBytes(r));
  return Gr(s, e, n ?? 128);
}
function I8(t) {
  return Gr(t, 4, 1e5);
}
function gd(t) {
  if (t && eg(t, No))
    throw new Error(`Memo exceeds maximum length of ${No} bytes`);
  return { type: Q.MemoString, content: t };
}
function L8(t) {
  const e = [], n = Vs(t.content), r = G8(ft(n), No * 2);
  return e.push(Ht(r)), qt(e);
}
function Yp(t) {
  let e = Wl(t.readBytes(No));
  return e = e.replace(/\u0000*$/, ""), { type: Q.MemoString, content: e };
}
function Zp(t) {
  const e = [];
  return e.push(Ci(t.address)), e.push(Ps(t.contractName)), e.push(Ps(t.assetName)), qt(e);
}
function Kc(t) {
  return {
    type: Q.AssetInfo,
    address: Hs(t),
    contractName: Me(t),
    assetName: Me(t)
  };
}
function ru(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function su(t) {
  const e = t.values, n = [];
  n.push(Ht(Li(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(An(r));
  return qt(n);
}
function Qp(t, e, n) {
  const r = ua(ft(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case Q.Address:
        s.push(Hs(t));
        break;
      case Q.LengthPrefixedString:
        s.push(Me(t));
        break;
      case Q.MemoString:
        s.push(Yp(t));
        break;
      case Q.AssetInfo:
        s.push(Kc(t));
        break;
      case Q.PostCondition:
        s.push(k8(t));
        break;
      case Q.PublicKey:
        s.push(zc(t));
        break;
      case Q.TransactionAuthField:
        s.push(E8(t));
        break;
    }
  return ru(s, n);
}
function C8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Xp(t.principal)), (t.conditionType === ge.Fungible || t.conditionType === ge.NonFungible) && e.push(Zp(t.assetInfo)), t.conditionType === ge.NonFungible && e.push(Kt(t.assetName)), e.push(t.conditionCode), t.conditionType === ge.STX || t.conditionType === ge.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new mr("The post-condition amount may not be larger than 8 bytes");
    e.push(dr(t.amount, !1, 8));
  }
  return qt(e);
}
function k8(t) {
  const e = t.readUInt8Enum(ge, (o) => {
    throw new Ee(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, s, i;
  switch (e) {
    case ge.STX:
      return r = t.readUInt8Enum(pi, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ft(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: ge.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case ge.Fungible:
      return s = Kc(t), r = t.readUInt8Enum(pi, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ft(t.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: ge.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case ge.NonFungible:
      s = Kc(t);
      const o = _e(t);
      return r = t.readUInt8Enum(Dc, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: ge.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function hn(t, e) {
  return qt([t, e]);
}
function B8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === N.OptionalNone ? new Uint8Array([t.type]) : hn(t.type, Kt(t.value));
}
function M8(t) {
  const e = new Uint8Array(4);
  return Rr(e, t.buffer.length, 0), hn(t.type, fa(e, t.buffer));
}
function _8(t) {
  const e = ql(jE(t.value, BigInt(eA)), Tp);
  return hn(t.type, e);
}
function U8(t) {
  const e = ql(t.value, Tp);
  return hn(t.type, e);
}
function N8(t) {
  return hn(t.type, Ci(t.address));
}
function H8(t) {
  return hn(t.type, fa(Ci(t.address), Ps(t.contractName)));
}
function P8(t) {
  return hn(t.type, Kt(t.value));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  Rr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Kt(r);
    e.push(s);
  }
  return hn(t.type, qt(e));
}
function D8(t) {
  const e = [], n = new Uint8Array(4);
  Rr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Gr(s);
    e.push(Ps(i));
    const o = Kt(t.data[s]);
    e.push(o);
  }
  return hn(t.type, qt(e));
}
function Jp(t, e) {
  const n = [], r = e == "ascii" ? kp(t.data) : Vs(t.data), s = new Uint8Array(4);
  return Rr(s, r.length, 0), n.push(s), n.push(r), hn(t.type, qt(n));
}
function j8(t) {
  return Jp(t, "ascii");
}
function F8(t) {
  return Jp(t, "utf8");
}
function Kt(t) {
  switch (t.type) {
    case N.BoolTrue:
    case N.BoolFalse:
      return B8(t);
    case N.OptionalNone:
    case N.OptionalSome:
      return T8(t);
    case N.Buffer:
      return M8(t);
    case N.UInt:
      return U8(t);
    case N.Int:
      return _8(t);
    case N.PrincipalStandard:
      return N8(t);
    case N.PrincipalContract:
      return H8(t);
    case N.ResponseOk:
    case N.ResponseErr:
      return P8(t);
    case N.List:
      return O8(t);
    case N.Tuple:
      return D8(t);
    case N.StringASCII:
      return j8(t);
    case N.StringUTF8:
      return F8(t);
    default:
      throw new mr("Unable to serialize. Invalid Clarity Value.");
  }
}
function z8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const yd = /* @__PURE__ */ new Map();
function tg(t, e) {
  const n = yd.get(t);
  if (n !== void 0)
    return n(e);
  const r = z8(t);
  return yd.set(t, r), tg(t, e);
}
class si {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return QE(this.readBytes(4), 0);
  }
  readUInt8() {
    return YE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return WE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ft(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ft(n);
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
    if (tg(e, r))
      return r;
    throw n(r);
  }
}
function _e(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new si(Ht(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new si(t) : e = t;
  switch (e.readUInt8Enum(N, (r) => {
    throw new Ee(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case N.Int:
      return r8(e.readBytes(16));
    case N.UInt:
      return ar(e.readBytes(16));
    case N.Buffer:
      const r = e.readUInt32BE();
      return Rp(e.readBytes(r));
    case N.BoolTrue:
      return Fp();
    case N.BoolFalse:
      return zp();
    case N.PrincipalStandard:
      const s = Hs(e);
      return JA(s);
    case N.PrincipalContract:
      const i = Hs(e), o = Me(e);
      return jp(i, o);
    case N.ResponseOk:
      return i8(_e(e));
    case N.ResponseErr:
      return s8(_e(e));
    case N.OptionalNone:
      return Gp();
    case N.OptionalSome:
      return Kp(_e(e));
    case N.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(_e(e));
      return o8(c);
    case N.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let w = 0; w < u; w++) {
        const I = Me(e).content;
        if (I === void 0)
          throw new Ee('"content" is undefined');
        f[I] = _e(e);
      }
      return yi(f);
    case N.StringASCII:
      const l = e.readUInt32BE(), y = GE(e.readBytes(l));
      return ze(y);
    case N.StringUTF8:
      const h = e.readUInt32BE(), g = Wl(e.readBytes(h));
      return a8(g);
    default:
      throw new Ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const R8 = (t) => t.length % 2 == 0 ? t : `0${t}`, G8 = (t, e) => t.padEnd(e, "0"), eg = (t, e) => t ? Vs(t).length > e : !1;
function Vc(t) {
  return m0(t);
}
const wi = (t) => xA(Jl(t)), iu = (t) => ft(YA(t)), K8 = (t) => ft(wi(t)), V8 = (t) => {
  const e = wi(t), n = fa(new Uint8Array([0]), new Uint8Array([e.length]), e), r = wi(n);
  return ft(r);
}, q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = qt(n), s = wi(r);
  return ft(s);
}, W8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = qt(n), s = Jl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = qt(i), a = wi(o);
  return ft(a);
};
function X8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function ng(t) {
  const e = Kt(t);
  return `0x${ft(e)}`;
}
function Y8(t) {
  return _e(t);
}
const ms = (t) => {
  try {
    return Qr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function ou() {
  return {
    type: Q.MessageSignature,
    data: ft(new Uint8Array(da))
  };
}
function rg(t, e, n, r) {
  const s = nu(0, t, 1, [Ns(e)]).hash160, i = qs(Ns(e)) ? Ot.Compressed : Ot.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ue(n, !1),
    fee: ue(r, !1),
    keyEncoding: i,
    signature: ou()
  };
}
function bi(t) {
  return "signature" in t;
}
function wd(t) {
  return t === Lt.SerializeP2SH || t === Lt.SerializeP2WSH;
}
function Z8(t) {
  return t === Lt.SerializeP2SHNonSequential || t === Lt.SerializeP2WSHNonSequential;
}
function bd(t) {
  const e = Vc(t);
  return e.nonce = 0, e.fee = 0, bi(e) ? e.signature = ou() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Q8(t) {
  const e = [
    t.hashMode,
    Ht(t.signer),
    dr(t.nonce, !1, 8),
    dr(t.fee, !1, 8),
    t.keyEncoding,
    eu(t.signature)
  ];
  return qt(e);
}
function J8(t) {
  const e = [
    t.hashMode,
    Ht(t.signer),
    dr(t.nonce, !1, 8),
    dr(t.fee, !1, 8)
  ], n = ru(t.fields);
  e.push(su(n));
  const r = new Uint8Array(2);
  return XE(r, t.signaturesRequired, 0), e.push(r), qt(e);
}
function t6(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt(`0x${ft(e.readBytes(8))}`), s = BigInt(`0x${ft(e.readBytes(8))}`), i = e.readUInt8Enum(Ot, (a) => {
    throw new Ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Lt.SerializeP2WPKH && i != Ot.Compressed)
    throw new Ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Gc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function e6(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt("0x" + ft(e.readBytes(8))), s = BigInt("0x" + ft(e.readBytes(8))), i = Qp(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case Q.PublicKey:
        qs(u.contents) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === Ot.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ir("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Lt.SerializeP2WSH || t === Lt.SerializeP2WSHNonSequential))
    throw new Ir("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function za(t) {
  return bi(t) ? Q8(t) : J8(t);
}
function Ra(t) {
  const e = t.readUInt8Enum(Lt, (n) => {
    throw new Ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Lt.SerializeP2PKH || e === Lt.SerializeP2WPKH ? t6(e, t) : e6(e, t);
}
function sg(t, e, n, r) {
  const i = t + ft(new Uint8Array([e])) + ft(dr(n, !1, 8)) + ft(dr(r, !1, 8));
  if (Ht(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return iu(Ht(i));
}
function ig(t, e, n) {
  const r = 33 + da, s = qs(e) ? Ot.Compressed : Ot.Uncompressed, i = t + R8(s.toString(16)) + n.data, o = Ht(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return iu(o);
}
function n6(t, e, n, r, s) {
  const i = sg(t, e, n, r), o = p8(s, i), a = g8(s), c = ig(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function og(t, e, n, r, s, i) {
  const o = sg(t, e, n, r), a = Ns(c8(o, i, s)), c = ig(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function r6() {
  const t = rg(Lt.SerializeP2PKH, "", 0, 0);
  return t.signer = $8().hash160, t.keyEncoding = Ot.Compressed, t.signature = ou(), t;
}
function xd(t, e, n) {
  return bi(t) ? s6(t, e, n) : i6(t, e, n);
}
function s6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = og(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = nu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ir(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function i6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        qs(c.contents) || (i = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === Ot.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = og(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (wd(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Ir("Too many signatures");
        break;
    }
  if (wd(t.hashMode) && o !== t.signaturesRequired || Z8(t.hashMode) && o < t.signaturesRequired)
    throw new Ir("Incorrect number of signatures");
  if (i && (t.hashMode === Lt.SerializeP2WSH || t.hashMode === Lt.SerializeP2WSHNonSequential))
    throw new Ir("Uncompressed keys are not allowed in this hash mode");
  const a = nu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ir(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ag(t) {
  return {
    authType: zt.Standard,
    spendingCondition: t
  };
}
function cg(t, e) {
  return {
    authType: zt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || rg(Lt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function md(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case zt.Standard:
        return ag(bd(t.spendingCondition));
      case zt.Sponsored:
        return cg(bd(t.spendingCondition), r6());
      default:
        throw new Do("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function o6(t, e) {
  switch (t.authType) {
    case zt.Standard:
      return xd(t.spendingCondition, e, zt.Standard);
    case zt.Sponsored:
      return xd(t.spendingCondition, e, zt.Standard);
    default:
      throw new Do("Invalid origin auth type");
  }
}
function a6(t, e) {
  switch (t.authType) {
    case zt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ue(e, !1)
      };
      return { ...t, spendingCondition: n };
    case zt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ue(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function c6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ue(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function l6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ue(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function u6(t, e) {
  const n = {
    ...e,
    nonce: ue(e.nonce, !1),
    fee: ue(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function f6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case zt.Standard:
      e.push(za(t.spendingCondition));
      break;
    case zt.Sponsored:
      e.push(za(t.spendingCondition)), e.push(za(t.sponsorSpendingCondition));
      break;
  }
  return qt(e);
}
function d6(t) {
  const e = t.readUInt8Enum(zt, (r) => {
    throw new Ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case zt.Standard:
      return n = Ra(t), ag(n);
    case zt.Sponsored:
      n = Ra(t);
      const r = Ra(t);
      return cg(n, r);
  }
}
class h6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ue(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? JE, this.postConditionMode = i ?? Us.Deny, this.postConditions = s ?? ru([]), o)
      this.anchorMode = sA(o);
    else
      switch (r.payloadType) {
        case ct.Coinbase:
        case ct.CoinbaseToAltRecipient:
        case ct.NakamotoCoinbase:
        case ct.PoisonMicroblock:
        case ct.TenureChange:
          this.anchorMode = pe.OnChainOnly;
          break;
        case ct.ContractCall:
        case ct.SmartContract:
        case ct.VersionedSmartContract:
        case ct.TokenTransfer:
          this.anchorMode = pe.Any;
          break;
      }
  }
  signBegin() {
    const e = Vc(this);
    return e.auth = md(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Vc(this);
    return e.auth = md(e.auth), e.txid();
  }
  verifyOrigin() {
    return o6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, zt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === zt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, zt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !bi(n)) {
      const r = qs(e);
      n.fields.push(bs(r ? Ot.Compressed : Ot.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = n6(n, r, e.fee, e.nonce, s);
    return bi(e) ? e.signature = i : e.fields.push(bs(s.data.byteLength === Bp ? Ot.Compressed : Ot.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return iu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != zt.Sponsored)
      throw new Do("Cannot sponsor sign a non-sponsored transaction");
    this.auth = u6(this.auth, e);
  }
  setFee(e) {
    this.auth = a6(this.auth, e);
  }
  setNonce(e) {
    this.auth = c6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != zt.Sponsored)
      throw new Do("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new mr('"version" is undefined');
    if (this.chainId === void 0)
      throw new mr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new mr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new mr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new mr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Rr(n, this.chainId, 0), e.push(n), e.push(f6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(su(this.postConditions)), e.push(Wp(this.payload)), qt(e);
  }
}
function au(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new si(Ht(t.slice(2))) : e = new si(Ht(t)) : t instanceof Uint8Array ? e = new si(t) : e = t;
  const n = e.readUInt8Enum(Ho, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = d6(e), i = e.readUInt8Enum(pe, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Us, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Qp(e, Q.PostCondition), c = S8(e);
  return new h6(n, s, c, a, o, i, r);
}
const p6 = e8, ii = ar, g6 = Rp;
const y6 = /* @__PURE__ */ new Set([4001, -31001]), w6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], b6 = ["result", "data", "payload", "response", "params"], Sd = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], ga = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ns = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Cn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, x6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), lg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => x6(i, r)) === s
  );
}, ug = (t) => t ? lg(ns()).some(
  (e) => {
    var n;
    return e.id === t && (ga(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, fg = () => {
  if (typeof window > "u")
    return;
  const t = ns(), e = lg(t).filter(
    (n) => {
      var r;
      return ga(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Cn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of w6) {
    const r = Cn(t, n) ?? (t === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, m6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ns(), n = Cn(e, t) ?? (e === window ? void 0 : Cn(window, t)) ?? ea(t);
  if (n)
    return n;
  if (ga(t) || ug(t))
    return fg();
}, io = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, S6 = ["blockstack-session", "blockstack"], E6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of S6) {
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
E6();
const dg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Se = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, A6 = (t) => {
  const e = Se(t);
  if (!e)
    return null;
  const n = dg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, $6 = (t) => {
  const e = Se(t);
  if (!e)
    return null;
  const n = dg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, qc = (t, e = "mainnet") => {
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
      return qc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return qc(r, e);
  }
  return e;
}, kr = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, xi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ms(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = xi(s, e + 1);
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
    const i = xi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && ms(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ms(n.testnet) ? n.testnet.trim() : null;
}, Ed = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, hg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && y6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Kr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Se(n == null ? void 0 : n.message) ?? Se(e.message) ?? Se(e.error) ?? Se(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Os = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Kr(e);
    if (e.status === "error")
      throw Kr(e.result ?? e);
  }
  return t;
}, Ad = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Os(r);
  } catch (r) {
    throw Kr(r);
  }
}, pg = () => fg(), cu = () => {
  if (typeof window > "u")
    return;
  const t = ns();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Cn(t, e) ?? (t === window ? void 0 : Cn(window, e));
    if (n)
      return n;
  }
}, $d = () => {
  if (typeof window > "u")
    return;
  const t = cu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ns();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Cn(e, n) ?? (e === window ? void 0 : Cn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, yo = (t) => {
  var r, s;
  const e = Hr();
  if (ga(e) || ug(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ns() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === pg();
}, Ga = (t) => {
  const e = $6(t);
  if (!e)
    return null;
  try {
    const n = au(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, jo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Ga(t), r = A6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Se(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = jo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Sd)
    if (Ga(s[a])) {
      i = Se(s[a]);
      break;
    }
  const o = Se(s.txId) || Se(s.txid) || Se(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Se(s.txRaw) ?? void 0
    };
  for (const a of Sd) {
    const c = Ga(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Se(s[a]) ?? void 0
      };
  }
  for (const a of b6) {
    const c = s[a], u = jo(c, e + 1);
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
}, Ka = (t) => {
  const e = jo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, v6 = (t) => {
  const e = jo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, I6 = (t) => ({
  ...t,
  fee: kr(t.fee),
  nonce: kr(t.nonce),
  sponsored: t.sponsored === !0
}), vd = (t) => ({
  recipient: t.recipient,
  amount: kr(t.amount) ?? "0",
  memo: t.memo,
  network: qc(t.network),
  address: t.stxAddress,
  fee: kr(t.fee),
  nonce: kr(t.nonce),
  sponsored: t.sponsored ?? !1
}), gg = "WALLET_ADDRESS_MISMATCH", L6 = 45e3;
let oi = null;
const Wc = (t) => {
  t && (oi = { address: t, at: Date.now() });
}, C6 = () => {
  oi = null;
}, k6 = () => oi && Date.now() - oi.at <= L6 ? oi.address : null, B6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T6 = async (t) => {
  C6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Os(await t.request("wallet_connect")), n = xi(e);
  return Wc(n), n;
}, M6 = async (t, e, n, r) => {
  try {
    return Os(await t.request(e, n));
  } catch (s) {
    const i = Kr(s);
    if (!B6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await T6(t);
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
        { code: o ? gg : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Os(await t.request(e, n));
    } catch (a) {
      throw Kr(a);
    }
  }
};
let Id = 3e4;
const _6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Id / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Id);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, U6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: gg }
      );
    return c;
  }, s = k6();
  if (s)
    return io(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  io(n, "account-read");
  try {
    const c = Os(
      await _6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = xi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (hg(c))
      throw Kr(c);
    io(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Wc(i), r(i, "wallet_getAccount");
  let o;
  io(n, "account-reconnect");
  try {
    o = Os(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Kr(c);
  }
  const a = xi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Wc(a), r(a, "wallet_connect");
}, N6 = async (t, e) => {
  if (!yo(t)) {
    const i = await Ad(
      t,
      "stx_transferStx",
      vd(e)
    );
    return Ka(i);
  }
  const n = cu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Ad(
      n,
      "stx_transferStx",
      vd(e)
    );
    return Ka(i);
  }
  const r = pg();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await U6(r, e.stxAddress);
  const s = await M6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: kr(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: kr(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ka(s);
}, H6 = () => Hr(), yg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Hr(), e = t ? m6(t) : void 0;
  if (e)
    return e;
  const n = ns() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ld = (t, e) => {
  const n = yg(), r = I6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, v6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return eo(r, e);
  if (yo(n) && !cu()) {
    const s = $d();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Hr(),
        route: "legacy-transaction-request"
      }), eo(r, s);
  }
  return void N6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Ed(s) && yo(n)) {
      const a = $d();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Hr(),
          route: "legacy-transaction-request"
        }), eo(r, a);
        return;
      }
    }
    if (Ed(s) && !yo(n)) {
      eo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), hg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Cd = (t) => ng(t).replace(/^0x/, ""), kd = "This wallet cannot sign messages. Try Xverse or Leather.", Bd = (t) => typeof (t == null ? void 0 : t.request) == "function", Td = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", P6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Cd(e.message),
    domain: Cd(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function j6(t, e) {
  const n = await _E({
    domain: e.domain,
    message: e.message,
    network: la(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Md(t) {
  var s, i;
  const e = H6() || "", n = /xverse/i.test(e);
  let r = yg();
  if (n && !Td(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Td(r))
    try {
      return await j6(r, t);
    } catch (o) {
      if (n || !Bd(r) || !O6(o)) throw o;
    }
  if (!n && Bd(r))
    try {
      return await D6(r, t);
    } catch (o) {
      throw P6(o) ? new Error(kd) : o;
    }
  throw new Error(kd);
}
const _d = 1000000n, ai = 1000000n, Xc = 50n, Ds = 3000n, ya = 300n, F6 = 3000n, z6 = 50000n, Ud = 200n, js = (t) => t + Xc;
function $n(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / _d}.${(n % _d).toString().padStart(6, "0")}`;
}
function R6(t, e = ya) {
  return t <= Ds ? 0 : Number((t - Ds) / js(e));
}
function Nd(t, e = 0n) {
  const n = ai - t - e;
  return n > 0n ? n : 0n;
}
function G6(t, e = ya) {
  return t > ai ? "over" : t < Ds + js(e) ? "empty" : t < z6 ? "low" : "ok";
}
const K6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", V6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", q6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function W6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || q6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== K6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const wg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Va = 3, X6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Yc, bg] = wg.split("."), ke = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Zc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function Y6(t) {
  return ke(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Vr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function xg(t, e = []) {
  const n = await Vr(`/v2/contracts/call-read/${Yc}/${bg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Yc, arguments: e.map((r) => "0x" + ke(Kt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return In(_e(n.result));
}
async function Z6() {
  const t = await Vr(`/v2/contracts/source/${Yc}/${bg}?proof=0`);
  if (typeof t.source != "string" || await Y6(t.source) !== V6) throw Error("Deployed source does not match the tested helper.");
  if (W6(await xg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function mg(t) {
  return t.startsWith("SP") && ms(t) && !t.includes(".");
}
async function Q6(t) {
  var r;
  if (!mg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Vr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Vr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function J6(t) {
  const e = await Vr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function t5(t, e) {
  var s, i;
  const n = await xg("get-owner", [ii(t), ii(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !mg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function e5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Zc(t), signal: AbortSignal.timeout(15e3) });
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
async function n5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function r5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = au(Zc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ws(Js(Po.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || ws(r.contractAddress) + "." + r.contractName.content !== wg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ke(Kt(r.functionArgs[0])) !== ke(Kt(ii(t.core))) || ke(Kt(r.functionArgs[1])) !== ke(Kt(ii(t.song))) || ke(Kt(r.functionArgs[2])) !== ke(Kt(g6(Zc(t.id)))) || t.amount !== "50" || e.postConditionMode !== Us.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== pi.Equal || i.principal.prefix !== 2 || ws(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ws(r.contractAddress) + "." + r.contractName.content !== X6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ke(Kt(r.functionArgs[0])) !== ke(Kt(ii(t.song))) || typeof t.liked != "boolean" || ke(Kt(r.functionArgs[1])) !== ke(Kt(p6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Us.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || In(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const s5 = "xtrata.xyz/radio/listening-wallet", i5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Fo = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ms(t), o5 = (t) => ({
  domain: yi({ name: ze(s5), version: ze("1"), "chain-id": ar(1) }),
  message: yi({
    purpose: ze(i5),
    main: ze(t.main),
    listening: ze(t.listening),
    issued: ar(t.issued)
  })
}), Hd = ["prepared", "signed", "unknown", "pending"], a5 = 30 * 6e4, ls = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, c5 = 3e3, Pd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function l5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, f = !1, l = !1, y = null, h = !1, g = "", w = "", I, _ = null, U, b = [], k, L = -1 / 0;
  const O = /* @__PURE__ */ new Set();
  let V = null, D = !1, j = 0, m = !1, C = !1, P = !1, X = !1, tt = 0, z = null, xt = Promise.resolve();
  const Ct = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ya.toString()), Dt = (S) => !!i && !(i.features ?? []).includes(S), A = (S, E) => `xtrata.ppp.v1.${S}:${E}`, x = (S = i == null ? void 0 : i.address) => {
    if (!S) return [];
    try {
      const E = JSON.parse(t.store.get(A("entries", S)) || "[]");
      return Array.isArray(E) ? E : [];
    } catch {
      return [];
    }
  }, M = (S) => {
    const E = [S, ...x(S.address).filter((H) => !(H.txid === S.txid && H.kind === S.kind))].slice(0, 200);
    t.store.set(A("entries", S.address), JSON.stringify(E));
  }, G = (S = i == null ? void 0 : i.address) => !!S && t.store.get(A("on", S)) !== "0", K = (S) => {
    i != null && i.address && t.store.set(A("on", i.address), S ? "1" : "0");
  }, q = () => x().filter((S) => Hd.includes(S.status)), $t = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(A("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, jt = (S) => {
    i != null && i.address && t.store.set(A("deposit", i.address), JSON.stringify(S));
  }, fe = () => q().filter((S) => t.now() - S.created > a5 && O.has(S.txid)), Ue = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Wt = () => Ue() && !(i != null && i.linked), Ie = (S) => A("return-to", S), _t = (S = i == null ? void 0 : i.address) => {
    if (!S) return;
    const E = t.store.get(Ie(S));
    return E && Fo(E) && E !== S ? E : void 0;
  }, Gt = (S = i == null ? void 0 : i.address) => V && V.for === S ? V.res : null;
  function Qt() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const S = _t();
    if (S) return { to: S, kind: "chosen" };
    const E = Gt();
    if (E != null && E.ok && E.funder) return { to: E.funder, kind: "funder" };
  }
  function Bt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const S = t.main();
    if (!Wt()) {
      if (!S) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : !Wt() && i.linked !== S ? "link" : o === void 0 ? "loading" : o > ai ? "over" : o < Ds + js(Ct()) ? "fund" : "ready" : "loading";
  }
  const d = () => {
    var S, E, H, nt;
    return {
      step: Bt(),
      busy: c,
      message: g,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : G6(o, Ct()),
      playsLeft: o === void 0 ? 0 : R6(o, Ct()),
      allowance: o === void 0 ? ai : Nd(o, BigInt(((S = $t()) == null ? void 0 : S.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: G(),
      entries: x(),
      depositTxid: ((E = $t()) == null ? void 0 : E.txid) ?? I,
      depositPending: !!$t(),
      walletOutdated: Dt("like"),
      linkedListening: k && k === t.main() ? b.map((W) => W.listening) : [],
      serverLinked: !!_ && U === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: fe().length,
      armed: P,
      queued: gt.length,
      solo: Wt(),
      returnTo: (H = Qt()) == null ? void 0 : H.to,
      returnToKind: (nt = Qt()) == null ? void 0 : nt.kind,
      funderState: (() => {
        const W = Gt();
        return W ? W.ok ? W.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const W = Gt();
        return !!W && W.ok && W.distinct > 1;
      })(),
      walletCannotSolo: Wt() && Dt("standalone")
    };
  }, $ = (S, E = "") => {
    g = S, w = E, t.changed();
  };
  async function T(S, E) {
    if (!c) {
      c = S, w = "", t.changed();
      try {
        await E();
      } catch (H) {
        const nt = H instanceof Error ? H.message : String(H);
        w = /Cancelled in the listening wallet/.test(nt) ? "" : nt, w || (g = "Not now. Nothing was signed.", X = !0);
      } finally {
        c = null, await Xt(!0);
      }
    }
  }
  const Y = () => !!(e != null && e.enabled) && e.here && (Wt() || !!t.main() && e.allowed);
  async function dt() {
    if (!Y()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function mt(S = !1) {
    i != null && i.address && (!S && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function re(S) {
    if ((k !== S || t.now() - L >= 6e4) && (b = await t.links(S), k = S, L = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === S) return;
    const E = `${S}:${i.address}`;
    U === E && _ || (_ = b.find((H) => H.listening === i.address) ?? null, U = E);
  }
  async function Jt() {
    const S = i == null ? void 0 : i.address;
    if (!Wt() || !S || i != null && i.linked || !t.funder || D || !o || o <= 0n) return;
    const E = Gt(S);
    if (E != null && E.ok && E.funder) return;
    const H = E != null && E.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, j - 1), 30 * 6e4);
    if (!(V && V.for === S && t.now() - V.at < H)) {
      D = !0;
      try {
        V = { for: S, res: await t.funder(S), at: t.now() };
      } catch {
        V = { for: S, res: { ok: !1 }, at: t.now() };
      } finally {
        D = !1;
      }
      j = V.res.ok ? 0 : j + 1;
    }
  }
  async function qe() {
    var nt;
    const S = i == null ? void 0 : i.address;
    if (!S) return;
    let E;
    for (const W of q())
      try {
        const Mt = await t.chain.transaction(W.txid);
        if (!Mt) {
          if (O.add(W.txid), t.now() - W.created > 15 * 6e4 && (E ?? (E = await t.chain.confirmedNonce(S))), E !== void 0 && E > BigInt(W.nonce)) {
            M({ ...W, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((W.status === "unknown" || W.status === "signed") && W.raw)
            try {
              await t.chain.broadcast(W.raw, W.txid), M({ ...W, status: "pending" });
            } catch (Et) {
              ls(Et) && M({ ...W, status: "failed", note: Et.message, raw: void 0 });
            }
          continue;
        }
        O.delete(W.txid);
        const ut = String(Mt.tx_status);
        if (ut === "success" && Mt.canonical !== !1 && Mt.is_unanchored === !1) {
          if (M({ ...W, status: "confirmed", confirmedAt: t.now(), actualFee: String(Mt.fee_rate ?? W.fee), raw: void 0 }), W.kind === "like" && (h = !0, W.status !== "confirmed" && typeof W.liked == "boolean"))
            try {
              (nt = t.likeConfirmed) == null || nt.call(t, W.song, W.liked);
            } catch {
            }
        } else ut.startsWith("abort_") || ut.startsWith("dropped_") ? M({ ...W, status: "failed", note: ut, raw: void 0 }) : W.status !== "pending" && M({ ...W, status: "pending" });
      } catch {
      }
    const H = $t();
    if (H)
      try {
        const W = await t.chain.transaction(H.txid), Mt = String((W == null ? void 0 : W.tx_status) ?? "");
        (Mt === "success" && W.is_unanchored === !1 || Mt.startsWith("abort_") || Mt.startsWith("dropped_") || !W && t.now() - H.at > 2 * 36e5) && (jt(null), a = -1 / 0);
      } catch {
      }
  }
  async function Xt(S = !1) {
    var E;
    try {
      const H = t.main();
      if ((S || !e || r !== H || t.now() - n > 3e5) && (e = await t.config(H), n = t.now(), r = H), !e.enabled || !e.here || !Wt() && (!H || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), P && te(), t.changed();
        return;
      }
      await dt(), i = await s.request("listening.status"), H && e.allowed && await re(H), await mt(S), await Jt(), await qe();
    } catch (H) {
      w = H instanceof Error ? H.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Bt() === "locked" ? pr() : P && te(), h) {
      h = !1;
      try {
        (E = t.likesChanged) == null || E.call(t);
      } catch {
      }
    }
    t.changed(), gt.length && !pn && Pe();
  }
  async function Ne(S, E) {
    const H = !(i != null && i.address) || G(i.address);
    await S.request("listening.unlock", { mode: "unlock", terms: H ? Le() : void 0, anyPasskey: E }), i = await S.request("listening.status"), H && (G(i.address) ? await ht() : await S.request("listening.stop")), $(H ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const nt = y;
    y = null, nt && t.now() - nt.at < 12e4 && setTimeout(() => void Xt(!0).then(() => We(nt)), 0);
  }
  function pr() {
    P || c || X || tt >= 3 || !s || !(i != null && i.address) || (P = !0, xt = (async () => {
      try {
        await Ne(s, !1), tt = 0;
      } catch (S) {
        const E = S instanceof Error ? S.message : String(S);
        /Cancelled in the listening wallet/.test(E) ? z || (X = !0, $("Not now. Nothing was signed.")) : /did not answer/.test(E) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (tt++, w = E);
      } finally {
        P = !1;
        const S = z;
        z = null, S ? await S() : await Xt(!0);
      }
    })());
  }
  async function te(S) {
    P && (z = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await xt), S && await S(), t.changed();
  }
  const Le = () => ({
    fee: Ct().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ai.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function ht() {
    if (!(i != null && i.address)) return !1;
    if (C || (C = await t.tabLock(i.address)), !C)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Tt = {
    forceRefresh: () => Xt(!0),
    create: () => T("Waiting for your passkey…", async () => {
      const S = await dt();
      await S.request("listening.unlock", { mode: "create", terms: Le() }), i = await S.request("listening.status"), K(!0), $(Wt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ht();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (S, E) => {
      !(i != null && i.address) || $t() || (jt({ txid: S, amount: E.toString(), at: t.now() }), a = -1 / 0, $("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (S = !1) => {
      const E = () => T("Waiting for your passkey…", async () => Ne(await dt(), S));
      return P ? S ? Dt("cancel") ? ($("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : te(async () => {
        (Bt() === "locked" || Bt() === "intro") && await E();
      }) : xt : E();
    },
    link: () => T("Sign in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const E = (await t.links(S)).find((H) => H.listening === i.address);
      if (E)
        await s.request("listening.link", { main: S, issued: E.issued, mainSignature: E.mainSignature });
      else {
        const H = { main: S, listening: i.address, issued: t.now() }, nt = await t.signWithMain(S, o5(H)), W = await s.request("listening.link", { main: S, issued: H.issued, mainSignature: nt });
        await t.saveLink({ ...H, mainSignature: nt, listeningSignature: W.listeningSignature }), L = -1 / 0;
      }
      $("Linked ✓");
    }),
    deposit: () => T("Approve the deposit in your wallet…", async () => {
      const S = t.main();
      if (!S || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if ($t()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await mt(!0);
      const E = Nd(o ?? 0n);
      if (E <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      I = await t.deposit(S, i.address, E), I && jt({ txid: I, amount: E.toString(), at: t.now() }), $("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => T("Confirm in the listening wallet…", async () => {
      if (!Y()) throw new Error("Connect your wallet first.");
      await ht(), await s.request("listening.approveSession", Le()), K(!0), $("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => T("Clearing…", async () => {
      for (const S of fe())
        await t.chain.transaction(S.txid) || M({ ...S, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      $("Cleared ✓");
    }),
    switchOff: () => T("Switching off…", async () => {
      gn(), await (s == null ? void 0 : s.request("listening.stop")), K(!1), $("Paying is off. Music stays free.");
    }),
    lock: () => T("Locking…", async () => {
      gn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, $("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (S) => {
      const E = String(S ?? "").trim();
      if (!(i != null && i.address)) return $("", "Unlock the listening wallet first.");
      if (!Fo(E)) return $("", "Enter a standard mainnet address (it starts with SP).");
      if (E === i.address) return $("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Ie(i.address), E), $("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Ie(i.address), ""), t.changed();
    },
    returnFunds: (S) => T("Check the return in the listening wallet…", async () => {
      if (!Y()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const E = Qt();
      if (!E) throw new Error(Wt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (E.kind !== "linked" && Dt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: H, nonce: nt } = await t.chain.account(i.address);
      o = H;
      const W = await s.request("listening.prepareReturn", {
        mode: S,
        balance: H.toString(),
        nonce: nt.toString(),
        fee: F6.toString(),
        ...E.kind === "linked" ? {} : { destination: E.to }
      });
      if (W.recipient !== E.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const Mt = au(W.raw);
      if (In(Mt.payload.recipient).value !== E.to || String(Mt.payload.amount) !== W.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const ut = {
        id: Pd(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: W.recipient,
        amount: W.amount,
        fee: W.fee,
        nonce: nt.toString(),
        created: t.now(),
        status: "signed",
        raw: W.raw,
        txid: W.txid
      };
      t.validate(ut), M(ut);
      try {
        await t.chain.broadcast(W.raw, W.txid), M({ ...ut, status: "pending" });
      } catch (Et) {
        throw M({ ...ut, status: "unknown", note: Et.message }), Et;
      }
      S === "all" && K(!1), $(S === "all" ? E.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, gt = [], He = 10, gr = 30 * 6e4;
  let pn = !1;
  const yr = () => u || !!c || f || l, gn = () => {
    gt.length && (gt.length = 0, t.changed());
  };
  async function yn(S) {
    if (!gt.some((E) => E.id === S.id) && !x().some((E) => E.id === S.id) && (gt.push({ ...S, at: t.now() }), gt.length > He && gt.shift()), yr() || q().length) {
      const E = gt.length;
      g = `Queued ${E === 1 ? "this song" : E + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Pe();
  }
  async function Pe() {
    if (!pn) {
      pn = !0;
      try {
        for (; gt.length; ) {
          for (; gt.length && t.now() - gt[0].at > gr; ) gt.shift();
          if (!gt.length || yr() || await Mn(gt[0]) === "wait") return;
          gt.shift();
        }
      } finally {
        pn = !1, t.changed();
      }
    }
  }
  async function Mn(S) {
    u = !0;
    try {
      await Xt();
      const E = Bt();
      if (E === "loading") return "wait";
      if (E !== "ready" || !G() || !(i != null && i.session) || i.session.playsLeft < 1 || !C) return "done";
      if (q().length) return "wait";
      m || (await t.chain.verify(), m = !0);
      const H = i.address, { balance: nt, nonce: W } = await t.chain.account(H);
      o = nt, a = t.now();
      const Mt = await t.chain.owner(Va, S.song);
      if (Mt === H || Mt === t.main()) return "done";
      const ut = await s.request("listening.signPlay", {
        core: Va,
        song: S.song,
        receipt: S.id,
        fee: Ct().toString(),
        nonce: W.toString(),
        balance: nt.toString()
      }), Et = {
        id: S.id,
        address: H,
        kind: "play",
        core: Va,
        song: S.song,
        recipient: Mt,
        amount: "50",
        fee: Ct().toString(),
        nonce: W.toString(),
        created: t.now(),
        status: "signed",
        raw: ut.raw,
        txid: ut.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...S.title ? { title: String(S.title).slice(0, 120) } : {},
        ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
      };
      t.validate(Et), M(Et);
      const wn = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`;
      try {
        await t.chain.broadcast(ut.raw, ut.txid), M({ ...Et, status: "pending" }), g = `♪ Paid ${wn}`, w = "";
      } catch (Ye) {
        M({ ...Et, status: ls(Ye) ? "failed" : "unknown", note: Ye.message, ...ls(Ye) ? { raw: void 0 } : {} }), w = Ye.message;
      }
      return i = await s.request("listening.status"), "done";
    } catch (E) {
      return g = "This song played free: " + (E instanceof Error ? E.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function _n(S) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Bt()) || Dt("like") ? !1 : (We(S), !0);
  }
  async function We(S) {
    const E = S.title ? `“${S.title}”` : `song #${S.song}`, H = (we) => {
      var Ze;
      w = we, g = "";
      try {
        (Ze = t.likeFailed) == null || Ze.call(t, S.song);
      } catch {
      }
      t.changed();
    }, nt = Bt(), W = t.main(), Mt = Wt() ? i == null ? void 0 : i.address : W;
    if (nt === "locked") {
      y = { ...S, at: t.now() }, $(`Unlock to like ${E}. It sends straight after.`);
      return;
    }
    if (nt === "link") return H("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Wt() && Dt("standalone")) return H("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (nt === "fund") return H("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (nt === "over") return H("Return the excess first: the listening wallet holds more than 1 STX.");
    if (nt !== "ready" || !Mt) return H("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return H("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!C) return H("Pay-per-play is running in another tab. Like from that tab.");
    const ut = x().find((we) => we.kind === "like" && we.song === S.song);
    if (ut && Hd.includes(ut.status))
      return H(`Your last like for ${E} is still on its way. It can change again once it confirms.`);
    if (f) return H("One like at a time: your last one is still being sent.");
    if ((ut == null ? void 0 : ut.status) === "confirmed" && t.now() - (ut.confirmedAt ?? 0) < c5)
      return H(`Your like for ${E} has only just confirmed. Try again in a moment.`);
    let Et;
    l = !0;
    try {
      Et = t.likeState ? (await t.likeState(Mt, S.song)).by : S.likedBy ?? [];
    } catch {
      Et = S.likedBy;
    } finally {
      l = !1;
    }
    if (!Et) return H(`Could not check ${E} right now. Try the heart again.`);
    const wn = i.address, bn = ((ut == null ? void 0 : ut.status) === "confirmed" && typeof ut.liked == "boolean" && t.now() - (ut.confirmedAt ?? ut.created) < 5 * 6e4 ? ut.liked : void 0) ?? Et.includes(wn);
    if (!bn && Et.some((we) => we !== wn)) return H(Wt() ? `${E} was liked from another wallet of yours. Unlike it there.` : `${E} was liked from your main wallet${Et.includes(W) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Xe({ song: S.song, liked: !bn, title: S.title, artist: S.artist });
  }
  async function Xe(S) {
    var nt, W, Mt;
    if (f) {
      $("Still sending your last like. Try again in a moment.");
      return;
    }
    f = !0;
    const E = S.title ? `“${S.title}”${S.artist ? ` by ${S.artist}` : ""}` : `song #${S.song}`, H = t.wait ?? ((ut) => new Promise((Et) => setTimeout(Et, ut)));
    try {
      $(`${S.liked ? "Liking" : "Unliking"} ${E}…`);
      const ut = t.now() + 12e4;
      for (; u || q().length; ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await H(5e3), await Xt(!0);
      }
      if (Bt() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Et = i.address, { balance: wn, nonce: Ye } = await t.chain.account(Et);
      o = wn, a = t.now();
      const bn = await s.request("listening.signLike", {
        song: S.song,
        liked: S.liked,
        fee: Ud.toString(),
        nonce: Ye.toString(),
        balance: wn.toString()
      }), we = {
        id: Pd(),
        address: Et,
        kind: "like",
        core: 0,
        song: S.song,
        liked: S.liked,
        recipient: "",
        amount: "0",
        fee: Ud.toString(),
        nonce: Ye.toString(),
        created: t.now(),
        status: "signed",
        raw: bn.raw,
        txid: bn.txid,
        ...S.title ? { title: String(S.title).slice(0, 120) } : {},
        ...S.artist ? { artist: String(S.artist).slice(0, 120) } : {}
      };
      t.validate(we), M(we);
      try {
        await t.chain.broadcast(bn.raw, bn.txid), M({ ...we, status: "pending" }), g = `${S.liked ? "♥ Liked" : "Unliked"} ${E}`, w = "";
        try {
          (nt = t.likeSent) == null || nt.call(t, S.song, S.liked);
        } catch {
        }
      } catch (Ze) {
        if (M({ ...we, status: ls(Ze) ? "failed" : "unknown", note: Ze.message, ...ls(Ze) ? { raw: void 0 } : {} }), w = Ze.message, ls(Ze)) try {
          (W = t.likeFailed) == null || W.call(t, S.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (ut) {
      w = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (Mt = t.likeFailed) == null || Mt.call(t, S.song);
      } catch {
      }
    } finally {
      f = !1, t.changed(), Pe();
    }
  }
  return { snapshot: d, refresh: Xt, onListened: yn, heart: _n, toggleLike: We, ...Tt };
}
const Sg = ["Connect", "Passkey", "Link & fund", "Listen"], Eg = ["Passkey", "Add 1 STX", "Listen"], Qc = (t) => t ? Eg : Sg;
function u5(t) {
  if (t.solo) return f5(t);
  const e = Sg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function f5(t) {
  const e = Eg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function d5(t, e) {
  return !e || e.at >= Qc(!!t.solo).length || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const h5 = 100000n, p5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function g5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Fo(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= h5).sort(p5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const oo = 50;
function Od(t) {
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
async function y5(t, e, n = 4) {
  if (!Fo(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${oo}&offset=${o}`, s = Od(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - oo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= oo ? s : Od(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = g5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - oo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const w5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function b5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !w5(r.id)));
}
const x5 = {}, m5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, S5 = (t) => {
  const e = x5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, E5 = (t) => `/hiro/${t}`, A5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, $5 = (t) => {
  const e = S5(t);
  if (e)
    return [A5(e)];
  const n = m5[t];
  return typeof window < "u" ? [`${window.location.origin}${E5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, v5 = {}, Dd = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, I5 = "xtrata.log.enabled", L5 = "xtrata.log.level", C5 = "xtrata.log.tags", k5 = "xtrata.log.dedupe", ao = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, B5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, T5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, M5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, _5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, U5 = () => {
  const t = v5 ?? {}, e = ao(I5) ?? t.VITE_LOG_ENABLED, n = ao(L5) ?? t.VITE_LOG_LEVEL, r = ao(C5) ?? t.VITE_LOG_TAGS, s = ao(k5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: B5(e),
    level: T5(n) ?? "warn",
    tags: _5(r),
    dedupe: M5(s)
  };
}, N5 = (t, e, n) => !t.enabled || Dd[n] < Dd[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), H5 = (t, e, n, r) => {
  const s = U5();
  if (!N5(s, e, t) || O5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, P5 = /* @__PURE__ */ new Set();
let jd = null;
const O5 = (t, e, n, r, s) => (jd !== t && (P5.clear(), jd = t), !1), D5 = (t, e, n) => H5("debug", t, e, n), j5 = {}, F5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, z5 = (t) => {
  const e = j5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : F5[t];
}, R5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, G5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return R5.test(n) ? n : null;
}, K5 = (t) => t.replace(/\/+$/, ""), V5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Fd = (t) => {
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
}, us = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, q5 = (t) => {
  var c, u;
  let e;
  try {
    e = In(Y8(t));
  } catch {
    return null;
  }
  const n = us(e);
  if (!n || n.success === !1)
    return null;
  const r = us(n.value), s = us(r == null ? void 0 : r.value), i = us(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Fd((c = us(i.name)) == null ? void 0 : c.value), a = Fd((u = us(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : G5(`${o}.${a}`);
}, W5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${K5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [ng(Dp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : q5(i.result);
}, X5 = async (t) => {
  const e = t.address.trim();
  if (!ms(e))
    return null;
  const n = z5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of $5(t.network))
    try {
      return await W5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return D5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: V5(r)
  }), null;
}, zd = Object.freeze({
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
function Y5(t, e = "") {
  return Object.hasOwn(zd, String(t)) ? zd[String(t)] : e;
}
const Rd = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function Z5(t, e = "") {
  return Object.hasOwn(Rd, String(t)) ? Rd[String(t)] : e;
}
const Q5 = 100000n, J5 = 1000000n, t$ = 3000n, e$ = (t, e) => `${t}#gift=${e}`, n$ = 100, Gd = (t, e = ya) => t <= Ds ? 0 : Number((t - Ds) / js(e)), Kd = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), r$ = "xtrata.xyz/radio/gifts", s$ = "Create Xtrata radio gift links paid from the gift treasury", i$ = (t) => ({
  domain: yi({ name: ze(r$), version: ze("1"), "chain-id": ar(1) }),
  message: yi({
    purpose: ze(s$),
    admin: ze(t.admin),
    count: ar(t.count),
    amount: ar(BigInt(t.amount)),
    label: ze(t.label),
    issued: ar(t.issued)
  })
}), fs = "xtrata.radio.gift.incoming.v1", Vd = (t) => "xtrata.radio.gift.mine.v1:" + t, bt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ds = (t, e, n = "") => {
  const r = bt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, hs = (t) => $n(t).replace(/\.?0+$/, "");
function o$(t) {
  let e = null;
  const n = (() => {
    try {
      const x = new URL(location.href), M = new URLSearchParams(x.hash.slice(1)).get("gift") ?? x.searchParams.get("gift");
      return M !== null && (x.searchParams.delete("gift"), history.replaceState(null, "", x.pathname + (x.search || ""))), Kd(M) ? M : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const x = JSON.parse(t.store.get(fs) || "null");
      return Kd(x == null ? void 0 : x.code) ? x.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(fs, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (x) => {
    const M = await x.json().catch(() => ({}));
    if (!x.ok)
      throw x.status === 404 && t.store.set(fs, null), new Error((M == null ? void 0 : M.error) || "Could not check your gift right now. Reload to try again.");
    const G = M;
    e = { ...e, view: G }, ["claimed", "expired", "refunding", "refunded"].includes(G.status) && t.store.set(fs, null), t.changed();
  }).catch((x) => {
    e = { ...e, error: x.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = (x) => x.from ? t.who(x.from) : x.label ? `Xtrata Radio · ${x.label}` : "Xtrata Radio";
  let a = {};
  const c = (x) => {
    if (a.box) return a.box;
    const M = bt("div", "", "ppp-gift-check");
    a.box = M;
    const G = () => {
      const K = window.turnstile;
      !K || a.rendered || (a.rendered = !0, K.render(M, { sitekey: x, callback: (q) => {
        a.token = q, t.changed();
      }, "expired-callback": () => {
        a.token = void 0;
      } }));
    };
    if (window.turnstile) G();
    else {
      const K = document.createElement("script");
      K.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", K.async = !0, K.onload = G, document.head.append(K);
    }
    return M;
  };
  let u;
  async function f(x) {
    var M, G;
    if (!(!e || e.claiming || !x.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const K = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: x.listening, turnstile: a.token })
        }), q = await K.json().catch(() => ({}));
        if (K.status === 503 && /sending another gift/.test((q == null ? void 0 : q.error) || "")) {
          e.waiting = !0, clearTimeout(u), u = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!K.ok)
          throw (K.status === 404 || K.status === 410 || K.status === 409 && /already had a gift|brand-new/.test((q == null ? void 0 : q.error) || "")) && t.store.set(fs, null), new Error((q == null ? void 0 : q.error) || `Could not claim the gift (${K.status}).`);
        e.done = !0, t.store.set(fs, null), t.giftSent(q.txid, BigInt(q.amount));
      } catch (K) {
        e.error = K.message, a.token = void 0;
        try {
          (G = (M = window.turnstile) == null ? void 0 : M.reset) == null || G.call(M, a.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  function l(x) {
    var fe, Ue;
    if (!e || ["off", "elsewhere"].includes(x.step)) return [];
    const M = e.view;
    if (e.error && !M) return [bt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!M) return [bt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return [];
    if (M.status === "claimed" || M.status === "claiming") return [bt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(M.status)) return [bt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (M.status === "pending-deposit") return [bt("p", `🎁 ${o(M)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    const G = BigInt(M.amount), q = [bt("p", `🎁 ${o(M)} sent you ${hs(G)} STX of on-chain music: about ${Gd(G).toLocaleString()} paid plays.`, "ppp-gift")], $t = !!x.listening && x.step === "fund" && (x.balance ?? 1n) === 0n && !x.depositPending && !x.entries.length, jt = (Ue = (fe = x.gate) == null ? void 0 : fe.gifts) == null ? void 0 : Ue.turnstileSiteKey;
    return $t ? (jt && !a.token ? q.push(bt("p", "One quick check and it is yours:", "ppp-mute"), c(jt)) : !e.claiming && !e.error && !e.waiting && f(x), (e.claiming || e.waiting) && q.push(bt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && q.push(bt("p", e.error, "ppp-bad"), ds("Try again", () => {
      e.error = void 0, f(x);
    }))) : x.step === "intro" ? q.push(bt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : x.listening && (x.balance ?? 0n) > 0n && q.push(bt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute")), q;
  }
  async function y(x, M, G) {
    var K;
    try {
      const q = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(x));
      if ((K = q == null ? void 0 : q.gift) != null && K.returnTo) return { ok: !0, funder: q.gift.returnTo, txId: q.gift.txid ?? void 0, amount: q.gift.amount, distinct: 1 };
    } catch {
      if (G) return { ok: !1 };
    }
    return M();
  }
  const h = bt("div", "", "ppp-gift-fold");
  let g = 250000n, w = "", I = "", _ = null;
  const U = (x) => {
    try {
      const M = JSON.parse(t.store.get(Vd(x)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, b = (x, M) => t.store.set(Vd(x), JSON.stringify(M.slice(0, 50)));
  let k = 0;
  async function L(x) {
    const M = U(x);
    for (const G of M)
      if (!(G.view && ["claimed", "refunded", "expired"].includes(G.view.status)))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: G.id, ...G.txid ? { txid: G.txid } : {} }) }) : await t.json("/radio/gift?id=" + G.id), G.error = void 0;
        } catch (K) {
          G.error = K.message;
        }
    b(x, M), t.changed();
  }
  async function O(x) {
    if (w) return;
    w = "Starting your gift…", I = "", t.changed();
    let M = null;
    try {
      M = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: x, amount: g.toString() }) });
      const G = U(x);
      G.unshift({ id: M.id, code: M.code, amount: g.toString(), at: t.now() }), b(x, G), w = "Approve the gift in your wallet…", t.changed();
      const K = await t.pay(x, M.depositTo, BigInt(M.deposit), M.memo), q = U(x), $t = q.find((jt) => jt.id === M.id);
      $t && ($t.txid = K, $t.view = { status: "pending-deposit", amount: g.toString(), source: "friend", from: x, label: "", expires: 0 }), b(x, q), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", L(x);
    } catch (G) {
      I = G.message || "Not sent.";
    } finally {
      w = "", t.changed();
    }
  }
  async function V(x, M, G, K) {
    if (!w) {
      w = "Sign in your wallet…", I = "", _ = null, t.changed();
      try {
        const q = { admin: x, count: M, amount: G.toString(), label: K, issued: t.now() }, $t = await t.sign(x, i$(q));
        w = "Making links…", t.changed();
        const jt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: q, signature: $t }) });
        _ = { codes: jt.codes, amount: jt.amount };
      } catch (q) {
        I = q.message || "Not made.";
      } finally {
        w = "", t.changed();
      }
    }
  }
  const D = (x, M) => e$(x || location.origin + "/radio.html", M), j = (x) => {
    var M;
    return void ((M = navigator.clipboard) == null ? void 0 : M.writeText(x));
  }, m = (x) => navigator.share ? navigator.share({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: x }).catch(() => {
  }) : j(x), C = bt("input");
  C.type = "range", C.min = String(Q5), C.max = String(J5), C.step = "50000", C.value = String(g), C.setAttribute("aria-label", "Gift amount");
  const P = bt("p", "", "ppp-gift-amount"), X = ds("", () => {
    const x = t.main();
    x && O(x);
  }, "primary"), tt = () => {
    P.textContent = z(), X.textContent = `Gift ${hs(g)} STX`;
  };
  C.oninput = () => {
    g = BigInt(C.value), tt();
  };
  const z = () => `${hs(g)} STX · about ${Gd(g).toLocaleString()} paid plays · you pay ${hs(g + t$)} STX with the network fee`;
  tt();
  const xt = bt("input");
  xt.type = "number", xt.min = "1", xt.max = String(n$), xt.value = "10", xt.setAttribute("aria-label", "How many links");
  const Ct = bt("input");
  Ct.type = "number", Ct.min = "0.1", Ct.max = "1", Ct.step = "0.05", Ct.value = "0.1", Ct.setAttribute("aria-label", "STX per link");
  const Dt = bt("input");
  Dt.maxLength = 40, Dt.placeholder = "Label, e.g. Launch week", Dt.setAttribute("aria-label", "Campaign label");
  function A(x) {
    var q, $t, jt, fe, Ue;
    const M = (q = x.gate) == null ? void 0 : q.gifts;
    if (!(M != null && M.enabled) || ["off", "elsewhere", "unsupported"].includes(x.step)) return null;
    const G = t.main(), K = [bt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!G)
      K.push(bt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      X.disabled = !!w, K.push(C, P, X), t.now() - k > 3e4 && (k = t.now(), L(G));
      const Wt = U(G);
      if (Wt.length) {
        const Ie = bt("ul", "", "ppp-gift-list");
        for (const _t of Wt.slice(0, 10)) {
          const Gt = ($t = _t.view) == null ? void 0 : $t.status, Qt = _t.error ? _t.error : !Gt || Gt === "pending-deposit" ? _t.txid ? "payment confirming…" : "waiting for your payment" : Gt === "live" ? "ready to share" : Gt === "claiming" || Gt === "claimed" ? "claimed ✓" : Gt === "refunding" ? "expired · refund on its way" : Gt === "refunded" ? "expired · refunded to you" : Gt, Bt = bt("li");
          if (Bt.append(bt("span", `${hs(BigInt(_t.amount))} STX`, "t"), bt("span", Qt, ((jt = _t.view) == null ? void 0 : jt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((fe = _t.view) == null ? void 0 : fe.status) === "live") {
            const d = D(((Ue = x.gate) == null ? void 0 : Ue.radioUrl) ?? null, _t.code);
            Bt.append(ds("Copy link", () => j(d), "tiny"), ds("Share", () => m(d), "tiny"));
          }
          Ie.append(Bt);
        }
        K.push(Ie);
      }
      if (M.admin) {
        const Ie = ds("Sign and make links", () => {
          const Qt = BigInt(Math.round(Number(Ct.value) * 1e6));
          V(G, Number(xt.value), Qt, Dt.value.trim());
        }), _t = bt("div", "", "ppp-gift-admin"), Gt = (Qt, Bt) => {
          const d = bt("label", Qt);
          return d.append(Bt), d;
        };
        if (_t.append(bt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"), Gt("Links ", xt), Gt("STX each ", Ct), Dt, Ie), _) {
          const Qt = _.codes.map((d) => {
            var $;
            return D((($ = x.gate) == null ? void 0 : $.radioUrl) ?? null, d);
          }).join(`
`), Bt = bt("textarea");
          Bt.readOnly = !0, Bt.value = Qt, Bt.rows = Math.min(8, _.codes.length), _t.append(bt("p", `${_.codes.length} links, ${hs(BigInt(_.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Bt, ds("Copy all", () => j(Qt), "tiny"));
        }
        K.push(_t);
      }
    }
    return w && K.push(bt("p", w, "ppp-cyan")), I && K.push(bt("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), h.replaceChildren(...K), h;
  }
  return { banner: l, funder: y, renderFold: A, liveGift: i };
}
const qd = document.getElementById("ppp");
qd && a$(qd);
function a$(t) {
  var Bt;
  const e = jy(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let s = null;
  const i = async (d, $) => {
    const T = await fetch(d, { cache: "no-store", ...$, signal: AbortSignal.timeout(15e3) }), Y = await T.json().catch(() => ({}));
    if (!T.ok) throw new Error((Y == null ? void 0 : Y.error) || `Request failed (${T.status}).`);
    return Y;
  }, o = l5({
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
      const $ = new Promise((mt, re) => {
        s.addEventListener("load", () => mt(), { once: !0 }), setTimeout(() => re(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = d + "/", r.replaceChildren(s), await $;
      const T = new Ty({ walletOrigin: d, frame: s, timeoutMs: 30 * 6e4 }), Y = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), dt = (mt, re) => Y.has(mt) ? T.request(mt, re) : Promise.race([
        T.request(mt, re),
        new Promise((Jt, qe) => setTimeout(() => qe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await dt("listening.status"), { request: dt };
    },
    chain: {
      verify: Z6,
      balance: J6,
      account: Q6,
      owner: t5,
      broadcast: e5,
      transaction: n5,
      confirmedNonce: async (d) => {
        const $ = await Vr(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger($ == null ? void 0 : $.nonce) || $.nonce < 0) throw new Error("Malformed account data.");
        return BigInt($.nonce);
      }
    },
    signWithMain: (d, $) => Md({ ...$, network: "mainnet", stxAddress: d }),
    deposit: (d, $, T) => new Promise((Y, dt) => Ld({
      recipient: $,
      amount: T.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new qa(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (mt) => Y(mt.txId || ""),
      onCancel: () => dt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: dt
    })),
    validate: r5,
    tabLock: (d) => new Promise(($) => {
      const T = navigator.locks;
      if (!(T != null && T.request)) {
        $(!0);
        return;
      }
      T.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (Y) => {
        $(!!Y), Y && await new Promise(() => {
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
    changed: () => _t(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var $, T;
      return a.funder(d, () => y5(d, Vr), !!((T = ($ = o.snapshot().gate) == null ? void 0 : $.gifts) != null && T.enabled));
    },
    likesChanged: () => {
      var d, $;
      ($ = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || $.call(d);
    },
    likeState: async (d, $) => {
      const T = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String($) })), Y = Array.isArray(T == null ? void 0 : T.rows) ? T.rows.find((dt) => (dt == null ? void 0 : dt.id) === $) : null;
      if (!Y || typeof Y.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: Y.liked, by: Array.isArray(Y.by) ? Y.by.filter((dt) => typeof dt == "string") : Y.liked ? [d] : [] };
    },
    likeSent: (d, $) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: $ } })),
    likeConfirmed: (d, $) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: $ } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = o$({
    json: i,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, $, T, Y) => new Promise((dt, mt) => Ld({
      recipient: $,
      amount: T.toString(),
      memo: Y,
      stxAddress: d,
      network: new qa(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (re) => dt(re.txId || ""),
      onCancel: () => mt(new Error("Gift cancelled. Nothing was sent.")),
      onError: mt
    })),
    sign: (d, $) => Md({ ...$, network: "mainnet", stxAddress: d }),
    giftSent: (d, $) => o.giftSent(d, $),
    who: (d) => L(d),
    changed: () => _t(o.snapshot()),
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
          $ === null ? localStorage.removeItem(d) : localStorage.setItem(d, $);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    j();
    const $ = m(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: $.title || void 0, artist: $.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const u = (d) => {
    var T, Y;
    const $ = window.XtrataRadioListeningIdentity();
    $ !== c && (c = $, (Y = (T = window.XtrataRadio) == null ? void 0 : T.refreshLikes) == null || Y.call(T));
  }, f = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", l = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), y = (d) => {
    const $ = Math.round((Date.now() - d) / 6e4);
    return $ < 1 ? "now" : $ < 60 ? `${$}m` : $ < 1440 ? `${Math.round($ / 60)}h` : `${Math.round($ / 1440)}d`;
  }, h = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, g = (d, $ = "", T = "") => {
    const Y = document.createElement(d);
    return $ && (Y.textContent = $), T && (Y.className = T), Y;
  }, w = (d, $, T = "") => {
    const Y = g("button", d, T);
    return Y.type = "button", Y.onclick = $, Y;
  }, I = (d, $) => {
    const T = g("a", d);
    return T.href = $, T.target = "_blank", T.rel = "noopener", T;
  };
  let _ = null, U = !1;
  const b = /* @__PURE__ */ new Map(), k = (d) => d ? (b.has(d) || (b.set(d, null), X5({ address: d, network: "mainnet" }).then(($) => {
    $ && (b.set(d, $), _t(o.snapshot()));
  }).catch(() => {
  })), b.get(d) ?? null) : null, L = (d) => {
    const $ = k(d);
    return $ ? `${$} · ${f(d)}` : f(d);
  }, O = /* @__PURE__ */ new Map();
  let V = !1;
  const D = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), j = () => {
    V || (V = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const $ of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const T = Number($ == null ? void 0 : $.id);
        Number.isSafeInteger(T) && O.set(T, { title: typeof $.title == "string" ? $.title : void 0, artist: typeof $.artist == "string" ? $.artist : void 0 });
      }
      _t(o.snapshot());
    }).catch(() => {
      V = !1;
    }));
  }, m = (d, $) => {
    const T = O.get(d), Y = Z5(d, [T == null ? void 0 : T.title, $ == null ? void 0 : $.title].find((mt) => !D(mt)) || ""), dt = Y5(d, (T == null ? void 0 : T.artist) || ($ == null ? void 0 : $.artist) || "");
    return { title: Y, artist: dt };
  }, C = (d) => {
    const { title: $, artist: T } = m(d.song, d);
    return $ ? `“${$}”${T ? ` — ${T}` : ""}` : `Song #${d.song}${T ? ` — ${T}` : ""}`;
  }, P = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, X = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function tt(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function z(d, $, T = "", Y) {
    const dt = g("dt", d), mt = g("dd", $, T);
    return Y && mt.append(" ", Y), [dt, mt];
  }
  const xt = document.getElementById("ppp-top"), Ct = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Dt = () => {
    var $, T;
    const d = o.snapshot();
    if (d.step === "connect") {
      ($ = document.getElementById("radio-wallet-connect")) == null || $.click();
      return;
    }
    if (d.step === "elsewhere" && ((T = d.gate) != null && T.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), Ct();
  };
  xt && (xt.onclick = Dt);
  function A(d) {
    if (!xt) return;
    const $ = (Y, dt, mt) => {
      xt.hidden = !1, xt.className = "ppp-top" + (dt ? " is-" + dt : ""), xt.replaceChildren(g("span", "", "dot"), document.createTextNode(Y)), xt.title = mt;
    }, T = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        xt.hidden = !0;
        return;
      case "elsewhere":
        return $("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        xt.hidden = !0;
        return;
      case "intro":
        return $("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "locked":
        return $(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return $("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? $("Funds on their way", "quiet", "Paying starts by itself when they land") : $(d.entries.some((Y) => Y.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return $("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return $("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && T > 0 ? $(`On · ${T.toLocaleString()} plays left`, "on", "Paying artists as you listen") : $("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const x = document.getElementById("pppNudge"), M = document.getElementById("onair");
  (Bt = x == null ? void 0 : x.querySelector("button")) == null || Bt.addEventListener("click", () => Dt());
  const G = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, K = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function q(d) {
    var mt;
    if (d.step === "loading") return;
    const $ = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, T = d.step === "ready" && d.payingOn && $ > 0, Y = T ? "" : G[d.step] ?? "", dt = T ? "on" : Y ? "off" : "";
    if (dt ? document.documentElement.dataset.ppp = dt : delete document.documentElement.dataset.ppp, M && (M.hidden = !dt, M.querySelector(".onair-sub").textContent = T ? `Paying artists · ${$.toLocaleString()} plays left` : "Not paying"), x && (x.hidden = dt !== "off" || d.step === "fund" && d.depositPending, dt === "off")) {
      const re = Math.floor(Number(1000000n / js(BigInt(((mt = d.gate) == null ? void 0 : mt.limits.playFee) ?? "300"))));
      x.querySelector(".nudge-t").textContent = "⚠ " + Y, x.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${re.toLocaleString()} plays, on-chain, straight to the artists.`, x.querySelector("button").textContent = K[d.step] ?? "Start paying";
    }
  }
  let $t = "";
  function jt(d) {
    const $ = g("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && $.append(g("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && $.append(g("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const T = g("input");
    T.type = "text", T.placeholder = "SP… address to send returns to", T.autocomplete = "off", T.spellcheck = !1, T.setAttribute("aria-label", "Address to return funds to"), T.value = $t, T.oninput = () => {
      $t = T.value;
    };
    const Y = w(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(T.value), $t = "";
    }, "tiny");
    return $.append(T, " ", Y), d.returnToKind === "chosen" && $.append(" ", w("Back to the funder", () => o.clearReturnAddress(), "tiny")), $;
  }
  const fe = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ue() {
    const d = g("p", fe + " ", "ppp-mute");
    return d.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), d;
  }
  let Wt = "";
  const Ie = (d) => {
    const $ = document.documentElement, T = d.solo && !d.main ? d.listening ? f(d.listening) : "new" : "", Y = b5() ? "1" : "";
    `${T}|${Y}` !== Wt && (Wt = `${T}|${Y}`, T ? $.dataset.pppSolo = T : delete $.dataset.pppSolo, Y ? $.dataset.pppWalletInstalled = Y : delete $.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => _t(o.snapshot()), d);
  function _t(d) {
    var _n, We, Xe, S;
    if (u(), Ie(d), A(d), q(d), t.hidden = d.step === "off", t.hidden) return;
    const [$, T] = tt(d), Y = n(".ppp-state");
    Y.textContent = $, Y.className = "ppp-state" + (T ? " ppp-state--" + T : ""), Y.hidden = !$;
    const dt = !!d.busy || d.armed, mt = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(d.step) && (dt || !["intro", "loading"].includes(d.step));
    r.hidden = !mt, r.classList.toggle("ppp-frame--rest", !dt && !U);
    const re = n(".ppp-frame-label");
    re.hidden = !0;
    const Jt = u5(d) ?? _;
    _ = Jt;
    const qe = d5(d, Jt);
    n(".ppp-badge").hidden = !qe;
    const Xt = n(".ppp-steps"), Ne = n(".ppp-stage");
    Xt.hidden = Ne.hidden = !qe, Jt && qe && (Xt.replaceChildren(...Qc(d.solo).map((E, H) => {
      const nt = g("li", "", H < Jt.at ? "done" : H === Jt.at ? Jt.blocked ? "now blocked" : "now" : "");
      return nt.append(g("span", H < Jt.at ? "✓" : String(H + 1), "n"), E), H === Jt.at && nt.setAttribute("aria-current", "step"), nt;
    })), Ne.textContent = Jt.caption, Ne.className = "ppp-stage " + (Jt.at >= Qc(d.solo).length ? "ppp-ok" : Jt.blocked ? "ppp-bad" : "ppp-cyan"));
    const pr = n(".ppp-facts"), te = [];
    if (d.main && ((_n = d.gate) != null && _n.here) && !d.solo && te.push(...z("Your wallet", L(d.main), "ppp-addr-short")), d.listening) {
      const E = w("Copy", () => {
        var H;
        return void ((H = navigator.clipboard) == null ? void 0 : H.writeText(d.listening || ""));
      }, "tiny");
      te.push(...z("Listening wallet", f(d.listening), "ppp-addr-short", E));
    }
    if (d.listening && d.step !== "intro")
      if (d.linked) te.push(...z("Linked to", `${L(d.linked)} · returns go here`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn"));
      else if (d.solo) {
        const E = d.returnTo ? `${f(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        te.push(...z("Returns go to", d.returnTo ? E.replace(f(d.returnTo), d.returnTo) : E, d.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else te.push(...z("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((We = d.gate) != null && We.here)) {
      const E = d.linkedListening.map((H) => f(H) + (H === d.listening ? " (this one)" : "")).join(", ");
      te.push(...z(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", E, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const E = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      te.push(...z("Balance", `${$n(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, E));
    }
    const Le = d.entries.find((E) => E.kind === "play");
    Le && j(), Le && te.push(...z("Last paid song", `${C(Le)} → ${f(Le.recipient)}`, P[Le.status] || "")), pr.replaceChildren(...te), pr.hidden = !te.length;
    const ht = [], Tt = [], gt = [], He = [], gr = js(BigInt(((Xe = d.gate) == null ? void 0 : Xe.limits.playFee) ?? "300")), pn = `Each song you listen to for 30 seconds sends ${$n(Xc)} STX to whoever holds it, plus a ${$n(gr - Xc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, yr = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (ht.push(g("p", "Pay artists as you listen.")), (S = d.gate) != null && S.radioUrl) {
          const E = g("p");
          E.append(I("Open the pay-per-play radio →", d.gate.radioUrl)), ht.push(E);
        }
        Tt.push(g("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        d.linked ? (ht.push(g("p", `This device's listening wallet is linked to ${L(d.linked)}. Connect that wallet to keep paying artists.`)), Tt.push(g("p", "Your plays, likes and any funds returned stay with that wallet. Listening is always free."))) : (ht.push(g("p", "Connect your wallet to pay artists as you listen.")), Tt.push(g("p", "Every payment is recorded on-chain. Listening is always free.")));
        break;
      case "not-invited":
        ht.push(g("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(g("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(g("p", `Pay artists ${$n(gr)} STX a song as you listen.`)), Tt.push(g("p", pn)), Tt.push(g("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Tt.push(g("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), d.solo && Tt.push(g("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute")), gt.push(w(a.liveGift() ? "Claim my gift · no wallet needed" : d.solo ? "Turn on pay-per-play · no wallet needed" : "Turn on pay-per-play", () => void o.create(), "primary")), d.solo && !a.liveGift() && gt.push(w("I have a Stacks wallet", () => {
          var E;
          return (E = document.getElementById("radio-wallet-connect")) == null ? void 0 : E.click();
        })), a.liveGift() || gt.push(w("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        d.armed || (ht.push(g("p", "Locked.", "ppp-mute")), gt.push(w(d.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), He.push(w("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(g("p", `Link to ${L(d.main)} · free`)), Tt.push(g("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Tt.push(g("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), gt.push(w(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ht.push(g("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending || (d.entries.length ? ht.push(g("p", "Out of funds · top up to keep paying", "ppp-bad")) : ht.push(g("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / gr)).toLocaleString()} songs`))), d.entries.length && Tt.push(g("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), d.payingOn && !d.entries.length && Tt.push(g("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), d.solo ? (Tt.push(g("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Tt.push(g("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && gt.push(w("Copy my address", () => {
          var E;
          return void ((E = navigator.clipboard) == null ? void 0 : E.writeText(d.listening || ""));
        }, "primary"))) : Tt.push(g("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const E = g("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          E.append(I("View", h(d.depositTxid))), ht.push(E);
        } else d.allowance > 0n && !d.solo && gt.push(w(`Deposit ${$n(d.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(g("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (ht.push(g("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(jt(d))), (!d.solo || d.returnTo) && gt.push(w("Return excess", () => void o.returnFunds("excess"), "primary"), w("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0) {
          const E = Math.min(d.session.playsLeft, d.playsLeft);
          ht.push(g("p", `Paying as you listen · up to ${E.toLocaleString()} plays left`, "ppp-ok")), Tt.push(g("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), gt.push(w("Switch off", () => void o.switchOff()));
        } else
          ht.push(g("p", "Paying is off. Music stays free.", "ppp-mute")), gt.push(w("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        d.queued && ht.push(g("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && ht.push(g("p", "Running low · top up", "ppp-warn")), d.depositPending ? ht.push(g("p", "Top-up on its way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && gt.push(w(`Top up ${$n(d.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (d.solo && d.walletCannotSolo && Tt.push(g("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && Tt.push(jt(d)), Tt.push(Ue()), d.step === "ready" && d.entries.some((E) => E.kind === "play" && E.status === "confirmed"))) {
      const E = g("p", "New to Stacks? ", "ppp-mute");
      E.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(E);
    }
    if (d.walletOutdated && Tt.push(g("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (ht.push(g("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), gt.push(w("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(d.step) && d.returnTo && (d.balance ?? 0n) > 0n && He.push(w(d.linked ? "Return all to my wallet" : `Return all to ${f(d.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && He.push(w("Lock", () => void o.lock(), "quiet")), mt && !dt && He.push(w(U ? "Hide listening wallet box" : "Show listening wallet box", () => {
      U = !U, _t(o.snapshot());
    }, "quiet")), [...gt, ...He].forEach((E) => E.disabled = yr), yr && (gt.length = 0), d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n)) {
      const E = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", H = ht.at(0);
      d.step === "ready" && H ? H.append(g("span", ` · ${l(d.balance)} STX`, E)) : ht.push(g("p", `Balance ${l(d.balance)} STX`, E));
    }
    ht.unshift(...a.banner(d)), n(".ppp-key").replaceChildren(...ht);
    const gn = a.renderFold(d);
    n(".ppp-gifts").hidden = !gn, gn && !n(".ppp-gift-body").contains(gn) && n(".ppp-gift-body").replaceChildren(gn), n(".ppp-body").replaceChildren(...Tt), n(".ppp-actions").replaceChildren(...gt), n(".ppp-actions2").replaceChildren(...He);
    const yn = d.busy || d.message || "";
    n(".ppp-msg").textContent = yn && ht.some((E) => (E.textContent ?? "").startsWith(yn.replace(/[.✓\s]+$/, ""))) ? "" : yn, n(".ppp-err").textContent = d.error;
    const Pe = d.entries.filter((E) => E.kind === "play");
    n(".ppp-recent").hidden = !d.entries.length, n(".ppp-recent-list").replaceChildren(...Pe.slice(0, 5).map((E) => {
      const H = g("li"), nt = E.status === "confirmed" ? "ok" : E.status === "failed" ? "bad" : "warn";
      return H.append(g("span", "", "d " + nt), g("span", C(E), "t"), g("span", y(E.created), "ppp-mute")), E.txid && H.append(I("tx", h(E.txid))), H;
    })), n(".ppp-wallets").hidden = !(pr.childElementCount || He.length), n(".ppp-more").hidden = !Tt.length;
    const Mn = n(".ppp-history");
    Mn.hidden = !d.entries.length, d.entries.length && j(), Mn.replaceChildren(g("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((E) => {
      const H = g("div", "", "ppp-row"), nt = E.kind === "play" ? [g("span", C(E), "ppp-song"), g("span", ` · ${$n(BigInt(E.amount))} STX to ${f(E.recipient)}`, "ppp-mute")] : E.kind === "like" ? [g("span", `${E.liked ? "♥ Liked" : "Unliked"} ${C(E)}`, "ppp-song"), g("span", ` · for ${d.linked ? L(d.linked) : "this listening wallet"}`, "ppp-mute")] : [g("span", `Returned ${$n(BigInt(E.amount))} STX`, "ppp-song"), g("span", ` to ${f(E.recipient)}`, "ppp-mute")];
      return H.append(
        g("span", X[E.status] || E.status, "ppp-status " + (P[E.status] || "")),
        ...nt,
        g("span", ` · ${new Date(E.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), E.txid && H.append(I("tx ↗", h(E.txid))), H;
    }));
  }
  const Gt = /* @__PURE__ */ new Map(), Qt = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe(($) => {
      const T = $ == null ? void 0 : $.nowPlaying;
      T && Number.isSafeInteger(Number(T.tokenId)) && Gt.set(Number(T.tokenId), { title: T.title || void 0, artist: T.artist || void 0 });
    }), !0) : !1;
  };
  if (!Qt()) {
    const d = setInterval(() => {
      Qt() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const $ = d.detail;
    if ($ && Number.isSafeInteger($.song) && typeof $.id == "string" && /^[0-9a-f]{32}$/.test($.id)) {
      j();
      const T = m($.song, Gt.get($.song));
      o.onListened({ song: $.song, id: $.id, title: T.title || void 0, artist: T.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const c$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", l$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, u$ = () => l$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, f$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, d$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ag = class {
  constructor(t) {
    fE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Tx(t), this.callback(ea(t));
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
    var r, s, i, o, a, c, u, f, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = u$(), e = f$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return et("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, et("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), et("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, et("div", { class: "flex flex-col space-y-[10px]" }, et("div", { class: "flex items-center" }, et("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), et("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, et("span", { class: "sr-only" }, "Close popup"), et("img", { src: c$ }))), r ? et("p", null, "Select the wallet you want to connect to.") : et("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && et("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && et("div", { class: "mt-6" }, et("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), et("ul", { class: "space-y-3" }, this.installedProviders.map((i) => et("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, et("div", { class: "aspect-square basis-9 overflow-hidden" }, et("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), et("div", { class: "flex-1" }, et("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && et("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), et("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && et("div", { class: "mt-6" }, r ? et("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : et("div", { class: "mb-5 flex justify-between" }, et("p", { class: "text-sm font-medium" }, "Recommended wallets"), et("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, et("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, et("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), et("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), et("p", null, "What is a wallet? ", et("span", { class: "align-text-bottom text-[9px]" }, "↗")))), et("ul", { class: "space-y-3" }, n.map((i) => et("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, et("div", { class: "aspect-square basis-9 overflow-hidden" }, et("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), et("div", { class: "flex-1" }, et("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && et("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && et("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return V4(this);
  }
};
Ag.style = d$;
const h$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ag
}, Symbol.toStringTag, { value: "Module" }));
