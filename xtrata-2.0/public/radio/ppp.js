var ay = Object.defineProperty;
var cy = (t, e, n) => e in t ? ay(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Gs = (t, e, n) => cy(t, typeof e != "symbol" ? e + "" : e, n);
var ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
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
      typeof ce < "u" && ce || {}, r = {
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
      function d(x) {
        this.map = {}, x instanceof d ? x.forEach(function(L, H) {
          this.append(H, L);
        }, this) : Array.isArray(x) ? x.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(L) {
          this.append(L, x[L]);
        }, this);
      }
      d.prototype.append = function(x, L) {
        x = a(x), L = c(L);
        var H = this.map[x];
        this.map[x] = H ? H + ", " + L : L;
      }, d.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, d.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, d.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, d.prototype.set = function(x, L) {
        this.map[a(x)] = c(L);
      }, d.prototype.forEach = function(x, L) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && x.call(L, this.map[H], H, this);
      }, d.prototype.keys = function() {
        var x = [];
        return this.forEach(function(L, H) {
          x.push(H);
        }), u(x);
      }, d.prototype.values = function() {
        var x = [];
        return this.forEach(function(L) {
          x.push(L);
        }), u(x);
      }, d.prototype.entries = function() {
        var x = [];
        return this.forEach(function(L, H) {
          x.push([H, L]);
        }), u(x);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
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
        var L = new FileReader(), H = g(L), q = /charset=([A-Za-z0-9_-]+)/.exec(x.type), Q = q ? q[1] : "utf-8";
        return L.readAsText(x, Q), H;
      }
      function w(x) {
        for (var L = new Uint8Array(x), H = new Array(L.length), q = 0; q < L.length; q++)
          H[q] = String.fromCharCode(L[q]);
        return H.join("");
      }
      function $(x) {
        if (x.slice)
          return x.slice(0);
        var L = new Uint8Array(x.byteLength);
        return L.set(new Uint8Array(x)), L.buffer;
      }
      function T() {
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
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function b(x) {
        var L = x.toUpperCase();
        return _.indexOf(L) > -1 ? L : x;
      }
      function v(x, L) {
        if (!(this instanceof v))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var H = L.body;
        if (x instanceof v) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, L.headers || (this.headers = new d(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !H && x._bodyInit != null && (H = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new d(L.headers)), this.method = b(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var q = /([?&])_=[^&]*/;
          if (q.test(this.url))
            this.url = this.url.replace(q, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Q = /\?/;
            this.url += (Q.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      v.prototype.clone = function() {
        return new v(this, { body: this._bodyInit });
      };
      function A(x) {
        var L = new FormData();
        return x.trim().split("&").forEach(function(H) {
          if (H) {
            var q = H.split("="), Q = q.shift().replace(/\+/g, " "), R = q.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(Q), decodeURIComponent(R));
          }
        }), L;
      }
      function O(x) {
        var L = new d(), H = x.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(q) {
          return q.indexOf(`
`) === 0 ? q.substr(1, q.length) : q;
        }).forEach(function(q) {
          var Q = q.split(":"), R = Q.shift().trim();
          if (R) {
            var Tt = Q.join(":").trim();
            try {
              L.append(R, Tt);
            } catch (Wt) {
              console.warn("Response " + Wt.message);
            }
          }
        }), L;
      }
      T.call(v.prototype);
      function V(x, L) {
        if (!(this instanceof V))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new d(L.headers), this.url = L.url || "", this._initBody(x);
      }
      T.call(V.prototype), V.prototype.clone = function() {
        return new V(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, V.error = function() {
        var x = new V(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var F = [301, 302, 303, 307, 308];
      V.redirect = function(x, L) {
        if (F.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new V(null, { status: L, headers: { location: x } });
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
      function z(x, L) {
        return new Promise(function(H, q) {
          var Q = new v(x, L);
          if (Q.signal && Q.signal.aborted)
            return q(new e.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function Tt() {
            R.abort();
          }
          R.onload = function() {
            var S = {
              statusText: R.statusText,
              headers: O(R.getAllResponseHeaders() || "")
            };
            Q.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? S.status = 200 : S.status = R.status, S.url = "responseURL" in R ? R.responseURL : S.headers.get("X-Request-URL");
            var B = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              H(new V(B, S));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              q(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              q(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              q(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Wt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (R.open(Q.method, Wt(Q.url), !0), Q.credentials === "include" ? R.withCredentials = !0 : Q.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof d || n.Headers && L.headers instanceof n.Headers)) {
            var Xt = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(S) {
              Xt.push(a(S)), R.setRequestHeader(S, c(L.headers[S]));
            }), Q.headers.forEach(function(S, B) {
              Xt.indexOf(B) === -1 && R.setRequestHeader(B, S);
            });
          } else
            Q.headers.forEach(function(S, B) {
              R.setRequestHeader(B, S);
            });
          Q.signal && (Q.signal.addEventListener("abort", Tt), R.onreadystatechange = function() {
            R.readyState === 4 && Q.signal.removeEventListener("abort", Tt);
          }), R.send(typeof Q._bodyInit > "u" ? null : Q._bodyInit);
        });
      }
      return z.polyfill = !0, n.fetch || (n.fetch = z, n.Headers = d, n.Request = v, n.Response = V), e.Headers = d, e.Request = v, e.Response = V, e.fetch = z, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ce);
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
var ws;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ws || (ws = {}));
var Lr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Lr || (Lr = {}));
var xu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xu || (xu = {}));
const dy = "https://api.mainnet.hiro.so", py = "https://api.testnet.hiro.so", gy = "http://localhost:3999", yy = ["mainnet", "testnet", "devnet", "mocknet"];
let bs = class {
  constructor(e) {
    this.version = Lr.Mainnet, this.chainId = ws.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Lr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
bs.fromName = (t) => {
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
bs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : bs.fromName(t);
let Rh = class extends bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? dy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Lr.Mainnet, this.chainId = ws.Mainnet;
  }
}, wy = class extends bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? py,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Lr.Testnet, this.chainId = ws.Testnet;
  }
}, Gh = class extends bs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Lr.Testnet, this.chainId = ws.Testnet;
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
}, Gr = {
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
Object.freeze(Gr);
class Hs extends Error {
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
class Ny extends Hs {
  constructor(e, n = "") {
    super({ code: Gr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Eu extends Hs {
  constructor(e = "") {
    super({ code: Gr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ki extends Hs {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Gr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Au extends Hs {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Gr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Va extends Hs {
  constructor(e) {
    super({ code: Gr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Wh extends Hs {
  constructor(e) {
    super({ code: Gr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const $u = ["debug", "info", "warn", "error", "none"], Ka = {};
for (let t = 0; t < $u.length; t++) {
  const e = $u[t];
  Ka[e] = t;
}
class us {
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
    us.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = jy(s, t.toString(), n);
    throw us.error(i), new Error(i);
  }
  if (r)
    return {};
}
function lr(t, e) {
  return Qc(ee(t), e);
}
function ee(t) {
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
  if (pe(t, Uint8Array))
    return BigInt(`0x${Y(t)}`);
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
  return (typeof t == "bigint" ? t : ee(t)).toString(16).padStart(e * 2, "0");
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
  return Vy(BigInt(`0x${Y(t)}`), BigInt(t.byteLength * 8));
}
function Vy(t, e) {
  return Gy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Ky = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y(t) {
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
function Vr(t) {
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
function an(...t) {
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
  return an(...t.map((e) => typeof e == "number" ? Iu([e]) : e instanceof Array ? Iu(e) : e));
}
function pe(t, e) {
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
function Cr(t, e, n = 0) {
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
const br = {
  number: Wa,
  bool: cw,
  bytes: Jh,
  hash: lw,
  exists: uw,
  output: fw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Aa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ye = (t, e) => t << 32 - e | t >>> e, hw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Kr(t) {
  const e = (r) => t().update(tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ed = class extends td {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, br.hash(e);
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
    br.exists(this);
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
    br.exists(this), br.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Aa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
]), Tn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), _n = new Uint32Array(64);
let nd = class extends el {
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
      _n[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = _n[l - 15], f = _n[l - 2], y = Ye(g, 7) ^ Ye(g, 18) ^ g >>> 3, w = Ye(f, 17) ^ Ye(f, 19) ^ f >>> 10;
      _n[l] = w + _n[l - 7] + y + _n[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ye(a, 6) ^ Ye(a, 11) ^ Ye(a, 25), f = d + g + gw(a, c, u) + ww[l] + _n[l] | 0, w = (Ye(r, 2) ^ Ye(r, 13) ^ Ye(r, 22)) + yw(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    _n.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bw = class extends nd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xs = Kr(() => new nd());
Kr(() => new bw());
const xw = {}, rd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ht = BigInt(0), Bt = BigInt(1), ir = BigInt(2), Ys = BigInt(3), Lu = BigInt(8), St = Object.freeze({
  a: ht,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Bt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Cu = (t, e) => (t + e / ir) / e, Bi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = St, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Bt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Cu(i * t, e), c = Cu(-r * t, e);
    let u = P(t - a * n - c * s, e), d = P(-a * r - c * i, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, je = 32, kr = 32, sd = 32, po = je + 1, go = 2 * je + 1;
function ku(t) {
  const { a: e, b: n } = St, r = P(t * t), s = P(r * t);
  return P(s + e * t + n);
}
const Mi = St.a === ht;
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
    if (!(e instanceof ot))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(ot.ZERO) ? wt.ZERO : new wt(e.x, e.y, Bt);
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
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = P(s * s), u = P(a * a), d = P(n * u), l = P(i * c), g = P(P(r * a) * u), f = P(P(o * s) * c);
    return d === l && g === f;
  }
  negate() {
    return new wt(this.x, P(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = P(e * e), i = P(n * n), o = P(i * i), a = e + i, c = P(ir * (P(a * a) - s - o)), u = P(Ys * s), d = P(u * u), l = P(d - ir * c), g = P(u * (c - l) - Lu * o), f = P(ir * n * r);
    return new wt(l, g, f);
  }
  add(e) {
    Bu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === ht || o === ht)
      return this;
    if (n === ht || r === ht)
      return e;
    const c = P(s * s), u = P(a * a), d = P(n * u), l = P(i * c), g = P(P(r * a) * u), f = P(P(o * s) * c), y = P(l - d), w = P(f - g);
    if (y === ht)
      return w === ht ? this.double() : wt.ZERO;
    const $ = P(y * y), T = P(y * $), _ = P(d * $), b = P(w * w - T - ir * _), v = P(w * (_ - b) - g * T), A = P(s * a * y);
    return new wt(b, v, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = wt.ZERO;
    if (typeof e == "bigint" && e === ht)
      return n;
    let r = _u(e);
    if (r === Bt)
      return this;
    if (!Mi) {
      let l = n, g = this;
      for (; r > ht; )
        r & Bt && (l = l.add(g)), g = g.double(), r >>= Bt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Bi.splitScalar(r), c = n, u = n, d = this;
    for (; i > ht || a > ht; )
      i & Bt && (c = c.add(d)), a & Bt && (u = u.add(d)), d = d.double(), i >>= Bt, a >>= Bt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new wt(P(u.x * Bi.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(wt.BASE) && (n = ot.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Xa.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = wt.normalizeZ(s), Xa.set(n, s)));
    let i = wt.ZERO, o = wt.BASE;
    const a = 1 + (Mi ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const f = g * c;
      let y = Number(e & u);
      e >>= l, y > c && (y -= d, e += Bt);
      const w = f, $ = f + Math.abs(y) - 1, T = g % 2 !== 0, _ = y < 0;
      y === 0 ? o = o.add(Ti(T, s[w])) : i = i.add(Ti(_, s[$]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = _u(e), s, i;
    if (Mi) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Bi.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f } = this.wNAF(u, n);
      d = Ti(o, d), g = Ti(c, g), g = new wt(P(g.x * Bi.beta), g.y, g.z), s = d.add(g), i = l.add(f);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return wt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(wt.ZERO);
    e == null && (e = i ? Lu : Ns(s));
    const o = e, a = P(o * o), c = P(a * o), u = P(n * a), d = P(r * c), l = P(s * o);
    if (i)
      return ot.ZERO;
    if (l !== Bt)
      throw new Error("invZ was invalid");
    return new ot(u, d);
  }
}
wt.BASE = new wt(St.Gx, St.Gy, Bt);
wt.ZERO = new wt(ht, Bt, ht);
function Ti(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Xa = /* @__PURE__ */ new WeakMap();
class ot {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Xa.delete(this);
  }
  hasEvenY() {
    return this.y % ir === ht;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = $e(n ? e : e.subarray(1));
    if (!so(r))
      throw new Error("Point is not on curve");
    const s = ku(r);
    let i = Aw(s);
    const o = (i & Bt) === Bt;
    n ? o && (i = P(-i)) : (e[0] & 1) === 1 !== o && (i = P(-i));
    const a = new ot(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = $e(e.subarray(1, je + 1)), r = $e(e.subarray(je + 1, je * 2 + 1)), s = new ot(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = cn(e), r = n.length, s = n[0];
    if (r === je)
      return this.fromCompressedHex(n);
    if (r === po && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === go && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${po} compressed bytes or ${go} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return ot.BASE.multiply(Br(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = ad(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = rl(cn(e)), { n: a } = St, c = r === 2 || r === 3 ? s + a : s, u = Ns(c, a), d = P(-o * u, a), l = P(i * u, a), g = r & 1 ? "03" : "02", f = ot.fromHex(g + or(c)), y = ot.BASE.multiplyAndAddUnsafe(f, d, l);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return ar(this.toHex(e));
  }
  toHex(e = !1) {
    const n = or(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${or(this.y)}`;
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
    const s = P(r * r), i = ku(n);
    if (P(s - i) !== ht)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ot(this.x, P(-this.y));
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
    const s = wt.fromAffine(this), i = n === ht || n === Bt || this !== ot.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = wt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(wt.ZERO) ? void 0 : a.toAffine();
  }
}
ot.BASE = new ot(St.Gx, St.Gy);
ot.ZERO = new ot(ht, ht);
function Mu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Tu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ms(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: $e(n), left: t.subarray(e + 2) };
}
function mw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ms(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Tu(t.subarray(2)), { data: r, left: s } = Tu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ms(s)}`);
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
    const s = n ? ms(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ae(yo(s.slice(0, 64)), yo(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = mw(n ? e : ar(e));
    return new Ae(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Es(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Es(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = St.n >> Bt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ae(this.r, P(-this.s, St.n)) : this;
  }
  toDERRawBytes() {
    return ar(this.toDERHex());
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
    return ar(this.toCompactHex());
  }
  toCompactHex() {
    return or(this.r) + or(this.s);
  }
}
function rr(...t) {
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
function ms(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Sw[t[n]];
  return e;
}
const Ew = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function or(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(ht <= t && t < Ew))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ss(t) {
  const e = ar(or(t));
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
function ar(t) {
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
  return yo(ms(t));
}
function cn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ar(t);
}
function _u(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Es(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function P(t, e = St.P) {
  const n = t % e;
  return n >= ht ? n : e + n;
}
function Ce(t, e) {
  const { P: n } = St;
  let r = t;
  for (; e-- > ht; )
    r *= r, r %= n;
  return r;
}
function Aw(t) {
  const { P: e } = St, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Ce(u, Ys) * u % e, l = Ce(d, Ys) * u % e, g = Ce(l, ir) * c % e, f = Ce(g, r) * g % e, y = Ce(f, s) * f % e, w = Ce(y, o) * y % e, $ = Ce(w, a) * w % e, T = Ce($, o) * y % e, _ = Ce(T, Ys) * u % e, b = Ce(_, i) * f % e, v = Ce(b, n) * c % e, A = Ce(v, ir);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Ns(t, e = St.P) {
  if (t === ht || e <= ht)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = P(t, e), r = e, s = ht, i = Bt;
  for (; n !== ht; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Bt)
    throw new Error("invert: does not exist");
  return P(s, e);
}
function $w(t, e = St.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === ht ? i : (n[a] = i, P(i * o, e)), Bt), s = Ns(r, e);
  return t.reduceRight((i, o, a) => o === ht ? i : (n[a] = P(i * n[a], e), P(i * o, e)), s), n;
}
function vw(t) {
  const e = t.length * 8 - kr * 8, n = $e(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function rl(t, e = !1) {
  const n = vw(t);
  if (e)
    return n;
  const { n: r } = St;
  return n >= r ? n - r : n;
}
let gs, Zs;
class id {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ot.hmacSha256(this.k, ...e);
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
    return rr(...n);
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
    return rr(...n);
  }
}
function Es(t) {
  return ht < t && t < St.n;
}
function so(t) {
  return ht < t && t < St.P;
}
function od(t, e, n, r = !0) {
  const { n: s } = St, i = rl(t, !0);
  if (!Es(i))
    return;
  const o = Ns(i, s), a = ot.BASE.multiply(i), c = P(a.x, s);
  if (c === ht)
    return;
  const u = P(o * P(e + n * c, s), s);
  if (u === ht)
    return;
  let d = new Ae(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & Bt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Br(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * kr)
      throw new Error("Expected 32 bytes of private key");
    e = yo(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== kr)
      throw new Error("Expected 32 bytes of private key");
    e = $e(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Es(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function sl(t) {
  return t instanceof ot ? (t.assertValidity(), t) : ot.fromHex(t);
}
function ad(t) {
  if (t instanceof Ae)
    return t.assertValidity(), t;
  try {
    return Ae.fromDER(t);
  } catch {
    return Ae.fromCompact(t);
  }
}
function bi(t, e = !1) {
  return ot.fromPrivateKey(t).toRawBytes(e);
}
function Iw(t, e, n, r = !1) {
  return ot.fromSignature(t, e, n).toRawBytes(r);
}
function Uu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === po || r === go : n ? r === po * 2 || r === go * 2 : t instanceof ot;
}
function il(t, e, n = !1) {
  if (Uu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Uu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = sl(e);
  return r.assertValidity(), r.multiply(Br(t)).toRawBytes(n);
}
function cd(t) {
  const e = t.length > je ? t.slice(0, je) : t;
  return $e(e);
}
function Lw(t) {
  const e = cd(t), n = P(e, St.n);
  return ld(n < ht ? e : n);
}
function ld(t) {
  return Ss(t);
}
function ud(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = cn(t), s = Br(e), i = [ld(s), Lw(r)];
  if (n != null) {
    n === !0 && (n = Ot.randomBytes(je));
    const c = cn(n);
    if (c.length !== je)
      throw new Error(`sign: Expected ${je} bytes of extra data`);
    i.push(c);
  }
  const o = rr(...i), a = cd(r);
  return { seed: o, m: a, d: s };
}
function fd(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Cw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ud(t, e, n.extraEntropy), o = new id(sd, kr);
  await o.reseed(r);
  let a;
  for (; !(a = od(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return fd(a, n);
}
function Ro(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ud(t, e, n.extraEntropy), o = new id(sd, kr);
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
    s = ad(t), e = cn(e);
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
  const { n: u } = St, d = Ns(o, u), l = P(a * d, u), g = P(i * d, u), f = ot.BASE.multiplyAndAddUnsafe(c, l, g);
  return f ? P(f.x, u) === i : !1;
}
function wo(t) {
  return P($e(t), St.n);
}
class As {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = cn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = $e(n.subarray(0, 32)), s = $e(n.subarray(32, 64));
    return new As(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!so(e) || !Es(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return or(this.r) + or(this.s);
  }
  toRawBytes() {
    return ar(this.toHex());
  }
}
function Mw(t) {
  return ot.fromPrivateKey(t).toRawX();
}
class hd {
  constructor(e, n, r = Ot.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = cn(e);
    const { x: s, scalar: i } = this.getScalar(Br(n));
    if (this.px = s, this.d = i, this.rand = cn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = ot.fromPrivateKey(e), r = n.hasEvenY() ? e : St.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ss(e ^ $e(n));
  }
  finalizeNonce(e) {
    const n = P($e(e), St.n);
    if (n === ht)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new As(e.x, P(n + r * s, St.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ot.taggedHash, o = this.initNonce(n, await i(nr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(nr.nonce, o, r, e)), d = wo(await i(nr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await gd(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ot.taggedHashSync, o = this.initNonce(n, i(nr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(nr.nonce, o, r, e)), d = wo(i(nr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
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
  const r = t instanceof As, s = r ? t : As.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: cn(e),
    P: sl(n)
  };
}
function pd(t, e, n, r) {
  const s = ot.BASE.multiplyAndAddUnsafe(e, Br(n), P(-r, St.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function gd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = dd(t, e, n), a = wo(await Ot.taggedHash(nr.challenge, Ss(r), o.toRawX(), i));
    return pd(r, o, s, a);
  } catch {
    return !1;
  }
}
function yd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = dd(t, e, n), a = wo(Ot.taggedHashSync(nr.challenge, Ss(r), o.toRawX(), i));
    return pd(r, o, s, a);
  } catch (r) {
    if (r instanceof nl)
      throw r;
    return !1;
  }
}
const Uw = {
  Signature: As,
  getPublicKey: Mw,
  sign: Tw,
  verify: gd,
  signSync: _w,
  verifySync: yd
};
ot.BASE._setWindowSize(8);
const be = {
  node: rd,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, nr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, _i = {}, Ot = {
  bytesToHex: ms,
  hexToBytes: ar,
  concatBytes: rr,
  mod: P,
  invert: Ns,
  isValidPrivateKey(t) {
    try {
      return Br(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ss,
  _normalizePrivateKey: Br,
  hashToPrivateKey: (t) => {
    t = cn(t);
    const e = kr + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = P($e(t), St.n - Bt) + Bt;
    return Ss(n);
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
  randomPrivateKey: () => Ot.hashToPrivateKey(Ot.randomBytes(kr + 8)),
  precompute(t = 8, e = ot.BASE) {
    const n = e === ot.BASE ? e : new ot(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ys), n;
  },
  sha256: async (...t) => {
    if (be.web) {
      const e = await be.web.subtle.digest("SHA-256", rr(...t));
      return new Uint8Array(e);
    } else if (be.node) {
      const { createHash: e } = be.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (be.web) {
      const n = await be.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = rr(...e), s = await be.web.subtle.sign("HMAC", n, r);
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
    let n = _i[t];
    if (n === void 0) {
      const r = await Ot.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rr(r, r), _i[t] = n;
    }
    return Ot.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof gs != "function")
      throw new nl("sha256Sync is undefined, you need to set it");
    let n = _i[t];
    if (n === void 0) {
      const r = gs(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rr(r, r), _i[t] = n;
    }
    return gs(n, ...e);
  },
  _JacobianPoint: wt
};
Object.defineProperties(Ot, {
  sha256Sync: {
    configurable: !1,
    get() {
      return gs;
    },
    set(t) {
      gs || (gs = t);
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
  CURVE: St,
  Point: ot,
  Signature: Ae,
  getPublicKey: bi,
  getSharedSecret: il,
  recoverPublicKey: Iw,
  schnorr: Uw,
  sign: Cw,
  signSync: Ro,
  utils: Ot,
  verify: Bw
}, Symbol.toStringTag, { value: "Module" }));
var xi = {};
xi.byteLength = Fw;
var Nw = xi.toByteArray = zw, Pw = xi.fromByteArray = Vw, en = [], Be = [], Ow = typeof Uint8Array < "u" ? Uint8Array : Array, $a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var is = 0, Dw = $a.length; is < Dw; ++is)
  en[is] = $a[is], Be[$a.charCodeAt(is)] = is;
Be[45] = 62;
Be[95] = 63;
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
    e = Be[t.charCodeAt(c)] << 18 | Be[t.charCodeAt(c + 1)] << 12 | Be[t.charCodeAt(c + 2)] << 6 | Be[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Be[t.charCodeAt(c)] << 2 | Be[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Be[t.charCodeAt(c)] << 10 | Be[t.charCodeAt(c + 1)] << 4 | Be[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Rw(t) {
  return en[t >> 18 & 63] + en[t >> 12 & 63] + en[t >> 6 & 63] + en[t & 63];
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
    en[e >> 2] + en[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    en[e >> 10] + en[e >> 4 & 63] + en[e << 2 & 63] + "="
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
    const i = this.createCipher(e, n, r), o = new Uint8Array(an(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(an(i.update(s), i.final()));
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
  function d(f) {
    if (f instanceof Uint8Array || (ArrayBuffer.isView(f) ? f = new Uint8Array(f.buffer, f.byteOffset, f.byteLength) : Array.isArray(f) && (f = Uint8Array.from(f))), !(f instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (f.length === 0)
      return "";
    for (var y = 0, w = 0, $ = 0, T = f.length; $ !== T && f[$] === 0; )
      $++, y++;
    for (var _ = (T - $) * u + 1 >>> 0, b = new Uint8Array(_); $ !== T; ) {
      for (var v = f[$], A = 0, O = _ - 1; (v !== 0 || A < w) && O !== -1; O--, A++)
        v += 256 * b[O] >>> 0, b[O] = v % o >>> 0, v = v / o >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      w = A, $++;
    }
    for (var V = _ - w; V !== _ && b[V] === 0; )
      V++;
    for (var F = a.repeat(y); V < _; ++V)
      F += t.charAt(b[V]);
    return F;
  }
  function l(f) {
    if (typeof f != "string")
      throw new TypeError("Expected String");
    if (f.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, $ = 0; f[y] === a; )
      w++, y++;
    for (var T = (f.length - y) * c + 1 >>> 0, _ = new Uint8Array(T); f[y]; ) {
      var b = f.charCodeAt(y);
      if (b > 255)
        return;
      var v = e[b];
      if (v === 255)
        return;
      for (var A = 0, O = T - 1; (v !== 0 || A < $) && O !== -1; O--, A++)
        v += o * _[O] >>> 0, _[O] = v % 256 >>> 0, v = v / 256 >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      $ = A, y++;
    }
    for (var V = T - $; V !== T && _[V] === 0; )
      V++;
    for (var F = new Uint8Array(w + (T - V)), z = w; V !== T; )
      F[z++] = _[V++];
    return F;
  }
  function g(f) {
    var y = l(f);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = o1[f], $ = a1[f], T = ol[f], _ = al[f], b = s1[f], v = i1[f];
      for (let A = 0; A < 16; A++) {
        const O = Ui(r + Hu(f, i, a, u) + Hi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Ui(a, 10) | 0, a = i, i = O;
      }
      for (let A = 0; A < 16; A++) {
        const O = Ui(s + Hu(y, o, c, d) + Hi[_[A]] + $, v[A]) + g | 0;
        s = g, g = d, d = Ui(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Hi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const l1 = Kr(() => new c1());
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
const I1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), k1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, B1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), M1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, tt = {
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
}, [T1, _1] = tt.split([
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
let Go = class extends el {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Un[b] = e.getUint32(n), Hn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Un[b - 15] | 0, A = Hn[b - 15] | 0, O = tt.rotrSH(v, A, 1) ^ tt.rotrSH(v, A, 8) ^ tt.shrSH(v, A, 7), V = tt.rotrSL(v, A, 1) ^ tt.rotrSL(v, A, 8) ^ tt.shrSL(v, A, 7), F = Un[b - 2] | 0, z = Hn[b - 2] | 0, x = tt.rotrSH(F, z, 19) ^ tt.rotrBH(F, z, 61) ^ tt.shrSH(F, z, 6), L = tt.rotrSL(F, z, 19) ^ tt.rotrBL(F, z, 61) ^ tt.shrSL(F, z, 6), H = tt.add4L(V, L, Hn[b - 7], Hn[b - 16]), q = tt.add4H(H, O, x, Un[b - 7], Un[b - 16]);
      Un[b] = q | 0, Hn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const v = tt.rotrSH(l, g, 14) ^ tt.rotrSH(l, g, 18) ^ tt.rotrBH(l, g, 41), A = tt.rotrSL(l, g, 14) ^ tt.rotrSL(l, g, 18) ^ tt.rotrBL(l, g, 41), O = l & f ^ ~l & w, V = g & y ^ ~g & $, F = tt.add5L(_, A, V, _1[b], Hn[b]), z = tt.add5H(F, T, v, O, T1[b], Un[b]), x = F | 0, L = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), H = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = tt.add(u | 0, d | 0, z | 0, x | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = tt.add3L(x, H, Q);
      r = tt.add3H(R, z, L, q), s = R | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = tt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = tt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = tt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = tt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Un.fill(0), Hn.fill(0);
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
const P1 = Kr(() => new Go());
Kr(() => new U1());
Kr(() => new H1());
Kr(() => new N1());
function Ad(t) {
  return xs(t);
}
function O1(t) {
  return P1(t);
}
const D1 = 0;
Ot.hmacSha256Sync = (t, ...e) => {
  const n = zo.create(xs, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F1() {
  return Y(Ot.randomPrivateKey());
}
function j1(t) {
  const e = xs(xs(t));
  return e1.encode(an(t, e).slice(0, t.length + 4));
}
function z1(t, e) {
  return j1(an(new Uint8Array([t]), e.slice(0, 20)));
}
function $d(t, e = D1) {
  const n = typeof t == "string" ? pt(t) : t, r = u1(Ad(n));
  return z1(e, r);
}
function vd(t) {
  const e = Jc(t);
  return Y(bi(e.slice(0, 32), !0));
}
Ot.hmacSha256Sync = (t, ...e) => {
  const n = zo.create(xs, t);
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
  return zo(xs, t, e);
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
    return ot.fromHex(t).assertValidity(), {
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
  const i = Ot.randomPrivateKey(), o = bi(i, !0);
  let a = il(i, t, !0);
  a = a.slice(1);
  const c = Ld(a), u = Ot.randomBytes(16), d = await R1(u, c.encryptionKey, e), l = an(u, o, d), g = Id(c.hmacKey, l);
  let f;
  if (!r || r === "hex")
    f = Y(d);
  else if (r === "base64")
    f = Pw(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: Y(u),
    ephemeralPK: Y(o),
    cipherText: f,
    mac: Y(g),
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
  const a = an(i, pt(n), o), c = Id(s.hmacKey, a), u = pt(e.mac);
  if (!V1(u, c))
    throw new Au("Decryption failed: failure in MAC check");
  const d = await G1(i, s.encryptionKey, o);
  return e.wasString ? wi(d) : d;
}
function X1(t, e) {
  const n = typeof e == "string" ? Vr(e) : e, r = vd(t), s = Ad(n), i = Ro(s, t);
  return {
    signature: Y(i),
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
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Vr(t) : t, o = await W1(n.publicKey, i, s, n.cipherTextEncoding);
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
var Qt = {}, $s = {}, oe = {};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.decode = oe.encode = oe.unescape = oe.escape = oe.pad = void 0;
const kd = xi;
function cl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
oe.pad = cl;
function Bd(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
oe.escape = Bd;
function Md(t) {
  return cl(t).replace(/-/g, "+").replace(/_/g, "/");
}
oe.unescape = Md;
function Q1(t) {
  return Bd((0, kd.fromByteArray)(new TextEncoder().encode(t)));
}
oe.encode = Q1;
function J1(t) {
  return new TextDecoder().decode((0, kd.toByteArray)(cl(Md(t))));
}
oe.decode = J1;
var Vo = {}, Ko = {}, Td = {}, _d = {}, qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.crypto = void 0;
qo.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = f, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = _, t.hexToBytes = A, t.asyncLoop = V, t.utf8ToBytes = F, t.bytesToUtf8 = z, t.toBytes = x, t.kdfInputToBytes = L, t.concatBytes = H, t.checkOpts = q, t.createHasher = R, t.createOptHasher = Tt, t.createXOFer = Wt, t.randomBytes = Xt;
  const e = qo;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...B) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (B.length > 0 && !B.includes(S.length))
      throw new Error("Uint8Array expected of length " + B + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, B = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (B && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, B) {
    s(S);
    const Z = B.outputLen;
    if (S.length < Z)
      throw new Error("digestInto() expects output buffer of length at least " + Z);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function d(...S) {
    for (let B = 0; B < S.length; B++)
      S[B].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, B) {
    return S << 32 - B | S >>> B;
  }
  function f(S, B) {
    return S << B | S >>> 32 - B >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => y(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let B = 0; B < S.length; B++)
      S[B] = y(S[B]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", T = /* @__PURE__ */ Array.from({ length: 256 }, (S, B) => B.toString(16).padStart(2, "0"));
  function _(S) {
    if (s(S), $)
      return S.toHex();
    let B = "";
    for (let Z = 0; Z < S.length; Z++)
      B += T[S[Z]];
    return B;
  }
  const b = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function v(S) {
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
    if ($)
      return Uint8Array.fromHex(S);
    const B = S.length, Z = B / 2;
    if (B % 2)
      throw new Error("hex string expected, got unpadded hex of length " + B);
    const gt = new Uint8Array(Z);
    for (let ut = 0, Lt = 0; ut < Z; ut++, Lt += 2) {
      const ne = v(S.charCodeAt(Lt)), Ge = v(S.charCodeAt(Lt + 1));
      if (ne === void 0 || Ge === void 0) {
        const kn = S[Lt] + S[Lt + 1];
        throw new Error('hex string expected, got non-hex character "' + kn + '" at index ' + Lt);
      }
      gt[ut] = ne * 16 + Ge;
    }
    return gt;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function V(S, B, Z) {
    let gt = Date.now();
    for (let ut = 0; ut < S; ut++) {
      Z(ut);
      const Lt = Date.now() - gt;
      Lt >= 0 && Lt < B || (await (0, t.nextTick)(), gt += Lt);
    }
  }
  function F(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function z(S) {
    return new TextDecoder().decode(S);
  }
  function x(S) {
    return typeof S == "string" && (S = F(S)), s(S), S;
  }
  function L(S) {
    return typeof S == "string" && (S = F(S)), s(S), S;
  }
  function H(...S) {
    let B = 0;
    for (let gt = 0; gt < S.length; gt++) {
      const ut = S[gt];
      s(ut), B += ut.length;
    }
    const Z = new Uint8Array(B);
    for (let gt = 0, ut = 0; gt < S.length; gt++) {
      const Lt = S[gt];
      Z.set(Lt, ut), ut += Lt.length;
    }
    return Z;
  }
  function q(S, B) {
    if (B !== void 0 && {}.toString.call(B) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, B);
  }
  class Q {
  }
  t.Hash = Q;
  function R(S) {
    const B = (gt) => S().update(x(gt)).digest(), Z = S();
    return B.outputLen = Z.outputLen, B.blockLen = Z.blockLen, B.create = () => S(), B;
  }
  function Tt(S) {
    const B = (gt, ut) => S(ut).update(x(gt)).digest(), Z = S({});
    return B.outputLen = Z.outputLen, B.blockLen = Z.blockLen, B.create = (gt) => S(gt), B;
  }
  function Wt(S) {
    const B = (gt, ut) => S(ut).update(x(gt)).digest(), Z = S({});
    return B.outputLen = Z.outputLen, B.blockLen = Z.blockLen, B.create = (gt) => S(gt), B;
  }
  t.wrapConstructor = R, t.wrapConstructorWithOpts = Tt, t.wrapXOFConstructorWithOpts = Wt;
  function Xt(S = 32) {
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
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
const os = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ud(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Za(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function qr(t, ...e) {
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
  qr(t);
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
function Ne(t, e) {
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
  if (qr(t), Od)
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
  return typeof t == "string" && (t = fl(t)), qr(t), t;
}
function fb(t) {
  return typeof t == "string" && (t = fl(t)), qr(t), t;
}
function hb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    qr(s), e += s.length;
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
  if (os && typeof os.getRandomValues == "function")
    return os.getRandomValues(new Uint8Array(t));
  if (os && typeof os.randomBytes == "function")
    return Uint8Array.from(os.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Fd,
  abytes: qr,
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
  rotr: Ne,
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
    Qa(this), e = mi(e), qr(e);
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
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Nn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Pn = /* @__PURE__ */ Uint32Array.from([
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
]), On = /* @__PURE__ */ new Uint32Array(64);
let hl = class extends Eb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Nn[0] | 0, this.B = Nn[1] | 0, this.C = Nn[2] | 0, this.D = Nn[3] | 0, this.E = Nn[4] | 0, this.F = Nn[5] | 0, this.G = Nn[6] | 0, this.H = Nn[7] | 0;
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
      On[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = On[l - 15], f = On[l - 2], y = Ne(g, 7) ^ Ne(g, 18) ^ g >>> 3, w = Ne(f, 17) ^ Ne(f, 19) ^ f >>> 10;
      On[l] = w + On[l - 7] + y + On[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ne(a, 6) ^ Ne(a, 11) ^ Ne(a, 25), f = d + g + mb(a, c, u) + Ab[l] + On[l] | 0, w = (Ne(r, 2) ^ Ne(r, 13) ^ Ne(r, 22)) + Sb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    xo(On);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), xo(this.buffer);
  }
}, Rd = class extends hl {
  constructor() {
    super(28), this.A = Pn[0] | 0, this.B = Pn[1] | 0, this.C = Pn[2] | 0, this.D = Pn[3] | 0, this.E = Pn[4] | 0, this.F = Pn[5] | 0, this.G = Pn[6] | 0, this.H = Pn[7] | 0;
  }
};
const $b = /* @__PURE__ */ Wo(() => new hl()), vb = /* @__PURE__ */ Wo(() => new Rd()), Ib = hl, Lb = $b, Cb = Rd, kb = vb, Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Cb,
  SHA256: Ib,
  sha224: kb,
  sha256: Lb
}, Symbol.toStringTag, { value: "Module" })), Xo = /* @__PURE__ */ Fo(Bb), Mb = /* @__PURE__ */ Fo(Hw);
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.joseToDer = vs.derToJose = void 0;
const Gd = xi, Vd = oe;
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
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, f = r - d, y = new Uint8Array(g + c + f + d);
  for (o = 0; o < g; ++o)
    y[o] = 0;
  y.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const w = o; o < w + f; ++o)
    y[o] = 0;
  return y.set(n.subarray(l + Math.max(-f, 0), l + d), o), (0, Vd.escape)((0, Gd.fromByteArray)(y));
}
vs.derToJose = Nb;
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
  const s = Pu(t, 0, n), i = Pu(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mo, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = Wd, u ? d[l++] = c : (d[l++] = mo | 1, d[l++] = c & 255), d[l++] = So, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = So, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
vs.joseToDer = Pb;
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
const Fb = Td, jb = Xo, oo = Mb, Ou = vs, Du = In, Fu = Si;
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
var Mr = {};
const zb = /* @__PURE__ */ Fo(rd);
var Rb = ce && ce.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.hashSha256Async = Mr.hashSha256 = void 0;
const Gb = Xo;
function Zd(t) {
  return (0, Gb.sha256)(t);
}
Mr.hashSha256 = Zd;
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
Mr.hashSha256Async = Vb;
var Kb = ce && ce.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.TokenSigner = $s.createUnsecuredToken = void 0;
const Ja = oe, ju = Vo, qb = In, zu = Mr;
function tc(t, e) {
  const n = [], r = Ja.encode(JSON.stringify(e));
  n.push(r);
  const s = Ja.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Wb(t) {
  return tc(t, { typ: "JWT", alg: "none" }) + ".";
}
$s.createUnsecuredToken = Wb;
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
$s.TokenSigner = Xb;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
Yo.TokenVerifier = void 0;
const Yb = oe, Ru = Vo, Zb = In, Pi = Mr;
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
const Oi = oe;
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
  var e = ce && ce.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ce && ce.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n($s, t), n(Yo, t), n(Zo, t), n(In, t), n(Vo, t);
})(Qt);
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
  }), u = Qt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = $d(u);
  return c.iss = t2(d), new Qt.TokenSigner("ES256k", t).sign(c);
}
async function Gu(t, e) {
  const n = wi(pt(e)), r = JSON.parse(n), s = await Cd(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function i2(t) {
  const e = Qt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Qt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function o2(t) {
  const e = Qt.decodeToken(t).payload;
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
  const e = Qt.decodeToken(t).payload;
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
  const e = Qt.decodeToken(t).payload;
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
class cr {
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
    return new cr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Jd {
  constructor(e) {
    if (e) {
      const n = new cr(e);
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
    super(e), this.sessionData || this.setSessionData(new cr({}));
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
    return this.setSessionData(new cr({})), !0;
  }
}
class qu extends Jd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Uy, !localStorage.getItem(this.key)) {
      const r = new cr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Wh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return cr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new cr({})), !0;
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
var rn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(rn || (rn = {}));
$n.Mainnet;
const t0 = {
  chainId: si.Mainnet,
  transactionVersion: $n.Mainnet,
  peerNetworkId: Eo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: rn.MainnetSingleSig,
    multiSig: rn.MainnetMultiSig
  },
  client: { baseUrl: Xh }
}, ec = {
  chainId: si.Testnet,
  transactionVersion: $n.Testnet,
  peerNetworkId: Eo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: rn.TestnetSingleSig,
    multiSig: rn.TestnetMultiSig
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
var Pe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pe || (Pe = {}));
const Ia = ["onChainOnly", "offChainOnly", "any"];
Ia[0] + "", Pe.OnChainOnly, Ia[1] + "", Pe.OffChainOnly, Ia[2] + "", Pe.Any, Pe.OnChainOnly + "", Pe.OnChainOnly, Pe.OffChainOnly + "", Pe.OffChainOnly, Pe.Any + "", Pe.Any;
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
const xr = {
  number: nc,
  bool: h2,
  bytes: n0,
  hash: d2,
  exists: p2,
  output: g2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const La = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ze = (t, e) => t << 32 - e | t >>> e, y2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Wr(t) {
  const e = (r) => t().update(dl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let s0 = class extends r0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, xr.hash(e);
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
    return xr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    xr.exists(this), xr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
    xr.exists(this);
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
    xr.exists(this), xr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    b2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = La(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
let o0 = class extends pl {
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
      const g = Fn[l - 15], f = Fn[l - 2], y = Ze(g, 7) ^ Ze(g, 18) ^ g >>> 3, w = Ze(f, 17) ^ Ze(f, 19) ^ f >>> 10;
      Fn[l] = w + Fn[l - 7] + y + Fn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ze(a, 6) ^ Ze(a, 11) ^ Ze(a, 25), f = d + g + x2(a, c, u) + S2[l] + Fn[l] | 0, w = (Ze(r, 2) ^ Ze(r, 13) ^ Ze(r, 22)) + m2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E2 = class extends o0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const a0 = Wr(() => new o0());
Wr(() => new E2());
var Xr = {}, gl = {};
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
        const $ = 1 + u, T = w % (1 << $) << 5 - $, _ = t.c32[y + T];
        u = $, c.unshift(_);
      } else
        u = 0;
    let d = 0;
    for (let f = 0; f < c.length && c[f] === "0"; f++)
      d++;
    c = c.slice(d);
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
    let d = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const T = (t.c32.indexOf(o[w]) << g) + l, _ = n[T % 16];
      if (g += 1, l = T >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(_);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let f = 0;
    for (let w = 0; w < d.length && d[w] === "0"; w++)
      f++;
    d = d.slice(f - f % 2);
    let y = d.join("");
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
})(gl);
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.c32checkDecode = Tr.c32checkEncode = void 0;
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
Tr.c32checkEncode = A2;
function $2(t) {
  t = (0, Qs.c32normalize)(t);
  const e = (0, Qs.c32decode)(t.slice(1)), n = t[0], r = Qs.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), c0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Tr.c32checkDecode = $2;
var l0 = {}, Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.decode = Is.encode = void 0;
const Ao = Xo, ff = Si, u0 = xd, f0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function v2(t, e = "00") {
  const n = typeof t == "string" ? (0, ff.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ff.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ao.sha256)((0, Ao.sha256)(new Uint8Array([...r, ...n])));
  return u0(f0).encode([...r, ...n, ...s.slice(0, 4)]);
}
Is.encode = v2;
function I2(t) {
  const e = u0(f0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ao.sha256)((0, Ao.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Is.decode = I2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Tr, n = Is, r = Si;
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
    const g = n.decode(d), f = (0, r.bytesToHex)(g.data), y = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = l, o(w, f);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), f = g[0], y = g[1];
    let w;
    l < 0 ? (w = f, i[f] !== void 0 && (w = i[f])) : w = l;
    let $ = w.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(y, $);
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
  const n = Tr;
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
})(Xr);
function L2(t, e) {
  switch (e = e0(e ?? t0), t) {
    case En.P2PKH:
      switch (e.transactionVersion) {
        case $n.Mainnet:
          return rn.MainnetSingleSig;
        case $n.Testnet:
          return rn.TestnetSingleSig;
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
          return rn.MainnetMultiSig;
        case $n.Testnet:
          return rn.TestnetMultiSig;
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T2[f], $ = _2[f], T = yl[f], _ = wl[f], b = B2[f], v = M2[f];
      for (let A = 0; A < 16; A++) {
        const O = Di(r + hf(f, i, a, u) + Fi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Di(a, 10) | 0, a = i, i = O;
      }
      for (let A = 0; A < 16; A++) {
        const O = Di(s + hf(y, o, c, d) + Fi[_[A]] + $, v[A]) + g | 0;
        s = g, g = d, d = Di(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const H2 = Wr(() => new U2()), ji = BigInt(2 ** 32 - 1), rc = BigInt(32);
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
const Z2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Q2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, J2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), tx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ex = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), nx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
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
}, [rx, sx] = et.split([
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
let Qo = class extends pl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      jn[b] = e.getUint32(n), zn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = jn[b - 15] | 0, A = zn[b - 15] | 0, O = et.rotrSH(v, A, 1) ^ et.rotrSH(v, A, 8) ^ et.shrSH(v, A, 7), V = et.rotrSL(v, A, 1) ^ et.rotrSL(v, A, 8) ^ et.shrSL(v, A, 7), F = jn[b - 2] | 0, z = zn[b - 2] | 0, x = et.rotrSH(F, z, 19) ^ et.rotrBH(F, z, 61) ^ et.shrSH(F, z, 6), L = et.rotrSL(F, z, 19) ^ et.rotrBL(F, z, 61) ^ et.shrSL(F, z, 6), H = et.add4L(V, L, zn[b - 7], zn[b - 16]), q = et.add4H(H, O, x, jn[b - 7], jn[b - 16]);
      jn[b] = q | 0, zn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const v = et.rotrSH(l, g, 14) ^ et.rotrSH(l, g, 18) ^ et.rotrBH(l, g, 41), A = et.rotrSL(l, g, 14) ^ et.rotrSL(l, g, 18) ^ et.rotrBL(l, g, 41), O = l & f ^ ~l & w, V = g & y ^ ~g & $, F = et.add5L(_, A, V, sx[b], zn[b]), z = et.add5H(F, T, v, O, rx[b], jn[b]), x = F | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), H = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = et.add(u | 0, d | 0, z | 0, x | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = et.add3L(x, H, Q);
      r = et.add3H(R, z, L, q), s = R | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = et.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = et.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = et.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    jn.fill(0), zn.fill(0);
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
Wr(() => new Qo());
Wr(() => new ix());
Wr(() => new ox());
Wr(() => new ax());
var $o = { exports: {} };
$o.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", f = "[object Number]", y = "[object Object]", w = "[object Promise]", $ = "[object RegExp]", T = "[object Set]", _ = "[object String]", b = "[object Symbol]", v = "[object WeakMap]", A = "[object ArrayBuffer]", O = "[object DataView]", V = "[object Float32Array]", F = "[object Float64Array]", z = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", H = "[object Uint8Array]", q = "[object Uint8ClampedArray]", Q = "[object Uint16Array]", R = "[object Uint32Array]", Tt = /[\\^$.*+?()[\]{}|]/g, Wt = /\w*$/, Xt = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, B = {};
  B[i] = B[o] = B[A] = B[O] = B[a] = B[c] = B[V] = B[F] = B[z] = B[x] = B[L] = B[g] = B[f] = B[y] = B[$] = B[T] = B[_] = B[b] = B[H] = B[q] = B[Q] = B[R] = !0, B[u] = B[d] = B[v] = !1;
  var Z = typeof ce == "object" && ce && ce.Object === Object && ce, gt = typeof self == "object" && self && self.Object === Object && self, ut = Z || gt || Function("return this")(), Lt = e && !e.nodeType && e, ne = Lt && !0 && t && !t.nodeType && t, Ge = ne && ne.exports === Lt;
  function kn(p, E) {
    return p.set(E[0], E[1]), p;
  }
  function zs(p, E) {
    return p.add(E), p;
  }
  function Vt(p, E) {
    for (var k = -1, W = p ? p.length : 0; ++k < W && E(p[k], k, p) !== !1; )
      ;
    return p;
  }
  function Bn(p, E) {
    for (var k = -1, W = E.length, Zt = p.length; ++k < W; )
      p[Zt + k] = E[k];
    return p;
  }
  function Ie(p, E, k, W) {
    for (var Zt = -1, ue = p ? p.length : 0; ++Zt < ue; )
      k = E(k, p[Zt], Zt, p);
    return k;
  }
  function ts(p, E) {
    for (var k = -1, W = Array(p); ++k < p; )
      W[k] = E(k);
    return W;
  }
  function hn(p, E) {
    return p == null ? void 0 : p[E];
  }
  function dn(p) {
    var E = !1;
    if (p != null && typeof p.toString != "function")
      try {
        E = !!(p + "");
      } catch {
      }
    return E;
  }
  function h(p) {
    var E = -1, k = Array(p.size);
    return p.forEach(function(W, Zt) {
      k[++E] = [Zt, W];
    }), k;
  }
  function I(p, E) {
    return function(k) {
      return p(E(k));
    };
  }
  function C(p) {
    var E = -1, k = Array(p.size);
    return p.forEach(function(W) {
      k[++E] = W;
    }), k;
  }
  var K = Array.prototype, dt = Function.prototype, mt = Object.prototype, re = ut["__core-js_shared__"], Rt = function() {
    var p = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), Le = dt.toString, Kt = mt.hasOwnProperty, Ue = mt.toString, hr = RegExp(
    "^" + Le.call(Kt).replace(Tt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), se = Ge ? ut.Buffer : void 0, dr = ut.Symbol, Jt = ut.Uint8Array, ft = I(Object.getPrototypeOf, Object), xt = Object.create, _t = mt.propertyIsEnumerable, ge = K.splice, Ve = Object.getOwnPropertySymbols, Rs = se ? se.isBuffer : void 0, Dt = I(Object.keys, Object), pn = rs(ut, "DataView"), gn = rs(ut, "Map"), He = rs(ut, "Promise"), yn = rs(ut, "Set"), Ke = rs(ut, "WeakMap"), qe = rs(Object, "create"), Mn = gr(pn), N = gr(gn), vt = gr(He), ye = gr(yn), pa = gr(Ke), m = dr ? dr.prototype : void 0, M = m ? m.valueOf : void 0;
  function G(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function yt() {
    this.__data__ = qe ? qe(null) : {};
  }
  function j(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Et(p) {
    var E = this.__data__;
    if (qe) {
      var k = E[p];
      return k === r ? void 0 : k;
    }
    return Kt.call(E, p) ? E[p] : void 0;
  }
  function ct(p) {
    var E = this.__data__;
    return qe ? E[p] !== void 0 : Kt.call(E, p);
  }
  function Ct(p, E) {
    var k = this.__data__;
    return k[p] = qe && E === void 0 ? r : E, this;
  }
  G.prototype.clear = yt, G.prototype.delete = j, G.prototype.get = Et, G.prototype.has = ct, G.prototype.set = Ct;
  function Yt(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function We() {
    this.__data__ = [];
  }
  function wn(p) {
    var E = this.__data__, k = vi(E, p);
    if (k < 0)
      return !1;
    var W = E.length - 1;
    return k == W ? E.pop() : ge.call(E, k, 1), !0;
  }
  function we(p) {
    var E = this.__data__, k = vi(E, p);
    return k < 0 ? void 0 : E[k][1];
  }
  function Xe(p) {
    return vi(this.__data__, p) > -1;
  }
  function xg(p, E) {
    var k = this.__data__, W = vi(k, p);
    return W < 0 ? k.push([p, E]) : k[W][1] = E, this;
  }
  Yt.prototype.clear = We, Yt.prototype.delete = wn, Yt.prototype.get = we, Yt.prototype.has = Xe, Yt.prototype.set = xg;
  function es(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function mg() {
    this.__data__ = {
      hash: new G(),
      map: new (gn || Yt)(),
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
  es.prototype.clear = mg, es.prototype.delete = Sg, es.prototype.get = Eg, es.prototype.has = Ag, es.prototype.set = $g;
  function ns(p) {
    this.__data__ = new Yt(p);
  }
  function vg() {
    this.__data__ = new Yt();
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
    var k = this.__data__;
    if (k instanceof Yt) {
      var W = k.__data__;
      if (!gn || W.length < n - 1)
        return W.push([p, E]), this;
      k = this.__data__ = new es(W);
    }
    return k.set(p, E), this;
  }
  ns.prototype.clear = vg, ns.prototype.delete = Ig, ns.prototype.get = Lg, ns.prototype.has = Cg, ns.prototype.set = kg;
  function Bg(p, E) {
    var k = wa(p) || ty(p) ? ts(p.length, String) : [], W = k.length, Zt = !!W;
    for (var ue in p)
      Kt.call(p, ue) && !(Zt && (ue == "length" || Yg(ue, W))) && k.push(ue);
    return k;
  }
  function cu(p, E, k) {
    var W = p[E];
    (!(Kt.call(p, E) && hu(W, k)) || k === void 0 && !(E in p)) && (p[E] = k);
  }
  function vi(p, E) {
    for (var k = p.length; k--; )
      if (hu(p[k][0], E))
        return k;
    return -1;
  }
  function Mg(p, E) {
    return p && lu(E, ba(E), p);
  }
  function ga(p, E, k, W, Zt, ue, bn) {
    var fe;
    if (W && (fe = ue ? W(p, Zt, ue, bn) : W(p)), fe !== void 0)
      return fe;
    if (!Li(p))
      return p;
    var gu = wa(p);
    if (gu) {
      if (fe = qg(p), !E)
        return Gg(p, fe);
    } else {
      var ss = pr(p), yu = ss == d || ss == l;
      if (ny(p))
        return Pg(p, E);
      if (ss == y || ss == i || yu && !ue) {
        if (dn(p))
          return ue ? p : {};
        if (fe = Wg(yu ? {} : p), !E)
          return Vg(p, Mg(fe, p));
      } else {
        if (!B[ss])
          return ue ? p : {};
        fe = Xg(p, ss, ga, E);
      }
    }
    bn || (bn = new ns());
    var wu = bn.get(p);
    if (wu)
      return wu;
    if (bn.set(p, fe), !gu)
      var bu = k ? Kg(p) : ba(p);
    return Vt(bu || p, function(xa, Ci) {
      bu && (Ci = xa, xa = p[Ci]), cu(fe, Ci, ga(xa, E, k, W, Ci, p, bn));
    }), fe;
  }
  function Tg(p) {
    return Li(p) ? xt(p) : {};
  }
  function _g(p, E, k) {
    var W = E(p);
    return wa(p) ? W : Bn(W, k(p));
  }
  function Ug(p) {
    return Ue.call(p);
  }
  function Hg(p) {
    if (!Li(p) || Qg(p))
      return !1;
    var E = pu(p) || dn(p) ? hr : Xt;
    return E.test(gr(p));
  }
  function Ng(p) {
    if (!fu(p))
      return Dt(p);
    var E = [];
    for (var k in Object(p))
      Kt.call(p, k) && k != "constructor" && E.push(k);
    return E;
  }
  function Pg(p, E) {
    if (E)
      return p.slice();
    var k = new p.constructor(p.length);
    return p.copy(k), k;
  }
  function ya(p) {
    var E = new p.constructor(p.byteLength);
    return new Jt(E).set(new Jt(p)), E;
  }
  function Og(p, E) {
    var k = E ? ya(p.buffer) : p.buffer;
    return new p.constructor(k, p.byteOffset, p.byteLength);
  }
  function Dg(p, E, k) {
    var W = E ? k(h(p), !0) : h(p);
    return Ie(W, kn, new p.constructor());
  }
  function Fg(p) {
    var E = new p.constructor(p.source, Wt.exec(p));
    return E.lastIndex = p.lastIndex, E;
  }
  function jg(p, E, k) {
    var W = E ? k(C(p), !0) : C(p);
    return Ie(W, zs, new p.constructor());
  }
  function zg(p) {
    return M ? Object(M.call(p)) : {};
  }
  function Rg(p, E) {
    var k = E ? ya(p.buffer) : p.buffer;
    return new p.constructor(k, p.byteOffset, p.length);
  }
  function Gg(p, E) {
    var k = -1, W = p.length;
    for (E || (E = Array(W)); ++k < W; )
      E[k] = p[k];
    return E;
  }
  function lu(p, E, k, W) {
    k || (k = {});
    for (var Zt = -1, ue = E.length; ++Zt < ue; ) {
      var bn = E[Zt], fe = void 0;
      cu(k, bn, fe === void 0 ? p[bn] : fe);
    }
    return k;
  }
  function Vg(p, E) {
    return lu(p, uu(p), E);
  }
  function Kg(p) {
    return _g(p, ba, uu);
  }
  function Ii(p, E) {
    var k = p.__data__;
    return Zg(E) ? k[typeof E == "string" ? "string" : "hash"] : k.map;
  }
  function rs(p, E) {
    var k = hn(p, E);
    return Hg(k) ? k : void 0;
  }
  var uu = Ve ? I(Ve, Object) : iy, pr = Ug;
  (pn && pr(new pn(new ArrayBuffer(1))) != O || gn && pr(new gn()) != g || He && pr(He.resolve()) != w || yn && pr(new yn()) != T || Ke && pr(new Ke()) != v) && (pr = function(p) {
    var E = Ue.call(p), k = E == y ? p.constructor : void 0, W = k ? gr(k) : void 0;
    if (W)
      switch (W) {
        case Mn:
          return O;
        case N:
          return g;
        case vt:
          return w;
        case ye:
          return T;
        case pa:
          return v;
      }
    return E;
  });
  function qg(p) {
    var E = p.length, k = p.constructor(E);
    return E && typeof p[0] == "string" && Kt.call(p, "index") && (k.index = p.index, k.input = p.input), k;
  }
  function Wg(p) {
    return typeof p.constructor == "function" && !fu(p) ? Tg(ft(p)) : {};
  }
  function Xg(p, E, k, W) {
    var Zt = p.constructor;
    switch (E) {
      case A:
        return ya(p);
      case a:
      case c:
        return new Zt(+p);
      case O:
        return Og(p, W);
      case V:
      case F:
      case z:
      case x:
      case L:
      case H:
      case q:
      case Q:
      case R:
        return Rg(p, W);
      case g:
        return Dg(p, W, k);
      case f:
      case _:
        return new Zt(p);
      case $:
        return Fg(p);
      case T:
        return jg(p, W, k);
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
    return !!Rt && Rt in p;
  }
  function fu(p) {
    var E = p && p.constructor, k = typeof E == "function" && E.prototype || mt;
    return p === k;
  }
  function gr(p) {
    if (p != null) {
      try {
        return Le.call(p);
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
    return ey(p) && Kt.call(p, "callee") && (!_t.call(p, "callee") || Ue.call(p) == i);
  }
  var wa = Array.isArray;
  function du(p) {
    return p != null && ry(p.length) && !pu(p);
  }
  function ey(p) {
    return sy(p) && du(p);
  }
  var ny = Rs || oy;
  function pu(p) {
    var E = Li(p) ? Ue.call(p) : "";
    return E == d || E == l;
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
  return Xr.c32address(t.version, t.hash160);
}
const fx = (t) => H2(a0(t)), hx = (t) => Y(fx(t));
Ot.hmacSha256Sync = (t, ...e) => {
  const n = i0.create(a0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function dx(t, e = "mainnet") {
  e = e0(e), t = typeof t == "string" ? pt(t) : t;
  const n = L2(En.P2PKH, e), r = lx(n, hx(t));
  return ux(r);
}
function px(t, e) {
  const n = Qt.decodeToken(t), r = n.payload;
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
  const o = new Qt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function gx(t, e = null) {
  let n;
  e ? n = px(t, e) : n = Qt.decodeToken(t);
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
        return us.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      us.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
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
    const i = Qt.decodeToken(e).payload;
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
            if (us.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ot.isValidPrivateKey(i.private_key))
              throw new ki("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Gu(s, c);
          } catch {
            us.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ki("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Yy, d;
    Sa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Sa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
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
      gaiaAssociationToken: d
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
}, Jo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), y0 = "STX_PROVIDER", _r = () => typeof window > "u" ? null : window.localStorage.getItem(y0), Ex = (t) => {
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
var Ls;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ls || (Ls = {}));
var Ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ur || (Ur = {}));
var pf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(pf || (pf = {}));
const Lx = "https://api.mainnet.hiro.so", Cx = "https://api.testnet.hiro.so", kx = "http://localhost:3999", Bx = ["mainnet", "testnet", "devnet", "mocknet"];
class Hr {
  constructor(e) {
    this.version = Ur.Mainnet, this.chainId = Ls.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ur.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
Hr.fromName = (t) => {
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
Hr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Hr.fromName(t);
class oc extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ur.Mainnet, this.chainId = Ls.Mainnet;
  }
}
class ac extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ur.Testnet, this.chainId = Ls.Testnet;
  }
}
class w0 extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ur.Testnet, this.chainId = Ls.Testnet;
  }
}
const Mx = w0;
var Nr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Nr || (Nr = {}));
var vo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vo || (vo = {}));
Nr.Mainnet;
var Pr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pr || (Pr = {}));
var Or;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Or || (Or = {}));
Pr.Mainnet;
const Tx = {
  chainId: Nr.Mainnet,
  transactionVersion: Pr.Mainnet,
  peerNetworkId: vo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Or.MainnetSingleSig,
    multiSig: Or.MainnetMultiSig
  },
  client: { baseUrl: Xh }
}, cc = {
  chainId: Nr.Testnet,
  transactionVersion: Pr.Testnet,
  peerNetworkId: vo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Or.TestnetSingleSig,
    multiSig: Or.TestnetMultiSig
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
    if (b0(e, r))
      return r;
    throw n(r);
  }
};
const Px = 128, Ox = 128, x0 = 16, $r = 32, lc = 80, ta = 65, Dx = 32, Fx = 64, Io = 34, jx = 1 + 16 * 1024 * 1024, zx = 165, Rx = 16, Gx = 16, Vx = 20, Kx = Gx + 2 + Vx, qx = Kx + 4, Wx = jx + (zx + Rx * qx);
var bt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(bt || (bt = {}));
var uc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(uc || (uc = {}));
var xe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xe || (xe = {}));
const Ca = ["onChainOnly", "offChainOnly", "any"];
Ca[0] + "", xe.OnChainOnly, Ca[1] + "", xe.OffChainOnly, Ca[2] + "", xe.Any, xe.OnChainOnly + "", xe.OnChainOnly, xe.OffChainOnly + "", xe.OffChainOnly, xe.Any + "", xe.Any;
var Lo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Lo || (Lo = {}));
var kt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kt || (kt = {}));
var Nt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Nt || (Nt = {}));
var At;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(At || (At = {}));
var Ut;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ut || (Ut = {}));
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
var ae;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ae || (ae = {}));
var yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yf || (yf = {}));
var dc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(dc || (dc = {}));
var De;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(De || (De = {}));
var wf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(wf || (wf = {}));
let ea = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, fs = class extends ea {
  constructor(e) {
    super(e);
  }
}, ie = class extends ea {
  constructor(e) {
    super(e);
  }
}, Co = class extends ea {
  constructor(e) {
    super(e);
  }
}, mr = class extends ea {
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
const Sr = {
  number: pc,
  bool: Xx,
  bytes: m0,
  hash: Yx,
  exists: Zx,
  output: Qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ka = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qe = (t, e) => t << 32 - e | t >>> e, Jx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Yr(t) {
  const e = (r) => t().update(bl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let E0 = class extends S0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Sr.hash(e);
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
    Sr.exists(this);
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
    Sr.exists(this), Sr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    em(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ka(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
]), Rn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Gn = new Uint32Array(64);
let $0 = class extends xl {
  constructor() {
    super(64, 32, 8, !1), this.A = Rn[0] | 0, this.B = Rn[1] | 0, this.C = Rn[2] | 0, this.D = Rn[3] | 0, this.E = Rn[4] | 0, this.F = Rn[5] | 0, this.G = Rn[6] | 0, this.H = Rn[7] | 0;
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
      Gn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Gn[l - 15], f = Gn[l - 2], y = Qe(g, 7) ^ Qe(g, 18) ^ g >>> 3, w = Qe(f, 17) ^ Qe(f, 19) ^ f >>> 10;
      Gn[l] = w + Gn[l - 7] + y + Gn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Qe(a, 6) ^ Qe(a, 11) ^ Qe(a, 25), f = d + g + nm(a, c, u) + sm[l] + Gn[l] | 0, w = (Qe(r, 2) ^ Qe(r, 13) ^ Qe(r, 22)) + rm(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Gn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, im = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ml = Yr(() => new $0());
Yr(() => new im());
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = um[f], $ = fm[f], T = Sl[f], _ = El[f], b = cm[f], v = lm[f];
      for (let A = 0; A < 16; A++) {
        const O = zi(r + bf(f, i, a, u) + Ri[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = zi(a, 10) | 0, a = i, i = O;
      }
      for (let A = 0; A < 16; A++) {
        const O = zi(s + bf(y, o, c, d) + Ri[_[A]] + $, v[A]) + g | 0;
        s = g, g = d, d = zi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ri.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const dm = Yr(() => new hm()), Gi = BigInt(2 ** 32 - 1), gc = BigInt(32);
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
const km = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Tm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _m = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Um = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
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
}, [Hm, Nm] = nt.split([
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
].map((t) => BigInt(t))), Vn = new Uint32Array(80), Kn = new Uint32Array(80);
let na = class extends xl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Vn[b] = e.getUint32(n), Kn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Vn[b - 15] | 0, A = Kn[b - 15] | 0, O = nt.rotrSH(v, A, 1) ^ nt.rotrSH(v, A, 8) ^ nt.shrSH(v, A, 7), V = nt.rotrSL(v, A, 1) ^ nt.rotrSL(v, A, 8) ^ nt.shrSL(v, A, 7), F = Vn[b - 2] | 0, z = Kn[b - 2] | 0, x = nt.rotrSH(F, z, 19) ^ nt.rotrBH(F, z, 61) ^ nt.shrSH(F, z, 6), L = nt.rotrSL(F, z, 19) ^ nt.rotrBL(F, z, 61) ^ nt.shrSL(F, z, 6), H = nt.add4L(V, L, Kn[b - 7], Kn[b - 16]), q = nt.add4H(H, O, x, Vn[b - 7], Vn[b - 16]);
      Vn[b] = q | 0, Kn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const v = nt.rotrSH(l, g, 14) ^ nt.rotrSH(l, g, 18) ^ nt.rotrBH(l, g, 41), A = nt.rotrSL(l, g, 14) ^ nt.rotrSL(l, g, 18) ^ nt.rotrBL(l, g, 41), O = l & f ^ ~l & w, V = g & y ^ ~g & $, F = nt.add5L(_, A, V, Nm[b], Kn[b]), z = nt.add5H(F, T, v, O, Hm[b], Vn[b]), x = F | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), H = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = nt.add(u | 0, d | 0, z | 0, x | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = nt.add3L(x, H, Q);
      r = nt.add3H(R, z, L, q), s = R | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = nt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = nt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = nt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = nt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Vn.fill(0), Kn.fill(0);
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
Yr(() => new na());
Yr(() => new Pm());
const Fm = Yr(() => new Om());
Yr(() => new Dm());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var Gt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Gt || (Gt = {}));
function Al(t) {
  return Gt[t];
}
const jm = () => ({ type: lt.BoolTrue }), zm = () => ({ type: lt.BoolFalse }), Rm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: lt.Buffer, value: Y(t) };
}, xf = BigInt("0xffffffffffffffffffffffffffffffff"), Gm = BigInt(0), mf = BigInt("0x7fffffffffffffffffffffffffffffff"), Sf = BigInt("-170141183460469231731687303715884105728"), Vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = qa(pt(t))), pe(t, Uint8Array) && (t = qa(t));
  const e = ee(t);
  if (e > mf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${mf}`);
  if (e < Sf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Sf}`);
  return { type: lt.Int, value: e };
}, Km = (t) => {
  const e = ee(t);
  if (e < Gm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > xf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${xf}`);
  return { type: lt.UInt, value: e };
};
function qm(t) {
  return { type: lt.List, value: t };
}
function C0() {
  return { type: lt.OptionalNone };
}
function k0(t) {
  return { type: lt.OptionalSome, value: t };
}
var D;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(D || (D = {}));
function Wm() {
  return {
    type: D.Address,
    version: Or.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ef(t) {
  if (t && O0(t, Io))
    throw new Error(`Memo exceeds maximum length of ${Io} bytes`);
  return { type: D.MemoString, content: t };
}
function $l(t, e) {
  return {
    type: D.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function yc(t) {
  if (pt(t).byteLength != ta)
    throw Error("Invalid signature");
  return {
    type: D.MessageSignature,
    data: t
  };
}
function Xm(t, e, n) {
  return typeof t == "string" && (t = fS(t)), typeof n == "string" && (n = Ef(n)), {
    type: D.Payload,
    payloadType: bt.TokenTransfer,
    recipient: t,
    amount: ee(e),
    memo: n ?? Ef("")
  };
}
function Ym(t, e, n, r) {
  return typeof e == "string" && (e = ze(e)), typeof n == "string" && (n = ze(n)), {
    type: D.Payload,
    payloadType: bt.ContractCall,
    contractAddress: typeof t == "string" ? fr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Zm(t) {
  return ze(t, 4, 1e5);
}
function Af(t, e, n) {
  return typeof t == "string" && (t = ze(t)), typeof e == "string" && (e = Zm(e)), typeof n == "number" ? {
    type: D.Payload,
    payloadType: bt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: D.Payload,
    payloadType: bt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Qm() {
  return { type: D.Payload, payloadType: bt.PoisonMicroblock };
}
function $f(t, e) {
  if (t.byteLength != $r)
    throw Error(`Coinbase buffer size must be ${$r} bytes`);
  return e != null ? {
    type: D.Payload,
    payloadType: bt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: D.Payload,
    payloadType: bt.Coinbase,
    coinbaseBytes: t
  };
}
function Jm(t, e, n) {
  if (t.byteLength != $r)
    throw Error(`Coinbase buffer size must be ${$r} bytes`);
  if (n.byteLength != lc)
    throw Error(`VRF proof buffer size must be ${lc} bytes`);
  return {
    type: D.Payload,
    payloadType: bt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === lt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function tS(t, e, n, r, s, i, o) {
  return {
    type: D.Payload,
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
function ze(t, e, n) {
  const r = e || 1, s = n || Px;
  if (O0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: D.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function eS(t, e, n) {
  return {
    type: D.Asset,
    address: fr(t),
    contractName: ze(e),
    assetName: ze(n)
  };
}
function fr(t) {
  const e = Xr.c32addressDecode(t);
  return {
    type: D.Address,
    version: e[0],
    hash160: e[1]
  };
}
function nS(t, e) {
  const n = fr(t), r = ze(e);
  return {
    type: D.Principal,
    prefix: ae.Contract,
    address: n,
    contractName: r
  };
}
function rS(t) {
  const e = fr(t);
  return {
    type: D.Principal,
    prefix: ae.Standard,
    address: e
  };
}
function hs(t, e) {
  return {
    pubKeyEncoding: t,
    type: D.TransactionAuthField,
    contents: e
  };
}
function mn(t) {
  switch (t.type) {
    case D.Address:
      return Ei(t);
    case D.Principal:
      return B0(t);
    case D.LengthPrefixedString:
      return ks(t);
    case D.MemoString:
      return iS(t);
    case D.Asset:
      return T0(t);
    case D.PostCondition:
      return U0(t);
    case D.PublicKey:
      return xc(t);
    case D.LengthPrefixedList:
      return vl(t);
    case D.Payload:
      return H0(t);
    case D.TransactionAuthField:
      return uS(t);
    case D.MessageSignature:
      return Il(t);
  }
}
function Ei(t) {
  const e = [];
  return e.push(pt(yi(t.version, 1))), e.push(pt(t.hash160)), jt(e);
}
function Cs(t) {
  const e = pe(t, It) ? t : new It(t), n = jo(Y(e.readBytes(1))), r = Y(e.readBytes(20));
  return { type: D.Address, version: n, hash160: r };
}
function B0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ae.Standard || t.prefix === ae.Contract) && e.push(Ei(t.address)), t.prefix === ae.Contract && e.push(ks(t.contractName)), jt(e);
}
function sS(t) {
  const e = pe(t, It) ? t : new It(t), n = e.readUInt8Enum(ae, (i) => {
    throw new ie(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ae.Origin)
    return { type: D.Principal, prefix: n };
  const r = Cs(e);
  if (n === ae.Standard)
    return { type: D.Principal, prefix: n, address: r };
  const s = Me(e);
  return {
    type: D.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ks(t) {
  const e = [], n = Vr(t.content), r = n.byteLength;
  return e.push(pt(yi(r, t.lengthPrefixBytes))), e.push(n), jt(e);
}
function Me(t, e, n) {
  e = e || 1;
  const r = pe(t, It) ? t : new It(t), s = jo(Y(r.readBytes(e))), i = wi(r.readBytes(s));
  return ze(i, e, n ?? 128);
}
function iS(t) {
  const e = [], n = Vr(t.content), r = _S(Y(n), Io * 2);
  return e.push(pt(r)), jt(e);
}
function M0(t) {
  const e = pe(t, It) ? t : new It(t);
  let n = wi(e.readBytes(Io));
  return n = n.replace(/\u0000*$/, ""), { type: D.MemoString, content: n };
}
function T0(t) {
  const e = [];
  return e.push(Ei(t.address)), e.push(ks(t.contractName)), e.push(ks(t.assetName)), jt(e);
}
function wc(t) {
  const e = pe(t, It) ? t : new It(t);
  return {
    type: D.Asset,
    address: Cs(e),
    contractName: Me(e),
    assetName: Me(e)
  };
}
function vl(t) {
  const e = t.values, n = [];
  n.push(pt(yi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(mn(r));
  return jt(n);
}
function _0(t, e, n) {
  const r = pe(t, It) ? t : new It(t), s = jo(Y(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case D.Address:
        i.push(Cs(r));
        break;
      case D.LengthPrefixedString:
        i.push(Me(r));
        break;
      case D.MemoString:
        i.push(M0(r));
        break;
      case D.Asset:
        i.push(wc(r));
        break;
      case D.PostCondition:
        i.push(aS(r));
        break;
      case D.PublicKey:
        i.push(mc(r));
        break;
      case D.TransactionAuthField:
        i.push(lS(r));
        break;
    }
  return $l(i, n);
}
function oS(t) {
  return Y(U0(t));
}
function U0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(B0(t.principal)), (t.conditionType === kt.Fungible || t.conditionType === kt.NonFungible) && e.push(T0(t.asset)), t.conditionType === kt.NonFungible && e.push(sn(t.assetName)), e.push(t.conditionCode), t.conditionType === kt.STX || t.conditionType === kt.Fungible || t.conditionType === kt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new fs("The post-condition amount may not be larger than 8 bytes");
    e.push(lr(t.amount, 8));
  }
  return jt(e);
}
function aS(t) {
  const e = pe(t, It) ? t : new It(t), n = e.readUInt8Enum(kt, (a) => {
    throw new ie(`Could not read ${a} as PostConditionType`);
  }), r = sS(e);
  let s, i, o;
  switch (n) {
    case kt.STX:
      return s = e.readUInt8Enum(Js, (c) => {
        throw new ie(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: kt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.Fungible:
      return i = wc(e), s = e.readUInt8Enum(Js, (c) => {
        throw new ie(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: kt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case kt.NonFungible:
      i = wc(e);
      const a = nn(e);
      return s = e.readUInt8Enum(fc, (c) => {
        throw new ie(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: D.PostCondition,
        conditionType: kt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case kt.Staking:
      return s = e.readUInt8Enum(Js, (c) => {
        throw new ie(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Y(e.readBytes(8))}`), {
        type: D.PostCondition,
        conditionType: kt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.PoX: {
      const c = e.readUInt8Enum(hc, (u) => {
        throw new ie(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: D.PostCondition,
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
      e.push(sn(t.recipient)), e.push(lr(t.amount, 8)), e.push(mn(t.memo));
      break;
    case bt.ContractCall:
      e.push(mn(t.contractAddress)), e.push(mn(t.contractName)), e.push(mn(t.functionName));
      const n = new Uint8Array(4);
      Cr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(sn(r));
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
      e.push(t.coinbaseBytes), e.push(sn(t.recipient));
      break;
    case bt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(sn(t.recipient ? k0(t.recipient) : C0())), e.push(t.vrfProof);
      break;
    case bt.TenureChange:
      e.push(pt(t.tenureHash)), e.push(pt(t.previousTenureHash)), e.push(pt(t.burnViewHash)), e.push(pt(t.previousTenureEnd)), e.push(Cr(new Uint8Array(4), t.previousTenureBlocks)), e.push(nw(new Uint8Array(1), t.cause)), e.push(pt(t.publicKeyHash));
      break;
  }
  return jt(e);
}
function cS(t) {
  const e = pe(t, It) ? t : new It(t);
  switch (e.readUInt8Enum(bt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case bt.TokenTransfer:
      const r = nn(e), s = ee(e.readBytes(8)), i = M0(e);
      return Xm(r, s, i);
    case bt.ContractCall:
      const o = Cs(e), a = Me(e), c = Me(e), u = [], d = e.readUInt32BE();
      for (let v = 0; v < d; v++) {
        const A = nn(e);
        u.push(A);
      }
      return Ym(o, a, c, u);
    case bt.SmartContract:
      const l = Me(e), g = Me(e, 4, 1e5);
      return Af(l, g);
    case bt.VersionedSmartContract: {
      const v = e.readUInt8Enum(uc, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), A = Me(e), O = Me(e, 4, Wx);
      return Af(A, O, v);
    }
    case bt.PoisonMicroblock:
      return Qm();
    case bt.Coinbase: {
      const v = e.readBytes($r);
      return $f(v);
    }
    case bt.CoinbaseToAltRecipient: {
      const v = e.readBytes($r), A = nn(e);
      return $f(v, A);
    }
    case bt.NakamotoCoinbase: {
      const v = e.readBytes($r), A = nn(e), O = e.readBytes(lc);
      return Jm(v, A, O);
    }
    case bt.TenureChange:
      const f = Y(e.readBytes(20)), y = Y(e.readBytes(20)), w = Y(e.readBytes(20)), $ = Y(e.readBytes(32)), T = e.readUInt32BE(), _ = e.readUInt8Enum(dc, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), b = Y(e.readBytes(20));
      return tS(f, y, w, $, T, _, b);
  }
}
function bc(t) {
  const e = pe(t, It) ? t : new It(t);
  return yc(Y(e.readBytes(ta)));
}
function lS(t) {
  const e = pe(t, It) ? t : new It(t), n = e.readUInt8Enum(De, (r) => {
    throw new ie(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case De.PublicKeyCompressed:
      return hs(Ut.Compressed, mc(e));
    case De.PublicKeyUncompressed:
      return hs(Ut.Uncompressed, Ps(GS(mc(e).data)));
    case De.SignatureCompressed:
      return hs(Ut.Compressed, bc(e));
    case De.SignatureUncompressed:
      return hs(Ut.Uncompressed, bc(e));
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
    case D.PublicKey:
      e.push(t.pubKeyEncoding === Ut.Compressed ? De.PublicKeyCompressed : De.PublicKeyUncompressed), e.push(pt(RS(t.contents.data)));
      break;
    case D.MessageSignature:
      e.push(t.pubKeyEncoding === Ut.Compressed ? De.SignatureCompressed : De.SignatureUncompressed), e.push(Il(t.contents));
      break;
  }
  return jt(e);
}
function xc(t) {
  return t.data.slice();
}
function mc(t) {
  const e = pe(t, It) ? t : new It(t), n = e.readUInt8(), r = n === 4 ? Fx : Dx;
  return Ps(jt([n, e.readBytes(r)]));
}
function Ll(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === At.P2PKH || e === At.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === At.P2WPKH || e === At.P2WSH || e === At.P2WSHNonSequential) && !r.map((s) => s.data).every(Os))
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
  return { type: D.Address, version: t, hash160: e };
}
function Cl(t) {
  return Xr.c32address(t.version, t.hash160);
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
  const e = fr(t);
  return { type: lt.PrincipalStandard, value: Cl(e) };
}
function dS(t) {
  return { type: lt.PrincipalStandard, value: Cl(t) };
}
function pS(t, e) {
  const n = fr(t), r = ze(e);
  return N0(n, r);
}
function N0(t, e) {
  if (Vr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: lt.PrincipalContract,
    value: `${Cl(t)}.${e.content}`
  };
}
function gS(t) {
  return { type: lt.ResponseErr, value: t };
}
function yS(t) {
  return { type: lt.ResponseOk, value: t };
}
const wS = (t) => ({ type: lt.StringASCII, value: t }), bS = (t) => ({ type: lt.StringUTF8, value: t });
function xS(t) {
  for (const e in t)
    if (!OS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: lt.Tuple, value: t };
}
function nn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new It(pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new It(t) : e = t;
  switch (e.readUInt8Enum(Gt, (r) => {
    throw new ie(`Cannot recognize Clarity Type: ${r}`);
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
      const s = Cs(e);
      return dS(s);
    case Gt.contract:
      const i = Cs(e), o = Me(e);
      return N0(i, o);
    case Gt.ok:
      return yS(nn(e));
    case Gt.err:
      return gS(nn(e));
    case Gt.none:
      return C0();
    case Gt.some:
      return k0(nn(e));
    case Gt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(nn(e));
      return qm(c);
    case Gt.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const $ = Me(e).content;
        if ($ === void 0)
          throw new ie('"content" is undefined');
        d[$] = nn(e);
      }
      return xS(d);
    case Gt.ascii:
      const l = e.readUInt32BE(), g = Wy(e.readBytes(l));
      return wS(g);
    case Gt.utf8:
      const f = e.readUInt32BE(), y = wi(e.readBytes(f));
      return bS(y);
    default:
      throw new ie("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ln(t, e) {
  return jt([Al(t), e]);
}
function mS(t) {
  return new Uint8Array([Al(t.type)]);
}
function SS(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Al(t.type)]) : ln(t.type, sn(t.value));
}
function ES(t) {
  const e = new Uint8Array(4);
  return Cr(e, Math.ceil(t.value.length / 2), 0), ln(t.type, an(e, pt(t.value)));
}
function AS(t) {
  const e = Qc(Ry(BigInt(t.value), BigInt(Ox)), x0);
  return ln(t.type, e);
}
function $S(t) {
  const e = Qc(BigInt(t.value), x0);
  return ln(t.type, e);
}
function vS(t) {
  return ln(t.type, Ei(fr(t.value)));
}
function IS(t) {
  const [e, n] = DS(t.value);
  return ln(t.type, an(Ei(fr(e)), ks(ze(n))));
}
function LS(t) {
  return ln(t.type, sn(t.value));
}
function CS(t) {
  const e = [], n = new Uint8Array(4);
  Cr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = sn(r);
    e.push(s);
  }
  return ln(t.type, jt(e));
}
function kS(t) {
  const e = [], n = new Uint8Array(4);
  Cr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ze(s);
    e.push(ks(i));
    const o = sn(t.value[s]);
    e.push(o);
  }
  return ln(t.type, jt(e));
}
function P0(t, e) {
  const n = [], r = e == "ascii" ? qy(t.value) : Vr(t.value), s = new Uint8Array(4);
  return Cr(s, r.length, 0), n.push(s), n.push(r), ln(t.type, jt(n));
}
function BS(t) {
  return P0(t, "ascii");
}
function MS(t) {
  return P0(t, "utf8");
}
function If(t) {
  return Y(sn(t));
}
function sn(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return mS(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return SS(t);
    case lt.Buffer:
      return ES(t);
    case lt.UInt:
      return $S(t);
    case lt.Int:
      return AS(t);
    case lt.PrincipalStandard:
      return vS(t);
    case lt.PrincipalContract:
      return IS(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return LS(t);
    case lt.List:
      return CS(t);
    case lt.Tuple:
      return kS(t);
    case lt.StringASCII:
      return BS(t);
    case lt.StringUTF8:
      return MS(t);
    default:
      throw new fs("Unable to serialize. Invalid Clarity Value.");
  }
}
const TS = (t) => t.length % 2 ? `0${t}` : t, _S = (t, e) => t.padEnd(e, "0"), O0 = (t, e) => t ? Vr(t).length > e : !1;
function Sc(t) {
  return g0(t);
}
const ii = (t) => dm(ml(t)), kl = (t) => Y(Fm(t)), US = (t) => Y(ii(t)), HS = (t) => {
  const e = ii(t), n = an(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ii(n);
  return Y(r);
}, NS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = jt(n), s = ii(r);
  return Y(s);
}, PS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = jt(n), s = ml(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = jt(i), a = ii(o);
  return Y(a);
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
Ot.hmacSha256Sync = (t, ...e) => {
  const n = A0.create(ml, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ps(t) {
  return t = typeof t == "string" ? pt(t) : t, {
    type: D.PublicKey,
    data: t
  };
}
function FS(t, e, n = Ut.Compressed) {
  const r = Qy(e), s = new Ae(vu(r.r), vu(r.s)), i = ot.fromSignature(t, s, r.recoveryId), o = n === Ut.Compressed;
  return i.toHex(o);
}
function jS(t) {
  return typeof t == "string" ? t : Y(t);
}
const Bl = jS;
function D0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Zy;
}
function Os(t) {
  return !Bl(t).startsWith("04");
}
function zS(t) {
  t = Jc(t);
  const e = D0(t);
  return Y(bi(t.slice(0, 32), e));
}
function RS(t) {
  return ot.fromHex(Bl(t)).toHex(!0);
}
function GS(t) {
  return ot.fromHex(Bl(t)).toHex(!1);
}
function VS(t, e) {
  t = Jc(t);
  const [n, r] = Ro(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return yi(r, 1) + Ae.fromHex(n).toCompactHex();
}
function Ml() {
  return {
    type: D.MessageSignature,
    data: Y(new Uint8Array(ta))
  };
}
function F0(t, e, n, r) {
  const s = Ll(0, t, 1, [Ps(e)]).hash160, i = Os(e) ? Ut.Compressed : Ut.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ee(n),
    fee: ee(r),
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
    lr(t.nonce, 8),
    lr(t.fee, 8),
    t.keyEncoding,
    Il(t.signature)
  ];
  return jt(e);
}
function WS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    lr(t.nonce, 8),
    lr(t.fee, 8)
  ], n = $l(t.fields);
  e.push(vl(n));
  const r = new Uint8Array(2);
  return tw(r, t.signaturesRequired, 0), e.push(r), jt(e);
}
function XS(t, e) {
  const n = Y(e.readBytes(20)), r = BigInt(`0x${Y(e.readBytes(8))}`), s = BigInt(`0x${Y(e.readBytes(8))}`), i = e.readUInt8Enum(Ut, (a) => {
    throw new ie(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === At.P2WPKH && i != Ut.Compressed)
    throw new ie("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = Y(e.readBytes(20)), r = BigInt("0x" + Y(e.readBytes(8))), s = BigInt("0x" + Y(e.readBytes(8))), i = _0(e, D.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case D.PublicKey:
        Os(u.contents.data) || (o = !0);
        break;
      case D.MessageSignature:
        if (u.pubKeyEncoding === Ut.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new mr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === At.P2WSH || t === At.P2WSHNonSequential))
    throw new mr("Uncompressed keys are not allowed in this hash mode");
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
    throw new ie(`Could not parse ${n} as AddressHashMode`);
  });
  return e === At.P2PKH || e === At.P2WPKH ? XS(e, t) : YS(e, t);
}
function j0(t, e, n, r) {
  const i = t + Y(new Uint8Array([e])) + Y(lr(n, 8)) + Y(lr(r, 8));
  if (pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return kl(pt(i));
}
function z0(t, e, n) {
  const r = 33 + ta, s = Os(e.data) ? Ut.Compressed : Ut.Uncompressed, i = t + TS(s.toString(16)) + n, o = pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return kl(o);
}
function ZS(t, e, n, r, s) {
  const i = j0(t, e, n, r), o = VS(s, i), a = Ps(zS(s)), c = z0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function R0(t, e, n, r, s, i) {
  const o = j0(t, e, n, r), a = Ps(FS(o, i, s)), c = z0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function QS() {
  const t = F0(At.P2PKH, "", 0, 0);
  return t.signer = Wm().hash160, t.keyEncoding = Ut.Compressed, t.signature = Ml(), t;
}
function kf(t, e, n) {
  return oi(t) ? JS(t, e, n) : t3(t, e, n);
}
function JS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = R0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Ll(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new mr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function t3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case D.PublicKey:
        Os(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case D.MessageSignature:
        c.pubKeyEncoding === Ut.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = R0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Lf(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new mr("Too many signatures");
        break;
    }
  if (Lf(t.hashMode) && o !== t.signaturesRequired || KS(t.hashMode) && o < t.signaturesRequired)
    throw new mr("Incorrect number of signatures");
  if (i && (t.hashMode === At.P2WSH || t.hashMode === At.P2WSHNonSequential))
    throw new mr("Uncompressed keys are not allowed in this hash mode");
  const a = Ll(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new mr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function G0(t) {
  return {
    authType: Nt.Standard,
    spendingCondition: t
  };
}
function V0(t, e) {
  return {
    authType: Nt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || F0(At.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Bf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Nt.Standard:
        return G0(Cf(t.spendingCondition));
      case Nt.Sponsored:
        return V0(Cf(t.spendingCondition), QS());
      default:
        throw new Co("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function e3(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      return kf(t.spendingCondition, e, Nt.Standard);
    case Nt.Sponsored:
      return kf(t.spendingCondition, e, Nt.Standard);
    default:
      throw new Co("Invalid origin auth type");
  }
}
function n3(t, e) {
  switch (t.authType) {
    case Nt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ee(e)
      };
      return { ...t, spendingCondition: n };
    case Nt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ee(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function r3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ee(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function s3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ee(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function i3(t, e) {
  const n = {
    ...e,
    nonce: ee(e.nonce),
    fee: ee(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function o3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Nt.Standard:
      e.push(Ba(t.spendingCondition));
      break;
    case Nt.Sponsored:
      e.push(Ba(t.spendingCondition)), e.push(Ba(t.sponsorSpendingCondition));
      break;
  }
  return jt(e);
}
function a3(t) {
  const e = t.readUInt8Enum(Nt, (r) => {
    throw new ie(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Nt.Standard:
      return n = Ma(t), G0(n);
    case Nt.Sponsored:
      n = Ma(t);
      const r = Ma(t);
      return V0(n, r);
  }
}
class c3 {
  constructor({ auth: e, payload: n, postConditions: r = $l([]), postConditionMode: s = Lo.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Hx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ee(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = xe.Any;
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
    return this.signAndAppend(this.auth.spendingCondition, e, Nt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Nt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Nt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Ps(e), r = this.auth.spendingCondition;
    if (r && !oi(r)) {
      const s = Os(n.data);
      r.fields.push(hs(s ? Ut.Compressed : Ut.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ZS(n, r, e.fee, e.nonce, s);
    if (oi(e))
      e.signature = yc(i);
    else {
      const a = D0(s);
      e.fields.push(hs(a ? Ut.Compressed : Ut.Uncompressed, yc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return kl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Nt.Sponsored)
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
    if (this.auth.authType != Nt.Sponsored)
      throw new Co("Cannot sponsor sign a non-sponsored transaction");
    this.auth = s3(this.auth, e);
  }
  serialize() {
    return Y(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new fs('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new fs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new fs('"auth" is undefined');
    if (this.payload === void 0)
      throw new fs('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Cr(n, this.chainId, 0), e.push(n), e.push(o3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(vl(this.postConditions)), e.push(H0(this.payload)), jt(e);
  }
}
function l3(t) {
  const e = pe(t, It) ? t : new It(t), n = e.readUInt8Enum(Pr, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = a3(e), i = e.readUInt8Enum(xe, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Lo, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = _0(e, D.PostCondition), c = cS(e), u = new c3({
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
  const e = ee(t);
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
        type: D.PostCondition,
        conditionType: kt.STX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ae.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount)
      };
    case "ft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: kt.Fungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ae.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount),
        asset: vf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: D.PostCondition,
        conditionType: kt.NonFungible,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ae.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        asset: vf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: D.PostCondition,
        conditionType: kt.Staking,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ae.Origin } : qs(t.address),
        conditionCode: Ki(t.condition),
        amount: Ta(t.amount)
      };
    case "pox-postcondition":
      return {
        type: D.PostCondition,
        conditionType: kt.PoX,
        principal: t.address === "origin" ? { type: D.Principal, prefix: ae.Origin } : qs(t.address),
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
var Oe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Oe || (Oe = {}));
const _a = ["onChainOnly", "offChainOnly", "any"];
_a[0] + "", Oe.OnChainOnly, _a[1] + "", Oe.OffChainOnly, _a[2] + "", Oe.Any, Oe.OnChainOnly + "", Oe.OnChainOnly, Oe.OffChainOnly + "", Oe.OffChainOnly, Oe.Any + "", Oe.Any;
var Ic;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ic || (Ic = {}));
Ic.Mainnet;
var Hf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Hf || (Hf = {}));
var yr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yr || (yr = {}));
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
const Ha = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Je = (t, e) => t << 32 - e | t >>> e, $3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Zr(t) {
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
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T3[f], $ = _3[f], T = Pl[f], _ = Ol[f], b = B3[f], v = M3[f];
      for (let A = 0; A < 16; A++) {
        const O = qi(r + Gf(f, i, a, u) + Wi[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = qi(a, 10) | 0, a = i, i = O;
      }
      for (let A = 0; A < 16; A++) {
        const O = qi(s + Gf(y, o, c, d) + Wi[_[A]] + $, v[A]) + g | 0;
        s = g, g = d, d = qi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Wi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Zr(() => new U3());
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
let J0 = class extends Nl {
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
      const g = Wn[l - 15], f = Wn[l - 2], y = Je(g, 7) ^ Je(g, 18) ^ g >>> 3, w = Je(f, 17) ^ Je(f, 19) ^ f >>> 10;
      Wn[l] = w + Wn[l - 7] + y + Wn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Je(a, 6) ^ Je(a, 11) ^ Je(a, 25), f = d + g + H3(a, c, u) + P3[l] + Wn[l] | 0, w = (Je(r, 2) ^ Je(r, 13) ^ Je(r, 22)) + N3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Wn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O3 = class extends J0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Zr(() => new J0());
Zr(() => new O3());
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
const t4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
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
}, [o4, a4] = rt.split([
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
let sa = class extends Nl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Xn[b] = e.getUint32(n), Yn[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Xn[b - 15] | 0, A = Yn[b - 15] | 0, O = rt.rotrSH(v, A, 1) ^ rt.rotrSH(v, A, 8) ^ rt.shrSH(v, A, 7), V = rt.rotrSL(v, A, 1) ^ rt.rotrSL(v, A, 8) ^ rt.shrSL(v, A, 7), F = Xn[b - 2] | 0, z = Yn[b - 2] | 0, x = rt.rotrSH(F, z, 19) ^ rt.rotrBH(F, z, 61) ^ rt.shrSH(F, z, 6), L = rt.rotrSL(F, z, 19) ^ rt.rotrBL(F, z, 61) ^ rt.shrSL(F, z, 6), H = rt.add4L(V, L, Yn[b - 7], Yn[b - 16]), q = rt.add4H(H, O, x, Xn[b - 7], Xn[b - 16]);
      Xn[b] = q | 0, Yn[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const v = rt.rotrSH(l, g, 14) ^ rt.rotrSH(l, g, 18) ^ rt.rotrBH(l, g, 41), A = rt.rotrSL(l, g, 14) ^ rt.rotrSL(l, g, 18) ^ rt.rotrBL(l, g, 41), O = l & f ^ ~l & w, V = g & y ^ ~g & $, F = rt.add5L(_, A, V, a4[b], Yn[b]), z = rt.add5H(F, T, v, O, o4[b], Xn[b]), x = F | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), H = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = rt.add(u | 0, d | 0, z | 0, x | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = rt.add3L(x, H, Q);
      r = rt.add3H(R, z, L, q), s = R | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = rt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = rt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = rt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Xn.fill(0), Yn.fill(0);
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
Zr(() => new sa());
Zr(() => new c4());
Zr(() => new l4());
Zr(() => new u4());
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
var qt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(qt || (qt = {}));
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
  if (e.push(t.conditionType), e.push(d4(t.principal)), (t.conditionType === yr.Fungible || t.conditionType === yr.NonFungible) && e.push(p4(t.assetInfo)), t.conditionType === yr.NonFungible && e.push(Dr(t.assetName)), e.push(t.conditionCode), t.conditionType === yr.STX || t.conditionType === yr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ep("The post-condition amount may not be larger than 8 bytes");
    e.push(h3(t.amount, !1, 8));
  }
  return Cn(e);
}
function un(t, e) {
  return Cn([t, e]);
}
function g4(t) {
  return new Uint8Array([t.type]);
}
function y4(t) {
  return t.type === qt.OptionalNone ? new Uint8Array([t.type]) : un(t.type, Dr(t.value));
}
function w4(t) {
  const e = new Uint8Array(4);
  return ra(e, t.buffer.length, 0), un(t.type, Hl(e, t.buffer));
}
function b4(t) {
  const e = _l(d3(t.value, BigInt(x3)), W0);
  return un(t.type, e);
}
function x4(t) {
  const e = _l(t.value, W0);
  return un(t.type, e);
}
function m4(t) {
  return un(t.type, ia(t.address));
}
function S4(t) {
  return un(t.type, Hl(ia(t.address), ci(t.contractName)));
}
function E4(t) {
  return un(t.type, Dr(t.value));
}
function A4(t) {
  const e = [], n = new Uint8Array(4);
  ra(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Dr(r);
    e.push(s);
  }
  return un(t.type, Cn(e));
}
function $4(t) {
  const e = [], n = new Uint8Array(4);
  ra(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = f4(s);
    e.push(ci(i));
    const o = Dr(t.data[s]);
    e.push(o);
  }
  return un(t.type, Cn(e));
}
function rp(t, e) {
  const n = [], r = e == "ascii" ? y3(t.data) : Ul(t.data), s = new Uint8Array(4);
  return ra(s, r.length, 0), n.push(s), n.push(r), un(t.type, Cn(n));
}
function v4(t) {
  return rp(t, "ascii");
}
function I4(t) {
  return rp(t, "utf8");
}
function Dr(t) {
  switch (t.type) {
    case qt.BoolTrue:
    case qt.BoolFalse:
      return g4(t);
    case qt.OptionalNone:
    case qt.OptionalSome:
      return y4(t);
    case qt.Buffer:
      return w4(t);
    case qt.UInt:
      return x4(t);
    case qt.Int:
      return b4(t);
    case qt.PrincipalStandard:
      return m4(t);
    case qt.PrincipalContract:
      return S4(t);
    case qt.ResponseOk:
    case qt.ResponseErr:
      return E4(t);
    case qt.List:
      return A4(t);
    case qt.Tuple:
      return $4(t);
    case qt.StringASCII:
      return v4(t);
    case qt.StringUTF8:
      return I4(t);
    default:
      throw new ep("Unable to serialize. Invalid Clarity Value.");
  }
}
const L4 = (t, e) => t ? Ul(t).length > e : !1, C4 = "connect-ui";
let lo, sp, me = !1, Bc = !1;
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
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Dl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Mc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
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
}, U4 = {}, H4 = (t) => t && t.$tag$ === U4, N4 = (t, e) => t != null && !Dl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, P4 = (t) => Ds(t).$hostElement$, O4 = (t, e, n) => {
  const r = te.ce(e, n);
  return t.dispatchEvent(r), r;
}, Kf = /* @__PURE__ */ new WeakMap(), D4 = (t, e, n) => {
  let r = ko.get(t);
  iE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ko.set(t, r);
}, F4 = (t, e, n, r) => {
  var s;
  let i = op(e);
  const o = ko.get(i);
  if (t = t.nodeType === 11 ? t : on, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Kf.get(t), c;
      if (a || Kf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = on.createElement("style"), c.innerHTML = o;
          const u = (s = te.$nonce$) !== null && s !== void 0 ? s : ip(on);
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
      const c = t.classList, u = Wf(n), d = Wf(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Xf(oa, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && te.rel(t, e, n, !1), r && te.ael(t, e, r, !1);
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
    o = s.$elm$ = on.createTextNode(s.$text$);
  else {
    if (me || (me = s.$tag$ === "svg"), o = s.$elm$ = on.createElementNS(me ? M4 : T4, s.$tag$), me && s.$tag$ === "foreignObject" && (me = !1), ap(null, s, me), _4(lo) && o["s-si"] !== lo && o.classList.add(o["s-si"] = lo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Fl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? me = !1 : o.tagName === "foreignObject" && (me = !0);
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
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : Yi(a, d) ? (Ws(a, d), a = e[++s], d = r[++i]) : Yi(c, l) ? (Ws(c, l), c = e[--o], l = r[--u]) : Yi(a, l) ? (Ws(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Yi(c, d) ? (Ws(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Fl(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? cp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && lp(e, s, o);
}, Yi = (t, e) => t.$tag$ === e.$tag$, Ws = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (me = i === "svg" ? !0 : i === "foreignObject" ? !1 : me, ap(t, e, me), r !== null && s !== null ? R4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), cp(n, null, e, s, 0, s.length - 1)) : r !== null && lp(r, 0, r.length - 1), me && i === "svg" && (me = !1)) : t.$text$ !== o && (n.data = o);
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
  hp(on.documentElement), Rl(() => O4(oa, "appload", { detail: { namespace: C4 } }));
}, X4 = (t, e) => t && t.then ? t.then(e) : e(), hp = (t) => t.classList.add("hydrated"), Y4 = (t, e) => Ds(t).$instanceValues$.get(e), Z4 = (t, e, n, r) => {
  const s = Ds(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
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
        te.jmp(() => {
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
  if (!(te.$flags$ & 1)) {
    const e = Ds(t), n = e.$cmpMeta$, r = Ln("connectedCallback", n.$tagName$);
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
  te.$flags$ & 1 || Ds(t);
}, eE = (t, e = {}) => {
  var n;
  const r = Ln(), s = [], i = e.exclude || [], o = oa.customElements, a = on.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ on.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(te, e), te.$resourcesUrl$ = new URL(e.resourcesUrl || "./", on.baseURI).href, t.map((f) => {
    f[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const $ = w.$tagName$, T = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, rE(_, w), w.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : te.jmp(() => J4(this));
        }
        disconnectedCallback() {
          te.jmp(() => tE(this));
        }
        componentOnReady() {
          return Ds(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = f[0], !i.includes($) && !o.get($) && (s.push($), o.define($, dp(
        T,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + B4, u.setAttribute("data-styles", "");
    const f = (n = te.$nonce$) !== null && n !== void 0 ? n : ip(on);
    f != null && u.setAttribute("nonce", f), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((f) => f.connectedCallback()) : te.jmp(() => l = setTimeout(fp, 30)), r();
}, zl = /* @__PURE__ */ new WeakMap(), Ds = (t) => zl.get(t), nE = (t, e) => zl.set(e.$lazyInstance$ = t, e), rE = (t, e) => {
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
}, ko = /* @__PURE__ */ new Map(), oa = typeof window < "u" ? window : {}, on = oa.document || { head: {} }, te = {
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
  t.push(n), Bc || (Bc = !0, te.$flags$ & 4 ? Rl(Tc) : te.raf(Tc));
}, Zf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      li(n);
    }
  t.length = 0;
}, Tc = () => {
  Zf(Yf), Zf(gp), (Bc = Yf.length > 0) && te.raf(Tc);
}, Rl = (t) => pp().then(t), aE = /* @__PURE__ */ oE(gp), cE = () => pp(), lE = (t, e) => typeof window > "u" ? Promise.resolve() : cE().then(() => eE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var uE = Object.defineProperty, fE = Object.defineProperties, hE = Object.getOwnPropertyDescriptors, Bo = Object.getOwnPropertySymbols, yp = Object.prototype.hasOwnProperty, wp = Object.prototype.propertyIsEnumerable, Qf = (t, e, n) => e in t ? uE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ve = (t, e) => {
  for (var n in e || (e = {})) yp.call(e, n) && Qf(t, n, e[n]);
  if (Bo) for (var n of Bo(e)) wp.call(e, n) && Qf(t, n, e[n]);
  return t;
}, Re = (t, e) => fE(t, hE(e)), bp = (t, e) => {
  var n = {};
  for (var r in t) yp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Bo) for (var r of Bo(t)) e.indexOf(r) < 0 && wp.call(t, r) && (n[r] = t[r]);
  return n;
};
function xp() {
  return Jo(_r()) || window.StacksProvider || window.BlockstackProvider;
}
function aa(t) {
  return t ? typeof t == "string" ? Hr.fromName(t) : "version" in t ? t : "url" in t ? new oc({ url: t.url }) : t.transactionVersion === Pr.Mainnet ? new oc({ url: t.client.baseUrl }) : new ac({ url: t.client.baseUrl }) : new ac();
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
  let e = Gl(t).loadUserData().appPrivateKey, n = Qt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function gE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Nr.Mainnet]: "mainnet", [Nr.Testnet]: "testnet" }, a = aa(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function yE(t) {
  let e = aa(t.network), n = Gl(t.userSession), r = Re(ve({}, t), { network: e, userSession: n });
  return ve({ stxAddress: gE(r) }, r);
}
async function wE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(K0) : n = n.map((r) => Y(np(r)))), new Qt.TokenSigner("ES256k", e).signAsync(Re(ve({}, t), { postConditions: n }));
}
function bE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(K0) : e = e.map((n) => Y(np(n)))), Qt.createUnsecuredToken(Re(ve({}, t), { postConditions: e }));
}
var xE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = pt(a.replace(/^0x/, "")), u = l3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Re(ve({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Re(ve({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, mE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = bp(e, ["amount", "appDetails", "userSession"]);
  if (mp(s)) {
    let { privateKey: a, publicKey: c } = Sp(s), u = Re(ve({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), wE(u, a);
  }
  let o = Re(ve({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), bE(o);
};
async function SE(t, e, n) {
  let r = await e(Re(ve(ve({}, yE(t)), t), { network: aa(t.network) }));
  return xE({ token: r, options: t }, n);
}
function EE(t, e = xp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return SE(t, mE, e);
}
function Ep(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Re(ve({}, t), { message: If(e), domain: If(n) }) : Re(ve({}, t), { message: Y(Dr(e)), domain: Y(Dr(n)) });
}
async function AE(t, e) {
  return new Qt.TokenSigner("ES256k", e).signAsync(Ep(t));
}
async function $E(t) {
  let e = t, { userSession: n } = e, r = bp(e, ["userSession"]);
  if (mp(n)) {
    let { privateKey: s, publicKey: i } = Sp(n), o = Re(ve({}, r), { publicKey: i });
    return AE(o, s);
  }
  return Qt.createUnsecuredToken(Ep(t));
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
    let i = _r(), o = xp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    lE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : kE, c = Sx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
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
function ur(t, e, n) {
  return Vl(le(t, e), n);
}
function le(t, e) {
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
      const r = _E(BigInt(`0x${at(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${at(n)}`);
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
  return (typeof t == "bigint" ? t : le(t, !1)).toString(16).padStart(e * 2, "0");
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
function at(t) {
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
function Fs(t) {
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
function zt(t) {
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
function Fr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var _c;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(_c || (_c = {}));
const GE = _c.Mainnet, VE = 128, KE = 128, Ip = 16, vr = 32, Uc = 80, ua = 65, qE = 32, WE = 64, Mo = 34;
var X;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
var it;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var Hc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Hc || (Hc = {}));
var he;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(he || (he = {}));
const uo = ["onChainOnly", "offChainOnly", "any"], ih = {
  [uo[0]]: he.OnChainOnly,
  [uo[1]]: he.OffChainOnly,
  [uo[2]]: he.Any,
  [he.OnChainOnly]: he.OnChainOnly,
  [he.OffChainOnly]: he.OffChainOnly,
  [he.Any]: he.Any
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
var Bs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Bs || (Bs = {}));
var de;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(de || (de = {}));
var Pt;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pt || (Pt = {}));
var $t;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($t || ($t = {}));
var _o;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_o || (_o = {}));
var Ht;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ht || (Ht = {}));
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
const Er = {
  number: Pc,
  bool: YE,
  bytes: Lp,
  hash: ZE,
  exists: QE,
  output: JE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), tn = (t, e) => t << 32 - e | t >>> e, tA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
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
function Qr(t) {
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
    Er.exists(this);
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
    Er.exists(this), Er.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    nA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = aA[f], $ = cA[f], T = Xl[f], _ = Yl[f], b = iA[f], v = oA[f];
      for (let A = 0; A < 16; A++) {
        const O = Qi(r + ch(f, i, a, u) + Ji[T[A]] + w, b[A]) + l | 0;
        r = l, l = u, u = Qi(a, 10) | 0, a = i, i = O;
      }
      for (let A = 0; A < 16; A++) {
        const O = Qi(s + ch(y, o, c, d) + Ji[_[A]] + $, v[A]) + g | 0;
        s = g, g = d, d = Qi(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ji.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const uA = Qr(() => new lA()), fA = (t, e, n) => t & e ^ ~t & n, hA = (t, e, n) => t & e ^ t & n ^ e & n, dA = new Uint32Array([
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
]), Zn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qn = new Uint32Array(64);
class Mp extends Wl {
  constructor() {
    super(64, 32, 8, !1), this.A = Zn[0] | 0, this.B = Zn[1] | 0, this.C = Zn[2] | 0, this.D = Zn[3] | 0, this.E = Zn[4] | 0, this.F = Zn[5] | 0, this.G = Zn[6] | 0, this.H = Zn[7] | 0;
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
      Qn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Qn[l - 15], f = Qn[l - 2], y = tn(g, 7) ^ tn(g, 18) ^ g >>> 3, w = tn(f, 17) ^ tn(f, 19) ^ f >>> 10;
      Qn[l] = w + Qn[l - 7] + y + Qn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = tn(a, 6) ^ tn(a, 11) ^ tn(a, 25), f = d + g + fA(a, c, u) + dA[l] + Qn[l] | 0, w = (tn(r, 2) ^ tn(r, 13) ^ tn(r, 22)) + hA(r, s, i) | 0;
      d = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Qn.fill(0);
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
const Zl = Qr(() => new Mp());
Qr(() => new pA());
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
const BA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), MA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, TA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _A = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, UA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, st = {
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
}, [NA, PA] = st.split([
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
].map((t) => BigInt(t))), Jn = new Uint32Array(80), tr = new Uint32Array(80);
class fa extends Wl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let b = 0; b < 16; b++, n += 4)
      Jn[b] = e.getUint32(n), tr[b] = e.getUint32(n += 4);
    for (let b = 16; b < 80; b++) {
      const v = Jn[b - 15] | 0, A = tr[b - 15] | 0, O = st.rotrSH(v, A, 1) ^ st.rotrSH(v, A, 8) ^ st.shrSH(v, A, 7), V = st.rotrSL(v, A, 1) ^ st.rotrSL(v, A, 8) ^ st.shrSL(v, A, 7), F = Jn[b - 2] | 0, z = tr[b - 2] | 0, x = st.rotrSH(F, z, 19) ^ st.rotrBH(F, z, 61) ^ st.shrSH(F, z, 6), L = st.rotrSL(F, z, 19) ^ st.rotrBL(F, z, 61) ^ st.shrSL(F, z, 6), H = st.add4L(V, L, tr[b - 7], tr[b - 16]), q = st.add4H(H, O, x, Jn[b - 7], Jn[b - 16]);
      Jn[b] = q | 0, tr[b] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let b = 0; b < 80; b++) {
      const v = st.rotrSH(l, g, 14) ^ st.rotrSH(l, g, 18) ^ st.rotrBH(l, g, 41), A = st.rotrSL(l, g, 14) ^ st.rotrSL(l, g, 18) ^ st.rotrBL(l, g, 41), O = l & f ^ ~l & w, V = g & y ^ ~g & $, F = st.add5L(_, A, V, PA[b], tr[b]), z = st.add5H(F, T, v, O, NA[b], Jn[b]), x = F | 0, L = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), H = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Q = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = st.add(u | 0, d | 0, z | 0, x | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const R = st.add3L(x, H, Q);
      r = st.add3H(R, z, L, q), s = R | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = st.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = st.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = st.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = st.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = st.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = st.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, d, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Jn.fill(0), tr.fill(0);
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
Qr(() => new fa());
Qr(() => new OA());
const jA = Qr(() => new DA());
Qr(() => new FA());
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
function ds(t) {
  return Xr.c32address(t.version, t.hash160);
}
function jr(t, e, n) {
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
  const e = Xr.c32addressDecode(t);
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
    return ds(t.address);
  if (t.type === U.PrincipalContract)
    return `${ds(t.address)}.${t.contractName.content}`;
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
  const n = Ql(t), r = jr(e);
  return Hp(n, r);
}
function Hp(t, e) {
  if (Fs(e.content).byteLength >= 128)
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
      return `0x${at(t.buffer)}`;
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
      return { type: sr(t), value: Da(t, !0), success: !1 };
    case U.ResponseOk:
      return { type: sr(t), value: Da(t, !0), success: !0 };
    default:
      return { type: sr(t), value: Da(t, !0) };
  }
}
function sr(t) {
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
      return `(optional ${sr(t.value)})`;
    case U.ResponseErr:
      return `(response UnknownType ${sr(t.value)})`;
    case U.ResponseOk:
      return `(response ${sr(t.value)} UnknownType)`;
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return "principal";
    case U.List:
      return `(list ${t.list.length} ${t.list.length ? sr(t.list[0]) : "UnknownType"})`;
    case U.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${sr(t.data[e])})`).join(" ")})`;
    case U.StringASCII:
      return `(string-ascii ${$p(t.data).length})`;
    case U.StringUTF8:
      return `(string-utf8 ${Fs(t.data).length})`;
  }
}
const Np = () => ({ type: U.BoolTrue }), Pp = () => ({ type: U.BoolFalse }), KA = (t) => t ? Np() : Pp(), lh = BigInt("0xffffffffffffffffffffffffffffffff"), qA = BigInt(0), uh = BigInt("0x7fffffffffffffffffffffffffffffff"), fh = BigInt("-170141183460469231731687303715884105728"), WA = (t) => {
  const e = le(t, !0);
  if (e > uh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${uh}`);
  if (e < fh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${fh}`);
  return { type: U.Int, value: e };
}, Uo = (t) => {
  const e = le(t, !1);
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
const ls = (t) => ({ type: U.StringASCII, data: t }), QA = (t) => ({ type: U.StringUTF8, data: t });
class jp extends Cp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Er.hash(e);
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
}
const zp = (t, e, n) => new jp(t, e).update(n).digest();
zp.create = (t, e) => new jp(t, e);
Ot.hmacSha256Sync = (t, ...e) => {
  const n = zp.create(Zl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ms(t) {
  return {
    type: X.PublicKey,
    data: Mt(t)
  };
}
function JA(t, e, n = Ht.Compressed) {
  const r = PE(e.data), s = new Ae(th(r.r), th(r.s)), i = ot.fromSignature(t, s, r.recoveryId), o = n === Ht.Compressed;
  return i.toHex(o);
}
function t8(t) {
  return { type: X.PublicKey, data: t };
}
function js(t) {
  return !at(t.data).startsWith("04");
}
function Ho(t) {
  return t.data.slice();
}
function e8(t) {
  const e = s8(t), n = bi(e.data.slice(0, 32), e.compressed);
  return Ms(at(n));
}
function n8(t) {
  const e = typeof t == "string" ? t : at(t), n = ot.fromHex(e).toHex(!0);
  return Ms(n);
}
function r8(t) {
  const e = typeof t == "string" ? t : at(t), n = ot.fromHex(e).toHex(!1);
  return Ms(n);
}
function Fc(t) {
  const e = t.readUInt8(), n = e === 4 ? WE : qE;
  return t8(zt([e, t.readBytes(n)]));
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
  const i = Ai(r, 1) + Ae.fromHex(n).toCompactHex();
  return _p(i);
}
function o8(t) {
  return e8(t.data);
}
function a8(t, e, n) {
  return typeof t == "string" && (t = Up(t)), typeof n == "string" && (n = ph(n)), {
    type: X.Payload,
    payloadType: it.TokenTransfer,
    recipient: t,
    amount: le(e, !1),
    memo: n ?? ph("")
  };
}
function c8(t, e, n, r) {
  return typeof t == "string" && (t = Ql(t)), typeof e == "string" && (e = jr(e)), typeof n == "string" && (n = jr(n)), {
    type: X.Payload,
    payloadType: it.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function hh(t, e, n) {
  return typeof t == "string" && (t = jr(t)), typeof e == "string" && (e = w8(e)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: X.Payload,
    payloadType: it.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function l8() {
  return { type: X.Payload, payloadType: it.PoisonMicroblock };
}
function dh(t, e) {
  if (t.byteLength != vr)
    throw Error(`Coinbase buffer size must be ${vr} bytes`);
  return e != null ? {
    type: X.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: X.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: t
  };
}
function u8(t, e, n) {
  if (t.byteLength != vr)
    throw Error(`Coinbase buffer size must be ${vr} bytes`);
  if (n.byteLength != Uc)
    throw Error(`VRF proof buffer size must be ${Uc} bytes`);
  return {
    type: X.Payload,
    payloadType: it.NakamotoCoinbase,
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
    payloadType: it.TenureChange,
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
    case it.TokenTransfer:
      e.push(Ft(t.recipient)), e.push(ur(t.amount, !1, 8)), e.push(Sn(t.memo));
      break;
    case it.ContractCall:
      e.push(Sn(t.contractAddress)), e.push(Sn(t.contractName)), e.push(Sn(t.functionName));
      const n = new Uint8Array(4);
      Fr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ft(r));
      });
      break;
    case it.SmartContract:
      e.push(Sn(t.contractName)), e.push(Sn(t.codeBody));
      break;
    case it.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Sn(t.contractName)), e.push(Sn(t.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ft(t.recipient));
      break;
    case it.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ft(t.recipient ? Fp(t.recipient) : Dp())), e.push(t.vrfProof);
      break;
    case it.TenureChange:
      e.push(Mt(t.tenureHash)), e.push(Mt(t.previousTenureHash)), e.push(Mt(t.burnViewHash)), e.push(Mt(t.previousTenureEnd)), e.push(Fr(new Uint8Array(4), t.previousTenureBlocks)), e.push(zE(new Uint8Array(1), t.cause)), e.push(Mt(t.publicKeyHash));
      break;
  }
  return zt(e);
}
function h8(t) {
  switch (t.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = _e(t), r = le(t.readBytes(8), !1), s = Vp(t);
      return a8(n, r, s);
    case it.ContractCall:
      const i = Ts(t), o = Te(t), a = Te(t), c = [], u = t.readUInt32BE();
      for (let b = 0; b < u; b++) {
        const v = _e(t);
        c.push(v);
      }
      return c8(i, o, a, c);
    case it.SmartContract:
      const d = Te(t), l = Te(t, 4, 1e5);
      return hh(d, l);
    case it.VersionedSmartContract: {
      const b = t.readUInt8Enum(Hc, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), v = Te(t), A = Te(t, 4, 1e5);
      return hh(v, A, b);
    }
    case it.PoisonMicroblock:
      return l8();
    case it.Coinbase: {
      const b = t.readBytes(vr);
      return dh(b);
    }
    case it.CoinbaseToAltRecipient: {
      const b = t.readBytes(vr), v = _e(t);
      return dh(b, v);
    }
    case it.NakamotoCoinbase: {
      const b = t.readBytes(vr), v = _e(t), A = t.readBytes(Uc);
      return u8(b, v, A);
    }
    case it.TenureChange:
      const g = at(t.readBytes(20)), f = at(t.readBytes(20)), y = at(t.readBytes(20)), w = at(t.readBytes(32)), $ = t.readUInt32BE(), T = t.readUInt8Enum(jc, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), _ = at(t.readBytes(20));
      return f8(g, f, y, w, $, T, _);
  }
}
class ha extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class wr extends ha {
  constructor(e) {
    super(e);
  }
}
class Ee extends ha {
  constructor(e) {
    super(e);
  }
}
class No extends ha {
  constructor(e) {
    super(e);
  }
}
class Ar extends ha {
  constructor(e) {
    super(e);
  }
}
var Fe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fe || (Fe = {}));
function zc(t) {
  return _p(at(t.readBytes(ua)));
}
function ps(t, e) {
  return {
    pubKeyEncoding: t,
    type: X.TransactionAuthField,
    contents: e
  };
}
function d8(t) {
  const e = t.readUInt8Enum(Fe, (n) => {
    throw new Ee(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Fe.PublicKeyCompressed:
      return ps(Ht.Compressed, Fc(t));
    case Fe.PublicKeyUncompressed:
      return ps(Ht.Uncompressed, r8(Fc(t).data));
    case Fe.SignatureCompressed:
      return ps(Ht.Compressed, zc(t));
    case Fe.SignatureUncompressed:
      return ps(Ht.Uncompressed, zc(t));
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
      e.push(t.pubKeyEncoding === Ht.Compressed ? Fe.PublicKeyCompressed : Fe.PublicKeyUncompressed), e.push(Ho(n8(t.contents.data)));
      break;
    case X.MessageSignature:
      e.push(t.pubKeyEncoding === Ht.Compressed ? Fe.SignatureCompressed : Fe.SignatureUncompressed), e.push(Jl(t.contents));
      break;
  }
  return zt(e);
}
function Sn(t) {
  switch (t.type) {
    case X.Address:
      return $i(t);
    case X.Principal:
      return Gp(t);
    case X.LengthPrefixedString:
      return _s(t);
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
  if ((e === $t.SerializeP2WPKH || e === $t.SerializeP2WSH || e === $t.SerializeP2WSHNonSequential) && !r.every(js))
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
  return e.push(Mt(Ai(t.version, 1))), e.push(Mt(t.hash160)), zt(e);
}
function Ts(t) {
  const e = ca(at(t.readBytes(1))), n = at(t.readBytes(20));
  return { type: X.Address, version: e, hash160: n };
}
function Gp(t) {
  const e = [];
  return e.push(t.prefix), e.push($i(t.address)), t.prefix === fi.Contract && e.push(_s(t.contractName)), zt(e);
}
function y8(t) {
  const e = t.readUInt8Enum(fi, (s) => {
    throw new Ee(`Unexpected Principal payload type: ${s}`);
  }), n = Ts(t);
  if (e === fi.Standard)
    return { type: X.Principal, prefix: e, address: n };
  const r = Te(t);
  return {
    type: X.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function _s(t) {
  const e = [], n = Fs(t.content), r = n.byteLength;
  return e.push(Mt(Ai(r, t.lengthPrefixBytes))), e.push(n), zt(e);
}
function Te(t, e, n) {
  e = e || 1;
  const r = ca(at(t.readBytes(e))), s = Kl(t.readBytes(r));
  return jr(s, e, n ?? 128);
}
function w8(t) {
  return jr(t, 4, 1e5);
}
function ph(t) {
  if (t && Yp(t, Mo))
    throw new Error(`Memo exceeds maximum length of ${Mo} bytes`);
  return { type: X.MemoString, content: t };
}
function b8(t) {
  const e = [], n = Fs(t.content), r = H8(at(n), Mo * 2);
  return e.push(Mt(r)), zt(e);
}
function Vp(t) {
  let e = Kl(t.readBytes(Mo));
  return e = e.replace(/\u0000*$/, ""), { type: X.MemoString, content: e };
}
function Kp(t) {
  const e = [];
  return e.push($i(t.address)), e.push(_s(t.contractName)), e.push(_s(t.assetName)), zt(e);
}
function Rc(t) {
  return {
    type: X.AssetInfo,
    address: Ts(t),
    contractName: Te(t),
    assetName: Te(t)
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
  return zt(n);
}
function qp(t, e, n) {
  const r = ca(at(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case X.Address:
        s.push(Ts(t));
        break;
      case X.LengthPrefixedString:
        s.push(Te(t));
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
  if (e.push(t.conditionType), e.push(Gp(t.principal)), (t.conditionType === de.Fungible || t.conditionType === de.NonFungible) && e.push(Kp(t.assetInfo)), t.conditionType === de.NonFungible && e.push(Ft(t.assetName)), e.push(t.conditionCode), t.conditionType === de.STX || t.conditionType === de.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new wr("The post-condition amount may not be larger than 8 bytes");
    e.push(ur(t.amount, !1, 8));
  }
  return zt(e);
}
function m8(t) {
  const e = t.readUInt8Enum(de, (o) => {
    throw new Ee(`Could not read ${o} as PostConditionType`);
  }), n = y8(t);
  let r, s, i;
  switch (e) {
    case de.STX:
      return r = t.readUInt8Enum(ui, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${at(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: de.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case de.Fungible:
      return s = Rc(t), r = t.readUInt8Enum(ui, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${at(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: de.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case de.NonFungible:
      s = Rc(t);
      const o = _e(t);
      return r = t.readUInt8Enum(Nc, (a) => {
        throw new Ee(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: de.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function fn(t, e) {
  return zt([t, e]);
}
function S8(t) {
  return new Uint8Array([t.type]);
}
function E8(t) {
  return t.type === U.OptionalNone ? new Uint8Array([t.type]) : fn(t.type, Ft(t.value));
}
function A8(t) {
  const e = new Uint8Array(4);
  return Fr(e, t.buffer.length, 0), fn(t.type, la(e, t.buffer));
}
function $8(t) {
  const e = Vl(ME(t.value, BigInt(KE)), Ip);
  return fn(t.type, e);
}
function v8(t) {
  const e = Vl(t.value, Ip);
  return fn(t.type, e);
}
function I8(t) {
  return fn(t.type, $i(t.address));
}
function L8(t) {
  return fn(t.type, la($i(t.address), _s(t.contractName)));
}
function C8(t) {
  return fn(t.type, Ft(t.value));
}
function k8(t) {
  const e = [], n = new Uint8Array(4);
  Fr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ft(r);
    e.push(s);
  }
  return fn(t.type, zt(e));
}
function B8(t) {
  const e = [], n = new Uint8Array(4);
  Fr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = jr(s);
    e.push(_s(i));
    const o = Ft(t.data[s]);
    e.push(o);
  }
  return fn(t.type, zt(e));
}
function Wp(t, e) {
  const n = [], r = e == "ascii" ? $p(t.data) : Fs(t.data), s = new Uint8Array(4);
  return Fr(s, r.length, 0), n.push(s), n.push(r), fn(t.type, zt(n));
}
function M8(t) {
  return Wp(t, "ascii");
}
function T8(t) {
  return Wp(t, "utf8");
}
function Ft(t) {
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
      throw new wr("Unable to serialize. Invalid Clarity Value.");
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
    if (Xp(e, r))
      return r;
    throw n(r);
  }
}
function _e(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ti(Mt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ti(t) : e = t;
  switch (e.readUInt8Enum(U, (r) => {
    throw new Ee(`Cannot recognize Clarity Type: ${r}`);
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
      const s = Ts(e);
      return GA(s);
    case U.PrincipalContract:
      const i = Ts(e), o = Te(e);
      return Hp(i, o);
    case U.ResponseOk:
      return YA(_e(e));
    case U.ResponseErr:
      return XA(_e(e));
    case U.OptionalNone:
      return Dp();
    case U.OptionalSome:
      return Fp(_e(e));
    case U.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(_e(e));
      return ZA(c);
    case U.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let w = 0; w < u; w++) {
        const $ = Te(e).content;
        if ($ === void 0)
          throw new Ee('"content" is undefined');
        d[$] = _e(e);
      }
      return Dc(d);
    case U.StringASCII:
      const l = e.readUInt32BE(), g = HE(e.readBytes(l));
      return ls(g);
    case U.StringUTF8:
      const f = e.readUInt32BE(), y = Kl(e.readBytes(f));
      return QA(y);
    default:
      throw new Ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const U8 = (t) => t.length % 2 == 0 ? t : `0${t}`, H8 = (t, e) => t.padEnd(e, "0"), Yp = (t, e) => t ? Fs(t).length > e : !1;
function Gc(t) {
  return g0(t);
}
const hi = (t) => uA(Zl(t)), ru = (t) => at(jA(t)), N8 = (t) => at(hi(t)), P8 = (t) => {
  const e = hi(t), n = la(new Uint8Array([0]), new Uint8Array([e.length]), e), r = hi(n);
  return at(r);
}, O8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = zt(n), s = hi(r);
  return at(s);
}, D8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = zt(n), s = Zl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = zt(i), a = hi(o);
  return at(a);
};
function F8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Zp(t) {
  const e = Ft(t);
  return `0x${at(e)}`;
}
function j8(t) {
  return _e(t);
}
const ys = (t) => {
  try {
    return Xr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function su() {
  return {
    type: X.MessageSignature,
    data: at(new Uint8Array(ua))
  };
}
function Qp(t, e, n, r) {
  const s = tu(0, t, 1, [Ms(e)]).hash160, i = js(Ms(e)) ? Ht.Compressed : Ht.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: le(n, !1),
    fee: le(r, !1),
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
    ur(t.nonce, !1, 8),
    ur(t.fee, !1, 8),
    t.keyEncoding,
    Jl(t.signature)
  ];
  return zt(e);
}
function G8(t) {
  const e = [
    t.hashMode,
    Mt(t.signer),
    ur(t.nonce, !1, 8),
    ur(t.fee, !1, 8)
  ], n = eu(t.fields);
  e.push(nu(n));
  const r = new Uint8Array(2);
  return FE(r, t.signaturesRequired, 0), e.push(r), zt(e);
}
function V8(t, e) {
  const n = at(e.readBytes(20)), r = BigInt(`0x${at(e.readBytes(8))}`), s = BigInt(`0x${at(e.readBytes(8))}`), i = e.readUInt8Enum(Ht, (a) => {
    throw new Ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === $t.SerializeP2WPKH && i != Ht.Compressed)
    throw new Ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
  const n = at(e.readBytes(20)), r = BigInt("0x" + at(e.readBytes(8))), s = BigInt("0x" + at(e.readBytes(8))), i = qp(e, X.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case X.PublicKey:
        js(u.contents) || (o = !0);
        break;
      case X.MessageSignature:
        if (u.pubKeyEncoding === Ht.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ar("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === $t.SerializeP2WSH || t === $t.SerializeP2WSHNonSequential))
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
function Fa(t) {
  return di(t) ? R8(t) : G8(t);
}
function ja(t) {
  const e = t.readUInt8Enum($t, (n) => {
    throw new Ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH ? V8(e, t) : K8(e, t);
}
function Jp(t, e, n, r) {
  const i = t + at(new Uint8Array([e])) + at(ur(n, !1, 8)) + at(ur(r, !1, 8));
  if (Mt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ru(Mt(i));
}
function tg(t, e, n) {
  const r = 33 + ua, s = js(e) ? Ht.Compressed : Ht.Uncompressed, i = t + U8(s.toString(16)) + n.data, o = Mt(i);
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
  const o = Jp(t, e, n, r), a = Ms(JA(o, i, s)), c = tg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function W8() {
  const t = Qp($t.SerializeP2PKH, "", 0, 0);
  return t.signer = g8().hash160, t.keyEncoding = Ht.Compressed, t.signature = su(), t;
}
function bh(t, e, n) {
  return di(t) ? X8(t, e, n) : Y8(t, e, n);
}
function X8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = eg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = tu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ar(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Y8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case X.PublicKey:
        js(c.contents) || (i = !0), r.push(c.contents);
        break;
      case X.MessageSignature:
        c.pubKeyEncoding === Ht.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = eg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (yh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Ar("Too many signatures");
        break;
    }
  if (yh(t.hashMode) && o !== t.signaturesRequired || z8(t.hashMode) && o < t.signaturesRequired)
    throw new Ar("Incorrect number of signatures");
  if (i && (t.hashMode === $t.SerializeP2WSH || t.hashMode === $t.SerializeP2WSHNonSequential))
    throw new Ar("Uncompressed keys are not allowed in this hash mode");
  const a = tu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ar(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ng(t) {
  return {
    authType: Pt.Standard,
    spendingCondition: t
  };
}
function rg(t, e) {
  return {
    authType: Pt.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Qp($t.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function xh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Pt.Standard:
        return ng(wh(t.spendingCondition));
      case Pt.Sponsored:
        return rg(wh(t.spendingCondition), W8());
      default:
        throw new No("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Z8(t, e) {
  switch (t.authType) {
    case Pt.Standard:
      return bh(t.spendingCondition, e, Pt.Standard);
    case Pt.Sponsored:
      return bh(t.spendingCondition, e, Pt.Standard);
    default:
      throw new No("Invalid origin auth type");
  }
}
function Q8(t, e) {
  switch (t.authType) {
    case Pt.Standard:
      const n = {
        ...t.spendingCondition,
        fee: le(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Pt.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: le(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function J8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: le(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function t6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: le(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e6(t, e) {
  const n = {
    ...e,
    nonce: le(e.nonce, !1),
    fee: le(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function n6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Pt.Standard:
      e.push(Fa(t.spendingCondition));
      break;
    case Pt.Sponsored:
      e.push(Fa(t.spendingCondition)), e.push(Fa(t.sponsorSpendingCondition));
      break;
  }
  return zt(e);
}
function r6(t) {
  const e = t.readUInt8Enum(Pt, (r) => {
    throw new Ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Pt.Standard:
      return n = ja(t), ng(n);
    case Pt.Sponsored:
      n = ja(t);
      const r = ja(t);
      return rg(n, r);
  }
}
class s6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: le(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? GE, this.postConditionMode = i ?? Bs.Deny, this.postConditions = s ?? eu([]), o)
      this.anchorMode = XE(o);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = he.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = he.Any;
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
    return this.signAndAppend(this.auth.spendingCondition, e, Pt.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Pt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Pt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !di(n)) {
      const r = js(e);
      n.fields.push(ps(r ? Ht.Compressed : Ht.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = q8(n, r, e.fee, e.nonce, s);
    return di(e) ? e.signature = i : e.fields.push(ps(s.data.byteLength === vp ? Ht.Compressed : Ht.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return ru(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Pt.Sponsored)
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
    if (this.auth.authType != Pt.Sponsored)
      throw new No("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new wr('"version" is undefined');
    if (this.chainId === void 0)
      throw new wr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new wr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new wr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new wr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Fr(n, this.chainId, 0), e.push(n), e.push(n6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(nu(this.postConditions)), e.push(Rp(this.payload)), zt(e);
  }
}
function iu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ti(Mt(t.slice(2))) : e = new ti(Mt(t)) : t instanceof Uint8Array ? e = new ti(t) : e = t;
  const n = e.readUInt8Enum(To, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = r6(e), i = e.readUInt8Enum(he, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Bs, (u) => {
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
], da = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Jr = () => {
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
}, ig = (t) => t ? sg(Jr()).some(
  (e) => {
    var n;
    return e.id === t && (da(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, og = () => {
  if (typeof window > "u")
    return;
  const t = Jr(), e = sg(t).filter(
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
  const e = Jr(), n = vn(e, t) ?? (e === window ? void 0 : vn(window, t)) ?? Jo(t);
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
const ag = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Se = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, p6 = (t) => {
  const e = Se(t);
  if (!e)
    return null;
  const n = ag(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, g6 = (t) => {
  const e = Se(t);
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
}, Ir = (t) => {
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
    return ys(s) ? s : null;
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
  return typeof n.mainnet == "string" && ys(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ys(n.testnet) ? n.testnet.trim() : null;
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
}, zr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Se(n == null ? void 0 : n.message) ?? Se(e.message) ?? Se(e.error) ?? Se(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Us = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw zr(e);
    if (e.status === "error")
      throw zr(e.result ?? e);
  }
  return t;
}, Eh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Us(r);
  } catch (r) {
    throw zr(r);
  }
}, lg = () => og(), ou = () => {
  if (typeof window > "u")
    return;
  const t = Jr();
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
  const e = Jr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = vn(e, n) ?? (e === window ? void 0 : vn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, fo = (t) => {
  var r, s;
  const e = _r();
  if (da(e) || ig(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Jr() ?? window;
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
      txRaw: n ? Se(t) ?? void 0 : void 0
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
  for (const a of mh) {
    const c = za(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Se(s[a]) ?? void 0
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
  fee: Ir(t.fee),
  nonce: Ir(t.nonce),
  sponsored: t.sponsored === !0
}), $h = (t) => ({
  recipient: t.recipient,
  amount: Ir(t.amount) ?? "0",
  memo: t.memo,
  network: Vc(t.network),
  address: t.stxAddress,
  fee: Ir(t.fee),
  nonce: Ir(t.nonce),
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
  const e = Us(await t.request("wallet_connect")), n = pi(e);
  return Kc(n), n;
}, A6 = async (t, e, n, r) => {
  try {
    return Us(await t.request(e, n));
  } catch (s) {
    const i = zr(s);
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
      return Us(await t.request(e, n));
    } catch (a) {
      throw zr(a);
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
    const c = Us(
      await $6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = pi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (cg(c))
      throw zr(c);
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
    o = Us(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), zr(c);
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
      amount: Ir(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ir(e.fee) } : {}
    },
    e.stxAddress
  );
  return Ra(s);
}, L6 = () => _r(), fg = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = _r(), e = t ? f6(t) : void 0;
  if (e)
    return e;
  const n = Jr() ?? window;
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
        providerId: _r(),
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
          providerId: _r(),
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
function er(t) {
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
const hg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ga = 3, z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Wc, dg] = hg.split("."), ke = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Xc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function R6(t) {
  return ke(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Rr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function pg(t, e = []) {
  const n = await Rr(`/v2/contracts/call-read/${Wc}/${dg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Wc, arguments: e.map((r) => "0x" + ke(Ft(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return An(_e(n.result));
}
async function G6() {
  const t = await Rr(`/v2/contracts/source/${Wc}/${dg}?proof=0`);
  if (typeof t.source != "string" || await R6(t.source) !== D6) throw Error("Deployed source does not match the tested helper.");
  if (j6(await pg("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function gg(t) {
  return t.startsWith("SP") && ys(t) && !t.includes(".");
}
async function V6(t) {
  var r;
  if (!gg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Rr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function K6(t) {
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
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
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ds(Xs(_o.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || ds(r.contractAddress) + "." + r.contractName.content !== hg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || ke(Ft(r.functionArgs[0])) !== ke(Ft(ei(t.core))) || ke(Ft(r.functionArgs[1])) !== ke(Ft(ei(t.song))) || ke(Ft(r.functionArgs[2])) !== ke(Ft(o6(Xc(t.id)))) || t.amount !== "50" || e.postConditionMode !== Bs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ui.Equal || i.principal.prefix !== 2 || ds(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ds(r.contractAddress) + "." + r.contractName.content !== z6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || ke(Ft(r.functionArgs[0])) !== ke(Ft(ei(t.song))) || typeof t.liked != "boolean" || ke(Ft(r.functionArgs[1])) !== ke(Ft(i6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Bs.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || An(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const Z6 = "xtrata.xyz/radio/listening-wallet", Q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Do = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ys(t), J6 = (t) => ({
  domain: Dc({ name: ls(Z6), version: ls("1"), "chain-id": Uo(1) }),
  message: Dc({
    purpose: ls(Q6),
    main: ls(t.main),
    listening: ls(t.listening),
    issued: Uo(t.issued)
  })
}), _h = ["prepared", "signed", "unknown", "pending"], t5 = 30 * 6e4, as = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, e5 = 3e3, Uh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function n5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, d = !1, l = !1, g = null, f = !1, y = "", w = "", $, T = null, _, b = [], v, A = -1 / 0;
  const O = /* @__PURE__ */ new Set();
  let V = null, F = !1, z = 0, x = !1, L = !1, H = !1, q = !1, Q = 0, R = null, Tt = Promise.resolve();
  const Wt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? au.toString()), Xt = (m) => !!i && !(i.features ?? []).includes(m), S = (m, M) => `xtrata.ppp.v1.${m}:${M}`, B = (m = i == null ? void 0 : i.address) => {
    if (!m) return [];
    try {
      const M = JSON.parse(t.store.get(S("entries", m)) || "[]");
      return Array.isArray(M) ? M : [];
    } catch {
      return [];
    }
  }, Z = (m) => {
    const M = [m, ...B(m.address).filter((G) => !(G.txid === m.txid && G.kind === m.kind))].slice(0, 200);
    t.store.set(S("entries", m.address), JSON.stringify(M));
  }, gt = (m = i == null ? void 0 : i.address) => !!m && t.store.get(S("on", m)) !== "0", ut = (m) => {
    i != null && i.address && t.store.set(S("on", i.address), m ? "1" : "0");
  }, Lt = () => B().filter((m) => _h.includes(m.status)), ne = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(S("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, Ge = (m) => {
    i != null && i.address && t.store.set(S("deposit", i.address), JSON.stringify(m));
  }, kn = () => Lt().filter((m) => t.now() - m.created > t5 && O.has(m.txid)), zs = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Vt = () => zs() && !(i != null && i.linked), Bn = () => {
    const m = t.main();
    return !Vt() && !!m && !!(i != null && i.linked) && i.linked !== m;
  }, Ie = (m) => S("return-to", m), ts = (m = i == null ? void 0 : i.address) => {
    if (!m) return;
    const M = t.store.get(Ie(m));
    return M && Do(M) && M !== m ? M : void 0;
  }, hn = (m = i == null ? void 0 : i.address) => V && V.for === m ? V.res : null;
  function dn() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const m = ts();
    if (m) return { to: m, kind: "chosen" };
    const M = hn();
    if (M != null && M.ok && M.funder) return { to: M.funder, kind: "funder" };
  }
  function h() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const m = t.main();
    if (!Vt()) {
      if (!m) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Bn() ? "wrong-wallet" : i.state === "known" ? "locked" : !Vt() && i.linked !== m ? "link" : o === void 0 ? "loading" : o > ri ? "over" : o < Oo + gi(Wt()) ? "fund" : "ready" : "loading";
  }
  const I = () => {
    var m, M, G, yt;
    return {
      step: h(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : P6(o, Wt()),
      playsLeft: o === void 0 ? 0 : N6(o, Wt()),
      allowance: o === void 0 ? ri : Th(o, BigInt(((m = ne()) == null ? void 0 : m.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: gt(),
      entries: B(),
      depositTxid: ((M = ne()) == null ? void 0 : M.txid) ?? $,
      depositPending: !!ne(),
      walletOutdated: Xt("like"),
      linkedListening: v && v === t.main() ? b.map((j) => j.listening) : [],
      serverLinked: !!T && _ === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: kn().length,
      armed: H,
      queued: Dt.length,
      solo: Vt(),
      returnTo: (G = dn()) == null ? void 0 : G.to,
      returnToKind: (yt = dn()) == null ? void 0 : yt.kind,
      funderState: (() => {
        const j = hn();
        return j ? j.ok ? j.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const j = hn();
        return !!j && j.ok && j.distinct > 1;
      })(),
      walletCannotSolo: Vt() && Xt("standalone"),
      walletCannotMulti: Xt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((j) => j !== t.main() && j !== (i == null ? void 0 : i.linked))
    };
  }, C = (m, M = "") => {
    y = m, w = M, t.changed();
  };
  async function K(m, M) {
    if (!c) {
      c = m, w = "", t.changed();
      try {
        await M();
      } catch (G) {
        const yt = G instanceof Error ? G.message : String(G);
        w = /Cancelled in the listening wallet/.test(yt) ? "" : yt, w || (y = "Not now. Nothing was signed.", q = !0);
      } finally {
        c = null, await Jt(!0);
      }
    }
  }
  const dt = () => !!(e != null && e.enabled) && e.here && (Vt() || !!t.main() && e.allowed), mt = () => dt() && !Bn(), re = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Rt = () => {
    if (Bn()) throw new Error(re());
  };
  async function Le() {
    if (!dt()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Kt = (m) => {
    const M = t.main();
    return m.request("listening.status", M ? { main: M } : void 0);
  };
  async function Ue(m = !1) {
    i != null && i.address && (!m && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function hr(m) {
    if ((v !== m || t.now() - A >= 6e4) && (b = await t.links(m), v = m, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === m) return;
    const M = `${m}:${i.address}`;
    _ === M && T || (T = b.find((G) => G.listening === i.address) ?? null, _ = M);
  }
  async function se() {
    const m = i == null ? void 0 : i.address;
    if (!Vt() || !m || i != null && i.linked || !t.funder || F || !o || o <= 0n) return;
    const M = hn(m);
    if (M != null && M.ok && M.funder) return;
    const G = M != null && M.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, z - 1), 30 * 6e4);
    if (!(V && V.for === m && t.now() - V.at < G)) {
      F = !0;
      try {
        V = { for: m, res: await t.funder(m), at: t.now() };
      } catch {
        V = { for: m, res: { ok: !1 }, at: t.now() };
      } finally {
        F = !1;
      }
      z = V.res.ok ? 0 : z + 1;
    }
  }
  async function dr() {
    var yt;
    const m = i == null ? void 0 : i.address;
    if (!m) return;
    let M;
    for (const j of Lt())
      try {
        const Et = await t.chain.transaction(j.txid);
        if (!Et) {
          if (O.add(j.txid), t.now() - j.created > 15 * 6e4 && (M ?? (M = await t.chain.confirmedNonce(m))), M !== void 0 && M > BigInt(j.nonce)) {
            Z({ ...j, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((j.status === "unknown" || j.status === "signed") && j.raw)
            try {
              await t.chain.broadcast(j.raw, j.txid), Z({ ...j, status: "pending" });
            } catch (Ct) {
              as(Ct) && Z({ ...j, status: "failed", note: Ct.message, raw: void 0 });
            }
          continue;
        }
        O.delete(j.txid);
        const ct = String(Et.tx_status);
        if (ct === "success" && Et.canonical !== !1 && Et.is_unanchored === !1) {
          if (Z({ ...j, status: "confirmed", confirmedAt: t.now(), actualFee: String(Et.fee_rate ?? j.fee), raw: void 0 }), j.kind === "like" && (f = !0, j.status !== "confirmed" && typeof j.liked == "boolean"))
            try {
              (yt = t.likeConfirmed) == null || yt.call(t, j.song, j.liked);
            } catch {
            }
        } else ct.startsWith("abort_") || ct.startsWith("dropped_") ? Z({ ...j, status: "failed", note: ct, raw: void 0 }) : j.status !== "pending" && Z({ ...j, status: "pending" });
      } catch {
      }
    const G = ne();
    if (G)
      try {
        const j = await t.chain.transaction(G.txid), Et = String((j == null ? void 0 : j.tx_status) ?? "");
        (Et === "success" && j.is_unanchored === !1 || Et.startsWith("abort_") || Et.startsWith("dropped_") || !j && t.now() - G.at > 2 * 36e5) && (Ge(null), a = -1 / 0);
      } catch {
      }
  }
  async function Jt(m = !1) {
    var M;
    try {
      const G = t.main();
      if ((m || !e || r !== G || t.now() - n > 3e5) && (e = await t.config(G), n = t.now(), r = G), !e.enabled || !e.here || !Vt() && (!G || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), H && _t(), t.changed();
        return;
      }
      await Le(), i = await Kt(s), Bn() && i.state === "unlocked" && (Ke(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Kt(s)), G && e.allowed && await hr(G), await Ue(m), await se(), await dr();
    } catch (G) {
      w = G instanceof Error ? G.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (h() === "locked" ? xt() : H && _t(), f) {
      f = !1;
      try {
        (M = t.likesChanged) == null || M.call(t);
      } catch {
      }
    }
    t.changed(), Dt.length && !He && Mn();
  }
  async function ft(m, M) {
    var Et;
    Rt();
    const G = !(i != null && i.address) || gt(i.address), yt = i != null && i.linked ? (Et = t.nameOf) == null ? void 0 : Et.call(t, i.linked) : void 0;
    await m.request("listening.unlock", { mode: "unlock", terms: G ? ge() : void 0, anyPasskey: M, ...t.main() ? { main: t.main() } : {}, ...yt ? { label: yt } : {} }), i = await Kt(m), G && (gt(i.address) ? await Ve() : await m.request("listening.stop")), C(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const j = g;
    g = null, j && t.now() - j.at < 12e4 && setTimeout(() => void Jt(!0).then(() => ye(j)), 0);
  }
  function xt() {
    H || c || q || Q >= 3 || !s || !(i != null && i.address) || (H = !0, Tt = (async () => {
      try {
        await ft(s, !1), Q = 0;
      } catch (m) {
        const M = m instanceof Error ? m.message : String(m);
        /Cancelled in the listening wallet/.test(M) ? R || (q = !0, C("Not now. Nothing was signed.")) : /did not answer/.test(M) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Q++, w = M);
      } finally {
        H = !1;
        const m = R;
        R = null, m ? await m() : await Jt(!0);
      }
    })());
  }
  async function _t(m) {
    H && (R = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Tt), m && await m(), t.changed();
  }
  const ge = () => ({
    fee: Wt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ri.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ve() {
    if (!(i != null && i.address)) return !1;
    if (L || (L = await t.tabLock(i.address)), !L)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Rs = {
    forceRefresh: () => Jt(!0),
    create: () => K("Waiting for your passkey…", async () => {
      const m = await Le();
      await m.request("listening.unlock", { mode: "create", terms: ge(), ...t.main() ? { main: t.main() } : {} }), i = await Kt(m), ut(!0), C(Vt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ve();
    }),
    unlock: (m = !1) => {
      const M = () => K("Waiting for your passkey…", async () => ft(await Le(), m));
      return H ? m ? Xt("cancel") ? (C("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : _t(async () => {
        (h() === "locked" || h() === "intro") && await M();
      }) : Tt : M();
    },
    link: () => K("Sign in your wallet…", async () => {
      Rt();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const M = (await t.links(m)).find((G) => G.listening === i.address);
      if (M)
        await s.request("listening.link", { main: m, issued: M.issued, mainSignature: M.mainSignature });
      else {
        const G = { main: m, listening: i.address, issued: t.now() }, yt = await t.signWithMain(m, J6(G)), j = await s.request("listening.link", { main: m, issued: G.issued, mainSignature: yt });
        await t.saveLink({ ...G, mainSignature: yt, listeningSignature: j.listeningSignature }), A = -1 / 0;
      }
      C("Linked ✓");
    }),
    deposit: () => K("Approve the deposit in your wallet…", async () => {
      Rt();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (ne()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Ue(!0);
      const M = Th(o ?? 0n);
      if (M <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      $ = await t.deposit(m, i.address, M), $ && Ge({ txid: $, amount: M.toString(), at: t.now() }), C("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => K("Confirm in the listening wallet…", async () => {
      if (!mt()) throw new Error("Connect your wallet first.");
      await Ve(), await s.request("listening.approveSession", ge()), ut(!0), C("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => K("Clearing…", async () => {
      for (const m of kn())
        await t.chain.transaction(m.txid) || Z({ ...m, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      C("Cleared ✓");
    }),
    switchOff: () => K("Switching off…", async () => {
      Ke(), await (s == null ? void 0 : s.request("listening.stop")), ut(!1), C("Paying is off. Music stays free.");
    }),
    lock: () => K("Locking…", async () => {
      Ke(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, C("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (m) => {
      const M = String(m ?? "").trim();
      if (!(i != null && i.address)) return C("", "Unlock the listening wallet first.");
      if (!Do(M)) return C("", "Enter a standard mainnet address (it starts with SP).");
      if (M === i.address) return C("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Ie(i.address), M), C("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Ie(i.address), ""), t.changed();
    },
    returnFunds: (m) => K("Check the return in the listening wallet…", async () => {
      if (!mt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const M = dn();
      if (!M) throw new Error(Vt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (M.kind !== "linked" && Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Lt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: G, nonce: yt } = await t.chain.account(i.address);
      o = G;
      const j = await s.request("listening.prepareReturn", {
        mode: m,
        balance: G.toString(),
        nonce: yt.toString(),
        fee: U6.toString(),
        ...M.kind === "linked" ? {} : { destination: M.to }
      });
      if (j.recipient !== M.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const Et = iu(j.raw);
      if (An(Et.payload.recipient).value !== M.to || String(Et.payload.amount) !== j.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const ct = {
        id: Uh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: j.recipient,
        amount: j.amount,
        fee: j.fee,
        nonce: yt.toString(),
        created: t.now(),
        status: "signed",
        raw: j.raw,
        txid: j.txid
      };
      t.validate(ct), Z(ct);
      try {
        await t.chain.broadcast(j.raw, j.txid), Z({ ...ct, status: "pending" });
      } catch (Ct) {
        throw Z({ ...ct, status: "unknown", note: Ct.message }), Ct;
      }
      m === "all" && ut(!1), C(m === "all" ? M.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Dt = [], pn = 10, gn = 30 * 6e4;
  let He = !1;
  const yn = () => u || !!c || d || l, Ke = () => {
    Dt.length && (Dt.length = 0, t.changed());
  };
  async function qe(m) {
    if (!Dt.some((M) => M.id === m.id) && !B().some((M) => M.id === m.id) && (Dt.push({ ...m, at: t.now() }), Dt.length > pn && Dt.shift()), yn() || Lt().length) {
      const M = Dt.length;
      y = `Queued ${M === 1 ? "this song" : M + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Mn();
  }
  async function Mn() {
    if (!He) {
      He = !0;
      try {
        for (; Dt.length; ) {
          for (; Dt.length && t.now() - Dt[0].at > gn; ) Dt.shift();
          if (!Dt.length || yn() || await N(Dt[0]) === "wait") return;
          Dt.shift();
        }
      } finally {
        He = !1, t.changed();
      }
    }
  }
  async function N(m) {
    u = !0;
    try {
      await Jt();
      const M = h();
      if (M === "loading") return "wait";
      if (M !== "ready" || !gt() || !(i != null && i.session) || i.session.playsLeft < 1 || !L) return "done";
      if (Lt().length) return "wait";
      x || (await t.chain.verify(), x = !0);
      const G = i.address, { balance: yt, nonce: j } = await t.chain.account(G);
      o = yt, a = t.now();
      const Et = await t.chain.owner(Ga, m.song);
      if (Et === G || Et === t.main()) return "done";
      const ct = await s.request("listening.signPlay", {
        core: Ga,
        song: m.song,
        receipt: m.id,
        fee: Wt().toString(),
        nonce: j.toString(),
        balance: yt.toString()
      }), Ct = {
        id: m.id,
        address: G,
        kind: "play",
        core: Ga,
        song: m.song,
        recipient: Et,
        amount: "50",
        fee: Wt().toString(),
        nonce: j.toString(),
        created: t.now(),
        status: "signed",
        raw: ct.raw,
        txid: ct.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(Ct), Z(Ct);
      const Yt = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`;
      try {
        await t.chain.broadcast(ct.raw, ct.txid), Z({ ...Ct, status: "pending" }), y = `♪ Paid ${Yt}`, w = "";
      } catch (We) {
        Z({ ...Ct, status: as(We) ? "failed" : "unknown", note: We.message, ...as(We) ? { raw: void 0 } : {} }), w = We.message;
      }
      return i = await Kt(s), "done";
    } catch (M) {
      return y = "This song played free: " + (M instanceof Error ? M.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function vt(m) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(h()) || Xt("like") ? !1 : (ye(m), !0);
  }
  async function ye(m) {
    const M = m.title ? `“${m.title}”` : `song #${m.song}`, G = (we) => {
      var Xe;
      w = we, y = "";
      try {
        (Xe = t.likeFailed) == null || Xe.call(t, m.song);
      } catch {
      }
      t.changed();
    }, yt = h(), j = t.main(), Et = Vt() ? i == null ? void 0 : i.address : j;
    if (yt === "locked") {
      g = { ...m, at: t.now() }, C(`Unlock to like ${M}. It sends straight after.`);
      return;
    }
    if (yt === "wrong-wallet") return G(re());
    if (yt === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Vt() && Xt("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (yt === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (yt === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (yt !== "ready" || !Et) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!L) return G("Pay-per-play is running in another tab. Like from that tab.");
    const ct = B().find((we) => we.kind === "like" && we.song === m.song);
    if (ct && _h.includes(ct.status))
      return G(`Your last like for ${M} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((ct == null ? void 0 : ct.status) === "confirmed" && t.now() - (ct.confirmedAt ?? 0) < e5)
      return G(`Your like for ${M} has only just confirmed. Try again in a moment.`);
    let Ct;
    l = !0;
    try {
      Ct = t.likeState ? (await t.likeState(Et, m.song)).by : m.likedBy ?? [];
    } catch {
      Ct = m.likedBy;
    } finally {
      l = !1;
    }
    if (!Ct) return G(`Could not check ${M} right now. Try the heart again.`);
    const Yt = i.address, wn = ((ct == null ? void 0 : ct.status) === "confirmed" && typeof ct.liked == "boolean" && t.now() - (ct.confirmedAt ?? ct.created) < 5 * 6e4 ? ct.liked : void 0) ?? Ct.includes(Yt);
    if (!wn && Ct.some((we) => we !== Yt)) return G(Vt() ? `${M} was liked from another wallet of yours. Unlike it there.` : `${M} was liked from your main wallet${Ct.includes(j) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await pa({ song: m.song, liked: !wn, title: m.title, artist: m.artist });
  }
  async function pa(m) {
    var yt, j, Et;
    if (d) {
      C("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const M = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`, G = t.wait ?? ((ct) => new Promise((Ct) => setTimeout(Ct, ct)));
    try {
      C(`${m.liked ? "Liking" : "Unliking"} ${M}…`);
      const ct = t.now() + 12e4;
      for (; u || Lt().length; ) {
        if (t.now() > ct) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Jt(!0);
      }
      if (h() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const Ct = i.address, { balance: Yt, nonce: We } = await t.chain.account(Ct);
      o = Yt, a = t.now();
      const wn = await s.request("listening.signLike", {
        song: m.song,
        liked: m.liked,
        fee: Mh.toString(),
        nonce: We.toString(),
        balance: Yt.toString()
      }), we = {
        id: Uh(),
        address: Ct,
        kind: "like",
        core: 0,
        song: m.song,
        liked: m.liked,
        recipient: "",
        amount: "0",
        fee: Mh.toString(),
        nonce: We.toString(),
        created: t.now(),
        status: "signed",
        raw: wn.raw,
        txid: wn.txid,
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(we), Z(we);
      try {
        await t.chain.broadcast(wn.raw, wn.txid), Z({ ...we, status: "pending" }), y = `${m.liked ? "♥ Liked" : "Unliked"} ${M}`, w = "";
        try {
          (yt = t.likeSent) == null || yt.call(t, m.song, m.liked);
        } catch {
        }
      } catch (Xe) {
        if (Z({ ...we, status: as(Xe) ? "failed" : "unknown", note: Xe.message, ...as(Xe) ? { raw: void 0 } : {} }), w = Xe.message, as(Xe)) try {
          (j = t.likeFailed) == null || j.call(t, m.song);
        } catch {
        }
      }
      i = await Kt(s);
    } catch (ct) {
      w = "Like not sent: " + (ct instanceof Error ? ct.message : "the listening wallet is unavailable");
      try {
        (Et = t.likeFailed) == null || Et.call(t, m.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), Mn();
    }
  }
  return { snapshot: I, refresh: Jt, onListened: qe, heart: vt, toggleLike: ye, ...Rs };
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
}, cs = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, F5 = (t) => {
  var c, u;
  let e;
  try {
    e = An(j8(t));
  } catch {
    return null;
  }
  const n = cs(e);
  if (!n || n.success === !1)
    return null;
  const r = cs(n.value), s = cs(r == null ? void 0 : r.value), i = cs(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Oh((c = cs(i.name)) == null ? void 0 : c.value), a = Oh((u = cs(i.namespace)) == null ? void 0 : u.value);
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
  if (!ys(e))
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
  const e = My(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let s = null;
  const i = async (h, I) => {
    const C = await fetch(h, { cache: "no-store", ...I, signal: AbortSignal.timeout(15e3) }), K = await C.json().catch(() => ({}));
    if (!C.ok) throw new Error((K == null ? void 0 : K.error) || `Request failed (${C.status}).`);
    return K;
  }, o = n5({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    saveLink: async (h) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), s.referrerPolicy = "no-referrer";
      const I = new Promise((mt, re) => {
        s.addEventListener("load", () => mt(), { once: !0 }), setTimeout(() => re(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = h + "/", r.replaceChildren(s), await I;
      const C = new Ey({ walletOrigin: h, frame: s, timeoutMs: 30 * 6e4 }), K = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), dt = (mt, re) => K.has(mt) ? C.request(mt, re) : Promise.race([
        C.request(mt, re),
        new Promise((Rt, Le) => setTimeout(() => Le(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await dt("listening.status"), { request: dt };
    },
    chain: {
      verify: G6,
      balance: K6,
      account: V6,
      owner: q6,
      broadcast: W6,
      transaction: X6,
      confirmedNonce: async (h) => {
        const I = await Rr(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(I == null ? void 0 : I.nonce) || I.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(I.nonce);
      }
    },
    signWithMain: (h, I) => _6({ ...I, network: "mainnet", stxAddress: h }),
    deposit: (h, I, C) => new Promise((K, dt) => C6({
      recipient: I,
      amount: C.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new Rh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (mt) => K(mt.txId || ""),
      onCancel: () => dt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: dt
    })),
    validate: Y6,
    tabLock: (h) => new Promise((I) => {
      const C = navigator.locks;
      if (!(C != null && C.request)) {
        I(!0);
        return;
      }
      C.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (K) => {
        I(!!K), K && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, I) => {
        try {
          localStorage.setItem(h, I);
        } catch {
        }
      }
    },
    changed: () => Ie(o.snapshot()),
    funder: (h) => l5(h, Rr),
    likesChanged: () => {
      var h, I;
      (I = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || I.call(h);
    },
    likeState: async (h, I) => {
      const C = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(I) })), K = Array.isArray(C == null ? void 0 : C.rows) ? C.rows.find((dt) => (dt == null ? void 0 : dt.id) === I) : null;
      if (!K || typeof K.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: K.liked, by: Array.isArray(K.by) ? K.by.filter((dt) => typeof dt == "string") : K.liked ? [h] : [] };
    },
    likeSent: (h, I) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: I } })),
    nameOf: (h) => b(h) ?? void 0,
    likeConfirmed: (h, I) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: I } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  });
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    z();
    const I = x(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: I.title || void 0, artist: I.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let a;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const c = (h) => {
    var C, K;
    const I = window.XtrataRadioListeningIdentity();
    I !== a && (a = I, (K = (C = window.XtrataRadio) == null ? void 0 : C.refreshLikes) == null || K.call(C));
  }, u = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", d = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), l = (h) => {
    const I = Math.round((Date.now() - h) / 6e4);
    return I < 1 ? "now" : I < 60 ? `${I}m` : I < 1440 ? `${Math.round(I / 60)}h` : `${Math.round(I / 1440)}d`;
  }, g = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, f = (h, I = "", C = "") => {
    const K = document.createElement(h);
    return I && (K.textContent = I), C && (K.className = C), K;
  }, y = (h, I, C = "") => {
    const K = f("button", h, C);
    return K.type = "button", K.onclick = I, K;
  }, w = (h, I) => {
    const C = f("a", h);
    return C.href = I, C.target = "_blank", C.rel = "noopener", C;
  };
  let $ = null, T = !1;
  const _ = /* @__PURE__ */ new Map(), b = (h) => h ? (_.has(h) || (_.set(h, null), z5({ address: h, network: "mainnet" }).then((I) => {
    I && (_.set(h, I), Ie(o.snapshot()));
  }).catch(() => {
  })), _.get(h) ?? null) : null, v = (h) => {
    const I = b(h);
    return I ? `${I} · ${u(h)}` : u(h);
  }, A = (h) => h.slice(0, 2).map(v).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), O = /* @__PURE__ */ new Map();
  let V = !1;
  const F = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), z = () => {
    V || (V = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const I of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const C = Number(I == null ? void 0 : I.id);
        Number.isSafeInteger(C) && O.set(C, { title: typeof I.title == "string" ? I.title : void 0, artist: typeof I.artist == "string" ? I.artist : void 0 });
      }
      Ie(o.snapshot());
    }).catch(() => {
      V = !1;
    }));
  }, x = (h, I) => {
    const C = O.get(h), K = G5(h, [C == null ? void 0 : C.title, I == null ? void 0 : I.title].find((mt) => !F(mt)) || ""), dt = R5(h, (C == null ? void 0 : C.artist) || (I == null ? void 0 : I.artist) || "");
    return { title: K, artist: dt };
  }, L = (h) => {
    const { title: I, artist: C } = x(h.song, h);
    return I ? `“${I}”${C ? ` — ${C}` : ""}` : `Song #${h.song}${C ? ` — ${C}` : ""}`;
  }, H = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, q = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Q(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["OVER 1 STX", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function R(h, I, C = "", K) {
    const dt = f("dt", h), mt = f("dd", I, C);
    return K && mt.append(" ", K), [dt, mt];
  }
  const Tt = document.getElementById("ppp-top"), Wt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Xt = () => {
    var I, C;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (I = document.getElementById("radio-wallet-connect")) == null || I.click();
      return;
    }
    if (h.step === "elsewhere" && ((C = h.gate) != null && C.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), Wt();
  };
  Tt && (Tt.onclick = Xt);
  function S(h) {
    if (!Tt) return;
    const I = (K, dt, mt) => {
      Tt.hidden = !1, Tt.className = "ppp-top" + (dt ? " is-" + dt : ""), Tt.replaceChildren(f("span", "", "dot"), document.createTextNode(K)), Tt.title = mt;
    }, C = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Tt.hidden = !0;
        return;
      case "elsewhere":
        return I("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Tt.hidden = !0;
        return;
      case "intro":
        return I("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return I(`Connect ${b(h.linked) ?? u(h.linked)}`, "warn", `This device's listening wallet belongs to ${v(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return I(h.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return I("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return I(h.entries.some((K) => K.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return I("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return I("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return h.payingOn && C > 0 ? I(`On · ${C.toLocaleString()} plays left`, "on", "Paying artists as you listen") : I("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const B = document.getElementById("pppNudge"), Z = document.getElementById("onair");
  (dn = B == null ? void 0 : B.querySelector("button")) == null || dn.addEventListener("click", () => Xt());
  const gt = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "Out of funds · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, ut = {
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
  function Lt(h) {
    var mt;
    if (h.step === "loading") return;
    const I = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, C = h.step === "ready" && h.payingOn && I > 0, K = C ? "" : gt[h.step] ?? "", dt = C ? "on" : K ? "off" : "";
    if (dt ? document.documentElement.dataset.ppp = dt : delete document.documentElement.dataset.ppp, Z && (Z.hidden = !dt, Z.querySelector(".onair-sub").textContent = C ? `Paying artists · ${I.toLocaleString()} plays left` : "Not paying"), B && (B.hidden = dt !== "off", dt === "off")) {
      const re = Math.floor(Number(1000000n / gi(BigInt(((mt = h.gate) == null ? void 0 : mt.limits.playFee) ?? "300"))));
      B.querySelector(".nudge-t").textContent = "⚠ " + K, B.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${re.toLocaleString()} plays, on-chain, straight to the artists.`, B.querySelector("button").textContent = ut[h.step] ?? "Start paying";
    }
  }
  let ne = "";
  function Ge(h) {
    const I = f("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && I.append(f("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && I.append(f("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const C = f("input");
    C.type = "text", C.placeholder = "SP… address to send returns to", C.autocomplete = "off", C.spellcheck = !1, C.setAttribute("aria-label", "Address to return funds to"), C.value = ne, C.oninput = () => {
      ne = C.value;
    };
    const K = y(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(C.value), ne = "";
    }, "tiny");
    return I.append(C, " ", K), h.returnToKind === "chosen" && I.append(" ", y("Back to the funder", () => o.clearReturnAddress(), "tiny")), I;
  }
  const kn = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function zs() {
    const h = f("p", kn + " ", "ppp-mute");
    return h.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), h;
  }
  let Vt = "";
  const Bn = (h) => {
    const I = document.documentElement, C = h.solo && !h.main ? h.listening ? u(h.listening) : "new" : "", K = f5() ? "1" : "";
    `${C}|${K}` !== Vt && (Vt = `${C}|${K}`, C ? I.dataset.pppSolo = C : delete I.dataset.pppSolo, K ? I.dataset.pppWalletInstalled = K : delete I.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => Ie(o.snapshot()), h);
  function Ie(h) {
    var yn, Ke, qe, Mn;
    if (c(), Bn(h), S(h), Lt(h), t.hidden = h.step === "off", t.hidden) return;
    const [I, C] = Q(h), K = n(".ppp-state");
    K.textContent = I, K.className = "ppp-state" + (C ? " ppp-state--" + C : ""), K.hidden = !I;
    const dt = !!h.busy || h.armed, mt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (dt || !["intro", "loading"].includes(h.step));
    r.hidden = !mt, r.classList.toggle("ppp-frame--rest", !dt && !T);
    const re = n(".ppp-frame-label");
    re.hidden = !0;
    const Rt = r5(h) ?? $;
    $ = Rt;
    const Le = i5(h, Rt);
    n(".ppp-badge").hidden = !Le;
    const Kt = n(".ppp-steps"), Ue = n(".ppp-stage");
    Kt.hidden = Ue.hidden = !Le, Rt && Le && (Kt.replaceChildren(...Yc(h.solo).map((N, vt) => {
      const ye = f("li", "", vt < Rt.at ? "done" : vt === Rt.at ? Rt.blocked ? "now blocked" : "now" : "");
      return ye.append(f("span", vt < Rt.at ? "✓" : String(vt + 1), "n"), N), vt === Rt.at && ye.setAttribute("aria-current", "step"), ye;
    })), Ue.textContent = Rt.caption, Ue.className = "ppp-stage " + (Rt.at >= Yc(h.solo).length ? "ppp-ok" : Rt.blocked ? "ppp-bad" : "ppp-cyan"));
    const hr = n(".ppp-facts"), se = [];
    h.main && ((yn = h.gate) != null && yn.here) && !h.solo && se.push(...R("Your wallet", v(h.main), "ppp-addr-short"));
    const dr = () => {
      if (!h.listening) return;
      const N = y("Copy", () => {
        var vt;
        return void ((vt = navigator.clipboard) == null ? void 0 : vt.writeText(h.listening || ""));
      }, "tiny");
      se.push(...R(h.linked ? "Listening wallet (technical)" : "Listening wallet", u(h.listening), "ppp-addr-short", N));
    };
    if (h.linked || dr(), h.listening && h.step !== "intro")
      if (h.linked)
        se.push(...R("Credited to", `${v(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), dr();
      else if (h.solo) {
        const N = h.returnTo ? `${u(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        se.push(...R("Returns go to", h.returnTo ? N.replace(u(h.returnTo), h.returnTo) : N, h.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else se.push(...R("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((Ke = h.gate) != null && Ke.here)) {
      const N = h.linkedListening.map((vt) => u(vt) + (vt === h.listening ? " (this one)" : "")).join(", ");
      se.push(...R(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", N, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const N = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      se.push(...R("Balance", `${er(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, N));
    }
    const Jt = h.entries.find((N) => N.kind === "play");
    Jt && z(), Jt && se.push(...R("Last paid song", `${L(Jt)} → ${u(Jt.recipient)}`, H[Jt.status] || "")), hr.replaceChildren(...se), hr.hidden = !se.length;
    const ft = [], xt = [], _t = [], ge = [], Ve = gi(BigInt(((qe = h.gate) == null ? void 0 : qe.limits.playFee) ?? "300")), Rs = `Each song you listen to for 30 seconds sends ${er(qc)} STX to whoever holds it, plus a ${er(Ve - qc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Dt = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (ft.push(f("p", "Pay artists as you listen.")), (Mn = h.gate) != null && Mn.radioUrl) {
          const N = f("p");
          N.append(w("Open the pay-per-play radio →", h.gate.radioUrl)), ft.push(N);
        }
        xt.push(f("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const N = [h.linked, ...h.others];
          ft.push(f("p", N.length > 1 ? `This device has listening wallets for ${A(N)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${v(h.linked)}. Connect that wallet to keep paying artists.`)), xt.push(f("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ft.push(f("p", "Connect your wallet to pay artists as you listen.")), xt.push(f("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ft.push(f("p", `This device's listening wallet belongs to ${v(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), xt.push(f("p", `You are connected as ${v(h.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), xt.push(f("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), _t.push(y("Switch wallet", () => {
          var N;
          return (N = document.getElementById("radio-wallet-connect")) == null ? void 0 : N.click();
        }, "primary"));
        break;
      case "not-invited":
        ft.push(f("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ft.push(f("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ft.push(f("p", `Pay artists ${er(Ve)} STX a song as you listen.`)), xt.push(f("p", Rs)), xt.push(f("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), xt.push(f("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (ft.push(f("p", `This device already has a listening wallet for ${A(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), xt.push(f("p", `Otherwise, set up a new listening wallet for ${v(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && xt.push(f("p", `This is the listening wallet for ${v(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && xt.push(f("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute")), _t.push(y(h.solo ? "Turn on pay-per-play · no wallet needed" : h.others.length && h.main ? `Set up for ${u(h.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !h.solo && h.main && h.others.length && _t.push(y("Switch wallet", () => {
          var N;
          return (N = document.getElementById("radio-wallet-connect")) == null ? void 0 : N.click();
        })), h.solo && _t.push(y("I have a Stacks wallet", () => {
          var N;
          return (N = document.getElementById("radio-wallet-connect")) == null ? void 0 : N.click();
        })), _t.push(y("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        h.armed || (ft.push(f("p", "Locked.", "ppp-mute")), _t.push(y(h.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), ge.push(y("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ft.push(f("p", `Link to ${v(h.main)} · free`)), xt.push(f("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), xt.push(f("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), _t.push(y(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ft.push(f("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.entries.length ? ft.push(f("p", "Out of funds · top up to keep paying", "ppp-bad")) : ft.push(f("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Ve)).toLocaleString()} songs`)), h.entries.length && xt.push(f("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), h.payingOn && !h.entries.length && xt.push(f("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), h.solo ? (xt.push(f("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), xt.push(f("p", h.listening || "", "ppp-addr-full")), h.listening && _t.push(y("Copy my address", () => {
          var N;
          return void ((N = navigator.clipboard) == null ? void 0 : N.writeText(h.listening || ""));
        }, "primary"))) : xt.push(f("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const N = f("p", "Deposit on its way… ", "ppp-warn");
          N.append(w("View", g(h.depositTxid))), ft.push(N);
        } else h.allowance > 0n && !h.solo && _t.push(y(`Deposit ${er(h.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ft.push(f("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (ft.push(f("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ft.push(Ge(h))), (!h.solo || h.returnTo) && _t.push(y("Return excess", () => void o.returnFunds("excess"), "primary"), y("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0) {
          const N = Math.min(h.session.playsLeft, h.playsLeft);
          ft.push(f("p", `Paying as you listen · up to ${N.toLocaleString()} plays left`, "ppp-ok")), xt.push(f("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), _t.push(y("Switch off", () => void o.switchOff()));
        } else
          ft.push(f("p", "Paying is off. Music stays free.", "ppp-mute")), _t.push(y("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        h.queued && ft.push(f("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && ft.push(f("p", "Running low · top up", "ppp-warn")), h.depositPending ? ft.push(f("p", "Top-up on its way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && _t.push(y(`Top up ${er(h.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && xt.push(f("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && xt.push(Ge(h)), xt.push(zs()), h.step === "ready" && h.entries.some((N) => N.kind === "play" && N.status === "confirmed"))) {
      const N = f("p", "New to Stacks? ", "ppp-mute");
      N.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ft.push(N);
    }
    if (h.walletOutdated && xt.push(f("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (ft.push(f("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), _t.push(y("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(h.step) && h.returnTo && (h.balance ?? 0n) > 0n && ge.push(y(h.linked ? "Return all to my wallet" : `Return all to ${u(h.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && ge.push(y("Lock", () => void o.lock(), "quiet")), mt && !dt && ge.push(y(T ? "Hide listening wallet box" : "Show listening wallet box", () => {
      T = !T, Ie(o.snapshot());
    }, "quiet")), [..._t, ...ge].forEach((N) => N.disabled = Dt), Dt && (_t.length = 0), h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const N = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", vt = ft.at(0);
      h.step === "ready" && vt ? vt.append(f("span", ` · ${d(h.balance)} STX`, N)) : ft.push(f("p", `Balance ${d(h.balance)} STX`, N));
    }
    n(".ppp-key").replaceChildren(...ft), n(".ppp-body").replaceChildren(...xt), n(".ppp-actions").replaceChildren(..._t), n(".ppp-actions2").replaceChildren(...ge);
    const pn = h.busy || h.message || "";
    n(".ppp-msg").textContent = pn && ft.some((N) => (N.textContent ?? "").startsWith(pn.replace(/[.✓\s]+$/, ""))) ? "" : pn, n(".ppp-err").textContent = h.error;
    const gn = h.entries.filter((N) => N.kind === "play");
    n(".ppp-recent").hidden = !h.entries.length, n(".ppp-recent-list").replaceChildren(...gn.slice(0, 5).map((N) => {
      const vt = f("li"), ye = N.status === "confirmed" ? "ok" : N.status === "failed" ? "bad" : "warn";
      return vt.append(f("span", "", "d " + ye), f("span", L(N), "t"), f("span", l(N.created), "ppp-mute")), N.txid && vt.append(w("tx", g(N.txid))), vt;
    })), n(".ppp-wallets").hidden = !(hr.childElementCount || ge.length), n(".ppp-more").hidden = !xt.length;
    const He = n(".ppp-history");
    He.hidden = !h.entries.length, h.entries.length && z(), He.replaceChildren(f("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((N) => {
      const vt = f("div", "", "ppp-row"), ye = N.kind === "play" ? [f("span", L(N), "ppp-song"), f("span", ` · ${er(BigInt(N.amount))} STX to ${u(N.recipient)}`, "ppp-mute")] : N.kind === "like" ? [f("span", `${N.liked ? "♥ Liked" : "Unliked"} ${L(N)}`, "ppp-song"), f("span", ` · for ${h.linked ? v(h.linked) : "this listening wallet"}`, "ppp-mute")] : [f("span", `Returned ${er(BigInt(N.amount))} STX`, "ppp-song"), f("span", ` to ${u(N.recipient)}`, "ppp-mute")];
      return vt.append(
        f("span", q[N.status] || N.status, "ppp-status " + (H[N.status] || "")),
        ...ye,
        f("span", ` · ${new Date(N.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), N.txid && vt.append(w("tx ↗", g(N.txid))), vt;
    }));
  }
  const ts = /* @__PURE__ */ new Map(), hn = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((I) => {
      const C = I == null ? void 0 : I.nowPlaying;
      C && Number.isSafeInteger(Number(C.tokenId)) && ts.set(Number(C.tokenId), { title: C.title || void 0, artist: C.artist || void 0 });
    }), !0) : !1;
  };
  if (!hn()) {
    const h = setInterval(() => {
      hn() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const I = h.detail;
    if (I && Number.isSafeInteger(I.song) && typeof I.id == "string" && /^[0-9a-f]{32}$/.test(I.id)) {
      z();
      const C = x(I.song, ts.get(I.song));
      o.onListened({ song: I.song, id: I.id, title: C.title || void 0, artist: C.artist || void 0 });
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
    var r, s, i, o, a, c, u, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
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
