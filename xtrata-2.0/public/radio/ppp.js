var Gy = Object.defineProperty;
var Ky = (t, e, n) => e in t ? Gy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ri = (t, e, n) => Ky(t, typeof e != "symbol" ? e + "" : e, n);
var He = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Da(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
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
      typeof He < "u" && He || {}, r = {
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
      function i(E) {
        return E && DataView.prototype.isPrototypeOf(E);
      }
      if (r.arrayBuffer)
        var s = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], o = ArrayBuffer.isView || function(E) {
          return E && s.indexOf(Object.prototype.toString.call(E)) > -1;
        };
      function a(E) {
        if (typeof E != "string" && (E = String(E)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(E) || E === "")
          throw new TypeError('Invalid character in header field name: "' + E + '"');
        return E.toLowerCase();
      }
      function c(E) {
        return typeof E != "string" && (E = String(E)), E;
      }
      function u(E) {
        var T = {
          next: function() {
            var N = E.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (T[Symbol.iterator] = function() {
          return T;
        }), T;
      }
      function d(E) {
        this.map = {}, E instanceof d ? E.forEach(function(T, N) {
          this.append(N, T);
        }, this) : Array.isArray(E) ? E.forEach(function(T) {
          if (T.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + T.length);
          this.append(T[0], T[1]);
        }, this) : E && Object.getOwnPropertyNames(E).forEach(function(T) {
          this.append(T, E[T]);
        }, this);
      }
      d.prototype.append = function(E, T) {
        E = a(E), T = c(T);
        var N = this.map[E];
        this.map[E] = N ? N + ", " + T : T;
      }, d.prototype.delete = function(E) {
        delete this.map[a(E)];
      }, d.prototype.get = function(E) {
        return E = a(E), this.has(E) ? this.map[E] : null;
      }, d.prototype.has = function(E) {
        return this.map.hasOwnProperty(a(E));
      }, d.prototype.set = function(E, T) {
        this.map[a(E)] = c(T);
      }, d.prototype.forEach = function(E, T) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && E.call(T, this.map[N], N, this);
      }, d.prototype.keys = function() {
        var E = [];
        return this.forEach(function(T, N) {
          E.push(N);
        }), u(E);
      }, d.prototype.values = function() {
        var E = [];
        return this.forEach(function(T) {
          E.push(T);
        }), u(E);
      }, d.prototype.entries = function() {
        var E = [];
        return this.forEach(function(T, N) {
          E.push([N, T]);
        }), u(E);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(E) {
        if (!E._noBody) {
          if (E.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          E.bodyUsed = !0;
        }
      }
      function y(E) {
        return new Promise(function(T, N) {
          E.onload = function() {
            T(E.result);
          }, E.onerror = function() {
            N(E.error);
          };
        });
      }
      function h(E) {
        var T = new FileReader(), N = y(T);
        return T.readAsArrayBuffer(E), N;
      }
      function S(E) {
        var T = new FileReader(), N = y(T), B = /charset=([A-Za-z0-9_-]+)/.exec(E.type), nt = B ? B[1] : "utf-8";
        return T.readAsText(E, nt), N;
      }
      function x(E) {
        for (var T = new Uint8Array(E), N = new Array(T.length), B = 0; B < T.length; B++)
          N[B] = String.fromCharCode(T[B]);
        return N.join("");
      }
      function L(E) {
        if (E.slice)
          return E.slice(0);
        var T = new Uint8Array(E.byteLength);
        return T.set(new Uint8Array(E)), T.buffer;
      }
      function F() {
        return this.bodyUsed = !1, this._initBody = function(E) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = E, E ? typeof E == "string" ? this._bodyText = E : r.blob && Blob.prototype.isPrototypeOf(E) ? this._bodyBlob = E : r.formData && FormData.prototype.isPrototypeOf(E) ? this._bodyFormData = E : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) ? this._bodyText = E.toString() : r.arrayBuffer && r.blob && i(E) ? (this._bodyArrayBuffer = L(E.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(E) || o(E)) ? this._bodyArrayBuffer = L(E) : this._bodyText = E = Object.prototype.toString.call(E) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof E == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var E = l(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var E = l(this);
            return E || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var E = l(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then($);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(E) {
        var T = E.toUpperCase();
        return H.indexOf(T) > -1 ? T : E;
      }
      function I(E, T) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        T = T || {};
        var N = T.body;
        if (E instanceof I) {
          if (E.bodyUsed)
            throw new TypeError("Already read");
          this.url = E.url, this.credentials = E.credentials, T.headers || (this.headers = new d(E.headers)), this.method = E.method, this.mode = E.mode, this.signal = E.signal, !N && E._bodyInit != null && (N = E._bodyInit, E.bodyUsed = !0);
        } else
          this.url = String(E);
        if (this.credentials = T.credentials || this.credentials || "same-origin", (T.headers || !this.headers) && (this.headers = new d(T.headers)), this.method = p(T.method || this.method || "GET"), this.mode = T.mode || this.mode || null, this.signal = T.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (T.cache === "no-store" || T.cache === "no-cache")) {
          var B = /([?&])_=[^&]*/;
          if (B.test(this.url))
            this.url = this.url.replace(B, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var nt = /\?/;
            this.url += (nt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function $(E) {
        var T = new FormData();
        return E.trim().split("&").forEach(function(N) {
          if (N) {
            var B = N.split("="), nt = B.shift().replace(/\+/g, " "), j = B.join("=").replace(/\+/g, " ");
            T.append(decodeURIComponent(nt), decodeURIComponent(j));
          }
        }), T;
      }
      function P(E) {
        var T = new d(), N = E.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(B) {
          return B.indexOf(`
`) === 0 ? B.substr(1, B.length) : B;
        }).forEach(function(B) {
          var nt = B.split(":"), j = nt.shift().trim();
          if (j) {
            var jt = nt.join(":").trim();
            try {
              T.append(j, jt);
            } catch (dt) {
              console.warn("Response " + dt.message);
            }
          }
        }), T;
      }
      F.call(I.prototype);
      function W(E, T) {
        if (!(this instanceof W))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (T || (T = {}), this.type = "default", this.status = T.status === void 0 ? 200 : T.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = T.statusText === void 0 ? "" : "" + T.statusText, this.headers = new d(T.headers), this.url = T.url || "", this._initBody(E);
      }
      F.call(W.prototype), W.prototype.clone = function() {
        return new W(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, W.error = function() {
        var E = new W(null, { status: 200, statusText: "" });
        return E.ok = !1, E.status = 0, E.type = "error", E;
      };
      var G = [301, 302, 303, 307, 308];
      W.redirect = function(E, T) {
        if (G.indexOf(T) === -1)
          throw new RangeError("Invalid status code");
        return new W(null, { status: T, headers: { location: E } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(T, N) {
          this.message = T, this.name = N;
          var B = Error(T);
          this.stack = B.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function V(E, T) {
        return new Promise(function(N, B) {
          var nt = new I(E, T);
          if (nt.signal && nt.signal.aborted)
            return B(new e.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function jt() {
            j.abort();
          }
          j.onload = function() {
            var v = {
              statusText: j.statusText,
              headers: P(j.getAllResponseHeaders() || "")
            };
            nt.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? v.status = 200 : v.status = j.status, v.url = "responseURL" in j ? j.responseURL : v.headers.get("X-Request-URL");
            var M = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              N(new W(M, v));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              B(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              B(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              B(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function dt(v) {
            try {
              return v === "" && n.location.href ? n.location.href : v;
            } catch {
              return v;
            }
          }
          if (j.open(nt.method, dt(nt.url), !0), nt.credentials === "include" ? j.withCredentials = !0 : nt.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), T && typeof T.headers == "object" && !(T.headers instanceof d || n.Headers && T.headers instanceof n.Headers)) {
            var ie = [];
            Object.getOwnPropertyNames(T.headers).forEach(function(v) {
              ie.push(a(v)), j.setRequestHeader(v, c(T.headers[v]));
            }), nt.headers.forEach(function(v, M) {
              ie.indexOf(M) === -1 && j.setRequestHeader(M, v);
            });
          } else
            nt.headers.forEach(function(v, M) {
              j.setRequestHeader(M, v);
            });
          nt.signal && (nt.signal.addEventListener("abort", jt), j.onreadystatechange = function() {
            j.readyState === 4 && nt.signal.removeEventListener("abort", jt);
          }), j.send(typeof nt._bodyInit > "u" ? null : nt._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = d, n.Request = I, n.Response = W), e.Headers = d, e.Request = I, e.Response = W, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : He);
})();
const Vy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function qy(t, e) {
  const n = {};
  return Object.assign(n, Vy, e), await fetch(t, n);
}
function Wy(t) {
  let e = qy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Xy(...t) {
  const { fetchLib: e, middlewares: n } = Wy(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var fi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fi || (fi = {}));
var ps;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ps || (ps = {}));
var xf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xf || (xf = {}));
const Yy = "https://api.mainnet.hiro.so", Zy = "https://api.testnet.hiro.so", Qy = "http://localhost:3999", Jy = ["mainnet", "testnet", "devnet", "mocknet"];
let di = class {
  constructor(e) {
    this.version = ps.Mainnet, this.chainId = fi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ps.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Xy();
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
di.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Xc();
    case "testnet":
      return new tw();
    case "devnet":
      return new ew();
    case "mocknet":
      return new Jh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Jy.join(", ")}`);
  }
};
di.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : di.fromName(t);
let Xc = class extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ps.Mainnet, this.chainId = fi.Mainnet;
  }
}, tw = class extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ps.Testnet, this.chainId = fi.Testnet;
  }
}, Jh = class extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Qy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ps.Testnet, this.chainId = fi.Testnet;
  }
};
const ew = Jh, t0 = "xtrata.wallet.bridge.v1", nw = (t) => typeof t == "object" && t !== null && t.protocol === t0, rw = (t) => nw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", sw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Gi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Sf = 12e4;
class iw {
  constructor(e) {
    Ri(this, "pending", /* @__PURE__ */ new Map());
    Ri(this, "listenTarget");
    Ri(this, "closed", !1);
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
    Ri(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !rw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Gi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Gi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Gi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = sw(), s = { protocol: t0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new Gi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Sf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Sf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Gi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const ow = ["SP", "SM"], aw = ["ST", "SN"], cw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ow.includes(n) ? "mainnet" : aw.includes(n) ? "testnet" : null;
}, lw = () => {
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
}, uw = () => typeof window > "u" || !window.localStorage ? lw() : window.localStorage, mc = "xtrata.v15.1.wallet.session", Ef = "mainnet", ha = { isConnected: !1 }, fw = (t) => t.address ? cw(t.address) ?? t.network : t.network, e0 = (t) => !t.isConnected || !t.address ? { ...ha } : fw(t) !== Ef ? { ...ha } : {
  isConnected: !0,
  address: t.address,
  network: Ef,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, dw = (t) => {
  if (!t)
    return { ...ha };
  try {
    const e = JSON.parse(t);
    return e0(e);
  } catch {
    return { ...ha };
  }
}, hw = (t) => {
  const e = e0(t);
  return JSON.stringify(e);
}, pw = (t) => {
  const e = uw();
  return {
    load: () => dw(e.getItem(mc)),
    save: (n) => {
      e.setItem(mc, hw(n));
    },
    clear: () => {
      e.removeItem(mc);
    }
  };
}, gw = "https://browser.blockstack.org/auth", yw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, n0 = ["store_write"], ww = "blockstack-session", bw = {
  logLevel: "debug"
}, Ms = {
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
Object.freeze(Ms);
class Ci extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, i = this.stack;
    if (i)
      r += `Stack Trace:
${i}`;
    else
      try {
        throw new Error();
      } catch (s) {
        i = s.stack;
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
class mw extends Ci {
  constructor(e, n = "") {
    super({ code: Ms.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Af extends Ci {
  constructor(e = "") {
    super({ code: Ms.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class To extends Ci {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ms.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class vf extends Ci {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ms.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Yc extends Ci {
  constructor(e) {
    super({ code: Ms.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class r0 extends Ci {
  constructor(e) {
    super({ code: Ms.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const $f = ["debug", "info", "warn", "error", "none"], Zc = {};
for (let t = 0; t < $f.length; t++) {
  const e = $f[t];
  Zc[e] = t;
}
class ri {
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
    return Zc[bw.logLevel] <= Zc[e];
  }
}
function xw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Sw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function xc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Ew() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Aw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function vw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function nu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Aw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    ri.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = vw(i, t.toString(), n);
    throw ri.error(s), new Error(s);
  }
  if (r)
    return {};
}
function qr(t, e) {
  return ru(Be(t), e);
}
function Be(t) {
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
  if (qe(t, Uint8Array))
    return BigInt(`0x${ct(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function $w(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function If(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function wo(t, e = 8) {
  return (typeof t == "bigint" ? t : Be(t)).toString(16).padStart(e * 2, "0");
}
function Fa(t) {
  return parseInt(t, 16);
}
function ru(t, e = 16) {
  const n = wo(t, e);
  return Ht(n);
}
function Iw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function kw(t, e) {
  return t & BigInt(1) << e;
}
function Qc(t) {
  return Lw(BigInt(`0x${ct(t)}`), BigInt(t.byteLength * 8));
}
function Lw(t, e) {
  return kw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Cw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ct(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Cw[n];
  return e;
}
function Ht(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = $w(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Ns(t) {
  return new TextEncoder().encode(t);
}
function bo(t) {
  return new TextDecoder().decode(t);
}
function Tw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bw(t) {
  return String.fromCharCode.apply(null, t);
}
function Mw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function kf(t) {
  if (t.some(Mw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Rn(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function he(t) {
  return Rn(...t.map((e) => typeof e == "number" ? kf([e]) : e instanceof Array ? kf(e) : e));
}
function qe(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const s0 = "https://api.mainnet.hiro.so", i0 = "https://api.testnet.hiro.so", o0 = "http://localhost:3999", Nw = "https://hub.blockstack.org", _w = 33, Sc = 32;
function Uw(t) {
  if (t.length < Sc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Sc * 2), r = t.slice(2 + Sc * 2);
  return {
    recoveryId: Fa(e),
    r: n,
    s: r
  };
}
function su(t) {
  const e = typeof t == "string" ? Ht(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Pw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Hw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Ow(t, e) {
  return t[e];
}
function Dw(t, e, n = 0) {
  return t[n] = e, t;
}
function Fw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function gs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const jw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zw(t, e) {
  const n = {};
  return Object.assign(n, jw, e), await fetch(t, n);
}
function Rw(t) {
  let e = zw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Gw(...t) {
  const { fetchLib: e, middlewares: n } = Rw(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
class a0 {
  constructor(e = n0.slice(), n = ((a) => (a = nu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = gw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Jc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Kw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function c0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Vw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Jc(t.outputLen), Jc(t.blockLen);
}
function qw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ww(t, e) {
  c0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ss = {
  number: Jc,
  bool: Kw,
  bytes: c0,
  hash: Vw,
  exists: qw,
  output: Ww
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ec = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bn = (t, e) => t << 32 - e | t >>> e, Xw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function iu(t) {
  if (typeof t == "string" && (t = Yw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let l0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function _s(t) {
  const e = (r) => t().update(iu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let u0 = class extends l0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ss.hash(e);
    const r = iu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return ss.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ss.exists(this), ss.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ja = (t, e, n) => new u0(t, e).update(n).digest();
ja.create = (t, e) => new u0(t, e);
function Zw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ou = class extends l0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ec(this.buffer);
  }
  update(e) {
    ss.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = iu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ec(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ss.exists(this), ss.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Zw(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ec(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const Qw = (t, e, n) => t & e ^ ~t & n, Jw = (t, e, n) => t & e ^ t & n ^ e & n, tb = new Uint32Array([
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
]), gr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), yr = new Uint32Array(64);
let f0 = class extends ou {
  constructor() {
    super(64, 32, 8, !1), this.A = gr[0] | 0, this.B = gr[1] | 0, this.C = gr[2] | 0, this.D = gr[3] | 0, this.E = gr[4] | 0, this.F = gr[5] | 0, this.G = gr[6] | 0, this.H = gr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      yr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = yr[l - 15], h = yr[l - 2], S = Bn(y, 7) ^ Bn(y, 18) ^ y >>> 3, x = Bn(h, 17) ^ Bn(h, 19) ^ h >>> 10;
      yr[l] = x + yr[l - 7] + S + yr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Bn(a, 6) ^ Bn(a, 11) ^ Bn(a, 25), h = d + y + Qw(a, c, u) + tb[l] + yr[l] | 0, x = (Bn(r, 2) ^ Bn(r, 13) ^ Bn(r, 22)) + Jw(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    yr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, eb = class extends f0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const hi = _s(() => new f0());
_s(() => new eb());
const nb = {}, d0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ut = BigInt(0), ee = BigInt(1), zr = BigInt(2), Qi = BigInt(3), Lf = BigInt(8), Vt = Object.freeze({
  a: Ut,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ee,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Cf = (t, e) => (t + e / zr) / e, Bo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ee * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Cf(s * t, e), c = Cf(-r * t, e);
    let u = X(t - a * n - c * i, e), d = X(-a * r - c * s, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, In = 32, ys = 32, h0 = 32, pa = In + 1, ga = 2 * In + 1;
function Tf(t) {
  const { a: e, b: n } = Vt, r = X(t * t), i = X(r * t);
  return X(i + e * t + n);
}
const Mo = Vt.a === Ut;
class au extends Error {
  constructor(e) {
    super(e);
  }
}
function Bf(t) {
  if (!(t instanceof Ft))
    throw new TypeError("JacobianPoint expected");
}
class Ft {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof vt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(vt.ZERO) ? Ft.ZERO : new Ft(e.x, e.y, ee);
  }
  static toAffineBatch(e) {
    const n = ab(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Ft.toAffineBatch(e).map(Ft.fromAffine);
  }
  equals(e) {
    Bf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = X(i * i), u = X(a * a), d = X(n * u), l = X(s * c), y = X(X(r * a) * u), h = X(X(o * i) * c);
    return d === l && y === h;
  }
  negate() {
    return new Ft(this.x, X(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = X(e * e), s = X(n * n), o = X(s * s), a = e + s, c = X(zr * (X(a * a) - i - o)), u = X(Qi * i), d = X(u * u), l = X(d - zr * c), y = X(u * (c - l) - Lf * o), h = X(zr * n * r);
    return new Ft(l, y, h);
  }
  add(e) {
    Bf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Ut || o === Ut)
      return this;
    if (n === Ut || r === Ut)
      return e;
    const c = X(i * i), u = X(a * a), d = X(n * u), l = X(s * c), y = X(X(r * a) * u), h = X(X(o * i) * c), S = X(l - d), x = X(h - y);
    if (S === Ut)
      return x === Ut ? this.double() : Ft.ZERO;
    const L = X(S * S), F = X(S * L), H = X(d * L), p = X(x * x - F - zr * H), I = X(x * (H - p) - y * F), $ = X(i * a * S);
    return new Ft(p, I, $);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Ft.ZERO;
    if (typeof e == "bigint" && e === Ut)
      return n;
    let r = _f(e);
    if (r === ee)
      return this;
    if (!Mo) {
      let l = n, y = this;
      for (; r > Ut; )
        r & ee && (l = l.add(y)), y = y.double(), r >>= ee;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Bo.splitScalar(r), c = n, u = n, d = this;
    for (; s > Ut || a > Ut; )
      s & ee && (c = c.add(d)), a & ee && (u = u.add(d)), d = d.double(), s >>= ee, a >>= ee;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Ft(X(u.x * Bo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Mo ? 128 / e + 1 : 256 / e + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let a = 1; a < 2 ** (e - 1); a++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Ft.BASE) && (n = vt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && tl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Ft.normalizeZ(i), tl.set(n, i)));
    let s = Ft.ZERO, o = Ft.BASE;
    const a = 1 + (Mo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const h = y * c;
      let S = Number(e & u);
      e >>= l, S > c && (S -= d, e += ee);
      const x = h, L = h + Math.abs(S) - 1, F = y % 2 !== 0, H = S < 0;
      S === 0 ? o = o.add(No(F, i[x])) : s = s.add(No(H, i[L]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = _f(e), i, s;
    if (Mo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Bo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: h } = this.wNAF(u, n);
      d = No(o, d), y = No(c, y), y = new Ft(X(y.x * Bo.beta), y.y, y.z), i = d.add(y), s = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Ft.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Ft.ZERO);
    e == null && (e = s ? Lf : Ti(i));
    const o = e, a = X(o * o), c = X(a * o), u = X(n * a), d = X(r * c), l = X(i * o);
    if (s)
      return vt.ZERO;
    if (l !== ee)
      throw new Error("invZ was invalid");
    return new vt(u, d);
  }
}
Ft.BASE = new Ft(Vt.Gx, Vt.Gy, ee);
Ft.ZERO = new Ft(Ut, ee, Ut);
function No(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const tl = /* @__PURE__ */ new WeakMap();
class vt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, tl.delete(this);
  }
  hasEvenY() {
    return this.y % zr === Ut;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = nn(n ? e : e.subarray(1));
    if (!ia(r))
      throw new Error("Point is not on curve");
    const i = Tf(r);
    let s = ob(i);
    const o = (s & ee) === ee;
    n ? o && (s = X(-s)) : (e[0] & 1) === 1 !== o && (s = X(-s));
    const a = new vt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = nn(e.subarray(1, In + 1)), r = nn(e.subarray(In + 1, In * 2 + 1)), i = new vt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = Gn(e), r = n.length, i = n[0];
    if (r === In)
      return this.fromCompressedHex(n);
    if (r === pa && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === ga && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pa} compressed bytes or ${ga} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return vt.BASE.multiply(ws(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = y0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = cu(Gn(e)), { n: a } = Vt, c = r === 2 || r === 3 ? i + a : i, u = Ti(c, a), d = X(-o * u, a), l = X(s * u, a), y = r & 1 ? "03" : "02", h = vt.fromHex(y + Rr(c)), S = vt.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return Gr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Rr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Rr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ia(n) || !ia(r))
      throw new Error(e);
    const i = X(r * r), s = Tf(n);
    if (X(i - s) !== Ut)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new vt(this.x, X(-this.y));
  }
  double() {
    return Ft.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Ft.fromAffine(this).add(Ft.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Ft.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Ft.fromAffine(this), s = n === Ut || n === ee || this !== vt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Ft.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Ft.ZERO) ? void 0 : a.toAffine();
  }
}
vt.BASE = new vt(Vt.Gx, Vt.Gy);
vt.ZERO = new vt(Ut, Ut);
function Mf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Nf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${pi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: nn(n), left: t.subarray(e + 2) };
}
function rb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${pi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Nf(t.subarray(2)), { data: r, left: i } = Nf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${pi(i)}`);
  return { r: e, s: r };
}
class en {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? pi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new en(ya(i.slice(0, 64)), ya(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = rb(n ? e : Gr(e));
    return new en(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!yi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!yi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Vt.n >> ee;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new en(this.r, X(-this.s, Vt.n)) : this;
  }
  toDERRawBytes() {
    return Gr(this.toDERHex());
  }
  toDERHex() {
    const e = Mf(Ki(this.s)), n = Mf(Ki(this.r)), r = e.length / 2, i = n.length / 2, s = Ki(r), o = Ki(i);
    return `30${Ki(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Gr(this.toCompactHex());
  }
  toCompactHex() {
    return Rr(this.r) + Rr(this.s);
  }
}
function Fr(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const sb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += sb[t[n]];
  return e;
}
const ib = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Rr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ut <= t && t < ib))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function gi(t) {
  const e = Gr(Rr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ki(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ya(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Gr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function nn(t) {
  return ya(pi(t));
}
function Gn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Gr(t);
}
function _f(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && yi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function X(t, e = Vt.P) {
  const n = t % e;
  return n >= Ut ? n : e + n;
}
function un(t, e) {
  const { P: n } = Vt;
  let r = t;
  for (; e-- > Ut; )
    r *= r, r %= n;
  return r;
}
function ob(t) {
  const { P: e } = Vt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = un(u, Qi) * u % e, l = un(d, Qi) * u % e, y = un(l, zr) * c % e, h = un(y, r) * y % e, S = un(h, i) * h % e, x = un(S, o) * S % e, L = un(x, a) * x % e, F = un(L, o) * S % e, H = un(F, Qi) * u % e, p = un(H, s) * h % e, I = un(p, n) * c % e, $ = un(I, zr);
  if ($ * $ % e !== t)
    throw new Error("Cannot find square root");
  return $;
}
function Ti(t, e = Vt.P) {
  if (t === Ut || e <= Ut)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = X(t, e), r = e, i = Ut, s = ee;
  for (; n !== Ut; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== ee)
    throw new Error("invert: does not exist");
  return X(i, e);
}
function ab(t, e = Vt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Ut ? s : (n[a] = s, X(s * o, e)), ee), i = Ti(r, e);
  return t.reduceRight((s, o, a) => o === Ut ? s : (n[a] = X(s * n[a], e), X(s * o, e)), i), n;
}
function cb(t) {
  const e = t.length * 8 - ys * 8, n = nn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function cu(t, e = !1) {
  const n = cb(t);
  if (e)
    return n;
  const { n: r } = Vt;
  return n >= r ? n - r : n;
}
let li, Ji;
class p0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ue.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ji(this.k, ...e);
  }
  checkSync() {
    if (typeof Ji != "function")
      throw new au("hmacSha256Sync needs to be set");
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
    return Fr(...n);
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
    return Fr(...n);
  }
}
function yi(t) {
  return Ut < t && t < Vt.n;
}
function ia(t) {
  return Ut < t && t < Vt.P;
}
function g0(t, e, n, r = !0) {
  const { n: i } = Vt, s = cu(t, !0);
  if (!yi(s))
    return;
  const o = Ti(s, i), a = vt.BASE.multiply(s), c = X(a.x, i);
  if (c === Ut)
    return;
  const u = X(o * X(e + n * c, i), i);
  if (u === Ut)
    return;
  let d = new en(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ee);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function ws(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ys)
      throw new Error("Expected 32 bytes of private key");
    e = ya(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ys)
      throw new Error("Expected 32 bytes of private key");
    e = nn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!yi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function lu(t) {
  return t instanceof vt ? (t.assertValidity(), t) : vt.fromHex(t);
}
function y0(t) {
  if (t instanceof en)
    return t.assertValidity(), t;
  try {
    return en.fromDER(t);
  } catch {
    return en.fromCompact(t);
  }
}
function mo(t, e = !1) {
  return vt.fromPrivateKey(t).toRawBytes(e);
}
function lb(t, e, n, r = !1) {
  return vt.fromSignature(t, e, n).toRawBytes(r);
}
function Uf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === pa || r === ga : n ? r === pa * 2 || r === ga * 2 : t instanceof vt;
}
function uu(t, e, n = !1) {
  if (Uf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Uf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = lu(e);
  return r.assertValidity(), r.multiply(ws(t)).toRawBytes(n);
}
function w0(t) {
  const e = t.length > In ? t.slice(0, In) : t;
  return nn(e);
}
function ub(t) {
  const e = w0(t), n = X(e, Vt.n);
  return b0(n < Ut ? e : n);
}
function b0(t) {
  return gi(t);
}
function m0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Gn(t), i = ws(e), s = [b0(i), ub(r)];
  if (n != null) {
    n === !0 && (n = ue.randomBytes(In));
    const c = Gn(n);
    if (c.length !== In)
      throw new Error(`sign: Expected ${In} bytes of extra data`);
    s.push(c);
  }
  const o = Fr(...s), a = w0(r);
  return { seed: o, m: a, d: i };
}
function x0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function fb(t, e, n = {}) {
  const { seed: r, m: i, d: s } = m0(t, e, n.extraEntropy), o = new p0(h0, ys);
  await o.reseed(r);
  let a;
  for (; !(a = g0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return x0(a, n);
}
function za(t, e, n = {}) {
  const { seed: r, m: i, d: s } = m0(t, e, n.extraEntropy), o = new p0(h0, ys);
  o.reseedSync(r);
  let a;
  for (; !(a = g0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return x0(a, n);
}
const db = { strict: !0 };
function hb(t, e, n, r = db) {
  let i;
  try {
    i = y0(t), e = Gn(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = cu(e);
  let c;
  try {
    c = lu(n);
  } catch {
    return !1;
  }
  const { n: u } = Vt, d = Ti(o, u), l = X(a * d, u), y = X(s * d, u), h = vt.BASE.multiplyAndAddUnsafe(c, l, y);
  return h ? X(h.x, u) === s : !1;
}
function wa(t) {
  return X(nn(t), Vt.n);
}
class wi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Gn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = nn(n.subarray(0, 32)), i = nn(n.subarray(32, 64));
    return new wi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ia(e) || !yi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Rr(this.r) + Rr(this.s);
  }
  toRawBytes() {
    return Gr(this.toHex());
  }
}
function pb(t) {
  return vt.fromPrivateKey(t).toRawX();
}
class S0 {
  constructor(e, n, r = ue.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Gn(e);
    const { x: i, scalar: s } = this.getScalar(ws(n));
    if (this.px = i, this.d = s, this.rand = Gn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = vt.fromPrivateKey(e), r = n.hasEvenY() ? e : Vt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return gi(e ^ nn(n));
  }
  finalizeNonce(e) {
    const n = X(nn(e), Vt.n);
    if (n === Ut)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new wi(e.x, X(n + r * i, Vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = ue.taggedHash, o = this.initNonce(n, await s(Dr.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(Dr.nonce, o, r, e)), d = wa(await s(Dr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await v0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = ue.taggedHashSync, o = this.initNonce(n, s(Dr.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(Dr.nonce, o, r, e)), d = wa(s(Dr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return $0(l, e, r) || this.error(), l;
  }
}
async function gb(t, e, n) {
  return new S0(t, e, n).calc();
}
function yb(t, e, n) {
  return new S0(t, e, n).calcSync();
}
function E0(t, e, n) {
  const r = t instanceof wi, i = r ? t : wi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: Gn(e),
    P: lu(n)
  };
}
function A0(t, e, n, r) {
  const i = vt.BASE.multiplyAndAddUnsafe(e, ws(n), X(-r, Vt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function v0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = E0(t, e, n), a = wa(await ue.taggedHash(Dr.challenge, gi(r), o.toRawX(), s));
    return A0(r, o, i, a);
  } catch {
    return !1;
  }
}
function $0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = E0(t, e, n), a = wa(ue.taggedHashSync(Dr.challenge, gi(r), o.toRawX(), s));
    return A0(r, o, i, a);
  } catch (r) {
    if (r instanceof au)
      throw r;
    return !1;
  }
}
const wb = {
  Signature: wi,
  getPublicKey: pb,
  sign: gb,
  verify: v0,
  signSync: yb,
  verifySync: $0
};
vt.BASE._setWindowSize(8);
const Ye = {
  node: d0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Dr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, _o = {}, ue = {
  bytesToHex: pi,
  hexToBytes: Gr,
  concatBytes: Fr,
  mod: X,
  invert: Ti,
  isValidPrivateKey(t) {
    try {
      return ws(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: gi,
  _normalizePrivateKey: ws,
  hashToPrivateKey: (t) => {
    t = Gn(t);
    const e = ys + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = X(nn(t), Vt.n - ee) + ee;
    return gi(n);
  },
  randomBytes: (t = 32) => {
    if (Ye.web)
      return Ye.web.getRandomValues(new Uint8Array(t));
    if (Ye.node) {
      const { randomBytes: e } = Ye.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ue.hashToPrivateKey(ue.randomBytes(ys + 8)),
  precompute(t = 8, e = vt.BASE) {
    const n = e === vt.BASE ? e : new vt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Qi), n;
  },
  sha256: async (...t) => {
    if (Ye.web) {
      const e = await Ye.web.subtle.digest("SHA-256", Fr(...t));
      return new Uint8Array(e);
    } else if (Ye.node) {
      const { createHash: e } = Ye.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ye.web) {
      const n = await Ye.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Fr(...e), i = await Ye.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (Ye.node) {
      const { createHmac: n } = Ye.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = _o[t];
    if (n === void 0) {
      const r = await ue.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Fr(r, r), _o[t] = n;
    }
    return ue.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof li != "function")
      throw new au("sha256Sync is undefined, you need to set it");
    let n = _o[t];
    if (n === void 0) {
      const r = li(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Fr(r, r), _o[t] = n;
    }
    return li(n, ...e);
  },
  _JacobianPoint: Ft
};
Object.defineProperties(ue, {
  sha256Sync: {
    configurable: !1,
    get() {
      return li;
    },
    set(t) {
      li || (li = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ji;
    },
    set(t) {
      Ji || (Ji = t);
    }
  }
});
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Vt,
  Point: vt,
  Signature: en,
  getPublicKey: mo,
  getSharedSecret: uu,
  recoverPublicKey: lb,
  schnorr: wb,
  sign: fb,
  signSync: za,
  utils: ue,
  verify: hb
}, Symbol.toStringTag, { value: "Module" }));
var xo = {};
xo.byteLength = Ab;
var mb = xo.toByteArray = $b, xb = xo.fromByteArray = Lb, Pn = [], dn = [], Sb = typeof Uint8Array < "u" ? Uint8Array : Array, Ac = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ys = 0, Eb = Ac.length; Ys < Eb; ++Ys)
  Pn[Ys] = Ac[Ys], dn[Ac.charCodeAt(Ys)] = Ys;
dn[45] = 62;
dn[95] = 63;
function I0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ab(t) {
  var e = I0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function vb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function $b(t) {
  var e, n = I0(t), r = n[0], i = n[1], s = new Sb(vb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = dn[t.charCodeAt(c)] << 18 | dn[t.charCodeAt(c + 1)] << 12 | dn[t.charCodeAt(c + 2)] << 6 | dn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = dn[t.charCodeAt(c)] << 2 | dn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = dn[t.charCodeAt(c)] << 10 | dn[t.charCodeAt(c + 1)] << 4 | dn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Ib(t) {
  return Pn[t >> 18 & 63] + Pn[t >> 12 & 63] + Pn[t >> 6 & 63] + Pn[t & 63];
}
function kb(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Ib(r));
  return i.join("");
}
function Lb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(kb(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    Pn[e >> 2] + Pn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    Pn[e >> 10] + Pn[e >> 4 & 63] + Pn[e << 2 & 63] + "="
  )), i.join("");
}
function Cb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Tb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Bb() {
  if (Cb())
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
    throw new Error(Tb);
  }
}
class Mb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(Rn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(Rn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Nb {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
}
async function k0() {
  const t = await Bb();
  return t.name === "subtleCrypto" ? new Nb(t.lib) : new Mb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function _b(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var i = t.charAt(r), s = i.charCodeAt(0);
    if (e[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    e[s] = r;
  }
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var S = 0, x = 0, L = 0, F = h.length; L !== F && h[L] === 0; )
      L++, S++;
    for (var H = (F - L) * u + 1 >>> 0, p = new Uint8Array(H); L !== F; ) {
      for (var I = h[L], $ = 0, P = H - 1; (I !== 0 || $ < x) && P !== -1; P--, $++)
        I += 256 * p[P] >>> 0, p[P] = I % o >>> 0, I = I / o >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      x = $, L++;
    }
    for (var W = H - x; W !== H && p[W] === 0; )
      W++;
    for (var G = a.repeat(S); W < H; ++W)
      G += t.charAt(p[W]);
    return G;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, L = 0; h[S] === a; )
      x++, S++;
    for (var F = (h.length - S) * c + 1 >>> 0, H = new Uint8Array(F); h[S]; ) {
      var p = h.charCodeAt(S);
      if (p > 255)
        return;
      var I = e[p];
      if (I === 255)
        return;
      for (var $ = 0, P = F - 1; (I !== 0 || $ < L) && P !== -1; P--, $++)
        I += o * H[P] >>> 0, H[P] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      L = $, S++;
    }
    for (var W = F - L; W !== F && H[W] === 0; )
      W++;
    for (var G = new Uint8Array(x + (F - W)), V = x; W !== F; )
      G[V++] = H[W++];
    return G;
  }
  function y(h) {
    var S = l(h);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var L0 = _b;
const Ub = L0, Pb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Hb = Ub(Pb);
const Ob = /* @__PURE__ */ Qh(Hb), Db = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), C0 = Uint8Array.from({ length: 16 }, (t, e) => e), Fb = C0.map((t) => (9 * t + 5) % 16);
let fu = [C0], du = [Fb];
for (let t = 0; t < 4; t++)
  for (let e of [fu, du])
    e.push(e[t].map((n) => Db[n]));
const T0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jb = fu.map((t, e) => t.map((n) => T0[e][n])), zb = du.map((t, e) => t.map((n) => T0[e][n])), Rb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Gb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Uo = (t, e) => t << e | t >>> 32 - e;
function Pf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Po = new Uint32Array(16);
let Kb = class extends ou {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Po[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const S = 4 - h, x = Rb[h], L = Gb[h], F = fu[h], H = du[h], p = jb[h], I = zb[h];
      for (let $ = 0; $ < 16; $++) {
        const P = Uo(r + Pf(h, s, a, u) + Po[F[$]] + x, p[$]) + l | 0;
        r = l, l = u, u = Uo(a, 10) | 0, a = s, s = P;
      }
      for (let $ = 0; $ < 16; $++) {
        const P = Uo(i + Pf(S, o, c, d) + Po[H[$]] + L, I[$]) + y | 0;
        i = y, y = d, d = Uo(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Po.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Vb = _s(() => new Kb());
function qb(t) {
  return Vb(t);
}
const Ho = BigInt(2 ** 32 - 1), el = BigInt(32);
function B0(t, e = !1) {
  return e ? { h: Number(t & Ho), l: Number(t >> el & Ho) } : { h: Number(t >> el & Ho) | 0, l: Number(t & Ho) | 0 };
}
function Wb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = B0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Xb = (t, e) => BigInt(t >>> 0) << el | BigInt(e >>> 0), Yb = (t, e, n) => t >>> n, Zb = (t, e, n) => t << 32 - n | e >>> n, Qb = (t, e, n) => t >>> n | e << 32 - n, Jb = (t, e, n) => t << 32 - n | e >>> n, t1 = (t, e, n) => t << 64 - n | e >>> n - 32, e1 = (t, e, n) => t >>> n - 32 | e << 64 - n, n1 = (t, e) => e, r1 = (t, e) => t, s1 = (t, e, n) => t << n | e >>> 32 - n, i1 = (t, e, n) => e << n | t >>> 32 - n, o1 = (t, e, n) => e << n - 32 | t >>> 64 - n, a1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function c1(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const l1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), u1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, f1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), d1 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, h1 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), p1 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: B0,
  split: Wb,
  toBig: Xb,
  shrSH: Yb,
  shrSL: Zb,
  rotrSH: Qb,
  rotrSL: Jb,
  rotrBH: t1,
  rotrBL: e1,
  rotr32H: n1,
  rotr32L: r1,
  rotlSH: s1,
  rotlSL: i1,
  rotlBH: o1,
  rotlBL: a1,
  add: c1,
  add3L: l1,
  add3H: u1,
  add4L: f1,
  add4H: d1,
  add5H: p1,
  add5L: h1
}, [g1, y1] = bt.split([
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
].map((t) => BigInt(t))), wr = new Uint32Array(80), br = new Uint32Array(80);
let Ra = class extends ou {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      wr[p] = e.getUint32(n), br[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const I = wr[p - 15] | 0, $ = br[p - 15] | 0, P = bt.rotrSH(I, $, 1) ^ bt.rotrSH(I, $, 8) ^ bt.shrSH(I, $, 7), W = bt.rotrSL(I, $, 1) ^ bt.rotrSL(I, $, 8) ^ bt.shrSL(I, $, 7), G = wr[p - 2] | 0, V = br[p - 2] | 0, E = bt.rotrSH(G, V, 19) ^ bt.rotrBH(G, V, 61) ^ bt.shrSH(G, V, 6), T = bt.rotrSL(G, V, 19) ^ bt.rotrBL(G, V, 61) ^ bt.shrSL(G, V, 6), N = bt.add4L(W, T, br[p - 7], br[p - 16]), B = bt.add4H(N, P, E, wr[p - 7], wr[p - 16]);
      wr[p] = B | 0, br[p] = N | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: S, Gh: x, Gl: L, Hh: F, Hl: H } = this;
    for (let p = 0; p < 80; p++) {
      const I = bt.rotrSH(l, y, 14) ^ bt.rotrSH(l, y, 18) ^ bt.rotrBH(l, y, 41), $ = bt.rotrSL(l, y, 14) ^ bt.rotrSL(l, y, 18) ^ bt.rotrBL(l, y, 41), P = l & h ^ ~l & x, W = y & S ^ ~y & L, G = bt.add5L(H, $, W, y1[p], br[p]), V = bt.add5H(G, F, I, P, g1[p], wr[p]), E = G | 0, T = bt.rotrSH(r, i, 28) ^ bt.rotrBH(r, i, 34) ^ bt.rotrBH(r, i, 39), N = bt.rotrSL(r, i, 28) ^ bt.rotrBL(r, i, 34) ^ bt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      F = x | 0, H = L | 0, x = h | 0, L = S | 0, h = l | 0, S = y | 0, { h: l, l: y } = bt.add(u | 0, d | 0, V | 0, E | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const j = bt.add3L(E, N, nt);
      r = bt.add3H(j, V, T, B), i = j | 0;
    }
    ({ h: r, l: i } = bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = bt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: S } = bt.add(this.Fh | 0, this.Fl | 0, h | 0, S | 0), { h: x, l: L } = bt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: F, l: H } = bt.add(this.Hh | 0, this.Hl | 0, F | 0, H | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, S, x, L, F, H);
  }
  roundClean() {
    wr.fill(0), br.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, w1 = class extends Ra {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b1 = class extends Ra {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, m1 = class extends Ra {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const x1 = _s(() => new Ra());
_s(() => new w1());
_s(() => new b1());
_s(() => new m1());
function M0(t) {
  return hi(t);
}
function S1(t) {
  return x1(t);
}
const E1 = 0;
ue.hmacSha256Sync = (t, ...e) => {
  const n = ja.create(hi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function A1() {
  return ct(ue.randomPrivateKey());
}
function v1(t) {
  const e = hi(hi(t));
  return Ob.encode(Rn(t, e).slice(0, t.length + 4));
}
function $1(t, e) {
  return v1(Rn(new Uint8Array([t]), e.slice(0, 20)));
}
function N0(t, e = E1) {
  const n = typeof t == "string" ? Ht(t) : t, r = qb(M0(n));
  return $1(e, r);
}
function _0(t) {
  const e = su(t);
  return ct(mo(e.slice(0, 32), !0));
}
ue.hmacSha256Sync = (t, ...e) => {
  const n = ja.create(hi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ba;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ba || (ba = {}));
async function I1(t, e, n) {
  return await (await k0()).encrypt("aes-256-cbc", e, t, n);
}
async function k1(t, e, n) {
  return await (await k0()).decrypt("aes-256-cbc", e, t, n);
}
function U0(t, e) {
  return ja(hi, t, e);
}
function L1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function P0(t) {
  const e = S1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function C1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function T1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ba.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ba.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !C1(t))
    return e;
  try {
    return vt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function B1(t, e, n, r) {
  const i = T1(t);
  if (!i.result)
    throw i;
  const s = ue.randomPrivateKey(), o = mo(s, !0);
  let a = uu(s, t, !0);
  a = a.slice(1);
  const c = P0(a), u = ue.randomBytes(16), d = await I1(u, c.encryptionKey, e), l = Rn(u, o, d), y = U0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = ct(d);
  else if (r === "base64")
    h = xb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: ct(u),
    ephemeralPK: ct(o),
    cipherText: h,
    mac: ct(y),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function H0(t, e) {
  if (!e.ephemeralPK)
    throw new vf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = uu(t, n, !0);
  r = r.slice(1);
  const i = P0(r), s = Ht(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Ht(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = mb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Rn(s, Ht(n), o), c = U0(i.hmacKey, a), u = Ht(e.mac);
  if (!L1(u, c))
    throw new vf("Decryption failed: failure in MAC check");
  const d = await k1(s, i.encryptionKey, o);
  return e.wasString ? bo(d) : d;
}
function M1(t, e) {
  const n = typeof e == "string" ? Ns(e) : e, r = _0(t), i = M0(n), s = za(i, t);
  return {
    signature: ct(s),
    publicKey: r
  };
}
async function N1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = _0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Ns(t) : t, o = await B1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = M1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function _1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return H0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Le = {}, bi = {}, Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.decode = Ue.encode = Ue.unescape = Ue.escape = Ue.pad = void 0;
const O0 = xo;
function hu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Ue.pad = hu;
function D0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Ue.escape = D0;
function F0(t) {
  return hu(t).replace(/-/g, "+").replace(/_/g, "/");
}
Ue.unescape = F0;
function U1(t) {
  return D0((0, O0.fromByteArray)(new TextEncoder().encode(t)));
}
Ue.encode = U1;
function P1(t) {
  return new TextDecoder().decode((0, O0.toByteArray)(hu(F0(t))));
}
Ue.decode = P1;
var Ga = {}, Ka = {}, j0 = {}, z0 = {}, Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.crypto = void 0;
Va.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = h, t.byteSwap = S, t.byteSwap32 = x, t.bytesToHex = H, t.hexToBytes = $, t.asyncLoop = W, t.utf8ToBytes = G, t.bytesToUtf8 = V, t.toBytes = E, t.kdfInputToBytes = T, t.concatBytes = N, t.checkOpts = B, t.createHasher = j, t.createOptHasher = jt, t.createXOFer = dt, t.randomBytes = ie;
  const e = Va;
  function n(v) {
    return v instanceof Uint8Array || ArrayBuffer.isView(v) && v.constructor.name === "Uint8Array";
  }
  function r(v) {
    if (!Number.isSafeInteger(v) || v < 0)
      throw new Error("positive integer expected, got " + v);
  }
  function i(v, ...M) {
    if (!n(v))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(v.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + v.length);
  }
  function s(v) {
    if (typeof v != "function" || typeof v.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(v.outputLen), r(v.blockLen);
  }
  function o(v, M = !0) {
    if (v.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && v.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(v, M) {
    i(v);
    const ht = M.outputLen;
    if (v.length < ht)
      throw new Error("digestInto() expects output buffer of length at least " + ht);
  }
  function c(v) {
    return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  }
  function u(v) {
    return new Uint32Array(v.buffer, v.byteOffset, Math.floor(v.byteLength / 4));
  }
  function d(...v) {
    for (let M = 0; M < v.length; M++)
      v[M].fill(0);
  }
  function l(v) {
    return new DataView(v.buffer, v.byteOffset, v.byteLength);
  }
  function y(v, M) {
    return v << 32 - M | v >>> M;
  }
  function h(v, M) {
    return v << M | v >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(v) {
    return v << 24 & 4278190080 | v << 8 & 16711680 | v >>> 8 & 65280 | v >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (v) => v : (v) => S(v), t.byteSwapIfBE = t.swap8IfBE;
  function x(v) {
    for (let M = 0; M < v.length; M++)
      v[M] = S(v[M]);
    return v;
  }
  t.swap32IfBE = t.isLE ? (v) => v : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", F = /* @__PURE__ */ Array.from({ length: 256 }, (v, M) => M.toString(16).padStart(2, "0"));
  function H(v) {
    if (i(v), L)
      return v.toHex();
    let M = "";
    for (let ht = 0; ht < v.length; ht++)
      M += F[v[ht]];
    return M;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(v) {
    if (v >= p._0 && v <= p._9)
      return v - p._0;
    if (v >= p.A && v <= p.F)
      return v - (p.A - 10);
    if (v >= p.a && v <= p.f)
      return v - (p.a - 10);
  }
  function $(v) {
    if (typeof v != "string")
      throw new Error("hex string expected, got " + typeof v);
    if (L)
      return Uint8Array.fromHex(v);
    const M = v.length, ht = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const $t = new Uint8Array(ht);
    for (let It = 0, Ct = 0; It < ht; It++, Ct += 2) {
      const zt = I(v.charCodeAt(Ct)), Rt = I(v.charCodeAt(Ct + 1));
      if (zt === void 0 || Rt === void 0) {
        const Ot = v[Ct] + v[Ct + 1];
        throw new Error('hex string expected, got non-hex character "' + Ot + '" at index ' + Ct);
      }
      $t[It] = zt * 16 + Rt;
    }
    return $t;
  }
  const P = async () => {
  };
  t.nextTick = P;
  async function W(v, M, ht) {
    let $t = Date.now();
    for (let It = 0; It < v; It++) {
      ht(It);
      const Ct = Date.now() - $t;
      Ct >= 0 && Ct < M || (await (0, t.nextTick)(), $t += Ct);
    }
  }
  function G(v) {
    if (typeof v != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(v));
  }
  function V(v) {
    return new TextDecoder().decode(v);
  }
  function E(v) {
    return typeof v == "string" && (v = G(v)), i(v), v;
  }
  function T(v) {
    return typeof v == "string" && (v = G(v)), i(v), v;
  }
  function N(...v) {
    let M = 0;
    for (let $t = 0; $t < v.length; $t++) {
      const It = v[$t];
      i(It), M += It.length;
    }
    const ht = new Uint8Array(M);
    for (let $t = 0, It = 0; $t < v.length; $t++) {
      const Ct = v[$t];
      ht.set(Ct, It), It += Ct.length;
    }
    return ht;
  }
  function B(v, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(v, M);
  }
  class nt {
  }
  t.Hash = nt;
  function j(v) {
    const M = ($t) => v().update(E($t)).digest(), ht = v();
    return M.outputLen = ht.outputLen, M.blockLen = ht.blockLen, M.create = () => v(), M;
  }
  function jt(v) {
    const M = ($t, It) => v(It).update(E($t)).digest(), ht = v({});
    return M.outputLen = ht.outputLen, M.blockLen = ht.blockLen, M.create = ($t) => v($t), M;
  }
  function dt(v) {
    const M = ($t, It) => v(It).update(E($t)).digest(), ht = v({});
    return M.outputLen = ht.outputLen, M.blockLen = ht.blockLen, M.create = ($t) => v($t), M;
  }
  t.wrapConstructor = j, t.wrapConstructorWithOpts = jt, t.wrapXOFConstructorWithOpts = dt;
  function ie(v = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(v));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(v));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(z0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = z0;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
    }
    update(s) {
      return (0, e.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, e.aexists)(this), (0, e.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = d, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (i, s, o) => new n(i, s).update(o).digest();
  t.hmac = r, t.hmac.create = (i, s) => new n(i, s);
})(j0);
const Zs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function R0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function nl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Us(t, ...e) {
  if (!R0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function H1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  nl(t.outputLen), nl(t.blockLen);
}
function rl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function G0(t, e) {
  Us(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function O1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function D1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ma(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function oa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function mn(t, e) {
  return t << 32 - e | t >>> e;
}
function F1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const pu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function gu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const K0 = pu ? (t) => t : (t) => gu(t), j1 = K0;
function V0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = gu(t[e]);
  return t;
}
const z1 = pu ? (t) => t : V0, q0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", R1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W0(t) {
  if (Us(t), q0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += R1[t[n]];
  return e;
}
const Zn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Hf(t) {
  if (t >= Zn._0 && t <= Zn._9)
    return t - Zn._0;
  if (t >= Zn.A && t <= Zn.F)
    return t - (Zn.A - 10);
  if (t >= Zn.a && t <= Zn.f)
    return t - (Zn.a - 10);
}
function G1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (q0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Hf(t.charCodeAt(s)), a = Hf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const X0 = async () => {
};
async function K1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await X0(), r += s);
  }
}
function yu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function V1(t) {
  return new TextDecoder().decode(t);
}
function So(t) {
  return typeof t == "string" && (t = yu(t)), Us(t), t;
}
function q1(t) {
  return typeof t == "string" && (t = yu(t)), Us(t), t;
}
function W1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    Us(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function X1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Y0 = class {
};
function qa(t) {
  const e = (r) => t().update(So(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Z0(t) {
  const e = (r, i) => t(i).update(So(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Q0(t) {
  const e = (r, i) => t(i).update(So(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Y1 = qa, Z1 = Z0, Q1 = Q0;
function J1(t = 32) {
  if (Zs && typeof Zs.getRandomValues == "function")
    return Zs.getRandomValues(new Uint8Array(t));
  if (Zs && typeof Zs.randomBytes == "function")
    return Uint8Array.from(Zs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Y0,
  abytes: Us,
  aexists: rl,
  ahash: H1,
  anumber: nl,
  aoutput: G0,
  asyncLoop: K1,
  byteSwap: gu,
  byteSwap32: V0,
  byteSwapIfBE: j1,
  bytesToHex: W0,
  bytesToUtf8: V1,
  checkOpts: X1,
  clean: ma,
  concatBytes: W1,
  createHasher: qa,
  createOptHasher: Z0,
  createView: oa,
  createXOFer: Q0,
  hexToBytes: G1,
  isBytes: R0,
  isLE: pu,
  kdfInputToBytes: q1,
  nextTick: X0,
  randomBytes: J1,
  rotl: F1,
  rotr: mn,
  swap32IfBE: z1,
  swap8IfBE: K0,
  toBytes: So,
  u32: D1,
  u8: O1,
  utf8ToBytes: yu,
  wrapConstructor: Y1,
  wrapConstructorWithOpts: Z1,
  wrapXOFConstructorWithOpts: Q1
}, Symbol.toStringTag, { value: "Module" }));
function em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function nm(t, e, n) {
  return t & e ^ ~t & n;
}
function rm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class sm extends Y0 {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    rl(this), e = So(e), Us(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = oa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    rl(this), G0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, ma(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    em(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = s, e.length = i, e.pos = a, i % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const mr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), im = /* @__PURE__ */ Uint32Array.from([
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
]), Sr = /* @__PURE__ */ new Uint32Array(64);
let wu = class extends sm {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = mr[0] | 0, this.B = mr[1] | 0, this.C = mr[2] | 0, this.D = mr[3] | 0, this.E = mr[4] | 0, this.F = mr[5] | 0, this.G = mr[6] | 0, this.H = mr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Sr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Sr[l - 15], h = Sr[l - 2], S = mn(y, 7) ^ mn(y, 18) ^ y >>> 3, x = mn(h, 17) ^ mn(h, 19) ^ h >>> 10;
      Sr[l] = x + Sr[l - 7] + S + Sr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = mn(a, 6) ^ mn(a, 11) ^ mn(a, 25), h = d + y + nm(a, c, u) + im[l] + Sr[l] | 0, x = (mn(r, 2) ^ mn(r, 13) ^ mn(r, 22)) + rm(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    ma(Sr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ma(this.buffer);
  }
}, J0 = class extends wu {
  constructor() {
    super(28), this.A = xr[0] | 0, this.B = xr[1] | 0, this.C = xr[2] | 0, this.D = xr[3] | 0, this.E = xr[4] | 0, this.F = xr[5] | 0, this.G = xr[6] | 0, this.H = xr[7] | 0;
  }
};
const om = /* @__PURE__ */ qa(() => new wu()), am = /* @__PURE__ */ qa(() => new J0()), cm = wu, tp = om, lm = J0, um = am, fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: lm,
  SHA256: cm,
  sha224: um,
  sha256: tp
}, Symbol.toStringTag, { value: "Module" })), Wa = /* @__PURE__ */ Da(fm), dm = /* @__PURE__ */ Da(bb);
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.joseToDer = mi.derToJose = void 0;
const ep = xo, np = Ue;
function vc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const hm = {
  ES256: vc(256),
  ES384: vc(384),
  ES512: vc(521)
};
function rp(t) {
  const e = hm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const xa = 128, sp = 0, pm = 32, gm = 16, ym = 2, ip = gm | pm | sp << 6, Sa = ym | sp << 6;
function op(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, ep.toByteArray)((0, np.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function wm(t, e) {
  const n = op(t), r = rp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== ip)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (xa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const y = r - c, h = r - d, S = new Uint8Array(y + c + h + d);
  for (o = 0; o < y; ++o)
    S[o] = 0;
  S.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const x = o; o < x + h; ++o)
    S[o] = 0;
  return S.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, np.escape)((0, ep.fromByteArray)(S));
}
mi.derToJose = wm;
function Of(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= xa && --r, r;
}
function bm(t, e) {
  t = op(t);
  const n = rp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Of(t, 0, n), s = Of(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < xa, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = ip, u ? d[l++] = c : (d[l++] = xa | 1, d[l++] = c & 255), d[l++] = Sa, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Sa, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
mi.joseToDer = bm;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.InvalidTokenError = ir.MissingParametersError = void 0;
class mm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
ir.MissingParametersError = mm;
class xm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
ir.InvalidTokenError = xm;
const Eo = /* @__PURE__ */ Da(tm);
Object.defineProperty(Ka, "__esModule", { value: !0 });
Ka.SECP256K1Client = void 0;
const Sm = j0, Em = Wa, aa = dm, Df = mi, Ff = ir, jf = Eo;
aa.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sm.hmac.create(Em.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class ap {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, jf.bytesToHex)(aa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Ff.MissingParametersError("a signing input hash and private key are all required");
    const i = aa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, jf.bytesToHex)(i);
    if (r === "jose")
      return (0, Df.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Df.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Ff.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return aa.verify(n, e, r, { strict: !1 });
  }
}
Ka.SECP256K1Client = ap;
ap.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ka;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ga);
var bs = {};
const Am = /* @__PURE__ */ Da(d0);
var vm = He && He.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.hashSha256Async = bs.hashSha256 = void 0;
const $m = Wa;
function cp(t) {
  return (0, $m.sha256)(t);
}
bs.hashSha256 = cp;
function Im(t) {
  return vm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Am;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(cp(t));
    }
  });
}
bs.hashSha256Async = Im;
var km = He && He.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.TokenSigner = bi.createUnsecuredToken = void 0;
const sl = Ue, zf = Ga, Lm = ir, Rf = bs;
function il(t, e) {
  const n = [], r = sl.encode(JSON.stringify(e));
  n.push(r);
  const i = sl.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function Cm(t) {
  return il(t, { typ: "JWT", alg: "none" }) + ".";
}
bi.createUnsecuredToken = Cm;
class Tm {
  constructor(e, n) {
    if (!(e && n))
      throw new Lm.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !zf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = zf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = il(e, i), o = (0, Rf.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return km(this, void 0, void 0, function* () {
      const i = this.header(r), s = il(e, i), o = yield (0, Rf.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [sl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
bi.TokenSigner = Tm;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
Xa.TokenVerifier = void 0;
const Bm = Ue, Gf = Ga, Mm = ir, Oo = bs;
class Nm {
  constructor(e, n) {
    if (!(e && n))
      throw new Mm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Gf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Gf.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), i = r[0] + "." + r[1], s = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Oo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Oo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Bm.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Oo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Oo.hashSha256)(r);
      return s(o);
    }
  }
}
Xa.TokenVerifier = Nm;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
Ya.decodeToken = void 0;
const Do = Ue;
function _m(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Do.decode(e[0])), r = JSON.parse(Do.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Do.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Do.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ya.decodeToken = _m;
(function(t) {
  var e = He && He.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = He && He.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(bi, t), n(Xa, t), n(Ya, t), n(ir, t), n(Ga, t);
})(Le);
function Um(t) {
  return `did:btc-addr:${t}`;
}
function Pm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Af("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Af('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function lp(t) {
  if (t)
    return Pm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Hm = "1.4.0";
function Om() {
  return A1();
}
function Dm(t, e, n, r = n0.slice(), i, s = xw().getTime(), o = {}) {
  const a = (h) => {
    const S = nu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Ew(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: Hm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Le.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = N0(u);
  return c.iss = Um(d), new Le.TokenSigner("ES256k", t).sign(c);
}
async function Kf(t, e) {
  const n = bo(Ht(e)), r = JSON.parse(n), i = await H0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Fm(t) {
  const e = Le.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Le.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function jm(t) {
  const e = Le.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = lp(e.iss);
  if (n.length === 1) {
    if (N0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zm(t) {
  const e = Le.decodeToken(t).payload;
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
function Rm(t) {
  const e = Le.decodeToken(t).payload;
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
function Gm(t) {
  const e = [
    Rm(t),
    zm(t),
    Fm(t),
    jm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Vf = "1.0.0";
class Kr {
  constructor(e) {
    this.version = Vf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Vf)
      throw new Yc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Kr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class up {
  constructor(e) {
    if (e) {
      const n = new Kr(e);
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
class qf extends up {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Kr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new r0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Kr({})), !0;
  }
}
class Wf extends up {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = ww, !localStorage.getItem(this.key)) {
      const r = new Kr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new r0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Kr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Kr({})), !0;
  }
}
var io;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(io || (io = {}));
var Ea;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ea || (Ea = {}));
io.Mainnet;
var nr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nr || (nr = {}));
var Dn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Dn || (Dn = {}));
nr.Mainnet;
const fp = {
  chainId: io.Mainnet,
  transactionVersion: nr.Mainnet,
  peerNetworkId: Ea.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Dn.MainnetSingleSig,
    multiSig: Dn.MainnetMultiSig
  },
  client: { baseUrl: s0 }
}, ol = {
  chainId: io.Testnet,
  transactionVersion: nr.Testnet,
  peerNetworkId: Ea.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Dn.TestnetSingleSig,
    multiSig: Dn.TestnetMultiSig
  },
  client: { baseUrl: i0 }
}, ca = {
  ...ol,
  addressVersion: { ...ol.addressVersion },
  magicBytes: "id",
  client: { baseUrl: o0 }
}, Km = {
  ...ca,
  addressVersion: { ...ca.addressVersion },
  client: { ...ca.client }
};
function Vm(t) {
  switch (t) {
    case "mainnet":
      return fp;
    case "testnet":
      return ol;
    case "devnet":
      return ca;
    case "mocknet":
      return Km;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function dp(t) {
  return typeof t == "string" ? Vm(t) : t;
}
var Xf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Yf || (Yf = {}));
var Sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Sn || (Sn = {}));
const $c = ["onChainOnly", "offChainOnly", "any"];
$c[0] + "", Sn.OnChainOnly, $c[1] + "", Sn.OffChainOnly, $c[2] + "", Sn.Any, Sn.OnChainOnly + "", Sn.OnChainOnly, Sn.OffChainOnly + "", Sn.OffChainOnly, Sn.Any + "", Sn.Any;
var Zf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Zf || (Zf = {}));
var Qf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Qf || (Qf = {}));
var Jf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Jf || (Jf = {}));
var er;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(er || (er = {}));
var td;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(td || (td = {}));
var ed;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ed || (ed = {}));
var nd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(nd || (nd = {}));
var rd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(rd || (rd = {}));
var sd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(sd || (sd = {}));
var id;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(id || (id = {}));
var od;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(od || (od = {}));
var ad;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ad || (ad = {}));
var cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(cd || (cd = {}));
function al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Wm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  al(t.outputLen), al(t.blockLen);
}
function Xm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ym(t, e) {
  hp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const is = {
  number: al,
  bool: qm,
  bytes: hp,
  hash: Wm,
  exists: Xm,
  output: Ym
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ic = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mn = (t, e) => t << 32 - e | t >>> e, Zm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bu(t) {
  if (typeof t == "string" && (t = Qm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let pp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ps(t) {
  const e = (r) => t().update(bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let gp = class extends pp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, is.hash(e);
    const r = bu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return is.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    is.exists(this), is.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const yp = (t, e, n) => new gp(t, e).update(n).digest();
yp.create = (t, e) => new gp(t, e);
function Jm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mu = class extends pp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ic(this.buffer);
  }
  update(e) {
    is.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = bu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ic(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    is.exists(this), is.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Jm(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ic(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const t2 = (t, e, n) => t & e ^ ~t & n, e2 = (t, e, n) => t & e ^ t & n ^ e & n, n2 = new Uint32Array([
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
]), Er = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ar = new Uint32Array(64);
let wp = class extends mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Er[0] | 0, this.B = Er[1] | 0, this.C = Er[2] | 0, this.D = Er[3] | 0, this.E = Er[4] | 0, this.F = Er[5] | 0, this.G = Er[6] | 0, this.H = Er[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ar[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Ar[l - 15], h = Ar[l - 2], S = Mn(y, 7) ^ Mn(y, 18) ^ y >>> 3, x = Mn(h, 17) ^ Mn(h, 19) ^ h >>> 10;
      Ar[l] = x + Ar[l - 7] + S + Ar[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Mn(a, 6) ^ Mn(a, 11) ^ Mn(a, 25), h = d + y + t2(a, c, u) + n2[l] + Ar[l] | 0, x = (Mn(r, 2) ^ Mn(r, 13) ^ Mn(r, 22)) + e2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Ar.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r2 = class extends wp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const bp = Ps(() => new wp());
Ps(() => new r2());
var Hs = {}, xu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Eo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const S = n.indexOf(o[h]) >> u;
        let x = 0;
        h !== 0 && (x = n.indexOf(o[h - 1]));
        const L = 1 + u, F = x % (1 << L) << 5 - L, H = t.c32[S + F];
        u = L, c.unshift(H);
      } else
        u = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let h = 0; h < y; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let S = 0; S < h; S++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = i;
  function s(o, a) {
    if (o = i(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let d = [], l = 0, y = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const F = (t.c32.indexOf(o[x]) << y) + l, H = n[F % 16];
      if (y += 1, l = F >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(H);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let x = 0; x < d.length && d[x] === "0"; x++)
      h++;
    d = d.slice(h - h % 2);
    let S = d.join("");
    for (let x = 0; x < u; x++)
      S = `00${S}`;
    if (a) {
      const x = a * 2 - S.length;
      for (let L = 0; L < x; L += 2)
        S = `00${S}`;
    }
    return S;
  }
  t.c32decode = s;
})(xu);
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
ms.c32checkDecode = ms.c32checkEncode = void 0;
const ld = Wa, ud = Eo, to = xu;
function mp(t) {
  const e = (0, ld.sha256)((0, ld.sha256)((0, ud.hexToBytes)(t)));
  return (0, ud.bytesToHex)(e.slice(0, 4));
}
function s2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = mp(`${n}${e}`), i = (0, to.c32encode)(`${e}${r}`);
  return `${to.c32[t]}${i}`;
}
ms.c32checkEncode = s2;
function i2(t) {
  t = (0, to.c32normalize)(t);
  const e = (0, to.c32decode)(t.slice(1)), n = t[0], r = to.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), mp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ms.c32checkDecode = i2;
var xp = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.decode = xi.encode = void 0;
const Aa = Wa, fd = Eo, Sp = L0, Ep = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function o2(t, e = "00") {
  const n = typeof t == "string" ? (0, fd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, fd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...r, ...n])));
  return Sp(Ep).encode([...r, ...n, ...i.slice(0, 4)]);
}
xi.encode = o2;
function a2(t) {
  const e = Sp(Ep).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
xi.decode = a2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ms, n = xi, r = Eo;
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
  const i = {};
  i[0] = t.versions.mainnet.p2pkh, i[5] = t.versions.mainnet.p2sh, i[111] = t.versions.testnet.p2pkh, i[196] = t.versions.testnet.p2sh;
  const s = {};
  s[t.versions.mainnet.p2pkh] = 0, s[t.versions.mainnet.p2sh] = 5, s[t.versions.testnet.p2pkh] = 111, s[t.versions.testnet.p2sh] = 196;
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
    const y = n.decode(d), h = (0, r.bytesToHex)(y.data), S = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let x;
    return l < 0 ? (x = S, i[S] !== void 0 && (x = i[S])) : x = l, o(x, h);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), h = y[0], S = y[1];
    let x;
    l < 0 ? (x = h, s[h] !== void 0 && (x = s[h])) : x = l;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(S, L);
  }
  t.c32ToB58 = u;
})(xp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = xu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ms;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = xp;
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
})(Hs);
function c2(t, e) {
  switch (e = dp(e ?? fp), t) {
    case er.P2PKH:
      switch (e.transactionVersion) {
        case nr.Mainnet:
          return Dn.MainnetSingleSig;
        case nr.Testnet:
          return Dn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case er.P2SH:
    case er.P2SHNonSequential:
    case er.P2WPKH:
    case er.P2WSH:
    case er.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case nr.Mainnet:
          return Dn.MainnetMultiSig;
        case nr.Testnet:
          return Dn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const l2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ap = Uint8Array.from({ length: 16 }, (t, e) => e), u2 = Ap.map((t) => (9 * t + 5) % 16);
let Su = [Ap], Eu = [u2];
for (let t = 0; t < 4; t++)
  for (let e of [Su, Eu])
    e.push(e[t].map((n) => l2[n]));
const vp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f2 = Su.map((t, e) => t.map((n) => vp[e][n])), d2 = Eu.map((t, e) => t.map((n) => vp[e][n])), h2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fo = (t, e) => t << e | t >>> 32 - e;
function dd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jo = new Uint32Array(16);
let g2 = class extends mu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      jo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const S = 4 - h, x = h2[h], L = p2[h], F = Su[h], H = Eu[h], p = f2[h], I = d2[h];
      for (let $ = 0; $ < 16; $++) {
        const P = Fo(r + dd(h, s, a, u) + jo[F[$]] + x, p[$]) + l | 0;
        r = l, l = u, u = Fo(a, 10) | 0, a = s, s = P;
      }
      for (let $ = 0; $ < 16; $++) {
        const P = Fo(i + dd(S, o, c, d) + jo[H[$]] + L, I[$]) + y | 0;
        i = y, y = d, d = Fo(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const y2 = Ps(() => new g2()), zo = BigInt(2 ** 32 - 1), cl = BigInt(32);
function $p(t, e = !1) {
  return e ? { h: Number(t & zo), l: Number(t >> cl & zo) } : { h: Number(t >> cl & zo) | 0, l: Number(t & zo) | 0 };
}
function w2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = $p(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const b2 = (t, e) => BigInt(t >>> 0) << cl | BigInt(e >>> 0), m2 = (t, e, n) => t >>> n, x2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t >>> n | e << 32 - n, E2 = (t, e, n) => t << 32 - n | e >>> n, A2 = (t, e, n) => t << 64 - n | e >>> n - 32, v2 = (t, e, n) => t >>> n - 32 | e << 64 - n, $2 = (t, e) => e, I2 = (t, e) => t, k2 = (t, e, n) => t << n | e >>> 32 - n, L2 = (t, e, n) => e << n | t >>> 32 - n, C2 = (t, e, n) => e << n - 32 | t >>> 64 - n, T2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function B2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const M2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), N2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), U2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, P2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), H2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: $p,
  split: w2,
  toBig: b2,
  shrSH: m2,
  shrSL: x2,
  rotrSH: S2,
  rotrSL: E2,
  rotrBH: A2,
  rotrBL: v2,
  rotr32H: $2,
  rotr32L: I2,
  rotlSH: k2,
  rotlSL: L2,
  rotlBH: C2,
  rotlBL: T2,
  add: B2,
  add3L: M2,
  add3H: N2,
  add4L: _2,
  add4H: U2,
  add5H: H2,
  add5L: P2
}, [O2, D2] = mt.split([
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
].map((t) => BigInt(t))), vr = new Uint32Array(80), $r = new Uint32Array(80);
let Za = class extends mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      vr[p] = e.getUint32(n), $r[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const I = vr[p - 15] | 0, $ = $r[p - 15] | 0, P = mt.rotrSH(I, $, 1) ^ mt.rotrSH(I, $, 8) ^ mt.shrSH(I, $, 7), W = mt.rotrSL(I, $, 1) ^ mt.rotrSL(I, $, 8) ^ mt.shrSL(I, $, 7), G = vr[p - 2] | 0, V = $r[p - 2] | 0, E = mt.rotrSH(G, V, 19) ^ mt.rotrBH(G, V, 61) ^ mt.shrSH(G, V, 6), T = mt.rotrSL(G, V, 19) ^ mt.rotrBL(G, V, 61) ^ mt.shrSL(G, V, 6), N = mt.add4L(W, T, $r[p - 7], $r[p - 16]), B = mt.add4H(N, P, E, vr[p - 7], vr[p - 16]);
      vr[p] = B | 0, $r[p] = N | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: S, Gh: x, Gl: L, Hh: F, Hl: H } = this;
    for (let p = 0; p < 80; p++) {
      const I = mt.rotrSH(l, y, 14) ^ mt.rotrSH(l, y, 18) ^ mt.rotrBH(l, y, 41), $ = mt.rotrSL(l, y, 14) ^ mt.rotrSL(l, y, 18) ^ mt.rotrBL(l, y, 41), P = l & h ^ ~l & x, W = y & S ^ ~y & L, G = mt.add5L(H, $, W, D2[p], $r[p]), V = mt.add5H(G, F, I, P, O2[p], vr[p]), E = G | 0, T = mt.rotrSH(r, i, 28) ^ mt.rotrBH(r, i, 34) ^ mt.rotrBH(r, i, 39), N = mt.rotrSL(r, i, 28) ^ mt.rotrBL(r, i, 34) ^ mt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      F = x | 0, H = L | 0, x = h | 0, L = S | 0, h = l | 0, S = y | 0, { h: l, l: y } = mt.add(u | 0, d | 0, V | 0, E | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const j = mt.add3L(E, N, nt);
      r = mt.add3H(j, V, T, B), i = j | 0;
    }
    ({ h: r, l: i } = mt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = mt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = mt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: S } = mt.add(this.Fh | 0, this.Fl | 0, h | 0, S | 0), { h: x, l: L } = mt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: F, l: H } = mt.add(this.Hh | 0, this.Hl | 0, F | 0, H | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, S, x, L, F, H);
  }
  roundClean() {
    vr.fill(0), $r.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, F2 = class extends Za {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, j2 = class extends Za {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z2 = class extends Za {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ps(() => new Za());
Ps(() => new F2());
Ps(() => new j2());
Ps(() => new z2());
var va = { exports: {} };
va.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", h = "[object Number]", S = "[object Object]", x = "[object Promise]", L = "[object RegExp]", F = "[object Set]", H = "[object String]", p = "[object Symbol]", I = "[object WeakMap]", $ = "[object ArrayBuffer]", P = "[object DataView]", W = "[object Float32Array]", G = "[object Float64Array]", V = "[object Int8Array]", E = "[object Int16Array]", T = "[object Int32Array]", N = "[object Uint8Array]", B = "[object Uint8ClampedArray]", nt = "[object Uint16Array]", j = "[object Uint32Array]", jt = /[\\^$.*+?()[\]{}|]/g, dt = /\w*$/, ie = /^\[object .+?Constructor\]$/, v = /^(?:0|[1-9]\d*)$/, M = {};
  M[s] = M[o] = M[$] = M[P] = M[a] = M[c] = M[W] = M[G] = M[V] = M[E] = M[T] = M[y] = M[h] = M[S] = M[L] = M[F] = M[H] = M[p] = M[N] = M[B] = M[nt] = M[j] = !0, M[u] = M[d] = M[I] = !1;
  var ht = typeof He == "object" && He && He.Object === Object && He, $t = typeof self == "object" && self && self.Object === Object && self, It = ht || $t || Function("return this")(), Ct = e && !e.nodeType && e, zt = Ct && !0 && t && !t.nodeType && t, Rt = zt && zt.exports === Ct;
  function Ot(g, k) {
    return g.set(k[0], k[1]), g;
  }
  function Qt(g, k) {
    return g.add(k), g;
  }
  function Yt(g, k) {
    for (var _ = -1, st = g ? g.length : 0; ++_ < st && k(g[_], _, g) !== !1; )
      ;
    return g;
  }
  function Dt(g, k) {
    for (var _ = -1, st = k.length, Ie = g.length; ++_ < st; )
      g[Ie + _] = k[_];
    return g;
  }
  function Se(g, k, _, st) {
    for (var Ie = -1, ze = g ? g.length : 0; ++Ie < ze; )
      _ = k(_, g[Ie], Ie, g);
    return _;
  }
  function Ee(g, k) {
    for (var _ = -1, st = Array(g); ++_ < g; )
      st[_] = k(_);
    return st;
  }
  function be(g, k) {
    return g == null ? void 0 : g[k];
  }
  function sn(g) {
    var k = !1;
    if (g != null && typeof g.toString != "function")
      try {
        k = !!(g + "");
      } catch {
      }
    return k;
  }
  function Me(g) {
    var k = -1, _ = Array(g.size);
    return g.forEach(function(st, Ie) {
      _[++k] = [Ie, st];
    }), _;
  }
  function C(g, k) {
    return function(_) {
      return g(k(_));
    };
  }
  function q(g) {
    var k = -1, _ = Array(g.size);
    return g.forEach(function(st) {
      _[++k] = st;
    }), _;
  }
  var D = Array.prototype, et = Function.prototype, ot = Object.prototype, Mt = It["__core-js_shared__"], Tt = function() {
    var g = /[^.]+$/.exec(Mt && Mt.keys && Mt.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Nt = et.toString, ut = ot.hasOwnProperty, wt = ot.toString, w = RegExp(
    "^" + Nt.call(ut).replace(jt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), m = Rt ? It.Buffer : void 0, f = It.Symbol, U = It.Uint8Array, rt = C(Object.getPrototypeOf, Object), Z = Object.create, _t = ot.propertyIsEnumerable, fe = D.splice, ge = Object.getOwnPropertySymbols, ye = m ? m.isBuffer : void 0, yn = C(Object.keys, Object), on = at(It, "DataView"), wn = at(It, "Map"), Wn = at(It, "Promise"), me = at(It, "Set"), cr = at(It, "WeakMap"), We = at(Object, "create"), gt = ts(on), kt = ts(wn), oe = ts(Wn), an = ts(me), Pt = ts(cr), Ae = f ? f.prototype : void 0, lr = Ae ? Ae.valueOf : void 0;
  function De(g) {
    var k = -1, _ = g ? g.length : 0;
    for (this.clear(); ++k < _; ) {
      var st = g[k];
      this.set(st[0], st[1]);
    }
  }
  function Xn() {
    this.__data__ = We ? We(null) : {};
  }
  function Fe(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function cn(g) {
    var k = this.__data__;
    if (We) {
      var _ = k[g];
      return _ === r ? void 0 : _;
    }
    return ut.call(k, g) ? k[g] : void 0;
  }
  function je(g) {
    var k = this.__data__;
    return We ? k[g] !== void 0 : ut.call(k, g);
  }
  function ur(g, k) {
    var _ = this.__data__;
    return _[g] = We && k === void 0 ? r : k, this;
  }
  De.prototype.clear = Xn, De.prototype.delete = Fe, De.prototype.get = cn, De.prototype.has = je, De.prototype.set = ur;
  function Ce(g) {
    var k = -1, _ = g ? g.length : 0;
    for (this.clear(); ++k < _; ) {
      var st = g[k];
      this.set(st[0], st[1]);
    }
  }
  function zs() {
    this.__data__ = [];
  }
  function Pi(g) {
    var k = this.__data__, _ = ae(k, g);
    if (_ < 0)
      return !1;
    var st = k.length - 1;
    return _ == st ? k.pop() : fe.call(k, _, 1), !0;
  }
  function Rs(g) {
    var k = this.__data__, _ = ae(k, g);
    return _ < 0 ? void 0 : k[_][1];
  }
  function Gs(g) {
    return ae(this.__data__, g) > -1;
  }
  function Ks(g, k) {
    var _ = this.__data__, st = ae(_, g);
    return st < 0 ? _.push([g, k]) : _[st][1] = k, this;
  }
  Ce.prototype.clear = zs, Ce.prototype.delete = Pi, Ce.prototype.get = Rs, Ce.prototype.has = Gs, Ce.prototype.set = Ks;
  function ve(g) {
    var k = -1, _ = g ? g.length : 0;
    for (this.clear(); ++k < _; ) {
      var st = g[k];
      this.set(st[0], st[1]);
    }
  }
  function Vs() {
    this.__data__ = {
      hash: new De(),
      map: new (wn || Ce)(),
      string: new De()
    };
  }
  function Yr(g) {
    return K(this, g).delete(g);
  }
  function qs(g) {
    return K(this, g).get(g);
  }
  function fr(g) {
    return K(this, g).has(g);
  }
  function dr(g, k) {
    return K(this, g).set(g, k), this;
  }
  ve.prototype.clear = Vs, ve.prototype.delete = Yr, ve.prototype.get = qs, ve.prototype.has = fr, ve.prototype.set = dr;
  function Xe(g) {
    this.__data__ = new Ce(g);
  }
  function hr() {
    this.__data__ = new Ce();
  }
  function Zr(g) {
    return this.__data__.delete(g);
  }
  function pr(g) {
    return this.__data__.get(g);
  }
  function Qr(g) {
    return this.__data__.has(g);
  }
  function z(g, k) {
    var _ = this.__data__;
    if (_ instanceof Ce) {
      var st = _.__data__;
      if (!wn || st.length < n - 1)
        return st.push([g, k]), this;
      _ = this.__data__ = new ve(st);
    }
    return _.set(g, k), this;
  }
  Xe.prototype.clear = hr, Xe.prototype.delete = Zr, Xe.prototype.get = pr, Xe.prototype.has = Qr, Xe.prototype.set = z;
  function J(g, k) {
    var _ = yc(g) || Hy(g) ? Ee(g.length, String) : [], st = _.length, Ie = !!st;
    for (var ze in g)
      ut.call(g, ze) && !(Ie && (ze == "length" || Ne(ze, st))) && _.push(ze);
    return _;
  }
  function Jt(g, k, _) {
    var st = g[k];
    (!(ut.call(g, k) && hf(st, _)) || _ === void 0 && !(k in g)) && (g[k] = _);
  }
  function ae(g, k) {
    for (var _ = g.length; _--; )
      if (hf(g[_][0], k))
        return _;
    return -1;
  }
  function Jr(g, k) {
    return g && O(k, wc(k), g);
  }
  function Cn(g, k, _, st, Ie, ze, Yn) {
    var Re;
    if (st && (Re = ze ? st(g, Ie, ze, Yn) : st(g)), Re !== void 0)
      return Re;
    if (!Lo(g))
      return g;
    var yf = yc(g);
    if (yf) {
      if (Re = Gt(g), !k)
        return A(g, Re);
    } else {
      var Xs = lt(g), wf = Xs == d || Xs == l;
      if (Dy(g))
        return Ws(g, k);
      if (Xs == S || Xs == s || wf && !ze) {
        if (sn(g))
          return ze ? g : {};
        if (Re = $e(wf ? {} : g), !k)
          return Y(g, Jr(Re, g));
      } else {
        if (!M[Xs])
          return ze ? g : {};
        Re = ln(g, Xs, Cn, k);
      }
    }
    Yn || (Yn = new Xe());
    var bf = Yn.get(g);
    if (bf)
      return bf;
    if (Yn.set(g, Re), !yf)
      var mf = _ ? tt(g) : wc(g);
    return Yt(mf || g, function(bc, Co) {
      mf && (Co = bc, bc = g[Co]), Jt(Re, Co, Cn(bc, k, _, st, Co, g, Yn));
    }), Re;
  }
  function Zt(g) {
    return Lo(g) ? Z(g) : {};
  }
  function Hi(g, k, _) {
    var st = k(g);
    return yc(g) ? st : Dt(st, _(g));
  }
  function Oi(g) {
    return wt.call(g);
  }
  function bn(g) {
    if (!Lo(g) || ko(g))
      return !1;
    var k = gf(g) || sn(g) ? w : ie;
    return k.test(ts(g));
  }
  function Di(g) {
    if (!df(g))
      return yn(g);
    var k = [];
    for (var _ in Object(g))
      ut.call(g, _) && _ != "constructor" && k.push(_);
    return k;
  }
  function Ws(g, k) {
    if (k)
      return g.slice();
    var _ = new g.constructor(g.length);
    return g.copy(_), _;
  }
  function Fi(g) {
    var k = new g.constructor(g.byteLength);
    return new U(k).set(new U(g)), k;
  }
  function ji(g, k) {
    var _ = k ? Fi(g.buffer) : g.buffer;
    return new g.constructor(_, g.byteOffset, g.byteLength);
  }
  function hc(g, k, _) {
    var st = k ? _(Me(g), !0) : Me(g);
    return Se(st, Ot, new g.constructor());
  }
  function pc(g) {
    var k = new g.constructor(g.source, dt.exec(g));
    return k.lastIndex = g.lastIndex, k;
  }
  function zi(g, k, _) {
    var st = k ? _(q(g), !0) : q(g);
    return Se(st, Qt, new g.constructor());
  }
  function gc(g) {
    return lr ? Object(lr.call(g)) : {};
  }
  function b(g, k) {
    var _ = k ? Fi(g.buffer) : g.buffer;
    return new g.constructor(_, g.byteOffset, g.length);
  }
  function A(g, k) {
    var _ = -1, st = g.length;
    for (k || (k = Array(st)); ++_ < st; )
      k[_] = g[_];
    return k;
  }
  function O(g, k, _, st) {
    _ || (_ = {});
    for (var Ie = -1, ze = k.length; ++Ie < ze; ) {
      var Yn = k[Ie], Re = void 0;
      Jt(_, Yn, Re === void 0 ? g[Yn] : Re);
    }
    return _;
  }
  function Y(g, k) {
    return O(g, pt(g), k);
  }
  function tt(g) {
    return Hi(g, wc, pt);
  }
  function K(g, k) {
    var _ = g.__data__;
    return Tn(k) ? _[typeof k == "string" ? "string" : "hash"] : _.map;
  }
  function at(g, k) {
    var _ = be(g, k);
    return bn(_) ? _ : void 0;
  }
  var pt = ge ? C(ge, Object) : zy, lt = Oi;
  (on && lt(new on(new ArrayBuffer(1))) != P || wn && lt(new wn()) != y || Wn && lt(Wn.resolve()) != x || me && lt(new me()) != F || cr && lt(new cr()) != I) && (lt = function(g) {
    var k = wt.call(g), _ = k == S ? g.constructor : void 0, st = _ ? ts(_) : void 0;
    if (st)
      switch (st) {
        case gt:
          return P;
        case kt:
          return y;
        case oe:
          return x;
        case an:
          return F;
        case Pt:
          return I;
      }
    return k;
  });
  function Gt(g) {
    var k = g.length, _ = g.constructor(k);
    return k && typeof g[0] == "string" && ut.call(g, "index") && (_.index = g.index, _.input = g.input), _;
  }
  function $e(g) {
    return typeof g.constructor == "function" && !df(g) ? Zt(rt(g)) : {};
  }
  function ln(g, k, _, st) {
    var Ie = g.constructor;
    switch (k) {
      case $:
        return Fi(g);
      case a:
      case c:
        return new Ie(+g);
      case P:
        return ji(g, st);
      case W:
      case G:
      case V:
      case E:
      case T:
      case N:
      case B:
      case nt:
      case j:
        return b(g, st);
      case y:
        return hc(g, st, _);
      case h:
      case H:
        return new Ie(g);
      case L:
        return pc(g);
      case F:
        return zi(g, st, _);
      case p:
        return gc(g);
    }
  }
  function Ne(g, k) {
    return k = k ?? i, !!k && (typeof g == "number" || v.test(g)) && g > -1 && g % 1 == 0 && g < k;
  }
  function Tn(g) {
    var k = typeof g;
    return k == "string" || k == "number" || k == "symbol" || k == "boolean" ? g !== "__proto__" : g === null;
  }
  function ko(g) {
    return !!Tt && Tt in g;
  }
  function df(g) {
    var k = g && g.constructor, _ = typeof k == "function" && k.prototype || ot;
    return g === _;
  }
  function ts(g) {
    if (g != null) {
      try {
        return Nt.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Py(g) {
    return Cn(g, !0, !0);
  }
  function hf(g, k) {
    return g === k || g !== g && k !== k;
  }
  function Hy(g) {
    return Oy(g) && ut.call(g, "callee") && (!_t.call(g, "callee") || wt.call(g) == s);
  }
  var yc = Array.isArray;
  function pf(g) {
    return g != null && Fy(g.length) && !gf(g);
  }
  function Oy(g) {
    return jy(g) && pf(g);
  }
  var Dy = ye || Ry;
  function gf(g) {
    var k = Lo(g) ? wt.call(g) : "";
    return k == d || k == l;
  }
  function Fy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function Lo(g) {
    var k = typeof g;
    return !!g && (k == "object" || k == "function");
  }
  function jy(g) {
    return !!g && typeof g == "object";
  }
  function wc(g) {
    return pf(g) ? J(g) : Di(g);
  }
  function zy() {
    return [];
  }
  function Ry() {
    return !1;
  }
  t.exports = Py;
})(va, va.exports);
var R2 = va.exports;
const Ip = /* @__PURE__ */ Qh(R2);
var ll;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ll || (ll = {}));
function G2(t, e) {
  return { type: ll.Address, version: t, hash160: e };
}
function K2(t) {
  return Hs.c32address(t.version, t.hash160);
}
const V2 = (t) => y2(bp(t)), q2 = (t) => ct(V2(t));
ue.hmacSha256Sync = (t, ...e) => {
  const n = yp.create(bp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function W2(t, e = "mainnet") {
  e = dp(e), t = typeof t == "string" ? Ht(t) : t;
  const n = c2(er.P2PKH, e), r = G2(n, q2(t));
  return K2(r);
}
function X2(t, e) {
  const n = Le.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = W2(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Le.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Y2(t, e = null) {
  let n;
  e ? n = X2(t, e) : n = Le.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const hd = "_blockstackDidCheckEchoReply", Z2 = "echoReply", Q2 = "authContinuation";
function J2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[hd];
  if (typeof e == "boolean")
    return e;
  const n = J2(t.location.search), r = n[Z2];
  if (r) {
    t[hd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[Q2];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class ul {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new a0();
    else
      throw new mw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Wf(e.sessionOptions) : this.store = new Wf() : e ? this.store = new qf(e.sessionOptions) : this.store = new qf();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Sw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Yc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Dm(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Om();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = nu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tx())
        return ri.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ri.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Gw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new To("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Le.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gm(e))
      throw new To("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (xc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Kf(i, s.private_key);
          } catch {
            if (ri.warn("Failed decryption of appPrivateKey, will try to use as given"), !ue.isValidPrivateKey(s.private_key))
              throw new To("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Kf(i, c);
          } catch {
            ri.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new To("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Nw, d;
    xc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), xc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: lp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = s.profile_url;
    if (!l.profile && y) {
      const h = await n(y);
      if (!h.ok)
        l.profile = Object.assign({}, yw);
      else {
        const S = await h.text(), x = JSON.parse(S);
        l.profile = Y2(x[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Yc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), N1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
ul.prototype.makeAuthRequest = ul.prototype.makeAuthRequestToken;
const ex = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], nx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ex(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!Qa(r.id));
  return e.concat(n);
}, Qa = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), kp = "STX_PROVIDER", xs = () => typeof window > "u" ? null : window.localStorage.getItem(kp), rx = (t) => {
  typeof window < "u" && window.localStorage.setItem(kp, t);
}, sx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ix(t, e) {
  const n = {};
  return Object.assign(n, sx, e), await fetch(t, n);
}
function ox(t) {
  let e = ix, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ax(...t) {
  const { fetchLib: e, middlewares: n } = ox(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var Si;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Si || (Si = {}));
var Ss;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ss || (Ss = {}));
var pd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(pd || (pd = {}));
const cx = "https://api.mainnet.hiro.so", lx = "https://api.testnet.hiro.so", ux = "http://localhost:3999", fx = ["mainnet", "testnet", "devnet", "mocknet"];
class Es {
  constructor(e) {
    this.version = Ss.Mainnet, this.chainId = Si.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ss.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ax();
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
Es.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new fl();
    case "testnet":
      return new dl();
    case "devnet":
      return new dx();
    case "mocknet":
      return new Lp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fx.join(", ")}`);
  }
};
Es.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Es.fromName(t);
class fl extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Mainnet, this.chainId = Si.Mainnet;
  }
}
class dl extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Testnet, this.chainId = Si.Testnet;
  }
}
class Lp extends Es {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ss.Testnet, this.chainId = Si.Testnet;
  }
}
const dx = Lp;
var As;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(As || (As = {}));
var $a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($a || ($a = {}));
As.Mainnet;
var vs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vs || (vs = {}));
var $s;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})($s || ($s = {}));
vs.Mainnet;
const hx = {
  chainId: As.Mainnet,
  transactionVersion: vs.Mainnet,
  peerNetworkId: $a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: $s.MainnetSingleSig,
    multiSig: $s.MainnetMultiSig
  },
  client: { baseUrl: s0 }
}, hl = {
  chainId: As.Testnet,
  transactionVersion: vs.Testnet,
  peerNetworkId: $a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: $s.TestnetSingleSig,
    multiSig: $s.TestnetMultiSig
  },
  client: { baseUrl: i0 }
}, la = {
  ...hl,
  addressVersion: { ...hl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: o0 }
}, px = {
  ...la,
  addressVersion: { ...la.addressVersion },
  client: { ...la.client }
};
function gx(t) {
  switch (t) {
    case "mainnet":
      return hx;
    case "testnet":
      return hl;
    case "devnet":
      return la;
    case "mocknet":
      return px;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yx(t) {
  return typeof t == "string" ? gx(t) : t;
}
function wx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const gd = /* @__PURE__ */ new Map();
function Cp(t, e) {
  const n = gd.get(t);
  if (n !== void 0)
    return n(e);
  const r = wx(t);
  return gd.set(t, r), Cp(t, e);
}
let Xt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Ht(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Fw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Ow(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Pw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ct(n);
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
    if (Cp(e, r))
      return r;
    throw n(r);
  }
};
const bx = 128, mx = 128, Tp = 16, fs = 32, pl = 80, Ja = 65, xx = 32, Sx = 64, Ia = 34, Ex = 1 + 16 * 1024 * 1024, Ax = 165, vx = 16, $x = 16, Ix = 20, kx = $x + 2 + Ix, Lx = kx + 4, Cx = Ex + (Ax + vx * Lx);
var Kt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kt || (Kt = {}));
var gl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(gl || (gl = {}));
var Ze;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ze || (Ze = {}));
const kc = ["onChainOnly", "offChainOnly", "any"];
kc[0] + "", Ze.OnChainOnly, kc[1] + "", Ze.OffChainOnly, kc[2] + "", Ze.Any, Ze.OnChainOnly + "", Ze.OnChainOnly, Ze.OffChainOnly + "", Ze.OffChainOnly, Ze.Any + "", Ze.Any;
var ka;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ka || (ka = {}));
var te;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(te || (te = {}));
var ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ce || (ce = {}));
var qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qt || (qt = {}));
var re;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(re || (re = {}));
var eo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(eo || (eo = {}));
var yl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(yl || (yl = {}));
var wl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(wl || (wl = {}));
var Pe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Pe || (Pe = {}));
var yd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yd || (yd = {}));
var bl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bl || (bl = {}));
var An;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(An || (An = {}));
var wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(wd || (wd = {}));
let tc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, si = class extends tc {
  constructor(e) {
    super(e);
  }
}, _e = class extends tc {
  constructor(e) {
    super(e);
  }
}, La = class extends tc {
  constructor(e) {
    super(e);
  }
}, os = class extends tc {
  constructor(e) {
    super(e);
  }
};
function ml(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Tx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Bp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Bx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ml(t.outputLen), ml(t.blockLen);
}
function Mx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Nx(t, e) {
  Bp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const as = {
  number: ml,
  bool: Tx,
  bytes: Bp,
  hash: Bx,
  exists: Mx,
  output: Nx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Lc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Nn = (t, e) => t << 32 - e | t >>> e, _x = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_x)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ux(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Au(t) {
  if (typeof t == "string" && (t = Ux(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Mp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Os(t) {
  const e = (r) => t().update(Au(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Np = class extends Mp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, as.hash(e);
    const r = Au(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return as.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    as.exists(this), as.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const _p = (t, e, n) => new Np(t, e).update(n).digest();
_p.create = (t, e) => new Np(t, e);
function Px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let vu = class extends Mp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Lc(this.buffer);
  }
  update(e) {
    as.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Au(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Lc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    as.exists(this), as.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Px(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Lc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const Hx = (t, e, n) => t & e ^ ~t & n, Ox = (t, e, n) => t & e ^ t & n ^ e & n, Dx = new Uint32Array([
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
]), Ir = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), kr = new Uint32Array(64);
let Up = class extends vu {
  constructor() {
    super(64, 32, 8, !1), this.A = Ir[0] | 0, this.B = Ir[1] | 0, this.C = Ir[2] | 0, this.D = Ir[3] | 0, this.E = Ir[4] | 0, this.F = Ir[5] | 0, this.G = Ir[6] | 0, this.H = Ir[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = kr[l - 15], h = kr[l - 2], S = Nn(y, 7) ^ Nn(y, 18) ^ y >>> 3, x = Nn(h, 17) ^ Nn(h, 19) ^ h >>> 10;
      kr[l] = x + kr[l - 7] + S + kr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Nn(a, 6) ^ Nn(a, 11) ^ Nn(a, 25), h = d + y + Hx(a, c, u) + Dx[l] + kr[l] | 0, x = (Nn(r, 2) ^ Nn(r, 13) ^ Nn(r, 22)) + Ox(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Fx = class extends Up {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $u = Os(() => new Up());
Os(() => new Fx());
const jx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Pp = Uint8Array.from({ length: 16 }, (t, e) => e), zx = Pp.map((t) => (9 * t + 5) % 16);
let Iu = [Pp], ku = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [Iu, ku])
    e.push(e[t].map((n) => jx[n]));
const Hp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = Iu.map((t, e) => t.map((n) => Hp[e][n])), Gx = ku.map((t, e) => t.map((n) => Hp[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ro = (t, e) => t << e | t >>> 32 - e;
function bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Go = new Uint32Array(16);
let qx = class extends vu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const S = 4 - h, x = Kx[h], L = Vx[h], F = Iu[h], H = ku[h], p = Rx[h], I = Gx[h];
      for (let $ = 0; $ < 16; $++) {
        const P = Ro(r + bd(h, s, a, u) + Go[F[$]] + x, p[$]) + l | 0;
        r = l, l = u, u = Ro(a, 10) | 0, a = s, s = P;
      }
      for (let $ = 0; $ < 16; $++) {
        const P = Ro(i + bd(S, o, c, d) + Go[H[$]] + L, I[$]) + y | 0;
        i = y, y = d, d = Ro(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wx = Os(() => new qx()), Ko = BigInt(2 ** 32 - 1), xl = BigInt(32);
function Op(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> xl & Ko) } : { h: Number(t >> xl & Ko) | 0, l: Number(t & Ko) | 0 };
}
function Xx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Op(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Yx = (t, e) => BigInt(t >>> 0) << xl | BigInt(e >>> 0), Zx = (t, e, n) => t >>> n, Qx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, tS = (t, e, n) => t << 32 - n | e >>> n, eS = (t, e, n) => t << 64 - n | e >>> n - 32, nS = (t, e, n) => t >>> n - 32 | e << 64 - n, rS = (t, e) => e, sS = (t, e) => t, iS = (t, e, n) => t << n | e >>> 32 - n, oS = (t, e, n) => e << n | t >>> 32 - n, aS = (t, e, n) => e << n - 32 | t >>> 64 - n, cS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function lS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const uS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, dS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, pS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), gS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: Op,
  split: Xx,
  toBig: Yx,
  shrSH: Zx,
  shrSL: Qx,
  rotrSH: Jx,
  rotrSL: tS,
  rotrBH: eS,
  rotrBL: nS,
  rotr32H: rS,
  rotr32L: sS,
  rotlSH: iS,
  rotlSL: oS,
  rotlBH: aS,
  rotlBL: cS,
  add: lS,
  add3L: uS,
  add3H: fS,
  add4L: dS,
  add4H: hS,
  add5H: gS,
  add5L: pS
}, [yS, wS] = xt.split([
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
].map((t) => BigInt(t))), Lr = new Uint32Array(80), Cr = new Uint32Array(80);
let ec = class extends vu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Lr[p] = e.getUint32(n), Cr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const I = Lr[p - 15] | 0, $ = Cr[p - 15] | 0, P = xt.rotrSH(I, $, 1) ^ xt.rotrSH(I, $, 8) ^ xt.shrSH(I, $, 7), W = xt.rotrSL(I, $, 1) ^ xt.rotrSL(I, $, 8) ^ xt.shrSL(I, $, 7), G = Lr[p - 2] | 0, V = Cr[p - 2] | 0, E = xt.rotrSH(G, V, 19) ^ xt.rotrBH(G, V, 61) ^ xt.shrSH(G, V, 6), T = xt.rotrSL(G, V, 19) ^ xt.rotrBL(G, V, 61) ^ xt.shrSL(G, V, 6), N = xt.add4L(W, T, Cr[p - 7], Cr[p - 16]), B = xt.add4H(N, P, E, Lr[p - 7], Lr[p - 16]);
      Lr[p] = B | 0, Cr[p] = N | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: S, Gh: x, Gl: L, Hh: F, Hl: H } = this;
    for (let p = 0; p < 80; p++) {
      const I = xt.rotrSH(l, y, 14) ^ xt.rotrSH(l, y, 18) ^ xt.rotrBH(l, y, 41), $ = xt.rotrSL(l, y, 14) ^ xt.rotrSL(l, y, 18) ^ xt.rotrBL(l, y, 41), P = l & h ^ ~l & x, W = y & S ^ ~y & L, G = xt.add5L(H, $, W, wS[p], Cr[p]), V = xt.add5H(G, F, I, P, yS[p], Lr[p]), E = G | 0, T = xt.rotrSH(r, i, 28) ^ xt.rotrBH(r, i, 34) ^ xt.rotrBH(r, i, 39), N = xt.rotrSL(r, i, 28) ^ xt.rotrBL(r, i, 34) ^ xt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      F = x | 0, H = L | 0, x = h | 0, L = S | 0, h = l | 0, S = y | 0, { h: l, l: y } = xt.add(u | 0, d | 0, V | 0, E | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const j = xt.add3L(E, N, nt);
      r = xt.add3H(j, V, T, B), i = j | 0;
    }
    ({ h: r, l: i } = xt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = xt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = xt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = xt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: S } = xt.add(this.Fh | 0, this.Fl | 0, h | 0, S | 0), { h: x, l: L } = xt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: F, l: H } = xt.add(this.Hh | 0, this.Hl | 0, F | 0, H | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, S, x, L, F, H);
  }
  roundClean() {
    Lr.fill(0), Cr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bS = class extends ec {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, mS = class extends ec {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, xS = class extends ec {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Os(() => new ec());
Os(() => new bS());
const SS = Os(() => new mS());
Os(() => new xS());
var Bt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Bt || (Bt = {}));
var we;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(we || (we = {}));
function Lu(t) {
  return we[t];
}
const ES = () => ({ type: Bt.BoolTrue }), AS = () => ({ type: Bt.BoolFalse }), vS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Bt.Buffer, value: ct(t) };
}, md = BigInt("0xffffffffffffffffffffffffffffffff"), $S = BigInt(0), xd = BigInt("0x7fffffffffffffffffffffffffffffff"), Sd = BigInt("-170141183460469231731687303715884105728"), IS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Qc(Ht(t))), qe(t, Uint8Array) && (t = Qc(t));
  const e = Be(t);
  if (e > xd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${xd}`);
  if (e < Sd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Sd}`);
  return { type: Bt.Int, value: e };
}, kS = (t) => {
  const e = Be(t);
  if (e < $S)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > md)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${md}`);
  return { type: Bt.UInt, value: e };
};
function LS(t) {
  return { type: Bt.List, value: t };
}
function Dp() {
  return { type: Bt.OptionalNone };
}
function Fp(t) {
  return { type: Bt.OptionalSome, value: t };
}
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
function CS() {
  return {
    type: Q.Address,
    version: $s.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ed(t) {
  if (t && Xp(t, Ia))
    throw new Error(`Memo exceeds maximum length of ${Ia} bytes`);
  return { type: Q.MemoString, content: t };
}
function Cu(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sl(t) {
  if (Ht(t).byteLength != Ja)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function TS(t, e, n) {
  return typeof t == "string" && (t = VS(t)), typeof n == "string" && (n = Ed(n)), {
    type: Q.Payload,
    payloadType: Kt.TokenTransfer,
    recipient: t,
    amount: Be(e),
    memo: n ?? Ed("")
  };
}
function BS(t, e, n, r) {
  return typeof e == "string" && (e = kn(e)), typeof n == "string" && (n = kn(n)), {
    type: Q.Payload,
    payloadType: Kt.ContractCall,
    contractAddress: typeof t == "string" ? Xr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function MS(t) {
  return kn(t, 4, 1e5);
}
function Ad(t, e, n) {
  return typeof t == "string" && (t = kn(t)), typeof e == "string" && (e = MS(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: Kt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: Kt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function NS() {
  return { type: Q.Payload, payloadType: Kt.PoisonMicroblock };
}
function vd(t, e) {
  if (t.byteLength != fs)
    throw Error(`Coinbase buffer size must be ${fs} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: Kt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: Kt.Coinbase,
    coinbaseBytes: t
  };
}
function _S(t, e, n) {
  if (t.byteLength != fs)
    throw Error(`Coinbase buffer size must be ${fs} bytes`);
  if (n.byteLength != pl)
    throw Error(`VRF proof buffer size must be ${pl} bytes`);
  return {
    type: Q.Payload,
    payloadType: Kt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Bt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function US(t, e, n, r, i, s, o) {
  return {
    type: Q.Payload,
    payloadType: Kt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function kn(t, e, n) {
  const r = e || 1, i = n || bx;
  if (Xp(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function PS(t, e, n) {
  return {
    type: Q.Asset,
    address: Xr(t),
    contractName: kn(e),
    assetName: kn(n)
  };
}
function Xr(t) {
  const e = Hs.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
function HS(t, e) {
  const n = Xr(t), r = kn(e);
  return {
    type: Q.Principal,
    prefix: Pe.Contract,
    address: n,
    contractName: r
  };
}
function OS(t) {
  const e = Xr(t);
  return {
    type: Q.Principal,
    prefix: Pe.Standard,
    address: e
  };
}
function ii(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function Jn(t) {
  switch (t.type) {
    case Q.Address:
      return Ao(t);
    case Q.Principal:
      return jp(t);
    case Q.LengthPrefixedString:
      return Ai(t);
    case Q.MemoString:
      return FS(t);
    case Q.Asset:
      return Rp(t);
    case Q.PostCondition:
      return Kp(t);
    case Q.PublicKey:
      return vl(t);
    case Q.LengthPrefixedList:
      return Tu(t);
    case Q.Payload:
      return Vp(t);
    case Q.TransactionAuthField:
      return KS(t);
    case Q.MessageSignature:
      return Bu(t);
  }
}
function Ao(t) {
  const e = [];
  return e.push(Ht(wo(t.version, 1))), e.push(Ht(t.hash160)), he(e);
}
function Ei(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = Fa(ct(e.readBytes(1))), r = ct(e.readBytes(20));
  return { type: Q.Address, version: n, hash160: r };
}
function jp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Pe.Standard || t.prefix === Pe.Contract) && e.push(Ao(t.address)), t.prefix === Pe.Contract && e.push(Ai(t.contractName)), he(e);
}
function DS(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = e.readUInt8Enum(Pe, (s) => {
    throw new _e(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Pe.Origin)
    return { type: Q.Principal, prefix: n };
  const r = Ei(e);
  if (n === Pe.Standard)
    return { type: Q.Principal, prefix: n, address: r };
  const i = hn(e);
  return {
    type: Q.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Ai(t) {
  const e = [], n = Ns(t.content), r = n.byteLength;
  return e.push(Ht(wo(r, t.lengthPrefixBytes))), e.push(n), he(e);
}
function hn(t, e, n) {
  e = e || 1;
  const r = qe(t, Xt) ? t : new Xt(t), i = Fa(ct(r.readBytes(e))), s = bo(r.readBytes(i));
  return kn(s, e, n ?? 128);
}
function FS(t) {
  const e = [], n = Ns(t.content), r = p3(ct(n), Ia * 2);
  return e.push(Ht(r)), he(e);
}
function zp(t) {
  const e = qe(t, Xt) ? t : new Xt(t);
  let n = bo(e.readBytes(Ia));
  return n = n.replace(/\u0000*$/, ""), { type: Q.MemoString, content: n };
}
function Rp(t) {
  const e = [];
  return e.push(Ao(t.address)), e.push(Ai(t.contractName)), e.push(Ai(t.assetName)), he(e);
}
function El(t) {
  const e = qe(t, Xt) ? t : new Xt(t);
  return {
    type: Q.Asset,
    address: Ei(e),
    contractName: hn(e),
    assetName: hn(e)
  };
}
function Tu(t) {
  const e = t.values, n = [];
  n.push(Ht(wo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Jn(r));
  return he(n);
}
function Gp(t, e, n) {
  const r = qe(t, Xt) ? t : new Xt(t), i = Fa(ct(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case Q.Address:
        s.push(Ei(r));
        break;
      case Q.LengthPrefixedString:
        s.push(hn(r));
        break;
      case Q.MemoString:
        s.push(zp(r));
        break;
      case Q.Asset:
        s.push(El(r));
        break;
      case Q.PostCondition:
        s.push(zS(r));
        break;
      case Q.PublicKey:
        s.push($l(r));
        break;
      case Q.TransactionAuthField:
        s.push(GS(r));
        break;
    }
  return Cu(s, n);
}
function jS(t) {
  return ct(Kp(t));
}
function Kp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(jp(t.principal)), (t.conditionType === te.Fungible || t.conditionType === te.NonFungible) && e.push(Rp(t.asset)), t.conditionType === te.NonFungible && e.push(Fn(t.assetName)), e.push(t.conditionCode), t.conditionType === te.STX || t.conditionType === te.Fungible || t.conditionType === te.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new si("The post-condition amount may not be larger than 8 bytes");
    e.push(qr(t.amount, 8));
  }
  return he(e);
}
function zS(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = e.readUInt8Enum(te, (a) => {
    throw new _e(`Could not read ${a} as PostConditionType`);
  }), r = DS(e);
  let i, s, o;
  switch (n) {
    case te.STX:
      return i = e.readUInt8Enum(eo, (c) => {
        throw new _e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: te.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case te.Fungible:
      return s = El(e), i = e.readUInt8Enum(eo, (c) => {
        throw new _e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: te.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case te.NonFungible:
      s = El(e);
      const a = Hn(e);
      return i = e.readUInt8Enum(yl, (c) => {
        throw new _e(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: te.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case te.Staking:
      return i = e.readUInt8Enum(eo, (c) => {
        throw new _e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: te.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case te.PoX: {
      const c = e.readUInt8Enum(wl, (u) => {
        throw new _e(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: Q.PostCondition,
        conditionType: te.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Vp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Kt.TokenTransfer:
      e.push(Fn(t.recipient)), e.push(qr(t.amount, 8)), e.push(Jn(t.memo));
      break;
    case Kt.ContractCall:
      e.push(Jn(t.contractAddress)), e.push(Jn(t.contractName)), e.push(Jn(t.functionName));
      const n = new Uint8Array(4);
      gs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Fn(r));
      });
      break;
    case Kt.SmartContract:
      e.push(Jn(t.contractName)), e.push(Jn(t.codeBody));
      break;
    case Kt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Jn(t.contractName)), e.push(Jn(t.codeBody));
      break;
    case Kt.PoisonMicroblock:
      break;
    case Kt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Kt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Fn(t.recipient));
      break;
    case Kt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Fn(t.recipient ? Fp(t.recipient) : Dp())), e.push(t.vrfProof);
      break;
    case Kt.TenureChange:
      e.push(Ht(t.tenureHash)), e.push(Ht(t.previousTenureHash)), e.push(Ht(t.burnViewHash)), e.push(Ht(t.previousTenureEnd)), e.push(gs(new Uint8Array(4), t.previousTenureBlocks)), e.push(Dw(new Uint8Array(1), t.cause)), e.push(Ht(t.publicKeyHash));
      break;
  }
  return he(e);
}
function RS(t) {
  const e = qe(t, Xt) ? t : new Xt(t);
  switch (e.readUInt8Enum(Kt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Kt.TokenTransfer:
      const r = Hn(e), i = Be(e.readBytes(8)), s = zp(e);
      return TS(r, i, s);
    case Kt.ContractCall:
      const o = Ei(e), a = hn(e), c = hn(e), u = [], d = e.readUInt32BE();
      for (let I = 0; I < d; I++) {
        const $ = Hn(e);
        u.push($);
      }
      return BS(o, a, c, u);
    case Kt.SmartContract:
      const l = hn(e), y = hn(e, 4, 1e5);
      return Ad(l, y);
    case Kt.VersionedSmartContract: {
      const I = e.readUInt8Enum(gl, (W) => {
        throw new Error(`Cannot recognize ClarityVersion: ${W}`);
      }), $ = hn(e), P = hn(e, 4, Cx);
      return Ad($, P, I);
    }
    case Kt.PoisonMicroblock:
      return NS();
    case Kt.Coinbase: {
      const I = e.readBytes(fs);
      return vd(I);
    }
    case Kt.CoinbaseToAltRecipient: {
      const I = e.readBytes(fs), $ = Hn(e);
      return vd(I, $);
    }
    case Kt.NakamotoCoinbase: {
      const I = e.readBytes(fs), $ = Hn(e), P = e.readBytes(pl);
      return _S(I, $, P);
    }
    case Kt.TenureChange:
      const h = ct(e.readBytes(20)), S = ct(e.readBytes(20)), x = ct(e.readBytes(20)), L = ct(e.readBytes(32)), F = e.readUInt32BE(), H = e.readUInt8Enum(bl, (I) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${I}`);
      }), p = ct(e.readBytes(20));
      return US(h, S, x, L, F, H, p);
  }
}
function Al(t) {
  const e = qe(t, Xt) ? t : new Xt(t);
  return Sl(ct(e.readBytes(Ja)));
}
function GS(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = e.readUInt8Enum(An, (r) => {
    throw new _e(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case An.PublicKeyCompressed:
      return ii(re.Compressed, $l(e));
    case An.PublicKeyUncompressed:
      return ii(re.Uncompressed, Bi($3($l(e).data)));
    case An.SignatureCompressed:
      return ii(re.Compressed, Al(e));
    case An.SignatureUncompressed:
      return ii(re.Uncompressed, Al(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Bu(t) {
  return Ht(t.data);
}
function KS(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === re.Compressed ? An.PublicKeyCompressed : An.PublicKeyUncompressed), e.push(Ht(v3(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === re.Compressed ? An.SignatureCompressed : An.SignatureUncompressed), e.push(Bu(t.contents));
      break;
  }
  return he(e);
}
function vl(t) {
  return t.data.slice();
}
function $l(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = e.readUInt8(), r = n === 4 ? Sx : xx;
  return Bi(he([n, e.readBytes(r)]));
}
function Mu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === qt.P2PKH || e === qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === qt.P2WPKH || e === qt.P2WSH || e === qt.P2WSHNonSequential) && !r.map((i) => i.data).every(Mi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case qt.P2PKH:
      return Vo(t, g3(r[0].data));
    case qt.P2WPKH:
      return Vo(t, y3(r[0].data));
    case qt.P2SH:
    case qt.P2SHNonSequential:
      return Vo(t, w3(n, r.map(vl)));
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      return Vo(t, b3(n, r.map(vl)));
  }
}
function Vo(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function Nu(t) {
  return Hs.c32address(t.version, t.hash160);
}
function $d(t) {
  const [e, n, r] = t.split(/\.|::/);
  return PS(e, n, r);
}
function Vi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return HS(e, n);
  } else
    return OS(t);
}
function VS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return XS(e, n);
  } else
    return qS(t);
}
function qS(t) {
  const e = Xr(t);
  return { type: Bt.PrincipalStandard, value: Nu(e) };
}
function WS(t) {
  return { type: Bt.PrincipalStandard, value: Nu(t) };
}
function XS(t, e) {
  const n = Xr(t), r = kn(e);
  return qp(n, r);
}
function qp(t, e) {
  if (Ns(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Bt.PrincipalContract,
    value: `${Nu(t)}.${e.content}`
  };
}
function YS(t) {
  return { type: Bt.ResponseErr, value: t };
}
function ZS(t) {
  return { type: Bt.ResponseOk, value: t };
}
const QS = (t) => ({ type: Bt.StringASCII, value: t }), JS = (t) => ({ type: Bt.StringUTF8, value: t });
function t3(t) {
  for (const e in t)
    if (!m3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Bt.Tuple, value: t };
}
function Hn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Xt(Ht(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Xt(t) : e = t;
  switch (e.readUInt8Enum(we, (r) => {
    throw new _e(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case we.int:
      return IS(Qc(e.readBytes(16)));
    case we.uint:
      return kS(e.readBytes(16));
    case we.buffer:
      const r = e.readUInt32BE();
      return vS(e.readBytes(r));
    case we.true:
      return ES();
    case we.false:
      return AS();
    case we.address:
      const i = Ei(e);
      return WS(i);
    case we.contract:
      const s = Ei(e), o = hn(e);
      return qp(s, o);
    case we.ok:
      return ZS(Hn(e));
    case we.err:
      return YS(Hn(e));
    case we.none:
      return Dp();
    case we.some:
      return Fp(Hn(e));
    case we.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Hn(e));
      return LS(c);
    case we.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const L = hn(e).content;
        if (L === void 0)
          throw new _e('"content" is undefined');
        d[L] = Hn(e);
      }
      return t3(d);
    case we.ascii:
      const l = e.readUInt32BE(), y = Bw(e.readBytes(l));
      return QS(y);
    case we.utf8:
      const h = e.readUInt32BE(), S = bo(e.readBytes(h));
      return JS(S);
    default:
      throw new _e("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Kn(t, e) {
  return he([Lu(t), e]);
}
function e3(t) {
  return new Uint8Array([Lu(t.type)]);
}
function n3(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([Lu(t.type)]) : Kn(t.type, Fn(t.value));
}
function r3(t) {
  const e = new Uint8Array(4);
  return gs(e, Math.ceil(t.value.length / 2), 0), Kn(t.type, Rn(e, Ht(t.value)));
}
function s3(t) {
  const e = ru(Iw(BigInt(t.value), BigInt(mx)), Tp);
  return Kn(t.type, e);
}
function i3(t) {
  const e = ru(BigInt(t.value), Tp);
  return Kn(t.type, e);
}
function o3(t) {
  return Kn(t.type, Ao(Xr(t.value)));
}
function a3(t) {
  const [e, n] = x3(t.value);
  return Kn(t.type, Rn(Ao(Xr(e)), Ai(kn(n))));
}
function c3(t) {
  return Kn(t.type, Fn(t.value));
}
function l3(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = Fn(r);
    e.push(i);
  }
  return Kn(t.type, he(e));
}
function u3(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = kn(i);
    e.push(Ai(s));
    const o = Fn(t.value[i]);
    e.push(o);
  }
  return Kn(t.type, he(e));
}
function Wp(t, e) {
  const n = [], r = e == "ascii" ? Tw(t.value) : Ns(t.value), i = new Uint8Array(4);
  return gs(i, r.length, 0), n.push(i), n.push(r), Kn(t.type, he(n));
}
function f3(t) {
  return Wp(t, "ascii");
}
function d3(t) {
  return Wp(t, "utf8");
}
function Id(t) {
  return ct(Fn(t));
}
function Fn(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return e3(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return n3(t);
    case Bt.Buffer:
      return r3(t);
    case Bt.UInt:
      return i3(t);
    case Bt.Int:
      return s3(t);
    case Bt.PrincipalStandard:
      return o3(t);
    case Bt.PrincipalContract:
      return a3(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return c3(t);
    case Bt.List:
      return l3(t);
    case Bt.Tuple:
      return u3(t);
    case Bt.StringASCII:
      return f3(t);
    case Bt.StringUTF8:
      return d3(t);
    default:
      throw new si("Unable to serialize. Invalid Clarity Value.");
  }
}
const h3 = (t) => t.length % 2 ? `0${t}` : t, p3 = (t, e) => t.padEnd(e, "0"), Xp = (t, e) => t ? Ns(t).length > e : !1;
function Il(t) {
  return Ip(t);
}
const oo = (t) => Wx($u(t)), _u = (t) => ct(SS(t)), g3 = (t) => ct(oo(t)), y3 = (t) => {
  const e = oo(t), n = Rn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = oo(n);
  return ct(r);
}, w3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = he(n), i = oo(r);
  return ct(i);
}, b3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = he(n), i = $u(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = he(s), a = oo(o);
  return ct(a);
};
function m3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function x3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
ue.hmacSha256Sync = (t, ...e) => {
  const n = _p.create($u, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Bi(t) {
  return t = typeof t == "string" ? Ht(t) : t, {
    type: Q.PublicKey,
    data: t
  };
}
function S3(t, e, n = re.Compressed) {
  const r = Uw(e), i = new en(If(r.r), If(r.s)), s = vt.fromSignature(t, i, r.recoveryId), o = n === re.Compressed;
  return s.toHex(o);
}
function E3(t) {
  return typeof t == "string" ? t : ct(t);
}
const Uu = E3;
function Yp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === _w;
}
function Mi(t) {
  return !Uu(t).startsWith("04");
}
function A3(t) {
  t = su(t);
  const e = Yp(t);
  return ct(mo(t.slice(0, 32), e));
}
function v3(t) {
  return vt.fromHex(Uu(t)).toHex(!0);
}
function $3(t) {
  return vt.fromHex(Uu(t)).toHex(!1);
}
function I3(t, e) {
  t = su(t);
  const [n, r] = za(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return wo(r, 1) + en.fromHex(n).toCompactHex();
}
function Pu() {
  return {
    type: Q.MessageSignature,
    data: ct(new Uint8Array(Ja))
  };
}
function Zp(t, e, n, r) {
  const i = Mu(0, t, 1, [Bi(e)]).hash160, s = Mi(e) ? re.Compressed : re.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Be(n),
    fee: Be(r),
    keyEncoding: s,
    signature: Pu()
  };
}
function ao(t) {
  return "signature" in t;
}
function kd(t) {
  return t === qt.P2SH || t === qt.P2WSH;
}
function k3(t) {
  return t === qt.P2SHNonSequential || t === qt.P2WSHNonSequential;
}
function Ld(t) {
  const e = Il(t);
  return e.nonce = 0, e.fee = 0, ao(e) ? e.signature = Pu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function L3(t) {
  const e = [
    t.hashMode,
    Ht(t.signer),
    qr(t.nonce, 8),
    qr(t.fee, 8),
    t.keyEncoding,
    Bu(t.signature)
  ];
  return he(e);
}
function C3(t) {
  const e = [
    t.hashMode,
    Ht(t.signer),
    qr(t.nonce, 8),
    qr(t.fee, 8)
  ], n = Cu(t.fields);
  e.push(Tu(n));
  const r = new Uint8Array(2);
  return Hw(r, t.signaturesRequired, 0), e.push(r), he(e);
}
function T3(t, e) {
  const n = ct(e.readBytes(20)), r = BigInt(`0x${ct(e.readBytes(8))}`), i = BigInt(`0x${ct(e.readBytes(8))}`), s = e.readUInt8Enum(re, (a) => {
    throw new _e(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === qt.P2WPKH && s != re.Compressed)
    throw new _e("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Al(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function B3(t, e) {
  const n = ct(e.readBytes(20)), r = BigInt("0x" + ct(e.readBytes(8))), i = BigInt("0x" + ct(e.readBytes(8))), s = Gp(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case Q.PublicKey:
        Mi(u.contents.data) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === re.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new os("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === qt.P2WSH || t === qt.P2WSHNonSequential))
    throw new os("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Cc(t) {
  return ao(t) ? L3(t) : C3(t);
}
function Tc(t) {
  const e = t.readUInt8Enum(qt, (n) => {
    throw new _e(`Could not parse ${n} as AddressHashMode`);
  });
  return e === qt.P2PKH || e === qt.P2WPKH ? T3(e, t) : B3(e, t);
}
function Qp(t, e, n, r) {
  const s = t + ct(new Uint8Array([e])) + ct(qr(n, 8)) + ct(qr(r, 8));
  if (Ht(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return _u(Ht(s));
}
function Jp(t, e, n) {
  const r = 33 + Ja, i = Mi(e.data) ? re.Compressed : re.Uncompressed, s = t + h3(i.toString(16)) + n, o = Ht(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return _u(o);
}
function M3(t, e, n, r, i) {
  const s = Qp(t, e, n, r), o = I3(i, s), a = Bi(A3(i)), c = Jp(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function tg(t, e, n, r, i, s) {
  const o = Qp(t, e, n, r), a = Bi(S3(o, s, i)), c = Jp(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function N3() {
  const t = Zp(qt.P2PKH, "", 0, 0);
  return t.signer = CS().hash160, t.keyEncoding = re.Compressed, t.signature = Pu(), t;
}
function Cd(t, e, n) {
  return ao(t) ? _3(t, e, n) : U3(t, e, n);
}
function _3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = tg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Mu(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new os(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function U3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Mi(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === re.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = tg(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (kd(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new os("Too many signatures");
        break;
    }
  if (kd(t.hashMode) && o !== t.signaturesRequired || k3(t.hashMode) && o < t.signaturesRequired)
    throw new os("Incorrect number of signatures");
  if (s && (t.hashMode === qt.P2WSH || t.hashMode === qt.P2WSHNonSequential))
    throw new os("Uncompressed keys are not allowed in this hash mode");
  const a = Mu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new os(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function eg(t) {
  return {
    authType: ce.Standard,
    spendingCondition: t
  };
}
function ng(t, e) {
  return {
    authType: ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Zp(qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Td(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ce.Standard:
        return eg(Ld(t.spendingCondition));
      case ce.Sponsored:
        return ng(Ld(t.spendingCondition), N3());
      default:
        throw new La("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function P3(t, e) {
  switch (t.authType) {
    case ce.Standard:
      return Cd(t.spendingCondition, e, ce.Standard);
    case ce.Sponsored:
      return Cd(t.spendingCondition, e, ce.Standard);
    default:
      throw new La("Invalid origin auth type");
  }
}
function H3(t, e) {
  switch (t.authType) {
    case ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Be(e)
      };
      return { ...t, spendingCondition: n };
    case ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Be(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function O3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Be(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function D3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Be(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function F3(t, e) {
  const n = {
    ...e,
    nonce: Be(e.nonce),
    fee: Be(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function j3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ce.Standard:
      e.push(Cc(t.spendingCondition));
      break;
    case ce.Sponsored:
      e.push(Cc(t.spendingCondition)), e.push(Cc(t.sponsorSpendingCondition));
      break;
  }
  return he(e);
}
function z3(t) {
  const e = t.readUInt8Enum(ce, (r) => {
    throw new _e(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ce.Standard:
      return n = Tc(t), eg(n);
    case ce.Sponsored:
      n = Tc(t);
      const r = Tc(t);
      return ng(n, r);
  }
}
class R3 {
  constructor({ auth: e, payload: n, postConditions: r = Cu([]), postConditionMode: i = ka.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = yx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Be(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = Ze.Any;
  }
  signBegin() {
    const e = Il(this);
    return e.auth = Td(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Il(this);
    return e.auth = Td(e.auth), e.txid();
  }
  verifyOrigin() {
    return P3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ce.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ce.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ce.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Bi(e), r = this.auth.spendingCondition;
    if (r && !ao(r)) {
      const i = Mi(n.data);
      r.fields.push(ii(i ? re.Compressed : re.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = M3(n, r, e.fee, e.nonce, i);
    if (ao(e))
      e.signature = Sl(s);
    else {
      const a = Yp(i);
      e.fields.push(ii(a ? re.Compressed : re.Uncompressed, Sl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return _u(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ce.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = F3(this.auth, e);
  }
  setFee(e) {
    this.auth = H3(this.auth, e);
  }
  setNonce(e) {
    this.auth = O3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ce.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = D3(this.auth, e);
  }
  serialize() {
    return ct(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new si('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new si('"chainId" is undefined');
    if (this.auth === void 0)
      throw new si('"auth" is undefined');
    if (this.payload === void 0)
      throw new si('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return gs(n, this.chainId, 0), e.push(n), e.push(j3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Tu(this.postConditions)), e.push(Vp(this.payload)), he(e);
  }
}
function G3(t) {
  const e = qe(t, Xt) ? t : new Xt(t), n = e.readUInt8Enum(vs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = z3(e), s = e.readUInt8Enum(Ze, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(ka, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Gp(e, Q.PostCondition), c = RS(e), u = new R3({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const Bd = BigInt("18446744073709551615");
function Bc(t) {
  const e = Be(t);
  if (e < 0n || e > Bd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Bd} (u64 max), received: ${e}`);
  return e;
}
var kl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(kl || (kl = {}));
var Ll;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ll || (Ll = {}));
function K3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: te.STX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: Pe.Origin } : Vi(t.address),
        conditionCode: qo(t.condition),
        amount: Bc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: te.Fungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: Pe.Origin } : Vi(t.address),
        conditionCode: qo(t.condition),
        amount: Bc(t.amount),
        asset: $d(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: te.NonFungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: Pe.Origin } : Vi(t.address),
        conditionCode: qo(t.condition),
        asset: $d(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: te.Staking,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: Pe.Origin } : Vi(t.address),
        conditionCode: qo(t.condition),
        amount: Bc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: te.PoX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: Pe.Origin } : Vi(t.address),
        conditionCode: V3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function qo(t) {
  return kl[t];
}
function V3(t) {
  return Ll[t];
}
function rg(t) {
  const e = K3(t);
  return jS(e);
}
function q3(t, e, n) {
  return Ou(sg(t), n);
}
function sg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = co(r);
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
    return BigInt(`0x${Y3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Hu(t, e = 8) {
  return (typeof t == "bigint" ? t : sg(t)).toString(16).padStart(e * 2, "0");
}
function Ou(t, e = 16) {
  const n = Hu(t, e);
  return co(n);
}
function W3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const X3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += X3[n];
  return e;
}
function co(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Du(t) {
  return new TextEncoder().encode(t);
}
function Z3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Q3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Md(t) {
  if (t.some(Q3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fu(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function ar(t) {
  return Fu(...t.map((e) => typeof e == "number" ? Md([e]) : e instanceof Array ? Md(e) : e));
}
function nc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Cl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Cl || (Cl = {}));
Cl.Mainnet;
const J3 = 128, tE = 128, ig = 16;
var Tl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Tl || (Tl = {}));
var Nd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Nd || (Nd = {}));
var _d;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(_d || (_d = {}));
var En;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(En || (En = {}));
const Mc = ["onChainOnly", "offChainOnly", "any"];
Mc[0] + "", En.OnChainOnly, Mc[1] + "", En.OffChainOnly, Mc[2] + "", En.Any, En.OnChainOnly + "", En.OnChainOnly, En.OffChainOnly + "", En.OffChainOnly, En.Any + "", En.Any;
var Bl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bl || (Bl = {}));
Bl.Mainnet;
var Ud;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ud || (Ud = {}));
var ns;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ns || (ns = {}));
var Pd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pd || (Pd = {}));
var Hd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Dd || (Dd = {}));
var Fd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Fd || (Fd = {}));
var jd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(jd || (jd = {}));
var Ml;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ml || (Ml = {}));
var zd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zd || (zd = {}));
var Rd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Rd || (Rd = {}));
function Nl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function og(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nl(t.outputLen), Nl(t.blockLen);
}
function rE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sE(t, e) {
  og(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Nc = {
  number: Nl,
  bool: eE,
  bytes: og,
  hash: nE,
  exists: rE,
  output: sE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _c = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _n = (t, e) => t << 32 - e | t >>> e, iE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ag(t) {
  if (typeof t == "string" && (t = oE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let aE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ds(t) {
  const e = (r) => t().update(ag(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ju = class extends aE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _c(this.buffer);
  }
  update(e) {
    Nc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = ag(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = _c(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Nc.exists(this), Nc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    cE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = _c(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const lE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cg = Uint8Array.from({ length: 16 }, (t, e) => e), uE = cg.map((t) => (9 * t + 5) % 16);
let zu = [cg], Ru = [uE];
for (let t = 0; t < 4; t++)
  for (let e of [zu, Ru])
    e.push(e[t].map((n) => lE[n]));
const lg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fE = zu.map((t, e) => t.map((n) => lg[e][n])), dE = Ru.map((t, e) => t.map((n) => lg[e][n])), hE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wo = (t, e) => t << e | t >>> 32 - e;
function Gd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xo = new Uint32Array(16);
let gE = class extends ju {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Xo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const S = 4 - h, x = hE[h], L = pE[h], F = zu[h], H = Ru[h], p = fE[h], I = dE[h];
      for (let $ = 0; $ < 16; $++) {
        const P = Wo(r + Gd(h, s, a, u) + Xo[F[$]] + x, p[$]) + l | 0;
        r = l, l = u, u = Wo(a, 10) | 0, a = s, s = P;
      }
      for (let $ = 0; $ < 16; $++) {
        const P = Wo(i + Gd(S, o, c, d) + Xo[H[$]] + L, I[$]) + y | 0;
        i = y, y = d, d = Wo(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ds(() => new gE());
const yE = (t, e, n) => t & e ^ ~t & n, wE = (t, e, n) => t & e ^ t & n ^ e & n, bE = new Uint32Array([
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
]), Tr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Br = new Uint32Array(64);
let ug = class extends ju {
  constructor() {
    super(64, 32, 8, !1), this.A = Tr[0] | 0, this.B = Tr[1] | 0, this.C = Tr[2] | 0, this.D = Tr[3] | 0, this.E = Tr[4] | 0, this.F = Tr[5] | 0, this.G = Tr[6] | 0, this.H = Tr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Br[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Br[l - 15], h = Br[l - 2], S = _n(y, 7) ^ _n(y, 18) ^ y >>> 3, x = _n(h, 17) ^ _n(h, 19) ^ h >>> 10;
      Br[l] = x + Br[l - 7] + S + Br[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = _n(a, 6) ^ _n(a, 11) ^ _n(a, 25), h = d + y + yE(a, c, u) + bE[l] + Br[l] | 0, x = (_n(r, 2) ^ _n(r, 13) ^ _n(r, 22)) + wE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mE = class extends ug {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ds(() => new ug());
Ds(() => new mE());
const Yo = BigInt(2 ** 32 - 1), _l = BigInt(32);
function fg(t, e = !1) {
  return e ? { h: Number(t & Yo), l: Number(t >> _l & Yo) } : { h: Number(t >> _l & Yo) | 0, l: Number(t & Yo) | 0 };
}
function xE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = fg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const SE = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), EE = (t, e, n) => t >>> n, AE = (t, e, n) => t << 32 - n | e >>> n, vE = (t, e, n) => t >>> n | e << 32 - n, $E = (t, e, n) => t << 32 - n | e >>> n, IE = (t, e, n) => t << 64 - n | e >>> n - 32, kE = (t, e, n) => t >>> n - 32 | e << 64 - n, LE = (t, e) => e, CE = (t, e) => t, TE = (t, e, n) => t << n | e >>> 32 - n, BE = (t, e, n) => e << n | t >>> 32 - n, ME = (t, e, n) => e << n - 32 | t >>> 64 - n, NE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _E(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const UE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), PE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, HE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), OE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, DE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), FE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: fg,
  split: xE,
  toBig: SE,
  shrSH: EE,
  shrSL: AE,
  rotrSH: vE,
  rotrSL: $E,
  rotrBH: IE,
  rotrBL: kE,
  rotr32H: LE,
  rotr32L: CE,
  rotlSH: TE,
  rotlSL: BE,
  rotlBH: ME,
  rotlBL: NE,
  add: _E,
  add3L: UE,
  add3H: PE,
  add4L: HE,
  add4H: OE,
  add5H: FE,
  add5L: DE
}, [jE, zE] = St.split([
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
].map((t) => BigInt(t))), Mr = new Uint32Array(80), Nr = new Uint32Array(80);
let rc = class extends ju {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Mr[p] = e.getUint32(n), Nr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const I = Mr[p - 15] | 0, $ = Nr[p - 15] | 0, P = St.rotrSH(I, $, 1) ^ St.rotrSH(I, $, 8) ^ St.shrSH(I, $, 7), W = St.rotrSL(I, $, 1) ^ St.rotrSL(I, $, 8) ^ St.shrSL(I, $, 7), G = Mr[p - 2] | 0, V = Nr[p - 2] | 0, E = St.rotrSH(G, V, 19) ^ St.rotrBH(G, V, 61) ^ St.shrSH(G, V, 6), T = St.rotrSL(G, V, 19) ^ St.rotrBL(G, V, 61) ^ St.shrSL(G, V, 6), N = St.add4L(W, T, Nr[p - 7], Nr[p - 16]), B = St.add4H(N, P, E, Mr[p - 7], Mr[p - 16]);
      Mr[p] = B | 0, Nr[p] = N | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: S, Gh: x, Gl: L, Hh: F, Hl: H } = this;
    for (let p = 0; p < 80; p++) {
      const I = St.rotrSH(l, y, 14) ^ St.rotrSH(l, y, 18) ^ St.rotrBH(l, y, 41), $ = St.rotrSL(l, y, 14) ^ St.rotrSL(l, y, 18) ^ St.rotrBL(l, y, 41), P = l & h ^ ~l & x, W = y & S ^ ~y & L, G = St.add5L(H, $, W, zE[p], Nr[p]), V = St.add5H(G, F, I, P, jE[p], Mr[p]), E = G | 0, T = St.rotrSH(r, i, 28) ^ St.rotrBH(r, i, 34) ^ St.rotrBH(r, i, 39), N = St.rotrSL(r, i, 28) ^ St.rotrBL(r, i, 34) ^ St.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      F = x | 0, H = L | 0, x = h | 0, L = S | 0, h = l | 0, S = y | 0, { h: l, l: y } = St.add(u | 0, d | 0, V | 0, E | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const j = St.add3L(E, N, nt);
      r = St.add3H(j, V, T, B), i = j | 0;
    }
    ({ h: r, l: i } = St.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = St.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = St.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = St.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: S } = St.add(this.Fh | 0, this.Fl | 0, h | 0, S | 0), { h: x, l: L } = St.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: F, l: H } = St.add(this.Hh | 0, this.Hl | 0, F | 0, H | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, S, x, L, F, H);
  }
  roundClean() {
    Mr.fill(0), Nr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, RE = class extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, GE = class extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, KE = class extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ds(() => new rc());
Ds(() => new RE());
Ds(() => new GE());
Ds(() => new KE());
function VE(t, e, n) {
  const i = J3;
  if (c4(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Tl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var xe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(xe || (xe = {}));
let qE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, dg = class extends qE {
  constructor(e) {
    super(e);
  }
};
function sc(t) {
  const e = [];
  return e.push(co(Hu(t.version, 1))), e.push(co(t.hash160)), ar(e);
}
function WE(t) {
  const e = [];
  return e.push(t.prefix), e.push(sc(t.address)), t.prefix === Ml.Contract && e.push(lo(t.contractName)), ar(e);
}
function lo(t) {
  const e = [], n = Du(t.content), r = n.byteLength;
  return e.push(co(Hu(r, t.lengthPrefixBytes))), e.push(n), ar(e);
}
function XE(t) {
  const e = [];
  return e.push(sc(t.address)), e.push(lo(t.contractName)), e.push(lo(t.assetName)), ar(e);
}
function hg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(WE(t.principal)), (t.conditionType === ns.Fungible || t.conditionType === ns.NonFungible) && e.push(XE(t.assetInfo)), t.conditionType === ns.NonFungible && e.push(Is(t.assetName)), e.push(t.conditionCode), t.conditionType === ns.STX || t.conditionType === ns.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new dg("The post-condition amount may not be larger than 8 bytes");
    e.push(q3(t.amount, !1, 8));
  }
  return ar(e);
}
function Vn(t, e) {
  return ar([t, e]);
}
function YE(t) {
  return new Uint8Array([t.type]);
}
function ZE(t) {
  return t.type === xe.OptionalNone ? new Uint8Array([t.type]) : Vn(t.type, Is(t.value));
}
function QE(t) {
  const e = new Uint8Array(4);
  return nc(e, t.buffer.length, 0), Vn(t.type, Fu(e, t.buffer));
}
function JE(t) {
  const e = Ou(W3(t.value, BigInt(tE)), ig);
  return Vn(t.type, e);
}
function t4(t) {
  const e = Ou(t.value, ig);
  return Vn(t.type, e);
}
function e4(t) {
  return Vn(t.type, sc(t.address));
}
function n4(t) {
  return Vn(t.type, Fu(sc(t.address), lo(t.contractName)));
}
function r4(t) {
  return Vn(t.type, Is(t.value));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  nc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Is(r);
    e.push(i);
  }
  return Vn(t.type, ar(e));
}
function i4(t) {
  const e = [], n = new Uint8Array(4);
  nc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = VE(i);
    e.push(lo(s));
    const o = Is(t.data[i]);
    e.push(o);
  }
  return Vn(t.type, ar(e));
}
function pg(t, e) {
  const n = [], r = e == "ascii" ? Z3(t.data) : Du(t.data), i = new Uint8Array(4);
  return nc(i, r.length, 0), n.push(i), n.push(r), Vn(t.type, ar(n));
}
function o4(t) {
  return pg(t, "ascii");
}
function a4(t) {
  return pg(t, "utf8");
}
function Is(t) {
  switch (t.type) {
    case xe.BoolTrue:
    case xe.BoolFalse:
      return YE(t);
    case xe.OptionalNone:
    case xe.OptionalSome:
      return ZE(t);
    case xe.Buffer:
      return QE(t);
    case xe.UInt:
      return t4(t);
    case xe.Int:
      return JE(t);
    case xe.PrincipalStandard:
      return e4(t);
    case xe.PrincipalContract:
      return n4(t);
    case xe.ResponseOk:
    case xe.ResponseErr:
      return r4(t);
    case xe.List:
      return s4(t);
    case xe.Tuple:
      return i4(t);
    case xe.StringASCII:
      return o4(t);
    case xe.StringUTF8:
      return a4(t);
    default:
      throw new dg("Unable to serialize. Invalid Clarity Value.");
  }
}
const c4 = (t, e) => t ? Du(t).length > e : !1, l4 = "connect-ui";
let ua, gg, Qe = !1, Ul = !1;
const or = (t, e = "") => () => {
}, u4 = (t, e) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", Kd = {}, d4 = "http://www.w3.org/2000/svg", h4 = "http://www.w3.org/1999/xhtml", p4 = (t) => t != null, Gu = (t) => (t = typeof t, t === "object" || t === "function");
function yg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const yt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !Gu(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? Pl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Pl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Pl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, g4 = {}, y4 = (t) => t && t.$tag$ === g4, w4 = (t, e) => t != null && !Gu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, b4 = (t) => Ni(t).$hostElement$, m4 = (t, e, n) => {
  const r = Te.ce(e, n);
  return t.dispatchEvent(r), r;
}, Vd = /* @__PURE__ */ new WeakMap(), x4 = (t, e, n) => {
  let r = Ca.get(t);
  F4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ca.set(t, r);
}, S4 = (t, e, n, r) => {
  var i;
  let s = wg(e);
  const o = Ca.get(s);
  if (t = t.nodeType === 11 ? t : jn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Vd.get(t), c;
      if (a || Vd.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = jn.createElement("style"), c.innerHTML = o;
          const u = (i = Te.$nonce$) !== null && i !== void 0 ? i : yg(jn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, E4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = or("attachStyles", e.$tagName$), s = S4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, wg = (t, e) => "sc-" + t.$tagName$, qd = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = Xd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Wd(n), d = Wd(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Xd(ic, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Te.rel(t, e, n, !1), r && Te.ael(t, e, r, !1);
    else {
      const c = Gu(r);
      if ((o || c && r !== null) && !i)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || s & 4 || i) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, A4 = /\s/, Wd = (t) => t ? t.split(A4) : [], bg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Kd, o = e.$attrs$ || Kd;
  for (r in s)
    r in o || qd(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    qd(i, r, s[r], o[r], n, e.$flags$);
}, Ku = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = jn.createTextNode(i.$text$);
  else {
    if (Qe || (Qe = i.$tag$ === "svg"), o = i.$elm$ = jn.createElementNS(Qe ? d4 : h4, i.$tag$), Qe && i.$tag$ === "foreignObject" && (Qe = !1), bg(null, i, Qe), p4(ua) && o["s-si"] !== ua && o.classList.add(o["s-si"] = ua), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = Ku(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? Qe = !1 : o.tagName === "foreignObject" && (Qe = !0);
  }
  return o;
}, mg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === gg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = Ku(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, xg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, v4 = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : Zo(a, d) ? (Yi(a, d), a = e[++i], d = r[++s]) : Zo(c, l) ? (Yi(c, l), c = e[--o], l = r[--u]) : Zo(a, l) ? (Yi(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : Zo(c, d) ? (Yi(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (y = Ku(e && e[s], n, s), d = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? mg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && xg(e, i, o);
}, Zo = (t, e) => t.$tag$ === e.$tag$, Yi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (Qe = s === "svg" ? !0 : s === "foreignObject" ? !1 : Qe, bg(t, e, Qe), r !== null && i !== null ? v4(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), mg(n, null, e, i, 0, i.length - 1)) : r !== null && xg(r, 0, r.length - 1), Qe && s === "svg" && (Qe = !1)) : t.$text$ !== o && (n.data = o);
}, $4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Pl(null, null), i = y4(e) ? e : yt(null, null, e);
  gg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, ua = n["s-sc"], Yi(r, i);
}, Sg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Vu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Sg(t, t.$ancestorComponent$), z4(() => I4(t, e));
}, I4 = (t, e) => {
  const n = or("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), T4(i, () => k4(t, r, e));
}, k4 = async (t, e, n) => {
  const r = t.$hostElement$, i = or("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && E4(t);
  const o = or("render", t.$cmpMeta$.$tagName$);
  L4(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => C4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, L4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, $4(t, e);
  } catch (r) {
    uo(r, t.$hostElement$);
  }
  return null;
}, C4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = or("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Ag(n), r(), t.$onReadyResolve$(n), i || Eg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Wu(() => Vu(t, !1)), t.$flags$ &= -517;
}, Eg = (t) => {
  Ag(jn.documentElement), Wu(() => m4(ic, "appload", { detail: { namespace: l4 } }));
}, T4 = (t, e) => t && t.then ? t.then(e) : e(), Ag = (t) => t.classList.add("hydrated"), B4 = (t, e) => Ni(t).$instanceValues$.get(e), M4 = (t, e, n, r) => {
  const i = Ni(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = w4(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && Vu(i, !1));
}, vg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return B4(this, s);
        },
        set(a) {
          M4(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        Te.jmp(() => {
          const u = s.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (i.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return s.set(c, o), c;
      });
    }
  }
  return t;
}, N4 = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = D4(n), i.then) {
        const c = u4();
        i = await i, c();
      }
      i.isProxied || (vg(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = or("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        uo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = wg(n);
      if (!Ca.has(c)) {
        const u = or("registerStyles", n.$tagName$);
        x4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => Vu(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, _4 = (t) => {
  if (!(Te.$flags$ & 1)) {
    const e = Ni(t), n = e.$cmpMeta$, r = or("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Sg(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), N4(t, e, n);
    }
    r();
  }
}, U4 = (t) => {
  Te.$flags$ & 1 || Ni(t);
}, P4 = (t, e = {}) => {
  var n;
  const r = or(), i = [], s = e.exclude || [], o = ic.customElements, a = jn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ jn.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(Te, e), Te.$resourcesUrl$ = new URL(e.resourcesUrl || "./", jn.baseURI).href, t.map((h) => {
    h[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const L = x.$tagName$, F = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, O4(H, x), x.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : Te.jmp(() => _4(this));
        }
        disconnectedCallback() {
          Te.jmp(() => U4(this));
        }
        componentOnReady() {
          return Ni(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = h[0], !s.includes(L) && !o.get(L) && (i.push(L), o.define(L, vg(
        F,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + f4, u.setAttribute("data-styles", "");
    const h = (n = Te.$nonce$) !== null && n !== void 0 ? n : yg(jn);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((h) => h.connectedCallback()) : Te.jmp(() => l = setTimeout(Eg, 30)), r();
}, qu = /* @__PURE__ */ new WeakMap(), Ni = (t) => qu.get(t), H4 = (t, e) => qu.set(e.$lazyInstance$ = t, e), O4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], qu.set(t, n);
}, Xd = (t, e) => e in t, uo = (t, e) => (0, console.error)(t, e), Uc = /* @__PURE__ */ new Map(), D4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Uc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Uc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => r$).then(o, uo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Uc.set(i, o), o[r]), uo);
}, Ca = /* @__PURE__ */ new Map(), ic = typeof window < "u" ? window : {}, jn = ic.document || { head: {} }, Te = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, $g = (t) => Promise.resolve(t), F4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Yd = [], Ig = [], j4 = (t, e) => (n) => {
  t.push(n), Ul || (Ul = !0, Te.$flags$ & 4 ? Wu(Hl) : Te.raf(Hl));
}, Zd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      uo(n);
    }
  t.length = 0;
}, Hl = () => {
  Zd(Yd), Zd(Ig), (Ul = Yd.length > 0) && Te.raf(Hl);
}, Wu = (t) => $g().then(t), z4 = /* @__PURE__ */ j4(Ig), R4 = () => $g(), G4 = (t, e) => typeof window > "u" ? Promise.resolve() : R4().then(() => P4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var K4 = Object.defineProperty, V4 = Object.defineProperties, q4 = Object.getOwnPropertyDescriptors, Ta = Object.getOwnPropertySymbols, kg = Object.prototype.hasOwnProperty, Lg = Object.prototype.propertyIsEnumerable, Qd = (t, e, n) => e in t ? K4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, rn = (t, e) => {
  for (var n in e || (e = {})) kg.call(e, n) && Qd(t, n, e[n]);
  if (Ta) for (var n of Ta(e)) Lg.call(e, n) && Qd(t, n, e[n]);
  return t;
}, Ln = (t, e) => V4(t, q4(e)), Cg = (t, e) => {
  var n = {};
  for (var r in t) kg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ta) for (var r of Ta(t)) e.indexOf(r) < 0 && Lg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Tg() {
  return Qa(xs()) || window.StacksProvider || window.BlockstackProvider;
}
function oc(t) {
  return t ? typeof t == "string" ? Es.fromName(t) : "version" in t ? t : "url" in t ? new fl({ url: t.url }) : t.transactionVersion === vs.Mainnet ? new fl({ url: t.client.baseUrl }) : new dl({ url: t.client.baseUrl }) : new dl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var W4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(W4 || {}), X4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(X4 || {}), Xu = (t) => {
  let e = t;
  if (!e) {
    let n = new a0(["store_write"], document.location.href);
    e = new ul({ appConfig: n });
  }
  return e;
};
function Bg(t) {
  try {
    return Xu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Mg = (t) => {
  let e = Xu(t).loadUserData().appPrivateKey, n = Le.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Y4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [As.Mainnet]: "mainnet", [As.Testnet]: "testnet" }, a = oc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function Z4(t) {
  let e = oc(t.network), n = Xu(t.userSession), r = Ln(rn({}, t), { network: e, userSession: n });
  return rn({ stxAddress: Y4(r) }, r);
}
async function Q4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(rg) : n = n.map((r) => ct(hg(r)))), new Le.TokenSigner("ES256k", e).signAsync(Ln(rn({}, t), { postConditions: n }));
}
function J4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(rg) : e = e.map((n) => ct(hg(n)))), Le.createUnsecuredToken(Ln(rn({}, t), { postConditions: e }));
}
var tA = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Ht(a.replace(/^0x/, "")), u = G3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Ln(rn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Ln(rn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, eA = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = Cg(e, ["amount", "appDetails", "userSession"]);
  if (Bg(i)) {
    let { privateKey: a, publicKey: c } = Mg(i), u = Ln(rn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), Q4(u, a);
  }
  let o = Ln(rn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), J4(o);
};
async function nA(t, e, n) {
  let r = await e(Ln(rn(rn({}, Z4(t)), t), { network: oc(t.network) }));
  return tA({ token: r, options: t }, n);
}
function rA(t, e = Tg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return nA(t, eA, e);
}
function Ng(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ln(rn({}, t), { message: Id(e), domain: Id(n) }) : Ln(rn({}, t), { message: ct(Is(e)), domain: ct(Is(n)) });
}
async function sA(t, e) {
  return new Le.TokenSigner("ES256k", e).signAsync(Ng(t));
}
async function iA(t) {
  let e = t, { userSession: n } = e, r = Cg(e, ["userSession"]);
  if (Bg(n)) {
    let { privateKey: i, publicKey: s } = Mg(n), o = Ln(rn({}, r), { publicKey: s });
    return sA(o, i);
  }
  return Le.createUnsecuredToken(Ng(t));
}
var oA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(oA || {}), _g = "asigna-stx", Jd = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === _g && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(cA(t, e), "*");
}), aA = { authenticationRequest: async (t) => Jd(t, "authenticationRequest"), transactionRequest: async (t) => Jd(t, "transactionRequest") }, cA = (t, e) => ({ source: _g, [e]: t }), lA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = aA);
};
lA();
var uA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function fA(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = xs(), o = Tg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    G4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : uA, c = nx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
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
var Qo = fA(rA);
function Wr(t, e, n) {
  return Yu(Oe(t, e), n);
}
function Oe(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ne(r);
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
      const r = pA(BigInt(`0x${Lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function th(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function vo(t, e = 8) {
  return (typeof t == "bigint" ? t : Oe(t, !1)).toString(16).padStart(e * 2, "0");
}
function ac(t) {
  return parseInt(t, 16);
}
function Yu(t, e = 16) {
  const n = vo(t, e);
  return ne(n);
}
function dA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function hA(t, e) {
  return t & BigInt(1) << e;
}
function pA(t, e) {
  return hA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Lt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gA[n];
  return e;
}
function ne(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function _i(t) {
  return new TextEncoder().encode(t);
}
function Zu(t) {
  return new TextDecoder().decode(t);
}
function Ug(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function yA(t) {
  return String.fromCharCode.apply(null, t);
}
function wA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function eh(t) {
  if (t.some(wA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function cc(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function pe(t) {
  return cc(...t.map((e) => typeof e == "number" ? eh([e]) : e instanceof Array ? eh(e) : e));
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
const Pg = 33, Pc = 32;
function bA(t) {
  if (t.length < Pc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Pc * 2), r = t.slice(2 + Pc * 2);
  return {
    recoveryId: ac(e),
    r: n,
    s: r
  };
}
function mA(t) {
  const e = typeof t == "string" ? ne(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function xA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function SA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function EA(t, e) {
  return t[e];
}
function AA(t, e, n = 0) {
  return t[n] = e, t;
}
function vA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ks(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ol;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ol || (Ol = {}));
const $A = Ol.Mainnet, IA = 128, kA = 128, Hg = 16, ds = 32, Dl = 80, lc = 65, LA = 32, CA = 64, Ba = 34;
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
var At;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(At || (At = {}));
var Fl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Fl || (Fl = {}));
var Ke;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ke || (Ke = {}));
const fa = ["onChainOnly", "offChainOnly", "any"], ih = {
  [fa[0]]: Ke.OnChainOnly,
  [fa[1]]: Ke.OffChainOnly,
  [fa[2]]: Ke.Any,
  [Ke.OnChainOnly]: Ke.OnChainOnly,
  [Ke.OffChainOnly]: Ke.OffChainOnly,
  [Ke.Any]: Ke.Any
};
function TA(t) {
  if (t in ih)
    return ih[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${fa.join(", ")}`);
}
var Ma;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ma || (Ma = {}));
Ma.Mainnet;
var vi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(vi || (vi = {}));
var Ve;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ve || (Ve = {}));
var le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(le || (le = {}));
var Wt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wt || (Wt = {}));
var Na;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Na || (Na = {}));
var se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(se || (se = {}));
var fo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fo || (fo = {}));
var jl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(jl || (jl = {}));
var ho;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ho || (ho = {}));
var oh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(oh || (oh = {}));
var ah;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ah || (ah = {}));
function zl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function BA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Og(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function MA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zl(t.outputLen), zl(t.blockLen);
}
function NA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _A(t, e) {
  Og(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const cs = {
  number: zl,
  bool: BA,
  bytes: Og,
  hash: MA,
  exists: NA,
  output: _A
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Un = (t, e) => t << 32 - e | t >>> e, UA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!UA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function PA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Qu(t) {
  if (typeof t == "string" && (t = PA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Dg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Fs(t) {
  const e = (r) => t().update(Qu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function HA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Ju extends Dg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    cs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Qu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Hc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    cs.exists(this), cs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    HA(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
}
const OA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fg = Uint8Array.from({ length: 16 }, (t, e) => e), DA = Fg.map((t) => (9 * t + 5) % 16);
let tf = [Fg], ef = [DA];
for (let t = 0; t < 4; t++)
  for (let e of [tf, ef])
    e.push(e[t].map((n) => OA[n]));
const jg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), FA = tf.map((t, e) => t.map((n) => jg[e][n])), jA = ef.map((t, e) => t.map((n) => jg[e][n])), zA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), RA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jo = (t, e) => t << e | t >>> 32 - e;
function ch(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ta = new Uint32Array(16);
class GA extends Ju {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ta[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let h = 0; h < 5; h++) {
      const S = 4 - h, x = zA[h], L = RA[h], F = tf[h], H = ef[h], p = FA[h], I = jA[h];
      for (let $ = 0; $ < 16; $++) {
        const P = Jo(r + ch(h, s, a, u) + ta[F[$]] + x, p[$]) + l | 0;
        r = l, l = u, u = Jo(a, 10) | 0, a = s, s = P;
      }
      for (let $ = 0; $ < 16; $++) {
        const P = Jo(i + ch(S, o, c, d) + ta[H[$]] + L, I[$]) + y | 0;
        i = y, y = d, d = Jo(c, 10) | 0, c = o, o = P;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ta.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const KA = Fs(() => new GA()), VA = (t, e, n) => t & e ^ ~t & n, qA = (t, e, n) => t & e ^ t & n ^ e & n, WA = new Uint32Array([
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
]), _r = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ur = new Uint32Array(64);
class zg extends Ju {
  constructor() {
    super(64, 32, 8, !1), this.A = _r[0] | 0, this.B = _r[1] | 0, this.C = _r[2] | 0, this.D = _r[3] | 0, this.E = _r[4] | 0, this.F = _r[5] | 0, this.G = _r[6] | 0, this.H = _r[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ur[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Ur[l - 15], h = Ur[l - 2], S = Un(y, 7) ^ Un(y, 18) ^ y >>> 3, x = Un(h, 17) ^ Un(h, 19) ^ h >>> 10;
      Ur[l] = x + Ur[l - 7] + S + Ur[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Un(a, 6) ^ Un(a, 11) ^ Un(a, 25), h = d + y + VA(a, c, u) + WA[l] + Ur[l] | 0, x = (Un(r, 2) ^ Un(r, 13) ^ Un(r, 22)) + qA(r, i, s) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Ur.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class XA extends zg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const nf = Fs(() => new zg());
Fs(() => new XA());
const ea = BigInt(2 ** 32 - 1), Rl = BigInt(32);
function Rg(t, e = !1) {
  return e ? { h: Number(t & ea), l: Number(t >> Rl & ea) } : { h: Number(t >> Rl & ea) | 0, l: Number(t & ea) | 0 };
}
function YA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Rg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const ZA = (t, e) => BigInt(t >>> 0) << Rl | BigInt(e >>> 0), QA = (t, e, n) => t >>> n, JA = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, s8 = (t, e) => e, i8 = (t, e) => t, o8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, l8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function u8(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), d8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, h8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), y8 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: Rg,
  split: YA,
  toBig: ZA,
  shrSH: QA,
  shrSL: JA,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: s8,
  rotr32L: i8,
  rotlSH: o8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: l8,
  add: u8,
  add3L: f8,
  add3H: d8,
  add4L: h8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [w8, b8] = Et.split([
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
].map((t) => BigInt(t))), Pr = new Uint32Array(80), Hr = new Uint32Array(80);
class uc extends Ju {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: h, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, h, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = h | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Pr[p] = e.getUint32(n), Hr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const I = Pr[p - 15] | 0, $ = Hr[p - 15] | 0, P = Et.rotrSH(I, $, 1) ^ Et.rotrSH(I, $, 8) ^ Et.shrSH(I, $, 7), W = Et.rotrSL(I, $, 1) ^ Et.rotrSL(I, $, 8) ^ Et.shrSL(I, $, 7), G = Pr[p - 2] | 0, V = Hr[p - 2] | 0, E = Et.rotrSH(G, V, 19) ^ Et.rotrBH(G, V, 61) ^ Et.shrSH(G, V, 6), T = Et.rotrSL(G, V, 19) ^ Et.rotrBL(G, V, 61) ^ Et.shrSL(G, V, 6), N = Et.add4L(W, T, Hr[p - 7], Hr[p - 16]), B = Et.add4H(N, P, E, Pr[p - 7], Pr[p - 16]);
      Pr[p] = B | 0, Hr[p] = N | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: h, Fl: S, Gh: x, Gl: L, Hh: F, Hl: H } = this;
    for (let p = 0; p < 80; p++) {
      const I = Et.rotrSH(l, y, 14) ^ Et.rotrSH(l, y, 18) ^ Et.rotrBH(l, y, 41), $ = Et.rotrSL(l, y, 14) ^ Et.rotrSL(l, y, 18) ^ Et.rotrBL(l, y, 41), P = l & h ^ ~l & x, W = y & S ^ ~y & L, G = Et.add5L(H, $, W, b8[p], Hr[p]), V = Et.add5H(G, F, I, P, w8[p], Pr[p]), E = G | 0, T = Et.rotrSH(r, i, 28) ^ Et.rotrBH(r, i, 34) ^ Et.rotrBH(r, i, 39), N = Et.rotrSL(r, i, 28) ^ Et.rotrBL(r, i, 34) ^ Et.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      F = x | 0, H = L | 0, x = h | 0, L = S | 0, h = l | 0, S = y | 0, { h: l, l: y } = Et.add(u | 0, d | 0, V | 0, E | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const j = Et.add3L(E, N, nt);
      r = Et.add3H(j, V, T, B), i = j | 0;
    }
    ({ h: r, l: i } = Et.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Et.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Et.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h, l: S } = Et.add(this.Fh | 0, this.Fl | 0, h | 0, S | 0), { h: x, l: L } = Et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: F, l: H } = Et.add(this.Hh | 0, this.Hl | 0, F | 0, H | 0), this.set(r, i, s, o, a, c, u, d, l, y, h, S, x, L, F, H);
  }
  roundClean() {
    Pr.fill(0), Hr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class m8 extends uc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class x8 extends uc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends uc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Fs(() => new uc());
Fs(() => new m8());
const E8 = Fs(() => new x8());
Fs(() => new S8());
function Gg(t) {
  if (ne(t).byteLength != lc)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function Zi(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function oi(t) {
  return Hs.c32address(t.version, t.hash160);
}
function Ls(t, e, n) {
  const r = e || 1, i = n || IA;
  if (ay(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function rf(t) {
  const e = Hs.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
var R;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(R || (R = {}));
function A8(t) {
  if (t.type === R.PrincipalStandard)
    return oi(t.address);
  if (t.type === R.PrincipalContract)
    return `${oi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Kg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return I8(e, n);
  } else
    return v8(t);
}
function v8(t) {
  const e = rf(t);
  return { type: R.PrincipalStandard, address: e };
}
function $8(t) {
  return { type: R.PrincipalStandard, address: t };
}
function I8(t, e) {
  const n = rf(t), r = Ls(e);
  return Vg(n, r);
}
function Vg(t, e) {
  if (_i(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: R.PrincipalContract, address: t, contractName: e };
}
function Oc(t, e = !1) {
  switch (t.type) {
    case R.BoolTrue:
      return !0;
    case R.BoolFalse:
      return !1;
    case R.Int:
    case R.UInt:
      return e ? t.value.toString() : t.value;
    case R.Buffer:
      return `0x${Lt(t.buffer)}`;
    case R.OptionalNone:
      return null;
    case R.OptionalSome:
      return On(t.value);
    case R.ResponseErr:
      return On(t.value);
    case R.ResponseOk:
      return On(t.value);
    case R.PrincipalStandard:
    case R.PrincipalContract:
      return A8(t);
    case R.List:
      return t.list.map((r) => On(r));
    case R.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = On(t.data[r]);
      }), n;
    case R.StringASCII:
      return t.data;
    case R.StringUTF8:
      return t.data;
  }
}
function On(t) {
  switch (t.type) {
    case R.ResponseErr:
      return { type: jr(t), value: Oc(t, !0), success: !1 };
    case R.ResponseOk:
      return { type: jr(t), value: Oc(t, !0), success: !0 };
    default:
      return { type: jr(t), value: Oc(t, !0) };
  }
}
function jr(t) {
  switch (t.type) {
    case R.BoolTrue:
    case R.BoolFalse:
      return "bool";
    case R.Int:
      return "int";
    case R.UInt:
      return "uint";
    case R.Buffer:
      return `(buff ${t.buffer.length})`;
    case R.OptionalNone:
      return "(optional none)";
    case R.OptionalSome:
      return `(optional ${jr(t.value)})`;
    case R.ResponseErr:
      return `(response UnknownType ${jr(t.value)})`;
    case R.ResponseOk:
      return `(response ${jr(t.value)} UnknownType)`;
    case R.PrincipalStandard:
    case R.PrincipalContract:
      return "principal";
    case R.List:
      return `(list ${t.list.length} ${t.list.length ? jr(t.list[0]) : "UnknownType"})`;
    case R.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${jr(t.data[e])})`).join(" ")})`;
    case R.StringASCII:
      return `(string-ascii ${Ug(t.data).length})`;
    case R.StringUTF8:
      return `(string-utf8 ${_i(t.data).length})`;
  }
}
const qg = () => ({ type: R.BoolTrue }), Wg = () => ({ type: R.BoolFalse }), k8 = (t) => t ? qg() : Wg(), lh = BigInt("0xffffffffffffffffffffffffffffffff"), L8 = BigInt(0), uh = BigInt("0x7fffffffffffffffffffffffffffffff"), fh = BigInt("-170141183460469231731687303715884105728"), C8 = (t) => {
  const e = Oe(t, !0);
  if (e > uh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${uh}`);
  if (e < fh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${fh}`);
  return { type: R.Int, value: e };
}, zn = (t) => {
  const e = Oe(t, !1);
  if (e < L8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > lh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${lh}`);
  return { type: R.UInt, value: e };
}, Xg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: R.Buffer, buffer: t };
};
function Yg() {
  return { type: R.OptionalNone };
}
function Zg(t) {
  return { type: R.OptionalSome, value: t };
}
function T8(t) {
  return { type: R.ResponseErr, value: t };
}
function B8(t) {
  return { type: R.ResponseOk, value: t };
}
function M8(t) {
  return { type: R.List, list: t };
}
function Cs(t) {
  for (const e in t)
    if (!Sv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: R.Tuple, data: t };
}
const ke = (t) => ({ type: R.StringASCII, data: t }), N8 = (t) => ({ type: R.StringUTF8, data: t });
class Qg extends Dg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, cs.hash(e);
    const r = Qu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return cs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    cs.exists(this), cs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Jg = (t, e, n) => new Qg(t, e).update(n).digest();
Jg.create = (t, e) => new Qg(t, e);
ue.hmacSha256Sync = (t, ...e) => {
  const n = Jg.create(nf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function $i(t) {
  return {
    type: it.PublicKey,
    data: ne(t)
  };
}
function _8(t, e, n = se.Compressed) {
  const r = bA(e.data), i = new en(th(r.r), th(r.s)), s = vt.fromSignature(t, i, r.recoveryId), o = n === se.Compressed;
  return s.toHex(o);
}
function U8(t) {
  return { type: it.PublicKey, data: t };
}
function Ui(t) {
  return !Lt(t.data).startsWith("04");
}
function _a(t) {
  return t.data.slice();
}
function P8(t) {
  const e = D8(t), n = mo(e.data.slice(0, 32), e.compressed);
  return $i(Lt(n));
}
function H8(t) {
  const e = typeof t == "string" ? t : Lt(t), n = vt.fromHex(e).toHex(!0);
  return $i(n);
}
function O8(t) {
  const e = typeof t == "string" ? t : Lt(t), n = vt.fromHex(e).toHex(!1);
  return $i(n);
}
function Gl(t) {
  const e = t.readUInt8(), n = e === 4 ? CA : LA;
  return U8(pe([e, t.readBytes(n)]));
}
function D8(t) {
  const e = mA(t), n = e.length == Pg;
  return { data: e, compressed: n };
}
function F8(t, e) {
  const [n, r] = za(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = vo(r, 1) + en.fromHex(n).toCompactHex();
  return Gg(s);
}
function j8(t) {
  return P8(t.data);
}
function z8(t, e, n) {
  return typeof t == "string" && (t = Kg(t)), typeof n == "string" && (n = ph(n)), {
    type: it.Payload,
    payloadType: At.TokenTransfer,
    recipient: t,
    amount: Oe(e, !1),
    memo: n ?? ph("")
  };
}
function R8(t, e, n, r) {
  return typeof t == "string" && (t = rf(t)), typeof e == "string" && (e = Ls(e)), typeof n == "string" && (n = Ls(n)), {
    type: it.Payload,
    payloadType: At.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function dh(t, e, n) {
  return typeof t == "string" && (t = Ls(t)), typeof e == "string" && (e = Q8(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: At.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: At.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function G8() {
  return { type: it.Payload, payloadType: At.PoisonMicroblock };
}
function hh(t, e) {
  if (t.byteLength != ds)
    throw Error(`Coinbase buffer size must be ${ds} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: At.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: At.Coinbase,
    coinbaseBytes: t
  };
}
function K8(t, e, n) {
  if (t.byteLength != ds)
    throw Error(`Coinbase buffer size must be ${ds} bytes`);
  if (n.byteLength != Dl)
    throw Error(`VRF proof buffer size must be ${Dl} bytes`);
  return {
    type: it.Payload,
    payloadType: At.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === R.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Kl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Kl || (Kl = {}));
function V8(t, e, n, r, i, s, o) {
  return {
    type: it.Payload,
    payloadType: At.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function ty(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case At.TokenTransfer:
      e.push(de(t.recipient)), e.push(Wr(t.amount, !1, 8)), e.push(tr(t.memo));
      break;
    case At.ContractCall:
      e.push(tr(t.contractAddress)), e.push(tr(t.contractName)), e.push(tr(t.functionName));
      const n = new Uint8Array(4);
      ks(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(de(r));
      });
      break;
    case At.SmartContract:
      e.push(tr(t.contractName)), e.push(tr(t.codeBody));
      break;
    case At.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(tr(t.contractName)), e.push(tr(t.codeBody));
      break;
    case At.PoisonMicroblock:
      break;
    case At.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case At.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(de(t.recipient));
      break;
    case At.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(de(t.recipient ? Zg(t.recipient) : Yg())), e.push(t.vrfProof);
      break;
    case At.TenureChange:
      e.push(ne(t.tenureHash)), e.push(ne(t.previousTenureHash)), e.push(ne(t.burnViewHash)), e.push(ne(t.previousTenureEnd)), e.push(ks(new Uint8Array(4), t.previousTenureBlocks)), e.push(AA(new Uint8Array(1), t.cause)), e.push(ne(t.publicKeyHash));
      break;
  }
  return pe(e);
}
function q8(t) {
  switch (t.readUInt8Enum(At, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case At.TokenTransfer:
      const n = gn(t), r = Oe(t.readBytes(8), !1), i = ny(t);
      return z8(n, r, i);
    case At.ContractCall:
      const s = Ii(t), o = pn(t), a = pn(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const I = gn(t);
        c.push(I);
      }
      return R8(s, o, a, c);
    case At.SmartContract:
      const d = pn(t), l = pn(t, 4, 1e5);
      return dh(d, l);
    case At.VersionedSmartContract: {
      const p = t.readUInt8Enum(Fl, (P) => {
        throw new Error(`Cannot recognize ClarityVersion: ${P}`);
      }), I = pn(t), $ = pn(t, 4, 1e5);
      return dh(I, $, p);
    }
    case At.PoisonMicroblock:
      return G8();
    case At.Coinbase: {
      const p = t.readBytes(ds);
      return hh(p);
    }
    case At.CoinbaseToAltRecipient: {
      const p = t.readBytes(ds), I = gn(t);
      return hh(p, I);
    }
    case At.NakamotoCoinbase: {
      const p = t.readBytes(ds), I = gn(t), $ = t.readBytes(Dl);
      return K8(p, I, $);
    }
    case At.TenureChange:
      const y = Lt(t.readBytes(20)), h = Lt(t.readBytes(20)), S = Lt(t.readBytes(20)), x = Lt(t.readBytes(32)), L = t.readUInt32BE(), F = t.readUInt8Enum(Kl, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), H = Lt(t.readBytes(20));
      return V8(y, h, S, x, L, F, H);
  }
}
class fc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class rs extends fc {
  constructor(e) {
    super(e);
  }
}
class tn extends fc {
  constructor(e) {
    super(e);
  }
}
class Ua extends fc {
  constructor(e) {
    super(e);
  }
}
class ls extends fc {
  constructor(e) {
    super(e);
  }
}
var vn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(vn || (vn = {}));
function Vl(t) {
  return Gg(Lt(t.readBytes(lc)));
}
function ai(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function W8(t) {
  const e = t.readUInt8Enum(vn, (n) => {
    throw new tn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case vn.PublicKeyCompressed:
      return ai(se.Compressed, Gl(t));
    case vn.PublicKeyUncompressed:
      return ai(se.Uncompressed, O8(Gl(t).data));
    case vn.SignatureCompressed:
      return ai(se.Compressed, Vl(t));
    case vn.SignatureUncompressed:
      return ai(se.Uncompressed, Vl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function sf(t) {
  return ne(t.data);
}
function X8(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === se.Compressed ? vn.PublicKeyCompressed : vn.PublicKeyUncompressed), e.push(_a(H8(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === se.Compressed ? vn.SignatureCompressed : vn.SignatureUncompressed), e.push(sf(t.contents));
      break;
  }
  return pe(e);
}
function tr(t) {
  switch (t.type) {
    case it.Address:
      return $o(t);
    case it.Principal:
      return ey(t);
    case it.LengthPrefixedString:
      return ki(t);
    case it.MemoString:
      return J8(t);
    case it.AssetInfo:
      return ry(t);
    case it.PostCondition:
      return tv(t);
    case it.PublicKey:
      return _a(t);
    case it.LengthPrefixedList:
      return cf(t);
    case it.Payload:
      return ty(t);
    case it.TransactionAuthField:
      return X8(t);
    case it.MessageSignature:
      return sf(t);
  }
}
function Y8() {
  return {
    type: it.Address,
    version: Na.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function of(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Wt.SerializeP2WPKH || e === Wt.SerializeP2WSH || e === Wt.SerializeP2WSHNonSequential) && !r.every(Ui))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Wt.SerializeP2PKH:
      return Zi(t, wv(r[0].data));
    case Wt.SerializeP2WPKH:
      return Zi(t, bv(r[0].data));
    case Wt.SerializeP2SH:
    case Wt.SerializeP2SHNonSequential:
      return Zi(t, mv(n, r.map(_a)));
    case Wt.SerializeP2WSH:
    case Wt.SerializeP2WSHNonSequential:
      return Zi(t, xv(n, r.map(_a)));
  }
}
function $o(t) {
  const e = [];
  return e.push(ne(vo(t.version, 1))), e.push(ne(t.hash160)), pe(e);
}
function Ii(t) {
  const e = ac(Lt(t.readBytes(1))), n = Lt(t.readBytes(20));
  return { type: it.Address, version: e, hash160: n };
}
function ey(t) {
  const e = [];
  return e.push(t.prefix), e.push($o(t.address)), t.prefix === ho.Contract && e.push(ki(t.contractName)), pe(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(ho, (i) => {
    throw new tn(`Unexpected Principal payload type: ${i}`);
  }), n = Ii(t);
  if (e === ho.Standard)
    return { type: it.Principal, prefix: e, address: n };
  const r = pn(t);
  return {
    type: it.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ki(t) {
  const e = [], n = _i(t.content), r = n.byteLength;
  return e.push(ne(vo(r, t.lengthPrefixBytes))), e.push(n), pe(e);
}
function pn(t, e, n) {
  e = e || 1;
  const r = ac(Lt(t.readBytes(e))), i = Zu(t.readBytes(r));
  return Ls(i, e, n ?? 128);
}
function Q8(t) {
  return Ls(t, 4, 1e5);
}
function ph(t) {
  if (t && ay(t, Ba))
    throw new Error(`Memo exceeds maximum length of ${Ba} bytes`);
  return { type: it.MemoString, content: t };
}
function J8(t) {
  const e = [], n = _i(t.content), r = yv(Lt(n), Ba * 2);
  return e.push(ne(r)), pe(e);
}
function ny(t) {
  let e = Zu(t.readBytes(Ba));
  return e = e.replace(/\u0000*$/, ""), { type: it.MemoString, content: e };
}
function ry(t) {
  const e = [];
  return e.push($o(t.address)), e.push(ki(t.contractName)), e.push(ki(t.assetName)), pe(e);
}
function ql(t) {
  return {
    type: it.AssetInfo,
    address: Ii(t),
    contractName: pn(t),
    assetName: pn(t)
  };
}
function af(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function cf(t) {
  const e = t.values, n = [];
  n.push(ne(vo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(tr(r));
  return pe(n);
}
function sy(t, e, n) {
  const r = ac(Lt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case it.Address:
        i.push(Ii(t));
        break;
      case it.LengthPrefixedString:
        i.push(pn(t));
        break;
      case it.MemoString:
        i.push(ny(t));
        break;
      case it.AssetInfo:
        i.push(ql(t));
        break;
      case it.PostCondition:
        i.push(ev(t));
        break;
      case it.PublicKey:
        i.push(Gl(t));
        break;
      case it.TransactionAuthField:
        i.push(W8(t));
        break;
    }
  return af(i, n);
}
function tv(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ey(t.principal)), (t.conditionType === Ve.Fungible || t.conditionType === Ve.NonFungible) && e.push(ry(t.assetInfo)), t.conditionType === Ve.NonFungible && e.push(de(t.assetName)), e.push(t.conditionCode), t.conditionType === Ve.STX || t.conditionType === Ve.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new rs("The post-condition amount may not be larger than 8 bytes");
    e.push(Wr(t.amount, !1, 8));
  }
  return pe(e);
}
function ev(t) {
  const e = t.readUInt8Enum(Ve, (o) => {
    throw new tn(`Could not read ${o} as PostConditionType`);
  }), n = Z8(t);
  let r, i, s;
  switch (e) {
    case Ve.STX:
      return r = t.readUInt8Enum(fo, (a) => {
        throw new tn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Lt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: Ve.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Ve.Fungible:
      return i = ql(t), r = t.readUInt8Enum(fo, (a) => {
        throw new tn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Lt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: Ve.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case Ve.NonFungible:
      i = ql(t);
      const o = gn(t);
      return r = t.readUInt8Enum(jl, (a) => {
        throw new tn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: Ve.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function qn(t, e) {
  return pe([t, e]);
}
function nv(t) {
  return new Uint8Array([t.type]);
}
function rv(t) {
  return t.type === R.OptionalNone ? new Uint8Array([t.type]) : qn(t.type, de(t.value));
}
function sv(t) {
  const e = new Uint8Array(4);
  return ks(e, t.buffer.length, 0), qn(t.type, cc(e, t.buffer));
}
function iv(t) {
  const e = Yu(dA(t.value, BigInt(kA)), Hg);
  return qn(t.type, e);
}
function ov(t) {
  const e = Yu(t.value, Hg);
  return qn(t.type, e);
}
function av(t) {
  return qn(t.type, $o(t.address));
}
function cv(t) {
  return qn(t.type, cc($o(t.address), ki(t.contractName)));
}
function lv(t) {
  return qn(t.type, de(t.value));
}
function uv(t) {
  const e = [], n = new Uint8Array(4);
  ks(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = de(r);
    e.push(i);
  }
  return qn(t.type, pe(e));
}
function fv(t) {
  const e = [], n = new Uint8Array(4);
  ks(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Ls(i);
    e.push(ki(s));
    const o = de(t.data[i]);
    e.push(o);
  }
  return qn(t.type, pe(e));
}
function iy(t, e) {
  const n = [], r = e == "ascii" ? Ug(t.data) : _i(t.data), i = new Uint8Array(4);
  return ks(i, r.length, 0), n.push(i), n.push(r), qn(t.type, pe(n));
}
function dv(t) {
  return iy(t, "ascii");
}
function hv(t) {
  return iy(t, "utf8");
}
function de(t) {
  switch (t.type) {
    case R.BoolTrue:
    case R.BoolFalse:
      return nv(t);
    case R.OptionalNone:
    case R.OptionalSome:
      return rv(t);
    case R.Buffer:
      return sv(t);
    case R.UInt:
      return ov(t);
    case R.Int:
      return iv(t);
    case R.PrincipalStandard:
      return av(t);
    case R.PrincipalContract:
      return cv(t);
    case R.ResponseOk:
    case R.ResponseErr:
      return lv(t);
    case R.List:
      return uv(t);
    case R.Tuple:
      return fv(t);
    case R.StringASCII:
      return dv(t);
    case R.StringUTF8:
      return hv(t);
    default:
      throw new rs("Unable to serialize. Invalid Clarity Value.");
  }
}
function pv(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const gh = /* @__PURE__ */ new Map();
function oy(t, e) {
  const n = gh.get(t);
  if (n !== void 0)
    return n(e);
  const r = pv(t);
  return gh.set(t, r), oy(t, e);
}
class no {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return vA(this.readBytes(4), 0);
  }
  readUInt8() {
    return EA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return xA(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Lt(n);
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
    if (oy(e, r))
      return r;
    throw n(r);
  }
}
function gn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new no(ne(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new no(t) : e = t;
  switch (e.readUInt8Enum(R, (r) => {
    throw new tn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case R.Int:
      return C8(e.readBytes(16));
    case R.UInt:
      return zn(e.readBytes(16));
    case R.Buffer:
      const r = e.readUInt32BE();
      return Xg(e.readBytes(r));
    case R.BoolTrue:
      return qg();
    case R.BoolFalse:
      return Wg();
    case R.PrincipalStandard:
      const i = Ii(e);
      return $8(i);
    case R.PrincipalContract:
      const s = Ii(e), o = pn(e);
      return Vg(s, o);
    case R.ResponseOk:
      return B8(gn(e));
    case R.ResponseErr:
      return T8(gn(e));
    case R.OptionalNone:
      return Yg();
    case R.OptionalSome:
      return Zg(gn(e));
    case R.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(gn(e));
      return M8(c);
    case R.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const L = pn(e).content;
        if (L === void 0)
          throw new tn('"content" is undefined');
        d[L] = gn(e);
      }
      return Cs(d);
    case R.StringASCII:
      const l = e.readUInt32BE(), y = yA(e.readBytes(l));
      return ke(y);
    case R.StringUTF8:
      const h = e.readUInt32BE(), S = Zu(e.readBytes(h));
      return N8(S);
    default:
      throw new tn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const gv = (t) => t.length % 2 == 0 ? t : `0${t}`, yv = (t, e) => t.padEnd(e, "0"), ay = (t, e) => t ? _i(t).length > e : !1;
function Wl(t) {
  return Ip(t);
}
const po = (t) => KA(nf(t)), lf = (t) => Lt(E8(t)), wv = (t) => Lt(po(t)), bv = (t) => {
  const e = po(t), n = cc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = po(n);
  return Lt(r);
}, mv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = po(r);
  return Lt(i);
}, xv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = nf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = pe(s), a = po(o);
  return Lt(a);
};
function Sv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function cy(t) {
  const e = de(t);
  return `0x${Lt(e)}`;
}
function Ev(t) {
  return gn(t);
}
const ui = (t) => {
  try {
    return Hs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function uf() {
  return {
    type: it.MessageSignature,
    data: Lt(new Uint8Array(lc))
  };
}
function ly(t, e, n, r) {
  const i = of(0, t, 1, [$i(e)]).hash160, s = Ui($i(e)) ? se.Compressed : se.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Oe(n, !1),
    fee: Oe(r, !1),
    keyEncoding: s,
    signature: uf()
  };
}
function go(t) {
  return "signature" in t;
}
function yh(t) {
  return t === Wt.SerializeP2SH || t === Wt.SerializeP2WSH;
}
function Av(t) {
  return t === Wt.SerializeP2SHNonSequential || t === Wt.SerializeP2WSHNonSequential;
}
function wh(t) {
  const e = Wl(t);
  return e.nonce = 0, e.fee = 0, go(e) ? e.signature = uf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function vv(t) {
  const e = [
    t.hashMode,
    ne(t.signer),
    Wr(t.nonce, !1, 8),
    Wr(t.fee, !1, 8),
    t.keyEncoding,
    sf(t.signature)
  ];
  return pe(e);
}
function $v(t) {
  const e = [
    t.hashMode,
    ne(t.signer),
    Wr(t.nonce, !1, 8),
    Wr(t.fee, !1, 8)
  ], n = af(t.fields);
  e.push(cf(n));
  const r = new Uint8Array(2);
  return SA(r, t.signaturesRequired, 0), e.push(r), pe(e);
}
function Iv(t, e) {
  const n = Lt(e.readBytes(20)), r = BigInt(`0x${Lt(e.readBytes(8))}`), i = BigInt(`0x${Lt(e.readBytes(8))}`), s = e.readUInt8Enum(se, (a) => {
    throw new tn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Wt.SerializeP2WPKH && s != se.Compressed)
    throw new tn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Vl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function kv(t, e) {
  const n = Lt(e.readBytes(20)), r = BigInt("0x" + Lt(e.readBytes(8))), i = BigInt("0x" + Lt(e.readBytes(8))), s = sy(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case it.PublicKey:
        Ui(u.contents) || (o = !0);
        break;
      case it.MessageSignature:
        if (u.pubKeyEncoding === se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ls("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Wt.SerializeP2WSH || t === Wt.SerializeP2WSHNonSequential))
    throw new ls("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Dc(t) {
  return go(t) ? vv(t) : $v(t);
}
function Fc(t) {
  const e = t.readUInt8Enum(Wt, (n) => {
    throw new tn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH ? Iv(e, t) : kv(e, t);
}
function uy(t, e, n, r) {
  const s = t + Lt(new Uint8Array([e])) + Lt(Wr(n, !1, 8)) + Lt(Wr(r, !1, 8));
  if (ne(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return lf(ne(s));
}
function fy(t, e, n) {
  const r = 33 + lc, i = Ui(e) ? se.Compressed : se.Uncompressed, s = t + gv(i.toString(16)) + n.data, o = ne(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return lf(o);
}
function Lv(t, e, n, r, i) {
  const s = uy(t, e, n, r), o = F8(i, s), a = j8(i), c = fy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function dy(t, e, n, r, i, s) {
  const o = uy(t, e, n, r), a = $i(_8(o, s, i)), c = fy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Cv() {
  const t = ly(Wt.SerializeP2PKH, "", 0, 0);
  return t.signer = Y8().hash160, t.keyEncoding = se.Compressed, t.signature = uf(), t;
}
function bh(t, e, n) {
  return go(t) ? Tv(t, e, n) : Bv(t, e, n);
}
function Tv(t, e, n) {
  const { pubKey: r, nextSigHash: i } = dy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = of(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new ls(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function Bv(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        Ui(c.contents) || (s = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === se.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = dy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (yh(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new ls("Too many signatures");
        break;
    }
  if (yh(t.hashMode) && o !== t.signaturesRequired || Av(t.hashMode) && o < t.signaturesRequired)
    throw new ls("Incorrect number of signatures");
  if (s && (t.hashMode === Wt.SerializeP2WSH || t.hashMode === Wt.SerializeP2WSHNonSequential))
    throw new ls("Uncompressed keys are not allowed in this hash mode");
  const a = of(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ls(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function hy(t) {
  return {
    authType: le.Standard,
    spendingCondition: t
  };
}
function py(t, e) {
  return {
    authType: le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ly(Wt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function mh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case le.Standard:
        return hy(wh(t.spendingCondition));
      case le.Sponsored:
        return py(wh(t.spendingCondition), Cv());
      default:
        throw new Ua("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Mv(t, e) {
  switch (t.authType) {
    case le.Standard:
      return bh(t.spendingCondition, e, le.Standard);
    case le.Sponsored:
      return bh(t.spendingCondition, e, le.Standard);
    default:
      throw new Ua("Invalid origin auth type");
  }
}
function Nv(t, e) {
  switch (t.authType) {
    case le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Oe(e, !1)
      };
      return { ...t, spendingCondition: n };
    case le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Oe(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function _v(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Oe(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Uv(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Oe(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Pv(t, e) {
  const n = {
    ...e,
    nonce: Oe(e.nonce, !1),
    fee: Oe(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Hv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case le.Standard:
      e.push(Dc(t.spendingCondition));
      break;
    case le.Sponsored:
      e.push(Dc(t.spendingCondition)), e.push(Dc(t.sponsorSpendingCondition));
      break;
  }
  return pe(e);
}
function Ov(t) {
  const e = t.readUInt8Enum(le, (r) => {
    throw new tn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case le.Standard:
      return n = Fc(t), hy(n);
    case le.Sponsored:
      n = Fc(t);
      const r = Fc(t);
      return py(n, r);
  }
}
class Dv {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Oe(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? $A, this.postConditionMode = s ?? vi.Deny, this.postConditions = i ?? af([]), o)
      this.anchorMode = TA(o);
    else
      switch (r.payloadType) {
        case At.Coinbase:
        case At.CoinbaseToAltRecipient:
        case At.NakamotoCoinbase:
        case At.PoisonMicroblock:
        case At.TenureChange:
          this.anchorMode = Ke.OnChainOnly;
          break;
        case At.ContractCall:
        case At.SmartContract:
        case At.VersionedSmartContract:
        case At.TokenTransfer:
          this.anchorMode = Ke.Any;
          break;
      }
  }
  signBegin() {
    const e = Wl(this);
    return e.auth = mh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Wl(this);
    return e.auth = mh(e.auth), e.txid();
  }
  verifyOrigin() {
    return Mv(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, le.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === le.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, le.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !go(n)) {
      const r = Ui(e);
      n.fields.push(ai(r ? se.Compressed : se.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = Lv(n, r, e.fee, e.nonce, i);
    return go(e) ? e.signature = s : e.fields.push(ai(i.data.byteLength === Pg ? se.Compressed : se.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return lf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != le.Sponsored)
      throw new Ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Pv(this.auth, e);
  }
  setFee(e) {
    this.auth = Nv(this.auth, e);
  }
  setNonce(e) {
    this.auth = _v(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != le.Sponsored)
      throw new Ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Uv(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new rs('"version" is undefined');
    if (this.chainId === void 0)
      throw new rs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new rs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new rs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new rs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ks(n, this.chainId, 0), e.push(n), e.push(Hv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(cf(this.postConditions)), e.push(ty(this.payload)), pe(e);
  }
}
function Pa(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new no(ne(t.slice(2))) : e = new no(ne(t)) : t instanceof Uint8Array ? e = new no(t) : e = t;
  const n = e.readUInt8Enum(Ma, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = Ov(e), s = e.readUInt8Enum(Ke, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(vi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = sy(e, it.PostCondition), c = q8(e);
  return new Dv(n, i, c, a, o, s, r);
}
const Fv = k8, ro = zn, jv = Xg;
const zv = /* @__PURE__ */ new Set([4001, -31001]), Rv = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Gv = ["result", "data", "payload", "response", "params"], xh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], dc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), js = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, rr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Kv = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), gy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => Kv(s, r)) === i
  );
}, yy = (t) => t ? gy(js()).some(
  (e) => {
    var n;
    return e.id === t && (dc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, wy = () => {
  if (typeof window > "u")
    return;
  const t = js(), e = gy(t).filter(
    (n) => {
      var r;
      return dc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = rr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Rv) {
    const r = rr(t, n) ?? (t === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Vv = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = js(), n = rr(e, t) ?? (e === window ? void 0 : rr(window, t)) ?? Qa(t);
  if (n)
    return n;
  if (dc(t) || yy(t))
    return wy();
}, na = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, qv = ["blockstack-session", "blockstack"], Wv = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of qv) {
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
Wv();
const by = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Je = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Xv = (t) => {
  const e = Je(t);
  if (!e)
    return null;
  const n = by(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, Yv = (t) => {
  const e = Je(t);
  if (!e)
    return null;
  const n = by(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Xl = (t, e = "mainnet") => {
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
      return Xl(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Xl(r, e);
  }
  return e;
}, hs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, yo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return ui(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = yo(i, e + 1);
      if (s)
        return s;
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
  for (const i of r) {
    if (!(i in n))
      continue;
    const s = yo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && ui(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ui(n.testnet) ? n.testnet.trim() : null;
}, Sh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, my = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && zv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ts = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Je(n == null ? void 0 : n.message) ?? Je(e.message) ?? Je(e.error) ?? Je(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Li = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ts(e);
    if (e.status === "error")
      throw Ts(e.result ?? e);
  }
  return t;
}, Eh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Li(r);
  } catch (r) {
    throw Ts(r);
  }
}, xy = () => wy(), ff = () => {
  if (typeof window > "u")
    return;
  const t = js();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = rr(t, e) ?? (t === window ? void 0 : rr(window, e));
    if (n)
      return n;
  }
}, Ah = () => {
  if (typeof window > "u")
    return;
  const t = ff();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = js();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = rr(e, n) ?? (e === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, da = (t) => {
  var r, i;
  const e = xs();
  if (dc(e) || yy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = js() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === xy();
}, jc = (t) => {
  const e = Yv(t);
  if (!e)
    return null;
  try {
    const n = Pa(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ha = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = jc(t), r = Xv(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Je(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ha(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of xh)
    if (jc(i[a])) {
      s = Je(i[a]);
      break;
    }
  const o = Je(i.txId) || Je(i.txid) || Je(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? Je(i.txRaw) ?? void 0
    };
  for (const a of xh) {
    const c = jc(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: Je(i[a]) ?? void 0
      };
  }
  for (const a of Gv) {
    const c = i[a], u = Ha(c, e + 1);
    if (u)
      return {
        ...i,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, zc = (t) => {
  const e = Ha(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Zv = (t) => {
  const e = Ha(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Qv = (t) => ({
  ...t,
  fee: hs(t.fee),
  nonce: hs(t.nonce),
  sponsored: t.sponsored === !0
}), vh = (t) => ({
  recipient: t.recipient,
  amount: hs(t.amount) ?? "0",
  memo: t.memo,
  network: Xl(t.network),
  address: t.stxAddress,
  fee: hs(t.fee),
  nonce: hs(t.nonce),
  sponsored: t.sponsored ?? !1
}), Sy = "WALLET_ADDRESS_MISMATCH", Jv = 45e3;
let so = null;
const Yl = (t) => {
  t && (so = { address: t, at: Date.now() });
}, t6 = () => {
  so = null;
}, e6 = () => so && Date.now() - so.at <= Jv ? so.address : null, n6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, r6 = async (t) => {
  t6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Li(await t.request("wallet_connect")), n = yo(e);
  return Yl(n), n;
}, s6 = async (t, e, n, r) => {
  try {
    return Li(await t.request(e, n));
  } catch (i) {
    const s = Ts(i);
    if (!n6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await r6(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: o ? Sy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Li(await t.request(e, n));
    } catch (a) {
      throw Ts(a);
    }
  }
};
let $h = 3e4;
const i6 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${$h / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, $h);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, o6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Sy }
      );
    return c;
  }, i = e6();
  if (i)
    return na(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  na(n, "account-read");
  try {
    const c = Li(
      await i6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = yo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (my(c))
      throw Ts(c);
    na(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return Yl(s), r(s, "wallet_getAccount");
  let o;
  na(n, "account-reconnect");
  try {
    o = Li(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ts(c);
  }
  const a = yo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Yl(a), r(a, "wallet_connect");
}, a6 = async (t, e) => {
  if (!da(t)) {
    const s = await Eh(
      t,
      "stx_transferStx",
      vh(e)
    );
    return zc(s);
  }
  const n = ff();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Eh(
      n,
      "stx_transferStx",
      vh(e)
    );
    return zc(s);
  }
  const r = xy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await o6(r, e.stxAddress);
  const i = await s6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: hs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: hs(e.fee) } : {}
    },
    e.stxAddress
  );
  return zc(i);
}, c6 = () => xs(), Ey = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = xs(), e = t ? Vv(t) : void 0;
  if (e)
    return e;
  const n = js() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ih = (t, e) => {
  const n = Ey(), r = Qv({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, Zv(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Qo(r, e);
  if (da(n) && !ff()) {
    const i = Ah();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: xs(),
        route: "legacy-transaction-request"
      }), Qo(r, i);
  }
  return void a6(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Sh(i) && da(n)) {
      const a = Ah();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: xs(),
          route: "legacy-transaction-request"
        }), Qo(r, a);
        return;
      }
    }
    if (Sh(i) && !da(n)) {
      Qo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), my(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, kh = (t) => cy(t).replace(/^0x/, ""), Lh = "This wallet cannot sign messages. Try Xverse or Leather.", Ch = (t) => typeof (t == null ? void 0 : t.request) == "function", Th = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", l6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, u6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function f6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: kh(e.message),
    domain: kh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function d6(t, e) {
  const n = await iA({
    domain: e.domain,
    message: e.message,
    network: oc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Bh(t) {
  var i, s;
  const e = c6() || "", n = /xverse/i.test(e);
  let r = Ey();
  if (n && !Th(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (Th(r))
    try {
      return await d6(r, t);
    } catch (o) {
      if (n || !Ch(r) || !u6(o)) throw o;
    }
  if (!n && Ch(r))
    try {
      return await f6(r, t);
    } catch (o) {
      throw l6(o) ? new Error(Lh) : o;
    }
  throw new Error(Lh);
}
const Mh = 1000000n, us = 1000000n, Zl = 50n, $n = 3000n, Io = 300n, qi = 3000n, h6 = 50000n, Rc = 200n, sr = (t) => t + Zl;
function xn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Mh}.${(n % Mh).toString().padStart(6, "0")}`;
}
function Nh(t, e = Io) {
  return t <= $n ? 0 : Number((t - $n) / sr(e));
}
function Gc(t, e = 0n) {
  const n = us - t - e;
  return n > 0n ? n : 0n;
}
function p6(t, e = Io) {
  return t > us ? "over" : t < $n + sr(e) ? "empty" : t < h6 ? "low" : "ok";
}
const g6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", y6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", w6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function b6(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || w6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== g6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ay = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Kc = 3, m6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Ql, vy] = Ay.split("."), fn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Jl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function x6(t) {
  return fn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Vr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function $y(t, e = []) {
  const n = await Vr(`/v2/contracts/call-read/${Ql}/${vy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Ql, arguments: e.map((r) => "0x" + fn(de(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return On(gn(n.result));
}
async function S6() {
  const t = await Vr(`/v2/contracts/source/${Ql}/${vy}?proof=0`);
  if (typeof t.source != "string" || await x6(t.source) !== y6) throw Error("Deployed source does not match the tested helper.");
  if (b6(await $y("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Iy(t) {
  return t.startsWith("SP") && ui(t) && !t.includes(".");
}
async function E6(t) {
  var r;
  if (!Iy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Vr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Vr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function A6(t) {
  const e = await Vr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function v6(t, e) {
  var i, s;
  const n = await $y("get-owner", [ro(t), ro(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Iy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function $6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Jl(t), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const i = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(i, { feeRejected: !0 }), i;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== e.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function I6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function k6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Pa(Jl(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || oi(Zi(Na.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || oi(r.contractAddress) + "." + r.contractName.content !== Ay || r.functionName.content !== "play" || r.functionArgs.length !== 3 || fn(de(r.functionArgs[0])) !== fn(de(ro(t.core))) || fn(de(r.functionArgs[1])) !== fn(de(ro(t.song))) || fn(de(r.functionArgs[2])) !== fn(de(jv(Jl(t.id)))) || t.amount !== "50" || e.postConditionMode !== vi.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== fo.Equal || s.principal.prefix !== 2 || oi(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || oi(r.contractAddress) + "." + r.contractName.content !== m6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || fn(de(r.functionArgs[0])) !== fn(de(ro(t.song))) || typeof t.liked != "boolean" || fn(de(r.functionArgs[1])) !== fn(de(Fv(t.liked))) || t.amount !== "0" || e.postConditionMode !== vi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || On(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const L6 = "xtrata.xyz/radio/listening-wallet", C6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Bs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ui(t), T6 = (t) => ({
  domain: Cs({ name: ke(L6), version: ke("1"), "chain-id": zn(1) }),
  message: Cs({
    purpose: ke(C6),
    main: ke(t.main),
    listening: ke(t.listening),
    issued: zn(t.issued)
  })
}), ky = 100000n, B6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function M6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Bs(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= ky).sort(B6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const ra = 50;
function Oa(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const i = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(i) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: i, txIndex: s });
  }
  return { total: e.total, transfers: n };
}
async function N6(t, e, n = 4) {
  if (!Bs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ra}&offset=${o}`, i = Oa(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - ra);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= ra ? i : Oa(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = M6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - ra);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Qn = 50, _6 = 6, U6 = 20, _h = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Uh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], i = [];
  for (const s of n.results) {
    const o = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (i.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: i };
}
async function P6(t, e, n) {
  if (!Bs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = Oa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Qn}&offset=0`));
    if (!i || i.total > _6 * Qn) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Qn; o < i.total; o += Qn) {
      const a = Oa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Qn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Qn}&offset=${u}`, a = Uh(await e(o(0)), t);
      if (!a || a.total > U6 * Qn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = Qn; u < a.total; u += Qn) {
        const d = Uh(await e(o(u)), t);
        if (!d || !d.rows.length) return { ok: !1 };
        for (const l of d.rows) c.add(l);
        for (const l of d.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function H6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(_h).map((l, y) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: y } : Bs(l.sender) && h >= ky ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: h, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Bs(l.recipient) && l.amount > 0n).sort(_h), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let h = y;
    for (const S of l) {
      if (h <= 0n) break;
      const x = S.left < h ? S.left : h;
      S.left -= x, h -= x;
    }
    return h;
  };
  for (const l of o) {
    const y = u(i.filter((h) => h.to === l.recipient), l.amount);
    y > 0n && u(i, y);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, h = d.get(y);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function O6(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), i = t.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function Ph(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const tu = [50000n, 100000n, 250000n], Wi = ["prepared", "signed", "unknown", "pending"], D6 = 30 * 6e4, Qs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, F6 = 3e3, Hh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Vc = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function j6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, h = null, S = !1, x = "", L = "", F = 0, H, p = null, I, $ = [], P, W = -1 / 0;
  const G = /* @__PURE__ */ new Set();
  let V = null, E = !1, T = 0, N = null, B = null, nt = !1, j = null, jt = !1, dt = null, ie = !1, v = !1, M = !1, ht = !1, $t = !1, It = 0, Ct = null, zt = Promise.resolve();
  const Rt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Io.toString()), Ot = (b) => !!s && !(s.features ?? []).includes(b), Qt = (b, A) => `xtrata.ppp.v1.${b}:${A}`, Yt = (b = s == null ? void 0 : s.address) => {
    if (!b) return [];
    try {
      const A = JSON.parse(t.store.get(Qt("entries", b)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, Dt = (b) => {
    const A = [b, ...Yt(b.address).filter((O) => !(O.txid === b.txid && O.kind === b.kind))].slice(0, 200);
    t.store.set(Qt("entries", b.address), JSON.stringify(A));
  }, Se = (b = s == null ? void 0 : s.address) => !!b && t.store.get(Qt("on", b)) !== "0", Ee = (b) => {
    s != null && s.address && t.store.set(Qt("on", s.address), b ? "1" : "0");
  }, be = () => Yt().filter((b) => Wi.includes(b.status)), sn = () => et() ? [...be(), ...Yt(D()).filter((b) => Wi.includes(b.status))] : be(), Me = () => C(s == null ? void 0 : s.address), C = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(t.store.get(Qt("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, q = (b, A = s == null ? void 0 : s.address) => {
    A && t.store.set(Qt("deposit", A), JSON.stringify(b));
  }, D = () => Ot("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), et = () => !!(s != null && s.address) && D() !== s.address, ot = () => et() ? c && c.for === D() ? c.value : void 0 : o, Mt = (b) => b !== void 0 && b < $n + Rc, Tt = () => be().filter((b) => t.now() - b.created > D6 && G.has(b.txid)), Nt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), ut = () => Nt() && !(s != null && s.linked), wt = () => {
    const b = t.main();
    return !ut() && !!b && !!(s != null && s.linked) && s.linked !== b;
  }, w = (b) => Qt("return-to", b), m = (b = s == null ? void 0 : s.address) => {
    if (!b) return;
    const A = t.store.get(w(b));
    return A && Bs(A) && A !== b ? A : void 0;
  }, f = (b = s == null ? void 0 : s.address) => V && V.for === b ? V.res : null;
  function U() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const b = m();
    if (b) return { to: b, kind: "chosen" };
    const A = f();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const rt = (b) => Qt("gift", b);
  function Z() {
    const b = s == null ? void 0 : s.address;
    if (!b) return null;
    if ((j == null ? void 0 : j.for) === b) return j.info;
    try {
      const A = JSON.parse(t.store.get(rt(b)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function _t() {
    var tt;
    const b = s == null ? void 0 : s.address;
    if (!b || !t.giftInfo || !((tt = e == null ? void 0 : e.gifts) != null && tt.enabled) || jt) return;
    const A = (j == null ? void 0 : j.for) === b ? j : null, O = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < O) return;
    jt = !0;
    const Y = Z();
    try {
      const K = await t.giftInfo(b);
      j = { for: b, info: K, ok: !0, at: t.now() }, t.store.set(rt(b), JSON.stringify(K));
    } catch {
      j = { for: b, info: Y, ok: !1, at: t.now() };
    } finally {
      jt = !1;
    }
  }
  const fe = () => Yt().reduce((b, A) => Wi.includes(A.status) ? b + BigInt(A.amount || "0") + BigInt(A.fee || "0") : b, 0n);
  function ge() {
    if (o === void 0) return 0;
    const b = o - fe() - BigInt(Zt.length) * sr(Rt());
    return b > 0n ? Nh(b, Rt()) : 0;
  }
  const ye = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", yn = "EMPTY — ADD STX TO PLAY";
  function on() {
    var O;
    const b = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((O = Z()) != null && O.player) && !b) return null;
    const A = (Y, tt) => ({ reason: Y, text: tt });
    switch (kt()) {
      case "connect":
      case "wrong-wallet":
        return A("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return A("locked", "UNLOCK TO LISTEN");
      case "link":
        return A("link", "FINISH SETUP TO LISTEN");
      case "over":
        return A("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Me() ? A("arriving", "YOUR PLAYS ARE ARRIVING") : A("out", et() ? ye : yn);
      case "ready":
        return !Se() || !(s != null && s.session) || s.session.playsLeft < 1 ? A("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : M ? ge() < 1 ? A("out", et() ? ye : yn) : null : A("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const wn = () => {
    var b;
    return !!(s != null && s.address) && et() && !!((b = Z()) != null && b.player);
  };
  function Wn() {
    return wn() ? { locked: !0, known: !0 } : null;
  }
  const me = 3 * 6e4, cr = () => !!Z() && !!t.history && !(s != null && s.linked);
  async function We() {
    const b = s.address, A = Z(), { balance: O, nonce: Y } = await t.chain.account(b), tt = await t.history(b, !0);
    if (!tt.ok) return null;
    const K = H6({ self: b, balance: O, inbound: tt.inbound, outgoing: tt.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!K.ok) return null;
    const at = O6(K.parts, qi);
    return { balance: O, nonce: Y, parts: K.parts, steps: at.steps, tooSmall: at.tooSmall.length };
  }
  const gt = () => ie ? { state: "unavailable" } : !dt || t.now() - dt.at > me || o !== void 0 && o !== dt.balance ? { state: "none" } : dt.plan;
  function kt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const b = t.main();
    if (!ut()) {
      if (!b) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : wt() ? "wrong-wallet" : s.state === "known" ? "locked" : !ut() && s.linked !== b ? "link" : o === void 0 ? "loading" : o > us ? "over" : o < $n + sr(Rt()) ? "fund" : "ready" : "loading";
  }
  const oe = () => {
    var b, A, O, Y;
    return {
      step: kt(),
      busy: u,
      message: x,
      error: L,
      notice: an(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : p6(o, Rt()),
      playsLeft: o === void 0 ? 0 : Nh(o, Rt()),
      allowance: o === void 0 ? us : Gc(o, BigInt(((b = Me()) == null ? void 0 : b.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Se(),
      entries: Yt(),
      depositTxid: ((A = Me()) == null ? void 0 : A.txid) ?? H,
      depositPending: !!Me(),
      walletOutdated: Ot("like"),
      linkedListening: P && P === t.main() ? $.map((tt) => tt.listening) : [],
      serverLinked: !!p && I === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: Tt().length,
      armed: ht,
      queued: Zt.length,
      solo: ut(),
      returnTo: (O = U()) == null ? void 0 : O.to,
      returnToKind: (Y = U()) == null ? void 0 : Y.kind,
      funderState: (() => {
        const tt = f();
        return tt ? tt.ok ? tt.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const tt = f();
        return !!tt && tt.ok && tt.distinct > 1;
      })(),
      walletCannotSolo: ut() && Ot("standalone"),
      walletCannotMulti: Ot("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((tt) => tt !== t.main() && tt !== (s == null ? void 0 : s.linked)),
      creditedTo: ut() && (s != null && s.address) && (N == null ? void 0 : N.for) === s.address && N.main ? N.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Qt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (B == null ? void 0 : B.for) === s.address && B.unused,
      gift: (() => {
        const tt = Z();
        return tt ? { player: tt.player, from: tt.from, source: tt.source, amount: tt.amount } : null;
      })(),
      giftPlays: Z() ? ge() : 0,
      giftStop: on(),
      albumLock: Wn(),
      returnPlan: gt(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Ot("slots"),
      likeFunds: (() => {
        var at;
        const tt = D();
        if (!tt || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const K = ot();
        return { address: tt, balance: K, low: Mt(K), album: et(), pending: !!C(tt), txid: (at = C(tt)) == null ? void 0 : at.txid, main: t.main() };
      })()
    };
  }, an = () => F ? F < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Pt = (b, A = "") => {
    x = b, L = A, t.changed();
  };
  async function Ae(b, A) {
    if (!u) {
      u = b, L = "", t.changed();
      try {
        await A();
      } catch (O) {
        const Y = O instanceof Error ? O.message : String(O);
        L = /Cancelled in the listening wallet/.test(Y) ? "" : Y, L || (x = "Not now. Nothing was signed.", $t = !0);
      } finally {
        u = null, await ve(!0);
      }
    }
  }
  const lr = () => !!(e != null && e.enabled) && e.here && (ut() || !!t.main() && e.allowed), De = () => lr() && !wt(), Xn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Fe = () => {
    if (wt()) throw new Error(Xn());
  };
  async function cn() {
    if (!lr()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const je = (b) => {
    const A = t.main();
    return b.request("listening.status", A ? { main: A } : void 0);
  };
  async function ur(b = !1) {
    s != null && s.address && (!b && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await Ce(b)));
  }
  async function Ce(b = !1) {
    const A = D();
    if (!(!et() || !A || (s == null ? void 0 : s.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function zs(b) {
    if ((P !== b || t.now() - W >= 6e4) && ($ = await t.links(b), P = b, W = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === b) return;
    const A = `${b}:${s.address}`;
    I === A && p || (p = $.find((O) => O.listening === s.address) ?? null, I = A);
  }
  async function Pi() {
    const b = s == null ? void 0 : s.address;
    if (!ut() || !b || s != null && s.linked || !t.funder || E || !o || o <= 0n) return;
    const A = f(b);
    if (A != null && A.ok && A.funder) return;
    const O = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, T - 1), 30 * 6e4);
    if (!(V && V.for === b && t.now() - V.at < O)) {
      E = !0;
      try {
        V = { for: b, res: await t.funder(b), at: t.now() };
      } catch {
        V = { for: b, res: { ok: !1 }, at: t.now() };
      } finally {
        E = !1;
      }
      T = V.res.ok ? 0 : T + 1;
    }
  }
  async function Rs() {
    const b = s == null ? void 0 : s.address;
    if (!(!ut() || !b || s != null && s.linked || !t.mainOf || nt) && !(N && N.for === b && (N.ok || t.now() - N.at < 6e4))) {
      nt = !0;
      try {
        N = { for: b, main: await t.mainOf(b), ok: !0, at: t.now() };
      } catch {
        N = { for: b, main: null, ok: !1, at: t.now() };
      } finally {
        nt = !1;
      }
    }
  }
  async function Gs() {
    const b = s == null ? void 0 : s.address;
    if (!(!b || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (B == null ? void 0 : B.for) === b) && t.store.get(Qt("created", b)) !== "1")
      try {
        B = { for: b, unused: await t.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Ks() {
    var tt;
    const b = s == null ? void 0 : s.address;
    if (!b) return !1;
    let A, O = !1;
    const Y = /* @__PURE__ */ new Map();
    for (const K of sn())
      try {
        const at = await t.chain.transaction(K.txid);
        if (!at) {
          if (G.add(K.txid), t.now() - K.created > 15 * 6e4 && !Y.has(K.address) && Y.set(K.address, await t.chain.confirmedNonce(K.address)), A = Y.get(K.address), A !== void 0 && A > BigInt(K.nonce)) {
            Dt({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), Dt({ ...K, status: "pending" });
            } catch (lt) {
              Qs(lt) && Dt({ ...K, status: "failed", note: lt.message, raw: void 0 });
            }
          continue;
        }
        G.delete(K.txid);
        const pt = String(at.tx_status);
        if (pt === "success" && at.canonical !== !1 && at.is_unanchored === !1) {
          if (Dt({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(at.fee_rate ?? K.fee), raw: void 0 }), O = !0, K.kind === "like" && (S = !0, K.status !== "confirmed" && typeof K.liked == "boolean"))
            try {
              (tt = t.likeConfirmed) == null || tt.call(t, K.song, K.liked);
            } catch {
            }
        } else pt.startsWith("abort_") || pt.startsWith("dropped_") ? Dt({ ...K, status: "failed", note: pt, raw: void 0 }) : K.status !== "pending" && Dt({ ...K, status: "pending" });
      } catch {
      }
    for (const K of et() ? [b, D()] : [b]) {
      const at = C(K);
      if (at)
        try {
          const pt = await t.chain.transaction(at.txid), lt = String((pt == null ? void 0 : pt.tx_status) ?? "");
          (lt === "success" && pt.is_unanchored === !1 || lt.startsWith("abort_") || lt.startsWith("dropped_") || !pt && t.now() - at.at > 2 * 36e5) && (q(null, K), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return O;
  }
  async function ve(b = !1) {
    var A;
    try {
      const O = t.main();
      if ((b || !e || r !== O || t.now() - n > 3e5) && (e = await t.config(O), n = t.now(), r = O), !e.enabled || !e.here || !ut() && (!O || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), ht && fr(), t.changed();
        return;
      }
      await cn(), s = await je(i), wt() && s.state === "unlocked" && (Ws(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await je(i)), O && e.allowed && await zs(O), await ur(b), await Pi(), await Rs(), await Gs(), await _t(), await Ks() && await ur(!0), await Ce(), await ae(), F = 0;
    } catch {
      F++;
    }
    if (kt() === "locked" ? qs() : ht && fr(), S) {
      S = !1;
      try {
        (A = t.likesChanged) == null || A.call(t);
      } catch {
      }
    }
    t.changed(), Zt.length && !bn && ji();
  }
  async function Vs(b) {
    const A = s == null ? void 0 : s.root;
    if (!A || s != null && s.slot || !(s != null && s.address) || Ot("slots")) return;
    const O = Number(t.store.get(Qt("slot", A)));
    if (!(!Number.isSafeInteger(O) || O < 1))
      try {
        const { balance: Y } = await t.chain.account(s.address);
        if (Y >= $n + sr(Rt())) return;
        await b.request("listening.openSlot", { slot: O }), s = await je(b), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Yr(b, A) {
    var K;
    Fe();
    const O = !(s != null && s.address) || Se(s.address), Y = s != null && s.linked ? (K = t.nameOf) == null ? void 0 : K.call(t, s.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: O ? dr() : void 0, anyPasskey: A, ...t.main() ? { main: t.main() } : {}, ...Y ? { label: Y } : {} }), s = await je(b), O && (Se(s.address) ? await Xe() : await b.request("listening.stop")), await Vs(b), Pt(O ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const tt = h;
    h = null, tt && t.now() - tt.at < 12e4 && setTimeout(() => void ve(!0).then(() => zi(tt)), 0);
  }
  function qs() {
    ht || u || $t || It >= 3 || !i || !(s != null && s.address) || (ht = !0, zt = (async () => {
      try {
        await Yr(i, !1), It = 0;
      } catch (b) {
        const A = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(A) ? Ct || ($t = !0, Pt("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (It++, L = A);
      } finally {
        ht = !1;
        const b = Ct;
        Ct = null, b ? await b() : await ve(!0);
      }
    })());
  }
  async function fr(b) {
    ht && (Ct = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await zt), b && await b(), t.changed();
  }
  const dr = () => ({
    fee: Rt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: us.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Xe() {
    if (!(s != null && s.address)) return !1;
    if (M || (M = await t.tabLock(s.address)), !M)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function hr(b, A) {
    const O = s.address, { balance: Y, nonce: tt } = A ?? await t.chain.account(O);
    o = Y;
    const K = await i.request("listening.prepareReturn", {
      mode: b.mode,
      balance: Y.toString(),
      nonce: tt.toString(),
      fee: qi.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (K.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const at = b.mode === "amount" ? b.amount : b.mode === "all" ? Y - qi : Y - us - qi, pt = Pa(K.raw);
    if (On(pt.payload.recipient).value !== b.to || String(pt.payload.amount) !== K.amount || at !== void 0 && K.amount !== at.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const lt = {
      id: Vc(),
      address: O,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: K.recipient,
      amount: K.amount,
      fee: K.fee,
      nonce: tt.toString(),
      created: t.now(),
      status: "signed",
      raw: K.raw,
      txid: K.txid
    };
    t.validate(lt), Dt(lt);
    try {
      await t.chain.broadcast(K.raw, K.txid), Dt({ ...lt, status: "pending" });
    } catch (Gt) {
      throw Dt({ ...lt, status: "unknown", note: Gt.message }), Gt;
    }
    return K;
  }
  const Zr = 15000n, pr = qi;
  async function Qr(b, A, O) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Ot("slots") || Ot("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Y = s.slot ?? 0;
    if (b === A || ![b, A].includes(Y) || ![b, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const tt = s.root ?? s.address, K = b === 0 ? tt : s.address, at = A === 0 ? tt : s.address, { balance: pt, nonce: lt } = await t.chain.account(K);
    if (pt < O + pr + $n) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Gt = await i.request("listening.signMove", { from: b, to: A, amount: O.toString(), fee: pr.toString(), nonce: lt.toString(), balance: pt.toString() }), $e = Pa(Gt.raw);
    if (Gt.from !== K || Gt.to !== at || Gt.amount !== O.toString() || On($e.payload.recipient).value !== at || String($e.payload.amount) !== O.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const ln = {
      id: Vc(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: at,
      amount: Gt.amount,
      fee: Gt.fee,
      nonce: lt.toString(),
      created: t.now(),
      status: "signed",
      raw: Gt.raw,
      txid: Gt.txid
    };
    t.validate(ln), Dt(ln);
    try {
      await t.chain.broadcast(Gt.raw, Gt.txid), Dt({ ...ln, status: "pending" });
    } catch (Ne) {
      throw Dt({ ...ln, status: "unknown", note: Ne.message }), Ne;
    }
    return q({ txid: Gt.txid, amount: Gt.amount, at: t.now() }, at), at === tt && tt !== s.address ? c = null : a = -1 / 0, Gt;
  }
  let z = !1;
  const J = /* @__PURE__ */ new Map(), Jt = (b) => Qt("float", b);
  async function ae() {
    if (z || (s == null ? void 0 : s.state) !== "unlocked" || !et() || Ot("move") || Ot("rootLike") || !s.address) return;
    const b = s.address;
    if (t.store.get(Jt(b)) === "1") return;
    const A = Z();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const O = ot();
    if (O === void 0 || o === void 0) return;
    if (!Mt(O)) {
      t.store.set(Jt(b), "1");
      return;
    }
    if (C(D()) || Di() || sn().length || o < Zr * 4n + $n + pr) return;
    const Y = J.get(b);
    if (!(Y && (Y.n >= 3 || t.now() - Y.at < 5 * 6e4))) {
      z = !0, J.set(b, { n: ((Y == null ? void 0 : Y.n) ?? 0) + 1, at: t.now() });
      try {
        await Qr(s.slot ?? 0, 0, Zr), t.store.set(Jt(b), "1");
      } catch (tt) {
        console.warn("[radio] likes float not sent yet", tt);
      } finally {
        z = !1;
      }
    }
  }
  async function Jr(b) {
    if (be().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ot("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await We().catch(() => null);
    if (!A)
      throw dt = null, ie = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ie = !1, o = A.balance;
    const O = { balance: A.balance, nonce: A.nonce };
    if (b === "excess") {
      const pt = Ph(A.parts) ?? m();
      if (!pt) throw new Error("Choose where to send the excess first.");
      await hr({ mode: "excess", to: pt, linked: !1 }, O), dt = null, Pt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Y = A.steps;
    if (!Y.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!dt && dt.balance === A.balance && t.now() - dt.at <= me && dt.steps.length === Y.length && dt.steps.every((pt, lt) => pt.to === Y[lt].to && pt.mode === Y[lt].mode && pt.send === Y[lt].send))) {
      dt = {
        at: t.now(),
        balance: A.balance,
        steps: Y,
        parts: A.parts,
        plan: { state: "ready", steps: Y.map((pt) => ({ to: pt.to, kind: pt.kind, send: pt.send.toString() })), kept: A.tooSmall, excess: Ph(A.parts) }
      }, Pt(Y.length > 1 ? `This goes back in ${Y.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const K = Y[0], at = K.to ?? m();
    if (!at) throw new Error("Choose where to send the rest first.");
    if (K.mode === "amount" && Ot("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await hr({ mode: K.mode, to: at, linked: !1, ...K.mode === "amount" ? { amount: K.send } : {} }, O), dt = null, Y.length === 1 ? (Ee(!1), Pt("Returned ✓ Paying is off.")) : Pt(`Returned ✓ ${Y.length - 1} more ${Y.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Cn = {
    forceRefresh: () => ve(!0),
    create: () => Ae("Waiting for your passkey…", async () => {
      const b = await cn();
      await b.request("listening.unlock", { mode: "create", terms: dr(), ...t.main() ? { main: t.main() } : {} }), s = await je(b), s.address && t.store.set(Qt("created", s.address), "1"), Ee(!0), Pt(ut() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Xe();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (b, A) => {
      !(s != null && s.address) || Me() || (q({ txid: b, amount: A.toString(), at: t.now() }), a = -1 / 0, j = null, Pt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (Fe(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ot("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await cn()).request("listening.bindSlot", { slot: b, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, A, O, Y) => {
      q({ txid: O, amount: Y.toString(), at: t.now() }, A), j = null, await Cn.openAlbum(b), Pt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Ae("Opening…", async () => {
      if (Fe(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ot("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === b) return;
      Ws(), await i.request("listening.openSlot", { slot: b }), s = await je(i), o = void 0, a = -1 / 0, dt = null, ie = !1;
      const A = s.root;
      A && b > 0 && t.store.set(Qt("slot", A), String(b)), Pt(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const A = () => Ae("Waiting for your passkey…", async () => Yr(await cn(), b));
      return ht ? b ? Ot("cancel") ? (Pt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : fr(async () => {
        (kt() === "locked" || kt() === "intro") && await A();
      }) : zt : A();
    },
    link: () => Ae("Sign in your wallet…", async () => {
      Fe();
      const b = t.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(b)).find((O) => O.listening === s.address);
      if (A)
        await i.request("listening.link", { main: b, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const O = { main: b, listening: s.address, issued: t.now() }, Y = await t.signWithMain(b, T6(O)), tt = await i.request("listening.link", { main: b, issued: O.issued, mainSignature: Y });
        await t.saveLink({ ...O, mainSignature: Y, listeningSignature: tt.listeningSignature }), W = -1 / 0;
      }
      Pt("Linked ✓");
    }),
    deposit: () => Ae("Approve the deposit in your wallet…", async () => {
      Fe();
      const b = t.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (Me()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await ur(!0);
      const A = Gc(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await t.deposit(b, s.address, A), H && q({ txid: H, amount: A.toString(), at: t.now() }), Pt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ae("Approve the top-up in your wallet…", async () => {
      Fe();
      const b = t.main(), A = D();
      if (!b || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (C(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const O = await t.chain.balance(A);
      et() ? c = { for: A, value: O, at: t.now() } : (o = O, a = t.now());
      const Y = Gc(O);
      if (Y <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const tt = await t.deposit(b, A, Y);
      tt && q({ txid: tt, amount: Y.toString(), at: t.now() }, A), Pt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (b) => Ae("Adding plays…", async () => {
      if (Fe(), !et()) throw new Error("Open the album you want to add plays to first.");
      if (!tu.includes(b)) throw new Error("Choose one of the amounts offered.");
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (sn().length || Me()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Qr(0, s.slot ?? 0, b), Pt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ae("Confirm in the listening wallet…", async () => {
      if (!De()) throw new Error("Connect your wallet first.");
      await Xe(), await i.request("listening.approveSession", dr()), Ee(!0), Pt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ae("Clearing…", async () => {
      for (const b of Tt())
        await t.chain.transaction(b.txid) || Dt({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Pt("Cleared ✓");
    }),
    switchOff: () => Ae("Switching off…", async () => {
      Ws(), await (i == null ? void 0 : i.request("listening.stop")), Ee(!1), Pt("Paying is off. Music stays free.");
    }),
    lock: () => Ae("Locking…", async () => {
      Ws(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Pt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const A = String(b ?? "").trim();
      if (!(s != null && s.address)) return Pt("", "Unlock the listening wallet first.");
      if (!Bs(A)) return Pt("", "Enter a standard mainnet address (it starts with SP).");
      if (A === s.address) return Pt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(w(s.address), A), Pt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(w(s.address), ""), t.changed();
    },
    returnFunds: (b) => Ae("Check the return in the listening wallet…", async () => {
      if (!De()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (cr()) return Jr(b);
      const A = U();
      if (!A) throw new Error(ut() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Ot("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (be().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await hr({ mode: b, to: A.to, linked: A.kind === "linked" }), b === "all" && Ee(!1), Pt(b === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Zt = [], Hi = 10, Oi = 30 * 6e4;
  let bn = !1;
  const Di = () => d || !!u || l || y, Ws = () => {
    Zt.length && (Zt.length = 0, t.changed());
  };
  async function Fi(b) {
    if (!Zt.some((A) => A.id === b.id) && !Yt().some((A) => A.id === b.id) && (Zt.push({ ...b, at: t.now() }), Zt.length > Hi && Zt.shift()), Di() || be().length) {
      const A = Zt.length;
      x = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await ji();
  }
  async function ji() {
    if (!bn) {
      bn = !0;
      try {
        for (; Zt.length; ) {
          for (; Zt.length && t.now() - Zt[0].at > Oi; ) Zt.shift();
          if (!Zt.length || Di() || await hc(Zt[0]) === "wait") return;
          Zt.shift();
        }
      } finally {
        bn = !1, t.changed();
      }
    }
  }
  async function hc(b) {
    var A;
    d = !0;
    try {
      await ve();
      const O = kt();
      if (O === "loading") return "wait";
      if (O !== "ready" || !Se() || !(s != null && s.session) || s.session.playsLeft < 1 || !M) return "done";
      if (be().length) return "wait";
      v || (await t.chain.verify(), v = !0);
      const Y = s.address, { balance: tt, nonce: K } = await t.chain.account(Y);
      o = tt, a = t.now();
      const at = await t.chain.owner(Kc, b.song);
      if (at === Y || at === t.main()) return "done";
      const pt = await i.request("listening.signPlay", {
        core: Kc,
        song: b.song,
        receipt: b.id,
        fee: Rt().toString(),
        nonce: K.toString(),
        balance: tt.toString()
      }), lt = {
        id: b.id,
        address: Y,
        kind: "play",
        core: Kc,
        song: b.song,
        recipient: at,
        amount: "50",
        fee: Rt().toString(),
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: pt.raw,
        txid: pt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      t.validate(lt), Dt(lt);
      const Gt = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await t.chain.broadcast(pt.raw, pt.txid), Dt({ ...lt, status: "pending" }), x = `♪ Paid ${Gt}`, L = "";
      } catch ($e) {
        Dt({ ...lt, status: Qs($e) ? "failed" : "unknown", note: $e.message, ...Qs($e) ? { raw: void 0 } : {} }), L = $e.message;
      }
      return s = await je(i), "done";
    } catch (O) {
      const Y = O instanceof Error ? O.message : "payment unavailable";
      return (A = Z()) != null && A.player ? (x = "Payment is taking a moment: " + Y, "wait") : (x = "This song played free: " + Y, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function pc(b) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(kt()) || Ot("like") ? !1 : (zi(b), !0);
  }
  async function zi(b) {
    const A = b.title ? `“${b.title}”` : `song #${b.song}`, O = (Tn) => {
      var ko;
      L = Tn, x = "";
      try {
        (ko = t.likeFailed) == null || ko.call(t, b.song);
      } catch {
      }
      t.changed();
    }, Y = et(), tt = kt(), K = t.main(), at = Y && (tt === "fund" || tt === "over") ? "ready" : tt, pt = ut() ? D() : K;
    if (at === "locked") {
      h = { ...b, at: t.now() }, Pt(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (at === "wrong-wallet") return O(Xn());
    if (at === "link") return O("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (ut() && Ot("standalone")) return O("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (at === "fund") return O("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (at === "over") return O("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Y) {
      await Ce(!0);
      const Tn = ot();
      if (Mt(Tn))
        return t.changed(), O(Hh);
    }
    if (at !== "ready" || !pt) return O("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return O("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!M) return O("Pay-per-play is running in another tab. Like from that tab.");
    const lt = Yt(D()).find((Tn) => Tn.kind === "like" && Tn.song === b.song);
    if (lt && Wi.includes(lt.status))
      return O(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return O("One like at a time: your last one is still being sent.");
    if ((lt == null ? void 0 : lt.status) === "confirmed" && t.now() - (lt.confirmedAt ?? 0) < F6)
      return O(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let Gt;
    y = !0;
    try {
      Gt = t.likeState ? (await t.likeState(pt, b.song)).by : b.likedBy ?? [];
    } catch {
      Gt = b.likedBy;
    } finally {
      y = !1;
    }
    if (!Gt) return O(`Could not check ${A} right now. Try the heart again.`);
    const $e = D(), Ne = ((lt == null ? void 0 : lt.status) === "confirmed" && typeof lt.liked == "boolean" && t.now() - (lt.confirmedAt ?? lt.created) < 5 * 6e4 ? lt.liked : void 0) ?? Gt.includes($e);
    if (!Ne && Gt.some((Tn) => Tn !== $e)) return O(ut() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${Gt.includes(K) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await gc({ song: b.song, liked: !Ne, title: b.title, artist: b.artist });
  }
  async function gc(b) {
    var Y, tt, K;
    if (l) {
      Pt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, O = t.wait ?? ((at) => new Promise((pt) => setTimeout(pt, at)));
    try {
      Pt(`${b.liked ? "Liking" : "Unliking"} ${A}…`);
      const at = t.now() + 12e4;
      for (; d || (et() ? Yt(D()).some((Ne) => Wi.includes(Ne.status)) : be().length); ) {
        if (t.now() > at) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await O(5e3), await ve(!0);
      }
      if (!et() && kt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const pt = D(), { balance: lt, nonce: Gt } = await t.chain.account(pt);
      if (et() ? c = { for: pt, value: lt, at: t.now() } : (o = lt, a = t.now()), Mt(lt)) throw new Error(Hh);
      const $e = await i.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Rc.toString(),
        nonce: Gt.toString(),
        balance: lt.toString()
      }), ln = {
        id: Vc(),
        address: pt,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Rc.toString(),
        nonce: Gt.toString(),
        created: t.now(),
        status: "signed",
        raw: $e.raw,
        txid: $e.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      t.validate(ln), Dt(ln);
      try {
        await t.chain.broadcast($e.raw, $e.txid), Dt({ ...ln, status: "pending" }), x = `${b.liked ? "♥ Liked" : "Unliked"} ${A}`, L = "";
        try {
          (Y = t.likeSent) == null || Y.call(t, b.song, b.liked);
        } catch {
        }
      } catch (Ne) {
        if (Dt({ ...ln, status: Qs(Ne) ? "failed" : "unknown", note: Ne.message, ...Qs(Ne) ? { raw: void 0 } : {} }), L = Ne.message, Qs(Ne)) try {
          (tt = t.likeFailed) == null || tt.call(t, b.song);
        } catch {
        }
      }
      s = await je(i);
    } catch (at) {
      L = "Like not sent: " + (at instanceof Error ? at.message : "the listening wallet is unavailable");
      try {
        (K = t.likeFailed) == null || K.call(t, b.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), ji();
    }
  }
  return { snapshot: oe, refresh: ve, onListened: Fi, heart: pc, toggleLike: zi, ...Cn };
}
const Ly = ["Connect", "Passkey", "Link & fund", "Listen"], Cy = ["Passkey", "Add 1 STX", "Listen"], eu = (t) => t ? Cy : Ly;
function z6(t) {
  if (t.solo) return R6(t);
  const e = Ly.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function R6(t) {
  const e = Cy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function G6(t, e) {
  return !e || e.at >= eu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const K6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function V6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !K6(r.id)));
}
const q6 = {}, W6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, X6 = (t) => {
  const e = q6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Y6 = (t) => `/hiro/${t}`, Z6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Q6 = (t) => {
  const e = X6(t);
  if (e)
    return [Z6(e)];
  const n = W6[t];
  return typeof window < "u" ? [`${window.location.origin}${Y6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, J6 = {}, Oh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, t5 = "xtrata.log.enabled", e5 = "xtrata.log.level", n5 = "xtrata.log.tags", r5 = "xtrata.log.dedupe", sa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, s5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, i5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, o5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, a5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, c5 = () => {
  const t = J6 ?? {}, e = sa(t5) ?? t.VITE_LOG_ENABLED, n = sa(e5) ?? t.VITE_LOG_LEVEL, r = sa(n5) ?? t.VITE_LOG_TAGS, i = sa(r5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: s5(e),
    level: i5(n) ?? "warn",
    tags: a5(r),
    dedupe: o5(i)
  };
}, l5 = (t, e, n) => !t.enabled || Oh[n] < Oh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), u5 = (t, e, n, r) => {
  const i = c5();
  if (!l5(i, e, t) || d5(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, f5 = /* @__PURE__ */ new Set();
let Dh = null;
const d5 = (t, e, n, r, i) => (Dh !== t && (f5.clear(), Dh = t), !1), h5 = (t, e, n) => u5("debug", t, e, n), p5 = {}, g5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, y5 = (t) => {
  const e = p5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : g5[t];
}, w5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, b5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return w5.test(n) ? n : null;
}, m5 = (t) => t.replace(/\/+$/, ""), x5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Fh = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const i = Number.parseInt(e.slice(r, r + 2), 16);
    if (i < 32 || i > 126)
      return null;
    n += String.fromCharCode(i);
  }
  return n;
}, Js = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, S5 = (t) => {
  var c, u;
  let e;
  try {
    e = On(Ev(t));
  } catch {
    return null;
  }
  const n = Js(e);
  if (!n || n.success === !1)
    return null;
  const r = Js(n.value), i = Js(r == null ? void 0 : r.value), s = Js(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Fh((c = Js(s.name)) == null ? void 0 : c.value), a = Fh((u = Js(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : b5(`${o}.${a}`);
}, E5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${m5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [cy(Kg(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : S5(s.result);
}, A5 = async (t) => {
  const e = t.address.trim();
  if (!ui(e))
    return null;
  const n = y5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of Q6(t.network))
    try {
      return await E5({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return h5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: x5(r)
  }), null;
};
function v5(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, i = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = i();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && i() - c.failedAt >= r && o(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), o(a, c)), c.name;
    }
  };
}
const jh = Object.freeze({
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
function $5(t, e = "") {
  return Object.hasOwn(jh, String(t)) ? jh[String(t)] : e;
}
const zh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function I5(t, e = "") {
  return Object.hasOwn(zh, String(t)) ? zh[String(t)] : e;
}
const k5 = 100000n, Rh = 1000000n, L5 = 3000n, C5 = (t, e) => `${t}#gift=${e}`, T5 = 100, qc = (t, e = Io) => t <= $n ? 0 : Number((t - $n) / sr(e)), Gh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ty = "xtrata.xyz/radio/gifts", B5 = "Create Xtrata radio gift links paid from the gift treasury", M5 = (t) => ({
  domain: Cs({ name: ke(Ty), version: ke("1"), "chain-id": zn(1) }),
  message: Cs({
    purpose: ke(B5),
    admin: ke(t.admin),
    count: zn(t.count),
    amount: zn(BigInt(t.amount)),
    label: ke(t.label),
    issued: zn(t.issued),
    ...t.player ? { player: ke(t.player) } : {}
  })
}), Kh = 40, N5 = "Create an Xtrata radio gift player", _5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Vh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && _5.test(t) : !n;
}
function U5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Vh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Vh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Kh) throw new Error(`A player holds 1 to ${Kh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const P5 = (t) => W0(tp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), H5 = (t) => ({
  domain: Cs({ name: ke(Ty), version: ke("1"), "chain-id": zn(1) }),
  message: Cs({
    purpose: ke(N5),
    admin: ke(t.admin),
    player: ke(t.hash),
    issued: zn(t.issued)
  })
}), qh = (t, e = Io) => $n + BigInt(t) * sr(e), Wh = [300, 500, 1e3], Xh = 1800, Wc = /* @__PURE__ */ new Map();
async function By(t) {
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
async function O5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await By(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function My(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = Wc.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Wc.set(t, { ...a, until: Date.now() + Xh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Wc.delete(t), i();
      }, Xh + 50);
    }
  }, s;
}
const ci = (t, e, n, r, i) => My(t, e, async () => await By(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), es = "xtrata.radio.gift.incoming.v1", Yh = (t) => "xtrata.radio.gift.mine.v1:" + t, ft = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Or = (t, e, n = "") => {
  const r = ft("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Xi = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, ti = (t) => xn(t).replace(/\.?0+$/, "");
function D5(t) {
  let e = null;
  const n = (C) => [5e3, 1e4, 2e4, 3e4][C] ?? 6e4, r = (() => {
    try {
      const C = new URL(location.href), q = new URLSearchParams(C.hash.slice(1)).get("gift") ?? C.searchParams.get("gift");
      return q !== null && (C.searchParams.delete("gift"), history.replaceState(null, "", C.pathname + (C.search || ""))), Gh(q) ? q : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const C = JSON.parse(t.store.get(es) || "null");
      return Gh(C == null ? void 0 : C.code) ? C.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(es, JSON.stringify({ code: s, at: t.now() }));
    let C = 0;
    const q = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (D) => {
      const et = await D.json().catch(() => ({}));
      if (D.status === 404) {
        t.store.set(es, null), e = { ...e, error: (et == null ? void 0 : et.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!D.ok) throw new Error("busy");
      const ot = et;
      e = { ...e, view: ot, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ot.status) && t.store.set(es, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void q(), n(C++)));
    });
    q();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(es, null), t.changed();
  }, c = (C) => C.from ? t.who(C.from) : C.label ? `Xtrata Radio · ${C.label}` : "Xtrata Radio";
  let u = {};
  const d = (C) => {
    if (u.box) return u.box;
    const q = ft("div", "", "ppp-gift-check");
    u.box = q;
    const D = () => {
      const et = window.turnstile;
      !et || u.rendered || (u.rendered = !0, et.render(q, { sitekey: C, callback: (ot) => {
        u.token = ot, t.changed();
      }, "expired-callback": () => {
        u.token = void 0;
      } }));
    };
    if (window.turnstile) D();
    else {
      const et = document.createElement("script");
      et.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", et.async = !0, et.onload = D, document.head.append(et);
    }
    return q;
  };
  let l;
  async function y(C) {
    var et, ot, Mt, Tt, Nt;
    if (!e || e.claiming || !C.listening) return;
    const q = !!((et = e.view) != null && et.player);
    if (q && !C.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const D = async (ut) => {
      const wt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: u.token, ...ut })
      });
      return { res: wt, r: await wt.json().catch(() => ({})) };
    };
    try {
      let ut = 0, wt = C.listening, w;
      if (q) {
        const U = Number((ot = await t.json("/radio/gift/slots?root=" + encodeURIComponent(C.root))) == null ? void 0 : ot.next);
        if (!Number.isSafeInteger(U) || U < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ut = U;
        for (let rt = 0; ; rt++) {
          const Z = await t.album.bind(ut);
          if (wt = Z.address, w = await D({ wallet: wt, binding: Z }), w.res.status === 409 && /just taken/.test(((Mt = w.r) == null ? void 0 : Mt.error) || "") && rt < 5) {
            ut += 1;
            continue;
          }
          break;
        }
      } else w = await D({ wallet: wt });
      const { res: m, r: f } = w;
      if (m.status === 503 && /sending another gift/.test((f == null ? void 0 : f.error) || "")) {
        e.waiting = !0, clearTimeout(l), l = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!m.ok) {
        const U = String((f == null ? void 0 : f.error) || "");
        if (m.status === 404 || m.status === 410 || m.status === 409 && /already had a gift|brand-new/.test(U))
          throw t.store.set(es, null), new Error(U || "This gift cannot be opened.");
        if (m.status === 429 || m.status === 403 || m.status === 400 && !/wallet number/i.test(U)) throw new Error(U || `Could not open the gift (${m.status}).`);
        const Z = /topping up/.test(U) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(U) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(U) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Z), { retry: !0, slow: /topping up|not paid for yet/.test(U) });
      }
      e.done = !0, t.store.set(es, null), q ? await t.album.arrived(ut, wt, f.txid, BigInt(f.amount)) : t.giftSent(f.txid, BigInt(f.amount));
    } catch (ut) {
      const wt = ut, w = wt.name === "TypeError" || wt.name === "AbortError" || wt.name === "TimeoutError" || /wallet number/i.test(wt.message);
      if (wt.retry || w) {
        const m = e.tries ?? 0;
        e.tries = m + 1, e.retry = { text: wt.retry ? wt.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(l), l = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, wt.slow ? 6e4 : n(m));
      } else e.error = wt.message;
      u.token = void 0;
      try {
        (Nt = (Tt = window.turnstile) == null ? void 0 : Tt.reset) == null || Nt.call(Tt, u.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let h = null;
  function S(C) {
    if (!C.listening || !C.depositPending || C.step !== "fund")
      return h = null, [];
    if (!h || h.wallet !== C.listening || t.now() - h.at > 3e4) {
      const D = C.listening;
      h = { ...(h == null ? void 0 : h.wallet) === D ? h : {}, wallet: D, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(D)).then((et) => {
        var ot, Mt;
        (h == null ? void 0 : h.wallet) === D && (h.state = (ot = et == null ? void 0 : et.gift) == null ? void 0 : ot.state, h.problem = ((Mt = et == null ? void 0 : et.gift) == null ? void 0 : Mt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(h.state === "sending" && h.problem)) return [];
    const q = ft("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return q.title = `Network reply: ${h.problem}`, [q];
  }
  function x(C, q) {
    var Nt, ut;
    const D = q.player, et = BigInt(q.amount), ot = [ft("p", `🎁 ${c(q)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${D.tracks.length} ${D.tracks.length === 1 ? "song" : "songs"} and ${qc(et).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!C.root && ["fund", "ready", "over", "link"].includes(C.step)))
      return ot.push(ft("p", C.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : C.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), ot;
    if (C.walletCannotAlbums)
      return ot.push(ft("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ot;
    const Tt = (ut = (Nt = C.gate) == null ? void 0 : Nt.gifts) == null ? void 0 : ut.turnstileSiteKey;
    return Tt && !u.token ? ot.push(ft("p", "One quick check and it is yours:", "ppp-mute"), d(Tt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(C), ot.push(...L(C, "Sending your album…")), ot;
  }
  function L(C, q) {
    const D = [];
    return e.claiming || e.waiting ? D.push(ft("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : q, "ppp-cyan")) : e.retry && D.push(ft("p", e.retry.text, "ppp-warn"), Or("Try now", () => {
      clearTimeout(l), e.retry = void 0, y(C);
    }, "quiet")), e.error && D.push(ft("p", e.error, "ppp-bad"), Or("Try again", () => {
      e.error = void 0, y(C);
    })), D;
  }
  const F = (C) => {
    var q;
    return !!e && !e.done && !e.error && o() && !!C.listening && !C.linked && !C.creditedTo && (C.createdHere || C.brandNew || !!((q = e.view) != null && q.player)) && (C.balance ?? 0n) === 0n && !C.entries.length;
  };
  function H(C) {
    var w, m;
    const q = S(C);
    if (!e || ["off", "elsewhere"].includes(C.step)) return q;
    const D = e.view;
    if (e.error && !D) return [ft("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!D) return [ft("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return q;
    if (D.status === "claimed" || D.status === "claiming") return [ft("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [ft("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [ft("p", `🎁 ${c(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...x(C, D), ...q];
    if (!!C.listening && (!(C.createdHere || C.brandNew) || !!C.linked || !!C.creditedTo || (C.balance ?? 0n) > 0n || C.entries.length > 0))
      return [ft("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Or("Forget this gift link here", a, "quiet")];
    const ot = BigInt(D.amount), Mt = qc(ot).toLocaleString(), Nt = [ft(
      "p",
      `🎁 ${c(D)} sent you ${ti(ot)} STX of on-chain music: about ${Mt} paid plays.`,
      "ppp-gift"
    )], ut = !!C.listening && (C.createdHere || C.brandNew) && !C.linked && !C.creditedTo && C.step === "fund" && (C.balance ?? 1n) === 0n && !C.depositPending && !C.entries.length, wt = (m = (w = C.gate) == null ? void 0 : w.gifts) == null ? void 0 : m.turnstileSiteKey;
    return ut ? (wt && !u.token ? Nt.push(ft("p", "One quick check and it is yours:", "ppp-mute"), d(wt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(C), Nt.push(...L(C, "Sending your gift…"))) : C.step === "intro" ? Nt.push(ft("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : C.listening && C.linked ? Nt.push(ft("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Or("Forget this gift link here", a, "quiet")) : C.listening && (C.balance ?? 0n) > 0n && Nt.push(ft("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Or("Forget this gift link here", a, "quiet")), Nt;
  }
  async function p(C, q, D) {
    var et;
    try {
      const ot = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(C));
      if ((et = ot == null ? void 0 : ot.gift) != null && et.returnTo) return { ok: !0, funder: ot.gift.returnTo, txId: ot.gift.txid ?? void 0, amount: ot.gift.amount, distinct: 1 };
    } catch {
      if (D) return { ok: !1 };
    }
    return q();
  }
  const I = ft("div", "", "ppp-gift-fold");
  let $ = 250000n, P = "", W = "", G = null;
  const V = (C) => {
    try {
      const q = JSON.parse(t.store.get(Yh(C)) || "[]");
      return Array.isArray(q) ? q : [];
    } catch {
      return [];
    }
  }, E = (C, q) => t.store.set(Yh(C), JSON.stringify(q.slice(0, 50)));
  let T = 0;
  async function N(C) {
    const q = V(C);
    for (const D of q)
      if (!(D.view && ["claimed", "refunded", "expired"].includes(D.view.status)))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: D.id, ...D.txid ? { txid: D.txid } : {} }) }) : await t.json("/radio/gift?id=" + D.id), D.error = void 0;
        } catch (et) {
          D.error = et.message;
        }
    E(C, q), t.changed();
  }
  async function B(C) {
    if (P) return;
    P = "Starting your gift…", W = "", t.changed();
    let q = null;
    try {
      q = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: C, amount: $.toString() }) });
      const D = V(C);
      D.unshift({ id: q.id, code: q.code, amount: $.toString(), at: t.now() }), E(C, D), P = "Approve the gift in your wallet…", t.changed();
      const et = await t.pay(C, q.depositTo, BigInt(q.deposit), q.memo), ot = V(C), Mt = ot.find((Tt) => Tt.id === q.id);
      Mt && (Mt.txid = et, Mt.view = { status: "pending-deposit", amount: $.toString(), source: "friend", from: C, label: "", expires: 0 }), E(C, ot), W = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", N(C);
    } catch (D) {
      W = D.message || "Not sent.";
    } finally {
      P = "", t.changed();
    }
  }
  const nt = (C) => "xtrata.radio.gift.players.v1:" + C, j = (C) => {
    try {
      const q = JSON.parse(t.store.get(nt(C)) || "[]");
      return Array.isArray(q) ? q.filter((D) => D && /^[0-9a-f]{16}$/.test(D.id)) : [];
    } catch {
      return [];
    }
  };
  async function jt(C, q) {
    var D;
    if (!P) {
      P = "Checking the player…", W = "", t.changed();
      try {
        const et = q.tracks.split(/[\s,]+/).filter(Boolean).map((wt) => Number(wt.replace(/^#/, ""))), ot = U5({ title: q.title.trim(), subtitle: q.subtitle.trim(), tracks: et, cover: (D = q.cover) != null && D.trim() ? Number(q.cover.trim().replace(/^#/, "")) : null });
        P = "Sign in your wallet…", t.changed();
        const Mt = { admin: C, hash: P5(ot), issued: t.now() }, Tt = await t.sign(C, H5(Mt));
        P = "Making the player…", t.changed();
        const Nt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ot, request: Mt, signature: Tt }) }), ut = j(C).filter((wt) => wt.id !== Nt.id);
        ut.unshift({ id: Nt.id, title: Nt.title, tracks: Nt.tracks }), t.store.set(nt(C), JSON.stringify(ut.slice(0, 30))), W = `${Nt.existing ? "That player already exists" : "Player made"} ✓ “${Nt.title}” · ${Nt.tracks} songs. Pick it below for a campaign.`;
      } catch (et) {
        W = et.message || "Not made.";
      } finally {
        P = "", t.changed();
      }
    }
  }
  async function dt(C, q, D, et, ot) {
    if (!P) {
      P = "Sign in your wallet…", W = "", G = null, t.changed();
      try {
        const Mt = { admin: C, count: q, amount: D.toString(), label: et, issued: t.now(), ...ot ? { player: ot } : {} }, Tt = await t.sign(C, M5(Mt));
        P = "Making links…", t.changed();
        const Nt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: Mt, signature: Tt }) });
        G = { codes: Nt.codes, amount: Nt.amount };
      } catch (Mt) {
        W = Mt.message || "Not made.";
      } finally {
        P = "", t.changed();
      }
    }
  }
  const ie = (C, q) => C5(C || location.origin + "/radio.html", q), v = (C) => O5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: C }), M = ft("input");
  M.type = "range", M.min = String(k5), M.max = String(Rh), M.step = "50000", M.value = String($), M.setAttribute("aria-label", "Gift amount");
  const ht = ft("p", "", "ppp-gift-amount"), $t = Or("", () => {
    const C = t.main();
    C && B(C);
  }, "primary"), It = () => {
    ht.textContent = Ct(), $t.textContent = `Gift ${ti($)} STX`;
  };
  M.oninput = () => {
    $ = BigInt(M.value), It();
  };
  const Ct = () => `${ti($)} STX · about ${qc($).toLocaleString()} paid plays · you pay ${ti($ + L5)} STX with the network fee`;
  It();
  const zt = ft("input");
  zt.type = "number", zt.min = "1", zt.max = String(T5), zt.value = "10", zt.setAttribute("aria-label", "How many links");
  const Rt = ft("input");
  Rt.type = "number", Rt.min = "0.1", Rt.max = "1", Rt.step = "0.05", Rt.value = String(Number(qh(Wh[0])) / 1e6), Rt.setAttribute("aria-label", "STX per link");
  const Ot = ft("input");
  Ot.maxLength = 60, Ot.placeholder = "Title, e.g. Proof of Sound", Ot.setAttribute("aria-label", "Player title");
  const Qt = ft("input");
  Qt.maxLength = 80, Qt.placeholder = "Artist (optional)", Qt.setAttribute("aria-label", "Player subtitle");
  const Yt = ft("textarea");
  Yt.rows = 3, Yt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Yt.setAttribute("aria-label", "Songs");
  const Dt = ft("input");
  Dt.inputMode = "numeric", Dt.placeholder = "Cover inscription number (optional), shown when the album loads", Dt.setAttribute("aria-label", "Cover inscription");
  const Se = ft("select");
  Se.setAttribute("aria-label", "Gift player");
  const Ee = ft("select");
  Ee.setAttribute("aria-label", "Plays per link");
  for (const C of Wh) Ee.append(Xi(`${C.toLocaleString()} plays`, String(qh(C))));
  Ee.append(Xi("Max (1 STX)", String(Rh)), Xi("Custom STX", "")), Ee.onchange = () => {
    Ee.value && (Rt.value = String(Number(Ee.value) / 1e6));
  };
  const be = ft("input");
  be.maxLength = 40, be.placeholder = "Label, e.g. Launch week", be.setAttribute("aria-label", "Campaign label");
  function sn(C) {
    var ot, Mt, Tt, Nt, ut;
    const q = (ot = C.gate) == null ? void 0 : ot.gifts;
    if (!(q != null && q.enabled) || ["off", "elsewhere", "unsupported"].includes(C.step)) return null;
    const D = t.main(), et = [ft("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!D)
      et.push(ft("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      $t.disabled = !!P, et.push(M, ht, $t), t.now() - T > 3e4 && (T = t.now(), N(D));
      const wt = V(D);
      if (wt.length) {
        const w = ft("ul", "", "ppp-gift-list");
        for (const m of wt.slice(0, 10)) {
          const f = (Mt = m.view) == null ? void 0 : Mt.status, U = m.error ? m.error : !f || f === "pending-deposit" ? m.txid ? "payment confirming…" : "waiting for your payment" : f === "live" ? "ready to share" : f === "claiming" || f === "claimed" ? "claimed ✓" : f === "refunding" ? "expired · refund on its way" : f === "refunded" ? "expired · refunded to you" : f, rt = ft("li");
          if (rt.append(ft("span", `${ti(BigInt(m.amount))} STX`, "t"), ft("span", U, ((Tt = m.view) == null ? void 0 : Tt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Nt = m.view) == null ? void 0 : Nt.status) === "live") {
            const Z = ie(((ut = C.gate) == null ? void 0 : ut.radioUrl) ?? null, m.code);
            rt.append(ci("gift-copy:" + m.id, "Copy link", () => Z, "tiny", t.changed), My("gift-share:" + m.id, "Share", () => v(Z), "tiny", t.changed));
          }
          w.append(rt);
        }
        et.push(w);
      }
      if (q.admin) {
        const w = Or("Sign and make links", () => {
          const Z = BigInt(Math.round(Number(Rt.value) * 1e6));
          dt(D, Number(zt.value), Z, be.value.trim(), Se.value || void 0);
        }), m = ft("div", "", "ppp-gift-admin"), f = (Z, _t) => {
          const fe = ft("label", Z);
          return fe.append(_t), fe;
        }, U = j(D), rt = Se.value;
        if (Se.replaceChildren(Xi("No player (plain gift)", ""), ...U.map((Z) => Xi(`${Z.title} · ${Z.tracks} songs`, Z.id))), U.some((Z) => Z.id === rt) && (Se.value = rt), m.append(
          ft("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          Ot,
          Qt,
          Yt,
          Dt,
          Or("Sign and make player", () => void jt(D, { title: Ot.value, subtitle: Qt.value, tracks: Yt.value, cover: Dt.value })),
          ft("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          f("Player ", Se),
          f("Plays each ", Ee),
          f("Links ", zt),
          f("STX each ", Rt),
          be,
          w
        ), G) {
          const Z = G.codes.map((fe) => {
            var ge;
            return ie(((ge = C.gate) == null ? void 0 : ge.radioUrl) ?? null, fe);
          }).join(`
`), _t = ft("textarea");
          _t.readOnly = !0, _t.value = Z, _t.rows = Math.min(8, G.codes.length), m.append(ft("p", `${G.codes.length} links, ${ti(BigInt(G.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), _t, ci("campaign-copy", "Copy all", () => Z, "tiny", t.changed));
        }
        et.push(m);
      }
    }
    return P && et.push(ft("p", P, "ppp-cyan")), W && et.push(ft("p", W, /✓/.test(W) ? "ppp-ok" : "ppp-warn")), I.replaceChildren(...et), I;
  }
  return { banner: H, funder: p, renderFold: sn, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: F };
}
const F5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function j5(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, i = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    i && e.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: i
    });
  }
  return e;
}
const z5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function R5(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = z5(s);
    return n.every((a) => o.includes(a));
  })()), i = {
    recent: (s, o) => (e.recents[o.slot] ?? 0) - (e.recents[s.slot] ?? 0) || o.slot - s.slot,
    newest: (s, o) => o.slot - s.slot,
    oldest: (s, o) => s.slot - o.slot,
    title: (s, o) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || s.slot - o.slot;
    }
  };
  return r.sort((s, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(s.slot)) || i[e.sort](s, o));
}
function G5(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const ei = 12, K5 = 5e3, Ge = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ni = (t, e, n = "") => {
  const r = Ge("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function V5(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = ei;
  const l = Ge("div", "", "ppp-shelf-box"), y = (N) => "xtrata.radio.shelf.pins.v1:" + N, h = (N) => "xtrata.radio.shelf.recent.v1:" + N, S = (N, B) => {
    try {
      return JSON.parse(t.store.get(N) || "null") ?? B;
    } catch {
      return B;
    }
  }, x = (N) => new Set(S(y(N), []).filter((B) => Number.isSafeInteger(B))), L = (N) => {
    const B = S(h(N), {}), nt = {};
    for (const [j, jt] of Object.entries(B)) Number.isSafeInteger(Number(j)) && typeof jt == "number" && (nt[Number(j)] = jt);
    return nt;
  };
  async function F(N) {
    if (!i) {
      i = !0, s = !1;
      try {
        const B = [];
        let nt = 0, j = 0;
        for (let jt = 0; jt < K5 / 100 + 1; jt++) {
          const dt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${nt}&limit=100`);
          if (B.push(...j5(dt == null ? void 0 : dt.shelf)), j = Number(dt == null ? void 0 : dt.total) || B.length, !(dt != null && dt.next) || !Number.isSafeInteger(dt.next)) break;
          nt = dt.next;
        }
        N === e && (n = B, r = j, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const H = () => {
    o = -1 / 0;
  }, p = Ge("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, d = ei, t.changed();
  };
  const I = Ge("select");
  I.setAttribute("aria-label", "Sort albums");
  for (const N of F5) {
    const B = document.createElement("option");
    B.value = N.value, B.textContent = N.label, I.append(B);
  }
  I.onchange = () => {
    c = I.value, d = ei, t.changed();
  };
  const $ = ni("", () => {
    u = !u, d = ei, t.changed();
  }, "tiny"), P = Ge("div", "", "ppp-shelf-tools");
  P.append(p, I, $);
  const W = Ge("div"), G = Ge("div");
  function V(N) {
    const B = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (B !== e && (e = B, n = [], r = 0, o = -1 / 0, d = ei), !B || N.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && F(B), !n.length)
      return s ? (G.replaceChildren(Ge("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ni("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(G), l) : null;
    const nt = x(B), j = L(B), jt = R5(n, { query: a, sort: c, pinnedOnly: u, pins: nt, recents: j });
    p.value !== a && (p.value = a), I.value = c, $.textContent = u ? "★ Pinned only" : "☆ Pinned only", $.setAttribute("aria-pressed", String(u));
    const dt = [];
    if (N.slot > 0 && dt.push(ni("← My player", () => t.open(0), "quiet")), !jt.length) dt.push(Ge("p", "No album matches that.", "ppp-mute"));
    else {
      const ie = Ge("ul", "", "ppp-shelf-list");
      for (const v of jt.slice(0, d)) {
        const M = Ge("li", "", v.slot === N.slot ? "now" : ""), ht = nt.has(v.slot), $t = ni(ht ? "★" : "☆", () => {
          const Rt = new Set(nt);
          ht ? Rt.delete(v.slot) : Rt.add(v.slot), t.store.set(y(B), JSON.stringify([...Rt])), t.changed();
        }, "tiny");
        $t.setAttribute("aria-label", ht ? `Unpin ${v.player.title}` : `Pin ${v.player.title}`);
        const It = [v.player.subtitle, `${v.player.tracks.length} ${v.player.tracks.length === 1 ? "song" : "songs"}`, v.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ct = v.slot === N.slot, zt = ni(Ct ? "Playing" : "Play", () => {
          t.store.set(h(B), JSON.stringify(G5({ ...j, [v.slot]: t.now() }))), t.open(v.slot);
        }, Ct ? "tiny" : "tiny primary");
        zt.disabled = Ct, M.append($t, Ge("span", v.player.title, "t"), Ge("span", " " + It, "ppp-mute"), zt), ie.append(M);
      }
      dt.push(ie), jt.length > d && dt.push(ni(`Show more (${jt.length - d} left)`, () => {
        d += ei, t.changed();
      }, "quiet"));
    }
    return s && dt.push(Ge("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), W.replaceChildren(...dt), l.firstChild !== P && l.replaceChildren(P, W), l;
  }
  return { render: V, invalidate: H, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const N = L(e), B = [...n].filter((nt) => nt.player).sort((nt, j) => (N[j.slot] ?? 0) - (N[nt.slot] ?? 0) || j.slot - nt.slot)[0];
    return B ? { slot: B.slot, title: B.player.title } : null;
  } };
}
const q5 = [
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
function W5(t) {
  for (const [e, n] of q5) if (n.test(t)) return e;
  return null;
}
const Ny = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), _y = (t) => /Android/.test(t);
function X5(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Ny(e) ? "x-safari-" + n.href : _y(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Y5 = (t) => Ny(t) ? "Safari" : _y(t) ? "Chrome" : "your browser", Zh = document.getElementById("ppp");
Zh && Z5(Zh);
function Z5(t) {
  var wt;
  const e = pw(), n = (w) => t.querySelector(w), r = n(".ppp-frame");
  let i = null;
  const s = async (w, m) => {
    const f = await fetch(w, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), U = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((U == null ? void 0 : U.error) || `Request failed (${f.status}).`);
    return U;
  }, o = j6({
    now: Date.now,
    main: () => {
      const w = e.load();
      return w.isConnected && w.network === "mainnet" ? w.address : void 0;
    },
    config: (w) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(w || "")),
    links: async (w) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(w))).links ?? [],
    mainOf: async (w) => {
      var f;
      const m = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(w))).links;
      return ((f = m == null ? void 0 : m.find((U) => U.listening === w)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (w) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(w) });
    },
    bridge: async (w) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${w}; publickey-credentials-create ${w}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((Z, _t) => {
        i.addEventListener("load", () => Z(), { once: !0 }), setTimeout(() => _t(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = w + "/", r.replaceChildren(i), await m;
      const f = new iw({ walletOrigin: w, frame: i, timeoutMs: 30 * 6e4 }), U = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), rt = (Z, _t) => U.has(Z) ? f.request(Z, _t) : Promise.race([
        f.request(Z, _t),
        new Promise((fe, ge) => setTimeout(() => ge(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await rt("listening.status"), { request: rt };
    },
    chain: {
      verify: S6,
      balance: A6,
      account: E6,
      owner: v6,
      broadcast: $6,
      transaction: I6,
      confirmedNonce: async (w) => {
        const m = await Vr(`/v2/accounts/${w}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (w, m) => Bh({ ...m, network: "mainnet", stxAddress: w }),
    deposit: (w, m, f) => new Promise((U, rt) => Ih({
      recipient: m,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: w,
      network: new Xc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (Z) => U(Z.txId || ""),
      onCancel: () => rt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: rt
    })),
    validate: k6,
    tabLock: (w) => new Promise((m) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        m(!0);
        return;
      }
      f.request("xtrata-ppp:" + w, { ifAvailable: !0 }, async (U) => {
        m(!!U), U && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (w) => {
        try {
          return localStorage.getItem(w);
        } catch {
          return null;
        }
      },
      set: (w, m) => {
        try {
          localStorage.setItem(w, m);
        } catch {
        }
      }
    },
    changed: () => Tt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (w) => {
      var m, f;
      return a.funder(w, () => N6(w, Vr), !!((f = (m = o.snapshot().gate) == null ? void 0 : m.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (w) => {
      const m = await s("/radio/gift/for?wallet=" + encodeURIComponent(w)), f = m == null ? void 0 : m.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (w, m) => P6(w, (f) => Vr(f), m),
    likesChanged: () => {
      var w, m;
      (m = (w = window.XtrataRadio) == null ? void 0 : w.refreshLikes) == null || m.call(w);
    },
    likeState: async (w, m) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: w, ids: String(m) })), U = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((rt) => (rt == null ? void 0 : rt.id) === m) : null;
      if (!U || typeof U.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: U.liked, by: Array.isArray(U.by) ? U.by.filter((rt) => typeof rt == "string") : U.liked ? [w] : [] };
    },
    likeSent: (w, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: w, liked: m } })),
    nameOf: (w) => E(w) ?? void 0,
    likeConfirmed: (w, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: w, liked: m } })),
    likeFailed: (w) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: w } }))
  }), a = D5({
    json: s,
    main: () => {
      const w = e.load();
      return w.isConnected && w.network === "mainnet" ? w.address : void 0;
    },
    pay: (w, m, f, U) => new Promise((rt, Z) => Ih({
      recipient: m,
      amount: f.toString(),
      memo: U,
      stxAddress: w,
      network: new Xc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (_t) => rt(_t.txId || ""),
      onCancel: () => Z(new Error("Gift cancelled. Nothing was sent.")),
      onError: Z
    })),
    sign: (w, m) => Bh({ ...m, network: "mainnet", stxAddress: w }),
    giftSent: (w, m) => o.giftSent(w, m),
    album: { bind: (w) => o.bindAlbum(w), arrived: async (w, m, f, U) => {
      c.invalidate(), await o.albumArriving(w, m, f, U);
    } },
    who: (w) => B(w),
    changed: () => Tt(o.snapshot()),
    store: {
      get: (w) => {
        try {
          return localStorage.getItem(w);
        } catch {
          return null;
        }
      },
      set: (w, m) => {
        try {
          m === null ? localStorage.removeItem(w) : localStorage.setItem(w, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = V5({
    json: s,
    open: (w) => {
      o.openAlbum(w);
    },
    store: {
      get: (w) => {
        try {
          return localStorage.getItem(w);
        } catch {
          return null;
        }
      },
      set: (w, m) => {
        try {
          m === null ? localStorage.removeItem(w) : localStorage.setItem(w, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Tt(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (w) => {
    if (!w || !Number.isSafeInteger(w.song) || w.song < 0) return !1;
    ie();
    const m = v(w.song, { title: w.title, artist: w.artist });
    return o.heart({ song: w.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(w.likedBy) ? w.likedBy : void 0 });
  };
  let u;
  window.XtrataRadioListeningIdentity = () => {
    const w = o.snapshot();
    return w.solo && w.step !== "off" && w.step !== "elsewhere" ? w.listening : void 0;
  };
  const d = (w) => {
    var f, U;
    const m = window.XtrataRadioListeningIdentity();
    m !== u && (u = m, (U = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || U.call(f));
  };
  let l = "", y = null, h = !1;
  const S = (w) => {
    var _t, fe, ge, ye, yn;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const f = w.step === "off" || w.step === "elsewhere" ? null : ((_t = w.gift) == null ? void 0 : _t.player) ?? null, U = f ? f.id + ":" + f.cover + ":" + f.tracks.map((on) => on.id).join(",") : "";
    U !== l && (m.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: f.tracks.map((on) => on.id), cover: f.cover } : null), l = U);
    const rt = ((fe = w.giftStop) == null ? void 0 : fe.text) ?? null;
    rt !== y && (m.setGiftStop(rt), y = rt);
    const Z = !!f && !!((ge = w.albumLock) != null && ge.locked);
    Z !== h && ((ye = m.setGiftLock) == null || ye.call(m, Z), h = Z), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(w.step) && ((yn = m.forgetWallets) == null || yn.call(m));
  }, x = (w) => w ? w.slice(0, 6) + "…" + w.slice(-4) : "", L = (w) => (Number(w) / 1e6).toFixed(w < 1000n ? 6 : 4), F = (w) => {
    const m = Math.round((Date.now() - w) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, H = (w) => `https://explorer.hiro.so/txid/${w}?chain=mainnet`, p = (w, m = "", f = "") => {
    const U = document.createElement(w);
    return m && (U.textContent = m), f && (U.className = f), U;
  }, I = (w, m, f = "") => {
    const U = p("button", w, f);
    return U.type = "button", U.onclick = m, U;
  }, $ = (w, m) => {
    const f = p("a", w);
    return f.href = m, f.target = "_blank", f.rel = "noopener", f;
  };
  let P = null, W = location.hash === "#give";
  W && history.replaceState(null, "", location.pathname + location.search);
  let G = !1;
  const V = v5((w) => A5({ address: w, network: "mainnet" }), () => Tt(o.snapshot())), E = (w) => V.get(w), T = W5(navigator.userAgent), N = (w, m) => {
    const f = navigator.userAgent, U = Y5(f), rt = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, Z = [p("p", `You are in ${w}'s built-in browser, where passkeys often do not work. Open this page in ${U} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], _t = p("div", "", "ppp-open-row"), fe = X5(rt, f);
    if (fe) {
      const ge = p("a", `Open in ${U}`, "primary ppp-open-in");
      ge.href = fe, ge.dataset.homeAction = "radio:open-in-browser", _t.append(ge);
    }
    return _t.append(ci("copy-page-link", "Copy link", () => rt, fe ? "" : "primary", () => Tt(o.snapshot()))), Z.push(_t, p("p", `If that does not open ${U}, use ${w}'s menu (••• or ⋮) and choose "Open in ${U === "your browser" ? "browser" : U}", or paste the copied link there.`, "ppp-mute")), Z;
  }, B = (w) => E(w) ?? x(w), nt = (w) => w.slice(0, 2).map(B).join(" and ") + (w.length > 2 ? ` and ${w.length - 2} more` : ""), j = /* @__PURE__ */ new Map();
  let jt = !1;
  const dt = (w) => !w || /^(?:Inscription )?#\d+$/.test(w.trim()), ie = () => {
    jt || (jt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((w) => w.ok ? w.json() : null).then((w) => {
      for (const m of Array.isArray(w == null ? void 0 : w.tracks) ? w.tracks : []) {
        const f = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(f) && j.set(f, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Tt(o.snapshot());
    }).catch(() => {
      jt = !1;
    }));
  }, v = (w, m) => {
    const f = j.get(w), U = I5(w, [f == null ? void 0 : f.title, m == null ? void 0 : m.title].find((Z) => !dt(Z)) || ""), rt = $5(w, (f == null ? void 0 : f.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: U, artist: rt };
  }, M = (w) => {
    const { title: m, artist: f } = v(w.song, w);
    return m ? `“${m}”${f ? ` — ${f}` : ""}` : `Song #${w.song}${f ? ` — ${f}` : ""}`;
  }, ht = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, $t = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function It(w) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(w.step) ? ["", ""] : w.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : w.step === "over" ? ["OVER 1 STX", "bad"] : w.step === "locked" ? ["LOCKED", "mute"] : w.step === "intro" || w.step === "link" ? ["", ""] : w.step === "fund" ? w.depositPending ? ["ON ITS WAY", "warn"] : w.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : w.payingOn && w.session && w.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Ct(w, m, f = "", U) {
    const rt = p("dt", w), Z = p("dd", m, f);
    return U && Z.append(" ", U), [rt, Z];
  }
  const zt = document.getElementById("ppp-top"), Rt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ot = () => {
    var m, f;
    const w = o.snapshot();
    if (w.step === "connect" || w.step === "wrong-wallet") {
      (m = document.getElementById("radio-wallet-connect")) == null || m.click();
      return;
    }
    if (w.step === "elsewhere" && ((f = w.gate) != null && f.radioUrl)) {
      location.href = w.gate.radioUrl;
      return;
    }
    w.step === "locked" && !w.armed && !w.busy && o.unlock(), w.step === "ready" && !w.payingOn && !w.busy && o.switchOn(), Rt();
  };
  zt && (zt.onclick = Ot);
  function Qt(w) {
    if (!zt) return;
    const m = (U, rt, Z) => {
      zt.hidden = !1, zt.className = "ppp-top" + (rt ? " is-" + rt : ""), zt.replaceChildren(p("span", "", "dot"), document.createTextNode(U)), zt.title = Z;
    }, f = w.session ? Math.min(w.session.playsLeft, w.playsLeft) : 0;
    switch (w.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        zt.hidden = !0;
        return;
      case "elsewhere":
        return m("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        zt.hidden = !0;
        return;
      case "intro":
        return m("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${B(w.linked)}`, "warn", `This device's listening wallet belongs to ${B(w.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m(w.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return w.depositPending ? m("Funds on their way", "quiet", "Paying starts by itself when they land") : m(w.entries.some((U) => U.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return m("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return m("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return w.payingOn && f > 0 ? m(`On · ${f.toLocaleString()} plays left`, "on", "Paying artists as you listen") : m("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Yt = document.getElementById("pppNudge"), Dt = document.getElementById("onair");
  (wt = Yt == null ? void 0 : Yt.querySelector("button")) == null || wt.addEventListener("click", () => Ot());
  const Se = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, Ee = {
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
  function be(w) {
    var _t;
    if (w.step === "loading") return;
    const m = w.session ? Math.min(w.session.playsLeft, w.playsLeft) : 0, f = w.step === "ready" && w.payingOn && m > 0, U = w.step === "fund" && w.depositPending, rt = f || U ? "" : Se[w.step] ?? "", Z = f ? "on" : rt ? "off" : "";
    if (Z ? document.documentElement.dataset.ppp = Z : delete document.documentElement.dataset.ppp, Dt && (Dt.hidden = !Z, Dt.querySelector(".onair-sub").textContent = f ? `Paying artists · ${m.toLocaleString()} plays left` : "Not paying"), Yt && (Yt.hidden = Z !== "off", Z === "off")) {
      const fe = Math.floor(Number(1000000n / sr(BigInt(((_t = w.gate) == null ? void 0 : _t.limits.playFee) ?? "300"))));
      Yt.querySelector(".nudge-t").textContent = "⚠ " + rt, Yt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${fe.toLocaleString()} plays, on-chain, straight to the artists.`, Yt.querySelector("button").textContent = Ee[w.step] ?? "Start paying";
    }
  }
  let sn = "";
  function Me(w) {
    const m = p("div", "", "ppp-pick");
    w.funderMultiple && w.returnToKind === "funder" && m.append(p("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), w.returnToKind === "funder" && m.append(p("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = p("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = sn, f.oninput = () => {
      sn = f.value;
    };
    const U = I(w.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), sn = "";
    }, "tiny");
    return m.append(f, " ", U), w.returnToKind === "chosen" && m.append(" ", I("Back to the funder", () => o.clearReturnAddress(), "tiny")), m;
  }
  const C = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function q() {
    const w = p("p", C + " ", "ppp-mute");
    return w.append($("Xverse", "https://www.xverse.app/download"), " · ", $("Leather", "https://leather.io/install-extension")), w;
  }
  let D = "";
  const et = (w) => {
    const m = document.documentElement, f = w.solo && !w.main ? w.listening ? x(w.listening) : "new" : "", U = V6() ? "1" : "";
    `${f}|${U}` !== D && (D = `${f}|${U}`, f ? m.dataset.pppSolo = f : delete m.dataset.pppSolo, U ? m.dataset.pppWalletInstalled = U : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const w of [1500, 4e3, 9e3]) setTimeout(() => Tt(o.snapshot()), w);
  function ot(w, m = "") {
    var rt;
    const f = p("div", "", "ppp-topup"), U = (rt = w.likeFunds) == null ? void 0 : rt.balance;
    f.append(p("span", "Add plays from My player: ", "ppp-mute"));
    for (const Z of tu) {
      const _t = I(`+${(Number(Z) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(Z), m);
      _t.disabled = U === void 0 || U < Z + 6000n || w.depositPending || !!w.busy, f.append(_t);
    }
    return U !== void 0 && U < tu[0] + 6000n && f.append(p("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), f;
  }
  function Mt(w) {
    const m = w.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    const f = p("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      const rt = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return m.txid && rt.append($("View", H(m.txid))), f.append(rt), [f];
    }
    f.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(p("p", m.address, "ppp-addr-full"));
    const U = p("div", "", "ppp-open-row");
    if (U.append(ci("copy-likes-address", "Copy address", () => m.address, "primary", () => Tt(o.snapshot()))), m.main && !w.solo) {
      const rt = us - (m.balance ?? 0n);
      rt > 0n && U.append(I(`Pay ${xn(rt)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(U), f.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  function Tt(w) {
    var Gs, Ks, ve, Vs, Yr, qs, fr, dr, Xe, hr, Zr, pr, Qr;
    const m = a.inProgress(w), f = m && w.step === "fund" ? { ...w, depositPending: !0 } : w;
    if (d(), S(w), et(f), Qt(f), be(f), t.hidden = f.step === "off", t.hidden) return;
    const [U, rt] = It(f), Z = n(".ppp-state");
    Z.textContent = U, Z.className = "ppp-state" + (rt ? " ppp-state--" + rt : ""), Z.hidden = !U;
    const _t = !!f.busy || f.armed, fe = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (_t || !["intro", "loading"].includes(f.step));
    r.hidden = !fe, r.classList.toggle("ppp-frame--rest", !_t && !G);
    const ge = n(".ppp-frame-label");
    ge.hidden = !0;
    const ye = z6(f) ?? P;
    P = ye;
    const yn = G6(f, ye);
    n(".ppp-badge").hidden = !yn;
    const on = n(".ppp-steps"), wn = n(".ppp-stage");
    on.hidden = wn.hidden = !yn, ye && yn && (on.replaceChildren(...eu(f.solo).map((z, J) => {
      const Jt = p("li", "", J < ye.at ? "done" : J === ye.at ? ye.blocked ? "now blocked" : "now" : "");
      return Jt.append(p("span", J < ye.at ? "✓" : String(J + 1), "n"), z), J === ye.at && Jt.setAttribute("aria-current", "step"), Jt;
    })), wn.textContent = ye.caption, wn.className = "ppp-stage " + (ye.at >= eu(f.solo).length ? "ppp-ok" : ye.blocked ? "ppp-bad" : "ppp-cyan"));
    const Wn = n(".ppp-facts"), me = [];
    f.main && ((Gs = f.gate) != null && Gs.here) && !f.solo && me.push(...Ct("Your wallet", B(f.main), "ppp-addr-short"));
    const cr = () => {
      if (!f.listening) return;
      const z = ci("copy-listening", "Copy", () => f.listening || "", "tiny", () => Tt(o.snapshot()));
      me.push(...Ct(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", x(f.listening), "ppp-addr-short", z));
    };
    if (f.linked || cr(), f.listening && f.step !== "intro")
      if (f.linked)
        me.push(...Ct("Credited to", `${B(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), cr();
      else if (f.solo) {
        f.creditedTo && me.push(...Ct("Credited to", `${B(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${B(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        me.push(...Ct("Returns go to", f.gift ? z : f.returnTo && !E(f.returnTo) ? z.replace(x(f.returnTo), f.returnTo) : z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else me.push(...Ct("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Ks = f.gate) != null && Ks.here)) {
      const z = f.linkedListening.map((J) => x(J) + (J === f.listening ? " (this one)" : "")).join(", ");
      me.push(...Ct(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      me.push(...Ct("Balance", `${xn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, z));
    }
    const We = f.entries.find((z) => z.kind === "play");
    We && ie(), We && me.push(...Ct("Last paid song", `${M(We)} → ${B(We.recipient)}`, ht[We.status] || "")), Wn.replaceChildren(...me), Wn.hidden = !me.length;
    const gt = [], kt = [], oe = [], an = [], Pt = sr(BigInt(((ve = f.gate) == null ? void 0 : ve.limits.playFee) ?? "300")), Ae = `Each song you listen to for 30 seconds sends ${xn(Zl)} STX to whoever holds it, plus a ${xn(Pt - Zl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, lr = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (gt.push(p("p", "Pay artists as you listen.")), (Vs = f.gate) != null && Vs.radioUrl) {
          const J = p("p");
          J.append($("Open the pay-per-play radio →", f.gate.radioUrl)), gt.push(J);
        }
        kt.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const J = [f.linked, ...f.others];
          gt.push(p("p", J.length > 1 ? `This device has listening wallets for ${nt(J)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${B(f.linked)}. Connect that wallet to keep paying artists.`)), kt.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          gt.push(p("p", "Connect your wallet to pay artists as you listen.")), kt.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        gt.push(p("p", `This device's listening wallet belongs to ${B(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), kt.push(p("p", `You are connected as ${B(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), kt.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), oe.push(I("Switch wallet", () => {
          var J;
          return (J = document.getElementById("radio-wallet-connect")) == null ? void 0 : J.click();
        }, "primary"));
        break;
      case "not-invited":
        gt.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        gt.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        gt.push(p("p", `Pay artists ${xn(Pt)} STX a song as you listen.`)), kt.push(p("p", Ae)), kt.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), kt.push(p("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (gt.push(p("p", `This device already has a listening wallet for ${nt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), kt.push(p("p", `Otherwise, set up a new listening wallet for ${B(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && kt.push(p("p", `This is the listening wallet for ${B(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && kt.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const z = a.liveGift();
        oe.push(I(z ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${B(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !z && !f.solo && f.main && f.others.length && oe.push(I("Switch wallet", () => {
          var J;
          return (J = document.getElementById("radio-wallet-connect")) == null ? void 0 : J.click();
        })), !z && f.solo && oe.push(I("I have a Stacks wallet", () => {
          var J;
          return (J = document.getElementById("radio-wallet-connect")) == null ? void 0 : J.click();
        })), oe.push(I("I already have a listening wallet", () => void o.unlock(!0))), z && oe.push(I("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (gt.push(p("p", "Locked.", "ppp-mute")), oe.push(I(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), an.push(I("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        gt.push(p("p", `Link to ${B(f.main)} · free`)), kt.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), kt.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), oe.push(I(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        gt.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || ((Yr = f.gift) != null && Yr.player ? gt.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? gt.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : gt.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Pt)).toLocaleString()} songs`))), (qs = f.gift) != null && qs.player ? kt.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && kt.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && kt.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m || (f.solo ? (kt.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), kt.push(p("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && oe.push(ci("copy-address", "Copy my address", () => f.listening || "", "primary", () => Tt(o.snapshot())))) : kt.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const J = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          J.append($("View", H(f.depositTxid))), gt.push(J);
        } else f.allowance > 0n && !f.solo && oe.push(I(`Deposit ${xn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        gt.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (gt.push(p("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), gt.push(Me(f))), (!f.solo || f.returnTo) && oe.push(I("Return excess", () => void o.returnFunds("excess"), "primary"), I("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const J = Math.min(f.session.playsLeft, f.playsLeft);
          gt.push(p("p", `Paying as you listen · up to ${J.toLocaleString()} plays left`, "ppp-ok")), kt.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), oe.push(I("Switch off", () => void o.switchOff()));
        } else
          gt.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), oe.push(I("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && gt.push(p("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && gt.push(p("p", "Running low · top up", "ppp-warn")), f.depositPending ? gt.push(p("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && oe.push(I(`Top up ${xn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && kt.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && kt.push(Me(f)), kt.push(q()), f.slot === 0 && f.step === "ready" && f.entries.some((z) => z.kind === "play" && z.status === "confirmed"))) {
      const z = p("p", "New to Stacks? ", "ppp-mute");
      z.append($("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), gt.push(z);
    }
    if (f.walletOutdated && kt.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (gt.push(p("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), oe.push(I("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && an.push(I(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${B(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((fr = f.gift) != null && fr.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && an.push(ot(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && an.push(I("Lock", () => void o.lock(), "quiet")), fe && !_t && an.push(I(G ? "Hide listening wallet box" : "Show listening wallet box", () => {
      G = !G, Tt(o.snapshot());
    }, "quiet")), [...oe, ...an].forEach((z) => z.disabled = lr), lr && (oe.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((dr = f.gift) != null && dr.player)) {
      const z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", J = gt.at(0);
      f.step === "ready" && J ? J.append(p("span", ` · ${L(f.balance)} STX`, z)) : gt.push(p("p", `Balance ${L(f.balance)} STX`, z));
    }
    if ((Xe = f.gift) != null && Xe.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const z = p("p", "", "ppp-gift");
      z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && z.append(" · ", f.gift.player.subtitle);
      const J = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? p("span", " · plays on their way", "ppp-warn") : p("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      J && z.append(J);
      const Jt = (hr = gt.at(0)) == null ? void 0 : hr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Jt && /STX/.test(Jt.textContent ?? "") && Jt.remove(), gt.unshift(z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          gt.splice(1, 0, p("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ot(f, "primary"));
        else {
          const ae = p("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ae.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ae.append($("Xverse", "https://www.xverse.app/download"), " and ", $("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), gt.splice(1, 0, ae);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const z = f.returnPlan, J = p("div", "", "ppp-pick");
      J.append(p("p", z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Jt = p("ul", "", "ppp-gift-list");
      z.steps.forEach((ae, Jr) => {
        const Cn = ae.kind === "gift" ? "the unused gift" : ae.kind === "deposit" ? "what was added to it" : "the rest", Zt = p("li");
        Zt.append(p("span", `${Jr + 1}. ${xn(BigInt(ae.send))} STX · ${Cn}`, "t"), p("span", ae.to ? ` → ${B(ae.to)}` : " → choose an address below", ae.to ? "ppp-mute" : "ppp-warn")), Jt.append(Zt);
      }), J.append(Jt), z.kept && J.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), z.steps.some((ae) => !ae.to) && J.append(Me(f)), J.append(I(z.steps.length > 1 ? `Confirm part 1 of ${z.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), gt.push(J);
    }
    gt.unshift(...a.banner(w)), gt.unshift(...Mt(f)), T && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) && gt.unshift(...N(T, a.pendingCode())), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && gt.unshift(p("p", `This is ${B(f.creditedTo)}'s listening wallet. Plays and likes count for ${B(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...gt);
    const De = document.querySelector(".ppp-switch");
    if (De) {
      const z = c.latest(), J = f.slot > 0, Jt = ["fund", "ready", "over"].includes(f.step) && (J || !!z);
      if (De.hidden = !Jt, Jt) {
        const ae = (Cn, Zt, Hi, Oi) => {
          const bn = I("", Oi, "ppp-tab");
          return bn.setAttribute("aria-pressed", String(Hi)), bn.append(p("span", Cn, "tt"), p("span", Zt === void 0 ? "…" : `${L(Zt)} STX`, "ts")), bn.disabled = !!f.busy, bn;
        }, Jr = J ? ((pr = (Zr = f.gift) == null ? void 0 : Zr.player) == null ? void 0 : pr.title) ?? "Album" : z.title;
        De.replaceChildren(
          ae("🎧 My player", J ? (Qr = f.likeFunds) == null ? void 0 : Qr.balance : f.balance, !J, () => {
            J && o.openAlbum(0);
          }),
          ae("💿 " + Jr, J ? f.balance : void 0, J, () => {
            !J && z && o.openAlbum(z.slot);
          })
        );
      }
    }
    const Xn = c.render(f), Fe = document.querySelector(".ppp-shelf");
    if (Fe) {
      Fe.hidden = !Xn;
      const z = Fe.querySelector("summary");
      z && (z.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const J = Fe.querySelector(".ppp-shelf-body");
      Xn && J && !J.contains(Xn) && J.replaceChildren(Xn);
    }
    const cn = a.renderFold(w);
    if (n(".ppp-gifts").hidden = !cn, cn && !n(".ppp-gift-body").contains(cn) && n(".ppp-gift-body").replaceChildren(cn), cn && W) {
      W = !1;
      const z = n(".ppp-gifts");
      z.open = !0, requestAnimationFrame(() => z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...kt), n(".ppp-actions").replaceChildren(...oe), n(".ppp-actions2").replaceChildren(...an);
    const je = f.busy || f.message || "", ur = n(".ppp-msg"), Ce = je && gt.some((z) => (z.textContent ?? "").startsWith(je.replace(/[.✓\s]+$/, ""))) ? "" : je, zs = !Ce && !f.error ? f.notice : "";
    ur.textContent = Ce || zs, ur.classList.toggle("is-warn", !!zs), n(".ppp-err").textContent = f.error;
    const Pi = f.entries.filter((z) => z.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...Pi.slice(0, 5).map((z) => {
      const J = p("li"), Jt = z.status === "confirmed" ? "ok" : z.status === "failed" ? "bad" : "warn";
      return J.append(p("span", "", "d " + Jt), p("span", M(z), "t"), p("span", F(z.created), "ppp-mute")), z.txid && J.append($("tx", H(z.txid))), J;
    })), n(".ppp-wallets").hidden = !(Wn.childElementCount || an.length), n(".ppp-more").hidden = !kt.length;
    const Rs = n(".ppp-history");
    Rs.hidden = !f.entries.length, f.entries.length && ie(), Rs.replaceChildren(p("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((z) => {
      const J = p("div", "", "ppp-row"), Jt = z.kind === "play" ? [p("span", M(z), "ppp-song"), p("span", ` · ${xn(BigInt(z.amount))} STX to ${B(z.recipient)}`, "ppp-mute")] : z.kind === "like" ? [p("span", `${z.liked ? "♥ Liked" : "Unliked"} ${M(z)}`, "ppp-song"), p("span", ` · for ${f.linked ? B(f.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${xn(BigInt(z.amount))} STX`, "ppp-song"), p("span", ` to ${B(z.recipient)}`, "ppp-mute")];
      return J.append(
        p("span", $t[z.status] || z.status, "ppp-status " + (ht[z.status] || "")),
        ...Jt,
        p("span", ` · ${new Date(z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), z.txid && J.append($("tx ↗", H(z.txid))), J;
    }));
  }
  const Nt = /* @__PURE__ */ new Map(), ut = () => {
    const w = window.XtrataRadio;
    return w != null && w.subscribe ? (w.subscribe((m) => {
      const f = m == null ? void 0 : m.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Nt.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!ut()) {
    const w = setInterval(() => {
      ut() && clearInterval(w);
    }, 500);
    setTimeout(() => clearInterval(w), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (w) => {
    const m = w.detail;
    if (m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      ie();
      const f = v(m.song, Nt.get(m.song));
      o.onListened({ song: m.song, id: m.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Q5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", J5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, t$ = () => J5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, e$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, n$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Uy = class {
  constructor(t) {
    H4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && rx(t), this.callback(Qa(t));
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
    var r, i, s, o, a, c, u, d, l, y;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = t$(), e = e$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return yt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, yt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), yt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, yt("div", { class: "flex flex-col space-y-[10px]" }, yt("div", { class: "flex items-center" }, yt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), yt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, yt("span", { class: "sr-only" }, "Close popup"), yt("img", { src: Q5 }))), r ? yt("p", null, "Select the wallet you want to connect to.") : yt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && yt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && yt("div", { class: "mt-6" }, yt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), yt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => yt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, yt("div", { class: "aspect-square basis-9 overflow-hidden" }, yt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), yt("div", { class: "flex-1" }, yt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && yt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), yt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && yt("div", { class: "mt-6" }, r ? yt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : yt("div", { class: "mb-5 flex justify-between" }, yt("p", { class: "text-sm font-medium" }, "Recommended wallets"), yt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, yt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, yt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), yt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), yt("p", null, "What is a wallet? ", yt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), yt("ul", { class: "space-y-3" }, n.map((s) => yt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, yt("div", { class: "aspect-square basis-9 overflow-hidden" }, yt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), yt("div", { class: "flex-1" }, yt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && yt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && yt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return b4(this);
  }
};
Uy.style = n$;
const r$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Uy
}, Symbol.toStringTag, { value: "Module" }));
