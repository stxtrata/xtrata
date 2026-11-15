var sm = Object.defineProperty;
var om = (e, t, n) => t in e ? sm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Vi = (e, t, n) => om(e, typeof t != "symbol" ? t + "" : t, n);
var wn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function hg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function il(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof wn < "u" && wn || {}, r = {
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
      function s(b) {
        return b && DataView.prototype.isPrototypeOf(b);
      }
      if (r.arrayBuffer)
        var o = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], i = ArrayBuffer.isView || function(b) {
          return b && o.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function c(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function p(b) {
        var k = {
          next: function() {
            var P = b.shift();
            return { done: P === void 0, value: P };
          }
        };
        return r.iterable && (k[Symbol.iterator] = function() {
          return k;
        }), k;
      }
      function g(b) {
        this.map = {}, b instanceof g ? b.forEach(function(k, P) {
          this.append(P, k);
        }, this) : Array.isArray(b) ? b.forEach(function(k) {
          if (k.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + k.length);
          this.append(k[0], k[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(k) {
          this.append(k, b[k]);
        }, this);
      }
      g.prototype.append = function(b, k) {
        b = a(b), k = c(k);
        var P = this.map[b];
        this.map[b] = P ? P + ", " + k : k;
      }, g.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, g.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, g.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, g.prototype.set = function(b, k) {
        this.map[a(b)] = c(k);
      }, g.prototype.forEach = function(b, k) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && b.call(k, this.map[P], P, this);
      }, g.prototype.keys = function() {
        var b = [];
        return this.forEach(function(k, P) {
          b.push(P);
        }), p(b);
      }, g.prototype.values = function() {
        var b = [];
        return this.forEach(function(k) {
          b.push(k);
        }), p(b);
      }, g.prototype.entries = function() {
        var b = [];
        return this.forEach(function(k, P) {
          b.push([P, k]);
        }), p(b);
      }, r.iterable && (g.prototype[Symbol.iterator] = g.prototype.entries);
      function h(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function w(b) {
        return new Promise(function(k, P) {
          b.onload = function() {
            k(b.result);
          }, b.onerror = function() {
            P(b.error);
          };
        });
      }
      function y(b) {
        var k = new FileReader(), P = w(k);
        return k.readAsArrayBuffer(b), P;
      }
      function S(b) {
        var k = new FileReader(), P = w(k), _ = /charset=([A-Za-z0-9_-]+)/.exec(b.type), K = _ ? _[1] : "utf-8";
        return k.readAsText(b, K), P;
      }
      function x(b) {
        for (var k = new Uint8Array(b), P = new Array(k.length), _ = 0; _ < k.length; _++)
          P[_] = String.fromCharCode(k[_]);
        return P.join("");
      }
      function C(b) {
        if (b.slice)
          return b.slice(0);
        var k = new Uint8Array(b.byteLength);
        return k.set(new Uint8Array(b)), k.buffer;
      }
      function O() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = C(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = C(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = h(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var b = h(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = h(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(M);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(b) {
        var k = b.toUpperCase();
        return U.indexOf(k) > -1 ? k : b;
      }
      function L(b, k) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        k = k || {};
        var P = k.body;
        if (b instanceof L) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, k.headers || (this.headers = new g(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !P && b._bodyInit != null && (P = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = k.credentials || this.credentials || "same-origin", (k.headers || !this.headers) && (this.headers = new g(k.headers)), this.method = E(k.method || this.method || "GET"), this.mode = k.mode || this.mode || null, this.signal = k.signal || this.signal || function() {
          if ("AbortController" in n) {
            var T = new AbortController();
            return T.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (k.cache === "no-store" || k.cache === "no-cache")) {
          var _ = /([?&])_=[^&]*/;
          if (_.test(this.url))
            this.url = this.url.replace(_, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function M(b) {
        var k = new FormData();
        return b.trim().split("&").forEach(function(P) {
          if (P) {
            var _ = P.split("="), K = _.shift().replace(/\+/g, " "), T = _.join("=").replace(/\+/g, " ");
            k.append(decodeURIComponent(K), decodeURIComponent(T));
          }
        }), k;
      }
      function G(b) {
        var k = new g(), P = b.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var K = _.split(":"), T = K.shift().trim();
          if (T) {
            var z = K.join(":").trim();
            try {
              k.append(T, z);
            } catch (X) {
              console.warn("Response " + X.message);
            }
          }
        }), k;
      }
      O.call(L.prototype);
      function ee(b, k) {
        if (!(this instanceof ee))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (k || (k = {}), this.type = "default", this.status = k.status === void 0 ? 200 : k.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = k.statusText === void 0 ? "" : "" + k.statusText, this.headers = new g(k.headers), this.url = k.url || "", this._initBody(b);
      }
      O.call(ee.prototype), ee.prototype.clone = function() {
        return new ee(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new g(this.headers),
          url: this.url
        });
      }, ee.error = function() {
        var b = new ee(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var Z = [301, 302, 303, 307, 308];
      ee.redirect = function(b, k) {
        if (Z.indexOf(k) === -1)
          throw new RangeError("Invalid status code");
        return new ee(null, { status: k, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(k, P) {
          this.message = k, this.name = P;
          var _ = Error(k);
          this.stack = _.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(b, k) {
        return new Promise(function(P, _) {
          var K = new L(b, k);
          if (K.signal && K.signal.aborted)
            return _(new t.DOMException("Aborted", "AbortError"));
          var T = new XMLHttpRequest();
          function z() {
            T.abort();
          }
          T.onload = function() {
            var v = {
              statusText: T.statusText,
              headers: G(T.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (T.status < 200 || T.status > 599) ? v.status = 200 : v.status = T.status, v.url = "responseURL" in T ? T.responseURL : v.headers.get("X-Request-URL");
            var H = "response" in T ? T.response : T.responseText;
            setTimeout(function() {
              P(new ee(H, v));
            }, 0);
          }, T.onerror = function() {
            setTimeout(function() {
              _(new TypeError("Network request failed"));
            }, 0);
          }, T.ontimeout = function() {
            setTimeout(function() {
              _(new TypeError("Network request timed out"));
            }, 0);
          }, T.onabort = function() {
            setTimeout(function() {
              _(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function X(v) {
            try {
              return v === "" && n.location.href ? n.location.href : v;
            } catch {
              return v;
            }
          }
          if (T.open(K.method, X(K.url), !0), K.credentials === "include" ? T.withCredentials = !0 : K.credentials === "omit" && (T.withCredentials = !1), "responseType" in T && (r.blob ? T.responseType = "blob" : r.arrayBuffer && (T.responseType = "arraybuffer")), k && typeof k.headers == "object" && !(k.headers instanceof g || n.Headers && k.headers instanceof n.Headers)) {
            var ue = [];
            Object.getOwnPropertyNames(k.headers).forEach(function(v) {
              ue.push(a(v)), T.setRequestHeader(v, c(k.headers[v]));
            }), K.headers.forEach(function(v, H) {
              ue.indexOf(H) === -1 && T.setRequestHeader(H, v);
            });
          } else
            K.headers.forEach(function(v, H) {
              T.setRequestHeader(H, v);
            });
          K.signal && (K.signal.addEventListener("abort", z), T.onreadystatechange = function() {
            T.readyState === 4 && K.signal.removeEventListener("abort", z);
          }), T.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = g, n.Request = L, n.Response = ee), t.Headers = g, t.Request = L, t.Response = ee, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : wn);
})();
const im = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function am(e, t) {
  const n = {};
  return Object.assign(n, im, t), await fetch(e, n);
}
function cm(e) {
  let t = am, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function lm(...e) {
  const { fetchLib: t, middlewares: n } = cm(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var yi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(yi || (yi = {}));
var go;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(go || (go = {}));
var Sh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Sh || (Sh = {}));
const um = "https://api.mainnet.hiro.so", dm = "https://api.testnet.hiro.so", fm = "http://localhost:3999", hm = ["mainnet", "testnet", "devnet", "mocknet"];
let wi = class {
  constructor(t) {
    this.version = go.Mainnet, this.chainId = yi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === go.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? lm();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
};
wi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Lu();
    case "testnet":
      return new pm();
    case "devnet":
      return new gm();
    case "mocknet":
      return new pg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${hm.join(", ")}`);
  }
};
wi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : wi.fromName(e);
let Lu = class extends wi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? um,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Mainnet, this.chainId = yi.Mainnet;
  }
}, pm = class extends wi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? dm,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Testnet, this.chainId = yi.Testnet;
  }
}, pg = class extends wi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? fm,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Testnet, this.chainId = yi.Testnet;
  }
};
const gm = pg, gg = "xtrata.wallet.bridge.v1", ym = (e) => typeof e == "object" && e !== null && e.protocol === gg, wm = (e) => ym(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", bm = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class Yi extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const Ah = 12e4;
class mm {
  constructor(t) {
    Vi(this, "pending", /* @__PURE__ */ new Map());
    Vi(this, "listenTarget");
    Vi(this, "closed", !1);
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
    Vi(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !wm(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new Yi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new Yi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Yi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = bm(), o = { protocol: gg, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Yi(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? Ah}ms.`
          )
        );
      }, this.options.timeoutMs ?? Ah);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new Yi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const xm = ["SP", "SM"], Sm = ["ST", "SN"], Am = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return xm.includes(n) ? "mainnet" : Sm.includes(n) ? "testnet" : null;
}, Em = () => {
  const e = /* @__PURE__ */ new Map();
  return {
    getItem: (t) => e.get(t) ?? null,
    setItem: (t, n) => {
      e.set(t, n);
    },
    removeItem: (t) => {
      e.delete(t);
    }
  };
}, vm = () => typeof window > "u" || !window.localStorage ? Em() : window.localStorage, Gl = "xtrata.v15.1.wallet.session", Eh = "mainnet", Ic = { isConnected: !1 }, km = (e) => e.address ? Am(e.address) ?? e.network : e.network, yg = (e) => !e.isConnected || !e.address ? { ...Ic } : km(e) !== Eh ? { ...Ic } : {
  isConnected: !0,
  address: e.address,
  network: Eh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, $m = (e) => {
  if (!e)
    return { ...Ic };
  try {
    const t = JSON.parse(e);
    return yg(t);
  } catch {
    return { ...Ic };
  }
}, Im = (e) => {
  const t = yg(e);
  return JSON.stringify(t);
}, Lm = (e) => {
  const t = vm();
  return {
    load: () => $m(t.getItem(Gl)),
    save: (n) => {
      t.setItem(Gl, Im(n));
    },
    clear: () => {
      t.removeItem(Gl);
    }
  };
}, Cm = "https://browser.blockstack.org/auth", Tm = {
  "@type": "Person",
  "@context": "http://schema.org"
}, wg = ["store_write"], Bm = "blockstack-session", Mm = {
  logLevel: "debug"
}, Bo = {
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
Object.freeze(Bo);
class _i extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
    if (s)
      r += `Stack Trace:
${s}`;
    else
      try {
        throw new Error();
      } catch (o) {
        s = o.stack;
      }
    n += `
If you believe this exception is caused by a bug in stacks.js,
      please file a bug report: https://github.com/blockstack/stacks.js/issues

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class Nm extends _i {
  constructor(t, n = "") {
    super({ code: Bo.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class vh extends _i {
  constructor(t = "") {
    super({ code: Bo.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Ua extends _i {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Bo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class kh extends _i {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Bo.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class Cu extends _i {
  constructor(t) {
    super({ code: Bo.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class bg extends _i {
  constructor(t) {
    super({ code: Bo.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const $h = ["debug", "info", "warn", "error", "none"], Tu = {};
for (let e = 0; e < $h.length; e++) {
  const t = $h[e];
  Tu[t] = e;
}
class ci {
  static error(t) {
    this.shouldLog("error") && console.error(this.logMessage("error", t));
  }
  static warn(t) {
    this.shouldLog("warn") && console.warn(this.logMessage("warn", t));
  }
  static info(t) {
    this.shouldLog("info") && console.log(this.logMessage("info", t));
  }
  static debug(t) {
    this.shouldLog("debug") && console.log(this.logMessage("debug", t));
  }
  static logMessage(t, n) {
    return `[${t.toUpperCase()}] ${n}`;
  }
  static shouldLog(t) {
    return Tu[Mm.logLevel] <= Tu[t];
  }
}
function _m() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Pm() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Kl(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Um() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Hm() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Om(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Hd(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Hm(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    ci.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = Om(s, e.toString(), n);
    throw ci.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Ds(e, t) {
  return Od(cn(e), t);
}
function cn(e) {
  if (typeof e == "bigint")
    return e;
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e == "number") {
    if (!Number.isInteger(e))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (e > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(e);
  }
  if (An(e, Uint8Array))
    return BigInt(`0x${xe(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Dm(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Ih(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Aa(e, t = 8) {
  return (typeof e == "bigint" ? e : cn(e)).toString(16).padStart(t * 2, "0");
}
function al(e) {
  return parseInt(e, 16);
}
function Od(e, t = 16) {
  const n = Aa(e, t);
  return Ve(n);
}
function Fm(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function jm(e, t) {
  return e & BigInt(1) << t;
}
function Bu(e) {
  return Rm(BigInt(`0x${xe(e)}`), BigInt(e.byteLength * 8));
}
function Rm(e, t) {
  return jm(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const zm = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function xe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += zm[n];
  return t;
}
function Ve(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = Dm(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function Mo(e) {
  return new TextEncoder().encode(e);
}
function Ea(e) {
  return new TextDecoder().decode(e);
}
function Gm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Km(e) {
  return String.fromCharCode.apply(null, e);
}
function Vm(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Lh(e) {
  if (e.some(Vm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function $r(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Dt(e) {
  return $r(...e.map((t) => typeof t == "number" ? Lh([t]) : t instanceof Array ? Lh(t) : t));
}
function An(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const mg = "https://api.mainnet.hiro.so", xg = "https://api.testnet.hiro.so", Sg = "http://localhost:3999", Ym = "https://hub.blockstack.org", qm = 33, Vl = 32;
function Xm(e) {
  if (e.length < Vl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Vl * 2), r = e.slice(2 + Vl * 2);
  return {
    recoveryId: al(t),
    r: n,
    s: r
  };
}
function Dd(e) {
  const t = typeof e == "string" ? Ve(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Wm(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Zm(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Qm(e, t) {
  return e[t];
}
function Jm(e, t, n = 0) {
  return e[n] = t, e;
}
function e1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function yo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const t1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function n1(e, t) {
  const n = {};
  return Object.assign(n, t1, t), await fetch(e, n);
}
function r1(e) {
  let t = n1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function s1(...e) {
  const { fetchLib: t, middlewares: n } = r1(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class Ag {
  constructor(t = wg.slice(), n = ((a) => (a = Hd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Cm) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Mu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function o1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Eg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function i1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Mu(e.outputLen), Mu(e.blockLen);
}
function a1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function c1(e, t) {
  Eg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oo = {
  number: Mu,
  bool: o1,
  bytes: Eg,
  hash: i1,
  exists: a1,
  output: c1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), hr = (e, t) => e << 32 - t | e >>> t, l1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function u1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Fd(e) {
  if (typeof e == "string" && (e = u1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let vg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function No(e) {
  const t = (r) => e().update(Fd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let kg = class extends vg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, oo.hash(t);
    const r = Fd(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return oo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    oo.exists(this), oo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const cl = (e, t, n) => new kg(e, t).update(n).digest();
cl.create = (e, t) => new kg(e, t);
function d1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let jd = class extends vg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Yl(this.buffer);
  }
  update(t) {
    oo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Fd(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Yl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    oo.exists(this), oo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    d1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Yl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const f1 = (e, t, n) => e & t ^ ~e & n, h1 = (e, t, n) => e & t ^ e & n ^ t & n, p1 = new Uint32Array([
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
]), cs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ls = new Uint32Array(64);
let $g = class extends jd {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ls[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ls[h - 15], y = ls[h - 2], S = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, x = hr(y, 17) ^ hr(y, 19) ^ y >>> 10;
      ls[h] = x + ls[h - 7] + S + ls[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), y = g + w + f1(a, c, p) + p1[h] + ls[h] | 0, x = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + h1(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, g1 = class extends $g {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const bi = No(() => new $g());
No(() => new g1());
const y1 = {}, Ig = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: y1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ge = BigInt(0), xt = BigInt(1), _s = BigInt(2), ra = BigInt(3), Ch = BigInt(8), at = Object.freeze({
  a: Ge,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: xt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Th = (e, t) => (e + t / _s) / t, Ha = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = at, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -xt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Th(o * e, t), c = Th(-r * e, t);
    let p = oe(e - a * n - c * s, t), g = oe(-a * r - c * o, t);
    const h = p > i, w = g > i;
    if (h && (p = t - p), w && (g = t - g), p > i || g > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: h, k1: p, k2neg: w, k2: g };
  }
}, cr = 32, wo = 32, Lg = 32, Lc = cr + 1, Cc = 2 * cr + 1;
function Bh(e) {
  const { a: t, b: n } = at, r = oe(e * e), s = oe(r * e);
  return oe(s + t * e + n);
}
const Oa = at.a === Ge;
class Rd extends Error {
  constructor(t) {
    super(t);
  }
}
function Mh(e) {
  if (!(e instanceof Qe))
    throw new TypeError("JacobianPoint expected");
}
class Qe {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof De))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(De.ZERO) ? Qe.ZERO : new Qe(t.x, t.y, xt);
  }
  static toAffineBatch(t) {
    const n = S1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return Qe.toAffineBatch(t).map(Qe.fromAffine);
  }
  equals(t) {
    Mh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = oe(s * s), p = oe(a * a), g = oe(n * p), h = oe(o * c), w = oe(oe(r * a) * p), y = oe(oe(i * s) * c);
    return g === h && w === y;
  }
  negate() {
    return new Qe(this.x, oe(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = oe(t * t), o = oe(n * n), i = oe(o * o), a = t + o, c = oe(_s * (oe(a * a) - s - i)), p = oe(ra * s), g = oe(p * p), h = oe(g - _s * c), w = oe(p * (c - h) - Ch * i), y = oe(_s * n * r);
    return new Qe(h, w, y);
  }
  add(t) {
    Mh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === Ge || i === Ge)
      return this;
    if (n === Ge || r === Ge)
      return t;
    const c = oe(s * s), p = oe(a * a), g = oe(n * p), h = oe(o * c), w = oe(oe(r * a) * p), y = oe(oe(i * s) * c), S = oe(h - g), x = oe(y - w);
    if (S === Ge)
      return x === Ge ? this.double() : Qe.ZERO;
    const C = oe(S * S), O = oe(S * C), U = oe(g * C), E = oe(x * x - O - _s * U), L = oe(x * (U - E) - w * O), M = oe(s * a * S);
    return new Qe(E, L, M);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = Qe.ZERO;
    if (typeof t == "bigint" && t === Ge)
      return n;
    let r = Ph(t);
    if (r === xt)
      return this;
    if (!Oa) {
      let h = n, w = this;
      for (; r > Ge; )
        r & xt && (h = h.add(w)), w = w.double(), r >>= xt;
      return h;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Ha.splitScalar(r), c = n, p = n, g = this;
    for (; o > Ge || a > Ge; )
      o & xt && (c = c.add(g)), a & xt && (p = p.add(g)), g = g.double(), o >>= xt, a >>= xt;
    return s && (c = c.negate()), i && (p = p.negate()), p = new Qe(oe(p.x * Ha.beta), p.y, p.z), c.add(p);
  }
  precomputeWindow(t) {
    const n = Oa ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (t - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(Qe.BASE) && (n = De.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Nu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Qe.normalizeZ(s), Nu.set(n, s)));
    let o = Qe.ZERO, i = Qe.BASE;
    const a = 1 + (Oa ? 128 / r : 256 / r), c = 2 ** (r - 1), p = BigInt(2 ** r - 1), g = 2 ** r, h = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let S = Number(t & p);
      t >>= h, S > c && (S -= g, t += xt);
      const x = y, C = y + Math.abs(S) - 1, O = w % 2 !== 0, U = S < 0;
      S === 0 ? i = i.add(Da(O, s[x])) : o = o.add(Da(U, s[C]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = Ph(t), s, o;
    if (Oa) {
      const { k1neg: i, k1: a, k2neg: c, k2: p } = Ha.splitScalar(r);
      let { p: g, f: h } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(p, n);
      g = Da(i, g), w = Da(c, w), w = new Qe(oe(w.x * Ha.beta), w.y, w.z), s = g.add(w), o = h.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Qe.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(Qe.ZERO);
    t == null && (t = o ? Ch : Pi(s));
    const i = t, a = oe(i * i), c = oe(a * i), p = oe(n * a), g = oe(r * c), h = oe(s * i);
    if (o)
      return De.ZERO;
    if (h !== xt)
      throw new Error("invZ was invalid");
    return new De(p, g);
  }
}
Qe.BASE = new Qe(at.Gx, at.Gy, xt);
Qe.ZERO = new Qe(Ge, xt, Ge);
function Da(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Nu = /* @__PURE__ */ new WeakMap();
class De {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Nu.delete(this);
  }
  hasEvenY() {
    return this.y % _s === Ge;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = On(n ? t : t.subarray(1));
    if (!wc(r))
      throw new Error("Point is not on curve");
    const s = Bh(r);
    let o = x1(s);
    const i = (o & xt) === xt;
    n ? i && (o = oe(-o)) : (t[0] & 1) === 1 !== i && (o = oe(-o));
    const a = new De(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = On(t.subarray(1, cr + 1)), r = On(t.subarray(cr + 1, cr * 2 + 1)), s = new De(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Ir(t), r = n.length, s = n[0];
    if (r === cr)
      return this.fromCompressedHex(n);
    if (r === Lc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Cc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Lc} compressed bytes or ${Cc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return De.BASE.multiply(bo(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = Bg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = zd(Ir(t)), { n: a } = at, c = r === 2 || r === 3 ? s + a : s, p = Pi(c, a), g = oe(-i * p, a), h = oe(o * p, a), w = r & 1 ? "03" : "02", y = De.fromHex(w + Ps(c)), S = De.BASE.multiplyAndAddUnsafe(y, g, h);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(t = !1) {
    return Us(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Ps(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ps(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!wc(n) || !wc(r))
      throw new Error(t);
    const s = oe(r * r), o = Bh(n);
    if (oe(s - o) !== Ge)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new De(this.x, oe(-this.y));
  }
  double() {
    return Qe.fromAffine(this).double().toAffine();
  }
  add(t) {
    return Qe.fromAffine(this).add(Qe.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return Qe.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = Qe.fromAffine(this), o = n === Ge || n === xt || this !== De.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Qe.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Qe.ZERO) ? void 0 : a.toAffine();
  }
}
De.BASE = new De(at.Gx, at.Gy);
De.ZERO = new De(Ge, Ge);
function Nh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function _h(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${mi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: On(n), left: e.subarray(t + 2) };
}
function w1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${mi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = _h(e.subarray(2)), { data: r, left: s } = _h(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${mi(s)}`);
  return { r: t, s: r };
}
class Hn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? mi(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Hn(Tc(s.slice(0, 64)), Tc(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = w1(n ? t : Us(t));
    return new Hn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Si(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Si(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = at.n >> xt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Hn(this.r, oe(-this.s, at.n)) : this;
  }
  toDERRawBytes() {
    return Us(this.toDERHex());
  }
  toDERHex() {
    const t = Nh(qi(this.s)), n = Nh(qi(this.r)), r = t.length / 2, s = n.length / 2, o = qi(r), i = qi(s);
    return `30${qi(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Us(this.toCompactHex());
  }
  toCompactHex() {
    return Ps(this.r) + Ps(this.s);
  }
}
function Ms(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const b1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function mi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += b1[e[n]];
  return t;
}
const m1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ps(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(Ge <= e && e < m1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function xi(e) {
  const t = Us(Ps(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function qi(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Tc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Us(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function On(e) {
  return Tc(mi(e));
}
function Ir(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Us(e);
}
function Ph(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Si(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function oe(e, t = at.P) {
  const n = e % t;
  return n >= Ge ? n : t + n;
}
function zn(e, t) {
  const { P: n } = at;
  let r = e;
  for (; t-- > Ge; )
    r *= r, r %= n;
  return r;
}
function x1(e) {
  const { P: t } = at, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, p = c * c * e % t, g = zn(p, ra) * p % t, h = zn(g, ra) * p % t, w = zn(h, _s) * c % t, y = zn(w, r) * w % t, S = zn(y, s) * y % t, x = zn(S, i) * S % t, C = zn(x, a) * x % t, O = zn(C, i) * S % t, U = zn(O, ra) * p % t, E = zn(U, o) * y % t, L = zn(E, n) * c % t, M = zn(L, _s);
  if (M * M % t !== e)
    throw new Error("Cannot find square root");
  return M;
}
function Pi(e, t = at.P) {
  if (e === Ge || t <= Ge)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = oe(e, t), r = t, s = Ge, o = xt;
  for (; n !== Ge; ) {
    const a = r / n, c = r % n, p = s - o * a;
    r = n, n = c, s = o, o = p;
  }
  if (r !== xt)
    throw new Error("invert: does not exist");
  return oe(s, t);
}
function S1(e, t = at.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === Ge ? o : (n[a] = o, oe(o * i, t)), xt), s = Pi(r, t);
  return e.reduceRight((o, i, a) => i === Ge ? o : (n[a] = oe(o * n[a], t), oe(o * i, t)), s), n;
}
function A1(e) {
  const t = e.length * 8 - wo * 8, n = On(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function zd(e, t = !1) {
  const n = A1(e);
  if (t)
    return n;
  const { n: r } = at;
  return n >= r ? n - r : n;
}
let pi, sa;
class Cg {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Mt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return sa(this.k, ...t);
  }
  checkSync() {
    if (typeof sa != "function")
      throw new Rd("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(t = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), t), this.v = await this.hmac(this.v), t.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), t), this.v = await this.hmac(this.v));
  }
  reseedSync(t = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), t), this.v = this.hmacSync(this.v), t.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), t), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Ms(...n);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Ms(...n);
  }
}
function Si(e) {
  return Ge < e && e < at.n;
}
function wc(e) {
  return Ge < e && e < at.P;
}
function Tg(e, t, n, r = !0) {
  const { n: s } = at, o = zd(e, !0);
  if (!Si(o))
    return;
  const i = Pi(o, s), a = De.BASE.multiply(o), c = oe(a.x, s);
  if (c === Ge)
    return;
  const p = oe(i * oe(t + n * c, s), s);
  if (p === Ge)
    return;
  let g = new Hn(c, p), h = (a.x === g.r ? 0 : 2) | Number(a.y & xt);
  return r && g.hasHighS() && (g = g.normalizeS(), h ^= 1), { sig: g, recovery: h };
}
function bo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * wo)
      throw new Error("Expected 32 bytes of private key");
    t = Tc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== wo)
      throw new Error("Expected 32 bytes of private key");
    t = On(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Si(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Gd(e) {
  return e instanceof De ? (e.assertValidity(), e) : De.fromHex(e);
}
function Bg(e) {
  if (e instanceof Hn)
    return e.assertValidity(), e;
  try {
    return Hn.fromDER(e);
  } catch {
    return Hn.fromCompact(e);
  }
}
function va(e, t = !1) {
  return De.fromPrivateKey(e).toRawBytes(t);
}
function E1(e, t, n, r = !1) {
  return De.fromSignature(e, t, n).toRawBytes(r);
}
function Uh(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Lc || r === Cc : n ? r === Lc * 2 || r === Cc * 2 : e instanceof De;
}
function Kd(e, t, n = !1) {
  if (Uh(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Uh(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Gd(t);
  return r.assertValidity(), r.multiply(bo(e)).toRawBytes(n);
}
function Mg(e) {
  const t = e.length > cr ? e.slice(0, cr) : e;
  return On(t);
}
function v1(e) {
  const t = Mg(e), n = oe(t, at.n);
  return Ng(n < Ge ? t : n);
}
function Ng(e) {
  return xi(e);
}
function _g(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Ir(e), s = bo(t), o = [Ng(s), v1(r)];
  if (n != null) {
    n === !0 && (n = Mt.randomBytes(cr));
    const c = Ir(n);
    if (c.length !== cr)
      throw new Error(`sign: Expected ${cr} bytes of extra data`);
    o.push(c);
  }
  const i = Ms(...o), a = Mg(r);
  return { seed: i, m: a, d: s };
}
function Pg(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function k1(e, t, n = {}) {
  const { seed: r, m: s, d: o } = _g(e, t, n.extraEntropy), i = new Cg(Lg, wo);
  await i.reseed(r);
  let a;
  for (; !(a = Tg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Pg(a, n);
}
function ll(e, t, n = {}) {
  const { seed: r, m: s, d: o } = _g(e, t, n.extraEntropy), i = new Cg(Lg, wo);
  i.reseedSync(r);
  let a;
  for (; !(a = Tg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Pg(a, n);
}
const $1 = { strict: !0 };
function I1(e, t, n, r = $1) {
  let s;
  try {
    s = Bg(e), t = Ir(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = zd(t);
  let c;
  try {
    c = Gd(n);
  } catch {
    return !1;
  }
  const { n: p } = at, g = Pi(i, p), h = oe(a * g, p), w = oe(o * g, p), y = De.BASE.multiplyAndAddUnsafe(c, h, w);
  return y ? oe(y.x, p) === o : !1;
}
function Bc(e) {
  return oe(On(e), at.n);
}
class Ai {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Ir(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = On(n.subarray(0, 32)), s = On(n.subarray(32, 64));
    return new Ai(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!wc(t) || !Si(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ps(this.r) + Ps(this.s);
  }
  toRawBytes() {
    return Us(this.toHex());
  }
}
function L1(e) {
  return De.fromPrivateKey(e).toRawX();
}
class Ug {
  constructor(t, n, r = Mt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Ir(t);
    const { x: s, scalar: o } = this.getScalar(bo(n));
    if (this.px = s, this.d = o, this.rand = Ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = De.fromPrivateKey(t), r = n.hasEvenY() ? t : at.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return xi(t ^ On(n));
  }
  finalizeNonce(t) {
    const n = oe(On(t), at.n);
    if (n === Ge)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new Ai(t.x, oe(n + r * s, at.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = Mt.taggedHash, i = this.initNonce(n, await o(Bs.aux, s)), { R: a, rx: c, k: p } = this.finalizeNonce(await o(Bs.nonce, i, r, t)), g = Bc(await o(Bs.challenge, c, r, t)), h = this.finalizeSig(a, p, g, n);
    return await Dg(h, t, r) || this.error(), h;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = Mt.taggedHashSync, i = this.initNonce(n, o(Bs.aux, s)), { R: a, rx: c, k: p } = this.finalizeNonce(o(Bs.nonce, i, r, t)), g = Bc(o(Bs.challenge, c, r, t)), h = this.finalizeSig(a, p, g, n);
    return Fg(h, t, r) || this.error(), h;
  }
}
async function C1(e, t, n) {
  return new Ug(e, t, n).calc();
}
function T1(e, t, n) {
  return new Ug(e, t, n).calcSync();
}
function Hg(e, t, n) {
  const r = e instanceof Ai, s = r ? e : Ai.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Ir(t),
    P: Gd(n)
  };
}
function Og(e, t, n, r) {
  const s = De.BASE.multiplyAndAddUnsafe(t, bo(n), oe(-r, at.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Dg(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Hg(e, t, n), a = Bc(await Mt.taggedHash(Bs.challenge, xi(r), i.toRawX(), o));
    return Og(r, i, s, a);
  } catch {
    return !1;
  }
}
function Fg(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Hg(e, t, n), a = Bc(Mt.taggedHashSync(Bs.challenge, xi(r), i.toRawX(), o));
    return Og(r, i, s, a);
  } catch (r) {
    if (r instanceof Rd)
      throw r;
    return !1;
  }
}
const B1 = {
  Signature: Ai,
  getPublicKey: L1,
  sign: C1,
  verify: Dg,
  signSync: T1,
  verifySync: Fg
};
De.BASE._setWindowSize(8);
const Mn = {
  node: Ig,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Fa = {}, Mt = {
  bytesToHex: mi,
  hexToBytes: Us,
  concatBytes: Ms,
  mod: oe,
  invert: Pi,
  isValidPrivateKey(e) {
    try {
      return bo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: xi,
  _normalizePrivateKey: bo,
  hashToPrivateKey: (e) => {
    e = Ir(e);
    const t = wo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = oe(On(e), at.n - xt) + xt;
    return xi(n);
  },
  randomBytes: (e = 32) => {
    if (Mn.web)
      return Mn.web.getRandomValues(new Uint8Array(e));
    if (Mn.node) {
      const { randomBytes: t } = Mn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Mt.hashToPrivateKey(Mt.randomBytes(wo + 8)),
  precompute(e = 8, t = De.BASE) {
    const n = t === De.BASE ? t : new De(t.x, t.y);
    return n._setWindowSize(e), n.multiply(ra), n;
  },
  sha256: async (...e) => {
    if (Mn.web) {
      const t = await Mn.web.subtle.digest("SHA-256", Ms(...e));
      return new Uint8Array(t);
    } else if (Mn.node) {
      const { createHash: t } = Mn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Mn.web) {
      const n = await Mn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ms(...t), s = await Mn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Mn.node) {
      const { createHmac: n } = Mn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Fa[e];
    if (n === void 0) {
      const r = await Mt.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Fa[e] = n;
    }
    return Mt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof pi != "function")
      throw new Rd("sha256Sync is undefined, you need to set it");
    let n = Fa[e];
    if (n === void 0) {
      const r = pi(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Fa[e] = n;
    }
    return pi(n, ...t);
  },
  _JacobianPoint: Qe
};
Object.defineProperties(Mt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return pi;
    },
    set(e) {
      pi || (pi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return sa;
    },
    set(e) {
      sa || (sa = e);
    }
  }
});
const M1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: at,
  Point: De,
  Signature: Hn,
  getPublicKey: va,
  getSharedSecret: Kd,
  recoverPublicKey: E1,
  schnorr: B1,
  sign: k1,
  signSync: ll,
  utils: Mt,
  verify: I1
}, Symbol.toStringTag, { value: "Module" }));
var ka = {};
ka.byteLength = H1;
var N1 = ka.toByteArray = D1, _1 = ka.fromByteArray = R1, mr = [], Yn = [], P1 = typeof Uint8Array < "u" ? Uint8Array : Array, ql = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ti = 0, U1 = ql.length; ti < U1; ++ti)
  mr[ti] = ql[ti], Yn[ql.charCodeAt(ti)] = ti;
Yn[45] = 62;
Yn[95] = 63;
function jg(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function H1(e) {
  var t = jg(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function O1(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function D1(e) {
  var t, n = jg(e), r = n[0], s = n[1], o = new P1(O1(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Yn[e.charCodeAt(c)] << 18 | Yn[e.charCodeAt(c + 1)] << 12 | Yn[e.charCodeAt(c + 2)] << 6 | Yn[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = Yn[e.charCodeAt(c)] << 2 | Yn[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = Yn[e.charCodeAt(c)] << 10 | Yn[e.charCodeAt(c + 1)] << 4 | Yn[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function F1(e) {
  return mr[e >> 18 & 63] + mr[e >> 12 & 63] + mr[e >> 6 & 63] + mr[e & 63];
}
function j1(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(F1(r));
  return s.join("");
}
function R1(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(j1(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    mr[t >> 2] + mr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    mr[t >> 10] + mr[t >> 4 & 63] + mr[t << 2 & 63] + "="
  )), s.join("");
}
function z1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const G1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function K1() {
  if (z1())
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
    throw new Error(G1);
  }
}
class V1 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array($r(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array($r(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Y1 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function Rg() {
  const e = await K1();
  return e.name === "subtleCrypto" ? new Y1(e.lib) : new V1(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function q1(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), o = s.charCodeAt(0);
    if (t[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[o] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), p = Math.log(256) / Math.log(i);
  function g(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var S = 0, x = 0, C = 0, O = y.length; C !== O && y[C] === 0; )
      C++, S++;
    for (var U = (O - C) * p + 1 >>> 0, E = new Uint8Array(U); C !== O; ) {
      for (var L = y[C], M = 0, G = U - 1; (L !== 0 || M < x) && G !== -1; G--, M++)
        L += 256 * E[G] >>> 0, E[G] = L % i >>> 0, L = L / i >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      x = M, C++;
    }
    for (var ee = U - x; ee !== U && E[ee] === 0; )
      ee++;
    for (var Z = a.repeat(S); ee < U; ++ee)
      Z += e.charAt(E[ee]);
    return Z;
  }
  function h(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, C = 0; y[S] === a; )
      x++, S++;
    for (var O = (y.length - S) * c + 1 >>> 0, U = new Uint8Array(O); y[S]; ) {
      var E = y.charCodeAt(S);
      if (E > 255)
        return;
      var L = t[E];
      if (L === 255)
        return;
      for (var M = 0, G = O - 1; (L !== 0 || M < C) && G !== -1; G--, M++)
        L += i * U[G] >>> 0, U[G] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      C = M, S++;
    }
    for (var ee = O - C; ee !== O && U[ee] === 0; )
      ee++;
    for (var Z = new Uint8Array(x + (O - ee)), Y = x; ee !== O; )
      Z[Y++] = U[ee++];
    return Z;
  }
  function w(y) {
    var S = h(y);
    if (S)
      return S;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: g,
    decodeUnsafe: h,
    decode: w
  };
}
var zg = q1;
const X1 = zg, W1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Z1 = X1(W1);
const Q1 = /* @__PURE__ */ hg(Z1), J1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gg = Uint8Array.from({ length: 16 }, (e, t) => t), e2 = Gg.map((e) => (9 * e + 5) % 16);
let Vd = [Gg], Yd = [e2];
for (let e = 0; e < 4; e++)
  for (let t of [Vd, Yd])
    t.push(t[e].map((n) => J1[n]));
const Kg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), t2 = Vd.map((e, t) => e.map((n) => Kg[t][n])), n2 = Yd.map((e, t) => e.map((n) => Kg[t][n])), r2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), s2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ja = (e, t) => e << t | e >>> 32 - t;
function Hh(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ra = new Uint32Array(16);
let o2 = class extends jd {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ra[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = r2[y], C = s2[y], O = Vd[y], U = Yd[y], E = t2[y], L = n2[y];
      for (let M = 0; M < 16; M++) {
        const G = ja(r + Hh(y, o, a, p) + Ra[O[M]] + x, E[M]) + h | 0;
        r = h, h = p, p = ja(a, 10) | 0, a = o, o = G;
      }
      for (let M = 0; M < 16; M++) {
        const G = ja(s + Hh(S, i, c, g) + Ra[U[M]] + C, L[M]) + w | 0;
        s = w, w = g, g = ja(c, 10) | 0, c = i, i = G;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Ra.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const i2 = No(() => new o2());
function a2(e) {
  return i2(e);
}
const za = BigInt(2 ** 32 - 1), _u = BigInt(32);
function Vg(e, t = !1) {
  return t ? { h: Number(e & za), l: Number(e >> _u & za) } : { h: Number(e >> _u & za) | 0, l: Number(e & za) | 0 };
}
function c2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Vg(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const l2 = (e, t) => BigInt(e >>> 0) << _u | BigInt(t >>> 0), u2 = (e, t, n) => e >>> n, d2 = (e, t, n) => e << 32 - n | t >>> n, f2 = (e, t, n) => e >>> n | t << 32 - n, h2 = (e, t, n) => e << 32 - n | t >>> n, p2 = (e, t, n) => e << 64 - n | t >>> n - 32, g2 = (e, t, n) => e >>> n - 32 | t << 64 - n, y2 = (e, t) => t, w2 = (e, t) => e, b2 = (e, t, n) => e << n | t >>> 32 - n, m2 = (e, t, n) => t << n | e >>> 32 - n, x2 = (e, t, n) => t << n - 32 | e >>> 64 - n, S2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function A2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const E2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), v2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, k2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), $2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, I2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), L2 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Be = {
  fromBig: Vg,
  split: c2,
  toBig: l2,
  shrSH: u2,
  shrSL: d2,
  rotrSH: f2,
  rotrSL: h2,
  rotrBH: p2,
  rotrBL: g2,
  rotr32H: y2,
  rotr32L: w2,
  rotlSH: b2,
  rotlSL: m2,
  rotlBH: x2,
  rotlBL: S2,
  add: A2,
  add3L: E2,
  add3H: v2,
  add4L: k2,
  add4H: $2,
  add5H: L2,
  add5L: I2
}, [C2, T2] = Be.split([
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
].map((e) => BigInt(e))), us = new Uint32Array(80), ds = new Uint32Array(80);
let ul = class extends jd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: C } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      us[E] = t.getUint32(n), ds[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const L = us[E - 15] | 0, M = ds[E - 15] | 0, G = Be.rotrSH(L, M, 1) ^ Be.rotrSH(L, M, 8) ^ Be.shrSH(L, M, 7), ee = Be.rotrSL(L, M, 1) ^ Be.rotrSL(L, M, 8) ^ Be.shrSL(L, M, 7), Z = us[E - 2] | 0, Y = ds[E - 2] | 0, b = Be.rotrSH(Z, Y, 19) ^ Be.rotrBH(Z, Y, 61) ^ Be.shrSH(Z, Y, 6), k = Be.rotrSL(Z, Y, 19) ^ Be.rotrBL(Z, Y, 61) ^ Be.shrSL(Z, Y, 6), P = Be.add4L(ee, k, ds[E - 7], ds[E - 16]), _ = Be.add4H(P, G, b, us[E - 7], us[E - 16]);
      us[E] = _ | 0, ds[E] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: C, Hh: O, Hl: U } = this;
    for (let E = 0; E < 80; E++) {
      const L = Be.rotrSH(h, w, 14) ^ Be.rotrSH(h, w, 18) ^ Be.rotrBH(h, w, 41), M = Be.rotrSL(h, w, 14) ^ Be.rotrSL(h, w, 18) ^ Be.rotrBL(h, w, 41), G = h & y ^ ~h & x, ee = w & S ^ ~w & C, Z = Be.add5L(U, M, ee, T2[E], ds[E]), Y = Be.add5H(Z, O, L, G, C2[E], us[E]), b = Z | 0, k = Be.rotrSH(r, s, 28) ^ Be.rotrBH(r, s, 34) ^ Be.rotrBH(r, s, 39), P = Be.rotrSL(r, s, 28) ^ Be.rotrBL(r, s, 34) ^ Be.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, K = s & i ^ s & c ^ i & c;
      O = x | 0, U = C | 0, x = y | 0, C = S | 0, y = h | 0, S = w | 0, { h, l: w } = Be.add(p | 0, g | 0, Y | 0, b | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const T = Be.add3L(b, P, K);
      r = Be.add3H(T, Y, k, _), s = T | 0;
    }
    ({ h: r, l: s } = Be.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Be.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Be.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Be.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Be.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Be.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: C } = Be.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: O, l: U } = Be.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, C, O, U);
  }
  roundClean() {
    us.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, B2 = class extends ul {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, M2 = class extends ul {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N2 = class extends ul {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const _2 = No(() => new ul());
No(() => new B2());
No(() => new M2());
No(() => new N2());
function Yg(e) {
  return bi(e);
}
function P2(e) {
  return _2(e);
}
const U2 = 0;
Mt.hmacSha256Sync = (e, ...t) => {
  const n = cl.create(bi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function H2() {
  return xe(Mt.randomPrivateKey());
}
function O2(e) {
  const t = bi(bi(e));
  return Q1.encode($r(e, t).slice(0, e.length + 4));
}
function D2(e, t) {
  return O2($r(new Uint8Array([e]), t.slice(0, 20)));
}
function qg(e, t = U2) {
  const n = typeof e == "string" ? Ve(e) : e, r = a2(Yg(n));
  return D2(t, r);
}
function Xg(e) {
  const t = Dd(e);
  return xe(va(t.slice(0, 32), !0));
}
Mt.hmacSha256Sync = (e, ...t) => {
  const n = cl.create(bi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Mc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Mc || (Mc = {}));
async function F2(e, t, n) {
  return await (await Rg()).encrypt("aes-256-cbc", t, e, n);
}
async function j2(e, t, n) {
  return await (await Rg()).decrypt("aes-256-cbc", t, e, n);
}
function Wg(e, t) {
  return cl(bi, e, t);
}
function R2(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Zg(e) {
  const t = P2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function z2(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function G2(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Mc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Mc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !z2(e))
    return t;
  try {
    return De.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function K2(e, t, n, r) {
  const s = G2(e);
  if (!s.result)
    throw s;
  const o = Mt.randomPrivateKey(), i = va(o, !0);
  let a = Kd(o, e, !0);
  a = a.slice(1);
  const c = Zg(a), p = Mt.randomBytes(16), g = await F2(p, c.encryptionKey, t), h = $r(p, i, g), w = Wg(c.hmacKey, h);
  let y;
  if (!r || r === "hex")
    y = xe(g);
  else if (r === "base64")
    y = _1(g);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: xe(p),
    ephemeralPK: xe(i),
    cipherText: y,
    mac: xe(w),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function Qg(e, t) {
  if (!t.ephemeralPK)
    throw new kh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Kd(e, n, !0);
  r = r.slice(1);
  const s = Zg(r), o = Ve(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = Ve(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = N1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = $r(o, Ve(n), i), c = Wg(s.hmacKey, a), p = Ve(t.mac);
  if (!R2(p, c))
    throw new kh("Decryption failed: failure in MAC check");
  const g = await j2(o, s.encryptionKey, i);
  return t.wasString ? Ea(g) : g;
}
function V2(e, t) {
  const n = typeof t == "string" ? Mo(t) : t, r = Xg(e), s = Yg(n), o = ll(s, e);
  return {
    signature: xe(o),
    publicKey: r
  };
}
async function Y2(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Xg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? Mo(e) : e, i = await K2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = V2(r, a), p = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(p);
  }
  return a;
}
function q2(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Qg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var en = {}, Ei = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.decode = gn.encode = gn.unescape = gn.escape = gn.pad = void 0;
const Jg = ka;
function qd(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
gn.pad = qd;
function ey(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
gn.escape = ey;
function ty(e) {
  return qd(e).replace(/-/g, "+").replace(/_/g, "/");
}
gn.unescape = ty;
function X2(e) {
  return ey((0, Jg.fromByteArray)(new TextEncoder().encode(e)));
}
gn.encode = X2;
function W2(e) {
  return new TextDecoder().decode((0, Jg.toByteArray)(qd(ty(e))));
}
gn.decode = W2;
var dl = {}, fl = {}, ny = {}, ry = {}, hl = {};
Object.defineProperty(hl, "__esModule", { value: !0 });
hl.crypto = void 0;
hl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = p, e.clean = g, e.createView = h, e.rotr = w, e.rotl = y, e.byteSwap = S, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = M, e.asyncLoop = ee, e.utf8ToBytes = Z, e.bytesToUtf8 = Y, e.toBytes = b, e.kdfInputToBytes = k, e.concatBytes = P, e.checkOpts = _, e.createHasher = T, e.createOptHasher = z, e.createXOFer = X, e.randomBytes = ue;
  const t = hl;
  function n(v) {
    return v instanceof Uint8Array || ArrayBuffer.isView(v) && v.constructor.name === "Uint8Array";
  }
  function r(v) {
    if (!Number.isSafeInteger(v) || v < 0)
      throw new Error("positive integer expected, got " + v);
  }
  function s(v, ...H) {
    if (!n(v))
      throw new Error("Uint8Array expected");
    if (H.length > 0 && !H.includes(v.length))
      throw new Error("Uint8Array expected of length " + H + ", got length=" + v.length);
  }
  function o(v) {
    if (typeof v != "function" || typeof v.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(v.outputLen), r(v.blockLen);
  }
  function i(v, H = !0) {
    if (v.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (H && v.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(v, H) {
    s(v);
    const J = H.outputLen;
    if (v.length < J)
      throw new Error("digestInto() expects output buffer of length at least " + J);
  }
  function c(v) {
    return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  }
  function p(v) {
    return new Uint32Array(v.buffer, v.byteOffset, Math.floor(v.byteLength / 4));
  }
  function g(...v) {
    for (let H = 0; H < v.length; H++)
      v[H].fill(0);
  }
  function h(v) {
    return new DataView(v.buffer, v.byteOffset, v.byteLength);
  }
  function w(v, H) {
    return v << 32 - H | v >>> H;
  }
  function y(v, H) {
    return v << H | v >>> 32 - H >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(v) {
    return v << 24 & 4278190080 | v << 8 & 16711680 | v >>> 8 & 65280 | v >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (v) => v : (v) => S(v), e.byteSwapIfBE = e.swap8IfBE;
  function x(v) {
    for (let H = 0; H < v.length; H++)
      v[H] = S(v[H]);
    return v;
  }
  e.swap32IfBE = e.isLE ? (v) => v : x;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (v, H) => H.toString(16).padStart(2, "0"));
  function U(v) {
    if (s(v), C)
      return v.toHex();
    let H = "";
    for (let J = 0; J < v.length; J++)
      H += O[v[J]];
    return H;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(v) {
    if (v >= E._0 && v <= E._9)
      return v - E._0;
    if (v >= E.A && v <= E.F)
      return v - (E.A - 10);
    if (v >= E.a && v <= E.f)
      return v - (E.a - 10);
  }
  function M(v) {
    if (typeof v != "string")
      throw new Error("hex string expected, got " + typeof v);
    if (C)
      return Uint8Array.fromHex(v);
    const H = v.length, J = H / 2;
    if (H % 2)
      throw new Error("hex string expected, got unpadded hex of length " + H);
    const ge = new Uint8Array(J);
    for (let me = 0, Se = 0; me < J; me++, Se += 2) {
      const bt = L(v.charCodeAt(Se)), Ie = L(v.charCodeAt(Se + 1));
      if (bt === void 0 || Ie === void 0) {
        const Le = v[Se] + v[Se + 1];
        throw new Error('hex string expected, got non-hex character "' + Le + '" at index ' + Se);
      }
      ge[me] = bt * 16 + Ie;
    }
    return ge;
  }
  const G = async () => {
  };
  e.nextTick = G;
  async function ee(v, H, J) {
    let ge = Date.now();
    for (let me = 0; me < v; me++) {
      J(me);
      const Se = Date.now() - ge;
      Se >= 0 && Se < H || (await (0, e.nextTick)(), ge += Se);
    }
  }
  function Z(v) {
    if (typeof v != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(v));
  }
  function Y(v) {
    return new TextDecoder().decode(v);
  }
  function b(v) {
    return typeof v == "string" && (v = Z(v)), s(v), v;
  }
  function k(v) {
    return typeof v == "string" && (v = Z(v)), s(v), v;
  }
  function P(...v) {
    let H = 0;
    for (let ge = 0; ge < v.length; ge++) {
      const me = v[ge];
      s(me), H += me.length;
    }
    const J = new Uint8Array(H);
    for (let ge = 0, me = 0; ge < v.length; ge++) {
      const Se = v[ge];
      J.set(Se, me), me += Se.length;
    }
    return J;
  }
  function _(v, H) {
    if (H !== void 0 && {}.toString.call(H) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(v, H);
  }
  class K {
  }
  e.Hash = K;
  function T(v) {
    const H = (ge) => v().update(b(ge)).digest(), J = v();
    return H.outputLen = J.outputLen, H.blockLen = J.blockLen, H.create = () => v(), H;
  }
  function z(v) {
    const H = (ge, me) => v(me).update(b(ge)).digest(), J = v({});
    return H.outputLen = J.outputLen, H.blockLen = J.blockLen, H.create = (ge) => v(ge), H;
  }
  function X(v) {
    const H = (ge, me) => v(me).update(b(ge)).digest(), J = v({});
    return H.outputLen = J.outputLen, H.blockLen = J.blockLen, H.create = (ge) => v(ge), H;
  }
  e.wrapConstructor = T, e.wrapConstructorWithOpts = z, e.wrapXOFConstructorWithOpts = X;
  function ue(v = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(v));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(v));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ry);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = ry;
  class n extends t.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(o);
      const a = (0, t.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, p = new Uint8Array(c);
      p.set(a.length > c ? o.create().update(a).digest() : a);
      for (let g = 0; g < p.length; g++)
        p[g] ^= 54;
      this.iHash.update(p), this.oHash = o.create();
      for (let g = 0; g < p.length; g++)
        p[g] ^= 106;
      this.oHash.update(p), (0, t.clean)(p);
    }
    update(o) {
      return (0, t.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, t.aexists)(this), (0, t.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: p, blockLen: g, outputLen: h } = this;
      return o = o, o.finished = c, o.destroyed = p, o.blockLen = g, o.outputLen = h, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  e.hmac = r, e.hmac.create = (s, o) => new n(s, o);
})(ny);
const ni = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function sy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Pu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function _o(e, ...t) {
  if (!sy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Z2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Pu(e.outputLen), Pu(e.blockLen);
}
function Uu(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function oy(e, t) {
  _o(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Q2(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function J2(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Nc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function bc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function er(e, t) {
  return e << 32 - t | e >>> t;
}
function ex(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Xd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Wd(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const iy = Xd ? (e) => e : (e) => Wd(e), tx = iy;
function ay(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Wd(e[t]);
  return e;
}
const nx = Xd ? (e) => e : ay, cy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", rx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Zd(e) {
  if (_o(e), cy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += rx[e[n]];
  return t;
}
const Ur = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Oh(e) {
  if (e >= Ur._0 && e <= Ur._9)
    return e - Ur._0;
  if (e >= Ur.A && e <= Ur.F)
    return e - (Ur.A - 10);
  if (e >= Ur.a && e <= Ur.f)
    return e - (Ur.a - 10);
}
function sx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (cy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Oh(e.charCodeAt(o)), a = Oh(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const ly = async () => {
};
async function ox(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await ly(), r += o);
  }
}
function Qd(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function ix(e) {
  return new TextDecoder().decode(e);
}
function $a(e) {
  return typeof e == "string" && (e = Qd(e)), _o(e), e;
}
function ax(e) {
  return typeof e == "string" && (e = Qd(e)), _o(e), e;
}
function cx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    _o(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function lx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let uy = class {
};
function pl(e) {
  const t = (r) => e().update($a(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function dy(e) {
  const t = (r, s) => e(s).update($a(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function fy(e) {
  const t = (r, s) => e(s).update($a(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const ux = pl, dx = dy, fx = fy;
function hx(e = 32) {
  if (ni && typeof ni.getRandomValues == "function")
    return ni.getRandomValues(new Uint8Array(e));
  if (ni && typeof ni.randomBytes == "function")
    return Uint8Array.from(ni.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const px = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: uy,
  abytes: _o,
  aexists: Uu,
  ahash: Z2,
  anumber: Pu,
  aoutput: oy,
  asyncLoop: ox,
  byteSwap: Wd,
  byteSwap32: ay,
  byteSwapIfBE: tx,
  bytesToHex: Zd,
  bytesToUtf8: ix,
  checkOpts: lx,
  clean: Nc,
  concatBytes: cx,
  createHasher: pl,
  createOptHasher: dy,
  createView: bc,
  createXOFer: fy,
  hexToBytes: sx,
  isBytes: sy,
  isLE: Xd,
  kdfInputToBytes: ax,
  nextTick: ly,
  randomBytes: hx,
  rotl: ex,
  rotr: er,
  swap32IfBE: nx,
  swap8IfBE: iy,
  toBytes: $a,
  u32: J2,
  u8: Q2,
  utf8ToBytes: Qd,
  wrapConstructor: ux,
  wrapConstructorWithOpts: dx,
  wrapXOFConstructorWithOpts: fx
}, Symbol.toStringTag, { value: "Module" }));
function gx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
function yx(e, t, n) {
  return e & t ^ ~e & n;
}
function wx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class bx extends uy {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = bc(this.buffer);
  }
  update(t) {
    Uu(this), t = $a(t), _o(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = bc(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Uu(this), oy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Nc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    gx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = bc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = o, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const fs = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), mx = /* @__PURE__ */ Uint32Array.from([
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
]), ps = /* @__PURE__ */ new Uint32Array(64);
let Jd = class extends bx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ps[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ps[h - 15], y = ps[h - 2], S = er(w, 7) ^ er(w, 18) ^ w >>> 3, x = er(y, 17) ^ er(y, 19) ^ y >>> 10;
      ps[h] = x + ps[h - 7] + S + ps[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = er(a, 6) ^ er(a, 11) ^ er(a, 25), y = g + w + yx(a, c, p) + mx[h] + ps[h] | 0, x = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + wx(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    Nc(ps);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Nc(this.buffer);
  }
}, hy = class extends Jd {
  constructor() {
    super(28), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
};
const xx = /* @__PURE__ */ pl(() => new Jd()), Sx = /* @__PURE__ */ pl(() => new hy()), Ax = Jd, ef = xx, Ex = hy, vx = Sx, kx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Ex,
  SHA256: Ax,
  sha224: vx,
  sha256: ef
}, Symbol.toStringTag, { value: "Module" })), gl = /* @__PURE__ */ il(kx), $x = /* @__PURE__ */ il(M1);
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.joseToDer = vi.derToJose = void 0;
const py = ka, gy = gn;
function Xl(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const Ix = {
  ES256: Xl(256),
  ES384: Xl(384),
  ES512: Xl(521)
};
function yy(e) {
  const t = Ix[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const _c = 128, wy = 0, Lx = 32, Cx = 16, Tx = 2, by = Cx | Lx | wy << 6, Pc = Tx | wy << 6;
function my(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, py.toByteArray)((0, gy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Bx(e, t) {
  const n = my(e), r = yy(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== by)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (_c | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Pc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const p = i;
  if (i += c, n[i++] !== Pc)
    throw new Error('Could not find expected "int" for "s"');
  const g = n[i++];
  if (o - i !== g)
    throw new Error(`"s" specified length of "${g}", expected "${o - i}"`);
  if (s < g)
    throw new Error(`"s" specified length of "${g}", max of "${s}" is acceptable`);
  const h = i;
  if (i += g, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, y = r - g, S = new Uint8Array(w + c + y + g);
  for (i = 0; i < w; ++i)
    S[i] = 0;
  S.set(n.subarray(p + Math.max(-w, 0), p + c), i), i = r;
  for (const x = i; i < x + y; ++i)
    S[i] = 0;
  return S.set(n.subarray(h + Math.max(-y, 0), h + g), i), (0, gy.escape)((0, py.fromByteArray)(S));
}
vi.derToJose = Bx;
function Dh(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= _c && --r, r;
}
function Mx(e, t) {
  e = my(e);
  const n = yy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Dh(e, 0, n), o = Dh(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, p = c < _c, g = new Uint8Array((p ? 2 : 3) + c);
  let h = 0;
  return g[h++] = by, p ? g[h++] = c : (g[h++] = _c | 1, g[h++] = c & 255), g[h++] = Pc, g[h++] = i, s < 0 ? (g[h++] = 0, g.set(e.subarray(0, n), h), h += n) : (g.set(e.subarray(s, n), h), h += n - s), g[h++] = Pc, g[h++] = a, o < 0 ? (g[h++] = 0, g.set(e.subarray(n), h)) : g.set(e.subarray(n + o), h), g;
}
vi.joseToDer = Mx;
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.InvalidTokenError = Yr.MissingParametersError = void 0;
class Nx extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Yr.MissingParametersError = Nx;
class _x extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Yr.InvalidTokenError = _x;
const Ia = /* @__PURE__ */ il(px);
Object.defineProperty(fl, "__esModule", { value: !0 });
fl.SECP256K1Client = void 0;
const Px = ny, Ux = gl, mc = $x, Fh = vi, jh = Yr, Rh = Ia;
mc.utils.hmacSha256Sync = (e, ...t) => {
  const n = Px.hmac.create(Ux.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class xy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Rh.bytesToHex)(mc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new jh.MissingParametersError("a signing input hash and private key are all required");
    const s = mc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Rh.bytesToHex)(s);
    if (r === "jose")
      return (0, Fh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Fh.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new jh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return mc.verify(n, t, r, { strict: !1 });
  }
}
fl.SECP256K1Client = xy;
xy.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = fl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(dl);
var mo = {};
const Hx = /* @__PURE__ */ il(Ig);
var Ox = wn && wn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(g) {
      try {
        p(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        p(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function p(g) {
      g.done ? o(g.value) : s(g.value).then(a, c);
    }
    p((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(mo, "__esModule", { value: !0 });
mo.hashSha256Async = mo.hashSha256 = void 0;
const Dx = gl;
function Sy(e) {
  return (0, Dx.sha256)(e);
}
mo.hashSha256 = Sy;
function Fx(e) {
  return Ox(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Hx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Sy(e));
    }
  });
}
mo.hashSha256Async = Fx;
var jx = wn && wn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(g) {
      try {
        p(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        p(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function p(g) {
      g.done ? o(g.value) : s(g.value).then(a, c);
    }
    p((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.TokenSigner = Ei.createUnsecuredToken = void 0;
const Hu = gn, zh = dl, Rx = Yr, Gh = mo;
function Ou(e, t) {
  const n = [], r = Hu.encode(JSON.stringify(t));
  n.push(r);
  const s = Hu.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function zx(e) {
  return Ou(e, { typ: "JWT", alg: "none" }) + ".";
}
Ei.createUnsecuredToken = zx;
class Gx {
  constructor(t, n) {
    if (!(t && n))
      throw new Rx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !zh.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = zh.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Ou(t, s), i = (0, Gh.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return jx(this, void 0, void 0, function* () {
      const s = this.header(r), o = Ou(t, s), i = yield (0, Gh.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Hu.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
Ei.TokenSigner = Gx;
var yl = {};
Object.defineProperty(yl, "__esModule", { value: !0 });
yl.TokenVerifier = void 0;
const Kx = gn, Kh = dl, Vx = Yr, Ga = mo;
class Yx {
  constructor(t, n) {
    if (!(t && n))
      throw new Vx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Kh.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Kh.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Ga.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Ga.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), Kx.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ga.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Ga.hashSha256)(r);
      return o(i);
    }
  }
}
yl.TokenVerifier = Yx;
var wl = {};
Object.defineProperty(wl, "__esModule", { value: !0 });
wl.decodeToken = void 0;
const Ka = gn;
function qx(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(Ka.decode(t[0])), r = JSON.parse(Ka.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = Ka.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(Ka.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
wl.decodeToken = qx;
(function(e) {
  var t = wn && wn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = wn && wn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Ei, e), n(yl, e), n(wl, e), n(Yr, e), n(dl, e);
})(en);
function Xx(e) {
  return `did:btc-addr:${e}`;
}
function Wx(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new vh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new vh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Ay(e) {
  if (e)
    return Wx(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const Zx = "1.4.0";
function Qx() {
  return H2();
}
function Jx(e, t, n, r = wg.slice(), s, o = _m().getTime(), i = {}) {
  const a = (y) => {
    const S = Hd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: Um(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: Zx,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), p = en.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [p];
  const g = qg(p);
  return c.iss = Xx(g), new en.TokenSigner("ES256k", e).sign(c);
}
async function Vh(e, t) {
  const n = Ea(Ve(t)), r = JSON.parse(n), s = await Qg(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function eS(e) {
  const t = en.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new en.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function tS(e) {
  const t = en.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Ay(t.iss);
  if (n.length === 1) {
    if (qg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function nS(e) {
  const t = en.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.iat) {
    if (typeof t.iat != "number")
      return !1;
    const n = new Date(t.iat * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() < n.getTime());
  } else
    return !0;
}
function rS(e) {
  const t = en.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.exp) {
    if (typeof t.exp != "number")
      return !1;
    const n = new Date(t.exp * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() > n.getTime());
  } else
    return !0;
}
function sS(e) {
  const t = [
    rS(e),
    nS(e),
    eS(e),
    tS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Yh = "1.0.0";
class Hs {
  constructor(t) {
    this.version = Yh, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Yh)
      throw new Cu(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Hs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ey {
  constructor(t) {
    if (t) {
      const n = new Hs(t);
      this.setSessionData(n);
    }
  }
  getSessionData() {
    throw new Error("Abstract class");
  }
  setSessionData(t) {
    throw new Error("Abstract class");
  }
  deleteSessionData() {
    throw new Error("Abstract class");
  }
}
class qh extends Ey {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Hs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new bg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hs({})), !0;
  }
}
class Xh extends Ey {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = Bm, !localStorage.getItem(this.key)) {
      const r = new Hs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new bg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Hs.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Hs({})), !0;
  }
}
var da;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(da || (da = {}));
var Uc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Uc || (Uc = {}));
da.Mainnet;
var Gr;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Gr || (Gr = {}));
var Ar;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ar || (Ar = {}));
Gr.Mainnet;
const vy = {
  chainId: da.Mainnet,
  transactionVersion: Gr.Mainnet,
  peerNetworkId: Uc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ar.MainnetSingleSig,
    multiSig: Ar.MainnetMultiSig
  },
  client: { baseUrl: mg }
}, Du = {
  chainId: da.Testnet,
  transactionVersion: Gr.Testnet,
  peerNetworkId: Uc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ar.TestnetSingleSig,
    multiSig: Ar.TestnetMultiSig
  },
  client: { baseUrl: xg }
}, xc = {
  ...Du,
  addressVersion: { ...Du.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Sg }
}, oS = {
  ...xc,
  addressVersion: { ...xc.addressVersion },
  client: { ...xc.client }
};
function iS(e) {
  switch (e) {
    case "mainnet":
      return vy;
    case "testnet":
      return Du;
    case "devnet":
      return xc;
    case "mocknet":
      return oS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function ky(e) {
  return typeof e == "string" ? iS(e) : e;
}
var Wh;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Wh || (Wh = {}));
var Zh;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Zh || (Zh = {}));
var tr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(tr || (tr = {}));
const Wl = ["onChainOnly", "offChainOnly", "any"];
Wl[0] + "", tr.OnChainOnly, Wl[1] + "", tr.OffChainOnly, Wl[2] + "", tr.Any, tr.OnChainOnly + "", tr.OnChainOnly, tr.OffChainOnly + "", tr.OffChainOnly, tr.Any + "", tr.Any;
var Qh;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Qh || (Qh = {}));
var Jh;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Jh || (Jh = {}));
var ep;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(ep || (ep = {}));
var Rr;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Rr || (Rr = {}));
var tp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(tp || (tp = {}));
var np;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(np || (np = {}));
var rp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(rp || (rp = {}));
var sp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(sp || (sp = {}));
var op;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(op || (op = {}));
var ip;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ip || (ip = {}));
var ap;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ap || (ap = {}));
var cp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(cp || (cp = {}));
var lp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(lp || (lp = {}));
function Fu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function aS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function $y(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function cS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fu(e.outputLen), Fu(e.blockLen);
}
function lS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function uS(e, t) {
  $y(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const io = {
  number: Fu,
  bool: aS,
  bytes: $y,
  hash: cS,
  exists: lS,
  output: uS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), pr = (e, t) => e << 32 - t | e >>> t, dS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!dS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function fS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function tf(e) {
  if (typeof e == "string" && (e = fS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Iy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Po(e) {
  const t = (r) => e().update(tf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ly = class extends Iy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, io.hash(t);
    const r = tf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return io.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    io.exists(this), io.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Cy = (e, t, n) => new Ly(e, t).update(n).digest();
Cy.create = (e, t) => new Ly(e, t);
function hS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let nf = class extends Iy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Zl(this.buffer);
  }
  update(t) {
    io.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = tf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Zl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    io.exists(this), io.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    hS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Zl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const pS = (e, t, n) => e & t ^ ~e & n, gS = (e, t, n) => e & t ^ e & n ^ t & n, yS = new Uint32Array([
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
]), gs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ys = new Uint32Array(64);
let Ty = class extends nf {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ys[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ys[h - 15], y = ys[h - 2], S = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, x = pr(y, 17) ^ pr(y, 19) ^ y >>> 10;
      ys[h] = x + ys[h - 7] + S + ys[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), y = g + w + pS(a, c, p) + yS[h] + ys[h] | 0, x = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + gS(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, wS = class extends Ty {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const By = Po(() => new Ty());
Po(() => new wS());
var Uo = {}, rf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ia;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], p = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (p < 4) {
        const S = n.indexOf(i[y]) >> p;
        let x = 0;
        y !== 0 && (x = n.indexOf(i[y - 1]));
        const C = 1 + p, O = x % (1 << C) << 5 - C, U = e.c32[S + O];
        p = C, c.unshift(U);
      } else
        p = 0;
    let g = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      g++;
    c = c.slice(g);
    const h = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = h ? h[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let S = 0; S < y; S++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), p = c ? c[0].length : 0;
    let g = [], h = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (g.unshift(n[h]), w = 0, h = 0);
      const O = (e.c32.indexOf(i[x]) << w) + h, U = n[O % 16];
      if (w += 1, h = O >> 4, h > 1 << w)
        throw new Error("Panic error in decoding.");
      g.unshift(U);
    }
    g.unshift(n[h]), g.length % 2 === 1 && g.unshift("0");
    let y = 0;
    for (let x = 0; x < g.length && g[x] === "0"; x++)
      y++;
    g = g.slice(y - y % 2);
    let S = g.join("");
    for (let x = 0; x < p; x++)
      S = `00${S}`;
    if (a) {
      const x = a * 2 - S.length;
      for (let C = 0; C < x; C += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = o;
})(rf);
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.c32checkDecode = xo.c32checkEncode = void 0;
const up = gl, dp = Ia, oa = rf;
function My(e) {
  const t = (0, up.sha256)((0, up.sha256)((0, dp.hexToBytes)(e)));
  return (0, dp.bytesToHex)(t.slice(0, 4));
}
function bS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = My(`${n}${t}`), s = (0, oa.c32encode)(`${t}${r}`);
  return `${oa.c32[e]}${s}`;
}
xo.c32checkEncode = bS;
function mS(e) {
  e = (0, oa.c32normalize)(e);
  const t = (0, oa.c32decode)(e.slice(1)), n = e[0], r = oa.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), My(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
xo.c32checkDecode = mS;
var Ny = {}, ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.decode = ki.encode = void 0;
const Hc = gl, fp = Ia, _y = zg, Py = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function xS(e, t = "00") {
  const n = typeof e == "string" ? (0, fp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, fp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Hc.sha256)((0, Hc.sha256)(new Uint8Array([...r, ...n])));
  return _y(Py).encode([...r, ...n, ...s.slice(0, 4)]);
}
ki.encode = xS;
function SS(e) {
  const t = _y(Py).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Hc.sha256)((0, Hc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ki.decode = SS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = xo, n = ki, r = Ia;
  e.versions = {
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
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const o = {};
  o[e.versions.mainnet.p2pkh] = 0, o[e.versions.mainnet.p2sh] = 5, o[e.versions.testnet.p2pkh] = 111, o[e.versions.testnet.p2sh] = 196;
  function i(g, h) {
    if (!h.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(g, h)}`;
  }
  e.c32address = i;
  function a(g) {
    if (g.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (g[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(g.slice(1));
  }
  e.c32addressDecode = a;
  function c(g, h = -1) {
    const w = n.decode(g), y = (0, r.bytesToHex)(w.data), S = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return h < 0 ? (x = S, s[S] !== void 0 && (x = s[S])) : x = h, i(x, y);
  }
  e.b58ToC32 = c;
  function p(g, h = -1) {
    const w = a(g), y = w[0], S = w[1];
    let x;
    h < 0 ? (x = y, o[y] !== void 0 && (x = o[y])) : x = h;
    let C = x.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(S, C);
  }
  e.c32ToB58 = p;
})(Ny);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = rf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = xo;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ny;
  Object.defineProperty(e, "c32address", { enumerable: !0, get: function() {
    return r.c32address;
  } }), Object.defineProperty(e, "c32addressDecode", { enumerable: !0, get: function() {
    return r.c32addressDecode;
  } }), Object.defineProperty(e, "c32ToB58", { enumerable: !0, get: function() {
    return r.c32ToB58;
  } }), Object.defineProperty(e, "b58ToC32", { enumerable: !0, get: function() {
    return r.b58ToC32;
  } }), Object.defineProperty(e, "versions", { enumerable: !0, get: function() {
    return r.versions;
  } });
})(Uo);
function AS(e, t) {
  switch (t = ky(t ?? vy), e) {
    case Rr.P2PKH:
      switch (t.transactionVersion) {
        case Gr.Mainnet:
          return Ar.MainnetSingleSig;
        case Gr.Testnet:
          return Ar.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Rr.P2SH:
    case Rr.P2SHNonSequential:
    case Rr.P2WPKH:
    case Rr.P2WSH:
    case Rr.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Gr.Mainnet:
          return Ar.MainnetMultiSig;
        case Gr.Testnet:
          return Ar.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const ES = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Uy = Uint8Array.from({ length: 16 }, (e, t) => t), vS = Uy.map((e) => (9 * e + 5) % 16);
let sf = [Uy], of = [vS];
for (let e = 0; e < 4; e++)
  for (let t of [sf, of])
    t.push(t[e].map((n) => ES[n]));
const Hy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), kS = sf.map((e, t) => e.map((n) => Hy[t][n])), $S = of.map((e, t) => e.map((n) => Hy[t][n])), IS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), LS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Va = (e, t) => e << t | e >>> 32 - t;
function hp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ya = new Uint32Array(16);
let CS = class extends nf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ya[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = IS[y], C = LS[y], O = sf[y], U = of[y], E = kS[y], L = $S[y];
      for (let M = 0; M < 16; M++) {
        const G = Va(r + hp(y, o, a, p) + Ya[O[M]] + x, E[M]) + h | 0;
        r = h, h = p, p = Va(a, 10) | 0, a = o, o = G;
      }
      for (let M = 0; M < 16; M++) {
        const G = Va(s + hp(S, i, c, g) + Ya[U[M]] + C, L[M]) + w | 0;
        s = w, w = g, g = Va(c, 10) | 0, c = i, i = G;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const TS = Po(() => new CS()), qa = BigInt(2 ** 32 - 1), ju = BigInt(32);
function Oy(e, t = !1) {
  return t ? { h: Number(e & qa), l: Number(e >> ju & qa) } : { h: Number(e >> ju & qa) | 0, l: Number(e & qa) | 0 };
}
function BS(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Oy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const MS = (e, t) => BigInt(e >>> 0) << ju | BigInt(t >>> 0), NS = (e, t, n) => e >>> n, _S = (e, t, n) => e << 32 - n | t >>> n, PS = (e, t, n) => e >>> n | t << 32 - n, US = (e, t, n) => e << 32 - n | t >>> n, HS = (e, t, n) => e << 64 - n | t >>> n - 32, OS = (e, t, n) => e >>> n - 32 | t << 64 - n, DS = (e, t) => t, FS = (e, t) => e, jS = (e, t, n) => e << n | t >>> 32 - n, RS = (e, t, n) => t << n | e >>> 32 - n, zS = (e, t, n) => t << n - 32 | e >>> 64 - n, GS = (e, t, n) => e << n - 32 | t >>> 64 - n;
function KS(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const VS = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), YS = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, qS = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), XS = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, WS = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ZS = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Me = {
  fromBig: Oy,
  split: BS,
  toBig: MS,
  shrSH: NS,
  shrSL: _S,
  rotrSH: PS,
  rotrSL: US,
  rotrBH: HS,
  rotrBL: OS,
  rotr32H: DS,
  rotr32L: FS,
  rotlSH: jS,
  rotlSL: RS,
  rotlBH: zS,
  rotlBL: GS,
  add: KS,
  add3L: VS,
  add3H: YS,
  add4L: qS,
  add4H: XS,
  add5H: ZS,
  add5L: WS
}, [QS, JS] = Me.split([
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
].map((e) => BigInt(e))), ws = new Uint32Array(80), bs = new Uint32Array(80);
let bl = class extends nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: C } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ws[E] = t.getUint32(n), bs[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const L = ws[E - 15] | 0, M = bs[E - 15] | 0, G = Me.rotrSH(L, M, 1) ^ Me.rotrSH(L, M, 8) ^ Me.shrSH(L, M, 7), ee = Me.rotrSL(L, M, 1) ^ Me.rotrSL(L, M, 8) ^ Me.shrSL(L, M, 7), Z = ws[E - 2] | 0, Y = bs[E - 2] | 0, b = Me.rotrSH(Z, Y, 19) ^ Me.rotrBH(Z, Y, 61) ^ Me.shrSH(Z, Y, 6), k = Me.rotrSL(Z, Y, 19) ^ Me.rotrBL(Z, Y, 61) ^ Me.shrSL(Z, Y, 6), P = Me.add4L(ee, k, bs[E - 7], bs[E - 16]), _ = Me.add4H(P, G, b, ws[E - 7], ws[E - 16]);
      ws[E] = _ | 0, bs[E] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: C, Hh: O, Hl: U } = this;
    for (let E = 0; E < 80; E++) {
      const L = Me.rotrSH(h, w, 14) ^ Me.rotrSH(h, w, 18) ^ Me.rotrBH(h, w, 41), M = Me.rotrSL(h, w, 14) ^ Me.rotrSL(h, w, 18) ^ Me.rotrBL(h, w, 41), G = h & y ^ ~h & x, ee = w & S ^ ~w & C, Z = Me.add5L(U, M, ee, JS[E], bs[E]), Y = Me.add5H(Z, O, L, G, QS[E], ws[E]), b = Z | 0, k = Me.rotrSH(r, s, 28) ^ Me.rotrBH(r, s, 34) ^ Me.rotrBH(r, s, 39), P = Me.rotrSL(r, s, 28) ^ Me.rotrBL(r, s, 34) ^ Me.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, K = s & i ^ s & c ^ i & c;
      O = x | 0, U = C | 0, x = y | 0, C = S | 0, y = h | 0, S = w | 0, { h, l: w } = Me.add(p | 0, g | 0, Y | 0, b | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const T = Me.add3L(b, P, K);
      r = Me.add3H(T, Y, k, _), s = T | 0;
    }
    ({ h: r, l: s } = Me.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Me.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Me.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Me.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Me.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Me.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: C } = Me.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: O, l: U } = Me.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, C, O, U);
  }
  roundClean() {
    ws.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, eA = class extends bl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tA = class extends bl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nA = class extends bl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Po(() => new bl());
Po(() => new eA());
Po(() => new tA());
Po(() => new nA());
var Oc = { exports: {} };
Oc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", p = "[object Error]", g = "[object Function]", h = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", S = "[object Object]", x = "[object Promise]", C = "[object RegExp]", O = "[object Set]", U = "[object String]", E = "[object Symbol]", L = "[object WeakMap]", M = "[object ArrayBuffer]", G = "[object DataView]", ee = "[object Float32Array]", Z = "[object Float64Array]", Y = "[object Int8Array]", b = "[object Int16Array]", k = "[object Int32Array]", P = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", K = "[object Uint16Array]", T = "[object Uint32Array]", z = /[\\^$.*+?()[\]{}|]/g, X = /\w*$/, ue = /^\[object .+?Constructor\]$/, v = /^(?:0|[1-9]\d*)$/, H = {};
  H[o] = H[i] = H[M] = H[G] = H[a] = H[c] = H[ee] = H[Z] = H[Y] = H[b] = H[k] = H[w] = H[y] = H[S] = H[C] = H[O] = H[U] = H[E] = H[P] = H[_] = H[K] = H[T] = !0, H[p] = H[g] = H[L] = !1;
  var J = typeof wn == "object" && wn && wn.Object === Object && wn, ge = typeof self == "object" && self && self.Object === Object && self, me = J || ge || Function("return this")(), Se = t && !t.nodeType && t, bt = Se && !0 && e && !e.nodeType && e, Ie = bt && bt.exports === Se;
  function Le(m, N) {
    return m.set(N[0], N[1]), m;
  }
  function Ae(m, N) {
    return m.add(N), m;
  }
  function En(m, N) {
    for (var F = -1, le = m ? m.length : 0; ++F < le && N(m[F], F, m) !== !1; )
      ;
    return m;
  }
  function vn(m, N) {
    for (var F = -1, le = N.length, ct = m.length; ++F < le; )
      m[ct + F] = N[F];
    return m;
  }
  function Ue(m, N, F, le) {
    for (var ct = -1, It = m ? m.length : 0; ++ct < It; )
      F = N(F, m[ct], ct, m);
    return F;
  }
  function zt(m, N) {
    for (var F = -1, le = Array(m); ++F < m; )
      le[F] = N(F);
    return le;
  }
  function dt(m, N) {
    return m == null ? void 0 : m[N];
  }
  function kn(m) {
    var N = !1;
    if (m != null && typeof m.toString != "function")
      try {
        N = !!(m + "");
      } catch {
      }
    return N;
  }
  function tn(m) {
    var N = -1, F = Array(m.size);
    return m.forEach(function(le, ct) {
      F[++N] = [ct, le];
    }), F;
  }
  function Nt(m, N) {
    return function(F) {
      return m(N(F));
    };
  }
  function qt(m) {
    var N = -1, F = Array(m.size);
    return m.forEach(function(le) {
      F[++N] = le;
    }), F;
  }
  var $t = Array.prototype, ln = Function.prototype, jt = Object.prototype, Je = me["__core-js_shared__"], Re = function() {
    var m = /[^.]+$/.exec(Je && Je.keys && Je.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Xt = ln.toString, Rt = jt.hasOwnProperty, pt = jt.toString, gt = RegExp(
    "^" + Xt.call(Rt).replace(z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), $n = Ie ? me.Buffer : void 0, Qn = me.Symbol, I = me.Uint8Array, V = Nt(Object.getPrototypeOf, Object), j = Object.create, W = jt.propertyIsEnumerable, be = $t.splice, ve = Object.getOwnPropertySymbols, Ye = $n ? $n.isBuffer : void 0, yt = Nt(Object.keys, Object), Ke = ot(me, "DataView"), et = ot(me, "Map"), je = ot(me, "Promise"), $ = ot(me, "Set"), se = ot(me, "WeakMap"), he = ot(Object, "create"), Xe = mn(Ke), rt = mn(et), At = mn(je), ft = mn($), un = mn(se), Kt = Qn ? Qn.prototype : void 0, Zr = Kt ? Kt.valueOf : void 0;
  function Te(m) {
    var N = -1, F = m ? m.length : 0;
    for (this.clear(); ++N < F; ) {
      var le = m[N];
      this.set(le[0], le[1]);
    }
  }
  function Rs() {
    this.__data__ = he ? he(null) : {};
  }
  function zs(m) {
    return this.has(m) && delete this.__data__[m];
  }
  function Qr(m) {
    var N = this.__data__;
    if (he) {
      var F = N[m];
      return F === r ? void 0 : F;
    }
    return Rt.call(N, m) ? N[m] : void 0;
  }
  function jo(m) {
    var N = this.__data__;
    return he ? N[m] !== void 0 : Rt.call(N, m);
  }
  function Jr(m, N) {
    var F = this.__data__;
    return F[m] = he && N === void 0 ? r : N, this;
  }
  Te.prototype.clear = Rs, Te.prototype.delete = zs, Te.prototype.get = Qr, Te.prototype.has = jo, Te.prototype.set = Jr;
  function dn(m) {
    var N = -1, F = m ? m.length : 0;
    for (this.clear(); ++N < F; ) {
      var le = m[N];
      this.set(le[0], le[1]);
    }
  }
  function Br() {
    this.__data__ = [];
  }
  function Ro(m) {
    var N = this.__data__, F = fr(N, m);
    if (F < 0)
      return !1;
    var le = N.length - 1;
    return F == le ? N.pop() : be.call(N, F, 1), !0;
  }
  function ji(m) {
    var N = this.__data__, F = fr(N, m);
    return F < 0 ? void 0 : N[F][1];
  }
  function Ri(m) {
    return fr(this.__data__, m) > -1;
  }
  function _t(m, N) {
    var F = this.__data__, le = fr(F, m);
    return le < 0 ? F.push([m, N]) : F[le][1] = N, this;
  }
  dn.prototype.clear = Br, dn.prototype.delete = Ro, dn.prototype.get = ji, dn.prototype.has = Ri, dn.prototype.set = _t;
  function Vt(m) {
    var N = -1, F = m ? m.length : 0;
    for (this.clear(); ++N < F; ) {
      var le = m[N];
      this.set(le[0], le[1]);
    }
  }
  function Gs() {
    this.__data__ = {
      hash: new Te(),
      map: new (et || dn)(),
      string: new Te()
    };
  }
  function He(m) {
    return _r(this, m).delete(m);
  }
  function Pt(m) {
    return _r(this, m).get(m);
  }
  function es(m) {
    return _r(this, m).has(m);
  }
  function Ks(m, N) {
    return _r(this, m).set(m, N), this;
  }
  Vt.prototype.clear = Gs, Vt.prototype.delete = He, Vt.prototype.get = Pt, Vt.prototype.has = es, Vt.prototype.set = Ks;
  function fn(m) {
    this.__data__ = new dn(m);
  }
  function Fn() {
    this.__data__ = new dn();
  }
  function In(m) {
    return this.__data__.delete(m);
  }
  function wt(m) {
    return this.__data__.get(m);
  }
  function Mr(m) {
    return this.__data__.has(m);
  }
  function Vs(m, N) {
    var F = this.__data__;
    if (F instanceof dn) {
      var le = F.__data__;
      if (!et || le.length < n - 1)
        return le.push([m, N]), this;
      F = this.__data__ = new Vt(le);
    }
    return F.set(m, N), this;
  }
  fn.prototype.clear = Fn, fn.prototype.delete = In, fn.prototype.get = wt, fn.prototype.has = Mr, fn.prototype.set = Vs;
  function zi(m, N) {
    var F = d(m) || f(m) ? zt(m.length, String) : [], le = F.length, ct = !!le;
    for (var It in m)
      Rt.call(m, It) && !(ct && (It == "length" || Wo(It, le))) && F.push(It);
    return F;
  }
  function zo(m, N, F) {
    var le = m[N];
    (!(Rt.call(m, N) && l(le, F)) || F === void 0 && !(N in m)) && (m[N] = F);
  }
  function fr(m, N) {
    for (var F = m.length; F--; )
      if (l(m[F][0], N))
        return F;
    return -1;
  }
  function Ys(m, N) {
    return m && Xo(N, de(N), m);
  }
  function qs(m, N, F, le, ct, It, Ut) {
    var Wt;
    if (le && (Wt = It ? le(m, ct, It, Ut) : le(m)), Wt !== void 0)
      return Wt;
    if (!re(m))
      return m;
    var os = d(m);
    if (os) {
      if (Wt = Rn(m), !N)
        return Zs(m, Wt);
    } else {
      var we = jn(m), We = we == g || we == h;
      if (B(m))
        return Xs(m, N);
      if (we == S || we == o || We && !It) {
        if (kn(m))
          return It ? m : {};
        if (Wt = rs(We ? {} : m), !N)
          return Gi(m, Ys(Wt, m));
      } else {
        if (!H[we])
          return It ? m : {};
        Wt = Pr(m, we, qs, N);
      }
    }
    Ut || (Ut = new fn());
    var st = Ut.get(m);
    if (st)
      return st;
    if (Ut.set(m, Wt), !os)
      var nn = F ? Qs(m) : de(m);
    return En(nn || m, function(Qo, eo) {
      nn && (eo = Qo, Qo = m[eo]), zo(Wt, eo, qs(Qo, N, F, le, eo, m, Ut));
    }), Wt;
  }
  function Ln(m) {
    return re(m) ? j(m) : {};
  }
  function Go(m, N, F) {
    var le = N(m);
    return d(m) ? le : vn(le, F(m));
  }
  function Ko(m) {
    return pt.call(m);
  }
  function Vo(m) {
    if (!re(m) || Zo(m))
      return !1;
    var N = R(m) || kn(m) ? gt : ue;
    return N.test(mn(m));
  }
  function ts(m) {
    if (!Js(m))
      return yt(m);
    var N = [];
    for (var F in Object(m))
      Rt.call(m, F) && F != "constructor" && N.push(F);
    return N;
  }
  function Xs(m, N) {
    if (N)
      return m.slice();
    var F = new m.constructor(m.length);
    return m.copy(F), F;
  }
  function Cn(m) {
    var N = new m.constructor(m.byteLength);
    return new I(N).set(new I(m)), N;
  }
  function ns(m, N) {
    var F = N ? Cn(m.buffer) : m.buffer;
    return new m.constructor(F, m.byteOffset, m.byteLength);
  }
  function Ws(m, N, F) {
    var le = N ? F(tn(m), !0) : tn(m);
    return Ue(le, Le, new m.constructor());
  }
  function Nr(m) {
    var N = new m.constructor(m.source, X.exec(m));
    return N.lastIndex = m.lastIndex, N;
  }
  function Yo(m, N, F) {
    var le = N ? F(qt(m), !0) : qt(m);
    return Ue(le, Ae, new m.constructor());
  }
  function qe(m) {
    return Zr ? Object(Zr.call(m)) : {};
  }
  function qo(m, N) {
    var F = N ? Cn(m.buffer) : m.buffer;
    return new m.constructor(F, m.byteOffset, m.length);
  }
  function Zs(m, N) {
    var F = -1, le = m.length;
    for (N || (N = Array(le)); ++F < le; )
      N[F] = m[F];
    return N;
  }
  function Xo(m, N, F, le) {
    F || (F = {});
    for (var ct = -1, It = N.length; ++ct < It; ) {
      var Ut = N[ct], Wt = void 0;
      zo(F, Ut, Wt === void 0 ? m[Ut] : Wt);
    }
    return F;
  }
  function Gi(m, N) {
    return Xo(m, Tn(m), N);
  }
  function Qs(m) {
    return Go(m, de, Tn);
  }
  function _r(m, N) {
    var F = m.__data__;
    return ss(N) ? F[typeof N == "string" ? "string" : "hash"] : F.map;
  }
  function ot(m, N) {
    var F = dt(m, N);
    return Vo(F) ? F : void 0;
  }
  var Tn = ve ? Nt(ve, Object) : pe, jn = Ko;
  (Ke && jn(new Ke(new ArrayBuffer(1))) != G || et && jn(new et()) != w || je && jn(je.resolve()) != x || $ && jn(new $()) != O || se && jn(new se()) != L) && (jn = function(m) {
    var N = pt.call(m), F = N == S ? m.constructor : void 0, le = F ? mn(F) : void 0;
    if (le)
      switch (le) {
        case Xe:
          return G;
        case rt:
          return w;
        case At:
          return x;
        case ft:
          return O;
        case un:
          return L;
      }
    return N;
  });
  function Rn(m) {
    var N = m.length, F = m.constructor(N);
    return N && typeof m[0] == "string" && Rt.call(m, "index") && (F.index = m.index, F.input = m.input), F;
  }
  function rs(m) {
    return typeof m.constructor == "function" && !Js(m) ? Ln(V(m)) : {};
  }
  function Pr(m, N, F, le) {
    var ct = m.constructor;
    switch (N) {
      case M:
        return Cn(m);
      case a:
      case c:
        return new ct(+m);
      case G:
        return ns(m, le);
      case ee:
      case Z:
      case Y:
      case b:
      case k:
      case P:
      case _:
      case K:
      case T:
        return qo(m, le);
      case w:
        return Ws(m, le, F);
      case y:
      case U:
        return new ct(m);
      case C:
        return Nr(m);
      case O:
        return Yo(m, le, F);
      case E:
        return qe(m);
    }
  }
  function Wo(m, N) {
    return N = N ?? s, !!N && (typeof m == "number" || v.test(m)) && m > -1 && m % 1 == 0 && m < N;
  }
  function ss(m) {
    var N = typeof m;
    return N == "string" || N == "number" || N == "symbol" || N == "boolean" ? m !== "__proto__" : m === null;
  }
  function Zo(m) {
    return !!Re && Re in m;
  }
  function Js(m) {
    var N = m && m.constructor, F = typeof N == "function" && N.prototype || jt;
    return m === F;
  }
  function mn(m) {
    if (m != null) {
      try {
        return Xt.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function u(m) {
    return qs(m, !0, !0);
  }
  function l(m, N) {
    return m === N || m !== m && N !== N;
  }
  function f(m) {
    return D(m) && Rt.call(m, "callee") && (!W.call(m, "callee") || pt.call(m) == o);
  }
  var d = Array.isArray;
  function A(m) {
    return m != null && Q(m.length) && !R(m);
  }
  function D(m) {
    return ie(m) && A(m);
  }
  var B = Ye || fe;
  function R(m) {
    var N = re(m) ? pt.call(m) : "";
    return N == g || N == h;
  }
  function Q(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function re(m) {
    var N = typeof m;
    return !!m && (N == "object" || N == "function");
  }
  function ie(m) {
    return !!m && typeof m == "object";
  }
  function de(m) {
    return A(m) ? zi(m) : ts(m);
  }
  function pe() {
    return [];
  }
  function fe() {
    return !1;
  }
  e.exports = u;
})(Oc, Oc.exports);
var rA = Oc.exports;
const Dy = /* @__PURE__ */ hg(rA);
var Ru;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ru || (Ru = {}));
function sA(e, t) {
  return { type: Ru.Address, version: e, hash160: t };
}
function oA(e) {
  return Uo.c32address(e.version, e.hash160);
}
const iA = (e) => TS(By(e)), aA = (e) => xe(iA(e));
Mt.hmacSha256Sync = (e, ...t) => {
  const n = Cy.create(By, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function cA(e, t = "mainnet") {
  t = ky(t), e = typeof e == "string" ? Ve(e) : e;
  const n = AS(Rr.P2PKH, t), r = sA(n, aA(e));
  return oA(r);
}
function lA(e, t) {
  const n = en.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = cA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new en.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function uA(e, t = null) {
  let n;
  t ? n = lA(e, t) : n = en.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const pp = "_blockstackDidCheckEchoReply", dA = "echoReply", fA = "authContinuation";
function hA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function pA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[pp];
  if (typeof t == "boolean")
    return t;
  const n = hA(e.location.search), r = n[dA];
  if (r) {
    e[pp] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[fA];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class zu {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Ag();
    else
      throw new Nm("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Xh(t.sessionOptions) : this.store = new Xh() : t ? this.store = new qh(t.sessionOptions) : this.store = new qh();
  }
  makeAuthRequestToken(t, n, r, s, o, i = Pm().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Cu("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, Jx(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = Qx();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Hd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (pA())
        return ci.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      ci.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = s1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ua("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = en.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await sS(t))
      throw new Ua("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (Kl(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Vh(s, o.private_key);
          } catch {
            if (ci.warn("Failed decryption of appPrivateKey, will try to use as given"), !Mt.isValidPrivateKey(o.private_key))
              throw new Ua("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Vh(s, c);
          } catch {
            ci.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ua("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let p = Ym, g;
    Kl(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (p = o.hubUrl), Kl(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (g = o.associationToken);
    const h = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Ay(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: p,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: g
    }, w = o.profile_url;
    if (!h.profile && w) {
      const y = await n(w);
      if (!y.ok)
        h.profile = Object.assign({}, Tm);
      else {
        const S = await y.text(), x = JSON.parse(S);
        h.profile = uA(x[0].token);
      }
    } else
      h.profile = o.profile;
    return r.userData = h, this.store.setSessionData(r), h;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new Cu("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y2(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), q2(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
zu.prototype.makeAuthRequest = zu.prototype.makeAuthRequestToken;
const gA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], yA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = gA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!ml(r.id));
  return t.concat(n);
}, ml = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Fy = "STX_PROVIDER", So = () => typeof window > "u" ? null : window.localStorage.getItem(Fy), wA = (e) => {
  typeof window < "u" && window.localStorage.setItem(Fy, e);
}, bA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mA(e, t) {
  const n = {};
  return Object.assign(n, bA, t), await fetch(e, n);
}
function xA(e) {
  let t = mA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function SA(...e) {
  const { fetchLib: t, middlewares: n } = xA(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var $i;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})($i || ($i = {}));
var Ao;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ao || (Ao = {}));
var gp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(gp || (gp = {}));
const AA = "https://api.mainnet.hiro.so", EA = "https://api.testnet.hiro.so", vA = "http://localhost:3999", kA = ["mainnet", "testnet", "devnet", "mocknet"];
class Eo {
  constructor(t) {
    this.version = Ao.Mainnet, this.chainId = $i.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ao.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? SA();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
}
Eo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Gu();
    case "testnet":
      return new Ku();
    case "devnet":
      return new $A();
    case "mocknet":
      return new jy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${kA.join(", ")}`);
  }
};
Eo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Eo.fromName(e);
class Gu extends Eo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? AA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ao.Mainnet, this.chainId = $i.Mainnet;
  }
}
class Ku extends Eo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? EA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ao.Testnet, this.chainId = $i.Testnet;
  }
}
class jy extends Eo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? vA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ao.Testnet, this.chainId = $i.Testnet;
  }
}
const $A = jy;
var vo;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(vo || (vo = {}));
var Dc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Dc || (Dc = {}));
vo.Mainnet;
var ko;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ko || (ko = {}));
var $o;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})($o || ($o = {}));
ko.Mainnet;
const IA = {
  chainId: vo.Mainnet,
  transactionVersion: ko.Mainnet,
  peerNetworkId: Dc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: $o.MainnetSingleSig,
    multiSig: $o.MainnetMultiSig
  },
  client: { baseUrl: mg }
}, Vu = {
  chainId: vo.Testnet,
  transactionVersion: ko.Testnet,
  peerNetworkId: Dc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: $o.TestnetSingleSig,
    multiSig: $o.TestnetMultiSig
  },
  client: { baseUrl: xg }
}, Sc = {
  ...Vu,
  addressVersion: { ...Vu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Sg }
}, LA = {
  ...Sc,
  addressVersion: { ...Sc.addressVersion },
  client: { ...Sc.client }
};
function CA(e) {
  switch (e) {
    case "mainnet":
      return IA;
    case "testnet":
      return Vu;
    case "devnet":
      return Sc;
    case "mocknet":
      return LA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function TA(e) {
  return typeof e == "string" ? CA(e) : e;
}
function BA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const yp = /* @__PURE__ */ new Map();
function Ry(e, t) {
  const n = yp.get(e);
  if (n !== void 0)
    return n(t);
  const r = BA(e);
  return yp.set(e, r), Ry(e, t);
}
let ht = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? Ve(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return e1(this.readBytes(4), 0);
  }
  readUInt8() {
    return Qm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Wm(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = xe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = xe(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (Ry(t, r))
      return r;
    throw n(r);
  }
};
const MA = 128, NA = 128, zy = 16, fo = 32, Yu = 80, xl = 65, _A = 32, PA = 64, Fc = 34, UA = 1 + 16 * 1024 * 1024, HA = 165, OA = 16, DA = 16, FA = 20, jA = DA + 2 + FA, RA = jA + 4, zA = UA + (HA + OA * RA);
var nt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(nt || (nt = {}));
var qu;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(qu || (qu = {}));
var Nn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Nn || (Nn = {}));
const Ql = ["onChainOnly", "offChainOnly", "any"];
Ql[0] + "", Nn.OnChainOnly, Ql[1] + "", Nn.OffChainOnly, Ql[2] + "", Nn.Any, Nn.OnChainOnly + "", Nn.OnChainOnly, Nn.OffChainOnly + "", Nn.OffChainOnly, Nn.Any + "", Nn.Any;
var jc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(jc || (jc = {}));
var mt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(mt || (mt = {}));
var Tt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Tt || (Tt = {}));
var lt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(lt || (lt = {}));
var vt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(vt || (vt = {}));
var ia;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ia || (ia = {}));
var Xu;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Xu || (Xu = {}));
var Wu;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Wu || (Wu = {}));
var yn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(yn || (yn = {}));
var wp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(wp || (wp = {}));
var Zu;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Zu || (Zu = {}));
var or;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(or || (or = {}));
var bp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(bp || (bp = {}));
let Sl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, li = class extends Sl {
  constructor(t) {
    super(t);
  }
}, pn = class extends Sl {
  constructor(t) {
    super(t);
  }
}, Rc = class extends Sl {
  constructor(t) {
    super(t);
  }
}, ao = class extends Sl {
  constructor(t) {
    super(t);
  }
};
function Qu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function GA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Gy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function KA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Qu(e.outputLen), Qu(e.blockLen);
}
function VA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function YA(e, t) {
  Gy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const co = {
  number: Qu,
  bool: GA,
  bytes: Gy,
  hash: KA,
  exists: VA,
  output: YA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), gr = (e, t) => e << 32 - t | e >>> t, qA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function XA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function af(e) {
  if (typeof e == "string" && (e = XA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Ky = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ho(e) {
  const t = (r) => e().update(af(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Vy = class extends Ky {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, co.hash(t);
    const r = af(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return co.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    co.exists(this), co.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Yy = (e, t, n) => new Vy(e, t).update(n).digest();
Yy.create = (e, t) => new Vy(e, t);
function WA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let cf = class extends Ky {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Jl(this.buffer);
  }
  update(t) {
    co.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = af(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Jl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    co.exists(this), co.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    WA(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Jl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const ZA = (e, t, n) => e & t ^ ~e & n, QA = (e, t, n) => e & t ^ e & n ^ t & n, JA = new Uint32Array([
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
]), ms = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xs = new Uint32Array(64);
let qy = class extends cf {
  constructor() {
    super(64, 32, 8, !1), this.A = ms[0] | 0, this.B = ms[1] | 0, this.C = ms[2] | 0, this.D = ms[3] | 0, this.E = ms[4] | 0, this.F = ms[5] | 0, this.G = ms[6] | 0, this.H = ms[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      xs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = xs[h - 15], y = xs[h - 2], S = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, x = gr(y, 17) ^ gr(y, 19) ^ y >>> 10;
      xs[h] = x + xs[h - 7] + S + xs[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), y = g + w + ZA(a, c, p) + JA[h] + xs[h] | 0, x = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + QA(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, eE = class extends qy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const lf = Ho(() => new qy());
Ho(() => new eE());
const tE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xy = Uint8Array.from({ length: 16 }, (e, t) => t), nE = Xy.map((e) => (9 * e + 5) % 16);
let uf = [Xy], df = [nE];
for (let e = 0; e < 4; e++)
  for (let t of [uf, df])
    t.push(t[e].map((n) => tE[n]));
const Wy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), rE = uf.map((e, t) => e.map((n) => Wy[t][n])), sE = df.map((e, t) => e.map((n) => Wy[t][n])), oE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), iE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xa = (e, t) => e << t | e >>> 32 - t;
function mp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Wa = new Uint32Array(16);
let aE = class extends cf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Wa[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = oE[y], C = iE[y], O = uf[y], U = df[y], E = rE[y], L = sE[y];
      for (let M = 0; M < 16; M++) {
        const G = Xa(r + mp(y, o, a, p) + Wa[O[M]] + x, E[M]) + h | 0;
        r = h, h = p, p = Xa(a, 10) | 0, a = o, o = G;
      }
      for (let M = 0; M < 16; M++) {
        const G = Xa(s + mp(S, i, c, g) + Wa[U[M]] + C, L[M]) + w | 0;
        s = w, w = g, g = Xa(c, 10) | 0, c = i, i = G;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Wa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const cE = Ho(() => new aE()), Za = BigInt(2 ** 32 - 1), Ju = BigInt(32);
function Zy(e, t = !1) {
  return t ? { h: Number(e & Za), l: Number(e >> Ju & Za) } : { h: Number(e >> Ju & Za) | 0, l: Number(e & Za) | 0 };
}
function lE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Zy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const uE = (e, t) => BigInt(e >>> 0) << Ju | BigInt(t >>> 0), dE = (e, t, n) => e >>> n, fE = (e, t, n) => e << 32 - n | t >>> n, hE = (e, t, n) => e >>> n | t << 32 - n, pE = (e, t, n) => e << 32 - n | t >>> n, gE = (e, t, n) => e << 64 - n | t >>> n - 32, yE = (e, t, n) => e >>> n - 32 | t << 64 - n, wE = (e, t) => t, bE = (e, t) => e, mE = (e, t, n) => e << n | t >>> 32 - n, xE = (e, t, n) => t << n | e >>> 32 - n, SE = (e, t, n) => t << n - 32 | e >>> 64 - n, AE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function EE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const vE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), kE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, $E = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), IE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, LE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), CE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ne = {
  fromBig: Zy,
  split: lE,
  toBig: uE,
  shrSH: dE,
  shrSL: fE,
  rotrSH: hE,
  rotrSL: pE,
  rotrBH: gE,
  rotrBL: yE,
  rotr32H: wE,
  rotr32L: bE,
  rotlSH: mE,
  rotlSL: xE,
  rotlBH: SE,
  rotlBL: AE,
  add: EE,
  add3L: vE,
  add3H: kE,
  add4L: $E,
  add4H: IE,
  add5H: CE,
  add5L: LE
}, [TE, BE] = Ne.split([
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
].map((e) => BigInt(e))), Ss = new Uint32Array(80), As = new Uint32Array(80);
let Al = class extends cf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: C } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Ss[E] = t.getUint32(n), As[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const L = Ss[E - 15] | 0, M = As[E - 15] | 0, G = Ne.rotrSH(L, M, 1) ^ Ne.rotrSH(L, M, 8) ^ Ne.shrSH(L, M, 7), ee = Ne.rotrSL(L, M, 1) ^ Ne.rotrSL(L, M, 8) ^ Ne.shrSL(L, M, 7), Z = Ss[E - 2] | 0, Y = As[E - 2] | 0, b = Ne.rotrSH(Z, Y, 19) ^ Ne.rotrBH(Z, Y, 61) ^ Ne.shrSH(Z, Y, 6), k = Ne.rotrSL(Z, Y, 19) ^ Ne.rotrBL(Z, Y, 61) ^ Ne.shrSL(Z, Y, 6), P = Ne.add4L(ee, k, As[E - 7], As[E - 16]), _ = Ne.add4H(P, G, b, Ss[E - 7], Ss[E - 16]);
      Ss[E] = _ | 0, As[E] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: C, Hh: O, Hl: U } = this;
    for (let E = 0; E < 80; E++) {
      const L = Ne.rotrSH(h, w, 14) ^ Ne.rotrSH(h, w, 18) ^ Ne.rotrBH(h, w, 41), M = Ne.rotrSL(h, w, 14) ^ Ne.rotrSL(h, w, 18) ^ Ne.rotrBL(h, w, 41), G = h & y ^ ~h & x, ee = w & S ^ ~w & C, Z = Ne.add5L(U, M, ee, BE[E], As[E]), Y = Ne.add5H(Z, O, L, G, TE[E], Ss[E]), b = Z | 0, k = Ne.rotrSH(r, s, 28) ^ Ne.rotrBH(r, s, 34) ^ Ne.rotrBH(r, s, 39), P = Ne.rotrSL(r, s, 28) ^ Ne.rotrBL(r, s, 34) ^ Ne.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, K = s & i ^ s & c ^ i & c;
      O = x | 0, U = C | 0, x = y | 0, C = S | 0, y = h | 0, S = w | 0, { h, l: w } = Ne.add(p | 0, g | 0, Y | 0, b | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const T = Ne.add3L(b, P, K);
      r = Ne.add3H(T, Y, k, _), s = T | 0;
    }
    ({ h: r, l: s } = Ne.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ne.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ne.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Ne.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Ne.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Ne.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: C } = Ne.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: O, l: U } = Ne.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, C, O, U);
  }
  roundClean() {
    Ss.fill(0), As.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ME = class extends Al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, NE = class extends Al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, _E = class extends Al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ho(() => new Al());
Ho(() => new ME());
const PE = Ho(() => new NE());
Ho(() => new _E());
var ze;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(ze || (ze = {}));
var Gt;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(Gt || (Gt = {}));
function ff(e) {
  return Gt[e];
}
const UE = () => ({ type: ze.BoolTrue }), HE = () => ({ type: ze.BoolFalse }), OE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ze.Buffer, value: xe(e) };
}, xp = BigInt("0xffffffffffffffffffffffffffffffff"), DE = BigInt(0), Sp = BigInt("0x7fffffffffffffffffffffffffffffff"), Ap = BigInt("-170141183460469231731687303715884105728"), FE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Bu(Ve(e))), An(e, Uint8Array) && (e = Bu(e));
  const t = cn(e);
  if (t > Sp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Sp}`);
  if (t < Ap)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ap}`);
  return { type: ze.Int, value: t };
}, jE = (e) => {
  const t = cn(e);
  if (t < DE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > xp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${xp}`);
  return { type: ze.UInt, value: t };
};
function RE(e) {
  return { type: ze.List, value: e };
}
function Qy() {
  return { type: ze.OptionalNone };
}
function Jy(e) {
  return { type: ze.OptionalSome, value: e };
}
var ce;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ce || (ce = {}));
function zE() {
  return {
    type: ce.Address,
    version: $o.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ep(e) {
  if (e && cw(e, Fc))
    throw new Error(`Memo exceeds maximum length of ${Fc} bytes`);
  return { type: ce.MemoString, content: e };
}
function hf(e, t) {
  return {
    type: ce.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function ed(e) {
  if (Ve(e).byteLength != xl)
    throw Error("Invalid signature");
  return {
    type: ce.MessageSignature,
    data: e
  };
}
function GE(e, t, n) {
  return typeof e == "string" && (e = iv(e)), typeof n == "string" && (n = Ep(n)), {
    type: ce.Payload,
    payloadType: nt.TokenTransfer,
    recipient: e,
    amount: cn(t),
    memo: n ?? Ep("")
  };
}
function KE(e, t, n, r) {
  return typeof t == "string" && (t = lr(t)), typeof n == "string" && (n = lr(n)), {
    type: ce.Payload,
    payloadType: nt.ContractCall,
    contractAddress: typeof e == "string" ? js(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function VE(e) {
  return lr(e, 4, 1e5);
}
function vp(e, t, n) {
  return typeof e == "string" && (e = lr(e)), typeof t == "string" && (t = VE(t)), typeof n == "number" ? {
    type: ce.Payload,
    payloadType: nt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ce.Payload,
    payloadType: nt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function YE() {
  return { type: ce.Payload, payloadType: nt.PoisonMicroblock };
}
function kp(e, t) {
  if (e.byteLength != fo)
    throw Error(`Coinbase buffer size must be ${fo} bytes`);
  return t != null ? {
    type: ce.Payload,
    payloadType: nt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ce.Payload,
    payloadType: nt.Coinbase,
    coinbaseBytes: e
  };
}
function qE(e, t, n) {
  if (e.byteLength != fo)
    throw Error(`Coinbase buffer size must be ${fo} bytes`);
  if (n.byteLength != Yu)
    throw Error(`VRF proof buffer size must be ${Yu} bytes`);
  return {
    type: ce.Payload,
    payloadType: nt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ze.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function XE(e, t, n, r, s, o, i) {
  return {
    type: ce.Payload,
    payloadType: nt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function lr(e, t, n) {
  const r = t || 1, s = n || MA;
  if (cw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ce.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function WE(e, t, n) {
  return {
    type: ce.Asset,
    address: js(e),
    contractName: lr(t),
    assetName: lr(n)
  };
}
function js(e) {
  const t = Uo.c32addressDecode(e);
  return {
    type: ce.Address,
    version: t[0],
    hash160: t[1]
  };
}
function ZE(e, t) {
  const n = js(e), r = lr(t);
  return {
    type: ce.Principal,
    prefix: yn.Contract,
    address: n,
    contractName: r
  };
}
function QE(e) {
  const t = js(e);
  return {
    type: ce.Principal,
    prefix: yn.Standard,
    address: t
  };
}
function ui(e, t) {
  return {
    pubKeyEncoding: e,
    type: ce.TransactionAuthField,
    contents: t
  };
}
function Dr(e) {
  switch (e.type) {
    case ce.Address:
      return La(e);
    case ce.Principal:
      return ew(e);
    case ce.LengthPrefixedString:
      return Li(e);
    case ce.MemoString:
      return ev(e);
    case ce.Asset:
      return nw(e);
    case ce.PostCondition:
      return sw(e);
    case ce.PublicKey:
      return rd(e);
    case ce.LengthPrefixedList:
      return pf(e);
    case ce.Payload:
      return ow(e);
    case ce.TransactionAuthField:
      return ov(e);
    case ce.MessageSignature:
      return gf(e);
  }
}
function La(e) {
  const t = [];
  return t.push(Ve(Aa(e.version, 1))), t.push(Ve(e.hash160)), Dt(t);
}
function Ii(e) {
  const t = An(e, ht) ? e : new ht(e), n = al(xe(t.readBytes(1))), r = xe(t.readBytes(20));
  return { type: ce.Address, version: n, hash160: r };
}
function ew(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === yn.Standard || e.prefix === yn.Contract) && t.push(La(e.address)), e.prefix === yn.Contract && t.push(Li(e.contractName)), Dt(t);
}
function JE(e) {
  const t = An(e, ht) ? e : new ht(e), n = t.readUInt8Enum(yn, (o) => {
    throw new pn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === yn.Origin)
    return { type: ce.Principal, prefix: n };
  const r = Ii(t);
  if (n === yn.Standard)
    return { type: ce.Principal, prefix: n, address: r };
  const s = qn(t);
  return {
    type: ce.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Li(e) {
  const t = [], n = Mo(e.content), r = n.byteLength;
  return t.push(Ve(Aa(r, e.lengthPrefixBytes))), t.push(n), Dt(t);
}
function qn(e, t, n) {
  t = t || 1;
  const r = An(e, ht) ? e : new ht(e), s = al(xe(r.readBytes(t))), o = Ea(r.readBytes(s));
  return lr(o, t, n ?? 128);
}
function ev(e) {
  const t = [], n = Mo(e.content), r = Lv(xe(n), Fc * 2);
  return t.push(Ve(r)), Dt(t);
}
function tw(e) {
  const t = An(e, ht) ? e : new ht(e);
  let n = Ea(t.readBytes(Fc));
  return n = n.replace(/\u0000*$/, ""), { type: ce.MemoString, content: n };
}
function nw(e) {
  const t = [];
  return t.push(La(e.address)), t.push(Li(e.contractName)), t.push(Li(e.assetName)), Dt(t);
}
function td(e) {
  const t = An(e, ht) ? e : new ht(e);
  return {
    type: ce.Asset,
    address: Ii(t),
    contractName: qn(t),
    assetName: qn(t)
  };
}
function pf(e) {
  const t = e.values, n = [];
  n.push(Ve(Aa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Dr(r));
  return Dt(n);
}
function rw(e, t, n) {
  const r = An(e, ht) ? e : new ht(e), s = al(xe(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ce.Address:
        o.push(Ii(r));
        break;
      case ce.LengthPrefixedString:
        o.push(qn(r));
        break;
      case ce.MemoString:
        o.push(tw(r));
        break;
      case ce.Asset:
        o.push(td(r));
        break;
      case ce.PostCondition:
        o.push(nv(r));
        break;
      case ce.PublicKey:
        o.push(sd(r));
        break;
      case ce.TransactionAuthField:
        o.push(sv(r));
        break;
    }
  return hf(o, n);
}
function tv(e) {
  return xe(sw(e));
}
function sw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(ew(e.principal)), (e.conditionType === mt.Fungible || e.conditionType === mt.NonFungible) && t.push(nw(e.asset)), e.conditionType === mt.NonFungible && t.push(Er(e.assetName)), t.push(e.conditionCode), e.conditionType === mt.STX || e.conditionType === mt.Fungible || e.conditionType === mt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new li("The post-condition amount may not be larger than 8 bytes");
    t.push(Ds(e.amount, 8));
  }
  return Dt(t);
}
function nv(e) {
  const t = An(e, ht) ? e : new ht(e), n = t.readUInt8Enum(mt, (a) => {
    throw new pn(`Could not read ${a} as PostConditionType`);
  }), r = JE(t);
  let s, o, i;
  switch (n) {
    case mt.STX:
      return s = t.readUInt8Enum(ia, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${xe(t.readBytes(8))}`), {
        type: ce.PostCondition,
        conditionType: mt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case mt.Fungible:
      return o = td(t), s = t.readUInt8Enum(ia, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${xe(t.readBytes(8))}`), {
        type: ce.PostCondition,
        conditionType: mt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case mt.NonFungible:
      o = td(t);
      const a = xr(t);
      return s = t.readUInt8Enum(Xu, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ce.PostCondition,
        conditionType: mt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case mt.Staking:
      return s = t.readUInt8Enum(ia, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${xe(t.readBytes(8))}`), {
        type: ce.PostCondition,
        conditionType: mt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case mt.PoX: {
      const c = t.readUInt8Enum(Wu, (p) => {
        throw new pn(`Could not read ${p} as PoxConditionCode`);
      });
      return {
        type: ce.PostCondition,
        conditionType: mt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function ow(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case nt.TokenTransfer:
      t.push(Er(e.recipient)), t.push(Ds(e.amount, 8)), t.push(Dr(e.memo));
      break;
    case nt.ContractCall:
      t.push(Dr(e.contractAddress)), t.push(Dr(e.contractName)), t.push(Dr(e.functionName));
      const n = new Uint8Array(4);
      yo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Er(r));
      });
      break;
    case nt.SmartContract:
      t.push(Dr(e.contractName)), t.push(Dr(e.codeBody));
      break;
    case nt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Dr(e.contractName)), t.push(Dr(e.codeBody));
      break;
    case nt.PoisonMicroblock:
      break;
    case nt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case nt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Er(e.recipient));
      break;
    case nt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Er(e.recipient ? Jy(e.recipient) : Qy())), t.push(e.vrfProof);
      break;
    case nt.TenureChange:
      t.push(Ve(e.tenureHash)), t.push(Ve(e.previousTenureHash)), t.push(Ve(e.burnViewHash)), t.push(Ve(e.previousTenureEnd)), t.push(yo(new Uint8Array(4), e.previousTenureBlocks)), t.push(Jm(new Uint8Array(1), e.cause)), t.push(Ve(e.publicKeyHash));
      break;
  }
  return Dt(t);
}
function rv(e) {
  const t = An(e, ht) ? e : new ht(e);
  switch (t.readUInt8Enum(nt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case nt.TokenTransfer:
      const r = xr(t), s = cn(t.readBytes(8)), o = tw(t);
      return GE(r, s, o);
    case nt.ContractCall:
      const i = Ii(t), a = qn(t), c = qn(t), p = [], g = t.readUInt32BE();
      for (let L = 0; L < g; L++) {
        const M = xr(t);
        p.push(M);
      }
      return KE(i, a, c, p);
    case nt.SmartContract:
      const h = qn(t), w = qn(t, 4, 1e5);
      return vp(h, w);
    case nt.VersionedSmartContract: {
      const L = t.readUInt8Enum(qu, (ee) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ee}`);
      }), M = qn(t), G = qn(t, 4, zA);
      return vp(M, G, L);
    }
    case nt.PoisonMicroblock:
      return YE();
    case nt.Coinbase: {
      const L = t.readBytes(fo);
      return kp(L);
    }
    case nt.CoinbaseToAltRecipient: {
      const L = t.readBytes(fo), M = xr(t);
      return kp(L, M);
    }
    case nt.NakamotoCoinbase: {
      const L = t.readBytes(fo), M = xr(t), G = t.readBytes(Yu);
      return qE(L, M, G);
    }
    case nt.TenureChange:
      const y = xe(t.readBytes(20)), S = xe(t.readBytes(20)), x = xe(t.readBytes(20)), C = xe(t.readBytes(32)), O = t.readUInt32BE(), U = t.readUInt8Enum(Zu, (L) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${L}`);
      }), E = xe(t.readBytes(20));
      return XE(y, S, x, C, O, U, E);
  }
}
function nd(e) {
  const t = An(e, ht) ? e : new ht(e);
  return ed(xe(t.readBytes(xl)));
}
function sv(e) {
  const t = An(e, ht) ? e : new ht(e), n = t.readUInt8Enum(or, (r) => {
    throw new pn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case or.PublicKeyCompressed:
      return ui(vt.Compressed, sd(t));
    case or.PublicKeyUncompressed:
      return ui(vt.Uncompressed, Ui(Dv(sd(t).data)));
    case or.SignatureCompressed:
      return ui(vt.Compressed, nd(t));
    case or.SignatureUncompressed:
      return ui(vt.Uncompressed, nd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function gf(e) {
  return Ve(e.data);
}
function ov(e) {
  const t = [];
  switch (e.contents.type) {
    case ce.PublicKey:
      t.push(e.pubKeyEncoding === vt.Compressed ? or.PublicKeyCompressed : or.PublicKeyUncompressed), t.push(Ve(Ov(e.contents.data)));
      break;
    case ce.MessageSignature:
      t.push(e.pubKeyEncoding === vt.Compressed ? or.SignatureCompressed : or.SignatureUncompressed), t.push(gf(e.contents));
      break;
  }
  return Dt(t);
}
function rd(e) {
  return e.data.slice();
}
function sd(e) {
  const t = An(e, ht) ? e : new ht(e), n = t.readUInt8(), r = n === 4 ? PA : _A;
  return Ui(Dt([n, t.readBytes(r)]));
}
function yf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === lt.P2PKH || t === lt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === lt.P2WPKH || t === lt.P2WSH || t === lt.P2WSHNonSequential) && !r.map((s) => s.data).every(Hi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case lt.P2PKH:
      return Qa(e, Cv(r[0].data));
    case lt.P2WPKH:
      return Qa(e, Tv(r[0].data));
    case lt.P2SH:
    case lt.P2SHNonSequential:
      return Qa(e, Bv(n, r.map(rd)));
    case lt.P2WSH:
    case lt.P2WSHNonSequential:
      return Qa(e, Mv(n, r.map(rd)));
  }
}
function Qa(e, t) {
  return { type: ce.Address, version: e, hash160: t };
}
function wf(e) {
  return Uo.c32address(e.version, e.hash160);
}
function $p(e) {
  const [t, n, r] = e.split(/\.|::/);
  return WE(t, n, r);
}
function Xi(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ZE(t, n);
  } else
    return QE(e);
}
function iv(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return lv(t, n);
  } else
    return av(e);
}
function av(e) {
  const t = js(e);
  return { type: ze.PrincipalStandard, value: wf(t) };
}
function cv(e) {
  return { type: ze.PrincipalStandard, value: wf(e) };
}
function lv(e, t) {
  const n = js(e), r = lr(t);
  return iw(n, r);
}
function iw(e, t) {
  if (Mo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ze.PrincipalContract,
    value: `${wf(e)}.${t.content}`
  };
}
function uv(e) {
  return { type: ze.ResponseErr, value: e };
}
function dv(e) {
  return { type: ze.ResponseOk, value: e };
}
const fv = (e) => ({ type: ze.StringASCII, value: e }), hv = (e) => ({ type: ze.StringUTF8, value: e });
function pv(e) {
  for (const t in e)
    if (!Nv(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ze.Tuple, value: e };
}
function xr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ht(Ve(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ht(e) : t = e;
  switch (t.readUInt8Enum(Gt, (r) => {
    throw new pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Gt.int:
      return FE(Bu(t.readBytes(16)));
    case Gt.uint:
      return jE(t.readBytes(16));
    case Gt.buffer:
      const r = t.readUInt32BE();
      return OE(t.readBytes(r));
    case Gt.true:
      return UE();
    case Gt.false:
      return HE();
    case Gt.address:
      const s = Ii(t);
      return cv(s);
    case Gt.contract:
      const o = Ii(t), i = qn(t);
      return iw(o, i);
    case Gt.ok:
      return dv(xr(t));
    case Gt.err:
      return uv(xr(t));
    case Gt.none:
      return Qy();
    case Gt.some:
      return Jy(xr(t));
    case Gt.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(xr(t));
      return RE(c);
    case Gt.tuple:
      const p = t.readUInt32BE(), g = {};
      for (let x = 0; x < p; x++) {
        const C = qn(t).content;
        if (C === void 0)
          throw new pn('"content" is undefined');
        g[C] = xr(t);
      }
      return pv(g);
    case Gt.ascii:
      const h = t.readUInt32BE(), w = Km(t.readBytes(h));
      return fv(w);
    case Gt.utf8:
      const y = t.readUInt32BE(), S = Ea(t.readBytes(y));
      return hv(S);
    default:
      throw new pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Lr(e, t) {
  return Dt([ff(e), t]);
}
function gv(e) {
  return new Uint8Array([ff(e.type)]);
}
function yv(e) {
  return e.type === ze.OptionalNone ? new Uint8Array([ff(e.type)]) : Lr(e.type, Er(e.value));
}
function wv(e) {
  const t = new Uint8Array(4);
  return yo(t, Math.ceil(e.value.length / 2), 0), Lr(e.type, $r(t, Ve(e.value)));
}
function bv(e) {
  const t = Od(Fm(BigInt(e.value), BigInt(NA)), zy);
  return Lr(e.type, t);
}
function mv(e) {
  const t = Od(BigInt(e.value), zy);
  return Lr(e.type, t);
}
function xv(e) {
  return Lr(e.type, La(js(e.value)));
}
function Sv(e) {
  const [t, n] = _v(e.value);
  return Lr(e.type, $r(La(js(t)), Li(lr(n))));
}
function Av(e) {
  return Lr(e.type, Er(e.value));
}
function Ev(e) {
  const t = [], n = new Uint8Array(4);
  yo(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = Er(r);
    t.push(s);
  }
  return Lr(e.type, Dt(t));
}
function vv(e) {
  const t = [], n = new Uint8Array(4);
  yo(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = lr(s);
    t.push(Li(o));
    const i = Er(e.value[s]);
    t.push(i);
  }
  return Lr(e.type, Dt(t));
}
function aw(e, t) {
  const n = [], r = t == "ascii" ? Gm(e.value) : Mo(e.value), s = new Uint8Array(4);
  return yo(s, r.length, 0), n.push(s), n.push(r), Lr(e.type, Dt(n));
}
function kv(e) {
  return aw(e, "ascii");
}
function $v(e) {
  return aw(e, "utf8");
}
function Ip(e) {
  return xe(Er(e));
}
function Er(e) {
  switch (e.type) {
    case ze.BoolTrue:
    case ze.BoolFalse:
      return gv(e);
    case ze.OptionalNone:
    case ze.OptionalSome:
      return yv(e);
    case ze.Buffer:
      return wv(e);
    case ze.UInt:
      return mv(e);
    case ze.Int:
      return bv(e);
    case ze.PrincipalStandard:
      return xv(e);
    case ze.PrincipalContract:
      return Sv(e);
    case ze.ResponseOk:
    case ze.ResponseErr:
      return Av(e);
    case ze.List:
      return Ev(e);
    case ze.Tuple:
      return vv(e);
    case ze.StringASCII:
      return kv(e);
    case ze.StringUTF8:
      return $v(e);
    default:
      throw new li("Unable to serialize. Invalid Clarity Value.");
  }
}
const Iv = (e) => e.length % 2 ? `0${e}` : e, Lv = (e, t) => e.padEnd(t, "0"), cw = (e, t) => e ? Mo(e).length > t : !1;
function od(e) {
  return Dy(e);
}
const fa = (e) => cE(lf(e)), bf = (e) => xe(PE(e)), Cv = (e) => xe(fa(e)), Tv = (e) => {
  const t = fa(e), n = $r(new Uint8Array([0]), new Uint8Array([t.length]), t), r = fa(n);
  return xe(r);
}, Bv = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Dt(n), s = fa(r);
  return xe(s);
}, Mv = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Dt(n), s = lf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Dt(o), a = fa(i);
  return xe(a);
};
function Nv(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function _v(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Mt.hmacSha256Sync = (e, ...t) => {
  const n = Yy.create(lf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ui(e) {
  return e = typeof e == "string" ? Ve(e) : e, {
    type: ce.PublicKey,
    data: e
  };
}
function Pv(e, t, n = vt.Compressed) {
  const r = Xm(t), s = new Hn(Ih(r.r), Ih(r.s)), o = De.fromSignature(e, s, r.recoveryId), i = n === vt.Compressed;
  return o.toHex(i);
}
function Uv(e) {
  return typeof e == "string" ? e : xe(e);
}
const mf = Uv;
function lw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === qm;
}
function Hi(e) {
  return !mf(e).startsWith("04");
}
function Hv(e) {
  e = Dd(e);
  const t = lw(e);
  return xe(va(e.slice(0, 32), t));
}
function Ov(e) {
  return De.fromHex(mf(e)).toHex(!0);
}
function Dv(e) {
  return De.fromHex(mf(e)).toHex(!1);
}
function Fv(e, t) {
  e = Dd(e);
  const [n, r] = ll(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Aa(r, 1) + Hn.fromHex(n).toCompactHex();
}
function xf() {
  return {
    type: ce.MessageSignature,
    data: xe(new Uint8Array(xl))
  };
}
function uw(e, t, n, r) {
  const s = yf(0, e, 1, [Ui(t)]).hash160, o = Hi(t) ? vt.Compressed : vt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: cn(n),
    fee: cn(r),
    keyEncoding: o,
    signature: xf()
  };
}
function ha(e) {
  return "signature" in e;
}
function Lp(e) {
  return e === lt.P2SH || e === lt.P2WSH;
}
function jv(e) {
  return e === lt.P2SHNonSequential || e === lt.P2WSHNonSequential;
}
function Cp(e) {
  const t = od(e);
  return t.nonce = 0, t.fee = 0, ha(t) ? t.signature = xf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Rv(e) {
  const t = [
    e.hashMode,
    Ve(e.signer),
    Ds(e.nonce, 8),
    Ds(e.fee, 8),
    e.keyEncoding,
    gf(e.signature)
  ];
  return Dt(t);
}
function zv(e) {
  const t = [
    e.hashMode,
    Ve(e.signer),
    Ds(e.nonce, 8),
    Ds(e.fee, 8)
  ], n = hf(e.fields);
  t.push(pf(n));
  const r = new Uint8Array(2);
  return Zm(r, e.signaturesRequired, 0), t.push(r), Dt(t);
}
function Gv(e, t) {
  const n = xe(t.readBytes(20)), r = BigInt(`0x${xe(t.readBytes(8))}`), s = BigInt(`0x${xe(t.readBytes(8))}`), o = t.readUInt8Enum(vt, (a) => {
    throw new pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === lt.P2WPKH && o != vt.Compressed)
    throw new pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = nd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function Kv(e, t) {
  const n = xe(t.readBytes(20)), r = BigInt("0x" + xe(t.readBytes(8))), s = BigInt("0x" + xe(t.readBytes(8))), o = rw(t, ce.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const p of o)
    switch (p.contents.type) {
      case ce.PublicKey:
        Hi(p.contents.data) || (i = !0);
        break;
      case ce.MessageSignature:
        if (p.pubKeyEncoding === vt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new ao("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === lt.P2WSH || e === lt.P2WSHNonSequential))
    throw new ao("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function eu(e) {
  return ha(e) ? Rv(e) : zv(e);
}
function tu(e) {
  const t = e.readUInt8Enum(lt, (n) => {
    throw new pn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === lt.P2PKH || t === lt.P2WPKH ? Gv(t, e) : Kv(t, e);
}
function dw(e, t, n, r) {
  const o = e + xe(new Uint8Array([t])) + xe(Ds(n, 8)) + xe(Ds(r, 8));
  if (Ve(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return bf(Ve(o));
}
function fw(e, t, n) {
  const r = 33 + xl, s = Hi(t.data) ? vt.Compressed : vt.Uncompressed, o = e + Iv(s.toString(16)) + n, i = Ve(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return bf(i);
}
function Vv(e, t, n, r, s) {
  const o = dw(e, t, n, r), i = Fv(s, o), a = Ui(Hv(s)), c = fw(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function hw(e, t, n, r, s, o) {
  const i = dw(e, t, n, r), a = Ui(Pv(i, o, s)), c = fw(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Yv() {
  const e = uw(lt.P2PKH, "", 0, 0);
  return e.signer = zE().hash160, e.keyEncoding = vt.Compressed, e.signature = xf(), e;
}
function Tp(e, t, n) {
  return ha(e) ? qv(e, t, n) : Xv(e, t, n);
}
function qv(e, t, n) {
  const { pubKey: r, nextSigHash: s } = hw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = yf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new ao(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Xv(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ce.PublicKey:
        Hi(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ce.MessageSignature:
        c.pubKeyEncoding === vt.Uncompressed && (o = !0);
        const { pubKey: p, nextSigHash: g } = hw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Lp(e.hashMode) && (s = g), r.push(p), i += 1, i === 65536)
          throw new ao("Too many signatures");
        break;
    }
  if (Lp(e.hashMode) && i !== e.signaturesRequired || jv(e.hashMode) && i < e.signaturesRequired)
    throw new ao("Incorrect number of signatures");
  if (o && (e.hashMode === lt.P2WSH || e.hashMode === lt.P2WSHNonSequential))
    throw new ao("Uncompressed keys are not allowed in this hash mode");
  const a = yf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new ao(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function pw(e) {
  return {
    authType: Tt.Standard,
    spendingCondition: e
  };
}
function gw(e, t) {
  return {
    authType: Tt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || uw(lt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Bp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Tt.Standard:
        return pw(Cp(e.spendingCondition));
      case Tt.Sponsored:
        return gw(Cp(e.spendingCondition), Yv());
      default:
        throw new Rc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Wv(e, t) {
  switch (e.authType) {
    case Tt.Standard:
      return Tp(e.spendingCondition, t, Tt.Standard);
    case Tt.Sponsored:
      return Tp(e.spendingCondition, t, Tt.Standard);
    default:
      throw new Rc("Invalid origin auth type");
  }
}
function Zv(e, t) {
  switch (e.authType) {
    case Tt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: cn(t)
      };
      return { ...e, spendingCondition: n };
    case Tt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: cn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Qv(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: cn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Jv(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: cn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function e3(e, t) {
  const n = {
    ...t,
    nonce: cn(t.nonce),
    fee: cn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function t3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Tt.Standard:
      t.push(eu(e.spendingCondition));
      break;
    case Tt.Sponsored:
      t.push(eu(e.spendingCondition)), t.push(eu(e.sponsorSpendingCondition));
      break;
  }
  return Dt(t);
}
function n3(e) {
  const t = e.readUInt8Enum(Tt, (r) => {
    throw new pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Tt.Standard:
      return n = tu(e), pw(n);
    case Tt.Sponsored:
      n = tu(e);
      const r = tu(e);
      return gw(n, r);
  }
}
class r3 {
  constructor({ auth: t, payload: n, postConditions: r = hf([]), postConditionMode: s = jc.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = TA(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: cn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Nn.Any;
  }
  signBegin() {
    const t = od(this);
    return t.auth = Bp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = od(this);
    return t.auth = Bp(t.auth), t.txid();
  }
  verifyOrigin() {
    return Wv(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Tt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Tt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Tt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Ui(t), r = this.auth.spendingCondition;
    if (r && !ha(r)) {
      const s = Hi(n.data);
      r.fields.push(ui(s ? vt.Compressed : vt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = Vv(n, r, t.fee, t.nonce, s);
    if (ha(t))
      t.signature = ed(o);
    else {
      const a = lw(s);
      t.fields.push(ui(a ? vt.Compressed : vt.Uncompressed, ed(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return bf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Tt.Sponsored)
      throw new Rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e3(this.auth, t);
  }
  setFee(t) {
    this.auth = Zv(this.auth, t);
  }
  setNonce(t) {
    this.auth = Qv(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Tt.Sponsored)
      throw new Rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Jv(this.auth, t);
  }
  serialize() {
    return xe(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new li('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new li('"chainId" is undefined');
    if (this.auth === void 0)
      throw new li('"auth" is undefined');
    if (this.payload === void 0)
      throw new li('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return yo(n, this.chainId, 0), t.push(n), t.push(t3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(pf(this.postConditions)), t.push(ow(this.payload)), Dt(t);
  }
}
function s3(e) {
  const t = An(e, ht) ? e : new ht(e), n = t.readUInt8Enum(ko, (g) => {
    throw new Error(`Could not parse ${g} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = n3(t), o = t.readUInt8Enum(Nn, (g) => {
    throw new Error(`Could not parse ${g} as AnchorMode`);
  }), i = t.readUInt8Enum(jc, (g) => {
    throw new Error(`Could not parse ${g} as PostConditionMode`);
  }), a = rw(t, ce.PostCondition), c = rv(t), p = new r3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return p.anchorMode = o, p;
}
const Mp = BigInt("18446744073709551615");
function nu(e) {
  const t = cn(e);
  if (t < 0n || t > Mp)
    throw new RangeError(`Post-condition amount must be between 0 and ${Mp} (u64 max), received: ${t}`);
  return t;
}
var id;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(id || (id = {}));
var ad;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(ad || (ad = {}));
function o3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ce.PostCondition,
        conditionType: mt.STX,
        principal: e.address === "origin" ? { type: ce.Principal, prefix: yn.Origin } : Xi(e.address),
        conditionCode: Ja(e.condition),
        amount: nu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ce.PostCondition,
        conditionType: mt.Fungible,
        principal: e.address === "origin" ? { type: ce.Principal, prefix: yn.Origin } : Xi(e.address),
        conditionCode: Ja(e.condition),
        amount: nu(e.amount),
        asset: $p(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ce.PostCondition,
        conditionType: mt.NonFungible,
        principal: e.address === "origin" ? { type: ce.Principal, prefix: yn.Origin } : Xi(e.address),
        conditionCode: Ja(e.condition),
        asset: $p(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ce.PostCondition,
        conditionType: mt.Staking,
        principal: e.address === "origin" ? { type: ce.Principal, prefix: yn.Origin } : Xi(e.address),
        conditionCode: Ja(e.condition),
        amount: nu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ce.PostCondition,
        conditionType: mt.PoX,
        principal: e.address === "origin" ? { type: ce.Principal, prefix: yn.Origin } : Xi(e.address),
        conditionCode: i3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ja(e) {
  return id[e];
}
function i3(e) {
  return ad[e];
}
function yw(e) {
  const t = o3(e);
  return tv(t);
}
function a3(e, t, n) {
  return Af(ww(e), n);
}
function ww(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = pa(r);
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
function Sf(e, t = 8) {
  return (typeof e == "bigint" ? e : ww(e)).toString(16).padStart(t * 2, "0");
}
function Af(e, t = 16) {
  const n = Sf(e, t);
  return pa(n);
}
function c3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const l3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function u3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += l3[n];
  return t;
}
function pa(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Ef(e) {
  return new TextEncoder().encode(e);
}
function d3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function f3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Np(e) {
  if (e.some(f3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function vf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Wr(e) {
  return vf(...e.map((t) => typeof t == "number" ? Np([t]) : t instanceof Array ? Np(t) : t));
}
function El(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var cd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(cd || (cd = {}));
cd.Mainnet;
const h3 = 128, p3 = 128, bw = 16;
var ld;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ld || (ld = {}));
var _p;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_p || (_p = {}));
var Pp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Pp || (Pp = {}));
var nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(nr || (nr = {}));
const ru = ["onChainOnly", "offChainOnly", "any"];
ru[0] + "", nr.OnChainOnly, ru[1] + "", nr.OffChainOnly, ru[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var ud;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ud || (ud = {}));
ud.Mainnet;
var Up;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Up || (Up = {}));
var ro;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ro || (ro = {}));
var Hp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Hp || (Hp = {}));
var Op;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Op || (Op = {}));
var Dp;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Dp || (Dp = {}));
var Fp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(jp || (jp = {}));
var Rp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Rp || (Rp = {}));
var dd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(dd || (dd = {}));
var zp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(Gp || (Gp = {}));
function fd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function g3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function mw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function y3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fd(e.outputLen), fd(e.blockLen);
}
function w3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function b3(e, t) {
  mw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const su = {
  number: fd,
  bool: g3,
  bytes: mw,
  hash: y3,
  exists: w3,
  output: b3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ou = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), yr = (e, t) => e << 32 - t | e >>> t, m3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!m3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function x3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function xw(e) {
  if (typeof e == "string" && (e = x3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let S3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Oo(e) {
  const t = (r) => e().update(xw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function A3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let kf = class extends S3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = ou(this.buffer);
  }
  update(t) {
    su.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = xw(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ou(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    su.exists(this), su.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    A3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ou(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const E3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sw = Uint8Array.from({ length: 16 }, (e, t) => t), v3 = Sw.map((e) => (9 * e + 5) % 16);
let $f = [Sw], If = [v3];
for (let e = 0; e < 4; e++)
  for (let t of [$f, If])
    t.push(t[e].map((n) => E3[n]));
const Aw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), k3 = $f.map((e, t) => e.map((n) => Aw[t][n])), $3 = If.map((e, t) => e.map((n) => Aw[t][n])), I3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), L3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ec = (e, t) => e << t | e >>> 32 - t;
function Kp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const tc = new Uint32Array(16);
let C3 = class extends kf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      tc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = I3[y], C = L3[y], O = $f[y], U = If[y], E = k3[y], L = $3[y];
      for (let M = 0; M < 16; M++) {
        const G = ec(r + Kp(y, o, a, p) + tc[O[M]] + x, E[M]) + h | 0;
        r = h, h = p, p = ec(a, 10) | 0, a = o, o = G;
      }
      for (let M = 0; M < 16; M++) {
        const G = ec(s + Kp(S, i, c, g) + tc[U[M]] + C, L[M]) + w | 0;
        s = w, w = g, g = ec(c, 10) | 0, c = i, i = G;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    tc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Oo(() => new C3());
const T3 = (e, t, n) => e & t ^ ~e & n, B3 = (e, t, n) => e & t ^ e & n ^ t & n, M3 = new Uint32Array([
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
]), Es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), vs = new Uint32Array(64);
let Ew = class extends kf {
  constructor() {
    super(64, 32, 8, !1), this.A = Es[0] | 0, this.B = Es[1] | 0, this.C = Es[2] | 0, this.D = Es[3] | 0, this.E = Es[4] | 0, this.F = Es[5] | 0, this.G = Es[6] | 0, this.H = Es[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      vs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = vs[h - 15], y = vs[h - 2], S = yr(w, 7) ^ yr(w, 18) ^ w >>> 3, x = yr(y, 17) ^ yr(y, 19) ^ y >>> 10;
      vs[h] = x + vs[h - 7] + S + vs[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), y = g + w + T3(a, c, p) + M3[h] + vs[h] | 0, x = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + B3(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, N3 = class extends Ew {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Oo(() => new Ew());
Oo(() => new N3());
const nc = BigInt(2 ** 32 - 1), hd = BigInt(32);
function vw(e, t = !1) {
  return t ? { h: Number(e & nc), l: Number(e >> hd & nc) } : { h: Number(e >> hd & nc) | 0, l: Number(e & nc) | 0 };
}
function _3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = vw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const P3 = (e, t) => BigInt(e >>> 0) << hd | BigInt(t >>> 0), U3 = (e, t, n) => e >>> n, H3 = (e, t, n) => e << 32 - n | t >>> n, O3 = (e, t, n) => e >>> n | t << 32 - n, D3 = (e, t, n) => e << 32 - n | t >>> n, F3 = (e, t, n) => e << 64 - n | t >>> n - 32, j3 = (e, t, n) => e >>> n - 32 | t << 64 - n, R3 = (e, t) => t, z3 = (e, t) => e, G3 = (e, t, n) => e << n | t >>> 32 - n, K3 = (e, t, n) => t << n | e >>> 32 - n, V3 = (e, t, n) => t << n - 32 | e >>> 64 - n, Y3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function q3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const X3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), W3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Z3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Q3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, J3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), e4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, _e = {
  fromBig: vw,
  split: _3,
  toBig: P3,
  shrSH: U3,
  shrSL: H3,
  rotrSH: O3,
  rotrSL: D3,
  rotrBH: F3,
  rotrBL: j3,
  rotr32H: R3,
  rotr32L: z3,
  rotlSH: G3,
  rotlSL: K3,
  rotlBH: V3,
  rotlBL: Y3,
  add: q3,
  add3L: X3,
  add3H: W3,
  add4L: Z3,
  add4H: Q3,
  add5H: e4,
  add5L: J3
}, [t4, n4] = _e.split([
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
].map((e) => BigInt(e))), ks = new Uint32Array(80), $s = new Uint32Array(80);
let vl = class extends kf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: C } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ks[E] = t.getUint32(n), $s[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const L = ks[E - 15] | 0, M = $s[E - 15] | 0, G = _e.rotrSH(L, M, 1) ^ _e.rotrSH(L, M, 8) ^ _e.shrSH(L, M, 7), ee = _e.rotrSL(L, M, 1) ^ _e.rotrSL(L, M, 8) ^ _e.shrSL(L, M, 7), Z = ks[E - 2] | 0, Y = $s[E - 2] | 0, b = _e.rotrSH(Z, Y, 19) ^ _e.rotrBH(Z, Y, 61) ^ _e.shrSH(Z, Y, 6), k = _e.rotrSL(Z, Y, 19) ^ _e.rotrBL(Z, Y, 61) ^ _e.shrSL(Z, Y, 6), P = _e.add4L(ee, k, $s[E - 7], $s[E - 16]), _ = _e.add4H(P, G, b, ks[E - 7], ks[E - 16]);
      ks[E] = _ | 0, $s[E] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: C, Hh: O, Hl: U } = this;
    for (let E = 0; E < 80; E++) {
      const L = _e.rotrSH(h, w, 14) ^ _e.rotrSH(h, w, 18) ^ _e.rotrBH(h, w, 41), M = _e.rotrSL(h, w, 14) ^ _e.rotrSL(h, w, 18) ^ _e.rotrBL(h, w, 41), G = h & y ^ ~h & x, ee = w & S ^ ~w & C, Z = _e.add5L(U, M, ee, n4[E], $s[E]), Y = _e.add5H(Z, O, L, G, t4[E], ks[E]), b = Z | 0, k = _e.rotrSH(r, s, 28) ^ _e.rotrBH(r, s, 34) ^ _e.rotrBH(r, s, 39), P = _e.rotrSL(r, s, 28) ^ _e.rotrBL(r, s, 34) ^ _e.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, K = s & i ^ s & c ^ i & c;
      O = x | 0, U = C | 0, x = y | 0, C = S | 0, y = h | 0, S = w | 0, { h, l: w } = _e.add(p | 0, g | 0, Y | 0, b | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const T = _e.add3L(b, P, K);
      r = _e.add3H(T, Y, k, _), s = T | 0;
    }
    ({ h: r, l: s } = _e.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = _e.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = _e.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = _e.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = _e.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = _e.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: C } = _e.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: O, l: U } = _e.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, C, O, U);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, r4 = class extends vl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, s4 = class extends vl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, o4 = class extends vl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Oo(() => new vl());
Oo(() => new r4());
Oo(() => new s4());
Oo(() => new o4());
function i4(e, t, n) {
  const s = h3;
  if (A4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ld.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Yt;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Yt || (Yt = {}));
let a4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, kw = class extends a4 {
  constructor(t) {
    super(t);
  }
};
function kl(e) {
  const t = [];
  return t.push(pa(Sf(e.version, 1))), t.push(pa(e.hash160)), Wr(t);
}
function c4(e) {
  const t = [];
  return t.push(e.prefix), t.push(kl(e.address)), e.prefix === dd.Contract && t.push(ga(e.contractName)), Wr(t);
}
function ga(e) {
  const t = [], n = Ef(e.content), r = n.byteLength;
  return t.push(pa(Sf(r, e.lengthPrefixBytes))), t.push(n), Wr(t);
}
function l4(e) {
  const t = [];
  return t.push(kl(e.address)), t.push(ga(e.contractName)), t.push(ga(e.assetName)), Wr(t);
}
function $w(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(c4(e.principal)), (e.conditionType === ro.Fungible || e.conditionType === ro.NonFungible) && t.push(l4(e.assetInfo)), e.conditionType === ro.NonFungible && t.push(Io(e.assetName)), t.push(e.conditionCode), e.conditionType === ro.STX || e.conditionType === ro.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new kw("The post-condition amount may not be larger than 8 bytes");
    t.push(a3(e.amount, !1, 8));
  }
  return Wr(t);
}
function Cr(e, t) {
  return Wr([e, t]);
}
function u4(e) {
  return new Uint8Array([e.type]);
}
function d4(e) {
  return e.type === Yt.OptionalNone ? new Uint8Array([e.type]) : Cr(e.type, Io(e.value));
}
function f4(e) {
  const t = new Uint8Array(4);
  return El(t, e.buffer.length, 0), Cr(e.type, vf(t, e.buffer));
}
function h4(e) {
  const t = Af(c3(e.value, BigInt(p3)), bw);
  return Cr(e.type, t);
}
function p4(e) {
  const t = Af(e.value, bw);
  return Cr(e.type, t);
}
function g4(e) {
  return Cr(e.type, kl(e.address));
}
function y4(e) {
  return Cr(e.type, vf(kl(e.address), ga(e.contractName)));
}
function w4(e) {
  return Cr(e.type, Io(e.value));
}
function b4(e) {
  const t = [], n = new Uint8Array(4);
  El(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Io(r);
    t.push(s);
  }
  return Cr(e.type, Wr(t));
}
function m4(e) {
  const t = [], n = new Uint8Array(4);
  El(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = i4(s);
    t.push(ga(o));
    const i = Io(e.data[s]);
    t.push(i);
  }
  return Cr(e.type, Wr(t));
}
function Iw(e, t) {
  const n = [], r = t == "ascii" ? d3(e.data) : Ef(e.data), s = new Uint8Array(4);
  return El(s, r.length, 0), n.push(s), n.push(r), Cr(e.type, Wr(n));
}
function x4(e) {
  return Iw(e, "ascii");
}
function S4(e) {
  return Iw(e, "utf8");
}
function Io(e) {
  switch (e.type) {
    case Yt.BoolTrue:
    case Yt.BoolFalse:
      return u4(e);
    case Yt.OptionalNone:
    case Yt.OptionalSome:
      return d4(e);
    case Yt.Buffer:
      return f4(e);
    case Yt.UInt:
      return p4(e);
    case Yt.Int:
      return h4(e);
    case Yt.PrincipalStandard:
      return g4(e);
    case Yt.PrincipalContract:
      return y4(e);
    case Yt.ResponseOk:
    case Yt.ResponseErr:
      return w4(e);
    case Yt.List:
      return b4(e);
    case Yt.Tuple:
      return m4(e);
    case Yt.StringASCII:
      return x4(e);
    case Yt.StringUTF8:
      return S4(e);
    default:
      throw new kw("Unable to serialize. Invalid Clarity Value.");
  }
}
const A4 = (e, t) => e ? Ef(e).length > t : !1, E4 = "connect-ui";
let Ac, Lw, _n = !1, pd = !1;
const qr = (e, t = "") => () => {
}, v4 = (e, t) => () => {
}, k4 = "{visibility:hidden}.hydrated{visibility:inherit}", Vp = {}, $4 = "http://www.w3.org/2000/svg", I4 = "http://www.w3.org/1999/xhtml", L4 = (e) => e != null, Lf = (e) => (e = typeof e, e === "object" || e === "function");
function Cw(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ce = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (p) => {
    for (let g = 0; g < p.length; g++)
      r = p[g], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Lf(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? gd(null, r) : r), o = s);
  };
  if (a(n), t) {
    const p = t.className || t.class;
    p && (t.class = typeof p != "object" ? p : Object.keys(p).filter((g) => p[g]).join(" "));
  }
  const c = gd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, gd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, C4 = {}, T4 = (e) => e && e.$tag$ === C4, B4 = (e, t) => e != null && !Lf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, M4 = (e) => Oi(e).$hostElement$, N4 = (e, t, n) => {
  const r = on.ce(t, n);
  return e.dispatchEvent(r), r;
}, Yp = /* @__PURE__ */ new WeakMap(), _4 = (e, t, n) => {
  let r = zc.get(e);
  ek && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, zc.set(e, r);
}, P4 = (e, t, n, r) => {
  var s;
  let o = Tw(t);
  const i = zc.get(o);
  if (e = e.nodeType === 11 ? e : vr, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = Yp.get(e), c;
      if (a || Yp.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = vr.createElement("style"), c.innerHTML = i;
          const p = (s = on.$nonce$) !== null && s !== void 0 ? s : Cw(vr);
          p != null && c.setAttribute("nonce", p), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, U4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = qr("attachStyles", t.$tagName$), o = P4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Tw = (e, t) => "sc-" + e.$tagName$, qp = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = Wp(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, p = Xp(n), g = Xp(r);
      c.remove(...p.filter((h) => h && !g.includes(h))), c.add(...g.filter((h) => h && !p.includes(h)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : Wp($l, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && on.rel(e, t, n, !1), r && on.ael(e, t, r, !1);
    else {
      const c = Lf(r);
      if ((i || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const p = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != p) && (e[t] = p);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, H4 = /\s/, Xp = (e) => e ? e.split(H4) : [], Bw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || Vp, i = t.$attrs$ || Vp;
  for (r in o)
    r in i || qp(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    qp(s, r, o[r], i[r], n, t.$flags$);
}, Cf = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = vr.createTextNode(s.$text$);
  else {
    if (_n || (_n = s.$tag$ === "svg"), i = s.$elm$ = vr.createElementNS(_n ? $4 : I4, s.$tag$), _n && s.$tag$ === "foreignObject" && (_n = !1), Bw(null, s, _n), L4(Ac) && i["s-si"] !== Ac && i.classList.add(i["s-si"] = Ac), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = Cf(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? _n = !1 : i.tagName === "foreignObject" && (_n = !0);
  }
  return i;
}, Mw = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Lw && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = Cf(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, Nw = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, O4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], p = r.length - 1, g = r[0], h = r[p], w;
  for (; s <= i && o <= p; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : g == null ? g = r[++o] : h == null ? h = r[--p] : rc(a, g) ? (ta(a, g), a = t[++s], g = r[++o]) : rc(c, h) ? (ta(c, h), c = t[--i], h = r[--p]) : rc(a, h) ? (ta(a, h), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], h = r[--p]) : rc(c, g) ? (ta(c, g), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], g = r[++o]) : (w = Cf(t && t[o], n, o), g = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Mw(e, r[p + 1] == null ? null : r[p + 1].$elm$, n, r, o, p) : o > p && Nw(t, s, i);
}, rc = (e, t) => e.$tag$ === t.$tag$, ta = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (_n = o === "svg" ? !0 : o === "foreignObject" ? !1 : _n, Bw(e, t, _n), r !== null && s !== null ? O4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Mw(n, null, t, s, 0, s.length - 1)) : r !== null && Nw(r, 0, r.length - 1), _n && o === "svg" && (_n = !1)) : e.$text$ !== i && (n.data = i);
}, D4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || gd(null, null), s = T4(t) ? t : Ce(null, null, t);
  Lw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ac = n["s-sc"], ta(r, s);
}, _w = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Tf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return _w(e, e.$ancestorComponent$), nk(() => F4(e, t));
}, F4 = (e, t) => {
  const n = qr("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), G4(s, () => j4(e, r, t));
}, j4 = async (e, t, n) => {
  const r = e.$hostElement$, s = qr("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && U4(e);
  const i = qr("render", e.$cmpMeta$.$tagName$);
  R4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => z4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, R4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, D4(e, t);
  } catch (r) {
    ya(r, e.$hostElement$);
  }
  return null;
}, z4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = qr("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Uw(n), r(), e.$onReadyResolve$(n), s || Pw()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Mf(() => Tf(e, !1)), e.$flags$ &= -517;
}, Pw = (e) => {
  Uw(vr.documentElement), Mf(() => N4($l, "appload", { detail: { namespace: E4 } }));
}, G4 = (e, t) => e && e.then ? e.then(t) : t(), Uw = (e) => e.classList.add("hydrated"), K4 = (e, t) => Oi(e).$instanceValues$.get(t), V4 = (e, t, n, r) => {
  const s = Oi(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = B4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), p = n !== o && !c;
  (!(i & 8) || o === void 0) && p && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && Tf(s, !1));
}, Hw = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return K4(this, o);
        },
        set(a) {
          V4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        on.jmp(() => {
          const p = o.get(i);
          if (this.hasOwnProperty(p))
            c = this[p], delete this[p];
          else if (s.hasOwnProperty(p) && typeof this[p] == "number" && this[p] == c)
            return;
          this[p] = c === null && typeof this[p] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return o.set(c, i), c;
      });
    }
  }
  return e;
}, Y4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = J4(n), s.then) {
        const c = v4();
        s = await s, c();
      }
      s.isProxied || (Hw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = qr("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        ya(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Tw(n);
      if (!zc.has(c)) {
        const p = qr("registerStyles", n.$tagName$);
        _4(c, a, !!(n.$flags$ & 1)), p();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => Tf(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, q4 = (e) => {
  if (!(on.$flags$ & 1)) {
    const t = Oi(e), n = t.$cmpMeta$, r = qr("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            _w(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), Y4(e, t, n);
    }
    r();
  }
}, X4 = (e) => {
  on.$flags$ & 1 || Oi(e);
}, W4 = (e, t = {}) => {
  var n;
  const r = qr(), s = [], o = t.exclude || [], i = $l.customElements, a = vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), p = /* @__PURE__ */ vr.createElement("style"), g = [];
  let h, w = !0;
  Object.assign(on, t), on.$resourcesUrl$ = new URL(t.resourcesUrl || "./", vr.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const C = x.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, Q4(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          h && (clearTimeout(h), h = null), w ? g.push(this) : on.jmp(() => q4(this));
        }
        disconnectedCallback() {
          on.jmp(() => X4(this));
        }
        componentOnReady() {
          return Oi(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !o.includes(C) && !i.get(C) && (s.push(C), i.define(C, Hw(
        O,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    p.innerHTML = s + k4, p.setAttribute("data-styles", "");
    const y = (n = on.$nonce$) !== null && n !== void 0 ? n : Cw(vr);
    y != null && p.setAttribute("nonce", y), a.insertBefore(p, c ? c.nextSibling : a.firstChild);
  }
  w = !1, g.length ? g.map((y) => y.connectedCallback()) : on.jmp(() => h = setTimeout(Pw, 30)), r();
}, Bf = /* @__PURE__ */ new WeakMap(), Oi = (e) => Bf.get(e), Z4 = (e, t) => Bf.set(t.$lazyInstance$ = e, t), Q4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Bf.set(e, n);
}, Wp = (e, t) => t in e, ya = (e, t) => (0, console.error)(e, t), iu = /* @__PURE__ */ new Map(), J4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = iu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (iu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => bL).then(i, ya);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (iu.set(s, i), i[r]), ya);
}, zc = /* @__PURE__ */ new Map(), $l = typeof window < "u" ? window : {}, vr = $l.document || { head: {} }, on = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Ow = (e) => Promise.resolve(e), ek = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Zp = [], Dw = [], tk = (e, t) => (n) => {
  e.push(n), pd || (pd = !0, on.$flags$ & 4 ? Mf(yd) : on.raf(yd));
}, Qp = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      ya(n);
    }
  e.length = 0;
}, yd = () => {
  Qp(Zp), Qp(Dw), (pd = Zp.length > 0) && on.raf(yd);
}, Mf = (e) => Ow().then(e), nk = /* @__PURE__ */ tk(Dw), rk = () => Ow(), sk = (e, t) => typeof window > "u" ? Promise.resolve() : rk().then(() => W4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var ok = Object.defineProperty, ik = Object.defineProperties, ak = Object.getOwnPropertyDescriptors, Gc = Object.getOwnPropertySymbols, Fw = Object.prototype.hasOwnProperty, jw = Object.prototype.propertyIsEnumerable, Jp = (e, t, n) => t in e ? ok(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Dn = (e, t) => {
  for (var n in t || (t = {})) Fw.call(t, n) && Jp(e, n, t[n]);
  if (Gc) for (var n of Gc(t)) jw.call(t, n) && Jp(e, n, t[n]);
  return e;
}, ur = (e, t) => ik(e, ak(t)), Rw = (e, t) => {
  var n = {};
  for (var r in e) Fw.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Gc) for (var r of Gc(e)) t.indexOf(r) < 0 && jw.call(e, r) && (n[r] = e[r]);
  return n;
};
function zw() {
  return ml(So()) || window.StacksProvider || window.BlockstackProvider;
}
function Il(e) {
  return e ? typeof e == "string" ? Eo.fromName(e) : "version" in e ? e : "url" in e ? new Gu({ url: e.url }) : e.transactionVersion === ko.Mainnet ? new Gu({ url: e.client.baseUrl }) : new Ku({ url: e.client.baseUrl }) : new Ku();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var ck = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(ck || {}), lk = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(lk || {}), Nf = (e) => {
  let t = e;
  if (!t) {
    let n = new Ag(["store_write"], document.location.href);
    t = new zu({ appConfig: n });
  }
  return t;
};
function Gw(e) {
  try {
    return Nf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Kw = (e) => {
  let t = Nf(e).loadUserData().appPrivateKey, n = en.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function uk(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [vo.Mainnet]: "mainnet", [vo.Testnet]: "testnet" }, a = Il(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function dk(e) {
  let t = Il(e.network), n = Nf(e.userSession), r = ur(Dn({}, e), { network: t, userSession: n });
  return Dn({ stxAddress: uk(r) }, r);
}
async function fk(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(yw) : n = n.map((r) => xe($w(r)))), new en.TokenSigner("ES256k", t).signAsync(ur(Dn({}, e), { postConditions: n }));
}
function hk(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(yw) : t = t.map((n) => xe($w(n)))), en.createUnsecuredToken(ur(Dn({}, e), { postConditions: t }));
}
var pk = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = Ve(a.replace(/^0x/, "")), p = s3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, ur(Dn({}, i), { stacksTransaction: p }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, ur(Dn({}, i), { stacksTransaction: p }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, gk = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = Rw(t, ["amount", "appDetails", "userSession"]);
  if (Gw(s)) {
    let { privateKey: a, publicKey: c } = Kw(s), p = ur(Dn({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (p.appDetails = r), fk(p, a);
  }
  let i = ur(Dn({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), hk(i);
};
async function yk(e, t, n) {
  let r = await t(ur(Dn(Dn({}, dk(e)), e), { network: Il(e.network) }));
  return pk({ token: r, options: e }, n);
}
function wk(e, t = zw()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return yk(e, gk, t);
}
function Vw(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? ur(Dn({}, e), { message: Ip(t), domain: Ip(n) }) : ur(Dn({}, e), { message: xe(Io(t)), domain: xe(Io(n)) });
}
async function bk(e, t) {
  return new en.TokenSigner("ES256k", t).signAsync(Vw(e));
}
async function mk(e) {
  let t = e, { userSession: n } = t, r = Rw(t, ["userSession"]);
  if (Gw(n)) {
    let { privateKey: s, publicKey: o } = Kw(n), i = ur(Dn({}, r), { publicKey: o });
    return bk(i, s);
  }
  return en.createUnsecuredToken(Vw(e));
}
var xk = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(xk || {}), Yw = "asigna-stx", e0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Yw && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Ak(e, t), "*");
}), Sk = { authenticationRequest: async (e) => e0(e, "authenticationRequest"), transactionRequest: async (e) => e0(e, "transactionRequest") }, Ak = (e, t) => ({ source: Yw, [t]: e }), Ek = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Sk);
};
Ek();
var vk = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function kk(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = So(), i = zw();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    sk();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : vk, c = yA(a), p = document.createElement("connect-modal");
    p.defaultProviders = a, p.installedProviders = c, p.persistSelection = t;
    let g = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let h = () => {
      p.remove(), document.body.style.overflow = g;
    };
    p.callback = (y) => {
      h(), e(n, y);
    }, p.cancelCallback = () => {
      var y;
      h(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(p);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), p.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var sc = kk(wk);
function Fs(e, t, n) {
  return _f(bn(e, t), n);
}
function bn(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = St(r);
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
    if (t) {
      const r = Lk(BigInt(`0x${Fe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Fe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function t0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ca(e, t = 8) {
  return (typeof e == "bigint" ? e : bn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Ll(e) {
  return parseInt(e, 16);
}
function _f(e, t = 16) {
  const n = Ca(e, t);
  return St(n);
}
function $k(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Ik(e, t) {
  return e & BigInt(1) << t;
}
function Lk(e, t) {
  return Ik(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Ck = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Fe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Ck[n];
  return t;
}
function St(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Di(e) {
  return new TextEncoder().encode(e);
}
function Pf(e) {
  return new TextDecoder().decode(e);
}
function qw(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Tk(e) {
  return String.fromCharCode.apply(null, e);
}
function Bk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function n0(e) {
  if (e.some(Bk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Cl(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Ft(e) {
  return Cl(...e.map((t) => typeof t == "number" ? n0([t]) : t instanceof Array ? n0(t) : t));
}
var r0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(r0 || (r0 = {}));
var s0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(s0 || (s0 = {}));
var o0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(o0 || (o0 = {}));
const Xw = 33, au = 32;
function Mk(e) {
  if (e.length < au * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + au * 2), r = e.slice(2 + au * 2);
  return {
    recoveryId: Ll(t),
    r: n,
    s: r
  };
}
function Nk(e) {
  const t = typeof e == "string" ? St(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function _k(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Pk(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Uk(e, t) {
  return e[t];
}
function Hk(e, t, n = 0) {
  return e[n] = t, e;
}
function Ok(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Lo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var wd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(wd || (wd = {}));
const Dk = wd.Mainnet, Fk = 128, jk = 128, Ww = 16, ho = 32, bd = 80, Tl = 65, Rk = 32, zk = 64, Kc = 34;
var ye;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ye || (ye = {}));
var Oe;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Oe || (Oe = {}));
var md;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(md || (md = {}));
var xn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(xn || (xn = {}));
const Ec = ["onChainOnly", "offChainOnly", "any"], i0 = {
  [Ec[0]]: xn.OnChainOnly,
  [Ec[1]]: xn.OffChainOnly,
  [Ec[2]]: xn.Any,
  [xn.OnChainOnly]: xn.OnChainOnly,
  [xn.OffChainOnly]: xn.OffChainOnly,
  [xn.Any]: xn.Any
};
function Gk(e) {
  if (e in i0)
    return i0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Ec.join(", ")}`);
}
var Vc;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Vc || (Vc = {}));
Vc.Mainnet;
var Ci;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Ci || (Ci = {}));
var Sn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Sn || (Sn = {}));
var Bt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Bt || (Bt = {}));
var ut;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ut || (ut = {}));
var Yc;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yc || (Yc = {}));
var kt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(kt || (kt = {}));
var wa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(wa || (wa = {}));
var xd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(xd || (xd = {}));
var ba;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(ba || (ba = {}));
var a0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(c0 || (c0 = {}));
function Sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Kk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Zw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Vk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sd(e.outputLen), Sd(e.blockLen);
}
function Yk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qk(e, t) {
  Zw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lo = {
  number: Sd,
  bool: Kk,
  bytes: Zw,
  hash: Vk,
  exists: Yk,
  output: qk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), wr = (e, t) => e << 32 - t | e >>> t, Xk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Wk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Uf(e) {
  if (typeof e == "string" && (e = Wk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Qw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Do(e) {
  const t = (r) => e().update(Uf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Zk(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
class Hf extends Qw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = cu(this.buffer);
  }
  update(t) {
    lo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Uf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = cu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    lo.exists(this), lo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    Zk(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = cu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
}
const Qk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jw = Uint8Array.from({ length: 16 }, (e, t) => t), Jk = Jw.map((e) => (9 * e + 5) % 16);
let Of = [Jw], Df = [Jk];
for (let e = 0; e < 4; e++)
  for (let t of [Of, Df])
    t.push(t[e].map((n) => Qk[n]));
const eb = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), e8 = Of.map((e, t) => e.map((n) => eb[t][n])), t8 = Df.map((e, t) => e.map((n) => eb[t][n])), n8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), r8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oc = (e, t) => e << t | e >>> 32 - t;
function l0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
class s8 extends Hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = n8[y], C = r8[y], O = Of[y], U = Df[y], E = e8[y], L = t8[y];
      for (let M = 0; M < 16; M++) {
        const G = oc(r + l0(y, o, a, p) + ic[O[M]] + x, E[M]) + h | 0;
        r = h, h = p, p = oc(a, 10) | 0, a = o, o = G;
      }
      for (let M = 0; M < 16; M++) {
        const G = oc(s + l0(S, i, c, g) + ic[U[M]] + C, L[M]) + w | 0;
        s = w, w = g, g = oc(c, 10) | 0, c = i, i = G;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const o8 = Do(() => new s8()), i8 = (e, t, n) => e & t ^ ~e & n, a8 = (e, t, n) => e & t ^ e & n ^ t & n, c8 = new Uint32Array([
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
]), Is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ls = new Uint32Array(64);
class tb extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Ls[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Ls[h - 15], y = Ls[h - 2], S = wr(w, 7) ^ wr(w, 18) ^ w >>> 3, x = wr(y, 17) ^ wr(y, 19) ^ y >>> 10;
      Ls[h] = x + Ls[h - 7] + S + Ls[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), y = g + w + i8(a, c, p) + c8[h] + Ls[h] | 0, x = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + a8(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class l8 extends tb {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Ff = Do(() => new tb());
Do(() => new l8());
const ac = BigInt(2 ** 32 - 1), Ad = BigInt(32);
function nb(e, t = !1) {
  return t ? { h: Number(e & ac), l: Number(e >> Ad & ac) } : { h: Number(e >> Ad & ac) | 0, l: Number(e & ac) | 0 };
}
function u8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = nb(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const d8 = (e, t) => BigInt(e >>> 0) << Ad | BigInt(t >>> 0), f8 = (e, t, n) => e >>> n, h8 = (e, t, n) => e << 32 - n | t >>> n, p8 = (e, t, n) => e >>> n | t << 32 - n, g8 = (e, t, n) => e << 32 - n | t >>> n, y8 = (e, t, n) => e << 64 - n | t >>> n - 32, w8 = (e, t, n) => e >>> n - 32 | t << 64 - n, b8 = (e, t) => t, m8 = (e, t) => e, x8 = (e, t, n) => e << n | t >>> 32 - n, S8 = (e, t, n) => t << n | e >>> 32 - n, A8 = (e, t, n) => t << n - 32 | e >>> 64 - n, E8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function v8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const k8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), $8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, I8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), L8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, C8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), T8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Pe = {
  fromBig: nb,
  split: u8,
  toBig: d8,
  shrSH: f8,
  shrSL: h8,
  rotrSH: p8,
  rotrSL: g8,
  rotrBH: y8,
  rotrBL: w8,
  rotr32H: b8,
  rotr32L: m8,
  rotlSH: x8,
  rotlSL: S8,
  rotlBH: A8,
  rotlBL: E8,
  add: v8,
  add3L: k8,
  add3H: $8,
  add4L: I8,
  add4H: L8,
  add5H: T8,
  add5L: C8
}, [B8, M8] = Pe.split([
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
].map((e) => BigInt(e))), Cs = new Uint32Array(80), Ts = new Uint32Array(80);
class Bl extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: C } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Cs[E] = t.getUint32(n), Ts[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const L = Cs[E - 15] | 0, M = Ts[E - 15] | 0, G = Pe.rotrSH(L, M, 1) ^ Pe.rotrSH(L, M, 8) ^ Pe.shrSH(L, M, 7), ee = Pe.rotrSL(L, M, 1) ^ Pe.rotrSL(L, M, 8) ^ Pe.shrSL(L, M, 7), Z = Cs[E - 2] | 0, Y = Ts[E - 2] | 0, b = Pe.rotrSH(Z, Y, 19) ^ Pe.rotrBH(Z, Y, 61) ^ Pe.shrSH(Z, Y, 6), k = Pe.rotrSL(Z, Y, 19) ^ Pe.rotrBL(Z, Y, 61) ^ Pe.shrSL(Z, Y, 6), P = Pe.add4L(ee, k, Ts[E - 7], Ts[E - 16]), _ = Pe.add4H(P, G, b, Cs[E - 7], Cs[E - 16]);
      Cs[E] = _ | 0, Ts[E] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: C, Hh: O, Hl: U } = this;
    for (let E = 0; E < 80; E++) {
      const L = Pe.rotrSH(h, w, 14) ^ Pe.rotrSH(h, w, 18) ^ Pe.rotrBH(h, w, 41), M = Pe.rotrSL(h, w, 14) ^ Pe.rotrSL(h, w, 18) ^ Pe.rotrBL(h, w, 41), G = h & y ^ ~h & x, ee = w & S ^ ~w & C, Z = Pe.add5L(U, M, ee, M8[E], Ts[E]), Y = Pe.add5H(Z, O, L, G, B8[E], Cs[E]), b = Z | 0, k = Pe.rotrSH(r, s, 28) ^ Pe.rotrBH(r, s, 34) ^ Pe.rotrBH(r, s, 39), P = Pe.rotrSL(r, s, 28) ^ Pe.rotrBL(r, s, 34) ^ Pe.rotrBL(r, s, 39), _ = r & o ^ r & a ^ o & a, K = s & i ^ s & c ^ i & c;
      O = x | 0, U = C | 0, x = y | 0, C = S | 0, y = h | 0, S = w | 0, { h, l: w } = Pe.add(p | 0, g | 0, Y | 0, b | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const T = Pe.add3L(b, P, K);
      r = Pe.add3H(T, Y, k, _), s = T | 0;
    }
    ({ h: r, l: s } = Pe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Pe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Pe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Pe.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Pe.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Pe.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: C } = Pe.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: O, l: U } = Pe.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, C, O, U);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class N8 extends Bl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class _8 extends Bl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class P8 extends Bl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Do(() => new Bl());
Do(() => new N8());
const U8 = Do(() => new _8());
Do(() => new P8());
function rb(e) {
  if (St(e).byteLength != Tl)
    throw Error("Invalid signature");
  return {
    type: ye.MessageSignature,
    data: e
  };
}
function na(e, t) {
  return { type: ye.Address, version: e, hash160: t };
}
function di(e) {
  return Uo.c32address(e.version, e.hash160);
}
function Co(e, t, n) {
  const r = t || 1, s = n || Fk;
  if (xb(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ye.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function jf(e) {
  const t = Uo.c32addressDecode(e);
  return {
    type: ye.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ne;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ne || (ne = {}));
function H8(e) {
  if (e.type === ne.PrincipalStandard)
    return di(e.address);
  if (e.type === ne.PrincipalContract)
    return `${di(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function sb(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return F8(t, n);
  } else
    return O8(e);
}
function O8(e) {
  const t = jf(e);
  return { type: ne.PrincipalStandard, address: t };
}
function D8(e) {
  return { type: ne.PrincipalStandard, address: e };
}
function F8(e, t) {
  const n = jf(e), r = Co(t);
  return ob(n, r);
}
function ob(e, t) {
  if (Di(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ne.PrincipalContract, address: e, contractName: t };
}
function lu(e, t = !1) {
  switch (e.type) {
    case ne.BoolTrue:
      return !0;
    case ne.BoolFalse:
      return !1;
    case ne.Int:
    case ne.UInt:
      return t ? e.value.toString() : e.value;
    case ne.Buffer:
      return `0x${Fe(e.buffer)}`;
    case ne.OptionalNone:
      return null;
    case ne.OptionalSome:
      return ir(e.value);
    case ne.ResponseErr:
      return ir(e.value);
    case ne.ResponseOk:
      return ir(e.value);
    case ne.PrincipalStandard:
    case ne.PrincipalContract:
      return H8(e);
    case ne.List:
      return e.list.map((r) => ir(r));
    case ne.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = ir(e.data[r]);
      }), n;
    case ne.StringASCII:
      return e.data;
    case ne.StringUTF8:
      return e.data;
  }
}
function ir(e) {
  switch (e.type) {
    case ne.ResponseErr:
      return { type: Ns(e), value: lu(e, !0), success: !1 };
    case ne.ResponseOk:
      return { type: Ns(e), value: lu(e, !0), success: !0 };
    default:
      return { type: Ns(e), value: lu(e, !0) };
  }
}
function Ns(e) {
  switch (e.type) {
    case ne.BoolTrue:
    case ne.BoolFalse:
      return "bool";
    case ne.Int:
      return "int";
    case ne.UInt:
      return "uint";
    case ne.Buffer:
      return `(buff ${e.buffer.length})`;
    case ne.OptionalNone:
      return "(optional none)";
    case ne.OptionalSome:
      return `(optional ${Ns(e.value)})`;
    case ne.ResponseErr:
      return `(response UnknownType ${Ns(e.value)})`;
    case ne.ResponseOk:
      return `(response ${Ns(e.value)} UnknownType)`;
    case ne.PrincipalStandard:
    case ne.PrincipalContract:
      return "principal";
    case ne.List:
      return `(list ${e.list.length} ${e.list.length ? Ns(e.list[0]) : "UnknownType"})`;
    case ne.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Ns(e.data[t])})`).join(" ")})`;
    case ne.StringASCII:
      return `(string-ascii ${qw(e.data).length})`;
    case ne.StringUTF8:
      return `(string-utf8 ${Di(e.data).length})`;
  }
}
const ib = () => ({ type: ne.BoolTrue }), ab = () => ({ type: ne.BoolFalse }), j8 = (e) => e ? ib() : ab(), u0 = BigInt("0xffffffffffffffffffffffffffffffff"), R8 = BigInt(0), d0 = BigInt("0x7fffffffffffffffffffffffffffffff"), f0 = BigInt("-170141183460469231731687303715884105728"), z8 = (e) => {
  const t = bn(e, !0);
  if (t > d0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${d0}`);
  if (t < f0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${f0}`);
  return { type: ne.Int, value: t };
}, Zn = (e) => {
  const t = bn(e, !1);
  if (t < R8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > u0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${u0}`);
  return { type: ne.UInt, value: t };
}, cb = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ne.Buffer, buffer: e };
};
function lb() {
  return { type: ne.OptionalNone };
}
function ub(e) {
  return { type: ne.OptionalSome, value: e };
}
function G8(e) {
  return { type: ne.ResponseErr, value: e };
}
function K8(e) {
  return { type: ne.ResponseOk, value: e };
}
function V8(e) {
  return { type: ne.List, list: e };
}
function Xr(e) {
  for (const t in e)
    if (!P6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ne.Tuple, data: e };
}
const Ct = (e) => ({ type: ne.StringASCII, data: e }), Y8 = (e) => ({ type: ne.StringUTF8, data: e });
class db extends Qw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, lo.hash(t);
    const r = Uf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return lo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    lo.exists(this), lo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const fb = (e, t, n) => new db(e, t).update(n).digest();
fb.create = (e, t) => new db(e, t);
Mt.hmacSha256Sync = (e, ...t) => {
  const n = fb.create(Ff, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ti(e) {
  return {
    type: ye.PublicKey,
    data: St(e)
  };
}
function q8(e, t, n = kt.Compressed) {
  const r = Mk(t.data), s = new Hn(t0(r.r), t0(r.s)), o = De.fromSignature(e, s, r.recoveryId), i = n === kt.Compressed;
  return o.toHex(i);
}
function X8(e) {
  return { type: ye.PublicKey, data: e };
}
function Fi(e) {
  return !Fe(e.data).startsWith("04");
}
function qc(e) {
  return e.data.slice();
}
function W8(e) {
  const t = J8(e), n = va(t.data.slice(0, 32), t.compressed);
  return Ti(Fe(n));
}
function Z8(e) {
  const t = typeof e == "string" ? e : Fe(e), n = De.fromHex(t).toHex(!0);
  return Ti(n);
}
function Q8(e) {
  const t = typeof e == "string" ? e : Fe(e), n = De.fromHex(t).toHex(!1);
  return Ti(n);
}
function Ed(e) {
  const t = e.readUInt8(), n = t === 4 ? zk : Rk;
  return X8(Ft([t, e.readBytes(n)]));
}
function J8(e) {
  const t = Nk(e), n = t.length == Xw;
  return { data: t, compressed: n };
}
function e6(e, t) {
  const [n, r] = ll(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = Ca(r, 1) + Hn.fromHex(n).toCompactHex();
  return rb(o);
}
function t6(e) {
  return W8(e.data);
}
function n6(e, t, n) {
  return typeof e == "string" && (e = sb(e)), typeof n == "string" && (n = g0(n)), {
    type: ye.Payload,
    payloadType: Oe.TokenTransfer,
    recipient: e,
    amount: bn(t, !1),
    memo: n ?? g0("")
  };
}
function r6(e, t, n, r) {
  return typeof e == "string" && (e = jf(e)), typeof t == "string" && (t = Co(t)), typeof n == "string" && (n = Co(n)), {
    type: ye.Payload,
    payloadType: Oe.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function h0(e, t, n) {
  return typeof e == "string" && (e = Co(e)), typeof t == "string" && (t = f6(t)), typeof n == "number" ? {
    type: ye.Payload,
    payloadType: Oe.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ye.Payload,
    payloadType: Oe.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function s6() {
  return { type: ye.Payload, payloadType: Oe.PoisonMicroblock };
}
function p0(e, t) {
  if (e.byteLength != ho)
    throw Error(`Coinbase buffer size must be ${ho} bytes`);
  return t != null ? {
    type: ye.Payload,
    payloadType: Oe.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ye.Payload,
    payloadType: Oe.Coinbase,
    coinbaseBytes: e
  };
}
function o6(e, t, n) {
  if (e.byteLength != ho)
    throw Error(`Coinbase buffer size must be ${ho} bytes`);
  if (n.byteLength != bd)
    throw Error(`VRF proof buffer size must be ${bd} bytes`);
  return {
    type: ye.Payload,
    payloadType: Oe.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ne.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var vd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(vd || (vd = {}));
function i6(e, t, n, r, s, o, i) {
  return {
    type: ye.Payload,
    payloadType: Oe.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function hb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Oe.TokenTransfer:
      t.push(Ht(e.recipient)), t.push(Fs(e.amount, !1, 8)), t.push(Fr(e.memo));
      break;
    case Oe.ContractCall:
      t.push(Fr(e.contractAddress)), t.push(Fr(e.contractName)), t.push(Fr(e.functionName));
      const n = new Uint8Array(4);
      Lo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Ht(r));
      });
      break;
    case Oe.SmartContract:
      t.push(Fr(e.contractName)), t.push(Fr(e.codeBody));
      break;
    case Oe.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Fr(e.contractName)), t.push(Fr(e.codeBody));
      break;
    case Oe.PoisonMicroblock:
      break;
    case Oe.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Oe.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Ht(e.recipient));
      break;
    case Oe.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Ht(e.recipient ? ub(e.recipient) : lb())), t.push(e.vrfProof);
      break;
    case Oe.TenureChange:
      t.push(St(e.tenureHash)), t.push(St(e.previousTenureHash)), t.push(St(e.burnViewHash)), t.push(St(e.previousTenureEnd)), t.push(Lo(new Uint8Array(4), e.previousTenureBlocks)), t.push(Hk(new Uint8Array(1), e.cause)), t.push(St(e.publicKeyHash));
      break;
  }
  return Ft(t);
}
function a6(e) {
  switch (e.readUInt8Enum(Oe, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Oe.TokenTransfer:
      const n = Wn(e), r = bn(e.readBytes(8), !1), s = gb(e);
      return n6(n, r, s);
    case Oe.ContractCall:
      const o = Bi(e), i = Xn(e), a = Xn(e), c = [], p = e.readUInt32BE();
      for (let E = 0; E < p; E++) {
        const L = Wn(e);
        c.push(L);
      }
      return r6(o, i, a, c);
    case Oe.SmartContract:
      const g = Xn(e), h = Xn(e, 4, 1e5);
      return h0(g, h);
    case Oe.VersionedSmartContract: {
      const E = e.readUInt8Enum(md, (G) => {
        throw new Error(`Cannot recognize ClarityVersion: ${G}`);
      }), L = Xn(e), M = Xn(e, 4, 1e5);
      return h0(L, M, E);
    }
    case Oe.PoisonMicroblock:
      return s6();
    case Oe.Coinbase: {
      const E = e.readBytes(ho);
      return p0(E);
    }
    case Oe.CoinbaseToAltRecipient: {
      const E = e.readBytes(ho), L = Wn(e);
      return p0(E, L);
    }
    case Oe.NakamotoCoinbase: {
      const E = e.readBytes(ho), L = Wn(e), M = e.readBytes(bd);
      return o6(E, L, M);
    }
    case Oe.TenureChange:
      const w = Fe(e.readBytes(20)), y = Fe(e.readBytes(20)), S = Fe(e.readBytes(20)), x = Fe(e.readBytes(32)), C = e.readUInt32BE(), O = e.readUInt8Enum(vd, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), U = Fe(e.readBytes(20));
      return i6(w, y, S, x, C, O, U);
  }
}
class Ml extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class so extends Ml {
  constructor(t) {
    super(t);
  }
}
class Un extends Ml {
  constructor(t) {
    super(t);
  }
}
class Xc extends Ml {
  constructor(t) {
    super(t);
  }
}
class uo extends Ml {
  constructor(t) {
    super(t);
  }
}
var ar;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ar || (ar = {}));
function kd(e) {
  return rb(Fe(e.readBytes(Tl)));
}
function fi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ye.TransactionAuthField,
    contents: t
  };
}
function c6(e) {
  const t = e.readUInt8Enum(ar, (n) => {
    throw new Un(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case ar.PublicKeyCompressed:
      return fi(kt.Compressed, Ed(e));
    case ar.PublicKeyUncompressed:
      return fi(kt.Uncompressed, Q8(Ed(e).data));
    case ar.SignatureCompressed:
      return fi(kt.Compressed, kd(e));
    case ar.SignatureUncompressed:
      return fi(kt.Uncompressed, kd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Rf(e) {
  return St(e.data);
}
function l6(e) {
  const t = [];
  switch (e.contents.type) {
    case ye.PublicKey:
      t.push(e.pubKeyEncoding === kt.Compressed ? ar.PublicKeyCompressed : ar.PublicKeyUncompressed), t.push(qc(Z8(e.contents.data)));
      break;
    case ye.MessageSignature:
      t.push(e.pubKeyEncoding === kt.Compressed ? ar.SignatureCompressed : ar.SignatureUncompressed), t.push(Rf(e.contents));
      break;
  }
  return Ft(t);
}
function Fr(e) {
  switch (e.type) {
    case ye.Address:
      return Ta(e);
    case ye.Principal:
      return pb(e);
    case ye.LengthPrefixedString:
      return Mi(e);
    case ye.MemoString:
      return h6(e);
    case ye.AssetInfo:
      return yb(e);
    case ye.PostCondition:
      return p6(e);
    case ye.PublicKey:
      return qc(e);
    case ye.LengthPrefixedList:
      return Kf(e);
    case ye.Payload:
      return hb(e);
    case ye.TransactionAuthField:
      return l6(e);
    case ye.MessageSignature:
      return Rf(e);
  }
}
function u6() {
  return {
    type: ye.Address,
    version: Yc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === ut.SerializeP2PKH || t === ut.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === ut.SerializeP2WPKH || t === ut.SerializeP2WSH || t === ut.SerializeP2WSHNonSequential) && !r.every(Fi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case ut.SerializeP2PKH:
      return na(e, B6(r[0].data));
    case ut.SerializeP2WPKH:
      return na(e, M6(r[0].data));
    case ut.SerializeP2SH:
    case ut.SerializeP2SHNonSequential:
      return na(e, N6(n, r.map(qc)));
    case ut.SerializeP2WSH:
    case ut.SerializeP2WSHNonSequential:
      return na(e, _6(n, r.map(qc)));
  }
}
function Ta(e) {
  const t = [];
  return t.push(St(Ca(e.version, 1))), t.push(St(e.hash160)), Ft(t);
}
function Bi(e) {
  const t = Ll(Fe(e.readBytes(1))), n = Fe(e.readBytes(20));
  return { type: ye.Address, version: t, hash160: n };
}
function pb(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ta(e.address)), e.prefix === ba.Contract && t.push(Mi(e.contractName)), Ft(t);
}
function d6(e) {
  const t = e.readUInt8Enum(ba, (s) => {
    throw new Un(`Unexpected Principal payload type: ${s}`);
  }), n = Bi(e);
  if (t === ba.Standard)
    return { type: ye.Principal, prefix: t, address: n };
  const r = Xn(e);
  return {
    type: ye.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Mi(e) {
  const t = [], n = Di(e.content), r = n.byteLength;
  return t.push(St(Ca(r, e.lengthPrefixBytes))), t.push(n), Ft(t);
}
function Xn(e, t, n) {
  t = t || 1;
  const r = Ll(Fe(e.readBytes(t))), s = Pf(e.readBytes(r));
  return Co(s, t, n ?? 128);
}
function f6(e) {
  return Co(e, 4, 1e5);
}
function g0(e) {
  if (e && xb(e, Kc))
    throw new Error(`Memo exceeds maximum length of ${Kc} bytes`);
  return { type: ye.MemoString, content: e };
}
function h6(e) {
  const t = [], n = Di(e.content), r = T6(Fe(n), Kc * 2);
  return t.push(St(r)), Ft(t);
}
function gb(e) {
  let t = Pf(e.readBytes(Kc));
  return t = t.replace(/\u0000*$/, ""), { type: ye.MemoString, content: t };
}
function yb(e) {
  const t = [];
  return t.push(Ta(e.address)), t.push(Mi(e.contractName)), t.push(Mi(e.assetName)), Ft(t);
}
function $d(e) {
  return {
    type: ye.AssetInfo,
    address: Bi(e),
    contractName: Xn(e),
    assetName: Xn(e)
  };
}
function Gf(e, t) {
  return {
    type: ye.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Kf(e) {
  const t = e.values, n = [];
  n.push(St(Ca(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Fr(r));
  return Ft(n);
}
function wb(e, t, n) {
  const r = Ll(Fe(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case ye.Address:
        s.push(Bi(e));
        break;
      case ye.LengthPrefixedString:
        s.push(Xn(e));
        break;
      case ye.MemoString:
        s.push(gb(e));
        break;
      case ye.AssetInfo:
        s.push($d(e));
        break;
      case ye.PostCondition:
        s.push(g6(e));
        break;
      case ye.PublicKey:
        s.push(Ed(e));
        break;
      case ye.TransactionAuthField:
        s.push(c6(e));
        break;
    }
  return Gf(s, n);
}
function p6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(pb(e.principal)), (e.conditionType === Sn.Fungible || e.conditionType === Sn.NonFungible) && t.push(yb(e.assetInfo)), e.conditionType === Sn.NonFungible && t.push(Ht(e.assetName)), t.push(e.conditionCode), e.conditionType === Sn.STX || e.conditionType === Sn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new so("The post-condition amount may not be larger than 8 bytes");
    t.push(Fs(e.amount, !1, 8));
  }
  return Ft(t);
}
function g6(e) {
  const t = e.readUInt8Enum(Sn, (i) => {
    throw new Un(`Could not read ${i} as PostConditionType`);
  }), n = d6(e);
  let r, s, o;
  switch (t) {
    case Sn.STX:
      return r = e.readUInt8Enum(wa, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${Fe(e.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Sn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Sn.Fungible:
      return s = $d(e), r = e.readUInt8Enum(wa, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${Fe(e.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Sn.NonFungible:
      s = $d(e);
      const i = Wn(e);
      return r = e.readUInt8Enum(xd, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ye.PostCondition,
        conditionType: Sn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function Tr(e, t) {
  return Ft([e, t]);
}
function y6(e) {
  return new Uint8Array([e.type]);
}
function w6(e) {
  return e.type === ne.OptionalNone ? new Uint8Array([e.type]) : Tr(e.type, Ht(e.value));
}
function b6(e) {
  const t = new Uint8Array(4);
  return Lo(t, e.buffer.length, 0), Tr(e.type, Cl(t, e.buffer));
}
function m6(e) {
  const t = _f($k(e.value, BigInt(jk)), Ww);
  return Tr(e.type, t);
}
function x6(e) {
  const t = _f(e.value, Ww);
  return Tr(e.type, t);
}
function S6(e) {
  return Tr(e.type, Ta(e.address));
}
function A6(e) {
  return Tr(e.type, Cl(Ta(e.address), Mi(e.contractName)));
}
function E6(e) {
  return Tr(e.type, Ht(e.value));
}
function v6(e) {
  const t = [], n = new Uint8Array(4);
  Lo(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Ht(r);
    t.push(s);
  }
  return Tr(e.type, Ft(t));
}
function k6(e) {
  const t = [], n = new Uint8Array(4);
  Lo(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Co(s);
    t.push(Mi(o));
    const i = Ht(e.data[s]);
    t.push(i);
  }
  return Tr(e.type, Ft(t));
}
function bb(e, t) {
  const n = [], r = t == "ascii" ? qw(e.data) : Di(e.data), s = new Uint8Array(4);
  return Lo(s, r.length, 0), n.push(s), n.push(r), Tr(e.type, Ft(n));
}
function $6(e) {
  return bb(e, "ascii");
}
function I6(e) {
  return bb(e, "utf8");
}
function Ht(e) {
  switch (e.type) {
    case ne.BoolTrue:
    case ne.BoolFalse:
      return y6(e);
    case ne.OptionalNone:
    case ne.OptionalSome:
      return w6(e);
    case ne.Buffer:
      return b6(e);
    case ne.UInt:
      return x6(e);
    case ne.Int:
      return m6(e);
    case ne.PrincipalStandard:
      return S6(e);
    case ne.PrincipalContract:
      return A6(e);
    case ne.ResponseOk:
    case ne.ResponseErr:
      return E6(e);
    case ne.List:
      return v6(e);
    case ne.Tuple:
      return k6(e);
    case ne.StringASCII:
      return $6(e);
    case ne.StringUTF8:
      return I6(e);
    default:
      throw new so("Unable to serialize. Invalid Clarity Value.");
  }
}
function L6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const y0 = /* @__PURE__ */ new Map();
function mb(e, t) {
  const n = y0.get(e);
  if (n !== void 0)
    return n(t);
  const r = L6(e);
  return y0.set(e, r), mb(e, t);
}
class aa {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return Ok(this.readBytes(4), 0);
  }
  readUInt8() {
    return Uk(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return _k(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Fe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Fe(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (mb(t, r))
      return r;
    throw n(r);
  }
}
function Wn(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new aa(St(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new aa(e) : t = e;
  switch (t.readUInt8Enum(ne, (r) => {
    throw new Un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ne.Int:
      return z8(t.readBytes(16));
    case ne.UInt:
      return Zn(t.readBytes(16));
    case ne.Buffer:
      const r = t.readUInt32BE();
      return cb(t.readBytes(r));
    case ne.BoolTrue:
      return ib();
    case ne.BoolFalse:
      return ab();
    case ne.PrincipalStandard:
      const s = Bi(t);
      return D8(s);
    case ne.PrincipalContract:
      const o = Bi(t), i = Xn(t);
      return ob(o, i);
    case ne.ResponseOk:
      return K8(Wn(t));
    case ne.ResponseErr:
      return G8(Wn(t));
    case ne.OptionalNone:
      return lb();
    case ne.OptionalSome:
      return ub(Wn(t));
    case ne.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Wn(t));
      return V8(c);
    case ne.Tuple:
      const p = t.readUInt32BE(), g = {};
      for (let x = 0; x < p; x++) {
        const C = Xn(t).content;
        if (C === void 0)
          throw new Un('"content" is undefined');
        g[C] = Wn(t);
      }
      return Xr(g);
    case ne.StringASCII:
      const h = t.readUInt32BE(), w = Tk(t.readBytes(h));
      return Ct(w);
    case ne.StringUTF8:
      const y = t.readUInt32BE(), S = Pf(t.readBytes(y));
      return Y8(S);
    default:
      throw new Un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const C6 = (e) => e.length % 2 == 0 ? e : `0${e}`, T6 = (e, t) => e.padEnd(t, "0"), xb = (e, t) => e ? Di(e).length > t : !1;
function Id(e) {
  return Dy(e);
}
const ma = (e) => o8(Ff(e)), Vf = (e) => Fe(U8(e)), B6 = (e) => Fe(ma(e)), M6 = (e) => {
  const t = ma(e), n = Cl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = ma(n);
  return Fe(r);
}, N6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Ft(n), s = ma(r);
  return Fe(s);
}, _6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Ft(n), s = Ff(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Ft(o), a = ma(i);
  return Fe(a);
};
function P6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Sb(e) {
  const t = Ht(e);
  return `0x${Fe(t)}`;
}
function U6(e) {
  return Wn(e);
}
const gi = (e) => {
  try {
    return Uo.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Yf() {
  return {
    type: ye.MessageSignature,
    data: Fe(new Uint8Array(Tl))
  };
}
function Ab(e, t, n, r) {
  const s = zf(0, e, 1, [Ti(t)]).hash160, o = Fi(Ti(t)) ? kt.Compressed : kt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: bn(n, !1),
    fee: bn(r, !1),
    keyEncoding: o,
    signature: Yf()
  };
}
function xa(e) {
  return "signature" in e;
}
function w0(e) {
  return e === ut.SerializeP2SH || e === ut.SerializeP2WSH;
}
function H6(e) {
  return e === ut.SerializeP2SHNonSequential || e === ut.SerializeP2WSHNonSequential;
}
function b0(e) {
  const t = Id(e);
  return t.nonce = 0, t.fee = 0, xa(t) ? t.signature = Yf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function O6(e) {
  const t = [
    e.hashMode,
    St(e.signer),
    Fs(e.nonce, !1, 8),
    Fs(e.fee, !1, 8),
    e.keyEncoding,
    Rf(e.signature)
  ];
  return Ft(t);
}
function D6(e) {
  const t = [
    e.hashMode,
    St(e.signer),
    Fs(e.nonce, !1, 8),
    Fs(e.fee, !1, 8)
  ], n = Gf(e.fields);
  t.push(Kf(n));
  const r = new Uint8Array(2);
  return Pk(r, e.signaturesRequired, 0), t.push(r), Ft(t);
}
function F6(e, t) {
  const n = Fe(t.readBytes(20)), r = BigInt(`0x${Fe(t.readBytes(8))}`), s = BigInt(`0x${Fe(t.readBytes(8))}`), o = t.readUInt8Enum(kt, (a) => {
    throw new Un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === ut.SerializeP2WPKH && o != kt.Compressed)
    throw new Un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = kd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function j6(e, t) {
  const n = Fe(t.readBytes(20)), r = BigInt("0x" + Fe(t.readBytes(8))), s = BigInt("0x" + Fe(t.readBytes(8))), o = wb(t, ye.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const p of o)
    switch (p.contents.type) {
      case ye.PublicKey:
        Fi(p.contents) || (i = !0);
        break;
      case ye.MessageSignature:
        if (p.pubKeyEncoding === kt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new uo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === ut.SerializeP2WSH || e === ut.SerializeP2WSHNonSequential))
    throw new uo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function uu(e) {
  return xa(e) ? O6(e) : D6(e);
}
function du(e) {
  const t = e.readUInt8Enum(ut, (n) => {
    throw new Un(`Could not parse ${n} as AddressHashMode`);
  });
  return t === ut.SerializeP2PKH || t === ut.SerializeP2WPKH ? F6(t, e) : j6(t, e);
}
function Eb(e, t, n, r) {
  const o = e + Fe(new Uint8Array([t])) + Fe(Fs(n, !1, 8)) + Fe(Fs(r, !1, 8));
  if (St(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Vf(St(o));
}
function vb(e, t, n) {
  const r = 33 + Tl, s = Fi(t) ? kt.Compressed : kt.Uncompressed, o = e + C6(s.toString(16)) + n.data, i = St(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Vf(i);
}
function R6(e, t, n, r, s) {
  const o = Eb(e, t, n, r), i = e6(s, o), a = t6(s), c = vb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function kb(e, t, n, r, s, o) {
  const i = Eb(e, t, n, r), a = Ti(q8(i, o, s)), c = vb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function z6() {
  const e = Ab(ut.SerializeP2PKH, "", 0, 0);
  return e.signer = u6().hash160, e.keyEncoding = kt.Compressed, e.signature = Yf(), e;
}
function m0(e, t, n) {
  return xa(e) ? G6(e, t, n) : K6(e, t, n);
}
function G6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = kb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = zf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new uo(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function K6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ye.PublicKey:
        Fi(c.contents) || (o = !0), r.push(c.contents);
        break;
      case ye.MessageSignature:
        c.pubKeyEncoding === kt.Uncompressed && (o = !0);
        const { pubKey: p, nextSigHash: g } = kb(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (w0(e.hashMode) && (s = g), r.push(p), i += 1, i === 65536)
          throw new uo("Too many signatures");
        break;
    }
  if (w0(e.hashMode) && i !== e.signaturesRequired || H6(e.hashMode) && i < e.signaturesRequired)
    throw new uo("Incorrect number of signatures");
  if (o && (e.hashMode === ut.SerializeP2WSH || e.hashMode === ut.SerializeP2WSHNonSequential))
    throw new uo("Uncompressed keys are not allowed in this hash mode");
  const a = zf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new uo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function $b(e) {
  return {
    authType: Bt.Standard,
    spendingCondition: e
  };
}
function Ib(e, t) {
  return {
    authType: Bt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Ab(ut.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function x0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Bt.Standard:
        return $b(b0(e.spendingCondition));
      case Bt.Sponsored:
        return Ib(b0(e.spendingCondition), z6());
      default:
        throw new Xc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function V6(e, t) {
  switch (e.authType) {
    case Bt.Standard:
      return m0(e.spendingCondition, t, Bt.Standard);
    case Bt.Sponsored:
      return m0(e.spendingCondition, t, Bt.Standard);
    default:
      throw new Xc("Invalid origin auth type");
  }
}
function Y6(e, t) {
  switch (e.authType) {
    case Bt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: bn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Bt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: bn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function q6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: bn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function X6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: bn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function W6(e, t) {
  const n = {
    ...t,
    nonce: bn(t.nonce, !1),
    fee: bn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Z6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Bt.Standard:
      t.push(uu(e.spendingCondition));
      break;
    case Bt.Sponsored:
      t.push(uu(e.spendingCondition)), t.push(uu(e.sponsorSpendingCondition));
      break;
  }
  return Ft(t);
}
function Q6(e) {
  const t = e.readUInt8Enum(Bt, (r) => {
    throw new Un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Bt.Standard:
      return n = du(e), $b(n);
    case Bt.Sponsored:
      n = du(e);
      const r = du(e);
      return Ib(n, r);
  }
}
class J6 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: bn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Dk, this.postConditionMode = o ?? Ci.Deny, this.postConditions = s ?? Gf([]), i)
      this.anchorMode = Gk(i);
    else
      switch (r.payloadType) {
        case Oe.Coinbase:
        case Oe.CoinbaseToAltRecipient:
        case Oe.NakamotoCoinbase:
        case Oe.PoisonMicroblock:
        case Oe.TenureChange:
          this.anchorMode = xn.OnChainOnly;
          break;
        case Oe.ContractCall:
        case Oe.SmartContract:
        case Oe.VersionedSmartContract:
        case Oe.TokenTransfer:
          this.anchorMode = xn.Any;
          break;
      }
  }
  signBegin() {
    const t = Id(this);
    return t.auth = x0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Id(this);
    return t.auth = x0(t.auth), t.txid();
  }
  verifyOrigin() {
    return V6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Bt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Bt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Bt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !xa(n)) {
      const r = Fi(t);
      n.fields.push(fi(r ? kt.Compressed : kt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = R6(n, r, t.fee, t.nonce, s);
    return xa(t) ? t.signature = o : t.fields.push(fi(s.data.byteLength === Xw ? kt.Compressed : kt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Vf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Bt.Sponsored)
      throw new Xc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W6(this.auth, t);
  }
  setFee(t) {
    this.auth = Y6(this.auth, t);
  }
  setNonce(t) {
    this.auth = q6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Bt.Sponsored)
      throw new Xc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = X6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new so('"version" is undefined');
    if (this.chainId === void 0)
      throw new so('"chainId" is undefined');
    if (this.auth === void 0)
      throw new so('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new so('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new so('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Lo(n, this.chainId, 0), t.push(n), t.push(Z6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Kf(this.postConditions)), t.push(hb(this.payload)), Ft(t);
  }
}
function hi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new aa(St(e.slice(2))) : t = new aa(St(e)) : e instanceof Uint8Array ? t = new aa(e) : t = e;
  const n = t.readUInt8Enum(Vc, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = Q6(t), o = t.readUInt8Enum(xn, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), i = t.readUInt8Enum(Ci, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), a = wb(t, ye.PostCondition), c = a6(t);
  return new J6(n, s, c, a, i, o, r);
}
const e$ = j8, ca = Zn, t$ = cb;
const n$ = /* @__PURE__ */ new Set([4001, -31001]), r$ = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], s$ = ["result", "data", "payload", "response", "params"], S0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Nl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Fo = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Vr = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, o$ = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Lb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => o$(o, r)) === s
  );
}, Cb = (e) => e ? Lb(Fo()).some(
  (t) => {
    var n;
    return t.id === e && (Nl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Tb = () => {
  if (typeof window > "u")
    return;
  const e = Fo(), t = Lb(e).filter(
    (n) => {
      var r;
      return Nl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Vr(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of r$) {
    const r = Vr(e, n) ?? (e === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, i$ = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Fo(), n = Vr(t, e) ?? (t === window ? void 0 : Vr(window, e)) ?? ml(e);
  if (n)
    return n;
  if (Nl(e) || Cb(e))
    return Tb();
}, cc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, a$ = ["blockstack-session", "blockstack"], c$ = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of a$) {
      let t = null;
      try {
        t = window.localStorage.getItem(e);
      } catch {
        continue;
      }
      if (!t)
        continue;
      let n = !1;
      try {
        const r = JSON.parse(t);
        n = typeof (r == null ? void 0 : r.version) == "string" && r.version.length > 0;
      } catch {
        n = !1;
      }
      if (!n)
        try {
          window.localStorage.removeItem(e);
        } catch {
        }
    }
};
c$();
const Bb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Pn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, l$ = (e) => {
  const t = Pn(e);
  if (!t)
    return null;
  const n = Bb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, u$ = (e) => {
  const t = Pn(e);
  if (!t)
    return null;
  const n = Bb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Ld = (e, t = "mainnet") => {
  if (typeof e == "string") {
    const n = e.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (e && typeof e == "object") {
    const n = e;
    if (typeof n.network == "string")
      return Ld(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ld(r, t);
  }
  return t;
}, po = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Sa = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return gi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = Sa(s, t + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const n = e, r = [
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
    const o = Sa(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && gi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && gi(n.testnet) ? n.testnet.trim() : null;
}, A0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Mb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && n$.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, To = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Pn(n == null ? void 0 : n.message) ?? Pn(t.message) ?? Pn(t.error) ?? Pn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, Ni = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw To(t);
    if (t.status === "error")
      throw To(t.result ?? t);
  }
  return e;
}, E0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Ni(r);
  } catch (r) {
    throw To(r);
  }
}, Nb = () => Tb(), qf = () => {
  if (typeof window > "u")
    return;
  const e = Fo();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Vr(e, t) ?? (e === window ? void 0 : Vr(window, t));
    if (n)
      return n;
  }
}, v0 = () => {
  if (typeof window > "u")
    return;
  const e = qf();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Fo();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Vr(t, n) ?? (t === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, vc = (e) => {
  var r, s;
  const t = So();
  if (Nl(t) || Cb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Fo() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Nb();
}, fu = (e) => {
  const t = u$(e);
  if (!t)
    return null;
  try {
    const n = hi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Wc = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = fu(e), r = l$(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Pn(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = Wc(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of S0)
    if (fu(s[a])) {
      o = Pn(s[a]);
      break;
    }
  const i = Pn(s.txId) || Pn(s.txid) || Pn(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? Pn(s.txRaw) ?? void 0
    };
  for (const a of S0) {
    const c = fu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Pn(s[a]) ?? void 0
      };
  }
  for (const a of s$) {
    const c = s[a], p = Wc(c, t + 1);
    if (p)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...p,
        txId: p.txId,
        txid: p.txid ?? p.txId
      };
  }
  return null;
}, hu = (e) => {
  const t = Wc(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, d$ = (e) => {
  const t = Wc(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, f$ = (e) => ({
  ...e,
  fee: po(e.fee),
  nonce: po(e.nonce),
  sponsored: e.sponsored === !0
}), k0 = (e) => ({
  recipient: e.recipient,
  amount: po(e.amount) ?? "0",
  memo: e.memo,
  network: Ld(e.network),
  address: e.stxAddress,
  fee: po(e.fee),
  nonce: po(e.nonce),
  sponsored: e.sponsored ?? !1
}), _b = "WALLET_ADDRESS_MISMATCH", h$ = 45e3;
let la = null;
const Cd = (e) => {
  e && (la = { address: e, at: Date.now() });
}, p$ = () => {
  la = null;
}, g$ = () => la && Date.now() - la.at <= h$ ? la.address : null, y$ = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, w$ = async (e) => {
  p$();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Ni(await e.request("wallet_connect")), n = Sa(t);
  return Cd(n), n;
}, b$ = async (e, t, n, r) => {
  try {
    return Ni(await e.request(t, n));
  } catch (s) {
    const o = To(s);
    if (!y$(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await w$(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), o;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : o.message
        ),
        { code: i ? _b : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return Ni(await e.request(t, n));
    } catch (a) {
      throw To(a);
    }
  }
};
let $0 = 3e4;
const m$ = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${$0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, $0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, x$ = async (e, t, n) => {
  const r = (c, p) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${p}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: _b }
      );
    return c;
  }, s = g$();
  if (s)
    return cc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  cc(n, "account-read");
  try {
    const c = Ni(
      await m$(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = Sa(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Mb(c))
      throw To(c);
    cc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return Cd(o), r(o, "wallet_getAccount");
  let i;
  cc(n, "account-reconnect");
  try {
    i = Ni(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), To(c);
  }
  const a = Sa(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Cd(a), r(a, "wallet_connect");
}, S$ = async (e, t) => {
  if (!vc(e)) {
    const o = await E0(
      e,
      "stx_transferStx",
      k0(t)
    );
    return hu(o);
  }
  const n = qf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await E0(
      n,
      "stx_transferStx",
      k0(t)
    );
    return hu(o);
  }
  const r = Nb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await x$(r, t.stxAddress);
  const s = await b$(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: po(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: po(t.fee) } : {}
    },
    t.stxAddress
  );
  return hu(s);
}, A$ = () => So(), Pb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = So(), t = e ? i$(e) : void 0;
  if (t)
    return t;
  const n = Fo() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, I0 = (e, t) => {
  const n = Pb(), r = f$({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, d$(s));
    }
  });
  if (!n || typeof n.request != "function")
    return sc(r, t);
  if (vc(n) && !qf()) {
    const s = v0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: So(),
        route: "legacy-transaction-request"
      }), sc(r, s);
  }
  return void S$(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (A0(s) && vc(n)) {
      const a = v0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: So(),
          route: "legacy-transaction-request"
        }), sc(r, a);
        return;
      }
    }
    if (A0(s) && !vc(n)) {
      sc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Mb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, E$ = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), L0 = (e) => Sb(e).replace(/^0x/, ""), C0 = "This wallet cannot sign messages. Try Xverse or Leather.", T0 = (e) => typeof (e == null ? void 0 : e.request) == "function", B0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", v$ = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, k$ = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function $$(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: L0(t.message),
    domain: L0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function I$(e, t) {
  const n = await mk({
    domain: t.domain,
    message: t.message,
    network: Il(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? E$()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function pu(e) {
  var s, o;
  const t = A$() || "", n = /xverse/i.test(t);
  let r = Pb();
  if (n && !B0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (B0(r))
    try {
      return await I$(r, e);
    } catch (i) {
      if (n || !T0(r) || !k$(i)) throw i;
    }
  if (!n && T0(r))
    try {
      return await $$(r, e);
    } catch (i) {
      throw v$(i) ? new Error(C0) : i;
    }
  throw new Error(C0);
}
const M0 = 1000000n, zr = 1000000n, Zc = 50n, Ot = 3000n, dr = 300n, Wi = 3000n, L$ = 50000n, gu = 200n, _l = 15000n, an = (e) => e + Zc;
function rr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / M0}.${(n % M0).toString().padStart(6, "0")}`;
}
function N0(e, t = dr) {
  return e <= Ot ? 0 : Number((e - Ot) / an(t));
}
function yu(e, t = 0n) {
  const n = zr - e - t;
  return n > 0n ? n : 0n;
}
function C$(e, t = dr) {
  return e > zr ? "over" : e < Ot + an(t) ? "empty" : e < L$ ? "low" : "ok";
}
const T$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", B$ = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", M$ = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function N$(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || M$.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== T$ + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ub = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", wu = 3, _$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", P$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", _0 = 1, [Td, Hb] = Ub.split("."), Vn = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Bd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function U$(e) {
  return Vn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Os(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ob(e, t = []) {
  const n = await Os(`/v2/contracts/call-read/${Td}/${Hb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Td, arguments: t.map((r) => "0x" + Vn(Ht(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return ir(Wn(n.result));
}
async function H$() {
  const e = await Os(`/v2/contracts/source/${Td}/${Hb}?proof=0`);
  if (typeof e.source != "string" || await U$(e.source) !== B$) throw Error("Deployed source does not match the tested helper.");
  if (N$(await Ob("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Db(e) {
  return e.startsWith("SP") && gi(e) && !e.includes(".");
}
async function O$(e) {
  var r;
  if (!Db(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Os(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Os(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function D$(e) {
  const t = await Os(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function F$(e, t) {
  var s, o;
  const n = await Ob("get-owner", [ca(e), ca(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Db(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function j$(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Bd(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function R$(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function z$(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = hi(Bd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || di(na(Yc.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || di(r.contractAddress) + "." + r.contractName.content !== Ub || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Vn(Ht(r.functionArgs[0])) !== Vn(Ht(ca(e.core))) || Vn(Ht(r.functionArgs[1])) !== Vn(Ht(ca(e.song))) || Vn(Ht(r.functionArgs[2])) !== Vn(Ht(t$(Bd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Ci.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== wa.Equal || o.principal.prefix !== 2 || di(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || di(r.contractAddress) + "." + r.contractName.content !== _$ || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Vn(Ht(r.functionArgs[0])) !== Vn(Ht(ca(e.song))) || typeof e.liked != "boolean" || Vn(Ht(r.functionArgs[1])) !== Vn(Ht(e$(e.liked))) || e.amount !== "0" || t.postConditionMode !== Ci.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || ir(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const G$ = "xtrata.xyz/radio/listening-wallet", K$ = "Link a temporary listening wallet for pay-per-play; no spending permission", Sr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && gi(e), V$ = (e) => ({
  domain: Xr({ name: Ct(G$), version: Ct("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Ct(K$),
    main: Ct(e.main),
    listening: Ct(e.listening),
    issued: Zn(e.issued)
  })
}), Fb = 100000n, Y$ = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function q$(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Sr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Fb).sort(Y$);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const lc = 50;
function Qc(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), o = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(o)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: o });
  }
  return { total: t.total, transfers: n };
}
async function X$(e, t, n = 4) {
  if (!Sr(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${lc}&offset=${i}`, s = Qc(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - lc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= lc ? s : Qc(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = q$(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - lc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Hr = 50, W$ = 6, Z$ = 20, P0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function U0(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), p = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(p)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: p });
  }
  return { total: n.total, sent: r, rows: s };
}
async function Q$(e, t, n) {
  if (!Sr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Qc(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Hr}&offset=0`));
    if (!s || s.total > W$ * Hr) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Hr; i < s.total; i += Hr) {
      const a = Qc(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Hr}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (p) => `/extended/v1/address/${e}/transactions?limit=${Hr}&offset=${p}`, a = U0(await t(i(0)), e);
      if (!a || a.total > Z$ * Hr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const p of a.sent) o.set(p.txId, p);
      for (let p = Hr; p < a.total; p += Hr) {
        const g = U0(await t(i(p)), e);
        if (!g || !g.rows.length) return { ok: !1 };
        for (const h of g.rows) c.add(h);
        for (const h of g.sent) o.set(h.txId, h);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function J$(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((h) => h && typeof h.sender == "string" && h.sender !== t && /^\d+$/.test(h.amount) && BigInt(h.amount) > 0n).sort(P0).map((h, w) => {
    const y = BigInt(h.amount);
    return r && h.sender === r.sender ? { sender: h.sender, left: y, kind: "gift", to: r.payer, at: w } : Sr(h.sender) && y >= Fb ? { sender: h.sender, left: y, kind: "deposit", to: h.sender, at: w } : { sender: h.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((h, w) => h + w.left, 0n), i = [...e.outgoing].filter((h) => h && h.recipient !== t && Sr(h.recipient) && h.amount > 0n).sort(P0), a = i.reduce((h, w) => h + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const p = (h, w) => {
    let y = w;
    for (const S of h) {
      if (y <= 0n) break;
      const x = S.left < y ? S.left : y;
      S.left -= x, y -= x;
    }
    return y;
  };
  for (const h of i) {
    const w = p(s.filter((y) => y.to === h.recipient), h.amount);
    w > 0n && p(s, w);
  }
  if (p(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((h, w) => h + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const g = /* @__PURE__ */ new Map();
  for (const h of s) {
    if (h.left <= 0n) continue;
    const w = `${h.kind}:${h.to ?? ""}`, y = g.get(w);
    y ? (y.amount += h.left, y.newest = Math.max(y.newest, h.at)) : g.set(w, { to: h.to, kind: h.kind, amount: h.left, newest: h.at });
  }
  return {
    ok: !0,
    parts: [...g.values()].sort((h, w) => h.newest - w.newest),
    hasTopUp: s.some((h) => h.kind === "deposit")
  };
}
function e5(e, t) {
  const n = e.filter((p) => p.kind === "deposit").sort((p, g) => p.newest - g.newest), r = e.find((p) => p.kind === "gift"), s = e.filter((p) => p.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((p, g) => p + g.amount, 0n), i = [], a = [], c = o > t;
  return n.forEach((p, g) => {
    if (p.amount <= t) {
      a.push(p);
      return;
    }
    const h = g === n.length - 1 && !c;
    i.push({ to: p.to, kind: "deposit", mode: h ? "all" : "amount", send: p.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - t }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function H0(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const uc = 1500n, kc = [100, 250, 500], t5 = (e, t) => BigInt(e) * an(t), Zi = ["prepared", "signed", "unknown", "pending"], n5 = 30 * 6e4, Jc = 6e4, ri = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, r5 = 3e3, el = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", bu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function s5(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, p = null, g = !1, h = !1, w = !1, y = null, S = !1, x = "", C = "", O = 0, U, E = null, L, M = [], G, ee = -1 / 0;
  const Z = /* @__PURE__ */ new Set();
  let Y = null, b = !1, k = 0, P = null, _ = null, K = !1, T = null, z = !1, X = null, ue = !1, v = !1, H = !1, J = !1, ge = !1, me = 0, Se = null, bt = Promise.resolve();
  const Ie = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? dr.toString()), Le = (l) => !!o && !(o.features ?? []).includes(l), Ae = (l, f) => `xtrata.ppp.v1.${l}:${f}`, En = "xtrata.ppp.v1.as-main", vn = () => {
    if (e.main()) return;
    const l = e.store.get(En);
    return l && Sr(l) ? l : void 0;
  }, Ue = () => e.main() ?? vn(), zt = (l = o == null ? void 0 : o.address) => {
    if (!l) return [];
    try {
      const f = JSON.parse(e.store.get(Ae("entries", l)) || "[]");
      return Array.isArray(f) ? f : [];
    } catch {
      return [];
    }
  }, dt = (l) => {
    const f = [l, ...zt(l.address).filter((d) => !(d.txid === l.txid && d.kind === l.kind))].slice(0, 200);
    e.store.set(Ae("entries", l.address), JSON.stringify(f));
  }, kn = (l = o == null ? void 0 : o.address) => !!l && e.store.get(Ae("on", l)) !== "0", tn = (l) => {
    o != null && o.address && e.store.set(Ae("on", o.address), l ? "1" : "0");
  }, Nt = () => zt().filter((l) => Zi.includes(l.status)), qt = () => gt() ? [...Nt(), ...zt(pt()).filter((l) => Zi.includes(l.status))] : Nt(), $t = () => ln(o == null ? void 0 : o.address), ln = (l) => {
    if (!l) return null;
    try {
      return JSON.parse(e.store.get(Ae("deposit", l)) || "null");
    } catch {
      return null;
    }
  }, jt = (l, f = o == null ? void 0 : o.address) => {
    f && e.store.set(Ae("deposit", f), JSON.stringify(l));
  };
  let Je = null;
  const Re = (l = Jc) => {
    const f = e.now();
    Je = { since: Je && f < Je.until ? Je.since : f, until: Math.max((Je == null ? void 0 : Je.until) ?? 0, f + l) };
  }, Xt = () => !!Je && e.now() < Je.until && (i === void 0 || i < Ot + an(Ie())), Rt = () => !!$t() || Xt(), pt = () => Le("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), gt = () => !!(o != null && o.address) && pt() !== o.address, $n = () => gt() ? c && c.for === pt() ? c.value : void 0 : i, Qn = (l) => l !== void 0 && l < Ot + gu, I = () => Nt().filter((l) => e.now() - l.created > n5 && Z.has(l.txid)), V = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!Ue() || r === Ue() && !t.allowed), j = () => V() && !(o != null && o.linked), W = () => {
    const l = Ue();
    return !j() && !!l && !!(o != null && o.linked) && o.linked !== l;
  }, be = (l) => Ae("return-to", l), ve = (l = o == null ? void 0 : o.address) => {
    if (!l) return;
    const f = e.store.get(be(l));
    return f && Sr(f) && f !== l ? f : void 0;
  }, Ye = (l = o == null ? void 0 : o.address) => Y && Y.for === l ? Y.res : null;
  function yt() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const l = ve();
    if (l) return { to: l, kind: "chosen" };
    const f = Ye();
    if (f != null && f.ok && f.funder) return { to: f.funder, kind: "funder" };
  }
  const Ke = (l) => Ae("gift", l);
  function et() {
    const l = o == null ? void 0 : o.address;
    if (!l) return null;
    if ((T == null ? void 0 : T.for) === l) return T.info;
    try {
      const f = JSON.parse(e.store.get(Ke(l)) || "null");
      return f && typeof f.returnTo == "string" && typeof f.treasury == "string" ? f : null;
    } catch {
      return null;
    }
  }
  const je = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let $ = null, se = null, he = !1;
  const Xe = (l) => Ae("award-claim", l), rt = (l) => Ae("award-send", l), At = (l) => {
    try {
      const f = JSON.parse(e.store.get(rt(l)) || "null");
      return f && typeof f.txid == "string" && e.now() - f.at < 2 * 36e5 ? f : null;
    } catch {
      return null;
    }
  }, ft = (l) => {
    try {
      const f = JSON.parse(e.store.get(Xe(l)) || "null");
      return f && typeof f.txid == "string" && e.now() - f.at < 2 * 36e5 ? f : null;
    } catch {
      return null;
    }
  };
  async function un(l = !1) {
    const f = je();
    if (!f || !e.awardStatus || he) return;
    const d = ($ == null ? void 0 : $.for) === f ? $ : null, A = d == null ? void 0 : d.view.state, D = d ? A === "off" || A === "not-a-player" ? 30 * 6e4 : ft(f) || At(f) ? 2e4 : A === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(d && !l && e.now() - d.at < D)) {
      he = !0;
      try {
        const B = await e.awardStatus(f);
        if ($ = { for: f, view: B, at: e.now() }, B.state === "claimed" && e.store.set(Xe(f), ""), B.state === "claimed" && B.holds === !1 && e.store.set(rt(f), ""), B.state === "ready" && e.awardName && (se == null ? void 0 : se.for) !== f)
          try {
            se = { for: f, name: await e.awardName(f), at: e.now() };
          } catch {
            se = { for: f, name: void 0, at: e.now() };
          }
      } catch {
        $ = { for: f, view: d && d.view.state !== "off" && d.view.state !== "not-a-player" ? { ...d.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        he = !1;
      }
    }
  }
  function Kt() {
    const l = je();
    if (!l || ($ == null ? void 0 : $.for) !== l) return null;
    const f = $.view;
    if (f.state === "off" || f.state === "not-a-player") return null;
    const d = f.state === "claimed" ? null : ft(l), A = f.state === "claimed" && f.holds !== !1 ? At(l) : null;
    return { ...f, ...(se == null ? void 0 : se.for) === l ? { name: se.name } : {}, ...d ? { claimTx: d.txid } : {}, ...A ? { sendTx: A.txid } : {} };
  }
  async function Zr() {
    var D;
    const l = o == null ? void 0 : o.address;
    if (!l || !e.giftInfo || !((D = t == null ? void 0 : t.gifts) != null && D.enabled) || z) return;
    const f = (T == null ? void 0 : T.for) === l ? T : null, d = f ? f.ok ? f.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (f && e.now() - f.at < d) return;
    z = !0;
    const A = et();
    try {
      const B = await e.giftInfo(l);
      T = { for: l, info: B, ok: !0, at: e.now() }, e.store.set(Ke(l), JSON.stringify(B));
    } catch {
      T = { for: l, info: A, ok: !1, at: e.now() };
    } finally {
      z = !1;
    }
  }
  const Te = () => zt().reduce((l, f) => Zi.includes(f.status) ? l + BigInt(f.amount || "0") + BigInt(f.fee || "0") : l, 0n);
  function Rs() {
    if (i === void 0) return 0;
    const l = i - Te() - BigInt(ot.length) * an(Ie());
    return l > 0n ? N0(l, Ie()) : 0;
  }
  const zs = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Qr = "EMPTY — ADD STX TO PLAY";
  function jo() {
    if (!(t != null && t.here)) return null;
    const l = (f, d) => ({ reason: f, text: d });
    switch (_t()) {
      case "connect":
      case "wrong-wallet":
        return l("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return l("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return l("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return l("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return l("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return l("locked", "UNLOCK TO LISTEN");
      case "link":
        return l("link", "FINISH SETUP TO LISTEN");
      case "over":
        return l("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Rt() ? l("arriving", "YOUR PLAYS ARE ARRIVING") : l("out", gt() ? zs : Qr);
      case "ready":
        return !kn() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? l("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? Rs() < 1 ? l("out", gt() ? zs : Qr) : null : l("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Jr = () => {
    var l;
    return !!(o != null && o.address) && gt() && !!((l = et()) != null && l.player);
  };
  function dn() {
    return Jr() ? { locked: !0, known: !0 } : null;
  }
  const Br = 3 * 6e4, Ro = () => !!et() && !!e.history && !(o != null && o.linked);
  async function ji() {
    const l = o.address, f = et(), { balance: d, nonce: A } = await e.chain.account(l), D = await e.history(l, !0);
    if (!D.ok) return null;
    const B = J$({ self: l, balance: d, inbound: D.inbound, outgoing: D.outgoing, gift: { sender: f.treasury, payer: f.returnTo } });
    if (!B.ok) return null;
    const R = e5(B.parts, Wi);
    return { balance: d, nonce: A, parts: B.parts, steps: R.steps, tooSmall: R.tooSmall.length };
  }
  const Ri = () => ue ? { state: "unavailable" } : !X || e.now() - X.at > Br || i !== void 0 && i !== X.balance ? { state: "none" } : X.plan;
  function _t() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const l = Ue();
    if (!j()) {
      if (!l) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : W() ? "wrong-wallet" : o.state === "known" ? "locked" : !j() && o.linked !== l ? "link" : i === void 0 ? "loading" : i > zr && !o.backedUp ? "over" : i < Ot + an(Ie()) ? "fund" : "ready" : "loading";
  }
  const Vt = () => {
    var l, f, d, A, D;
    return {
      step: _t(),
      busy: p,
      message: x,
      error: C,
      notice: Gs(),
      gate: t,
      main: Ue(),
      mainConnected: !!e.main(),
      standIn: vn(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: Kt(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((B) => B === "over" && (o != null && o.backedUp) ? "ok" : B)(C$(i, Ie())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > zr && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : N0(i, Ie()),
      allowance: i === void 0 ? zr : yu(i, BigInt(((l = $t()) == null ? void 0 : l.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: kn(),
      entries: zt(),
      depositTxid: ((f = $t()) == null ? void 0 : f.txid) ?? U,
      depositPending: Rt(),
      arrival: Rt() ? { since: ((d = $t()) == null ? void 0 : d.at) ?? (Je == null ? void 0 : Je.since) ?? e.now(), graceMs: Jc } : null,
      walletOutdated: Le("like"),
      linkedListening: G && G === Ue() ? M.map((B) => B.listening) : [],
      serverLinked: !!E && L === `${Ue()}:${o == null ? void 0 : o.address}`,
      stuck: I().length,
      armed: J,
      queued: ot.length,
      solo: j(),
      returnTo: (A = yt()) == null ? void 0 : A.to,
      returnToKind: (D = yt()) == null ? void 0 : D.kind,
      funderState: (() => {
        const B = Ye();
        return B ? B.ok ? B.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const B = Ye();
        return !!B && B.ok && B.distinct > 1;
      })(),
      walletCannotSolo: j() && Le("standalone"),
      walletCannotMulti: Le("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((B) => B !== Ue() && B !== (o == null ? void 0 : o.linked)),
      creditedTo: j() && (o != null && o.address) && (P == null ? void 0 : P.for) === o.address && P.main ? P.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(Ae("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (_ == null ? void 0 : _.for) === o.address && _.unused,
      gift: (() => {
        const B = et();
        return B ? { player: B.player, from: B.from, source: B.source, amount: B.amount, ...B.drop !== void 0 ? { drop: B.drop } : {} } : null;
      })(),
      giftPlays: et() ? Rs() : 0,
      playCost: an(Ie()),
      giftStop: jo(),
      albumLock: dn(),
      returnPlan: Ri(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Le("slots"),
      likeFunds: (() => {
        var Q;
        const B = pt();
        if (!B || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const R = $n();
        return { address: B, balance: R, low: Qn(R), album: gt(), pending: !!ln(B), txid: (Q = ln(B)) == null ? void 0 : Q.txid, main: Ue() };
      })()
    };
  }, Gs = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", He = (l, f = "") => {
    x = l, C = f, e.changed();
  };
  async function Pt(l, f) {
    if (!p) {
      p = l, C = "", e.changed();
      try {
        await f();
      } catch (d) {
        const A = d instanceof Error ? d.message : String(d);
        C = /Cancelled in the listening wallet/.test(A) ? "" : A, C || (x = "Not now. Nothing was signed.", ge = !0);
      } finally {
        p = null, await Ln(!0);
      }
    }
  }
  const es = () => !!(t != null && t.enabled) && t.here && (j() || !!Ue() && t.allowed), Ks = () => es() && !W(), fn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Fn = () => {
    if (W()) throw new Error(fn());
  };
  async function In() {
    if (!es()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const wt = (l) => {
    const f = Ue();
    return l.request("listening.status", f ? { main: f } : void 0);
  };
  async function Mr(l = !1) {
    o != null && o.address && (!l && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await Vs(l)));
  }
  async function Vs(l = !1) {
    const f = pt();
    if (!(!gt() || !f || (o == null ? void 0 : o.state) !== "unlocked") && !(!l && (c == null ? void 0 : c.for) === f && e.now() - c.at < 3e4))
      try {
        c = { for: f, value: await e.chain.balance(f), at: e.now() };
      } catch {
      }
  }
  async function zi(l) {
    if ((G !== l || e.now() - ee >= 6e4) && (M = await e.links(l), G = l, ee = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === l) return;
    const f = `${l}:${o.address}`;
    L === f && E || (E = M.find((d) => d.listening === o.address) ?? null, L = f);
  }
  async function zo() {
    const l = o == null ? void 0 : o.address;
    if (!j() || !l || o != null && o.linked || !e.funder || b || !i || i <= 0n) return;
    const f = Ye(l);
    if (f != null && f.ok && f.funder) return;
    const d = f != null && f.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, k - 1), 30 * 6e4);
    if (!(Y && Y.for === l && e.now() - Y.at < d)) {
      b = !0;
      try {
        Y = { for: l, res: await e.funder(l), at: e.now() };
      } catch {
        Y = { for: l, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      k = Y.res.ok ? 0 : k + 1;
    }
  }
  async function fr() {
    const l = o == null ? void 0 : o.address;
    if (!(!j() || !l || o != null && o.linked || !e.mainOf || K) && !(P && P.for === l && (P.ok || e.now() - P.at < 6e4))) {
      K = !0;
      try {
        P = { for: l, main: await e.mainOf(l), ok: !0, at: e.now() };
      } catch {
        P = { for: l, main: null, ok: !1, at: e.now() };
      } finally {
        K = !1;
      }
    }
  }
  async function Ys() {
    const l = o == null ? void 0 : o.address;
    if (!(!l || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (_ == null ? void 0 : _.for) === l) && e.store.get(Ae("created", l)) !== "1")
      try {
        _ = { for: l, unused: await e.chain.confirmedNonce(l) === 0n };
      } catch {
      }
  }
  async function qs() {
    var D;
    const l = o == null ? void 0 : o.address;
    if (!l) return !1;
    let f, d = !1;
    const A = /* @__PURE__ */ new Map();
    for (const B of qt())
      try {
        const R = await e.chain.transaction(B.txid);
        if (!R) {
          if (Z.add(B.txid), e.now() - B.created > 15 * 6e4 && !A.has(B.address) && A.set(B.address, await e.chain.confirmedNonce(B.address)), f = A.get(B.address), f !== void 0 && f > BigInt(B.nonce)) {
            dt({ ...B, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((B.status === "unknown" || B.status === "signed") && B.raw)
            try {
              await e.chain.broadcast(B.raw, B.txid), dt({ ...B, status: "pending" });
            } catch (re) {
              ri(re) && dt({ ...B, status: "failed", note: re.message, raw: void 0 });
            }
          continue;
        }
        Z.delete(B.txid);
        const Q = String(R.tx_status);
        if (Q === "success" && R.canonical !== !1 && R.is_unanchored === !1) {
          if (dt({ ...B, status: "confirmed", confirmedAt: e.now(), actualFee: String(R.fee_rate ?? B.fee), raw: void 0 }), d = !0, B.kind === "like" && (S = !0, B.status !== "confirmed" && typeof B.liked == "boolean"))
            try {
              (D = e.likeConfirmed) == null || D.call(e, B.song, B.liked);
            } catch {
            }
        } else Q.startsWith("abort_") || Q.startsWith("dropped_") ? dt({ ...B, status: "failed", note: Q, raw: void 0 }) : B.status !== "pending" && dt({ ...B, status: "pending" });
      } catch {
      }
    for (const B of gt() ? [l, pt()] : [l]) {
      const R = ln(B);
      if (R)
        try {
          const Q = await e.chain.transaction(R.txid), re = String((Q == null ? void 0 : Q.tx_status) ?? "");
          (re === "success" && Q.is_unanchored === !1 || re.startsWith("abort_") || re.startsWith("dropped_") || !Q && e.now() - R.at > 2 * 36e5) && (jt(null, B), re === "success" && Re(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return d;
  }
  async function Ln(l = !1) {
    var f;
    try {
      const d = Ue();
      if ((l || !t || r !== d || e.now() - n > 3e5) && (t = await e.config(d), n = e.now(), r = d), !t.enabled || !t.here || !j() && (!d || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), J && ts(), e.changed();
        return;
      }
      await In(), o = await wt(s), W() && o.state === "unlocked" && (Pr(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await wt(s)), d && t.allowed && await zi(d), await Mr(l), await zo(), await fr(), await Ys(), await Zr(), await un(), await qs() && await Mr(!0), await Vs(), await Xo(), O = 0;
    } catch {
      O++;
    }
    if (_t() === "locked" ? Vo() : J && ts(), S) {
      S = !1;
      try {
        (f = e.likesChanged) == null || f.call(e);
      } catch {
      }
    }
    e.changed(), ot.length && !Rn && ss();
  }
  async function Go(l) {
    const f = o == null ? void 0 : o.root;
    if (!f || o != null && o.slot || !(o != null && o.address) || Le("slots")) return;
    const d = Number(e.store.get(Ae("slot", f)));
    if (!(!Number.isSafeInteger(d) || d < 1))
      try {
        const { balance: A } = await e.chain.account(o.address);
        if (A >= Ot + an(Ie())) return;
        await l.request("listening.openSlot", { slot: d }), o = await wt(l), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ko(l, f) {
    var B;
    Fn();
    const d = !(o != null && o.address) || kn(o.address), A = o != null && o.linked ? (B = e.nameOf) == null ? void 0 : B.call(e, o.linked) : void 0;
    await l.request("listening.unlock", { mode: "unlock", terms: d ? Xs() : void 0, anyPasskey: f, ...Ue() ? { main: Ue() } : {}, ...A ? { label: A } : {} }), o = await wt(l), d && (kn(o.address) ? await Cn() : await l.request("listening.stop")), await Go(l), He(d ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const D = y;
    y = null, D && e.now() - D.at < 12e4 && setTimeout(() => void Ln(!0).then(() => mn(D)), 0);
  }
  function Vo() {
    J || p || ge || me >= 3 || !s || !(o != null && o.address) || (J = !0, bt = (async () => {
      try {
        await Ko(s, !1), me = 0;
      } catch (l) {
        const f = l instanceof Error ? l.message : String(l);
        /Cancelled in the listening wallet/.test(f) ? Se || (ge = !0, He("Not now. Nothing was signed.")) : /did not answer/.test(f) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (me++, C = f);
      } finally {
        J = !1;
        const l = Se;
        Se = null, l ? await l() : await Ln(!0);
      }
    })());
  }
  async function ts(l) {
    J && (Se = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await bt), l && await l(), e.changed();
  }
  const Xs = () => ({
    fee: Ie().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: zr.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Cn() {
    if (!(o != null && o.address)) return !1;
    if (H || (H = await e.tabLock(o.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ns(l, f) {
    const d = o.address, { balance: A, nonce: D } = f ?? await e.chain.account(d);
    i = A;
    const B = await s.request("listening.prepareReturn", {
      mode: l.mode,
      balance: A.toString(),
      nonce: D.toString(),
      fee: Wi.toString(),
      ...l.amount !== void 0 ? { amount: l.amount.toString() } : {},
      ...l.linked ? {} : { destination: l.to }
    });
    if (B.recipient !== l.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const R = l.mode === "amount" ? l.amount : l.mode === "all" ? A - Wi : A - zr - Wi, Q = hi(B.raw);
    if (ir(Q.payload.recipient).value !== l.to || String(Q.payload.amount) !== B.amount || R !== void 0 && B.amount !== R.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const re = {
      id: bu(),
      address: d,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: B.recipient,
      amount: B.amount,
      fee: B.fee,
      nonce: D.toString(),
      created: e.now(),
      status: "signed",
      raw: B.raw,
      txid: B.txid
    };
    e.validate(re), dt(re);
    try {
      await e.chain.broadcast(B.raw, B.txid), dt({ ...re, status: "pending" });
    } catch (ie) {
      throw dt({ ...re, status: "unknown", note: ie.message }), ie;
    }
    return B;
  }
  const Ws = _l, Nr = Wi;
  async function Yo(l, f, d) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Le("slots") || Le("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const A = o.slot ?? 0;
    if (l === f || ![l, f].includes(A) || ![l, f].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const D = o.root ?? o.address, B = l === 0 ? D : o.address, R = f === 0 ? D : o.address, { balance: Q, nonce: re } = await e.chain.account(B);
    if (Q < d + Nr + Ot) throw new Error(l === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const ie = await s.request("listening.signMove", { from: l, to: f, amount: d.toString(), fee: Nr.toString(), nonce: re.toString(), balance: Q.toString() }), de = hi(ie.raw);
    if (ie.from !== B || ie.to !== R || ie.amount !== d.toString() || ir(de.payload.recipient).value !== R || String(de.payload.amount) !== d.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const pe = {
      id: bu(),
      address: B,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: R,
      amount: ie.amount,
      fee: ie.fee,
      nonce: re.toString(),
      created: e.now(),
      status: "signed",
      raw: ie.raw,
      txid: ie.txid
    };
    e.validate(pe), dt(pe);
    try {
      await e.chain.broadcast(ie.raw, ie.txid), dt({ ...pe, status: "pending" });
    } catch (fe) {
      throw dt({ ...pe, status: "unknown", note: fe.message }), fe;
    }
    return jt({ txid: ie.txid, amount: ie.amount, at: e.now() }, R), R === D && D !== o.address ? c = null : a = -1 / 0, ie;
  }
  let qe = !1;
  const qo = /* @__PURE__ */ new Map(), Zs = (l) => Ae("float", l);
  async function Xo() {
    if (qe || (o == null ? void 0 : o.state) !== "unlocked" || !gt() || Le("move") || Le("rootLike") || !o.address) return;
    const l = o.address;
    if (e.store.get(Zs(l)) === "1") return;
    const f = et();
    if (!(f != null && f.player) || f.state !== "arrived") return;
    const d = $n();
    if (d === void 0 || i === void 0) return;
    if (!Qn(d)) {
      e.store.set(Zs(l), "1");
      return;
    }
    if (ln(pt()) || rs() || qt().length || i < Ws * 4n + Ot + Nr) return;
    const A = qo.get(l);
    if (!(A && (A.n >= 3 || e.now() - A.at < 5 * 6e4))) {
      qe = !0, qo.set(l, { n: ((A == null ? void 0 : A.n) ?? 0) + 1, at: e.now() });
      try {
        await Yo(o.slot ?? 0, 0, Ws), e.store.set(Zs(l), "1");
      } catch (D) {
        console.warn("[radio] likes float not sent yet", D);
      } finally {
        qe = !1;
      }
    }
  }
  async function Gi(l) {
    if (Nt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Le("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const f = await ji().catch(() => null);
    if (!f)
      throw X = null, ue = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ue = !1, i = f.balance;
    const d = { balance: f.balance, nonce: f.nonce };
    if (l === "excess") {
      const Q = H0(f.parts) ?? ve();
      if (!Q) throw new Error("Choose where to send the excess first.");
      await ns({ mode: "excess", to: Q, linked: !1 }, d), X = null, He("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const A = f.steps;
    if (!A.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!X && X.balance === f.balance && e.now() - X.at <= Br && X.steps.length === A.length && X.steps.every((Q, re) => Q.to === A[re].to && Q.mode === A[re].mode && Q.send === A[re].send))) {
      X = {
        at: e.now(),
        balance: f.balance,
        steps: A,
        parts: f.parts,
        plan: { state: "ready", steps: A.map((Q) => ({ to: Q.to, kind: Q.kind, send: Q.send.toString() })), kept: f.tooSmall, excess: H0(f.parts) }
      }, He(A.length > 1 ? `This goes back in ${A.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const B = A[0], R = B.to ?? ve();
    if (!R) throw new Error("Choose where to send the rest first.");
    if (B.mode === "amount" && Le("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ns({ mode: B.mode, to: R, linked: !1, ...B.mode === "amount" ? { amount: B.send } : {} }, d), X = null, A.length === 1 ? (tn(!1), He("Returned ✓ Paying is off.")) : He(`Returned ✓ ${A.length - 1} more ${A.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Qs() {
    if (!(o != null && o.unproven)) return;
    const l = await In();
    await l.request("listening.prove"), o = await wt(l);
  }
  const _r = {
    forceRefresh: () => Ln(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (l) => {
      if (!e.main() && !(l !== null && !Sr(l))) {
        if (l === vn()) return Ln(!0);
        e.store.set(En, l ?? ""), C = "", x = "", i = void 0, a = -1 / 0, c = null, await Ln(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (l) => Pt("Waiting for your passkey…", async () => {
      const f = await In();
      await f.request("listening.unlock", { mode: "create", terms: Xs(), ...e.main() ? { main: e.main() } : {}, ...l != null && l.quick && !e.main() ? { quick: !0 } : {} }), o = await wt(f), o.address && e.store.set(Ae("created", o.address), "1"), tn(!0), He(j() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Cn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (l) => {
      l ? Re() : Je = null, e.changed();
    },
    giftSent: (l, f) => {
      !(o != null && o.address) || $t() || (jt({ txid: l, amount: f.toString(), at: e.now() }), a = -1 / 0, T = null, He("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (l) => {
      if (Fn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Le("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await In()).request("listening.bindSlot", { slot: l, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (l, f, d, A) => {
      jt({ txid: d, amount: A.toString(), at: e.now() }, f), T = null, await _r.openAlbum(l), He("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (l) => Pt("Opening…", async () => {
      if (Fn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Le("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (g || h || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === l) return;
      Pr(), await s.request("listening.openSlot", { slot: l }), o = await wt(s), i = void 0, a = -1 / 0, X = null, ue = !1;
      const f = o.root;
      f && l > 0 && e.store.set(Ae("slot", f), String(l)), He(l === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (l = !1) => {
      const f = () => Pt("Waiting for your passkey…", async () => Ko(await In(), l));
      return J ? l ? Le("cancel") ? (He("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ts(async () => {
        (_t() === "locked" || _t() === "intro") && await f();
      }) : bt : f();
    },
    link: () => Pt("Sign in your wallet…", async () => {
      Fn();
      const l = e.main();
      if (!l || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const f = (await e.links(l)).find((d) => d.listening === o.address);
      if (f)
        await s.request("listening.link", { main: l, issued: f.issued, mainSignature: f.mainSignature });
      else {
        const d = { main: l, listening: o.address, issued: e.now() }, A = await e.signWithMain(l, V$(d)), D = await s.request("listening.link", { main: l, issued: d.issued, mainSignature: A });
        await e.saveLink({ ...d, mainSignature: A, listeningSignature: D.listeningSignature }), ee = -1 / 0;
      }
      He("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Pt("One more passkey check…", Qs), !(o != null && o.unproven)) : !0,
    deposit: () => Pt("Approve the deposit in your wallet…", async () => {
      Fn(), await Qs();
      const l = e.main();
      if (!l || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if ($t()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Xt()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Mr(!0);
      const f = yu(i ?? 0n);
      if (f <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(l, o.address, f), U && jt({ txid: U, amount: f.toString(), at: e.now() }), He("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Pt("Approve the top-up in your wallet…", async () => {
      Fn(), await Qs();
      const l = e.main(), f = pt();
      if (!l || !f) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ln(f)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const d = await e.chain.balance(f);
      gt() ? c = { for: f, value: d, at: e.now() } : (i = d, a = e.now());
      const A = yu(d);
      if (A <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const D = await e.deposit(l, f, A);
      D && jt({ txid: D, amount: A.toString(), at: e.now() }, f), He("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (l) => Pt("Adding plays…", async () => {
      if (Fn(), !gt()) throw new Error("Open the album you want to add plays to first.");
      if (!kc.includes(l)) throw new Error("Choose one of the amounts offered.");
      const f = t5(l, Ie());
      if (g || h || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (qt().length || $t()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Yo(0, o.slot ?? 0, f), He("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Pt("Confirm in the listening wallet…", async () => {
      if (!Ks()) throw new Error("Connect your wallet first.");
      await Cn(), await s.request("listening.approveSession", Xs()), tn(!0), He("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Pt("Clearing…", async () => {
      for (const l of I())
        await e.chain.transaction(l.txid) || dt({ ...l, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      He("Cleared ✓");
    }),
    switchOff: () => Pt("Switching off…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.stop")), tn(!1), He("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Pt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const l = await In();
      await l.request("listening.backup"), o = await wt(l), He("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (l, f) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Le("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await In()).request("listening.signShelf", { action: l, ...f ? { release: f } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      se = null, await un(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (l) => Pt("Confirm in the listening wallet…", async () => {
      var re, ie, de, pe;
      const f = je();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !f) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Le("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (ft(f)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (g || h || w || qt().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Cn();
      const d = await e.awardNote(f, l), { balance: A, nonce: D } = await e.chain.account(f);
      if (A < uc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const R = await (await In()).request("listening.signAward", {
        cls: d.cls,
        number: d.number,
        plays: d.plays,
        record: d.record,
        signature: d.signature,
        fee: uc.toString(),
        nonce: D.toString(),
        balance: A.toString()
      }), Q = hi(R.raw);
      if (R.hero !== f || R.number !== d.number || ((ie = (re = Q.payload) == null ? void 0 : re.functionName) == null ? void 0 : ie.content) !== "claim" || ((pe = (de = Q.payload) == null ? void 0 : de.contractName) == null ? void 0 : pe.content) !== P$.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(R.raw, R.txid), e.store.set(Xe(f), JSON.stringify({ txid: R.txid, at: e.now() })), a = -1 / 0, $ && ($ = { ...$, at: -1 / 0 }), He("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (l) => Pt("Confirm in the listening wallet…", async () => {
      var ie, de, pe;
      const f = je(), d = Kt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !f) throw new Error("Unlock your player first.");
      if ((d == null ? void 0 : d.state) !== "claimed" || d.inscription === void 0) throw new Error("There is no record to send yet.");
      if (d.holds === !1) throw new Error("This record has already been sent.");
      if (d.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (At(f)) throw new Error("Your record is already on its way.");
      const A = l.trim();
      if (!Sr(A)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (A === f) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Le("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (g || h || w || qt().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Cn();
      const { balance: D, nonce: B } = await e.chain.account(f);
      if (D < uc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const Q = await (await In()).request("listening.signSendRecord", { inscription: d.inscription, recipient: A, fee: uc.toString(), nonce: B.toString(), balance: D.toString() }), re = hi(Q.raw);
      if (Q.from !== f || Q.recipient !== A || Q.inscription !== d.inscription || ((de = (ie = re.payload) == null ? void 0 : ie.functionName) == null ? void 0 : de.content) !== "transfer" || ir((pe = re.payload.functionArgs) == null ? void 0 : pe[2]).value !== A)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(Q.raw, Q.txid), e.store.set(rt(f), JSON.stringify({ txid: Q.txid, at: e.now() })), a = -1 / 0, $ && ($ = { ...$, at: -1 / 0 }), He("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Pt("Locking…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, He("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (l) => {
      const f = String(l ?? "").trim();
      if (!(o != null && o.address)) return He("", "Unlock the listening wallet first.");
      if (!Sr(f)) return He("", "Enter a standard mainnet address (it starts with SP).");
      if (f === o.address) return He("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(be(o.address), f), He("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(be(o.address), ""), e.changed();
    },
    returnFunds: (l) => Pt("Check the return in the listening wallet…", async () => {
      if (!Ks()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Ro()) return Gi(l);
      const f = yt();
      if (!f) throw new Error(j() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (f.kind !== "linked" && Le("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Nt().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ns({ mode: l, to: f.to, linked: f.kind === "linked" }), l === "all" && tn(!1), He(l === "all" ? f.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ot = [], Tn = 10, jn = 30 * 6e4;
  let Rn = !1;
  const rs = () => g || !!p || h || w, Pr = () => {
    ot.length && (ot.length = 0, e.changed());
  };
  async function Wo(l) {
    if (!ot.some((f) => f.id === l.id) && !zt().some((f) => f.id === l.id) && (ot.push({ ...l, at: e.now() }), ot.length > Tn && ot.shift()), rs() || Nt().length) {
      const f = ot.length;
      x = `Queued ${f === 1 ? "this song" : f + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await ss();
  }
  async function ss() {
    if (!Rn) {
      Rn = !0;
      try {
        for (; ot.length; ) {
          for (; ot.length && e.now() - ot[0].at > jn; ) ot.shift();
          if (!ot.length || rs() || await Zo(ot[0]) === "wait") return;
          ot.shift();
        }
      } finally {
        Rn = !1, e.changed();
      }
    }
  }
  async function Zo(l) {
    var f;
    g = !0;
    try {
      await Ln();
      const d = _t();
      if (d === "loading") return "wait";
      if (d !== "ready" || !kn() || !(o != null && o.session) || o.session.playsLeft < 1 || !H) return "done";
      if (Nt().length) return "wait";
      v || (await e.chain.verify(), v = !0);
      const A = o.address, { balance: D, nonce: B } = await e.chain.account(A);
      i = D, a = e.now();
      const R = await e.chain.owner(wu, l.song);
      if (R === A || R === Ue()) return "done";
      const Q = await s.request("listening.signPlay", {
        core: wu,
        song: l.song,
        receipt: l.id,
        fee: Ie().toString(),
        nonce: B.toString(),
        balance: D.toString()
      }), re = {
        id: l.id,
        address: A,
        kind: "play",
        core: wu,
        song: l.song,
        recipient: R,
        amount: "50",
        fee: Ie().toString(),
        nonce: B.toString(),
        created: e.now(),
        status: "signed",
        raw: Q.raw,
        txid: Q.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...l.title ? { title: String(l.title).slice(0, 120) } : {},
        ...l.artist ? { artist: String(l.artist).slice(0, 120) } : {}
      };
      e.validate(re), dt(re);
      const ie = l.title ? `“${l.title}”${l.artist ? ` by ${l.artist}` : ""}` : `song #${l.song}`;
      try {
        await e.chain.broadcast(Q.raw, Q.txid), dt({ ...re, status: "pending" }), x = `♪ Paid ${ie}`, C = "";
      } catch (de) {
        dt({ ...re, status: ri(de) ? "failed" : "unknown", note: de.message, ...ri(de) ? { raw: void 0 } : {} }), C = de.message;
      }
      return o = await wt(s), "done";
    } catch (d) {
      const A = d instanceof Error ? d.message : "payment unavailable";
      return (f = et()) != null && f.player ? (x = "Payment is taking a moment: " + A, "wait") : (x = "This song played free: " + A, "done");
    } finally {
      g = !1, e.changed();
    }
  }
  function Js(l) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(_t()) || Le("like") ? !1 : (mn(l), !0);
  }
  async function mn(l) {
    const f = l.title ? `“${l.title}”` : `song #${l.song}`, d = (m) => {
      var N;
      C = m, x = "";
      try {
        (N = e.likeFailed) == null || N.call(e, l.song);
      } catch {
      }
      e.changed();
    }, A = gt(), D = _t(), B = Ue(), R = A && (D === "fund" || D === "over") ? "ready" : D, Q = j() ? pt() : B;
    if (R === "locked") {
      y = { ...l, at: e.now() }, He(`Unlock to like ${f}. It sends straight after.`);
      return;
    }
    if (R === "wrong-wallet") return d(fn());
    if (R === "link") return d("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (j() && Le("standalone")) return d("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (R === "fund") return d("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (R === "over") return d("Return the excess first: the listening wallet holds more than 1 STX.");
    if (A) {
      await Vs(!0);
      const m = $n();
      if (Qn(m))
        return e.changed(), d(el);
    }
    if (R !== "ready" || !Q) return d("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return d("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return d("Pay-per-play is running in another tab. Like from that tab.");
    const re = zt(pt()).find((m) => m.kind === "like" && m.song === l.song);
    if (re && Zi.includes(re.status))
      return d(`Your last like for ${f} is still on its way. It can change again once it confirms.`);
    if (h) return d("One like at a time: your last one is still being sent.");
    if ((re == null ? void 0 : re.status) === "confirmed" && e.now() - (re.confirmedAt ?? 0) < r5)
      return d(`Your like for ${f} has only just confirmed. Try again in a moment.`);
    let ie;
    w = !0;
    try {
      ie = e.likeState ? (await e.likeState(Q, l.song)).by : l.likedBy ?? [];
    } catch {
      ie = l.likedBy;
    } finally {
      w = !1;
    }
    if (!ie) return d(`Could not check ${f} right now. Try the heart again.`);
    const de = pt(), fe = ((re == null ? void 0 : re.status) === "confirmed" && typeof re.liked == "boolean" && e.now() - (re.confirmedAt ?? re.created) < 5 * 6e4 ? re.liked : void 0) ?? ie.includes(de);
    if (!fe && ie.some((m) => m !== de)) return d(j() ? `${f} was liked from another wallet of yours. Unlike it there.` : `${f} was liked from your main wallet${ie.includes(B) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await u({ song: l.song, liked: !fe, title: l.title, artist: l.artist });
  }
  async function u(l) {
    var A, D, B;
    if (h) {
      He("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const f = l.title ? `“${l.title}”${l.artist ? ` by ${l.artist}` : ""}` : `song #${l.song}`, d = e.wait ?? ((R) => new Promise((Q) => setTimeout(Q, R)));
    try {
      He(`${l.liked ? "Liking" : "Unliking"} ${f}…`);
      const R = e.now() + 12e4;
      for (; g || (gt() ? zt(pt()).some((fe) => Zi.includes(fe.status)) : Nt().length); ) {
        if (e.now() > R) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await d(5e3), await Ln(!0);
      }
      if (!gt() && _t() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const Q = pt(), { balance: re, nonce: ie } = await e.chain.account(Q);
      if (gt() ? c = { for: Q, value: re, at: e.now() } : (i = re, a = e.now()), Qn(re)) throw new Error(el);
      const de = await s.request("listening.signLike", {
        song: l.song,
        liked: l.liked,
        fee: gu.toString(),
        nonce: ie.toString(),
        balance: re.toString()
      }), pe = {
        id: bu(),
        address: Q,
        kind: "like",
        core: 0,
        song: l.song,
        liked: l.liked,
        recipient: "",
        amount: "0",
        fee: gu.toString(),
        nonce: ie.toString(),
        created: e.now(),
        status: "signed",
        raw: de.raw,
        txid: de.txid,
        ...l.title ? { title: String(l.title).slice(0, 120) } : {},
        ...l.artist ? { artist: String(l.artist).slice(0, 120) } : {}
      };
      e.validate(pe), dt(pe);
      try {
        await e.chain.broadcast(de.raw, de.txid), dt({ ...pe, status: "pending" }), x = `${l.liked ? "♥ Liked" : "Unliked"} ${f}`, C = "";
        try {
          (A = e.likeSent) == null || A.call(e, l.song, l.liked);
        } catch {
        }
      } catch (fe) {
        if (dt({ ...pe, status: ri(fe) ? "failed" : "unknown", note: fe.message, ...ri(fe) ? { raw: void 0 } : {} }), C = fe.message, ri(fe)) try {
          (D = e.likeFailed) == null || D.call(e, l.song);
        } catch {
        }
      }
      o = await wt(s);
    } catch (R) {
      C = "Like not sent: " + (R instanceof Error ? R.message : "the listening wallet is unavailable");
      try {
        (B = e.likeFailed) == null || B.call(e, l.song);
      } catch {
      }
    } finally {
      h = !1, e.changed(), ss();
    }
  }
  return { snapshot: Vt, refresh: Ln, onListened: Wo, heart: Js, toggleLike: mn, ..._r };
}
const jb = ["Connect", "Passkey", "Link & fund", "Listen"], Rb = ["Passkey", "Add 1 STX", "Listen"], Md = (e) => e ? Rb : jb;
function o5(e) {
  if (e.solo) return i5(e);
  const t = jb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
  switch (e.step) {
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
      return n(2, e.depositPending ? "funds on their way: nothing to do" : "add up to 1 STX");
    case "over":
      return n(2, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(3, "switch paying on");
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function i5(e) {
  const t = Rb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
  switch (e.step) {
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
      return n(1, e.depositPending ? "your funds are on their way: nothing to do" : "add 1 STX: anyone can send it to your address");
    case "over":
      return n(1, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(2, "switch paying on");
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function a5(e, t) {
  return !t || t.at >= Md(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const c5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function l5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !c5(r.id)));
}
const u5 = {}, d5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, f5 = (e) => {
  const t = u5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, h5 = (e) => `/hiro/${e}`, p5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, g5 = (e) => {
  const t = f5(e);
  if (t)
    return [p5(t)];
  const n = d5[e];
  return typeof window < "u" ? [`${window.location.origin}${h5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, y5 = {}, O0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, w5 = "xtrata.log.enabled", b5 = "xtrata.log.level", m5 = "xtrata.log.tags", x5 = "xtrata.log.dedupe", dc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, S5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, A5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, E5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, v5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, k5 = () => {
  const e = y5 ?? {}, t = dc(w5) ?? e.VITE_LOG_ENABLED, n = dc(b5) ?? e.VITE_LOG_LEVEL, r = dc(m5) ?? e.VITE_LOG_TAGS, s = dc(x5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: S5(t),
    level: A5(n) ?? "warn",
    tags: v5(r),
    dedupe: E5(s)
  };
}, $5 = (e, t, n) => !e.enabled || O0[n] < O0[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), I5 = (e, t, n, r) => {
  const s = k5();
  if (!$5(s, t, e) || C5(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, L5 = /* @__PURE__ */ new Set();
let D0 = null;
const C5 = (e, t, n, r, s) => (D0 !== e && (L5.clear(), D0 = e), !1), T5 = (e, t, n) => I5("debug", e, t, n), B5 = {}, M5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, N5 = (e) => {
  const t = B5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : M5[e];
}, _5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, P5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return _5.test(n) ? n : null;
}, U5 = (e) => e.replace(/\/+$/, ""), H5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), F0 = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const s = Number.parseInt(t.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, si = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, O5 = (e) => {
  var c, p;
  let t;
  try {
    t = ir(U6(e));
  } catch {
    return null;
  }
  const n = si(t);
  if (!n || n.success === !1)
    return null;
  const r = si(n.value), s = si(r == null ? void 0 : r.value), o = si(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = F0((c = si(o.name)) == null ? void 0 : c.value), a = F0((p = si(o.namespace)) == null ? void 0 : p.value);
  return !i || !a ? null : P5(`${i}.${a}`);
}, D5 = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${U5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Sb(sb(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : O5(o.result);
}, F5 = async (e) => {
  const t = e.address.trim();
  if (!gi(t))
    return null;
  const n = N5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of g5(e.network))
    try {
      return await D5({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return T5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: H5(r)
  }), null;
};
function j5(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((p) => {
      c.pending = !1, p && (c.name = p, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = o.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, o.set(a, c), i(a, c)), c.name;
    }
  };
}
const j0 = Object.freeze({
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
}), R0 = Object.freeze({ 139: "melophonic" });
function z0(e, t = "") {
  const n = String(e);
  return Object.hasOwn(j0, n) ? j0[n] : Object.hasOwn(R0, n) ? R0[n] : t;
}
const G0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function K0(e, t = "") {
  return Object.hasOwn(G0, String(e)) ? G0[String(e)] : t;
}
const zb = 10000n, Xf = 1000000n, tl = 3000n, R5 = (e, t) => `${e}#gift=${t}`, z5 = 100, Qi = (e, t = dr) => e <= Ot ? 0 : Number((e - Ot) / an(t)), V0 = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Gb = "xtrata.xyz/radio/gifts", mu = z5, G5 = "Create a prefunded Xtrata radio gift batch", K5 = (e) => ({
  domain: Xr({ name: Ct(Gb), version: Ct("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Ct(G5),
    creator: Ct(e.creator),
    count: Zn(e.count),
    amount: Zn(BigInt(e.amount)),
    label: Ct(e.label),
    issued: Zn(e.issued),
    ...e.player ? { player: Ct(e.player) } : {}
  })
}), V5 = (e, t, n = dr) => Ot + BigInt(e) * an(n) + (t ? _l : 0n), Y5 = (e, t = dr) => Number((Xf - Ot - (e ? _l : 0n)) / an(t)), q5 = (e, t) => BigInt(e) * (t + tl);
function X5(e, t, n, r = dr) {
  const s = n ? _l : 0n, o = t > Ot + s ? t - Ot - s : 0n, i = Number(o / an(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Zc,
    fees: BigInt(i) * r,
    reserve: Ot,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: tl,
    perCopy: t + tl,
    total: q5(e, t)
  };
}
const W5 = (e) => e >= zb && e <= Xf, Y0 = 40, Z5 = "Create an Xtrata radio gift player", Kb = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), Q5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function q0(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && Q5.test(e) : !n;
}
function Vb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!q0(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!q0(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Y0) throw new Error(`A player holds 1 to ${Y0} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const s of e.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(s)) throw new Error("A song appears twice in the list.");
    t.add(s);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!t.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, o) => s - o);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Yb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Zd(ef(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, J5 = (e) => ({
  domain: Xr({ name: Ct(Gb), version: Ct("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Ct(Z5),
    admin: Ct(e.admin),
    player: Ct(e.hash),
    issued: Zn(e.issued)
  })
}), kr = (e) => e.tracks.filter((t) => !t.hidden), eI = (e) => e.tracks.find((t) => t.hidden) ?? null, X0 = [300, 500, 1e3], W0 = 1800, xu = /* @__PURE__ */ new Map();
async function tI(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
  }
  try {
    const t = document.createElement("textarea");
    t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.append(t), t.select();
    const n = document.execCommand("copy");
    return t.remove(), n;
  } catch {
    return !1;
  }
}
function nI(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = xu.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      xu.set(e, { ...a, until: Date.now() + W0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        xu.delete(e), s();
      }, W0 + 50);
    }
  }, o;
}
const sr = (e, t, n, r, s) => nI(e, t, async () => await tI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), to = "xtrata.radio.gift.incoming.v1", Z0 = (e) => "xtrata.radio.gift.mine.v1:" + e, Q0 = (e) => "xtrata.radio.gift.batches.v1:" + e, Ee = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, br = (e, t, n = "") => {
  const r = Ee("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, fc = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Gn = (e) => rr(e).replace(/\.?0+$/, "");
function rI(e) {
  let t = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), V = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return V !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), V0(V) ? V : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(e.store.get(to) || "null");
      return V0(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(to, JSON.stringify({ code: o, at: e.now() }));
    let I = 0;
    const V = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const W = await j.json().catch(() => ({}));
      if (j.status === 404) {
        e.store.set(to, null), t = { ...t, error: (W == null ? void 0 : W.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const be = W;
      t = { ...t, view: be, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(be.status) && e.store.set(to, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void V(), n(I++)));
    });
    V();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const I = t == null ? void 0 : t.view;
    return !(I != null && I.player) || !i() ? null : { player: I.player, from: h(I), plays: Qi(BigInt(I.amount)) };
  }, c = () => {
    const I = t == null ? void 0 : t.view;
    return !I || I.player || !i() ? null : { plays: Qi(BigInt(I.amount)), from: I.from ? e.who(I.from) : null };
  }, p = () => {
    const I = t == null ? void 0 : t.code;
    if (!I) return [];
    const V = `${location.origin}${location.pathname}#gift=${I}`;
    return [sr("gift-pass-on", "Copy the link to pass on", () => V, "primary", e.changed)];
  }, g = () => {
    t = null, e.store.set(to, null), e.changed();
  }, h = (I) => I.from ? e.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let w = {};
  const y = (I) => {
    if (w.box) return w.box;
    const V = Ee("div", "", "ppp-gift-check");
    w.box = V;
    const j = () => {
      const W = window.turnstile;
      !W || w.rendered || (w.rendered = !0, W.render(V, { sitekey: I, callback: (be) => {
        w.token = be, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const W = document.createElement("script");
      W.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", W.async = !0, W.onload = j, document.head.append(W);
    }
    return V;
  }, S = (I) => {
    queueMicrotask(() => void I());
  };
  let x;
  async function C(I) {
    var W, be, ve, Ye, yt, Ke, et, je, $;
    if (!t || t.claiming || !I.listening) return;
    const V = !!((W = t.view) != null && W.player);
    if (V && !I.root) return;
    t.claiming = !0, t.error = void 0, (be = e.claiming) == null || be.call(e, !0), e.changed();
    const j = async (se) => {
      const he = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...se })
      });
      return { res: he, r: await he.json().catch(() => ({})) };
    };
    try {
      let se = 0, he = I.listening, Xe;
      if (V) {
        const ft = Number((ve = await e.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : ve.next);
        if (!Number.isSafeInteger(ft) || ft < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        se = ft;
        for (let un = 0; ; un++) {
          const Kt = await e.album.bind(se);
          if (he = Kt.address, Xe = await j({ wallet: he, binding: Kt }), Xe.res.status === 409 && /just taken/.test(((Ye = Xe.r) == null ? void 0 : Ye.error) || "") && un < 5) {
            se += 1;
            continue;
          }
          break;
        }
      } else Xe = await j({ wallet: he });
      const { res: rt, r: At } = Xe;
      if (rt.status === 503 && /sending another gift/.test((At == null ? void 0 : At.error) || "")) {
        t.waiting = !0, (yt = e.claiming) == null || yt.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!rt.ok) {
        const ft = String((At == null ? void 0 : At.error) || "");
        if (rt.status === 404 || rt.status === 410 || rt.status === 409 && /already had a gift|brand-new|already have this album/.test(ft))
          throw e.store.set(to, null), new Error(ft || "This gift cannot be opened.");
        if (rt.status === 429 || rt.status === 403 || rt.status === 400 && !/wallet number/i.test(ft)) throw new Error(ft || `Could not open the gift (${rt.status}).`);
        const Kt = /topping up/.test(ft) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ft) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ft) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Kt), { retry: !0, slow: /topping up|not paid for yet/.test(ft) });
      }
      t.done = !0, e.store.set(to, null), V ? await e.album.arrived(se, he, At.txid, BigInt(At.amount)) : e.giftSent(At.txid, BigInt(At.amount));
    } catch (se) {
      const he = se, Xe = he.name === "TypeError" || he.name === "AbortError" || he.name === "TimeoutError" || /wallet number/i.test(he.message);
      if (he.retry || Xe) {
        const rt = t.tries ?? 0;
        t.tries = rt + 1, t.retry = { text: he.retry ? he.message : "Still sending your gift… the network is slow, trying again." }, (Ke = e.claiming) == null || Ke.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, he.slow ? 6e4 : n(rt));
      } else
        t.error = he.message, (et = e.claiming) == null || et.call(e, !1);
      w.token = void 0;
      try {
        ($ = (je = window.turnstile) == null ? void 0 : je.reset) == null || $.call(je, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let O = null;
  function U(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return O = null, [];
    if (!O || O.wallet !== I.listening || e.now() - O.at > 3e4) {
      const j = I.listening;
      O = { ...(O == null ? void 0 : O.wallet) === j ? O : {}, wallet: j, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((W) => {
        var be, ve;
        (O == null ? void 0 : O.wallet) === j && (O.state = (be = W == null ? void 0 : W.gift) == null ? void 0 : be.state, O.problem = ((ve = W == null ? void 0 : W.gift) == null ? void 0 : ve.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(O.state === "sending" && O.problem)) return [];
    const V = Ee("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return V.title = `Network reply: ${O.problem}`, [V];
  }
  function E(I, V, j = !1) {
    var Ke, et;
    const W = V.player, be = BigInt(V.amount), ve = j ? [] : [Ee("p", `🎁 ${h(V)} sent you “${W.title}”${W.subtitle ? ` by ${W.subtitle}` : ""}: ${kr(W).length} ${kr(W).length === 1 ? "song" : "songs"} and ${Qi(be).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (j) return ve;
      if (ve.push(Ee("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const je = document.createElement("details");
        je.className = "ppp-how";
        const $ = document.createElement("summary");
        $.textContent = "How does this work?", je.append($, Ee("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ve.push(je);
      }
      return ve;
    }
    if (I.walletCannotAlbums)
      return ve.push(Ee("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ve;
    const yt = (et = (Ke = I.gate) == null ? void 0 : Ke.gifts) == null ? void 0 : et.turnstileSiteKey;
    return yt && !w.token ? ve.push(Ee("p", "One quick check and it is yours:", "ppp-mute"), y(yt)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => C(I)), ve.push(...L(I, "Sending your album…")), ve;
  }
  function L(I, V) {
    const j = [];
    return t.claiming || t.waiting ? j.push(Ee("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : V, "ppp-cyan")) : t.retry && j.push(Ee("p", t.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(x), t.retry = void 0, C(I);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? j.push(Ee("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")) : t.error && j.push(Ee("p", t.error, "ppp-bad"), br("Try again", () => {
      t.error = void 0, C(I);
    })), j;
  }
  const M = (I) => {
    var V;
    return !!t && !t.done && !t.error && i() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((V = t.view) != null && V.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function G(I, V = {}) {
    var $, se;
    const j = U(I);
    if (!t || ["off", "elsewhere"].includes(I.step)) return j;
    const W = t.view;
    if (t.error && !W) return [Ee("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!W) return [Ee("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return j;
    if (W.status === "claimed" || W.status === "claiming") return [Ee("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(W.status)) return [Ee("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (W.status === "pending-deposit") return [Ee("p", `🎁 ${h(W)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (W.player) return [...E(I, W, !!V.bare), ...j];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [Ee("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")];
    const ve = BigInt(W.amount), Ye = Qi(ve).toLocaleString(), yt = Ee(
      "p",
      `🎁 ${h(W)} sent you ${Gn(ve)} STX of on-chain music: about ${Ye} paid plays.`,
      "ppp-gift"
    ), Ke = V.bare ? [] : [yt], et = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, je = (se = ($ = I.gate) == null ? void 0 : $.gifts) == null ? void 0 : se.turnstileSiteKey;
    return et ? (je && !w.token ? Ke.push(Ee("p", "One quick check and it is yours:", "ppp-mute"), y(je)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => C(I)), Ke.push(...L(I, "Sending your gift…"))) : I.step === "intro" ? V.bare || Ke.push(Ee("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Ke.push(Ee("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Ke.push(Ee("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")), Ke;
  }
  async function ee(I, V, j) {
    var W;
    try {
      const be = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((W = be == null ? void 0 : be.gift) != null && W.returnTo) return { ok: !0, funder: be.gift.returnTo, txId: be.gift.txid ?? void 0, amount: be.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return V();
  }
  const Z = Ee("div", "", "ppp-gift-fold");
  let Y = 250000n, b = "", k = "";
  const P = (I) => {
    try {
      const V = JSON.parse(e.store.get(Z0(I)) || "[]");
      return Array.isArray(V) ? V : [];
    } catch {
      return [];
    }
  }, _ = (I, V) => e.store.set(Z0(I), JSON.stringify(V.slice(0, 50)));
  async function K(I) {
    const V = P(I);
    for (const j of V)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await e.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (W) {
          j.error = W.message;
        }
    _(I, V), e.changed();
  }
  async function T(I) {
    if (b) return;
    b = "Starting your gift…", k = "", e.changed();
    let V = null;
    try {
      V = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: Y.toString() }) });
      const j = P(I);
      j.unshift({ id: V.id, code: V.code, amount: Y.toString(), at: e.now() }), _(I, j), b = "Approve the gift in your wallet…", e.changed();
      const W = await e.pay(I, V.depositTo, BigInt(V.deposit), V.memo), be = P(I), ve = be.find((Ye) => Ye.id === V.id);
      ve && (ve.txid = W, ve.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: I, label: "", expires: 0 }), _(I, be), k = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (j) {
      k = j.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const z = (I) => "xtrata.radio.gift.players.v1:" + I, X = (I) => {
    try {
      const V = JSON.parse(e.store.get(z(I)) || "[]");
      return Array.isArray(V) ? V.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function ue(I, V) {
    var j;
    if (!b) {
      b = "Checking the player…", k = "", e.changed();
      try {
        const W = V.tracks.split(/[\s,]+/).filter(Boolean).map((je) => Number(je.replace(/^#/, ""))), be = (V.explicit ?? "").split(/[\s,]+/).map((je) => je.replace(/^#/, "")).filter(Boolean).map(Number), ve = Vb({ title: V.title.trim(), subtitle: V.subtitle.trim(), tracks: W, cover: (j = V.cover) != null && j.trim() ? Number(V.cover.trim().replace(/^#/, "")) : null, ...be.length ? { explicit: be } : {} });
        b = "Sign in your wallet…", e.changed();
        const Ye = { admin: I, hash: Yb(ve), issued: e.now() }, yt = await e.sign(I, J5(Ye));
        b = "Making the player…", e.changed();
        const Ke = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ve, request: Ye, signature: yt }) }), et = X(I).filter((je) => je.id !== Ke.id);
        et.unshift({ id: Ke.id, title: Ke.title, tracks: Ke.tracks }), e.store.set(z(I), JSON.stringify(et.slice(0, 30))), k = `${Ke.existing ? "That player already exists" : "Player made"} ✓ “${Ke.title}” · ${Ke.tracks} songs. Pick it below for a batch.`;
      } catch (W) {
        k = W.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const v = (I, V) => R5(I || location.origin + "/radio.html", V), H = (I) => {
    try {
      const V = JSON.parse(e.store.get(Q0(I)) || "[]");
      return Array.isArray(V) ? V.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, J = (I, V) => e.store.set(Q0(I), JSON.stringify(V.slice(0, 20))), ge = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, me = (I, V) => e.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(V) });
  let Se = 0;
  async function bt(I) {
    const V = H(I);
    for (const j of V)
      if (!ge(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await me("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await e.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (W) {
          j.error = W.message;
        }
    try {
      const j = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const W of (j == null ? void 0 : j.batches) ?? []) {
        const be = V.find((ve) => ve.id === W.id);
        if (be) {
          be.error || (be.view = W);
          continue;
        }
        V.push({ id: W.id, codes: [], count: W.count, amount: W.amount, label: W.label, player: W.player, depositTo: "", deposit: W.deposit, memo: W.memo, at: 0, view: W });
      }
    } catch {
    }
    J(I, V), e.changed();
  }
  async function Ie(I, V) {
    const j = H(I).find((W) => W.id === V);
    if (!(!j || !j.depositTo || b)) {
      b = "Approve the payment in your wallet…", k = "", e.changed();
      try {
        const W = await e.pay(I, j.depositTo, BigInt(j.deposit), j.memo), be = H(I), ve = be.find((Ye) => Ye.id === V);
        ve && (ve.txid = W), J(I, be), k = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", bt(I);
      } catch (W) {
        k = `${/cancel/i.test(W.message) ? "Payment cancelled." : W.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function Le(I, V, j, W) {
    if (b) return;
    if (!V.ok) {
      k = V.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", k = "", e.changed();
    let be = null;
    try {
      const ve = { creator: I, count: V.count, amount: V.amount.toString(), label: j, issued: e.now(), ...W ? { player: W } : {} }, Ye = await e.sign(I, K5(ve));
      b = "Making your links…", e.changed(), be = await me("/radio/gift/batch", { request: ve, signature: Ye });
      const yt = H(I);
      yt.unshift({ id: be.id, codes: be.codes, count: V.count, amount: be.amount, label: j, player: W ?? null, depositTo: be.depositTo, deposit: be.deposit, memo: be.memo, at: e.now() }), J(I, yt);
    } catch (ve) {
      k = ve.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Ie(I, be.id);
  }
  function Ae() {
    const I = !!Je.value, V = Re.value === "max" ? Y5(I) : Number(Re.value), j = V5(V, I), W = Number(Xt.value);
    return !Number.isInteger(W) || W < 1 || W > mu ? { ok: !1, reason: `Make 1 to ${mu} copies at a time.`, album: I, plays: V, amount: j, count: W } : W5(j) ? { ok: !0, reason: "", album: I, plays: V, amount: j, count: W, bill: X5(W, j, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: V, amount: j, count: W };
  }
  const En = () => {
    const I = Ae();
    if (!I.ok) return I.reason;
    const V = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Gn(V.holders)} to song holders, ${Gn(V.fees)} network fees)${I.album ? `, ${Gn(V.float)} for the album’s likes` : ""}, ${Gn(V.reserve)} kept so a listener can return what is left, + ${Gn(V.sendFee)} to send it = ${Gn(V.perCopy)} STX. ${I.count} copies = ${Gn(V.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, vn = (I, V) => V.codes.map((j) => v(I, j)), Ue = Ee("input");
  Ue.type = "range", Ue.min = String(zb), Ue.max = String(Xf), Ue.step = "10000", Ue.value = String(Y), Ue.setAttribute("aria-label", "Gift amount");
  const zt = Ee("p", "", "ppp-gift-amount"), dt = br("", () => {
    const I = e.main();
    I && T(I);
  }, "primary"), kn = () => {
    zt.textContent = tn(), dt.textContent = `Gift ${Gn(Y)} STX`;
  };
  Ue.oninput = () => {
    Y = BigInt(Ue.value), kn();
  };
  const tn = () => `${Gn(Y)} STX · about ${Qi(Y).toLocaleString()} paid plays · you pay ${Gn(Y + tl)} STX with the network fee`;
  kn();
  const Nt = Ee("input");
  Nt.maxLength = 60, Nt.placeholder = "Title, e.g. Proof of Sound", Nt.setAttribute("aria-label", "Player title");
  const qt = Ee("input");
  qt.maxLength = 80, qt.placeholder = "Artist (optional)", qt.setAttribute("aria-label", "Player subtitle");
  const $t = Ee("textarea");
  $t.rows = 3, $t.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", $t.setAttribute("aria-label", "Songs");
  const ln = Ee("input");
  ln.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", ln.setAttribute("aria-label", "Explicit songs");
  const jt = Ee("input");
  jt.inputMode = "numeric", jt.placeholder = "Cover inscription number (optional), shown when the album loads", jt.setAttribute("aria-label", "Cover inscription");
  const Je = Ee("select");
  Je.setAttribute("aria-label", "Batch album");
  const Re = Ee("select");
  Re.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...X0])].sort((V, j) => V - j)) Re.append(fc(`${I.toLocaleString()} plays`, String(I)));
  Re.append(fc("Max (1 STX)", "max")), Re.value = String(X0[0]);
  const Xt = Ee("input");
  Xt.type = "number", Xt.min = "1", Xt.max = String(mu), Xt.value = "10", Xt.setAttribute("aria-label", "Copies");
  const Rt = Ee("input");
  Rt.maxLength = 40, Rt.placeholder = "Label, e.g. Opera launch", Rt.setAttribute("aria-label", "Batch label");
  const pt = Ee("p", "", "ppp-mute"), gt = () => {
    pt.textContent = En();
  };
  for (const I of [Je, Re, Xt])
    I.oninput = gt, I.onchange = gt;
  gt();
  function $n(I) {
    var be, ve;
    const V = (be = I.gate) == null ? void 0 : be.gifts;
    if (!(V != null && V.enabled) || !V.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const j = e.main(), W = [Ee("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      W.push(Ee("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (V.admin) {
      const Ye = Ee("div", "", "ppp-gift-admin"), yt = (se, he) => {
        const Xe = Ee("label", se);
        return Xe.append(he), Xe;
      }, Ke = X(j);
      Ye.append(
        Ee("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Nt,
        qt,
        $t,
        jt,
        ln,
        br("Sign and make player", () => void ue(j, { title: Nt.value, subtitle: qt.value, tracks: $t.value, cover: jt.value, explicit: ln.value }))
      );
      const et = br("Sign, pay and make links", () => {
        Le(j, Ae(), Rt.value.trim(), Je.value || void 0);
      });
      et.disabled = !!b;
      const je = Je.value;
      Je.replaceChildren(fc("No album (starter copies)", ""), ...Ke.map((se) => fc(`${se.title} · ${se.tracks} songs`, se.id))), Ke.some((se) => se.id === je) && (Je.value = je), gt(), Ye.append(
        Ee("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        yt("Album ", Je),
        yt("Plays each ", Re),
        yt("Copies ", Xt),
        Rt,
        pt,
        et
      ), e.now() - Se > 3e4 && (Se = e.now(), bt(j));
      const $ = H(j);
      if ($.length) {
        const se = Ee("ul", "", "ppp-gift-list");
        for (const he of $.slice(0, 10)) {
          const Xe = he.view, rt = Xe == null ? void 0 : Xe.copies, At = he.error ? he.error : !Xe || Xe.status === "pending-deposit" ? he.txid ? "payment confirming…" : "waiting for your payment" : `${rt.claimed} of ${Xe.count} claimed${rt.refunding + rt.refunded ? ` · ${rt.refunded} refunded${rt.refunding ? `, ${rt.refunding} on their way` : ""}` : ""}`, ft = Ee("li");
          if (ft.append(Ee("span", `${he.label || "Batch"} · ${he.count} × ${Gn(BigInt(he.amount))} STX`, "t"), Ee("span", At, "ppp-mute")), !he.txid && he.depositTo && (!Xe || Xe.status === "pending-deposit") && ft.append(br("Pay now", () => void Ie(j, he.id), "tiny")), he.codes.length && (Xe == null ? void 0 : Xe.status) === "live") {
            const un = vn(((ve = I.gate) == null ? void 0 : ve.radioUrl) ?? null, he);
            ft.append(
              sr("batch-copy:" + he.id, "Copy all links", () => un.join(`
`), "tiny", e.changed),
              sr("batch-csv:" + he.id, "Copy as CSV", () => ["copy,link", ...un.map((Kt, Zr) => `${Zr + 1},${Kt}`)].join(`
`), "tiny", e.changed)
            );
          } else he.codes.length || ft.append(Ee("span", "links were made on another device", "ppp-mute"));
          se.append(ft);
        }
        Ye.append(se);
      }
      W.push(Ye);
    }
    return b && W.push(Ee("p", b, "ppp-cyan")), k && W.push(Ee("p", k, /✓/.test(k) ? "ppp-ok" : "ppp-warn")), Z.replaceChildren(...W), Z;
  }
  return { banner: G, funder: ee, renderFold: $n, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: g, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: M };
}
const sI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function oI(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && t.push({
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
  return t;
}
const iI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function aI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = iI(o);
    return n.every((a) => i.includes(a));
  })()), s = {
    recent: (o, i) => (t.recents[i.slot] ?? 0) - (t.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var a, c;
      return (((a = o.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(o.slot)) || s[t.sort](o, i));
}
function cI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Nd = /* @__PURE__ */ new Set(), Wf = (e) => (Nd.add(e), () => {
  Nd.delete(e);
}), nl = () => {
  for (const e of [...Nd])
    try {
      e();
    } catch {
    }
}, J0 = "xtrata:al-thumb:v1:", qb = "-", Ji = 96, lI = 24 * 1024 * 1024, hn = /* @__PURE__ */ new Map(), eg = /* @__PURE__ */ new Set(), _d = [];
let Su = !1, Au;
const rl = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(J0 + e);
    window.localStorage.setItem(J0 + e, t);
  } catch {
  }
  return null;
};
function Zf(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const o = new Image(), i = setTimeout(() => t(e), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(o.naturalWidth, o.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = Ji, s.fillStyle = "#143a40", s.fillRect(0, 0, Ji, Ji), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Ji, Ji), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, o.onerror = () => {
        clearTimeout(i), t(e);
      }, o.src = e;
    } catch {
      t(e);
    }
  });
}
async function uI(e) {
  var c, p, g, h, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((p = t.body) == null ? void 0 : p.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((g = t.body) == null ? void 0 : g.cancel()), "";
  let r = "", s = 0;
  const o = (y) => {
    let S = 0;
    for (; ; ) {
      const x = r.slice(S).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = S + x, O = r.indexOf(">", C);
      if (O < 0)
        return r = r.slice(C), null;
      const U = r.slice(C, O + 1), E = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const L = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (L) return "/inscription/" + L[1];
      S = O + 1;
    }
  }, i = (w = (h = t.body) == null ? void 0 : h.getReader) == null ? void 0 : w.call(h);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: S } = await i.read();
    if (y) break;
    s += S.byteLength, r += a.decode(S, { stream: !0 });
    const x = o(!1);
    if (x)
      return await i.cancel(), x;
    if (s > lI)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function dI() {
  if (!Su) {
    Su = !0;
    try {
      for (; _d.length; ) {
        const e = _d.shift();
        if (!hn.has(e))
          try {
            const t = await uI(e);
            if (t === null) continue;
            if (!t) {
              hn.set(e, ""), rl(e, qb), nl();
              continue;
            }
            const n = await Zf(t);
            hn.set(e, n), n.startsWith("data:image/jpeg") && rl(e, n), nl();
          } catch {
          }
      }
    } finally {
      Su = !1;
    }
  }
}
function Xb(e, t) {
  if (t && !hn.get(e) ? (hn.set(e, t), Zf(t).then((r) => {
    r !== t && (hn.set(e, r), r.startsWith("data:image/jpeg") && rl(e, r), nl());
  })) : t === "" && !hn.has(e) && hn.set(e, ""), hn.has(e)) return hn.get(e);
  const n = rl(e);
  if (n != null) {
    const r = n === qb ? "" : n;
    return hn.set(e, r), r;
  }
  return eg.has(e) || (eg.add(e), _d.push(e), Au || (Au = setTimeout(() => {
    Au = void 0, dI();
  }, 1200))), "";
}
const Eu = /* @__PURE__ */ new Map(), vu = /* @__PURE__ */ new Set();
function Pd(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Eu.has(e) ? Eu.get(e) : (vu.has(e) || (vu.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Eu.set(e, t), nl();
  }).catch(() => {
    vu.delete(e);
  })), "");
}
const oi = 12, fI = 5e3, sn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ii = (e, t, n = "") => {
  const r = sn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function hI(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", p = !1, g = oi;
  const h = sn("div", "", "ppp-shelf-box");
  Wf(() => e.changed());
  const w = (P) => "xtrata.radio.shelf.pins.v1:" + P, y = (P) => "xtrata.radio.shelf.recent.v1:" + P, S = (P, _) => {
    try {
      return JSON.parse(e.store.get(P) || "null") ?? _;
    } catch {
      return _;
    }
  }, x = (P) => new Set(S(w(P), []).filter((_) => Number.isSafeInteger(_))), C = (P) => {
    const _ = S(y(P), {}), K = {};
    for (const [T, z] of Object.entries(_)) Number.isSafeInteger(Number(T)) && typeof z == "number" && (K[Number(T)] = z);
    return K;
  };
  async function O(P) {
    if (!s) {
      s = !0, o = !1;
      try {
        const _ = [];
        let K = 0, T = 0;
        for (let z = 0; z < fI / 100 + 1; z++) {
          const X = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(P)}&after=${K}&limit=100`);
          if (_.push(...oI(X == null ? void 0 : X.shelf)), T = Number(X == null ? void 0 : X.total) || _.length, !(X != null && X.next) || !Number.isSafeInteger(X.next)) break;
          K = X.next;
        }
        P === t && (n = _, r = T, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const U = () => {
    i = -1 / 0;
  }, E = sn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, g = oi, e.changed();
  };
  const L = sn("select");
  L.setAttribute("aria-label", "Sort albums");
  for (const P of sI) {
    const _ = document.createElement("option");
    _.value = P.value, _.textContent = P.label, L.append(_);
  }
  L.onchange = () => {
    c = L.value, g = oi, e.changed();
  };
  const M = ii("", () => {
    p = !p, g = oi, e.changed();
  }, "tiny"), G = sn("div", "", "ppp-shelf-tools");
  G.append(E, L, M);
  const ee = sn("div"), Z = sn("div");
  function Y(P) {
    const _ = P.step === "off" || P.step === "elsewhere" ? void 0 : P.root;
    if (_ !== t && (t = _, n = [], r = 0, i = -1 / 0, g = oi), !_ || P.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && O(_), !n.length)
      return o ? (Z.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ii("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), h.replaceChildren(Z), h) : null;
    const K = x(_), T = C(_), z = aI(n, { query: a, sort: c, pinnedOnly: p, pins: K, recents: T });
    E.value !== a && (E.value = a), L.value = c, M.textContent = p ? "★ Pinned only" : "☆ Pinned only", M.setAttribute("aria-pressed", String(p));
    const X = [];
    if (P.slot > 0 && X.push(ii("← My player", () => e.open(0), "quiet")), !z.length) X.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const ue = sn("ul", "", "ppp-shelf-list");
      for (const v of z.slice(0, g)) {
        const H = sn("li", "", v.slot === P.slot ? "now" : ""), J = K.has(v.slot), ge = ii(J ? "★" : "☆", () => {
          const Ue = new Set(K);
          J ? Ue.delete(v.slot) : Ue.add(v.slot), e.store.set(w(_), JSON.stringify([...Ue])), e.changed();
        }, "tiny");
        ge.setAttribute("aria-label", J ? `Unpin ${v.player.title}` : `Pin ${v.player.title}`);
        const me = [v.player.subtitle, `${kr(v.player).length} ${kr(v.player).length === 1 ? "song" : "songs"}`, v.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Se = v.slot === P.slot, bt = ii(Se ? "Playing" : "Select", () => {
          e.store.set(y(_), JSON.stringify(cI({ ...T, [v.slot]: e.now() }))), e.open(v.slot);
        }, Se ? "tiny ppp-pick" : "tiny primary ppp-pick");
        bt.disabled = Se;
        const Ie = kr(v.player)[0], Le = v.player.cover ?? (Ie == null ? void 0 : Ie.id), Ae = Le ? Xb(String(Le)) : "", En = sn("span", "", "ppp-shelf-art");
        if (Ae) {
          const Ue = document.createElement("img");
          Ue.src = Ae, Ue.alt = "", Ue.decoding = "async", En.append(Ue);
        } else En.textContent = "💿";
        const vn = sn("span", "", "ppp-shelf-txt");
        vn.append(sn("span", v.player.title, "t"), sn("span", me, "ppp-mute")), H.append(ge, En, vn, bt), ue.append(H);
      }
      X.push(ue), z.length > g && X.push(ii(`Show more (${z.length - g} left)`, () => {
        g += oi, e.changed();
      }, "quiet"));
    }
    return o && X.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ee.replaceChildren(...X), h.firstChild !== G && h.replaceChildren(G, ee), h;
  }
  return { render: Y, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const P = C(t), _ = [...n].filter((K) => K.player).sort((K, T) => (P[T.slot] ?? 0) - (P[K.slot] ?? 0) || T.slot - K.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const tg = "http://www.w3.org/2000/svg", pI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function sl(e = "", t = !1) {
  const n = document.createElementNS(tg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of pI) {
    const o = document.createElementNS(tg, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const Ze = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, no = (e, t, n, r = !1) => {
  const s = Ze("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Wb = (e) => e.toLocaleString(), ng = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, gI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function ol(e, t) {
  const n = Ze("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = Ze("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(Ze("i", "", s < t ? "✓" : String(s + 1)), Ze("span", "", r)), n.append(o);
  }), n;
}
function yI() {
  const e = Ze("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(Ze("span", "tier-disc__mark", "?")), e;
}
const wI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], jr = {
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
}, bI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${Wb(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, mI = (e) => e ? `Your player holds ${Wb(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", xI = (e) => e ? `You got a ${e.name} player` : jr.landed.title;
function SI(e, t = !0) {
  const n = Ze("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(Ze("span", "tier-disc__mark", e.mark)), n;
}
function AI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Ze("ul", "al-welcome-points");
    for (const [o, i, a] of wI) {
      const c = Ze("li");
      c.title = i;
      const p = Ze("em", "", a);
      p.setAttribute("aria-hidden", "true"), c.append(p, Ze("b", "", o), Ze("span", "", i)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, o = !1) {
      var h;
      if (!s) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const i = Ze("header", "al-top"), a = Ze("a", "al-brand");
      a.href = "/radio", a.append(sl("al-logo"), Ze("span", "", "Xtrata "), Ze("b", "", "Music")), i.append(a);
      const c = Ze("div", "al-body al-body--welcome"), p = Ze("div", "al-welcome"), g = s.mode;
      if (g === "checking")
        p.append(Ze("p", "al-welcome-wait", jr.checking));
      else {
        const w = gI(g);
        if (w >= 0 && p.append(ol(g === "new" ? ng.fresh : ng.gift, w)), s.tier && (g === "landed" || g === "back" || g === "empty") ? p.append(SI(s.tier)) : g === "gift" || g === "arriving" ? p.append(yI()) : g === "new" && p.append(sl("al-hero-mark")), p.append(Ze("h1", "", g === "landed" ? xI(s.tier) : g === "back" && s.tier ? `Your ${s.tier.name} player` : jr[g].title)), p.append(Ze("p", "", g === "gift" ? bI(s.plays, s.from, s.mystery) : g === "landed" ? mI(s.plays) : jr[g].body)), (g === "landed" || g === "gift") && p.append(r()), s.status.length) {
          const y = Ze("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), p.append(y);
        }
        if (s.asking) p.append(Ze("p", "al-hint al-hint--ask", jr.asking));
        else if (g === "gift" || g === "new" || g === "back") {
          const y = jr[g];
          s.canStart && p.append(no("al-primary", y.primary, g === "back" ? s.unlock : s.start, s.busy), Ze("p", "al-hint", y.hint)), s.canStart && p.append(no("al-link", y.returning, s.returning, s.busy)), p.append(no("al-link", y.full, s.full));
        } else if (g === "landed") {
          if (p.append(no("al-primary", jr.landed.primary, s.full)), (h = s.albums) != null && h.length) {
            p.append(Ze("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = no("al-album", "", y.run);
              if (y.cover) {
                const C = Ze("img", "al-album__art");
                C.src = y.cover, C.alt = "", S.classList.add("al-album--art"), S.append(C);
              }
              const x = Ze("span", "al-album__t");
              x.append(Ze("b", "", y.title), Ze("span", "", y.by)), S.append(x), p.append(S);
            }
          }
        } else g === "empty" && p.append(no("al-primary", jr.empty.primary, s.restock), no("al-link", jr.empty.full, s.full));
      }
      c.append(p), e.hidden = !1, e.replaceChildren(i, c);
    }
  };
}
const EI = 20, vI = ["Album", "Passkey", "Listen"], Qt = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Lt = {
  grid: Qt('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Qt('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Qt('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Qt('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Qt('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Qt('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Qt('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Qt('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Qt('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Qt('<path d="M6 9l6 6 6-6"/>', 18),
  right: Qt('<path d="M9 6l6 6-6 6"/>', 16),
  close: Qt('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Qt('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Qt('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Qt('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Qt('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Qt('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function te(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const rn = (e, ...t) => te("button", { type: "button", ...e }, ...t), hc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ea = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, kI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, $I = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function rg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var P, _, K;
    if (!b || !Number.isSafeInteger(b)) return "";
    const k = (K = (_ = (P = t.radio()) == null ? void 0 : P.getState) == null ? void 0 : _.call(P)) == null ? void 0 : K.albumCover;
    return k != null && k.url && Number(k.tokenId) === b ? k.url : Pd(b);
  }
  Wf(() => Y());
  function p(b) {
    var P;
    o = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const k = document.querySelector(".side");
    if (b && b !== "more") {
      for (const T of $I[b]) {
        const z = k == null ? void 0 : k.querySelector(T);
        z && (z.open = !0);
      }
      const _ = document.getElementById("sheetTitle");
      _ && (_.textContent = kI[b]);
      const K = document.getElementById("sheetExtra");
      K && K.replaceChildren(...b === "music" ? [h()] : []), (P = k == null ? void 0 : k.scrollTo) == null || P.call(k, { top: 0 });
    }
    Y();
  }
  const g = r ? null : document.getElementById("sheetClose");
  g && (g.onclick = () => p("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && o && a.dataset.view === "album" && p("");
  });
  const h = () => rn(
    { class: "al-row", onClick: () => {
      p(""), t.openPlayer();
    } },
    te("span", { class: "al-row-i", html: Lt.radio }),
    te("span", { class: "al-row-t" }, te("b", {}, "Xtrata Radio"), te("small", {}, "Every song on-chain · FM, liked, all")),
    te("span", { class: "al-row-go", html: Lt.right })
  );
  let w = null, y = !1;
  const S = () => {
    var k;
    const b = t.radio();
    y || !(b != null && b.subscribe) || (y = !0, b.subscribe((P) => {
      w = P, (s == null ? void 0 : s.mode) === "open" && Y();
    }), w = ((k = b.getState) == null ? void 0 : k.call(b)) ?? null);
  };
  r || setInterval(() => {
    var _, K;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const b = (K = (_ = t.radio()) == null ? void 0 : _.getPosition) == null ? void 0 : K.call(_), k = e.querySelector(".al-bar > i"), P = e.querySelectorAll(".al-times span");
    !b || !k || (k.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", P.length === 2 && (P[0].textContent = hc(b.current || 0), P[1].textContent = b.duration ? hc(b.duration) : "–:––"));
  }, 500);
  let x = "", C = null;
  function O(b, k, P = {}) {
    const _ = P.song || c(b.cover), T = [_ ? te("img", { src: _, alt: P.song ? "Song artwork" : `${b.title} cover` }) : te("div", { class: "al-cover-fallback" }, te("b", {}, b.title), b.subtitle ? te("span", {}, b.subtitle) : null), P.paused ? te("span", { class: "al-paused" }, te("i", { html: Lt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], z = "al-cover" + (k ? "" : " al-cover--small") + (P.paused ? " is-paused" : "");
    return P.flip ? (T.push(te("span", { class: "al-flip", "aria-hidden": "true", html: Lt.flip })), rn({ class: z + " is-flippable", "aria-label": P.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: P.flip }, ...T)) : te("div", { class: z }, ...T);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? te("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? te("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : te("span", { class: "al-chip" + (b.plays <= EI ? " al-chip--low" : "") }, `${ea(b.plays, "play", "plays")} left`);
  }
  function E(b) {
    const k = b.player, P = k.tracks.filter((K) => !K.hidden), _ = [];
    return b.step !== void 0 && _.push(ol(vI, b.step)), b.mode === "arrive" && b.from && _.push(te("p", { class: "al-from" }, te("span", { html: Lt.gift }), te("span", {}, te("b", {}, b.from), " sent you an album"))), _.push(O(k, !0)), _.push(te(
      "div",
      { class: "al-intro" },
      te("h1", {}, k.title),
      k.subtitle ? te("p", { class: "al-artist" }, k.subtitle) : null,
      P.length ? te("p", { class: "al-songline" }, P.map((K) => K.title || `#${K.id}`).join(" · ")) : null,
      te("span", { class: "al-chip" }, [ea(P.length, "song", "songs"), b.offered ? ea(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && _.push(te("div", { class: "al-status", role: "status" }, ...b.status)), _.push(te("div", { class: "al-grow" })), b.asking ? _.push(te("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && _.push(rn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, te("span", { html: Lt.playSmall }), b.primary.label)), b.hint && !b.asking && _.push(te("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && _.push(rn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), _;
  }
  function L(b, k) {
    const { songs: P, current: _, started: K, own: T, out: z, waiting: X } = k, ue = b.player, v = t.radio(), H = [];
    H.push(te("div", { class: "al-listhead" }, te("span", {}, te("b", {}, ue.title), ` · ${ea(P.length, "song", "songs")}`), U(b)));
    const J = c(ue.cover), ge = "album:" + ue.cover;
    J && !hn.has(ge) && (hn.set(ge, J), Zf(J).then((Se) => {
      Se !== J && (hn.set(ge, Se), Y());
    }));
    const me = J ? hn.get(ge) || J : "";
    return H.push(te("ol", { class: "al-tracks" }, ...P.map((Se, bt) => {
      const Ie = String(Se.id) === _, Le = Xb(String(Se.id), Ie && K ? T : void 0);
      return te("li", {}, rn(
        { class: "al-track" + (Ie ? " is-on" : ""), "aria-label": `Play ${Se.title || "#" + Se.id}`, "aria-current": Ie ? "true" : void 0, disabled: z || X, onClick: () => {
          var Ae;
          return (Ae = v == null ? void 0 : v.playToken) == null ? void 0 : Ae.call(v, Se.id);
        } },
        te(
          "span",
          { class: "al-th" + (Le ? "" : " is-blank") },
          Le ? te("img", { src: Le, alt: "", decoding: "async" }) : me ? te("img", { src: me, alt: "", decoding: "async" }) : null,
          Le ? null : te("span", { class: "al-n" }, String(bt + 1)),
          Ie ? te("span", { class: "al-eq", html: Lt.eq }) : null
        ),
        te("span", { class: "al-tt" }, Se.title || `#${Se.id}`, Se.explicit ? te("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), H;
  }
  function M(b) {
    var Le;
    const k = b.player, P = k.tracks.filter((Ae) => !Ae.hidden), _ = t.radio(), K = w == null ? void 0 : w.nowPlaying, T = K && k.tracks.some((Ae) => String(Ae.id) === String(K.tokenId)) ? String(K.tokenId) : null, z = T ? k.tracks.find((Ae) => String(Ae.id) === T) : null, X = b.plays === 0 && !b.playsComing, ue = !!b.playsComing && !b.plays, v = !!(w != null && w.playing) && !!T, H = w == null ? void 0 : w.heart, J = T ? (Le = _ == null ? void 0 : _.getPosition) == null ? void 0 : Le.call(_) : null;
    T && (v || ((J == null ? void 0 : J.current) ?? 0) > 0.5) && (x = k.id);
    const ge = !!T && x === k.id;
    C && C !== T && (C = null);
    const me = ge ? String((K == null ? void 0 : K.cover) || "") : "", Se = !!me && C === T, Ie = [O(k, !X, { song: Se ? "" : me, paused: ge && !v, flip: me ? () => {
      C = C === T ? null : T, Y();
    } : void 0, flipped: Se })];
    if (Ie.push(te(
      "div",
      { class: "al-now" },
      te(
        "div",
        { class: "al-now-t" },
        te("div", { class: "al-song" }, z ? z.title || (K == null ? void 0 : K.title) || `#${z.id}` : k.title),
        te("div", { class: "al-artist" }, z ? z.artist || (K == null ? void 0 : K.artist) || k.subtitle : k.subtitle || "Press play")
      ),
      T ? rn({ class: "al-icon" + (H != null && H.liked ? " is-on" : ""), "aria-label": H != null && H.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(H != null && H.liked)), disabled: !!(H != null && H.pending) || !!(H != null && H.locked) || ue, onClick: () => {
        var Ae;
        return (Ae = _ == null ? void 0 : _.toggleLike) == null ? void 0 : Ae.call(_);
      }, html: H != null && H.liked ? Lt.heartOn : Lt.heart }) : null
    )), X)
      Ie.push(te(
        "div",
        { class: "al-out" },
        te("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        te("p", { class: "al-out-t" }, "You've played this album out"),
        te("p", { class: "al-out-s" }, "Add plays to keep listening."),
        G(b, !0)
      ));
    else {
      const Ae = J != null && J.duration ? Math.min(100, J.current / J.duration * 100) : 0;
      Ie.push(te(
        "div",
        { class: "al-prog" },
        te("div", { class: "al-bar" }, te("i", { style: `width: ${Ae}%` })),
        te("div", { class: "al-times" }, te("span", {}, hc((J == null ? void 0 : J.current) || 0)), te("span", {}, J != null && J.duration ? hc(J.duration) : "–:––"))
      ));
    }
    return Ie.push(te(
      "div",
      { class: "al-ctl" + (X || ue ? " is-off" : "") },
      rn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: X || ue, onClick: () => {
        var Ae;
        return (Ae = _ == null ? void 0 : _.prev) == null ? void 0 : Ae.call(_);
      }, html: Lt.prev }),
      rn({ class: "al-play", "aria-label": v ? "Pause" : "Play", disabled: X || ue, onClick: () => {
        var Ae;
        return (Ae = _ == null ? void 0 : _.playPause) == null ? void 0 : Ae.call(_);
      }, html: v ? Lt.pause : Lt.play }),
      rn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: X || ue, onClick: () => {
        var Ae;
        return (Ae = _ == null ? void 0 : _.next) == null ? void 0 : Ae.call(_);
      }, html: Lt.next })
    )), b.status.length && Ie.push(te("div", { class: "al-status", role: "status" }, ...b.status)), Ie.push(...L(b, { songs: P, current: T, started: ge, own: me, out: X, waiting: ue })), Ie.push(te("div", { class: "al-grow" })), Ie.push(rn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => p(o === "more" ? "" : "more") },
      te("span", {}, "More ", te("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      te("span", { html: Lt.down })
    )), Ie;
  }
  function G(b, k) {
    const P = te("div", { class: "al-topups" + (k ? " al-topups--primary" : "") }), _ = k ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const K of _) {
      const T = b.myPlays !== void 0 && b.myPlays >= K && !b.playsComing && !b.busy;
      P.append(rn({ class: "al-topup", disabled: !T, onClick: () => t.topUp(K) }, k ? `Add ${K.toLocaleString()} plays` : `+${K.toLocaleString()}`));
    }
    return k && P.append(rn({ class: "al-link", onClick: () => p("more") }, "Other amounts")), P;
  }
  function ee(b) {
    const k = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), P = te(
      "div",
      { class: "al-card" },
      te("div", { class: "al-card-h" }, te("b", {}, `Add plays to ${b.player.title}`), te("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      G(b, !1),
      te("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : k ? `Moved from My player · ${ea(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !k && !b.playsComing && b.myPlays !== void 0 ? rn({ class: "al-link", onClick: () => {
        p(""), t.openPlayer();
      } }, "Open My player") : null
    ), _ = (T, z, X, ue) => rn(
      { class: "al-row", onClick: ue },
      te("span", { class: "al-row-i", html: T }),
      te("span", { class: "al-row-t" }, te("b", {}, z), te("small", {}, X)),
      te("span", { class: "al-row-go", html: Lt.right })
    ), K = te(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      _(Lt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? te("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return te(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      te("div", { class: "al-sheet-h" }, te("b", {}, "More"), rn({ class: "al-icon", "aria-label": "Close", onClick: () => p(""), html: Lt.close })),
      b.mode === "open" ? P : null,
      te(
        "div",
        { class: "al-rows" },
        _(Lt.grid, "My music", "Your albums and the radio", () => p("music")),
        _(Lt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          p(""), t.openPlayer();
        }),
        b.canMake ? _(Lt.gift, "Albums (admin)", "Make an album and fund copies", () => p("gifts")) : null,
        _(Lt.device, "This device", "Backup, history, Stacks wallet, returns", () => p("device")),
        K
      )
    );
  }
  function Z(b) {
    var X, ue;
    const k = b.player, P = w == null ? void 0 : w.nowPlaying, _ = P && k.tracks.some((v) => String(v.id) === String(P.tokenId)) ? String(P.tokenId) : null, K = !!(w != null && w.playing) && !!_, T = _ ? (ue = (X = t.radio()) == null ? void 0 : X.getPosition) == null ? void 0 : ue.call(X) : null;
    _ && (K || ((T == null ? void 0 : T.current) ?? 0) > 0.5) && (x = k.id);
    const z = !!_ && x === k.id;
    return L(b, {
      songs: k.tracks.filter((v) => !v.hidden),
      current: _,
      started: z,
      own: z ? String((P == null ? void 0 : P.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function Y() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      S(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...Z(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    S(), e.hidden = !1;
    const k = te(
      "header",
      { class: "al-top" },
      te("a", { class: "al-brand", href: "/radio" }, sl("al-logo"), "Xtrata ", te("b", {}, "Music")),
      b.mode === "open" ? rn({ class: "al-icon", "aria-label": "My music", onClick: () => p("music"), html: Lt.grid }) : null
    ), P = te("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? M(b) : E(b));
    e.replaceChildren(k, P, ...o === "more" ? [te("div", { class: "al-scrim", onClick: () => p("") }), ee(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, Y();
        return;
      }
      const k = !!s;
      s = b, !b && (k || o) && (o = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, Y();
    },
    sheet: () => o,
    setSheet: p
  };
}
const II = ["Earned", "Claim", "Yours"], LI = ["Connect", "Link", "Name"], it = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Jt = (e, t, n, r = !1) => {
  const s = it("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, sg = (e, t, n, r = !1) => {
  const s = Jt("al-album", "", n, r), o = it("span", "al-album__t");
  return o.append(it("b", "", e), it("span", "", t)), s.append(o), s;
}, CI = (e) => `No. ${String(e).padStart(4, "0")}`, TI = (e) => e.main ? e.linked ? 2 : 1 : 0;
function BI(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = it("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = it("header", "al-top"), p = it("a", "al-brand");
      p.href = "/radio", p.append(sl("al-logo"), it("span", "", "Xtrata "), it("b", "", "Music")), c.append(p);
      const g = it("div", "al-welcome"), h = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (g.append(h === "have" ? ol(LI, TI(i)) : ol(II, h === "making" ? 2 : h === "yours" ? 3 : 1)), h === "making") {
        const U = it("div", "tier-disc tier-disc--mid");
        U.dataset.tier = i.tier.id, U.append(it("span", "tier-disc__mark", i.tier.mark)), g.append(U);
      } else if (h !== "have" && h !== "get") {
        const U = o(i);
        U.classList.toggle("aw-art--small", h === "name"), g.append(U);
      }
      const S = h === "ready" ? `Your ${w} record is ready` : h === "name" ? "Put your name on it?" : h === "have" ? "Use the name in your wallet" : h === "get" ? "Get a .btc name" : h === "making" ? "Making your record" : "It’s yours";
      g.append(it("h1", "", S));
      const x = (U, E = "") => g.append(it("p", E, U)), C = [];
      if (h === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), C.push(Jt("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), it("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), Jt("al-link", "Later", i.later));
      else if (h === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), C.push(Jt("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), Jt("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), C.push(
          sg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          sg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          Jt("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), C.push(Jt("al-primary", "Check again", i.refresh, i.busy), Jt("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), C.push(it("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (h === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), C.push(Jt("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), C.push(Jt("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), C.push(Jt("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), C.push(Jt("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), C.push(Jt("al-primary", "Connect my wallet", i.connect, i.busy))), C.push(Jt("al-link", "Back", () => i.go("name")));
      else if (h === "get") {
        const U = it("ol", "aw-steps"), E = it("li");
        E.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const L = it("a", "", "Open BNS One ↗");
        L.href = "https://bns.one", L.target = "_blank", L.rel = "noopener", E.append(L);
        const M = it("li");
        M.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", it("span", "ppp-addr-full", i.player), i.copyAddress());
        const G = it("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(E, M, G), g.append(U), C.push(Jt("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), Jt("al-link", "Back", () => i.go("name")));
      } else if (h === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const U = it("p", "al-hint"), E = it("a", "", "See the claim on-chain ↗");
          E.href = i.claimLink, E.target = "_blank", E.rel = "noopener", U.append(E), g.append(U);
        }
      } else if (x(`${w} record ${CI(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), C.push(Jt("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const U = it("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${i.inscription}`, U.target = "_blank", U.rel = "noopener", C.push(U);
      }
      if (i.status.length) {
        const U = it("div", "al-status");
        U.setAttribute("role", "status"), U.append(...i.status), g.append(U);
      }
      i.asking ? g.append(it("p", "al-hint al-hint--ask", "Continue in the box below.")) : g.append(...C);
      const O = it("div", "al-body al-body--welcome");
      O.append(g), e.hidden = !1, e.replaceChildren(c, O);
    }
  };
}
const MI = "xtrata.xyz/music/release", NI = "Release music on Xtrata Music; no spending permission", _I = (e) => ({
  domain: Xr({ name: Ct(MI), version: Ct("1"), "chain-id": Zn(1) }),
  message: Xr({ purpose: Ct(NI), artist: Ct(e.artist), release: Ct(e.hash), issued: Zn(e.issued) })
}), $e = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Or = (e, t, n = "") => {
  const r = $e("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, og = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), ig = (e) => {
  const t = kr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
}, ku = (e) => !!e && Kb(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function PI(e) {
  let t = null, n = !1, r = "", s = "";
  const o = (() => {
    try {
      const T = new URLSearchParams(location.search).get("release");
      return Kb(T) ? T : null;
    } catch {
      return null;
    }
  })();
  let i = o ? { id: o } : null;
  const a = (T) => "xtrata.radio.releases.shelf.v1:" + T;
  let c = null, p = !1, g = -1 / 0;
  const h = (T, z, X) => {
    const ue = Array.isArray(z) ? z.filter(ku).map((v) => ({ ...v, hidden: !!v.hidden })) : [];
    c = { for: T, albums: ue, fresh: X }, X && e.store.set(a(T), JSON.stringify(ue));
  }, w = (T) => {
    try {
      h(T, JSON.parse(e.store.get(a(T)) || "[]"), !1);
    } catch {
      h(T, [], !1);
    }
  }, y = () => {
    const T = e.player().address;
    return T && (c == null ? void 0 : c.for) === T ? c.albums : [];
  };
  async function S(T, z = "") {
    const X = e.player();
    if (!X.address || !X.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (p) return !1;
    p = !0, s = "", e.changed();
    try {
      const ue = await e.signShelf(T, z), v = await e.json("/radio/release/shelf", og(ue));
      return h(X.address, v == null ? void 0 : v.albums, !0), !0;
    } catch (ue) {
      return T !== "list" && (s = ue.message || "That did not work. Try again."), !1;
    } finally {
      p = !1, e.changed();
    }
  }
  function x() {
    if (n || (n = !0, e.json("/radio/release/config").then((z) => {
      t = (z == null ? void 0 : z.enabled) === !0;
    }, () => {
      t = !1, n = !1;
    }).finally(e.changed)), !t) return;
    if (i && !i.view && !i.error) {
      const z = i;
      z.error = "", e.json("/radio/release/view?id=" + z.id).then(
        (X) => {
          ku(X) ? (z.view = X, delete z.error) : z.error = "This release could not be read.";
        },
        (X) => {
          z.error = X.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const T = e.player();
    T.address && ((c == null ? void 0 : c.for) !== T.address && w(T.address), T.unlocked && !(c != null && c.fresh) && !p && e.now() - g > 6e4 && (g = e.now(), S("list")));
  }
  const C = () => t ? y().filter((T) => !T.hidden) : [];
  function O() {
    if (!t || !i || i.dismissed) return [];
    if (!i.view) return i.error ? [$e("p", `♫ ${i.error}`, "ppp-warn")] : [$e("p", "♫ Opening this release…", "ppp-mute")];
    const T = i.view, z = $e("div", "", "ppp-release-in"), X = $e("p", "", "ppp-release-in__h");
    X.append($e("b", T.title), $e("span", `${T.subtitle || e.who(T.artist)} · ${ig(T)}`)), z.append(X), z.append($e("p", `Released by ${e.who(T.artist)}. ${T.added === 1 ? "1 player has" : `${T.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const ue = e.player(), v = y().find((J) => J.id === T.id), H = $e("div", "", "ppp-award__row");
    if (v)
      z.append($e("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), H.append(Or("Play it", () => e.open(T), "primary"));
    else if (!ue.address) z.append($e("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!ue.unlocked) z.append($e("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else {
      z.append($e("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const J = Or("Add to my player", () => {
        S("add", T.id).then((ge) => {
          ge && (i != null && i.view) && (i.view = { ...i.view, added: i.view.added + 1 });
        });
      }, "primary");
      J.disabled = p, H.append(J);
    }
    return H.append(Or("Not now", () => {
      i && (i.dismissed = !0), e.changed();
    }, "quiet")), z.append(H), s && z.append($e("p", s, "ppp-warn")), [z];
  }
  let U = !1;
  function E() {
    const T = t ? y() : [];
    if (!T.length) return null;
    const z = $e("details", "", "ppp-release-manage");
    z.open = U, z.ontoggle = () => {
      U = z.open;
    };
    const X = T.filter((v) => v.hidden).length;
    z.append($e("summary", `Albums I added (${T.length}${X ? `, ${X} hidden` : ""})`));
    const ue = e.player().unlocked;
    ue || z.append($e("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const v of T) {
      const H = $e("div", "", "ppp-release-row" + (v.hidden ? " is-hidden" : "")), J = $e("span", "", "ppp-release-row__t");
      J.append($e("b", v.title), $e("span", `${v.subtitle || e.who(v.artist)}${v.hidden ? " · hidden" : ""}`));
      const ge = Or(v.hidden ? "Show" : "Hide", () => void S(v.hidden ? "show" : "hide", v.id), "tiny"), me = Or("Remove", () => void S("remove", v.id), "tiny");
      ge.disabled = me.disabled = !ue || p, H.append(J, ge, me), z.append(H);
    }
    return z.append($e("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !i && z.append($e("p", s, "ppp-warn")), z;
  }
  let L = null, M = [], G = null;
  const ee = $e("input");
  ee.maxLength = 60, ee.placeholder = "Title of the single, EP or album", ee.setAttribute("aria-label", "Release title");
  const Z = $e("input");
  Z.maxLength = 80, Z.placeholder = "Artist name shown under the title", Z.setAttribute("aria-label", "Artist name");
  const Y = $e("input");
  Y.inputMode = "numeric", Y.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", Y.setAttribute("aria-label", "Cover inscription number");
  const b = (T) => `${location.origin}${location.pathname}?release=${T}`;
  function k(T) {
    L = { for: T, loading: !0 }, M = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(T)).then(
      (z) => {
        const X = Array.isArray(z == null ? void 0 : z.songs) ? z.songs.filter((ue) => Number.isSafeInteger(ue == null ? void 0 : ue.id) && typeof ue.title == "string") : null;
        L = X ? { for: T, songs: X, more: !!z.more } : { for: T, error: "Your songs could not be read right now." };
      },
      (z) => {
        L = { for: T, error: z.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function P(T, z = !1) {
    !z && (G == null ? void 0 : G.for) === T && e.now() - G.at < 6e4 || (G = { for: T, list: (G == null ? void 0 : G.for) === T ? G.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(T)).then((X) => {
      Array.isArray(X == null ? void 0 : X.releases) && (G = { for: T, list: X.releases.filter(ku), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function _(T) {
    if (!r) {
      r = "Checking your release…", s = "", e.changed();
      try {
        const z = Y.value.trim().replace(/^#/, ""), X = Vb({ title: ee.value.trim(), subtitle: Z.value.trim(), tracks: [...M], cover: z ? Number(z) : null });
        r = "Sign in your wallet (nothing is spent)…", e.changed();
        const ue = { artist: T, hash: Yb(X), issued: e.now() }, v = await e.sign(T, _I(ue));
        r = "Releasing…", e.changed();
        const H = await e.json("/radio/release/create", og({ definition: X, request: ue, signature: v }));
        s = `${H.existing ? "Already released" : "Released"} ✓ “${H.title}”. Its link is below.`, M = [], ee.value = "", Y.value = "", P(T, !0);
      } catch (z) {
        s = z.message || "Not released.";
      } finally {
        r = "", e.changed();
      }
    }
  }
  function K() {
    var X;
    const T = e.main();
    if (!t || !T) return null;
    const z = [$e("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if ((L == null ? void 0 : L.for) !== T && (L = null, M = []), !L) z.push(Or("Show the songs in my wallet", () => k(T), "primary"));
    else if (L.loading) z.push($e("p", "Reading your wallet…", "ppp-cyan"));
    else if (L.error) z.push($e("p", L.error, "ppp-warn"), Or("Try again", () => k(T)));
    else if (!L.songs.length) z.push($e("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      z.push($e("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const ue = $e("div", "", "ppp-release-songs");
      for (const J of L.songs) {
        const ge = M.indexOf(J.id), me = Or("", () => {
          M = ge >= 0 ? M.filter((Se) => Se !== J.id) : [...M, J.id], e.changed();
        }, "ppp-release-song" + (ge >= 0 ? " is-on" : ""));
        me.setAttribute("aria-pressed", String(ge >= 0)), me.append($e("i", ge >= 0 ? String(ge + 1) : "+"), $e("b", J.title), $e("span", `${J.artist ? J.artist + " · " : ""}#${J.id}`)), ue.append(me);
      }
      z.push(ue), L.more && z.push($e("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !Z.value && M.length && (Z.value = ((X = L.songs.find((J) => J.id === M[0])) == null ? void 0 : X.artist) || "");
      const v = M.length === 0 ? "release" : M.length === 1 ? "single" : M.length <= 6 ? "EP" : "album", H = Or(M.length ? `Sign and release this ${v} · ${M.length} ${M.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void _(T), "primary");
      H.disabled = !M.length || !!r, z.push(ee, Z, Y, H);
    }
    if (r && z.push($e("p", r, "ppp-cyan")), s && !i && z.push($e("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), P(T), (G == null ? void 0 : G.for) === T && G.list.length) {
      z.push($e("p", "Your releases", "ppp-featured__h"));
      for (const ue of G.list) {
        const v = $e("div", "", "ppp-release-row"), H = $e("span", "", "ppp-release-row__t");
        H.append($e("b", ue.title), $e("span", `${ig(ue)} · added by ${ue.added.toLocaleString()} ${ue.added === 1 ? "player" : "players"}`)), v.append(H, sr("release-link:" + ue.id, "Copy link", () => b(ue.id), "tiny", e.changed)), z.push(v);
      }
    }
    return z;
  }
  return { sync: x, albums: C, banner: O, manage: E, fold: K, enabled: () => t === !0 };
}
const UI = [
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
function HI(e) {
  for (const [t, n] of UI) if (n.test(e)) return t;
  return null;
}
const Zb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Qb = (e) => /Android/.test(e);
function OI(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Zb(t) ? "x-safari-" + n.href : Qb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const DI = (e) => Zb(e) ? "Safari" : Qb(e) ? "Chrome" : "your browser", ai = "Xtrata Music Wallet", FI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function ag(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: ai, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const p = e.standIn === c && FI.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${ai} · ${t(c)}`,
      detail: p ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: ai, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: ai, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: ai, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: ai, detail: "Open on this device." });
    }
  return r;
}
const $u = "xtrata.radio.novice", Jb = "xtrata.radio.novice.previewed.v1", cg = 6 * 6e4;
function jI(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set($u, r), n = r;
    else {
      if (r === "0")
        return t.set($u, null), { on: !1, preview: !1 };
      n = t.get($u);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const RI = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, lg = (e) => RI.test(e ?? ""), zI = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, GI = {
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
}, KI = (e, t) => GI[e] ?? t;
function VI(e, t) {
  switch (e) {
    case "fund":
      return t.arriving ? [] : [
        t.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const YI = "Make your player once, with Face ID or your fingerprint, and the music starts.", qI = "Checking your player…", Ud = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function em(e) {
  try {
    const t = JSON.parse(e.get(Jb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function XI(e, t) {
  const n = em(e).filter((r) => r !== t);
  n.push(t), e.set(Jb, JSON.stringify(n.slice(-50)));
}
function Iu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Ud(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Ud();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > cg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > cg ? { ...e, phase: "done" } : e;
  }
}
const pc = (e) => e.phase === "open" || e.phase === "playing";
function WI(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const ZI = [100, 250, 500, 1e3], QI = (e, t = dr) => BigInt(e) * an(t);
function JI(e, t = dr, n = 0n) {
  const r = zr - e - n;
  return r > 0n ? Number(r / an(t)) : 0;
}
function eL(e, t = dr, n = 0n) {
  const r = e === void 0 ? 0 : JI(e, t, n);
  return ZI.map((s) => ({ plays: s, stx: QI(s, t), fits: e !== void 0 && s <= r }));
}
const tL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, nL = (e) => tL[e.unit](e.amount), Et = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, $c = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function rL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${$c(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${$c(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${$c(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function sL(e) {
  let t = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((p) => p.plays === n && p.fits)) return;
    const a = i.filter((p) => p.fits);
    n = ((c = a.find((p) => {
      var g;
      return p.plays === ((g = i[1]) == null ? void 0 : g.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function o() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = eL(i.balance, i.fee, i.incoming);
    s(a);
    const c = WI(i.switches);
    (y = c.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const p = [], g = Et("h2", "ppp-connect__title", "Add plays");
    g.id = "ppp-restock-title", p.push(g), p.push(Et("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${$c(i.playsLeft, "play", "plays")} left.`));
    const h = rL(i.done);
    if (h && p.push(Et("p", "ppp-restock__done", h)), i.arriving)
      p.push(Et("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      p.push(Et("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      p.push(Et("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Et("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const O of a) {
        const U = Et("button", "ppp-restock__pack" + (O.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !O.fits, U.setAttribute("aria-pressed", String(O.plays === n)), U.append(Et("b", "", O.plays.toLocaleString()), Et("span", "", "plays")), U.onclick = () => {
          n = O.plays, o();
        }, S.append(U);
      }
      p.push(S);
      const x = Et("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const O of c) {
        const U = Et("button", "ppp-restock__way" + (O.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !O.on, U.setAttribute("aria-pressed", String(O.id === r)), U.append(Et("b", "", O.label), Et("span", "", O.on ? O.blurb : "Soon")), U.onclick = () => {
          r = O.id, o();
        }, x.append(U);
      }
      p.push(x);
      const C = a.find((O) => O.plays === n);
      if (C && r === "stx") {
        const O = Et("div", "ppp-restock__pay"), U = nL({ unit: "microSTX", amount: C.stx }), E = Et("p", "ppp-restock__amount");
        E.append("Send ", Et("b", "", U), " to your player:"), O.append(E, Et("p", "ppp-addr-full ppp-restock__addr", i.address));
        const L = Et("div", "ppp-restock__row");
        L.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => rr(C.stx), "")), O.append(L), O.append(Et("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), p.push(O);
      }
    }
    p.push(Et("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Et("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), p.push(w), t.replaceChildren(...p);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Et("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      t == null || t.close();
    }
  };
}
const Kr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), oL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function iL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: oL(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function aL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Kr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function cL(e, t, n = "", r = 60) {
  const s = Kr(t).split(/\s+/).filter(Boolean), o = Kr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Kr(a.artist), p = Kr(a.title), g = String(a.id);
    if (o && c !== o) continue;
    let h = 0, w = !0;
    for (const y of s) {
      const S = y.replace(/^#/, "");
      if (p.includes(y)) h += p.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(S) && g === S) h += 0;
      else if (c.includes(y)) h += 2;
      else if (/^\d+$/.test(S) && g.startsWith(S)) h += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: h });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Kn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ug = 12;
function lL(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = Kn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Kn("div", "hint"), p = Kn("div", "find-artists"), g = Kn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const h = Kn("div", "likesTools");
  h.append(a), e.replaceChildren(h, c, p, g), a.oninput = () => {
    s = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((S) => {
      n = S, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const S = t.locked();
    if (a.disabled = S, S) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", p.replaceChildren(), g.replaceChildren();
      return;
    }
    if (r === "idle") {
      c.textContent = "";
      return;
    }
    if (r === "loading") {
      c.textContent = "Loading the catalogue…";
      return;
    }
    if (r === "failed" || !n) {
      c.textContent = "The catalogue is unavailable right now. ";
      const L = Kn("button", "", "Try again");
      L.type = "button", L.onclick = () => {
        r = "idle", w();
      }, c.append(L), p.replaceChildren(), g.replaceChildren();
      return;
    }
    const x = aL(n), C = i ? x : x.slice(0, ug), O = (L, M, G, ee = "") => {
      const Z = Kn("button", "find-chip" + (M ? " is-on" : ""), L);
      return Z.type = "button", Z.setAttribute("aria-pressed", String(M)), ee && (Z.title = ee), Z.onclick = G, Z;
    };
    p.replaceChildren(
      ...C.map((L) => O(`${L.name} · ${L.songs}`, Kr(L.name) === Kr(o), () => {
        o = Kr(L.name) === Kr(o) ? "" : L.name, y();
      }, `Show ${L.name}’s ${L.songs === 1 ? "song" : `${L.songs} songs`}`)),
      ...x.length > ug ? [O(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        i = !i, y();
      })] : []
    );
    const U = cL(n, s, o), E = t.current();
    g.replaceChildren(...U.songs.map((L) => {
      var ee, Z;
      const M = Kn("li", "lrow" + (L.id === E ? " now" : "")), G = Kn("button", "lt", L.title);
      if (G.type = "button", G.title = `Play “${L.title}”${L.artist ? ` by ${L.artist}` : ""}`, G.onclick = () => t.play(L.id), (ee = t.explicit) != null && ee.call(t, L.id)) {
        const Y = Kn("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", G.append(" ", Y);
      }
      if ((Z = t.liked) != null && Z.call(t, L.id)) {
        const Y = Kn("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), M.append(G, Y);
      } else M.append(G);
      return M.append(Kn("span", "find-by", `${L.artist ? L.artist + " · " : ""}#${L.id}`)), M;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const ua = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], gc = (e) => typeof e == "string" && ua.some((t) => t.id === e), yc = (e) => ua.find((t) => t.id === e), uL = (e) => ua.find((t) => e >= t.min) ?? ua[ua.length - 1];
function dL(e, t = dr) {
  return uL(e <= Ot ? 0 : Number((e - Ot) / an(t)));
}
const dg = (e, t, n) => Zd(ef(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), fg = document.getElementById("ppp");
fg && fL(fg);
function fL(e) {
  var mn;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Lm(), s = (u) => e.querySelector(u), o = s(".ppp-frame");
  let i = null;
  const a = async (u, l) => {
    const f = await fetch(u, { cache: "no-store", ...l, signal: AbortSignal.timeout(15e3) }), d = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${f.status}).`);
    return d;
  }, c = s5({
    now: Date.now,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var f;
      const l = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((f = l == null ? void 0 : l.find((d) => d.listening === u)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (u) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), i.referrerPolicy = "no-referrer";
      const l = new Promise((D, B) => {
        i.addEventListener("load", () => D(), { once: !0 }), setTimeout(() => B(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = u + "/", o.replaceChildren(i), await l;
      const f = new mm({ walletOrigin: u, frame: i, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), A = (D, B) => d.has(D) ? f.request(D, B) : Promise.race([
        f.request(D, B),
        new Promise((R, Q) => setTimeout(() => Q(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await A("listening.status"), { request: A };
    },
    chain: {
      verify: H$,
      balance: D$,
      account: O$,
      owner: F$,
      broadcast: j$,
      transaction: R$,
      confirmedNonce: async (u) => {
        const l = await Os(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(l == null ? void 0 : l.nonce) || l.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(l.nonce);
      }
    },
    signWithMain: (u, l) => pu({ ...l, network: "mainnet", stxAddress: u }),
    deposit: (u, l, f) => new Promise((d, A) => I0({
      recipient: l,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new Lu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (D) => d(D.txId || ""),
      onCancel: () => A(new Error("Deposit cancelled. Nothing was sent.")),
      onError: A
    })),
    validate: z$,
    tabLock: (u) => new Promise((l) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        l(!0);
        return;
      }
      f.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (d) => {
        l(!!d), d && await new Promise(() => {
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
      set: (u, l) => {
        try {
          localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    changed: () => qe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var l, f;
      return p.funder(u, () => X$(u, Os), !!((f = (l = c.snapshot().gate) == null ? void 0 : l.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const l = await a("/radio/gift/for?wallet=" + encodeURIComponent(u)), f = l == null ? void 0 : l.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (u) => {
      const l = await a("/radio/awards/status?address=" + encodeURIComponent(u));
      if (typeof (l == null ? void 0 : l.state) != "string") throw new Error("Unreadable award status.");
      return l;
    },
    awardName: async (u) => {
      const l = await a("/radio/awards/name?address=" + encodeURIComponent(u));
      if ((l == null ? void 0 : l.name) !== null && typeof (l == null ? void 0 : l.name) != "string") throw new Error("Unreadable name.");
      return l.name;
    },
    awardNote: async (u, l) => {
      const f = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: u, name: l }) });
      if (typeof (f == null ? void 0 : f.record) != "string" || typeof (f == null ? void 0 : f.signature) != "string" || !Number.isSafeInteger(f == null ? void 0 : f.cls) || !Number.isSafeInteger(f == null ? void 0 : f.number) || !Number.isSafeInteger(f == null ? void 0 : f.plays)) throw new Error("Unreadable award note.");
      return { cls: f.cls, number: f.number, plays: f.plays, record: f.record, signature: f.signature, name: typeof f.name == "string" ? f.name : null };
    },
    history: (u, l) => Q$(u, (f) => Os(f), l),
    likesChanged: () => {
      var u, l;
      (l = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || l.call(u);
    },
    likeState: async (u, l) => {
      const f = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(l) })), d = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((A) => (A == null ? void 0 : A.id) === l) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((A) => typeof A == "string") : d.liked ? [u] : [] };
    },
    likeSent: (u, l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: l } })),
    nameOf: (u) => un(u) ?? void 0,
    likeConfirmed: (u, l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: l } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), p = rI({
    json: a,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, l, f, d) => new Promise((A, D) => I0({
      recipient: l,
      amount: f.toString(),
      memo: d,
      stxAddress: u,
      network: new Lu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (B) => A(B.txId || ""),
      onCancel: () => D(new Error("Gift cancelled. Nothing was sent.")),
      onError: D
    })),
    sign: (u, l) => pu({ ...l, network: "mainnet", stxAddress: u }),
    giftSent: (u, l) => c.giftSent(u, l),
    claiming: (u) => c.giftClaiming(u),
    album: { bind: (u) => c.bindAlbum(u), arrived: async (u, l, f, d) => {
      g.invalidate(), await c.albumArriving(u, l, f, d);
    } },
    who: (u) => Te(u),
    changed: () => qe(c.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: Date.now
  }), g = hI({
    json: a,
    open: (u) => {
      c.openAlbum(u);
    },
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => qe(c.snapshot())
  }), h = {
    get: (u) => {
      try {
        return localStorage.getItem(u);
      } catch {
        return null;
      }
    },
    set: (u, l) => {
      try {
        l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
      } catch {
      }
    }
  }, w = jI(location.search, h);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const y = (u) => w.on && u.solo, S = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), x = S ? document.getElementById("album") : null, C = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (u) => void c.topUpAlbum(u),
    openPlayer: () => void c.openAlbum(0)
  }, O = x ? rg(x, C) : null, U = PI({
    json: a,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    sign: (u, l) => pu({ ...l, network: "mainnet", stxAddress: u }),
    signShelf: (u, l) => c.signShelf(u, l),
    player: () => {
      const u = c.snapshot(), l = u.slot === 0 ? u.listening : u.root;
      return { address: l, unlocked: !!l && ["ready", "fund", "over", "link"].includes(u.step) };
    },
    open: (u) => Je(u, !0),
    who: (u) => Te(u),
    changed: () => qe(c.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), E = () => {
    const u = new Set(tn.map((l) => l.id));
    return [...tn, ...U.albums().filter((l) => !u.has(l.id))];
  }, L = x ? BI(x) : null, M = "xtrata.radio.award.later.v1";
  let G = "ready", ee = !1, Z = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(M) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), Y = !1;
  const b = "xtrata.radio.tier.v1";
  let k = (() => {
    const u = h.get(b);
    return gc(u) ? yc(u) : null;
  })();
  const P = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function _(u) {
    var A;
    if (u.listening && u.slot === 0 && ["fund", "ready", "over"].includes(u.step) && !(u.gift && u.gift.drop === void 0)) {
      let D = null;
      try {
        D = u.gift && !u.gift.player && u.gift.drop === "players" ? dL(BigInt(u.gift.amount)) : null;
      } catch {
        D = null;
      }
      ((A = u.award) == null ? void 0 : A.state) === "claimed" && u.award.holds === !1 && (D = null), ((D == null ? void 0 : D.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = D, h.set(b, D ? D.id : null));
    }
    const l = document.documentElement;
    k ? l.dataset.tier = k.id : delete l.dataset.tier;
    const f = document.querySelector("#ppp .ppp-head h3");
    if (!f) return;
    let d = f.querySelector(".ppp-tier");
    if (!k) {
      d == null || d.remove();
      return;
    }
    d || (d = $("span", "", "ppp-tier"), f.append(d)), d.dataset.tier = k.id, d.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, d.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const K = w.on && x ? AI(x) : null, T = Date.now();
  let z = !1, X = null, ue = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const v = () => {
    ue = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    qe(c.snapshot());
  }, H = (u, l) => {
    var A;
    if (!K || l || ue) return null;
    if (!u.gate || u.step === "loading" || (z = !0), !z) return Date.now() - T < 1e4 ? "checking" : null;
    if (!y(u)) return null;
    if (u.step === "intro" || u.step === "unsupported") return p.incomingStarter() ? "gift" : "new";
    if (u.step === "locked") return "back";
    const d = u.slot === 0 && !((A = u.gift) != null && A.player) && !u.entries.some((D) => D.kind === "play");
    return u.step === "fund" && d ? u.depositPending ? "arriving" : "empty" : u.step === "ready" && d && (X === "arriving" || X === "landed") ? "landed" : u.step === "loading" && X !== "checking" ? X : null;
  };
  let J = !1;
  function ge(u, l, f = [], d) {
    if (!K) return;
    const A = d !== void 0 ? d : H(u, l);
    if (X = A, delete document.documentElement.dataset.noviceBoot, !A) {
      K.render(null, l);
      return;
    }
    const D = [...f];
    A === "arriving" && u.arrival && D.push(Cn(u.arrival)), u.step === "unsupported" ? D.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : u.error && D.push($("p", u.error, "ppp-warn"));
    const B = A === "gift" ? p.incomingStarter() : null;
    B && !J && u.step === "intro" && !u.busy && !u.armed && !u.error && !Kt && (J = !0, c.create({ quick: !0 })), K.render({
      mode: A,
      status: D,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      canStart: (u.step === "intro" || u.step === "locked") && !Kt,
      plays: B ? B.plays : A === "landed" ? u.playsLeft : null,
      from: (B == null ? void 0 : B.from) ?? null,
      tier: k,
      mystery: P,
      albums: A === "landed" ? tn.map((R) => ({ title: R.title, by: R.subtitle, cover: Pd(R.cover), run: () => {
        v(), Je(R, !0);
      } })) : [],
      start: () => void c.create({ quick: !!p.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => bt(),
      full: () => {
        var re, ie, de;
        const R = window.XtrataRadio, Q = A === "landed" && !((ie = (re = R == null ? void 0 : R.getState) == null ? void 0 : re.call(R)) != null && ie.playing);
        v(), Q && ((de = R == null ? void 0 : R.playPause) == null || de.call(R));
      }
    });
  }
  K && setTimeout(() => {
    z || qe(c.snapshot());
  }, 10100), Wf(() => {
    (K != null && K.showing() || document.documentElement.dataset.asking) && qe(c.snapshot());
  });
  const Se = sL({
    input: () => {
      var A, D, B, R;
      const u = c.snapshot();
      if (!["fund", "ready", "over"].includes(u.step)) return null;
      const l = u.slot === 0 ? { address: u.listening, balance: u.balance } : { address: u.root, balance: (A = u.likeFunds) == null ? void 0 : A.balance };
      if (!l.address) return null;
      const f = u.slot === 0 ? u.entries : [], d = f.filter((Q) => Q.kind === "play" && Q.status === "confirmed");
      return {
        playsLeft: l.balance === void 0 ? null : yt(l.balance),
        balance: l.balance,
        incoming: 0n,
        fee: BigInt(((D = u.gate) == null ? void 0 : D.limits.playFee) ?? "300"),
        address: l.address,
        switches: ((B = u.gate) == null ? void 0 : B.restock) ?? {},
        backedUp: u.backedUp,
        done: d.length ? { plays: d.length, artists: new Set(d.map((Q) => Q.recipient)).size, likes: f.filter((Q) => Q.kind === "like" && Q.status === "confirmed" && Q.liked).length } : null,
        arriving: u.slot === 0 ? u.depositPending : !!((R = u.likeFunds) != null && R.pending)
      };
    },
    copyButton: (u, l, f, d) => sr(u, l, f, d, () => {
      qe(c.snapshot());
    })
  }), bt = () => {
    if (!c.snapshot().unproven) {
      Se.open();
      return;
    }
    c.prove().then((u) => {
      u && Se.open();
    });
  }, Ie = document.getElementById("albumList"), Le = Ie ? rg(Ie, C, { list: !0 }) : null, Ae = "xtrata.radio.album.last.v1", En = () => {
    try {
      const u = JSON.parse(localStorage.getItem(Ae) || "null");
      return u && typeof u.root == "string" && Number.isSafeInteger(u.slot) && u.slot > 0 && u.player && Array.isArray(u.player.tracks) ? u : null;
    } catch {
      return null;
    }
  };
  let vn = "";
  const Ue = (u) => {
    const l = JSON.stringify(u);
    if (l !== vn) {
      vn = l;
      try {
        localStorage.setItem(Ae, l);
      } catch {
      }
    }
  };
  let zt = null;
  window.XtrataRadioLikeHandler = (u) => {
    var f;
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    (f = c.snapshot().likeFunds) != null && f.album && (j = !0), Jr();
    const l = dn(u.song, { title: u.title, artist: u.artist });
    return c.heart({ song: u.song, title: l.title || void 0, artist: l.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let dt;
  window.XtrataRadioListeningIdentity = () => {
    const u = c.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const kn = (u) => {
    var f, d;
    const l = window.XtrataRadioListeningIdentity();
    l !== dt && (dt = l, (d = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || d.call(f));
  };
  let tn = [], Nt = 0, qt = !1, $t = null;
  const ln = (u) => {
    var l, f;
    qt || !((f = (l = u.gate) == null ? void 0 : l.gifts) != null && f.enabled) || Date.now() - Nt < 6e4 || (Nt = Date.now(), a("/radio/gift/featured").then((d) => {
      tn = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((A) => A && typeof A.id == "string" && typeof A.title == "string" && Array.isArray(A.tracks) && A.tracks.length > 0).slice(0, 6), qt = !0, tn.length && qe(c.snapshot());
    }).catch(() => {
    }));
  }, jt = (u) => {
    var l;
    return $t && u.slot === 0 && !((l = u.gift) != null && l.player) && ["ready", "fund", "loading"].includes(u.step) ? $t : null;
  }, Je = (u, l = !1) => {
    var d, A;
    $t = u, qe(c.snapshot());
    const f = u && l ? kr(u)[0] : null;
    f && ((A = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || A.call(d, f.id));
  };
  let Re = Ud(), Xt = null;
  const Rt = (u) => {
    const l = w.preview && !Kt && u.step === "intro" ? p.incomingAlbum() : null;
    return l ? (Re = Iu(Re, { kind: "offer", album: l.player.id, already: em(h).includes(l.player.id) }), pc(Re) ? l.player : null) : (Re = Iu(Re, { kind: "withdraw" }), null);
  }, pt = (u) => {
    const l = Re.phase;
    Re = Iu(Re, u), Re.phase !== l && (Re.album && (Re.phase === "playing" || Re.phase === "done") && XI(h, Re.album), qe(c.snapshot()));
  };
  setInterval(() => {
    Re.phase === "playing" && pt({ kind: "tick", at: Date.now() });
  }, 5e3);
  let gt = "", $n, Qn = !1, I = !1;
  const V = (u, l) => {
    var de, pe, fe, m, N, F, le, ct;
    const f = window.XtrataRadio;
    if (!(f != null && f.setGiftPlayer) || !(f != null && f.setGiftStop)) return;
    const d = l.depositPending && u.step === "fund" && ((de = u.giftStop) == null ? void 0 : de.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : u.giftStop, A = Xt, D = d ? y(u) ? KI(d.reason, d.text) : d.text : null, B = A ? null : D ?? (t && (!((pe = u.gate) != null && pe.here) || u.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    B && B !== $n && (f.setGiftStop(B), $n = B);
    const R = u.step === "off" || u.step === "elsewhere" ? null : ((fe = u.gift) == null ? void 0 : fe.player) ?? A ?? jt(u) ?? null, Q = R ? R.id + ":" + R.cover + ":" + R.tracks.map((It) => It.id).join(",") : "";
    Q !== gt && (f.setGiftPlayer(R ? { id: R.id, title: R.title, subtitle: R.subtitle, tracks: kr(R).map((It) => It.id), hidden: ((m = eI(R)) == null ? void 0 : m.id) ?? null, cover: R.cover } : null), gt = Q), B !== $n && (f.setGiftStop(B), $n = B);
    const re = (d == null ? void 0 : d.reason) === "arriving";
    re !== I && ((N = f.setGiftWait) == null || N.call(f, re), I = re);
    const ie = !!R && (!!A || !!((F = u.albumLock) != null && F.locked));
    ie !== Qn && ((le = f.setGiftLock) == null || le.call(f, ie), Qn = ie), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((ct = f.forgetWallets) == null || ct.call(f));
  };
  let j = !1;
  const W = /* @__PURE__ */ new Map(), be = (u) => {
    if (!(u.step === "fund" && !u.depositPending && !!u.gift && !!u.listening && u.balance === 0n && !u.entries.some((d) => d.kind === "play") && (u.brandNew || u.createdHere))) return null;
    let f = W.get(u.listening);
    return f === void 0 && (f = Date.now(), W.set(u.listening, f)), Date.now() - f < Jc ? f : null;
  }, ve = (u) => u.step === "fund" && !u.depositPending && !!u.gift && u.balance === 0n && !u.entries.some((l) => l.kind === "play") && !!u.listening && W.has(u.listening), Ye = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", yt = (u) => {
    const l = c.snapshot().playCost || 350n;
    return u > Ot ? Number((u - Ot) / l) : 0;
  }, Ke = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), et = (u) => {
    const l = Math.round((Date.now() - u) / 6e4);
    return l < 1 ? "now" : l < 60 ? `${l}m` : l < 1440 ? `${Math.round(l / 60)}h` : `${Math.round(l / 1440)}d`;
  }, je = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, $ = (u, l = "", f = "") => {
    const d = document.createElement(u);
    return l && (d.textContent = l), f && (d.className = f), d;
  }, se = (u, l, f = "") => {
    const d = $("button", u, f);
    return d.type = "button", d.onclick = l, d;
  }, he = (u, l) => {
    const f = $("a", u);
    return f.href = l, f.target = "_blank", f.rel = "noopener", f;
  };
  let Xe = null, rt = location.hash === "#give";
  rt && history.replaceState(null, "", location.pathname + location.search);
  let At = !1;
  const ft = j5((u) => F5({ address: u, network: "mainnet" }), () => qe(c.snapshot())), un = (u) => ft.get(u), Kt = HI(navigator.userAgent), Zr = (u, l) => {
    const f = navigator.userAgent, d = DI(f), A = `${location.origin}${location.pathname}${l ? `#gift=${l}` : ""}`, D = [$("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${w.on ? "player" : "listening wallet"}${l ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], B = $("div", "", "ppp-open-row"), R = OI(A, f);
    if (R) {
      const Q = $("a", `Open in ${d}`, "primary ppp-open-in");
      Q.href = R, Q.dataset.homeAction = "radio:open-in-browser", B.append(Q);
    }
    return B.append(sr("copy-page-link", "Copy link", () => A, R ? "" : "primary", () => qe(c.snapshot()))), D.push(B, $("p", `If that does not open ${d}, use ${u}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), D;
  }, Te = (u) => un(u) ?? Ye(u), Rs = (u) => u.slice(0, 2).map(Te).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), zs = /* @__PURE__ */ new Map();
  let Qr = !1;
  const jo = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Jr = () => {
    Qr || (Qr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const l of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const f = Number(l == null ? void 0 : l.id);
        Number.isSafeInteger(f) && zs.set(f, { title: typeof l.title == "string" ? l.title : void 0, artist: typeof l.artist == "string" ? l.artist : void 0 });
      }
      qe(c.snapshot());
    }).catch(() => {
      Qr = !1;
    }));
  }, dn = (u, l) => {
    const f = zs.get(u), d = K0(u, [f == null ? void 0 : f.title, l == null ? void 0 : l.title].find((D) => !jo(D)) || ""), A = z0(u, (f == null ? void 0 : f.artist) || (l == null ? void 0 : l.artist) || "");
    return { title: d, artist: A };
  }, Br = (u) => {
    const { title: l, artist: f } = dn(u.song, u);
    return l ? `“${l}”${f ? ` — ${f}` : ""}` : `Song #${u.song}${f ? ` — ${f}` : ""}`;
  }, Ro = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ji = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Ri(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["TOO MUCH", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function _t(u, l, f = "", d) {
    const A = $("dt", u), D = $("dd", l, f);
    return d && D.append(" ", d), [A, D];
  }
  const Vt = document.getElementById("ppp-top"), Gs = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, He = () => {
    var l;
    const u = window.XtrataRadioConnectStacks;
    u ? u() : (l = document.getElementById("radio-wallet-connect")) == null || l.click();
  }, Pt = () => {
    var l, f;
    const u = c.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      He();
      return;
    }
    if (u.step === "elsewhere" && ((l = u.gate) != null && l.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    if (u.step === "locked" && !u.armed && !u.busy && c.unlock(), u.step === "ready" && ((f = u.giftStop) == null ? void 0 : f.reason) === "off" && !u.busy && c.switchOn(), u.step === "fund" && u.solo && !u.depositPending && !u.busy) {
      bt();
      return;
    }
    Gs();
  };
  Vt && (Vt.onclick = Pt);
  const es = (u, l, f, d = "") => u.standIn && !u.mainConnected ? se(`Connect ${Te(u.standIn)} to add STX`, He, d) : se(l, f, d), Ks = (u) => {
    c.useLinked(u).then(() => Gs());
  };
  let fn = null;
  const Fn = () => {
    const u = ag(c.snapshot(), Te);
    return u.length ? fn || (fn = new Promise((l) => {
      var ie;
      const f = $("dialog", "", "ppp-connect");
      f.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const A = (de) => {
        d = de, f.close();
      };
      f.addEventListener("close", () => {
        f.remove(), fn = null, l(d);
      }), f.addEventListener("click", (de) => {
        de.target === f && A(null);
      });
      const D = (de, pe, fe, m, N = !1) => {
        const F = $("button", "", "ppp-connect__opt " + fe);
        return F.type = "button", F.disabled = N, F.onclick = m, F.append($("b", de), $("span", pe)), F;
      }, B = $("h2", "Connect", "ppp-connect__title");
      B.id = "ppp-connect-title";
      const R = u.map((de) => D(de.label, de.detail, "is-music", () => {
        if (A("music"), de.action === "linked" && de.main) {
          Ks(de.main);
          return;
        }
        const pe = ag(c.snapshot(), Te).find((fe) => fe.action !== "linked");
        (pe == null ? void 0 : pe.action) === "create" ? c.create() : (pe == null ? void 0 : pe.action) === "unlock" && c.unlock(), Gs();
      }, !!de.disabled)), Q = D("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => A("stacks")), re = se("Cancel", () => A(null), "quiet ppp-connect__cancel");
      f.append(B, ...R, Q, re), document.body.appendChild(f), f.showModal(), (ie = R.find((de) => !de.disabled)) == null || ie.focus();
    }), fn) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Fn;
  function In(u) {
    if (!Vt) return;
    const l = (d, A, D) => {
      Vt.hidden = !1, Vt.className = "ppp-top" + (A ? " is-" + A : ""), Vt.replaceChildren($("span", "", "dot"), document.createTextNode(d)), Vt.title = D;
    }, f = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Vt.hidden = !0;
        return;
      case "elsewhere":
        return l("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Vt.hidden = !0;
        return;
      case "intro":
        return l("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return l(`Connect ${Te(u.linked)}`, "warn", `This device's listening wallet belongs to ${Te(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return l("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return l("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? l("Plays on their way", "quiet", "Plays start by themselves when they land") : l(u.entries.some((d) => d.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return l("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return l("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return u.payingOn && f > 0 && !u.giftStop ? l(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : l("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const wt = document.getElementById("pppNudge"), Mr = document.getElementById("onair");
  (mn = wt == null ? void 0 : wt.querySelector("button")) == null || mn.addEventListener("click", () => Pt());
  const Vs = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, zi = {
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
  function zo(u) {
    if (u.step === "loading") return;
    const l = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, f = u.step === "ready" && u.payingOn && l > 0 && !u.giftStop, d = u.step === "fund" && u.depositPending, A = u.step === "elsewhere" && !t, D = f || d || A ? "" : Vs[u.step] ?? "", B = f ? "on" : A ? "free" : D ? "off" : "";
    B ? document.documentElement.dataset.ppp = B : delete document.documentElement.dataset.ppp, Mr && (Mr.hidden = !B || B === "free", Mr.querySelector(".onair-sub").textContent = f ? `${l.toLocaleString()} plays left` : "Plays off"), wt && (wt.hidden = B !== "off" && B !== "free", wt.classList.toggle("is-free", B === "free"), B === "free" ? (wt.querySelector(".nudge-t").textContent = "You’re on the free player", wt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", wt.querySelector("button").textContent = "Get a player") : B === "off" && (wt.querySelector(".nudge-t").textContent = D, wt.querySelector(".nudge-s").textContent = y(u) ? u.step === "intro" ? YI : "" : "This radio requires a funded listening wallet with music support on.", wt.querySelector("button").textContent = zi[u.step] ?? "Start"));
  }
  let fr = "";
  function Ys(u) {
    const l = $("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && l.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && l.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = $("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = fr, f.oninput = () => {
      fr = f.value;
    };
    const d = se(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(f.value), fr = "";
    }, "tiny");
    return l.append(f, " ", d), u.returnToKind === "chosen" && l.append(" ", se("Back to the funder", () => c.clearReturnAddress(), "tiny")), l;
  }
  const qs = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ln() {
    const u = $("p", qs + " ", "ppp-mute");
    return u.append(he("Xverse", "https://www.xverse.app/download"), " · ", he("Leather", "https://leather.io/install-extension")), u;
  }
  let Go = "";
  const Ko = (u) => {
    const l = document.documentElement, f = u.solo && !u.main ? u.listening ? Ye(u.listening) : "new" : "", d = l5() ? "1" : "", A = u.standIn && !u.mainConnected ? Te(u.standIn) : "";
    `${f}|${d}|${A}` !== Go && (Go = `${f}|${d}|${A}`, f ? l.dataset.pppSolo = f : delete l.dataset.pppSolo, A ? l.dataset.pppAs = A : delete l.dataset.pppAs, d ? l.dataset.pppWalletInstalled = d : delete l.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => qe(c.snapshot()), u);
  function Vo(u, l = "") {
    const f = $("div", "", "ppp-topup"), d = ts(u);
    f.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const A of kc) {
      const D = se(`+${A.toLocaleString()}`, () => void c.topUpAlbum(A), l);
      D.disabled = d === void 0 || d < A || u.depositPending || !!u.busy, f.append(D);
    }
    return d !== void 0 && d < kc[0] && f.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const ts = (u) => {
    var d;
    const l = (d = u.likeFunds) == null ? void 0 : d.balance;
    if (l === void 0 || !u.playCost) return;
    const f = l - Ot - 6000n;
    return f > 0n ? Number(f / u.playCost) : 0;
  };
  function Xs(u) {
    const l = u.likeFunds;
    if (!l || !l.album || !l.low && !l.pending) return [];
    if (l.low || (j = !1), l.low && !j) return [];
    const f = $("div", "", "ppp-pick ppp-lowbox");
    if (!l.low) {
      if (!l.txid) return [];
      const A = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return l.txid && A.append(he("View", je(l.txid))), f.append(A), [f];
    }
    f.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), f.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), f.append($("p", l.address, "ppp-addr-full"));
    const d = $("div", "", "ppp-open-row");
    if (d.append(sr("copy-likes-address", "Copy address", () => l.address, "primary", () => qe(c.snapshot()))), l.main && !u.solo) {
      const A = zr - (l.balance ?? 0n);
      A > 0n && d.append(es(u, `Pay ${rr(A)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return f.append(d), f.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const Cn = (u) => {
    const l = $("div", "", "ppp-wait");
    l.dataset.since = String(u.since), l.dataset.grace = String(u.graceMs), l.setAttribute("role", "progressbar"), l.setAttribute("aria-label", "Your plays are arriving");
    const f = $("p", "", "ppp-wait-t"), d = $("div", "", "ppp-wait-track");
    return d.append($("div", "", "ppp-wait-fill")), l.append(f, d), ns(l), l;
  };
  function ns(u) {
    const l = Number(u.dataset.since), f = Number(u.dataset.grace) || 6e4, d = Math.max(0, Date.now() - l), A = u.querySelector(".ppp-wait-fill"), D = u.querySelector(".ppp-wait-t");
    if (d < f) {
      const B = Math.ceil((f - d) / 1e3);
      A.style.width = Math.max(4, Math.min(95, d / f * 100)).toFixed(0) + "%", D.textContent = `Your plays are arriving… usually about a minute · ${B}s`, u.classList.remove("is-long"), u.setAttribute("aria-valuenow", String(Math.round(d / f * 100)));
    } else
      A.style.width = "", D.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", u.classList.add("is-long"), u.removeAttribute("aria-valuenow");
  }
  let Ws = 0;
  setInterval(() => {
    const u = document.querySelectorAll(".ppp-wait");
    if (!u.length) {
      Ws = 0;
      return;
    }
    u.forEach(ns), ++Ws % 10 === 0 && qe(c.snapshot());
  }, 1e3);
  let Nr = null;
  function Yo(u) {
    if (u.step === "loading" && Nr !== null) return;
    const f = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(u.step) || !!u.busy || u.armed || !!p.pendingCode() && !["ready", "fund", "over"].includes(u.step);
    f !== Nr && (Nr = f, f ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function qe(u) {
    var rh, sh, oh, ih, ah, ch, lh, uh, dh, fh, hh, ph, gh, yh, wh, bh, mh;
    if (U.sync(), zt && ["ready", "fund", "over"].includes(u.step) && !u.busy) {
      const q = zt;
      zt = null, u.root === q.root && u.slot !== q.slot && c.openAlbum(q.slot);
    }
    const l = p.inProgress(u), f = be(u), d = l && u.step === "fund" ? { ...u, depositPending: !0 } : f !== null ? { ...u, depositPending: !0, arrival: { since: f, graceMs: Jc } } : u, A = d.error === el;
    if (kn(), ln(u), _(u), Xt = Rt(u), V(u, d), Yo(d), Ko(d), !l && p.inProgress(u)) return;
    if (In(d), zo(d), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? w.on ? qI : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = d.step === "off", e.hidden) {
      ge(d, !1);
      return;
    }
    const [D, B] = Ri(d), R = s(".ppp-state");
    R.textContent = D, R.className = "ppp-state" + (B ? " ppp-state--" + B : ""), R.hidden = !D;
    const Q = !!d.busy || d.armed, re = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (Q || !["intro", "loading"].includes(d.step));
    o.hidden = !re, o.classList.toggle("ppp-frame--rest", !Q && !At);
    const ie = s(".ppp-frame-label");
    ie.hidden = !0;
    const de = o5(d) ?? Xe;
    Xe = de;
    const pe = "xtrata.radio.ppp.heard.v1", fe = (() => {
      try {
        return localStorage.getItem(pe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!fe && d.entries.some((q) => q.kind === "play"))
      try {
        localStorage.setItem(pe, "1");
      } catch {
      }
    const m = fe || d.slot > 0 && ((((rh = d.likeFunds) == null ? void 0 : rh.balance) ?? 0n) > 0n || g.count() > 1), N = y(d), F = !N && a5({ ...d, heard: m }, de);
    s(".ppp-badge").hidden = !F;
    const le = s(".ppp-steps"), ct = s(".ppp-stage");
    le.hidden = ct.hidden = !F, de && F && (le.replaceChildren(...Md(d.solo).map((q, ae) => {
      const ke = $("li", "", ae < de.at ? "done" : ae === de.at ? de.blocked ? "now blocked" : "now" : "");
      return ke.append($("span", ae < de.at ? "✓" : String(ae + 1), "n"), q), ae === de.at && ke.setAttribute("aria-current", "step"), ke;
    })), ct.textContent = de.caption, ct.className = "ppp-stage " + (de.at >= Md(d.solo).length ? "ppp-ok" : de.blocked ? "ppp-bad" : "ppp-cyan"));
    const It = s(".ppp-facts"), Ut = [];
    d.main && ((sh = d.gate) != null && sh.here) && !d.solo && Ut.push(..._t("Your wallet", Te(d.main), "ppp-addr-short"));
    const Wt = () => {
      if (!d.listening) return;
      const q = sr("copy-listening", "Copy", () => d.listening || "", "tiny", () => qe(c.snapshot()));
      Ut.push(..._t(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", Ye(d.listening), "ppp-addr-short", q));
    };
    if (d.linked || Wt(), d.listening && d.step !== "intro")
      if (d.linked)
        Ut.push(..._t("Credited to", `${Te(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), Wt();
      else if (d.solo) {
        d.creditedTo && Ut.push(..._t("Credited to", `${Te(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${Te(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ut.push(..._t("Returns go to", d.gift ? q : d.returnTo && !un(d.returnTo) ? q.replace(Ye(d.returnTo), d.returnTo) : q, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ut.push(..._t("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((oh = d.gate) != null && oh.here)) {
      const q = d.linkedListening.map((ae) => Ye(ae) + (ae === d.listening ? " (this one)" : "")).join(", ");
      Ut.push(..._t(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const q = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ut.push(..._t("Balance", `${rr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, q));
    }
    const os = d.entries.find((q) => q.kind === "play");
    os && Jr(), os && Ut.push(..._t("Last paid song", `${Br(os)} → ${Te(os.recipient)}`, Ro[os.status] || "")), It.replaceChildren(...Ut), It.hidden = !Ut.length;
    const we = [], We = [], st = [], nn = [], Qo = an(BigInt(((ih = d.gate) == null ? void 0 : ih.limits.playFee) ?? "300")), eo = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${rr(Zc)} STX to the song holder, plus a ${rr(Qo - Zc)} STX network fee.`, Qf = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (we.push($("p", "Pay artists as you listen.")), (ah = d.gate) != null && ah.radioUrl) {
          const ae = $("p");
          ae.append(he("Open the pay-per-play radio →", d.gate.radioUrl)), we.push(ae);
        }
        We.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const ae = [d.linked, ...d.others];
          we.push($("p", ae.length > 1 ? `This device has listening wallets for ${Rs(ae)}.` : `This device has a listening wallet for ${Te(d.linked)}.`)), We.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), ae.slice(0, 3).forEach((ke, tt) => st.push(se(`Open ${Te(ke)}`, () => Ks(ke), tt === 0 ? "primary" : "")));
        } else
          we.push($("p", "Connect your wallet to pay artists as you listen.")), We.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        we.push($("p", `This device's listening wallet belongs to ${Te(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), We.push($("p", `You are connected as ${Te(d.main)}. Switch to the linked wallet to continue listening.`)), We.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), st.push(se("Switch wallet", He, "primary"));
        break;
      case "not-invited":
        we.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        we.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        we.push($("p", "Every play counts for the song’s owner, on-chain.")), We.push($("p", eo)), We.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), We.push($("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (we.push($("p", `This device already has a listening wallet for ${Rs(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), We.push($("p", `Otherwise, set up a new listening wallet for ${Te(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && We.push($("p", `This is the listening wallet for ${Te(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && We.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = p.liveGift();
        st.push(se(q ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${Te(d.main)}` : "Start listening", () => void c.create(), "primary")), !q && !d.solo && d.main && d.others.length && st.push(se("Switch wallet", He)), !q && d.solo && st.push(se("I have a Stacks wallet", He)), st.push(se("I already have a listening wallet", () => void c.unlock(!0))), q && st.push(se("Not now", () => p.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (we.push($("p", "Locked.", "ppp-mute")), st.push(se("Unlock", () => void c.unlock(), "primary"))), d.standIn ? nn.push(se("Use a different listening wallet", () => void Fn().then((ae) => {
          ae === "stacks" && He();
        }), "quiet")) : nn.push(se("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        we.push($("p", `Link to ${Te(d.main)} · free`)), We.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), We.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), st.push(se(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        we.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && we.push(Cn(d.arrival)) : ve(d) ? we.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (ch = d.gift) != null && ch.player ? we.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? we.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : we.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Qo)).toLocaleString()} plays`)), d.entries.length && We.push($("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && We.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), l ? We.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? We.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (We.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), We.push($("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && st.push(sr("copy-address", "Copy my address", () => d.listening || "", "primary", () => qe(c.snapshot())))) : We.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const ae = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ae.append(he("View", je(d.depositTxid))), we.push(ae);
        } else d.allowance > 0n && !d.solo && !d.depositPending && st.push(es(d, `Deposit ${rr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        we.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.phrase && (we.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), st.push(se("Back up my player · 24 words", () => void c.backup(), ""))), d.solo && !d.returnTo && (we.push($("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), we.push(Ys(d))), (!d.solo || d.returnTo) && st.push(se("Return excess", () => void c.returnFunds("excess"), "primary"), se("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((lh = d.giftStop) == null ? void 0 : lh.reason) !== "off") {
          const ae = Math.min(d.session.playsLeft, d.playsLeft);
          we.push($("p", `${ae.toLocaleString()} plays left`, "ppp-ok")), We.push($("p", eo + " The heart likes or unlikes from this wallet for 0.0002 STX.")), st.push(se("Switch off", () => void c.switchOff()));
        } else
          we.push($("p", "Switch on music support to listen.", "ppp-mute")), st.push(se("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && we.push($("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && we.push($("p", "Running low on plays", "ppp-warn")), d.aboveTarget && we.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), d.depositPending ? we.push($("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && st.push(es(d, `Top up ${rr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const q = d.step === "fund", ae = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      q ? st.unshift(se("Add plays", () => bt(), "primary")) : ae ? st.push(se("Add plays", () => bt(), "primary")) : d.step === "ready" && nn.push(se("Add plays", () => bt(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && We.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && We.push(Ys(d)), We.push(Ln()), d.slot === 0 && d.step === "ready" && d.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = $("p", "New to Stacks? ", "ppp-mute");
      q.append(he("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), we.push(q);
    }
    if (d.walletOutdated && We.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (we.push($("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), st.push(se("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && nn.push(se(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${Te(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((uh = d.gift) != null && uh.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && nn.push(Vo(d, "quiet")), d.phrase && ["ready", "fund", "over"].includes(d.step) && nn.push(se(d.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && nn.push(se("Lock", () => void c.lock(), "quiet")), re && !Q && nn.push(se(At ? "Hide listening wallet box" : "Show listening wallet box", () => {
      At = !At, qe(c.snapshot());
    }, "quiet")), [...st, ...nn].forEach((q) => q.disabled = Qf), Qf && (st.length = 0), !N && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((dh = d.gift) != null && dh.player)) {
      const q = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", ae = we.at(0);
      d.step === "ready" && ae ? ae.append($("span", ` · ${Ke(d.balance)} STX`, q)) : we.push($("p", `Balance ${Ke(d.balance)} STX`, q));
    }
    if (N) {
      for (const ke of [...st, ...nn]) {
        const tt = zI[ke.textContent ?? ""];
        tt && (ke.textContent = tt);
      }
      for (let ke = we.length - 1; ke >= 0; ke--) lg(we[ke].textContent) && We.unshift(...we.splice(ke, 1));
      for (let ke = st.length - 1; ke >= 0; ke--) lg(st[ke].textContent) && nn.unshift(...st.splice(ke, 1));
      const q = d.entries.some((ke) => ke.kind === "play"), ae = VI(d.step, { played: q, arriving: d.depositPending });
      ae.length && we.length && ae.shift(), we.push(...ae.map((ke) => $("p", ke, "ppp-mute")));
    }
    if ((fh = d.gift) != null && fh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const q = $("p", "", "ppp-gift");
      q.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && q.append(" · ", d.gift.player.subtitle);
      const ae = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ae && q.append(ae);
      const ke = (hh = we.at(0)) == null ? void 0 : hh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && ke && /STX/.test(ke.textContent ?? "") && ke.remove(), we.unshift(q), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          we.splice(1, 0, $("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Vo(d, "primary"));
        else {
          const tt = $("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          tt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), tt.append(he("Xverse", "https://www.xverse.app/download"), " and ", he("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), we.splice(1, 0, tt);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const q = d.returnPlan, ae = $("div", "", "ppp-pick");
      ae.append($("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ke = $("ul", "", "ppp-gift-list");
      q.steps.forEach((tt, Jn) => {
        const Bn = tt.kind === "gift" ? "the unused gift" : tt.kind === "deposit" ? "what was added to it" : "the rest", Zt = $("li");
        Zt.append($("span", `${Jn + 1}. ${rr(BigInt(tt.send))} STX · ${Bn}`, "t"), $("span", tt.to ? ` → ${Te(tt.to)}` : " → choose an address below", tt.to ? "ppp-mute" : "ppp-warn")), ke.append(Zt);
      }), ae.append(ke), q.kept && ae.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((tt) => !tt.to) && ae.append(Ys(d)), ae.append(se(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), we.push(ae);
    }
    const is = qo(d), as = S ? is : null, Jo = H(d, !!as), nm = Jo === "gift" || Jo === "arriving" || Jo === "new", Pl = p.banner(u, { bare: !!as || Jo === "gift" || Jo === "arriving" }), Ba = Kt && (p.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? Zr(Kt, p.pendingCode()) : [];
    as || (we.unshift(...Pl), we.push(...Xs(d)), we.unshift(...Ba)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && we.unshift($("p", `This is ${Te(d.creditedTo)}'s listening wallet. Plays and likes count for ${Te(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...we);
    const Ul = document.querySelector(".ppp-switch");
    if (Ul) {
      const q = g.latest(), ae = d.slot > 0, ke = ["fund", "ready", "over"].includes(d.step) && (ae || !!q);
      if (Ul.hidden = !ke, ke) {
        const tt = (Zt, _a, Pa, zl) => {
          const ei = se("", zl, "ppp-tab");
          return ei.setAttribute("aria-pressed", String(Pa)), ei.append($("span", Zt, "tt"), $("span", _a === void 0 ? "…" : `${yt(_a).toLocaleString()} plays`, "ts")), ei.disabled = !!d.busy, ei;
        }, Jn = ae ? ((gh = (ph = d.gift) == null ? void 0 : ph.player) == null ? void 0 : gh.title) ?? "Album" : q.title, Bn = se("View all albums" + (g.count() > 1 ? ` (${g.count()})` : ""), () => {
          const Zt = document.querySelector(".ppp-shelf");
          Zt && (Zt.hidden = !1, Zt.open = !Zt.open, Bn.setAttribute("aria-expanded", String(Zt.open)), Zt.open && requestAnimationFrame(() => Zt.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Bn.setAttribute("aria-expanded", String(!!((yh = document.querySelector(".ppp-shelf")) != null && yh.open))), Ul.replaceChildren(
          tt("🎧 My player", ae ? (wh = d.likeFunds) == null ? void 0 : wh.balance : d.balance, !ae, () => {
            ae && c.openAlbum(0);
          }),
          tt("💿 " + Jn, ae ? d.balance : void 0, ae, () => {
            !ae && q && c.openAlbum(q.slot);
          }),
          Bn
        );
      }
    }
    const Ma = g.render(d), Na = document.querySelector(".ppp-shelf");
    if (Na) {
      Na.hidden = !Ma;
      const q = Na.querySelector("summary");
      q && (q.textContent = g.count() > 0 ? `♪ My albums (${g.count()})` : "♪ My albums");
      const ae = Na.querySelector(".ppp-shelf-body");
      Ma && ae && !ae.contains(Ma) && ae.replaceChildren(Ma);
    }
    const Ki = p.renderFold(u);
    if (s(".ppp-gifts").hidden = !Ki, Ki && !s(".ppp-gift-body").contains(Ki) && s(".ppp-gift-body").replaceChildren(Ki), Ki && rt) {
      rt = !1;
      const q = s(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Hl = document.querySelector("#ppp .ppp-featured");
    if (Hl) {
      const q = E(), ae = U.manage(), ke = (q.length > 0 || !!ae) && d.slot === 0 && !((bh = d.gift) != null && bh.player) && d.step === "ready";
      Hl.hidden = !ke, ke && Hl.replaceChildren(...q.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...q.map((tt) => {
        const Jn = ($t == null ? void 0 : $t.id) === tt.id, Bn = se("", () => Je(Jn ? null : tt, !Jn), "ppp-featured__a" + (Jn ? " is-on" : "")), Zt = kr(tt).length;
        return Bn.append($("b", tt.title), $("span", Jn ? "Playing now · tap to go back to the radio" : `${tt.subtitle ? tt.subtitle + " · " : ""}${Zt} ${Zt === 1 ? "song" : "songs"}`)), Bn.setAttribute("aria-pressed", String(Jn)), Bn.disabled = !!d.busy, Bn;
      }), ...ae ? [ae] : []);
    }
    const Ol = document.querySelector("#ppp .ppp-release-in-slot");
    if (Ol) {
      const q = ["off", "elsewhere", "unsupported"].includes(d.step) ? [] : U.banner();
      Ol.hidden = !q.length, Ol.replaceChildren(...q);
    }
    const Dl = document.querySelector("#ppp .ppp-release");
    if (Dl) {
      const q = ["off", "elsewhere", "unsupported"].includes(d.step) ? null : U.fold();
      Dl.hidden = !q, q && ((mh = Dl.querySelector(".ppp-release-body")) == null || mh.replaceChildren(...q));
    }
    Qs(d);
    const Fl = document.querySelector("#ppp .ppp-yours");
    if (Fl) {
      const q = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      Fl.hidden = !q;
      const ae = Fl.querySelector(".ppp-yours-body");
      if (q && ae && ae.getAttribute("data-for") !== d.listening) {
        ae.setAttribute("data-for", d.listening);
        const ke = (zl, ...ei) => {
          const xh = $("details", "", "ppp-yours-item");
          return xh.append($("summary", zl), ...ei), xh;
        }, tt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        tt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Jn = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Bn = $("p");
        Bn.append(he("Find a name at BNS One →", "https://bns.one"));
        const Zt = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), _a = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Pa = $("p");
        Pa.append(he("See the giveaway →", "https://xtrata.xyz/giveaway")), ae.replaceChildren(
          ke("Give your player a name", tt, Jn, $("p", d.listening, "ppp-addr-full"), sr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => qe(c.snapshot())), Bn),
          ke("Link it to a wallet you already have", Zt),
          ke("Bring a friend in", _a, Pa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...We), s(".ppp-actions").replaceChildren(...st), s(".ppp-actions2").replaceChildren(...nn);
    const jl = d.busy || d.message || "", Jf = s(".ppp-msg"), Rl = jl && we.some((q) => (q.textContent ?? "").startsWith(jl.replace(/[.✓\s]+$/, ""))) ? "" : jl, eh = !Rl && !d.error ? d.notice : A && !Rl ? d.error : "";
    Jf.textContent = Rl || eh, Jf.classList.toggle("is-warn", !!eh), s(".ppp-err").textContent = A ? "" : d.error;
    const rm = d.entries.filter((q) => q.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...rm.slice(0, 5).map((q) => {
      const ae = $("li"), ke = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return ae.append($("span", "", "d " + ke), $("span", Br(q), "t"), $("span", et(q.created), "ppp-mute")), q.txid && ae.append(he("tx", je(q.txid))), ae;
    })), s(".ppp-wallets").hidden = !(It.childElementCount || nn.length), s(".ppp-more").hidden = !We.length;
    const th = s(".ppp-history");
    th.hidden = !d.entries.length, d.entries.length && Jr(), th.replaceChildren($("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((q) => {
      const ae = $("div", "", "ppp-row"), ke = q.kind === "play" ? [$("span", Br(q), "ppp-song"), $("span", ` · ${rr(BigInt(q.amount))} STX to ${Te(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [$("span", `${q.liked ? "♥ Liked" : "Unliked"} ${Br(q)}`, "ppp-song"), $("span", ` · for ${d.linked ? Te(d.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${rr(BigInt(q.amount))} STX`, "ppp-song"), $("span", ` to ${Te(q.recipient)}`, "ppp-mute")];
      return ae.append(
        $("span", ji[q.status] || q.status, "ppp-status " + (Ro[q.status] || "")),
        ...ke,
        $("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && ae.append(he("tx ↗", je(q.txid))), ae;
    })), O == null || O.render(as ? ot(d, as, [...Ba, ...Pl]) : null), ge(d, !!as, nm ? [...Ba, ...Pl] : Ba, Jo), Gi(d, !!as || !!(K != null && K.showing())), _r(d, as), Se.isOpen() && Se.refresh(), Wo();
    const nh = (is == null ? void 0 : is.mode) === "open" ? null : jt(d);
    Le == null || Le.render((is == null ? void 0 : is.mode) === "open" ? ot(d, is, []) : nh ? { ...ot(d, { mode: "open", player: nh }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function qo(u) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(u.step)) return null;
    if (u.slot > 0 && ((d = u.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(u.step))
      return u.root && Ue({ root: u.root, slot: u.slot, player: u.gift.player }), { mode: "open", player: u.gift.player };
    const l = p.incomingAlbum();
    if (l) return { mode: "arrive", player: l.player, from: l.from, offered: l.plays };
    const f = En();
    return f && (u.step === "locked" || zt && u.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  const Zs = (u, l, f, d, A) => `/awards/${u.id}#${new URLSearchParams({ n: String(l), a: f, ...A ? { b: A } : {}, p: String(d), s: dg(_0, l, f) })}`;
  function Xo(u) {
    const l = u.award;
    return !l || !["ready", "fund", "over", "link"].includes(u.step) ? null : l.claimTx ? ee ? "making" : null : l.state === "claimed" ? ee && l.inscription !== void 0 ? "yours" : null : l.state !== "ready" || Z || u.step === "link" && G !== "have" ? null : G === "making" || G === "yours" ? "ready" : G;
  }
  function Gi(u, l) {
    if (!L) return;
    const f = u.award, d = f != null && f.cls && gc(f.cls) ? yc(f.cls) : null, A = u.slot === 0 ? u.listening : u.root, D = l || !f || !d || !A || f.number === void 0 ? null : Xo(u);
    if (!D || !f || !d || !A) {
      L.render(null, l);
      return;
    }
    D === "have" && u.linked && !Y && (Y = !0, c.awardRefresh());
    const B = typeof f.name == "string" && f.name ? f.name : null, R = [];
    u.error && R.push($("p", u.error, "ppp-warn"));
    const Q = (re) => {
      G = re, re === "name" && (ee = !0), qe(c.snapshot());
    };
    L.render({
      screen: D,
      tier: d,
      number: f.number,
      need: f.need ?? 0,
      player: A,
      name: f.name,
      inscription: f.inscription,
      art: D === "yours" && f.inscription !== void 0 ? `/i/${f.inscription}` : Zs(d, f.number, A, f.need ?? 0, B),
      claimLink: f.claimTx ? je(f.claimTx) : void 0,
      status: R,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      main: u.main ? Te(u.main) : null,
      canLink: u.step === "link",
      linked: !!u.linked,
      copyAddress: () => sr("award-player-address", "Copy my player’s address", () => A, "tiny", () => qe(c.snapshot())),
      go: Q,
      claim: (re) => {
        ee = !0, c.claimAward(re);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var re;
        return (re = document.getElementById("radio-wallet-connect")) == null ? void 0 : re.click();
      },
      link: () => void c.link(),
      later: () => {
        Z = !0;
        try {
          localStorage.setItem(M, String(Date.now()));
        } catch {
        }
        qe(c.snapshot());
      },
      done: () => {
        ee = !1, G = "ready", qe(c.snapshot());
      }
    }, l);
  }
  function Qs(u) {
    var de;
    const l = document.querySelector("#ppp .ppp-award");
    if (!l) return;
    const f = u.award, d = u.slot === 0 ? u.listening : u.root, A = f != null && f.cls && gc(f.cls) ? yc(f.cls) : null, D = !!f && !!A && !!d && ["ready", "fund", "over"].includes(u.step) && !(f.state === "unavailable" && f.number === void 0);
    if (l.hidden = !D, !D || !f || !A || !d) {
      l.replaceChildren();
      return;
    }
    const B = JSON.stringify([f, d, !!u.busy]);
    if (l.getAttribute("data-sig") === B) return;
    l.setAttribute("data-sig", B);
    const R = (pe) => {
      const fe = $("p", "", "ppp-award__h");
      return fe.append($("b", `${A.mark} Music Hero award`), $("span", pe)), fe;
    }, Q = `No. ${String(f.number ?? 0).padStart(4, "0")}`, re = (pe) => {
      const fe = $("div", "", "ppp-award__art"), m = document.createElement("iframe");
      return m.src = pe, m.title = `${A.name} record`, m.setAttribute("sandbox", "allow-scripts"), m.setAttribute("loading", "lazy"), fe.append(m), fe;
    }, ie = [];
    if (f.state === "claimed") {
      if (ie.push(R(`${A.name} record · ${Q}`)), f.inscription !== void 0 && ie.push(re(`/i/${f.inscription}`)), ie.push($("p", f.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : f.holds === null || f.holds === void 0 ? `Yours: Xtrata inscription #${f.inscription}.` : `Yours for good: Xtrata inscription #${f.inscription}. It gives your player its ${A.name} colours.`, f.holds === !1 ? "ppp-mute" : "ppp-ok")), f.inscription !== void 0) {
        const pe = $("p");
        pe.append(he("Open it full screen ↗", `/i/${f.inscription}`)), ie.push(pe);
      }
      if (f.sendTx) {
        const pe = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        pe.append(he("View", je(f.sendTx))), ie.push(pe);
      } else if (f.holds === !0 && f.inscription !== void 0) {
        const pe = $("details", "", "ppp-award__send"), fe = document.createElement("input");
        fe.type = "text", fe.placeholder = "SP… address to send it to", fe.autocomplete = "off", fe.spellcheck = !1, fe.setAttribute("aria-label", "Address to send your record to");
        const m = se("Send my record…", () => void c.sendAward(fe.value), "");
        m.disabled = !!u.busy, pe.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          fe,
          m
        ), ie.push(pe);
      }
    } else if (f.claimTx) {
      ie.push(R(`${A.name} record · ${Q}`));
      const pe = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      pe.append(he("View", je(f.claimTx))), ie.push(pe);
    } else if (f.state === "ready") {
      ie.push(R(`${A.name} record · ${Q}`));
      const pe = typeof f.name == "string" && f.name ? f.name : null, fe = new URLSearchParams({ n: String(f.number), a: d, ...pe ? { b: pe } : {}, p: String(f.need), s: dg(_0, f.number, d) });
      ie.push(re(`/awards/${A.id}#${fe}`)), ie.push($("p", `Your ${A.name} record is ready. You have paid artists for ${(de = f.need) == null ? void 0 : de.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const m = $("div", "", "ppp-award__row");
      pe ? (ie.push($("p", `Its plaque will carry ${pe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), m.append(se("Claim my record", () => {
        ee = !0, c.claimAward("auto");
      }, "primary"), se("Use my address only", () => {
        ee = !0, c.claimAward("none");
      }, "quiet"))) : f.name === null ? (ie.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), m.append(se("Claim my record", () => {
        ee = !0, c.claimAward("none");
      }, "primary"), se("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ie.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), m.append(se("Check for a name again", () => void c.awardRefresh(), "primary"), se("Claim with my address only", () => void c.claimAward("none"), "quiet"))), m.querySelectorAll("button").forEach((N) => {
        N.disabled = !!u.busy;
      }), ie.push(m, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (f.state === "earning" && f.have !== void 0 && f.need) {
      ie.push(R(`${f.have.toLocaleString()} of ${f.need.toLocaleString()} paid plays`));
      const pe = $("div", "", "ppp-award__bar"), fe = document.createElement("i");
      fe.style.width = `${Math.min(100, Math.round(f.have / f.need * 100))}%`, pe.append(fe);
      const m = f.need - f.have;
      ie.push(pe, $("p", `${m.toLocaleString()} more ${m === 1 ? "play" : "plays"} and your ${A.name} record is yours to claim.`, "ppp-mute"));
    } else
      ie.push(R(`${A.name} record · ${Q}`)), ie.push($("p", f.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : f.state === "class-full" || f.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    l.replaceChildren(...ie);
  }
  function _r(u, l) {
    var R;
    const f = document.querySelector(".ppp-skin");
    if (!f) return;
    if (!l && (L != null && L.showing()) && ((R = u.award) != null && R.cls) && gc(u.award.cls) && (u.busy || u.armed)) {
      const Q = yc(u.award.cls), re = $("span", "", "ppp-skin__t");
      re.append($("b", `${Q.name} record · No. ${String(u.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), f.hidden = !1, f.replaceChildren($("span", Q.mark, "ppp-skin__art ppp-skin__art--none"), re);
      return;
    }
    const d = !!l && (!!u.busy || u.armed);
    if (f.hidden = !d, !d || !l) {
      f.replaceChildren();
      return;
    }
    const A = Pd(l.player.cover), D = A ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    A && (D.src = A, D.alt = "");
    const B = $("span", "", "ppp-skin__t");
    B.append($("b", l.player.title), $("span", l.mode === "arrive" && l.from ? `A gift from ${l.from}` : l.player.subtitle || "Your album")), f.replaceChildren(D, B);
  }
  function ot(u, l, f) {
    var Q, re, ie, de, pe;
    const d = !!u.busy || u.armed, A = [...f];
    u.depositPending && u.arrival && A.push(Cn(u.arrival)), u.error ? A.push($("p", u.error, u.error === el ? "ppp-warn" : "ppp-bad")) : u.message && !d ? A.push($("p", u.message, "ppp-cyan")) : u.notice && A.push($("p", u.notice, "ppp-warn")), l.mode === "open" && j && ((Q = u.likeFunds) != null && Q.album) && u.likeFunds.low && !u.likeFunds.pending && A.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let D = "Kept on this device with Face ID or your passkey. No app or account needed.", B = null, R = null;
    if (l.mode === "locked")
      B = { label: "Continue listening", run: () => {
        zt = En(), c.unlock();
      } }, R = { label: "Use a different passkey", run: () => {
        zt = null, c.unlock(!0);
      } };
    else if (l.mode === "arrive")
      if (u.step === "intro" && pc(Re) && Re.album === l.player.id) {
        const fe = window.XtrataRadio, m = kr(l.player)[0], N = Re.phase === "playing";
        B = { label: N && !!((ie = (re = fe == null ? void 0 : fe.getState) == null ? void 0 : re.call(fe)) != null && ie.playing) ? "Pause" : N ? "Carry on" : "Play the first song", run: () => {
          var le, ct;
          N ? (le = fe == null ? void 0 : fe.playPause) == null || le.call(fe) : m && ((ct = fe == null ? void 0 : fe.playToken) == null || ct.call(fe, m.id));
        } }, R = { label: "Make my player and hear it all", run: () => void c.create() }, D = "The first song is free. Nothing to set up yet.";
      } else if (u.step === "intro") {
        const fe = Re.phase === "done" && Re.album === l.player.id;
        fe && !A.length && A.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), B = { label: fe ? "Keep listening" : "Open album", run: () => void c.create() }, R = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else u.step === "locked" ? (B = { label: "Open album", run: () => void c.unlock() }, R = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : u.step === "unsupported" ? A.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : A.length || A.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: l.mode,
      player: l.player,
      from: l.from,
      offered: l.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: l.mode === "arrive" && u.step === "intro" ? 1 : void 0,
      plays: l.mode === "open" ? u.balance === void 0 ? null : u.giftPlays : void 0,
      playsComing: u.depositPending,
      status: A,
      primary: B,
      secondary: R,
      hint: B ? D : void 0,
      asking: d,
      busy: !!u.busy,
      myPlays: ts(u),
      topUps: kc,
      canMake: !!((pe = (de = u.gate) == null ? void 0 : de.gifts) != null && pe.admin)
    };
  }
  const Tn = document.getElementById("findBox"), jn = document.getElementById("findBody"), Rn = Tn && jn ? lL(jn, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : Promise.reject(new Error("catalogue unavailable"))).then((u) => iL(u == null ? void 0 : u.tracks, (l, f) => ({ title: K0(l, jo(f.title) ? "" : f.title), artist: z0(l, f.artist || "") }))),
    play: (u) => {
      var l, f;
      (f = (l = window.XtrataRadio) == null ? void 0 : l.playToken) == null || f.call(l, u);
    },
    current: () => {
      var l, f, d, A;
      const u = Number((A = (d = (f = (l = window.XtrataRadio) == null ? void 0 : l.getState) == null ? void 0 : f.call(l)) == null ? void 0 : d.nowPlaying) == null ? void 0 : A.tokenId);
      return Number.isSafeInteger(u) ? u : null;
    },
    locked: () => {
      var u;
      return !!((u = c.snapshot().albumLock) != null && u.locked);
    },
    explicit: (u) => {
      var l, f;
      return !!((f = (l = window.XtrataRadio) == null ? void 0 : l.isExplicit) != null && f.call(l, u));
    },
    liked: (u) => Pr().has(u)
  }) : null;
  Tn == null || Tn.addEventListener("toggle", () => {
    Tn.open && (Rn == null || Rn.load());
  });
  let rs = "";
  const Pr = () => {
    var l, f, d;
    const u = (d = (f = (l = window.XtrataRadio) == null ? void 0 : l.getState) == null ? void 0 : f.call(l)) == null ? void 0 : d.likes;
    return new Set(Array.isArray(u) ? u.map((A) => Number(A == null ? void 0 : A.tokenId)).filter(Number.isSafeInteger) : []);
  }, Wo = () => {
    var l, f, d, A, D;
    if (!Rn || !(Tn != null && Tn.open)) return;
    const u = `${!!((l = c.snapshot().albumLock) != null && l.locked)}|${((D = (A = (d = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : d.call(f)) == null ? void 0 : A.nowPlaying) == null ? void 0 : D.tokenId) ?? ""}|${[...Pr()].sort((B, R) => B - R).join(",")}`;
    u !== rs && (rs = u, Rn.refresh());
  }, ss = /* @__PURE__ */ new Map();
  let Zo = !1;
  const Js = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((l) => {
      const f = l == null ? void 0 : l.nowPlaying;
      if (f && Number.isSafeInteger(Number(f.tokenId)) && ss.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 }), Wo(), pc(Re)) {
        const d = !!(l != null && l.playing);
        pt({ kind: "now", track: f && f.tokenId != null ? String(f.tokenId) : null, playing: d, at: Date.now() }), d !== Zo && (Zo = d, qe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Js()) {
    const u = setInterval(() => {
      Js() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const l = u.detail;
    if (pc(Re) && pt({ kind: "listened", at: Date.now() }), l && Number.isSafeInteger(l.song) && typeof l.id == "string" && /^[0-9a-f]{32}$/.test(l.id)) {
      Jr();
      const f = dn(l.song, ss.get(l.song));
      c.onListened({ song: l.song, id: l.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const hL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", pL = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, gL = () => pL() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, yL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, wL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', tm = class {
  constructor(e) {
    Z4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && wA(e), this.callback(ml(e));
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
  getBrowserUrl(e) {
    var t;
    return (t = e.chromeWebStoreUrl) !== null && t !== void 0 ? t : e.mozillaAddOnsUrl;
  }
  getMobileUrl(e) {
    var t;
    return (t = e.iOSAppStoreUrl) !== null && t !== void 0 ? t : e.googlePlayStoreUrl;
  }
  getInstallUrl(e, t, n) {
    var r, s, o, i, a, c, p, g, h, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (g = (p = e.googlePlayStoreUrl) !== null && p !== void 0 ? p : this.getBrowserUrl(e)) !== null && g !== void 0 ? g : e.webUrl : (w = (h = this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = gL(), t = yL(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Ce("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ce("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ce("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ce("div", { class: "flex flex-col space-y-[10px]" }, Ce("div", { class: "flex items-center" }, Ce("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ce("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ce("span", { class: "sr-only" }, "Close popup"), Ce("img", { src: hL }))), r ? Ce("p", null, "Select the wallet you want to connect to.") : Ce("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Ce("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ce("div", { class: "mt-6" }, Ce("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ce("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Ce("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ce("div", { class: "aspect-square basis-9 overflow-hidden" }, Ce("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ce("div", { class: "flex-1" }, Ce("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Ce("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Ce("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Ce("div", { class: "mt-6" }, r ? Ce("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ce("div", { class: "mb-5 flex justify-between" }, Ce("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ce("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ce("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ce("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ce("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ce("p", null, "What is a wallet? ", Ce("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ce("ul", { class: "space-y-3" }, n.map((o) => Ce("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ce("div", { class: "aspect-square basis-9 overflow-hidden" }, Ce("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ce("div", { class: "flex-1" }, Ce("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Ce("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Ce("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return M4(this);
  }
};
tm.style = wL;
const bL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: tm
}, Symbol.toStringTag, { value: "Module" }));
