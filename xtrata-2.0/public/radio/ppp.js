var Xw = Object.defineProperty;
var Ww = (t, e, n) => e in t ? Xw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var No = (t, e, n) => Ww(t, typeof e != "symbol" ? e + "" : e, n);
var mn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function op(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Fc(t) {
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
      typeof mn < "u" && mn || {}, r = {
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
      function s(v) {
        return v && DataView.prototype.isPrototypeOf(v);
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
        ], o = ArrayBuffer.isView || function(v) {
          return v && i.indexOf(Object.prototype.toString.call(v)) > -1;
        };
      function a(v) {
        if (typeof v != "string" && (v = String(v)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(v) || v === "")
          throw new TypeError('Invalid character in header field name: "' + v + '"');
        return v.toLowerCase();
      }
      function c(v) {
        return typeof v != "string" && (v = String(v)), v;
      }
      function u(v) {
        var P = {
          next: function() {
            var b = v.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function d(v) {
        this.map = {}, v instanceof d ? v.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray(v) ? v.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : v && Object.getOwnPropertyNames(v).forEach(function(P) {
          this.append(P, v[P]);
        }, this);
      }
      d.prototype.append = function(v, P) {
        v = a(v), P = c(P);
        var b = this.map[v];
        this.map[v] = b ? b + ", " + P : P;
      }, d.prototype.delete = function(v) {
        delete this.map[a(v)];
      }, d.prototype.get = function(v) {
        return v = a(v), this.has(v) ? this.map[v] : null;
      }, d.prototype.has = function(v) {
        return this.map.hasOwnProperty(a(v));
      }, d.prototype.set = function(v, P) {
        this.map[a(v)] = c(P);
      }, d.prototype.forEach = function(v, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && v.call(P, this.map[b], b, this);
      }, d.prototype.keys = function() {
        var v = [];
        return this.forEach(function(P, b) {
          v.push(b);
        }), u(v);
      }, d.prototype.values = function() {
        var v = [];
        return this.forEach(function(P) {
          v.push(P);
        }), u(v);
      }, d.prototype.entries = function() {
        var v = [];
        return this.forEach(function(P, b) {
          v.push([b, P]);
        }), u(v);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(v) {
        if (!v._noBody) {
          if (v.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          v.bodyUsed = !0;
        }
      }
      function g(v) {
        return new Promise(function(P, b) {
          v.onload = function() {
            P(v.result);
          }, v.onerror = function() {
            b(v.error);
          };
        });
      }
      function p(v) {
        var P = new FileReader(), b = g(P);
        return P.readAsArrayBuffer(v), b;
      }
      function x(v) {
        var P = new FileReader(), b = g(P), T = /charset=([A-Za-z0-9_-]+)/.exec(v.type), z = T ? T[1] : "utf-8";
        return P.readAsText(v, z), b;
      }
      function E(v) {
        for (var P = new Uint8Array(v), b = new Array(P.length), T = 0; T < P.length; T++)
          b[T] = String.fromCharCode(P[T]);
        return b.join("");
      }
      function C(v) {
        if (v.slice)
          return v.slice(0);
        var P = new Uint8Array(v.byteLength);
        return P.set(new Uint8Array(v)), P.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(v) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = v, v ? typeof v == "string" ? this._bodyText = v : r.blob && Blob.prototype.isPrototypeOf(v) ? this._bodyBlob = v : r.formData && FormData.prototype.isPrototypeOf(v) ? this._bodyFormData = v : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) ? this._bodyText = v.toString() : r.arrayBuffer && r.blob && s(v) ? (this._bodyArrayBuffer = C(v.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(v) || o(v)) ? this._bodyArrayBuffer = C(v) : this._bodyText = v = Object.prototype.toString.call(v) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof v == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var v = l(this);
          if (v)
            return v;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var v = l(this);
            return v || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(p);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var v = l(this);
          if (v)
            return v;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(E(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var D = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function S(v) {
        var P = v.toUpperCase();
        return D.indexOf(P) > -1 ? P : v;
      }
      function O(v, P) {
        if (!(this instanceof O))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if (v instanceof O) {
          if (v.bodyUsed)
            throw new TypeError("Already read");
          this.url = v.url, this.credentials = v.credentials, P.headers || (this.headers = new d(v.headers)), this.method = v.method, this.mode = v.mode, this.signal = v.signal, !b && v._bodyInit != null && (b = v._bodyInit, v.bodyUsed = !0);
        } else
          this.url = String(v);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new d(P.headers)), this.method = S(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var L = new AbortController();
            return L.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var z = /\?/;
            this.url += (z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      O.prototype.clone = function() {
        return new O(this, { body: this._bodyInit });
      };
      function _(v) {
        var P = new FormData();
        return v.trim().split("&").forEach(function(b) {
          if (b) {
            var T = b.split("="), z = T.shift().replace(/\+/g, " "), L = T.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(z), decodeURIComponent(L));
          }
        }), P;
      }
      function W(v) {
        var P = new d(), b = v.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var z = T.split(":"), L = z.shift().trim();
          if (L) {
            var at = z.join(":").trim();
            try {
              P.append(L, at);
            } catch (X) {
              console.warn("Response " + X.message);
            }
          }
        }), P;
      }
      U.call(O.prototype);
      function ut(v, P) {
        if (!(this instanceof ut))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new d(P.headers), this.url = P.url || "", this._initBody(v);
      }
      U.call(ut.prototype), ut.prototype.clone = function() {
        return new ut(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, ut.error = function() {
        var v = new ut(null, { status: 200, statusText: "" });
        return v.ok = !1, v.status = 0, v.type = "error", v;
      };
      var J = [301, 302, 303, 307, 308];
      ut.redirect = function(v, P) {
        if (J.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new ut(null, { status: P, headers: { location: v } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, b) {
          this.message = P, this.name = b;
          var T = Error(P);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(v, P) {
        return new Promise(function(b, T) {
          var z = new O(v, P);
          if (z.signal && z.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var L = new XMLHttpRequest();
          function at() {
            L.abort();
          }
          L.onload = function() {
            var $ = {
              statusText: L.statusText,
              headers: W(L.getAllResponseHeaders() || "")
            };
            z.url.indexOf("file://") === 0 && (L.status < 200 || L.status > 599) ? $.status = 200 : $.status = L.status, $.url = "responseURL" in L ? L.responseURL : $.headers.get("X-Request-URL");
            var H = "response" in L ? L.response : L.responseText;
            setTimeout(function() {
              b(new ut(H, $));
            }, 0);
          }, L.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, L.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, L.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function X($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (L.open(z.method, X(z.url), !0), z.credentials === "include" ? L.withCredentials = !0 : z.credentials === "omit" && (L.withCredentials = !1), "responseType" in L && (r.blob ? L.responseType = "blob" : r.arrayBuffer && (L.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof d || n.Headers && P.headers instanceof n.Headers)) {
            var It = [];
            Object.getOwnPropertyNames(P.headers).forEach(function($) {
              It.push(a($)), L.setRequestHeader($, c(P.headers[$]));
            }), z.headers.forEach(function($, H) {
              It.indexOf(H) === -1 && L.setRequestHeader(H, $);
            });
          } else
            z.headers.forEach(function($, H) {
              L.setRequestHeader(H, $);
            });
          z.signal && (z.signal.addEventListener("abort", at), L.onreadystatechange = function() {
            L.readyState === 4 && z.signal.removeEventListener("abort", at);
          }), L.send(typeof z._bodyInit > "u" ? null : z._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = d, n.Request = O, n.Response = ut), e.Headers = d, e.Request = O, e.Response = ut, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : mn);
})();
const Zw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Qw(t, e) {
  const n = {};
  return Object.assign(n, Zw, e), await fetch(t, n);
}
function Jw(t) {
  let e = Qw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function tb(...t) {
  const { fetchLib: e, middlewares: n } = Jw(t);
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
var Xi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xi || (Xi = {}));
var Qs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qs || (Qs = {}));
var vd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vd || (vd = {}));
const eb = "https://api.mainnet.hiro.so", nb = "https://api.testnet.hiro.so", rb = "http://localhost:3999", sb = ["mainnet", "testnet", "devnet", "mocknet"];
let Wi = class {
  constructor(e) {
    this.version = Qs.Mainnet, this.chainId = Xi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Qs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? tb();
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
Wi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Zl();
    case "testnet":
      return new ib();
    case "devnet":
      return new ob();
    case "mocknet":
      return new ap();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${sb.join(", ")}`);
  }
};
Wi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Wi.fromName(t);
let Zl = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? eb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qs.Mainnet, this.chainId = Xi.Mainnet;
  }
}, ib = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? nb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qs.Testnet, this.chainId = Xi.Testnet;
  }
}, ap = class extends Wi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? rb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Qs.Testnet, this.chainId = Xi.Testnet;
  }
};
const ob = ap, cp = "xtrata.wallet.bridge.v1", ab = (t) => typeof t == "object" && t !== null && t.protocol === cp, cb = (t) => ab(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", lb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class _o extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const kd = 12e4;
class ub {
  constructor(e) {
    No(this, "pending", /* @__PURE__ */ new Map());
    No(this, "listenTarget");
    No(this, "closed", !1);
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
    No(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !cb(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new _o("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new _o("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new _o("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = lb(), i = { protocol: cp, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new _o(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? kd}ms.`
          )
        );
      }, this.options.timeoutMs ?? kd);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new _o("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const fb = ["SP", "SM"], db = ["ST", "SN"], hb = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return fb.includes(n) ? "mainnet" : db.includes(n) ? "testnet" : null;
}, pb = () => {
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
}, gb = () => typeof window > "u" || !window.localStorage ? pb() : window.localStorage, wl = "xtrata.v15.1.wallet.session", $d = "mainnet", lc = { isConnected: !1 }, yb = (t) => t.address ? hb(t.address) ?? t.network : t.network, lp = (t) => !t.isConnected || !t.address ? { ...lc } : yb(t) !== $d ? { ...lc } : {
  isConnected: !0,
  address: t.address,
  network: $d,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, wb = (t) => {
  if (!t)
    return { ...lc };
  try {
    const e = JSON.parse(t);
    return lp(e);
  } catch {
    return { ...lc };
  }
}, bb = (t) => {
  const e = lp(t);
  return JSON.stringify(e);
}, mb = (t) => {
  const e = gb();
  return {
    load: () => wb(e.getItem(wl)),
    save: (n) => {
      e.setItem(wl, bb(n));
    },
    clear: () => {
      e.removeItem(wl);
    }
  };
}, xb = "https://browser.blockstack.org/auth", Sb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, up = ["store_write"], Eb = "blockstack-session", Ab = {
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
class po extends Error {
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
class vb extends po {
  constructor(e, n = "") {
    super({ code: gi.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Id extends po {
  constructor(e = "") {
    super({ code: gi.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Sa extends po {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: gi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ld extends po {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: gi.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ql extends po {
  constructor(e) {
    super({ code: gi.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class fp extends po {
  constructor(e) {
    super({ code: gi.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Cd = ["debug", "info", "warn", "error", "none"], Jl = {};
for (let t = 0; t < Cd.length; t++) {
  const e = Cd[t];
  Jl[e] = t;
}
class Ri {
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
    return Jl[Ab.logLevel] <= Jl[e];
  }
}
function kb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function $b() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function bl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Ib() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Lb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Cb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function af(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Lb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ri.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Cb(s, t.toString(), n);
    throw Ri.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Bs(t, e) {
  return cf(hn(t), e);
}
function hn(t) {
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
  if (Cn(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Tb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Td(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ua(t, e = 8) {
  return (typeof t == "bigint" ? t : hn(t)).toString(16).padStart(e * 2, "0");
}
function jc(t) {
  return parseInt(t, 16);
}
function cf(t, e = 16) {
  const n = ua(t, e);
  return Zt(n);
}
function Bb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Mb(t, e) {
  return t & BigInt(1) << e;
}
function tu(t) {
  return Pb(BigInt(`0x${bt(t)}`), BigInt(t.byteLength * 8));
}
function Pb(t, e) {
  return Mb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Nb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Nb[n];
  return e;
}
function Zt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Tb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function yi(t) {
  return new TextEncoder().encode(t);
}
function fa(t) {
  return new TextDecoder().decode(t);
}
function _b(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Ub(t) {
  return String.fromCharCode.apply(null, t);
}
function Ob(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bd(t) {
  if (t.some(Ob))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $r(...t) {
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
function He(t) {
  return $r(...t.map((e) => typeof e == "number" ? Bd([e]) : e instanceof Array ? Bd(e) : e));
}
function Cn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const dp = "https://api.mainnet.hiro.so", hp = "https://api.testnet.hiro.so", pp = "http://localhost:3999", Hb = "https://hub.blockstack.org", Db = 33, ml = 32;
function Fb(t) {
  if (t.length < ml * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ml * 2), r = t.slice(2 + ml * 2);
  return {
    recoveryId: jc(e),
    r: n,
    s: r
  };
}
function lf(t) {
  const e = typeof t == "string" ? Zt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function jb(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Rb(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function zb(t, e) {
  return t[e];
}
function Gb(t, e, n = 0) {
  return t[n] = e, t;
}
function Kb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Js(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Vb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Yb(t, e) {
  const n = {};
  return Object.assign(n, Vb, e), await fetch(t, n);
}
function qb(t) {
  let e = Yb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Xb(...t) {
  const { fetchLib: e, middlewares: n } = qb(t);
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
class gp {
  constructor(e = up.slice(), n = ((a) => (a = af("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = xb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function eu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Wb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Zb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  eu(t.outputLen), eu(t.blockLen);
}
function Qb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jb(t, e) {
  yp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Rs = {
  number: eu,
  bool: Wb,
  bytes: yp,
  hash: Zb,
  exists: Qb,
  output: Jb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, tm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function em(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function uf(t) {
  if (typeof t == "string" && (t = em(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wi(t) {
  const e = (r) => t().update(uf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let bp = class extends wp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Rs.hash(e);
    const r = uf(n);
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
    return Rs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Rs.exists(this), Rs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Rc = (t, e, n) => new bp(t, e).update(n).digest();
Rc.create = (t, e) => new bp(t, e);
function nm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ff = class extends wp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xl(this.buffer);
  }
  update(e) {
    Rs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = uf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rs.exists(this), Rs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    nm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xl(e), c = this.outputLen;
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
const rm = (t, e, n) => t & e ^ ~t & n, sm = (t, e, n) => t & e ^ t & n ^ e & n, im = new Uint32Array([
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
]), Jr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ts = new Uint32Array(64);
let mp = class extends ff {
  constructor() {
    super(64, 32, 8, !1), this.A = Jr[0] | 0, this.B = Jr[1] | 0, this.C = Jr[2] | 0, this.D = Jr[3] | 0, this.E = Jr[4] | 0, this.F = Jr[5] | 0, this.G = Jr[6] | 0, this.H = Jr[7] | 0;
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
      ts[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ts[l - 15], p = ts[l - 2], x = hr(g, 7) ^ hr(g, 18) ^ g >>> 3, E = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      ts[l] = E + ts[l - 7] + x + ts[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), p = d + g + rm(a, c, u) + im[l] + ts[l] | 0, E = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + sm(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    ts.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, om = class extends mp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zi = wi(() => new mp());
wi(() => new om());
const am = {}, xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: am
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const qt = BigInt(0), ye = BigInt(1), ks = BigInt(2), Ko = BigInt(3), Md = BigInt(8), oe = Object.freeze({
  a: qt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ye,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Pd = (t, e) => (t + e / ks) / e, Ea = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = oe, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ye * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Pd(i * t, e), c = Pd(-r * t, e);
    let u = rt(t - a * n - c * s, e), d = rt(-a * r - c * i, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, ar = 32, ti = 32, Sp = 32, uc = ar + 1, fc = 2 * ar + 1;
function Nd(t) {
  const { a: e, b: n } = oe, r = rt(t * t), s = rt(r * t);
  return rt(s + e * t + n);
}
const Aa = oe.a === qt;
class df extends Error {
  constructor(e) {
    super(e);
  }
}
function _d(t) {
  if (!(t instanceof ne))
    throw new TypeError("JacobianPoint expected");
}
class ne {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof jt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(jt.ZERO) ? ne.ZERO : new ne(e.x, e.y, ye);
  }
  static toAffineBatch(e) {
    const n = dm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ne.toAffineBatch(e).map(ne.fromAffine);
  }
  equals(e) {
    _d(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = rt(s * s), u = rt(a * a), d = rt(n * u), l = rt(i * c), g = rt(rt(r * a) * u), p = rt(rt(o * s) * c);
    return d === l && g === p;
  }
  negate() {
    return new ne(this.x, rt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = rt(e * e), i = rt(n * n), o = rt(i * i), a = e + i, c = rt(ks * (rt(a * a) - s - o)), u = rt(Ko * s), d = rt(u * u), l = rt(d - ks * c), g = rt(u * (c - l) - Md * o), p = rt(ks * n * r);
    return new ne(l, g, p);
  }
  add(e) {
    _d(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === qt || o === qt)
      return this;
    if (n === qt || r === qt)
      return e;
    const c = rt(s * s), u = rt(a * a), d = rt(n * u), l = rt(i * c), g = rt(rt(r * a) * u), p = rt(rt(o * s) * c), x = rt(l - d), E = rt(p - g);
    if (x === qt)
      return E === qt ? this.double() : ne.ZERO;
    const C = rt(x * x), U = rt(x * C), D = rt(d * C), S = rt(E * E - U - ks * D), O = rt(E * (D - S) - g * U), _ = rt(s * a * x);
    return new ne(S, O, _);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ne.ZERO;
    if (typeof e == "bigint" && e === qt)
      return n;
    let r = Hd(e);
    if (r === ye)
      return this;
    if (!Aa) {
      let l = n, g = this;
      for (; r > qt; )
        r & ye && (l = l.add(g)), g = g.double(), r >>= ye;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Ea.splitScalar(r), c = n, u = n, d = this;
    for (; i > qt || a > qt; )
      i & ye && (c = c.add(d)), a & ye && (u = u.add(d)), d = d.double(), i >>= ye, a >>= ye;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ne(rt(u.x * Ea.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Aa ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ne.BASE) && (n = jt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && nu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ne.normalizeZ(s), nu.set(n, s)));
    let i = ne.ZERO, o = ne.BASE;
    const a = 1 + (Aa ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const p = g * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= d, e += ye);
      const E = p, C = p + Math.abs(x) - 1, U = g % 2 !== 0, D = x < 0;
      x === 0 ? o = o.add(va(U, s[E])) : i = i.add(va(D, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Hd(e), s, i;
    if (Aa) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Ea.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: p } = this.wNAF(u, n);
      d = va(o, d), g = va(c, g), g = new ne(rt(g.x * Ea.beta), g.y, g.z), s = d.add(g), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ne.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ne.ZERO);
    e == null && (e = i ? Md : go(s));
    const o = e, a = rt(o * o), c = rt(a * o), u = rt(n * a), d = rt(r * c), l = rt(s * o);
    if (i)
      return jt.ZERO;
    if (l !== ye)
      throw new Error("invZ was invalid");
    return new jt(u, d);
  }
}
ne.BASE = new ne(oe.Gx, oe.Gy, ye);
ne.ZERO = new ne(qt, ye, qt);
function va(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const nu = /* @__PURE__ */ new WeakMap();
class jt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, nu.delete(this);
  }
  hasEvenY() {
    return this.y % ks === qt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Hn(n ? e : e.subarray(1));
    if (!Ja(r))
      throw new Error("Point is not on curve");
    const s = Nd(r);
    let i = fm(s);
    const o = (i & ye) === ye;
    n ? o && (i = rt(-i)) : (e[0] & 1) === 1 !== o && (i = rt(-i));
    const a = new jt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Hn(e.subarray(1, ar + 1)), r = Hn(e.subarray(ar + 1, ar * 2 + 1)), s = new jt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ir(e), r = n.length, s = n[0];
    if (r === ar)
      return this.fromCompressedHex(n);
    if (r === uc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === fc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${uc} compressed bytes or ${fc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return jt.BASE.multiply(ei(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = vp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = hf(Ir(e)), { n: a } = oe, c = r === 2 || r === 3 ? s + a : s, u = go(c, a), d = rt(-o * u, a), l = rt(i * u, a), g = r & 1 ? "03" : "02", p = jt.fromHex(g + Is(c)), x = jt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Ls(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Is(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Is(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ja(n) || !Ja(r))
      throw new Error(e);
    const s = rt(r * r), i = Nd(n);
    if (rt(s - i) !== qt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new jt(this.x, rt(-this.y));
  }
  double() {
    return ne.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ne.fromAffine(this).add(ne.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ne.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ne.fromAffine(this), i = n === qt || n === ye || this !== jt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ne.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ne.ZERO) ? void 0 : a.toAffine();
  }
}
jt.BASE = new jt(oe.Gx, oe.Gy);
jt.ZERO = new jt(qt, qt);
function Ud(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Od(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Qi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Hn(n), left: t.subarray(e + 2) };
}
function cm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Qi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Od(t.subarray(2)), { data: r, left: s } = Od(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Qi(s)}`);
  return { r: e, s: r };
}
class On {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Qi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new On(dc(s.slice(0, 64)), dc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = cm(n ? e : Ls(e));
    return new On(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!to(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!to(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = oe.n >> ye;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new On(this.r, rt(-this.s, oe.n)) : this;
  }
  toDERRawBytes() {
    return Ls(this.toDERHex());
  }
  toDERHex() {
    const e = Ud(Uo(this.s)), n = Ud(Uo(this.r)), r = e.length / 2, s = n.length / 2, i = Uo(r), o = Uo(s);
    return `30${Uo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ls(this.toCompactHex());
  }
  toCompactHex() {
    return Is(this.r) + Is(this.s);
  }
}
function As(...t) {
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
const lm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += lm[t[n]];
  return e;
}
const um = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Is(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(qt <= t && t < um))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ji(t) {
  const e = Ls(Is(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Uo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function dc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ls(t) {
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
function Hn(t) {
  return dc(Qi(t));
}
function Ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ls(t);
}
function Hd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && to(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function rt(t, e = oe.P) {
  const n = t % e;
  return n >= qt ? n : e + n;
}
function Vn(t, e) {
  const { P: n } = oe;
  let r = t;
  for (; e-- > qt; )
    r *= r, r %= n;
  return r;
}
function fm(t) {
  const { P: e } = oe, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Vn(u, Ko) * u % e, l = Vn(d, Ko) * u % e, g = Vn(l, ks) * c % e, p = Vn(g, r) * g % e, x = Vn(p, s) * p % e, E = Vn(x, o) * x % e, C = Vn(E, a) * E % e, U = Vn(C, o) * x % e, D = Vn(U, Ko) * u % e, S = Vn(D, i) * p % e, O = Vn(S, n) * c % e, _ = Vn(O, ks);
  if (_ * _ % e !== t)
    throw new Error("Cannot find square root");
  return _;
}
function go(t, e = oe.P) {
  if (t === qt || e <= qt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = rt(t, e), r = e, s = qt, i = ye;
  for (; n !== qt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== ye)
    throw new Error("invert: does not exist");
  return rt(s, e);
}
function dm(t, e = oe.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === qt ? i : (n[a] = i, rt(i * o, e)), ye), s = go(r, e);
  return t.reduceRight((i, o, a) => o === qt ? i : (n[a] = rt(i * n[a], e), rt(i * o, e)), s), n;
}
function hm(t) {
  const e = t.length * 8 - ti * 8, n = Hn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function hf(t, e = !1) {
  const n = hm(t);
  if (e)
    return n;
  const { n: r } = oe;
  return n >= r ? n - r : n;
}
let Yi, Vo;
class Ep {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ce.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Vo(this.k, ...e);
  }
  checkSync() {
    if (typeof Vo != "function")
      throw new df("hmacSha256Sync needs to be set");
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
    return As(...n);
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
    return As(...n);
  }
}
function to(t) {
  return qt < t && t < oe.n;
}
function Ja(t) {
  return qt < t && t < oe.P;
}
function Ap(t, e, n, r = !0) {
  const { n: s } = oe, i = hf(t, !0);
  if (!to(i))
    return;
  const o = go(i, s), a = jt.BASE.multiply(i), c = rt(a.x, s);
  if (c === qt)
    return;
  const u = rt(o * rt(e + n * c, s), s);
  if (u === qt)
    return;
  let d = new On(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ye);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function ei(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ti)
      throw new Error("Expected 32 bytes of private key");
    e = dc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ti)
      throw new Error("Expected 32 bytes of private key");
    e = Hn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!to(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function pf(t) {
  return t instanceof jt ? (t.assertValidity(), t) : jt.fromHex(t);
}
function vp(t) {
  if (t instanceof On)
    return t.assertValidity(), t;
  try {
    return On.fromDER(t);
  } catch {
    return On.fromCompact(t);
  }
}
function da(t, e = !1) {
  return jt.fromPrivateKey(t).toRawBytes(e);
}
function pm(t, e, n, r = !1) {
  return jt.fromSignature(t, e, n).toRawBytes(r);
}
function Dd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === uc || r === fc : n ? r === uc * 2 || r === fc * 2 : t instanceof jt;
}
function gf(t, e, n = !1) {
  if (Dd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Dd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = pf(e);
  return r.assertValidity(), r.multiply(ei(t)).toRawBytes(n);
}
function kp(t) {
  const e = t.length > ar ? t.slice(0, ar) : t;
  return Hn(e);
}
function gm(t) {
  const e = kp(t), n = rt(e, oe.n);
  return $p(n < qt ? e : n);
}
function $p(t) {
  return Ji(t);
}
function Ip(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ir(t), s = ei(e), i = [$p(s), gm(r)];
  if (n != null) {
    n === !0 && (n = Ce.randomBytes(ar));
    const c = Ir(n);
    if (c.length !== ar)
      throw new Error(`sign: Expected ${ar} bytes of extra data`);
    i.push(c);
  }
  const o = As(...i), a = kp(r);
  return { seed: o, m: a, d: s };
}
function Lp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ym(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ip(t, e, n.extraEntropy), o = new Ep(Sp, ti);
  await o.reseed(r);
  let a;
  for (; !(a = Ap(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Lp(a, n);
}
function zc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ip(t, e, n.extraEntropy), o = new Ep(Sp, ti);
  o.reseedSync(r);
  let a;
  for (; !(a = Ap(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Lp(a, n);
}
const wm = { strict: !0 };
function bm(t, e, n, r = wm) {
  let s;
  try {
    s = vp(t), e = Ir(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = hf(e);
  let c;
  try {
    c = pf(n);
  } catch {
    return !1;
  }
  const { n: u } = oe, d = go(o, u), l = rt(a * d, u), g = rt(i * d, u), p = jt.BASE.multiplyAndAddUnsafe(c, l, g);
  return p ? rt(p.x, u) === i : !1;
}
function hc(t) {
  return rt(Hn(t), oe.n);
}
class eo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Hn(n.subarray(0, 32)), s = Hn(n.subarray(32, 64));
    return new eo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ja(e) || !to(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Is(this.r) + Is(this.s);
  }
  toRawBytes() {
    return Ls(this.toHex());
  }
}
function mm(t) {
  return jt.fromPrivateKey(t).toRawX();
}
class Cp {
  constructor(e, n, r = Ce.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ir(e);
    const { x: s, scalar: i } = this.getScalar(ei(n));
    if (this.px = s, this.d = i, this.rand = Ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = jt.fromPrivateKey(e), r = n.hasEvenY() ? e : oe.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ji(e ^ Hn(n));
  }
  finalizeNonce(e) {
    const n = rt(Hn(e), oe.n);
    if (n === qt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new eo(e.x, rt(n + r * s, oe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHash, o = this.initNonce(n, await i(Es.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Es.nonce, o, r, e)), d = hc(await i(Es.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await Mp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHashSync, o = this.initNonce(n, i(Es.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Es.nonce, o, r, e)), d = hc(i(Es.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return Pp(l, e, r) || this.error(), l;
  }
}
async function xm(t, e, n) {
  return new Cp(t, e, n).calc();
}
function Sm(t, e, n) {
  return new Cp(t, e, n).calcSync();
}
function Tp(t, e, n) {
  const r = t instanceof eo, s = r ? t : eo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ir(e),
    P: pf(n)
  };
}
function Bp(t, e, n, r) {
  const s = jt.BASE.multiplyAndAddUnsafe(e, ei(n), rt(-r, oe.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Mp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Tp(t, e, n), a = hc(await Ce.taggedHash(Es.challenge, Ji(r), o.toRawX(), i));
    return Bp(r, o, s, a);
  } catch {
    return !1;
  }
}
function Pp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Tp(t, e, n), a = hc(Ce.taggedHashSync(Es.challenge, Ji(r), o.toRawX(), i));
    return Bp(r, o, s, a);
  } catch (r) {
    if (r instanceof df)
      throw r;
    return !1;
  }
}
const Em = {
  Signature: eo,
  getPublicKey: mm,
  sign: xm,
  verify: Mp,
  signSync: Sm,
  verifySync: Pp
};
jt.BASE._setWindowSize(8);
const Mn = {
  node: xp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Es = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ka = {}, Ce = {
  bytesToHex: Qi,
  hexToBytes: Ls,
  concatBytes: As,
  mod: rt,
  invert: go,
  isValidPrivateKey(t) {
    try {
      return ei(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ji,
  _normalizePrivateKey: ei,
  hashToPrivateKey: (t) => {
    t = Ir(t);
    const e = ti + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = rt(Hn(t), oe.n - ye) + ye;
    return Ji(n);
  },
  randomBytes: (t = 32) => {
    if (Mn.web)
      return Mn.web.getRandomValues(new Uint8Array(t));
    if (Mn.node) {
      const { randomBytes: e } = Mn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(ti + 8)),
  precompute(t = 8, e = jt.BASE) {
    const n = e === jt.BASE ? e : new jt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ko), n;
  },
  sha256: async (...t) => {
    if (Mn.web) {
      const e = await Mn.web.subtle.digest("SHA-256", As(...t));
      return new Uint8Array(e);
    } else if (Mn.node) {
      const { createHash: e } = Mn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Mn.web) {
      const n = await Mn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = As(...e), s = await Mn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Mn.node) {
      const { createHmac: n } = Mn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ka[t];
    if (n === void 0) {
      const r = await Ce.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = As(r, r), ka[t] = n;
    }
    return Ce.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Yi != "function")
      throw new df("sha256Sync is undefined, you need to set it");
    let n = ka[t];
    if (n === void 0) {
      const r = Yi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = As(r, r), ka[t] = n;
    }
    return Yi(n, ...e);
  },
  _JacobianPoint: ne
};
Object.defineProperties(Ce, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Yi;
    },
    set(t) {
      Yi || (Yi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Vo;
    },
    set(t) {
      Vo || (Vo = t);
    }
  }
});
const Am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: oe,
  Point: jt,
  Signature: On,
  getPublicKey: da,
  getSharedSecret: gf,
  recoverPublicKey: pm,
  schnorr: Em,
  sign: ym,
  signSync: zc,
  utils: Ce,
  verify: bm
}, Symbol.toStringTag, { value: "Module" }));
var ha = {};
ha.byteLength = Lm;
var vm = ha.toByteArray = Tm, km = ha.fromByteArray = Pm, mr = [], Xn = [], $m = typeof Uint8Array < "u" ? Uint8Array : Array, Sl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ni = 0, Im = Sl.length; Ni < Im; ++Ni)
  mr[Ni] = Sl[Ni], Xn[Sl.charCodeAt(Ni)] = Ni;
Xn[45] = 62;
Xn[95] = 63;
function Np(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Lm(t) {
  var e = Np(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Cm(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Tm(t) {
  var e, n = Np(t), r = n[0], s = n[1], i = new $m(Cm(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Xn[t.charCodeAt(c)] << 18 | Xn[t.charCodeAt(c + 1)] << 12 | Xn[t.charCodeAt(c + 2)] << 6 | Xn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Xn[t.charCodeAt(c)] << 2 | Xn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Xn[t.charCodeAt(c)] << 10 | Xn[t.charCodeAt(c + 1)] << 4 | Xn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Bm(t) {
  return mr[t >> 18 & 63] + mr[t >> 12 & 63] + mr[t >> 6 & 63] + mr[t & 63];
}
function Mm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Bm(r));
  return s.join("");
}
function Pm(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Mm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    mr[e >> 2] + mr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    mr[e >> 10] + mr[e >> 4 & 63] + mr[e << 2 & 63] + "="
  )), s.join("");
}
function Nm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const _m = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Um() {
  if (Nm())
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
    throw new Error(_m);
  }
}
class Om {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array($r(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array($r(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Hm {
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
async function _p() {
  const t = await Um();
  return t.name === "subtleCrypto" ? new Hm(t.lib) : new Om(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Dm(t) {
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
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, E = 0, C = 0, U = p.length; C !== U && p[C] === 0; )
      C++, x++;
    for (var D = (U - C) * u + 1 >>> 0, S = new Uint8Array(D); C !== U; ) {
      for (var O = p[C], _ = 0, W = D - 1; (O !== 0 || _ < E) && W !== -1; W--, _++)
        O += 256 * S[W] >>> 0, S[W] = O % o >>> 0, O = O / o >>> 0;
      if (O !== 0)
        throw new Error("Non-zero carry");
      E = _, C++;
    }
    for (var ut = D - E; ut !== D && S[ut] === 0; )
      ut++;
    for (var J = a.repeat(x); ut < D; ++ut)
      J += t.charAt(S[ut]);
    return J;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, E = 0, C = 0; p[x] === a; )
      E++, x++;
    for (var U = (p.length - x) * c + 1 >>> 0, D = new Uint8Array(U); p[x]; ) {
      var S = p.charCodeAt(x);
      if (S > 255)
        return;
      var O = e[S];
      if (O === 255)
        return;
      for (var _ = 0, W = U - 1; (O !== 0 || _ < C) && W !== -1; W--, _++)
        O += o * D[W] >>> 0, D[W] = O % 256 >>> 0, O = O / 256 >>> 0;
      if (O !== 0)
        throw new Error("Non-zero carry");
      C = _, x++;
    }
    for (var ut = U - C; ut !== U && D[ut] === 0; )
      ut++;
    for (var J = new Uint8Array(E + (U - ut)), q = E; ut !== U; )
      J[q++] = D[ut++];
    return J;
  }
  function g(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var Up = Dm;
const Fm = Up, jm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Rm = Fm(jm);
const zm = /* @__PURE__ */ op(Rm), Gm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Op = Uint8Array.from({ length: 16 }, (t, e) => e), Km = Op.map((t) => (9 * t + 5) % 16);
let yf = [Op], wf = [Km];
for (let t = 0; t < 4; t++)
  for (let e of [yf, wf])
    e.push(e[t].map((n) => Gm[n]));
const Hp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Vm = yf.map((t, e) => t.map((n) => Hp[e][n])), Ym = wf.map((t, e) => t.map((n) => Hp[e][n])), qm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Xm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $a = (t, e) => t << e | t >>> 32 - e;
function Fd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ia = new Uint32Array(16);
let Wm = class extends ff {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ia[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = qm[p], C = Xm[p], U = yf[p], D = wf[p], S = Vm[p], O = Ym[p];
      for (let _ = 0; _ < 16; _++) {
        const W = $a(r + Fd(p, i, a, u) + Ia[U[_]] + E, S[_]) + l | 0;
        r = l, l = u, u = $a(a, 10) | 0, a = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = $a(s + Fd(x, o, c, d) + Ia[D[_]] + C, O[_]) + g | 0;
        s = g, g = d, d = $a(c, 10) | 0, c = o, o = W;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ia.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Zm = wi(() => new Wm());
function Qm(t) {
  return Zm(t);
}
const La = BigInt(2 ** 32 - 1), ru = BigInt(32);
function Dp(t, e = !1) {
  return e ? { h: Number(t & La), l: Number(t >> ru & La) } : { h: Number(t >> ru & La) | 0, l: Number(t & La) | 0 };
}
function Jm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const t1 = (t, e) => BigInt(t >>> 0) << ru | BigInt(e >>> 0), e1 = (t, e, n) => t >>> n, n1 = (t, e, n) => t << 32 - n | e >>> n, r1 = (t, e, n) => t >>> n | e << 32 - n, s1 = (t, e, n) => t << 32 - n | e >>> n, i1 = (t, e, n) => t << 64 - n | e >>> n - 32, o1 = (t, e, n) => t >>> n - 32 | e << 64 - n, a1 = (t, e) => e, c1 = (t, e) => t, l1 = (t, e, n) => t << n | e >>> 32 - n, u1 = (t, e, n) => e << n | t >>> 32 - n, f1 = (t, e, n) => e << n - 32 | t >>> 64 - n, d1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function h1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const p1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), g1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, y1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), w1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, b1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), m1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Dp,
  split: Jm,
  toBig: t1,
  shrSH: e1,
  shrSL: n1,
  rotrSH: r1,
  rotrSL: s1,
  rotrBH: i1,
  rotrBL: o1,
  rotr32H: a1,
  rotr32L: c1,
  rotlSH: l1,
  rotlSL: u1,
  rotlBH: f1,
  rotlBL: d1,
  add: h1,
  add3L: p1,
  add3H: g1,
  add4L: y1,
  add4H: w1,
  add5H: m1,
  add5L: b1
}, [x1, S1] = Pt.split([
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
].map((t) => BigInt(t))), es = new Uint32Array(80), ns = new Uint32Array(80);
let Gc = class extends ff {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      es[S] = e.getUint32(n), ns[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const O = es[S - 15] | 0, _ = ns[S - 15] | 0, W = Pt.rotrSH(O, _, 1) ^ Pt.rotrSH(O, _, 8) ^ Pt.shrSH(O, _, 7), ut = Pt.rotrSL(O, _, 1) ^ Pt.rotrSL(O, _, 8) ^ Pt.shrSL(O, _, 7), J = es[S - 2] | 0, q = ns[S - 2] | 0, v = Pt.rotrSH(J, q, 19) ^ Pt.rotrBH(J, q, 61) ^ Pt.shrSH(J, q, 6), P = Pt.rotrSL(J, q, 19) ^ Pt.rotrBL(J, q, 61) ^ Pt.shrSL(J, q, 6), b = Pt.add4L(ut, P, ns[S - 7], ns[S - 16]), T = Pt.add4H(b, W, v, es[S - 7], es[S - 16]);
      es[S] = T | 0, ns[S] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: C, Hh: U, Hl: D } = this;
    for (let S = 0; S < 80; S++) {
      const O = Pt.rotrSH(l, g, 14) ^ Pt.rotrSH(l, g, 18) ^ Pt.rotrBH(l, g, 41), _ = Pt.rotrSL(l, g, 14) ^ Pt.rotrSL(l, g, 18) ^ Pt.rotrBL(l, g, 41), W = l & p ^ ~l & E, ut = g & x ^ ~g & C, J = Pt.add5L(D, _, ut, S1[S], ns[S]), q = Pt.add5H(J, U, O, W, x1[S], es[S]), v = J | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), b = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = C | 0, E = p | 0, C = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Pt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const L = Pt.add3L(v, b, z);
      r = Pt.add3H(L, q, P, T), s = L | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Pt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = Pt.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: U, l: D } = Pt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, C, U, D);
  }
  roundClean() {
    es.fill(0), ns.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, E1 = class extends Gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, A1 = class extends Gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, v1 = class extends Gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const k1 = wi(() => new Gc());
wi(() => new E1());
wi(() => new A1());
wi(() => new v1());
function Fp(t) {
  return Zi(t);
}
function $1(t) {
  return k1(t);
}
const I1 = 0;
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Rc.create(Zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function L1() {
  return bt(Ce.randomPrivateKey());
}
function C1(t) {
  const e = Zi(Zi(t));
  return zm.encode($r(t, e).slice(0, t.length + 4));
}
function T1(t, e) {
  return C1($r(new Uint8Array([t]), e.slice(0, 20)));
}
function jp(t, e = I1) {
  const n = typeof t == "string" ? Zt(t) : t, r = Qm(Fp(n));
  return T1(e, r);
}
function Rp(t) {
  const e = lf(t);
  return bt(da(e.slice(0, 32), !0));
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Rc.create(Zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var pc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(pc || (pc = {}));
async function B1(t, e, n) {
  return await (await _p()).encrypt("aes-256-cbc", e, t, n);
}
async function M1(t, e, n) {
  return await (await _p()).decrypt("aes-256-cbc", e, t, n);
}
function zp(t, e) {
  return Rc(Zi, t, e);
}
function P1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Gp(t) {
  const e = $1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function N1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function _1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: pc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: pc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !N1(t))
    return e;
  try {
    return jt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function U1(t, e, n, r) {
  const s = _1(t);
  if (!s.result)
    throw s;
  const i = Ce.randomPrivateKey(), o = da(i, !0);
  let a = gf(i, t, !0);
  a = a.slice(1);
  const c = Gp(a), u = Ce.randomBytes(16), d = await B1(u, c.encryptionKey, e), l = $r(u, o, d), g = zp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = bt(d);
  else if (r === "base64")
    p = km(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: p,
    mac: bt(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Kp(t, e) {
  if (!e.ephemeralPK)
    throw new Ld("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = gf(t, n, !0);
  r = r.slice(1);
  const s = Gp(r), i = Zt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Zt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = vm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = $r(i, Zt(n), o), c = zp(s.hmacKey, a), u = Zt(e.mac);
  if (!P1(u, c))
    throw new Ld("Decryption failed: failure in MAC check");
  const d = await M1(i, s.encryptionKey, o);
  return e.wasString ? fa(d) : d;
}
function O1(t, e) {
  const n = typeof e == "string" ? yi(e) : e, r = Rp(t), s = Fp(n), i = zc(s, t);
  return {
    signature: bt(i),
    publicKey: r
  };
}
async function H1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Rp(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? yi(t) : t, o = await U1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = O1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function D1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Kp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var sn = {}, no = {}, wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.decode = wn.encode = wn.unescape = wn.escape = wn.pad = void 0;
const Vp = ha;
function bf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
wn.pad = bf;
function Yp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
wn.escape = Yp;
function qp(t) {
  return bf(t).replace(/-/g, "+").replace(/_/g, "/");
}
wn.unescape = qp;
function F1(t) {
  return Yp((0, Vp.fromByteArray)(new TextEncoder().encode(t)));
}
wn.encode = F1;
function j1(t) {
  return new TextDecoder().decode((0, Vp.toByteArray)(bf(qp(t))));
}
wn.decode = j1;
var Kc = {}, Vc = {}, Xp = {}, Wp = {}, Yc = {};
Object.defineProperty(Yc, "__esModule", { value: !0 });
Yc.crypto = void 0;
Yc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = p, t.byteSwap = x, t.byteSwap32 = E, t.bytesToHex = D, t.hexToBytes = _, t.asyncLoop = ut, t.utf8ToBytes = J, t.bytesToUtf8 = q, t.toBytes = v, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = T, t.createHasher = L, t.createOptHasher = at, t.createXOFer = X, t.randomBytes = It;
  const e = Yc;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...H) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (H.length > 0 && !H.includes($.length))
      throw new Error("Uint8Array expected of length " + H + ", got length=" + $.length);
  }
  function i($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function o($, H = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (H && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, H) {
    s($);
    const ft = H.outputLen;
    if ($.length < ft)
      throw new Error("digestInto() expects output buffer of length at least " + ft);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function u($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function d(...$) {
    for (let H = 0; H < $.length; H++)
      $[H].fill(0);
  }
  function l($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function g($, H) {
    return $ << 32 - H | $ >>> H;
  }
  function p($, H) {
    return $ << H | $ >>> 32 - H >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? ($) => $ : ($) => x($), t.byteSwapIfBE = t.swap8IfBE;
  function E($) {
    for (let H = 0; H < $.length; H++)
      $[H] = x($[H]);
    return $;
  }
  t.swap32IfBE = t.isLE ? ($) => $ : E;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, ($, H) => H.toString(16).padStart(2, "0"));
  function D($) {
    if (s($), C)
      return $.toHex();
    let H = "";
    for (let ft = 0; ft < $.length; ft++)
      H += U[$[ft]];
    return H;
  }
  const S = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function O($) {
    if ($ >= S._0 && $ <= S._9)
      return $ - S._0;
    if ($ >= S.A && $ <= S.F)
      return $ - (S.A - 10);
    if ($ >= S.a && $ <= S.f)
      return $ - (S.a - 10);
  }
  function _($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (C)
      return Uint8Array.fromHex($);
    const H = $.length, ft = H / 2;
    if (H % 2)
      throw new Error("hex string expected, got unpadded hex of length " + H);
    const ct = new Uint8Array(ft);
    for (let dt = 0, Ht = 0; dt < ft; dt++, Ht += 2) {
      const At = O($.charCodeAt(Ht)), Lt = O($.charCodeAt(Ht + 1));
      if (At === void 0 || Lt === void 0) {
        const Qt = $[Ht] + $[Ht + 1];
        throw new Error('hex string expected, got non-hex character "' + Qt + '" at index ' + Ht);
      }
      ct[dt] = At * 16 + Lt;
    }
    return ct;
  }
  const W = async () => {
  };
  t.nextTick = W;
  async function ut($, H, ft) {
    let ct = Date.now();
    for (let dt = 0; dt < $; dt++) {
      ft(dt);
      const Ht = Date.now() - ct;
      Ht >= 0 && Ht < H || (await (0, t.nextTick)(), ct += Ht);
    }
  }
  function J($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function q($) {
    return new TextDecoder().decode($);
  }
  function v($) {
    return typeof $ == "string" && ($ = J($)), s($), $;
  }
  function P($) {
    return typeof $ == "string" && ($ = J($)), s($), $;
  }
  function b(...$) {
    let H = 0;
    for (let ct = 0; ct < $.length; ct++) {
      const dt = $[ct];
      s(dt), H += dt.length;
    }
    const ft = new Uint8Array(H);
    for (let ct = 0, dt = 0; ct < $.length; ct++) {
      const Ht = $[ct];
      ft.set(Ht, dt), dt += Ht.length;
    }
    return ft;
  }
  function T($, H) {
    if (H !== void 0 && {}.toString.call(H) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, H);
  }
  class z {
  }
  t.Hash = z;
  function L($) {
    const H = (ct) => $().update(v(ct)).digest(), ft = $();
    return H.outputLen = ft.outputLen, H.blockLen = ft.blockLen, H.create = () => $(), H;
  }
  function at($) {
    const H = (ct, dt) => $(dt).update(v(ct)).digest(), ft = $({});
    return H.outputLen = ft.outputLen, H.blockLen = ft.blockLen, H.create = (ct) => $(ct), H;
  }
  function X($) {
    const H = (ct, dt) => $(dt).update(v(ct)).digest(), ft = $({});
    return H.outputLen = ft.outputLen, H.blockLen = ft.blockLen, H.create = (ct) => $(ct), H;
  }
  t.wrapConstructor = L, t.wrapConstructorWithOpts = at, t.wrapXOFConstructorWithOpts = X;
  function It($ = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array($));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Wp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Wp;
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
})(Xp);
const _i = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Zp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function bi(t, ...e) {
  if (!Zp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function R1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  su(t.outputLen), su(t.blockLen);
}
function iu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qp(t, e) {
  bi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function z1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function G1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function gc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function tc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function er(t, e) {
  return t << 32 - e | t >>> e;
}
function K1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const mf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xf(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Jp = mf ? (t) => t : (t) => xf(t), V1 = Jp;
function tg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = xf(t[e]);
  return t;
}
const Y1 = mf ? (t) => t : tg, eg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", q1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ng(t) {
  if (bi(t), eg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += q1[t[n]];
  return e;
}
const Ur = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function jd(t) {
  if (t >= Ur._0 && t <= Ur._9)
    return t - Ur._0;
  if (t >= Ur.A && t <= Ur.F)
    return t - (Ur.A - 10);
  if (t >= Ur.a && t <= Ur.f)
    return t - (Ur.a - 10);
}
function X1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (eg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = jd(t.charCodeAt(i)), a = jd(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const rg = async () => {
};
async function W1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await rg(), r += i);
  }
}
function Sf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Z1(t) {
  return new TextDecoder().decode(t);
}
function pa(t) {
  return typeof t == "string" && (t = Sf(t)), bi(t), t;
}
function Q1(t) {
  return typeof t == "string" && (t = Sf(t)), bi(t), t;
}
function J1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    bi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function t2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let sg = class {
};
function qc(t) {
  const e = (r) => t().update(pa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ig(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function og(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const e2 = qc, n2 = ig, r2 = og;
function s2(t = 32) {
  if (_i && typeof _i.getRandomValues == "function")
    return _i.getRandomValues(new Uint8Array(t));
  if (_i && typeof _i.randomBytes == "function")
    return Uint8Array.from(_i.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const i2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: sg,
  abytes: bi,
  aexists: iu,
  ahash: R1,
  anumber: su,
  aoutput: Qp,
  asyncLoop: W1,
  byteSwap: xf,
  byteSwap32: tg,
  byteSwapIfBE: V1,
  bytesToHex: ng,
  bytesToUtf8: Z1,
  checkOpts: t2,
  clean: gc,
  concatBytes: J1,
  createHasher: qc,
  createOptHasher: ig,
  createView: tc,
  createXOFer: og,
  hexToBytes: X1,
  isBytes: Zp,
  isLE: mf,
  kdfInputToBytes: Q1,
  nextTick: rg,
  randomBytes: s2,
  rotl: K1,
  rotr: er,
  swap32IfBE: Y1,
  swap8IfBE: Jp,
  toBytes: pa,
  u32: G1,
  u8: z1,
  utf8ToBytes: Sf,
  wrapConstructor: e2,
  wrapConstructorWithOpts: n2,
  wrapXOFConstructorWithOpts: r2
}, Symbol.toStringTag, { value: "Module" }));
function o2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function a2(t, e, n) {
  return t & e ^ ~t & n;
}
function c2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class l2 extends sg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = tc(this.buffer);
  }
  update(e) {
    iu(this), e = pa(e), bi(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = tc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    iu(this), Qp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, gc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    o2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = tc(e), c = this.outputLen;
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
const rs = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ss = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), u2 = /* @__PURE__ */ Uint32Array.from([
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
]), is = /* @__PURE__ */ new Uint32Array(64);
let Ef = class extends l2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = rs[0] | 0, this.B = rs[1] | 0, this.C = rs[2] | 0, this.D = rs[3] | 0, this.E = rs[4] | 0, this.F = rs[5] | 0, this.G = rs[6] | 0, this.H = rs[7] | 0;
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
      is[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = is[l - 15], p = is[l - 2], x = er(g, 7) ^ er(g, 18) ^ g >>> 3, E = er(p, 17) ^ er(p, 19) ^ p >>> 10;
      is[l] = E + is[l - 7] + x + is[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = er(a, 6) ^ er(a, 11) ^ er(a, 25), p = d + g + a2(a, c, u) + u2[l] + is[l] | 0, E = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + c2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    gc(is);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), gc(this.buffer);
  }
}, ag = class extends Ef {
  constructor() {
    super(28), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
  }
};
const f2 = /* @__PURE__ */ qc(() => new Ef()), d2 = /* @__PURE__ */ qc(() => new ag()), h2 = Ef, cg = f2, p2 = ag, g2 = d2, y2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: p2,
  SHA256: h2,
  sha224: g2,
  sha256: cg
}, Symbol.toStringTag, { value: "Module" })), Xc = /* @__PURE__ */ Fc(y2), w2 = /* @__PURE__ */ Fc(Am);
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.joseToDer = ro.derToJose = void 0;
const lg = ha, ug = wn;
function El(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const b2 = {
  ES256: El(256),
  ES384: El(384),
  ES512: El(521)
};
function fg(t) {
  const e = b2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const yc = 128, dg = 0, m2 = 32, x2 = 16, S2 = 2, hg = x2 | m2 | dg << 6, wc = S2 | dg << 6;
function pg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, lg.toByteArray)((0, ug.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function E2(t, e) {
  const n = pg(t), r = fg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== hg)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (yc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== wc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== wc)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, p = r - d, x = new Uint8Array(g + c + p + d);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const E = o; o < E + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, ug.escape)((0, lg.fromByteArray)(x));
}
ro.derToJose = E2;
function Rd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= yc && --r, r;
}
function A2(t, e) {
  t = pg(t);
  const n = fg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Rd(t, 0, n), i = Rd(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < yc, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = hg, u ? d[l++] = c : (d[l++] = yc | 1, d[l++] = c & 255), d[l++] = wc, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = wc, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
ro.joseToDer = A2;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.InvalidTokenError = Vr.MissingParametersError = void 0;
class v2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Vr.MissingParametersError = v2;
class k2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Vr.InvalidTokenError = k2;
const ga = /* @__PURE__ */ Fc(i2);
Object.defineProperty(Vc, "__esModule", { value: !0 });
Vc.SECP256K1Client = void 0;
const $2 = Xp, I2 = Xc, ec = w2, zd = ro, Gd = Vr, Kd = ga;
ec.utils.hmacSha256Sync = (t, ...e) => {
  const n = $2.hmac.create(I2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class gg {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Kd.bytesToHex)(ec.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Gd.MissingParametersError("a signing input hash and private key are all required");
    const s = ec.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Kd.bytesToHex)(s);
    if (r === "jose")
      return (0, zd.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, zd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Gd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ec.verify(n, e, r, { strict: !1 });
  }
}
Vc.SECP256K1Client = gg;
gg.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Vc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Kc);
var ni = {};
const L2 = /* @__PURE__ */ Fc(xp);
var C2 = mn && mn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.hashSha256Async = ni.hashSha256 = void 0;
const T2 = Xc;
function yg(t) {
  return (0, T2.sha256)(t);
}
ni.hashSha256 = yg;
function B2(t) {
  return C2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = L2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(yg(t));
    }
  });
}
ni.hashSha256Async = B2;
var M2 = mn && mn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(no, "__esModule", { value: !0 });
no.TokenSigner = no.createUnsecuredToken = void 0;
const ou = wn, Vd = Kc, P2 = Vr, Yd = ni;
function au(t, e) {
  const n = [], r = ou.encode(JSON.stringify(e));
  n.push(r);
  const s = ou.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function N2(t) {
  return au(t, { typ: "JWT", alg: "none" }) + ".";
}
no.createUnsecuredToken = N2;
class _2 {
  constructor(e, n) {
    if (!(e && n))
      throw new P2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Vd.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Vd.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = au(e, s), o = (0, Yd.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return M2(this, void 0, void 0, function* () {
      const s = this.header(r), i = au(e, s), o = yield (0, Yd.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ou.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
no.TokenSigner = _2;
var Wc = {};
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.TokenVerifier = void 0;
const U2 = wn, qd = Kc, O2 = Vr, Ca = ni;
class H2 {
  constructor(e, n) {
    if (!(e && n))
      throw new O2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !qd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = qd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ca.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ca.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), U2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ca.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ca.hashSha256)(r);
      return i(o);
    }
  }
}
Wc.TokenVerifier = H2;
var Zc = {};
Object.defineProperty(Zc, "__esModule", { value: !0 });
Zc.decodeToken = void 0;
const Ta = wn;
function D2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Ta.decode(e[0])), r = JSON.parse(Ta.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Ta.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Ta.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Zc.decodeToken = D2;
(function(t) {
  var e = mn && mn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = mn && mn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(no, t), n(Wc, t), n(Zc, t), n(Vr, t), n(Kc, t);
})(sn);
function F2(t) {
  return `did:btc-addr:${t}`;
}
function j2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Id("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Id('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function wg(t) {
  if (t)
    return j2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const R2 = "1.4.0";
function z2() {
  return L1();
}
function G2(t, e, n, r = up.slice(), s, i = kb().getTime(), o = {}) {
  const a = (p) => {
    const x = af("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Ib(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: R2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = sn.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = jp(u);
  return c.iss = F2(d), new sn.TokenSigner("ES256k", t).sign(c);
}
async function Xd(t, e) {
  const n = fa(Zt(e)), r = JSON.parse(n), s = await Kp(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function K2(t) {
  const e = sn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new sn.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function V2(t) {
  const e = sn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = wg(e.iss);
  if (n.length === 1) {
    if (jp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Y2(t) {
  const e = sn.decodeToken(t).payload;
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
function q2(t) {
  const e = sn.decodeToken(t).payload;
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
function X2(t) {
  const e = [
    q2(t),
    Y2(t),
    K2(t),
    V2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Wd = "1.0.0";
class Cs {
  constructor(e) {
    this.version = Wd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Wd)
      throw new Ql(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Cs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class bg {
  constructor(e) {
    if (e) {
      const n = new Cs(e);
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
class Zd extends bg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Cs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new fp("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Cs({})), !0;
  }
}
class Qd extends bg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Eb, !localStorage.getItem(this.key)) {
      const r = new Cs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new fp("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Cs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Cs({})), !0;
  }
}
var Jo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Jo || (Jo = {}));
var bc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(bc || (bc = {}));
Jo.Mainnet;
var zr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zr || (zr = {}));
var Er;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Er || (Er = {}));
zr.Mainnet;
const mg = {
  chainId: Jo.Mainnet,
  transactionVersion: zr.Mainnet,
  peerNetworkId: bc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Er.MainnetSingleSig,
    multiSig: Er.MainnetMultiSig
  },
  client: { baseUrl: dp }
}, cu = {
  chainId: Jo.Testnet,
  transactionVersion: zr.Testnet,
  peerNetworkId: bc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Er.TestnetSingleSig,
    multiSig: Er.TestnetMultiSig
  },
  client: { baseUrl: hp }
}, nc = {
  ...cu,
  addressVersion: { ...cu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: pp }
}, W2 = {
  ...nc,
  addressVersion: { ...nc.addressVersion },
  client: { ...nc.client }
};
function Z2(t) {
  switch (t) {
    case "mainnet":
      return mg;
    case "testnet":
      return cu;
    case "devnet":
      return nc;
    case "mocknet":
      return W2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function xg(t) {
  return typeof t == "string" ? Z2(t) : t;
}
var Jd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(th || (th = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const Al = ["onChainOnly", "offChainOnly", "any"];
Al[0] + "", nr.OnChainOnly, Al[1] + "", nr.OffChainOnly, Al[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var eh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(eh || (eh = {}));
var nh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(nh || (nh = {}));
var rh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(rh || (rh = {}));
var jr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(jr || (jr = {}));
var sh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(sh || (sh = {}));
var ih;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ih || (ih = {}));
var oh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(oh || (oh = {}));
var ah;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ah || (ah = {}));
var ch;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ch || (ch = {}));
var lh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(lh || (lh = {}));
var uh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fh || (fh = {}));
var dh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(dh || (dh = {}));
function lu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Q2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Sg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function J2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  lu(t.outputLen), lu(t.blockLen);
}
function tx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ex(t, e) {
  Sg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: lu,
  bool: Q2,
  bytes: Sg,
  hash: J2,
  exists: tx,
  output: ex
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, nx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!nx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function rx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Af(t) {
  if (typeof t == "string" && (t = rx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Eg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function mi(t) {
  const e = (r) => t().update(Af(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ag = class extends Eg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zs.hash(e);
    const r = Af(n);
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
    return zs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    zs.exists(this), zs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const vg = (t, e, n) => new Ag(t, e).update(n).digest();
vg.create = (t, e) => new Ag(t, e);
function sx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let vf = class extends Eg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = vl(this.buffer);
  }
  update(e) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Af(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = vl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs.exists(this), zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    sx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = vl(e), c = this.outputLen;
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
const ix = (t, e, n) => t & e ^ ~t & n, ox = (t, e, n) => t & e ^ t & n ^ e & n, ax = new Uint32Array([
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
]), os = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), as = new Uint32Array(64);
let kg = class extends vf {
  constructor() {
    super(64, 32, 8, !1), this.A = os[0] | 0, this.B = os[1] | 0, this.C = os[2] | 0, this.D = os[3] | 0, this.E = os[4] | 0, this.F = os[5] | 0, this.G = os[6] | 0, this.H = os[7] | 0;
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
      as[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = as[l - 15], p = as[l - 2], x = pr(g, 7) ^ pr(g, 18) ^ g >>> 3, E = pr(p, 17) ^ pr(p, 19) ^ p >>> 10;
      as[l] = E + as[l - 7] + x + as[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), p = d + g + ix(a, c, u) + ax[l] + as[l] | 0, E = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + ox(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    as.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, cx = class extends kg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $g = mi(() => new kg());
mi(() => new cx());
var xi = {}, kf = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ga;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(o[p]) >> u;
        let E = 0;
        p !== 0 && (E = n.indexOf(o[p - 1]));
        const C = 1 + u, U = E % (1 << C) << 5 - C, D = t.c32[x + U];
        u = C, c.unshift(D);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let p = 0; p < g; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let x = 0; x < p; x++)
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
    for (let E = o.length - 1; E >= 0; E--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const U = (t.c32.indexOf(o[E]) << g) + l, D = n[U % 16];
      if (g += 1, l = U >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(D);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let E = 0; E < d.length && d[E] === "0"; E++)
      p++;
    d = d.slice(p - p % 2);
    let x = d.join("");
    for (let E = 0; E < u; E++)
      x = `00${x}`;
    if (a) {
      const E = a * 2 - x.length;
      for (let C = 0; C < E; C += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(kf);
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.c32checkDecode = ri.c32checkEncode = void 0;
const hh = Xc, ph = ga, Yo = kf;
function Ig(t) {
  const e = (0, hh.sha256)((0, hh.sha256)((0, ph.hexToBytes)(t)));
  return (0, ph.bytesToHex)(e.slice(0, 4));
}
function lx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Ig(`${n}${e}`), s = (0, Yo.c32encode)(`${e}${r}`);
  return `${Yo.c32[t]}${s}`;
}
ri.c32checkEncode = lx;
function ux(t) {
  t = (0, Yo.c32normalize)(t);
  const e = (0, Yo.c32decode)(t.slice(1)), n = t[0], r = Yo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Ig(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ri.c32checkDecode = ux;
var Lg = {}, so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.decode = so.encode = void 0;
const mc = Xc, gh = ga, Cg = Up, Tg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function fx(t, e = "00") {
  const n = typeof t == "string" ? (0, gh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, gh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, mc.sha256)((0, mc.sha256)(new Uint8Array([...r, ...n])));
  return Cg(Tg).encode([...r, ...n, ...s.slice(0, 4)]);
}
so.encode = fx;
function dx(t) {
  const e = Cg(Tg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, mc.sha256)((0, mc.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
so.decode = dx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ri, n = so, r = ga;
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
    const g = n.decode(d), p = (0, r.bytesToHex)(g.data), x = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let E;
    return l < 0 ? (E = x, s[x] !== void 0 && (E = s[x])) : E = l, o(E, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), p = g[0], x = g[1];
    let E;
    l < 0 ? (E = p, i[p] !== void 0 && (E = i[p])) : E = l;
    let C = E.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(x, C);
  }
  t.c32ToB58 = u;
})(Lg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = kf;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ri;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Lg;
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
})(xi);
function hx(t, e) {
  switch (e = xg(e ?? mg), t) {
    case jr.P2PKH:
      switch (e.transactionVersion) {
        case zr.Mainnet:
          return Er.MainnetSingleSig;
        case zr.Testnet:
          return Er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case jr.P2SH:
    case jr.P2SHNonSequential:
    case jr.P2WPKH:
    case jr.P2WSH:
    case jr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case zr.Mainnet:
          return Er.MainnetMultiSig;
        case zr.Testnet:
          return Er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const px = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bg = Uint8Array.from({ length: 16 }, (t, e) => e), gx = Bg.map((t) => (9 * t + 5) % 16);
let $f = [Bg], If = [gx];
for (let t = 0; t < 4; t++)
  for (let e of [$f, If])
    e.push(e[t].map((n) => px[n]));
const Mg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), yx = $f.map((t, e) => t.map((n) => Mg[e][n])), wx = If.map((t, e) => t.map((n) => Mg[e][n])), bx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ba = (t, e) => t << e | t >>> 32 - e;
function yh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ma = new Uint32Array(16);
let xx = class extends vf {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ma[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = bx[p], C = mx[p], U = $f[p], D = If[p], S = yx[p], O = wx[p];
      for (let _ = 0; _ < 16; _++) {
        const W = Ba(r + yh(p, i, a, u) + Ma[U[_]] + E, S[_]) + l | 0;
        r = l, l = u, u = Ba(a, 10) | 0, a = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Ba(s + yh(x, o, c, d) + Ma[D[_]] + C, O[_]) + g | 0;
        s = g, g = d, d = Ba(c, 10) | 0, c = o, o = W;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ma.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Sx = mi(() => new xx()), Pa = BigInt(2 ** 32 - 1), uu = BigInt(32);
function Pg(t, e = !1) {
  return e ? { h: Number(t & Pa), l: Number(t >> uu & Pa) } : { h: Number(t >> uu & Pa) | 0, l: Number(t & Pa) | 0 };
}
function Ex(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Pg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Ax = (t, e) => BigInt(t >>> 0) << uu | BigInt(e >>> 0), vx = (t, e, n) => t >>> n, kx = (t, e, n) => t << 32 - n | e >>> n, $x = (t, e, n) => t >>> n | e << 32 - n, Ix = (t, e, n) => t << 32 - n | e >>> n, Lx = (t, e, n) => t << 64 - n | e >>> n - 32, Cx = (t, e, n) => t >>> n - 32 | e << 64 - n, Tx = (t, e) => e, Bx = (t, e) => t, Mx = (t, e, n) => t << n | e >>> 32 - n, Px = (t, e, n) => e << n | t >>> 32 - n, Nx = (t, e, n) => e << n - 32 | t >>> 64 - n, _x = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ux(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ox = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Dx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Pg,
  split: Ex,
  toBig: Ax,
  shrSH: vx,
  shrSL: kx,
  rotrSH: $x,
  rotrSL: Ix,
  rotrBH: Lx,
  rotrBL: Cx,
  rotr32H: Tx,
  rotr32L: Bx,
  rotlSH: Mx,
  rotlSL: Px,
  rotlBH: Nx,
  rotlBL: _x,
  add: Ux,
  add3L: Ox,
  add3H: Hx,
  add4L: Dx,
  add4H: Fx,
  add5H: Rx,
  add5L: jx
}, [zx, Gx] = Nt.split([
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
].map((t) => BigInt(t))), cs = new Uint32Array(80), ls = new Uint32Array(80);
let Qc = class extends vf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      cs[S] = e.getUint32(n), ls[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const O = cs[S - 15] | 0, _ = ls[S - 15] | 0, W = Nt.rotrSH(O, _, 1) ^ Nt.rotrSH(O, _, 8) ^ Nt.shrSH(O, _, 7), ut = Nt.rotrSL(O, _, 1) ^ Nt.rotrSL(O, _, 8) ^ Nt.shrSL(O, _, 7), J = cs[S - 2] | 0, q = ls[S - 2] | 0, v = Nt.rotrSH(J, q, 19) ^ Nt.rotrBH(J, q, 61) ^ Nt.shrSH(J, q, 6), P = Nt.rotrSL(J, q, 19) ^ Nt.rotrBL(J, q, 61) ^ Nt.shrSL(J, q, 6), b = Nt.add4L(ut, P, ls[S - 7], ls[S - 16]), T = Nt.add4H(b, W, v, cs[S - 7], cs[S - 16]);
      cs[S] = T | 0, ls[S] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: C, Hh: U, Hl: D } = this;
    for (let S = 0; S < 80; S++) {
      const O = Nt.rotrSH(l, g, 14) ^ Nt.rotrSH(l, g, 18) ^ Nt.rotrBH(l, g, 41), _ = Nt.rotrSL(l, g, 14) ^ Nt.rotrSL(l, g, 18) ^ Nt.rotrBL(l, g, 41), W = l & p ^ ~l & E, ut = g & x ^ ~g & C, J = Nt.add5L(D, _, ut, Gx[S], ls[S]), q = Nt.add5H(J, U, O, W, zx[S], cs[S]), v = J | 0, P = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), b = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = C | 0, E = p | 0, C = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Nt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const L = Nt.add3L(v, b, z);
      r = Nt.add3H(L, q, P, T), s = L | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Nt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = Nt.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: U, l: D } = Nt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, C, U, D);
  }
  roundClean() {
    cs.fill(0), ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Kx = class extends Qc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Vx = class extends Qc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Yx = class extends Qc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
mi(() => new Qc());
mi(() => new Kx());
mi(() => new Vx());
mi(() => new Yx());
var xc = { exports: {} };
xc.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", p = "[object Number]", x = "[object Object]", E = "[object Promise]", C = "[object RegExp]", U = "[object Set]", D = "[object String]", S = "[object Symbol]", O = "[object WeakMap]", _ = "[object ArrayBuffer]", W = "[object DataView]", ut = "[object Float32Array]", J = "[object Float64Array]", q = "[object Int8Array]", v = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", T = "[object Uint8ClampedArray]", z = "[object Uint16Array]", L = "[object Uint32Array]", at = /[\\^$.*+?()[\]{}|]/g, X = /\w*$/, It = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[o] = H[_] = H[W] = H[a] = H[c] = H[ut] = H[J] = H[q] = H[v] = H[P] = H[g] = H[p] = H[x] = H[C] = H[U] = H[D] = H[S] = H[b] = H[T] = H[z] = H[L] = !0, H[u] = H[d] = H[O] = !1;
  var ft = typeof mn == "object" && mn && mn.Object === Object && mn, ct = typeof self == "object" && self && self.Object === Object && self, dt = ft || ct || Function("return this")(), Ht = e && !e.nodeType && e, At = Ht && !0 && t && !t.nodeType && t, Lt = At && At.exports === Ht;
  function Qt(w, B) {
    return w.set(B[0], B[1]), w;
  }
  function Ct(w, B) {
    return w.add(B), w;
  }
  function Te(w, B) {
    for (var F = -1, ht = w ? w.length : 0; ++F < ht && B(w[F], F, w) !== !1; )
      ;
    return w;
  }
  function Rt(w, B) {
    for (var F = -1, ht = B.length, ze = w.length; ++F < ht; )
      w[ze + F] = B[F];
    return w;
  }
  function Mt(w, B, F, ht) {
    for (var ze = -1, tn = w ? w.length : 0; ++ze < tn; )
      F = B(F, w[ze], ze, w);
    return F;
  }
  function pn(w, B) {
    for (var F = -1, ht = Array(w); ++F < w; )
      ht[F] = B(F);
    return ht;
  }
  function he(w, B) {
    return w == null ? void 0 : w[B];
  }
  function on(w) {
    var B = !1;
    if (w != null && typeof w.toString != "function")
      try {
        B = !!(w + "");
      } catch {
      }
    return B;
  }
  function Sn(w) {
    var B = -1, F = Array(w.size);
    return w.forEach(function(ht, ze) {
      F[++B] = [ze, ht];
    }), F;
  }
  function Fe(w, B) {
    return function(F) {
      return w(B(F));
    };
  }
  function En(w) {
    var B = -1, F = Array(w.size);
    return w.forEach(function(ht) {
      F[++B] = ht;
    }), F;
  }
  var Be = Array.prototype, Ze = Function.prototype, be = Object.prototype, ae = dt["__core-js_shared__"], Ge = function() {
    var w = /[^.]+$/.exec(ae && ae.keys && ae.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), M = Ze.toString, Et = be.hasOwnProperty, Gt = be.toString, ve = RegExp(
    "^" + M.call(Et).replace(at, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Jn = Lt ? dt.Buffer : void 0, k = dt.Symbol, R = dt.Uint8Array, G = Fe(Object.getPrototypeOf, Object), j = Object.create, wt = be.propertyIsEnumerable, et = Be.splice, se = Object.getOwnPropertySymbols, Jt = Jn ? Jn.isBuffer : void 0, ie = Fe(Object.keys, Object), me = Je(dt, "DataView"), Yt = Je(dt, "Map"), Me = Je(dt, "Promise"), Xt = Je(dt, "Set"), vt = Je(dt, "WeakMap"), Wt = Je(Object, "create"), ue = Dt(me), fe = Dt(Yt), te = Dt(Me), An = Dt(Xt), Ye = Dt(vt), Br = k ? k.prototype : void 0, Xr = Br ? Br.valueOf : void 0;
  function Fn(w) {
    var B = -1, F = w ? w.length : 0;
    for (this.clear(); ++B < F; ) {
      var ht = w[B];
      this.set(ht[0], ht[1]);
    }
  }
  function Qe() {
    this.__data__ = Wt ? Wt(null) : {};
  }
  function ki(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function So(w) {
    var B = this.__data__;
    if (Wt) {
      var F = B[w];
      return F === r ? void 0 : F;
    }
    return Et.call(B, w) ? B[w] : void 0;
  }
  function kt(w) {
    var B = this.__data__;
    return Wt ? B[w] !== void 0 : Et.call(B, w);
  }
  function qe(w, B) {
    var F = this.__data__;
    return F[w] = Wt && B === void 0 ? r : B, this;
  }
  Fn.prototype.clear = Qe, Fn.prototype.delete = ki, Fn.prototype.get = So, Fn.prototype.has = kt, Fn.prototype.set = qe;
  function vn(w) {
    var B = -1, F = w ? w.length : 0;
    for (this.clear(); ++B < F; ) {
      var ht = w[B];
      this.set(ht[0], ht[1]);
    }
  }
  function $i() {
    this.__data__ = [];
  }
  function Ii(w) {
    var B = this.__data__, F = tr(B, w);
    if (F < 0)
      return !1;
    var ht = B.length - 1;
    return F == ht ? B.pop() : et.call(B, F, 1), !0;
  }
  function Tn(w) {
    var B = this.__data__, F = tr(B, w);
    return F < 0 ? void 0 : B[F][1];
  }
  function fr(w) {
    return tr(this.__data__, w) > -1;
  }
  function jn(w, B) {
    var F = this.__data__, ht = tr(F, w);
    return ht < 0 ? F.push([w, B]) : F[ht][1] = B, this;
  }
  vn.prototype.clear = $i, vn.prototype.delete = Ii, vn.prototype.get = Tn, vn.prototype.has = fr, vn.prototype.set = jn;
  function Rn(w) {
    var B = -1, F = w ? w.length : 0;
    for (this.clear(); ++B < F; ) {
      var ht = w[B];
      this.set(ht[0], ht[1]);
    }
  }
  function Wr() {
    this.__data__ = {
      hash: new Fn(),
      map: new (Yt || vn)(),
      string: new Fn()
    };
  }
  function Eo(w) {
    return ke(this, w).delete(w);
  }
  function Li(w) {
    return ke(this, w).get(w);
  }
  function Ci(w) {
    return ke(this, w).has(w);
  }
  function Ao(w, B) {
    return ke(this, w).set(w, B), this;
  }
  Rn.prototype.clear = Wr, Rn.prototype.delete = Eo, Rn.prototype.get = Li, Rn.prototype.has = Ci, Rn.prototype.set = Ao;
  function zn(w) {
    this.__data__ = new vn(w);
  }
  function kn() {
    this.__data__ = new vn();
  }
  function Ti(w) {
    return this.__data__.delete(w);
  }
  function Zr(w) {
    return this.__data__.get(w);
  }
  function vo(w) {
    return this.__data__.has(w);
  }
  function pe(w, B) {
    var F = this.__data__;
    if (F instanceof vn) {
      var ht = F.__data__;
      if (!Yt || ht.length < n - 1)
        return ht.push([w, B]), this;
      F = this.__data__ = new Rn(ht);
    }
    return F.set(w, B), this;
  }
  zn.prototype.clear = kn, zn.prototype.delete = Ti, zn.prototype.get = Zr, zn.prototype.has = vo, zn.prototype.set = pe;
  function Ns(w, B) {
    var F = Ke(w) || _e(w) ? pn(w.length, String) : [], ht = F.length, ze = !!ht;
    for (var tn in w)
      Et.call(w, tn) && !(ze && (tn == "length" || N(tn, ht))) && F.push(tn);
    return F;
  }
  function Mr(w, B, F) {
    var ht = w[B];
    (!(Et.call(w, B) && cn(ht, F)) || F === void 0 && !(B in w)) && (w[B] = F);
  }
  function tr(w, B) {
    for (var F = w.length; F--; )
      if (cn(w[F][0], B))
        return F;
    return -1;
  }
  function _s(w, B) {
    return w && Kt(B, Nr(B), w);
  }
  function dr(w, B, F, ht, ze, tn, Kn) {
    var en;
    if (ht && (en = tn ? ht(w, ze, tn, Kn) : ht(w)), en !== void 0)
      return en;
    if (!Pr(w))
      return w;
    var Co = Ke(w);
    if (Co) {
      if (en = K(w), !B)
        return Ne(w, en);
    } else {
      var _r = I(w), To = _r == d || _r == l;
      if (ko(w))
        return V(w, B);
      if (_r == x || _r == i || To && !tn) {
        if (on(w))
          return tn ? w : {};
        if (en = nt(To ? {} : w), !B)
          return Bn(w, _s(en, w));
      } else {
        if (!H[_r])
          return tn ? w : {};
        en = mt(w, _r, dr, B);
      }
    }
    Kn || (Kn = new zn());
    var Bo = Kn.get(w);
    if (Bo)
      return Bo;
    if (Kn.set(w, en), !Co)
      var Mo = F ? an(w) : Nr(w);
    return Te(Mo || w, function(Mi, Hs) {
      Mo && (Hs = Mi, Mi = w[Hs]), Mr(en, Hs, dr(Mi, B, F, ht, Hs, w, Kn));
    }), en;
  }
  function Us(w) {
    return Pr(w) ? j(w) : {};
  }
  function f(w, B, F) {
    var ht = B(w);
    return Ke(w) ? ht : Rt(ht, F(w));
  }
  function m(w) {
    return Gt.call(w);
  }
  function A(w) {
    if (!Pr(w) || it(w))
      return !1;
    var B = Os(w) || on(w) ? ve : It;
    return B.test(Dt(w));
  }
  function h(w) {
    if (!pt(w))
      return ie(w);
    var B = [];
    for (var F in Object(w))
      Et.call(w, F) && F != "constructor" && B.push(F);
    return B;
  }
  function V(w, B) {
    if (B)
      return w.slice();
    var F = new w.constructor(w.length);
    return w.copy(F), F;
  }
  function gt(w) {
    var B = new w.constructor(w.byteLength);
    return new R(B).set(new R(w)), B;
  }
  function st(w, B) {
    var F = B ? gt(w.buffer) : w.buffer;
    return new w.constructor(F, w.byteOffset, w.byteLength);
  }
  function xt(w, B, F) {
    var ht = B ? F(Sn(w), !0) : Sn(w);
    return Mt(ht, Qt, new w.constructor());
  }
  function ee(w) {
    var B = new w.constructor(w.source, X.exec(w));
    return B.lastIndex = w.lastIndex, B;
  }
  function Pe(w, B, F) {
    var ht = B ? F(En(w), !0) : En(w);
    return Mt(ht, Ct, new w.constructor());
  }
  function je(w) {
    return Xr ? Object(Xr.call(w)) : {};
  }
  function $t(w, B) {
    var F = B ? gt(w.buffer) : w.buffer;
    return new w.constructor(F, w.byteOffset, w.length);
  }
  function Ne(w, B) {
    var F = -1, ht = w.length;
    for (B || (B = Array(ht)); ++F < ht; )
      B[F] = w[F];
    return B;
  }
  function Kt(w, B, F, ht) {
    F || (F = {});
    for (var ze = -1, tn = B.length; ++ze < tn; ) {
      var Kn = B[ze], en = void 0;
      Mr(F, Kn, en === void 0 ? w[Kn] : en);
    }
    return F;
  }
  function Bn(w, B) {
    return Kt(w, y(w), B);
  }
  function an(w) {
    return f(w, Nr, y);
  }
  function ke(w, B) {
    var F = w.__data__;
    return tt(B) ? F[typeof B == "string" ? "string" : "hash"] : F.map;
  }
  function Je(w, B) {
    var F = he(w, B);
    return A(F) ? F : void 0;
  }
  var y = se ? Fe(se, Object) : Io, I = m;
  (me && I(new me(new ArrayBuffer(1))) != W || Yt && I(new Yt()) != g || Me && I(Me.resolve()) != E || Xt && I(new Xt()) != U || vt && I(new vt()) != O) && (I = function(w) {
    var B = Gt.call(w), F = B == x ? w.constructor : void 0, ht = F ? Dt(F) : void 0;
    if (ht)
      switch (ht) {
        case ue:
          return W;
        case fe:
          return g;
        case te:
          return E;
        case An:
          return U;
        case Ye:
          return O;
      }
    return B;
  });
  function K(w) {
    var B = w.length, F = w.constructor(B);
    return B && typeof w[0] == "string" && Et.call(w, "index") && (F.index = w.index, F.input = w.input), F;
  }
  function nt(w) {
    return typeof w.constructor == "function" && !pt(w) ? Us(G(w)) : {};
  }
  function mt(w, B, F, ht) {
    var ze = w.constructor;
    switch (B) {
      case _:
        return gt(w);
      case a:
      case c:
        return new ze(+w);
      case W:
        return st(w, ht);
      case ut:
      case J:
      case q:
      case v:
      case P:
      case b:
      case T:
      case z:
      case L:
        return $t(w, ht);
      case g:
        return xt(w, ht, F);
      case p:
      case D:
        return new ze(w);
      case C:
        return ee(w);
      case U:
        return Pe(w, ht, F);
      case S:
        return je(w);
    }
  }
  function N(w, B) {
    return B = B ?? s, !!B && (typeof w == "number" || $.test(w)) && w > -1 && w % 1 == 0 && w < B;
  }
  function tt(w) {
    var B = typeof w;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? w !== "__proto__" : w === null;
  }
  function it(w) {
    return !!Ge && Ge in w;
  }
  function pt(w) {
    var B = w && w.constructor, F = typeof B == "function" && B.prototype || be;
    return w === F;
  }
  function Dt(w) {
    if (w != null) {
      try {
        return M.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function Re(w) {
    return dr(w, !0, !0);
  }
  function cn(w, B) {
    return w === B || w !== w && B !== B;
  }
  function _e(w) {
    return gl(w) && Et.call(w, "callee") && (!wt.call(w, "callee") || Gt.call(w) == i);
  }
  var Ke = Array.isArray;
  function Gn(w) {
    return w != null && $o(w.length) && !Os(w);
  }
  function gl(w) {
    return Bi(w) && Gn(w);
  }
  var ko = Jt || Lo;
  function Os(w) {
    var B = Pr(w) ? Gt.call(w) : "";
    return B == d || B == l;
  }
  function $o(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function Pr(w) {
    var B = typeof w;
    return !!w && (B == "object" || B == "function");
  }
  function Bi(w) {
    return !!w && typeof w == "object";
  }
  function Nr(w) {
    return Gn(w) ? Ns(w) : h(w);
  }
  function Io() {
    return [];
  }
  function Lo() {
    return !1;
  }
  t.exports = Re;
})(xc, xc.exports);
var qx = xc.exports;
const Ng = /* @__PURE__ */ op(qx);
var fu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(fu || (fu = {}));
function Xx(t, e) {
  return { type: fu.Address, version: t, hash160: e };
}
function Wx(t) {
  return xi.c32address(t.version, t.hash160);
}
const Zx = (t) => Sx($g(t)), Qx = (t) => bt(Zx(t));
Ce.hmacSha256Sync = (t, ...e) => {
  const n = vg.create($g, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Jx(t, e = "mainnet") {
  e = xg(e), t = typeof t == "string" ? Zt(t) : t;
  const n = hx(jr.P2PKH, e), r = Xx(n, Qx(t));
  return Wx(r);
}
function tS(t, e) {
  const n = sn.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Jx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new sn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function eS(t, e = null) {
  let n;
  e ? n = tS(t, e) : n = sn.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const wh = "_blockstackDidCheckEchoReply", nS = "echoReply", rS = "authContinuation";
function sS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function iS() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[wh];
  if (typeof e == "boolean")
    return e;
  const n = sS(t.location.search), r = n[nS];
  if (r) {
    t[wh] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[rS];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class du {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new gp();
    else
      throw new vb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Qd(e.sessionOptions) : this.store = new Qd() : e ? this.store = new Zd(e.sessionOptions) : this.store = new Zd();
  }
  makeAuthRequestToken(e, n, r, s, i, o = $b().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ql("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, G2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = z2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = af("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (iS())
        return Ri.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ri.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Xb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Sa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = sn.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await X2(e))
      throw new Sa("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (bl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Xd(s, i.private_key);
          } catch {
            if (Ri.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ce.isValidPrivateKey(i.private_key))
              throw new Sa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Xd(s, c);
          } catch {
            Ri.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Sa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Hb, d;
    bl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), bl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: wg(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const p = await n(g);
      if (!p.ok)
        l.profile = Object.assign({}, Sb);
      else {
        const x = await p.text(), E = JSON.parse(x);
        l.profile = eS(E[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ql("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), H1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), D1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
du.prototype.makeAuthRequest = du.prototype.makeAuthRequestToken;
const oS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], aS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = oS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Jc(r.id));
  return e.concat(n);
}, Jc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), _g = "STX_PROVIDER", si = () => typeof window > "u" ? null : window.localStorage.getItem(_g), cS = (t) => {
  typeof window < "u" && window.localStorage.setItem(_g, t);
}, lS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function uS(t, e) {
  const n = {};
  return Object.assign(n, lS, e), await fetch(t, n);
}
function fS(t) {
  let e = uS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function dS(...t) {
  const { fetchLib: e, middlewares: n } = fS(t);
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
var io;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(io || (io = {}));
var ii;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ii || (ii = {}));
var bh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(bh || (bh = {}));
const hS = "https://api.mainnet.hiro.so", pS = "https://api.testnet.hiro.so", gS = "http://localhost:3999", yS = ["mainnet", "testnet", "devnet", "mocknet"];
class oi {
  constructor(e) {
    this.version = ii.Mainnet, this.chainId = io.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ii.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? dS();
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
oi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new hu();
    case "testnet":
      return new pu();
    case "devnet":
      return new wS();
    case "mocknet":
      return new Ug();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yS.join(", ")}`);
  }
};
oi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : oi.fromName(t);
class hu extends oi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? hS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Mainnet, this.chainId = io.Mainnet;
  }
}
class pu extends oi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? pS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Testnet, this.chainId = io.Testnet;
  }
}
class Ug extends oi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Testnet, this.chainId = io.Testnet;
  }
}
const wS = Ug;
var ai;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ai || (ai = {}));
var Sc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sc || (Sc = {}));
ai.Mainnet;
var ci;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ci || (ci = {}));
var li;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(li || (li = {}));
ci.Mainnet;
const bS = {
  chainId: ai.Mainnet,
  transactionVersion: ci.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: li.MainnetSingleSig,
    multiSig: li.MainnetMultiSig
  },
  client: { baseUrl: dp }
}, gu = {
  chainId: ai.Testnet,
  transactionVersion: ci.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: li.TestnetSingleSig,
    multiSig: li.TestnetMultiSig
  },
  client: { baseUrl: hp }
}, rc = {
  ...gu,
  addressVersion: { ...gu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: pp }
}, mS = {
  ...rc,
  addressVersion: { ...rc.addressVersion },
  client: { ...rc.client }
};
function xS(t) {
  switch (t) {
    case "mainnet":
      return bS;
    case "testnet":
      return gu;
    case "devnet":
      return rc;
    case "mocknet":
      return mS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function SS(t) {
  return typeof t == "string" ? xS(t) : t;
}
function ES(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const mh = /* @__PURE__ */ new Map();
function Og(t, e) {
  const n = mh.get(t);
  if (n !== void 0)
    return n(e);
  const r = ES(t);
  return mh.set(t, r), Og(t, e);
}
let de = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Zt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Kb(this.readBytes(4), 0);
  }
  readUInt8() {
    return zb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return jb(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = bt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = bt(n);
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
    if (Og(e, r))
      return r;
    throw n(r);
  }
};
const AS = 128, vS = 128, Hg = 16, qs = 32, yu = 80, tl = 65, kS = 32, $S = 64, Ec = 34, IS = 1 + 16 * 1024 * 1024, LS = 165, CS = 16, TS = 16, BS = 20, MS = TS + 2 + BS, PS = MS + 4, NS = IS + (LS + CS * PS);
var re;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(re || (re = {}));
var wu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(wu || (wu = {}));
var Pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pn || (Pn = {}));
const kl = ["onChainOnly", "offChainOnly", "any"];
kl[0] + "", Pn.OnChainOnly, kl[1] + "", Pn.OffChainOnly, kl[2] + "", Pn.Any, Pn.OnChainOnly + "", Pn.OnChainOnly, Pn.OffChainOnly + "", Pn.OffChainOnly, Pn.Any + "", Pn.Any;
var Ac;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ac || (Ac = {}));
var ge;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ge || (ge = {}));
var Ie;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ie || (Ie = {}));
var ce;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ce || (ce = {}));
var Ee;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ee || (Ee = {}));
var qo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qo || (qo = {}));
var bu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(bu || (bu = {}));
var mu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(mu || (mu = {}));
var bn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(bn || (bn = {}));
var xh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xh || (xh = {}));
var xu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(xu || (xu = {}));
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
var Sh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Sh || (Sh = {}));
let el = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, zi = class extends el {
  constructor(e) {
    super(e);
  }
}, yn = class extends el {
  constructor(e) {
    super(e);
  }
}, vc = class extends el {
  constructor(e) {
    super(e);
  }
}, Gs = class extends el {
  constructor(e) {
    super(e);
  }
};
function Su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _S(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function US(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Su(t.outputLen), Su(t.blockLen);
}
function OS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function HS(t, e) {
  Dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ks = {
  number: Su,
  bool: _S,
  bytes: Dg,
  hash: US,
  exists: OS,
  output: HS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, DS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!DS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function FS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Lf(t) {
  if (typeof t == "string" && (t = FS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Fg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Si(t) {
  const e = (r) => t().update(Lf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let jg = class extends Fg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ks.hash(e);
    const r = Lf(n);
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
    return Ks.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ks.exists(this), Ks.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Rg = (t, e, n) => new jg(t, e).update(n).digest();
Rg.create = (t, e) => new jg(t, e);
function jS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Cf = class extends Fg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $l(this.buffer);
  }
  update(e) {
    Ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Lf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = $l(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ks.exists(this), Ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    jS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = $l(e), c = this.outputLen;
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
const RS = (t, e, n) => t & e ^ ~t & n, zS = (t, e, n) => t & e ^ t & n ^ e & n, GS = new Uint32Array([
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
]), fs = new Uint32Array(64);
let zg = class extends Cf {
  constructor() {
    super(64, 32, 8, !1), this.A = us[0] | 0, this.B = us[1] | 0, this.C = us[2] | 0, this.D = us[3] | 0, this.E = us[4] | 0, this.F = us[5] | 0, this.G = us[6] | 0, this.H = us[7] | 0;
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
      fs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = fs[l - 15], p = fs[l - 2], x = gr(g, 7) ^ gr(g, 18) ^ g >>> 3, E = gr(p, 17) ^ gr(p, 19) ^ p >>> 10;
      fs[l] = E + fs[l - 7] + x + fs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), p = d + g + RS(a, c, u) + GS[l] + fs[l] | 0, E = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + zS(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    fs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, KS = class extends zg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Tf = Si(() => new zg());
Si(() => new KS());
const VS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gg = Uint8Array.from({ length: 16 }, (t, e) => e), YS = Gg.map((t) => (9 * t + 5) % 16);
let Bf = [Gg], Mf = [YS];
for (let t = 0; t < 4; t++)
  for (let e of [Bf, Mf])
    e.push(e[t].map((n) => VS[n]));
const Kg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qS = Bf.map((t, e) => t.map((n) => Kg[e][n])), XS = Mf.map((t, e) => t.map((n) => Kg[e][n])), WS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ZS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Na = (t, e) => t << e | t >>> 32 - e;
function Eh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _a = new Uint32Array(16);
let QS = class extends Cf {
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
    for (let p = 0; p < 16; p++, n += 4)
      _a[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = WS[p], C = ZS[p], U = Bf[p], D = Mf[p], S = qS[p], O = XS[p];
      for (let _ = 0; _ < 16; _++) {
        const W = Na(r + Eh(p, i, a, u) + _a[U[_]] + E, S[_]) + l | 0;
        r = l, l = u, u = Na(a, 10) | 0, a = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Na(s + Eh(x, o, c, d) + _a[D[_]] + C, O[_]) + g | 0;
        s = g, g = d, d = Na(c, 10) | 0, c = o, o = W;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    _a.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const JS = Si(() => new QS()), Ua = BigInt(2 ** 32 - 1), Eu = BigInt(32);
function Vg(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> Eu & Ua) } : { h: Number(t >> Eu & Ua) | 0, l: Number(t & Ua) | 0 };
}
function tE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Vg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const eE = (t, e) => BigInt(t >>> 0) << Eu | BigInt(e >>> 0), nE = (t, e, n) => t >>> n, rE = (t, e, n) => t << 32 - n | e >>> n, sE = (t, e, n) => t >>> n | e << 32 - n, iE = (t, e, n) => t << 32 - n | e >>> n, oE = (t, e, n) => t << 64 - n | e >>> n - 32, aE = (t, e, n) => t >>> n - 32 | e << 64 - n, cE = (t, e) => e, lE = (t, e) => t, uE = (t, e, n) => t << n | e >>> 32 - n, fE = (t, e, n) => e << n | t >>> 32 - n, dE = (t, e, n) => e << n - 32 | t >>> 64 - n, hE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function pE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), yE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, wE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), bE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, mE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), xE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Vg,
  split: tE,
  toBig: eE,
  shrSH: nE,
  shrSL: rE,
  rotrSH: sE,
  rotrSL: iE,
  rotrBH: oE,
  rotrBL: aE,
  rotr32H: cE,
  rotr32L: lE,
  rotlSH: uE,
  rotlSL: fE,
  rotlBH: dE,
  rotlBL: hE,
  add: pE,
  add3L: gE,
  add3H: yE,
  add4L: wE,
  add4H: bE,
  add5H: xE,
  add5L: mE
}, [SE, EE] = _t.split([
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
].map((t) => BigInt(t))), ds = new Uint32Array(80), hs = new Uint32Array(80);
let nl = class extends Cf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      ds[S] = e.getUint32(n), hs[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const O = ds[S - 15] | 0, _ = hs[S - 15] | 0, W = _t.rotrSH(O, _, 1) ^ _t.rotrSH(O, _, 8) ^ _t.shrSH(O, _, 7), ut = _t.rotrSL(O, _, 1) ^ _t.rotrSL(O, _, 8) ^ _t.shrSL(O, _, 7), J = ds[S - 2] | 0, q = hs[S - 2] | 0, v = _t.rotrSH(J, q, 19) ^ _t.rotrBH(J, q, 61) ^ _t.shrSH(J, q, 6), P = _t.rotrSL(J, q, 19) ^ _t.rotrBL(J, q, 61) ^ _t.shrSL(J, q, 6), b = _t.add4L(ut, P, hs[S - 7], hs[S - 16]), T = _t.add4H(b, W, v, ds[S - 7], ds[S - 16]);
      ds[S] = T | 0, hs[S] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: C, Hh: U, Hl: D } = this;
    for (let S = 0; S < 80; S++) {
      const O = _t.rotrSH(l, g, 14) ^ _t.rotrSH(l, g, 18) ^ _t.rotrBH(l, g, 41), _ = _t.rotrSL(l, g, 14) ^ _t.rotrSL(l, g, 18) ^ _t.rotrBL(l, g, 41), W = l & p ^ ~l & E, ut = g & x ^ ~g & C, J = _t.add5L(D, _, ut, EE[S], hs[S]), q = _t.add5H(J, U, O, W, SE[S], ds[S]), v = J | 0, P = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), b = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = C | 0, E = p | 0, C = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = _t.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const L = _t.add3L(v, b, z);
      r = _t.add3H(L, q, P, T), s = L | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = _t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = _t.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: U, l: D } = _t.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, C, U, D);
  }
  roundClean() {
    ds.fill(0), hs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, AE = class extends nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, vE = class extends nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, kE = class extends nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Si(() => new nl());
Si(() => new AE());
const $E = Si(() => new vE());
Si(() => new kE());
var Vt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Vt || (Vt = {}));
var Ve;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ve || (Ve = {}));
function Pf(t) {
  return Ve[t];
}
const IE = () => ({ type: Vt.BoolTrue }), LE = () => ({ type: Vt.BoolFalse }), CE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Vt.Buffer, value: bt(t) };
}, Ah = BigInt("0xffffffffffffffffffffffffffffffff"), TE = BigInt(0), vh = BigInt("0x7fffffffffffffffffffffffffffffff"), kh = BigInt("-170141183460469231731687303715884105728"), BE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = tu(Zt(t))), Cn(t, Uint8Array) && (t = tu(t));
  const e = hn(t);
  if (e > vh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${vh}`);
  if (e < kh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${kh}`);
  return { type: Vt.Int, value: e };
}, ME = (t) => {
  const e = hn(t);
  if (e < TE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ah)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ah}`);
  return { type: Vt.UInt, value: e };
};
function PE(t) {
  return { type: Vt.List, value: t };
}
function Yg() {
  return { type: Vt.OptionalNone };
}
function qg(t) {
  return { type: Vt.OptionalSome, value: t };
}
var ot;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ot || (ot = {}));
function NE() {
  return {
    type: ot.Address,
    version: li.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function $h(t) {
  if (t && ry(t, Ec))
    throw new Error(`Memo exceeds maximum length of ${Ec} bytes`);
  return { type: ot.MemoString, content: t };
}
function Nf(t, e) {
  return {
    type: ot.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Au(t) {
  if (Zt(t).byteLength != tl)
    throw Error("Invalid signature");
  return {
    type: ot.MessageSignature,
    data: t
  };
}
function _E(t, e, n) {
  return typeof t == "string" && (t = ZE(t)), typeof n == "string" && (n = $h(n)), {
    type: ot.Payload,
    payloadType: re.TokenTransfer,
    recipient: t,
    amount: hn(e),
    memo: n ?? $h("")
  };
}
function UE(t, e, n, r) {
  return typeof e == "string" && (e = cr(e)), typeof n == "string" && (n = cr(n)), {
    type: ot.Payload,
    payloadType: re.ContractCall,
    contractAddress: typeof t == "string" ? Ps(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function OE(t) {
  return cr(t, 4, 1e5);
}
function Ih(t, e, n) {
  return typeof t == "string" && (t = cr(t)), typeof e == "string" && (e = OE(e)), typeof n == "number" ? {
    type: ot.Payload,
    payloadType: re.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ot.Payload,
    payloadType: re.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function HE() {
  return { type: ot.Payload, payloadType: re.PoisonMicroblock };
}
function Lh(t, e) {
  if (t.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  return e != null ? {
    type: ot.Payload,
    payloadType: re.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ot.Payload,
    payloadType: re.Coinbase,
    coinbaseBytes: t
  };
}
function DE(t, e, n) {
  if (t.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  if (n.byteLength != yu)
    throw Error(`VRF proof buffer size must be ${yu} bytes`);
  return {
    type: ot.Payload,
    payloadType: re.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Vt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function FE(t, e, n, r, s, i, o) {
  return {
    type: ot.Payload,
    payloadType: re.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function cr(t, e, n) {
  const r = e || 1, s = n || AS;
  if (ry(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ot.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function jE(t, e, n) {
  return {
    type: ot.Asset,
    address: Ps(t),
    contractName: cr(e),
    assetName: cr(n)
  };
}
function Ps(t) {
  const e = xi.c32addressDecode(t);
  return {
    type: ot.Address,
    version: e[0],
    hash160: e[1]
  };
}
function RE(t, e) {
  const n = Ps(t), r = cr(e);
  return {
    type: ot.Principal,
    prefix: bn.Contract,
    address: n,
    contractName: r
  };
}
function zE(t) {
  const e = Ps(t);
  return {
    type: ot.Principal,
    prefix: bn.Standard,
    address: e
  };
}
function Gi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ot.TransactionAuthField,
    contents: e
  };
}
function Hr(t) {
  switch (t.type) {
    case ot.Address:
      return ya(t);
    case ot.Principal:
      return Xg(t);
    case ot.LengthPrefixedString:
      return ao(t);
    case ot.MemoString:
      return KE(t);
    case ot.Asset:
      return Zg(t);
    case ot.PostCondition:
      return Jg(t);
    case ot.PublicKey:
      return $u(t);
    case ot.LengthPrefixedList:
      return _f(t);
    case ot.Payload:
      return ty(t);
    case ot.TransactionAuthField:
      return WE(t);
    case ot.MessageSignature:
      return Uf(t);
  }
}
function ya(t) {
  const e = [];
  return e.push(Zt(ua(t.version, 1))), e.push(Zt(t.hash160)), He(e);
}
function oo(t) {
  const e = Cn(t, de) ? t : new de(t), n = jc(bt(e.readBytes(1))), r = bt(e.readBytes(20));
  return { type: ot.Address, version: n, hash160: r };
}
function Xg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === bn.Standard || t.prefix === bn.Contract) && e.push(ya(t.address)), t.prefix === bn.Contract && e.push(ao(t.contractName)), He(e);
}
function GE(t) {
  const e = Cn(t, de) ? t : new de(t), n = e.readUInt8Enum(bn, (i) => {
    throw new yn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === bn.Origin)
    return { type: ot.Principal, prefix: n };
  const r = oo(e);
  if (n === bn.Standard)
    return { type: ot.Principal, prefix: n, address: r };
  const s = Wn(e);
  return {
    type: ot.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ao(t) {
  const e = [], n = yi(t.content), r = n.byteLength;
  return e.push(Zt(ua(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Wn(t, e, n) {
  e = e || 1;
  const r = Cn(t, de) ? t : new de(t), s = jc(bt(r.readBytes(e))), i = fa(r.readBytes(s));
  return cr(i, e, n ?? 128);
}
function KE(t) {
  const e = [], n = yi(t.content), r = mA(bt(n), Ec * 2);
  return e.push(Zt(r)), He(e);
}
function Wg(t) {
  const e = Cn(t, de) ? t : new de(t);
  let n = fa(e.readBytes(Ec));
  return n = n.replace(/\u0000*$/, ""), { type: ot.MemoString, content: n };
}
function Zg(t) {
  const e = [];
  return e.push(ya(t.address)), e.push(ao(t.contractName)), e.push(ao(t.assetName)), He(e);
}
function vu(t) {
  const e = Cn(t, de) ? t : new de(t);
  return {
    type: ot.Asset,
    address: oo(e),
    contractName: Wn(e),
    assetName: Wn(e)
  };
}
function _f(t) {
  const e = t.values, n = [];
  n.push(Zt(ua(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Hr(r));
  return He(n);
}
function Qg(t, e, n) {
  const r = Cn(t, de) ? t : new de(t), s = jc(bt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case ot.Address:
        i.push(oo(r));
        break;
      case ot.LengthPrefixedString:
        i.push(Wn(r));
        break;
      case ot.MemoString:
        i.push(Wg(r));
        break;
      case ot.Asset:
        i.push(vu(r));
        break;
      case ot.PostCondition:
        i.push(YE(r));
        break;
      case ot.PublicKey:
        i.push(Iu(r));
        break;
      case ot.TransactionAuthField:
        i.push(XE(r));
        break;
    }
  return Nf(i, n);
}
function VE(t) {
  return bt(Jg(t));
}
function Jg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Xg(t.principal)), (t.conditionType === ge.Fungible || t.conditionType === ge.NonFungible) && e.push(Zg(t.asset)), t.conditionType === ge.NonFungible && e.push(Ar(t.assetName)), e.push(t.conditionCode), t.conditionType === ge.STX || t.conditionType === ge.Fungible || t.conditionType === ge.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new zi("The post-condition amount may not be larger than 8 bytes");
    e.push(Bs(t.amount, 8));
  }
  return He(e);
}
function YE(t) {
  const e = Cn(t, de) ? t : new de(t), n = e.readUInt8Enum(ge, (a) => {
    throw new yn(`Could not read ${a} as PostConditionType`);
  }), r = GE(e);
  let s, i, o;
  switch (n) {
    case ge.STX:
      return s = e.readUInt8Enum(qo, (c) => {
        throw new yn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ge.Fungible:
      return i = vu(e), s = e.readUInt8Enum(qo, (c) => {
        throw new yn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ge.NonFungible:
      i = vu(e);
      const a = xr(e);
      return s = e.readUInt8Enum(bu, (c) => {
        throw new yn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ot.PostCondition,
        conditionType: ge.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ge.Staking:
      return s = e.readUInt8Enum(qo, (c) => {
        throw new yn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ge.PoX: {
      const c = e.readUInt8Enum(mu, (u) => {
        throw new yn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ot.PostCondition,
        conditionType: ge.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function ty(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case re.TokenTransfer:
      e.push(Ar(t.recipient)), e.push(Bs(t.amount, 8)), e.push(Hr(t.memo));
      break;
    case re.ContractCall:
      e.push(Hr(t.contractAddress)), e.push(Hr(t.contractName)), e.push(Hr(t.functionName));
      const n = new Uint8Array(4);
      Js(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ar(r));
      });
      break;
    case re.SmartContract:
      e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case re.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case re.PoisonMicroblock:
      break;
    case re.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case re.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient));
      break;
    case re.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient ? qg(t.recipient) : Yg())), e.push(t.vrfProof);
      break;
    case re.TenureChange:
      e.push(Zt(t.tenureHash)), e.push(Zt(t.previousTenureHash)), e.push(Zt(t.burnViewHash)), e.push(Zt(t.previousTenureEnd)), e.push(Js(new Uint8Array(4), t.previousTenureBlocks)), e.push(Gb(new Uint8Array(1), t.cause)), e.push(Zt(t.publicKeyHash));
      break;
  }
  return He(e);
}
function qE(t) {
  const e = Cn(t, de) ? t : new de(t);
  switch (e.readUInt8Enum(re, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case re.TokenTransfer:
      const r = xr(e), s = hn(e.readBytes(8)), i = Wg(e);
      return _E(r, s, i);
    case re.ContractCall:
      const o = oo(e), a = Wn(e), c = Wn(e), u = [], d = e.readUInt32BE();
      for (let O = 0; O < d; O++) {
        const _ = xr(e);
        u.push(_);
      }
      return UE(o, a, c, u);
    case re.SmartContract:
      const l = Wn(e), g = Wn(e, 4, 1e5);
      return Ih(l, g);
    case re.VersionedSmartContract: {
      const O = e.readUInt8Enum(wu, (ut) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ut}`);
      }), _ = Wn(e), W = Wn(e, 4, NS);
      return Ih(_, W, O);
    }
    case re.PoisonMicroblock:
      return HE();
    case re.Coinbase: {
      const O = e.readBytes(qs);
      return Lh(O);
    }
    case re.CoinbaseToAltRecipient: {
      const O = e.readBytes(qs), _ = xr(e);
      return Lh(O, _);
    }
    case re.NakamotoCoinbase: {
      const O = e.readBytes(qs), _ = xr(e), W = e.readBytes(yu);
      return DE(O, _, W);
    }
    case re.TenureChange:
      const p = bt(e.readBytes(20)), x = bt(e.readBytes(20)), E = bt(e.readBytes(20)), C = bt(e.readBytes(32)), U = e.readUInt32BE(), D = e.readUInt8Enum(xu, (O) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${O}`);
      }), S = bt(e.readBytes(20));
      return FE(p, x, E, C, U, D, S);
  }
}
function ku(t) {
  const e = Cn(t, de) ? t : new de(t);
  return Au(bt(e.readBytes(tl)));
}
function XE(t) {
  const e = Cn(t, de) ? t : new de(t), n = e.readUInt8Enum(ir, (r) => {
    throw new yn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ir.PublicKeyCompressed:
      return Gi(Ee.Compressed, Iu(e));
    case ir.PublicKeyUncompressed:
      return Gi(Ee.Uncompressed, yo(TA(Iu(e).data)));
    case ir.SignatureCompressed:
      return Gi(Ee.Compressed, ku(e));
    case ir.SignatureUncompressed:
      return Gi(Ee.Uncompressed, ku(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Uf(t) {
  return Zt(t.data);
}
function WE(t) {
  const e = [];
  switch (t.contents.type) {
    case ot.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(Zt(CA(t.contents.data)));
      break;
    case ot.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(Uf(t.contents));
      break;
  }
  return He(e);
}
function $u(t) {
  return t.data.slice();
}
function Iu(t) {
  const e = Cn(t, de) ? t : new de(t), n = e.readUInt8(), r = n === 4 ? $S : kS;
  return yo(He([n, e.readBytes(r)]));
}
function Of(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.P2PKH || e === ce.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.P2WPKH || e === ce.P2WSH || e === ce.P2WSHNonSequential) && !r.map((s) => s.data).every(wo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.P2PKH:
      return Oa(t, xA(r[0].data));
    case ce.P2WPKH:
      return Oa(t, SA(r[0].data));
    case ce.P2SH:
    case ce.P2SHNonSequential:
      return Oa(t, EA(n, r.map($u)));
    case ce.P2WSH:
    case ce.P2WSHNonSequential:
      return Oa(t, AA(n, r.map($u)));
  }
}
function Oa(t, e) {
  return { type: ot.Address, version: t, hash160: e };
}
function Hf(t) {
  return xi.c32address(t.version, t.hash160);
}
function Ch(t) {
  const [e, n, r] = t.split(/\.|::/);
  return jE(e, n, r);
}
function Oo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return RE(e, n);
  } else
    return zE(t);
}
function ZE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return tA(e, n);
  } else
    return QE(t);
}
function QE(t) {
  const e = Ps(t);
  return { type: Vt.PrincipalStandard, value: Hf(e) };
}
function JE(t) {
  return { type: Vt.PrincipalStandard, value: Hf(t) };
}
function tA(t, e) {
  const n = Ps(t), r = cr(e);
  return ey(n, r);
}
function ey(t, e) {
  if (yi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Vt.PrincipalContract,
    value: `${Hf(t)}.${e.content}`
  };
}
function eA(t) {
  return { type: Vt.ResponseErr, value: t };
}
function nA(t) {
  return { type: Vt.ResponseOk, value: t };
}
const rA = (t) => ({ type: Vt.StringASCII, value: t }), sA = (t) => ({ type: Vt.StringUTF8, value: t });
function iA(t) {
  for (const e in t)
    if (!vA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Vt.Tuple, value: t };
}
function xr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new de(Zt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new de(t) : e = t;
  switch (e.readUInt8Enum(Ve, (r) => {
    throw new yn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ve.int:
      return BE(tu(e.readBytes(16)));
    case Ve.uint:
      return ME(e.readBytes(16));
    case Ve.buffer:
      const r = e.readUInt32BE();
      return CE(e.readBytes(r));
    case Ve.true:
      return IE();
    case Ve.false:
      return LE();
    case Ve.address:
      const s = oo(e);
      return JE(s);
    case Ve.contract:
      const i = oo(e), o = Wn(e);
      return ey(i, o);
    case Ve.ok:
      return nA(xr(e));
    case Ve.err:
      return eA(xr(e));
    case Ve.none:
      return Yg();
    case Ve.some:
      return qg(xr(e));
    case Ve.list:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(xr(e));
      return PE(c);
    case Ve.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const C = Wn(e).content;
        if (C === void 0)
          throw new yn('"content" is undefined');
        d[C] = xr(e);
      }
      return iA(d);
    case Ve.ascii:
      const l = e.readUInt32BE(), g = Ub(e.readBytes(l));
      return rA(g);
    case Ve.utf8:
      const p = e.readUInt32BE(), x = fa(e.readBytes(p));
      return sA(x);
    default:
      throw new yn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Lr(t, e) {
  return He([Pf(t), e]);
}
function oA(t) {
  return new Uint8Array([Pf(t.type)]);
}
function aA(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([Pf(t.type)]) : Lr(t.type, Ar(t.value));
}
function cA(t) {
  const e = new Uint8Array(4);
  return Js(e, Math.ceil(t.value.length / 2), 0), Lr(t.type, $r(e, Zt(t.value)));
}
function lA(t) {
  const e = cf(Bb(BigInt(t.value), BigInt(vS)), Hg);
  return Lr(t.type, e);
}
function uA(t) {
  const e = cf(BigInt(t.value), Hg);
  return Lr(t.type, e);
}
function fA(t) {
  return Lr(t.type, ya(Ps(t.value)));
}
function dA(t) {
  const [e, n] = kA(t.value);
  return Lr(t.type, $r(ya(Ps(e)), ao(cr(n))));
}
function hA(t) {
  return Lr(t.type, Ar(t.value));
}
function pA(t) {
  const e = [], n = new Uint8Array(4);
  Js(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ar(r);
    e.push(s);
  }
  return Lr(t.type, He(e));
}
function gA(t) {
  const e = [], n = new Uint8Array(4);
  Js(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = cr(s);
    e.push(ao(i));
    const o = Ar(t.value[s]);
    e.push(o);
  }
  return Lr(t.type, He(e));
}
function ny(t, e) {
  const n = [], r = e == "ascii" ? _b(t.value) : yi(t.value), s = new Uint8Array(4);
  return Js(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, He(n));
}
function yA(t) {
  return ny(t, "ascii");
}
function wA(t) {
  return ny(t, "utf8");
}
function Th(t) {
  return bt(Ar(t));
}
function Ar(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return oA(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return aA(t);
    case Vt.Buffer:
      return cA(t);
    case Vt.UInt:
      return uA(t);
    case Vt.Int:
      return lA(t);
    case Vt.PrincipalStandard:
      return fA(t);
    case Vt.PrincipalContract:
      return dA(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return hA(t);
    case Vt.List:
      return pA(t);
    case Vt.Tuple:
      return gA(t);
    case Vt.StringASCII:
      return yA(t);
    case Vt.StringUTF8:
      return wA(t);
    default:
      throw new zi("Unable to serialize. Invalid Clarity Value.");
  }
}
const bA = (t) => t.length % 2 ? `0${t}` : t, mA = (t, e) => t.padEnd(e, "0"), ry = (t, e) => t ? yi(t).length > e : !1;
function Lu(t) {
  return Ng(t);
}
const ta = (t) => JS(Tf(t)), Df = (t) => bt($E(t)), xA = (t) => bt(ta(t)), SA = (t) => {
  const e = ta(t), n = $r(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ta(n);
  return bt(r);
}, EA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = ta(r);
  return bt(s);
}, AA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = Tf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = He(i), a = ta(o);
  return bt(a);
};
function vA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function kA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Rg.create(Tf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function yo(t) {
  return t = typeof t == "string" ? Zt(t) : t, {
    type: ot.PublicKey,
    data: t
  };
}
function $A(t, e, n = Ee.Compressed) {
  const r = Fb(e), s = new On(Td(r.r), Td(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === Ee.Compressed;
  return i.toHex(o);
}
function IA(t) {
  return typeof t == "string" ? t : bt(t);
}
const Ff = IA;
function sy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Db;
}
function wo(t) {
  return !Ff(t).startsWith("04");
}
function LA(t) {
  t = lf(t);
  const e = sy(t);
  return bt(da(t.slice(0, 32), e));
}
function CA(t) {
  return jt.fromHex(Ff(t)).toHex(!0);
}
function TA(t) {
  return jt.fromHex(Ff(t)).toHex(!1);
}
function BA(t, e) {
  t = lf(t);
  const [n, r] = zc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ua(r, 1) + On.fromHex(n).toCompactHex();
}
function jf() {
  return {
    type: ot.MessageSignature,
    data: bt(new Uint8Array(tl))
  };
}
function iy(t, e, n, r) {
  const s = Of(0, t, 1, [yo(e)]).hash160, i = wo(e) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: hn(n),
    fee: hn(r),
    keyEncoding: i,
    signature: jf()
  };
}
function ea(t) {
  return "signature" in t;
}
function Bh(t) {
  return t === ce.P2SH || t === ce.P2WSH;
}
function MA(t) {
  return t === ce.P2SHNonSequential || t === ce.P2WSHNonSequential;
}
function Mh(t) {
  const e = Lu(t);
  return e.nonce = 0, e.fee = 0, ea(e) ? e.signature = jf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function PA(t) {
  const e = [
    t.hashMode,
    Zt(t.signer),
    Bs(t.nonce, 8),
    Bs(t.fee, 8),
    t.keyEncoding,
    Uf(t.signature)
  ];
  return He(e);
}
function NA(t) {
  const e = [
    t.hashMode,
    Zt(t.signer),
    Bs(t.nonce, 8),
    Bs(t.fee, 8)
  ], n = Nf(t.fields);
  e.push(_f(n));
  const r = new Uint8Array(2);
  return Rb(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function _A(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), s = BigInt(`0x${bt(e.readBytes(8))}`), i = e.readUInt8Enum(Ee, (a) => {
    throw new yn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.P2WPKH && i != Ee.Compressed)
    throw new yn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ku(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function UA(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), s = BigInt("0x" + bt(e.readBytes(8))), i = Qg(e, ot.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ot.PublicKey:
        wo(u.contents.data) || (o = !0);
        break;
      case ot.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Gs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.P2WSH || t === ce.P2WSHNonSequential))
    throw new Gs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Il(t) {
  return ea(t) ? PA(t) : NA(t);
}
function Ll(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new yn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.P2PKH || e === ce.P2WPKH ? _A(e, t) : UA(e, t);
}
function oy(t, e, n, r) {
  const i = t + bt(new Uint8Array([e])) + bt(Bs(n, 8)) + bt(Bs(r, 8));
  if (Zt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Df(Zt(i));
}
function ay(t, e, n) {
  const r = 33 + tl, s = wo(e.data) ? Ee.Compressed : Ee.Uncompressed, i = t + bA(s.toString(16)) + n, o = Zt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Df(o);
}
function OA(t, e, n, r, s) {
  const i = oy(t, e, n, r), o = BA(s, i), a = yo(LA(s)), c = ay(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function cy(t, e, n, r, s, i) {
  const o = oy(t, e, n, r), a = yo($A(o, i, s)), c = ay(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function HA() {
  const t = iy(ce.P2PKH, "", 0, 0);
  return t.signer = NE().hash160, t.keyEncoding = Ee.Compressed, t.signature = jf(), t;
}
function Ph(t, e, n) {
  return ea(t) ? DA(t, e, n) : FA(t, e, n);
}
function DA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = cy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Of(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Gs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function FA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ot.PublicKey:
        wo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case ot.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = cy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Bh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Gs("Too many signatures");
        break;
    }
  if (Bh(t.hashMode) && o !== t.signaturesRequired || MA(t.hashMode) && o < t.signaturesRequired)
    throw new Gs("Incorrect number of signatures");
  if (i && (t.hashMode === ce.P2WSH || t.hashMode === ce.P2WSHNonSequential))
    throw new Gs("Uncompressed keys are not allowed in this hash mode");
  const a = Of(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Gs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ly(t) {
  return {
    authType: Ie.Standard,
    spendingCondition: t
  };
}
function uy(t, e) {
  return {
    authType: Ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || iy(ce.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Nh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ie.Standard:
        return ly(Mh(t.spendingCondition));
      case Ie.Sponsored:
        return uy(Mh(t.spendingCondition), HA());
      default:
        throw new vc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function jA(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      return Ph(t.spendingCondition, e, Ie.Standard);
    case Ie.Sponsored:
      return Ph(t.spendingCondition, e, Ie.Standard);
    default:
      throw new vc("Invalid origin auth type");
  }
}
function RA(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: hn(e)
      };
      return { ...t, spendingCondition: n };
    case Ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: hn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function zA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: hn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function GA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: hn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function KA(t, e) {
  const n = {
    ...e,
    nonce: hn(e.nonce),
    fee: hn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function VA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ie.Standard:
      e.push(Il(t.spendingCondition));
      break;
    case Ie.Sponsored:
      e.push(Il(t.spendingCondition)), e.push(Il(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function YA(t) {
  const e = t.readUInt8Enum(Ie, (r) => {
    throw new yn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ie.Standard:
      return n = Ll(t), ly(n);
    case Ie.Sponsored:
      n = Ll(t);
      const r = Ll(t);
      return uy(n, r);
  }
}
class qA {
  constructor({ auth: e, payload: n, postConditions: r = Nf([]), postConditionMode: s = Ac.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = SS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: hn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Pn.Any;
  }
  signBegin() {
    const e = Lu(this);
    return e.auth = Nh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Lu(this);
    return e.auth = Nh(e.auth), e.txid();
  }
  verifyOrigin() {
    return jA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ie.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ie.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ie.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : yo(e), r = this.auth.spendingCondition;
    if (r && !ea(r)) {
      const s = wo(n.data);
      r.fields.push(Gi(s ? Ee.Compressed : Ee.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = OA(n, r, e.fee, e.nonce, s);
    if (ea(e))
      e.signature = Au(i);
    else {
      const a = sy(s);
      e.fields.push(Gi(a ? Ee.Compressed : Ee.Uncompressed, Au(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Df(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = KA(this.auth, e);
  }
  setFee(e) {
    this.auth = RA(this.auth, e);
  }
  setNonce(e) {
    this.auth = zA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = GA(this.auth, e);
  }
  serialize() {
    return bt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new zi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new zi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new zi('"auth" is undefined');
    if (this.payload === void 0)
      throw new zi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Js(n, this.chainId, 0), e.push(n), e.push(VA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(_f(this.postConditions)), e.push(ty(this.payload)), He(e);
  }
}
function XA(t) {
  const e = Cn(t, de) ? t : new de(t), n = e.readUInt8Enum(ci, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = YA(e), i = e.readUInt8Enum(Pn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ac, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Qg(e, ot.PostCondition), c = qE(e), u = new qA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const _h = BigInt("18446744073709551615");
function Cl(t) {
  const e = hn(t);
  if (e < 0n || e > _h)
    throw new RangeError(`Post-condition amount must be between 0 and ${_h} (u64 max), received: ${e}`);
  return e;
}
var Cu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Cu || (Cu = {}));
var Tu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Tu || (Tu = {}));
function WA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.STX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: bn.Origin } : Oo(t.address),
        conditionCode: Ha(t.condition),
        amount: Cl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.Fungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: bn.Origin } : Oo(t.address),
        conditionCode: Ha(t.condition),
        amount: Cl(t.amount),
        asset: Ch(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.NonFungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: bn.Origin } : Oo(t.address),
        conditionCode: Ha(t.condition),
        asset: Ch(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.Staking,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: bn.Origin } : Oo(t.address),
        conditionCode: Ha(t.condition),
        amount: Cl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.PoX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: bn.Origin } : Oo(t.address),
        conditionCode: ZA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ha(t) {
  return Cu[t];
}
function ZA(t) {
  return Tu[t];
}
function fy(t) {
  const e = WA(t);
  return VE(e);
}
function QA(t, e, n) {
  return zf(dy(t), n);
}
function dy(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = na(r);
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
    return BigInt(`0x${e3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Rf(t, e = 8) {
  return (typeof t == "bigint" ? t : dy(t)).toString(16).padStart(e * 2, "0");
}
function zf(t, e = 16) {
  const n = Rf(t, e);
  return na(n);
}
function JA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const t3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function e3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += t3[n];
  return e;
}
function na(t) {
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
function Gf(t) {
  return new TextEncoder().encode(t);
}
function n3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function r3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Uh(t) {
  if (t.some(r3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Kf(...t) {
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
function qr(t) {
  return Kf(...t.map((e) => typeof e == "number" ? Uh([e]) : e instanceof Array ? Uh(e) : e));
}
function rl(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Bu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Bu || (Bu = {}));
Bu.Mainnet;
const s3 = 128, i3 = 128, hy = 16;
var Mu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Mu || (Mu = {}));
var Oh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Oh || (Oh = {}));
var Hh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Hh || (Hh = {}));
var rr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(rr || (rr = {}));
const Tl = ["onChainOnly", "offChainOnly", "any"];
Tl[0] + "", rr.OnChainOnly, Tl[1] + "", rr.OffChainOnly, Tl[2] + "", rr.Any, rr.OnChainOnly + "", rr.OnChainOnly, rr.OffChainOnly + "", rr.OffChainOnly, rr.Any + "", rr.Any;
var Pu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pu || (Pu = {}));
Pu.Mainnet;
var Dh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Dh || (Dh = {}));
var Fs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fs || (Fs = {}));
var Fh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Fh || (Fh = {}));
var jh;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(jh || (jh = {}));
var Rh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rh || (Rh = {}));
var zh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zh || (zh = {}));
var Gh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gh || (Gh = {}));
var Kh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Kh || (Kh = {}));
var Nu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Nu || (Nu = {}));
var Vh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Vh || (Vh = {}));
var Yh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Yh || (Yh = {}));
function _u(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function py(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function a3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _u(t.outputLen), _u(t.blockLen);
}
function c3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function l3(t, e) {
  py(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bl = {
  number: _u,
  bool: o3,
  bytes: py,
  hash: a3,
  exists: c3,
  output: l3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ml = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yr = (t, e) => t << 32 - e | t >>> e, u3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gy(t) {
  if (typeof t == "string" && (t = f3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let d3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ei(t) {
  const e = (r) => t().update(gy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function h3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Vf = class extends d3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ml(this.buffer);
  }
  update(e) {
    Bl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gy(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ml(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bl.exists(this), Bl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    h3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ml(e), c = this.outputLen;
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
const p3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yy = Uint8Array.from({ length: 16 }, (t, e) => e), g3 = yy.map((t) => (9 * t + 5) % 16);
let Yf = [yy], qf = [g3];
for (let t = 0; t < 4; t++)
  for (let e of [Yf, qf])
    e.push(e[t].map((n) => p3[n]));
const wy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), y3 = Yf.map((t, e) => t.map((n) => wy[e][n])), w3 = qf.map((t, e) => t.map((n) => wy[e][n])), b3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Da = (t, e) => t << e | t >>> 32 - e;
function qh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Fa = new Uint32Array(16);
let x3 = class extends Vf {
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
    for (let p = 0; p < 16; p++, n += 4)
      Fa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = b3[p], C = m3[p], U = Yf[p], D = qf[p], S = y3[p], O = w3[p];
      for (let _ = 0; _ < 16; _++) {
        const W = Da(r + qh(p, i, a, u) + Fa[U[_]] + E, S[_]) + l | 0;
        r = l, l = u, u = Da(a, 10) | 0, a = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Da(s + qh(x, o, c, d) + Fa[D[_]] + C, O[_]) + g | 0;
        s = g, g = d, d = Da(c, 10) | 0, c = o, o = W;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ei(() => new x3());
const S3 = (t, e, n) => t & e ^ ~t & n, E3 = (t, e, n) => t & e ^ t & n ^ e & n, A3 = new Uint32Array([
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
let by = class extends Vf {
  constructor() {
    super(64, 32, 8, !1), this.A = ps[0] | 0, this.B = ps[1] | 0, this.C = ps[2] | 0, this.D = ps[3] | 0, this.E = ps[4] | 0, this.F = ps[5] | 0, this.G = ps[6] | 0, this.H = ps[7] | 0;
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
      gs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = gs[l - 15], p = gs[l - 2], x = yr(g, 7) ^ yr(g, 18) ^ g >>> 3, E = yr(p, 17) ^ yr(p, 19) ^ p >>> 10;
      gs[l] = E + gs[l - 7] + x + gs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), p = d + g + S3(a, c, u) + A3[l] + gs[l] | 0, E = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + E3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    gs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, v3 = class extends by {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ei(() => new by());
Ei(() => new v3());
const ja = BigInt(2 ** 32 - 1), Uu = BigInt(32);
function my(t, e = !1) {
  return e ? { h: Number(t & ja), l: Number(t >> Uu & ja) } : { h: Number(t >> Uu & ja) | 0, l: Number(t & ja) | 0 };
}
function k3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = my(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $3 = (t, e) => BigInt(t >>> 0) << Uu | BigInt(e >>> 0), I3 = (t, e, n) => t >>> n, L3 = (t, e, n) => t << 32 - n | e >>> n, C3 = (t, e, n) => t >>> n | e << 32 - n, T3 = (t, e, n) => t << 32 - n | e >>> n, B3 = (t, e, n) => t << 64 - n | e >>> n - 32, M3 = (t, e, n) => t >>> n - 32 | e << 64 - n, P3 = (t, e) => e, N3 = (t, e) => t, _3 = (t, e, n) => t << n | e >>> 32 - n, U3 = (t, e, n) => e << n | t >>> 32 - n, O3 = (t, e, n) => e << n - 32 | t >>> 64 - n, H3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function D3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), j3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, R3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), z3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, G3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: my,
  split: k3,
  toBig: $3,
  shrSH: I3,
  shrSL: L3,
  rotrSH: C3,
  rotrSL: T3,
  rotrBH: B3,
  rotrBL: M3,
  rotr32H: P3,
  rotr32L: N3,
  rotlSH: _3,
  rotlSL: U3,
  rotlBH: O3,
  rotlBL: H3,
  add: D3,
  add3L: F3,
  add3H: j3,
  add4L: R3,
  add4H: z3,
  add5H: K3,
  add5L: G3
}, [V3, Y3] = Ut.split([
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
].map((t) => BigInt(t))), ys = new Uint32Array(80), ws = new Uint32Array(80);
let sl = class extends Vf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      ys[S] = e.getUint32(n), ws[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const O = ys[S - 15] | 0, _ = ws[S - 15] | 0, W = Ut.rotrSH(O, _, 1) ^ Ut.rotrSH(O, _, 8) ^ Ut.shrSH(O, _, 7), ut = Ut.rotrSL(O, _, 1) ^ Ut.rotrSL(O, _, 8) ^ Ut.shrSL(O, _, 7), J = ys[S - 2] | 0, q = ws[S - 2] | 0, v = Ut.rotrSH(J, q, 19) ^ Ut.rotrBH(J, q, 61) ^ Ut.shrSH(J, q, 6), P = Ut.rotrSL(J, q, 19) ^ Ut.rotrBL(J, q, 61) ^ Ut.shrSL(J, q, 6), b = Ut.add4L(ut, P, ws[S - 7], ws[S - 16]), T = Ut.add4H(b, W, v, ys[S - 7], ys[S - 16]);
      ys[S] = T | 0, ws[S] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: C, Hh: U, Hl: D } = this;
    for (let S = 0; S < 80; S++) {
      const O = Ut.rotrSH(l, g, 14) ^ Ut.rotrSH(l, g, 18) ^ Ut.rotrBH(l, g, 41), _ = Ut.rotrSL(l, g, 14) ^ Ut.rotrSL(l, g, 18) ^ Ut.rotrBL(l, g, 41), W = l & p ^ ~l & E, ut = g & x ^ ~g & C, J = Ut.add5L(D, _, ut, Y3[S], ws[S]), q = Ut.add5H(J, U, O, W, V3[S], ys[S]), v = J | 0, P = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), b = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = C | 0, E = p | 0, C = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Ut.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const L = Ut.add3L(v, b, z);
      r = Ut.add3H(L, q, P, T), s = L | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Ut.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = Ut.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: U, l: D } = Ut.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, C, U, D);
  }
  roundClean() {
    ys.fill(0), ws.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, q3 = class extends sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X3 = class extends sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, W3 = class extends sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ei(() => new sl());
Ei(() => new q3());
Ei(() => new X3());
Ei(() => new W3());
function Z3(t, e, n) {
  const s = s3;
  if (hv(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Mu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Xe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Xe || (Xe = {}));
let Q3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, xy = class extends Q3 {
  constructor(e) {
    super(e);
  }
};
function il(t) {
  const e = [];
  return e.push(na(Rf(t.version, 1))), e.push(na(t.hash160)), qr(e);
}
function J3(t) {
  const e = [];
  return e.push(t.prefix), e.push(il(t.address)), t.prefix === Nu.Contract && e.push(ra(t.contractName)), qr(e);
}
function ra(t) {
  const e = [], n = Gf(t.content), r = n.byteLength;
  return e.push(na(Rf(r, t.lengthPrefixBytes))), e.push(n), qr(e);
}
function tv(t) {
  const e = [];
  return e.push(il(t.address)), e.push(ra(t.contractName)), e.push(ra(t.assetName)), qr(e);
}
function Sy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(J3(t.principal)), (t.conditionType === Fs.Fungible || t.conditionType === Fs.NonFungible) && e.push(tv(t.assetInfo)), t.conditionType === Fs.NonFungible && e.push(ui(t.assetName)), e.push(t.conditionCode), t.conditionType === Fs.STX || t.conditionType === Fs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new xy("The post-condition amount may not be larger than 8 bytes");
    e.push(QA(t.amount, !1, 8));
  }
  return qr(e);
}
function Cr(t, e) {
  return qr([t, e]);
}
function ev(t) {
  return new Uint8Array([t.type]);
}
function nv(t) {
  return t.type === Xe.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, ui(t.value));
}
function rv(t) {
  const e = new Uint8Array(4);
  return rl(e, t.buffer.length, 0), Cr(t.type, Kf(e, t.buffer));
}
function sv(t) {
  const e = zf(JA(t.value, BigInt(i3)), hy);
  return Cr(t.type, e);
}
function iv(t) {
  const e = zf(t.value, hy);
  return Cr(t.type, e);
}
function ov(t) {
  return Cr(t.type, il(t.address));
}
function av(t) {
  return Cr(t.type, Kf(il(t.address), ra(t.contractName)));
}
function cv(t) {
  return Cr(t.type, ui(t.value));
}
function lv(t) {
  const e = [], n = new Uint8Array(4);
  rl(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ui(r);
    e.push(s);
  }
  return Cr(t.type, qr(e));
}
function uv(t) {
  const e = [], n = new Uint8Array(4);
  rl(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Z3(s);
    e.push(ra(i));
    const o = ui(t.data[s]);
    e.push(o);
  }
  return Cr(t.type, qr(e));
}
function Ey(t, e) {
  const n = [], r = e == "ascii" ? n3(t.data) : Gf(t.data), s = new Uint8Array(4);
  return rl(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, qr(n));
}
function fv(t) {
  return Ey(t, "ascii");
}
function dv(t) {
  return Ey(t, "utf8");
}
function ui(t) {
  switch (t.type) {
    case Xe.BoolTrue:
    case Xe.BoolFalse:
      return ev(t);
    case Xe.OptionalNone:
    case Xe.OptionalSome:
      return nv(t);
    case Xe.Buffer:
      return rv(t);
    case Xe.UInt:
      return iv(t);
    case Xe.Int:
      return sv(t);
    case Xe.PrincipalStandard:
      return ov(t);
    case Xe.PrincipalContract:
      return av(t);
    case Xe.ResponseOk:
    case Xe.ResponseErr:
      return cv(t);
    case Xe.List:
      return lv(t);
    case Xe.Tuple:
      return uv(t);
    case Xe.StringASCII:
      return fv(t);
    case Xe.StringUTF8:
      return dv(t);
    default:
      throw new xy("Unable to serialize. Invalid Clarity Value.");
  }
}
const hv = (t, e) => t ? Gf(t).length > e : !1, pv = "connect-ui";
let sc, Ay, Nn = !1, Ou = !1;
const Yr = (t, e = "") => () => {
}, gv = (t, e) => () => {
}, yv = "{visibility:hidden}.hydrated{visibility:inherit}", Xh = {}, wv = "http://www.w3.org/2000/svg", bv = "http://www.w3.org/1999/xhtml", mv = (t) => t != null, Xf = (t) => (t = typeof t, t === "object" || t === "function");
function vy(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Xf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Hu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Hu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Hu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, xv = {}, Sv = (t) => t && t.$tag$ === xv, Ev = (t, e) => t != null && !Xf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Av = (t) => bo(t).$hostElement$, vv = (t, e, n) => {
  const r = fn.ce(e, n);
  return t.dispatchEvent(r), r;
}, Wh = /* @__PURE__ */ new WeakMap(), kv = (t, e, n) => {
  let r = kc.get(t);
  Kv && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, kc.set(t, r);
}, $v = (t, e, n, r) => {
  var s;
  let i = ky(e);
  const o = kc.get(i);
  if (t = t.nodeType === 11 ? t : vr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Wh.get(t), c;
      if (a || Wh.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = vr.createElement("style"), c.innerHTML = o;
          const u = (s = fn.$nonce$) !== null && s !== void 0 ? s : vy(vr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Iv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Yr("attachStyles", e.$tagName$), i = $v(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ky = (t, e) => "sc-" + t.$tagName$, Zh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Jh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Qh(n), d = Qh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Jh(ol, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && fn.rel(t, e, n, !1), r && fn.ael(t, e, r, !1);
    else {
      const c = Xf(r);
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
}, Lv = /\s/, Qh = (t) => t ? t.split(Lv) : [], $y = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Xh, o = e.$attrs$ || Xh;
  for (r in i)
    r in o || Zh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Zh(s, r, i[r], o[r], n, e.$flags$);
}, Wf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = vr.createTextNode(s.$text$);
  else {
    if (Nn || (Nn = s.$tag$ === "svg"), o = s.$elm$ = vr.createElementNS(Nn ? wv : bv, s.$tag$), Nn && s.$tag$ === "foreignObject" && (Nn = !1), $y(null, s, Nn), mv(sc) && o["s-si"] !== sc && o.classList.add(o["s-si"] = sc), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Wf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Nn = !1 : o.tagName === "foreignObject" && (Nn = !0);
  }
  return o;
}, Iy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Ay && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Wf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Ly = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Cv = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : Ra(a, d) ? (zo(a, d), a = e[++s], d = r[++i]) : Ra(c, l) ? (zo(c, l), c = e[--o], l = r[--u]) : Ra(a, l) ? (zo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ra(c, d) ? (zo(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Wf(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Iy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Ly(e, s, o);
}, Ra = (t, e) => t.$tag$ === e.$tag$, zo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Nn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Nn, $y(t, e, Nn), r !== null && s !== null ? Cv(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Iy(n, null, e, s, 0, s.length - 1)) : r !== null && Ly(r, 0, r.length - 1), Nn && i === "svg" && (Nn = !1)) : t.$text$ !== o && (n.data = o);
}, Tv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Hu(null, null), s = Sv(e) ? e : Bt(null, null, e);
  Ay = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, sc = n["s-sc"], zo(r, s);
}, Cy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Zf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Cy(t, t.$ancestorComponent$), Yv(() => Bv(t, e));
}, Bv = (t, e) => {
  const n = Yr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), _v(s, () => Mv(t, r, e));
}, Mv = async (t, e, n) => {
  const r = t.$hostElement$, s = Yr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Iv(t);
  const o = Yr("render", t.$cmpMeta$.$tagName$);
  Pv(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => Nv(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, Pv = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Tv(t, e);
  } catch (r) {
    sa(r, t.$hostElement$);
  }
  return null;
}, Nv = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Yr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, By(n), r(), t.$onReadyResolve$(n), s || Ty()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Jf(() => Zf(t, !1)), t.$flags$ &= -517;
}, Ty = (t) => {
  By(vr.documentElement), Jf(() => vv(ol, "appload", { detail: { namespace: pv } }));
}, _v = (t, e) => t && t.then ? t.then(e) : e(), By = (t) => t.classList.add("hydrated"), Uv = (t, e) => bo(t).$instanceValues$.get(e), Ov = (t, e, n, r) => {
  const s = bo(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Ev(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Zf(s, !1));
}, My = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Uv(this, i);
        },
        set(a) {
          Ov(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        fn.jmp(() => {
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
}, Hv = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Gv(n), s.then) {
        const c = gv();
        s = await s, c();
      }
      s.isProxied || (My(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Yr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        sa(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ky(n);
      if (!kc.has(c)) {
        const u = Yr("registerStyles", n.$tagName$);
        kv(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Zf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, Dv = (t) => {
  if (!(fn.$flags$ & 1)) {
    const e = bo(t), n = e.$cmpMeta$, r = Yr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Cy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Hv(t, e, n);
    }
    r();
  }
}, Fv = (t) => {
  fn.$flags$ & 1 || bo(t);
}, jv = (t, e = {}) => {
  var n;
  const r = Yr(), s = [], i = e.exclude || [], o = ol.customElements, a = vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ vr.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(fn, e), fn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", vr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const E = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      E.$members$ = x[2];
      const C = E.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(D) {
          super(D), D = this, zv(D, E), E.$flags$ & 1 && D.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : fn.jmp(() => Dv(this));
        }
        disconnectedCallback() {
          fn.jmp(() => Fv(this));
        }
        componentOnReady() {
          return bo(this).$onReadyPromise$;
        }
      };
      E.$lazyBundleId$ = p[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, My(
        U,
        E,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + yv, u.setAttribute("data-styles", "");
    const p = (n = fn.$nonce$) !== null && n !== void 0 ? n : vy(vr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((p) => p.connectedCallback()) : fn.jmp(() => l = setTimeout(Ty, 30)), r();
}, Qf = /* @__PURE__ */ new WeakMap(), bo = (t) => Qf.get(t), Rv = (t, e) => Qf.set(e.$lazyInstance$ = t, e), zv = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Qf.set(t, n);
}, Jh = (t, e) => e in t, sa = (t, e) => (0, console.error)(t, e), Pl = /* @__PURE__ */ new Map(), Gv = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Pl.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Pl.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => Z$).then(o, sa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Pl.set(s, o), o[r]), sa);
}, kc = /* @__PURE__ */ new Map(), ol = typeof window < "u" ? window : {}, vr = ol.document || { head: {} }, fn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Py = (t) => Promise.resolve(t), Kv = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), t0 = [], Ny = [], Vv = (t, e) => (n) => {
  t.push(n), Ou || (Ou = !0, fn.$flags$ & 4 ? Jf(Du) : fn.raf(Du));
}, e0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      sa(n);
    }
  t.length = 0;
}, Du = () => {
  e0(t0), e0(Ny), (Ou = t0.length > 0) && fn.raf(Du);
}, Jf = (t) => Py().then(t), Yv = /* @__PURE__ */ Vv(Ny), qv = () => Py(), Xv = (t, e) => typeof window > "u" ? Promise.resolve() : qv().then(() => jv([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Wv = Object.defineProperty, Zv = Object.defineProperties, Qv = Object.getOwnPropertyDescriptors, $c = Object.getOwnPropertySymbols, _y = Object.prototype.hasOwnProperty, Uy = Object.prototype.propertyIsEnumerable, n0 = (t, e, n) => e in t ? Wv(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Dn = (t, e) => {
  for (var n in e || (e = {})) _y.call(e, n) && n0(t, n, e[n]);
  if ($c) for (var n of $c(e)) Uy.call(e, n) && n0(t, n, e[n]);
  return t;
}, lr = (t, e) => Zv(t, Qv(e)), Oy = (t, e) => {
  var n = {};
  for (var r in t) _y.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && $c) for (var r of $c(t)) e.indexOf(r) < 0 && Uy.call(t, r) && (n[r] = t[r]);
  return n;
};
function Hy() {
  return Jc(si()) || window.StacksProvider || window.BlockstackProvider;
}
function al(t) {
  return t ? typeof t == "string" ? oi.fromName(t) : "version" in t ? t : "url" in t ? new hu({ url: t.url }) : t.transactionVersion === ci.Mainnet ? new hu({ url: t.client.baseUrl }) : new pu({ url: t.client.baseUrl }) : new pu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Jv = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Jv || {}), t4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(t4 || {}), td = (t) => {
  let e = t;
  if (!e) {
    let n = new gp(["store_write"], document.location.href);
    e = new du({ appConfig: n });
  }
  return e;
};
function Dy(t) {
  try {
    return td(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Fy = (t) => {
  let e = td(t).loadUserData().appPrivateKey, n = sn.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function e4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [ai.Mainnet]: "mainnet", [ai.Testnet]: "testnet" }, a = al(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function n4(t) {
  let e = al(t.network), n = td(t.userSession), r = lr(Dn({}, t), { network: e, userSession: n });
  return Dn({ stxAddress: e4(r) }, r);
}
async function r4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(fy) : n = n.map((r) => bt(Sy(r)))), new sn.TokenSigner("ES256k", e).signAsync(lr(Dn({}, t), { postConditions: n }));
}
function s4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(fy) : e = e.map((n) => bt(Sy(n)))), sn.createUnsecuredToken(lr(Dn({}, t), { postConditions: e }));
}
var i4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Zt(a.replace(/^0x/, "")), u = XA(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, lr(Dn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, lr(Dn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, o4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Oy(e, ["amount", "appDetails", "userSession"]);
  if (Dy(s)) {
    let { privateKey: a, publicKey: c } = Fy(s), u = lr(Dn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), r4(u, a);
  }
  let o = lr(Dn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), s4(o);
};
async function a4(t, e, n) {
  let r = await e(lr(Dn(Dn({}, n4(t)), t), { network: al(t.network) }));
  return i4({ token: r, options: t }, n);
}
function c4(t, e = Hy()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return a4(t, o4, e);
}
function jy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? lr(Dn({}, t), { message: Th(e), domain: Th(n) }) : lr(Dn({}, t), { message: bt(ui(e)), domain: bt(ui(n)) });
}
async function l4(t, e) {
  return new sn.TokenSigner("ES256k", e).signAsync(jy(t));
}
async function u4(t) {
  let e = t, { userSession: n } = e, r = Oy(e, ["userSession"]);
  if (Dy(n)) {
    let { privateKey: s, publicKey: i } = Fy(n), o = lr(Dn({}, r), { publicKey: i });
    return l4(o, s);
  }
  return sn.createUnsecuredToken(jy(t));
}
var f4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(f4 || {}), Ry = "asigna-stx", r0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Ry && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(h4(t, e), "*");
}), d4 = { authenticationRequest: async (t) => r0(t, "authenticationRequest"), transactionRequest: async (t) => r0(t, "transactionRequest") }, h4 = (t, e) => ({ source: Ry, [e]: t }), p4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = d4);
};
p4();
var g4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function y4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = si(), o = Hy();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Xv();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : g4, c = aS(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
    };
    u.callback = (p) => {
      l(), t(n, p);
    }, u.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(u);
    let g = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var za = y4(c4);
function Ms(t, e, n) {
  return ed(xn(t, e), n);
}
function xn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = we(r);
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
      const r = m4(BigInt(`0x${zt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${zt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function s0(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function wa(t, e = 8) {
  return (typeof t == "bigint" ? t : xn(t, !1)).toString(16).padStart(e * 2, "0");
}
function cl(t) {
  return parseInt(t, 16);
}
function ed(t, e = 16) {
  const n = wa(t, e);
  return we(n);
}
function w4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function b4(t, e) {
  return t & BigInt(1) << e;
}
function m4(t, e) {
  return b4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const x4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += x4[n];
  return e;
}
function we(t) {
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
function mo(t) {
  return new TextEncoder().encode(t);
}
function nd(t) {
  return new TextDecoder().decode(t);
}
function zy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function S4(t) {
  return String.fromCharCode.apply(null, t);
}
function E4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function i0(t) {
  if (t.some(E4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ll(...t) {
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
function De(t) {
  return ll(...t.map((e) => typeof e == "number" ? i0([e]) : e instanceof Array ? i0(e) : e));
}
var o0;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(o0 || (o0 = {}));
var a0;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(a0 || (a0 = {}));
var c0;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(c0 || (c0 = {}));
const Gy = 33, Nl = 32;
function A4(t) {
  if (t.length < Nl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Nl * 2), r = t.slice(2 + Nl * 2);
  return {
    recoveryId: cl(e),
    r: n,
    s: r
  };
}
function v4(t) {
  const e = typeof t == "string" ? we(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function k4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function $4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function I4(t, e) {
  return t[e];
}
function L4(t, e, n = 0) {
  return t[n] = e, t;
}
function C4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function fi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Fu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fu || (Fu = {}));
const T4 = Fu.Mainnet, B4 = 128, M4 = 128, Ky = 16, Xs = 32, ju = 80, ul = 65, P4 = 32, N4 = 64, Ic = 34;
var yt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(yt || (yt = {}));
var Ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ft || (Ft = {}));
var Ru;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ru || (Ru = {}));
var In;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(In || (In = {}));
const ic = ["onChainOnly", "offChainOnly", "any"], l0 = {
  [ic[0]]: In.OnChainOnly,
  [ic[1]]: In.OffChainOnly,
  [ic[2]]: In.Any,
  [In.OnChainOnly]: In.OnChainOnly,
  [In.OffChainOnly]: In.OffChainOnly,
  [In.Any]: In.Any
};
function _4(t) {
  if (t in l0)
    return l0[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ic.join(", ")}`);
}
var Lc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Lc || (Lc = {}));
Lc.Mainnet;
var co;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(co || (co = {}));
var Ln;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ln || (Ln = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var le;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(le || (le = {}));
var Cc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cc || (Cc = {}));
var Ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var ia;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ia || (ia = {}));
var zu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(zu || (zu = {}));
var oa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(oa || (oa = {}));
var u0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(u0 || (u0 = {}));
var f0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(f0 || (f0 = {}));
function Gu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function U4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function O4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gu(t.outputLen), Gu(t.blockLen);
}
function H4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function D4(t, e) {
  Vy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vs = {
  number: Gu,
  bool: U4,
  bytes: Vy,
  hash: O4,
  exists: H4,
  output: D4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), wr = (t, e) => t << 32 - e | t >>> e, F4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!F4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function j4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function rd(t) {
  if (typeof t == "string" && (t = j4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Yy {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ai(t) {
  const e = (r) => t().update(rd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function R4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class sd extends Yy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _l(this.buffer);
  }
  update(e) {
    Vs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = rd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = _l(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Vs.exists(this), Vs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    R4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = _l(e), c = this.outputLen;
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
const z4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qy = Uint8Array.from({ length: 16 }, (t, e) => e), G4 = qy.map((t) => (9 * t + 5) % 16);
let id = [qy], od = [G4];
for (let t = 0; t < 4; t++)
  for (let e of [id, od])
    e.push(e[t].map((n) => z4[n]));
const Xy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), K4 = id.map((t, e) => t.map((n) => Xy[e][n])), V4 = od.map((t, e) => t.map((n) => Xy[e][n])), Y4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), q4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ga = (t, e) => t << e | t >>> 32 - e;
function d0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ka = new Uint32Array(16);
class X4 extends sd {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ka[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, E = Y4[p], C = q4[p], U = id[p], D = od[p], S = K4[p], O = V4[p];
      for (let _ = 0; _ < 16; _++) {
        const W = Ga(r + d0(p, i, a, u) + Ka[U[_]] + E, S[_]) + l | 0;
        r = l, l = u, u = Ga(a, 10) | 0, a = i, i = W;
      }
      for (let _ = 0; _ < 16; _++) {
        const W = Ga(s + d0(x, o, c, d) + Ka[D[_]] + C, O[_]) + g | 0;
        s = g, g = d, d = Ga(c, 10) | 0, c = o, o = W;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ka.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const W4 = Ai(() => new X4()), Z4 = (t, e, n) => t & e ^ ~t & n, Q4 = (t, e, n) => t & e ^ t & n ^ e & n, J4 = new Uint32Array([
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
]), bs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ms = new Uint32Array(64);
class Wy extends sd {
  constructor() {
    super(64, 32, 8, !1), this.A = bs[0] | 0, this.B = bs[1] | 0, this.C = bs[2] | 0, this.D = bs[3] | 0, this.E = bs[4] | 0, this.F = bs[5] | 0, this.G = bs[6] | 0, this.H = bs[7] | 0;
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
      ms[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ms[l - 15], p = ms[l - 2], x = wr(g, 7) ^ wr(g, 18) ^ g >>> 3, E = wr(p, 17) ^ wr(p, 19) ^ p >>> 10;
      ms[l] = E + ms[l - 7] + x + ms[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), p = d + g + Z4(a, c, u) + J4[l] + ms[l] | 0, E = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + Q4(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    ms.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class tk extends Wy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ad = Ai(() => new Wy());
Ai(() => new tk());
const Va = BigInt(2 ** 32 - 1), Ku = BigInt(32);
function Zy(t, e = !1) {
  return e ? { h: Number(t & Va), l: Number(t >> Ku & Va) } : { h: Number(t >> Ku & Va) | 0, l: Number(t & Va) | 0 };
}
function ek(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Zy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const nk = (t, e) => BigInt(t >>> 0) << Ku | BigInt(e >>> 0), rk = (t, e, n) => t >>> n, sk = (t, e, n) => t << 32 - n | e >>> n, ik = (t, e, n) => t >>> n | e << 32 - n, ok = (t, e, n) => t << 32 - n | e >>> n, ak = (t, e, n) => t << 64 - n | e >>> n - 32, ck = (t, e, n) => t >>> n - 32 | e << 64 - n, lk = (t, e) => e, uk = (t, e) => t, fk = (t, e, n) => t << n | e >>> 32 - n, dk = (t, e, n) => e << n | t >>> 32 - n, hk = (t, e, n) => e << n - 32 | t >>> 64 - n, pk = (t, e, n) => t << n - 32 | e >>> 64 - n;
function gk(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const yk = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), wk = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, bk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), mk = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, xk = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Sk = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ot = {
  fromBig: Zy,
  split: ek,
  toBig: nk,
  shrSH: rk,
  shrSL: sk,
  rotrSH: ik,
  rotrSL: ok,
  rotrBH: ak,
  rotrBL: ck,
  rotr32H: lk,
  rotr32L: uk,
  rotlSH: fk,
  rotlSL: dk,
  rotlBH: hk,
  rotlBL: pk,
  add: gk,
  add3L: yk,
  add3H: wk,
  add4L: bk,
  add4H: mk,
  add5H: Sk,
  add5L: xk
}, [Ek, Ak] = Ot.split([
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
].map((t) => BigInt(t))), xs = new Uint32Array(80), Ss = new Uint32Array(80);
class fl extends sd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: x, Hh: E, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, p, x, E, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = E | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      xs[S] = e.getUint32(n), Ss[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const O = xs[S - 15] | 0, _ = Ss[S - 15] | 0, W = Ot.rotrSH(O, _, 1) ^ Ot.rotrSH(O, _, 8) ^ Ot.shrSH(O, _, 7), ut = Ot.rotrSL(O, _, 1) ^ Ot.rotrSL(O, _, 8) ^ Ot.shrSL(O, _, 7), J = xs[S - 2] | 0, q = Ss[S - 2] | 0, v = Ot.rotrSH(J, q, 19) ^ Ot.rotrBH(J, q, 61) ^ Ot.shrSH(J, q, 6), P = Ot.rotrSL(J, q, 19) ^ Ot.rotrBL(J, q, 61) ^ Ot.shrSL(J, q, 6), b = Ot.add4L(ut, P, Ss[S - 7], Ss[S - 16]), T = Ot.add4H(b, W, v, xs[S - 7], xs[S - 16]);
      xs[S] = T | 0, Ss[S] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: x, Gh: E, Gl: C, Hh: U, Hl: D } = this;
    for (let S = 0; S < 80; S++) {
      const O = Ot.rotrSH(l, g, 14) ^ Ot.rotrSH(l, g, 18) ^ Ot.rotrBH(l, g, 41), _ = Ot.rotrSL(l, g, 14) ^ Ot.rotrSL(l, g, 18) ^ Ot.rotrBL(l, g, 41), W = l & p ^ ~l & E, ut = g & x ^ ~g & C, J = Ot.add5L(D, _, ut, Ak[S], Ss[S]), q = Ot.add5H(J, U, O, W, Ek[S], xs[S]), v = J | 0, P = Ot.rotrSH(r, s, 28) ^ Ot.rotrBH(r, s, 34) ^ Ot.rotrBH(r, s, 39), b = Ot.rotrSL(r, s, 28) ^ Ot.rotrBL(r, s, 34) ^ Ot.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, z = s & o ^ s & c ^ o & c;
      U = E | 0, D = C | 0, E = p | 0, C = x | 0, p = l | 0, x = g | 0, { h: l, l: g } = Ot.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const L = Ot.add3L(v, b, z);
      r = Ot.add3H(L, q, P, T), s = L | 0;
    }
    ({ h: r, l: s } = Ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ot.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ot.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Ot.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: x } = Ot.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: E, l: C } = Ot.add(this.Gh | 0, this.Gl | 0, E | 0, C | 0), { h: U, l: D } = Ot.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, d, l, g, p, x, E, C, U, D);
  }
  roundClean() {
    xs.fill(0), Ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class vk extends fl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class kk extends fl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class $k extends fl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ai(() => new fl());
Ai(() => new vk());
const Ik = Ai(() => new kk());
Ai(() => new $k());
function Qy(t) {
  if (we(t).byteLength != ul)
    throw Error("Invalid signature");
  return {
    type: yt.MessageSignature,
    data: t
  };
}
function Go(t, e) {
  return { type: yt.Address, version: t, hash160: e };
}
function Ki(t) {
  return xi.c32address(t.version, t.hash160);
}
function di(t, e, n) {
  const r = e || 1, s = n || B4;
  if (gw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: yt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function cd(t) {
  const e = xi.c32addressDecode(t);
  return {
    type: yt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Lk(t) {
  if (t.type === Z.PrincipalStandard)
    return Ki(t.address);
  if (t.type === Z.PrincipalContract)
    return `${Ki(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Jy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Bk(e, n);
  } else
    return Ck(t);
}
function Ck(t) {
  const e = cd(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Tk(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Bk(t, e) {
  const n = cd(t), r = di(e);
  return tw(n, r);
}
function tw(t, e) {
  if (mo(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function Ul(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${zt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return Sr(t.value);
    case Z.ResponseErr:
      return Sr(t.value);
    case Z.ResponseOk:
      return Sr(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Lk(t);
    case Z.List:
      return t.list.map((r) => Sr(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Sr(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function Sr(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: vs(t), value: Ul(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: vs(t), value: Ul(t, !0), success: !0 };
    default:
      return { type: vs(t), value: Ul(t, !0) };
  }
}
function vs(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return "bool";
    case Z.Int:
      return "int";
    case Z.UInt:
      return "uint";
    case Z.Buffer:
      return `(buff ${t.buffer.length})`;
    case Z.OptionalNone:
      return "(optional none)";
    case Z.OptionalSome:
      return `(optional ${vs(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${vs(t.value)})`;
    case Z.ResponseOk:
      return `(response ${vs(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? vs(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${vs(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${zy(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${mo(t.data).length})`;
  }
}
const ew = () => ({ type: Z.BoolTrue }), nw = () => ({ type: Z.BoolFalse }), Mk = (t) => t ? ew() : nw(), h0 = BigInt("0xffffffffffffffffffffffffffffffff"), Pk = BigInt(0), p0 = BigInt("0x7fffffffffffffffffffffffffffffff"), g0 = BigInt("-170141183460469231731687303715884105728"), Nk = (t) => {
  const e = xn(t, !0);
  if (e > p0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${p0}`);
  if (e < g0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${g0}`);
  return { type: Z.Int, value: e };
}, kr = (t) => {
  const e = xn(t, !1);
  if (e < Pk)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > h0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${h0}`);
  return { type: Z.UInt, value: e };
}, rw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function sw() {
  return { type: Z.OptionalNone };
}
function iw(t) {
  return { type: Z.OptionalSome, value: t };
}
function _k(t) {
  return { type: Z.ResponseErr, value: t };
}
function Uk(t) {
  return { type: Z.ResponseOk, value: t };
}
function Ok(t) {
  return { type: Z.List, list: t };
}
function hi(t) {
  for (const e in t)
    if (!$8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const rn = (t) => ({ type: Z.StringASCII, data: t }), Hk = (t) => ({ type: Z.StringUTF8, data: t });
class ow extends Yy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Vs.hash(e);
    const r = rd(n);
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
    return Vs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Vs.exists(this), Vs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const aw = (t, e, n) => new ow(t, e).update(n).digest();
aw.create = (t, e) => new ow(t, e);
Ce.hmacSha256Sync = (t, ...e) => {
  const n = aw.create(ad, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function lo(t) {
  return {
    type: yt.PublicKey,
    data: we(t)
  };
}
function Dk(t, e, n = Ae.Compressed) {
  const r = A4(e.data), s = new On(s0(r.r), s0(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === Ae.Compressed;
  return i.toHex(o);
}
function Fk(t) {
  return { type: yt.PublicKey, data: t };
}
function xo(t) {
  return !zt(t.data).startsWith("04");
}
function Tc(t) {
  return t.data.slice();
}
function jk(t) {
  const e = Gk(t), n = da(e.data.slice(0, 32), e.compressed);
  return lo(zt(n));
}
function Rk(t) {
  const e = typeof t == "string" ? t : zt(t), n = jt.fromHex(e).toHex(!0);
  return lo(n);
}
function zk(t) {
  const e = typeof t == "string" ? t : zt(t), n = jt.fromHex(e).toHex(!1);
  return lo(n);
}
function Vu(t) {
  const e = t.readUInt8(), n = e === 4 ? N4 : P4;
  return Fk(De([e, t.readBytes(n)]));
}
function Gk(t) {
  const e = v4(t), n = e.length == Gy;
  return { data: e, compressed: n };
}
function Kk(t, e) {
  const [n, r] = zc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = wa(r, 1) + On.fromHex(n).toCompactHex();
  return Qy(i);
}
function Vk(t) {
  return jk(t.data);
}
function Yk(t, e, n) {
  return typeof t == "string" && (t = Jy(t)), typeof n == "string" && (n = b0(n)), {
    type: yt.Payload,
    payloadType: Ft.TokenTransfer,
    recipient: t,
    amount: xn(e, !1),
    memo: n ?? b0("")
  };
}
function qk(t, e, n, r) {
  return typeof t == "string" && (t = cd(t)), typeof e == "string" && (e = di(e)), typeof n == "string" && (n = di(n)), {
    type: yt.Payload,
    payloadType: Ft.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function y0(t, e, n) {
  return typeof t == "string" && (t = di(t)), typeof e == "string" && (e = r8(e)), typeof n == "number" ? {
    type: yt.Payload,
    payloadType: Ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: yt.Payload,
    payloadType: Ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Xk() {
  return { type: yt.Payload, payloadType: Ft.PoisonMicroblock };
}
function w0(t, e) {
  if (t.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  return e != null ? {
    type: yt.Payload,
    payloadType: Ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: yt.Payload,
    payloadType: Ft.Coinbase,
    coinbaseBytes: t
  };
}
function Wk(t, e, n) {
  if (t.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  if (n.byteLength != ju)
    throw Error(`VRF proof buffer size must be ${ju} bytes`);
  return {
    type: yt.Payload,
    payloadType: Ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Yu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Yu || (Yu = {}));
function Zk(t, e, n, r, s, i, o) {
  return {
    type: yt.Payload,
    payloadType: Ft.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function cw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ft.TokenTransfer:
      e.push(Ue(t.recipient)), e.push(Ms(t.amount, !1, 8)), e.push(Dr(t.memo));
      break;
    case Ft.ContractCall:
      e.push(Dr(t.contractAddress)), e.push(Dr(t.contractName)), e.push(Dr(t.functionName));
      const n = new Uint8Array(4);
      fi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ue(r));
      });
      break;
    case Ft.SmartContract:
      e.push(Dr(t.contractName)), e.push(Dr(t.codeBody));
      break;
    case Ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Dr(t.contractName)), e.push(Dr(t.codeBody));
      break;
    case Ft.PoisonMicroblock:
      break;
    case Ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ue(t.recipient));
      break;
    case Ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ue(t.recipient ? iw(t.recipient) : sw())), e.push(t.vrfProof);
      break;
    case Ft.TenureChange:
      e.push(we(t.tenureHash)), e.push(we(t.previousTenureHash)), e.push(we(t.burnViewHash)), e.push(we(t.previousTenureEnd)), e.push(fi(new Uint8Array(4), t.previousTenureBlocks)), e.push(L4(new Uint8Array(1), t.cause)), e.push(we(t.publicKeyHash));
      break;
  }
  return De(e);
}
function Qk(t) {
  switch (t.readUInt8Enum(Ft, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ft.TokenTransfer:
      const n = Qn(t), r = xn(t.readBytes(8), !1), s = uw(t);
      return Yk(n, r, s);
    case Ft.ContractCall:
      const i = uo(t), o = Zn(t), a = Zn(t), c = [], u = t.readUInt32BE();
      for (let S = 0; S < u; S++) {
        const O = Qn(t);
        c.push(O);
      }
      return qk(i, o, a, c);
    case Ft.SmartContract:
      const d = Zn(t), l = Zn(t, 4, 1e5);
      return y0(d, l);
    case Ft.VersionedSmartContract: {
      const S = t.readUInt8Enum(Ru, (W) => {
        throw new Error(`Cannot recognize ClarityVersion: ${W}`);
      }), O = Zn(t), _ = Zn(t, 4, 1e5);
      return y0(O, _, S);
    }
    case Ft.PoisonMicroblock:
      return Xk();
    case Ft.Coinbase: {
      const S = t.readBytes(Xs);
      return w0(S);
    }
    case Ft.CoinbaseToAltRecipient: {
      const S = t.readBytes(Xs), O = Qn(t);
      return w0(S, O);
    }
    case Ft.NakamotoCoinbase: {
      const S = t.readBytes(Xs), O = Qn(t), _ = t.readBytes(ju);
      return Wk(S, O, _);
    }
    case Ft.TenureChange:
      const g = zt(t.readBytes(20)), p = zt(t.readBytes(20)), x = zt(t.readBytes(20)), E = zt(t.readBytes(32)), C = t.readUInt32BE(), U = t.readUInt8Enum(Yu, (S) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${S}`);
      }), D = zt(t.readBytes(20));
      return Zk(g, p, x, E, C, U, D);
  }
}
class dl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class js extends dl {
  constructor(e) {
    super(e);
  }
}
class Un extends dl {
  constructor(e) {
    super(e);
  }
}
class Bc extends dl {
  constructor(e) {
    super(e);
  }
}
class Ys extends dl {
  constructor(e) {
    super(e);
  }
}
var or;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(or || (or = {}));
function qu(t) {
  return Qy(zt(t.readBytes(ul)));
}
function Vi(t, e) {
  return {
    pubKeyEncoding: t,
    type: yt.TransactionAuthField,
    contents: e
  };
}
function Jk(t) {
  const e = t.readUInt8Enum(or, (n) => {
    throw new Un(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case or.PublicKeyCompressed:
      return Vi(Ae.Compressed, Vu(t));
    case or.PublicKeyUncompressed:
      return Vi(Ae.Uncompressed, zk(Vu(t).data));
    case or.SignatureCompressed:
      return Vi(Ae.Compressed, qu(t));
    case or.SignatureUncompressed:
      return Vi(Ae.Uncompressed, qu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function ld(t) {
  return we(t.data);
}
function t8(t) {
  const e = [];
  switch (t.contents.type) {
    case yt.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? or.PublicKeyCompressed : or.PublicKeyUncompressed), e.push(Tc(Rk(t.contents.data)));
      break;
    case yt.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? or.SignatureCompressed : or.SignatureUncompressed), e.push(ld(t.contents));
      break;
  }
  return De(e);
}
function Dr(t) {
  switch (t.type) {
    case yt.Address:
      return ba(t);
    case yt.Principal:
      return lw(t);
    case yt.LengthPrefixedString:
      return fo(t);
    case yt.MemoString:
      return s8(t);
    case yt.AssetInfo:
      return fw(t);
    case yt.PostCondition:
      return i8(t);
    case yt.PublicKey:
      return Tc(t);
    case yt.LengthPrefixedList:
      return dd(t);
    case yt.Payload:
      return cw(t);
    case yt.TransactionAuthField:
      return t8(t);
    case yt.MessageSignature:
      return ld(t);
  }
}
function e8() {
  return {
    type: yt.Address,
    version: Cc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ud(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === le.SerializeP2PKH || e === le.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === le.SerializeP2WPKH || e === le.SerializeP2WSH || e === le.SerializeP2WSHNonSequential) && !r.every(xo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case le.SerializeP2PKH:
      return Go(t, E8(r[0].data));
    case le.SerializeP2WPKH:
      return Go(t, A8(r[0].data));
    case le.SerializeP2SH:
    case le.SerializeP2SHNonSequential:
      return Go(t, v8(n, r.map(Tc)));
    case le.SerializeP2WSH:
    case le.SerializeP2WSHNonSequential:
      return Go(t, k8(n, r.map(Tc)));
  }
}
function ba(t) {
  const e = [];
  return e.push(we(wa(t.version, 1))), e.push(we(t.hash160)), De(e);
}
function uo(t) {
  const e = cl(zt(t.readBytes(1))), n = zt(t.readBytes(20));
  return { type: yt.Address, version: e, hash160: n };
}
function lw(t) {
  const e = [];
  return e.push(t.prefix), e.push(ba(t.address)), t.prefix === oa.Contract && e.push(fo(t.contractName)), De(e);
}
function n8(t) {
  const e = t.readUInt8Enum(oa, (s) => {
    throw new Un(`Unexpected Principal payload type: ${s}`);
  }), n = uo(t);
  if (e === oa.Standard)
    return { type: yt.Principal, prefix: e, address: n };
  const r = Zn(t);
  return {
    type: yt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function fo(t) {
  const e = [], n = mo(t.content), r = n.byteLength;
  return e.push(we(wa(r, t.lengthPrefixBytes))), e.push(n), De(e);
}
function Zn(t, e, n) {
  e = e || 1;
  const r = cl(zt(t.readBytes(e))), s = nd(t.readBytes(r));
  return di(s, e, n ?? 128);
}
function r8(t) {
  return di(t, 4, 1e5);
}
function b0(t) {
  if (t && gw(t, Ic))
    throw new Error(`Memo exceeds maximum length of ${Ic} bytes`);
  return { type: yt.MemoString, content: t };
}
function s8(t) {
  const e = [], n = mo(t.content), r = S8(zt(n), Ic * 2);
  return e.push(we(r)), De(e);
}
function uw(t) {
  let e = nd(t.readBytes(Ic));
  return e = e.replace(/\u0000*$/, ""), { type: yt.MemoString, content: e };
}
function fw(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(fo(t.contractName)), e.push(fo(t.assetName)), De(e);
}
function Xu(t) {
  return {
    type: yt.AssetInfo,
    address: uo(t),
    contractName: Zn(t),
    assetName: Zn(t)
  };
}
function fd(t, e) {
  return {
    type: yt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function dd(t) {
  const e = t.values, n = [];
  n.push(we(wa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Dr(r));
  return De(n);
}
function dw(t, e, n) {
  const r = cl(zt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case yt.Address:
        s.push(uo(t));
        break;
      case yt.LengthPrefixedString:
        s.push(Zn(t));
        break;
      case yt.MemoString:
        s.push(uw(t));
        break;
      case yt.AssetInfo:
        s.push(Xu(t));
        break;
      case yt.PostCondition:
        s.push(o8(t));
        break;
      case yt.PublicKey:
        s.push(Vu(t));
        break;
      case yt.TransactionAuthField:
        s.push(Jk(t));
        break;
    }
  return fd(s, n);
}
function i8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(lw(t.principal)), (t.conditionType === Ln.Fungible || t.conditionType === Ln.NonFungible) && e.push(fw(t.assetInfo)), t.conditionType === Ln.NonFungible && e.push(Ue(t.assetName)), e.push(t.conditionCode), t.conditionType === Ln.STX || t.conditionType === Ln.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new js("The post-condition amount may not be larger than 8 bytes");
    e.push(Ms(t.amount, !1, 8));
  }
  return De(e);
}
function o8(t) {
  const e = t.readUInt8Enum(Ln, (o) => {
    throw new Un(`Could not read ${o} as PostConditionType`);
  }), n = n8(t);
  let r, s, i;
  switch (e) {
    case Ln.STX:
      return r = t.readUInt8Enum(ia, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${zt(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: Ln.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Ln.Fungible:
      return s = Xu(t), r = t.readUInt8Enum(ia, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${zt(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: Ln.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Ln.NonFungible:
      s = Xu(t);
      const o = Qn(t);
      return r = t.readUInt8Enum(zu, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: yt.PostCondition,
        conditionType: Ln.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Tr(t, e) {
  return De([t, e]);
}
function a8(t) {
  return new Uint8Array([t.type]);
}
function c8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : Tr(t.type, Ue(t.value));
}
function l8(t) {
  const e = new Uint8Array(4);
  return fi(e, t.buffer.length, 0), Tr(t.type, ll(e, t.buffer));
}
function u8(t) {
  const e = ed(w4(t.value, BigInt(M4)), Ky);
  return Tr(t.type, e);
}
function f8(t) {
  const e = ed(t.value, Ky);
  return Tr(t.type, e);
}
function d8(t) {
  return Tr(t.type, ba(t.address));
}
function h8(t) {
  return Tr(t.type, ll(ba(t.address), fo(t.contractName)));
}
function p8(t) {
  return Tr(t.type, Ue(t.value));
}
function g8(t) {
  const e = [], n = new Uint8Array(4);
  fi(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ue(r);
    e.push(s);
  }
  return Tr(t.type, De(e));
}
function y8(t) {
  const e = [], n = new Uint8Array(4);
  fi(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = di(s);
    e.push(fo(i));
    const o = Ue(t.data[s]);
    e.push(o);
  }
  return Tr(t.type, De(e));
}
function hw(t, e) {
  const n = [], r = e == "ascii" ? zy(t.data) : mo(t.data), s = new Uint8Array(4);
  return fi(s, r.length, 0), n.push(s), n.push(r), Tr(t.type, De(n));
}
function w8(t) {
  return hw(t, "ascii");
}
function b8(t) {
  return hw(t, "utf8");
}
function Ue(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return a8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return c8(t);
    case Z.Buffer:
      return l8(t);
    case Z.UInt:
      return f8(t);
    case Z.Int:
      return u8(t);
    case Z.PrincipalStandard:
      return d8(t);
    case Z.PrincipalContract:
      return h8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return p8(t);
    case Z.List:
      return g8(t);
    case Z.Tuple:
      return y8(t);
    case Z.StringASCII:
      return w8(t);
    case Z.StringUTF8:
      return b8(t);
    default:
      throw new js("Unable to serialize. Invalid Clarity Value.");
  }
}
function m8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const m0 = /* @__PURE__ */ new Map();
function pw(t, e) {
  const n = m0.get(t);
  if (n !== void 0)
    return n(e);
  const r = m8(t);
  return m0.set(t, r), pw(t, e);
}
class Xo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return C4(this.readBytes(4), 0);
  }
  readUInt8() {
    return I4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return k4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = zt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = zt(n);
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
    if (pw(e, r))
      return r;
    throw n(r);
  }
}
function Qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Xo(we(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Xo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new Un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return Nk(e.readBytes(16));
    case Z.UInt:
      return kr(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return rw(e.readBytes(r));
    case Z.BoolTrue:
      return ew();
    case Z.BoolFalse:
      return nw();
    case Z.PrincipalStandard:
      const s = uo(e);
      return Tk(s);
    case Z.PrincipalContract:
      const i = uo(e), o = Zn(e);
      return tw(i, o);
    case Z.ResponseOk:
      return Uk(Qn(e));
    case Z.ResponseErr:
      return _k(Qn(e));
    case Z.OptionalNone:
      return sw();
    case Z.OptionalSome:
      return iw(Qn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(Qn(e));
      return Ok(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let E = 0; E < u; E++) {
        const C = Zn(e).content;
        if (C === void 0)
          throw new Un('"content" is undefined');
        d[C] = Qn(e);
      }
      return hi(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), g = S4(e.readBytes(l));
      return rn(g);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), x = nd(e.readBytes(p));
      return Hk(x);
    default:
      throw new Un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const x8 = (t) => t.length % 2 == 0 ? t : `0${t}`, S8 = (t, e) => t.padEnd(e, "0"), gw = (t, e) => t ? mo(t).length > e : !1;
function Wu(t) {
  return Ng(t);
}
const aa = (t) => W4(ad(t)), hd = (t) => zt(Ik(t)), E8 = (t) => zt(aa(t)), A8 = (t) => {
  const e = aa(t), n = ll(new Uint8Array([0]), new Uint8Array([e.length]), e), r = aa(n);
  return zt(r);
}, v8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = De(n), s = aa(r);
  return zt(s);
}, k8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = De(n), s = ad(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = De(i), a = aa(o);
  return zt(a);
};
function $8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function yw(t) {
  const e = Ue(t);
  return `0x${zt(e)}`;
}
function I8(t) {
  return Qn(t);
}
const qi = (t) => {
  try {
    return xi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function pd() {
  return {
    type: yt.MessageSignature,
    data: zt(new Uint8Array(ul))
  };
}
function ww(t, e, n, r) {
  const s = ud(0, t, 1, [lo(e)]).hash160, i = xo(lo(e)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: xn(n, !1),
    fee: xn(r, !1),
    keyEncoding: i,
    signature: pd()
  };
}
function ca(t) {
  return "signature" in t;
}
function x0(t) {
  return t === le.SerializeP2SH || t === le.SerializeP2WSH;
}
function L8(t) {
  return t === le.SerializeP2SHNonSequential || t === le.SerializeP2WSHNonSequential;
}
function S0(t) {
  const e = Wu(t);
  return e.nonce = 0, e.fee = 0, ca(e) ? e.signature = pd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function C8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Ms(t.nonce, !1, 8),
    Ms(t.fee, !1, 8),
    t.keyEncoding,
    ld(t.signature)
  ];
  return De(e);
}
function T8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Ms(t.nonce, !1, 8),
    Ms(t.fee, !1, 8)
  ], n = fd(t.fields);
  e.push(dd(n));
  const r = new Uint8Array(2);
  return $4(r, t.signaturesRequired, 0), e.push(r), De(e);
}
function B8(t, e) {
  const n = zt(e.readBytes(20)), r = BigInt(`0x${zt(e.readBytes(8))}`), s = BigInt(`0x${zt(e.readBytes(8))}`), i = e.readUInt8Enum(Ae, (a) => {
    throw new Un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === le.SerializeP2WPKH && i != Ae.Compressed)
    throw new Un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = qu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function M8(t, e) {
  const n = zt(e.readBytes(20)), r = BigInt("0x" + zt(e.readBytes(8))), s = BigInt("0x" + zt(e.readBytes(8))), i = dw(e, yt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case yt.PublicKey:
        xo(u.contents) || (o = !0);
        break;
      case yt.MessageSignature:
        if (u.pubKeyEncoding === Ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ys("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === le.SerializeP2WSH || t === le.SerializeP2WSHNonSequential))
    throw new Ys("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ol(t) {
  return ca(t) ? C8(t) : T8(t);
}
function Hl(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new Un(`Could not parse ${n} as AddressHashMode`);
  });
  return e === le.SerializeP2PKH || e === le.SerializeP2WPKH ? B8(e, t) : M8(e, t);
}
function bw(t, e, n, r) {
  const i = t + zt(new Uint8Array([e])) + zt(Ms(n, !1, 8)) + zt(Ms(r, !1, 8));
  if (we(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return hd(we(i));
}
function mw(t, e, n) {
  const r = 33 + ul, s = xo(e) ? Ae.Compressed : Ae.Uncompressed, i = t + x8(s.toString(16)) + n.data, o = we(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return hd(o);
}
function P8(t, e, n, r, s) {
  const i = bw(t, e, n, r), o = Kk(s, i), a = Vk(s), c = mw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function xw(t, e, n, r, s, i) {
  const o = bw(t, e, n, r), a = lo(Dk(o, i, s)), c = mw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function N8() {
  const t = ww(le.SerializeP2PKH, "", 0, 0);
  return t.signer = e8().hash160, t.keyEncoding = Ae.Compressed, t.signature = pd(), t;
}
function E0(t, e, n) {
  return ca(t) ? _8(t, e, n) : U8(t, e, n);
}
function _8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = xw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = ud(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ys(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function U8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case yt.PublicKey:
        xo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case yt.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = xw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (x0(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Ys("Too many signatures");
        break;
    }
  if (x0(t.hashMode) && o !== t.signaturesRequired || L8(t.hashMode) && o < t.signaturesRequired)
    throw new Ys("Incorrect number of signatures");
  if (i && (t.hashMode === le.SerializeP2WSH || t.hashMode === le.SerializeP2WSHNonSequential))
    throw new Ys("Uncompressed keys are not allowed in this hash mode");
  const a = ud(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ys(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Sw(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function Ew(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ww(le.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function A0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Sw(S0(t.spendingCondition));
      case Le.Sponsored:
        return Ew(S0(t.spendingCondition), N8());
      default:
        throw new Bc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function O8(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return E0(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return E0(t.spendingCondition, e, Le.Standard);
    default:
      throw new Bc("Invalid origin auth type");
  }
}
function H8(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: xn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: xn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function D8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: xn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function F8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: xn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function j8(t, e) {
  const n = {
    ...e,
    nonce: xn(e.nonce, !1),
    fee: xn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function R8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Ol(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Ol(t.spendingCondition)), e.push(Ol(t.sponsorSpendingCondition));
      break;
  }
  return De(e);
}
function z8(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new Un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = Hl(t), Sw(n);
    case Le.Sponsored:
      n = Hl(t);
      const r = Hl(t);
      return Ew(n, r);
  }
}
class G8 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: xn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? T4, this.postConditionMode = i ?? co.Deny, this.postConditions = s ?? fd([]), o)
      this.anchorMode = _4(o);
    else
      switch (r.payloadType) {
        case Ft.Coinbase:
        case Ft.CoinbaseToAltRecipient:
        case Ft.NakamotoCoinbase:
        case Ft.PoisonMicroblock:
        case Ft.TenureChange:
          this.anchorMode = In.OnChainOnly;
          break;
        case Ft.ContractCall:
        case Ft.SmartContract:
        case Ft.VersionedSmartContract:
        case Ft.TokenTransfer:
          this.anchorMode = In.Any;
          break;
      }
  }
  signBegin() {
    const e = Wu(this);
    return e.auth = A0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Wu(this);
    return e.auth = A0(e.auth), e.txid();
  }
  verifyOrigin() {
    return O8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Le.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Le.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Le.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !ca(n)) {
      const r = xo(e);
      n.fields.push(Vi(r ? Ae.Compressed : Ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = P8(n, r, e.fee, e.nonce, s);
    return ca(e) ? e.signature = i : e.fields.push(Vi(s.data.byteLength === Gy ? Ae.Compressed : Ae.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return hd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Bc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = j8(this.auth, e);
  }
  setFee(e) {
    this.auth = H8(this.auth, e);
  }
  setNonce(e) {
    this.auth = D8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Bc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = F8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new js('"version" is undefined');
    if (this.chainId === void 0)
      throw new js('"chainId" is undefined');
    if (this.auth === void 0)
      throw new js('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new js('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new js('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return fi(n, this.chainId, 0), e.push(n), e.push(R8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(dd(this.postConditions)), e.push(cw(this.payload)), De(e);
  }
}
function Mc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Xo(we(t.slice(2))) : e = new Xo(we(t)) : t instanceof Uint8Array ? e = new Xo(t) : e = t;
  const n = e.readUInt8Enum(Lc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = z8(e), i = e.readUInt8Enum(In, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(co, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = dw(e, yt.PostCondition), c = Qk(e);
  return new G8(n, s, c, a, o, i, r);
}
const K8 = Mk, Wo = kr, V8 = rw;
const Y8 = /* @__PURE__ */ new Set([4001, -31001]), q8 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], X8 = ["result", "data", "payload", "response", "params"], v0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], hl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), vi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Kr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, W8 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Aw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => W8(i, r)) === s
  );
}, vw = (t) => t ? Aw(vi()).some(
  (e) => {
    var n;
    return e.id === t && (hl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, kw = () => {
  if (typeof window > "u")
    return;
  const t = vi(), e = Aw(t).filter(
    (n) => {
      var r;
      return hl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Kr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of q8) {
    const r = Kr(t, n) ?? (t === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Z8 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = vi(), n = Kr(e, t) ?? (e === window ? void 0 : Kr(window, t)) ?? Jc(t);
  if (n)
    return n;
  if (hl(t) || vw(t))
    return kw();
}, Ya = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Q8 = ["blockstack-session", "blockstack"], J8 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Q8) {
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
J8();
const $w = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, _n = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, t5 = (t) => {
  const e = _n(t);
  if (!e)
    return null;
  const n = $w(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, e5 = (t) => {
  const e = _n(t);
  if (!e)
    return null;
  const n = $w(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Zu = (t, e = "mainnet") => {
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
      return Zu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Zu(r, e);
  }
  return e;
}, Ws = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, la = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return qi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = la(s, e + 1);
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
    const i = la(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && qi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && qi(n.testnet) ? n.testnet.trim() : null;
}, k0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Iw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Y8.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, pi = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = _n(n == null ? void 0 : n.message) ?? _n(e.message) ?? _n(e.error) ?? _n(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ho = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw pi(e);
    if (e.status === "error")
      throw pi(e.result ?? e);
  }
  return t;
}, $0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ho(r);
  } catch (r) {
    throw pi(r);
  }
}, Lw = () => kw(), gd = () => {
  if (typeof window > "u")
    return;
  const t = vi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Kr(t, e) ?? (t === window ? void 0 : Kr(window, e));
    if (n)
      return n;
  }
}, I0 = () => {
  if (typeof window > "u")
    return;
  const t = gd();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = vi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Kr(e, n) ?? (e === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, oc = (t) => {
  var r, s;
  const e = si();
  if (hl(e) || vw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = vi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Lw();
}, Dl = (t) => {
  const e = e5(t);
  if (!e)
    return null;
  try {
    const n = Mc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Pc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Dl(t), r = t5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? _n(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Pc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of v0)
    if (Dl(s[a])) {
      i = _n(s[a]);
      break;
    }
  const o = _n(s.txId) || _n(s.txid) || _n(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? _n(s.txRaw) ?? void 0
    };
  for (const a of v0) {
    const c = Dl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: _n(s[a]) ?? void 0
      };
  }
  for (const a of X8) {
    const c = s[a], u = Pc(c, e + 1);
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
}, Fl = (t) => {
  const e = Pc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, n5 = (t) => {
  const e = Pc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, r5 = (t) => ({
  ...t,
  fee: Ws(t.fee),
  nonce: Ws(t.nonce),
  sponsored: t.sponsored === !0
}), L0 = (t) => ({
  recipient: t.recipient,
  amount: Ws(t.amount) ?? "0",
  memo: t.memo,
  network: Zu(t.network),
  address: t.stxAddress,
  fee: Ws(t.fee),
  nonce: Ws(t.nonce),
  sponsored: t.sponsored ?? !1
}), Cw = "WALLET_ADDRESS_MISMATCH", s5 = 45e3;
let Zo = null;
const Qu = (t) => {
  t && (Zo = { address: t, at: Date.now() });
}, i5 = () => {
  Zo = null;
}, o5 = () => Zo && Date.now() - Zo.at <= s5 ? Zo.address : null, a5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, c5 = async (t) => {
  i5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ho(await t.request("wallet_connect")), n = la(e);
  return Qu(n), n;
}, l5 = async (t, e, n, r) => {
  try {
    return ho(await t.request(e, n));
  } catch (s) {
    const i = pi(s);
    if (!a5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await c5(t);
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
        { code: o ? Cw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ho(await t.request(e, n));
    } catch (a) {
      throw pi(a);
    }
  }
};
let C0 = 3e4;
const u5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${C0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, C0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, f5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Cw }
      );
    return c;
  }, s = o5();
  if (s)
    return Ya(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ya(n, "account-read");
  try {
    const c = ho(
      await u5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = la(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Iw(c))
      throw pi(c);
    Ya(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Qu(i), r(i, "wallet_getAccount");
  let o;
  Ya(n, "account-reconnect");
  try {
    o = ho(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), pi(c);
  }
  const a = la(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Qu(a), r(a, "wallet_connect");
}, d5 = async (t, e) => {
  if (!oc(t)) {
    const i = await $0(
      t,
      "stx_transferStx",
      L0(e)
    );
    return Fl(i);
  }
  const n = gd();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await $0(
      n,
      "stx_transferStx",
      L0(e)
    );
    return Fl(i);
  }
  const r = Lw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await f5(r, e.stxAddress);
  const s = await l5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ws(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ws(e.fee) } : {}
    },
    e.stxAddress
  );
  return Fl(s);
}, h5 = () => si(), Tw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = si(), e = t ? Z8(t) : void 0;
  if (e)
    return e;
  const n = vi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, T0 = (t, e) => {
  const n = Tw(), r = r5({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, n5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return za(r, e);
  if (oc(n) && !gd()) {
    const s = I0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: si(),
        route: "legacy-transaction-request"
      }), za(r, s);
  }
  return void d5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (k0(s) && oc(n)) {
      const a = I0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: si(),
          route: "legacy-transaction-request"
        }), za(r, a);
        return;
      }
    }
    if (k0(s) && !oc(n)) {
      za(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Iw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, p5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), B0 = (t) => yw(t).replace(/^0x/, ""), M0 = "This wallet cannot sign messages. Try Xverse or Leather.", P0 = (t) => typeof (t == null ? void 0 : t.request) == "function", N0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", g5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, y5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function w5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: B0(e.message),
    domain: B0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function b5(t, e) {
  const n = await u4({
    domain: e.domain,
    message: e.message,
    network: al(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? p5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _0(t) {
  var s, i;
  const e = h5() || "", n = /xverse/i.test(e);
  let r = Tw();
  if (n && !N0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (N0(r))
    try {
      return await b5(r, t);
    } catch (o) {
      if (n || !P0(r) || !y5(o)) throw o;
    }
  if (!n && P0(r))
    try {
      return await w5(r, t);
    } catch (o) {
      throw g5(o) ? new Error(M0) : o;
    }
  throw new Error(M0);
}
const U0 = 1000000n, $s = 1000000n, Nc = 50n, Oe = 3000n, ur = 300n, Ho = 3000n, m5 = 50000n, jl = 200n, pl = 15000n, dn = (t) => t + Nc;
function sr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / U0}.${(n % U0).toString().padStart(6, "0")}`;
}
function O0(t, e = ur) {
  return t <= Oe ? 0 : Number((t - Oe) / dn(e));
}
function Rl(t, e = 0n) {
  const n = $s - t - e;
  return n > 0n ? n : 0n;
}
function x5(t, e = ur) {
  return t > $s ? "over" : t < Oe + dn(e) ? "empty" : t < m5 ? "low" : "ok";
}
const S5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", E5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", A5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function v5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || A5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== S5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Bw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", zl = 3, k5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Ju, Mw] = Bw.split("."), qn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function tf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function $5(t) {
  return qn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ts(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Pw(t, e = []) {
  const n = await Ts(`/v2/contracts/call-read/${Ju}/${Mw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Ju, arguments: e.map((r) => "0x" + qn(Ue(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Sr(Qn(n.result));
}
async function I5() {
  const t = await Ts(`/v2/contracts/source/${Ju}/${Mw}?proof=0`);
  if (typeof t.source != "string" || await $5(t.source) !== E5) throw Error("Deployed source does not match the tested helper.");
  if (v5(await Pw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Nw(t) {
  return t.startsWith("SP") && qi(t) && !t.includes(".");
}
async function L5(t) {
  var r;
  if (!Nw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ts(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ts(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function C5(t) {
  const e = await Ts(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function T5(t, e) {
  var s, i;
  const n = await Pw("get-owner", [Wo(t), Wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Nw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: tf(t), signal: AbortSignal.timeout(15e3) });
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
async function M5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function P5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Mc(tf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ki(Go(Cc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ki(r.contractAddress) + "." + r.contractName.content !== Bw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || qn(Ue(r.functionArgs[0])) !== qn(Ue(Wo(t.core))) || qn(Ue(r.functionArgs[1])) !== qn(Ue(Wo(t.song))) || qn(Ue(r.functionArgs[2])) !== qn(Ue(V8(tf(t.id)))) || t.amount !== "50" || e.postConditionMode !== co.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ia.Equal || i.principal.prefix !== 2 || Ki(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ki(r.contractAddress) + "." + r.contractName.content !== k5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || qn(Ue(r.functionArgs[0])) !== qn(Ue(Wo(t.song))) || typeof t.liked != "boolean" || qn(Ue(r.functionArgs[1])) !== qn(Ue(K8(t.liked))) || t.amount !== "0" || e.postConditionMode !== co.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Sr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const N5 = "xtrata.xyz/radio/listening-wallet", _5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Gr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && qi(t), U5 = (t) => ({
  domain: hi({ name: rn(N5), version: rn("1"), "chain-id": kr(1) }),
  message: hi({
    purpose: rn(_5),
    main: rn(t.main),
    listening: rn(t.listening),
    issued: kr(t.issued)
  })
}), _w = 100000n, O5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function H5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Gr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= _w).sort(O5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const qa = 50;
function _c(t) {
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
async function D5(t, e, n = 4) {
  if (!Gr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${qa}&offset=${o}`, s = _c(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - qa);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= qa ? s : _c(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = H5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - qa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Or = 50, F5 = 6, j5 = 20, H0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function D0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: s };
}
async function R5(t, e, n) {
  if (!Gr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = _c(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Or}&offset=0`));
    if (!s || s.total > F5 * Or) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Or; o < s.total; o += Or) {
      const a = _c(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Or}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Or}&offset=${u}`, a = D0(await e(o(0)), t);
      if (!a || a.total > j5 * Or) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Or; u < a.total; u += Or) {
        const d = D0(await e(o(u)), t);
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
function z5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(H0).map((l, g) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: g } : Gr(l.sender) && p >= _w ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: p, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Gr(l.recipient) && l.amount > 0n).sort(H0), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let p = g;
    for (const x of l) {
      if (p <= 0n) break;
      const E = x.left < p ? x.left : p;
      x.left -= E, p -= E;
    }
    return p;
  };
  for (const l of o) {
    const g = u(s.filter((p) => p.to === l.recipient), l.amount);
    g > 0n && u(s, g);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, p = d.get(g);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function G5(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), s = t.filter((u) => u.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function F0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ac = [100, 250, 500], K5 = (t, e) => BigInt(t) * dn(e), Do = ["prepared", "signed", "unknown", "pending"], V5 = 30 * 6e4, Uc = 6e4, Ui = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, Y5 = 3e3, Oc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Gl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function q5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, g = !1, p = null, x = !1, E = "", C = "", U = 0, D, S = null, O, _ = [], W, ut = -1 / 0;
  const J = /* @__PURE__ */ new Set();
  let q = null, v = !1, P = 0, b = null, T = null, z = !1, L = null, at = !1, X = null, It = !1, $ = !1, H = !1, ft = !1, ct = !1, dt = 0, Ht = null, At = Promise.resolve();
  const Lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ur.toString()), Qt = (y) => !!i && !(i.features ?? []).includes(y), Ct = (y, I) => `xtrata.ppp.v1.${y}:${I}`, Te = "xtrata.ppp.v1.as-main", Rt = () => {
    if (t.main()) return;
    const y = t.store.get(Te);
    return y && Gr(y) ? y : void 0;
  }, Mt = () => t.main() ?? Rt(), pn = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const I = JSON.parse(t.store.get(Ct("entries", y)) || "[]");
      return Array.isArray(I) ? I : [];
    } catch {
      return [];
    }
  }, he = (y) => {
    const I = [y, ...pn(y.address).filter((K) => !(K.txid === y.txid && K.kind === y.kind))].slice(0, 200);
    t.store.set(Ct("entries", y.address), JSON.stringify(I));
  }, on = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Ct("on", y)) !== "0", Sn = (y) => {
    i != null && i.address && t.store.set(Ct("on", i.address), y ? "1" : "0");
  }, Fe = () => pn().filter((y) => Do.includes(y.status)), En = () => ve() ? [...Fe(), ...pn(Gt()).filter((y) => Do.includes(y.status))] : Fe(), Be = () => Ze(i == null ? void 0 : i.address), Ze = (y) => {
    if (!y) return null;
    try {
      return JSON.parse(t.store.get(Ct("deposit", y)) || "null");
    } catch {
      return null;
    }
  }, be = (y, I = i == null ? void 0 : i.address) => {
    I && t.store.set(Ct("deposit", I), JSON.stringify(y));
  };
  let ae = null;
  const Ge = (y = Uc) => {
    const I = t.now();
    ae = { since: ae && I < ae.until ? ae.since : I, until: Math.max((ae == null ? void 0 : ae.until) ?? 0, I + y) };
  }, M = () => !!ae && t.now() < ae.until && (o === void 0 || o < Oe + dn(Lt())), Et = () => !!Be() || M(), Gt = () => Qt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), ve = () => !!(i != null && i.address) && Gt() !== i.address, Jn = () => ve() ? c && c.for === Gt() ? c.value : void 0 : o, k = (y) => y !== void 0 && y < Oe + jl, R = () => Fe().filter((y) => t.now() - y.created > V5 && J.has(y.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Mt() || r === Mt() && !e.allowed), j = () => G() && !(i != null && i.linked), wt = () => {
    const y = Mt();
    return !j() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, et = (y) => Ct("return-to", y), se = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const I = t.store.get(et(y));
    return I && Gr(I) && I !== y ? I : void 0;
  }, Jt = (y = i == null ? void 0 : i.address) => q && q.for === y ? q.res : null;
  function ie() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = se();
    if (y) return { to: y, kind: "chosen" };
    const I = Jt();
    if (I != null && I.ok && I.funder) return { to: I.funder, kind: "funder" };
  }
  const me = (y) => Ct("gift", y);
  function Yt() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((L == null ? void 0 : L.for) === y) return L.info;
    try {
      const I = JSON.parse(t.store.get(me(y)) || "null");
      return I && typeof I.returnTo == "string" && typeof I.treasury == "string" ? I : null;
    } catch {
      return null;
    }
  }
  async function Me() {
    var mt;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((mt = e == null ? void 0 : e.gifts) != null && mt.enabled) || at) return;
    const I = (L == null ? void 0 : L.for) === y ? L : null, K = I ? I.ok ? I.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (I && t.now() - I.at < K) return;
    at = !0;
    const nt = Yt();
    try {
      const N = await t.giftInfo(y);
      L = { for: y, info: N, ok: !0, at: t.now() }, t.store.set(me(y), JSON.stringify(N));
    } catch {
      L = { for: y, info: nt, ok: !1, at: t.now() };
    } finally {
      at = !1;
    }
  }
  const Xt = () => pn().reduce((y, I) => Do.includes(I.status) ? y + BigInt(I.amount || "0") + BigInt(I.fee || "0") : y, 0n);
  function vt() {
    if (o === void 0) return 0;
    const y = o - Xt() - BigInt(st.length) * dn(Lt());
    return y > 0n ? O0(y, Lt()) : 0;
  }
  const Wt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ue = "EMPTY — ADD STX TO PLAY";
  function fe() {
    if (!(e != null && e.here)) return null;
    const y = (I, K) => ({ reason: I, text: K });
    switch (Qe()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return y("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return y("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return y("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return y("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Et() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", ve() ? Wt : ue);
      case "ready":
        return !on() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? y("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? vt() < 1 ? y("out", ve() ? Wt : ue) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const te = () => {
    var y;
    return !!(i != null && i.address) && ve() && !!((y = Yt()) != null && y.player);
  };
  function An() {
    return te() ? { locked: !0, known: !0 } : null;
  }
  const Ye = 3 * 6e4, Br = () => !!Yt() && !!t.history && !(i != null && i.linked);
  async function Xr() {
    const y = i.address, I = Yt(), { balance: K, nonce: nt } = await t.chain.account(y), mt = await t.history(y, !0);
    if (!mt.ok) return null;
    const N = z5({ self: y, balance: K, inbound: mt.inbound, outgoing: mt.outgoing, gift: { sender: I.treasury, payer: I.returnTo } });
    if (!N.ok) return null;
    const tt = G5(N.parts, Ho);
    return { balance: K, nonce: nt, parts: N.parts, steps: tt.steps, tooSmall: tt.tooSmall.length };
  }
  const Fn = () => It ? { state: "unavailable" } : !X || t.now() - X.at > Ye || o !== void 0 && o !== X.balance ? { state: "none" } : X.plan;
  function Qe() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = Mt();
    if (!j()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : wt() ? "wrong-wallet" : i.state === "known" ? "locked" : !j() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > $s ? "over" : o < Oe + dn(Lt()) ? "fund" : "ready" : "loading";
  }
  const ki = () => {
    var y, I, K, nt, mt;
    return {
      step: Qe(),
      busy: u,
      message: E,
      error: C,
      notice: So(),
      gate: e,
      main: Mt(),
      mainConnected: !!t.main(),
      standIn: Rt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : x5(o, Lt()),
      playsLeft: o === void 0 ? 0 : O0(o, Lt()),
      allowance: o === void 0 ? $s : Rl(o, BigInt(((y = Be()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: on(),
      entries: pn(),
      depositTxid: ((I = Be()) == null ? void 0 : I.txid) ?? D,
      depositPending: Et(),
      arrival: Et() ? { since: ((K = Be()) == null ? void 0 : K.at) ?? (ae == null ? void 0 : ae.since) ?? t.now(), graceMs: Uc } : null,
      walletOutdated: Qt("like"),
      linkedListening: W && W === Mt() ? _.map((N) => N.listening) : [],
      serverLinked: !!S && O === `${Mt()}:${i == null ? void 0 : i.address}`,
      stuck: R().length,
      armed: ft,
      queued: st.length,
      solo: j(),
      returnTo: (nt = ie()) == null ? void 0 : nt.to,
      returnToKind: (mt = ie()) == null ? void 0 : mt.kind,
      funderState: (() => {
        const N = Jt();
        return N ? N.ok ? N.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const N = Jt();
        return !!N && N.ok && N.distinct > 1;
      })(),
      walletCannotSolo: j() && Qt("standalone"),
      walletCannotMulti: Qt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((N) => N !== Mt() && N !== (i == null ? void 0 : i.linked)),
      creditedTo: j() && (i != null && i.address) && (b == null ? void 0 : b.for) === i.address && b.main ? b.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Ct("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (T == null ? void 0 : T.for) === i.address && T.unused,
      gift: (() => {
        const N = Yt();
        return N ? { player: N.player, from: N.from, source: N.source, amount: N.amount } : null;
      })(),
      giftPlays: Yt() ? vt() : 0,
      playCost: dn(Lt()),
      giftStop: fe(),
      albumLock: An(),
      returnPlan: Fn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Qt("slots"),
      likeFunds: (() => {
        var it;
        const N = Gt();
        if (!N || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const tt = Jn();
        return { address: N, balance: tt, low: k(tt), album: ve(), pending: !!Ze(N), txid: (it = Ze(N)) == null ? void 0 : it.txid, main: Mt() };
      })()
    };
  }, So = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", kt = (y, I = "") => {
    E = y, C = I, t.changed();
  };
  async function qe(y, I) {
    if (!u) {
      u = y, C = "", t.changed();
      try {
        await I();
      } catch (K) {
        const nt = K instanceof Error ? K.message : String(K);
        C = /Cancelled in the listening wallet/.test(nt) ? "" : nt, C || (E = "Not now. Nothing was signed.", ct = !0);
      } finally {
        u = null, await kn(!0);
      }
    }
  }
  const vn = () => !!(e != null && e.enabled) && e.here && (j() || !!Mt() && e.allowed), $i = () => vn() && !wt(), Ii = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Tn = () => {
    if (wt()) throw new Error(Ii());
  };
  async function fr() {
    if (!vn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const jn = (y) => {
    const I = Mt();
    return y.request("listening.status", I ? { main: I } : void 0);
  };
  async function Rn(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Wr(y)));
  }
  async function Wr(y = !1) {
    const I = Gt();
    if (!(!ve() || !I || (i == null ? void 0 : i.state) !== "unlocked") && !(!y && (c == null ? void 0 : c.for) === I && t.now() - c.at < 3e4))
      try {
        c = { for: I, value: await t.chain.balance(I), at: t.now() };
      } catch {
      }
  }
  async function Eo(y) {
    if ((W !== y || t.now() - ut >= 6e4) && (_ = await t.links(y), W = y, ut = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const I = `${y}:${i.address}`;
    O === I && S || (S = _.find((K) => K.listening === i.address) ?? null, O = I);
  }
  async function Li() {
    const y = i == null ? void 0 : i.address;
    if (!j() || !y || i != null && i.linked || !t.funder || v || !o || o <= 0n) return;
    const I = Jt(y);
    if (I != null && I.ok && I.funder) return;
    const K = I != null && I.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(q && q.for === y && t.now() - q.at < K)) {
      v = !0;
      try {
        q = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        q = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        v = !1;
      }
      P = q.res.ok ? 0 : P + 1;
    }
  }
  async function Ci() {
    const y = i == null ? void 0 : i.address;
    if (!(!j() || !y || i != null && i.linked || !t.mainOf || z) && !(b && b.for === y && (b.ok || t.now() - b.at < 6e4))) {
      z = !0;
      try {
        b = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        b = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        z = !1;
      }
    }
  }
  async function Ao() {
    const y = i == null ? void 0 : i.address;
    if (!(!y || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === y) && t.store.get(Ct("created", y)) !== "1")
      try {
        T = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function zn() {
    var mt;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let I, K = !1;
    const nt = /* @__PURE__ */ new Map();
    for (const N of En())
      try {
        const tt = await t.chain.transaction(N.txid);
        if (!tt) {
          if (J.add(N.txid), t.now() - N.created > 15 * 6e4 && !nt.has(N.address) && nt.set(N.address, await t.chain.confirmedNonce(N.address)), I = nt.get(N.address), I !== void 0 && I > BigInt(N.nonce)) {
            he({ ...N, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((N.status === "unknown" || N.status === "signed") && N.raw)
            try {
              await t.chain.broadcast(N.raw, N.txid), he({ ...N, status: "pending" });
            } catch (pt) {
              Ui(pt) && he({ ...N, status: "failed", note: pt.message, raw: void 0 });
            }
          continue;
        }
        J.delete(N.txid);
        const it = String(tt.tx_status);
        if (it === "success" && tt.canonical !== !1 && tt.is_unanchored === !1) {
          if (he({ ...N, status: "confirmed", confirmedAt: t.now(), actualFee: String(tt.fee_rate ?? N.fee), raw: void 0 }), K = !0, N.kind === "like" && (x = !0, N.status !== "confirmed" && typeof N.liked == "boolean"))
            try {
              (mt = t.likeConfirmed) == null || mt.call(t, N.song, N.liked);
            } catch {
            }
        } else it.startsWith("abort_") || it.startsWith("dropped_") ? he({ ...N, status: "failed", note: it, raw: void 0 }) : N.status !== "pending" && he({ ...N, status: "pending" });
      } catch {
      }
    for (const N of ve() ? [y, Gt()] : [y]) {
      const tt = Ze(N);
      if (tt)
        try {
          const it = await t.chain.transaction(tt.txid), pt = String((it == null ? void 0 : it.tx_status) ?? "");
          (pt === "success" && it.is_unanchored === !1 || pt.startsWith("abort_") || pt.startsWith("dropped_") || !it && t.now() - tt.at > 2 * 36e5) && (be(null, N), pt === "success" && Ge(2e4), a = -1 / 0, c = null, /on its way/i.test(E) && (E = ""));
        } catch {
        }
    }
    return K;
  }
  async function kn(y = !1) {
    var I;
    try {
      const K = Mt();
      if ((y || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !j() && (!K || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ft && pe(), t.changed();
        return;
      }
      await fr(), i = await jn(s), wt() && i.state === "unlocked" && ($t(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await jn(s)), K && e.allowed && await Eo(K), await Rn(y), await Li(), await Ci(), await Ao(), await Me(), await zn() && await Rn(!0), await Wr(), await h(), U = 0;
    } catch {
      U++;
    }
    if (Qe() === "locked" ? vo() : ft && pe(), x) {
      x = !1;
      try {
        (I = t.likesChanged) == null || I.call(t);
      } catch {
      }
    }
    t.changed(), st.length && !Pe && Kt();
  }
  async function Ti(y) {
    const I = i == null ? void 0 : i.root;
    if (!I || i != null && i.slot || !(i != null && i.address) || Qt("slots")) return;
    const K = Number(t.store.get(Ct("slot", I)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: nt } = await t.chain.account(i.address);
        if (nt >= Oe + dn(Lt())) return;
        await y.request("listening.openSlot", { slot: K }), i = await jn(y), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Zr(y, I) {
    var N;
    Tn();
    const K = !(i != null && i.address) || on(i.address), nt = i != null && i.linked ? (N = t.nameOf) == null ? void 0 : N.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: K ? Ns() : void 0, anyPasskey: I, ...Mt() ? { main: Mt() } : {}, ...nt ? { label: nt } : {} }), i = await jn(y), K && (on(i.address) ? await Mr() : await y.request("listening.stop")), await Ti(y), kt(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const mt = p;
    p = null, mt && t.now() - mt.at < 12e4 && setTimeout(() => void kn(!0).then(() => ke(mt)), 0);
  }
  function vo() {
    ft || u || ct || dt >= 3 || !s || !(i != null && i.address) || (ft = !0, At = (async () => {
      try {
        await Zr(s, !1), dt = 0;
      } catch (y) {
        const I = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(I) ? Ht || (ct = !0, kt("Not now. Nothing was signed.")) : /did not answer/.test(I) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (dt++, C = I);
      } finally {
        ft = !1;
        const y = Ht;
        Ht = null, y ? await y() : await kn(!0);
      }
    })());
  }
  async function pe(y) {
    ft && (Ht = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await At), y && await y(), t.changed();
  }
  const Ns = () => ({
    fee: Lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: $s.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Mr() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function tr(y, I) {
    const K = i.address, { balance: nt, nonce: mt } = I ?? await t.chain.account(K);
    o = nt;
    const N = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: nt.toString(),
      nonce: mt.toString(),
      fee: Ho.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (N.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const tt = y.mode === "amount" ? y.amount : y.mode === "all" ? nt - Ho : nt - $s - Ho, it = Mc(N.raw);
    if (Sr(it.payload.recipient).value !== y.to || String(it.payload.amount) !== N.amount || tt !== void 0 && N.amount !== tt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const pt = {
      id: Gl(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: N.recipient,
      amount: N.amount,
      fee: N.fee,
      nonce: mt.toString(),
      created: t.now(),
      status: "signed",
      raw: N.raw,
      txid: N.txid
    };
    t.validate(pt), he(pt);
    try {
      await t.chain.broadcast(N.raw, N.txid), he({ ...pt, status: "pending" });
    } catch (Dt) {
      throw he({ ...pt, status: "unknown", note: Dt.message }), Dt;
    }
    return N;
  }
  const _s = pl, dr = Ho;
  async function Us(y, I, K) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Qt("slots") || Qt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const nt = i.slot ?? 0;
    if (y === I || ![y, I].includes(nt) || ![y, I].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const mt = i.root ?? i.address, N = y === 0 ? mt : i.address, tt = I === 0 ? mt : i.address, { balance: it, nonce: pt } = await t.chain.account(N);
    if (it < K + dr + Oe) throw new Error(y === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Dt = await s.request("listening.signMove", { from: y, to: I, amount: K.toString(), fee: dr.toString(), nonce: pt.toString(), balance: it.toString() }), Re = Mc(Dt.raw);
    if (Dt.from !== N || Dt.to !== tt || Dt.amount !== K.toString() || Sr(Re.payload.recipient).value !== tt || String(Re.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const cn = {
      id: Gl(),
      address: N,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: tt,
      amount: Dt.amount,
      fee: Dt.fee,
      nonce: pt.toString(),
      created: t.now(),
      status: "signed",
      raw: Dt.raw,
      txid: Dt.txid
    };
    t.validate(cn), he(cn);
    try {
      await t.chain.broadcast(Dt.raw, Dt.txid), he({ ...cn, status: "pending" });
    } catch (_e) {
      throw he({ ...cn, status: "unknown", note: _e.message }), _e;
    }
    return be({ txid: Dt.txid, amount: Dt.amount, at: t.now() }, tt), tt === mt && mt !== i.address ? c = null : a = -1 / 0, Dt;
  }
  let f = !1;
  const m = /* @__PURE__ */ new Map(), A = (y) => Ct("float", y);
  async function h() {
    if (f || (i == null ? void 0 : i.state) !== "unlocked" || !ve() || Qt("move") || Qt("rootLike") || !i.address) return;
    const y = i.address;
    if (t.store.get(A(y)) === "1") return;
    const I = Yt();
    if (!(I != null && I.player) || I.state !== "arrived") return;
    const K = Jn();
    if (K === void 0 || o === void 0) return;
    if (!k(K)) {
      t.store.set(A(y), "1");
      return;
    }
    if (Ze(Gt()) || je() || En().length || o < _s * 4n + Oe + dr) return;
    const nt = m.get(y);
    if (!(nt && (nt.n >= 3 || t.now() - nt.at < 5 * 6e4))) {
      f = !0, m.set(y, { n: ((nt == null ? void 0 : nt.n) ?? 0) + 1, at: t.now() });
      try {
        await Us(i.slot ?? 0, 0, _s), t.store.set(A(y), "1");
      } catch (mt) {
        console.warn("[radio] likes float not sent yet", mt);
      } finally {
        f = !1;
      }
    }
  }
  async function V(y) {
    if (Fe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Qt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const I = await Xr().catch(() => null);
    if (!I)
      throw X = null, It = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    It = !1, o = I.balance;
    const K = { balance: I.balance, nonce: I.nonce };
    if (y === "excess") {
      const it = F0(I.parts) ?? se();
      if (!it) throw new Error("Choose where to send the excess first.");
      await tr({ mode: "excess", to: it, linked: !1 }, K), X = null, kt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const nt = I.steps;
    if (!nt.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!X && X.balance === I.balance && t.now() - X.at <= Ye && X.steps.length === nt.length && X.steps.every((it, pt) => it.to === nt[pt].to && it.mode === nt[pt].mode && it.send === nt[pt].send))) {
      X = {
        at: t.now(),
        balance: I.balance,
        steps: nt,
        parts: I.parts,
        plan: { state: "ready", steps: nt.map((it) => ({ to: it.to, kind: it.kind, send: it.send.toString() })), kept: I.tooSmall, excess: F0(I.parts) }
      }, kt(nt.length > 1 ? `This goes back in ${nt.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const N = nt[0], tt = N.to ?? se();
    if (!tt) throw new Error("Choose where to send the rest first.");
    if (N.mode === "amount" && Qt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await tr({ mode: N.mode, to: tt, linked: !1, ...N.mode === "amount" ? { amount: N.send } : {} }, K), X = null, nt.length === 1 ? (Sn(!1), kt("Returned ✓ Paying is off.")) : kt(`Returned ✓ ${nt.length - 1} more ${nt.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const gt = {
    forceRefresh: () => kn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (y) => {
      if (!t.main() && !(y !== null && !Gr(y))) {
        if (y === Rt()) return kn(!0);
        t.store.set(Te, y ?? ""), C = "", E = "", o = void 0, a = -1 / 0, c = null, await kn(!0);
      }
    },
    create: () => qe("Waiting for your passkey…", async () => {
      const y = await fr();
      await y.request("listening.unlock", { mode: "create", terms: Ns(), ...t.main() ? { main: t.main() } : {} }), i = await jn(y), i.address && t.store.set(Ct("created", i.address), "1"), Sn(!0), kt(j() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Mr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (y) => {
      y ? Ge() : ae = null, t.changed();
    },
    giftSent: (y, I) => {
      !(i != null && i.address) || Be() || (be({ txid: y, amount: I.toString(), at: t.now() }), a = -1 / 0, L = null, kt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (y) => {
      if (Tn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Qt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await fr()).request("listening.bindSlot", { slot: y, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (y, I, K, nt) => {
      be({ txid: K, amount: nt.toString(), at: t.now() }, I), L = null, await gt.openAlbum(y), kt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (y) => qe("Opening…", async () => {
      if (Tn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Qt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === y) return;
      $t(), await s.request("listening.openSlot", { slot: y }), i = await jn(s), o = void 0, a = -1 / 0, X = null, It = !1;
      const I = i.root;
      I && y > 0 && t.store.set(Ct("slot", I), String(y)), kt(y === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (y = !1) => {
      const I = () => qe("Waiting for your passkey…", async () => Zr(await fr(), y));
      return ft ? y ? Qt("cancel") ? (kt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : pe(async () => {
        (Qe() === "locked" || Qe() === "intro") && await I();
      }) : At : I();
    },
    link: () => qe("Sign in your wallet…", async () => {
      Tn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const I = (await t.links(y)).find((K) => K.listening === i.address);
      if (I)
        await s.request("listening.link", { main: y, issued: I.issued, mainSignature: I.mainSignature });
      else {
        const K = { main: y, listening: i.address, issued: t.now() }, nt = await t.signWithMain(y, U5(K)), mt = await s.request("listening.link", { main: y, issued: K.issued, mainSignature: nt });
        await t.saveLink({ ...K, mainSignature: nt, listeningSignature: mt.listeningSignature }), ut = -1 / 0;
      }
      kt("Linked ✓");
    }),
    deposit: () => qe("Approve the deposit in your wallet…", async () => {
      Tn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Be()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (M()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Rn(!0);
      const I = Rl(o ?? 0n);
      if (I <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      D = await t.deposit(y, i.address, I), D && be({ txid: D, amount: I.toString(), at: t.now() }), kt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => qe("Approve the top-up in your wallet…", async () => {
      Tn();
      const y = t.main(), I = Gt();
      if (!y || !I) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ze(I)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await t.chain.balance(I);
      ve() ? c = { for: I, value: K, at: t.now() } : (o = K, a = t.now());
      const nt = Rl(K);
      if (nt <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const mt = await t.deposit(y, I, nt);
      mt && be({ txid: mt, amount: nt.toString(), at: t.now() }, I), kt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (y) => qe("Adding plays…", async () => {
      if (Tn(), !ve()) throw new Error("Open the album you want to add plays to first.");
      if (!ac.includes(y)) throw new Error("Choose one of the amounts offered.");
      const I = K5(y, Lt());
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (En().length || Be()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Us(0, i.slot ?? 0, I), kt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => qe("Confirm in the listening wallet…", async () => {
      if (!$i()) throw new Error("Connect your wallet first.");
      await Mr(), await s.request("listening.approveSession", Ns()), Sn(!0), kt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => qe("Clearing…", async () => {
      for (const y of R())
        await t.chain.transaction(y.txid) || he({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      kt("Cleared ✓");
    }),
    switchOff: () => qe("Switching off…", async () => {
      $t(), await (s == null ? void 0 : s.request("listening.stop")), Sn(!1), kt("Music support is off. Playback is paused.");
    }),
    lock: () => qe("Locking…", async () => {
      $t(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, kt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const I = String(y ?? "").trim();
      if (!(i != null && i.address)) return kt("", "Unlock the listening wallet first.");
      if (!Gr(I)) return kt("", "Enter a standard mainnet address (it starts with SP).");
      if (I === i.address) return kt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(et(i.address), I), kt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(et(i.address), ""), t.changed();
    },
    returnFunds: (y) => qe("Check the return in the listening wallet…", async () => {
      if (!$i()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Br()) return V(y);
      const I = ie();
      if (!I) throw new Error(j() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (I.kind !== "linked" && Qt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Fe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await tr({ mode: y, to: I.to, linked: I.kind === "linked" }), y === "all" && Sn(!1), kt(y === "all" ? I.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, st = [], xt = 10, ee = 30 * 6e4;
  let Pe = !1;
  const je = () => d || !!u || l || g, $t = () => {
    st.length && (st.length = 0, t.changed());
  };
  async function Ne(y) {
    if (!st.some((I) => I.id === y.id) && !pn().some((I) => I.id === y.id) && (st.push({ ...y, at: t.now() }), st.length > xt && st.shift()), je() || Fe().length) {
      const I = st.length;
      E = `Queued ${I === 1 ? "this song" : I + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Kt();
  }
  async function Kt() {
    if (!Pe) {
      Pe = !0;
      try {
        for (; st.length; ) {
          for (; st.length && t.now() - st[0].at > ee; ) st.shift();
          if (!st.length || je() || await Bn(st[0]) === "wait") return;
          st.shift();
        }
      } finally {
        Pe = !1, t.changed();
      }
    }
  }
  async function Bn(y) {
    var I;
    d = !0;
    try {
      await kn();
      const K = Qe();
      if (K === "loading") return "wait";
      if (K !== "ready" || !on() || !(i != null && i.session) || i.session.playsLeft < 1 || !H) return "done";
      if (Fe().length) return "wait";
      $ || (await t.chain.verify(), $ = !0);
      const nt = i.address, { balance: mt, nonce: N } = await t.chain.account(nt);
      o = mt, a = t.now();
      const tt = await t.chain.owner(zl, y.song);
      if (tt === nt || tt === Mt()) return "done";
      const it = await s.request("listening.signPlay", {
        core: zl,
        song: y.song,
        receipt: y.id,
        fee: Lt().toString(),
        nonce: N.toString(),
        balance: mt.toString()
      }), pt = {
        id: y.id,
        address: nt,
        kind: "play",
        core: zl,
        song: y.song,
        recipient: tt,
        amount: "50",
        fee: Lt().toString(),
        nonce: N.toString(),
        created: t.now(),
        status: "signed",
        raw: it.raw,
        txid: it.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(pt), he(pt);
      const Dt = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(it.raw, it.txid), he({ ...pt, status: "pending" }), E = `♪ Paid ${Dt}`, C = "";
      } catch (Re) {
        he({ ...pt, status: Ui(Re) ? "failed" : "unknown", note: Re.message, ...Ui(Re) ? { raw: void 0 } : {} }), C = Re.message;
      }
      return i = await jn(s), "done";
    } catch (K) {
      const nt = K instanceof Error ? K.message : "payment unavailable";
      return (I = Yt()) != null && I.player ? (E = "Payment is taking a moment: " + nt, "wait") : (E = "This song played free: " + nt, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function an(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Qe()) || Qt("like") ? !1 : (ke(y), !0);
  }
  async function ke(y) {
    const I = y.title ? `“${y.title}”` : `song #${y.song}`, K = (Ke) => {
      var Gn;
      C = Ke, E = "";
      try {
        (Gn = t.likeFailed) == null || Gn.call(t, y.song);
      } catch {
      }
      t.changed();
    }, nt = ve(), mt = Qe(), N = Mt(), tt = nt && (mt === "fund" || mt === "over") ? "ready" : mt, it = j() ? Gt() : N;
    if (tt === "locked") {
      p = { ...y, at: t.now() }, kt(`Unlock to like ${I}. It sends straight after.`);
      return;
    }
    if (tt === "wrong-wallet") return K(Ii());
    if (tt === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (j() && Qt("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (tt === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (tt === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (nt) {
      await Wr(!0);
      const Ke = Jn();
      if (k(Ke))
        return t.changed(), K(Oc);
    }
    if (tt !== "ready" || !it) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return K("Pay-per-play is running in another tab. Like from that tab.");
    const pt = pn(Gt()).find((Ke) => Ke.kind === "like" && Ke.song === y.song);
    if (pt && Do.includes(pt.status))
      return K(`Your last like for ${I} is still on its way. It can change again once it confirms.`);
    if (l) return K("One like at a time: your last one is still being sent.");
    if ((pt == null ? void 0 : pt.status) === "confirmed" && t.now() - (pt.confirmedAt ?? 0) < Y5)
      return K(`Your like for ${I} has only just confirmed. Try again in a moment.`);
    let Dt;
    g = !0;
    try {
      Dt = t.likeState ? (await t.likeState(it, y.song)).by : y.likedBy ?? [];
    } catch {
      Dt = y.likedBy;
    } finally {
      g = !1;
    }
    if (!Dt) return K(`Could not check ${I} right now. Try the heart again.`);
    const Re = Gt(), _e = ((pt == null ? void 0 : pt.status) === "confirmed" && typeof pt.liked == "boolean" && t.now() - (pt.confirmedAt ?? pt.created) < 5 * 6e4 ? pt.liked : void 0) ?? Dt.includes(Re);
    if (!_e && Dt.some((Ke) => Ke !== Re)) return K(j() ? `${I} was liked from another wallet of yours. Unlike it there.` : `${I} was liked from your main wallet${Dt.includes(N) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Je({ song: y.song, liked: !_e, title: y.title, artist: y.artist });
  }
  async function Je(y) {
    var nt, mt, N;
    if (l) {
      kt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const I = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, K = t.wait ?? ((tt) => new Promise((it) => setTimeout(it, tt)));
    try {
      kt(`${y.liked ? "Liking" : "Unliking"} ${I}…`);
      const tt = t.now() + 12e4;
      for (; d || (ve() ? pn(Gt()).some((_e) => Do.includes(_e.status)) : Fe().length); ) {
        if (t.now() > tt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await kn(!0);
      }
      if (!ve() && Qe() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const it = Gt(), { balance: pt, nonce: Dt } = await t.chain.account(it);
      if (ve() ? c = { for: it, value: pt, at: t.now() } : (o = pt, a = t.now()), k(pt)) throw new Error(Oc);
      const Re = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: jl.toString(),
        nonce: Dt.toString(),
        balance: pt.toString()
      }), cn = {
        id: Gl(),
        address: it,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: jl.toString(),
        nonce: Dt.toString(),
        created: t.now(),
        status: "signed",
        raw: Re.raw,
        txid: Re.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(cn), he(cn);
      try {
        await t.chain.broadcast(Re.raw, Re.txid), he({ ...cn, status: "pending" }), E = `${y.liked ? "♥ Liked" : "Unliked"} ${I}`, C = "";
        try {
          (nt = t.likeSent) == null || nt.call(t, y.song, y.liked);
        } catch {
        }
      } catch (_e) {
        if (he({ ...cn, status: Ui(_e) ? "failed" : "unknown", note: _e.message, ...Ui(_e) ? { raw: void 0 } : {} }), C = _e.message, Ui(_e)) try {
          (mt = t.likeFailed) == null || mt.call(t, y.song);
        } catch {
        }
      }
      i = await jn(s);
    } catch (tt) {
      C = "Like not sent: " + (tt instanceof Error ? tt.message : "the listening wallet is unavailable");
      try {
        (N = t.likeFailed) == null || N.call(t, y.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Kt();
    }
  }
  return { snapshot: ki, refresh: kn, onListened: Ne, heart: an, toggleLike: ke, ...gt };
}
const Uw = ["Connect", "Passkey", "Link & fund", "Listen"], Ow = ["Passkey", "Add 1 STX", "Listen"], ef = (t) => t ? Ow : Uw;
function X5(t) {
  if (t.solo) return W5(t);
  const e = Uw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(2, t.depositPending ? "funds on their way: nothing to do" : "add up to 1 STX");
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
function W5(t) {
  const e = Ow.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(1, t.depositPending ? "your funds are on their way: nothing to do" : "add 1 STX: anyone can send it to your address");
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
function Z5(t, e) {
  return !e || e.at >= ef(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const Q5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function J5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !Q5(r.id)));
}
const t6 = {}, e6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, n6 = (t) => {
  const e = t6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, r6 = (t) => `/hiro/${t}`, s6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, i6 = (t) => {
  const e = n6(t);
  if (e)
    return [s6(e)];
  const n = e6[t];
  return typeof window < "u" ? [`${window.location.origin}${r6(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, o6 = {}, j0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, a6 = "xtrata.log.enabled", c6 = "xtrata.log.level", l6 = "xtrata.log.tags", u6 = "xtrata.log.dedupe", Xa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, f6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, d6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, h6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, p6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, g6 = () => {
  const t = o6 ?? {}, e = Xa(a6) ?? t.VITE_LOG_ENABLED, n = Xa(c6) ?? t.VITE_LOG_LEVEL, r = Xa(l6) ?? t.VITE_LOG_TAGS, s = Xa(u6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: f6(e),
    level: d6(n) ?? "warn",
    tags: p6(r),
    dedupe: h6(s)
  };
}, y6 = (t, e, n) => !t.enabled || j0[n] < j0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), w6 = (t, e, n, r) => {
  const s = g6();
  if (!y6(s, e, t) || m6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, b6 = /* @__PURE__ */ new Set();
let R0 = null;
const m6 = (t, e, n, r, s) => (R0 !== t && (b6.clear(), R0 = t), !1), x6 = (t, e, n) => w6("debug", t, e, n), S6 = {}, E6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, A6 = (t) => {
  const e = S6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : E6[t];
}, v6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, k6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return v6.test(n) ? n : null;
}, $6 = (t) => t.replace(/\/+$/, ""), I6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), z0 = (t) => {
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
}, Oi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, L6 = (t) => {
  var c, u;
  let e;
  try {
    e = Sr(I8(t));
  } catch {
    return null;
  }
  const n = Oi(e);
  if (!n || n.success === !1)
    return null;
  const r = Oi(n.value), s = Oi(r == null ? void 0 : r.value), i = Oi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = z0((c = Oi(i.name)) == null ? void 0 : c.value), a = z0((u = Oi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : k6(`${o}.${a}`);
}, C6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${$6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [yw(Jy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : L6(i.result);
}, T6 = async (t) => {
  const e = t.address.trim();
  if (!qi(e))
    return null;
  const n = A6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of i6(t.network))
    try {
      return await C6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return x6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: I6(r)
  }), null;
};
function B6(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
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
const G0 = Object.freeze({
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
}), K0 = Object.freeze({ 139: "melophonic" });
function M6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(G0, n) ? G0[n] : Object.hasOwn(K0, n) ? K0[n] : e;
}
const V0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function P6(t, e = "") {
  return Object.hasOwn(V0, String(t)) ? V0[String(t)] : e;
}
const Hw = 10000n, yd = 1000000n, Hc = 3000n, N6 = (t, e) => `${t}#gift=${e}`, _6 = 100, Fo = (t, e = ur) => t <= Oe ? 0 : Number((t - Oe) / dn(e)), Y0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Dw = "xtrata.xyz/radio/gifts", Kl = _6, U6 = "Create a prefunded Xtrata radio gift batch", O6 = (t) => ({
  domain: hi({ name: rn(Dw), version: rn("1"), "chain-id": kr(1) }),
  message: hi({
    purpose: rn(U6),
    creator: rn(t.creator),
    count: kr(t.count),
    amount: kr(BigInt(t.amount)),
    label: rn(t.label),
    issued: kr(t.issued),
    ...t.player ? { player: rn(t.player) } : {}
  })
}), H6 = (t, e, n = ur) => Oe + BigInt(t) * dn(n) + (e ? pl : 0n), D6 = (t, e = ur) => Number((yd - Oe - (t ? pl : 0n)) / dn(e)), F6 = (t, e) => BigInt(t) * (e + Hc);
function j6(t, e, n, r = ur) {
  const s = n ? pl : 0n, i = e > Oe + s ? e - Oe - s : 0n, o = Number(i / dn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Nc,
    fees: BigInt(o) * r,
    reserve: Oe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Hc,
    perCopy: e + Hc,
    total: F6(t, e)
  };
}
const R6 = (t) => t >= Hw && t <= yd, q0 = 40, z6 = "Create an Xtrata radio gift player", G6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function X0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && G6.test(t) : !n;
}
function K6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!X0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!X0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > q0) throw new Error(`A player holds 1 to ${q0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const V6 = (t) => ng(cg(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), Y6 = (t) => ({
  domain: hi({ name: rn(Dw), version: rn("1"), "chain-id": kr(1) }),
  message: hi({
    purpose: rn(z6),
    admin: rn(t.admin),
    player: rn(t.hash),
    issued: kr(t.issued)
  })
}), Zs = (t) => t.tracks.filter((e) => !e.hidden), q6 = (t) => t.tracks.find((e) => e.hidden) ?? null, X6 = [300, 500, 1e3], W0 = 1800, Vl = /* @__PURE__ */ new Map();
async function W6(t) {
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
function Z6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Vl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Vl.set(t, { ...a, until: Date.now() + W0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Vl.delete(t), s();
      }, W0 + 50);
    }
  }, i;
}
const Rr = (t, e, n, r, s) => Z6(t, e, async () => await W6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Ds = "xtrata.radio.gift.incoming.v1", Z0 = (t) => "xtrata.radio.gift.mine.v1:" + t, Q0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, br = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Wa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Yn = (t) => sr(t).replace(/\.?0+$/, "");
function Q6(t) {
  let e = null;
  const n = (k) => [5e3, 1e4, 2e4, 3e4][k] ?? 6e4, r = (() => {
    try {
      const k = new URL(location.href), R = new URLSearchParams(k.hash.slice(1)).get("gift") ?? k.searchParams.get("gift");
      return R !== null && (k.searchParams.delete("gift"), history.replaceState(null, "", k.pathname + (k.search || ""))), Y0(R) ? R : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const k = JSON.parse(t.store.get(Ds) || "null");
      return Y0(k == null ? void 0 : k.code) ? k.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Ds, JSON.stringify({ code: i, at: t.now() }));
    let k = 0;
    const R = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (G) => {
      const j = await G.json().catch(() => ({}));
      if (G.status === 404) {
        t.store.set(Ds, null), e = { ...e, error: (j == null ? void 0 : j.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!G.ok) throw new Error("busy");
      const wt = j;
      e = { ...e, view: wt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(wt.status) && t.store.set(Ds, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void R(), n(k++)));
    });
    R();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const k = e == null ? void 0 : e.view;
    return !(k != null && k.player) || !o() ? null : { player: k.player, from: l(k), plays: Fo(BigInt(k.amount)) };
  }, c = () => {
    const k = e == null ? void 0 : e.view;
    return !k || k.player || !o() ? null : { plays: Fo(BigInt(k.amount)), from: k.from ? t.who(k.from) : null };
  }, u = () => {
    const k = e == null ? void 0 : e.code;
    if (!k) return [];
    const R = `${location.origin}${location.pathname}#gift=${k}`;
    return [Rr("gift-pass-on", "Copy the link to pass on", () => R, "primary", t.changed)];
  }, d = () => {
    e = null, t.store.set(Ds, null), t.changed();
  }, l = (k) => k.from ? t.who(k.from) : k.label ? `Xtrata Radio · ${k.label}` : "Xtrata Radio";
  let g = {};
  const p = (k) => {
    if (g.box) return g.box;
    const R = St("div", "", "ppp-gift-check");
    g.box = R;
    const G = () => {
      const j = window.turnstile;
      !j || g.rendered || (g.rendered = !0, j.render(R, { sitekey: k, callback: (wt) => {
        g.token = wt, t.changed();
      }, "expired-callback": () => {
        g.token = void 0;
      } }));
    };
    if (window.turnstile) G();
    else {
      const j = document.createElement("script");
      j.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", j.async = !0, j.onload = G, document.head.append(j);
    }
    return R;
  }, x = (k) => {
    queueMicrotask(() => void k());
  };
  let E;
  async function C(k) {
    var j, wt, et, se, Jt, ie, me, Yt, Me;
    if (!e || e.claiming || !k.listening) return;
    const R = !!((j = e.view) != null && j.player);
    if (R && !k.root) return;
    e.claiming = !0, e.error = void 0, (wt = t.claiming) == null || wt.call(t, !0), t.changed();
    const G = async (Xt) => {
      const vt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: g.token, ...Xt })
      });
      return { res: vt, r: await vt.json().catch(() => ({})) };
    };
    try {
      let Xt = 0, vt = k.listening, Wt;
      if (R) {
        const te = Number((et = await t.json("/radio/gift/slots?root=" + encodeURIComponent(k.root))) == null ? void 0 : et.next);
        if (!Number.isSafeInteger(te) || te < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Xt = te;
        for (let An = 0; ; An++) {
          const Ye = await t.album.bind(Xt);
          if (vt = Ye.address, Wt = await G({ wallet: vt, binding: Ye }), Wt.res.status === 409 && /just taken/.test(((se = Wt.r) == null ? void 0 : se.error) || "") && An < 5) {
            Xt += 1;
            continue;
          }
          break;
        }
      } else Wt = await G({ wallet: vt });
      const { res: ue, r: fe } = Wt;
      if (ue.status === 503 && /sending another gift/.test((fe == null ? void 0 : fe.error) || "")) {
        e.waiting = !0, (Jt = t.claiming) == null || Jt.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const te = String((fe == null ? void 0 : fe.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new|already have this album/.test(te))
          throw t.store.set(Ds, null), new Error(te || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(te)) throw new Error(te || `Could not open the gift (${ue.status}).`);
        const Ye = /topping up/.test(te) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(te) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(te) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Ye), { retry: !0, slow: /topping up|not paid for yet/.test(te) });
      }
      e.done = !0, t.store.set(Ds, null), R ? await t.album.arrived(Xt, vt, fe.txid, BigInt(fe.amount)) : t.giftSent(fe.txid, BigInt(fe.amount));
    } catch (Xt) {
      const vt = Xt, Wt = vt.name === "TypeError" || vt.name === "AbortError" || vt.name === "TimeoutError" || /wallet number/i.test(vt.message);
      if (vt.retry || Wt) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: vt.retry ? vt.message : "Still sending your gift… the network is slow, trying again." }, (ie = t.claiming) == null || ie.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, vt.slow ? 6e4 : n(ue));
      } else
        e.error = vt.message, (me = t.claiming) == null || me.call(t, !1);
      g.token = void 0;
      try {
        (Me = (Yt = window.turnstile) == null ? void 0 : Yt.reset) == null || Me.call(Yt, g.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function D(k) {
    if (!k.listening || !k.depositPending || k.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== k.listening || t.now() - U.at > 3e4) {
      const G = k.listening;
      U = { ...(U == null ? void 0 : U.wallet) === G ? U : {}, wallet: G, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(G)).then((j) => {
        var wt, et;
        (U == null ? void 0 : U.wallet) === G && (U.state = (wt = j == null ? void 0 : j.gift) == null ? void 0 : wt.state, U.problem = ((et = j == null ? void 0 : j.gift) == null ? void 0 : et.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const R = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return R.title = `Network reply: ${U.problem}`, [R];
  }
  function S(k, R, G = !1) {
    var ie, me;
    const j = R.player, wt = BigInt(R.amount), et = G ? [] : [St("p", `🎁 ${l(R)} sent you “${j.title}”${j.subtitle ? ` by ${j.subtitle}` : ""}: ${Zs(j).length} ${Zs(j).length === 1 ? "song" : "songs"} and ${Fo(wt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!k.root && ["fund", "ready", "over", "link"].includes(k.step))) {
      if (G) return et;
      if (et.push(St("p", k.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : k.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), k.step === "intro") {
        const Yt = document.createElement("details");
        Yt.className = "ppp-how";
        const Me = document.createElement("summary");
        Me.textContent = "How does this work?", Yt.append(Me, St("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), et.push(Yt);
      }
      return et;
    }
    if (k.walletCannotAlbums)
      return et.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), et;
    const Jt = (me = (ie = k.gate) == null ? void 0 : ie.gifts) == null ? void 0 : me.turnstileSiteKey;
    return Jt && !g.token ? et.push(St("p", "One quick check and it is yours:", "ppp-mute"), p(Jt)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => C(k)), et.push(...O(k, "Sending your album…")), et;
  }
  function O(k, R) {
    const G = [];
    return e.claiming || e.waiting ? G.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : R, "ppp-cyan")) : e.retry && G.push(St("p", e.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(E), e.retry = void 0, C(k);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? G.push(St("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), br("Forget this gift link here", d, "quiet")) : e.error && G.push(St("p", e.error, "ppp-bad"), br("Try again", () => {
      e.error = void 0, C(k);
    })), G;
  }
  const _ = (k) => {
    var R;
    return !!e && !e.done && !e.error && o() && !!k.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !k.linked && !k.creditedTo && (k.createdHere || k.brandNew || !!((R = e.view) != null && R.player)) && (k.balance ?? 0n) === 0n && !k.entries.length);
  };
  function W(k, R = {}) {
    var Me, Xt;
    const G = D(k);
    if (!e || ["off", "elsewhere"].includes(k.step)) return G;
    const j = e.view;
    if (e.error && !j) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!j) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return G;
    if (j.status === "claimed" || j.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(j.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (j.status === "pending-deposit") return [St("p", `🎁 ${l(j)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (j.player) return [...S(k, j, !!R.bare), ...G];
    if (!!k.listening && (!(k.createdHere || k.brandNew) || !!k.linked || !!k.creditedTo || (k.balance ?? 0n) > 0n || k.entries.length > 0))
      return [St("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", d, "quiet")];
    const et = BigInt(j.amount), se = Fo(et).toLocaleString(), Jt = St(
      "p",
      `🎁 ${l(j)} sent you ${Yn(et)} STX of on-chain music: about ${se} paid plays.`,
      "ppp-gift"
    ), ie = R.bare ? [] : [Jt], me = !!k.listening && (k.createdHere || k.brandNew) && !k.linked && !k.creditedTo && k.step === "fund" && (k.balance ?? 1n) === 0n && !k.depositPending && !k.entries.length, Yt = (Xt = (Me = k.gate) == null ? void 0 : Me.gifts) == null ? void 0 : Xt.turnstileSiteKey;
    return me ? (Yt && !g.token ? ie.push(St("p", "One quick check and it is yours:", "ppp-mute"), p(Yt)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => C(k)), ie.push(...O(k, "Sending your gift…"))) : k.step === "intro" ? R.bare || ie.push(St("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : k.listening && k.linked ? ie.push(St("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", d, "quiet")) : k.listening && (k.balance ?? 0n) > 0n && ie.push(St("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", d, "quiet")), ie;
  }
  async function ut(k, R, G) {
    var j;
    try {
      const wt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(k));
      if ((j = wt == null ? void 0 : wt.gift) != null && j.returnTo) return { ok: !0, funder: wt.gift.returnTo, txId: wt.gift.txid ?? void 0, amount: wt.gift.amount, distinct: 1 };
    } catch {
      if (G) return { ok: !1 };
    }
    return R();
  }
  const J = St("div", "", "ppp-gift-fold");
  let q = 250000n, v = "", P = "";
  const b = (k) => {
    try {
      const R = JSON.parse(t.store.get(Z0(k)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, T = (k, R) => t.store.set(Z0(k), JSON.stringify(R.slice(0, 50)));
  async function z(k) {
    const R = b(k);
    for (const G of R)
      if (!(G.view && ["claimed", "refunded", "expired"].includes(G.view.status)))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: G.id, ...G.txid ? { txid: G.txid } : {} }) }) : await t.json("/radio/gift?id=" + G.id), G.error = void 0;
        } catch (j) {
          G.error = j.message;
        }
    T(k, R), t.changed();
  }
  async function L(k) {
    if (v) return;
    v = "Starting your gift…", P = "", t.changed();
    let R = null;
    try {
      R = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: k, amount: q.toString() }) });
      const G = b(k);
      G.unshift({ id: R.id, code: R.code, amount: q.toString(), at: t.now() }), T(k, G), v = "Approve the gift in your wallet…", t.changed();
      const j = await t.pay(k, R.depositTo, BigInt(R.deposit), R.memo), wt = b(k), et = wt.find((se) => se.id === R.id);
      et && (et.txid = j, et.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: k, label: "", expires: 0 }), T(k, wt), P = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", z(k);
    } catch (G) {
      P = G.message || "Not sent.";
    } finally {
      v = "", t.changed();
    }
  }
  const at = (k) => "xtrata.radio.gift.players.v1:" + k, X = (k) => {
    try {
      const R = JSON.parse(t.store.get(at(k)) || "[]");
      return Array.isArray(R) ? R.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id)) : [];
    } catch {
      return [];
    }
  };
  async function It(k, R) {
    var G;
    if (!v) {
      v = "Checking the player…", P = "", t.changed();
      try {
        const j = R.tracks.split(/[\s,]+/).filter(Boolean).map((me) => Number(me.replace(/^#/, ""))), wt = K6({ title: R.title.trim(), subtitle: R.subtitle.trim(), tracks: j, cover: (G = R.cover) != null && G.trim() ? Number(R.cover.trim().replace(/^#/, "")) : null });
        v = "Sign in your wallet…", t.changed();
        const et = { admin: k, hash: V6(wt), issued: t.now() }, se = await t.sign(k, Y6(et));
        v = "Making the player…", t.changed();
        const Jt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: wt, request: et, signature: se }) }), ie = X(k).filter((me) => me.id !== Jt.id);
        ie.unshift({ id: Jt.id, title: Jt.title, tracks: Jt.tracks }), t.store.set(at(k), JSON.stringify(ie.slice(0, 30))), P = `${Jt.existing ? "That player already exists" : "Player made"} ✓ “${Jt.title}” · ${Jt.tracks} songs. Pick it below for a batch.`;
      } catch (j) {
        P = j.message || "Not made.";
      } finally {
        v = "", t.changed();
      }
    }
  }
  const $ = (k, R) => N6(k || location.origin + "/radio.html", R), H = (k) => {
    try {
      const R = JSON.parse(t.store.get(Q0(k)) || "[]");
      return Array.isArray(R) ? R.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id) && Array.isArray(G.codes)) : [];
    } catch {
      return [];
    }
  }, ft = (k, R) => t.store.set(Q0(k), JSON.stringify(R.slice(0, 20))), ct = (k) => !!k.view && k.view.status === "live" && k.view.copies.waiting + k.view.copies.claiming + k.view.copies.refunding === 0, dt = (k, R) => t.json(k, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(R) });
  let Ht = 0;
  async function At(k) {
    const R = H(k);
    for (const G of R)
      if (!ct(G))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await dt("/radio/gift/batch/confirm", { id: G.id, ...G.txid ? { txid: G.txid } : {} }) : await t.json("/radio/gift/batch?id=" + G.id), G.error = void 0;
        } catch (j) {
          G.error = j.message;
        }
    try {
      const G = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(k));
      for (const j of (G == null ? void 0 : G.batches) ?? []) {
        const wt = R.find((et) => et.id === j.id);
        if (wt) {
          wt.error || (wt.view = j);
          continue;
        }
        R.push({ id: j.id, codes: [], count: j.count, amount: j.amount, label: j.label, player: j.player, depositTo: "", deposit: j.deposit, memo: j.memo, at: 0, view: j });
      }
    } catch {
    }
    ft(k, R), t.changed();
  }
  async function Lt(k, R) {
    const G = H(k).find((j) => j.id === R);
    if (!(!G || !G.depositTo || v)) {
      v = "Approve the payment in your wallet…", P = "", t.changed();
      try {
        const j = await t.pay(k, G.depositTo, BigInt(G.deposit), G.memo), wt = H(k), et = wt.find((se) => se.id === R);
        et && (et.txid = j), ft(k, wt), P = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", v = "", At(k);
      } catch (j) {
        P = `${/cancel/i.test(j.message) ? "Payment cancelled." : j.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        v = "", t.changed();
      }
    }
  }
  async function Qt(k, R, G, j) {
    if (v) return;
    if (!R.ok) {
      P = R.reason, t.changed();
      return;
    }
    v = "Sign in your wallet…", P = "", t.changed();
    let wt = null;
    try {
      const et = { creator: k, count: R.count, amount: R.amount.toString(), label: G, issued: t.now(), ...j ? { player: j } : {} }, se = await t.sign(k, O6(et));
      v = "Making your links…", t.changed(), wt = await dt("/radio/gift/batch", { request: et, signature: se });
      const Jt = H(k);
      Jt.unshift({ id: wt.id, codes: wt.codes, count: R.count, amount: wt.amount, label: G, player: j ?? null, depositTo: wt.depositTo, deposit: wt.deposit, memo: wt.memo, at: t.now() }), ft(k, Jt);
    } catch (et) {
      P = et.message || "Not made.", v = "", t.changed();
      return;
    }
    v = "", t.changed(), await Lt(k, wt.id);
  }
  function Ct() {
    const k = !!be.value, R = ae.value === "max" ? D6(k) : Number(ae.value), G = H6(R, k), j = Number(Ge.value);
    return !Number.isInteger(j) || j < 1 || j > Kl ? { ok: !1, reason: `Make 1 to ${Kl} copies at a time.`, album: k, plays: R, amount: G, count: j } : R6(G) ? { ok: !0, reason: "", album: k, plays: R, amount: G, count: j, bill: j6(j, G, k) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: k, plays: R, amount: G, count: j };
  }
  const Te = () => {
    const k = Ct();
    if (!k.ok) return k.reason;
    const R = k.bill;
    return `Each copy: ${k.plays.toLocaleString()} paid plays (${Yn(R.holders)} to song holders, ${Yn(R.fees)} network fees)${k.album ? `, ${Yn(R.float)} for the album’s likes` : ""}, ${Yn(R.reserve)} kept so a listener can return what is left, + ${Yn(R.sendFee)} to send it = ${Yn(R.perCopy)} STX. ${k.count} copies = ${Yn(R.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Rt = (k, R) => R.codes.map((G) => $(k, G)), Mt = St("input");
  Mt.type = "range", Mt.min = String(Hw), Mt.max = String(yd), Mt.step = "10000", Mt.value = String(q), Mt.setAttribute("aria-label", "Gift amount");
  const pn = St("p", "", "ppp-gift-amount"), he = br("", () => {
    const k = t.main();
    k && L(k);
  }, "primary"), on = () => {
    pn.textContent = Sn(), he.textContent = `Gift ${Yn(q)} STX`;
  };
  Mt.oninput = () => {
    q = BigInt(Mt.value), on();
  };
  const Sn = () => `${Yn(q)} STX · about ${Fo(q).toLocaleString()} paid plays · you pay ${Yn(q + Hc)} STX with the network fee`;
  on();
  const Fe = St("input");
  Fe.maxLength = 60, Fe.placeholder = "Title, e.g. Proof of Sound", Fe.setAttribute("aria-label", "Player title");
  const En = St("input");
  En.maxLength = 80, En.placeholder = "Artist (optional)", En.setAttribute("aria-label", "Player subtitle");
  const Be = St("textarea");
  Be.rows = 3, Be.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Be.setAttribute("aria-label", "Songs");
  const Ze = St("input");
  Ze.inputMode = "numeric", Ze.placeholder = "Cover inscription number (optional), shown when the album loads", Ze.setAttribute("aria-label", "Cover inscription");
  const be = St("select");
  be.setAttribute("aria-label", "Batch album");
  const ae = St("select");
  ae.setAttribute("aria-label", "Plays per copy");
  for (const k of X6) ae.append(Wa(`${k.toLocaleString()} plays`, String(k)));
  ae.append(Wa("Max (1 STX)", "max"));
  const Ge = St("input");
  Ge.type = "number", Ge.min = "1", Ge.max = String(Kl), Ge.value = "10", Ge.setAttribute("aria-label", "Copies");
  const M = St("input");
  M.maxLength = 40, M.placeholder = "Label, e.g. Opera launch", M.setAttribute("aria-label", "Batch label");
  const Et = St("p", "", "ppp-mute"), Gt = () => {
    Et.textContent = Te();
  };
  for (const k of [be, ae, Ge])
    k.oninput = Gt, k.onchange = Gt;
  Gt();
  function ve(k) {
    var wt, et;
    const R = (wt = k.gate) == null ? void 0 : wt.gifts;
    if (!(R != null && R.enabled) || !R.admin || ["off", "elsewhere", "unsupported"].includes(k.step)) return null;
    const G = t.main(), j = [St("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!G)
      j.push(St("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (R.admin) {
      const se = St("div", "", "ppp-gift-admin"), Jt = (Xt, vt) => {
        const Wt = St("label", Xt);
        return Wt.append(vt), Wt;
      }, ie = X(G);
      se.append(
        St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Fe,
        En,
        Be,
        Ze,
        br("Sign and make player", () => void It(G, { title: Fe.value, subtitle: En.value, tracks: Be.value, cover: Ze.value }))
      );
      const me = br("Sign, pay and make links", () => {
        Qt(G, Ct(), M.value.trim(), be.value || void 0);
      });
      me.disabled = !!v;
      const Yt = be.value;
      be.replaceChildren(Wa("No album (starter copies)", ""), ...ie.map((Xt) => Wa(`${Xt.title} · ${Xt.tracks} songs`, Xt.id))), ie.some((Xt) => Xt.id === Yt) && (be.value = Yt), Gt(), se.append(
        St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Jt("Album ", be),
        Jt("Plays each ", ae),
        Jt("Copies ", Ge),
        M,
        Et,
        me
      ), t.now() - Ht > 3e4 && (Ht = t.now(), At(G));
      const Me = H(G);
      if (Me.length) {
        const Xt = St("ul", "", "ppp-gift-list");
        for (const vt of Me.slice(0, 10)) {
          const Wt = vt.view, ue = Wt == null ? void 0 : Wt.copies, fe = vt.error ? vt.error : !Wt || Wt.status === "pending-deposit" ? vt.txid ? "payment confirming…" : "waiting for your payment" : `${ue.claimed} of ${Wt.count} claimed${ue.refunding + ue.refunded ? ` · ${ue.refunded} refunded${ue.refunding ? `, ${ue.refunding} on their way` : ""}` : ""}`, te = St("li");
          if (te.append(St("span", `${vt.label || "Batch"} · ${vt.count} × ${Yn(BigInt(vt.amount))} STX`, "t"), St("span", fe, "ppp-mute")), !vt.txid && vt.depositTo && (!Wt || Wt.status === "pending-deposit") && te.append(br("Pay now", () => void Lt(G, vt.id), "tiny")), vt.codes.length && (Wt == null ? void 0 : Wt.status) === "live") {
            const An = Rt(((et = k.gate) == null ? void 0 : et.radioUrl) ?? null, vt);
            te.append(
              Rr("batch-copy:" + vt.id, "Copy all links", () => An.join(`
`), "tiny", t.changed),
              Rr("batch-csv:" + vt.id, "Copy as CSV", () => ["copy,link", ...An.map((Ye, Br) => `${Br + 1},${Ye}`)].join(`
`), "tiny", t.changed)
            );
          } else vt.codes.length || te.append(St("span", "links were made on another device", "ppp-mute"));
          Xt.append(te);
        }
        se.append(Xt);
      }
      j.push(se);
    }
    return v && j.push(St("p", v, "ppp-cyan")), P && j.push(St("p", P, /✓/.test(P) ? "ppp-ok" : "ppp-warn")), J.replaceChildren(...j), J;
  }
  return { banner: W, funder: ut, renderFold: ve, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: d, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: _ };
}
const J6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function t$(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && e.push({
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
  return e;
}
const e$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function n$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = e$(i);
    return n.every((a) => o.includes(a));
  })()), s = {
    recent: (i, o) => (e.recents[o.slot] ?? 0) - (e.recents[i.slot] ?? 0) || o.slot - i.slot,
    newest: (i, o) => o.slot - i.slot,
    oldest: (i, o) => i.slot - o.slot,
    title: (i, o) => {
      var a, c;
      return (((a = i.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || i.slot - o.slot;
    }
  };
  return r.sort((i, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(i.slot)) || s[e.sort](i, o));
}
function r$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const nf = /* @__PURE__ */ new Set(), Fw = (t) => (nf.add(t), () => {
  nf.delete(t);
}), rf = () => {
  for (const t of [...nf])
    try {
      t();
    } catch {
    }
}, J0 = "xtrata:al-thumb:v1:", jw = "-", jo = 96, s$ = 24 * 1024 * 1024, gn = /* @__PURE__ */ new Map(), tp = /* @__PURE__ */ new Set(), sf = [];
let Yl = !1, ql;
const Dc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(J0 + t);
    window.localStorage.setItem(J0 + t, e);
  } catch {
  }
  return null;
};
function wd(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const i = new Image(), o = setTimeout(() => e(t), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(i.naturalWidth, i.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = jo, s.fillStyle = "#143a40", s.fillRect(0, 0, jo, jo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, jo, jo), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, i.onerror = () => {
        clearTimeout(o), e(t);
      }, i.src = t;
    } catch {
      e(t);
    }
  });
}
async function i$(t) {
  var c, u, d, l, g;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((d = e.body) == null ? void 0 : d.cancel()), "";
  let r = "", s = 0;
  const i = (p) => {
    let x = 0;
    for (; ; ) {
      const E = r.slice(x).search(/<img\b/i);
      if (E < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = x + E, U = r.indexOf(">", C);
      if (U < 0)
        return r = r.slice(C), null;
      const D = r.slice(C, U + 1), S = D.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (S) return S[1].replace(/&amp;/g, "&");
      const O = D.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (O) return "/inscription/" + O[1];
      x = U + 1;
    }
  }, o = (g = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : g.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    s += x.byteLength, r += a.decode(x, { stream: !0 });
    const E = i(!1);
    if (E)
      return await o.cancel(), E;
    if (s > s$)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function o$() {
  if (!Yl) {
    Yl = !0;
    try {
      for (; sf.length; ) {
        const t = sf.shift();
        if (!gn.has(t))
          try {
            const e = await i$(t);
            if (e === null) continue;
            if (!e) {
              gn.set(t, ""), Dc(t, jw), rf();
              continue;
            }
            const n = await wd(e);
            gn.set(t, n), n.startsWith("data:image/jpeg") && Dc(t, n), rf();
          } catch {
          }
      }
    } finally {
      Yl = !1;
    }
  }
}
function Rw(t, e) {
  if (e && !gn.get(t) ? (gn.set(t, e), wd(e).then((r) => {
    r !== e && (gn.set(t, r), r.startsWith("data:image/jpeg") && Dc(t, r), rf());
  })) : e === "" && !gn.has(t) && gn.set(t, ""), gn.has(t)) return gn.get(t);
  const n = Dc(t);
  if (n != null) {
    const r = n === jw ? "" : n;
    return gn.set(t, r), r;
  }
  return tp.has(t) || (tp.add(t), sf.push(t), ql || (ql = setTimeout(() => {
    ql = void 0, o$();
  }, 1200))), "";
}
const Hi = 12, a$ = 5e3, un = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Di = (t, e, n = "") => {
  const r = un("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function c$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = Hi;
  const l = un("div", "", "ppp-shelf-box");
  Fw(() => t.changed());
  const g = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, T) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? T;
    } catch {
      return T;
    }
  }, E = (b) => new Set(x(g(b), []).filter((T) => Number.isSafeInteger(T))), C = (b) => {
    const T = x(p(b), {}), z = {};
    for (const [L, at] of Object.entries(T)) Number.isSafeInteger(Number(L)) && typeof at == "number" && (z[Number(L)] = at);
    return z;
  };
  async function U(b) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let z = 0, L = 0;
        for (let at = 0; at < a$ / 100 + 1; at++) {
          const X = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${z}&limit=100`);
          if (T.push(...t$(X == null ? void 0 : X.shelf)), L = Number(X == null ? void 0 : X.total) || T.length, !(X != null && X.next) || !Number.isSafeInteger(X.next)) break;
          z = X.next;
        }
        b === e && (n = T, r = L, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const D = () => {
    o = -1 / 0;
  }, S = un("input");
  S.type = "search", S.placeholder = "Search title, artist or #", S.setAttribute("aria-label", "Search your albums"), S.oninput = () => {
    a = S.value, d = Hi, t.changed();
  };
  const O = un("select");
  O.setAttribute("aria-label", "Sort albums");
  for (const b of J6) {
    const T = document.createElement("option");
    T.value = b.value, T.textContent = b.label, O.append(T);
  }
  O.onchange = () => {
    c = O.value, d = Hi, t.changed();
  };
  const _ = Di("", () => {
    u = !u, d = Hi, t.changed();
  }, "tiny"), W = un("div", "", "ppp-shelf-tools");
  W.append(S, O, _);
  const ut = un("div"), J = un("div");
  function q(b) {
    const T = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, d = Hi), !T || b.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(T), !n.length)
      return i ? (J.replaceChildren(un("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Di("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(J), l) : null;
    const z = E(T), L = C(T), at = n$(n, { query: a, sort: c, pinnedOnly: u, pins: z, recents: L });
    S.value !== a && (S.value = a), O.value = c, _.textContent = u ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(u));
    const X = [];
    if (b.slot > 0 && X.push(Di("← My player", () => t.open(0), "quiet")), !at.length) X.push(un("p", "No album matches that.", "ppp-mute"));
    else {
      const It = un("ul", "", "ppp-shelf-list");
      for (const $ of at.slice(0, d)) {
        const H = un("li", "", $.slot === b.slot ? "now" : ""), ft = z.has($.slot), ct = Di(ft ? "★" : "☆", () => {
          const Mt = new Set(z);
          ft ? Mt.delete($.slot) : Mt.add($.slot), t.store.set(g(T), JSON.stringify([...Mt])), t.changed();
        }, "tiny");
        ct.setAttribute("aria-label", ft ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const dt = [$.player.subtitle, `${Zs($.player).length} ${Zs($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ht = $.slot === b.slot, At = Di(Ht ? "Playing" : "Select", () => {
          t.store.set(p(T), JSON.stringify(r$({ ...L, [$.slot]: t.now() }))), t.open($.slot);
        }, Ht ? "tiny ppp-pick" : "tiny primary ppp-pick");
        At.disabled = Ht;
        const Lt = Zs($.player)[0], Qt = $.player.cover ?? (Lt == null ? void 0 : Lt.id), Ct = Qt ? Rw(String(Qt)) : "", Te = un("span", "", "ppp-shelf-art");
        if (Ct) {
          const Mt = document.createElement("img");
          Mt.src = Ct, Mt.alt = "", Mt.decoding = "async", Te.append(Mt);
        } else Te.textContent = "💿";
        const Rt = un("span", "", "ppp-shelf-txt");
        Rt.append(un("span", $.player.title, "t"), un("span", dt, "ppp-mute")), H.append(ct, Te, Rt, At), It.append(H);
      }
      X.push(It), at.length > d && X.push(Di(`Show more (${at.length - d} left)`, () => {
        d += Hi, t.changed();
      }, "quiet"));
    }
    return i && X.push(un("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ut.replaceChildren(...X), l.firstChild !== W && l.replaceChildren(W, ut), l;
  }
  return { render: q, invalidate: D, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = C(e), T = [...n].filter((z) => z.player).sort((z, L) => (b[L.slot] ?? 0) - (b[z.slot] ?? 0) || L.slot - z.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const l$ = 20, nn = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, $e = {
  grid: nn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: nn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: nn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: nn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: nn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: nn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: nn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: nn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: nn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: nn('<path d="M6 9l6 6 6-6"/>', 18),
  right: nn('<path d="M9 6l6 6-6 6"/>', 16),
  close: nn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: nn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: nn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: nn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: nn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: nn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const ln = (t, ...e) => Q("button", { type: "button", ...t }, ...e), Za = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Ro = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, u$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, f$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function ep(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(b) {
    var z, L, at;
    if (!b || !Number.isSafeInteger(b)) return "";
    const T = (at = (L = (z = e.radio()) == null ? void 0 : z.getState) == null ? void 0 : L.call(z)) == null ? void 0 : at.albumCover;
    return T != null && T.url && Number(T.tokenId) === b ? T.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (X) => {
      var $, H, ft, ct;
      const It = (X.headers.get("content-type") || "").toLowerCase();
      if (!X.ok)
        throw await (($ = X.body) == null ? void 0 : $.cancel()), new Error("no cover");
      return It.startsWith("image/") ? (await ((H = X.body) == null ? void 0 : H.cancel()), "/inscription/" + b) : It.includes("text/html") ? (((ft = (await X.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : ft[1]) ?? "").replace(/&amp;/g, "&") : (await ((ct = X.body) == null ? void 0 : ct.cancel()), "");
    }).then((X) => {
      c.set(b, X), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  Fw(() => P());
  function l(b) {
    var z;
    i = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const T = document.querySelector(".side");
    if (b && b !== "more") {
      for (const X of f$[b]) {
        const It = T == null ? void 0 : T.querySelector(X);
        It && (It.open = !0);
      }
      const L = document.getElementById("sheetTitle");
      L && (L.textContent = u$[b]);
      const at = document.getElementById("sheetExtra");
      at && at.replaceChildren(...b === "music" ? [p()] : []), (z = T == null ? void 0 : T.scrollTo) == null || z.call(T, { top: 0 });
    }
    P();
  }
  const g = r ? null : document.getElementById("sheetClose");
  g && (g.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const p = () => ln(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: $e.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: $e.right })
  );
  let x = null, E = !1;
  const C = () => {
    var T;
    const b = e.radio();
    E || !(b != null && b.subscribe) || (E = !0, b.subscribe((z) => {
      x = z, (s == null ? void 0 : s.mode) === "open" && P();
    }), x = ((T = b.getState) == null ? void 0 : T.call(b)) ?? null);
  };
  r || setInterval(() => {
    var L, at;
    if ((s == null ? void 0 : s.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (at = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : at.call(L), T = t.querySelector(".al-bar > i"), z = t.querySelectorAll(".al-times span");
    !b || !T || (T.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", z.length === 2 && (z[0].textContent = Za(b.current || 0), z[1].textContent = b.duration ? Za(b.duration) : "–:––"));
  }, 500);
  let U = "", D = null;
  function S(b, T, z = {}) {
    const L = z.song || d(b.cover), X = [L ? Q("img", { src: L, alt: z.song ? "Song artwork" : `${b.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, b.title), b.subtitle ? Q("span", {}, b.subtitle) : null), z.paused ? Q("span", { class: "al-paused" }, Q("i", { html: $e.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], It = "al-cover" + (T ? "" : " al-cover--small") + (z.paused ? " is-paused" : "");
    return z.flip ? (X.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: $e.flip })), ln({ class: It + " is-flippable", "aria-label": z.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: z.flip }, ...X)) : Q("div", { class: It }, ...X);
  }
  function O(b) {
    return b.plays === null || b.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (b.plays <= l$ ? " al-chip--low" : "") }, `${Ro(b.plays, "play", "plays")} left`);
  }
  function _(b) {
    const T = b.player, z = T.tracks.filter((at) => !at.hidden), L = [];
    return b.mode === "arrive" && b.from && L.push(Q("p", { class: "al-from" }, Q("span", { html: $e.gift }), Q("span", {}, Q("b", {}, b.from), " sent you an album"))), L.push(S(T, !0)), L.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, T.title),
      T.subtitle ? Q("p", { class: "al-artist" }, T.subtitle) : null,
      z.length ? Q("p", { class: "al-songline" }, z.map((at) => at.title || `#${at.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Ro(z.length, "song", "songs"), b.offered ? Ro(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && L.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), L.push(Q("div", { class: "al-grow" })), b.asking ? L.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && L.push(ln({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Q("span", { html: $e.playSmall }), b.primary.label)), b.hint && !b.asking && L.push(Q("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && L.push(ln({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), L;
  }
  function W(b, T) {
    const { songs: z, current: L, started: at, own: X, out: It, waiting: $ } = T, H = b.player, ft = e.radio(), ct = [];
    ct.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, H.title), ` · ${Ro(z.length, "song", "songs")}`), O(b)));
    const dt = d(H.cover), Ht = "album:" + H.cover;
    dt && !gn.has(Ht) && (gn.set(Ht, dt), wd(dt).then((Lt) => {
      Lt !== dt && (gn.set(Ht, Lt), P());
    }));
    const At = dt ? gn.get(Ht) || dt : "";
    return ct.push(Q("ol", { class: "al-tracks" }, ...z.map((Lt, Qt) => {
      const Ct = String(Lt.id) === L, Te = Rw(String(Lt.id), Ct && at ? X : void 0);
      return Q("li", {}, ln(
        { class: "al-track" + (Ct ? " is-on" : ""), "aria-label": `Play ${Lt.title || "#" + Lt.id}`, "aria-current": Ct ? "true" : void 0, disabled: It || $, onClick: () => {
          var Rt;
          return (Rt = ft == null ? void 0 : ft.playToken) == null ? void 0 : Rt.call(ft, Lt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Te ? "" : " is-blank") },
          Te ? Q("img", { src: Te, alt: "", decoding: "async" }) : At ? Q("img", { src: At, alt: "", decoding: "async" }) : null,
          Te ? null : Q("span", { class: "al-n" }, String(Qt + 1)),
          Ct ? Q("span", { class: "al-eq", html: $e.eq }) : null
        ),
        Q("span", { class: "al-tt" }, Lt.title || `#${Lt.id}`)
      ));
    }))), ct;
  }
  function ut(b) {
    var Te;
    const T = b.player, z = T.tracks.filter((Rt) => !Rt.hidden), L = e.radio(), at = x == null ? void 0 : x.nowPlaying, X = at && T.tracks.some((Rt) => String(Rt.id) === String(at.tokenId)) ? String(at.tokenId) : null, It = X ? T.tracks.find((Rt) => String(Rt.id) === X) : null, $ = b.plays === 0 && !b.playsComing, H = !!b.playsComing && !b.plays, ft = !!(x != null && x.playing) && !!X, ct = x == null ? void 0 : x.heart, dt = X ? (Te = L == null ? void 0 : L.getPosition) == null ? void 0 : Te.call(L) : null;
    X && (ft || ((dt == null ? void 0 : dt.current) ?? 0) > 0.5) && (U = T.id);
    const Ht = !!X && U === T.id;
    D && D !== X && (D = null);
    const At = Ht ? String((at == null ? void 0 : at.cover) || "") : "", Lt = !!At && D === X, Ct = [S(T, !$, { song: Lt ? "" : At, paused: Ht && !ft, flip: At ? () => {
      D = D === X ? null : X, P();
    } : void 0, flipped: Lt })];
    if (Ct.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, It ? It.title || (at == null ? void 0 : at.title) || `#${It.id}` : T.title),
        Q("div", { class: "al-artist" }, It ? It.artist || (at == null ? void 0 : at.artist) || T.subtitle : T.subtitle || "Press play")
      ),
      X ? ln({ class: "al-icon" + (ct != null && ct.liked ? " is-on" : ""), "aria-label": ct != null && ct.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ct != null && ct.liked)), disabled: !!(ct != null && ct.pending) || !!(ct != null && ct.locked) || H, onClick: () => {
        var Rt;
        return (Rt = L == null ? void 0 : L.toggleLike) == null ? void 0 : Rt.call(L);
      }, html: ct != null && ct.liked ? $e.heartOn : $e.heart }) : null
    )), $)
      Ct.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        J(b, !0)
      ));
    else {
      const Rt = dt != null && dt.duration ? Math.min(100, dt.current / dt.duration * 100) : 0;
      Ct.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Rt}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, Za((dt == null ? void 0 : dt.current) || 0)), Q("span", {}, dt != null && dt.duration ? Za(dt.duration) : "–:––"))
      ));
    }
    return Ct.push(Q(
      "div",
      { class: "al-ctl" + ($ || H ? " is-off" : "") },
      ln({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: $ || H, onClick: () => {
        var Rt;
        return (Rt = L == null ? void 0 : L.prev) == null ? void 0 : Rt.call(L);
      }, html: $e.prev }),
      ln({ class: "al-play", "aria-label": ft ? "Pause" : "Play", disabled: $ || H, onClick: () => {
        var Rt;
        return (Rt = L == null ? void 0 : L.playPause) == null ? void 0 : Rt.call(L);
      }, html: ft ? $e.pause : $e.play }),
      ln({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: $ || H, onClick: () => {
        var Rt;
        return (Rt = L == null ? void 0 : L.next) == null ? void 0 : Rt.call(L);
      }, html: $e.next })
    )), b.status.length && Ct.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), Ct.push(...W(b, { songs: z, current: X, started: Ht, own: At, out: $, waiting: H })), Ct.push(Q("div", { class: "al-grow" })), Ct.push(ln(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: $e.down })
    )), Ct;
  }
  function J(b, T) {
    const z = Q("div", { class: "al-topups" + (T ? " al-topups--primary" : "") }), L = T ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const at of L) {
      const X = b.myPlays !== void 0 && b.myPlays >= at && !b.playsComing && !b.busy;
      z.append(ln({ class: "al-topup", disabled: !X, onClick: () => e.topUp(at) }, T ? `Add ${at.toLocaleString()} plays` : `+${at.toLocaleString()}`));
    }
    return T && z.append(ln({ class: "al-link", onClick: () => l("more") }, "Other amounts")), z;
  }
  function q(b) {
    const T = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), z = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${b.player.title}`), Q("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      J(b, !1),
      Q("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : T ? `Moved from My player · ${Ro(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !T && !b.playsComing && b.myPlays !== void 0 ? ln({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), L = (X, It, $, H) => ln(
      { class: "al-row", onClick: H },
      Q("span", { class: "al-row-i", html: X }),
      Q("span", { class: "al-row-t" }, Q("b", {}, It), Q("small", {}, $)),
      Q("span", { class: "al-row-go", html: $e.right })
    ), at = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      L($e.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), ln({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: $e.close })),
      b.mode === "open" ? z : null,
      Q(
        "div",
        { class: "al-rows" },
        L($e.grid, "My music", "Your albums and the radio", () => l("music")),
        L($e.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? L($e.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        L($e.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        at
      )
    );
  }
  function v(b) {
    var $, H;
    const T = b.player, z = x == null ? void 0 : x.nowPlaying, L = z && T.tracks.some((ft) => String(ft.id) === String(z.tokenId)) ? String(z.tokenId) : null, at = !!(x != null && x.playing) && !!L, X = L ? (H = ($ = e.radio()) == null ? void 0 : $.getPosition) == null ? void 0 : H.call($) : null;
    L && (at || ((X == null ? void 0 : X.current) ?? 0) > 0.5) && (U = T.id);
    const It = !!L && U === T.id;
    return W(b, {
      songs: T.tracks.filter((ft) => !ft.hidden),
      current: L,
      started: It,
      own: It ? String((z == null ? void 0 : z.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function P() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      C(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...v(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    C(), t.hidden = !1;
    const T = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      b.mode === "open" ? ln({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: $e.grid }) : null
    ), z = Q("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? ut(b) : _(b));
    t.replaceChildren(T, z, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), q(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, P();
        return;
      }
      const T = !!s;
      s = b, !b && (T || i) && (i = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, P();
    },
    sheet: () => i,
    setSheet: l
  };
}
const d$ = [
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
function h$(t) {
  for (const [e, n] of d$) if (n.test(t)) return e;
  return null;
}
const zw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Gw = (t) => /Android/.test(t);
function p$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : zw(e) ? "x-safari-" + n.href : Gw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const g$ = (t) => zw(t) ? "Safari" : Gw(t) ? "Chrome" : "your browser", Fi = "Xtrata Music Wallet", y$ = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function np(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Fi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && y$.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Fi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Fi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Fi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Fi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Fi, detail: "Open on this device." });
    }
  return r;
}
const Xl = "xtrata.radio.novice", Kw = "xtrata.radio.novice.previewed.v1", rp = 6 * 6e4;
function w$(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Xl, r), n = r;
    else {
      if (r === "0")
        return e.set(Xl, null), { on: !1, preview: !1 };
      n = e.get(Xl);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const b$ = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, sp = (t) => b$.test(t ?? ""), m$ = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, x$ = {
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
}, S$ = (t, e) => x$[t] ?? e;
function E$(t, e) {
  switch (t) {
    case "fund":
      return e.arriving ? [] : [
        e.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const A$ = "Make your player once, with Face ID or your fingerprint, and the music starts.", v$ = "Checking your player…", of = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Vw(t) {
  try {
    const e = JSON.parse(t.get(Kw) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function k$(t, e) {
  const n = Vw(t).filter((r) => r !== e);
  n.push(e), t.set(Kw, JSON.stringify(n.slice(-50)));
}
function Wl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...of(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : of();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > rp ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > rp ? { ...t, phase: "done" } : t;
  }
}
const Qa = (t) => t.phase === "open" || t.phase === "playing", We = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, ji = (t, e, n, r = !1) => {
  const s = We("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Yw = (t) => t.toLocaleString(), $$ = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle."],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password."],
  ["It keeps your taste", "Your likes become your own station, on a public record no company can take away."]
], Fr = {
  gift: { title: "Your free player is waiting", primary: "Claim my free player", hint: "One tap with Face ID or your fingerprint. No app, no account, no password.", returning: "I already have a player", full: "Look around first" },
  new: {
    title: "Music that pays the artist",
    body: "Every play counts for whoever owns the song. Make your player once and you’re in.",
    primary: "Make my player",
    hint: "One tap with Face ID or your fingerprint. No app, no account, no password.",
    returning: "I’ve listened here before",
    full: "Look around first"
  },
  back: { title: "Welcome back", body: "Unlock your player and carry on listening.", primary: "Unlock my player", hint: "One tap with Face ID or your fingerprint.", returning: "Use a different passkey", full: "Look around first" },
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself." },
  landed: { title: "You’re in", primary: "Start listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, I$ = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Neon, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${Yw(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, L$ = (t) => t ? `Your player holds ${Yw(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", C$ = (t) => t ? `You got a ${t.name} player` : Fr.landed.title;
function T$(t, e = !0) {
  const n = We("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(We("span", "tier-disc__mark", t.mark)), n;
}
function B$(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = We("ul", "al-welcome-points");
    for (const [i, o] of $$) {
      const a = We("li");
      a.append(We("b", "", i), We("span", "", o)), s.append(a);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      if (!s) {
        n && !i && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const o = We("header", "al-top"), a = We("a", "al-brand");
      a.href = "/radio", a.append("Xtrata ", We("b", "", "Music")), o.append(a);
      const c = We("div", "al-body al-body--welcome"), u = We("div", "al-welcome"), d = s.mode;
      if (d === "checking")
        u.append(We("p", "al-welcome-wait", Fr.checking));
      else {
        if (s.tier && (d === "landed" || d === "back" || d === "empty") && u.append(T$(s.tier)), u.append(We("h1", "", d === "landed" ? C$(s.tier) : d === "back" && s.tier ? `Your ${s.tier.name} player` : Fr[d].title)), u.append(We("p", "", d === "gift" ? I$(s.plays, s.from, s.mystery) : d === "landed" ? L$(s.plays) : Fr[d].body)), (d === "landed" || d === "gift") && u.append(r()), s.status.length) {
          const l = We("div", "al-status");
          l.setAttribute("role", "status"), l.append(...s.status), u.append(l);
        }
        if (s.asking) u.append(We("p", "al-hint al-hint--ask", Fr.asking));
        else if (d === "gift" || d === "new" || d === "back") {
          const l = Fr[d];
          s.canStart && u.append(ji("al-primary", l.primary, d === "back" ? s.unlock : s.start, s.busy), We("p", "al-hint", l.hint)), s.canStart && u.append(ji("al-link", l.returning, s.returning, s.busy)), u.append(ji("al-link", l.full, s.full));
        } else d === "landed" ? u.append(ji("al-primary", Fr.landed.primary, s.full)) : d === "empty" && u.append(ji("al-primary", Fr.empty.primary, s.restock), ji("al-link", Fr.empty.full, s.full));
      }
      c.append(u), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
function M$(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const P$ = [100, 250, 500, 1e3], N$ = (t, e = ur) => BigInt(t) * dn(e);
function _$(t, e = ur, n = 0n) {
  const r = $s - t - n;
  return r > 0n ? Number(r / dn(e)) : 0;
}
function U$(t, e = ur, n = 0n) {
  const r = t === void 0 ? 0 : _$(t, e, n);
  return P$.map((s) => ({ plays: s, stx: N$(s, e), fits: t !== void 0 && s <= r }));
}
const O$ = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, H$ = (t) => O$[t.unit](t.amount), Se = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, cc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function D$(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${cc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${cc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${cc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function F$(t) {
  let e = null, n = 0, r = "stx";
  const s = (o) => {
    var c;
    if (o.some((u) => u.plays === n && u.fits)) return;
    const a = o.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var d;
      return u.plays === ((d = o[1]) == null ? void 0 : d.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function i() {
    var p;
    if (!e) return;
    const o = t.input();
    if (!o) {
      e.close();
      return;
    }
    const a = U$(o.balance, o.fee, o.incoming);
    s(a);
    const c = M$(o.switches);
    (p = c.find((x) => x.id === r)) != null && p.on || (r = "stx");
    const u = [], d = Se("h2", "ppp-connect__title", "Add plays");
    d.id = "ppp-restock-title", u.push(d), u.push(Se("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${cc(o.playsLeft, "play", "plays")} left.`));
    const l = D$(o.done);
    if (l && u.push(Se("p", "ppp-restock__done", l)), o.arriving)
      u.push(Se("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(Se("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((x) => x.fits))
      u.push(Se("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const x = Se("div", "ppp-restock__packs");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const D = Se("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        D.type = "button", D.disabled = !U.fits, D.setAttribute("aria-pressed", String(U.plays === n)), D.append(Se("b", "", U.plays.toLocaleString()), Se("span", "", "plays")), D.onclick = () => {
          n = U.plays, i();
        }, x.append(D);
      }
      u.push(x);
      const E = Se("div", "ppp-restock__ways");
      E.setAttribute("role", "group"), E.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const D = Se("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        D.type = "button", D.disabled = !U.on, D.setAttribute("aria-pressed", String(U.id === r)), D.append(Se("b", "", U.label), Se("span", "", U.on ? U.blurb : "Soon")), D.onclick = () => {
          r = U.id, i();
        }, E.append(D);
      }
      u.push(E);
      const C = a.find((U) => U.plays === n);
      if (C && r === "stx") {
        const U = Se("div", "ppp-restock__pay"), D = H$({ unit: "microSTX", amount: C.stx }), S = Se("p", "ppp-restock__amount");
        S.append("Send ", Se("b", "", D), " to your player:"), U.append(S, Se("p", "ppp-addr-full ppp-restock__addr", o.address));
        const O = Se("div", "ppp-restock__row");
        O.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => sr(C.stx), "")), U.append(O), U.append(Se("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(U);
      }
    }
    u.push(Se("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const g = Se("button", "quiet ppp-connect__cancel", "Close");
    g.type = "button", g.onclick = () => e == null ? void 0 : e.close(), u.push(g), e.replaceChildren(...u);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = Se("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
      const o = e;
      o.addEventListener("close", () => {
        o.remove(), e === o && (e = null);
      }), o.addEventListener("click", (a) => {
        a.target === o && o.close();
      }), document.body.appendChild(o), i(), typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: i,
    close() {
      e == null || e.close();
    }
  };
}
const Qo = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "neon", name: "Neon", min: 50, mark: "✺" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], j$ = (t) => typeof t == "string" && Qo.some((e) => e.id === t), R$ = (t) => Qo.find((e) => e.id === t), z$ = (t) => Qo.find((e) => t >= e.min) ?? Qo[Qo.length - 1];
function G$(t, e = ur) {
  return z$(t <= Oe ? 0 : Number((t - Oe) / dn(e)));
}
const ip = document.getElementById("ppp");
ip && K$(ip);
function K$(t) {
  var Us;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = mb(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, m) => {
    const A = await fetch(f, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), h = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${A.status}).`);
    return h;
  }, c = q5({
    now: Date.now,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var A;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((A = m == null ? void 0 : m.find((h) => h.listening === f)) == null ? void 0 : A.main) ?? null;
    },
    saveLink: async (f) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), o.referrerPolicy = "no-referrer";
      const m = new Promise((gt, st) => {
        o.addEventListener("load", () => gt(), { once: !0 }), setTimeout(() => st(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await m;
      const A = new ub({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), V = (gt, st) => h.has(gt) ? A.request(gt, st) : Promise.race([
        A.request(gt, st),
        new Promise((xt, ee) => setTimeout(() => ee(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await V("listening.status"), { request: V };
    },
    chain: {
      verify: I5,
      balance: C5,
      account: L5,
      owner: T5,
      broadcast: B5,
      transaction: M5,
      confirmedNonce: async (f) => {
        const m = await Ts(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (f, m) => _0({ ...m, network: "mainnet", stxAddress: f }),
    deposit: (f, m, A) => new Promise((h, V) => T0({
      recipient: m,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new Zl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (gt) => h(gt.txId || ""),
      onCancel: () => V(new Error("Deposit cancelled. Nothing was sent.")),
      onError: V
    })),
    validate: P5,
    tabLock: (f) => new Promise((m) => {
      const A = navigator.locks;
      if (!(A != null && A.request)) {
        m(!0);
        return;
      }
      A.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (h) => {
        m(!!h), h && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    changed: () => pe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var m, A;
      return u.funder(f, () => D5(f, Ts), !!((A = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), A = m == null ? void 0 : m.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (f, m) => R5(f, (A) => Ts(A), m),
    likesChanged: () => {
      var f, m;
      (m = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || m.call(f);
    },
    likeState: async (f, m) => {
      const A = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(m) })), h = Array.isArray(A == null ? void 0 : A.rows) ? A.rows.find((V) => (V == null ? void 0 : V.id) === m) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((V) => typeof V == "string") : h.liked ? [f] : [] };
    },
    likeSent: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: m } })),
    nameOf: (f) => G(f) ?? void 0,
    likeConfirmed: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: m } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = Q6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, m, A, h) => new Promise((V, gt) => T0({
      recipient: m,
      amount: A.toString(),
      memo: h,
      stxAddress: f,
      network: new Zl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (st) => V(st.txId || ""),
      onCancel: () => gt(new Error("Gift cancelled. Nothing was sent.")),
      onError: gt
    })),
    sign: (f, m) => _0({ ...m, network: "mainnet", stxAddress: f }),
    giftSent: (f, m) => c.giftSent(f, m),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, m, A, h) => {
      d.invalidate(), await c.albumArriving(f, m, A, h);
    } },
    who: (f) => et(f),
    changed: () => pe(c.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), d = c$({
    json: a,
    open: (f) => {
      c.openAlbum(f);
    },
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => pe(c.snapshot())
  }), l = {
    get: (f) => {
      try {
        return localStorage.getItem(f);
      } catch {
        return null;
      }
    },
    set: (f, m) => {
      try {
        m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
      } catch {
      }
    }
  }, g = w$(location.search, l);
  g.on && (document.documentElement.dataset.novice = g.preview ? "preview" : "1");
  const p = (f) => g.on && f.solo, x = g.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), E = x ? document.getElementById("album") : null, C = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, U = E ? ep(E, C) : null, D = "xtrata.radio.tier.v1";
  let S = (() => {
    const f = l.get(D);
    return j$(f) ? R$(f) : null;
  })();
  const O = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function _(f) {
    if (f.listening && f.slot === 0 && ["fund", "ready", "over"].includes(f.step)) {
      let V = null;
      try {
        V = f.gift && !f.gift.player ? G$(BigInt(f.gift.amount)) : null;
      } catch {
        V = null;
      }
      ((V == null ? void 0 : V.id) ?? null) !== ((S == null ? void 0 : S.id) ?? null) && (S = V, l.set(D, V ? V.id : null));
    }
    const m = document.documentElement;
    S ? m.dataset.tier = S.id : delete m.dataset.tier;
    const A = document.querySelector("#ppp .ppp-head h3");
    if (!A) return;
    let h = A.querySelector(".ppp-tier");
    if (!S) {
      h == null || h.remove();
      return;
    }
    h || (h = M("span", "", "ppp-tier"), A.append(h)), h.dataset.tier = S.id, h.textContent = `${S.mark} ${S.name.toUpperCase()} PLAYER`, h.title = `A ${S.name} player from the Xtrata Music giveaway`;
  }
  const W = g.on && E ? B$(E) : null, ut = Date.now();
  let J = !1, q = null, v = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const P = () => {
    v = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    pe(c.snapshot());
  }, b = (f, m) => {
    var V;
    if (!W || m || v) return null;
    if (!f.gate || f.step === "loading" || (J = !0), !J) return Date.now() - ut < 1e4 ? "checking" : null;
    if (!p(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const h = f.slot === 0 && !((V = f.gift) != null && V.player) && !f.entries.some((gt) => gt.kind === "play");
    return f.step === "fund" && h ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && h && (q === "arriving" || q === "landed") ? "landed" : f.step === "loading" && q !== "checking" ? q : null;
  };
  function T(f, m, A = [], h) {
    if (!W) return;
    const V = h !== void 0 ? h : b(f, m);
    if (q = V, delete document.documentElement.dataset.noviceBoot, !V) {
      W.render(null, m);
      return;
    }
    const gt = [...A];
    V === "arriving" && f.arrival && gt.push(zn(f.arrival)), f.step === "unsupported" ? gt.push(M("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && gt.push(M("p", f.error, "ppp-warn"));
    const st = V === "gift" ? u.incomingStarter() : null;
    W.render({
      mode: V,
      status: gt,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !j,
      plays: st ? st.plays : V === "landed" ? f.playsLeft : null,
      from: (st == null ? void 0 : st.from) ?? null,
      tier: S,
      mystery: O,
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => L.open(),
      full: () => {
        var Pe, je, $t;
        const xt = window.XtrataRadio, ee = V === "landed" && !((je = (Pe = xt == null ? void 0 : xt.getState) == null ? void 0 : Pe.call(xt)) != null && je.playing);
        P(), ee && (($t = xt == null ? void 0 : xt.playPause) == null || $t.call(xt));
      }
    });
  }
  W && setTimeout(() => {
    J || pe(c.snapshot());
  }, 10100);
  const L = F$({
    input: () => {
      var V, gt, st, xt;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const m = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (V = f.likeFunds) == null ? void 0 : V.balance };
      if (!m.address) return null;
      const A = f.slot === 0 ? f.entries : [], h = A.filter((ee) => ee.kind === "play" && ee.status === "confirmed");
      return {
        playsLeft: m.balance === void 0 ? null : Ze(m.balance),
        balance: m.balance,
        incoming: 0n,
        fee: BigInt(((gt = f.gate) == null ? void 0 : gt.limits.playFee) ?? "300"),
        address: m.address,
        switches: ((st = f.gate) == null ? void 0 : st.restock) ?? {},
        done: h.length ? { plays: h.length, artists: new Set(h.map((ee) => ee.recipient)).size, likes: A.filter((ee) => ee.kind === "like" && ee.status === "confirmed" && ee.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((xt = f.likeFunds) != null && xt.pending)
      };
    },
    copyButton: (f, m, A, h) => Rr(f, m, A, h, () => {
      pe(c.snapshot());
    })
  }), at = document.getElementById("albumList"), X = at ? ep(at, C, { list: !0 }) : null, It = "xtrata.radio.album.last.v1", $ = () => {
    try {
      const f = JSON.parse(localStorage.getItem(It) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let H = "";
  const ft = (f) => {
    const m = JSON.stringify(f);
    if (m !== H) {
      H = m;
      try {
        localStorage.setItem(It, m);
      } catch {
      }
    }
  };
  let ct = null;
  window.XtrataRadioLikeHandler = (f) => {
    var A;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (A = c.snapshot().likeFunds) != null && A.album && (on = !0), Yt();
    const m = Me(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let dt;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const Ht = (f) => {
    var A, h;
    const m = window.XtrataRadioListeningIdentity();
    m !== dt && (dt = m, (h = (A = window.XtrataRadio) == null ? void 0 : A.refreshLikes) == null || h.call(A));
  };
  let At = of(), Lt = null;
  const Qt = (f) => {
    const m = g.preview && !j && f.step === "intro" ? u.incomingAlbum() : null;
    return m ? (At = Wl(At, { kind: "offer", album: m.player.id, already: Vw(l).includes(m.player.id) }), Qa(At) ? m.player : null) : (At = Wl(At, { kind: "withdraw" }), null);
  }, Ct = (f) => {
    const m = At.phase;
    At = Wl(At, f), At.phase !== m && (At.album && (At.phase === "playing" || At.phase === "done") && k$(l, At.album), pe(c.snapshot()));
  };
  setInterval(() => {
    At.phase === "playing" && Ct({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Te = "", Rt, Mt = !1, pn = !1;
  const he = (f, m) => {
    var $t, Ne, Kt, Bn, an, ke, Je, y;
    const A = window.XtrataRadio;
    if (!(A != null && A.setGiftPlayer) || !(A != null && A.setGiftStop)) return;
    const h = m.depositPending && f.step === "fund" && (($t = f.giftStop) == null ? void 0 : $t.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, V = Lt, gt = h ? p(f) ? S$(h.reason, h.text) : h.text : null, st = V ? null : gt ?? (e && (!((Ne = f.gate) != null && Ne.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    st && st !== Rt && (A.setGiftStop(st), Rt = st);
    const xt = f.step === "off" || f.step === "elsewhere" ? null : ((Kt = f.gift) == null ? void 0 : Kt.player) ?? V ?? null, ee = xt ? xt.id + ":" + xt.cover + ":" + xt.tracks.map((I) => I.id).join(",") : "";
    ee !== Te && (A.setGiftPlayer(xt ? { id: xt.id, title: xt.title, subtitle: xt.subtitle, tracks: Zs(xt).map((I) => I.id), hidden: ((Bn = q6(xt)) == null ? void 0 : Bn.id) ?? null, cover: xt.cover } : null), Te = ee), st !== Rt && (A.setGiftStop(st), Rt = st);
    const Pe = (h == null ? void 0 : h.reason) === "arriving";
    Pe !== pn && ((an = A.setGiftWait) == null || an.call(A, Pe), pn = Pe);
    const je = !!xt && (!!V || !!((ke = f.albumLock) != null && ke.locked));
    je !== Mt && ((Je = A.setGiftLock) == null || Je.call(A, je), Mt = je), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((y = A.forgetWallets) == null || y.call(A));
  };
  let on = !1;
  const Sn = /* @__PURE__ */ new Map(), Fe = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((h) => h.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let A = Sn.get(f.listening);
    return A === void 0 && (A = Date.now(), Sn.set(f.listening, A)), Date.now() - A < Uc ? A : null;
  }, En = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((m) => m.kind === "play") && !!f.listening && Sn.has(f.listening), Be = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", Ze = (f) => {
    const m = c.snapshot().playCost || 350n;
    return f > Oe ? Number((f - Oe) / m) : 0;
  }, be = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), ae = (f) => {
    const m = Math.round((Date.now() - f) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, Ge = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, M = (f, m = "", A = "") => {
    const h = document.createElement(f);
    return m && (h.textContent = m), A && (h.className = A), h;
  }, Et = (f, m, A = "") => {
    const h = M("button", f, A);
    return h.type = "button", h.onclick = m, h;
  }, Gt = (f, m) => {
    const A = M("a", f);
    return A.href = m, A.target = "_blank", A.rel = "noopener", A;
  };
  let ve = null, Jn = location.hash === "#give";
  Jn && history.replaceState(null, "", location.pathname + location.search);
  let k = !1;
  const R = B6((f) => T6({ address: f, network: "mainnet" }), () => pe(c.snapshot())), G = (f) => R.get(f), j = h$(navigator.userAgent), wt = (f, m) => {
    const A = navigator.userAgent, h = g$(A), V = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, gt = [M("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your ${g.on ? "player" : "listening wallet"}${m ? g.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], st = M("div", "", "ppp-open-row"), xt = p$(V, A);
    if (xt) {
      const ee = M("a", `Open in ${h}`, "primary ppp-open-in");
      ee.href = xt, ee.dataset.homeAction = "radio:open-in-browser", st.append(ee);
    }
    return st.append(Rr("copy-page-link", "Copy link", () => V, xt ? "" : "primary", () => pe(c.snapshot()))), gt.push(st, M("p", `If that does not open ${h}, use ${f}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), gt;
  }, et = (f) => G(f) ?? Be(f), se = (f) => f.slice(0, 2).map(et).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), Jt = /* @__PURE__ */ new Map();
  let ie = !1;
  const me = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), Yt = () => {
    ie || (ie = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const m of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const A = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(A) && Jt.set(A, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      pe(c.snapshot());
    }).catch(() => {
      ie = !1;
    }));
  }, Me = (f, m) => {
    const A = Jt.get(f), h = P6(f, [A == null ? void 0 : A.title, m == null ? void 0 : m.title].find((gt) => !me(gt)) || ""), V = M6(f, (A == null ? void 0 : A.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: h, artist: V };
  }, Xt = (f) => {
    const { title: m, artist: A } = Me(f.song, f);
    return m ? `“${m}”${A ? ` — ${A}` : ""}` : `Song #${f.song}${A ? ` — ${A}` : ""}`;
  }, vt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Wt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ue(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function fe(f, m, A = "", h) {
    const V = M("dt", f), gt = M("dd", m, A);
    return h && gt.append(" ", h), [V, gt];
  }
  const te = document.getElementById("ppp-top"), An = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ye = () => {
    var m;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, Br = () => {
    var m, A;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Ye();
      return;
    }
    if (f.step === "elsewhere" && ((m = f.gate) != null && m.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((A = f.giftStop) == null ? void 0 : A.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      L.open();
      return;
    }
    An();
  };
  te && (te.onclick = Br);
  const Xr = (f, m, A, h = "") => f.standIn && !f.mainConnected ? Et(`Connect ${et(f.standIn)} to add STX`, Ye, h) : Et(m, A, h), Fn = (f) => {
    c.useLinked(f).then(() => An());
  };
  let Qe = null;
  const ki = () => {
    const f = np(c.snapshot(), et);
    return f.length ? Qe || (Qe = new Promise((m) => {
      var je;
      const A = M("dialog", "", "ppp-connect");
      A.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const V = ($t) => {
        h = $t, A.close();
      };
      A.addEventListener("close", () => {
        A.remove(), Qe = null, m(h);
      }), A.addEventListener("click", ($t) => {
        $t.target === A && V(null);
      });
      const gt = ($t, Ne, Kt, Bn, an = !1) => {
        const ke = M("button", "", "ppp-connect__opt " + Kt);
        return ke.type = "button", ke.disabled = an, ke.onclick = Bn, ke.append(M("b", $t), M("span", Ne)), ke;
      }, st = M("h2", "Connect", "ppp-connect__title");
      st.id = "ppp-connect-title";
      const xt = f.map(($t) => gt($t.label, $t.detail, "is-music", () => {
        if (V("music"), $t.action === "linked" && $t.main) {
          Fn($t.main);
          return;
        }
        const Ne = np(c.snapshot(), et).find((Kt) => Kt.action !== "linked");
        (Ne == null ? void 0 : Ne.action) === "create" ? c.create() : (Ne == null ? void 0 : Ne.action) === "unlock" && c.unlock(), An();
      }, !!$t.disabled)), ee = gt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => V("stacks")), Pe = Et("Cancel", () => V(null), "quiet ppp-connect__cancel");
      A.append(st, ...xt, ee, Pe), document.body.appendChild(A), A.showModal(), (je = xt.find(($t) => !$t.disabled)) == null || je.focus();
    }), Qe) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = ki;
  function So(f) {
    if (!te) return;
    const m = (h, V, gt) => {
      te.hidden = !1, te.className = "ppp-top" + (V ? " is-" + V : ""), te.replaceChildren(M("span", "", "dot"), document.createTextNode(h)), te.title = gt;
    }, A = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        te.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        te.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${et(f.linked)}`, "warn", `This device's listening wallet belongs to ${et(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(f.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return f.payingOn && A > 0 && !f.giftStop ? m(`${A.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const kt = document.getElementById("pppNudge"), qe = document.getElementById("onair");
  (Us = kt == null ? void 0 : kt.querySelector("button")) == null || Us.addEventListener("click", () => Br());
  const vn = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, $i = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  };
  function Ii(f) {
    if (f.step === "loading") return;
    const m = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, A = f.step === "ready" && f.payingOn && m > 0 && !f.giftStop, h = f.step === "fund" && f.depositPending, V = f.step === "elsewhere" && !e, gt = A || h || V ? "" : vn[f.step] ?? "", st = A ? "on" : V ? "free" : gt ? "off" : "";
    st ? document.documentElement.dataset.ppp = st : delete document.documentElement.dataset.ppp, qe && (qe.hidden = !st || st === "free", qe.querySelector(".onair-sub").textContent = A ? `${m.toLocaleString()} plays left` : "Plays off"), kt && (kt.hidden = st !== "off" && st !== "free", kt.classList.toggle("is-free", st === "free"), st === "free" ? (kt.querySelector(".nudge-t").textContent = "You’re on the free player", kt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", kt.querySelector("button").textContent = "Get a player") : st === "off" && (kt.querySelector(".nudge-t").textContent = gt, kt.querySelector(".nudge-s").textContent = p(f) ? f.step === "intro" ? A$ : "" : "This radio requires a funded listening wallet with music support on.", kt.querySelector("button").textContent = $i[f.step] ?? "Start"));
  }
  let Tn = "";
  function fr(f) {
    const m = M("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && m.append(M("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && m.append(M("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const A = M("input");
    A.type = "text", A.placeholder = "SP… address to send returns to", A.autocomplete = "off", A.spellcheck = !1, A.setAttribute("aria-label", "Address to return funds to"), A.value = Tn, A.oninput = () => {
      Tn = A.value;
    };
    const h = Et(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(A.value), Tn = "";
    }, "tiny");
    return m.append(A, " ", h), f.returnToKind === "chosen" && m.append(" ", Et("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const jn = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Rn() {
    const f = M("p", jn + " ", "ppp-mute");
    return f.append(Gt("Xverse", "https://www.xverse.app/download"), " · ", Gt("Leather", "https://leather.io/install-extension")), f;
  }
  let Wr = "";
  const Eo = (f) => {
    const m = document.documentElement, A = f.solo && !f.main ? f.listening ? Be(f.listening) : "new" : "", h = J5() ? "1" : "", V = f.standIn && !f.mainConnected ? et(f.standIn) : "";
    `${A}|${h}|${V}` !== Wr && (Wr = `${A}|${h}|${V}`, A ? m.dataset.pppSolo = A : delete m.dataset.pppSolo, V ? m.dataset.pppAs = V : delete m.dataset.pppAs, h ? m.dataset.pppWalletInstalled = h : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => pe(c.snapshot()), f);
  function Li(f, m = "") {
    const A = M("div", "", "ppp-topup"), h = Ci(f);
    A.append(M("span", "Add plays from My player: ", "ppp-mute"));
    for (const V of ac) {
      const gt = Et(`+${V.toLocaleString()}`, () => void c.topUpAlbum(V), m);
      gt.disabled = h === void 0 || h < V || f.depositPending || !!f.busy, A.append(gt);
    }
    return h !== void 0 && h < ac[0] && A.append(M("p", "My player needs plays first (switch to My player above).", "ppp-mute")), A;
  }
  const Ci = (f) => {
    var h;
    const m = (h = f.likeFunds) == null ? void 0 : h.balance;
    if (m === void 0 || !f.playCost) return;
    const A = m - Oe - 6000n;
    return A > 0n ? Number(A / f.playCost) : 0;
  };
  function Ao(f) {
    const m = f.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || (on = !1), m.low && !on) return [];
    const A = M("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const V = M("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && V.append(Gt("View", Ge(m.txid))), A.append(V), [A];
    }
    A.append(M("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), A.append(M("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), A.append(M("p", m.address, "ppp-addr-full"));
    const h = M("div", "", "ppp-open-row");
    if (h.append(Rr("copy-likes-address", "Copy address", () => m.address, "primary", () => pe(c.snapshot()))), m.main && !f.solo) {
      const V = $s - (m.balance ?? 0n);
      V > 0n && h.append(Xr(f, `Pay ${sr(V)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return A.append(h), A.append(M("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  const zn = (f) => {
    const m = M("div", "", "ppp-wait");
    m.dataset.since = String(f.since), m.dataset.grace = String(f.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const A = M("p", "", "ppp-wait-t"), h = M("div", "", "ppp-wait-track");
    return h.append(M("div", "", "ppp-wait-fill")), m.append(A, h), kn(m), m;
  };
  function kn(f) {
    const m = Number(f.dataset.since), A = Number(f.dataset.grace) || 6e4, h = Math.max(0, Date.now() - m), V = f.querySelector(".ppp-wait-fill"), gt = f.querySelector(".ppp-wait-t");
    if (h < A) {
      const st = Math.ceil((A - h) / 1e3);
      V.style.width = Math.max(4, Math.min(95, h / A * 100)).toFixed(0) + "%", gt.textContent = `Your plays are arriving… usually about a minute · ${st}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(h / A * 100)));
    } else
      V.style.width = "", gt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Ti = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Ti = 0;
      return;
    }
    f.forEach(kn), ++Ti % 10 === 0 && pe(c.snapshot());
  }, 1e3);
  let Zr = null;
  function vo(f) {
    if (f.step === "loading" && Zr !== null) return;
    const A = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    A !== Zr && (Zr = A, A ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function pe(f) {
    var tn, Kn, en, Co, _r, To, Bo, Mo, Mi, Hs, bd, md, xd, Sd, Ed;
    if (ct && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const Y = ct;
      ct = null, f.root === Y.root && f.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const m = u.inProgress(f), A = Fe(f), h = m && f.step === "fund" ? { ...f, depositPending: !0 } : A !== null ? { ...f, depositPending: !0, arrival: { since: A, graceMs: Uc } } : f, V = h.error === Oc;
    if (Ht(), _(f), Lt = Qt(f), he(f, h), vo(h), Eo(h), !m && u.inProgress(f)) return;
    if (So(h), Ii(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? g.on ? v$ : "Checking your listening wallet…" : g.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden) {
      T(h, !1);
      return;
    }
    const [gt, st] = ue(h), xt = s(".ppp-state");
    xt.textContent = gt, xt.className = "ppp-state" + (st ? " ppp-state--" + st : ""), xt.hidden = !gt;
    const ee = !!h.busy || h.armed, Pe = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (ee || !["intro", "loading"].includes(h.step));
    i.hidden = !Pe, i.classList.toggle("ppp-frame--rest", !ee && !k);
    const je = s(".ppp-frame-label");
    je.hidden = !0;
    const $t = X5(h) ?? ve;
    ve = $t;
    const Ne = "xtrata.radio.ppp.heard.v1", Kt = (() => {
      try {
        return localStorage.getItem(Ne) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Kt && h.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(Ne, "1");
      } catch {
      }
    const Bn = Kt || h.slot > 0 && ((((tn = h.likeFunds) == null ? void 0 : tn.balance) ?? 0n) > 0n || d.count() > 1), an = p(h), ke = !an && Z5({ ...h, heard: Bn }, $t);
    s(".ppp-badge").hidden = !ke;
    const Je = s(".ppp-steps"), y = s(".ppp-stage");
    Je.hidden = y.hidden = !ke, $t && ke && (Je.replaceChildren(...ef(h.solo).map((Y, lt) => {
      const Tt = M("li", "", lt < $t.at ? "done" : lt === $t.at ? $t.blocked ? "now blocked" : "now" : "");
      return Tt.append(M("span", lt < $t.at ? "✓" : String(lt + 1), "n"), Y), lt === $t.at && Tt.setAttribute("aria-current", "step"), Tt;
    })), y.textContent = $t.caption, y.className = "ppp-stage " + ($t.at >= ef(h.solo).length ? "ppp-ok" : $t.blocked ? "ppp-bad" : "ppp-cyan"));
    const I = s(".ppp-facts"), K = [];
    h.main && ((Kn = h.gate) != null && Kn.here) && !h.solo && K.push(...fe("Your wallet", et(h.main), "ppp-addr-short"));
    const nt = () => {
      if (!h.listening) return;
      const Y = Rr("copy-listening", "Copy", () => h.listening || "", "tiny", () => pe(c.snapshot()));
      K.push(...fe(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", Be(h.listening), "ppp-addr-short", Y));
    };
    if (h.linked || nt(), h.listening && h.step !== "intro")
      if (h.linked)
        K.push(...fe("Credited to", `${et(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), nt();
      else if (h.solo) {
        h.creditedTo && K.push(...fe("Credited to", `${et(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${et(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        K.push(...fe("Returns go to", h.gift ? Y : h.returnTo && !G(h.returnTo) ? Y.replace(Be(h.returnTo), h.returnTo) : Y, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else K.push(...fe("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((en = h.gate) != null && en.here)) {
      const Y = h.linkedListening.map((lt) => Be(lt) + (lt === h.listening ? " (this one)" : "")).join(", ");
      K.push(...fe(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const Y = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      K.push(...fe("Balance", `${sr(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, Y));
    }
    const mt = h.entries.find((Y) => Y.kind === "play");
    mt && Yt(), mt && K.push(...fe("Last paid song", `${Xt(mt)} → ${et(mt.recipient)}`, vt[mt.status] || "")), I.replaceChildren(...K), I.hidden = !K.length;
    const N = [], tt = [], it = [], pt = [], Dt = dn(BigInt(((Co = h.gate) == null ? void 0 : Co.limits.playFee) ?? "300")), Re = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${sr(Nc)} STX to the song holder, plus a ${sr(Dt - Nc)} STX network fee.`, cn = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (N.push(M("p", "Pay artists as you listen.")), (_r = h.gate) != null && _r.radioUrl) {
          const lt = M("p");
          lt.append(Gt("Open the pay-per-play radio →", h.gate.radioUrl)), N.push(lt);
        }
        tt.push(M("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const lt = [h.linked, ...h.others];
          N.push(M("p", lt.length > 1 ? `This device has listening wallets for ${se(lt)}.` : `This device has a listening wallet for ${et(h.linked)}.`)), tt.push(M("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), lt.slice(0, 3).forEach((Tt, xe) => it.push(Et(`Open ${et(Tt)}`, () => Fn(Tt), xe === 0 ? "primary" : "")));
        } else
          N.push(M("p", "Connect your wallet to pay artists as you listen.")), tt.push(M("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        N.push(M("p", `This device's listening wallet belongs to ${et(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), tt.push(M("p", `You are connected as ${et(h.main)}. Switch to the linked wallet to continue listening.`)), tt.push(M("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), it.push(Et("Switch wallet", Ye, "primary"));
        break;
      case "not-invited":
        N.push(M("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        N.push(M("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        N.push(M("p", "Every play counts for the song’s owner, on-chain.")), tt.push(M("p", Re)), tt.push(M("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), tt.push(M("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (N.push(M("p", `This device already has a listening wallet for ${se(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), tt.push(M("p", `Otherwise, set up a new listening wallet for ${et(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && tt.push(M("p", `This is the listening wallet for ${et(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && tt.push(M("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = u.liveGift();
        it.push(Et(Y ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${et(h.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !h.solo && h.main && h.others.length && it.push(Et("Switch wallet", Ye)), !Y && h.solo && it.push(Et("I have a Stacks wallet", Ye)), it.push(Et("I already have a listening wallet", () => void c.unlock(!0))), Y && it.push(Et("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (N.push(M("p", "Locked.", "ppp-mute")), it.push(Et("Unlock", () => void c.unlock(), "primary"))), h.standIn ? pt.push(Et("Use a different listening wallet", () => void ki().then((lt) => {
          lt === "stacks" && Ye();
        }), "quiet")) : pt.push(Et("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        N.push(M("p", `Link to ${et(h.main)} · free`)), tt.push(M("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), tt.push(M("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), it.push(Et(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        N.push(M("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && N.push(zn(h.arrival)) : En(h) ? N.push(M("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (To = h.gift) != null && To.player ? N.push(M("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? N.push(M("p", "No plays left · add plays to keep counting", "ppp-bad")) : N.push(M("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Dt)).toLocaleString()} plays`)), h.entries.length && tt.push(M("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && tt.push(M("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? tt.push(M("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? tt.push(M("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (tt.push(M("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), tt.push(M("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && it.push(Rr("copy-address", "Copy my address", () => h.listening || "", "primary", () => pe(c.snapshot())))) : tt.push(M("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const lt = M("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          lt.append(Gt("View", Ge(h.depositTxid))), N.push(lt);
        } else h.allowance > 0n && !h.solo && !h.depositPending && it.push(Xr(h, `Deposit ${sr(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        N.push(M("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (N.push(M("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), N.push(fr(h))), (!h.solo || h.returnTo) && it.push(Et("Return excess", () => void c.returnFunds("excess"), "primary"), Et("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((Bo = h.giftStop) == null ? void 0 : Bo.reason) !== "off") {
          const lt = Math.min(h.session.playsLeft, h.playsLeft);
          N.push(M("p", `${lt.toLocaleString()} plays left`, "ppp-ok")), tt.push(M("p", Re + " The heart likes or unlikes from this wallet for 0.0002 STX.")), it.push(Et("Switch off", () => void c.switchOff()));
        } else
          N.push(M("p", "Switch on music support to listen.", "ppp-mute")), it.push(Et("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && N.push(M("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && N.push(M("p", "Running low on plays", "ppp-warn")), h.depositPending ? N.push(M("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && it.push(Xr(h, `Top up ${sr(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.listening && !h.depositPending) {
      const Y = h.step === "fund", lt = h.step === "ready" && (h.balanceState === "low" || !!h.gift && h.giftPlays <= 20);
      Y ? it.unshift(Et("Add plays", () => L.open(), "primary")) : lt ? it.push(Et("Add plays", () => L.open(), "primary")) : h.step === "ready" && pt.push(Et("Add plays", () => L.open(), "quiet"));
    }
    if (h.solo && h.walletCannotSolo && tt.push(M("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && tt.push(fr(h)), tt.push(Rn()), h.slot === 0 && h.step === "ready" && h.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = M("p", "New to Stacks? ", "ppp-mute");
      Y.append(Gt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), N.push(Y);
    }
    if (h.walletOutdated && tt.push(M("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (N.push(M("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), it.push(Et("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && pt.push(Et(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${et(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((Mo = h.gift) != null && Mo.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && pt.push(Li(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && pt.push(Et("Lock", () => void c.lock(), "quiet")), Pe && !ee && pt.push(Et(k ? "Hide listening wallet box" : "Show listening wallet box", () => {
      k = !k, pe(c.snapshot());
    }, "quiet")), [...it, ...pt].forEach((Y) => Y.disabled = cn), cn && (it.length = 0), !an && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((Mi = h.gift) != null && Mi.player)) {
      const Y = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", lt = N.at(0);
      h.step === "ready" && lt ? lt.append(M("span", ` · ${be(h.balance)} STX`, Y)) : N.push(M("p", `Balance ${be(h.balance)} STX`, Y));
    }
    if (an) {
      for (const Tt of [...it, ...pt]) {
        const xe = m$[Tt.textContent ?? ""];
        xe && (Tt.textContent = xe);
      }
      for (let Tt = N.length - 1; Tt >= 0; Tt--) sp(N[Tt].textContent) && tt.unshift(...N.splice(Tt, 1));
      for (let Tt = it.length - 1; Tt >= 0; Tt--) sp(it[Tt].textContent) && pt.unshift(...it.splice(Tt, 1));
      const Y = h.entries.some((Tt) => Tt.kind === "play"), lt = E$(h.step, { played: Y, arriving: h.depositPending });
      lt.length && N.length && lt.shift(), N.push(...lt.map((Tt) => M("p", Tt, "ppp-mute")));
    }
    if ((Hs = h.gift) != null && Hs.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const Y = M("p", "", "ppp-gift");
      Y.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && Y.append(" · ", h.gift.player.subtitle);
      const lt = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? M("span", " · plays on their way", "ppp-warn") : M("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      lt && Y.append(lt);
      const Tt = (bd = N.at(0)) == null ? void 0 : bd.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && Tt && /STX/.test(Tt.textContent ?? "") && Tt.remove(), N.unshift(Y), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          N.splice(1, 0, M("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Li(h, "primary"));
        else {
          const xe = M("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          xe.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), xe.append(Gt("Xverse", "https://www.xverse.app/download"), " and ", Gt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), N.splice(1, 0, xe);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const Y = h.returnPlan, lt = M("div", "", "ppp-pick");
      lt.append(M("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Tt = M("ul", "", "ppp-gift-list");
      Y.steps.forEach((xe, Po) => {
        const Qr = xe.kind === "gift" ? "the unused gift" : xe.kind === "deposit" ? "what was added to it" : "the rest", $n = M("li");
        $n.append(M("span", `${Po + 1}. ${sr(BigInt(xe.send))} STX · ${Qr}`, "t"), M("span", xe.to ? ` → ${et(xe.to)}` : " → choose an address below", xe.to ? "ppp-mute" : "ppp-warn")), Tt.append($n);
      }), lt.append(Tt), Y.kept && lt.append(M("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((xe) => !xe.to) && lt.append(fr(h)), lt.append(Et(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), N.push(lt);
    }
    const _e = Ns(h), Ke = x ? _e : null, Gn = b(h, !!Ke), gl = Gn === "gift" || Gn === "arriving" || Gn === "new", ko = u.banner(f, { bare: !!Ke || Gn === "gift" || Gn === "arriving" }), Os = j && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? wt(j, u.pendingCode()) : [];
    Ke || (N.unshift(...ko), N.push(...Ao(h)), N.unshift(...Os)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && N.unshift(M("p", `This is ${et(h.creditedTo)}'s listening wallet. Plays and likes count for ${et(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...N);
    const $o = document.querySelector(".ppp-switch");
    if ($o) {
      const Y = d.latest(), lt = h.slot > 0, Tt = ["fund", "ready", "over"].includes(h.step) && (lt || !!Y);
      if ($o.hidden = !Tt, Tt) {
        const xe = ($n, ma, xa, yl) => {
          const Pi = Et("", yl, "ppp-tab");
          return Pi.setAttribute("aria-pressed", String(xa)), Pi.append(M("span", $n, "tt"), M("span", ma === void 0 ? "…" : `${Ze(ma).toLocaleString()} plays`, "ts")), Pi.disabled = !!h.busy, Pi;
        }, Po = lt ? ((xd = (md = h.gift) == null ? void 0 : md.player) == null ? void 0 : xd.title) ?? "Album" : Y.title, Qr = Et("View all albums" + (d.count() > 1 ? ` (${d.count()})` : ""), () => {
          const $n = document.querySelector(".ppp-shelf");
          $n && ($n.hidden = !1, $n.open = !$n.open, Qr.setAttribute("aria-expanded", String($n.open)), $n.open && requestAnimationFrame(() => $n.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Qr.setAttribute("aria-expanded", String(!!((Sd = document.querySelector(".ppp-shelf")) != null && Sd.open))), $o.replaceChildren(
          xe("🎧 My player", lt ? (Ed = h.likeFunds) == null ? void 0 : Ed.balance : h.balance, !lt, () => {
            lt && c.openAlbum(0);
          }),
          xe("💿 " + Po, lt ? h.balance : void 0, lt, () => {
            !lt && Y && c.openAlbum(Y.slot);
          }),
          Qr
        );
      }
    }
    const Pr = d.render(h), Bi = document.querySelector(".ppp-shelf");
    if (Bi) {
      Bi.hidden = !Pr;
      const Y = Bi.querySelector("summary");
      Y && (Y.textContent = d.count() > 0 ? `♪ My albums (${d.count()})` : "♪ My albums");
      const lt = Bi.querySelector(".ppp-shelf-body");
      Pr && lt && !lt.contains(Pr) && lt.replaceChildren(Pr);
    }
    const Nr = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !Nr, Nr && !s(".ppp-gift-body").contains(Nr) && s(".ppp-gift-body").replaceChildren(Nr), Nr && Jn) {
      Jn = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Io = document.querySelector("#ppp .ppp-yours");
    if (Io) {
      const Y = h.solo && !!h.listening && h.slot === 0 && ["fund", "ready"].includes(h.step);
      Io.hidden = !Y;
      const lt = Io.querySelector(".ppp-yours-body");
      if (Y && lt && lt.getAttribute("data-for") !== h.listening) {
        lt.setAttribute("data-for", h.listening);
        const Tt = (yl, ...Pi) => {
          const Ad = M("details", "", "ppp-yours-item");
          return Ad.append(M("summary", yl), ...Pi), Ad;
        }, xe = M("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        xe.append(M("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Po = M("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Qr = M("p");
        Qr.append(Gt("Find a name at BNS One →", "https://bns.one"));
        const $n = M("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), ma = M("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), xa = M("p");
        xa.append(Gt("See the giveaway →", "https://xtrata.xyz/giveaway")), lt.replaceChildren(
          Tt("Give your player a name", xe, Po, M("p", h.listening, "ppp-addr-full"), Rr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => pe(c.snapshot())), Qr),
          Tt("Link it to a wallet you already have", $n),
          Tt("Bring a friend in", ma, xa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...tt), s(".ppp-actions").replaceChildren(...it), s(".ppp-actions2").replaceChildren(...pt);
    const Lo = h.busy || h.message || "", w = s(".ppp-msg"), B = Lo && N.some((Y) => (Y.textContent ?? "").startsWith(Lo.replace(/[.✓\s]+$/, ""))) ? "" : Lo, F = !B && !h.error ? h.notice : V && !B ? h.error : "";
    w.textContent = B || F, w.classList.toggle("is-warn", !!F), s(".ppp-err").textContent = V ? "" : h.error;
    const ht = h.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...ht.slice(0, 5).map((Y) => {
      const lt = M("li"), Tt = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return lt.append(M("span", "", "d " + Tt), M("span", Xt(Y), "t"), M("span", ae(Y.created), "ppp-mute")), Y.txid && lt.append(Gt("tx", Ge(Y.txid))), lt;
    })), s(".ppp-wallets").hidden = !(I.childElementCount || pt.length), s(".ppp-more").hidden = !tt.length;
    const ze = s(".ppp-history");
    ze.hidden = !h.entries.length, h.entries.length && Yt(), ze.replaceChildren(M("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((Y) => {
      const lt = M("div", "", "ppp-row"), Tt = Y.kind === "play" ? [M("span", Xt(Y), "ppp-song"), M("span", ` · ${sr(BigInt(Y.amount))} STX to ${et(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [M("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Xt(Y)}`, "ppp-song"), M("span", ` · for ${h.linked ? et(h.linked) : "this listening wallet"}`, "ppp-mute")] : [M("span", `Returned ${sr(BigInt(Y.amount))} STX`, "ppp-song"), M("span", ` to ${et(Y.recipient)}`, "ppp-mute")];
      return lt.append(
        M("span", Wt[Y.status] || Y.status, "ppp-status " + (vt[Y.status] || "")),
        ...Tt,
        M("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && lt.append(Gt("tx ↗", Ge(Y.txid))), lt;
    })), U == null || U.render(Ke ? Mr(h, Ke, [...Os, ...ko]) : null), T(h, !!Ke, gl ? [...Os, ...ko] : Os, Gn), L.isOpen() && L.refresh(), X == null || X.render((_e == null ? void 0 : _e.mode) === "open" ? Mr(h, _e, []) : null);
  }
  function Ns(f) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((h = f.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && ft({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const m = u.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const A = $();
    return A && (f.step === "locked" || ct && f.step === "loading") ? { mode: "locked", player: A.player } : null;
  }
  function Mr(f, m, A) {
    var ee, Pe, je, $t, Ne;
    const h = !!f.busy || f.armed, V = [...A];
    f.depositPending && f.arrival && V.push(zn(f.arrival)), f.error ? V.push(M("p", f.error, f.error === Oc ? "ppp-warn" : "ppp-bad")) : f.message && !h ? V.push(M("p", f.message, "ppp-cyan")) : f.notice && V.push(M("p", f.notice, "ppp-warn")), m.mode === "open" && on && ((ee = f.likeFunds) != null && ee.album) && f.likeFunds.low && !f.likeFunds.pending && V.push(M("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let gt = "Kept on this device with Face ID or your passkey. No app or account needed.", st = null, xt = null;
    if (m.mode === "locked")
      st = { label: "Continue listening", run: () => {
        ct = $(), c.unlock();
      } }, xt = { label: "Use a different passkey", run: () => {
        ct = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (f.step === "intro" && Qa(At) && At.album === m.player.id) {
        const Kt = window.XtrataRadio, Bn = Zs(m.player)[0], an = At.phase === "playing";
        st = { label: an && !!((je = (Pe = Kt == null ? void 0 : Kt.getState) == null ? void 0 : Pe.call(Kt)) != null && je.playing) ? "Pause" : an ? "Carry on" : "Play the first song", run: () => {
          var Je, y;
          an ? (Je = Kt == null ? void 0 : Kt.playPause) == null || Je.call(Kt) : Bn && ((y = Kt == null ? void 0 : Kt.playToken) == null || y.call(Kt, Bn.id));
        } }, xt = { label: "Make my player and hear it all", run: () => void c.create() }, gt = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const Kt = At.phase === "done" && At.album === m.player.id;
        Kt && !V.length && V.push(M("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), st = { label: Kt ? "Keep listening" : "Open album", run: () => void c.create() }, xt = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (st = { label: "Open album", run: () => void c.unlock() }, xt = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? V.push(M("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : V.length || V.push(M("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: V,
      primary: st,
      secondary: xt,
      hint: st ? gt : void 0,
      asking: h,
      busy: !!f.busy,
      myPlays: Ci(f),
      topUps: ac,
      canMake: !!((Ne = ($t = f.gate) == null ? void 0 : $t.gifts) != null && Ne.admin)
    };
  }
  const tr = /* @__PURE__ */ new Map();
  let _s = !1;
  const dr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((m) => {
      const A = m == null ? void 0 : m.nowPlaying;
      if (A && Number.isSafeInteger(Number(A.tokenId)) && tr.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 }), Qa(At)) {
        const h = !!(m != null && m.playing);
        Ct({ kind: "now", track: A && A.tokenId != null ? String(A.tokenId) : null, playing: h, at: Date.now() }), h !== _s && (_s = h, pe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!dr()) {
    const f = setInterval(() => {
      dr() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const m = f.detail;
    if (Qa(At) && Ct({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Yt();
      const A = Me(m.song, tr.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const V$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", Y$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, q$ = () => Y$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, X$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, W$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', qw = class {
  constructor(t) {
    Rv(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && cS(t), this.callback(Jc(t));
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
    const t = q$(), e = X$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Bt("div", { class: "flex flex-col space-y-[10px]" }, Bt("div", { class: "flex items-center" }, Bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Bt("span", { class: "sr-only" }, "Close popup"), Bt("img", { src: V$ }))), r ? Bt("p", null, "Select the wallet you want to connect to.") : Bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Bt("div", { class: "mt-6" }, Bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Bt("div", { class: "mt-6" }, r ? Bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Bt("div", { class: "mb-5 flex justify-between" }, Bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Bt("p", null, "What is a wallet? ", Bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Bt("ul", { class: "space-y-3" }, n.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Av(this);
  }
};
qw.style = W$;
const Z$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: qw
}, Symbol.toStringTag, { value: "Module" }));
